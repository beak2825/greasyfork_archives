// ==UserScript==
// @name         Doctrin, skicka direkt som standardval
// @namespace    marten-helper
// @version      1.2
// @description  Välj "Skicka direkt" automatiskt och håll fast vid det även vid React-omrenderingar.
// @match        https://e-caregiver.se/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549216/Doctrin%2C%20skicka%20direkt%20som%20standardval.user.js
// @updateURL https://update.greasyfork.org/scripts/549216/Doctrin%2C%20skicka%20direkt%20som%20standardval.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const DEBUG = false; // sätt till true om du vill se loggar i konsolen
  const log = (...a) => { if (DEBUG) console.log('[SkickaDirekt]', ...a); };

  const inSendouts = () => location.pathname.includes('/brackediakoni/vilan/sendouts');

  function findRadios() {
    const direct = document.getElementById('method.directly')
      || document.querySelector('input[name="method"][value="directly"]');
    const scheduled = document.getElementById('method.scheduled')
      || document.querySelector('input[name="method"][value="scheduled"]');
    return { direct, scheduled };
  }

  function setDirectIfPossible() {
    if (!inSendouts()) return false;
    const { direct, scheduled } = findRadios();
    if (!direct) { log('Hittar ej method.directly ännu'); return false; }

    if (direct.checked) { log('Redan ikryssad'); return true; }

    try {
      // Viktigt i React: använd klick + bubbla events
      direct.click();
      direct.dispatchEvent(new Event('input',  { bubbles: true }));
      direct.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (e) {
      log('Event-fel:', e);
    }

    // Extra säkerhet
    if (scheduled && scheduled.checked) {
      scheduled.checked = false;
      scheduled.dispatchEvent(new Event('change', { bubbles: true }));
    }

    log('Försökte kryssa i "Skicka direkt":', direct.checked);
    return !!direct.checked;
  }

  // Första försök + kort retry (hydrering/render sker ofta lite senare)
  let attempts = 0;
  const iv = setInterval(() => {
    attempts++;
    const ok = setDirectIfPossible();
    if (ok || attempts > 20) clearInterval(iv);
  }, 250);

  // Observera DOM-förändringar (komponenten kan mountas om)
  const observer = new MutationObserver(() => {
    if (inSendouts()) setDirectIfPossible();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Hooka SPA-routning så vi re-applikerar när URL:en ändras internt
  const hook = (type) => {
    const orig = history[type];
    history[type] = function() {
      const ret = orig.apply(this, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };
  };
  hook('pushState'); hook('replaceState');
  window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
  window.addEventListener('locationchange', () => setTimeout(setDirectIfPossible, 50));
})();