/**
 * Created by nbalasundaram on 10/1/15.
 */

var intTestData = require("../../../../test_data/int.json");
var stagingTestData = require("../../../../test_data/staging.json");
var prodTestData = require("../../../../test_data/prod.json");
var productData = require("../../../../test_data/products.json");
var stringutil = require("../../util/stringUtil");
var mathutil = require("../../util/mathUtil");
var dateutil = require("../../util/date-utility");

var wd = require('wd');
var asserters = wd.asserters;

var data = {
    urlForLogin: "default",
    userId: "default",
    password: "default",
    firstname: "default",
    lastname: "default"
};

var cengageBrain;
var currentUserType;
module.exports = {


    setLoginData: function (userType) {
        currentUserType = userType;
        if (process.env.RUN_ENV.toString() === "\"integration\"") {
            data.urlForLogin = intTestData.integration_url;

        } else if (process.env.RUN_ENV.toString() === "\"staging\"") {
            data.urlForLogin = stagingTestData.staging_url;

        } else if (process.env.RUN_ENV.toString() === "\"production\"") {
            data.urlForLogin = prodTestData.prod_url;
        }

        if (userType === "instructor") {

            if (typeof process.env.RUN_FOR_INSTRUCTOR_USERID != 'undefined') {

                if (stringutil.removeBoundaryQuotes(process.env.RUN_FOR_INSTRUCTOR_USERID.toString()) != 'default') {
                    console.log("Overriding the test config instructor with a runtime instructor" + process.env.RUN_FOR_INSTRUCTOR_USERID.toString());

                    data.userId = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_INSTRUCTOR_USERID.toString());
                    data.password = "T3sting";
                    return data;
                }
            }

            if (process.env.RUN_ENV.toString() === "\"integration\"") {

                data.userId = intTestData.users.instructor[0].credentials.username;
                data.password = intTestData.users.instructor[0].credentials.password;

            } else if (process.env.RUN_ENV.toString() === "\"staging\"") {

                data.userId = stagingTestData.users.instructor[0].credentials.username;
                data.password = stagingTestData.users.instructor[0].credentials.password;

            } else if (process.env.RUN_ENV.toString() === "\"production\"") {

                data.userId = prodTestData.users.instructor[0].credentials.username;
                data.password = prodTestData.users.instructor[0].credentials.password;
            }


        } else if (userType === "student") {

            if (typeof process.env.RUN_FOR_STUDENT_USERID != 'undefined') {

                if (stringutil.removeBoundaryQuotes(process.env.RUN_FOR_STUDENT_USERID.toString()) != 'default') {
                    console.log("Overriding the test config student with a custom student" + process.env.RUN_FOR_STUDENT_USERID.toString());

                    data.userId = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_STUDENT_USERID.toString());
                    data.password = "T3sting";
                    data.firstname = "TestBot";
                    data.lastname = "Robo";
                    return data;
                }
            }

            if (process.env.RUN_ENV.toString() === "\"integration\"") {
                data.userId = intTestData.users.student[0].credentials.username;
                data.password = intTestData.users.student[0].credentials.password;
                data.firstname = intTestData.users.student[0].credentials.firstname;
                data.lastname = intTestData.users.student[0].credentials.lastname;
            } else if (process.env.RUN_ENV.toString() === "\"staging\"") {
                data.userId = stagingTestData.users.student[0].credentials.username;
                data.password = stagingTestData.users.student[0].credentials.password;
                data.firstname = stagingTestData.users.student[0].credentials.firstname;
                data.lastname = stagingTestData.users.student[0].credentials.lastname;

            } else if (process.env.RUN_ENV.toString() === "\"production\"") {

                data.userId = prodTestData.users.student[0].credentials.username;
                data.password = prodTestData.users.student[0].credentials.password;
                data.firstname = prodTestData.users.student[0].credentials.firstname;
                data.lastname = prodTestData.users.student[0].credentials.lastname;
            }

        } else if (userType === "custom") {
            if (process.env.RUN_ENV.toString() === "\"production\"") {
                data.userId = stringutil.removeBoundaryQuotes(process.env.RUN_FOR_USERID.toString());
                data.password = "T3sting";
            }
        }


        return data;
    },


    loginToApplication: function (browser, done) {
        browser
            .get(data.urlForLogin)
            .setWindowSize(1366, 1024)
            .elementByCssSelectorWhenReady("#loginFormId input[id='emailId']", 60000)
            .type(data.userId)
            .sleep(1000)
            .elementByCssSelectorWhenReady("#password", 40000)
            .type(data.password)
            .sleep(1000)
            .elementByXPathSelectorWhenReady("//input[contains(@value,'Sign In')]", 40000)
            .click()
            .nodeify(done);
    },

    launchACourse: function (userType, courseName, browser, done) {
        if (userType === "instructor") {
            browser
                .waitForElementByXPath("//a[contains(@data-track-ext,'" + courseName + "')]", asserters.isDisplayed, 20000)
                .execute("var x = document.evaluate(\"//a[contains(@data-track-ext,'" + courseName + "')]\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;x.setAttribute('target','');")
                .waitForElementByXPath("//a[contains(@data-track-ext,'" + courseName + "')]", asserters.isDisplayed, 10000)
                .click()
                .waitForElementByCss("ul li.chapter:nth-child(2)", asserters.isDisplayed, 90000)
                .nodeify(done);
        }
        else if (userType === "student") {

            if (stringutil.removeBoundaryQuotes(process.env.RUN_FOR_STUDENT_USERID.toString()) != 'default') {
                browser
                    .waitForElementByXPath("//span[contains(text(),'" + stringutil.removeBoundaryQuotes(process.env.RUN_FOR_COURSE.toString()) + "')]/..//following-sibling::li/a[contains(text(),'Open')]", asserters.isDisplayed, 60000)
                    .click()
                    .sleep(1000)
                    .windowHandle()
                    .then(
                    function (handle) {
                        cengageBrain = handle;
                        browser
                            .waitForElementByCss(".gracePeriodBtn", asserters.isDisplayed, 60000)
                            .click()
                            .windowHandles().should.eventually.have.length(2)
                            .window("childWindow")
                            .sleep(10000)
                            .nodeify(done);
                    });
            } else {


                browser
                    .waitForElementByXPath("//ul//span[contains(text(),'" + courseName + "')]", asserters.isDisplayed, 20000)
                    .execute("var x = document.evaluate(\"//ul//span[contains(text(),'" + courseName + "')]/parent::li/parent::ul//a\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;"
                        + "var url= x.getAttribute('onclick'); url = url.split('(');var fin = url[5].split(',');"
                        + "var l = fin[0].length;var final = fin[0].substring(1,(l-1));location.assign(final)")
                    .waitForElementByCss("ul li.chapter:nth-child(2)", asserters.isDisplayed, 90000)
                    .nodeify(done);
            }
        }

    },

    getCengageBrainHandle: function () {
        return cengageBrain;
    },

    getCurrentUsertype: function () {
        return currentUserType;
    },

    getProductData: function () {
        var allproducts = productData.products;
        var myproduct;
        for (var i = 0, len = allproducts.length; i < len; ++i) {
            var productDetails = allproducts[i];

            if (stringutil.removeBoundaryQuotes(process.env.RUN_FOR_PRODUCT.toString()) === productDetails.productid) {
                myproduct = productDetails;

            }

        }

        return myproduct;
    },

    getUserName: function () {

        return data.lastname + ", " + data.firstname;
    },

    getUserId: function () {

        return data.userId;
    },

    generateStudentId: function () {
        return "qa.student." + stringutil.removeBoundaryQuotes(process.env.RUN_ENV.toString()) + "." + mathutil.getRandomInt(0, 100) + dateutil.getCurrentDate() + "@cengage.com";
    },
    generateStudentAccount: function (browser, username) {

        firstname = "TestBot";
        lastname = "Robo";
        password = "T3sting";
        security = "4LTR";
        zipcode = "02148";

        return browser
            .get(data.urlForLogin)
            .setWindowSize(1366, 1024)
            .waitForElementByLinkText("New Student User? »", asserters.isDisplayed, 60000).elementByLinkText("New Student User? »")
            .click()
            .waitForElementById("showNewUserReg", asserters.isDisplayed, 60000).elementById("showNewUserReg")
            .click()
            .waitForElementByCss("#registerForm #standaloneRegistration #email", asserters.isDisplayed, 60000).waitForElementByCss("#registerForm #standaloneRegistration #email")
            .click()
            .type(username)
            .type(wd.SPECIAL_KEYS.Enter)
            .waitForElementById("fname", asserters.isDisplayed, 60000).elementById("fname")
            .type(firstname)
            .waitForElementById("lname", asserters.isDisplayed, 60000).elementById("lname")
            .type(lastname)
            .waitForElementById("password", asserters.isDisplayed, 60000).elementById("password")
            .type(password)
            .waitForElementById("confirmPassword", asserters.isDisplayed, 60000).elementById("confirmPassword")
            .type(password)
            .waitForElementById("questionSelectBoxItText", asserters.isDisplayed, 60000).elementById("questionSelectBoxItText")
            .click()
            .waitForElementByLinkText("What is the name of your high school?", asserters.isDisplayed, 60000).elementByLinkText("What is the name of your high school?")
            .click()
            .waitForElementById("answer", asserters.isDisplayed, 60000).elementById("answer")
            .type(security)
            .waitForElementById("acceptEULA", asserters.isDisplayed, 60000).elementById("acceptEULA")
            .click()
            .waitForElementByClassName("greenWhiteButton", asserters.isDisplayed, 60000).elementByClassName("greenWhiteButton")
            .click()
            .waitForElementById("locationSelectBoxItText", asserters.isDisplayed, 60000).elementById("locationSelectBoxItText")
            .click()
            .waitForElementByLinkText("United States", asserters.isDisplayed, 60000).elementByLinkText("United States")
            .click()
            .sleep(3000)
            .waitForElementById("institutionTypeSelectBoxItText", asserters.isDisplayed, 60000).elementById("institutionTypeSelectBoxItText")
            .click()
            .waitForElementByLinkText("2 Year College", asserters.isDisplayed, 60000).elementByLinkText("2 Year College")
            .click()
            .waitForElementById("zipcode", asserters.isDisplayed, 60000).elementById("zipcode")
            .type(zipcode)
            .waitForElementByClassName("greenWhiteButton", asserters.isDisplayed, 60000).elementByClassName("greenWhiteButton")
            .click()
            .waitForElementByCss("input[id='6412']", asserters.isDisplayed, 60000).elementByCss("input[id='6412']")
            .click()
            .waitForElementByClassName("greenWhiteButton", asserters.isDisplayed, 60000).elementByClassName("greenWhiteButton")
            .click()
            .sleep(5000)
            .waitForElementByLinkText("Log Out", asserters.isDisplayed, 60000).elementByLinkText("Log Out")
            .click();
    }
};
