// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';
import ReditFetchClient from './FetchClient';
// Dirty import of the Reddit API wrapper because its typings aren't correct
const snoowrap = require('snoowrap');


// Options for the reddit client, contains the API plus subreddit config options
// TODO: add typings for this
const configOptions = fs.readFileSync('../config.json').toString();
const parsedConfigOptions = JSON.parse(configOptions);

let wrapper = new snoowrap({
    userAgent: parsedConfigOptions.redditUserAgent,
    clientId: parsedConfigOptions.redditClientID,
    clientSecret: parsedConfigOptions.redditSecret,
    refreshToken: parsedConfigOptions.redditRefreshToken
});

let rfc = new ReditFetchClient(wrapper);

// Printing a list of the titles on the front page
// wrapper.getSubreddit('ArousingAvians').getNew().map(post => post.title).then(console.log);


rfc.test()

// refreshToken(parsedConfigOptions, null, parsedConfigOptions.redditRefreshToken, (data) => {
    // Refresh the token using the information

//     console.log(data)
//     console.log(2)
// })


// Write the new token to file

// Do what we need here