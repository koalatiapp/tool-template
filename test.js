const Tool = require('./tool.js');
const puppeteer = require('puppeteer');
const args = require('minimist')(process.argv.slice(2))
const clc = require('cli-color');
const maxPageLoadAttempts = 3;

if ('url' in args) {
    (async () => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({ DNT: "1" });
        await page.setViewport({ width: 1920, height: 1080 });

        for (let attemptCount = 1; attemptCount <= maxPageLoadAttempts; attemptCount++) {
            try {
                await page.goto(args['url'], { waitUntil: "networkidle" + (attemptCount == 1 ? "2" : "0"),  timeout: 7500 * attemptCount });
            } catch (error) {
                if (attemptCount == maxPageLoadAttempts) {
                    console.log(clc.red(JSON.stringify({ error: "The page could not be loaded within a 30 seconds timespan, and therefore could not be tested." })));
                    await browser.close();
                    process.exit(1);
                }
            }
        }

        // Run tool
        try {
            const toolInstance = new Tool(page);
            await toolInstance.run();

            const results = toolInstance.results;

            // @TODO: check if the results are valid and well formatted

            await toolInstance.cleanup();
        } catch (error) {
            console.log(clc.red('An error occured:'));
            console.log(error);
            await browser.close();
            process.exit(1);
        }

        console.log(clc.green('Tool ran successfully without any errors.'));
        await browser.close();
    })();
} else {
    console.log(clc.red(JSON.stringify({ error: 'Missing URL argument.' })));
    process.exit(1);
}
