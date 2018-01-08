
var moment = require('moment');

var _bulb;

var _fadeOutStart = function() {
        return moment("8:00 pm", "h:mm a");
    };

var _fadeOutFinish = function(){
    return moment("8:45 pm", "h:mm a");
};

var _lastExtension = function() {
    return moment("9:00 pm", "h:mm a");
}

var brightness = function(currentTime){

    console.log("fadeOutStart", _fadeOutStart());

    if (currentTime > _fadeOutStart() && currentTime < _lastExtension()) {
        var fadeOutDuration = _fadeOutFinish().diff(_fadeOutStart(), 'seconds');
        var timeSinceFadeoutStart = currentTime.diff(_fadeOutStart(), 'seconds');
        var fadeoutFraction = timeSinceFadeoutStart / fadeOutDuration;
        var brightness = 254 * (1 - fadeoutFraction);

        console.log("fadeOutDuration", fadeOutDuration, "timeSinceFadeoutStart", timeSinceFadeoutStart, "Fraction", fadeoutFraction);

        return Math.round(brightness, 0);
    } else if (currentTime >= _lastExtension()){
        return 0;
    } else if (currentTime <= _fadeOutStart() ){
        return 254;
    }

}

module.exports = class MadelineRoom {
    constructor(bulb){
        _bulb = bulb;
    }

    getBrightness(customCurrentTime) {
        var currentTime = customCurrentTime || moment();
        return brightness(currentTime);
    }

    setBrightness(customCurrentTime){
        var currentTime = customCurrentTime || moment();
        var brightnessValue = brightness(currentTime);
        _bulb.setBrightness(brightnessValue);
        return brightnessValue;
    }

};