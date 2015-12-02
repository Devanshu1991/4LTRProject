var wd = require('wd');
var asserters = wd.asserters;
var loginPage = require('./loginpo');
var stringutil = require("../../util/stringUtil");
module.exports = {

    userSignOut: function (browser, done) {
        browser
            .sleep(1000)
            .waitForElementByCss(".dropdown-link>.user-name.ng-binding", asserters.isDisplayed, 60000)
            .sleep(5000)
            .click()
            .waitForElementByXPath("//a[contains(text(),'Sign Out')]", asserters.isDisplayed, 60000)
            .click()
            .waitForElementByCss("div.logo a[href*=cengagebrain]", asserters.isDisplayed, 60000)
            .then(function () {

                if (stringutil.removeBoundaryQuotes(process.env.RUN_FOR_STUDENT_USERID.toString()) != 'default') {

                    if (loginPage.getCurrentUsertype() === 'student') {


                        browser.window("childWindow").close().then(function () {

                            browser.sleep(10000)
                                .window(loginPage.getCengageBrainHandle()).waitForElementByXPath("//a[contains(text(),'Log Out')]", asserters.isDisplayed, 60000)
                                .click()
                                .nodeify(done);
                        })


                    } else {
                        return done();
                    }

                } else {
                    return done();
                }
            });


    }
};

