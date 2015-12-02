var wd = require('wd');
var Q = wd.Q;
var asserters = wd.asserters;

var loginPage = require("../../loginpo");
var testData = require("../../../../../../test_data/assignments/chapterReading.json");


productData = loginPage.getProductData();
var data = {
    name: "Robo DNC assignment"
};

module.exports = {


    enterName: function (browser) {
        data.name = testData.assignment.name + " " + Math.floor((Math.random() * 1000) + 1);

        return browser
            .waitForElementByXPath("//div[@class='text-input']/input", asserters.isDisplayed, 60000)
            .type(data.name);
    },

    enterRevealDate: function (browser) {

        return browser
            .waitForElementByXPath("(//div[contains(@class,'datefield ng-binding')])[2]", asserters.isDisplayed, 60000)
            .click()
            .waitForElementByCss("div[class='datepicker cg-calendar ng-isolate-scope'] .day.ng-scope.today", asserters.isDisplayed, 60000)
            .click();

    },

    selectAChapter: function (browser) {
        return browser
            .waitForElementByXPath("//div[contains(@class,'cg-checkbox ng-isolate-scope')and contains(.,'" + loginPage.getProductData().chapter.topic.documents.assignments[0].Reading[0].chapter + "')]/label/span")
            .click();
    },

    getAssignmentName: function () {
        return data.name;
    },

    saveAssignment: function (browser) {
        return browser
            .sleep(3000)
            .execute("document.getElementsByClassName('save ng-scope')[0].click()");

    },

    checkIfAssignmentSaved: function (browser) {
        return browser
            .execute("location.reload()")
            .sleep(5000)
            .waitForElementByXPath("(//div[contains(@class,'cg-calendar ng-isolate-scope')]//div[contains(@class,'day ng-scope today')])[1]/div[contains(@class,'event ng-scope')]/span[contains(.,'" + this.getAssignmentName() + "')]", asserters.isDisplayed, 60000);

    },

    checkIfAssignmentSavedOnFuture: function (browser) {
        return browser
            // .execute("location.reload()")
            .sleep(10000)
            .waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='1')]//following-sibling::div[contains(@class,'event')]//span[contains(.,'" + this.getAssignmentName() + "')]", asserters.isDisplayed, 60000)
            .execute("return window.getComputedStyle(document.evaluate(\"//div[contains(@class,'day ng-scope')]/span[@bo-text='day.number' and (text()='1')]//following-sibling::div[contains(@class,'event ng-scope')]/span[contains(.,'" + this.getAssignmentName() + "')]\", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue.parentNode).getPropertyValue('background-color');");
    },

    deleteNonAssessmentAssignment: function (browser) {
        return browser.
            waitForElementByXPath("(//div[contains(@class,'cg-calendar ng-isolate-scope')]//div[contains(@class,'day ng-scope today')])[1]/div[contains(@class,'event ng-scope')]/span[contains(.,'" + this.getAssignmentName() + "')]", asserters.isDisplayed, 60000)
            .click()
            .sleep(5000)
            .execute("window.oldConfirm = window.confirm; window.confirm = function() { return true; };")
            .waitForElementByCss(".delete.ng-scope", asserters.isDisplayed, 60000)
            .click()
            .sleep(3000);
    }

};