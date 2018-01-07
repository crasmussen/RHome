
var moment = require('moment');

var _bedtime;

module.exports = class MadelineRoom {
    constructor(bedtime){
        _bedtime = bedtime;
    }

    minutesUntilBedtime(){
        var todaysBedtime = moment(_bedtime, "h:mm a");
        return todaysBedtime.diff(moment(), 'seconds');
    }
};