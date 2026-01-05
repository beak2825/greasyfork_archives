// ==UserScript==
// @name       Soundexchange
// @author Dormammu
// @version    7.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/7328/Soundexchange.user.js
// @updateURL https://update.greasyfork.org/scripts/7328/Soundexchange.meta.js
// ==/UserScript==

// press 1 to select No
$(window).keyup(function(oph) { 
    if (oph.which == 50) {  $('input[value="NoMyspace"]').prop('checked',true); }
});

$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $('input[value="YesMyspace"]').prop('checked',true); }
});

$('#YesMyspaceExplainQ1').val($('#YesMyspaceExplainQ1').val()+'www.'); 
$('#YesMyspaceExplainQ2').val($('#YesMyspaceExplainQ2').val()+'www.'); 
$('#YesMyspaceExplainQ3').val($('#YesMyspaceExplainQ3').val()+'www.'); 
$('#YesMyspaceExplainQ4').val($('#YesMyspaceExplainQ4').val()+'www.'); 
$('#YesMyspaceExplainQ5').val($('#YesMyspaceExplainQ5').val()+'www.'); 