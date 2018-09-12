# Reddit Photo Fetch

For now, if you want any info on the project's progression, see the [Design Doc](./design-doc.md)


## Getting Started with Reddit's API + HTTPS + Oauth2


### Creating a Reddit 'App'


Prerequisates:
- You __MUST__ have a server that can relay OAuth2 tokens using HTTPS (See below for a guide with node.js)

1. Read the [Reddit API Guide ](https://github.com/reddit-archive/reddit/wiki/API)
2. Go to the [Apps](https://www.reddit.com/prefs/apps/) section of your preferences and select `Create an App`
3. Give the app a name + description and select the Application type `Script`
4. Add an about URL as well as a redirect URI __(This is where your oauth token verifications will be send)__
5. Once you app is set up, save your Client ID (below the name) and the Client Secret



### Getting an Oauth Token and Refresh Token for Script-type reddit apps

1. Creat an authorization URL for your app for __implicit grants__: `https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING`. Example being `https://www.reddit.com/api/v1/authorize?client_id=MY_CLIENT_ID&response_type=code&state=1234&redirect_uri=URI&duration=DURATION&scope=read`
2. Use this link yourself and allow the application access through the reddit prompt
3. Once you have the oauth server set up to accept requests (See below, most logic is there but not all depending on how your app/reddit client works), you will receive a GET request with an authorization code as a query parameter
4. 


### Setting up an OAuth2 Server (Node.js)

Prerequisates:
- You will need a domain name and DNS service for creating an Oauth server
- You will need HTTPS certs using a free service like [Let's Encrypt](https://letsencrypt.org/) you can follow guide [Here](https://medium.com/@yash.kulshrestha/using-lets-encrypt-with-express-e069c7abe625)
- Make sure your firewall is allowting TCP traffic on port 80, 8080 and 443
- To get the most basic of OAuth certs, follow the steps below:

1. Create a directory called `oauthserve`
2. Navigate to the directory and create the folders `static` and `sslcert`
3. Put your HTTPS tokens/certs in the `sslcert` folder
4. Open the folder `oauthserve` in your terminal
5. Run `npm init` and go through the guided steps
6. Type `npm install --save express` and let the package install
7. Use the code below to accept oauth tokens from your domain:

```javascript
// filename: app.js
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

// Set up express server here
const options = {
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
};
// This is the endpoint to poll for checking if the server is working properly
app.get('/health-check', (req, res) => res.sendStatus(200));

// This is where the oauth redirect URL handling goes
app.get('/oauth', (req, res) => {
    // The URL has the token that must be used in a GET request to complete the oauth handshake
    console.log(req.url);
    // Be sure to create a 'state' for this request so you can be sure the one you send is the one you get
    res.sendStatus(200);
});

app.listen(8080);
https.createServer(options, app).listen(443);
```
8. Save the file as `app.js` in the `oauthserver` folder
9. In the same directory, run the script by typing `node app.js`
10. The app should now be running and accepting GET requests