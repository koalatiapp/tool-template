# Koalati Tool Template
This repository is a template that contains everything you need to create a custom tool for Koalati.com.


## Getting started
To get started, click the "Use this template" button in GitHub or fork this repository.

Then, clone your repository locally and install its dependencies:
```bash
git clone https://github.com/<your-username>/<your-repository>.git
npm install
```

Then, open `tool.js` in your preferred editor or IDE and get started building your own custom tool!

To see what completed tools might look like, take a look at our tool repositories on https://github.com/koalatiapp/


## Debugging your tool
Once you have started developing your tool, you can easily run it to see if it works and to validate its results.

You can test it by running the following command, which will run your tool on Koalati's homepage by default:
```bash
npm run debug
```

Alternatively, you can use the following command and specify which webpage to run your tool on:
```bash
npx @koalati/dev-tool-tester --url="https://koalati.com/"
```

For more information on automated testing for your tools, check out the [dev-tool-tester repository](https://github.com/koalatiapp/dev-tool-tester).


## Testing your tool
This tool template comes with a basic testing setup, which uses [`mocha`](https://mochajs.org/), [Node's `assert`](https://nodejs.org/api/assert.html) and the [`@koalati/dev-tool-tester`'s `runTool`](https://github.com/koalatiapp/dev-tool-tester) function.

You can run your tool's tests by running the following command:
```bash
npm test
```

The tests are found in the `test` directory of this template. It contains three files you'll most likely want to update:
- `/test/sample.html`: a simple HTML file on which your tool will be ran for the test's purpose.
- `/test/expectation.json`: a JSON containing the results that are expected to come out of your tool when it is ran on the `/test/sample.html` page.
- `/test/index.js`: the actual script that defines and executes the tests.
