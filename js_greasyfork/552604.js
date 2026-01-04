// ==UserScript==
// @name         Neopets: Remove Premium Reminders
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.1.1
// @description  Removes all the little "Hey if you have premium you can get X!" things. Doesn't touch actual ads.
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/questlog/
// @match        *://*.neopets.com/games/*
// @match        *://*.neopets.com/neolodge.phtml
// @match        *://*.neopets.com/lab2.phtml
// @match        *://*.neopets.com/process_lab2.phtml
// @match        *://*.neopets.com/petpetlab.phtml
// @match        *://*.neopets.com/process_petpetlab.phtml
// @match        *://*.neopets.com/neoboards/*
// @match        *://*.neopets.com/shops/wizard.phtml*
// @match        *://*.neopets.com/trudys_surprise.phtml
// @match        *://*.neopets.com/gallery/gallery_user_cats.phtml
// @match        *://*.neopets.com/faerieland/darkfaerie.phtml*
// @match        *://*.neopets.com/medieval/earthfaerie.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/552604/Neopets%3A%20Remove%20Premium%20Reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/552604/Neopets%3A%20Remove%20Premium%20Reminders.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does nothing if you have Premium. Absolutely nothing.

    This could be an userstyle. If you know how to work with userstyles, convert it to one instead. Injecting CSS is all
    it does. One little rule with a bucketload of selectors.

    This removes Premium reminders for:
    - Double NP on featured games. I think. If it existed in the first place.
    - Extra game score submissions.
    - Extended NeoLodging bookings.
    - Extra Lab zaps.
    - Extra Petpet Lab zaps.
    - The Shop Wizard.
    - Streak save ticket button when you haven't missed a day in Trudy's Surprise.
    - Streak save ticket button when you haven't missed a day in your daily quests.
    - Extra gallery categories.
    - Illusen and Jhudora.
    - The premium NeoBoard has been removed.

    It does not remove Premium reminders for:
    - Actual ads. Get an adblocker.
    - The pop-up that shows up when you miss a day in Trudy's Surprise. I don't want to miss one.
    - The pop-up that shows up when you miss a day in your daily quests. I don't want to miss one.
    - Any event reminders. I can't see the future.
    - I think there's something in the Battleground of the Obelisk, but it's not showing up yet. I'll update in a week.

    If you see a Premium reminder anywhere else, I missed it. Please contact me by opening an issue in:
      https://github.com/saahphire/NeopetsUserscripts
    Or sending me a message on Discord: @sarahviv
    Or @mentioning that same account on the r/Neopets Discord server.

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

const css = `
.questlog-missed-day, .premium-promo, h3:has( + li .premiumLockedIcon), li:has(.premiumLockedIcon), #shopWizardPremiumPromo, .missed-day-button-container {
  display: none!important;
}
`;

(function() {
    'use strict';
    document.head.insertAdjacentHTML("beforeEnd", `<style>${css}</style>`);
})();
