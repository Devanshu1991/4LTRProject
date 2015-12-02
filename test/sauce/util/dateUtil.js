/**
 * Created by nbalasundaram on 10/15/14.
 */
var getFormattedDate = function() {
    var time = new Date().getTime();
    var d = new Date(time);
    var formattedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var formattedTime = hours + ":" + minutes;

    formattedDate = formattedDate + " " + formattedTime;
    return formattedDate;
};


exports.getFormattedDate = getFormattedDate;


