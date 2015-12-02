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

var practiceQuizCreation = require("../../support/pages/casTestPage");
var stringutil = require("../../util/stringUtil");

var asserters = wd.asserters;

describe('4LTR (' + 'STUDENT' + ') :: RETAKE PRACTICE QUIZ EXISTING COURSE', function () {
    var browser;
    var allPassed = true;
    var userType;

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
        console.log(report.formatTestName("CAS INTEGRATION TEST :: STUDENT ::  RETAKE PRACTICE QUIZ "));
        console.log(report.formatTestData(data.urlForLogin, data.userId, product, courseName));


    });

    afterEach(function (done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function (done) {

        console.log(report.reportHeader() +
            report.stepStatus("Retake Practice Quiz Validation status ", practiceQuizValidationStatus) +
            report.reportFooter());
        session.close(allPassed, done);
    });


    it("1. Login to 4LTR platform", function (done) {
        loginPage.loginToApplication(browser, done);

    });

    it("2. Select a Course and launch", function (done) {

        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("3. Retake a Practice quiz and exit", function (done) {

        //Call this function if you want a specific block to timeout after a specific time interval
        this.timeout(90000);

        browser
            .waitForElementByCss("div.icon-studyboard-blue", asserters.isDisplayed, 3000)
            .click()
            .waitForElementByXPath("//a[contains(.,'StudyBits')]", asserters.isDisplayed, 20000)
            .click()
            .then(function () {

                practiceQuizCreation.navigateToRetakeQuizFromStudyBoard(browser)
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


});