// Using ES5 strict mode
'use strict';

// Node/NPM requires and imports
import * as fs from 'fs';
// Used for GET tasks for the fetchClient
import * as request from 'request';

export default class ImgurWrapper {
    private baseImgurURL: string;
    private clientID: string;

    constructor(baseImgurURL: string, clientID: string) {
        this.baseImgurURL = baseImgurURL;
        this.clientID = clientID;
    }

    getImgurPostInfo(imgurURL: string) {
        // TODO: make sure the link is not an album
        // Get the last part of the URl, as that's the ID
        let parsedImageID = imgurURL.substring(imgurURL.lastIndexOf('/') + 1);

        return new Promise((resolve, reject) => {
            request.get(`${this.baseImgurURL}image/${parsedImageID}`, {
                headers: {
                    "Authorization": `Client-ID ${this.clientID}`
                }
            }, (err, res, body: string) => {
                // Make sure nothing went wrong with the request
                if (err) reject(err);

                resolve(body);
            });
        });
    }
}