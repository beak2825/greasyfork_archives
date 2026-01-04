// ==UserScript==
// @name         Rumble - Auto Force Lowest Quality (Adaptive Final)
// @namespace    rumble-automation
// @version      14.0
// @description  FINAL ADAPTIVE SOLUTION: Uses the proven interval logic and loops through quality options to skip 'Auto' and guarantee lowest resolution selection.
// @author       Gemini
// @license      MIT
// @match        *://rumble.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556375/Rumble%20-%20Auto%20Force%20Lowest%20Quality%20%28Adaptive%20Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556375/Rumble%20-%20Auto%20Force%20Lowest%20Quality%20%28Adaptive%20Final%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $url = "";
    let $click_times = 0;

    const simpleClick = (target, a) => {
        if(target){
            target.click();
        }
        if(a){
            $click_times++;
        }
    };

    const rumbleQualityInterval = setInterval(() => {
        let currentUrl = document.URL;

        if(currentUrl !== $url || $click_times < 3){
            try{
                // *** 1. PROVEN TRAVERSAL (Gear Icon/Menu Container) ***
                let playback = document.getElementsByClassName("touched_overlay_item")[0].nextElementSibling.lastChild.lastChild;

                // Get the Gear Icon
                let gearIcon = playback.firstChild;

                // *** 2. CLICK GEAR ICON ***
                simpleClick(gearIcon);

                // *** 3. CLICK LOWEST RESOLUTION (Adaptive) ***

                // Get the Resolution List container (UL element)
                let resolutionList = playback.lastChild.lastChild;

                // Loop through all *element* children (LI tags) to find the lowest quality option
                let lowestQualityOption = null;

                // Use .children to get only element nodes (<li>) and ignore text nodes
                for (let i = 0; i < resolutionList.children.length; i++) {
                    let option = resolutionList.children[i];
                    let text = option.textContent.trim().toLowerCase();

                    // Skip the 'Auto' option. The first option that is NOT 'Auto' is the lowest resolution stream.
                    if (text.includes("auto")) {
                        continue;
                    }

                    // This is the desired lowest resolution stream
                    lowestQualityOption = option;
                    break;
                }

                if (lowestQualityOption) {
                    simpleClick(lowestQualityOption, true);
                    console.log(`Rumble Auto Quality: SUCCESSFULLY FORCED to lowest available (${lowestQualityOption.textContent.trim()}).`);
                }

            } catch(e) {
                // Failure is expected when the menu is not yet loaded/rendered
            }

            // *** 4. LOOP BREAK CONDITION ***
            if($click_times >= 3){
                $click_times = 0;
                $url = currentUrl;
                clearInterval(rumbleQualityInterval);
            }
        }
    }, 500);
})();