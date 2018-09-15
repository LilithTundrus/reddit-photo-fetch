export interface fetchConfig {
    imgurClientID: string,
    imgureSecret: string,
    imgurBaseURL: string,
    redditClientID: string,
    redditRedirectURL: string,
    redditSecret: string
    redditUserAgent: string,
    redditAccessToken: string,
    redditRefreshToken: string,
    redditUpvoteThreshold: number,
    subreddits: string[],
    registeredSubreddits: registeredSubreddit[]
}

export interface registeredSubreddit {
    name: string,
    lastPolledPosts: string[]
}