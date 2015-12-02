/**
 * Created by nbalasundaram on 10/1/15.
 */
require('colors');

var wd = require('wd');
var dataUtil = require("../../util/date-utility");
var loginPage = require("../../support/pages/loginpo");
var session = require("../../support/setup/browser-session");

var testData = require("../../../../test_data/data.json");
var report = require("../../support/reporting/reportgenerator");

var studybit = require("../../support/pages/studybitpo");
var practiceQuizCreation = require("../../support/pages/casTestPage");
var stringutil = require("../../util/stringUtil");

var asserters = wd.asserters;

describe('4LTR (' + 'STUDENT' + ') :: TAKE PRACTICE QUIZ FROM STUDYBITS', function () {
    var browser;
    var allPassed = true;
    var userType;

    var txtSBValidationStatus = "failure";
    var practiceQuizValidationStatus = "failure";

    var product;
    var courseName;
    var length = null;


    before(function (done) {

        browser = session.create(done);

        userType = "student";

        product = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_PRODUCT.toString()) || testData.existingCourseDetails.product;

        if (product === "default") {
            product = testData.existingCourseDetails.product;
        }


        courseName = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_COURSE.toString()) || testData.existingCourseDetails.coursename;

        if (courseName === "default") {

            courseName = testData.existingCourseDetails.coursename;
        }

        data = loginPage.setLoginData(userType);


        //Reports
        console.log(report.formatTestName("CAS INTEGRATION TEST :: STUDENT ::  TAKE PRACTICE QUIZ FROM STUDYBITS"));
        console.log(report.formatTestData(data.urlForLogin, data.userId, product, courseName));


    });

    afterEach(function (done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function (done) {

        console.log(report.reportHeader() +
            report.stepStatus("StudyBit Creation status for Practice Quiz using Studybits ", txtSBValidationStatus) +
            report.stepStatus("Take Practice Quiz from STUDYBITS - Validation status ", practiceQuizValidationStatus) +
            report.reportFooter());
        session.close(allPassed, done);
    });


    it("1. Login to 4LTR platform", function (done) {
        loginPage.loginToApplication(browser, done);

    });

    it("2. Select a Course and launch", function (done) {

        loginPage.launchACourse(userType, courseName, browser, done);

    });


    it("3. Click on a Chapter on the tile view ", function (done) {

        if (product === "MKTG9") {
            browser
                .elementByXPathSelectorWhenReady("//a[contains(.,'Overview')]", asserters.isDisplayed, 90000)
                .click()
                .nodeify(done);
        }
        else {
            browser
                .elementByXPathSelectorWhenReady("//a[contains(.,'What Is Psychology')]", asserters.isDisplayed, 90000)
                .click()
                .nodeify(done);

        }
    });

    it("4. Click on the first topic link", function (done) {
        browser
            .waitForElementByCss("li[class='banner ng-scope']>div>ul>li:nth-child(2) span", asserters.isDisplayed, 120000)
            .click()
            .execute("setTimeout(function(){if(document.getElementById('highlight-help-modal').getAttribute('class').indexOf('ng-hide') == -1)document.getElementsByClassName('icon-close-x-pink')[0].click();},3000)")
            .nodeify(done);
    });

    it("5. Create a Text StudyBit", function (done) {
        studybit.createTextStudyBit(browser, product, done);
    });

    it("6. Open created Text StudyBit", function (done) {
        browser
            .execute('window.scrollTo(0,0)')
            .elementByCssSelectorWhenReady(".studybit-icon.text.saved", asserters.isDisplayed, 90000)
            .click()
            .then(function () {
                txtSBValidationStatus = "success";
            })
            .nodeify(done);
    });


    it("7. Navigate To StudyBoard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("8. Verify the presence of text StudyBit on StudyBoard ", function (done) {

        browser
            .waitForElementByCss("div.icon-studyboard-blue", asserters.isDisplayed, 30000).then(function () {

                browser.waitForElementByXPath("(//li[contains(@class,'tile')]//div[contains(@class,'studybit text')])[1]", asserters.isDisplayed, 30000)
                    .then(function () {
                        txtSBValidationStatusOnSBrd = "success";

                    }).nodeify(done);


            });


    });


    it("9. Take a Practice quiz from studybits and exit", function (done) {

        //Call this function if you want a specific block to timeout after a specific time interval
        this.timeout(90000);

        browser
            .waitForElementByCss("div.icon-studyboard-blue", asserters.isDisplayed, 3000)
            .click()
            .waitForElementByXPath("//a[contains(.,'StudyBits')]", asserters.isDisplayed, 20000)
            .click()
            .then(function () {

                practiceQuizCreation.navigateToPracticeQuizFromStudyBits(browser)
                    .then(function () {

                        browser
                            .sleep(5000)
                            .elementByCssSelectorWhenReady("span.cas-text", 10000)
                            .isDisplayed()
                            .should.become(true)
                            .execute('return document.getElementsByClassName("cas-activity-series").length').then(function (len) {

                                console.log("No of Quiz Questions : " + len);
                                countOfQuestions = len;
                                completedQuestions = 0;

                                function selectAnAnswerAndProceed() {

                                    if (countOfQuestions > 0) {
                                        countOfQuestions--;
                                        completedQuestions++;

                                        browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-truefalse").length').then(function (length) {
                                            if (length.toString() === "0") {
                                                browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-multiple-choice")[0].tagName').then(function (tag) {
                                                    if (tag === "DIV") {
                                                        browser
                                                            .waitForElementByXPath("(//label[@class='cas-choice-radio'])[1]", asserters.isDisplayed, 3000).click()
                                                            .elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                                        console.log("Answered a Question with Radio Button " + completedQuestions + " and remaining Questions " + countOfQuestions);


                                                    } else {
                                                        browser
                                                            .waitForElementByCss("div.cas-selection-list-item", asserters.isDisplayed, 4000)
                                                            .click()
                                                            .waitForElementByCss("ul li:nth-of-type(1) a span.cas-text", asserters.isDisplayed, 10000)
                                                            .click()
                                                            .elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                                        console.log("Answered a Question with a Drop down " + completedQuestions + " and remaining Questions " + countOfQuestions);

                                                    }


                                                    setTimeout(selectAnAnswerAndProceed, 3000);
                                                });
                                            }
                                            else {
                                                browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-truefalse")[0].tagName').then(function (tag) {
                                                    if (tag === "DIV") {
                                                        browser
                                                            .waitForElementByXPath("(//div[@class='cas-choice-item'])[1]/label", asserters.isDisplayed, 3000).click()
                                                            .elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                                        console.log("Answered a True or False Question " + completedQuestions + " and remaining Questions " + countOfQuestions);


                                                    } else {

                                                        console.log("Problem in answering T/F");

                                                    }


                                                    setTimeout(selectAnAnswerAndProceed, 3000);
                                                });
                                            }
                                        })

                                    } else {

                                        if (completedQuestions == len) {
                                            console.log("All Questions successfully attempted");

                                            browser.waitForElementByCss(".sliding-menu-button.past-quizzes.ng-scope", asserters.isDisplayed, 5000)
                                                .waitForElementByCss(".sliding-menu-button.retake-quiz.ng-scope", asserters.isDisplayed, 1000)
                                                .waitForElementByCss(".progress", asserters.isDisplayed, 1000)
                                                .waitForElementByXPath("//a[@aria-controls='incorrect']", asserters.isDisplayed, 1000)
                                                .waitForElementByCss(".exit.ng-scope", asserters.isDisplayed, 3000)
                                                .then(function (el) {

                                                    practiceQuizValidationStatus = "success";
                                                    el.click().then(function () {
                                                        done();
                                                    });
                                                });

                                        }
                                        else {
                                            console.log("failure");
                                            practiceQuizValidationStatus = "failure";
                                            done();
                                        }

                                    }

                                }

                                //Function to answer all the Questions
                                selectAnAnswerAndProceed();

                            });
                    });

            });

    });

    it("10. Delete the created text StudyBit and cleanup for subsequent runs", function (done) {

        browser

            .waitForElementByXPath("//div[@class='icon-studyboard-blue']", asserters.isDisplayed, 30000)
            .execute('window.oldConfirm = window.confirm;' + 'window.confirm = function() { return true; };').then(function () {
                browser
                    .waitForElementByCss("div.studybit.text.unassigned a.ng-scope.icon-trash-gray", asserters.isDisplayed, 30000)
                    .click()
                    .nodeify(done);

            });

    });

    it("11. Log out of 4LTR platform", function (done) {
        browser
            .elementByCssSelectorWhenReady(".dropdown-link>.user-name.ng-binding", 20000)
            .click()
            .sleep(5000)
            .elementByXPathSelectorWhenReady("//a[contains(text(),'Sign Out')]", 3000)
            .click()
            .sleep(10000)
            .nodeify(done);

    });
});