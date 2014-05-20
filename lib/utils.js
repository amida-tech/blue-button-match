"use strict";

var equal = require('deep-equal');
var XDate = require("xdate");

//compares two dates objects for precise equality
exports.dateMatch = function(date1, date2) {
	return equal(date1,date2);
};


//compares two dates objects fuzzily (e.g. are they intersecting)
exports.dateFuzzyMatch = function(date1, date2) {
	var d1,d2,d1end,d2end,diff,diff2;

	//1-1
	if (date1.length===1 && date2.length===1){
		d1 = new XDate(date1[0].date);
		d2= new XDate(date2[0].date);
		diff = d1.diffDays(d2);

		//if dates ~1 day apart, treat them the same
		return (diff<=1 && diff>=-1);
	}

	//1-2
	if (date1.length===1 && date2.length===2){
		d1 = new XDate(date1[0].date);
		d2= new XDate(date2[0].date);
		d2end= new XDate(date2[1].date);

		diff = d1.diffDays(d2);
		diff2 = d1.diffDays(d2end);

		//id date1 in range of date2
		return (diff<=0 && diff2>=0);
	}

	//2-1
	if (date1.length===2 && date2.length===1){
		d1= new XDate(date1[0].date);
		d1end= new XDate(date1[1].date);
		d2 = new XDate(date2[0].date);

		diff = d2.diffDays(d1);
		diff2 = d2.diffDays(d1end);

		//id date1 in range of date2
		return (diff<=0 && diff2>=0);
	}

	//2-2
	if (date1.length===2 && date2.length===2){
		d1= new XDate(date1[0].date);
		d1end= new XDate(date1[1].date);
		d2 = new XDate(date2[0].date);
		d2end = new XDate(date2[1].date);

		diff = d1.diffDays(d2end);
		diff2 = d1end.diffDays(d2);

		//return true if overlap e.g. (StartA <= EndB)  and  (EndA >= StartB)
		return ((diff>=0) && (diff2<=0));
	}

	return false;
};
