// ==UserScript==
// @name         EasyRedmine: Style power ups
// @version      1.7
// @description  Replace icons + remove checkboxes/buttons + priority icons + Tracker->T
// @author       aurycl
// @include      https://easyredmine.*
// @grant        none
// @license      MIT
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1529244
// @downloadURL https://update.greasyfork.org/scripts/553288/EasyRedmine%3A%20Style%20power%20ups.user.js
// @updateURL https://update.greasyfork.org/scripts/553288/EasyRedmine%3A%20Style%20power%20ups.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TYPE_SELECTOR = 'span.multieditable.editable[data-name="issue[tracker_id]"]';
  const PRIORITY_SELECTOR = 'span.multieditable.editable[data-name="issue[priority_id]"]';

  // 1) Font Awesome CSS
  function appendWhenHeadReady(node) {
    const tryAppend = () => (document.head ? document.head.appendChild(node) : setTimeout(tryAppend, 25));
    tryAppend();
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css';
  appendWhenHeadReady(link);

  // 2) Globalūs stiliai
  const style = document.createElement('style');
  style.textContent = `
    html { font-size: 13px !important; }

    /* ICON COLORS */
    .tm-red-bug   { color: #c62828 !important; }   /* raudonas bug */
    .tm-blue-q    { color: #1565c0 !important; }   /* mėlynas klaustukas */
    .tm-blue-book { color: #1e88e5 !important; }   /* mėlyna knyga */
    .tm-green-svc { color: #2e7d32 !important; }   /* žalias wrench */
    .tm-gray-task { color: #616161 !important; }   /* pilkas task */

    /* PRIORITY COLORS */
    .tm-prio-low    { color: #2e7d32 !important; }
    .tm-prio-normal { color: #616161 !important; }
    .tm-prio-high   { color: #c62828 !important; }

    /* TRACKER and PRIORITY COLUMN WIDTH */
    th.tracker, td.tracker,
    th.priority, td.priority {

      width: 20px !important;
      min-width: 20px !important;
      max-width: 20px !important;
      text-align: center;
    }
  `;
  appendWhenHeadReady(style);

  // Tooltip helper
  function setTooltip(el, text) {
    if (!text) return;
    el.setAttribute('data-tm-original', text);
    el.setAttribute('title', text);
    el.setAttribute('aria-label', text);
  }

  // 3) Tipų ikonų keitimas
  function replaceTypes() {
    document.querySelectorAll(TYPE_SELECTOR).forEach(el => {
      if (el.getAttribute('data-tm-replaced') === '1') return;

      const text = (el.textContent || '').trim();
      if (!text) return;

      let iconClass = null;
      switch (text) {
        case 'Failure Notice':
          iconClass = 'fa-solid fa-bug tm-red-bug';
          break;
        case 'Consultations':
          iconClass = 'fa-solid fa-book-open tm-blue-book';
          break;
        case 'Service Request':
          iconClass = 'fa-solid fa-screwdriver-wrench tm-green-svc';
          break;
        case 'Info Request':
          iconClass = 'fa-solid fa-circle-question tm-blue-q';
          break;
        case 'Task':
          iconClass = 'fa-solid fa-list-check tm-gray-task';
          break;
      }

      if (iconClass) {
        setTooltip(el, text);
        el.innerHTML = `<i class="${iconClass}" aria-hidden="true" title="${text}"></i>`;
        el.setAttribute('data-tm-replaced', '1');
      }
    });
  }

  // 4) Prioritetų ikonų keitimas
  function replacePriorities() {
    document.querySelectorAll(PRIORITY_SELECTOR).forEach(el => {
      if (el.getAttribute('data-tm-prio-replaced') === '1') return;

      const text = (el.textContent || '').trim();
      if (!text) return;

      let iconClass = null;
      if (text === 'Low') iconClass = 'fa-solid fa-arrow-down tm-prio-low';
      if (text === 'Normal') iconClass = 'fa-solid fa-minus tm-prio-normal';
      if (text === 'High') iconClass = 'fa-solid fa-arrow-up tm-prio-high';

      if (iconClass) {
        setTooltip(el, text);
        el.innerHTML = `<i class="${iconClass}" aria-hidden="true" title="${text}"></i>`;
        el.setAttribute('data-tm-prio-replaced', '1');
      }
    });
  }

  // 5) „Tracker“/„Priority“ antraščių keitimas
  function replaceHeaders() {
    document.querySelectorAll('th.tracker, th.priority').forEach(th => {
      th.querySelectorAll('a').forEach(a => {
        const t = (a.textContent || '').trim();
        if (t === 'Tracker') a.textContent = 'T';
        if (t === 'Priority') a.textContent = 'Pr';
      });
      ['aria-label', 'title'].forEach(attr => {
        const val = th.getAttribute(attr);
        if (val) {
          if (val.includes('Tracker')) th.setAttribute(attr, val.replace(/Tracker/g, 'T'));
          if (val.includes('Priority')) th.setAttribute(attr, val.replace(/Priority/g, 'Pr'));
        }
      });
    });
  }

  // 6) Pašalinam nereikalingus elementus root URL
  function removeUnwanted() {
    if (window.location.hostname === 'easyredmine.nrdcompanies.com' && window.location.pathname === '/') {
      document.querySelectorAll('th.hide-when-print.checkbox').forEach(th => th.remove());
      document.querySelectorAll('td.easy-entity-list__item-checkbox').forEach(td => td.remove());
      document.querySelectorAll('td.easy-query-additional-beginning-buttons, th.easy-query-additional-beginning-buttons, th.additional-beginning-button, td.additional-beginning-button')
        .forEach(el => el.remove());
      document.querySelectorAll('table.table-resizer').forEach(tbl => tbl.classList.remove('table-resizer'));
    }
  }

  // 7) Polling (kad veiktų su AJAX)
  let tries = 0;
  const t = setInterval(() => {
    replaceTypes();
    replacePriorities();
    replaceHeaders();
    removeUnwanted();
    if (++tries >= 20) clearInterval(t);
  }, 500);

  // Paleidžiam iškart
  replaceTypes();
  replacePriorities();
  replaceHeaders();
  removeUnwanted();
})();