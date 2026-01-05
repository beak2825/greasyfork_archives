// ==UserScript==
// @name           Disable website keyboard hooks
// @description    Stop websites from hijacking keyboard shortcuts.
// @author         Isaac Levy, Jonas Singe
// @run-at         document-start
// @include        *
// @grant          none
// @version        0.0.2
// @namespace      https://github.com/isaacl/keycodeScript
// @downloadURL https://update.greasyfork.org/scripts/5819/Disable%20website%20keyboard%20hooks.user.js
// @updateURL https://update.greasyfork.org/scripts/5819/Disable%20website%20keyboard%20hooks.meta.js
// ==/UserScript==

// Disable these keys when no keyboard modifier is pressed
var std_keycodes = new Set([
    // Add keycodes as desired
    37, 38, 39, 40 // Arrow Keys.
]);

// Disable these keys when Meta key is pressed.
var meta_keycodes = new Set([
    // Add keycodes as desired
    70 // Ctrl + F
]);

// Disable these keys when Alt key is pressed.
var alt_keycodes = new Set([
    // Add keycodes as desired
    83 // Alt + S
]);


// Don't change below this line.

var isMac = navigator.platform.indexOf('Mac') >= 0;


document.addEventListener('keydown', function(e) {
    var keycode_set;
    if (isMac ? e.metaKey : e.ctrlKey) {
        keycode_set = meta_keycodes;
    } else if (e.altKey) {
        keycode_set = alt_keycodes;
    } else {
        keycode_set = std_keycodes;
    }

    if (keycode_set.has(e.keyCode)) {
        e.stopImmediatePropagation();
    }
    return false;
});