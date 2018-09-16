# Reddit Photo Fetch

For now, if you want any info on the project's progression, see the [Design Doc](./design-doc.md)


__NOTE:__ Optionally, you can supply an imgur API client/secret in the config file for getting non-direct imgure links (not linking directly to the imagfe) as this can happen often when images are linked on Reddit

## Getting Started with Reddit's API + HTTPS + Oauth2

The main stumbling block with Reddit's API is that is requires oauth, which isn't simple to understand or to set up if you're relatively new. Hopefully this guide at least points you the right way to get you started!


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
4. With the given code you can make a `POST` request to `https://www.reddit.com/api/v1/access_token` with the __BODY__ (not the query parameters) that looks something like this: `grant_type=authorization_code&code=CODE&redirect_uri=YOUR_OAUTH_URI`. You will also need to use basic HTTP auth in base64 encoding. Below is an example in basic JS for constructing a `request` headers object:

```javascript
    let baseURL = 'https://www.reddit.com/api/v1/access_token';

    let encoding = Buffer.from(`CLIENTID:CLIENTSECRET`).toString('base64');

    let requestOptions = {
        headers: {
            'Authorization': `Basic ${encoding}`
        },
        url: baseURL,
        body: `grant_type=authorization_code&code=CODE&redirect_uri=YOUR_OAUTH_URI` 
```

5. If you get a `200 OK` response back then you can move on to step 6. If not, read the [Reddit API guide](https://github.com/reddit-archive/reddit/wiki/OAuth2) in the section __Retrieving the access token__

A response should look something like this:

```javascript
{
    "access_token": Your access token,
    "token_type": "bearer",
    "expires_in": Unix Epoch Seconds,
    "scope": A scope string,
    "refresh_token": Your refresh token
}
```

6. With this, you will need to get a __refresh token__ to continue accessing the API with that key, you get this refresh token by performing a similar procedure. Check out the __Refreshing the token__ section of [Reddit API guide](https://github.com/reddit-archive/reddit/wiki/OAuth2)
7. After you get the refresh token from the response, you can feed this information into `snoowrap` and get started using the reddit API:

```javascript
let wrapper = new snoowrap({
    // Custom required useragent string for any Reddit project
    userAgent: '',
    // ID of the 'Application' (pulled from the Reddit Applications panel)
    clientId: '',
    // Secret key for the Reddit porject
    clientSecret: '',
    // Refresh token for the project
    refreshToken: ''
});
```
8. Now you're ready to go! :D


### Setting up an OAuth2 Server (Node.js)

Prerequisates:
- You will need a domain name and DNS service for creating an Oauth server
- You will need HTTPS certs using a free service like [Let's Encrypt](https://letsencrypt.org/) you can follow a guide [Here](https://medium.com/@yash.kulshrestha/using-lets-encrypt-with-express-e069c7abe625) for Node.js + HTTPS
- Make sure your firewall is allowing TCP traffic on port 80, 8080 and 443
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