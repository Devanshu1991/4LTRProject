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
var stringutil = require("../util/stringUtil");
var report = require("../support/reporting/reportgenerator");
var userSignOut = require("../support/pages/userSignOut");


describe('STUDYBIT CREATION AND STUDYBOARD VALIDATION', function () {
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

    it("3. Navigate to Studyboard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("4. Delete the created studybits if any", function (done) {

        clearAllSavedContent.clearStudyboard(browser, done);
    });

    it("5. Navigate to TOC ", function (done) {

        tocPage.navigateToToc(browser).nodeify(done);
    });

    it("6. Navigate to a Chapter", function (done) {

        tocPage.getChapterTitle(productData.chapter.id, browser)
            .then(function (text) {
                text.should.contain(productData.chapter.title);
            })
            .then(function () {
                tocPage.navigateToAChapter(productData.chapter.id, browser)
                    .nodeify(done);
            });
    });

    it("7. Navigate to a topic", function (done) {

        tocPage.navigateToATopic(productData.chapter.id, productData.chapter.topic.id, browser)
            .then(function () {
                tocPage.disposeFirstVisitTopicModalIfVisible(browser).then(function () {
                    tocPage.getTopicTitleHero(browser).then(function (text) {
                        text.should.contain(productData.chapter.topic.titlehero);
                    }).nodeify(done);
                });

            });


    });

    it("8. Create a Text StudyBit", function (done) {
        studybit.createTextStudyBit(browser, done, productData.chapter.topic.studybit.text.id,
            productData.chapter.topic.studybit.text.concepts[0],
            productData.chapter.topic.studybit.text.usertag,
            productData.chapter.topic.studybit.text.notes,
            productData.chapter.topic.studybit.text.comprehension,
            productData.chapter.topic.studybit.text.windowScrollY);
    });

    it("9. Create a KeyTerm StudyBit", function (done) {
        this.timeout(130000);
        studybit.createKeyTermStudyBit(browser, done,
            productData.chapter.topic.studybit.keyterm.id,
            productData.chapter.topic.studybit.keyterm.definition,
            productData.chapter.topic.studybit.keyterm.comprehension,
            productData.chapter.topic.studybit.keyterm.publishertag,
            productData.chapter.topic.studybit.keyterm.notes,
            productData.chapter.topic.studybit.keyterm.usertag,
            productData.chapter.topic.studybit.keyterm.windowScrollY);
    });

    it("10. Navigate To StudyBoard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });


    it("11. Verify the presence of text StudyBit on StudyBoard ", function (done) {
        studybit.validateTextStudyBitOnStudyBoard(browser, done,
            productData.chapter.topic.studybit.text.chaptername,
            productData.chapter.topic.studybit.text.notes,
            productData.chapter.topic.studybit.text.concepts[0],
            productData.chapter.topic.studybit.text.usertag);
    });

    it("12. Change the comprehension lavel",function(done){
      studybit.changeComprehensionOfStudybit(browser,testData.studybitTerms.comprehension).then(function(){
        studybit.clickOnSaveButton(browser).then(function(){
          studybit.closeExpandedStudybit(browser).then(function(){
            done();
          });
        });
      })
    });

    it("13. Validate the changed comprehension lavel of text Studybit",function(done){
      studybit.validateEditedTextStudybit(browser,testData.studybitTerms.comprehension).then(function(){
        studybit.closeExpandedStudybit(browser).then(function(){
          done();
        });
      });
    });

    it("14. Verify the presence of keyterm StudyBit on StudyBoard ",function (done) {
        studybit.VerifyKeytermStudybit(browser, keyTermSBValidationStatusOnSBrd).then(function(){
          studybit.editUserTagOfKeytermStudybit(browser, testData.studybitTerms.editedUserTagText).then(function(){
            studybit.clickOnSaveButton(browser).then(function(){
              studybit.closeExpandedStudybit(browser).then(function(){
                done();
              });
            });
          });
        });
    });

    it("15. Verify Edited user tag of keyterm Studybit", function(done){
      studybit.verifyEditedUserTagOfKeytermStudybit(browser, testData.studybitTerms.editedUserTagText).then(function(){
        studybit.closeExpandedStudybit(browser).then(function(){
          done();
        });
      });
    });

    it("16. Filter StudyBit by user tag and type then verify the result", function(done){
      studyBoardPage.clickAndVerifyFilerPanel(browser).then(function(){
        studyBoardPage.enterTagValueOnFilterPanel(browser, testData.studybitTerms.editedUserTagText).then(function(){
          studyBoardPage.clickOnClearFilterThenSelectOne(browser,"type","Key Term").then(function(){
            studybit.verifyFilteredStudybit(browser,".studybit.keyterm").then(function(textOfKeyTermStudybit){
              console.log(report.reportHeader()
                  + report.stepStatusWithData("Filtered key term studybit is present and their text is",textOfKeyTermStudybit,"success")
                  + report.reportFooter());
                  done();
            });
          });
        });
      });
    });

    it("17. Select all filter Filter text studybit and comprehension lavel and verify the filter result",function(done){
      studyBoardPage.selectAllFilters(browser).then(function(){
          studyBoardPage.clickOnClearFilterThenSelectOne(browser,"type","Text").then(function(){
            studyBoardPage.clickOnClearFilterThenSelectOne(browser,"comprehension","Weak").then(function(){
              studyBoardPage.deleteUserTagFromFilter(browser).then(function(){
                studybit.verifyFilteredStudybit(browser,".studybit.text").then(function(textOfKeyTermStudybit){
                  console.log(report.reportHeader()
                      + report.stepStatusWithData("Filtered text studybit is present and their text is",textOfKeyTermStudybit,"success")
                      + report.reportFooter());
                      done();
                });
              });
            });
          });
      });
    });
    it("18. Delete user tag of key term studybit", function(done){
      studybit.refreshFunction(browser).then(function(){
        studybit.openKeyTermStudybit(browser).then(function(){
          studybit.clickOnTag(browser).then(function(){
            studybit.deleteUserTag(browser).then(function(){
              studybit.clickOnSaveButton(browser).then(function(){
                studybit.closeExpandedStudybit(browser).then(function(){
                  done();
                });
              });
            });
          });
        });
      });
    });

    it("19. Reopen the key term studybit and verify user tag is deleted",function(done){
      studybit.refreshFunction(browser).then(function(){
        studybit.openKeyTermStudybit(browser).then(function(){
          studybit.clickOnTag(browser).then(function(){
            studybit.verifyTagDeleted(browser).then(function(){
              studybit.closeExpandedStudybit(browser).then(function(){
                done();
              });
            });
          });
        });
      });
    });

    it("20. Delete the created studybits", function (done) {
        clearAllSavedContent.clearStudyboard(browser, done);
    });

    it("21. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });

});
