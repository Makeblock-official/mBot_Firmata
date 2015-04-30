/**
 * Created by Riven on 2015-04-30.
 */

var firmata = require("firmata");
var RGBLED_SET = 0x11;
var SONAR_GET = 0x12;
var LIGHTSENSOR_GET = 0x13; // seems that firmata don't have define for A6 pin
var BUZZER_TONE = 0x14

var PORT1_PIN1 = 11,
    PORT1_PIN2 = 12,
    PORT2_PIN1 = 9,
    PORT2_PIN2 = 10,
    PORT3_PIN1 = 16, // A2
    PORT3_PIN2 = 17, // A3
    PORT4_PIN1 = 14, // A0
    PORT4_PIN2 = 15, // A1
    MOTORL_PWM = 6,
    MOTORL_DIR = 7,
    MOTORR_PWM = 5,
    MOTORR_DIR = 4;

firmata.SYSEX_RESPONSE[SONAR_GET]= function(board) {
    var duration = ((board.currentBuffer[2] << 24) +
        (board.currentBuffer[3] << 16) +
        (board.currentBuffer[4] << 8) +
        (board.currentBuffer[5]));
    //console.log("sonar "+duration);
    board.emit("sonar",duration)
};

firmata.SYSEX_RESPONSE[LIGHTSENSOR_GET]= function(board) {
    var analogValue = ((board.currentBuffer[2] << 8) +
        (board.currentBuffer[3]));
    //console.log("lightSensor "+analogValue);
    board.emit("lightSensor",analogValue)
};

function mbotInit(board){
    // init motor pins
    board.pinMode(MOTORL_DIR, board.MODES.OUTPUT);
    board.pinMode(MOTORL_PWM, board.MODES.PWM);

    board.pinMode(MOTORR_DIR, board.MODES.OUTPUT);
    board.pinMode(MOTORR_PWM, board.MODES.PWM);

    console.log(board.MODES.ANALOG);
}

function mbotMove(board, speed, turn) {
    var pwmL = speed+turn;
    var pwmR = speed-turn;

    board.digitalWrite(MOTORL_DIR,pwmL>0?0:1); // left move in reversee direction
    board.digitalWrite(MOTORR_DIR,pwmR>0?1:0);
    pwmL = Math.abs(pwmL);
    pwmL = pwmL>200?200:pwmL;
    pwmR = Math.abs(pwmR);
    pwmR = pwmL>200?200:pwmR;

    board.analogWrite(MOTORL_PWM,pwmL);
    board.analogWrite(MOTORR_PWM,pwmR);
}

function mbotRGB(board,pix,r,g,b){
    board.sp.write(new Buffer([0xF0, RGBLED_SET, pix,r,g,b, 0xF7]));
}

function mbotSonar(board, pin) {
    board.sp.write(new Buffer([0xF0, SONAR_GET, pin, 0xF7]));
}

function mbotLightSensor(board){
    board.sp.write(new Buffer([0xF0, LIGHTSENSOR_GET, 0xF7]));
}

function mbotBuzzer(board,freq,duration){
    board.sp.write(new Buffer([0xF0, BUZZER_TONE,freq,duration,0xF7]));
}

var board = new firmata.Board("COM66",function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("mbot connected");
    mbotInit(board);

    mbotMove(board,100,0);

    //mbotRGB(board,0,0,0,0); // pix0 means set both ws2812 rgb

    //board.on("sonar",function(value){console.log("sonar "+value)})
    //setInterval(function() { mbotSonar(board, PORT4_PIN2);},1000);

    //board.on("lightSensor",function(value){console.log("lightSensor "+value)})
    //setInterval(function(){ mbotLightSensor(board) },1000);

    //mbotBuzzer(board,20,20);

});










