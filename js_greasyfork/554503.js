// ==UserScript==
// @name         Neopets Bank: Display Daily Interest
// @namespace    https://github.com/fixicelo/userscripts
// @version      1.0.0
// @description  Calculates and displays the daily interest rate next to the annual interest in the Neopets bank.
// @author       fixicelo
// @match        *://www.neopets.com/bank.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @downloadURL https://update.greasyfork.org/scripts/554503/Neopets%20Bank%3A%20Display%20Daily%20Interest.user.js
// @updateURL https://update.greasyfork.org/scripts/554503/Neopets%20Bank%3A%20Display%20Daily%20Interest.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function addDailyInterest() {
    const txtAnnualInterest = document.getElementById("txtAnnualInterest");
    const annualInterest = txtAnnualInterest.innerText
      .replace(/,/g, "")
      .replace(" NP", "");
    const dailyInterest = Math.ceil(parseInt(annualInterest, 10) / 365);
    const dailyInterestText = ` (@${dailyInterest} Daily)`;
    txtAnnualInterest.append(dailyInterestText);
  }

  addDailyInterest();
})();
