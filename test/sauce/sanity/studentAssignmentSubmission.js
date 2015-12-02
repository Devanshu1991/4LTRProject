    /**
     * Created by nbalasundaram on 10/2/15.
     */
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
    var instructorGradebookNavigationPage = require("../support/pages/gradebook/instructor/gradebookNavigationpo");
    var instructorMainGradebookView = require("../support/pages/gradebook/instructor/mainGradebookView");
    var instructorGradebookStudentDetailedPage = require("../support/pages/gradebook/instructor/studentDetailedInfopo");
    var instructorAssessmentDetailedInfopo = require("../support/pages/gradebook/instructor/assessmentDetailedInfopo");
    var userSignOut = require("../support/pages/userSignOut");

    var assessmentData = require("../../../test_data/assignments/assessments.json");
    var gradebookData = require("../../../test_data/gradebook/gradebook.json");

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
    var _ = require('underscore');

    describe('4LTR (' + 'Instructor/Student' + ') :: ****** Tests for => Assignment Creation :: Student Submission *******', function () {
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
        var totalPointsGainedByStudent;
        var overriddenPoints;
        var dateOnStudentDetailedPage;
        var totalsudentcount;
        var totalValueOfScoresForAllStudents = 0;
        var averageScoreForAllStudents;


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
            console.log(report.formatTestName("CCS/CAS/GRADEBOOK :: INSTRUCTOR ASSIGNMENT CREATION, STUDENT SUBMISSION, STUDENT GRADEBOOK VALIDATION, INSTRUCTOR GRADEBOOK VALIDATION"));
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

        it("4a. Navigate to Assignments Page", function (done) {
            menuPage.selectAssignments(userType, browser, done);
        });

        it("4b. Delete the created assignment", function (done) {
            assessmentsPage.deleteAssignment(browser, done);
        });

        it("5. Select current date and open the Assessment Type assignment settings page", function (done) {
            calendarNavigation.selectADateForAssignment(browser).then(function () {
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
                                    assessmentsPage.selectQuestionStrategy(browser,assessmentData.systemgenerated.QuestionStrategy.option[0]).then(function(){
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
                        console.log(report.reportHeader() + report.stepStatusWithData("CCS : Instructor created an assessment type assignment called :: ", assessmentsPage.getAssignmentName(), "success") + report.reportFooter());
                        done();
                    } else {
                        assignmentCreationStatus = "failure";
                        console.log(report.reportHeader() + report.stepStatusWithData("CCS : Instructor created an assessment type assignment called :: ", assessmentsPage.getAssignmentName() + " may not have received the assessmentCGI", "failure") + report.reportFooter());
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
                .nodeify(done);
        });


        it("13. Launch the assignment", function (done) {
            browser
                .waitForElementByXPath("//span[contains(@class,'assessment-title')]/a[contains(text(),'" + assessmentsPage.getAssignmentName() + "')][1]", asserters.isDisplayed, 60000)
                .sleep(10000)
                .click()
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

                    //console.log("No of Questions : " + len);
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
            this.timeout(120000);
            menuPage.selectGradebook(userType, browser, done);
        });


        it("16. [Gradebook]Validate the Points earned by the student", function (done) {
            studenGradebookPage.getScoredPoints(browser, assessmentsPage.getAssignmentName()).then(function (valueScore) {
                console.log("Student points from the student gradebook " + valueScore);
                console.log("Robo Score " + assessmentsPage.getRoboPointScore(questionsCorrectFromCAS));
                if (valueScore.toString() === assessmentsPage.getRoboPointScore(questionsCorrectFromCAS)) {
                    pointsFromStudentGradebook = valueScore;
                    console.log(report.reportHeader() + report.stepStatusWithData("GRADEBOOK : TestBot calculated point score " + assessmentsPage.getRoboPointScore(questionsCorrectFromCAS) + " points, is compared against the student point score retrieved from Student Gradebook ", valueScore, "success") + report.reportFooter());
                    done();
                } else {
                    console.log(report.reportHeader() + report.stepStatusWithData("GRADEBOOK : TestBot calculated point score " + assessmentsPage.getRoboPointScore(questionsCorrectFromCAS) + " points, is compared against the student point score retrieved from Student Gradebook ", valueScore, "failure") + report.reportFooter());

                }
            });

        });


        it("17a. [Gradebook]Validate the Score(Questions Correct) data on Student Gradebook", function (done) {
            studenGradebookPage.getStudentScore(browser, assessmentsPage.getAssignmentName()).then(function (studentScore) {
                console.log("Student score from the student gradebook " + studentScore);
                scoreFromStudentGradebook = studentScore;
                console.log(report.reportHeader() +
                    report.stepStatusWithData("GRADEBOOK : Questions correct retrieved from Student Assessment Results page which is " + questionsCorrectFromCAS + " questions, is compared against the student score(Questions correct) retrieved from Student Gradebook ", studentScore, "success") +
                    report.reportFooter());
                done();
            });
        });

        it("17b. Validate the presence of Class average value on student grade book", function (done) {
            studenGradebookPage.validateAvgScoreOnStudentGradebook(browser, assessmentsPage.getAssignmentName(), pointsFromStudentGradebook, done);

        });

        it("17c. Validate the presence of submission date on student Gradebook page", function (done) {
            instructorGradebookStudentDetailedPage.getSubmittedDate(browser)
                .then(function (dateOnStudentDetailedPage) {
                    if (dateOnStudentDetailedPage.indexOf(dataUtil.getCurrentDateOnhyphenatedMMDDYYformat()) > -1) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Submmission date of assignment " + dateOnStudentDetailedPage + ",is compared against current date of assignment submission", dataUtil.getCurrentDateOnhyphenatedMMDDYYformat(), "success") +
                            report.reportFooter());
                        done();
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Submmission date of assignment " + dateOnStudentDetailedPage + ",is compared against current date of assignment submission", dataUtil.getCurrentDateOnhyphenatedMMDDYYformat(), "failure") +
                            report.reportFooter());
                        done();
                    }

                });

        });


        it("17d. Validate the presence of due date on student Gradebook page", function (done) {
            studenGradebookPage.getDueDate(browser).then(function (dateOnStudentGradebookPage) {

                if (dateOnStudentGradebookPage.indexOf(dataUtil.getCurrentDateOnhyphenatedMMDDYYformat()) > -1) {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("GRADEBOOK : due date of assignment " + dateOnStudentGradebookPage + ",is compared against current date of assignment submission", dataUtil.getCurrentDateOnhyphenatedMMDDYYformat(), "success") +
                        report.reportFooter());
                    done();
                } else {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("GRADEBOOK : Submmission date of assignment " + dateOnStudentGradebookPage + ",is compared against current date of assignment submission", dataUtil.getCurrentDateOnhyphenatedMMDDYYformat(), "failure") +
                        report.reportFooter());
                    done();
                }

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

        it("19b. Select a Product", function (done) {

            brainPage.selectProduct(product, browser, done);
        });

        it("20. Select a Course and launch", function (done) {
            loginPage.launchACourse(userType, courseName, browser, done);
        });

        it("21a. Navigate on Gradebook page", function (done) {
            menuPage.selectGradebook(userType, browser, done);
        });

        it("22. Count the number of student", function (done) {
            browser
                .sleep(3000)
                .waitForElementsByCssSelector(".container.ng-scope", asserters.isDisplayed, 60000).then(function (gradebook) {
                    gradebook[0].elementsByXPath("(//div[contains(@class,'ui-grid-canvas')])[1]//div[contains(@class,'ui-grid-row ng-scope')]").then(function (studentCounts) {
                        console.log("student count from wd method"+_.size(studentCounts));
                        totalsudentcount = _.size(studentCounts);
                        console.log("Number of Student :" + totalsudentcount);
                          if(!mathutil.isEmpty(totalsudentcount)){
                            console.log(report.reportHeader() +
                                report.stepStatusWithData("GRADEBOOK : Number of student who will attempt the assignment " + totalsudentcount, "success") +
                                report.reportFooter());
                                done();
                          }
                          else{
                            console.log(report.reportHeader() +
                                report.stepStatusWithData("GRADEBOOK : No student appears on the Instructor gradebook page " , "failure") +
                                report.reportFooter());
                                done();
                          }
                      });
                    });

        });


        it("23. Calcuate the total of score earned by students for a particular assignment ", function (done) {
            var sizeOfColumn = 0;
            browser
                .waitForElementsByXPath("(//div[@class='ui-grid-canvas'])[last()]/div[contains(@class,'ui-grid-row')]//div[contains(@class,'ui-grid-cell-contents')]", asserters.isDisplayed, 60000)
                .then(function (elements) {
                    sizeOfColumn = _.size(elements);
                    function calculateValue() {
                        if (sizeOfColumn > 0) {
                            browser
                                .waitForElementByXPath("((//div[@class='ui-grid-canvas'])[last()]/div[contains(@class,'ui-grid-row')]//div[contains(@class,'ui-grid-cell-contents')])[" + sizeOfColumn + "]", asserters.isDisplayed, 60000)
                                .text()
                                .then(function (value) {
                                    if(!mathutil.isEmpty(value)){
                                      totalValueOfScoresForAllStudents = totalValueOfScoresForAllStudents + parseInt(value);
                                      sizeOfColumn--;
                                      calculateValue();
                                    }
                                    else{
                                      console.log(report.reportHeader() +
                                          report.stepStatusWithData("GRADEBOOK : Score field of student's assignment is empty on Instructor gradebook ", "failure") +
                                          report.reportFooter());
                                          done();
                                    }
                                });
                        } else {
                            done();
                        }
                    }
                    calculateValue();
                });

        });


        it("24. Calculate class average for a particular assignment ", function (done) {
            averageScoreForAllStudents = (totalValueOfScoresForAllStudents / parseInt(totalsudentcount));
            console.log(report.reportHeader() +
              report.stepStatusWithData("GRADEBOOK : Average class score for a particular assignment calculated and is coming out to be ::  " + averageScoreForAllStudents, "success") +
              report.reportFooter());
              done();
        });


        it("25. Verify the presence of total points, student score value in total points on the Instructor grade book on the grade book table", function (done) {
            browser
                .waitForElementByCss(".ui-grid-cell-contents.total-points .max-points.ng-binding", asserters.isDisplayed, 60000).text()
                .then(function (totalPoints) {
                    if (totalPoints === (assessmentData.systemgenerated.scorestrategyhigh.score).toString()) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : TestBot Max Total points " + assessmentData.systemgenerated.scorestrategyhigh.score + ", is compared against the Max total points  ", totalPoints + " displayed on the Instructor Gradebook table", "success") +
                            report.reportFooter());
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : TestBot Max Total points  " + assessmentData.systemgenerated.scorestrategyhigh.score + ", is compared against the Max total points  ", totalPoints + " displayed on the Instructor Gradebook table", "failure") +
                            report.reportFooter());
                    }

                    browser
                        .waitForElementByXPath("//div[contains(@class,\"ui-grid-cell-contents ng-scope\")and contains(.,\"" + loginPage.getUserName() + "\")]/parent::div/following-sibling::div//div[contains(@class,\"ui-grid-cell-contents ng-binding ng-scope\")]", asserters.isDisplayed, 60000).text()
                        .then(function (pointsGained) {
                            totalPointsGainedByStudent = pointsGained;
                            if (totalPointsGainedByStudent.toString() === assessmentsPage.getRoboPointScore(questionsCorrectFromCAS)) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("GRADEBOOK : Total points earned by student " + totalPointsGainedByStudent + ", is compared against the testbot calculated total points earned ", assessmentsPage.getRoboPointScore(questionsCorrectFromCAS), "success") +
                                    report.reportFooter());
                                done();
                            }

                            else {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("GRADEBOOK : Total points earned by student " + totalPointsGainedByStudent + ", is compared against the testbot calculated total points earned ", assessmentsPage.getRoboPointScore(questionsCorrectFromCAS), "failure") +
                                    report.reportFooter());
                                done();
                            }
                        });
                });
        });

        it("26. Navigate to student's detailed gradebook view", function (done) {
            instructorGradebookNavigationPage.navigateToStudentDetailedPageOnGradebook(browser, loginPage.getUserName()).then(function () {
                done();
            });

        });



        it("27. Validate presence of class average value on student detailed page on instructor gradebook view ", function (done) {
            instructorGradebookStudentDetailedPage.validatePresenceOfAverageScore(browser, assessmentsPage.getAssignmentName())
                .then(function (classAvg) {
                    if (classAvg === averageScoreForAllStudents.toString()) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Average class score for a particular assignment on student detailed gradebook view ::  " + classAvg, "is compared against the calculated class average ::" + averageScoreForAllStudents, "success") +
                            report.reportFooter());
                        done();
                    }
                    else{
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Average class score for a particular assignment on student detailed gradebook view ::  " + classAvg, "is compared against the calculated class average ::" + averageScoreForAllStudents, "failure") +
                            report.reportFooter());
                        done();
                    }

                });
        });

        it("28. [Gradebook] Verify whether the system generated student point score is updated on Instructor Gradebook on the Student Detailed Results Page", function (done) {
            instructorGradebookStudentDetailedPage.getScoredPoints(browser, assessmentsPage.getAssignmentName())
                .then(function (scoredPoints) {
                    if (scoredPoints.toString() === assessmentsPage.getRoboPointScore(questionsCorrectFromCAS)) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : TestBot calculated pointScore " + assessmentsPage.getRoboPointScore(questionsCorrectFromCAS) + " points, is compared against the student point score retrieved from Instructor Gradebook ", scoredPoints, "success") +
                            report.reportFooter());
                        done();
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : TestBot calculated pointScore " + assessmentsPage.getRoboPointScore(questionsCorrectFromCAS) + " points, is compared against the student point score retrieved from Instructor Gradebook ", scoredPoints, "failure") +
                            report.reportFooter());
                    }

                });
        });

        it("29. [Gradebook] Verify whether the system generated student score(Questions Correct)  is updated on Instructor Gradebook on the Student Detailed Results Page", function (done) {
            instructorGradebookStudentDetailedPage.getStudentScore(browser, assessmentsPage.getAssignmentName())
                .then(function (scoreIns) {
                    if (scoreIns.toString() === questionsCorrectFromCAS) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Questions correct retrieved from Student Assessment Result page which is " + questionsCorrectFromCAS + " questions, is compared against the student score(Questions correct) retrieved from Instructor Gradebook ", scoreIns, "success") +
                            report.reportFooter());
                        done();
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Questions correct retrieved from Student Assessment Result page which is " + questionsCorrectFromCAS + " questions, is compared against the student score(Questions correct) retrieved from Instructor Gradebook ", scoreIns, "failure") +
                            report.reportFooter());
                        done();
                    }

                });
       });


        it("30. Navigate on Gradebook page", function (done) {
            menuPage.selectGradebook(userType, browser, done);
        });


        it("31. Override Assignment score, refresh the page and verify if screen retains the overridden score on the grade book table", function (done) {
            instructorMainGradebookView.overrideTheScore(browser).then(function () {
                browser
                    .sleep(2000)
                    .refresh()
                    .sleep(5000)
                    .waitForElementByXPath("(//div[contains(@class,'ui-grid-viewport')])[2]//div[contains(@class,'ui-grid-row')][1]//div[contains(@class,'ui-grid-cell')]//div", asserters.isDisplayed, 60000).text()
                    .then(function (overriddenPoints) {
                        if (overriddenPoints === gradebookData.instructorgradebook.overriddenscore) {
                            console.log(report.reportHeader() +
                                report.stepStatusWithData("GRADEBOOK : Overridden score from test data  " + gradebookData.instructorgradebook.overriddenscore + " , is compared against the points ", overriddenPoints + " displayed on the gradebook table", "success") +
                                report.reportFooter());
                            done();
                        }
                        else {
                            console.log(report.reportHeader() +
                                report.stepStatusWithData("GRADEBOOK : Overridden score from test data  " + gradebookData.instructorgradebook.overriddenscore + " , is compared against the points ", overriddenPoints + " displayed on the gradebook table", "failure") +
                                report.reportFooter());
                        }
                    });
            });
        });

        it("32. Verify if total points earned by student is also updated on the grade book table after the instructor has overridden the score", function (done) {
            browser
                .waitForElementByXPath("//div[contains(@class,'ui-grid-cell-contents ng-scope')]/parent::div/following-sibling::div//div[contains(@class,'ui-grid-cell-contents ng-binding ng-scope')]", asserters.isDisplayed, 60000)
                .text().should.eventually.become(gradebookData.instructorgradebook.overriddenscore)
                .nodeify(done);
        });


        it("33. Navigate to a specific student detailed view from the instructor gradebook", function (done) {
            instructorGradebookNavigationPage.navigateToStudentDetailedPageOnGradebook(browser, loginPage.getUserName()).then(function () {
                done();
            });

        });

        it("34. Validate the presence of Student name on the student detailed page", function (done) {
            browser
                .waitForElementByCss(".product-title.student-name", asserters.isDisplayed, 60000)
                .text().should.eventually.include(loginPage.getUserName())
                .nodeify(done);
        });

         it("35. Validate the overridden point score is updated correctly on the student detailed page for the assignment", function (done) {
            instructorGradebookStudentDetailedPage.getScoredPoints(browser, assessmentsPage.getAssignmentName())
                .then(function (scoredPoints) {
                    if (scoredPoints.toString() === gradebookData.instructorgradebook.overriddenscore) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Overridden point score from student detailed page " + scoredPoints + " , is compared against test data ", gradebookData.instructorgradebook.overriddenscore, "success") +
                            report.reportFooter());
                        done();
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Overridden point score from student detailed page " + scoredPoints + " , is compared against test data ", gradebookData.instructorgradebook.overriddenscore, "failure") +
                            report.reportFooter());

                    }

                });

        });

        it("36. Validate the max point score is displayed correctly on the student detailed page for the assignment", function (done) {
            instructorGradebookStudentDetailedPage.getTotalPoints(browser, assessmentsPage.getAssignmentName())
                .then(function (maxPoints) {

                    if (maxPoints.toString() === assessmentData.systemgenerated.scorestrategyhigh.score.toString()) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Total point score from student detailed page " + maxPoints + " , is compared against test data ", assessmentData.systemgenerated.scorestrategyhigh.score, "success") +
                            report.reportFooter());
                        done();
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Total point score from student detailed page " + maxPoints + " , is compared against test data ", assessmentData.systemgenerated.scorestrategyhigh.score, "failure") +
                            report.reportFooter());

                    }

                });

        });

        it("37. Validate points possible to date is displayed correctly on the points graph", function (done) {
            instructorGradebookStudentDetailedPage.getTotalPointsPossibleOnGraph(browser).then(function (pointsPossible) {
                if (pointsPossible === assessmentData.systemgenerated.scorestrategyhigh.score.toString()) {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("GRADEBOOK : Points possible to date retrieved from Points Graph " + pointsPossible + " ,is compared against total points specified for the assignment", assessmentData.systemgenerated.scorestrategyhigh.score, "success") +
                        report.reportFooter());
                    done();
                }

                else {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("GRADEBOOK : Points possible to date retrieved from Points Graph " + pointsPossible + " ,is compared against total points specified for the assignment", assessmentData.systemgenerated.scorestrategyhigh.score, "failure") +
                        report.reportFooter());

                }

            });
        });

        it("38. Validate the presence of the total points scored by the student on the points graph", function (done) {
            instructorGradebookStudentDetailedPage.getTotalPointsEarnedOnGraph(browser)
                .then(function (totalPoints) {
                    if (totalPoints === gradebookData.instructorgradebook.overriddenscore) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : TestBot calculated total points scored on the points Graph " + gradebookData.instructorgradebook.overriddenscore + ", is compared against the total points displayed on Graph ", totalPoints, "success") +
                            report.reportFooter());
                            done();
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : TestBot calculated total points scored on the points Graph " + gradebookData.instructorgradebook.overriddenscore + ",  is compared against the total points displayed on Graph ", totalPoints, "failure") +
                            report.reportFooter());

                    }
                });
        });

        it("39. Validate the presence of submission date on student detailed page under instructor gradebook view ", function (done) {
            instructorGradebookStudentDetailedPage.getSubmittedDate(browser)
                .then(function (dateOnStudentDetailedPage) {
                    if (dateOnStudentDetailedPage.indexOf(dataUtil.getCurrentDateOnhyphenatedMMDDYYformat()) > -1) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Submission date of assignment " + dateOnStudentDetailedPage + " ,is compared against current date of assignment submission", dataUtil.getCurrentDateOnhyphenatedMMDDYYformat(), "success") +
                            report.reportFooter());
                        done();
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Submission date of assignment " + dateOnStudentDetailedPage + " ,is compared against current date of assignment submission", dataUtil.getCurrentDateOnhyphenatedMMDDYYformat(), "failure") +
                            report.reportFooter());
                        done();
                    }

                });
        });

        it("40. Click on back button to navigate to gradebook view and click on the attempted assignment", function (done) {
            instructorGradebookNavigationPage.navigateToGradebookViewFromStudentDetailedPage(browser)
                .then(function () {
                  instructorGradebookNavigationPage.clickOnCreatedAssessment(browser, assessmentsPage.getAssignmentName()).then(function(){
                    instructorAssessmentDetailedInfopo.getAssessmentNameOnStudentAssessmentDetailedView(browser).then(function(assignmentname){
                      if(assignmentname.indexOf(assessmentsPage.getAssignmentName())>-1){
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Assessment name " + assignmentname + " ,is compared against assessment name", assessmentsPage.getAssignmentName(), "success") +
                            report.reportFooter());
                            done();
                      }else{
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Assessment name " + assignmentname + " ,is compared against assessment name", assessmentsPage.getAssignmentName(), "failure") +
                            report.reportFooter());
                            done();
                      }
                    });
                  });
                });
        });

        it("41. Validate the presence of score submission count on the submission graph", function (done) {
          instructorAssessmentDetailedInfopo.scoreSubmissionCountOnSubmissionGraph(browser).then(function(SubmissionCount){
            if(!mathutil.isEmpty(SubmissionCount)){
              if(parseInt(totalsudentcount) === 1){
                console.log(report.reportHeader() +
                report.stepStatusWithData("GRADEBOOK :  Score submission count on the submission graph is : ",SubmissionCount, "success") +
                report.reportFooter());
                done();
              }else{
                console.log(report.reportHeader() +
                report.stepStatusWithData("GRADEBOOK :  Score submission count on the submission graph is: ",SubmissionCount, "failure") +
                report.reportFooter());
                done();
              }
            }else{
              console.log(report.reportHeader() +
              report.stepStatusWithData("GRADEBOOK :  Score submission count on the submission graph is Empty",SubmissionCount, "failure") +
              report.reportFooter());
              done();
            }
          })
        });

        it("42. Validate the presence of score expected on the submission graph", function (done) {
          instructorAssessmentDetailedInfopo.ValidatePresenceScoreExpected(browser)
          .then(function (ScoreExpected) {
            if(ScoreExpected.indexOf("1 Submissions Expected")>-1){
              console.log(report.reportHeader() +
              report.stepStatusWithData("GRADEBOOK :  Presence of score expected on the submission graph: ",ScoreExpected, "success") +
              report.reportFooter());
              done();
            }else{
              console.log(report.reportHeader() +
              report.stepStatusWithData("GRADEBOOK :  Presence of score expected on the submission graph: ",ScoreExpected, "failure") +
              report.reportFooter());
              done();
            }

          });
        });

        it("43. Validate the presence of Scores, Distribution, Submissions headers on assignment detailed view", function (done) {
          instructorAssessmentDetailedInfopo.validateScoreLabel(browser).then(function (scorelabel) {
            if(scorelabel.indexOf("Scores")>-1){
              instructorAssessmentDetailedInfopo.validateDistibutionLabel(browser).then(function(distributionlabel){
                if(distributionlabel.indexOf("Distribution")>-1){
                  instructorAssessmentDetailedInfopo.validateSubmissionLabel(browser).then(function(submissionlabel){
                    if(submissionlabel.indexOf("Submissions")>-1){
                      console.log(report.reportHeader() +
                      report.stepStatusWithData("GRADEBOOK :  Scores, Distribution, Submissions labels are present: ",scorelabel+":"+distributionlabel+":"+submissionlabel, "success") +
                      report.reportFooter());
                      done();
                    }else {
                      console.log(report.reportHeader() +
                      report.stepStatusWithData("GRADEBOOK :  Scores, Distribution, Submissions labels are present: ",scorelabel+":"+distributionlabel+":"+submissionlabel, "failure") +
                      report.reportFooter());
                      done();
                    }
                  });
                }
              });
            }
          });
        });


        it("44.  Validate the presence of Low, Median and High labels under Scores", function (done) {
          instructorAssessmentDetailedInfopo.validateLowLabel(browser)
          .then(function (lowlabel){
            if(lowlabel.indexOf("LOW") > -1){
              instructorAssessmentDetailedInfopo.validateMedianLabel(browser).then(function(medianlabel){
                if(medianlabel.indexOf("MEDIAN") > -1){
                  instructorAssessmentDetailedInfopo.validateHighLabel(browser).then(function(highlabel){
                    if(highlabel.indexOf("HIGH") > -1){
                      console.log(report.reportHeader() +
                      report.stepStatusWithData("GRADEBOOK :  LOW, MEDIAN, HIGH labels are present: ",lowlabel+":"+medianlabel+":"+highlabel, "success") +
                      report.reportFooter());
                      done();
                    }else {
                      console.log(report.reportHeader() +
                      report.stepStatusWithData("GRADEBOOK :  LOW, MEDIAN, HIGH labels are present: ",lowlabel+":"+medianlabel+":"+highlabel, "failure") +
                      report.reportFooter());
                      done();
                    }
                  });
                }
              });
            }
          });
        });


        it("45. Validate the presence of distribution Value", function (done) {
          instructorAssessmentDetailedInfopo.validateDistibutionGraph(browser).then(function(){
            instructorAssessmentDetailedInfopo.validateDistibutionValue(browser, "1").then(function(lessthan60){
              if(lessthan60.indexOf("<60")>-1){
                instructorAssessmentDetailedInfopo.validateDistibutionValue(browser, "2").then(function(lessthan70){
                  if(lessthan70.indexOf("60-69")>-1){
                    instructorAssessmentDetailedInfopo.validateDistibutionValue(browser,"3").then(function(lessthan80){
                      if(lessthan80.indexOf("70-79")>-1){
                        instructorAssessmentDetailedInfopo.validateDistibutionValue(browser,"4").then(function(lessthan90){
                          if(lessthan90.indexOf("80-89")>-1){
                            instructorAssessmentDetailedInfopo.validateDistibutionValue(browser,"5").then(function(lessthan100){
                              if(lessthan100.indexOf("90-99")>-1){
                                instructorAssessmentDetailedInfopo.validateDistibutionValue(browser,"6").then(function(upto100){
                                  if(upto100.indexOf("100 and up")>-1){
                                    console.log(report.reportHeader() +
                                    report.stepStatusWithData("GRADEBOOK :  Distribution list Value: ",lessthan60+"::"+lessthan70+"::"+lessthan80+"::"+lessthan90+"::"+lessthan100+"::"+upto100, "success") +
                                    report.reportFooter());
                                    done();
                                  }else{
                                    console.log(report.reportHeader() +
                                    report.stepStatusWithData("GRADEBOOK :  Distribution list Value: ",lessthan60+"::"+lessthan70+"::"+lessthan80+"::"+lessthan90+"::"+lessthan100+"::"+upto100, "failure") +
                                    report.reportFooter());
                                    done();
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          })
        });

        it("46. Navigate to Assignments page", function (done) {
          menuPage.selectAssignments(userType, browser, done);
        });

        it("47. Delete the created assignment", function (done) {
          assessmentsPage.deleteAssignment(browser, done);
        });

        it("48. Log out as Instructor", function (done) {
          userSignOut.userSignOut(browser, done);
        });


      });
