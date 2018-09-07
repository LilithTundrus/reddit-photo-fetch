// Using ES5 strict mode
'use strict';

// Used to get the typings for snoowrapperInstance
import * as snoowrap from 'snoowrap';
// Used for GET tasks for the fetchClient
import * as request from 'request-promise';

export default class ReditFetchClient {

    // Base URL for fetching reddit data
    private wrapper: snoowrap;
    private downloadDirectory: string;

    constructor(snooWrapperInstance, downloadDirectory) {
        this.wrapper = snooWrapperInstance;
        this.downloadDirectory = downloadDirectory;
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

    // Attempt to dowload a .jpg image from a given URL
    private downloadJPG() {

    }


    // This class will also help with doing stuff like checking if a post/image is
    // new to the script/etc.

}