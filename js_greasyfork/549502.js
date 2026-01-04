// ==UserScript==
// @name         mteam 基于评论筛选的排序优化
// @namespace    http://tampermonkey.net/
// @version      2025.09.14
// @description  自动识别评论列，排序, 隐藏0评论
// @author       TD21forever
// @license      MIT
// @match        *://*.m-team.cc/*
// @match        *://*.m-team.io/*
// @match        *://m-team.cc/*
// @match        *://m-team.io/*
// @run-at       document-end
// @grant        GM_log
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549502/mteam%20%E5%9F%BA%E4%BA%8E%E8%AF%84%E8%AE%BA%E7%AD%9B%E9%80%89%E7%9A%84%E6%8E%92%E5%BA%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/549502/mteam%20%E5%9F%BA%E4%BA%8E%E8%AF%84%E8%AE%BA%E7%AD%9B%E9%80%89%E7%9A%84%E6%8E%92%E5%BA%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const log = (...a) => console.log('[mteam-helper]', ...a);

  // ============== 配置项 ==============


  // localStorage存储键名，用于持久化用户配置
  const LS_KEY = 'mteam_helper_cfg_v1';

  // 默认配置对象
  const defaultCfg = {
    sort: 'desc',         // 排序模式：'asc'升序 | 'desc'降序
    hideZero: false,      // 是否隐藏零评论条目
    titleColIdx: null,    // 标题列索引（null表示自动检测）
    commentColIdx: null,  // 评论列索引（null表示自动检测）
  };

  // ============== 配置管理 ==============

  /**
   * 从localStorage加载用户配置
   * @returns {Object} 配置对象，加载失败时返回默认配置
   */
  function loadCfg(){
    try {
      const s = localStorage.getItem(LS_KEY);
      return s ? Object.assign({}, defaultCfg, JSON.parse(s)) : Object.assign({}, defaultCfg);
    } catch {
      return Object.assign({}, defaultCfg);
    }
  }

  /**
   * 保存用户配置到localStorage
   * @param {Object} c - 要保存的配置对象
   */
  function saveCfg(c){
    try { localStorage.setItem(LS_KEY, JSON.stringify(c || {})); } catch {}
  }

  // ============== DOM工具函数 ==============

  /**
   * DOM就绪检测：确保DOM完全加载后执行回调
   * @param {Function} fn - 回调函数
   */
  function onReady(fn){
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fn, 0);
    } else {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    }
  }

  /**
   * SPA路由变化监听：包装history API以检测URL变化
   * 用于支持单页应用的路由切换
   * @param {Function} cb - URL变化时的回调函数
   */
  function onUrlChange(cb){
    let last = location.href;
    const fire = () => {
      const now = location.href;
      if (now !== last) {
        last = now;
        cb(now);
      }
    };

    // 包装history API方法以触发回调
    const wrap = (methodName) => {
      const original = history[methodName];
      return function(){
        const result = original.apply(this, arguments);
        fire();
        return result;
      };
    };

    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');
    window.addEventListener('popstate', fire);
    cb(location.href); // 立即执行一次
  }

  // ============== 表格检测与分析 ==============

  /**
   * 查找页面中的种子列表表格
   * 优先选择表头包含"標題/标题/title"的表格
   * @returns {HTMLTableElement|null} 找到的表格元素
   */
  function findTable(){
    const tables = Array.from(document.querySelectorAll('table'));
    // 优先：表头包含标题字样的表格
    const withTitle = tables.find(t => t.tHead && /標題|标题|title/i.test(t.tHead.innerText || ''));
    if (withTitle) return withTitle;
    // 备选：有表头和表体的表格
    return tables.find(t => t.tHead && t.tBodies && t.tBodies.length) || null;
  }

  // ============== 数据提取工具 ==============

  /**
   * 从单元格中提取评论数量
   * @param {HTMLTableCellElement} cell - 表格单元格
   * @returns {number|null} 提取到的数字，失败时返回null
   */
  function extractCountFromCell(cell){
    if (!cell) return null;

    // 直接提取单元格中的数字（适用于简单的纯数字单元格）
    const text = (cell.innerText || cell.textContent || '').trim();
    const match = text.match(/(\d+)/);

    return match ? parseInt(match[1], 10) : null;
  }

  function detectTitleColIdx(table){
    try {
      if (!table || !table.tHead) return 0;
      const ths = Array.from(table.tHead.querySelectorAll('tr th, tr td'));
      for (let i = 0; i < ths.length; i++){
        const t = (ths[i].innerText || '').trim();
        if (/標題|标题|title/i.test(t)) return i;
      }
    } catch {}
    return 0;
  }

  function detectCommentColIdx(table){
    try {
      if (!table || !table.tBodies || !table.tBodies.length) return 1;
      const tbody = table.tBodies[0];
      const rows = Array.from(tbody.rows).slice(0, 30);
      if (!rows.length) return 1;
      const colCount = Math.max(...rows.map(r => r.cells ? r.cells.length : 0));
      let bestIdx = 1, bestScore = -1;
      for (let c = 0; c < colCount; c++){
        let score = 0, numericHits = 0, svgHits = 0, unitHits = 0;
        for (const r of rows){
          const cell = r.cells && r.cells[c];
          if (!cell) continue;
          const t = (cell.textContent || '').trim();
          if (/GB|TB|MB|KB|GiB|MiB|小时|小時|min|hr/ig.test(t)) unitHits++;
          const n = extractCountFromCell(cell);
          if (typeof n === 'number' && !isNaN(n)) { numericHits++; score += Math.min(50, n) / 50; }
          if (cell.querySelector('svg')) svgHits++;
        }
        score += svgHits * 2 + numericHits * 1 - unitHits * 1;
        if (score > bestScore) { bestScore = score; bestIdx = c; }
      }
      return bestIdx;
    } catch {
      return 1;
    }
  }

  // ============== 表头控件创建 ==============

  /**
   * 在评论列表头添加排序控制和筛选功能
   * @param {HTMLTableElement} table - 目标表格
   * @param {number} commentIdx - 评论列索引
   * @param {Function} applyCallback - 应用配置的回调函数
   * @returns {Object} 返回配置获取函数
   */
  function addHeaderControls(table, commentIdx, applyCallback) {
    if (!table.tHead) return { get: loadCfg };

    const headerRow = table.tHead.querySelector('tr');
    if (!headerRow) return { get: loadCfg };

    const commentHeader = headerRow.cells[commentIdx];
    if (!commentHeader) return { get: loadCfg };

    // 控件清理已在调用前完成

    const cfg = loadCfg();

    // 模仿原生表头按钮的结构
    const headerContent = document.createElement('div');
    headerContent.className = 'flex items-center cursor-pointer justify-center';

    // 评论图标（保持原样）
    const iconDiv = document.createElement('div');
    iconDiv.innerHTML = `<span role="img" size="18" class="anticon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_135_2948)"><path d="M18.6667 3.66667C18.6667 2.75 17.9167 2 17 2H3.66667C2.75 2 2 2.75 2 3.66667V13.6667C2 14.5833 2.75 15.3333 3.66667 15.3333H15.3333L18.6667 18.6667V3.66667Z" fill="var(--gray-4)"></path></g><defs><clipPath id="clip0_135_2948"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg></span>`;

    // 排序箭头容器（模仿原生样式）
    const arrowContainer = document.createElement('div');
    arrowContainer.className = 'flex flex-col leading-[0]';

    // 向上箭头
    const upArrow = document.createElement('span');
    upArrow.role = 'img';
    upArrow.className = 'anticon';
    upArrow.innerHTML = '<svg width="21" height="10" viewBox="0 0 21 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.0772 5.01875L13.1272 7.06875C13.4522 7.39375 13.9772 7.39375 14.3022 7.06875C14.6272 6.74375 14.6272 6.21875 14.3022 5.89375L11.6605 3.24375C11.3355 2.91875 10.8105 2.91875 10.4855 3.24375L7.84385 5.89375C7.51885 6.21875 7.51885 6.74375 7.84385 7.06875C8.16885 7.39375 8.69385 7.39375 9.01885 7.06875L11.0772 5.01875Z" fill="currentColor"></path></svg>';

    // 向下箭头
    const downArrow = document.createElement('span');
    downArrow.role = 'img';
    downArrow.className = 'anticon';
    downArrow.innerHTML = '<svg width="21" height="10" viewBox="0 0 21 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.01885 3.24375L11.0688 5.29375L13.1272 3.25208C13.4522 2.92708 13.9772 2.92708 14.3022 3.25208C14.6272 3.57708 14.6272 4.10208 14.3022 4.42708L11.6605 7.06875C11.3355 7.39375 10.8105 7.39375 10.4855 7.06875L7.84385 4.41875C7.51885 4.09375 7.51885 3.56875 7.84385 3.24375C8.16885 2.91875 8.69385 2.91875 9.01885 3.24375Z" fill="currentColor"></path></svg>';

    // 设置箭头状态
    function updateArrowState() {
      if (cfg.sort === 'asc') {
        upArrow.className = 'anticon text-[--mt-text-base]';
        downArrow.className = 'anticon text-[--mt-gray-3]';
      } else {
        upArrow.className = 'anticon text-[--mt-gray-3]';
        downArrow.className = 'anticon text-[--mt-text-base]';
      }
    }
    updateArrowState();

    // 组装排序按钮
    arrowContainer.appendChild(upArrow);
    arrowContainer.appendChild(downArrow);
    headerContent.appendChild(iconDiv);
    headerContent.appendChild(arrowContainer);

    // 在表格上方添加简洁的筛选控件
    const filterContainer = document.createElement('div');
    filterContainer.className = 'mteam-filter';
    filterContainer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 4px 0;
      margin-bottom: 8px;
      font-size: 12px;
    `;

    const hideZeroCheckbox = document.createElement('input');
    hideZeroCheckbox.type = 'checkbox';
    hideZeroCheckbox.checked = cfg.hideZero;
    hideZeroCheckbox.id = 'hideZero-' + Date.now();

    const hideZeroLabel = document.createElement('label');
    hideZeroLabel.htmlFor = hideZeroCheckbox.id;
    hideZeroLabel.style.cssText = `
      display: flex;
      align-items: center;
      cursor: pointer;
      color: var(--mt-text-secondary, #999);
      user-select: none;
      gap: 4px;
    `;
    hideZeroLabel.appendChild(hideZeroCheckbox);
    hideZeroLabel.appendChild(document.createTextNode('隐藏0评论'));

    filterContainer.appendChild(hideZeroLabel);

    // 插入到表格前面
    table.parentNode.insertBefore(filterContainer, table);

    // 事件处理
    headerContent.addEventListener('click', () => {
      const newCfg = loadCfg();
      newCfg.sort = newCfg.sort === 'desc' ? 'asc' : 'desc';
      cfg.sort = newCfg.sort; // 更新本地cfg
      updateArrowState(); // 更新箭头显示
      saveCfg(newCfg);
      applyCallback(newCfg);
    });

    hideZeroCheckbox.addEventListener('change', () => {
      const newCfg = loadCfg();
      newCfg.hideZero = hideZeroCheckbox.checked;
      saveCfg(newCfg);
      // 筛选功能独立调用，不触发排序
      applyFilter(table, commentIdx, newCfg);
    });

    // 清空原有内容，只添加排序控件到表头
    commentHeader.innerHTML = '';
    commentHeader.appendChild(headerContent);

    return {
      get: loadCfg,
      headerContent,
      hideZeroCheckbox
    };
  }

  // ============== 核心排序筛选功能 ==============

  /**
   * 应用排序和筛选到表格
   * @param {HTMLTableElement} table - 目标表格
   * @param {number} titleIdx - 标题列索引
   * @param {number} commentIdx - 评论列索引
   * @param {Object} cfg - 配置对象
   */
  /**
   * 应用排序和筛选到表格 - 简化版
   * @param {HTMLTableElement} table - 目标表格
   * @param {number} titleIdx - 标题列索引
   * @param {number} commentIdx - 评论列索引
   * @param {Object} cfg - 配置对象
   */
  function applyToTable(table, titleIdx, commentIdx, cfg){
    if (!table || !table.tBodies || !table.tBodies.length) return;
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows || []);

    let hideCountZero = 0;
    const keep = [];

    // 筛选和收集数据
    for (const r of rows){
      r.style.display = '';
      const comments = extractCountFromCell(r.cells[commentIdx]) || 0;

      if (cfg.hideZero && comments <= 0){
        r.style.display = 'none';
        hideCountZero++;
        continue;
      }

      keep.push({ row: r, comments });
    }

    // 排序并重新排列DOM
    const sign = cfg.sort === 'asc' ? 1 : -1;
    const sorted = keep.sort((a, b) => (a.comments - b.comments) * sign);

    // 直接重排，不做变化检测
    const frag = document.createDocumentFragment();
    for (const item of sorted) {
      frag.appendChild(item.row);
    }
    tbody.appendChild(frag);

    // 简单的统计输出
    if (hideCountZero > 0) {
      log(`隐藏了 ${hideCountZero} 个0评论条目`);
    }
  }

  /**
   * 应用筛选功能（独立于排序）
   */
  function applyFilter(table, commentIdx, cfg) {
    if (!table || !table.tBodies || !table.tBodies.length) return;
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows || []);

    let hideCount = 0;
    for (const r of rows) {
      const comments = extractCountFromCell(r.cells[commentIdx]) || 0;
      if (cfg.hideZero && comments <= 0) {
        r.style.display = 'none';
        hideCount++;
      } else {
        r.style.display = '';
      }
    }

    if (hideCount > 0) {
      log(`应用筛选：隐藏了 ${hideCount} 个0评论条目`);
    }
  }

  /**
   * 监听表格变化，当数据重新加载时自动重新应用筛选
   */
  function watchTable(table, commentIdx, getCfg){
    if (!table || !table.tBodies || !table.tBodies.length) return;

    const tbody = table.tBodies[0];
    let isApplying = false; // 防止无限循环

    const observer = new MutationObserver((mutations) => {
      if (isApplying) return;

      // 检查是否有行级别的变化（数据重新加载）
      const hasRowChanges = mutations.some(mut =>
        mut.type === 'childList' &&
        (mut.addedNodes.length > 0 || mut.removedNodes.length > 0) &&
        Array.from(mut.addedNodes).some(node => node.tagName === 'TR') ||
        Array.from(mut.removedNodes).some(node => node.tagName === 'TR')
      );

      if (hasRowChanges) {
        isApplying = true;
        const cfg = getCfg();
        // 只重新应用筛选，不影响排序
        applyFilter(table, commentIdx, cfg);
        setTimeout(() => { isApplying = false; }, 100);
      }
    });

    observer.observe(tbody, {
      childList: true,
      subtree: false // 只监听直接子元素变化，避免过度监听
    });

    return observer;
  }

  // 标题点击兜底修复：排序后仍可跳转
  function installLinkNavigationFix(table){
    if (!table || !table.tBodies || !table.tBodies.length) return;
    const tbody = table.tBodies[0];
    tbody.addEventListener('click', function(e){
      const a = e.target && e.target.closest && e.target.closest('a[href^="/detail/"]');
      if (!a) return;
      if (e.defaultPrevented) return;
      if (e.button !== 0) return; // 左键
      if (e.altKey) return;       // 保留系统行为
      e.preventDefault();
      const url = a.href;
      const openNew = e.metaKey || e.ctrlKey || a.target === '_blank';
      if (openNew) window.open(url, '_blank'); else window.location.assign(url);
    }, true);

    // 可选：统一详情链接新标签打开，减少 SPA 干扰
    try { table.querySelectorAll('a[href^="/detail/"]').forEach(a => a.setAttribute('target','_blank')); } catch {}
  }

  // ============== 主初始化函数 ==============

  /**
   * 为指定URL初始化脚本功能
   * 这是脚本的主入口点，负责协调所有功能模块
   */
  // 防重复执行标记
  let isInitialized = false;

  async function initForUrl(){
    try {
      // 防止重复初始化
      if (isInitialized) {
        log('脚本已初始化，跳过重复执行');
        return;
      }

      const cfg = loadCfg();
      // 可选：仅在特定页面生效（如成人区）
      // if (!/\/adult\b/.test(location.href)) return;

      const table = await new Promise((resolve, reject) => {
        const t = findTable();
        if (t) return resolve(t);
        const obs = new MutationObserver(() => { const t2 = findTable(); if (t2){ obs.disconnect(); resolve(t2); } });
        obs.observe(document.documentElement, { childList: true, subtree: true });
        setTimeout(() => { try { obs.disconnect(); } catch {} reject('no table'); }, 15000);
      });

      const titleIdx = (cfg.titleColIdx !== null) ? cfg.titleColIdx : detectTitleColIdx(table);
      const commentIdx = (cfg.commentColIdx !== null) ? cfg.commentColIdx : detectCommentColIdx(table);

      // 获取所有表头，用于清理和调试
      const allHeaders = Array.from(table.tHead.querySelectorAll('th, td'));

      log('init', { titleIdx, commentIdx, table });
      log('评论列检测结果：', `第${commentIdx}列`, allHeaders[commentIdx]?.innerText || '未找到');

      // 先清理所有可能存在的控件
      allHeaders.forEach(header => {
        const existing = header.querySelector('.mteam-controls');
        if (existing) existing.remove();
      });

      // 清理已存在的筛选控件
      const existingFilter = table.parentNode.querySelector('.mteam-filter');
      if (existingFilter) existingFilter.remove();

      // 只在评论列添加控件
      const controls = addHeaderControls(table, commentIdx, (c) => {
        applyToTable(table, titleIdx, commentIdx, c);
      });

      applyToTable(table, titleIdx, commentIdx, controls.get());
      applyFilter(table, commentIdx, controls.get());
      watchTable(table, commentIdx, controls.get);
      installLinkNavigationFix(table);

      // 标记初始化完成
      isInitialized = true;
      log('脚本初始化完成');

    } catch (err) {
      log('init fail', err);
    }
  }

  onReady(() => onUrlChange(initForUrl));

})();


