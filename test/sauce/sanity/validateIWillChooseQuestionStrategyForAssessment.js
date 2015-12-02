require('colors');

var wd = require('wd');
var _ = require('underscore');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/loginpo");
var brainPage = require("../support/pages/brianpo");
var menuPage = require("../support/pages/menupo");

var calendarNavigation = require("../support/pages/assignments/instructor/navigationpo");
var assessmentsPage = require("../support/pages/assignments/instructor/assessmentspo");
var studentAssessmentsPage = require("../support/pages/assignments/student/studentassesmentspo");
var instructorGradebookStudentDetailedPage = require("../support/pages/gradebook/instructor/studentDetailedInfopo");
var casPage = require("../support/pages/casTestPage");
var studenGradebookPage = require("../support/pages/gradebook/student/gradebookValidationpo");
var instructorGradebookNavigationPage = require("../support/pages/gradebook/instructor/gradebookNavigationpo");
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

describe('CCS/CAS/ASSIGNMENT :: I WILL CHOOSE ASSIGNMENT WITH DROP LOWEST SCORE TEST STRATEGY VALIDATION', function () {
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
    var bloomsText;
    var difficultyText;
    var questionPool = 0;
    var questionsCorrect1stattemptFromCAS;
    var questionsCorrect2ndattemptFromCAS;
    var questionsCorrect3rdattemptFromCAS;
    var secondtConceptContent;
    var firstConceptContent;

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
        console.log(report.formatTestName("CCS/CAS/ASSIGNMENT :: I WILL CHOOSE ASSIGNMENT WITH DROP LOWEST SCORE TEST STRATEGY VALIDATION"));
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

    it.skip("4b. Delete the created assignment", function (done) {
        assessmentsPage.deleteAssignment(browser, done);
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


    it("6. Complete the Assessment form Seeting tab for system created assignment", function (done) {

        assessmentsPage.enterName(browser).then(function () {
            assessmentsPage.validateDueAndRevealDateText(browser, assessmentData.systemgenerated.iwillchoose.dueRevealDate).then(function () {
                assessmentsPage.selectChapter(browser, assessmentData.systemgenerated.iwillchoose.chapter).then(function () {
                    assessmentsPage.enterScore(browser, assessmentData.systemgenerated.scorestrategyhigh.score).then(function () {
                        assessmentsPage.selectAttempts(browser, assessmentData.systemgenerated.scorestrategyAverage.attempts).then(function () {
                            assessmentsPage.selectScoreStrategy(browser, assessmentData.systemgenerated.scorestrategyAverage.scoreStrategy).then(function () {
                                assessmentsPage.selectDropLowestScore(browser).then(function () {
                                    assessmentsPage.selectQuestionStrategy(browser, assessmentData.systemgenerated.QuestionStrategy.option[1]).then(function () {
                                        assessmentsPage.validateQuestionPerStudentDefaultSelection(browser).then(function () {
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
    });

    it("7. Expand the filter Panel and report all the filters and sub-filters", function (done) {
        this.timeout(240000);
        assessmentsPage.expandTheFilterPanel(browser).then(function () {
            assessmentsPage.getFilterOptions(browser, "Type").then(function () {
                assessmentsPage.getFilterOptions(browser, "Blooms").then(function () {
                    assessmentsPage.getFilterOptions(browser, "Difficulty").then(function () {
                        done();
                    });
                });
            });
        });
    });

    it("8. Expand concept filter and report all the concepts", function (done) {
        browser
            .waitForElementByCss(".content-select", asserters.isDisplayed, 60000)
            .click().then(function () {
                var counter = 0;
                browser
                    .sleep(2000)
                    .elementsByCssSelector(".chapter-options .cg-checkbox label")
                    .then(function (parameters) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("There are " + _.size(parameters) + " concepts under chapter " + assessmentData.systemgenerated.iwillchoose.chapter + " and they are", "success") +
                            report.reportFooter());
                        function printConceptsText() {
                            if (counter < _.size(parameters)) {
                                parameters[counter].text().then(function (conceptText) {
                                    var pos = counter + 1;
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("At position " + pos + " concept", conceptText, "success") +
                                        report.reportFooter());
                                    counter++;
                                    printConceptsText();
                                });
                            }
                            else {
                                done();
                            }
                        }

                        printConceptsText();
                    });
            });
    });

    it("9. Clear all Concept Filters, select any 2 concepts and collapse the filter", function (done) {
        browser
            .waitForElementByXPath("//div[contains(@class,'assessment-filters')]//h6[contains(.,'Concepts')]/a", asserters.isDisplayed, 60000)
            .click()
            .sleep(2000)
            .waitForElementByXPath("(//div[@class='chapter-options']//label)["+assessmentData.systemgenerated.iwillchoose.filter.ConceptsNumber[0]+"]", asserters.isDisplayed, 60000)
            .then(function(firstConcept){
              firstConcept.click()
              firstConcept.text().then(function(content){
                firstConceptContent=content;
            browser
              .sleep(2000)
              .waitForElementByXPath("(//div[@class='chapter-options']//label)["+assessmentData.systemgenerated.iwillchoose.filter.ConceptsNumber[1]+"]", asserters.isDisplayed, 60000)
              .then(function(secondConcept){
                  secondConcept.click()
                  secondConcept.text().then(function(content){
                    secondtConceptContent=content;
                    done();
                  });
              });
          });
        });
    });

    it("10a. Filter first Question has Type, Bloom, Difficulty Specified", function (done) {
        var typeFilterText;
        var bloomFilterText;
        var difficultyFilterText;
        assessmentsPage.retrieveFilterType(browser).then(function (typeText) {
            browser
                .waitForElementByXPath("(//div[contains(@class,'filter-column') and contains(.,'Type')]//ul//li//label)[1]", asserters.isDisplayed, 60000)
                .click().then(function () {
                    assessmentsPage.retrieveBloomType(browser).then(function (bloomText) {
                        browser
                            .waitForElementByXPath("(//div[contains(@class,'filter-column') and contains(.,'Bloom')]//ul//li//label)[1]", asserters.isDisplayed, 60000)
                            .click().then(function () {
                                assessmentsPage.retrieveDifficultyType(browser).then(function (difficultyText) {
                                    browser
                                        .waitForElementByXPath("(//div[contains(@class,'filter-column') and contains(.,'Difficulty')]//ul//li//label)[1]", asserters.isDisplayed, 60000)
                                        .click().then(function () {
                                            browser
                                                .sleep(4000)
                                                .waitForElementByCss(".filter-questions", asserters.isDisplayed, 60000).click()
                                                // .waitForElementByCss(".concept", asserters.isDisplayed, 60000)
                                                // .text()
                                                // .should.eventually.include(firstConceptContent)
                                                .waitForElementByCss(".description", asserters.isDisplayed, 60000)
                                                .text().then(function (descriptiontext) {
                                                    typeFilterText = stringutil.returnValueAfterSplit(descriptiontext, "|", 1);
                                                    if (typeFilterText.indexOf(typeText) > -1) {
                                                        console.log(report.reportHeader() +
                                                            report.printTestData("Type filter from first Question which is " + typeFilterText + " is compared against the type filter selected" + typeText, "success") +
                                                            report.reportFooter());
                                                    }
                                                    bloomFilterText = stringutil.returnValueAfterSplit(descriptiontext, "|", 3);
                                                    if (bloomFilterText.indexOf(bloomText) > -1) {
                                                        console.log(report.reportHeader() +
                                                            report.printTestData("Boom filter from first Question which is " + bloomFilterText + " is compared against the type filter selected" + bloomText, "success") +
                                                            report.reportFooter());
                                                    }
                                                    difficultyFilterText = stringutil.returnValueAfterSplit(descriptiontext, "|", 2);
                                                    if (difficultyFilterText.indexOf(difficultyText) > -1) {
                                                        console.log(report.reportHeader() +
                                                            report.printTestData("Difficulty filter from first Question which is " + difficultyFilterText + " is compared against the type filter selected" + difficultyText, "Success") +
                                                            report.reportFooter());
                                                        done();
                                                    }
                                                });
                                        });
                                });
                            });
                    });
                });
        });
    });

    it("10b. Validate filtered first Question has Specified concept", function (done) {
      browser
        .waitForElementByXPath("(//span[@class='description']//span[@class='concept'])[1]",asserters.isDisplayed, 60000).text().then(function(conceptContent){
        if(conceptContent.indexOf(firstConceptContent)>-1){
          console.log(report.reportHeader() +
              report.printTestData("Concept in the question and First concept selected are same which is ", firstConceptContent, "success") +
              report.reportFooter());
              done();
        }
        else if (conceptContent.indexOf(secondtConceptContent)>-1) {
          console.log(report.reportHeader() +
              report.printTestData("Concept in the question and Second concept selected are same which is ", secondtConceptContent, "success") +
              report.reportFooter());
              done();
        }
        else{
          console.log(report.reportHeader() +
              report.printTestData("Concept in the question which is "+conceptContent+" does not match with any selected concept ","failure") +
              report.reportFooter());
              done();
        }
      });
    });

    it("11. Select all filters again and vheck 5 Question", function (done) {
        var count = 1;
        browser
            .waitForElementByCss(".filter-questions", asserters.isDisplayed, 60000).click()
            .sleep(2000)
            .execute("document.getElementsByClassName('select-all-filters')[0].scrollIntoView(true);")
            .sleep(2000)
            .waitForElementByCss(".select-all-filters", asserters.isDisplayed, 60000).click().then(function () {
                browser
                    .execute("document.getElementsByClassName('filter-questions')[0].scrollIntoView(true);")
                    .sleep(2000)
                    .waitForElementByCss(".filter-questions", asserters.isDisplayed, 60000).click().then(function () {
                        function selectQuestions() {
                            if (count <= 5) {
                                browser
                                    .waitForElementByXPath("(//div[@class='full-width']//ul//li//div)[" + count + "]", asserters.isDisplayed, 60000)
                                    .click().then(function () {
                                        questionPool++;
                                        count++;
                                        selectQuestions();
                                    })
                            }
                            else {
                                if (questionPool == 5) {
                                    console.log(report.reportHeader() +
                                        report.printTestData("Number of Questions selected is ", questionPool, "success") +
                                        report.reportFooter());
                                    done();
                                } else {
                                    console.log(report.reportHeader() +
                                        report.printTestData("Number of Questions selected is ", questionPool, "failure") +
                                        report.reportFooter());
                                    done();
                                }
                            }
                        }

                        selectQuestions();

                    });
            })
    });

    it("12. Validate the pool of question label ", function (done) {
        browser
            .waitForElementByXPath("//div[contains(@class,'textRadio nudge-right')]/parent::div//div[contains(@class,'label')]", asserters.isDisplayed, 60000)
            .text().then(function (label) {
                if (label.indexOf(questionPool) > -1) {
                    console.log(report.reportHeader() +
                        report.printTestData("Questions pool label which is:: " + label + " is compared against number of question selected", questionPool, "success") +
                        report.reportFooter());
                    done();
                }
                else {
                    console.log(report.reportHeader() +
                        report.printTestData("Questions pool label which is:: " + label + " is compared against number of question selected", questionPool, "failure") +
                        report.reportFooter());
                    done();
                }
            });
    });

    it("13. Specify the number of questions to be included in the assignment", function (done) {
        browser
            .execute("document.getElementsByClassName('textRadio nudge-right')[0].getElementsByTagName('input')[0].click()")
            .then(function () {
                assessmentsPage.enterQuestionsPerStudent(browser, assessmentData.systemgenerated.iwillchoose.questions).then(function () {
                    done();
                });
            });
    });

    it("14. Naviagte to preview tab", function (done) {
        browser
            .waitForElementByXPath("//li[@tab-id='preview']", asserters.isDisplayed, 60000).click()
            .sleep(5000)
            .waitForElementByCss(".cas-task", asserters.isDisplayed, 60000)
            .waitForElementByXPath("//button[contains(.,'Okay')]", asserters.isDisplayed, 60000).click()
            .then(function () {
                console.log(report.reportHeader() +
                    report.printTestData("Question content is appearing successfully", "success") +
                    report.reportFooter());
                done();
            });
    });

    it("15. Navigate Question tab", function (done) {
        browser
            .waitForElementByXPath("//li[contains(.,'Question')]", asserters.isDisplayed, 60000)
            .click()
            .nodeify(done);
    });

    it("16. Save the assessment and verify if its saved successfully", function (done) {
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

    it.skip("17. Delete the created assignment", function (done) {
        assessmentsPage.deleteAssignment(browser, done);
    });

    it("18. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);
    });

    it("19. Login as student", function (done) {
        userType = "student";
        data = loginPage.setLoginData(userType);
        //Reports
        console.log(report.printLoginDetails(data.userId));
        loginPage.loginToApplication(browser, done);
    });


    it("20. Select a Course and launch", function (done) {
        loginPage.launchACourse(userType, courseName, browser, done);
    });


    it("21. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });

    it("22. Click on the current date cell", function (done) {
        browser
            .sleep(3000)
            .elementByCssSelectorWhenReady(".day.ng-scope.today", 5000)
            .click()
            .nodeify(done);
    });


    it("23. Launch the assignment for the first time", function (done) {
      studentAssessmentsPage.launchAssignment(browser,assessmentsPage.getAssignmentName()).then(function(){
        done();
      });
    });



    it("24. Complete the assignment and exit", function (done) {
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


    it("25a. Click on the current date cell", function (done) {
        browser
            .sleep(3000)
            .elementByCssSelectorWhenReady(".day.ng-scope.today", 5000)
            .click()
            .nodeify(done);
    });


    it("25b. Launch the assignment for the second time", function (done) {
      studentAssessmentsPage.launchAssignment(browser,assessmentsPage.getAssignmentName()).then(function(){
        done();
      });
    });

    it("26. Complete the assignment and exit", function (done) {
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

    it("27a. Click on the current date cell", function (done) {
        browser
            .sleep(3000)
            .elementByCssSelectorWhenReady(".day.ng-scope.today", 5000)
            .click()
            .nodeify(done);
    });

    it("27b. Launch the assignment for the third time", function (done) {
      studentAssessmentsPage.launchAssignment(browser,assessmentsPage.getAssignmentName()).then(function(){
        done();
      });
    });


    it("28. Complete the assignment and exit", function (done) {
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

        var averageScore;


        it("29. Drop the lowest score and calculate average",function(done){
          var score1;
          var score2;
          var score3;
          score1= parseInt(questionsCorrect1stattemptFromCAS)*10;
          score2= parseInt(questionsCorrect2ndattemptFromCAS)*10;
          score3= parseInt(questionsCorrect3rdattemptFromCAS)*10;
          console.log("score1::"+score1);
            console.log("score2::"+score2);
              console.log("score3::"+score3);
          var pointScores = [score1, score2, score3];
          var sortedScores = _.sortBy(pointScores);
          var remainingScores = _.rest(sortedScores);
          //alert(remainingScores);
          console.log("remainingScores::"+remainingScores);
          function average (arr)
          {
          	return _.reduce(arr, function(points, num) {
                  return points + num;
              }, 0) / (arr.length === 0 ? 1 : arr.length);
          }
        //  alert( average (remainingScores));
           averageScore= average (remainingScores)
            console.log("Average score is:: "+averageScore);
            done();
        });

        it("30. Navigate to Gradebook page", function (done) {
            this.timeout(120000);
            menuPage.selectGradebook(userType, browser, done);
        });

        it("31. Validate the presence of Class average value on student grade book", function (done) {
            studenGradebookPage.validateAvgScoreOnStudentGradebook(browser, assessmentsPage.getAssignmentName(), averageScore, done);
        });

        it("32. Log out as Student", function (done) {
            userSignOut.userSignOut(browser, done);
        });

        it("33. Login as Instructor", function (done) {
            userType = "instructor";
            data = loginPage.setLoginData(userType);
            //Reports
            console.log(report.printLoginDetails(data.userId));
            loginPage.loginToApplication(browser, done);
        });

        it("34. Select a Product", function (done) {
            brainPage.selectProduct(product, browser, done);
        });

        it("35. Select a Course and launch", function (done) {
            loginPage.launchACourse(userType, courseName, browser, done);
        });

        it("36. Navigate on Gradebook page", function (done) {
            menuPage.selectGradebook(userType, browser, done);
        });

        it("38. Navigate to student's detailed gradebook view", function (done) {
            instructorGradebookNavigationPage.navigateToStudentDetailedPageOnGradebook(browser, loginPage.getUserName()).then(function () {
                done();
            });
        });

        it.skip("39. Validate if the average scores on Student Detailed Gradebook view is same as calculated",function(done){
              instructorGradebookStudentDetailedPage.validatePresenceOfAverageScore(browser, assessmentsPage.getAssignmentName()).then(function(avgScore){
                  //validation has to be done
              });

        });

        it("40. Navigate to Assignments Page", function (done) {
            menuPage.selectAssignments(userType, browser, done);
        });

        it.skip("41. Delete the created assignment", function (done) {
            assessmentsPage.deleteAssignment(browser, done);
        });
});
