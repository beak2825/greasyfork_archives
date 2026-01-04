// ==UserScript==
// @name         SellAsist: Ukryj panel SMS na karcie zamówienia
// @namespace    SellAsist Skrypt
// @version      1.0
// @description  Ukrywa sekcję "Wyślij sms do klienta" (#sms_form_send) na stronach kart zamówień w SellAsist.
// @author       Dawid Wróbel
// @match        https://*.sellasist.pl/admin/orders/edit/*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/553949/SellAsist%3A%20Ukryj%20panel%20SMS%20na%20karcie%20zam%C3%B3wienia.user.js
// @updateURL https://update.greasyfork.org/scripts/553949/SellAsist%3A%20Ukryj%20panel%20SMS%20na%20karcie%20zam%C3%B3wienia.meta.js
// ==/UserScript==

(function () {
  if (typeof GM_addStyle === "function") {
    GM_addStyle(`
      #sms_form_send { display: none !important; }
    `);
  }

  const hideSmsPanel = () => {
    const el = document.getElementById("sms_form_send");
    if (el && el.style.display !== "none") {
      el.style.setProperty("display", "none", "important");
    }
  };

  hideSmsPanel();

  const observer = new MutationObserver(() => hideSmsPanel());
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();