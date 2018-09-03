# Notes

Notes about the project goes here


## Reddit API notes

- Reddit has some rules about their API usage:
    - You MUST use OAuth2 to authenticate for using the Reddit API
    - You cannot make more than 60 requests per minute (One a second)
    - You MUST be aware of the `X-Ratelimit-Used` and `X-Ratelimit-Remaining` headers returned from API calls
    - User-Agent string must be something recognizable and follow this format: `<platform>:<app ID>:<version string> (by /u/<reddit username>)`
    - Generic User-Agents are limited, so using a custom one is basically required


## Project notes

- You will need a server that supports HTTPS to get oauth keys from reddit
- An example server code file is in the project as `tokenServer.ts`
- I'm probably doing something super wrong here (Oauth is weird/annoying)