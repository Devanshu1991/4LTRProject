var wd = require('wd');
module.exports = {
    studyBitCreation: function (browser, done) {
        browser
            .sleep(5000)
            .elementByXPathSelectorWhenReady("//h1[contains(.,'WHAT IS MARKETING?')]", 10000)
            .isDisplayed()
            .should.become(true)
            .execute("window.scrollTo(1000,1000)")
            .elementByXPathSelectorWhenReady("//p[@id='ANHUYU690980482']/span[1]")
            .click()
            .elementByXPathSelectorWhenReady("//p[@id='ANHUYU690980482']/span[2]")
            .click()
            .sleep(5000)
            .elementByCssSelectorWhenReady(".studybit-menu.text.unassigned.editing", 10000)
            .isDisplayed()
            .should.become(true)
            .sleep(5000)
            .elementByXPathSelectorWhenReady("//div[contains(@class,'studybit-menu text unassigned editing')]//div[@class='actions']/button[contains(@class,'save')]", 10000)
            .click()
            .elementByXPathSelectorWhenReady("(//div[contains(@class,'studybit-icon text unassigned saved')])[1]", 10000)
            .isDisplayed()
            .should.become(true)
            .nodeify(done);
    },

    createStudyBitWithFullDetails: function (browser, done) {
        browser
            .sleep(2000)
            .elementByCssSelectorWhenReady(".cl-atom>strong", 5000)
            .click()
            .sleep(8000)
            .elementByCssSelectorWhenReady(".studybit-menu.text.unassigned.editing", 10000)
            .isDisplayed()
            .should.become(true)
            .elementByCssSelectorWhenReady(".notes.ng-pristine.ng-valid", 5000)
            .type("StudyBit created by Automation Scripts for StudyBoard Filters")
            .elementByXPathSelectorWhenReady("//cg-comprehension-field//button[contains(text(),'FAIR')]", 5000)
            .click()
            .elementByCssSelectorWhenReady(".input.ng-pristine.ng-valid", 5000)
            .type("MyTagByAutomation")
            .type(wd.SPECIAL_KEYS.Enter)
            .execute("document.getElementsByClassName('save ng-scope')[0].click()")
            .elementByXPathSelectorWhenReady("(//div[contains(@class,'studybit-icon text fair saved')])[1]", 5000)
            .isDisplayed()
            .should.become(true)
            .nodeify(done);
    },

    navigateToStudyBoard: function (browser, done) {
        browser
            .elementByXPathSelectorWhenReady("//div[@class='icon-studyboard-blue']", 10000)
            .click()
            .elementByXPathSelectorWhenReady("//h1[contains(.,'StudyBoard')]", 10000)
            .isDisplayed()
            .should.become(true)
            .nodeify(done);
    }


};
