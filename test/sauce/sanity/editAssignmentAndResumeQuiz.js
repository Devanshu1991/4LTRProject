require('colors');

var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/loginpo");
var brainPage = require("../support/pages/brianpo");
var menuPage = require("../support/pages/menupo");

var calendarNavigation = require("../support/pages/assignments/instructor/navigationpo");
var assessmentsPage = require("../support/pages/assignments/instructor/assessmentspo");
var casPage = require("../support/pages/casTestPage");
var studenGradebookPage = require("../support/pages/gradebook/student/gradebookValidationpo");
var userSignOut = require("../support/pages/userSignOut");


var assessmentData = require("../../../test_data/assignments/assessments.json");

var userAccountAction = require("../support/pages/userSignOut");
var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData = require("../../../test_data/qa.json");

var testData = require("../../../test_data/data.json");
var clearAllSavedContent = require("../support/pages/clearData");


var courseHelper = require("../support/helpers/courseHelper");

var report = require("../support/reporting/reportgenerator");
var stringutil = require("../util/stringUtil");
var mathutil = require("../util/mathUtil");

var asserters = wd.asserters;

describe('CCS/CAS/ASSIGNMENT :: INSTRUCTOR ASSIGNMENT CREATION, STUDENT SUBMISSION, STUDENT RESUME QUIZ VALIDATION, INSTRUCTOR ASSSIGNMENT EDIT VALIDATION', function () {
    var browser;
    var allPassed = true;
    var userType;
    var setDate;

    var courseName;

    var studentAssignmentCompletionStatus = "failure";
    var assignmentCreationStatus = "failure";


    var product;

    var scoreFromStudentGradebook;
    var pointsFromStudentGradebook;

    var questionsCorrectFromCAS;

    var textcontain;
    var questioncount = 0;
    var countOfQuestions2ndattempts;


    before(function (done) {
        browser = session.create(done);
        setDate = testData.courseAccessInformation.DateBeforeToday;
        newCourseData = testData.instructorResourceCenter;

        userType = "instructor";

        product = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_PRODUCT.toString());


        if (product === "default") {
            product = testData.existingCourseDetails.product;
        }


        courseName = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_COURSE.toString());
        if (courseName === "default") {
            courseName = product + " " + courseHelper.getUniqueCourseName();
        }

        data = loginPage.setLoginData(userType);


        //Reports
        console.log(report.formatTestName("CCS/CAS/ASSIGNMENT :: INSTRUCTOR ASSIGNMENT CREATION, STUDENT SUBMISSION, STUDENT RESUME QUIZ VALIDATION, INSTRUCTOR ASSSIGNMENT EDIT VALIDATION"));
        console.log(report.formatTestData(data.urlForLogin, data.userId, product, courseName));

    });

    afterEach(function (done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function (done) {

        session.close(allPassed, done);
    });


    it("1. Login to 4LTR Platform", function (done) {
        loginPage.loginToApplication(browser, done);

    });

    it("2. Select a Product", function (done) {

        brainPage.selectProduct(product, browser, done);

    });

    it("3. Select a Course and launch", function (done) {
        this.timeout(120000);
        loginPage.launchACourse(userType, courseName, browser, done);

    });


    it("4. Navigate to Assignments Page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });


    it("5. Select current date and open the Assessment Type assignment settings page", function (done) {
        browser
            .execute("return document.getElementsByClassName('icon-close-x').length").then(function (close_x) {
                if (close_x != 0) {
                    browser
                        .execute("document.getElementsByClassName('icon-close-x')[0].click();");
                }
            })
            .execute("return new Date().getDate()").then(function (currentdate) {
                if (currentdate > 13) {
                    browser
                        .execute("window.scrollTo(0,1000)");
                }

            });
        calendarNavigation.selectADateForAssignment(browser).
            then(function () {
                calendarNavigation.selectAssessmentTypeAssignment(browser, done);
            });
    });


    it("6. Complete the Assessment form for system created assignment", function (done) {
        assessmentsPage.enterName(browser).then(function () {
            assessmentsPage.enterRevealDate(browser).then(function () {
                assessmentsPage.selectChapter(browser, assessmentData.systemgenerated.scorestrategyhigh.chapter).then(function () {
                    assessmentsPage.enterScore(browser, assessmentData.systemgenerated.scorestrategyhigh.score).then(function () {
                        assessmentsPage.selectAttempts(browser, assessmentData.systemgenerated.scorestrategyhigh.attempts).then(function () {
                            assessmentsPage.selectScoreStrategy(browser, assessmentData.systemgenerated.scorestrategyhigh.scoreStrategy).then(function () {
                                assessmentsPage.selectQuestionStrategy(browser, assessmentData.systemgenerated.QuestionStrategy.option[0]).then(function () {
                                    assessmentsPage.enterQuestionsPerStudent(browser, assessmentData.systemgenerated.scorestrategyhigh.questions).then(function () {
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("7. Save the assessment and verify if its saved successfully", function (done) {

        this.timeout(120000);

        assessmentsPage.saveAssignment(browser).then(function () {

            assessmentsPage.checkIfAssignmentSaved(browser).then(function (value) {
                if (value.toString() === "rgb(236, 41, 142)") {

                    assignmentCreationStatus = "success";
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("CCS : Instructor created an assessment type assignment called :: ", assessmentsPage.getAssignmentName(), "success") +
                        report.reportFooter());
                    done();
                } else {
                    assignmentCreationStatus = "failure";
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("CCS : Instructor created an assessment type assignment called :: ", assessmentsPage.getAssignmentName() + " may not have received the assessmentCGI", "failure") +
                        report.reportFooter());
                    done();

                }

            });

        });
    });

    it("8. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);

    });

    it("9. Login as student", function (done) {

        userType = "student";
        data = loginPage.setLoginData(userType);


        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });


    it("10. Select a Course and launch", function (done) {

        loginPage.launchACourse(userType, courseName, browser, done);

    });


    it("11. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });


    it("12. Click on the current date cell", function (done) {
        browser
            .sleep(3000)
            .elementByCssSelectorWhenReady(".day.ng-scope.today", 5000)
            .click()
            .sleep(2000)
            .nodeify(done);
    });

    it("13. Launch the assignment", function (done) {
        browser
            .waitForElementByXPath("//span[contains(@class,'assessment-title')]/a[contains(text(),'" + assessmentsPage.getAssignmentName() + "')][1]", asserters.isDisplayed, 60000)
            .click()
            .sleep(10000)
            .nodeify(done);
    });


    it("14. Complete the assignment and exit", function (done) {

        //Call this function if you want a specific block to timeout after a specific time interval
        this.timeout(90000);

        browser
            .sleep(10000)
            .elementByCssSelectorWhenReady("span.cas-text", 10000)
            .isDisplayed()
            .should.become(true)
            .execute('return document.getElementsByClassName("cas-activity-series").length').then(function (len) {
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
                                            .waitForElementByXPath("(//label[@class='cas-choice-radio'])[" + mathutil.getRandomInt(1, 5) + "]", asserters.isDisplayed, 3000).click()
                                            .elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                        console.log("Answered a Question with Radio Button " + completedQuestions + " and remaining Questions " + countOfQuestions);


                                    } else {
                                        browser
                                            .waitForElementByCss("div.cas-selection-list-item", asserters.isDisplayed, 4000)
                                            .click()
                                            .waitForElementByCss("ul li:nth-of-type(" + mathutil.getRandomInt(1, 4) + ") a span.cas-text", asserters.isDisplayed, 10000)
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
                                            .waitForElementByXPath("(//div[@class='cas-choice-item'])[" + mathutil.getRandomInt(1, 3) + "]/label", asserters.isDisplayed, 3000).click()
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

                            browser
                                .waitForElementByCss(".exit.ng-scope", asserters.isDisplayed, 3000)
                                .then(function (el) {
                                    casPage.getQuestionsCorrect(browser).then(function (questionsCorrect) {

                                        console.log("Total Questions Correct " + questionsCorrect);
                                        questionsCorrectFromCAS = questionsCorrect;

                                        console.log("Total Assignment Questions " + assessmentsPage.getMaxAssignmentQuestions());
                                        studentAssignmentCompletionStatus = "success";

                                        console.log(report.reportHeader() +
                                            report.stepStatusWithData("CAS : Student Completed the assignment with questions " + assessmentsPage.getMaxAssignmentQuestions() + " and got a score of  ", questionsCorrect, "success") +
                                            report.reportFooter());

                                        el.click().then(function () {
                                            done();
                                        });
                                    });
                                });

                        }
                        else {
                            console.log("failure");
                            studentAssignmentCompletionStatus = "failure";
                            console.log(report.reportHeader() +
                                report.stepStatusWithData("Student Assignment completion status ", studentAssignmentCompletionStatus, "failure") +
                                report.reportFooter());
                            done();
                        }

                    }

                }

                //Function to answer all the Questions
                selectAnAnswerAndProceed();

            });


    });


    it("15. Navigate to Gradebook page", function (done) {
        menuPage.selectGradebook(userType, browser, done);

    });

    it("16. [Gradebook]Validate the Points earned by the student", function (done) {

        studenGradebookPage.getScoredPoints(browser, assessmentsPage.getAssignmentName()).then(function (valueScore) {

            if (valueScore.toString() === assessmentsPage.getRoboPointScore(questionsCorrectFromCAS)) {
                pointsFromStudentGradebook = valueScore;

                console.log(report.reportHeader() +
                    report.stepStatusWithData("GRADEBOOK : TestBot calculated point score " + assessmentsPage.getRoboPointScore(questionsCorrectFromCAS) + " points, is compared against the student point score retrieved from Student Gradebook ", valueScore, "success") +
                    report.reportFooter());
                done();
            } else {

                console.log(report.reportHeader() +
                    report.stepStatusWithData("GRADEBOOK : TestBot calculated point score " + assessmentsPage.getRoboPointScore(questionsCorrectFromCAS) + " points, is compared against the student point score retrieved from Student Gradebook ", valueScore, "failure") +
                    report.reportFooter());
                done();
            }
        });


    });


    it("17. [Gradebook]Validate the Score(Questions Correct) data on Student Gradebook", function (done) {

        studenGradebookPage.getStudentScore(browser, assessmentsPage.getAssignmentName()).then(function (studentScore) {
            scoreFromStudentGradebook = studentScore;
            console.log(report.reportHeader() +
                report.stepStatusWithData("GRADEBOOK : Questions correct retrieved from Student Assessment Results page which is " + questionsCorrectFromCAS + " questions, is compared against the student score(Questions correct) retrieved from Student Gradebook ", studentScore, "success") +
                report.reportFooter());

            done();
        });


    });

    it("18. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });


    it("19. Login as Instructor", function (done) {

        userType = "instructor";
        data = loginPage.setLoginData(userType);


        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });

    it("19a. Select a Product", function (done) {

        brainPage.selectProduct(product, browser, done);
    });

    it("20. Select a Course and launch", function (done) {
        this.timeout(120000);
        loginPage.launchACourse(userType, courseName, browser, done);

    });
    it("21. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);

    });
    it("22. Edit attempts of created assignments", function (done) {


        assessmentsPage.selectAnExistingAssignmentInCurrentDate(browser).then(function () {
            assessmentsPage.selectAttempts(browser, assessmentData.systemgenerated.scorestrategyhigh.editedAttempts).then(function () {
                assessmentsPage.saveAssignment(browser).then(function () {
                    browser
                        .sleep(10000)
                        .nodeify(done);
                });

            });
        });


    });

    it("23. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);

    });

    it("24. Login as student", function (done) {

        userType = "student";
        data = loginPage.setLoginData(userType);
        console.log(report.printLoginDetails(data.userId));
        loginPage.loginToApplication(browser, done);
    });


    it("25. Select a Course and launch", function (done) {

        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("26. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });

    it("27. Click on the current date cell", function (done) {
        browser
            .sleep(3000)
            .waitForElementByCss(".day.ng-scope.today", 5000)
            .click()
            .nodeify(done);
    });

    it("27a. Verify count of attempts remaining assignment", function (done) {

        browser
            .sleep(3000)
            .execute("return document.getElementsByClassName('attempts ng-binding')[0].textContent").then(function (attemptsremain) {
                if (attemptsremain.indexOf(assessmentData.systemgenerated.scorestrategyhigh.attemptsremaining) > -1) {
                    done();
                }
            });

    });

    it("28. Launch the assignment", function (done) {
        this.timeout(70000);
        browser
            .waitForElementByXPath("//span[contains(@class,'assessment-title')]/a[contains(text(),'" + assessmentsPage.getAssignmentName() + "')][1]", asserters.isDisplayed, 60000)
            .click()
            .sleep(10000)
            .nodeify(done);
    });


    it("29. Attempt two questions , capture the Quiz question text for the 3rd question and exit", function (done) {
        this.timeout(120000);

        browser
            .sleep(10000)
            .elementByCssSelectorWhenReady("span.cas-text", 10000)
            .isDisplayed()
            .should.become(true)
            .execute('return document.getElementsByClassName("cas-activity-series").length').then(function (len) {
                countOfQuestions2ndattempts = len;

                function selectAnAnswerAndProceed() {

                    if (countOfQuestions2ndattempts > 3) {
                        countOfQuestions2ndattempts--;
                        questioncount++;

                        browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-truefalse").length').then(function (length) {
                            if (length.toString() === "0") {
                                browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-multiple-choice")[0].tagName').then(function (tag) {
                                    if (tag === "DIV") {
                                        browser
                                            .waitForElementByXPath("(//label[@class='cas-choice-radio'])[" + mathutil.getRandomInt(1, 5) + "]", asserters.isDisplayed, 3000).click()
                                            .elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                        console.log("Answered a Question with Radio Button " + questioncount + " and remaining Questions " + countOfQuestions2ndattempts);


                                    } else {
                                        browser
                                            .waitForElementByCss("div.cas-selection-list-item", asserters.isDisplayed, 4000)
                                            .click()
                                            .waitForElementByCss("ul li:nth-of-type(" + mathutil.getRandomInt(1, 4) + ") a span.cas-text", asserters.isDisplayed, 10000)
                                            .click()
                                            .elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                        console.log("Answered a Question with a Drop down " + questioncount + " and remaining Questions " + countOfQuestions2ndattempts);

                                    }
                                    setTimeout(selectAnAnswerAndProceed, 3000);
                                });
                            }
                            else {
                                browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-truefalse")[0].tagName').then(function (tag) {
                                    if (tag === "DIV") {
                                        browser
                                            .waitForElementByXPath("(//div[@class='cas-choice-item'])[" + mathutil.getRandomInt(1, 3) + "]/label", asserters.isDisplayed, 3000).click()
                                            .elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                        console.log("Answered a True or False Question " + questioncount + " and remaining Questions " + countOfQuestions2ndattempts);


                                    } else {

                                        console.log("Problem in answering T/F");

                                    }


                                    setTimeout(selectAnAnswerAndProceed, 3000);
                                });
                            }
                        });


                    } else {
                        if (questioncount == 2) {
                            browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-truefalse").length').then(function (length) {
                                if (length.toString() === "0") {
                                    browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-multiple-choice")[0].tagName').then(function (tag) {
                                        if (tag === "DIV") {
                                            browser
                                                .execute("return document.getElementsByClassName('cas-prompt')[0].getElementsByTagName('span')[0].textContent").then(function (textofresumedquestion) {
                                                    textcontain = textofresumedquestion;
                                                    console.log(report.reportHeader() +
                                                        report.stepStatusWithData("Capture the Quiz question text for the 3rd question  ", textcontain, "success") +
                                                        report.reportFooter());
                                                    browser
                                                        .waitForElementByCss(".exit.ng-scope", asserters.isDisplayed, 3000)
                                                        .then(function (el) {
                                                            el.click().then(function () {
                                                                done();
                                                            });
                                                        });
                                                });
                                        }
                                        else {
                                            browser
                                                .execute("return document.getElementsByClassName('cas-text')[5].textContent").then(function (textofresumedquestion) {
                                                    textcontain = textofresumedquestion;
                                                    browser
                                                        .waitForElementByCss(".exit.ng-scope", asserters.isDisplayed, 3000)
                                                        .then(function (el) {
                                                            el.click().then(function () {
                                                                done();
                                                            });
                                                        });
                                                });
                                        }
                                    });
                                }
                                else {
                                    browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-truefalse")[0].tagName').then(function (tag) {
                                        if (tag === "DIV") {
                                            browser
                                                .execute("return document.getElementsByClassName('cas-prompt')[0].getElementsByTagName('span')[0].textContent").then(function (textofresumedquestion) {
                                                    textcontain = textofresumedquestion;
                                                    console.log("Capture the Quiz question text for the 3rd question: " + textcontain);
                                                    browser
                                                        .waitForElementByCss(".exit.ng-scope", asserters.isDisplayed, 3000)
                                                        .then(function (el) {
                                                            el.click().then(function () {
                                                                done();
                                                            });
                                                        });
                                                });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            studentAssignmentCompletionStatus = "failure";
                            console.log(report.reportHeader() +
                                report.stepStatusWithData("Student Assignment completion status ", studentAssignmentCompletionStatus, "failure") +
                                report.reportFooter());
                            done();
                        }

                    }

                }

                //Function to answer all the Questions
                selectAnAnswerAndProceed();

            });


    });
    it("30. Click on the current date cell and verify assignment status has Attempt in progress text", function (done) {
        browser
            .sleep(3000)
            .waitForElementByCss(".day.ng-scope.today", 5000)
            .click()
            .sleep(5000)
            .execute("return document.getElementsByClassName('assessment-title')[0].getElementsByTagName('span')[0].textContent").then(function (attemptsprogressmsg) {
                if (attemptsprogressmsg.indexOf(assessmentData.systemgenerated.scorestrategyhigh.attemptsprogressmsg) > -1) {
                    done();
                }
            });


    });


    it("31. Click on the current date cell and verify attempts remaining", function (done) {


        browser
            .sleep(3000)
            .execute("return document.getElementsByClassName('attempts ng-binding')[0].textContent").then(function (attemptsremain) {
                if (attemptsremain.indexOf(assessmentData.systemgenerated.scorestrategyhigh.attemptsremaining2) > -1) {
                    done();
                }
            });

    });

    it("32. Launch the assignment", function (done) {
        this.timeout(70000);
        browser
            .waitForElementByXPath("//span[contains(@class,'assessment-title')]/a[contains(text(),'" + assessmentsPage.getAssignmentName() + "')][1]", asserters.isDisplayed, 60000)
            .click()
            .sleep(10000)
            .nodeify(done);
    });


    it("33. Validate 3rd question text same as question text captured", function (done) {
        browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-truefalse").length').then(function (length) {
            if (length.toString() === "0") {
                browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-multiple-choice")[0].tagName').then(function (tag) {
                    if (tag === "DIV") {
                        browser
                            .execute("return document.getElementsByClassName('cas-prompt')[0].getElementsByTagName('span')[0].textContent").then(function (verifyquestiontext) {
                                if (verifyquestiontext.indexOf(textcontain) > -1) {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData(" Verify presence of question text captured  ", verifyquestiontext, "success") +
                                        report.reportFooter());
                                    done();
                                } else {

                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData(" Verify presence of question text captured  ", verifyquestiontext, "failure") +
                                        report.reportFooter());
                                    done();
                                }
                            });
                    }
                    else {
                        browser
                            .execute("return document.getElementsByClassName('cas-text')[5].textContent").then(function (verifyquestiontext) {
                                if (verifyquestiontext.indexOf(textcontain) > -1) {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData(" Verify presence of question text captured  ", verifyquestiontext, "success") +
                                        report.reportFooter());
                                    done();
                                } else {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData(" Verify presence of question text captured  ", verifyquestiontext, "failure") +
                                        report.reportFooter());
                                    done();
                                }
                            });
                    }
                });
            }
            else {
                browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-truefalse")[0].tagName').then(function (tag) {
                    if (tag === "DIV") {
                        browser
                            .execute("return document.getElementsByClassName('cas-prompt')[0].getElementsByTagName('span')[0].textContent").then(function (verifyquestiontext) {
                                if (verifyquestiontext.indexOf(textcontain) > -1) {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData(" Verify presence of question text captured  ", verifyquestiontext, "success") +
                                        report.reportFooter());
                                    done();
                                } else {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData(" Verify presence of question text captured  ", verifyquestiontext, "failure") +
                                        report.reportFooter());
                                    done();
                                }

                            });
                    }
                });
            }
        });
    });


    it("34. Attempt all remaining Questions", function (done) {
        this.timeout(120000);

        browser
            .sleep(10000)
            .elementByCssSelectorWhenReady("span.cas-text", 10000)
            .isDisplayed()
            .should.become(true)
            .execute('return document.getElementsByClassName("cas-activity-series").length').then(function (len) {

                //console.log("No of Questions : " + len);
                countOfQuestions2ndattempts = len - questioncount;
                console.log("len after attempts" + countOfQuestions2ndattempts);
                function selectAnAnswerAndProceed() {

                    if (countOfQuestions2ndattempts > 0) {
                        countOfQuestions2ndattempts--;
                        questioncount++;

                        browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-truefalse").length').then(function (length) {
                            if (length.toString() === "0") {
                                browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-multiple-choice")[0].tagName').then(function (tag) {
                                    if (tag === "DIV") {
                                        browser
                                            .waitForElementByXPath("(//label[@class='cas-choice-radio'])[" + mathutil.getRandomInt(1, 5) + "]", asserters.isDisplayed, 3000).click()
                                            .elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                        console.log("Answered a Question with Radio Button " + questioncount + " and remaining Questions " + countOfQuestions2ndattempts);


                                    } else {
                                        browser
                                            .waitForElementByCss("div.cas-selection-list-item", asserters.isDisplayed, 4000)
                                            .click()
                                            .waitForElementByCss("ul li:nth-of-type(" + mathutil.getRandomInt(1, 4) + ") a span.cas-text", asserters.isDisplayed, 10000)
                                            .click()
                                            .elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                        console.log("Answered a Question with a Drop down " + questioncount + " and remaining Questions " + countOfQuestions2ndattempts);

                                    }


                                    setTimeout(selectAnAnswerAndProceed, 3000);
                                });
                            }
                            else {
                                browser.execute('return document.getElementsByClassName("cas-task")[0].getElementsByClassName("cas-truefalse")[0].tagName').then(function (tag) {
                                    if (tag === "DIV") {
                                        browser
                                            .waitForElementByXPath("(//div[@class='cas-choice-item'])[" + mathutil.getRandomInt(1, 3) + "]/label", asserters.isDisplayed, 3000).click()
                                            .elementByCssSelectorWhenReady("button.btn.btn-default.cas-activity-action", 3000).click();
                                        console.log("Answered a True or False Question " + questioncount + " and remaining Questions " + countOfQuestions2ndattempts);


                                    } else {

                                        console.log("Problem in answering T/F");

                                    }


                                    setTimeout(selectAnAnswerAndProceed, 3000);
                                });
                            }
                        });


                    } else {
                        if (questioncount == len) {
                            console.log("All Questions successfully attempted");

                            browser
                                .waitForElementByCss(".exit.ng-scope", asserters.isDisplayed, 3000)
                                .then(function (el) {
                                    casPage.getQuestionsCorrect(browser).then(function (questionsCorrect) {

                                        console.log("Total Questions Correct " + questionsCorrect);
                                        questionsCorrectFromCAS = questionsCorrect;

                                        console.log("Total Assignment Questions " + assessmentsPage.getMaxAssignmentQuestions());
                                        studentAssignmentCompletionStatus = "success";

                                        console.log(report.reportHeader() +
                                            report.stepStatusWithData("CAS : Student Completed the assignment with questions " + assessmentsPage.getMaxAssignmentQuestions() + " and got a score of  ", questionsCorrect, "success") +
                                            report.reportFooter());

                                        el.click().then(function () {
                                            done();
                                        });


                                    });


                                });


                        }
                        else {
                            studentAssignmentCompletionStatus = "failure";
                            console.log(report.reportHeader() +
                                report.stepStatusWithData("Student Assignment completion status ", studentAssignmentCompletionStatus, "failure") +
                                report.reportFooter());
                            done();
                        }

                    }

                }

                //Function to answer all the Questions
                selectAnAnswerAndProceed();

            });


    });

    it("35. Click on the current date cell and verify assignment name is disabled ", function (done) {

        browser
            .sleep(3000)
            .waitForElementByCss(".day.ng-scope.today", 5000)
            .click()
            .sleep(2000)
            .execute("return document.getElementsByClassName('disabled-assessment')[0].getAttribute('href')").then(function (hrefdisabledlink) {
                if (hrefdisabledlink.indexOf("#") > -1) {
                    console.log("disabled link");
                    done();
                }
            });


    });

    it("36. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });


    it("37. Login as Instructor", function (done) {

        userType = "instructor";
        data = loginPage.setLoginData(userType);


        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });

    it("37b. Select a Product", function (done) {

        brainPage.selectProduct(product, browser, done);

    });

    it("38. Select a Course and launch", function (done) {
        this.timeout(120000);
        loginPage.launchACourse(userType, courseName, browser, done);

    });


    it("39. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);

    });


    it("40. Delete the created assignment", function (done) {
        this.timeout(120000);
        assessmentsPage.deleteAssignment(browser, done);
    });

    it("41. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);
    });

});
