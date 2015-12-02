require('colors');
var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/loginpo");
var brainPage = require("../support/pages/brianpo");
var menuPage = require("../support/pages/menupo");

var calendarNavigation = require("../support/pages/assignments/instructor/navigationpo");
var assessmentsPage = require("../support/pages/assignments/instructor/assessmentspo");
var chapterReadingAssignmentPage = require("../support/pages/assignments/instructor/chapterReadingpo");
var documentAndLinksPage = require("../support/pages/assignments/instructor/documentAndLinkspo");
var userSignOut = require("../support/pages/userSignOut");

var assessmentData = require("../../../test_data/assignments/assessments.json");

var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData = require("../../../test_data/qa.json");

var testData = require("../../../test_data/data.json");
var clearAllSavedContent = require("../support/pages/clearData");


var courseHelper = require("../support/helpers/courseHelper");

var report = require("../support/reporting/reportgenerator");
var stringutil = require("../util/stringUtil");
var _ = require('underscore');

var asserters = wd.asserters;

describe('ASSIGNMENT :: REVEAL/HIDE STUDENT ASSIGNMENTS AND INSTRUCTOR LIST VIEW VALIDATION', function () {
    var browser;
    var allPassed = true;
    var userType;
    var setDate;
    var courseName;
    var assignmentCreationStatus = "failure";
    var product;
    var assignmentCount;
    var assessmentname1;
    var assessmentname2;
    var assignment1position = 0;
    var assignment2position = 0;
    var chapterreadingastpos = 0;
    var DALastpos = 0;
    var duedate;
    var revealdate;


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
        console.log(report.formatTestName("ASSIGNMENT :: REVEAL/HIDE STUDENT ASSIGNMENTS AND INSTRUCTOR LIST VIEW VALIDATION"));
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

    it("4a. Delete the assignments if its not already deleted", function (done) {
        assessmentsPage.deleteAssignment(browser, done);
    });

    it("5. Navigate to the next month on the assignment calender view", function (done) {
        browser
            .sleep(5000)
            .execute("location.reload()")
            .sleep(10000)
            .execute("return document.getElementsByClassName('flash-alert tip-alert').length").then(function (close_x) {
                if (close_x != 0) {
                    browser
                        .execute("document.getElementsByClassName('icon-close-x')[0].click();");
                }
            })
            .waitForElementByCss(".container .cg-calendar .next", asserters.isDisplayed, 10000)
            .click()
            .waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='1')]//following-sibling::div[contains(@class,'actions ')]", asserters.isDisplayed, 10000)
            .click()
            .sleep(2000)
            .waitForElementByXPath("//button[contains(.,'assessment')]", asserters.isDisplayed, 60000)
            .click().then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("Instructor navigated to next month and than clicked on Assessment button in the assignment panel", "success") +
                    report.reportFooter());
            })
            .nodeify(done);

    });

    it("6. Complete the Assessment form for system created assignment", function (done) {
      assessmentsPage.enterName(browser).then(function () {
          assessmentsPage.enterRevealDateNextMonth(browser).then(function () {
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


    it("7. Save the assessment and verify if it is saved successfully", function (done) {
        assessmentname2 = assessmentsPage.getAssignmentName();
        this.timeout(120000);
        assessmentsPage.saveAssignment(browser).then(function () {
            assessmentsPage.checkIfAssignmentSavedOnFutureDate(browser).then(function (value) {
                if (value.toString() === "rgb(255, 219, 238)") {
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

    it("8. Click on '+' button and create Chapter Reading assignment", function (done) {
        browser
            .waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='1')]//following-sibling::div[contains(@class,'actions ')]", asserters.isDisplayed, 10000)
            .click()
            .sleep(5000)
            .then(function () {
                calendarNavigation.selectChapterReadingAssessment(browser, done);
            });

    });

    it("9. Complete the Reading assignments form", function (done) {
        chapterReadingAssignmentPage.enterName(browser).then(function () {
            assessmentsPage.enterRevealDateNextMonth(browser).then(function () {
                chapterReadingAssignmentPage.selectAChapter(browser, loginPage.getProductData().chapter.topic.documents.assignments[0].Reading.chapter);
                done();
            });
        });
    });

    it("10. Save the Reading assignment and verify if it is saved successfully", function (done) {
        chapterReadingAssignmentPage.saveAssignment(browser).then(function () {
            chapterReadingAssignmentPage.checkIfAssignmentSavedOnFuture(browser).then(function (value) {
                if (value.toString() === "rgb(255, 219, 238)") {

                    assignmentCreationStatus = "success";
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Instructor created an Chapter Reading type assignment called:: ", chapterReadingAssignmentPage.getAssignmentName(), "success") +
                        report.reportFooter());
                    done();
                } else {
                    assignmentCreationStatus = "failure";
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Instructor created an Chapter Reading type assignment called  :: ", chapterReadingAssignmentPage.getAssignmentName() + " may not have been saved successfully", "failure") +
                        report.reportFooter());
                    done();

                }
            });
        });
    });

    it("11. Click on '+' button and create Document And Link type assignment", function (done) {
        browser
            .waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='1')]//following-sibling::div[contains(@class,'actions ')]", asserters.isDisplayed, 10000)
            .click()
            .sleep(5000)
            .then(function () {
                calendarNavigation.selectDocumentsAndLinksTypeAssignment(browser, done);
            });

    });

    it("12. Complete the Document and Link form for system created assignment", function (done) {
        documentAndLinksPage.enterName(browser).then(function () {
            assessmentsPage.enterRevealDateNextMonth(browser)
                .then(function () {
                    documentAndLinksPage.enterDescription(browser)
                        .nodeify(done);
                });
        });
    });

    it("13. Add the attachments in the assignment", function (done) {
        browser
            .waitForElementByCss("button.attachment.ng-scope", asserters.isDisplayed, 60000)
            .click().then(function () {
                documentAndLinksPage.addTheAttachments(browser, done);
            });
    });

    it("14. Save the Documents and Link type Assignment and verify it gets saved successfully", function (done) {
        documentAndLinksPage.saveAssignment(browser).then(function () {
            documentAndLinksPage.clickOnMore(browser).then(function () {
                documentAndLinksPage.checkIfAssignmentSavedOnFuture(browser).then(function (value) {
                    if (value.toString() === "rgb(255, 219, 238)") {
                        assignmentCreationStatus = "success";
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("CCS : Instructor created an document and LinksPage type assignment called :: ", documentAndLinksPage.getAssignmentName(), "success") +
                            report.reportFooter());
                        done();
                    } else {
                        assignmentCreationStatus = "failure";
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("CCS : Instructor created an document and LinksPage type assignment called :: ", documentAndLinksPage.getAssignmentName() + " may not have been successfully saved", "failure") +
                            report.reportFooter());
                        done();
                    }

                });
            });
        });
    });


    it("15. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);
    });

    it("16. Login as student", function (done) {
        userType = "student";
        data = loginPage.setLoginData(userType);
        //Reports
        console.log(report.printLoginDetails(data.userId));
        loginPage.loginToApplication(browser, done);
    });


    it("17. Select a Course and launch", function (done) {
        loginPage.launchACourse(userType, courseName, browser, done);

    });


    it("18. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });

    it("19. Navigate to the next month on calender view and verify the none of the assignment is visible", function (done) {
        browser
            .sleep(5000)
            .waitForElementByCss(".container .cg-calendar .next", asserters.isDisplayed, 10000)
            .click()
            .sleep(2000)
            .waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='1')]//following-sibling::div[@class='assignment-due ng-hide']/parent::div", asserters.isDisplayed, 10000)
            .isDisplayed()
            .should.become(true).then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("Assignments with future date reveal date is hidden from student calender :: ", "success") +
                    report.reportFooter());
                done();
            });
    });

    it("20. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });

    it("21. Login as Instructor", function (done) {
        userType = "instructor";
        data = loginPage.setLoginData(userType);
        //Reports
        console.log(report.printLoginDetails(data.userId));
        loginPage.loginToApplication(browser, done);
    });

    it("22. Select a Course and launch", function (done) {
        this.timeout(120000);
        loginPage.launchACourse(userType, courseName, browser, done);

    });
    it("23. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);

    });
    it("24. Navigate to the next month on the assignment calender view", function (done) {
        browser
            .sleep(5000)
            .waitForElementByCss(".container .cg-calendar .next", asserters.isDisplayed, 10000)
            .click()
            .sleep(2000)
            .nodeify(done);
    });

    it("25. Click on more button in assignment cell", function (done) {
        documentAndLinksPage.clickOnMore(browser).then(function () {
            done();
        });
    });

    it("26. Edit reveal date and due date of the created assignment", function (done) {
        this.timeout(150000);
        browser
            .sleep(2000)
            .execute("return document.querySelectorAll(\"[class='day ng-scope']\")[0].getElementsByClassName('event ng-scope is-not-revealed-to-students').length").then(function (assignmentCountn) {
                assignmentCount = assignmentCountn;
                function editAssignment() {
                    if (assignmentCount > 0) {
                        browser
                            .sleep(20000)
                            .waitForElementByXPath("((//div[@class='week ng-scope day-selection-disabled']//div[@class='day ng-scope'])[1]//div[contains(@class,'event')])[" + assignmentCount + "]//span", asserters.isDisplayed, 10000)
                            .click()
                            .waitForElementByXPath("(//div[@class='span-half']//div[@class='datefield ng-binding'])[1]", asserters.isDisplayed, 10000)
                            .text().then(function (duedateforassignment) {
                                browser
                                    .waitForElementByXPath("(//div[@class='span-half']//div[@class='datefield ng-binding'])[2]", asserters.isDisplayed, 10000)
                                    .text().then(function (revealdateforassignment) {
                                        duedate = duedateforassignment;
                                        revealdate = revealdateforassignment;
                                        console.log(duedate);
                                        console.log(revealdate);
                                    });
                            })
                            .sleep(3000)
                            .waitForElementByXPath("(//div[contains(@class,'datefield ng-binding')])[2]", asserters.isDisplayed, 10000)
                            .click().then(function () {
                                if (browser.waitForElementByXPath("(//div[@class='datepicker cg-calendar ng-isolate-scope']//div[@class='week ng-scope'])[last()]//div[@class='day ng-scope different-month selected']", asserters.isDisplayed)) {
                                    browser
                                        .sleep(2000)
                                        .waitForElementByCss("div[class='datepicker cg-calendar ng-isolate-scope'] .day.ng-scope.today", asserters.isDisplayed, 10000)
                                        .click()
                                        .sleep(2000);
                                }
                                else {

                                    browser
                                        .waitForElementByXPath("//div[@class='span-half']//cg-date-picker[@label-text='Reveal in Student Calendar']//div[@class='previous']", asserters.isDisplayed, 10000)
                                        .click()
                                        .sleep(2000)
                                        .waitForElementByCss("div[class='datepicker cg-calendar ng-isolate-scope'] .day.ng-scope.today", asserters.isDisplayed, 10000)
                                        .click()
                                        .sleep(2000);
                                }
                            }).then(function () {
                                browser
                                    .sleep(8000)
                                    .waitForElementByXPath("(//div[contains(@class,'datefield ng-binding')])[1]", asserters.isDisplayed, 10000)
                                    .click()
                                    .then(function () {
                                        if (browser.waitForElementByXPath("(//div[@class='datepicker cg-calendar ng-isolate-scope']//div[@class='week ng-scope'])[last()]//div[@class='day ng-scope different-month selected']", asserters.isDisplayed)) {
                                            browser
                                                .sleep(2000)
                                                .waitForElementByCss("div[class='datepicker cg-calendar ng-isolate-scope'] .day.ng-scope.today", asserters.isDisplayed, 10000)
                                                .click()
                                                .execute("return document.getElementsByClassName('done ng-scope').length").then(function (donebtn) {
                                                    if (donebtn) {
                                                        browser
                                                            .execute("document.getElementsByClassName('done ng-scope')[0].click()")
                                                            .sleep(5000).then(function () {
                                                                console.log(report.reportHeader() +
                                                                    report.stepStatusWithData("Assessment assignment " + assessmentname2 + "'s due date " + duedate + "and reveal date " + revealdate + " is edited and set to the current date:: ", dataUtil.getDateFormatForAssignment(), "success") +
                                                                    report.reportFooter());
                                                                assignmentCount--;
                                                                editAssignment();
                                                            });

                                                    }
                                                    else {
                                                        browser
                                                            .waitForElementsByCssSelector(".assignment-nav-content", asserters.isDisplayed, 60000).then(function (assignmentpanel) {
                                                                assignmentpanel[0].elementsByXPath("//div[@class='assignment-nav-content']//h2").then(function (elements) {
                                                                    if (_.size(elements) === 1) {

                                                                        console.log(report.reportHeader() +
                                                                            report.stepStatusWithData("Chapter Reading assignment  " + chapterReadingAssignmentPage.getAssignmentName() + "'s due date " + duedate + "and reveal date " + revealdate + " is edited and set to the current date:: ", dataUtil.getDateFormatForAssignment(), "success") +
                                                                            report.reportFooter());

                                                                    }
                                                                    else {
                                                                        console.log(report.reportHeader() +
                                                                            report.stepStatusWithData("Document and Link assignment " + documentAndLinksPage.getAssignmentName() + "'s due date " + duedate + "and reveal date " + revealdate + " is edited and set to the current date:: ", dataUtil.getDateFormatForAssignment(), "success") +
                                                                            report.reportFooter());

                                                                    }
                                                                });
                                                            })
                                                            .execute("document.getElementsByClassName('save ng-scope')[0].click()")
                                                            .sleep(5000);
                                                        assignmentCount--;
                                                        editAssignment();
                                                    }
                                                });
                                        }
                                        else {
                                            browser
                                                .waitForElementByXPath("//div[@class='span-half']//cg-date-picker[@label-text='Reveal in Student Calendar']//div[@class='previous']", asserters.isDisplayed, 10000)
                                                .click()
                                                .sleep(2000)
                                                .waitForElementByCss("div[class='datepicker cg-calendar ng-isolate-scope'] .day.ng-scope.today", asserters.isDisplayed, 10000)
                                                .click()
                                                .execute("return document.getElementsByClassName('done ng-scope').length").then(function (donebtn) {
                                                    if (donebtn) {
                                                        browser
                                                            .execute("document.getElementsByClassName('done ng-scope')[0].click()")
                                                            .sleep(5000).then(function () {
                                                                console.log(report.reportHeader() +
                                                                    report.stepStatusWithData("Chapter Reading assignment  " + assessmentname2 + " due date " + duedate + "and reveal date " + revealdate + " is edited and set to the current date:: ", dataUtil.getDateFormatForAssignment(), "success") +
                                                                    report.reportFooter());
                                                                assignmentCount--;
                                                                editAssignment();
                                                            });
                                                    }
                                                    else {
                                                        browser
                                                            .waitForElementsByCssSelector(".assignment-nav-content", asserters.isDisplayed, 60000).then(function (assignmentpanel) {
                                                                assignmentpanel[0].elementsByXPath("//div[@class='assignment-nav-content']//h2").then(function (elements) {
                                                                    if (_.size(elements) === 1) {
                                                                        console.log(report.reportHeader() +
                                                                            report.stepStatusWithData("Assessment  " + chapterReadingAssignmentPage.getAssignmentName() + " due date " + duedate + "and reveal date " + revealdate + " is edited and set to the current date:: ", dataUtil.getDateFormatForAssignment(), "success") +
                                                                            report.reportFooter());
                                                                    }
                                                                    else {
                                                                        console.log(report.reportHeader() +
                                                                            report.stepStatusWithData("Assessment  " + documentAndLinksPage.getAssignmentName() + " due date " + duedate + "and reveal date " + revealdate + " is edited and set to the current date:: ", dataUtil.getDateFormatForAssignment(), "success") +
                                                                            report.reportFooter());
                                                                    }
                                                                });
                                                            })
                                                            .execute("document.getElementsByClassName('save ng-scope')[0].click()")
                                                            .sleep(5000);
                                                        assignmentCount--;
                                                        editAssignment();
                                                    }
                                                });
                                        }
                                    });
                            });
                    }
                    else {
                        browser.sleep(10000);
                        done();
                    }
                }

                editAssignment();
            });
    });

    it("26a. Click on previous button for navigating to current month", function (done) {
        calendarNavigation.navigateCurrentMonthFromNextMonth(browser, done);
    });
    it("26b. Verify all edited assignment present on current date", function (done) {
        documentAndLinksPage.clickOnMore(browser).then(function () {
            browser
                .waitForElementsByCssSelector(".container.ng-scope .day.ng-scope.today.selected", asserters.isDisplayed, 60000).then(function (currentdatecell) {
                    currentdatecell[0].elementsByXPath("(//div[@class='day ng-scope today selected'])[1]//div[contains(@class,'event')]").then(function (assignmentcountoncurrentdate) {
                        var astcount = 1;

                        function verifyAssignmentbackgroundcolor() {
                            if (astcount <= _.size(assignmentcountoncurrentdate)) {
                                browser
                                    .execute("return window.getComputedStyle(document.evaluate(\"(//div[contains(@class,'cg-calendar ng-isolate-scope')]//div[contains(@class,'day ng-scope today')])[1]/div[contains(@class,'event ng-scope')][" + astcount + "]//span\", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue.parentNode).getPropertyValue('background-color');").then(function (value) {
                                        if (value.toString() === "rgb(236, 41, 142)") {
                                            astcount++;
                                            verifyAssignmentbackgroundcolor();
                                        }
                                    });
                            }
                            else {
                                countassignment = astcount - 1;
                                if (countassignment === _.size(assignmentcountoncurrentdate)) {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("All edited Assignments on current date are visible", "success") +
                                        report.reportFooter());
                                    done();
                                }
                                else {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("All edited Assignments on current date are visible", "failure") +
                                        report.reportFooter());
                                    done();
                                }
                            }
                        }

                        verifyAssignmentbackgroundcolor();
                    });
                });

        });
    });
    it("27. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);
    });

    it("28. Login as student", function (done) {
        userType = "student";
        data = loginPage.setLoginData(userType);
        console.log(report.printLoginDetails(data.userId));
        loginPage.loginToApplication(browser, done);
    });


    it("29. Select a Course and launch", function (done) {
        loginPage.launchACourse(userType, courseName, browser, done);
    });


    it("30. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });
    it("31. Click on the current date cell verify 3 assignments are present", function (done) {
        browser
            .sleep(3000)
            .waitForElementByCss(".day.ng-scope.today.selected .assignment-due span", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include("3")
            .waitForElementByCss(".day.ng-scope.today", 5000)
            .click()
            .nodeify(done);
    });
    it("32. Verify assignments present on current date", function (done) {
        var DNRast = documentAndLinksPage.getAssignmentName().toUpperCase();
        var Chapterast = chapterReadingAssignmentPage.getAssignmentName().toUpperCase();
        browser
            .sleep(2000)
            .waitForElementByCss(".ng-binding.assignment-title-link", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(assessmentsPage.getAssignmentName())
            .waitForElementByXPath("(//div[@class='title ng-binding'])[1]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(Chapterast)
            .waitForElementByXPath("(//div[@class='title ng-binding'])[2]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(DNRast).then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("All assignments are present on current date of student calender:: ", "success") +
                    report.reportFooter());
                done();
            });

    });

    it("33. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });

    it("34. Login as Instructor", function (done) {

        userType = "instructor";
        data = loginPage.setLoginData(userType);


        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });


    it("35. Select a Course and launch", function (done) {
        this.timeout(120000);
        loginPage.launchACourse(userType, courseName, browser, done);

    });
    it("36. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);

    });
    it("37. Select current date and open the assessment type assignment settings page", function (done) {
        calendarNavigation.selectADateForAssignment(browser).then(function () {
            calendarNavigation.selectAssessmentTypeAssignment(browser, done);
        });
    });

    it("38. Complete the Assessment form for system created assignment", function (done) {
        assessmentsPage.enterName(browser).then(function () {
            assessmentsPage.enterRevealDate(browser).then(function () {
                assessmentsPage.selectChapter(browser, assessmentData.systemgenerated.scorestrategyhigh.chapter).then(function () {
                    assessmentsPage.enterScore(browser, assessmentData.systemgenerated.scorestrategyhigh.score).then(function () {
                        assessmentsPage.selectAttempts(browser, assessmentData.systemgenerated.scorestrategyhigh.editedAttempts).then(function () {
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

    it("39. Save the assessment and verify if its saved successfully", function (done) {
        this.timeout(120000);
        assessmentsPage.saveAssignment(browser).then(function () {
            documentAndLinksPage.clickOnMore(browser).then(function () {
                assessmentsPage.checkIfAssignmentSaved(browser).then(function (value) {
                    if (value.toString() === "rgb(236, 41, 142)") {
                        assessmentname1 = assessmentsPage.getAssignmentName();
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
    });

    it("40. Click on Assignment list view", function (done) {
        calendarNavigation.navigateAssignmentListView(browser, done);
    });

    it("41. Retrieve position of created assignments and verify their presence on list view", function (done) {
        browser
            .waitForElementsByCssSelector(".assignment-list-container", asserters.isDisplayed, 60000).then(function (readerContents) {
                readerContents[0].elementsByXPath("//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[@class='ui-grid-row ng-scope']").then(function (elements) {

                    var countassignmentonlistview = 1;

                    function findAssignmentPos() {
                        if (countassignmentonlistview <= _.size(elements)) {
                            browser
                                .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[" + countassignmentonlistview + "]//div[contains(@class,'ui-grid-cell')]//div)[1]")
                                .text().then(function (textast) {
                                    if (textast.indexOf(assessmentname1) > -1) {
                                        assignment1position = countassignmentonlistview;
                                        countassignmentonlistview++;
                                        findAssignmentPos();
                                    }
                                    else if (textast.indexOf(assessmentname2) > -1) {
                                        assignment2position = countassignmentonlistview;
                                        countassignmentonlistview++;
                                        findAssignmentPos();
                                    }
                                    else if (textast.indexOf(chapterReadingAssignmentPage.getAssignmentName()) > -1) {
                                        chapterreadingastpos = countassignmentonlistview;
                                        countassignmentonlistview++;
                                        findAssignmentPos();
                                    }
                                    else if (textast.indexOf(documentAndLinksPage.getAssignmentName()) > -1) {
                                        DALastpos = countassignmentonlistview;
                                        countassignmentonlistview++;
                                        findAssignmentPos();
                                    } else {
                                        countassignmentonlistview++;
                                        findAssignmentPos();
                                    }
                                });
                        }
                        else {
                            if (assignment1position != 0) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("Assessment with two attempts created by the instructor is present on the list view at position " + assignment1position + ":: ", assessmentname1, "success") +
                                    report.reportFooter());
                            } else {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("Assessment with two attempts created by the instructor is present on the list view :: ", assessmentname1, "failure") +
                                    report.reportFooter());
                            }
                            if (assignment2position != 0) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("Assessment with unlimited attempts created by the instructor is present on the list view at position " + assignment2position + ":: ", assessmentname2, "success") +
                                    report.reportFooter());
                            } else {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("Assessment with unlimited attempts created by the instructor is present on the list view :: ", assessmentname2, "failure") +
                                    report.reportFooter());
                            }
                            if (chapterreadingastpos != 0) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("Chapter Reading assignment created by the instructor is present on the list view at position " + chapterreadingastpos + ":: ", chapterReadingAssignmentPage.getAssignmentName(), "success") +
                                    report.reportFooter());
                            } else {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("Chapter Reading assignment created by the instructor is present on the list view :: ", chapterReadingAssignmentPage.getAssignmentName(), "failure") +
                                    report.reportFooter());
                            }
                            if (DALastpos != 0) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("Document And Link type assignment created by the instructor is present on the list view at position " + DALastpos + ":: ", documentAndLinksPage.getAssignmentName(), "success") +
                                    report.reportFooter());
                            } else {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("Document And Link type assignment created by the instructor is present on the list view :: ", documentAndLinksPage.getAssignmentName(), "failure") +
                                    report.reportFooter());
                            }
                            done();
                        }
                    }

                    findAssignmentPos();
                });
            });
    });
    it("42. Verify presence of 'Assessment' type assignments, their attempts, score, due date and reveal date", function (done) {
        calendarNavigation.veryfyAssessmentOnListView(browser, done, assignment1position, assignment2position,
            assessmentname1,
            dataUtil.getDateFormatForAssignment(),
            assessmentData.systemgenerated.scorestrategyhigh.score,
            assessmentData.systemgenerated.scorestrategyhigh.editedAttempts,
            assessmentname2,
            assessmentData.systemgenerated.scorestrategyhigh.unlimitedattempts);
    });

    it("43. Verify presence of 'Chapter Reading' and 'Document And Link' type assignments, their attempts, score, due dates and reveal dates", function (done) {
        calendarNavigation.veryfyAssessmentOnListView(browser, done, chapterreadingastpos, DALastpos, chapterReadingAssignmentPage.getAssignmentName(),
            dataUtil.getDateFormatForAssignment(),
            assessmentData.systemgenerated.scorestrategyhigh.scorezero,
            assessmentData.systemgenerated.scorestrategyhigh.unlimitedattempts,
            documentAndLinksPage.getAssignmentName(),
            assessmentData.systemgenerated.scorestrategyhigh.unlimitedattempts);

    });

    it("44. Verify sorting of attempts on list view", function (done) {
        assessmentsPage.verifyAssessmentAttemptsAfterSort(browser, assessmentData.systemgenerated.scorestrategyhigh.editedAttempts)
            .then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("Verify sorting of attempts on list view :: ", "success") +
                    report.reportFooter());
                done();
            });
    });

    it("45. Click on assignment calender view", function (done) {
        calendarNavigation.navigateAssignmentCalenderView(browser, done);
    });


    it("46. Delete the created assignment", function (done) {
        assessmentsPage.deleteAssignment(browser, done);
    });


    it("47. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);
    });

});
