// ==UserScript==
// @name         AutoKick
// @namespace    http://your.homepage/
// @version      4.4.0
// @description  Kicks the listed users automatically after a short time (to mimic real kicking).
// @author       Anon
// @match        https://epicmafia.com/game/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/8689/AutoKick.user.js
// @updateURL https://update.greasyfork.org/scripts/8689/AutoKick.meta.js
// ==/UserScript==
 //Disclaimer: The author of this script is not responsible for any way or purpose for which it used.
 //				All users of this script use it at their own risk.
 
console.log("AutoKick activated!");

var scope = $("body").scope();

var kickInt;

var loadCheck = setInterval(function() {
    if (scope.owner) {
        kickInt = setInterval(function() {scan()}, 1000);
        $("#lower-right").append("<li><img id='kickCtrl' src='//i.imgur.com/PwGLjSj.png' width='15' height='15' style='padding-left: 5px; border: none; cursor: pointer;' /></li>");
        var paused = false;
        $("#kickCtrl").click(function() {
            if (paused) {
                $(this).attr("src", "//i.imgur.com/PwGLjSj.png");
                kickInt = setInterval(function() {scan()}, 1000);
                paused = false;
                errordisplay(".errordisplay", "AutoKick resumed!");
            }
            else {
                $(this).attr("src", "//i.imgur.com/ZujDjin.png");
                clearInterval(kickInt);
                paused = true;
                errordisplay(".errordisplay", "AutoKick paused!");
            }
        });
        clearInterval(loadCheck);
    }
}, 1000);

var usedBefore = GM_getValue("emKickUsedBefore2");
if (!usedBefore) {
    alert("Autokick has detected that this is your first time using Autokick 4.0. Head on over to bit.ly/AutoKick to see the instructions for use.");
    GM_setValue("emKickUsedBefore2", true);
}

var notify = GM_getValue("emKickNotify_1");
if (!notify) {
    alert("Just an alert that AutoKick requires emjack (which allows notes to be saved) in order to run. You can download emjack++ here: bit.ly/emjackplusplus");
    GM_setValue("emKickNotify_1", true);
}

var notify3 = GM_getValue("emKickNotify_3");
if (!notify3) {
    alert("AutoKick now includes a pause button in the bottom right by the settings so that you can edit/remove notes without people being kicked.");
    GM_setValue("emKickNotify_3", true);
}

function scan() {
    if (scope.gamestate != 0) {
        clearInterval(kickInt);
        $("#kickCtrl").remove();
    }
    for (var i = 0, note, name, id; i < scope.user_list.length; i++) {
        name = scope.user_list[i];
        id = scope.users[name].id;
        if (notes[name]) {
            note = notes[name];
            note = note.split(" ");
            if (note[0].toLowerCase() == "kick" && !$(".notes").is(":focus")) {
                scope.ban(id);
            }
        }
    }
}
