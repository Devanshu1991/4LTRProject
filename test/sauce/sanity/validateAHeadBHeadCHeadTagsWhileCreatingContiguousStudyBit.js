require('colors');
var wd = require('wd');
var _ = require('underscore');
var asserters = wd.asserters;
var testData = require("../../../test_data/data.json");
var session = require("../support/setup/browser-session");
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/loginpo");
var studyBoardPage = require("../support/pages/studyboardpo");
var tocPage = require("../support/pages/tocpo");
var menuPage = require("../support/pages/menupo");
var studybit = require("../support/pages/studybitpo");
var contentBaseFeature = require("../support/pages/conceptTrackerpo.js");
var clearAllSavedContent = require("../support/pages/clearData");

var flashcardPage = require("../support/pages/flashcardspo.js");
var notesCreation = require("../support/pages/notespo");

var stringutil = require("../util/stringUtil");
var report = require("../support/reporting/reportgenerator");


describe('STUDYBIT:: VALIDATE A HEAD B HEAD C HEAD PUBLISHER TAGS FOR STUDYBITS', function () {
    var browser;
    var allPassed = true;

    var userType;
    var courseName;


    var keyTermSBValidationStatusOnSBrd = "failure";


    var flashCardValidationStatus = "failure";

    var notesValidation = "failure";

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
        console.log(report.formatTestName("4LTR STUDYBIT:: , VALIDATE A HEAD B HEAD C HEAD PUBLISHER TAG"));
        console.log("======================================");
        console.log(report.formatTestData(data.urlForLogin, data.userId, product, courseName));

        console.log(report.printTestData("CHAPTER " + productData.chapter.id + " ", productData.chapter.title));
        console.log(report.printTestData("TOPIC " + productData.chapter.topic.id + " ", productData.chapter.topic.title));
        console.log(report.printTestData("STUDYBITID", productData.chapter.topic.studybit.text.id));
        console.log(report.printTestData("STUDYBIT CONCEPT", productData.chapter.topic.studybit.text.concepts[0]));

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

    it("2a. Navigate to Studyboard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("2b. Delete the created studybits if any", function (done) {

        clearAllSavedContent.clearStudyboard(browser, done);
    });

    it("2c. Navigate to TOC ", function (done) {
        tocPage.navigateToToc(browser).nodeify(done);
    });

    it("3. Click on List view", function (done) {
        tocPage.selectListView(browser).then(function(){
          done();
        });
    });

    it("4. Navigate to a Chapter", function (done) {
        tocPage.getChapterTitleonListView(productData.chapter.id, browser, productData.chapter.topic.studybit.contiguousStudybit.chapter)
            .then(function (text) {
                tocPage.navigateToAChapterByListView(productData.chapter.id, browser, productData.chapter.topic.studybit.contiguousStudybit.chapter);
                done();
            });
    });

    it("5. Navigate to a topic", function (done) {
        tocPage.navigateToATopicByListView(browser, done, productData.chapter.topic.id, productData.chapter.topic.studybit.contiguousStudybit.topic);
    });

    it("6. Select A head text for studybit and validate the increased tag count", function (done) {
        studybit.selectTextFromAHead(browser,productData.chapter.topic.studybit.contiguousStudybit.studybitId,
                                             productData.chapter.topic.studybit.contiguousStudybit.windowScrollY).then(function(){
                                               studybit.fetchTheNumberOfPublisherTag(browser,"A").then(function(){
                                                 done();
                                               });
                                             });
    });

    it("7. Select B head text for studybit and validate the increased tag count", function (done) {
        studybit.selectTextFromAHead(browser,productData.chapter.topic.studybit.contiguousStudybit.studybitIdForBHead,
                                             productData.chapter.topic.studybit.contiguousStudybit.windowScrollYForBHead)
                                             .then(function(){
                                               studybit.fetchTheNumberOfPublisherTag(browser,"B").then(function(){
                                                 done();
                                               });
                                             });
    });

    it("8. Select C head text for studybit and validate the increased tag count", function (done) {
        studybit.selectTextFromAHead(browser,productData.chapter.topic.studybit.contiguousStudybit.studybitIdForCHead,
                                             productData.chapter.topic.studybit.contiguousStudybit.windowScrollYForCHead).then(function(){
                                               studybit.fetchTheNumberOfPublisherTag(browser,"C").then(function(){
                                                 done();
                                               });
                                            });
    });

});
