// ==UserScript==
// @name        WME AutoUR-SK
// @namespace   com.supermedic.wmeautour
// @description Autofill UR comment boxes with user defined canned messages
// @version     0.16.12SK
// @grant       none
// @match       https://editor-beta.waze.com/*editor/*
// @match       https://www.waze.com/*editor/*
// @thx			RickZAbel for the icon
// @icon      	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAlCAYAAAC6TzLyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMzZiNThiMS1jNjMxLWU4NGEtOWJkNi1lZDhlMTc3ODMwYTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDMzOThDRTg4NjVEMTFFNDhGOTdBMjgwMzlCNkU5OEYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDMzOThDRTc4NjVEMTFFNDhGOTdBMjgwMzlCNkU5OEYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODE4MzI1YmUtZWRjOS0zYjQzLTkyZDctOTZkOTkyMjFkMzE4IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ODRjODI0MDAtODY1ZC0xMWU0LThjNzgt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
// @downloadURL https://update.greasyfork.org/scripts/7090/WME%20AutoUR-SK.user.js
// @updateURL https://update.greasyfork.org/scripts/7090/WME%20AutoUR-SK.meta.js
// ==/UserScript==


/* Changelog
 * 0.16.12SK - Bug fixes
 * 0.16.11SK - updated logs, default fill button,
 * 0.16.10SK - Fixed panel display vs place(point)/place(area)/segment/user-info
 * 0.16.9SK - Cleaned up commented code
 * 0.16.8SK - Unicode Fix, NI/Solve button fix
 * 0.16.7SK - UR Center button, updateInfo rewrite
 * 0.16.6SK - Start button added to SK div, removed native info
 * 0.16.5SK - autoUR interface moved, enabled, insert tested
 * 0.16.4SK - minMax, close, autoUR migration started
 * 0.16.3SK - Comment actions completed
 * 0.16.2SK - Status actions completed
 * 0.16.1SK - UI Populated, need actions
 * 0.16.0SK - Complete UI re built, need to populate
 */

var version = '0.16.12SK';

function wme_auto_ur_bootstrap() {
  console.info("WME-AutoUR: starting (bootstrap)");
	var bGreasemonkeyServiceDefined     = false;

	try {
		if ("object" === typeof Components.interfaces.gmIGreasemonkeyService) {
			bGreasemonkeyServiceDefined = true;
		}
	}
	catch (err) {
		//Ignore.
	}
	if ( "undefined" === typeof unsafeWindow  ||  ! bGreasemonkeyServiceDefined) {
		unsafeWindow    = ( function () {
			var dummyElem   = document.createElement('p');
			dummyElem.setAttribute ('onclick', 'return window;');
			return dummyElem.onclick ();
		} ) ();
	}
	/* begin running the code! */
	WMEAutoUR_Create();
}

//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------------  WMEAutoUR FUNCTIONS  -----------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
/**
 *@since version 0.10.0
 */
