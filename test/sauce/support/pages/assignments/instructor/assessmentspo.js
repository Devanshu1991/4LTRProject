/**
 * Created by nbalasundaram on 10/3/15.
 */

var wd = require('wd');
var asserters = wd.asserters;
var testData = require("../../../../../../test_data/assignments/assessments.json");
var courseHelper = require("../../../../support/helpers/courseHelper");
var servicepo = require("./servicepo");
var report = require("../../../reporting/reportgenerator");

var request = require('supertest')(servicepo.getAssignmentURL());
var util = require('util');
var _ = require('underscore');
var olr = require("../../olr");
var loginPage = require("../../loginpo");
var Q = require('q');

var data = {
    name: "Robo Assessment"
};

var temp1;
var temp2;
var temp3;

module.exports = {

    getAssignmentName: function () {

        return data.name;
    },

    getAssignmentPoints: function () {
        return testData.systemgenerated.scorestrategyhigh.score;
    },

    getMaxAssignmentQuestions: function () {
        return testData.systemgenerated.scorestrategyhigh.questions;
    },

    getRoboPointScore: function (correctanswers) {
        var systempoints = (correctanswers / this.getMaxAssignmentQuestions()) * this.getAssignmentPoints();
        return systempoints.toString();
    },

    enterName: function (browser) {

        var attempts;

        if (testData.systemgenerated.scorestrategyhigh.attempts === "0")
            attempts = "U";

        data.name = testData.systemgenerated.scorestrategyhigh.name +
            "-" +
            attempts +
            "-" +
            testData.systemgenerated.scorestrategyhigh.score + " RANDOM NO " + Math.floor((Math.random() * 1000) + 1);

        return browser
            .waitForElementByXPath("//div[@class='text-input']//input[@id='assessment-name'and @type='text']", asserters.isDisplayed, 60000)
            .type(data.name);


    },

    enterRevealDate: function (browser) {

        return browser
            .sleep(1000)
            .waitForElementByXPath("(//div[contains(@class,'datefield ng-binding')])[2]", asserters.isDisplayed, 60000)
            .click()
            .waitForElementByCss("div[class='datepicker cg-calendar ng-isolate-scope'] .day.ng-scope.today", asserters.isDisplayed, 60000)
            .click();

    },

    enterRevealDateNextMonth: function (browser) {

        return browser
            .waitForElementByXPath("(//div[contains(@class,'datefield ng-binding')])[2]", asserters.isDisplayed, 60000)
            .click()
            .waitForElementByXPath("//div[@class='span-half']//cg-date-picker[@label-text='Reveal in Student Calendar']//div[@class='next']", asserters.isDisplayed, 10000)
            .click()
            .sleep(5000)
            .waitForElementByXPath("(//div[@class='span-half']//cg-date-picker[@label-text='Reveal in Student Calendar']//div[@class='week ng-scope'])[1]//div//span[contains(text(),'1')]", asserters.isDisplayed, 10000)
            .click();
    },

    selectChapter: function (browser, chapter) {
        return  browser
            .sleep(2000)
            .waitForElementByXPath("//div[contains(@class,'chapter-toggle ng-scope')]", asserters.isDisplayed, 60000)
            .click()
            .waitForElementByXPath("(//div[contains(@class,'full-width ng-scope')])[" + chapter + "]//span", asserters.isDisplayed, 60000)
            .click()
            .sleep(2000)
            .waitForElementByXPath("//div[contains(@class,'chapter-toggle ng-scope')]", asserters.isDisplayed, 60000)
            .click();

    },

    enterQuestionsPerStudent: function (browser, countOfQuestions) {

        return browser
            .waitForElementByXPath("//input[@id='ques-per-student']", asserters.isDisplayed, 60000)
            .clear()
            .type(countOfQuestions);

    },

    enterScore: function (browser, score) {

        return browser
            .waitForElementByCss("#highest-possible", asserters.isDisplayed, 60000)
            .clear()
            .type(score);

    },

    selectAttempts: function (browser, attempts) {

        return browser
            .waitForElementByCss("select[name='attempts'] option[value='" + attempts + "']", asserters.isDisplayed, 60000)
            .click();
    },


    selectScoreStrategy: function (browser, scoreStrategy) {

        return browser
            .waitForElementByCss("div.score-type-radio label[for='" + scoreStrategy + "']", asserters.isDisplayed, 60000)
            .click();

    },

    selectDropLowestScore: function(browser){
     return browser
        .waitForElementByXPath("//label[contains(.,'Drop Lowest Score')]",asserters.isDisplayed, 60000)
        .click();
    },

    saveAssignment: function (browser) {
        return browser
          .sleep(1000)
          .execute("document.getElementsByClassName('done ng-scope')[0].click()");
    },


    checkIfAssignmentSaved: function (browser) {
        return browser
            .sleep(courseHelper.getCourseTimeOut())
            .waitForElementByXPath("(//div[contains(@class,'cg-calendar ng-isolate-scope')]//div[contains(@class,'day ng-scope today')])[1]/div[contains(@class,'event ng-scope')][last()]", asserters.isDisplayed, 60000)
            .execute("return window.getComputedStyle(document.evaluate(\"(//div[contains(@class,'cg-calendar ng-isolate-scope')]//div[contains(@class,'day ng-scope today')])[1]/div[contains(@class,'event ng-scope')]/span[contains(.,'" + this.getAssignmentName() + "')]\", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue.parentNode).getPropertyValue('background-color');");
    },


    checkIfAssignmentSavedOnFutureDate: function (browser) {
        return browser
            .sleep(courseHelper.getCourseTimeOut())
            .waitForElementByXPath("//div[@class='day ng-scope']/span[@bo-text='day.number' and (text()='1')]//following-sibling::div[contains(@class,'event')]", asserters.isDisplayed, 60000)
            .execute("return window.getComputedStyle(document.evaluate(\"//div[contains(@class,'day ng-scope')]/span[@bo-text='day.number' and (text()='1')]//following-sibling::div[contains(@class,'event ng-scope')]/span[contains(.,'" + this.getAssignmentName() + "')]\", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue.parentNode).getPropertyValue('background-color');");
    },


    deleteAssignment: function (browser, done) {
        var token = olr.getToken(loginPage.getUserId());

        browser.url().
            then(function (url) {

                var courseCGI = url.substring(url.toString().indexOf("products") + 9, url.toString().indexOf("assignment") - 1);
//                console.log("CourseCGI "+courseCGI);
//                console.log("UserId "+loginPage.getUserId());

                request.get('/assignments/?productId=' + courseCGI)
                    .set('Accept', 'application/json')
                    .set('cengage-sso-guid', token)
                    .set('cengage-sso-role', 'instructor')
                    .expect(200)
                    .then(function (res) {
                        var assignments = res.body;
                        var deferred = Q.defer();
                        _.each(assignments, function (assignment) {

                            console.log("Asssignment id " + assignment.id);
                            var deferred = Q.defer();
                            request.delete('/assignments/' + assignment.id)
                                .set('cengage-sso-guid', token)
                                .expect(204)
                                .then(function (res) {

                                    deferred.resolve();
                                    return deferred;
                                });

                        });
                        deferred.resolve();
                        browser.refresh().sleep(5000).nodeify(done);


                    });

            });
    },

    deleteAssignmentFromBrowser: function (browser, done) {

        var currentdate = util.getCurrentDate();

        if (currentdate > 13) {
            browser
                .execute("window.scrollTo(0,1000)");
        }
        browser
            .execute("return document.getElementsByClassName('day ng-scope today selected')[0].getElementsByClassName('event ng-scope').length")
            .then(function (length) {
                //Deletion of assignments will only be attempted if there are any assignments to be deleted in current date
                if (length !== 0) {

                    browser.execute("return document.getElementsByClassName('day ng-scope today selected')[0].getElementsByClassName('toggle collapsed ng-scope').length").then(function (length) {
                        //If there are more than 2 assignments then all of the assignments will be expanded
                        if (length === 0) {

                            browser
                                .waitForElementByXPath("(//div[contains(@class,'day ng-scope today')]/div[contains(@class,'event ng-scope')])[last()]", asserters.isDisplayed, 3000)
                                .click()
                                .sleep(2000)
                                .waitForElementByCss(".delete.ng-scope", asserters.isDisplayed, 60000)
                                .click()
                                .sleep(5000)
                                .elementByXPathSelectorWhenReady("(//button[contains(@class,'save ng-binding')])[2]", 5000)
                                .click()
                                .sleep(10000)
                                .then(function () {
                                    done();
                                });

                        } else {
                            browser
                                .sleep(2000)
                                .elementByCssSelectorWhenReady(".day.ng-scope.today .toggle.collapsed.ng-scope", 3000)
                                .click()
                                .sleep(2000)
                                .waitForElementByXPath("(//div[contains(@class,'day ng-scope today')]/div[contains(@class,'event ng-scope')])[last()]", asserters.isDisplayed, 3000)
                                .click()
                                .waitForElementByCss(".delete.ng-scope", asserters.isDisplayed, 60000)
                                .click()
                                .sleep(5000)
                                .waitForElementByXPath("(//button[contains(@class,'save ng-binding')])[2]", asserters.isDisplayed, 60000)
                                .click()
                                .sleep(10000)
                                .then(function () {
                                    done();
                                });

                        }
                    });
                } else {
                    console.log("There is nothing to delete");
                    done();
                }

            });


    },
    selectAnExistingAssignmentInCurrentDate: function (browser) {
        return browser
            .waitForElementByXPath("(//div[contains(@class,'day ng-scope today')]/div[contains(@class,'event ng-scope')])[last()]", asserters.isDisplayed, 3000)
            .click()
            .sleep(10000);


    },

    verifyAssessmentAttemptsAfterSort: function (browser, attempts) {
        return browser
            .waitForElementByXPath("(//span[@class='ui-grid-invisible ui-grid-icon-blank'])[5]", asserters.isDisplayed, 10000)
            .click()
            .waitForElementByXPath("((//div[contains(@class,'ui-grid-viewport ng-isolate-scope')]//div[contains(@class,'ui-grid-row ng-scope')])[1]//div[contains(@class,'ui-grid-cell')]//div)[5]", asserters.isDisplayed, 10000)
            .text()
            .should.eventually.include(attempts);
    },

    selectQuestionStrategy: function(browser,QuestionStrategy){
      return browser
        .waitForElementByXPath("//button[contains(@class,'span-half')and contains(.,'"+QuestionStrategy+"')]", asserters.isDisplayed, 10000)
        .click();
    },

    validateDueAndRevealDateText: function(browser,dueRevealDateValue){
      return browser
          .waitForElementByXPath("//cg-date-picker[@label-text='Due Date']//div[contains(@class,'datefield')]", asserters.isDisplayed, 10000)
          .text().should.eventually.include(dueRevealDateValue).then(function(){
            browser
              .waitForElementByXPath("(//cg-date-picker[contains(@label-text,'Reveal')])[1]//div[contains(@class,'datefield')]", asserters.isDisplayed, 10000)
              .text().should.eventually.include(dueRevealDateValue);
          });
    },

    validateQuestionPerStudentDefaultSelection: function(browser){
      return browser
        .elementByCssSelectorIfExists("#select-type").getAttribute('name').then(function(status){
          if(status==="true"){
            console.log(report.reportHeader() +
            report.stepStatusWithData("\"All Selected Below\" option is selected by default","success") +
            report.reportFooter());
          }
          else{
            console.log(report.reportHeader() +
            report.stepStatusWithData("All Selected Below” option is selected by default","failure") +
            report.reportFooter());
          }
        });
    },

    expandTheFilterPanel: function(browser){
      return browser
            .waitForElementByCss(".filter-section.full-width>a", asserters.isDisplayed, 60000)
            .click();
    },


    getFilterOptions: function(browser, filterText){
      return browser
        .sleep(2000)
        .elementsByXPath("//div[contains(@class,'filter-column') and contains(.,'"+filterText+"')]//ul//li//label")
        .then(function(parameters){
          //console.log("Sub Filters under "+filterText+" are as follows:")
            parameters[0].text().then(function(value){
              temp1 = value;
              //console.log("temp1"+temp1);
            });
            parameters[1].text().then(function(value){
              temp2 = value;
              //console.log("temp2"+temp2);
            });
            parameters[2].text().then(function(value){
              temp3 = value;
              //console.log("temp3"+temp3);
              console.log(report.reportHeader() +
              report.stepStatusWithData("Sub Filters under "+filterText+" are:: "+temp1+", "+temp2+" and "+temp3,"success") +
              report.reportFooter());
            });
        });
    },

    reportAllConcept:function(browser,chapter,done){
      var counter=0;
      return browser
        .sleep(2000)
        .elementsByCssSelector(".chapter-options .cg-checkbox label")
        .then(function(parameters){
            //console.log("Concepts under Chapter "+chapter+" are as follows:");
            //console.log("********************"+_.size(parameters));
              function printConceptsText(){
                if(counter<_.size(parameters)){
                  console.log("1 Concept::"+  parameters[counter].text());
                  counter++;
                  printConceptsText();
                }
                else{
                  done();
                }
              }
        });
    },

    retrieveFilterType:function(browser){
    return browser
        .waitForElementByXPath("(//a[@class='show-all-toggle ng-scope'])[1]",asserters.isDisplayed, 60000)
        .click()
        .waitForElementByXPath("(//div[contains(@class,'filter-column') and contains(.,'Type')]//ul//li//label)[1]",asserters.isDisplayed, 60000)
          .text();
    },

    retrieveBloomType:function(browser){
      return browser
      .waitForElementByXPath("(//a[@class='show-all-toggle ng-scope'])[2]",asserters.isDisplayed, 60000)
      .click()
      .waitForElementByXPath("(//div[contains(@class,'filter-column') and contains(.,'Bloom')]//ul//li//label)[1]",asserters.isDisplayed, 60000)
      .text();
    },

    retrieveDifficultyType:function(browser){
      return browser
        .waitForElementByXPath("(//a[@class='show-all-toggle ng-scope'])[3]",asserters.isDisplayed, 60000)
        .click()
        .waitForElementByXPath("(//div[contains(@class,'filter-column') and contains(.,'Difficulty')]//ul//li//label)[1]",asserters.isDisplayed, 60000)
        .text();
    }

};
