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



//console.log("Desired Environment variable values :: \n"+process.env.DESIRED);

describe('4LTR (' + 'Student' + ') :: retakeReviewOfDeckFromFlashcardResultPage Started', function() {
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
	 
	 
	

	it("3. NAvigate to StudyBOard  ", function(done) {
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

	// it("7. Start deleting Flashcards",function(done){
	// browser
		// .execute('window.oldConfirm = window.confirm;' + 'window.confirm = function() { return true; };')
		// .execute("for(i=0;i<(document.getElementsByClassName('icon-trash-gray').length);i++){document.getElementsByClassName('icon-trash-gray')[i].click()}")
		// .nodeify(done);
	// });
	
	it("9. Create 1st Flash Card", function(done) {
		flashcardCreation.createFlashcard(browser, done);
	});
	
    	it("10. Refresh flashcard page", function(done) {
	browser
		.execute("location.reload()")
		.sleep(5000)
		.execute("window.scrollTo(0,0)")		
		.nodeify(done);
	});

	it("11. Create 2nd Flashcard", function(done) {
		flashcardCreation.createFlashcardWithFullDetails(browser, done);
	});
	it("12. Refresh the flashcard page ", function(done) {
	browser
	 	.sleep(3000)
	 	.execute("location.reload()")
	 	.nodeify(done);
	});
	
	it("13. CLick on filter tab ", function(done) {
 	browser
  		.sleep(8000)
  		.execute("window.scrollTo(0,0)")
  		.elementByXPathSelectorWhenReady("//a[contains(.,'FILTER')]", 10000)
  		.click()
  		.elementByXPathSelectorWhenReady("//div[contains(@class,'filters with-keyterm-filter')]", 10000)
  		.isDisplayed()
  		.should.become(true)
  		.nodeify(done);
 	});
 
 	it("14. Click on My Flashcards tab ", function(done) {
 	browser
  		.elementByXPathSelectorWhenReady("//li[@class='ng-binding' and contains(text(),'My Flashcards')]", 10000)
  		.click()
  		.sleep(3000)
  		.nodeify(done);
 	});

	it("15. Click on Flashcard Review button and verify the display", function(done) {
	browser
	    	.sleep(3000)
		.elementByXPathSelectorWhenReady("//button[contains(.,'REVIEW DECK')]", 50000)
		.click()
		.sleep(1000)
		.elementByXPathSelectorWhenReady("//article[@class='flashcard front']", 10000)
		.isDisplayed().should.become(true)
		.nodeify(done);
	});

	
	it("16. Clicking on next button", function(done) {
	browser
		.elementByXPathSelectorWhenReady("//button[contains(.,'Next')]", 50000)
		.click()
		.sleep(1000)
		.nodeify(done);
	});

	// it("10. Click on Review again",function(done){
	// browser	
		// .elementByXPathSelectorWhenReady("//button[contains(text(),'REVIEW AGAIN')]",5000)
		// .click()
		// .nodeify(done);
	// });
	
	it("17. Change understanding level and navigate to result page",function(done){
	browser
		.elementByCssSelectorWhenReady(".flashcard-nav button[class='ng-scope ng-binding']:nth-child(2)",5000)
		.click()
		.sleep(2000)
		.elementByXPathSelectorWhenReady("//button[contains(.,'Next')]", 50000)
		.click()
		.sleep(1000)
		// .execute("var val= document.getElementsByClassName('card-counter ng-scope')[0].getAttribute('translate-value-total');if(!(document.getElementsByClassName('next')[0].hidden)){for(i=0;i<val;i++)document.getElementsByClassName('next')[0].click()}")
		.nodeify(done);
	});
	
	it("18.Deselect the unassigned flashcard", function(done) {
	browser
		.sleep(3000)
		.elementByXPathSelectorWhenReady("//label[contains(.,'weak')]", 50000)
		.click()
		.nodeify(done);
	});
	it("19. Click on review selected button", function(done) {
	browser
		.sleep(3000)
		.elementByXPathSelectorWhenReady("//button[contains(.,'REVIEW SELECTED')]", 50000)
		.click()
		.sleep(2000)
		.nodeify(done);
	});
	it("20. Verify the fair flashcards", function(done) {
	browser	
		.sleep(3000)
		.elementByCssSelectorWhenReady(".ng-scope.fair>span", 50000)
		.text()
		.should.eventually.include("1")
		.sleep(2000)
		.nodeify(done);
	});
	
	
	it("21. Exit from Flashcard Review by clicking on exit button", function(done) {
	browser
		.sleep(3000)
		.elementByXPathSelectorWhenReady("//a[contains(.,'EXIT')]", 50000)
		.click()
		.nodeify(done);
	});
	it("22. CLick on filter tab ", function(done) {
   	browser
		.sleep(8000)
	  	.execute("window.scrollTo(0,0)")
	  	.elementByXPathSelectorWhenReady("//a[contains(.,'FILTER')]", 10000)
	  	.click()
	  	.elementByXPathSelectorWhenReady("//div[contains(@class,'filters with-keyterm-filter')]", 10000)
	  	.isDisplayed()
	  	.should.become(true)
	  	.nodeify(done);
	});
 
 	it("23. Click on My Flashcards tab ", function(done) {
 	browser
  		.elementByXPathSelectorWhenReady("//li[@class='ng-binding' and contains(text(),'My Flashcards')]", 10000)
  		.click()
  		.sleep(3000)
  		.nodeify(done);
 	});

	it("24.  Delete all Flashcards",function(done){
		clearAllSavedContent.clearStudyboard(browser, done);
	});
	

 });
