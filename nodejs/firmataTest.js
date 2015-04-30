/**
 * Created by Riven on 2015-04-29.
 */
console.log("blink start ...");

var firmata = require("../lib/firmata");
firmata.SYSEX_RESPONSE[0x12]= function(board) {
    var duration = ((board.currentBuffer[2] << 24) +
        (board.currentBuffer[3] << 16) +
        (board.currentBuffer[4] << 8) +
        (board.currentBuffer[5]));
    console.log("sonar "+duration);
};


var board = new firmata.Board("COM66", function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("connected");

    console.log("Firmware: " + board.firmware.name + "-" + board.firmware.version.major + "." + board.firmware.version.minor);
/*
    board.pinMode(7, board.MODES.OUTPUT);
    board.pinMode(6, board.MODES.PWM);

    board.pinMode(4, board.MODES.OUTPUT);
    board.pinMode(5, board.MODES.PWM);

    board.digitalWrite(7,1)
    board.analogWrite(6,100)
    board.digitalWrite(4,0)
    board.analogWrite(5,100)
*/
/*
    r=0;g=0;b=0;
    setInterval(function() {
        r+=10;
        if(r>200) r=0;
        board.transport.write(new Buffer([0xF0, 0x11, 0,r,g,b, 0xF7]));
    }, 500);
*/
    setInterval(function() {
        board.transport.write(new Buffer([0xF0, 0x12, 0xF7]));
    },1000);
});