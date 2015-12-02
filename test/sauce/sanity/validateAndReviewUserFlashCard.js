require('colors');
var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../test_data/data.json");
var session = require("../support/setup/browser-session");
var loginPage = require("../support/pages/loginpo");
var tocPage = require("../support/pages/tocpo");
var flashcardPage = require("../support/pages/flashcardspo.js");
var studybit = require("../support/pages/studybitpo");
var studyboardPage = require("../support/pages/studyboardpo.js")
var clearAllSavedContent = require("../support/pages/clearData");
var userSignOut = require("../support/pages/userSignOut");

var stringutil = require("../util/stringUtil");
var report = require("../support/reporting/reportgenerator");

describe('USER FLASHCARDS VALIDATION AND REVIEW', function () {
    var browser;
    var allPassed = true;

    var userType;
    var courseName;

    var product;

    var data;
    var productData;
    var count = 0;
    var GlobalCount;
    var reviewDeckResultBeforeShuffle = 0;
    var reviewDeckResultAfterShuffle;

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
        console.log(report.formatTestName("USER FLASHCARD VALIDATION AND REVIEW"));
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
        flashcardPage.NavigateToStudyBoard(browser, done);
    });

    it("4. Navigate flashcard Tab", function (done) {
        flashcardPage.SelectFlashcardTab(browser, done);
    });

    it("5. Navigate to user flashcard View", function (done) {
        this.timeout(120000);
        flashcardPage.selectUserFlashcardView(browser, done);
    });

    it("6. Delete already created user flashcards", function (done) {
        clearAllSavedContent.clearStudyboard(browser, done);
    });

    it("7. Create a flashcard with full details", function (done) {
        flashcardPage.createFlashcardWithFullDetails(browser, done,
            productData.chapter.topic.flashcard.userflashcard.valuetext[0],
            productData.chapter.topic.flashcard.userflashcard.valuetext[1],
            productData.chapter.topic.flashcard.userflashcard.chapter,
            productData.chapter.topic.flashcard.userflashcard.usertag,
            productData.chapter.topic.flashcard.userflashcard.comprehension
        );
    });

    it("8. Expand the Filter panel", function (done) {
        browser
            .waitForElementByXPath("(//a[contains(.,'FILTER')])[1]", asserters.isDisplayed, 90000)
            .click()
            .nodeify(done);
    });

    it("9. Filter the Flashcard by appying comprehension attribute on Filter panel after clearing it and validate the result", function (done) {
        studyboardPage.clearAllComprehensionFilter(browser).then(function () {
            browser
                .sleep(5000)
                .waitForElementByXPath("//label[contains(.,'Weak')]", asserters.isDisplayed, 90000)
                .click()
                .waitForElementByCss(".overlay", asserters.isDisplayed, 90000)
                .click()
                .waitForElementByXPath("//li[contains(@class,'banner')]//section//div[@class='tags']//span", asserters.isDisplayed, 90000).text()
                .then(function (userTagFetched) {
                    if (userTagFetched.indexOf(productData.chapter.topic.flashcard.userflashcard.usertag) > -1) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("Flashcard : User tag of filtered flashcard which is:: " + userTagFetched + ",is compared against user tag specified while creating flashcard which is", productData.chapter.topic.flashcard.userflashcard.usertag, "success") +
                            report.reportFooter());
                        done();
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("Flashcard : User tag of filtered flashcard which is:: " + userTagFetched + ",is compared against user tag specified while creating flashcard which is", productData.chapter.topic.flashcard.userflashcard.usertag, "failure") +
                            report.reportFooter());
                        done();
                    }
                });
        });
    });

    it("10. Review the Flash deck, validating Front text, flipping it validating back text and Review Result ", function (done) {
        browser
            .execute("window.scrollTo(0,0)")
            .waitForElementByCss(".review-deck", asserters.isDisplayed, 90000)
            .click().then(function () {
                flashcardPage.validateFrontContentOnReviewDeck(browser).then(function (frontText) {
                    if (frontText.indexOf(productData.chapter.topic.flashcard.userflashcard.valuetext[0]) > -1) {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("Flashcard Review deck: Front text of Flashcard on the deck  :: " + frontText + ",is compared against front text specified while creating flashcard which is", productData.chapter.topic.flashcard.userflashcard.valuetext[0], "success") +
                            report.reportFooter());
                        done();
                    }
                    else {
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("Flashcard Review deck: Front text of Flashcard on the deck  :: " + frontText + ",is compared against front text specified while creating flashcard which is", productData.chapter.topic.flashcard.userflashcard.valuetext[0], "failure") +
                            report.reportFooter());
                        done();
                    }
                });
                browser
                    .waitForElementByCss(".icon-arrow-flip.ng-binding", asserters.isDisplayed, 90000).click()
                    .then(function () {
                        flashcardPage.validateBackContentOnReviewDeck(browser).then(function (backText) {
                            if (backText.indexOf(productData.chapter.topic.flashcard.userflashcard.valuetext[1]) > -1) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("Flashcard Review deck: Back text of Flashcard on the deck  :: " + backText + ",is compared against back text specified while creating flashcard which is", productData.chapter.topic.flashcard.userflashcard.valuetext[1], "success") +
                                    report.reportFooter());
                            }
                            else {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("Flashcard Review deck: back text of Flashcard on the deck  :: " + backText + ",is compared against back text specified while creating flashcard which is", productData.chapter.topic.flashcard.userflashcard.valuetext[1], "failure") +
                                    report.reportFooter());
                            }
                        });
                    });
            });
    });

    it("11. Click on next button,fetch the result from review result ", function (done) {
        browser
            .waitForElementByXPath("//button[contains(.,'Next')]", asserters.isDisplayed, 90000).click().then(function () {
                browser
                    .waitForElementByXPath("//div[contains(@class,'" + productData.chapter.topic.flashcard.userflashcard.reviewComprehension + "')]//div[contains(@class,'numeral')]")
                    .text().then(function (currentDeckResult) {
                        reviewDeckResultBeforeShuffle = currentDeckResult;
                        console.log(report.reportHeader() +
                            report.stepStatusWithData("Flashcard Review deck: Result before shuffle and review again is ::" + reviewDeckResultBeforeShuffle, "success") +
                            report.reportFooter());
                        done();
                    });
            });
    });

    it("12. Review the deck again and remove the comrehension level from the deck", function (done) {
        browser
            .waitForElementByXPath("//button[contains(.,'REVIEW SELECTED')]", asserters.isDisplayed, 90000).click()
            .waitForElementByXPath("//button[contains(@class,'active')and contains(.,'" + productData.chapter.topic.flashcard.userflashcard.comprehension + "')]", asserters.isDisplayed, 90000)
            .click()
            .waitForElementByXPath("//button[contains(.,'Next')]", asserters.isDisplayed, 90000).click()
            .nodeify(done);
    });

    it("13. Validate the review deck result after shuffle", function (done) {
        var result;
        browser
            .waitForElementByXPath("//div[contains(@class,'" + productData.chapter.topic.flashcard.userflashcard.reviewComprehension + "')]//div[contains(@class,'numeral')]", asserters.isDisplayed, 90000)
            .text().then(function (deckResultAfterShuffle) {
                reviewDeckResultAfterShuffle = deckResultAfterShuffle;
                result = reviewDeckResultBeforeShuffle - 1
                if (parseInt(reviewDeckResultAfterShuffle) === parseInt(result)) {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Flashcard Review deck: Result before shuffle and review again is ::" + reviewDeckResultBeforeShuffle, "and result after shuffle is ::" + reviewDeckResultAfterShuffle, "success") +
                        report.reportFooter());
                    done();
                }
                else {
                    console.log("Not equal");
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Flashcard Review deck: Result before shuffle and review again is ::" + reviewDeckResultBeforeShuffle, "and result after shuffle is ::" + reviewDeckResultAfterShuffle, "failure") +
                        report.reportFooter());
                    done();
                }
            });
    });

    it("14. Delete the created user flashcards", function (done) {
        clearAllSavedContent.clearStudyboard(browser, done);
    });

    it("15. Navigate to Studyboard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("16. Delete the created studybits if any", function (done) {
        clearAllSavedContent.clearStudyboard(browser, done);
    });

    it("17. Navigate to TOC ", function (done) {
        tocPage.navigateToToc(browser).nodeify(done);
    });

    it("18. Navigate to a Chapter", function (done) {
        tocPage.getChapterTitle(productData.chapter.id, browser)
            .then(function (text) {
                text.should.contain(productData.chapter.title);
            })
            .then(function () {
                tocPage.navigateToAChapter(productData.chapter.id, browser)
                    .nodeify(done);
            });
    });

    it("19. Navigate to a topic", function (done) {
        tocPage.navigateToATopic(productData.chapter.id, productData.chapter.topic.id, browser)
            .then(function () {
                tocPage.disposeFirstVisitTopicModalIfVisible(browser).then(function () {
                    tocPage.getTopicTitleHero(browser).then(function (text) {
                        text.should.contain(productData.chapter.topic.titlehero);
                    }).nodeify(done);
                });

            });
    });

    it("20. Create a Text StudyBit", function (done) {
        studybit.createTextStudyBit(browser, done, productData.chapter.topic.studybit.text.id,
            productData.chapter.topic.studybit.text.concepts[0],
            productData.chapter.topic.studybit.text.usertag,
            productData.chapter.topic.studybit.text.notes,
            productData.chapter.topic.studybit.text.comprehension,
            productData.chapter.topic.studybit.text.windowScrollY);
    });

    it("21. Validate if StudyBit is successfully saved on narrative view ", function (done) {
        studybit.validateTextStudyBitSave(browser, done, productData.chapter.topic.studybit.text.id,
            productData.chapter.topic.studybit.text.concepts[0],
            productData.chapter.topic.studybit.text.usertag,
            productData.chapter.topic.studybit.text.notes,
            productData.chapter.topic.studybit.text.comprehension,
            productData.chapter.topic.studybit.text.windowScrollY);
    });

    it("22. Navigate To StudyBoard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("23. Verify the presence of text StudyBit on StudyBoard ", function (done) {
        studybit.validateTextStudyBitOnStudyBoard(browser, done,
            productData.chapter.topic.studybit.text.chaptername,
            productData.chapter.topic.studybit.text.notes,
            productData.chapter.topic.studybit.text.concepts[0],
            productData.chapter.topic.studybit.text.usertag);
    });

    it("24. Create a Flashcard from StudyBit", function (done) {
        flashcardPage.createFlashcardFromStudyBit(browser, done, productData.chapter.topic.flashcard.userflashcard.valuetext[1]);
    });

    it("25. Handle the message", function (done) {
        browser
            .waitForElementByCss(".icon-close-x", asserters.isDisplayed, 90000)
            .click()
            .nodeify(done);
    });

    it("26. Navigate to user flashcard View", function (done) {
        this.timeout(120000);
        flashcardPage.selectUserFlashcardView(browser, done);
    });

    it("27. Verify the presence of user Flashcard on StudyBoard ", function (done) {
        flashcardPage.validateUserFlashCardOnStudyBoard(browser).then(function (userTag) {
            if (userTag === productData.chapter.topic.studybit.text.usertag) {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("StudyBit Flashcard is successfully saved and appearing on  StudyBoard with user tag " + userTag, "success") +
                    report.reportFooter());
                done();
            }
            else {
                console.log(report.reportHeader() +
                    report.stepStatusWithData("StudyBit Flashcard is not successfully saved and is not appearing on  StudyBoard", "failure") +
                    report.reportFooter());
                done();
            }

        });
    });

    it("28. Delete the created user flashcards", function (done) {
        clearAllSavedContent.clearStudyboard(browser, done);
    });

    it("29. Navigate To StudyBoard ", function (done) {
        studybit.navigateToStudyBoard(browser, done);
    });

    it("30. Delete the created studybit", function (done) {
        clearAllSavedContent.clearStudyboard(browser, done);
    });

});
