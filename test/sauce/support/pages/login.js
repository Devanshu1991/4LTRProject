
var qaTestData =  require("../../../../test_data/qa.json");
var stagingTestData =  require("../../../../test_data/staging.json");	
var prodTestData =  require("../../../../test_data/prod.json");	
var CourseUrl;

function loginToApplication(userType,browser,done){

   // console.log("*********** Current user :: " + userType +"***********");//usertype
    	
    if (process.env.RUN_ENV.toString() === "\"integration\"") {

    		browser
            .get(qaTestData.integration_url)
            .setWindowSize(1366,1024);
            if(userType === "instructor"){
    		browser
    		.elementByCssSelectorWhenReady("#loginFormId input[id='emailId']", 40000)
			.type(qaTestData.users.instructor[0].credentials.username)
			.sleep(1000)
			.elementByCssSelectorWhenReady("#password",40000)
			.type(qaTestData.users.instructor[0].credentials.password)
			.sleep(1000)
			.elementByXPathSelectorWhenReady("//input[contains(@value,'Sign In')]",40000)
            .click()
            .nodeify(done);
                    
    	}
    	else if(userType==="student"){
    		browser
           	.sleep(15000)
           	.elementByCssSelectorWhenReady(".new.student>a",40000)
    		.click()
    		.sleep(1000)
    		.elementByCssSelectorWhenReady("#loginFormId input[id='email']", 120000)
			.type(qaTestData.users.student[0].credentials.username)
			.sleep(1000)
			.elementByCssSelectorWhenReady("#password",40000)
			.type(qaTestData.users.student[0].credentials.password)
			.sleep(1000)
			.elementByCssSelectorWhenReady("#loginFormId .greenWhiteButton", 40000)
            .click()
            .nodeify(done);
			}
		
		
			else if(userType==="selfstudent"){
    		browser
           	.sleep(1000)
           	.elementByCssSelectorWhenReady(".new.student>a",40000)
    		.click()
			.elementByCssSelectorWhenReady("#loginFormId input[id='email']", 40000)
			.type(qaTestData.users.selfstudent[0].credentials.username)
			.sleep(1000)
			.elementByCssSelectorWhenReady("#password",3000)
			.type(qaTestData.users.selfstudent[0].credentials.password)
			.sleep(1000)
			.elementByCssSelectorWhenReady("#loginFormId .greenWhiteButton", 40000)
            .click()
            .nodeify(done);	
    		}
    
    	else if (userType ==="devInstructor"){
    	browser
    		.sleep(1000)
    		.elementByCssSelectorWhenReady("#loginFormId input[id='emailId']", 40000)
			.type(qaTestData.users.devInstructor[0].credentials.username)
			.sleep(1000)
			.elementByCssSelectorWhenReady("#password",40000)
			.type(qaTestData.users.devInstructor[0].credentials.password)
			.sleep(1000)
			.elementByXPathSelectorWhenReady("//input[contains(@value,'Sign In')]",40000)
            .click()
            .nodeify(done);
    		}
    	else if(userType==="newstudent"){
			
    		browser
	    		.sleep(1000);
				if(browser.elementByCssSelectorWhenReady(".new.student>a",120000).isDisplayed){    		
	           	browser
	           	.elementByCssSelectorWhenReady(".new.student>a",40000)
	    		.click();
	    		}
	    	browser
	           	.sleep(7000)
	           	.elementByCssSelectorWhenReady("#loginFormId input[id='email']", 120000)
				.type(qaTestData.users.newstudent[0].credentials.username)
				.sleep(1000)
				.elementByCssSelectorWhenReady("#password",40000)
				.type(qaTestData.users.newstudent[0].credentials.password)
				.sleep(1000)
				.elementByCssSelectorWhenReady("#loginFormId .greenWhiteButton", 40000)
	            .click()
	            .nodeify(done);	
	           
    		}
    	else if (userType === "assignmentInstructor") {
    		 browser
    		  .elementByCssSelectorWhenReady("#emailId",40000)
			  .type(qaTestData.users.newinstructor[0].credentials.username)
			  .sleep(1000)
			  .elementByCssSelectorWhenReady("#password",3000)
			  .type(qaTestData.users.newinstructor[0].credentials.password)
			  .elementByXPathSelectorWhenReady("//input[contains(@value,'Sign In')]",40000)
			  .click()
			  .nodeify(done);
				}
		else if (userType === "instructorUser") {
			browser  
			  .elementByCssSelectorWhenReady("#emailId",40000)
			  .type(qaTestData.users.stagingInstructor[0].credentials.username)
			  .sleep(1000)
			  .elementByCssSelectorWhenReady("#password",3000)
			  .type(qaTestData.users.stagingInstructor[0].credentials.password)
			  .elementByXPathSelectorWhenReady("//input[contains(@value,'Sign In')]",40000)
			  .click()
			  .nodeify(done);
				}
		else if(userType==="studentUser"){
			
    		browser
	    		.sleep(1000);
				if(browser.elementByCssSelectorWhenReady(".new.student>a",120000).isDisplayed){    		
	           	browser
	           	.elementByCssSelectorWhenReady(".new.student>a",40000)
	    		.click();
	    		}
	    	browser
	           	.sleep(7000)
	           	.elementByCssSelectorWhenReady("#loginFormId input[id='email']", 120000)
				.type(qaTestData.users.stagingFirstStudentUser[0].credentials.username)
				.sleep(1000)
				.elementByCssSelectorWhenReady("#password",40000)
				.type(qaTestData.users.stagingFirstStudentUser[0].credentials.password)
				.sleep(1000)
				.elementByCssSelectorWhenReady("#loginFormId .greenWhiteButton", 40000)
	            .click()
	            .nodeify(done);	
	           
    		}
    	else if(userType==="ConceptTrackerStudent"){
			
    		browser
	    		.sleep(1000);
				if(browser.elementByCssSelectorWhenReady(".new.student>a",120000).isDisplayed){    		
	           	browser
	           	.elementByCssSelectorWhenReady(".new.student>a",40000)
	    		.click();
	    		}
	    	browser
	           	.sleep(7000)
	           	.elementByCssSelectorWhenReady("#loginFormId input[id='email']", 120000)
				.type(qaTestData.users.ConceptTrackerStudent[0].credentials.username)
				.sleep(1000)
				.elementByCssSelectorWhenReady("#password",40000)
				.type(qaTestData.users.newstudent[0].credentials.password)
				.sleep(1000)
				.elementByCssSelectorWhenReady("#loginFormId .greenWhiteButton", 40000)
	            .click()
	            .nodeify(done);	
	           
    		}
		
		
  }
  else if(process.env.RUN_ENV.toString() === "\"staging\""){

    		browser
            .get(stagingTestData.staging_url)
            .setWindowSize(1366,1024);
            
            
      
    	if(userType === "assignmentInstructor"){

            console.log(" *********** Logging in as instructor :: "+stagingTestData.users.instructor[0].credentials.username );
    		browser
            .elementByCssSelectorWhenReady("#loginFormId input[id='emailId']", 40000)
			.type(stagingTestData.users.instructor[0].credentials.username)
			.sleep(1000)
			.elementByCssSelectorWhenReady("#password",40000)
			.type(stagingTestData.users.instructor[0].credentials.password)
			.sleep(1000)
			.elementByXPathSelectorWhenReady("//input[contains(@value,'Sign In')]",40000)
            .click()
            .nodeify(done);
                    
    	}
    	else if(userType==="newstudent"){
    		browser
	    		.sleep(1000);
				if(browser.elementByCssSelectorWhenReady(".new.student>a",120000).isDisplayed){    		
	           	browser
	           	.elementByCssSelectorWhenReady(".new.student>a",40000)
	    		.click();
	    		}
	    	browser
	           	.sleep(7000)
	           	.elementByCssSelectorWhenReady("#loginFormId input[id='email']", 120000)
				.type(stagingTestData.users.student[0].credentials.username)
				.sleep(1000)
				.elementByCssSelectorWhenReady("#fmPassword",40000)
				.type(stagingTestData.users.student[0].credentials.password)
				.sleep(1000)
				.elementByCssSelectorWhenReady("#loginFormId .greenWhiteButton", 40000)
	            .click()
	            .nodeify(done);	
			}
  }
   
    else {
    	if(process.env.RUN_ENV.toString() === "\"PROD\""){

    	 browser
            .get(prodTestData.prod_url)
            .setWindowSize(1366,1024)
            .sleep(3000);
                  
           
		if (userType === "assignmentInstructor") {
			browser  
			  .elementByCssSelectorWhenReady("#emailId",40000)
			  .type(prodTestData.users.instructor[0].credentials.username)
			  .sleep(1000)
			  .elementByCssSelectorWhenReady("#password",3000)
			  .type(prodTestData.users.instructor[0].credentials.password)
			  .elementByXPathSelectorWhenReady("//input[contains(@value,'Sign In')]",40000)
			  .click()
			  .nodeify(done);
		}
		else if (userType === "newstudent") {
			browser
	    		.sleep(1000);
				if(browser.elementByCssSelectorWhenReady(".new.student>a",120000).isDisplayed){    		
	           	browser
	           	.elementByCssSelectorWhenReady(".new.student>a",40000)
	    		.click();
	    		}
	    	browser
	           	.sleep(7000)
	           	.elementByCssSelectorWhenReady("#loginFormId input[id='email']", 120000)
				.type(prodTestData.users.student[0].credentials.username)
				.sleep(1000)
				.elementByCssSelectorWhenReady("#fmPassword",40000)
				.type(prodTestData.users.student[0].credentials.password)
				.sleep(1000)
				.elementByCssSelectorWhenReady("#loginFormId .greenWhiteButton", 40000)
	            .click()
	            .nodeify(done);	
		}
		}
		 else {
			browser
				.elementByCssSelectorWhenReady("#emailId",40000)
				.type(qaTestData.users.student[0].credentials.username)
				.sleep(1000)
				.elementByCssSelectorWhenReady("#Password",40000)
				.type(qaTestData.users.student[0].credentials.password)
				.elementByXPathSelectorWhenReady("//input[@type='submit']",40000)
			    .click()
			    .nodeify(done);
		}
		
   
    
   } 
     
   
}
function selectAProduct(userType,product,browser,done){
	   console.log("*********** Current product :: " + product +"***********");
	if (process.env.RUN_ENV.toString() === "\"integration\"") {
 		    if(userType === "assignmentInstructor"&& product==="Assignments Course"){
			 browser
				 .sleep(1000)
				 .elementByCssSelectorWhenReady("#productISBN option:nth-child(1)",40000)
 				 .click()
 				 .sleep(3000)
 				 //.execute("var x = document.evaluate(\".//a[contains(@data-track-ext,'MKTG9 Course')]\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;x.setAttribute('target','');")
			     // .elementByXPathSelectorWhenReady("//a[contains(@data-track-ext,'MKTG9 Course')]",40000)
			     .execute("var x = document.evaluate(\"(//a[contains(@data-track-ext,'MKTG9 Course')])[1]\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;x.setAttribute('target','');")
			     .elementByXPathSelectorWhenReady("(//a[contains(@data-track-ext,'MKTG9 Course')])[1]",40000)
			     .click()
 				 .nodeify(done);
		 }
		 else if(userType === "assignmentInstructor"&& product==="Course For Sanity"){
			 browser
				 .sleep(1000)
				 .elementByCssSelectorWhenReady("#productISBN option:nth-child(1)",40000)
 				 .click()
 				 .sleep(3000)
 				 //.execute("var x = document.evaluate(\".//a[contains(@data-track-ext,'MKTG9 Course')]\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;x.setAttribute('target','');")
			     // .elementByXPathSelectorWhenReady("//a[contains(@data-track-ext,'MKTG9 Course')]",40000)
			     .execute("var x = document.evaluate(\"(//a[contains(@data-track-ext,'Course For Sanity')])[1]\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;x.setAttribute('target','');")
			     .elementByXPathSelectorWhenReady("(//a[contains(@data-track-ext,'Course For Sanity')])[1]",40000)
			     .click()
			     .sleep(90000)
 				 .nodeify(done);
		 }
			else if(userType === "student"&& product==="Psychology"){
				browser
					.sleep(6000)
					.execute("var url = document.getElementsByTagName('a')[13].getAttribute('onclick'); url = url.split('(');var fin = url[4].split(',');var l = fin[0].length;var final = fin[0].substring(1,(l-1));location.assign(final)")
					.sleep(3000)
					.nodeify(done);
			}else if(userType === "selfstudent"&& product==="PSYHC4"){
				browser
					.sleep(6000)
					.execute("var url = document.getElementsByTagName('a')[14].getAttribute('onclick'); url = url.split('(');var fin = url[5].split(',');var l = fin[0].length;var final = fin[0].substring(1,(l-1));location.assign(final)")
					.sleep(3000)
					.nodeify(done);
					
			}
			else if(userType === "newstudent"&& product==="Assignments Course"){
				  console.log("right condition");
				  browser
				 	.sleep(6000)
					.execute("var x = document.evaluate(\"//span[contains(text(),'MKTG9 Course')]/parent::a\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;"
					+"var url= x.getAttribute('onclick'); url = url.split('(');var fin = url[5].split(',');"
					+"var l = fin[0].length;var final = fin[0].substring(1,(l-1));location.assign(final)")
				  	.sleep(6000)
				  	.nodeify(done);
			}
			else if(userType === "newstudent"&& product==="Course For Sanity"){
				  console.log("right condition");
				  browser
				 	.sleep(6000)
					.execute("var x = document.evaluate(\"//span[contains(text(),'Course For Sanity')]/parent::a\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;"
					+"var url= x.getAttribute('onclick'); url = url.split('(');var fin = url[5].split(',');"
					+"var l = fin[0].length;var final = fin[0].substring(1,(l-1));location.assign(final)")
				  	.sleep(6000)
				  	.nodeify(done);
			}
			else if(userType === "newstudent"&& product==="PSYHC4"){
				  console.log("right condition");
				  browser
				 	.sleep(6000)
				   	.execute("var x = document.evaluate(\"//span[contains(text(),'Psych4 Course')]/parent::a\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;"
					+"var url= x.getAttribute('onclick'); url = url.split('(');var fin = url[5].split(',');"
					+"var l = fin[0].length;var final = fin[0].substring(1,(l-1));location.assign(final)")
				  	.sleep(6000)
					.nodeify(done);
			}
			else if(userType === "ConceptTrackerStudent"&& product==="ConceptTrackerCourse"){
				browser
					.sleep(6000)
					.execute("var x = document.evaluate(\"//span[contains(text(),'Test Course July 31, 2015')]/parent::a\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;"
					+"var url= x.getAttribute('onclick'); url = url.split('(');var fin = url[5].split(',');"
					+"var l = fin[0].length;var final = fin[0].substring(1,(l-1));location.assign(final)")
				  	.sleep(6000)
					.nodeify(done);
			}
			else  if(userType === "conceptTrackerInstructor"&& product==="ConceptTracker Course"){
			 browser
				 .sleep(1000)
				 .elementByCssSelectorWhenReady("#productISBN option:nth-child(1)",40000)
 				 .click()
 				 .sleep(3000)
			     .execute("var x = document.evaluate(\"(//a[contains(@data-track-ext,'Test Course July 31, 2015')])[last()]\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;x.setAttribute('target','');")
			     .elementByXPathSelectorWhenReady("(//a[contains(@data-track-ext,'Test Course July 31, 2015')])[last()]",40000)
			     .click()
 				 .nodeify(done);
		 }
			
	 }
	 
	 else if (process.env.RUN_ENV.toString() === "\"staging\"") {
	 			console.log("In staging");
	 			// var course_name = stagingTestData.products.Product1[0].values.name;
	 			// console.log("Course name::"+course_name);
	 	if(userType === "instructor"&& product==="Marketing"){
          	   	 browser
				 	.sleep(3000)
				 	.execute("document.getElementById('productISBN').selectedIndex='0'")
				 	.sleep(9000)
				 	.execute("location.assign(document.getElementsByTagName('a')[15].href)")
				 	.nodeify(done);
	 		}//end of inner if
	 		 else if(userType === "assignmentInstructor"&& product==="Course For Sanity"){
			 browser
				 .sleep(1000)
				 .elementByCssSelectorWhenReady("#productISBN option:nth-child(1)",40000)
 				 .click()
 				 .sleep(3000)
 				 //.execute("var x = document.evaluate(\".//a[contains(@data-track-ext,'MKTG9 Course')]\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;x.setAttribute('target','');")
			     // .elementByXPathSelectorWhenReady("//a[contains(@data-track-ext,'MKTG9 Course')]",40000)
			     .execute("var x = document.evaluate(\"(//a[contains(@data-track-ext,'MKTG9 Test Course')])[1]\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;x.setAttribute('target','');")
			     .elementByXPathSelectorWhenReady("(//a[contains(@data-track-ext,'MKTG9 Test Course')])[1]",40000)

			     .click()
 				 .nodeify(done);
		 }
		 else if(userType === "newstudent"&& product==="Course For Sanity"){
				  console.log("right condition");
				  browser
				 	.sleep(6000)
					.execute("var x = document.evaluate(\"//span[contains(text(),'MKTG9 Test Course')]/parent::a\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;"
					+"var url= x.getAttribute('onclick'); url = url.split('(');var fin = url[5].split(',');"
					+"var l = fin[0].length;var final = fin[0].substring(1,(l-1));location.assign(final)")
				  	.sleep(6000)
				  	.nodeify(done);
			}
	 		else if(userType === "instructor"&& product==="Psychology"){
	 			browser
				 	.sleep(3000)
				 	.execute("document.getElementById('productISBN').selectedIndex='1'")
				 	.sleep(9000)
				 	.execute("location.assign(document.getElementsByTagName('a')[12].href)")
				 	.nodeify(done);
	 			}
			 }
	
		else{
			if(process.env.RUN_ENV.toString() === "\"PROD\"") {
	 			// var course_name = qaTestData.products.Product1[0].values.staging_course;
	 			// console.log("Course name::"+course_name);
	 		if(userType === "instructor"&& product==="Marketing"){
          	   	 browser
				 	.sleep(3000)
				 	.execute("document.getElementById('productISBN').selectedIndex='0'")
				 	.sleep(9000)
				 	.execute("location.assign(document.getElementsByTagName('a')[15].href)")
				 	.nodeify(done);
	 		}//end of inner if
	 		 else if(userType === "assignmentInstructor"&& product==="Course For Sanity"){
			 browser
				 .sleep(1000)
				 .elementByCssSelectorWhenReady("#productISBN option:nth-child(7)",40000)
 				 .click()
 				 .sleep(3000)
			     .execute("var x = document.evaluate(\"(//a[contains(@data-track-ext,'Marketing Preview Course')])[1]\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;x.setAttribute('target','');")
			     .elementByXPathSelectorWhenReady("(//a[contains(@data-track-ext,'Marketing Preview Course')])[1]",40000)
			     .click()
 				 .nodeify(done);
		 }
		 else if(userType === "newstudent"&& product==="Course For Sanity"){
				  console.log("right condition");
				  browser
				 	.sleep(6000)
					.execute("var x = document.evaluate(\"//span[contains(text(),'Marketing Preview Course')]/parent::a\",document.body,null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;"
					+"var url= x.getAttribute('onclick'); url = url.split('(');var fin = url[5].split(',');"
					+"var l = fin[0].length;var final = fin[0].substring(1,(l-1));location.assign(final)")
				  	.sleep(6000)
				  	.nodeify(done);
			}
	 		else if(userType === "instructor"&& product==="Psychology"){
	 			browser
				 	.sleep(3000)
				 	.execute("document.getElementById('productISBN').selectedIndex='1'")
				 	.sleep(9000)
				 	.execute("location.assign(document.getElementsByTagName('a')[12].href)")
				 	.nodeify(done);
	 			}
			 }
		}
	
}


