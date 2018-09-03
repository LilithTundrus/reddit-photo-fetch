// Using ES5 strict mode
'use strict';

// Use request for POSTing to reddit
import * as request from 'request';

export function refreshToken(configJSON: any, accessToken: string, refreshToken: string, cb: any) {

    // Make sure the query params/headers are set correctly
    let baseURL = 'https://www.reddit.com/api/v1/access_token';

    let encoding = Buffer.from(`${configJSON.redditClientID}:${configJSON.redditSecret}`).toString('base64');

    let requestOptions = {
        headers: {
            'Authorization': `Basic ${encoding}`
        },
        url: baseURL,
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`
    };
    // Make the call to the correct URL
    // Return the results

    request.post(requestOptions, (err, response) => {
        if (err) console.log(err);
        cb(response);
    });

}