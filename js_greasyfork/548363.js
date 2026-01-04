// ==UserScript==
// @name         防止BiliBili直播间自动挡我的世界区的聊天框
// @version      1.0
// @description  自动移除 live.bilibili.com 上 id 为 web-player-module-area-mask-panel 的遮罩元素并防止重建
// @author       mjiangmc
// @match        https://live.bilibili.com/*
// @match        http://live.bilibili.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @namespace https://greasyfork.org/users/1511843
// @downloadURL https://update.greasyfork.org/scripts/548363/%E9%98%B2%E6%AD%A2BiliBili%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%8C%A1%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E5%8C%BA%E7%9A%84%E8%81%8A%E5%A4%A9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/548363/%E9%98%B2%E6%AD%A2BiliBili%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%8C%A1%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E5%8C%BA%E7%9A%84%E8%81%8A%E5%A4%A9%E6%A1%86.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 注入 CSS 以尽量避免闪烁（当元素短暂存在时直接隐藏）
  const style = document.createElement('style');
  style.textContent = `
    #web-player-module-area-mask-panel { display: none !important; visibility: hidden !important; pointer-events: none !important; }
    /* 以防类名相同的子元素影响展示，可按需扩展 */
  `;
  document.head && document.head.appendChild(style);

  // 移除目标元素函数
  function removeMask() {
    try {
      const el = document.getElementById('web-player-module-area-mask-panel');
      if (el) {
        el.remove();
        console.log('[Tampermonkey] 已移除 web-player-module-area-mask-panel');
      }
      // 另外尝试通过 querySelector 移除可能嵌套的相同 id 元素（极端情况）
      const el2 = document.querySelector('#web-player-module-area-mask-panel');
      if (el2) {
        el2.remove();
        console.log('[Tampermonkey] 通过 querySelector 再次移除');
      }
    } catch (e) {
      console.warn('[Tampermonkey] 移除遮罩时出错：', e);
    }
  }

  // 立即尝试一次
  removeMask();

  // 使用 MutationObserver 持续监控新增节点（防止页面脚本重建该元素）
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      // 若有新节点被添加，检查是否目标或包含目标
      for (const node of m.addedNodes) {
        if (node && node.nodeType === 1) {
          if (node.id === 'web-player-module-area-mask-panel' || node.querySelector && node.querySelector('#web-player-module-area-mask-panel')) {
            removeMask();
            // 不 return，继续检查其它 mutation
          }
        }
      }
    }
  });

  // 开始观察整个文档树
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // 作为保险，定期检查（短时间内保证被移除），成功后可以清除定时器
  const fallbackInterval = setInterval(() => {
    const exists = document.getElementById('web-player-module-area-mask-panel');
    if (exists) {
      removeMask();
    } else {
      // 如果连续多次检查都不存在，可以选择停止定时器以节省资源
      // 这里我们在找到不存在后仍停止定时器（可根据需要注释掉）
      clearInterval(fallbackInterval);
    }
  }, 1000);

  // 可选：在页面卸载时断开 observer（稳妥）
  window.addEventListener('beforeunload', () => {
    try { observer.disconnect(); } catch (e) {}
  });
})();
