// ==UserScript==
// @name         M系镜像站扩展-屏蔽功能（通过用户名）Mirror chromaso Forum Block by Username (Final Optimized Version)
// @namespace    https://mirror.chromaso.net/
// @version      1.2
// @description  屏蔽指定用户名的发言与帖子；支持替换/隐藏模式；右上角浮动面板管理名单和模式；徽章标签可自定义颜色；引用块也会屏蔽；导入/导出名单；性能优化（节流+增量处理）
// @match        https://mirror.chromaso.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561585/M%E7%B3%BB%E9%95%9C%E5%83%8F%E7%AB%99%E6%89%A9%E5%B1%95-%E5%B1%8F%E8%94%BD%E5%8A%9F%E8%83%BD%EF%BC%88%E9%80%9A%E8%BF%87%E7%94%A8%E6%88%B7%E5%90%8D%EF%BC%89Mirror%20chromaso%20Forum%20Block%20by%20Username%20%28Final%20Optimized%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561585/M%E7%B3%BB%E9%95%9C%E5%83%8F%E7%AB%99%E6%89%A9%E5%B1%95-%E5%B1%8F%E8%94%BD%E5%8A%9F%E8%83%BD%EF%BC%88%E9%80%9A%E8%BF%87%E7%94%A8%E6%88%B7%E5%90%8D%EF%BC%89Mirror%20chromaso%20Forum%20Block%20by%20Username%20%28Final%20Optimized%20Version%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let blockedUsers = GM_getValue('blockedUsers', []);
  let blockMode = GM_getValue('blockMode', 'replace');
  let panelCollapsed = GM_getValue('panelCollapsed', false);
  let badgeColor = GM_getValue('badgeColor', '#ff4d4f');

  const text = (el) => (el && el.textContent ? el.textContent.trim() : '');
  const normalizeName = (s) => (s || '').trim().replace(/["'：:]/g, '').toLowerCase();
  const getBlockedSet = () => new Set(blockedUsers.map(normalizeName));

  // 添加屏蔽按钮
  function addBlockButtonAfter(linkEl, usernameDisplay) {
    if (!linkEl || !usernameDisplay) return;
    if (linkEl.dataset.blockButtonAdded) return;
    const btn = document.createElement('button');
    btn.textContent = '屏蔽此人';
    btn.style.marginLeft = '8px';
    btn.style.fontSize = '12px';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      const normalized = normalizeName(usernameDisplay);
      const exists = blockedUsers.some((u) => normalizeName(u) === normalized);
      if (!exists) {
        blockedUsers.push(usernameDisplay);
        GM_setValue('blockedUsers', blockedUsers);
        applyAll();
        updatePanel();
        alert(`已屏蔽用户：${usernameDisplay}`);
      }
    });
    linkEl.insertAdjacentElement('afterend', btn);
    linkEl.dataset.blockButtonAdded = 'true';
  }

  // 添加徽章
  function addBadge(linkEl) {
    if (!linkEl || linkEl.dataset.blockTagAdded) return;
    const tag = document.createElement('span');
    tag.textContent = '已屏蔽用户';
    tag.style.backgroundColor = badgeColor;
    tag.style.color = '#fff';
    tag.style.fontSize = '12px';
    tag.style.marginLeft = '6px';
    tag.style.padding = '2px 6px';
    tag.style.borderRadius = '4px';
    tag.style.fontWeight = 'bold';
    tag.style.display = 'inline-block';
    linkEl.insertAdjacentElement('afterend', tag);
    linkEl.dataset.blockTagAdded = 'true';
  }

  // 楼层处理
  function handlePosts(blockedSet) {
    document.querySelectorAll('.mm-post').forEach((post) => {
      if (post.dataset.blockChecked) return;
      post.dataset.blockChecked = 'true';

      const nameLink = post.querySelector('.card-header .ui-link[href^="/author/"]');
      const usernameRaw = text(nameLink);
      const username = normalizeName(usernameRaw);
      if (!username) return;

      if (blockedSet.has(username)) {
        addBadge(nameLink);
        if (blockMode === 'hide') {
          post.style.display = 'none';
        } else {
          const body = post.querySelector('.card-body');
          if (body) body.textContent = '已屏蔽用户的发言';
        }
      } else {
        addBlockButtonAfter(nameLink, usernameRaw);
      }

      // 引用块处理
      post.querySelectorAll('blockquote').forEach((quote) => {
        let citedNameRaw = '';
        const citeEl = quote.querySelector('cite');
        if (citeEl) {
          const authorLinkInCite = citeEl.querySelector('a[href^="/author/"]');
          if (authorLinkInCite) {
            citedNameRaw = authorLinkInCite.textContent || '';
          } else {
            citedNameRaw = (citeEl.textContent || '').split(/[:：]/)[0];
          }
        }
        const citedName = normalizeName(citedNameRaw);
        if (citedName && blockedSet.has(citedName)) {
          if (blockMode === 'hide') {
            quote.style.display = 'none';
          } else {
            quote.innerHTML = '已屏蔽用户的引用内容';
          }
        }
      });
    });
  }

  // 主题列表页处理
  function handleThreadList(blockedSet) {
    const table = document.querySelector('#thread-table-main');
    if (!table) return;
    table.querySelectorAll('tbody > tr').forEach((row) => {
      if (row.dataset.blockChecked) return;
      row.dataset.blockChecked = 'true';

      const authorLink = row.querySelector('a[href^="/author/"]');
      const authorNameRaw = text(authorLink);
      const authorName = normalizeName(authorNameRaw);
      if (!authorName) return;

      if (blockedSet.has(authorName)) {
        addBadge(authorLink);
        if (blockMode === 'hide') {
          row.style.display = 'none';
        } else {
          const titleLink = row.querySelector('a.ui-link[href^="/thread/"]');
          if (titleLink) titleLink.textContent = '已屏蔽用户的帖子';
          const small = row.querySelector('small');
          if (small) small.textContent = '';
        }
      } else {
        addBlockButtonAfter(authorLink, authorNameRaw);
      }
    });
  }

  // 主题帖详情页顶部
  function handleThreadHeader(blockedSet) {
    document.querySelectorAll('.thread-header, .card.thread-header').forEach((header) => {
      if (header.dataset.blockChecked) return;
      header.dataset.blockChecked = 'true';

      const nameLink = header.querySelector('.ui-link[href^="/author/"]');
      const usernameRaw = text(nameLink);
      const username = normalizeName(usernameRaw);
      if (!username) return;

      if (blockedSet.has(username)) {
        addBadge(nameLink);
        if (blockMode === 'hide') {
          header.style.display = 'none';
        } else {
          const body = header.querySelector('.card-body, .thread-body');
          if (body) body.textContent = '已屏蔽用户的帖子';
        }
      } else {
        addBlockButtonAfter(nameLink, usernameRaw);
      }
    });
  }

  // 应用所有处理
  function applyAll() {
    const blockedSet = getBlockedSet();
    handlePosts(blockedSet);
    handleThreadHeader(blockedSet);
    handleThreadList(blockedSet);
  }

  // 节流函数
  function throttle(fn, delay) {
    let timer = null;
    return function (...args) {
      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(this, args);
          timer = null;
        }, delay);
      }
    };
  }

  // MutationObserver 监听新增节点
  const observer = new MutationObserver(throttle((mutations) => {
    const blockedSet = getBlockedSet();
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.matches('.mm-post')) handlePosts(blockedSet);
          if (node.matches('tr')) handleThreadList(blockedSet);
        }
      });
    });
  }, 300));

  observer.observe(document.body, { childList: true, subtree: true });

  // 浮动面板
  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'block-panel';
    panel.style.position = 'fixed';
    panel.style.top = '60px';
    panel.style.right = '10px';
    panel.style.background = 'rgba(0,0,0,0.7)';
    panel.style.color = '#fff';
    panel.style.padding = '10px';
    panel.style.borderRadius = '5px';
    panel.style.zIndex = '9999';
    panel.style.fontSize = '14px';
    panel.style.maxWidth = '260px';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = panelCollapsed ? '展开面板' : '折叠面板';
    toggleBtn.style.marginBottom = '5px';
    toggleBtn.style.width = '100%';
    toggleBtn.addEventListener('click', () => {
      panelCollapsed = !panelCollapsed;
      GM_setValue('panelCollapsed', panelCollapsed);
      updatePanel();
    });
    panel.appendChild(toggleBtn);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'panel-content';
    panel.appendChild(contentDiv);

    document.body.appendChild(panel);
    updatePanel();
  }

  function updatePanel() {
    const contentDiv = document.querySelector('#panel-content');
    const toggleBtn = document.querySelector('#block-panel button');
    if (!contentDiv || !toggleBtn) return;

    toggleBtn.textContent = panelCollapsed ? '展开面板' : '折叠面板';
    contentDiv.innerHTML = '';

    if (panelCollapsed) {
      const collapsedMsg = document.createElement('div');
      collapsedMsg.textContent = '面板已折叠';
      collapsedMsg.style.fontSize = '12px';
      collapsedMsg.style.color = '#ccc';
      contentDiv.appendChild(collapsedMsg);
      return;
    }

    const title = document.createElement('div');
    title.textContent = '屏蔽管理面板';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '5px';
    contentDiv.appendChild(title);

    const modeBtn = document.createElement('button');
    modeBtn.textContent = `切换模式 (当前: ${blockMode})`;
    modeBtn.style.marginBottom = '5px';
    modeBtn.style.width = '100%';
    modeBtn.addEventListener('click', () => {
      blockMode = blockMode === 'hide' ? 'replace' : 'hide';
      GM_setValue('blockMode', blockMode);
      applyAll();
      updatePanel();
    });
    contentDiv.appendChild(modeBtn);

    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '在更新列表后建议F5手动刷新页面';
    refreshBtn.style.marginBottom = '5px';
    refreshBtn.style.width = '100%';
    refreshBtn.addEventListener('click', () => {
      applyAll();
      updatePanel();
    });
    contentDiv.appendChild(refreshBtn);

    const colorLabel = document.createElement('label');
    colorLabel.textContent = '徽章颜色: ';
    colorLabel.style.display = 'block';
    colorLabel.style.marginTop = '5px';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = badgeColor;
    colorInput.style.marginTop = '5px';
    colorInput.style.width = '100%';
    colorInput.style.height = '32px';
    colorInput.style.boxSizing = 'border-box';
    colorInput.addEventListener('input', () => {
      badgeColor = colorInput.value;
      GM_setValue('badgeColor', badgeColor);
      applyAll();
      updatePanel();
    });
    colorLabel.appendChild(colorInput);
    contentDiv.appendChild(colorLabel);

    const listTitle = document.createElement('div');
    listTitle.textContent = `屏蔽用户列表（当前数量：${blockedUsers.length}）`;
    listTitle.style.marginTop = '8px';
    listTitle.style.fontWeight = 'bold';
    listTitle.style.borderTop = '1px solid #ccc';
    listTitle.style.paddingTop = '5px';
    contentDiv.appendChild(listTitle);

    const listDiv = document.createElement('div');
    listDiv.id = 'block-list';
    contentDiv.appendChild(listDiv);

    if (blockedUsers.length === 0) {
      listDiv.textContent = '暂无屏蔽用户';
    } else {
      blockedUsers.forEach((u) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        item.style.marginTop = '4px';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${u} （已屏蔽用户）`;
        item.appendChild(nameSpan);

        const btn = document.createElement('button');
        btn.textContent = '解除';
        btn.style.marginLeft = '8px';
        btn.style.fontSize = '12px';
        btn.addEventListener('click', () => {
          blockedUsers = blockedUsers.filter((x) => normalizeName(x) !== normalizeName(u));
          GM_setValue('blockedUsers', blockedUsers);
          applyAll();
          updatePanel();
          alert(`已解除屏蔽：${u}`);
        });
        item.appendChild(btn);

        listDiv.appendChild(item);
      });
    }

    const exportBtn = document.createElement('button');
    exportBtn.textContent = '导出名单';
    exportBtn.style.marginTop = '8px';
    exportBtn.style.width = '100%';
    exportBtn.addEventListener('click', () => {
      const data = JSON.stringify(blockedUsers, null, 2);
      prompt('复制以下内容保存：', data);
    });
    contentDiv.appendChild(exportBtn);

    const importBtn = document.createElement('button');
    importBtn.textContent = '导入名单';
    importBtn.style.marginTop = '5px';
    importBtn.style.width = '100%';
    importBtn.addEventListener('click', () => {
      const input = prompt('粘贴之前导出的名单 JSON：');
      if (input) {
        try {
          const arr = JSON.parse(input);
          if (Array.isArray(arr)) {
            blockedUsers = arr;
            GM_setValue('blockedUsers', blockedUsers);
            applyAll();
            updatePanel();
            alert('名单已导入成功！');
          } else {
            alert('格式错误：需要是 JSON 数组');
          }
        } catch (e) {
          alert('解析失败：' + e.message);
        }
      }
    });
    contentDiv.appendChild(importBtn);
  }

  // 初次执行
  applyAll();
  createPanel();
})();
