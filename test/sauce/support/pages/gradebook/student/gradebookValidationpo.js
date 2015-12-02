var wd = require('wd');
var asserters = wd.asserters;
var report = require("../../../../support/reporting/reportgenerator");
var _ = require('underscore');

module.exports = {

    getStudentScore: function (browser, assignmentName) {
        return browser
            .waitForElementByXPath("//a[contains(text(),'" + assignmentName + "')]/parent::td/following-sibling::td[@class='score-col']//div[@class='left-of-pipe']/span", asserters.isDisplayed, 60000)
            .text();

    },

    getStudentTotalScore: function (browser, assignmentName) {

        return browser.waitForElementByXPath("//a[contains(text(),'" + assignmentName + "')]/parent::td/following-sibling::td[@class='score-col']//div[@class='right-of-pipe']", asserters.isDisplayed, 60000)
            .text();
    },


    getScoredPoints: function (browser, assignmentName) {
        return browser
            .waitForElementByXPath("//a[contains(text(),'" + assignmentName + "')]/parent::td/following-sibling::td[@class='points-col']//div[@class='left-of-pipe']", asserters.isDisplayed, 60000)
            .text();
    },

    getTotalPoints: function (browser, assignmentName) {
        return browser
            .waitForElementByXPath("//a[contains(text(),'" + assignmentName + "')]/parent::td/following-sibling::td[@class='points-col']//div[@class='right-of-pipe']", asserters.isDisplayed, 60000)
            .text();
    },

    validateAvgScoreOnStudentGradebook: function (browser, assignmentName, classAverage, done) {

      console.log("classAverage::"+classAverage);
        return browser.waitForElementsByXPath("//a[contains(text(),'" + assignmentName + "')]/parent::td[@class='assignment-col']/parent::tr", asserters.isDisplayed, 60000).then(function (assignmentRows) {

            assignmentRows[0].elementByCss("td.avg-col div.left-of-pipe span").text().then(function (averageInApp) {
                  if(averageInApp.indexOf(classAverage)>-1){
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("GRADEBOOK : Class Average points ", averageInApp + " displayed successfully", "success") +
                        report.reportFooter());
                    done();
                } else {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("GRADEBOOK : Class Average points ", averageInApp + " is incorrect ", "failure") +
                        report.reportFooter());
                }

            });

        });

    },

    getDueDate: function (browser) {
        return browser
            .waitForElementByCss(".submitted-col.ng-binding", asserters.isDisplayed, 60000)
            .text();
    }
};
