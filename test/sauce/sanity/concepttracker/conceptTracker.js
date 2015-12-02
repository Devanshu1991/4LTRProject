var wd = require('wd');
var asserters = wd.asserters;

var stringutil = require("../../util/stringUtil");

var session = require("../../support/setup/browser-session");
var loginPage = require("../../support/pages/loginpo");
var brainPage = require("../../support/pages/brianpo");
var menuPage = require("../../support/pages/menupo");
var tocPage = require("../../support/pages/tocpo");
var conceptrackerPageInstructor = require("../../support/pages/concepttracker/instructor/concepttrackerpo");

var conceptrackerPageStudent = require("../../support/pages/conceptTrackerpo");
var studybit = require("../../support/pages/studybitpo");
var practiceQuizCreation = require("../../support/pages/casTestPage");
var clearAllSavedContent = require("../../support/pages/clearData");

var userSignOut = require("../../support/pages/userSignOut");

var courseHelper = require("../../support/helpers/courseHelper");

var report = require("../../support/reporting/reportgenerator");


describe('4LTR (' + 'Instructor/Student' + ') :: STUDYBITS/PRACTICE QUIZ METRICS RECORDING ON INSTRUCTOR AND STUDENT CONCEPT TRACKER VALIDATION', function () {

    var browser;
    var allPassed = true;
    var userType;
    var courseName;
    var product;
    var productData;
    var preExistingCorrectAnswer;
    var preExistingtotalQuestions;
    var studybitCount;
    var correctAnswer;
    var totalQuestions;
    var correctAnswerAfterStudentAttempt;
    var preExistingCorrectAnswerAtStudentEnd;
    var preExistingtotalQuestionsAtStudentEnd;
    var sbCountOnStudentEnd;
    var correctAnswerforSBQuiz;
    var totalQuestionsForSBQuiz;
    var finalSumOfCorrectAnswer;
    var finalSumOfTotalQuestions;

    before(function (done) {

        browser = session.create(done);
        userType = "student";
        product = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_PRODUCT.toString());
        courseName = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_COURSE.toString());

        if (product === "default") {
            product = testData.existingCourseDetails.product;
        }

        if (courseName === "default") {
            courseName = product + " " + courseHelper.getUniqueCourseName();
        }

        data = loginPage.setLoginData(userType);
        productData = loginPage.getProductData();


        //Reports
        console.log(report.formatTestName("ANALYTICS :: STUDYBITS/PRACTICE QUIZ METRICS RECORDING ON INSTRUCTOR AND STUDENT CONCEPT TRACKER"));
        console.log(report.formatTestData(data.urlForLogin, data.userId, product, courseName));

    });

    afterEach(function (done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function (done) {

        session.close(allPassed, done);
    });


    it("1a. Login as student", function (done) {


        data = loginPage.setLoginData(userType);

        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });


    it("1b. Select a Course and launch", function (done) {

        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("1c. Navigate To StudyBoard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("1d. Delete the created studybits if any", function (done) {
        clearAllSavedContent.clearStudyboard(browser, done);
    });


    it("1e. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });


    it("1f. Login as Instructor", function (done) {

        userType = "instructor";
        data = loginPage.setLoginData(userType);
        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });

    it("2. Select a Product", function (done) {

        brainPage.selectProduct(product, browser, done);

    });

    it("3. Select a Course and launch", function (done) {

        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("4. Navigate to Concept Tracker", function (done) {
        menuPage.selectConceptTracker(userType, browser, done);

    });


    it("5. Fetch existing practice quiz metrics on a chapter if any ", function (done) {

        conceptrackerPageInstructor.isConceptTrackerLoaded(browser).text().should.become('Concept Tracker').then(function () {
            browser.execute("return document.evaluate(\"count(//div[contains(@class,'chart-container ng-scope')]/h1[contains(.,'" + productData.concepttracker.quiz.chapterbased.name + "')])\", document, null, XPathResult. NUMBER_TYPE, null ).numberValue").then(function (status) {
                if (status == 1) {
                    browser.waitForElementByXPath("//h1[contains(.,'" + productData.concepttracker.quiz.chapterbased.name + "')]/following-sibling::div[@class='chartjs overview']//div[@class='question-count']//p", asserters.isDisplayed, 90000).text().then(function (practiceQuizResult) {
                        console.log("practiceQuizResult:: " + practiceQuizResult);
                        preExistingCorrectAnswer = stringutil.returnValueAfterSplit(stringutil.returnValueAfterSplit(practiceQuizResult, " ", 0), "/", 0);
                        preExistingtotalQuestions = stringutil.returnValueAfterSplit(stringutil.returnValueAfterSplit(practiceQuizResult, " ", 0), "/", 1);
                        console.log("preExistingCorrectAnswer::" + preExistingCorrectAnswer);
                        console.log("preExistingtotalQuestions::" + preExistingtotalQuestions);
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("ANALYTICS :: Practice Quiz metrics found before the student attempted a quiz on  \" " + productData.concepttracker.quiz.chapterbased.name, preExistingCorrectAnswer + "/" + preExistingtotalQuestions + " Quiz Correct/Total Questions", "success") +
                            report.reportFooter());

                        done();
                    });
                } else {
                    console.log("Chapter not present on Concept tracker");
                    preExistingCorrectAnswer = 0;
                    preExistingtotalQuestions = 0;
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("ANALYTICS :: Practice Quiz metrics found before the student attempted a quiz on  \" " + productData.concepttracker.quiz.chapterbased.name, preExistingCorrectAnswer + "/" + preExistingtotalQuestions + " Quiz Correct/Total Questions", "success") +
                        report.reportFooter());
                    done();
                }
            });
        });
    });


    it("6. Fetch existing StudyBits metrics on a chapter if any ", function (done) {
        conceptrackerPageInstructor.isConceptTrackerLoaded(browser).text().should.become('Concept Tracker').then(function () {
            browser.execute("return document.evaluate(\"count(//div[contains(@class,'chart-container ng-scope')]/h1[contains(.,'" + productData.concepttracker.quiz.studybitbased.name + "')])\", document, null, XPathResult. NUMBER_TYPE, null ).numberValue").then(function (status) {
                if (status == 1) {
                    browser.waitForElementByXPath("//h1[contains(.,'" + productData.concepttracker.quiz.studybitbased.name + "')]/following-sibling::div[contains(@class,'chartjs overview')]//div[@class='studybits']//div[contains(@class,'studybit-count')]", asserters.isDisplayed, 90000).text().then(function (studybitCount) {
                        console.log("studybitCount:: " + studybitCount);
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("ANALYTICS :: StudyBits present for \" " + productData.concepttracker.quiz.studybitbased.name + " :", studybitCount, "success") +
                            report.reportFooter());
                        done();
                    });
                } else {
                    console.log("Chapter not present on Concept tracker");
                    studybitCount = 0;
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("ANALYTICS :: StudyBits present for \" " + productData.concepttracker.quiz.studybitbased.name + " :", studybitCount, "success") +
                        report.reportFooter());
                    done();
                }

            });
        });
    });


    it("7. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);

    });

    it("8. Login as student", function (done) {

        userType = "student";
        data = loginPage.setLoginData(userType);

        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });


    it("9. Select a Course and launch", function (done) {

        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("10. Navigate To StudyBoard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });


    it("11. Record the metrics on student concept tracker for practice quiz", function (done) {
        browser
            .waitForElementByCss(".view-select a:nth-child(3)", asserters.isDisplayed, 90000)
            .click()
            .sleep(10000)
            .then(function () {
                conceptrackerPageStudent.isConceptTrackerLoadedOnStudentEnd(browser).text().then(function (text) {
                    browser
                        .sleep(10000)
                        .execute("return document.evaluate(\"count(//div[contains(@class,'chart-container ng-scope')]/h1[contains(.,'" + productData.concepttracker.quiz.chapterbased.name + "')])\", document, null, XPathResult. NUMBER_TYPE, null ).numberValue").then(function (status) {
                            if (status === 1) {
                                browser.waitForElementByXPath("//h1[contains(.,'" + productData.concepttracker.quiz.chapterbased.name + "')]/following-sibling::div[@class='chartjs overview']//div[@class='question-count']//p", asserters.isDisplayed, 90000).text().then(function (practiceQuizResult) {
                                    console.log("practiceQuizResult:: " + practiceQuizResult);
                                    preExistingCorrectAnswerAtStudentEnd = stringutil.returnValueAfterSplit(stringutil.returnValueAfterSplit(practiceQuizResult, " ", 0), "/", 0);
                                    preExistingtotalQuestionsAtStudentEnd = stringutil.returnValueAfterSplit(stringutil.returnValueAfterSplit(practiceQuizResult, " ", 0), "/", 1);
                                    console.log("preExistingCorrectAnswerAtStudentEnd::" + preExistingCorrectAnswerAtStudentEnd);
                                    console.log("preExistingtotalQuestionsAtStudentEnd::" + preExistingtotalQuestionsAtStudentEnd);
                                });
                                done();
                            }
                            else {
                                console.log("Chapter not present on Concept tracker");
                                studybitCount = 0;
                                preExistingCorrectAnswerAtStudentEnd = 0;
                                preExistingtotalQuestionsAtStudentEnd = 0;
                                done();
                            }
                        });
                });
            });
    });

    it("12. Fetch existing StudyBits metrics on a chapter if any on Student concept tracker", function (done) {
        browser.execute("return document.evaluate(\"count(//div[contains(@class,'chart-container ng-scope')]/h1[contains(.,'" + productData.concepttracker.quiz.studybitbased.name + "')])\", document, null, XPathResult. NUMBER_TYPE, null ).numberValue").then(function (status) {
            if (status === 1) {
                browser.waitForElementByXPath("//h1[contains(.,'" + productData.concepttracker.quiz.studybitbased.name + "')]/following-sibling::div[contains(@class,'chartjs overview')]//div[@class='studybits']//div[contains(@class,'studybit-count')]", asserters.isDisplayed, 90000).text().then(function (studybitCount) {
                    sbCountOnStudentEnd = parseInt(stringutil.returnValueAfterSplit(studybitCount, " ", 0));
                    console.log("sbCountOnStudentEnd:: " + sbCountOnStudentEnd);
                    done();
                });
            } else {
                console.log("Chapter not present on Concept tracker");
                sbCountOnStudentEnd = 0;
                done();
            }

        });
    });


    it("13. Click on List view and Verify", function (done) {
        browser
            .waitForElementByCss(".icon-home-blue", 3000)
            .click()
            .sleep(5000)
            .waitForElementByCss(".icon-list-gray", 45000)
            .click()
            .nodeify(done);
    });

    it("14. Navigate to a Chapter", function (done) {
        tocPage.navigateToAChapterByListView(productData.chapter.id, browser, 3);
        done();
    });

    it("15. Navigate to a topic", function (done) {
        tocPage.navigateToATopicByListView(browser, done, productData.chapter.topic.id, 2);
    });

    it("16. Create a Text StudyBit", function (done) {
        studybit.createTextStudyBit(browser, done, productData.concepttracker.quiz.studybitbased.studybit.text.id,
            productData.concepttracker.quiz.studybitbased.studybit.text.concepts[0],
            productData.concepttracker.quiz.studybitbased.studybit.text.usertag,
            productData.concepttracker.quiz.studybitbased.studybit.text.notes,
            productData.concepttracker.quiz.studybitbased.studybit.text.comprehension,
            productData.concepttracker.quiz.studybitbased.studybit.text.windowScrollY);
    });


    it("17. Create a KeyTerm StudyBit", function (done) {
        this.timeout(130000);
        studybit.createKeyTermStudyBit(browser, done,
            productData.concepttracker.quiz.studybitbased.studybit.keyterm.id,
            productData.concepttracker.quiz.studybitbased.studybit.keyterm.definition,
            productData.concepttracker.quiz.studybitbased.studybit.keyterm.comprehension,
            productData.concepttracker.quiz.studybitbased.studybit.keyterm.publishertag,
            productData.concepttracker.quiz.studybitbased.studybit.keyterm.notes,
            productData.concepttracker.quiz.studybitbased.studybit.keyterm.usertag,
            productData.concepttracker.quiz.studybitbased.studybit.keyterm.windowScrollY);
    });


    it("18. Navigate To StudyBoard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("19. Verify the presence of text StudyBit on StudyBoard ", function (done) {

        browser
            .waitForElementByCss("div.icon-studyboard-blue", asserters.isDisplayed, 30000).then(function () {

                browser.waitForElementByXPath("(//li[contains(@class,'tile')]//div[contains(@class,'studybit text')])[1]", asserters.isDisplayed, 30000)
                    .then(function () {
                        txtSBValidationStatusOnSBrd = "success";

                    }).nodeify(done);


            });


    });


    it("20. Take a Practice quiz from studybits ", function (done) {

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
                            .sleep(10000)
                            .elementByCssSelectorWhenReady("span.cas-text", 60000)
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
                                        });

                                    } else {

                                        if (completedQuestions == len) {
                                            console.log("All Questions successfully attempted");

                                            browser.waitForElementByCss(".sliding-menu-button.past-quizzes.ng-scope", asserters.isDisplayed, 5000)
                                                .waitForElementByCss(".sliding-menu-button.retake-quiz.ng-scope", asserters.isDisplayed, 1000)
                                                .waitForElementByCss(".progress", asserters.isDisplayed, 1000)
                                                .waitForElementByXPath("//a[@aria-controls='incorrect']", asserters.isDisplayed, 1000)
                                                .waitForElementByCss(".exit.ng-scope", asserters.isDisplayed, 3000)
                                                .nodeify(done);


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

    it("21. Store the correct and TotalQuestions answers after student's attempt on practice quiz from StudyBit", function (done) {
        practiceQuizCreation.verifyPracticeQuizResultPage(browser).then(function () {
            practiceQuizCreation.getQuestionsCorrect(browser).then(function (correct) {
                correctAnswerforSBQuiz = correct;

                console.log(report.reportHeader() +
                    report.printTestData("CAS ::  CORRECT ANSWER FROM QUIZZING VIA STUDYBITS ", correctAnswerforSBQuiz) +
                    report.reportFooter());

                practiceQuizCreation.getTotalQuestions(browser).then(function (totalQ) {
                    totalQuestionsForSBQuiz = totalQ;


                    console.log(report.reportHeader() +
                        report.printTestData("CAS ::  TOTAL QUESTIONS ATTEMPTED ON QUIZZING VIA STUDYBITS ", totalQuestionsForSBQuiz) +
                        report.reportFooter());
                    done();
                });
            });

        });

    });

    it("22. Navigate To StudyBoard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });


    it("23. Attempt a practice Quiz", function (done) {
        //Call this function if you want a specific block to timeout after a specific time interval
        this.timeout(90000);
        practiceQuizCreation.navigateToPracticeQuizFromDesiredChapter(browser, productData.concepttracker.quiz.chapterbased.desiredchapterforquiz).then(function () {

            browser.sleep(5000).elementByCssSelectorWhenReady("span.cas-text", 60000).isDisplayed().should.become(true).execute('return document.getElementsByClassName("cas-activity-series").length').then(function (len) {

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
                                        browser.waitForElementByXPath("(//label[@class='cas-choice-radio'])[1]", asserters.isDisplayed, 3000).click().elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                        console.log("Answered a Question with Radio Button " + completedQuestions + " and remaining Questions " + countOfQuestions);

                                    } else {
                                        browser.waitForElementByCss("div.cas-selection-list-item", asserters.isDisplayed, 4000).click().waitForElementByCss("ul li:nth-of-type(1) a span.cas-text", asserters.isDisplayed, 10000).click().elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                        console.log("Answered a Question with a Drop down " + completedQuestions + " and remaining Questions " + countOfQuestions);

                                    }

                                    setTimeout(selectAnAnswerAndProceed, 3000);
                                });
                            } else {
                                browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-truefalse")[0].tagName').then(function (tag) {
                                    if (tag === "DIV") {
                                        browser.waitForElementByXPath("(//div[@class='cas-choice-item'])[1]/label", asserters.isDisplayed, 3000).click().elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                        console.log("Answered a True or False Question " + completedQuestions + " and remaining Questions " + countOfQuestions);

                                    } else {

                                        console.log("Problem in answering T/F");

                                    }

                                    setTimeout(selectAnAnswerAndProceed, 3000);
                                });
                            }
                        });

                    } else {

                        if (completedQuestions == len) {
                            console.log("All Questions successfully attempted");
                            console.log(report.reportHeader() +
                                report.stepStatus("CAS :: PRACTICE QUIZ COMPLETED SUCCESSFULLY", "success") +
                                report.reportFooter());
                            browser
                              .waitForElementByCss(".sliding-menu-button.past-quizzes.ng-scope", asserters.isDisplayed, 5000)
                              .waitForElementByCss(".sliding-menu-button.retake-quiz.ng-scope", asserters.isDisplayed, 1000)
                              .waitForElementByCss(".progress", asserters.isDisplayed, 1000)
                              .waitForElementByXPath("//a[@aria-controls='incorrect']", asserters.isDisplayed, 1000)
                              .waitForElementByCss(".exit.ng-scope", asserters.isDisplayed, 3000)
                              .nodeify(done);
                        } else {


                            console.log(report.reportHeader() +
                                report.stepStatus("CAS :: PRACTICE QUIZ NOT COMPLETED", "failure") +
                                report.reportFooter());
                            done();
                        }

                    }

                }

                //Function to answer all the Questions
                selectAnAnswerAndProceed();

            });
        });

    });


    it("24. Store the correct and TotalQuestions answers after student's attempt on practice quiz", function (done) {
        practiceQuizCreation.verifyPracticeQuizResultPage(browser).then(function () {

            practiceQuizCreation.getQuestionsCorrect(browser).then(function (correct) {
                correctAnswer = correct;

                console.log(report.reportHeader() +
                    report.printTestData("CAS ::  CORRECT ANSWER FROM QUIZZING VIA CHAPTER ", correctAnswer) +
                    report.reportFooter());
                practiceQuizCreation.getTotalQuestions(browser).then(function (totalQ) {
                    totalQuestions = totalQ;
                    console.log(report.reportHeader() +
                        report.printTestData("CAS ::   QUESTIONS ANSWERED ON QUIZZING VIA CHAPTER ", totalQuestions) +
                        report.reportFooter());
                    done();
                });
            });


        });

    });


    it("25. Record sum of Correct answer and Total questions for both quizzes attempted", function (done) {
        var sumOFCorrectAnswerSBAndChapter;
        var sumOFTotalQuestionsSBAndChapter;
        sumOFCorrectAnswerSBAndChapter = parseInt(correctAnswerforSBQuiz) + parseInt(correctAnswer);
        finalSumOfCorrectAnswer = parseInt(preExistingCorrectAnswerAtStudentEnd) + sumOFCorrectAnswerSBAndChapter;
        console.log("TOTAL ANSWERS CORRECT ON BOTH QUIZ ATTEMPTS :: " + finalSumOfCorrectAnswer);
        sumOFTotalQuestionsSBAndChapter = parseInt(totalQuestionsForSBQuiz) + parseInt(totalQuestions);
        finalSumOfTotalQuestions = parseInt(preExistingtotalQuestionsAtStudentEnd) + sumOFTotalQuestionsSBAndChapter;
        console.log("TOTAL QUESTIONS ATTEMPTED ON BOTH QUIZ ATTEMPTS :: " + finalSumOfTotalQuestions);


        console.log(report.reportHeader() +
            report.printTestData("CAS :: TOTAL ANSWERS CORRECT ON BOTH QUIZ ATTEMPTS INCLUDING PAST METRICS", finalSumOfCorrectAnswer) +
            report.reportFooter());

        console.log(report.reportHeader() +
            report.printTestData("CAS :: TOTAL QUESTIONS ATTEMPTED ON BOTH QUIZ ATTEMPTS INCLUDING PAST METRICS", finalSumOfTotalQuestions) +
            report.reportFooter());
        done();
    });


    it("26. Navigate To StudyBoard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("27. Validate correct|total answers on student's concept tracker view after student's attempt", function (done) {

        this.timeout(360000);

        browser.sleep(60000)
            .waitForElementByCss(".view-select a:nth-child(3)", asserters.isDisplayed, 90000)
            .click()
            .sleep(10000);
        testBotQuizMetrics = finalSumOfCorrectAnswer + "/" + finalSumOfTotalQuestions + " Practice Quiz Questions";
        console.log("testBotQuizMetrics :::" + testBotQuizMetrics);
        console.log(report.reportHeader() + report.stepStatusWithData("ANALYTICS :: TestBot Calculated metrics for the attempted quiz by student   \" " + productData.concepttracker.quiz.chapterbased.name, testBotQuizMetrics, "success") + report.reportFooter());
        browser.waitForElementByXPath("//h1[contains(.,'" + productData.concepttracker.quiz.chapterbased.name + "')]/following-sibling::div[@class='chartjs overview']//div[@class='question-count']//p", asserters.isDisplayed, 90000).text().should.eventually.become(testBotQuizMetrics).then(function (practiceQuizResult) {


            correctAnswerAfterStudentAttempt = stringutil.returnValueAfterSplit(stringutil.returnValueAfterSplit(practiceQuizResult, " ", 0), "/", 0);
            totalAnsweredQuestionsByStudent = stringutil.returnValueAfterSplit(stringutil.returnValueAfterSplit(practiceQuizResult, " ", 0), "/", 1);
            console.log(report.reportHeader() +
                report.stepStatusWithData("ANALYTICS :: Practice Quiz metrics retrieved from the platform after the student attempted a quiz on  \" " + productData.concepttracker.quiz.chapterbased.name, practiceQuizResult, "success") + report.reportFooter());
            done();

        });
    });


    it("28. Fetch existing StudyBits metrics on a chapter if any on Student concept tracker", function (done) {
        browser.execute("return document.evaluate(\"count(//div[contains(@class,'chart-container ng-scope')]/h1[contains(.,'" + productData.concepttracker.quiz.studybitbased.name + "')])\", document, null, XPathResult. NUMBER_TYPE, null ).numberValue").then(function (status) {
            if (status === 1) {
                browser.waitForElementByXPath("//h1[contains(.,'" + productData.concepttracker.quiz.studybitbased.name + "')]/following-sibling::div[contains(@class,'chartjs overview')]//div[@class='studybits']//div[contains(@class,'studybit-count')]", asserters.isDisplayed, 90000).text().then(function (studybitCount) {
                    sbCountOnStudentEnd = parseInt(stringutil.returnValueAfterSplit(studybitCount, " ", 0));
                    console.log("sbCountOnStudentEnd:: " + sbCountOnStudentEnd);
                    done();
                });
            } else {
                console.log("Chapter not present on Concept tracker");

            }

        });
    });


    it("29. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });


    it("30. Login as Instructor", function (done) {

        userType = "instructor";
        data = loginPage.setLoginData(userType);
        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });

    it("31. Select a Course and launch", function (done) {
        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("32. Navigate to Concept Tracker", function (done) {
        menuPage.selectConceptTracker(userType, browser, done);

    });

    it("33. Validate correct|total answers on instructor's concept tracker view after student's attempt", function (done) {
        this.timeout(360000);
        testBotQuizMetrics = finalSumOfCorrectAnswer + "/" + finalSumOfTotalQuestions + " Practice Quiz Questions";

        console.log(report.reportHeader() + report.stepStatusWithData("ANALYTICS :: TestBot Calculated metrics for the attempted quiz by student   \" " + productData.concepttracker.quiz.chapterbased.name, testBotQuizMetrics, "success") + report.reportFooter());
        browser.waitForElementByXPath("//h1[contains(.,'" + productData.concepttracker.quiz.chapterbased.name + "')]/following-sibling::div[@class='chartjs overview']//div[@class='question-count']//p", asserters.isDisplayed, 90000).text().should.eventually.become(testBotQuizMetrics).then(function (practiceQuizResult) {
            correctAnswerAfterStudentAttempt = stringutil.returnValueAfterSplit(stringutil.returnValueAfterSplit(practiceQuizResult, " ", 0), "/", 0);
            totalAnsweredQuestionsByStudent = stringutil.returnValueAfterSplit(stringutil.returnValueAfterSplit(practiceQuizResult, " ", 0), "/", 1);
            console.log(report.reportHeader() +
                report.stepStatusWithData("ANALYTICS :: Practice Quiz metrics retrieved from the platform after the student attempted a quiz on  \" " + productData.concepttracker.quiz.chapterbased.name, practiceQuizResult, "success") + report.reportFooter());
            done();

        });
    });

    it("34. Validate the count of StudyBits on instructor concept tracker after student's quiz attempts ", function (done) {
        browser.execute("return document.evaluate(\"count(//div[contains(@class,'chart-container ng-scope')]/h1[contains(.,'" + productData.concepttracker.quiz.studybitbased.name + "')])\", document, null, XPathResult. NUMBER_TYPE, null ).numberValue").then(function (status) {
            if (status === 1) {
                console.log("sbCountOnStudentEnd:: " + sbCountOnStudentEnd);
                browser.waitForElementByXPath("//h1[contains(.,'" + productData.concepttracker.quiz.studybitbased.name + "')]/following-sibling::div[contains(@class,'chartjs overview')]//div[@class='studybits']//div[contains(@class,'studybit-count')]", asserters.isDisplayed, 90000).text().should.eventually.include(sbCountOnStudentEnd)
                    .nodeify(done);

            } else {
                console.log("Chapter not present on Concept tracker");
            }
        });
    });


    it("35. Log out as Instructor", function (done) {

        userSignOut.userSignOut(browser, done);

    });

    it("36. Login as student", function (done) {

        userType = "student";
        data = loginPage.setLoginData(userType);

        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });


    it("37. Select a Course and launch", function (done) {
        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("38. Navigate To StudyBoard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);

    });


    it("39. Delete the created studybits if any", function (done) {
        clearAllSavedContent.clearStudyboard(browser, done);
    });


});
