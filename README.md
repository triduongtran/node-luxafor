node-luxafor
====

Control your Luxafor notification light via node.js!

[![NPM](https://nodei.co/npm/luxafor.png?downloads=true&stars=true)](https://nodei.co/npm/luxafor/)
Installation
----

We depend on the node.js hid library, which has some dependencies of its own.

https://github.com/node-hid/node-hid

```
npm install luxafor
```

Usage
----

```
var Luxafor = require("luxafor")();

Luxafor.init(function () {
  Luxafor.setColor(Luxafor.colors.blue, function () {});
});
```

API
----

###setColor(luxaforColor, callback)
Set Luxafor to a preset Luxafor color (see Luxafor.colors).

###setRGB(r, g, b, callback)
Set Luxafor to provided r, g, b values (0-255).

###flashRGB(r, g, b, callback)
Flash the Luxafor to provided r, g, b values (0-255).