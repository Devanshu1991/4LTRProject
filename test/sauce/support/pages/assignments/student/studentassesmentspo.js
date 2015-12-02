var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../../../../test_data/assignments/assessments.json");
var courseHelper = require("../../../../support/helpers/courseHelper");
var servicepo = require("../instructor/servicepo");

var request = require('supertest')(servicepo.getAssignmentURL());
var util = require('util');
var _ = require('underscore');
var olr = require("../../olr");
var loginPage = require("../../loginpo");
var assessment = require('../instructor/assessmentspo');


module.exports = {

    navigateToNextMonth: function (browser) {
        return browser
            .sleep(5000)
            .waitForElementByCss(".container .cg-calendar .next", asserters.isDisplayed, 10000)
            .click();
    },
    clickOnNextMonthFirstDate: function(browser){
      return browser
      .waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='1')]//following-sibling::div[@class='assignment-due']", asserters.isDisplayed, 10000)
      .isDisplayed()
      .waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='1')]//following-sibling::div[@class='assignment-due']", asserters.isDisplayed, 10000)
      .click();
    },
    launchAssignment: function(browser,assignmentName){
      return browser
          .waitForElementByXPath("//span[contains(@class,'assessment-title')]/a[contains(text(),'" + assignmentName + "')][1]", asserters.isDisplayed, 60000)
          .sleep(10000)
          .click();
    },
    clickOnCurrentDateCell: function(browser){
      return browser
          .sleep(3000)
          .elementByCssSelectorWhenReady(".day.ng-scope.today", 5000)
          .click()
          .sleep(3000);
    }


};
