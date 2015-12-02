require('colors');

var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/loginpo");
var olr = require("../support/pages/olr");
var gateway = require("../support/pages/gateway");

var userAccountAction = require("../support/pages/userSignOut");
var session = require("../support/setup/browser-session");
var testData = require("../../../test_data/mindlinks/mindlinks.json");

var report = require("../support/reporting/reportgenerator");
var stringutil = require("../util/stringUtil");

var asserters = wd.asserters;


var request = require('supertest')(gateway.getAssignmentURL());
var util = require('util');
var _ = require('underscore');


describe('GATEWAY/MINDLINKS::OPENING 4LTR ASSIGNMENTS FROM EXTERNAL PLATORMS THROUGH CENGAGE GATEWAY', function () {
    var browser;
    var allPassed = true;

    before(function (done) {
        browser = session.create(done);

        //Reports
        console.log(report.formatTestName("GATEWAY/MINDLINKS::OPENING 4LTR ASSIGNMENTS FROM EXTERNAL PLATORMS THROUGH CENGAGE GATEWAY"));


    });

    afterEach(function (done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function (done) {


        session.close(allPassed, done);
    });


    it("1. Open the 4LTR assignments from external application for a valid assignmentId", function (done) {

        this.timeout(120000);
        request.get('/' + gateway.getDetails().course.assignment.courseCgi)
            .expect(200)
            .then(function (res) {
                var assignment = res.body;
                assignmentCgi = _.result(_.find(assignment, function (chr) {
                    return chr.name === gateway.getDetails().course.assignment.nameonhtml;
                }), 'activityId');

                //USING THE SOAP getToken to get the login token
                olr.getToken(gateway.getDetails().student.id).then(function (token) {
                    //console.log("Resolved value"+token);
                    gateway.constructURL(token, assignmentCgi).then(function (launchURL) {
                        console.log(launchURL);
                        browser.get(launchURL)
                            .waitForElementByXPath("//a[contains(text(),'" + gateway.getDetails().course.assignment.nameonhtml + "')]", asserters.isDisplayed, 60000).waitForElementByXPath("//a[contains(text(),'" + gateway.getDetails().course.assignment.nameonhtml + "')]")
                            .text().should.eventually.include("" + gateway.getDetails().course.assignment.name + "")
                            .then(function (name) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("MindLinks Validation using URL \"" + launchURL + "\" for a valid assignment\" ", name + " \"", "success") +
                                    report.reportFooter());
                            })
                            .nodeify(done);
                    });

                });
            });


    });
    it("2. Open the 4LTR assignments from external application for an invalid assignmentId", function (done) {

        this.timeout(120000);

        request.get('/' + gateway.getDetails().course.assignment.courseCgi)
            .expect(200)
            .then(function (res) {
                var assignment = res.body;
                assignmentCgi = _.result(_.find(assignment, function (chr) {
                    return chr.name === gateway.getDetails().course.assignment.nameonhtml;
                }), 'activityId');


                //console.log("Asssignment id : "+assignmentCgi);
                //USING THE SOAP getToken to get the login token
                olr.getToken(gateway.getDetails().student.id).then(function (token) {

                    gateway.constructURL(token, "Jumbojack").then(function (launchURL) {

                        //console.log(launchURL);

                        browser.get(launchURL)
                            .waitForElementByCss("div.flash-alert ul li:nth-child(1)", asserters.isDisplayed, 60000).elementByCss("div.flash-alert ul li:nth-child(1)")
                            .text().should.eventually.include(gateway.getGlobalOptions().assignment.message)
                            .then(function (message) {
                                console.log(report.reportHeader() +
                                    report.stepStatusWithData("MindLinks Validation using URL \"" + launchURL + "\" for an invalid assignment has displayed message \" ", message + " \"", "success") +
                                    report.reportFooter());
                            })
                            .nodeify(done);
                    });


                });
                //done();
            });


    });

});