var HID = require("node-hid");
var Luxafor;

Luxafor = function () {
	this.pid    = 62322;
	this.vid    = 1240;
	this.device = undefined;

	this.colors = {
		"red":     { "r": 50 ,"g": 0  ,"b": 0  },
		"green":   { "r": 0  ,"g": 50 ,"b": 0  },
		"blue":    { "r": 0  ,"g": 0  ,"b": 50  },

		"cyan":    { "r": 0  ,"g": 50 ,"b": 50 },
		"magenta": { "r": 50 ,"g": 0  ,"b": 50 },
		"yellow":  { "r": 50 ,"g": 50 ,"b": 0  },

		"white": 	 { "r": 50 ,"g": 50 ,"b": 50 },
		"off": 		 { "r": 0  ,"g": 0  ,"b": 0  }
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
		return false;
	}

	this.device = new HID.HID(path);

	if (callback) {
		callback();
	}
};

Luxafor.prototype.setLuxaforColor = function (color, callback) {
	this.setRGB(color.r, color.g, color.b, callback);
};

Luxafor.prototype.flashRGB = function (r, g, b, callback) {
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

Luxafor.prototype.setRGB = function (r, g, b, callback) {
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
