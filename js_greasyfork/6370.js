// ==UserScript==
// @name				WME Street Selector
// @description 		Simplified version of WME Road Selector
// @include 			https://www.waze.com/editor*
// @include 			https://www.waze.com/*/editor*
// @include 			https://beta.waze.com/*
// @version 			0.4
// @grant				none
// @copyright			2016, pvo11
// @namespace			https://greasyfork.org/en/scripts/6370-wme-street-selector
// @downloadURL https://update.greasyfork.org/scripts/6370/WME%20Street%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/6370/WME%20Street%20Selector.meta.js
// ==/UserScript==

var StringOps = {
	0: "=",
	1: "!=",
	2: "contains",
	3: "! contains"
};

function populateStringOps(sel)
{
	var selectStringOp = getId(sel);

	for (var id in StringOps) {
		var txt = StringOps[id];
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id === 0) {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectStringOp.appendChild(usrOption);
	}
}


var IntegerOps = {
	0: "=",
	1: "!=",
	2: ">",
	3: ">=",
	4: "<",
	5: "<="
};

function populateIntegerOps(sel)
{
	var selectIntegerOp = getId(sel);

	for (var id in IntegerOps) {
		var txt = IntegerOps[id];
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id === 0) {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectIntegerOp.appendChild(usrOption);
	}
}


var EqualOps = {
	0: "=",
	1: "!="
};

function populateEqualOps(sel)
{
	var selectEqualOp = getId(sel);

	for (var id in EqualOps) {
		var txt = EqualOps[id];
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id === 0) {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectEqualOp.appendChild(usrOption);
	}
}


var Countries = new Object();

function populateCountries(sel)
{
	var selectCountry = getId(sel);
	Countries = new Object();

	for (var countryID in  Waze.model.countries.objects) {
		Countries[countryID] = Waze.model.countries.get(countryID).name;
	}


	for (var id in Countries) {
		var txt = Countries[id];
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectCountry.appendChild(usrOption);
	}
}


var RoadTypes = {
	101: "--- Highways ---",
	3: "Freeway",
	6: "Major Highway",
	7: "Minor Highway",
	4: "Ramp",
	102: "--- Streets ---",
	2: "Primary Street",
	1: "Street",
	21: "Service Road",
	103: "--- Other drivable ---",
	8: "Dirt road / 4x4",
	20: "Parking Lot",
	17: "Private Road",
	104: "--- Non-drivable ---",
	5: "Walking Trail",
	10: "Pedestrian Bw.",
	16: "Stairway",
	18: "Railroad",
	19: "Runway/Taxiway",
	14: "Ferry"
};
var RoadTypesOrder = [101, 3, 6, 7, 4, 102, 2, 1, 21, 103, 8, 20, 17, 104, 5, 10, 16, 18, 19, 14];

function populateRoadTypes(sel)
{
	var selectRoadType = getId(sel);

	for (i = 0; i < RoadTypesOrder.length; i++) {
		var id = RoadTypesOrder[i];
		var txt = RoadTypes[id];
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id == 1) {
			usrOption.setAttribute('selected',true);
		}
		if (id > 100) {
			usrOption.setAttribute('disabled',true);
			usrOption.setAttribute('style','font-weight: bold');
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectRoadType.appendChild(usrOption);
	}
}


var Directions = {
	0: "Two way (=)",
	1: "One way (A->B)",
	2: "One way (B->A)",
	3: "Unknown"
};

function populateDirections(sel)
{
	var selectDirection = getId(sel);

	for (var id in Directions) {
		var txt = Directions[id];
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id === 0) {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectDirection.appendChild(usrOption);
	}
}


function populateElevations(sel)
{
	var selectElevation = getId(sel);

	for (var id = 9; id >= -5; id--) {
		var txt;
		if (id === 0) {
			txt = "Ground";
		} else {
			txt = String(id);
		}
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id === 0) {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectElevation.appendChild(usrOption);
	}
}


