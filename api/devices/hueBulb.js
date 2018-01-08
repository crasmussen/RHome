var request = require('request-promise');
var moment = require('moment');
var _ipAddress, _lightId, _key;

var physicalBulb = {
    "on": null,
    "bri": null,
    "hue": null,
    "sat": null
}

var sendToHue = function(parameters){
    updateFromPhysicalBulb();
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

var updateFromPhysicalBulb = function(){
    request({
        method: 'get',
        url: 'http://' + _ipAddress + '/api/' + _key + '/lights/' + _lightId
    })
    .then(function(ret){
        var parsed = JSON.parse(ret);
        physicalBulb.on = parsed.state.on;
        physicalBulb.bri = parsed.state.bri;
        physicalBulb.hue = parsed.state.hue;
        physicalBulb.sat = parsed.state.sat;

        console.log("Physical bulb", physicalBulb);
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

    setBrightness(brightnessValue){
        if(brightnessValue > 0){
            sendToHue({"on": true, "bri": brightnessValue});
        } else{
            sendToHue({"on": false, "bri": 0});
        }
    }
};