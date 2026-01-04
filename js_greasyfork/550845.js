// ==UserScript==
// @name         Neopets: "Save Changes" On Top Left
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Moves the "Save Changes" button when editing a PetPage to the top left of the screen
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/preview_homepage.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/550845/Neopets%3A%20%22Save%20Changes%22%20On%20Top%20Left.user.js
// @updateURL https://update.greasyfork.org/scripts/550845/Neopets%3A%20%22Save%20Changes%22%20On%20Top%20Left.meta.js
// ==/UserScript==
/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
..................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
    This script does the following:
    1. Changes the "Save Changes" button's position to fixed so it's always visible even if you scroll
    2. Changes the button's placement so it's always at the top left of the page regardless of the wild things
       happening in your code
    3. Changes the button's z-index to an outrageous value so it's always on top regardless of your unnecessarily
       high z-index values. But seriously, 2 should be a niche case, you don't need 9999!
    4. Makes the button a bit bigger so it's easier to click and see
    And this is all pure CSS, baby! Except for the part where I inject the CSS using JS.

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
..................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
*/

(function() {
    'use strict';

    document.head.insertAdjacentHTML("beforeEnd", `
    <style>
      form:first-of-type {
            position: fixed;
            top: 0;
            left: 0;
            margin: 1em;
            z-index: 9999999;
      }
      input[type="submit"] {
        padding: 1em;
      }
    </style>
    `);
})();