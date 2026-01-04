// ==UserScript==
// @name         GitHub Actions: Timestamps NZ Time AM/PM Toggle (Top-Center)
// @namespace    https://github.com/chaoscreater
// @version      4.0
// @description  Show GitHub Actions timestamps in NZ time (AM/PM) with seconds, top-center toggle, live updates, SPA friendly
// @author       chaoscreater
// @match        https://github.com/*/actions/runs/*/job/*
// @match        https://github.*.co.nz/*/*/actions/runs/*/job/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553415/GitHub%20Actions%3A%20Timestamps%20NZ%20Time%20AMPM%20Toggle%20%28Top-Center%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553415/GitHub%20Actions%3A%20Timestamps%20NZ%20Time%20AMPM%20Toggle%20%28Top-Center%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'gh_actions_auto_timestamps_enabled';

    // --- Helpers ---
    const isEnabled = () => localStorage.getItem(STORAGE_KEY) !== 'false'; // default: true
    const setEnabled = (v) => localStorage.setItem(STORAGE_KEY, v ? 'true' : 'false');

    // Check if current URL matches @match patterns
    const isValidPage = () => {
      const url = location.href;
      // Match: https://github.com/*/actions/runs/*/job/*
      // Match: https://github.*.co.nz/*/*/actions/runs/*/job/*
      const patterns = [
        /^https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/runs\/[^/]+\/job\/.+/,
        /^https:\/\/github\.[^/]+\.co\.nz\/[^/]+\/[^/]+\/actions\/runs\/[^/]+\/job\/.+/
      ];
      return patterns.some(pattern => pattern.test(url));
    };

    // --- UI: Add Toggle Button ---
    function addToggleButton() {
      if (document.getElementById('gh-ts-toggle')) return;
      if (!isValidPage()) return;

      const btn = document.createElement('button');
      btn.id = 'gh-ts-toggle';
      btn.textContent = isEnabled() ? '⏱️ Timestamps: ON' : '⏹️ Timestamps: OFF';
      btn.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        background: ${isEnabled() ? '#2ea043' : '#6e7681'};
        color: white;
        border: none;
        border-radius: 6px;
        padding: 4px 12px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        opacity: 0.9;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      `;
      btn.title = 'Toggle auto "Show timestamps"';
      btn.onclick = () => {
        const nowEnabled = !isEnabled();
        setEnabled(nowEnabled);
        btn.textContent = nowEnabled ? '⏱️ Timestamps: ON' : '⏹️ Timestamps: OFF';
        btn.style.background = nowEnabled ? '#2ea043' : '#6e7681';
        updateTimestampsLive(nowEnabled);
      };
      document.body.appendChild(btn);
    }

    // --- Convert GMT string to NZ time with AM/PM, preserve date ---
    function convertToNZTime(gmtString) {
      const date = new Date(gmtString);
      if (isNaN(date)) return gmtString;

      // Options for NZ time conversion
      const options = {
        timeZone: 'Pacific/Auckland',
        hour12: true,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      };

      const nzStr = date.toLocaleString('en-NZ', options);
      // Example: "Tue, 21 Oct 2025, 6:34:29 am"

      const match = nzStr.match(/^(\w{3}, \d{2} \w{3} \d{4}), (\d{1,2}):(\d{2}):(\d{2}) (\w{2})$/);
      if (!match) return gmtString;

      const [ , dayStr, hour, minute, second, ampm ] = match;

      return `${dayStr} ${hour}:${minute}${ampm.toLowerCase()} ${second}s NZDT`;
    }

    // --- Update all timestamp elements ---
    function updateAllTimestamps() {
      const tsElements = document.querySelectorAll('.CheckStep-line-timestamp');
      tsElements.forEach(el => {
        const raw = el.textContent.trim();
        const nz = convertToNZTime(raw);
        el.textContent = nz;
      });
    }

    // --- Enable/disable timestamps live ---
    function updateTimestampsLive(enable) {
      const inputs = Array.from(document.querySelectorAll('input.js-checks-log-timestamps'));
      if (!inputs.length) return;

      for (const inp of inputs) {
        try {
          const label = inp.closest('label');
          if (!label) continue;

          if (enable && !inp.checked) label.click();
          else if (!enable && inp.checked) label.click();
        } catch (err) {
          console.error('[gh-ts] failed updating timestamp live', err);
        }
      }

      if (enable) updateAllTimestamps();
    }

    // --- Watch for DOM changes ---
    const mo = new MutationObserver(() => {
      if (isValidPage() && isEnabled()) updateTimestampsLive(true);
    });

    function startObserving() {
      try {
        mo.observe(document.documentElement, { childList: true, subtree: true });
      } catch (e) { console.error('[gh-ts] MO start failed', e); }
    }

    // --- SPA navigation hook ---
    (function observeLocationChanges() {
      const _push = history.pushState;
      const _replace = history.replaceState;
      const emit = () => window.dispatchEvent(new Event('locationchange'));
      history.pushState = function () { _push.apply(this, arguments); emit(); };
      history.replaceState = function () { _replace.apply(this, arguments); emit(); };
      window.addEventListener('popstate', emit);
    })();

    let lastLocation = location.href;
    function onLocationChange() {
      if (location.href === lastLocation) return;
      lastLocation = location.href;

      // Remove button if navigating away from valid page
      const btn = document.getElementById('gh-ts-toggle');
      if (!isValidPage()) {
        if (btn) btn.remove();
        mo.disconnect();
        return;
      }

      // Re-initialize if navigating to valid page
      addToggleButton();
      startObserving();
      setTimeout(() => { if (isEnabled()) updateTimestampsLive(true); }, 800);
    }

    window.addEventListener('locationchange', onLocationChange);
    window.addEventListener('load', () => {
      if (!isValidPage()) return;
      addToggleButton();
      startObserving();
      setTimeout(() => { if (isEnabled()) updateTimestampsLive(true); }, 1000);
    });

  })();
