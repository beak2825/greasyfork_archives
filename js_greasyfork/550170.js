// ==UserScript==
// @name         FC2ライブオートブラウザフィット
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  画面読み込み時にブラウザフィット／スペースキーでコメント表示/非表示
// @match        https://live.fc2.com/*
// @license   MIT
// @grant        none
// @run-at       document-idle
// @all-frames   true
// @downloadURL https://update.greasyfork.org/scripts/550170/FC2%E3%83%A9%E3%82%A4%E3%83%96%E3%82%AA%E3%83%BC%E3%83%88%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%95%E3%82%A3%E3%83%83%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/550170/FC2%E3%83%A9%E3%82%A4%E3%83%96%E3%82%AA%E3%83%BC%E3%83%88%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%95%E3%82%A3%E3%83%83%E3%83%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 1) 起動時：ブラウザフィットを押す（後から出てくる場合も監視）
  function clickBrowserFit() {
    const btn = document.querySelector('.js-resizePlayerBtn');
    if (btn) {
      btn.click();
      console.log('[userscript] ブラウザフィットを自動クリック');
      return true;
    }
    return false;
  }

  if (!clickBrowserFit()) {
    const obs = new MutationObserver(() => {
      if (clickBrowserFit()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  // 2) スペースキーで .js-player_adjuster を押す（確実クリック）
  function isTypingContext() {
    const el = document.activeElement;
    if (!el) return false;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return true;
    if (el.isContentEditable) return true;
    if (el.getAttribute && el.getAttribute('role') === 'textbox') return true;
    return false;
  }

  function fullClick(el) {
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const opts = { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 };
    el.dispatchEvent(new PointerEvent('pointerdown', opts));
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new PointerEvent('pointerup', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
  }

  // capture段階で拾ってページ側の阻止より先に処理
  window.addEventListener('keydown', (e) => {
    // どのフレームでも発火するが、対象要素がないフレームでは何もしない
    const adjuster = document.querySelector('.js-player_adjuster');
    if (!adjuster) return;

    // 入力中は無効化
    if (isTypingContext()) return;

    const isSpace =
      e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar';

    if (isSpace) {
      // デフォルト（スクロール）とバブリングを止める
      e.preventDefault();
      e.stopPropagation();

      try {
        fullClick(adjuster);
        console.log('[userscript] Space → player_adjuster をクリック');
      } catch (err) {
        // フォールバック：通常のclick
        adjuster.click();
        console.log('[userscript] Space → fallback click');
      }
    }
  }, true); // capture = true が肝
})();