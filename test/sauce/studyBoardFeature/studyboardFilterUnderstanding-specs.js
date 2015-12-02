require('colors');


require('colors');
var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/login");
var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData =  require("../../../test_data/qa.json");
var testData =  require("../../../test_data/data.json");
var clearAllSavedContent = require("../support/pages/clearData");


describe('4LTR (' + 'Student' + ') :: studyboardFilterUnderstanding-specs Started', function() {
	var browser;
	var allPassed = true;
    var userType;
    var product;

	before(function(done) {
		browser = session.create(done);
	    userType= testData.termsAssociatedWithStudentUser[5];
        product= testData.termsAssociatedWithStudentUser[6];
	});

	afterEach(function(done) {
		allPassed = allPassed && (this.currentTest.state === 'passed');
		done();
	});

	after(function(done) {
		session.close(allPassed, done);
	});

	it("1. Log in as Student",function(done){
        loginPage.loginToApplication(userType,browser,done);
	  });
	  
	 it("2. Select a Product",function(done){
	 	loginPage.selectAProduct(userType,product,browser,done);
	 });

	it("3. Click on a Chapter on the tile view ", function(done) {
		browser
			.elementByXPathSelectorWhenReady("//a[contains(.,'Overview')]", 10000)
			.click()
			.nodeify(done);
	});
	
	it("4. Click on the first topic link", function(done) {
		browser
			.elementByCssSelectorWhenReady("li[class='banner ng-scope']>div>ul>li:nth-child(2) span", 10000)
			.click()
			.execute("setTimeout(function(){if(document.getElementById('highlight-help-modal').getAttribute('class').indexOf('ng-hide') == -1)document.getElementsByClassName('icon-close-x-pink')[0].click();},3000)")
			.nodeify(done);
	});

	it("5. Create first studybit", function(done) {
		studyBitCreation.studyBitCreation(browser, done);
	});

	it("6. NAvigate to next page", function(done) {
		browser
			.execute("document.getElementsByClassName('icon-right-arrow-white')[0].getElementsByTagName('a')[0].click()")
			.elementByXPathSelectorWhenReady("//span[contains(.,'MARKETING MANAGEMENT PHILOSOPHIES')]", 10000)
			.isDisplayed()
			.should.become(true)
			.nodeify(done);
	});

	it("7. Create second studybit", function(done) {
		studyBitCreation.createStudyBitWithFullDetails(browser, done);
	});

	it("8. Click on the StudyBoard ", function(done) {
		browser
			.elementByXPathSelectorWhenReady("//div[@class='icon-studyboard-blue']", 10000)
			.click()
			.elementByXPathSelectorWhenReady("//a[contains(.,'StudyBits')]", 5000)
			.isDisplayed()
			.should.become(true)
			.nodeify(done);
	});

	it("9. Click on the Filter link and verify filter panel", function(done) {
		browser
			.elementByCssSelectorWhenReady(".filter-button.ng-binding", 2000)
			.click()
			.elementByCssSelectorWhenReady(".filters", 2000)
			.isDisplayed()
			.should.become(true)
			.nodeify(done);
	});

	it("10. Verify the display of Filter types", function(done) {
		browser
			.elementByCssSelectorWhenReady(".filter.by-comprehension h6", 10000)
			.text()
			.should.eventually.include("My Understanding")
			.nodeify(done);
	});

	it("11. Verify the display of Unassigned Comprehension value", function(done) {
		browser
			.elementByCssSelectorWhenReady("div[label-text='studyboard.show.filters.comprehension.unassigned'] label", 10000)
			.text()
			.should.eventually.include('Unassigned')
			.nodeify(done);
	});

	it("12. Verify the default state of Unassigned Comprehension value", function(done) {
		browser
			.elementByCssSelectorWhenReady("div[label-text$='unassigned'] input", 5000)
			.isSelected()
			.should.become(true)
			.nodeify(done);
	});

	it("13. Verify the non display of Unassigned StudyBits by unchecking the Unassigned Comprehension values", function(done) {
		browser
			.elementByCssSelectorWhenReady("div[label-text='studyboard.show.filters.comprehension.unassigned']", 5000)
			.click()
			.isSelected()
			.should.eventually.become(false)
			.nodeify(done);
	});

	it("14. Accept alert always", function(done) {
		browser
			.execute("location.reload()").sleep(6000)
			.execute('window.oldConfirm = window.confirm;' + 'window.confirm = function() { return true; };')
			.nodeify(done);
	});

	it("15. Deleting All studybits", function(done) {
		browser
			.execute("for(i=0;i<(document.getElementsByClassName('icon-trash-gray').length);i++){document.getElementsByClassName('icon-trash-gray')[i].click()}")
			.nodeify(done);

	});
});
