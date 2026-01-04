// ==UserScript==
// @name         Neopets: Muted Wheels
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.1
// @description  Mutes all wheels
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/np25birthday*
// @match        *://*.neopets.com/faerieland/wheel*
// @match        *://*.neopets.com/desert/extravagance*
// @match        *://*.neopets.com/medieval/knowledge*
// @match        *://*.neopets.com/prehistoric/mediocrity*
// @match        *://*.neopets.com/halloween/wheel*
// @match        *://*.neopets.com/prehistoric/monotony*
// @match        *://*.neopets.com/premium/wheel*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/550834/Neopets%3A%20Muted%20Wheels.user.js
// @updateURL https://update.greasyfork.org/scripts/550834/Neopets%3A%20Muted%20Wheels.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
..................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
    This script completely mutes all wheels in Neopets. It also fixes a potential memory leak.
    It should work if they add a new wheel, just add its URL to the @match list.
    Honestly, I don't think it can even be called a script.

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
..................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
*/

(function() {
    'use strict';
    wheelSoundStatus = 0;
})();
