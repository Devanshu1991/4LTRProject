/**
 * Created by nbalasundaram on 10/9/15.
 */
var wd = require('wd');
var asserters = wd.asserters;


module.exports = {


    countPreexistingStudyBitCounts: function (browser, chapter) {

        browser.execute("return document.evaluate(\"count(//div[@chapters='chapters']//div/h1[contains(text(),'Chapter 1: ')]//following-sibling::div[1]/div[2]//div[@class='studybits']/div[@class='studybit-count '])\", document, null, XPathResult.ANY_TYPE, null ).numberValue")
            .text();

    },

    verifyIfPreexistingStudyBitCountsExistsAndRetrieveIt: function (browser, chapter) {

        return  browser.execute("return document.evaluate(\"count(//div[@chapters='chapters']//div/h1[contains(text(),'Chapter 1: ')]//following-sibling::div[1]/div[2]//div[@class='studybits']/div[@class='studybit-count '])\", document, null, XPathResult.ANY_TYPE, null ).numberValue");


    },

    isConceptTrackerLoaded: function (browser) {
        return browser.waitForElementByCss(".concept-tracker.ng-scope header", asserters.isDisplayed, 60000).elementByCssSelector(".concept-tracker.ng-scope header h1");

    },

    getPracticeQuizAnalytics: function (browser, chapter, concept) {

    }
};
