// ==UserScript==
// @name        WF Formula Graph - New Interface
// @namespace   https://greasyfork.org/en/users/10321-nikitas
// @description Graph for WF Science page - updated for new Interface
// @include     http://*.war-facts.com/science.php*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9869/WF%20Formula%20Graph%20-%20New%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/9869/WF%20Formula%20Graph%20-%20New%20Interface.meta.js
// ==/UserScript==


/*
    Last update: 13/05/2015
    Original Script by 	Omnius   ( http://www.war-facts.com/message.php?player=9972 )
    Updated for New interface and added coloring and old values By guardian

 */


var sciTbl = document.getElementById('scitable');
if ( !sciTbl ) {return;}

var stats=['Skill:','Ing','Agr','Min','Prc','Prd','Phy','Che','Med','Wea','Dri','Con'];
var previousTotal = new Array();
var previousHigh = new Array();
var skills = new Array();
for (var i=0; i<=12; i++) {
    skills[i] = new Array();
    previousTotal[i] = 0;
    previousHigh[i] = 0;
}


function insertSort(a, b, value) {
    if (a < 1) {
        skills[b][a] = value;
    }
    else {
        var v = a - 1;
        while ( v!=-1 && skills[b][v] < value) {
            skills[b][v + 1] = skills[b][v];
            v = v - 1;
        }
        skills[b][v + 1] = value;

    }
}

window.addEventListener("load", function(e) {
    addStuff();
}, false);

function addStuff(){
    var graph = document.createElement("table");
    graph.id = "Graph";
    graph.width = 350;
    graph.style.border  = "solid" ;
    var caption = graph.createCaption();
    caption.innerHTML = "WF Formula Graph";
    caption.className = "head";


    //Create skills header row
    var newTr = document.createElement("tr");
    newTr.vAlign = "bottom";
    newTr.align = "center";
    newTr.className = "dark head";

    for (var i=0; i<12; i++) {
        var newTd = document.createElement("td");
        newTd.style.border = "solid";
        newTd.style.padding = "5px";

        var newDiv = document.createElement("div");
        newDiv.style.padding = "5px";
        newDiv.class = "head";
        newDiv.innerHTML = stats[i];
        newTd.appendChild(newDiv);
        newTr.appendChild(newTd);
    }
    graph.appendChild(newTr);


    //Create total stats row
    newTr = document.createElement("tr");
    newTr.align = "center";
    for (i=0; i<12; i++) {
        var newTd = document.createElement("td");
        newTd.style.border = "solid";
        newTr.appendChild(newTd);
    }
    graph.appendChild(newTr);



    //Create highest stat row
    newTr = document.createElement("tr");
    newTr.align = "center";
    for (i=0; i<12; i++) {
        var newTd = document.createElement("td");
        newTd.style.border = "solid";
        newTr.appendChild(newTd);
    }
    graph.appendChild(newTr);


    newTr = document.createElement("tr");
    newTr.align = "center";
    newTd = document.createElement("td");
    newTd.colSpan = 11;
    newTd.innerHTML = '<input id="graphButton" class="small" value="Refresh" type="button">';
    newTr.appendChild(newTd);
    graph.appendChild(newTr);
    sciTbl.parentNode.insertBefore(graph, sciTbl);

    addButtonListener();
}

function addButtonListener(){
    var button = document.getElementById("graphButton");
    button.addEventListener('click',refreshGraph,true);
}

function refreshGraph(){
    var TeamSize = 0;
    for (var i = 1; i < sciTbl.rows.length; i++) {

        if (sciTbl.rows[i].style.opacity == 0.5) {
            TeamSize = TeamSize + 1;
            for (var j = 2; j < 13; j++) {
                var solu = sciTbl.rows[i].cells[j];

                if (solu) {
                    insertSort(TeamSize-1, j-1, parseInt(solu.innerHTML));

                }

            }
        }
    }
    var graph = document.getElementById("Graph");
    var bar = graph.firstChild.nextSibling.firstChild;
    var totalstat = graph.firstChild.nextSibling.nextSibling.firstChild;
    var highstat = graph.firstChild.nextSibling.nextSibling.nextSibling.firstChild;
    var total = 0;
    var highest = 0;
    var totalDiff = 0;
    var highDiff = 0;
    var sign = "";


    totalstat.innerHTML = "Total:";
    totalstat.style.padding = "3px";
    totalstat.className = "dark head";

    highstat.innerHTML = "Highest:";
    highstat.style.padding = "3px";
    highstat.className = "dark head";

    totalstat = totalstat.nextSibling;
    highstat = highstat.nextSibling;



    for(i=1; i<=12; i++) {
        total = 0;
        highest = 0;
        for(j=0;j<TeamSize;j++) {
            total = total + skills[i][j]/Math.pow(2,j);
            if (skills[i][j] > highest) { highest = skills[i][j] }
        }
        total = Math.round(total*10)/10;



        totalDiff = total - previousTotal[i];
        highDiff = highest - previousHigh[i];

        totalDiff = Math.round(totalDiff*10)/10;

        if (totalDiff > 0 ){ sign = "+"}
        else {sign = ""}

        totalstat.innerHTML = total + " <BR>(" + sign + totalDiff + ")";
        totalstat.style.padding = "5px";


        if (highDiff > 0 ){ sign = "+"}
        else {sign = ""}

        highstat.innerHTML = highest + " <BR>(" + sign + highDiff + ")";
        highstat.style.padding = "5px";




        //Color based on previous values
        if (totalDiff > 0){
            totalstat.style.backgroundColor = "green"
        } else if (totalDiff === 0) {
            totalstat.style.backgroundColor = "transparent"
        } else { // totalDiff < 0
            totalstat.style.backgroundColor = "red"
        }



        if (highDiff > 0){
            highstat.style.backgroundColor = "green"
        } else if (highDiff === 0) {
            highstat.style.backgroundColor = "transparent"
        } else { // highDiff < 0
            highstat.style.backgroundColor = "red"
        }





        previousTotal[i] = total;
        previousHigh[i] = highest;

        totalstat = totalstat.nextSibling;
        highstat = highstat.nextSibling;
    }
}
