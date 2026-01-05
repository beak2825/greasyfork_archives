// ==UserScript==
// @name                Locking Standards Tool (LST)
// @namespace           https://greasyfork.org/en/users/5920-rickzabel
// @description         Adds Highlights to segments that need their lock level raised
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/*
// @version             0.3.9
// @require https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js?version=157879
// @icon	data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/9724/Locking%20Standards%20Tool%20%28LST%29.user.js
// @updateURL https://update.greasyfork.org/scripts/9724/Locking%20Standards%20Tool%20%28LST%29.meta.js
// ==/UserScript==

//removed grant for firefox // @grant       GM_xmlhttpRequest
// @require https://greasyfork.org/scripts/16071-wme-keyboard-shortcuts/code/WME%20Keyboard%20Shortcuts.js
(function() {
	//setup the varibles that will be used more that one function
	var Version = GM_info.script.version;
	var ScriptName = GM_info.script.name;

	var UpdateMessage = "yes"; // yes alert the user, no has a silent update.
	var VersionUpdateNotes = ScriptName + " has been updated to v" + Version;
	//remove any lines >1 month old. dont leave \n on last line.
	VersionUpdateNotes = VersionUpdateNotes + "\n" +
	"last version updated keyboardshortcut layer info this version updates the beta url";
	if (UpdateMessage === "yes") {
		var ScriptNameVersion = ScriptName.replace(/\s/g, "") + "Version"; //prepare the scripts name for
		if (localStorage.getItem(ScriptNameVersion) !== Version) {
			alert(VersionUpdateNotes);
			localStorage.setItem(ScriptNameVersion, Version);
		}
	}

	/*
	//Keep my layers neato update message window
	kmlNoticePanel(Version, "test");
	function kmlNoticePanel(kmlVersion, kmlNoticeText) {
		if($('#map').length < 2 ) {
			setTimeout(kmlNoticePanel(kmlVersion, kmlNoticeText) , 1000);
		} else {
			console.log('blah');
		}

			var kmlNoticeUI = document.createElement("div");
			kmlNoticeUI.id = "divKMLnotice";
			kmlNoticeUI.innerHTML =
			'<i id="iKMLnotice" class="icon-exclamation-sign icon-4x pull-left fa fa-exclamation-circle fa-4x fa-pull-left"></i>' +
			'<h2>' + ScriptName +'</h2>' +
			'<hr class="kml-panel-hr">';
			kmlNoticeUI.innerHTML +=
			'<div class="kml-panel-section" style="font-size: 10pt">' +
			kmlNoticeText +
			'</div>' +
			'<div style="margin-top: 6px; font-size: 10pt">' +
			'</div>' +
			'<div style="margin-top:10px; font-size: 8pt;"> ' +
			'Note: This is a one-time alert for WME KMLayers v. ' + kmlVersion +
			'</div>';
			kmlNoticeUI.innerHTML += '<hr class="kml-panel-hr">' +
			'<div style="position: relative; width: 70px; display: block; left: 148px; bottom: 0px; margin: 10px; vertical-align: middle; padding: 0">' +
			'<button id="btnKMLokay" style="width: 70px" class="btn btn-primary kml-panel-btn">OK</button></div>' +
			'</div>';


			kmlNoticeUI.innerHTML = '<div class="kml-panel" style="width: 420px; padding-left: 15px; padding-right: 15px;">' + kmlNoticeUI.innerHTML;
			kmlNoticeUI.innerHTML += '</div>';
			kmlNoticeUI.className = "kml-panel-blackout";
			//alert(kmlNoticeUI);
			//document.getElementById("map").appendChild(kmlNoticeUI);
			$("#map").append(kmlNoticeUI);


			$('#divKMLnotice').click(function() {
				$('#divKMLnotice').remove();
			});
		}
    }

	//kmlNoticePanel("blackout", Version, VersionUpdateNotes);
	*/


	//setup keyboard shortcut's header and add a keyboard shortcuts
	function WMEKSRegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
		//check for and add keyboard shourt group to WME
		try {
			var x = I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[ScriptName].members.length;
		} catch (e) {
			//setup keyboard shortcut's header
			Waze.accelerators.Groups[ScriptName] = []; //setup your shortcut group
			Waze.accelerators.Groups[ScriptName].members = []; //set up the members of your group
			I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[ScriptName] = []; //setup the shortcuts text
			I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[ScriptName].description = ShortcutsHeader; //Scripts header
			I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[ScriptName].members = []; //setup the shortcuts text
		}
		//check if the function we plan on calling exists
		if (FunctionToCall && (typeof FunctionToCall == "function")) {
			I18n.translations[I18n.currentLocale()].keyboard_shortcuts.groups[ScriptName].members[NewShortcut] = ShortcutDescription; //shortcut's text
			Waze.accelerators.addAction(NewShortcut, {
				group: ScriptName
			}); //add shortcut one to the group
			//clear the short cut other wise the previous shortcut will be reset MWE seems to keep it stored
			var ClearShortcut = '-1';
			var ShortcutRegisterObj = {};
			ShortcutRegisterObj[ClearShortcut] = NewShortcut;
			Waze.accelerators._registerShortcuts(ShortcutRegisterObj);
			if (ShortcutKeysObj !== null) {
				//add the new shortcut
				ShortcutRegisterObj = {};
				ShortcutRegisterObj[ShortcutKeysObj] = NewShortcut;
				Waze.accelerators._registerShortcuts(ShortcutRegisterObj);
			}
			//listen for the shortcut to happen and run a function
			W.accelerators.events.register(NewShortcut, null, function() {
				FunctionToCall();
			});
		} else {
			alert('The function ' + FunctionToCall + ' has not been declared');
		}

	}

	//if saved load and set the shortcuts
	function WMEKSLoadKeyboardShortcuts(ScriptName) {
		if (localStorage[ScriptName + 'KBS']) {
			var LoadedKBS = JSON.parse(localStorage[ScriptName + 'KBS']); //JSON.parse(localStorage['WMEAwesomeKBS']);
			for (var i = 0; i < LoadedKBS.length; i++) {
				Waze.accelerators._registerShortcuts(LoadedKBS[i]);
			}
		}
	}

	function WMEKSSaveKeyboardShortcuts(ScriptName) {
		//return function() {
		var TempToSave = [];
		for (var name in Waze.accelerators.Actions) {
			//console.log(name);
			var TempKeys = "";
			if (Waze.accelerators.Actions[name].group == ScriptName) {
				if (Waze.accelerators.Actions[name].shortcut) {
					if (Waze.accelerators.Actions[name].shortcut.altKey === true) {
						TempKeys += 'A';
					}
					if (Waze.accelerators.Actions[name].shortcut.shiftKey === true) {
						TempKeys += 'S';
					}
					if (Waze.accelerators.Actions[name].shortcut.ctrlKey === true) {
						TempKeys += 'C';
					}
					if (TempKeys !== "") {
						TempKeys += '+';
					}
					if (Waze.accelerators.Actions[name].shortcut.keyCode) {
						TempKeys += Waze.accelerators.Actions[name].shortcut.keyCode;
					}
				} else {
					TempKeys = "-1";
				}
				var ShortcutRegisterObj = {};
				ShortcutRegisterObj[TempKeys] = Waze.accelerators.Actions[name].id;
				TempToSave[TempToSave.length] = ShortcutRegisterObj;
			}
		}
		localStorage[ScriptName + 'KBS'] = JSON.stringify(TempToSave);
		//}
	}

	//example function show show the shortcuts have been pressed
	function WMEKSKyboardShortcutToCall() {
		alert('Awesome keyboard shortcut was pressed');
	}

	function toconsole(message) {
		console.log(ScriptName + ": " + message);
	}

	var LSTPurple = "data:image/png;base64,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";
	var LSTYellow = "data:image/png;base64,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";
	var LSTLayer;
	var LSTIconLayer;
	var LSTlineWidth = [
		[0, 0], //zoom 0
		[0, 0], //zoom 1
		[20, 15], //zoom 2
		[20, 15], //zoom 3
		[20, 15], //zoom 4
		[25, 20], //zoom 5
		[25, 20], //zoom 6
		[25, 20], //zoom 7
		[25, 20], //zoom 8
		[25, 20], //zoom 9
		[25, 20] //zoom 10
	];

	var LSTIconWidth = [
		[0, 0, 0], //zoom 0
		[0, 0, 0], //zoom 1
		[10, 5, 10], //zoom 2
		[20, 10, 15], //zoom 3
		[20, 10, 15], //zoom 4
		[20, 10, 15], //zoom 5
		[30, 15, 25], //zoom 6
		[30, 15, 25], //zoom 7
		[40, 20, 35], //zoom 8
		[40, 20, 35], //zoom 9
		[40, 20, 35] //zoom 10
	];

	var spreadsheetlockarray = [];
	var RampArray = [];

	setTimeout(Startcode, 1000);
	// on start-up keep checking the site to see if the user detials are loaded
	function Startcode() {
		if (Waze.model.loginManager.isLoggedIn()) {
			//toconsole("Editor is logged in");
			try {
				var element = $("#user-details");
				if (typeof element !== "undefined" && element.value !== '') {
					//init();
					//toconsole("initializing");
					initialize();
				} else {
					//toconsole(ScriptName + " - waiting to start");
					setTimeout(Startcode, 750);
				}
			} catch (err) {
				toconsole(err);
				//setTimeout(Startcode, 1000);
			}
		} else {
			//toconsole(ScriptName + " - Editor not logged in");
			setTimeout(Startcode, 1000);
		}
	}

	function initialize() {
		LSTLayer = new OpenLayers.Layer.Vector("LST", {
			displayInLayerSwitcher: false,
			uniqueName: "__LST"
		});
		I18n.translations[I18n.currentLocale()].layers.name["__LST"] = "LST";
		Waze.map.addLayer(LSTLayer);

		var roads = Waze.map.getLayersBy('uniqueName', 'satellite_imagery').first();
		var roadsZIdx = roads.getZIndex();
		roadsZIdx = Number(roadsZIdx);

		var LST = Waze.map.getLayersBy('uniqueName', '__LST').first();
		LST.setZIndex(Number(roadsZIdx) + 1);

		LSTIconLayer = new OpenLayers.Layer.Vector("LSTIcons", {
			displayInLayerSwitcher: false,
			uniqueName: "__LSTIcons"
		});
		I18n.translations[I18n.currentLocale()].layers.name["__LSTIcons"] = "LSTIcons";
		Waze.map.addLayer(LSTIconLayer);

		Waze.map.raiseLayer(LSTIconLayer, -2); //move the icon layer below the wme segment layer

		var addon = document.createElement('section');
		addon.id = "highlight-addon";
		addon.innerHTML = '<b>' + GM_info.script.name + '</u></b> &nbsp; v' + Version;
		// Highlight Locks Needed
		var section = document.createElement('p');
		section.style.paddingTop = "8px";
		//section.style.textIndent = "16px";
		section.id = "LSTOptions";

		//area drop down
		var htmlstring = '<font style="font-size: 12px;">Area </font>';
		htmlstring = htmlstring + '<select id="LSTArea" style="font-size: 12px; margin-top: 5px;">';
		htmlstring = htmlstring + '</select> ';
		//add area link
		htmlstring = htmlstring + '<a target="_blank" Title="LSTAddArea" href="https://goo.gl/OZsyGO">Add area</a><br>';

		//city dropdown
		htmlstring = htmlstring + '<font style="font-size: 12px;">City  </font>';
		htmlstring = htmlstring + '<select id="LSTCity" style="font-size: 12px; margin-top: 5px;"><option>-</option></select><br>';

		section.innerHTML = section.innerHTML + htmlstring;

		var thisUser = Waze.loginManager.user;
		if (thisUser === null) return;
		var usrRank = thisUser.normalizedLevel;
		var thisUserID = thisUser.id;
		//set locks link
		if (usrRank >= 1 || thisUserID == "103267873") { //
			section.innerHTML = section.innerHTML + '<br><a class="btn btn-default" id="LSTRaiseLocks" style="background-color: #93c4d3;   color: #FFFFFF;">Set locks </a>';
			//section.innerHTML = section.innerHTML + '<br><a id="LSTSetCities">Set Cities </a>';
			section.innerHTML = section.innerHTML + '<br><br><font"><input type="checkbox" id="LSTDoNotChangeAutoLocks" class="URCommentsCheckbox"> Do not change auto-locks</font>';
			section.innerHTML = section.innerHTML + '<br><font"><input type="checkbox" id="LSTRemoveManualWhereAutoLock" class="URCommentsCheckbox"> Remove manual locks where auto-locked</font>';
			section.innerHTML = section.innerHTML + '<br><font"><input type="checkbox" id="LSTEnableAbsolute" class="URCommentsCheckbox"> Absolute</font><br>';
		}
		section.innerHTML = section.innerHTML + '<br><font"><input type="checkbox" id="LSTShowHighAutoLocked" class="URCommentsCheckbox"> Show high auto-locks (orange)</font>';
		section.innerHTML = section.innerHTML + '<br><font"><input type="checkbox" id="LSTShowManualAndAuto" class="URCommentsCheckbox"> Show segments that have manual and auto locks (pink)</font>';
		section.innerHTML = section.innerHTML + '<br><input type="checkbox" id="LSTShowHRCSValues" class="URCommentsCheckbox"> Show LST lock Bubbles<br>';
		section.innerHTML = section.innerHTML + '<br><input type="checkbox" id="LSTEnableHighlights" class="URCommentsCheckbox"> Enable Highlights (purple: low; yellow: high)<br>';
		section.innerHTML = section.innerHTML + '<br><input type="text" id="LSTFreway" style="width: 35px; margin-bottom: 5px;"> Freeway<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTfwdToll" style="width: 35px; margin-bottom: 5px;"> Toll<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTRamp" style="width: 35px; margin-bottom: 5px;"> Ramp ';
		section.innerHTML = section.innerHTML + '<input type="checkbox" id="LSTEnableRampHRCS" class="URCommentsCheckbox" title="Highest Rank of Connected Segments"> HRCS<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTMajorHighway" style="width: 35px; margin-bottom: 5px;"> Major Highway<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTMinorHighway" style="width: 35px; margin-bottom: 5px;"> Minor Highway<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTPrimaryStreet" style="width: 35px; margin-bottom: 5px;"> Primary Street ';
		section.innerHTML = section.innerHTML + '<input type="checkbox" id="PrimaryStreetEnableOnewayPlusOne" class="URCommentsCheckbox"> One-way +1<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTRailRoad" style="width: 35px; margin-bottom: 5px;"> Railroad<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTFerry" style="width: 35px; margin-bottom: 5px;"> Ferry<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTStreet" style="width: 35px; margin-bottom: 5px;"> Street ';
		section.innerHTML = section.innerHTML + '<input type="checkbox" id="StreetEnableOnewayPlusOne" class="URCommentsCheckbox"> One-way +1<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTParkingLotRoads" style="width: 35px; margin-bottom: 5px;"> Parking Lot Road<br>';
		//section.innerHTML = section.innerHTML + '<input type="text" id="LSToneWay" style="width: 35px; margin-bottom: 5px;"> One-way Roads<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTRoundabout" style="width: 35px; margin-bottom: 5px;"> Roundabout ';
		section.innerHTML = section.innerHTML + '<input type="checkbox" id="LSTEnableRoundaboutsHRCS" class="URCommentsCheckbox" title="Highest Rank of Connected Segments"> HRCS<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTPrivate" style="width: 35px; margin-bottom: 5px;"> Private ';
		section.innerHTML = section.innerHTML + '<input type="checkbox" id="PrivateEnableOnewayPlusOne" class="URCommentsCheckbox"> One-way +1<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTDirt4x4" style="width: 35px; margin-bottom: 5px;"> Dirt or 4x4<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTWalkingTrail" style="width: 35px; margin-bottom: 5px;"> Walking Trail<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTWBoardwalk" style="width: 35px; margin-bottom: 5px;"> Pedestrian Boardwalk<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTRunway" style="width: 35px; margin-bottom: 5px;"> Runway<br>';
		section.innerHTML = section.innerHTML + '<input type="text" id="LSTStairway" style="width: 35px; margin-bottom: 5px;"> Stairway<br>';
		addon.appendChild(section);

		//var userTabs = getId('user-info');
		//var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
		//$("#user-info ul.nav-tabs").first();
		//$("#user-tabs ul.nav-tabs").first()

		var newtab = document.createElement('li');
		newtab.innerHTML = '<a href="#sidepanel-LST" data-toggle="tab"><span class="icon-lock fa fa-lock" id="LSTlockcolor" style="color: Purple !important; font-size: 15px !important;" Title="LST"></span></a>';

		$("#user-info ul.nav-tabs").first().append(newtab); //production 10/29/2015
		$("#user-tabs ul.nav-tabs").first().append(newtab); //beta 10/29/2015

		addon.id = "sidepanel-LST";
		addon.className = "tab-pane";

		//var tabContent = getElementsByClassName('tab-content', userTabs)[0];
		$("#user-info div.tab-content").first().append(addon); //production 10/29/2015
		$("#user-tabs div.tab-content").first().append(addon); //beta 10/29/2015

		//load area date from sheet
		/*
		var xmlhttpReply = "";
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://docs.google.com/spreadsheets/d/1kZ_1OTpBtmUGOQX-M6EFlRXmr7nupBDv9H6z_lr4RN8/pub?output=tsv",
			onload: function(response) {
				xmlhttpReply = response.responseText.split('\n');
				//toconsole(xmlhttpReply);
				for (var i = 1; i < xmlhttpReply.length; i++) {
					var tempdata = xmlhttpReply[i].split('	');
					//toconsole(tempdata);
					spreadsheetlockarray.push({
						'Timestamp': tempdata[0],
						'AreaName': tempdata[1],
						'Requestor': tempdata[2],
						'Freway': tempdata[3],
						'DoNotChangeAutoLocked': tempdata[4],
						'RemoveManualLocksWhereAutoLock': tempdata[5],
						'ShowHighAutoLocks': tempdata[6],
						'ShowSegmentsAutoAndManual': tempdata[7],
						'Tolls': tempdata[8],
						'Ramps': tempdata[9],
						'MajorHighway': tempdata[10],
						'MinorHighway': tempdata[11],
						'PrimaryStreet': tempdata[12],
						'PrimaryStreetOnewayPlusOne': tempdata[13],
						'RailRoad': tempdata[14],
						'Ferry': tempdata[15],
						'Street': tempdata[16],
						'StreetOnewayPlusOne': tempdata[17],
						'ParkingLotRoads': tempdata[18],
						'Roundabout': tempdata[19],
						'Private': tempdata[20],
						'Dirt4x4': tempdata[21],
						'WalkingTrial': tempdata[22],
						'Boardwalk': tempdata[23],
						'Runway': tempdata[24],
						'Stairway': tempdata[25]
					});
					//toconsole('"' + spreadsheetlockarray[0].StreetOnewayPlusOne + '"');
					var c = '<option style="font-size 12px;" value="' + tempdata[1] + '">' + tempdata[1] + '</option>';
					$("#LSTArea").append(c);

				}

				// restore saved settings
				if (localStorage.LSTHighlightScript) {
					var options = JSON.parse(localStorage.LSTHighlightScript);
					$('#LSTEnableHighlights').prop('checked', options[0]);
					$('#LSTFreway').val(options[1]);
					$('#LSTRamp').val(options[2]);
					$('#LSTMajorHighway').val(options[3]);
					$('#LSTMinorHighway').val(options[4]);
					$('#LSTPrimaryStreet').val(options[5]);
					$('#LSTRailRoad').val(options[6]);
					$('#LSTFerry').val(options[7]);
					$('#LSTStreet').val(options[8]);
					$('#LSTParkingLotRoads').val(options[9]);
					//	$('#LSToneWay').val(options[10]);
					$('#LSTRoundabout').val(options[11]);
					$('#LSTfwdToll').val(options[12]);
					$('#LSTPrivate').val(options[13]);
					$('#LSTEnableRampHRCS').prop('checked', options[14]);
					$('#LSTEnableRoundaboutsHRCS').prop('checked', options[15]);
					$('#LSTShowHighAutoLocked').prop('checked', options[16]);
					$('#LSTDoNotChangeAutoLocks').prop('checked', options[17]);
					$('#LSTRemoveManualWhereAutoLock').prop('checked', options[18]);
					$('#LSTShowManualAndAuto').prop('checked', options[19]);
					$('#PrimaryStreetEnableOnewayPlusOne').prop('checked', options[20]);
					$('#StreetEnableOnewayPlusOne').prop('checked', options[21]);
					$('#LSTDirt4x4').val(options[22]);
					$('#LSTWalkingTrail').val(options[23]);
					$('#LSTWBoardwalk').val(options[24]);
					$('#LSTRunway').val(options[25]);
					$('#LSTStairway').val(options[26]);
					$('#LSTShowHRCSValues').prop('checked', options[27]);
					$('#LSTArea').val(options[28]);
				}

				//Alpha sort the select
				var my_options = $("#LSTArea option");
				var selected = $("#LSTArea").val(); //preserving original selection, step 1
				//toconsole(selected);
				my_options.sort(function(a, b) {
					if (a.text > b.text) return 1;
					else if (a.text < b.text) return -1;
					else return 0;
				});
				$("#LSTArea").empty().append(my_options);
				$("#LSTArea").val(selected); // preserving original selection, step 2
				//end of sort

				window.setInterval(highlightSegments, 1000);
				highlightSegments();
				LSTLoadCities();
			}
		});
		console.log(spreadsheetlockarray);
		*/
		//var spreadsheetlockarray = [];
$.ajax({
	type: 'GET',
	url: 'https://spreadsheets.google.com/feeds/list/1kZ_1OTpBtmUGOQX-M6EFlRXmr7nupBDv9H6z_lr4RN8/oat86fm/public/values',
	jsonp: 'callback',
	data: {
		alt: 'json-in-script'
	},
	dataType: 'jsonp',
	success: function(b) {
		//console.log('success', b);
		for (var i = 0; i < b.feed.entry.length; i++) {
			spreadsheetlockarray.push({
				'Timestamp': b.feed.entry[i].gsx$timestamp.$t,
				'AreaName': b.feed.entry[i].gsx$areaname.$t,
				'Requestor': b.feed.entry[i].gsx$requestor.$t,
				'Freway': b.feed.entry[i].gsx$freeway.$t,
				'DoNotChangeAutoLocked': b.feed.entry[i].gsx$donotchangeautolockedsegmentsthatareabove1.$t,
				'RemoveManualLocksWhereAutoLock': b.feed.entry[i].gsx$removemanuallockswherethereisanautolock.$t,
				'ShowHighAutoLocks': b.feed.entry[i].gsx$showhighautolocks.$t,
				'ShowSegmentsAutoAndManual': b.feed.entry[i].gsx$showsegmentsthatarebothautoandmanuallocked.$t,
				'Tolls': b.feed.entry[i].gsx$tolls.$t,
				'Ramps': b.feed.entry[i].gsx$ramps.$t,
				'MajorHighway': b.feed.entry[i].gsx$majorhighway.$t,
				'MinorHighway': b.feed.entry[i].gsx$minorhighway.$t,
				'PrimaryStreet': b.feed.entry[i].gsx$primarystreet.$t,
				'PrimaryStreetOnewayPlusOne': b.feed.entry[i].gsx$primarystreetonewayplusone.$t,
				'RailRoad': b.feed.entry[i].gsx$railroad.$t,
				'Ferry': b.feed.entry[i].gsx$ferry.$t,
				'Street': b.feed.entry[i].gsx$street.$t,
				'StreetOnewayPlusOne': b.feed.entry[i].gsx$streetonewayplusone.$t,
				'ParkingLotRoads': b.feed.entry[i].gsx$parkinglotroads.$t,
				'Roundabout': b.feed.entry[i].gsx$roundabout.$t,
				'Private': b.feed.entry[i].gsx$private.$t,
				'PrivateEnableOnewayPlusOne': b.feed.entry[i].gsx$privateonewayplusone.$t,
				'PrivateOnewayPlusOne': b.feed.entry[i].gsx$privateonewayplusone.$t,
				'Dirt4x4': b.feed.entry[i].gsx$dirt4x4.$t,
				'WalkingTrial': b.feed.entry[i].gsx$walkingtrail.$t,
				'Boardwalk': b.feed.entry[i].gsx$boardwalk.$t,
				'Runway': b.feed.entry[i].gsx$runway.$t,
				'Stairway': b.feed.entry[i].gsx$stairway.$t
			});
			var c = '<option style="font-size 12px;" value="' + b.feed.entry[i].gsx$areaname.$t + '">' + b.feed.entry[i].gsx$areaname.$t + '</option>';
			$("#LSTArea").append(c);
		}

		// restore saved settings
		if (localStorage.LSTHighlightScript) {
			var options = JSON.parse(localStorage.LSTHighlightScript);
			$('#LSTEnableHighlights').prop('checked', options[0]);
			$('#LSTFreway').val(options[1]);
			$('#LSTRamp').val(options[2]);
			$('#LSTMajorHighway').val(options[3]);
			$('#LSTMinorHighway').val(options[4]);
			$('#LSTPrimaryStreet').val(options[5]);
			$('#LSTRailRoad').val(options[6]);
			$('#LSTFerry').val(options[7]);
			$('#LSTStreet').val(options[8]);
			$('#LSTParkingLotRoads').val(options[9]);
			//	$('#LSToneWay').val(options[10]);
			$('#LSTRoundabout').val(options[11]);
			$('#LSTfwdToll').val(options[12]);
			$('#LSTPrivate').val(options[13]);
			$('#LSTEnableRampHRCS').prop('checked', options[14]);
			$('#LSTEnableRoundaboutsHRCS').prop('checked', options[15]);
			$('#LSTShowHighAutoLocked').prop('checked', options[16]);
			$('#LSTDoNotChangeAutoLocks').prop('checked', options[17]);
			$('#LSTRemoveManualWhereAutoLock').prop('checked', options[18]);
			$('#LSTShowManualAndAuto').prop('checked', options[19]);
			$('#PrimaryStreetEnableOnewayPlusOne').prop('checked', options[20]);
			$('#StreetEnableOnewayPlusOne').prop('checked', options[21]);
			$('#LSTDirt4x4').val(options[22]);
			$('#LSTWalkingTrail').val(options[23]);
			$('#LSTWBoardwalk').val(options[24]);
			$('#LSTRunway').val(options[25]);
			$('#LSTStairway').val(options[26]);
			$('#LSTShowHRCSValues').prop('checked', options[27]);
			$('#LSTArea').val(options[28]);
			$('#PrivateEnableOnewayPlusOne').prop('checked', options[29]);
			
		}

		//Alpha sort the select
		var my_options = $("#LSTArea option");
		var selected = $("#LSTArea").val(); /* preserving original selection, step 1 */
		//toconsole(selected);
		my_options.sort(function(a, b) {
			if (a.text > b.text) return 1;
			else if (a.text < b.text) return -1;
			else return 0;
		});
		$("#LSTArea").empty().append(my_options);
		$("#LSTArea").val(selected); // preserving original selection, step 2
		//end of sort

		//reload the settings if an area is chosen
		//this will overwrite the saved settings incase we have to make changes to the sheet
		if(selected !== "-") {
			LSTChangeArea(selected);
		}
				
		window.setInterval(highlightSegments, 1000);
		highlightSegments();
		LSTLoadCities();
	}
});
//console.log(spreadsheetlockarray);


		// setup onclick handlers for instant update:
		$("#LSTArea").change(LSTChangeArea);
		$('#LSTDoNotChangeAutoLocks').change(LSTManualSettings);
		$('#LSTRemoveManualWhereAutoLock').change(LSTManualSettings);
		$('#LSTShowHighAutoLocked').change(LSTManualSettings);
		$('#LSTShowManualAndAuto').change(LSTManualSettings);
		$('#LSTFreway').change(LSTManualSettings);
		$('#LSTfwdToll').change(LSTManualSettings);
		$('#LSTEnableRampHRCS').change(LSTManualSettings);
		$('#LSTRamp').change(LSTManualSettings);
		$('#LSTMajorHighway').change(LSTManualSettings);
		$('#LSTMinorHighway').change(LSTManualSettings);
		$('#LSTPrimaryStreet').change(LSTManualSettings);
		$('#PrimaryStreetEnableOnewayPlusOne').change(LSTManualSettings);
		$('#LSTRailRoad').change(LSTManualSettings);
		$('#LSTFerry').change(LSTManualSettings);
		$('#LSTStreet').change(LSTManualSettings);
		$('#StreetEnableOnewayPlusOne').change(LSTManualSettings);
		$('#LSTParkingLotRoads').change(LSTManualSettings);
		$('#LSTEnableRoundaboutsHRCS').change(LSTManualSettings);
		$('#LSTRoundabout').change(LSTManualSettings);
		$('#LSTPrivate').change(LSTManualSettings);
		$('#LSTDirt4x4').change(LSTManualSettings);
		$('#LSTWalkingTrail').change(LSTManualSettings);
		$('#LSTWBoardwalk').change(LSTManualSettings);
		$('#LSTRunway').change(LSTManualSettings);
		$('#LSTStairway').change(LSTManualSettings);
		$('#PrivateEnableOnewayPlusOne').change(LSTManualSettings);
		

		//setlocks
		$("#LSTRaiseLocks").click(function() {
			var r = confirm("LST: Please check with your state manager before auto setting the lock levels! If you are not allowed to run this script in your area you may be blocked from editing! \nClick ok to set the lock levels.");
			if (r === true) {
				LHNRaiseLocks();
			}
		});

		/*
		//set cities
		$("#LSTSetCities").click(function() {
			var r = confirm("LST: Please check with your state manager before auto setting the City for every segment! If you are not allowed to run this script in your area you may be blocked from editing! \nClick ok to set the Cities.");
			if (r === true) {
				LSTSetCity();
			}
		});
		*/
		//calback functions

		if (thisUserID == "6945278") { //orbit
			$('#LSTEnableAbsolute').prop('checked', true);
		}

		// overload the WME exit function
		//window.addEventListener("beforeunload", saveHighlightOptions, false);

		// register some events...
		Waze.map.events.register("zoomend", null, highlightSegments);
		Waze.map.events.register("moveend", null, highlightSegments);

		Waze.map.events.register("zoomend", null, LSTLoadCities);
		Waze.map.events.register("moveend", null, LSTLoadCities);


		//Waze.map.events.register("moveend", null, LHNRaiseLocks);
		//Waze.map.events.register("zoomend", null, highlightPlaces);
		//Waze.map.events.register("zoomend", null, highlightSelectedNodes);
		//Waze.selectionManager.events.register("selectionchanged", null, highlightSelectedNodes);
		//Waze.selectionManager.events.register("selectionchanged", null, extraDetails);
		//Waze.loginManager.events.register("afterloginchanged", null, enableAdvancedOptions);
		//Waze.model.events.register("mergeend", null, initCityList);


		//LSTSetupKeyboardShortcuts();
		//add keyboard shortcuts
		WMEKSRegisterKeyboardShortcut('LST', 'Locking Standards Tool', 'LSTShortcut1', 'Sets the locks based on your settings', LHNRaiseLocks, '-1'); //shortcut1
		//WMEKSRegisterKeyboardShortcut('LST', 'Locking Standards Tool', 'LSTShortcut2', 'call KS test function', WMEKSKyboardShortcutToCall, '-1'); //shortcut1

		//load the saved shortcuts
		WMEKSLoadKeyboardShortcuts('LST');
		//before unloading WME save the shortcuts
		window.addEventListener("beforeunload", function() {
			saveHighlightOptions();
			WMEKSSaveKeyboardShortcuts('LST');
		}, false);

	}

	function highlightSegments() {
		var layer = Waze.map.getLayersBy('uniqueName', 'satellite_imagery').first();
		var layerZIdx = layer.getZIndex();
		layerZIdx = Number(layerZIdx);

		var LST = Waze.map.getLayersBy('uniqueName', '__LST').first();
		LST.setZIndex(layerZIdx + 1);
		LSTLayer.destroyFeatures();

		LSTIconLayer.destroyFeatures();

		if (LSTEnableHighlights.checked === true) {
			for (var seg in Waze.model.segments.objects) {
				RampArray = [];
				var segment = Waze.model.segments.get(seg);
				var attributes = segment.attributes;
				var line = segment.geometry.id;
				if (line !== null) {
					var sid = attributes.primaryStreetID;
					if (sid !== null) {
						var hasClosures = attributes.hasClosures; //true false
						if (hasClosures === false) {
							var roadType = attributes.roadType;
							//Waze.model.segments.get(88163272).hasClosures
							//with closure Waze.model.segments.get(88163272).attributes.allowNoDirection

							/*
								1: "Streets",
								2: "Primary Street",
								3: "Freeways",
								4: "Ramps",
								5: "Walking Trails",
								6: "Major Highway",
								7: "Minor Highway",
								8: "Dirt roads",
								10: "Boardwalk",
								14: "Ferry"
								16: "Stairway",
								17: "Private Road",
								18: "Railroad",
								19: "Runway",
								20: "Parking Lot Road",
								------NON USEABLE--------
								21: "Service Road",
								98: "Non-Routable Roads"
								199: "Non-Drivable Roads"
							*/
							var street = Waze.model.streets.get(sid);
							var LockRank = attributes.lockRank;
							var AutoLocksRank = attributes.rank;
							//toconsole(street);
							var cityID = (street !== null) && street.cityID;
							var noCity = false;
							var countryID = 0;
							if (cityID !== null && Waze.model.cities.get(cityID) !== null) {
								noCity = Waze.model.cities.get(cityID).isEmpty;
								countryID = Waze.model.cities.get(cityID).countryID;
							}
							var oneWay = ((attributes.fwdDirection + attributes.revDirection) == 1); // it is 1-way only if either is true
							//var noDirection = (!attributes.fwdDirection && !attributes.revDirection); // Could use the .attribute.allowNoDirection?
							//var hasRestrictions = (attributes.fwdRestrictions.length + attributes.revRestrictions.length > 0);
							//var updatedOn = new Date(attributes.updatedOn);
							//var updatedBy = attributes.updatedBy;
							var roundabout = attributes.junctionID !== null;
							var TollRoad = attributes.fwdToll;
							// default colours
							var newColor = "#dd7700";
							var Freway_lvl = Number($('#LSTFreway').val());
							var Ramp_lvl = Number($('#LSTRamp').val());
							var MajorHighway_lvl = Number($('#LSTMajorHighway').val());
							var MinorHighway_lvl = Number($('#LSTMinorHighway').val());
							var PrimaryStreet_lvl = Number($('#LSTPrimaryStreet').val());
							var RailRoad_lvl = Number($('#LSTRailRoad').val());
							var Ferry_lvl = Number($('#LSTFerry').val());
							var Street_lvl = Number($('#LSTStreet').val());
							var ParkingLotRoad_lvl = Number($('#LSTParkingLotRoads').val());
							var Roundabout_lvl = Number($('#LSTRoundabout').val());
							var fwdToll_lvl = Number($('#LSTfwdToll').val());
							var Private_lvl = Number($('#LSTPrivate').val());
							var LSTDirt4x4_lvl = Number($('#LSTDirt4x4').val());
							var LSTWalkingTrail_lvl = Number($('#LSTWalkingTrail').val());
							var LSTWBoardwalk_lvl = Number($('#LSTWBoardwalk').val());
							var LSTRunway_lvl = Number($('#LSTRunway').val());
							var LSTStairway_lvl = Number($('#LSTStairway').val());

							/*
							//convert locks to waze's format
							Freway_lvl = Freway_lvl - 1;
							Ramp_lvl = Ramp_lvl - 1;
							MajorHighway_lvl = MajorHighway_lvl - 1;
							MinorHighway_lvl = MinorHighway_lvl - 1;
							PrimaryStreet_lvl = PrimaryStreet_lvl - 1;
							RailRoad_lvl = RailRoad_lvl - 1;
							Ferry_lvl = Ferry_lvl - 1;
							Street_lvl = Street_lvl - 1;
							ParkingLotRoad_lvl = ParkingLotRoad_lvl - 1;
							Roundabout_lvl = Roundabout_lvl - 1;
							fwdToll_lvl = fwdToll_lvl - 1;
							Private_lvl = Private_lvl - 1;
							*/
							//normalize lockrank
							if (LockRank === null) {
								LockRank = -1;
							} else {
								LockRank = LockRank + 1;
							}
							//normalize autolock rank
							if (AutoLocksRank === null) {
								AutoLocksRank = -1;
							} else {
								AutoLocksRank = AutoLocksRank + 1;
							}
							var TrackRampToRamp = false;
							//toconsole(attributes.id);
							//HRCS

							var ToLock = 0;
							if ((roadType == 4 && LSTEnableRampHRCS.checked === true) || (roundabout === true && LSTEnableRoundaboutsHRCS.checked === true)) {
								//toconsole("LST hrcs: " + attributes.id);
								//ramps =4 	roundabout=true
								var HRCSHigh = 1;
								var HRCS = 0;
								var fromNodeID = "";
								var toNodeID = "";
								var index = 0;
								//var RampToRamp = "";
								if (roadType == 4) { //ramps
									//toconsole(attributes.id + " HRCSHigh: " + HRCSHigh + " HRCS: " + HRCS + " Lockrank: " + LockRank + " AutoLocksRank: " + AutoLocksRank);
									//toconsole("segid " + attributes.id);
									RampArray = [attributes.id];
									//toconsole("segid " + attributes.id + " Built RampArray " + RampArray);
									//call ramp function to get HRCS down the line
									HRCSHigh = FxRampToRamp(HRCSHigh);

									//toconsole(HRCSHigh);
								} else if (roundabout === true) { //roundabouts
									//toconsole("LST attributes.id: " + attributes.id);
									var junctionID = attributes.junctionID;
									var RounaboutSegments = Waze.model.junctions.objects[junctionID].segIDs;
									for (var roundaboutindex = 0; roundaboutindex < RounaboutSegments.length; ++roundaboutindex) {
										var RoundaboutSingleSegments = Waze.model.junctions.objects[junctionID].segIDs[roundaboutindex];
										//toconsole("LST roundabout segID: " + Waze.model.junctions.objects[junctionID].segIDs[roundaboutindex]);
										fromNodeID = Waze.model.segments.get(RoundaboutSingleSegments).attributes.fromNodeID;
										//toconsole(fromNodeID);
										t = Waze.model.nodes.objects[fromNodeID].attributes.segIDs; //node segments
										//toconsole(t);
										for (index = 0; index < t.length; ++index) {
											if (attributes.id !== t[index]) {
												HRCS = Waze.model.segments.get(t[index]).attributes.lockRank + 1;
												HRCSAutoLock = Waze.model.segments.get(t[index]).attributes.rank + 1;
												if (HRCS > HRCSHigh) {
													HRCSHigh = HRCS;
												}
												if (HRCSAutoLock > HRCSHigh) {
													HRCSHigh = HRCSAutoLock;
												}
												//toconsole("" + attributes.id + " fromseg: " + t[index] + " HRCS: " + HRCS + " HRCSAutoLock: " + HRCSAutoLock + " HRCSHigh: " + HRCSHigh);
											}
										}
										toNodeID = Waze.model.segments.get(RoundaboutSingleSegments).attributes.toNodeID;
										t = Waze.model.nodes.objects[toNodeID].attributes.segIDs; //node segments
										//toconsole(t);
										for (index = 0; index < t.length; ++index) {
											if (attributes.id !== t[index]) {
												HRCS = Waze.model.segments.get(t[index]).attributes.lockRank + 1;
												HRCSAutoLock = Waze.model.segments.get(t[index]).attributes.rank + 1;
												if (HRCS > HRCSHigh) {
													HRCSHigh = HRCS;
												}
												if (HRCSAutoLock > HRCSHigh) {
													HRCSHigh = HRCSAutoLock;
												}
												//toconsole("" + attributes.id + " fromseg: " + t[index] + " HRCS: " + HRCS + " HRCSAutoLock: " + HRCSAutoLock + " HRCSHigh: " + HRCSHigh);
											}
										}
									} //end of looking up all of the roundabout segemtns
								} //end of roundabouts
								newColor = CalculateHighlightColor(HRCSHigh, LockRank, AutoLocksRank, TrackRampToRamp);
								ToLock = HRCSHigh;
								//end of HRCS ramps and roundabouts
							} else if (roundabout === true && Roundabout_lvl > 0 && LSTEnableRoundaboutsHRCS.checked === false) {
								newColor = CalculateHighlightColor(Roundabout_lvl, LockRank, AutoLocksRank);
								ToLock = roundabout;
							} else if (TollRoad === true && fwdToll_lvl > 0) {
								newColor = CalculateHighlightColor(fwdToll_lvl, LockRank, AutoLocksRank);
								ToLock = fwdToll_lvl;
							} else if (Freway_lvl > 0 && roadType == 3) {
								newColor = CalculateHighlightColor(Freway_lvl, LockRank, AutoLocksRank);
								ToLock = Freway_lvl;
							} else if (Ramp_lvl > 0 && roadType == 4 && LSTEnableRampHRCS.checked === false) {
								newColor = CalculateHighlightColor(Ramp_lvl, LockRank, AutoLocksRank);
								ToLock = Ramp_lvl;
							} else if (MajorHighway_lvl > 0 && roadType == 6) {
								newColor = CalculateHighlightColor(MajorHighway_lvl, LockRank, AutoLocksRank);
								ToLock = MajorHighway_lvl;
							} else if (MinorHighway_lvl > 0 && roadType == 7) {
								newColor = CalculateHighlightColor(MinorHighway_lvl, LockRank, AutoLocksRank);
								ToLock = MinorHighway_lvl;
							} else if (PrimaryStreet_lvl > 0 && roadType == 2) {
								if (oneWay === true && PrimaryStreetEnableOnewayPlusOne.checked) {
									PrimaryStreet_lvl = PrimaryStreet_lvl + 1;
								}
								ToLock = PrimaryStreet_lvl;
								newColor = CalculateHighlightColor(PrimaryStreet_lvl, LockRank, AutoLocksRank);								
							} else if (RailRoad_lvl > 0 && roadType == 18) {
								newColor = CalculateHighlightColor(RailRoad_lvl, LockRank, AutoLocksRank);
								ToLock = RailRoad_lvl;
							} else if (Ferry_lvl > 0 && roadType == 14) {
								newColor = CalculateHighlightColor(Ferry_lvl, LockRank, AutoLocksRank);
								ToLock = Ferry_lvl;
							} else if (Street_lvl > 0 && roadType == 1) {
								if (oneWay === true && StreetEnableOnewayPlusOne.checked) {
									Street_lvl = Street_lvl + 1;
								}
								ToLock = Street_lvl;	
								newColor = CalculateHighlightColor(Street_lvl, LockRank, AutoLocksRank);
							} else if (ParkingLotRoad_lvl > 0 && roadType == 20) {
								newColor = CalculateHighlightColor(ParkingLotRoad_lvl, LockRank, AutoLocksRank);
								ToLock = ParkingLotRoad_lvl;
							} else if (Private_lvl > 0 && roadType == 17) {
								if (oneWay === true && PrivateEnableOnewayPlusOne.checked) {
									Private_lvl = Private_lvl + 1;
								}
								ToLock = Private_lvl;
								newColor = CalculateHighlightColor(Private_lvl, LockRank, AutoLocksRank);
								
							} else if (LSTDirt4x4_lvl > 0 && roadType == 8) {
								newColor = CalculateHighlightColor(LSTDirt4x4_lvl, LockRank, AutoLocksRank);
								ToLock = LSTDirt4x4_lvl;
							} else if (LSTWalkingTrail_lvl > 0 && roadType == 5) {
								newColor = CalculateHighlightColor(LSTWalkingTrail_lvl, LockRank, AutoLocksRank);
								ToLock = LSTWalkingTrail_lvl;
							} else if (LSTWBoardwalk_lvl > 0 && roadType == 10) {
								newColor = CalculateHighlightColor(LSTWBoardwalk_lvl, LockRank, AutoLocksRank);
								ToLock = LSTWBoardwalk_lvl;
							} else if (LSTRunway_lvl > 0 && roadType == 19) {
								newColor = CalculateHighlightColor(LSTRunway_lvl, LockRank, AutoLocksRank);
								ToLock = LSTRunway_lvl;
							} else if (LSTStairway_lvl > 0 && roadType == 16) {
								newColor = CalculateHighlightColor(LSTStairway_lvl, LockRank, AutoLocksRank);
								ToLock = LSTStairway_lvl;
							}
							var zoom = Waze.map.getZoom();
							//apply the highlight to the segment
							//toconsole(ToLock)
							if (newColor != "#dd7700" && zoom > 1) { //default
								var Line = Waze.model.segments.objects[seg].attributes.geometry.components;
								drawLine(Line, newColor, attributes.id, ToLock);
							}

							if (Number(LSTCity.value) == Number(cityID) && LSTCity.value !== "-" && LSTCity.value !== "") { //roadType == 5 &&
								var Line = Waze.model.segments.objects[seg].attributes.geometry.components;
								newColor = "#336699"; //blue
								drawLine(Line, newColor, attributes.id, ToLock);
							}

							if (LSTCity.value !== "-" && LSTCity.value !== "" && roadType != 18) { //not railroad
								if (Waze.model.cities.get(cityID).isEmpty === true) { //roadType == 5 &&
									var Line = Waze.model.segments.objects[seg].attributes.geometry.components;
									newColor = "#ff0000"; //red
									drawLine(Line, newColor, attributes.id, ToLock);
								}
							}
						}
					}
				}
			}
		}
	}

	function drawLine(line, newColor, segid, rank) {
		//toconsole(segid);
		var linePoints = [];
		var zoom = Waze.map.getZoom();
		if (zoom > LSTlineWidth.length) {
			var zoom = LSTlineWidth.length - 1;
		}
		for (var i = 0; i < line.length; i++) {
			//toconsole("livemap: xy " + i + " " + line[i].x + " " + line[i].y);
			var p = new OpenLayers.Geometry.Point(line[i].x, line[i].y);
			linePoints.push(p);
		}
		//toconsole(segid + " newColor: " + newColor + " " + linePoints);

		var strokeOpacity = '.85';
		var lineString = new OpenLayers.Geometry.LineString(linePoints);
		var lineFeature = new OpenLayers.Feature.Vector(lineString, null, {
			strokeColor: newColor,
			strokeOpacity: strokeOpacity,
			strokeDashstyle: 'solid',
			strokeLinecap: 'round',
			strokeWidth: LSTlineWidth[zoom][0]
		});
		LSTLayer.addFeatures(lineFeature);

		var externalGraphic = LSTPurple;

		if (newColor == "#909") {
			newColor = '#FFFFFF';
		} else if (newColor == "#E6E600") { //yellow
			externalGraphic = LSTYellow;
			newColor = 'orange';
		} else {
			newColor = '#000000';
		}

		/*
		test road id 60143718
		test road naperville cityId 5105
		test road aurora cityId 5049
		LA cityID 1772

		Waze.model.cities.objects[Waze.model.streets.objects[986853].cityID].name
		Waze.model.streets.objects[60143718].cityID = 5049;

		Waze.model.cities.objects;
		Waze.model.cities.get('1772');
		Waze.model.cities.objects;

		var UpdateObject = require("Waze/Action/UpdateObject");
		var v = Waze.model.streets.objects[60143718];
		W.model.actionManager.add(new UpdateObject(v, {
			cityID: 1772,
		}));
		Waze.model.streets.objects[60143718].cityID
		*/

		lineString = new OpenLayers.Geometry.LineString(linePoints);
		lineFeature = new OpenLayers.Feature.Vector(lineString, null, {
			/*label: ' ' + Waze.model.cities.objects[Waze.model.streets.objects[986853].cityID].name,
			labelOutlineColor: "#000000",
			labelOutlineWidth: 5,
			fontSize: LSTIconWidth[zoom][2],
			fontColor: '#FFFFFF',
			fontOpacity: 0.85,
			fontWeight: "bold",*/
			strokeColor: newColor,
			strokeOpacity: strokeOpacity,
			strokeDashstyle: 'dot',
			strokeLinecap: 'round',
			strokeWidth: LSTlineWidth[zoom][1]
		});
		LSTLayer.addFeatures(lineFeature);

		if (LSTShowHRCSValues.checked === true && rank > 0) {
			var x = getMid(segid);
			var point1 = new OpenLayers.Geometry.Point(x.x, x.y);
			//var lableFeature = new OpenLayers.Feature.Vector(point1); //Important pass true parameter otherwise it will return start point as centroid
			var lableFeature = new OpenLayers.Feature.Vector(
				point1, {
					description: ' ' + rank
				}, {
					label: ' ' + rank,
					labelOutlineColor: "#000000",
					labelOutlineWidth: 5,
					fontSize: LSTIconWidth[zoom][2],
					fontColor: '#FFFFFF',
					fontOpacity: 0.85,
					fontWeight: "bold",
					labelAlign: "cm",
					//externalGraphic: 'http://openlayers.org/en/v3.8.1/examples/data/icon.png',
					externalGraphic: externalGraphic,
					graphicHeight: LSTIconWidth[zoom][0],
					graphicWidth: LSTIconWidth[zoom][0],
					graphicXOffset: -LSTIconWidth[zoom][1],
					graphicYOffset: -LSTIconWidth[zoom][1]
				}
			);
			LSTIconLayer.addFeatures(lableFeature);
		}
	}

	function getMid(segmentId) {
		segment = Waze.model.segments.objects[segmentId].attributes;
		var geoLengths = [];
		for (var i = 1; i < segment.geometry.components.length; i++) {
			var dx = segment.geometry.components[i].x - segment.geometry.components[i - 1].x;
			var dy = segment.geometry.components[i].y - segment.geometry.components[i - 1].y;
			geoLengths.push(Math.sqrt(dx * dx + dy * dy));
		}
		var totalLength = 0;
		var cumulatedLengths = [];
		geoLengths.forEach(function(e) {
			totalLength += e;
			cumulatedLengths.push(totalLength);
		});

		var middle = null;
		cumulatedLengths.forEach(function(e, i) {
			if (middle === null && e > totalLength / 3) {
				var d = geoLengths[i];
				var f = e - totalLength / 3;

				middle = {
					'x': (segment.geometry.components[i + 1].x - segment.geometry.components[i].x) * (d - f) / d + segment.geometry.components[i].x,
					'y': (segment.geometry.components[i + 1].y - segment.geometry.components[i].y) * (d - f) / d + segment.geometry.components[i].y,
					'i': i,
				};

			}
		});

		return middle;
	}

	function FxRampToRamp(HRCSHigh) {
		//var RampArray = [];
		//RampArray[RampArray.length] = '500914532';
		//var HRCSHigh = 1;
		var ConnectedRoadType, HRCSLock, HRCSAutoLock = "";
		var ConnectedToNonRamp = false;
		var TempSegs = [];
		//toconsole("RampArray 1 " + RampArray);
		//toconsole("FxRampToRamp: HRCSHigh: " + HRCSHigh);
		for (var RampToRampIndex = 0; RampToRampIndex < RampArray.length; ++RampToRampIndex) {
			ConnectedRoadType = Waze.model.segments.get(RampArray[RampToRampIndex]).attributes.roadType;


			if (ConnectedRoadType == 4) { // is a ramp

				var RampToRampSegments = Waze.model.segments.get(RampArray[RampToRampIndex]).attributes.toNodeID;
				var RampToRampt = Waze.model.nodes.objects[RampToRampSegments].attributes.segIDs; //node segments
				//toconsole("connected segmetns " + RampToRampt);

				ConnectedToNonRamp = false;

				for (var RampToRampIndex2 = 0; RampToRampIndex2 < RampToRampt.length; ++RampToRampIndex2) {
					ConnectedRoadType2 = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.roadType;
					if (ConnectedRoadType2 == 4) {
						if (RampArray[RampToRampIndex] !== RampToRampt[RampToRampIndex2]) {
							if ($.inArray(RampToRampt[RampToRampIndex2], RampArray) < 0) { //not in array
								TempSegs[TempSegs.length] = RampToRampt[RampToRampIndex2];
							}
							//toconsole("tonodes is a ramp 1 " + RampToRampt[RampToRampIndex2]);
						}
					} else { //not a ramp

						//toconsole("tonodes not a ramp 1 " + RampToRampt[RampToRampIndex2]);

						HRCSLock = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.lockRank + 1;
						HRCSAutoLock = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.rank + 1;
						if (HRCSLock > HRCSHigh) {
							HRCSHigh = HRCSLock;
						}
						if (HRCSAutoLock > HRCSHigh) {
							HRCSHigh = HRCSAutoLock;
						}
						/*
						TempSeg = RampArray[0];
						RampArray = [];
						RampArray[RampArray.length] = TempSeg;
						RampToRampIndex = 0;
						*/
						//break;
						//ConnectedToNonRamp = true;
						//break;
					}
				}

				if (ConnectedToNonRamp === false) {
					Array.prototype.push.apply(RampArray, TempSegs);

				}
				TempSegs = [];
				RampToRampSegments = Waze.model.segments.get(RampArray[RampToRampIndex]).attributes.fromNodeID;
				RampToRampt = Waze.model.nodes.objects[RampToRampSegments].attributes.segIDs; //node segments
				//toconsole("connected segmetns " + RampToRampt);
				ConnectedToNonRamp = false;
				for (RampToRampIndex2 = 0; RampToRampIndex2 < RampToRampt.length; ++RampToRampIndex2) {
					ConnectedRoadType2 = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.roadType;
					if (ConnectedRoadType2 == 4) {
						if (RampArray[RampToRampIndex] !== RampToRampt[RampToRampIndex2]) {
							if ($.inArray(RampToRampt[RampToRampIndex2], RampArray) < 0) { //not in array
								TempSegs[TempSegs.length] = RampToRampt[RampToRampIndex2];
							}
							//toconsole("tonodes is a ramp 2 " + RampToRampt[RampToRampIndex2]);
						}
					} else { //not a ramp

						//toconsole("fromNodes not a ramp 2 " + RampToRampt[RampToRampIndex2]);

						HRCSLock = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.lockRank + 1;
						HRCSAutoLock = Waze.model.segments.get(RampToRampt[RampToRampIndex2]).attributes.rank + 1;
						if (HRCSLock > HRCSHigh) {
							HRCSHigh = HRCSLock;
						}
						if (HRCSAutoLock > HRCSHigh) {
							HRCSHigh = HRCSAutoLock;
						}
						//break;
						//ConnectedToNonRamp = true;
						//break;
					}
				}
				//toconsole("RampArray: " + RampArray);

				if (ConnectedToNonRamp === false) {
					Array.prototype.push.apply(RampArray, TempSegs);
					TempSegs = [];
				}

			} else { //not a ramp
				HRCSLock = Waze.model.segments.get(RampArray[RampToRampIndex]).attributes.lockRank + 1;
				HRCSAutoLock = Waze.model.segments.get(RampArray[RampToRampIndex]).attributes.rank + 1;
				if (HRCSLock > HRCSHigh) {
					HRCSHigh = HRCSLock;
				}
				if (HRCSAutoLock > HRCSHigh) {
					HRCSHigh = HRCSAutoLock;
				}
				//toconsole("non-Ramp " + RampArray[RampToRampIndex] + " HRCSHigh: " + HRCSHigh);
				//return HRCSHigh;
			}
		}
		//toconsole("HRCSHigh " + HRCSHigh);
		return HRCSHigh;
	}

	function CalculateHighlightColor(UsersLockSetting, LockRank, AutoLocksRank, TrackRampToRamp) {
		var newColor = "#dd7700";
		//toconsole("UsersLockSetting:" + UsersLockSetting + " LockRank:" + LockRank + " AutoLocksRank:" + AutoLocksRank + " TrackRampToRamp: " + TrackRampToRamp);
		//UsersLockSetting:3 LockRank:1 AutoLocksRank:3
		if (TrackRampToRamp === true && UsersLockSetting == LockRank) {
			newColor = "#FFFFFF"; //White ramp to ramp
		} else if (LockRank > 0 && UsersLockSetting > LockRank) {
			newColor = "#990099"; //purple under locked
		} else if (AutoLocksRank > 1 && UsersLockSetting > LockRank && LockRank < AutoLocksRank && UsersLockSetting > AutoLocksRank) {
			newColor = "#990099"; //purple under locked
		} else if (AutoLocksRank == 1 && UsersLockSetting > LockRank && UsersLockSetting > 1) {
			newColor = "#990099"; //purple under locked
		} else if (UsersLockSetting > LockRank && UsersLockSetting < AutoLocksRank && LSTShowHighAutoLocked.checked === true) {
			newColor = "#ff8000"; //orange over locked
		} else if (UsersLockSetting < LockRank) {
			newColor = "#E6E600"; //yellow over locked
		} else if (LockRank > 1 && AutoLocksRank > 1 && LSTShowManualAndAuto.checked) {
			newColor = "#ff99ff"; //pink manual locks are the same as autolocks
		}
		return newColor;
	}

	function LHNSetLocks(UpdateObject, v, UsersLockSetting, LockRank, absolute, AutoLocksRank, count) {
		//toconsole("LHNSetLocks AutoLocksRank: " + AutoLocksRank + " LockRank: " + LockRank );
		var UserID = Waze.loginManager.getLoggedInUser().id; //editor's id number
		var UserLevel = W.model.users.objects[UserID].rank + 1; //editor's rank
		if ((LSTRemoveManualWhereAutoLock.checked && AutoLocksRank > 1 && LockRank > 0) || (absolute && UsersLockSetting == 1)) {
			//remove manual lock reverting back to auto lock
			//toconsole("remove manual lock reverting back to auto lock AutoLocksRank: " + AutoLocksRank + " LockRank: " + LockRank );
			count++;
			W.model.actionManager.add(new UpdateObject(v, {
				lockRank: null
			}));
		} else if (LSTDoNotChangeAutoLocks.checked && AutoLocksRank > 1 && LockRank < 0) {
			//do not change auto locked segments
			//toconsole("do not change auto locked segments attrib: " + attributes.id + " AutoLocksRank: " + AutoLocksRank + " LockRank: " + LockRank );
		} else if ((LockRank < UsersLockSetting && UsersLockSetting > 1 && LockRank != UsersLockSetting) || (absolute && LockRank != UsersLockSetting && UserLevel >= LockRank && UserLevel >= AutoLocksRank)) {
			if (UsersLockSetting > UserLevel) {
				UsersLockSetting = UserLevel;
			}
			//toconsole("LHNSetLocks: " + UsersLockSetting);
			//set lock absolute
			//toconsole("set lock absolute attrib: AutoLocksRank: " + AutoLocksRank + " LockRank: " + LockRank );
			count++;
			W.model.actionManager.add(new UpdateObject(v, {
				lockRank: UsersLockSetting - 1
			}));
		}
		return count;
	}

	function LHNRaiseLocks() {
		
		var absolute = "";
		if (LSTEnableAbsolute.checked === true) {
			absolute = true;
			$('#LSTEnableAbsolute').prop('checked', false);
		} else {
			absolute = false;
		}		
		var count = 0;
		var thisUser = Waze.loginManager.user;
		if (thisUser === null) return;
		var usrRank = thisUser.normalizedLevel;
		var UpdateObject;
		if (typeof(require) !== "undefined") {
			UpdateObject = require("Waze/Action/UpdateObject");
		} else {
			UpdateObject = Waze.Action.UpdateObject;
		}		

		function onScreen(obj) {
			if (obj.geometry) {
				return (W.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
			}
			return (false);
		}
		
		for (var seg in Waze.model.segments.objects) {

			var Freway_lvl = Number($('#LSTFreway').val());
			var Ramp_lvl = Number($('#LSTRamp').val());
			var MajorHighway_lvl = Number($('#LSTMajorHighway').val());
			var MinorHighway_lvl = Number($('#LSTMinorHighway').val());
			var PrimaryStreet_lvl = Number($('#LSTPrimaryStreet').val());
			var RailRoad_lvl = Number($('#LSTRailRoad').val());
			var Ferry_lvl = Number($('#LSTFerry').val());
			var Street_lvl = Number($('#LSTStreet').val());
			var ParkingLotRoad_lvl = Number($('#LSTParkingLotRoads').val());
			var Roundabout_lvl = Number($('#LSTRoundabout').val());
			var fwdToll_lvl = Number($('#LSTfwdToll').val());
			var Private_lvl = Number($('#LSTPrivate').val());
			var LSTDirt4x4_lvl = Number($('#LSTDirt4x4').val());
			var LSTWalkingTrail_lvl = Number($('#LSTWalkingTrail').val());
			var LSTWBoardwalk_lvl = Number($('#LSTWBoardwalk').val());
			var LSTRunway_lvl = Number($('#LSTRunway').val());
			var LSTStairway_lvl = Number($('#LSTStairway').val());
			

			if (Freway_lvl > usrRank) Freway_lvl = usrRank;
			if (Ramp_lvl > usrRank) Ramp_lvl = usrRank;
			if (MajorHighway_lvl > usrRank) MajorHighway_lvl = usrRank;
			if (MinorHighway_lvl > usrRank) MinorHighway_lvl = usrRank;
			if (PrimaryStreet_lvl > usrRank) PrimaryStreet_lvl = usrRank;
			if (RailRoad_lvl > usrRank) RailRoad_lvl = usrRank;
			if (Ferry_lvl > usrRank) Ferry_lvl = usrRank;
			if (Street_lvl > usrRank) Street_lvl = usrRank;
			if (ParkingLotRoad_lvl > usrRank) ParkingLotRoad_lvl = usrRank;
			if (Roundabout_lvl > usrRank) Roundabout_lvl = usrRank;
			if (fwdToll_lvl > usrRank) fwdToll_lvl = usrRank;
			if (Private_lvl > usrRank) Private_lvl = usrRank;
			if (LSTDirt4x4_lvl > usrRank) LSTDirt4x4_lvl = usrRank;
			if (LSTWalkingTrail_lvl > usrRank) LSTWalkingTrail_lvl = usrRank;
			if (LSTWBoardwalk_lvl > usrRank) LSTWBoardwalk_lvl = usrRank;
			if (LSTRunway_lvl > usrRank) LSTRunway_lvl = usrRank;
			if (LSTStairway_lvl > usrRank) LSTStairway_lvl = usrRank;

			var v = Waze.model.segments.get(seg);
			var attributes = v.attributes;
			var roadType = attributes.roadType;
			var LockRank = attributes.lockRank;
			var AutoLocksRank = attributes.rank;
			//normalize lockrank
			if (LockRank === null) {
				LockRank = -1;
			} else {
				LockRank = LockRank + 1;
			}
			//normalize autolock rank
			if (AutoLocksRank === null) {
				AutoLocksRank = -1;
			} else {
				AutoLocksRank = AutoLocksRank + 1;
			}
			var oneWay = ((attributes.fwdDirection + attributes.revDirection) == 1); // it is 1-way only if either is true
			
			var roundabout = attributes.junctionID !== null;
			var TollRoad = attributes.fwdToll;
			//var hasClosures = attributes.hasClosures; //true false
			if (count < 150 && onScreen(v) && v.isGeometryEditable()) { //&& v.isGeometryEditable()  && hasClosures === false
				if ((roadType == 4 && LSTEnableRampHRCS.checked === true) || (roundabout === true && LSTEnableRoundaboutsHRCS.checked === true)) { //ramps =4 	roundabout=true
					var HRCSHigh = 1;
					var HRCS = "";
					var fromNodeID = "";
					var toNodeID = "";
					var index = 0;
					if (roadType == 4) { //ramps
						//toconsole(attributes.id + " HRCSHigh: " + HRCSHigh + " HRCS: " + HRCS + " Lockrank: " + LockRank + " AutoLocksRank: " + AutoLocksRank);
						//toconsole("segid " + attributes.id);
						RampArray = [attributes.id];
						//toconsole("segid " + attributes.id + " Built RampArray " + RampArray);
						//call ramp function to get HRCS down the line
						HRCSHigh = FxRampToRamp(HRCSHigh);
					} else if (roundabout === true) { //roundabouts
						//toconsole("LST attributes.id: " + attributes.id);
						var junctionID = attributes.junctionID;
						var RounaboutSegments = Waze.model.junctions.objects[junctionID].segIDs;
						for (var roundaboutindex = 0; roundaboutindex < RounaboutSegments.length; ++roundaboutindex) {
							var RoundaboutSingleSegments = Waze.model.junctions.objects[junctionID].segIDs[roundaboutindex];
							//toconsole("LST roundabout segID: " + Waze.model.junctions.objects[junctionID].segIDs[roundaboutindex]);
							fromNodeID = Waze.model.segments.get(RoundaboutSingleSegments).attributes.fromNodeID;
							//toconsole(fromNodeID);
							t = Waze.model.nodes.objects[fromNodeID].attributes.segIDs; //node segments
							//toconsole(t);
							for (index = 0; index < t.length; ++index) {
								if (attributes.id !== t[index]) {
									HRCS = Waze.model.segments.get(t[index]).attributes.lockRank + 1;
									HRCSAutoLock = Waze.model.segments.get(t[index]).attributes.rank + 1;
									//toconsole(t[index] + " fromNodeID " + HRCS);
									if (HRCS > HRCSHigh) {
										HRCSHigh = HRCS;
									}
									if (HRCSAutoLock > HRCSHigh) {
										HRCSHigh = HRCSAutoLock;
									}
								}
							}
							toNodeID = Waze.model.segments.get(RoundaboutSingleSegments).attributes.toNodeID;
							t = Waze.model.nodes.objects[toNodeID].attributes.segIDs; //node segments
							//toconsole(t);
							for (index = 0; index < t.length; ++index) {
								if (attributes.id !== t[index]) {
									HRCS = Waze.model.segments.get(t[index]).attributes.lockRank + 1;
									HRCSAutoLock = Waze.model.segments.get(t[index]).attributes.rank + 1;
									//toconsole(t[index] + " toNodeID " + HRCS);
									if (HRCS > HRCSHigh) {
										HRCSHigh = HRCS;
									}
									if (HRCSAutoLock > HRCSHigh) {
										HRCSHigh = HRCSAutoLock;
									}
								}
							}
						} //end of looking up all of the roundabout segemtns
					} //end of roundabouts
					//toconsole(HRCSHigh);
					LHNSetLocks(UpdateObject, v, HRCSHigh, LockRank, absolute, AutoLocksRank, count);
					// end of ramps and roundabouts HRCS
				} else if (Roundabout_lvl > 0 && LSTEnableRoundaboutsHRCS.checked === false && roundabout === true) {
					LHNSetLocks(UpdateObject, v, Roundabout_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (fwdToll_lvl > 0 && TollRoad === true) {
					LHNSetLocks(UpdateObject, v, fwdToll_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (Freway_lvl > 0 && roadType == 3) {
					LHNSetLocks(UpdateObject, v, Freway_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (Ramp_lvl > 0 && roadType == 4 && LSTEnableRampHRCS.checked === false) {
					LHNSetLocks(UpdateObject, v, Ramp_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (MajorHighway_lvl > 0 && roadType == 6) {
					LHNSetLocks(UpdateObject, v, MajorHighway_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (MinorHighway_lvl > 0 && roadType == 7) {
					LHNSetLocks(UpdateObject, v, MinorHighway_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (PrimaryStreet_lvl > 0 && roadType == 2) {
					if (oneWay === true && PrimaryStreetEnableOnewayPlusOne.checked) {
						PrimaryStreet_lvl = PrimaryStreet_lvl + 1;
					}
					LHNSetLocks(UpdateObject, v, PrimaryStreet_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (RailRoad_lvl > 0 && roadType == 18) {
					LHNSetLocks(UpdateObject, v, RailRoad_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (Ferry_lvl > 0 && roadType == 14) {
					LHNSetLocks(UpdateObject, v, Ferry_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (Street_lvl > 0 && roadType == 1) {
					if (oneWay === true && StreetEnableOnewayPlusOne.checked) {
						Street_lvl = Street_lvl + 1;
					}
					LHNSetLocks(UpdateObject, v, Street_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (ParkingLotRoad_lvl > 0 && roadType == 20) {
					LHNSetLocks(UpdateObject, v, ParkingLotRoad_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (Private_lvl > 0 && roadType == 17) {
					if (oneWay === true && PrivateEnableOnewayPlusOne.checked) {
						Private_lvl = Private_lvl + 1;
					}
					LHNSetLocks(UpdateObject, v, Private_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (LSTDirt4x4_lvl > 0 && roadType == 8) {
					LHNSetLocks(UpdateObject, v, LSTDirt4x4_lvl, LockRank, absolute, AutoLocksRank, count);
					newColor = CalculateHighlightColor(LSTDirt4x4_lvl, LockRank, AutoLocksRank);
				} else if (LSTWalkingTrail_lvl > 0 && roadType == 5) {
					LHNSetLocks(UpdateObject, v, LSTWalkingTrail_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (LSTWBoardwalk_lvl > 0 && roadType == 10) {
					LHNSetLocks(UpdateObject, v, LSTWBoardwalk_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (LSTRunway_lvl > 0 && roadType == 19) {
					LHNSetLocks(UpdateObject, v, LSTRunway_lvl, LockRank, absolute, AutoLocksRank, count);
				} else if (LSTStairway_lvl > 0 && roadType == 16) {
					LHNSetLocks(UpdateObject, v, LSTStairway_lvl, LockRank, absolute, AutoLocksRank, count);
				}
			}
		}
	}

	function getBool(val) {
		var num = +val;
		return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '');
	}

	function LSTChangeArea() {
		//toconsole('' + LSTArea.value);
		//toconsole(spreadsheetlockarray);
		for (var i = 0; i < spreadsheetlockarray.length; i++) {
			if (LSTArea.value == spreadsheetlockarray[i].AreaName) {
				//spreadsheetlockarray[i].Timestamp;
				//spreadsheetlockarray[i].AreaName;
				//spreadsheetlockarray[i].Requestor;
				LSTFreway.value = spreadsheetlockarray[i].Freway;
				$('#LSTDoNotChangeAutoLocks').prop('checked', getBool(spreadsheetlockarray[i].DoNotChangeAutoLocked));
				$('#LSTRemoveManualWhereAutoLock').prop('checked', getBool(spreadsheetlockarray[i].RemoveManualLocksWhereAutoLock));
				$('#LSTShowHighAutoLocked').prop('checked', getBool(spreadsheetlockarray[i].ShowHighAutoLocks));
				$('#LSTShowManualAndAuto').prop('checked', getBool(spreadsheetlockarray[i].ShowSegmentsAutoAndManual));
				LSTfwdToll.value = spreadsheetlockarray[i].Tolls;
				if (spreadsheetlockarray[i].Ramps == 'HRCS') {
					$('#LSTEnableRampHRCS').prop('checked', true);
					LSTRamp.value = 0;
				} else {
					$('#LSTEnableRampHRCS').prop('checked', false);
					LSTRamp.value = spreadsheetlockarray[i].Ramps;
				}
				LSTMajorHighway.value = spreadsheetlockarray[i].MajorHighway;
				LSTMinorHighway.value = spreadsheetlockarray[i].MinorHighway;
				LSTPrimaryStreet.value = spreadsheetlockarray[i].PrimaryStreet;
				$('#PrimaryStreetEnableOnewayPlusOne').prop('checked', getBool(spreadsheetlockarray[i].PrimaryStreetOnewayPlusOne));
				console.log(spreadsheetlockarray[i].PrimaryStreetOnewayPlusOne);
				LSTRailRoad.value = spreadsheetlockarray[i].RailRoad;
				LSTFerry.value = spreadsheetlockarray[i].Ferry;
				LSTStreet.value = spreadsheetlockarray[i].Street;
				$('#StreetEnableOnewayPlusOne').prop('checked', getBool(spreadsheetlockarray[i].StreetOnewayPlusOne));
				LSTParkingLotRoads.value = spreadsheetlockarray[i].ParkingLotRoads;
				if (spreadsheetlockarray[i].Roundabout == 'HRCS') {
					$('#LSTEnableRoundaboutsHRCS').prop('checked', true);
					LSTRoundabout.value = 0;
				} else {
					$('#LSTEnableRoundaboutsHRCS').prop('checked', false);
					LSTRoundabout.value = spreadsheetlockarray[i].Roundabout;
				}
				LSTPrivate.value = spreadsheetlockarray[i].Private;
				$('#PrivateEnableOnewayPlusOne').prop('checked', getBool(spreadsheetlockarray[i].PrivateEnableOnewayPlusOne));
				
				LSTDirt4x4.value = spreadsheetlockarray[i].Dirt4x4;
				LSTWalkingTrail.value = spreadsheetlockarray[i].WalkingTrial;
				LSTWBoardwalk.value = spreadsheetlockarray[i].Boardwalk;
				LSTRunway.value = spreadsheetlockarray[i].Runway;
				LSTStairway.value = spreadsheetlockarray[i].Stairway;

				break;
			}

			
			
		}
		//area was chaged assume that the editor wants to see the highlights and enable highlights
		$('#LSTEnableHighlights').prop('checked', true);
		saveHighlightOptions();
		highlightSegments();
	}

	function saveHighlightOptions() {
		if (localStorage) {
			//toconsole("WME Highlights: saving options");
			var options = [];
			// preserve previous options which may get lost after logout
			//if (localStorage.LSTHighlightScript) options = JSON.parse(localStorage.LSTHighlightScript);
			options[0] = $('#LSTEnableHighlights').prop('checked');
			options[1] = $('#LSTFreway').val();
			options[2] = $('#LSTRamp').val();
			options[3] = $('#LSTMajorHighway').val();
			options[4] = $('#LSTMinorHighway').val();
			options[5] = $('#LSTPrimaryStreet').val();
			options[6] = $('#LSTRailRoad').val();
			options[7] = $('#LSTFerry').val();
			options[8] = $('#LSTStreet').val();
			options[9] = $('#LSTParkingLotRoads').val();
			//	options[10] = $('#LSToneWay').val();
			options[11] = $('#LSTRoundabout').val();
			options[12] = $('#LSTfwdToll').val();
			options[13] = $('#LSTPrivate').val();
			options[14] = $('#LSTEnableRampHRCS').prop('checked');
			options[15] = $('#LSTEnableRoundaboutsHRCS').prop('checked');
			options[16] = $('#LSTShowHighAutoLocked').prop('checked');
			options[17] = $('#LSTDoNotChangeAutoLocks').prop('checked');
			options[18] = $('#LSTRemoveManualWhereAutoLock').prop('checked');
			options[19] = $('#LSTShowManualAndAuto').prop('checked');
			options[20] = $('#PrimaryStreetEnableOnewayPlusOne').prop('checked');
			options[21] = $('#StreetEnableOnewayPlusOne').prop('checked');
			options[22] = $('#LSTDirt4x4').val();
			options[23] = $('#LSTWalkingTrail').val();
			options[24] = $('#LSTWBoardwalk').val();
			options[25] = $('#LSTRunway').val();
			options[26] = $('#LSTStairway').val();
			options[27] = $('#LSTShowHRCSValues').prop('checked');
			options[28] = $('#LSTArea').val(); //area drop down
			options[29] = $('#PrivateEnableOnewayPlusOne').prop('checked');
			
			//toconsole(JSON.stringify(options));
			localStorage.LSTHighlightScript = JSON.stringify(options);
		}
	}

	function LSTManualSettings() {
		//toconsole("LSTManualSettings");
		$('#LSTArea').val('-');
		saveHighlightOptions();
	}

	function LSTLoadCities() {
		var selected = $("#LSTCity").val(); /* preserving original selection, step 1 */
		//toconsole("selected " + selected);
		$('#LSTCity option').remove();
		$('#LSTCity').append($('<option>', {
			value: '-',
			text: '-'
		}));

		for (var name in Waze.model.cities.objects) {
			if (Waze.model.cities.objects[name].isEmpty === false) {
				//toconsole(Waze.model.cities.objects[name].name);
				$('#LSTCity').append($('<option>', {
					value: Waze.model.cities.objects[name].id,
					text: Waze.model.cities.objects[name].name + " " + Waze.model.cities.objects[name].id
				}));
			}
		}

		//Alpha sort the select
		var my_options = $("#LSTCity option");
		//toconsole(selected);
		my_options.sort(function(a, b) {
			if (a.text > b.text) return 1;
			else if (a.text < b.text) return -1;
			else return 0;
		});
		$("#LSTCity").empty().append(my_options);
		$("#LSTCity").val(selected); // preserving original selection, step 2
		//end of sort
	}

	function LSTSetCity() {
		/*
		var UserID = Waze.loginManager.getLoggedInUser().id; //editor's id number
		var UserLevel = W.model.users.objects[UserID].rank + 1; //editor's rank
		function onScreen(obj) {
			if (obj.geometry) {
				return (W.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
			}
			return (false);
		}
		for (var seg in Waze.model.segments.objects) {
			var segment = Waze.model.segments.get(seg);
			var attributes = segment.attributes;
			var line = getId(segment.geometry.id);
			if (line !== null) {
				var sid = attributes.primaryStreetID;
				if (sid !== null) {
					var hasClosures = attributes.hasClosures; //true false
					if (hasClosures === false) {
						var roadType = attributes.roadType;
						var street = Waze.model.streets.get(sid);
						var LockRank = attributes.lockRank + 1;
						var AutoLocksRank = attributes.rank + 1;
						var cityID = (street !== null) && street.cityID;
						var noCity = false;
						var countryID = 0;
						if (cityID !== null && Waze.model.cities.get(cityID) !== null) {
							noCity = Waze.model.cities.get(cityID).isEmpty;
							countryID = Waze.model.cities.get(cityID).countryID;
						}

						//1: "Streets",
						//2: "Primary Street",
						//3: "Freeways",
						//4: "Ramps",
						//5: "Walking Trails",
						//6: "Major Highway",
						//7: "Minor Highway",
						//8: "Dirt roads",
						//10: "Boardwalk",
						//14: "Ferry"
						//16: "Stairway",
						//17: "Private Road",
						//18: "Railroad",
						//19: "Runway",
						//20: "Parking Lot Road",

				if (onScreen(segment) === true && UserLevel >= LockRank && UserLevel >= AutoLocksRank && segment.isGeometryEditable() === true) { //count < 150 &&

							//toconsole(attributes.id + " " + UserLevel + " " + LockRank + " " + AutoLocksRank );
							//toconsole(attributes.id + " isGeometryEditable " + segment.isGeometryEditable());
							//toconsole(attributes.id + " " +);
							//toconsole(attributes.id + " " +);
							//500927009


							if (roadType == 5) {
								if (Number(LSTCity.value) !== Number(cityID) && LSTCity.value !== "-") {

									//Waze.model.streets.objects['501342708'];
									var segid = '78351399';
									var primaryStreetID = Waze.model.segments.objects[segid].attributes.primaryStreetID;
									//	Waze.model.streets.objects[primaryStreetID];
									var UpdateObject = require("Waze/Action/UpdateObject","Waze/Action/UpdateFeatureAddress");
									var v = Waze.model.streets.objects[primaryStreetID];
									W.model.actionManager.add(new UpdateObject(v, {
										cityID: Number(LSTCity.value),
										//isEmpty: false
									}));




									//var sid = '501342708';
									//var UpdateObject = require("Waze/Action/UpdateObject");
									//var v = Waze.model.streets.objects[sid];
									//W.model.actionManager.add(new UpdateObject(v, {
									//	cityID: Number(LSTCity.value),
									//	emptyCity: true
									//}));



									//segment id 500927009
									//primaryStreetID: 10111299
									//Waze.model.streets.objects['10111299'];

									var segid = '500927009';
									var primaryStreetID = Waze.model.segments.objects[segid].attributes.primaryStreetID;
									var cityID = Waze.model.streets.objects[primaryStreetID].cityID;
									toconsole(cityID);

									Waze.model.segments.objects['500927009'].attributes.cityID;
									//500927009
									var cityID = Waze.model.cities.objects[cityID];

									var newAttributes,
									UpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress');
									//v = v || item;
									//if (v && address && address.state && address.country) {
									newAttributes = {
										//countryID: address.country.id, //data in cities
										//stateID: address.state.id, //data in cities

										cityName: 'Test',
										//cityID: Number(LSTCity.value), //data in streets
										//emptyCity: address.city.name ? null : true,
										//streetName: address.street.name, //data in
										//emptyStreet: address.street.name ? null : true
									};
									W.model.actionManager.add(new UpdateFeatureAddress(v, newAttributes));
									//}

								}
							}
						}
					}
				}
			}
		}
		*/
	}
})();