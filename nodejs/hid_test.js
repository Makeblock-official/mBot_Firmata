var firmata = require("firmata");
var HID = require("node-hid")
allDevices = HID.devices(0x416,0xffff)
console.log("hid:",allDevices.length)
allDevices.forEach(function(dev){
                   console.log("dev:",dev)
                   })
hiddev = new HID.HID(allDevices[0].path)


hiddev.on("data", function(data) {
	console.log(data.length,"data:",data)
});

hiddev.on("error", function(err) {
	console.log("error:",err)
});

hiddev.write([0x01, 0x01, 0x01, 0x05, 0x1, 0x22]);