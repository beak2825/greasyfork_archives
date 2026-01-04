// ==UserScript==
// @name         飞书多维表格人员字段默认不通知
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  去掉多维表格的人员字段下拉菜单的默认通知勾选
// @author       Austin.Young
// @match        https://*.feishu.cn/base/*
// @match        https://*.feishu.cn/wiki/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556186/%E9%A3%9E%E4%B9%A6%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%E4%BA%BA%E5%91%98%E5%AD%97%E6%AE%B5%E9%BB%98%E8%AE%A4%E4%B8%8D%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/556186/%E9%A3%9E%E4%B9%A6%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%E4%BA%BA%E5%91%98%E5%AD%97%E6%AE%B5%E9%BB%98%E8%AE%A4%E4%B8%8D%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==
const observer = new MutationObserver((mutationsList) => {
  // 遍历所有发生的 DOM 变化
  for (const mutation of mutationsList) {
    // 只关注“子元素新增”的变化（过滤其他类型的变化，如属性修改）
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // 遍历新增的节点
      mutation.addedNodes.forEach((node) => {
        // 检查新增节点是否是 DIV，且包含 class="mention-checkbox-wrapper"
        if (
          node.nodeType === 1 && // 确保是元素节点（不是文本/注释节点）
          node.tagName === 'DIV' && // 确保是 DIV 标签
          node.classList.contains('mention-checkbox-wrapper') // 检查是否包含目标类名
        ) {
          // 找到目标元素，执行你的处理逻辑
          node.style.border = '1px solid red'; // 标注边框
          uncheckObj(node)
        }
      });
    }
  }
});
// 关注卡片
const observer2 = new MutationObserver((mutationsList) => {
  // 遍历所有发生的 DOM 变化
  for (const mutation of mutationsList) {
    // 只关注“子元素新增”的变化（过滤其他类型的变化，如属性修改）
    if (mutation.type === 'childList') {
      mutation.removedNodes.forEach((node) => {
        if (
          node.nodeType === 1 && // 确保是元素节点（不是文本/注释节点）
          node.tagName === 'DIV' && // 确保是 DIV 标签
          node.classList.contains('bitable-drawer-card') // 检查是否包含目标类名
        ) {
          //  移除了
          observer.unobserve(node)
        }
      });
       mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === 1 && // 确保是元素节点（不是文本/注释节点）
          node.tagName === 'DIV' && // 确保是 DIV 标签
          node.classList.contains('bitable-drawer-card') // 检查是否包含目标类名
        ) {
          // 增加了
            observer.observe(node, config);
        }
      });
    }
  }
});
// 3. 配置监听选项：监控子元素的新增/删除
const config = {
  childList: true, // 监控子元素变化（新增/删除）
  subtree: true, // 同时监控所有后代元素（不仅是直接子元素）
  attributes: false, // 不需要监控属性变化（可关闭提升性能）
  characterData: false // 不需要监控文本变化
};
const config2 = {
  childList: true, // 监控子元素变化（新增/删除）
  subtree: false, // 子元素
  attributes: false, // 不需要监控属性变化（可关闭提升性能）
  characterData: false // 不需要监控文本变化
};
(function() {
    'use strict';
    // 多维表格界面
     (async () => {
        const result = await waitForMultipleEditors(document,'#bitable-container',20000,1000); //
        if (result) {
            // 监控输入界面的用户下拉框
            observer.observe(result, config);
            // 监控卡片是否出现
            let biTable = document.getElementById('bitable')
            observer2.observe(biTable, config2);
        }
    })();
})();

async function uncheckObj(obj){
    const checkbox = await waitForMultipleEditors(obj,'input',5000,100);
    if (checkbox) {
        if(checkbox.checked){
            checkbox.click();
            //console.error(checkbox)
        }
    }
}
// 带参数的函数定义
async function waitForMultipleEditors(root,classPath, timeout = 20000,interval = 1000) {
  let start = Date.now();
  while (Date.now() - start < timeout) {
    let obj = root.querySelector(classPath)
    if (obj) return obj;
    await new Promise(r => setTimeout(r, interval));
  }
  return null;
}
