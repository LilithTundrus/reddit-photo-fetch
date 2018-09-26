// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';
// Used to get the typings for snoowrapperInstance
import * as snoowrap from 'snoowrap';
// Used for GET tasks for the fetchClient
import * as request from 'request-promise';
// For traversing html documents to grab image links from (Basically jquery for Node.js)
import * as cheerio from 'cheerio';
// Imgur API interactions wrapper
import ImgurWrapper from './imgurWrapper';

// Import any needed intefaces
import { fetchConfig } from './interfaces';

// Ensures request does not use a default encoding for GET operations 
request.defaults({ encoding: null });

export default class ReditFetchClient {
    // Wrapper fetching reddit data
    private wrapper: snoowrap;
    // Directory to download images/videos to
    private downloadDirectory: string;
    // JSON config file needed for some secrets and private settings (typed)
    private configJSON: fetchConfig;
    // Directory of the config file (Since it needs to be written to)
    private configFileDirectory: string;
    // Wrapper for any imgur images that are not direct links
    private imgurWrapper: ImgurWrapper;

    constructor(snooWrapperInstance: snoowrap, downloadDirectory: string, configJSON: fetchConfig, configFileDirectory: string) {
        this.wrapper = snooWrapperInstance;
        this.downloadDirectory = downloadDirectory;
        this.configJSON = configJSON;
        this.configFileDirectory = configFileDirectory;

        // If the directory to write downloaded files to does not exist, throw an error
        if (!fs.existsSync(this.downloadDirectory)) {
            throw new Error(`${downloadDirectory} is not a valid directory to write to.`);
        }

        // If the location for the config file does not exist, throw an error
        if (!fs.existsSync(this.configFileDirectory)) {
            throw new Error(`${configFileDirectory} is not a valid config file to write to.`);
        }

        // Create an instance of the imgurWrapper
        this.imgurWrapper = new ImgurWrapper(this.configJSON.imgurBaseURL, this.configJSON.imgurClientID);
    }

    /** Get the class's instance of Snoowrap
     * @returns {snoowrap}
     * @memberof ReditFetchClient
     */
    getWrapper() {
        return this.wrapper;
    }

