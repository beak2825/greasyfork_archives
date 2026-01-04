// ==UserScript==
// @name         Linux.do 主题链接新窗口打开
// @namespace    http://tampermonkey.net/
// @version      2025-09-09
// @description  让 linux.do 所有以 /t/topic 开头的链接在新窗口打开
// @author       Bear. Best
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548928/Linuxdo%20%E4%B8%BB%E9%A2%98%E9%93%BE%E6%8E%A5%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/548928/Linuxdo%20%E4%B8%BB%E9%A2%98%E9%93%BE%E6%8E%A5%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 处理所有符合条件的 a 标签
  function processTopicLinks() {
    const links = document.querySelectorAll('a[href^="/t/topic"]');
    links.forEach((link) => {
      if (!link.hasAttribute('data-processed')) {
        // 添加点击事件监听器，使用捕获阶段优先处理
        link.addEventListener(
          'click',
          function (event) {
            // 只处理左键点击，保留 Ctrl+点击、右键菜单等原生行为
            if (
              event.button === 0 &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.shiftKey
            ) {
              // 阻止默认行为和事件传播，防止 Discourse 的 JS 路由接管
              event.preventDefault();
              event.stopImmediatePropagation();

              // 获取链接地址并构建完整URL
              const href = this.getAttribute('href');
              const fullUrl = href.startsWith('http')
                ? href
                : `https://linux.do${href}`;

              // 强制在新窗口打开
              window.open(fullUrl, '_blank', 'noopener,noreferrer');

              console.log('在新窗口打开链接:', fullUrl);
            }
          },
          { capture: true },
        ); // 使用捕获阶段，确保在 Discourse 事件处理之前执行

        link.setAttribute('data-processed', 'true');
      }
    });
  }

  // 页面加载完成后处理
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processTopicLinks);
  } else {
    processTopicLinks();
  }

  // 监听DOM变化，处理动态加载的内容
  const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // 检查是否有新添加的节点包含 a 标签
        for (let node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (
              node.tagName === 'A' &&
              node.getAttribute('href')?.startsWith('/t/topic')
            ) {
              shouldProcess = true;
              break;
            } else if (
              node.querySelector &&
              node.querySelector('a[href^="/t/topic"]')
            ) {
              shouldProcess = true;
              break;
            }
          }
        }
      }
    });

    if (shouldProcess) {
      setTimeout(processTopicLinks, 100);
    }
  });

  // 开始观察DOM变化
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log('Linux.do 主题链接新窗口打开脚本已加载');
})();
