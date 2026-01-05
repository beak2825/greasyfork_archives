// ==UserScript==
// @name            JR Lyric Theory audio hit
// @version         0.1
// @description     A userscript for Lyric Theory which selects the perfectly radio button automatically. Autoplays the audio when accepted.
// @author          (JohnnyRS) (johnnyrs@allbyjohn.com)
// @license         Creative Commons Attribution License
// @include     	http*://*mturkcontent.com/dynamic*
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @run-at          document-end
// @namespace       https://greasyfork.org/users/6406
// @downloadURL https://update.greasyfork.org/scripts/8363/JR%20Lyric%20Theory%20audio%20hit.user.js
// @updateURL https://update.greasyfork.org/scripts/8363/JR%20Lyric%20Theory%20audio%20hit.meta.js
// ==/UserScript==

$(document).ready(function() {
    if ($("div:contains('Listen to the following recording:')").length) {
        if (!$("#submitButton").is(":disabled")) {
            $("input:radio[name='is_good']:first").attr('checked', 'checked');
            $("audio")[0].play();
            setTimeout( function() { $("#submitButton").focus(); }, 1000 );
        }
    }
});
