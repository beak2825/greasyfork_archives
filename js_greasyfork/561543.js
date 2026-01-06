// ==UserScript==
// @name         逆战活动中心清理器
// @name:en      NZ Activity List Cleaner
// @namespace    https://nz.qq.com/
// @version      0.3.0
// @description  隐藏已结束活动，并可自动预加载下一页合并到当前列表。
// @description:en  Hide ended activities and auto-preload the next page into the list.
// @license      MIT
// @match        https://nz.qq.com/web202403/activity-list.shtml*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561543/%E9%80%86%E6%88%98%E6%B4%BB%E5%8A%A8%E4%B8%AD%E5%BF%83%E6%B8%85%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561543/%E9%80%86%E6%88%98%E6%B4%BB%E5%8A%A8%E4%B8%AD%E5%BF%83%E6%B8%85%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SELECTORS = {
    list: '#mActive',
    pageList: '#mPageList',
    pageNext: '#mPageNext',
    pageCur: '#mPageCur',
    pageTotal: '#mPageTotal',
    endedBadge: 'span.ended'
  };

  const STORAGE_KEY = 'tmNzAutoMerge';
  let autoMergeEnabled = true;
  let autoMergeInProgress = false;
  let autoMergeScheduled = false;
  let autoMergedToPage = null;
  let toggleButton = null;

  function addStyle(cssText) {
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
  }

  function hideEnded(listEl) {
    const items = listEl.querySelectorAll('li');
    for (const item of items) {
      if (item.querySelector(SELECTORS.endedBadge)) {
        item.style.display = 'none';
        item.setAttribute('data-tm-hidden', '1');
      }
    }
  }

  function waitForElement(selector, timeoutMs) {
    return new Promise((resolve) => {
      const initial = document.querySelector(selector);
      if (initial) {
        resolve(initial);
        return;
      }

      let timeoutId = null;
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          resolve(el);
        }
      });

      observer.observe(document.documentElement, { childList: true, subtree: true });

      if (typeof timeoutMs === 'number') {
        timeoutId = setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, timeoutMs);
      }
    });
  }

  function getPageInfo() {
    const curEl = document.querySelector(SELECTORS.pageCur);
    const totalEl = document.querySelector(SELECTORS.pageTotal);
    if (!curEl || !totalEl) {
      return null;
    }
    const cur = parseInt(curEl.textContent, 10);
    const total = parseInt(totalEl.textContent, 10);
    if (!Number.isFinite(cur) || !Number.isFinite(total)) {
      return null;
    }
    return { cur, total };
  }

  function mergeNextPage(onDone) {
    const list = document.querySelector(SELECTORS.list);
    const next = document.querySelector(SELECTORS.pageNext);
    const info = getPageInfo();
    if (!list || !next || !info || info.cur >= info.total) {
      if (typeof onDone === 'function') {
        onDone();
      }
      return;
    }

    const existingNodes = Array.from(list.children);
    let merged = false;
    const mergeNow = () => {
      if (merged) {
        return;
      }
      merged = true;
      if (existingNodes.length) {
        list.prepend(...existingNodes);
      }
      hideEnded(list);
      if (typeof onDone === 'function') {
        onDone();
      }
    };

    const observer = new MutationObserver(() => {
      observer.disconnect();
      mergeNow();
    });
    observer.observe(list, { childList: true });

    next.click();

    setTimeout(() => {
      observer.disconnect();
      mergeNow();
    }, 1500);
  }

  function getToggleLabel(enabled) {
    return enabled ? '预加载下一页-已开' : '预加载下一页-已关';
  }

  function loadAutoMergeSetting() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '1') {
      return true;
    }
    if (stored === '0') {
      return false;
    }
    return true;
  }

  function updateToggleButton() {
    if (!toggleButton) {
      return;
    }
    toggleButton.textContent = getToggleLabel(autoMergeEnabled);
  }

  function setAutoMergeEnabled(enabled, runMerge) {
    autoMergeEnabled = enabled;
    localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    if (enabled) {
      autoMergedToPage = null;
    }
    updateToggleButton();
    if (enabled && runMerge) {
      scheduleAutoMerge();
    }
  }

  function autoMergeIfEnabled() {
    if (!autoMergeEnabled || autoMergeInProgress) {
      return;
    }
    const info = getPageInfo();
    if (!info || info.cur >= info.total) {
      return;
    }
    if (autoMergedToPage === info.cur) {
      return;
    }

    autoMergeInProgress = true;
    autoMergedToPage = info.cur + 1;
    mergeNextPage(() => {
      autoMergeInProgress = false;
    });
  }

  function scheduleAutoMerge() {
    if (autoMergeScheduled) {
      return;
    }
    autoMergeScheduled = true;
    requestAnimationFrame(() => {
      autoMergeScheduled = false;
      autoMergeIfEnabled();
    });
  }

  function ensureAutoMergeButton() {
    const pageList = document.querySelector(SELECTORS.pageList);
    if (!pageList) {
      return;
    }
    if (pageList.querySelector('.tm-auto-merge-toggle')) {
      return;
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tm-auto-merge-toggle';
    btn.addEventListener('click', () => {
      setAutoMergeEnabled(!autoMergeEnabled, true);
    });
    pageList.appendChild(btn);
    toggleButton = btn;
    updateToggleButton();
  }

  async function init() {
    const list = await waitForElement(SELECTORS.list, 10000);
    if (!list) {
      return;
    }

    addStyle(
      '.tm-auto-merge-toggle{' +
        'margin-left:8px;' +
        'padding:2px 8px;' +
        'font-size:12px;' +
        'line-height:20px;' +
        'background:#fff;' +
        'border:1px solid #888;' +
        'border-radius:3px;' +
        'cursor:pointer;' +
      '}'
    );

    hideEnded(list);

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) {
        return;
      }
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        hideEnded(list);
        scheduleAutoMerge();
      });
    });
    observer.observe(list, { childList: true, subtree: true });

    autoMergeEnabled = loadAutoMergeSetting();
    ensureAutoMergeButton();
    scheduleAutoMerge();
  }

  init();
})();
