// ==UserScript==
// @name         TORN Stock Market Abbreviations
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show the Abbreviations next to Company names in Torn City's Stock Exchange
// @author       TheDawgLives [3733696] branched from Fuzzyketchup [2206068]
// @match        https://www.torn.com/page.php?sid=stocks
// @grant        none
// @license      GPLv3
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/552505/TORN%20Stock%20Market%20Abbreviations.user.js
// @updateURL https://update.greasyfork.org/scripts/552505/TORN%20Stock%20Market%20Abbreviations.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function getValue(node) {
    const value = node.firstChild.textContent.replace(/[^\d]/g, "");
    return Number(value);
  }

  function getTimeValue(node) {
    const ul = node.parentNode;
    const li = ul.childNodes[3];
    if (li.classList.value.indexOf("Ready") >= 0) {
      return 0;
    } else if (
      li.firstChild.lastChild.classList.value.indexOf("Inactive") >= 0
    ) {
      return 9999;
    }

    var value = li.firstChild.lastChild.textContent.replace(/[^\d]/g, "");
    return Number(value);
  }

  let fixing = false;
  function fixPanel(stockDiv, stockOrder) {
    if (fixing) {
      return;
    }
    fixing = true;

    try {
      const dropdown = stockDiv.querySelector('div[class^="stockDropdown"]');
      if (!dropdown?.nextSibling?.id) {
        return;
      }

      const nextId = dropdown.nextSibling.id;
      if (!nextId) {
        return;
      }

      const index = stockOrder.indexOf(nextId);
      if (index <= 0) {
        return;
      }

      const targetId = CSS.escape(stockOrder[index - 1]);
      const targetDiv = stockDiv.querySelector(`#${targetId}`);
      if (!targetDiv || targetDiv.nextSibling === dropdown) {
        return;
      }

      if (!targetDiv.nextSibling) {
        stockDiv.appendChild(dropdown);
      } else {
        stockDiv.insertBefore(dropdown, targetDiv.nextSibling);
      }
    } finally {
      setTimeout(() => (fixing = false), 750);
    }
  }

  setTimeout(() => {
    const stockOrder = Array.prototype.slice
      .call(document.querySelectorAll('ul[class^="stock"]'), 0)
      .map((x) => x.id);

    const parentDiv = document.getElementById("stockmarketroot");
    const stockDiv = parentDiv.childNodes[2];

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: false };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(() => fixPanel(stockDiv, stockOrder));

    // Start observing the target node for configured mutations
    observer.observe(stockDiv, config);

    for (let ul of stockDiv.childNodes) {
      //Loop through each company and prepends the abbreviation
      const li = ul.firstChild;
      const img = li.firstChild.firstChild;
      const ticker = img.src.replace(/^.*\/([^/]*)\.svg/, "$1");

      const name = li.lastChild;

      name.title = name.textContent;

      name.textContent = `${ticker} - ${name.textContent}`;
    }

    const activeStocksQuery = stockDiv.querySelectorAll(
      'li[class^="stockOwned"]:not([aria-label*=" 0 "])'
    );
    const activeStocks = Array.prototype.slice
      .call(activeStocksQuery, 0)
      .sort((a, b) => getValue(a) - getValue(b))
      .sort((a, b) => getTimeValue(b) - getTimeValue(a));

    for (let li of activeStocks) {
      const ul = li.parentNode;
      stockDiv.insertBefore(ul, stockDiv.firstChild);
    }
  }, 750);
})();
