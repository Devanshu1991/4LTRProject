/**
 * Created by nbalasundaram on 10/5/15.
 */
var wd = require('wd');
var asserters = wd.asserters;
module.exports = {

    getAssessmentNameOnStudentAssessmentDetailedView: function(browser){
      return browser
          .waitForElementByCss(".product-title.ng-binding", asserters.isDisplayed, 60000)
          .text();
    },

    ValidatePresenceScoreExpected: function(browser){
      return browser
          .waitForElementByCss(".submission-count", asserters.isDisplayed, 60000)
          .text();
    },

    scoreSubmissionCountOnSubmissionGraph: function(browser){
      return browser
          .waitForElementByCss(".chartjs.submissions p", asserters.isDisplayed, 60000)
          .text();
    },
    validateScoreLabel: function(browser){
      return browser
          .waitForElementByCss(".chartjs.multi-doughnut .chartjs-title.ng-scope", asserters.isDisplayed, 60000)
          .text();
    },
    validateDistibutionLabel: function(browser){
      return browser
          .waitForElementByCss(".chartjs.distribution .chartjs-title.ng-scope", asserters.isDisplayed, 60000)
          .text();
    },
    validateSubmissionLabel: function(browser){
      return browser
          .waitForElementByCss(".chartjs.submissions .chartjs-title.ng-scope", asserters.isDisplayed, 60000)
          .text();
    },
    validateLowLabel: function(browser){
      return browser
          .waitForElementByXPath("(//div[contains(@class,'chartjs multi-doughnut')]//span)[1]", asserters.isDisplayed, 60000)
          .text();
    },
    validateMedianLabel: function(browser){
      return browser
          .waitForElementByXPath("(//div[contains(@class,'chartjs multi-doughnut')]//span)[2]", asserters.isDisplayed, 60000)
          .text();
    },
    validateHighLabel: function(browser){
      return browser
          .waitForElementByXPath("(//div[contains(@class,'chartjs multi-doughnut')]//span)[3]", asserters.isDisplayed, 60000)
          .text();
    },

    validateDistibutionGraph: function(browser){
      return browser
          .waitForElementByCss(".distribution-list", asserters.isDisplayed, 60000)
          .isDisplayed()
          .should.become(true)
    },
    validateDistibutionValue: function(browser,counter){
      return browser
          .waitForElementByXPath("(//ul[contains(@class,'distribution-list')]//span[contains(@class,'ng-scope ng-binding')])["+counter+"]", asserters.isDisplayed, 60000)
          .text()
    }


};
