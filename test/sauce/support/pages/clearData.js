var wd = require('wd');
module.exports = {

    clearStudyboard: function (browser, done) {
        browser
            .execute("window.oldConfirm = window.confirm; window.confirm = function() { return true; };")
            .sleep(8000)
            .execute("for(i=0;i<(document.getElementsByClassName('icon-trash-gray').length);i++){document.getElementsByClassName('icon-trash-gray')[i].click();window.scrollBy(0,5)}")
            .sleep(10000)
            .execute("location.reload")
            .nodeify(done);
    },
    clearAllAssignment: function (browser, done) {
        browser
            .execute("return document.getElementsByClassName('week ng-scope day-selection-disabled')[0].getElementsByClassName('day ng-scope')[0].getElementsByClassName('event ng-scope is-not-revealed-to-students').length").then(function (assignmentCount) {
                console.log("hello");
                console.log(assignmentCount);
                astcount = assignmentCount - 1;
                function deleteAssignment() {
                    if (astcount >= 0) {
                        consol.log("hello2");
                        browser
                            .execute("document.getElementsByClassName('week ng-scope day-selection-disabled')[0].getElementsByClassName('day ng-scope')[0].getElementsByClassName('event ng-scope is-not-revealed-to-students')[" + assignmentCount + "].click()").then(function () {
                                browser
                                    .execute("return document.getElementsByClassName('nudge-right ng-isolate-scope').length").then(function (assignmenttype) {
                                        if (assignmenttype === 2) {
                                            browser
                                                .sleep(2000)
                                                .waitForElementByCss(".delete.ng-scope", asserters.isDisplayed, 60000)
                                                .click()
                                                .sleep(5000)
                                                .elementByXPathSelectorWhenReady("(//button[contains(@class,'save ng-binding')])[2]", 5000)
                                                .click()
                                                .sleep(10000);
                                        }
                                        else {
                                            browser
                                                .execute("window.oldConfirm = window.confirm; window.confirm = function() { return true; };")
                                                .waitForElementByCss(".delete.ng-scope", asserters.isDisplayed, 60000)
                                                .click()
                                                .sleep(3000);
                                        }

                                    });
                                assignmentCount--;
                                deleteAssignment();
                            });
                    }
                    else {
                        console.log("hello");
                        done();

                    }

                }
            });
    },
    editAllAssignment: function (browser, done) {
        browser
            .execute("return document.getElementsByClassName('week ng-scope day-selection-disabled')[0].getElementsByClassName('day ng-scope')[0].getElementsByClassName('event ng-scope is-not-revealed-to-students').length").then(function (assignmentCount) {
                console.log("hello");
                console.log(assignmentCount);
                astcount = assignmentCount - 1;
                function editAssignment() {
                    if (astcount >= 0) {
                        consol.log("hello2");
                        browser
                            .execute("document.getElementsByClassName('week ng-scope day-selection-disabled')[0].getElementsByClassName('day ng-scope')[0].getElementsByClassName('event ng-scope is-not-revealed-to-students')[" + assignmentCount + "].click()").then(function () {
                                browser
                                    .waitForElementByXPath("(//div[contains(@class,'datefield ng-binding')])[2]", asserters.isDisplayed, 60000)
                                    .click()
                                    .waitForElementByXPath("//div[@class='span-half']//cg-date-picker[@label-text='Reveal in Student Calendar']//div[@class='previous']", asserters.isDisplayed, 10000)
                                    .click()
                                    .sleep(5000)
                                    .waitForElementByCss("div[class='datepicker cg-calendar ng-isolate-scope'] .day.ng-scope.today", asserters.isDisplayed, 10000)
                                    .click()
                                    .execute("document.getElementsByClassName('done ng-scope')[0].click()");
                                assignmentCount--;
                                editAssignment();
                            });
                    }
                    else {
                        console.log("hello");
                        done();

                    }

                }
            });
    }

};

	