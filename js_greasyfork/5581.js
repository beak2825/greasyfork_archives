// ==UserScript==
// @name          Planets.nu - PLSCheck Plugin
// @description   PLSCheck Plugin
// @version       2.0.0
// @date          2018-11-10
// @author        robodoc
// @license       Creative Commons Attribution 4.0 (CC BY 4.0)
// @include       http://*.planets.nu/*
// @include       https://*.planets.nu/*
// @include       http://planets.nu/*
// @include       https://planets.nu/*
// @history       2.0.0  (2018)

// @namespace https://greasyfork.org/users/5275
// @downloadURL https://update.greasyfork.org/scripts/5581/Planetsnu%20-%20PLSCheck%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/5581/Planetsnu%20-%20PLSCheck%20Plugin.meta.js
// ==/UserScript==

/*
Changelog:
0.9.1    [2014-10-8] Initial beta release 
0.9.2    [2018-1-5] Fixed: planetoids no longer counted toward planet total
         Added: summary of current turn's orders
1.0.0    [2018-4-3] Added PLS+10 and lists of recycles and disassembles
2.0.0    [2018-11-10] Adapted for new site PLS settings; separated from Clone Checker
*/

function wrapper () { // wrapper for injection
    
	if (vgap.version < 3.0) {
		console.log("PLSCheck Plugin requires at least NU version 3.0. Plugin disabled." );
		return;	
	}
	// Global variables
	var plugin_version = "2.0.0";
	console.log("PLSCheck plugin version: v" + plugin_version );
	
	var displayPLScheckicon = true; // set to "false" if you don't want this in your menu
	
	var plsCheckPlugin = {
			
		processload: function() {
			//console.log("ProcessLoad: plsCheckPlugin plugin called.");

			// The following code adapted from Kedalion's Enemy ship list plugin:
			vgap.plugins["plsCheckPlugin"].mobile_version = vgap.plugins["plsCheckPlugin"].checkIfMobileVersion();
			
			//console.log("END PROCESS LOAD");
		},	
		
		loaddashboard: function() {
			//console.log("LoadDashboard: plsCheckPlugin plugin called.");
			
			// Add PLSCheck link
			var menu = document.getElementById("DashboardMenu").childNodes[2]; //insert in middle
			if (displayPLScheckicon) $("<li style=\"color:#FFF000\">PLSCheck »</li>").tclick(function () { vgap.plugins["plsCheckPlugin"].displayPLS(); }).appendTo(menu);
		},

		/*
		 * showdashboard: executed when switching from starmap to dashboard
		 */
		showdashboard: function() {
		},
		
		/*
		 * showsummary: executed when returning to the main screen of the dashboard
		 */
		showsummary: function() {
			//console.log("ShowSummary: plsCheckPlugin plugin called.");	
			//insert Icon for PLSCheck on Home Screen
	
			// The following code adapted from Kedalion's Enemy ship list plugin:
			var node;
			if (vgap.plugins["plsCheckPlugin"].mobile_version) {
			  // console.log("ShowSummary for mobile ");
			  var summary_list = document.getElementById("TurnSummary");
			  node = document.createElement("span");
			}
			else {
			  // console.log("ShowSummary for non-mobile");
			  var summary_list = document.getElementById("TurnSummary").childNodes[0];
			  node = document.createElement("li");
			}

			if (displayPLScheckicon) {
				//var node2 = document.createElement("li");
				node.setAttribute("style", "color:#FFF000");
				node.innerHTML = "<div class=\"iconholder\"><img src=\"https://planets.nu/img/icons/blacksquares/ships.png\"/></div>" + "PLSCheck";
				node.onclick = function() {vgap.plugins["plsCheckPlugin"].displayPLS();};
				
				var starbase_entry = summary_list.children[4];
				summary_list.insertBefore(node, starbase_entry);
			}
		},
		
		/*
		 * loadmap: executed after the first turn has been loaded to create the map
		 * as far as I can tell not executed again when using time machine
		 */
		loadmap: function() {
			//console.log("LoadMap: plsCheckPlugin plugin called.");
		},
		
		/*
		 * showmap: executed when switching from dashboard to starmap
		 */
		showmap: function() {
			//console.log("ShowMap: plsCheckPlugin plugin called.");
		},
		
		/*
		 * draw: executed on any click or drag on the starmap
		 */			
		draw: function() {
			//console.log("Draw: plsCheckPlugin plugin called.");
		},		
		
		/*
		 * loadplanet: executed a planet is selected on dashboard or starmap
		 */
		loadplanet: function() {
			//console.log("LoadPlanet: plsCheckPlugin plugin called.");
			
		},
		
		/*
		 * loadstarbase: executed a starbase is selected on dashboard or starmap
		 */
		loadstarbase: function() {
			//console.log("LoadStarbase: plsCheckPlugin plugin called.");
		},
		
		/*
		 * loadship: executed a ship is selected on dashboard or starmap
		 */
		loadship: function() {
			//console.log("LoadShip: plsCheckPlugin plugin called.");
		},
		
		
		/*
		 * Variables
		 */
	
		
		/* Main Display Function
		 */
		displayPLS: function(view) {

			vgap.playSound("button");
			vgap.closeSecond();
			var plg = vgap.plugins["plsCheckPlugin"];
			var plgCC = vgap.plugins["cloneCheckPlugin"];

			vgap.dash.content.empty();
			
			// Find PLS settings
			var plsshipsperplanet = vgap.settings.plsshipsperplanet;
			var plsminships = vgap.settings.plsminships;
			var plsextraships = vgap.settings.plsextraships;
			console.log("PLS settings:",plsshipsperplanet,plsminships,plsextraships);
			
			var shipCount = vgap.getShipCount();
			var shipLimit = vgap.getPlsLimit();
			console.log("shipCount",shipCount,"shipLimit",shipLimit);

			var html = "";

			if (!view)
				view = 0;
			//console.log("Entered displayPLS, buildmethods is " + plg.buildmethods);
			console.log("Entered displayPLS");
			var filterMenu = $("<ul class='FilterMenu'></ul>").appendTo(vgap.dash.content);
				$("<li " + (view == 0 ? "class='SelectedFilter'" : "") + ">PLSCheck Summary</li>").tclick(function() { vgap.plugins["plsCheckPlugin"].displayPLS(0); }).appendTo(filterMenu);
				$("<li " + (view == 1 ? "class='SelectedFilter'" : "") + ">Clone/Recycle/Disassemble Checker</li>").tclick(function() { vgap.plugins["plsCheckPlugin"].displayPLS(1); }).appendTo(filterMenu);
			
			//loop through all planets and show the ones owned by this player
			html = "<div class='DashPane' style='height:" + ($("#DashboardContent").height() - 70) + "px;'>";
							
			if (view == 0) {
				var PMBreak = $("<br /><br />").appendTo(vgap.dash.content);
				
				// Display Summary

				// Display Settings:
				html += "<table><td style='width:20%;vertical-align:top'>";
				//html += "<p><span style='font-size:20px;'>PLS Settings:</span>"; 
				html += "<span style='color:yellow'><b>PLS Settings:</b></span><br>";
				
				//html += "</td><td style='vertical-align:top'>";
				html += "plsshipsperplanet " +  plsshipsperplanet + "; ";
				html += "plsminships " + plsminships + "; ";
				html += "plsextraships " + plsextraships + ".<br>";

				html += "</td></table>";

/////
				// Summarize Player status:
				html += "<table><td>"
				html += "<p><b><span style='color:yellow'>Your status: </span></b>";
				if (plg.limitStatus() > 0) html += "You are under your ship limit, with " + plg.limitStatus() + " ship slots available.";
				if (plg.limitStatus() == 0) html += "You are at your ship limit.";
				if (plg.limitStatus() < 0) html += "You are " + -1*plg.limitStatus() + " ships over your ship limit.";
				
				// Summarize orders
				if (plgCC) {
					var numBuilds = plg.findRegularBuilds();
					var numClones = plgCC.findAttemptedClones(true);
					var numRecycles =  plgCC.findRecycles();
					var numDisassembles = plgCC.findDisassembles();
					var netShips = numBuilds + numClones - numRecycles - numDisassembles;
					if (Math.sign(netShips) >= 0) {
						var netShipString = "+" + netShips.toString();
					} else {
						var netShipString = netShips.toString();
					}
				} else if (typeof plgCC === "undefined") {
					var numBuilds = plg.findRegularBuilds();
					var numClones = "?";
					var numRecycles =  "?";
					var numDisassembles = "?";
					var netShips = "?";
					var netShipString = "+??";
				}
				
				// Summarize orders:
				html += "<br><b><span style='color:yellow'>Your orders:</span></b> "+ numBuilds + " Builds; " + numClones + " Clones; " + numRecycles + " Recycles; " + numDisassembles + " Disassembles <b><span style='color:yellow'>[" + netShipString + " ships in total]</span></b>";
				//html += "</b></p>";
				if (typeof plgCC === "undefined") {
					html += "<br>Install the Clone Checker plugin to check for clones, recycles and disassembles";
				}
				
				// Display Update Button
				html += "</td><td>";
				html += "<div id='UpdateButton' class='BasicFlatButton' title='Update'>Update</div></p>";
				html += "</td></table>";
				
				// Construct Summary Table Header
				var headhtml = "";

				headhtml += "<table id='PlanetTable' align='left' class='CleanTable' border='0' width='100%' style='cursor:pointer;'><thead>";
				headhtml += "<thead><th align='left'>Player</th><th align='left'>Planets</th>";
				headhtml += "<th title='Warships' align='left'>Warships</th><th title='Freighters' align='left'>Freighters</th><th title='Total Ships' align='left'>Total Ships</th><th title='Ship slots' align='left'>Ship limit</th><th title='Available slots' align='left'>Available slots</th></tr>";

				var rowhtml = "";
				var totalPlanets = 0;
				var totalShips = 0;
				for (var i = 0; i < vgap.scores.length; i++) {
				    	var score = vgap.scores[i];
				    	totalPlanets += score.planets;
				   	totalShips += score.capitalships + score.freighters;
					var playerShips = score.capitalships + score.freighters;
					
					if (playerShips + 4 < plg.findLimit(i)) {
						rowhtml += "<tr>"
					} else if (playerShips >= plg.findLimit(i)) {
						rowhtml += "<tr style='background-color:#680000 ;'>" // dark red
					} else {
						rowhtml += "<tr style='background-color:#666600 ;'>" // dark yellow
					}
					rowhtml += "<td>" + vgap.raceName(score.ownerid) + "</td>";
				    	rowhtml += "<td>" + score.planets + plg.plsScoreChange(score.planetchange) + "</td>";
				    	rowhtml += "<td>" + score.capitalships + plg.plsScoreChange(score.shipchange) + "</td>";
				    	rowhtml += "<td>" + score.freighters + plg.plsScoreChange(score.freighterchange) + "</td>";
				    	rowhtml += "<td>" + playerShips + plg.plsScoreChange(score.shipchange + score.freighterchange) + "</td>";
				    	rowhtml += "<td>" + plg.findLimit(i)  + "</td>";
				    	rowhtml += "<td>" + (plg.findLimit(i)-playerShips)  + "</td>";
				    	rowhtml += "</tr>";
				}

				// Put the Summary table together
				html += headhtml;
				html += rowhtml;
				html += "</table>";

				html += "<br //><p><b>Total planets: " + totalPlanets + ".  Total ships: " + totalShips + "</b></p>";

				html += "<hr>";

				// End summary. Now start checking for conformity to the rules.
				
				// UPDATE: Check for the following potential problems:
				// A ship transfer via gsX friendly code will fail and the ship will remain under control of its current owner
				// Ship captures via Force Surrender will result in the ship being destroyed
				// Ship captures via tow capture will result in the ship being destroyed [Tow capture is after shipbuilding and ground combat]		
				
				// [OLD version] Check the following:
				// 1. Ship building (and cloning)
				// 2. Starbase force surrender
				// 3. Check starbase fix
				// 4. Tow capture
				// 5. gsX


				// 2. Check force surrender
				if (plg.limitStatus() <= 0 && plg.findForceSurrender()) {
					//conformsToRules = false;
					html += "<p><b><span style='color:yellow'>Warning:</span></b> Ship captures via Force Surrender will result in the ship being destroyed.</p>";
					html += "<br /><table id='ForceSurrenderTable' align='left' border='0' width='100%'>";
					for (var i = 0; i < vgap.mystarbases.length; i++) {
						var sb = vgap.mystarbases[i];
						var planet = vgap.getPlanet(sb.planetid)
						if (sb.mission == 6) {
							html += "<tr><td>The starbase at " + plg.addStarbaseLink(planet.id) + " has mission set to 'force a surrender.'</td>";
							html += "<td class=FCmiss data-plid='" + planet.id + "' id='FCmiss_" + planet.id + "' align='center' style='border: solid white 1px; color: #FFEBCD; background-color:#680000; '><b> Change mission to 'none' </b></td><td></td>";
						}
					}
					html += "</table>";
				}

				// 4. Check tow capture
				
				// Predict ship limit status during movement phase
				// Land and disassmble is after movement
				if (plgCC) {
					var prediction = plg.limitStatus() - plg.findRegularBuilds() - plgCC.findAttemptedClones(true) +  plgCC.findRecycles();
				} else if (typeof plgCC === "undefined") {
					var prediction = plg.limitStatus() - plg.findRegularBuilds();
				}
				
				// Warn if predicted number of free slots is 4 or less
				if (prediction <= 4 && plg.findTowCapture()) {
					//conformsToRules = false;
					html += "<p><b><span style='color:yellow'>Warning:</span></b> Ship captures via tow capture will result in the ship being destroyed. The NBR friendly code can prevent this.</p>";
					html += "<br /><table id='TowCaptureTable' align='left' border='0' width='100%'>";
					for (var i = 0; i < vgap.myships.length; i++) {
						var ship = vgap.myships[i];
						if (ship.mission != 6) continue; // skip ships that are not towing
						// skip if you are towing your own ship:
						if (vgap.getShip(ship.mission1target).ownerid == vgap.player.id) continue;
						if (ship.friendlycode.toLowerCase() != "nbr") {
							html += "<tr><td>Ship " + plg.addShipLink(ship.id) + " is towing the alien ship " + ship.mission1target + " without NBR.</td>";
							html += "<td class=Towcode data-plid='" + ship.id + "' id='Towcode_" + ship.id + "' align='center' style='border: solid white 1px; color: #FFEBCD; background-color:#680000; '><b> Change friendly code to NBR </b></td><td></td>";
						}
					}
					html += "</table>";
				}

				// Display Update Button again
				html += "<p><div id='UpdateButton2' class='BasicFlatButton' title='Update'>Update and re-check</div></p><p></p><br/><br/>";

				html += "</div>";
				this.pane = $(html).appendTo(vgap.dash.content);

				// Save changes 
				//vgap.save(); // Save all our changes at the end

        			$("#UpdateButton").tclick(function () { plg.updateButton(); });
        			$("#UpdateButton2").tclick(function () { plg.updateButton(); });

				// // "Change friendly code (from CLN) button function
				// $('body').delegate('.CLNcode','click',function() {
					// console.log("CLNcode CLICKED!!!");
					// this.curship = ($(this).attr('data-plid'));
					// var ship = vgap.getShip(this.curship);
					// //var sb = vgap.getStarbase(this.curplanet);
					// //console.log("Ship ",vgap.getShi(sb.planetid).id);
					// plg.randomShipFcode(ship); // change ship friendly code
					// ship.friendlycode = plg.permuteFcode(ship.friendlycode); 
					// ship.changed = 1;
					// //vgap.planetScreen.load(planet);
					// //vgap.planetScreen.randomFC();
					// var identifier = "#CLNcode_" + ship.id;
					// console.log("SELECTOR: " + identifier);
					// $(identifier).replaceWith("<td class=CLNcode data-plid='" + ship.id + "' id='CLNcode_" + ship.id + "' align='center' style='border: solid white 1px; color: #FFEBCD; background-color: #006400;'><b> Ship friendly code changed to " + ship.friendlycode + "</b></td>");
				// });

				// "Change mission to none" button function
				$('body').delegate('.FCmiss','click',function() {
					console.log("FCmiss CLICKED!!!");
					this.curplanet = ($(this).attr('data-plid'));
					var planet = vgap.getPlanet(this.curplanet);
					var sb = vgap.getStarbase(this.curplanet);
					//console.log("Starbase at ",vgap.getPlanet(sb.planetid).id);
					sb.mission = 0; // change starbase mission to "none"
					planet.changed = 1;
					//vgap.planetScreen.load(planet);
					//vgap.planetScreen.randomFC();
					var identifier = "#FCmiss_" + planet.id;
					console.log("SELECTOR: " + identifier);
					$(identifier).replaceWith("<td class=FCmiss data-plid='" + planet.id + "' id='FCmiss_" + planet.id + "' align='center' style='border: solid white 1px; color: #FFEBCD; background-color: #006400;'><b> Starbase mission changed to 'none' </b></td>");
					plg.plsSaveChanges(false); // Save changes
				});

				// "Change friendly code to NBR" button function
				$('body').delegate('.Towcode','click',function() {
					console.log("Towcode CLICKED!!!");
					this.curship = ($(this).attr('data-plid'));
					var ship = vgap.getShip(this.curship);
					//var sb = vgap.getStarbase(this.curplanet);
					//console.log("Ship ",vgap.getShi(sb.planetid).id);
					ship.friendlycode = plg.permuteFcode("NBR"); // change ship friendly code to "NBR"
					ship.changed = 1;
					//vgap.planetScreen.load(planet);
					//vgap.planetScreen.randomFC();
					var identifier = "#Towcode_" + ship.id;
					console.log("SELECTOR: " + identifier);
					$(identifier).replaceWith("<td class=Towcode data-plid='" + ship.id + "' id='Towcode_" + ship.id + "' align='center' style='border: solid white 1px; color: #FFEBCD; background-color: #006400;'><b> Ship friendly code changed to " + ship.friendlycode + "</b></td>");
					plg.plsSaveChanges(false); // Save changes
				});

				// // "Change friendly code (from GsX) button function
				// $('body').delegate('.GsXcode','click',function() {
					// console.log("GsXcode CLICKED!!!");
					// this.curship = ($(this).attr('data-plid'));
					// var ship = vgap.getShip(this.curship);
					// //var sb = vgap.getStarbase(this.curplanet);
					// //console.log("Ship ",vgap.getShi(sb.planetid).id);
					// plg.randomShipFcode(ship); // change ship friendly code
					// ship.friendlycode = plg.permuteFcode(ship.friendlycode); 
					// ship.changed = 1;
					// //vgap.planetScreen.load(planet);
					// //vgap.planetScreen.randomFC();
					// var identifier = "#GsXcode_" + ship.id;
					// console.log("SELECTOR: " + identifier);
					// $(identifier).replaceWith("<td class=GsXcode data-plid='" + ship.id + "' id='GsXcode_" + ship.id + "' align='center' style='border: solid white 1px; color: #FFEBCD; background-color: #006400;'><b> Ship friendly code changed to " + ship.friendlycode + "</b></td>");
				// });
						
			}
			
			if (view == 1) {
				// Clone/Recycle/Disassemble Checker
				if (plgCC) {
					html += plgCC.display_clone_recycle_disassemble_details();
					this.pane = $(html).appendTo(vgap.dash.content);							
					$("#UpdateButtonClone").tclick(function () { plg.updateCloneButton(); });
				} else if (typeof plgCC === "undefined") {
					// the Clone Checker plugin is not installed
					html += "<br><h1>Clone/Recycle/Disassemble Checker</h1><br />";
					html += "<p>Install the Clone Checker plugin to check for clones, recycles and disassembles</p>";
					this.pane = $(html).appendTo(vgap.dash.content);
				}
			}

			// if (view == 2) {
				// // Help Screen
				 
				// html += "<br /><table border='0' width='100%'>";
				// html += "<tr><td>";
				 
				// html += "</td></tr>"	
				// html += "</table><br /></div>";
						
				// this.pane = $(html).appendTo(vgap.dash.content);							
				
			// }
			
		
		//this.content.fadeIn();
		this.pane.jScrollPane();

		// vgap.action added for the assistant (Alex):
		vgap.CurrentView = "showPlanets";
		vgap.showPlanetsViewed = 1;

		
				
		},
		

// ***********************************************************************************************
	checkIfMobileVersion: function() {
		// This function adapted from Kedalion's Enemy ship list plugin:
        url = window.location.href;
        if (vgap.version >= 4.0) {
          console.log("Mobile client code detected...");
          return true;
        }
        else {
          console.log("Non-mobile client code detected...");
          return false;
        }
      },
	  
	randomShipFcode: function (ship) {
		// Reset ship friendly code
		var abc = "abcdefghijklmnopqrstuvwxyz";
		var r1 = Math.floor(Math.random()*26);	
		var r2 = Math.floor(Math.random()*26);
		ship.friendlycode = "x" + abc[r1] + abc[r2];
	},

	getPlayerId: function (val) {
		if (val.charCodeAt(0) >= 97 && val.charCodeAt(0) <= 122) {
			return val.charCodeAt(0) - 96 + 9;
		} else if (val.charCodeAt(0) >= 49 && val.charCodeAt(0) <= 57){
			return val.charCodeAt(0) - 48;
		} else {
			return 0;
		}
	},

	permuteFcode: function (fcode) {
		// Create a random permuation of a friendly code
		fcode = fcode.toLowerCase();
		var r1 = Math.random(); var r2 = Math.random(); var r3 = Math.random(); 
		var a1 = fcode.charAt(0).toLowerCase();
		var a2 = fcode.charAt(1).toLowerCase();
		var a3 = fcode.charAt(2).toLowerCase();
		if (r1 < 0.5) a1 = fcode.charAt(0).toUpperCase();
		if (r2 < 0.5) a2 = fcode.charAt(1).toUpperCase();
		if (r3 < 0.5) a3 = fcode.charAt(2).toUpperCase();
		fcode = a1 + a2 + a3;
		return fcode;
	},

	findTowCapture: function () {
		// Finds out if any ship might tow capture 
		console.log("Entered function findTowCapture");
		// Only applies to Privateers and Crystals
		if (vgap.player.raceid != 5 && vgap.player.raceid != 7) return false;

		for (var i = 0; i < vgap.myships.length; i++) {
			var ship = vgap.myships[i];
			if (ship.mission != 6) continue; // skip ships that are not towing

			if (ship.mission1target == null || ship.mission1target == 0) continue; // skip if no tow target
			// skip if you are towing your own ship:
			if (vgap.getShip(ship.mission1target).ownerid == vgap.player.id) continue;
			// return true if you are towing an alien ship without "nbr" fcode
			if (ship.friendlycode.toLowerCase() != "nbr") return true;
		}
		return false;
	},

	findForceSurrender: function () {
		// Finds out if any starbases have the "force surrender" mission
		console.log("Entered function findForceSurrender");
		for (var i = 0; i < vgap.mystarbases.length; i++) {
			var sb = vgap.mystarbases[i];
			if (sb.mission == 6) return true;
		}
		return false;
	},

	removeBaseBuild: function (id) {

            var planet = vgap.getPlanet(id);

	},    

	addShipLink: function (id) {
		// Adds link to ship
		var ship = vgap.getShip(id);
		if (ship != null) {
		jumpfunc = ( vgap.player.id == ship.ownerid ? "vgap.map.selectShip(" + id + ");" : "vgap.map.shipSurvey(" + id + ");" );
		mouseover = "";
		return "<a style='color:cyan;' onclick='vgap.showMap();vgap.map.centerMap(" + ship.x + ", " + ship.y + ");" + jumpfunc + "return false;'" + mouseover + " ><span style='cursor:pointer'>" + ship.id + " " + ship.name + "</span></a>"; 
		}
	},    

	addStarbaseLink: function (id) {
		// Adds link to starbase
		var planet = vgap.getPlanet(id);
		if (planet != null) {
		jumpfunc = ( vgap.player.id == planet.ownerid ? "vgap.map.selectStarbase(" + id + ");" : "vgap.map.planetSurvey(" + id + ");" );
		mouseover = "";
		return "<a style='color:cyan;' onclick='vgap.showMap();vgap.map.centerMap(" + planet.x + ", " + planet.y + ");" + jumpfunc + "return false;'" + mouseover + " ><span style='cursor:pointer'>" + planet.id + " " + planet.name + "</span></a>"; 
		}
	},    

	findRegularBuilds: function (){
		// Finds out how many ship builds are scheduled (regular builds, not clones)
		//console.log("Entered function findRegularBuilds");

		var plg = vgap.plugins["plsCheckPlugin"];
		var shipBuilds = 0;
		// Find regular builds and clones
		for (var i = 0; i < vgap.mystarbases.length; i++) {
			var sb = vgap.mystarbases[i];
			if (sb.isbuilding == true) {
				shipBuilds += 1;
			} 
		}

		return shipBuilds;
	},
	
	isAtOwnedPlanet: function (ship) {
			// Are we at a planet that we own?
			// Returns myplanets index, or -1 if not at a planet
			for (var i = 0; i < vgap.myplanets.length; i++) {
				var planet = vgap.myplanets[i];
				if ((planet.x == ship.x) && (planet.y == ship.y)) {
					return i;
				}
			}
			return -1;
		},

	limitStatus: function (){
		// Finds out the player's status regarding the individual ship limit
		// returns negative value is you are over your limit, and positive if you are under
		console.log("Entered function limitStatus");

		var shipCount = vgap.getShipCount();
		var shipLimit = vgap.getPlsLimit();

		return shipLimit - shipCount;
	},

	findLimit: function(id) { 
		// find ship limit for a player
        var score = vgap.scores[id];

		var plsshipsperplanet = vgap.settings.plsshipsperplanet;
		var plsminships = vgap.settings.plsminships;
		var plsextraships = vgap.settings.plsextraships;
		
		var shipLimit = score.planets * plsshipsperplanet + plsextraships;
		if (shipLimit < plsminships) shipLimit = plsminships;
		shipLimit = Math.floor(shipLimit);
		
		return shipLimit;
	}, 

	updateButton: function (){
		// Runs when the update button is clicked
		console.log("Entered function updateButton");
		var plg = vgap.plugins["plsCheckPlugin"];
		// var plsVal = plg.valButton( document.getElementsByName('plsradio'))
		// if (plsVal == "pls70") plsType = 70;
		// if (plsVal == "pls50") plsType = 50;
		// if (plsVal == "pls20") plsType = 20;
		// if (plsVal == "pls10") plsType = 10;
		// if (plsVal == "nobuild") plsType = 0;
		//var ruleVal = plg.valButton( document.getElementsByName('ruleradio'))
		//if (ruleVal == "short") ruleType = "short";
		//if (ruleVal == "long") ruleType = "long";
		//console.log("plsType is ",plsType,"ruleType is ",ruleType);
		plg.plsSaveChanges(false); // Save changes
		plg.displayPLS(0); // Re-run PLSCheck
	},

	// valButton: function(btn) { 
		// // Returns value of radio button
		// for (var i=btn.length-1; i > -1; i--) { 
		  // if (btn[i].checked) return btn[i].value; 
		// } 
		// return null; 
	// }, 

	plsScoreChange: function (change) {
		if (!change || change == 0)
		    return "";

		var txt = " <span class='";
		if (change > 0)
		    txt += "GreatText'>(+";
		else
		    txt += "WarnText'>(";

		return txt + change + ")</span>";
	},


	plsSaveChanges: function(savestarted) {
		var plg = vgap.plugins["plsCheckPlugin"];
		
		if (savestarted == true) {
			return;
		} else if (savestarted == false) {
			// We can start the save 
			vgap.save();
			timeoutID = window.setTimeout(plg.plsSaveChanges(true), 1000);
		} else {
			// save is completed
			return;
		}
	},

		
			
	};
		
	// register your plugin with NU
	vgap.registerPlugin(plsCheckPlugin, "plsCheckPlugin");

	
} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);

