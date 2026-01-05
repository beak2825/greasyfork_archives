// ==UserScript==
// @name        Easy PugMe
// @author      deetr
// @namespace   http://deetr.me
// @description Adds functionality to tf2pug.me
// @include     http://www.tf2pug.me/
// @version     2.21
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_getValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/9404/Easy%20PugMe.user.js
// @updateURL https://update.greasyfork.org/scripts/9404/Easy%20PugMe.meta.js
// ==/UserScript==

// Add all the buttons
$('#classcheckboxes').find('form').prepend('<input type="button" id="combatButton" value = "Add Combat" class = "dropshadow" style = "border-radius: 5px; background-color: #2A2D35; border: 0; height: 90px; margin-top: 5px; margin-bottom: 5px; margin-left: 10px; margin-right: 5px">');
document.getElementById('combatButton').addEventListener("click", addCombat);

$('#classcheckboxes').find('form').append('<input type="button" id="removeButton" value = "Remove" class = "dropshadow" style = "border-radius: 5px; background-color: #2A2D35; border: 0; height: 90px; margin-top: 5px; margin-bottom: 5px; margin-left: 10px; margin-right: 10px">');
document.getElementById('removeButton').addEventListener("click", removeAll);

// Intialize all the stored values if they don't exist
var savedvals= GM_listValues();

if (savedvals.indexOf("hideHeader") == -1){
    GM_setValue("hideHeader", false);
}
else if (GM_getValue("hideHeader")){
    $('header').hide();
}

$('#classcheckboxes').find('form').append('<span id = "headerToggle">▲</span>');
if (GM_getValue("hideHeader")){
    $('#headerToggle').text("▼");
    document.getElementById('headerToggle').addEventListener("click", showHeader);
}
else{
    document.getElementById('headerToggle').addEventListener("click", hideHeader);
}

if (unsafeWindow.username == null){
    showHeader();
}

/******************

FUNCTIONS

***********************/

function hideHeader(){
    GM_setValue("hideHeader", true);
    $('header').slideUp();
    $('#headerToggle').text("▼");
    document.getElementById('headerToggle').removeEventListener("click", hideHeader);
    document.getElementById('headerToggle').addEventListener("click", showHeader);
}

function showHeader(){
    GM_setValue("hideHeader", false);
    $('header').slideDown();
    $('#headerToggle').text("▲");
    document.getElementById('headerToggle').removeEventListener("click", showHeader);
    document.getElementById('headerToggle').addEventListener("click", hideHeader);
}

function addCombat() {
    if (unsafeWindow.username != null) {
        if (!$("#chkScout").is(':checked')) {
            $("#chkScout").click();
        }
        if (!$("#chkPocket").is(':checked')) {
            $("#chkPocket").click();
        }
        if (!$("#chkRoamer").is(':checked')) {
            $("#chkRoamer").click();
        }
        if (!$("#chkDemo").is(':checked')) {
            $("#chkDemo").click();
        }
    } else {
        alert("You aren't logged in");
    }
}

function removeAll() {
    if (unsafeWindow.game.mode == "picking") {
        alert("Cannot remove while picking in progress");
    } else if (unsafeWindow.username != null) {
        if ($("#chkScout").is(':checked')) {
            $("#chkScout").click();
        }
        if ($("#chkPocket").is(':checked')) {
            $("#chkPocket").click();
        }
        if ($("#chkRoamer").is(':checked')) {
            $("#chkRoamer").click();
        }
        if ($("#chkDemo").is(':checked')) {
            $("#chkDemo").click();
        }
        if ($("#chkMedic").is(':checked')) {
            $("#chkMedic").click();
        }
        if ($("#chkCaptain").is(':checked')) {
            $("#chkCaptain").click();
        }
    } else {
        alert("You aren't logged in");
    }
}