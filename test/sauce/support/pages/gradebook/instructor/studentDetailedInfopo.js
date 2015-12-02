/**
 * Created by nbalasundaram on 10/5/15.
 */
var wd = require('wd');
var asserters = wd.asserters;
module.exports = {

    getStudentScore: function (browser, assignmentName) {
        return browser
            .sleep(10000)
            .waitForElementByXPath("(//td[contains(text(),'" + assignmentName + "')]/following-sibling::td[@class='score-col']//div[@class='left-of-pipe'])[1]/span", asserters.isDisplayed, 60000)
            .text();
    },

    getStudentTotalScore: function (browser, assignmentName) {
        return browser
            .waitForElementByXPath("(//td[contains(text(),'" + assignmentName + "')]/following-sibling::td[@class='score-col']//div[@class='right-of-pipe'])[1]/span", asserters.isDisplayed, 60000)
            .text();
    },

    getScoredPoints: function (browser, assignmentName) {
        return browser
            .waitForElementByXPath("(//td[contains(text(),'" + assignmentName + "')]/following-sibling::td[@class='points-col']//div[@class='left-of-pipe'])[1]/span", asserters.isDisplayed, 60000)
            .text();
    },

    getTotalPoints: function (browser, assignmentName) {
        return browser
            .waitForElementByXPath("(//td[contains(text(),'" + assignmentName + "')]/following-sibling::td[@class='points-col']//div[@class='right-of-pipe'])[1]/span", asserters.isDisplayed, 60000)
            .text();
    },

    getTotalPointsEarnedOnGraph: function (browser) {
        return browser
            .waitForElementByCss("div.progress-bar-indication p", asserters.isDisplayed, 60000)
            .text();
    },

    getTotalPointsPossibleOnGraph: function (browser) {
        return browser
            .waitForElementByXPath("//div[@class='chart-container']//footer//span", asserters.isDisplayed, 60000)
            .text();
    },

    validatePresenceOfAverageScore: function (browser, assignmentName) {
        return browser
            .waitForElementByXPath("(//td[contains(text(),'" + assignmentName + "')]/following-sibling::td[@class='avg-col']//div[@class='left-of-pipe'])[1]/span", asserters.isDisplayed, 60000)
            .text();
    },

    getSubmittedDate: function (browser) {
        return browser
            .waitForElementByCss(".submitted-col.ng-binding", asserters.isDisplayed, 60000)
            .text();
    },

    getDueDate: function (browser, assignmentName) {

    },

    editDueDate: function(browser, assignmentName){
      return browser
        .waitForElementByXPath("//table//tr//td[contains(text(),'" +assignmentName+ "')]//following-sibling::td[@class='submitted-col']//div[@class='datefield ng-binding simple']", asserters.isDisplayed, 60000)
        .click()
        .sleep(2000)
        .waitForElementByXPath("//table//tr//td[contains(text(),'" +assignmentName+ "')]//following-sibling::td[@class='submitted-col']//div[@class='next']", asserters.isDisplayed, 60000)
        .click()
        .sleep(2000)
        .waitForElementByXPath("(//table//tr//td[contains(text(),'" +assignmentName+ "')]//following-sibling::td[@class='submitted-col']//div[@class='week ng-scope'])[1]//div//span[contains(text(),'1')]", asserters.isDisplayed, 60000)
        .click()
        .sleep(5000);
    },

    dueDateValue: function(browser,assignmentName){
      return browser
      .waitForElementByXPath("//table//tr//td[contains(text(),'" +assignmentName+ "')]//following-sibling::td[@class='submitted-col']//div[@class='datefield ng-binding simple']", asserters.isDisplayed, 60000)
      .text();
    }
};
