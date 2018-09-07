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

    constructor(snooWrapperInstance, downloadDirectory) {
        this.wrapper = snooWrapperInstance;
        this.downloadDirectory = downloadDirectory;

        // If the directory to write downloaded files to does not exist, throw an error
        if (!fs.existsSync(this.downloadDirectory)) {
            throw new Error(`${downloadDirectory} is not a valid directory to write to.`);
        }
    }

    // Test method
    getWrapper() {
        return this.wrapper;
    }

    // Another test method
    test() {
        this.wrapper.getSubreddit('ArousingAvians').getNew().map((entry) => {
            console.log(entry.url)
        })
    }

    getNewRedditURLs(subReddits: string[]) {
        /* 
        How the actual code would work:
        Take the array, match it to any existing
        */
    }

    // This works on all images/binary files (I hope)

    // TODO: Have this make sure that what URL it's pulling is actually a raw image file
    // If not, call something else to actually get the contents
    downloadImage(uri, filename, callback) {
        // Really not sure what this is ued for but I think it's requesting things in a very special way
        request.head(uri, function (err, res, body) {
            // console.log('content-type:', res.headers['content-type']);
            // console.log('content-length:', res.headers['content-length']);

            request.get(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };

    // This class will also help with doing stuff like checking if a post/image is
    // new to the script/etc.

}