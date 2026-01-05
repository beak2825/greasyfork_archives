// ==UserScript==
// @name        WME VenueLock-SK
// @namespace   com.supermedic.wmeautour
// @description Allow easy locking of venues/places
// @version     0.1.6SK
// @grant       none
// @match       https://editor-beta.waze.com/*editor/*
// @match       https://www.waze.com/*editor/*
// @match       https://www.waze.com/editor/*
// @downloadURL https://update.greasyfork.org/scripts/7091/WME%20VenueLock-SK.user.js
// @updateURL https://update.greasyfork.org/scripts/7091/WME%20VenueLock-SK.meta.js
// ==/UserScript==


/* Changelog
 * 0.1.6SK - tooltip
 * 0.1.5SK - Restrict out of edit, Restrict off screen
 * 0.1.4SK - 2000 lock on buttons, center on venue
 * 0.1.3SK - 1500 lock on buttons, fixed array end overshoot
 * 0.1.2SK - added Prev button
 * 0.1.1SK - unsafeWindow update
 * 0.1.0SK - Moved to ScriptKit
 * 0.0.5 - Inital version - FSU
 */

unsafeWindow.WMEVenueLock = {};
WMEVenueLock.version = '0.1.6SK';

function WMEVenueLock_bootstrap() {
  console.info("WMEVenueLock: starting (bootstrap)");
	var bGreasemonkeyServiceDefined = false;

	try {
		if ("object" === typeof Components.interfaces.gmIGreasemonkeyService) {
			bGreasemonkeyServiceDefined = true;
		}
	}
	catch (err) {
		//Ignore.
	}
	if ( "undefined" === typeof unsafeWindow  ||  ! bGreasemonkeyServiceDefined) {
		unsafeWindow = ( function () {
			var dummyElem   = document.createElement('p');
			dummyElem.setAttribute ('onclick', 'return window;');
			return dummyElem.onclick ();
		} ) ();
	}
	/* begin running the code! */
	WMEVenueLock_Create();
}

//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------------  WMEVenueLock FUNCTIONS  -----------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
/**
 *@since version 0.10.0
 */
