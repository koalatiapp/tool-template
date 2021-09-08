"use strict";

const { ResultBuilder, priorities } = require("@koalati/result-builder");

class Tool {
	/**
     * Creates and initializes an instance of your tool
     *
     * @param {Object} data Object containing the data that is made available to the tool.
     * @param {Object} data.page The current Puppeteer page's instance (https://pptr.dev/#?product=Puppeteer&version=main&show=api-class-page)
     * @param {Object} data.devices A list of devices to be used with page.emulate(). This is a reference to puppeteer.devices.
     * @param {Object} data.consoleMessages An object containing the messages from the browser's console
     */
	constructor({ page, devices }) {
		// Set up properties and connections if needed
		this.page = page;
		this.devices = devices;

		// The ResultBuilder is an helpful package that helps you build and format your results.
		// You can find more information about it here: https://www.npmjs.com/package/result-builder
		this.builder = new ResultBuilder();
	}

	/**
     * Runs your tool on the page stored in `this.page`
     */
	async run() {
		// Run the tool on the page/website.
		// You can use the Puppeteer page object stored in this.page to interact with the active page.
		// Alternatively, you can use external APIs and resources to generate results.

		// Ex.: execute a function within the page to get or to analyze data
		// const pageTitle = await this.page.evaluate(() => {
		//     const titleNode = document.querySelector('title');
		//     return titleNode ? titleNode.textContent : null;
		// });

		// Ex.: emulate an iPhone's viewport and user agent
		// await this.page.emulate(this.devices['iPhone 8']);

		// Ex.: type inside an input
		// await this.page.type('input[name="email"]', 'info@koalati.com', { delay: 50 });

		// Ex.: wait for a selector to appear in the page
		// await this.page.waitForSelector('img', { timeout: 5000 });

		// Feel free to created other methods and files to separate different tests and features.
		this.processSomething();
	}

	get results() {
		// Returns an array of formatted Result objects.
		// This method will always be called after run().
		// This getter should contain little to no logic or processing: it's only goal is to return the results in the Koalati's desired format.
		// For more information about the results format, check out https://docs.koalati.com/docs/tools/formatting-results
		return this.builder.toArray();
	}

	processSomething() {
		// Do some processing...
		// And then generate your test's results with the ResultBuilder (or manually, if you prefer)

		// Your test's unique name must be unique within your tool. It will be prefixed with your tool's name to generate a Koalati-wide unique name for this test.
		this.builder.newTest("your_test_unique_name")

			// Give your tool a user-friendly title: that's what the users on Koalati will see
			.setTitle("Your test's user-friendly title")

			// This can be a static description of what your test looks for, or a dynamic one that describes the results.
			.setDescription("Your test's user-friendly description.")

			// A string or an array of string that gives recommendations, telling the user what can be done to improve the page
			.addRecommendation(
				"Add %attribute% attribute to the tags on your page to improve X",
				{ "%attribute%": "title" },
				priorities.OPTIMIZATION // use the appropriate type of priority for your recommendation. if unsure, leave it empty or set it to null.
			)

			// The weight of this test's score as a float. the sum of the weights of all your results should be 1.0
			.setWeight(1)

			// The score obtained as a float: 0.5 is 50%, 1.0 is 100%, etc.
			.setScore(1)

			// A one-dimensional array of strings and/or ElementHandle that can be represented as code snippets in Koalati's results
			.addSnippets(["<div>The faulty element in the page</div>"])

			// A two-dimensional array of data that will be represented as a table in Koalati's results. The first row should contain the column's headings.
			.addTableRow([
				"Table heading 1",
				"Table heading 2"
			])
			.addTableRow([
				"Table value 1",
				"Table value 2"
			]);
	}

	async cleanup() {
		// cleans up the variables and connections
		// this will be called once your tool has been executed and its results have been collected
		// your goal here is to put everything back the way it was before your tool was initialized
	}
}

module.exports = Tool;
