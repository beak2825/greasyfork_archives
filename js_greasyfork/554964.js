// ==UserScript==
// @name         IEEE to Sci-Hub悬浮按钮
// @namespace    phzz
// @version      1.3.3
// @homepage     
// @description  在IEEE的文章页面/搜索页面，鼠标悬浮链接时，弹出跳转对应Sci-Hub链接的按钮
// @match        *://ieeexplore.ieee.org/*
// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/554964/IEEE%20to%20Sci-Hub%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/554964/IEEE%20to%20Sci-Hub%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

const defaultBaseURL = "https://sci-hub.se";
let sciHubBaseURL;

// Initialize configuration page
GM_config.init({
    'id': 'IEEE2SciHub',
    'title': 'Settings',
    'fields': {
        'UserDefinedBaseURL': {
            'label': 'Custom Sci-Hub URL',
            'type': 'text',
            'default': ''
        }
      }
});

(function () {
  'use strict';
    GM_registerMenuCommand("Settings", openSettingsPanel, "s");
    const userDefinedBaseURL = GM_config.get('UserDefinedBaseURL');
    
    if (userDefinedBaseURL.length != 0) {
        console.log('Load user-defined base URL');
        sciHubBaseURL = userDefinedBaseURL.trim();
    } else {
        console.log('Load default base URL');
        sciHubBaseURL = defaultBaseURL;
    }
    sciHubBaseURL += sciHubBaseURL.endsWith("/") ? "" : "/";

  // 美化按钮样式
  const style = document.createElement('style');
  style.innerHTML = `
    .sci-hub-tag {
      position: absolute;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: opacity 0.4s ease;
      opacity: 0.8;
      z-index: 9999;
      pointer-events: auto;
    }
    .sci-hub-tag:hover {
      transform: scale(1.05);
      opacity: 1;
      text-decoration: underline; /* 仅下划线 */
      color: white; /* 保持字体颜色不变 */
    }
    .sci-hub-fixed {
      position: fixed;
      bottom: 50px;
      right: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 18px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.3s ease, opacity 0.4s ease;
      opacity: 0.8;
      z-index: 9999;
    }
    .sci-hub-fixed:hover {
      transform: scale(1.05);
      opacity: 1;
      text-decoration: underline; /* 仅下划线 */
      color: white; /* 保持字体颜色不变 */
    }
  `;
  document.head.appendChild(style);

  const isSearchPage = window.location.href.includes('/search/');
  const isDocumentPage = window.location.href.includes('/document/');

  // search 页面功能
// if (isSearchPage || isDocumentPage) {
  let hideTimer = null;
  let currentLink = '';
  let docUrl = '';

  // 创建浮动标签元素
  const floatLabel = document.createElement('a');
  floatLabel.textContent = 'Sci-Hub';
  floatLabel.className = 'sci-hub-tag';
  document.body.appendChild(floatLabel);

  // 点击标签跳转
  //floatLabel.addEventListener('click', () => {
  //  if (currentLink) {
  //    window.open(currentLink, '_blank');
  //  }
  //});

  // 鼠标悬停事件
  document.addEventListener('mouseover', function (e) {
    const target = e.target.closest('a');
    if (!target) return;

    const url = target.href;
    const match = url.match(/^https:\/\/ieeexplore\.ieee\.org\/document\/\d+/);
    if (match) {
      docUrl = url;
      if (docUrl !== currentLink) {
      currentLink = sciHubBaseURL + url;

      // 设置位置：鼠标右上方 10px
      floatLabel.style.left = (e.pageX + 20) + 'px';
      floatLabel.style.top = (e.pageY - 30) + 'px';
      floatLabel.style.display = 'block';
      floatLabel.href = currentLink;
      floatLabel.target = '_blank';

      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    }}
  });

  // 鼠标移出后延迟隐藏
  document.addEventListener('mouseout', function (e) {
    const from = e.target;
    const to = e.relatedTarget;

    if ((from.closest && from.closest('a')) || from === floatLabel) {
      if (!to || (!to.closest || (!to.closest('a') && to !== floatLabel))) {
        hideTimer = setTimeout(() => {
          floatLabel.style.display = 'none';
        }, 2000);
      }
    }
  });
// }


  // document 页面右下角标签
  if (isDocumentPage) {
    const docMatch = window.location.href.match(/https:\/\/ieeexplore\.ieee\.org\/document\/\d+/);
    if (docMatch) {
      const fixedLink = document.createElement('a');
      fixedLink.className = 'sci-hub-fixed';
      fixedLink.textContent = 'Sci-Hub';
      fixedLink.href = sciHubBaseURL + docMatch[0];
      fixedLink.target = '_blank';
      document.body.appendChild(fixedLink);
    }
  }
})();

function openSettingsPanel() {
    GM_config.open();
}
