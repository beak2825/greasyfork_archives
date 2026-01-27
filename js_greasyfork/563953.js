// ==UserScript==
// @name         Torn Boomer Perk Icons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enlarge bonus icons in item market for better visibility
// @author       m0tch
// @include      https://torn.com/page.php?sid=ItemMarket*
// @include      https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563953/Torn%20Boomer%20Perk%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/563953/Torn%20Boomer%20Perk%20Icons.meta.js
// ==/UserScript==

//////// VIEW ////////

const stylesheet = `

    .display-bonus {
      background: var(--db-bgc);
      outline: 1px solid var(--db-outline);
      outline-offset: -2px;
    }

    .display-bonus__container {
      display: block
    }

    p.display-bonus__bonus {
      display: inline-block;
      padding-right: 4px;
    }

    .display-bonus .item-bonuses .iconsbonuses span:nth-of-type(1) i{
      transform: scale(2) translate(-2px, 2px);
    }
    .display-bonus .item-bonuses .iconsbonuses span:nth-of-type(2) i{
      transform: scale(2) translate(-6px, 2px);
    }
    .bonuses___a8gmz {
      transform: scale(2) translate(-2px, 2px);
    }
`;

GM_addStyle(stylesheet);
