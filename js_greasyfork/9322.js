// ==UserScript==
// @name           ATC-SIM Helper for Chrome
// @namespace      atchelper
// @include        http://www.atc-sim.com/atc.php
// @include        http://atc-sim.com/atc.php
// @include        http://www.atc-sim.com/simulator
// @include        http://atc-sim.com/simulator
// @version        1.7
// @description    Ver 1.6b Highlights planes and strips on mouseover and allows multiple commands to be issued in one line. Adds ability to assign routes to planes
// @downloadURL https://update.greasyfork.org/scripts/9322/ATC-SIM%20Helper%20for%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/9322/ATC-SIM%20Helper%20for%20Chrome.meta.js
// ==/UserScript==
// Notes 

// v1.7 fixed URL issue

// v1.6a
// fixed bug that did not show "simple" command results in status bar

// v1.6
// Edited for use in chrome using tampermonkey
// Added a statusbar since chrome does not have one


// v1.5
// Fixed bug that did not properly clear out a plane's route if you commanded a different route before the first one was complete.

// v1.4
// added ablity to specify a vector as the last waypoint in a route
// fixed bug that kept script from working when using the non www URL

// v1.3
// Corrected readback function for all commands.  Now reads back results of all commands in a combo command
// added ability to issue multipe waypoint clearance (V command) to planes and they will fly to the points in order
// added up arrow now repeats the previous command with the plane you just clicked
// L and R commands after a heading work now

// v1.2
// Fixed bug that stopped readback working on single commands

// v1.1
// added ability to issue multiple "C" commands on one line
// Fixed bug that confused speed and heading

// v1.0
// Highlights plane on mouseover of progress strip, highlight progress strip on mouseover of plane
  

unsafeWindow.g_fn = new Array();
unsafeWindow.g_fnPl = new Array();
unsafeWindow.g_routes = new Array();		
unsafeWindow.g_lastcmd = "";

unsafeWindow.fnAddMoStripEvent = function()
{
	var objProgressStrips = unsafeWindow.frames["ProgressStrips"].document.getElementById("strips");
	var id,cnt;
	
	divs = unsafeWindow.frames["ProgressStrips"].document.getElementsByTagName("div");
	txt = divs.length;

	for(var i = 0; i < divs.length; i++)
	{ 
		id = divs[i].id;
		
		if(unsafeWindow.g_fn[id] != true)
		{
			txt += id + ":true, ";
			unsafeWindow.g_fn[id] = true;
			divs[i].addEventListener( "mouseover", function() {fnPlaneHighlite(id);}, false);
			divs[i].addEventListener( "mouseout", function() {fnPlaneLowlite(id);}, false);
		}
		else
			txt += id + ":false, ";
	}
}


unsafeWindow.fnAddMoPlaneEvent = function()
{
	var objProgressStrips = unsafeWindow.document.getElementById("strips");
	var id,cnt;
	
	divs = unsafeWindow.document.getElementsByClassName("SanSerif12");
	txt = divs.length;

	for(var i = 0; i < divs.length; i++)
	{ 
		
		id = divs[i].id;
		
		if(unsafeWindow.g_fnPl[id] != true)
		{
			txt += id + ":true, ";
			unsafeWindow.g_fnPl[id] = true;
			divs[i].addEventListener( "mouseover", function() {fnStripHighlite(id);}, false);
			divs[i].addEventListener( "mouseout", function() {fnStripLowlite(id);}, false);
		}
		else
			txt += id + ":false, ";
	}
}


function fnPlaneHighlite(id)
{
	var pln = unsafeWindow.document.getElementById(id);
	pln.style.color = "yellow";
	pln.style.fontWeight = "bold";	
}

function fnPlaneLowlite(id)
{
	var pln = unsafeWindow.document.getElementById(id);
	pln.style.color = "white";
	pln.style.fontWeight = "normal";
}


function fnStripHighlite(id)
{
	var pln = unsafeWindow.frames["ProgressStrips"].document.getElementById(id);
	pln.style.border = "1px solid red";
}

function fnStripLowlite(id)
{
	var pln =  unsafeWindow.frames["ProgressStrips"].document.getElementById(id);
	pln.style.border = "1px solid white";
}


