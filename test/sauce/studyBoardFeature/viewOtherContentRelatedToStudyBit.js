require('colors');
var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/login");
var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData =  require("../../../test_data/qa.json");
var testData =  require("../../../test_data/data.json");
var clearAllSavedContent = require("../support/pages/clearData");



describe('4LTR (' +'Student'+') :: viewOtherContentRelatedToStudyBit Started', function() {
    var browser;
    var allPassed = true;
    var userType;
    var product;

    before(function(done) {
        browser = session.create(done);
         userType= testData.termsAssociatedWithAssignmentInstructor[0];
         product= testData.termsAssociatedWithAssignmentInstructor[1];
        // userType= testData.termsAssociatedWithStudentUser[0];
        // product= testData.termsAssociatedWithStudentUser[1];
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
	 it("3. Navigate to StudyBoard", function(done) {
		studyBitCreation.navigateToStudyBoard(browser,done);
	});
    it("4. Deleting All studybits", function(done) {
		clearAllSavedContent.clearStudyboard(browser, done);

	}); 
	it("5. Navigate to home page", function(done) {
		browser
		    .elementByCssSelectorWhenReady(".icon-home-blue",10000)
		    .click()
		    .nodeify(done);
	});
	
	 it("6. Click on a Chapter on the tile view ", function(done) {
		browser
		    .elementByXPathSelectorWhenReady("//a[contains(.,'Overview')]",10000)
		    .click()
		    .nodeify(done);
	});
	
	it("7. Click on the first topic link", function(done) {
		 browser
	       .elementByCssSelectorWhenReady("li[class='banner ng-scope']>div>ul>li:nth-child(2) span",10000)
	       .click()
			   .execute("setTimeout(function(){if(document.getElementById('highlight-help-modal').getAttribute('class').indexOf('ng-hide') == -1)document.getElementsByClassName('icon-close-x-pink')[0].click();},3000)")
	       .nodeify(done);
    });
   
    
	it("8. Create a Saved bit",function(done){
		studyBitCreation.studyBitCreation(browser,done);
	});
	 
	it("9. Navigate to StudyBoard", function(done) {
		studyBitCreation.navigateToStudyBoard(browser,done);
	});
	
	it("10. Click on a StudyBit from StudyBoard",function(done){
		browser
		    .elementByXPathSelectorWhenReady("(//li[contains(@class,'tile')]//div[contains(@class,'text')])[1]",10000)
       		.click()
		    .elementByXPathSelectorWhenReady("(//li[contains(@class,'banner')]//div[contains(@class,'studybit')])[1]",5000)
		    .isDisplayed()
		    .should.become(true)
		    .nodeify(done);
	});
	
	it("11. Click on more from expanded view of StudyBit and verify expanded more",function(done){
		browser
			 .elementByCssSelectorWhenReady(".banner .more.ng-scope",5000)
			 .click()
			 .elementByXPathSelectorWhenReady("//li[contains(@class,'more ng-scope is-expanded')]",5000)
			 .isDisplayed()
		  	 .should.become(true)
		 	 .nodeify(done);
	});
	
	 it("12. Click on one of the related chapter links withn more ",function(done){
	 	browser
	 		.sleep(3000)
	 		.elementByXPathSelectorWhenReady("(//a[@class='ng-binding'])[3]",5000)
	 		.click()
	 		.sleep(5000)
	 		.elementByXPathSelectorWhenReady("(//h1[contains(@class,'ng-binding')])[2]",10000)
	 		.text()
	 		.should.eventually.include("WHAT IS BUSINESS MARKETING?")	
	 		.nodeify(done);
	 });
	 
	 it("13. Scroll to assest location and verify ",function(done){
	 	browser
	 		.elementByXPathSelectorWhenReady("//span[@id='ZAOGWO838253623']",8000)
	 		.text()
	 		.should.eventually.include("marketing")	
	 		.nodeify(done);
	 });
	 
	 	
	it("14. Accept alert always",function(done){
	    browser
	      .execute('window.oldConfirm = window.confirm;' + 'window.confirm = function() { return true; };')
			  .nodeify(done);
	});
	
	it("15. Deleting All studybits",function(done){
	   browser
			 .execute("for(i=0;i<(document.getElementsByClassName('icon-trash-gray').length);i++){document.getElementsByClassName('icon-trash-gray')[i].click()}")
			 .nodeify(done);
		});
	
});
	
