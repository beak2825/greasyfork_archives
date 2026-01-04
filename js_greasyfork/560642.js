// ==UserScript==
// @name         Bilibili 推荐区随机播放
// @namespace    https://bilibili.com/
// @version      3.2.0
// @description  动词式按钮 + 绿实心 / 红边框 语义
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560642/Bilibili%20%E6%8E%A8%E8%8D%90%E5%8C%BA%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/560642/Bilibili%20%E6%8E%A8%E8%8D%90%E5%8C%BA%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /***********************
   * 播放状态定义
   ***********************/
  const State = {
    PLAYING_SINGLE: 'PLAYING_SINGLE',
    PLAYING_SUB: 'PLAYING_SUB',
    PLAYING_SUB_LAST: 'PLAYING_SUB_LAST',
  };

  /***********************
   * 全局状态
   ***********************/
  let randomEnabled = false;
  let batchRotateEnabled = false;

  let playedInBatch = 0;
  let minQuota = 2;
  let maxQuota = 5;

  let lastBatchIndex = -1;
  let observer = null;

  /***********************
   * 状态判定
   ***********************/
  function getPlayState() {
    const activeSub = document.querySelector(
      '.page-list.simple .page-item.sub.active'
    );
    if (!activeSub) return State.PLAYING_SINGLE;

    let next = activeSub.nextElementSibling;
    while (next) {
      if (next.classList.contains('sub')) return State.PLAYING_SUB;
      next = next.nextElementSibling;
    }
    return State.PLAYING_SUB_LAST;
  }

  /***********************
   * 推荐区工具
   ***********************/
  function getVideoItems() {
    return document.querySelectorAll(
      '#mirror-vdcon div.video-pod__body > div > div'
    );
  }

  function getBatchButtons() {
    return document.querySelectorAll(
      '#mirror-vdcon div.video-pod__slide .slide-inner > div'
    );
  }

  function hasBatch() {
    return getBatchButtons().length > 1;
  }

  /***********************
   * 随机播放
   ***********************/
  function playRandomInCurrentBatch() {
    const items = getVideoItems();
    if (!items.length) return;
    const pick = items[Math.floor(Math.random() * items.length)];
    const title = pick.querySelector('div.title');
    title && title.click();
  }

  /***********************
   * 批次切换
   ***********************/
  function switchBatch() {
    const batches = Array.from(getBatchButtons());
    if (batches.length <= 1) return;

    const candidates = batches
      .map((_, i) => i)
      .filter(i => i !== lastBatchIndex);

    const nextIndex =
      candidates[Math.floor(Math.random() * candidates.length)];

    lastBatchIndex = nextIndex;
    playedInBatch = 0;
    batches[nextIndex].click();
  }

  /***********************
   * 配额判断
   ***********************/
  function shouldSwitchBatch() {
    if (!batchRotateEnabled || !hasBatch()) return false;
    if (playedInBatch < minQuota) return false;
    if (playedInBatch >= maxQuota) return true;

    const progress =
      (playedInBatch - minQuota + 1) / (maxQuota - minQuota + 1);
    return Math.random() < progress;
  }

  /***********************
   * ended：状态机驱动
   ***********************/
  function bindEnded() {
    const video = document.querySelector('video');
    if (!video || video.__fm_bound) return;
    video.__fm_bound = true;

    video.addEventListener(
      'ended',
      (e) => {
        if (!randomEnabled) return;
        const state = getPlayState();
        if (state === State.PLAYING_SUB) return;

        e.stopImmediatePropagation();
        video.pause();
        playedInBatch++;

        setTimeout(() => {
          if (shouldSwitchBatch()) {
            switchBatch();
            setTimeout(playRandomInCurrentBatch, 400);
          } else {
            playRandomInCurrentBatch();
          }
        }, 300);
      },
      true
    );
  }

  /***********************
   * UI 样式工具（新规则）
   ***********************/
  function styleActionButton(btn, willEnable) {
    if (willEnable) {
      // 🟢 即将开启
      btn.style.background = '#4CAF50';
      btn.style.color = '#F1F2F3';
      btn.style.border = '2px solid transparent';
    } else {
      // 🔴 即将关闭
      btn.style.background = '#F1F2F3';
      btn.style.color = '#E53935';
      btn.style.border = '2px solid #E53935';
    }
  }

  /***********************
   * 控制栏 UI
   ***********************/
  function createBar() {
    if (document.querySelector('#fm-random-bar')) return;

    const anchor = document.querySelector(
      '#mirror-vdcon > div.right-container > div > div.rcmd-tab > div.video-pod.video-pod > div.video-pod__header > div.header-bottom'
    );
    if (!anchor) return;

    const bar = document.createElement('div');
    bar.id = 'fm-random-bar';
    bar.style.cssText = 'display:flex;gap:8px;margin-top:8px;';

    const btn = () => {
      const b = document.createElement('button');
        b.style.cssText =
            'padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:500;';
      return b;
    };

    const randomBtn = btn();
    const toggleRandom = btn();
    const toggleBatch = btn();

    /* 手动随机 */
    randomBtn.textContent = '随机播放';
    randomBtn.style.background = '#FF5722';
    randomBtn.style.color = '#fff';
    randomBtn.style.border = 'none';
    randomBtn.onclick = playRandomInCurrentBatch;

    /* 随机总开关 */
    function updateRandomUI() {
      toggleRandom.textContent = randomEnabled ? '关闭随机' : '开启随机';
      styleActionButton(toggleRandom, !randomEnabled);
    }
    toggleRandom.onclick = () => {
      randomEnabled = !randomEnabled;
      updateRandomUI();
    };

    /* 跨批次开关 */
    function updateBatchUI() {
      toggleBatch.textContent = batchRotateEnabled
        ? '关闭跨批次'
        : '开启跨批次';
      styleActionButton(toggleBatch, !batchRotateEnabled);
    }
    toggleBatch.onclick = () => {
      batchRotateEnabled = !batchRotateEnabled;
      updateBatchUI();
    };

    updateRandomUI();
    updateBatchUI();

    bar.append(randomBtn, toggleRandom);
    if (hasBatch()) bar.append(toggleBatch);

    anchor.parentNode.insertBefore(bar, anchor.nextSibling);
  }

  /***********************
   * SPA 监听
   ***********************/
  function startObserver() {
    observer && observer.disconnect();
    observer = new MutationObserver(() => {
      createBar();
      bindEnded();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  setTimeout(startObserver, 2000);
})();
