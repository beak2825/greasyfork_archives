// ==UserScript==
// @name          Planets.nu - Idle Object Visualizer Plugin
// @namespace     kedalion/idleObjectVisualizer
// @version       0.71
// @date          2018-12-22
// @author        kedalion
// @description   NU plugin which displays all planets, starbases, and ships that are marked idle, ready, or permanently ready
// @include       http://planets.nu/*
// @include       http://play.planets.nu/*
// @include       http://test.planets.nu/*
// @include       https://mobile.planets.nu/*
// @include       https://planets.nu/*
// @resource      userscript https://greasyfork.org/en/scripts/6442-planets-nu-idle-object-visualizer-plugin
// @homepage      http://planets.nu/discussion/utility-script-idle-object-visualizer-plugin

// @downloadURL https://update.greasyfork.org/scripts/6442/Planetsnu%20-%20Idle%20Object%20Visualizer%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/6442/Planetsnu%20-%20Idle%20Object%20Visualizer%20Plugin.meta.js
// ==/UserScript==

/*
 Change log:
 0.71   Updated include for new URL [2018-12-22]
 0.70   Port to mobile version of client [2018-12-22]
 0.66   Removed a typo in a function call [2017-06-06]
 0.65   Removed bugs for newer games where ships don't show properly [2017-06-05]
 0.64   Removed double initialization of variables and added comments. [2017-06-05]
 0.63   Fixed conflict with ship tow indicator (thanks Mabeco) [2017-06-04]
 0.62   Added alternative ship coloring as used by Glyn [2017-06-04]
 0.61   Move script location to greasyfork.org [2014-11-13]
 0.6    Move script location to monkeyguts.com [2014-05-30]
 0.58   No fleet view for single objects [2014-04-26]
 0.57   Added filters for ship types [2014-04-24]
 0.56   Added ready markers to ship icons in detail list. Fixed issues with full allies: both own and ally ships were blue. Planet and Starbase are always displayed in mini-list to prevent ships changing position in mini-list when switching to planet or base and back.  [2014-04-24]
 0.55   Fixed small bug in planet color [2014-04-15]
 0.54   Added auto enabled after selection in map tools [2014-02-18]
 0.53   Fixed line width bug [2014-02-16]
 0.51	Added enable/disable buttons [2014-02-11]
 0.5    Initial alpha release [2014-02-11]
 */
