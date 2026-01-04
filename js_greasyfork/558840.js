// ==UserScript==
// @name         Gmail pagination Key Shortcut
// @name:ja      Gmailページネーション キーショートカット
// @namespace    https://greasyfork.org/ja/users/570127
// @version      2025.12.25.3
// @description  paginate Gmail by arrow keys
// @description:ja  Gmailで左右のキーでメールを移動します。
// @author       universato
// @license      MIT
// @match        https://mail.google.com/mail/u/0/*
// @supportURL   https://twitter.com/universato
// @downloadURL https://update.greasyfork.org/scripts/558840/Gmail%20pagination%20Key%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/558840/Gmail%20pagination%20Key%20Shortcut.meta.js
// ==/UserScript==

console.log("【UserScript】Gmail pagination Key Shortcut");

(function () {
  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.isComposing) return;
    if (event.repeat) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const activeElement = document.activeElement;
    if (activeElement.isContentEditable) return;
    if (/^(INPUT|TEXTAREA)$/.test(activeElement.tagName)) return;

    /* =====================
       Inbox(一覧画面)
       ===================== */
    if (location.href === 'https://mail.google.com/mail/u/0/#inbox') {
      let element = null;

      if (event.key === 'ArrowLeft') {
        element = document.getElementById(':m9');
      } else if (event.key === 'ArrowRight') {
        element = document.getElementById(':ma');
      }

      if (!element) return;

      // Inbox は Gmail の keydown を殺さない
      // (capture も preventDefault もしない)

      element.focus();
      ['mousedown', 'mouseup', 'click'].forEach(type => {
        element.dispatchEvent(
          new MouseEvent(type, {
            bubbles: true,
            cancelable: true
          })
        );
      });

      return;
    }

    /* =====================
       個別メール表示
       ===================== */
    let element = null;

    if (event.key === 'ArrowLeft') {
      element = document.querySelector('div.T-I.J-J5-Ji.adg.T-I-awG.T-I-ax7.T-I-Js-IF.L3');
    } else if (event.key === 'ArrowRight') {
      element = document.querySelector('div.T-I.J-J5-Ji.adg.T-I-awG.T-I-ax7.T-I-Js-Gs.L3');
    }

    element?.click();
  }, false);
})();
