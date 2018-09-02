// Using ES5 strict mode
'use strict';

export default class ReditFetchClient {

    // Base URL for fetching reddit data
    private baseFetchURL: string;
    private userAgent: string

    constructor(baseFetchURL: string, userAgent: string) {
        this.baseFetchURL = baseFetchURL;
    }

    getSubreddit(options) {
        console.log(options);
    }
}