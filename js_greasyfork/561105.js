// ==UserScript==
// @name         ChatGPT: Highlight Current Chat (oled/black dark mode)
// @author       mekineer and Nova (GPT-5.2 Thinking)
// @namespace    https://mekineer.com
// @version      2.01
// @license      GPL-3.0-or-later
// @description  Dark Reader compatible.  Outline the active chat in the sidebar history list.
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561105/ChatGPT%3A%20Highlight%20Current%20Chat%20%28oledblack%20dark%20mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561105/ChatGPT%3A%20Highlight%20Current%20Chat%20%28oledblack%20dark%20mode%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const CLS = 'tm-active-chat';
  const STYLE_ID = 'tm-active-chat-style-data-active';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      a.${CLS}, li.${CLS}{
        outline: 2px solid #00e5ff !important;
        outline-offset: 2px !important;
        border-radius: 12px !important;
        box-shadow:
          0 0 0 4px rgba(0,0,0,0.85),
          0 0 0 6px rgba(255,255,255,0.75) !important;
      }
    `;
    document.head.appendChild(s);
  }

  function clear() {
    document.querySelectorAll(`a.${CLS}, li.${CLS}`).forEach(el => el.classList.remove(CLS));
  }

  function update() {
    injectStyle();
    clear();

    // Primary signal
    const actives = document.querySelectorAll('a[data-active]');
    actives.forEach(a => {
      a.classList.add(CLS);

      // If this is in the Project page list, outline the whole row too
      const li = a.closest('li');
      if (li && li.className && li.className.includes('group/project-item')) {
        li.classList.add(CLS);
      }
    });

    // Fallback (just in case data-active disappears in some view)
    if (!actives.length) {
      document.querySelectorAll('a[aria-current="page"], a[aria-current="true"]').forEach(a => a.classList.add(CLS));
    }
  }

  let t;
  const schedule = () => { clearTimeout(t); t = setTimeout(update, 60); };

  const ps = history.pushState, rs = history.replaceState;
  history.pushState = function(...args){ const r = ps.apply(this,args); schedule(); return r; };
  history.replaceState = function(...args){ const r = rs.apply(this,args); schedule(); return r; };
  window.addEventListener('popstate', schedule);

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });

  schedule();
})();
