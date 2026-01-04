// ==UserScript==
// @name         [Helperscript only] Carter-Cash plate autofill (FR + ES + IT)
// @namespace    https://greasyfork.org/users/976031
// @version      1.3
// @description  Automated vehicle data checking for Carter-Cash from URL parameter
// @match        https://www.carter-cash.com/pieces-auto/?plate=*
// @match        https://www.carter-cash.com/pieces-auto/*
// @match        https://www.carter-cash.es/piezas-auto/?plate=*
// @match        https://www.carter-cash.es/piezas-auto/*
// @match        https://www.carter-cash.it/ricambi-auto/?plate=*
// @match        https://www.carter-cash.it/ricambi-auto/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550240/%5BHelperscript%20only%5D%20Carter-Cash%20plate%20autofill%20%28FR%20%2B%20ES%20%2B%20IT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550240/%5BHelperscript%20only%5D%20Carter-Cash%20plate%20autofill%20%28FR%20%2B%20ES%20%2B%20IT%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- tiny utils ----------
  const qs = (sel, root = document) => root.querySelector(sel);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  }
  function getPlateFromUrl() {
    const url = new URL(location.href);
    const p = url.searchParams.get('plate');
    return p ? decodeURIComponent(p).trim() : null;
  }
  function waitForElement(selector, { root = document, timeout = 15000, visible = false } = {}) {
    return new Promise((resolve, reject) => {
      const finishIfFound = () => {
        const el = root.querySelector(selector);
        if (el && (!visible || isVisible(el))) {
          obs.disconnect();
          resolve(el);
          return true;
        }
        return false;
      };
      if (finishIfFound()) return;
      const obs = new MutationObserver(() => finishIfFound());
      obs.observe(root, { childList: true, subtree: true });
      setTimeout(() => {
        if (!finishIfFound()) {
          obs.disconnect();
          reject(new Error(`waitForElement timeout: ${selector}`));
        }
      }, timeout);
    });
  }
  async function requestSubmit(form) {
    if (typeof form.requestSubmit === 'function') return form.requestSubmit();
    const btn = form.querySelector('[type="submit"], button, #license_plate_send');
    if (btn) return btn.click();
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }
  async function fillAndSubmitAround(inputEl, plate) {
    let form = inputEl.closest('form');
    if (!form) return;
    inputEl.focus();
    inputEl.value = plate;
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(50);
    await requestSubmit(form);
  }

  // ---------- main flows ----------
  async function runWithPlate(plate) {
    const inlineInputSel = 'input#license_plate_licensePlate.form-control';
    const inlineInput = qs(inlineInputSel);
    if (inlineInput && isVisible(inlineInput)) {
      await fillAndSubmitAround(inlineInput, plate);
      return;
    }

    const changeBtnSel = '#change-car-btn';
    let changeBtn = qs(changeBtnSel) || await waitForElement(changeBtnSel, { timeout: 8000 }).catch(() => null);
    const modalInputSel = 'div.modal-content input#license_plate_licensePlate.form-control';

    for (let i = 0; i < 12; i++) {
      if (changeBtn) {
        changeBtn.scrollIntoView({ block: 'center' });
        changeBtn.click();
      } else {
        changeBtn = qs(changeBtnSel);
        if (changeBtn) changeBtn.click();
      }
      await sleep(500);
      const modalInput = qs(modalInputSel);
      if (modalInput && isVisible(modalInput)) {
        await fillAndSubmitAround(modalInput, plate);
        return;
      }
    }

    const anyInput = Array.from(document.querySelectorAll('#license_plate_licensePlate')).find(isVisible);
    if (anyInput) {
      await fillAndSubmitAround(anyInput, plate);
    }
  }

  async function runNoPlate() {
    const toggleSel = '.car-detail-toggle';
    let btn = qs(toggleSel) || await waitForElement(toggleSel, { timeout: 8000 }).catch(() => null);
    if (!btn) return;

    for (let i = 0; i < 15; i++) {
      btn = qs(toggleSel) || btn;
      const open = btn.getAttribute('data-open') === '1';
      if (open) break;
      btn.scrollIntoView({ block: 'center' });
      btn.click();
      await sleep(400);
    }
  }

  // ---------- boot ----------
  (async function main() {
    const plate = getPlateFromUrl();
    if (plate) {
      await runWithPlate(plate);
    } else {
      await runNoPlate();
    }
  })();
})();
