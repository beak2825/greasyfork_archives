// ==UserScript==
// @name         X Home: Force Following tab
// @namespace    https://example.com/
// @version      1.0.0
// @description  Always switch Home timeline to "Following" (フォロー中)
// @match        https://x.com/home*
// @run-at       document-idle
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/559098/X%20Home%3A%20Force%20Following%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/559098/X%20Home%3A%20Force%20Following%20tab.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // 日本語UI/英語UIどちらでも動くように
  const FOLLOWING_LABELS = ['フォロー中', 'Following'];
  const FORYOU_LABELS    = ['おすすめ', 'For you'];

  const log = (...a) => console.log('[ForceFollowing]', ...a);

  function normText(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  function findTabByLabel(labels) {
    // Xはタブが role="tab" のことが多い
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
    for (const el of tabs) {
      const t = normText(el.textContent);
      if (labels.some(l => t === l || t.includes(l))) return el;
    }
    return null;
  }

  function isSelectedTab(tabEl) {
    if (!tabEl) return false;
    const aria = tabEl.getAttribute('aria-selected');
    if (aria === 'true') return true;
    // たまに selected クラス等のときもあるので保険
    return tabEl.matches('[aria-selected="true"]');
  }

  function forceFollowingOnce() {
    const following = findTabByLabel(FOLLOWING_LABELS);
    if (!following) return false;

    if (isSelectedTab(following)) return true;

    // すでに「おすすめ」が選択されてるなら上書きしたい
    const foryou = findTabByLabel(FORYOU_LABELS);
    if (foryou && isSelectedTab(foryou)) {
      following.click();
      return true;
    }

    // 「選択状態の取得」ができないUI変化に備えて、見つけたらとりあえずクリックするモード（穏当）
    // ※ただし連打しないように後段でクールダウン制御
    following.click();
    return true;
  }

  // 連打防止（ルーティングや再描画が多いので）
  let lastAction = 0;
  const COOLDOWN_MS = 1500;

  function tryForce() {
    const now = Date.now();
    if (now - lastAction < COOLDOWN_MS) return;

    const ok = forceFollowingOnce();
    if (ok) {
      lastAction = now;
      log('switched to Following');
    }
  }

  // 初回
  tryForce();

  // SPAなのでDOM変化を監視して、タブが描画されたら即座に切り替える
  const mo = new MutationObserver(() => tryForce());
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // pushState/replaceStateでも試す（ページ遷移→home復帰など）
  const _pushState = history.pushState;
  history.pushState = function () {
    _pushState.apply(this, arguments);
    setTimeout(tryForce, 0);
  };
  const _replaceState = history.replaceState;
  history.replaceState = function () {
    _replaceState.apply(this, arguments);
    setTimeout(tryForce, 0);
  };
  window.addEventListener('popstate', () => setTimeout(tryForce, 0));
})();
