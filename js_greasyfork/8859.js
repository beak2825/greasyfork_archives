// ==UserScript==
// @name          Planets.nu - Intelligence Center Plugin
// @description   Gather information about Commanders
// @version       0.75
// @date          2015-03-29
// @author        Crystalct
// @include       http://planets.nu/*
// @include       http://play.planets.nu/*
// @include       http://test.planets.nu/*
// @homepage      http://planets.nu/#/activity/1860702
// @namespace   ca6d9e323650aa54cf74274069f377a9
// @downloadURL https://update.greasyfork.org/scripts/8859/Planetsnu%20-%20Intelligence%20Center%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/8859/Planetsnu%20-%20Intelligence%20Center%20Plugin.meta.js
// ==/UserScript==

/* -----------------------------------------------------------------------
Change log:
0.75   Changed text color of crew experience and max voltage
0.74   Moved Crew experience into loadShips function, added max ion storm voltage before get damages
0.73   Added Crew experience into shipScreen
0.72   Solved bug about Average final ranking
0.71   Script moved to Greasy Fork
0.70   Added palyer affinity table
0.61   Solved a bug about dead/open player selection.
0.6    Active advantages and hull removed (no more available), added infos from History API.
0.5    Initial release [2015-03-23]
 ----------------------------------------------------------------------- */
