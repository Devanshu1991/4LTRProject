require('colors');
var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/loginpo");
var brainPage = require("../support/pages/brianpo");
var menuPage = require("../support/pages/menupo");
var calendarNavigation = require("../support/pages/assignments/instructor/navigationpo");
var assessmentsPage = require("../support/pages/assignments/instructor/assessmentspo");
var assignmentAvgScore = require("../support/pages/assignments/instructor/assesmentspoforAvgScore");
var studentAssessmentsPage = require("../support/pages/assignments/student/studentassesmentspo");
var casPage = require("../support/pages/casTestPage");
var studenGradebookPage = require("../support/pages/gradebook/student/gradebookValidationpo");
var instructorGradebookNavigationPage = require("../support/pages/gradebook/instructor/gradebookNavigationpo");
var instructorGradebookStudentDetailedPage = require("../support/pages/gradebook/instructor/studentDetailedInfopo");
var userSignOut = require("../support/pages/userSignOut");

var assessmentData = require("../../../test_data/assignments/assessments.json");

var userAccountAction = require("../support/pages/userSignOut");
var session = require("../support/setup/browser-session");
var qaTestData = require("../../../test_data/qa.json");

var testData = require("../../../test_data/data.json");
var courseHelper = require("../support/helpers/courseHelper");

var report = require("../support/reporting/reportgenerator");
var stringutil = require("../util/stringUtil");
var mathutil = require("../util/mathUtil");
var _ = require('underscore');

