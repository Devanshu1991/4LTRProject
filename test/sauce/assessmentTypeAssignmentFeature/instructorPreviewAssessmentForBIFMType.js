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



describe('4LTR (' +'Instructor'+'):: ******** instructorPreviewAssessmentForBIFMType Started *******', function() {
    var browser;
    var allPassed = true;
    var userType;
    var product;

    before(function(done) {
        browser = session.create(done);
       	userType= testData.termsAssociatedWithAssignmentInstructor[0];  
       	product= testData.termsAssociatedWithAssignmentInstructor[1];
    });

    afterEach(function(done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');  
        done();
    });

   after(function(done) {
        session.close(allPassed,done);
    });

	it(" 1. Log in as Instructor",function(done){
      loginPage.loginToApplication(userType,browser,done);
  
	});
	
	it("2.Select a Product",function(done){
		loginPage.selectAProduct(userType,product,browser,done);
	});
	
	it("3. Verify the Menu bar on top",function(done){
	browser
		.sleep(3000)
		.elementByCssSelectorWhenReady(".menu-wrapper",10000)
		.isDisplayed()
		.should.become(true)
		.nodeify(done);
	});
	
	it("4. Click on manage my course",function(done){
	browser
		.sleep(3000)
		.elementByCssSelectorWhenReady(".manage-dropdown>.dropdown>.dropdown-link.ng-binding",10000)
		.click()
		.nodeify(done);
	});
	
	it("5. Click on assignment and verify the calendar display",function(done){
	browser
		.sleep(3000)
		.elementByXPathSelectorWhenReady("//span[contains(.,'ASSIGNMENTS')]",5000)
		.click()
		.sleep(6000)
		.elementByXPathSelectorWhenReady("(//div[contains(@class,'cg-calendar ng-isolate-scope')])[1]",5000)
		.isDisplayed()
		.should.become(true)
		.nodeify(done);
	});
	
	it("6. Select date for assignment and add assignment type",function(done){
	browser
		.sleep(3000)
		.elementByCssSelectorWhenReady(".day.ng-scope.today>.actions.ng-scope",5000)
		.click()
		.sleep(3000)
		.elementByCssSelectorWhenReady(".sliding-menu-content",5000)
		.isDisplayed()
		.should.become(true)
		.sleep(3000)
		.elementByXPathSelectorWhenReady("//button[contains(.,'assessment')]",5000)
		.click()
		.nodeify(done);
	});
	
	it("7. Select build it for me and fill the required fields",function(done){
	browser
		.sleep(6000)
		//obsolete radio button for may release
		// .elementByXPathSelectorWhenReady("//label[contains(@class,'ng-scope ng-binding')and contains(.,'Build it for Me')]",5000)
		// .click()
		.elementByXPathSelectorWhenReady("//div[@class='text-input']//input[@id='assessment-name'and @type='text']",5000)
		.type(testData.assessmentDetails.assessmentName)
		.elementByXPathSelectorWhenReady("//div[contains(@class,'chapter-toggle ng-scope')]",5000)
		.click()
		.elementByXPathSelectorWhenReady("(//div[contains(@class,'full-width ng-scope')])[1]",5000)
		.click()
		.elementByXPathSelectorWhenReady("//div[contains(@class,'chapter-toggle ng-scope')]",5000)
		.click()
		.elementByXPathSelectorWhenReady("//input[@id='ques-per-student']",5000)
		.click()
		.type("4")
		.nodeify(done);
	});
	
	it("8. Verfiy Preview tab gets enabled",function(done){
		var classname = browser.elementByXPathSelectorWhenReady("//li[contains(text(),'Preview Assessment')]",5000).getAttribute("class");
		if(classname.should.eventually.include("active")){
		browser	
			.sleep(3000)
			.elementByXPathSelectorWhenReady("//li[contains(text(),'Preview Assessment')]",5000)
			.click()
			.nodeify(done);
		}
	});
	
	it("9. Click on preview assessment tab and verify sample question appearing",function(done){
	browser
		.sleep(6000)
		.elementByXPathSelectorWhenReady("//li[contains(text(),'Preview Assessment')]",5000)
		.click()
		.elementByCssSelectorWhenReady(".cas-item",15000)
		.isDisplayed()
		.should.become(true)
		//Verify the visual cue
		.sleep(3000)
		.elementByCssSelectorWhenReady(".random-questions.ng-scope",3000)
		.text()
		.should.eventually.include("randomized set")
		//click on okay button
		.sleep(3000)
		.elementByCssSelectorWhenReady(".done.ng-scope")
		.click()
		.nodeify(done);
	});
	
});
