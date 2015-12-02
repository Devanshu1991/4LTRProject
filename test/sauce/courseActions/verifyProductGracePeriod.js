require('colors');
var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/login");
var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData =  require("../../../test_data/qa.json");
var testData =  require("../../../test_data/data.json");
var clearAllSavedContent = require("../support/pages/clearData");

describe('4LTR (' +'Automation'+') :: verifyProductGracePeriod Started', function() {
    var browser;
    var allPassed = true;
    var userType1;
    var userType2;
    var product;
    var setDate;

    before(function(done) {
        browser = session.create(done);
        userType1= testData.termsAssociatedWithStudentUser[0];
        userType2= testData.termsAssociatedWithInstructorUser[0];
        product= testData.termsAssociatedWithStudentUser[3];
        setDate= testData.courseAccessInformation.DateBeforeToday;
    });
    
    after(function(done) {
		session.close(allPassed, done);
	});
    
	it("1. Log in as Instructor",function(done){
      loginPage.loginToApplication(userType2,browser,done);
  
	});
	
	
	
    it("2. Click on Manage my course and verify the test course presence",function(done){
   		browser	
   			.elementByCssSelectorWhenReady(".courseManage>a:nth-child(2)",3000)
   			.click()
   			.sleep(3000)
   			.elementByXPathSelectorWhenReady("//a[contains(text(),'TestCourse')]",3000)
   			.isDisplayed()
   			.should.become(true)
   			.nodeify(done);
    });
    
    it("3. Click on edit the course and verify the display on consequent page",function(done){
    	browser
    		.elementByXPathSelectorWhenReady("//td[contains(.,'TestCourse')]/following-sibling::td/a[contains(@title,'Edit Course')]",3000)
    		.click()
    		.sleep(5000)
    		.elementByCssSelectorWhenReady("#create_Course h1",3000)
    		.isDisplayed()
   			.should.become(true)
    		.nodeify(done);
    });
    
    it("4. CLick on Start Date calendar and set today's date and save the changes made",function(done){
    	browser
    		.elementByCssSelectorWhenReady("#calendar1",3000)
    		.click()
    		.sleep(3000)
    		//setting today's date
    		.elementByCssSelectorWhenReady(".ui-state-focus.ui-state-active",3000)
    		.click()
    		//Save the changes
    		.sleep(3000)
    		.elementByCssSelectorWhenReady(".button",3000)
    		.click()
    		.sleep(5000)
    		.nodeify(done);
    });
    
    it ("5. Log out as Instructor",function(done){
    	browser
    		.sleep(5000)
    		.elementByXPathSelectorWhenReady("//a[contains(.,'Sign Out')]",3000)
    		.click()
    		.sleep(5000)
    		// select student user path to log in
    		.elementByCssSelectorWhenReady(".new.student>a",5000)
    		.click()
    		.nodeify(done);
    });
    
    it("6. Log in as student",function(done){
    		loginPage.loginToApplication(userType1,browser,done);
       });
       
    it("7. Select a Product",function(done){
		loginPage.selectAProduct(userType1,product,browser,done);
	});
	
	it("8. Verify Days left for temporary access",function(done){
		browser
			.sleep(2000)
			.elementByCssSelectorWhenReady(".gracePeriodDays span",3000)
			.text()
			.should.eventually.include(testData.courseAccessInformation.temporaryAccessForDateSetToday)
			.nodeify(done);
	});
	
	it("9. Sign out as Student",function(done){
		browser
			.sleep(2000)
			.elementByCssSelectorWhenReady(".loggedInContainer>a:nth-child(3)",3000)
			.click()
			.nodeify(done);
	});
	
	
    it("10. Log in as Instructor",function(done){
      loginPage.loginToApplication(userType2,browser,done);
  
	});	
      
    it("11. Click on Modify the course and select same course",function(done){
    	browser
    		.elementByCssSelectorWhenReady(".courseManage>a:nth-child(2)",3000)
   			.click()
   			.sleep(3000)
   			.elementByXPathSelectorWhenReady("//td[contains(.,'TestCourse')]/following-sibling::td/a[contains(@title,'Edit Course')]",3000)
    		.click()
    		.sleep(5000)
   			.nodeify(done);
   			
    });
    
    it("12. Re- Edit the date, 10 days before from today's date ",function(done){
    	browser
    		.elementByCssSelectorWhenReady("#beginDate",3000)
    		.clear()
    		.sleep(3000)
    		.elementByCssSelectorWhenReady("#beginDate",3000)
    		.type(dataUtil.getSpecificDateBeforeCurrentDate(setDate))
    		.nodeify(done);
    });
    
    it("13. Save the Edited date and sign out as insrtuctor",function(done){
    	browser
    		.elementByCssSelectorWhenReady(".button",3000)
    		.click()
    		.sleep(5000)
    		.elementByXPathSelectorWhenReady("//a[contains(.,'Sign Out')]",3000)
    		.click()
    		.sleep(4000)
    		.elementByCssSelectorWhenReady(".new.student>a",5000)
    		.click()
    		.nodeify(done);
    });
    
    it("14. Re- Log in as Student",function(done){
    	loginPage.loginToApplication(userType1,browser,done);
     });
     
    it("15. Select the course",function(done){
    	loginPage.selectAProduct(userType1,product,browser,done);
    });
    
    it("16. Verify Days left for temporary access",function(done){
		browser
			.sleep(2000)
			.elementByCssSelectorWhenReady(".gracePeriodDays span",3000)
			.text()
			.should.eventually.include(testData.courseAccessInformation.temporaryAcessForDateSet10DaysBeforeToday)
			.nodeify(done);
	});
	
	it("17. Sign out as Student",function(done){
		browser
			.sleep(2000)
			.elementByCssSelectorWhenReady(".loggedInContainer>a:nth-child(3)",3000)
			.click()
			.nodeify(done);
	});
	
});