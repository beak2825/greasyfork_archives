// ==UserScript==
// @name         FV - Doctor Clinics Improved
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.1
// @description  Adds a one-click submit to the discharge confirmation. Picks the correct lowest % medicine by the default.
// @author       necroam
// @match        https://www.furvilla.com/career/clinic/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556097/FV%20-%20Doctor%20Clinics%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/556097/FV%20-%20Doctor%20Clinics%20Improved.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // Auto-selects lowest potency medicine
  function extractPotency(name) {
    const match = name.match(/\((\d+)%\)/);
    return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
  }

  function getLowestMedicineInModal() {
    const inventory = document.querySelector('.modal-open .inventory');
    if (!inventory) return null;

    const items = inventory.querySelectorAll('.inventory-item.inventory-block-item');
    let lowestItem = null;
    let lowestPotency = Number.MAX_SAFE_INTEGER;

    items.forEach(item => {
      const name = item.getAttribute('data-name');
      const potency = extractPotency(name);
      if (potency < lowestPotency) {
        lowestPotency = potency;
        lowestItem = item;
      }
    });

    return lowestItem;
  }

  function tryAutoClickMedicine() {
    const lowest = getLowestMedicineInModal();
    if (lowest) {
      const clickTarget = lowest.querySelector('a[data-id]');
      if (clickTarget) {
        clickTarget.click();
      }
    }
  }

  const medicineObserver = new MutationObserver(() => {
    const modalOpen = document.querySelector('.modal-open');
    if (modalOpen) {
      setTimeout(tryAutoClickMedicine, 500);
    }
  });

  medicineObserver.observe(document.body, { childList: true, subtree: true });

  // Resize villager images inside patient-sick-box
  const style = document.createElement('style');
  style.textContent = `
    .patient-sick-box img[src*="/img/villagers/"] {
      width: 80px !important;
      height: auto !important;
    }
  `;
  document.documentElement.appendChild(style);

  // Auto discharge modal
  let dischargeTriggered = false;

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a.btn-danger[data-url*="/career/clinic/discharge/"][data-modal="1"]');
    if (link) {
      dischargeTriggered = true;
    }
  }, true);

  const trySubmit = (modal) => {
    const button = modal.querySelector('button.btn-danger[type="submit"]');
    const form = button ? button.closest('form') : modal.querySelector('form');

    if (form) {
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit(button || null);
      } else {
        if (button) {
          button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        } else {
          form.submit();
        }
      }
      dischargeTriggered = false;
      return true;
    }

    if (button) {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      dischargeTriggered = false;
      return true;
    }

    return false;
  };

  const dischargeObserver = new MutationObserver(() => {
    if (!dischargeTriggered) return;

    const candidates = [
      document.getElementById('modal'),
      document.querySelector('.modal.in, .modal.show, .bootbox, .modal')
    ].filter(Boolean);

    for (const modal of candidates) {
      if (!modal) continue;
      setTimeout(() => { trySubmit(modal); }, 150);
    }
  });

  const startDischargeObserver = () => {
    const target = document.body || document.documentElement;
    if (target) {
      dischargeObserver.observe(target, { childList: true, subtree: true });
    } else {
      requestAnimationFrame(startDischargeObserver);
    }
  };

  startDischargeObserver();

})();