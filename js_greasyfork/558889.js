// ==UserScript==
// @name         Disable speed change of Video Speed Controller
// @namespace    https://greasyfork.org/ja/users/570127
// @version      1.0.1
// @description  ABEMAで d などの単キーショートカットを無効化する
// @author       universato
// @match        https://abema.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558889/Disable%20speed%20change%20of%20Video%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/558889/Disable%20speed%20change%20of%20Video%20Speed%20Controller.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 無効化したいキー（必要に応じて追加）
  const BLOCK_KEYS = new Set([
    'd',
    'g',
    'r',
    's',
  ]);

  document.addEventListener('keydown', (event) => {
      // 修飾キー併用は素通し（Ctrl+D 等を壊さない）
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      // IME変換中は何もしない
      if (event.isComposing) return;

      // 編集可能要素では何もしない
      const el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) { return; }

      // 対象キーのみブロック
      if (BLOCK_KEYS.has(event.key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true // ★ capture フェーズが重要
  );
})();
