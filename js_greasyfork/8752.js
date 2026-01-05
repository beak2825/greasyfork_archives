// ==UserScript==
// @name       Redmine Status Highlighter
// @namespace  http://cbaoth.yav.in
// @version    0.2.1
// @description  Highlight issue status etc. in redmine issue list and details
//
// Change "mydomain" or path "/redmine/" if needed:
// @match      *://*/*/issues*
// @match      *://*/issues/*
// @match      *://*/redmine/*/issues*
// @match      *://*/redmine/issues/*
//
// @require    https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @copyright  2014, cbaoth@gmx.net
// @downloadURL https://update.greasyfork.org/scripts/8752/Redmine%20Status%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/8752/Redmine%20Status%20Highlighter.meta.js
// ==/UserScript==

// Basis: http://userscripts.org/scripts/source/177488.user.js

// Change the colors as desired (examples below)

// prevent jQuery version conflicts (with page)
this.$ = this.jQuery = jQuery.noConflict(true);

(function(){

    // CONFIG
    var ENABLE_PRIORITY   = true; // highlight priority
    var ENABLE_STATUS     = true; // highlight status (and custome fields)
    var ENABLE_IN_LIST    = true; // highlight in issue list
    var ENABLE_IN_DETAILS = true; // highlight in issue detail view
    var DEV_TODO_ONLY     = true; // just highlight things that could be dev todos
    var MY_NAME           = "John Doe"; // for 'assigned to' highlighting

	// which screen are we in    
    var screen = 0;
    if (/\/issues\//.test(window.location.pathname)) {
      screen = 2; // detail screen
    } else {
      screen = 1; // list screen
    }
    // not enabled for current screen?
    if ((screen == 1 && !ENABLE_IN_LIST) || (screen == 2 && !ENABLE_IN_DETAILS)) {
        return;
    }

    // -- PRIORITY ----------------------------------------------------------------
    if (ENABLE_PRIORITY) {
        var priorityList = $('.priority');
        jQuery.each(priorityList, function(i, elem){
            text = $(elem).text().trim();
            if (text == "Immediate")    $(elem).css("background-color", "#FBA"); // red
            if (text == "Urgent")       $(elem).css("background-color", "#FCA"); // orange
            if (text == "High")         $(elem).css("background-color", "#FE8"); // gold
            if (text == "Normal")       $(elem).css("background-color", "#DFF7FF"); // light blue
            if (text == "Low")          $(elem).css("background-color", "#DFE"); // light mint
        });
    }

    // -- STATUS ------------------------------------------------------------------
    if (ENABLE_STATUS) {
        var statusList = $('.status');
        jQuery.each(statusList, function(i, elem){
            text = $(elem).text().trim();
            // change statuses and colors here
            if (text == "New")              $(elem).css("background-color", "#FBA"); // red
            if (text == "Feedback")         $(elem).css("background-color", "#FBF"); // pink
            if (text == "In Progress")      $(elem).css("background-color", "#FE8"); // gold
            if (!DEV_TODO_ONLY) { // ignore the following (not critical for devs)
                if(text == "Resolved")      $(elem).css("background-color", "#DFE"); // light mint
                if(text == "Closed")        $(elem).css("background-color", "#DDD"); // grey
                if(text == "Rejected")      $(elem).css("background-color", "#FB9"); // red/orange
            }
        });
	}
    
    // Assigned To
    var assignedTo = $('.assigned_to');
    jQuery.each(assignedTo, function(i, elem){
        text = $(elem).text().trim();
        if (text == MY_NAME) $(elem).css("background-color", "#FE8"); // gold
    });
})();
