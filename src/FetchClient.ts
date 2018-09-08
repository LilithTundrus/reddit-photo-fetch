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

    // Test method
    getWrapper() {
        return this.wrapper;
    }

    // Another test method

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

            let getNewOptions: any;
            getNewOptions = { limit: 25 }
            this.wrapper.getSubreddit(subReddit).getNew(getNewOptions).map((entry) => {
                console.log(entry.url);
            });
            // Get the subreddit's FIRST PAGE of newest content
            // TODO: If there's more than one page, set something like a hard limit of 50
        });
    }

    // This works on all images/binary files (I hope)
    downloadImage(uri, filename) {
        return new Promise((resolve, reject) => {
            // Really not sure what this is ued for but I think it's requesting things in a very special way
            request.head(uri, function (err, res, body) {
                if (res.body) {
                    return reject('Response had a body (Not a raw image), use PH to parse for images');
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

}