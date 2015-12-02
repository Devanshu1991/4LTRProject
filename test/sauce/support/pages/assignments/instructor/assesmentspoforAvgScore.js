var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../../../../test_data/assignments/assessments.json");
var courseHelper = require("../../../../support/helpers/courseHelper");
var servicepo = require("./servicepo");

var request = require('supertest')(servicepo.getAssignmentURL());
var util = require('util');
var _ = require('underscore');
var olr = require("../../olr");
var loginPage = require("../../loginpo");
var assessment = require('./assessmentspo');


module.exports = {

    selectAvgScore: function (browser) {
        return browser
            .waitForElementByXPath("//div[@class='score-type-radio ng-isolate-scope']//label[contains(text(),'Average Score')]", asserters.isDisplayed, 10000)
            .click();
    },

    getRoboPointScore: function (correctanswers1stattempt, correctanswers2ndattempt, correctanswers3rdattempt) {
        var systempoints = ((parseInt(assessment.getAssignmentPoints()) / (parseInt(assessment.getMaxAssignmentQuestions()) * 3)) * ((parseInt(correctanswers1stattempt) + parseInt(correctanswers2ndattempt) + parseInt(correctanswers3rdattempt)))) ;
        return systempoints.toString();
    }

};
