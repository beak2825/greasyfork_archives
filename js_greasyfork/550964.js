// ==UserScript==
// @name         FC2 标记下载状态
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.5
// @description  在 FC2 商品栏目标注状态（未下载/已下载/无资源），支持动态加载、过滤、导入/导出、美观UI、详情页与全局菜单，新增可伸缩面板与功能强大的收藏弹窗。
// @match        https://adult.contents.fc2.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/550964/FC2%20%E6%A0%87%E8%AE%B0%E4%B8%8B%E8%BD%BD%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/550964/FC2%20%E6%A0%87%E8%AE%B0%E4%B8%8B%E8%BD%BD%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log('[状态脚本] 加载（v1.5）');

  const STATES = ['未下载', '已下载', '无资源'];
  const COLORS = {
      '未下载': '#007bff', // Blue
      '已下载': '#28a745', // Green
      '无资源': '#dc3545'  // Red
  };
  const STORE_KEY = 'fc2_status_map_v1';
  const PANEL_STATE_KEY = 'fc2_panel_state_v1';
  const ITEMS_PER_PAGE_KEY = 'fc2_items_per_page_v1';

  /* ===== 存储帮助 ===== */
  function getStore() {
    try {
      const raw = GM_getValue(STORE_KEY, null);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      console.error('[状态脚本] 读取存储失败', e);
      return {};
    }
  }
  function saveStore(map) {
    try {
      GM_setValue(STORE_KEY, JSON.stringify(map));
    } catch (e) {
      console.error('[状态脚本] 保存存储失败', e);
    }
  }

  /* ===== CSS (v1.5) ===== */
  const css = `
  /* 通用项目容器样式 */
  .c-neoItem-1000_wrap, .c-cntCard-110-f {
      position: relative;
      transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
  }

  /* 右上角控制面板 */
  #fc2-status-panel {
    position: fixed; top: 12px; right: 12px; z-index: 9999999;
    background: rgba(255,255,255,0.95); border-radius: 10px;
    box-shadow: 0 6px 18px rgba(20,20,30,0.12);
    display:flex; align-items:center;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "PingFang SC";
    transition: all 0.2s ease-in-out;
  }
  #fc2-status-panel .fc2-panel-content {
      display: flex; gap:8px; align-items:center; padding: 8px;
      overflow: hidden;
      transition: all 0.2s ease-in-out;
  }
  #fc2-status-panel button, #fc2-status-panel select {
      font-size:13px;padding:7px 10px;border-radius:8px;cursor:pointer; border:1px solid rgba(0,0,0,0.08);
      background: linear-gradient(180deg, #fff, #f6f6f7); box-shadow: 0 2px 6px rgba(20,20,30,0.04);
      white-space: nowrap;
  }
  #fc2-panel-toggle {
      padding: 8px; border: none; background: transparent; cursor: pointer;
  }
  #fc2-panel-toggle svg { width: 24px; height: 24px; transition: transform 0.3s ease; }

  /* 面板折叠状态 */
  #fc2-status-panel.collapsed .fc2-panel-content { display: none; }
  #fc2-status-panel.collapsed #fc2-panel-toggle svg { transform: rotate(-90deg); }

  /* 状态标记按钮 */
  .fc2-status { display:inline-block; position:relative; margin-left:10px; vertical-align: middle; font-family: inherit; flex-shrink: 0; }
  .fc2-status-btn {
    display:inline-flex; gap:8px; align-items:center; padding: 8px 16px; border-radius:18px; border:none;
    color:#fff; font-weight:600; font-size:13px; cursor:pointer; box-shadow: 0 4px 12px rgba(16,24,40,0.12);
    transition: transform .12s ease, box-shadow .12s ease; user-select:none;
    position: relative; z-index: 10010;
  }
  .fc2-status-btn:active { transform: translateY(1px); }
  .fc2-status .caret { width:10px; height:10px; opacity:0.95; transform: translateY(1px); }

  /* （已下载）更明显的透明度 */
  .c-neoItem-1000_wrap.fc2-s-downloaded, .c-cntCard-110-f.fc2-s-downloaded { opacity: 0.32 !important; transform: scale(0.997); }

  /* 无资源：更明显的红色发光边框 */
  .c-neoItem-1000_wrap.fc2-s-noresource, .c-cntCard-110-f.fc2-s-noresource {
    box-shadow: 0 0 0 3px rgba(255,50,50,0.95), 0 10px 40px rgba(255,40,40,0.28), inset 0 0 40px rgba(255,0,0,0.06);
    background: rgba(255,230,230,0.18);
    transform: translateY(-2px) scale(1.01);
    z-index: 6;
  }
  .fc2-noresource-ribbon {
    position:absolute; top:8px; left:8px;
    background: linear-gradient(90deg,#ff6b6b,#ff2d2d); color:white; font-size:11px; font-weight:700;
    padding:4px 8px; border-radius:6px; transform: rotate(-10deg); box-shadow: 0 6px 18px rgba(255,50,50,0.2); pointer-events:none; z-index: 8;
  }

  /* 全局浮动菜单 */
  #fc2-global-status-menu {
    position: fixed; display:none; min-width:160px; border-radius:10px; background:#fff; padding:6px;
    box-shadow: 0 18px 48px rgba(10,10,20,0.2); z-index: 2147483646; font-weight:700;
  }
  #fc2-global-status-menu li { list-style:none; padding:8px 10px; border-radius:8px; cursor:pointer; display:flex; gap:8px; align-items:center; color:#222; }
  #fc2-global-status-menu li:hover { background: rgba(0,0,0,0.04); }
  .fc2-dot { width:10px; height:10px; border-radius:50%; flex-shrink: 0; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.12); }

  /* 收藏夹弹窗 */
  #fc2-favorites-modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.6); z-index: 2147483640;
      display: flex; align-items: center; justify-content: center;
  }
  #fc2-favorites-modal {
      width: 90%; max-width: 1200px; height: 85vh; background: #f0f2f5;
      border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      display: flex; flex-direction: column; overflow: hidden;
  }
  .fc2-favorites-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 20px; border-bottom: 1px solid #e0e0e0; background: #fff;
  }
  .fc2-favorites-header h2 { margin: 0; font-size: 18px; }
  .fc2-favorites-filters button { margin-left: 8px; }
  .fc2-favorites-filters button.active { background: #007bff; color: white; border-color: #007bff; }
  .fc2-favorites-close { cursor: pointer; font-size: 28px; line-height: 1; opacity: 0.5; border:none; background:none; padding:0; }
  .fc2-favorites-close:hover { opacity: 1; }
  .fc2-favorites-content { flex-grow: 1; overflow-y: auto; padding: 10px; }
  .fc2-favorites-list { list-style: none; margin: 0; padding: 0; }
  .fc2-favorite-item { display: flex; align-items: flex-start; background: #fff; border-radius: 8px; padding: 12px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .fc2-favorite-item img { width: 120px; height: auto; border-radius: 4px; margin-right: 15px; flex-shrink: 0; }
  .fc2-favorite-info { flex-grow: 1; display: flex; flex-direction: column; min-width: 0; }
  .fc2-favorite-info h3 { margin: 0 0 8px; font-size: 16px; line-height: 1.3; }
  .fc2-favorite-info h3 a { text-decoration: none; color: #1a1a1a; }
  .fc2-favorite-info h3 a:hover { color: #007bff; }
  .fc2-favorite-info .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 5px 15px; font-size: 13px; color: #555; }
  .fc2-favorite-info .meta-grid p { margin: 0; }
  .fc2-favorites-pagination { display: flex; justify-content: center; align-items: center; gap: 10px; padding: 10px; border-top: 1px solid #e0e0e0; background: #fff; }
  .fc2-favorites-pagination button, .fc2-favorites-pagination input, .fc2-favorites-pagination select { padding: 5px 10px; }
  .fc2-favorites-pagination input { width: 60px; text-align: center; }
  .fc2-favorites-loading { text-align: center; padding: 50px; font-size: 16px; color: #888; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ===== 全局菜单（单例） ===== */
  let globalMenu = null;
  function ensureGlobalMenu() {
    if (globalMenu) return globalMenu;
    globalMenu = document.createElement('div');
    globalMenu.id = 'fc2-global-status-menu';
    globalMenu.innerHTML = '<ul style="margin:0;padding:6px;"></ul>';
    document.body.appendChild(globalMenu);
    document.addEventListener('click', (ev) => {
      if (globalMenu && globalMenu.style.display !== 'none' && !globalMenu.contains(ev.target)) hideGlobalMenu();
    }, true);
    window.addEventListener('keydown', (ev)=> { if (ev.key === 'Escape') hideGlobalMenu(); });
    window.addEventListener('scroll', ()=> hideGlobalMenu(), { passive: true });
    return globalMenu;
  }
  function showGlobalMenuFor(buttonEl, id) {
    const menu = ensureGlobalMenu();
    const ul = menu.querySelector('ul'); ul.innerHTML = '';
    STATES.forEach(s => {
      const li = document.createElement('li');
      li.dataset.val = s;
      li.innerHTML = `<span class="fc2-dot" style="background:${COLORS[s]}"></span><span style="flex:1;">${s}</span>`;
      li.onclick = (ev) => { ev.stopPropagation(); setItemStatus(id, s); hideGlobalMenu(); };
      ul.appendChild(li);
    });
    const rect = buttonEl.getBoundingClientRect();
    const margin = 8;
    menu.style.display = 'block';
    const menuW = menu.offsetWidth;
    const menuH = menu.offsetHeight;
    let left = rect.left + rect.width - menuW;
    let top = rect.bottom + margin;
    if (top + menuH > window.innerHeight - 8) top = rect.top - margin - menuH;
    menu.style.left = `${Math.max(8, left)}px`;
    menu.style.top = `${top}px`;
  }
  function hideGlobalMenu() {
    if (globalMenu) globalMenu.style.display = 'none';
  }

  /* ===== 核心逻辑 ===== */
  const ITEM_SELECTOR = '.c-neoItem-1000_wrap, .c-cntCard-110-f';

  function extractIdFromItem(item) {
    const link = item.querySelector('.c-cntCard-110-f_itemName a, .c-cntCard-110-f_thumb_link');
    if (!link) return null;
    const href = link.getAttribute('href') || '';
    const m = href.match(/article\/(\d+)/);
    return m ? m[1] : null;
  }

  function setItemStatus(id, state) {
    const store = getStore();
    store[id] = state;
    saveStore(store);
    document.querySelectorAll(ITEM_SELECTOR).forEach(item => {
      if (extractIdFromItem(item) === String(id)) applyVisualAndButton(item, id, state);
    });
    const detailRoot = document.querySelector('.items_article_headerTitleInArea');
    if (detailRoot && extractIdFromDetail() === String(id)) {
      applyVisualAndButton(detailRoot, id, state);
    }
  }

  function applyVisualAndButton(itemOrRoot, id, state) {
    let cardRoot = null;
    if (itemOrRoot.matches(ITEM_SELECTOR)) cardRoot = itemOrRoot;
    else cardRoot = document.querySelector('.items_article_headerTitleInArea');
    if (!cardRoot) return;

    const cont = cardRoot.querySelector(`.fc2-status[data-id="${id}"]`);
    if (cont) {
      const btn = cont.querySelector('.fc2-status-btn');
      const label = cont.querySelector('.fc2-status-label');
      if (label) label.textContent = state;
      if (btn) btn.style.background = `linear-gradient(180deg, ${COLORS[state]}, ${shadeColor(COLORS[state], -10)})`;
    }

    cardRoot.classList.remove('fc2-s-downloaded', 'fc2-s-noresource');
    cardRoot.querySelectorAll('.fc2-noresource-ribbon').forEach(el => el.remove());
    if (state === '已下载') {
      cardRoot.classList.add('fc2-s-downloaded');
    } else if (state === '无资源') {
      cardRoot.classList.add('fc2-s-noresource');
      const thumb = cardRoot.querySelector('.c-cntCard-110-f_thumb') || cardRoot.querySelector('.items_article_MainitemThumb > span');
      if (thumb) {
        const rb = document.createElement('div');
        rb.className = 'fc2-noresource-ribbon';
        rb.textContent = '无资源';
        if (getComputedStyle(thumb).position === 'static') thumb.style.position = 'relative';
        thumb.appendChild(rb);
      }
    }
  }

  function insertStatusControl(itemContainer, id) {
    if (itemContainer.querySelector(`.fc2-status[data-id="${id}"]`)) return;
    const store = getStore();
    const cur = store[id] || STATES[0];

    const cont = document.createElement('div');
    cont.className = 'fc2-status';
    cont.dataset.id = id;
    cont.innerHTML = `
      <button class="fc2-status-btn" type="button" style="background: linear-gradient(180deg, ${COLORS[cur]}, ${shadeColor(COLORS[cur], -10)})">
        <span class="fc2-status-label">${cur}</span>
        <svg class="caret" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M1 3l4 4 4-4" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>`;

    const btn = cont.querySelector('.fc2-status-btn');
    btn.onclick = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      showGlobalMenuFor(btn, id);
    };

    itemContainer.appendChild(cont);
    applyVisualAndButton(itemContainer.closest(ITEM_SELECTOR + ', .items_article_headerTitleInArea'), id, cur);
  }

  /* ===== 渲染与监听 ===== */
  function renderExistingItems() {
    document.querySelectorAll(ITEM_SELECTOR).forEach(item => {
      const id = extractIdFromItem(item);
      if (id) {
        const infoArea = item.querySelector('.c-cntCard-110-f_indetail') || item;
        insertStatusControl(infoArea, id);
      }
    });
  }

  const observer = new MutationObserver(muts => {
    muts.forEach(mut => mut.addedNodes.forEach(node => {
      if (node instanceof Element) {
        const items = node.matches(ITEM_SELECTOR) ? [node] : node.querySelectorAll(ITEM_SELECTOR);
        items.forEach(item => {
          const id = extractIdFromItem(item);
          if (id) {
            const infoArea = item.querySelector('.c-cntCard-110-f_indetail') || item;
            insertStatusControl(infoArea, id);
          }
        });
      }
    }));
    renderDetailPage();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  /* ===== 详情页 (v1.5 修复布局) ===== */
  function extractIdFromDetail() {
    const urlMatch = location.href.match(/article\/(\d+)/);
    return urlMatch ? urlMatch[1] : null;
  }
  function renderDetailPage() {
    const id = extractIdFromDetail();
    if (!id) return;

    const titleElement = document.querySelector('.items_article_headerTitleInArea h3');
    if (!titleElement || titleElement.querySelector('.fc2-status')) return;

    titleElement.style.display = 'flex';
    titleElement.style.alignItems = 'center';
    titleElement.style.justifyContent = 'space-between';

    const nodesToWrap = Array.from(titleElement.childNodes).filter(node => !node.classList || !node.classList.contains('fc2-status'));
    const titleSpan = document.createElement('span');
    nodesToWrap.forEach(node => titleSpan.appendChild(node.cloneNode(true)));

    // 清空 h3 并重新组合
    titleElement.innerHTML = '';
    titleElement.appendChild(titleSpan);

    insertStatusControl(titleElement, id);

    const store = getStore();
    const cur = store[id] || STATES[0];
    const root = document.querySelector('.items_article_headerTitleInArea');
    if (root) applyVisualAndButton(root, id, cur);
  }


  /* ===== 右上角面板 (v1.3) ===== */
  function buildPanel() {
      if (document.querySelector('#fc2-status-panel')) return;
      const panel = document.createElement('div');
      panel.id = 'fc2-status-panel';

      const content = document.createElement('div');
      content.className = 'fc2-panel-content';

      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'fc2-panel-toggle';
      toggleBtn.title = "展开/折叠面板";
      toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 l-3.84,0c-0.24,0-0.44,0.17-0.48,0.41L9.22,5.15C8.63,5.39,8.1,5.71,7.6,6.09L5.21,5.13C5,5.06,4.75,5.13,4.63,5.34L2.71,8.66 c-0.12,0.22-0.07,0.47,0.12,0.61L4.86,11c-0.05,0.3-0.07,0.62-0.07,0.94s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.38,2.34 c0.04,0.24,0.24,0.41,0.48,0.41l3.84,0c0.24,0,0.44-0.17,0.48-0.41l0.38-2.34c0.59-0.24,1.12-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0.01,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path></svg>`;

      toggleBtn.onclick = () => {
          const isCollapsed = panel.classList.toggle('collapsed');
          GM_setValue(PANEL_STATE_KEY, isCollapsed ? 'collapsed' : 'expanded');
      };

      const filter = document.createElement('select'); filter.title = "按状态过滤页面内容";
      ['全部', ...STATES].forEach(s => { filter.innerHTML += `<option value="${s}">显示: ${s}</option>`; });
      filter.onchange = () => applyFilter(filter.value);

      const btnFavorites = document.createElement('button'); btnFavorites.textContent = '显示已收藏'; btnFavorites.title = "打开弹窗显示所有已下载或无资源的项目";
      btnFavorites.onclick = openFavoritesModal;

      const btnExport = document.createElement('button'); btnExport.textContent = '导出';
      btnExport.onclick = exportStore;

      const btnImport = document.createElement('button'); btnImport.textContent = '导入';
      btnImport.onclick = openImportModal;

      const btnClear = document.createElement('button'); btnClear.textContent = '清空';
      btnClear.onclick = () => {
          if (confirm('确认清空所有状态？不可恢复。')) {
              saveStore({});
              document.querySelectorAll(ITEM_SELECTOR).forEach(it => resetItemVisual(it));
          }
      };

      content.append(filter, btnFavorites, btnExport, btnImport, btnClear);
      panel.append(content, toggleBtn);
      document.body.appendChild(panel);

      if (GM_getValue(PANEL_STATE_KEY, 'collapsed') === 'collapsed') {
          panel.classList.add('collapsed');
      }
  }

  function applyFilter(value) {
    document.querySelectorAll(ITEM_SELECTOR).forEach(item => {
      const id = extractIdFromItem(item);
      if (!id) { item.style.display = ''; return; }
      const cur = getStore()[id] || STATES[0];
      item.style.display = (value === '全部' || cur === value) ? '' : 'none';
    });
  }

  /* ===== 收藏夹功能 (v1.5) ===== */
  async function openFavoritesModal() {
      const overlay = document.createElement('div');
      overlay.id = 'fc2-favorites-modal-overlay';
      overlay.innerHTML = `
          <div id="fc2-favorites-modal">
              <div class="fc2-favorites-header">
                  <h2>已收藏项目</h2>
                  <div class="fc2-favorites-filters">
                      <button data-filter="全部" class="active">全部</button>
                      <button data-filter="已下载">已下载</button>
                      <button data-filter="无资源">无资源</button>
                  </div>
                  <button class="fc2-favorites-close">×</button>
              </div>
              <div class="fc2-favorites-content">
                  <div class="fc2-favorites-loading">加载中...</div>
                  <ul class="fc2-favorites-list"></ul>
              </div>
              <div class="fc2-favorites-pagination"></div>
          </div>
      `;
      document.body.appendChild(overlay);

      const modal = overlay.querySelector('#fc2-favorites-modal');
      modal.onclick = e => e.stopPropagation();
      overlay.onclick = () => overlay.remove();
      overlay.querySelector('.fc2-favorites-close').onclick = () => overlay.remove();

      let itemsPerPage = GM_getValue(ITEMS_PER_PAGE_KEY, 15);
      let currentPage = 1;
      let currentFilter = '全部';

      const renderPage = async (page) => {
          currentPage = page;
          const store = getStore();
          const allFavoriteIds = Object.keys(store).filter(id => store[id] === '已下载' || store[id] === '无资源');
          const filteredIds = allFavoriteIds.filter(id => currentFilter === '全部' || store[id] === currentFilter);

          const listEl = overlay.querySelector('.fc2-favorites-list');
          const loadingEl = overlay.querySelector('.fc2-favorites-loading');
          listEl.innerHTML = '';
          loadingEl.style.display = 'block';

          const start = (page - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          const pageIds = filteredIds.slice(start, end);

          const itemsData = await Promise.all(pageIds.map(id => fetchArticleDetails(id)));

          loadingEl.style.display = 'none';
          itemsData.forEach(data => {
              if (!data) return;
              const li = document.createElement('li');
              li.className = 'fc2-favorite-item';
              li.innerHTML = `
                  <img src="${data.thumb}" alt="${data.title}" />
                  <div class="fc2-favorite-info">
                      <h3><a href="https://adult.contents.fc2.com/article/${data.id}/" target="_blank" rel="noopener noreferrer">${data.title}</a></h3>
                      <div class="meta-grid">
                          <p><b>ID:</b> FC2-PPV-${data.id}</p>
                          <p><b>作者:</b> ${data.author || 'N/A'}</p>
                          <p><b>❤️ 登录数:</b> ${data.favoriteCount || 'N/A'}</p>
                          <p><b>📅 上架时间:</b> ${data.uploadDate || 'N/A'}</p>
                          <p><b>状态:</b> ${store[data.id]}</p>
                      </div>
                  </div>
              `;
              listEl.appendChild(li);
          });
          renderPagination(filteredIds.length);
      };

      const renderPagination = (totalItems) => {
          const paginationEl = overlay.querySelector('.fc2-favorites-pagination');
          const totalPages = Math.ceil(totalItems / itemsPerPage);
          paginationEl.innerHTML = '';

          const perPageLabel = document.createElement('span');
          perPageLabel.textContent = '每页显示:';
          const perPageInput = document.createElement('input');
          perPageInput.type = 'number';
          perPageInput.min = 5;
          perPageInput.value = itemsPerPage;
          perPageInput.onchange = () => {
              itemsPerPage = parseInt(perPageInput.value, 10) || 15;
              GM_setValue(ITEMS_PER_PAGE_KEY, itemsPerPage);
              renderPage(1);
          };

          if (totalPages > 1) {
              const prevBtn = document.createElement('button');
              prevBtn.textContent = '上一页';
              prevBtn.disabled = currentPage === 1;
              prevBtn.onclick = () => renderPage(currentPage - 1);

              const pageSelect = document.createElement('select');
              for(let i = 1; i <= totalPages; i++) {
                  const option = document.createElement('option');
                  option.value = i;
                  option.textContent = `第 ${i} 页`;
                  if(i === currentPage) option.selected = true;
                  pageSelect.appendChild(option);
              }
              pageSelect.onchange = () => renderPage(parseInt(pageSelect.value, 10));

              const pageInfo = document.createElement('span');
              pageInfo.textContent = `/ ${totalPages} 页`;

              const nextBtn = document.createElement('button');
              nextBtn.textContent = '下一页';
              nextBtn.disabled = currentPage === totalPages;
              nextBtn.onclick = () => renderPage(currentPage + 1);

              paginationEl.append(perPageLabel, perPageInput, prevBtn, pageSelect, pageInfo, nextBtn);
          } else {
              paginationEl.append(perPageLabel, perPageInput);
          }
      };

      overlay.querySelectorAll('.fc2-favorites-filters button').forEach(btn => {
          btn.onclick = () => {
              overlay.querySelector('.fc2-favorites-filters button.active').classList.remove('active');
              btn.classList.add('active');
              currentFilter = btn.dataset.filter;
              renderPage(1);
          };
      });

      renderPage(1);
  }

  const articleCache = new Map();
  async function fetchArticleDetails(id) {
      if (articleCache.has(id)) return articleCache.get(id);
      try {
          const response = await fetch(`https://adult.contents.fc2.com/article/${id}/`);
          if (!response.ok) return null;
          const htmlText = await response.text();
          const doc = new DOMParser().parseFromString(htmlText, 'text/html');

          // 优先从 ld+json 获取信息，更稳定
          let title = `项目 ${id}`, thumb = '', author = 'N/A';
          try {
              const scriptTag = doc.querySelector('script[type="application/ld+json"]');
              if(scriptTag) {
                  const jsonData = JSON.parse(scriptTag.textContent);
                  title = jsonData.name;
                  thumb = jsonData.image?.url;
                  author = jsonData.brand?.name;
              }
          } catch(e) { console.error('解析ld+json失败', e); }

          // 从页面元素中补充信息
          let favoriteCount = 'N/A';
          doc.querySelectorAll('.items_article_headerInfo ul li').forEach(li => {
              if (li.textContent.includes('登录数')) {
                  favoriteCount = li.querySelector('b')?.textContent || 'N/A';
              }
          });

          let uploadDate = 'N/A';
          doc.querySelectorAll('.items_article_softDevice p').forEach(p => {
              if (p.textContent.includes('上架时间')) {
                  uploadDate = p.textContent.split(':')[1]?.trim() || 'N/A';
              }
          });

          const details = { id, title, thumb, author, uploadDate, favoriteCount };
          articleCache.set(id, details);
          return details;
      } catch (error) {
          console.error(`[状态脚本] 获取项目详情失败: ${id}`, error);
          return {id, title: `项目 ${id} (加载失败)`, thumb: ''};
      }
  }

  /* ===== 导入/导出/清空/重置等 ===== */
  function openImportModal() {
      const overlay = document.createElement('div');
      overlay.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,0.45);z-index:2147483647;display:flex;align-items:center;justify-content:center';
      overlay.innerHTML = `
          <div style="width:520px;max-width:90vw;background:#fff;border-radius:12px;padding:16px;box-shadow:0 18px 60px rgba(0,0,0,0.28);">
              <h3 style="margin:0 0 8px 0;">导入状态 (JSON)</h3>
              <textarea placeholder='{"4745474":"已下载"}' style="width:100%;height:180px;padding:10px;border-radius:8px;border:1px solid #ddd;font-family:monospace;font-size:13px;"></textarea>
              <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px;">
                  <button type="button" class="cancel">取消</button>
                  <button type="button" class="ok">导入</button>
              </div>
          </div>
      `;
      document.body.appendChild(overlay);
      const ta = overlay.querySelector('textarea');
      overlay.querySelector('.cancel').onclick = () => overlay.remove();
      overlay.querySelector('.ok').onclick = () => {
          try {
              doImport(JSON.parse(ta.value.trim()));
              overlay.remove();
          } catch(e){ alert('无效 JSON'); }
      };
      overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  }

  function doImport(jsonObj) {
      if (typeof jsonObj !== 'object' || jsonObj === null) return;
      const store = getStore();
      let changed = 0;
      for (const k in jsonObj) {
          if (STATES.includes(jsonObj[k])) {
              store[String(k)] = jsonObj[k];
              changed++;
          }
      }
      saveStore(store);
      renderExistingItems();
      renderDetailPage();
  }

  function exportStore() {
    const map = getStore();
    const text = JSON.stringify(map, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `fc2_status_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function resetItemVisual(item) {
    item.classList.remove('fc2-s-downloaded', 'fc2-s-noresource');
    item.querySelectorAll('.fc2-noresource-ribbon').forEach(el => el.remove());
    const id = extractIdFromItem(item);
    if (!id) return;
    const cont = item.querySelector(`.fc2-status[data-id="${id}"]`);
    if (cont) {
      const btn = cont.querySelector('.fc2-status-btn');
      const label = cont.querySelector('.fc2-status-label');
      if (label) label.textContent = STATES[0];
      if (btn) btn.style.background = `linear-gradient(180deg, ${COLORS[STATES[0]]}, ${shadeColor(COLORS[STATES[0]], -10)})`;
    }
  }

  function shadeColor(hex, percent) {
    hex = hex.replace('#','');
    const num = parseInt(hex,16);
    let r = (num >> 16) + Math.round(255 * (percent/100));
    let g = ((num >> 8) & 0x00FF) + Math.round(255 * (percent/100));
    let b = (num & 0x0000FF) + Math.round(255 * (percent/100));
    r=Math.min(255,Math.max(0,r)); g=Math.min(255,Math.max(0,g)); b=Math.min(255,Math.max(0,b));
    return '#'+(0x1000000 + (r<<16) + (g<<8) + b).toString(16).slice(1);
  }

  /* ===== 启动初始化 ===== */
  function init() {
    buildPanel();
    setTimeout(() => {
        renderExistingItems();
        renderDetailPage();
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();