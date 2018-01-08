// SERVER SETUP
// =============================================================================

// register packages
var express      = require('express');
var app          = express();   
var bodyParser   = require('body-parser');
var moment       = require('moment');
var Sun          = require('./modules/sun.js');
var MadelineRoom = require('./modules/madelineRoom.js');
var Bulb         = require('./api/devices/hue.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 

// Configure RHome modules
const mySun = new Sun('46.739800', '-117.178220');
const madelineBedtime = '8:00 pm';
const myMadelineRoom = new MadelineRoom(madelineBedtime);
const myBulb = new Bulb("192.168.1.80", 1, "JpqdoM80YYtRhrx7VJomiNFL6GteO1UBRs93p9GC");

// ROUTES
// =============================================================================
var router = express.Router();

router.get('/sunset', function(req, res) {
    mySun.minutesUntilSunset().then(function(minutes){
        res.json({message: minutes});
    })
});

router.get('/sunrise', function(req, res) {
    mySun.minutesUntilSunrise().then(function(minutes){
        res.json({message: minutes});
    })
});

router.get('/madelineBedtime', function(req, res) {
    res.json({message: myMadelineRoom.minutesUntilBedtime()});
});

router.get('/on', function(req, res) {
    myBulb.turnOn();
    res.json();
});

router.get('/off', function(req, res) {
    myBulb.turnOff();
    res.json();    
});


// REGISTER ROUTES
// =============================================================================
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('listening on port ' + port);

