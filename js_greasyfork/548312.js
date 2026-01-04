// ==UserScript==
// @name         清除TAPD人员上限弹窗
// @name:zh-CN   清除TAPD人员上限弹窗
// @namespace    http://tampermonkey.net/
// @version      1.23
// @description  无感知清除TAPD人员上限弹窗
// @description:zh-CN  无感知清除TAPD人员上限弹窗
// @author       yonlin
// @match        *://*.tapd.cn/*
// @icon         https://www.tapd.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548312/%E6%B8%85%E9%99%A4TAPD%E4%BA%BA%E5%91%98%E4%B8%8A%E9%99%90%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/548312/%E6%B8%85%E9%99%A4TAPD%E4%BA%BA%E5%91%98%E4%B8%8A%E9%99%90%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("清除TAPD弹窗脚本已启动");

  // 要移除的元素选择器
  const MODAL_SELECTOR = ".v-modal";
  const DIALOG_SELECTOR = ".company-renew-dialog";

  // 移除元素的函数
  function removeElement(selector) {
    const element = document.querySelector(selector);
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
      console.log(`已移除元素: ${selector}`);
      return true;
    }
    return false;
  }

  // 初始检查并移除已存在的弹窗
  removeElement(MODAL_SELECTOR);
  removeElement(DIALOG_SELECTOR);

  // 使用MutationObserver监听DOM变化，更高效地检测新出现的弹窗
  const observer = new MutationObserver((mutations) => {
    // 标记是否需要执行移除操作
    let needRemove = false;

    // 检查是否有DOM变化可能导致弹窗出现
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        needRemove = true;
      }
    });

    // 如果有变化，执行移除操作
    if (needRemove) {
      removeElement(MODAL_SELECTOR);
      removeElement(DIALOG_SELECTOR);
    }
  });

  // 配置并启动观察者
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });

  // 页面卸载时停止观察
  window.addEventListener('unload', () => {
    observer.disconnect();
  });

})();