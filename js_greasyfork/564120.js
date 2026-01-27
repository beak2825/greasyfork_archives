// ==UserScript==
// @name         WME Place Helper – URL & AU Phone Formatter
// @namespace    https://waze.com/wme/place-helper
// @version      1.4.2
// @description  Removes http(s):// from Website field, formats AU phone numbers, and shows ℹ️ hint / ✅ valid status in WME Place editor. Includes persistent ON/OFF toggle embedded above Website.
// @author       PMaxDino
// @license      MIT
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor/*
// @exclude      https://beta.waze.com/user/editor/*
// @run-at       document-end
// @require      https://update.greasyfork.org/scripts/24851/1558013/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564120/WME%20Place%20Helper%20%E2%80%93%20URL%20%20AU%20Phone%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/564120/WME%20Place%20Helper%20%E2%80%93%20URL%20%20AU%20Phone%20Formatter.meta.js
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
   * Config
   * ------------------------- */

  const DEBUG = false;
  const log = (...a) => DEBUG && console.log("[WME Place Helper]", ...a);

  const STORAGE_KEY = "wmePlaceHelper.enabled";
  const DEFAULT_ENABLED = true;

  let ENABLED = loadEnabled();

  function loadEnabled() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === null) return DEFAULT_ENABLED;
      return v === "true";
    } catch (_) {
      return DEFAULT_ENABLED;
    }
  }

  function saveEnabled(v) {
    try {
      localStorage.setItem(STORAGE_KEY, String(!!v));
    } catch (_) {}
  }

  /* -------------------------
   * Normalisers
   * ------------------------- */

  function normaliseWebsite(v) {
    if (v == null) return v;
    return String(v).trim().replace(/^https?:\/\//i, "");
  }

  function normaliseAUPhone(v) {
    if (v == null) return v;
    const original = String(v).trim();
    if (!original) return original;

    let digits = original.replace(/\D/g, "");

    // Preserve service numbers as-is
    if (
      (digits.startsWith("13") && digits.length === 6) ||
      ((digits.startsWith("1300") || digits.startsWith("1800")) && digits.length === 10)
    ) {
      return original;
    }

    // Remove country code or trunk prefix
    if (digits.startsWith("61")) {
      digits = digits.slice(2);
      if (digits.startsWith("0")) digits = digits.slice(1);
    } else if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }

    if (digits.length !== 9) return original;

    // Mobile: 4XX XXX XXX
    if (digits.startsWith("4")) {
      return `+61 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }

    // Landline: X XXXX XXXX (X = 2,3,7,8)
    if (/^[2378]/.test(digits)) {
      return `+61 ${digits[0]} ${digits.slice(1, 5)} ${digits.slice(5)}`;
    }

    return original;
  }

  /* -------------------------
   * Validation (for ✅)
   * ------------------------- */

  function isValidWebsite(value) {
    const v = String(value || "").trim();
    if (!v) return false;
    if (/^https?:\/\//i.test(v)) return false;
    if (/\s/.test(v)) return false;
    if (!v.includes(".")) return false;
    return true;
  }

  function isValidAUPhone(value) {
    const v = String(value || "").trim();
    if (!v) return false;

    const digits = v.replace(/\D/g, "");

    if (
      (digits.startsWith("13") && digits.length === 6) ||
      ((digits.startsWith("1300") || digits.startsWith("1800")) && digits.length === 10)
    ) {
      return true;
    }

    if (!v.startsWith("+61")) return false;
    if (digits.length !== 11) return false; // 61 + 9 digits

    const firstNational = digits.slice(2, 3);
    if (firstNational === "4") return true;
    if (["2", "3", "7", "8"].includes(firstNational)) return true;

    return false;
  }

  /* -------------------------
   * Inline Toggle UI (embedded above Website)
   * ------------------------- */

  const TOGGLE_ID = "wme-place-helper-inline-toggle";

  function ensureInlineToggleStyle() {
    if (document.getElementById("wme-place-helper-inline-style")) return;

    const style = document.createElement("style");
    style.id = "wme-place-helper-inline-style";
    style.textContent = `
      #${TOGGLE_ID} {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 8px 10px;
        margin: 6px 0 10px 0;
        border-radius: 10px;
        background: rgba(0,0,0,0.04);
        border: 1px solid rgba(0,0,0,0.06);
        user-select: none;
      }
      #${TOGGLE_ID} .left {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      #${TOGGLE_ID} .title {
        font-size: 12px;
        font-weight: 700;
        color: #222;
        line-height: 1.2;
      }
      #${TOGGLE_ID} .subtitle {
        font-size: 11px;
        color: #555;
        line-height: 1.2;
      }

      #${TOGGLE_ID} .right {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
      }
      #${TOGGLE_ID} .state {
        font-size: 12px;
        font-weight: 700;
        min-width: 32px;
        text-align: right;
        color: #333;
      }

      #${TOGGLE_ID} .switch {
        position: relative;
        display: inline-block;
        width: 42px;
        height: 22px;
      }
      #${TOGGLE_ID} .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      #${TOGGLE_ID} .slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #9e9e9e;
        transition: .2s;
        border-radius: 999px;
      }
      #${TOGGLE_ID} .slider:before {
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
      #${TOGGLE_ID} input:checked + .slider {
        background-color: #2e7d32;
      }
      #${TOGGLE_ID} input:checked + .slider:before {
        transform: translateX(20px);
      }
    `;
    document.head.appendChild(style);
  }

  function injectInlineToggleAboveWebsite() {
    ensureInlineToggleStyle();

    // Find Website field host
    const host = document.getElementById("venue-url");
    if (!host) return;

    const group = host.closest(".form-group");
    if (!group) return;

    // Avoid duplicates (panel re-render safe)
    if (group.querySelector(`#${TOGGLE_ID}`)) return;

    const container = document.createElement("div");
    container.id = TOGGLE_ID;

    container.innerHTML = `
      <div class="left">
        <div class="title">Place Helper</div>
        <div class="subtitle">Auto-fix Website and AU phone formatting</div>
      </div>
      <div class="right">
        <div class="state"></div>
        <label class="switch" title="Toggle URL/Phone helper on/off">
          <input type="checkbox" />
          <span class="slider"></span>
        </label>
      </div>
    `;

    // Insert at top of the website field group (above label + input)
    group.insertBefore(container, group.firstChild);

    const checkbox = container.querySelector("input");
    const stateEl = container.querySelector(".state");

    checkbox.checked = ENABLED;

    const renderState = () => {
      stateEl.textContent = ENABLED ? "ON" : "OFF";
    };

    checkbox.addEventListener("change", () => {
      ENABLED = checkbox.checked;
      saveEnabled(ENABLED);
      renderState();
      // Re-scan immediately so status lines reflect OFF/ON without waiting.
      doScan();
    });

    renderState();
  }

  /* -------------------------
   * Status UI (light DOM)
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
    const nextColor = (state.kind === "ok" ? "#2e7d32" : "#616161");

    if (statusEl.textContent !== nextText) statusEl.textContent = nextText;
    if (statusEl.style.color !== nextColor) statusEl.style.color = nextColor;
  }

  /* -------------------------
   * Field binding
   * ------------------------- */

  function bindField(wzId, normaliser, validator, okText, infoText, labelForId) {
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
      if (!String(val || "").trim()) {
        setStatus(statusEl, { kind: "info", text: infoText });
      } else if (validator(val)) {
        setStatus(statusEl, { kind: "ok", text: okText });
      } else {
        setStatus(statusEl, { kind: "info", text: infoText });
      }
    };

    updateStatus();

    if (input.dataset.wmeHelperBound) return;
    input.dataset.wmeHelperBound = "true";

    const applyNormalisation = () => {
      if (!ENABLED) {
        updateStatus();
        return;
      }

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

    input.addEventListener("paste", () => setTimeout(applyNormalisation, 20));
    input.addEventListener("blur", applyNormalisation);
    input.addEventListener("input", updateStatus);
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
      // Ensure toggle is present when Website field exists (panel open)
      injectInlineToggleAboveWebsite();

      // Website
      bindField(
        "venue-url",
        normaliseWebsite,
        isValidWebsite,
        "URL stripped of protocol (http:// or https://)",
        "Paste a website — protocol will be removed automatically",
        "venue-url"
      );

      // Phone
      bindField(
        "venue-phone",
        normaliseAUPhone,
        isValidAUPhone,
        "Phone number formatted correctly",
        "Paste an AU phone number — we’ll format it to +61",
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
   * Fallback observer (cheap)
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
   * WazeWrap events (primary trigger)
   * ------------------------- */

  function registerWazeWrapTriggers() {
    if (!WazeWrap?.Events?.register) return;

    const handler = () => scheduleScan();

    WazeWrap.Events.register("selectionchanged", null, handler);
    WazeWrap.Events.register("afteraction", null, handler);
    WazeWrap.Events.register("afterundoaction", null, handler);
    WazeWrap.Events.register("afterclearactions", null, handler);

    log("WazeWrap event triggers registered.");
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
    registerWazeWrapTriggers();
    startFallbackObserver();
    doScan();
    log("Loaded. Enabled =", ENABLED);
  }

  waitForReadyAndBoot();
})();
