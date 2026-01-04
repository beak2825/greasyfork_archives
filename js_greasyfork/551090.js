// ==UserScript==
// @name         Neopets: Bigger SVG on page
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.1
// @description  Resizes customization SVGs so they're 1920px wide/high when you see them in their own page. That way you can save a bigger version.
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @match        *://images.neopets.com/*.svg*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/551090/Neopets%3A%20Bigger%20SVG%20on%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/551090/Neopets%3A%20Bigger%20SVG%20on%20page.meta.js
// ==/UserScript==
/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
..................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
    This script simply resizes an SVG so it's 1920px wide/high. That's it.
    It only works if you're in the .svg page.
    Extremely niche but if it helps one single person other than me, that's good enough.
    Every browser has a feature to take screenshots of a whole page.
      Chrome, Opera: Open DevTools (Ztrl+Shift+I). Click the Laptop/Phone icon at the top left. Write 1920x1920
        t the top. Click on the : menu at the top right. "Capture full size screenshot", or "Capture screenshot"
        if full size is missing. Click the Laptop/Phone icon again or you'll regret it weeks from now.
      Firefox:
        Right-click on the page. Click "Take Screenshot" or press T. Select "Save full page".

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
..................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
*/

(function() {
    'use strict';
    const svg = document.getElementsByTagName("svg")[0];
    ["width", "height"].forEach(d => svg.setAttribute(d, "1920px"));
})();
