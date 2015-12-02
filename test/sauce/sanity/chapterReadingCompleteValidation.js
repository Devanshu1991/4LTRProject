require('colors');

var wd = require('wd');
var asserters = wd.asserters;

var testData = require("../../../test_data/data.json");

var session = require("../support/setup/browser-session");
var loginPage = require("../support/pages/loginpo");
var brainPage = require("../support/pages/brianpo");
var menuPage = require("../support/pages/menupo");
var calendarNavigation = require("../support/pages/assignments/instructor/navigationpo");
var chapterReadingAssignmentPage = require("../support/pages/assignments/instructor/chapterReadingpo");

var userSignOut = require("../support/pages/userSignOut");
var courseHelper = require("../support/helpers/courseHelper");

var report = require("../support/reporting/reportgenerator");
var stringutil = require("../util/stringUtil");
var dataUtil = require("../util/date-utility");


describe('4LTR (' + 'Instructor/Student' + ') :: CHAPTER READING ASSIGNMENT VALIDATION', function () {

    var browser;
    var allPassed = true;
    var userType;
    var courseName;
    var product;
    var productData;


    before(function (done) {

        browser = session.create(done);
        userType = "instructor";
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
        console.log(report.formatTestName("INSTRUCTOR/STUDENT :: READING ASSIGNMENTS SAVE AND DISPLAY ON STUDENT ASSIGNMENT CALENDAR"));
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

        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("4. Navigate to Assignments Page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });


    it("5. Select current date and open Reading Assignments page", function (done) {
        calendarNavigation.selectADateForAssignment(browser)
            .then(function () {
                calendarNavigation.selectChapterReadingAssessment(browser, done);
            });
    });

    it("6. Complete the Reading assignments form", function (done) {
        chapterReadingAssignmentPage.enterName(browser).then(function () {
            chapterReadingAssignmentPage.enterRevealDate(browser).then(function () {
                chapterReadingAssignmentPage.selectAChapter(browser, loginPage.getProductData().chapter.topic.documents.assignments[0].Reading.chapter);
                done();
            });
        });
    });

    it("7. Save the assignment", function (done) {
        chapterReadingAssignmentPage.saveAssignment(browser).then(function () {
            chapterReadingAssignmentPage.checkIfAssignmentSaved(browser).then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("CCS :: Instructor created Reading assignment called :: ", chapterReadingAssignmentPage.getAssignmentName() + " is saved successfully", "success") +
                    report.reportFooter());
                done();
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

    it("13. Verify the chapter reading assignment and its attachment on Student's assignment view'", function (done) {
        browser
            .waitForElementByXPath("//div[@class='details']//div[contains(@class,'title') and contains(.,'" + chapterReadingAssignmentPage.getAssignmentName() + "')]", asserters.isDisplayed, 60000)
            .then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData(" STUDENT ASSIGNMENT :: Chapter reading link  ", productData.chapter.topic.documents.assignments[0].Reading[0].chapter + " is Displayed to Student") +
                    report.reportFooter());
            })
            .waitForElementByXPath("(//a[contains(@class,'assignment-link ng-binding')and contains(.,'" + productData.chapter.topic.documents.assignments[0].Reading[0].topic + "')])[1]", asserters.isDisplayed, 60000)
            .then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData(" STUDENT ASSIGNMENT :: Chapter/Topic reading link  ", productData.chapter.topic.documents.assignments[0].Reading[0].topic + " is Displayed to Student") +
                    report.reportFooter());
            })
            .nodeify(done);
    });

    it("14. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });

    it("15. Login as Instructor", function (done) {

        userType = "instructor";
        data = loginPage.setLoginData(userType);


        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });


    it("16. Select a Course and launch", function (done) {
        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("17. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);

    });

    it("18. Delete the Document and links assignment for cleanup", function (done) {
        chapterReadingAssignmentPage.deleteNonAssessmentAssignment(browser).then(function () {
            console.log(report.reportHeader() +
                report.stepStatusWithData("Instructor created Reading assignment called :: ", chapterReadingAssignmentPage.getAssignmentName() + " is deleted successfully after validation", "success") +
                report.reportFooter());
            done();

        });

        it("19. Log out as Instructor", function (done) {
            userSignOut.userSignOut(browser, done);

        });
    });
});