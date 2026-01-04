// ==UserScript==
// @name         在 Microsoft Loop 进度跟踪器中启用 Shift + 滚轮横向滚动。
// @namespace    https://loop.microsoft.com/
// @version      1.0
// @description  在 Microsoft Loop 网页中启用 Shift/Alt/Ctrl + 滚轮 横向滚动，专门处理 scriptor-paragraph 容器内的进度跟踪器表格
// @author       SaltcoreYan
// @license      MIT
// @match        https://loop.cloud.microsoft.com/*
// @match        https://loop.microsoft.com/*
// @match        https://loop.cloud.microsoft/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549855/%E5%9C%A8%20Microsoft%20Loop%20%E8%BF%9B%E5%BA%A6%E8%B7%9F%E8%B8%AA%E5%99%A8%E4%B8%AD%E5%90%AF%E7%94%A8%20Shift%20%2B%20%E6%BB%9A%E8%BD%AE%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/549855/%E5%9C%A8%20Microsoft%20Loop%20%E8%BF%9B%E5%BA%A6%E8%B7%9F%E8%B8%AA%E5%99%A8%E4%B8%AD%E5%90%AF%E7%94%A8%20Shift%20%2B%20%E6%BB%9A%E8%BD%AE%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8%E3%80%82.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MODIFIER = 'Shift'; // 可选: 'Shift' | 'Alt' | 'Ctrl'
  const SPEED = 1.0;        // 滚动速度系数

  function modifierPressed(e) {
    return MODIFIER === 'Shift' ? e.shiftKey :
           MODIFIER === 'Alt'   ? e.altKey   :
           MODIFIER === 'Ctrl'  ? e.ctrlKey  : false;
  }

  window.addEventListener('wheel', e => {
    if (!modifierPressed(e)) return;

    const delta = (e.deltaMode === 1 ? e.deltaY * 16 :
                  e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY) * SPEED;

    const sb = e.target.closest('[data-automation-id="table-custom-horizontal-scroll"]')
            || document.querySelector('[data-automation-id="table-custom-horizontal-scroll"]');

    if (sb) {
      e.preventDefault();
      e.stopPropagation();
      const max = sb.scrollWidth - sb.clientWidth;
      const next = Math.max(0, Math.min(sb.scrollLeft + delta, max));
      sb.scrollLeft = next;
      sb.dispatchEvent(new Event('scroll', { bubbles: true })); // 关键：触发 Loop 内部同步
    }
  }, { passive: false, capture: true });

})();