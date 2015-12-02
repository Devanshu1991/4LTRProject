/**
 * Created by nbalasundaram on 10/3/15.
 */
var wd = require('wd');
var testData = require("../../../../test_data/data.json");

module.exports = {

    selectProduct: function (product, browser, done) {

        if (product === "MKTG9") {
            browser
                .sleep(1000)
                .elementByCssSelectorWhenReady("#productISBN option[value='" + testData.products.isbn.MKTG9 + "']", 20000)
                .click()
                .nodeify(done);
        }
        else {
            browser
                .sleep(1000)
                .elementByCssSelectorWhenReady("#productISBN option[value='" + testData.products.isbn.PSYCH4 + "']", 20000)
                .click()
                .nodeify(done);

        }

    },

    registerCourse: function (browser, coursekey) {

        browser
            .elementByCssSelectorWhenReady("#registerAccessCode", 3000)
            .click()
            .type(coursekey)
            .elementByCssSelectorWhenReady(".viewDetailsBtn.register_button", 4000)
            .click()
            .sleep(4000)
            .elementByCssSelectorWhenReady(".small_green_button", 4000)
            .click()
            .sleep(10000)
            .nodeify(done);
    }


};