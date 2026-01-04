// ==UserScript==
// @name         Execute Attack Notifier - modded for ez configuration
// @namespace
// @version      0.2.2
// @description  Highlights secondary weapon when target HP is under a configurable threshold.
// @author       Null[2042113] - mod by GFOUR
// @match        https://www.torn.com/loader.php*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace https://torn.com/
// @downloadURL https://update.greasyfork.org/scripts/549439/Execute%20Attack%20Notifier%20-%20modded%20for%20ez%20configuration.user.js
// @updateURL https://update.greasyfork.org/scripts/549439/Execute%20Attack%20Notifier%20-%20modded%20for%20ez%20configuration.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Load saved value or default to 0.6 (60%)
    let target_health_percent = Number(GM_getValue('target_health_percent', 0.6));

    // Menu command to change the target threshold
    GM_registerMenuCommand(
        `Set target health % (current: ${Math.round(target_health_percent * 100)}%)`,
        () => {
            const input = prompt(
                'Enter target health percent.\nExamples: 0.6 or 60 or 60%',
                String(target_health_percent)
            );
            if (input === null) return;

            let normalized = String(input).trim().replace(',', '.');
            if (/%$/.test(normalized)) normalized = normalized.replace('%', '');
            let val = parseFloat(normalized);
            if (isNaN(val)) {
                alert('Invalid number.');
                return;
            }
            if (val > 1) val = val / 100; // Convert 60 -> 0.6

            if (val <= 0 || val >= 1) {
                alert('Please enter a value between 0 and 1 (e.g., 0.6 for 60%).');
                return;
            }

            GM_setValue('target_health_percent', val);
            target_health_percent = val;
            alert(`Saved! Now using ${Math.round(val * 100)}%. Reload the page to update the menu label.`);
        }
    );

    function doShit() {
        try {
            const healthNodes = document.querySelectorAll('[id^=player-health-value]');
            if (!healthNodes || healthNodes.length === 0) return;

            // Use the last node to be a bit more robust
            const text = (healthNodes[healthNodes.length - 1].innerText || '').replace(/\s/g, '');
            if (!text.includes('/')) return;

            const [curStr, maxStr] = text.split('/').map(x => x.replace(/,/g, ''));
            const cur = Number(curStr);
            const max = Number(maxStr);
            if (!(cur > 0) || !(max > 0)) return;

            const hpPct = cur / max;
            const weapon = document.getElementById('weapon_second');
            if (!weapon) return;

            if (hpPct <= target_health_percent) {
                weapon.style.background = 'red';
            } else {
                // Reset when above threshold (optional)
                weapon.style.background = '';
            }
        } catch (e) {
            // Silently ignore errors
        }
    }

    setInterval(doShit, 500);

    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
        that detects and handles AJAXed content.

        IMPORTANT: This function requires your script to have loaded jQuery.
    */
    function waitForKeyElements(
        selectorTxt,
        actionFunction,
        bWaitOnce,
        iframeSelector
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents()
                .find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound)
                        btargetsFound = false;
                    else
                        jThis.data('alreadyFound', true);
                }
            });
        }
        else {
            btargetsFound = false;
        }

        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        if (btargetsFound && bWaitOnce && timeControl) {
            clearInterval(timeControl);
            delete controlObj[controlKey]
        }
        else {
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                },
                    300
                );
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
})();