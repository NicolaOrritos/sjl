#!/usr/bin/env node

var sjconf = require("./index.js");
var assert = require("assert");

var CONF   = sjconf("not-found.conf", {"default": true});
console.log(JSON.stringify(CONF));

assert.ok(CONF.default === true);


CONF = sjconf("simple.json", {"default": true});
console.log(JSON.stringify(CONF));

assert.ok(CONF.simple === true);
