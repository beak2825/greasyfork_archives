// ==UserScript==
// @name         Hide BlockUI Odoo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide BlockUI Odoo database expired
// @author       Camilo Reyes
// @match        https://www.tooeasyenglish.com/web*
// @icon         https://cdn-1.webcatalog.io/catalog/odoo/odoo-icon-filled-256.png?v=1714775315194
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550770/Hide%20BlockUI%20Odoo.user.js
// @updateURL https://update.greasyfork.org/scripts/550770/Hide%20BlockUI%20Odoo.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const OLD_CLASS = 'blockUI';
  const NEW_CLASS = 'miBlockUI';
  const ALERT_TEXT = 'Esta base de datos ha expirado.';

  // Inyectar CSS para asegurar ocultamiento
  const style = document.createElement('style');
  style.textContent = `
    .${NEW_CLASS} { display: none !important; }
    .alert.ocultado { display: none !important; }
  `;
  document.head.appendChild(style);

  // Procesar blockUI
  function processBlockUI(el) {
    if (!(el instanceof HTMLElement)) return;
    if (el.classList.contains(OLD_CLASS)) {
      if (el.classList.replace) {
        el.classList.replace(OLD_CLASS, NEW_CLASS);
      } else {
        el.classList.remove(OLD_CLASS);
        el.classList.add(NEW_CLASS);
      }
      el.style.setProperty('display', 'none', 'important');
    }
  }

  // Procesar alerts con texto específico
  function processAlert(el) {
    if (!(el instanceof HTMLElement)) return;
    if (el.classList.contains('alert')) {
      if (el.textContent.includes(ALERT_TEXT)) {
        el.classList.add('ocultado');
        el.style.setProperty('display', 'none', 'important');
      }
    }
  }

  // Procesar todos los existentes al inicio
  document.querySelectorAll('.' + OLD_CLASS).forEach(processBlockUI);
  document.querySelectorAll('.alert').forEach(processAlert);

  // Observer para nuevos elementos
  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        // Revisar blockUI
        if (node.matches?.('.' + OLD_CLASS)) processBlockUI(node);
        node.querySelectorAll?.('.' + OLD_CLASS).forEach(processBlockUI);

        // Revisar alert
        if (node.matches?.('.alert')) processAlert(node);
        node.querySelectorAll?.('.alert').forEach(processAlert);
      }
    }
  });

  mo.observe(document.documentElement, { childList: true, subtree: true });

  // Para debugging: detener el observer en consola
  window.stopHideBlockUI = () => mo.disconnect();
})();