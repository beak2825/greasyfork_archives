// ==UserScript==
// @name         X:Following Timeline
// @name:ja      X:フォローTL
// @namespace    https://greasyfork.org/ja/users/570127
// @author       universato
// @version      1.7.0
// @description  Switch to "Following" once, and cycle Home tabs with ← →
// @description:ja  「フォロー中」を最初のTLとして 左右矢印キーでタブ移動。
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559712/X%3AFollowing%20Timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/559712/X%3AFollowing%20Timeline.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const FOLLOWING_LABELS = ['フォロー中', 'Following'];
  const MAX_RETRY = 10;
  const RETRY_DELAY_MS = 300;

  /* ========= utils ========= */

  const getTabs = () =>
    Array.from(document.querySelectorAll('[role="tab"]'));

  const getSelectedIndex = (tabs) =>
    tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');

  /* ========= initial switch (once) ========= */

  let retryCount = 0;

  function switchToFollowingOnce() {
    if (location.pathname !== '/home') return;

    const tabs = getTabs();
    if (!tabs.length) {
      if (++retryCount < MAX_RETRY) {
        setTimeout(switchToFollowingOnce, RETRY_DELAY_MS);
      }
      return;
    }

    tabs[1].click();
  }

  switchToFollowingOnce();

  /* ========= arrow key navigation ========= */

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (event.isComposing) return;
    if (event.repeat) return;

    const activeElement = document.activeElement;
    if (activeElement.isContentEditable) return;
    if (activeElement.tagName === 'INPUT') return;
    if (activeElement.tagName === 'TEXTAREA') return;

    const paths = location.pathname.split('/');
    if (paths[4] === 'photo') return;

    const tabs = getTabs();
    if (tabs.length < 2) return;

    const currentIndex = getSelectedIndex(tabs);
    if (currentIndex === -1) return;

    const direction = event.key === 'ArrowLeft' ? -1 : 1;
    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    tabs[nextIndex].click();
  });
})();