function populateLocks(sel)
{
	var selectLock = getId(sel);

	for (var id = 1; id <= 6; id++) { 
		var txt = String(id);
		var usrOption = document.createElement('option');
		var usrText = document.createTextNode(txt);
		if (id === 1) {
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',id);
		usrOption.appendChild(usrText);
		selectLock.appendChild(usrOption);
	}
}


var ExprStatus = 0;
var ExprTree = new Object();
var BktTrees = new Object();
var BktCount = 0;
var Saved = new Object();
var hasStates;


function checkExpr(tree, segment)
{

		if (typeof (tree.type) === 'undefined') {
		return false;
	}

	var result;
	switch (tree.type) {
		case "Country":
			var sid = segment.attributes.primaryStreetID;
			if (typeof(sid) === 'undefined' ||  sid === null) {
				result = false;
			} else {
				var street = Waze.model.streets.get(sid);
				var countryID = Waze.model.cities.get(street.cityID).countryID;

				if (tree.op === "0") {
					result = tree.id == countryID;
				} else {
					result = tree.id != countryID;
				}
			}
			break;
		case "State":
			var sid = segment.attributes.primaryStreetID;
			if (typeof(sid) === 'undefined' ||  sid === null) {
				result = false;
			} else {
				var street = Waze.model.streets.get(sid);
				var stateID = Waze.model.cities.get(street.cityID).stateID;
				var stateName = Waze.model.states.get(stateID).name;
				if (stateName === null) {
					stateName = "";
				}
				switch (tree.op) {
					case "0":
						result = stateName.localeCompare(tree.txt) === 0;
						break;
					case "1":
						result = stateName.localeCompare(tree.txt) !== 0;
						break;
					case "2":
						result = stateName.indexOf(tree.txt) >= 0;
						break;
					default:
						result = stateName.indexOf(tree.txt) < 0;
						break;
				}
			}
			break;
		case "City":
			var sid = segment.attributes.primaryStreetID;
			if (typeof(sid) === 'undefined' ||  sid === null) {
				result = false;
			} else {
				var street = Waze.model.streets.get(sid);
				var cityName = Waze.model.cities.get(street.cityID).name;
				if (cityName === null) {
					cityName = "";
				}
				switch (tree.op) {
					case "0":
						result = cityName.localeCompare(tree.txt) === 0;
						break;
					case "1":
						result = cityName.localeCompare(tree.txt) !== 0;
						break;
					case "2":
						result = cityName.indexOf(tree.txt) >= 0;
						break;
					default:
						result = cityName.indexOf(tree.txt) < 0;
						break;
				}
			}
			break;
		case "ACity":
			result = false;
			for(i = 0; i < segment.attributes.streetIDs.length; i++){
				var sid = segment.attributes.streetIDs[i];
				if (sid !== null) {
					var street = Waze.model.streets.get(sid);
					var cityName = Waze.model.cities.get(street.cityID).name;
					if (cityName === null) {
						cityName = "";
					}
					switch (tree.op) {
						case "0":
							result = result || (cityName.localeCompare(tree.txt) === 0);
							break;
						case "1":
							result = result || (cityName.localeCompare(tree.txt) !== 0);
							break;
						case "2":
							result = result || (cityName.indexOf(tree.txt) >= 0);
							break;
						default:
							result = result || (cityName.indexOf(tree.txt) < 0);
							break;
					}
				}
			}
			break;
		case "Street":
			var sid = segment.attributes.primaryStreetID;
			if (typeof(sid) === 'undefined' ||  sid === null) {
				result = false;
			} else {
				var street = Waze.model.streets.get(sid);
				var streetName = street.name;
				if (streetName === null) {
					streetName = "";
				}
				switch (tree.op) {
					case "0":
						result = streetName.localeCompare(tree.txt) === 0;
						break;
					case "1":
						result = streetName.localeCompare(tree.txt) !== 0;
						break;
					case "2":
						result = streetName.indexOf(tree.txt) >= 0;
						break;
					default:
						result = streetName.indexOf(tree.txt) < 0;
						break;
				}
			}
			break;
		case "AStreet":
			result = false;
			for(i = 0; i < segment.attributes.streetIDs.length; i++){
				var sid = segment.attributes.streetIDs[i];
				if (sid !== null) {
					var street = Waze.model.streets.get(sid);
					var streetName = street.name;
					if (streetName === null) {
						streetName = "";
					}
					switch (tree.op) {
						case "0":
							result = result || (streetName.localeCompare(tree.txt) === 0);
							break;
						case "1":
							result = result || (streetName.localeCompare(tree.txt) !== 0);
							break;
						case "2":
							result = result || (streetName.indexOf(tree.txt) >= 0);
							break;
						default:
							result = result || (streetName.indexOf(tree.txt) < 0);
							break;
					}
				}
			}
			break;
		case "NoName":
			if (tree.op) {
				result = typeof(segment.attributes.primaryStreetID) === 'undefined' || segment.attributes.primaryStreetID === null;
			} else {
				result = typeof(segment.attributes.primaryStreetID) !== 'undefined' && segment.attributes.primaryStreetID !== null;
			}
			break;
		case "ANoName":
			if (tree.op) {
				result = segment.attributes.streetIDs.length === 0;
			} else {
				result = segment.attributes.streetIDs.length > 0;
			}
			break;
		case "RoadType":
			if (tree.op === "0") {
				result = tree.id == segment.attributes.roadType;
			} else {
				result = tree.id != segment.attributes.roadType;
			}
			break;
		case "IsRound":
			if (tree.op) {
				result = segment.attributes.junctionID !== null;
			} else {
				result = segment.attributes.junctionID === null;
			}
			break;
		case "IsToll":
			if (tree.op) {
				result = segment.isTollRoad();
			} else {
				result = !segment.isTollRoad();
			}
			break;
		case "Direction":
			var dir = 0;
			if (!segment.attributes.fwdDirection) {
				dir += 2;
			}
			if (!segment.attributes.revDirection) {
				dir += 1;
			}
			if (tree.op === "0") {
				result = tree.id == dir;
			} else {
				result = tree.id != dir;
			}
			break;
		case "Elevation":
			switch (tree.op) {
				case "0":
					result = parseInt(tree.id, 10) === segment.attributes.level;
					break;
				case "1":
					result = parseInt(tree.id, 10) !== segment.attributes.level;
					break;
				case "2":
					result = parseInt(tree.id, 10) < segment.attributes.level;
					break;
				case "3":
					result = parseInt(tree.id, 10) <= segment.attributes.level;
					break;
				case "4":
					result = parseInt(tree.id, 10) > segment.attributes.level;
					break;
				default:
					result = parseInt(tree.id, 10) >= segment.attributes.level;
					break;
			}
			break;
		case "ManLock":
			if	(segment.attributes.lockRank === null) {
				result = false;
			} else {
				switch (tree.op) {
					case "0":
						result = parseInt(tree.id, 10) === segment.attributes.lockRank + 1;
						break;
					case "1":
						result = parseInt(tree.id, 10) !== segment.attributes.lockRank + 1;
						break;
					case "2":
						result = parseInt(tree.id, 10) < segment.attributes.lockRank + 1;
						break;
					case "3":
						result = parseInt(tree.id, 10) <= segment.attributes.lockRank + 1;
						break;
					case "4":
						result = parseInt(tree.id, 10) > segment.attributes.lockRank + 1;
						break;
					default:
						result = parseInt(tree.id, 10) >= segment.attributes.lockRank + 1;
						break;
				}
			}
			break;
		case "TrLock":
			if	(segment.attributes.lockRank === null) {
				switch (tree.op) {
					case "0":
						result = parseInt(tree.id, 10) === segment.attributes.rank + 1;
						break;
					case "1":
						result = parseInt(tree.id, 10) !== segment.attributes.rank + 1;
						break;
					case "2":
						result = parseInt(tree.id, 10) < segment.attributes.rank + 1;
						break;
					case "3":
						result = parseInt(tree.id, 10) <= segment.attributes.rank + 1;
						break;
					case "4":
						result = parseInt(tree.id, 10) > segment.attributes.rank + 1;
						break;
					default:
						result = parseInt(tree.id, 10) >= segment.attributes.rank + 1;
						break;
				}
			} else {
				result = false;
			}
			break;
		case "IsNew":
			if (tree.op) {
				result = segment.isNew();
			} else {
				result = !segment.isNew();
			}
			break;
		case "IsChngd":
			if (tree.op) {
				result = !segment.isUnchanged();
			} else {
				result = segment.isUnchanged();
			}
			break;
		case "OnScr":
			var e = Waze.map.getExtent();
			var eg = e.toGeometry();
			var os = eg.intersects(segment.geometry);
			if (tree.op) {
				result = os;
			} else {
				result = !os;
			}
			break;
		case "Updtd":
 			var name;
			if (typeof(segment.attributes.updatedBy) === 'undefined' ||  sid === null) {
				name = '';
			} else {
				name = Waze.model.users.get(segment.attributes.updatedBy).userName;
				if ((typeof(name) === "undefined") || (name === null)) {
					return false;
				}
			}
			switch (tree.op) {
				case "0":
					result = name.localeCompare(tree.txt) === 0;
					break;
				case "1":
					result = name.localeCompare(tree.txt) !== 0;
					break;
				case "2":
					result = name.indexOf(tree.txt) >= 0;
					break;
				default:
					result = name.indexOf(tree.txt) < 0;
					break;
			}
			break;
		case "Crtd":
			var name;
			if (typeof(segment.attributes.createdBy) === 'undefined' ||  sid === null) {
				name = '';
			} else {
				name = Waze.model.users.get(segment.attributes.createdBy).userName;
				if ((typeof(name) === "undefined") || (name === null)) {
					return false;
				}
			}
			switch (tree.op) {
				case "0":
					result = name.localeCompare(tree.txt) === 0;
					break;
				case "1":
					result = name.localeCompare(tree.txt) !== 0;
					break;
				case "2":
					result = name.indexOf(tree.txt) >= 0;
					break;
				default:
					result = name.indexOf(tree.txt) < 0;
					break;
			}
			break;
		case "LastU":
			var updatedDays;
			if (typeof(segment.attributes.updatedOn) === 'undefined' ||  sid === null) {
				updatedDays = 0;
			} else {
				updatedDays =  Math.floor((new Date().getTime() - segment.attributes.updatedOn) / 86400000);
			}
			switch (tree.op) {
				case "0":
					result = parseInt(tree.txt, 10) === updatedDays;
					break;
				case "1":
					result = parseInt(tree.txt, 10) !== updatedDays;
					break;
				case "2":
					result = parseInt(tree.txt, 10) < updatedDays;
					break;
				case "3":
					result = parseInt(tree.txt, 10) <= updatedDays;
					break;
				case "4":
					result = parseInt(tree.txt, 10) > updatedDays;
					break;
				default:
					result = parseInt(tree.txt, 10) >= updatedDays;
					break;
			}
			break;
		case "And":
			if (checkExpr (tree.L, segment)) {
				result = checkExpr (tree.R, segment);
			} else {
				result = false;
			}
			break;
		case "Or":
			if (checkExpr (tree.L, segment)) {
				result = true;
			} else {
				result = checkExpr (tree.R, segment);
			}
			break;
		case "Not":
			result = !checkExpr (tree.R, segment);
			break;
		case "Bkt":
			result = checkExpr (tree.L, segment);
			break;
		default:
			result = false;
			break;
	}
	return result;
}


function genExptrTxt(tree)
{
	if (typeof (tree.type) === 'undefined') {
		return "";
	}

	var result;
	switch (tree.type) {
		case "Country":
			result = 'Country ' +  EqualOps[tree.op] + ' "' + Countries[tree.id] + '"';
			break;
		case "State":
		case "City":
		case "Street":
			result = tree.type + ' ';
			switch (tree.op) {
				case "0":
				case "1":
					result += StringOps[tree.op] + ' "' + tree.txt + '"';
					break;
				default:
					result += StringOps[tree.op] + ' ("' + tree.txt + '")';
					break;
			}
			break;
		case "ACity":
			result = 'Alt. City ';
			switch (tree.op) {
				case "0":
				case "1":
					result += StringOps[tree.op] + ' "' + tree.txt + '"';
					break;
				default:
					result += StringOps[tree.op] + ' ("' + tree.txt + '")';
					break;
			}
			break;
		case "AStreet":
			result = 'Alt. Street ';
			switch (tree.op) {
				case "0":
				case "1":
					result += StringOps[tree.op] + ' "' + tree.txt + '"';
					break;
				default:
					result += StringOps[tree.op] + ' ("' + tree.txt + '")';
					break;
			}
			break;
		case "NoName":
			if (tree.op) {
				result = 'Unnamed';
			} else {
				result = 'Has name';
			}
			break;
		case "ANoName":
			if (tree.op) {
				result = 'NO Alt. names';
			} else {
				result = 'Has Alt. name(s)';
			}
			break;
		case "RoadType":
			result = 'Road Type ' +  EqualOps[tree.op] + ' "' + RoadTypes[tree.id] + '"';
			break;
		case "IsToll":
			if (tree.op) {
				result = 'Is Toll Road';
			} else {
				result = 'Is NOT Toll Road';
			}
			break;
		case "IsRound":
			if (tree.op) {
				result = 'Is Roundabout';
			} else {
				result = 'Is NOT Roundabout';
			}
			break;
		case "Direction":
			result = 'Direction ' +  EqualOps[tree.op] + ' "' + Directions[tree.id] + '"';
			break;
		case "Elevation":
			if (tree.id == 0) {
				result = 'Elevation ' +  IntegerOps[tree.op] + ' "Ground"';
			} else {
				result = 'Elevation ' +  IntegerOps[tree.op] + ' ' + tree.id;
			}
			break;
		case "ManLock":
			result = 'Manual Locks ' +	IntegerOps[tree.op] + ' ' + tree.id;
			break;
		case "TrLock":
			result = 'Trafic Locks ' +	IntegerOps[tree.op] + ' ' + tree.id;
			break;
		case "IsNew":
			if (tree.op) {
				result = 'Is New ';
			} else {
				result = 'Is NOT New';
			}
			break;
		case "IsChngd":
			if (tree.op) {
				result = 'Is Changed ';
			} else {
				result = 'Is NOT Changed ';
			}
			break;
		case "OnScr":
			if (tree.op) {
				result = 'On Screen ';
			} else {
				result = 'OUT of Screen ';
			}
			break;
		case "Updtd":
			result = 'Updated by ';
			switch (tree.op) {
				case "0":
				case "1":
					result += StringOps[tree.op] + ' "' + tree.txt + '"';
					break;
				default:
					result += StringOps[tree.op] + ' ("' + tree.txt + '")';
					break;
			}
			break;
		case "Crtd":
			result = 'Created by ';
			switch (tree.op) {
				case "0":
				case "1":
					result += StringOps[tree.op] + ' "' + tree.txt + '"';
					break;
				default:
					result += StringOps[tree.op] + ' ("' + tree.txt + '")';
					break;
			}
			break;
		case "LastU":
			result = 'Last update  ' +	IntegerOps[tree.op] + ' ' + tree.txt + ' days ago';
			break;
		case "And":
			result = genExptrTxt(tree.L) + ' AND ';
			if (typeof (tree.R) !== 'undefined') {
				result += genExptrTxt(tree.R);
			}
			break;
		case "Or":
			result = genExptrTxt(tree.L) + ' OR ';
			if (typeof (tree.R) !== 'undefined') {
				result += genExptrTxt(tree.R);
			}
			break;
		case "Not":
			result = '! ';
			if (typeof (tree.R) !== 'undefined') {
				result += genExptrTxt(tree.R);
			}
			break;
		case "Bkt":
			result = '(';
			result += genExptrTxt(tree.L) + ')';
			break;
		default:
			result = "";
			break;
	}
	return result;
}


function displayExpr()
{
	var ExprTxt = "";
	for (var i = 0; i < BktCount; i ++) {
		ExprTxt += genExptrTxt(BktTrees[i]) + "(";
	}
	ExprTxt += genExptrTxt(ExprTree);
	getId("outSSExpr").value = ExprTxt;
}


function displayStatus()
{

}


function addCondition(cond)
{
	if (typeof (ExprTree.type) === 'undefined') {
		ExprTree = cond;
	} else {
		if (typeof (ExprTree.R) === 'undefined') {
			ExprTree.R = cond;
		} else {
			ExprTree.R.R = cond;
		}
	}
	ExprStatus = 1;
	displayStatus ();
}

	
function makeCountry(ev)
{
	var cond = new Object();
	cond.type = "Country";
	cond.op = getId("opSSCountry").value;
	cond.id = getId("selSSCountry").value;
	addCondition(cond);
}


function makeState(ev)
{
	var cond = new Object();
	cond.type = "State";
	cond.op = getId("opSSState").value;
	cond.txt = getId("inSSState").value;
	addCondition(cond);
}


function makeCity(alt)
{
	var cond = new Object();
	if (alt) {
		cond.type = "ACity";
	} else {
		cond.type = "City";
	}
	cond.op = getId("opSSCity").value;
	cond.txt = getId("inSSCity").value;
	addCondition(cond);
}


function makeStreet(alt)
{
	var cond = new Object();
	if (alt) {
		cond.type = "AStreet";
	} else {
		cond.type = "Street";
	}
	cond.op = getId("opSSStreet").value;
	cond.txt = getId("inSSStreet").value;
	addCondition(cond);
}


function makeNoName(ev)
{
	var cond = new Object();
	if (getId("cbSSAlter").checked) {
		cond.type = "ANoName";
	} else {
		cond.type = "NoName";
	}
	cond.op = getId("cbSSNoName").checked;
	addCondition(cond);
}


function makeRoadType(ev)
{
	var cond = new Object();
	cond.type = "RoadType";
	cond.op = getId("opSSRoadType").value;
	cond.id = getId("selSSRoadType").value;
	addCondition(cond);
}


function makeIsRound(ev)
{
	var cond = new Object();
	cond.type = "IsRound";
	cond.op = getId("cbSSIsRound").checked;
	addCondition(cond);
}


function makeIsToll(ev)
{
	var cond = new Object();
	cond.type = "IsToll";
	cond.op = getId("cbSSIsToll").checked;
	addCondition(cond);
}


function makeDirection(ev)
{
	var cond = new Object();
	cond.type = "Direction";
	cond.op = getId("opSSDirection").value;
	cond.id = getId("selSSDirection").value;
	addCondition(cond);
}


function makeElevation(ev)
{
	var cond = new Object();
	cond.type = "Elevation";
	cond.op = getId("opSSElevation").value;
	cond.id = getId("selSSElevation").value;
	addCondition(cond);
}


function makeManLock(ev)
{
	var cond = new Object();
	cond.type = "ManLock";
	cond.op = getId("opSSManLock").value;
	cond.id = getId("selSSManLock").value;
	addCondition(cond);
}


function makeTrLock(ev)
{
	var cond = new Object();
	cond.type = "TrLock";
	cond.op = getId("opSSTrLock").value;
	cond.id = getId("selSSTrLock").value;
	addCondition(cond);
}


function makeIsNew(ev)
{
	var cond = new Object();
	cond.type = "IsNew";
	cond.op = getId("cbSSIsNew").checked;
	addCondition(cond);
}


function makeIsChngd(ev)
{
	var cond = new Object();
	cond.type = "IsChngd";
	cond.op = getId("cbSSIsChngd").checked;
	addCondition(cond);
}


function makeOnScr(ev)
{
	var cond = new Object();
	cond.type = "OnScr";
	cond.op = getId("cbSSOnScr").checked;
	addCondition(cond);
}


function makeUpdtd(ev)
{
	var cond = new Object();
	cond.type = "Updtd";
	cond.op = getId("opSSUpdtd").value;
	cond.txt = getId("inSSUpdtd").value;
	addCondition(cond);
}


function makeCrtd(ev)
{
	var cond = new Object();
	cond.type = "Crtd";
	cond.op = getId("opSSCrtd").value;
	cond.txt = getId("inSSCrtd").value;
	addCondition(cond);
}


function makeLastU(ev)
{
	var cond = new Object();
	cond.type = "LastU";
	cond.op = getId("opSSLastU").value;
	cond.txt = getId("inSSLastU").value;
	if (isNaN(parseInt(cond.txt, 10))) {
		cond.txt = '1';
	}
	addCondition(cond);
}


function makeAnd(ev)
{
	var op = new Object();
	op.type = "And";
	if (ExprTree.type === "Or") {
		if (typeof (ExprTree.R) !== 'undefined') {
			op.L = ExprTree.R;
		}
		ExprTree.R = op;
	} else {
		op.L = ExprTree;
		ExprTree = op;
	}
	ExprStatus = 0;
	displayStatus ();
}


function makeOr(ev)
{
	var op = new Object();
	op.type = "Or";
	op.L = ExprTree;
	ExprTree = op;
	ExprStatus = 0;
	displayStatus ();
}


function makeNot(ev)
{
	var op = new Object();
	op.type = "Not";
	if (typeof (ExprTree.type) === 'undefined') {
		ExprTree = op;
	} else {
		if (typeof (ExprTree.R) === 'undefined') {
			ExprTree.R = op;
		} else {
			ExprTree.R.R = op;
		}
	}
	ExprStatus = 2;
	displayStatus ();
}


function makeLBkt(ev)
{
	BktTrees[BktCount] = ExprTree;
	ExprTree = new Object;
	BktCount ++;
	ExprStatus = 0;
	displayStatus ();
}


function makeRBkt(ev)
{
	BktCount --;
	var cond = new Object();
	cond.type = "Bkt";
	cond.L = ExprTree;
	ExprTree = BktTrees[BktCount];
	addCondition(cond);
}


function selectRoads()
{
	var foundSegs = new Array();
	
	if (!getId("cbSSPrimary").checked && !getId("cbSSAlt").checked) {
		return;
	}
	ExprTree = new Object();
	if (getId("cbSSCity").checked) {
		if (getId("cbSSPrimary").checked && getId("cbSSAlt").checked) {
			makeLBkt();
		}
		if (getId("cbSSPrimary").checked) {
			makeCity(false);
		}
		if (getId("cbSSPrimary").checked && getId("cbSSAlt").checked) {
			makeOr();
		}
		if (getId("cbSSAlt").checked) {
			makeCity(true);
		}
		if (getId("cbSSPrimary").checked && getId("cbSSAlt").checked) {
			makeRBkt();
		}
	}

	if (getId("cbSSCity").checked && getId("cbSSStreet").checked) {
			makeAnd();
	}

	if (getId("cbSSStreet").checked) {
		if (getId("cbSSPrimary").checked && getId("cbSSAlt").checked) {
			makeLBkt();
		}
		if (getId("cbSSPrimary").checked) {
			makeStreet(false);
		}
		if (getId("cbSSPrimary").checked && getId("cbSSAlt").checked) {
			makeOr();
		}
		if (getId("cbSSAlt").checked) {
			makeStreet(true);
		}
		if (getId("cbSSPrimary").checked && getId("cbSSAlt").checked) {
			makeRBkt();
		}
	}
	
	

	 for (var seg in Waze.model.segments.objects) {
		var segment = Waze.model.segments.get(seg);
		if (segment.arePropertiesEditable() || !getId("cbSSEditable").checked) {
			if (checkExpr(ExprTree, segment)) {
				foundSegs.push(segment);
			}
		}
	}
	Waze.selectionManager.select(foundSegs);
}


function clearExpr(ev)
{
	ExprStatus = 0;
	ExprTree = new Object();
	BktCount = 0;
	displayStatus ();
}

function delLast(ev)
{
	if (typeof (ExprTree.type) === 'undefined') {
		if (BktCount > 0) {
			BktCount--;
			ExprTree = BktTrees[BktCount];
			if (ExprTree.type === "Not") {
				ExprStatus = 2;
			} else {
				ExprStatus = 0;
			}
		}
	} else {
		switch (ExprTree.type) {
			case "And":
				if (typeof (ExprTree.R) === 'undefined') {
					ExprTree = ExprTree.L;
					ExprStatus = 1;
				} else {
					if (ExprTree.R.type === "Bkt") {
						BktTrees[BktCount] = ExprTree;
						ExprTree = ExprTree.R.L;
						delete BktTrees[BktCount].R;
						BktCount ++;
						ExprStatus = 1;
					} else if (ExprTree.R.type === "Not") {
						if (typeof (ExprTree.R.R) === 'undefined') {
							delete ExprTree.R;
							ExprStatus = 0;
						} else {
							delete ExprTree.R.R;
							ExprStatus = 2;
						}
					} else {
						delete ExprTree.R;
						ExprStatus = 0;
					}
				}
				break;
			case "Or":
				if (typeof (ExprTree.R) === 'undefined') {
					ExprTree = ExprTree.L;
					ExprStatus = 1;
				} else {
					if (ExprTree.R.type === "Bkt") {
						BktTrees[BktCount] = ExprTree;
						ExprTree = ExprTree.R.L;
						delete BktTrees[BktCount].R;
						BktCount ++;
						ExprStatus = 1;
					} else if (ExprTree.R.type === "Not") {
						if (typeof (ExprTree.R.R) === 'undefined') {
							delete ExprTree.R;
							ExprStatus = 0;
						} else {
							delete ExprTree.R.R;
							ExprStatus = 2;
						}
					} else if (ExprTree.R.type === "And") {
						if (typeof (ExprTree.R.R) === 'undefined') {
							ExprTree.R = ExprTree.R.L;
							ExprStatus = 1;
						} else {
							delete ExprTree.R.R;
							ExprStatus = 0;
						}
					} else {
						delete ExprTree.R;
						ExprStatus =  0;
					}
				}
				break;
			case "Bkt":
				BktTrees[BktCount] = new Object();
				ExprTree = ExprTree.L;
				BktCount ++;
				ExprStatus = 1;
				break;
			default:
				ExprTree = new Object();
				ExprStatus = 0;
				break;
		}
	}
	displayStatus ();
}


function genSavedHTML ()
{
	var str = '<font size=3>Saved conditions</font><br>';
	str  += '<table style="width:100%" rules=rows>';
	for (var name in Saved) {
		str += '<tr><td style="width:90%"><output id="outSSx" size=30 style="padding:0px 0px; height:20px; display:inline-block">'+ name + '</output></td>'
		str += '<td style="width:10%"><button class="btn btn-default" id="btnRXx" style="padding:0px 10px; height:20px">X</button></td></tr>'
	}
	str  +=  '</table>';		
	
	return str;
}


function makeSave(ev)
{
	Saved[getId("inSSSaveName").value] = "Ahoj";
	getId("SSsaved").innerHTML  = genSavedHTML();

}

function getElementsByClassName(classname, node)
{
	if(!node) {
		node = document.getElementsByTagName("body")[0];
	}
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++) {
		if (re.test(els[i].className)) {
			 a.push(els[i]);
		 }
	 }
	return a;
}