// ***************************
// intercept the form submit and parse the commands ourself
// ***************************
function fnReProcess(e)
{
	var x,cnt,y,v,i,w,z;
	var txt = new Array();
	var found ;
	var test;
	var r = new Array();
	
	w="";
	
	var waypoints = false;	
	if(e.keyCode == 38)
	{	// up arrow... repeat previous command
		 unsafeWindow.document.frmClearance.txtClearance.value += unsafeWindow.g_lastcmd.substr(unsafeWindow.g_lastcmd.indexOf(" ")) ;
	}
	
	if(e.keyCode == 27)
	{	// esc
		 unsafeWindow.document.frmClearance.txtClearance.value = "";
	}
		
	if(e.keyCode == 13)
	{
		v = unsafeWindow.document.frmClearance.txtClearance.value;
		unsafeWindow.g_lastcmd = v;
		var inArr =  v.toUpperCase().split(/\s+/);
		
		
		// split it up into separate commands.
		
		if(inArr[1] == "C")
		{	// is it C
			cnt = 0;
			
			// we know next var goes with the C, whether it is a speed, dir, or waypoint
			for(x=2;x < inArr.length;x++)
			{
				if(inArr[x] != "")
				{	// not blank				
					if((inArr[x] != "S") && (inArr[x] != "X") && (inArr[x] != "EX") && (inArr[x] != "T") && (inArr[x] != "H") && (inArr[x] != "V"))
					{ 
						if(waypoints == true)
						{	// we are reading waypoints into the route
							y=0;
							found = false;
							w = " Routed via: ";
							
							for(z=x;z < inArr.length;z++)
							{	// store the route
								
								if(!isNaN(inArr[z]) && (inArr[z].length == 3) )
								{	// its a vector
									
									if((z+1)!=inArr.length)
									{	// we aren't at the last entry in the route, throw an error
										myStatusBar.innerHTML = "Vector must be last entry in route.";
										unsafeWindow.document.frmClearance.txtClearance.value = "";
										e.preventDefault();
										return false;
									}
										
									r[y] = inArr[z];	// store the vector
									y++;
									w += inArr[z];
									if((z+1)<inArr.length)
										w += "->";
								}
								else
								{	// its a waypoint
								
									for (i = 0; i < unsafeWindow.G_arrNavObjects.length; i++) 
									{
										
										if ((unsafeWindow.G_arrNavObjects[i][0] == inArr[z]) && (unsafeWindow.G_arrNavObjects[i][1] > 0)) 
										{	// found the nav id and it's not a runway
									
											r[y] = inArr[z];	// store the NAVID
											y++;
											found = true;
											w += inArr[z];
											if((z+1)<inArr.length)
												w += "->";
												
										}
									}
									
									
									if(found == false)
									{	// throw an error
										myStatusBar.innerHTML = inArr[z] + " is not a valid NAVID";
										unsafeWindow.document.frmClearance.txtClearance.value = "";
										e.preventDefault();
										return false;
									}
								}
								found = false;
							}
							
							x=z;	// dont process any more
							
							// if we get here, then all the NAVIDs were valid
							// declare the route var
							//alert(typeof unsafeWindow.g_routes[inArr[0]]);
							if(typeof unsafeWindow.g_routes[inArr[0]] === "undefined")
							{
								unsafeWindow.g_routes[inArr[0]] = {'rindx':0, 'route':Array()};
							}
									
							for(z=0;z < r.length;z++)
							{	// set the route for this plane. We double buffer in case the navid list has an error, it will not overwrite existing route
								unsafeWindow.g_routes[inArr[0]]['route'][z] = r[z];
							}
							unsafeWindow.g_routes[inArr[0]]['rindx'] = 0;
							
							// set the waypoint to the first one in the list
							txt[cnt] = inArr[0] + " C " + unsafeWindow.g_routes[inArr[0]]['route'][0];
							cnt++;
							
						}
						else
						{	// not a waypoint
							
							// check to see if we should cancel a route clearance
							if(isNaN(inArr[x]) || (inArr[x].length == 3))
							{	// its a waypoint or vector
								
								if(typeof unsafeWindow.g_routes[inArr[0]] !== "undefined")
								{
									delete unsafeWindow.g_routes[inArr[0]];
									w += " Route Clearance Canceled";
								}
								
							}
							
							
							if(inArr.length > (x+1))
							{	// if theres something after this command
								
								// see if there is a trailing L or R
								if((inArr[x+1] == "L") || (inArr[x+1] == "R"))				
								{
									txt[cnt] = inArr[0] + " " + inArr[1] + " " + inArr[x] + " " + inArr[x+1];		// [PLANEID] C [whatever the next command is] [L|R]
									cnt++;
									x++;
									
								}
								else
								{
									txt[cnt] = inArr[0] + " " + inArr[1] + " " + inArr[x];		// [PLANEID] C [whatever the next command is]
									cnt++;
								}
							}
							else
							{	// nothing after this command so just put out the command
								txt[cnt] = inArr[0] + " " + inArr[1] + " " + inArr[x];		// [PLANEID] C [whatever the next command is]
								cnt++;								
							}
						}
						
					}
					else
					{
						if(inArr[x] == "S")
						{	// speed command
							if(inArr.length > (x+1))
							{	// make sure theres something after the S
								txt[cnt] = inArr[0] + " S " + inArr[x+1];		// [PLANEID] S [whatever the next command is]
								cnt++;
								x++;
							}
						}
						
						if((inArr[x] == "X") || (inArr[x] == "EX"))
						{	// Expidite all commands
							for(y=0;y<txt.length;y++)
							{
								txt[y] += " X";
							}
						}
						
						if(inArr[x] == "T")
						{	// takeoff command
							txt[cnt] = inArr[0] + " T"; 		// [PLANEID] T
							cnt++;						
						}
						
						if(inArr[x] == "H")
						{	// hold command
							txt[cnt] = inArr[0] + " H"; 		// [PLANEID] H
							cnt++;						
						}
						
						if(inArr[x] == "V")
						{	// Next entries in the command are waypoints.
							waypoints = true;											
						}
					}
				
				}					
			}
			
			// send all the commands
			var winl,stat;
			
			for(y=0;y<(txt.length);y++)
			{
				
				
				unsafeWindow.document.frmClearance.txtClearance.value = txt[y];
				unsafeWindow.fnParseInput();
				
				if(y == 0)
				{
					//alert(window.status);
                    winl = window.status + " ";
				}
				else
				{
					stat = window.status;
					winl += stat.substr(stat.indexOf(" ")) + " ";
				}
			}	
			
			unsafeWindow.document.frmClearance.txtClearance.value = "";
			myStatusBar.innerHTML = winl + w;
			
			e.preventDefault();
			
		}
        else
        {	// just a simple command
            //alert(window.status);
            unsafeWindow.fnParseInput();
            //alert(window.status);
            myStatusBar.innerHTML = window.status;
            e.preventDefault();
        }
	}
	
 	return false;		
}


