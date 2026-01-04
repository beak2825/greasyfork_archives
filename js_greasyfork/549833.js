// ==UserScript==
// @name         Neopets: Gallery Link on Shops Menu
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.1
// @description  Adds a Gallery link to the Shop menu
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/549833/Neopets%3A%20Gallery%20Link%20on%20Shops%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/549833/Neopets%3A%20Gallery%20Link%20on%20Shops%20Menu.meta.js
// ==/UserScript==
/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
..................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
    This script does the following:
    1. Adds a Gallery link to the Shops menu in the classic Neopets layout
    2. Adds a Gallery link to the Shop menu in the 2020 layout
    3. Allows you to change which gallery page it links to by changing galleryLink
    Note that some userscript writers use relative (/gallery) links instead of absolute (https://neopets.com/gallery)
    links. And then they all get broken in the NC Mall. Don't do that. Just use absolute.
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
..................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
*/

const galleryLink = "https://www.neopets.com/gallery/gallery_desc_edit.phtml";

(function() {
    'use strict';
    document.querySelector('.dropdown li:has([href="/market.phtml?type=your"]')?.insertAdjacentHTML("afterEnd", `<li><a href="${galleryLink}">» Your Gallery</a></li>`);
    document.querySelector("a:has(.shop-usershop-icon)")?.insertAdjacentHTML("afterEnd", `<a href="${galleryLink}"><li><div class="dropdown-icon shop-merchshop-icon"></div><h4>My Gallery</h4></li></a>`)
})();
