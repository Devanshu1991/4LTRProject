require('colors');
var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../test_data/data.json");
var session = require("../support/setup/browser-session");
var loginPage = require("../support/pages/loginpo");
var userSignOut = require("../support/pages/userSignOut");
var tocPage = require("../support/pages/tocpo");
var stringutil = require("../util/stringUtil");
var report = require("../support/reporting/reportgenerator");


describe('CAS EXPOSITION ASSIGNMENTS VALIDATION', function () {
    var browser;
    var allPassed = true;

    var userType;
    var courseName;

    var product;

    var data;
    var productData;


    before(function (done) {

        browser = session.create(done);

        userType = "student";

        product = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_PRODUCT.toString());
        if (product === "default") {
            product = testData.existingCourseDetails.product;
        }


        courseName = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_COURSE.toString());
        if (courseName === "default") {

            courseName = testData.existingCourseDetails.coursename;
        }

        data = loginPage.setLoginData(userType);
        productData = loginPage.getProductData();

        //Reports
        console.log(report.formatTestName("CAS EXPOSITION ASSIGNMENTS VALIDATION"));
        console.log(report.formatTestData(data.urlForLogin, data.userId, product, courseName));

    });

    afterEach(function (done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function (done) {
        session.close(allPassed, done);
    });


    it("1. Login to 4LTR platform", function (done) {
        loginPage.loginToApplication(browser, done);

    });

    it("2. Select a Course and launch", function (done) {
        this.timeout(120000);
        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("3. Click on List view", function (done) {
        browser
            .waitForElementByCss(".icon-home-blue", 3000)
            .click()
            .sleep(5000)
            .waitForElementByCss(".icon-list-gray", 3000)
            .click()
            .nodeify(done);
    });

    it("4. Navigate to a Chapter", function (done) {
        var chapternavigation = productData.chapter.topic.casassignments.chapter;
        tocPage.navigateToAChapterByListView(productData.chapter.id, browser, chapternavigation);
        done();
    });

    it("5. Navigate to a topic", function (done) {
        tocPage.navigateToATopicByListView(browser, done, productData.chapter.topic.id, 1);
    });

    it("6. Navigate CAS Assignment and attempt one question", function (done) {
        browser
            .execute("window.scrollTo(0," + productData.chapter.topic.casassignments.scrollY + ")")
            .sleep(5000)
            .waitForElementByXPath("//img[contains(@src,'" + productData.chapter.topic.casassignments.imgsrc + "')]", asserters.isDisplayed, 10000)
            .click()
            .waitForElementByXPath("(//div[@class='cas-hotSpotMatcher-image'])[1]/div[1]/div[1]//img", asserters.isDisplayed, 10000)
            .click()
            .sleep(5000)
            .waitForElementByXPath("(//div[@class='cas-hotSpotMatcher-image'])[1]/div[1]/div[1]//img", asserters.isDisplayed, 10000)
            .getAttribute("src").then(function (val) {
                if (val.indexOf(productData.chapter.topic.casassignments.imgsrc) > -1)
                    browser
                        .waitForElementByXPath("(//button[contains(@class,'btn btn-default cas-activity-action')])[1]", asserters.isDisplayed, 10000)
                        .click()
                        .nodeify(done);
            });

    });

    it("7. Verify the Solution is displayed", function (done) {
        browser
            .sleep(5000)
            .waitForElementByCss(".cas-correct-solution", asserters.isDisplayed, 5000)
            .waitForElementByXPath("//div[@class='cas-correct-solution']//div[@class='cas-hotSpotMatcher-image']//img[contains(@src,'" + productData.chapter.topic.casassignments.imgsrc + "')]", asserters.isDisplayed, 5000)
            .then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("Selected term appears in the solution panel after submitting it", "success") +
                    report.reportFooter());
                done();

            });
    });


});
 
  










