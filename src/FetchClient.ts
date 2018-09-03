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


}