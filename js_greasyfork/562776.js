// ==UserScript==
// @name         Auto-select "Great! Thanks for letting us know"
// @namespace    https://example.local/
// @version      1.0.0
// @description  Auto-select a specific jQuery UI dropdown/menu option by its text
// @match        http://cccsolutions.intra.bt.com/sms/reply.asp?uniqueID=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562776/Auto-select%20%22Great%21%20Thanks%20for%20letting%20us%20know%22.user.js
// @updateURL https://update.greasyfork.org/scripts/562776/Auto-select%20%22Great%21%20Thanks%20for%20letting%20us%20know%22.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ✅ Set this to the template you want
  const TEMPLATE_ID = "13741";

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function isUTXTReplyPage() {
    return document.title.includes("UTXT SMS PORTAL: Reply to customer")
      && document.querySelector('select#combobox[name="template"]')
      && document.getElementById("message")
      && document.getElementById("TemplateID");
  }

  function applyTemplateFromOptionValue(rawValue) {
    // rawValue format: "13741##<message text>"
    const idx = rawValue.indexOf("##");
    if (idx < 0) return false;

    const templateId = rawValue.slice(0, idx);
    const message = rawValue.slice(idx + 2);

    const messageEl = document.getElementById("message");
    const templateEl = document.getElementById("TemplateID");
    const sizeEl = document.querySelector('input[name="smssize"]');

    messageEl.value = message;
    templateEl.value = templateId;
    if (sizeEl) sizeEl.value = String(rawValue.length);

    // mimic site behaviour: focus message box
    messageEl.focus();

    return true;
  }

  function setVisibleComboboxText(optionText) {
    // Their widget creates an input next to the hidden select
    const input = document.querySelector('.custom-combobox-input');
    if (input) input.value = optionText.trim();
  }

  function selectOptionByTemplateId() {
    const select = document.getElementById("combobox");
    if (!select) return false;

    const wantedPrefix = `${TEMPLATE_ID}##`;
    const opt = [...select.options].find(o => (o.value || "").startsWith(wantedPrefix));
    if (!opt) return false;

    // Set the hidden select value for correctness
    select.value = opt.value;

    // Populate fields exactly like their autocompleteselect does
    const ok = applyTemplateFromOptionValue(opt.value);
    setVisibleComboboxText(opt.textContent || "");

    return ok;
  }

  async function main() {
    if (!isUTXTReplyPage()) return;

    // Run once per page load
    if (window.__utxtTemplateApplied) return;
    window.__utxtTemplateApplied = true;

    // Wait briefly for their jQuery UI widget to initialise (input might appear later)
    for (let i = 0; i < 30; i++) {
      if (document.getElementById("combobox")) break;
      await sleep(100);
    }

    const ok = selectOptionByTemplateId();
    if (!ok) {
      console.warn(`[UTXT] Could not find template ID ${TEMPLATE_ID} in #combobox options.`);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();