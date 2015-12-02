require('colors');
var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../test_data/data.json");
var session = require("../support/setup/browser-session");
var loginPage = require("../support/pages/loginpo");
var tocPage = require("../support/pages/tocpo");
var chaptertile = require("../support/pages/chaptertileverificationpo.js");
var stringutil = require("../util/stringUtil");
var report = require("../support/reporting/reportgenerator");
var _ = require('underscore');


describe('CHAPTER, FEATURED IMAGES, CAROUSEL VIEW VALIDATION', function () {
    var browser;
    var allPassed = true;

    var userType;
    var courseName;

    var chaptertilesimagevalidation = "failure";

    var product;
    var urlForLogin;
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
        console.log(report.formatTestName("CHAPTER, FEATURED IMAGES, CAROUSEL VALIDATION"));
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

    it("3. Verify the Chapter Tiles Image", function (done) {
        chaptertile.verifychaptertileimage(browser, done, productData.chapter.topic.carousel.urlforfirsttileimage);
    });

    it("4. Navigate to a Chapter", function (done) {
        tocPage.getChapterTitle(productData.chapter.id, browser)
            .then(function (text) {
                text.should.contain(productData.chapter.title);
            })
            .then(function () {
                tocPage.navigateToAChapter(productData.chapter.id, browser)
                    .nodeify(done);
            });
    });

    it("5. Validate: all the topics, featured items and navigation to corousel view from chapter banner", function (done) {
        chaptertile.verifycarouselview(browser, done, productData.chapter.topic.carousel.idofheading,
            productData.chapter.topic.carousel.heading,
            productData.chapter.topic.carousel.idofsecondimage);
    });

    it("6. validate type of icons associated with each featured items", function (done) {
        if (process.env.RUN_ENV.toString() !== "\"production\"") {
            this.timeout(120000);
            browser
                .sleep(5000)
                .waitForElementsByCssSelector("li[class='banner ng-scope']", asserters.isDisplayed, 60000)
                .then(function (banner) {
                    banner[0].elementsByXPath("//li[@class='banner ng-scope']//ul[@class='featured-items']//li").then(function (elements) {
                        var countcarousel = 1;
                        function verifyicon() {
                            if (countcarousel <= _.size(elements)) {
                                browser
                                    .waitForElementByXPath("(//li[@class='banner ng-scope']//ul[@class='featured-items']//li)[" + countcarousel + "]//a/span", asserters.isDisplayed, 10000)
                                    .getAttribute('class').then(function (attributeicon) {
                                        if (attributeicon.indexOf("video-featured-icon") > -1) {
                                            browser
                                              .waitForElementByXPath("(//li[@class='banner ng-scope']//ul[@class='featured-items']//li)[" + countcarousel + "]//a/span", asserters.isDisplayed, 10000)
                                              .then(function(element){
                                                browser
                                                .getComputedCss(element, 'background-Image')
                                                .then(function(property){
                                                   if(property.indexOf("4ltr-dev.cengage.info/images/content-type-video.d6b2e8f4.svg")>-1){
                                                      console.log(report.reportHeader() +
                                                      report.stepStatusWithData("At position " + countcarousel + " featured item has a video icon",property,"success") +
                                                      report.reportFooter());
                                                      countcarousel++;
                                                      verifyicon();
                                                  }
                                                  else
                                                  {
                                                    console.log(report.reportHeader() +
                                                    report.stepStatusWithData("At position " + countcarousel + " featured item has no video icon",property,"failure") +
                                                    report.reportFooter());
                                                    countcarousel++;
                                                    verifyicon();
                                                  }
                                                });
                                              });
                                        }
                                        else if (attributeicon.indexOf("narrative-featured-icon") > -1) {
                                          browser
                                            .waitForElementByXPath("(//li[@class='banner ng-scope']//ul[@class='featured-items']//li)[" + countcarousel + "]//a/span", asserters.isDisplayed, 10000).then(function(element){
                                              browser
                                                .getComputedCss(element, 'background-Image').then(function(property){
                                                  if(property.indexOf("4ltr-dev.cengage.info/images/type-gray.d5402572.svg")>-1){
                                                    console.log(report.reportHeader() +
                                                    report.stepStatusWithData("At position " + countcarousel + " featured item has a image icon",property,"success") +
                                                    report.reportFooter());
                                                              countcarousel++;
                                                              verifyicon();
                                                            }
                                                              else{
                                                                console.log(report.reportHeader() +
                                                                report.stepStatusWithData("At position " + countcarousel + " featured item has no image icon",property,"failure") +
                                                                report.reportFooter());
                                                                countcarousel++;
                                                                verifyicon();
                                                            }
                                                   });
                                                });
                                        }
                                        else if (attributeicon.indexOf("assessment-featured-icon") > -1) {
                                                      browser
                                                        .waitForElementByXPath("(//li[@class='banner ng-scope']//ul[@class='featured-items']//li)[" + countcarousel + "]//a/span", asserters.isDisplayed, 10000).then(function(element){
                                                          browser
                                                          .getComputedCss(element, 'background-Image').then(function(property){
                                                            if(property.indexOf("type-gray.d5402572.svg")>-1){
                                                              console.log(report.reportHeader() +
                                                              report.stepStatusWithData("At position " + countcarousel + " featured item has a assessment icon",property,"success") +
                                                              report.reportFooter());
                                                              countcarousel++;
                                                              verifyicon();
                                                            }
                                                              else{
                                                                console.log(report.reportHeader() +
                                                                report.stepStatusWithData("At position " + countcarousel + " featured item has no assessment icon",property,"failure") +
                                                                report.reportFooter());
                                                                countcarousel++;
                                                                verifyicon();
                                                            }
                                                    });

                                                    });

                                        }
                                        else {
                                          console.log(report.reportHeader() +
                                            report.stepStatusWithData("At position " + countcarousel + " featured item has no video/image icon",property,"success") +
                                            report.reportFooter());
                                            countcarousel++;
                                            verifyicon();
                                        }

                                    });

                            } else
                            { if ((countcarousel - 1) === _.size(elements)) {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("All "+_.size(elements)+" featured items icons traced", "success") +
                                        report.reportFooter());
                                    done();
                                } else {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("All featured items icons could not be traced", "failure") +
                                        report.reportFooter());
                                    done();
                                }

                            }
                        }

                        verifyicon();

                    });
                });
        } else {
            console.log("Skipping this in production");
            done();
        }

    });

});
