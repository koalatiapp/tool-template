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
                await page.goto(args['url'], { waitUntil: "networkidle2",  timeout: 7500 * attemptCount });
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

            validateResults(toolInstance.results);

            await toolInstance.cleanup();
        } catch (error) {
            console.log(clc.red('An error occured while running the tool.'));
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


function validateResults(results)
{
    if (['array', 'object'].indexOf(typeof results) == -1) {
        throw new Error(`The tool's results should be an array or an object. ${typeof results} found instead.`);
    }

    results = Object.values(results);

    if (!results.length) {
        throw new Error(`The tool did not return any results (array of results is empty).`);
    }

    for (const singleResult of results) {
        validateSingleResult(singleResult);
    }
}

function validateSingleResult(result)
{
    if ('object' != typeof result) {
        throw new Error(`Every result element should be an object. ${typeof result} found instead.`);
    }

    const requiredProperties = ['uniqueName', 'title', 'description', 'weight'];
    for (const property of requiredProperties) {
        if ('undefined' == typeof result[property] || result[property] === null) {
            throw new Error(`Every result element should contain the ${property} property, but the following result does not include it: \n${JSON.stringify(result)}`);
        }
    }
}
