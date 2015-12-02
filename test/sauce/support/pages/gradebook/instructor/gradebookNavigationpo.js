var wd = require('wd');
var asserters = wd.asserters;
module.exports = {

    navigateToStudentDetailedPageOnGradebook: function (browser, username) {
        return browser
            .waitForElementByXPath("//a[contains(text(),\"" + username + "\")]", asserters.isDisplayed, 60000)
            .click()
            .waitForElementByXPath("//h2[contains(text(),\"" + username + "\")]", asserters.isDisplayed, 60000);
    },

    navigateToGradebookViewFromStudentDetailedPage: function(browser){
      return browser
          .waitForElementByCss(".back-button.ng-scope", asserters.isDisplayed, 60000)
          .click()
    },

    clickOnCreatedAssessment : function(browser, assessmentname){
      return browser
          .waitForElementByXPath("//div[contains(@class,'ui-grid-render-container-body')]//div[contains(@class,'ui-grid-header-canvas')]//div[contains(@class,'ui-grid-header-cell-wrapper')]//span[contains(text(),'"+assessmentname+"')]", asserters.isDisplayed, 60000)
          .click()
    }
};