function loginToNewApplication(userType,browser,done){
    console.log("*********** Current Active Environment :: " + process.env.RUN_ENV +"***********");//environment
    console.log("*********** Current user :: " + userType +"***********");//usertype
    	
    if (process.env.RUN_ENV.toString() === "\"integration\"") {
    		browser
            .get(qaTestData.course_url)
            .setWindowSize(1366,768);
            
            
      if(userType==="newstudent"){
    		browser
           	.sleep(1000)
      		.elementByCssSelectorWhenReady("#newEmail", 40000)
			.type(qaTestData.users.newstudent[0].credentials.username)
			.elementByCssSelectorWhenReady("#createNewSubmit", 40000)
            .click()
            .nodeify(done);
		}
		  	
    	else{
    	browser
            .elementByXPathSelectorWhenReady("(//input[@id='email'])[1]", 40000)
			.type(qaTestData.users.newinstructor[0].credentials.username)
			.sleep(1000)
			.elementByCssSelectorWhenReady("(//input[@id='password'])[1]",40000)
			.type(qaTestData.users.newinstructor[0].credentials.password)
			.sleep(1000)
			.elementByXPathSelectorWhenReady("//a[contains(.,'Log in')]",40000)
            .click()
            .nodeify(done);
                    
    	}
    	
		
			
  }
  
}
function selectAProductforSanity(product, browser, done){
	console.log("*********** Current product :: " + product +"***********");
	console.log("=============================================");
	var coursename1= (product).split(" ,")[0];
	var coursename2= (product).split(" ,")[1];
	console.log(coursename1);
	console.log(coursename2);
		browser
				.sleep(15000)
				  	.elementByXPathSelectorWhenReady("//ul//span[contains(text(),'"+coursename1+"') and contains(text(),'"+coursename2+"')]/parent::li/parent::ul//a")
				  	.click()
				  	.sleep(10000)
				  	.execute("return document.getElementById('courseURL').getAttribute('value')").then(function(urla){
				  		// console.log(urla);
				  		CourseUrl=urla;
				  		console.log(CourseUrl);
				  		browser	
					.sleep(10000)
				  	.get(CourseUrl)
				  	.setWindowSize(1366,768)
				  	.nodeify(done);
				  	});
					
}
exports.selectAProductforSanity = selectAProductforSanity;
exports.loginToApplication = loginToApplication;
exports.selectAProduct=selectAProduct;
exports.loginToNewApplication=loginToNewApplication;