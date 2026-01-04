// ==UserScript==
// @name         MBSS Online Call Highlighter
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Highlights online call requests in pre-chat&in chat
// @match        https://support-admin-common-master.mbss.maxbit.private/*
// @grant        none
// @author       Lügner-Mafia Firma Dallas
// @downloadURL https://update.greasyfork.org/scripts/554049/MBSS%20Online%20Call%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/554049/MBSS%20Online%20Call%20Highlighter.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const KEYWORDS = [   //Trigger words
    "онлайн-звонок", "online call", "rückruf", "llamada", "rappel",
    "ligação", "aramasını", "オンライン通話", "कॉलबैक", "wezwanie online", "qayta qo'ng'iroq"
  ].map(k => k.toLowerCase());

  const MARK_ATTR = 'data-call-highlighter'; //Styling
  const HIGHLIGHT_BG = '#ff6666';
  const HIGHLIGHT_BORDER = '2px solid #ff6666';

  function containsKeyword(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    return KEYWORDS.some(k => lower.includes(k));
  }

  function markElement(el) {
    if (!el || el.getAttribute(MARK_ATTR) === '1') return;
    el.style.backgroundColor = HIGHLIGHT_BG;
    el.style.border = HIGHLIGHT_BORDER;
    el.style.color = '';
    el.setAttribute(MARK_ATTR, '1');
  }

  function processWrapper(wrapper) {
    if (!wrapper) return;
    const attrText = wrapper.getAttribute('text-messages') || '';
    const visibleText = wrapper.innerText || '';
    const text = (attrText === '[object Object]' ? '' : attrText) + ' ' + visibleText;
    if (containsKeyword(text)) {
      markElement(wrapper);
      const parentCard = wrapper.closest('div.vac-card-info.vac-card-system');
      if (parentCard) markElement(parentCard);
    } else {
      const msgContainer = wrapper.querySelector('div.message-container');
      if (msgContainer) {
        const firstInner = msgContainer.querySelector('div');
        if (firstInner && /user requested a call/i.test(firstInner.innerText || '')) {
          markElement(wrapper);
          const parentCard = wrapper.closest('div.vac-card-info.vac-card-system');
          if (parentCard) markElement(parentCard);
        }
      }
    }
  }

  function scanExisting() {
    const wrappers = document.querySelectorAll('div.vac-card-info.vac-card-system > div.vac-format-message-wrapper');
    wrappers.forEach(processWrapper);

    const directMatches = document.querySelectorAll('div.vac-card-info.vac-card-system div.message-container > div');
    directMatches.forEach(div => {
      if (div.getAttribute(MARK_ATTR) === '1') return;
      if (/user requested a call/i.test(div.innerText || '')) {
        const parentCard = div.closest('div.vac-card-info.vac-card-system');
        if (parentCard) markElement(parentCard);
        const wrapper = parentCard ? parentCard.querySelector('div.vac-format-message-wrapper') : null;
        if (wrapper) markElement(wrapper);
        div.setAttribute(MARK_ATTR, '1');
      }
    });
  }

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches && node.matches('div.vac-card-info.vac-card-system')) {
            const wrapper = node.querySelector('div.vac-format-message-wrapper');
            if (wrapper) processWrapper(wrapper);
            const direct = node.querySelector('div.message-container > div');
            if (direct && /user requested a call/i.test(direct.innerText || '')) {
              markElement(node);
              if (wrapper) markElement(wrapper);
            }
          } else {
            const wrapper = node.querySelector && node.querySelector('div.vac-format-message-wrapper');
            if (wrapper) processWrapper(wrapper);
            const direct = node.querySelector && node.querySelector('div.vac-card-info.vac-card-system div.message-container > div');
            if (direct && /user requested a call/i.test(direct.innerText || '')) {
              const parentCard = direct.closest('div.vac-card-info.vac-card-system');
              if (parentCard) markElement(parentCard);
              const w = parentCard ? parentCard.querySelector('div.vac-format-message-wrapper') : null;
              if (w) markElement(w);
            }
          }
        });
      }
      if (m.type === 'attributes' && m.target) {
        const t = m.target;
        if (t.matches && t.matches('div.vac-format-message-wrapper')) processWrapper(t);
      }
    }
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['text-messages']
  });

  scanExisting();
  const periodic = setInterval(scanExisting, 2000);
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
    clearInterval(periodic);
  });
})();