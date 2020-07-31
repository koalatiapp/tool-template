const Tool = require('./tool.js');
const ResultsValidator = require('@koalati/results-validator');
const puppeteer = require('puppeteer');
const args = require('minimist')(process.argv.slice(2))
const clc = require('cli-color');
const maxPageLoadAttempts = 3;
let encodedResults = null;

if ('url' in args) {
    (async () => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({ DNT: "1" });
        await page.setViewport({ width: 1920, height: 1080 });

        for (let attemptCount = 1; attemptCount <= maxPageLoadAttempts; attemptCount++) {
            try {
                await page.goto(args['url'], { waitUntil: "networkidle2",  timeout: 7500 * attemptCount });
            } catch (error) {
                if (attemptCount == maxPageLoadAttempts) {
                    console.log(clc.red(JSON.stringify({ error: "The page could not be loaded within a 30 seconds timespan, and therefore could not be tested." })));
                    await browser.close();
                    process.exit(1);
                }
            }
        }

        try {
            const toolInstance = new Tool(page, puppeteer.devices);
            await toolInstance.run();

            const validator = new ResultsValidator();
            const validationErrors = validator.checkResults(toolInstance.results)

            if (validationErrors.length) {
                for (const error of validationErrors) {
                    console.log(clc.red('Results validation error: ' + error));
                }
                await browser.close();
                process.exit(1);
            }

            encodedResults = JSON.stringify(toolInstance.results, null, 2);
            await toolInstance.cleanup();
        } catch (error) {
            console.log(clc.red('An error occured while running the tool.'));
            console.log(error);
            await browser.close();
            process.exit(1);
        }

        console.log(clc.green('Tool ran successfully without any errors.'));
        console.log(clc.green('Here are the JSON encoded results it returned:'));
        console.log(encodedResults);
        await browser.close();
    })();
} else {
    console.log(clc.red(JSON.stringify({ error: 'Missing URL argument.' })));
    process.exit(1);
}
