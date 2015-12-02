require('colors');
var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../test_data/data.json");
var session = require("../support/setup/browser-session");
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/loginpo");
var studyBoardPage = require("../support/pages/studyboardpo");
var tocPage = require("../support/pages/tocpo");
var menuPage = require("../support/pages/menupo");
var studybit = require("../support/pages/studybitpo");
var clearAllSavedContent = require("../support/pages/clearData");
var notesFeature = require("../support/pages/notespo");
var stringutil = require("../util/stringUtil");
var report = require("../support/reporting/reportgenerator");
var userSignOut = require("../support/pages/userSignOut");


describe('NOTES CREATION AND STUDYBOARD VALIDATION', function () {
    var browser;
    var allPassed = true;

    var userType;
    var courseName;


    var keyTermSBValidationStatusOnSBrd = "failure";
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
        console.log(report.formatTestName("4LTR FEATURES :: NOTES CREATION AND VALIDATION"));
        console.log("======================================");
        console.log(report.formatTestData(data.urlForLogin, data.userId, product, courseName));

        console.log(report.printTestData("CHAPTER " + productData.chapter.id + " ", productData.chapter.title));
        console.log(report.printTestData("TOPIC " + productData.chapter.topic.id + " ", productData.chapter.topic.title));

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

    it("3. Navigate to Studyboard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("4. Delete the created notes if any", function (done) {

        clearAllSavedContent.clearStudyboard(browser, done);
    });

    it("5. Navigate to a topic to create note", function (done) {

        tocPage.navigateToToc(browser).then(function () {
            tocPage.navigateToAChapter(productData.chapter.id, browser).then(function () {
                tocPage.navigateToATopic(productData.chapter.id, productData.chapter.topic.id, browser).nodeify(done);

            });
        });
    });

    it("6. Create a note on a topic page", function (done) {
        notesFeature.notesCreation(browser, done, testData.notesTerms.noteText);
    });

    it("7. Create a note on a topic page", function (done) {
        notesFeature.notesCreation(browser, done, testData.notesTerms.noteText2);
    });

    it("8.Verify notes count and navigate to StudyBoard", function (done) {
      notesFeature.verifyNoteCount(browser, testData.notesTerms.notesCount).then(function(){
        studybit.navigateToStudyBoard(browser, done);
      });
    });

    it("9. Verify the presence of notes on the StudyBoard", function (done) {
        notesFeature.verifyNotesAvailabilityOnStudyboard(browser,testData.notesTerms.notesCount).then(function(){
          done();
        })
    });


    it("10. Navigate to a topic to edit one of the created note text", function (done) {

      tocPage.navigateToToc(browser).then(function () {
          tocPage.navigateToAChapter(productData.chapter.id, browser).then(function () {
              tocPage.navigateToATopic(productData.chapter.id, productData.chapter.topic.id, browser).nodeify(done);

          });
      });
    });

    it("11. Edit one of the created note text ", function (done) {
      notesFeature.editNoteText(browser,testData.notesTerms.editedtext,done);
    });

    it("12. Validate the edited note",function(done) {
      notesFeature.validateEditedNote(browser,testData.notesTerms.editedtext,done);
    });

    it("13. Navigate to Studyboard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("14. Verify the presence of note on the StudyBoard", function (done) {
        notesFeature.verifyEditedNoteOnStudyBoard(testData.notesTerms.editedtext, browser, done);
    });

    it("15. Delete the created notes", function (done) {

        clearAllSavedContent.clearStudyboard(browser, done);
    });

    it("16. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });

});
