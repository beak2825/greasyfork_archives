// ==UserScript==
// @name         [銀河奶牛]換玩家皮＋戰敗CG
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  替換玩家角色的圖（戰鬥/待機同圖），復活顯示自訂CG；內建防止DOM監聽風暴；縮圖自適應方框（contain/cover可選）。
// @match        https://www.milkywayidle.com/*
// @match        https://milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552621/%5B%E9%8A%80%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%8F%9B%E7%8E%A9%E5%AE%B6%E7%9A%AE%EF%BC%8B%E6%88%B0%E6%95%97CG.user.js
// @updateURL https://update.greasyfork.org/scripts/552621/%5B%E9%8A%80%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%8F%9B%E7%8E%A9%E5%AE%B6%E7%9A%AE%EF%BC%8B%E6%88%B0%E6%95%97CG.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ======== 你可修改的設定 ========
  // 玩家待機/戰鬥：同一張圖
  const PLAYER_IMG_URL = 'https://stickershop.line-scdn.net/stickershop/v1/product/868/LINEStorePC/main.png';
  // 玩家復活/戰敗 CG（可與上面同圖）
  const reviveImageUrl = 'https://tupian.li/images/2025/04/18/6801c297a15ef.gif';

  // 縮圖模式：'contain'（等比塞進方框）或 'cover'（滿版鋪滿、可能裁切）
  const MWI_FIT_MODE = 'contain';
  // 進一步整體縮放（0.85 會略縮小一點，1 為原尺寸）
  const MWI_SCALE = 1;

  // ======== 類名（如日後變動，請調整這裡） ========
  const CLS_UNIT = '.CombatUnit_combatUnit__1m3XT';
  const CLS_MODEL = '.CombatUnit_model__2qQML';
  const CLS_REVIVE_OVERLAY = '.CountdownOverlay_countdownOverlay__2QRmL';

  // 待機畫面可能的容器（可按實際DOM調整/增減）
  const IDLE_SELECTORS = [
    '[class*="Paperdoll" i] [class*="model" i]',
    '[class*="Player" i] [class*="model" i]',
    '[class*="Character" i] [class*="model" i]',
    '[class*="Avatar" i]',
    'img[alt*="Avatar" i]'
  ];

  // ======== 樣式（統一縮圖、自適應盒） ========
  const style = document.createElement('style');
  style.textContent = `
    .mwi-box{
      width:100%;height:100%;
      display:flex;align-items:center;justify-content:center;
      overflow:hidden; /* 不讓圖片外溢 */
    }
    .mwi-img{
      width:100%;height:100%;
      object-fit:${MWI_FIT_MODE};
      object-position:center center;
      max-width:100%;max-height:100%;
      transform: scale(${MWI_SCALE});
      transform-origin:center;
      image-rendering:auto;
    }
  `;
  document.documentElement.appendChild(style);

  // ======== 旗標與重入鎖 ========
  let isPatching = false; // 防重入
  const FLAG_PLAYER = 'data-mwi-player'; // 已處理標記

  function withObserverPaused(fn) {
    isPatching = true;
    try { fn(); } finally {
      // 放到下一個宏任務再解除，避免同批次變更被抓到
      setTimeout(() => { isPatching = false; }, 0);
    }
  }

  // 建立玩家盒子HTML
  function playerBoxHTML(src, alt) {
    return (
      '<div class="mwi-box">' +
      '  <img class="mwi-img" src="' + src + '" alt="' + (alt || 'player') + '">' +
      '</div>'
    );
  }

  // 在「一個根節點」範圍內處理玩家替換
  function processRoot(root) {
    if (!root || root.nodeType !== 1) return;

    // —— 戰鬥畫面：存在 CombatUnit —— //
    const playerUnit = root.querySelector(CLS_UNIT);
    if (playerUnit) {
      const model = playerUnit.querySelector(CLS_MODEL);
      if (!model) return;

      const revive = playerUnit.querySelector(CLS_REVIVE_OVERLAY);
      const wantHTML = playerBoxHTML(revive ? reviveImageUrl : PLAYER_IMG_URL, revive ? 'reviving' : 'player');

      // 若內容相同就不改，避免觸發 observer
      if (model.getAttribute(FLAG_PLAYER) === '1' && model.dataset.mwiHash === wantHTML) return;

      withObserverPaused(() => {
        model.innerHTML = wantHTML;
        model.setAttribute(FLAG_PLAYER, '1');
        model.dataset.mwiHash = wantHTML;
      });
      return; // 在戰鬥畫面就不處理待機
    }

    // —— 待機畫面：找可能的容器 —— //
    let idleModel = null;
    for (let i = 0; i < IDLE_SELECTORS.length && !idleModel; i++) {
      const sel = IDLE_SELECTORS[i];
      // root 本身可能就是容器，否則在其下查找
      const el = (root.matches && root.matches(sel)) ? root : root.querySelector(sel);
      if (el) idleModel = el;
    }
    if (!idleModel) return;

    const wantHTML = playerBoxHTML(PLAYER_IMG_URL, 'idle');
    if (idleModel.getAttribute(FLAG_PLAYER) === '1' && idleModel.dataset.mwiHash === wantHTML) return;

    withObserverPaused(() => {
      idleModel.innerHTML = wantHTML;
      idleModel.setAttribute(FLAG_PLAYER, '1');
      idleModel.dataset.mwiHash = wantHTML;
    });
  }

  // 只處理「新增節點」與「class 變更」即可
  const observer = new MutationObserver(muts => {
    if (isPatching) return;
    for (const m of muts) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(n => { if (n.nodeType === 1) processRoot(n); });
      }
      if (m.type === 'attributes' && m.attributeName === 'class') {
        const node = m.target;
        if (node && node.nodeType === 1) processRoot(node);
      }
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  // 初次與保險定時器（降頻，避免打架）
  setTimeout(() => processRoot(document.body), 400);
  setInterval(() => processRoot(document.body), 1200);
})();
