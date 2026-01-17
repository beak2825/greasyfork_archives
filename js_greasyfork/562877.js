// ==UserScript==
// @name         Mega Quick Sort Buttons (UI Engine Bound, 2026)
// @name:en      Mega Quick Sort Buttons (UI Engine Bound, 2026)
// @namespace    https://greasyfork.org/en/users/1561012-scriptnr
// @version      1.0.0
// @description  Adds quick Name and Size sort buttons next to Mega’s own sort control.
// @description:en Adds quick Name and Size sort buttons next to Mega’s own sort control.
// @author       ScriptNR
// @match        https://mega.nz/*
// @match        https://mega.io/*
// @icon         https://www.google.com/s2/favicons?domain=mega.nz
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/562877/Mega%20Quick%20Sort%20Buttons%20%28UI%20Engine%20Bound%2C%202026%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562877/Mega%20Quick%20Sort%20Buttons%20%28UI%20Engine%20Bound%2C%202026%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function getSortButton() {
    return document.querySelector('.sort-direction-button');
  }

  function getSortDropdownTrigger() {
    return [...document.querySelectorAll("button,div")]
      .find(e => e.textContent && e.textContent.match(/type|last modified|date added|name/i));
  }

  function findMenuItem(label) {
    return [...document.querySelectorAll("button,div,span")]
      .find(e => e.textContent && e.textContent.trim().toLowerCase() === label.toLowerCase());
  }

  async function sortBy(label) {
    const dropdown = getSortDropdownTrigger();
    if (!dropdown) { alert("Mega sort menu not found"); return; }

    dropdown.click();
    await sleep(120);

    const option = findMenuItem(label);
    if (!option) { alert("Sort option not found: " + label); return; }

    option.click();
    await sleep(60);

    const dir = getSortButton();
    if (dir) dir.click(); // forces Mega dispatcher refresh
  }

  function makeBtn(txt, fn) {
    const b = document.createElement("button");
    b.textContent = txt;
    b.style = "padding:8px 12px;margin-bottom:6px;border-radius:8px;border:none;background:#d32f2f;color:white;font-weight:600;cursor:pointer;width:100%";
    b.onclick = fn;
    return b;
  }

  function inject() {
    if (document.getElementById("megaQuickSortPanel")) return;
    if (!getSortButton()) return; // wait for real Mega UI

    const panel = document.createElement("div");
    panel.id = "megaQuickSortPanel";
    panel.style = `
      position:fixed;
      bottom:20px;
      right:20px;
      z-index:999999;
      background:rgba(20,20,20,0.9);
      padding:10px;
      border-radius:10px;
      min-width:120px;
      box-shadow:0 4px 14px rgba(0,0,0,.4);
      font-family:system-ui;
    `;

    const t = document.createElement("div");
    t.textContent = "MEGA SORT";
    t.style = "color:#fff;font-size:11px;text-align:center;margin-bottom:8px;opacity:.7";

    panel.appendChild(t);
    panel.appendChild(makeBtn("Name", () => sortBy("Name")));
    panel.appendChild(makeBtn("Size", () => sortBy("Size")));

    document.body.appendChild(panel);
  }

  new MutationObserver(inject).observe(document.body, { childList:true, subtree:true });
  inject();

})();

