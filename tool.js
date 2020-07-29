'use strict';

class Tool {
    /**
     * Creates and initializes an instance of your tool
     * Puppeteer's Page class documentation: https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-page
     *
     * @param {Object} page The current Puppeteer page's instance
     */
    constructor(page) {
        // set up testing variables and connections, if needed
    }

    async run() {
        // runs the tool on the page/website
    }

    get results() {
        // returns an array of formatted Result objects
    };

    async cleanup() {
        // cleans up the variables and connections
    };
}

module.exports = Tool;
