// ==UserScript==
// @name         ABEMA Playback Rate Shortcut (d/s/g/r)
// @namespace    https://greasyfork.org/users/570127
// @version      2025.12.26.4
// @description  ABEMA VODの再生速度を d/s で段階変更、g/r で 1.7x に設定
// @match        https://abema.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560214/ABEMA%20Playback%20Rate%20Shortcut%20%28dsgr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560214/ABEMA%20Playback%20Rate%20Shortcut%20%28dsgr%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ABEMA VOD 固定の速度段階
  const RATES = ['1', '1.3', '1.5', '1.7', '2'];

  function isEditable() {
    const el = document.activeElement;
    return el && (
      el.tagName === 'INPUT' ||
      el.tagName === 'TEXTAREA' ||
      el.isContentEditable
    );
  }

  function block(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function getCurrentRate() {
    return document.querySelector('input[name="vod-setting-playbackRate"]:checked')?.value;
  }

  function clickRate(value) {
    const input = document.querySelector(`input[name="vod-setting-playbackRate"][value="${value}"]`);
    if (!input || input.checked) return;
    input.click();
  }

  function step(delta) {
    const current = getCurrentRate();
    if (!current) return;

    const idx = RATES.indexOf(current);
    if (idx === -1) return;

    const next = RATES[idx + delta];
    if (next) {
      clickRate(next);
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.isComposing || isEditable()) return;

    switch (e.key) {
      case 'd': // 速度アップ
        block(e);
        step(+1);
        break;

      case 's': // 速度ダウン
        block(e);
        step(-1);
        break;

      case 'g': // 1.7x
      case 'r': // 1.7x
        block(e);
        clickRate('1.7');
        break;
    }
  }, true);

  // keyup も必ず遮断（pause 防止）
  document.addEventListener('keyup', (e) => {
    if (['d', 's', 'g', 'r'].includes(e.key)) {
      block(e);
    }
  }, true);

})();
