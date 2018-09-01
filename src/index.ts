// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';
import ReditFetchClient from './FetchClient';

// Options for the reddit client, contains the API plus subreddit config options
// TODO: add typings for this
const configOptions = require('../config.json');

let client = new ReditFetchClient('reddit.com/', '');

client.getSubreddit('Test')