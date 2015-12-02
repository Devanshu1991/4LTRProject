var wd = require('wd');
var asserters = wd.asserters;
var report = require("../reporting/reportgenerator");

module.exports = {

    conceptTackerValidation: function (studybitcount, browser, done) {
        browser
            .waitForElementByXPath("(//div[contains(@class,'studybit-count')])[1]", asserters.isDisplayed, 90000)
            .text()
            .should.eventually.include(studybitcount + '\nStudyBits').then(function () {
                conceptTrackerValidation = "success";
                console.log(report.reportHeader() +
                    report.stepStatus("ConceptTracker Validation status on concept tracker page", conceptTrackerValidation) +
                    report.reportFooter());
            })
            .sleep(1000)
            .nodeify(done);
    },

    isConceptTrackerLoaded: function (browser) {
        return browser
            .waitForElementByCss(".concept-tracker.ng-scope header", asserters.isDisplayed, 90000)
            .elementByCssSelector(".concept-tracker.ng-scope header");
    },

    isConceptTrackerLoadedOnStudentEnd: function (browser) {

        return browser
            .waitForElementByCss(".active.ng-binding", asserters.isDisplayed, 90000);
    }


};