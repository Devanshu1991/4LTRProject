/**
 * Created by nbalasundaram on 10/1/15.
 */
require('colors');
var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../test_data/data.json");
var session = require("../support/setup/browser-session");
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/loginpo");
var studyBoardPage = require("../support/pages/studyboardpo");
var tocPage = require("../support/pages/tocpo");
var menuPage = require("../support/pages/menupo");
var studybit = require("../support/pages/studybitpo");
var contentBaseFeature = require("../support/pages/conceptTrackerpo.js");
var clearAllSavedContent = require("../support/pages/clearData");

var flashcardPage = require("../support/pages/flashcardspo.js");
var notesCreation = require("../support/pages/notespo");

var stringutil = require("../util/stringUtil");
var report = require("../support/reporting/reportgenerator");


describe('STUDYBIT, FLASHCARD, NOTES CREATION AND CONCEPT TRACKER VALIDATION', function () {
    var browser;
    var allPassed = true;

    var userType;
    var courseName;


    var keyTermSBValidationStatusOnSBrd = "failure";


    var flashCardValidationStatus = "failure";

    var notesValidation = "failure";

    var product;

    var data;
    var productData;


    before(function (done) {

        browser = session.create(done);

        userType = "student";

        product = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_PRODUCT.toString());
        if (product === "default") {
            product = testData.existingCourseDetails.product;
        }


        courseName = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_COURSE.toString());
        if (courseName === "default") {

            courseName = testData.existingCourseDetails.coursename;
        }

        data = loginPage.setLoginData(userType);
        productData = loginPage.getProductData();

        //Reports
        console.log(report.formatTestName("4LTR SMOKE FEATURES :: STUDYBIT, FLASHCARD, NOTES CREATION AND CONCEPT TRACKER VALIDATION"));
        console.log("======================================");
        console.log(report.formatTestData(data.urlForLogin, data.userId, product, courseName));

        console.log(report.printTestData("CHAPTER " + productData.chapter.id + " ", productData.chapter.title));
        console.log(report.printTestData("TOPIC " + productData.chapter.topic.id + " ", productData.chapter.topic.title));
        console.log(report.printTestData("STUDYBITID", productData.chapter.topic.studybit.text.id));
        console.log(report.printTestData("STUDYBIT CONCEPT", productData.chapter.topic.studybit.text.concepts[0]));

    });

    afterEach(function (done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function (done) {
        session.close(allPassed, done);
    });


    it("1. Login to 4LTR platform", function (done) {
        loginPage.loginToApplication(browser, done);

    });

    it("2. Select a Course and launch", function (done) {
        this.timeout(120000);
        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("2a. Navigate to Studyboard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("2b. Delete the created studybits if any", function (done) {

        clearAllSavedContent.clearStudyboard(browser, done);
    });

    it("2c. Navigate to TOC ", function (done) {

        tocPage.navigateToToc(browser).nodeify(done);
    });

    it("3. Navigate to a Chapter", function (done) {

        tocPage.getChapterTitle(productData.chapter.id, browser)
            .then(function (text) {
                text.should.contain(productData.chapter.title);
            })
            .then(function () {
                tocPage.navigateToAChapter(productData.chapter.id, browser)
                    .nodeify(done);
            });
    });

    it("4. Navigate to a topic", function (done) {

        tocPage.navigateToATopic(productData.chapter.id, productData.chapter.topic.id, browser)
            .then(function () {
                tocPage.disposeFirstVisitTopicModalIfVisible(browser).then(function () {
                    tocPage.getTopicTitleHero(browser).then(function (text) {
                        text.should.contain(productData.chapter.topic.titlehero);
                    }).nodeify(done);
                });

            });


    });

    it("5. Create a Text StudyBit", function (done) {
        studybit.createTextStudyBit(browser, done, productData.chapter.topic.studybit.text.id,
            productData.chapter.topic.studybit.text.concepts[0],
            productData.chapter.topic.studybit.text.usertag,
            productData.chapter.topic.studybit.text.notes,
            productData.chapter.topic.studybit.text.comprehension,
            productData.chapter.topic.studybit.text.windowScrollY);
    });

    it("6. Open created Text StudyBit and validate the StudyBit Save ", function (done) {
        studybit.validateTextStudyBitSave(browser, done, productData.chapter.topic.studybit.text.id,
            productData.chapter.topic.studybit.text.concepts[0],
            productData.chapter.topic.studybit.text.usertag,
            productData.chapter.topic.studybit.text.notes,
            productData.chapter.topic.studybit.text.comprehension,
            productData.chapter.topic.studybit.text.windowScrollY);
    });

    it("7. Create a KeyTerm StudyBit", function (done) {
        this.timeout(130000);
        studybit.createKeyTermStudyBit(browser, done,
            productData.chapter.topic.studybit.keyterm.id,
            productData.chapter.topic.studybit.keyterm.definition,
            productData.chapter.topic.studybit.keyterm.comprehension,
            productData.chapter.topic.studybit.keyterm.publishertag,
            productData.chapter.topic.studybit.keyterm.notes,
            productData.chapter.topic.studybit.keyterm.usertag,
            productData.chapter.topic.studybit.keyterm.windowScrollY);
    });

    it("8. Open and validate created KeyTerm StudyBit", function (done) {
        this.timeout(130000);
        studybit.validateKeyTermStudyBitSave(browser, done, productData.chapter.topic.studybit.keyterm.id,
            productData.chapter.topic.studybit.keyterm.publishertag,
            productData.chapter.topic.studybit.keyterm.usertag,
            productData.chapter.topic.studybit.keyterm.notes,
            productData.chapter.topic.studybit.keyterm.comprehension,
            productData.chapter.topic.studybit.keyterm.windowScrollY,
            productData.chapter.topic.studybit.keyterm.definition);

    });

    it("9. Navigate To StudyBoard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });


    it("10. Verify the presence of text StudyBit on StudyBoard ", function (done) {
        studybit.validateTextStudyBitOnStudyBoard(browser, done,
            productData.chapter.topic.studybit.text.chaptername,
            productData.chapter.topic.studybit.text.notes,
            productData.chapter.topic.studybit.text.concepts[0],
            productData.chapter.topic.studybit.text.usertag);
    });

    it("11. Verify the presence of keyterm StudyBit on StudyBoard ", function (done) {
        browser
            .elementByCssSelectorWhenReady(".icon-close-x-blue", asserters.isDisplayed, 5000).then(function (close) {
                close.click();
            });
        browser
            .waitForElementByCss("div.icon-studyboard-blue", asserters.isDisplayed, 30000).then(function () {
                browser.waitForElementByXPath("(//li[contains(@class,'tile')]//div[contains(@class,'studybit keyterm')])[1]", asserters.isDisplayed, 30000)
                    .then(function () {
                        keyTermSBValidationStatusOnSBrd = "success";
                        console.log(report.reportHeader() +
                            report.stepStatus("KeyTerm Validation status on StudyBoard ", keyTermSBValidationStatusOnSBrd) +
                            report.reportFooter());
                    })
                    .nodeify(done);
            });
    });


    it("12. Verify studybits get filtered based on userTag ", function (done) {
        this.timeout(120000);
        studyBoardPage.clickAndVerifyFilerPanel(browser).then(function () {
            studyBoardPage.enterTagValueOnFilterPanel(browser, productData.chapter.topic.studybit.text.usertag).then(function () {
                studyBoardPage.verifyFilteredStudybit(browser, done, "userTag", productData.chapter.topic.studybit.text.usertag, productData.chapter.topic.studybit.text.chaptername, process.env.RUN_ENV.toString());
            });
        });

    });

    it("12a. Clear all chapter filters", function (done) {
        studyBoardPage.clearAllChapterFilters(browser, done);
    });

    it("13. Verify studybits get filtered based on chapter ", function (done) {
        this.timeout(120000);
        studyBoardPage.verifyFilteredStudybit(browser, done, "chapter", productData.chapter.title, productData.chapter.topic.studybit.text.chaptername, process.env.RUN_ENV.toString());

    });

    it("13a. Change comprehension level of one of the studybit ", function (done) {
        studyBoardPage.changeComprehensionOfStudybit(browser, done);

    });

    it("13b. Verify studybits get filtered based on comprehension level ", function (done) {
        this.timeout(120000);
        studyBoardPage.verifyFilteredStudybit(browser, done, "comprehension", productData.chapter.title, productData.chapter.topic.studybit.text.chaptername, process.env.RUN_ENV.toString());

    });

    it("14. Navigate to a topic to create note", function (done) {

        tocPage.navigateToToc(browser).then(function () {
            tocPage.navigateToAChapter(productData.chapter.id, browser).then(function () {
                tocPage.navigateToATopic(productData.chapter.id, productData.chapter.topic.id, browser).nodeify(done);

            });
        });
    });

    it("15. Create a note on a topic page", function (done) {
        notesCreation.notesCreation(browser, done, testData.notesTerms.noteText);
    });

    it("16a. Navigate to StudyBoard", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("16. Verify the presence of note on the StudyBoard", function (done) {
        notesCreation.verifyNoteOnStudyBoard(notesValidation, browser, done);
    });

    it("17a. Verify the count of Created StudyBits reflected on the Concept Tracker", function (done) {
        menuPage.selectSubTabOnStudyBoard(browser, "Concept Tracker", done);
    });

    it("17b. Verify the count of Created StudyBits reflected on the Concept Tracker", function (done) {

        contentBaseFeature.conceptTackerValidation(2, browser, done);

    });

    it("17c. Verify the search feature on concept tracker, search result and narrative content", function (done) {
        if (process.env.RUN_ENV.toString() === "\"integration\"") {
            browser
                .waitForElementByXPath("((//div[contains(@class,'chart-container ng-scope')])[1]//div[contains(@class,'chartjs ng-scope')])[1]//div[contains(@class,'chartjs-title')]", asserters.isDisplayed, 10000)
                .text().then(function (keyconcept) {
                    if (keyconcept.indexOf(productData.chapter.topic.studybit.text.concepts[0]) > -1) {
                        browser
                            // .execute("return getComputedStyle(document.querySelector('.concept-search'))[16]").then(function(searchicon)){
                            // if(searchicon.indexOf("background-image")>-1)
                            //for search icon verification
                            // })
                            .waitForElementByXPath("((//div[contains(@class,'chart-container ng-scope')])[1]//div[contains(@class,'chartjs ng-scope')])[1]//div[contains(@class,'chartjs-title')]//a//div", asserters.isDisplayed, 10000)
                            .click()
                            .sleep(5000)
                            .execute("return document.getElementsByClassName('container ng-scope')[0].getElementsByTagName('header')[0].getElementsByTagName('h1')[0].textContent.split('\"')[1]").then(function (searchtitle) {
                                if (searchtitle.indexOf(keyconcept) > -1) {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("Retrieve search content from a concept present in Concept tracker : " + searchtitle, "success") +
                                        report.reportFooter());
                                    browser
                                        .waitForElementByCss(".search-results.ng-scope div:nth-child(1) div a", asserters.isDisplayed, 10000)
                                        .click()
                                        .sleep(8000)
                                        .waitForElementByCss("section.chapter-hero h1", asserters.isDisplayed, 10000)
                                        .text().then(function (narrativetext) {

                                            console.log(report.reportHeader() +
                                                report.stepStatusWithData("Navigate to narrative content from the retrieved search result links to : " + narrativetext, "success") +
                                                report.reportFooter());
                                            done();

                                        });


                                }
                            });
                    }
                });
        }
        else {
            console.log("Yet to be implemented in prod");
            done();
        }

    });

    it("18. Click on Studyboard", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("19. Delete the created text StudyBit and cleanup for subsequent runs", function (done) {
        clearAllSavedContent.clearStudyboard(browser, done);
    });


    it("20. End To End Flashcard validation", function (done) {
        console.log("=========================Flashcard Validation===========================");
        this.timeout(120000);
        browser
            .elementByXPathSelectorWhenReady("//a[@class='ng-binding' and contains(.,'Flashcards')]", asserters.isDisplayed, 90000)
            .click().sleep(6000).then(function () {
                  flashcardPage.createFlashcard(browser).then(function () {
                    flashcardPage.selectUserFlashcardView(browser, done);
                });

            });
    });

    it("21. Delete the created FlashCard", function (done) {
        browser
            .elementByCssSelectorWhenReady(".overlay", asserters.isDisplayed, 90000)
            .then(function () {
                flashCardValidationStatus = "success";
                console.log(report.reportHeader() +
                    report.stepStatus("FlashCard Validation status StudyBoard", flashCardValidationStatus) +
                    report.reportFooter());
            });
        clearAllSavedContent.clearStudyboard(browser, done);
    });

});