function wrapper() { // wrapper for injection

	if (vgap.version < 3.0) {
		console.log("IdleObjectVisualizer plugin requires at least NU version 3.0. Plugin disabled.");
		return;
	}

	var plugin_version = 0.71;

	console.log("IdleObjectVisualizer plugin version: v" + plugin_version + "." );

	objectTypeEnum = {
		PLANETS     : 0,
		BASES       : 1,
		SHIPS       : 2,
		FILTERSHIPS : 3
	};

	/**
	 *  Specify your plugin
	 *  You need to have all those methods defined or errors will be thrown.
	 *  I inserted the print-outs in order to demonstrate when each method is
	 *  being called. Just comment them out once you know your way around.
	 *
	 *  For any access to plugin class variables and methods,
	 *  "vgap.plugins["idleObjectVisualizerPlugin"].my_variable" has to be used
	 *  instead of "this.my_variable".
	 */
	var idleObjectVisualizerPlugin = {

		/**
		 * processload: executed whenever a turn is loaded: either the current turn or
		 * an older turn through time machine
		 */
		processload : function() {
			//console.log("ProcessLoad: plugin called.");
			vgap.plugins["idleObjectVisualizerPlugin"].mobile_version = vgap.plugins["idleObjectVisualizerPlugin"].checkIfMobileVersion();
		},

		/**
		 * loaddashboard: executed to rebuild the dashboard content after a turn is loaded
		 */
		loaddashboard : function() {
			//console.log("LoadDashboard: plugin called.");
		},

		/**
		 * showdashboard: executed when switching from starmap to dashboard
		 */
		showdashboard : function() {
			//console.log("ShowDashboard: plugin called.");
			vgap.plugins["idleObjectVisualizerPlugin"].resetIdleSelectorTools();
		},

		/**
		 * showsummary: executed when returning to the main screen of the dashboard
		 */
		showsummary : function() {
			//console.log("ShowSummary: plugin called.");
			vgap.plugins["idleObjectVisualizerPlugin"].resetIdleSelectorTools();
		},

		/**
		 * loadmap: executed after the first turn has been loaded to create the map
		 * as far as I can tell not executed again when using time machine
		 */
		loadmap : function() {
			if (!vgap.plugins["idleObjectVisualizerPlugin"].mobile_version) {
				vgap.map.addMapTool("<span style=\"color:#FF8000\">Idle Visualizer</span>", "ShowMinerals", vgap.plugins["idleObjectVisualizerPlugin"].showIdleSelectorToolsEnabled);
				vgap.map.addMapTool("<span style=\"color:#FF8000\">Ship Type Filter</span>", "ShowMinerals", vgap.plugins["idleObjectVisualizerPlugin"].showOverlayFilter);
			} else {
				vgap.map.addMapTool("Idle Object Visualizer", "idleobjectmenu orangecolor", function () {vgap.plugins["idleObjectVisualizerPlugin"].toggleIdleObjectMenu(); });
				vgap.map.addMapTool("Idle Object Visualizer", "typeselectormenu orangecolor", function () {vgap.plugins["idleObjectVisualizerPlugin"].toggleShipFilterObjectMenu(); });


				var head = document.getElementsByTagName('head')[0];
			  if (head) {
			 		 var newCss = document.createElement('style');
			 		 newCss.type = "text/css";
					  newCss.innerHTML = ".orangecolor::before {color: #FF8C00}";
					  newCss.innerHTML += ".idleobjectmenu::before { content: \"\\f129\"}";
					  newCss.innerHTML += ".typeselectormenu::before { content: \"\\f0ca\"}";
					  
			 		 head.appendChild(newCss);
			  }

			  if (head) {
				var newCss = document.createElement('style');
				newCss.type = "text/css";
				newCss.innerHTML = "#IdleObjectTools {" +
					"position: absolute; " +
					"right: 40px; " +
					"z-index: 9;" +
					"top: 0px;" +
					"width: 40px;" +
					"height: 300px;" +
				"}" +
				"#IdleObjectTools .mapbutton {" +
					"position: relative;" +
					"margin-left: 10px;" +
					"margin-bottom: 10px;" +
					"float:right;" +
				"}";

				newCss.innerHTML += ".activecolor::before {color: #00a000}";
				newCss.innerHTML += ".redcolor::before {color: #FF0000}";
				newCss.innerHTML += ".idlemenuhide::before { content: \"\\f105\";}";
				newCss.innerHTML += ".idledisable::before { content: \"\\f011\";}";
				newCss.innerHTML += ".idlecoloration::before { content: \"\\f53f\";}";				
				newCss.innerHTML += ".highlightnotready::before { content: \"\\f0c8\";}";
				newCss.innerHTML += ".highlightready::before { content: \"\\f00c\"; }";
				newCss.innerHTML += ".highlightalwaysready::before { content: \"\\f560\";}";
				newCss.innerHTML += ".idleplanets::before { content: \"\\f57d\"; }";
				newCss.innerHTML += ".idlebases::before { content: \"\\f447\"; }";
				newCss.innerHTML += ".idleships::before { content: \"\\f197\"; }";
				
				newCss.innerHTML += "#IdleObjectShipFilter {" +
					"position: absolute; " +
					"right: 40px; " +
					"z-index: 9;" +
					"top: 0px;" +
					"width: 40px;" +
					"height: 300px;" +
				"}" +
				"#IdleObjectShipFilter .mapbutton {" +
					"position: relative;" +
					"margin-left: 10px;" +
					"margin-bottom: 10px;" +
					"float:right;" +
				"}";

				for (var i = 1; i < vgap.plugins["idleObjectVisualizerPlugin"].shipTypes.length; i++)
				{
					var startLetter = vgap.plugins["idleObjectVisualizerPlugin"].shipTypes[i].substring(0, 1);					
					newCss.innerHTML += ".shiptype" + i + "::before { content: '" + startLetter + "';}";					
				}

				head.appendChild(newCss);
			  }
			}
		},

		/**
		 * showmap: executed when switching from dashboard to starmap
		 */
		showmap : function() {
			//console.log("ShowMap: plugin called.");
		},

		/**
		 * draw: executed on any click or drag on the starmap
		 */
		draw : function() {
			//console.log("Draw: plugin called.");
			vgap.plugins["idleObjectVisualizerPlugin"].drawStatusObjects();
			vgap.plugins["idleObjectVisualizerPlugin"].drawFilteredShips();
		},

		/**
		 * loadplanet: executed a planet is selected on dashboard or starmap
		 */
		loadplanet : function() {
			//console.log("LoadPlanet: plugin called.");
		},

		/**
		 * loadstarbase: executed a planet is selected on dashboard or starmap
		 */
		loadstarbase : function() {
			//console.log("LoadStarbase: plugin called.");
		},

		/**
		 * loadship: executed a planet is selected on dashboard or starmap
		 */
		loadship : function() {
			//console.log("LoadShip: plugin called.");
		},

		/***************************************************************************************
		 * Custom plugin variables
		 ***************************************************************************************/

		//things that get saved to disk
		version : plugin_version,
		plugin_name: "IdleObjectVisualizerPlugin",
		//storage_path : "nuIdleObjectPlugin.",

		// default value for settings:
		// plugin enabled default setting
		enabled : false,

		typeSelectorMenuActive : false,
		idleObjectMenuActive : false, 

		// object type default values (planets, bases, ships)
		drawSelection : [ false, false, true ],

		// default status (0 = idle, 1 = ready, 2 = permanently ready)
		drawStatus : 0,

		// colors for planets, bases, ships, filtered ships
		colors : [ "#990099", "#3399FF", "#FFFF00" , "#FF8000"],

		// default value if all ships should have same color markers (false) or according to values in 'shipColors' for ship types
		colorShipTypes: false,

		// width of marker circles
		lineWidth : 5,

		// default size of circles (additionally, custom sizes in 'shipMarkerSizes' are used with custom ship type coloring
		shipMarkerSize : 15,

		//ship type groups and their members
		shipTypes : ["Merlins", "Refinery Ships", "Fireclouds", "HYP Ships", "Cobols", "Terraformers", "Decloakers", "Freighters"],
        shipSelection : [ false, false, false, false, false, false, false, false ],
        shipGroupMembers : [ [105], [104,97], [56], [51,77,87,110], [96], [180,64,107,8,3], [7,41,1041,1039,39], []],
		// possible custom colors for ship types (with alternative color scheme enabled)
		shipColors: [ "", "", "#0511FF", "", "", "FF0000", "", "#00FF00"],
		// possible custom circle sizes for ship types (with alternative color scheme enabled)
		shipMarkerSizes: [ -1, -1,  25, -1, -1, 10, -1, 20],

		oldShipScan: null,
    	mobile_version: false,

		/***************************************************************************************
		 * Custom plugin methods
		 ***************************************************************************************/

		/**
		* Determine if new client version (> 4.0 aka mobile version) is running
		*/
		checkIfMobileVersion: function() {

		 url = window.location.href;
		 if (vgap.version >= 4.0) {
			 console.log("Mobile client code detected...");
			 return true;
		 } else {
			 console.log("Non-mobile client code detected...");
			 return false;
		 }
		},

		/**
		 * Enables and disables the plugin
		 */
		enablePlugin : function() {

			vgap.plugins["idleObjectVisualizerPlugin"].showIdleSelectorTools(true);

			vgap.map.draw();
		},

		/**
		 * Draw locations of object with desired status on the map
		 */
		drawStatusObjects : function() {

			if (!this.enabled) {
				return;
			}

			if (this.drawSelection[objectTypeEnum.ALL] || this.drawSelection[objectTypeEnum.PLANETS]) {

				var color_string = this.colors[objectTypeEnum.PLANETS];

				for ( var p = 0; p < vgap.planets.length; p++) {
					var planet = vgap.planets[p];

					if (planet.ownerid != vgap.player.id) {
						continue;
					}

					if (planet.readystatus != this.drawStatus) {
						continue;
					}

					this.drawScaledCircle(planet.x, planet.y, 19, color_string, null, 0.5);
				}
			}

			if (this.drawSelection[objectTypeEnum.ALL] || this.drawSelection[objectTypeEnum.BASES]) {

				var color_string = this.colors[objectTypeEnum.BASES];

				for ( var p = 0; p < vgap.starbases.length; p++) {
					var base = vgap.starbases[p];
					var planet = vgap.getPlanet(base.planetid);

					if (planet.ownerid != vgap.player.id) {
						continue;
					}

					if (base.readystatus != this.drawStatus) {
						continue;
					}

					this.drawScaledCircle(planet.x, planet.y, 11, color_string, null, 0.7);
				}
			}

			if (this.drawSelection[objectTypeEnum.ALL] || this.drawSelection[objectTypeEnum.SHIPS]) {

				var color_string = this.colors[objectTypeEnum.SHIPS];

				for ( var p = 0; p < vgap.ships.length; p++) {
					var ship = vgap.ships[p];

					if (ship.ownerid != vgap.player.id) {
						continue;
					}

					if (ship.readystatus != this.drawStatus) {
						continue;
					}

					var color_string = this.colors[objectTypeEnum.SHIPS];
					var marker_size = this.shipMarkerSize;

					if (this.colorShipTypes) {
						for (var i=0; i<this.shipSelection.length; i++) {

							//freighters are special
							if (i == 7) {
								if (ship.beams == 0 && ship.bays == 0 && ship.torps == 0) {
									if (this.shipColors[i] !== "") {
										color_string = this.shipColors[i];
									}
									if (this.shipMarkerSizes[i] > 0) {
										marker_size = this.shipMarkerSizes[i];
									}
									break;
								}
							} else {
								for (var t=0; t<this.shipGroupMembers[i].length; t++) {
									if (ship.hullid == this.shipGroupMembers[i][t]) {
										if (this.shipColors[i] !== "") {
											color_string = this.shipColors[i];
										}
										if (this.shipMarkerSizes[i] > 0) {
											marker_size = this.shipMarkerSizes[i];
										}
										break;
									}
								}
							}
                        }
					}

					this.drawScaledCircle(ship.x, ship.y, marker_size, color_string, null, 0.5);

				}
			}
		},


		/**
		 * Highlight location of selected ship types on the map
		 */
		drawFilteredShips : function() {

            var drawAny = false;

            for (var i=0; i<this.shipSelection.length; i++) {
                if (this.shipSelection[i]) {
                    drawAny = true;
                    break;
                }
            }

			if (drawAny) {

				var color_string = this.colors[objectTypeEnum.FILTERSHIPS];

				for ( var p = 0; p < vgap.ships.length; p++) {
					var ship = vgap.ships[p];

					if (ship.ownerid != vgap.player.id) {
						continue;
					}

                    var drawIt = false;
                    for (var i=0; i<this.shipSelection.length; i++) {
                        if (this.shipSelection[i]) {
                            //freighters are special
                            if (i == 7) {
                                if (ship.beams == 0 && ship.bays == 0 && ship.torps == 0) {
                                    drawIt = true;
                                }
                            } else {
                                for (var t=0; t<this.shipGroupMembers[i].length; t++) {
                                    if (ship.hullid == this.shipGroupMembers[i][t]) {
                                        drawIt = true;
                                        break;
                                    }
                                }
                            }

                        }
                        if (drawIt) {
                            this.drawScaledCircle(ship.x, ship.y, 25, color_string, null, 0.8);
                            break;
                        }
                    }
				}
			}

		},

		/**
		 * Generate the content for the enemy ship dashboard tab
		 * @param x			x coordinate of ship
		 * @param y			y coordinate of ship
		 * @param radius	radius of circle
		 * @param color_str		color of the drawing
		 * @param paperset	where to draw
		 * @param alpha     alpha value to use
		 */
		drawScaledCircle : function(x, y, radius, color, paperset, alpha) {
			if (!vgap.map.isVisible(x, y, radius))
				return;
			radius *= vgap.map.zoom;
			if (radius <= 1)
				radius = 1;
			if (paperset == null)
				paperset = vgap.map.ctx;
			paperset.strokeStyle = colorToRGBA(color, alpha);

			//save original line width
			var org_line_width = paperset.lineWidth;

			paperset.lineWidth = this.lineWidth;
			//paperset.setAlpha(0.5);
			paperset.beginPath();
			paperset.arc(vgap.map.screenX(x), vgap.map.screenY(y), radius, 0, Math.PI * 2, false);
			paperset.stroke();

			//restore previous line width
			paperset.lineWidth = org_line_width;

		},

		/**
		 * Toggle the checkbox deciding which player's ships are being displayed
		 * @param id		id of player to toggle
		 */
		toggleSelection : function(id) {

			if (id < 0 || id > 2) {
				return;
			}
			//console.log("Toggling: " + id);

			vgap.plugins["idleObjectVisualizerPlugin"].drawSelection[id] = !vgap.plugins["idleObjectVisualizerPlugin"].drawSelection[id];
			vgap.plugins["idleObjectVisualizerPlugin"].showIdleSelectorToolsEnabled();
		},

		selectDrawStatus: function(status) {
			if (status < 0 || status > 2) {
				return;
			}

			vgap.plugins["idleObjectVisualizerPlugin"].drawStatus = status;
			vgap.plugins["idleObjectVisualizerPlugin"].showIdleSelectorToolsEnabled();
		},


		/**
		 * Toggle the checkbox deciding which player's ships are being displayed
		 * @param id		id of player to toggle
		 */
		toggleColorSelection : function() {

			vgap.plugins["idleObjectVisualizerPlugin"].colorShipTypes = !vgap.plugins["idleObjectVisualizerPlugin"].colorShipTypes;			
		},

		/**
		 * Enable the plugin and show the top menu for selecting what objects (planets/bases/ships) to visualize and for which status
		 */
		showIdleSelectorToolsEnabled : function() {
			vgap.plugins["idleObjectVisualizerPlugin"].showIdleSelectorTools(true);
			vgap.map.draw();
		},

		toggleIdleObjectMenu : function() {
			if (vgap.plugins["idleObjectVisualizerPlugin"].idleObjectMenuActive) {
				$("#IdleObjectTools").remove();
				vgap.plugins["idleObjectVisualizerPlugin"].idleObjectMenuActive = false;
			}
			else {
				vgap.plugins["idleObjectVisualizerPlugin"].showIdleSelectorToolsEnabled();
			}
		},

		toggleShipFilterObjectMenu : function() {
			if (vgap.plugins["idleObjectVisualizerPlugin"].typeSelectorMenuActive) {
				$("#IdleObjectShipFilter").remove();
				vgap.plugins["idleObjectVisualizerPlugin"].typeSelectorMenuActive = false;
			}
			else 
			{
				vgap.plugins["idleObjectVisualizerPlugin"].showTypeSelectorTools();
			}
		},
		
		/**
		 * Show/refresh the top menu for selecting what objects (planets/bases/ships) to visualize and for which status
		 */
		showIdleSelectorTools : function(enable) {

			if (enable != null) {
				this.enabled = enable;
			}

			if (vgap.plugins["idleObjectVisualizerPlugin"].mobile_version) {
				// prevent overlap with other menu
				$("#IdleObjectShipFilter").remove();
				vgap.plugins["idleObjectVisualizerPlugin"].typeSelectorMenuActive = false;

				vgap.plugins["idleObjectVisualizerPlugin"].idleObjectMenuActive = true;

				$("#IdleObjectTools").remove();
				$("<div id='IdleObjectTools' " + "></div>").appendTo("#MapControls");
				vgap.map.addMapTool("Close Idle Object Visualizer Menu", "idlemenuhide", function () {  vgap.plugins['idleObjectVisualizerPlugin'].toggleIdleObjectMenu(); }, "#IdleObjectTools");
				vgap.map.addMapTool("Close and disable", "idledisable redcolor", function () {vgap.plugins['idleObjectVisualizerPlugin'].showIdleSelectorTools(false); vgap.plugins['idleObjectVisualizerPlugin'].toggleIdleObjectMenu(); vgap.map.draw();}, "#IdleObjectTools")
				vgap.map.addMapTool("Color by ship type", "idlecoloration" + (vgap.plugins['idleObjectVisualizerPlugin'].colorShipTypes ? " activecolor" : ""), function () {vgap.plugins['idleObjectVisualizerPlugin'].toggleColorSelection(); vgap.plugins["idleObjectVisualizerPlugin"].showIdleSelectorToolsEnabled();}, "#IdleObjectTools")
				
				// selectors 'not ready', 'ready', 'always ready'
				vgap.map.addMapTool("Not ready", "highlightnotready" + (vgap.plugins['idleObjectVisualizerPlugin'].drawStatus == 0 ? " activecolor" : ""), function() {vgap.plugins["idleObjectVisualizerPlugin"].selectDrawStatus(0)}, "#IdleObjectTools");
				vgap.map.addMapTool("Ready", "highlightready" + (vgap.plugins['idleObjectVisualizerPlugin'].drawStatus == 1 ? " activecolor" : ""), function() {vgap.plugins["idleObjectVisualizerPlugin"].selectDrawStatus(1)}, "#IdleObjectTools");
				vgap.map.addMapTool("Always ready", "highlightalwaysready" + (vgap.plugins['idleObjectVisualizerPlugin'].drawStatus == 2 ? " activecolor" : ""), function() {vgap.plugins["idleObjectVisualizerPlugin"].selectDrawStatus(2)}, "#IdleObjectTools");
				// toggle ships
				vgap.map.addMapTool("Ships'", "idleships" + (vgap.plugins['idleObjectVisualizerPlugin'].drawSelection[objectTypeEnum.SHIPS] ? " activecolor" : ""), function() {vgap.plugins["idleObjectVisualizerPlugin"].toggleSelection(objectTypeEnum.SHIPS)}, "#IdleObjectTools");
				// toggle bases
				vgap.map.addMapTool("Bases'", "idlebases fab" + (vgap.plugins['idleObjectVisualizerPlugin'].drawSelection[objectTypeEnum.BASES] ? " activecolor" : ""), function() {vgap.plugins["idleObjectVisualizerPlugin"].toggleSelection(objectTypeEnum.BASES)}, "#IdleObjectTools");
				// toggle planets
				vgap.map.addMapTool("Planets'", "idleplanets" + (vgap.plugins['idleObjectVisualizerPlugin'].drawSelection[objectTypeEnum.PLANETS] ? " activecolor" : ""), function() {vgap.plugins["idleObjectVisualizerPlugin"].toggleSelection(objectTypeEnum.PLANETS)}, "#IdleObjectTools");
								
				
			} else {
				$("#IdleToolsContainer").remove();
				
				var html = "<li id='IdleToolsContainer'><div id='ToolSelector'><table><tr>"; // style='border: 1px solid #000000;'>";
				html += "<td><label><input id='idle_type_color_option' type='checkbox' "
						+ (vgap.plugins["idleObjectVisualizerPlugin"].colorShipTypes ? "checked" : "")
						+ " onchange='vgap.plugins[\"idleObjectVisualizerPlugin\"].toggleColorSelection(); vgap.map.draw();'>"
						+ "</input>Ship Colors</label></td>";
				html += "<td>&nbsp; &nbsp; </td>";
				html += "<td>Status <select id='OverlaySelect' onchange='vgap.plugins[\"idleObjectVisualizerPlugin\"].drawStatus=parseInt($(\"#OverlaySelect\").val());vgap.plugins[\"idleObjectVisualizerPlugin\"].showIdleSelectorTools(); vgap.map.draw();'>";

				html += "<option value=0 " + (vgap.plugins['idleObjectVisualizerPlugin'].drawStatus == 0 ? "selected" : "")
						+ ">Not ready</option>";
				html += "<option value=1 " + (vgap.plugins['idleObjectVisualizerPlugin'].drawStatus == 1 ? "selected" : "") + ">Ready</option>";
				html += "<option value=2 " + (vgap.plugins['idleObjectVisualizerPlugin'].drawStatus == 2 ? "selected" : "")
						+ ">Permanent Ready</option>";

				html += "</select></td>";

				html += "<td><label><input id='idle_type_planets' type='checkbox' "
						+ (vgap.plugins["idleObjectVisualizerPlugin"].drawSelection[objectTypeEnum.PLANETS] ? "checked" : "")
						+ " onchange='vgap.plugins[\"idleObjectVisualizerPlugin\"].toggleSelection(" + objectTypeEnum.PLANETS
						+ "); vgap.map.draw();'></input>Planets</label></td>";
				html += "<td><label><input id='idle_type_bases' type='checkbox' "
						+ (vgap.plugins["idleObjectVisualizerPlugin"].drawSelection[objectTypeEnum.BASES] ? "checked" : "")
						+ " onchange='vgap.plugins[\"idleObjectVisualizerPlugin\"].toggleSelection(" + objectTypeEnum.BASES
						+ "); vgap.map.draw();'></input>Bases</label></td>";
				html += "<td><label><input id='idle_type_ships' type='checkbox' "
						+ (vgap.plugins["idleObjectVisualizerPlugin"].drawSelection[objectTypeEnum.SHIPS] ? "checked" : "")
						+ " onchange='vgap.plugins[\"idleObjectVisualizerPlugin\"].toggleSelection(" + objectTypeEnum.SHIPS
						+ "); vgap.map.draw();'></input>Ships</label></td>";
				if (vgap.plugins["idleObjectVisualizerPlugin"].enabled) {

					html += "<td onclick='vgap.plugins[\"idleObjectVisualizerPlugin\"].showIdleSelectorTools(false); vgap.map.draw();'><span style='background: #33CC33; padding: 5px;'> Disable </span></td>";
					//html += "<td onclick='vgap.plugins[\"idleObjectVisualizerPlugin\"].enabled = false; vgap.plugins[\"idleObjectVisualizerPlugin\"].showIdleSelectorTools(false); vgap.map.draw();'><span style='background: #33CC33; padding: 5px;'> Disable </span></td>";
				} else {
					html += "<td onclick='vgap.plugins[\"idleObjectVisualizerPlugin\"].showIdleSelectorTools(true); vgap.map.draw();'><span style='background: #CC0000; padding: 5px;'> Enable </span></td>";
					//html += "<td onclick='vgap.plugins[\"idleObjectVisualizerPlugin\"].enabled = true; vgap.plugins[\"idleObjectVisualizerPlugin\"].showIdleSelectorTools(true); vgap.map.draw();'><span style='background: #CC0000; padding: 5px;'> Enable </span></td>";
				}

				html += "<td><a class='rNavRight' onclick='vgap.plugins[\"idleObjectVisualizerPlugin\"].resetIdleSelectorTools();'></a></td>";
				html += "</td></tr></table></div></li>";
				$("#PlanetsMenu").prepend(html);
			}

		},
		

		resetIdleSelectorTools : function() {

			$("#IdleToolsContainer").remove();			
		},

		/**
		 * Show/refresh the menu for selecting what ships types to highlight
		 */
		showTypeSelectorTools : function() {
			
			if (vgap.plugins["idleObjectVisualizerPlugin"].mobile_version) {

				// prevent overlap with other menu
				$("#IdleObjectTools").remove();
				vgap.plugins["idleObjectVisualizerPlugin"].idleObjectMenuActive = false;


				vgap.plugins["idleObjectVisualizerPlugin"].typeSelectorMenuActive = true;
				$("#IdleObjectShipFilter").remove();
				$("<div id='IdleObjectShipFilter' " + "></div>").appendTo("#MapControls");
				vgap.map.addMapTool("Close Type Filter Menu", "idlemenuhide", function () {  vgap.plugins['idleObjectVisualizerPlugin'].toggleShipFilterObjectMenu(); }, "#IdleObjectShipFilter");
				// vgap.map.addMapTool("Color by ship type", "idlecoloration" + (vgap.plugins['idleObjectVisualizerPlugin'].colorShipTypes ? " activecolor" : ""), function () {vgap.plugins['idleObjectVisualizerPlugin'].toggleColorSelection();}, "#IdleObjectShipFilter")
				
				for (var i = 1; i < vgap.plugins["idleObjectVisualizerPlugin"].shipTypes.length; i++)
				{
					vgap.map.addMapTool("Highlight all " + vgap.plugins["idleObjectVisualizerPlugin"].shipTypes[i], "shiptype" + i + (vgap.plugins['idleObjectVisualizerPlugin'].shipSelection[i] ? " activecolor" : ""), vgap.plugins["idleObjectVisualizerPlugin"].toggleFilterSelectionHelper.bind(i) , "#IdleObjectShipFilter");					
				}			
			} 
		},

		/**
		 * Show the panel for selecting which ship types to show the ship locations for
		 */
        showOverlayFilter : function () {

            var html = "<div id='OverlayFilter'><table>";

            for (var i=0; i<vgap.plugins["idleObjectVisualizerPlugin"].shipTypes.length; i++) {


                var check_text = "";
                if (vgap.plugins["idleObjectVisualizerPlugin"].shipSelection[i]) {
                	check_text = " checked";
                }
                html += "<tr><td><input type='checkbox' " + check_text + " onchange='vgap.plugins[\"idleObjectVisualizerPlugin\"].toggleFilterSelection(" + i + "); vgap.map.draw(); '></input></td><td>" + vgap.plugins["idleObjectVisualizerPlugin"].shipTypes[i] + "</td></tr>";
            }
            html += "</table></div>";
            //$("#PlanetsMenu").append(html);

            var inMore = vgap.planetScreenOpen || vgap.shipScreenOpen || vgap.starbaseScreenOpen;
            if (inMore) {
                html = "<h1>Show ship locations for:</h1>" + html;
                html += "<a class='MoreBack' onclick='vgap.closeMore();vgap.more.empty();return false;'>OK</a>";
                vgap.more.empty();
                $(html).appendTo(vgap.more);

                $("#OverlayFilter").height($(window).height() - 100);
                vgap.showMore(300);
            }
            else {
                html = "<div class='TitleBar'><div class='CloseScreen' onclick='vgap.closeLeft();vgap.lc.empty();'></div><div class='TopTitle'>Show ship locations for:</div></div>" + html;
                vgap.lc.empty();
                $(html).appendTo(vgap.lc);
                vgap.openLeft();
                $("#OverlayFilter").height($(window).height() - 40);
                $("#OverlayFilter").width(380);
            }
            $("#OverlayFilter").jScrollPane();
        },


		toggleFilterSelectionHelper : function() {
			vgap.plugins["idleObjectVisualizerPlugin"].toggleFilterSelection(this);
			vgap.plugins["idleObjectVisualizerPlugin"].showTypeSelectorTools();
			vgap.map.draw();
		},

        /**
		 * Toggle the checkbox deciding which type of ships are being displayed
		 * @param id		id of ship group to toggle
		 */
        toggleFilterSelection : function (id) {
			
        	if (id < 0 || id >= vgap.plugins["idleObjectVisualizerPlugin"].shipSelection.length) {
        		return;
        	}
			vgap.plugins["idleObjectVisualizerPlugin"].shipSelection[id] =! vgap.plugins["idleObjectVisualizerPlugin"].shipSelection[id];
			
			//console.log("Toggling: " + id + " now: " +  vgap.plugins["idleObjectVisualizerPlugin"].shipSelection[id]);
        	this.showOverlayFilter();

        },

	}; //end idleObjectVisualizerPlugin

	// register your plugin with NU
	vgap.registerPlugin(idleObjectVisualizerPlugin, "idleObjectVisualizerPlugin");

	vgap.plugins["idleObjectVisualizerPlugin"].oldClearTools = vgapMap.prototype.clearTools;

	vgapMap.prototype.clearTools = function(result) {

		//vgap.plugins["idleObjectVisualizerPlugin"].enabled = false;
		vgap.plugins["idleObjectVisualizerPlugin"].resetIdleSelectorTools();

		//clear all ship filters
		for (var i=0; i<vgap.plugins["idleObjectVisualizerPlugin"].shipSelection.length; i++) {
		  vgap.plugins["idleObjectVisualizerPlugin"].shipSelection[i] = false;
		}

		$("#IdleObjectShipFilter").remove();
		$("#IdleObjectTools").remove();
		vgap.plugins["idleObjectVisualizerPlugin"].idleObjectMenuActive = false;
		vgap.plugins["idleObjectVisualizerPlugin"].typeSelectorMenuActive = false;

		//execute the normal clearTools function
		vgap.plugins["idleObjectVisualizerPlugin"].oldClearTools.apply(this, arguments);

	};


	vgap.plugins["idleObjectVisualizerPlugin"].oldShipScan = sharedContent.prototype.shipScan;
	sharedContent.prototype.shipScan = function (ship) {

		var plugin = vgap.plugins["idleObjectVisualizerPlugin"];

		// use NU method
		var html = plugin.oldShipScan(ship);

		// then augment the results
		var html_element = $(html);
		var img_element = html_element.children()[0];

		if (ship.ownerid == vgap.player.id && plugin.enabled
			&& plugin.drawSelection[objectTypeEnum.SHIPS] && ship.readystatus == plugin.drawStatus)
		{
			img_element.style = "border: 2px solid " + plugin.colors[objectTypeEnum.SHIPS];
		} else {
			img_element.style = "border: 2px solid #F3F5F5";
		}

		return $('<div>').append( html_element.clone() ).html();
	};


	leftContent.prototype.oldPicSize = leftContent.prototype.picSize;
    leftContent.prototype.picSize = function (mainPic, numItems) {

	    var plugin = vgap.plugins["idleObjectVisualizerPlugin"];
		// use NU method
		if (!plugin.enabled) {

			this.oldPicSize(mainPic, numItems);
		} else {

			var picHeight = $(window).height() - 500;
			if (picHeight > 250)
				picHeight = 250;
			if (picHeight < 75)
				picHeight = 75;
			mainPic.height(picHeight);

			var fleetwidth = 400 - picHeight;
			var fleetheight = picHeight;

			var fleetpic = 50;
			while (true) {
				var rows = Math.floor(fleetheight / (fleetpic + 2 + 5));
				var cols = Math.floor(fleetwidth / (fleetpic + 2 + 5));
				if ((rows * cols) >= numItems)
					break;

				fleetpic -= 1;
			}
			$(".FleetPic").width(fleetpic);
			$(".FleetPic").height(fleetpic);
		}
    },


	leftContent.prototype.oldShowFleetReady = leftContent.prototype.showFleetReady;
	leftContent.prototype.showFleetReady = function () {

		var plugin = vgap.plugins["idleObjectVisualizerPlugin"];
		// use NU method
		this.oldShowFleetReady();

		// augment the result
		if (!plugin.enabled) {
			return;
		}

        var id = $("#FleetPlanet").data("id");
        if (id) {
			var planet = vgap.getPlanet(id);

			if ( (planet.ownerid == vgap.player.id) && plugin.drawSelection[objectTypeEnum.PLANETS] && (planet.readystatus == plugin.drawStatus)) {
				$("#FleetPlanet").wrap("<div style='float: left; position: relative; border: 1.5px solid " + plugin.colors[objectTypeEnum.PLANETS] +"'/>");
			} else {
				$("#FleetPlanet").wrap("<div style='float: left; position: relative; border: 1.5px solid #000000'/>");
			}
			$("#FleetPlanet").wrap("<div style='border: 1px solid #000000'/>");
		}


        id = $("#FleetStarbase").data("id");
        if (id) {
			var planet = vgap.getPlanet(id);
			var starbase = vgap.getStarbase(id);
			if (planet.ownerid == vgap.player.id && plugin.drawSelection[objectTypeEnum.BASES] && starbase.readystatus == plugin.drawStatus) {
				$("#FleetStarbase").wrap("<div style='float: left; position: relative; border: 1.5px solid " + plugin.colors[objectTypeEnum.BASES] +"'/>");
			} else {
				$("#FleetStarbase").wrap("<div style='float: left; position: relative; border: 1.5px solid #000000'/>");
			}
			$("#FleetStarbase").wrap("<div style='border: 1px solid #000000'/>");
       	}

        var ships = vgap.shipsAt(this.obj.x, this.obj.y);
        for (var i = 0; i < ships.length; i++) {
            var ship = ships[i];

			if (ship.ownerid == vgap.player.id && plugin.drawSelection[objectTypeEnum.SHIPS] && ship.readystatus == plugin.drawStatus) {
				$("#FleetContainer #" + ship.id).wrap("<div style='float: left; position: relative; border: 1.5px solid " + plugin.colors[objectTypeEnum.SHIPS] +"'/>");
			} else {
				$("#FleetContainer #" + ship.id).wrap("<div style='float: left; position: relative; border: 1.5px solid #000000'/>");
			}
			$("#FleetContainer #" + ship.id).wrap("<div style='border: 1px solid #000000'/>");
        }
	};

} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
document.body.removeChild(script);
