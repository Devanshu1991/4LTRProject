require('colors');

var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/loginpo");
var menuPage = require("../support/pages/menupo");
var calendarNavigation = require("../support/pages/assignments/instructor/navigationpo");
var assessmentsPage = require("../support/pages/assignments/instructor/assessmentspo");
var assessmentData = require("../../../test_data/assignments/assessments.json");
var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData = require("../../../test_data/qa.json");

var testData = require("../../../test_data/data.json");
var clearAllSavedContent = require("../support/pages/clearData");


var courseHelper = require("../support/helpers/courseHelper");

var report = require("../support/reporting/reportgenerator");
var stringutil = require("../util/stringUtil");

var asserters = wd.asserters;

describe('4LTR (' + 'Instructor' + ') :: ****** Tests for => Course Creation :: Course Aggregation :: Assignment Creation :: Gradebook Creation *******', function () {
    var browser;
    var allPassed = true;
    var userType;
    var setDate;

    var courseName;
    var coursekey = "Empty";
    var coursekeystatus = "failure";
    var courseCGI = "undefined";
    var aggregationCompletionTime = "Never Completed or took more time than expected";
    var aggregationStatus = "failure";
    var courseCreationStatus = "failure";
    var assignmentCreationStatus = "failure";

    var product;


    before(function (done) {
        browser = session.create(done);
        setDate = testData.courseAccessInformation.DateBeforeToday;
        newCourseData = testData.instructorResourceCenter;

        userType = "instructor";

        product = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_PRODUCT.toString()) || testData.existingCourseDetails.product;

        if (product === "default") {
            product = testData.existingCourseDetails.product;
        }


        courseName = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_COURSE.toString()) || testData.existingCourseDetails.coursename;

        if (courseName === "default") {

            courseName = product + " " + courseHelper.getUniqueCourseName();
        }

        data = loginPage.setLoginData(userType);


        //Reports
        console.log(report.formatTestName("TEST :: CENGAGE COURSE CREATION AND ASSIGNMENT CREATION"));
        console.log(report.formatTestData(data.urlForLogin, data.userId, product, courseName));

    });

    afterEach(function (done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function (done) {

        console.log(report.reportHeader() +
            report.stepStatusWithData("CourseCGI and AssessmentCGI Generation, MAX Timeout set as ", dataUtil.millisecondsToStr(courseHelper.getCourseTimeOut())) +
            report.stepStatusWithData("Course Aggregation MAX Timeout set as ", dataUtil.millisecondsToStr(courseHelper.getCourseAggregationTimeOut())) +
            report.stepStatusWithData("Course Key Generated ", coursekey, coursekeystatus) +
            report.stepStatusWithData("Course CGI Generated ", courseCGI, courseCreationStatus) +
            report.stepStatus("Aggregation Status ", aggregationStatus) +
            report.stepStatusWithData("Aggregation process took ", aggregationCompletionTime, aggregationStatus) +
            report.stepStatus("Assignment Creation Status ", assignmentCreationStatus) +
            report.reportFooter());

        session.close(allPassed, done);
    });


    it("1. Log in to 4LTR Platform", function (done) {
        loginPage.loginToApplication(browser, done);

    });

    it("2. Select a Product", function (done) {

        if (product === "MKTG9") {
            browser
                .sleep(1000)
                .elementByCssSelectorWhenReady("#productISBN option:nth-child(1)", 20000)
                .click()
                .nodeify(done);
        }
        else {
            browser
                .sleep(1000)
                .elementByCssSelectorWhenReady("#productISBN option:nth-child(2)", 20000)
                .click()
                .nodeify(done);

        }
    });


    it("3. Click on create course link", function (done) {
        browser
            .elementByCssSelectorWhenReady(".courseManage>a:first-child", 3000)
            .click()
            .nodeify(done);
    });


    it("4. Verify page navigation by validating the question label within create course page", function (done) {
        browser
            .elementByCssSelectorWhenReady("#columnMain>h3", 3000)
            .text()
            .should.eventually.include(newCourseData.createCourseQuestionLabel)
            .nodeify(done);
    });

    it("5. Select radio button to create a new course and click on continue button", function (done) {
        browser
            .elementByCssSelectorWhenReady("#createNewCourse", 3000)
            .click()
            .sleep(3000)
            .elementByXPathSelectorWhenReady("//a[contains(text(),'Continue')]", 3000)
            .click()
            .nodeify(done);
    });

    it("6. Verify navigation to course information page by validating course information label", function (done) {
        browser
            .elementByCssSelectorWhenReady(".courseInfoHeader", 3000)
            .text()
            .should.eventually.include(newCourseData.courseInformationLabel)
            .nodeify(done);
    });

    it("7. Fill in the new Course name", function (done) {
        browser
            .elementByCssSelectorWhenReady("#courseName", 3000)
            .click()
            .type(courseName)
            .nodeify(done);
    });

    it("8. Fill in the start date", function (done) {
        browser
            .elementByCssSelectorWhenReady("#calendar1", 3000)
            .click()
            .sleep(3000)
            //setting today's date
            .elementByCssSelectorWhenReady(".ui-state-focus.ui-state-active", 3000)
            .click()
            .nodeify(done);
    });

    it("9. Re- Edit the date, 10 days before from today's date ", function (done) {
        browser
            .elementByCssSelectorWhenReady("#endDate", 3000)
            .clear()
            .sleep(3000)
            .elementByCssSelectorWhenReady("#endDate", 3000)
            .type(dataUtil.getSpecificDateAfterCurrentDate(setDate))
            .elementByCssSelectorWhenReady("#timeZone option:nth-child(12)")
            .click()
            .nodeify(done);
    });

    it("10. Save the course details", function (done) {
        browser
            .sleep(3000)
            .execute("window.scrollTo(1000,1000)")
            .elementByCssSelectorWhenReady(".button", 2000)
            .click()
            .nodeify(done);
    });

    it("11. Copy Course key", function (done) {
        browser
            .elementByXPathSelectorWhenReady("//p[@class='distributionOptions']//a[@target='_blank']")
            .isDisplayed()
            .should.become(true)
            .execute("return document.getElementsByClassName('distributionOptions')[0].getElementsByTagName('a')[0].text.split('course/')[1]").then(function (ckey) {
                coursekey = ckey;
                if (coursekey !== "undefined") {
                    coursekeystatus = "success";
                }
                browser
                    .sleep(1000)
                    .nodeify(done);
            });

    });


    it("12. Click on course link", function (done) {

        this.timeout(courseHelper.getCourseAggregationTimeOut());
        browser.sleep(courseHelper.getCourseTimeOut())
            .execute("var x = document.evaluate(\"(//div[contains(@class,'stepContent')]//a)[1]\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;x.setAttribute('target','');")
            .elementByXPathSelectorWhenReady("(//div[contains(@class,'stepContent')]//a)[1]", 40000)
            .click()
            .sleep(5000)

            .nodeify(done);

    });


    it("13. Copy Course key", function (done) {
        browser
            .execute("return window.location.href;").then(function (cgi) {
                courseCGI = cgi.split('products/')[1];
                if (courseCGI !== "undefined") {
                    courseCreationStatus = "success";
                }
                browser
                    .sleep(1000)
                    .nodeify(done);
            });

    });

    it("14. Wait and launch the course and refresh the page till the aggregation is completed ", function (done) {
        this.timeout(courseHelper.getCourseAggregationTimeOut());

        if (courseCreationStatus !== "failure") {
            browser.execute("window.location.reload();")
                .then(
                function () {
                    poll(
                        function () {
                            //console.log("=================== Inside function in Course Aggregation ======================");
                            return browser.elementByCssSelectorWhenReady("button.welcome-button", 3000).isDisplayed(function (err, flag) {

                                //console.log("=================== Welcome modal ======================" + flag);
                                var foundFlag = false;

                                if (flag) {

                                    foundFlag = true;
                                }

                                //console.log("=================== Outside ======================" + flag);
                                return foundFlag;
                            });


                        },
                        function () {
                            console.log("=================== Course Aggregation completed ======================");
                            aggregationStatus = "success";
                            done();

                        },
                        function () {
                            // Error, failure callback
                            console.log("=================== Failure in Course Aggregation ======================");

                        }, courseHelper.getCourseAggregationTimeOut(), 10000
                    );
                }
            );
        } else {
            browser
                .elementByCssSelectorWhenReady(".dropdown-link>.user-name.ng-binding", 20000)
                .click()
                .sleep(5000)
                .elementByXPathSelectorWhenReady("//a[contains(text(),'Sign Out')]", 3000)
                .click()
                .nodeify(done);
        }

    });

    it("15. Handle EULA", function (done) {
        if (courseCreationStatus !== "failure") {
            browser
                .elementByCssSelectorWhenReady(".read-terms-start-modal.ng-scope", 2000)
                .isDisplayed()
                .should.become(true)
                .elementByCssSelectorWhenReady("button[class='welcome-button']", 3000)
                .click()
                .elementByCssSelectorWhenReady(".welcome-accept-terms.ng-scope", 3000)
                .click()
                .sleep(1000)
                .elementByCssSelectorWhenReady("button[class='welcome-button']", 3000)
                .click()
                .sleep(1000)
                .elementByCssSelectorWhenReady(".welcome-modal.ng-scope>button", 3000)
                .click()
                .nodeify(done);
        } else {
            done();
        }
    });

    it("16. Click on manage my course", function (done) {
        browser
            .sleep(3000)
            .elementByCssSelectorWhenReady(".manage-dropdown>.dropdown>.dropdown-link.ng-binding", 10000)
            .click()
            .nodeify(done);
    });


    it("17. Click on assignment and verify the calendar display and close the first visit message", function (done) {
        browser
            .waitForElementByXPath("//span[contains(.,'ASSIGNMENTS')]", asserters.isDisplayed, 60000)
            .click()
            .execute("window.scrollTo(0, 300)")
            .sleep(3000)
            .waitForElementByCss("a.icon-close-x", asserters.isDisplayed, 60000)
            .click()
            .waitForElementByXPath("(//div[contains(@class,'cg-calendar ng-isolate-scope')])[1]", asserters.isDisplayed, 60000)
            .nodeify(done);

    });


    it("18. Select current date and open the Assessment Type assignment settings page", function (done) {
        calendarNavigation.selectADateForAssignment(browser).then(function () {
            calendarNavigation.selectAssessmentTypeAssignment(browser, done);
        });
    });

    it("19. Complete the Assessment form for system created assignment", function (done) {
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


    it("20. Save the assessment and verify if its saved successfully", function (done) {
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


    it("21. Log out as Instructor", function (done) {
        browser
            .elementByCssSelectorWhenReady(".dropdown-link>.user-name.ng-binding", 20000)
            .click()
            .sleep(5000)
            .elementByXPathSelectorWhenReady("//a[contains(text(),'Sign Out')]", 3000)
            .click()
            .sleep(10000)
            .nodeify(done);

    });


    it("22. Log in as Instructor again", function (done) {
        loginPage.loginToApplication(browser, done);

    });


    it("23. Click on manage my course", function (done) {
        browser
            .elementByCssSelectorWhenReady(".courseManage>a:nth-child(2)", 5000)
            .click()
            .nodeify(done);
    });

    it("24. Select the newly created course and delete it as part of cleanup", function (done) {

        if (courseCreationStatus !== "success") {
            done();
        } else {
            browser
                .sleep(5000)
                .execute("window.oldConfirm = window.confirm; window.confirm = function() { return true; };")
                .elementByXPathSelectorWhenReady("//td[contains(.,'" + courseName + "')]/following-sibling::td/a[contains(@title,'Delete Course')]", 3000)
                .click()
                .sleep(1000)
                .nodeify(done);
        }

    });


    function poll(fn, callback, errback, timeout, interval) {
        var endTime = Number(new Date()) + (timeout || 60000);
        interval = interval || 5000;
        aggregationTime = 0;


        console.log("#### Maximum polling time set for Course Aggregation :: " + dataUtil.millisecondsToStr(timeout));

        (function p() {

            fn().then(function (foundFlag) {
                // If the condition is met, we're done!

                if (foundFlag) {
                    console.log("### Aggregation completed in :: " + dataUtil.millisecondsToStr(aggregationTime));
                    aggregationCompletionTime = dataUtil.millisecondsToStr(aggregationTime);
                    callback();

                }
                // If the condition isn't met but the timeout hasn't elapsed, go again
                else if (Number(new Date()) < endTime) {

                    aggregationTime = aggregationTime + interval;

                    console.log(" Time taken for aggregation " + dataUtil.millisecondsToStr(aggregationTime));

                    setTimeout(p, interval);

                    browser.execute("window.location.reload();");

                }
                // Didn't match and too much time, reject!
                else {
                    console.log(" No match");
                    errback(new Error('timed out for ' + fn + ': ' + arguments));
                }

            });


        })();
    }


});
