// ==UserScript==
// @name         屏蔽广告弹窗
// @namespace    https://www.f2iclo.cn/
// @version      1.0.0
// @description  屏蔽网页广告弹窗并绕过检测机制
// @author       Quirrel-zh
// @supportURL   https://github.com/Quirrel-zh/removeuviewAD/issues
// @homepage     https://github.com/Quirrel-zh/removeuviewAD
// @match        https://uview-plus.jiangruyi.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555779/%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/555779/%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 1. 立即设置 localStorage 来绕过检查（最早执行）
  if (window.localStorage) {
    const expireTime = Math.floor(Date.now() / 1000) + 43200;
    localStorage.setItem('adExpire2', expireTime.toString());
  }

  // 2. 阻止页面被隐藏 - 拦截 style.opacity 的设置
  function protectDocumentOpacity() {
    // 等待 DOM 加载
    if (document.documentElement) {
      const htmlElement = document.documentElement;
      const originalStyleSetter = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style')?.set;
      
      // 拦截 style.opacity 的设置
      Object.defineProperty(htmlElement.style, 'opacity', {
        set: function(value) {
          if (value === '0' || value === 0 || value === '0') {
            // 阻止设置为 0
            return;
          }
          // 使用 CSSStyleDeclaration 的原生方法
          this.setProperty('opacity', value);
        },
        get: function() {
          const value = this.getPropertyValue('opacity');
          return value || '1';
        },
        configurable: true
      });
    } else {
      // 如果 documentElement 还不存在，延迟执行
      setTimeout(protectDocumentOpacity, 0);
    }
  }
  
  // 立即尝试保护
  protectDocumentOpacity();
  
  // 监听 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', protectDocumentOpacity);
  }

  // 3. 拦截 alert 函数，防止检测机制弹出警告
  const originalAlert = window.alert;
  window.alert = function() {
    // 只拦截包含特定关键词的 alert
    const args = Array.from(arguments);
    if (args.some(arg => typeof arg === 'string' && arg.includes('广告屏蔽器'))) {
      return;
    }
    return originalAlert.apply(this, arguments);
  };

  // 4. 阻止检测机制中的关键检查
  function blockDetection() {
    // 阻止 MutationObserver 检测
    const OriginalMutationObserver = window.MutationObserver;
    window.MutationObserver = function(callback) {
      const wrappedCallback = function(mutations, observer) {
        // 过滤掉对弹窗元素的检测
        const filteredMutations = mutations.filter(mutation => {
          if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes);
            return !addedNodes.some(node => {
              if (node.nodeType === 1) { // Element node
                return node.id === 'pleasePrNotCrack' || 
                       node.classList?.contains('v-modal') ||
                       node.classList?.contains('el-dialog__wrapper');
              }
              return false;
            });
          }
          return true;
        });
        if (filteredMutations.length > 0) {
          callback(filteredMutations, observer);
        }
      };
      return new OriginalMutationObserver(wrappedCallback);
    };
  }

  // 5. 移除或隐藏弹窗元素
  function removeAdDialog() {
    if (!document.body) {
      // 如果 body 还不存在，等待 DOM 加载
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAdDialog);
      } else {
        setTimeout(removeAdDialog, 100);
      }
      return;
    }

    // 使用 MutationObserver 监听弹窗出现并立即移除
    const observer = new MutationObserver(function(mutations) {
      // 移除所有弹窗元素（除了假元素）
      document.querySelectorAll('.v-modal, .el-dialog__wrapper, #pleasePrNotCrack').forEach(el => {
        const rect = el.getBoundingClientRect();
        // 如果元素不在屏幕外很远的地方（假元素在 -9999px），则移除
        if (rect.left > -5000) {
          el.remove();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 6. 阻止相关的 API 请求（可选，如果需要完全阻止）
  function blockAdApi() {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      if (typeof url === 'string' && url.includes('uiadmin.net/api/v1/wxapp/ad')) {
        // 阻止广告相关的 API 请求
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ code: 200, data: { isVip: true } }),
          text: () => Promise.resolve(JSON.stringify({ code: 200, data: { isVip: true } }))
        });
      }
      return originalFetch.apply(this, args);
    };

    // 拦截 axios 请求（如果使用 axios）
    if (window.axios) {
      const originalPost = window.axios.post;
      window.axios.post = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && url.includes('uiadmin.net/api/v1/wxapp/ad')) {
          return Promise.resolve({
            data: { code: 200, data: { isVip: true } }
          });
        }
        return originalPost.apply(this, args);
      };
    }
  }

  // 7. 阻止定时器检测
  function blockIntervalCheck() {
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay) {
      // 如果回调函数包含检测逻辑，则阻止执行
      const callbackStr = callback.toString();
      if (callbackStr.includes('checkDisplay') || 
          callbackStr.includes('checkVip') ||
          callbackStr.includes('pleasePrNotCrack')) {
        return null; // 返回 null 而不是定时器 ID
      }
      return originalSetInterval.apply(this, arguments);
    };
  }

  // 8. 创建假的弹窗元素来欺骗检测机制（如果检测机制需要元素存在）
  function createFakeDialog() {
    if (!document.body) {
      setTimeout(createFakeDialog, 100);
      return;
    }

    // 如果元素不存在，创建一个隐藏的假元素
    if (!document.getElementById('pleasePrNotCrack')) {
      const fakeDialog = document.createElement('div');
      fakeDialog.id = 'pleasePrNotCrack';
      fakeDialog.style.display = 'none';
      fakeDialog.style.visibility = 'hidden';
      fakeDialog.style.opacity = '0';
      fakeDialog.style.position = 'absolute';
      fakeDialog.style.left = '-9999px';
      fakeDialog.style.zIndex = '-9999';
      document.body.appendChild(fakeDialog);
    }

    // 确保 v-modal 和 el-dialog__wrapper 也存在但隐藏
    if (!document.querySelector('.v-modal')) {
      const fakeModal = document.createElement('div');
      fakeModal.className = 'v-modal';
      fakeModal.style.display = 'none';
      fakeModal.style.visibility = 'visible'; // 保持 visible 但 display 为 none
      fakeModal.style.position = 'absolute';
      fakeModal.style.left = '-9999px';
      fakeModal.style.zIndex = '2000'; // 正常的 z-index
      fakeModal.style.background = 'rgba(0, 0, 0, 0.5)'; // 正常的背景色
      document.body.appendChild(fakeModal);
    }

    if (!document.querySelector('.el-dialog__wrapper')) {
      const fakeWrapper = document.createElement('div');
      fakeWrapper.className = 'el-dialog__wrapper';
      fakeWrapper.style.display = 'none';
      fakeWrapper.style.visibility = 'visible';
      fakeWrapper.style.position = 'absolute';
      fakeWrapper.style.left = '-9999px';
      fakeWrapper.style.zIndex = '2001';
      document.body.appendChild(fakeWrapper);
    }
  }

  // 执行所有防护措施
  function initProtection() {
    blockDetection();
    removeAdDialog();
    blockAdApi();
    blockIntervalCheck();
    createFakeDialog();
    
    // 定期清理真实弹窗，但保留假元素
    setInterval(() => {
      if (document.body) {
        document.querySelectorAll('.v-modal, .el-dialog__wrapper, #pleasePrNotCrack').forEach(el => {
          const rect = el.getBoundingClientRect();
          // 如果元素不在屏幕外很远的地方（假元素在 -9999px），则移除
          if (rect.left > -5000) {
            el.remove();
          }
        });
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProtection);
  } else {
    initProtection();
  }

})();
