// ==UserScript==
// @name         XHS Screen Lock (fake gate, Enter/Cmd+Enter unlock)
// @namespace    local.xhs.lock
// @version      0.3.2
// @description  Fullscreen fake password gate for xiaohongshu.com. 4 button submits show remaining 3/2/1/0 then disable button; unlock only via Enter or ⌘+Enter. Suppresses password save prompts.
// @match        *://xiaohongshu.com/*
// @match        *://*.xiaohongshu.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558782/XHS%20Screen%20Lock%20%28fake%20gate%2C%20EnterCmd%2BEnter%20unlock%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558782/XHS%20Screen%20Lock%20%28fake%20gate%2C%20EnterCmd%2BEnter%20unlock%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const doc = document;

  // ---- Config ----
  const CFG = {
    title: 'Screen locked',
    hint: '请输入密码',

    // After each button-submit attempt, show: 3 / 2 / 1 / 0
    maxButtonAttempts: 4,

    // Browser/UI title masking (e.g. iOS Safari top bar)
    lockedDocumentTitle: 'Locked',
    restoreDocumentTitleOnUnlock: true,

    // Unlock is allowed only when button is disabled and user presses Enter or ⌘+Enter
    fadeMs: 180,
  };

  let attempts = 0; // counts button-submit attempts (including Enter-triggered form submits)
  let overlay, form, input, submitBtn, msgEl;

  // Document title masking (useful for iOS Safari top bar etc.)
  let titleLockActive = false;
  let titleObserver = null;
  let titleRootObserver = null;
  let originalTitle = null;

  function randName(prefix) {
    try {
      const n = (self.crypto && crypto.getRandomValues)
        ? crypto.getRandomValues(new Uint32Array(1))[0]
        : Math.floor(Math.random() * 0xffffffff);
      return `${prefix}_${n.toString(36)}`;
    } catch {
      return `${prefix}_${Date.now().toString(36)}`;
    }
  }

  function addNoScroll() {
    doc.documentElement.classList.add('xhs-lock-no-scroll');
    if (doc.body) doc.body.classList.add('xhs-lock-no-scroll');
    else {
      new MutationObserver((_, obs) => {
        if (doc.body) {
          doc.body.classList.add('xhs-lock-no-scroll');
          obs.disconnect();
        }
      }).observe(doc.documentElement, { childList: true, subtree: true });
    }
  }

  // ---- Title masking (locks Safari/iOS top bar title etc.) ----
  function applyLockedTitle() {
    try { doc.title = CFG.lockedDocumentTitle; } catch {}
  }

  function startTitleLock() {
    if (titleLockActive) return;
    titleLockActive = true;

    const locked = CFG.lockedDocumentTitle;

    // Capture any pre-existing title (often empty at document-start)
    try {
      const cur = doc.title;
      if (originalTitle == null && cur && cur !== locked) originalTitle = cur;
    } catch {}

    // Set immediately to reduce chance of brief leaks
    applyLockedTitle();

    const attachTitleObserver = () => {
      const t = doc.querySelector('title');
      if (!t) return false;

      if (titleObserver) {
        try { titleObserver.disconnect(); } catch {}
        titleObserver = null;
      }

      titleObserver = new MutationObserver(() => {
        if (!titleLockActive) return;
        let cur = '';
        try { cur = doc.title; } catch {}
        if (cur !== locked) {
          if (originalTitle == null && cur) originalTitle = cur;
          applyLockedTitle();
        }
      });

      titleObserver.observe(t, { childList: true, characterData: true, subtree: true });
      return true;
    };

    if (!attachTitleObserver()) {
      // Title element may not exist yet; keep title locked and attach once it appears.
      if (titleRootObserver) {
        try { titleRootObserver.disconnect(); } catch {}
        titleRootObserver = null;
      }

      titleRootObserver = new MutationObserver(() => {
        if (!titleLockActive) return;
        applyLockedTitle();
        if (attachTitleObserver()) {
          try { titleRootObserver.disconnect(); } catch {}
          titleRootObserver = null;
        }
      });

      titleRootObserver.observe(doc.documentElement, { childList: true, subtree: true });
    }
  }

  function stopTitleLock() {
    titleLockActive = false;

    if (titleObserver) {
      try { titleObserver.disconnect(); } catch {}
      titleObserver = null;
    }

    if (titleRootObserver) {
      try { titleRootObserver.disconnect(); } catch {}
      titleRootObserver = null;
    }

    if (CFG.restoreDocumentTitleOnUnlock && originalTitle != null) {
      try { doc.title = originalTitle; } catch {}
    }
  }

  function setLeftMsg(left) {
    // Keep wording exactly: 还剩下 3 / 2 / 1 / 0 次机会
    msgEl.textContent = `${CFG.hint}。还剩下 ${left} 次机会。`;
  }

  function focusInputSoon() {
    // document-start may focus unreliably; retry a few times without spamming.
    const tryFocus = () => {
      if (!input || !overlay || !overlay.isConnected) return;
      try { input.focus({ preventScroll: true }); } catch { try { input.focus(); } catch {} }
    };

    // Immediate + next frame + shortly after DOM is interactive
    tryFocus();
    requestAnimationFrame(tryFocus);
    setTimeout(tryFocus, 50);

    // One more after DOMContentLoaded (for browsers that block early focus)
    doc.addEventListener('DOMContentLoaded', tryFocus, { once: true, capture: true });
  }

  function createOverlay() {
    const style = doc.createElement('style');
    style.textContent = `
#xhs-screen-lock{position:fixed;inset:0;z-index:2147483647;background:#0b0b0f;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,Apple Color Emoji,Noto Color Emoji;color:#e5e7eb}
#xhs-screen-lock *{box-sizing:border-box}
#xhs-screen-lock .card{width:min(92vw,440px);padding:28px;border-radius:16px;background:#111827;border:1px solid #1f2937;box-shadow:0 10px 30px rgba(0,0,0,.5);text-align:center}
#xhs-screen-lock h1{margin:0 0 8px;font-size:20px;font-weight:600;color:#f9fafb}
#xhs-screen-lock p{margin:8px 0 16px;color:#cbd5e1}
#xhs-screen-lock form{display:flex;gap:10px;margin-top:10px}
#xhs-screen-lock input{flex:1;padding:12px 14px;border-radius:12px;border:1px solid #374151;background:#0f172a;color:#e5e7eb;outline:none}
#xhs-screen-lock input:focus{border-color:#60a5fa}
#xhs-screen-lock button{padding:12px 16px;border-radius:12px;border:1px solid #374151;background:#1f2937;color:#e5e7eb;cursor:pointer}
#xhs-screen-lock button:hover{filter:brightness(1.05)}
#xhs-screen-lock button[disabled]{opacity:.45;cursor:not-allowed}
#xhs-screen-lock.fading{transition:opacity .18s ease;opacity:0}
html.xhs-lock-no-scroll,body.xhs-lock-no-scroll{overflow:hidden!important}
    `;
    doc.documentElement.appendChild(style);

    overlay = doc.createElement('div');
    overlay.id = 'xhs-screen-lock';
    overlay.innerHTML = `
      <div class="card" role="dialog" aria-modal="true" aria-labelledby="xhs-lock-title">
        <h1 id="xhs-lock-title">${CFG.title}</h1>
        <p id="xhs-lock-msg"></p>
        <form id="xhs-lock-form"
              autocomplete="off"
              data-lpignore="true" data-1p-ignore="true" data-bwignore="true" data-dashlane="disabled">
          <input id="xhs-lock-input"
                 type="password"
                 placeholder="Password"
                 aria-label="Password"
                 autocomplete="off"
                 autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="text" />
          <button id="xhs-lock-submit" type="submit">确认</button>
        </form>
      </div>
    `;
    doc.documentElement.appendChild(overlay);

    form = overlay.querySelector('#xhs-lock-form');
    input = overlay.querySelector('#xhs-lock-input');
    submitBtn = overlay.querySelector('#xhs-lock-submit');
    msgEl = overlay.querySelector('#xhs-lock-msg');

    // Randomize name to further avoid password-manager heuristics
    form.setAttribute('name', randName('form'));
    input.setAttribute('name', randName('pw'));
    // Initial message: show remaining chances immediately (e.g. 3 when maxButtonAttempts=4)
    setLeftMsg(Math.max(0, CFG.maxButtonAttempts - 1));

    addNoScroll();
    focusInputSoon();
  }

  function disableButtonOnly() {
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-disabled', 'true');
  }

  function removeOverlay() {
    overlay.classList.add('fading');
    setTimeout(() => {
      try { overlay.remove(); } catch {}
      doc.documentElement.classList.remove('xhs-lock-no-scroll');
      if (doc.body) doc.body.classList.remove('xhs-lock-no-scroll');
      doc.removeEventListener('keydown', keydownHandler, true);
      stopTitleLock();
    }, CFG.fadeMs);
  }

  function clearSensitiveInput() {
    try { input.value = ''; } catch {}
    // Extra: blur/restore focus so some managers stop tracking
    try { input.blur(); } catch {}
    focusInputSoon();
  }

  function submitHandler(e) {
    e.preventDefault();

    // Count attempts only while button is enabled; once disabled, form submits must not unlock.
    // Unlock is strictly via keydown handler (Enter / ⌘+Enter).
    if (submitBtn.disabled) {
      clearSensitiveInput();
      return;
    }

    attempts += 1;

    const left = Math.max(0, CFG.maxButtonAttempts - attempts);
    setLeftMsg(left);

    clearSensitiveInput();

    if (attempts >= CFG.maxButtonAttempts) {
      // 4th button submit shows 0 and disables button.
      disableButtonOnly();
    }
  }

  function isAllowedUnlockKey(e) {
    if (e.key !== 'Enter') return false;
    // Only Enter (no modifiers) OR ⌘+Enter (meta only)
    if (e.ctrlKey || e.altKey || e.shiftKey) return false;
    return true; // metaKey may be true or false
  }

  function keydownHandler(e) {
    if (!overlay || !overlay.isConnected) return;

    // Block clicks/keypresses from reaching underlying page
    // (preventDefault selectively to not break other keys)

    if (!isAllowedUnlockKey(e)) return;

    // Unlock only after button has been disabled (i.e., after 4 button submits)
    if (!submitBtn.disabled) {
      // Optional: if user presses Enter early, treat it like a normal submit
      // by requesting a submit. This keeps behavior intuitive without unlocking.
      e.preventDefault();
      try {
        if (form.requestSubmit) form.requestSubmit(submitBtn);
        else submitBtn.click();
      } catch {}
      return;
    }

    // Button disabled: Enter / ⌘+Enter unlocks.
    e.preventDefault();
    setLeftMsg(0);

    // Avoid save prompts as much as possible before removal
    try { input.value = ''; } catch {}
    try { input.setAttribute('autocomplete', 'off'); } catch {}
    try { input.removeAttribute('name'); } catch {}
    try { form.setAttribute('autocomplete', 'off'); } catch {}

    // Remove input element to reduce password manager triggers
    try { input.remove(); } catch {}

    setTimeout(removeOverlay, 120);
  }

  startTitleLock();
  createOverlay();
  form.addEventListener('submit', submitHandler, true);
  doc.addEventListener('keydown', keydownHandler, true);
  overlay.addEventListener('click', (ev) => ev.stopPropagation(), true);
})();
