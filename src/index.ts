// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';
import ReditFetchClient from './FetchClient';
// Dirty import of the Reddit API wrapper because its typings aren't correct
const snoowrap = require('snoowrap');

// Options for the reddit client, contains the API plus subreddit config options
let configOptions = readConfigFile();
const parsedConfigOptions = parseCondigJSONFromString(configOptions);

// This handles a lot of stuff for us (like token refreshing)
let wrapper = new snoowrap({
    // Custom required useragent string for any Reddit project
    userAgent: parsedConfigOptions.redditUserAgent,
    // ID of the 'Application' (pulled from the Reddit Applications panel)
    clientId: parsedConfigOptions.redditClientID,
    // Secret key for the Reddit porject
    clientSecret: parsedConfigOptions.redditSecret,
    // Refresh token for the project
    refreshToken: parsedConfigOptions.redditRefreshToken
});

// TODO: Have the download dir be either configurable or a CLI argument
let rfc = new ReditFetchClient(wrapper, './test/', parsedConfigOptions, '../config.json');

rfc.getNewRedditURLs();

// rfc.parseImgurImageFromLink('https://imgur.com/gallery/UP9xEfG') 


// Helper functions go here

/** Read the config file for the script/project
 * @returns {string}
 */
function readConfigFile(): string {
    if (fs.existsSync('../config.json')) {
        let rawConfigOptions = fs.readFileSync('../config.json');
        return rawConfigOptions.toString();
    } else {
        console.log('Error: Could not find config file (../config.json or ./config.json');
        // Exit on this error, since the file is needed
        return process.exit(1);
    }
}

/** Parse the config JSON from the string from the `readConfigFile()` function
 * @param {string} fileString
 * @returns {object}
 */
// TODO: add typings for thiss
function parseCondigJSONFromString(fileString: string): any {
    // Try to parse the contents
    try {
        return JSON.parse(fileString);
    } catch (e) {
        console.log('Could not parse JSON from given file string');
        return process.exit(0);
    }
}