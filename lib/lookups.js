"use strict";

var _ = require("underscore");
var blueButtonMeta = require("blue-button-meta");

var supportedSections = _.filter(blueButtonMeta.supported_sections, function (input) {
    if (input === 'plan_of_care' || input === 'payers' || input === 'providers') {
        return false;
    } else {
        return true;
    }
});

//List of sections in BB data model
exports.sections = supportedSections;
