/**
 * Created by nbalasundaram on 10/1/15.
 */

module.exports = {


    removeBoundaryQuotes: function (value) {
        var stringCount = value.length - 1;
        var newString = value.slice(1, stringCount);
        return newString;
    },

    returnValueAfterSplit: function(string, delimeter ,index){
    	var x = string.split(delimeter)[index];
    	return x;
    }

};
