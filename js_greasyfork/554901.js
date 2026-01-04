// ==UserScript==
// @name         Boss直聘简历批量提取助手
// @namespace    https://github.com/user/userscripts
// @version      1.0.0
// @description  在 Boss直聘候选列表页，依次点击每个候选 .geek-item，等待详情加载后提取信息，最后逐行输出并复制到剪贴板。
// @match        https://www.zhipin.com/*
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554901/Boss%E7%9B%B4%E8%81%98%E7%AE%80%E5%8E%86%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554901/Boss%E7%9B%B4%E8%81%98%E7%AE%80%E5%8E%86%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 可调整参数
  const CONFIG = {
    // 每次点击后基础等待时间（毫秒），用于让页面开始渲染
    baseDelay: 500,
    // 等待详情关键元素出现或变更的最长时间（毫秒）
    waitTimeout: 8000,
    // 每次提取前的微小缓冲（毫秒）
    settleDelay: 200,
  };

  // 简单的 sleep
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // 等待条件成立（返回 truthy），超时抛错
  const waitFor = async (predicate, timeout = CONFIG.waitTimeout, interval = 100) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const v = predicate();
        if (v) return v;
      } catch (_) {
        // 忽略瞬时异常
      }
      await sleep(interval);
    }
    throw new Error('等待页面元素加载超时');
  };

  // 提取当前已打开简历详情中的信息，返回制表符分隔的一行文本
  const extractCurrentProfile = () => {
    const safeText = (el) => (el?.textContent || '').trim();

    // 姓名
    const nameText = safeText(document.querySelector('.name-box'));
    // 最近活跃（.active-time 的下一个兄弟元素）
    const activeNext = safeText(document.querySelector('.active-time')?.nextElementSibling);
    // 学校/学历等（.work-content .icon.shool 的下一个兄弟元素，按 · 分割）
    const schoolText = safeText(document.querySelector('.work-content .icon.shool')?.nextElementSibling);
    const schoolParts = schoolText
      .split('·')
      .map((s) => s.trim())
      .filter(Boolean);
    // 期望薪资
    const expectSalary = safeText(document.querySelector('.position-item .high-light-orange'));

    // 保持与原脚本一致的字段拼接（中间增加一个空字段）
    const result = [nameText, activeNext, ...schoolParts, '', expectSalary].join('\t');
    return result;
  };

  // 主流程：依次点击 .geek-item 并抓取
  const run = async () => {
    const listSelector = '.geek-item';
    let items = Array.from(document.querySelectorAll(listSelector));

    if (!items.length) {
      console.warn('未找到任何 .geek-item 元素，请确认已在候选人列表页。');
      alert('未找到任何 .geek-item 元素，请确认已在候选人列表页。');
      return;
    }

    // 结果收集
    const lines = [];

    // 用于判断详情是否切换到新候选人
    let lastName = (document.querySelector('.name-box')?.textContent || '').trim();

    for (let i = 0; i < items.length; i++) {
      // 每次循环时重新获取当前索引的元素，避免 DOM 重建导致的引用失效
      items = Array.from(document.querySelectorAll(listSelector));
      const item = items[i];
      if (!item) continue;

      // 滚动到视口中，提升点击的稳定性
      try { item.scrollIntoView({ block: 'center' }); } catch (_) {}

      // 点击打开详情
      item.click();

      // 等一小会让渲染开始
      await sleep(CONFIG.baseDelay);

      // 等待 .name-box 出现并且变化（尽量避免读取到上一个人的数据）
      try {
        await waitFor(() => {
          const nameEl = document.querySelector('.name-box');
          if (!nameEl) return false;
          const curName = nameEl.textContent?.trim() || '';
          return curName && curName !== lastName;
        }, CONFIG.waitTimeout);
      } catch (_) {
        // 超时也允许继续，尽量不中断整个批量
      }

      // 再给页面一点点时间稳定
      await sleep(CONFIG.settleDelay);

      // 提取信息
      const line = extractCurrentProfile();
      lines.push(line);

      // 更新 lastName，便于下一次等待对比
      lastName = (document.querySelector('.name-box')?.textContent || '').trim();
    }

    // 输出到控制台（逐行）
    lines.forEach((l) => console.log(l));

    // 复制到剪贴板
    const all = lines.join('\n');
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(all, { type: 'text', mimetype: 'text/plain' });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(all);
      } else {
        // 兼容性降级
        const ta = document.createElement('textarea');
        ta.value = all;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      console.info(`已复制 ${lines.length} 行到剪贴板。`);
      alert(`已复制 ${lines.length} 行到剪贴板。`);
    } catch (e) {
      console.warn('复制到剪贴板失败，请手动复制：\n', all);
      alert('复制到剪贴板失败，请打开控制台查看并手动复制。');
    }
  };

  // 提供菜单入口
  try {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('采集候选并复制到剪贴板', () => {
        // 防抖：避免重复触发
        if ((window.__BOSS_RUN_LOCK__ = window.__BOSS_RUN_LOCK__ || false)) return;
        window.__BOSS_RUN_LOCK__ = true;
        run().finally(() => (window.__BOSS_RUN_LOCK__ = false));
      });
    }
  } catch (_) {}

  // 在页面右下角添加一个悬浮按钮
  const mountFloatingButton = () => {
    if (document.getElementById('boss-scrape-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'boss-scrape-btn';
    btn.textContent = '采集Boss简历';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '24px',
      zIndex: 99999,
      padding: '10px 14px',
      background: '#1677ff',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,.15)',
      cursor: 'pointer',
      fontSize: '14px',
    });
    btn.addEventListener('click', async () => {
      if (btn.dataset.loading === '1') return;
      btn.dataset.loading = '1';
      const oldText = btn.textContent;
      btn.textContent = '采集中...';
      btn.style.opacity = '0.8';
      try {
        await run();
      } finally {
        btn.dataset.loading = '0';
        btn.textContent = oldText;
        btn.style.opacity = '1';
      }
    });
    document.body.appendChild(btn);
  };

  // 初始与路由变化时尝试挂载按钮（Boss直聘是 SPA）
  const init = () => {
    mountFloatingButton();
  };

  // DOM 就绪后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 监听 URL 变化（SPA 场景下切页）
  let lastUrl = location.href;
  const obs = new MutationObserver(() => {
    if (lastUrl !== location.href) {
      lastUrl = location.href;
      mountFloatingButton();
    }
  });
  obs.observe(document, { subtree: true, childList: true });
})();