function fnMyDistance(strFlightID, intObjectID)
{
	if(typeof unsafeWindow.G_arrNavObjects[intObjectID] !== "undefined")
	{
		return Math.sqrt(Math.pow((unsafeWindow.G_objPlanes[strFlightID][2] + unsafeWindow.intXoffset - unsafeWindow.G_arrNavObjects[intObjectID][2]),2) + Math.pow((unsafeWindow.G_objPlanes[strFlightID][3] + unsafeWindow.intYoffset - unsafeWindow.G_arrNavObjects[intObjectID][3]),2));
	}
	else
	{
		return "x";
	}
}

unsafeWindow.fnWPCheck = function()
{
	var cnt,ID,txt,d;
	var cnt ="";
	d = new String();
	
	for(ID in unsafeWindow.G_objPlanes) 
	{
		
		if(typeof unsafeWindow.g_routes[ID] !== "undefined")
		{	// this plane has a route
			if((unsafeWindow.G_objPlanes[ID][7] == 0) && unsafeWindow.G_objPlanes[ID][11] === null)
			{	// we've reached a waypoint.
				if(unsafeWindow.g_routes[ID]['route'].length > unsafeWindow.g_routes[ID]['rindx']+1)
				{	// theres another waypoint in the route
					
					unsafeWindow.g_routes[ID]['rindx']++;
					txt = unsafeWindow.document.frmClearance.txtClearance.value;
					unsafeWindow.document.frmClearance.txtClearance.value = ID + " C " + unsafeWindow.g_routes[ID]['route'][unsafeWindow.g_routes[ID]['rindx']];
					unsafeWindow.fnParseInput();
					unsafeWindow.document.frmClearance.txtClearance.value = txt;	
				}
			}
		}
	}
	
	if(cnt)
		myStatusBar.innerHTML = cnt
	
}


unsafeWindow.fnCleanup = function()
{	// cleans up vars created in GM when planes are no longer on screen
	
	var ID,cnt;
	
	// planes
	for(ID in unsafeWindow.g_fnPl)
	{ 
		if(!unsafeWindow.document.getElementById(ID))
		{
			delete unsafeWindow.g_fnPl[ID]
		}		
	}
	
	// progress strips
	for(ID in unsafeWindow.g_fn)
	{ 
		if(!unsafeWindow.frames["ProgressStrips"].document.getElementById(ID))
		{
			delete unsafeWindow.g_fn[ID]
		}
	}
	
	// routes
	for(ID in unsafeWindow.g_routes)
	{
		if(!unsafeWindow.document.getElementById(ID))
		{
			delete unsafeWindow.g_routes[ID]
		}
	}	
}
	
var canvasbody, myStatusBar;
canvasbody = document.getElementById('canvas');
if (canvasbody) {
    // create our own "status bar"
    myStatusBar = document.createElement('div');
    myStatusBar.innerHTML = "Welcome to ATC-SIM";
    myStatusBar.setAttribute("id", "myStatus");
    
    myStatusBar.style.position="fixed";
    myStatusBar.style.bottom="0";
    myStatusBar.style.left="0";
    myStatusBar.style.padding= "1px 4px 1px 3px";
    myStatusBar.style.fontSize="12px";

    myStatusBar.style.backgroundColor = "#cccccc";
    
    canvasbody.insertBefore(myStatusBar, canvasbody.firstChild);
    
}


setInterval ( "fnAddMoStripEvent()", 2000 );
setInterval ( "fnAddMoPlaneEvent()", 2000 );
setInterval ( "fnWPCheck()", 2000 );

setInterval ( "fnCleanup()", 5000 );

unsafeWindow.document.frmClearance.txtClearance.addEventListener( "keydown", fnReProcess, false);
