// ==UserScript==
// @name         批量下载腾讯文档空间中文档（等待导出成功）
// @namespace    http://tampermonkey.net/
// @version      2026-01-14-wait-export-success-v3
// @description  点击“下载”后，先等"Exporting"出现（5秒），再等"Export successful"（5秒）。只要不是文件夹（无三角图标），就尝试下载。
// @author       cyril
// @match        *://docs.qq.com/space/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562517/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E7%A9%BA%E9%97%B4%E4%B8%AD%E6%96%87%E6%A1%A3%EF%BC%88%E7%AD%89%E5%BE%85%E5%AF%BC%E5%87%BA%E6%88%90%E5%8A%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562517/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E7%A9%BA%E9%97%B4%E4%B8%AD%E6%96%87%E6%A1%A3%EF%BC%88%E7%AD%89%E5%BE%85%E5%AF%BC%E5%87%BA%E6%88%90%E5%8A%9F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log('✅ [AutoDownload] 脚本已注入，当前页面:', window.location.href);

  let isRunning = false;
  let isPaused = false;
  let downloadQueue = [];
  let controlPanel = null;
  let statusEl = null;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ✅ 自动展开所有文件夹
  async function expandAllFolders(maxDepth = 6) {
    console.log('🔍 [AutoDownload] 开始自动展开所有文件夹...');
    let depth = 0;
    let totalExpanded = 0;

    while (depth < maxDepth) {
      const switchers = Array.from(document.querySelectorAll('.base-tree-item-switcher'))
        .filter(switcher => {
          const icon = switcher.querySelector('.base-tree-item-switcher-icon');
          return icon && !icon.classList.contains('expanded');
        });

      if (switchers.length === 0) {
        console.log('✅ [AutoDownload] 所有文件夹已展开完毕');
        break;
      }

      console.log(`🔄 第 ${depth + 1} 轮：发现 ${switchers.length} 个未展开文件夹`);

      for (const switcher of switchers) {
        try {
          switcher.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          await sleep(100);
          switcher.click();
          totalExpanded++;
          console.log('👉 已点击展开一个文件夹');
          await sleep(300);
        } catch (e) {
          console.warn('⚠️ 展开失败:', e);
        }
      }

      depth++;
      await sleep(300);
    }

    console.log(`✅ [AutoDownload] 总共展开了 ${totalExpanded} 个文件夹`);
    return totalExpanded;
  }

  // 获取当前面包屑路径
  function getCurrentPath() {
    const breadcrumb = document.querySelector('[data-testid="breadcrumb"]');
    if (!breadcrumb) return '';

    const parts = [];
    const walker = document.createTreeWalker(breadcrumb, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent.trim();
      if (text && !['>', '›', '/'].includes(text)) {
        parts.push(text);
      }
    }
    return parts.join(' / ');
  }

  // ✅ 核心修改：只要没有三角图标（即不是文件夹），就视为可下载项
  function getDownloadableItems() {
    const allItems = document.querySelectorAll('[data-testid="file-list-item-wrapper"]');
    console.log(`📂 共找到 ${allItems.length} 个菜单项`);

    const downloadable = Array.from(allItems).filter((item) => {
      // 只要包含 .base-tree-item-switcher-icon，就是文件夹 → 跳过
      const isFolder = !!item.querySelector('.base-tree-item-switcher-icon');
      if (isFolder) {
        const titleEl = item.querySelector('[data-testid="file-list-item-title"]');
        const title = titleEl ? titleEl.textContent.trim() : '未知文件夹';
        console.debug(`📁 跳过文件夹: "${title}"`);
        return false;
      }

      // 否则一律当作可下载文档
      const titleEl = item.querySelector('[data-testid="file-list-item-title"]');
      const title = titleEl ? titleEl.textContent.trim() : '未知文件';
      console.debug(`📄 保留（非文件夹）: "${title}"`);
      return true;
    });

    console.log(`✅ 最终筛选出 ${downloadable.length} 个可下载项`);
    return downloadable;
  }

  // 🔍 提取所有可能的通知元素（复用）
  function getNoticeElements() {
    return document.querySelectorAll(`
      .ant-message-notice-content,
      [class*="message"],
      [class*="toast"],
      [role="alert"],
      .notification-content,
      div[style*="fixed"],
      .sc-notification,
      .feedback-message,
      .portal-container > div > div > div > div
    `);
  }

  // 检测是否出现 "Exporting" 类提示
  function checkForExporting() {
    const keywords = [
      'Exporting',
      '正在导出',
      '导出中',
      'please wait',
      '请稍候',
      '处理中'
    ];

    const notices = getNoticeElements();
    for (const notice of notices) {
      const text = (notice.textContent || '').replace(/\s+/g, ' ').trim();
      if (keywords.some(kw => text.includes(kw))) {
        return true;
      }
    }
    return false;
  }

  // 检测是否出现成功提示
  function checkForExportSuccess() {
    const notices = getNoticeElements();
    for (const notice of notices) {
      const text = (notice.textContent || '').replace(/\s+/g, ' ').trim();
      if (/Export successful/i.test(text) || /导出成功/.test(text)) {
        return true;
      }
    }
    return false;
  }

  // ✅ 两阶段等待（5秒 + 5秒）
  async function waitForExportComplete(totalTimeoutMs = 10000) {
    const checkInterval = 200;
    const startTime = Date.now();

    // 第一阶段：等待 "Exporting" 出现（最多 5 秒）
    const exportingPhaseTimeout = 3000;
    console.log('⏳ 第一阶段：等待导出任务启动（"Exporting"）...');

    let exportingDetected = false;
    while (Date.now() - startTime < exportingPhaseTimeout) {
      if (checkForExporting()) {
        exportingDetected = true;
        console.log('✅ 检测到导出已启动（"Exporting"）');
        break;
      }
      await sleep(checkInterval);
    }

    if (!exportingDetected) {
      console.warn('❌ 5秒内未检测到 "Exporting"，可能未触发导出');
      return false;
    }

    // 第二阶段：等待成功提示（最多再等 5 秒）
    const successPhaseTimeout = 3000;
    const successStartTime = Date.now();
    console.log('⏳ 第二阶段：等待导出完成提示（"Export successful"）...');

    while (Date.now() - successStartTime < successPhaseTimeout) {
      if (checkForExportSuccess()) {
        console.log('✅ 检测到导出成功提示');
        await sleep(500);
        return true;
      }
      await sleep(checkInterval);
    }

    console.warn('⚠️ 未检测到成功提示，但导出已启动，按成功处理');
    await sleep(500);
    return true;
  }

  // ✅ 触发单个下载
  async function triggerDownload(item) {
    const titleEl = item.querySelector('[data-testid="file-list-item-title"]');
    const rawTitle = titleEl ? titleEl.textContent.trim() : '未知标题';
    const currentPath = getCurrentPath();
    const displayTitle = currentPath ? `[${currentPath}] ${rawTitle}` : rawTitle;

    console.log(`\n➡️ 开始处理: "${displayTitle}"`);

    const moreBtn = item.querySelector('[data-testid="file-list-item-more-btn"]');
    if (!moreBtn) {
      console.warn(`⚠️ 未找到“更多”按钮`);
      item.style.outline = '2px solid orange';
      return false;
    }

    item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    await sleep(300);
    moreBtn.click();
    await sleep(600);

    // 🔍 仅匹配英文 "Download"
    let downloadBtn = null;
    const candidates = [...document.querySelectorAll('button, [role="menuitem"]')];
    for (const btn of candidates) {
      const cleanText = (btn.textContent || '').replace(/\s+/g, '');
      const titleAttr = btn.title || '';
      if (cleanText.includes('Download') || titleAttr.includes('Download')) {
        downloadBtn = btn;
        break;
      }
    }

    if (!downloadBtn) {
      try {
        const xpathResult = document.evaluate(
          '//*[contains(text(), "Download")][self::button or @role="menuitem"]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        downloadBtn = xpathResult.singleNodeValue;
      } catch (e) {
        console.error('XPath 查询失败:', e);
      }
    }

    if (!downloadBtn) {
      console.error(`❌ 未找到“Download”按钮: ${displayTitle}`);
      item.style.outline = '2px solid red';
      document.body.click();
      await sleep(200);
      return false;
    }

    console.log(`📥 点击下载: ${displayTitle} —— 等待导出完成...`);
    downloadBtn.click();

    const success = await waitForExportComplete(10000);

    document.body.click();
    await sleep(300);

    if (success) {
      console.log(`✅ 完成处理: "${displayTitle}"`);
      item.style.outline = '2px solid green';
      return true;
    } else {
      console.error(`🔥 导出未启动: "${displayTitle}"`);
      item.style.outline = '3px solid red';
      return false;
    }
  }

  // 控制面板
  function createControlPanel() {
    if (controlPanel) return;

    controlPanel = document.createElement('div');
    controlPanel.id = 'auto-download-panel';
    controlPanel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999999;
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      font-size: 13px;
      max-width: 280px;
    `;

    const title = document.createElement('div');
    title.innerHTML = '<strong>🤖 批量下载控制台</strong>';
    title.style.marginBottom = '6px';

    statusEl = document.createElement('div');
    statusEl.innerText = '就绪';
    statusEl.style.minHeight = '18px';

    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '6px';
    btnGroup.style.marginTop = '6px';

    const pauseBtn = document.createElement('button');
    pauseBtn.innerText = '⏸ 暂停';
    pauseBtn.style.flex = '1';
    pauseBtn.onclick = () => {
      isPaused = true;
      updatePanel();
    };

    const resumeBtn = document.createElement('button');
    resumeBtn.innerText = '▶️ 继续';
    resumeBtn.style.flex = '1';
    resumeBtn.onclick = () => {
      isPaused = false;
      updatePanel();
    };

    const stopBtn = document.createElement('button');
    stopBtn.innerText = '⏹ 停止';
    stopBtn.style.flex = '1';
    stopBtn.style.background = '#f44336';
    stopBtn.style.color = 'white';
    stopBtn.onclick = () => {
      isRunning = false;
      isPaused = false;
      downloadQueue = [];
      updatePanel();
      statusEl.innerText = '🛑 已停止';
    };

    btnGroup.append(pauseBtn, resumeBtn, stopBtn);
    controlPanel.append(title, statusEl, btnGroup);
    document.body.appendChild(controlPanel);
  }

  function updatePanel() {
    if (!statusEl || !isRunning) return;
    if (isPaused) {
      statusEl.innerText = `⏸ 已暂停（剩余 ${downloadQueue.length} 个）`;
    } else {
      statusEl.innerText = `🚀 正在下载...（剩余 ${downloadQueue.length} 个）`;
    }
  }

  // 主下载循环
  async function processNext() {
    if (!isRunning) return;

    while (isPaused && isRunning) {
      await sleep(200);
    }
    if (!isRunning) return;

    if (downloadQueue.length === 0) {
      statusEl.innerText = '✅ 全部完成！';
      isRunning = false;
      return;
    }

    const item = downloadQueue.shift();
    await triggerDownload(item);
    updatePanel();

    await sleep(500 + Math.floor(Math.random() * 501)); // 随机延迟 500-1000ms
    await processNext();
  }

  // 启动函数
  async function startBatchDownload() {
    if (isRunning) {
      console.warn('已在运行中');
      return;
    }

    try {
      console.log('⏳ 正在展开所有文件夹，请稍候...');
      if (statusEl) statusEl.innerText = '正在展开所有文件夹...';
      await expandAllFolders();
      await sleep(1000);
    } catch (e) {
      console.error('❌ 展开文件夹失败:', e);
      alert('展开文件夹时出错，请查看控制台');
      return;
    }

    let items;
    try {
      items = getDownloadableItems();
    } catch (e) {
      console.error('❌ getDownloadableItems 报错:', e);
      alert('脚本内部错误，请打开开发者工具查看控制台');
      return;
    }

    if (items.length === 0) {
      alert('未找到可下载的文档项。请确保在文档列表页。');
      return;
    }

    createControlPanel();
    downloadQueue = [...items];
    isRunning = true;
    isPaused = false;
    statusEl.innerText = `准备下载 ${items.length} 个文件...`;
    console.log(`🚀 开始连续下载，共 ${items.length} 项`);
    processNext();
  }

  // 添加启动按钮
  function addStartButton() {
    if (document.getElementById('auto-download-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'auto-download-btn';
    btn.innerText = '🤖 一键批量下载（等待导出成功）';
    btn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 320px;
      z-index: 999998;
      padding: 10px 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    btn.onclick = startBatchDownload;
    document.body.appendChild(btn);
    console.log('🟢 启动按钮已添加');
  }

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addStartButton);
  } else {
    addStartButton();
  }
})();