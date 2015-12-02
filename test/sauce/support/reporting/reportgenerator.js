/**
 * Created by nbalasundaram on 9/22/15.
 */

module.exports = {

    formatTestName: function (title) {
        return "<div><h2 id=\"title\">" + title + "<\/h2><\/div>";

    },

    formatTestData: function (urlForLogin, userId, product, courseName) {
        return "<div><ol class=\"testdata\">" +
            "<li class=\"testdatatitle\">TEST DATA <\/li>" +
            "<li>Environment :: " + process.env.RUN_ENV + "<\/li>" +
            "<li>URL to login :: <a href=\"" + urlForLogin + "\">" + urlForLogin + "<\/a><\/li>" +
            "<li>Login Id :: " + userId + "<\/li>" +
            "<li>Login Password :: T3sting<\/li>" +
            "<li>Product     :: " + product + "<\/li>" +
            "<li>Course Name     :: " + courseName + "<\/li>" +
            "<\/ol><\/div>";
    },

    printTestData: function (data, value) {
        return "<div><ol class=\"testdata\">" +
            "<li>" + data + " :: " + value + "<\/li>" +
            "<\/ol><\/div>";
    },

    printLoginDetails: function (userId) {
        return "<div><ol class=\"testdata\">" +
            "<li class=\"testdatatitle\">Logging in with  <\/li>" +
            "<li>Login Id :: " + userId + "<\/li>" +
            "<li>Login Password :: T3sting<\/li>" +
            "<\/ol><\/div>";
    },

    reportHeader: function () {
        return "<div><ol class=\"list\">";
    },

    reportFooter: function () {
        return "<\/ol><\/div>";
    },

    stepStatusWithData: function (stepName, stepData, status) {
        if (status === "failure") {
            return  "<li class=\"stepfailure\">" + stepName + "    :: " + stepData + "<\/li>";
        }
        return  "<li>" + stepName + "    :: " + stepData + "<\/li>";
    },

    stepStatus: function (stepName, status) {
        if (status === "failure") {
            return  "<li class=\"stepfailure\">" + stepName + "    :: " + status + "<\/li>";
        }
        return  "<li>" + stepName + "    :: " + status + "<\/li>";
    }


};
