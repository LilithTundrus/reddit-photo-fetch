// Using ES5 strict mode
'use strict';
// Node/NPM requires and imports

export default class ReditFetchClient {

    private baseFetchURL: string;

    constructor(baseFetchURL: string) {
        this.baseFetchURL = baseFetchURL;
    }
}