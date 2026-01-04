// ==UserScript==
// @name         Aggressive ajaxOrder injector
// @namespace    https://github.com/Komar1Ch1ka
// @version      0.6
// @match        https://moodle.scnu.edu.cn/mod/fsresource/*
// @grant        none
// @run-at       document-start
// @author       t1ara
// @description   去你的lry 帮助计算机学子快速看完砺儒云的视频 点一下播放几秒就能看完了
// @language     JavaScript
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552170/Aggressive%20ajaxOrder%20injector.user.js
// @updateURL https://update.greasyfork.org/scripts/552170/Aggressive%20ajaxOrder%20injector.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ----------------------------
  // 1️⃣ 注入/包装 TCPlayerWrapper.ajaxOrder（在函数最前面设置 this.viewTotalTime）
  // ----------------------------
  function wrapAjaxOrder() {
    if (typeof TCPlayerWrapper === 'undefined') return false;

    const proto = TCPlayerWrapper.prototype;
    if (!proto.__ajaxOrderWrapped) {
      const orig = proto.ajaxOrder;
      if (typeof orig === 'function') {
        proto.ajaxOrder = function(...args) {
          try { this.viewTotalTime = 99999; } catch(e) {}
          return orig.apply(this, args);
        };
        proto.__ajaxOrderWrapped = true;
        console.log('[inject] TCPlayerWrapper.ajaxOrder wrapped successfully');
      }
    }
    return true;
  }

  let tries = 0;
  const maxTries = 50;
  const wrapInterval = setInterval(() => {
    tries++;
    if (wrapAjaxOrder() || tries > maxTries) {
      clearInterval(wrapInterval);
    }
  }, 200);

  // ----------------------------
  // 2️⃣ 循环点击播放按钮（同时匹配 paused 与 playing 两种状态）
  // ----------------------------
  // 两种状态的 selector，逗号分隔
  const BUTTON_SELECTOR = 'button.vjs-play-control.vjs-control.vjs-button.vjs-paused, button.vjs-play-control.vjs-control.vjs-button.vjs-playing';
  const CLICK_TIMES = 200; // 每个按钮点击次数（根据需要调整）
  const CLICK_INTERVAL = 50; // 每次扫描并点击的间隔（毫秒）
  const POLL_TIMEOUT = 5 * 60 * 1000; // 最多跑 5 分钟后自动停止（防止无限运行）

  const clickedMap = new WeakMap();
  let totalStart = Date.now();

  function getAllButtons() {
    try {
      return Array.from(document.querySelectorAll(BUTTON_SELECTOR));
    } catch (e) {
      return [];
    }
  }

  function clickButtonsOnce() {
    const buttons = getAllButtons();
    buttons.forEach(btn => {
      let count = clickedMap.get(btn) || 0;
      if (count < CLICK_TIMES) {
        // 尝试模拟真实点击：focus -> click
        try {
          btn.focus && btn.focus();
          btn.click();
        } catch (e) {
          try { btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); } catch(_) {}
        }
        clickedMap.set(btn, count + 1);
        // 少量日志，避免太多输出
        if ((count + 1) % 10 === 0) {
          console.log(`[inject] 按钮已被点击 ${count + 1} 次（单个按钮）`);
        }
      }
    });
  }

  const clickTimer = setInterval(() => {
    // 超时停止
    if (Date.now() - totalStart > POLL_TIMEOUT) {
      console.log('[inject] 点击脚本已达到最长运行时间，停止。');
      clearInterval(clickTimer);
      return;
    }

    clickButtonsOnce();

    // 判断是否全部完成
    const buttons = getAllButtons();
    if (buttons.length === 0) return; // 还没出现按钮，继续等待

    const allDone = buttons.every(btn => (clickedMap.get(btn) || 0) >= CLICK_TIMES);
    if (allDone) {
      console.log('[inject] 所有按钮达到目标点击次数，停止脚本。');
      clearInterval(clickTimer);
    }
  }, CLICK_INTERVAL);

  // 若页面动态加载按钮，定期确保 wrap 仍有效（防止页面热更新替换类）
  setInterval(() => {
    try { wrapAjaxOrder(); } catch(e) {}
  }, 2000);

})();