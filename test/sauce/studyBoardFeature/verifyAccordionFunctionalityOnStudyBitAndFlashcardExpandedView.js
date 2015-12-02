require('colors');
var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/login");
var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData =  require("../../../test_data/qa.json");
var testData =  require("../../../test_data/data.json");
var clearAllSavedContent = require("../support/pages/clearData");


//console.log("Desired Environment variable values :: \n"+process.env.DESIRED);

describe('4LTR (' + 'Student' + ') :: verifyAccordionFunctionalityOnStudyBitAndFlashcardExpandedView started', function() {
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

	it("5. Create a Study bit", function(done) {
	studyBitCreation.studyBitCreation(browser, done);
	});

	it("6. NAvigate to StudyBOard", function(done) {
	studyBitCreation.navigateToStudyBoard(browser, done);
	});

	it("7. Click on the StudyBit ", function(done) {
	browser
		.elementByXPathSelectorWhenReady("(//li[contains(@class,'tile')]//div[contains(@class,'text')])[1]", 5000)
		.click()
		.nodeify(done);
	});

	it("8. verify  Accordion functionality on StudyBit expanded view", function(done) {
	browser
		.elementByCssSelectorWhenReady(".notes.ng-pristine.ng-valid", 5000)
		.isDisplayed()
		.should.become(true)
		.elementByCssSelectorWhenReady(".banner li[class='tags']", 5000)
		.isDisplayed()
		.should.become(true)
		.elementByCssSelectorWhenReady(".banner li[class='more ng-scope']", 5000)
		.isDisplayed()
		.should.become(true)
		.nodeify(done);
	});

	it("9. Click on 'Create FlashCard' From SB", function(done) {
	browser
		.elementByCssSelectorWhenReady(".create-flashcard.ng-scope", 5000)
		.click()
		.nodeify(done);
	});

	it("10.  verify  Accordion functionality on Flashcard expanded view ", function(done) {
	browser
		.elementByCssSelectorWhenReady(".tags.is-expanded", 5000)
		.isDisplayed()
		.should.become(true)
		.elementByCssSelectorWhenReady(".comprehension", 5000)
		.isDisplayed()
		.should.become(true)
		.nodeify(done);
	});

	it("11 navigate to StudyBit Tab", function(done) {
	browser
		.sleep(5000)
		.elementByXPathSelectorWhenReady("//a[contains(.,'StudyBits')]", 5000)
		.click()
		.sleep(5000)
		.nodeify(done);
	});

	it("12. Delete all StudyBits", function(done) {
	browser
		.execute('window.oldConfirm = window.confirm;' + 'window.confirm = function() { return true; };')
		.execute("for(i=0;i<(document.getElementsByClassName('icon-trash-gray').length);i++){document.getElementsByClassName('icon-trash-gray')[i].click()}")
		.nodeify(done);
	});
}); 