function getId(node)
{
	return document.getElementById(node);
}


function clone(obj) {
	var copy;
	if (null == obj || "object" != typeof obj) return obj;
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}
	if (obj instanceof Array) {
		copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}
	if (obj instanceof Object) {
		copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
	}
    throw new Error("Unable to copy obj! Its type isn't supported.");
}


function streetSelector_init()
{
	var addon = document.createElement('section');
	addon.id = "streetselector-addon";

	addon.innerHTML  = '<b><u><a href="https://www.waze.com/forum/viewtopic.php?f=819&t=112497" target="_blank">WME Street Selector</a></u></b> &nbsp; v' + GM_info.script.version;
	
	var section = document.createElement('p');
	section.style.paddingTop = "8px";
	section.style.textIndent = "16px";
	section.style.fontSize = "18px";
	section.id = "SSconditions";
	str  = '<font size=5>Conditions</font>'
					 + '<table width=100% rules=rows>'
					 + '<tr><td><b>City</b>&nbsp;<select id="opSSCity" style="padding:0px 0px; height:40px"></select>&nbsp;'
						+ '<td><input type="checkbox" id="cbSSCity" style="padding:0px 0px" /></td></tr>'
						+ '<tr><td colspan="2"><input  type="text" id="inSSCity" size=20 style="padding:0px 0px; height:40px" /></td></tr>'
					 + '<tr><td><b>Street</b>&nbsp;<select id="opSSStreet" style="padding:0px 0px; height:40px"></select>&nbsp;'
						+ '<td><input type="checkbox" id="cbSSStreet" style="padding:0px 0px" checked /></td></tr>'
						+ '<tr><td colspan="2"><input type="text" id="inSSStreet" size=20 style="padding:0px 0px; height:40px" /></td>'
					 + '<tr><td><b>Primary</b>'
						+ '<td><input type="checkbox" id="cbSSPrimary" style="padding:0px 0px" checked /></td></tr>'
					 + '<tr><td><b>Alternate</b>'
						+ '<td><input type="checkbox" id="cbSSAlt" style="padding:0px 0px" checked /></td></tr>'
					 + '</table>';
	section.innerHTML = str;
	addon.appendChild(section);

	section = document.createElement('p');
	section.style.paddingTop = "8px";
	section.style.textIndent = "16px";
	section.style.fontSize = "20px";
	section.id = "SSselection";
	section.innerHTML  = '<font size=5>Selection</font><br>'
						+ '<output id="outSSExpr"></output><br>'
					 + '<input type="checkbox" id="cbSSEditable" style="padding:0px 0px; height:40px" checked /><b>   Editable only</b><br><br>'
						+ '<button class="btn btn-default" id="btnSSSelect" style="padding:0px 10px; height:60px; font-size:24px">   Select roads   </button>&nbsp;&nbsp;&nbsp;'
					 ;
	addon.appendChild(section);


	var userTabs = getId('user-info');
	var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
	var tabContent = getElementsByClassName('tab-content', userTabs)[0];

	newtab = document.createElement('li');
	newtab.innerHTML = '<a href="#sidepanel-streetselector" data-toggle="tab">Street Selector</a>';
	navTabs.appendChild(newtab);

	addon.id = "sidepanel-streetselector";
	addon.className = "tab-pane";
	tabContent.appendChild(addon);

	populateStringOps("opSSCity");
	populateStringOps("opSSStreet");

	getId("btnSSSelect").onclick = selectRoads;
	
	$(document).keypress(function(e) {
		if(e.which == 13) {
			selectRoads();
		}
	});

}


function streetSelector_bootstrap()
{
	if ((typeof(Waze) === 'undefined') || (typeof(Waze.model) === 'undefined') || (typeof(Waze.model.countries.objects) === 'undefined') || (Object.keys(Waze.model.countries.objects).length === 0)) {
		setTimeout(streetSelector_bootstrap, 500);
	} else {
		hasStates = Waze.model.hasStates();
		streetSelector_init();
	}
}


streetSelector_bootstrap();

