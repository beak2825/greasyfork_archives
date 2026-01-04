// ==UserScript==
// @name         百度网盘PDF不限速下载150M
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用法：百度网盘网页上打开PDF文件，新页面右上角生成下载按钮。效果：此下载利用PDF预览时发出的请求，不限速下载150M以内的PDF文件。其他文件可以通过改后缀获得不限速。
// @author       betterer(不死の祥云)
// @match        https://pan.baidu.com/pfile/docview*
// @grant        none
// @license      GPL-3.0-only
// @licenseURL   https://www.gnu.org/licenses/gpl-3.0.html
// @downloadURL https://update.greasyfork.org/scripts/554213/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98PDF%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD150M.user.js
// @updateURL https://update.greasyfork.org/scripts/554213/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98PDF%E4%B8%8D%E9%99%90%E9%80%9F%E4%B8%8B%E8%BD%BD150M.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LOG_PREFIX = '🚀[百度网盘PDF脚本]';
  console.log(`${LOG_PREFIX} 脚本开始执行`);

  // 创建按钮
  const button = document.createElement('button');
  button.innerText = '百度网盘PDF不限速下载150M';
  button.style.position = 'fixed';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.zIndex = '1000';
  button.style.padding = '10px';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';

  document.body.appendChild(button);
  console.log(`${LOG_PREFIX} 按钮已创建并添加到页面`);

  // 点击按钮的事件处理函数
  button.addEventListener('click', async () => {
    console.log(`${LOG_PREFIX} 按钮被点击，开始寻找PDF请求（需包含origin=pdf和timestamp）...`);

    // 禁用按钮防止重复点击
    button.disabled = true;
    button.innerText = '寻找PDF请求中...';
    button.style.backgroundColor = '#FF9800';

    const {performance} = window;

    // 先检查是否已经有符合条件的请求
    let entries = performance.getEntriesByType('resource');
    console.log(`${LOG_PREFIX} 当前共有 ${entries.length} 个网络请求`);

    // 查找已有的符合条件的请求
    const existingPdfRequest = findFirstValidPdfRequest(entries);

    if (existingPdfRequest) {
      console.log(`${LOG_PREFIX} 找到已存在的符合条件的PDF请求`);
      openPdfRequest(existingPdfRequest);
      resetButton();
      return;
    }

    console.log(`${LOG_PREFIX} 未找到现有符合条件的PDF请求，开始监听新请求...`);

    // 设置超时时间（30秒）
    const timeout = setTimeout(() => {
      console.log(`${LOG_PREFIX} ❌ 等待PDF请求超时`);
      alert('等待PDF请求超时，请确保已打开PDF文件预览。');
      resetButton();
    }, 30000);

    // 监听新的网络请求
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        try {
          const url = new URL(entry.name);
          const params = new URLSearchParams(url.search);

          // 检查是否同时包含origin=pdf和timestamp参数
          if (params.has('origin') && params.get('origin') === 'pdf' && params.has('timestamp')) {
            console.log(`${LOG_PREFIX} ✅ 检测到新的符合条件的PDF请求`);
            clearTimeout(timeout);
            observer.disconnect();
            openPdfRequest(entry);
            resetButton();
          }
        } catch (e) {
          // URL解析失败，忽略此请求
        }
      });
    });

    // 开始观察资源请求
    observer.observe({entryTypes: ['resource']});
    console.log(`${LOG_PREFIX} ⏳ 开始监听新的PDF请求（需包含origin=pdf和timestamp）...`);
  });

  // 查找第一个同时包含origin=pdf和timestamp的请求
  function findFirstValidPdfRequest(entries) {
    for (const entry of entries) {
      try {
        const url = new URL(entry.name);
        const params = new URLSearchParams(url.search);

        // 检查是否同时包含origin=pdf和timestamp参数
        if (params.has('origin') && params.get('origin') === 'pdf' && params.has('timestamp')) {
          console.log(`${LOG_PREFIX} 找到符合条件的PDF请求: ${entry.name}`);
          return entry;
        }
      } catch (e) {
        // URL解析失败，继续下一个
      }
    }
    return null;
  }

  // 打开PDF请求
  function openPdfRequest(entry) {
    const originalUrl = entry.name;
    console.log(`${LOG_PREFIX} 🔗 原始PDF URL: ${originalUrl}`);

    // 解析URL并显示参数信息
    try {
      const url = new URL(originalUrl);
      const params = new URLSearchParams(url.search);

      console.log(`${LOG_PREFIX} 📊 URL参数分析:`);
      console.log(`${LOG_PREFIX}   origin=${params.get('origin')}`);
      console.log(`${LOG_PREFIX}   timestamp=${params.get('timestamp')}`);
      console.log(`${LOG_PREFIX} 🚀 正在打开PDF链接...`);

      window.open(originalUrl, '_blank');
      console.log(`${LOG_PREFIX} ✅ PDF链接已在新标签页打开`);

    } catch (error) {
      console.log(`${LOG_PREFIX} ❌ URL解析错误: ${error}`);
      // 如果解析失败，直接使用原始URL
      window.open(originalUrl, '_blank');
    }
  }

  // 重置按钮状态
  function resetButton() {
    button.disabled = false;
    button.innerText = '百度网盘PDF不限速下载150M';
    button.style.backgroundColor = '#4CAF50';
    console.log(`${LOG_PREFIX} 🔄 按钮状态已重置`);
  }

  console.log(`${LOG_PREFIX} ✅ 脚本初始化完成，等待用户点击按钮...`);
})();
