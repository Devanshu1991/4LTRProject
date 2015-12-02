var wd = require('wd');
var asserters = wd.asserters;
var report = require("../../support/reporting/reportgenerator");
module.exports = {


    verifychaptertileimage: function (browser, done, urlfirstimg) {
        browser
            .waitForElementByXPath("(//div[contains(@class,'featured') and contains(@ng-style,'background-image')])[1]", 2000).getAttribute("style").then(function (style) {
                if ((style.indexOf(urlfirstimg)) > -1) {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Correct Image Display On Chapter Tiles", "success") +
                        report.reportFooter());
                    done();
                } else {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Incorrect Image Display On Chapter Tiles", "failure") +
                        report.reportFooter());
                    done();
                }
            });

    },

    verifycarouselview: function (browser, done, idofheading, heading, idofsecondimage) {
        browser
            .execute("return document.getElementsByClassName('banner ng-scope')[0].getElementsByClassName('featured-items')[0].getElementsByTagName('li').length").then(function (len) {
                if (len == 6) {
                    console.log(report.reportHeader() +
                        report.stepStatusWithData("Verify the presence of 6 Chapter highlight boxes on Carousel View", "success") +
                        report.reportFooter());
                    browser
                        .waitForElementByXPath("(//ul[@class='featured-items']//li)[2]/a/div/img", 3000).getAttribute('src').then(function (href) {
                            browser.waitForElementByXPath("(//ul[@class='featured-items']//li)[1]/a/div/img", 3000).click()
                                .sleep(5000).waitForElementByCss('#' + idofheading, 3000).text().then(function (text) {
                                    if (text.indexOf(heading) > -1) {
                                        console.log(report.reportHeader() + report.stepStatusWithData("Verify the Carousel is loaded with the correct asset", "success") + report.reportFooter());
                                    } else {
                                        console.log(report.reportHeader() + report.stepStatusWithData("Verify the Carousel is loaded with the correct asset", "failure") + report.reportFooter());
                                    }
                                    browser.waitForElementByCss('.owl-next', asserters.isDisplayed, 10000).click()
                                        .waitForElementByCss('#' + idofsecondimage, asserters.isDisplayed, 10000)
                                        .isDisplayed()
                                        .should.become(true)
                                        .waitForElementByXPath("(//a[@class='icon-close-x'])[last()]", asserters.isDisplayed, 10000).then(function (close) {
                                            close.click();
                                            console.log(report.reportHeader() + report.stepStatusWithData("Verify the Presence of Close Button on Carousel Loaded View", "success") + report.reportFooter());
                                            done();
                                        });
                                });
                        });
                }
                else {
                    console.log(report.reportHeader() + report.stepStatusWithData("Verify the presence of 6 Chapter highlight boxes on Carousel View", "failure") + report.reportFooter());
                    done();
                }
            });
    }
};
