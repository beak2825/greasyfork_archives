// ==UserScript==
// @name         Steamtool清单下载
// @namespace    http://tampermonkey.net/
// @version      2025-12-04
// @description  在Steam游戏页面添加下载按钮，在当前页直接下载文件用于steamtool
// @author       You
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557983/Steamtool%E6%B8%85%E5%8D%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/557983/Steamtool%E6%B8%85%E5%8D%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 提取游戏ID
  function extractAppId () {
    const url = window.location.href;
    const match = url.match(/\/app\/(\d+)\//);
    return match ? match[1] : null;
  }

  // 创建并插入下载按钮
  function createDownloadButton (appId) {
    // 查找合适的位置插入按钮 - 通常在游戏标题附近
    const titleElement = document.querySelector('.apphub_AppName');
    if (!titleElement) return;

    // 创建按钮元素
    const button = document.createElement('button');
    button.textContent = '下载游戏文件';
    button.style.cssText = `
            display: inline-block;
            background-color: #1b2838;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            margin: 15px 0px;
            border: 1px solid #34495e;
            cursor: pointer;
        `;
    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = '#2a3f5a';
    });
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = '#1b2838';
    });

    // 添加点击事件处理程序
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const downloadUrl = `https://github.com/wmn1525/ManifestHub/archive/refs/heads/${appId}.zip`;
      const filename = `${appId}.zip`;

      // 使用GM_download进行直接下载
      if (typeof GM_download !== 'undefined') {
        GM_download({
          url: downloadUrl,
          name: filename,
          onload: function () {
            console.log('下载完成');
          },
          onerror: function () {
            console.error('下载失败');
            // 备用方案：在新窗口打开链接
            window.open(downloadUrl, '_blank');
          }
        });
      } else {
        // 如果GM_download不可用，则在新窗口打开链接
        window.open(downloadUrl, '_blank');
      }
    });

    // 插入按钮到标题旁边
    titleElement.parentNode.insertBefore(button, titleElement.nextSibling);
  }

  // 主函数
  function main () {
    const appId = extractAppId();
    if (appId) {
      // 等待页面加载完成后再插入按钮
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => createDownloadButton(appId));
      } else {
        createDownloadButton(appId);
      }
    }
  }

  // 执行主函数
  main();
})();