function WMEVenueLock_Create() {
	WMEVenueLock.logPrefix = 'WMEVenueLock';

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//-------------  ##########  START CODE FUNCTION ##########  ---------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.0.1
	 */
	WMEVenueLock.startcode = function () {
		console.info(WMEVenueLock.logPrefix+": startcode");
		// Check if WME is loaded, if not, waiting a moment and checks again. if yes init WMEChatResize
		try {
			//if ("undefined" != typeof unsafeWindow.W.model.chat.rooms._events.listeners.add[0].obj.userPresenters[unsafeWindow.Waze.model.loginManager.user.id] ) {
			if ("undefined" != typeof Waze.map ) {
				console.info(WMEVenueLock.logPrefix+": ready to go");
				WMEVenueLock.init();
			} else {
				console.info(WMEVenueLock.logPrefix+": waiting for WME to load...");
				setTimeout(WMEVenueLock.startcode, 1000);
			}
		} catch(err) {
			console.info(WMEVenueLock.logPrefix+": waiting for WME to load...(caught in an error)");
			console.info(WMEVenueLock.logPrefix+": Error:"+err);
			setTimeout(WMEVenueLock.startcode, 1000);
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
	WMEVenueLock.init = function() {
		console.info(WMEVenueLock.logPrefix+": starting (init)");
		// --- Create Tabbed UI --- //
		WMEVenueLock_Create_TabbedUI();
		// --- Create Floating UI --- //
		WMEVenueLock_Create_FloatUI();
	// @since 0.8.2 - Turned off auto UR finding
		WMEVenueLock.showDevInfo();
		WMEVenueLock_TabbedUI.hideWindow();
		$(document).tooltip();
	};


	//--------------------------------------------------------------------------------------------------------------------------------------------
	//----------------------  ACTIONS  -----------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since 0.0.1
	 */
	WMEVenueLock.Actions = {
		updateObject: require("Waze/Action/UpdateObject")
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//----------------------  VENUE FUNCTIONS  ---------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since 0.0.1
	 */
	WMEVenueLock.Venue = {

		/**
		 *@since version 0.11.3RE
		 */
		getScreenIDs: function() {

			console.info(WMEVenueLock.logPrefix+": Getting Screen IDs");
			WMEVenueLock.Venue.InitialObjects = Waze.model.venues.getObjectArray();
			WMEVenueLock.Venue.filterURs();

			WMEVenueLock.index = -1;
			$('span[id="WMEVenueLock_Venues_selected"]').html('0 / '+WMEVenueLock.Venue.finalObjects.length + " Places selected");
			window.setTimeout(WMEVenueLock.Venue.gotoNextVenue(),750);
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.11.8RE
		 */
		filterURs: function() {
			WMEVenueLock.Venue.finalObjects = [];
			var viewport = Waze.map.getExtent();
			//var top = viewport.top;
			//var bottom = viewport.bottom;
			//var left = viewport.left;
			//var right = viewport.right;
			for(var i=0; i<WMEVenueLock.Venue.InitialObjects.length;i++) {
				var venueObj = WMEVenueLock.Venue.InitialObjects[i];
				var venueID = venueObj.attributes.id;

				// --- Is it in my editable area? --- //
				var x = venueObj.attributes.geometry.bounds.left;
				var y = venueObj.attributes.geometry.bounds.top;
				if(WMEVenueLock.Venue.outOfEditableArea(x,y)) continue;

				// -- Anything else wrong with it --- //
				if(WMEVenueLock.Venue.specialRejects()) continue;

				// --- Off of screen --- //
				if((x > viewport.left) && (x < viewport.right)) {
					if((y > viewport.bottom) && (y < viewport.top)) {
						WMEVenueLock.Venue.finalObjects.push(venueObj);
						console.info(venueID);
					}
				}
			}
			console.info(WMEVenueLock.Venue.finalObjects);
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.11.16RE
		 */
		specialRejects: function() {
			return false;
		},

		outOfEditableArea: function(x,y) {
			var userID = loginManager.user.getID();
			var point = new OpenLayers.Geometry.Point(x,y);
			console.info(point);
			console.info(wazeModel.users.get(userID).updatableArea.components[0].containsPoint(point));
			return !wazeModel.users.get(userID).updatableArea.components[0].containsPoint(point);
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.0.1
		 */
		gotoPrevVenue: function() {
			if(WMEVenueLock.index === -1) {
				WMEVenueLock.index = 1;
			}
			if(WMEVenueLock.index > -1) {
				WMEVenueLock.index--;
				WMEVenueLock.Venue.currentVenueID = WMEVenueLock.Venue.finalObjects[WMEVenueLock.index].attributes.id;
				// will select more than one object
				var venueObj = Waze.model.venues.getByIds([WMEVenueLock.Venue.currentVenueID]);
				Waze.selectionManager.select(venueObj);
				WMEVenueLock.Venue.gotoCenter();
				console.info(WMEVenueLock.logPrefix+": index " + WMEVenueLock.index + ' : ' + WMEVenueLock.Venue.currentVenueID)
				$('span[id="WMEVenueLock_Venues_selected"]').html((WMEVenueLock.index+1)+' / '+WMEVenueLock.Venue.finalObjects.length + " Places selected");
			}
			WMEVenueLock_FloatingUI.lockButtons()
			window.setTimeout(WMEVenueLock_FloatingUI.unlockButtons,2000)
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.0.1
		 */
		gotoNextVenue: function() {
			if((WMEVenueLock.index+1)<WMEVenueLock.Venue.finalObjects.length) {
				WMEVenueLock.index++;
				WMEVenueLock.Venue.currentVenueID = WMEVenueLock.Venue.finalObjects[WMEVenueLock.index].attributes.id;
				// will select more than one object
				var venueObj = Waze.model.venues.getByIds([WMEVenueLock.Venue.currentVenueID]);
				Waze.selectionManager.select(venueObj);
				WMEVenueLock.Venue.gotoCenter();
				console.info(WMEVenueLock.logPrefix+": index " + WMEVenueLock.index + ' : ' + WMEVenueLock.Venue.currentVenueID)
				$('span[id="WMEVenueLock_Venues_selected"]').html((WMEVenueLock.index+1)+' / '+WMEVenueLock.Venue.finalObjects.length + " Places selected");
			}
			WMEVenueLock_FloatingUI.lockButtons()
			window.setTimeout(WMEVenueLock_FloatingUI.unlockButtons,2000)
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.0.1
		 */
		gotoCenter: function() {
			var venueObj = Waze.model.venues.getByIds([WMEVenueLock.Venue.currentVenueID]);
			var x = ((venueObj[0].attributes.geometry.bounds.left)+(venueObj[0].attributes.geometry.bounds.right))/2;
			var y = ((venueObj[0].attributes.geometry.bounds.top)+(venueObj[0].attributes.geometry.bounds.bottom))/2;
			Waze.map.setCenter([x,y],4);
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.0.1
		 */
		setLevel: function(e) {
			var new_lock_level = $(this).attr('data-level');
			console.info(WMEVenueLock.logPrefix+": Locking to " + (+new_lock_level+1));
			Waze.model.actionManager.add(new WMEVenueLock.Actions.updateObject(wazeModel.venues.get(WMEVenueLock.Venue.currentVenueID), {lockRank:new_lock_level}));
			window.setTimeout(WMEVenueLock.Venue.gotoNextVenue(),750);
		}

	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//----------------------  END AUTO UR FUNCTIONS  ---------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------  OTHER FUNCTIONS  -------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.7.2
	 */
	WMEVenueLock.showDevInfo = function() {
		var info_txt = '';
		info_txt = info_txt + 'Created by: <b>SuperMedic</b><br>';
		info_txt = info_txt + 'Beta Testers: (Public)<br>';
		info_txt = info_txt + '<b>Stephenr1966</b><br>';
		info_txt = info_txt + '<b>ct13</b><br>';
		info_txt = info_txt + '<b>triage685</b><br>';
		$('span[id="WMEVenueLock_TAB_Info"]').html(info_txt);
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.3.1
	 */
	WMEVenueLock.showHideTools = function() {
		switch($("#WME_AutoUR_main .WME_AutoUR_main_right").css("display")) {
			case 'none': 	$("#WME_AutoUR_main .WME_AutoUR_main_right").css("display","block");	break;
			case 'block':	$("#WME_AutoUR_main .WME_AutoUR_main_right").css("display","none");		break;
			default:		$("#WME_AutoUR_main .WME_AutoUR_main_right").css("display","block");	break;
		}
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.3.1
	 */
	WMEVenueLock.on = function() {

	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.3.1
	 */
	WMEVenueLock.off = function() {

	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------  END OTHER FUNCTIONS  ---------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------

	WMEVenueLock.startcode();
}


//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------------  WMEVenueLock FUNCTIONS  -----------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  Create Tabbed UI  --------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------


function WMEVenueLock_Create_TabbedUI() {
	WMEVenueLock_TabbedUI = {};
	/**
	 *@since version 0.11.0
	 */
	WMEVenueLock_TabbedUI.init = function() {

		var venueParentDIV;
		if ($("#WMEVenueLock_TAB_main").length===0) {
			venueParentDIV = WMEVenueLock_TabbedUI.ParentDIV();
			$(venueParentDIV).append(WMEVenueLock_TabbedUI.Title());
			$(venueParentDIV).append($('<span>').attr("id","WMEVenueLock_TAB_Info")
											//.click(function(){$(this).html('');})
											.css("color","#000000"));

			WMEVenueLock.showDevInfo();

			// See if the div is already created //
			//$("div.tips").after(venueParentDIV);
			console.info("WME-WMEVenueLock_TabbedUI: Loaded Pannel");
		}
		if (ScriptKit.loaded) {
			var icon = 'data:image/png;base64,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';
			console.info("WME-VenueLock_TabbedUI: Loaded Pannel");
			var tooltip = 'Show/Hide VenueLock';
			ScriptKit.GUI.addImage(4,icon,WMEVenueLock_TabbedUI.hideWindow,tooltip);
			ScriptKit.GUI.addScript(4,venueParentDIV);
        } else {
            window.setTimeout(WMEAutoUR_TabbedUI.init,500);
        }

	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV TOGGLE --------- //
	WMEVenueLock_TabbedUI.hideWindow = function() {

		switch($("#WMEVenueLock_TAB_main").css("height")) {
			case '30px': 	$("#WMEVenueLock_TAB_main").css("height","auto");
							$("#WMEVenueLock_TabbedUI_toggle").html("-");
							WMEVenueLock.on();		break;
			default:		$("#WMEVenueLock_TAB_main").css("height","30px");
							$("#WMEVenueLock_TabbedUI_toggle").html("+");
							WMEVenueLock.off();	break;
		}

		WMEVenueLock_FloatingUI.hideWindow();
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV --------- //
	WMEVenueLock_TabbedUI.ParentDIV = function() {

		var MainTAB = $('<div>').attr("id","WMEVenueLock_TAB_main")
								.css("color","#FFFFFF")
								.css("border-bottom","2px solid #E9E9E9")
								.css("margin","5px 0 0")
								.css("padding-bottom","10px")
								.css("max-width","275px")
								//.css("height","30px")
								.css("overflow","hidden")
								.css("display","block");

		return MainTAB;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV --------- //
	WMEVenueLock_TabbedUI.Title = function() {
		console.info(WMEVenueLock.logPrefix+": TabbedUI create main div ");

		// ------- TITLE  ------- //
		var mainTitle = $("<div>")
						.attr("id","WMEVenueLock_TAB_title")
						.css("width","100%")
						.css("text-align","center")
						.css("background-color","#5FAD8A")
						.css("border-radius","5px")
						.css("padding","3px")
						.css("margin-bottom","3px")
						.html("WME VenueLock " + WMEVenueLock.version )
						.dblclick(WMEVenueLock.showDevInfo)
						.attr("title","Click for Development Info");

		$(mainTitle).append($('<div>').attr("id","WMEVenueLock_TabbedUI_toggle")
									  .html("-")
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
									  .click(WMEVenueLock_TabbedUI.hideWindow));

		return mainTitle;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV --------- //
	WMEVenueLock_TabbedUI.TabsHead = function() {
		console.info(WMEVenueLock.logPrefix+": TabsHead");
		// ------- TABS  ------- //
		var mainTabs = $("<div>")
						.attr("id","WMEVenueLock_TAB_head")
						.css("padding","3px")
						.css("margin-bottom","3px")
						.attr("title","Click for Development Info");
						//.html('<ul><li><a href="#tabs-1">One</a></li><li><a href="#tabs-2">Two</a></li></ul>');
						//.tabs();
		var tabs = $("<ul>").addClass("nav")
							.addClass("nav-tabs");

		$(tabs).append($("<li>").append($("<a>").attr("data-toggle","tab")
												.attr("href","#WMEVenueLock_EDIT_TAB")
												.html("Editor")
									   ).addClass("active")
					  );

		$(mainTabs).append(tabs);

		return mainTabs;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV --------- //
	WMEVenueLock_TabbedUI.TabsBody = function() {
		console.info(WMEVenueLock.logPrefix+": TabsBody");

		// ------- TABS  ------- //
		var TabsBodyContainer = $("<div>")
							  .attr("id","WMEVenueLock_TAB_tabs")
							  .attr("style","padding: 0 !important;")
							  .addClass("tab-content");


		return TabsBodyContainer;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.11.3RE
	 */
	WMEVenueLock_TabbedUI.EditorTAB = function() {
		console.info(WMEVenueLock.logPrefix+": EditorTAB");

		Tabs_Main = $('<div>').attr("id",'WMEVenueLock_EDIT_TAB')
							  //.css("padding","10px")
							  .addClass("tab-pane")
							  .addClass("active");

		var selectDiv = $('<div>');
		$(Tabs_Main).append($(selectDiv));

		$(selectDiv).append($("<button>Select</button>")
							.click(WMEVenueLock.Venue.getScreenIDs));

		$(selectDiv).append($("<button>Next</button>")
							.click(WMEVenueLock.Venue.gotoVenue));
		$(selectDiv).append($("<span>").attr("id","WMEVenueLock_Venues_selected")
							.html("0 Places selected")
							.css("text-align","left")
							.css("display","block")
							.css("color","#000000")
							.css("float","right")
							.css("position","relative")
							.css("padding-top","10px"));

		var levelDiv = $('<div>').css('margin-top','10px');
		$(Tabs_Main).append($(levelDiv));

		for(var l=1; l<=6; l++) {

			if(l>Waze.loginManager.user.normalizedLevel) {

				$(levelDiv).append($("<button>").html(l)
												.attr("disabled","true")
												.css("margin-right","5px")
												.css("color","#C8C8C8")
												.css("height","32px")
												.css("width","32px"));
			} else {
				$(levelDiv).append($("<button>").html(l)
												.css("margin-right","5px")
												.css("height","32px")
												.css("width","32px")
												.css("font-weight","600")
												.click(WMEVenueLock.Venue.setLevel)
												.attr('data-level',(l-1)));
			}
		}

		// --- STEP 5 --- //
		$(Tabs_Main).append($("<span>")
							.html('<b>5) Start</b><br>You <b style="color:red;">CANNOT</b> undo after clicking this button.')
							.css("text-align","left")
							.css("display","block")
							.css("color","#000000")
							.css("padding-top","10px")
							.css("clear","both"));

		$(Tabs_Main).append($("<button>Start</button>")
							  .click(WMEVenueLock.run)
							  .css("float","left")
							  .css("background","")
							  .attr("title","Start AutoUR responses"));

		return Tabs_Main;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	WMEVenueLock_TabbedUI.init();
}
//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  END Create Tabbed UI  ----------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  Create floating UI  ------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
function WMEVenueLock_Create_FloatUI() {
	WMEVenueLock_FloatingUI = {};
	/**
	 *@since version 0.0.1
	 */
	WMEVenueLock_FloatingUI.init = function() {

		var MainDIV = WMEVenueLock_FloatingUI.MainDIV();


		// See if the div is already created //
		if ($("#WMEVenueLock_float").length==0) {
			$("#panels-container").append(MainDIV);
			console.info(WMEVenueLock.logPrefix+": Loaded Pannel");
		}

		//--- Drag me Bishes!! ---//
		$("#WMEVenueLock_float").draggable();

	}

	/**
	 *@since version 0.10.0
	 */
	// ---------- MAIN DIV TOGGLE --------- //
	WMEVenueLock_FloatingUI.hideWindow = function() {

		switch($("#WMEVenueLock_float").css("display")) {
			case 'block':	$("#WMEVenueLock_float").css("display","none");		break;
			default:		$("#WMEVenueLock_float").css("display","block");	break;
		}
	}

	/**
	 *@since version 0.10.0
	 */
	// ---------- MAIN DIV TOGGLE --------- //
	WMEVenueLock_FloatingUI.lockButtons = function() {
		$('#venuelock-prev').prop('disabled',true);
		$('#venuelock-next').prop('disabled',true);
		$('#venuelock-levels').children().prop('disabled',true);
	}

	/**
	 *@since version 0.10.0
	 */
	// ---------- MAIN DIV TOGGLE --------- //
	WMEVenueLock_FloatingUI.unlockButtons = function() {
		$('#venuelock-prev').prop('disabled',false);
		$('#venuelock-next').prop('disabled',false);
		$('#venuelock-levels').children('[data-ulevel="true"]').prop('disabled',false);
	}

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.8.1
	 */
	// ---------- MAIN DIV --------- //
	WMEVenueLock_FloatingUI.MainDIV = function() {
		console.info(WMEVenueLock.logPrefix+": create main div");
		var MainDIV = $('<div>').css("background","rgba(95, 173, 138, 0.85)")
								.attr("id","WMEVenueLock_float")
								.css("color","#FFFFFF")
								.css("border-radius","10px")
								.css("z-index","1000")
								.css("position","absolute")
								.css("display","block")
								.css("padding","15px");

		var selectDiv = $('<div>');
		$(MainDIV).append($(selectDiv));

		$(selectDiv).append($("<button>Select</button>")
							.click(WMEVenueLock.Venue.getScreenIDs));

		$(selectDiv).append($("<button>Prev</button>")
							.attr('id','venuelock-prev')
							.click(WMEVenueLock.Venue.gotoPrevVenue));

		$(selectDiv).append($("<button>Next</button>")
							.attr('id','venuelock-next')
							.click(WMEVenueLock.Venue.gotoNextVenue));

		$(selectDiv).append($("<span>").attr("id","WMEVenueLock_Venues_selected")
							.html("0 Places selected")
							.css("text-align","left")
							.css("display","block")
							.css("color","#000000")
							.css("clear","both")
							.css("position","relative")
							.css("padding-top","10px"));

		var levelDiv = $('<div>').css('margin-top','10px').attr('id','venuelock-levels');
		$(MainDIV).append($(levelDiv));

		for(var l=1; l<=6; l++) {

			if(l>Waze.loginManager.user.normalizedLevel) {

				$(levelDiv).append($("<button>").html(l)
												.attr("disabled","true")
												.css("margin-right","5px")
												.css("color","#C8C8C8")
												.css("height","32px")
												.css("width","32px"));
			} else {
				$(levelDiv).append($("<button>").html(l)
												.css("margin-right","5px")
												.attr("data-ulevel","true")
												.css("height","32px")
												.css("width","32px")
												.css("font-weight","600")
												.click(WMEVenueLock.Venue.setLevel)
												.attr('data-level',(l-1)));
			}
		}

		return MainDIV;
	}


	WMEVenueLock_FloatingUI.init();
}

//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  Create floating UI  ------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------  WE HAVE FOUND OUR BOOTS  ------------------------------------------------------------------------------------------
//-------------------------  NOW LETS PUT THEM ON  -------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
WMEVenueLock_bootstrap();
