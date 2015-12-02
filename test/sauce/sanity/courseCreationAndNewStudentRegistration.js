require('colors');

var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/loginpo");
var userAccountAction = require("../support/pages/userSignOut");
var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData = require("../../../test_data/qa.json");

var testData = require("../../../test_data/data.json");
var clearAllSavedContent = require("../support/pages/clearData");


var courseHelper = require("../support/helpers/courseHelper");

var report = require("../support/reporting/reportgenerator");
var stringutil = require("../util/stringUtil");

var asserters = wd.asserters;
var mathutil = require("../util/mathUtil");
var request = require('supertest');

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

        userType = "custom";

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


        session.close(allPassed, done);
    });


    it("1. Create a 4LTR Student", function (done) {
        //studentId = loginPage.generateStudentId();
        //loginPage.generateStudentAccount(browser,studentId).nodeify(done);
    });


    it.skip("2. Launch the Product", function (done) {

        browser
            .waitForElementByXPath("//span[contains(text(),'Catas')]/..//following-sibling::li/a[contains(text(),'Open')]", asserters.isDisplayed, 60000)
            .click()
            .sleep(1000)
            .nodeify(done);

    });

    it.skip("3. Take the user to the course in grace period", function (done) {

        browser.windowHandle()
            .then(
            function (handle) {
                var oldhandle = handle;
                browser
                    .waitForElementByCss(".gracePeriodBtn", asserters.isDisplayed, 60000)
                    .click()
                    .windowHandles().should.eventually.have.length(2)
                    .window("childWindow").close()
                    .sleep(1000)
                    .window(oldhandle)
                    .waitForElementByXPath("//span[contains(text(),'Catas')]/..//following-sibling::li/a[contains(text(),'Open')]", asserters.isDisplayed, 60000)
                    .click()
                    .waitForElementByCss(".gracePeriodBtn", asserters.isDisplayed, 60000)
                    .click()
                    .window("childWindow")
                    .sleep(1000)
                    .nodeify(done);
            }
        )


    });


});