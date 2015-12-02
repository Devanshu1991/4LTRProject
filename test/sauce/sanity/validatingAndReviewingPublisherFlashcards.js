require('colors');
var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../test_data/data.json");
var session = require("../support/setup/browser-session");
var loginPage = require("../support/pages/loginpo");
var userSignOut = require("../support/pages/userSignOut");
var tocPage = require("../support/pages/tocpo");
var flashcard = require("../support/pages/flashcardspo.js");
var stringutil = require("../util/stringUtil");
var report = require("../support/reporting/reportgenerator");


describe('PUBLISHER FLASHCARDS VALIDATION AND REVIEW', function () {
    var browser;
    var allPassed = true;

    var userType;
    var courseName;

    var product;

    var data;
    var productData;
    var count = 0;
    var GlobalCount;


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
        console.log(report.formatTestName("PUBLISHER FLASHCARD VALIDATION AND REVIEW"));
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

    it("3. Navigate To Studyboard", function (done) {
        flashcard.NavigateToStudyBoard(browser, done);
    });
    it("4. Navigate Flashcard Tab", function (done) {

        flashcard.SelectFlashcardTab(browser, done);

    });
    it("5. Verify Default selected Tab is KeyTerm FlashCard", function (done) {

        flashcard.Verifykeytermflashcardselected(browser, done);

    });


    it("5a. Revert all Flashcards if already not reverted", function (done) {
        browser
            .execute("window.oldConfirm = window.confirm; window.confirm = function() { return true; };")
            .sleep(4000)
            .execute("for(i=0;i<(document.getElementsByClassName('ng-scope icon-revert-gray').length);i++){document.getElementsByClassName('ng-scope icon-revert-gray')[i].click();window.scrollBy(0,5)}")
            .sleep(10000)
            .execute("location.reload")
            .nodeify(done);


    });


    it("6. Verify Key Term Flashcard is present for every Chapter", function (done) {
        this.timeout(120000);
        var totalFlashcards = 0;
        var currentChapterNumber = 0;

        browser
            .waitForElementByCss(".icon-studyboard-blue", asserters.isDisplayed, 10000).then(function () {
                function countskeytermflashcard() {
                    if (currentChapterNumber < productData.chapter.topic.flashcards.publisher.chapters[0].totalchaptercount) {
                        browser
                            .sleep(4000)
                            .execute("window.scrollBy(0," + productData.chapter.topic.flashcards.publisher.chapters[0].scrollY + ")")
                            .execute("return document.getElementsByClassName('studybits flashcards')[0].getElementsByClassName('chapter ng-scope')[" + currentChapterNumber + "].getElementsByClassName('tile ng-scope').length")
                            .then(function (countofFlashcard) {

                                if (countofFlashcard === productData.chapter.topic.flashcards.publisher.chapters[0].cards.totalcount[currentChapterNumber]) {
                                    currentChapterNumber++;
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("Number of KeyTerm Flash Cards in Chapter " + currentChapterNumber + ": " + countofFlashcard, "success") +
                                        report.reportFooter());
                                    totalFlashcards = totalFlashcards + countofFlashcard;
                                    countskeytermflashcard();
                                }
                                else {
                                    currentChapterNumber++;
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("Number of KeyTerm Flash Cards in Chapter " + currentChapterNumber + ": " + countofFlashcard, "failure") +
                                        report.reportFooter());
                                    totalFlashcards = totalFlashcards + countofFlashcard;
                                    countskeytermflashcard();
                                }
                            });
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatus("Total number of keyterm Flashcards present :" + totalFlashcards, "success") +
                            report.reportFooter());
                        done();
                    }

                }

                countskeytermflashcard();
            });
    });


    it("7. Verify if the unexpanded flashcard tile has the keyterm icon", function (done) {
        browser
            .execute("window.scrollTo(0,0)")
            .execute("document.getElementsByClassName('studybits flashcards')[0].getElementsByClassName('chapter ng-scope')[0].getElementsByClassName('tile ng-scope')[3].getElementsByTagName('p')[0]")
            .text()
            .should.eventually.include(productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.front)
            .execute("return getComputedStyle(document.querySelector('div.studybit.keyterm'), ':after').content").then(function (iconurl) {
                if (iconurl.indexOf('studybit-keyterm-default') > -1) {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Icon For Key Term Flash Card" + iconurl, "success") +
                        report.reportFooter());
                    done();
                }
                else {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Icon For Key Term Flash Card", "failure") +
                        report.reportFooter());
                    done();
                }
            });

    });
    it("8. Expand the Flashcard and verify the text on the front and back of the flashcard", function (done) {

        if (process.env.RUN_ENV.toString() === "\"production\"") {
            browser
                .execute("window.scrollTo(0,500)")
                .waitForElementByCss(".studybits div[data-ordinal='1'] ul li:nth-child(4)", asserters.isDisplayed, 10000)

                .click()
                .sleep(10000)
                .waitForElementByCss(".studybits.flashcards li[class='banner'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='front']", asserters.isDisplayed, 60000).
                elementByCss(".studybits.flashcards li[class='banner'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='front']").
                execute("return document.querySelector(\".studybits.flashcards li[class='banner'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='front']\").value").then(function (textfront) {

                    console.log("Text on front of the card " + textfront);

                    if (textfront.indexOf(productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.front) > -1) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("Text on front of the flashcard " + textfront, " Expected " + productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.front, "success") +
                            report.reportFooter());

                        browser
                            .waitForElementByCss(".studybits.flashcards li[class='banner'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='back']", asserters.isDisplayed, 60000).
                            elementByCss(".studybits.flashcards li[class='banner'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='back']").
                            execute("return document.querySelector(\".studybits.flashcards li[class='banner'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='back']\").value").then(function (textback) {
                                if (textback.indexOf(productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.back) > -1) {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("Text on back of the flashcard " + textback, " Expected " + productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.back, "success") +
                                        report.reportFooter());
                                    done();
                                }
                                else {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("Text on back of the flashcard is incorrect " + textback, " Expected " + productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.back, "failure") +
                                        report.reportFooter());
                                    done();
                                }
                            });
                    } else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("Text on front of the flashcard is incorrect " + textfront, " Expected " + productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.front, "failure") +
                            report.reportFooter());
                        done();
                    }

                });
        } else {
            browser
                .execute("window.scrollTo(0,500)")
                .waitForElementByCss(".studybits div[data-ordinal='1'] ul li:nth-child(6)", asserters.isDisplayed, 10000)

                .click()
                .sleep(10000)
                .waitForElementByCss(".studybits.flashcards li[class='banner ng-scope'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='front']", asserters.isDisplayed, 60000).
                elementByCss(".studybits.flashcards li[class='banner ng-scope'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='front']").
                execute("return document.querySelector(\".studybits.flashcards li[class='banner ng-scope'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='front']\").value").then(function (textfront) {
                    if (textfront.indexOf(productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.front) > -1) {

                        console.log(report.reportHeader() +
                            report.stepStatusWithData("Text on front of the flashcard is incorrect " + textfront, " Expected " + productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.front, "success") +
                            report.reportFooter());

                        browser
                            .waitForElementByCss(".studybits.flashcards li[class='banner ng-scope'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='back']", asserters.isDisplayed, 60000).
                            elementByCss(".studybits.flashcards li[class='banner ng-scope'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='back']").
                            execute("return document.querySelector(\".studybits.flashcards li[class='banner ng-scope'] cg-studyboard-tile div.studybit.keyterm form div cg-flashcard-textarea cg-maxlength-textarea div textarea[name='back']\").value").then(function (textback) {
                                if (textback.indexOf(productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.back) > -1) {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("Text on back of the flashcard is incorrect " + textback, " Expected " + productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.back, "success") +
                                        report.reportFooter());
                                    done();
                                }
                                else {
                                    console.log(report.reportHeader() +
                                        report.stepStatusWithData("Text on back of the flashcard is incorrect " + textback, " Expected " + productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.back, "failure") +
                                        report.reportFooter());
                                    done();
                                }
                            });
                    } else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("Text on front of the flashcard is incorrect " + textfront, " Expected " + productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.front, "failure") +
                            report.reportFooter());
                        done();
                    }

                });
        }
    });

    it("9. Verify the presence of publisher keyterm concepts on the expanded flashcard", function (done) {
        this.timeout(120000);

        //     if (process.env.RUN_ENV.toString() === "\"production\"") {
        browser
            .execute("return document.getElementsByTagName('select')[1].getElementsByTagName('option')[1].text")
            .then(function (chaptername) {
                if (chaptername.indexOf(productData.chapter.topic.flashcards.publisher.chapters[0].name) > -1) {
                    browser
                        .execute("return document.getElementsByTagName('tags-input')[2].getElementsByTagName('li').length").then(function (nooftags) {
                            if (nooftags > 0) {
                                var m1 = 0;

                                function verifytextofconcept() {
                                    if (m1 < nooftags) {
                                        browser
                                            .execute("return document.getElementsByTagName('tags-input')[2].getElementsByTagName('li')[" + m1 + "].getElementsByTagName('span')[0].textContent").then(function (value) {
                                                if (value.indexOf(productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.publishertags[m1]) > -1) {

                                                    console.log(report.reportHeader() +
                                                        report.stepStatusWithData("Publisher tags present on the expanded flash card : " + value, "success") +
                                                        report.reportFooter());
                                                    m1++;
                                                    verifytextofconcept();

                                                }

                                            });
                                    }
                                    else {
                                        done();
                                    }
                                }

                                verifytextofconcept();
                            }
                        });
                }
            });
//        }else{
//            browser
//                .execute("return document.getElementsByTagName('select')[1].getElementsByTagName('option')[1].text")
//                .then(function (chaptername) {
//                    if (chaptername.indexOf(productData.chapter.topic.flashcards.publisher.chapters[0].name) > -1) {
//                        browser
//                            .execute("return document.getElementsByTagName('tags-input')[3].getElementsByTagName('li').length").then(function (nooftags) {
//                                if (nooftags > 0) {
//                                    var m1 = 0;
//
//                                    function verifytextofconcept() {
//                                        if (m1 < nooftags) {
//                                            browser
//                                                .execute("return document.getElementsByTagName('tags-input')[3].getElementsByTagName('li')[" + m1 + "].getElementsByTagName('span')[0].textContent").then(function (value) {
//                                                    if (value.indexOf(productData.chapter.topic.flashcards.publisher.chapters[0].cards.card.publishertags[m1]) > -1) {
//
//                                                        console.log(report.reportHeader() +
//                                                            report.stepStatusWithData("Publisher tags present on the expanded flash card : " + value, "success") +
//                                                            report.reportFooter());
//                                                        m1++;
//                                                        verifytextofconcept();
//
//                                                    }
//
//                                                });
//                                        }
//                                        else {
//                                            done();
//                                        }
//                                    }
//
//                                    verifytextofconcept();
//                                }
//                            });
//                    }
//                });
//        }
    });

    it("10. Close Expanded Flashcard", function (done) {
//        if (process.env.RUN_ENV.toString() === "\"production\"") {
        browser
            .sleep(5000)
            .waitForElementByXPath("//a[contains(@class,'icon-close-x-blue')]", asserters.isDisplayed, 60000)
            .click()
            .nodeify(done);
//        }else{
//            browser
//                .sleep(5000)
//                .waitForElementByXPath("(//a[contains(@class,'icon-close-x-blue')])[2]", asserters.isDisplayed, 60000)
//                .click()
//                .nodeify(done);
//        }


    });

    it("11. Click on Filter and Verify the total count of Key term flash card on first chapter", function (done) {
        browser
            .execute("window.scrollTo(0,0)")
            .waitForElementByXPath("(//a[contains(.,'FILTER')])[1]", asserters.isDisplayed, 90000)
            .click()
            .sleep(3000)
            .execute("document.getElementsByClassName('show-all-toggle')[0].click()")
            .sleep(2000)
            .waitForElementByXPath("(//div[contains(@class,'cg-checkbox ng-isolate-scope')])[1] /label", asserters.isDisplayed, 5000)
            .click()
            .execute("return document.getElementsByClassName('studybits flashcards')[0].getElementsByClassName('chapter ng-scope')[0].getElementsByClassName('tile ng-scope').length")
            .then(function (countofstudybit) {
                console.log("Flashcard counts from the Platform  " + countofstudybit);
                console.log("Flashcard counts from the test data  " + productData.chapter.topic.flashcards.publisher.chapters[0].cards.totalcount[0]);
                if (countofstudybit === productData.chapter.topic.flashcards.publisher.chapters[0].cards.totalcount[0]) {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Count of Key Term Flash Card for first chapter " + countofstudybit, "success") +
                        report.reportFooter());
                    done();
                } else {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Count of Key Term Flash Card for first chapter " + countofstudybit, "failure") +
                        report.reportFooter());
                    done();
                }
            });

    });

    it("12. Click on Review Desk and Verify the total count of Key term flash card in Chapter First", function (done) {
        browser
            .sleep(4000)
            .waitForElementByXPath("(//a[contains(.,'FILTER')])[1]", asserters.isDisplayed, 90000)
            .click()
            .sleep(2000)
            .execute("window.scrollTo(0,0)")
            .sleep(2000)
            .waitForElementByCss(".review-deck", asserters.isDisplayed, 90000)
            .click()
            .sleep(5000)
            .execute("return document.getElementsByClassName('card-counter ng-scope')[0].textContent.split('of ')[1]").then(function (flashcardcount) {
                console.log("by Code " + flashcardcount);
                GlobalCount = flashcardcount;
                if (flashcardcount === productData.chapter.topic.flashcards.publisher.chapters[0].cards.totalcount[0]) {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Count of Key Term Flash Card for Chapter First on ReviewDesk view" + flashcardcount, "success") +
                        report.reportFooter());
                    done();
                }
                else {
                    console.log(report.reportHeader() +
                        report.stepStatus("Count of Key Term Flash Card for Chapter First on ReviewDesk view", "failure") +
                        report.reportFooter());
                    done();
                }
            });

    });

    it("13. Verify text on Front and back side of Flash Card", function (done) {
        this.timeout(360000);
        var cardnumber = 1;

        function reviewallkeytermflshcard() {
            if (cardnumber <= GlobalCount) {
                browser
                    .execute("return document.getElementsByClassName('flashcard')[0].getElementsByTagName('div')[0].textContent").then(function (fronttext) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("Reviewing Card " + cardnumber + " text present on the front of the card and printing it as \" " + fronttext + "\"", "success") +
                            report.reportFooter());
                        browser
                            .waitForElementByCss(".icon-arrow-flip.ng-binding", asserters.isDisplayed, 10000)
                            .click()
                            .sleep(4000)
                            .execute("return document.getElementsByClassName('flashcard')[0].getElementsByTagName('div')[0].textContent").then(function (backtext) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("Reviewing Card " + cardnumber + " text present on the back of the card and printing it as \" " + backtext + "\"", "success") +
                                    report.reportFooter());

                                if (cardnumber == 1) {
                                    browser
                                        .waitForElementByXPath("//button[contains(@class,'ng-scope ng-binding') and contains(text(),'STRONG')]", asserters.isDisplayed, 10000)
                                        .click()
                                        .sleep(3000)
                                        .waitForElementByCss(".next", asserters.isDisplayed, 10000)
                                        .click()
                                        .waitForElementByCss(".previous", asserters.isDisplayed, 10000).then(function () {
                                            console.log(report.reportHeader() +
                                                report.stepStatusWithData("Previous Button is Displayed: ", "success") +
                                                report.reportFooter());
                                            cardnumber++;
                                            reviewallkeytermflshcard();
                                        });
                                } else {
                                    browser
                                        .waitForElementByCss(".next", asserters.isDisplayed, 10000)
                                        .click()
                                        .waitForElementByCss(".previous", asserters.isDisplayed, 10000).then(function () {
                                            console.log(report.reportHeader() +
                                                report.stepStatusWithData("Previous Button is Displayed: ", "success") +
                                                report.reportFooter());
                                            cardnumber++;
                                            reviewallkeytermflshcard();
                                        });
                                }

                            });
                    });
            }
            else {
                done();
            }

        }

        reviewallkeytermflshcard();


    });

    it("14. Validate flashCard counts on flash card results", function (done) {

        var comprehensionlevelAfterTheChange = GlobalCount - 1;
        if (process.env.RUN_ENV.toString() === "\"production\"") {
            browser
                .waitForElementByCss("div.indicator.strong div.numeral.ng-binding", asserters.isDisplayed, 60000)
                .text()
                .should.eventually.include("1")
                .waitForElementByCss("div.indicator.strong div.previous.ng-binding", asserters.isDisplayed, 60000)
                .text()
                .should.eventually.include("Was 0")
                .sleep(10000)
                .nodeify(done);
        } else {
            browser
                .waitForElementByCss("div.indicator.unassigned div.numeral.ng-binding", asserters.isDisplayed, 60000)
                .text()
                .should.eventually.include(comprehensionlevelAfterTheChange)
                .waitForElementByCss("div.indicator.unassigned div.previous.ng-binding", asserters.isDisplayed, 60000)
                .text()
                .should.eventually.include("Was " + GlobalCount)
                .waitForElementByCss("div.indicator.strong div.numeral.ng-binding", asserters.isDisplayed, 60000)
                .text()
                .should.eventually.include("1")
                .waitForElementByCss("div.indicator.strong div.previous.ng-binding", asserters.isDisplayed, 60000)
                .text()
                .should.eventually.include("Was 0")
                .sleep(10000)
                .nodeify(done);
        }
    });


    it("15. Click on Exit Button and verify the presence of shuffle button", function (done) {
        browser
            .waitForElementByCss(".shuffle-checkbox.ng-scope", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include("Shuffle")
            .waitForElementByCss(".exit.ng-scope", asserters.isDisplayed, 10000)
            .click()
            .sleep(2000)
            .nodeify(done);

    });


    it("16. Revert all Flashcard", function (done) {
        browser
            .execute("window.oldConfirm = window.confirm; window.confirm = function() { return true; };")
            .sleep(4000)
            .execute("for(i=0;i<(document.getElementsByClassName('ng-scope icon-revert-gray').length);i++){document.getElementsByClassName('ng-scope icon-revert-gray')[i].click();window.scrollBy(0,5)}")
            .sleep(10000)
            .execute("location.reload")
            .nodeify(done);


    });


});
 
  