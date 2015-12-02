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


var tocPage = require("../support/pages/tocpo");

var report = require("../support/reporting/reportgenerator");
var stringutil = require("../util/stringUtil");

var asserters = wd.asserters;


describe('CREATE A STUDENT ON ANY ENVIRONMENT AND REGISTER A COURSE', function () {
    var browser;
    var allPassed = true;
    var productData;


    before(function (done) {
        browser = session.create(done);
        productData = loginPage.getProductData();
        console.log(report.formatTestName("TEST :: CREATE A STUDENT ON ANY ENVIRONMENT AND REGISTER A COURSE"));


    });

    afterEach(function (done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function (done) {


        session.close(allPassed, done);
    });


    it("Create a 4LTR Student", function (done) {
        if (stringutil.removeBoundaryQuotes(process.env.CREATE_STUDENT.toString()) == "yes") {
            studentId = loginPage.generateStudentId();
            //console.log("Student id " + studentId);
            loginPage.setLoginData("student");

            loginPage.generateStudentAccount(browser, studentId).then(function () {
                process.env.RUN_FOR_STUDENT_USERID = "\"" + studentId + "\"";
                //console.log("Student id after student generation : " + process.env.RUN_FOR_STUDENT_USERID.toString());
                data = loginPage.setLoginData("student");
                //console.log("Student id from loginpo : " + data.userId);


                console.log(report.formatTestName("NEW STUDENT DETAILS"));
                console.log(report.printTestData("STUDENT LOGINID ", data.userId));


                done();
            });
        } else {
            done();
            console.log("No Student Created")
        }
    });

    it("1. Login as student", function (done) {
        data = loginPage.setLoginData("student");
        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });


    it("Register the Product", function (done) {
        if (stringutil.removeBoundaryQuotes(process.env.REGISTER_COURSE.toString()) == "yes") {

            browser
                .waitForElementById("registerAccessCode", asserters.isDisplayed, 60000).elementById("registerAccessCode")
                .type(stringutil.removeBoundaryQuotes(process.env.RUN_FOR_COURSEKEY.toString()))
                .waitForElementByCss("a.viewDetailsBtn.register_button", asserters.isDisplayed, 60000).elementByCss("a.viewDetailsBtn.register_button")
                .click()
                .waitForElementByCss("#apliaContinueForm a.small_green_button", asserters.isDisplayed, 60000).elementByCss("#apliaContinueForm a.small_green_button")
                .click()
                .then(function () {
                    console.log(report.printTestData("COURSEKEY REGISTERED ", stringutil.removeBoundaryQuotes(process.env.RUN_FOR_COURSEKEY.toString())));
                    done();
                })

        } else {
            done();
            console.log("No course registered for student")
        }

    });

    it("2. Launch the Product", function (done) {

        browser
            .waitForElementByXPath("//span[contains(text(),'" + stringutil.removeBoundaryQuotes(process.env.RUN_FOR_COURSE.toString()) + "')]/..//following-sibling::li/a[contains(text(),'Open')]", asserters.isDisplayed, 60000)
            .click()
            .sleep(1000)
            .nodeify(done);

    });


    it("3. Take the user to the course in grace period", function (done) {

        browser.windowHandle()
            .then(
            function (handle) {
                browser
                    .waitForElementByCss(".gracePeriodBtn", asserters.isDisplayed, 60000)
                    .click()
                    .windowHandles().should.eventually.have.length(2)
                    .window("childWindow")
                    .sleep(10000)
                    .nodeify(done);
            }
        )


    });


    it("Handle EULA", function (done) {


        browser
            .elementByCssSelectorWhenReady(".read-terms-start-modal.ng-scope", 2000)
            .isDisplayed()
            .then(function (isDisplayed) {
                if (isDisplayed) {
                    browser.
                        elementByCssSelectorWhenReady("button[class='welcome-button']", 3000)
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
                }
                else {
                    console.log("No Welcome model to dispose");
                    done();
                }
            });

    });

    it("2c. Navigate to TOC ", function (done) {

        tocPage.navigateToToc(browser).nodeify(done);
    });

    it("3. Navigate to a Chapter", function (done) {

        tocPage.getChapterTitle(productData.chapter.id, browser)
            .then(function (text) {
                text.should.contain(productData.chapter.title);
            })
            .then(function () {
                tocPage.navigateToAChapter(productData.chapter.id, browser)
                    .nodeify(done);
            });
    });

    it("4. Navigate to a topic", function (done) {

        tocPage.navigateToATopic(productData.chapter.id, productData.chapter.topic.id, browser)
            .then(function () {
                tocPage.disposeFirstVisitTopicModalIfVisible(browser).then(function () {
                    tocPage.getTopicTitleHero(browser).then(function (text) {
                        text.should.contain(productData.chapter.topic.titlehero)
                    }).nodeify(done);
                });

            });


    });

    it("5. Log out as Student", function (done) {
        userAccountAction.userSignOut(browser, done);
    });

});