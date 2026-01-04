// ==UserScript==
// @name         JSON Form Autofill
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Autofill feedback form from JSON data
// @match        https://dialflownetworks.in/dialflow/user/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/550638/JSON%20Form%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/550638/JSON%20Form%20Autofill.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log("[Autofill] Script loaded. Waiting for trigger…");

  // -----------------------
  // Utility helpers
  // -----------------------
  function normalize(s) {
    if (s === null || s === undefined) return "";
    return String(s).toLowerCase().trim().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  }

  function dispatchValueEvents(el, type) {
    try {
      if (type === 'input') el.dispatchEvent(new Event("input", { bubbles: true }));
      if (type === 'change') el.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (e) {
      console.warn("[Autofill] failed to dispatch event:", e);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return dateStr;
    const parts = String(dateStr).split(/[\/\-]/).map(p => p.trim());
    if (parts.length === 3) {
      let [d, m, y] = parts;
      if (y.length === 2) y = '20' + y;
      d = d.padStart(2, '0');
      m = m.padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return dateStr;
  }

  function findElementByIdOrName(idOrName) {
    if (!idOrName) return null;
    let el = document.getElementById(idOrName);
    if (el) return el;
    el = document.querySelector(`[name="${idOrName}"]`);
    if (el) return el;
    return null;
  }

  function setSelect(el, rawVal, debugLabel) {
    if (!el || !rawVal) return false;
    const valNorm = normalize(rawVal);
    const opts = Array.from(el.options || []);

    // exact
    for (let o of opts) {
      if (normalize(o.value) === valNorm || normalize(o.text) === valNorm) {
        o.selected = true;
        dispatchValueEvents(el, 'change');
        console.log(`[Autofill] ${debugLabel} -> exact match: ${o.text}`);
        return true;
      }
    }
    // startsWith
    for (let o of opts) {
      if (normalize(o.text).startsWith(valNorm) || normalize(o.value).startsWith(valNorm)) {
        o.selected = true;
        dispatchValueEvents(el, 'change');
        console.log(`[Autofill] ${debugLabel} -> startsWith match: ${o.text}`);
        return true;
      }
    }
    // first char fallback
    if (valNorm.length === 1) {
      for (let o of opts) {
        if (normalize(o.text).charAt(0) === valNorm) {
          o.selected = true;
          dispatchValueEvents(el, 'change');
          console.log(`[Autofill] ${debugLabel} -> first-char match: ${o.text}`);
          return true;
        }
      }
    }
    console.warn(`[Autofill] No match for ${debugLabel} = "${rawVal}"`);
    return false;
  }

  // -----------------------
  // Main Autofill function
  // -----------------------
  function runAutofill() {
    console.log("[Autofill] Triggered.");
    let jsonInput = prompt("Paste JSON for one record:");
    if (!jsonInput) {
      console.log("[Autofill] No JSON provided.");
      return;
    }

    let data;
    try {
      data = JSON.parse(jsonInput);
      console.log("[Autofill] Parsed JSON:", data);
    } catch (e) {
      alert("Invalid JSON!");
      console.error("[Autofill] JSON parse error:", e);
      return;
    }

    const fieldMap = {
      "Lead ID": "leads_id",
      "Feedback type": "feedback_type",
      "Select Demat": "selected_demat",
      "Feedback Tone": "feedback_tone",
      "Urgency level": "urgency_level",
      "Customer Name": "full_name",
      "Contact number": "contact_number",
      "Gender": "gender",
      "Customer ID": "customer_id",
      "Email Address": "email",
      "Date of Account Opening": "account_opening_date",
      "City": "city",
      "State": "state",
      "Language": "preferred_language",
      "Open your D. A/c": "opened_via",
      "Adequate guidance proce": "guidance",
      "Documnt were requird": "documents_feedback",
      "contact cust. suppt": "contact_support",
      "if yes,how satisfied": "support_satisfaction",
      "Satisfied feature of platform": "features_satisfaction",
      "Improvement feature": "feature_improvements",
      "Technical issure during process": "issues",
      "Would you recommend our service to others ?": "recommendation",
      "Additinal feedback": "additional_feedback",
      "futhr classification": "consent_contact",
      "Preferred Contact": "contact_method",
      "Best Time": "contact_time",
      "Tele caller name": "telecaller_name",
    };

    const radioMap = {
      "Ease of the account opening": "ease_rating",
      "Time taken": "activation_time",
      "overall Rating with customer": "support_experience",
      "overall experience": "overall_rating",
    };

    // Fill normal fields
    for (let key in fieldMap) {
      if (!(key in data)) continue;
      let el = findElementByIdOrName(fieldMap[key]);
      if (!el) continue;

      let value = data[key];
      if (fieldMap[key] === "account_opening_date") {
        value = formatDate(value);
      }

      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.value = value;
        dispatchValueEvents(el, 'input');
        console.log(`[Autofill] Set ${key} -> ${value}`);
      } else if (el.tagName === "SELECT") {
        setSelect(el, value, key);
      }
    }

    // Fill radios
    for (let key in radioMap) {
      if (!(key in data)) continue;
      let groupName = radioMap[key];
      let val = String(data[key]).trim();
      let radios = document.querySelectorAll(`input[name="${groupName}"]`);
      radios.forEach(r => {
        if (r.value === val) {
          r.checked = true;
          dispatchValueEvents(r, 'change');
          console.log(`[Autofill] Radio ${groupName} -> ${val}`);
        }
      });
    }

    alert("Form filled! Check console logs (F12).");
  }

  // -----------------------
  // Floating Button
  // -----------------------
  function addFloatingButton() {
      const btn = document.createElement("button");
      btn.innerText = "Run Autofill";
      btn.style.position = "fixed";
      btn.style.top = "20px";
      btn.style.right = "20px";
      btn.style.zIndex = 9999;
      btn.style.padding = "5px 8px"; // smaller padding, just around text
      btn.style.background = "#007bff";
      btn.style.color = "#fff";
      btn.style.border = "none";
      btn.style.borderRadius = "6px";
      btn.style.cursor = "pointer";
      btn.style.width = "auto"; // ensure width adapts to content
      btn.style.whiteSpace = "nowrap"; // prevent text wrapping
      btn.onclick = runAutofill;
      document.body.appendChild(btn);
      console.log("[Autofill] Floating button added.");
  }


  // -----------------------
  // Hotkey
  // -----------------------
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "f") {
      runAutofill();
    }
  });

  // Add the floating button on page load
  window.addEventListener("load", addFloatingButton);

})();
