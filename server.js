// SERVER SETUP
// =============================================================================

// register packages
var express      = require('express');
var app          = express();   
var bodyParser   = require('body-parser');
var moment       = require('moment');
var Sun          = require('./modules/sun.js');
var MadelineRoom = require('./modules/madelineRoom.js');
var Bulb         = require('./api/devices/hueBulb.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 

// Configure RHome modules
const mySun = new Sun('46.739800', '-117.178220');
const madelineBulb = new Bulb("192.168.1.80", 3, "JpqdoM80YYtRhrx7VJomiNFL6GteO1UBRs93p9GC");
const madelineRoom = new MadelineRoom(madelineBulb);

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

router.get('/getBrightness', function(req, res) {
    if (req.query.time !== undefined){
        var overrideTime = moment(req.query.time);
    }
    res.json({message: madelineRoom.getBrightness(overrideTime)});
});

router.post('/updateBrightness', function(req, res) {
    if (req.query.time !== undefined){
        var overrideTime = moment(req.query.time);
    }
    res.json({message: madelineRoom.setBrightness(overrideTime)});
});

router.get('/on', function(req, res) {
    madelineBulb.turnOn();
    res.json();
});

router.get('/off', function(req, res) {
    madelineBulb.turnOff();
    res.json();    
});


// REGISTER ROUTES
// =============================================================================
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('listening on port ' + port);

// EVENT LOOP
// =============================================================================

function intervalFunc() {
    console.log(madelineRoom.setBrightness());
  }
  
  setInterval(intervalFunc, 10 * 1000);