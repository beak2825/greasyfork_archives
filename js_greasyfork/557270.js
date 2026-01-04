// ==UserScript==
// @name         ChatGPT — UltraWide Pro
// @namespace    https://www.instagram.com/jsm.ig/
// @version      2025.11.28-Pro.5
// @author       Jonas
// @description  Stable ultrawide ChatGPT layout: removes width clamps, forces full-viewport content, auto-repairs SPA changes.
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://www.chatgpt.com/*
// @icon         https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557270/ChatGPT%20%E2%80%94%20UltraWide%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/557270/ChatGPT%20%E2%80%94%20UltraWide%20Pro.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STYLE_ID = 'ml-ultrawide-pro-style';
  const ATTR_UNCLAMP = 'data-ml-unclamp';
  const ATTR_LEFT = 'data-ml-left';
  const GUTTER_VW = 2;
  const GUTTER_PX = 20;

  const css = String.raw`
:root[${ATTR_UNCLAMP}="1"] html,
:root[${ATTR_UNCLAMP}="1"] body {
  max-width: none !important;
  overflow-x: visible !important;
}

/* === FULL WIDTH CORE === */
:root[${ATTR_UNCLAMP}="1"] #__next,
:root[${ATTR_UNCLAMP}="1"] main,
:root[${ATTR_UNCLAMP}="1"] [role="main"],
:root[${ATTR_UNCLAMP}="1"] [data-testid="stretched-app"],
:root[${ATTR_UNCLAMP}="1"] [data-testid="main-app"] {
  width: 100% !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding-left: min(${GUTTER_VW}vw, ${GUTTER_PX}px) !important;
  padding-right: min(${GUTTER_VW}vw, ${GUTTER_PX}px) !important;
  box-sizing: border-box !important;
}

/* remove max-width constraints */
:root[${ATTR_UNCLAMP}="1"] main [class*="max-w"],
:root[${ATTR_UNCLAMP}="1"] main .container,
:root[${ATTR_UNCLAMP}="1"] main .prose,
:root[${ATTR_UNCLAMP}="1"] main .markdown,
:root[${ATTR_UNCLAMP}="1"] main .content,
:root[${ATTR_UNCLAMP}="1"] main .layout,
:root[${ATTR_UNCLAMP}="1"] main .chat,
:root[${ATTR_UNCLAMP}="1"] main .conversation-turns {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

/* messages */
:root[${ATTR_UNCLAMP}="1"] [data-testid="conversation-turn"],
:root[${ATTR_UNCLAMP}="1"] [data-message-author-role],
:root[${ATTR_UNCLAMP}="1"] .message,
:root[${ATTR_UNCLAMP}="1"] .chat-message,
:root[${ATTR_UNCLAMP}="1"] .chat-entry,
:root[${ATTR_UNCLAMP}="1"] .bubble,
:root[${ATTR_UNCLAMP}="1"] .text-message {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

/* code blocks */
:root[${ATTR_UNCLAMP}="1"] pre,
:root[${ATTR_UNCLAMP}="1"] .markdown pre {
  width: 100% !important;
  max-width: 100% !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  white-space: pre !important;
  box-sizing: border-box !important;
}

:root[${ATTR_UNCLAMP}="1"] code,
:root[${ATTR_UNCLAMP}="1"] .markdown code {
  white-space: pre !important;
}

/* media */
:root[${ATTR_UNCLAMP}="1"] img,
:root[${ATTR_UNCLAMP}="1"] svg,
:root[${ATTR_UNCLAMP}="1"] video,
:root[${ATTR_UNCLAMP}="1"] canvas,
:root[${ATTR_UNCLAMP}="1"] table,
:root[${ATTR_UNCLAMP}="1"] figure,
:root[${ATTR_UNCLAMP}="1"] iframe {
  max-width: 100% !important;
  height: auto !important;
}

/* sidebars */
:root[${ATTR_UNCLAMP}="1"] [aria-label*="sidebar" i],
:root[${ATTR_UNCLAMP}="1"] [data-testid*="sidebar" i] {
  max-width: none !important;
}

/* left alignment */
:root[${ATTR_LEFT}="1"] [data-testid="composer:input"],
:root[${ATTR_LEFT}="1"] form textarea,
:root[${ATTR_LEFT}="1"] form [contenteditable="true"][role="textbox"],
:root[${ATTR_LEFT}="1"] [aria-label*="message" i],
:root[${ATTR_LEFT}="1"] [aria-label*="Prompt" i],
:root[${ATTR_LEFT}="1"] [aria-label*="Send a message" i] {
  text-align: left !important;
  direction: ltr !important;
  justify-content: flex-start !important;
  align-items: flex-start !important;
}

:root[${ATTR_LEFT}="1"] textarea::placeholder,
:root[${ATTR_LEFT}="1"] [contenteditable="true"][role="textbox"]::placeholder {
  text-align: left !important;
}

:root[${ATTR_LEFT}="1"] [data-testid="conversation-turn"] *[class*="prose"],
:root[${ATTR_LEFT}="1"] [data-message-author-role] .markdown,
:root[${ATTR_LEFT}="1"] .chat-message .markdown {
  text-align: left !important;
}

/* toolbar */
:root[${ATTR_LEFT}="1"] [role="toolbar"],
:root[${ATTR_LEFT}="1"] [data-testid*="toolbar" i],
:root[${ATTR_LEFT}="1"] .actions,
:root[${ATTR_LEFT}="1"] .controls {
  justify-content: flex-start !important;
}

/* input wrappers */
:root[${ATTR_LEFT}="1"] [class*="input"],
:root[${ATTR_LEFT}="1"] [class^="input"],
:root[${ATTR_LEFT}="1"] [data-testid*="input" i],
:root[${ATTR_LEFT}="1"] .editor,
:root[${ATTR_LEFT}="1"] .editor-wrap {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  text-align: left !important;
}

/* printing */
@media print {
  :root[${ATTR_UNCLAMP}="1"] html,
  :root[${ATTR_UNCLAMP}="1"] body,
  :root[${ATTR_UNCLAMP}="1"] #__next,
  :root[${ATTR_UNCLAMP}="1"] main,
  :root[${ATTR_UNCLAMP}="1"] [role="main"] {
    width: 100% !important;
    max-width: none !important;
    text-align: left !important;
  }
}
`.trim();

  /* === ENGINE === */

  function ensureStyle() {
    const root = document.documentElement;
    const head = document.head;
    if (!head) return;

    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      head.appendChild(el);
    }
    if (el.textContent !== css) el.textContent = css;

    if (!root.hasAttribute(ATTR_UNCLAMP)) root.setAttribute(ATTR_UNCLAMP, '1');
    if (!root.hasAttribute(ATTR_LEFT)) root.setAttribute(ATTR_LEFT, '1');
  }

  const observer = new MutationObserver(ensureStyle);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  function hook(fn) {
    return function () {
      const out = fn.apply(this, arguments);
      Promise.resolve().then(ensureStyle);
      return out;
    };
  }

  try {
    history.pushState = hook(history.pushState);
    history.replaceState = hook(history.replaceState);
  } catch {}

  addEventListener('popstate', ensureStyle, { passive: true });

  function loop() {
    ensureStyle();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

})();