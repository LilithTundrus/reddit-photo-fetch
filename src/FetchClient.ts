// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';

// Used to get the typings for snoowrapperInstance
import * as snoowrap from 'snoowrap';
// Used for GET tasks for the fetchClient
import * as request from 'request-promise';

request.defaults({ encoding: null });

export default class ReditFetchClient {

    // Base URL for fetching reddit data
    private wrapper: snoowrap;
    private downloadDirectory: string;
    // TODO: Add typings to this
    private configJSON: any;
    private configFileDirectory: string;

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
            throw new Error(`${configFileDirectory} is not a valid directory to write to.`);
        }
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
        How the actual code would work:
        Take the array, match each subreddit URL to the currently indexed subreddits
        If a subreddit is new, just get the first page of images/links
        Else, if the subreddit is already registered, just run a diff check on the links
        for each new link, download the image/file
        */
        let promiseChain = Promise.resolve();

        this.configJSON.subreddits.forEach((subreddit) => {

            promiseChain = promiseChain.then(() => {
                console.log(subreddit);
                // Get the subreddit's FIRST 50 of newest content
                let getNewOptions: any;
                getNewOptions = { limit: 25 };

                let urls = this.wrapper.getSubreddit(subreddit).getNew(getNewOptions).map((entry) => {
                    // TODO: Support more formats!!
                    // First, make sure the URL is a supported image format
                    if (entry.url.includes('.jpg') || entry.url.includes('.png')) {
                        return entry.url;
                    } else {
                        // Debugging
                        console.log('Invalid image link: ' + entry.url);
                    }
                });

                // If the subreddit is not yet registered, this will do so
                if (!this.getSubredditPostIndex(subreddit)) {
                    this.addRegisteredSubreddit(subreddit);
                }

                // urls.forEach((url) => {
                //     // Check if the currently iterated subreddit is indexed
                //     if (this.getSubredditPostIndex(subreddit) !== undefined) {
                //         console.log(url)
                //         // Check if the current URL exists in the array
                //         // Update the index


                //         // Get each image and download it
                //         //return this.downloadImage(entry.url, this.downloadDirectory + entry.url.split('/')[entry.url.split('/').length - 1]);
                //     } else {
                //         // Create the index and save it
                //     }
                // });
            })
        });
        return promiseChain;
    }

    // This works on all images/binary files (I hope)
    downloadImage(uri, filename) {
        return new Promise((resolve, reject) => {
            // Really not sure what this is ued for but I think it's requesting things in a very special way
            request.head(uri, function (err, res, body) {
                if (res.body) {
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

    addRegisteredSubreddit(newSubredditName) {
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

    updateSubredditPostIndex(subredditName: string, newPostIndex: string[]) {
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
}