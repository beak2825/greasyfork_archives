// ==UserScript==
// @name         推特搜索助手-Twitter Search Assistant Enhanced
// @namespace    example.twitter.enhanced
// @version      2.25
// @description  推特搜索助手（描述不变）
// @match        https://twitter.com/*
// @match        https://x.com/*
// @author       Devol
// @grant        none
// @license      MIT
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @downloadURL https://update.greasyfork.org/scripts/554831/%E6%8E%A8%E7%89%B9%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B-Twitter%20Search%20Assistant%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/554831/%E6%8E%A8%E7%89%B9%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B-Twitter%20Search%20Assistant%20Enhanced.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const S = {
    containerId: 'tw-search-container',
    assistantId: 'tw-search-assistant',
    historyId: 'tw-history-panel',
    keywordId: 'tw-keyword',
    gridCls: 'preset-grid',
    historyListCls: 'history-list',
    modeIndicatorCls: 'mode-indicator',
    btnApplyCls: 'btn-apply',
    btnClearCls: 'btn-clear',
    btnClearHistCls: 'clear-history',
    presetBtnCls: 'preset-btn',
    show: 'show',
    hideSoft: 'hide-soft', // 新增：面板丝滑隐藏类（用于媒体期间）
    selected: 'selected',
    multi: 'multi-mode',
    emptyHistoryHtml: '<div class="empty-history">暂无搜索历史</div>',
    storageKey: 'tw-search-history',
  };

  const presets = {
    "📷 图片": "filter:images -filter:retweets -filter:replies",
    "🎬 视频": "filter:videos -filter:retweets -filter:replies",
    "🔥 高热度": "min_faves:200 -filter:retweets",
    "🈶 日语": "lang:ja -filter:retweets -filter:replies",
    "🌎 英语": "lang:en -filter:retweets -filter:replies",
    "⏰ 近期": "within_time:180d -filter:retweets",
  };

  const MAX_HISTORY = 20;

  const container = document.createElement('div');
  container.id = S.containerId;
  container.innerHTML = `
    <div id="${S.assistantId}">
      <div class="panel-header header-row">
        <span class="tw-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#1da1f2" style="display:block">
            <path d="M19.633 7.997c.013.178.013.355.013.533 0 5.42-4.127 11.675-11.675 11.675-2.32 0-4.474-.682-6.287-1.855.321.038.63.05.964.05a8.258 8.258 0 0 0 5.123-1.767 4.129 4.129 0 0 1-3.853-2.86c.25.038.5.063.763.063.367 0 .733-.05 1.075-.138A4.123 4.123 0 0 1 2.8 9.71v-.05c.551.304 1.19.488 1.867.513A4.116 4.116 0 0 1 2.87 6.3c0-.763.203-1.463.558-2.075a11.71 11.71 0 0 0 8.497 4.312 4.65 4.65 0 0 1-.101-.945 4.12 4.12 0 0 1 7.134-2.82 8.13 8.13 0 0 0 2.617-.995 4.13 4.13 0 0 1-1.812 2.28 8.26 8.26 0 0 0 2.372-.639 8.86 8.86 0 0 1-1.902 1.579z"></path>
          </svg>
        </span>
        <span>搜索助手</span>
      </div>
      <div class="${S.modeIndicatorCls} clickable">单选模式</div>
      <div class="keyword-container">
        <input id="${S.keywordId}" type="text" placeholder="输入关键词（自动获取当前搜索词）">
      </div>
      <div class="${S.gridCls}"></div>
      <div class="action-buttons">
        <button class="${S.btnClearCls}">清空</button>
        <button class="${S.btnApplyCls}" style="display:none;">应用搜索</button>
      </div>
    </div>
    <div id="${S.historyId}">
      <div class="history-header header-row header-split">
        <span>搜索历史</span>
        <button class="${S.btnClearHistCls}" title="清空历史">🗑️</button>
      </div>
      <div class="${S.historyListCls}"></div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #${S.containerId} {
      position: fixed; top: 5px; right: 70px; display: flex; gap: 4px; z-index: 10000;
      align-items: stretch; width: auto; min-width: 0;
      will-change: transform; transform: translateZ(0); transition: transform .12s ease-out;
    }
    /* 媒体打开时：容器轻微上移 + 禁用指针（保留合成层，丝滑） */
    #${S.containerId}.is-offscreen { transform: translate3d(0,-20px,0); pointer-events: none; }

    #${S.assistantId}, #${S.historyId} {
      background:#fff; border:1px solid #e1e8ed; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,.08);
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; font-size:13px; color:#0f1419;
      opacity:0; visibility:hidden; transform: translateZ(0); will-change: opacity, visibility;
      transition: opacity .12s ease-out, visibility .12s step-end;
    }
    #${S.assistantId} { width: 280px; flex-shrink: 0; }
    #${S.historyId} { width: 160px; max-width: 160px; flex-shrink: 0; overflow: hidden; }

    /* 常规显示 */
    #${S.assistantId}.${S.show}, #${S.historyId}.${S.show} { opacity: 1; visibility: visible; }

    /* 丝滑隐藏类：媒体期间叠加，避免“前端没缩回去”；并禁用交互 */
    #${S.assistantId}.${S.hideSoft}, #${S.historyId}.${S.hideSoft} {
      opacity: 0 !important; visibility: hidden !important; pointer-events: none !important;
      transition: opacity .12s ease-out, visibility .12s step-end;
    }

    #${S.assistantId}:hover, #${S.historyId}:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.12); }

    .header-row { display:flex; align-items:center; font-weight:600; border-bottom:1px solid #eff3f4;
      width:100%; box-sizing:border-box; overflow:hidden; padding:12px 16px 8px; gap:6px; justify-content:flex-start; }
    .header-split { justify-content: space-between; gap:0; padding:10px 12px 6px; }
    .tw-icon { display:inline-flex; align-items:center; justify-content:center; margin-right:2px; width:16px; height:16px; flex:0 0 16px; }

    .${S.modeIndicatorCls}.clickable {
      padding:6px 16px; font-size:12px; color:#536471; background:#f7f9fa; margin:0 16px 8px; border-radius:6px;
      text-align:center; cursor:pointer; transition:background .12s ease-out; user-select:none;
    }
    .${S.modeIndicatorCls}.clickable:hover { background:#e1e8ed; }
    .${S.modeIndicatorCls}.${S.multi} { background:#e8f5fe; color:#1da1f2; }
    .${S.modeIndicatorCls}.${S.multi}:hover { background:#d0e9f9; }

    .${S.btnClearHistCls} { background:none; border:none; cursor:pointer; font-size:14px; padding:2px 4px; border-radius:4px; transition:background .12s ease-out; flex-shrink:0; }
    .${S.btnClearHistCls}:hover { background:#f7f9fa; }

    .keyword-container { padding:0 16px 12px; }
    #${S.keywordId} { width:100%; padding:8px 12px; border:1px solid #eff3f4; border-radius:8px; font-size:14px; outline:none; transition:border-color .12s ease-out; box-sizing:border-box; }
    #${S.keywordId}:focus { border-color:#1da1f2; box-shadow:0 0 0 3px rgba(29,161,242,.1); }

    .${S.gridCls} { display:grid; grid-template-columns:1fr 1fr; gap:6px; padding:0 16px 12px; }

    .${S.presetBtnCls} {
      padding:8px 12px; background:#f7f9fa; border:1px solid #eff3f4; border-radius:8px; color:#0f1419; cursor:pointer;
      font-size:12px; transition:background .12s ease-out, border-color .12s ease-out; display:flex; align-items:center; gap:4px; box-sizing:border-box; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;
    }
    .${S.presetBtnCls}:hover { background:#e8f5fe; border-color:#cfe5f7; }
    .${S.presetBtnCls}.${S.selected} { background:#e8f5fe; color:#1da1f2; border-color:#1da1f2; }
    .${S.presetBtnCls}.${S.selected}::after { content:'✓'; margin-left:auto; font-size:11px; font-weight:bold; }

    .${S.historyListCls} { padding:4px 8px; max-height:400px; overflow:auto; }
    .history-item { padding:6px 8px; border-radius:6px; cursor:pointer; transition:background .12s ease-out; font-size:12px; color:#0f1419; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block; }
    .history-item:hover { background:#f7f9fa; }
    .history-item:active { background:#e1e8ed; }
    .empty-history { padding:16px 8px; text-align:center; color:#536471; font-size:11px; }

    .action-buttons { display:flex; gap:8px; padding:0 16px 16px; }
    .${S.btnClearCls}, .${S.btnApplyCls} { flex:1; padding:8px; border:none; border-radius:8px; font-size:13px; cursor:pointer; transition:background .12s ease-out; font-weight:500; }
    .${S.btnClearCls} { background:#f7f9fa; color:#536471; border:1px solid #eff3f4; }
    .${S.btnClearCls}:hover { background:#e1e8ed; }
    .${S.btnApplyCls} { background:#1da1f2; color:#fff; }
    .${S.btnApplyCls}:hover { background:#1a91da; }
    .${S.btnApplyCls}.active { background:#17bf63; box-shadow:0 2px 8px rgba(23,191,99,.3); }

    @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
  `;
  document.head.append(style);
  document.body.append(container);

  const $ = {
    container,
    assistant: container.querySelector('#' + S.assistantId),
    history: container.querySelector('#' + S.historyId),
    mode: container.querySelector('.' + S.modeIndicatorCls),
    apply: container.querySelector('.' + S.btnApplyCls),
    clear: container.querySelector('.' + S.btnClearCls),
    clearHist: container.querySelector('.' + S.btnClearHistCls),
    historyList: container.querySelector('.' + S.historyListCls),
    keyword: container.querySelector('#' + S.keywordId),
    grid: container.querySelector('.' + S.gridCls),
  };

  let isMulti = false;
  const selected = new Set();

  const on = (el, ev, fn, opt) => el.addEventListener(ev, fn, opt);
  const toggleClass = (el, cls, cond) => { if (cond) el.classList.add(cls); else el.classList.remove(cls); };
  const escapeHtml = (t) => { const div = document.createElement('div'); div.textContent = t; return div.innerHTML; };

  const getHistory = () => { try { return JSON.parse(localStorage.getItem(S.storageKey) || '[]'); } catch { return []; } };
  const setHistory = (arr) => { try { localStorage.setItem(S.storageKey, JSON.stringify(arr)); } catch {} };
  const saveHistory = (kw) => {
    if (!kw || !(kw = kw.trim())) return;
    const hist = getHistory();
    const idx = hist.indexOf(kw);
    if (idx >= 0) hist.splice(idx, 1);
    hist.unshift(kw);
    if (hist.length > MAX_HISTORY) hist.length = MAX_HISTORY;
    setHistory(hist);
    renderHistory(hist);
  };
  const clearAllHistory = () => { try { localStorage.removeItem(S.storageKey); } catch {} renderHistory([]); };

  const renderHistory = (hist = getHistory()) => {
    if (hist.length === 0) { $.historyList.innerHTML = S.emptyHistoryHtml; return; }
    $.historyList.innerHTML = hist.map(item =>
      `<div class="history-item" data-k="${encodeURIComponent(item)}">${escapeHtml(item)}</div>`
    ).join('');
  };

  const extractKeywordOnly = (url) => {
    const i = url.indexOf('/search?q=');
    if (i < 0) return '';
    const m = url.slice(i).match(/\/search\?q=([^&]+)/);
    if (!m) return '';
    try {
      const query = decodeURIComponent(m[1]);
      return query.split(/\s+(?:filter:|lang:|min_faves:|since:|from:|to:|until:|OR|AND|NOT)/)[0].trim();
    } catch { return ''; }
  };

  const initButtons = () => {
    const frag = document.createDocumentFragment();
    Object.keys(presets).forEach(name => {
      const b = document.createElement('button');
      b.className = S.presetBtnCls;
      b.textContent = name;
      b.dataset.filter = presets[name];
      frag.appendChild(b);
    });
    $.grid.appendChild(frag);
  };

  on($.grid, 'click', (e) => {
    const btn = e.target.closest('.' + S.presetBtnCls);
    if (!btn) return;
    const filter = btn.dataset.filter;
    if (isMulti) {
      const has = selected.has(filter);
      if (has) { selected.delete(filter); btn.classList.remove(S.selected); }
      else { selected.add(filter); btn.classList.add(S.selected); }
      updateApply();
      return;
    }
    const kw = ($.keyword.value.trim() || extractKeywordOnly(location.href));
    if (!kw) { alert('请输入关键词'); return; }
    saveHistory(kw);
    location.href = `https://twitter.com/search?q=${encodeURIComponent(kw + ' ' + filter)}&src=typed_query&f=top`;
  });

  on($.historyList, 'click', (e) => {
    const item = e.target.closest('.history-item');
    if (!item) return;
    const kw = decodeURIComponent(item.dataset.k || '');
    if (kw) $.keyword.value = kw;
  });

  on($.clear, 'click', () => { selected.clear(); $.grid.querySelectorAll('.' + S.selected).forEach(b => b.classList.remove(S.selected)); updateApply(); });
  on($.apply, 'click', () => {
    if (!isMulti || selected.size === 0) { alert('多选模式下请至少选择一个筛选条件'); return; }
    const kw = ($.keyword.value.trim() || extractKeywordOnly(location.href));
    if (!kw) { alert('请输入关键词'); return; }
    saveHistory(kw);
    const finalQuery = `${kw} ${Array.from(selected).join(' ')}`.trim();
    location.href = `https://twitter.com/search?q=${encodeURIComponent(finalQuery)}&src=typed_query&f=top`;
  });
  on($.mode, 'click', () => {
    isMulti = !isMulti;
    $.mode.textContent = isMulti ? '多选模式' : '单选模式';
    toggleClass($.mode, S.multi, isMulti);
    $.apply.style.display = isMulti ? 'block' : 'none';
    selected.clear(); $.grid.querySelectorAll('.' + S.selected).forEach(b => b.classList.remove(S.selected));
    updateApply();
  });
  on($.clearHist, 'click', clearAllHistory);

  const updateApply = () => {
    if (!isMulti) return;
    const n = selected.size;
    $.apply.classList.toggle('active', n > 0);
    $.apply.textContent = n > 0 ? `应用搜索(${n})` : '应用搜索';
  };

  const observeUrlChanges = () => {
    let current = location.href;
    let t;
    const handler = () => {
      if (location.href === current) return;
      current = location.href;
      const kw = extractKeywordOnly(current);
      if (kw && !$.keyword.value) $.keyword.value = kw;
      if (selected.size) { selected.clear(); $.grid.querySelectorAll('.' + S.selected).forEach(b => b.classList.remove(S.selected)); updateApply(); }
    };
    const emit = () => { clearTimeout(t); t = setTimeout(handler, 50); };
    const wrap = (fn) => function(...args){ const r = fn.apply(this, args); emit(); return r; };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', emit);
  };

  // 
  const initMediaDetection = () => {
    const isMediaOpen = () =>
      document.querySelector('[aria-modal="true"],[data-testid="swipe-to-dismiss-container"],[data-testid="media-modal"]');

    let lastOff = false;
    let rafId;

    const setPanelsHidden = (hidden) => {
      $.container.classList.toggle('is-offscreen', hidden);
      $.assistant.classList.toggle(S.hideSoft, hidden);
      $.history.classList.toggle(S.hideSoft, hidden);
    };

    const apply = (off) => {
      if (off === lastOff) return;
      lastOff = off;
      setPanelsHidden(off);
    };

    const scheduleCheck = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const open = !!isMediaOpen();
        setTimeout(() => apply(open), 0);
      });
    };

    const obs = new MutationObserver((muts) => {
      for (const m of muts) { if (m.type === 'childList') { scheduleCheck(); break; } }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    apply(!!isMediaOpen());
  };

  const boot = () => {
    initButtons();
    renderHistory();
    const kw = extractKeywordOnly(location.href);
    if (kw && !$.keyword.value) $.keyword.value = kw;
    observeUrlChanges();
    initMediaDetection();
    requestAnimationFrame(() => {
      $.assistant.classList.add(S.show);
      $.history.classList.add(S.show);
    });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(boot, { timeout: 800 });
  } else {
    setTimeout(boot, 0);
  }
})();
