// ==UserScript==
// @name          Planets.nu - Planetary Management Plugin
// @description   Planetary Management Plugin
// @version       3.1
// @copyright	  2014, Dotman
// @license		  CC BY-NC-ND 4.0 (http://creativecommons.org/licenses/by-nc-nd/4.0/)
// @author        Dotman
// @contributor	  Jim Clark
// @include       http://planets.nu/#/*
// @include       http://planets.nu/*
// @include       http://play.planets.nu/*
// @include       http://test.planets.nu/*
// @history       0.2    Initial release [2013-07-28]
// @history       0.5    Major Beta Add - Method Construction, Versioning
// @history		  1.01	 Main Release
// @history		  1.11	 Stellar Cartography Support, Filters, Global Method Applications
// @history		  1.20   Nu 1.16 Support - Large Saving
// @history		  2.0    This is a fork from dotmans original script. Fixes/Enhancmenets included are neumerous and (some) forgotten
//							- Removed build screen popup which cuts HUGE amounts of time from the build function
//                          - Added new taxation methods; riot and notax
//                          - Added more default tax and build options
//                          - Reorginiazed managmenet window to make it harder to screwup all your settings
//                          - More?
// @history		  2.2    Removes "autotax" checkbox from planets when they are built
// @history		  2.3    Added autotax build method which checks the autotax box in planets.nu. Useful for vacation taxing.
// @history		  2.4    Fixed bug with manual taxing.
// @history		  2.41	 Fixed Borg Overtax Bug
// @history		  3.0	 Starmap Overlays added
//						 Planet Screen method selection and single planet build added
//							Bugfixes:
//								5000mc limit on colonist tax implemented
//								5000mc limit on colonist and native tax implemented
//								FC randomize button bug fixed
//								Fed 200% Taxing bug fixed
//								Default tax method growth tax, at popmax, taxed only down to 50; adjusted back to 40 (bug came in in v2.0?)
// @history		  3.1	 Starmap Overlay can now be toggled 
//						 Global apply buttons moved back to top
// @namespace https://greasyfork.org/users/2984
// @downloadURL https://update.greasyfork.org/scripts/6127/Planetsnu%20-%20Planetary%20Management%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/6127/Planetsnu%20-%20Planetary%20Management%20Plugin.meta.js
// ==/UserScript==


