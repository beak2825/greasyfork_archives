// ==UserScript==
// @name         Pumpkin Finder
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  It displays a list of uncollected pumpkins
// @author       Diramix
// @match        https://wplace.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554310/Pumpkin%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/554310/Pumpkin%20Finder.meta.js
// ==/UserScript==

(() => {
  const targetSelector = 'body > div > dialog:nth-child(20) > div > div:nth-child(5)';
  const iframeUrl = 'https://wplace.samuelscheit.com/#pumpkins=1';
  let iframe = null;
  let cleanupInterval = null;

  // --- Extract pumpkin numbers from data-tip ---
  function getClaimedNumbers() {
    const el = document.querySelector(`${targetSelector} > div[data-tip]`);
    if (!el) return [];
    const text = el.getAttribute('data-tip') || '';
    const matches = text.match(/#(\\d+)/g) || [];
    return matches.map(n => parseInt(n.replace('#', ''), 10));
  }

  // --- Remove pumpkins inside iframe ---
  function removePumpkins() {
    if (!iframe?.contentDocument) return;

    const doc = iframe.contentDocument;
    const container = doc.querySelector('#pumpkins-modal');
    if (!container) return; // modal not yet loaded

    const claimed = getClaimedNumbers();
    if (!claimed.length) return;

    let removed = 0;
    claimed.forEach(num => {
      container.querySelectorAll('div').forEach(div => {
        const txt = div.innerText || '';
        if (txt.match(new RegExp(`\\b${num}\\b`))) {
          div.remove();
          removed++;
        }
      });
    });

    if (removed > 0) console.log(`[pumpkins] Removed ${removed} pumpkins`);
  }

  // --- Add iframe into the modal ---
  function injectIframe() {
    const container = document.querySelector(targetSelector);
    if (!container) return;
    if (container.querySelector('iframe[src*="wplace.samuelscheit.com"]')) return;

    iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = '1px solid #444';
    container.appendChild(iframe);

    console.log('[pumpkins] iframe added');

    iframe.addEventListener('load', () => {
      console.log('[pumpkins] iframe loaded');
      const tryRemove = () => {
        if (!document.body.contains(iframe)) {
          clearInterval(cleanupInterval);
          cleanupInterval = null;
          return;
        }
        removePumpkins();
      };

      // check every second until pumpkins-modal appears
      const waitForModal = setInterval(() => {
        if (iframe?.contentDocument?.querySelector('#pumpkins-modal')) {
          clearInterval(waitForModal);
          tryRemove(); // first cleanup
          cleanupInterval = setInterval(tryRemove, 5000); // every 5s
        }
      }, 1000);
    });
  }

  // --- Watch for the dialog to appear ---
  const observer = new MutationObserver(() => {
    const container = document.querySelector(targetSelector);
    if (container) injectIframe();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log('[pumpkins] observer started');
})();