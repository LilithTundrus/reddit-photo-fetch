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



### Getting an Oauth Token and Refresh Token

1. Once you h


### Setting up an OAuth2 Server (Node.js)

Prerequisates:
- You will need a domain name and DNS service for creating an Oauth server
- You will need HTTPS certs using a free service like [Let's Encrypt](https://letsencrypt.org/) you can follow guide [Here]
- To get the most basic of OAuth certs, follow the steps below:

1. Create a directory called `oauthserve`
2. Navigate to the directory and create the folders `static` and `sslcert`
3. Put your HTTPS tokens/certs in the `sslcert` folder