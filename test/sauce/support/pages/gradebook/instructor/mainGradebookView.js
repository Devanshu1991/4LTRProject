var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../../../../test_data/gradebook/gradebook.json");


module.exports = {

    overrideTheScore: function (browser) {
        return browser
            .waitForElementByXPath("(//div[contains(@class,'ui-grid-viewport')])[2]//div[contains(@class,'ui-grid-row')][1]//div[contains(@class,'ui-grid-cell')]//div", asserters.isDisplayed, 60000)
            .click()
            .waitForElementByXPath("//form//input[contains(@class,'ng-pristine ng-untouched ng-valid ng-scope ng-valid-pattern')]", asserters.isDisplayed, 60000)
            .type(testData.instructorgradebook.overriddenscore)
            .type(wd.SPECIAL_KEYS.Tab);
    }

};