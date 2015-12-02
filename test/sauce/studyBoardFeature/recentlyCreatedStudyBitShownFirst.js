/**
 * Created by swatisabharwal on 7/23/2014.
 */

require('colors');
var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/login");
var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData =  require("../../../test_data/qa.json");
var testData =  require("../../../test_data/data.json");
var clearAllSavedContent = require("../support/pages/clearData");


describe('4LTR (' + 'Automation' + ') :: recentlyCreatedStudyBitShownFirst has started', function() {
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

	it("3. Navigate to Studyboard ", function(done) {
	browser
		.sleep(3000)
		.execute("setTimeout(function(){if(document.getElementById('welcome-modal').getAttribute('class').indexOf('ng-hide') == -1)document.getElementsByTagName('button')[0].click();},3000)")
	    .sleep(5000);
		studyBitCreation.navigateToStudyBoard(browser, done);
	});
	
	it("4. Clear all studybits", function(done) {
	clearAllSavedContent.clearStudyboard(browser,done);
	    
	});
	
	it("5. Navigate to Clear all studybits", function(done) {
	clearAllSavedContent.clearStudyboard(browser,done);
	    
	});
	
	it("6. Navigate to Home", function(done) {
	browser
	    .elementByCssSelectorWhenReady(".icon-home-blue", 10000)
		.click()
	    .nodeify(done);
	});
	
	it("7. Click on a Chapter on the tile view ", function(done) {
	browser
		//.elementByCssSelectorWhenReady(".welcome-modal>button")
		//.click()
		.elementByXPathSelectorWhenReady("//a[contains(.,'Overview')]", 10000)
		.click()
		.nodeify(done);
	});
	
	it("8. Click on the first topic link", function(done) {
	browser
		.elementByCssSelectorWhenReady("li[class='banner ng-scope']>div>ul>li:nth-child(2) span", 10000)
		.click()
		.sleep(3000)
		.execute("setTimeout(function(){if(document.getElementById('highlight-help-modal').getAttribute('class').indexOf('ng-hide') == -1)document.getElementsByClassName('icon-close-x-pink')[0].click();},3000)")
        .sleep(2000)
		.nodeify(done);
	});

	it("9. Create a Saved bit", function(done) {
	studyBitCreation.studyBitCreation(browser, done);
	});

	it("10.NAvigate to next page", function(done) {
	browser
		.execute("document.getElementsByClassName('icon-right-arrow-white')[0].getElementsByTagName('a')[0].click()")
		.elementByXPathSelectorWhenReady("//span[contains(.,'MARKETING MANAGEMENT PHILOSOPHIES')]", 10000)
		.isDisplayed()
		.should.become(true)
		.nodeify(done);
	});

	it("11. Create 2 StudyBits", function(done) {
	studyBitCreation.createStudyBitWithFullDetails(browser, done);
	});

	it("12. NAvigate to StudyBOard  ", function(done) {
	studyBitCreation.navigateToStudyBoard(browser, done);
	});

	

	it("13. Verify latest created studybit is displayed first", function(done) {
	browser
	    .sleep(2000)
		.elementByXPathSelectorWhenReady("(//div[@class='overlay'])[1]", 5000)
		.click()
	    .sleep(2000) 
	    .elementByXPathSelectorWhenReady("//li[@class='banner']//strong[contains(.,'Four competing philosophies')]", 5000)
		.text()
		.should.eventually.include("Four competing philosophies strongly influence an organization’s marketing processes.")
		.sleep(3000)
		.nodeify(done);		
	});

	it("14. Clear all studybits", function(done) {
	clearAllSavedContent.clearStudyboard(browser,done);
	    
	});	

});