//console.log("Pre function Nu template plugin");
function wrapper () { // wrapper for injection
    
	//console.log("Start function Nu template plugin");
	/*
	 *  Specify your plugin
	 *  You need to have all those methods defined or errors will be thrown. 
	 *  I inserted the print-outs in order to demonstrate when each method is 
	 *  being called. Just comment them out once you know your way around. 
	 *  
	 *  For any access to plugin class variables and methods from inside these
	 *  reserved methods, "vgap.plugins["IntelligenceCenter"].my_variable" has to be 
	 *  used instead of "this.my_variable". 
	 */
	
    vgapShipScreen.prototype.loadStatus = function() { 
        //my own loadStatus screen
        var i=this.ship;
        //console.log(vgap.getMass(i));
        this.predictor(i);
        var f=vgap.getEngine(i.engineid);
        var h=this.prediction;
        var e=i.damage+"%";
        var maxMeV = vgap.getMass(i) + i.experience - 20*(10-i.engineid); //  Stefan Reuther's formula
        if (i.neutronium < 1)
            maxMeV -= 50;
        if (maxMeV < 0)
            maxMeV = 0;
        if(i.damage>0){
            e="<span class='BadText'>"+i.damage+"%</span>"
        }
        var g="<table width='100%'><tr><td style='width:130px;'><span class='textval' data-topic='ShipConfiguration'>"+f.name+"</span></td><td class='headright'>Damage:</td><td class='val'>"+e+(h.damage?" <span class='valsup'>("+h.damage+")</span>":"")+"</td></tr>";
        var c="none";
        if(i.beams>0){
            c=i.beams+" "+vgap.getBeam(i.beamid).name
        }
        var d="";
        if(i.crew<this.hull.crew){
            d="BadText"
        }
        g+="<tr><td class='textval' data-topic='ShipConfiguration'>"+c+"</td><td class='headright'>Crew:</td><td class='val' "+(h.crew?"style='width:100px;'":"")+"><span class='"+d+"'>"+i.crew+"/"+this.hull.crew+"</span>"+(h.crew?" <span class='valsup'>("+h.crew+")</span>":"")+"</td></tr>";
        var b=this.hull.fighterbays+" "+nu.t.fighterbays;
        if(i.torps>0){
            b=i.torps+" "+vgap.getTorpedo(i.torpedoid).name
        }
        var a=nu.t.fighters;
        if(i.torps>0){
            a=nu.t.torpedos
        }
        if(i.torps>0||this.hull.fighterbays>0){
            g+="<tr><td class='textval' data-topic='ShipConfiguration'>"+b+"</td><td class='headright'>"+a+":</td><td class='val'>"+i.ammo+""+(h.ammo?" <span class='valsup'>("+h.ammo+")</span>":"")+"</td></tr>"
        }
        else{
            if(i.hullid==111){
                g+="<tr><td class='textval' data-topic='ShipConfiguration'><br/></td><td class='headright'>Tantrum Charge:</td><td class='val'>"+i.goaltarget2+"</td></tr>"
            }
            /*else{
				g+="<tr><td><br/></td></tr>"
				}*/
        }
        g+="<tr><td class='GoodText' data-topic='ShipConfiguration'>Safe up to " + maxMeV + " MeV</td><td class='headright'>Crew experience:</td><td class='val' style='color: #099;'>"+ i.experience + "</td></tr>";
        g+="</table>";
        return g;
    };
    
    var playerData = "";
    var raceSelected = 0;
    var selectedPlayer = 0;
    var selectedList = 0;
    var playerinfo = false;
    var processPlayers = 0;
    var playersList = new Array();
    var playersName =  new Array();
    var playersHistory = new Array();
    var affinityTable = new Array();
    var view = 1;
    /*var doSomething = function(extraStuff) {
                   return function(data, textStatus, jqXHR) {
                               console.log(data);
                               console.log(extraStuff);// do something with extraStuff
                   };
            };*/
    var myCustomPlugin = {
			
			 
         processHistoryAPI: function(data) {
             //console.log(data);
             var games = data.history;
             var publicGames = 0;
             var publicGamesThisRace = 0;
             var DRating = 0;
             var DRatingThisRace = 0;
             var race = vgap.plugins["IntelligenceCenter"].raceSelected;
             var gameinfo = "";
             var dropped = 0;
             var dead = 0;
             var resigned = 0;
             for (var p=0; p<games.length; p++) { 
                 var gameinfo = games[p].game;
                 if (games[p].isprivate == false) {
                     if (!!(games[p].player) && (gameinfo.status == 3 || gameinfo.status == 4)) { //finished?
                         publicGames++;
                         DRating += games[p].player.finishrank;
                         if (games[p].raceid == race) {
                             publicGamesThisRace++;
                             DRatingThisRace += games[p].player.finishrank;
                         }
                     }
                     
                     if (games[p].status == 2)
                         dropped++;
                     if (games[p].status == 3)
                         resigned++;
                     if (games[p].status == 4)
                         dead++;
                 }          
             }
             //console.log("Pub: " + publicGames + " - Media: " + DRating/publicGames + " - ThisRace: " + publicGamesThisRace + " - Media: " + DRatingThisRace/publicGamesThisRace);
             var html =  $("#profileDiv").html();
             var averagePub = DRating/publicGames * Math.pow(10,1);
             averagePub = Math.round(averagePub);
             var averageRace = DRatingThisRace/publicGamesThisRace * Math.pow(10,1);
             averageRace = Math.round(averageRace);
             var inforace = vgap.races[race];
             if (publicGames == 0)
                 averagePub = 0;
             else
                 averagePub = averagePub / Math.pow(10,1);
             if (publicGamesThisRace == 0)
                 averageRace = 0;
             else
                 averageRace = averageRace / Math.pow(10,1);
             html += "<br/> Public sectors played (finished): " +  publicGames + " (as " + inforace.adjective + ": " + publicGamesThisRace + ") - Average final ranking: " + averagePub;
             html += " (as " + inforace.adjective + ": " + averageRace + ")";
             html += "<br/> Public sectors dead: " + dead + " - resigned: " + resigned + " - dropped: " + dropped;
             $("#profileDiv").html(html);
         },
        
         processProfileAPI: function(data) {
                 //console.log("processProfileAPI: plugin called.");
                 
                 var html = "";
                 var account = data.account;
                 //console.log(data);
                 html += "Registered: ";
                 if (data.isregistered)
                     html += "Yes";
                 else
                     html += "No";
                 var i = account.tenacity * 100 * Math.pow(10,2);
                 i = Math.round(i);
                 
                 html += " - Turns played: " + account.turns + " - Tenacity: " + (i / Math.pow(10,2)) +"%";
                 html += " - Missed turns: " + account.turnsmissed;
                 $("#profileDiv").html(html);
                 var player = vgap.players[vgap.plugins["IntelligenceCenter"].selectedPlayer];
                 var url = "http://api.planets.nu/account/account/history?accountid=" + player.accountid + "&jsoncallback=?";
                 $.get(url, myCustomPlugin.processHistoryAPI, "jsonp");
             },
             
             processAPI: function(data) {
                 
                 vgap.dash.content.empty();
                 var filterMenu = $("<ul class='FilterMenu'></ul>").appendTo(vgap.dash.content);
				 $("<li " + (view == 1 ? "class='SelectedFilter'" : "") + ">Player info</li>").tclick(function() 	{ view = 1; }).appendTo(filterMenu);
				 $("<li " + (view == 2 ? "class='SelectedFilter'" : "") + ">Players affinity</li>").tclick(function() 	{ view = 2; vgap.plugins["IntelligenceCenter"].processGo();}).appendTo(filterMenu);
				
                 var infoPlayerHtml = "";
                 var pn = vgap.plugins["IntelligenceCenter"].selectedPlayer;
                 var me = vgap.player;
                 var relations = vgap.relations;
                 
                 infoPlayerHtml += "<div class='DashPane' style='height:" + ($("#DashboardContent").height() - 30) + "px;'>"
                 
                 infoPlayerHtml += "<table id='PlayerSelectionTable' align='left' border='0' width='100%'>";
                 infoPlayerHtml += "<tr>";
                 infoPlayerHtml += "<td><strong>Select Commander:</strong> <select id='listPlayer' "+ 
							"onChange='vgap.plugins[\"IntelligenceCenter\"].infoPlayer(this.options[this.selectedIndex].value);'> ";
                 
				 infoPlayerHtml += "<option disabled selected> -- select a Commander -- </option>";
                        for (var p=0; p<vgap.players.length; p++) {
							infoPlayerHtml += "<option ";
							infoPlayerHtml += "value='" + vgap.players[p].id + "'>" + vgap.players[p].id + " - " + vgap.players[p].fullname + "</option>";
						}
                 
                 infoPlayerHtml += "</select> <br></td></tr></table><div id='infoPlayer'></div><br/><br/>";
                 
                 if (data == false) {
                    
                         infoPlayerHtml += "<table style='margin-left:20px;'><tr><td>Diplomacy: You to him </td><td><img src=\"http://play.planets.nu/img/diplomacy/" + relations[pn].relationto + ".png\" alt=\"Relaion to\" border=\"0\" width=\"30\" height=\"30\" align=\"middle\"></td>";
                         infoPlayerHtml += "<td> - Him to you </td><td><img src=\"http://play.planets.nu/img/diplomacy/" + relations[pn].relationfrom + ".png\" alt=\"Relaion from\" border=\"0\" width=\"30\" height=\"30\" align=\"middle\"></td>";

                         infoPlayerHtml += "</tr></table></div>";
                         this.pane = $(infoPlayerHtml).appendTo(vgap.dash.content);
                 
                         this.pane.jScrollPane();
                 
                         vgap.action();
                         
                         return;
                    
                 }
                 
                 playerData = data;
                 //console.log("playerData: "); 
                 //console.log(playerData);
                 var player = vgap.players[vgap.plugins["IntelligenceCenter"].selectedPlayer];
                 var race = vgap.getRace(player.raceid);
                 var i = 0;
                 while (playerData.officers[i].raceid != player.raceid) {i++;}
                 var raceView = playerData.officers[i];
                 //console.log("Player: ");
                 //console.log(player);
                 
                 var string = raceView.levelname;
                 //
                 
                 //
                 infoPlayerHtml += "<strong>General infos</strong></br><table><tr><td>Name: " + player.username.toUpperCase() + "</td></tr><tr><td>Ranking: <strong>" + string + "</strong> of " + race.name + "</td></tr>"; 
                 infoPlayerHtml += "<tr><td><div id=\"profileDiv\">Information gathering.....</div><td></td></tr></table></br>";
                 
                 var x = 0.0;
                 infoPlayerHtml += "<table id='AShipTable' align='left' width=\"100%\"><tbody id='AShipRows'>";
                 
                 string = raceView.experience;
                 x = 400 * string / 500000;
                 infoPlayerHtml += "<tr><td style=\"width: 150px;\">Experience:</td><td style=\"width: 400px;\"><div style=\"height:20px;border:solid 1px #444;width:400px;overflow:hidden;\">"; 
                 infoPlayerHtml += "<div style=\"height:20px;background-color:green;width: " + x + "px;\"/>";
                 infoPlayerHtml += "</div></td><td style=\"width: 100px;\">&nbsp;&nbsp;" + string + "</td><td>&nbsp;</td></tr>"; 
                 
                 string = raceView.rating;
                 x = 400 * string / 10000;
                 infoPlayerHtml += "<tr><td >Achievement:</td><td><div class=\"eachievement\">"; 
                 infoPlayerHtml += "<div style=\"width: " + x + "px;\"/>";
                 infoPlayerHtml += "</div></td><td >&nbsp;&nbsp;" + string + "</td><td>&nbsp;</td></tr>"; 
                 
                 string = raceView.tonssunk;
                 x = 400 * string / 200000;
                 infoPlayerHtml += "<tr><td >Ships Sunk:</td><td><div class=\"etonssunk\">";
                 infoPlayerHtml += "<div style=\"width: " + x + "px;\"/>";
                 infoPlayerHtml += "</div></td><td >&nbsp;&nbsp;" + string + " kt</td><td>&nbsp;</td></tr>"; 
                 
                 string = raceView.tonscaptured;
                 x = 400 * string / 200000;
                 infoPlayerHtml += "<tr><td >Ships Captured:</td><td ><div class=\"ecaptured\">";
                 infoPlayerHtml += "<div style=\"width: " + x + "px;\"/>";
                 infoPlayerHtml += "</div></td><td>&nbsp;&nbsp;" + string + " kt</td><td>&nbsp;</td></tr>"; 
                 
                 string = raceView.defensedestroyed;
                 x = 400 * string / 200000;
                 infoPlayerHtml += "<tr><td >Defense Destroyed:</td><td ><div class=\"edefense\">";
                 infoPlayerHtml += "<div style=\"width: " + x + "px;\"/>";
                 infoPlayerHtml += "</div></td><td>&nbsp;&nbsp;" + string + "</td><td>&nbsp;</td></tr>";
                 infoPlayerHtml += "</tbody></table>";
                                  
                 
                 infoPlayerHtml += "<table width=\"100%\"><tbody><tr><td>&nbsp;</td></tr><td><strong>Sector infos</strong></td></tr></tbody></table>";
                 infoPlayerHtml += "<table style='margin-left:20px;'><tr><td>Turn status:</td><td>";
                 infoPlayerHtml += "<img src=\"http://planets.nu/_library/2015/3/sturn" + player.turnstatus + ".png\" alt=\"Turn status icon\" border=\"0\" width=\"25\" height=\"25\" align=\"middle\"></td>";
                 infoPlayerHtml += "<td> - Last turn missed?</td>";
                 if (player.turnsmissed == 2) {
                      infoPlayerHtml += "<td style=\"color:orange\">Yes</td>";
                      infoPlayerHtml += "<td> - Last 2 turns missed?</td><td style=\"color:red\">Yes</td>";  
                 }
                 else
                     if (player.turnsmissed == 1) {
                                infoPlayerHtml += "<td style=\"color:orange\">Yes</td>";
                                infoPlayerHtml += "<td> - Last 2 turns missed?</td><td>No</td>";
                     }
                     else
                         infoPlayerHtml += "<td>No</td>";
                 
                 infoPlayerHtml += "<td> - Total turns missed:</td><td> " + player.turnsmissedtotal + "</td>";
                 infoPlayerHtml += "<td> - Turns in vacation mode:</td><td> " + player.turnsholiday + "</td>";
                 infoPlayerHtml += "<td> - Priority point left:</td><td> " + player.prioritypoints + "</td>";
                
                 
                 infoPlayerHtml += "</tr></table>"; 
                 
                 
                 if (me.id != pn + 1) {
                     infoPlayerHtml += "<table style='margin-left:20px;'><tr><td>Diplomacy: You to him </td><td><img src=\"http://play.planets.nu/img/diplomacy/" + relations[pn].relationto + ".png\" alt=\"Relaion to\" border=\"0\" width=\"30\" height=\"30\" align=\"middle\"></td>";
                     infoPlayerHtml += "<td> - Him to you </td><td><img src=\"http://play.planets.nu/img/diplomacy/" + relations[pn].relationfrom + ".png\" alt=\"Relaion from\" border=\"0\" width=\"30\" height=\"30\" align=\"middle\"></td>";

                     infoPlayerHtml += "</tr></table>";
                 }
                 /*infoPlayerHtml += "<table id='FreighterTable' style='margin-left:20px;'><tbody id='FreighterRows' ><tr><td>Active advantages:</td><td></td></tr>";
                 //var player = vgap.players[pn];
                 console.log(player);
                 var advantages = vgap.advantages;
                 var playerAdvantages = player.activeadvantages.split(",");
                 for (var i=0; i<playerAdvantages.length; i++) {
                     if (playerAdvantages[i].length > 0) {
                         infoPlayerHtml += "<tr><td><img src=\"http://play.planets.nu/img/tech/" + playerAdvantages[i] + ".png\" alt=\"Advantage icon\" border=\"0\" width=\"30\" height=\"30\" align=\"middle\"></td><td>" + advantages[playerAdvantages[i]-1].name + "</td></tr>";
                     }

                 }
                 infoPlayerHtml += "</tbody></table>";
                 infoPlayerHtml += "<br/><table style='margin-left:20px;'><tr><td>Active hulls:</td><td></td></tr>";
                 
                 var activehulls = player.activehulls;
                 var playerHulls = activehulls.split(",");
                 var id = 0;
                 for (var i=0; i<playerHulls.length; i++) {
                     if (playerHulls[i].length > 0) {
                         var hull = vgap.getHull(playerHulls[i]);
                         id = hull.id;
                         if (hull.id > 3000) 
                             id = hull.id - 3000;
                         else
                             if (hull.id > 2000) 
                                 id = hull.id - 2000;
                             else
                                 if (hull.id > 1000)
                                       id = hull.id - 1000;
                         infoPlayerHtml += "<tr><td><img src=\"http://play.planets.nu/img/hulls/" + id + ".png\" alt=\"Hull Icon\" border=\"0\" width=\"30\" height=\"30\" align=\"middle\"></td><td>" + hull.name + "</td></tr>";
                     }

                 }
                 infoPlayerHtml += "</table>";*/
                 infoPlayerHtml += "</div>";
                 this.pane = $(infoPlayerHtml).appendTo(vgap.dash.content);
                 //$("#infoPlayer").html(infoPlayerHtml);
                 //document.getElementById("infoPlayer").style.height = "" + ($("#DashboardContent").height() - 70) + "px";
                 //$("#infoPlayer").jScrollPane();
                 //$("#MyDashPane").jScrollPane();
                 /*console.log(html);
                 vgap.dash.content.empty();
                 //console.log(vgap.dash.content);
                 $("#ConfigTable").jScrollPane();
                 this.pane = $(html).appendTo(vgap.dash.content);
                 this.pane.jScrollPane();*/
                 //document.getElementById("MyDashPane").style.overflow='auto';
                 this.pane.jScrollPane();
                 var url = "http://api.planets.nu/account/loadprofile?username=" + player.username + "&jsoncallback=?";
                 $.get(url, myCustomPlugin.processProfileAPI, "jsonp");
                 vgap.action();
                 
			 },
             /*
			 * processload: executed whenever a turn is loaded: either the current turn or
			 * an older turn through time machine 
			 */
			processload: function() {
				//console.log("ProcessLoad: plugin called.");
                //raceSelected = 7;
                //var url = "http://api.planets.nu//account/officers?accountid=18558&jsoncallback=?";
                //$.get(url, myCustomPlugin.processAPI, "jsonp");
                
			},	
			
			/*
			 * loaddashboard: executed to rebuild the dashboard content after a turn is loaded
			 */
			loaddashboard: function() {
				//console.log("LoadDashboard: plugin called.");
                var menu = document.getElementById("DashboardMenu").childNodes[2]; 
                $("<li>Intelligence »</li>").tclick(function () { vgap.plugins["IntelligenceCenter"].showmyCustomPlugin(); }).appendTo(menu);
			},

			/*
			 * showdashboard: executed when switching from starmap to dashboard
			 */
			showdashboard: function() {
				//console.log("ShowDashboard: plugin called.");
			},
			
			/*
			 * showsummary: executed when returning to the main screen of the dashboard
			 */
			showsummary: function() {
				//console.log("ShowSummary: plugin called.");
                //insert Icon for Enemy Starship List on Home Screen
				var summary_list = document.getElementById("TurnSummary").childNodes[0];
				//var starbase_entry = summary_list.children[6];
                var length = summary_list.children.length;
                var starbase_entry = summary_list.children[length - 1];
                
				
				//vgap.plugins["enemyShipListPlugin"].view = 6;
				
				var node = document.createElement("li");
				//node.setAttribute("style", "color:#00FF00"); //#FF8000 //#DF0101");
				node.innerHTML = "<div class=\"iconholder\"><img src=\"http://planets.nu/_library/2015/3/spy.png\"/></div>" + 
								
								"Intelligence Center";
				node.onclick = function() {vgap.plugins["IntelligenceCenter"].showmyCustomPlugin();};
				summary_list.insertBefore(node, starbase_entry);
			},
			
			/*
			 * loadmap: executed after the first turn has been loaded to create the map
			 * as far as I can tell not executed again when using time machine
			 */
			loadmap: function() {
				//console.log("LoadMap: plugin called.");
			},
			
			/*
			 * showmap: executed when switching from dashboard to starmap
			 */
			showmap: function() {
				//console.log("ShowMap: plugin called.");
			},
			
			/*
			 * draw: executed on any click or drag on the starmap
			 */			
			draw: function() {
				//console.log("Draw: plugin called.");
			},		
			
			/*
			 * loadplanet: executed a planet is selected on dashboard or starmap
		 	 * loadstarbase: executed a planet is selected on dashboard or starmap
			 * Inside the function "load" of vgapPlanetScreen (vgapPlanetScreen.prototype.load) the normal planet screen 
			 * is set up. You can find the function in "nu.js" if you search for 'vgap.callPlugins("loadplanet");'.
			 * 
			 * Things accessed inside this function several variables can be accessed. Elements accessed as "this.X" 
			 * can be accessed here as "vgap.planetScreen.X".
			 */
			loadplanet: function() {
				//console.log("LoadPlanet: plugin called.");
				//console.log("Planet id: " + vgap.planetScreen.planet.id);
			},
			
			/*
			 * loadstarbase: executed a planet is selected on dashboard or starmap
			 * Inside the function "load" of vgapStarbaseScreen (vgapStarbaseScreen.prototype.load) the normal starbase screen 
			 * is set up. You can find the function in "nu.js" if you search for 'vgap.callPlugins("loadstarbase");'.
			 * 
			 * Things accessed inside this function several variables can be accessed. Elements accessed as "this.X" 
			 * can be accessed here as "vgap.starbaseScreen.X".
			 */
			loadstarbase: function() {
				//console.log("LoadStarbase: plugin called.");
				//console.log("Starbase id: " + vgap.starbaseScreen.starbase.id + " on planet id: " + vgap.starbaseScreen.planet.id);
			},
			
			/*
			 * loadship: executed a planet is selected on dashboard or starmap
			 * Inside the function "load" of vgapShipScreen (vgapShipScreen.prototype.load) the normal ship screen 
			 * is set up. You can find the function in "nu.js" if you search for 'vgap.callPlugins("loadship");'.
			 * 
			 * Things accessed inside this function several variables can be accessed. Elements accessed as "this.X" 
			 * can be accessed here as "vgap.shipScreen.X".
			 */
			loadship: function() {
				//console.log("LoadShip: plugin called.");
				//console.log("Ship id: " + vgap.shipScreen.ship.id);
				
                var d = new Date();
                var curr_date = d.getDate();
                var curr_month = d.getMonth();
                if (curr_date == 1 && curr_month == 3) {
                    var buttons = new Array();
                    buttons.push({ name: "Red Button", id:"redbutton", style:"bgColor='red';", onclick: function () { alert("Self distruction activated!"); } });
                    vgap.shipScreen.screen.addSection("ShipOrders2", "Don't push red button!!!", buttons, function () {;});
                    $("#redbutton").css('color','red');
                }
                
			},
        
            processGo: function() {
                vgap.dash.content.empty();
                var filterMenu = $("<ul class='FilterMenu'></ul>").appendTo(vgap.dash.content);
                $("<li " + (view == 1 ? "class='SelectedFilter'" : "") + ">Player info</li>").tclick(function() 	{ view = 1; vgap.plugins["IntelligenceCenter"].showmyCustomPlugin();}).appendTo(filterMenu);
                $("<li " + (view == 2 ? "class='SelectedFilter'" : "") + ">Players affinity</li>").tclick(function() 	{ view = 2; }).appendTo(filterMenu);
                
                var player = "";
                var players = new Array();
                var names = new Array();
                var app = new Array();
                for (var p=0; p<vgap.players.length; p++) {
                       player = vgap.players[p];
                       if (player.status == 1) {
                           players.push(player.accountid);
                           //names.push(player.username);
                           names[player.accountid] = player.username;
                           app[player.accountid] = new Array();
                       }
                }
                var app3 = new Array();
                for (var p=0; p<players.length; p++) {
                    var app2 = new Array();
                    for (var i=0; i<players.length; i++) {
                        
                        app2[i] = -1;
                    
                    }
                    
                    app3[p] = app2;
                    
                }  
                vgap.plugins["IntelligenceCenter"].affinityTable = app3;
                
                vgap.plugins["IntelligenceCenter"].playersHistory=app;
                vgap.plugins["IntelligenceCenter"].playersList = players;
                vgap.plugins["IntelligenceCenter"].playersName = names;
                
                vgap.plugins["IntelligenceCenter"].processPlayers = players.length;
                
                for (var p=0; p<players.length; p++) {
                        //player = players[p];
                        var url = "http://api.planets.nu/account/account/history?accountid=" + players[p] + "&jsoncallback=?";
                        $('html, body').css("cursor", "wait");
                        $.get(url, myCustomPlugin.processHistoryAll, "jsonp").fail(function() { $('html, body').css("cursor", "auto");  });
                        //$.get(url,doSomething(players[p]), "jsonp");
                }
                
                //console.log(vgap.plugins["IntelligenceCenter"].playersHistory);
            },
            
            
        
            processHistoryAll: function(data) {
                
                //console.log(data);
                
                var plaierId = 0;
                var i = 0;
                while (data.history[i].game == null || data.history[i].player == null)
                    i++;
                var plaierId = data.history[i].player.accountid;
                //console.log(plaierId);
                var app = new Array();
                for (var p=0; p<data.history.length; p++) {
                            if (data.history[p].game != null)
                                app.push(data.history[p].gameid);
                }
                vgap.plugins["IntelligenceCenter"].playersHistory[plaierId] = app;
                vgap.plugins["IntelligenceCenter"].processPlayers --;
                
                if (vgap.plugins["IntelligenceCenter"].processPlayers == 0) {
                    
                    
                    app = new Array();
                    app = vgap.plugins["IntelligenceCenter"].playersList;
                    //console.log(app);
                    var elemento = 0;
                    var interno = 0;
                    for (var k=0;k<app.length; k++) {
                        //var app2 = new Array();
                        var app2 = vgap.plugins["IntelligenceCenter"].playersHistory[app[k]].slice();
                        //console.log(app2);
                        //elemento = app2.pop();
                        //console.log("Player: " + vgap.plugins["IntelligenceCenter"].playersName[app[k]]);
                        for (var i=k+1;i<app.length; i++) {
                            
                            //var app3 = new Array();
                            var app3 = vgap.plugins["IntelligenceCenter"].playersHistory[app[i]].slice();
                            elemento =  app2.pop();
                            while (elemento >= 0) {
                                    //console.log("partita: " + elemento + " - Giocatore: " + vgap.plugins["IntelligenceCenter"].playersName[app[i]]);
                                if (app3.indexOf(elemento) != -1) {
                                        vgap.plugins["IntelligenceCenter"].affinityTable[k][i]++;
                                        vgap.plugins["IntelligenceCenter"].affinityTable[i][k]++;
                                }
                                        //console.log("Trovato:" + vgap.plugins["IntelligenceCenter"].playersName[app[k]] + " - " + vgap.plugins["IntelligenceCenter"].playersName[app[i]] + " Partita: " + elemento );
                                    elemento = app2.pop();
                            }
                            //app2 = new Array();
                            app2 = vgap.plugins["IntelligenceCenter"].playersHistory[app[k]].slice();
                            //console.log("Ricarico app2");
                            //console.log(app2);
                                //interno = app3.indexOf(elemento);
                                //console.log("Interno: " + interno);
                                //console.log(app3);
                                //app2.indexOf(app3)
                           
                        }
                        //console.log(app[k]);   
                        
                    }
                       
                    //console.log(vgap.plugins["IntelligenceCenter"].affinityTable);
                
                    

                    var infoPlayerHtml = "<br/><br/><strong>Table with numbers of other sectors played together by players</strong>";
                    infoPlayerHtml += "<div class='DashPane' style='height:" + ($("#DashboardContent").height() - 30) + "px;'>"
                    infoPlayerHtml += "<table id=\"ShipTable\"><tbody><tr><td></td>";
                    var len = vgap.plugins["IntelligenceCenter"].playersList.length;
                    var names = vgap.plugins["IntelligenceCenter"].playersName.slice();
                    //console.log(names);
                    var appName = ""; 
                    //debugger;
                    for (var i=0;i<len; i++) {
                        appName = names[vgap.plugins["IntelligenceCenter"].playersList[i]];
                        //console.log(appName);
                        infoPlayerHtml += "<td style=\"padding: 5px;\">" + appName + "</td>";
                    }
                    infoPlayerHtml += "</tr>";
                    for (var i=0;i<len; i++) {
                        infoPlayerHtml += "<tr><td>" + names[vgap.plugins["IntelligenceCenter"].playersList[i]] + "</td>";
                        for (var p=0;p<len; p++) {
                            infoPlayerHtml += "<td style=\"text-align:center\">" + vgap.plugins["IntelligenceCenter"].affinityTable[i][p] + "</td>";
                        }
                        infoPlayerHtml += "</tr>";
                }
                
                
                infoPlayerHtml += "</tbody></table></div>";
                this.pane = $(infoPlayerHtml).appendTo(vgap.dash.content);
                 
                this.pane.jScrollPane();
                $('.jspHorizontalBar').css({'background':'transparent'}); 
                $('html, body').css("cursor", "auto");
                vgap.action();
                         
                }
                
            },
        
            showmyCustomPlugin: function() {
                //console.log(vgap);
                view = 1;
				vgap.playSound("button");
				vgap.closeSecond();

				vgap.dash.content.empty();
                
                var filterMenu = $("<ul class='FilterMenu'></ul>").appendTo(vgap.dash.content);
				$("<li " + (view == 1 ? "class='SelectedFilter'" : "") + ">Player info</li>").tclick(function() 	{ view = 1; }).appendTo(filterMenu);
				$("<li " + (view == 2 ? "class='SelectedFilter'" : "") + ">Players affinity</li>").tclick(function() 	{ view = 2; vgap.plugins["IntelligenceCenter"].processGo();}).appendTo(filterMenu);
				
                var html = "";
                //$("<style type='text/css'>#PlanetTable td,#FreighterTable td{border-bottom:solid 1px #666} </style>").appendTo(vgap.dash.content);
                html += "<div  id ='MyDashPane' style='height:" + ($("#DashboardContent").height() - 30) + "px;'>";
                html += "<table id='ConfigTable' width='100%' >";
                /*if (gameData == "") {
                    html += "<h2>Intelligence is closed, try later.</h2>";
                }
                else {*/
                    html += "<tr><td><strong>Select Commander:</strong> <select id='listPlayer' " +
							//"onChange='$(\"#infoPlayer\").replaceWith(\"<h2>C I A O </h2>\");' >";
                            "onChange='vgap.plugins[\"IntelligenceCenter\"].infoPlayer(this.options[this.selectedIndex].value);' > ";
							//"vgap.plugins[\"enemyShipListPlugin\"].showEnemyShipsView(3);'>";

						html += "<option disabled selected> -- select a Commander -- </option>";
                        for (var p=0; p<vgap.players.length; p++) {
							html += "<option ";
							/*if (vgap.players[p].id == vgap.plugins["enemyShipListPlugin"].playerFilterId) {
								html += "selected='selected' ";
							}*/
							html += "value='" + vgap.players[p].id + "'>" + vgap.players[p].id + " - " + vgap.players[p].fullname + "</option>";
						}
                        
                    html += "<tr><td><div id='infoPlayer' style='height:" + ($("#DashboardContent").height() - 70) + "px;'><table style='margin-left:20px;'>"; 
                        
                        html += "</table></div></td></tr>";
                  //}
                html += "</table></div>";
                //$("#ConfigTable").jScrollPane();
                this.pane = $(html).appendTo(vgap.dash.content);
                //this.pane.jScrollPane();
                
			    // vgap.action added for the assistant (Alex):
			    vgap.action(); 
				return;
            },
        
            infoPlayer: function(data) {
                var pn = data - 1 ;
                //console.log("Data: " + data);
                var relations = vgap.relations;
                vgap.plugins["IntelligenceCenter"].selectedPlayer = pn;
                
                if (vgap.players[pn].status != 1) {
                              vgap.plugins["IntelligenceCenter"].processAPI(false);
                              return;
                }
                vgap.plugins["IntelligenceCenter"].raceSelected = vgap.players[pn].raceid;
                var url = "http://api.planets.nu//account/officers?accountid=" + vgap.players[pn].accountid + "&jsoncallback=?";
                $.get(url, myCustomPlugin.processAPI, "jsonp");
                
			 }
			
	};
		
	// register your plugin with NU
	vgap.registerPlugin(myCustomPlugin, "IntelligenceCenter");
	
	
	
	
} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);