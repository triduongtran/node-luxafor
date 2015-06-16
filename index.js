var HID = require("node-hid");
var Luxafor;

Luxafor = function () {
	this.pid = 62322;
	this.vid = 1240;
	this.device = undefined;

	this.colors = {
		"red": 82,
		"green": 71,
		"blue": 66,
		"cyan": 67,
		"magenta": 77,
		"yellow": 89,
		"white": 87,
		"off": 79
	};
};

Luxafor.prototype.init = function (callback) {
	var devices = HID.devices(),
		path;

	devices.forEach(function(current_device) {
		if (current_device && (current_device.vendorId === this.vid) && (current_device.productId === this.pid)) {
			path = current_device.path;
		}
	}.bind(this));

	// open the device by its path - if found
	if (!path) {
		//console.log("Error - no path found for HID vendorId: " + this.vid + " productId: " + this.pid );
		return false;
	}

	this.device = new HID.HID(path);

	if (callback) {
		callback();
	}
};

Luxafor.prototype.setLuxaforColor = function (color, callback) {
	var buff =  new Buffer(2);

	//Padding
	buff.writeUInt8(0, 0);

	buff.writeUInt8(color, 1);

	// writing via HID is synchronous
	this.device.write(buff);

	callback && callback();
};

Luxafor.prototype.flashColor = function (r, g, b, callback) {
	var buff = new Buffer(8);

	//Strobe
	buff.writeUInt8(3, 0);
	//"Both Sides"
	buff.writeUInt8(255, 1);

	buff.writeUInt8(r, 2);
	buff.writeUInt8(g, 3);
	buff.writeUInt8(b, 4);

	//"t" 10. Time?
	buff.writeUInt8(10, 5);

	//"d" ?
	buff.writeUInt8(0, 6);

	//"Re" 3. Repeat?
	buff.writeUInt8(3, 7);

	// writing via HID is synchronous
	this.device.write(buff);

	callback && callback();
};

Luxafor.prototype.setColor = function  (r, g, b, callback) {
	var buff = new Buffer(5);

	//Jump
	buff.writeUInt8(1, 0);
	//"Both Sides"
	buff.writeUInt8(255, 1);

	buff.writeUInt8(r, 2);
	buff.writeUInt8(g, 3);
	buff.writeUInt8(b, 4);

	this.device.write(buff);

	callback && callback();
};

module.exports = function () {
	return new Luxafor();
};
