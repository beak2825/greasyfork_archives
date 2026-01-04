// ==UserScript==
// @name         Neopets: Remove Tales of Dacardia and Faerie Fragments Spam
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.1.0
// @description  Automatically deletes neomail about Tales of Dacardia and Faerie Fragments rewards
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/neomessages.phtml
// @match        *://*.neopets.com/neomessages.phtml?*folder=Inbox*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/549835/Neopets%3A%20Remove%20Tales%20of%20Dacardia%20and%20Faerie%20Fragments%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/549835/Neopets%3A%20Remove%20Tales%20of%20Dacardia%20and%20Faerie%20Fragments%20Spam.meta.js
// ==/UserScript==
/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
..................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
    This script does the following:
    1. Detects neomail about Tales of Dacardia and Faerie Fragments rewards
    2. Selects all fitting neomail once you open your inbox
    3. Focuses the "Go!" button so they'll be deleted as soon as you press Enter
    This only works on one page at a time.
    The last step can be problematic for accessibility. If you don't wish to autofocus, comment out the last line
    by adding a // in front of it, like so:
    // sel.nextElementSibling.focus();

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
..................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
*/

(function() {
    'use strict';
    const filtered = [...document.querySelectorAll('table[align="center"] tr:not(:first-child):not(:last-child)')]
        .filter(tr => tr.querySelector("td:nth-child(3) b").innerText === "theneopetsteam" && tr.querySelector("td:nth-child(4)")?.innerText.endsWith("Reward Unlocked!"));
    if(filtered.length === 0) return;
    filtered.forEach(tr => {tr.querySelector("input[type='checkbox']").checked = true});
    const sel = document.querySelector("[name='action']");
    sel.selectedIndex = [...sel.options].findIndex(opt => opt.value == "Delete Messages");
    sel.nextElementSibling.focus();
})();
