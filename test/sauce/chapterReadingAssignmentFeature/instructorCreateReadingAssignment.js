require('colors');
var wd = require('wd');
var dataUtil = require("../util/date-utility");
var loginPage = require("../support/pages/login");
var session = require("../support/setup/browser-session");
var studyBitCreation = require("../support/pages/createStudyBit");
var qaTestData =  require("../../../test_data/qa.json");
var stgTestData =  require("../../../test_data/staging.json");
var prodTestData =  require("../../../test_data/prod.json");

var testData =  require("../../../test_data/data.json");
var flashcardCreation = require("../support/pages/createFlashcards");
var clearAllSavedContent = require("../support/pages/clearData");
var report = require("../support/reporting/reportgenerator");

describe('4LTR (' +'Instructor'+') :: ******* instructorCreateReadingAssignment  Started*******', function() {
    var browser;
    var allPassed = true;
    var userType;
    var product;


    before(function(done) {
        browser = session.create(done);
        userType= testData.termsAssociatedWithAssignmentInstructor[0];
        product= testData.termsAssociatedWithAssignmentInstructor[1];

        courseName = "8-ChaosCourse-MKTG9 ";
        userType= testData.termsAssociatedWithAssignmentInstructor[0];
        product = testData.termsAssociatedWithDevInstructor[2];



        if (process.env.RUN_ENV.toString() === "\"integration\"") {

            urlForLogin = qaTestData.integration_url;
            instructorId = qaTestData.users.newinstructor[0].credentials.username;
        } else if(process.env.RUN_ENV.toString() === "\"staging\""){
            urlForLogin = stgTestData.staging_url;
            instructorId = stgTestData.users.instructor[0].credentials.username;
        } else if(process.env.RUN_ENV.toString() === "\"PROD\""){

            urlForLogin = prodTestData.prod_url;
            instructorId = prodTestData.users.instructor[0].credentials.username;
        }


        //Reports
        console.log(report.formatTestName("TEST :: STUDYBITS, CONCEPTS, FLASHCARDS AND PRACTICE QUIZ VALIDATION RESULTS :: EXISTING COURSE"));
        console.log(report.formatTestData(urlForLogin,instructorId, product,courseName ));

    });

    afterEach(function(done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function(done) {

        console.log(report.reportHeader()+
            report.stepStatusWithData("Reading Assignment Creation ","failure","failure")+
            report.stepStatus("Delete the created Reading Assignment  :: ","failure")+
            report.reportFooter());
        session.close(allPassed,done);
    });


    it(" 1. Log in as Instructor",function(done){
        loginPage.loginToApplication(userType,browser,done);
    });

    it("2. Select a Product",function(done){

        if(product==="MKTG9") {
            browser
                .sleep(1000)
                .elementByCssSelectorWhenReady("#productISBN option:nth-child(1)", 20000)
                .click()
                .nodeify(done);
        }
        else{
            browser
                .sleep(1000)
                .elementByCssSelectorWhenReady("#productISBN option:nth-child(2)", 20000)
                .click()
                .nodeify(done);

        }
    });

    it("3 Click on course link", function(done){
        browser
            .execute("var x = document.evaluate(\"//a[contains(@data-track-ext,'"+courseName+"')]\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;x.setAttribute('target','');")
            .elementByXPathSelectorWhenReady("//a[contains(@data-track-ext,'"+courseName+"')]",40000)
            .click()
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
            .sleep(3000)
            .elementByXPathSelectorWhenReady("(//div[contains(@class,'cg-calendar ng-isolate-scope')])[1]",5000)
            //.elementByCssSelectorWhenReady(".assignments.ng-scope>.ng-scope.ng-isolate-scope",5000)
            .isDisplayed()
            .should.become(true)
            .nodeify(done);
    });

    it("6. Select date for assignment and add assignment type",function(done){
        browser
            .sleep(6000)
            .elementByCssSelectorWhenReady(".day.ng-scope.today>.actions.ng-scope",5000)
            .click()
            .elementByCssSelectorWhenReady(".sliding-menu-content",5000)
            .isDisplayed()
            .should.become(true)
            .elementByCssSelectorWhenReady("#reading-assignment-button",5000)
            .click()
            .nodeify(done);
    });

    it("7. Fill the mandatory field(reveal in student calendar)",function(done){
        browser
            .sleep(3000)
            //reveal in student calendar Field
            .elementByXPathSelectorWhenReady("(//div[contains(@class,'datefield ng-binding')])[3]",5000)
            .click()
            .elementByCssSelectorWhenReady("div[class='datepicker cg-calendar ng-isolate-scope'] .day.ng-scope.today",3000)
            .click()
            .nodeify(done);
    });


    it("8. Select chapter 1 as assignment for today's date and save it",function(done){
        browser
            .sleep(3000)
            .elementByCssSelectorWhenReady("#chapt-1",5000)
            .click()
            .sleep(2000)
            .elementByCssSelectorWhenReady("#topic-1-1>p",5000)
            .click()
            .sleep(2000)
            .elementByCssSelectorWhenReady(".save.ng-scope",5000)
            .click()
            .nodeify(done);
    });

    it("9. Verify assignment added on the date tile",function(done){
        browser
            //.execute("location.reoad()")
            .sleep(3000)
            .elementByCssSelectorWhenReady(".day.ng-scope.today>.event.ng-binding.ng-scope",3000)
            .isDisplayed()
            .should.become(true)
            .nodeify(done);
    });

    it("10. Select the added chapter for today",function(done){
        browser
            .sleep(3000)
            .elementByCssSelectorWhenReady (".day.ng-scope.today>.event.ng-binding.ng-scope",3000)
            .click()
            .sleep(6000)
            .elementByCssSelectorWhenReady(".sliding-menu-content.bigger",5000)
            .isDisplayed()
            .should.become(true)
            .nodeify(done);
    });

    it("11. Clear the assignment name textbox and verify the counter should be 30",function(done){
        browser
            .sleep(8000)
            .elementByXPathSelectorWhenReady("//div[@class='text-input']//input",5000)
            .click()
            .sleep(2000)
            .elementByXPathSelectorWhenReady("//div[@class='text-input']//input",5000)
            .clear()
            .elementByXPathSelectorWhenReady("//div[contains(@class,'title-char-count span-half')]//span[@class='ng-binding']",3000)
            .text()
            .should.eventually.include("30")
            .sleep(4000)
            .execute("document.getElementsByClassName('cancel ng-scope')[0].click()")
            .sleep(2000)
            .nodeify(done);
    });

    it("12. Update assignment name",function(done){
        if(browser.elementByCssSelectorWhenReady(".day.ng-scope.today .toggle.collapsed.ng-scope",3000).isDisplayed){
            browser.elementByCssSelectorWhenReady(".day.ng-scope.today .toggle.collapsed.ng-scope",3000).click();
        }
        browser
            .sleep(3000)
            .elementByXPathSelectorWhenReady("(//div[contains(@class,'day ng-scope today')]/div[contains(@class,'event ng-binding ng-scope')][last()])",3000)
            .click()
            .sleep(6000)
            .elementByXPathSelectorWhenReady("//div[@class='text-input']//input",3000)
            .type("Assignment By Automation")
            .sleep(10000)
            .elementByCssSelectorWhenReady(".save.ng-scope",5000)
            .click()
            .sleep(8000)
            .nodeify(done);
    });

    it("13. Verify the assignment name in the cell",function(done){
        if(browser.elementByCssSelectorWhenReady(".day.ng-scope.today .toggle.collapsed.ng-scope",3000).isDisplayed){
            browser.elementByCssSelectorWhenReady(".day.ng-scope.today .toggle.collapsed.ng-scope",3000).click();
        }
        browser
            .sleep(3000)
            .elementByXPathSelectorWhenReady("(//div[contains(@class,'day ng-scope today')]/div[contains(@class,'event ng-binding ng-scope')][last()])",3000)
            .text()
            .should.eventually.include("Assignment")
            .nodeify(done);
    });

    it("14. Delete the reading assignment",function(done){
        if(browser.elementByCssSelectorWhenReady(".day.ng-scope.today .toggle.collapsed.ng-scope",3000).isDisplayed){
            browser.elementByCssSelectorWhenReady(".day.ng-scope.today .toggle.collapsed.ng-scope",3000).click();
        }
        browser
            .sleep(2000)
            .elementByXPathSelectorWhenReady("(//div[contains(@class,'day ng-scope today')]/div[contains(@class,'event ng-binding ng-scope')][last()])",3000)
            .click()
            .sleep(6000)
            .elementByCssSelectorWhenReady(".sliding-menu-content.bigger",5000)
            .isDisplayed()
            .should.become(true)
            .execute('window.oldConfirm = window.confirm;' + 'window.confirm = function() { return true; };')
            .sleep(4000)
            .elementByCssSelectorWhenReady(".delete.ng-scope")
            .click()
            .nodeify(done);

    });
});
	
	
