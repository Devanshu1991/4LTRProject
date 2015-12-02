/**
 * Created by ssabharwal on 10/16/14.
 */
var wd = require('wd');
var testData =  require("../../../../test_data/qa.json");
var sauceData = require("../../../../test_data/sauce.json");

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

 desired = JSON.parse(process.env.DESIRED || '{browserName: "firefox"}');
  desired.browserName = 'chrome';

var browser;
// adding custom promise chain method
wd.addPromiseChainMethod(
    'elementByCssSelectorWhenReady',
    function(selector, timeout) {
        return this
            .waitForElementByCssSelector(selector, timeout)
            .elementByCssSelector(selector);
    }
);


wd.addPromiseChainMethod(
    'elementByXPathSelectorWhenReady',
    function(selector, timeout) {
        return this
            .waitForElementByXPath(selector, timeout)
            .elementByXPath(selector);
    }
);

// http configuration, not needed for simple runs
wd.configureHttp( {
    timeout: 60000,
    retryDelay: 15000,
    retries: 5
});

function localSession(){}

localSession.create = function(done){
     browser = wd.promiseChainRemote("http://localhost:4444/wd/hub");
        
     browser
        .init(desired)
        .get(testData.url)
		.setWindowSize(1366,768)
        .nodeify(done);

    return browser;
};

localSession.close = function(allPassed,done){
    browser
		.quit()
        .sauceJobStatus(allPassed)
        .nodeify(done);

};

module.exports =  localSession;
