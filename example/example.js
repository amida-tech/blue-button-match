"use strict";

var match = require("../index.js");
var bb = require("blue-button");
var fs = require("fs");

var dataA = fs.readFileSync("CCD_1.sample.xml").toString();
var dataB = fs.readFileSync("CCD_2.sample.xml").toString();

var recordA = bb.parseString(dataA);
var recordB = bb.parseString(dataB);

var result = match.match(recordA, recordB);

console.log(result);
