// ==UserScript==
// @name         Ups - Deactivate chat completely
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle Torn chat ON/OFF.
// @author       Upsilon [3212478]
// @license      ISC
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/554743/Ups%20-%20Deactivate%20chat%20completely.user.js
// @updateURL https://update.greasyfork.org/scripts/554743/Ups%20-%20Deactivate%20chat%20completely.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let chatDisabled = GM_getValue('chat_disabled', false);

  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('Minified React error #299')) {
      console.warn('[Torn Chat Toggle] Caught React mounting error, ignoring.');
      e.stopImmediatePropagation();
      e.preventDefault();
      return false;
    }
  }, true);

  if (chatDisabled) {
    const observer = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (node.id === 'chatRoot') {
            console.log('[Torn Chat Toggle] Removing chatRoot before mount.');
            node.remove();
          }
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function disableChat() {
    const root = document.getElementById('chatRoot');
    if (root) root.remove();
    GM_setValue('chat_disabled', true);
    chatDisabled = true;
    console.log('[Torn Chat Toggle] Chat disabled');
  }

  function enableChat() {
    if (!document.getElementById('chatRoot')) {
      const div = document.createElement('div');
      div.id = 'chatRoot';
      document.body.appendChild(div);
      alert('ChatRoot restored. Reload the page to reactivate chat.');
    }
    GM_setValue('chat_disabled', false);
    chatDisabled = false;
    console.log('[Torn Chat Toggle] Chat enabled');
  }

  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    btn.textContent = chatDisabled ? 'Chat: OFF' : 'Chat: ON';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      color: 'white',
      backgroundColor: chatDisabled ? '#c0392b' : '#27ae60',
      cursor: 'pointer',
      fontWeight: 'bold',
      zIndex: '99999',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    });

    btn.addEventListener('click', () => {
      if (chatDisabled) enableChat();
      else disableChat();

      btn.textContent = chatDisabled ? 'Chat: OFF' : 'Chat: ON';
      btn.style.backgroundColor = chatDisabled ? '#c0392b' : '#27ae60';
    });

    document.body.appendChild(btn);
  });
})();
