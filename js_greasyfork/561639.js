// ==UserScript==
// @name         Torn NPO Faction Money Sender
// @namespace    https://torn.com/
// @version      1.0.0
// @description  Queue-based $ sender with stepper PROCESS button (click to advance each step) + RESTART.
// @author       Canixe [3753120]
// @match        https://www.torn.com/profiles.php*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561639/Torn%20NPO%20Faction%20Money%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/561639/Torn%20NPO%20Faction%20Money%20Sender.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /********************************************************************
   * Storage
   ********************************************************************/
  const STORE_KEY = "tf_money_stepper_v1";
  const DEFAULTS = { amount: 1, message: "Turn off revives", queue: [], step: 0, activeXid: null };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return { ...DEFAULTS };
      const p = JSON.parse(raw);
      return {
        amount: Number.isFinite(p.amount) ? p.amount : 1,
        message: typeof p.message === "string" ? p.message : "",
        queue: Array.isArray(p.queue) ? p.queue : [],
        step: Number.isFinite(p.step) ? p.step : 0,
        activeXid: p.activeXid || null,
      };
    } catch {
      return { ...DEFAULTS };
    }
  }
  function saveState(st) { localStorage.setItem(STORE_KEY, JSON.stringify(st)); }
  function resetState()  { localStorage.removeItem(STORE_KEY); }

  /********************************************************************
   * Utils
   ********************************************************************/
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  async function waitFor(fn, tries = 40, ms = 100) {
    for (let i = 0; i < tries; i++) {
      const v = fn();
      if (v) return v;
      await delay(ms);
    }
    return null;
  }

  function waitForSelector(selector, timeoutMs = 2500) {
    return new Promise((resolve) => {
      const foundNow = document.querySelector(selector);
      if (foundNow) return resolve(foundNow);

      const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });

      obs.observe(document.documentElement, { childList: true, subtree: true });

      setTimeout(() => {
        obs.disconnect();
        resolve(null);
      }, timeoutMs);
    });
  }

  function waitForCondition(condFn, timeoutMs = 2500) {
    return new Promise((resolve) => {
      if (condFn()) return resolve(true);

      const obs = new MutationObserver(() => {
        if (condFn()) {
          obs.disconnect();
          resolve(true);
        }
      });

      obs.observe(document.documentElement, { childList: true, subtree: true });

      setTimeout(() => {
        obs.disconnect();
        resolve(condFn());
      }, timeoutMs);
    });
  }

  function clickEl(el) {
    if (!el) return false;
    try {
      el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerType: "mouse" }));
      el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "mouse" }));
      el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      el.click();
      return true;
    } catch {
      try { el.click(); return true; } catch { return false; }
    }
  }

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0;
  }

  function setInputValue(el, value) {
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter ? setter.call(el, value) : (el.value = value);
    el.dispatchEvent(new Event("input",  { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "Enter" }));
  }

  function extractUserID(s) {
    if (!s) return null;
    const str = String(s).trim();
    const m1 = str.match(/[?&]XID=(\d{6,9})/i);
    if (m1) return m1[1];
    const m2 = str.match(/(^|\D)(\d{6,9})(\D|$)/);
    if (m2) return m2[2];
    return null;
  }

  function currentProfileXID() {
    const params = new URLSearchParams(location.search);
    const xid = params.get("XID");
    return xid && /^\d{6,9}$/.test(xid) ? xid : null;
  }

  function openProfile(xid) {
    location.href = `https://www.torn.com/profiles.php?XID=${encodeURIComponent(xid)}`;
  }

  /********************************************************************
   * DOM finders
   ********************************************************************/
  function findSendCashButton() {
    const btn = document.querySelector('a.profile-button.profile-button-sendMoney.active, a.profile-button-sendMoney.active');
    return (btn && isVisible(btn)) ? btn : null;
  }

  function findMoneyVisibleInput() {
    const el = document.querySelector('input.input-money:not([type="hidden"])');
    return (el && isVisible(el)) ? el : null;
  }

  function findMoneyHiddenInput() {
    const el = document.querySelector('input.input-money[type="hidden"]');
    return el || null;
  }

  function findMessageInput() {
    const el = document.querySelector('input.send-cash-message-input');
    return el || null;
  }

  function findSendButton() {
    const el = document.querySelector("button.send-cash-btn");
    return (el && isVisible(el)) ? el : null;
  }

  function findConfirmYesButton() {
    const el = document.querySelector("button.confirm-action.confirm-action-yes");
    return (el && isVisible(el)) ? el : null;
  }

  function findOkayButton() {
    const el = document.querySelector("button.confirm-action.okay");
    return (el && isVisible(el)) ? el : null;
  }

  function confirmDialogPresent() {
    return !!document.querySelector(".profile-buttons-dialog button.confirm-action-yes");
  }
  function successDialogPresent() {
    return !!document.querySelector(".profile-buttons-dialog .text.bold.t-green, .profile-buttons-dialog .t-green");
  }

  /********************************************************************
   * UI
   ********************************************************************/
  function injectStyle() {
    if (document.getElementById("tf-money-stepper-style")) return;
    const style = document.createElement("style");
    style.id = "tf-money-stepper-style";
    style.textContent = `
      #tfMoneyStepper {
        position: fixed;
        top: 110px;
        right: 16px;
        width: 360px;
        z-index: 999999;
        background: #141414;
        border: 1px solid #333;
        border-radius: 14px;
        color: #fff;
        font-family: Arial, sans-serif;
        box-shadow: 0 10px 30px rgba(0,0,0,.4);
      }
      #tfMoneyStepper .hd {
        padding: 10px 12px;
        border-bottom: 1px solid #2a2a2a;
        display:flex;
        align-items:center;
        justify-content:space-between;
      }
      #tfMoneyStepper .title { font-size: 13px; font-weight: 800; }
      #tfMoneyStepper .pill {
        font-size: 11px;
        opacity: .85;
        border: 1px solid #2f2f2f;
        padding: 4px 8px;
        border-radius: 999px;
        background: #0f0f0f;
      }
      #tfMoneyStepper .bd { padding: 12px; }
      #tfMoneyStepper .grid2 {
        display:grid;
        grid-template-columns: 120px 1fr;
        gap: 10px;
        margin-bottom: 10px;
        align-items:end;
      }
      #tfMoneyStepper label {
        display:block;
        font-size: 11px;
        opacity:.9;
        margin: 0 0 6px;
      }
      #tfMoneyStepper input, #tfMoneyStepper textarea {
        width: 100%;
        box-sizing: border-box;
        background: #0b0b0b;
        border: 1px solid #303030;
        color: #fff;
        border-radius: 10px;
        padding: 9px 10px;
        font-size: 13px;
        outline: none;
      }
      #tfMoneyStepper textarea { min-height: 120px; resize: vertical; }
      #tfMoneyStepper .btnrow {
        display:flex;
        gap: 10px;
        margin-top: 12px;
      }
      #tfMoneyStepper button {
        flex: 1;
        border: none;
        border-radius: 12px;
        padding: 10px 12px;
        font-weight: 900;
        cursor: pointer;
      }
      #tfMSProcess { background: #ffeb3b; color: #000; }
      #tfMSRestart { background: #2a2a2a; color: #fff; border: 1px solid #3a3a3a; }
      #tfMoneyStepper .hint {
        margin-top: 10px;
        font-size: 11px;
        line-height: 1.35;
        opacity: .85;
      }
    `;
    document.head.appendChild(style);
  }

  function buildPanel() {
    if (document.getElementById("tfMoneyStepper")) return;

    injectStyle();
    const st = loadState();

    const panel = document.createElement("div");
    panel.id = "tfMoneyStepper";
    panel.innerHTML = `
      <div class="hd">
        <div class="title">$ Sender Stepper</div>
        <div class="pill" id="tfMSPill">Queue: 0</div>
      </div>

      <div class="bd">
        <div class="grid2">
          <div>
            <label>Amount</label>
            <input id="tfMSAmt" type="number" min="1" step="1" />
          </div>
          <div>
            <label>Message</label>
            <input id="tfMSMsg" type="text" maxlength="200" placeholder="Message (optional)" />
          </div>
        </div>

        <div>
          <label>Queue (IDs or profile URLs, one per line)</label>
          <textarea id="tfMSQueue" placeholder="3819016&#10;https://www.torn.com/profiles.php?XID=1234567"></textarea>
        </div>

        <div class="btnrow">
          <button id="tfMSProcess">PROCESS</button>
          <button id="tfMSRestart">RESTART</button>
        </div>

        <div class="hint" id="tfMSHint"></div>
      </div>
    `;
    document.body.appendChild(panel);

    const pill = panel.querySelector("#tfMSPill");
    const amtEl = panel.querySelector("#tfMSAmt");
    const msgEl = panel.querySelector("#tfMSMsg");
    const queueEl = panel.querySelector("#tfMSQueue");
    const hintEl = panel.querySelector("#tfMSHint");

    function redraw() {
      const s = loadState();
      pill.textContent = `Queue: ${s.queue.length}`;
      amtEl.value = String(s.amount || 1);
      msgEl.value = s.message || "";
      queueEl.value = (s.queue || []).join("\n");

      const xid = currentProfileXID();
      const next = s.queue[0] || "";
      const stepName = [
        "Load queue",
        "Go to profile",
        "Open send cash",
        "Fill form",
        "Click SEND",
        "Click YES",
        "Click OKAY",
        "Advance"
      ][s.step] || "…";

      hintEl.innerHTML =
        `Step: <b>${stepName}</b><br>` +
        (next ? `Next: <b>${next}</b>` : `Paste targets and press <b>PROCESS</b>.`) +
        (xid ? `<br>On profile: <b>${xid}</b>` : "");
    }

    // persist edits
    amtEl.addEventListener("input", () => {
      const s = loadState();
      const n = parseInt(amtEl.value, 10);
      s.amount = Number.isFinite(n) && n > 0 ? n : 1;
      saveState(s);
      redraw();
    });
    msgEl.addEventListener("input", () => {
      const s = loadState();
      s.message = msgEl.value || "";
      saveState(s);
      redraw();
    });

    // RESTART
    panel.querySelector("#tfMSRestart").addEventListener("click", () => {
      resetState();
      redraw();
    });

    /********************************************************************
     * STEPPER: one click = one step action
     ********************************************************************/
    panel.querySelector("#tfMSProcess").addEventListener("click", async () => {
      let s = loadState();

      // always sync from UI
      {
        const n = parseInt(amtEl.value, 10);
        s.amount = Number.isFinite(n) && n > 0 ? n : 1;
        s.message = msgEl.value || "";
      }

      const xid = currentProfileXID();

      // Step 0: Load queue from textarea if empty
      if (s.step === 0) {
        if (!s.queue.length) {
          const raw = queueEl.value.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
          s.queue = raw.map(extractUserID).filter(Boolean);
        }
        s.activeXid = s.queue[0] || null;
        s.step = s.queue.length ? 1 : 0;
        saveState(s);
        redraw();
        return;
      }

      // If queue emptied at any time, reset to step 0
      if (!s.queue.length) {
        s.step = 0;
        s.activeXid = null;
        saveState(s);
        redraw();
        return;
      }

      // Keep activeXid aligned with head
      s.activeXid = s.queue[0];

      // Step 1: Navigate to next profile (if not already there)
      if (s.step === 1) {
        if (!xid || xid !== s.activeXid) {
          saveState(s);
          openProfile(s.activeXid);
          return; // page leaving
        }
        s.step = 2;
        saveState(s);
        redraw();
        return;
      }

      // Safety: if we somehow are on the wrong profile, go back to step 1
      if (!xid || xid !== s.activeXid) {
        s.step = 1;
        saveState(s);
        redraw();
        return;
      }

      // Step 2: Click "Send cash" button (open dialog)
      if (s.step === 2) {
        // if dialog already open, skip to fill
        if (findMoneyVisibleInput()) {
          s.step = 3;
          saveState(s);
          redraw();
          return;
        }

        const btn = await waitFor(() => findSendCashButton(), 60, 100);
        if (btn) clickEl(btn);
        s.step = 3;
        saveState(s);
        redraw();
        return;
      }

      // Step 3: Fill form (amount + message)
      if (s.step === 3) {
        const visible = await waitFor(() => findMoneyVisibleInput(), 80, 100);
        const hidden = findMoneyHiddenInput();
        const msgInp = await waitFor(() => findMessageInput(), 80, 100);

        if (visible) setInputValue(visible, String(s.amount));
        if (hidden)  setInputValue(hidden,  String(s.amount));
        if (msgInp)  setInputValue(msgInp, (s.message || "").trim());

        s.step = 4;
        saveState(s);
        redraw();
        return;
      }

      // Step 4: Click SEND
      if (s.step === 4) {
        // If confirm already open, skip ahead
        if (confirmDialogPresent()) {
          s.step = 5;
          saveState(s);
          redraw();
          return;
        }

        const sendBtn = await waitFor(() => findSendButton(), 80, 60);
        if (sendBtn) clickEl(sendBtn);

        // React as soon as confirm appears
        const gotConfirm = await waitForCondition(confirmDialogPresent, 2500);
        s.step = gotConfirm ? 5 : 4;

        saveState(s);
        redraw();
        return;
      }

      // Step 5: Click YES (confirm)
      if (s.step === 5) {
        // If success already visible, skip ahead
        if (successDialogPresent()) {
          s.step = 6;
          saveState(s);
          redraw();
          return;
        }

        const yesBtn = await waitFor(() => findConfirmYesButton(), 80, 60);
        if (yesBtn) clickEl(yesBtn);

        // React as soon as success appears
        const gotSuccess = await waitForCondition(successDialogPresent, 2500);
        s.step = gotSuccess ? 6 : 5;

        saveState(s);
        redraw();
        return;
      }

      // Step 6: Click OKAY (success)
      if (s.step === 6) {
        const okBtn = await waitFor(() => findOkayButton(), 80, 100);
        if (okBtn) clickEl(okBtn);

        // After closing, advance
        s.step = 7;
        saveState(s);
        redraw();
        return;
      }

      // Step 7: Advance queue and go next
      if (s.step === 7) {
        // pop current
        if (s.queue[0] === xid) s.queue.shift();
        s.activeXid = s.queue[0] || null;
        s.step = s.queue.length ? 1 : 0;
        saveState(s);
        redraw();

        if (s.queue.length) {
          openProfile(s.queue[0]);
          return;
        }
        return;
      }
    });

    redraw();
  }

  // boot
  buildPanel();
})();
