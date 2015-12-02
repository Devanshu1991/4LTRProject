/**
 * Created by nbalasundaram on 10/1/15.
 */

var productData = require("../../../../test_data/products.json");
var stringutil = require("../../util/stringUtil");

var wd = require('wd');
var asserters = wd.asserters;


module.exports = {


    navigateToAChapter: function (chapter, browser) {

        return browser
            .waitForElementByCss(this.constructChapterTileCss(chapter), asserters.isDisplayed, 90000)
            .click();

    },

    getChapterTitle: function (chapter, browser) {

        return browser
            .waitForElementByCss(this.constructChapterTileCss(chapter), asserters.isDisplayed, 120000)
            .text();

    },

    navigateToATopic: function (chapter, topic, browser) {

        return browser
            .waitForElementByCss(this.constructTopicLinkCss(chapter, topic), asserters.isDisplayed, 90000)
            .click();

    },

    navigateToToc: function (browser) {

        return browser.waitForElementByCss("li[cg-activates-with='reader'] a[ng-if='currentProduct']", asserters.isDisplayed, 90000)
            .click();
    },


    getTopicTitleHero: function (browser) {

        return browser.waitForElementByCss("span.chapter-title h1", asserters.isDisplayed, 90000).text();
    },

    constructChapterTileCss: function (chapterid) {
        var id = chapterid + 1;
        return "ul.chapters.tile li.chapter:nth-child(" + id + ") section h3 a";
    },

    constructTopicLinkCss: function (chapterid, topicid) {
        chapterid = chapterid + 1;
        topicid = topicid + 1;
        return "ul.chapters.tile li.banner:nth-child(1) ul.topics-list li:nth-child(" + topicid + ") a";

    },

    disposeFirstVisitTopicModalIfVisible: function (browser) {
        return browser
            .sleep(5000)
            .execute("setTimeout(function(){if(document.getElementById('highlight-help-modal').getAttribute('class').indexOf('ng-hide') == -1)document.getElementsByClassName('icon-close-x-pink')[0].click();},3000)");

    },
    getChapterTitleonListView: function (chapter, browser, chapterno) {
        return browser
            .waitForElementByCss(this.constructChapterTileCssonListView(chapter, chapterno), asserters.isDisplayed, 120000)
            .text();
    },
    constructChapterTileCssonListView: function (chapterid, chapterno) {
        var id = chapterid + chapterno;
        return "li.chapter:nth-child(" + id + ") section h3 a";
    },
    navigateToAChapterByListView: function (chapter, browser, chapterno) {
        return browser
            .waitForElementByCss(this.constructChapterTileCssonListView(chapter, chapterno), asserters.isDisplayed, 90000)
            .click();

    },

    selectListView: function(browser){
      return browser
          .sleep(3000)
          .waitForElementByCss(".icon-list-gray", asserters.isDisplayed, 60000)
          .click();
    },

    navigateToATopicByListView: function (browser, done, topic, topicno) {
        return browser
            .waitForElementByCss(this.constructTopicLinkCssForListView(topic, topicno), asserters.isDisplayed, 90000)
            .click()
            .sleep(10000)
            .nodeify(done);

    },
    constructTopicLinkCssForListView: function (topicid, topicno) {
        topicid = topicid + topicno;
        return ".chapter.ng-scope.selected ul[class='topics-list'] li:nth-child(" + topicid + ") a";

    },
    clickonlistview: function (browser, done) {
        browser
            .waitForElementByCss('.icon-list-gray', asserters.isDisplayed, 3000).then(function (listview) {
                listview.click();
                done();
            });

    }

};
