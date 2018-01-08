var request = require('request-promise-cache');
var moment = require('moment');
var _latitude, _longitude;

var todaySunInfo = function(){
    return request({
        url: 'https://api.sunrise-sunset.org/json',
        qs: {"lat": _latitude, "lng": _longitude, "date": moment().format("YYYY-MM-DD"), "formatted": 0},
        cacheKey: 'https://api.sunrise-sunset.org/',
        cacheTTL: 1 * 60 * 60 * 1000

      })
      .then(function(ret) {
        var result = JSON.parse(ret.body);
        var sunInfo = {};
        sunInfo.sunset = moment(result.results.sunset);
        sunInfo.sunrise = moment(result.results.sunrise);   
            
        return sunInfo;
      }).catch(function(error){
          console.log("ERROR!!!", error);
      });
}

module.exports = class Sun {
    constructor(latitude, longitude){
        _latitude = latitude;
        _longitude = longitude;
    }

    minutesUntilSunset(){
        return todaySunInfo().then(function(info){
            var minutes = info.sunset.diff(moment(), 'seconds');
            return minutes;
        })    
    }

    minutesUntilSunrise(){
        return todaySunInfo().then(function(info){
            var minutes = info.sunrise.diff(moment(), 'seconds');
            return minutes;
        })    
    }
};