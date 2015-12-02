/**
 * Created by nbalasundaram on 10/1/15.
 */
var testData = require("../../../../test_data/data.json");
var wd = require('wd');
var asserters = wd.asserters;
var _ = require('underscore');
var report = require("../reporting/reportgenerator");
module.exports = {
    notesCreation: function (browser, done, description) {
        browser
            .waitForElementByXPath("//button[contains(@class,'sliding-menu-button my-notes-button')]", asserters.isDisplayed, 5000)
            .click()
            .waitForElementByXPath("//nav[contains(@class,'sliding-menu-content is-visible')]", asserters.isDisplayed, 5000)
            .sleep(2000)
            .elementByCssSelectorWhenReady("textarea", 5000)
            .type(description)
            .waitForElementByXPath("//button[contains(text(),'Save')]", 5000)
            .click()
            .sleep(2000)
            .waitForElementByCss(".sliding-menu-content.is-visible .icon-close-x-blue.close-sidebar",asserters.isDisplayed, 5000)
            .click()
            .nodeify(done);
    },
    verifyNoteOnStudyBoard: function (notesValidation, browser, done) {
        browser
            .waitForElementByXPath("//div[contains(@class,'studybit note')]", asserters.isDisplayed, 90000)
            .text()
            .should.eventually.include(testData.notesTerms.noteText)
            .then(function () {

                console.log(report.reportHeader() +
                    report.stepStatusWithData("User Added notes ", testData.notesTerms.noteText + " is successfully saved and displayed on Studyboard", "success") +
                    report.reportFooter());

            })
            .sleep(1000)
            .nodeify(done);
    },

    verifyNoteCount: function(browser, notesCount){
      return browser
          .waitForElementByCss(".sliding-menu-button.my-notes-button .notes-counter", asserters.isDisplayed, 90000)
          .text()
          .should.eventually.include(notesCount)
          .then(function () {

              console.log(report.reportHeader() +
                  report.stepStatusWithData("User Added notes count ",notesCount, "success") +
                  report.reportFooter());

          });

    },
    verifyNotesAvailabilityOnStudyboard: function(browser,notesCount){
      return browser
          .waitForElementByXPath("//div[contains(@class,'studybit note')]", asserters.isDisplayed, 90000).then(function(noteElement){
            if(_.size(noteElement)==notesCount){
              console.log(report.reportHeader() +
                  report.stepStatusWithData("User Added notes count on Studyboard",_.size(noteElement), "success") +
                  report.reportFooter());
            }else{
              console.log(report.reportHeader() +
                  report.stepStatusWithData("User Added notes count on Studyboard",_.size(noteElement), "failure") +
                  report.reportFooter());
            }
          })
    },

    editNoteText: function(browser,editedtext,done){
       browser
          .waitForElementByXPath("//button[contains(@class,'sliding-menu-button my-notes-button')]", asserters.isDisplayed, 50000)
          .click()
          .sleep(2000)
          .waitForElementByXPath("(//a[@class='icon-pencil-blue edit-note ng-scope'])[1]", asserters.isDisplayed, 50000)
          .click()
          .sleep(2000)
          .waitForElementByXPath("(//div[@class='edit-note']//textarea)[1]", asserters.isDisplayed, 50000)
          .clear()
          .waitForElementByXPath("(//div[@class='edit-note']//textarea)[1]", asserters.isDisplayed, 50000)
          .type(editedtext)
          .waitForElementByXPath("//div[@class='edit-note']//form//div//button[contains(text(),'Update')]", asserters.isDisplayed, 50000)
          .click()
          .sleep(2000)
          .waitForElementByCss(".sliding-menu-content.is-visible .icon-close-x-blue.close-sidebar",asserters.isDisplayed, 50000)
          .click()
          .nodeify(done);
    },

    validateEditedNote:function(browser, editedTextByTestData, done){
      browser
         .refresh()
         .sleep(3000)
         .waitForElementByXPath("//button[contains(@class,'sliding-menu-button my-notes-button')]", asserters.isDisplayed, 50000)
         .click()
         .sleep(2000)
         .waitForElementByXPath("(//span[@class='note-text ng-binding'])[1]", asserters.isDisplayed, 50000)
         .text().then(function(editedText){
           if(editedText.indexOf(editedTextByTestData)>-1){
             console.log(report.reportHeader() +
                 report.stepStatusWithData("Edited text of notes panel "+editedText+" is compared with",editedTextByTestData, "success") +
                 report.reportFooter());
             done();
           }else {
             console.log(report.reportHeader() +
                 report.stepStatusWithData("Edited text of notes panel "+editedText+" is compared with",editedTextByTestData, "failure") +
                 report.reportFooter());
             done();
           }
         })
    },

    verifyEditedNoteOnStudyBoard: function (editedNoteText, browser, done) {
        browser
            .sleep(5000)
            .waitForElementByXPath("(//div[contains(@class,'studybit note')])[1]", asserters.isDisplayed, 90000)
            .text().then(function(editedText){
              if(editedText.indexOf(editedNoteText)>-1){
                console.log(report.reportHeader() +
                    report.stepStatusWithData("User Added notes "+ editedText + " on Studyboard is compared with edited text",editedNoteText,"success") +
                    report.reportFooter());
                    done();
              }else{
                console.log(report.reportHeader() +
                    report.stepStatusWithData("User Added notes "+ editedText + " on Studyboard is compared with edited text",editedNoteText,"failure") +
                    report.reportFooter());
                    done();
              }
            });
    }
};
