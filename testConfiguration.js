var HtmlReporter = require('protractor-html-screenshot-reporter');

exports.config = {
  directConnect: true,
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./src/testCases/testMaybeScenarioWhenNotLoggedInAndAppInstalled.js'],
  capabilities: {
    browserName: 'chrome'
  },

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 300000
  },
  
   onPrepare: function() {
   browser.driver.manage().window().maximize();
    jasmine.getEnv().addReporter(new HtmlReporter({
         baseDirectory: 'output',
         takeScreenShotsOnlyForFailedSpecs: true
       }));
       
  
  }
};

