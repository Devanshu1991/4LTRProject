require('colors');
var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/login");
var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData =  require("../../../test_data/qa.json");
var testData =  require("../../../test_data/data.json");
var clearAllSavedContent = require("../support/pages/clearData");

describe('4LTR (' +'Automation'+') :: createAndDeleteNewCourse has started', function() {
    var browser;
    var allPassed = true;
    var userType1;
    var setDate;
    var newCourseData;

    before(function(done) {
        browser = session.create(done);
        userType1= testData.termsAssociatedWithDevInstructor[0];
        setDate= testData.courseAccessInformation.DateBeforeToday;
        newCourseData = testData.instructorResourceCenter;
    });
    
    after(function(done) {
		session.close(allPassed, done);
	});
    
	it("1. Log in as DevInstructor",function(done){
      loginPage.loginToApplication(userType1,browser,done);
  
	});
	
	it("2. Click on create course link",function(done){
		browser
			.elementByCssSelectorWhenReady(".courseManage>a:first-child",3000)
			.click()
			.nodeify(done);
	});
	
	it("3. Verify page navigation by validating the question label within create course page",function(done){
		browser
			.elementByCssSelectorWhenReady("#columnMain>h3",3000)
			.text()
			.should.eventually.include(newCourseData.createCourseQuestionLabel)
			.nodeify(done);
	});
	
	it("4. Select radio button to create a new course and click on continue button",function(done){
		browser
			.elementByCssSelectorWhenReady("#createNewCourse",3000)
			.click()
			.sleep(3000)
			.elementByXPathSelectorWhenReady("//a[contains(text(),'Continue')]",3000)
			.click()
			.nodeify(done);
	});
	
	it("5. Verfiy navigation to course information page by validating course information label",function(done){
		browser
			.elementByCssSelectorWhenReady(".courseInfoHeader",3000)
			.text()
			.should.eventually.include(newCourseData.courseInformationLabel)
			.nodeify(done);
	});
	
	it("6. Fill in the new Course name",function(done){
		browser
			.elementByCssSelectorWhenReady("#courseName",3000)
			.click()
			.type(testData.termsAssociatedWithDevInstructor[1])
			.nodeify(done);
	});
	
	it("7. Fill in the start date",function(done){
		browser
			.elementByCssSelectorWhenReady("#calendar1",3000)
    		.click()
    		.sleep(3000)
    		//setting today's date
    		.elementByCssSelectorWhenReady(".ui-state-focus.ui-state-active",3000)
    		.click()	
    		.nodeify(done);
	});
	
	 it("12. Re- Edit the date, 10 days before from today's date ",function(done){
    	browser
    		.elementByCssSelectorWhenReady("#endDate",3000)
    		.clear()
    		.sleep(3000)
    		.elementByCssSelectorWhenReady("#endDate",3000)
    		.type(dataUtil.getSpecificDateAfterCurrentDate(setDate))
    		.nodeify(done);
    });
	
	it("9. Save the course details",function(done){
		browser
			.sleep(3000)
			.execute("window.scrollTo(1000,1000)")
			.elementByCssSelectorWhenReady(".button",2000)
			.click()
			.nodeify(done);
	});
	
	it("10. Verify the created course",function(done){
		browser
			.sleep(3000)
			//return to Instructor dashboard
			.elementByXPathSelectorWhenReady("//a[contains(text(),'Dashboard')]")
			.click()
			.sleep(5000)
			.elementByXPathSelectorWhenReady("(//span[@class='restitle'])[2]")
			.text()
			.should.eventually.include(testData.termsAssociatedWithDevInstructor[1])
			.nodeify(done);
	});
	
	it("11. Click on manage my course",function(done){
		browser
			.elementByCssSelectorWhenReady(".courseManage>a:nth-child(2)",5000)
			.click()
			.nodeify(done);	
	});
	
	 it("11. Click on Modify the course and select same course",function(done){
    	browser
    		.sleep(3000)
    		.execute("window.oldConfirm = window.confirm; window.confirm = function() { return true; };")
   			.elementByXPathSelectorWhenReady("//td[contains(.,'TestCourse')]/following-sibling::td/a[contains(@title,'Delete Course')]",3000)
    		.click()
    		.sleep(5000)
   			.nodeify(done);
   			
    });
});