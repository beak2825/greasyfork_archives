// ==UserScript==
// @name        WME ValidatorProcessor-SK
// @namespace   com.supermedic.validatorProcessorSK
// @description Allow easy movement through all Validotor issues
// @version     0.1.3SK
// @grant       none
// @match       https://www.waze.com/*editor/*
// @match       https://www.waze.com/editor/*
// @downloadURL https://update.greasyfork.org/scripts/7141/WME%20ValidatorProcessor-SK.user.js
// @updateURL https://update.greasyfork.org/scripts/7141/WME%20ValidatorProcessor-SK.meta.js
// ==/UserScript==


/* Changelog
 * 0.1.3SK - tooltip
 * 0.1.2SK - Fixed NaN issue
 * 0.1.1SK - Changed to .user, added Jump button
 * 0.1.0SK - Inital version - FSU
 */

unsafeWindow.WMEValidatorProcessor = {};
WMEValidatorProcessor.version = '0.1.3SK';

function WMEValidatorProcessor_bootstrap() {
  console.info("WMEValidatorProcessor: starting (bootstrap)");
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
	WMEValidatorProcessor_Create();
}

//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------------  WMEValidatorProcessor FUNCTIONS  -----------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
/**
 *@since version 0.10.0
 */
function WMEValidatorProcessor_Create() {
	WMEValidatorProcessor.logPrefix = 'WMEValidatorProcessor';

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//-------------  ##########  START CODE FUNCTION ##########  ---------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.0.1
	 */
	WMEValidatorProcessor.startcode = function () {
		console.info(WMEValidatorProcessor.logPrefix+": startcode");
		// Check if WME is loaded, if not, waiting a moment and checks again. if yes init WMEChatResize
		try {
			//if ("undefined" != typeof unsafeWindow.W.model.chat.rooms._events.listeners.add[0].obj.userPresenters[unsafeWindow.Waze.model.loginManager.user.id] ) {
			if ("undefined" != typeof Waze.map ) {
				console.info(WMEValidatorProcessor.logPrefix+": ready to go");
				WMEValidatorProcessor.init();
			} else {
				console.info(WMEValidatorProcessor.logPrefix+": waiting for WME to load...");
				setTimeout(WMEValidatorProcessor.startcode, 1000);
			}
		} catch(err) {
			console.info(WMEValidatorProcessor.logPrefix+": waiting for WME to load...(caught in an error)");
			console.info(WMEValidatorProcessor.logPrefix+": Error:"+err);
			setTimeout(WMEValidatorProcessor.startcode, 1000);
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
	WMEValidatorProcessor.init = function() {
		console.info(WMEValidatorProcessor.logPrefix+": starting (init)");
		// --- Create Tabbed UI --- //
		WMEValidatorProcessor_Create_TabbedUI();
		// --- Create Floating UI --- //
		WMEValidatorProcessor_Create_FloatUI();
	// @since 0.8.2 - Turned off auto UR finding
		WMEValidatorProcessor.showDevInfo();
		WMEValidatorProcessor_TabbedUI.hideWindow();
		$(document).tooltip();
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//----------------------  VENUE FUNCTIONS  ---------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since 0.0.1
	 */
	WMEValidatorProcessor.Segment = {

		/**
		 *@since version 0.1.0SK
		 */
		run: function() {

			console.info(WMEValidatorProcessor.logPrefix+": Processing");

			var ta_val = $('#validatorprocessor-input-ta').val();
			var initialObjects = JSON.parse(ta_val);
			WMEValidatorProcessor.Segment.finalObjects = [];

			for(var i in initialObjects) {
				if(isNaN(i)) continue;
				var tmp_init_obj = initialObjects[i];
				var tmp_fin_obj = {};
				var lLObj = new OpenLayers.LonLat(tmp_init_obj.lon,tmp_init_obj.lat);
				lLObj.transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
				tmp_fin_obj.lat = lLObj.lat;
				tmp_fin_obj.lon = lLObj.lon;
				tmp_fin_obj.zoom = tmp_init_obj.zoom;
				tmp_fin_obj.id = tmp_init_obj.segments;
				WMEValidatorProcessor.Segment.finalObjects.push(tmp_fin_obj);
			}
			console.info(WMEValidatorProcessor.Segment.finalObjects);

			WMEValidatorProcessor.index = -1;
			$('span[id="WMEValidatorProcessor_Segments_selected"]').html('0 / '+WMEValidatorProcessor.Segment.finalObjects.length + " Places selected");
			window.setTimeout(WMEValidatorProcessor.Segment.gotoNextSegment(),750);
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.0.1
		 */
		gotoPrevSegment: function() {
			if(WMEValidatorProcessor.index === -1) {
				WMEValidatorProcessor.index = 1;
			}
			if(WMEValidatorProcessor.index > -1) {
				WMEValidatorProcessor.index--;
				var currentSegmentOBJ = WMEValidatorProcessor.Segment.finalObjects[WMEValidatorProcessor.index];
				var currentSegmentID = currentSegmentOBJ.id;
				Waze.map.setCenter([currentSegmentOBJ.lon,currentSegmentOBJ.lat],currentSegmentOBJ.zoom);
				window.setTimeout(WMEValidatorProcessor.Segment.selectSegment,1000);
				console.info(WMEValidatorProcessor.logPrefix+": index " + WMEValidatorProcessor.index + ' : ' + currentSegmentID)
				$('span[id="WMEValidatorProcessor_Segments_selected"]').html((WMEValidatorProcessor.index+1)+' / '+WMEValidatorProcessor.Segment.finalObjects.length + " validated segments");
			}
			//WMEValidatorProcessor_FloatingUI.lockButtons()
			//window.setTimeout(WMEValidatorProcessor_FloatingUI.unlockButtons,2000)
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.0.1
		 */
		gotoNextSegment: function() {
			if((WMEValidatorProcessor.index+1)<WMEValidatorProcessor.Segment.finalObjects.length) {
				WMEValidatorProcessor.index++;
				var currentSegmentOBJ = WMEValidatorProcessor.Segment.finalObjects[WMEValidatorProcessor.index];
				var currentSegmentID = currentSegmentOBJ.id;
				Waze.map.setCenter([currentSegmentOBJ.lon,currentSegmentOBJ.lat],currentSegmentOBJ.zoom);
				window.setTimeout(WMEValidatorProcessor.Segment.selectSegment,1000);
				console.info(WMEValidatorProcessor.logPrefix+": index " + WMEValidatorProcessor.index + ' : ' + currentSegmentID)
				$('span[id="WMEValidatorProcessor_Segments_selected"]').html((WMEValidatorProcessor.index+1)+' / '+WMEValidatorProcessor.Segment.finalObjects.length + " validated segments");
			}
			//WMEValidatorProcessor_FloatingUI.lockButtons()
			//window.setTimeout(WMEValidatorProcessor_FloatingUI.unlockButtons,2000)
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.0.1
		 */
		jumpToSegment: function() {
			var newID = Number($('#validatorprocessor-jump-num').val())-1;
			if(newID<WMEValidatorProcessor.Segment.finalObjects.length) {
				WMEValidatorProcessor.index = newID;
				var currentSegmentOBJ = WMEValidatorProcessor.Segment.finalObjects[WMEValidatorProcessor.index];
				var currentSegmentID = currentSegmentOBJ.id;
				Waze.map.setCenter([currentSegmentOBJ.lon,currentSegmentOBJ.lat],currentSegmentOBJ.zoom);
				window.setTimeout(WMEValidatorProcessor.Segment.selectSegment,1000);
				console.info(WMEValidatorProcessor.logPrefix+": index " + WMEValidatorProcessor.index + ' : ' + currentSegmentID)
				$('span[id="WMEValidatorProcessor_Segments_selected"]').html((WMEValidatorProcessor.index+1)+' / '+WMEValidatorProcessor.Segment.finalObjects.length + " validated segments");
			}
			//WMEValidatorProcessor_FloatingUI.lockButtons()
			//window.setTimeout(WMEValidatorProcessor_FloatingUI.unlockButtons,2000)
			return;
		},

		//--------------------------------------------------------------------------------------------------------------------------------------------
		/**
		 *@since version 0.0.1
		 */
		selectSegment: function() {
			// will select more than one object
			var segmentObj = Waze.model.segments.getByIds([WMEValidatorProcessor.Segment.finalObjects[WMEValidatorProcessor.index].id]);
			console.info(segmentObj);
			console.info(Waze.selectionManager.select(segmentObj));
			return;
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
	WMEValidatorProcessor.showDevInfo = function() {
		var info_txt = '';
		info_txt = info_txt + 'Created by: <b>SuperMedic</b><br>';
		info_txt = info_txt + 'Beta Testers: (Public)<br>';
		info_txt = info_txt + '<b>Stephenr1966</b><br>';
		info_txt = info_txt + '<b>ct13</b><br>';
		info_txt = info_txt + '<b>triage685</b><br>';
		$('span[id="WMEValidatorProcessor_TAB_Info"]').html(info_txt);
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.3.1
	 */
	WMEValidatorProcessor.on = function() {

	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.3.1
	 */
	WMEValidatorProcessor.off = function() {

	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------  END OTHER FUNCTIONS  ---------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------------------------------------

	WMEValidatorProcessor.startcode();
}


//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------------  WMEValidatorProcessor FUNCTIONS  -----------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  Create Tabbed UI  --------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------


function WMEValidatorProcessor_Create_TabbedUI() {
	WMEValidatorProcessor_TabbedUI = {};
	/**
	 *@since version 0.11.0
	 */
	WMEValidatorProcessor_TabbedUI.init = function() {

		var venueParentDIV;
		if ($("#WMEValidatorProcessor_TAB_main").length===0) {
			venueParentDIV = WMEValidatorProcessor_TabbedUI.ParentDIV();
			$(venueParentDIV).append(WMEValidatorProcessor_TabbedUI.Title());
			$(venueParentDIV).append($('<span>').attr("id","WMEValidatorProcessor_TAB_Info")
											//.click(function(){$(this).html('');})
											.css("color","#000000"));
			$(venueParentDIV).append(WMEValidatorProcessor_TabbedUI.EditorTAB());

			WMEValidatorProcessor.showDevInfo();

			// See if the div is already created //
			//$("div.tips").after(venueParentDIV);
			console.info("WME-WMEValidatorProcessor_TabbedUI: Loaded Pannel");
		}
		if (ScriptKit.loaded) {
			var icon = 'data:image/png;base64,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';
			console.info("WME-SegmentLock_TabbedUI: Loaded Pannel");
			var tooltip = 'Show/Hide ValidatorProcessor';
			ScriptKit.GUI.addImage(3,icon,WMEValidatorProcessor_TabbedUI.hideWindow,tooltip);
			ScriptKit.GUI.addScript(3,venueParentDIV);
        } else {
            window.setTimeout(WMEAutoUR_TabbedUI.init,500);
        }

	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV TOGGLE --------- //
	WMEValidatorProcessor_TabbedUI.hideWindow = function() {

		switch($("#WMEValidatorProcessor_TAB_main").css("height")) {
			case '30px': 	$("#WMEValidatorProcessor_TAB_main").css("height","auto");
							$("#WMEValidatorProcessor_TabbedUI_toggle").html("-");
							WMEValidatorProcessor.on();		break;
			default:		$("#WMEValidatorProcessor_TAB_main").css("height","30px");
							$("#WMEValidatorProcessor_TabbedUI_toggle").html("+");
							WMEValidatorProcessor.off();	break;
		}

		WMEValidatorProcessor_FloatingUI.hideWindow();
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV --------- //
	WMEValidatorProcessor_TabbedUI.ParentDIV = function() {

		var MainTAB = $('<div>').attr("id","WMEValidatorProcessor_TAB_main")
								.css("color","#FFFFFF")
								.css("border-bottom","2px solid #E9E9E9")
								.css("margin","5px 0 0")
								.css("padding-bottom","10px")
								.css("max-width","275px")
								.css("height","35px")
								.css("overflow","hidden")
								.css("display","block");

		return MainTAB;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV --------- //
	WMEValidatorProcessor_TabbedUI.Title = function() {
		console.info(WMEValidatorProcessor.logPrefix+": TabbedUI create main div ");

		// ------- TITLE  ------- //
		var mainTitle = $("<div>")
						.attr("id","WMEValidatorProcessor_TAB_title")
						.css("width","100%")
						.css("text-align","center")
						.css("background-color","#C1C1C1")
						.css("color","#000000")
						.css("border-radius","5px")
						.css("padding","3px")
						.css("margin-bottom","3px")
						.html("WME ValidatorProcessor " + WMEValidatorProcessor.version )
						.dblclick(WMEValidatorProcessor.showDevInfo)
						.attr("title","Click for Development Info");

		$(mainTitle).append($('<div>').attr("id","WMEValidatorProcessor_TabbedUI_toggle")
									  .html("+")
									  .css("float","right")
									  .css("position","relative")
									  .css("color","#FFFFFF")
									  .css("right","3px")
									  .css("top","0")
									  .css("background","#000000")
									  .css("height","16px")
									  .css("width","16px")
									  .css("display","block")
									  .css("line-height","14px")
									  .css("border-radius","5px")
									  .click(WMEValidatorProcessor_TabbedUI.hideWindow));

		return mainTitle;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 *@since version 0.11.0
	 */
	// ---------- MAIN DIV --------- //
	WMEValidatorProcessor_TabbedUI.TabsHead = function() {
		console.info(WMEValidatorProcessor.logPrefix+": TabsHead");
		// ------- TABS  ------- //
		var mainTabs = $("<div>")
						.attr("id","WMEValidatorProcessor_TAB_head")
						.css("padding","3px")
						.css("margin-bottom","3px")
						.attr("title","Click for Development Info");
						//.html('<ul><li><a href="#tabs-1">One</a></li><li><a href="#tabs-2">Two</a></li></ul>');
						//.tabs();
		var tabs = $("<ul>").addClass("nav")
							.addClass("nav-tabs");

		$(tabs).append($("<li>").append($("<a>").attr("data-toggle","tab")
												.attr("href","#WMEValidatorProcessor_EDIT_TAB")
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
	WMEValidatorProcessor_TabbedUI.TabsBody = function() {
		console.info(WMEValidatorProcessor.logPrefix+": TabsBody");

		// ------- TABS  ------- //
		var TabsBodyContainer = $("<div>")
							  .attr("id","WMEValidatorProcessor_TAB_tabs")
							  .attr("style","padding: 0 !important;")
							  .addClass("tab-content");


		return TabsBodyContainer;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.11.3RE
	 */
	WMEValidatorProcessor_TabbedUI.EditorTAB = function() {
		console.info(WMEValidatorProcessor.logPrefix+": EditorTAB");

		Tabs_Main = $('<div>').attr("id",'WMEValidatorProcessor_EDIT_TAB')
							  //.css("padding","10px")
							  .addClass("tab-pane")
							  .addClass("active");

		$(Tabs_Main).append($("<span>")
							.html('Paste the provided text below...')
							.css("text-align","left")
							.css("display","block")
							.css("color","#000000")
							.css("padding-top","10px")
							.css("clear","both"));

		$(Tabs_Main).append($("<textarea>").attr('id','validatorprocessor-input-ta')
											.css('height','75px')
											.css('width','100%'));

		// --- STEP 5 --- //
		$(Tabs_Main).append($("<span>")
							.html('and make the magic happen with just a click...')
							.css("text-align","left")
							.css("display","block")
							.css("color","#000000")
							.css("padding-top","10px")
							.css("clear","both"));

		$(Tabs_Main).append($("<button>Start</button>")
							  .click(WMEValidatorProcessor.Segment.run)
							  .css("float","left")
							  .css("background","")
							  .attr("title","Start AutoUR responses"));

		return Tabs_Main;
	};

	//--------------------------------------------------------------------------------------------------------------------------------------------

	WMEValidatorProcessor_TabbedUI.init();
}
//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  END Create Tabbed UI  ----------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  Create floating UI  ------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
function WMEValidatorProcessor_Create_FloatUI() {
	WMEValidatorProcessor_FloatingUI = {};
	/**
	 *@since version 0.0.1
	 */
	WMEValidatorProcessor_FloatingUI.init = function() {

		var MainDIV = WMEValidatorProcessor_FloatingUI.MainDIV();


		// See if the div is already created //
		if ($("#WMEValidatorProcessor_float").length==0) {
			$("#panels-container").append(MainDIV);
			console.info(WMEValidatorProcessor.logPrefix+": Loaded Pannel");
		}

		//--- Drag me Bishes!! ---//
		$("#WMEValidatorProcessor_float").draggable();

	}

	/**
	 *@since version 0.10.0
	 */
	// ---------- MAIN DIV TOGGLE --------- //
	WMEValidatorProcessor_FloatingUI.hideWindow = function() {

		switch($("#WMEValidatorProcessor_float").css("display")) {
			case 'block':	$("#WMEValidatorProcessor_float").css("display","none");		break;
			default:		$("#WMEValidatorProcessor_float").css("display","block");	break;
		}
	}

	/**
	 *@since version 0.10.0
	 */
	// ---------- MAIN DIV TOGGLE --------- //
	WMEValidatorProcessor_FloatingUI.lockButtons = function() {
		$('#venuelock-prev').prop('disabled',true);
		$('#venuelock-next').prop('disabled',true);
	}

	/**
	 *@since version 0.10.0
	 */
	// ---------- MAIN DIV TOGGLE --------- //
	WMEValidatorProcessor_FloatingUI.unlockButtons = function() {
		$('#venuelock-prev').prop('disabled',false);
		$('#venuelock-next').prop('disabled',false);
	}

	//--------------------------------------------------------------------------------------------------------------------------------------------

	/**
	 *@since version 0.8.1
	 */
	// ---------- MAIN DIV --------- //
	WMEValidatorProcessor_FloatingUI.MainDIV = function() {
		console.info(WMEValidatorProcessor.logPrefix+": create main div");
		var MainDIV = $('<div>').css("background","rgba(193, 193, 193, 0.85)")
								.attr("id","WMEValidatorProcessor_float")
								.css("color","#FFFFFF")
								.css("border-radius","10px")
								.css("z-index","1000")
								.css("position","absolute")
								.css("display","block")
								.css("padding","15px");

		var selectDiv = $('<div>');
		$(MainDIV).append($(selectDiv));

		$(selectDiv).append($("<button>Prev</button>")
							.attr('id','validatorprocessor-prev')
							.click(WMEValidatorProcessor.Segment.gotoPrevSegment));

		$(selectDiv).append($("<button>Next</button>")
							.attr('id','validatorprocessor-next')
							.click(WMEValidatorProcessor.Segment.gotoNextSegment));

		$(selectDiv).append($("<input>")
							.attr('id','validatorprocessor-jump-num')
							.css('height','32px')
							.css('width','32px')
							.css('margin-left','10px')
							.css('text-align','center'));

		$(selectDiv).append($("<button>Jump</button>")
							.attr('id','validatorprocessor-jump')
							.click(WMEValidatorProcessor.Segment.jumpToSegment));

		$(selectDiv).append($("<span>").attr("id","WMEValidatorProcessor_Segments_selected")
							.html("0 validated segments")
							.css("text-align","left")
							.css("display","block")
							.css("color","#000000")
							.css("clear","both")
							.css("position","relative")
							.css("padding-top","10px"));

		return MainDIV;
	}


	WMEValidatorProcessor_FloatingUI.init();
}

//--------------------------------------------------------------------------------------------------------------------------------------------
//----------------  Create floating UI  ------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------  WE HAVE FOUND OUR BOOTS  ------------------------------------------------------------------------------------------
//-------------------------  NOW LETS PUT THEM ON  -------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------
WMEValidatorProcessor_bootstrap();
