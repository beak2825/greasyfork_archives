// ==UserScript==
// @name         DeepWiki 本地聊天历史
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  自动保存在 DeepWiki 上的聊天记录到本地, 并在仓库页面显示历史列表。
// @author       Rain
// @match        https://deepwiki.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555916/DeepWiki%20%E6%9C%AC%E5%9C%B0%E8%81%8A%E5%A4%A9%E5%8E%86%E5%8F%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/555916/DeepWiki%20%E6%9C%AC%E5%9C%B0%E8%81%8A%E5%A4%A9%E5%8E%86%E5%8F%B2.meta.js
// ==/UserScript==



(async function() {
  'use strict';

  // --- 常量定义 ---
  const HISTORY_KEY = 'deepWikiHistory'; // 本地存储的键名
  const DESKTOP_LIST_ID = 'tampermonkey-history-desktop'; // 桌面端列表ID
  const MOBILE_LIST_ID = 'tampermonkey-history-mobile'; // 移动端列表ID

  console.log('DeepWiki 本地历史记录脚本已启动。');

  // --- 路由和初始化 ---

  /**
   * 设置路由监听, 捕获 Next.js (SPA) 的页面切换
   */
  function setupRouteListener() {
    // 保存原始的 pushState
    const originalPushState = window.history.pushState;

    // 创建代理
    window.history.pushState = new Proxy(originalPushState, {
      apply: function(target, thisArg, argumentsList) {
        // console.log('🚀 路由监控:', argumentsList[2] || location.href);

        // 1. 先执行原始的 pushState, 确保 Next.js 逻辑正常
        const result = target.apply(thisArg, argumentsList);

        // 2. 执行我们自己的路由处理逻辑
        //    使用 setTimeout 确保在 DOM 更新后执行
        setTimeout(handleRouteChange, 0);

        return result;
      }
    });
  }

  /**
   * 路由变化时的总处理器
   */
  async function handleRouteChange() {
    const pageType = getPageType();
    // console.log(`DeepWiki History: 路由 -> ${pageType}`);

    switch (pageType) {
      case "ChatPage":
        await handleChatPage();
        break;
      case "RepoPage":
        await handleRepoPage();
        break;
      case "OtherPage":
        // 其他页面, 不执行任何操作
        break;
    }
  }

  /**
   * 匹配当前页面类型
   * @returns {'ChatPage' | 'RepoPage' | 'OtherPage'}
   */
  function getPageType() {
    const path = window.location.pathname;

    if (path.startsWith('/search/')) {
      // 场景 A: 聊天页面
      return 'ChatPage';
    } else {
      const parts = path.split('/').filter(p => p.length > 0);
      if (parts.length === 2) {
        // 场景 B: 仓库主页 (例如 /owner/repo)
        return 'RepoPage';
      } else {
        // 其他页面 (例如 /)
        return 'OtherPage';
      }
    }
  }

  // --- 场景 A: 聊天页面逻辑 (/search/...) ---

  /**
   * 处理聊天页面, 自动保存记录
   */
  async function handleChatPage() {
    const sessionId = window.location.pathname.split('/').pop();
    if (!sessionId) return;

    const history = await getHistory();
    // 如果已经保存过, 则跳过
    if (history.some(entry => entry.sessionId === sessionId)) {
      console.log('DeepWiki History: 此会话已保存, 跳过。');
      return;
    }

    try {
      // 等待第一个聊天气泡（id="1"）渲染完成
      await observeMutations(
        document.querySelector('.pb-36'), // 聊天容器
        (mutation) => {
          if (mutation.type !== "childList") return false;
          for (let el of mutation.addedNodes) {
            // id="1" 是第一个用户提问的气泡
            if (el.id === '1') {
              return true;
            }
          }
          return false;
        }
      );

      // 从DOM中提取仓库和提示词信息
      const aEl = document.querySelector('[id="1"] a.text-base');
      const repo = aEl.getAttribute('href').substring(1);

      const spanEl = document.querySelector('[id="1"] span:has(> button[aria-label="Copy link to query"])');

      const prompt = spanEl.textContent;

      // 添加入库
      return addHistoryEntry({
        repo,
        prompt,
        sessionId,
        fullUrl: window.location.href,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('DeepWiki History: 保存聊天记录失败。', error);
    }
  }

  // --- 场景 B: 仓库页面逻辑 (/owner/repo) ---

  /**
   * 处理仓库页面, 注入历史列表
   */
  async function handleRepoPage() {
    const currentRepo = location.pathname.slice(1);
    const allHistory = await getHistory();

    // 筛选并排序当前仓库的历史记录
    const repoHistory = allHistory
      .filter(entry => entry.repo === currentRepo)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // 如果没有历史记录, 则不执行任何操作
    // if (repoHistory.length === 0) {
    //   // console.log('DeepWiki History: 当前仓库没有本地记录。');
    //   return;
    // }

    // 注入桌面端列表
    injectDesktopList(repoHistory);

    // 监听移动端菜单, 准备注入
    setupMobileMenuListener(repoHistory);
  }

  /**
   * 注入桌面端列表
   */
  async function injectDesktopList(repoHistory) {
    try {
      // 等待页面内容渲染
      await waitForRepoPageReady();

      const target = document.querySelector('ul.overflow-y-auto');
      if (!target) {
        console.error('DeepWiki History: 未找到桌面端注入目标。');
        return;
      }

      const container = createHistoryListElement(repoHistory, DESKTOP_LIST_ID);
      injectHistoryList(target, container);

    } catch (error) {
      console.error('DeepWiki History: 注入桌面列表失败:', error);
    }
  }

  /**
   * 设置移动端菜单点击监听
   */
  function setupMobileMenuListener(repoHistory) {
    const spanEl = [...document.querySelectorAll('span')].find(x => x.textContent === 'Menu');
    const menuEl = spanEl?.parentElement?.parentElement;

    if (!menuEl) {
      // console.warn('DeepWiki History: 未找到移动端菜单按钮。');
      return;
    }

    // 监听菜单点击事件
    menuEl.addEventListener('click', async () => {
      // 菜单动画需要时间
      await new Promise(res => setTimeout(res, 150));

      // 检查菜单是否真的展开了 (通过旋转的箭头)
      const isMenuOpen = document.querySelector('svg.transition-transform.rotate-90');
      if (!isMenuOpen) return;

      // 寻找移动端菜单内部的列表
      const target = menuEl.querySelector('ul.overflow-y-auto');
      if (!target) {
        console.error('DeepWiki History: 未找到移动端注入目标。');
        return;
      }

      const container = createHistoryListElement(repoHistory, MOBILE_LIST_ID);
      injectHistoryList(target, container);
    });
  }

  /**
   * 实际执行注入的操作 (注入DOM)
   * @param {HTMLElement} target - 注入的目标元素 (ul)
   * @param {HTMLElement} insert - 要注入的元素 (div container)
   */
  function injectHistoryList(target, insert) {
    // 检查是否已注入, 避免重复
    if (!target || document.getElementById(insert.id)) return;

    if (!target.parentElement) {
      console.error('DeepWiki History: 注入目标没有父容器。');
      return;
    }

    // 插入到列表的
    target.parentElement.insertBefore(insert, target);
    // console.log('DeepWiki History: 注入组件完成。', insert.id);
  }

  // --- DOM 创建辅助函数 (模板) ---

  /**
   * (新) 创建一个标准分割线元素
   * @returns {HTMLHRElement}
   */
  function createHr() {
    const hr = document.createElement('hr');
    // 使用 CSS 变量来适配深色/浅色模式
    hr.style.cssText = `
        border: none;
        border-bottom: 1px solid var(--border-divider, #eee);
        margin: 12px 0;
    `;
    return hr;
  }

  /**
   * (新) (模板函数)
   * 根据历史条目创建 <li> 元素
   * @param {object} entry - 历史条目
   * @returns {HTMLLIElement}
   */
  function createHistoryItemElement(entry) {
    const li = document.createElement('li');
    li.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px;
        margin-bottom: 4px;
        font-size: 14px;
    `;

    // 1. 创建链接
    const { pathname, search } = new URL(entry.fullUrl);
    const url = pathname + search;

    const link = document.createElement('a');
    link.href = url;
    link.textContent = entry.prompt;
    link.title = `保存于: ${new Date(entry.timestamp).toLocaleString()}\n点击跳转: ${entry.fullUrl}`;
    link.className = 'hover:bg-hover block w-full rounded px-2 py-1.5 text-left text-sm transition-none text-secondary';
    link.style.cssText = `
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-decoration: none;
        cursor: pointer;
    `;

    // 点击链接时, 使用 Next.js 的路由跳转, 避免刷新
    link.addEventListener('click', e => {
      e.preventDefault();
      unsafeWindow.next.router.push(url);
    });

    // 2. 创建删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.title = '移除此条记录';
    deleteBtn.style.cssText = `
        margin-left: 10px;
        cursor: pointer;
        border: none;
        background: transparent;
        color: var(--text-tertiary, #999);
        font-size: 16px;
        padding: 0 5px;
    `;
    // 悬停效果
    deleteBtn.addEventListener('mouseover', () => deleteBtn.style.color = 'var(--text-primary, #333)');
    deleteBtn.addEventListener('mouseout', () => deleteBtn.style.color = 'var(--text-tertiary, #999)');

    // 点击删除
    deleteBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (confirm(`是否移除 "${entry.prompt}" 这条记录？\n(这只会从您的本地存储中删除)`)) {
        await removeHistoryEntry(entry.sessionId);

        // 从 DOM 中移除 (安全地查找父元素)
        const currentLi = e.target.closest('li');
        const currentList = currentLi?.parentElement;
        const currentContainer = currentList?.parentElement;

        currentLi?.remove();

        // 如果列表空了, 移除整个容器 (包括分割线和标题)
        if (currentList && currentList.children.length === 0) {
            currentContainer?.remove();
        }
      }
    });

    li.appendChild(link);
    li.appendChild(deleteBtn);

    return li;
  }

  /**
   * 创建历史列表的 HTML 容器元素 (包含分割线、标题和列表)
   * @param {Array} repoHistory - 当前仓库的历史记录
   * @param {string} elementId - 容器的 DOM ID
   * @returns {HTMLElement}
   */
  function createHistoryListElement(repoHistory, elementId) {
    const container = document.createElement('div');
    container.id = elementId;

    // 1. 顶部分割线
    container.appendChild(createHr());

    // 2. 标题
    const title = document.createElement('h3');
    title.style.cssText = `
        padding: 0 8px;
        margin-top: 16px;
        margin-bottom: 8px;
        font-weight: 600;
        font-size: 14px;
        color: var(--text-secondary, #888);
    `;
    title.textContent = '本地对话记录';
    container.appendChild(title);

    // 3. 列表 (UL)
    const list = document.createElement('ul');
    list.style.cssText = 'list-style: none; padding: 0; margin: 0;';

    // 4. 填充列表项 (LIs) - 使用模板函数
    repoHistory.forEach(entry => {
      // 使用新的模板函数创建 <li>
      const li = createHistoryItemElement(entry);
      list.appendChild(li);
    });

    container.appendChild(list);

    // 5. 底部分割线 (按用户要求添加)
    const bottomHr = createHr();
    bottomHr.style.marginTop = '8px'; // 列表和分割线之间留点空隙
    container.appendChild(bottomHr);

    return container;
  }

  // --- DOM 辅助函数 ---

  /**
   * 通用的 MutationObserver 等待函数
   * @param {HTMLElement} target - 要观察的 DOM 节点
   * @param {Function} predicate - 判断是否满足条件的函数 (mutation) => boolean
   * @param {object} config - MutationObserver 的配置
   */
  function observeMutations(
    target,
    predicate,
    config = { attributes: false, childList: true, subtree: true }
  ) {
    return new Promise((resolve, reject) => {
      if (!target) {
        return reject(new Error('observeMutations: 目标元素不存在。'));
      }
      // console.log('开始观察:', target);
      const observer = new MutationObserver((mutationsList, obs) => {
        for (let mutation of mutationsList) {
          if (predicate(mutation)) {
            // console.log('观察到目标变化, 停止观察。');
            obs.disconnect(); // 满足条件, 停止观察
            resolve();
            return;
          }
        }
      });
      observer.observe(target, config);
    });
  }

  /**
   * 等待仓库页面主要内容渲染完成
   * (原始逻辑: 等待 textarea 或特定 DOM 变化)
   */
  async function waitForRepoPageReady() {
    const textarea = document.querySelector('textarea');
    // console.log('waitForRepoPageReady: 检查 textarea...', textarea != null);
    if (textarea) {
      return; // 如果 textarea 已经存在, 说明页面已就绪
    } else {
      // 否则, 等待特定
      return observeMutations(
        document.querySelector('#codebase-wiki-repo-page'), // 仓库页根节点
        (mutation) => mutation.target.classList.contains('z-10') && mutation.addedNodes.length > 0
      );
    }
  }

  // --- 存储辅助函数 (GM_ functions) ---

  /**
   * 异步获取所有历史记录
   * @returns {Promise<Array>}
   */
  async function getHistory() {
    const historyJson = await GM_getValue(HISTORY_KEY, '[]');
    try {
      return JSON.parse(historyJson);
    } catch (e) {
      console.error('DeepWiki History: 解析本地历史失败', e);
      return []; // 出错时返回空数组
    }
  }

  /**
   * 异步保存整个历史记录数组
   * @param {Array} historyArray
   */
  async function saveHistory(historyArray) {
    // console.log('saveHistory: ', historyArray);
    await GM_setValue(HISTORY_KEY, JSON.stringify(historyArray));
  }

  /**
   * 添加一条新的历史记录 (如果不存在)
   * @param {object} entry - 新的历史条目
   */
  async function addHistoryEntry(entry) {
    const history = await getHistory();
    // 检查 sessionId 是否已存在, 避免重复添加
    if (!history.some(e => e.sessionId === entry.sessionId)) {
      history.push(entry);
      await saveHistory(history);
      console.log('DeepWiki History: 已保存新聊天。', entry);
    }
  }

  /**
   * 根据 sessionId 移除一条历史记录
   * @param {string} sessionId
   */
  async function removeHistoryEntry(sessionId) {
    let history = await getHistory();
    history = history.filter(entry => entry.sessionId !== sessionId);
    await saveHistory(history);
    console.log('DeepWiki History: 已移除聊天。', sessionId);
  }


  // --- 脚本入口 ---
  setupRouteListener();

  // 立即执行一次, 应对初始页面加载
  handleRouteChange();

})();