var asserters = wd.asserters;

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
    var totalPointsGainedByStudent;
    var totalsudentcount;
    var questionsCorrect1stattemptFromCAS;
    var questionsCorrect2ndattemptFromCAS;
    var questionsCorrect3rdattemptFromCAS;


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
        console.log(report.formatTestName("CCS/CAS/GRADEBOOK :: ASSIGNMENT WITH AVERAGE REPORTING STRATEGY VALIDATION"));
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

    it("4. Navigate on Gradebook page", function (done) {
        menuPage.selectGradebook(userType, browser, done);
    });

    it("5. Count the number of student", function (done) {
        browser
            .sleep(3000)
            .waitForElementsByCssSelector(".container.ng-scope", asserters.isDisplayed, 60000).then(function (gradebook) {
                gradebook[0].elementsByXPath("(//div[contains(@class,'ui-grid-canvas')])[1]//div[contains(@class,'ui-grid-row ng-scope')]").then(function (studentCounts) {
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
                })

    });

    it("6. Navigate to Assignments Page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });

    it("7. Delete the created assignment", function (done) {
        assessmentsPage.deleteAssignment(browser, done);
    });

    it("8. Select current date and open the Assessment Type assignment settings page", function (done) {
        calendarNavigation.selectADateForAssignment(browser).then(function () {
            calendarNavigation.selectAssessmentTypeAssignment(browser, done);
        });
    });

    it("9. Complete the Assessment form for system created assignment", function (done) {
      assessmentsPage.enterName(browser).then(function () {
          assessmentsPage.enterRevealDate(browser).then(function () {
              assessmentsPage.selectChapter(browser, assessmentData.systemgenerated.scorestrategyhigh.chapter).then(function () {
                  assessmentsPage.enterScore(browser, assessmentData.systemgenerated.scorestrategyhigh.score).then(function () {
                          assessmentsPage.selectAttempts(browser, assessmentData.systemgenerated.scorestrategyhigh.attempts).then(function () {
                              assignmentAvgScore.selectAvgScore(browser).then(function () {
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

    it("10. Save the assessment and verify if its saved successfully", function (done) {
        this.timeout(120000);
        assessmentsPage.saveAssignment(browser).then(function () {

            assessmentsPage.checkIfAssignmentSaved(browser).then(function (value) {
                if (value.toString() === "rgb(236, 41, 142)") {

                    assignmentCreationStatus = "success";
                    console.log(report.reportHeader() + report.stepStatusWithData("CCS : Instructor created an assessment type assignment called :: ", assessmentsPage.getAssignmentName(), "success") + report.reportFooter());
                    done();
                } else {
                    assignmentCreationStatus = "failure";
                    console.log(report.reportHeader() +
                    report.stepStatusWithData("CCS : Instructor created an assessment type assignment called :: ", assessmentsPage.getAssignmentName() + " may not have received the assessmentCGI", "failure")
                     + report.reportFooter());
                    done();

                }

            });

        });
    });


    it("11. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);
    });



    it("12. Login as student", function (done) {
        userType = "student";
        data = loginPage.setLoginData(userType);
        //Reports
        console.log(report.printLoginDetails(data.userId));
        loginPage.loginToApplication(browser, done);
    });


    it("13. Select a Course and launch", function (done) {
        loginPage.launchACourse(userType, courseName, browser, done);
    });


    it("14. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });


    it("15. Click on the current date cell", function (done) {
        studentAssessmentsPage.clickOnCurrentDateCell(browser).then(function(){
          done();
        })
    });


    it("16. Launch the assignment for the first time", function (done) {
      studentAssessmentsPage.launchAssignment(browser,assessmentsPage.getAssignmentName()).then(function(){
        done();
      });
    });


    it("17. Complete the assignment and exit", function (done) {
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
                                        questionsCorrect1stattemptFromCAS = questionsCorrect;
                                        console.log("Total Questions Correct " + questionsCorrect);

                                        console.log("Total Assignment Questions " + assessmentsPage.getMaxAssignmentQuestions());
                                        studentAssignmentCompletionStatus = "success";

                                        console.log(report.reportHeader() +
                                            report.stepStatusWithData("CAS : Student Completed the 1st attempt of assignment with questions " + assessmentsPage.getMaxAssignmentQuestions() + " and got a score of  ", questionsCorrect, "success") +
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
    it("18. Click on the current date cell", function (done) {
      studentAssessmentsPage.clickOnCurrentDateCell(browser).then(function(){
        done();
      });
    });

    it("19. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });
    it("20. Login as Instructor", function (done) {
        userType = "instructor";
        data = loginPage.setLoginData(userType);
        console.log(report.printLoginDetails(data.userId));
        loginPage.loginToApplication(browser, done);
    });

    it("21. Select a Product", function (done) {

        brainPage.selectProduct(product, browser, done);
    });

    it("22. Select a Course and launch", function (done) {
        loginPage.launchACourse(userType, courseName, browser, done);
    });

    it("23. Navigate on Gradebook page", function (done) {
        menuPage.selectGradebook(userType, browser, done);
    });

    it("24. Navigate to student's detailed gradebook view", function (done) {
          instructorGradebookNavigationPage.navigateToStudentDetailedPageOnGradebook(browser, loginPage.getUserName()).then(function () {
              done();
          });

      });

    it("25. Edit due date for current student", function (done) {
        instructorGradebookStudentDetailedPage.dueDateValue(browser,assessmentsPage.getAssignmentName()).then(function(dueDateBeforeEdit){
          instructorGradebookStudentDetailedPage.editDueDate(browser, assessmentsPage.getAssignmentName()).then(function(){
            instructorGradebookStudentDetailedPage.dueDateValue(browser,assessmentsPage.getAssignmentName()).then(function(dueDateAfterEdit){
              console.log(report.reportHeader() +
              report.stepStatusWithData("Assignment due date "+dueDateBeforeEdit+" updated by",dueDateAfterEdit,"success") +
              report.reportFooter());
              done();
            });
          });
        });
    });

    it("26. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);
    });

    it("27. Login as student", function (done) {
        userType = "student";
        data = loginPage.setLoginData(userType);
        //Reports
        console.log(report.printLoginDetails(data.userId));
        loginPage.loginToApplication(browser, done);
    });


    it("28. Select a Course and launch", function (done) {
        loginPage.launchACourse(userType, courseName, browser, done);
    });


    it("29. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });

    it("30. Navigate to the next month on calender and click on 1st date of next month", function (done) {
      studentAssessmentsPage.navigateToNextMonth(browser).then(function(){
        studentAssessmentsPage.clickOnNextMonthFirstDate(browser).then(function(){
          done();
        });
      });
    });

    it("31. Launch the assignment for the second attempt", function (done) {
        studentAssessmentsPage.launchAssignment(browser,assessmentsPage.getAssignmentName()).then(function(){
          done();
        });
    });


    it("32. Complete the assignment and exit", function (done) {
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
                                        questionsCorrect2ndattemptFromCAS = questionsCorrect;
                                        console.log("Total Questions Correct " + questionsCorrect);

                                        console.log("Total Assignment Questions " + assessmentsPage.getMaxAssignmentQuestions());
                                        studentAssignmentCompletionStatus = "success";

                                        console.log(report.reportHeader() +
                                            report.stepStatusWithData("CAS : Student Completed the 2nd attempt of assignment with questions " + assessmentsPage.getMaxAssignmentQuestions() + " and got a score of  ", questionsCorrect, "success") +
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

    it("33. Navigate to the next month on calender and click on 1st date of next month", function (done) {
      studentAssessmentsPage.navigateToNextMonth(browser).then(function(){
        studentAssessmentsPage.clickOnNextMonthFirstDate(browser).then(function(){
          done();
        });
      });
    });

    it("34. Launch the assignment for the third attempt", function (done) {
        studentAssessmentsPage.launchAssignment(browser,assessmentsPage.getAssignmentName()).then(function(){
          done();
        });
    });


    it("35. Complete the assignment and exit", function (done) {
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
                                        questionsCorrect3rdattemptFromCAS = questionsCorrect;
                                        console.log("Total Questions Correct " + questionsCorrect);

                                        console.log("Total Assignment Questions " + assessmentsPage.getMaxAssignmentQuestions());
                                        studentAssignmentCompletionStatus = "success";

                                        console.log(report.reportHeader() +
                                            report.stepStatusWithData("CAS : Student Completed the 3rd attempt of assignment with questions " + assessmentsPage.getMaxAssignmentQuestions() + " and got a score of  ", questionsCorrect, "success") +
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

    it("36. Navigate to Gradebook page", function (done) {
        this.timeout(120000);
        menuPage.selectGradebook(userType, browser, done);
    });

    it("37. Wait until the gradebook page is launched completely",function(done){
      this.timeout(120000);
      function poll(){
      browser
      .waitForElementsByCssSelector(".active.ng-binding").then(function(element){
        element[0].elementsByXPath("//a[contains(@class,'active ng-binding') and contains(text(),'Gradebook')]")
        .then(function(elementdisplay){
            if(_.size(elementdisplay)){
              done();
            }else{
              browser.sleep(10000);
              poll();
            }
        })
      })
    }poll();
  });


  it("38.[Student Gradebook]:: Validate the Points earned by the student", function (done) {
      studenGradebookPage.getScoredPoints(browser, assessmentsPage.getAssignmentName()).then(function(valueScore) {
        if(!mathutil.isEmpty(valueScore)){
            if (parseInt(valueScore).toString() === assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS)) {
                pointsFromStudentGradebook = valueScore;
                console.log(report.reportHeader() + report.stepStatusWithData("GRADEBOOK : TestBot calculated point score " + assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS) + " points, is compared against the student point score retrieved from Student Gradebook ", valueScore, "success") + report.reportFooter());
                done();
            } else {
                console.log(report.reportHeader() + report.stepStatusWithData("GRADEBOOK : TestBot calculated point score " + assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS) + " points, is compared against the student point score retrieved from Student Gradebook ", valueScore, "failure") + report.reportFooter());
                done();
            }

        }else{
          console.log(report.reportHeader() +
          report.stepStatusWithData("GRADEBOOK : get point score from element is empty ",valueScore,"failure")
          + report.reportFooter());
          done();
        }

    });
  });


    it("39. [Gradebook]Validate the Score(Questions Correct) data on Student Gradebook", function (done) {
        studenGradebookPage.getStudentScore(browser, assessmentsPage.getAssignmentName()).then(function (studentScore) {
          if(!mathutil.isEmpty(studentScore)){
            if(!mathutil.isEmpty(questionsCorrect3rdattemptFromCAS)){
              if(parseInt(studentScore) === parseInt(questionsCorrect3rdattemptFromCAS)){
                scoreFromStudentGradebook = studentScore;
                console.log(report.reportHeader() +
                report.stepStatusWithData("GRADEBOOK : Questions correct retrieved from Student Assessment Results page which is " + questionsCorrect3rdattemptFromCAS + " questions, is compared against the student score(Questions correct) retrieved from Student Gradebook ", studentScore, "success") +
                report.reportFooter());
                done();
              }
              else{
                console.log(report.reportHeader() +
                report.stepStatusWithData("GRADEBOOK : Questions correct retrieved from Student Assessment Results page which is " + questionsCorrect3rdattemptFromCAS + " questions, is compared against the student score(Questions correct) retrieved from Student Gradebook ", studentScore, "failure") +
                report.reportFooter());
                done();
              }
            }else{
              console.log(report.reportHeader() +
              report.stepStatusWithData("GRADEBOOK : TestBot calculated Questions correct retrieved",questionsCorrect3rdattemptFromCAS,"failure")
              + report.reportFooter());
            }

          }else{
            console.log(report.reportHeader() +
            report.stepStatusWithData("GRADEBOOK : Get Questions correct retrieved by element",studentScore,"failure")
            + report.reportFooter());
          }
        });
    });

    it("40. Validate the presence of Class average value on student grade book", function (done) {
      browser
        .waitForElementsByXPath("//a[contains(text(),'" + assessmentsPage.getAssignmentName() + "')]/parent::td[@class='assignment-col']/parent::tr", asserters.isDisplayed, 60000)
        .then(function (assignmentRows) {
          assignmentRows[0].elementByCss("td.avg-col div.left-of-pipe span").text().then(function(valueofclassavg){
            if(!mathutil.isEmpty(valueofclassavg)){
                   // var totalsudent = assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS)/assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS);
                    if(parseInt(valueofclassavg).toString() === assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS)){
                      console.log(report.reportHeader() +
                      report.stepStatusWithData("GRADEBOOK : Class average", valueofclassavg, "success") +
                      report.reportFooter());
                      done();
                    }else{
                        console.log(report.reportHeader() +
                        report.stepStatusWithData("GRADEBOOK : Class average", valueofclassavg, "failure") +
                        report.reportFooter());
                        done();
                    }
            }else{
              console.log(report.reportHeader() +
              report.stepStatusWithData("GRADEBOOK : Class average score fetched from element is empty ",valueofclassavg,"failure")
              + report.reportFooter());
              done();
            }
          });
      });

    });

    it("41. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });
    it("42. Login as Instructor", function (done) {
        userType = "instructor";
        data = loginPage.setLoginData(userType);
        //Reports
        console.log(report.printLoginDetails(data.userId));
        loginPage.loginToApplication(browser, done);
    });

    it("43. Select a Product", function (done) {

        brainPage.selectProduct(product, browser, done);
    });

    it("44. Select a Course and launch", function (done) {
        loginPage.launchACourse(userType, courseName, browser, done);
    });

    it("45. Navigate on Gradebook page", function (done) {
        menuPage.selectGradebook(userType, browser, done);
    });

    it("46. Verify the presence of total points, student score value in total points on the Instructor grade book on the grade book table", function (done) {
        browser
            .waitForElementByCss(".ui-grid-cell-contents.total-points .max-points.ng-binding", asserters.isDisplayed, 60000).text()
            .then(function (totalPoints) {
              if(!mathutil.isEmpty(totalPoints)){
                  if (parseInt(totalPoints).toString() === parseInt(assessmentData.systemgenerated.scorestrategyhigh.score).toString()) {
                    console.log(report.reportHeader() +
                    report.stepStatusWithData("GRADEBOOK : TestBot Max Total points " + assessmentData.systemgenerated.scorestrategyhigh.score + ", is compared against the Max total points  ", totalPoints + " displayed on the Instructor Gradebook table", "success") +
                    report.reportFooter());
                  }
                  else {
                    console.log(report.reportHeader() +
                    report.stepStatusWithData("GRADEBOOK : TestBot Max Total points  " + assessmentData.systemgenerated.scorestrategyhigh.score + ", is compared against the Max total points  ", totalPoints + " displayed on the Instructor Gradebook table", "failure") +
                    report.reportFooter());
                  }
              }else{
                console.log(report.reportHeader() +
                report.stepStatusWithData("GRADEBOOK : Max Total points is empty ",totalPoints,"failure")
                + report.reportFooter());
              }
                browser
                    .waitForElementByXPath("//div[contains(@class,\"ui-grid-cell-contents ng-scope\")and contains(.,\"" + loginPage.getUserName() + "\")]/parent::div/following-sibling::div//div[contains(@class,\"ui-grid-cell-contents ng-binding ng-scope\")]", asserters.isDisplayed, 60000).text()
                    .then(function (pointsGained) {
                        totalPointsGainedByStudent = pointsGained;
                        if(!mathutil.isEmpty(pointsGained)){
                            if(parseInt(totalPointsGainedByStudent).toString() === assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS)) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("GRADEBOOK : Total points earned by student " + totalPointsGainedByStudent + ", is compared against the testbot calculated total points earned ", assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS), "success") +
                                    report.reportFooter());
                                    done();
                            }
                            else {
                              console.log(report.reportHeader() +
                              report.stepStatusWithData("GRADEBOOK : Total points earned by student " + totalPointsGainedByStudent + ", is compared against the testbot calculated total points earned ", assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS), "failure") +
                              report.reportFooter());
                              done();
                            }
                          }else{
                            console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Total points earned by student is empty ",totalPointsGainedByStudent,"failure")
                            + report.reportFooter());
                            done();
                        }
                    });
            });
    });

    it("47. Navigate to student's detailed gradebook view", function (done) {
        instructorGradebookNavigationPage.navigateToStudentDetailedPageOnGradebook(browser, loginPage.getUserName()).then(function () {
            done();
        });

    });

    it("48. [Gradebook] Verify whether the system generated student point score is updated on Instructor Gradebook on the Student Detailed Results Page", function (done) {
        instructorGradebookStudentDetailedPage.getScoredPoints(browser, assessmentsPage.getAssignmentName())
            .then(function (scoredPoints) {
            if(!mathutil.isEmpty(scoredPoints)){
                if (parseInt(scoredPoints) === parseInt(assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS))) {
                      console.log(report.reportHeader() +
                      report.stepStatusWithData("GRADEBOOK : TestBot calculated pointScore " + assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS) + " points, is compared against the student point score retrieved from Instructor Gradebook ", scoredPoints, "success") +
                      report.reportFooter());
                      done();
                  }
                  else {
                    console.log(report.reportHeader() +
                    report.stepStatusWithData("GRADEBOOK : TestBot calculated pointScore " + assignmentAvgScore.getRoboPointScore(questionsCorrect1stattemptFromCAS,questionsCorrect2ndattemptFromCAS,questionsCorrect3rdattemptFromCAS) + " points, is compared against the student point score retrieved from Instructor Gradebook ", scoredPoints, "failure") +
                    report.reportFooter());
                    done();
                  }
              }else{
                console.log(report.reportHeader() +
                report.stepStatusWithData("GRADEBOOK : Point score is empty ",scoredPoints,"failure")
                + report.reportFooter());
                done();
              }
            });
    });

    it("49. [Gradebook] Verify whether the system generated student score(Questions Correct)  is updated on Instructor Gradebook on the Student Detailed Results Page", function (done) {
        instructorGradebookStudentDetailedPage.getStudentScore(browser, assessmentsPage.getAssignmentName())
            .then(function (scoreIns) {
              if(!mathutil.isEmpty(scoreIns)){
                if(!mathutil.isEmpty(questionsCorrect3rdattemptFromCAS)){
                    if (parseInt(scoreIns) === parseInt(questionsCorrect3rdattemptFromCAS)) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Questions correct retrieved from Student Assessment Result page which is " + questionsCorrect3rdattemptFromCAS + " questions, is compared against the student score(Questions correct) retrieved from Instructor Gradebook ", scoreIns, "success") +
                            report.reportFooter());
                            done();
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("GRADEBOOK : Questions correct retrieved from Student Assessment Result page which is " + questionsCorrect3rdattemptFromCAS + " questions, is compared against the student score(Questions correct) retrieved from Instructor Gradebook ", scoreIns, "failure") +
                            report.reportFooter());
                            done();
                    }
                }else{
                  console.log(report.reportHeader() +
                  report.stepStatusWithData("GRADEBOOK : TestBot Questions correct retrieved ",questionsCorrect3rdattemptFromCAS,"failure")
                  + report.reportFooter());
                  done();
                }

              }else{
                console.log(report.reportHeader() +
                report.stepStatusWithData("GRADEBOOK : Questions correct retrieved from element is empty ",scoreIns,"failure")
                + report.reportFooter());
                done();
              }
            });
    });

    it("50. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });

    it("51. Delete the created assignment", function (done) {
        assessmentsPage.deleteAssignment(browser, done);
    });

    it("52. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);
    });
});
