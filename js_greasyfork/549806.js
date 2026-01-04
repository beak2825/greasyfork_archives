// ==UserScript==
// @name        Hide Card Skimming Sell Button
// @namespace   finally.torn.cardskimming-hide-sell
// @match       https://www.torn.com/page.php?sid=crimes*
// @grant       GM_addStyle
// @version     1.0
// @author      finally [2060206]
// @description Hides sell button in Card Skimming
// @downloadURL https://update.greasyfork.org/scripts/549806/Hide%20Card%20Skimming%20Sell%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/549806/Hide%20Card%20Skimming%20Sell%20Button.meta.js
// ==/UserScript==

GM_addStyle(`
.cardskimming-root [class*='virtualItem']:nth-child(2) [class*='commitButton'] {
  display: none !important;
}
`)