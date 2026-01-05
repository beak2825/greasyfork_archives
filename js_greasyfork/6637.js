// ==UserScript==
// @name        Its Learning - Open submissions in new tab
// @namespace   http://rasmuswriedtlarsen.com
// @copyright   2014, Rasmus Wriedt Larsen
// @version     0.1
// @description Can open the individual page for all selected submissions
// @match       https://absalon.itslearning.com/essay/read_essay.aspx*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/6637/Its%20Learning%20-%20Open%20submissions%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/6637/Its%20Learning%20-%20Open%20submissions%20in%20new%20tab.meta.js
// ==/UserScript==


function openAllSubmitted (text) {
    $("tr:contains('"+text+"') a[href^='/essay/']").each ( function () {
        GM_openInTab(this.href);
        //console.log(this.href)
    } );
}

function clickAll(text) {
    $("tr:contains('"+text+"') input").click();
}



$("div.ccl-gridtoolbar ul.itemsright").append("<li><a id='rasmus-hack'>Open all *Afleveret*</a></li>");
$("div.ccl-gridtoolbar ul.itemsright").append("<li><a id='rasmus-hack-under'>Open all *Under bedømmelse*</a></li>");
$("#rasmus-hack").click( function(){openAllSubmitted("Afleveret (Submitted)");} );
$("#rasmus-hack-under").click( function(){openAllSubmitted("Under bedømmelse (Correction in progress)");} );


$("div.ccl-gridtoolbar ul.itemsright").append("<li><a id='rasmus-hack-click'>Tick all *Afleveret*</a></li>");
$("div.ccl-gridtoolbar ul.itemsright").append("<li><a id='rasmus-hack-click-under'>Tick all *Under bedømmelse*</a></li>");
$("div.ccl-gridtoolbar ul.itemsright").append("<li><a id='rasmus-hack-click-genafl'>Tick all *Ej tilfredsstillende*</a></li>");
$("#rasmus-hack-click").click( function(){clickAll("Afleveret (Submitted)");} );
$("#rasmus-hack-click-under").click( function(){clickAll("Under bedømmelse (Correction in progress)");} );
$("#rasmus-hack-click-genafl").click( function(){clickAll("Ej tilfredsstillende - aflever på ny (Not satisfactory, submit new answer)");} );