function wrapper () { // wrapper for injection
    
    if (vgap.version < 3.0) {
        console.log("Planetary Management Plugin requires at least NU version 3.0. Plugin disabled." );
        return;	
    }
    
    var plugin_version = 3.1;
    var debug = false;
    
    console.log("Map Beta: Planetary Manager plugin version: v" + plugin_version );

    var plManagerPlugin = {
        
        
        
        processload: function() {
            if (debug) console.log("ProcessLoad: plManagerPlugin plugin called.");
            var plg = vgap.plugins["plManagerPlugin"];
            vgap.plugins["plManagerPlugin"].curplanet = 0;
            vgap.plugins["plManagerPlugin"].planetbuildindex = 0;
            vgap.plugins["plManagerPlugin"].buildstatustext = "";
            // Add the CSS Styling we will need later
            vgap.plugins["plManagerPlugin"].addCss("#PopulationTable, #InfoTable, #BldgTable, #PMResTable { \
background-color: rgba(0,0,0,0.2); \
padding: 5px; \
box-shadow: 5px 5px 5px #777777}");
            
            
            // PLTable CSS			
            vgap.plugins["plManagerPlugin"].addCss(".PLRow { \
background-color: rgba(0,0,0,0.2); \
padding: 10px; \
box-shadow: 2px 2px 2px #777777}");	
            
            vgap.plugins["plManagerPlugin"].addCss(".PLNewRow { \
background-color: rgba(255,255,0,0.2); \
padding: 10px; \
box-shadow: 2px 2px 2px #777777}");				
            
            vgap.plugins["plManagerPlugin"].addCss(".PLPlanetTable { \
padding: 20px;}");					
            
            vgap.plugins["plManagerPlugin"].addCss(".PLResTable { \
padding: 10px;}");	
            
            vgap.plugins["plManagerPlugin"].addCss(".ResAmt { \
color: rgba(255,255,255,0.5); \
padding-right: 20px; \
font-size: 12px;}");					
            
            // PL Bldg Table CSS
            vgap.plugins["plManagerPlugin"].addCss(".PLBldgTable { \
padding: 5px;}");
            
            vgap.plugins["plManagerPlugin"].addCss(".BldgCnt { \
color: #00FF00; \
font-weight: bold; \
text-align: right; \
text-size: 16px;}");					
            
            vgap.plugins["plManagerPlugin"].addCss(".BldgMax { \
text-size: 12px;}");	
            
            vgap.plugins["plManagerPlugin"].addCss(".BldgBlt { \
color: rgba(255,255,255,0.5); \
font-size: 12px;}");
            
            vgap.plugins["plManagerPlugin"].addCss(".PLPopTag { \
text-align: left; \
font-size: 12px;}");
            
            vgap.plugins["plManagerPlugin"].addCss(".PLPopVal { \
text-align: left; \
font-weight: bold; \
padding-left: 30px; \
font-size: 14px;}");	
            
            vgap.plugins["plManagerPlugin"].addCss(".PLBuildStatus { \
color: #00FF00; \
font-weight: bold; \
text-align: center; \
text-size: 16px;}");
            
            vgap.plugins["plManagerPlugin"].addCss("#PLBldDescription { \
width: 150px; \
font-weight: bold; \
text-align: center; \
text-size: 16px;}");			
            
            // PMDetail CSS
            
            vgap.plugins["plManagerPlugin"].addCss(".PMBldgCnt { \
color: #00FF00; \
font-weight: bold; \
text-align: right; \
text-size: 16px;}");					
            
            vgap.plugins["plManagerPlugin"].addCss(".PredictVal { \
position: relative; \
color: #00FF00; \
font-weight: bold; \
text-size: 16px;}");
            
            vgap.plugins["plManagerPlugin"].addCss("#PredHdr { \
text-size: 14px;}");	
            
            
            vgap.plugins["plManagerPlugin"].addCss(".PMBldgMax { \
text-size: 14px;}");	
            
            vgap.plugins["plManagerPlugin"].addCss(".PMBldgBlt { \
color: rgba(255,255,255,0.5); \
font-size: 14px;}");
            
            vgap.plugins["plManagerPlugin"].addCss(".PMColTag { \
text-align: left; \
font-weight: bold; \
font-size: 15px;}");
            
            vgap.plugins["plManagerPlugin"].addCss(".PMColVal { \
color: #00FF00; \
text-align: left; \
font-weight: bold; \
padding-left: 30px; \
font-size: 15px;}");
            
            vgap.plugins["plManagerPlugin"].addCss(".PMColExtra { \
color: rgba(255,255,255,0.5); \
font-size: 14px;}");
            
            vgap.plugins["plManagerPlugin"].addCss(".PMResAmt { \
color: rgba(255,255,255,0.5); \
padding-right: 20px; \
font-size: 14px;}");
            
            vgap.plugins["plManagerPlugin"].addCss(".PMResName { \
font-weight: bold;\
padding-right: 20px; \
font-size: 15px;}");
            
            vgap.plugins["plManagerPlugin"].addCss("#BMFieldset { \
width: 350px; \
border: 1px solid; \
border-radius: 10px; \
padding: 20px;}");
            
            vgap.plugins["plManagerPlugin"].addCss("#BMWizFieldset, #TMWizMethFieldset { \
width: 350px; \
border: 1px solid; \
border-radius: 10px; \
padding: 20px;}");
            
            vgap.plugins["plManagerPlugin"].addCss("#BMLegend { \
border: 1px solid #dcdcdc; \
border-radius: 10px; \
padding: 10px 20px; \
text-transform: uppercase;}");
            
            vgap.plugins["plManagerPlugin"].addCss("input { \
border-radius: 5px; \
}");
            
            vgap.plugins["plManagerPlugin"].addCss("#BMMainTable { \
padding: 10px;}");
            
            vgap.plugins["plManagerPlugin"].addCss("#BMDEDiv { \
width: 450px; \
border-radius: 10px; \
background-color: rgba(0,0,0,0.2); \
box-shadow: 5px 5px 5px #777777; \
vertical-align: top; \
padding: 20px;}");
            
            vgap.plugins["plManagerPlugin"].addCss("#BMWizDiv, #TMWiz { \
box-shadow: 5px 5px 5px #777777; \
width: 530px; \
border-radius: 10px; \
background-color: rgba(0,0,0,0.2); \
vertical-align: top; \
padding: 20px;}");
            
            vgap.plugins["plManagerPlugin"].addCss(".BMWizSection { \
border: 1px solid; \
border-radius: 10px;}");
            
            //vgap.plugins["plManagerPlugin"].addCss("#BMWizTable { \
            //			padding: 10px;}");
            
            vgap.plugins["plManagerPlugin"].addCss("#BMWizTable td{ \
padding: 10px;}");
            
            vgap.plugins["plManagerPlugin"].addCss("#DEBMStatusText { \
color: #FF0000; \
font-weight: bold; \
text-size: 16px;}");			
            vgap.plugins["plManagerPlugin"].addCss("#MPPLBMTable { \
width: 400px; \
overflow: hidden; \
    display: inline-block; \
    white-space: nowrap;}");
    
			vgap.plugins["plManagerPlugin"].addCss(".MPBMSelect { width: 110px;}");
			vgap.plugins["plManagerPlugin"].addCss(".MPCTSelect { width: 110px;}");
			vgap.plugins["plManagerPlugin"].addCss(".MPNTSelect { width: 110px;}");
			
            vgap.plugins["plManagerPlugin"].addCss("#BMSelTable, #TMSelTable { \
border-radius: 10px; \
background-color: rgba(0,0,0,0.2); \
box-shadow: 5px 5px 5px #777777}");
            
            vgap.plugins["plManagerPlugin"].addCss("#BMGSelTable, #NTMGSelTable, #CTMGSelTable, #GMATable { \
border-radius: 10px; \
background-color: rgba(0,0,0,0.2); \
box-shadow: 5px 5px 5px #777777}");
            
            vgap.plugins["plManagerPlugin"].addCss("#warntext { \
color: #00FF00;}");
            
            vgap.plugins["plManagerPlugin"].addCss("#BMSelTable td{ \
padding-left: 20px;}");

			// New Map CSS Stuff
			vgap.plugins["plManagerPlugin"].addCss("#PlanetsLoc { \
right: 68px;}");

			vgap.plugins["plManagerPlugin"].addCss(".PMMapBtn { \
padding-right: 1px; \
padding-left: 1px}");
			
			vgap.plugins["plManagerPlugin"].addCss("#PMMapBtnBar { \
position: absolute; \
color: white; \
font-size: 12px; \
text-align: center; \
font-weight: bold; \
top: 58px; \
right: 6px; \
width: 52px; \
background-color: rgba(30,30,30,30.2); \
padding: 3px; \
box-shadow: 2px 2px 2px #777777}");

vgap.plugins["plManagerPlugin"].addCss("#PMMapExpBtn { \
position: absolute; \
color: white; \
font-size: 12px; \
text-align: center; \
font-weight: bold; \
top: 58px; \
right: 6px; \
width: 15px; \
background-color: rgba(30,30,30,30.2); \
padding: 0px; \
box-shadow: 1px 1px 1px #777777}");

			vgap.plugins["plManagerPlugin"].addCss("#PMMapDrawBar { \
position: absolute; \
color: white; \
font-size: 12px; \
text-align: center; \
font-weight: bold; \
top: 58px; \
right: -28px; \
width: 26px; \
background-color: rgba(30,30,30,30.2); \
padding: 3px; \
box-shadow: 2px 2px 2px #777777}");
// width: 52px
// right: 6px

            
            // End CSS
            
            // Initialize configuration arrays
            /*
				while (vgap.plugins["plManagerPlugin"].bmarray.length < 501) {
					vgap.plugins["plManagerPlugin"].bmarray[vgap.plugins["plManagerPlugin"].length]=1;
				}
				*/
                bmarray = [];
                ntarray = [];
                ctarray = [];
                myplanetsarray = [];
                buildmethods = [];
                taxmethods = [];
                parray = [];
                
                
                // Read Notes
                if (debug) console.log("Preparing To Read.  YOU SHOULD ALWAYS SEE THIS LINE AND IT SHOULD BE EASY TO SEE BECAUSE ITS IN CAPS AND HAS STARS IN IT!!!! *******");
                plg.readOrder = 1;
                plg.readNotes();
                
                
                vgap.plugins["plManagerPlugin"].buildstatustext = "Idle";
                plg.validateArrays();
                
                // Configure map overlay click sets
                plg.pmmcOverlay = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
                plg.pmmcLastOverlay = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
                
                // Overlay index configuration:
                // 0 - Neutronium
                // 1 - Duranium
                // 2 - Tritanium
                // 3 - Molybdenum
                // 4 - Planet Names
                // 5 - Planet Temperatures
                // 6 - Colonists
                // 7 - Natives
                // 8 - Colonist Tax Info
                // 9 - Native Tax Info
                // 10 - Supplies
                // 11 - Megacredits
                // 12 - Build Method
                // 13 - Factories
                // 14 - Mines
                // 15 - Defense Posts
				// 16 - SB Build
				// 17 - SB Tech Levels
				// 18 - SB Defenses
				
                
                
                // Load map overlay images
                plg.pmiNeutN = new Image();
                pmiNeutH = new Image();
				pmiDurN = new Image();
				pmiDurH = new Image();
				pmiTriN = new Image();
				pmiTriH = new Image();
				pmiMolyN = new Image();
				pmiMolyH = new Image();
				
				plg.pmiNeutN.src = 'http://i1371.photobucket.com/albums/ag292/rhansen00/Neut2Big_zps561825e1.png';
                plg.pmiNeutH.src = 'http://i1371.photobucket.com/albums/ag292/rhansen00/NeutHov2Big_zps7e03b204.png';
                plg.pmiDurN.src = 'http://i1371.photobucket.com/albums/ag292/rhansen00/Dur2Big_zpsa7416722.png';
                plg.pmiDurH.src = 'http://i1371.photobucket.com/albums/ag292/rhansen00/DurHov2Big_zps533da55a.png';
                plg.pmiTriN.src = 'http://i1371.photobucket.com/albums/ag292/rhansen00/Trit2Big_zpsde278d77.png';
                plg.pmiTriH.src = 'http://i1371.photobucket.com/albums/ag292/rhansen00/TritHov2Big_zps4ac49fad.png';
                plg.pmiMolyN.src = 'http://i1371.photobucket.com/albums/ag292/rhansen00/Moly2Big_zpsd1092909.png';
                plg.pmiMolyH.src = 'http://i1371.photobucket.com/albums/ag292/rhansen00/MolyHov2Big_zps063bfe20.png';
                
                for (var i = 0; i < 20; i++) {
					plg.pmmiNormal[i] = new Image();
					plg.pmmiHover[i] = new Image();
				}
				
				plg.pmmiExpImg = new Image();
				plg.pmmiExpImg.src = 'http://planets.nu/_library/2014/11/expmenu.jpg';
				
				plg.pmmiNormal[0].src = 'http://planets.nu/_library/2014/10/neut2mid.png';
				plg.pmmiNormal[1].src = 'http://planets.nu/_library/2014/10/dur2mid.png';
				plg.pmmiNormal[2].src = 'http://planets.nu/_library/2014/10/trit2mid.png';
				plg.pmmiNormal[3].src = 'http://planets.nu/_library/2014/10/moly2mid.png';
				plg.pmmiNormal[4].src = 'http://planets.nu/_library/2014/10/planet2mid.jpg';
				plg.pmmiNormal[5].src = 'http://planets.nu/_library/2014/10/fmid.jpg';
				plg.pmmiNormal[6].src = 'http://planets.nu/_library/2014/10/colpic2mid.jpg';
				plg.pmmiNormal[7].src = 'http://planets.nu/_library/2014/10/natpic2mid.jpg';
				plg.pmmiNormal[8].src = 'http://planets.nu/_library/2014/10/col2mid.png';
				plg.pmmiNormal[9].src = 'http://planets.nu/_library/2014/10/neut2mid.png';
				plg.pmmiNormal[10].src = 'http://planets.nu/_library/2014/10/sup2mid.png';
				plg.pmmiNormal[11].src = 'http://planets.nu/_library/2014/10/mc2mid.png';
				plg.pmmiNormal[12].src = 'http://planets.nu/_library/2014/10/sbtech2mid.jpg';
				plg.pmmiNormal[13].src = 'http://planets.nu/_library/2014/10/fact2mid.jpg';
				plg.pmmiNormal[14].src = 'http://planets.nu/_library/2014/10/mine2mid.jpg';
				plg.pmmiNormal[15].src = 'http://planets.nu/_library/2014/10/def2mid.jpg';
				plg.pmmiNormal[16].src = 'http://planets.nu/_library/2014/10/sbbuild2mid.jpg';
				plg.pmmiNormal[17].src = 'http://planets.nu/_library/2014/10/sb2mid.jpg';
				//plg.pmmiNormal[18].src = 'http://i1371.photobucket.com/albums/ag292/rhansen00/Neut2Mid_zps78c30af0.png';
				
				plg.pmmiHover[0].src = 'http://planets.nu/_library/2014/10/neuthov2mid.png';
				plg.pmmiHover[1].src = 'http://planets.nu/_library/2014/10/durhov2mid.png';
				plg.pmmiHover[2].src = 'http://planets.nu/_library/2014/10/trithov2mid.png';
				plg.pmmiHover[3].src = 'http://planets.nu/_library/2014/10/molyhov2mid.png';
				plg.pmmiHover[4].src = 'http://planets.nu/_library/2014/10/planethov2mid.jpg';
				plg.pmmiHover[5].src = 'http://planets.nu/_library/2014/10/fhovmid.jpg';
				plg.pmmiHover[6].src = 'http://planets.nu/_library/2014/10/colpichov2mid.jpg';
				plg.pmmiHover[7].src = 'http://planets.nu/_library/2014/10/natpichov2mid.jpg';
				plg.pmmiHover[8].src = 'http://planets.nu/_library/2014/10/colhov2mid.png';
				plg.pmmiHover[9].src = 'http://planets.nu/_library/2014/10/neuthov2mid.png';
				plg.pmmiHover[10].src = 'http://planets.nu/_library/2014/10/suphov2mid.png';
				plg.pmmiHover[11].src = 'http://planets.nu/_library/2014/10/mchov2mid.png';
				plg.pmmiHover[12].src = 'http://planets.nu/_library/2014/10/sbtechhov2mid.jpg';
				plg.pmmiHover[13].src = 'http://planets.nu/_library/2014/10/facthov2mid.jpg';
				plg.pmmiHover[14].src = 'http://planets.nu/_library/2014/10/minehov2mid.jpg';
				plg.pmmiHover[15].src = 'http://planets.nu/_library/2014/10/defhov2mid.jpg';
				plg.pmmiHover[16].src = 'http://planets.nu/_library/2014/10/sbbuildhov2mid.jpg';
				plg.pmmiHover[17].src = 'http://planets.nu/_library/2014/10/sbhov2mid.jpg';
				//plg.pmmiHover[18].src = 'http://i1371.photobucket.com/albums/ag292/rhansen00/NeutHov2Mid_zps14c1798b.png';
				
                plg.pmmBtns[0] = '#PMMapBtnBarNeut';
                plg.pmmBtns[1] = '#PMMapBtnBarDur';
                plg.pmmBtns[2] = '#PMMapBtnBarTrit';
                plg.pmmBtns[3] = '#PMMapBtnBarMoly';
                plg.pmmBtns[4] = '#PMMapBtnBarName';
                plg.pmmBtns[5] = '#PMMapBtnBarTemp';
                plg.pmmBtns[6] = '#PMMapBtnBarCols';
                plg.pmmBtns[7] = '#PMMapBtnBarNats';
                plg.pmmBtns[8] = '#PMMapBtnBarColTax';
                plg.pmmBtns[9] = '#PMMapBtnBarNatTax';
                plg.pmmBtns[10] = '#PMMapBtnBarSup';
                plg.pmmBtns[11] = '#PMMapBtnBarMC';
                plg.pmmBtns[12] = '#PMMapBtnBarBM';
                plg.pmmBtns[13] = '#PMMapBtnBarFact';
                plg.pmmBtns[14] = '#PMMapBtnBarMines';
                plg.pmmBtns[15] = '#PMMapBtnBarDP';
                plg.pmmBtns[16] = '#PMMapBtnBarSBBuild';
                plg.pmmBtns[17] = '#PMMapBtnBarSBTech';
                //plg.pmmBtns[18] = '#PMMapBtnBarSBDef';

                if (debug) console.log("END PROCESS LOAD");
            },	
        
        loaddashboard: function() {
            //console.log("LoadDashboard: plManagerPlugin plugin called.");
            
            // Add Planetary Management Button
            var menu = document.getElementById("DashboardMenu").childNodes[2]; //insert in middle
            $("<li style=\"color:#FFF000\">Planetary Management »</li>").tclick(function () { vgap.plugins["plManagerPlugin"].displayPM(); }).appendTo(menu);
            
        },
        
        /*
			 * showdashboard: executed when switching from starmap to dashboard
			 */
        showdashboard: function() {
            /*
				console.log("ShowDashboard: plManagerPlugin plugin called.");
				console.log("Total Planets: " + vgap.planets.length);
				for (var i = 0; i < vgap.planets.length; i++) {
					console.log("Planet " + vgap.planets[i].id + ": " + vgap.planets[i].name + " : DD = " + vgap.planets[i].debrisdisk);
				}
				console.log("Total Debris Disks: " + vgap.debrisdisks.length);
				for (var i = 0; i < vgap.debrisdisks.length; i++) {
					console.log("Planet (DD) " + vgap.debrisdisks[i].id + ": " + vgap.debrisdisks[i].name);
				}
				console.log("Getting Planet 479:");
				var pln = vgap.getPlanet(479);
				console.log(pln);
				console.log("pln.id, pln.name: " + pln.id + ", "+ pln.name);
				*/ 
				$('#PMMapBtnBar').remove();
				$('#PMMapDrawBar').remove();
				$('#PMMapExpBtn').remove();
            },
        
        /*
			 * showsummary: executed when returning to the main screen of the dashboard
			 */
        showsummary: function() {
            //console.log("ShowSummary: plManagerPlugin plugin called.");
            
            //insert Icon for Planetary Management on Home Screen
            var summary_list = document.getElementById("TurnSummary").childNodes[0];
            var planets_entry = summary_list.children[2];
            
            var node = document.createElement("li");
            node.setAttribute("style", "color:#FFF000");
            node.innerHTML = "<div class=\"iconholder\"><img src=\"http://play.planets.nu/img/icons/blacksquares/planets.png\"/></div>" + 
                "Planetary Management";
            node.onclick = function() {vgap.plugins["plManagerPlugin"].displayPM();};
            summary_list.insertBefore(node, planets_entry);
            //summary_list.appendChild(node);
            
        },
        
        /*
			 * loadmap: executed after the first turn has been loaded to create the map
			 * as far as I can tell not executed again when using time machine
			 */
        loadmap: function() {
            //console.log("LoadMap: plManagerPlugin plugin called.");
        },
        
        /*
			 * showmap: executed when switching from dashboard to starmap
			 */
        showmap: function() {
            console.log("ShowMap: plManagerPlugin plugin called.");
            
            vgap.plugins["plManagerPlugin"].displayPMMapMenu();
			
        },
        
        displayPMMapMenu: function() {
			var plg = vgap.plugins["plManagerPlugin"];
			console.log("DRAW MAP MENU OVERLAY CALLED.");
			// Set the layout css of the overlay menu:

			$('#PMMapBtnBar').remove();
			$('#PMMapExpBtn').remove();
			
			// The menu is hidden, just show the little expander button
			var expbtnhtml = ""
			expbtnhtml += '<div id="PMMapExpBtn"><img title="Show Overlays" src="' + vgap.plugins["plManagerPlugin"].pmmiExpImg.src + '"></img></div>';
			$(expbtnhtml).appendTo(vgap.container);
			
			var mapmenuhtml = ""
			mapmenuhtml += '<div id="PMMapBtnBar"><span id="PMMapBtnOverlay">Overlays</span>';
			mapmenuhtml += '<hr />General<span class="PMMapBtn" id="PMMapBtnBarName"><img title="Planet Names" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[4].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarTemp"><img title="Friendly Codes" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[5].src + '"></img></span>';
			mapmenuhtml += '<hr />Minerals<span class="PMMapBtn" id="PMMapBtnBarNeut"><img title="Neutronium" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[0].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarDur"><img title="Duranium" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[1].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarTrit"><img title="Tritanium" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[2].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarMoly"><img title="Molybdenum" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[3].src + '"></img></span>';
			mapmenuhtml += '<hr />Population<span class="PMMapBtn" id="PMMapBtnBarCols"><img title="Colonists" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[6].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarNats"><img title="Natives" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[7].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarColTax"><img title="Colonist Tax" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[8].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarNatTax"><img title="Native Tax" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[9].src + '"></img></span>';
			mapmenuhtml += '<hr />Sup-MC<span class="PMMapBtn" id="PMMapBtnBarSup"><img title="Supplies" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[10].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarMC"><img title="Megacredits" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[11].src + '"></img></span>';
			mapmenuhtml += '<hr />Structures<span class="PMMapBtn" id="PMMapBtnBarBM"><img title="Build Method" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[12].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarFact"><img title="Factories" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[13].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarMines"><img title="Mines" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[14].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarDP"><img title="Defense Posts" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[15].src + '"></img></span>';
			mapmenuhtml += '<hr />Starbase<span class="PMMapBtn" id="PMMapBtnBarSBBuild"><img title="SB Building" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[16].src + '"></img></span>';
			mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarSBTech"><img title="SB Tech and Defense" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[17].src + '"></img></span>';
			//mapmenuhtml += '<span class="PMMapBtn" id="PMMapBtnBarSBDef"><img title="Defense Posts" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[2].src + '"></img></span>';
			mapmenuhtml += '<hr /></div>';
			
			$(mapmenuhtml).appendTo(vgap.container);
			
			
			
			// Set the layout css of the overlay menu:
			if (plg.showOverlayMenu == true) {
				console.log("SHOWOVERLAY: " + plg.showOverlayMenu + " - Setting css exp btn offscreen.");
				$("#PlanetsLoc").css("right","68px");
				$("#PMMapBtnBar").css("right","6px");
				$("#PMMapExpBtn").css("right","-25px");
			}
			else {
				console.log("SHOWOVERLAY: " + plg.showOverlayMenu + " - Setting css menu bar offscreen.");
				$("#PlanetsLoc").css("right","24px");
				$("#PMMapBtnBar").css("right","-58px");
				$("#PMMapExpBtn").css("right","4px");
			}
			
			$('#PMMapBtnOverlay').click(function() {
				//vgap.hotkeysOn = false;
				plg.showOverlayMenu = false;
				$('#PlanetsLoc').animate(
					{
						// 68 planetloc, 52 width on mapbtn, 6px on right; new menu 26px, lets give 4 px buffer
						right:'20px'
					},400);
				$('#PMMapBtnBar').animate(
					{
						// 68 planetloc, 52 width on mapbtn, 6px on right; new menu 26px, lets give 4 px buffer
						right:'-58px'
					},400);
				$('#PMMapExpBtn').animate(
					{
						right:'4px'
					},400);
				});
			
			$('#PMMapExpBtn').click(function() {
				//vgap.hotkeysOn = false;
				plg.showOverlayMenu = true;
				$('#PlanetsLoc').animate(
					{
						// 68 planetloc, 52 width on mapbtn, 6px on right; new menu 26px, lets give 4 px buffer
						right:'68px'
					},400);
				$('#PMMapBtnBar').animate(
					{
						// 68 planetloc, 52 width on mapbtn, 6px on right; new menu 26px, lets give 4 px buffer
						right:'6px'
					},400);
				$('#PMMapExpBtn').animate(
					{
						right:'-25px'
					},400);
				});
			
			//$("<div id='PMMapBtnBar'>Some Menu Stuff Beta </div>").appendTo(vgap.container);
			
			
			$('#PMMapBtnBarNeut').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(0),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(0));
			$('#PMMapBtnBarDur').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(1),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(1));
			$('#PMMapBtnBarTrit').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(2),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(2));
			$('#PMMapBtnBarMoly').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(3),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(3));
			$('#PMMapBtnBarName').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(4),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(4));
			$('#PMMapBtnBarTemp').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(5),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(5));
			$('#PMMapBtnBarCols').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(6),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(6));
			$('#PMMapBtnBarNats').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(7),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(7));
			$('#PMMapBtnBarColTax').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(8),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(8));
			$('#PMMapBtnBarNatTax').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(9),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(9));
			$('#PMMapBtnBarSup').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(10),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(10));
			$('#PMMapBtnBarMC').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(11),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(11));
			$('#PMMapBtnBarBM').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(12),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(12));
			$('#PMMapBtnBarFact').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(13),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(13));
			$('#PMMapBtnBarMines').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(14),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(14));
			$('#PMMapBtnBarDP').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(15),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(15));
			$('#PMMapBtnBarSBBuild').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(16),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(16));
			$('#PMMapBtnBarSBTech').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(17),
										vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(17));
			//$('#PMMapBtnBarSBDef').hover(vgap.plugins["plManagerPlugin"].makePMMapBtnHovOnFunc(18),
			//							vgap.plugins["plManagerPlugin"].makePMMapBtnHovOffFunc(18));
										
			$('#PMMapBtnBarNeut').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(0));
			$('#PMMapBtnBarDur').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(1));
			$('#PMMapBtnBarTrit').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(2));
			$('#PMMapBtnBarMoly').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(3));
			$('#PMMapBtnBarName').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(4));
			$('#PMMapBtnBarTemp').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(5));
			$('#PMMapBtnBarCols').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(6));
			$('#PMMapBtnBarNats').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(7));
			$('#PMMapBtnBarColTax').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(8));
			$('#PMMapBtnBarNatTax').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(9));
			$('#PMMapBtnBarSup').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(10));
			$('#PMMapBtnBarMC').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(11));
			$('#PMMapBtnBarBM').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(12));
			$('#PMMapBtnBarFact').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(13));
			$('#PMMapBtnBarMines').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(14));
			$('#PMMapBtnBarDP').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(15));
			$('#PMMapBtnBarSBBuild').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(16));
			$('#PMMapBtnBarSBTech').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(17));
			//$('#PMMapBtnBarSBDef').click(vgap.plugins["plManagerPlugin"].makePMMapBtnClickFunc(18));
			
			/*
			 * Code to animate in the map draw functions; saving for a future release
			$('#PMMapBtnBarNats').click(function() {
				vgap.hotkeysOn = false;
				$('#PlanetsLoc').animate(
					{
						// 68 planetloc, 52 width on mapbtn, 6px on right; new menu 26px, lets give 4 px buffer
						right:'98px'
					},400);
				$('#PMMapBtnBar').animate(
					{
						// 68 planetloc, 52 width on mapbtn, 6px on right; new menu 26px, lets give 4 px buffer
						right:'36px'
					},400);
				$('#PMMapDrawBar').animate(
					{
						right:'6px'
					},400);
				});
			*/
			/*
			var mapdrawmenuhtml = ""
			mapdrawmenuhtml += '<div id="PMMapDrawBar">Draw';
			mapdrawmenuhtml += '<hr />General<span class="PMDrawBtn" id="PMMapBtnBarName"><img title="Planet Names" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[0].src + '"></img></span>';
			mapdrawmenuhtml += '<span class="PMDrawBtn" id="PMDrawBtnSelect"><img title="Select" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[2].src + '"></img></span>';
			mapdrawmenuhtml += '<span class="PMDrawBtn" id="PMDrawBtnMove"><img title="Move" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[0].src + '"></img></span>';
			mapdrawmenuhtml += '<span class="PMDrawBtn" id="PMDrawBtnCircle"><img title="Circle" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[1].src + '"></img></span>';
			mapdrawmenuhtml += '<span class="PMDrawBtn" id="PMDrawBtnRect"><img title="Rectangle" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[2].src + '"></img></span>';
			mapdrawmenuhtml += '<span class="PMDrawBtn" id="PMDrawBtnArrow"><img title="Arrow" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[3].src + '"></img></span>';
			mapdrawmenuhtml += '<span class="PMMapBtn" id="PMDrawBtnTarget"><img title="Target" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[0].src + '"></img></span>';
			mapdrawmenuhtml += '<span class="PMDrawBtn" id="PMDrawBtnLine"><img title="Line" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[2].src + '"></img></span>';
			mapdrawmenuhtml += '<hr /><hr /><span class="PMDrawBtn" id="PMDrawBtnDone"><img title="Done" src="' + vgap.plugins["plManagerPlugin"].pmmiNormal[2].src + '"></img></span>';
			mapdrawmenuhtml += '<hr /></div>';
			
			$(mapdrawmenuhtml).appendTo(vgap.container);
			
			$('#PMDrawBtnDone').click(function() {
				vgap.hotkeysOn = false;
				$('#PlanetsLoc').animate(
					{
						// 68 planetloc, 52 width on mapbtn, 6px on right; new menu 26px, lets give 4 px buffer
						right:'68px'
					},400);
				$('#PMMapBtnBar').animate(
					{
						// 68 planetloc, 52 width on mapbtn, 6px on right; new menu 26px, lets give 4 px buffer
						right:'6px'
					},400);
				$('#PMMapDrawBar').animate(
					{
						right:'-28px'
					},400);
				});
				
			$('#PMDrawBtnLine').click(function() {
				console.log("Line button clicked");
				var start_mouse = {x: 0, y: 0};
				vgap.map.canvas.addEventListener('mousedown', function(e) {
					vgap.map.canvas.addEventListener('mousemove', plg.PMonPaint, false);
 
					mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
					mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
 
					start_mouse.x = mouse.x;
					start_mouse.y = mouse.y;
 
					plg.PMonPaint();
				}, false);
		  
			});
		*/
		
			
		},
		
		PMonPaint: function() {
			// Tmp canvas is always cleared up before drawing.
			console.log('Onpaint called.');
				var oldctx = vgap.map.ctx
				var ctx = vgap.map.ctx;
				ctx.lineWidth = 5;
				ctx.lineJoin = 'round';
				ctx.lineCap = 'round';
				ctx.strokeStyle = 'blue';
				//ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
			 
				ctx.beginPath();
				ctx.moveTo(start_mouse.x, start_mouse.y);
				ctx.lineTo(mouse.x, mouse.y);
				ctx.stroke();
				ctx.closePath();
				
				vgap.map.ctx = oldctx;
		},
		
		
        makePMMapBtnHovOnFunc: function(overlaypos) {
			function hovonfunc() {
				vgap.plugins["plManagerPlugin"].saveAndClearOverlay();
                vgap.plugins["plManagerPlugin"].pmmcOverlay[overlaypos] = true;
                $("img", this).attr('src', vgap.plugins["plManagerPlugin"].pmmiHover[overlaypos].src);
                vgap.map.draw();
			}
			return hovonfunc;
		},
		
		makePMMapBtnHovOffFunc: function(overlaypos) {
			function hovofffunc() {
				vgap.plugins["plManagerPlugin"].restoreOverlay();
				if (!vgap.plugins["plManagerPlugin"].pmmcOverlay[overlaypos]) {
					$("img", this).attr('src', vgap.plugins["plManagerPlugin"].pmmiNormal[overlaypos].src);
				}
				vgap.map.draw();
			}
			return hovofffunc;
		},
				
        makePMMapBtnClickFunc: function(overlaypos) {
			function clickfunc() {
				setval = !vgap.plugins["plManagerPlugin"].pmmcLastOverlay[overlaypos];
				vgap.plugins["plManagerPlugin"].saveOverlay();
				vgap.plugins["plManagerPlugin"].pmmcLastOverlay[overlaypos] = setval;
				vgap.plugins["plManagerPlugin"].setAllBtnPics();
			}
			return clickfunc;
		},
		
        /*
			 * draw: executed on any click or drag on the starmap
			 */			
        draw: function() {
            //console.log("Draw: plManagerPlugin plugin called.");
            if (vgap.plugins["plManagerPlugin"].pmmOvAct) {
				//vgap.plugins["plManagerPlugin"].displayPMMapMenu();
				vgap.plugins["plManagerPlugin"].mpdraw_overlay();
			}
            
        },		
        
        // Draw functions here
        mpdraw_overlay: function() {
			oldctx = vgap.map.ctx
            oldfill = vgap.map.ctx.fillStyle;
            oldfont = vgap.map.ctx.font;
            var plg = vgap.plugins["plManagerPlugin"];
            
            for (var i = 0; i < vgap.planets.length; i++) {
				var planet = vgap.planets[i];
				
				var startx = 0
				var starty = 0
				
				//console.log("Old Font: " + oldfont);
				if (vgap.map.isVisible(planet.x, planet.y, vgap.map.planetRad(planet)) && planet.molybdenum > -1) {
					//console.log("Planet Visible: " + planet.name)
					//var left = vgap.map.screenX(planet.x); // + 10;
					//var top = vgap.map.screenY(planet.y); // - 15;
					//$("<div class='PMMapPlanetSup' style='left:" + left + "px;top:" + top + "px;'>" + planet.id + ": " + planet.supplies + "</div>").appendTo(vgap.map.container);
					ctx = vgap.map.ctx;
					ctx.fillStyle = "white";
					//console.log("ZOOM: " + vgap.map.zoom);
					txtsize = Math.min(Math.round(vgap.map.zoom*9.3),20)
					
					ctx.font = "bold " + txtsize + "px Arial";
					var fillstr = "";
					//console.log("Looking for fillstr: pmmNeut = " + plg.pmmNeut);
					/*
					function texter(str, x, y){
    for(var i = 0; i <= str.length; ++i){
        var ch = str.charAt(i);
        ctx.fillStyle = randomColor();
        ctx.fillText(ch, x, y);
        x += ctx.measureText(ch).width;
    }
    * 
    * 
    * reshtml += "<tr><td class='ResName' align='right'>Dur</td>";
                            reshtml += "<td class='ResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.duranium) + "; padding-left=0.5ex'>" + planet.duranium + "&nbsp;" + "</td>";
                            reshtml += "<td class='ResGrd' align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundduranium) + ";'><b> /&nbsp;" + planet.groundduranium + "</b></td>";
                            reshtml += "<td class='ResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densityduranium) + ";'>" + planet.densityduranium + "%</td>";
                            reshtml += "<td class='ResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundduranium, planet.densityduranium) + "</td></tr>";
    */
					
					if (plg.pmmcOverlay[0]) {
						fillstr = planet.id + ": " + planet.neutronium + " / " + planet.groundneutronium + " (" + planet.densityneutronium + "%)";
					}
					else if (plg.pmmcOverlay[1]) {
						fillstr = planet.id + ": " + planet.duranium + " / " + planet.groundduranium + " (" + planet.densityduranium + "%)";
					}
					else if (plg.pmmcOverlay[2]) {
						fillstr = planet.id + ": " + planet.tritanium + " / " + planet.groundtritanium + " (" + planet.densitytritanium + "%)";
					}
					else if (plg.pmmcOverlay[3]) {
						fillstr = planet.id + ": " + planet.molybdenum + " / " + planet.groundmolybdenum + " (" + planet.densitymolybdenum + "%)";
					}
					//fillstr = planet.id + ": " + planet.molybdenum + "/" + planet.groundmolybdenum + " (" + planet.densitymolybdenum + "%)";
					//fillstr = planet.id + ": (" + planet.x + "," + planet.y + ")";
					else if (plg.pmmcOverlay[4]) {
						fillstr = planet.id + ": " + planet.name + " (" + planet.temp + ")";
					}
					
					else if (plg.pmmcOverlay[5]) {
						fillstr = planet.id + ": " + planet.temp;
					}
					
					else if (plg.pmmcOverlay[6]) {
						// Colonist overlay
						fillstr = planet.id + ": " + plg.nwc(planet.clans) + " / " + plg.nwc(plg.getMaxColonists(planet,false)) + " (" + plg.nwc(plg.myColPopGrowth(planet,false)) + ")";
					}
					
					else if (plg.pmmcOverlay[7]) {
						// Native overlay
						if (planet.nativeclans > 0) {
							fillstr = planet.id + ": " + planet.nativeracename.substring(0,3).toUpperCase() + " [" + planet.nativetaxvalue + "%] " + plg.nwc(planet.nativeclans) + " / " + plg.nwc(plg.getMaxNatives(planet,false)) + " (" + plg.nwc(plg.myNatPopGrowth(planet,false)) + ")";
						}
						else {
							fillstr = "";
						}
					}
					
					else if (plg.pmmcOverlay[8]) {
						// Colonist Tax overlay
						
						var methodindex = plg.ctarray[planet.id];
						var methodname = "Manual";
						if (methodindex != 'm')
                                methodname = plg.taxmethods[methodindex].name;
						fillstr = planet.id + ": " + methodname + " - " + planet.colonisttaxrate + "% - " + planet.colonisthappypoints.toString().trim() + " " + plg.happyChgTxt(vgap.colonistTaxChange(planet)) + " " + plg.colTaxAmtTxt(planet);
					}
					
					else if (plg.pmmcOverlay[9]) {
						// Native Tax overlay
						if (planet.nativeclans > 0) {
							var methodindex = plg.ntarray[planet.id];
							var methodname = "Manual";
							if (methodindex != 'm')
								methodname = plg.taxmethods[methodindex].name;
							fillstr = planet.id + ": " + methodname + " - " + planet.nativetaxrate + "% - " + planet.nativehappypoints.toString().trim() + " " + plg.happyChgTxt(vgap.nativeTaxChange(planet)) + " " + plg.natTaxAmtTxt(planet);
						}
						else {
							fillstr = "";
						}
					}
					
					else if (plg.pmmcOverlay[10]) {
						// Supplies
						if (planet.supplies >= 0) {
							fillstr = planet.id + ": Supplies: " + planet.supplies + " [" + (planet.supplies+planet.megacredits) + "]";
						}
						else {
							fillstr = "";
						}
					}
					
					else if (plg.pmmcOverlay[11]) {
						// Megacredits
						if (planet.megacredits >= 0) {
							fillstr = planet.id + ": MC: " + planet.megacredits + " [" + (planet.supplies+planet.megacredits) + "]";
						}
						else {
							fillstr = "";
						}
					}
					else if (plg.pmmcOverlay[12]) {	
						// Build Method
						var methodindex = plg.bmarray[planet.id];
						var methodname = "Manual";
						if (methodindex != 'm')
                                methodname = plg.buildmethods[methodindex][0];
						
						fillstr = planet.id + ": " + methodname + " [F: (+" + planet.builtfactories + ") M: (+" + planet.builtmines + ") D: (+" + planet.builtdefense + ")]";
					}
					
					else if (plg.pmmcOverlay[13]) {
						// Factories
						fillstr = planet.id + ": Factories - " + planet.factories + "/" + plg.maxBldgs(planet,100) + " [+" + planet.builtfactories + "]";
					}
					
					else if (plg.pmmcOverlay[14]) {
						// Mines
						fillstr = planet.id + ": Mines - " + planet.mines + "/" + plg.maxBldgs(planet,200) + " [+" + planet.builtmines + "]";
					}
					
					else if (plg.pmmcOverlay[15]) {
						// Defense
						fillstr = planet.id + ": Defense - " + planet.defense + "/" + plg.maxBldgs(planet,50) + " [+" + planet.builtdefense + "]";
					}
					
					else if (plg.pmmcOverlay[16]) {
						// SB Building
						var starbase = vgap.getStarbase(planet.id);
						if (starbase != null) {
							if (starbase.isbuilding) {
								fillstr = planet.id + ": " + planet.friendlycode + " " + vgap.getHull(starbase.buildhullid).name + " - " + starbase.buildengineid + "/" + starbase.buildbeamid + "/" + starbase.buildtorpedoid;
							}
							else {
								// The starbase isn't building anything
								fillstr = planet.id + ": None";
							}
						}
						else {
							fillstr = "";
						}
					}
					
					else if (plg.pmmcOverlay[17]) {
						// SB Tech Levels
						var starbase = vgap.getStarbase(planet.id);
						if (starbase != null) {
							fillstr = planet.id + ": " + starbase.hulltechlevel + "/" + starbase.enginetechlevel + "/" + starbase.beamtechlevel + "/" + starbase.torptechlevel + " " + starbase.defense + "/" + starbase.fighters + "/" + starbase.damage;
						}
						else {
							fillstr = "";
						}
					}
					
					
					else {
						fillstr = planet.id + ": (" + planet.name + ")";
					}
					text_width = ctx.measureText(fillstr).width;
					// Check if the string is going to overlap a planet
					fliptext = false;
					for (var j = 0; j < vgap.planets.length; j++) {
						if ((vgap.map.isVisible(vgap.planets[j].x, vgap.planets[j].y, vgap.map.planetRad(vgap.planets[j]))) &&
							(vgap.map.screenY(vgap.planets[j].y) < vgap.map.screenY(planet.y) + txtsize) && 
							(vgap.map.screenY(vgap.planets[j].y) > vgap.map.screenY(planet.y) - txtsize) &&
							(vgap.map.screenX(vgap.planets[j].x) > vgap.map.screenX(planet.x)) &&
							(vgap.map.screenX(vgap.planets[j].x) < vgap.map.screenX(planet.x) + text_width)) {
								//console.log("Flipping id " + planet.id + " due to " + vgap.planets[j].id);
								fliptext = true;
								
						//if ((vgap.planets[j].y < planet.y + txtsize) && (vgap.planets[j].y < planet.y - txtsize)) {
						//	if ((vgap.planets[j].x > planet.x) && vgap.planets[j].x < planet.x + 15 + text_width) {
								// The text is going to overlap a planet.  Flip it to the other side.
						//		fliptext = true;
						//	}
						//}
						}
					}
					if (fliptext == false) {
						//ctx.fillText(fillstr, vgap.map.screenX(planet.x)+(3*vgap.map.planetRad(planet)/2), vgap.map.screenY(planet.y)+vgap.map.planetRad(planet)/2);
						startx = vgap.map.screenX(planet.x)+(3*vgap.map.planetRad(planet)/2);
						starty = vgap.map.screenY(planet.y)+vgap.map.planetRad(planet)/2; 
					}
					else {
						// Flip text is true.  If we did a flip, lets check for persistent overlap due to planets being right next to one another
						var yoff = 0
						for (var j = 0; j < vgap.planets.length; j++) {
							if ((vgap.map.isVisible(vgap.planets[j].x, vgap.planets[j].y, vgap.map.planetRad(vgap.planets[j]))) &&
								(vgap.map.screenY(vgap.planets[j].y) < vgap.map.screenY(planet.y) + txtsize) && 
								(vgap.map.screenY(vgap.planets[j].y) > vgap.map.screenY(planet.y) - txtsize) &&
								(vgap.map.screenX(vgap.planets[j].x) < vgap.map.screenX(planet.x)) &&
								(vgap.map.screenX(vgap.planets[j].x) > vgap.map.screenX(planet.x) - text_width)) {
								// A collision.  Determine if we should scoot the text up or scoot it down:
								//console.log("Applying yoffset for " + planet.id + " due to " + vgap.planets[j].id);
								if (vgap.map.screenY(vgap.planets[j].y) < vgap.map.screenY(planet.y)) {
									// The other planet is below us.  Scoot up:
									yoff = txtsize/2;
								}
								else {
									yoff = -txtsize/2;
								}
								//console.log("Applying yoffset for " + planet.id + " due to " + vgap.planets[j].id + ": yoff = " + yoff);
							}
						}
						//ctx.fillText(fillstr, vgap.map.screenX(planet.x)-(3*vgap.map.planetRad(planet)/2)-text_width, vgap.map.screenY(planet.y)+yoff+vgap.map.planetRad(planet)/2 );
						startx = vgap.map.screenX(planet.x)-(3*vgap.map.planetRad(planet)/2)-text_width;
						starty = vgap.map.screenY(planet.y)+yoff+vgap.map.planetRad(planet)/2; 
					}
				}
				
				// Execute text fill
				if (plg.pmmcOverlay[0]) {
					plg.mp_mineraltextfill(ctx,planet.id,planet.neutronium,planet.groundneutronium,planet.densityneutronium,startx,starty)
				}
				else if (plg.pmmcOverlay[1]) {
					plg.mp_mineraltextfill(ctx,planet.id,planet.duranium,planet.groundduranium,planet.densityduranium,startx,starty)
				}
				else if (plg.pmmcOverlay[2]) {
					plg.mp_mineraltextfill(ctx,planet.id,planet.tritanium,planet.groundtritanium,planet.densitytritanium,startx,starty)
				}
				else if (plg.pmmcOverlay[3]) {
					plg.mp_mineraltextfill(ctx,planet.id,planet.molybdenum,planet.groundmolybdenum,planet.densitymolybdenum,startx,starty)
				}
				else if (plg.pmmcOverlay[4]) {
					//ctx.fillText(fillstr, startx, starty);
					ctx.fillText(planet.id + ": ", startx, starty);
					startx += ctx.measureText(planet.id + ": ").width;
					
					ctx.fillText(planet.name, startx, starty);
					startx += ctx.measureText(planet.name).width;
					
					rchan = 0;
					gchan = 0;
					bchan = 0;
					
					if (planet.temp <= 50) rchan = 0
					else rchan = Math.round((((planet.temp - 50) / 50) * 255));
					
					if (planet.temp <= 50) gchan = Math.round((((planet.temp) / 50) * 255));
					else gchan = Math.round(255 - (((planet.temp - 50) / 50) * 255));
					
					if (planet.temp >= 50) bchan = 0
					else bchan = Math.round(255 - (((planet.temp) / 50) * 255));
					
					ctx.fillStyle = "rgba("+rchan+","+gchan+","+bchan+",1)";
					 
					ctx.fillText(" (" + planet.temp + ")", startx,starty);
				}
				else if (plg.pmmcOverlay[5]) {
					ctx.fillText(planet.id + ": ", startx, starty);
			
					startx += ctx.measureText(planet.id + ": ").width;
					fcu = planet.friendlycode.toUpperCase();
							if (fcu == "NUK" || fcu == "ATT") ctx.fillStyle = "red";
							else if (fcu == "BUM") ctx.fillStyle = "orchid";
							else if (fcu == "DMP") ctx.fillStyle = "magenta";
							else if (fcu.substr(0, 2) == "PB") ctx.fillStyle = "aqua";
							
							ctx.fillText(planet.friendlycode + " ", startx, starty);
				}
				else if (plg.pmmcOverlay[6]) {
					plg.mp_clantextfill(ctx,planet.id,planet.clans,plg.getMaxColonists(planet,false),plg.myColPopGrowth(planet,false), startx,starty)
				}
				
				else if (plg.pmmcOverlay[7]) {
					if (planet.nativeclans > 0) {
						plg.mp_natclantextfill(ctx,planet.id,planet.nativeracename.substring(0,3).toUpperCase(),planet.nativetaxvalue,planet.nativeclans,plg.getMaxNatives(planet,false),plg.myNatPopGrowth(planet,false), startx,starty)
					}
				}
				else if (plg.pmmcOverlay[8]) {
					var methodindex = plg.ctarray[planet.id];
					var methodname = "Manual";
					if (methodindex != 'm') {
						methodname = plg.taxmethods[methodindex].name;
					}
					
					plg.mp_coltaxmethtextfill(ctx,planet.id,methodname, planet.colonisttaxrate, planet.colonisthappypoints, plg.happyChgTxt(vgap.colonistTaxChange(planet)), plg.colTaxAmtTxt(planet),  startx,starty)
				}
				
				else if (plg.pmmcOverlay[9]) {
					if (planet.nativeclans > 0) {
						var methodindex = plg.ntarray[planet.id];
						var methodname = "Manual";
						if (methodindex != 'm') {
							methodname = plg.taxmethods[methodindex].name;
						}
					
						plg.mp_coltaxmethtextfill(ctx,planet.id,methodname, planet.nativetaxrate, planet.nativehappypoints, plg.happyChgTxt(vgap.nativeTaxChange(planet)), plg.natTaxAmtTxt(planet),  startx,starty)
					}
				}
				else if (plg.pmmcOverlay[10]) {
					// Supplies
					if (planet.supplies >= 0) {
						ctx.fillText(planet.id + ": Supplies: ", startx, starty);
						startx += ctx.measureText(planet.id + ": Supplies: ").width;
						
						rchan = 0;
						gchan = 255;
						bchan = 0;
						
						rchan = Math.round(255-((planet.supplies / 1500) * 255));
						gchan = Math.round(127+Math.min((planet.supplies / 1500) * 128),128);
						
						
						ctx.fillStyle = "rgba("+rchan+","+gchan+","+bchan+",1)";
						 
						ctx.fillText(planet.supplies, startx,starty);
						startx += ctx.measureText(planet.supplies).width;
						
						rchan = Math.round(255-(((planet.supplies+planet.megacredits) / 1500) * 255));
						gchan = Math.round(127+Math.min(((planet.supplies+planet.megacredits) / 1500) * 128),128);
						ctx.fillStyle = "rgba("+rchan+","+gchan+","+bchan+",1)";
						 
						ctx.fillText(" [" + (planet.supplies+planet.megacredits) + "]", startx,starty);
					}
				}
				
				else if (plg.pmmcOverlay[11]) {
					// Megacredits
					if (planet.megacredits >= 0) {
						ctx.fillText(planet.id + ": Megacredits: ", startx, starty);
						startx += ctx.measureText(planet.id + ": Megacredits: ").width;
						
						rchan = 0;
						gchan = 255;
						bchan = 0;
						
						rchan = Math.round(255-((planet.megacredits / 1500) * 255));
						gchan = Math.round(127+Math.min((planet.megacredits / 1500) * 128),128);
						
						
						ctx.fillStyle = "rgba("+rchan+","+gchan+","+bchan+",1)";
						 
						ctx.fillText(planet.megacredits, startx,starty);
						startx += ctx.measureText(planet.megacredits).width;
						
						rchan = Math.round(255-(((planet.supplies+planet.megacredits) / 1500) * 255));
						gchan = Math.round(127+Math.min(((planet.supplies+planet.megacredits) / 1500) * 128),128);
						ctx.fillStyle = "rgba("+rchan+","+gchan+","+bchan+",1)";
						 
						ctx.fillText(" [" + (planet.supplies+planet.megacredits) + "]", startx,starty);
					}
				}
				
				else if (plg.pmmcOverlay[12]) {
					// Build Method
					ctx.fillText(fillstr, startx, starty);
				}
				
				else if (plg.pmmcOverlay[13]) {
					// Factories
					plg.mp_structtextfill(ctx,planet.id,"Factories",planet.factories,plg.maxBldgs(planet,100), planet.builtfactories,startx,starty)
				}
				
				else if (plg.pmmcOverlay[14]) {
					// Mines
					plg.mp_structtextfill(ctx,planet.id,"Mines",planet.mines,plg.maxBldgs(planet,200), planet.builtmines,startx,starty)
				}
				
				else if (plg.pmmcOverlay[15]) {
					// Defense
					plg.mp_structtextfill(ctx,planet.id,"Defense",planet.defense,plg.maxBldgs(planet,50), planet.builtdefense,startx,starty)
				}
				
				else if (plg.pmmcOverlay[16]) {
					// Starbase Build
					//ctx.fillText(fillstr, startx, starty);
					
					var starbase = vgap.getStarbase(planet.id);
					if (starbase != null) {
						ctx.fillText(planet.id + ": ", startx, starty);
						startx += ctx.measureText(planet.id + ": ").width;
						
						if (starbase.isbuilding) {
							fcu = planet.friendlycode.toUpperCase();
							if (fcu == "NUK" || fcu == "ATT") ctx.fillStyle = "red";
							else if (fcu == "BUM") ctx.fillStyle = "orchid";
							else if (fcu == "DMP") ctx.fillStyle = "magenta";
							else if (fcu.substr(0, 2) == "PB") ctx.fillStyle = "aqua";
							
							ctx.fillText(planet.friendlycode + " ", startx, starty);
							startx += ctx.measureText(planet.friendlycode + " ").width;
							
							ctx.fillStyle = "#00FF00";
							//fillstr = planet.id + ": " + vgap.getHull(starbase.buildhullid).name + " - " + starbase.buildengineid + "/" + starbase.buildbeamid + "/" + starbase.buildtorpedoid;
							ctx.fillText(vgap.getHull(starbase.buildhullid).name, startx, starty);
							startx += ctx.measureText(vgap.getHull(starbase.buildhullid).name).width;
							
							ctx.fillStyle = "#FFFFFF";
							ctx.fillText(" - " + starbase.buildengineid + "/" + starbase.buildbeamid + "/" + starbase.buildtorpedoid, startx, starty);
						}
						else {
							ctx.fillStyle = "#F62817";
							ctx.fillText("None", startx, starty);
						}
					}
				}
				
				else if (plg.pmmcOverlay[17]) {
					// Starbase Tech and Defense
					ctx.fillText(fillstr, startx, starty);
				}
				
				else {
					fillstr = planet.id + ": (" + planet.name + ")";
				}
				
				//ctx.fillText(fillstr, startx, starty);
			}
			vgap.map.ctx = oldctx;
			vgap.map.ctx.fillStyle = oldfill;
			vgap.map.ctx.font = oldfont;
			
		},
        
        mp_mineraltextfill: function(ctx,id,surface,ground,density,x,y) {
			
			var plg = vgap.plugins["plManagerPlugin"];
			ctx.fillText(id + ": ", x, y);
			
			x += ctx.measureText(id + ": ").width;
			ctx.fillStyle = plg.getMineralSfcColor(surface);
			ctx.fillText(surface, x,y); 
			
			x += ctx.measureText(surface).width;
			ctx.fillStyle = plg.getMineralGrdColor(ground);
			ctx.fillText(" / " + ground, x, y);
			
			x += ctx.measureText(" / " + ground).width;
			ctx.fillStyle = plg.getMineralDenColor(density);
			ctx.fillText(" (" + density + "%)", x, y);
		},
		
		mp_clantextfill: function(ctx,id,clans,maxclans,growthclans,x,y) {
			
			var plg = vgap.plugins["plManagerPlugin"];
			ctx.fillText(id + ": ", x, y);
			
			x += ctx.measureText(id + ": ").width;
			if (growthclans < 0) {
				ctx.fillStyle = "#F62817"
			}
			else if (clans > maxclans) {
				ctx.fillStyle = "#FF6600"
			}
			else {
				ctx.fillStyle = "#00FF00"
			}
			
			ctx.fillText(plg.nwc(clans), x,y); 
			
			x += ctx.measureText(plg.nwc(clans)).width;
			ctx.fillStyle = "#FFFFFF"
			ctx.fillText(" / " + plg.nwc(maxclans), x, y);
			x += ctx.measureText(" / " + plg.nwc(maxclans)).width;
			ctx.fillText(" (" + plg.nwc(growthclans) + ")", x, y);
		},
		
		mp_natclantextfill: function(ctx,id,natname,nattaxval,clans,maxclans,growthclans,x,y) {
			
			var plg = vgap.plugins["plManagerPlugin"];
			ctx.fillText(id + ": ", x, y);
			
			x += ctx.measureText(id + ": ").width;
			
			
			ctx.fillText(natname, x, y);
			x += ctx.measureText(natname).width;
			
			// Calculate the rgb color for the tax value
			// 20% red, 180% green, through yellow
			// Red: 255,0,0
			// Yellow: 255, 255, 0
			// Green: 0,255,0
			
			rchan = 0
			gchan = 0
			
			if (nattaxval <= 100) {
				rchan = 255;
			}
			else {
				rchan = Math.round(255 - (((nattaxval - 100) / 80) * 255));
			}
			
			if (nattaxval >= 100) {
				gchan = 255;
			}
			else {
				gchan = Math.round(((nattaxval - 20) / 80) * 255);
			}
			//console.log("nattax, rgba: " + nattaxval + " , " + rchan + " , " + gchan);
			ctx.fillStyle = "rgba("+rchan+","+gchan+",0,1)";
			
			ctx.fillText(" [" + nattaxval + "%] ", x, y);
			x += ctx.measureText(" [" + nattaxval + "%] ").width;
			
			if (growthclans < 0) {
				ctx.fillStyle = "#F62817"
			}
			else if (clans > maxclans) {
				ctx.fillStyle = "#FF6600"
			}
			else {
				ctx.fillStyle = "#00FF00"
			}
			ctx.fillText(plg.nwc(clans), x,y); 
			
			x += ctx.measureText(plg.nwc(clans)).width;
			ctx.fillStyle = "#FFFFFF"
			ctx.fillText(" / " + plg.nwc(maxclans), x, y);
			x += ctx.measureText(" / " + plg.nwc(maxclans)).width;
			ctx.fillText(" (" + plg.nwc(growthclans) + ")", x, y);
		},
		
		mp_coltaxmethtextfill: function(ctx,id,methodname,coltaxpct,colhappy,colhappychg,coltaxtxt,x,y) {
			
			var plg = vgap.plugins["plManagerPlugin"];
			ctx.fillText(id + ": ", x, y);
			
			x += ctx.measureText(id + ": ").width;
			
			ctx.fillText(methodname + " - ", x,y); 
			x += ctx.measureText(methodname + " - ").width;
			
			ctx.fillText(coltaxpct + "% - ", x,y); 
			x += ctx.measureText(coltaxpct + "% - ").width;
			
			
			if (colhappy < 40) {
				ctx.fillStyle = "#F62817"
			}
			else if (colhappy < 70) {
				ctx.fillStyle = "#FF6600"
			}
			else {
				ctx.fillStyle = "#00FF00"
			}
			
			ctx.fillText(colhappy.toString().trim() + " ",x,y)
			x += ctx.measureText(colhappy + " ").width;
			
			ctx.fillStyle = "#FFFFFF"
			ctx.fillText(colhappychg,x,y)
			x += ctx.measureText(colhappychg).width;
			ctx.fillStyle = "#D3D3D3"
			ctx.fillText(" " + coltaxtxt,x,y)
		},
		
		mp_structtextfill: function(ctx,id,strname,struct,maxstruct,builtstruct,x,y) {
			
			var plg = vgap.plugins["plManagerPlugin"];
			ctx.fillText(id + ": ", x, y);
			
			x += ctx.measureText(id + ": ").width;
			
			ctx.fillText(strname + " - ", x,y); 
			x += ctx.measureText(strname + " - ").width;
			
			if (struct > maxstruct) {
				ctx.fillStyle = "#F62817"
			}
			else {
				ctx.fillStyle = "#00FF00"
			}
			
			ctx.fillText(struct, x,y); 
			x += ctx.measureText(struct).width;
			
			ctx.fillStyle = "#FFFFFF"
			ctx.fillText(" / " + maxstruct,x,y)
			x += ctx.measureText(" / " + maxstruct).width;
			
			ctx.fillStyle = "#D3D3D3"
			ctx.fillText(" [+" + builtstruct + "]",x,y)
		},
		
		saveOverlay: function() {
			vgap.plugins["plManagerPlugin"].pmmcLastOverlay = vgap.plugins["plManagerPlugin"].pmmcOverlay;
		},
		
		saveAndClearOverlay: function() {
			vgap.plugins["plManagerPlugin"].pmmcLastOverlay = vgap.plugins["plManagerPlugin"].pmmcOverlay;
			vgap.plugins["plManagerPlugin"].pmmcOverlay = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
		},
		
		clearLastOverlay: function() {
			vgap.plugins["plManagerPlugin"].pmmcLastOverlay = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
		},
		
		setAllBtnPics: function() {
			var plg = vgap.plugins["plManagerPlugin"];
			for (var i=0; i<vgap.plugins["plManagerPlugin"].pmmBtns.length; i++) {
				if (plg.pmmcLastOverlay[i]) {
					$("img", plg.pmmBtns[i]).attr('src', plg.pmmiHover[i].src);
				}
				else {
					$("img", plg.pmmBtns[i]).attr('src', plg.pmmiNormal[i].src);
				}
			}
		},
		
		restoreOverlay: function() {
			vgap.plugins["plManagerPlugin"].pmmcOverlay = vgap.plugins["plManagerPlugin"].pmmcLastOverlay;
		},
		/*
		mp_clearClickOverlay: function() {
			vgap.plugins["plManagerPlugin"].pmmcLastOverlay = vgap.plugins["plManagerPlugin"].pmmcOverlay;
			vgap.plugins["plManagerPlugin"].pmmcOverlay = [false,false,false,false];
		},
		
		mp_restoreClickOverlay: function() {
			vgap.plugins["plManagerPlugin"].pmmcOverlay = vgap.plugins["plManagerPlugin"].pmmcLastOverlay;
		},
		*/
        /*
			 * loadplanet: executed a planet is selected on dashboard or starmap
			 */
        loadplanet: function() {
            //console.log("LoadPlanet: plManagerPlugin plugin called.");
            
            //vgap.plugins["plManagerPlugin"].showBldgs();
            //$('<div id="PDBar" class="SepBar"><div id="PDBtn" class="SepButton">Planet Detail</div><div id="PDTitle" class="SepTitle">Planetary Management Plugin</div></div>').insertAfter('#MainFleetContainer');
            var plg = vgap.plugins["plManagerPlugin"];
            var planet = vgap.planetScreen.planet;
            
            var bmhtml = "";
            bmhtml += '<div id="PDBar" class="SepBar"><div id="PDBtn" class="SepButton">Planet Detail</div><div id="PDTitle" class="SepTitle">Planetary Management Plugin</div></div>';
            
            bmhtml += "<table id='MPPLBMTable'>";
                            bmhtml += "<thead></thead>";
                            bmhtml += "<tr><td>Build Method:</td><td>Colonist Tax:</td><td>Native Tax:</td>";
                            bmhtml += "<td rowspan = 2 align=center style='width: 45px; cursor:pointer;'><img class='BuildButton' align=center width=45px height=40px src='http://play.planets.nu/img/icons/blacksquares/planets.png'/></td></tr>";
                            bmhtml += "<tr><td><div> \
<select class='MPBMSelect' data-plid='" + planet.id + "'> \
<option value='m'>Manual</option>";
                            for (var k=0; k < plg.buildmethods.length; k++) {
                                bmhtml += "<option value='"+k+"'>" + plg.buildmethods[k][0] + "</option>";
                            }	
                            bmhtml += "</select></div></td>";		   
                            bmhtml += "<td><div> \
<select class='MPCTSelect' data-plid='" + planet.id + "'> \
<option value='m'>Manual</option>";
                            for (var k=0; k < plg.taxmethods.length; k++) {
                                if (plg.taxmethods[k].taxType == 'C' || plg.taxmethods[k].taxType == 'CN')
                                    bmhtml += "<option value='"+k+"'>" + plg.taxmethods[k].name + "</option>";
                            }	
                            bmhtml += "</select></div></td>";
                            
                            if (planet.nativeclans > 0)
                            {
                                bmhtml += "<td><div> \
<select class='MPNTSelect' data-plid='" + planet.id + "'> \
<option value='m'>Manual</option>";
                                for (var k=0; k < plg.taxmethods.length; k++) {
                                    if (plg.taxmethods[k].taxType == 'N' || plg.taxmethods[k].taxType == 'CN')
                                        bmhtml += "<option value='"+k+"'>" + plg.taxmethods[k].name + "</option>";
                                }	
                                bmhtml += "</select> \
</div> \
</td></tr>";
                                
                            }
                            bmhtml += "</table>";
             
            $(bmhtml).insertAfter('#MainFleetContainer');
            $('.MPBMSelect').each(function() {
                        $(this).val(plg.bmarray[$(this).attr('data-plid')]);
                    });                    
			$('.MPBMSelect').change(function() {
				plg.bmarray[$(this).attr('data-plid')] = $(this).attr('value');
				plg.saveObjectAsNote(0, plg.notetype, [plugin_version,plg.bmarray]);
			});
			$('.MPCTSelect').each(function() {
                        $(this).val(plg.ctarray[$(this).attr('data-plid')]);
                    });
                    
			$('.MPCTSelect').change(function() {
				//console.log("CT CHANGED!");
				plg.ctarray[$(this).attr('data-plid')] = $(this).attr('value');
				plg.saveObjectAsNote(2, plg.notetype, [plugin_version,plg.ctarray]);
			});
			
			$('.MPNTSelect').each(function() {
				$(this).val(plg.ntarray[$(this).attr('data-plid')]);
			});
			
			$('.MPNTSelect').change(function() {
				//console.log("NT CHANGED!");
				plg.ntarray[$(this).attr('data-plid')] = $(this).attr('value');
				plg.saveObjectAsNote(1, plg.notetype, [plugin_version,plg.ntarray]);
			});
            $('.BuildButton').click(function() {
                        //plg.executePlanetUpdate();
                        // Execute an update of this planet only
                        
                        // First, find the proper planetbuildindex
                        for (var i = 0; i < vgap.myplanets.length; i++)
                        {
							if (vgap.myplanets[i]==planet) {
								plg.planetbuildindex = i;
								console.log("BUILD INDEX FOUND: " + i);
							}
						}
						
                        plg.planetBuildBldgs();
                        // Handle AutoTax check box
						if (plg.ctarray[planet.id] != 'm' && plg.taxmethods[plg.ctarray[planet.id]].name == "Auto Tax") {
							planet.colchange = 1;
							planet.changed = 1;
							//console.log("Auto taxing on " + planet.name);
						} else {
							planet.colchange = 0;
							planet.changed = 1;
							vgap.plugins["plManagerPlugin"].planetSetTaxGeneral(false);
						}
		        
						planet.changed = 1;
						plg.planetbuildindex = 0;
						vgap.save();
                        vgap.planetScreen.screen.refresh();
                    });
           
            $('#PDBtn').click(function() {
                vgap.plugins["plManagerPlugin"].showPlanetDetailFromStarmap(vgap.planetScreen.planet.id);
            });
            vgap.plugins["plManagerPlugin"].displayPMMapMenu();
            vgap.map.draw();
        },
        
        /*
			 * loadstarbase: executed a starbase is selected on dashboard or starmap
			 */
        loadstarbase: function() {
            //console.log("LoadStarbase: plManagerPlugin plugin called.");
            vgap.plugins["plManagerPlugin"].displayPMMapMenu();
        },
        
        /*
			 * loadship: executed a ship is selected on dashboard or starmap
			 */
        loadship: function() {
            //console.log("LoadShip: plManagerPlugin plugin called.");
            vgap.plugins["plManagerPlugin"].displayPMMapMenu();
        },
        
        
        /*
			 * Variables
			 */
        curplanet: 0,
        
        planetbuildindex: 0,
        savedindex: -1,
        buildstatustext: 0,
        ambuilding: false,
        savestarted: false,
        bmarray: [],
        ntarray: [],
        ctarray: [],
        myplanetsarray: [],
        buildmethods: [],
        taxmethods: [],
        notetype: -174481,
        bmwizcode: "",
        bmwiztext: "",
        selTaxModel: "",
        pplanet: "",
        predictarray: [],
        predicttimes: {},
        readOrder: 1,
        pmviewcode: 0,
        parray: [],
        qb: 0,
        fcrandomize: true,
        overtax: true,
        
        
		// PM Map overlay variables
		pmmOvAct: true,
		pmmNeut: false,
		pmmDur: false,
		pmmTri: false,
		pmmMoly: false,
		pmmcNeut: false,
		pmmcDur: false,
		pmmcTri: false,
		pmmcMoly: false,
		
		pmmcOverlay: [],
		pmmcLastOverlay: [],
		pmmiNormal: [],
		pmmiHover: [],
		pmmBtns: [],
		pmmiExpImg: "",
		showOverlayMenu: true,
		
		// PM Map Image variables
		pmiNeutN: new Image(),
		pmiNeutH: new Image(),
		pmiDurN: new Image(),
		pmiDurH: new Image(),
		pmiTriN: new Image(),
		pmiTriH: new Image(),
		pmiMolyN: new Image(),
		pmiMolyH: new Image(),
        
        /* Main Display Function
			 */
        displayPM: function(view) {
            
            vgap.playSound("button");
            vgap.closeSecond();
            var plg = vgap.plugins["plManagerPlugin"];
            vgap.dash.content.empty();
            
            var html = "";
            
            if (!view)
                view = 0;
            if (debug) console.log("Entered displayPM, buildmethods is " + plg.buildmethods);
            var filterMenu = $("<ul class='FilterMenu'></ul>").appendTo(vgap.dash.content);
            $("<li " + (view == 0 ? "class='SelectedFilter'" : "") + ">Planetary Management View</li>").tclick(function() { vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(filterMenu);
            $("<li " + (view == 1 ? "class='SelectedFilter'" : "") + ">Planet Detail View</li>").tclick(function() { vgap.plugins["plManagerPlugin"].displayPM(1); }).appendTo(filterMenu);
            $("<li " + (view == 3 ? "class='SelectedFilter'" : "") + ">Build Methods</li>").tclick(function() { vgap.plugins["plManagerPlugin"].displayPM(3); }).appendTo(filterMenu);
            $("<li " + (view == 4 ? "class='SelectedFilter'" : "") + ">Taxation Methods</li>").tclick(function() { vgap.plugins["plManagerPlugin"].displayPM(4); }).appendTo(filterMenu);
            $("<li " + (view == 2 ? "class='SelectedFilter'" : "") + ">Help</li>").tclick(function() { vgap.plugins["plManagerPlugin"].displayPM(2); }).appendTo(filterMenu);
            
            //loop through all planets and show the ones owned by this player
            html = "<div class='DashPane' style='height:" + ($("#DashboardContent").height() - 70) + "px;'>";
            
            if (view == 0) {
                var PMBreak = $("<br /><br />").appendTo(vgap.dash.content);
                var PMfilterMenu = $("<ul class='FilterMenu'></ul>").appendTo(vgap.dash.content);
                $("<li " + (plg.pmviewcode == 0 ? "class='SelectedFilter'" : "") + ">All Planets</li>").tclick(function() { plg.pmviewcode = 0; vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(PMfilterMenu);
                $("<li " + (plg.pmviewcode == 1 ? "class='SelectedFilter'" : "") + ">Planets with all Manual Methods</li>").tclick(function() { plg.pmviewcode = 1; vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(PMfilterMenu);
                $("<li " + (plg.pmviewcode == 2 ? "class='SelectedFilter'" : "") + ">Planets with Natives</li>").tclick(function() { plg.pmviewcode = 2; vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(PMfilterMenu);
                $("<li " + (plg.pmviewcode == 3 ? "class='SelectedFilter'" : "") + ">Planets without Natives</li>").tclick(function() { plg.pmviewcode = 3; vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(PMfilterMenu);
                $("<li " + (plg.pmviewcode == 4 ? "class='SelectedFilter'" : "") + ">Planets with > 1mil Colonists</li>").tclick(function() { plg.pmviewcode = 4; vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(PMfilterMenu);
                $("<li " + (plg.pmviewcode == 5 ? "class='SelectedFilter'" : "") + ">Planets with No Build Method</li>").tclick(function() { plg.pmviewcode = 5; vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(PMfilterMenu);
                $("<li " + (plg.pmviewcode == 6 ? "class='SelectedFilter'" : "") + ">Planets with No Colonist Tax Method</li>").tclick(function() { plg.pmviewcode = 6; vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(PMfilterMenu);
                $("<li " + (plg.pmviewcode == 7 ? "class='SelectedFilter'" : "") + ">Planets with No Native Tax Method</li>").tclick(function() { plg.pmviewcode = 7; vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(PMfilterMenu);
                $("<li " + (plg.pmviewcode == 8 ? "class='SelectedFilter'" : "") + ">Planets with Completed Build Methods</li>").tclick(function() { plg.pmviewcode = 8; vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(PMfilterMenu);
                $("<li " + (plg.pmviewcode == 9 ? "class='SelectedFilter'" : "") + ">Planets with a Starbase</li>").tclick(function() { plg.pmviewcode = 9; vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(PMfilterMenu);
                $("<li " + (plg.pmviewcode == 10 ? "class='SelectedFilter'" : "") + ">Planets that can Build a Starbase</li>").tclick(function() { plg.pmviewcode = 10; vgap.plugins["plManagerPlugin"].displayPM(0); }).appendTo(PMfilterMenu);
                //$("</div>").appendTo(vgap.dash.content);
                
                
                plg.parray = [];
                
                if (plg.pmviewcode == 0)
                    plg.parray = vgap.myplanets;
                
                if (plg.pmviewcode == 1) {
                    for (var i = 0; i < vgap.myplanets.length; i++) {
                        var planet = vgap.myplanets[i];
                        if (plg.bmarray[planet.id] == 'm' && plg.ctarray[planet.id] == 'm')
                            if (planet.nativeclans > 0)
                                if (plg.ntarray[planet.id] == 'm') {
                                    plg.parray.push(planet);
                                }
                                else
                                    plg.parray.push(planet);
                            }
                }
                if (plg.pmviewcode == 2) {
                    for (var i = 0; i < vgap.myplanets.length; i++) {
                        var planet = vgap.myplanets[i];
                        if (planet.nativeclans > 0)
                            plg.parray.push(planet);
                    }
                }
                if (plg.pmviewcode == 3) {
                    for (var i = 0; i < vgap.myplanets.length; i++) {
                        var planet = vgap.myplanets[i];
                        if (planet.nativeclans == 0)
                            plg.parray.push(planet);
                    }
                }
                if (plg.pmviewcode == 4) {
                    for (var i = 0; i < vgap.myplanets.length; i++) {
                        var planet = vgap.myplanets[i];
                        if (planet.clans >= 10000)
                            plg.parray.push(planet);
                    }
                }
                if (plg.pmviewcode == 5) {
                    for (var i = 0; i < vgap.myplanets.length; i++) {
                        var planet = vgap.myplanets[i];
                        if (plg.bmarray[planet.id] == 'm')
                            plg.parray.push(planet);
                    }
                }
                if (plg.pmviewcode == 6) {
                    for (var i = 0; i < vgap.myplanets.length; i++) {
                        var planet = vgap.myplanets[i];
                        if (plg.ctarray[planet.id] == 'm')
                            plg.parray.push(planet);
                    }
                }
                if (plg.pmviewcode == 7) {
                    for (var i = 0; i < vgap.myplanets.length; i++) {
                        var planet = vgap.myplanets[i];
                        if (debug) console.log("Native view check: checking id = " + planet.id + ", method is " + plg.ntarray[planet.id] + ", nativeclans are " + planet.nativeclans);
                        if (planet.nativeclans > 0 && plg.ntarray[planet.id] == 'm') {
                            console.log("Pushing native planet..");
                            plg.parray.push(planet);
                        }
                    }
                }
                if (plg.pmviewcode == 8) {
                    for (var i = 0; i < vgap.myplanets.length; i++) {
                        var planet = vgap.myplanets[i];
                        if (plg.buildMethodCompleted(planet))
                            plg.parray.push(planet);
                    }
                }
                if (plg.pmviewcode == 9) {
                    for (var i = 0; i < vgap.myplanets.length; i++) {
                        var planet = vgap.myplanets[i];
                        if (vgap.getStarbase(planet.id) != null)
                            plg.parray.push(planet);
                    }
                }
                if (plg.pmviewcode == 10) {
                    for (var i = 0; i < vgap.myplanets.length; i++) {
                        var planet = vgap.myplanets[i];
                        if (planet.megacredits + planet.supplies >= 900 && planet.duranium >= 120 && planet.tritanium >= 402 && planet.molybdenum >= 340)
                            if (vgap.getStarbase(planet.id) == null)
                                plg.parray.push(planet);
                            if (planet.debrisdisk > 0 && planet.megacredits + planet.supplies >= 480 && planet.duranium >= 70 && planet.tritanium >= 242 && planet.molybdenum >= 160)
                                if (vgap.getStarbase(planet.id) == null)
                                    plg.parray.push(planet);
                                }
                }
                
                // Build Method Review Table
                var mrevhtml = "<table id = 'BMGSelTable'><tr><td colspan=2><b>Build Methods:</b><br /></td></tr>";
                mrevhtml += "<tr><td rowspan = 2><select name='BMGSelect' id='BMGSelect'>";
                //console.log("Populating select, buildmethods is " + plg.buildmethods + ", length is " + plg.buildmethods.length);
                
                // v3.0: Add manual to global application button
                mrevhtml += "<option value='m'>Manual</option>";
                for (var i=0; i < plg.buildmethods.length; i++) {
                    mrevhtml += "<option value='" + i + "'>" + plg.buildmethods[i][0] + "</option>";
                }
                
                mrevhtml += "</select></td></tr>";
                //mrevhtml += "<td id='BMMethText'>No Method Selected.</td></tr>";
                mrevhtml += "<tr><td><button id='BMGApplyBtn'>Apply to All</button></td></tr>";
                mrevhtml += "</table>";
                
                // Construct the colonist taxation method review pane
                var ctmrevhtml = "<table id = 'CTMGSelTable'><tr><td colspan=2><b>Colonist Taxation Methods:</b><br /></td></tr>";
                ctmrevhtml += "<tr><td rowspan = 2><select name='CTMGSelect' id='CTMGSelect'>";
                ctmrevhtml += "<option value='m'>Manual</option>";
                for (var i=0; i < plg.taxmethods.length; i++) {
                    if (plg.taxmethods[i].taxType == 'C' || plg.taxmethods[i].taxType == 'CN')
                        ctmrevhtml += "<option value='" + i + "'>" + plg.taxmethods[i].name + "</option>";
                }
                ctmrevhtml += "</select></td></tr>";
                //tmrevhtml += "<td id='TMMethText'>No Method Selected.</td></tr>";
                ctmrevhtml += "<tr><td><button id='CTMGApplyBtn'>Apply to All</button></td></tr>";
                ctmrevhtml += "</table>";
                
                // Construct the native taxation method review pane
                var ntmrevhtml = "<table id = 'NTMGSelTable'><tr><td colspan=2><b>Native Taxation Methods:</b><br /></td></tr>";
                ntmrevhtml += "<tr><td rowspan = 2><select name='NTMGSelect' id='NTMGSelect'>";
                ntmrevhtml += "<option value='m'>Manual</option>";
                for (var i=0; i < plg.taxmethods.length; i++) {
                    if (plg.taxmethods[i].taxType == 'N' || plg.taxmethods[i].taxType == 'CN')
                        ntmrevhtml += "<option value='" + i + "'>" + plg.taxmethods[i].name + "</option>";
                }
                ntmrevhtml += "</select></td></tr>";
                //tmrevhtml += "<td id='TMMethText'>No Method Selected.</td></tr>";
                ntmrevhtml += "<tr><td><button id='NTMGApplyBtn'>Apply to All</button></td></tr>";
                ntmrevhtml += "</table>";
                
                // Display build button
                html += "<br><table border='0' width='100%'>";
                html += "<tr><td rowspan = 2><h1>Planetary Management v" + plugin_version + "</h1></td>"; 
                html += "<td align=center style='width: 100px; cursor:pointer;'><img class='BuildButton' align=center width=90px height=80px src='http://play.planets.nu/img/icons/blacksquares/planets.png'/></td></tr>";
                html += "<tr><td class=PLBuildStatus>" + vgap.plugins["plManagerPlugin"].buildstatustext + "</td></tr>";
                html += "<tr><td><input type='checkbox' name='OvtxCheck' id='OvertaxCheck' value ='c' " + (vgap.plugins["plManagerPlugin"].overtax ? "checked" : "") + "/>Collect some tax on low population worlds (1%)<br /></td>";
                html += "<td><input type='checkbox' name='RndFCCheck' id='RandomizeFCsCheck' value ='c' " + (vgap.plugins["plManagerPlugin"].fcrandomize ? "checked" : "") + "/>Randomize Friendly Codes<br /></td></tr>";
                html += "</table><br />";
                
                
					html += "<br><table id='GMATable' border='0' width='100%'>";
					html += "<tr><td colspan = 3><h3>Global Method Application</h3></td></tr>";
					html += "<tr><td colspan = 3 id='warntext'>Warning: Applying a method globally will overwrite any existing method assignments.</td></tr>";
					html += "<tr><td>" + mrevhtml + "</td>";
					html += "<td>" + ctmrevhtml + "</td>";
					html += "<td>" + ntmrevhtml + "</td></tr>";
					html += "</table><br />";
                    //this.pane = $(html).appendTo(vgap.dash.content);
                    
                    
                    html += "<table id='PLPlanetTable' align='left' class='CleanTable' border='0' width='100%' style='cursor:pointer;'><thead>";
                    //html += "<tr><th rowspan = 4></th><th rowspan = 4 align='left'>Planet</th><th rowspan = 4 title='Method' align='left'>Planetary Building Method</th><th rowspan = 4 title='Population' align='left'>Population</th><th rowspan = 4 title='Money' align='left'>Money</th><th rowspan = 4 title='Buildings' align='center' colspan=4>Buildings</th><th rowspan=4 colspan = 5 title='Mineral'>Minerals</th></tr>";
                    //html += "<tr></tr><tr></tr><tr></tr>";
                    //html += "</thead><tbody id='PlanetRows'></tbody></table></div>";
                    html += "</thead><tbody  id='PlanetRows'>";
                    html += "</tbody></table></div>";
                    this.pane = $(html).appendTo(vgap.dash.content);
                    
                    //for (var i = 0; i < vgap.myplanets.length; i++) {
                    //	var planet = vgap.myplanets[i];
                    if (plg.parray.length == 0) {
                        // There are no planets that fit this criteria
                        html = "<tr class='PLRow'><td><h3>No Planets fit this criteria.</td></tr>";
                        $(html).appendTo("#PlanetRows");
                    }
                    
                    for (var i = 0; i < plg.parray.length; i++) {
                        var planet = plg.parray[i];
                        var base = vgap.getStarbase(planet.id) != null ? "X" : "";
                        
                        if (view == 0) {
                            
                            // Set up the planet information table
                            
                            var plpinfhtml = "";
                            plpinfhtml += "<table class=PLInfoTable data-plid='" + planet.id + "' border='0' width='100%'>";
                            plpinfhtml += "<thead></thead>";
                            plpinfhtml += "<tr> \
<td rowspan = 3><img class='TinyIcon' src='" + planet.img + "'/></td> \
<td class='PLName' rowspan = 1 colspan = 2><b>" + planet.name + "</b></td></tr>";
                            
                            plpinfhtml += "<tr><td class='PLInfTag' rowspan = 1>ID#:&nbsp;</td> \
<td class='PLInfVal'>" + planet.id + "</td></tr>";	
                            plpinfhtml += "<tr><td class='PLInfTag' rowspan = 1>Temp:&nbsp;</td> \
<td class='PLInfVal'>" + planet.temp + "</td></tr>";
                            plpinfhtml += "</table>";
                            
                            
                            
                            // Set up the building method table
                            var bmhtml = "";
                            bmhtml += "<table class=PLBMTable>";
                            bmhtml += "<thead></thead>";
                            bmhtml += "<tr><td>Build Method:</td> \
<td><div> \
<select class='BMSelect' data-plid='" + planet.id + "'> \
<option value='m'>Manual</option>";
                            for (var k=0; k < plg.buildmethods.length; k++) {
                                bmhtml += "<option value='"+k+"'>" + plg.buildmethods[k][0] + "</option>";
                            }	
                            bmhtml += "</select> \
</div> \
</td></tr>";		   
                            bmhtml += "<tr><td>Colonist Tax:</td> \
<td><div> \
<select class='CTSelect' data-plid='" + planet.id + "'> \
<option value='m'>Manual</option>";
                            for (var k=0; k < plg.taxmethods.length; k++) {
                                if (plg.taxmethods[k].taxType == 'C' || plg.taxmethods[k].taxType == 'CN')
                                    bmhtml += "<option value='"+k+"'>" + plg.taxmethods[k].name + "</option>";
                            }	
                            bmhtml += "</select> \
</div> \
</td></tr>";
                            
                            if (planet.nativeclans > 0)
                            {
                                bmhtml += "<tr><td>Native Tax:</td> \
<td><div> \
<select class='NTSelect' data-plid='" + planet.id + "'> \
<option value='m'>Manual</option>";
                                for (var k=0; k < plg.taxmethods.length; k++) {
                                    if (plg.taxmethods[k].taxType == 'N' || plg.taxmethods[k].taxType == 'CN')
                                        bmhtml += "<option value='"+k+"'>" + plg.taxmethods[k].name + "</option>";
                                }	
                                bmhtml += "</select> \
</div> \
</td></tr>";
                                
                            }
                            bmhtml += "</table>";
                            
                            // Set up the population table
                            var pophtml = "";
                            pophtml += "<table class=PLPopTable>";
                            pophtml += "<thead></thead>";
                            pophtml += "<tr><td class='PLPopTag'>Colonists:</td>";
                            if (plg.myColPopGrowth(planet,false) < 0)
                                pophtml += "<td class='PLPopVal'><span class='BadText'>" + plg.nwc(planet.clans * 100) + "</span></td></tr>";
                            else if (planet.clans > plg.getMaxColonists(planet,false))
                                pophtml += "<td class='PLPopVal'><span class='WarnText'>" + plg.nwc(planet.clans * 100) + "</span></td></tr>";
                                else
                                pophtml += "<td class='PLPopVal'><span class='NormalText'>" + plg.nwc(planet.clans * 100) + "</span></td></tr>";
                            if (planet.nativeclans > 0) {
                                //console.log("Native Name: " + planet.nativeracename + " , Native Type: " + planet.nativetype);
                                pophtml += "<tr><td class='PLPopTag'>Natives:</td>";
                                if (plg.myNatPopGrowth(planet,false) < 0)
                                    pophtml += "<td class='PLPopVal'><span class='BadText'>" + plg.nwc(planet.nativeclans * 100) + "</span></td></tr>";
                                else if (planet.nativeclans > plg.getMaxNatives(planet,false))
                                    pophtml += "<td class='PLPopVal'><span class='WarnText'>" + plg.nwc(planet.nativeclans * 100) + "</span></td></tr>";
                                    else
                                    pophtml += "<td class='PLPopVal'>" + plg.nwc(planet.nativeclans * 100) + "</td></tr>";
                                pophtml += "<tr><td align='center' rowspan = 2><img width='35' height='35' src='http://play.planets.nu/img/natives/" + planet.nativetype + ".gif'/></td>";
                                pophtml += "<td class='PLPopVal'>" + planet.nativeracename + "</td></tr>";
                                pophtml += "<tr><td class='PLPopVal'>" + planet.nativegovernmentname + "</td></tr>";
                            }
                            else {
                                pophtml += "<tr><td></td></tr>";
                                pophtml += "<tr><td></td></tr>";
                                pophtml += "<tr><td></td></tr>";
                            }
                            pophtml += "</table>";
                            
                            // Set up the tax table
                            var taxhtml = "";
                            taxhtml += "<table class=PLTaxTable>";
                            taxhtml += "<thead></thead>";
                            taxhtml += "<tr><td>Tax Rate:</td>";
                            taxhtml += "<td class='BldgCnt'>" + planet.colonisttaxrate + "%</td>";
                            taxhtml += "<td class='BldgBlt'>" + plg.colTaxAmtTxt(planet) + "</td></tr>";
                            taxhtml += "<tr><td>Happiness:</td>";
                            taxhtml += "<td class='BldgCnt'>" + planet.colonisthappypoints + "</td>";
                            taxhtml += "<td class='PLHappyChg'>" + plg.happyChgTxt(vgap.colonistTaxChange(planet)) + "</td></tr>";
                            if (planet.nativeclans > 0) {
                                taxhtml += "<tr><td>Tax Rate:</td>";
                                taxhtml += "<td class='BldgCnt'>" + planet.nativetaxrate + "%</td>";
                                taxhtml += "<td class='BldgBlt'>" + plg.natTaxAmtTxt(planet) + "</td></tr>";
                                taxhtml += "<tr><td>Happiness:</td>";
                                taxhtml += "<td class='BldgCnt'>" + planet.nativehappypoints + "</td>";
                                taxhtml += "<td class='PLHappyChg'>" + plg.happyChgTxt(vgap.nativeTaxChange(planet)) + "</td></tr>";
                            }
                            else {
                                taxhtml += "<tr><td></td></tr>";
                                taxhtml += "<tr><td></td></tr>";
                            }
                            
                            taxhtml += "</table>";
                            
                            // Set up the megacredits/supply table
                            var mcsuphtml = "";
                            mcsuphtml += "<table class=PLMCSupTable>";
                            mcsuphtml += "<thead></thead>";
                            mcsuphtml += "<tr><td>Megacredits:&nbsp;</td><td><b>" + planet.megacredits + "</b></td></tr>"; 
                            mcsuphtml += "<tr><td>Supplies:&nbsp;</td><td><b>" + planet.supplies + "</b></td></tr>"; 
                            //mcsuphtml += "<tr><td>FC:&nbsp;</td>";
                            mcsuphtml += "<tr><td></td><td class=FCDisp data-plid='" + planet.id + "' id='FCDisp_" + planet.id + "' align='center' width='30px' style='border: solid white 1px; color: #0000A0; background-color: " + vgap.plugins["plManagerPlugin"].getFCColor(planet.friendlycode) + ";'><b>" + planet.friendlycode + "</b></td><td></td></tr>";
                            mcsuphtml += "</table>";
                            
                            /*
							//highlight friendly codes
        var fcbox_color = "transparent";
        fcu = planet.friendlycode.toUpperCase();
        if (fcu == "NUK" || fcu == "ATT") fcbox_color = "red";
        else if (fcu == "BUM") fcbox_color = "orchid";
        else if (fcu == "DMP") fcbox_color = "magenta";
        else if (fcu.substr(0, 2) == "PB") fcbox_color = "aqua";

        return "<table width='100%'>" +
                "<tr><td class='head' data-topic='Buildings'>Mines:</td><td class='val'>" + planet.mines + "</td><td class='valsup'>/" + this.maxBuilding(200) + " " + mineText + "</td><td class='valsup'>" + tmText + "</td></tr>" +
                "<tr><td class='head' data-topic='Buildings'>Factories:</td><td class='val'>" + planet.factories + "</td><td class='valsup'>/" + this.maxBuilding(100) + " " + factoryText + "</td><td class='valsup'>" + tfText + "</td>" +
                "<td class='headright' data-topic='FriendlyCodes'>Friendly Code</td><td class='fc'><span style='background-color: " + fcbox_color + "' id='PlanetFC'>" + planet.friendlycode + "</span></td></tr>" +
                "<tr><td class='head' style='cursor:pointer' data-topic='Buildings'>Defense:</td><td class='val'>" + planet.defense + "</td><td class='valsup'>/" + this.maxBuilding(50) + " " + defText + "</td><td class='valsup'>" + tdText + "</td></tr>" +
                "</table>";        
							*/
                            
                            // Set up the buildings table
                            var bldghtml = "";
                            bldghtml += "<table class=PLBldgTable>";
                            bldghtml += "<thead></thead>";
                            
                            // Factories
                            bldghtml += "<tr><td>" + "<img src='http://play.planets.nu/img/icons/factory.png' height='25' width='25'></img>" + "</td>";
                            bldghtml += "<td class='BldgCnt'>" + planet.factories + "</td>";
                            bldghtml += "<td class='BldgMax'>/&nbsp;" + vgap.plugins["plManagerPlugin"].maxBldgs(planet,100) + "</td>";
                            bldghtml += "<td class='BldgBlt'>[+" + planet.builtfactories + "]</td></tr>";
                            
                            // Mines
                            bldghtml += "<tr><td>" + "<img src='http://play.planets.nu/img/icons/mine.png' height='25' width='25'></img>" + "</td>";
                            bldghtml += "<td class='BldgCnt'>" + planet.mines + "</td>";
                            bldghtml += "<td class='BldgMax'>/&nbsp;" + vgap.plugins["plManagerPlugin"].maxBldgs(planet,200) + "</td>"; 
                            bldghtml += "<td class='BldgBlt'>[+" + planet.builtmines + "]</td></tr>";
                            
                            // Defense Posts
                            bldghtml += "<tr><td>" + "<img src='http://play.planets.nu/img/icons/defense.png' height='25' width='25'></img>" + "</td>";
                            bldghtml += "<td class='BldgCnt'>" + planet.defense + "</td>";
                            bldghtml += "<td class='BldgMax'>/&nbsp;" + vgap.plugins["plManagerPlugin"].maxBldgs(planet,50) + "</td>"; 
                            bldghtml += "<td class='BldgBlt'>[+" + planet.builtdefense + "]</td></tr>";
                            bldghtml += "</table>";
                            
                            // Set up the Resources Table
                            var reshtml = "";
                            reshtml += "<table class=PLResTable>";
                            reshtml += "<thead></thead>";
                            
                            // Neutronium
                            reshtml += "<tr><td class='ResName' align='right'>Neu</td>";
                            reshtml += "<td class='ResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.neutronium) + ";'>" + planet.neutronium + "&nbsp;" + "</td>";
                            reshtml += "<td class='ResGrd' align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundneutronium) + ";'><b> /&nbsp;" + planet.groundneutronium + "</b></td>"; 
                            reshtml += "<td class='ResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densityneutronium) + ";'>" + planet.densityneutronium + "%</td>";
                            reshtml += "<td class='ResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundneutronium, planet.densityneutronium) + "</td></tr>";
                            
                            // Duranium
                            reshtml += "<tr><td class='ResName' align='right'>Dur</td>";
                            reshtml += "<td class='ResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.duranium) + "; padding-left=0.5ex'>" + planet.duranium + "&nbsp;" + "</td>";
                            reshtml += "<td class='ResGrd' align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundduranium) + ";'><b> /&nbsp;" + planet.groundduranium + "</b></td>";
                            reshtml += "<td class='ResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densityduranium) + ";'>" + planet.densityduranium + "%</td>";
                            reshtml += "<td class='ResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundduranium, planet.densityduranium) + "</td></tr>";
                            
                            // Tritanium
                            reshtml += "<tr><td class='ResName' align='right'>Trit</td>";
                            reshtml += "<td class='ResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.tritanium) + ";'>" + planet.tritanium + "&nbsp;" + "</td>";
                            reshtml += "<td class='ResGrd'align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundtritanium) + ";'><b> /&nbsp;" + planet.groundtritanium + "</b></td>";
                            reshtml += "<td class='ResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densitytritanium) + ";'>" + planet.densitytritanium + "%</td>";
                            reshtml += "<td class='ResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundtritanium, planet.densitytritanium) + "</td></tr>";
                            
                            // Molybdenum
                            reshtml += "<tr><td class='ResName' align='right'>Moly</td>";
                            reshtml += "<td class='ResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.molybdenum) + ";'>" + planet.molybdenum + "&nbsp;" + "</td>"; 
                            reshtml += "<td class='ResGrd'align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundmolybdenum) + ";'><b> /&nbsp;" + planet.groundmolybdenum + "</b></td>";
                            reshtml += "<td class='ResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densitymolybdenum) + ";'>" +  planet.densitymolybdenum + "%</td>";
                            reshtml += "<td class='ResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundmolybdenum, planet.densitymolybdenum) + "</td></tr>";
                            reshtml += "</table>";
                            
                            
                            
                            // Assemble the row : also had id='PLRow' class='RowSelect'
                            html = "<tr class='PLRow'> \
<td>" + plpinfhtml + "</td> \
<td>" + bmhtml + "</td> \
<td>" + pophtml + "</td> \
<td>" + taxhtml + "</td> \
<td>" + mcsuphtml + "</td> \
<td>" + bldghtml + "</td> \
<td>" + reshtml + "</td></tr>";
                            
                            
                        }
                        
                        $(html).appendTo("#PlanetRows");
                    }
                    /*
                    //html = "</table><br><table id='GMATable' border='0' width='100%'>";
                    html = "<tr><td colspan = 7><h3>Global Method Application</h3></td></tr>";
                    html += "<tr><td colspan = 7 id='warntext'>Warning: Applying a method globally will overwrite any existing method assignments.</td></tr>";
                    html += "<tr><td colspan = 2>" + mrevhtml + "</td>";
                    html += "<td colspan = 2>" + ctmrevhtml + "</td>";
                    html += "<td colspan = 2>" + ntmrevhtml + "</td></tr>";
                    $(html).appendTo("#PlanetRows");	
                    */
                    $('.PLInfoTable').click(function() {
                        plg.showPlanetDetail(($(this).attr('data-plid')));
                    });
                    
                    $('body').delegate('.FCDisp','click',function() {
                        console.log("FCDISP CLICKED!!!");
                        this.curplanet = ($(this).attr('data-plid'));
                        var planet = vgap.getPlanet(this.curplanet);
                        vgap.planetScreen.load(planet);
                        vgap.planetScreen.randomFC();
                        var identifier = "#FCDisp_" + planet.id;
                        console.log("SELECTOR: " + identifier);
                        $(identifier).replaceWith("<td class=FCDisp data-plid='" + planet.id + "' id='FCDisp_" + planet.id + "' align='center' width='30px' style='border: solid white 1px; color: #0000A0; background-color: " + vgap.plugins["plManagerPlugin"].getFCColor(planet.friendlycode) + ";'><b>" + planet.friendlycode + "</b></td>");
                    });
                    
                    $('#RandomizeFCsCheck').click(function () {
                        console.log("Randomize FCs CLICKED");
                        if (plg.fcrandomize == true) 
                            plg.fcrandomize = false;
                        else
                            plg.fcrandomize = true;
                        
                        if (debug) console.log("FC Randomize is now: " + plg.fcrandomize);
                    });
                    
                    $('#OvertaxCheck').click(function () {
                        console.log("Overtax CLICKED");
                        if (plg.overtax == true) 
                            plg.overtax = false;
                        else
                            plg.overtax = true;
                        
                        if (debug) console.log("Overtax is now: " + plg.overtax);
                    });
                    
                    $('.BuildButton').click(function() {
                        plg.executePlanetUpdate();
                    });
                    
                    $('.BMSelect').each(function() {
                        $(this).val(plg.bmarray[$(this).attr('data-plid')]);
                    });
                    
                    $('.BMSelect').change(function() {
                        plg.bmarray[$(this).attr('data-plid')] = $(this).attr('value');
                        plg.saveObjectAsNote(0, plg.notetype, [plugin_version,plg.bmarray]);
                    });
                    
                    $('.CTSelect').each(function() {
                        $(this).val(plg.ctarray[$(this).attr('data-plid')]);
                    });
                    
                    $('.CTSelect').change(function() {
                        //console.log("CT CHANGED!");
                        plg.ctarray[$(this).attr('data-plid')] = $(this).attr('value');
                        plg.saveObjectAsNote(2, plg.notetype, [plugin_version,plg.ctarray]);
                    });
                    
                    $('.NTSelect').each(function() {
                        $(this).val(plg.ntarray[$(this).attr('data-plid')]);
                    });
                    
                    $('.NTSelect').change(function() {
                        //console.log("NT CHANGED!");
                        plg.ntarray[$(this).attr('data-plid')] = $(this).attr('value');
                        plg.saveObjectAsNote(1, plg.notetype, [plugin_version,plg.ntarray]);
                    });
                    
                    $('#BMGApplyBtn').click(function() {
                        var bmind = $('#BMGSelect').val();
                        // Apply the method
                        
                        for (var i = 0; i < plg.parray.length; i++) {
                            plg.bmarray[plg.parray[i].id] = bmind;
                        }
                        
                        plg.saveObjectAsNote(0, plg.notetype, [plugin_version,plg.bmarray]);
                        plg.displayPM(0);
                    });
                    
                    $('#CTMGApplyBtn').click(function() {
                        var bmind = $('#CTMGSelect').val();
                        // Apply the method
                        
                        for (var i = 0; i < plg.parray.length; i++) {
                            plg.ctarray[plg.parray[i].id] = bmind;
                        }
                        
                        plg.saveObjectAsNote(2, plg.notetype, [plugin_version,plg.ctarray]);
                        plg.displayPM(0);
                    });
                    
                    $('#NTMGApplyBtn').click(function() {
                        var bmind = $('#NTMGSelect').val();
                        // Apply the method
                        
                        for (var i = 0; i < plg.parray.length; i++) {
                            if (plg.parray[i].nativeclans > 0)
                                plg.ntarray[plg.parray[i].id] = bmind;
                        }
                        
                        plg.saveObjectAsNote(1, plg.notetype, [plugin_version,plg.ntarray]);
                        plg.displayPM(0);
                    });                    											
                }
                
                if (view == 1) {
                    
                    html += "<br /><table border='0' width='100%'>";
                    
                    if (this.curplanet < 1) {
                        html += "<tr><td>No planet selected.</td>";
                        html += "</tr></table><br /></div>";
                    }
                    
                    if (this.curplanet >= 1) {
                        //console.log("IN VIEW 1: inside of range: curplanet = " + this.curplanet);
                        
                        var planet = vgap.getPlanet(this.curplanet);
                        
                        // Set up planet info table
                        var pinfohtml = "";
                        pinfohtml += "<table id=InfoTable border='0' width='100%'>";
                        pinfohtml += "<tr><td><h1><b>" + planet.name + "</b></h1></td></tr>";
                        pinfohtml += "<tr><td><h3><b>ID#:&nbsp;" + planet.id + "</b></h3></td></tr>";
                        pinfohtml += "<tr><td><h3><b>Temperature:&nbsp;" + planet.temp + "</b></h3></td></tr>";
                        pinfohtml += "<tr></tr>";
                        pinfohtml += "<tr><td><h3><b>Megacredits:&nbsp;" + planet.megacredits + "</b></h3></td></tr>";
                        pinfohtml += "<tr><td><h3><b>Supplies:&nbsp;" + planet.supplies + "</b></h3></td></tr>";
                        pinfohtml += "</table>";
                        
                        // Set up building info table
                        var bldghtml = "";
                        bldghtml += "<table id=BldgTable border='0' width='100%' style='font-size: 15px;'>";
                        bldghtml += "<thead><tr><th colspan=4 align=left style='font-size: 20px;'>Buildings</th></tr></thead>";
                        
                        bldghtml += "<tr><td rowspan = 1 width=75 height=50>" + "<img src='http://play.planets.nu/img/icons/factory.png' height='50' width='50'></img>" + "</td>";
                        bldghtml += "<td class=PMBldgCnt rowspan = 1 align=right>" + planet.factories + "&nbsp;</td>";
                        bldghtml += "<td class=PMBldgMax align=left><b>&nbsp;/&nbsp;</b>" + vgap.plugins["plManagerPlugin"].maxBldgs(planet,100) + "</td>";
                        bldghtml += "<td class=PMBldgBlt >[+" + planet.builtfactories + "]</td></tr>";
                        
                        bldghtml += "<tr><td rowspan = 1 width=75 height=50>" + "<img src='http://play.planets.nu/img/icons/mine.png' height='50' width='50'></img>" + "</td>";
                        bldghtml += "<td class=PMBldgCnt rowspan = 1 align=right>" + planet.mines + "&nbsp;</td>";
                        bldghtml += "<td class=PMBldgMax align=left><b>&nbsp;/&nbsp;</b>" + vgap.plugins["plManagerPlugin"].maxBldgs(planet,200) + "</td>"; 
                        bldghtml += "<td class=PMBldgBlt >[+" + planet.builtmines + "]</td></tr>";
                        
                        bldghtml += "<tr><td rowspan = 1 width=75 height=50>" + "<img src='http://play.planets.nu/img/icons/defense.png' height='50' width='50'></img>" + "</td>";
                        bldghtml += "<td class=PMBldgCnt rowspan = 1 align=right>" + planet.defense + "&nbsp;</td>";
                        bldghtml += "<td class=PMBldgMax align=left><b>&nbsp;/&nbsp;</b>" + vgap.plugins["plManagerPlugin"].maxBldgs(planet,50) + "</td>"; 
                        bldghtml += "<td class=PMBldgBlt >[+" + planet.builtdefense + "]</td></tr>";
                        
                        bldghtml += "</table>";
                        
                        // Set up the population info table
                        
                        var pophtml = "";
                        pophtml += "<table id=PopulationTable border='0' width='100%' style='font-size: 15px;'>";
                        pophtml += "<thead><tr><th colspan=2 align=left style='font-size: 20px;'>Population</th></tr></thead>";
                        if (planet.clans > 0) {
                            pophtml += "<tr><td rowspan = 4><img width='150' height='150' src='http://play.planets.nu/img/races/1.jpg'/></td>";
                            pophtml += "<td class=PMColTag valign='bottom' rowspan = 1 align = 'left' style='font-size: 15px;'>Colonists: </td>";
                            if (plg.myColPopGrowth(planet,false) < 0)
                                pophtml += "<td class='PMColVal' valign='bottom'><span class='BadText'>" + plg.nwc(planet.clans * 100) + "</span></td>";
                            else if (planet.clans > plg.getMaxColonists(planet,false))
                                pophtml += "<td class='PMColVal' valign='bottom'><span class='WarnText'>" + plg.nwc(planet.clans * 100) + "</span></td>";
                                else
                                pophtml += "<td class='PMColVal' valign='bottom'><span class='NormalText'>" + plg.nwc(planet.clans * 100) + "</span></td>";
                            
                            pophtml += "<td class=PMColMaxVal valign='bottom'>(" + plg.nwc(plg.getMaxColonists(planet,false)*100) + ")</td>";
                            pophtml += "<td class=PMColExtra valign='bottom'>[+" + plg.nwc(plg.myColPopGrowth(planet,false)*100) + "]</td></tr>";
                            
                            pophtml += "<tr><td class=PMColTag valign='bottom'>Tax Rate:</td>";
                            pophtml += "<td class=PMColVal valign='bottom'>" + planet.colonisttaxrate + "%</td>";
                            pophtml += "<td class=PMColExtra valign='bottom'>" + plg.colTaxAmtTxt(planet) + "</td></tr>";
                            
                            pophtml += "<tr><td class=PMColTag valign='top'>Happiness:</td>";
                            pophtml += "<td class=PMColVal valign='top'>" + planet.colonisthappypoints + "</td>";
                            pophtml += "<td class=PMColExtra valign='top'>" + plg.happyChgTxt(vgap.colonistTaxChange(planet)) + "</td></tr>";
                            
                            
                        }
                        else
                            pophtml += "<tr><td></td><td></td></tr>";	
                        pophtml += "<tr><td></td><td></td></tr>";
                        pophtml += "<tr><td></td><td></td></tr>";
                        
                        if (planet.nativeclans > 0) {
                            pophtml += "<tr><td rowspan = 5><img width='150' height='150' src='http://play.planets.nu/img/natives/" + planet.nativetype + ".gif'/></td>";
                            pophtml += "<td class=PMColTag valign='bottom' rowspan = 1 align = 'left'>Natives:</td>";
                            if (plg.myNatPopGrowth(planet,false) < 0)
                                pophtml += "<td class='PMColVal' valign='bottom'><span class='BadText'>" + plg.nwc(planet.nativeclans * 100) + "</span></td>";
                            else if (planet.nativeclans > plg.getMaxNatives(planet,false))
                                pophtml += "<td class='PMColVal' valign='bottom'><span class='WarnText'>" + plg.nwc(planet.nativeclans * 100) + "</span></td>";
                                else
                                pophtml += "<td class='PMColVal' valign='bottom'>" + plg.nwc(planet.nativeclans * 100) + "</td>";
                            
                            pophtml += "<td class=PMColMaxVal valign='bottom'>(" + plg.nwc(plg.getMaxNatives(planet)*100) + ")</td>";
                            pophtml += "<td class=PMColExtra valign='bottom'>[" + plg.nwc(plg.myNatPopGrowth(planet,false)*100) + "]</td></tr>";
                            
                            pophtml += "<tr><td class=PMColTag valign='top' rowspan = 1 align = 'left'>" + planet.nativeracename + "&nbsp;-&nbsp;" + planet.nativegovernmentname + "</td></tr>";
                            
                            pophtml += "<tr><td class=PMColTag valign='bottom'>Tax Rate:</td>";
                            pophtml += "<td class=PMColVal valign='bottom'>" + planet.nativetaxrate + "%</td>";
                            pophtml += "<td class=PMColExtra valign='bottom'>" + plg.natTaxAmtTxt(planet) + "</td></tr>";
                            
                            pophtml += "<tr><td class=PMColTag valign='top'>Happiness:</td>";
                            pophtml += "<td class=PMColVal valign='top'>" + planet.nativehappypoints + "</td>";
                            pophtml += "<td class=PMColExtra valign='top'>" + plg.happyChgTxt(vgap.nativeTaxChange(planet)) + "</td></tr>";
                            
                        }
                        else
                            pophtml += "<tr><td></td><td></td></tr>";	
                        pophtml += "</table>";
                        
                        // Set up the resources table
                        
                        var reshtml = "";
                        reshtml += "<table id=PMResTable>";
                        //reshtml += "<thead></thead>";
                        reshtml += "<thead><tr><th colspan=5 align=left style='font-size: 20px;'>Resources</th><th width=100px>Turns to Mine Out</th>";
                        reshtml += "<th align=left style='font-size: 20px;' rowspan = 5>What If There Were:</th><th colspan = 2>20 Mines</th><th colspan = 2>50 Mines</th><th colspan = 2>100 Mines</th><th colspan = 2>200 Mines</th></tr></thead>";
                        // Neutronium
                        reshtml += "<tr><td class='PMResName' align='right'>Neutronium</td>";
                        reshtml += "<td class='PMResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.neutronium) + ";'>" + planet.neutronium + "&nbsp;" + "</td>";
                        reshtml += "<td class='PMResGrd' align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundneutronium) + ";'><b> /&nbsp;" + planet.groundneutronium + "</b></td>"; 
                        reshtml += "<td class='PMResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densityneutronium) + ";'>" + planet.densityneutronium + "%</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundneutronium, planet.densityneutronium) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOut(planet, planet.groundneutronium, planet.densityneutronium) + "</td>";
                        reshtml += "<td></td>";
                        
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundneutronium, planet.densityneutronium,20) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundneutronium, planet.densityneutronium,20) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundneutronium, planet.densityneutronium,50) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundneutronium, planet.densityneutronium,50) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundneutronium, planet.densityneutronium,100) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundneutronium, planet.densityneutronium,100) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundneutronium, planet.densityneutronium,200) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundneutronium, planet.densityneutronium,200) + "</td>";
                        reshtml += "</tr>";
                        
                        // Duranium
                        reshtml += "<tr><td class='PMResName' align='right'>Duranium</td>";
                        reshtml += "<td class='PMResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.duranium) + "; padding-left=0.5ex'>" + planet.duranium + "&nbsp;" + "</td>";
                        reshtml += "<td class='PMResGrd' align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundduranium) + ";'><b> /&nbsp;" + planet.groundduranium + "</b></td>";
                        reshtml += "<td class='PMResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densityduranium) + ";'>" + planet.densityduranium + "%</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundduranium, planet.densityduranium) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOut(planet, planet.groundduranium, planet.densityduranium) + "</td>";
                        reshtml += "<td></td>";
                        
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundduranium, planet.densityduranium,20) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundduranium, planet.densityduranium,20) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundduranium, planet.densityduranium,50) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundduranium, planet.densityduranium,50) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundduranium, planet.densityduranium,100) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundduranium, planet.densityduranium,100) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundduranium, planet.densityduranium,200) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundduranium, planet.densityduranium,200) + "</td>";
                        reshtml += "</tr>";
                        
                        // Tritanium
                        reshtml += "<tr><td class='PMResName' align='right'>Tritanium</td>";
                        reshtml += "<td class='PMResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.tritanium) + ";'>" + planet.tritanium + "&nbsp;" + "</td>";
                        reshtml += "<td class='PMResGrd'align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundtritanium) + ";'><b> /&nbsp;" + planet.groundtritanium + "</b></td>";
                        reshtml += "<td class='PMResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densitytritanium) + ";'>" + planet.densitytritanium + "%</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundtritanium, planet.densitytritanium) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOut(planet, planet.groundtritanium, planet.densitytritanium) + "</td>";
                        reshtml += "<td></td>";
                        
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundtritanium, planet.densitytritanium,20) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundtritanium, planet.densitytritanium,20) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundtritanium, planet.densitytritanium,50) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundtritanium, planet.densitytritanium,50) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundtritanium, planet.densitytritanium,100) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundtritanium, planet.densitytritanium,100) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundtritanium, planet.densitytritanium,200) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundtritanium, planet.densitytritanium,200) + "</td>";
                        reshtml += "</tr>";
                        
                        // Molybdenum
                        reshtml += "<tr><td class='PMResName' align='right'>Molybdenum</td>";
                        reshtml += "<td class='PMResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.molybdenum) + ";'>" + planet.molybdenum + "&nbsp;" + "</td>"; 
                        reshtml += "<td class='PMResGrd'align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundmolybdenum) + ";'><b> /&nbsp;" + planet.groundmolybdenum + "</b></td>";
                        reshtml += "<td class='PMResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densitymolybdenum) + ";'>" +  planet.densitymolybdenum + "%</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundmolybdenum, planet.densitymolybdenum) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOut(planet, planet.groundmolybdenum, planet.densitymolybdenum) + "</td>";
                        reshtml += "<td></td>";
                        
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundmolybdenum, planet.densitymolybdenum,20) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundmolybdenum, planet.densitymolybdenum,20) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundmolybdenum, planet.densitymolybdenum,50) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundmolybdenum, planet.densitymolybdenum,50) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundmolybdenum, planet.densitymolybdenum,100) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundmolybdenum, planet.densitymolybdenum,100) + "</td>";
                        reshtml += "<td class='PMMineOutAmt'>" + vgap.plugins["plManagerPlugin"].turnsToMineOutTheoretical(planet, planet.groundmolybdenum, planet.densitymolybdenum,200) + "</td>";
                        reshtml += "<td class='PMResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurnTheoretical(planet, planet.groundmolybdenum, planet.densitymolybdenum,200) + "</td>";
                        reshtml += "</tr>";
                        
                        reshtml += "</table>";
                        
                        // Call the planet predictor
                        plg.planetPredictor(planet, 0, 49);
                        
                        // Construct the predictor table
                        
                        // Set up the predictor header area
                        var predhdrhtml = "<div id='PredHdr'><p><h2><b>Planet Predictor<b></h2></p><br />";
                        predhdrhtml += "<p>Under the selected building and taxation plans, this planet will:<br /><ul>";
                        
                        if (vgap.getStarbase(planet.id) != null)
                            predhdrhtml += "<li>This planet already has a starbase.</li>";
                        else {
                            if (plg.predicttimes.ttSB == -1)
                                predhdrhtml += "<li>Not be able to build a starbase in the next 50 turns.</li>";
                            else
                                predhdrhtml += "<li>Be able to build a starbase in <span class='predictval'>" + plg.predicttimes.ttSB + "</span> turns.</li>";
                        }
                        if (plg.predicttimes.ttMaxCols == -1)
                            predhdrhtml += "<li>Not be able to reach maximum colonists in the next 50 turns.</li>";
                        else
                            predhdrhtml += "<li>Reach maximum colonists in <span class='PredictVal'>" + plg.predicttimes.ttMaxCols + "</span> turns.</li>";
                        
                        if (planet.nativeclans > 0) {
                            //var player = vgap.getPlayer(plg.pplanet.ownerid);
                            //if (vgap.player.raceid == 6 && plg.pplanet.nativeclans > 0) 
                            if (vgap.player.raceid == 6)
                                predhdrhtml += "<li>Assimilate all natives in <span class='PredictVal'>" + plg.getAssimTurns(planet) + "</span> turns.</li>";
                            else if (plg.predicttimes.ttMaxNats == -1)
                                predhdrhtml += "<li>Not be able to reach maximum natives in the next 50 turns.</li>";
                                else
                                predhdrhtml += "<li>Reach maximum natives in <span class='PredictVal'>" + plg.predicttimes.ttMaxNats + "</span> turns.</li>";
                            
                        }
                        
                        if (plg.predicttimes.ttNMO == -1)
                            predhdrhtml += "<li>Not mine out neutronium in the next 50 turns.</li>";
                        else
                            predhdrhtml += "<li>Mine out neutronium in <span class='PredictVal'>" + plg.predicttimes.ttNMO + "</span> turns.</li>";
                        
                        if (plg.predicttimes.ttDMO == -1)
                            predhdrhtml += "<li>Not mine out duranium in the next 50 turns.</li>";
                        else
                            predhdrhtml += "<li>Mine out duranium in <span class='PredictVal'>" + plg.predicttimes.ttDMO + "</span> turns.</li>";
                        
                        if (plg.predicttimes.ttTMO == -1)
                            predhdrhtml += "<li>Not mine out tritanium in the next 50 turns.</li>";
                        else
                            predhdrhtml += "<li>Mine out tritanium in <span class='PredictVal'>" + plg.predicttimes.ttTMO + "</span> turns.</li>";
                        
                        if (plg.predicttimes.ttMMO == -1)
                            predhdrhtml += "<li>Not mine out molybdenum in the next 50 turns.</li>";
                        else
                            predhdrhtml += "<li>Mine out molybdenum in <span class='PredictVal'>" + plg.predicttimes.ttMMO + "</span> turns.</li>";
                        
                        predhdrhtml += "</ul></p><br /></div>";
                        
                        // Set up the planet information table
                        var predhtml = "<table id = 'predtable'>";
                        
                        for (var i = 0; i < plg.predictarray.length; i++) {
                            if (i == 0)
                                predhtml += "<tr><td colspan = 5><b>Now</td></tr>";
                            else if (i == 1)
                                predhtml += "<tr><td colspan = 5><b>In&nbsp;" + i + " Turn</td></tr>";
                                else
                                predhtml += "<tr><td colspan = 5><b>In&nbsp;" + i + " Turns</td></tr>";
                            
                            var planet = plg.predictarray[i];
                            var base = vgap.getStarbase(planet.id) != null ? "X" : "";
                            
                            var pdppinfhtml = "";
                            pdppinfhtml += "<table class=PLInfoTable data-plid='" + planet.id + "' border='0' width='100%'>";
                            pdppinfhtml += "<thead></thead>";
                            pdppinfhtml += "<tr> \
<td rowspan = 3><img class='TinyIcon' src='" + planet.img + "'/></td> \
<td class='PLName' rowspan = 1 colspan = 2><b>" + planet.name + "</b></td></tr>";
                            
                            pdppinfhtml += "<tr><td class='PLInfTag' rowspan = 1>ID#:&nbsp;</td> \
<td class='PLInfVal'>" + planet.id + "</td></tr>";	
                            pdppinfhtml += "<tr><td class='PLInfTag' rowspan = 1>Temp:&nbsp;</td> \
<td class='PLInfVal'>" + planet.temp + "</td></tr>";
                            pdppinfhtml += "</table>";
                            
                            
                            
                            // Set up the building method table
                            var pdppbmhtml = "";
                            pdppbmhtml += "<table class=PLBMTable>";
                            pdppbmhtml += "<thead></thead>";
                            pdppbmhtml += "<tr><td>Build Method:</td> \
<td>";
                            
                            var pdppbm = plg.bmarray[plg.pplanet.id];
                            if (pdppbm == 'm')
                                pdppbmhtml += "Manual";
                            else
                                pdppbmhtml += plg.buildmethods[pdppbm][0];
                            pdppbmhtml += "</td></tr>";	
                            
                            pdppbmhtml += "<tr><td>Colonist Tax:</td> \
<td>";
                            
                            var pdppcti = plg.ctarray[plg.pplanet.id];
                            if (pdppcti == 'm')
                                pdppbmhtml += "Manual";
                            else
                                pdppbmhtml += plg.taxmethods[pdppcti].name;
                            pdppbmhtml += "</td></tr>";	
                            
                            if (planet.nativeclans > 0)	{
                                pdppbmhtml += "<tr><td>Native Tax:</td> \
<td>";
                                var pdppnti = plg.ntarray[plg.pplanet.id];
                                if (pdppnti == 'm')
                                    pdppbmhtml += "Manual";
                                else
                                    pdppbmhtml += plg.taxmethods[pdppnti].name;
                                pdppbmhtml += "</td></tr>";	
                            }										
                            
                            pdppbmhtml += "</table>";
                            
                            // Set up the population table
                            var pdpppophtml = "";
                            pdpppophtml += "<table class=PLPopTable>";
                            pdpppophtml += "<thead></thead>";
                            pdpppophtml += "<tr><td class='PLPopTag'>Colonists:</td>";
                            if (plg.myColPopGrowth(planet,false) < 0)
                                pdpppophtml += "<td class='PLPopVal'><span class='BadText'>" + plg.nwc(planet.clans * 100) + "</span></td></tr>";
                            else if (planet.clans > plg.getMaxColonists(planet,false))
                                pdpppophtml += "<td class='PLPopVal'><span class='WarnText'>" + plg.nwc(planet.clans * 100) + "</span></td></tr>";
                                else
                                pdpppophtml += "<td class='PLPopVal'><span class='NormalText'>" + plg.nwc(planet.clans * 100) + "</span></td></tr>";
                            
                            
                            
                            if (planet.nativeclans > 0) {
                                //console.log("Native Name: " + planet.nativeracename + " , Native Type: " + planet.nativetype);
                                pdpppophtml += "<tr><td class='PLPopTag'>Natives:</td>";
                                if (plg.myNatPopGrowth(planet,false) < 0)
                                    pdpppophtml += "<td class='PLPopVal'><span class='BadText'>" + plg.nwc(planet.nativeclans * 100) + "</span></td></tr>";
                                else if (planet.nativeclans > plg.getMaxNatives(planet,false))
                                    pdpppophtml += "<td class='PLPopVal'><span class='WarnText'>" + plg.nwc(planet.nativeclans * 100) + "</span></td></tr>";
                                    else
                                    pdpppophtml += "<td class='PLPopVal'>" + plg.nwc(planet.nativeclans * 100) + "</td></tr>";
                                
                                pdpppophtml += "<tr><td align='center' rowspan = 2><img width='35' height='35' src='http://play.planets.nu/img/natives/" + planet.nativetype + ".gif'/></td>";
                                pdpppophtml += "<td class='PLPopVal'>" + planet.nativeracename + "</td></tr>";
                                pdpppophtml += "<tr><td class='PLPopVal'>" + planet.nativegovernmentname + "</td></tr>";
                            }
                            else {
                                pdpppophtml += "<tr><td></td></tr>";
                                pdpppophtml += "<tr><td></td></tr>";
                                pdpppophtml += "<tr><td></td></tr>";
                            }
                            pdpppophtml += "</table>";
                            
                            // Set up the tax table
                            var pdpptaxhtml = "";
                            pdpptaxhtml += "<table class=PLTaxTable>";
                            pdpptaxhtml += "<thead></thead>";
                            pdpptaxhtml += "<tr><td>Tax Rate:</td>";
                            pdpptaxhtml += "<td class='BldgCnt'>" + planet.colonisttaxrate + "%</td>";
                            pdpptaxhtml += "<td class='BldgBlt'>" + plg.colTaxAmtTxt(planet) + "</td></tr>";
                            pdpptaxhtml += "<tr><td>Happiness:</td>";
                            pdpptaxhtml += "<td class='BldgCnt'>" + planet.colonisthappypoints + "</td>";
                            pdpptaxhtml += "<td class='PLHappyChg'>" + plg.happyChgTxt(vgap.colonistTaxChange(planet)) + "</td></tr>";
                            if (planet.nativeclans > 0) {
                                pdpptaxhtml += "<tr><td>Tax Rate:</td>";
                                pdpptaxhtml += "<td class='BldgCnt'>" + planet.nativetaxrate + "%</td>";
                                pdpptaxhtml += "<td class='BldgBlt'>" + plg.natTaxAmtTxt(planet) + "</td></tr>";
                                pdpptaxhtml += "<tr><td>Happiness:</td>";
                                pdpptaxhtml += "<td class='BldgCnt'>" + planet.nativehappypoints + "</td>";
                                pdpptaxhtml += "<td class='PLHappyChg'>" + plg.happyChgTxt(vgap.nativeTaxChange(planet)) + "</td></tr>";
                            }
                            else {
                                pdpptaxhtml += "<tr><td></td></tr>";
                                pdpptaxhtml += "<tr><td></td></tr>";
                            }
                            
                            pdpptaxhtml += "</table>";
                            
                            // Set up the megacredits/supply table
                            var pdppmcsuphtml = "";
                            pdppmcsuphtml += "<table class=PLMCSupTable>";
                            pdppmcsuphtml += "<thead></thead>";
                            pdppmcsuphtml += "<tr><td>Megacredits:&nbsp;<b>" + planet.megacredits + "</b></td></tr>"; 
                            pdppmcsuphtml += "<tr><td>Supplies:&nbsp;<b>" + planet.supplies + "</b></td></tr>"; 
                            pdppmcsuphtml += "</table>";
                            
                            // Set up the buildings table
                            var pdppbldghtml = "";
                            pdppbldghtml += "<table class=PLBldgTable>";
                            pdppbldghtml += "<thead></thead>";
                            
                            // Factories
                            pdppbldghtml += "<tr><td>" + "<img src='http://play.planets.nu/img/icons/factory.png' height='25' width='25'></img>" + "</td>";
                            pdppbldghtml += "<td class='BldgCnt'>" + planet.factories + "</td>";
                            pdppbldghtml += "<td class='BldgMax'>/&nbsp;" + vgap.plugins["plManagerPlugin"].maxBldgs(planet,100) + "</td></tr>";
                            //pdppbldghtml += "<td class='BldgBlt'>[+" + planet.builtfactories + "]</td></tr>";
                            
                            // Mines
                            pdppbldghtml += "<tr><td>" + "<img src='http://play.planets.nu/img/icons/mine.png' height='25' width='25'></img>" + "</td>";
                            pdppbldghtml += "<td class='BldgCnt'>" + planet.mines + "</td>";
                            pdppbldghtml += "<td class='BldgMax'>/&nbsp;" + vgap.plugins["plManagerPlugin"].maxBldgs(planet,200) + "</td></tr>"; 
                            //pdppbldghtml += "<td class='BldgBlt'>[+" + planet.builtmines + "]</td></tr>";
                            
                            // Defense Posts
                            pdppbldghtml += "<tr><td>" + "<img src='http://play.planets.nu/img/icons/defense.png' height='25' width='25'></img>" + "</td>";
                            pdppbldghtml += "<td class='BldgCnt'>" + planet.defense + "</td>";
                            pdppbldghtml += "<td class='BldgMax'>/&nbsp;" + vgap.plugins["plManagerPlugin"].maxBldgs(planet,50) + "</td></tr>"; 
                            //pdppbldghtml += "<td class='BldgBlt'>[+" + planet.builtdefense + "]</td></tr>";
                            pdppbldghtml += "</table>";
                            
                            // Set up the Resources Table
                            var pdppreshtml = "";
                            pdppreshtml += "<table class=PLResTable>";
                            pdppreshtml += "<thead></thead>";
                            
                            // Neutronium
                            pdppreshtml += "<tr><td class='ResName' align='right'>Neu</td>";
                            pdppreshtml += "<td class='ResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.neutronium) + ";'>" + planet.neutronium + "&nbsp;" + "</td>";
                            pdppreshtml += "<td class='ResGrd' align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundneutronium) + ";'><b> /&nbsp;" + planet.groundneutronium + "</b></td>"; 
                            pdppreshtml += "<td class='ResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densityneutronium) + ";'>" + planet.densityneutronium + "%</td>";
                            pdppreshtml += "<td class='ResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundneutronium, planet.densityneutronium) + "</td></tr>";
                            
                            // Duranium
                            pdppreshtml += "<tr><td class='ResName' align='right'>Dur</td>";
                            pdppreshtml += "<td class='ResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.duranium) + "; padding-left=0.5ex'>" + planet.duranium + "&nbsp;" + "</td>";
                            pdppreshtml += "<td class='ResGrd' align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundduranium) + ";'><b> /&nbsp;" + planet.groundduranium + "</b></td>";
                            pdppreshtml += "<td class='ResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densityduranium) + ";'>" + planet.densityduranium + "%</td>";
                            pdppreshtml += "<td class='ResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundduranium, planet.densityduranium) + "</td></tr>";
                            
                            // Tritanium
                            pdppreshtml += "<tr><td class='ResName' align='right'>Trit</td>";
                            pdppreshtml += "<td class='ResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.tritanium) + ";'>" + planet.tritanium + "&nbsp;" + "</td>";
                            pdppreshtml += "<td class='ResGrd'align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundtritanium) + ";'><b> /&nbsp;" + planet.groundtritanium + "</b></td>";
                            pdppreshtml += "<td class='ResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densitytritanium) + ";'>" + planet.densitytritanium + "%</td>";
                            pdppreshtml += "<td class='ResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundtritanium, planet.densitytritanium) + "</td></tr>";
                            
                            // Molybdenum
                            pdppreshtml += "<tr><td class='ResName' align='right'>Moly</td>";
                            pdppreshtml += "<td class='ResSfc' align='right' style='color: " + vgap.plugins["plManagerPlugin"].getMineralSfcColor(planet.molybdenum) + ";'>" + planet.molybdenum + "&nbsp;" + "</td>"; 
                            pdppreshtml += "<td class='ResGrd'align='left' style='color: " + vgap.plugins["plManagerPlugin"].getMineralGrdColor(planet.groundmolybdenum) + ";'><b> /&nbsp;" + planet.groundmolybdenum + "</b></td>";
                            pdppreshtml += "<td class='ResDen' style='color: " + vgap.plugins["plManagerPlugin"].getMineralDenColor(planet.densitymolybdenum) + ";'>" +  planet.densitymolybdenum + "%</td>";
                            pdppreshtml += "<td class='ResAmt'>" + vgap.plugins["plManagerPlugin"].miningAmtPerTurn(planet, planet.groundmolybdenum, planet.densitymolybdenum) + "</td></tr>";
                            pdppreshtml += "</table>";
                            
                            
                            
                            // Assemble the row : also had id='PLRow' class='RowSelect'
                            predhtml += "<tr class='PLRow'> \
<td>" + pdppinfhtml + "</td> \
<td>" + pdppbmhtml + "</td> \
<td>" + pdpppophtml + "</td> \
<td>" + pdpptaxhtml + "</td> \
<td>" + pdppmcsuphtml + "</td> \
<td>" + pdppbldghtml + "</td> \
<td>" + pdppreshtml + "</td></tr>";
                            
                        }
                        
                        predhtml += "</table>";
                        
                        // Put it all together 
                        html += "<table>";
                        html += "<tr><td id=pdimg rowspan = 2 width=350 height=350 style='cursor:pointer;'><img align=center width=300px height=300px src='" + planet.img + "'/></td>";
                        html += "<td align=left style='vertical-align: top;'>" + pinfohtml + "</td><td rowspan = 2 style='vertical-align: top;'>" + pophtml + "<td></td>";
                        html += "</tr>";
                        html += "<tr><td width=300>" + bldghtml + "</td><td></td></tr>";
                        html += "<tr><td colspan = 3>" + reshtml + "</td></tr>";
                        html += "<tr><td colspan = 3>" + predhdrhtml + "</td></tr>";
                        html += "<tr><td colspan = 3>" + predhtml + "</td></tr>";
                        html += "</table><br /></div>";
                        
                        
                        
                        
                    }
                    this.pane = $(html).appendTo(vgap.dash.content);
                    $('#pdimg').click(function() {
                        vgap.map.selectPlanet(planet.id);
                        //plg.showPlanetDetail(($(this).attr('data-plid')));
                    });
                }	 
                if (view == 2) {
                    
                    html += "<br /><table border='0' width='100%'>";
                    
                    html += "<tr><td>";
                    
                    html += "<h1>Planetary Management v" + plugin_version + "</h1><br />";
                    html += "<h4><i><b>by dotman</b></i></h4><br/>";		 
                    html += "<h2>Introduction</h2><p>Managing your planets to their maximum potential can be a time-consuming and confusing endeavour. This plugin was created to aid \
you in this task. You may create your \
own planet build methods and taxation strategies.  You can, for each planet, select a build method that determines how buildings are to be constructed, as well as \
select taxing methods for both your colonists and natives. Each turn, and again if you make any changes, you must click the planet icon to apply all of your changes. \
Finally, you can use the Planet Predictor in the planet detail view, to forecast what impact your chosen strategies will have on the planet over the next 50 turns.</p><br/>";
                    
                    html += "<p><iframe width='560' height='315' src='//www.youtube.com/embed/3wlie1DMTcc' frameborder='0' allowfullscreen></iframe></iframe></p>";
                    
                    html += "<p><h2>Planetary Management View</h2></p> \
<p>The planetary management view contains a list of all of the planets currently owned by you.  Here you select construction methods and taxation strategies \
to apply to these planets turn after turn.  Your selections are remembered from turn to turn, but you must click the small planet icon each turn to apply the \
methods.  This way you can spend a little time thinking about what you want this planet to do for you when you first colonize it, and then continually apply \
that strategy turn after turn, without having to think about or calculate the nitty-gritty details each turn, leaving you more time to contemplate your enemies' \
inevitable demise.  The view contains relevant info for each planet, and the method selected.  New planets default to 'Manual', which means no method is assigned \
and the plug-in will take no action with these planets.  You can then assign build and taxation methods, or leave it to manual if you prefer to handle this \
planet on your own.  Clicking on the planet's picture will take you to the planet detail view, which contains more information about the planet, as well as the \
Planet Predictor.</p><br/>";
                    
                    html += "<p>With version 1.11, features including filters and global method application were added to the plugin.  You can filter planets on the planetary management screen \
by clicking on one of the available filters, and apply any method to all planets shown on the screen by selecting the method and clicking on the 'Apply to All' button.\
See the video below for an overview.</p>";
                    
                    html += "<p><iframe width='560' height='315' src='//www.youtube.com/embed/rl4owPS9eGk' frameborder='0' allowfullscreen></iframe></p>";
                    
                    html += "<p><h2>Planet Detail View</h2></p> \
<p>The planet detail view contains more information about your planet than can be displayed in the planetary management list view.  It contains more information on \
population, including maximum possible populations for colonists and natives.  The resources view tells you the resource situation on the planet right now, and how \
many more turns it will take to mine all of the given mineral out the planet based on the current number of mines.  It also tells you, for reference, how long that \
would take if you had different amounts of mines on the planet.</p> \
<p>Below the Resources is the Planet Predictor, which forecasts your planet's development over the next 50 turns based on the building methods and taxation strategies you \
have selected.  At the top, it computes and displays some interesting metrics, such as when the planet will be able to build a starbase, how many turns until \
populations are maxed out, and mineral mining predictions based on your build and tax strategies.  Below that it shows you where the planet will be each turn, if the \
strategies are applied every turn and the planet is otherwise untouched, for the next 50 turns.  You can use the predictor, then, to compare your construction \
strategies and tax strategies to one another; simply go back to the planetary management list view, change the methods you like, and go back to the detail view to see \
how your forecast has changed.  Some strategies will maximize native growth, some colonist growth, and still others raw output of supplies and megacredits.  By \
selecting different methods and looking at the Planet Predictor, you can see how your selected methods stack up against one another and your goals for this planet.</p><br/>";
                    
                    html += "<p><h2>Planetary Construction Method Manager</h2></p> \
<p>The planetary construction method manager is where you create and remove your planetary structure building strategies.  At the top is a list of the current methods \
available - these are the default methods, and any methods you have created for this game.  If you click on a method, it will display text explaining how the method \
works to you.  You can also remove a method here, by selecting the method you'd like to remove and clicking 'Remove Build Method'.  The method will be removed \
immediately, and any planets that you had set to use that build method will revert to manual and will have to be reassigned.</p> \
<p>To create planetary structure construction methods, you can either use the wizard direct entry box.  To use the wizard, you give the method a name, and select or \
deselect the check box about converting supplies to megacredits, depending on if you want this method to do so or not.</p> \
<p>Next, select one of the images corresponding to what you want to build.  You can build factories, mines, defense posts, or a combination of factories and mines at a \
ratio.  Then fill out the amount box with a whole number.  If you select the factories+mines button, you will need to enter the amount of factories, the amount of \
mines, and select the ratio at which you'd like to build them. After you're happy with your entry, click 'Add to Method', and this piece will be added to your current \
method in the wizard.  You can now select another button, type in a new amount, and add that to the method... so you build up your construction method piece by piece- \
first build 14 factories, say, then 19 mines, then 15 defense posts.  When you're happy with the method, click the 'Create Method' button by the method name.  If the \
method checks out, ie, you entered valid values for all of the fields, the method will be added to your available methods.</p> \
<p>You may also enter a method by directly entering a build code.  The build code is what gets stored behind the scenes, and if you know how it works, you can simply \
enter one directly.  A build code has the following syntax:<br /> <br />\
(y/n)-(f/m/d/rfm)-Integer-(Int)-(Int)-...<br/><br /> \
So, for instance, to build 15 factories, and allow supplies to be converted to megacredits, the code would be y-f-15 .  To build 15 mines and then 20 defense posts, \
without converting supplies to megacredits, the code would be n-m-15-d-20 .  The 'rfm' key has a slightly different syntax; it stands for ratio-factories-mines, and \
you have to give it a maximum factory value, a maximum mine value, and the first part of the ratio, ie, 2:1 would be 2, 5:1 would be 5.  The ratio is always a ratio to \
1, and it must be a whole number.  So to build up to 400 factories and 150 mines, at a ratio of 7 factories for every mine, allowing supplies to be converted to \
megacredits, the code would be y-rfm-400-150-7.</p><br/>";
                    
                    html += "<p><iframe width='560' height='315' src='//www.youtube.com/embed/5v52gSlmC6k' frameborder='0' allowfullscreen></iframe></p>";
                    
                    html += "<p><h2>Taxation Method Manager</h2></p> \
<p>The taxation method manager is used to create and remove taxation strategies for both colonists and natives.  At the top is a list of the current methods available - \
these are the default methods, and any methods you have created for this game.  If you click on a method, it will display text explaining how the method works to you. \
You can also remove a method here, by selecting the method you'd like to remove and clicking 'Remove Taxation Method'.  The method will be removed immediately, and any \
planets that you had set to use that taxation method will revert to manual and will have to be reassigned.</p>\
<p>To create a taxation method, you use the form below the methods. First, you need to give your method a unique name.  Next, you select whether this method is to be \
available for use for colonists, natives, or both; your selection here will decide which methods are available in the drop-down boxes for colonists and natives when \
assigning a method to a planet.</p> \
<p>Below that, there are three sections.  The first is the main method, and this is the method that will be applied normally.  Next is a section for if the population is \
greater than 6,600,000 clans; this is the population at which normal growth is cut in half, and so if you want to specify a different tax method in that case, you can \
specify it here; otherwise, you select 'Same as Main Method'.  Third is a section for when the population reaches its maximum; if you want to specify a different \
method in that case, you do so here; otherwise, you select 'Same as Main Method'.  Note that if you select this, but the maximum population is actually greater than \
6,600,000 clans and you've specified a different method for that portion, that is the method that will actually be applied.</p>\
<p>Currently there are two choices when defining how a tax method will work - Growth or Safe.  Safe tax is designed to tax at the maximum amount possible until the \
happiness reaches a value that you set, and then continue taxing to maintain that happiness.  Growth taxing is designed to tax at the maximum amount possible until the \
happiness reaches a value that you set, and then not tax for a number of turns until the happiness recovers to another value that you set.  Because the growth method \
includes a number of turns where you're taxing at 0%, the population tends to grow faster under this method (hence the name), although you sacrifice a bit in immediate \
tax income.</p>\
<p>For every method, the method will only tax as much as is required to get the megacredits you can actually collect.  So if, for instance, you can apply a 20% tax for \
1500mc that will get you down to 70 happiness on the natives, but you only have enough colonists to actually collect 253mc, the method will only tax at the 4% rate or \
whatever that will get you the megacredits you can collect, without the 'wasted' happiness penalty.Hissing ships are accounted for in all methods for all races.  \
Other effects such as the Avian happiness bonus, etc, are also accounted for.</p> \
<p>For the main method, if you choose 'Growth', you need to enter a minimum happiness value that you want to tax down to, and a maximum happiness value that you want to \
recover to before taxing again.  If you choose 'Safe', you need only enter the minimum happiness value that you want to tax down to.  In the main method, you may also \
specify a minimum number of clans that the planet must have before beginning this tax strategy.  If the planet doesn't meet the minimum, the population will be taxed \
at 0% for maximum growth until the population reaches the minimum.</p> \
<p>Once you're happy with all of your settings, click the 'Create Taxation Method' button at the bottom of the form, and if you've entered proper values in the fields, \
you will see your method created in the list of methods, and you will be able to apply it to planets.</p><br/>";
                    
                    html += "<p><iframe width='560' height='315' src='//www.youtube.com/embed/3JWTyGgdNSM' frameborder='0' allowfullscreen></iframe></p>";
                    
                    html += "<hr /><p><h2><b>Reset All Methods</b></h2><br />Warning: Pushing this method will reset all planets to manual, and remove \
all custom build and tax methods.<br />";
                    html += "<button id='FullResetBtn'>Reset All Methods</button><br /></p>";
                    html += "<p><div id = 'FullResetDiv'></div>";
                    
                    html += "</td></tr>"	
                    
                    html += "</table><br /></div>";
                    
                    this.pane = $(html).appendTo(vgap.dash.content);							
                    
                    $('#FullResetBtn').click(function() {
                        plg.resetAllNotes();
                        //$('#BMWizStatusText').replaceWith("<td colspan = 2 align='center' color='red' id='BMWizStatusText'>Invalid Code Addition.  Amounts must be whole numbers.</td>");	
                    });
                    
                }
                
                if (view == 3) {
                    // Build Methods View
                    // Disable hotkeys to allow entries
                    vgap.hotkeysOn = false;
                    
                    
                    // Construct PM Header
                    var pmheaderhtml = "<table><tr><td><h1>Planetary Construction Method Manager</h1><br /></td></tr>";
                    pmheaderhtml += "<tr><td>Here you may create or remove building construction methods.";					
                    pmheaderhtml += "</td></tr></table>";
                    
                    
                    // Construct the method review pane
                    var mrevhtml = "<table id = 'BMSelTable'><tr><td colspan=2><b>Current Methods:</b><br /></td></tr>";
                    mrevhtml += "<tr><td rowspan = 2><select name='BMSelect' id='BMSelect' size='8'>";
                    if (debug) console.log("Populating select, buildmethods is " + plg.buildmethods + ", length is " + plg.buildmethods.length);
                    for (var i=0; i < plg.buildmethods.length; i++) {
                        mrevhtml += "<option value='" + i + "'>" + plg.buildmethods[i][0] + "</option>";
                    }
                    mrevhtml += "</select></td>";
                    mrevhtml += "<td id='BMMethText'>No Method Selected.</td></tr>";
                    mrevhtml += "<tr><td><button id='BMRemoveMethodBtn'>Remove Build Method</button></td></tr>";
                    mrevhtml += "</table>";
                    
                    // Construct Direct Entry Method
                    var dehtml = "<div id='BMDEDiv'><p><h2>Create Planetary Construction Method - Direct Entry</h2></p> \
<p>You may create a build method by directly entering a valid build code.  See the help for details.  Here are a few examples: \
<ul><li>To build 14 factories, then 19 mines, then 20 defense posts, allowing supplies to be converted to megacredits if necessary:<br \> \
<b>y-f-14-m-19-d-20</b><br \>&nbsp;</li> \
<li>To build 30 factories, then 20 mines, then up to 100 factories and 200 mines, building factories at a 2:1 ratio (twice as fast), and not allowing supplies to be converted to megacredits:<br \> \
<b>n-f-30-m-20-rfm-100-200-2</b><br \>&nbsp;</li> \
</ul></p>";
                    
                    dehtml += "<p><h4>Enter your build code here:&nbsp;&nbsp;</h4>";
                    dehtml += "<div id='DEBMStatusText'></div>";
                    dehtml += "<fieldset id='BMFieldset'><legend id='BMLegend'>Build Method Entry</legend> \
<label>Method Name:<br /> \
<input id='BMName' name='bmnamebox' maxlength='16' type='text'></label><br /><br /> \
<label>Method Build Code:<br /> \
<input id='BMCode' name='bmcodebox' type='text'></label><br /><br /> \
<button id='BMBtn' name='bmcodebtn'>Create Build Method</button></fieldset>";
                    dehtml += "</p></div>";
                    
                    
                    // Construct a row of the wizard entry table
                    var wizhtml = "<div id='BMWizDiv'><table id='BMWizTable'><tr><td colspan = 2><h2>Create Planetary Construction Method - Wizard</h2></td></tr>";
                    
                    
                    var wizmethhtml = "<fieldset id='BMWizMethFieldset'><legend>Create Method</legend> \
Method Name:<br /> \
<input id='BMWizName' name='bmnamebox' maxlength='16' type='text'></label> \
<button id='BMWizAddMethodBtn'>Create Build Method</button><br /><br /> \
<input type='checkbox' name='wizcheck' id='BMWizBurnSupCheck' value ='c' checked />Convert Supplies to MC?<br /> \
</fieldset>";
                    
                    
                    var wizbtnhtml = "<fieldset id='BMWizFieldset'><legend>Build Method Section Builder</legend> \
<input type='radio' value='f' name='wizrad' id='BMWizFRad' checked /> \
<img src='http://play.planets.nu/img/icons/factory.png' height='25' width='25'></img> \
<input type='radio' value='m' name='wizrad' id='BMWizMRad' /> \
<img src='http://play.planets.nu/img/icons/mine.png' height='25' width='25'></img> \
<input type='radio' value='d' name='wizrad' id='BMWizDRad' /> \
<img src='http://play.planets.nu/img/icons/defense.png' height='25' width='25'></img> \
<input type='radio' value='rfm' name='wizrad' id='BMWizRFMRad' /> \
<img src='http://play.planets.nu/img/icons/factory.png' height='25' width='25'></img>+ \
<img src='http://play.planets.nu/img/icons/mine.png' height='25' width='25'></img> \
<br /> \
<div id='BMWizAmt1'> \
<label>Amount: \
<input type='text' id='BMWizAmtTxt1'></label></div> \
<div id='BMWizAmt2' style='display: none;'> \
<label>2nd Amount: \
<input type='text' id='BMWizAmtTxt2'></label></div> \
<div id='BMWizRatio' style='display: none;'> \
<label>Ratio: </label>\
<input type='radio' value='2' name='wizratrad' id='BMWizRatRad2' checked/>2:1 \
<input type='radio' value='3' name='wizratrad' id='BMWizRatRad3' />3:1 \
<input type='radio' value='5' name='wizratrad' id='BMWizRatRad5' />5:1 \
<input type='radio' value='10' name='wizratrad' id='BMWizRatRad10' />10:1 \
</div><br /> \
<button id='BMWizAddBtn'>Add To Method</button></fieldset>";
                    
                    wizhtml += "<tr><td colspan = 2><div id='BMWizMethStatusText'></div></td></tr>";
                    wizhtml += "<tr><td colspan = 2>" + wizmethhtml + "</td>";
                    wizhtml += "<tr><td align='center' colspan = 2 id='BMWizCode'><h3><b>" + plg.bmwizcode + "</b></h3></td></tr>";
                    wizhtml += "<tr><td align='center' colspan = 2 id='BMWizText'><h3><b>" + plg.bmwiztext + "</b></h3></td></tr>";
                    wizhtml += "<tr><td><button id='BMWizRemoveBtn'>Remove Last Piece</button></td>";
                    wizhtml += "<td><button id='BMWizClearBtn'>Clear</button></td></tr>";
                    wizhtml += "<tr><td colspan = 2 align='center' id='BMWizStatusText'></td></tr>";
                    wizhtml += "<tr><td colspan = 2>" + wizbtnhtml + "</td>";
                    wizhtml += "</table></div>";
                    
                    
                    // Put it all together
                    html += "<br /><table id = 'BMMainTable' border='0' width='100%'>";
                    html += "<tr><td colspan = 2>";
                    html += pmheaderhtml;
                    html += "</td></tr>";
                    html += "<tr><td colspan = 2>";
                    html += mrevhtml;
                    html += "</td></tr>";
                    
                    html += "<tr><td valign='top'>" + wizhtml + "</td><td valign='top'>" + dehtml + "</td></tr>";
                    html += "</table><br /></div>";
                    html += "<br /><br /><br /><br /><br /><br /><br /><br />";
                    html += "<br /><br /><br /><br /><br /><br /><br /><br />";
                    html += "<br /><br /><br /><br /><br /><br /><br /><br />some text<hr />";
                    
                    this.pane = $(html).appendTo(vgap.dash.content);							
                    
                    $('#BMBtn').click(function() {
                        var mname = $('#BMName').val();
                        var mcode = $('#BMCode').val();
                        var namesame = false;
                        if (plg.checkBuildCode(mcode)) {
                            // True is good, check to see if the name is in use
                            for (var i = 0; i < plg.buildmethods.length; i++) {
                                console.log("Comparing names, bm["+i+"]="+plg.buildmethods[i][0]+" , new name is " + mname);
                                if (plg.buildmethods[i][0] == mname) {
                                    // Name in use
                                    $('#DEBMStatusText').replaceWith("<div id='DEBMStatusText'>Method Name Already In Use, method not added.<br /></div>");	
                                    namesame = true;
                                }
                            }
                            // Code's good, add it
                            if (!namesame) {
                                console.log("Method good, adding...");
                                plg.buildmethods.push([mname,mcode]);
                                plg.saveObjectAsNote(4, plg.notetype, [plugin_version,plg.buildmethods]);
                                plg.displayPM(3);
                            }
                        }
                        else {
                            $('#DEBMStatusText').replaceWith("<div id='DEBMStatusText'>Code invalid, try again.<br /></div>");	
                        }
                    });
                    
                    $('#BMWizAddMethodBtn').click(function() {
                        var mname = $('#BMWizName').val();
                        var mcode = plg.bmwizcode;
                        var namesame = false;
                        if (plg.checkBuildCode(mcode)) {
                            // True is good, check to see if the name is in use
                            for (var i = 0; i < plg.buildmethods.length; i++) {
                                if (debug) console.log("Comparing names, bm["+i+"]="+plg.buildmethods[i][0]+" , new name is " + mname);
                                if (plg.buildmethods[i][0] == mname) {
                                    // Name in use
                                    $('#BMWizMethStatusText').replaceWith("<div id='BMWizMethStatusText'>Method Name Already In Use, method not added.<br /></div>");	
                                    namesame = true;
                                }
                            }
                            // Code's good, add it
                            
                            if (!namesame) {
                                if (debug) console.log("Method good, adding...");
                                plg.buildmethods.push([mname,mcode]);
                                plg.saveObjectAsNote(4, plg.notetype, [plugin_version,plg.buildmethods]);
                                // Bug Fix (6): Clear bmwizcode and text on add
                                plg.bmwizcode = "";
                                plg.bmwiztext = "";
                                
                                plg.displayPM(3);
                            }
                        }
                        else {
                            //<div id='DEBMStatusText'></div>
                            $('#BMWizMethStatusText').replaceWith("<div id='BMWizMethStatusText'>Code invalid, try again.<br /></div>");	
                            //alert("Code bad!");
                        }
                    });
                    
                    $('#BMRemoveMethodBtn').click(function() {
                        var bmind = $('#BMSelect').val();
                        // Remove the method
                        plg.buildmethods.splice(bmind,1);
                        // Adjust the bmarray as necessary
                        for (var i = 0; i < plg.bmarray.length; i++) {
                            if (plg.bmarray[i] == bmind) {
                                // Convert all items that were this build method to manual
                                plg.bmarray[i] = 'm';
                            }
                            if (plg.bmarray[i] != 'm' && plg.bmarray[i] > bmind) {
                                // Adjust all others higher down one so they still match
                                plg.bmarray[i] -= 1;
                            }
                        }
                        plg.saveObjectAsNote(4, plg.notetype, [plugin_version,plg.buildmethods]);
                        plg.displayPM(3);
                    });
                    
                    $('#BMRadWiz').change(function () {
                        if (debug) console.log("wizhtml button clicked");
                        if ($('#BMRadWiz').attr('checked')) {
                            console.log("BMRADWiz is checked");
                            $('#BMRightPane').replaceWith("<td id='BMRightPane'>" + wizhtml + "</td>");						
                        }
                    });
                    
                    $('#BMRadDE').change(function () {
                        if (debug) console.log("dehtml button clicked");
                        if ($('#BMRadDE').attr('checked'))  {
                            $('#BMRightPane').replaceWith("<td id='BMRightPane'>" + dehtml + "</td>");
                            console.log("BMRadDE is checked.");
                        }
                    });
                    
                    $('#BMWizFRad').click(function () {
                        $('#BMWizAmt2').hide();
                        $('#BMWizRatio').hide();
                    });
                    
                    $('#BMWizMRad').click(function () {
                        $('#BMWizAmt2').hide();
                        $('#BMWizRatio').hide();
                    });
                    
                    $('#BMWizDRad').click(function () {
                        $('#BMWizAmt2').hide();
                        $('#BMWizRatio').hide();
                    });
                    
                    $('#BMWizRFMRad').click(function () {
                        $('#BMWizAmt2').show();
                        $('#BMWizRatio').show();
                    });
                    
                    $('#BMWizRemoveBtn').click(function () {
                        if (plg.bmwizcode != "") {
                            var splitarray = [];
                            splitarray = plg.bmwizcode.split('-');
                            var splitlength = splitarray.length;
                            
                            if (splitlength <= 3 || (splitlength <= 5 && splitarray[1] == 'rfm'))
                                document.getElementById("BMWizClearBtn").click();
                            else {
                                var mcode = splitarray[0];
                                if (splitarray[splitlength-4] == 'rfm') {
                                    for (var i = 1; i < splitlength - 4; i++)
                                        mcode += "-" + splitarray[i];
                                }
                                else {
                                    for (var i = 1; i < splitlength - 2; i++)
                                        mcode += "-" + splitarray[i];
                                    
                                }
                                plg.bmwizcode = mcode;
                                $('#BMWizCode').replaceWith("<td align='center' colspan = 2 id='BMWizCode'><h3><b>" + plg.bmwizcode + "</b></h3></td>");	
                                $('#BMWizText').replaceWith("<td align='center' colspan = 2 id='BMWizText'><h3><b>" + plg.bmwiztext + "</b></h3></td>");
                                $('#BMWizStatusText').replaceWith("<td colspan = 2 align='center' color='green' id='BMWizStatusText'>Last Piece Removed.</td>");
                            }
                        }
                        
                    });
                    
                    $('#BMWizClearBtn').click(function () {
                        plg.bmwizcode = "";
                        plg.bmwiztext = "";
                        
                        $('#BMWizCode').replaceWith("<td align='center' colspan = 2 id='BMWizCode'><h3><b>" + plg.bmwizcode + "</b></h3></td>");	
                        $('#BMWizText').replaceWith("<td align='center' colspan = 2 id='BMWizText'><h3><b>" + plg.bmwiztext + "</b></h3></td>");
                        $('#BMWizStatusText').replaceWith("<td colspan = 2 align='center' color='green' id='BMWizStatusText'>Method Cleared.</td>");
                        
                    });
                    
                    $('#BMWizBurnSupCheck').click(function () {
                        if (debug) console.log("BMWIZBURNSUP CLICKED");
                        if (plg.bmwizcode != "") {
                            if (plg.bmwizcode.charAt(0) == 'n')
                                plg.bmwizcode = 'y' + plg.bmwizcode.substring(1);
                            else
                                plg.bmwizcode = 'n' + plg.bmwizcode.substring(1);
                            
                            plg.bmwiztext = plg.getBuildCodeText(plg.bmwizcode);
                            $('#BMWizCode').replaceWith("<td align='center' colspan = 2 id='BMWizCode'><h3><b>" + plg.bmwizcode + "</b></h3></td>");	
                            $('#BMWizText').replaceWith("<td align='center' colspan = 2 id='BMWizText'><h3><b>" + plg.bmwiztext + "</b></h3></td>");
                        }
                    });
                    
                    $('#BMWizAddBtn').click(function () {
                        
                        if (plg.bmwizcode == "") {
                            if ($('#BMWizBurnSupCheck').attr('checked')) {
                                plg.bmwizcode = "y";
                            }
                            else {
                                plg.bmwizcode = "n";
                            }
                        }
                        var mcode = "";
                        
                        if ($('#BMWizFRad').attr('checked')) {
                            mcode += "-f-" + $('#BMWizAmtTxt1').val();
                        }
                        if ($('#BMWizMRad').attr('checked')) {
                            mcode += "-m-" + $('#BMWizAmtTxt1').val();
                        }
                        if ($('#BMWizDRad').attr('checked')) {
                            mcode += "-d-" + $('#BMWizAmtTxt1').val();
                        }
                        if ($('#BMWizRFMRad').attr('checked')) {
                            mcode += "-rfm-" + $('#BMWizAmtTxt1').val();
                            mcode += "-" + $('#BMWizAmtTxt2').val();
                            if ($('#BMWizRatRad2').attr('checked'))
                                mcode += "-2";
                            if ($('#BMWizRatRad3').attr('checked'))
                                mcode += "-3";
                            if ($('#BMWizRatRad5').attr('checked'))
                                mcode += "-5";
                            if ($('#BMWizRatRad10').attr('checked'))
                                mcode += "-10";
                            console.log("Attempting RFM Add: mcode = " + mcode);
                        }
                        
                        if (plg.checkBuildCode(plg.bmwizcode + mcode)) {
                            // The code is good
                            plg.bmwizcode += mcode;
                            plg.bmwiztext = plg.getBuildCodeText(plg.bmwizcode);
                            if (debug) console.log("Adding text: " + plg.bmwizcode);
                            $('#BMWizCode').replaceWith("<td align='center' colspan = 2 id='BMWizCode'><h3><b>" + plg.bmwizcode + "</b></h3></td>");	
                            $('#BMWizText').replaceWith("<td align='center' colspan = 2 id='BMWizText'><h3><b>" + plg.bmwiztext + "</b></h3></td>");
                            $('#BMWizStatusText').replaceWith("<td colspan = 2 align='center' color='green' id='BMWizStatusText'>Section Added.</td>");
                        }
                        else {
                            $('#BMWizStatusText').replaceWith("<td colspan = 2 align='center' color='red' id='BMWizStatusText'>Invalid Code Addition.  Amounts must be whole numbers.</td>");
                        }
                        
                        
                    });
                    
                    
                    $('#BMSelect').change(function () {
                        var bmind = $('#BMSelect').val();
                        var buildtext = plg.getBuildCodeText(plg.buildmethods[bmind][1]);
                        $('#BMMethText').replaceWith("<td id='BMMethText'><b>" + plg.buildmethods[bmind][0] + ":&nbsp;</b>" + buildtext + "</td>");	
                        
                    });
                }
                
                if (view == 4) {
                    // Taxation Methods View
                    
                    // Disable hotkeys to allow entries
                    vgap.hotkeysOn = false;
                    
                    var tmheaderhtml = "<table><tr><td><h1>Taxation Method Manager</h1><br /></td></tr>";
                    tmheaderhtml += "<tr><td>Here you may create or remove taxation methods.";					
                    tmheaderhtml += "</td></tr></table>";
                    
                    
                    // Construct the taxation method review pane
                    var tmrevhtml = "<table id = 'TMSelTable'><tr><td colspan=2>Current Taxation Methods:<br /></td></tr>";
                    tmrevhtml += "<tr><td rowspan = 2><select name='TMSelect' id='TMSelect' size='8'>";
                    for (var i=0; i < plg.taxmethods.length; i++) {
                        tmrevhtml += "<option value='" + i + "'>" + plg.taxmethods[i].name + "</option>";
                    }
                    tmrevhtml += "</select></td>";
                    tmrevhtml += "<td id='TMMethText'>No Method Selected.</td></tr>";
                    tmrevhtml += "<tr><td><button id='TMRemoveMethodBtn'>Remove Taxation Method</button></td></tr>";
                    tmrevhtml += "</table>";
                    
                    // Construct the taxation method builder wizard
                    
                    var tmwizmethhtml = "<div id='TMWiz'><fieldset id='TMWizMethFieldset'><legend>Create Tax Method</legend> \
<h3><b>Method Name:</b></h3><br /> \
<input id='TMWizName' name='tmnamebox' maxlength='24' type='text'></label><br \><br /> \
Available for Natives, Colonists, or Both: <br /> \
<input type='checkbox' name='TMWizCheckC' id='TMWizCheckC' value ='C' checked />Colonists \
<input type='checkbox' name='TMWizCheckN' id='TMWizCheckN' value ='N' checked />Natives <br \> \
<div id='TMWizMethStatusText'><br /></div> \
<h3><b>Main Method:</b></h3><br /> \
Method Type: <br />\
<input type='radio' value='Growth' name='tmmethrad' id='TMMethRadG' checked /> \
Growth \
<input type='radio' value='Safe' name='tmmethrad' id='TMMethRadS' /> \
Safe <br /> \
<input type='radio' value='Riot' name='tmmethrad' id='TMMethRadR' /> \
Riot <br /> \
<input type='radio' value='No Tax' name='tmmethrad' id='TMMethRadN' /> \
No Tax <br /> \
<input type='radio' value='Auto Tax' name='tmmethrad' id='TMMethRadA' /> \
Auto Tax <br /> \
Parameters: <br />\
<div id='TMWizMinHappy'> \
<label>Minimum Happiness: \
<input type='text' id='TMWizMinHappyTxtBox'></label></div> \
<div id='TMWizMaxHappy'> \
<label>Maximum Happiness: \
<input type='text' id='TMWizMaxHappyTxtBox'></label></div> \
<div id='TMWizMinClans'> \
<label>Minimum Clans: \
<input type='text' id='TMWizMinClansTxtBox'></label></div><br \><br \> \
\
<h3><b>If Population is Greater than 6,600,000 (growth cut in half):</b></h3><br /> \
<input type='radio' value='Growth' name='tmmidselrad' id='TMMidMethRadSame'  /> \
Same as Main Method \
<input type='radio' value='Safe' name='tmmidselrad' id='TMMidMethRadDiff' checked/> \
Specify a Different Method <br /> \
<div id='TMWizMidMethod'> \
<div id='TMWizMidMethStatusText'><br /></div> \
Method Type: <br />\
<input type='radio' value='Growth' name='tmmidmethrad' id='TMMidMethRadG' checked /> \
Growth \
<input type='radio' value='Safe' name='tmmidmethrad' id='TMMidMethRadS' /> \
Safe <br /> \
<input type='radio' value='Riot' name='tmmidmethrad' id='TMMidMethRadR' /> \
Riot <br /> \
<input type='radio' value='No Tax' name='tmmidmethrad' id='TMMidMethRadN' /> \
No Tax <br /> \
<input type='radio' value='Auto Tax' name='tmmidmethrad' id='TMMidMethRadA' /> \
Auto Tax <br /> \
Parameters: <br />\
<div id='TMWizMidMinHappy'> \
<label>Minimum Happiness: \
<input type='text' id='TMWizMidMinHappyTxtBox'></label></div> \
<div id='TMWizMidMaxHappy'> \
<label>Maximum Happiness: \
<input type='text' id='TMWizMidMaxHappyTxtBox'></label></div><br \><br \></div> \
\
<h3><b>If Population is at Maximum:</b></h3><br /> \
<input type='radio' value='Growth' name='tmmaxselrad' id='TMMaxMethRadSame'  /> \
Same as Main Method \
<input type='radio' value='Safe' name='tmmaxselrad' id='TMMaxMethRadDiff' checked /> \
Specify a Different Method <br /> \
<div id='TMWizMaxMethod'> \
<div id='TMWizMaxMethStatusText'><br /></div> \
Method Type: <br />\
<input type='radio' value='Growth' name='tmmaxmethrad' id='TMMaxMethRadG' checked /> \
Growth \
<input type='radio' value='Safe' name='tmmaxmethrad' id='TMMaxMethRadS' /> \
Safe <br /> \
Parameters: <br />\
<div id='TMWizMaxMinHappy'> \
<label>Minimum Happiness: \
<input type='text' id='TMWizMaxMinHappyTxtBox'></label></div> \
<div id='TMWizMaxMaxHappy'> \
<label>Maximum Happiness: \
<input type='text' id='TMWizMaxMaxHappyTxtBox'></label></div><br \><br \><br /></div> \
<button id='TMWizAddMethodBtn'>Create Taxation Method</button><br /> \
</fieldset></div>";
                    
                    html += "<br /><table border='0' width='100%'>";
                    
                    html += "<tr><td colspan = 2>";
                    html += tmheaderhtml;
                    html += "</td></tr>";
                    
                    html += "<tr><td colspan = 2>";
                    html += tmrevhtml;
                    html += "</td></tr>";
                    
                    html += "<tr><td>" + tmwizmethhtml + "</td></tr>";
                    html += "</table><br /></div>";
                    
                    
                    
                    this.pane = $(html).appendTo(vgap.dash.content);
                    
                    $('#TMWizAddMethodBtn').click(function () {
                        
                        var newtmodel = new Object();
                        
                        newtmodel.name = $('#TMWizName').val();
                        
                        newtmodel.method = "";
                        if ($('#TMMethRadG').attr('checked'))
                            newtmodel.method = "Growth";
                        if ($('#TMMethRadS').attr('checked'))
                            newtmodel.method = "Safe";
                        
                        newtmodel.taxType = "";
                        if ($('#TMWizCheckC').attr('checked'))
                            newtmodel.taxType += "C";
                        if ($('#TMWizCheckN').attr('checked'))
                            newtmodel.taxType += "N";
                        
                        newtmodel.minHappy = $('#TMWizMinHappyTxtBox').val();
                        newtmodel.maxHappy = $('#TMWizMaxHappyTxtBox').val();
                        newtmodel.minClans = $('#TMWizMinClansTxtBox').val().replace (/,/g, "");
                        if (newtmodel.minClans == "")
                            newtmodel.minClans = 0;
                        
                        // New stuff
                        if ($('#TMMidMethRadSame').attr('checked')) {
                            newtmodel.midsame = true;
                            newtmodel.midmethod = "";
                            newtmodel.midMinHappy = "";
                            newtmodel.midMaxHappy = "";
                        }
                        if ($('#TMMidMethRadDiff').attr('checked')){
                            newtmodel.midsame = false;
                            if ($('#TMMidMethRadG').attr('checked'))
                                newtmodel.midmethod = "Growth";
                            if ($('#TMMidMethRadS').attr('checked'))
                                newtmodel.midmethod = "Safe";
                            if ($('#TMMidMethRadR').attr('checked'))
                                newtmodel.midmethod = "Riot";
                            if ($('#TMMidMethRadN').attr('checked'))
                                newtmodel.midmethod = "No Tax";
                            if ($('#TMMidMethRadA').attr('checked'))
                                newtmodel.midmethod = "Auto Tax";
                            newtmodel.midMinHappy = $('#TMWizMidMinHappyTxtBox').val();
                            newtmodel.midMaxHappy = $('#TMWizMidMaxHappyTxtBox').val();
                        }
                        if ($('#TMMaxMethRadSame').attr('checked')) {
                            newtmodel.maxsame = true;
                            newtmodel.maxmethod = "";
                            newtmodel.maxMinHappy = "";
                            newtmodel.maxMaxHappy = "";
                        }
                        if ($('#TMMaxMethRadDiff').attr('checked')){
                            newtmodel.maxsame = false;
                            if ($('#TMMaxMethRadG').attr('checked'))
                                newtmodel.maxmethod = "Growth";
                            if ($('#TMMaxMethRadS').attr('checked'))
                                newtmodel.maxmethod = "Safe";
                            if ($('#TMMidMethRadR').attr('checked'))
                                newtmodel.midmethod = "Riot";
                            if ($('#TMMidMethRadN').attr('checked'))
                                newtmodel.midmethod = "No Tax";
                            if ($('#TMMidMethRadA').attr('checked'))
                                newtmodel.midmethod = "Auto Tax";
                            newtmodel.maxMinHappy = $('#TMWizMaxMinHappyTxtBox').val();
                            newtmodel.maxMaxHappy = $('#TMWizMaxMaxHappyTxtBox').val();
                        }
                        
                        if (debug) console.log("Checking, max max happy = " + newtmodel.maxMaxHappy);
                        if (debug) console.log("Checking, max method = " + newtmodel.maxmethod);
                        var modelgood = plg.checkTaxModel(newtmodel);
                        if (modelgood) {
                            if (newtmodel.method == "Safe")
                                newtmodel.maxHappy = 100;
                            var namesame = false;
                            
                            // Check if name is in use
                            for (var i = 0; i < plg.taxmethods.length; i++) {
                                
                                if (plg.taxmethods.name == newtmodel.name) {
                                    // Name in use
                                    $('#TMWizMethStatusText').replaceWith("<div id='TMWizMethStatusText'>Method Name Already In Use, method not added.<br /></div>");	
                                    namesame = true;
                                }
                            }
                            // Code's good, add it
                            
                            if (!namesame) {
                                if (debug) console.log("Method good, adding...");
                                plg.taxmethods.push(newtmodel);
                                plg.saveObjectAsNote(5, plg.notetype, [plugin_version,plg.taxmethods]);
                                plg.displayPM(4);
                            }
                        }
                        else {
                            $('#TMWizMethStatusText').replaceWith("<div id='TMWizMethStatusText'>Method invalid, try again.<br /></div>");	
                        }
                        
                        
                        
                    });
                    
                    $('#TMMethRadS').click(function () {
                        $('#TMWizMaxHappy').hide();
                    });
                    
                    $('#TMMethRadG').click(function () {
                        $('#TMWizMaxHappy').show();
                    });
                    
                    $('#TMMidMethRadSame').click(function () {
                        $('#TMWizMidMethod').hide();
                    });
                    
                    $('#TMMidMethRadDiff').click(function () {
                        $('#TMWizMidMethod').show();
                    });
                    
                    $('#TMMaxMethRadSame').click(function () {
                        $('#TMWizMaxMethod').hide();
                    });
                    
                    $('#TMMaxMethRadDiff').click(function () {
                        $('#TMWizMaxMethod').show();
                    });
                    
                    $('#TMMidMethRadS').click(function () {
                        $('#TMWizMidMaxHappy').hide();
                    });
                    
                    $('#TMMidMethRadG').click(function () {
                        $('#TMWizMidMaxHappy').show();
                    });
                    
                    $('#TMMaxMethRadS').click(function () {
                        $('#TMWizMaxMaxHappy').hide();
                    });
                    
                    $('#TMMaxMethRadG').click(function () {
                        $('#TMWizMaxMaxHappy').show();
                    });
                    
                    $('#TMRemoveMethodBtn').click(function() {
                        var tmind = $('#TMSelect').val();
                        // Remove the method
                        plg.taxmethods.splice(tmind,1);
                        // Adjust the ctarray as necessary
                        for (var i = 0; i < plg.ctarray.length; i++) {
                            if (plg.ctarray[i] == tmind) {
                                // Convert all items that were this tax method to manual
                                plg.ctarray[i] = 'm';
                            }
                            if (plg.ctarray[i] != 'm' && plg.ctarray[i] > tmind) {
                                // Adjust all others higher down one so they still match
                                plg.ctarray[i] -= 1;
                            }
                        }
                        
                        // Adjust the ntarray as necessary
                        for (var i = 0; i < plg.ntarray.length; i++) {
                            if (plg.ntarray[i] == tmind) {
                                // Convert all items that were this tax method to manual
                                plg.ntarray[i] = 'm';
                            }
                            if (plg.ntarray[i] != 'm' && plg.ntarray[i] > tmind) {
                                // Adjust all others higher down one so they still match
                                plg.ntarray[i] -= 1;
                            }
                        }
                        
                        plg.saveObjectAsNote(5, plg.notetype, [plugin_version,plg.taxmethods]);
                        plg.displayPM(4);
                    });
                    
                    $('#TMRad1').click(function () {
                        plg.selTaxModel = taxModel1;
                        $('#TMData').replaceWith("<td id='TMData'>Method: " + plg.selTaxModel.method + "</td>");	
                    });
                    
                    $('#TMSelect').change(function () {
                        var tmind = $('#TMSelect').val();
                        var taxtext = plg.getTaxText(plg.taxmethods[tmind]);
                        $('#TMMethText').replaceWith("<td id='TMMethText'><b>" + plg.taxmethods[tmind].name + ":&nbsp;</b>" + taxtext + "</td>");	
                        
                    });
                    
                }
                
                //this.content.fadeIn();
                //$("#PlanetTable").tablesorter();
                this.pane.jScrollPane();
                
                // vgap.action added for the assistant (Alex):
                vgap.CurrentView = "showPlanets";
                vgap.showPlanetsViewed = 1;
                
                
                
            },
        
        /* Initial Read in Functions
			 * The following functions handle reading of the notes, and 
			 * resetting of arrays if necessary.
			 */
        getMaxId: function() {
            var maxid = 1;
            for (var i = 0; i < vgap.planets.length; i++) {
                if (vgap.planets[i].id > maxid)
                    maxid = vgap.planets[i].id;
            }
            return maxid;	
        },
        
        validateArrays: function() {
            var plg = vgap.plugins["plManagerPlugin"];
            var maxid = plg.getMaxId();
            console.log("Validating Arrays...");
            
            // Validate BMArray
            console.log("Validating BMArray...");
            if (plg.bmarray.length < maxid) {
                if (debug) console.log("Invalid BMArray length found, correcting...");
                // The array is not the correct length, make it right
                for (var i = plg.bmarray.length; i <= maxid; i++) {
                    plg.bmarray[i] = 'm';
                }
            }
            // Make sure there are no nulls or blanks
            for (var j = 0; j < plg.bmarray.length; j++) {
                if (plg.bmarray[j] == null || plg.bmarray[j] == "") {
                    if (debug) console.log("Invalid BMArray null/blank found, correcting...");
                    plg.bmarray[j] = 'm';
                }
            }
            plg.initSaveObjectAsNote(0, plg.notetype, [plugin_version,plg.bmarray]);
            if (debug) console.log("BMArray validated.");
            if (debug) console.log("BMArray is: " + plg.bmarray);
            
            // Validate NTArray
            if (debug) console.log("Validating NTArray...");
            if (plg.ntarray.length < maxid) {
                if (debug) console.log("Invalid NTArray length found, correcting...");
                // The array is not the correct length, make it right
                for (var i = plg.ntarray.length; i <= maxid; i++) {
                    plg.ntarray[i] = 'm';
                }
            }
            // Make sure there are no nulls or blanks
            for (var j = 0; j < plg.ntarray.length; j++) {
                if (plg.ntarray[j] == null || plg.ntarray[j] == "") {
                    if (debug) console.log("Invalid NTArray null/blank found, correcting...");
                    plg.ntarray[j] = 'm';
                }
            }
            plg.initSaveObjectAsNote(1, plg.notetype, [plugin_version,plg.ntarray]);
            if (debug) console.log("NTArray validated.");
            if (debug) console.log("NTArray is: " + plg.ntarray);
            
            // Validate CTArray
            if (debug) console.log("Validating CTArray...");
            if (plg.ctarray.length < maxid) {
                if (debug) console.log("Invalid CTArray length found, correcting...");
                // The array is not the correct length, make it right
                for (var i = plg.ctarray.length; i <= maxid; i++) {
                    plg.ctarray[i] = 'm';
                }
            }
            // Make sure there are no nulls or blanks
            for (var j = 0; j < plg.ctarray.length; j++) {
                //console.log("CTARRAY VALIDATION: ctarray[" + j + "] = --->" + plg.ctarray[j] + "<----");
                if (plg.ctarray[j] == null || plg.ctarray[j] == "") {
                    if (debug) console.log("Invalid CTArray null/blank found, correcting...");
                    
                    plg.ctarray[j] = 'm';
                }
            }
            plg.initSaveObjectAsNote(2, plg.notetype, [plugin_version,plg.ctarray]);
            if (debug) console.log("CTArray validated.");
            if (debug) console.log("CTArray is: " + plg.ctarray);
            
            if (debug) console.log("All Arrays Validated.");			
            
        },
        
        resetBMArray: function() {
            vgap.plugins["plManagerPlugin"].bmarray = [];
            for (var i = 0; i < vgap.plugins["plManagerPlugin"].getMaxId() + 1; i++)	
                vgap.plugins["plManagerPlugin"].bmarray[i] = 'm';
        },
        
        resetNTArray: function() {
            vgap.plugins["plManagerPlugin"].ntarray = [];
            for (var i = 0; i < vgap.plugins["plManagerPlugin"].getMaxId() + 1; i++)
                vgap.plugins["plManagerPlugin"].ntarray[i] = 'm';	
        },
        
        resetCTArray: function() {
            vgap.plugins["plManagerPlugin"].ctarray = [];
            console.log("In reset ct array, getmaxid is " + vgap.plugins["plManagerPlugin"].getMaxId());
            for (var i = 0; i < vgap.plugins["plManagerPlugin"].getMaxId() + 1; i++)
                vgap.plugins["plManagerPlugin"].ctarray[i] = 'm';	
        },
        
        resetBuildMethods: function() {
            var plg = vgap.plugins["plManagerPlugin"];
            
            plg.buildmethods = [];
            plg.buildmethods[0] = ["Build 0","y-f-14-m-19-rfm-500-0-2-d-100"];
            plg.buildmethods[1] = ["Build 100","y-f-14-m-19-rfm-500-100-2-d-100"];
            plg.buildmethods[2] = ["Build 200","y-f-14-m-19-rfm-500-200-2-d-100"];            
            plg.buildmethods[3] = ["Safe Build 0","y-f-14-m-19-d-16-rfm-500-0-2-d-100"];
            plg.buildmethods[4] = ["Safe Build 100","y-f-14-m-19-d-16-rfm-500-100-2-d-100"];
            plg.buildmethods[5] = ["Safe Build 200","y-f-14-m-19-d-16-rfm-500-200-2-d-100"];
            plg.buildmethods[6] = ["Safe Build No Burn","n-f-14-m-19-d-16-rfm-500-200-2-d-100"];  
            plg.buildmethods[7] = ["Build 2:1","y-rfm-500-500-2"];
            plg.buildmethods[8] = ["Defence","y-d-500"];				
        },
        
        resetTaxMethods: function() {
            var plg = vgap.plugins["plManagerPlugin"];
            
            plg.taxmethods = [];
            var taxModel1 = new Object();
            taxModel1.name = "Growth Tax 70-100";
            taxModel1.method = "Growth";
            taxModel1.taxType = "CN";
            taxModel1.minHappy = 70;
            taxModel1.maxHappy = 100;
            taxModel1.minClans = 0;
            taxModel1.midsame = true;
            taxModel1.midmethod = "Growth";
            taxModel1.midMinHappy = "";
            taxModel1.midMaxHappy = "";
            taxModel1.maxsame = false;
            taxModel1.maxmethod = "Safe";
            taxModel1.maxMinHappy = 40;
            taxModel1.maxMaxHappy = "";
            
            var taxModel2 = new Object();
            taxModel2.name = "Safe Tax 100";
            taxModel2.method = "Safe";
            taxModel2.taxType = "CN";
            taxModel2.minHappy = 100;
            taxModel2.maxHappy = 100;
            taxModel2.minClans = 0;
            taxModel2.midsame = true;
            taxModel2.midmethod = "Safe";
            taxModel2.midMinHappy = "";
            taxModel2.midMaxHappy = "";
            taxModel2.maxsame = true;
            taxModel2.maxmethod = "Safe";
            taxModel2.maxMinHappy = "";
            taxModel2.maxMaxHappy = "";
            
            var taxModel3 = new Object();
            taxModel3.name = "Safe Tax 70";
            taxModel3.method = "Safe";
            taxModel3.taxType = "CN";
            taxModel3.minHappy = 70;
            taxModel3.maxHappy = 100;
            taxModel3.minClans = 0;
            taxModel3.midsame = true;
            taxModel3.midmethod = "Safe";
            taxModel3.midMinHappy = "";
            taxModel3.midMaxHappy = "";
            taxModel3.maxsame = true;
            taxModel3.maxmethod = "Safe";
            taxModel3.maxMinHappy = "";
            taxModel3.maxMaxHappy = "";
            
            var taxModel4 = new Object();
            taxModel4.name = "Safe Tax 50";
            taxModel4.method = "Safe";
            taxModel4.taxType = "CN";
            taxModel4.minHappy = 50;
            taxModel4.maxHappy = 100;
            taxModel4.minClans = 0;
            taxModel4.midsame = true;
            taxModel4.midmethod = "Safe";
            taxModel4.midMinHappy = "";
            taxModel4.midMaxHappy = "";
            taxModel4.maxsame = true;
            taxModel4.maxmethod = "Safe";
            taxModel4.maxMinHappy = "";
            taxModel4.maxMaxHappy = "";                
            
            var taxModel5 = new Object();
            taxModel5.name = "Safe Tax 40";
            taxModel5.method = "Safe";
            taxModel5.taxType = "CN";
            taxModel5.minHappy = 40;
            taxModel5.maxHappy = 100;
            taxModel5.minClans = 0;
            taxModel5.midsame = true;
            taxModel5.midmethod = "Safe";
            taxModel5.midMinHappy = "";
            taxModel5.midMaxHappy = "";
            taxModel5.maxsame = true;
            taxModel5.maxmethod = "Safe";
            taxModel5.maxMinHappy = "";
            taxModel5.maxMaxHappy = "";
            
            var taxModel6 = new Object();
            taxModel6.name = "Riot Tax";
            taxModel6.method = "Riot";
            taxModel6.taxType = "CN";
            taxModel6.minHappy = 0;
            taxModel6.maxHappy = 0;
            taxModel6.minClans = 0;
            taxModel6.midsame = true;
            taxModel6.midmethod = "Riot";
            taxModel6.midMinHappy = "";
            taxModel6.midMaxHappy = "";
            taxModel6.maxsame = true;
            taxModel6.maxmethod = "Riot";
            taxModel6.maxMinHappy = "";
            taxModel6.maxMaxHappy = "";
            
            var taxModel7 = new Object();
            taxModel7.name = "No Tax";
            taxModel7.method = "No Tax";
            taxModel7.taxType = "CN";
            taxModel7.minHappy = 100;
            taxModel7.maxHappy = 100;
            taxModel7.minClans = 0;
            taxModel7.midsame = true;
            taxModel7.midmethod = "No Tax";
            taxModel7.midMinHappy = "";
            taxModel7.midMaxHappy = "";
            taxModel7.maxsame = true;
            taxModel7.maxmethod = "No Tax";
            taxModel7.maxMinHappy = "";
            taxModel7.maxMaxHappy = "";

            var taxModel8 = new Object();
            taxModel7.name = "Auto Tax";
            taxModel7.method = "Auto Tax";
            taxModel7.taxType = "CN";
            taxModel7.minHappy = 100;
            taxModel7.maxHappy = 100;
            taxModel7.minClans = 0;
            taxModel7.midsame = true;
            taxModel7.midmethod = "Auto Tax";
            taxModel7.midMinHappy = "";
            taxModel7.midMaxHappy = "";
            taxModel7.maxsame = true;
            taxModel7.maxmethod = "Auto Tax";
            taxModel7.maxMinHappy = "";
            taxModel7.maxMaxHappy = "";
            
            vgap.plugins["plManagerPlugin"].taxmethods.push(taxModel1);
            vgap.plugins["plManagerPlugin"].taxmethods.push(taxModel2);
            vgap.plugins["plManagerPlugin"].taxmethods.push(taxModel3);
            vgap.plugins["plManagerPlugin"].taxmethods.push(taxModel4);
            vgap.plugins["plManagerPlugin"].taxmethods.push(taxModel5);
            vgap.plugins["plManagerPlugin"].taxmethods.push(taxModel6);
            vgap.plugins["plManagerPlugin"].taxmethods.push(taxModel7);            
            vgap.plugins["plManagerPlugin"].taxmethods.push(taxModel8); 
        },
        
        readNotes: function() {
            
            var plg = vgap.plugins["plManagerPlugin"];
            console.log("Read Notes Called: readOrder = " + plg.readOrder);
            switch (plg.readOrder) {
                case '1':
                case 1:
                    // Individual Planetary Building Method Array
                    if (vgap.plugins["plManagerPlugin"].getObjectFromNote(0,vgap.plugins["plManagerPlugin"].notetype) == null) {
                        if (debug) console.log("Build Method Note is null, generating m's");
                        plg.resetBMArray();
                        plg.initSaveObjectAsNote(0, plg.notetype, [plugin_version,plg.bmarray]);
                    }
                    else {
                        if (debug) console.log("Build Method Note not null, reading...");
                        
                        var temparray = vgap.plugins["plManagerPlugin"].getObjectFromNote(0,vgap.plugins["plManagerPlugin"].notetype);
                        
                        if (temparray.length != 2) {
                            // An invalid array, reset
                            if (debug) console.log("Invalid BM Array Detected!  Resetting...");
                            plg.resetBMArray();
                            plg.initSaveObjectAsNote(0, plg.notetype, [plugin_version,plg.bmarray]);
                        }
                        else {
                            if (debug) console.log("Valid BMArray found, reading...");
                            var maxid = plg.getMaxId();
                            plg.bmarray = temparray[1];
                            
                            // Check Array
                            if (plg.bmarray.length < maxid) {
                                if (debug) console.log("Invalid BMArray length found, correcting...");
                                // The array is not the correct length, make it right
                                for (var i = plg.bmarray.length; i <= maxid; i++) {
                                    plg.bmarray[i] = 'm';
                                }
                            }
                            // Make sure there are no nulls or blanks
                            for (var j = 0; j < plg.bmarray.length; j++) {
                                if (plg.bmarray[j] == null || plg.bmarray[j] == "") {
                                    if (debug) console.log("Invalid BMArray null/blank found, correcting...");
                                    plg.bmarray[j] = 'm';
                                }
                            }
                            plg.initSaveObjectAsNote(0, plg.notetype, [plugin_version,plg.bmarray]);
                            
                            
                        }
                    }
                    if (debug) console.log("Build Method Array read, bmarray = " + vgap.plugins["plManagerPlugin"].bmarray);
                    plg.readOrder++;
                    plg.readNotes();
                    
                    break;
                    
                case '2':
                case 2:
                    // All Build Methods Array
                    if (vgap.plugins["plManagerPlugin"].getObjectFromNote(4,vgap.plugins["plManagerPlugin"].notetype) == null) {
                        // There are no methods saved.  Load the default methods:
                        if (debug) console.log("Build Methods Note is null, generating defaults");
                        plg.resetBuildMethods();
                        plg.initSaveObjectAsNote(4, plg.notetype, [plugin_version,plg.buildmethods]);
                        
                    }
                    else {
                        if (debug) console.log("Build Methods Note is not null, reading....");
                        var temparray = vgap.plugins["plManagerPlugin"].getObjectFromNote(4,vgap.plugins["plManagerPlugin"].notetype);
                        
                        if (temparray.length != 2) {
                            // An invalid array, reset
                            if (debug) console.log("Invalid Player Build Methods Array Detected!  Resetting...");
                            plg.resetBuildMethods();
                            plg.initSaveObjectAsNote(4, plg.notetype, [plugin_version,plg.buildmethods]);
                        }
                        else {
                            if (debug) console.log("Valid Player Build Methods Array found, reading...");
                            var maxid = plg.getMaxId();
                            plg.buildmethods = temparray[1];
                        }
                    }	
                    if (debug) console.log("Build Methods Note is read, buildmethods = " + vgap.plugins["plManagerPlugin"].buildmethods);
                    plg.readOrder++;
                    plg.readNotes();
                    
                    break;
                    
                case '3':
                case 3:
                    // Tax Methods Array
                    //
                    //
                    if (vgap.plugins["plManagerPlugin"].getObjectFromNote(5,vgap.plugins["plManagerPlugin"].notetype) == null) {
                        // There are no methods saved.  Load the default methods:
                        if (debug) console.log("Tax Methods Note is null, generating defaults");
                        plg.resetTaxMethods();
                        plg.initSaveObjectAsNote(5, plg.notetype, [plugin_version,plg.taxmethods]);	
                    }
                    else {
                        if (debug) console.log("Tax methods note not null");
                        var temparray = vgap.plugins["plManagerPlugin"].getObjectFromNote(5,vgap.plugins["plManagerPlugin"].notetype);
                        
                        if (temparray.length != 2) {
                            // An invalid array, reset
                            if (debug) console.log("Invalid Player Tax Methods Array Detected!  Resetting...");
                            plg.resetTaxMethods();
                            plg.initSaveObjectAsNote(5, plg.notetype, [plugin_version,plg.taxmethods]);
                        }
                        else {
                            if (debug) console.log("Valid Player Tax Methods Array found, reading...");
                            var maxid = plg.getMaxId();
                            plg.taxmethods = temparray[1];
                        }
                    }	
                    
                    if (debug) console.log("Tax methods read, tax methods is " + vgap.plugins["plManagerPlugin"].taxmethods);	
                    plg.readOrder++;
                    plg.readNotes();	
                    
                    break;
                    
                case '4':
                case 4:
                    // Native Tax Method Array
                    if (vgap.plugins["plManagerPlugin"].getObjectFromNote(1,vgap.plugins["plManagerPlugin"].notetype) == null) {
                        if (debug) console.log("Native Tax Note is null, generating defaults...");
                        plg.resetNTArray();
                        plg.initSaveObjectAsNote(1, plg.notetype, [plugin_version,plg.ntarray]);
                    }
                    else {
                        if (debug) console.log("NTArray is not null, reading....");
                        var temparray = vgap.plugins["plManagerPlugin"].getObjectFromNote(1,vgap.plugins["plManagerPlugin"].notetype);
                        
                        if (temparray.length != 2) {
                            // An invalid array, reset
                            if (debug) console.log("Invalid NT Array Detected!  Resetting...");
                            plg.resetNTArray();
                            plg.initSaveObjectAsNote(1, plg.notetype, [plugin_version,plg.ntarray]);
                        }
                        else {
                            if (debug) console.log("Valid NTArray found, reading...");
                            var maxid = plg.getMaxId();
                            plg.ntarray = temparray[1];
                            
                            // Check Array
                            if (plg.ntarray.length < maxid) {
                                if (debug) console.log("Invalid NTArray length found, correcting...");
                                // The array is not the correct length, make it right
                                for (var i = plg.ntarray.length; i <= maxid; i++) {
                                    plg.ntarray[i] = 'm';
                                }
                            }
                            // Make sure there are no nulls or blanks
                            for (var j = 0; j < plg.ntarray.length; j++) {
                                if (plg.ntarray[j] == null || plg.ntarray[j] == "") {
                                    if (debug) console.log("Invalid NTArray null/blank found, correcting...");
                                    plg.ntarray[j] = 'm';
                                }
                            }
                            plg.initSaveObjectAsNote(1, plg.notetype, [plugin_version,plg.ntarray]);
                            
                            
                        }
                    }
                    if (debug) console.log("Nat Tax Method Array read, ntarray = " + vgap.plugins["plManagerPlugin"].ntarray);		
                    plg.readOrder++;
                    plg.readNotes();
                    
                    break;
                    
                case '5':
                case 5:
                    // Colonist Tax Method Array
                    if (vgap.plugins["plManagerPlugin"].getObjectFromNote(2,vgap.plugins["plManagerPlugin"].notetype) == null) {
                        if (debug) console.log("Colonist Tax Note is null, generating defaults...");
                        plg.resetCTArray();
                        plg.initSaveObjectAsNote(2, plg.notetype, [plugin_version,plg.ctarray]);
                    }
                    else {
                        if (debug) console.log("Colonist Tax Methods Note is not null, reading....");
                        var temparray = vgap.plugins["plManagerPlugin"].getObjectFromNote(2,vgap.plugins["plManagerPlugin"].notetype);
                        
                        if (temparray.length != 2) {
                            // An invalid array, reset
                            if (debug) console.log("Invalid CT Array Detected!  Resetting...");
                            plg.resetCTArray();
                            plg.initSaveObjectAsNote(2, plg.notetype, [plugin_version,plg.ctarray]);
                        }
                        else {
                            if (debug) console.log("Valid CTArray found, reading...");
                            var maxid = plg.getMaxId();
                            plg.ctarray = temparray[1];
                            
                            // Check Array
                            if (plg.ctarray.length < maxid) {
                                if (debug) console.log("Invalid CTArray length found, correcting...");
                                // The array is not the correct length, make it right
                                for (var i = plg.ctarray.length; i <= maxid; i++) {
                                    plg.ctarray[i] = 'm';
                                }
                            }
                            // Make sure there are no nulls or blanks
                            for (var j = 0; j < plg.ctarray.length; j++) {
                                if (plg.ctarray[j] == null || plg.ctarray[j] == "") {
                                    if (debug) console.log("Invalid CTArray null/blank found, correcting...");
                                    plg.ctarray[j] = 'm';
                                }
                            }
                            plg.initSaveObjectAsNote(2, plg.notetype, [plugin_version,plg.ctarray]);
                            
                            
                        }
                    }
                    if (debug) console.log("CT Method Array read, ctarray = " + vgap.plugins["plManagerPlugin"].ctarray);
                    plg.readOrder++;
                    plg.readNotes();
                    
                    break;
                    
                case '6':
                case 6:
                    if (debug) console.log("Read Notes is performing final checks...");
                    plg.printArrayToConsole(plg.ctarray,"CTARRAY");
                    if (debug) console.log("CT Method VIS VIS VIS, ctarray = " + vgap.plugins["plManagerPlugin"].ctarray);
                    // Perform checks
                    // Check 
                    for (var i = 0; i < plg.ctarray.length; i++) {
                        if (vgap.plugins["plManagerPlugin"].ctarray[i] >= vgap.plugins["plManagerPlugin"].taxmethods.length)
                            vgap.plugins["plManagerPlugin"].ctarray[i] = 'm';
                    }
                    
                    // Check to see if any are out of range
                    for (var i = 0; i < plg.ntarray.length; i++) {
                        if (vgap.plugins["plManagerPlugin"].ntarray[i] >= vgap.plugins["plManagerPlugin"].taxmethods.length)
                            vgap.plugins["plManagerPlugin"].ntarray[i] = 'm';
                    }
                    break;
            }
        },
        printArrayToConsole: function(arr,str) {
            
            console.log("Printing " + str + " array...");
            console.log(arr);
            
        },
        
        saveInitChanges: function() {
            var plg = vgap.plugins["plManagerPlugin"];
            
            if (vgap.saveInProgress == 2) {
                // We are still saving, check again in a little bit
                if (debug) console.log("Save in progress, waiting 500... ReadOrder: " + plg.readOrder);
                timeoutID = window.setTimeout(vgap.plugins["plManagerPlugin"].saveInitChanges, 500);
                return;
            }
            else if (vgap.saveInProgress == 0 && vgap.plugins["plManagerPlugin"].savestarted == true) {
                // We have performed a save.  Read the next bit of stuff
                if (debug) vgap.plugins["plManagerPlugin"].savestarted = false;
                console.log("Reading done, reading next..." + (plg.readOrder + 1));
                if (plg.readOrder >= 6) {
                    console.log("Reading complete.");
                    return;
                }
                else {
                    //plg.readOrder++;
                    //plg.readNotes();
                }
            }	
                else {
                    // We can save now
                    if (debug) vgap.plugins["plManagerPlugin"].savestarted = true;
                    vgap.save();
                    timeoutID = window.setTimeout(vgap.plugins["plManagerPlugin"].saveInitChanges, 500);
                }
        },
        /* End Read In Functions */
        
        /* This function takes a protoplanet, and predicts its future.
			 * The protoplanet is not a full fledged nu planet object.
			 * It is an object built here that contains only those values necessary
			 * to computing the planets future.
			 * 
			 * This function is recursive.
			 */
        planetPredictor: function(pl, turn, totalturns) {
            var plg = vgap.plugins["plManagerPlugin"];
            if (debug) console.log("Planet predictor called,  turn= " + turn);
            if (turn > totalturns) { 	// Only compute out to 50 turns
                // Print out the predict array
                /*
					for (var i = 0; i < plg.predictarray.length; i++) {
							plg.printPlanet(plg.predictarray[i], i);
					}
					*/
                    return;
                    
                }
                if (turn == 0)	{
                    // First call.  Set up the protoplanet
                    var np = new Object();
                    np = plg.clonePlanet(pl);
                    plg.pplanet = np;
                    //plg.planet = {};
                    //plg.pplanet = plg.clonePlanet(pl);
                    
                    plg.predictarray = [];
                    plg.predicttimes = new Object();
                    plg.predicttimes.ttSB = -1;
                    plg.predicttimes.ttMaxCols = -1;
                    plg.predicttimes.ttMaxNats = -1;
                    plg.predicttimes.ttNMO = -1;
                    plg.predicttimes.ttDMO = -1;
                    plg.predicttimes.ttTMO = -1;
                    plg.predicttimes.ttMMO = -1;
                    
                    //plg.printPlanet(turn);
                    plg.planetSetTaxGeneral(true);
                    plg.predictarray.push(plg.pplanet);
                    plg.checkPredictTimes(turn);
                    //plg.pplanet = {};
                    //plg.pplanet = plg.clonePlanet(plg.predictarray[plg.predictarray.length-1]);
                }
                
                if (debug) console.log("Entered turn not 0,  turn= " + turn);
                //plg.pplanet = null;
                //plg.pplanet = new Object();
                plg.pplanet = {};
                plg.pplanet = plg.clonePlanet(plg.predictarray[plg.predictarray.length-1]);
                if (debug) console.log("pplanet cloned,  turn= " + turn);
                
                // Bughunting: Break out if we're predicting negative clans
                if (plg.pplanet.clans < 0)
                    return;
                
                // Build structures
                
                if (plg.bmarray[plg.pplanet.id] != 'm') {
                    var bmarrayindex = plg.pplanet.id;
                    var bm = plg.bmarray[bmarrayindex];
                    var bmstring = plg.buildmethods[bm][1];
                    plg.buildBldgsGeneral(bmstring, true);
                }
                
                // Structure decay
                
                // Happiness change
                // colonist taxation amounts
                var colmc = plg.colTaxAmount(plg.pplanet);
                /* Requires planet - factories, mines, taxrate, clans */
                var colhappychange = vgap.colonistTaxChange(plg.pplanet);
                plg.pplanet.colonisthappypoints = Math.min(100, plg.pplanet.colonisthappypoints += colhappychange);
                
                
                // native taxation amounts
                // Requires nativetaxvalue, nativetype, nativegovernment
                if (plg.pplanet.nativeclans > 0) {
                    var natmc = plg.natTaxAmount(plg.pplanet);
                    var nathappychange = vgap.nativeTaxChange(plg.pplanet);
                    plg.pplanet.nativehappypoints = Math.min(100, plg.pplanet.nativehappypoints += nathappychange);
                    //plg.pplanet.nativehappypoints += nathappychange;
                }
                
                // Supplies produced
                plg.pplanet.supplies += plg.pplanet.factories;
                if (plg.pplanet.nativeclans > 0) {
                    if (plg.pplanet.nativetype == 2) {
                        plg.pplanet.supplies += Math.min(plg.pplanet.clans, Math.floor(plg.pplanet.nativeclans / 100));
                    }
                }
                
                // MC Generated
                if (plg.pplanet.colonisthappypoints > 30)
                    plg.pplanet.megacredits += colmc;
                
                if (plg.pplanet.nativeclans > 0) {
                    if (plg.pplanet.nativehappypoints > 30)
                        plg.pplanet.megacredits += natmc;
                }
                
                // Borg assimilation
                var player = vgap.getPlayer(plg.pplanet.ownerid);
                if (vgap.player.raceid == 6 && plg.pplanet.nativeclans > 0) {
                    if (plg.pplanet.nativetype != 5) {
                        if (plg.pplanet.clans > plg.pplanet.nativeclans) {
                            plg.pplanet.clans += plg.pplanet.nativeclans;
                            plg.pplanet.nativeclans = 0;
                        }
                        else {
                            plg.pplanet.nativeclans -= plg.pplanet.clans;
                            plg.pplanet.clans += plg.pplanet.clans;
                            
                        }
                    }
                }
                
                // Apply population growth
                if (debug) console.log("Applying population growth, colonist happy = " + plg.pplanet.colonisthappypoints);
                if (plg.pplanet.colonisthappypoints >= 70) {
                    console.log("In colonisthappy if, preparing to apply, clans = " + plg.pplanet.clans + ", growth = " + plg.myColPopGrowth(plg.pplanet,true));
                    plg.pplanet.clans += plg.myColPopGrowth(plg.pplanet,true);
                    console.log("After apply, clans = " + plg.pplanet.clans + ", growth = " + plg.myColPopGrowth(plg.pplanet,true));
                }
                if (plg.pplanet.nativehappypoints >= 70)
                    plg.pplanet.nativeclans += plg.myNatPopGrowth(plg.pplanet,true);
                
                
                // Overpop dies and eats supplies
                // Death taken care of above, just need to eat supplies
                if (plg.pplanet.clans > plg.getMaxColonists(plg.pplanet,false))
                    plg.pplanet.supplies = Math.max(0, plg.pplanet.supplies -= Math.floor((1 + ((plg.pplanet.clans - plg.getMaxColonists(plg.pplanet,false))/40))));
                
                
                
                // Amorphs eat clans
                // Taken care of above
                
                // Riots
                if (plg.pplanet.colonisthappypoints < 40) {
                    // Colonists are rioting
                    plg.pplanet.factories = Math.max(0,(plg.pplanet.factories - 8));
                    plg.pplanet.mines = Math.max(0,(plg.pplanet.mines - 10));
                }
                
                if (plg.pplanet.nativeclans > 0) {
                    if (plg.pplanet.nativehappypoints < 40) {
                        // Natives are rioting
                        plg.pplanet.factories = Math.max(0,(plg.pplanet.factories - 3));
                        plg.pplanet.mines = Math.max(0,(plg.pplanet.factories - 5));
                    }
                }
                
                
                // Civil War
                if (plg.pplanet.colonisthappypoints < 0 || (plg.pplanet.nativeclans > 0 && plg.pplanet.nativehappypoints < 0)) {
                    // The planet is in a state of civil war
                    plg.pplanet.factories = Math.max(0,(plg.pplanet.factories - 8));
                    plg.pplanet.mines = Math.max(0,(plg.pplanet.mines - 10));
                    
                    plg.pplanet.clans = Math.max(0, (Math.floor(plg.pplanet.clans * 0.7) - 100)); 
                    if (plg.pplanet.racetype != 5)
                        plg.pplanet.nativeclans = Math.max(0, (Math.floor(plg.pplanet.nativeclans * 0.7) - 100));
                    
                }
                // Mine the minerals
                // Neutronium		
                //console.log("NEUT DEBUG: rate is " + plg.myMiningRate(plg.pplanet, plg.pplanet.densityneutronium));
                
                if (plg.pplanet.groundneutronium < plg.myMiningRate(plg.pplanet, plg.pplanet.densityneutronium)) {
                    plg.pplanet.neutronium += plg.pplanet.groundneutronium;
                    plg.pplanet.groundneutronium = 0;
                }
                else {
                    plg.pplanet.neutronium += plg.myMiningRate(plg.pplanet, plg.pplanet.densityneutronium);
                    plg.pplanet.groundneutronium -= plg.myMiningRate(plg.pplanet, plg.pplanet.densityneutronium);
                }
                
                // Duranium		
                if (plg.pplanet.groundduranium < plg.myMiningRate(plg.pplanet, plg.pplanet.densityduranium)) {
                    plg.pplanet.duranium += plg.pplanet.groundduranium;
                    plg.pplanet.groundduranium = 0;
                }
                else {
                    plg.pplanet.duranium += plg.myMiningRate(plg.pplanet, plg.pplanet.densityduranium);
                    plg.pplanet.groundduranium -= plg.myMiningRate(plg.pplanet, plg.pplanet.densityduranium);
                }
                
                // Tritanium		
                if (plg.pplanet.groundtritanium < plg.myMiningRate(plg.pplanet, plg.pplanet.densitytritanium)) {
                    plg.pplanet.tritanium += plg.pplanet.groundtritanium;
                    plg.pplanet.groundtritanium = 0;
                }
                else {
                    plg.pplanet.tritanium += plg.myMiningRate(plg.pplanet, plg.pplanet.densitytritanium);
                    plg.pplanet.groundtritanium -= plg.myMiningRate(plg.pplanet, plg.pplanet.densitytritanium);
                }
                
                // Molybdenum		
                if (plg.pplanet.groundmolybdenum < plg.myMiningRate(plg.pplanet, plg.pplanet.densitymolybdenum)) {
                    plg.pplanet.molybdenum += plg.pplanet.groundmolybdenum;
                    plg.pplanet.groundmolybdenum = 0;
                }
                else {
                    plg.pplanet.molybdenum += plg.myMiningRate(plg.pplanet, plg.pplanet.densitymolybdenum);
                    plg.pplanet.groundmolybdenum -= plg.myMiningRate(plg.pplanet, plg.pplanet.densitymolybdenum);
                }
                
                // Trans-uranium mutation
                
                // If this is an iteration we're saving to the array, push it
                // If we're not done predicting, call again
                turn += 1;
                // Output the planet to console
                //plg.printPlanet(turn);
                if (debug) console.log("Pushing turn " + turn);
                plg.predictarray.push(plg.pplanet);
                plg.checkPredictTimes(turn);
                if (debug) console.log("Recursive call");
                plg.planetSetTaxGeneral(true);
                plg.planetPredictor(plg.pplanet, turn, totalturns);
                
            },
        
        checkPredictTimes: function(turn) {
            var plg = vgap.plugins["plManagerPlugin"];
            /*
				 * Data Structure:
				plg.predicttimes.ttSB = -1;
				plg.predicttimes.ttMaxCols = -1;
				plg.predicttimes.ttMaxNats = -1;
				plg.predicttimes.ttNMO = -1;
				plg.predicttimes.ttDMO = -1;
				plg.predicttimes.ttTMO = -1;
				plg.predicttimes.ttMMO = -1;
				*/
                
                if (plg.predicttimes.ttSB == -1 && plg.pplanet.megacredits + plg.pplanet.supplies >= 900 && plg.pplanet.duranium >= 120 && plg.pplanet.tritanium >= 402 && plg.pplanet.molybdenum >= 340)
                    plg.predicttimes.ttSB = turn;
                
                //console.log("Checking predict, turn = " + turn + " cols = " + plg.pplanet.clans + ", max cols = " + plg.getMaxColonists(plg.pplanet,false));
                if (plg.predicttimes.ttMaxCols == -1 && plg.pplanet.clans >= plg.getMaxColonists(plg.pplanet,false))
                    plg.predicttimes.ttMaxCols = turn;
                
                if (plg.pplanet.nativeclans > 0) {
                    if (plg.predicttimes.ttMaxNats == -1 && plg.pplanet.nativeclans >= plg.getMaxNatives(plg.pplanet))
                        plg.predicttimes.ttMaxNats = turn;
                }
                
                if (plg.predicttimes.ttNMO == -1 && plg.pplanet.groundneutronium == 0)
                    plg.predicttimes.ttNMO = turn;
                if (plg.predicttimes.ttDMO == -1 && plg.pplanet.groundduranium == 0)
                    plg.predicttimes.ttDMO = turn;
                if (plg.predicttimes.ttTMO == -1 && plg.pplanet.groundtritanium == 0)
                    plg.predicttimes.ttTMO = turn;
                if (plg.predicttimes.ttMMO == -1 && plg.pplanet.groundmolybdenum == 0)
                    plg.predicttimes.ttMMO = turn;
                
            },
        
        clonePlanet: function(pl) {				
            
            var newplanet = new Object();
            newplanet.id = pl.id;
            newplanet.x = pl.x;
            newplanet.y = pl.y;
            newplanet.debrisdisk = pl.debrisdisk;
            newplanet.ownerid = pl.ownerid;
            newplanet.img = pl.img;
            newplanet.name = pl.name;
            newplanet.temp = pl.temp;
            newplanet.factories = pl.factories;
            if (debug) console.log("Setting factories: pl.fact = " + pl.factories + " , pplan.fact = " + newplanet.factories);
            newplanet.mines = pl.mines;
            newplanet.defense = pl.defense;
            newplanet.supplies = pl.supplies;
            newplanet.megacredits = pl.megacredits;
            
            newplanet.clans = pl.clans;
            newplanet.colonisthappypoints = pl.colonisthappypoints;
            newplanet.colonisttaxrate = pl.colonisttaxrate;
            
            newplanet.nativeclans = pl.nativeclans;
            newplanet.nativetype = pl.nativetype;
            newplanet.nativeracename = pl.nativeracename;
            newplanet.nativetaxrate = pl.nativetaxrate;
            newplanet.nativetaxvalue = pl.nativetaxvalue;
            newplanet.nativehappypoints = pl.nativehappypoints;
            newplanet.nativegovernment = pl.nativegovernment;
            newplanet.nativegovernmentname = pl.nativegovernmentname;
            
            newplanet.neutronium = pl.neutronium;
            newplanet.groundneutronium = pl.groundneutronium;
            newplanet.densityneutronium = pl.densityneutronium;
            
            newplanet.duranium = pl.duranium;
            newplanet.groundduranium = pl.groundduranium;
            newplanet.densityduranium = pl.densityduranium;
            
            newplanet.tritanium = pl.tritanium;
            newplanet.groundtritanium = pl.groundtritanium;
            newplanet.densitytritanium = pl.densitytritanium;
            
            newplanet.molybdenum = pl.molybdenum;
            newplanet.groundmolybdenum = pl.groundmolybdenum;
            newplanet.densitymolybdenum = pl.densitymolybdenum;	
            
            return newplanet;
        },
        
        printPlanet: function(p,turn) {
            var plg = vgap.plugins["plManagerPlugin"];
            console.log("**** Planet Predictor - Turn " + turn + " ***");
            console.log("id: " + p.id);
            console.log("ownerid: " + p.ownerid);
            console.log("temp: " + p.temp);
            console.log("factories: " + p.factories);
            console.log("mines: " + p.mines);
            console.log("defense: " + p.defense);
            console.log("supplies: " + p.supplies);
            console.log("megacredits: " + p.megacredits);
            
            console.log("clans: " + p.clans);
            console.log("colonisthappypoints: " + p.colonisthappypoints);
            console.log("colonisttaxrate: " + p.colonisttaxrate);
            
            console.log("nativeclans: " + p.nativeclans);
            console.log("nativetype: " + p.nativetype);
            console.log("nativeracename: " + p.nativeracename);
            console.log("nativetaxrate: " + p.nativetaxrate);
            console.log("nativehappypoints: " + p.nativehappypoints);
            console.log("nativegovernment: " + p.nativegovernment);
            
            console.log("neutronium: " + p.neutronium);
            console.log("groundneutronium: " + p.groundneutronium);
            console.log("densityneutronium: " + p.densityneutronium);
            
            console.log("duranium: " + p.duranium);
            console.log("groundduranium: " + p.groundduranium);
            console.log("densityduranium: " + p.densityduranium);
            
            console.log("tritanium: " + p.tritanium);
            console.log("groundtritanium: " + p.groundtritanium);
            console.log("densitytritanium: " + p.densitytritanium);
            
            console.log("molybdenum: " + p.molybdenum);
            console.log("groundmolybdenum: " + p.groundmolybdenum);
            console.log("densitymolybdenum: " + p.densitymolybdenum);
            console.log("**** End Planet Predictor - Turn " + turn + " ***");
            
        },
        
        predictChangeFactories: function(change)	{
            var plg = vgap.plugins["plManagerPlugin"];
            var planet = plg.pplanet;
            
            if (change > 0) {
                
                //make sure we have enough resources for the change
                if (planet.supplies < change)
                    change = planet.supplies;
                
                //check the total amount we can build
                if ((planet.megacredits + planet.supplies) < (change * 4))
                    change = Math.floor((planet.megacredits + planet.supplies) / 4);
                
                //max factories
                var max = plg.maxBldgs(plg.pplanet,100);
                
                //we are already over the limit (nothing can be done)
                if (planet.factories > max)
                    return;
                
                if ((planet.factories + change) > max)
                    change = max - planet.factories;
                
                //sell supplies to reach the change
                if (planet.megacredits < (change * 3)) {
                    var diff = (change * 3) - planet.megacredits;
                    planet.megacredits += diff;
                    planet.supplies -= diff;
                    
                }
            }
            else {
                
            }
            
            
            planet.supplies -= change;
            planet.megacredits -= change * 3;
            
            planet.factories += change;
        },
        
        
        predictChangeMines: function(change)	{
            var plg = vgap.plugins["plManagerPlugin"];
            var planet = plg.pplanet;
            
            if (change > 0) {
                
                //make sure we have enough resources for the change
                if (planet.supplies < change)
                    change = planet.supplies;
                
                //check the total amount we can build
                if ((planet.megacredits + planet.supplies) < (change * 5))
                    change = Math.floor((planet.megacredits + planet.supplies) / 5);
                
                //max mines
                var max = plg.maxBldgs(plg.pplanet,200);
                
                //we are already over the limit (nothing can be done)
                if (planet.mines > max)
                    return;
                
                if ((planet.mines + change) > max)
                    change = max - planet.mines;
                
                //sell supplies to reach the change
                if (planet.megacredits < (change * 4)) {
                    var diff = (change * 4) - planet.megacredits;
                    planet.megacredits += diff;
                    planet.supplies -= diff;
                    
                }
            }
            else {
                
            }
            
            planet.supplies -= change;
            planet.megacredits -= change * 4;
            
            planet.mines += change;
            
            
            
        },
        
        predictChangeDefense: function(change)	{
            var plg = vgap.plugins["plManagerPlugin"];
            var planet = plg.pplanet;
            
            if (change > 0) {
                
                //make sure we have enough resources for the change
                if (planet.supplies < change)
                    change = planet.supplies;
                
                //check the total amount we can build
                if ((planet.megacredits + planet.supplies) < (change * 11))
                    change = Math.floor((planet.megacredits + planet.supplies) / 11);
                
                //max defense
                var max = this.maxBldgs(plg.pplanet);
                
                //we are already over the limit (nothing can be done)
                if (planet.defense > max)
                    return;
                
                if ((planet.defense + change) > max)
                    change = max - planet.defense;
                
                //sell supplies to reach the change
                if (planet.megacredits < (change * 10)) {
                    var diff = (change * 10) - planet.megacredits;
                    planet.megacredits += diff;
                    planet.supplies -= diff;
                    
                }
            }
            else {
                
            }
            
            planet.supplies -= change;
            planet.megacredits -= change * 10;
            
            planet.defense += change;
            
            
        },
        /* End Prediction functions */
        
        myNatPopGrowth: function (planet, predict) {
            
            var nativeGrowth = 0;
            var nativeMax = 0;
            
            // Hiss check
            var hissships = 0;
            var hapmod = 0;
            var plships = vgap.shipsAt(planet.x, planet.y);
            for (var i = 0; i < plships.length; i++) {
            	//console.log("--->  " + JSON.stringify(plships[i]));
            	var raceid = vgap.getPlayer(plships[i].ownerid).raceid;
                if (raceid == 2 && plships[i].mission == 8)	
					hissships += 1;
                
                if (hissships > 0) {
                    hapmod = (hissships * 5)
                    if (planet.nativehappypoints + hapmod > 100)
                        hapmod = 100-planet.nativehappypoints;
                }
			}
            //console.log("In myNatPopGrowth, before if, expr >= 70 = " + (planet.nativehappypoints + hapmod + vgap.nativeTaxChange(planet)));
            //console.log("In myNatPopGrowth, before if, hapmod = " + hapmod);
            //console.log("In myNatPopGrowth, before if, native tax change = " + vgap.nativeTaxChange(planet));
            var compval;
            if (predict)
                compval = planet.nativehappypoints + hapmod;
            else
                compval = (planet.nativehappypoints + hapmod + vgap.nativeTaxChange(planet));
            
            if (compval >= 70 && planet.nativeclans > 0 && planet.clans > 0) {
                //console.log("In myNatPopGrowth, entered if");
                if (planet.nativetype == 9) {
                    //siliconoid like it hot
                    nativeMax = planet.temp * 1000;
                    nativeGrowth = nativeGrowth + Math.round(((planet.temp / 100) * (planet.nativeclans / 25) * (5 / (planet.nativetaxrate + 5))));
                    //console.log("In myNatPopGrowth, siliconoids, native growth = " + nativeGrowth);
                }
                else {
                    nativeMax = Math.round(Math.sin(3.14 * (100 - planet.temp) / 100) * 150000);
                    nativeGrowth = nativeGrowth + Math.round(Math.sin(3.14 * ((100 - planet.temp) / 100)) * (planet.nativeclans / 25) * (5 / (planet.nativetaxrate + 5)));
                    //console.log("In myNatPopGrowth, " + planet.nativeracename + ", native growth = " + nativeGrowth);
                }
                //slows down over 6,600,000
                if (planet.nativeclans > 66000)
                    nativeGrowth = Math.round(nativeGrowth / 2);
                
                //check max
                if (planet.nativeclans > nativeMax)
                    nativeGrowth = 0;
                
            }
            //console.log("In myNatPopGrowth, done, returning native growth = " + nativeGrowth);
            return nativeGrowth;
        },
        
        myColPopGrowth: function (planet,predict) {
            
            var player = vgap.getPlayer(planet.ownerid);
            var raceId = player.raceid;
            
            var colGrowth = 0;
            
            // Hiss check
            var hissships = 0;
            var hapmod = 0;
            var plships = vgap.shipsAt(planet.x, planet.y);
            for (var i = 0; i < plships.length; i++) {
            	//console.log("--->  " + JSON.stringify(plships[i]));
            	var raceid = vgap.getPlayer(plships[i].ownerid).raceid;
                if (raceid == 2 && plships[i].mission == 8)	
					hissships += 1;
                
                if (hissships > 0) {
                    hapmod = (hissships * 5)
                    if (planet.colonisthappypoints + hapmod > 100)
                        hapmod = 100-planet.colonisthappypoints;
                }
			}

            //onsole.log("In myColPopGrowth, before if, expr >= 70 = " + (planet.colonisthappypoints + hapmod + vgap.colonistTaxChange(planet)));
            //console.log("In myColPopGrowth, before if, hapmod = " + hapmod);
            //console.log("In myColPopGrowth, before if, colonist tax change = " + vgap.colonistTaxChange(planet));
            
            var compval;
            if (predict)
                compval = planet.colonisthappypoints + hapmod;
            else
                compval = (planet.colonisthappypoints + hapmod + vgap.colonistTaxChange(planet));
            
            //if ((planet.colonisthappypoints + hapmod + vgap.colonistTaxChange(planet)) >= 70 && planet.clans > 0) {
            if (compval >= 70 && planet.clans > 0) {
                var colMax = Math.round(Math.sin(3.14 * (100 - planet.temp) / 100) * 100000);
                
                //crystals like it hot
                if (raceId == 7) {
                    colMax = 1000 * planet.temp;
                    colGrowth = Math.round(((planet.temp / 100) * (planet.clans / 20) * (5 / (planet.colonisttaxrate + 5))));
                    if (vgap.advActive(47))
                        colGrowth = Math.round((((planet.temp * planet.temp) / 4000) * (planet.clans / 20) * (5 / (planet.colonisttaxrate + 5))));
                }
                else if (planet.temp >= 15 && planet.temp <= 84)
                    colGrowth = Math.round(Math.sin(3.14 * ((100 - planet.temp) / 100)) * (planet.clans / 20) * (5 / (planet.colonisttaxrate + 5)));
                    
                    //slows down over 6,600,000
                    if (planet.clans > 66000)
                        colGrowth = Math.round(colGrowth / 2);
                
                //planetoids do not have an atmosphere
                if (planet.debrisdisk > 0)
                    colGrowth = 0;
                
                //check against max
                if ((planet.clans + colGrowth) > colMax)
                    colGrowth = colMax - planet.clans;
                
                //100 and 0 degree planets
                if (colGrowth < 0)
                    colGrowth = 0;
            }
            
            if (colGrowth == 0)
                colGrowth = vgap.plugins["plManagerPlugin"].getMaxColonists(planet,true);
            
            if (planet.nativetype == 5)
                colGrowth -= Math.max(5, 95 - (planet.nativehappypoints + vgap.nativeTaxChange(planet)));
            
            return colGrowth;
            
        },
        
        checkTaxModel: function(tm) {
            
            if (tm.name == "") {
                if (debug) console.log("CHECK TAX MODEL FALSE: bad name");
                return false;
            }
            
            if (tm.taxType == "") {
                if (debug) console.log("CHECK TAX MODEL FALSE: bad type");
                return false;
            }
            
            if (!(vgap.plugins["plManagerPlugin"].isInteger(tm.minHappy))) {
                if (debug) console.log("CHECK TAX MODEL FALSE: bad min happy main");
                return false;
            }
            
            if (!(vgap.plugins["plManagerPlugin"].isInteger(tm.minClans))) {
                if (debug) console.log("CHECK TAX MODEL FALSE: bad min clans main");
                return false;
            }
            
            
            if (tm.method == "Growth") {
                if (!(vgap.plugins["plManagerPlugin"].isInteger(tm.maxHappy))) {
                    if (debug) console.log("CHECK TAX MODEL FALSE: bad growth max happy");
                    return false;
                }
            }
            
            /*
				var taxModel1 = new Object();
					taxModel1.name = "My First Growth Tax";
					taxModel1.method = "Growth";
					taxModel1.taxType = "CN";
					taxModel1.minHappy = 70;
					taxModel1.maxHappy = 100;
					taxModel1.minClans = 1000;
					
					// New parts added
					taxModel1.midsame = false;
					taxModel1.midmethod = "Growth";
					taxModel1.midMinHappy = 70;
					taxModel1.midMaxHappy = 100;
					* 
					taxModel1.maxsame = false;
					taxModel1.maxmethod = "Growth";
					taxModel1.maxMinHappy = 70;
					taxModel1.maxMaxHappy = 100;
				*/		
                if (tm.midsame == false) {
                    
                    if (tm.midmethod == "") {
                        if (debug) console.log("CHECK TAX MODEL FALSE: bad mid method");
                        return false;
                    }
                    
                    if (!(vgap.plugins["plManagerPlugin"].isInteger(tm.midMinHappy))) {
                        if (debug) console.log("CHECK TAX MODEL FALSE: bad mid min happy");
                        return false;					
                    }
                    
                    if (tm.midmethod == "Growth") {
                        if (!(vgap.plugins["plManagerPlugin"].isInteger(tm.midMaxHappy))) {
                            if (debug) console.log("CHECK TAX MODEL FALSE: bad mid max happy");
                            return false;
                        }
                    }
                }
                
                if (tm.maxsame == false) {
                    
                    if (tm.maxmethod == "") {
                        if (debug) console.log("CHECK TAX MODEL FALSE: bad max method");
                        return false;
                    }
                    
                    if (!(vgap.plugins["plManagerPlugin"].isInteger(tm.maxMinHappy))) {
                        
                        if (debug) console.log("CHECK TAX MODEL FALSE: bad max min happy");
                        if (debug) console.log("Max Min Happy: " + tm.maxMinHappy);
                        return false;					
                    }
                    
                    if (tm.maxmethod == "Growth") {
                        if (!(vgap.plugins["plManagerPlugin"].isInteger(tm.maxMaxHappy))) {
                            if (debug) console.log("CHECK TAX MODEL FALSE: bad max max happy");
                            return false;
                        }
                    }
                }
                
                
                return true;
                
                
            },
        
        getTaxText: function(taxmethod) {
            
            /*
				var taxModel1 = new Object();
					taxModel1.name = "My First Growth Tax";
					taxModel1.method = "Growth";
					taxModel1.taxType = "CN";
					taxModel1.minHappy = 70;
					taxModel1.maxHappy = 100;
					taxModel1.minClans = 1000;
					* // New parts added
					taxModel1.midsame = false;
					taxModel1.midmethod = "Growth";
					taxModel1.midMinHappy = 70;
					taxModel1.midMaxHappy = 100;
					* 
					taxModel1.maxsame = false;
					taxModel1.maxmethod = "Growth";
					taxModel1.maxMinHappy = 70;
					taxModel1.maxMaxHappy = 100;
				*/
                
                var taxtext = "Tax ";
                
                if (taxmethod.taxType == 'N')
                    taxtext += " the natives ";
                if (taxmethod.taxType == 'C')
                    taxtext += " the colonists ";
                if (taxmethod.taxType == 'N')
                    taxtext += " the colonists or the natives ";
                if (taxmethod.method == 'Growth') {
                    
                    taxtext += "using the " + taxmethod.method + " tax method.  This method will tax at the highest collectable rate ";
                    taxtext += "that will reduce their happiness to " + taxmethod.minHappy + ", then tax at 0 until they have recovered ";
                    taxtext += "to a happiness of " + taxmethod.maxHappy + " before taxing again.  Only tax if there are more than ";
                    taxtext += taxmethod.minClans + " clans on the planet.<br /><br />";
                    
                }
                
                if (taxmethod.method == 'Safe') {
                    
                    taxtext += "using the " + taxmethod.method + " tax method.  This method will tax at the highest collectable rate ";
                    taxtext += "that will reduce their happiness to " + taxmethod.minHappy + ", then tax at a rate to maintain this level ";
                    taxtext += "of happiness.  Only tax if there are more than ";
                    taxtext += taxmethod.minClans + " clans on the planet.<br /><br />";
                    
                }
                
                if (taxmethod.midsame == false) {
                    taxtext += "If the population increases above 6,600,000, tax using the ";
                    if (taxmethod.midmethod == 'Growth') {
                        taxtext += taxmethod.midmethod + " method.  This method will tax at the highest collectable rate that will reduce their ";
                        taxtext += "happiness to " + taxmethod.midMinHappy + ", then tax at 0 until they have recovered to a happiness of ";
                        taxtext += taxmethod.midMaxHappy + " before taxing again.<br /><br />";
                    }
                    if (taxmethod.midmethod == 'Safe') {
                        taxtext += taxmethod.midmethod + " method.  This method will tax at the highest collectable rate that will reduce their ";
                        taxtext += "happiness to " + taxmethod.midMinHappy + ", then tax at a rate to maintain this level of happiness.<br /><br />";
                    }
                }
                
                if (taxmethod.maxsame == false) {
                    taxtext += "If the population reaches its maximum, tax using the ";
                    if (taxmethod.maxmethod == 'Growth') {
                        taxtext += taxmethod.maxmethod + " method.  This method will tax at the highest collectable rate that will reduce their ";
                        taxtext += "happiness to " + taxmethod.maxMinHappy + ", then tax at 0 until they have recovered to a happiness of ";
                        taxtext += taxmethod.maxMaxHappy + " before taxing again.";
                    }
                    if (taxmethod.maxmethod == 'Safe') {
                        taxtext += taxmethod.maxmethod + " method.  This method will tax at the highest collectable rate that will reduce their ";
                        taxtext += "happiness to " + taxmethod.maxMinHappy + ", then tax at a rate to maintain this level of happiness.";
                    }
                }
                return taxtext;
            },
        
        getMaxNatives: function(planet) {
            if (planet.nativetype == 9) {
                //siliconoid like it hot
                return nativeMax = planet.temp * 1000;
            }
            else
                return nativeMax = Math.round(Math.sin(3.14 * (100 - planet.temp) / 100) * 150000);
            
        },
        
        getMaxColonists: function(planet,getGrowth) {
            
            var player = vgap.getPlayer(planet.ownerid);
            var raceId = player.raceid;
            
            var climateDeathRate = 10;
            var maxSupported = 0;
            var colGrowth = 0;
            
            //crystal calculation
            if (raceId == 7)
                maxSupported = planet.temp * 1000;
            else {
                //all others
                maxSupported = Math.round(Math.sin(3.14 * (100 - planet.temp) / 100) * 100000);
                if (planet.temp > 84)
                    maxSupported = Math.floor((20099.9 - (200 * planet.temp)) / climateDeathRate);
                else if (planet.temp < 15)
                    maxSupported = Math.floor((299.9 + (200 * planet.temp)) / climateDeathRate);
                    }
            
            //Fascist, Robots, Rebels, Colonies can support a small colony of 60 clans on planets over 80 degrees
            if (raceId == 4 || raceId == 9 || raceId == 10 || raceId == 11) {
                if (planet.temp > 80)
                    maxSupported = Math.max(maxSupported, 60);
            }
            
            //rebel arctic planet advantage
            if (planet.temp <= 19 && raceId == 10)
                maxSupported = Math.max(maxSupported, 90000);
            
            //planetoids do not have an atmosphere
            if (planet.debrisdisk > 0) {
                maxSupported = 0;
                if (vgap.getStarbase(planet.id) != null)
                    maxSupported = 500;
            }
            
            if (!getGrowth)
                return maxSupported;
            
            //determine how much we are overpopulated
            var overPopulation = Math.ceil((planet.clans - maxSupported) * (climateDeathRate / 100));
            if (overPopulation > 0) {
                //recalculate maxsupported/overpopulation
                maxSupported = maxSupported + Math.round(planet.supplies * 10 / 40);
                overPopulation = Math.ceil((planet.clans - maxSupported) * (climateDeathRate / 100));
                
                //update population
                colGrowth = -1 * Math.max(0, overPopulation);
            }
            return colGrowth;
            
            
        },
        
        showPlanetDetailFromStarmap: function(id) {
            this.curplanet = id;
            if (debug) console.log("Clicked! " + id);
            vgap.showDashboard();
            vgap.plugins["plManagerPlugin"].displayPM(1);					
        },
        
        showPlanetDetail: function(id) {
            this.curplanet = id;
            if (debug) console.log("Clicked! " + id);
            vgap.plugins["plManagerPlugin"].displayPM(1);					
        },
        
        getFCColor: function(fc) {
            
            // Borrowed from nu.js to match the client
            var fcbox_color = "lightgrey";
            fcu = fc.toUpperCase();
            if (fcu == "NUK" || fcu == "ATT") fcbox_color = "red";
            else if (fcu == "BUM") fcbox_color = "orchid";
                else if (fcu == "DMP") fcbox_color = "magenta";
                else if (fcu.substr(0, 2) == "PB") fcbox_color = "aqua";
                    
                    return fcbox_color;
            
            /*
				if (fc.toLowerCase() == 'att' || fc.toLowerCase() == 'nuk')
					return "#F62817";
				else if (fc.toLowerCase() == 'pb1' || fc.toLowerCase() == 'pb2')
					return "#0000FF";
				
				return "#FFFFFFF";
				*/
            },
        
        getMineralGrdColor: function(amt) {
            if (amt > 800)
                return "#00FF00";
            if (amt > 400)
                return "#FFFF00";
            
            return "#F62817";
        },
        
        getMineralSfcColor: function(amt) {
            if (amt > 500)
                return "#00FF00";
            if (amt > 50)
                return "#FFFF00";
            
            return "#F62817";
        },	
        
        getMineralDenColor: function(amt) {
            if (amt > 75)
                return "#00FF00";
            if (amt > 25)
                return "#FFFF00";
            
            return "#F62817";
        },
        
        miningAmtPerTurn: function (planet, amount, density) {
            if (planet.mines == 0)
                return "";
            var amt = vgap.plugins["plManagerPlugin"].myMiningRate(planet, density);
            if (amount < amt)
                amt = amount;
            return amt + "/turn";
        },
        
        turnsToMineOut: function (planet, amount, density) {
            if (planet.mines == 0)
                return "";
            if (amount <= 5)
                return "Mined Out";
            var amt = vgap.plugins["plManagerPlugin"].myMiningRate(planet, density);
            if (amount < amt)
                amt = amount;
            var mot = Math.ceil(amount / amt);
            if (mot == 1)
                return mot + " turn";
            else
                return mot + " turns";
            
        },
        
        turnsToMineOutTheoretical: function (planet, amount, density, nummines) {
            if (amount <= 5)
                return "Mined Out";
            var amt = vgap.plugins["plManagerPlugin"].myMiningRateAtNumMines(planet, density, nummines);
            if (amount < amt)
                amt = amount;
            var mot = Math.ceil(amount / amt);
            if (mot == 1)
                return mot + " turn";
            else
                return mot + " turns";
            
        },
        
        miningAmtPerTurnTheoretical: function (planet, amount, density, nummines) {
            var amt = vgap.plugins["plManagerPlugin"].myMiningRateAtNumMines(planet, density, nummines);
            if (amount < amt)
                amt = amount;
            return amt + "/turn";
        },
        
        myMiningRateAtNumMines: function (planet, density, nummines) {
            var factor = 1;
            if (planet.nativetype == 3)
                factor *= 2;
            
            if (planet.debrisdisk > 0 && vgap.getStarbase(planet.id) != null)
                factor *= 2;
            
            var miningrate = 1;
            if (vgap.advActive(31))
                miningrate = 2;
            else if (vgap.advActive(4))
                miningrate = 0.7;
                
                return Math.round(density / 100 * miningrate * factor * nummines);
        },
        
        myMiningRate: function (planet, density) {
            var factor = 1;
            if (planet.nativetype == 3)
                factor *= 2;
            
            if (planet.debrisdisk > 0 && vgap.getStarbase(planet.id) != null)
                factor *= 2;
            
            var miningrate = 1;
            if (vgap.advActive(31))
                miningrate = 2;
            else if (vgap.advActive(4))
                miningrate = 0.7;
                
                return Math.round(density / 100 * miningrate * factor * planet.mines);
        },
        
        getAssimTurns: function(planet) {
            
            //return 5;
            
            var ctemp = planet.clans;
            var ntemp = planet.nativeclans;
            var turns = 1;
            
            while (ctemp < ntemp)
            {
                ntemp -= ctemp;
                ctemp += ctemp;
                turns += 1;
            }
            
            return turns;
            
            
        },
        
        nwc: function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        /*
			getPossFacts: function(planet) {
				
				if (planet.supplies < 3*planet.megacredits)
					return planet.supplies;
				else
					return Math.truncate(planet.megacredits / 3);
			},
			*/
        getPossFacts: function(mc,sup) {
            if (mc == 0)
                return 0;
            if (sup < 3*mc)
                return sup;
            else
                return Math.truncate(mc / 3);	
        },
        
        getPossMines: function(mc,sup) {
            if (mc == 0)
                return 0;
            if (sup < 4*mc)
                return sup;
            else
                return Math.truncate(mc / 4);	
        },
        
        getPossDef: function(mc,sup) {
            if (mc == 0)
                return 0;
            if (sup < 10*mc)
                return sup;
            else
                return Math.truncate(mc / 10);	
        },
        
        planetSetNativeTax: function() {
            //console.log("Entered set Native Tax.");
            var plg = vgap.plugins["plManagerPlugin"];
            
            var planet = vgap.myplanets[plg.planetbuildindex];
            if (planet.nativeclans > 0)  {
                switch (plg.ntarray[vgap.myplanets[plg.planetbuildindex].id]) {
                    case '1':
                    case 1:
                        // No tax
                        planet.nativetaxrate = 0;
                        break;
                    case '2':
                    case 2: 
                        // Manual Taxing. Make no changes
                        break;
                    case '3':
                    case 3: 
                        // Growth Taxing
                        planet.nativetaxrate = plg.getNativeGrowthTaxRate(planet);
                        break;
                    case '4':
                    case 4:
                        // Chunk Taxing
                        planet.nativetaxrate = plg.getNativeChunkTaxRate(planet);
                        break;
                    case '5':
                    case 5:
                        // No Riot Taxing
                        planet.nativetaxrate = plg.getNativeBorgTaxRate(planet);
                        break;
                }
                
                //planet.nativetaxrate = plg.getNativeGrowthTaxRate(planet);
                planet.nativehappychange = vgap.nativeTaxChange(planet);
                planet.changed = 1;
            }
            
        },
        
        planetSetTaxGeneral: function(predict) {
            var plg = vgap.plugins["plManagerPlugin"];
            var planet;
            
            if (predict)
                planet = plg.pplanet;
            else
                planet = vgap.myplanets[plg.planetbuildindex];
            
            var ctaxindex = plg.ctarray[planet.id];
            if (debug) console.log("CTAXINDEX is " + ctaxindex);
            
            
            var ntaxtindex;
            var ntaxmodel;
            if (planet.nativeclans > 0) {
                ntaxindex = plg.ntarray[planet.id];
                if (debug) console.log("nTAXINDEX is " + ntaxindex);
                
            }
            
            
            // Do Colonist Tax First
            if (ctaxindex != 'm') {
                var rate;
                //var ctaxmodel = plg.taxmethods[ctaxindex];
                var ctaxsmallmodel = new Object();
                ctaxsmallmodel.method = plg.taxmethods[ctaxindex].method;
                ctaxsmallmodel.minHappy = plg.taxmethods[ctaxindex].minHappy;
                ctaxsmallmodel.maxHappy = plg.taxmethods[ctaxindex].maxHappy;
                ctaxsmallmodel.minClans = plg.taxmethods[ctaxindex].minClans;
                
                if (planet.clans > 66000 && plg.taxmethods[ctaxindex].midsame == false) {
                    ctaxsmallmodel.method = plg.taxmethods[ctaxindex].midmethod;
                    ctaxsmallmodel.minHappy = plg.taxmethods[ctaxindex].midMinHappy;
                    ctaxsmallmodel.maxHappy = plg.taxmethods[ctaxindex].midMaxHappy;
                    if (debug) console.log("Planet " + planet.name + ": Assigning mid tax");
                }
                if (planet.clans >= plg.getMaxColonists(planet,false) && plg.taxmethods[ctaxindex].maxsame == false) {
                    ctaxsmallmodel.method = plg.taxmethods[ctaxindex].maxmethod;
                    ctaxsmallmodel.minHappy = plg.taxmethods[ctaxindex].maxMinHappy;
                    ctaxsmallmodel.maxHappy = plg.taxmethods[ctaxindex].maxMaxHappy;
                    if (debug) console.log("Planet " + planet.name + ": Assigning max tax");
                }
                if (debug) console.log("Planet " + planet.name + ": Taxing Colonists with " + ctaxsmallmodel.method + ", " + ctaxsmallmodel.minHappy + "->" + ctaxsmallmodel.maxHappy);
                if (planet.clans < plg.taxmethods[ctaxindex].minClans){
                    if (debug) console.log("Planet " + planet.name + ": Col Tax < Min Clans, 0");
                    //planet.colonisttaxrate = 0;
                    rate = 0;
                }
                else {
                    rate = plg.getTaxCols(planet,ctaxsmallmodel);
                    //planet.colonisttaxrate = rate;
                }
                planet.colonisttaxrate = rate;
                var mcfromcols = plg.getColMCFromRate(planet,rate);
                console.log("MCs from cols: " + mcfromcols);
                /*
					if (ctaxmodel.method == "Growth")
						rate = plg.getTaxGrowthCols(planet,taxmodel);
					if (ctaxmodel.method == "Safe")
						rate = plg.getTaxSafeCols(planet,taxmodel);
					
					
					rate = plg.getTaxCols(planet,ctaxmodel);
					
					if (planet.clans > ctaxmodel.minClans)
							planet.colonisttaxrate = rate;	
					*/
                }
                
                // Then do Native Tax
                if (planet.nativeclans > 0) {
                    
                    
                    if (ntaxindex != 'm')	{
                        var rate;
                        var ntaxsmallmodel = new Object();
                        ntaxsmallmodel.method = plg.taxmethods[ntaxindex].method;
                        ntaxsmallmodel.minHappy = plg.taxmethods[ntaxindex].minHappy;
                        ntaxsmallmodel.maxHappy = plg.taxmethods[ntaxindex].maxHappy;
                        ntaxsmallmodel.minClans = plg.taxmethods[ntaxindex].minClans;
                        if (planet.nativeclans < plg.taxmethods[ntaxindex].minClans){
                            if (debug) console.log("Planet " + planet.name + ": Nat Tax < Min Clans, 0");
                            planet.nativetaxrate = 0;
                        }
                        if (planet.nativeclans > 66000 && plg.taxmethods[ntaxindex].midsame == false) {
                            ntaxsmallmodel.method = plg.taxmethods[ntaxindex].midmethod;
                            ntaxsmallmodel.minHappy = plg.taxmethods[ntaxindex].midMinHappy;
                            ntaxsmallmodel.maxHappy = plg.taxmethods[ntaxindex].midMaxHappy;
                            if (debug) console.log("Planet " + planet.name + ": Native  Assigning mid tax");
                        }
                        if (planet.nativeclans >= plg.getMaxNatives(planet) && plg.taxmethods[ntaxindex].maxsame == false) {
                            ntaxsmallmodel.method = plg.taxmethods[ntaxindex].maxmethod;
                            ntaxsmallmodel.minHappy = plg.taxmethods[ntaxindex].maxMinHappy;
                            ntaxsmallmodel.maxHappy = plg.taxmethods[ntaxindex].maxMaxHappy;
                            if (debug) console.log("Planet " + planet.name + ": Native Assigning max tax");
                        }
                        if (debug) console.log("Planet " + planet.name + ": Taxing Natives with " + ntaxsmallmodel.method + ", " + ntaxsmallmodel.minHappy + "->" + ntaxsmallmodel.maxHappy);
                        rate = plg.getTaxNat(planet,ntaxsmallmodel,mcfromcols);
                        
                        
                        planet.nativetaxrate = rate;							
                    }
                    
                    /*
						ntaxmodel = plg.taxmethods[ntaxindex];
						
						if (ntaxmodel.method == "Growth")
							plg.getTaxGrowthNat(planet,taxmodel);
						if (ntaxmodel.method == "Safe")
							plg.getTaxSafeNat(planet,taxmodel);
							
						rate = plg.getTaxNat(planet,ntaxmodel);
					
						if (planet.nativeclans > ntaxmodel.minClans)
							planet.nativetaxrate = rate;	
						*/
                }
                
                return;
                
            },
        
        getTaxNat: function(planet,taxmodel,mccollected) {
            
            var rate;
            
            // Don't tax amorphs
            if (planet.nativetype == 5)
                return 0;
            
            var maxhapchng = vgap.plugins["plManagerPlugin"].ntctest(planet, 0);
            var hapmod = 0;
            if (debug) console.log("Entered Tax Natives: method type = " + taxmodel.method);
            // Hiss check
            var hissships = 0;            
            var plships = vgap.shipsAt(planet.x, planet.y);
            for (var i = 0; i < plships.length; i++) {
            	//console.log("--->  " + JSON.stringify(plships[i]));
            	var raceid = vgap.getPlayer(plships[i].ownerid).raceid;
                if (raceid == 2 && plships[i].mission == 8)	
                    hissships += 1;
                
                if (hissships > 0) {
                    hapmod = (hissships * 5)
                    if (planet.nativehappypoints + hapmod > 100)
                        hapmod = 100-planet.nativehappypoints;
                }
            }
            
            //console.log("nathap + maxhapchng + hapmod = " + (planet.nativehappypoints+maxhapchng+hapmod) + ", compval is " + (100-hapmod));
            //console.log("--->  Hissships:" + hissships);
            if (taxmodel.method == "Growth") {
                if (hissships > 0) {
                    if ((planet.nativehappypoints+hapmod) + maxhapchng < taxmodel.maxHappy-hapmod)
                        return 0;
                }
                else
                    if ((planet.nativehappypoints) + maxhapchng <= taxmodel.maxHappy)
                        return 0;
                    }
            // First, determine the maximum amount we can collect:
            var player = vgap.getPlayer(planet.ownerid);
            var maxmc = planet.clans;
            if (player != null) {
				if (player.raceid == 1)
					maxmc = planet.clans*2;
			}
			
            // Insectoids
            if (planet.nativetype == 6)	
                maxmc += maxmc;
            if (maxmc > (5000 - mccollected))
                maxmc = 5000 - mccollected;
            console.log("In NATTAX: maxmc = " + maxmc);
            var nhchng = (taxmodel.minHappy-hapmod) - (planet.nativehappypoints);
            rate = vgap.plugins["plManagerPlugin"].findNativeRate(planet, nhchng);
            console.log("NATRATE FOUND: " + rate);
            var mc = Math.round(rate * planet.nativegovernment * 20 / 100 * planet.nativeclans / 1000);
            console.log("NATMC FOUND: " + mc);
            // V1.20 - Insectoids overtaxed bug fix
            // We needed to double the mc here as well, not just calculate max above
            if (planet.nativetype == 6)	
                mc += mc;
            // V3.0: Fed 200% tax fix
            if (player != null) {
				if (player.raceid == 1)
					mc += mc;
			}
			
            // Check to find the suggested rate if we can't collect that many megacredits
            if (mc > maxmc) {
				var divfactor = 1;
				if (planet.nativetype == 6) divfactor = divfactor*2;
				if (player != null) {
					if (player.raceid == 1)
						divfactor = divfactor * 2;
				}
				rate = Math.truncate((maxmc/divfactor) / (planet.nativegovernment * 20 / 100 * planet.nativeclans / 1000));
				/*
                rate = Math.truncate(maxmc / (planet.nativegovernment * 20 / 100 * planet.nativeclans / 1000));
                if (planet.nativetype == 6)
                    rate = Math.truncate((maxmc/2) / (planet.nativegovernment * 20 / 100 * planet.nativeclans / 1000));
                */
                console.log("MC>MAXMC: NEW RATE FOUND: " + rate);
                // V3.0 Overtax addition - allow the player to tax 1% on new worlds to squeeze out those early megacredits
                // if normally it would tax at 0% because they can't collect the full amount on 1%
                if (vgap.plugins["plManagerPlugin"].overtax == true && rate == 0)
					rate = 1;
            }
            
            // V2.41 - Cyborg taxing natives over 20% bugfix
            // Check player, if borg, don't tax over 20%
            
            if (player != null) {
				if (player.raceid == 6 && rate > 20)
					rate = 20;
            }
            
            if (taxmodel.method == "Riot") {
                return 100;
            }	

			if (taxmodel.method == "No Tax") {
				return 0;
			}
            return rate;
            
        },
        
        getColMCFromRate: function(planet,rate) {
			var mc = Math.round(rate * planet.clans / 1000);
			var player = vgap.getPlayer(planet.ownerid);
			if (player != null) {
				if (player.raceid == 1)
					mc = Math.round((rate * planet.clans / 1000)*2)
			}
			return mc;
		},
		
		getNatMCFromRate: function(planet,rate) {
			var mc = Math.round(rate * planet.nativegovernment * 20 / 100 * planet.nativeclans / 1000);
            // V1.20 - Insectoids overtaxed bug fix
            // We needed to double the mc here as well, not just calculate max above
            if (planet.nativetype == 6)	
                mc += mc;
                
            return mc;
		},
		
        getTaxCols: function(planet,taxmodel) {
            if (debug) console.log("Entered getTaxCols: " + taxmodel.method);
            var maxhapchng = vgap.plugins["plManagerPlugin"].ctctest(planet, 0);
            var hapmod = 0;
            
            // Hiss check
            var hissships = 0;
            var plships = vgap.shipsAt(planet.x, planet.y);
            for (var i = 0; i < plships.length; i++) {
            	//console.log("--->  " + JSON.stringify(plships[i]));
            	var raceid = vgap.getPlayer(plships[i].ownerid).raceid;
                if (raceid == 2 && plships[i].mission == 8)	
					hissships += 1;
                
                if (hissships > 0) {
                    hapmod = (hissships * 5)
                    if (planet.colonisthappypoints + hapmod > taxmodel.maxHappy)
                        hapmod = 100-planet.colonisthappypoints;
                }
			}
            //console.log("nathap + maxhapchng + hapmod = " + (planet.nativehappypoints+maxhapchng+hapmod) + ", compval is " + (100-hapmod));
            
            if (taxmodel.method == "Riot") {
                return 100;
            }
			if (taxmodel.method == "No Tax") {
				return 0;
			}
            if (taxmodel.method == "Growth" || taxmodel.method == "Chunk") {
                if (hissships > 0) {
                    if ((planet.colonisthappypoints+hapmod) + maxhapchng < taxmodel.maxHappy-hapmod)
                        return 0;
                }
                else
                    if ((planet.colonisthappypoints) + maxhapchng <= taxmodel.maxHappy)
                        return 0;
                    }
            // First, determine the maximum amount we can collect:
            
            if (taxmodel.method == "Chunk") {
                // Calculate the minimum happiness that can be recovered next turn to 70
                
                // So we need to predict build the planet and see what will be there next turn
                plg.planetPredictor(planet, 0, 1);
                
                
            }
            
            var maxmc = planet.clans;
            if (maxmc > 5000)
                maxmc = 5000;
            if (debug) console.log("In SAFE TAX Cols: minHappy = " + taxmodel.minHappy + ", colhappy = " + planet.colonisthappypoints + ", minHap - hapmod = " + (taxmodel.minHappy - hapmod));
            var nhchng = (taxmodel.minHappy-hapmod) - (planet.colonisthappypoints);
            //console.log("nhchng = " + nhchng);
			
			var rate = vgap.plugins["plManagerPlugin"].findColonistRate(planet, nhchng);
			
			var mc = Math.round(rate * planet.clans / 1000);
			var player = vgap.getPlayer(planet.ownerid);
			if (player != null) {
				if (player.raceid == 1)
					mc = Math.round((rate * planet.clans / 1000)*2)
			}
			//console.log("IN TAXCOLS, expecting to collect " + mc + " mc at rate " + rate + ".");
			// Check to find the suggested rate if we can't collect that many megacredits
            
            if (mc > maxmc) {
				
                rate = Math.truncate(maxmc / (planet.clans / 1000));
                mc = Math.round(rate * planet.clans / 1000);
                
                if (player != null) {
					if (player.raceid == 1) {
						rate = Math.truncate(maxmc / ((planet.clans / 1000)*2));
						mc = Math.round((rate * planet.clans / 1000)*2)
					}
				}
				//console.log("MC > maxmc, new rate is " + rate + " and we expect to collect " + mc + "mcs.");
			}
            return rate;
            
        },
        
        getTaxGrowthCols: function(planet,taxmodel) {
            
            var maxhapchng = vgap.plugins["plManagerPlugin"].ctctest(planet, 0);
            var hapmod = 0;
            
            // Hiss check
            var hissships = 0;
            var plships = vgap.shipsAt(planet.x, planet.y);
            for (var i = 0; i < plships.length; i++) {
            	//console.log("--->  " + JSON.stringify(plships[i]));
            	var raceid = vgap.getPlayer(plships[i].ownerid).raceid;
                if (raceid == 2 && plships[i].mission == 8)	
					hissships += 1;
                
                if (hissships > 0) {
                    hapmod = (hissships * 5)
                    if (planet.colonisthappypoints + hapmod > taxmodel.maxHappy)
                        hapmod = 100-planet.colonisthappypoints;
                }
			}
            //console.log("nathap + maxhapchng + hapmod = " + (planet.nativehappypoints+maxhapchng+hapmod) + ", compval is " + (100-hapmod));
            
            if (hissships > 0) {
                if ((planet.colonisthappypoints+hapmod) + maxhapchng < taxmodel.maxHappy-hapmod)
                    return 0;
            }
            else
                if ((planet.colonisthappypoints) + maxhapchng <= taxmodel.maxHappy)
                    return 0;
                
                
                
                // First, determine the maximum amount we can collect:
                
                var maxmc = planet.clans;
            
            if (maxmc > 5000)
                maxmc = 5000;
            
            var nhchng = (taxmodel.minHappy-hapmod) - (planet.colonisthappypoints);
            
            return vgap.plugins["plManagerPlugin"].findColonistRate(planet, nhchng);
            
        },
        
        getTaxSafeCols: function(planet,taxmodel) {
            
            var maxhapchng = vgap.plugins["plManagerPlugin"].ctctest(planet, 0);
            var hapmod = 0;
            
            // Hiss check
            var hissships = 0;
            var plships = vgap.shipsAt(planet.x, planet.y);
            for (var i = 0; i < plships.length; i++) {
            	//console.log("--->  " + JSON.stringify(plships[i]));
            	var raceid = vgap.getPlayer(plships[i].ownerid).raceid;
                if (raceid == 2 && plships[i].mission == 8)	
					hissships += 1;
                
                if (hissships > 0) {
                    hapmod = (hissships * 5)
                    if (planet.colonisthappypoints + hapmod > taxmodel.maxHappy)
                        hapmod = 100-planet.colonisthappypoints;
                }
			}
            if (debug) console.log("nathap + maxhapchng + hapmod = " + (planet.nativehappypoints+maxhapchng+hapmod) + ", compval is " + (100-hapmod));
            
            
            var rate;
            
            // First, determine the maximum amount we can collect:
            
            var maxmc = planet.clans;
            
            if (maxmc > 5000)
                maxmc = 5000;
            
            
            var nhchng = (taxmodel.minHappy-hapmod) - (planet.colonisthappypoints);
            
            
            rate = vgap.plugins["plManagerPlugin"].findColonistRate(planet, nhchng);
            
            var mc = Math.round(rate * planet.nativegovernment * 20 / 100 * planet.nativeclans / 1000);
            
            return rate;
            
        },
        
        findNativeRate: function(planet, nhchng) {
            
            // If they're not going to get mad about 20%, do it
            //if (vgap.plugins["plManagerPlugin"].ntctest(planet,20) > nhchng)
            //	return 20
            
            for (var r = 1; r <= 100; r++) {
                //console.log("Change for rate " + r + "%: " + vgap.plugins["plManagerPlugin"].ntctest(planet,r));
                if (vgap.plugins["plManagerPlugin"].ntctest(planet,r) < nhchng)
                    return r-1;
            }
            return 0;
        },
        
        planetBuildBldgs: function() {
            if (debug) console.log("Planet Build Buildings called.");
            if (debug) console.log("Build Index is " + vgap.plugins["plManagerPlugin"].planetbuildindex );
            if (debug) console.log("Myplanets length is " + vgap.myplanets.length);
            var plg = vgap.plugins["plManagerPlugin"];
            
            if (debug) console.log("Building planet: " + vgap.myplanets[plg.planetbuildindex].id + "  Method is " + plg.bmarray[vgap.myplanets[plg.planetbuildindex].id]);
            if (debug) console.log("Switching " + plg.bmarray[vgap.myplanets[plg.planetbuildindex].id]);
            
            
            if (plg.bmarray[vgap.myplanets[plg.planetbuildindex].id] != 'm') {
                var bmarrayindex = vgap.myplanets[plg.planetbuildindex].id;
                var bm = plg.bmarray[bmarrayindex];
                var bmstring = plg.buildmethods[bm][1];
                //plg.buildBldgsGeneral(plg.buildmethods[plg.bmarray[vgap.myplanets[plg.planetbuildindex].id]]);
                plg.buildBldgsGeneral(bmstring, false);
            }
        },
        
        executePlanetUpdate: function() {
           // console.log("ENTERED EXPLUP");
            var plg = vgap.plugins["plManagerPlugin"];
            if (vgap.plugins["plManagerPlugin"].planetbuildindex >= plg.parray.length) {
                // We're done
                console.log("Done building.");
                //vgap.closeMore();
                vgap.plugins["plManagerPlugin"].buildstatustext = "All Planets Built.";
                vgap.plugins["plManagerPlugin"].ambuilding = false;
                vgap.plugins["plManagerPlugin"].planetbuildindex = 0;
                vgap.plugins["plManagerPlugin"].displayPM(0);
                //vgap.plugins["plManagerPlugin"].saveChanges();
                vgap.save();
            } else {
                var planet = plg.parray[vgap.plugins["plManagerPlugin"].planetbuildindex];
                vgap.plugins["plManagerPlugin"].ambuilding = true;
                vgap.plugins["plManagerPlugin"].buildstatustext = "Building " + (vgap.plugins["plManagerPlugin"].planetbuildindex+1) + " of " + plg.parray.length + "  #" + planet.id + " - " + planet.name;
                //vgap.plugins["plManagerPlugin"].displayPM(0);
                
                //<td class=PLBuildStatus>" + vgap.plugins["plManagerPlugin"].buildstatustext + "</td>
                $('.PLBuildStatus').replaceWith("<td class=PLBuildStatus>" + vgap.plugins['plManagerPlugin'].buildstatustext + "</td>");
                
                // There are still more planets to do
                
                // Randomize Friendly Code if that's selected
                if (plg.fcrandomize == true)
                {
                    // Randomize
                    
                    var fcu = planet.friendlycode.toUpperCase();
                    if (!(fcu == "NUK" || fcu == "ATT" || fcu == "BUM" || fcu == "DMP" || (fcu.substr(0, 2) == "PB") || (fcu.substr(0, 2) == "MF")))
                    {
                        planet.friendlycode = vgap.randomFC();
                        planet.changed = 1;
                        var identifier = "#FCDisp_" + planet.id;
                       // console.log("SELECTOR: " + identifier);
                        $(identifier).replaceWith("<td class=FCDisp data-plid='" + planet.id + "' id='FCDisp_" + planet.id + "' align='center' width='30px' style='border: solid white 1px; color: #0000A0; background-color: " + vgap.plugins["plManagerPlugin"].getFCColor(planet.friendlycode) + ";'><b>" + planet.friendlycode + "</b></td>");
                    }
                }
                
                console.log("Bulding " + planet.name + " ->");                                                    
               // console.log("       " + plg.buildmethods[plg.bmarray[planet.id]][0]);
               // console.log("       " + plg.taxmethods[plg.ctarray[planet.id]].name + "/" + (planet.nativeclans > 0 ? plg.taxmethods[plg.ntarray[planet.id]].name : "-"));
		        vgap.plugins["plManagerPlugin"].planetBuildBldgs();

                // Handle AutoTax check box
                if (plg.ctarray[planet.id] != 'm' && plg.taxmethods[plg.ctarray[planet.id]].name == "Auto Tax") {
					planet.colchange = 1;
    	            planet.changed = 1;
                    //console.log("Auto taxing on " + planet.name);
				} else {
	                planet.colchange = 0;
    	            planet.changed = 1;
                    vgap.plugins["plManagerPlugin"].planetSetTaxGeneral(false);
				}
		        
		        planet.changed = 1;
		        
		        // Modification: Only save after processing every 3rd planet
		        
		        // 2nd Modification V1.20: Save at the end
		        //plg.quickBreak();
		        vgap.plugins["plManagerPlugin"].planetbuildindex++;
		        vgap.plugins["plManagerPlugin"].executePlanetUpdate();
            }
            
            return;
        },
        
        quickBreak: function() {
            var plg = vgap.plugins["plManagerPlugin"];
            if (plg.qb == 0) {
                // We can take a quick break
                console.log("Taking quick break...");
                plg.qb = 1;
                timeoutID = window.setTimeout(plg.quickBreak, 250);
            }
            else {
                // Break time over.  Back to work you scum!
                plg.qb = 0;
                vgap.plugins["plManagerPlugin"].planetbuildindex++;
                vgap.plugins["plManagerPlugin"].executePlanetUpdate();
                
            }
        },
        
        
        saveChanges: function() {
            // Check to see if we're still saving
            var plg = vgap.plugins["plManagerPlugin"];
            
            if (vgap.saveInProgress == 2) {
                // We are still saving, check again in a little bit
                timeoutID = window.setTimeout(vgap.plugins["plManagerPlugin"].saveChanges, 500);
                return;
            }
            // Theres a flaw here with the saved index
            else if (vgap.plugins["plManagerPlugin"].ambuilding == true && vgap.saveInProgress == 0 && vgap.plugins["plManagerPlugin"].savestarted == true) {
                // We have performed a save, but we're still building.  Build the next planet
                vgap.plugins["plManagerPlugin"].savestarted = false;
                //vgap.plugins["plManagerPlugin"].savedindex = planetbuildindex;
                //vgap.plugins["plManagerPlugin"].planetbuildindex++;
                //vgap.plugins["plManagerPlugin"].executePlanetUpdate();
            }
                else {
                    // We can save now
                    vgap.plugins["plManagerPlugin"].savestarted = true;
                    vgap.plugins["plManagerPlugin"].ambuilding = true;
                    vgap.plugins["plManagerPlugin"].buildstatustext = "Building " + (vgap.plugins["plManagerPlugin"].planetbuildindex+1) + " of " + plg.parray.length;
                    vgap.save();
                    vgap.plugins["plManagerPlugin"].displayPM(0);
                    timeoutID = window.setTimeout(vgap.plugins["plManagerPlugin"].saveChanges, 500);
                }
            
            
        },
        
        /* 
			 * This function checks a manually entered code to see if it is valid.
			 */
        checkBuildCode: function(mcode) {
            var checkarray = mcode.split('-');
            if (debug) console.log("In check build, mcode = " + mcode + "  checkarray = " + checkarray);
            if (!(checkarray[0] == 'y' || checkarray[0] == 'Y' || checkarray[0] == 'n' || checkarray[0] == 'N')) {
                console.log("Returning false on yn check");
                return false;
            }
            
            for (var i=1; i < checkarray.length; i+=2) {
                if (!(checkarray[i] == 'f' || checkarray[i] == 'm' || checkarray[i] == 'd' || checkarray[i] == 'rfm')) {
                    if (debug) console.log("Returning false on fmd-rfm check, checkarray[i] is " + checkarray[i]);
                    return false;
                }
                if (checkarray[i] == 'rfm') {
                    if (!(vgap.plugins["plManagerPlugin"].isInteger(checkarray[i+1]) && vgap.plugins["plManagerPlugin"].isInteger(checkarray[i+2]) && vgap.plugins["plManagerPlugin"].isInteger(checkarray[i+3]))) {
                        if (debug) console.log("Returning false on rfm integer check");
                        return false;
                    }
                    i+=2;
                }
                else if (!(vgap.plugins["plManagerPlugin"].isInteger(checkarray[i+1]))) {
                    if (debug) console.log("Returning false on integer check");
                    return false;
                }
                    }
            
            return true;
            
            
            
        },
        
        /* 
			 * This function checks a manually entered code to see if it is valid.
			 */
        getBuildCodeText: function(mcode) {
            var checkarray = mcode.split('-');
            var bctext = "";
            
            if (!(checkarray[0] == 'y' || checkarray[0] == 'Y' || checkarray[0] == 'n' || checkarray[0] == 'N')) {
                console.log("Returning false on yn check");
                return "Invalid Build Code";
            }
            else if (checkarray[0] == 'y' || checkarray[0] == 'Y')
                bctext += "Convert supplies to megacredits if necessary.  ";
                else
                bctext += "Do not convert supplies to megacredits.  ";
            
            
            
            for (var i=1; i < checkarray.length; i+=2) {
                
                if (i==1)
                    bctext += "Build up to ";
                else
                    bctext += "then build up to ";
                
                if (checkarray[i] == 'f')
                    bctext += checkarray[i+1] + " factories, ";
                
                if (checkarray[i] == 'm')
                    bctext += checkarray[i+1] + " mines, ";
                if (checkarray[i] == 'd')
                    bctext += checkarray[i+1] + " defense posts, ";
                if (checkarray[i] == 'rfm') {
                    bctext += checkarray[i+1] + " factories and up to " + checkarray[i+2] + " mines at a ratio of " + checkarray[i+3] + ":1, ";
                    i += 2;
                }
            }
            bctext = bctext.substring(0, bctext.length - 2)
            bctext += ".";
            
            return bctext;
        },
        
        isInteger: function(possibleInteger) {
            return Object.prototype.toString.call(possibleInteger) !== "[object Array]" && /^[\d]+$/.test(possibleInteger);
        },
        
        buildMethodCompleted: function(planet) {
            var plg = vgap.plugins["plManagerPlugin"];
            
            
            if (plg.bmarray[planet.id] == 'm') {
                // For the purposes of this method, a build method of manual is never complete.
                return false;
            }
            
            if (plg.bmarray[planet.id] != 'm') {
                var bmarrayindex = planet.id;
                var bm = plg.bmarray[bmarrayindex];
                var buildplan = plg.buildmethods[bm][1];
                
                var buildarray = buildplan.split('-');
                var buildcount;
                var buildtype;
                
                for (var i = 1; i < buildarray.length; i+=2)
                {
                    buildtype = buildarray[i];
                    buildcount = buildarray[i+1];
                    
                    //console.log("ENTERED BUILD, buildtype = " + buildtype);
                    
                    if (buildtype == 'f') 
                        if (planet.factories < buildcount)
                            return false;
                        
                        if (buildtype == 'm') 
                            if (planet.mines < buildcount)
                                return false;
                            
                            if (buildtype == 'd') 
                                if (planet.defense < buildcount)
                                    return false;
                                
                                if (buildtype == 'rfm') {
                                    var secondarybuildcount = buildarray[i+2];
                                    i+=2;
                                    if (planet.factories < buildcount)
                                        return false;
                                    if (planet.mines < secondarybuildcount)
                                        return false;
                                }
                }
                return true;
            }
            
        },
        
        maxBuilding: function(planet, a) {
            if (planet.clans <= a) {
                return planet.clans;
            } else {
                return Math.floor(a + Math.sqrt(planet.clans - a));
            }
        },
        
        changeMines: function(planet, number) {           
            if (number > 0) {
                if (planet.supplies < number) {
                    number = planet.supplies
                }
                if ((planet.megacredits + planet.supplies) < (number * 5)) {
                    number = Math.floor((planet.megacredits + planet.supplies) / 5);
                }
                var c = this.maxBuilding(planet, 200);
                if (planet.mines > c) {
                    return;
                }
                if ((planet.mines + number) > c) {
                    number = c - planet.mines;
                }
                if (planet.megacredits < (number * 4)) {
                    var b = (number * 4) - planet.megacredits;
                    planet.megacredits += b;
                    planet.supplies -= b;
                    planet.suppliessold += b;
                }
            } else {
                if (planet.builtmines < (-1 * number)) {
                    number = planet.builtmines * -1;
                }
            }
            planet.supplies -= number;
            planet.megacredits -= number * 4;
            planet.builtmines += number;
            planet.mines += number;
        },    

        changeFactories: function(planet, number) {
            if (number > 0) {	
                if (planet.supplies < number) {
                    number = planet.supplies;
                }
                if ((planet.megacredits + planet.supplies) < (number * 4)) {
                    number = Math.floor((planet.megacredits + planet.supplies) / 4);
                }
                var c = this.maxBuilding(planet, 100);
                if (planet.factories > c) {
                    return;
                }
                if ((planet.factories + number) > c) {
                    number = c - planet.factories;
                }
    
                if (planet.megacredits < (number * 3)) {
                    var b = (number * 3) - planet.megacredits;
                    planet.megacredits += b;
                    planet.supplies -= b;
                    planet.suppliessold += b;
                }
            } else {
                if (planet.builtfactories < (-1 * number)) {
                    number = planet.builtfactories * -1;
                }
            }
            planet.supplies -= number;
            planet.megacredits -= number * 3;
            planet.builtfactories += number;
            planet.factories += number;
        },

        changeDefense: function(planet, number) {          
            if (number > 0) {
                if (planet.supplies < number) {
                    number = planet.supplies;
                }
                if ((planet.megacredits + planet.supplies) < (number * 11)) {
                    number = Math.floor((planet.megacredits + planet.supplies) / 11);
                }
                var c = this.maxBuilding(planet, 50);
                if (planet.defense > c) {
                    return;
                }
                if ((planet.defense + number) > c) {
                    number = c - planet.defense;
                }
                if (planet.megacredits < (number * 10)) {
                    var b = (number * 10) - planet.megacredits;
                    planet.megacredits += b;
                    planet.supplies -= b;
                    planet.suppliessold += b;
                }
            } else {
                if (planet.builtdefense < (-1 * number)) {
                    number = planet.builtdefense * -1;
                }
            }
            planet.supplies -= number;
            planet.megacredits -= number * 10;
            planet.builtdefense += number;
            planet.defense += number;
        },
        /*
			 * This method builds according to a buildplan
			 * The buildplan is a string with dashes that explains the build, ie:
			 * f-100-m-200-d-10
			 * Would build 100 factories, then 200 mines, then 10 defense posts
			 * 
			 * Also, you can build in ratios, so:
			 * 
			 * f-10-rfm-100-25-2-d-5
			 * Would build 10 factories, then 100 factories and 25 mines at a 2:1 ratio, then 5 defense posts
			 */ 
        buildBldgsGeneral: function(buildplan, predict) {
            
            var buildarray = buildplan.split('-');
            var buildcount;
            var buildtype;
            var burnsups;
            var plg = vgap.plugins["plManagerPlugin"];
            
            if (buildarray[0] == 'y' || buildarray[0] == 'Y')
                burnsups = true;
            else
                burnsups = false;
            
            //console.log("IN BUILD BUILDINGS: BURNSUPS = " + burnsups);
            
            var planet;
            if (predict)
                planet = plg.pplanet; 
            else {                    
                planet = vgap.myplanets[vgap.plugins["plManagerPlugin"].planetbuildindex];
                //vgap.planetScreen.load(planet);
            }
            
            numbuildtemp = 0;
            var mc = planet.megacredits;
            var sup = planet.supplies;
                                  
            // Prdict next turn taxes. Stop burning supplies if significant cash comming in and we don't have many factories already.
            // This is mostly to stop a bit drop on a native planet from blowing all its supplies to build 10 factories and then
            // Having to eak them out turn after turn there after.
            /*if ((mc + colmc + natmc) > 100 && planet.factories < 20) {
                console.log("Turning off burn supplies. Planet is predicted to have many MC next turn: " + (mc + colmc + natmc));
                burnsups = false;
            }*/					
            
            
            for (var i = 1; i < buildarray.length; i+=2)
            {
                buildtype = buildarray[i];
                buildcount = buildarray[i+1];
                
                if (debug) console.log("ENTERED BUILD, buildtype = " + buildtype);
                
                if (buildtype == 'f') {
                    // Building factories
                    numbuildtemp = Math.max(0,buildcount - planet.factories);
                    if (burnsups) {
                        if (predict)
                            plg.predictChangeFactories(numbuildtemp);
                        else
                            plg.changeFactories(planet, numbuildtemp);
                    }
                    else {
                        var possfact = vgap.plugins["plManagerPlugin"].getPossFacts(mc,sup);
                        if (debug) console.log("Building Factories no burnsup, possfact = " + possfact);
                        if (possfact < numbuildtemp) {
                            // Thats all we can build
                            if (predict)
                                plg.predictChangeFactories(possfact);
                            else
                                plg.changeFactories(planet, possfact);
                        }
                        else {
                            if (predict)
                                plg.predictChangeFactories(numbuildtemp);
                            else
                                //vgap.planetScreen.changeFactories(numbuildtemp);
                               plg.changeFactories(planet, numbuildtemp);
                        }
                    }
                }
                if (buildtype == 'm') {
                    // Building mines
                    numbuildtemp = Math.max(0,buildcount - planet.mines);
                    if (burnsups) {
                        if (predict)
                            plg.predictChangeMines(numbuildtemp);
                        else
                            plg.changeMines(planet, numbuildtemp);
                    }
                    else {
                        var possmines = vgap.plugins["plManagerPlugin"].getPossMines(mc,sup);
                        if (debug) console.log("Building Factories no burnsup, possmines = " + possmines);
                        if (possmines < numbuildtemp) {
                            // Thats all we can build
                            if (predict)
                                plg.predictChangeMines(possmines);
                            else
                                plg.changeMines(planet, possmines);
                        }
                        else {
                            if (predict)
                                plg.predictChangeMines(numbuildtemp);
                            else
                                plg.changeMines(planet, numbuildtemp);
                        }
                    }
                }
                if (buildtype == 'd') {
                    //console.log("Entered build defense");
                    // Building defense posts
                    numbuildtemp = Math.max(0,buildcount - planet.defense);
                    if (debug) console.log("numbuildtemp set");
                    if (burnsups) {
                        if (predict)
                            plg.predictChangeDefense(numbuildtemp);
                        else
                            plg.changeDefense(planet, numbuildtemp);
                    }
                    else {
                        if (debug) console.log("entered else");
                        var possdef = vgap.plugins["plManagerPlugin"].getPossDef(mc,sup);
                        if (debug) console.log("Building Factories no burnsup, possdef = " + possdef);
                        if (possdef < numbuildtemp) {
                            // Thats all we can build
                            if (predict)
                                plg.predictChangeDefense(possdef);
                            else
                                plg.changeDefense(planet, possdef);
                        }
                        else {
                            if (predict)
                                plg.predictChangeDefense(numbuildtemp);
                            else
                                plg.changeDefense(planet, numbuildtemp);
                        }
                    }	
                }
                if (buildtype == 'rfm') {
                    // Building factories and mines according to a ratio
                    
                    var secondarybuildcount = buildarray[i+2];
                    ratio = buildarray[i+3];
                    i+=2;
                    
                    numbuildtemp = Math.max(0,buildcount - planet.factories);
                    var secnumbuildtemp = Math.max(0,secondarybuildcount - planet.mines);
                    var secbuildleft = secnumbuildtemp;
                    
                    var res = vgap.plugins["plManagerPlugin"].calcRFMBuild(numbuildtemp,secnumbuildtemp,ratio,burnsups,mc,sup);
                    if (debug) console.log("**********************");
                    if (debug) console.log("Calculated RFM Build: Factories: " + res.facts + "  Mines: " + res.mines);
                    if (debug) console.log("**********************");
                    
                    if (predict) {
                        plg.predictChangeFactories(res.facts);
                        plg.predictChangeMines(res.mines);
                        secnumbuildtemp -= res.mines;
                        if (burnsups)
                            plg.predictChangeMines(secnumbuildtemp);
                        else {
                            var secpossmines = vgap.plugins["plManagerPlugin"].getPossMines(mc,sup);
                            //console.log("Building Secondary RFM mines no burnsup, secpossmines = " + secpossmines);
                            if (secpossmines < secnumbuildtemp) {
                                // Thats all we can build
                                plg.predictChangeMines(secpossmines);
                            }
                            else 
                                plg.predictChangeMines(secnumbuildtemp);
                        }			
                    }
                    else {
                        plg.changeFactories(planet, res.facts);
                        plg.changeMines(planet, res.mines);
                        secnumbuildtemp -= res.mines;
                        if (burnsups)
                            plg.changeMines(planet, secnumbuildtemp);
                        else {
                            var secpossmines = vgap.plugins["plManagerPlugin"].getPossMines(mc,sup);
                            if (debug) console.log("Building Secondary RFM mines no burnsup, secpossmines = " + secpossmines);
                            if (secpossmines < secnumbuildtemp) {
                                // Thats all we can build
                                plg.changeMines(planet, secpossmines);
                            }
                            else 
                                plg.changeMines(planet, secnumbuildtemp);
                        }
                    }
                }
            }
            
        },
        
        calcRFMBuild: function(numf,numm,ratio,burnsups,mc,sup) {
            
            var result = {};
            result.facts = 0;
            result.mines = 0; 
            
            var suptemp = sup;
            var mctemp = mc;
            var cnt = 0;
            for (var i = 0; i < numf; i++) {
                if (suptemp >=1 && mctemp >= 3) {
                    result.facts++;
                    suptemp -= 1;
                    mctemp -= 3;
                }
                else if (burnsups == true && (mctemp < 3 && suptemp >= 4-mctemp)) {
                    // Burn supplies to build
                    result.facts++;
                    mctemp = 0;
                    suptemp -= 4-mctemp;
                }
                    if (cnt % ratio == 0 && result.mines < numm) {
                        if (suptemp >=1 && mctemp >= 4) {
                            result.mines++;
                            suptemp -= 1;
                            mctemp -= 4;
                        }
                        else if (burnsups == true && (mctemp < 4 && suptemp >= 5-mctemp)) {
                            // Burn supplies to build
                            result.mines++;
                            mctemp = 0;
                            suptemp -= 5-mctemp;
                        }
                            }
                cnt++;
            }
            return result;
        },
        
        /*
			buildBldgsSafeMinDefense: function() {
				console.log("Building buildings Undetected.");
				var planet = vgap.myplanets[vgap.plugins["plManagerPlugin"].planetbuildindex];
				vgap.planetScreen.load(planet);
				numbuildtemp = 0;
				
				if (planet.factories < 14) {
					//console.log("Factories Less than 14 on " + planet.name + ": " + planet.factories);
					numbuildtemp = 14 - planet.factories;
					vgap.planetScreen.changeFactories(numbuildtemp);
				}
				
				if (planet.mines < 19) {
					numbuildtemp = 19 - planet.mines;
					vgap.planetScreen.changeMines(numbuildtemp);
				}
				
				// Now build 15 defense posts, so we won't be detected if we build more buildings:
				if (planet.defense < 15) {
					numbuildtemp = 15 - planet.defense;
					vgap.planetScreen.changeDefense(numbuildtemp);
				}	
				
				var maxfactbld = vgap.plugins["plManagerPlugin"].maxBldgs(planet,100)-planet.factories;
				vgap.planetScreen.changeFactories(maxfactbld);
				
				var maxminebld = vgap.plugins["plManagerPlugin"].maxBldgs(planet,200)-planet.mines;
				vgap.planetScreen.changeMines(maxminebld);
			
				// Close out
				vgap.closeMore();
				planet.changed = 1;
				
				return;
				
			},
			*/
        
        /*
			buildBldgsUndetectedNoBurn: function() {
				console.log("Building buildings Undetected No Burn.");
				console.log("Entered New Build: Build index is " + vgap.plugins["plManagerPlugin"].planetbuildindex);
				var planet = vgap.myplanets[vgap.plugins["plManagerPlugin"].planetbuildindex];
				vgap.planetScreen.load(planet);
				var mctemp = planet.megacredits;
				var suptemp = planet.supplies;
				var numbuildtemp;
				var possfact;
				var possmines;
				var possdefense;
				numbuildtemp = 0;
					
					
				// Build 14 factories first
				if (planet.factories < 14) {
					console.log("Factories Less than 14 on " + planet.name + ": " + planet.factories);
					numbuildtemp = 14 - planet.factories;
				
					possfact = vgap.plugins["plManagerPlugin"].getPossFacts(planet);
					if (possfact < numbuildtemp) {
						// Thats all we can build
						vgap.planetScreen.changeFactories(possfact);
						vgap.closeMore();
						planet.changed = 1;
						return;
					}
					else {
						vgap.planetScreen.changeFactories(numbuildtemp);
						mctemp -= numbuildtemp*3;
						suptemp -= numbuildtemp;
					}
				}
					
				// Now build 19 mines
				if (planet.mines < 19) {
					numbuildtemp = 19 - planet.mines;
					
					possmines = vgap.plugins["plManagerPlugin"].getPossMines(mctemp,suptemp)
					if (possmines < numbuildtemp) {
						// Thats all we can build
						vgap.planetScreen.changeMines(possmines);
						vgap.closeMore();
						planet.changed = 1;
						return;
					}
					else {
						vgap.planetScreen.changeMines(numbuildtemp);
						mctemp -= numbuildtemp*4;
						suptemp -= numbuildtemp;
					}
				}
					
				// Now build 15 defense posts, so we won't be detected if we build more buildings:
				if (planet.defense < 15) {
					numbuildtemp = 15 - planet.defense;
					
					possdefense = vgap.plugins["plManagerPlugin"].getPossDef(mctemp,suptemp)
					if (possdefense < numbuildtemp) {
						// Thats all we can build
						vgap.planetScreen.changeDefense(possdefense);
						vgap.closeMore();
						planet.changed = 1;
						return;
					}
					else {
						vgap.planetScreen.changeDefense(numbuildtemp);
						mctemp -= numbuildtemp*10;
						suptemp -= numbuildtemp;
					}
				}
				//console.log("Maxing factories.");
				// Next Max out factories:
				possfact = vgap.plugins["plManagerPlugin"].getPossFactsMCSup(mctemp,suptemp);
				if (possfact > (vgap.plugins["plManagerPlugin"].maxBldgs(planet,100)-planet.factories))
					possfact = (vgap.plugins["plManagerPlugin"].maxBldgs(planet,100)-planet.factories);
				console.log("Building max factories on " + planet.name + ": " + possfact);	
				vgap.planetScreen.changeFactories(possfact);
				mctemp -= possfact*3;
				suptemp -= possfact;
					
				// Next build max mines:
				possmines = vgap.plugins["plManagerPlugin"].getPossMines(mctemp,suptemp);
				if (possmines > (vgap.plugins["plManagerPlugin"].maxBldgs(planet,200)-planet.mines))
					possmines = (vgap.plugins["plManagerPlugin"].maxBldgs(planet,200)-planet.mines);
				
				console.log("Building max mines on " + planet.name + ": " + possmines);
				vgap.planetScreen.changeMines(possmines);
				mctemp -= possmines*4;
				suptemp -= possmines;
				
				// Finally, max out defense posts:
				possdefense = vgap.plugins["plManagerPlugin"].getPossDef(mctemp,suptemp);
				console.log("Building max defense on " + planet.name + ": " + possdefense);
				vgap.planetScreen.changeDefense(possdefense);
				
				// Close out
				vgap.closeMore();
				planet.changed = 1;
				
				return;
			},
			*/
        /*
			buildBldgsSimple: function() {
				console.log("Build Buildings Simple Called.");
				for (var i = 0; i < vgap.myplanets.length; i++) {
					
					var planet = vgap.myplanets[i];
					console.log("In for loop: planet is " + planet.name);
					
					//vgap.activePlanet.targetx = planet.x;
					//vgap.activePlanet.targety = planet.y;
					//vgap.activePlanet.target = planet;
					vgap.planetScreen.load(planet);
					console.log("In for loop: " + planet.name + "loaded.");
					vgap.planetScreen.changeFactories(vgap.plugins["plManagerPlugin"].getPossFacts(planet));
					console.log("In for loop: " + planet.name + "factories built.");
					vgap.closeMore();
				
					planet.changed = 1;
				}
				vgap.plugins["plManagerPlugin"].displayPM(3);
			},
			
			*/
        /*
			buildBldgs: function() {
				console.log("Build Buildings Called.");
				
				for (var i = 0; i < vgap.myplanets.length; i++) {
					var planet = vgap.myplanets[i];
					vgap.planetScreen.load(planet);
					var mctemp = planet.megacredits;
					var suptemp = planet.supplies;
					
					// Build factories first -- how many can we build?
					var possfact = vgap.plugins["plManagerPlugin"].getPossFacts(planet);
					// Build them
					if (possfact > (vgap.plugins["plManagerPlugin"].maxBldgs(planet,100)-planet.factories))
						possfact = (vgap.plugins["plManagerPlugin"].maxBldgs(planet,100)-planet.factories)
					console.log("Building " + possfact + " additional factories on planet " + planet.name);
					//planet.builtfactories += possfact;	
					//planet.changeFactories(possfact);
					//vgap.planetScreen.changeFactories(possfact);
					//planet.targetfactories = planet.factories + possfact;
					vgap.planetScreen.changeFactories(possfact);
						
					mctemp -= possfact*3;
					suptemp -= possfact;
					
					// Check to see if we can build any mines
					var possmines = vgap.plugins["plManagerPlugin"].getPossMines(mctemp,suptemp)
					// Build them
					if (possmines > (vgap.plugins["plManagerPlugin"].maxBldgs(planet,200)-planet.mines))
						possfact = (vgap.plugins["plManagerPlugin"].maxBldgs(planet,200)-planet.mines)
					//planet.builtmines += possmines;	
					//planet.changeMines(possmines);
					//planet.targetmines = planet.mines + possmines;
					vgap.planetScreen.changeMines(possmines);
					mctemp -= possmines*4;
					suptemp -= possmines;
					
					
					// Check to see if we can build any defense posts
					var possdef = vgap.plugins["plManagerPlugin"].getPossDef(mctemp,suptemp)
					// Build them
					if (possdef > (vgap.plugins["plManagerPlugin"].maxBldgs(planet,50)-planet.defense))
						possfact = (vgap.plugins["plManagerPlugin"].maxBldgs(planet,50)-planet.defense)
					//planet.builtdefense += possdef;	
					//planet.changeDefense(possdef);
					//planet.targetdefense = planet.defense + possdef;
					vgap.planetScreen.changeDefense(possdef);
					
				
					vgap.closeMore();
					planet.changed = 1;
				}
				
				vgap.plugins["plManagerPlugin"].displayPM(3);		
				
			},
			*/
        
        assignColTax: function() {
            if (debug) console.log("Assign Colonist Tax Called.");
            
            for (var i = 0; i < vgap.myplanets.length; i++) {
                var planet = vgap.myplanets[i];
                // Only tax if there's more than 1000 clans
                if (planet.clans > 1000)  {
                    planet.colonisttaxrate = vgap.plugins["plManagerPlugin"].getSuggestedColonistRate(planet);
                    planet.colonisthappychange = vgap.colonistTaxChange(planet);
                    planet.changed = 1;
                }
            }
            
            vgap.plugins["plManagerPlugin"].displayPM(4);		
            
        },
        
        assignTax: function() {
            if (debug) console.log("Assign Tax Called.");
            
            for (var i = 0; i < vgap.myplanets.length; i++) {
                var planet = vgap.myplanets[i];
                if (planet.nativeclans > 0)  {
                    planet.nativetaxrate = vgap.plugins["plManagerPlugin"].getSuggestedNativeRate(planet);
                    planet.nativehappychange = vgap.nativeTaxChange(planet);
                    planet.changed = 1;
                }
            }
            
            vgap.plugins["plManagerPlugin"].displayPM(2);		
            
        },
        
        getSuggestedColonistRate: function(planet) {
            // Get the suggested colonist tax rate for a borg planet.
            // Plan is unclear.
            var dpi = 132;
            
            //var nhchng = 20;
            var nhchng = 70 - planet.colonisthappypoints;
                      
            // Find the rate iteratively instead
            
            var rate = vgap.plugins["plManagerPlugin"].findColonistRate(planet,nhchng);       
            
            if (planet.id == dpi) {
                if (debug) console.log("rate final:" + rate);
                for (var r = 1; r < 20; r++) {
                    if (debug) console.log("Change for rate " + r + "%: " + vgap.plugins["plManagerPlugin"].ctctest(planet,r));
                }
            }
            return rate;	
            
        },
        
        
        findColonistRate: function(planet, nhchng) {
            
            
            for (var r = 1; r <= 100; r++) {
                //console.log("Change for rate " + r + "%: " + vgap.plugins["plManagerPlugin"].ctctest(planet,r));
                if (vgap.plugins["plManagerPlugin"].ctctest(planet,r) < nhchng)
                    return r-1;
            }
            if (vgap.plugins["plManagerPlugin"].ctctest(planet,100) > nhchng)
                return 100
                else
                return 0;
        },
        
        
        ctctest: function(planet,r) {
            var change = 0;
            if (vgap.player.raceid == 7) //crystal
                change = Math.truncate((1000 - (80 * r) - Math.sqrt(planet.clans) - ((planet.mines + planet.factories) / 3) - (3 * (100 - planet.temp))) / 100);
            else
                change = Math.truncate((1000 - (80 * r) - Math.sqrt(planet.clans) - ((planet.mines + planet.factories) / 3) - (3 * Math.abs(planet.temp - 50))) / 100);
            return change;
        },
        
        getSuggestedNativeRate: function(planet) {
            // Get the suggested native tax rate for a borg planet.
            // Plan is this: tax them to rioting, but not more.  They will be assimilated soon.
            var dpi = 201;
            
            if (vgap.plugins["plManagerPlugin"].getAssimTurns(planet) == 1) {
                // If we're going to assimilate them all next turn anyways,
                // pry every last stinkin' megacredit from their cold dead hands
                // as they slowly become one with the Borg.
                return 20;
            }
            
            
            // First, determine the maximum amount we can collect:
            
            var maxmc = planet.clans;
            // Insectoids
            if (planet.nativetype == 6)	
                maxmc += maxmc;
            if (maxmc > 5000)
                maxmc = 5000;
            
            //var nhchng = 20;
            var nhchng = 40 - planet.nativehappypoints;
            
            // Troubleshooting
            if (planet.id == dpi) {
                if (debug) console.log("nhchng init:" + nhchng);
            }
            
            if (planet.nativetype == 4) //avian
                nhchng -= 10;
            if (vgap.getNebulaIntensity(planet.x, planet.y) >= 80) //50ly visibility
                nhchng -= 5;
            
            // Make sure we're not already rioting
            //if (nhchng < 0)
            //	nhchng = 0;
            
            // Troubleshooting
            if (planet.id == dpi) {
                if (debug) console.log("nhchng after riot check:" + nhchng);
            }
            
            
            // Ok, got the max we can collect.  Find out how to get there:
            
            /* From InfoList:
				 * 				Natives change   = trunc(5 + native_gov/2 - sqrt(# natives/1,000,000) 
				 *                            - (# mine + # fact)/200 - tax_rate*.85)
				 * 
				 * In Nu speak, this looks like:
				 * 
				 * 				Natives change = trunc(5 + planet.nativegovernment/2 - sqrt(planet.nativeclans/10000) 
				 * 								- (planet.mines + planet.factories)/200 - planet.nativetaxrate * 0.85
				 * 
				 *
				 * Also from Infolist, the amount of MC recieved from natives:
				 *  MC = planet.nativeclans * planet.nativetaxrate*planet.netivegovernment * .1
				 */
                
                /* From vgap.js:
				  * 
				  * var change = Math.truncate((1000 - Math.sqrt(planet.nativeclans) - (planet.nativetaxrate * 85) - Math.truncate((planet.factories + planet.mines) / 2) - (50 * (10 - planet.nativegovernment))) / 100);
				  * if (planet.nativetype == 4) //avian
				  * 	change += 10;
				  * if (vgap.getNebulaIntensity(planet.x, planet.y) >= 80) //50ly visibility
				  *     change += 5;
				  * 
				  * return change;
				  */ 
                //* var change - Math.truncate((planet.factories + planet.mines) / 2) - (50 * (10 - planet.nativegovernment))) / 100) = Math.truncate((1000 - Math.sqrt(planet.nativeclans) - (planet.nativetaxrate * 85) 
                
                //var gf = 50*(10-planet.nativegovernment);
                var mff = Math.truncate((planet.factories+planet.mines)/2 + 50*(10-planet.nativegovernment));
                var ncf = Math.sqrt(planet.nativeclans);
                // Troubleshooting
                if (planet.id == dpi) {
                    //console.log("gf:" + gf);
                    if (debug) console.log("mff:" + mff);
                    if (debug) console.log("ncf:" + ncf);
                }
                
                //var rate = Math.truncate( ((100 * nhchng) + mff + ncf - 1000)/85)
                // Find the rate iteratively instead
                
                var rate = vgap.plugins["plManagerPlugin"].findRate(planet,nhchng);
                
                
                
                // Troubleshooting
                if (planet.id == dpi) {
                    if (debug) console.log("rate:" + rate);
                }
                //var rate = (change + (50 * (10 - planet.nativegovernment))) / 100)+ Math.truncate((planet.factories + planet.mines) / 2
                
                var mc = Math.round(rate * planet.nativegovernment * 20 / 100 * planet.nativeclans / 1000);
                // Troubleshooting
                if (planet.id == dpi) {
                    if (debug) console.log("mc:" + mc);
                }
                // Check to find the suggested rate if we can't collect that many megacredits
                if (mc > maxmc) 
                    rate = Math.truncate(maxmc / (planet.nativegovernment * 20 / 100 * planet.nativeclans / 1000));
                
                // Troubleshooting
                if (planet.id == dpi) {
                    if (debug) console.log("rate after maxmc check:" + rate);
                }
                
                // Finally, we're Borg.  We can only tax at 20%
                if (rate > 20)
                    rate = 20
                    
                    // Lastly, a rounding fix for those small colonist pop planets, but we want those early megacredits!
                    // If its suggesting 0%, go to 1%, as long as we have some happiness left:
                    if (nhchng <=0 && rate == 0)
                        rate = 1;
                if (planet.id == dpi) {
                    if (debug) console.log("rate final:" + rate);
                    for (var r = 1; r < 20; r++) {
                        if (debug) console.log("Change for rate " + r + "%: " + vgap.plugins["plManagerPlugin"].ntctest(planet,r));
                    }
                }
                return rate;	
                
            },
                
                findRate: function(planet, nhchng) {
                    
                    // If they're not going to get mad about 20%, do it
                    if (vgap.plugins["plManagerPlugin"].ntctest(planet,20) > nhchng)
                        return 20;
                    
                    for (var r = 1; r <= 100; r++) {
                        //console.log("Change for rate " + r + "%: " + vgap.plugins["plManagerPlugin"].ntctest(planet,r));
                        if (vgap.plugins["plManagerPlugin"].ntctest(planet,r) < nhchng)
                            return r-1;
                    }
                    return 0;
                },
                    
                    ntctest: function (planet,rate) {
                        
                        var change = Math.truncate((1000 - Math.sqrt(planet.nativeclans) - (rate * 85) - Math.truncate((planet.factories + planet.mines) / 2) - (50 * (10 - planet.nativegovernment))) / 100);
                        
                        if (planet.nativetype == 4) //avian
                            change += 10;
                        
                        if (vgap.getNebulaIntensity(planet.x, planet.y) >= 80) //50ly visibility
                            change += 5;
                        
                        return change;
                    },
                        
                        maxBldgs: function (planet,baseAmount) {
                            if (planet.clans <= baseAmount)
                                return planet.clans;
                            else
                                return Math.floor(baseAmount + Math.sqrt(planet.clans - baseAmount));
                        },
                            
                            
                            addCss: function(cssString) {
                                var head = document.getElementsByTagName('head')[0];
                                if (head == null)
                                    return
                                    
                                    //return unless head; var newCss = document.createElement('style');
                                    var newCss = document.createElement('style');
                                newCss.type = "text/css";
                                newCss.innerHTML = cssString;
                                head.appendChild(newCss);
                            }, 
                                
                                
                                /*
			 * Note Functions
			 * These functions allow us to store the configuration data as notes on the planets
			 * 
			 * Based on similar functions found in Big Beefer's native tax script
			 */
                
                saveObjectAsNote: function (id, type, obj) {
                    var note = vgap.getNote(id, type);
                    if (note == null)
                        note = vgap.addNote(id, type);
                    note.changed = 1;
                    note.body = JSON.stringify(obj);
                    vgap.save();
                },
                    
                    
                    
                    resetAllNotes: function() {
                        var plg = vgap.plugins["plManagerPlugin"];
                        if (debug) console.log("Resetting all notes...");
                        // Null the arrays
                        plg.bmarray = null;
                        plg.ntarray = null;
                        plg.ctarray = null;
                        plg.buildmethods = null;
                        plg.taxmethods = null;
                        if (debug) console.log("All methods nulled.");
                        plg.bmarray = [];
                        plg.ntarray = [];
                        plg.ctarray = [];
                        plg.buildmethods = [];
                        plg.taxmethods = [];
                        if (debug) console.log("All methods blank arrayed.");
                        // Save the nulls
                        /*
				plg.initSaveObjectAsNote(0, plg.notetype, [plugin_version,plg.bmarray]);
				plg.initSaveObjectAsNote(1, plg.notetype, [plugin_version,plg.ntarray]);
				plg.initSaveObjectAsNote(2, plg.notetype, [plugin_version,plg.tarray]);
				plg.initSaveObjectAsNote(4, plg.notetype, [plugin_version,plg.buildmethodsarray]);
				plg.initSaveObjectAsNote(5, plg.notetype, [plugin_version,plg.taxmethodsarray]);
				*/
                if (debug) console.log("Saving all notes as null.");
                plg.initSaveObjectAsNote(0, plg.notetype, null);
                plg.initSaveObjectAsNote(1, plg.notetype, null);
                plg.initSaveObjectAsNote(2, plg.notetype, null);
                plg.initSaveObjectAsNote(4, plg.notetype, null);
                plg.initSaveObjectAsNote(5, plg.notetype, null);
                // Read Notes
                if (debug) console.log("Reading notes.");
                plg.readOrder = 1;
                plg.readNotes();
            },
                
                
                initSaveObjectAsNote: function (id, type, obj) {
                    var note = vgap.getNote(id, type);
                    if (note == null)
                        note = vgap.addNote(id, type);
                    note.changed = 1;
                    note.body = JSON.stringify(obj);
                    vgap.save();
                    //vgap.plugins["plManagerPlugin"].saveInitChanges();
                },
                    
                    getObjectFromNote: function (id, type) {
                        var note = vgap.getNote(id, type);
                        if (note != null && note.body != "")
                            return JSON.parse(note.body);
                        else
                            return null;
                    },
                        
                        colTaxAmount: function (planet) {
                            var colTax = Math.round(planet.colonisttaxrate * planet.clans / 1000);
                            
                            //player tax rate (fed bonus)
                            var taxbonus = 1;
                            if (vgap.advActive(2)) {
                                taxbonus = 2;
                            }
                            
                            colTax = colTax * taxbonus;
                            
                            if (colTax > 5000)
                                colTax = colTax;
                            
                            return colTax;
                        },
                            
                            natTaxAmount: function (planet) {
                                
                                //cyborg max 20%
                                var nativetaxrate = planet.nativetaxrate;
                                var player = vgap.getPlayer(planet.ownerid);
                                if (player != null) {
                                    if (player.raceid == 6 && nativetaxrate > 20)
                                        nativetaxrate = 20;
                                }
                                
                                var val = Math.round(nativetaxrate * planet.nativetaxvalue / 100 * planet.nativeclans / 1000);
                                
                                if (val > planet.clans)
                                    val = planet.clans;
                                
                                //player tax rate (fed bonus)
                                var taxbonus = 1;
                                if (vgap.advActive(2))
                                    taxbonus = 2;
                                val = val * taxbonus;
                                
                                //insectoid bonus
                                if (planet.nativetype == 6)
                                    val = val * 2;
                                
                                if (val > 5000)
                                    val = 5000;
                                
                                return val;
                            },
                                
                                
                                natTaxAmtTxt: function(planet) {
                                    var txt = "";
                                    var amt = vgap.plugins["plManagerPlugin"].natTaxAmount(planet);
                                    
                                    if (amt == 0)
                                        return txt;
                                    else
                                        return "[+" + amt + "mc]";
                                },
                                    
                                    colTaxAmtTxt: function(planet) {
                                        var txt = "";
                                        var amt = vgap.plugins["plManagerPlugin"].colTaxAmount(planet);
                                        
                                        if (amt == 0)
                                            return txt;
                                        else
                                            return "[+" + amt + "mc]";
                                    },
                                        
                                        happyChgTxt: function(chg) {
                                            var txt = "";
                                            
                                            if (chg == 0)
                                                return txt;
                                            if (chg > 0)
                                                return "(+" + chg + ")";
                                            else
                                                return "(" + chg + ")";
                                        },
                                            
                                            showBldgs: function() {
                                                
                                                var html = "";
                                                var planet = vgap.planetScreen.planet;
                                                
                                                
                                                html = "<p> Factory Manage Plugin v0.1 more<br />"
                                                html += "<p> Planet Name: " + vgap.planetScreen.planet.name + " <br />"
                                                
                                                // Set target factories to 200 on any viewed planet
                                                
                                                planet.targetfactories = 87;
                                                planet.changed = 1;
                                                vgap.planetScreen.build();
                                                vgap.planetScreen.screen.refresh();
                                                
                                                
                                                
                                                $("#Buildings").append(html);
                                                //console.log("FM: planets length is " + vgap.planets.length);
                                                //for (var i = 0; i < vgap.planets.length; i++)
                                                //{
                                                //	console.log("FM: i: " + i + "  Planet Name: " + vgap.planets[i].name);
                                                //}
                                                
                                                
                                            }


};

// register your plugin with NU
vgap.registerPlugin(plManagerPlugin, "plManagerPlugin");




} //wrapper for injection

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);

