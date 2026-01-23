// ==UserScript==
// @name         Attack Percentage Notifier
// @namespace    Null's namespace
// @description  does some stuff for LP
// @version      0.4
// @author       Null[2042113]
// @match        https://www.torn.com/loader.php*
// @run-at document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563674/Attack%20Percentage%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/563674/Attack%20Percentage%20Notifier.meta.js
// ==/UserScript==

var target_health_percent = 0.2;

function doShit() {
    'use strict';
    
    // Find all progress bars with aria-label containing "Progress:"
    var progressBars = document.querySelectorAll('.progress___iG5el[aria-label^="Progress:"]');
    
    // The opponent's health bar should be one of these (likely index 1)
    if (!progressBars || progressBars.length < 2) {
        return; // Not in combat
    }
    
    var weaponSlot = document.getElementById('weapon_second');
    if (!weaponSlot) {
        return; // Weapon slot doesn't exist
    }
    
    // Extract percentage from aria-label (e.g., "Progress: 16.00%" -> 16.00)
    var ariaLabel = progressBars[1].getAttribute('aria-label');
    var percentMatch = ariaLabel.match(/Progress:\s*([\d.]+)%/);
    
    if (!percentMatch) {
        return; // Couldn't parse percentage
    }
    
    var currentPercent = parseFloat(percentMatch[1]) / 100; // Convert to decimal (0.16)
    
    if (currentPercent <= target_health_percent) {
        weaponSlot.style.backgroundColor = 'red';
        weaponSlot.style.border = '3px solid darkred';
        weaponSlot.style.boxShadow = '0 0 20px red';
    } else {
        weaponSlot.style.backgroundColor = '';
        weaponSlot.style.border = '';
        weaponSlot.style.boxShadow = '';
    }
}

setInterval(doShit, 500);

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}