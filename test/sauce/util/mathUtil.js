/**
 * Created by nbalasundaram on 10/1/15.
 */

module.exports = {

    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    isEmpty: function(val){
      
      return (val === undefined || val == null || val.length == 0) ? true : false;
    }

};
