require('colors');
var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../test_data/data.json");
var session = require("../support/setup/browser-session");
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/loginpo");
var tocPage = require("../support/pages/tocpo");
var studybit = require("../support/pages/studybitpo");
var clearAllSavedContent = require("../support/pages/clearData");
var userSignOut = require("../support/pages/userSignOut");
var _ = require('underscore');

var stringutil = require("../util/stringUtil");
var report = require("../support/reporting/reportgenerator");


describe(' TABLE/IMAGE STUDYBIT, INTERNAL EXHIBIT LINKS, CHAPTER LINKS VALIDATION', function () {
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
        console.log("productData::" + productData);
        console.log("productData.chapter.id::" + productData.chapter.id);

        //Reports
        console.log(report.formatTestName("TABLE/IMAGE STUDYBIT, INTERNAL EXHIBIT LINKS, CHAPTER LINKS VALIDATION"));
        console.log(report.formatTestData(data.urlForLogin, data.userId, product, courseName));

        console.log(report.printTestData("CHAPTER " + productData.chapter.topic.studybit.exhibit.chapter + " ", productData.chapter.topic.studybit.exhibit.chaptertitle));
        console.log(report.printTestData("TOPIC " + productData.chapter.topic.studybit.exhibit.topic + " ", productData.chapter.topic.studybit.exhibit.topicname));
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

    it("3. Click on List view and Verify", function (done) {
        browser
            .sleep(3000)
            .waitForElementByCss(".icon-list-gray", asserters.isDisplayed, 60000)
            .click()
            .nodeify(done);
    });

    it("4. Navigate to a Chapter", function (done) {

        tocPage.getChapterTitleonListView(productData.chapter.id, browser, productData.chapter.topic.studybit.exhibit.chapter)
            .then(function (text) {
                console.log(text);
                tocPage.navigateToAChapterByListView(productData.chapter.id, browser, productData.chapter.topic.studybit.exhibit.chapter);
                done();
            });

    });

    it("5. Navigate to a topic", function (done) {
        tocPage.navigateToATopicByListView(browser, done, productData.chapter.topic.id, productData.chapter.topic.studybit.exhibit.topic);
    });

    it("6. Select exhibit and create it's studybit", function (done) {
        studybit.createExhibitStudyBit(browser, done,
            productData.chapter.topic.studybit.exhibit.studybitId,
            productData.chapter.topic.studybit.exhibit.concepts,
            productData.chapter.topic.studybit.exhibit.usertag,
            productData.chapter.topic.studybit.exhibit.notes,
            productData.chapter.topic.studybit.exhibit.windowScrollY);
    });

    it("7. Open created exhibit StudyBit and validate the StudyBit Save ", function (done) {
        studybit.validateExhibitStudyBitSave(browser, done,
            productData.chapter.topic.studybit.exhibit.studybitId,
            productData.chapter.topic.studybit.exhibit.concepts,
            productData.chapter.topic.studybit.exhibit.usertag,
            productData.chapter.topic.studybit.exhibit.notes,
            productData.chapter.topic.studybit.exhibit.windowScrollY);
    });

    it("8. Create an Image StudyBit", function (done) {
        studybit.createImageStudyBit(browser, done,
            productData.chapter.topic.studybit.image.studybitId,
            productData.chapter.topic.studybit.image.concepts,
            productData.chapter.topic.studybit.image.usertag,
            productData.chapter.topic.studybit.image.notes,
            productData.chapter.topic.studybit.image.windowScrollY);
    });

    it("9. Open created exhibit StudyBit and validate the StudyBit Save ", function (done) {
        studybit.validateImageStudyBitSave(browser, done,
            productData.chapter.topic.studybit.image.studybitId,
            productData.chapter.topic.studybit.image.concepts,
            productData.chapter.topic.studybit.image.usertag,
            productData.chapter.topic.studybit.image.notes,
            productData.chapter.topic.studybit.image.windowScrollY);
    });


    it("10. Scroll at the bottom of the topic and validate the presence of another exhibit", function (done) {
        studybit.validateTheBottomMostExhibit(browser, productData.chapter.topic.studybit.bottomMostexhibit.id)
            .then(function () {
                browser
                    .waitForElementByCss("#" + productData.chapter.topic.studybit.bottomMostexhibit.id + " .ordinal", asserters.isDisplayed, 60000)
                    .text().should.eventually.include(productData.chapter.topic.studybit.bottomMostexhibit.name)
                    .nodeify(done);
            });
    });


    it("11. Validate and Navigate to inline links within narrative content", function (done) {

        if (productData.productid !== "PSYCH4") {
            browser
                .waitForElementByXPath("//p[@id='" + productData.inline_links.chapter.context_id + "']//a[contains(.,'" + productData.inline_links.chapter.link_text + "')]", asserters.isDisplayed, 60000)
                .click().then(function () {
                    studybit.validateAndNavigateToInlineLink(browser)
                        .then(function () {
                            console.log(report.reportHeader() +
                                report.stepStatusWithData("Validation of Internal Chapter Navigation through Xref links", productData.inline_links.chapter.link_text, "success") +
                                report.reportFooter());
                            done();
                        })
                });
        } else {
            console.log(report.reportHeader() +
                report.stepStatus("Validation of Internal Chapter Navigation through Xref links skipped for PSYCH4", "success") +
                report.reportFooter());
            done();
        }
    });


    it("12. Navigate to Studyboard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });


    it("13. Verify the presence of Exhibit StudyBit on StudyBoard ", function (done) {
        studybit.validateExhibitStudyBitOnStudyBoard(browser, done,
            productData.chapter.topic.studybit.exhibit.chaptername,
            productData.chapter.topic.studybit.exhibit.notes,
            productData.chapter.topic.studybit.exhibit.concepts[0],
            productData.chapter.topic.studybit.exhibit.usertag);
    });


    it("14. Verify the presence of Image StudyBit On StudyCoard", function (done) {
      this.timeout(120000);
        studybit.validateImageStudyBitOnStudyBoard(browser, done,
            productData.chapter.topic.studybit.image.chaptername,
            productData.chapter.topic.studybit.image.notes,
            productData.chapter.topic.studybit.image.concepts[0],
            productData.chapter.topic.studybit.image.usertag);
    });

    it("15. Delete the created studybits if any", function (done) {
        clearAllSavedContent.clearStudyboard(browser, done);
    });

    it("16. Navigate to a topic to create note", function (done) {

        tocPage.navigateToToc(browser).then(function () {
            tocPage.navigateToAChapter(productData.chapter.id, browser).then(function () {
                tocPage.navigateToATopic(productData.chapter.id, productData.chapter.topic.id, browser).nodeify(done);

            });
        });
    });

    it("17. Find the count of foot notes on a specefic narrative content and validate text for all", function (done) {
      var counter = 1;
      var counterForLoop = 0;
      browser
        .waitForElementsByCssSelector(".reader.ng-isolate-scope", asserters.isDisplayed, 60000).then(function (container) {
            container[0].elementsByXPath("//a[@class='footnoteref']").then(function (footnote) {
              function footNoteCount(){
                if(_.size(footnote)>=counter){
                    browser
                    .execute("document.getElementsByClassName('footnoteref')["+counterForLoop+"].scrollIntoView(true);")
                    .execute("window.scrollBy(0,-100)")
                    .waitForElementByXPath("(//a[@class='footnoteref'])["+counter+"]", asserters.isDisplayed, 90000)
                    .click()
                    .waitForElementByCss(".footnote-content.is-visible", asserters.isDisplayed, 90000)
                    .text().then(function(footnotetext){
                      console.log(report.reportHeader() +
                      report.stepStatusWithData("The content of footnote "+counter+" is : ",footnotetext, "success") +
                      report.reportFooter());
                    }).then(function(){
                      browser
                      .waitForElementByXPath("(//a[@class='footnoteref'])["+counter+"]", asserters.isDisplayed, 90000)
                      .click().then(function(){
                        counterForLoop++;
                        counter++;
                        footNoteCount();
                      });
                    });
                }else{
                  if(counterForLoop==_.size(footnote)){
                    console.log(report.reportHeader() +
                    report.stepStatusWithData("Footnote count on  this topic is ", counterForLoop, "success") +
                    report.reportFooter());
                    done();
                  }else {
                    console.log(report.reportHeader() +
                    report.stepStatusWithData("No Footnote were available on this topic Count came out to be ", counterForLoop,"failure") +
                    report.reportFooter());
                    done();
                  }
                }
              }footNoteCount();

            });
          });
    });

    it("18. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });

});
