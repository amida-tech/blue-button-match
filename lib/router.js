"use strict";

var equal = require('deep-equal');
var _ = require('underscore');
var utils = require('./utils.js');

//Full comparison of two JSON elements for equality and partial match.
exports.compare = function compare(a, b, section) {

    function structureNested(obj, keyPath, value) {
        var lastKeyIndex = keyPath.length - 1;
        for (var i = 0; i < lastKeyIndex; ++i) {
            var key = keyPath[i];
            if (!(key in obj)) {
                obj[key] = {};
            }
            obj = obj[key];
        }
        obj[keyPath[lastKeyIndex]] = value;
    }

    if (!section) {
        throw ('one argument is required for compare function');
    }

    //Contingent on inherited name accuracy.
    var logic = require('./sections/' + section + '.json');

    if (equal(a, b)) {
        return {
            "match": "duplicate",
            "percent": "100"
        };
    } else {
        var pct = 0;
        var subarray = [];

        var newPct = 0;

        var calculateMatch = function (primaryEntries, secondaryEntries, object_a, object_b) {

            //console.log(primaryEntries);

            var primaryTotal = primaryEntries.length;
            var primaryCount = 0;

            //console.log(object_a);
            //console.log(object_b);

            var matchPercent = 0;
            //Extract primary matching logic from schema.
            var primaryCodedEntries = _.where(primaryEntries, {
                type: 'codedEntry'
            });
            var secondaryCodedEntries = _.where(secondaryEntries, {
                type: 'codedEntry'
            });
            var primaryDateEntries = _.where(primaryEntries, {
                type: 'dateTime'
            });
            var secondaryDateEntries = _.where(secondaryEntries, {
                type: 'dateTime'
            });
            var primaryStringEntries = _.where(primaryEntries, {
                type: 'string'
            });
            var primaryStringArrayEntries = _.where(primaryEntries, {
                type: 'stringArray'
            });
            var secondaryStringEntries = _.where(secondaryEntries, {
                type: 'string'
            });
            var primaryResultDateEntries = _.where(primaryEntries, {
                type: 'resultTime'
            });
            var secondaryBooleanEntries = _.where(secondaryEntries, {
                type: 'boolean'
            });
            var primaryObjectEntries = _.where(primaryEntries, {
                type: 'object'
            });

            for (var iprde in primaryResultDateEntries) {

                if (utils.resultTimeMatch(object_a['results'], object_b['results'])) {
                    matchPercent = matchPercent + primaryResultDateEntries[iprde].percent;
                    primaryCount++;
                }

            }

            for (var ipsae in primaryStringArrayEntries) {

                var matchedArrays = false;

                var inputObjectA = object_a[primaryStringArrayEntries[ipsae].path];
                var inputObjectB = object_b[primaryStringArrayEntries[ipsae].path];

                for (var ia in inputObjectA) {
                    for (var ib in inputObjectB) {

                        if (utils.stringMatch(inputObjectA[ia], inputObjectB[ib])) {
                            matchedArrays = true;
                        }

                    }
                }

                if (matchedArrays) {
                    matchPercent = matchPercent + primaryStringArrayEntries[ipsae].percent;
                    primaryCount++;
                }

            }

            //console.log(primaryStringEntries);

            for (var i in primaryStringEntries) {

                var inputObjectAPSE = object_a;
                var inputObjectBPSE = object_b;

                if (primaryStringEntries[i].path.indexOf(".") > -1) {
                    var strSplit = primaryStringEntries[i].path.split(".");
                    for (var splitEntry in strSplit) {
                        if (inputObjectAPSE[strSplit[splitEntry]] !== undefined && inputObjectBPSE[strSplit[splitEntry]] !== undefined) {
                            inputObjectAPSE = inputObjectAPSE[strSplit[splitEntry]];
                            inputObjectBPSE = inputObjectBPSE[strSplit[splitEntry]];
                        } else {
                            inputObjectAPSE = '';
                            inputObjectBPSE = '';
                        }
                    }
                } else {
                    inputObjectAPSE = object_a[primaryStringEntries[i].path];
                    inputObjectBPSE = object_b[primaryStringEntries[i].path];
                }

                //console.log(inputObjectA);
                //console.log(inputObjectB);

                //console.log(primaryStringEntries[i].path);
                if (utils.stringMatch(inputObjectAPSE, inputObjectBPSE)) {
                    matchPercent = matchPercent + primaryStringEntries[i].percent;
                    primaryCount++;
                    //console.log(matchPercent);
                }
            }

            for (var ipce in primaryCodedEntries) {

                //If path is missing, just take the main object.
                if (primaryCodedEntries[ipce].path === undefined) {
                    if (utils.codedMatch(object_a, object_b)) {
                        matchPercent = matchPercent + primaryCodedEntries[ipce].percent;
                    }
                } else {

                    var inputObjectAPCE = object_a;
                    var inputObjectBPCE = object_b;

                    //Handle dot notation.
                    if (primaryCodedEntries[ipce].path.indexOf(".") > -1) {
                        var strSplitPCE = primaryCodedEntries[ipce].path.split(".");
                        for (var splitEntryPCE in strSplitPCE) {
                            inputObjectAPCE = inputObjectAPCE[strSplitPCE[splitEntryPCE]];
                            inputObjectBPCE = inputObjectBPCE[strSplitPCE[splitEntryPCE]];
                        }
                    } else {
                        inputObjectAPCE = object_a[primaryCodedEntries[ipce].path];
                        inputObjectBPCE = object_b[primaryCodedEntries[ipce].path];
                    }

                    //console.log(inputObjectA);

                    if (utils.codedMatch(inputObjectAPCE, inputObjectBPCE)) {
                        //console.log(inputObjectAPCE);
                        //console.log(inputObjectBPCE);
                        matchPercent = matchPercent + primaryCodedEntries[ipce].percent;
                        primaryCount++;
                    }
                }

            }

            for (var ipoe in primaryObjectEntries) {

                if (utils.objectMatch(object_a[primaryObjectEntries[ipoe].path], object_b[primaryObjectEntries[ipoe].path])) {
                    //console.log(matchPercent);
                    matchPercent = matchPercent + primaryObjectEntries[ipoe].percent;
                    primaryCount++;
                }

            }

            for (var ipde in primaryDateEntries) {

                if (utils.dateMatch(object_a[primaryDateEntries[ipde].path], object_b[primaryDateEntries[ipde].path])) {
                    matchPercent = matchPercent + primaryDateEntries[ipde].percent;
                    primaryCount++;
                } else if (utils.dateFuzzyMatch(object_a[primaryDateEntries[ipde].path], object_b[primaryDateEntries[ipde].path])) {
                    //TODO:  Hardcoded for now, but should be a division.
                    matchPercent = matchPercent + primaryDateEntries[ipde].percent - 20;
                    primaryCount++;
                }

            }

            //If primary entries match, add in secondary match.
            //Logical flaw here.  All of the entries should need to hit, not just a determination over 0.
            //Need to shim matchPercent to equal zero.

            //console.log('-------');
            //console.log(primaryEntries);
            //console.log(primaryTotal);
            //console.log(primaryCount);

            //console.log(matchPercent);

            if (primaryTotal !== primaryCount) {
                matchPercent = 0;
            }

            if (matchPercent > 0) {
                for (var isce in secondaryCodedEntries) {

                    //If path is missing, just take the main object.
                    if (secondaryCodedEntries[isce].path === undefined) {
                        if (utils.codedMatch(object_a, object_b)) {
                            matchPercent = matchPercent + secondaryCodedEntries[isce].percent;
                        }
                    } else {
                        if (utils.codedMatch(object_a[secondaryCodedEntries[isce].path], object_b[secondaryCodedEntries[isce].path])) {
                            matchPercent = matchPercent + secondaryCodedEntries[isce].percent;
                        }
                    }
                }

                for (var isde in secondaryDateEntries) {

                    if (utils.dateMatch(object_a[secondaryDateEntries[isde].path], object_b[secondaryDateEntries[isde].path])) {
                        matchPercent = matchPercent + secondaryDateEntries[isde].percent;
                    } else if (utils.dateFuzzyMatch(object_a[secondaryDateEntries[isde].path], object_b[secondaryDateEntries[isde].path])) {
                        //TODO:  Hardcoded for now, but should be a division.
                        matchPercent = matchPercent + secondaryDateEntries[isde].percent - 20;
                    }
                }

                for (var isse in secondaryStringEntries) {

                    var inputObjectASSE = object_a;
                    var inputObjectBSSE = object_b;

                    //Handle dot notation.
                    if (secondaryStringEntries[isse].path.indexOf(".") > -1) {
                        var strSplitSSE = secondaryStringEntries[isse].path.split(".");
                        for (var splitEntrySSE in strSplitSSE) {
                            inputObjectASSE = inputObjectASSE[strSplitSSE[splitEntrySSE]];
                            inputObjectBSSE = inputObjectBSSE[strSplitSSE[splitEntrySSE]];
                        }
                    } else {
                        inputObjectASSE = object_a[secondaryStringEntries[isse].path];
                        inputObjectBSSE = object_b[secondaryStringEntries[isse].path];
                    }

                    if (utils.stringMatch(inputObjectASSE, inputObjectBSSE)) {
                        matchPercent = matchPercent + secondaryStringEntries[isse].percent;
                    }
                }

                for (var isbe in secondaryBooleanEntries) {
                    if (utils.booleanMatch(object_a[secondaryBooleanEntries[isbe].path], object_b[secondaryBooleanEntries[isbe].path])) {
                        matchPercent = matchPercent + secondaryBooleanEntries[isbe].percent;
                    }
                }

            }

            matchPercent = Math.round(matchPercent * 100) / 100;

            return matchPercent;

        };

        var calculateSubMatch = function (primaryEntries, secondaryEntries, object_a, object_b) {

            //console.log(object_a);
            //console.log(object_b);

            //console.log(secondaryEntries);

            if (_.isUndefined(secondaryEntries)) {
                secondaryEntries = [];
            }

            //console.log(object_a);
            //console.log(object_b);

            if (equal(object_a, object_b)) {
                return {
                    "match": "duplicate",
                    "percent": 100
                };
            } else {
                var subMatchPercent = calculateMatch(primaryEntries, secondaryEntries, object_a, object_b);

                if (subMatchPercent === 0) {
                    return {
                        "match": "new",
                        "percent": 0
                    };
                } else {
                    return {
                        "match": "partial",
                        "percent": subMatchPercent
                    };
                }

            }

        };

        //Process first object.
        newPct = newPct + calculateMatch(logic.primary, logic.secondary, a, b);

        //console.log(b);

        //if newPct = 0, return 'new', otherwise, run subarrays.

        var aMatches;

        if (newPct === 0) {
            return {
                "match": "new",
                "percent": newPct
            };
        } else {

            aMatches = {};

            //Loop sub arrays.
            for (var i in logic.subArrays) {
                for (var ii in logic.subArrays[i]) {

                    var atemp = a;
                    var btemp = b;

                    //a[ii] references title as value, need to expand.
                    //console.log(a.observation);

                    //console.log(atemp);

                    //if string split it.
                    if (ii.indexOf(".") > -1) {
                        var subPathSplit = ii.split(".");
                        for (var iteration in subPathSplit) {
                            //console.log(subPathSplit[iteration]);
                            atemp = atemp[subPathSplit[iteration]];
                            btemp = btemp[subPathSplit[iteration]];
                        }
                    } else {

                        //atemp = atemp[ii];

                        if (_.isUndefined(a[ii])) {
                            atemp = [];
                        } else {
                            atemp = atemp[ii];
                        }

                        if (_.isUndefined(b[ii])) {
                            btemp = [];
                        } else {
                            btemp = btemp[ii];
                        }
                    }

                    //console.log('---');
                    //console.log(atemp);
                    //console.log('---');

                    //console.log(ii);

                    for (var aObj in atemp) {

                        //Match Target.
                        for (var bObj in btemp) {

                            //console.log(logic.subArrays[i][ii].primary);
                            //console.log(a[ii][aObj]);
                            //console.log(b[ii][bObj]);

                            //src_id = aObj, dest_id = bObj.
                            var subObjectResults = calculateSubMatch(logic.subArrays[i][ii].primary, logic.subArrays[i][ii].secondary, atemp[aObj], btemp[bObj]);

                            if (aMatches[ii] === undefined) {
                                aMatches[ii] = [];
                                //aMatches.push({ii: []});
                            }

                            //Graph against all dest target objects.
                            aMatches[ii].push({
                                "match": subObjectResults.match,
                                "percent": subObjectResults.percent,
                                "src_id": aObj,
                                "dest_id": bObj,
                                "dest": "dest"
                            });
                        }

                        //Match Source.
                        for (var cObj in a[ii]) {

                            //Filter out self Reference.
                            if (aObj !== cObj) {
                                //src_id = aObj, dest_id = cObj.
                                var subObjectResultsTwo = calculateSubMatch(logic.subArrays[i][ii].primary, logic.subArrays[i][ii].secondary, a[ii][aObj], a[ii][cObj]);

                                if (aMatches[ii] === undefined) {
                                    aMatches[ii] = [];
                                    //aMatches.push({ii: []});
                                }

                                //Graph against all dest target objects.
                                aMatches[ii].push({
                                    "match": subObjectResultsTwo.match,
                                    "percent": subObjectResultsTwo.percent,
                                    "src_id": aObj,
                                    "dest_id": cObj,
                                    "dest": "src"
                                });
                            }

                        }
                    }

                }

            }

        }

        var diff = utils.diff(a, b);

        //Revert dot notation to nested object for mongodb.
        var dotKeys = _.keys(aMatches);
        _.each(dotKeys, function (input, index) {
            if (input.indexOf(".") > -1) {

                var aMatchNew = {};
                var inputSplice = input.split(".");
                var inputVal = aMatches[input];

                structureNested(aMatchNew, inputSplice, inputVal);

                aMatches = aMatchNew;
            }
        });

        if (!_.isEmpty(aMatches)) {
            return {
                "match": "partial",
                "percent": newPct,
                "subelements": aMatches,
                "diff": diff

            };
        } else {
            return {
                "match": "partial",
                "percent": newPct,
                "diff": diff
            };
        }

    }

};
