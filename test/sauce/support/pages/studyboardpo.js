var wd = require('wd');
var asserters = wd.asserters;
var report = require("../../support/reporting/reportgenerator");
var dataUtil = require("../../util/date-utility.js");
module.exports = {

    clickAndVerifyFilerPanel: function (browser) {
        return browser
            .waitForElementByCss(".filter-button.ng-binding", asserters.isDisplayed, 9000)
            .click()
            .waitForElementByCss(".filters", asserters.isDisplayed, 9000);
    },

    enterTagValueOnFilterPanel: function (browser, userTagValue) {
        return browser
            .sleep(2000)
            .waitForElementByCss("input[type='text']", asserters.isDisplayed, 90000)
            .click()
            .type(userTagValue)
            .sleep(2000)
            .waitForElementByXPath("//li[contains(@class,'suggestion-item')]", asserters.isDisplayed, 90000)
            .click()
            .sleep(2000);
    },

    verifyFilteredStudybit: function (browser, done, type, valueToBeTested, topicToBeTested, environment) {
        browser
            .waitForElementByCss(".overlay", asserters.isDisplayed, 9000);
        if (environment === "\"integration\"") {
            if (type === "userTag") {
                browser
                    .waitForElementByXPath("(//li[contains(@class,'tile')]//div[contains(@class,'text')])[1]", asserters.isDisplayed, 9000)
                    .click()
                    .sleep(2000)
                    .waitForElementByXPath("//li[@class='banner ng-scope']//li[@class='tags']/a", asserters.isDisplayed, 9000)
                    .click()
                    .sleep(2000)
                    .waitForElementByCss(".banner .chapter-origin.ng-scope", asserters.isDisplayed, 9000)
                    .text()
                    .should.eventually.include(topicToBeTested)
                    .waitForElementByXPath("//li[@class='banner ng-scope']//li[@class='tag-item ng-scope']/span", asserters.isDisplayed, 90000)
                    .text()
                    .should.eventually.include(valueToBeTested)
                    .sleep(1000)
                    .waitForElementByCss(".icon-close-x-blue", asserters.isDisplayed, 9000)
                    .click()
                    .sleep(2000)
                    .execute("window.scrollTo(0,0)")
                    .waitForElementByCss(".remove-button.ng-binding.ng-scope", asserters.isDisplayed, 9000)
                    .click()
                    .nodeify(done);

            } else if (type === "chapter") {
                browser
                    .waitForElementByXPath("(//div[contains(@class,'cg-checkbox ng-isolate-scope')])[1] /label", asserters.isDisplayed, 90000)
                    .click()
                    .execute("return document.getElementsByClassName('chapter').length").then(function (chaptercount) {
                        if (chaptercount === 1) {
                            browser
                                .waitForElementByCss(".chapter h1", asserters.isDisplayed, 10000)
                                .text()
                                .should.eventually.include(valueToBeTested)
                                .waitForElementByCss(".text .overlay", asserters.isDisplayed, 9000)
                                .click()
                                .waitForElementByCss(".banner .chapter-origin.ng-scope", asserters.isDisplayed, 9000)
                                .text()
                                .should.eventually.include(topicToBeTested)
                                .waitForElementByCss(".icon-close-x-blue", asserters.isDisplayed, 9000)
                                .click()
                                .sleep(2000)
                                .execute("window.scrollTo(0,1000)")
                                .waitForElementByCss(".keyterm .overlay", asserters.isDisplayed, 9000)
                                .click()
                                .waitForElementByCss(".banner .chapter-origin.ng-scope", asserters.isDisplayed, 9000)
                                .text()
                                .should.eventually.include(topicToBeTested)
                                .waitForElementByCss(".icon-close-x-blue", asserters.isDisplayed, 9000)
                                .click()
                                .sleep(2000)
                                .execute("window.scrollTo(0,0)")
                                .waitForElementByCss(".by-chapter .show-all-toggle.ng-scope", asserters.isDisplayed, 9000)
                                .click()
                                .nodeify(done);
                        }
                    });

            } else if (type === "comprehension") {
                browser
                    .execute("window.scrollTo(0,0)")
                    .waitForElementByCss(".by-comprehension .show-all-toggle.ng-scope", asserters.isDisplayed, 9000)
                    .click()
                    .waitForElementByCss(".by-comprehension ul li div[value='strong']", asserters.isDisplayed, 9000)
                    .click()
                    .execute("window.scrollTo(0,400)")
                    .waitForElementByCss(".overlay", asserters.isDisplayed, 9000)
                    .click()
                    .waitForElementByCss(".ng-scope.ng-binding.active", asserters.isDisplayed, 9000)
                    .text()
                    .should.eventually.include("STRONG")
                    .execute("window.scrollTo(0,0)")
                    .waitForElementByCss(".by-comprehension .show-all-toggle.ng-scope", asserters.isDisplayed, 9000)
                    .click()
                    .nodeify(done);
            }
        }
        else {
            if (type === "userTag") {
                browser
                    .waitForElementByXPath("(//li[contains(@class,'tile')]//div[contains(@class,'text')])[1]", asserters.isDisplayed, 9000)
                    .click()
                    .sleep(2000)
                    .waitForElementByCss(".banner .studyboard-accordion .tags:nth-child(2)", asserters.isDisplayed, 9000)
                    .click()
                    .sleep(2000)
                    .waitForElementByCss(".banner .chapter-origin.ng-scope", asserters.isDisplayed, 9000)
                    .text()
                    .should.eventually.include(topicToBeTested)
                    .waitForElementByXPath("(//span[contains(@ng-bind,'getDisplayText(tag)')])[last()]", asserters.isDisplayed, 90000)
                    .text()
                    .should.eventually.include(valueToBeTested)
                    .sleep(1000)
                    .waitForElementByCss(".icon-close-x-blue", asserters.isDisplayed, 9000)
                    .click()
                    .sleep(2000)
                    .execute("window.scrollTo(0,0)")
                    .waitForElementByCss(".remove-button.ng-binding.ng-scope", asserters.isDisplayed, 9000)
                    .click()
                    .nodeify(done);

            } else if (type === "chapter") {
                browser
                    .waitForElementByXPath("(//div[contains(@class,'cg-checkbox ng-isolate-scope')])[1] /label", asserters.isDisplayed, 90000)
                    .click()
                    .execute("return document.getElementsByClassName('chapter').length").then(function (chaptercount) {
                        if (chaptercount === 1) {
                            browser
                                .waitForElementByCss(".chapter h1", asserters.isDisplayed, 10000)
                                .text()
                                .should.eventually.include(valueToBeTested)
                                .waitForElementByCss(".text .overlay", asserters.isDisplayed, 9000)
                                .click()
                                .waitForElementByCss(".banner .chapter-origin.ng-scope", asserters.isDisplayed, 9000)
                                .text()
                                .should.eventually.include(topicToBeTested)
                                .waitForElementByCss(".icon-close-x-blue", asserters.isDisplayed, 9000)
                                .click()
                                .sleep(2000)
                                .execute("window.scrollTo(0,1000)")
                                .waitForElementByCss(".keyterm .overlay", asserters.isDisplayed, 9000)
                                .click()
                                .waitForElementByCss(".banner .chapter-origin.ng-scope", asserters.isDisplayed, 9000)
                                .text()
                                .should.eventually.include(topicToBeTested)
                                .waitForElementByCss(".icon-close-x-blue", asserters.isDisplayed, 9000)
                                .click()
                                .sleep(2000)
                                .execute("window.scrollTo(0,0)")
                                .waitForElementByCss(".by-chapter .show-all-toggle.ng-scope", asserters.isDisplayed, 9000)
                                .click()
                                .nodeify(done);
                        }
                    });

            } else if (type === "comprehension") {
                browser
                    .execute("window.scrollTo(0,0)")
                    .waitForElementByCss(".by-comprehension .show-all-toggle.ng-scope", asserters.isDisplayed, 9000)
                    .click()
                    .waitForElementByCss(".by-comprehension ul li div[value='strong']", asserters.isDisplayed, 9000)
                    .click()
                    .execute("window.scrollTo(0,400)")
                    .waitForElementByCss(".overlay", asserters.isDisplayed, 9000)
                    .click()
                    .waitForElementByCss(".ng-scope.ng-binding.active", asserters.isDisplayed, 9000)
                    .text()
                    .should.eventually.include("STRONG")
                    .execute("window.scrollTo(0,0)")
                    .waitForElementByCss(".by-comprehension .show-all-toggle.ng-scope", asserters.isDisplayed, 9000)
                    .click()
                    .nodeify(done);
            }
        }
    },

    clearAllFilters: function (browser, done) {
        browser
            .waitForElementByCss(".clear-all-filters.ng-scope", asserters.isDisplayed, 90000)
            .click()
            .nodeify(done);
    },
    clearAllChapterFilters: function (browser, done) {
        browser
            .execute("document.getElementsByClassName('show-all-toggle')[0].click()")
            .nodeify(done);
    },
    changeComprehensionOfStudybit: function (browser, done) {
        browser
            .waitForElementByCss(".keyterm .overlay", asserters.isDisplayed, 90000)
            .click()
            .waitForElementByXPath("//div[contains(@class,'button-group')] /button[contains(text(),'STRONG')]", asserters.isDisplayed, 90000)
            .click()
            .waitForElementByCss(".save.ng-binding", asserters.isDisplayed, 90000)
            .click()
            .waitForElementByCss(".icon-close-x-blue", asserters.isDisplayed, 90000)
            .click()
            .sleep(2000)
            .nodeify(done);
    },
    clearAllComprehensionFilter: function(browser){
    return  browser
      .waitForElementByXPath("//h6[contains(.,'My Understanding')]/following-sibling::a",asserters.isDisplayed, 90000)
      .click();
    },
    clickOnClearFilterThenSelectOne:function(browser,filterType,filterVal){
      return  browser
        .waitForElementByXPath("//div[contains(@class,'"+filterType+"')]//a",asserters.isDisplayed, 90000)
        .click()
        .waitForElementByXPath("//div[contains(@class,'"+filterType+"')]//ul//li//label[contains(text(),'"+filterVal+"')]",asserters.isDisplayed, 90000)
        .click();

    },
    selectAllFilters:function(browser){
      return  browser
        .waitForElementByCss(".select-all-filters.ng-scope",asserters.isDisplayed, 90000)
        .click();

    },
    deleteUserTagFromFilter: function(browser){
      return  browser
        .waitForElementByCss(".remove-button.ng-binding.ng-scope",asserters.isDisplayed, 90000)
        .click();

    }


};
