// ==UserScript==
// @name        Twitch Plays Pokemon Chat Filter
// @description Chat commands from the Twitch Plays Pokemon stream are filtered.
// @namespace   http://userscripts.org/users/magmarfire
// @include     *twitch.tv/twitchplayspokemon
// @version     1.14
// @grant       none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/624/Twitch%20Plays%20Pokemon%20Chat%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/624/Twitch%20Plays%20Pokemon%20Chat%20Filter.meta.js
// ==/UserScript==

// Changelog:
// v1.14: Added update to dual controls (colons are optional now...)
// v1.13: Added dual controls
// v1.12: Added holding (-) and dragging (>) operators
// v1.11.4: Added forgotten bag command
// v1.11.3: Added forgotten throw command
// v1.11.2: Added reuse command
// v1.11: Commands corresponding to Pokemon slots added.
// v1.10: New betting commands now filtered.
// v1.9: Commands for Anniversary Crystal added.
// v1.8: Betting commands updated for Smash 4 matches.
// v1.7: TPP Arena Anniversary commands added.
// v1.6: ZL/ZR buttons added for the Wii U.
// v1.5: TPP Arena move commands added.
// v1.4: 3DS Control Stick and D-pad added.
// v1.3: Betting commands now filtered.
// v1.2: Nintendo DS support added.
// v1.1: Added support for comma syntax (in Democracy mode).
// v1.0: Original script.

function CanShow(message, sender, myUsername) {
    var regex = /^((((((r|l):?|(>|<))?((c|d)?(left|right|up|down)|start|select|wait|anarchy|democracy|run|poke|reuse|throw|bag|move|item|switch|p|a|b|l|r|x|y|z|s|n|w|e|\d|[ ])-?(\d|\+|>|,\s?)?)*)|(!bet \d* .*)|(!(move )?(a|b|c|d|-|\d))|!(balance|tokens)|!(match \d*,\d*,\d*\/\d*,\d*,\d* \d*)|!(slots? \d+)|(#bet(red|blue)\d+)))$/i;

    return !regex.test(message.replace(/.,!/g, '').trim()) &&
        (sender !== "tppbankbot" || message.toLowerCase().indexOf(myUsername) > -1);
}

$(document).ready(function() {
    $("head").append("<style type='text/css'>.chat-line__message { display: none; }</style>");

    var myUsername = $("#you .username").text().toLowerCase();

    setInterval(function() {
        var messages = $(".chat-line__message");
        messages.each(function() {
            var message = $("span[data-a-target='chat-message-text']", this).text();
            var sender = $(".chat-author__display-name", this).text().toLowerCase();

            if (CanShow(message, sender, myUsername)) {
                $(this).show();
            }
        });
    }, 200);
});