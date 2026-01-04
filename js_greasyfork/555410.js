// ==UserScript==
// @name         Chrome Local Network Access 自动修复
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动给 iframe 添加 allow="local-network-access *" 解决 Chrome 142 限制问题
// @author       白陀
// @match        https://*.lkcoffee.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555410/Chrome%20Local%20Network%20Access%20%E8%87%AA%E5%8A%A8%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/555410/Chrome%20Local%20Network%20Access%20%E8%87%AA%E5%8A%A8%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_PATH = '/web/login/wechat';
  let lastUrl = location.href;
  let timer = null;

  /** 判断当前 URL 是否匹配目标路径 */
  function isTargetUrl() {
    return location.pathname === TARGET_PATH;
  }

  /** URL 白名单 - 这些 URL 不需要添加 local-network-access */
  const URL_WHITELIST = [
    'https://lsop.lkcoffee.com/uflow',
  ];

  /** 检查 URL 是否在白名单中 */
  function isInWhitelist(url) {
    if (!url) return false;
    return URL_WHITELIST.some(whitelistUrl => url.includes(whitelistUrl));
  }

  /** 给 iframe 添加 allow="local-network-access *" */
  function addLocalNetworkAccessToIframes() {
    console.log('给 iframe 添加 allow="local-network-access *');
    document.querySelectorAll('iframe').forEach((iframe) => {
      const src = iframe.src || '';

      // 如果 src 在白名单中，跳过
      if (isInWhitelist(src)) {
        console.log(`跳过白名单 URL: ${src}`);
        return;
      }

      const hasAllow = iframe.getAttribute('allow') || '';

      // 如果已经包含 local-network-access，跳过
      if (!hasAllow.includes('local-network-access')) {
        const attrs = Array.from(iframe.attributes)
          .filter(attr => attr.name !== 'allow')
          .map(attr => `${attr.name}="${attr.value}"`)
          .join(' ');

        // 重建 iframe 元素
        const html = `<iframe allow="local-network-access *" ${attrs}>${iframe.innerHTML}</iframe>`;
        const wrapper = iframe.ownerDocument.createElement('div');
        wrapper.innerHTML = html;
        iframe.replaceWith(wrapper.firstElementChild);
      }
    });
  }

  /**
   * 检查 URL 并执行修复逻辑
   */
  function checkAndRun() {
    if (timer) clearTimeout(timer);

    if (!isTargetUrl()) return;

    console.log('检测到目标 URL，开始等待页面元素...');

    let elapsed = 0;
    const interval = 500; // 检测频率
    const maxWait = 5000; // 最多等5秒

    const watcher = setInterval(() => {
      elapsed += interval;
      const wxEl = document.getElementById('wx');

      if (wxEl) {
        console.log('检测到目标元素，开始执行 iframe 修改');
        clearInterval(watcher);
        addLocalNetworkAccessToIframes();
      } else if (elapsed >= maxWait) {
        console.warn('等待目标元素超时（5秒内未出现）');
        clearInterval(watcher);
      }
    }, interval);
  }

  /**
   * 监听 History API 变化（处理 SPA 应用）
   */
  function hookHistoryChange() {
    const wrap = (type) => {
      const orig = history[type];
      return function () {
        const rv = orig.apply(this, arguments);
        window.dispatchEvent(new Event('urlchange'));
        return rv;
      };
    };
    // 劫持 pushState 和 replaceState
    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');

    // 监听 popstate
    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('urlchange'));
    });
  }

  /**
   * 初始化脚本
   */
  function init() {
    // 页面加载时立即执行一次
    if (isTargetUrl()) {
      checkAndRun();
    } else {
      // 非目标页面延迟 2 秒执行
      setTimeout(() => {
        addLocalNetworkAccessToIframes();
      }, 2000);
    }

    // 监听 URL 变化（支持 SPA 应用）
    hookHistoryChange();
    window.addEventListener('urlchange', () => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        checkAndRun();
      }
    });
  }

  init();
})();