function WMEAutoUR_Create() {
	unsafeWindow.WMEAutoUR = {};
	WMEAutoUR.version = version;
	WMEAutoUR.logPrefix = 'WMEAutoUR';

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//-------------  ##########  START CODE FUNCTION ##########  ---------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.0.1
	 */
	WMEAutoUR.startcode = function () {
		console.info("WME-AutoUR: startcode");
		try {
			if ("undefined" != typeof Waze.map ) {
				console.info("WME-AutoUR: ready to go");
				WMEAutoUR.init();
			} else {
				console.info("WME-AutoUR: waiting for WME to load...");
				setTimeout(WMEAutoUR.startcode, 1000);
			}
		} catch(err) {
			console.info("WME-AutoUR: waiting for WME to load...(caught in an error)");
			console.info("WME-AutoUR: Error:" + err.lineNumber + ") "+err);
			setTimeout(WMEAutoUR.startcode, 1000);
		}
	};
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//-------------  ##########  START CODE FUNCTION ##########  ---------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.0.1
	 */
	WMEAutoUR.init = function() {
			WMEAutoUR.isBeta = null;
		if(Waze.Config.api_base === "/Descartes-beta/app") {
			WMEAutoUR.isBeta = true;
		} else if(Waze.Config.api_base === "/Descartes-live/app") {
			WMEAutoUR.isBeta = false;
		}
		// --- Setup Options --- //
		WMEAutoUR.Options = {};
		// --- Setup Intervals --- //
		WMEAutoUR.Intervals = {};
		// --- Load Settings --- //
		WMEAutoUR.Settings.Load();
		console.info("WME-AutoUR: starting (init)");
		// --- Create Floating UI --- //
		WMEAutoUR_Create_TabbedUI();
		WMEAutoUR.Auto.index = 0;
		WMEAutoUR.showDevInfo();
		$(document).tooltip();
		W.model.mapUpdateRequests.events.register("objectschanged", null, WMEAutoUR.UR.URsRefreshed);
		W.model.mapUpdateRequests.events.register("objectsadded", null, WMEAutoUR.UR.URsRefreshed);
		W.model.mapUpdateRequests.events.register("objectsremoved", null, WMEAutoUR.UR.URsRefreshed);
		WMEAutoUR.UR.URsRefreshed();
	};


	//--------------------------------------------------------------------------------------------------------------------------------------------
	//----------------------  Actions  -----------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since 0.10.0
	 */
	WMEAutoUR.Actions = {
		updateObject: require("Waze/Action/UpdateObject")
	}


	//--------------------------------------------------------------------------------------------------------------------------------------------
	//----------------------  MANUAL UR FUNCTIONS  -----------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since 0.10.0
	 */
	WMEAutoUR.UR = {

		/**
		 *@since version 0.9.0
		 */
		newURSelected: function() {
			// --- Make beta UR window draggable --- //
			window.setTimeout(function(){$('#panel-container .panel').draggable();},750);
			console.info("WME-AutoUR newURSelected");
			WMEAutoUR.UR.selectedURid = $(this).attr('data-id');
			$('.map-problem.selected').removeClass('selected');
			$('.map-problem[data-id="'+WMEAutoUR.UR.selectedURid+'"]').addClass('selected');
			console.info("WME-AutoUR selected ID: "+WMEAutoUR.UR.selectedURid);
			WMEAutoUR.UI.update();
			WMEAutoUR.Messages.ChangeEditor(Waze.model.mapUpdateRequests.objects[WMEAutoUR.UR.selectedURid].attributes.type);
			//WMEAutoUR.Messages.ShowComment();
		},

		/**
		 *@since version 0.2.0
		 */
		getInfo: function() {
			console.info(WMEAutoUR.logPrefix+': getInfo');
			var urID = WMEAutoUR.UR.selectedURid;
			if((typeof(Waze.model.updateRequestSessions.objects[urID])==='undefined')) {
				Waze.model.updateRequestSessions.get(urID);
				console.info('RequestSession fail');
				return false;
			}

			var urObj = Waze.model.mapUpdateRequests.objects[urID];
			var urSesObj = Waze.model.updateRequestSessions.objects[urID];

			var now_time = new Date().getTime(); // (error number)
			var error_id = urObj.attributes.id; // (id)
			//var error_num = urObj.attributes.type; // (error number)
			var error_txt = urObj.attributes.typeText; // (error text)

			var error_x = Waze.model.mapUpdateRequests.objects[urID].attributes.geometry.y; //  (y coord)
			var error_y = Waze.model.mapUpdateRequests.objects[urID].attributes.geometry.x; //  (x coord)

			var error_drive_date_obj = new Date(Waze.model.mapUpdateRequests.objects[urID].attributes.driveDate); //  (created usec)
			var error_update_date_obj = new Date(Waze.model.mapUpdateRequests.objects[urID].attributes.updatedOn); //  (updated usec)

			var update_date = Math.floor(((((now_time - error_update_date_obj.getTime())/1000)/60)/60)/24);
			update_days = ((update_date>180)?'never':(update_date + " days"));
			var drive_days = Math.floor(((((now_time - error_drive_date_obj.getTime())/1000)/60)/60)/24) + " days";

			var update_user_id = Waze.model.mapUpdateRequests.objects[urID].attributes.updatedBy;
			var update_user = (update_user_id>0)?Waze.model.users.get(update_user_id).userName:'Reporter';


			var ret = {};
			ret.header = {errorText:urObj.attributes.typeText,
						  severity:urObj.attributes.severity,
						  open:urObj.attributes.open,
						  createDate:(new Date(urObj.attributes.driveDate).toDateString()),
						  createDays:drive_days,
						  updateDate:(new Date(urObj.attributes.updatedOn).toDateString()),
						  updateDays:update_days,
						  updateUser:update_user,
						  updateUserID:update_user_id,
						  urid:urID,
						  x:error_x,
						  y:error_y};
			ret.problem = urObj.attributes.description;
			ret.info = {drive:urSesObj.driveGeometry,
						route:urSesObj.routeGeometry};
			ret.conv = urSesObj.comments;
			ret.status = urObj.attributes.resolution;

			return ret;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------

		/**
		 *@since version 0.2.0
		 */
		URsRefreshed: function() {
			$('.map-problem.user-generated').click(WMEAutoUR.UR.newURSelected);
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------

		/**
		 *@since version 0.2.0
		 */
		updateStatus: function(status,state) {
			var curID = WMEAutoUR.UR.selectedURid;
			var action = new WMEAutoUR.Actions.updateObject(Waze.model.mapUpdateRequests.get(curID), {resolution:status,open:state})
			Waze.model.actionManager.add(action);
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------

		/**
		 *@since version 0.2.0
		 */
		addComment: function(comment) {
			var curID = WMEAutoUR.UR.selectedURid;
			Waze.model.updateRequestSessions.objects[curID].addComment(comment);
			//WMEAutoUR.UI.addComment(comment);
			//var cmtAry = Waze.model.updateRequestSessions.objects[curID].comments;
			//console.info(cmtAry);
			//WMEAutoUR.UI.addComment(cmtAry[(cmtAry.length)]);
			WMEAutoUR.UI.addComment({text:comment,userID:(Waze.app.attributes.user.id),createdOn:(new Date().getTime())});
		}
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//----------------------  END MANUAL UR FUNCTIONS  -------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//----------------------  AUTO UR FUNCTIONS  -------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	WMEAutoUR.Auto = {

		/**
		 *@since version 0.1.0
		 */
		getIDs: function() {

			console.info(WMEAutoUR.logPrefix+": Getting Screen IDs");
			$('#WazeMap').removeClass('problem-selected');
			$('#WazeMap').addClass('problem-selected');
			var WMEAutoURViewport = Waze.map.getExtent();
			var WMEAutoURViewTop = WMEAutoURViewport.top;
			var WMEAutoURViewBottom = WMEAutoURViewport.bottom;
			var WMEAutoURViewLeft = WMEAutoURViewport.left;
			var WMEAutoURViewRight = WMEAutoURViewport.right;

			WMEAutoUR.Auto.UR_VIEW_IDs = []; // IDs in view
			WMEAutoUR.Auto.UR_WORK_IDs = []; // IDs after filter
			WMEAutoUR.Auto.UR_len = 0;
			WMEAutoUR.Auto.index = 0;
			for(var e in Waze.model.mapUpdateRequests.objects) {

				var cur_x = W.model.mapUpdateRequests.objects[e].attributes.geometry.x;
				var cur_y = W.model.mapUpdateRequests.objects[e].attributes.geometry.y;

				if((cur_x > WMEAutoURViewport.left) && (cur_x < WMEAutoURViewport.right)) {
					if((cur_y > WMEAutoURViewport.bottom) && (cur_y < WMEAutoURViewport.top)) {
						WMEAutoUR.Auto.UR_VIEW_IDs.push(e);
						console.info(WMEAutoUR.logPrefix+": screenID "+e);
					}
				}
			}
			W.model.updateRequestSessions.get(WMEAutoUR.Auto.UR_VIEW_IDs);
// --- WHY ARE WE WAITING HERE? --- //
			window.setTimeout(WMEAutoUR.Auto.filterURs,1500);

			WMEAutoUR.Auto.index = 0;
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.11.8RE
		 */
		filterURs: function() {
			console.info(WMEAutoUR.logPrefix+": FILTER URS");

			// --- now in usec --- //
			var now_time = new Date().getTime();

			for(var i=0; i<WMEAutoUR.Auto.UR_VIEW_IDs.length;i++) {
				var cur_ur_id = WMEAutoUR.Auto.UR_VIEW_IDs[i];
				// --- NO FILTER --- //
				if(WMEAutoUR.Auto.specialRejects(cur_ur_id)) continue;
				if($("#WME_AutoUR_Filter_button").val() == '2') {
					WMEAutoUR.Auto.UR_len++;
					WMEAutoUR.Auto.UR_WORK_IDs.push(cur_ur_id);
					continue;
				}
				// --- CHECK SPECIAL --- //
				if(WMEAutoUR.Auto.reporterComments(cur_ur_id)) continue;
				// --- INITIAL COMMENT --- //
				if($("#WME_AutoUR_Filter_button").val() == '-1') {
					if(WMEAutoUR.Auto.Comments.initial(cur_ur_id)){
						WMEAutoUR.Auto.UR_len++;
						WMEAutoUR.Auto.UR_WORK_IDs.push(cur_ur_id);
						continue;
					}
				}
				//// === SET UP TIMES === ////
				// --- created in usec --- //
				var drive_date_obj = new Date(Waze.model.mapUpdateRequests.objects[cur_ur_id].attributes.driveDate);
				// --- created in days --- //
				var drive_date = Math.floor(((((now_time - drive_date_obj.getTime())/1000)/60)/60)/24);
				// --- updated (commented) in usec --- //
				var update_date_obj = new Date(Waze.model.mapUpdateRequests.objects[cur_ur_id].attributes.updatedOn);
				// --- updated (commented) in days --- //
				var update_date = Math.floor(((((now_time - update_date_obj.getTime())/1000)/60)/60)/24);


				  // --- STALE COMMENT --- //
				if($("#WME_AutoUR_Filter_button").val() == '0') {
					if(WMEAutoUR.Auto.Comments.stale(cur_ur_id,update_date)) {
						WMEAutoUR.Auto.UR_len++;
						WMEAutoUR.Auto.UR_WORK_IDs.push(cur_ur_id);
						continue;
					}
				}
				  // --- DEAD COMMENT --- //
				if($("#WME_AutoUR_Filter_button").val() == '1') {
					if(WMEAutoUR.Auto.Comments.dead(cur_ur_id,update_date)) {
						WMEAutoUR.Auto.UR_len++;
						WMEAutoUR.Auto.UR_WORK_IDs.push(cur_ur_id);
						continue;
					}
				}
			}
			//console.info(WMEAutoUR.Auto.UR_WORK_IDs);

			if(WMEAutoUR.Auto.UR_len) {
				$('span[id="WME_AutoUR_Count"]').html((WMEAutoUR.Auto.index+1)+"/"+WMEAutoUR.Auto.UR_len);
				window.setTimeout(WMEAutoUR.Auto.firstUR,750);
			} else {
				$('span[id="WME_AutoUR_Count"]').html("0/0");
			}
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------

		Comments: {

			/**
			 *@since version 0.12.3
			 */
			initial: function(cur_id) {
				if(!Waze.model.mapUpdateRequests.objects[cur_id].attributes.hasComments) {
					return true;
				}
				return false;
			},
			//--------------------------------------------------------------------------------------------------------------------------------------------
			/**
			 *@since version 0.12.3
			 */
			stale: function(cur_id,update) {
				if(Waze.model.updateRequestSessions.objects[cur_id].comments.length == 1) {
					if((update > WMEAutoUR.Options.settings.staleDays)) {
						return true;
					}
				}
				return false;
			},
			//--------------------------------------------------------------------------------------------------------------------------------------------
			/**
			 *@since version 0.12.3
			 */
			dead: function(cur_id,update) {
				if(Waze.model.updateRequestSessions.objects[cur_id].comments.length == 2) {
					if((update > WMEAutoUR.Options.settings.deadDays)) {
						return true;
					}
				}
				return false;
			},
			//--------------------------------------------------------------------------------------------------------------------------------------------
			/**
			 *@since version 0.12.3
			 */
			clean: function(cur_id) {
				var cur_ur_obj = Waze.model.mapUpdateRequests.objects[cur_id];
				if(!cur_ur_obj.attributes.hasComments) {
					WMEAutoUR.Auto.UR_len++;
					WMEAutoUR.Auto.UR_WORK_IDs.push(cur_id);
				}
				return;
			}

		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.11.16RE
		 */
		specialRejects: function(urID) {
			//var exp = /^\[([a-zA-Z]*)\]/;
			var ur_desc = Waze.model.mapUpdateRequests.objects[urID].attributes.description;
			if(ur_desc) {
				if(ur_desc.match(/^\[.*\]/)) {
					switch(ur_desc.match(/^\[([a-zA-Z]*)\]/)[1]) {
						case 'ROADWORKS':
						case 'CONSTRUCTION':
						case 'CLOSURE':
						case 'EVENT':
						case 'NOTE':		return true;
						default:		return false;
					}
				}
			}
			return false;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.11.17RE
		 */
		reporterComments: function(urID) {
			var reporter_comment = Waze.model.updateRequestSessions.objects[urID].comments;
			for(var i=0;i<reporter_comment.length;i++) {
				if(!reporter_comment[i].userID) {
					console.info(WMEAutoUR.logPrefix+": YES reporter comments");
					return true;
				}
			}
			console.info(WMEAutoUR.logPrefix+": NO reporter comments");
			return false;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.1.0
		 */
		firstUR: function() {
			console.info(WMEAutoUR.logPrefix+": FIRST");
			WMEAutoUR.Auto.index = 0;
			WMEAutoUR.Auto.gotoURByIndex();
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.1.0
		 */
		Next: function() {
			console.info(WMEAutoUR.logPrefix+": NEXT");
			if((WMEAutoUR.Auto.index+1) < WMEAutoUR.Auto.UR_len) {
				++WMEAutoUR.Auto.index;
				WMEAutoUR.Auto.gotoURByIndex();
				if(WMEAutoUR.Auto.gotoURByIndex()) {
					WMEAutoUR.Auto.Next();
				}
			}
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.1.0
		 */
		Prev: function() {
			console.info(WMEAutoUR.logPrefix+": prevUR");
			if(WMEAutoUR.Auto.index > 0) {
				--WMEAutoUR.Auto.index;
				if(WMEAutoUR.Auto.gotoURByIndex()) {
					WMEAutoUR.Auto.Prev();
				}
			}
		},
		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.1.0
		 */
		gotoURByIndex: function() {
			console.info("gotoINDEX");
			if(WMEAutoUR.Auto.UR_WORK_IDs.length===0)return;
			var curURid = WMEAutoUR.Auto.UR_WORK_IDs[WMEAutoUR.Auto.index];
			if(typeof(W.model.mapUpdateRequests.objects[curURid]) === 'undefined') {
				console.info('Bad URid');
				WMEAutoUR.Auto.removeBadIndex();
				//return true;
			}
			WMEAutoUR.Auto.gotoURById(curURid);
			//return false;
		},
		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.1.0
		 */
		removeBadIndex: function() {
			console.info("removeBadIndex");
			var tmp_ary1 = WMEAutoUR.Auto.UR_WORK_IDs.slice(0,(WMEAutoUR.Auto.index-1));
			var tmp_ary2 = WMEAutoUR.Auto.UR_WORK_IDs.slice((WMEAutoUR.Auto.index));
			var removed = tmp_ary2.shift();
			WMEAutoUR.Auto.UR_WORK_IDs = tmp_ary1.concat(tmp_ary2)
			WMEAutoUR.Auto.UR_len = WMEAutoUR.Auto.UR_WORK_IDs.length;
			WMEAutoUR.Auto.gotoURByIndex();
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.1.0
		 */
		gotoURById: function(URid) {
			WMEAutoUR.UR.selectedURid = URid;
			console.info("gotoID "+URid);
			$('span[id="WME_AutoUR_Count"]').html((WMEAutoUR.Auto.index+1)+"/"+WMEAutoUR.Auto.UR_len);
			$('.map-problem.selected').removeClass('selected');
			$('.map-problem[data-id="'+URid+'"]').addClass('selected');
			// --- NEED TO MAKE FOR BETA --- //
			//Waze.updateRequestsControl.selectById(URid);
			WMEAutoUR.UI.update();
			var x = W.model.mapUpdateRequests.objects[URid].attributes.geometry.x;
			var y = W.model.mapUpdateRequests.objects[URid].attributes.geometry.y;
			Waze.map.setCenter([x,y],3);
			WMEAutoUR.Messages.ChangeEditor(Waze.model.mapUpdateRequests.objects[URid].attributes.type);
			//WMEAutoUR.Messages.ShowComment();
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.1.0
		 */
		filterButton: function(e) {
			switch($("#WME_AutoUR_Filter_button").val()) {
				case '2':		$("#WME_AutoUR_Filter_button").val(-1)
															  .css("background-color","Green")
															  .css("color","White")
															  .html("Initial");	break;
				case '0':		$("#WME_AutoUR_Filter_button").val(1)
															  .css("background-color","Red")
															  .css("color","black")
															  .html("Dead");	break;
				case '-1':		$("#WME_AutoUR_Filter_button").val(0)
															  .css("background-color","Yellow")
															  .css("color","black")
															  .html("Stale");	break;
				case '1':
				default:		$("#WME_AutoUR_Filter_button").val(2)
															  .css("background-color","White")
															  .css("color","Black")
															  .html("None");	break;
			}

			return;
		}
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//----------------------  END AUTO UR FUNCTIONS  ---------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//----------------------  STORAGE/SETTINGS/MESSAGES FUNCTIONS  -------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since 0.10.0
	 */
	WMEAutoUR.Settings = {

		/**
		 *@since version 0.4.1
		 */
		Save: function() {
			console.info("WME-AutoUR: Save All");

			WMEAutoUR.Settings.saveMessages();
			WMEAutoUR.Settings.saveSettings();
			WMEAutoUR.Settings.saveToStorage();
		},

		/**
		 *@since version 0.4.1
		 */
		saveMessages: function() {
			console.info("WME-AutoUR: Save Messages");
		},

		/**
		 *@since version 0.4.1
		 */
		saveSettings: function() {
			console.info("WME-AutoUR: Save Settings");
			WMEAutoUR.Options.settings.staleDays = 				$('#UR_Stale_Days').val();
			WMEAutoUR.Options.settings.deadDays = 				$('#UR_Dead_Days').val();
			WMEAutoUR.Options.settings.firstURTextareaTime = 	$('#UR_First_TA_Time').val();
			WMEAutoUR.Options.settings.nextURTextareaTime = 	$('#UR_Next_TA_Time').val();
		},

		/**
		 *@since version 0.4.1
		 */
		saveToStorage: function() {
			localStorage.setItem('WME_AutoUR', JSON.stringify(WMEAutoUR.Options));
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.4.2
		 */
		Load: function() {

			console.info("WME-AutoUR: Load Settings");
			var newOpts
			//console.info(localStorage.WME_AutoUR);
			try {
				newOpts = JSON.parse(localStorage.WME_AutoUR);
			} catch(e){
				// --- SOMETHING SHOUDL BE HERE --- //
			}

			if(typeof(newOpts) !== 'undefined') {
				WMEAutoUR.Options = newOpts;
			}

			// --- Load Defaults --- //
			var field = 0;
			try {
				if(WMEAutoUR.Options.names[50]) {
				  console.info("Name test: "+WMEAutoUR.Options.names[50]);
				} else {
					throw "";
				}
			} catch(e) {
				field += 1;
			}
			try {
				if(WMEAutoUR.Options.messages[50]) {
				  console.info("Message test: "+WMEAutoUR.Options.messages[50]);
				} else {
					throw "";
				}
			} catch(e) {
				field += 2;
			}
			try {
				if(WMEAutoUR.Options.settings.nextURTextareaTime) {
					console.info("Settings test: "+WMEAutoUR.Options.settings.nextURTextareaTime);
				} else {
					throw "";
				}
			} catch(e) {
				field += 4;
			}
			console.info(WMEAutoUR.logPrefix+": settings field "+field);
			if(field) {
				WMEAutoUR.Settings.setDefault(field);
			}


			console.info("WME-AutoUR: checking defaults... done");
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.12.1
		 */
		setDefault: function() {
			console.info("setDefault");
			// --- Setup Defaults --- //
			var def_names = [];
			def_names[6] = "Incorrect turn";
			def_names[7] = "Incorrect address";
			def_names[8] = "Incorrect route";
			def_names[9] = "Missing roundabout";
			def_names[10] = "General error";
			def_names[11] = "Turn not allowed";
			def_names[12] = "Incorrect junction";
			def_names[13] = "Missing bridge overpass";
			def_names[14] = "Wrong driving direction";
			def_names[15] = "Missing Exit";
			def_names[16] = "Missing Road";
			def_names[18] = "Missing Landmark";
			def_names[19] = "Blocked Road";
			def_names[21] = "Missing Street Name";
			def_names[22] = "Incorrect Street Prefix or Suffix";
			def_names[50] = "Stale UR";
			def_names[51] = "Dead UR";

			// --- Thank you RickZAbel --- //
			var def_messages = [];
			$.each(def_names, function(k,v) {
				if(v) {
					def_messages[k] = "Thank you for your report! Can you please give me more information about the " + v + " you reported?";
				}
			});

			def_messages[50] = "Without further information this report will be closed soon.";
			def_messages[51] = "Without further information we are unable fix this report. Please resubmit with more information.";

			var def_settings = {};
			def_settings.staleDays = 7;
			def_settings.deadDays = 7;
			def_settings.firstURTextareaTime = 1000;
			def_settings.nextURTextareaTime = 500;

			// --- Load Defaults --- //
			if((typeof(arguments[0]) == 'number')) {
				var field = arguments[0];
				if(field >= 4) {
					WMEAutoUR.Options.settings = def_settings;
					field -= 4;
				}
				if(field >= 2) {
					WMEAutoUR.Options.messages = def_messages;
					field -= 2;
				}
				if(field == 1) {
					WMEAutoUR.Options.names = def_names;
					field -= 1;
				}
			} else {
				WMEAutoUR.Options.names = def_names;
				WMEAutoUR.Options.messages = def_messages;
				WMEAutoUR.Options.settings = def_settings;
			}

			console.info(WMEAutoUR.Options.settings);

			WMEAutoUR.Settings.saveToStorage();

		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.5.0
		 */
		Reset: function() {
			console.info("WME-AutoUR: RESET");
			WMEAutoUR.Settings.setDefault(7);

			$('#WMEAutoUR_Settings_Comment').val(WMEAutoUR.Options.messages[6]);
			WMEAutoUR.Settings.resetMessages();
			WMEAutoUR.Settings.resetSettings();
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.5.0
		 */
		resetMessages: function() {
			console.info("WME-AutoUR: reset messages");
			$('#WMEAutoUR_Settings_Select').empty();
			$('#WMEAutoUR_Insert_Select').empty();

			$('#WME_AutoUR_MSG_Display').html('');
			WMEAutoUR_TabbedUI.createSelect($('#WMEAutoUR_Settings_Select'));
			WMEAutoUR_TabbedUI.createSelect($('#WMEAutoUR_Insert_Select'));
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.5.0
		 */
		resetSettings: function() {

			console.info("WME-AutoUR: reset settings");
			$('#UR_Stale_Days').val(WMEAutoUR.Options.settings.staleDays);
			$('#UR_Dead_Days').val(WMEAutoUR.Options.settings.deadDays);
			$('#UR_First_TA_Time').val(WMEAutoUR.Options.settings.firstURTextareaTime);
			$('#UR_Next_TA_Time').val(WMEAutoUR.Options.settings.nextURTextareaTime);
		}
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since 0.10.0
	 */
	WMEAutoUR.Messages = {
		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.5.0
		 */
		SaveSettingSelect: function() {
			var id = null;
			if($(this).val() >= 1) {
				id = $(this).val();
			} else {
				id = $('#WMEAutoUR_Settings_Select').val();
			}
			console.info(WMEAutoUR.logPrefix+": save selectID "+id);
			console.info('Before: '+WMEAutoUR.Options.messages[id]);
			WMEAutoUR.Options.messages[id] = $("#WMEAutoUR_Settings_Comment").val();
			console.info('After: '+WMEAutoUR.Options.messages[id]);
			WMEAutoUR.Settings.saveToStorage();
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.5.0
		 */
		ChangeSettingSelect: function() {
			var index = $(this).val();

			if(index === null) {
				index = $("#WMEAutoUR_Settings_Select").val();
			}

			console.info(WMEAutoUR.logPrefix+": change selectID "+index);
			$("#WMEAutoUR_Settings_Comment").val(WMEAutoUR.Options.messages[index]);
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.5.0
		 */
		ChangeEditor: function() {
			var index;
			console.info("CHANGE");
			if((arguments.length == 1) && (typeof arguments[0] == "number")) {
				index = arguments[0];
				$('#WMEAutoUR_Insert_Select').val(index);
			} else {
				index = $(this).val();
			}
			if(index === null) {
				index = $("#WMEAutoUR_Insert_Select").val();
			}
			console.info("Set ID");
			if($("#WME_AutoUR_Filter_button").val() === '0') {
				index = 50;
			} else if($("#WME_AutoUR_Filter_button").val() === '1') {
				index = 51;
			}
			console.info("Filter ID");
			console.info(WMEAutoUR.logPrefix+": editor selectID "+index);
			$("#WME_AutoUR_MSG_Display").html(WMEAutoUR.Options.messages[index]);
			$('#WMEAutoUR_Insert_Select').val(index);
			console.info("Ofsets: "+WMEAutoUR.Options.settings.firstURTextareaTime+" : "+WMEAutoUR.Options.settings.nextURTextareaTime);

			try {
				if($("#update-request-panel textarea").length!==0) {
					setTimeout(WMEAutoUR.Messages.insertFromSelect, WMEAutoUR.Options.settings.nextURTextareaTime);
					console.info("We Have TA wait 500");
				} else {
					setTimeout(WMEAutoUR.Messages.insertFromSelect, WMEAutoUR.Options.settings.firstURTextareaTime);
					console.info("NO TA wait 1000");
				}
			} catch(err) {
				console.info("WME-AutoUR: Error:"+err);
			}
			console.info("Insert/return");
		},


		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.3.0
		 */
		Insert: function() {
			if(!$('#WMEAutoUR_AutoFill_CB').prop('checked')) return;
			console.info("INSERT");
			var urID = WMEAutoUR.UR.selectedURid;
			$('#autoUR-sidebar .conversation .autour-comment-box').val(WMEAutoUR.Options.messages[$('#WMEAutoUR_Insert_Select').val()]);
		},


		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.3.0
		 */
		insertFromSelect: function() {
			if(!$('#WMEAutoUR_AutoFill_CB').prop('checked')) return;
			//$('#update-request-panel textarea').html(WMEAutoUR.Options.messages[$('#WMEAutoUR_Insert_Select').val()]);
			$('#autoUR-sidebar .conversation .autour-comment-box').val(WMEAutoUR.Options.messages[$('#WMEAutoUR_Insert_Select').val()]);
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.11.12RE
		 */
		Close: function() {
			$(".problem-panel-navigation button.close-button").trigger('click');
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.11.12RE
		 */
		Send: function() {
			$('.new-comment-form button[type="submit"]').trigger('click');
			// --- MOVE NEXT --- //
			if($('#WMEAutoUR_AutoAdvance_CB').prop('checked')) {
				window.setTimeout(WMEAutoUR.Auto.Next,500);
			}
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.11.12RE
		 */
		ShowComment: function() {
			if(!($("#edit-request btn.toggle-comment-view").hasClass('comment-view-shown'))) {
				window.setTimeout(WMEAutoUR.Messages.ShowComment,250);
				$("#edit-request btn.toggle-comment-view").trigger('click');
			}
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.12.5
		 */
		addCustom: function() {
			var name = $('#WMEAutoUR_Settings_customName').val();
			if(WMEAutoUR.Options.messages.length<60) {
				WMEAutoUR.Options.names[60] = name;
			} else {
				WMEAutoUR.Options.names.push(name);
			}

			WMEAutoUR.Settings.resetMessages();
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.11.11RE
		 */
		changeStatus: function() {
		  	var val = -1;
			var state = true;
			switch($(this).val()) {
				case 'not-identified':	val += 1;
				case 'solved':			val += 1;	state = false;
				case 'open':			val += 0;
			}
			$('input#state-'+$(this).val()).prop('checked','true');

			$('#autoUR-sidebar.problem-edit').attr('data-state',$(this).val());
			WMEAutoUR.UR.updateStatus(val,state);

			// --- CHANGE STATUS --- //
			if($('#WMEAutoUR_SendMessage_CB').prop('checked')) {
				WMEAutoUR.Messages.Send();
			} else {
				// --- MOVE NEXT --- //
				if($('#WMEAutoUR_AutoAdvance_CB').prop('checked')) {
					window.setTimeout(WMEAutoUR.Auto.Next,500);
				}
			}

			return;
		}
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//----------------------  END STORAGE/SETTINGS?MESSAGES FUNCTIONS  ---------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since 0.10.0
	 */
	WMEAutoUR.UI = {

		build: function() {
			if(!$('#autoUR-sidebar')[0]) {
				var main = this.main();
				$(main).append(this.header());
				//$(main).append(this.problem());
				$(main).append(this.autoUR());
				$(main).append(this.conversation());
				$(main).append(this.info());
				$(main).append(this.status());
				$(main).append($('<div>').css('clear','both'));
				$('#edit-panel').before(main);
			}
			$('#panel-container').css('display','none');
			Waze.selectionManager.events.register('selectionchanged',null,WMEAutoUR.UI.selectChanged);
			//this.update();
		},

		update: function() {

			var urInfo = WMEAutoUR.UR.getInfo();
			console.info(WMEAutoUR.logPrefix+": UI.update");
			if(!urInfo) {
				window.setTimeout(WMEAutoUR.UI.update,500);
				console.info(WMEAutoUR.logPrefix+': urInfo fail');
				return;
			}

			$('#autoUR-sidebar').removeClass(); // Removes all classes
			$('#autoUR-sidebar').addClass('problem-edit'); // adds main class
			// --- HEADER --- //
			$('#autoUR-sidebar').addClass('severity-'+urInfo.header.severity); // adds severity class

			if(!urInfo.header.open) {
				if(urInfo.status === 0) {
					$('input#state-solved').prop('checked','true');
					$('#autoUR-sidebar').attr('data-state','solved'); // adds severity class
				} else if(urInfo.status === 1) {
					$('input#state-not-identified').prop('checked','true');
					$('#autoUR-sidebar').attr('data-state','not-identified'); // adds severity class
				}
			} else {
				$('input#state-open').prop('checked','true');
				$('#autoUR-sidebar').attr('data-state','open'); // adds severity class
			}

			// --- MapLink --- //
			WMEAutoUR.UI.latLon = new OpenLayers.LonLat(urInfo.header.y,urInfo.header.x)
			//WMEAutoUR.UI.latLon.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"))

			$('#autoUR-sidebar .header .type').html(urInfo.header.errorText); // adds type
			$('#autoUR-sidebar .header .reported').html('<b>Reported:</b> '+urInfo.header.createDate+' ('+urInfo.header.createDays+')'); // adds reported date
			$('#autoUR-sidebar .header .updated').html('<b>Updated:</b> '+urInfo.header.updateDate+' ('+urInfo.header.updateDays+' - '+urInfo.header.updateUser+')')
												 .attr('title','userID: '+urInfo.header.updateUserID); // adds updated date
			$('#autoUR-sidebar .header .urid').html('<b>URID:</b> '+urInfo.header.urid); // adds URID
			if(urInfo.problem) {
				$('#autoUR-sidebar .header .problem').css('display','block')
													 .html('<b>Problem:</b><br> '+urInfo.problem); // adds Comment
			} else {
				$('#autoUR-sidebar .header .problem').css('display','none');
			}

			// --- Problem --- //
			if(urInfo.problem) {
				$('#autoUR-sidebar .section.problem').css('display','block');
				$('#autoUR-sidebar .section.problem .content').html(urInfo.problem); // adds reported date
			} else {
				$('#autoUR-sidebar .section.problem').css('display','none');
			}
			// --- Info --- //
			if(urInfo.info.drive) {
				$('#autoUR-sidebar .section.information').css('display','block');
				$('#autoUR-sidebar .section.information .content').html('Overlay Info'); // adds reported date
			} else if(urInfo.info.route) {
				$('#autoUR-sidebar .section.information').css('display','block');
				$('#autoUR-sidebar .section.information .content').html('Overlay Info'); // adds reported date
			} else {
				$('#autoUR-sidebar .section.information').css('display','none');
			}
			// --- Convo --- //
			$('#autoUR-sidebar .comment-list.list-unstyled').empty();
			$('.conversation .comment-count-badge').html('0');
			if(urInfo.conv) {
				$('#autoUR-sidebar .section.conversation .no-comments').css('display','none');
				$(urInfo.conv).each(function(k,v){WMEAutoUR.UI.addComment(v);})
				$('#autoUR-sidebar ul.comment-list').scrollTop($('#autoUR-sidebar ul.comment-list')[0].scrollHeight);
			} else {
				$('#autoUR-sidebar .section.conversation .no-comments').css('display','block');
			}

			$('#edit-panel ').css('display','none');
			$('#autoUR-style').html('#user-info{display:none !important;}');
			$('#autoUR-sidebar').css('display','block');
			WMEAutoUR.UI.maximize();

			console.info("URS objs: "+Waze.model.updateRequestSessions.objects);
		},

		main: function() {
			var urDIV = $('<div>').attr('id','autoUR-sidebar')
								  .css('display','none')
								  .css('width','100%')
								  .css('margin','7px 0 0 -5px')
								  .css('overflow','hidden')
								  .addClass('problem-edit')
								  .addClass('severity-high')
								  .addClass('autoUR')
								  .attr('data-state','open');
			var style = $('<style>').attr('id','autoUR-style');
									//.html('#user-info{display:none !important;}');

			$(urDIV).append(style);
			return urDIV;
		},

		header: function() {
			var div = $('<div>').addClass('header')
								.css('width','100%')
								.css('color','#000000');
			$(div).append($('<a>').addClass('close-panel').css('color','inherit')
														  .css('float','right')
														  .css('font-size','16px')
														  .css('padding-left','5px')
														  .css('text-decoration','none')
														  .append($('<b>').html('x').css('cursor','pointer').click(WMEAutoUR.UI.close)));
			$(div).append($('<a>').addClass('close-panel').css('color','inherit')
														  .css('float','right')
														  .css('font-size','16px')
														  .css('padding-right','5px')
														  .css('text-decoration','none')
														  .append($('<b>').html('&#x00B1').css('cursor','pointer').click(WMEAutoUR.UI.minMax)));
			$(div).append($('<a>').addClass('focus').append($('<i>').addClass('icon-screenshot')).click(WMEAutoUR.UI.reZoom).css('color','inherit'));
			$(div).append($('<div>').addClass('type').text('Error').css('font-weight','bold'));
			$(div).append($('<div>').addClass('reported').css('margin-top','10px').css('line-height','14px'));
			$(div).append($('<div>').addClass('updated').css('font-size','11px').css('line-height','14px'));
			$(div).append($('<div>').addClass('urid').css('font-size','11px').css('line-height','14px'));
			$(div).append($('<div>').addClass('problem').css('font-size','11px').css('line-height','14px').css('margin-top','5px'));
			return div;
		},

		autoUR: function() {
			var div = $('<div>').addClass('section autour collapsed');
			$(div).append($('<div>').addClass('title')
									.html("AutoUR " + WMEAutoUR.version)
									.click(this.collapseToggle));
			$(div).append($('<div>').addClass('collapsible')
									.addClass('content')
									.css('padding','10px 15px'));
			return div;

		},

		problem: function() {
			var div = $('<div>').addClass('section problem collapsed').css('display','none');
			$(div).append($('<div>').addClass('title')
									.html('Problem')
									.click(this.collapseToggle));
			$(div).append($('<div>').addClass('collapsible')
									.addClass('content'));
			return div;

		},

		info: function() {
			var div = $('<div>').addClass('section information collapsed').css('display','none');
			$(div).append($('<div>').addClass('title')
									.html('Information')
									.click(this.collapseToggle));
			$(div).append($('<div>').addClass('collapsible')
									.addClass('content'));
			return div;
		},

		conversation: function() {
			var div = $('<div>').addClass('section conversation collapsed');
			$(div).append($('<div>').addClass('title')
									.html('Conversation')
									.click(this.collapseToggle)
									.append($('<span>').addClass('comment-count-badge').html('0').css('margin-left','5px')));
			var ccMain = $('<div>').addClass('collapsible content');
			var ccView = $('<div>').addClass('conversation-view');
			var ccDiv = $('<div>').addClass('conversation-view');
			var ccNoCmt = $('<div>').addClass('no-comments').css('display','none')
								.html('No comments yet.<br>You can ask the user who reported this issue for more information');
			$(ccDiv).append(ccNoCmt);
			$(ccView).append(ccDiv);
			$(ccMain).append(ccView);
			var ccList = $('<ul>').addClass('comment-list list-unstyled');
			$(ccMain).append(ccList);
			var ccForm = $('<div>').addClass('clearfix new-comment-form');
			var ccFormTA = $('<textarea>').addClass('form-control new-comment-text autour-comment-box')
										  .attr('placeholder','Enter comment...')
										  .prop('required','true')
										  .css('resize','vertical');
			var ccFormBTN = $('<button>').addClass('btn btn-default').attr('type','text').html('Send').click(WMEAutoUR.UI.sendComment);
			$(ccForm).append(ccFormTA);
			$(ccForm).append(ccFormBTN);
			$(ccMain).append(ccForm);
			$(div).append(ccMain);
			//var ccFormFLW = $('<input>').attr('type','checkbox').attr('name','follow').attr('value','on').attr('id','follow-on');
			return div;
		},

		addComment: function(v) {
			console.info(WMEAutoUR.logPrefix+': addComment '+v);
			var ccLi = $('<li>').addClass('comment');
			var ccLiT = $('<div>').addClass('comment-title');
			var ccLiTun = $('<span>').addClass('username').css('margin-right','3px');
			if(v.userID<0) {
				ccLiTun.addClass('reporter').html('Reporter');
			} else {
			   ccLiTun.html(Waze.model.users.get(v.userID).userName+'('+Waze.model.users.get(v.userID).normalizedLevel+')');
			}
			var ccLiTday = $('<span>').addClass('date').html(new Date(v.createdOn).toDateString());
			var ccLiTtxt = $('<span>').addClass('text').html(v.text).css('clear','both').css('display','block');

			$(ccLiT).append(ccLiTun);
			$(ccLiT).append(ccLiTday);
			$(ccLiT).append(ccLiTtxt);
			$(ccLi).append(ccLiT);

			$('#autoUR-sidebar .comment-list.list-unstyled').append(ccLi);
			var msgCount = $('.conversation .comment-count-badge').html();
			$('.conversation .comment-count-badge').html(++msgCount);
		},

		status: function() {
			var div = $('<div>').addClass('section actions');
			$(div).append($('<div>').addClass('title')
									.html('Report As')
									.click(this.collapseToggle));
			var content = $('<div>').addClass('collapsible')
									.addClass('content');
			var form = $('<form>').addClass('controls-container');
			$(form).append($('<input>').attr('type','radio').attr('name','state').val('open').attr('id','state-open').prop('checked','true').change(this.changeStatus));
			$(form).append($('<label>').attr('for','state-open').html('Open').css('font-weight','bold'));
			$(form).append($('<input>').attr('type','radio').attr('name','state').val('solved').attr('id','state-solved').change(this.changeStatus));
			$(form).append($('<label>').attr('for','state-solved').html('Solved').css('font-weight','bold'));
			$(form).append($('<input>').attr('type','radio').attr('name','state').val('not-identified').attr('id','state-not-identified').change(this.changeStatus));
			$(form).append($('<label>').attr('for','state-not-identified').html('Not Identified').css('font-weight','bold'));

			$(content).append(form);
			$(div).append(content);
			return div;
		},

		collapseToggle: function() {
			switch($(this).parent().hasClass('collapsed')) {
				case true:	$(this).parent().removeClass('collapsed');	break;
				default:	$(this).parent().addClass('collapsed');		break;
			}
		},

		changeStatus: function() {
			var val = -1;
			var state = true;
			switch($(this).val()) {
				case 'not-identified':	val += 1;
				case 'solved':			val += 1;	state = false;
				case 'open':			val += 0;
			}
			$('#autoUR-sidebar.problem-edit').attr('data-state',$(this).val());
			WMEAutoUR.UR.updateStatus(val,state);
		},

		sendComment: function() {
			console.info(WMEAutoUR.logPrefix+': sendComment');
			var comment = $('.section.conversation div.new-comment-form textarea.new-comment-text').val();
			WMEAutoUR.UR.addComment(comment);
			$('.section.conversation div.new-comment-form textarea.new-comment-text').val('');
			return false;
		},

		minMax: function() {
			switch($('#autoUR-sidebar').css('height')) {
				case '40px':	WMEAutoUR.UI.maximize();	break;
				default:		WMEAutoUR.UI.minimize();	break;
			}

		},

		minimize: function() {
			console.info('########### mINimize');
			$('#autoUR-sidebar').css('height','40px');
			$('#autoUR-style').empty();
			$('#edit-panel').css('display','block');
		},

		maximize: function() {
			console.info('########### maXimize');
			$('#autoUR-sidebar').css('height','auto');
			if($('#autoUR-sidebar').css('display')==='block') {
				$('#autoUR-style').html('#user-info{display:none !important;}');
				$('#edit-panel').css('display','none');
			}

		},

		close: function() {
			$('#autoUR-sidebar').css('display','none');
			$('#edit-panel').css('display','block');
			$('#autoUR-style').empty();
			$('#WazeMap').removeClass('problem-selected');
			$('.map-problem.selected').removeClass('selected');
		},

		reZoom: function() {
			Waze.map.setCenter(WMEAutoUR.UI.latLon,5)
		},

		selectChanged: function() {
			console.info('########### selectChanged');
			if(Waze.selectionManager.selectedItems.length) {
				WMEAutoUR.UI.minimize();
			} else {
				WMEAutoUR.UI.maximize();
			}
		}

	};
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------  OTHER FUNCTIONS  -------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.7.2
	 */
	WMEAutoUR.showDevInfo = function() {
		var info_txt = '';
		info_txt = info_txt + 'Created by: <b>SuperMedic</b><br>';
		info_txt = info_txt + 'Icon: <b>RickZAbel</b><br>';
		info_txt = info_txt + 'Beta Testers:<br>';
		info_txt = info_txt + '<b>Stephenr1966</b><br>';
		info_txt = info_txt + '<b>seekingserenity</b><br>';
		info_txt = info_txt + '<b>t0cableguy</b><br>';
		info_txt = info_txt + '<b>ct13</b><br>';
		$('span[id="WME_AutoUR_Info"]').html(info_txt);
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.3.1
	 */
	WMEAutoUR.showHideTools = function() {
		switch($("#WME_AutoUR_main .WME_AutoUR_main_right").css("display")) {
			case 'none': 	$("#WME_AutoUR_main .WME_AutoUR_main_right").css("display","block");	break;
			case 'block':	$("#WME_AutoUR_main .WME_AutoUR_main_right").css("display","none");		break;
			default:		$("#WME_AutoUR_main .WME_AutoUR_main_right").css("display","block");	break;
		}
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.11.0
	 */
	WMEAutoUR.off = function() {
		console.info("WME-AutoUR Stopping...");
		window.clearInterval(WMEAutoUR.Intervals.SaveSettings);
		WMEAutoUR.Settings.Save();
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.11.0
	 */
	WMEAutoUR.on = function() {
		console.info("WME-AutoUR Restarting...");
		WMEAutoUR.Intervals.SaveSettings = window.setInterval(WMEAutoUR.Settings.Save,30000);
	};


	//--------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------  END OTHER FUNCTIONS  ---------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------

	WMEAutoUR.startcode();
}




//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------------  WMEAutoUR FUNCTIONS  -----------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  Create Tabbed UI  ------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------


function WMEAutoUR_Create_TabbedUI() {
	WMEAutoUR_TabbedUI = {};
	/**
	 *@since version 0.11.0
	 */
	var urParentDIV
	WMEAutoUR_TabbedUI.init = function() {
        // See if the div is already created //
		if ($("#autoUR-sidebar").length===0) {
			WMEAutoUR.UI.build();
		}
		if ($("#WME_AutoUR_TAB_main").length===0) {
            urParentDIV = WMEAutoUR_TabbedUI.ParentDIV();
            $(urParentDIV).append(WMEAutoUR_TabbedUI.Title());
            //$(ParentDIV).append($('<span>').attr("id","WME_AutoUR_Info")
            //								.click(function(){$(this).html('');})
            //								.css("color","#000000"));

            //$(urParentDIV).append(WMEAutoUR_TabbedUI.TabsHead());

            //var TabBody = WMEAutoUR_TabbedUI.TabsBody();

            //$(TabBody).append(WMEAutoUR_TabbedUI.EditorTAB);

			if ($("#WMEAutoUR_EDIT_TAB").length===0) {
				$('#autoUR-sidebar .autour .content').append(WMEAutoUR_TabbedUI.EditorTAB);
			}
            //$(TabBody).append(WMEAutoUR_TabbedUI.MessagesTAB);
            //$(TabBody).append(WMEAutoUR_TabbedUI.SettingsTAB);
            $(urParentDIV).append($('<button>').css('margin','5px 0 10px').html('Start Auto').click(WMEAutoUR.Auto.getIDs));

            $(urParentDIV).append(WMEAutoUR_TabbedUI.SettingsTAB);

            //$(urParentDIV).append(TabBody);

			//$('#sidepanel-scriptkit-scripts').children().last().before($(ParentDIV));
			console.info("WME-WMEAutoUR_TabbedUI: Created Pannel");
		}
        // See if the div is already created //
		if (ScriptKit.loaded) {
			var icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAlCAYAAAC6TzLyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMzZiNThiMS1jNjMxLWU4NGEtOWJkNi1lZDhlMTc3ODMwYTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDMzOThDRTg4NjVEMTFFNDhGOTdBMjgwMzlCNkU5OEYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDMzOThDRTc4NjVEMTFFNDhGOTdBMjgwMzlCNkU5OEYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODE4MzI1YmUtZWRjOS0zYjQzLTkyZDctOTZkOTkyMjFkMzE4IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ODRjODI0MDAtODY1ZC0xMWU0LThjNzgt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';
			console.info("WME-WMEAutoUR_TabbedUI: Loaded Pannel");
			var tooltip = 'Show/Hide AutoUR';
			ScriptKit.GUI.addImage(2,icon,WMEAutoUR_TabbedUI.hideWindow,tooltip);
			ScriptKit.GUI.addScript(2,urParentDIV);
        } else {
            window.setTimeout(WMEAutoUR_TabbedUI.init,500);
        }
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV TOGGLE --------- //
	WMEAutoUR_TabbedUI.hideWindow = function() {

		switch($("#WME_AutoUR_TAB_main").css("height")) {
			case '30px': 	$("#WME_AutoUR_TAB_main").css("height","auto");
							$("#WMEAutoUR_TabbedUI_toggle").html("-");
							WMEAutoUR.on();		break;
			default:		$("#WME_AutoUR_TAB_main").css("height","30px");
							$("#WMEAutoUR_TabbedUI_toggle").html("+");
							WMEAutoUR.off();	break;
		}
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV --------- //
	WMEAutoUR_TabbedUI.ParentDIV = function() {

		var MainTAB = $('<div>').attr("id","WME_AutoUR_TAB_main")
								.css("color","#FFFFFF")
								.css("border-bottom","2px solid #E9E9E9")
								.css("margin","5px 0 0")
								.css("padding-bottom","10px")
								.css("max-width","275px")
								.css("height","30px")
								.css("overflow","hidden")
								.css("display","block");

		return MainTAB;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV --------- //
	WMEAutoUR_TabbedUI.Title = function() {
		console.info("WME-WMEAutoUR_TabbedUI: create main div ");

		// ------- TITLE  ------- //
		var mainTitle = $("<div>")
						.attr("id","WME_AutoUR_TAB_title")
						.css("width","100%")
						.css("text-align","center")
						.css("background-color","rgb(93, 133, 161)")
						.css("border-radius","5px")
						.css("padding","3px")
						.css("margin-bottom","3px")
						.html("WME-AutoUR " + WMEAutoUR.version)
						.dblclick(WMEAutoUR.showDevInfo)
						.attr("title","Click for Development Info");

		$(mainTitle).append($('<div>').attr("id","WMEAutoUR_TabbedUI_toggle")
									  .html("+")
									  .css("float","right")
									  .css("position","relative")
									  .css("color","#ffffff")
									  .css("right","3px")
									  .css("top","0")
									  .css("background","#000000")
									  .css("height","16px")
									  .css("width","16px")
									  .css("display","block")
									  .css("line-height","14px")
									  .css("border-radius","5px")
									  .click(WMEAutoUR_TabbedUI.hideWindow));

		return mainTitle;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV --------- //
	WMEAutoUR_TabbedUI.TabsHead = function() {

		// ------- TABS  ------- //
		var mainTabs = $("<div>")
						.attr("id","WME_AutoUR_TAB_head")
						.css("padding","3px")
						.css("margin-bottom","3px")
						.attr("title","Click for Development Info");
		var tabs = $("<ul>").addClass("nav")
							.addClass("nav-tabs");

		//$(tabs).append($("<li>").append($("<a>").attr("data-toggle","tab")
		//										.attr("href","#WMEAutoUR_EDIT_TAB")
		//										.html("Editor")
		//							   ).addClass("active")
		//			  );

		//$(tabs).append($("<li>").append($("<a>").attr("data-toggle","tab")
		//										.attr("href","#WMEAutoUR_MSG_TAB")
		//										.html("Messages")
		//							   )
		//			  );

		$(tabs).append($("<li>").append($("<a>").attr("data-toggle","tab")
												.attr("href","#WMEAutoUR_SET_TAB")
												.html("Settings")
									   )
					  );

		$(mainTabs).append(tabs);

		return mainTabs;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV --------- //
	WMEAutoUR_TabbedUI.TabsBody = function() {

		// ------- TABS  ------- //
		var TabsBodyContainer = $("<div>")
							  .attr("id","WME_AutoUR_TAB_tabs")
							  .attr("style","padding: 0 !important;")
							  .addClass("tab-content");

		return TabsBodyContainer;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.8.1
	 */
	WMEAutoUR_TabbedUI.EditorTAB = function() {

		var editTAB = $('<div>').attr("id",'WMEAutoUR_EDIT_TAB')
								.addClass("tab-pane")
								.addClass("active");

		//$(editTAB).append($("<span id='WME_AutoUR_Info'>")
		//					//.css("float","right")
		//					.css("text-align","left")
		//					.css("display","block")
		//					.css("max-width","275px")
		//					//.css("height","150px")
		//					.css("color","#000000")
		//					.css("clear","both"));

		var autoBar = $('<div>').css("width","100%")
								.css("clear","both");
		$(editTAB).append($(autoBar));

		$(autoBar).append($("<button>Prev</button>")
							.click(WMEAutoUR.Auto.Prev)
							.css("position","relative")
							.css("float","left")
							.css("height","24px")
							.attr("title","Previous UR"));

		$(autoBar).append($("<button>Next</button>")
							.click(WMEAutoUR.Auto.Next)
							.css("position","relative")
							.css("float","right")
							.css("height","24px")
							.attr("title","Next UR"));

		$(autoBar).append($("<span id='WME_AutoUR_Count'>")
							.css("text-align","center")
							.css("display","block")
							.css("width","60px")
							.css("margin","0 auto")
							.css("color","#FFFFFF")
							.css("padding","3px")
							.css("background-color","#000000")
							.css("border-radius","3px")
							.html("Auto Off")
							.dblclick(WMEAutoUR.Auto.getIDs)
							.attr("title","Double click to load/reload list of URs"));


		var actsBar = $('<div>').css("width","100%")
								.css("clear","both")
								.css("font-size","12px")
								.css("padding-top","2px");
		$(editTAB).append($(actsBar));

		$(actsBar).append($("<button>None</button>")
							  .attr("id","WME_AutoUR_Filter_button")
							  .click(WMEAutoUR.Auto.filterButton)
							  .val(2)
							  .css("float","left")
							  .css("background-color","White")
							  .css("color","Black")
							  .css("border-radius","5px")
							  .css("width","55px")
							  .attr("title","Change filter between Initial-Stale-Dead."));

		$(actsBar).append($("<button>Send</button>")
							  .click(WMEAutoUR.Messages.Send)
							  .css("float","left")
							  .css("width","55px")
							  .attr("title","Insert message. "));

		$(actsBar).append($("<button>Solve</button>")
							  .click(WMEAutoUR.Messages.changeStatus)
							  .attr("data-state","solved")
							  .val("solved")
							  .css("float","right")
							  .css("width","55px")
							  .attr("title","Mark Solved."));

		$(actsBar).append($("<button>Not ID</button>")
							  .click(WMEAutoUR.Messages.changeStatus)
							  .attr("data-state","not-identified")
							  .val("not-identified")
							  .css("float","right")
							  .css("width","55px")
							  .attr("title","Mark Not Identified."));


		var setsBar = $('<div>').css("width","275px")
								.css("margin-top","2px")
								.css("clear","both");
		$(editTAB).append($(setsBar));

		var setsBarSub1 = $('<div>').css("width","55px")
									.css("height","24px")
									.css("float","left");
		$(setsBar).append($(setsBarSub1));
		$(setsBarSub1).append($("<label>")
							  .html("Fill")
							  .attr("for","WMEAutoUR_AutoFill_CB")
							  .attr("title","Enable auto insert canned messages.")
							  .css("color","black")
							  .css("float","left"));

		$(setsBarSub1).append($("<input>")
							  .attr("id","WMEAutoUR_AutoFill_CB")
							  .attr("type","checkbox")
							  .css("float","left")
							  .css("margin-left","5px")
							  .attr("title","Enable auto insert canned messages.")
							  .prop('checked','true')
							  .click(WMEAutoUR.Messages.insertFromSelect));


		var setsBarSub2 = $('<div>').css("width","55px")
									.css("height","24px")
									.css("float","left");
		$(setsBar).append($(setsBarSub2));
		$(setsBarSub2).append($("<label>")
							  .html("Adv.")
							  .attr("for","WMEAutoUR_AutoAdvance_CB")
							  .attr("title","Enable auto advance with Send/Solve/NI buttons.")
							  .css("color","black")
							  .css("float","left"));

		$(setsBarSub2).append($("<input>")
							  .attr("id","WMEAutoUR_AutoAdvance_CB")
							  .attr("type","checkbox")
							  .css("float","left")
							  .css("margin-left","5px")
							  .attr("title","Enable auto advance with Send/Solve/NI buttons."));


		var setsBarSub3 = $('<div>').css("width","55px")
									.css("height","24px")
									.css("float","left");
		$(setsBar).append($(setsBarSub3));
		$(setsBarSub3).append($("<label>")
							  .html("Send")
							  .attr("for","WMEAutoUR_SendMessage_CB")
							  .attr("title","Send message with Solve/NI buttons.")
							  .css("color","black")
							  .css("float","left"));

		$(setsBarSub3).append($("<input>")
							  .attr("id","WMEAutoUR_SendMessage_CB")
							  .attr("type","checkbox")
							  .css("float","left")
							  .css("margin-left","5px")
							  .attr("title","Send message with Solve/NI buttons."));




		var edit_select = $("<select>").attr("id","WMEAutoUR_Insert_Select")
									  .attr("title","Select message to be inserted")
									  .css("width","100%")
									  .css("float","left")
									  .change(WMEAutoUR.Messages.insertFromSelect)
									  .css("padding-top","5px");

		WMEAutoUR_TabbedUI.createSelect(edit_select);

		$(editTAB).append(edit_select);

		//$(editTAB).append($("<span id='WME_AutoUR_MSG_Display'>")
		//					.css("text-align","left")
		//					.css("display","block")
		//					.css("width","275px")
		//					.css("padding","10px 0")
		//					.css("color","#000000")
		//					.css("clear","both"));


		$(editTAB).append($("<div>").css("clear","both"));


		return editTAB;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.8.1
	 */
	// ------- SETTINGS TAB ------- //
	WMEAutoUR_TabbedUI.SettingsTAB = function() {

		var setTAB = $('<div>').attr("id",'WMEAutoUR_SET_TAB')
								//.css("padding","10px")
								.css("max-width","275px")
								.css("text-align","center")
								.addClass("tab-pane");

		var select = $("<select>").attr("id","WMEAutoUR_Settings_Select")
								.attr("title","Select Message")
								.css("width","225px")
								.css("float","left")
								.change(WMEAutoUR.Messages.ChangeSettingSelect)
								.focus(WMEAutoUR.Messages.SaveSettingSelect)
								.css("padding-top","5px");

		WMEAutoUR_TabbedUI.createSelect(select);


		// ---  MESSAGES --- //
		$(setTAB).append($("<div>").css("clear","both")
									.css("margin-bottom","10px")
									.append($("<h3>").html("Messages")
													  .css("color","black")
													  .css("text-align","left")
										   )
									.append($("<textarea>").attr("id","WMEAutoUR_Settings_Comment")
														  .val(WMEAutoUR.Options.messages[6])
														  .css("float","left")
														  .css("height","125px")
														  .css("position","relative")
														  .css("float","left")
														  .css("margin-top","5px")
														  .css("width","100%")
														  .css("clear","both")
										   )
									.append(select)
									.append($("<button>").html("Save")
														 .css("width",'50px')
														 .css("float",'left')
														 .click(WMEAutoUR.Messages.SaveSettingSelect)
											)
									.append($("<button>").html("Custom Msg")
														 .css("width",'35%')
														 .css("float",'left')
														 .click(WMEAutoUR.Messages.addCustom)
											)
									.append($("<input>").attr('type','text')
														 .attr("id",'WMEAutoUR_Settings_customName')
														 .css("width",'65%')
											)
									.append($("<div>").css("clear","both"))
						);

		// ---  FILTERS --- //
		$(setTAB).append($("<div>").css("clear","both")
									.css("margin-bottom","10px")
									.append($("<h3>").html("Filters")
													  .css("color","black")
													  .css("text-align","left")
										   )
									.append($("<div>").attr("id","UR_Stale_Dead")
													  .css("width","135px")
													  .css("position","relative")
													  .css("float","left")
													  .css("padding-top","5px")
													  .append($("<span>").html('Stale Days')
																		.attr("title","Days since first editor comment.")
																		.css("text-align","center")
																		.css("position","relative")
																		.css("float","left")
																		.css("height","24px")
																		.css("width","99px")
																		.css("color","black")
															  )
													  .append($("<input>").attr("type","text")
																		  .attr("id","UR_Stale_Days")
																		  .attr("value",WMEAutoUR.Options.settings.staleDays)
																		  .css("height","24px")
																		  .css("width","36px")
																		  .css("text-align","center")
																		  .css("position","relative")
																		  .css("float","right")
																		  .css("padding-top","5px")
															  )
													  .append($("<span>").html('Dead Days')
																		.attr("title","Days since second editor comment.")
																		.css("text-align","center")
																		.css("position","relative")
																		.css("float","left")
																		.css("height","24px")
																		.css("width","99px")
																		.css("color","black")
															  )
													  .append($("<input>").attr("type","text")
																		  .attr("id","UR_Dead_Days")
																		  .attr("value",WMEAutoUR.Options.settings.deadDays)
																		  .css("height","24px")
																		  .css("width","36px")
																		  .css("text-align","center")
																		  .css("position","relative")
																		  .css("float","right")
																		  .css("padding-top","5px")
															  )
											)
									.append($("<div>").css("clear","both"))
						  );

		// ---  Advanced --- //
		console.info(WMEAutoUR.Options.settings.staleDays);
		console.info(WMEAutoUR.Options.settings.deadDays);
		console.info(WMEAutoUR.Options.settings.firstURTextareaTime);
		console.info(WMEAutoUR.Options.settings.nextURTextareaTime);

		$(setTAB).append($("<div>").css("clear","both")
									.css("margin-bottom","10px")
									.append($("<h3>").html("Advanced")
													  .css("color","black")
													  .css("text-align","left")
										   )
									.append($("<div>").attr("id","UR_TA_Timers")
													  .css("width","135px")
													  .css("position","relative")
													  .css("float","left")
													  .css("padding-top","5px")
													  .append($("<span>").html('1st UR TA')
																		.attr("title","Offset before attempting to insert into UR comment textarea for first loaded UR.")
																		.css("text-align","center")
																		.css("position","relative")
																		.css("float","left")
																		.css("height","24px")
																		.css("width","99px")
																		.css("color","black")
															  )
													  .append($("<input>").attr("type","text")
																		  .attr("id","UR_First_TA_Time")
																		  .attr("value",WMEAutoUR.Options.settings.firstURTextareaTime)
																		  .css("height","24px")
																		  .css("width","36px")
																		  .css("text-align","center")
																		  .css("position","relative")
																		  .css("float","right")
																		  .css("padding-top","5px")
															  )
													  .append($("<span>").html('Next UR TA')
																		.attr("title","Offset before attempting to insert into UR comment textarea for consecutive URs.")
																		.css("text-align","center")
																		.css("position","relative")
																		.css("float","left")
																		.css("height","24px")
																		.css("width","99px")
																		.css("color","black")
															  )
													  .append($("<input>").attr("type","text")
																		  .attr("id","UR_Next_TA_Time")
																		  .attr("value",WMEAutoUR.Options.settings.nextURTextareaTime)
																		  .css("height","24px")
																		  .css("width","36px")
																		  .css("text-align","center")
																		  .css("position","relative")
																		  .css("float","right")
																		  .css("padding-top","5px")
															  )
											)
									.append($("<div>").css("clear","both"))
						  );



		$(setTAB).append($("<button>Save</button>")
				  .click(WMEAutoUR.Settings.Save)
				  .css("float","left")
				  .attr("title","Save Current Comment"));




		$(setTAB).append($("<button>Reset</button>")
				  .click(WMEAutoUR.Settings.Reset)
				  .css("float","right")
				  .attr("title","Reset settings to defaults."));


		$(setTAB).append($("<div>").css("clear","both"));


		return setTAB;
	};

	/**
	*@since version 0.6.1
	*/
	WMEAutoUR_TabbedUI.createSelect = function(select) {

		var g1 = $("<optgroup>").attr('label','Default');
		var g2 = $("<optgroup>").attr('label','Stale/Dead');
		var g3 = $("<optgroup>").attr('label','Custom');

		$.each(WMEAutoUR.Options.names,function(i,v) {
			if(v) {
				var opt = $('<option>');
				$(opt).attr('value',i);
				$(opt).html(v);
				if(i<40) {
					$(g1).append(opt);
				} else if(i<60) {
					$(g2).append(opt);
				} else if(i>59) {
					$(g3).append(opt);
				}
			}
		});
		$(select).append(g1).append(g2).append(g3);
	};



	WMEAutoUR_TabbedUI.init();
}
//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  END Create floating UI  --------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------  WE HAVE FOUND OUR BOOTS  ------------------------------------------------------------------------------------------
//-------------------------  NOW LETS PUT THEM ON  -------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
wme_auto_ur_bootstrap();





/*

	 // object needed Waze
	Waze //
	if ( typeof (unsafeWindow.Waze) == ' undefined ' ) {
		UR2T_addLog ( 1 , ' error ' , ' unsafeWindow.Waze NOK ' , unsafeWindow.Waze);
		window.setTimeout (UR2T_init, 500 );
		 return ;
	}
	UR2T_Waze = unsafeWindow.Waze;
	Waze.updateRequestsControl //
	if ( typeof (UR2T_Waze.updateRequestsControl) == ' undefined ' ) {
		UR2T_addLog ( 1 , ' error ' , ' UR2T_Waze.updateRequestsControl NOK ' , UR2T_Waze.updateRequestsControl);
		window.setTimeout (UR2T_init, 500 );
		 return ;
	}
	UR2T_updateRequestsControl = UR2T_Waze.updateRequestsControl;
	Waze.model //
	if ( typeof (UR2T_Waze.model) == ' undefined ' ) {
		UR2T_addLog ( 1 , ' error ' , ' UR2T_Waze.model NOK ' , UR2T_Waze.model);
		window.setTimeout (UR2T_init, 500 );
		 return ;
	}
	UR2T_Waze_model = UR2T_Waze.model;
	Waze.model.updateRequestSessions //
	if ( typeof (UR2T_Waze_model.updateRequestSessions) == ' undefined ' ) {
		UR2T_addLog ( 1 , ' error ' , ' UR2T_Waze_model.mapUpdateRequests NOK ' , UR2T_Waze_model.updateRequestSessions);
		window.setTimeout (UR2T_init, 500 );
		 return ;
	}
	UR2T_model_updateRequestSessions = UR2T_Waze_model.updateRequestSessions;
	Waze.model.mapUpdateRequests //
	if ( typeof (UR2T_Waze_model.mapUpdateRequests) == ' undefined ' ) {
		UR2T_addLog ( 1 , ' error ' , ' UR2T_Waze_model.mapUpdateRequests NOK ' , UR2T_Waze_model.mapUpdateRequests);
		window.setTimeout (UR2T_init, 500 );
		 return ;
	}
	UR2T_model_mapUpdateRequests = UR2T_Waze_model.mapUpdateRequests;
	Waze.loginManager //
	if ( typeof (UR2T_Waze.loginManager) == ' undefined ' ) {
		UR2T_addLog ( 1 , ' error ' , ' UR2T_Waze.loginManager NOK ' , UR2T_Waze.loginManager);
		window.setTimeout (UR2T_init, 500 );
		 return ;
	}
	UR2T_Waze_loginManager = UR2T_Waze.loginManager;
	Waze.loginManager.user //
	if ( typeof (UR2T_Waze_loginManager.user) == ' undefined ' ) {
		UR2T_addLog ( 1 , ' error ' , ' UR2T_Waze_loginManager.user NOK ' , UR2T_Waze_loginManager.user);
		window.setTimeout (UR2T_init, 500 );
		 return ;
	}
*/




// ------- MAIN DIV CSS  ------- //
//var WME_AutoUR_main_right_css = '.WME_AutoUR_main_right > * { clear: both; display: block; }';
//$(WMEAutoUR.MainDIV).append($('<style>')
//							.append(WME_AutoUR_main_right_css));


//$(WMEEditOverlayMainDIV).append($('<svg id="OpenLayers.Layer.Vector.RootContainer_336_svgRoot" style="display: block;" width="1339" height="309" viewBox="0 0 1339 309"></svg>').append(WMEEditOverlay.createPolyline));
//$(WMEEditOverlayMainDIV).append(WMEEditOverlay.createPolyline);
