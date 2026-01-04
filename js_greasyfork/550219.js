// ==UserScript==
// @name         测试页面加载速度
// @namespace    https://viayoo.com/
// @version      4.2
// @license      MIT
// @description  精密加载耗时分析器（DOMContentLoaded+首次可视时间+内容完全可见时间）
// @author       ChatGPT & Grok & DeepSeek
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550219/%E6%B5%8B%E8%AF%95%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/550219/%E6%B5%8B%E8%AF%95%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let currentDuration = null;
  let domContentLoadedTime = null;
  let fcp = null, lcp = null;

  const getLoadDuration = () => {
    const [navEntry] = performance.getEntriesByType('navigation');
    return navEntry ? navEntry.duration : null;
  };

  const getDomContentLoadedTime = () => {
    const [navEntry] = performance.getEntriesByType('navigation');
    return (navEntry && navEntry.domContentLoadedEventEnd) || null;
  };

  const truncateDecimals = (num, decimals) => {
    const factor = Math.pow(10, decimals);
    return Math.floor(num * factor) / factor;
  };
  
  const formatTime = (time) => {
    if (time >= 10000) {
      return `${truncateDecimals(time / 1000, 2).toFixed(2)}s`;
    } else {
      return `${truncateDecimals(time, 2).toFixed(2)}ms`;
    }
  };

  const showViaToast = (duration) => {
    if (window.via && typeof window.via.toast === 'function') {
      const message = duration ? `加载耗时: ${formatTime(duration)}` : '加载耗时: 未知';
      window.via.toast(message);
      return true;
    }
    return false;
  };

  const showDomNotification = (duration) => {
    const container = document.createElement('div');
    const shadow = container.attachShadow({ mode: 'closed' });
    const elem = document.createElement('div');
    elem.className = 'load-time-final';
    elem.textContent = duration ? `加载耗时: ${formatTime(duration)}` : '未知';
    elem.style.opacity = '0';
    elem.style.transition = 'opacity 0.15s ease-out';
    
    const style = document.createElement('style');
    style.textContent = '.load-time-final{position:fixed;bottom:60px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.96);backdrop-filter:blur(8px);padding:10px 22px;border-radius:6px;font-family:"JetBrains Mono",monospace;color:#2c3e50;box-shadow:0 4px 20px rgba(0,0,0,0.1);z-index:2147483647;border:1px solid rgba(0,0,0,0.06);font-size:14px;white-space:nowrap;}';
    shadow.appendChild(style);
    shadow.appendChild(elem);
    document.body.appendChild(container);
    
    requestAnimationFrame(() => {
      elem.style.opacity = '1';
    });
    
    setTimeout(() => {
      elem.style.opacity = '0';
      setTimeout(() => container.remove(), 150);
    }, 1500);
  };

  const showDuration = (duration) => {
    if (!showViaToast(duration)) {
      showDomNotification(duration);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      domContentLoadedTime = performance.now();
    });
  } else {
    domContentLoadedTime = getDomContentLoadedTime();
  }

  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.name === 'first-contentful-paint' && !fcp) fcp = e.startTime;
      }
    }).observe({ type: 'paint', buffered: true });

    new PerformanceObserver((list) => {
      const ents = list.getEntries();
      if (ents.length) lcp = ents[ents.length - 1].startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('浏览器不支持 FCP/LCP 监控：', e);
  }

  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      currentDuration = getLoadDuration();
      showDuration(currentDuration);
    });
  }, { once: true });

  GM_registerMenuCommand('显示性能指标', () => {
    if (currentDuration === null) {
      currentDuration = getLoadDuration();
    }
    const domContentLoadedText = domContentLoadedTime ? formatTime(domContentLoadedTime) : '未知';
    const fcpText = fcp ? formatTime(fcp) : '未知';
    const lcpText = lcp ? formatTime(lcp) : '未知';
    const durationText = currentDuration ? formatTime(currentDuration) : '未知';
    alert(`DOMContentLoaded: ${domContentLoadedText}\n首次可视时间 (FCP): ${fcpText}\n内容完全可见时间 (LCP): ${lcpText}\n页面完全加载耗时: ${durationText}`);
  });
})();