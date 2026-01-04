// ==UserScript==
// @name         Bar-I Quick Filters (Dashboard only, SPA-safe, no-flash, MULTI-SELECT, universal loader)
// @namespace    https://greasyfork.org/users/1516265
// @version      2.0.0
// @description  Dashboard quick filters: multi-select; invisibly opens modal each time, toggles target only, applies, and closes. Starts/stops on SPA route changes even if you didn't load on the dashboard first.
// @author       Nicolai Mihaic
// @match        https://app.bar-i.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bar-i.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549842/Bar-I%20Quick%20Filters%20%28Dashboard%20only%2C%20SPA-safe%2C%20no-flash%2C%20MULTI-SELECT%2C%20universal%20loader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549842/Bar-I%20Quick%20Filters%20%28Dashboard%20only%2C%20SPA-safe%2C%20no-flash%2C%20MULTI-SELECT%2C%20universal%20loader%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** =================
   * Route / selectors
   * ================= */
  const DASH_RE = /^https?:\/\/app\.bar-i\.com\/barI\/manager\/dashboard(\/|$)/i;
  const TABLE_SEL = 'table.table';
  const NOTIF_CONTAINER_SEL = '.top-toggel-btn';
  const FILTER_OPEN_BTN_SEL = '.icon-filter.filter-btn';

  // Modal controls
  const MODAL_ROOT_SEL   = 'app-filter-modal .modal';
  const MODAL_CHECK = {
    1: 'input[formcontrolname="notify_type_li"][value="1"]', // Step 1 Invoice
    2: 'input[formcontrolname="notify_type_li"][value="2"]', // Step 2 Count
    5: 'input[formcontrolname="notify_type_li"][value="5"]', // Step 2,3,4 Done
    6: 'input[formcontrolname="notify_type_li"][value="6"]', // Step 5 Variance
  };
  const MODAL_APPLY      = '.notify-flt-button-area button:last-child';
  const MODAL_RESET      = '.notify-flt-button-area button:first-child';
  const STEALTH_STYLE_ID = 'qf_stealth_css';

  /** =================
   * State
   * ================= */
  let qf_started = false;
  let qf_busy = false;
  let quickContainer = null;
  let tableAnchorObserver = null;
  let urlPoll = null;
  let domObs = null;
  let quickRefs = {};

  /** =================
   * Small helpers
   * ================= */
  function onDashboard() { return DASH_RE.test(location.href); }
  function waitFor(fn, timeout = 6000, interval = 60) {
    const t0 = performance.now();
    return new Promise((res, rej) => {
      (function tick() {
        try { if (fn()) return res(true); } catch {}
        if (performance.now() - t0 > timeout) return rej(new Error('Timeout'));
        setTimeout(tick, interval);
      })();
    });
  }
  function getNotifSpan() {
    return [...document.querySelectorAll(`${NOTIF_CONTAINER_SEL} span`)]
      .find(el => el.textContent.trim() === 'Notifications');
  }
  function isNotificationsOn() {
    const s = getNotifSpan();
    return !!(s && s.classList.contains('color-green'));
  }
  function ensureToolbarAboveTable() {
    if (!quickContainer) return;
    const table = document.querySelector(TABLE_SEL) || document.querySelector('table');
    if (!table || !table.parentNode) return;
    if (quickContainer.nextElementSibling !== table) {
      try { table.parentNode.insertBefore(quickContainer, table); } catch {}
    }
  }
  function isModalOpen() {
    const modal = document.querySelector(MODAL_ROOT_SEL);
    if (!modal) return false;
    const show = modal.classList.contains('show');
    const disp = getComputedStyle(modal).display;
    return show || disp === 'block';
  }

  // Stealth (no modal flash)
  function ensureStealthCss() {
    if (document.getElementById(STEALTH_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STEALTH_STYLE_ID;
    style.textContent = `
      .qf-stealth .modal, .qf-stealth .modal-backdrop { opacity: 0 !important; }
      .qf-stealth .modal-backdrop { pointer-events: none !important; }
      .qf-stealth .modal.fade .modal-dialog { transition: none !important; }
      body.qf-stealth.modal-open { overflow: auto !important; padding-right: 0 !important; }
    `;
    document.head.appendChild(style);
  }
  function enableStealth(){ ensureStealthCss(); document.body.classList.add('qf-stealth'); }
  function disableStealth(){ document.body.classList.remove('qf-stealth'); }

  async function openModalStealth() {
    const btn = document.querySelector(FILTER_OPEN_BTN_SEL);
    if (!btn) throw new Error('Filter button not found');
    enableStealth();
    await new Promise(r => requestAnimationFrame(r));
    btn.click();
    await waitFor(() => isModalOpen(), 4000);
    await new Promise(r => setTimeout(r, 50));
  }
  async function closeModalStealthIfOpen() {
    const modal = document.querySelector(MODAL_ROOT_SEL);
    if (!modal) { disableStealth(); return; }
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.click();
    await waitFor(() => !isModalOpen(), 1000).catch(()=>{});
    disableStealth();
  }

  function setChecked(el, desired) {
    if (!el) return false;
    const want = !!desired, cur = !!el.checked;
    if (cur === want) return false;
    el.click();
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function queryModalBits() {
    const bits = {
      apply: document.querySelector(MODAL_APPLY),
      reset: document.querySelector(MODAL_RESET),
      checks: {
        1: document.querySelector(MODAL_CHECK[1]),
        2: document.querySelector(MODAL_CHECK[2]),
        5: document.querySelector(MODAL_CHECK[5]),
        6: document.querySelector(MODAL_CHECK[6]),
      }
    };
    if (!bits.apply || !bits.reset || !bits.checks[1] || !bits.checks[2] || !bits.checks[5] || !bits.checks[6]) {
      throw new Error('Filter modal controls not found');
    }
    return bits;
  }
  function getCheckedMapFromModal(bits) {
    return {
      1: !!bits.checks[1].checked,
      2: !!bits.checks[2].checked,
      5: !!bits.checks[5].checked,
      6: !!bits.checks[6].checked,
    };
  }
  async function ensureApplyEnables(btnApply, changed) {
    if (!changed) return;
    const ok = await waitFor(() => !btnApply.disabled && getComputedStyle(btnApply).pointerEvents !== 'none', 800).catch(()=>false);
    if (ok) return;
    const c = document.querySelector(MODAL_CHECK[1]);
    if (c) {
      c.click(); c.dispatchEvent(new Event('input',{bubbles:true})); c.dispatchEvent(new Event('change',{bubbles:true}));
      await new Promise(r => setTimeout(r, 30));
      c.click(); c.dispatchEvent(new Event('input',{bubbles:true})); c.dispatchEvent(new Event('change',{bubbles:true}));
      await waitFor(() => !btnApply.disabled && getComputedStyle(btnApply).pointerEvents !== 'none', 1200).catch(()=>{});
    }
  }

  async function applyWithModal(targetValue, targetChecked) {
    if (!isModalOpen()) await openModalStealth();
    const bits = queryModalBits();
    const before = getCheckedMapFromModal(bits);
    const changed = setChecked(bits.checks[targetValue], targetChecked);
    if (!changed) {
      await closeModalStealthIfOpen();
      syncToolbar(before);
      return;
    }
    await ensureApplyEnables(bits.apply, changed);
    bits.apply.click();
    await waitFor(() => !isModalOpen(), 6000).catch(()=>{});
    disableStealth();
    const after = { ...before, [targetValue]: !!targetChecked };
    syncToolbar(after);
  }

  async function resetAllWithModal() {
    if (!isModalOpen()) await openModalStealth();
    const bits = queryModalBits();
    bits.reset.click();
    await ensureApplyEnables(bits.apply, true);
    bits.apply.click();
    await waitFor(() => !isModalOpen(), 6000).catch(()=>{});
    disableStealth();
    syncToolbar({1:false,2:false,5:false,6:false});
  }

  /** =================
   * Toolbar UI
   * ================= */
  function buildToolbar() {
    if (quickContainer) return;
    const table = document.querySelector(TABLE_SEL) || document.querySelector('table');
    if (!table || !table.parentNode) return;

    quickContainer = document.createElement('div');
    quickContainer.id = 'qf_toolbar';
    quickContainer.style.cssText = 'margin:10px 0;padding:6px;background:#ffffff;font-size:14px;border-radius:6px;';
    quickContainer.innerHTML = `
      <label style="cursor:pointer;font-weight:600;margin-right:15px;">
        <input type="checkbox" id="qf_cb_1"> Step 1 Invoice
      </label>
      <label style="cursor:pointer;font-weight:600;margin-right:15px;">
        <input type="checkbox" id="qf_cb_2"> Step 2 Count
      </label>
      <label style="cursor:pointer;font-weight:600;margin-right:15px;">
        <input type="checkbox" id="qf_cb_5"> Step 2,3,4 Done
      </label>
      <label style="cursor:pointer;font-weight:600;">
        <input type="checkbox" id="qf_cb_6"> Step 5 Variance
      </label>
    `;
    table.parentNode.insertBefore(quickContainer, table);

    quickRefs = {
      1: document.getElementById('qf_cb_1'),
      2: document.getElementById('qf_cb_2'),
      5: document.getElementById('qf_cb_5'),
      6: document.getElementById('qf_cb_6'),
    };

    for (const val of [1,2,5,6]) {
      quickRefs[val].addEventListener('change', async (e) => {
        if (qf_busy) return;
        qf_busy = true;
        try {
          const desired = !!e.target.checked;
          if (!desired) {
            const othersChecked = [1,2,5,6].some(v => v !== val && quickRefs[v].checked);
            if (!othersChecked) await resetAllWithModal();
            else await applyWithModal(val, false);
          } else {
            await applyWithModal(val, true);
          }
        } catch (err) {
          console.warn('[QuickFilter] Error:', err);
          try {
            await openModalStealth();
            const bits = queryModalBits();
            const map = getCheckedMapFromModal(bits);
            syncToolbar(map);
            await closeModalStealthIfOpen();
          } catch {}
        } finally {
          qf_busy = false;
        }
      });
    }

    // keep toolbar attached above table
    if (tableAnchorObserver) tableAnchorObserver.disconnect();
    const tbody = table.querySelector('tbody');
    if (tbody) {
      tableAnchorObserver = new MutationObserver(() => ensureToolbarAboveTable());
      tableAnchorObserver.observe(tbody, { childList: true, subtree: true });
    }
  }

  function removeToolbar() {
    if (tableAnchorObserver) { tableAnchorObserver.disconnect(); tableAnchorObserver = null; }
    if (quickContainer) { quickContainer.remove(); quickContainer = null; }
    quickRefs = {};
  }

  function syncToolbar(map) {
    if (!quickRefs[1]) return;
    for (const v of [1,2,5,6]) quickRefs[v].checked = !!map[v];
  }

  /** =================
   * Core start/stop
   * ================= */
  function evaluateAndRender() {
    if (!onDashboard()) { removeToolbar(); disableStealth(); return; }
    if (isNotificationsOn()) buildToolbar(); else removeToolbar();
  }

  function start() {
    if (qf_started) return;
    qf_started = true;

    // Observe DOM so we react when Notifications turns green or table appears
    domObs = new MutationObserver(() => {
      if (start._debounce) return;
      start._debounce = true;
      setTimeout(() => { start._debounce = false; evaluateAndRender(); }, 50);
    });
    domObs.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    evaluateAndRender();
  }

  function stop() {
    if (domObs) { domObs.disconnect(); domObs = null; }
    removeToolbar();
    qf_started = false;
    disableStealth();
  }

  // URL watcher: poll + native events (no history monkeypatch → no conflicts)
  function installUrlWatcher() {
    let last = location.href;
    function check() {
      const now = location.href;
      if (now !== last) {
        last = now;
        if (onDashboard()) start(); else stop();
      } else {
        // also call evaluate periodically while on dashboard to catch late DOM
        if (onDashboard()) evaluateAndRender();
      }
    }
    if (urlPoll) clearInterval(urlPoll);
    urlPoll = setInterval(check, 200);
    window.addEventListener('popstate', check);
    window.addEventListener('hashchange', check);
    // initial
    if (onDashboard()) start(); else stop();
  }

  // Boot ASAP
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installUrlWatcher, { once: true });
  } else {
    installUrlWatcher();
  }
})();