// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';

// Used to get the typings for snoowrapperInstance
import * as snoowrap from 'snoowrap';
// Used for GET tasks for the fetchClient
import * as request from 'request-promise';

request.defaults({ encoding: null })

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

    // Test method
    test() {
        // Since the typings for snoowrap are a bit off, this object needs to be created
        let getNewOptions: any;
        getNewOptions = { limit: 5 }
        this.wrapper.getSubreddit('ArousingAvians').getNew(getNewOptions).map((entry) => {
            console.log(entry.url);
        })
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

        this.configJSON.subreddits.forEach((subReddit) => {
            console.log(subReddit);
            // Get the subreddit's FIRST 50 of newest content
            let getNewOptions: any;
            getNewOptions = { limit: 25 };
            this.wrapper.getSubreddit(subReddit).getNew(getNewOptions).map((entry) => {
                // For each of these entries, make sure that the file is new
                console.log(entry.url);
                if (entry.url.includes('.jpg') || entry.url.includes('.jpg')) {
                    return this.downloadImage(entry.url, this.downloadDirectory + entry.url.split('/')[entry.url.split('/').length - 1]);
                }
            })
        });
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

    getSubredditPostIndex(subRedditName: string) {
        // Check if a postIndex from the config file for a subreddit already exists
    }

    updateConfigSubredditPostIndex(subRedditName: string) {
        // Find the given array of posts in the config JSON

        // If it doesn't exist, create it

        // Update it and write it to file
    }

}