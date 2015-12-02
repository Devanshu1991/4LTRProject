var wd = require('wd');
var testData = require("../../../../test_data/data.json");
var productData = require("../../../../test_data/products.json");

var asserters = wd.asserters;
module.exports = {

    openSearchControl: function (browser) {
        return browser
            .waitForElementByCss("#search-form .label", asserters.isDisplayed, 60000).click();
    },

    enterTheSearchTerm: function (browser, keyword) {
        return browser
            .waitForElementByCss("#search-form .input input", asserters.isDisplayed, 3000)
            .type(keyword)
            .type(wd.SPECIAL_KEYS.Enter)
            .waitForElementByCss(".search-results.ng-scope header h1", asserters.isDisplayed, 60000)
            .sleep(10000);

    },

    getResultsCount: function (browser) {
        return browser.waitForElementByCss(".search-results.ng-scope header h1", asserters.isDisplayed, 60000)
            .text();

    },

    selectAResult: function (browser, index) {
        return browser.waitForElementByCss("div.search-results div:nth-child(" + index + ") div div a", asserters.isDisplayed, 60000)
            .text();
    },

    scrollToSearchResultsBottom: function (browser) {
        browser.execute('document.getElementsByClassName(\'footer-container ng-scope\')[0].scrollIntoView();').
            sleep(2000);
    }


}; 