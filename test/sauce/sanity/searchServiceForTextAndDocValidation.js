require('colors');

var wd = require('wd');
var asserters = wd.asserters;

var testData = require("../../../test_data/data.json");
var docsnlinks = require("../../../test_data/assignments/documentAndLinks.json");

var session = require("../support/setup/browser-session");
var loginPage = require("../support/pages/loginpo");
var brainPage = require("../support/pages/brianpo");
var menuPage = require("../support/pages/menupo");
var calendarNavigation = require("../support/pages/assignments/instructor/navigationpo");
var documentAndLinksPage = require("../support/pages/assignments/instructor/documentAndLinkspo");
var searchFeaturePage = require("..//support/pages/searchFeaturepo");
var userSignOut = require("../support/pages/userSignOut");
var courseHelper = require("../support/helpers/courseHelper");

var report = require("../support/reporting/reportgenerator");
var stringutil = require("../util/stringUtil");
var dataUtil = require("../util/date-utility");


describe('4LTR (' + 'Instructor/Student' + ') :: SEARCH :: SEARCH,MANAGE DOCUMENTS,DOCS AND LINKS ASSIGNMENT VALIDATION', function () {

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
        console.log(report.formatTestName("SEARCH :: SEARCH,MANAGE DOCUMENTS,DOCS AND LINKS ASSIGNMENT VALIDATION"));
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

    it("4. Enter a search keyword and verify the results", function (done) {
        this.timeout(360000);
        searchFeaturePage.openSearchControl(browser).then(function () {
            searchFeaturePage.enterTheSearchTerm(browser, productData.search_keyword).then(function () {
                searchFeaturePage.getResultsCount(browser)
                    .text().should.eventually.include(productData.search_result_count)
                    .then(function () {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("SEARCH :: Keyword \"" + productData.search_keyword + "\" fetched a total of   ", productData.search_result_count + " matches") +
                            report.reportFooter());
                        counter = 0;
                        (function scrollTillFooterVisible() {
                            searchFeaturePage.scrollToSearchResultsBottom(browser);
                            if (counter < 10) {
                                setTimeout(scrollTillFooterVisible, 3000);
                                counter++;
                            } else {
                                searchFeaturePage.selectAResult(browser, productData.search_result_count).then(function (result) {

                                    if (result != undefined) {
                                        console.log(report.reportHeader() +
                                            report.stepStatusWithData("SEARCH :: Keyword \"" + productData.search_keyword + "\" has the " + productData.search_result_count + "th result with title  ", result) +
                                            report.reportFooter());
                                        done();
                                    } else {
                                        console.log(report.reportHeader() +
                                            report.stepStatus("SEARCH :: Not able to retrieve the " + productData.search_result_count + "th result for Keyword \"" + productData.search_keyword + "\"", "failure") +
                                            report.reportFooter());
                                        done();
                                    }
                                });
                            }
                        })();

                    });
            });
        });
    });


    it("5. Navigate to Manage my Docs", function (done) {
        menuPage.selectManagDocs(browser, done);
    });

    it("6. Validate the presence of different type of documents on manage my documents page", function (done) {
        browser
            .elementByCssSelectorWhenReady(".docs.ng-scope", asserters.isDisplayed, 60000)
            .sleep(5000)
            .elementByXPathSelectorWhenReady("//li[contains(@class,'ng-scope ppt') and contains(.,'" + productData.chapter.topic.documents.managedocuments[0].documents[0] + "')]", asserters.isDisplayed, 60000)
            .then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("SEARCH :: Verified the presence of documents on manage my docs page ", productData.chapter.topic.documents.managedocuments[0].documents[0]) +
                    report.reportFooter());
            })
            .elementByXPathSelectorWhenReady("//li[contains(@class,'ng-scope pdf') and contains(.,'" + productData.chapter.topic.documents.managedocuments[0].documents[1] + "')]", asserters.isDisplayed, 60000)
            .then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("SEARCH :: Verified the presence of documents on manage my docs page ", productData.chapter.topic.documents.managedocuments[0].documents[1]) +
                    report.reportFooter());
            })
            .nodeify(done);
    });

    it("7. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);

    });


    it("8. Select current date and open the Assessment Type assignment settings page", function (done) {
        calendarNavigation.selectADateForAssignment(browser)
            .then(function () {
                calendarNavigation.selectDocumentsAndLinksTypeAssignment(browser, done);
            });
    });

    it("9. Complete the Document and Link form for system created assignment", function (done) {
        documentAndLinksPage.enterName(browser).then(function () {
            documentAndLinksPage.enterRevealDate(browser).then(function () {
                documentAndLinksPage.enterDescription(browser).nodeify(done);
            });
        });
    });

    it("10. Add the attachments", function (done) {
        browser
            .waitForElementByCss("button.attachment.ng-scope", asserters.isDisplayed, 60000)
            .click().then(function () {
                documentAndLinksPage.addTheAttachments(browser, done);
            });
    });

    it("11. Save the Documents and Link Assignment", function (done) {
        documentAndLinksPage.saveAssignment(browser).then(function () {
            documentAndLinksPage.checkIfAssignmentSaved(browser).then(function () {

                console.log(report.reportHeader() +
                    report.stepStatusWithData("Instructor created Documents and links type assignment called :: ", documentAndLinksPage.getAssignmentName() + " is saved successfully", "success") +
                    report.reportFooter());
                done();

            });

        });
    });


    it("12. Log out as Instructor", function (done) {
        userSignOut.userSignOut(browser, done);

    });

    it("13. Login as student", function (done) {

        userType = "student";
        data = loginPage.setLoginData(userType);


        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });


    it("14. Select a Course and launch", function (done) {

        loginPage.launchACourse(userType, courseName, browser, done);

    });


    it("15. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);
    });


    it("16. Click on the current date cell", function (done) {
        browser
            .sleep(3000)
            .elementByCssSelectorWhenReady(".day.ng-scope.today", 5000)
            .click()
            .nodeify(done);
    });

    it("17. Verify the Documents and Links type assignment and its attachment on Student's assignment view'", function (done) {
        browser
            .waitForElementByXPath("//div[@class='details']//div[contains(@class,'title') and contains(.,'" + documentAndLinksPage.getAssignmentName() + "')]", asserters.isDisplayed, 60000)
            .sleep(3000)
            .waitForElementByXPath("//a[contains(@class,'assignment-link ng-binding')and contains(.,'" + productData.chapter.topic.documents.assignments[0].documents[0].name + "')]", asserters.isDisplayed, 60000)
            .then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("SEARCH :: STUDENT ASSIGNMENT :: Verified the presence of assigned document ", productData.chapter.topic.documents.assignments[0].documents[0].name) +
                    report.reportFooter());
            })
            .waitForElementByXPath("//a[contains(@class,'assignment-link ng-binding')and contains(.,'" + productData.chapter.topic.documents.assignments[0].documents[1].name + "')]", asserters.isDisplayed, 60000)
            .then(function () {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("SEARCH :: STUDENT ASSIGNMENT :: Verified the presence of assigned document ", productData.chapter.topic.documents.assignments[0].documents[1].name) +
                    report.reportFooter());
            })
            .nodeify(done);
    });

    it("18. Verify the Description of Documents and Links type assignment and its attachment on Student's assignment view to include the link", function (done) {
        browser
            .elementByCssSelectorWhenReady(".instructions span")
            .text().should.eventually.include(docsnlinks.assignment.description)
            .nodeify(done);
    });

    it("19. Log out as Student", function (done) {
        userSignOut.userSignOut(browser, done);
    });

    it("20. Login as Instructor", function (done) {

        userType = "instructor";
        data = loginPage.setLoginData(userType);


        //Reports

        console.log(report.printLoginDetails(data.userId));

        loginPage.loginToApplication(browser, done);
    });

    it("20a. Select a Product", function (done) {

        brainPage.selectProduct(product, browser, done);

    });


    it("21. Select a Course and launch", function (done) {
        loginPage.launchACourse(userType, courseName, browser, done);

    });

    it("22. Navigate to Assignments page", function (done) {
        menuPage.selectAssignments(userType, browser, done);

    });

    it("23. Delete the Document and links assignment for cleanup", function (done) {
        documentAndLinksPage.deleteNonAssessmentAssignment(browser).then(function () {
            console.log(report.reportHeader() +
                report.stepStatusWithData("Instructor created Documents and links type assignment called :: ", documentAndLinksPage.getAssignmentName() + " is deleted successfully after validation", "success") +
                report.reportFooter());
            done();

        });

    });


});