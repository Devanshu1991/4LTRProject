/**
 * Created by nbalasundaram on 10/3/15.
 */
var wd = require('wd');
var asserters = wd.asserters;
var courseHelper = require("../../../../support/helpers/courseHelper");
var testData = require("../../../../../../test_data/data.json");
var productData = require("../../../../../../test_data/products.json");

module.exports = {

    selectADateForAssignment: function (browser) {
        return browser
            .waitForElementByXPath("(//div[contains(@class,'cg-calendar ng-isolate-scope')])[1]", asserters.isDisplayed, 60000)
            .sleep(5000)
            .waitForElementByCss(".day.ng-scope.today>.actions.ng-scope", asserters.isDisplayed, 60000)
            .click()
            .waitForElementByCss(".sliding-menu-content", asserters.isDisplayed, 60000)
            .sleep(10000);

    },
    selectAssessmentTypeAssignment: function (browser, done) {
        browser
            .waitForElementByXPath("//button[contains(.,'assessment')]", asserters.isDisplayed, 60000)
            .click()
            .sleep(3000)
            .nodeify(done);

    },

    selectDocumentsAndLinksTypeAssignment: function (browser, done) {
        browser
            .waitForElementByXPath("//button[contains(.,'documents & links')]", asserters.isDisplayed, 60000)
            .click()
            .sleep(3000)
            .nodeify(done);
    },

    selectChapterReadingAssessment: function (browser, done) {
        browser
            .waitForElementByXPath("//button[contains(.,'chapter reading')]", asserters.isDisplayed, 60000)
            .click()
            .sleep(3000)
            .nodeify(done);
    },

    veryfyAssessmentOnListView: function (browser, done, assignment1position, assignment2position, assessmentname1, currentdate, score, attempts, assessmentname2, unlimitedattempts) {
        browser
            .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[" + assignment1position + "]//div[contains(@class,'ui-grid-cell')]//div)[1]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(assessmentname1)
            .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[" + assignment1position + "]//div[contains(@class,'ui-grid-cell')]//div)[2]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(currentdate)
            .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[" + assignment1position + "]//div[contains(@class,'ui-grid-cell')]//div)[3]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(currentdate)
            .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[" + assignment1position + "]//div[contains(@class,'ui-grid-cell')]//div)[4]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(score)
            .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[" + assignment1position + "]//div[contains(@class,'ui-grid-cell')]//div)[5]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(attempts)
            .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[" + assignment2position + "]//div[contains(@class,'ui-grid-cell')]//div)[1]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(assessmentname2)
            .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[" + assignment2position + "]//div[contains(@class,'ui-grid-cell')]//div)[2]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(currentdate)
            .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[" + assignment2position + "]//div[contains(@class,'ui-grid-cell')]//div)[3]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(currentdate)
            .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[" + assignment2position + "]//div[contains(@class,'ui-grid-cell')]//div)[4]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(score)
            .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[" + assignment2position + "]//div[contains(@class,'ui-grid-cell')]//div)[5]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(unlimitedattempts)
            .nodeify(done);
    },
    navigateAssignmentListView: function (browser, done) {
        browser
            .waitForElementByCss(".icon-list-gray", asserters.isDisplayed, 10000)
            .click()
            .sleep(2000)
            .nodeify(done);
    },
    navigateAssignmentCalenderView: function (browser, done) {
        browser
            .waitForElementByCss(".icon-calendar-gray", asserters.isDisplayed, 10000)
            .click()
            .sleep(2000)
            .nodeify(done);
    },

    navigateCurrentMonthFromNextMonth: function (browser, done) {
        browser
            .sleep(5000)
            .waitForElementByCss("div[class='container ng-scope'] .previous", asserters.isDisplayed, 10000)
            .click()
            .sleep(2000)
            .nodeify(done);
    },

    navigateToNextMonth: function (browser) {
        return browser
            .sleep(5000)
            .execute("return document.getElementsByClassName('flash-alert tip-alert').length")
            .then(function (close_x) {
                if (close_x != 0) {
                    browser.execute("document.getElementsByClassName('icon-close-x')[0].click();");
                }
            }).waitForElementsByCss("div.actions.ng-scope", asserters.isDisplayed, 20000)
            .waitForElementByCss(".container .cg-calendar .next", asserters.isDisplayed, 10000)
            .click();
    },


    selectFirstDateFormNextMonth: function (browser) {
        return browser
            .waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='1')]//following-sibling::div[contains(@class,'actions ')]", asserters.isDisplayed, 10000)
            .click()
            .sleep(3000);
    }

};
