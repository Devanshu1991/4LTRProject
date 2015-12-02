/**
 * Created by nbalasundaram on 10/16/14.
 */
var wd = require('wd');
var testData = require("../../../../test_data/qa.json");
var sauceData = require("../../../../test_data/sauce.json");
var gridconfig = require("../../../../config.json");
var stringutil = require("../../util/stringUtil");

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

//desired = JSON.parse(process.env.DESIRED);
var browser;
// adding custom promise chain method
wd.addPromiseChainMethod('elementByCssSelectorWhenReady', function(selector, timeout) {
	return this.waitForElementByCssSelector(selector, timeout).elementByCssSelector(selector);
});

wd.addPromiseChainMethod('elementByXPathSelectorWhenReady', function(selector, timeout) {
	return this.waitForElementByXPath(selector, timeout).elementByXPath(selector);
});

// http configuration, not needed for simple runs
wd.configureHttp({
	timeout : 100000,
	retryDelay : 15000,
	retries : 5
});

function SauceSession() {
}

SauceSession.create = function(done) {
	console.log("********** Run Environment Variable Values :: " + process.env.RUNNER + "**********");

	if (process.env.RUNNER.toString() === "\"remote\"") {

		var username = sauceData.username;
		var accessKey = sauceData.accessKey;
		browser = wd.promiseChainRemote("ondemand.saucelabs.com", 80, username, accessKey);
		if (process.env.VERBOSE) {

			browser.on('status', function(info) {
				console.log(info.cyan);
			});
			browser.on('command', function(meth, path, data) {
				console.log(' > ' + meth.yellow, path.grey, data || '');
			});
		}
        var desired = {
            browserName : 'chrome'
        };

		browser.init(desired).nodeify(done);

	} else {

        //Nirmal's Selenium node http://10.168.50.96:4444/wd/hub
        //MindTap Selenium node gridconfig.server

        desired = {
            browserName : stringutil.removeBoundaryQuotes(process.env.RUN_IN_BROWSER.toString())
        };

        browser = wd.promiseChainRemote(stringutil.removeBoundaryQuotes(process.env.RUN_IN_GRID.toString()));
		browser.init(desired).nodeify(done);

	}
	return browser;
};

SauceSession.close = function(allPassed, done) {
	if (process.env.RUNNER.toString() === "\"remote\"") {
		browser.quit().sauceJobStatus(allPassed).nodeify(done);
	} else {
		browser.quit().nodeify(done);
	}

};

module.exports = SauceSession;
