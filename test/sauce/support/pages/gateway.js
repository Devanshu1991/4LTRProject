/**
 * Created by nbalasundaram on 10/3/15.
 */
var wd = require('wd');
var Q = require('q');
var testData = require("../../../../test_data/mindlinks/mindlinks.json");
module.exports = {

    getAssignmentURL: function () {

        if (process.env.RUN_ENV.toString() === "\"integration\"") {
            return testData.integration.assignment.url;

        } else if (process.env.RUN_ENV.toString() === "\"staging\"") {

            return "To be configured";

        } else if (process.env.RUN_ENV.toString() === "\"production\"") {

            return "To be configured";
        }
    },

    getDetails: function () {
        if (process.env.RUN_ENV.toString() === "\"integration\"") {

            return testData.integration;

        } else if (process.env.RUN_ENV.toString() === "\"staging\"") {

            return "To be configured";

        } else if (process.env.RUN_ENV.toString() === "\"production\"") {

            return "To be configured";
        }
    },

    getGlobalOptions: function () {
        return testData.global;
    },

    constructURL: function (token, assignmentCgi) {

        var deferred = Q.defer();
        var url = this.getDetails().product.url;
        var launchurl = url + "?" +
            "token=" + token +
            "&eISBN=" + this.getDetails().course.eISBN +
            "&courseKey=" + this.getDetails().course.courseKey +
            "&titleIsbn=" + this.getDetails().course.titleIsbn +
            "&assignmentCgi=" + assignmentCgi;
        deferred.resolve(launchurl);
        return deferred.promise;
    }


};