require('colors');
var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/login");
var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData =  require("../../../test_data/qa.json");
var testData =  require("../../../test_data/data.json");
var flashcardCreation = require("../support/pages/createFlashcards");
var clearAllSavedContent = require("../support/pages/clearData");



describe('4LTR (' + 'Automation' + ') :: generateFlashcardDecksBasedOnFilterSet ', function() {
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
	
	it("3. Navigate to StudyBOard  ", function(done) {
		studyBitCreation.navigateToStudyBoard(browser, done);
	});

	it("4. Click on Flashcard tab", function(done) {
	flashcardCreation.SelectFlashcardTab(browser, done);
	});
    
    
    	it("5. CLick on filter tab ", function(done) {
	browser
		.sleep(8000)
	  	//.execute("window.scrollTo(0,0)")
	  	.elementByXPathSelectorWhenReady("//a[contains(.,'FILTER')]", 10000)
	  	.click()
	  	.elementByXPathSelectorWhenReady("//div[contains(@class,'filters with-keyterm-filter')]", 10000)
	 	.isDisplayed()
	  	.should.become(true)
	  	.nodeify(done);
	});
	 
	it("6. Click on My Flashcards tab ", function(done) {
	browser
	  	.elementByXPathSelectorWhenReady("//li[@class='ng-binding' and contains(text(),'My Flashcards')]", 10000)
	  	.click()
	  	.sleep(3000)
	  	.nodeify(done);
	});


	it("7.  Delete all Flashcards",function(done){
		clearAllSavedContent.clearStudyboard(browser, done);
	});
	it("8. Refresh flashcard page", function(done) {
	browser
		.execute("location.reload()")
		.sleep(5000)
		.execute("window.scrollTo(0,0)")		
		.nodeify(done);
	});
	
	it("8. Create 1st Flash Card", function(done) {
		flashcardCreation.createFlashcardWithFullDetails(browser, done);
	});
	
	
    	it("9. Refresh the flashcard page ", function(done) {
	browser
	 	.execute("location.reload()")
	 	.nodeify(done);
	});
	
	it("10. Create 2nd Flashcard", function(done) {
		flashcardCreation.createFlashcardWithFullDetails(browser, done);
	});
	
    	it("11. Refresh the flashcard page ", function(done) {
	browser
	 	.sleep(3000)
	 	.execute("location.reload()")
	 	.nodeify(done);
	});
	
	it("12. Click on the Filter link and verify filter panel", function(done) {
	browser
		.sleep(3000)
		.execute("window.scrollTo(0,0)")
		.sleep(3000)
		.elementByCssSelectorWhenReady(".filter-button.ng-binding", 2000)
		.click()
		.sleep(3000)
		.elementByCssSelectorWhenReady(".filters", 2000)
		.isDisplayed()
		.should.become(true)
		.nodeify(done);
	});
	

	it("13. Clear all the Filters", function(done) {
	browser
		.sleep(3000)
		.elementByCssSelectorWhenReady(".clear-all-filters.ng-scope", 5000)
		.click()
		.nodeify(done);
	});

	it("14. Select Chapter label", function(done) {
	browser
		.sleep(3000)
		.elementByXPathSelectorWhenReady("//li[contains(@ng-repeat,'chapter in filters')]//label[(contains(text(),'Chapter 1'))]", 5000)
		.click()
		.nodeify(done);
	});


	it("15. Enter tag to Tag Filters", function(done) {
	browser
		.sleep(3000)
		.elementByCssSelectorWhenReady("input[type='text']", 7000)
		.click()
		.type("TagFor")
		.sleep(3000)
		.type("FlashcardByAutomation")
		.elementByXPathSelectorWhenReady("//ul[@class='suggestion-list']//li", 7000)
		.sleep(2000)
		.click()
		.nodeify(done);
	});


	it("16. Enter the type to filter", function(done) {
	browser
		.sleep(3000)
		.elementByXPathSelectorWhenReady("//label[contains(text(),'Text')]", 5000)
		.click()
		.nodeify(done);
	});


	it("17. Enter the 'My Understanding' to filter", function(done) {
	browser
		.sleep(3000)
		.elementByXPathSelectorWhenReady("//label[contains(text(),'Weak')]", 5000)
		.click()
		.nodeify(done);
	});

	
	it("18. Create Deck on filtered Flashcards by clicking Review Deck and verify the display",function(done){
	browser
		.sleep(5000)
		.elementByXPathSelectorWhenReady("//button[contains(.,'REVIEW DECK')]", 50000)
		.click()
		.sleep(1000)
		.elementByXPathSelectorWhenReady("//article[@class='flashcard front']", 10000)
		.isDisplayed()
		.should.become(true)
		.nodeify(done);
	});
	
	it("19. Check next/back button", function(done) {
	browser
		.elementByXPathSelectorWhenReady("//button[contains(.,'Next')]", 10000)
		.click()
		.sleep(2000)
		.elementByXPathSelectorWhenReady("//span[contains(@class,'card-counter')]", 20000)
		.text()
		.should.eventually.include('2')
		.sleep(5000)
		.elementByXPathSelectorWhenReady("//button[contains(.,'Previous')]", 10000)
		.click()
		.sleep(3000)
		.elementByXPathSelectorWhenReady("//span[contains(@class,'card-counter')]", 20000)
		.text().should.eventually.include('1')
		.nodeify(done);
	});
	

	it("20. Exit from Flashcard Review by clicking on exit button", function(done) {
	browser
		.elementByXPathSelectorWhenReady("//a[contains(.,'EXIT')]", 50000)
		.click()
		.nodeify(done);
	});
	
	
	it("21. CLick on filter tab ", function(done) {
	browser
	 	.sleep(8000)
	  	//.execute("window.scrollTo(0,0)")
	  	.elementByXPathSelectorWhenReady("//a[contains(.,'FILTER')]", 10000)
	  	.click()
	  	.elementByXPathSelectorWhenReady("//div[contains(@class,'filters with-keyterm-filter')]", 10000)
	  	.isDisplayed()
	  	.should.become(true)
	  	.nodeify(done);
	 });
	 
	 
	 it("22. Click on My Flashcards tab ", function(done) {
	 browser
	  	.elementByXPathSelectorWhenReady("//li[@class='ng-binding' and contains(text(),'My Flashcards')]", 10000)
	  	.click()
	  	.sleep(3000)
	  	.nodeify(done);
	 });
		

	it("23. Delete All flashcards", function(done) {
		clearAllSavedContent.clearStudyboard(browser, done);
	});
});
	
