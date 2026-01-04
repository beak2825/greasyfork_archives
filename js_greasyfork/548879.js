// ==UserScript==
// @name         Torn Medication Reminder
// @namespace    https://torn.com/
// @version      1.0.1
// @description  Medication reminder with snooze options of 10 mins, 12 hours, 24 hours. Press SHIFT + * (Numpad Multiply) to open the UI at any time
// @author       you
// @match        https://www.torn.com/*
// @run-at       document-idle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/548879/Torn%20Medication%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/548879/Torn%20Medication%20Reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'torn_med_nextAt';

    const now = () => Date.now();

    async function getNextAt() {
        const v = await GM.getValue(STORAGE_KEY, 0);
        return Number(v) || 0;
    }

    async function setNextAt(ts) {
        await GM.setValue(STORAGE_KEY, Number(ts));
    }

    function addMs(hours = 0, minutes = 0) {
        return now() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
    }

    // ---- Styles ----
    const css = `
  .tmr-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 12, 16, 0.78);
    backdrop-filter: saturate(160%) blur(4px);
    z-index: 2147483647;
    display: none;
    align-items: center;
    justify-content: center;
  }
  .tmr-overlay[aria-hidden="false"] { display: flex; }

  .tmr-modal {
    max-width: 520px;
    width: calc(100% - 32px);
    background: #0f1115;
    color: #e7edf3;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06);
    padding: 20px;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  }
  .tmr-title { font-size: 20px; font-weight: 700; margin: 0 0 12px 0; }
  .tmr-sub { font-size: 13px; color: #c6d2df; margin: 0 0 16px 0; }
  .tmr-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 12px; }
  .tmr-btn {
    border: 1px solid rgba(255,255,255,0.12);
    background: #1a1f29;
    color: #e7edf3;
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .tmr-btn:hover { background: #202634; border-color: rgba(255,255,255,0.18); }
  .tmr-custom { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-top: 6px; }
  .tmr-input {
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.18);
    background: #131720;
    color: #e7edf3;
    font-size: 14px;
    padding: 10px 12px;
  }
  .tmr-input[type=number]::-webkit-inner-spin-button,
  .tmr-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  .tmr-input[type=number] { -moz-appearance: textfield; }
  .tmr-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px; font-size: 12px; }
  .tmr-link { color: #9ac2ff; text-decoration: underline; cursor: pointer; }
  `;
    GM.addStyle(css);

    // ---- Overlay ----
    function buildOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'tmr-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
      <div class="tmr-modal">
        <h2 class="tmr-title">Medication reminder</h2>
        <p class="tmr-sub">Choose how long to snooze the reminder.</p>

        <div class="tmr-row">
          <button class="tmr-btn" data-minutes="10">10 minutes</button>
          <button class="tmr-btn" data-hours="12">12 hours</button>
          <button class="tmr-btn" data-hours="24">24 hours</button>
        </div>

        <div class="tmr-custom">
          <input class="tmr-input" id="tmr-custom-hours" type="number" min="1" step="1" placeholder="Custom (hours)">
          <button class="tmr-btn" id="tmr-custom-btn">Set</button>
        </div>

        <div class="tmr-footer">
          <span class="tmr-link" id="tmr-dismiss-nochange">Dismiss without changing</span>
        </div>
      </div>
    `;
        document.body.appendChild(overlay);

        overlay.addEventListener('click', async (e) => {
            const t = e.target;
            if (!(t instanceof HTMLElement)) return;

            const min = t.getAttribute('data-minutes');
            const hrs = t.getAttribute('data-hours');
            if (min || hrs) {
                const next = min ? addMs(0, Number(min)) : addMs(Number(hrs), 0);
                await setNextAt(next);
                hideOverlay(overlay);
            }

            if (t.id === 'tmr-custom-btn') {
                const val = Number(document.querySelector('#tmr-custom-hours').value);
                if (val > 0) {
                    await setNextAt(addMs(val, 0));
                    hideOverlay(overlay);
                }
            }

            if (t.id === 'tmr-dismiss-nochange') {
                hideOverlay(overlay);
            }
        });

        return overlay;
    }

    function showOverlay(overlay) {
        overlay.setAttribute('aria-hidden', 'false');
    }

    function hideOverlay(overlay) {
        overlay.setAttribute('aria-hidden', 'true');
    }

    // ---- Init ----
    (async function init() {
        const overlay = buildOverlay();
        const nextAt = await getNextAt();

        if (!nextAt || now() >= nextAt) {
            showOverlay(overlay);
        }

        // optional manual trigger with Shift+M
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.code === 'NumpadMultiply') {
                showOverlay(overlay);
            }
        });
    })();
})();
