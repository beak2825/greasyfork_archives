// ==UserScript==
// @name         NTS Episode volume keys
// @namespace    http://pureandapplied.com.au/userscripts/
// @license      anti-capitalist software license 1.4 https://anticapitalist.software/
// @version      2025-10-23
// @description  use PageUp and PageDown keys to control playback volume on NTS episode player.
// @author       stib
// @match        https://www.nts.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nts.live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553431/NTS%20Episode%20volume%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/553431/NTS%20Episode%20volume%20keys.meta.js
// ==/UserScript==

(function() {
    let keys = {
        // Edit these to set your own custom keys
        modifier: "Shift", // choose from modifier keys as listed on https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
                           // e.g.: "Shift" "Alt" "CapsLock" "Control" "Meta" (Meta = Windows or ⌘ key)
                           // to use no modifier set it to empty quotes ""

        volumeUp: "PageUP", // could also be a letter, e.g. "a" "b" or an arrow "ArrowDown" "ArrowLeft". 
                            // N.B If you use Shift as a modifier key, use the uppercase letter, e.g. "A" "B" etc.
        volumeDn: "PageDown",
        mute:     "End",
        restore:  "Home"
     }

    'use strict';

    function volumeKey(keyPress){
        // console.log(keyPress.key);
        let playr = document.getElementsByClassName("soundcloud-player__content")[0].children[0];
        if (keys.modifier === "" | keyPress.getModifierState(keys.modifier)){
            switch (keyPress.key){
                case keys.volumeUp:
                    // the Math.min method sets a maximum of 1.0, 
                    // the Math.max is for when volume is 0, it sets it to 0.05
                    playr.volume = Math.max(Math.min(playr.volume * 1.1, 1.0), 0.05);
                    break;
                case keys.volumeDn:
                    //console.log("dn");
                    playr.volume = playr.volume * 0.9;
                    break;
                case keys.mute:
                    playr.volume = 0;
                    break;
                case keys.restore:
                    playr.volume = 1.0;
                    break;
            }
        }
        //console.log(playr.volume);
    }
    document.addEventListener("keydown", volumeKey, true);
})();
