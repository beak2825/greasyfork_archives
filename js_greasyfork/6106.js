// ==UserScript==
// @name       Link to record
// @namespace  http://stackoverflow.com/
// @version    0.1
// @description  This script turns record numbers into links in the PW editor view of GalleyTracker.
// @match      https://secure.publishersweekly.com/workflow/index.html?*
// @copyright  2014+, Rose Fox
// @require http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/6106/Link%20to%20record.user.js
// @updateURL https://update.greasyfork.org/scripts/6106/Link%20to%20record.meta.js
// ==/UserScript==

$(document).on("ready", function() {
    
    $("table.table-striped td:first-child").each(function(e, i){
        var this$ = $(this);
        var q = this$.html()
        if (/^\d+$/ig.test(q)){
            this$.html("<a href='https://secure.publishersweekly.com/workflow/index.html?endrun=1&submit=Edit&record=" + q + "' >" + q + "</a>");
        }
    });

    $("table.table-striped td:nth-child(3)").each(function(e, i){
        var this$ = $(this);
        var q = this$.html()
        if (/^\d+$/ig.test(q)){
            this$.html("<a href='https://secure.publishersweekly.com/workflow/index.html?endrun=1&submit=Edit&record=" + q + "' >" + q + "</a>");
        }
    });
});
