var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../../test_data/data.json");
var report = require("../../support/reporting/reportgenerator");


module.exports = {

    SelectFlashcardTab: function (browser, done) {
        browser
            .waitForElementByXPath("//a[@class='ng-binding' and contains(.,'Flashcards')]", asserters.isDisplayed, 45000)
            .click()
            .elementByXPathSelectorWhenReady("//button[contains(@class,'add-flashcard')]", 10000)
            .isDisplayed()
            .should.become(true)
            .nodeify(done);
    },

    createFlashcard: function (browser) {
        return browser
            .sleep(3000)
            .elementByXPathSelectorWhenReady("//button[contains(@class,'add-flashcard')]", 10000)
            .click()
            .elementByXPathSelectorWhenReady("(//textarea[@name='front'])[1]", 5000)
            .click()
            .type("Text on the Front of the Flashcard created by Automation  ")
            .sleep(3000)
            .elementByXPathSelectorWhenReady("(//textarea[@name='back'])[1]", 5000)
            .click()
            .type("Text on the Back of the Flashcard created by Automation")
            .elementByXPathSelectorWhenReady("(//select[contains(@ng-model,'model.chapter')]//option[@value='0'])[1]", 10000)
            .click()
            .elementByXPathSelectorWhenReady("//cg-flashcard-form//div[@class='actions']//button[contains(.,'Done')]", 10000)
            .click()
            .elementByXPathSelectorWhenReady("//div[@class='flash-alert tip-alert' and contains(.,'Flashcard has been created')]", 10000)
            .isDisplayed()
            .should.become(true)
            .sleep(2000)
            .execute('window.scrollTo(0,0)')
            .sleep(1000);
    },

    createFlashcardWithFullDetails: function (browser,done,frontText,backText,chapter,userTag,comprehension) {
        browser
            .waitForElementByXPath("//button[contains(@class,'add-flashcard')]", asserters.isDisplayed, 90000)
            .click()
            .waitForElementByXPath("(//textarea[@name='front'])[1]", asserters.isDisplayed, 90000)
            .click()
            .type(frontText)
            .waitForElementByXPath("(//textarea[@name='back'])[1]", asserters.isDisplayed, 90000)
            .click()
            .type(backText)
            .waitForElementByXPath("//select", asserters.isDisplayed, 90000)
            .click()
            .waitForElementByXPath("(//select[contains(@ng-model,'model.chapter')]//option[contains(.,'"+chapter+"')])", asserters.isDisplayed, 90000)
            .click()
            .waitForElementByCss("#add-flashcard-form input", asserters.isDisplayed, 90000)
            .type(userTag)
            .type(wd.SPECIAL_KEYS.Enter)
            .waitForElementByXPath("//form[@id='add-flashcard-form']// div[@class='comprehension']//button[contains(.,'"+comprehension+"')]", asserters.isDisplayed, 90000)
            .click()
            .waitForElementByXPath("//cg-flashcard-form//div[@class='actions']//button[contains(.,'Done')]", asserters.isDisplayed, 90000)
            .click()
            .nodeify(done);
    },

    createFlashcardFromStudyBit: function (browser, done, backText) {
        browser
            .sleep(2000)
            .waitForElementByCss(".create-flashcard.ng-scope", asserters.isDisplayed, 90000)
            .click()
            .waitForElementByCss("#add-flashcard-form", asserters.isDisplayed, 90000)
            .waitForElementByXPath("(//textarea[@name='back'])[1]",asserters.isDisplayed, 90000)
            .type(backText)
            .waitForElementByXPath("//cg-flashcard-form//div[@class='actions']//button[contains(.,'Done')]", asserters.isDisplayed, 90000)
            .click()
            .nodeify(done);
    },
    selectUserFlashcardView: function (browser,done) {
      console.log("In the function");
         browser
            .execute("window.scrollTo(0,0)").then(function(){
              console.log("In then");
              browser
                .sleep(8000)
                .waitForElementByXPath("(//a[contains(.,'FILTER')])[1]", asserters.isDisplayed, 90000)
                .click()
                .sleep(2000)
                .waitForElementByXPath("//li[@class='ng-binding' and contains(text(),'My Flashcards')]", asserters.isDisplayed, 90000)
                .click()
                .sleep(2000)
                .waitForElementByXPath("//a[contains(.,'FILTER')]", asserters.isDisplayed, 90000)
                .click()
                .nodeify(done);
          });
    },
    NavigateToStudyBoard: function (browser, done) {
        browser
            .waitForElementByXPath("//div[@class='icon-studyboard-blue']", asserters.isDisplayed, 120000)
            .click()
            .waitForElementByXPath("//h1[contains(.,'StudyBoard')]", asserters.isDisplayed, 120000)
            .nodeify(done);
    },

    Verifykeytermflashcardselected: function (browser, done) {
        browser
            .sleep(5000)
            .waitForElementByXPath("(//a[contains(.,'FILTER')])[1]", asserters.isDisplayed, 90000)
            .click()
            .sleep(2000)
            .waitForElementByCss("#keyterm-flashcards li[class='ng-binding active']", asserters.isDisplayed, 90000).then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("Key Term Flash Card tab is Active", "success") +
                    report.reportFooter());
                browser
                    .sleep(2000)
                    .elementByXPathSelectorWhenReady("//a[contains(.,'FILTER')]", asserters.isDisplayed, 90000)
                    .click()
                    .nodeify(done);
            });

    },

    validateFrontContentOnReviewDeck: function(browser){
      return browser
          .waitForElementByCss(".flashcard.front .content",asserters.isDisplayed, 90000)
          .text();
    },

    validateBackContentOnReviewDeck: function(browser){
      return browser
          .waitForElementByCss(".flashcard.back .content",asserters.isDisplayed, 90000)
          .text();
    },

    validateUserFlashCardOnStudyBoard: function(browser){
      return browser
        .waitForElementByXPath("//div[contains(@class,'studybit flashcard text')]//div[@class='overlay']",asserters.isDisplayed, 90000)
        .click()
        .waitForElementByXPath("//li[contains(@class,'tag-item')]//span",asserters.isDisplayed, 90000)
        .text();
    }

};
