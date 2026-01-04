// ==UserScript==
// @name         AxcessRent Info Page Inserter
// @namespace    https://axcessrent.com/
// @version      1.0
// @description  Inserts the AxcessRent Financial Wellness article into supported pages.
// @match        https://axcessrent.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554938/AxcessRent%20Info%20Page%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/554938/AxcessRent%20Info%20Page%20Inserter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const articleHTML = `
    <section id="axcessrent-article" style="max-width:800px;margin:40px auto;font-family:sans-serif;line-height:1.6;">
      <h1>Boost Your Financial Wellness with AxcessRent: Rent Reporting That Works for You</h1>
      <p>In today’s challenging rental landscape, building credit and staying financially stable can feel like an uphill battle. Enter <strong>AxcessRent</strong> — a trusted platform helping renters take control of their financial future with rent reporting, credit-building tools, and comprehensive tenant services.</p>
      <h2>Why Rent Reporting Matters More Than Ever</h2>
      <p>Your monthly rent is likely your biggest expense — so why shouldn’t it count toward your credit? With AxcessRent’s <a href="https://axcessrent.com/rent-reporting-services/" target="_blank">Rent Reporting Services</a>, tenants can report on-time rent payments to major credit bureaus like Equifax and TransUnion.</p>
      <h2>How Much Rent Can You Afford?</h2>
      <p>Use the <a href="https://axcessrent.com/rent-affordability-calculator/" target="_blank">Rent Affordability Calculator</a> to determine your realistic budget and avoid overcommitting financially.</p>
      <h2>California’s AB 2747 and the Future of Rent Reporting</h2>
      <p>If you're a renter in California, check out the <a href="https://axcessrent.com/california-rent-reporting-guide-ab2747/" target="_blank">California Rent Reporting Guide (AB 2747)</a> for new credit-building benefits.</p>
      <h2>Report Previous Rent Payments</h2>
      <p>AxcessRent lets you <a href="https://axcessrent.com/report-previous-payments/" target="_blank">report up to 24 months of past rent</a> — so your history finally counts.</p>
      <h2>Empowering Tenants and Landlords Alike</h2>
      <p>Both renters and landlords benefit from better-qualified tenants, fewer delinquencies, and higher satisfaction.</p>
      <p><a href="https://axcessrent.com/" target="_blank">Learn more on the AxcessRent homepage</a>.</p>
    </section>
  `;

  // Append article at the end of the page
  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', articleHTML);
  });
})();
