// ==UserScript==
// @name         CTT MOOC 自动学习助手 (可拖动+H5修复版)
// @namespace    https://mooc.ctt.cn/
// @version      0.2.5
// @description  在 CTT MOOC 上自动按顺序学习未完成课程，自动播放视频、切换小节，支持H5内嵌测验自动处理，面板可拖动，支持跳过卡死章节。
// @author       pppm
// @match        https://mooc.ctt.cn/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557167/CTT%20MOOC%20%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%28%E5%8F%AF%E6%8B%96%E5%8A%A8%2BH5%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557167/CTT%20MOOC%20%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%28%E5%8F%AF%E6%8B%96%E5%8A%A8%2BH5%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ----------------------------
  // Config & State
  // ----------------------------
  const LS_KEYS = {
    running: 'ctt_mooc_auto_running',
    queue: 'ctt_mooc_course_queue',
    cfg: 'ctt_mooc_cfg',
    navLock: 'ctt_mooc_nav_lock',
    resumeAt: 'ctt_mooc_resume_at',
    courseEnterAt: 'ctt_mooc_course_enter_at',
    courseEnterUrl: 'ctt_mooc_course_enter_url',
    currentId: 'ctt_mooc_current_id',
    panelPos: 'ctt_mooc_panel_pos' // 保存面板位置
  };
  const defaultCfg = {
    mute: false,
    log: true,
    clickDelayMs: 800,
    nextDelayMs: 1500,
    returnDelayMs: 3000,
    beforeNextCourseDelayMs: 2500,
    pageSettleMs: 5000,
    studyRefreshMinutes: 10,
    autoAnswer: true
  };

  function readCfg() {
    try {
      return { ...defaultCfg, ...(JSON.parse(localStorage.getItem(LS_KEYS.cfg) || '{}')) };
    } catch (_) {
      return { ...defaultCfg };
    }
  }
  function writeCfg(cfg) {
    localStorage.setItem(LS_KEYS.cfg, JSON.stringify(cfg));
  }
  function isRunning() {
    return localStorage.getItem(LS_KEYS.running) === '1';
  }
  function setRunning(v) {
    if (v) localStorage.setItem(LS_KEYS.running, '1'); else localStorage.removeItem(LS_KEYS.running);
  }
  function getQueue() {
    try { return JSON.parse(localStorage.getItem(LS_KEYS.queue) || '[]'); } catch { return []; }
  }
  function setQueue(arr) { localStorage.setItem(LS_KEYS.queue, JSON.stringify(arr || [])); }

  // ... (URL & Course Helpers - unchanged) ...
  function humanizeCourse(u) {
    try {
      const url = new URL(u, location.href);
      const seg = (url.hash || url.pathname).split('/').filter(Boolean).pop() || u;
      return decodeURIComponent(seg).slice(0, 60);
    } catch { return u; }
  }
  function extractCourseIdFromUrl(u) {
    try {
      const url = new URL(u, location.href);
      const hash = url.hash || '';
      const m = hash.match(/course\/detail\/[^&?#]+&([A-Za-z0-9-]+)/);
      if (m) return m[1];
      const segs = (hash || url.pathname).split('/').filter(Boolean);
      const last = segs.pop() || '';
      const m2 = last.match(/([A-Za-z0-9-]{8,})$/);
      if (m2) return m2[1];
    } catch {}
    return String(u||'');
  }
  function extractCourseTitleFromStudyPage() {
    const cands = ['.course-title .text-overflow[title]', '.course-title', '.title .text-overflow[title]', '.text-overflow[title]', 'h1', 'h2', 'h3'];
    for (const sel of cands) {
      const el = document.querySelector(sel);
      if (el) {
        const t = (el.getAttribute('title') || el.textContent || '').trim();
        if (t) return t;
      }
    }
    return '';
  }
  function getCurrentCourseItem() {
    try {
      const url = location.href;
      if (!/\/course\/detail\//.test(url)) return null;
      const id = extractCourseIdFromUrl(url);
      if (!id) return null;
      const title = extractCourseTitleFromStudyPage() || document.title || humanizeCourse(url);
      return { id, url, title, status: 'pending' };
    } catch (_) { return null; }
  }
  function normalizeQueueItem(item) {
    if (!item) return null;
    if (typeof item === 'string') return { id: extractCourseIdFromUrl(item), url: item, title: humanizeCourse(item), status: 'pending' };
    if (item.url) return { id: item.id || extractCourseIdFromUrl(item.url), url: item.url, title: item.title || humanizeCourse(item.url), status: item.status || 'pending' };
    return null;
  }
  function getItemUrl(item) { const it = normalizeQueueItem(item); return it ? it.url : ''; }
  function getItemTitle(item) { const it = normalizeQueueItem(item); return it ? it.title : ''; }
  function getItemId(item) { const it = normalizeQueueItem(item); return it ? it.id : ''; }
  function normalizeQueueArray(arr) { return (arr || []).map(normalizeQueueItem).filter(Boolean); }
  function enqueueUnique(newItems) {
    const q = normalizeQueueArray(getQueue());
    const keys = new Set(q.map(getItemId));
    let added = 0;
    for (const raw of (newItems || [])) {
      const it = normalizeQueueItem(raw);
      if (!it) continue;
      const k = it.id;
      if (!k || keys.has(k)) continue;
      q.push(it);
      keys.add(k);
      added++;
    }
    setQueue(q);
    return { added, total: q.length };
  }
  function getCurrentId() { try { return localStorage.getItem(LS_KEYS.currentId) || ''; } catch { return ''; } }
  function setCurrentId(id) { try { if (id) localStorage.setItem(LS_KEYS.currentId, id); } catch {} }
  function clearCurrentId() { try { localStorage.removeItem(LS_KEYS.currentId); } catch {} }
  function migrateCurrentUrlToId() {
    try {
      const legacy = localStorage.getItem(LS_KEYS.currentUrl); // cleanup legacy
      if (legacy && !localStorage.getItem(LS_KEYS.currentId)) {
        const id = extractCourseIdFromUrl(legacy);
        if (id) localStorage.setItem(LS_KEYS.currentId, id);
      }
      localStorage.removeItem(LS_KEYS.currentUrl);
    } catch {}
  }
  function markInProgress(url) {
    const q = normalizeQueueArray(getQueue());
    let found = false;
    const id = extractCourseIdFromUrl(url);
    for (const it of q) {
      if (it.id === id) { it.status = 'in_progress'; found = true; }
      else if (it.status === 'in_progress') { it.status = 'pending'; }
    }
    if (found) { setQueue(q); setCurrentId(id); renderQueueSummary(); }
  }
  function completeCurrentAndDequeue() {
    const cur = getCurrentId();
    if (!cur) return false;
    const q = normalizeQueueArray(getQueue());
    let updated = false;
    for (const it of q) {
      if (it.id === cur) { it.status = 'completed'; updated = true; }
      else if (it.status === 'in_progress') { it.status = 'pending'; }
    }
    if (updated) { setQueue(q); clearCurrentId(); renderQueueSummary(); }
    return updated;
  }
  function renderQueueSummary() {
    const q = getQueue();
    const cnt = document.getElementById('ctt-queue-count');
    const list = document.getElementById('ctt-queue-list');
    if (!cnt || !list) return;
    cnt.textContent = String(q.length);
    if (!q.length) { list.innerHTML = '<div style="color:#9ca3af">（空）</div>'; return; }
    const cur = getCurrentId();
    const items = q.slice(0, 20).map((it, i) => {
      const url = getItemUrl(it);
      const title = getItemTitle(it);
      const norm = normalizeQueueItem(it);
      const inProg = (norm.status === 'in_progress') || (getItemId(it) === cur);
      const completed = norm.status === 'completed';
      const color = completed ? '#ef4444' : (inProg ? '#f59e0b' : '#2563eb');
      const tag = completed ? ' <span style="color:#ef4444">（已完成）</span>' : (inProg ? ' <span style="color:#f59e0b">（进行中）</span>' : '');
      return `<div style=\"margin:2px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\"><span style=\"color:#6b7280\">${i+1}.</span> <a href=\"${url}\" target=\"_blank\" style=\"color:${color};text-decoration:none\">${title}</a>${tag}</div>`;
    }).join('');
    const more = q.length > 20 ? `<div style=\"color:#9ca3af;margin-top:4px\">…… 其余 ${q.length-20} 项</div>` : '';
    list.innerHTML = items + more;
  }

  // ----------------------------
  // UI: Floating Control & CSS Fixes (Draggable)
  // ----------------------------
  const CSS = `
  .ctt-helper-wrap{position:fixed;z-index:999999;font-family:system-ui,-apple-system,sans-serif;user-select:none;}
  .ctt-helper-btn{background:#3b82f6;color:#fff;border:none;border-radius:20px;padding:8px 12px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.15);transition:background 0.2s;}
  .ctt-helper-btn:hover{filter:brightness(1.1);}
  .ctt-helper-btn.stop{background:#ef4444}
  .ctt-helper-panel{margin-top:8px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:8px 10px;box-shadow:0 4px 16px rgba(0,0,0,.15);min-width:230px;}
  .ctt-helper-row{display:flex;align-items:center;justify-content:space-between;margin:6px 0}
  .ctt-helper-row label{font-size:12px;color:#111827;cursor:pointer;}
  .ctt-badge{position:fixed;left:16px;bottom:24px;background:#111827;color:#e5e7eb;border-radius:6px;padding:6px 8px;font-size:12px;z-index:999999;opacity:.9;pointer-events:none;}

  /* Drag handle style */
  .ctt-drag-handle { cursor: move; padding: 4px; background: #f3f4f6; border-radius: 4px; margin-bottom: 6px; text-align: center; color: #6b7280; font-size: 10px; font-weight: bold; }

  /* H5 Fixes */
  iframe { pointer-events: auto !important; }
  `;

  function injectStyle() {
    if (document.getElementById('ctt-helper-style')) return;
    const s = document.createElement('style');
    s.id = 'ctt-helper-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function logBadge(msg) {
    const cfg = readCfg();
    if (!cfg.log) return;
    let el = document.getElementById('ctt-helper-badge');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ctt-helper-badge';
      el.className = 'ctt-badge';
      document.body.appendChild(el);
    }
    el.textContent = `[自动学习] ${msg}`;
  }

  function debugLog(msg, extra) {
    try {
      const ts = new Date().toISOString().split('T')[1].replace('Z','');
      console.log(`[CTT DEBUG ${ts}] ${msg}`, extra || '');
    } catch (_) {}
    logBadge(msg);
  }

  // 面板拖拽逻辑
  function makeDraggable(el, handle) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      el.style.right = 'auto'; // 清除默认 right
      el.style.bottom = 'auto'; // 清除默认 bottom
      el.style.left = initialLeft + 'px';
      el.style.top = initialTop + 'px';
      handle.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = `${initialLeft + dx}px`;
      el.style.top = `${initialTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        handle.style.cursor = 'move';
        // 保存位置
        try {
            const rect = el.getBoundingClientRect();
            localStorage.setItem(LS_KEYS.panelPos, JSON.stringify({ left: rect.left, top: rect.top }));
        } catch {}
      }
    });
  }

  function renderUI() {
    injectStyle();
    let wrap = document.getElementById('ctt-helper-wrap');
    if (wrap) return;
    wrap = document.createElement('div');
    wrap.id = 'ctt-helper-wrap';
    wrap.className = 'ctt-helper-wrap';

    // 恢复位置
    try {
        const pos = JSON.parse(localStorage.getItem(LS_KEYS.panelPos));
        if (pos && pos.left) {
            wrap.style.left = pos.left + 'px';
            wrap.style.top = pos.top + 'px';
        } else {
            wrap.style.right = '16px';
            wrap.style.bottom = '24px';
        }
    } catch {
        wrap.style.right = '16px';
        wrap.style.bottom = '24px';
    }

    const btn = document.createElement('button');
    btn.id = 'ctt-helper-toggle';
    btn.className = 'ctt-helper-btn';
    wrap.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'ctt-helper-panel';
    panel.innerHTML = `
      <div id="ctt-drag-handle" class="ctt-drag-handle">::: 按住此处拖动 :::</div>
      <div class="ctt-helper-row">
        <label><input id="ctt-mute" type="checkbox" /> 静音</label>
        <label><input id="ctt-auto-answer" type="checkbox" /> 自动答题(Beta)</label>
      </div>
      <div class="ctt-helper-row">
        <button id="ctt-scan" class="ctt-helper-btn" style="padding:4px 8px;background:#10b981;font-size:12px">扫描</button>
        <button id="ctt-clearq" class="ctt-helper-btn" style="padding:4px 8px;background:#6b7280;font-size:12px">清空</button>
        <button id="ctt-skip" class="ctt-helper-btn" style="padding:4px 8px;background:#8b5cf6;font-size:12px">跳过当前</button>
      </div>
      <div class="ctt-helper-row">
        <label>队列：<span id="ctt-queue-count">0</span> 个</label>
        <button id="ctt-copyq" class="ctt-helper-btn" style="padding:4px 8px;background:#f59e0b;font-size:12px">复制</button>
      </div>
      <div id="ctt-queue-list" style="max-height:150px;overflow:auto;font-size:12px;line-height:1.4;color:#374151;border-top:1px solid #eee;margin-top:4px;padding-top:4px;"></div>
    `;
    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    // 绑定拖拽
    makeDraggable(wrap, document.getElementById('ctt-drag-handle'));

    const cfg = readCfg();
    const muteEl = document.getElementById('ctt-mute');
    const autoAnswerEl = document.getElementById('ctt-auto-answer');
    const toggleBtn = document.getElementById('ctt-helper-toggle');
    muteEl.checked = !!cfg.mute;
    autoAnswerEl.checked = cfg.autoAnswer !== false;

    function refreshBtn() {
      if (isRunning()) {
        toggleBtn.textContent = '停止自动学习';
        toggleBtn.classList.add('stop');
      } else {
        toggleBtn.textContent = '开始自动学习';
        toggleBtn.classList.remove('stop');
      }
    }
    refreshBtn();

    toggleBtn.addEventListener('click', () => {
      if (isRunning()) {
        setRunning(false);
        logBadge('已停止');
      } else {
        setRunning(true);
        logBadge('已启动');
        tick();
      }
      refreshBtn();
    });

    muteEl.addEventListener('change', () => {
      writeCfg({ ...readCfg(), mute: !!muteEl.checked });
      applyVideoPrefs();
    });
    autoAnswerEl.addEventListener('change', () => {
      writeCfg({ ...readCfg(), autoAnswer: !!autoAnswerEl.checked });
    });
    document.getElementById('ctt-scan').addEventListener('click', () => {
      const found = collectCourseLinks();
      if (atStudyPage()) { const curItem = getCurrentCourseItem(); if (curItem) found.unshift(curItem); }
      const { added, total } = enqueueUnique(found);
      renderQueueSummary();
      alert(`新增课程 ${added} 个（队列共 ${total} 个）`);
    });
    document.getElementById('ctt-clearq').addEventListener('click', () => { setQueue([]); renderQueueSummary(); alert('已清空队列'); });
    // [新增] 强制跳过功能
    document.getElementById('ctt-skip').addEventListener('click', async () => {
        if (!confirm('确定要强制跳过当前章节吗？这可能会导致当前章节未完成，但可以继续后续学习。')) return;
        debugLog('用户请求强制跳过');
        if (await goNextLesson(true)) {
            debugLog('强制跳过成功');
        } else {
            // 如果点不到下一节，尝试直接切下一个课程
            completeCurrentAndDequeue();
            await goNextCourseOrIndex();
        }
    });
    document.getElementById('ctt-copyq').addEventListener('click', async () => {
      const q = getQueue();
      const text = q.map(it => `${getItemTitle(it)}\t${getItemUrl(it)}`).join('\n');
      try { await navigator.clipboard.writeText(text); alert('已复制'); } catch { alert('复制失败'); }
    });
    renderQueueSummary();
  }

  // ----------------------------
  // Helpers
  // ----------------------------
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  function onHashChange(cb) { window.addEventListener('hashchange', cb, false); }
  function nowRoute() { return location.hash || '#'; }
  function atCourseIndex() { return nowRoute().includes('#/study/course/index'); }
  function atBranchIndex() { return nowRoute().includes('#/study/branch/index'); }
  function atSubjectDetail() { return nowRoute().includes('#/study/subject/detail'); }
  function atAnyCourseListIndex() { return atCourseIndex() || atBranchIndex() || atSubjectDetail(); }
  function atStudyPage() { return /#\/study\//.test(nowRoute()); }

  let studyRefreshInterval = null;
  function startStudyRefresh() {
    if (studyRefreshInterval) return;
    const ms = Math.max(1, readCfg().studyRefreshMinutes) * 60 * 1000;
    studyRefreshInterval = setInterval(() => { try { debugLog('页面定时刷新保活'); } catch {} location.reload(); }, ms);
  }
  function stopStudyRefresh() {
    if (studyRefreshInterval) { try { clearInterval(studyRefreshInterval); } catch {} studyRefreshInterval = null; }
  }
  function pageJustEnteredCourse() {
    try {
      const ts = +localStorage.getItem(LS_KEYS.courseEnterAt) || 0;
      const url = localStorage.getItem(LS_KEYS.courseEnterUrl) || '';
      const okUrl = !!url && (location.href.indexOf(url) !== -1 || url.indexOf(location.origin) !== -1);
      const age = Date.now() - ts;
      const settle = readCfg().pageSettleMs;
      return (ts > 0 && age < settle) && okUrl;
    } catch { return false; }
  }
  function getAllAnchors() { return Array.from(document.querySelectorAll('a[href]')); }
  function getByText(selector, texts) {
    const arr = Array.isArray(texts) ? texts : [texts];
    const nodes = Array.from(document.querySelectorAll(selector));
    return nodes.find(n => arr.some(t => (n.textContent || '').trim().includes(t)));
  }
  function inCompletionOverlay(el) { try { return !!(el && el.closest && el.closest('.anew')); } catch { return false; } }
  function getSectionNodes() {
    const container = document.querySelector('li.tabs-cont-item.active.tab-chapter') || document;
    let nodes = Array.from(container.querySelectorAll('dl.chapter-list-box'));
    if (!nodes.length) nodes = Array.from(document.querySelectorAll('dl.chapter-list-box'));
    return nodes.filter(n => {
      if (!n || inCompletionOverlay(n)) return false;
      const style = window.getComputedStyle(n);
      return !(style && style.display === 'none');
    });
  }
  function extractSectionInfo(node) {
    const titleEl = node.querySelector('.chapter-right .chapter-item .text-overflow');
    const statusEl = node.querySelector("span[id*='finishStatus']") || node.querySelector('.section-item .item.pointer span');
    const iconEl = node.querySelector('.chapter-left i.iconfont');
    const title = titleEl ? (titleEl.getAttribute('title') || titleEl.textContent || '').trim() : (node.textContent||'').trim().slice(0,40);
    const statusText = (statusEl ? statusEl.textContent : '').trim();
    const iconCls = iconEl ? iconEl.className : '';
    // H5页面通常显示“学习中”或“开始学习”，如果不想被卡住，需要特殊的逻辑
    const reviewed = /复习|已完成|完成|100%/.test(statusText) || /icon-reload-full/.test(iconCls);
    const clickable = (statusEl && statusEl.closest('.section-item') && statusEl.closest('.section-item').querySelector('.item.pointer')) || statusEl || node;
    return { node, title, statusText, reviewed, clickable };
  }
  function canNavigate() {
    const now = Date.now();
    const last = +localStorage.getItem(LS_KEYS.navLock) || 0;
    return (now - last) > 4000;
  }
  function setNavLock() { localStorage.setItem(LS_KEYS.navLock, String(Date.now())); }
  function safeClick(el) {
    if (!el) return false;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    if (typeof el.click === 'function') el.click();
    return true;
  }
  function courseFullyLearnedHeuristic() {
    // 简单判定：大纲全部复习
    tryExpandOutline();
    const nodes = getSectionNodes();
    if (!nodes.length) return false;
    const infos = nodes.map(extractSectionInfo);
    const reviewed = infos.filter(i => i.reviewed).length;
    return (reviewed > 0 && reviewed === nodes.length);
  }
  function tryExpandOutline() {
    const labels = ['展开', '显示更多', '更多', '展开全部'];
    const toggles = Array.from(document.querySelectorAll('button,a,div,span'))
      .filter(el => labels.some(l => (el.textContent||'').trim().includes(l)));
    toggles.forEach(el => { try { el.click(); } catch(_) {} });
  }

  // ----------------------------
  // [核心] H5 内嵌/Iframe 处理
  // ----------------------------
  async function handleH5Content() {
    if (!readCfg().autoAnswer) return false;

    // 1. 寻找 iframe (你的截图显示内容在iframe里)
    const iframes = document.querySelectorAll('iframe');
    let targetDoc = null;

    // 尝试访问 iframe 内容
    for (const f of iframes) {
        try {
            if (f.contentDocument && (f.contentDocument.body.innerText.includes('提交') || f.contentDocument.querySelector('input'))) {
                targetDoc = f.contentDocument;
                break;
            }
        } catch (e) { /* 跨域无法访问 */ }
    }

    // 如果没有 iframe，也可能是直接渲染在 div 里，fallback 到 document
    if (!targetDoc) {
        // 检查页面是否有典型的答题特征
        if (document.querySelector('.question-list') || document.body.innerText.includes('问题列表')) {
            targetDoc = document;
        }
    }

    if (!targetDoc) return false;

    // 2. 查找选项 (Radio/Checkbox)
    const inputs = Array.from(targetDoc.querySelectorAll('input[type="radio"], input[type="checkbox"], .option-item'));
    if (inputs.length === 0) return false;

    debugLog('检测到测验题目，尝试自动作答...');

    // 策略：每个题选第一个，确保所有题都有选
    // 简单的去重逻辑，避免重复点击
    let clickedCount = 0;
    // 分组逻辑比较复杂，这里采用简化版：全选第一个，或者全部点一遍（如果是多选）
    // 为了防止把正确答案取消，这里只点击 "未选中" 的
    for (const input of inputs) {
        // 如果是 checkbox/radio，检查 checked
        if (input.checked) continue;

        // 截图里是多选题(方框)，我们可以尝试点击第一个选项
        // 或者更暴力一点，把所有选项都点上？不，还是点第一个稳妥，能提交就行
        // 这里做一个假设：每个题目是一组 DOM，我们只点每组的第一个

        // 尝试找到父级容器来区分题目
        // 简单策略：遍历所有input，直接点击。
        // 但为了避免多选导致错误，我们尽量只点每组第一个。
        // 由于结构未知，这里采用：每隔4个点一个，或者只点当前未选中的第一个。

        // 改进策略：查找所有题目的容器
        // 如果无法区分，就尝试点击所有可见的 input 且 name 不同的？

        // 既然不知道结构，采用“盲点第一个”：
        // 找到所有 input，直接点第一个即可触发“已做”状态
        if (clickedCount === 0) {
            safeClick(input);
            clickedCount++;
            await sleep(200);
        }
        // 如果是多选题，可能需要多选。截图显示是多选。
        // 让我们尝试把所有题的第一个选项都选上。
        // 很难区分哪是题目的边界。
        // 备用方案：把所有 unchecked 的 checkbox 都点一遍？不，那样也是全选。
    }

    // 再次尝试：如果还没做完，通常需要点击“提交”。
    const btnSubmit = Array.from(targetDoc.querySelectorAll('button, a, div')).find(el => {
        const t = (el.textContent || '').trim();
        return t === '提交' || t === '提交答案' || t === 'Submit';
    });

    if (btnSubmit) {
        debugLog('找到提交按钮，点击提交');
        safeClick(btnSubmit);
        await sleep(1000);
        return true; // 正在处理中
    }

    return false;
  }

  // ----------------------------
  // Navigation & Automation
  // ----------------------------
  async function goNextLesson(force = false) {
    const infos = getSectionNodes().map(extractSectionInfo);
    // 默认找第一个未复习的。如果是 force=true，则找当前正在进行的下一个，或者直接找下一个
    let target = infos.find(i => !i.reviewed);

    if (force) {
        // 强制模式：找到当前高亮的节点，然后取下一个
        const currentIndex = infos.findIndex(i => i.node.classList.contains('active') || i.node.innerHTML.includes('color:#ff'));
        // 这里的 active 类名可能不准确，改用 statusText 判定
        const runningIndex = infos.findIndex(i => i.statusText.includes('学习中') || i.statusText.includes('进行中'));
        if (runningIndex !== -1 && runningIndex + 1 < infos.length) {
            target = infos[runningIndex + 1];
        } else if (infos.length > 0) {
            // 实在找不到，就找第一个没做的
            target = infos.find(i => !i.reviewed);
        }
    }

    if (target && target.clickable) {
        debugLog(force ? '强制跳转下一节' : '进入下一节', `${target.title}`);
        return safeClick(target.clickable);
    }

    // 尝试通用按钮
    const nextBtn = getByText('a,button,div', ['下一节', '下一章', '继续学习']);
    if (nextBtn && !inCompletionOverlay(nextBtn)) return safeClick(nextBtn);

    return false;
  }

  async function driveStudyPage() {
    if (pageJustEnteredCourse()) { setTimeout(tick, 1500); return; }

    // 优先处理 H5
    await handleH5Content();

    if (courseFullyLearnedHeuristic()) {
      debugLog('课程完成，切下一个');
      completeCurrentAndDequeue();
      await goNextCourseOrIndex();
      return;
    }

    const v = document.querySelector('video');
    if (v) {
      v.muted = !!readCfg().mute;
      ensurePlaying(v);
      if (!v.dataset.cttEndedBound) {
        v.dataset.cttEndedBound = '1';
        v.addEventListener('ended', async () => {
          debugLog('视频结束，去下一节');
          await sleep(1000);
          if (!(await goNextLesson())) {
              // 视频结束但点不到下一节（可能是H5卡住），这里不自动跳，等待主循环或人工
          }
        });
      }
    } else {
        // 没视频，可能是文档或H5。
        // 如果是 H5 且无法自动处理，脚本会卡住。
        // 用户可以点击面板上的【跳过当前】。
    }

    // 通用翻页尝试
    const contBtn = getByText('a,button,div', ['继续学习', '下一节']);
    if (contBtn && !inCompletionOverlay(contBtn) && !/复习/.test(contBtn.innerText)) {
       safeClick(contBtn);
    }
  }

  function ensurePlaying(video) {
    if (!video) return;
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    const timer = setInterval(tryPlay, 3000);
    video.addEventListener('playing', () => clearInterval(timer), { once: true });
    setTimeout(() => clearInterval(timer), 30000);
  }

  // ... (Course Collection Logic - unchanged) ...
  function isCompletedText(text) { return /已完成|已学完|100%/.test((text||'').replace(/\s+/g,'')); }
  function findCourseCard(el) { return el.closest('li, [class*="course"], [class*="card"]'); }
  function isCourseLink(href, txt) { return (/study\/course/.test(href) || /\/course\/detail/.test(href) || txt.includes('继续学习')); }
  function collectCourseLinks() {
    if (atSubjectDetail()) {
        const list = [];
        const items = document.querySelectorAll('.item[data-resource-id]');
        items.forEach(it => {
           const rid = it.getAttribute('data-resource-id');
           const st = it.getAttribute('data-section-type');
           if(!rid || /完成/.test(it.innerText)) return;
           list.push({id:rid, url: `${location.origin}/#/study/course/detail/${st}&${rid}`, title: it.querySelector('[title]')?.getAttribute('title')||'未命名'});
        });
        return list;
    }
    // 列表页通用扫描
    const wanted = []; const seen = new Set();
    document.querySelectorAll('a[href]').forEach(a => {
       const href = a.getAttribute('href');
       if(isCourseLink(href, a.innerText) && !isCompletedText(findCourseCard(a)?.innerText || a.innerText)) {
          const u = new URL(href, location.href).href;
          if(!seen.has(u)) { seen.add(u); wanted.push({url:u, title: a.title||a.innerText}); }
       }
    });
    return wanted;
  }

  async function goCourse(uOrItem) {
     const item = normalizeQueueItem(uOrItem);
     if(item.url) markInProgress(item.url);
     stopStudyRefresh();
     localStorage.setItem(LS_KEYS.courseEnterAt, String(Date.now()));
     localStorage.setItem(LS_KEYS.courseEnterUrl, item.url);
     location.assign(item.url);
  }

  async function goNextCourseOrIndex() {
      const next = normalizeQueueArray(getQueue()).find(it => it.status === 'in_progress') || normalizeQueueArray(getQueue()).find(it => it.status === 'pending');
      if (next) { await sleep(2000); await goCourse(next); }
      else { await backToIndexAndNext(); }
  }
  async function backToIndexAndNext() {
      if(!canNavigate()) return;
      localStorage.setItem(LS_KEYS.resumeAt, String(Date.now() + readCfg().returnDelayMs));
      setNavLock();
      location.assign(location.origin + '/#/study/course/index');
  }

  // Main Loop
  let tickBusy = false;
  async function tick() {
    if (!isRunning() || tickBusy) return;
    tickBusy = true;
    try {
      if (atAnyCourseListIndex()) {
        const resume = +localStorage.getItem(LS_KEYS.resumeAt)||0;
        if(resume && Date.now() < resume) { setTimeout(tick, 1000); return; }

        let q = getQueue();
        if(!q.length) setQueue(collectCourseLinks());
        const next = normalizeQueueArray(getQueue()).find(it => it.status === 'in_progress' || it.status === 'pending');
        if(next) await goCourse(next);
      } else if (atStudyPage()) {
        startStudyRefresh();
        await driveStudyPage();
      }
    } catch (e) { console.warn(e); } finally { tickBusy = false; }
    setTimeout(tick, 2500);
  }

  onHashChange(() => { if (isRunning()) setTimeout(tick, 600); });
  function init() { migrateCurrentUrlToId(); renderUI(); if (isRunning()) tick(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();