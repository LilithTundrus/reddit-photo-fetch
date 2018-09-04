// Using ES5 strict mode
'use strict';

// Used to get the typings for snoowrapperInstance
import * as snoowrap from 'snoowrap';
export default class ReditFetchClient {

    // Base URL for fetching reddit data
    private wrapper: snoowrap;

    constructor(snooWrapperInstance) {
        this.wrapper = snooWrapperInstance;
    }

    // Test method
    getWrapper() {
        return this.wrapper;
    }

    test() {
        this.wrapper.getSubreddit('ArousingAvians').getNew().map((entry) => {
            console.log(entry)
        })
    }


    // This class will also help with doing stuff like checking if a post/image is
    // new to the script/etc.

}