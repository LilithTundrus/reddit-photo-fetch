// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';
import ReditFetchClient from './FetchClient';

// Options for the reddit client, contains the API plus subreddit config options
// TODO: add typings for this
const configOptions = fs.readFileSync('../config.json').toString();
const parsedConfigOptions = JSON.parse(configOptions);

// TODO: just use snoo instead of using our own thing

let client = new ReditFetchClient('reddit.com/', '');

let authorizationURL: string = `${parsedConfigOptions.redditBaseURL}`;

let testURL = `https://www.reddit.com/api/v1/authorize?client_id=${parsedConfigOptions.redditClientID}&response_type=code&state=1234&redirect_uri=${parsedConfigOptions.redditRedirectURL}&duration=permanent&scope=read`;

client.getSubreddit(testURL)