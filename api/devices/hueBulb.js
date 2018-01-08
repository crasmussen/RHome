var request = require('request-promise');
var moment = require('moment');
var _ipAddress, _lightId, _key;
//JpqdoM80YYtRhrx7VJomiNFL6GteO1UBRs93p9GC
var sendToHue = function(parameters){
    
    return request({
        method: 'put',
        url: 'http://' + _ipAddress + '/api/' + _key + '/lights/' + _lightId + '/state',
        body: JSON.stringify(parameters)
      })
      .then(function(ret) {
          console.log("return", ret);

      }).catch(function(error){
          console.log("ERROR!!!", error);
      });
}

module.exports = class Bulb {
    constructor(ipAddress, lightId, bridgeKey){
        _ipAddress = ipAddress;
        _lightId = lightId;
        _key = bridgeKey;
    }

    turnOn(){
        sendToHue({"on":true, "bri":254});
    }

    turnOff(){
        sendToHue({"on":false});  
    }
};