var wd = require('wd');
var asserters = wd.asserters;
var report = require("../../support/reporting/reportgenerator");
var _ = require('underscore');
module.exports = {


    navigateToPracticeQuizFromChapters: function (browser) {

        return browser
            .waitForElementByCss(".sliding-menu-button.ng-scope", asserters.isDisplayed, 2000)
            .click()
            .waitForElementByCss("nav.sliding-menu-content", asserters.isDisplayed, 5000)
            .sleep(5000)
            .waitForElementByCss("section.actions button:nth-child(1)", asserters.isDisplayed, 10000)
            .click();

    },
    navigateToPracticeQuizFromStudyBits: function (browser) {

        return browser
            .waitForElementByCss(".sliding-menu-button.ng-scope", asserters.isDisplayed, 2000)
            .click()
            .waitForElementByCss("nav.sliding-menu-content", asserters.isDisplayed, 5000)
            .sleep(3000)
            .waitForElementByXPath("//label[contains(text(),'On my filtered StudyBits')]", asserters.isDisplayed, 10000)
            .click()
            .sleep(5000)
            .waitForElementByCss("section.actions button:nth-child(1)", asserters.isDisplayed, 10000)
            .click();

    },
    navigateToRetakeQuizFromStudyBoard: function (browser) {

        return browser
            .waitForElementByCss(".sliding-menu-button.ng-scope", asserters.isDisplayed, 2000)
            .click()
            .waitForElementByCss("nav.sliding-menu-content", asserters.isDisplayed, 5000)
            .sleep(5000)
            .waitForElementByCss("button.view-quizzes", asserters.isDisplayed, 10000)
            .click()
            .waitForElementByXPath("(//div[contains(@class,'quiz ng-scope')]//a)[1]", asserters.isDisplayed, 60000)
            .click()
            .waitForElementByCss("button.sliding-menu-button.retake-quiz.ng-scope", asserters.isDisplayed, 20000)
            .click();


    },

    navigateToAPastQuizFromStudyBoard: function (browser) {

        return browser
            .waitForElementByCss(".sliding-menu-button.ng-scope", asserters.isDisplayed, 2000)
            .click()
            .waitForElementByCss("nav.sliding-menu-content", asserters.isDisplayed, 5000)
            .sleep(5000)
            .waitForElementByCss("button.view-quizzes", asserters.isDisplayed, 10000)
            .click()
            .waitForElementByXPath("(//div[contains(@class,'quiz ng-scope')]//a)[1]", asserters.isDisplayed, 60000)
            .click();

    },

    getQuestionsCorrect: function (browser) {
        return browser
            .sleep(5000)
            .waitForElementByCss("div.progress-count span:nth-child(1)", asserters.isDisplayed, 60000)
            .text();
    },

    getTotalQuestions: function (browser) {
        return browser
            .waitForElementByCss("div.progress-count span:nth-child(3)", asserters.isDisplayed, 60000)
            .text();

    },

    verifyPracticeQuizResultPage: function (browser) {
        return browser
            .waitForElementByCss(".sliding-menu-button.ng-scope", asserters.isDisplayed, 2000);
    },

    getQuestionsIncorrect: function (browser) {
        return browser
            .waitForElementByXPath("//span[contains(.,'INCORRECT')]/following-sibling::span", asserters.isDisplayed, 60000)
            .text();
    },

    navigateToPracticeQuizFromDesiredChapter: function (browser, desiredChapter) {
        return browser
            .waitForElementByCss(".sliding-menu-button.ng-scope", asserters.isDisplayed, 2000)
            .click()
            .waitForElementByCss("nav.sliding-menu-content", asserters.isDisplayed, 5000)
            .sleep(5000)
            .waitForElementByXPath("//div[@class='select-style']/select", asserters.isDisplayed, 5000)
            .click()
            .sleep(2000)
            .waitForElementByXPath("//div[@class='select-style']/select//option[contains(.,'" + desiredChapter + "')]", asserters.isDisplayed, 5000)
            .click()
            .waitForElementByCss("section.actions button:nth-child(1)", asserters.isDisplayed, 10000)
            .click();
    },

    validateViewPastQuizButton: function(browser){
      return browser
          .waitForElementByCss(".sliding-menu-button.past-quizzes", asserters.isDisplayed, 2000)
          .text();
    },

    validateRetakeButton: function(browser){
      return browser
        .waitForElementByCss(".sliding-menu-button.retake-quiz", asserters.isDisplayed, 2000)
        .text();
    },

    validateExitButton: function(browser){
      return browser
        .waitForElementByCss(".exit", asserters.isDisplayed, 2000)
        .text();
    },

    fetchTheCountOfIncorrectAnswerFromTab: function(browser){
      return browser
        .waitForElementByCss("li[class='tab-pane active'] .badge", asserters.isDisplayed, 2000)
        .text();
    },

  fetchTheCountOfIncorrectAnswerFromList:function(browser,incorrectCountFromTab){
     return browser
          .waitForElementsByCss(".review-item.clearfix").then(function(list){
            console.log(_.size(list));
              console.log(report.reportHeader() +
                  report.stepStatus("Number of incorrect question"+incorrectCountFromTab+" is compared with answer display of incorrect question count: ",_.size(list),"success") +
                  report.reportFooter());
        });
    }
};
