// Using ES5 strict mode
'use strict';

// NOTE: This is just an example of a server to accept the oauth incoming requests
// The process to achieve this will be written later.

// Node/NPM requires and imports
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

// Set up express server, using the HTTPS cert keys (needed for oauth)
const options = {
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
};

// Endpoint to make sure the server is working
app.get('/health-check', (req, res) => res.sendStatus(200));

// VERY basic function to handle incoming oauth requests
// TODO: rewrite this to actually do something useful
app.get('/oauth', (req, res) => {
    console.log(req.url)
    res.sendStatus(200);
});

// Listen on both https and http
app.listen(8080);
https.createServer(options, app).listen(443);