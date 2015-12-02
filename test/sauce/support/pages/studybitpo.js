/**
 * Created by nbalasundaram on 10/1/15.
 */
var wd = require('wd');
var asserters = wd.asserters;
var report = require("../../support/reporting/reportgenerator");
var dataUtil = require("../../util/date-utility.js");
var loginPage = require("./loginpo");
var _ = require('underscore');

module.exports = {


    createTextStudyBit: function (browser, done, studybitId, publishertag, usertag, notes, comprehension, windowScrollY) {

        return browser
            .execute("window.scrollTo(0," + windowScrollY + ")")
            .waitForElementByCss("#" + studybitId + " span:nth-child(1)", asserters.isDisplayed, 90000)
            .click()
            .sleep(5000)
            .elementByCssSelectorWhenReady(".studybit-menu.text.unassigned.editing", 10000)
            .isDisplayed()
            .should.become(true)
            .waitForElementByCss("ul.tag-list li.not-removable:nth-child(1) span", asserters.isDisplayed, 90000)
            .text()
            .then(
            function (text) {
                if (text.indexOf(publishertag) > -1) {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("STUDYBIT POPUP BEFORE SAVE :: Successful Validation of the retrieval of Publisher Concept Tag ", publishertag, "success") +
                        report.reportFooter());

                    browser.sleep(5000)
                        .waitForElementByXPath("(//textarea[contains(@class,'notes')])", asserters.isDisplayed, 60000)
                        .click()
                        .sleep(1000)
                        .type(notes)
                        .sleep(1000)
                        .waitForElementByCss("div.tags input", asserters.isDisplayed, asserters.isDisplayed, 90000)
                        .type(usertag)
                        .type(wd.SPECIAL_KEYS.Enter)
                        .waitForElementByXPath("//div[contains(@class,'studybit-menu text unassigned editing')]//div[@class='actions']/button[contains(@class,'save')]", asserters.isDisplayed, 60000)
                        .click()
                        .waitForElementByXPath("(//div[contains(@class,'studybit-icon text unassigned saved')])[1]", asserters.isDisplayed, 60000)
                        .isDisplayed()
                        .should.become(true)
                        .nodeify(done);

                } else {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData(" Failure in retrieval of Publisher Concept Tag ", publishertag, "failure") +
                        report.reportFooter());
                    done();
                }
            });


    },
    validateTextStudyBitSave: function (browser, done, studybitId, publishertag, usertag, notes, comprehension, windowScrollY) {
        browser
            .execute("location.reload()")
            .sleep(10000)
            .execute('window.scrollTo(0,0)')
            .execute("window.scrollTo(0," + windowScrollY + ")")
            .elementByCssSelectorWhenReady(".studybit-icon.text.saved", asserters.isDisplayed, 90000)
            .click()
            .then(function () {

                browser.waitForElementByCss("ul.tag-list li.not-removable:nth-child(1) span", asserters.isDisplayed, 90000)
                    .text()
                    .then(
                    function (text) {
                        if (text.indexOf(publishertag) > -1) {
                            console.log(report.reportHeader() +
                                report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE:: Saved Text StudyBit has the Publisher Concept ", publishertag, "success") +
                                report.reportFooter());

                            browser.waitForElementByXPath("//li[@class='tag-item ng-scope']/span[text()='" + usertag + "']", asserters.isDisplayed, 90000)
                                .then(function () {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE ::Saved Text StudyBit has the user concept ", usertag, "success") +
                                        report.reportFooter());

                                    browser.execute("return document.getElementsByTagName(\"textarea\")[0].value").then(
                                        function (notesSaved) {
                                            if (notesSaved.indexOf(notes) > -1) {
                                                console.log(report.reportHeader() +
                                                    report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE :: Saved Text StudyBit has the user notes saved ", notes, "success") +
                                                    report.reportFooter());
                                                done();
                                            }
                                            else {
                                                console.log(report.reportHeader() +
                                                    report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE :: Saved Text StudyBit does not have the user notes saved ", usertag, "failure") +
                                                    report.reportFooter());
                                                done();
                                            }
                                        }
                                    );

                                });
                        }
                        else {
                            console.log(report.reportHeader() +
                                report.stepStatusWithData(" Saved Text StudyBit has the Publisher Concept ", publishertag, "failure") +
                                report.reportFooter());
                            done();
                        }
                    });
            });
    },
    createKeyTermStudyBit: function (browser, done, keytermSBId, definition, comprehension, publishertag, notes, usertag, windowScrollY) {
        return browser
            .execute("location.reload()")
            .sleep(10000)
            .execute("window.scrollTo(0," + windowScrollY + ")")
            .sleep(2000)
            .waitForElementByCss("#" + keytermSBId + "", asserters.isDisplayed, 90000)
            .click()
            .sleep(2000)
            .elementByCssSelectorWhenReady(".studybit-menu.keyterm.unassigned.editing", 10000)
            .isDisplayed()
            .should.become(true)
            .waitForElementByCss("ul.tag-list li.not-removable:nth-child(1) span", asserters.isDisplayed, 90000)
            .text()

            .then(
            function (text) {
                if (text.indexOf(publishertag) > -1) {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("STUDYBIT POPUP BEFORE SAVE ::Successful Validation of the retrieval of Publisher Concept Tag ", publishertag, "success") +
                        report.reportFooter());
                    browser.sleep(5000)
                        .elementByCssSelectorWhenReady(".content.ng-binding", 10000)
                        .text()
                        .should.eventually.include(definition)
                        .elementByXPathSelectorWhenReady("(//textarea[contains(@class,'notes')])", 10000)
                        .click()
                        .sleep(1000)
                        .type(notes)
                        .sleep(1000)
                        .elementByXPathSelectorWhenReady("//button[contains(@class,'ng-scope ng-binding')and contains(.,'" + comprehension + "')]")
                        .click()
                        .waitForElementByCss("div.tags input", asserters.isDisplayed, 90000)
                        .type(usertag)
                        .type(wd.SPECIAL_KEYS.Enter)
                        .elementByCssSelectorWhenReady(".save.ng-scope", 10000)
                        .click()
                        .sleep(2000)
                        .execute("window.scrollTo(0," + windowScrollY + ")")
                        .sleep(2000)
                        .elementByCssSelectorWhenReady(".studybit-icon.keyterm.fair.saved", 10000)
                        .isDisplayed()
                        .should.become(true)
                        .nodeify(done);

                }
                else {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData(" Failure in retrieval of Publisher Concept Tag of key term StudyBit", publishertag, "failure") +
                        report.reportFooter());
                    done();
                }
            });


    },
    validateKeyTermStudyBitSave: function (browser, done, keytermSBId, publishertag, usertag, notes, comprehension, windowScrollY, keytermDef) {
        return browser
            .execute("location.reload()")
            .sleep(10000)
            .execute("window.scrollTo(0," + windowScrollY + ")")
            .elementByCssSelectorWhenReady(".studybit-icon.keyterm.fair.saved", asserters.isDisplayed, 90000)
            .click()
            .then(function () {
                browser
                    .waitForElementByXPath("//div[contains(@class,'studybit-menu keyterm')]//span[@class='keytermdef']", asserters.isDisplayed, 90000)
                    .text().should.eventually.include(keytermDef)
                    .waitForElementByCss("ul.tag-list li.not-removable:nth-child(1) span", asserters.isDisplayed, 90000)
                    .text()
                    .then(
                    function (text) {
                        console.log("Publisher tag as on application UI" + text);
                        if (text.indexOf(publishertag) > -1) {
                            console.log("Expected publisher tag found");
                            console.log(report.reportHeader() +
                                report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE : Saved KeyTerm StudyBit has the Publisher Concept ", publishertag, "success") +
                                report.reportFooter());

                            browser
                                .waitForElementByXPath("//li[@class='tag-item ng-scope']/span[text()='" + usertag + "']", asserters.isDisplayed, 90000)
                                .then(function () {
                                    console.log("User tag found");
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE : Saved KeyTerm StudyBit has the user concept ", usertag, "success") +
                                        report.reportFooter());
                                    done();
                                });
                        }
                        else {

                            console.log(report.reportHeader() +
                                report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE :  Saved Key Term StudyBit has the Publisher Concept ", publishertag, "failure") +
                                report.reportFooter());
                            done();
                        }
                    });
            });
    },

    navigateToStudyBoard: function (browser, done) {
        browser
            .waitForElementByXPath("//div[@class='icon-studyboard-blue']", asserters.isDisplayed, 120000)
            .click()
            .waitForElementByXPath("//h1[contains(.,'StudyBoard')]", asserters.isDisplayed, 120000)
            .nodeify(done);
    },

    validateTheUnExpandedStudyBitTile: function (browser) {

        return browser
            .sleep(5000)
            .waitForElementByXPath("(//li[contains(@class,'tile')]//div[contains(@class,'studybit text')])[1]", asserters.isDisplayed, 10000)
            .elementByCssSelectorWhenReady(".studybit.text.unassigned time", 1200)
            .text()
            .should.eventually.include(dataUtil.getDateFormatForStudyBoard())
            .sleep(3000)
            .waitForElementByCss(".cl-atom.highlight.unassigned.persisted", asserters.isDisplayed, 10000)
            .execute("return getComputedStyle(document.querySelector('div.studybit.text.unassigned'), ':after').content");

    },


    validateTextStudyBitOnStudyBoard: function (browser, done, chaptername, notes, concepts, usertag) {
        this.validateTheUnExpandedStudyBitTile(browser)
            .then(function (contenturl) {
                if (contenturl.indexOf("studybit-text-default") > -1) {

                    console.log(report.reportHeader() +
                        report.stepStatusWithData("STUDYBOARD :: Saved Text StudyBit has the studybit icon displayed correctly", "success") +
                        report.reportFooter());

                    browser
                        .elementByCssSelectorWhenReady(".studybit.text", asserters.isDisplayed, 2000).click().then(function () {

                            browser.elementByCssSelectorWhenReady(".banner .studybit .chapter-origin", 2000)
                                .text()
                                .should.eventually.include(chaptername)
                                .execute("return document.getElementsByTagName(\"textarea\")[0].value")
                                .then(function (notestext) {
                                    if (notestext.indexOf(notes) > -1) {
                                        console.log(report.reportHeader() +
                                            report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: Saved Text StudyBit has the notes \"", notestext + "\" displayed correctly on the expanded StudyBit tile of Studyboard", "success") +
                                            report.reportFooter());
                                        browser
                                            .elementByCssSelectorWhenReady(".tags .accordion-header.ng-binding", 2000)
                                            .click()
                                            .elementByCssSelectorWhenReady(".tags.is-expanded .not-removable span", 2000)
                                            .text()
                                            .should.eventually.include(concepts)
                                            .elementByXPathSelectorWhenReady("//li[@class='tag-item ng-scope']", 2000)
                                            .text()
                                            .should.eventually.include(usertag)
                                            .elementByCssSelectorWhenReady(".more .accordion-header.ng-binding", asserters.isDisplayed, 5000).click().then(function () {

                                                browser.execute("return document.evaluate(\"count(//li[@ng-class='item.itemType'])\", document, null, XPathResult. NUMBER_TYPE, null ).numberValue").then(
                                                    function (countOfRelatedItems) {
                                                        if (countOfRelatedItems > 2) {
                                                            browser.waitForElementByXPath("(//li[@ng-class='item.itemType'])[2]/a", asserters.isDisplayed, 10000).text().then(function (relateditem1) {
                                                                console.log(report.reportHeader() +
                                                                    report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: The First Related item displayed on the StudyBit ", relateditem1, "success") +
                                                                    report.reportFooter());
                                                                browser.waitForElementByXPath("(//li[@ng-class='item.itemType'])[3]/a", asserters.isDisplayed, 10000).text().then(function (relateditem2) {
                                                                    console.log(report.reportHeader() +
                                                                        report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: The Second Related item displayed on the StudyBit ", relateditem2, "success") +
                                                                        report.reportFooter());

                                                                    done();
                                                                });
                                                            });
                                                        } else {
                                                            console.log(report.reportHeader() +
                                                                report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: Related items are not displayed on the Studybit", "failure") +
                                                                report.reportFooter());
                                                            done();
                                                        }
                                                    });


                                            });

                                    } else {
                                        console.log(report.reportHeader() +
                                            report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: Problems on notes save on studybit display on studyboard", "failure") +
                                            report.reportFooter());
                                        done();
                                    }
                                });

                        });
                } else {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: Problems on studybit display", "failure") +
                        report.reportFooter());
                    done();
                }
            });


    },

    createExhibitStudyBit: function (browser, done, studybitId, publishertags, usertag, notes, windowScrollY) {
        return browser
            .execute("window.scrollTo(0," + windowScrollY + ")")
            .waitForElementByCss("#" + studybitId + " button", asserters.isDisplayed, 60000)
            .click()
            .sleep(5000)
            .waitForElementByCss(".studybit-menu.table.unassigned.editing", asserters.isDisplayed, 90000)
            .isDisplayed()
            .should.become(true)
            .waitForElementByCss("ul.tag-list li.not-removable:nth-child(1) span", asserters.isDisplayed, 90000)
            .text()
            .then(
            function (text) {
                //console.log("publisher tags" +text);

                if (_.contains(publishertags, text)) {
                    _.each(publishertags, function (value) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("STUDYBIT POPUP BEFORE SAVE :: Successful Validation of the retrieval of one of the Publisher Concept Tags ", value, "success") +
                            report.reportFooter());
                    });

                    browser.sleep(5000)
                        .waitForElementByXPath("(//textarea[contains(@class,'notes')])", asserters.isDisplayed, 60000)
                        .click()
                        .sleep(1000)
                        .type(notes)
                        .sleep(1000)
                        .waitForElementByCss("div.tags input", asserters.isDisplayed, asserters.isDisplayed, 90000)
                        .type(usertag)
                        .type(wd.SPECIAL_KEYS.Enter)
                        .waitForElementByXPath("//div[contains(@class,'studybit-menu table unassigned editing')]//div[@class='actions']/button[contains(@class,'save')]", asserters.isDisplayed, 60000)
                        .click()
                        .waitForElementByXPath("(//div[contains(@class,'studybit-icon table unassigned saved')])[1]", asserters.isDisplayed, 60000)
                        .isDisplayed()
                        .should.become(true)
                        .nodeify(done);

                } else {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData(" Failure in retrieval of Publisher Concept Tag ", text, "failure") +
                        report.reportFooter());
                    done();
                }
            });
    },

    validateExhibitStudyBitSave: function (browser, done, studybitId, publishertags, usertag, notes, windowScrollY) {
        browser
            .execute("location.reload()")
            .sleep(10000)
            .execute('window.scrollTo(0,0)')
            .execute("window.scrollTo(0," + windowScrollY + ")")
            .waitForElementByCss(".studybit-icon.table.unassigned.saved", asserters.isDisplayed, 90000)
            .click()
            .then(function () {

                browser.waitForElementByCss("ul.tag-list li.not-removable:nth-child(1) span", asserters.isDisplayed, 90000)
                    .text()
                    .then(
                    function (text) {
                        if (_.contains(publishertags, text)) {
                            _.each(publishertags, function (value) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE :: Successful Validation of the retrieval of one of the Publisher Concept Tags ", value, "success") +
                                    report.reportFooter());
                            });

                            browser.waitForElementByXPath("//li[@class='tag-item ng-scope']/span[text()='" + usertag + "']", asserters.isDisplayed, 90000)
                                .then(function () {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE ::Saved Exhibit StudyBit has the user concept ", usertag, "success") +
                                        report.reportFooter());

                                    browser.execute("return document.getElementsByTagName(\"textarea\")[0].value").then(
                                        function (notesSaved) {
                                            if (notesSaved.indexOf(notes) > -1) {
                                                console.log(report.reportHeader() +
                                                    report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE :: Saved Exhibit StudyBit has the user notes saved ", notes, "success") +
                                                    report.reportFooter());
                                                done();
                                            }
                                            else {
                                                console.log(report.reportHeader() +
                                                    report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE :: Saved Exhibit StudyBit does not have the user notes saved ", usertag, "failure") +
                                                    report.reportFooter());
                                                done();
                                            }
                                        }
                                    );

                                });
                        }
                        else {
                            console.log(report.reportHeader() +
                                report.stepStatusWithData(" Saved Exhibit StudyBit has the Publisher Concept ", text, "failure") +
                                report.reportFooter());
                            done();
                        }
                    });
            });
    },

    createImageStudyBit: function (browser, done, studybitId, publishertags, usertag, notes, windowScrollY) {
        return browser
            .execute("window.scrollTo(0," + windowScrollY + ")")
            .waitForElementByCss("#" + studybitId + " button", asserters.isDisplayed, 60000)
            .click()
            .sleep(5000)
            .waitForElementByCss(".studybit-menu.image.unassigned.editing", asserters.isDisplayed, 90000)
            .isDisplayed()
            .should.become(true)
            .waitForElementByCss("ul.tag-list li.not-removable:nth-child(1) span", asserters.isDisplayed, 90000)
            .text()
            .then(
            function (text) {

                if (_.contains(publishertags, text)) {
                    _.each(publishertags, function (value) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("STUDYBIT POPUP BEFORE SAVE :: Successful Validation of the retrieval of one of the Publisher Concept Tags ", value, "success") +
                            report.reportFooter());
                    });


                    browser
                        .sleep(2000)
                        .waitForElementByXPath("(//textarea[contains(@class,'notes')])", asserters.isDisplayed, 60000)
                        .sleep(1000)
                        .type(notes)
                        .sleep(1000)
                        .waitForElementByCss("div.tags input", asserters.isDisplayed, asserters.isDisplayed, 90000)
                        .type(usertag)
                        .type(wd.SPECIAL_KEYS.Enter)
                        .waitForElementByXPath("//div[contains(@class,'studybit-menu image unassigned editing')]//div[@class='actions']/button[contains(@class,'save')]", asserters.isDisplayed, 60000)
                        .click()
                        .waitForElementByXPath("(//div[contains(@class,'studybit-icon image unassigned saved')])[1]", asserters.isDisplayed, 60000)
                        .isDisplayed()
                        .should.become(true)
                        .nodeify(done);

                } else {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData(" Failure in retrieval of Publisher Concept Tag ", publishertag, "failure") +
                        report.reportFooter());
                    done();
                }
            });
    },

    validateImageStudyBitSave: function (browser, done, studybitId, publishertags, usertag, notes, windowScrollY) {
        browser
            .execute("location.reload()")
            .sleep(10000)
            .execute('window.scrollTo(0,0)')
            .execute("window.scrollTo(0," + windowScrollY + ")")
            .waitForElementByCss(".studybit-icon.image.unassigned.saved", asserters.isDisplayed, 90000)
            .click()
            .then(function () {

                browser.waitForElementByCss("ul.tag-list li.not-removable:nth-child(1) span", asserters.isDisplayed, 90000)
                    .text()
                    .then(
                    function (text) {
                        if (_.contains(publishertags, text)) {
                            _.each(publishertags, function (value) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE :: Successful Validation of the retrieval of one of the Publisher Concept Tags ", value, "success") +
                                    report.reportFooter());
                            });

                            browser.waitForElementByXPath("//li[@class='tag-item ng-scope']/span[text()='" + usertag + "']", asserters.isDisplayed, 90000)
                                .then(function () {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE ::Saved Image StudyBit has the user concept ", usertag, "success") +
                                        report.reportFooter());

                                    browser.execute("return document.getElementsByTagName(\"textarea\")[0].value").then(
                                        function (notesSaved) {
                                            if (notesSaved.indexOf(notes) > -1) {
                                                console.log(report.reportHeader() +
                                                    report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE :: Saved Image StudyBit has the user notes saved ", notes, "success") +
                                                    report.reportFooter());
                                                done();
                                            }
                                            else {
                                                console.log(report.reportHeader() +
                                                    report.stepStatusWithData("STUDYBIT POPUP AFTER SAVE :: Saved Image StudyBit does not have the user notes saved ", usertag, "failure") +
                                                    report.reportFooter());
                                                done();
                                            }
                                        }
                                    );

                                });
                        }
                        else {
                            console.log(report.reportHeader() +
                                report.stepStatusWithData(" Saved Image StudyBit has the Publisher Concept ", publishertag, "failure") +
                                report.reportFooter());
                            done();
                        }
                    });
            });
    },

    validateTheBottomMostExhibit: function (browser, bottomMostexhibitId) {
        return browser
            .sleep(2000)
            .execute("document.getElementById('" + bottomMostexhibitId + "').scrollIntoView()");
    },

    validateAndNavigateToInlineLink: function (browser) {
        return browser
            .waitForElementByXPath("//h1[contains(.,'" + loginPage.getProductData().inline_links.chapter.title + "')]", asserters.isDisplayed, 90000)
            .waitForElementByCss(".chapter-ordinal.ng-binding", asserters.isDisplayed, 90000)
            .text().should.eventually.include(loginPage.getProductData().inline_links.chapter.ordinal)

    },


    validateExhibitStudyBitOnStudyBoard: function (browser, done, chaptername, notes, concepts, usertag) {
        browser
            .elementByCssSelectorWhenReady(".studybit.table", asserters.isDisplayed, 2000)
            .click().then(function () {
                browser
                    .elementByCssSelectorWhenReady(".banner .studybit .chapter-origin", 2000)
                    .text()
                    .should.eventually.include(chaptername).execute("return document.getElementsByTagName(\"textarea\")[0].value")
                    .then(function (notestext) {
                        if (notestext.indexOf(notes) > -1) {
                            console.log(report.reportHeader() + report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: Saved Exhibit StudyBit has the notes \"", notestext + "\" displayed correctly on the expanded StudyBit tile of Studyboard", "success") + report.reportFooter());
                            browser
                                .elementByCssSelectorWhenReady(".tags .accordion-header.ng-binding", 2000)
                                .click()
                                .elementByXPathSelectorWhenReady("//ul[@class='tag-list ']/li/span[contains(text(),'" + concepts + "')]")
                                .elementByXPathSelectorWhenReady("//li[@class='tag-item ng-scope']", 2000)
                                .text().should.eventually.include(usertag)
                                .elementByCssSelectorWhenReady(".more .accordion-header.ng-binding", asserters.isDisplayed, 5000)
                                .click().then(function () {
                                    browser
                                        .execute("return document.evaluate(\"count(//li[@ng-class='item.itemType'])\", document, null, XPathResult. NUMBER_TYPE, null ).numberValue")
                                        .then(function (countOfRelatedItems) {
                                            if (countOfRelatedItems > 2) {
                                                browser
                                                    .waitForElementByXPath("(//li[@ng-class='item.itemType'])[2]/a", asserters.isDisplayed, 10000)
                                                    .text().then(function (relateditem1) {
                                                        console.log(report.reportHeader() + report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: The First Related item displayed on the StudyBit ", relateditem1, "success") + report.reportFooter());
                                                        browser
                                                            .waitForElementByXPath("(//li[@ng-class='item.itemType'])[3]/a", asserters.isDisplayed, 10000)
                                                            .text().then(function (relateditem2) {
                                                                console.log(report.reportHeader() + report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: The Second Related item displayed on the StudyBit ", relateditem2, "success") + report.reportFooter());
                                                                done();
                                                            });
                                                    });
                                            } else {
                                                console.log(report.reportHeader()
                                                    + report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: Related items are not displayed on the Studybit", "failure")
                                                    + report.reportFooter());
                                                done();
                                            }
                                        });
                                });

                        } else {
                            console.log(report.reportHeader()
                                + report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: Problems on notes save on studybit display on studyboard", "failure")
                                + report.reportFooter());
                            done();
                        }
                    });
            });

    },

    validateImageStudyBitOnStudyBoard: function (browser, done, chaptername, notes, concepts, usertag) {
        browser
            .refresh()
            .sleep(5000)
            .waitForElementByCss(".studybit.image", asserters.isDisplayed, 2000)
            .click().then(function () {
                browser
                    .waitForElementByCss(".banner .studybit .chapter-origin", 2000)
                    .text()
                    .should.eventually.include(chaptername).execute("return document.getElementsByTagName(\"textarea\")[0].value")
                    .then(function (notestext) {

                        if (notestext.indexOf(notes) > -1) {
                            console.log(report.reportHeader() + report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: Saved Image StudyBit has the notes \"", notestext + "\" displayed correctly on the expanded StudyBit tile of Studyboard", "success") + report.reportFooter());
                            browser
                                .waitForElementByCss(".tags .accordion-header.ng-binding", 2000)
                                .click()
                                .sleep(2000)
                                .waitForElementByXPath("//ul[@class='tag-list ']/li/span[contains(text(),'" + concepts + "')]")
                                .waitForElementByXPath("//li[@class='tag-item ng-scope']", 2000)
                                .text().should.eventually.include(usertag)
                                .waitForElementByCss(".more .accordion-header.ng-binding", asserters.isDisplayed, 5000)
                                .click().then(function () {
                                    browser
                                        .execute("return document.evaluate(\"count(//li[@ng-class='item.itemType'])\", document, null, XPathResult. NUMBER_TYPE, null ).numberValue")
                                        .then(function (countOfRelatedItems) {
                                            if (countOfRelatedItems > 2) {
                                                browser
                                                    .waitForElementByXPath("(//li[@ng-class='item.itemType'])[2]/a", asserters.isDisplayed, 10000)
                                                    .text().then(function (relateditem1) {
                                                        console.log(report.reportHeader() + report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: The First Related item displayed on the StudyBit ", relateditem1, "success") + report.reportFooter());
                                                        browser
                                                            .waitForElementByXPath("(//li[@ng-class='item.itemType'])[3]/a", asserters.isDisplayed, 10000)
                                                            .text().then(function (relateditem2) {
                                                                console.log(report.reportHeader() +
                                                                report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: The Second Related item displayed on the StudyBit :",relateditem2, "success")
                                                                + report.reportFooter());
                                                                done();
                                                            });
                                                    });
                                            } else {
                                                console.log(report.reportHeader()
                                                    + report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: Related items are not displayed on the Studybit", "failure")
                                                    + report.reportFooter());
                                                done();
                                            }
                                        });
                                });

                        } else {
                            console.log(report.reportHeader()
                                + report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT TILE :: Problems on notes save on studybit display on studyboard", "failure")
                                + report.reportFooter());
                            done();
                        }
                    });
            });
    },

    changeComprehensionOfStudybit: function (browser,comprehensionVal) {
        return browser
            .waitForElementByXPath("//form//section//div[@class='comprehension']//button[contains(text(),'"+comprehensionVal+"')]", asserters.isDisplayed, 90000)
            .click();

    },

    closeExpandedStudybit: function(browser){
      return browser
          .waitForElementByCss(".icon-close-x-blue", asserters.isDisplayed, 5000).then(function (close) {
              close.click();
          });
    },

    clickOnSaveButton: function(browser){
      return browser
      .waitForElementByCss(".save.ng-binding", asserters.isDisplayed, 5000)
      .click();

    },

    validateEditedTextStudybit: function(browser,comprehensionText){
      return browser
      .refresh()
      .waitForElementByXPath("(//li[contains(@class,'tile')]//div[contains(@class,'studybit keyterm')])[1]", asserters.isDisplayed, 5000)
      .click()
      .waitForElementByXPath("//button[@class='ng-scope ng-binding active']", asserters.isDisplayed, 5000)
      .text().then(function(comprehensionTextValue){
        if(comprehensionTextValue.indexOf(comprehensionText)>-1){
          console.log(report.reportHeader()
              + report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT COMPREHENSION LAVEL TEXT "+comprehensionTextValue+" compared with text ",comprehensionText,"success")
              + report.reportFooter());
        }else {
          console.log(report.reportHeader()
              + report.stepStatusWithData("STUDYBOARD :: EXPANDED STUDYBIT COMPREHENSION LAVEL TEXT "+comprehensionTextValue+" compared with text ",comprehensionText,"failure")
              + report.reportFooter());
        }
      });

    },

    VerifyKeytermStudybit:function(browser, keyTermSBValidationStatusOnSBrd){
      return browser
            .waitForElementByCss("div.icon-studyboard-blue", asserters.isDisplayed, 30000).then(function () {
                browser.waitForElementByXPath("(//li[contains(@class,'tile')]//div[contains(@class,'studybit keyterm')])[1]", asserters.isDisplayed, 30000)
                    .then(function () {
                        keyTermSBValidationStatusOnSBrd = "success";
                        console.log(report.reportHeader() +
                            report.stepStatus("KeyTerm Validation status on StudyBoard ", keyTermSBValidationStatusOnSBrd) +
                            report.reportFooter());
                    });
            });
    },

    editUserTagOfKeytermStudybit: function(browser, editedUserTagText){
      return browser
            .waitForElementByXPath("(//li[contains(@class,'tile')]//div[contains(@class,'studybit keyterm')])[1]", asserters.isDisplayed, 30000)
            .click()
            .waitForElementByXPath("//section[@class='studybit-details']//ul//li//a[contains(text(),'TAGS')]", asserters.isDisplayed, 30000)
            .click()
            .waitForElementByXPath("//section[@class='studybit-details']//ul//li[@class='tags is-expanded']//li[@class='tag-item ng-scope']//a", asserters.isDisplayed, 30000)
            .click()
            .waitForElementByCss(".tags.is-expanded div.tags input", asserters.isDisplayed, 90000)
            .type(editedUserTagText)
            .type(wd.SPECIAL_KEYS.Enter);
    },

    verifyEditedUserTagOfKeytermStudybit:function(browser, editedUserTagText){
      return browser
        .refresh()
        .waitForElementByXPath("(//li[contains(@class,'tile')]//div[contains(@class,'studybit keyterm')])[1]", asserters.isDisplayed, 30000)
        .click()
        .waitForElementByXPath("//section[@class='studybit-details']//ul//li//a[contains(text(),'TAGS')]", asserters.isDisplayed, 30000)
        .click()
        .waitForElementByXPath("//li[@class='tag-item ng-scope']//span", asserters.isDisplayed, 30000)
        .text().then(function(editedText){
          if(editedText.indexOf(editedUserTagText)>-1){
            console.log(report.reportHeader()
                + report.stepStatusWithData("STUDYBOARD :: EXPANDED KEY TERM STUDYBIT USER TAG "+editedText+" compared with text ",editedUserTagText,"success")
                + report.reportFooter());
          }else {
            console.log(report.reportHeader()
                + report.stepStatusWithData("STUDYBOARD :: EXPANDED KEY TERM STUDYBIT USER TAG "+editedText+" compared with text ",editedUserTagText,"failure")
                + report.reportFooter());
          }
        });
    },

    verifyFilteredStudybit: function(browser,element){
      return browser
      .waitForElementByCss(element, asserters.isDisplayed, 30000)
      .isDisplayed()
      .should.become(true)
      .waitForElementByCss(element, asserters.isDisplayed, 30000)
      .text();
    },

    openKeyTermStudybit:function(browser){
      return browser
            .waitForElementByXPath("(//li[contains(@class,'tile')]//div[contains(@class,'studybit keyterm')])[1]", asserters.isDisplayed, 30000)
            .click();
    },

    clickOnTag:function(browser){
      return browser
        .waitForElementByXPath("//section[@class='studybit-details']//ul//li//a[contains(text(),'TAGS')]", asserters.isDisplayed, 30000)
        .click();
    },

    deleteUserTag: function(browser){
      return browser
      .waitForElementByXPath("//section[@class='studybit-details']//ul//li[@class='tags is-expanded']//li[@class='tag-item ng-scope']//a", asserters.isDisplayed, 30000)
      .click();
    },
    refreshFunction: function(browser){
      return browser
        .refresh();
    },

    verifyTagDeleted: function(browser){
      return browser
      .waitForElementsByCssSelector(".studybit-details ul li.tags.is-expanded", asserters.isDisplayed, 60000).then(function (tag) {
          tag[0].elementsByXPath("//li[@class='tag-item ng-scope']").then(function (userTagCount) {
            if(_.size(userTagCount)==0){
              console.log(report.reportHeader() +
                  report.stepStatus("KeyTerm user tag count after deleted",_.size(userTagCount),"success") +
                  report.reportFooter());
            }else {
              console.log(report.reportHeader() +
                  report.stepStatus("KeyTerm user tag count after deleted",_.size(userTagCount),"failure") +
                  report.reportFooter());
            }
          });
      });
    },

    selectTextFromAHead: function(browser,studybitId,windowScrollY){
    return  browser
        .execute("window.scrollTo(0," + windowScrollY + ")")
        .waitForElementByCss("#" + studybitId + " span:nth-child(1)", asserters.isDisplayed, 90000)
        .click()
        .sleep(5000)
        .elementByCssSelectorWhenReady(".studybit-menu.text.unassigned.editing", 10000)
        .isDisplayed()
        .should.become(true);
    },

    fetchTheNumberOfPublisherTag: function(browser, headValue){
      return browser
        .waitForElementsByCss("ul.tag-list li.not-removable span", asserters.isDisplayed, 90000)
        .then(function(element){
          console.log(report.reportHeader() +
              report.stepStatus("Publisher tag count for "+headValue+" head",_.size(element),"success") +
              report.reportFooter());
      });
    }
};
