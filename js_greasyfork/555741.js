// ==UserScript==
// @name        OC Payout Helper
// @namespace   finally.torn.oc-payout-helper
// @match       https://www.torn.com/factions.php*
// @grant       none
// @version     1.1
// @author      finally [2060206]
// @description Automatically sets Payout Cut depending on OC payout
// @downloadURL https://update.greasyfork.org/scripts/555741/OC%20Payout%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/555741/OC%20Payout%20Helper.meta.js
// ==/UserScript==

const PAYOUT_MONEY = 80;
const PAYOUT_ITEMS = 0;

const PAYOUT_PERCENTAGE = {
  "Mob Mentality": PAYOUT_MONEY,
  "Pet Project": PAYOUT_MONEY,
  "Cash Me If You Can": PAYOUT_MONEY,
  "Best of the Lot": PAYOUT_ITEMS,
  "Smoke and Wing Mirrors": PAYOUT_ITEMS,
  "Market Forces": PAYOUT_MONEY,
  "Gaslight the Way": PAYOUT_ITEMS,
  "Snow Blind": PAYOUT_MONEY,
  "Stage Fright": PAYOUT_ITEMS,
  "Guardian Angels": PAYOUT_MONEY,
  "Leave No Trace": PAYOUT_MONEY,
  "Counter Offer": PAYOUT_ITEMS,
  "No Reserve": PAYOUT_ITEMS,
  "Bidding War": PAYOUT_MONEY,
  "Honey Trap": PAYOUT_MONEY,
  "Sneaky Git Grab": PAYOUT_MONEY,
  "Blast from the Past": PAYOUT_MONEY,
  "Break the Bank": PAYOUT_MONEY,
  "Clinical Precision": PAYOUT_MONEY,
  "Stacking the Deck": PAYOUT_ITEMS,
  "Ace in the Hole": PAYOUT_MONEY,
};
Object.keys(PAYOUT_PERCENTAGE).forEach(key => {
  let value = PAYOUT_PERCENTAGE[key];
  delete PAYOUT_PERCENTAGE[key];
  PAYOUT_PERCENTAGE[key.toString().toUpperCase()] = value;
});

function checkPayout(node) {
  if (!node?.className?.indexOf || node.className.indexOf("payoutContainer") === -1) {
    return;
  }

  const percentage = node.querySelector("[class*='percentWithLabel__'] input");
  if (!percentage) {
    return;
  }

  const title = node.parentNode.querySelector("[class*='panelTitle__']")?.innerText.trim().toUpperCase();
  if (!title || PAYOUT_PERCENTAGE[title] === undefined) {
    percentage.style["background-color"] = "red";
    return;
  }

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeInputValueSetter.call(percentage, PAYOUT_PERCENTAGE[title]);
  const event = new Event('input', { bubbles: true });
  percentage.dispatchEvent(event);
  percentage.style["background-color"] = "green";
}

new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      checkPayout(addedNode);
    }
  }
}).observe(document.body, { childList: true, subtree: true });