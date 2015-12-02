require('colors');
var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../test_data/data.json");
var session = require("../support/setup/browser-session");
var loginPage = require("../support/pages/loginpo");
var userSignOut = require("../support/pages/userSignOut");
var tocPage = require("../support/pages/tocpo");
var chaptertile = require("../support/pages/chaptertileverificationpo.js");
var stringutil = require("../util/stringUtil");
var report = require("../support/reporting/reportgenerator");
var _ = require('underscore');


describe('CHAPTER LIST VIEW VALIDATION', function () {
    var browser;
    var allPassed = true;

    var userType;
    var courseName;

    var product;

    var data;
    var productData;
    var topiclenthchapter1;
    var topiclenthchapter;
    var viewedTopicCount = 0;
    var counterForChapterNavigation =1;
    var n = 1;


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
        console.log(report.formatTestName("LIST VIEW-TOPIC SLIDING PANE-TOPIC NAVIGATION-CHAPTER REVIEW, CHAPTER INTRO, GAMES/KEYTERMS ON CHAPTER REVIEW VALIDATION"));
        console.log(report.formatTestData(data.urlForLogin, data.userId, product, courseName));
        console.log(report.printTestData("CHAPTER " + productData.chapter.id + " ", productData.chapter.title));

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

    it("3. Click on List view and Verify", function (done) {
        tocPage.clickonlistview(browser, done);
    });
    it("4. Navigate to a Chapter", function (done) {

        tocPage.getChapterTitleonListView(productData.chapter.id, browser, 1)
            .then(function (text) {
                text.should.contain(productData.chapter.title);

                tocPage.getChapterTitleonListView(productData.chapter.id, browser, 2)
                    .then(function (text) {
                        text.should.contain(productData.chapter.title2);
                    })
                    .then(function () {
                        tocPage.navigateToAChapterByListView(productData.chapter.id, browser, 1);
                        done();
                    });
            });


    });
    it("5. Navigate to a 2nd topic from Chapter List View", function (done) {

        tocPage.navigateToATopicByListView(browser, done, productData.chapter.topic.id, 2);

    });
    it("6. Click on the sliding topic pane on the Topic page and verify the presence of chapters and topic on the sliding topic pane", function (done) {
        browser
            .waitForElementByCss(".sliding-menu-button.ng-scope", asserters.isDisplayed, 5000)
            .click()
            .sleep(2000)
            .waitForElementByCss(".sliding-menu-content.is-visible", asserters.isDisplayed, 5000)
            .waitForElementByCss(".sliding-menu-content.is-visible h2", asserters.isDisplayed, 5000).text().then(function (text) {

                if (text.indexOf(productData.chapter.topic.toc.heading) > -1) {
                    browser
                        .waitForElementByCss(".sliding-menu-content ul li:nth-child(1)", asserters.isDisplayed, 5000)
                        .waitForElementByCss(".sliding-menu-content ul li:nth-child(1) a[class='menu-chapter']", asserters.isDisplayed, 5000).text().then(function (text) {

                            console.log(report.reportHeader() + report.stepStatusWithData("Topic Page sliding panel shows ", productData.chapter.title, "success") + report.reportFooter());

                            if (text.indexOf(productData.chapter.title) > -1) {
                                browser
                                .sleep(2000)
                                .waitForElementsByCssSelector(".sliding-menu-content.is-visible", asserters.isDisplayed, 60000).then(function (list) {
                                    list[0].elementsByXPath("(//nav[@class='sliding-menu-content is-visible']//ul//li)[1]//a[@class='menu-topic ng-scope']").then(function (topics) {
                                        topiclenthchapter = _.size(topics);
                                        topiclenthchapter1 = topiclenthchapter+1;
                                        function validateTopic() {
                                            n++;
                                            if (n <= topiclenthchapter1) {
                                                browser
                                                    .waitForElementByCss(".sliding-menu-content ul li:nth-child(1) a:nth-child(" + n + ")", asserters.isDisplayed, 5000)
                                                    .text()
                                                    .should.eventually.include(productData.chapter.topic.toc.topic[n]).then(function (title) {
                                                        console.log(report.reportHeader() + report.stepStatusWithData("Topic Page sliding panel shows ", title, "success") + report.reportFooter());
                                                        validateTopic();
                                                    });

                                            }
                                            else {

                                                done();
                                            }
                                        }
                                        validateTopic();
                                      });
                                    });
                            }
                        });


                }
            });

    });

    it("7. Verify Chapter Introduction and Navigate to Chapter Review By next Button", function (done) {
        this.timeout(240000);
        var  loopcount=0;
        browser
            .waitForElementByCss(".sliding-menu-content ul li:nth-child(1) a:nth-child(2)", asserters.isDisplayed, 5000)
            .click()
            .sleep(20000)
            .waitForElementByCss(".topic-title span", asserters.isDisplayed, 60000)
            .text()
            .should.eventually.include(productData.chapter.topic.toc.chapterintro)
            .then(function (title) {
                console.log(report.reportHeader() + report.stepStatusWithData("Traversing to subsequent topics using arrow button on blue navigation panel ", title, "success") + report.reportFooter());
                function clickOnNextButton() {
                  loopcount++
                    if (counterForChapterNavigation < topiclenthchapter) {
                            browser
                            .sleep(15000)
                            .execute("window.scrollTo(0,0)")
                            .waitForElementsByCssSelector('.icon-right-arrow-white', asserters.isDisplayed, 60000).then(function (arrowElements) {
                                arrowElements[0].elementByCssSelector(".ng-isolate-scope").then(function (subElement) {
                                    subElement.elementByCssSelector("a[rel='next']").then(function (arrowLinkElement) {
                                        arrowLinkElement.click().then(function () {
                                          browser
                                            .execute("window.scrollTo(0,0)")
                                            .waitForElementByCss(".topic-title span", asserters.isDisplayed, 60000)
                                            .text().then(function(topics){
                                              console.log(report.reportHeader() +
                                              report.stepStatusWithData("Topic already viewed and the title is:: ", topics, "success")
                                              + report.reportFooter());
                                            }).then(function(){
                                              counterForChapterNavigation++;
                                              clickOnNextButton();
                                        })
                                    })
                                })

                            });
                          });

                    }
                    else {
                        if(counterForChapterNavigation == topiclenthchapter){
                          browser
                            .execute("window.scrollTo(0,0)")
                            .waitForElementByCss(".topic-title span", asserters.isDisplayed, 60000)
                            .text().then(function(topics){
                              console.log(report.reportHeader() +
                              report.stepStatusWithData("Number of views which is "+counterForChapterNavigation+" is equal to number of topics in chapter ", topiclenthchapter,"success")
                              + report.reportFooter());
                              done();
                            });
                        }else {
                          console.log(report.reportHeader() +
                          report.stepStatusWithData("Number of views which is "+counterForChapterNavigation+"is not equal to number of topics in chapter ", topiclenthchapter,"failure")
                          + report.reportFooter());
                          done();
                        }

                    }
                }

                clickOnNextButton();
            });
    });

    it("8. Verify Key Term and Games on Chapter Review", function (done) {
        browser
            .execute("window.scrollTo(0," + productData.chapter.topic.toc.scrollforkeyterm + ")")
            .waitForElementByCss("#" + productData.chapter.topic.toc.cssofkeyterm, asserters.isDisplayed, 60000)
            .text()
            .should.eventually.include(productData.chapter.topic.toc.value)
            .waitForElementByCss("#" + productData.chapter.topic.toc.idofkeyterm, asserters.isDisplayed, 60000)
            .text()
            .should.eventually.include(productData.chapter.topic.toc.keyterm)
            .waitForElementsByCssSelector(".reader-content.ng-binding", asserters.isDisplayed, 60000).then(function (readerContents) {
                readerContents[0].elementsByXPath("//iframe").then(function (elements) {
                    if (_.size(elements) === 2) {
                        console.log(report.reportHeader() +
                            report.stepStatus("Chapter Review Page displays " + _.size(elements) + " games", "success") +
                            report.reportFooter());
                        done();
                    } else {
                        console.log(report.reportHeader() +
                            report.stepStatus("Chapter Review Page has not displayed " + _.size(elements) + " games", "failure") +
                            report.reportFooter());
                            done();
                    }

                });
            });

    });

    it("9. Click on next Button at the Bottom of the Page", function (done) {
        browser
            .sleep(5000)
            .execute("document.getElementsByClassName('ng-scope ng-binding')[5].scrollIntoView(true)")
            .sleep(2000)
            .waitForElementByXPath("(//a[contains(.,'Topic 2-CI')])[2]", asserters.isDisplayed, 60000)
            .click()
            .sleep(15000)
            .waitForElementByCss(".topic-title span", asserters.isDisplayed, 60000)
            .text()
            .should.eventually.include(productData.chapter.topic.toc.chapterintro2)
            .sleep(15000)
            .nodeify(done);

    });


    it("10. Log out as Student", function (done) {
      this.timeout(60000);
        userSignOut.userSignOut(browser, done);
    });

});
