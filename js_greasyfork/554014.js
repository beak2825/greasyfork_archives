// ==UserScript==
// @name         GT Info + Clickable Search Profiles
// @namespace    https://jamesriver.fellowshiponego.com
// @version      2.4
// @description  Adds Grade/DOB/Gender info to top search dropdown and makes names clickable links
// @author       Caleb Rankin + Nate Kean
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com\
// @match        https://jamesriver.fellowshiponego.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554014/GT%20Info%20%2B%20Clickable%20Search%20Profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/554014/GT%20Info%20%2B%20Clickable%20Search%20Profiles.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /******************************************************************
   * SECTION 1: Make Search Bar Profiles Clickable
   ******************************************************************/
  document.head.insertAdjacentHTML("beforeend", `
    <style id="clickable-search-entries">
      ul.top-nav-autocomplete > li > a .autoCompleteNameHolder {
        color: #176bfb !important;
      }
      ul.top-nav-autocomplete > li > a:hover .autoCompleteNameHolder {
        color: #4685f2 !important;
      }
      .top-nav-autocomplete{
        min-height: 500px !important;
      }
     li.autoCompleteName.ui-menu-item{
        border-style: solid !important;
        border-width: .5px !important;
        border-color: #dddddd !important;
      }
      .gt-week-info {
        margin-top: 4px;
        font-size: 0.8em;
        color: #333;
      }
      .profile-list {
      margin-left: 3rem;
      }
    </style>
  `);

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function waitForElement(selector, pollingRateMs=100, parent=document) {
    let el;
    while (true) {
      el = parent.querySelector(selector);
      if (el) return el;
      await delay(pollingRateMs);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[1]}-${parts[2]}-${parts[0]}` : dateStr;
  }

  function calculateExactAge(dateStr) {
    if (!dateStr) return '';
    const birthDate = new Date(dateStr);
    if (isNaN(birthDate)) return '';
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    let parts = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
    if (days > 0 || parts.length === 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    return parts.join(' ');
  }

  function parseGender(maleValue) {
    if (maleValue === 1 || maleValue === true) return 'Male';
    if (maleValue === 0 || maleValue === false) return 'Female';
    return 'Unknown';
  }

  async function fetchAndDisplay(uid, container) {
    const apiUrl = `https://jamesriver.fellowshiponego.com:443/api/people/${uid}`;
    try {
      const response = await fetch(apiUrl, { headers: { "Accept": "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const jsonData = await response.json();
      const data = jsonData?.data?.person || jsonData?.data || jsonData;

      const grade = data.text6 || '';
      const GTWK1 = formatDate(data.date5);
      const GTWK2 = formatDate(data.date6);
      const GTWK3 = formatDate(data.date7);
      const GTWK4 = formatDate(data.date8);
      const dob = formatDate(data.dateBirth);
      const age = calculateExactAge(data.dateBirth);
      const gender = parseGender(data.male);
      const email = data.mail
      const phone = data.phoneCell
      const phoneHome = data.phoneHome
      const formalFullName = data.formalFullName

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("gt-week-info");
      infoDiv.innerHTML = `
        <ul style="margin:0; padding-left:16px; list-style-type:disc;">
          <li class="profile-list"><strong>Phone:</strong> (M)${phone} (H)${phoneHome}</li>
          <li class="profile-list"><strong>Formal Full Name:</strong> ${formalFullName}</li>
          <li class="profile-list"><strong>Gender:</strong> ${gender}</li>
          <li class="profile-list"><strong>Grade:</strong> ${grade}</li>
          <li class="profile-list"><strong>DOB:</strong> ${dob}</li>
          <li class="profile-list"><strong>Age:</strong> ${age}</li>
          <li class="profile-list"><strong>Email:</strong> ${email}</li>
<!--          <li class="profile-list"><strong>GT Week 1:</strong> ${GTWK1}</li>
          <li class="profile-list"><strong>GT Week 2:</strong> ${GTWK2}</li>
          <li class="profile-list"><strong>GT Week 3:</strong> ${GTWK3}</li>
          <li class="profile-list"><strong>GT Week 4:</strong> ${GTWK4}</li>
        </ul>-->
      `;
      container.appendChild(infoDiv);
    } catch (err) {
      console.error(`Error fetching info for UID ${uid}:`, err);
    }
  }

  function patchEntries(entries) {
    for (const entry of entries) {
      if (!(entry instanceof HTMLElement)) continue;
      if (entry.dataset.gtProcessed) continue;
      entry.dataset.gtProcessed = "true";

      const nameHolder = entry.querySelector("span.autoCompleteNameHolder");
      if (!nameHolder) continue;

      const uidMatch = nameHolder.textContent.match(/\((\d+)\)/);
      if (!uidMatch) continue;
      const uid = uidMatch[1];

      // Make it clickable
      const a = entry.querySelector("a");
      if (a) a.href = `https://jamesriver.fellowshiponego.com/members/view/${uid}`;

      // Fetch and display info
      fetchAndDisplay(uid, entry);
    }
  }

  function onNewAutocompleteChildren(mutationList) {
    for (const mutation of mutationList) {
      patchEntries(mutation.addedNodes);
    }
  }

  (async function init() {
    const autocomplete = await waitForElement("ul.top-nav-autocomplete");
                    console.log(`FOUND IT`);
    const observer = new MutationObserver(onNewAutocompleteChildren);
    observer.observe(autocomplete, { childList: true });
    patchEntries(autocomplete.children);
  })();

})();