    /** Get the new Reddit URLs from the class's config file instance and download them
     * @returns void
     * @memberof ReditFetchClient
     */
    getNewRedditURLs() {
        /* 
        Take the array, match each subreddit URL to the currently indexed subreddits
        If a subreddit is new, just get the first page of images/links
        Else, if the subreddit is already registered, just run a diff check on the links
        for each new link, download the image/file
        */

        // Promise chain to attach each subreddit check to ( needed since each check is async)
        let promiseChain = Promise.resolve();

        // Iterate through each subreddit in the config file
        this.configJSON.subreddits.forEach((subreddit) => {
            promiseChain = promiseChain.then(() => {
                // TODO: Make sure the array doesn't become bloated (more than 50)

                // Get an array of URLs from each post
                return this.parseUrlsFromPosts(subreddit).then((urls) => {
                    return urls;
                })
            })
                // The argument `urls` is an any due to a weird promise chaining issues
                // TODO: resolve this!
                .then((urls: any) => {
                    let subredditPostIndex = this.getSubredditPostIndex(subreddit);

                    urls.forEach((url) => {
                        // TODO: If the URL is a gyfcat URL, call the custom function

                        // Get the currently iterated subreddit's index of urls
                        if (subredditPostIndex.lastPolledPosts.includes(url)) {
                            // URL is not new, skip
                            return;
                        } else {
                            // Update the array for the current subreddit with the current URL
                            subredditPostIndex.lastPolledPosts.push(url);

                            // Get the image and download it, spliting the URL by its forward slash to get a valid filename
                            let splitURLName = url.split('/');
                            let filename: string = splitURLName[splitURLName.length - 1];

                            console.log(`Downloading image: ${url} as ${filename}`);


                            // Download the image, sending the filename as a legal file that can be written
                            return this.downloadImage(url, this.downloadDirectory + filename.replace(/[|?&;$%@"<>()+,]/g, ""));
                        }
                    });
                    this.updateSubredditPostIndex(subreddit, subredditPostIndex.lastPolledPosts);
                })
        });
        // Return the chain of promises
        return promiseChain;
    }

    getSubbredditImages(subreddit, subFolder: string, limit: number) {
        // For using later to generate a 'backlog' of images
    }

    // TODO: this should make sure that no files are being overwritten!!!
    /** Download a binary file from a URL and save it to a given path
     * @param {*} uri 
     * @param {*} filename
     * @returns `Promise<string>`
     * @memberof ReditFetchClient
     */
    downloadImage(uri, filename) {
        return new Promise((resolve, reject) => {
            // Really not sure what this is ued for but I think it's requesting things in a very special way
            request.head(uri, function (err, res, body) {
                if (res.body) {
                    // TODO: Update this message
                    return reject('Response had a body (Not a raw image), use downloadGyfcatVideo() or PH to parse for images');
                }

                request.get(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
                    return resolve('File saved');
                });
            });
        })
    };

    downloadGyfcatVideo() {
        // Parse a gyfcat for the mp4 URL to download
    }

    getSubredditPostIndex(subredditName: string) {
        // Check if a postIndex from the config file for a subreddit already exists
        return this.configJSON.registeredSubreddits.find((entry) => {
            return entry.name === subredditName;
        });
    }

    private addRegisteredSubreddit(newSubredditName) {
        // Sanity check
        let matchedRegisteredSubreddit = this.configJSON.registeredSubreddits.find((entry) => {
            return entry.name === newSubredditName;
        });
        if (matchedRegisteredSubreddit) {
            return;
        }

        this.configJSON.registeredSubreddits.push({
            "name": newSubredditName,
            "lastPolledPosts": []
        });
        fs.writeFileSync(this.configFileDirectory, JSON.stringify(this.configJSON, null, 2));
    }

    private updateSubredditPostIndex(subredditName: string, newPostIndex: string[]) {
        // Find the given array of posts in the config JSON
        let matchedRegisteredSubreddit = this.configJSON.registeredSubreddits.find((entry) => {
            return entry.name === subredditName;
        });
        // If it doesn't exist, create it (maybe)? --should just sanity check it
        matchedRegisteredSubreddit.lastPolledPosts = newPostIndex;

        this.configJSON.registeredSubreddits[subredditName] = matchedRegisteredSubreddit;

        // Update it and write it to file
        fs.writeFileSync(this.configFileDirectory, JSON.stringify(this.configJSON, null, 2));
    }

    private async parseUrlsFromPosts(subreddit) {
        // Get the subreddit's FIRST 50 of newest content

        // Declared as an any due to snoowrap having improper typings
        let getNewOptions: any;
        getNewOptions = { limit: 50 };

        let urls = this.wrapper.getSubreddit(subreddit).getNew(getNewOptions).map(async (entry) => {

            // First, make sure the image has at least a few upvotes (configurable)
            if (entry.upvote_ratio < this.configJSON.redditUpvoteThreshold) {
                console.log('Skipped item, not enought upvotes');
                return;
            }
            // Second, make sure the URL is a supported image format
            if (entry.url.includes('.jpg') || entry.url.includes('.png') || entry.url.includes('.jpeg') || entry.url.includes('.gif')) {
                return entry.url;
            } else {
                // This is where each site is handled individually

                // If an Imgur link
                if (entry.url.includes('imgur')) {
                    let parsedUrl = await this.parseImgurImageFromLink(entry.url).then((url) => {
                        return url;
                    })
                        .catch((err) => console.log(err))
                    return parsedUrl;
                } else {
                    console.log('Invalid image link: ' + entry.url);
                }
            }
        });

        // If the subreddit is not yet registered, this will do so
        if (!this.getSubredditPostIndex(subreddit)) {
            this.addRegisteredSubreddit(subreddit);
        }

        // Remove any entries that end up not having a URL
        urls = urls.filter((entry) => {
            return entry !== undefined;
        });

        return urls;
    }

    private checkIfFileExists(filePath: string): boolean {
        if (fs.existsSync(filePath)) return true;
        return false;
    }

    /** Parse a direct image link from an imgur URL
     * @param {string} originalURL
     * @returns `Promise<string>`
     * @memberof ReditFetchClient
     */
    parseImgurImageFromLink(originalURL: string) {
        // Get a post's info, the 'data' promise resolve is `any` due to issues
        // with the request library and typescript thinking the promises are bluebird (not native)
        return this.imgurWrapper.getImgurPostImageLink(originalURL).then((data: any) => {
            let responseData;

            // Make sure the JSON response can actually be parsed
            try {
                responseData = JSON.parse(data);
            } catch (e) {
                console.log(data);
                throw new Error(e);
            }

            return responseData.data.link;
        })
    }
}