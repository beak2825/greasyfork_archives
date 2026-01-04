// ==UserScript==
// @name         Add Individuals to Group show contact info
// @namespace    https://jamesriver.fellowshiponego.com
// @version      1.1
// @description  Adds Formal Full Name Assign Interactions search dropdown
// @author       Caleb Rankin + Nate Kean
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com\
// @match        https://jamesriver.fellowshiponego.com/members/group/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556027/Add%20Individuals%20to%20Group%20show%20contact%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/556027/Add%20Individuals%20to%20Group%20show%20contact%20info.meta.js
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

async function waitForElement(selector, pollingRateMs = 100, parent = document) {
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
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
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
  console.log('Fetching UID:', uid);
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
      const formalFullName = data.formalFullName

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("gt-week-info");
      infoDiv.innerHTML = `
        <ul style="margin:0; padding-left:16px; list-style-type:disc;">
          <li class="profile-list"><strong>Formal Full Name:</strong> ${formalFullName}</li>
          <li class="profile-list"><strong>Gender:</strong> ${gender}</li>
          <li class="profile-list"><strong>Grade:</strong> ${grade}</li>
          <li class="profile-list"><strong>DOB:</strong> ${dob}</li>
          <li class="profile-list"><strong>Age:</strong> ${age}</li>
          <li class="profile-list"><strong>Email:</strong> ${email}</li>
          <li class="profile-list"><strong>Phone:</strong> ${phone}</li>
        </ul>
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

    fetchAndDisplay(uid, entry);
  }
}

function onNewAutocompleteChildren(mutationList) {
  for (const mutation of mutationList) {
    patchEntries(mutation.addedNodes);
  }
}

// keep your delay, waitForElement, patchEntries, fetchAndDisplay, etc. as-is

(async function monitorAutocomplete() {
  while (true) {
    // wait for at least one <li> to appear
    const firstLi = await waitForElement("li.autoCompleteName");
    console.log("Found first li:", firstLi);

    // find the containing UL (prefer the ui-autocomplete class if present)
    const menu = firstLi.closest("ul.ui-autocomplete") || firstLi.parentElement;
    if (!menu) {
      console.warn("Couldn't find parent menu for autocomplete item. Restarting loop.");
      // small delay to avoid tight loop
      await delay(200);
      continue;
    }

    console.log("Autocomplete menu resolved:", menu);

    // Process all current <li> children
    patchEntries(menu.querySelectorAll("li.autoCompleteName.ui-menu-item"));

    // Observe the menu for added <li> children
    const liObserver = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        // mutation.addedNodes is a NodeList — convert & filter HTMLElements only
        const added = Array.from(mutation.addedNodes).filter(
          n => n.nodeType === 1 && n.matches && n.matches("li.autoCompleteName.ui-menu-item")
        );
        if (added.length) {
          console.log("New li items added:", added);
          patchEntries(added);
        }
      }
    });

    liObserver.observe(menu, { childList: true });

    // wait until this menu is removed/replaced
    while (document.contains(menu)) {
      await delay(200);
    }

    console.log("Menu removed/replaced. Re-attaching when next appears...");
    liObserver.disconnect();
  }
})();

})();
