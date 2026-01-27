// ==UserScript==
// @name         WME Place Helper – URL & AU/DR Phone Formatter
// @namespace    https://waze.com/wme/place-helper
// @version      1.5.3
// @description  Removes http(s):// from Website field, formats phone numbers by selected country (AU/DR), and shows ℹ️ hint / ✅ valid status in WME Place editor. Includes persistent ON/OFF toggle and country selector embedded above Website.
// @author       PMaxDino
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/564120-wme-place-helper-url-au-phone-formatter
// @supportURL   https://greasyfork.org/en/scripts/564120-wme-place-helper-url-au-phone-formatter/feedback
// @icon         https://greasyfork.org/favicon.ico
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor/*
// @exclude      https://beta.waze.com/user/editor/*
// @run-at       document-end
// @require      https://update.greasyfork.org/scripts/24851/1558013/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564120/WME%20Place%20Helper%20%E2%80%93%20URL%20%20AUDR%20Phone%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/564120/WME%20Place%20Helper%20%E2%80%93%20URL%20%20AUDR%20Phone%20Formatter.meta.js
// ==/UserScript==

/*
 * MIT License
 *
 * Copyright (c) 2026 PMaxDino
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function () {
  "use strict";

  /* -------------------------
   * Config / persistence
   * ------------------------- */

  const DEBUG = false;
  const log = (...a) => DEBUG && console.log("[WME Place Helper]", ...a);

  const STORAGE_ENABLED = "wmePlaceHelper.enabled";
  const STORAGE_COUNTRY = "wmePlaceHelper.phoneCountry";

  const DEFAULT_ENABLED = true;
  const DEFAULT_COUNTRY = "AU";

  let ENABLED = loadBool(STORAGE_ENABLED, DEFAULT_ENABLED);
  let PHONE_COUNTRY = loadStr(STORAGE_COUNTRY, DEFAULT_COUNTRY);

  function loadBool(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      if (v === null) return fallback;
      return v === "true";
    } catch (_) {
      return fallback;
    }
  }

  function loadStr(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      if (!v) return fallback;
      return v;
    } catch (_) {
      return fallback;
    }
  }

  function saveBool(key, v) {
    try {
      localStorage.setItem(key, String(!!v));
    } catch (_) {}
  }

  function saveStr(key, v) {
    try {
      localStorage.setItem(key, String(v));
    } catch (_) {}
  }

  /* -------------------------
   * Website normaliser/validator
   * ------------------------- */

  function normaliseWebsite(v) {
    if (v == null) return v;
    return String(v).trim().replace(/^https?:\/\//i, "");
  }

  function isValidWebsite(value) {
    const v = String(value || "").trim();
    if (!v) return false;
    if (/^https?:\/\//i.test(v)) return false;
    if (/\s/.test(v)) return false;
    if (!v.includes(".")) return false;
    return true;
  }

  /* -------------------------
   * Phone formatters (pluggable)
   * ------------------------- */

  function digitsOnly(s) {
    return String(s || "").replace(/\D/g, "");
  }

  const PHONE_FORMATTERS = {
    AU: {
      label: "Australia (+61)",
      infoText: "Paste an AU phone number — we’ll format it to +61",
      okText: "Phone number formatted correctly (AU)",

      normalise(value) {
        if (value == null) return value;
        const original = String(value).trim();
        if (!original) return original;

        let d = digitsOnly(original);

        // If it already includes country code, drop it for processing.
        if (d.startsWith("61")) d = d.slice(2);

        // If it includes trunk prefix 0, drop it for mobiles/landlines.
        // (Service numbers generally won't start with 0)
        if (d.startsWith("0")) d = d.slice(1);

        // ---- Service numbers (force +61) ----
        // 13/14 numbers: 6 digits (e.g., 131234)
        if ((d.startsWith("13") || d.startsWith("14")) && d.length === 6) {
          return `+61 ${d.slice(0, 2)} ${d.slice(2)}`; // +61 13 1234
        }

        // 1300 / 1800 / 190x style: 10 digits
        if (/^(1300|1800|1900|1902|1903|1901)/.test(d) && d.length === 10) {
          return `+61 ${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`; // +61 1800 123 456
        }

        // Some providers use 19xx numbers; keep generic "19" + 10 digits as well.
        if (d.startsWith("19") && d.length === 10) {
          return `+61 ${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
        }

        // ---- Standard numbers (mobiles/landlines): 9 digits national after stripping ----
        if (d.length !== 9) return original;

        // Mobile: 4XX XXX XXX
        if (d.startsWith("4")) {
          return `+61 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
        }

        // Landline: X XXXX XXXX (X = 2,3,7,8)
        if (/^[2378]/.test(d)) {
          return `+61 ${d[0]} ${d.slice(1, 5)} ${d.slice(5)}`;
        }

        return original;
      },

      isValid(value) {
        const v = String(value || "").trim();
        if (!v) return false;

        // Must be explicitly +61 now (including service numbers)
        if (!v.startsWith("+61")) return false;

        const d = digitsOnly(v);
        if (!d.startsWith("61")) return false;

        const nat = d.slice(2); // national significant number

        // 13/14 numbers: 6 digits total national (e.g., 131234)
        if ((nat.startsWith("13") || nat.startsWith("14")) && nat.length === 6) return true;

        // 1300/1800/190x: 10 digits national
        if (
          (nat.startsWith("1300") || nat.startsWith("1800") || nat.startsWith("1900") || nat.startsWith("19")) &&
          nat.length === 10
        ) {
          return true;
        }

        // Mobiles/landlines: 9 digits national
        if (nat.length !== 9) return false;

        if (nat.startsWith("4")) return true; // mobile
        if (["2", "3", "7", "8"].includes(nat.slice(0, 1))) return true; // landline

        return false;
      },
    },

    DO: {
      label: "Dominican Rep. (+1)",
      infoText: "Paste a DR phone number — we’ll format it to +1",
      okText: "Phone number formatted correctly (DR)",

      normalise(value) {
        if (value == null) return value;
        const original = String(value).trim();
        if (!original) return original;

        let d = digitsOnly(original);

        // Accept: 10 digits (NANP national), 11 digits with leading 1 (country code)
        if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
        if (d.length !== 10) return original;

        const area = d.slice(0, 3);
        const exch = d.slice(3, 6);
        const line = d.slice(6);

        const DR_AREAS = ["809", "829", "849"];
        const TOLLFREE = ["800", "888", "877", "866", "855", "844", "833", "822"];

        // Only rewrite DR area codes or toll-free prefixes (NANP)
        if (![...DR_AREAS, ...TOLLFREE].includes(area)) return original;

        return `+1 ${area} ${exch} ${line}`;
      },

      isValid(value) {
        const v = String(value || "").trim();
        if (!v) return false;

        let d = digitsOnly(v);

        const DR_AREAS = ["809", "829", "849"];
        const TOLLFREE = ["800", "888", "877", "866", "855", "844", "833", "822"];

        // Allow 10-digit NANP national
        if (d.length === 10) {
          const area = d.slice(0, 3);
          const exchFirst = d.slice(3, 4);

          if (![...DR_AREAS, ...TOLLFREE].includes(area)) return false;
          if (exchFirst === "0" || exchFirst === "1") return false;

          return true;
        }

        // Allow 11-digit with leading country code 1
        if (d.length === 11 && d.startsWith("1")) {
          const area = d.slice(1, 4);
          const exchFirst = d.slice(4, 5);

          if (![...DR_AREAS, ...TOLLFREE].includes(area)) return false;
          if (exchFirst === "0" || exchFirst === "1") return false;

          return true;
        }

        return false;
      },
    },
  };

  function getPhoneFormatter() {
    return PHONE_FORMATTERS[PHONE_COUNTRY] || PHONE_FORMATTERS[DEFAULT_COUNTRY];
  }

  /* -------------------------
   * Inline UI (toggle + country selector) above Website
   * ------------------------- */

  const UI_ID = "wme-place-helper-inline-ui";

  function ensureInlineStyle() {
    if (document.getElementById("wme-place-helper-inline-style")) return;

    const style = document.createElement("style");
    style.id = "wme-place-helper-inline-style";
    style.textContent = `
      #${UI_ID} {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px;
        margin: 6px 0 10px 0;
        border-radius: 10px;
        background: rgba(0,0,0,0.04);
        border: 1px solid rgba(0,0,0,0.06);
        user-select: none;
      }

      #${UI_ID} .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      #${UI_ID} .title {
        font-size: 12px;
        font-weight: 700;
        color: #222;
        line-height: 1.2;
      }

      #${UI_ID} .subtitle {
        font-size: 11px;
        color: #555;
        line-height: 1.2;
      }

      #${UI_ID} .left {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      #${UI_ID} .right {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }

      #${UI_ID} .state {
        font-size: 12px;
        font-weight: 700;
        min-width: 32px;
        text-align: right;
        color: #333;
      }

      #${UI_ID} .switch {
        position: relative;
        display: inline-block;
        width: 42px;
        height: 22px;
      }
      #${UI_ID} .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      #${UI_ID} .slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #9e9e9e;
        transition: .2s;
        border-radius: 999px;
      }
      #${UI_ID} .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 2px;
        top: 2px;
        background-color: white;
        transition: .2s;
        border-radius: 50%;
        box-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }
      #${UI_ID} input:checked + .slider {
        background-color: #2e7d32;
      }
      #${UI_ID} input:checked + .slider:before {
        transform: translateX(20px);
      }

      #${UI_ID} label.country-label {
        font-size: 12px;
        font-weight: 600;
        color: #333;
        margin-right: 8px;
        white-space: nowrap;
      }

      #${UI_ID} select.country-select {
        font-size: 12px;
        padding: 5px 8px;
        border-radius: 8px;
        border: 1px solid rgba(0,0,0,0.18);
        background: #fff;
        color: #222;
        outline: none;
        max-width: 220px;
      }

      #${UI_ID} select.country-select:disabled {
        opacity: 0.6;
      }
    `;
    document.head.appendChild(style);
  }

  function injectInlineUIAboveWebsite() {
    ensureInlineStyle();

    const host = document.getElementById("venue-url");
    if (!host) return;

    const group = host.closest(".form-group");
    if (!group) return;

    if (group.querySelector(`#${UI_ID}`)) return;

    const container = document.createElement("div");
    container.id = UI_ID;

    container.innerHTML = `
      <div class="row">
        <div class="left">
          <div class="title">Place Helper</div>
          <div class="subtitle">Auto-fix Website and phone formatting</div>
        </div>
        <div class="right">
          <div class="state"></div>
          <label class="switch" title="Toggle helper on/off">
            <input type="checkbox" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="row">
        <div class="left" style="flex-direction:row; align-items:center; gap:8px;">
          <label class="country-label" for="wme-place-helper-country">Phone country:</label>
          <select class="country-select" id="wme-place-helper-country"></select>
        </div>
        <div class="right"></div>
      </div>
    `;

    group.insertBefore(container, group.firstChild);

    const checkbox = container.querySelector('input[type="checkbox"]');
    const stateEl = container.querySelector(".state");
    const select = container.querySelector("select.country-select");

    for (const key of Object.keys(PHONE_FORMATTERS)) {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = PHONE_FORMATTERS[key].label;
      select.appendChild(opt);
    }

    checkbox.checked = ENABLED;
    select.value = PHONE_COUNTRY in PHONE_FORMATTERS ? PHONE_COUNTRY : DEFAULT_COUNTRY;

    const renderState = () => {
      stateEl.textContent = ENABLED ? "ON" : "OFF";
      select.disabled = !ENABLED;
    };

    checkbox.addEventListener("change", () => {
      ENABLED = checkbox.checked;
      saveBool(STORAGE_ENABLED, ENABLED);
      renderState();
      doScan();
    });

    select.addEventListener("change", () => {
      PHONE_COUNTRY = select.value;
      saveStr(STORAGE_COUNTRY, PHONE_COUNTRY);
      doScan();
    });

    renderState();
  }

  /* -------------------------
   * Status UI
   * ------------------------- */

  function getOrCreateStatusLine(wzTextInputId, labelForId) {
    const host = document.getElementById(wzTextInputId);
    if (!host) return null;

    const group = host.closest(".form-group");
    if (!group) return null;

    const label =
      group.querySelector(`wz-label[html-for="${labelForId}"]`) ||
      group.querySelector("wz-label");
    if (!label) return null;

    let status = group.querySelector(`.wme-helper-status[data-for="${wzTextInputId}"]`);
    if (!status) {
      status = document.createElement("div");
      status.className = "wme-helper-status";
      status.dataset.for = wzTextInputId;
      status.style.fontSize = "12px";
      status.style.margin = "6px 0 6px 0";
      status.style.lineHeight = "1.2";
      status.style.userSelect = "none";
      label.insertAdjacentElement("afterend", status);
    }

    return status;
  }

  function setStatus(statusEl, state) {
    if (!statusEl) return;

    const nextText = (state.kind === "ok" ? `✅ ${state.text}` : `ℹ️ ${state.text}`);
    const nextColor = state.kind === "ok" ? "#2e7d32" : "#616161";

    if (statusEl.textContent !== nextText) statusEl.textContent = nextText;
    if (statusEl.style.color !== nextColor) statusEl.style.color = nextColor;
  }

  /* -------------------------
   * Field binding (with debounced normalisation-on-input)
   * ------------------------- */

  function bindField(wzId, getNormaliser, getValidator, getOkText, getInfoText, labelForId) {
    const host = document.getElementById(wzId);
    if (!host || !host.shadowRoot) return;

    const input = host.shadowRoot.querySelector("input");
    if (!input) return;

    const statusEl = getOrCreateStatusLine(wzId, labelForId);

    const updateStatus = () => {
      if (!ENABLED) {
        setStatus(statusEl, { kind: "info", text: "Helper is OFF (toggle above Website to enable)" });
        return;
      }

      const val = input.value;
      const validator = getValidator();

      if (!String(val || "").trim()) {
        setStatus(statusEl, { kind: "info", text: getInfoText() });
      } else if (validator(val)) {
        setStatus(statusEl, { kind: "ok", text: getOkText() });
      } else {
        setStatus(statusEl, { kind: "info", text: getInfoText() });
      }
    };

    const applyNormalisation = () => {
      if (!ENABLED) {
        updateStatus();
        return;
      }

      const normaliser = getNormaliser();

      const before = input.value;
      const after = normaliser(before);

      if (after !== before) {
        input.value = after;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        log(`Updated ${wzId}:`, before, "->", after);
      }

      updateStatus();
    };

    updateStatus();

    if (input.dataset.wmeHelperBound) return;
    input.dataset.wmeHelperBound = "true";

    let t = null;
    const scheduleNormaliseFromInput = () => {
      if (!ENABLED) return;
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        t = null;

        const v = String(input.value || "");
        const d = digitsOnly(v);

        if (wzId === "venue-phone") {
          // If user is typing, don't fight them; if paste/mostly complete, normalise.
          if (d.length >= 8) applyNormalisation();
          else updateStatus();
        } else {
          if (/^https?:\/\//i.test(v.trim())) applyNormalisation();
          else updateStatus();
        }
      }, 180);
    };

    input.addEventListener("paste", () => setTimeout(applyNormalisation, 20));
    input.addEventListener("blur", applyNormalisation);
    input.addEventListener("input", () => {
      updateStatus();
      scheduleNormaliseFromInput();
    });
    input.addEventListener("change", applyNormalisation);
  }

  /* -------------------------
   * Scan (debounced)
   * ------------------------- */

  let scanScheduled = false;
  let scanning = false;

  function doScan() {
    if (scanning) return;
    scanning = true;

    try {
      injectInlineUIAboveWebsite();

      bindField(
        "venue-url",
        () => normaliseWebsite,
        () => isValidWebsite,
        () => "URL stripped of protocol (http:// or https://)",
        () => "Paste a website — protocol will be removed automatically",
        "venue-url"
      );

      bindField(
        "venue-phone",
        () => getPhoneFormatter().normalise,
        () => getPhoneFormatter().isValid,
        () => getPhoneFormatter().okText,
        () => getPhoneFormatter().infoText,
        "venue-phone"
      );
    } finally {
      scanning = false;
    }
  }

  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;
    setTimeout(() => {
      scanScheduled = false;
      doScan();
    }, 50);
  }

  /* -------------------------
   * Fallback observer
   * ------------------------- */

  let observer;

  function startFallbackObserver() {
    if (observer) return;

    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList" && (m.addedNodes?.length || m.removedNodes?.length)) {
          scheduleScan();
          return;
        }
      }
    });

    try {
      observer.observe(document.body, { childList: true, subtree: true });
    } catch (_) {}
  }

  /* -------------------------
   * WazeWrap triggers
   * ------------------------- */

  function registerWazeWrapTriggers() {
    if (!WazeWrap?.Events?.register) return;

    const handler = () => scheduleScan();

    WazeWrap.Events.register("selectionchanged", null, handler);
    WazeWrap.Events.register("afteraction", null, handler);
    WazeWrap.Events.register("afterundoaction", null, handler);
    WazeWrap.Events.register("afterclearactions", null, handler);
  }

  /* -------------------------
   * Boot / readiness
   * ------------------------- */

  function wmeModelReady() {
    if (WazeWrap?.Util?.modelReady) {
      try {
        return !!WazeWrap.Util.modelReady();
      } catch (_) {}
    }
    return typeof W !== "undefined" && W && W.map && W.model;
  }

  function waitForReadyAndBoot() {
    const start = Date.now();
    const timer = setInterval(() => {
      const wwPresent = typeof WazeWrap !== "undefined" && WazeWrap;
      if (wwPresent && wmeModelReady()) {
        clearInterval(timer);
        boot();
        return;
      }

      if (Date.now() - start > 30000) {
        clearInterval(timer);
        console.error("[WME Place Helper] Timed out waiting for WME/WazeWrap readiness.");
      }
    }, 250);
  }

  function boot() {
    if (!(PHONE_COUNTRY in PHONE_FORMATTERS)) {
      PHONE_COUNTRY = DEFAULT_COUNTRY;
      saveStr(STORAGE_COUNTRY, PHONE_COUNTRY);
    }

    registerWazeWrapTriggers();
    startFallbackObserver();
    doScan();

    log("Loaded. Enabled =", ENABLED, "Country =", PHONE_COUNTRY);
  }

  waitForReadyAndBoot();
})();
