// ==UserScript==
// @name        치지직 광고팝업 제거
// @namespace   http://tampermonkey.net/
// @match       *://chzzk.naver.com/*
// @icon        https://chzzk.naver.com/favicon.ico
// @grant       none
// @version     25092701
// @author      Lusyeon | 루션
// @description 광고차단 안내 팝업을 감지해 닫거나 제거합니다.
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550826/%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%ED%8C%9D%EC%97%85%20%EC%A0%9C%EA%B1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/550826/%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%ED%8C%9D%EC%97%85%20%EC%A0%9C%EA%B1%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TEXT_HINT = /광고\s*차단|광고차단|광고 차단 프로그램/i;

  const popupSelectors = [
    'div[class*="popup_dimmed"]',
    'div[class*="popup_container"]',
    'div[class*="popup_modal"]',
    'div[role="alertdialog"]',
    'div[class*="popup_contents"]'
  ];

  function findCandidatePopups() {
    const sel = popupSelectors.join(',');
    return Array.from(document.querySelectorAll(sel))
      .filter(el => !el.dataset.adHandled && TEXT_HINT.test(el.textContent));
  }

  async function handlePopup(popup) {
    try {
      popup.dataset.adHandled = '1';

      const dialog = popup.querySelector('[role="alertdialog"]') || popup;

      let btn = Array.from(dialog.querySelectorAll('button[type="button"], button'))
        .find(b => {
          const txt = (b.innerText || b.textContent || '').trim();
          return txt === '확인' || txt.includes('확인') || /button_primary__|button_container__|button_full_button__/.test(b.className);
        });

      if (!btn) {
        btn = dialog.querySelector('button');
      }

      if (btn) {
        try {
          const fiberKey = Object.keys(btn).find(k =>
            k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$') || k.includes('__reactFiber') || k.includes('__reactInternalInstance')
          );
          if (fiberKey) {
            const fiber = btn[fiberKey];
            const props = fiber?.memoizedProps || fiber?.pendingProps || fiber?.return?.memoizedProps || fiber?.stateNode?.props;
            const tryNames = ['confirmHandler','onClick','onClickHandler','onConfirm','handleClick'];
            for (const name of tryNames) {
              const fn = props?.[name];
              if (typeof fn === 'function') {
                try { fn.call(props, { type: 'click', isTrusted: true, target: btn }); } catch(e){}
                popup.dataset.adClosed = 'react';
                return;
              }
            }
          }
        } catch (e) {}

        try {
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }));
          btn.click && btn.click();
        } catch (e) {}

        await new Promise(r => setTimeout(r, 120));
        if (document.contains(popup)) {
          popup.remove();
          popup.dataset.adClosed = 'removed';
        } else {
          popup.dataset.adClosed = 'clicked';
        }
      } else {
        popup.remove();
        popup.dataset.adClosed = 'removed_no_button';
      }
    } catch (err) {}
  }

  async function tryRemoveAll() {
    const list = findCandidatePopups();
    if (!list.length) return;
    for (const p of list) {
      await handlePopup(p);
    }
  }

  const observer = new MutationObserver(() => {
    tryRemoveAll().catch(() => {});
  });
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => setTimeout(tryRemoveAll, 80));
  } else {
    setTimeout(tryRemoveAll, 80);
  }

  window.__adPopupRemover = { tryRemoveAll, handlePopup };
})();