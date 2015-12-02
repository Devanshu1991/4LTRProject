require('colors');

var wd = require('wd');
var Q = wd.Q;

var stringutil = require("../util/stringUtil");
var loginPage = require("../support/pages/loginpo");
var brainPage = require("../support/pages/brianpo");
var menuPage = require("../support/pages/menupo");

var calendarNavigation = require("../support/pages/assignments/instructor/navigationpo");
var assessmentsPage = require("../support/pages/assignments/instructor/assessmentspo");
var chapterReadingAssignmentPage = require("../support/pages/assignments/instructor/chapterReadingpo");

var userSignOut = require("../support/pages/userSignOut");

var chapterReadingAssignmentData = require("../../../test_data/assignments/chapterReading.json");

var userAccountAction = require("../support/pages/userSignOut");
var session = require("../support/setup/browser-session");

var testData = require("../../../test_data/data.json");

var courseHelper = require("../support/helpers/courseHelper");

var report = require("../support/reporting/reportgenerator");


var asserters = wd.asserters;

describe('4LTR (' + 'Instructor/Student' + ') :: ****** Tests for => Assignment Creation :: Student Submission *******', function () {
    var browser;
    var allPassed = true;
    var userType;
    var setDate;

    var courseName;

    var assignmentCreationStatus = "failure";
    var product;
    var assignmentDueDateBeforeDrag;
    var assignmentDueDateAfterDrag;

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

    it("5. Navigate to the next month", function (done) {
        calendarNavigation.navigateToNextMonth(browser).then(function () {
            done();
        });
    });

    it("6. Click on '+' button of first date of next month", function (done) {
        calendarNavigation.selectFirstDateFormNextMonth(browser).then(function () {
            done();
        });
    });

    it("7. Create Chapter Reading type assignment", function (done) {
        calendarNavigation.selectChapterReadingAssessment(browser, done);
    });

    it("8. Complete the Reading assignments form", function (done) {
        chapterReadingAssignmentPage.enterName(browser).then(function () {
            assessmentsPage.enterRevealDateNextMonth(browser).then(function () {
                chapterReadingAssignmentPage.selectAChapter(browser, loginPage.getProductData().chapter.topic.documents.assignments[0].Reading.chapter);
                done();
            });
        });
    });

    it("9. Fetch the due date of the assessment before Drag", function (done) {
        browser
            .waitForElementByXPath("//cg-date-picker[contains(.,'Due Date')]//div[contains(@class,'datefield')]", asserters.isDisplayed, 10000).text()
            .then(function (dueDateBeforeDrag) {
                assignmentDueDateBeforeDrag = dueDateBeforeDrag;
                console.log(report.reportHeader() +
                    report.stepStatusWithData("Due date for created chapter reading assignment before Drag :: ", assignmentDueDateBeforeDrag, "success") +
                    report.reportFooter());
                done();
            });
    });


    it("10. Save the assignment", function (done) {
        chapterReadingAssignmentPage.saveAssignment(browser).then(function () {
            chapterReadingAssignmentPage.checkIfAssignmentSavedOnFuture(browser).then(function (value) {
                if (value.toString() === "rgb(255, 219, 238)") {

                    assignmentCreationStatus = "success";
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Instructor created an Chapter Reading type assignment called :: ", chapterReadingAssignmentPage.getAssignmentName(), "success") +
                        report.reportFooter());
                    done();
                } else {
                    assignmentCreationStatus = "failure";
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Instructor created an Chapter Reading type assignment called :: ", chapterReadingAssignmentPage.getAssignmentName() + " is not created successfully", "failure") +
                        report.reportFooter());
                    done();

                }
            });
        });
    });

    it("11. Drag the assignment to the next date", function (done) {
        Q.all([
            browser.waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='" + chapterReadingAssignmentData.dragndrop.fromDate + "')]//following-sibling::div[contains(@class,'event')]", asserters.isDisplayed, 10000),
            browser.waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='" + chapterReadingAssignmentData.dragndrop.toDate + "')]/parent::div", asserters.isDisplayed, 10000)
        ]).then(function (els) {
            browser
                .moveTo(els[0])
                .buttonDown()
                .moveTo(els[1])
                .buttonUp();
            done();
        });
    });

    it("12. Reopen the dragged assignment to next Date", function (done) {
        browser
            .waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='" + chapterReadingAssignmentData.dragndrop.toDate + "')]//following-sibling::div[contains(@class,'event')]", asserters.isDisplayed, 10000)
            .click().then(function () {
                browser
                    .waitForElementByXPath("//cg-date-picker[contains(.,'Due Date')]//div[contains(@class,'datefield')]", asserters.isDisplayed, 10000).text()
                    .then(function (dueDateAfterDrag) {
                        assignmentDueDateAfterDrag = dueDateAfterDrag;
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("Due date for created chapter reading assignment after Drag & Drop :: ", assignmentDueDateAfterDrag, "success") +
                            report.reportFooter());
                        done();
                    });
            });
    });

    it("13. Validate due date of assignment before dragging and after dragging", function (done) {
        var beforeDateSplit;
        var afterDragDateSplit;
        beforeDateSplit = parseInt(stringutil.returnValueAfterSplit(assignmentDueDateBeforeDrag, " ", 1));
        afterDragDateSplit = beforeDateSplit + 1;
        if (afterDragDateSplit.toString() === chapterReadingAssignmentData.dragndrop.toDate) {
            console.log(report.reportHeader() +
                report.stepStatusWithData("Due date for created chapter reading assignment before Drag & Drop ", assignmentDueDateBeforeDrag, " is now :: ", assignmentDueDateAfterDrag, " after successfully dragging the assignment to the next date", "success") +
                report.reportFooter());
            done();
        }
        else {
            console.log(report.reportHeader() +
                report.stepStatusWithData("Due date for created chapter reading assignment before Drag & Drop ", assignmentDueDateBeforeDrag, " is now :: ", assignmentDueDateAfterDrag, " after an unsuccessful attempt to drag the assignment to the next date", "failure") +
                report.reportFooter());
            done();
        }
    });

    it("14. Delete the created assignment", function (done) {
        assessmentsPage.deleteAssignment(browser, done);
    });

});
