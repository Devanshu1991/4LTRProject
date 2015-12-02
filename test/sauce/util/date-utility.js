function getSpecificDateBeforeCurrentDate(setDate){

	var date = new Date();
	date.setDate(date.getDate() - setDate);
	var dd = date.getDate();
	var mm = date.getMonth() + 1; //january -> 0
	var yyyy = date.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}

	if (mm < 10) {
		mm = '0' + mm;
	}

	date = mm + '/' + dd + '/' + yyyy;
	return date;
};

function getSpecificDateAfterCurrentDate(setDate){

	var date = new Date();
	date.setDate(date.getDate() + setDate);
	var dd = date.getDate();
	var mm = date.getMonth() + 1; //january -> 0
	var yyyy = date.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}

	if (mm < 10) {
		mm = '0' + mm;
	}
	
	if(dd==31 && mm==12){
		yyyy+1;
	}

	date = mm + '/' + dd + '/' + yyyy;
	return date;
};

function getCurrentDateOnhyphenatedMMDDYYformat(){

	var date = new Date();
	var dd = date.getDate();
	var mm = date.getMonth() + 1; //january -> 0
	var yy = date.getFullYear().toString().substr(2,2);

	if (dd < 10) {
		dd = '0' + dd;
		dd = dd.toString();
	}

	if (mm < 10) {
		mm = '0' + mm;
		mm = mm.toString();
	}

	date = mm + ' - ' + dd + ' - ' + yy;
	return date;
};


function getCurrentMonth(){
	var array = new Array();
	array[0]="Jan";
	array[1]="Feb";
	array[2]="March";
	array[3]="April";
	array[4]="May";
	array[5]="June";
	array[6]="July";
	array[7]="Aug";
	array[8]="Sept";
	array[9]="Oct";
	array[10]="Nov";
	array[11]="Dec";
	return array[new Date().getMonth()];
}
function getCurrentFullMonthName(){
	var array = new Array();
	array[0]="January";
	array[1]="February";
	array[2]="March";
	array[3]="April";
	array[4]="May";
	array[5]="June";
	array[6]="July";
	array[7]="August";
	array[8]="September";
	array[9]="October";
	array[10]="November";
	array[11]="December";
	return array[new Date().getMonth()];
}
function getCurrentYear(){
	return new Date().getFullYear().toString();
}
function getCurrentDateOfMonth(){
	var array = new Array();
	array[0]="Sun";
	array[1]="Mon";
	array[2]="Tue";
	array[3]="Wed";
	array[4]="Thu";
	array[5]="Fri";
	array[6]="Sat";
	return array[new Date().getDay()];
	//return new Date().getDay().toString();
}
function getCurrentDate(){
	return new Date().getDate().toString();
}
function getDateFormat(){
	var day = getCurrentDateOfMonth();
	var month = getCurrentMonth();
	var date = getCurrentDate();
	var year = getCurrentYear();
	var dateformat = day + ", "+ month+" "+date+" "+year;
	return  dateformat;
}
function getDateFormatForStudyBoard(){
	var month = getCurrentFullMonthName();
	var date = getCurrentDate();
	var year = getCurrentYear();
	var dateformat = month+" "+date+", "+year;
	return  dateformat;
}
function getDateFormatForAssignment(){
	var day = getCurrentDateOfMonth();
	var month = getCurrentMonth();
	var date = getCurrentDate();
	var year = getCurrentYear();
	var dateformat = day + ", "+ month+" "+date+", "+year;
	return  dateformat;
}
function getCourseNameWithTimeStamp(){
	var date = new Date();
	var hour = date.getHours();
	var min= date.getMinutes();
	var timestamp = getDateFormatForAssignment();
	var dateformat = "Test Course "+ timestamp +" ," +hour+":"+min;
	return  dateformat;
}

var  millisecondsToStr =   function  (milliseconds) {
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    };

    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    };
    //TODO: Months! Maybe weeks?
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    };
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    };
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    };
    return 'less than a second'; //'just now' //or other string you like;
};
exports.getDateFormatForAssignment = getDateFormatForAssignment;
exports.getDateFormat = getDateFormat;
exports.getCurrentDate = getCurrentDate;
exports.getCurrentMonth = getCurrentMonth;
exports.getCurrentYear = getCurrentYear;
exports.getCurrentDateOfMonth = getCurrentDateOfMonth;
exports.getSpecificDateBeforeCurrentDate = getSpecificDateBeforeCurrentDate;
exports.getSpecificDateAfterCurrentDate= getSpecificDateAfterCurrentDate;
exports.getCourseNameWithTimeStamp = getCourseNameWithTimeStamp;
exports.millisecondsToStr = millisecondsToStr;
exports.getDateFormatForStudyBoard = getDateFormatForStudyBoard;
exports.getCurrentFullMonthName = getCurrentFullMonthName;
exports.getCurrentDateOnhyphenatedMMDDYYformat= getCurrentDateOnhyphenatedMMDDYYformat;