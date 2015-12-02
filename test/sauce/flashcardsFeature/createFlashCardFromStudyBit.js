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

describe('4LTR (' +'Automation'+') :: createFlashCardFromStudyBit has started', function() {
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
        session.close(allPassed,done);
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
	
    
  	it("4. Deleting All studybits", function(done) {
		clearAllSavedContent.clearStudyboard(browser, done);

	}); 
		
	it("5. Navigating to Home", function(done) {
	browser
		.elementByCssSelectorWhenReady(".icon-home-blue", 5000)
		.click()
		.nodeify(done);
	});
	
	it("6. Click on a Chapter on the tile view ", function(done) {
	browser 
		.elementByXPathSelectorWhenReady("//a[contains(.,'Overview')]", 2000)
		.click()
		.nodeify(done);
	});

	it("7. Click on the first topic link", function(done) {
	browser
		.elementByCssSelectorWhenReady("li[class='banner ng-scope']>div>ul>li:nth-child(2) span", 10000)
		.click()
		.execute("setTimeout(function(){if(document.getElementById('highlight-help-modal').getAttribute('class').indexOf('ng-hide') == -1)document.getElementsByClassName('icon-close-x-pink')[0].click();},3000)")
		.nodeify(done);
	});
	
	it("8. Create a Study bit",function(done){
		studyBitCreation.createStudyBitWithFullDetails(browser,done);
	});
	
	it("9. NAvigate to StudyBOard  ", function(done) {
		studyBitCreation.navigateToStudyBoard(browser, done);
	});
	
	it("10. Click on the StudyBit ", function(done) {
	browser
        	.elementByXPathSelectorWhenReady("(//li[contains(@class,'tile')]//div[contains(@class,'text')])[1]",5000)
            	.click()
            	.nodeify(done);
       	});
	
	it("11. Click on the CreateFlashCard ", function(done) {
		flashcardCreation.createFlashcardFromStudyBit(browser,done);
	});
	
	it("12. Verify the created Flashcard",function(done){
	browser
		.execute("window.scrollTo(0,0)")
		.elementByXPathSelectorWhenReady("//a[contains(.,'FILTER')]", 10000)
		.click()
		.elementByXPathSelectorWhenReady("//li[@class='ng-binding' and contains(text(),'My Flashcards')]", 10000)
		.click()
		.execute("window.scrollTo(1000,1000)")
		.elementByCssSelectorWhenReady(".studybit.flashcard.text.fair:first-child",3000)
		.click()
		.elementByCssSelectorWhenReady(".banner .tag-item.ng-scope:nth-child(2) span",3000)
		.text()
		.should.eventually.include("MyTagByAutomation")
		.nodeify(done);
	});
	
	it("13.  Delete all Flashcards",function(done){
		clearAllSavedContent.clearStudyboard(browser, done);
	});
	
	it("13. Navigate to StudyBit Tab", function(done) {
	browser
	    	.execute("window.scrollTo(0,0)")
		.elementByXPathSelectorWhenReady("//a[contains(.,'StudyBits')]", 5000)
		.click()
		.nodeify(done);
	});
	
    
  	it("14. Deleting All studybits", function(done) {
		clearAllSavedContent.clearStudyboard(browser, done);
	}); 
		
});
