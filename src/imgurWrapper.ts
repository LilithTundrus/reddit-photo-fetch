// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';
// Used for GET tasks for the fetchClient
import * as request from 'request-promise';

export function test(imgurURL: string, baseImgurURL: string, clientID: string) {
    // TODO: make sure the link is not an album
    // Get the last part of the URl, as that's the ID
    let parsedImageID = imgurURL.substring(imgurURL.lastIndexOf('/') + 1);

    return request.get(`${baseImgurURL}image/${parsedImageID}`, {
        headers: {
            "Authorization": `Client-ID ${clientID}`
        }
    }, (err, res, body: string) => {
        // Make sure nothing went wrong with the request
        if (err) throw new Error(err);

        // let responseData;

        // try {
        //     responseData = JSON.parse(body);
        // } catch (e) {
        //     throw new Error(e);
        // }
        return body;
    });
}