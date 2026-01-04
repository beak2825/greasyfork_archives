// ==UserScript==
// @name         OW Ändra kundadress
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Rensar upp kundadress fälten när man ändrar
// @author       Du
// @match        https://nctrading.ongoingsystems.se/NCTrading/index.aspx?templ=*
// @icon         https://docs.ongoingwarehouse.com/Content/Images/ongoing-og-image.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549017/OW%20%C3%84ndra%20kundadress.user.js
// @updateURL https://update.greasyfork.org/scripts/549017/OW%20%C3%84ndra%20kundadress.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_IDS = [
    '#ModalControlWMS_MC0_FSDeliveryAddresses',
    '#ModalControlWMS_MC0_FSTransporterContracts',
    '#ModalControlWMS_MC0_FSFiles'
  ];

  function adjustLayout(root = document) {
    if (!root.querySelector('#ModalControlWMS_MC0_DivDeliveryInstruction')) return;

    // 🔹 Flytta Customer name till Address innan vi tar bort kolumnen
    const addressFieldset = root.querySelector('#ModalControlWMS_MC0_NLMainAddress')?.closest('fieldset');
    const customerLabel = root.querySelector('#ModalControlWMS_MC0_NLCustomerName');
    const customerInput = root.querySelector('#ModalControlWMS_MC0_TKund');
    const addressLabel = addressFieldset?.querySelector('#ModalControlWMS_MC0_NLAddress');

    if (addressFieldset && addressLabel && customerLabel && customerInput) {
      if (!addressFieldset.contains(customerLabel)) {
        let starNode = null;
        let n = customerLabel.nextSibling;
        while (n) {
          if (n.nodeType === 3 && n.textContent.trim() === '*') {
            starNode = n;
            break;
          }
          n = n.nextSibling;
        }

        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '3px'; // tajtare spacing
        wrapper.appendChild(customerLabel);
        if (starNode) wrapper.appendChild(starNode);
        wrapper.appendChild(document.createElement('br'));
        wrapper.appendChild(customerInput);

        addressFieldset.insertBefore(wrapper, addressLabel.closest('label') || addressLabel);
        console.log('👤 Customer name * preserved and moved to Address fieldset.');
      }
    }

    // 🧹 Ta bort Customer-kolumnen
    const customerCol = root.querySelector('#DivCustomerInfo');
    if (customerCol) {
      customerCol.remove();
      console.log('🗑️ Customer column safely removed.');
    }

    // Dölj onödiga sektioner
    TARGET_IDS.forEach(sel =>
      root.querySelectorAll(sel).forEach(el => (el.style.display = 'none'))
    );

    // 🧱 Gör vänsterkolumn (Address) bredare — ändra från 4/12 till 8/12
    const leftCol = root.querySelector('#ModalControlWMS_MC0_FSDeliveryAddresses')?.closest('.col');
    if (leftCol) {
      leftCol.classList.remove('width-4/12');
      leftCol.classList.add('width-8/12');
      console.log('📏 Left column expanded to width-8/12.');
    }

    // Flytta Address-fieldset till vänsterkolumnen
    if (addressFieldset && leftCol && !leftCol.contains(addressFieldset)) {
      leftCol.appendChild(addressFieldset);
      console.log('🏠 Address fieldset moved to left column.');
    }

    // Flytta Notifications till högerkolumnen
    const notificationsFieldset = root.querySelector('#ModalControlWMS_MC0_NLNotifications')?.closest('fieldset');
    const rightColumn = root.querySelector('#ModalControlWMS_MC0_FSTransporterContracts')?.closest('.col');
    if (notificationsFieldset && rightColumn && !rightColumn.contains(notificationsFieldset)) {
      rightColumn.appendChild(notificationsFieldset);
      console.log('📦 Notifications fieldset moved to right column.');
    }

    // Flytta Delivery instruction inuti Notifications
    const deliveryInstruction = root.querySelector('#ModalControlWMS_MC0_DivDeliveryInstruction');
    if (notificationsFieldset && deliveryInstruction && !notificationsFieldset.contains(deliveryInstruction)) {
      notificationsFieldset.appendChild(deliveryInstruction);
      console.log('✉️ Delivery instruction moved inside Notifications fieldset (no divider).');
    }

    // ❌ Ta bort infoboxen "After updating..."
    const infoBox = root.querySelector('.div-message-updatelabeldiv.UpdateLabelDivInfoMessage');
    if (infoBox) {
      infoBox.remove();
      console.log('🧽 Info box "After updating..." removed.');
    }

    // ❌ Ta bort Delete-knappen
    const deleteBtn = root.querySelector('#ModalControlWMS_MC0_ButDelete');
    if (deleteBtn) {
      deleteBtn.remove();
      console.log('🚫 Delete button removed.');
    }
  }

  // === Observer + hook + init ===
  const bodyObserver = new MutationObserver(muts => {
    for (const m of muts)
      for (const node of m.addedNodes)
        if (
          node.nodeType === 1 &&
          (node.id?.startsWith?.('ModalControlWMS_MC0') ||
            node.querySelector?.('#ModalControlWMS_MC0_FSDeliveryAddresses'))
        )
          setTimeout(() => adjustLayout(node.ownerDocument || document), 300);
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  function hookPageRequestManager() {
    try {
      const prm = Sys?.WebForms?.PageRequestManager?.getInstance?.();
      if (prm && !prm._owModalCleanerHooked) {
        prm.add_endRequest(() => setTimeout(adjustLayout, 400));
        prm._owModalCleanerHooked = true;
      }
    } catch {
      setTimeout(hookPageRequestManager, 800);
    }
  }
  hookPageRequestManager();

  // 🖐️ Extra hantering för pekskärmar
  const isTouchDevice = navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    console.log('📱 Touch device detected — enabling delayed layout fix.');
    // kör igen efter längre delay
    setTimeout(() => adjustLayout(document), 1500);
    // samt vid första pekning
    window.addEventListener('pointerdown', () => setTimeout(() => adjustLayout(document), 300), { once: true });
  }

  // vanlig init
  window.addEventListener('load', () => setTimeout(adjustLayout, 600));
})();