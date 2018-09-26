// Using ES5 strict mode
'use strict';

// Used for GET tasks for the fetchClient
import * as request from 'request';

export default class ImgurWrapper {
    // Base URL for the imgur API
    private baseImgurURL: string;
    // ID of the imgur client
    private clientID: string;
    // Headers to be used on requests to imgur
    private headers: {};

    constructor(baseImgurURL: string, clientID: string) {
        this.baseImgurURL = baseImgurURL;
        this.clientID = clientID;
        this.headers = {
            "Authorization": `Client-ID ${this.clientID}`
        };
    }

    // TODO: This should make sure the link is not an album
    /** Get an imgur image's direct URL based on its relative URL
     * @param {string} imgurURL
     * @returns `string`
     * @memberof ImgurWrapper
     */
    getImgurPostImageLink(imgurURL: string) {

        // Get the last part of the URl, as that's the ID
        let parsedImageID = imgurURL.substring(imgurURL.lastIndexOf('/') + 1);

        // Promise-wrapped GET rquest on the image URL
        return new Promise((resolve, reject) => {
            request.get(`${this.baseImgurURL}image/${parsedImageID}`, {
                headers: this.headers
            }, (err, res, body: string) => {
                if (res.statusCode == 400) {
                    console.log(`400 Error:`, res.headers, res.body);
                    reject();
                }
                // Make sure nothing went wrong with the request
                if (err) reject(err);

                resolve(body);
            });
        });
    }
}