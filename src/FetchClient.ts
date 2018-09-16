// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';
// Used to get the typings for snoowrapperInstance
import * as snoowrap from 'snoowrap';
// Used for GET tasks for the fetchClient
import * as request from 'request';
// For traversing html documents to grab image links from (Basically jquery for Node.js)
import * as cheerio from 'cheerio';
// Imgur API interactions wrapper
import ImgurWrapper from './imgurWrapper';


// Import any needed intefaces
import { fetchConfig } from './interfaces';

// Ensures request does not use a default encoding for GET operations 
request.defaults({ encoding: null });

export default class ReditFetchClient {
    // Base URL for fetching reddit data
    private wrapper: snoowrap;
    private downloadDirectory: string;
    // TODO: Add typings to this
    private configJSON: fetchConfig;
    private configFileDirectory: string;
    private imgurWrapper: ImgurWrapper;

    constructor(snooWrapperInstance, downloadDirectory, configJSON, configFileDirectory) {
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

    getNewRedditURLs() {
        /* 
        Take the array, match each subreddit URL to the currently indexed subreddits
        If a subreddit is new, just get the first page of images/links
        Else, if the subreddit is already registered, just run a diff check on the links
        for each new link, download the image/file
        */

        // Promise chain to attach each subreddit check to
        let promiseChain = Promise.resolve();

        this.configJSON.subreddits.forEach((subreddit) => {
            promiseChain = promiseChain
                .then(() => {
                    // TODO: Make sure the array doesn't become bloated (more than 50)
                    // Get an array of URLs from each post
                    return this.parseUrlsFromPosts(subreddit);
                })
                .then((urls) => {
                    let subredditPostIndex = this.getSubredditPostIndex(subreddit);

                    urls.forEach((url) => {
                        // TODO: If the URL is an imgur URL or a gyfcatURL, call the custom function

                        // Get the currently iterated subreddit's index of urls
                        if (subredditPostIndex.lastPolledPosts.includes(url)) {
                            // URL is not new, skip
                            return;
                        } else {
                            // Update the array for the current subreddit with the current URL
                            subredditPostIndex.lastPolledPosts.push(url);

                            console.log(`Downloading image: ${url}`);
                            // Get the image and download it
                            // Split the URL by its forward slash (to get a valid filename)
                            let splitURLName = url.split('/');
                            return this.downloadImage(url, this.downloadDirectory + splitURLName[splitURLName.length - 1]);
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

    // This works on all images/binary files (Probably)
    /** Download a binary file from a URL and save it to a given path
     * @param {*} uri 
     * @param {*} filename
     * @returns
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

    // This class will also help with doing stuff like checking if a post/image is
    // new to the script/etc.

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

    private parseUrlsFromPosts(subreddit) {
        // Get the subreddit's FIRST 50 of newest content
        let getNewOptions: any;
        getNewOptions = { limit: 50 };

        let urls = this.wrapper.getSubreddit(subreddit).getNew(getNewOptions).map((entry) => {

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
                // if (entry.url.includes('imgur')) {
                //     let parsedUrl = this.parseImgurImageFromLink(entry.url);
                //     return parsedUrl;
                // }

                console.log('Invalid image link: ' + entry.url);
            }
        });

        // If the subreddit is not yet registered, this will do so
        if (!this.getSubredditPostIndex(subreddit)) {
            this.addRegisteredSubreddit(subreddit);
        }

        urls = urls.filter((entry) => {
            return entry !== undefined;
        });

        return urls;
    }

    // TODO: this needs to actually parse an entire album!!
    parseImgurImageFromLink(originalURL: string) {
        return this.imgurWrapper.getImgurPostInfo(originalURL).then((data: any) => {
            let responseData;

            try {
                responseData = JSON.parse(data);
            } catch (e) {
                throw new Error(e);
            }

            return responseData.link;
        })
    }

}