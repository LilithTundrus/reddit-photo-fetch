// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';
import ReditFetchClient from './FetchClient';
// Dirty import of the Reddit API wrapper because its typings aren't correct
const snoowrap = require('snoowrap');

// Import any needed intefaces
import { fetchConfig } from './interfaces';

// Options for the reddit client, contains the API plus subreddit config options
let configOptions = readConfigFile();
// Parse the config file options safely
const parsedConfigOptions: fetchConfig = parseCondigJSONFromString(configOptions);

// Snoowrap reddit API wrapper handles a lot of stuff for us (like token refreshing)
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

// Template for creating a new fetchclient in the code below
let rfc: ReditFetchClient;

// TODO: Fix some files getting corrupted!

// If there's an argument present (ignoring the first 2 indeces of `node` and `index.js`)
if (process.argv[2]) {
    // Make sure that the directory exists
    if (fs.existsSync(process.argv[2])) {
        console.log(`Using ${process.argv[2]} as the directory to write new photos to.`);
        rfc = new ReditFetchClient(wrapper, process.argv[2], parsedConfigOptions, '../config.json');
    } else {
        console.log(`Error: ${process.argv[2]} is not a valid directory`);
        process.exit(1);
    }
} else {
    rfc = new ReditFetchClient(wrapper, './staging/', parsedConfigOptions, '../config.json');
}

rfc.getNewRedditURLs();


// Helper functions

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
function parseCondigJSONFromString(fileString: string): fetchConfig {
    // Try to parse the contents
    try {
        return JSON.parse(fileString);
    } catch (e) {
        console.log('Could not parse JSON from given file string');
        return process.exit(1);
    }
}