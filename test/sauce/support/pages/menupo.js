/**
 * Created by nbalasundaram on 10/3/15.
 */
var wd = require('wd');
var asserters = wd.asserters;

var testData = require("../../../../test_data/data.json");

module.exports = {

    selectSubTabOnStudyBoard: function (browser, tabName, done) {

        if (tabName === "StudyBits") {
            browser.waitForElementByCss("nav a:nth-child(1)", asserters.isDisplayed, 90000).click().sleep(5000).nodeify(done);
        }
        else if (tabName === "Flashcards") {
            browser.sleep(5000).waitForElementByCss("nav a:nth-child(2)", asserters.isDisplayed, 90000).click().sleep(5000).nodeify(done);

        } else {
            browser.sleep(10000).waitForElementByCss("nav a:nth-child(3)", asserters.isDisplayed, 90000).click().sleep(5000).nodeify(done);

        }
    },

    selectAssignments: function (role, browser, done) {
        if (role === "instructor") {
            browser
                .waitForElementByCss(".manage-dropdown>.dropdown>.dropdown-link.ng-binding", asserters.isDisplayed, 60000)
                .click()
                .waitForElementByXPath("//span[contains(.,'ASSIGNMENTS')]", asserters.isDisplayed, 60000)
                .click()
                .execute("window.scrollTo(0, 300)")
                .sleep(3000)
                .nodeify(done);
        }
        else {
            browser
                .execute("window.scrollTo(100,600)")
                .sleep(3000)
                .elementByCssSelectorWhenReady(".icon-clock-blue", 3000)
                .click()
                .waitForElementByXPath("//h1[contains(.,'Assignments')]", asserters.isDisplayed, 60000)
                .nodeify(done);

        }

    },

    selectGradebook: function (role, browser, done) {
        if (role === "instructor") {
            browser
                .waitForElementByCss(".manage-dropdown>.dropdown>.dropdown-link.ng-binding", asserters.isDisplayed, 60000)
                .click()
                .waitForElementByXPath("//span[contains(.,'GRADEBOOK')]", asserters.isDisplayed, 60000)
                .click()
                .waitForElementByXPath("//h1[contains(.,'Gradebook')]", asserters.isDisplayed, 60000)
                .execute("window.scrollTo(0, 300)")
                .sleep(3000)
                .nodeify(done);
        }

        else {
            browser
                .waitForElementByXPath("//h1[contains(.,'Assignments')]", asserters.isDisplayed, 60000)
                .sleep(10000)
                .execute('window.scrollTo(0,0)')
                .elementByXPathSelectorWhenReady("//a[contains(text(),'Gradebook')]", 5000)
                .click()
                .sleep(20000)
                .nodeify(done);
        }
    },

    selectManagDocs: function (browser, done) {
        browser
            .waitForElementByCss(".manage-dropdown>.dropdown>.dropdown-link.ng-binding", asserters.isDisplayed, 60000)
            .click()
            .waitForElementByXPath("//span[contains(.,'MANAGE DOCS')]", asserters.isDisplayed, 60000)
            .click()
            .sleep(3000)
            .nodeify(done);
    },

    selectConceptTracker: function (role, browser, done) {

        if (role === "instructor") {
            browser
                .waitForElementByCss(".manage-dropdown>.dropdown>.dropdown-link.ng-binding", asserters.isDisplayed, 60000)
                .click()
                .waitForElementByXPath("//span[contains(.,'CONCEPT TRACKER')]", asserters.isDisplayed, 60000)
                .click()
                .sleep(3000)
                .nodeify(done);
        }

        else {
            console.log("Other roles dont have a role specific concept tracker");
        }

    }

};
