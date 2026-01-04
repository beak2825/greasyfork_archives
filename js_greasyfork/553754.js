// ==UserScript==
// @name         Formula Click Copy
// @version      2.0
// @namespace    caimeo
// @description  Copy LaTeX Code in Wikiwand and ChatGPT
// @author       CAIMEOX
// @match        https://www.wikiwand.com/*
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553754/Formula%20Click%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/553754/Formula%20Click%20Copy.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.right = '20px';
  toast.style.padding = '8px 14px';
  toast.style.background = 'rgba(0,0,0,0.75)';
  toast.style.color = 'white';
  toast.style.borderRadius = '6px';
  toast.style.fontSize = '14px';
  toast.style.zIndex = '9999';
  toast.style.transition = 'opacity 0.3s';
  toast.style.opacity = '0';
  document.body.appendChild(toast);

  function showToast(msg) {
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => toast.style.opacity = '0', 1500);
  }

  function attachHandlers() {
    document.querySelectorAll('.mwe-math-element').forEach(el => {
      if (el.dataset.copyHandlerAttached) return;
      el.dataset.copyHandlerAttached = 'true';
      el.style.cursor = 'pointer';

      el.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        const annotation = el.querySelector('annotation[encoding="application/x-tex"]');
        if (annotation && annotation.textContent) {
          GM_setClipboard(annotation.textContent.trim());
          showToast('✅ Copied');
        } else {
          showToast('⚠️ LaTeX Source Not Found');
        }
      });
    });

    document.querySelectorAll('.katex-display, .katex').forEach(el => {
      if (el.dataset.copyHandlerAttached) return;
      el.dataset.copyHandlerAttached = 'true';
      el.style.cursor = 'pointer';

      el.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        const annotation = el.querySelector('annotation[encoding="application/x-tex"]');
        if (annotation && annotation.textContent) {
          GM_setClipboard(annotation.textContent.trim());
          showToast('✅ Copied');
        } else {
          showToast('⚠️ LaTeX Source Not Found');
        }
      });
    });
  }

  attachHandlers();
  const observer = new MutationObserver(attachHandlers);
  observer.observe(document.body, { childList: true, subtree: true });
})();