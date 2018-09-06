// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';
import ReditFetchClient from './FetchClient';
// Dirty import of the Reddit API wrapper because its typings aren't correct
const snoowrap = require('snoowrap');


// Options for the reddit client, contains the API plus subreddit config options
// TODO: add typings for this
let configOptions: string;

if (fs.existsSync('../config.json')) {
    let rawConfigOptions = fs.readFileSync('../config.json');
    configOptions = rawConfigOptions.toString();
} else {
    console.log('Error: Could not find config file (../config.json or ./config.json');
    process.exit(1);
}

// Try to parse the contents
const parsedConfigOptions = JSON.parse(configOptions);


// This handles a lot of stuff for us (like token refreshing)

let wrapper = new snoowrap({
    // Custom required useragent string for any Reddit project
    userAgent: parsedConfigOptions.redditUserAgent,
    // ID of the 'Application' -- pulled from the Reddit Applications panel
    clientId: parsedConfigOptions.redditClientID,
    // Secret key for the Reddit porject
    clientSecret: parsedConfigOptions.redditSecret,
    // Refresh token for your project
    refreshToken: parsedConfigOptions.redditRefreshToken
});

let rfc = new ReditFetchClient(wrapper);

rfc.test();