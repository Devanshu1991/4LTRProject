/**
 * Created by nbalasundaram on 10/3/15.
 */
var wd = require('wd');
var testData = require("../../../../../../test_data/assignments/assessments.json");
module.exports = {

    getAssignmentURL: function () {

        if (process.env.RUN_ENV.toString() === "\"integration\"") {
            return testData.service.integration.url;

        } else if (process.env.RUN_ENV.toString() === "\"staging\"") {

            return "To be configured";

        } else if (process.env.RUN_ENV.toString() === "\"production\"") {

            return testData.service.production.url;
        }
    }


};
