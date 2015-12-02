/**
 * Created by nbalasundaram on 10/2/15.
 */
var wd = require('wd');
var testData =  require("../../../../test_data/data.json");

module.exports = {

    getCourseTimeOut: function() {
        var timeOut = 20000;
        if (process.env.RUN_ENV.toString() === "\"integration\"") {
            timeOut = testData.courseCreationTimeOut.integration;

        } else if (process.env.RUN_ENV.toString() === "\"staging\"") {
            timeOut = testData.courseCreationTimeOut.staging;

        } else if (process.env.RUN_ENV.toString() === "\"production\"") {
            timeOut = testData.courseCreationTimeOut.production;

        }
        return timeOut;
    },

    getCourseAggregationTimeOut: function() {
        var timeOut = 20000;
        if (process.env.RUN_ENV.toString() === "\"integration\"") {
            timeOut = testData.courseAggregationTimeOut.integration;

        } else if (process.env.RUN_ENV.toString() === "\"staging\"") {
            timeOut = testData.courseAggregationTimeOut.staging;

        } else if (process.env.RUN_ENV.toString() === "\"production\"") {
            timeOut = testData.courseAggregationTimeOut.production;

        }
        return timeOut;
    },

    getUniqueCourseName: function(){
        return  "Robot-Created : " + new Date();
    }

};
