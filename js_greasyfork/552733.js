// ==UserScript==
// @name         CTT MOOC 自动学习助手
// @namespace    https://mooc.ctt.cn/
// @version      0.2.3
// @description  在 CTT MOOC 上自动按顺序学习未完成课程，自动播放视频、切换小节，完成后回到课程列表继续学习。
// @author       pppm
// @match        https://mooc.ctt.cn/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552733/CTT%20MOOC%20%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552733/CTT%20MOOC%20%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
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
    currentUrl: 'ctt_mooc_current_url', // legacy
    currentId: 'ctt_mooc_current_id'
  };
  const defaultCfg = {
    mute: false,
    log: true,
    clickDelayMs: 800,
    nextDelayMs: 1500,
    // 新增：回到列表后等待，和打开下一个课程前的附加等待
    returnDelayMs: 3000,
    beforeNextCourseDelayMs: 2500,
    // 新增：进入课程后等待页面稳定的时间
    pageSettleMs: 5000,
    // 学习页定时刷新（分钟）
    studyRefreshMinutes: 10
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
      // pattern: #/study/course/detail/{type}&{id}
      const m = hash.match(/course\/detail\/[^&?#]+&([A-Za-z0-9-]+)/);
      if (m) return m[1];
      // fallback: last segment
      const segs = (hash || url.pathname).split('/').filter(Boolean);
      const last = segs.pop() || '';
      const m2 = last.match(/([A-Za-z0-9-]{8,})$/);
      if (m2) return m2[1];
    } catch {}
    return String(u||'');
  }

  function extractCourseTitleFromStudyPage() {
    const cands = [
      '.course-title .text-overflow[title]',
      '.course-title',
      '.title .text-overflow[title]',
      '.text-overflow[title]',
      'h1', 'h2', 'h3'
    ];
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
      // Only treat as current course when on course detail page
      const full = url || '';
      const inDetail = /\/course\/detail\//.test(full);
      if (!inDetail) return null;
      const id = extractCourseIdFromUrl(url);
      if (!id) return null;
      const title = extractCourseTitleFromStudyPage() || document.title || humanizeCourse(url);
      return { id, url, title, status: 'pending' };
    } catch (_) { return null; }
  }


  // ---- Queue item helpers (backward compatible: string or {url,title}) ----
  function normalizeQueueItem(item) {
    if (!item) return null;
    if (typeof item === 'string') return { id: extractCourseIdFromUrl(item), url: item, title: humanizeCourse(item), status: 'pending' };
    if (item.url) return { id: item.id || extractCourseIdFromUrl(item.url), url: item.url, title: item.title || humanizeCourse(item.url), status: item.status || 'pending' };
    return null;
  }
  function getItemUrl(item) { const it = normalizeQueueItem(item); return it ? it.url : ''; }
  function getItemTitle(item) { const it = normalizeQueueItem(item); return it ? it.title : ''; }
  function getItemId(item) { const it = normalizeQueueItem(item); return it ? it.id : ''; }
  

  function normalizeQueueArray(arr) {
    return (arr || []).map(normalizeQueueItem).filter(Boolean);
  }

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
      const legacy = localStorage.getItem(LS_KEYS.currentUrl);
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
    if (found) {
      setQueue(q);
      setCurrentId(id);
      renderQueueSummary();
    }
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
    if (updated) {
      setQueue(q);
      clearCurrentId();
      renderQueueSummary();
    }
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
  // UI: Floating Control
  // ----------------------------
  const CSS = `
  .ctt-helper-wrap{position:fixed;z-index:999999;right:16px;bottom:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
  .ctt-helper-btn{background:#3b82f6;color:#fff;border:none;border-radius:20px;padding:8px 12px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.15);}
  .ctt-helper-btn.stop{background:#ef4444}
  .ctt-helper-panel{margin-top:8px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:8px 10px;box-shadow:0 2px 12px rgba(0,0,0,.12);min-width:220px}
  .ctt-helper-row{display:flex;align-items:center;justify-content:space-between;margin:6px 0}
  .ctt-helper-row label{font-size:12px;color:#111827}
  
  .ctt-badge{position:fixed;left:16px;bottom:24px;background:#111827;color:#e5e7eb;border-radius:6px;padding:6px 8px;font-size:12px;z-index:999999;opacity:.9}
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

  function renderUI() {
    injectStyle();
    let wrap = document.getElementById('ctt-helper-wrap');
    if (wrap) return;
    wrap = document.createElement('div');
    wrap.id = 'ctt-helper-wrap';
    wrap.className = 'ctt-helper-wrap';
    const btn = document.createElement('button');
    btn.id = 'ctt-helper-toggle';
    btn.className = 'ctt-helper-btn';
    wrap.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'ctt-helper-panel';
    panel.innerHTML = `
      <div class="ctt-helper-row">
        <label>静音</label>
        <input id="ctt-mute" type="checkbox" />
      </div>
      <div class="ctt-helper-row">
        <button id="ctt-scan" class="ctt-helper-btn" style="padding:4px 8px;background:#10b981">扫描课程</button>
        <button id="ctt-clearq" class="ctt-helper-btn" style="padding:4px 8px;background:#6b7280">清空队列</button>
      </div>
      <div class="ctt-helper-row">
        <label>待学习队列：<span id="ctt-queue-count">0</span> 个</label>
        <button id="ctt-copyq" class="ctt-helper-btn" style="padding:4px 8px;background:#f59e0b">复制</button>
      </div>
      <div id="ctt-queue-list" style="max-height:180px;overflow:auto;font-size:12px;line-height:1.4;color:#374151"></div>
      `;
    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    const cfg = readCfg();
    const muteEl = document.getElementById('ctt-mute');
    const toggleBtn = document.getElementById('ctt-helper-toggle');
    muteEl.checked = !!cfg.mute;

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

    document.getElementById('ctt-scan').addEventListener('click', () => {
      const found = collectCourseLinks();
      // If currently on a study page, also include current course into queue
      if (atStudyPage()) {
        const curItem = getCurrentCourseItem();
        if (curItem) found.unshift(curItem);
      }
      const { added, total } = enqueueUnique(found);
      renderQueueSummary();
      alert(`新增课程 ${added} 个（队列共 ${total} 个）`);
    });
    document.getElementById('ctt-clearq').addEventListener('click', () => {
      setQueue([]);
      renderQueueSummary();
      alert('已清空队列');
    });
    document.getElementById('ctt-copyq').addEventListener('click', async () => {
      const q = getQueue();
      const lines = q.map(it => {
        const url = getItemUrl(it);
        const title = getItemTitle(it);
        return `${title}\t${url}`;
      });
      const text = lines.join('\n');
      try { await navigator.clipboard.writeText(text); alert('已复制到剪贴板'); }
      catch {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); alert('已复制到剪贴板'); } catch { alert('复制失败'); }
        ta.remove();
      }
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

  // ----------------------------
  // Study auto-refresh (every N minutes) to avoid deadlock
  // ----------------------------
  let studyRefreshInterval = null;
  function startStudyRefresh() {
    if (studyRefreshInterval) return;
    const ms = Math.max(1, readCfg().studyRefreshMinutes) * 60 * 1000;
    debugLog(`启动学习页定时刷新：每 ${Math.round(ms/60000)} 分钟`);
    studyRefreshInterval = setInterval(() => {
      try { debugLog('执行学习页定时刷新'); } catch {}
      location.reload();
    }, ms);
  }
  function stopStudyRefresh() {
    if (studyRefreshInterval) {
      try { clearInterval(studyRefreshInterval); } catch {}
      studyRefreshInterval = null;
      debugLog('停止学习页定时刷新');
    }
  }

  function pageJustEnteredCourse() {
    try {
      const ts = +localStorage.getItem(LS_KEYS.courseEnterAt) || 0;
      const url = localStorage.getItem(LS_KEYS.courseEnterUrl) || '';
      const okUrl = !!url && (location.href.indexOf(url) !== -1 || url.indexOf(location.origin) !== -1);
      const age = Date.now() - ts;
      const settle = readCfg().pageSettleMs;
      const needWait = ts > 0 && age < settle;
      if (needWait) debugLog(`页面稳定等待中 ${settle - age}ms (age=${age}ms)`);
      return needWait && okUrl;
    } catch { return false; }
  }

  function getAllAnchors() {
    return Array.from(document.querySelectorAll('a[href]'));
  }

  function getByText(selector, texts) {
    const arr = Array.isArray(texts) ? texts : [texts];
    const nodes = Array.from(document.querySelectorAll(selector));
    return nodes.find(n => arr.some(t => (n.textContent || '').trim().includes(t)));
  }

  function inCompletionOverlay(el) {
    try { return !!(el && el.closest && el.closest('.anew')); } catch { return false; }
  }

  // Overlay/text completion detection disabled by request
  function courseCompleted() { return false; }

  // ---------- Course outline analysis for completion ----------
  function getSectionNodes() {
    // Prefer within active tab-chapter container
    const container = document.querySelector('li.tabs-cont-item.active.tab-chapter') || document;
    let nodes = Array.from(container.querySelectorAll('dl.chapter-list-box'));
    // Fallback if none found
    if (!nodes.length) nodes = Array.from(document.querySelectorAll('dl.chapter-list-box'));
    // Filter visible and meaningful
    nodes = nodes.filter(n => {
      if (!n || inCompletionOverlay(n)) return false;
      const style = window.getComputedStyle(n);
      if (style && style.display === 'none') return false;
      return true;
    });
    return nodes;
  }

  function extractSectionInfo(node) {
    const titleEl = node.querySelector('.chapter-right .chapter-item .text-overflow');
    const statusEl = node.querySelector("span[id*='finishStatus']") || node.querySelector('.section-item .item.pointer span');
    const iconEl = node.querySelector('.chapter-left i.iconfont');
    const title = titleEl ? (titleEl.getAttribute('title') || titleEl.textContent || '').trim() : (node.textContent||'').trim().slice(0,40);
    const statusText = (statusEl ? statusEl.textContent : '').trim();
    const iconCls = iconEl ? iconEl.className : '';
    const reviewed = /复习|已完成|完成|100%/.test(statusText) || /icon-reload-full/.test(iconCls);
    const clickable = (statusEl && statusEl.closest('.section-item') && statusEl.closest('.section-item').querySelector('.item.pointer')) || statusEl || node;
    return { node, title, statusText, reviewed, clickable };
  }

  function isSectionReviewed(node) {
    return extractSectionInfo(node).reviewed;
  }

  function tryExpandOutline() {
    const labels = ['展开', '显示更多', '更多', '展开全部', '更多章节', '更多课时'];
    const toggles = Array.from(document.querySelectorAll('button,a,div,span'))
      .filter(el => labels.some(l => (el.textContent||'').trim().includes(l)));
    let count = 0;
    for (const el of toggles) {
      if (count >= 3) break;
      try { safeClick(el); count++; } catch(_) {}
    }
    if (count>0) debugLog(`尝试展开大纲：点击了${count}个“更多/展开”`);
  }

  function hasIncompleteMarkers() {
    const text = (document.body.innerText || document.body.textContent || '').replace(/\s+/g, '');
    return /未学|未完成|进行中|学习中|未观看|待学习/.test(text);
  }

  function areAllSectionsReviewed() {
    tryExpandOutline();
    const nodes = getSectionNodes();
    if (!nodes.length) return false; // unknown, keep conservative
    const infos = nodes.map(extractSectionInfo);
    const reviewed = infos.filter(i => i.reviewed).length;
    debugLog(`大纲统计：共${infos.length}节，已复习=${reviewed}`, infos.map(i=>`${i.title}:${i.statusText}`).join(' | '));
    // 仅依据大纲全部节处于“复习/已完成/100%”判定完成（不再全局扫描“学习中”等文案）
    if (reviewed > 0 && reviewed === nodes.length) return true;
    return false;
  }

  // Study page completion observer removed (overlay-based completion not used)
  function ensureStudyObserver() {}
  function teardownStudyObserver() {}

  function canNavigate() {
    const now = Date.now();
    const last = +localStorage.getItem(LS_KEYS.navLock) || 0;
    return (now - last) > 4000;
  }
  function setNavLock() {
    localStorage.setItem(LS_KEYS.navLock, String(Date.now()));
  }

  function safeClick(el) {
    if (!el) return false;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    if (typeof el.click === 'function') el.click();
    return true;
  }

  function hasNextLessonCandidate() {
    const infos = getSectionNodes().map(extractSectionInfo);
    const anyUnreviewed = infos.some(i => !i.reviewed);
    const nextBtn = getByText('a,button,div', ['下一节', '下一章', '下一课时', '继续学习']);
    const okBtn = !!(nextBtn && !inCompletionOverlay(nextBtn) && !/复习/.test((nextBtn.textContent||'').trim()));
    return anyUnreviewed || okBtn;
  }

  function courseFullyLearnedHeuristic() {
    if (areAllSectionsReviewed()) { debugLog('完成判定：大纲全部为复习/已完成'); return true; }
    return false;
  }

  // Try advancing to next lesson once: return true if navigated/clicked
  function tryAdvanceLessonOnce() {
    const contBtn = getByText('a,button,div', ['继续学习', '下一节', '下一章', '下一课时']);
    if (contBtn && !inCompletionOverlay(contBtn) && !/复习/.test((contBtn.textContent||'').trim())) {
      debugLog('点击“下一节/继续学习”按钮');
      safeClick(contBtn);
      return true;
    }
    // Try clicking first unreviewed section
    const infos = getSectionNodes().map(extractSectionInfo);
    const target = infos.find(i => !i.reviewed);
    if (target && target.clickable) {
      debugLog('尝试点击未完成小节', `${target.title}:${target.statusText}`);
      safeClick(target.clickable);
      return true;
    }
    return false;
  }

  // Repeatedly try to find and open next lesson; only jump to next course when outline-complete
  let advanceTimer = null;
  function clearAdvanceTimer() { try { if (advanceTimer) clearInterval(advanceTimer); } catch(_){} advanceTimer = null; }
  function scheduleAdvanceRetries(maxAttempts = 20, intervalMs = 3000) {
    if (advanceTimer) return;
    let attempts = 0;
    advanceTimer = setInterval(async () => {
      attempts++;
      try {
      debugLog(`重试寻找下一节：第${attempts}次`);
      if (courseFullyLearnedHeuristic()) {
        clearAdvanceTimer();
        await goNextCourseOrIndex();
        return;
      }
        if (tryAdvanceLessonOnce() || await goNextLesson()) {
          debugLog('重试成功：已进入下一节');
          clearAdvanceTimer();
          return;
        }
      } catch (_) {}
      if (attempts >= maxAttempts) {
        clearAdvanceTimer();
        logBadge('未找到下一节，等待人工或页面更新');
      }
    }, intervalMs);
  }

  function applyVideoPrefs() {
    const videos = document.querySelectorAll('video');
    videos.forEach(v => {
      try {
        v.playbackRate = 1.0;
        v.muted = !!readCfg().mute;
      } catch (_) {}
    });
  }

  function ensurePlaying(video) {
    if (!video) return;
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    const timer = setInterval(tryPlay, 3000);
    video.addEventListener('playing', () => clearInterval(timer), { once: true });
    // safety cutoff
    setTimeout(() => { try { clearInterval(timer); } catch (_) {} }, 30000);
  }

  // ----------------------------
  // Course collection from index page
  // ----------------------------
  function isCompletedText(text) {
    const s = (text || '').replace(/\s+/g, '');
    if (!s) return false;
    // strong negative indicators
    const negatives = ['已完成','已学完','完成','结课','已结课','已通过','通过考试','考试通过','合格'];
    if (negatives.some(k => s.includes(k))) return true;
    // progress 100%
    const m = s.match(/(\d{1,3})%/);
    if (m && +m[1] >= 100) return true;
    return false;
  }

  function findCourseCard(el) {
    const maxDepth = 5;
    let cur = el;
    for (let i=0; i<maxDepth && cur; i++) {
      if (cur.matches && (
        cur.matches('li, [class*="course"], [class*="card"], [class*="item"], [class*="list"]')
      )) return cur;
      cur = cur.parentElement;
    }
    return el;
  }

  function isCourseLink(href, txt) {
    const t = (txt || '').trim();
    return (
      /study\/course/.test(href) || /\/course\/detail/.test(href) ||
      t.includes('继续学习') || t.includes('开始学习')
    );
  }

  function extractCourseTitleFromCard(card, a) {
    const cand = [
      '.title', '.course-title', '.text-overflow', '.name', 'h3', 'h4', 'a[title]'
    ];
    for (const sel of cand) {
      const el = card.querySelector(sel) || (a && a.matches(sel) ? a : null);
      if (el) {
        const t = (el.getAttribute('title') || el.textContent || '').trim();
        if (t) return t;
      }
    }
    return (a && (a.getAttribute('title') || a.textContent || '').trim()) || humanizeCourse(a ? a.href : '');
  }

  function collectSubjectCourses() {
    // Build real course detail URLs: /#/study/course/detail/{sectionType}&{resourceId}
    const list = [];
    const container = document.querySelector('.subject-catalog-wrapper') || document;
    const items = Array.from(container.querySelectorAll('.item[data-section-type]'));
    for (const it of items) {
      const st = (it.getAttribute('data-section-type') || '').trim();
      const rid = (it.getAttribute('data-resource-id') || '').trim();
      if (!st || !rid) continue;
      const titleEl = it.querySelector('.name-des[title]');
      const title = (titleEl ? titleEl.getAttribute('title') : '') || (titleEl ? titleEl.textContent : '') || '';
      const opText = (it.querySelector('.operation')?.innerText || '').replace(/\s+/g,'');
      const completed = /复习|已完成|完成/.test(opText);
      if (completed) continue; // skip finished courses in subject
      const url = `${location.origin}/#/study/course/detail/${st}&${rid}`;
      list.push({ id: rid, url, title: title || '(未命名课程)' });
    }
    return list;
  }

  function collectCourseLinks() {
    // Prefer scanning on list pages only
    if (atSubjectDetail()) {
      return collectSubjectCourses();
    }
    const as = getAllAnchors();
    const wanted = [];
    const seen = new Set();
    for (const a of as) {
      const href = a.getAttribute('href') || '';
      const txt = (a.textContent || '').trim();
      if (!isCourseLink(href, txt)) continue;
      // bound the context to a course card and evaluate status
      const card = findCourseCard(a);
      const textBlob = (card ? (card.innerText || card.textContent || '') : (a.innerText || a.textContent || ''));
      if (isCompletedText(textBlob)) continue; // ignore completed courses
      const abs = new URL(href, location.href).href;
      const title = extractCourseTitleFromCard(card || document, a);
      if (!seen.has(abs)) { seen.add(abs); wanted.push({ url: abs, title }); }
    }
    return wanted;
  }

  async function goCourse(uOrItem) {
    const item = normalizeQueueItem(uOrItem) || { url: String(uOrItem||'') };
    const u = item.url;
    const last = +localStorage.getItem(LS_KEYS.navLock) || 0;
    const now = Date.now();
    const wait = 4000 - (now - last);
    if (wait > 0) {
      debugLog(`导航锁未过，延迟跳转 ${wait}ms → ${u}`);
      setTimeout(() => { goCourse(item); }, wait + 50);
      return;
    }
    // Mark as in-progress before navigation/click and stop refresh timer briefly during navigation
    if (u) markInProgress(u);
    stopStudyRefresh();
    debugLog('进入课程', u);
    try {
      localStorage.setItem(LS_KEYS.courseEnterAt, String(Date.now()));
      localStorage.setItem(LS_KEYS.courseEnterUrl, String(u));
    } catch {}
    setNavLock();
    location.assign(u);
  }

  function chooseNextRunnable() {
    const q = normalizeQueueArray(getQueue());
    // Prefer an in-progress course
    const inprog = q.find(it => it.status === 'in_progress');
    if (inprog) return inprog;
    // Otherwise take first pending
    const pend = q.find(it => it.status === 'pending');
    return pend || null;
  }

  async function goNextCourseOrIndex() {
    const next = chooseNextRunnable();
    if (next) {
      clearAdvanceTimer();
      const nextUrl = getItemUrl(next);
      const nextTitle = getItemTitle(next);
      debugLog(`切到队列下一门`, `${nextTitle} | ${nextUrl}`);
      await sleep(readCfg().beforeNextCourseDelayMs);
      await goCourse(next);
    } else {
      debugLog('队列为空或仅存在进行中项，返回目录补充队列');
      await backToIndexAndNext();
    }
  }

  // ----------------------------
  // Playback automation within a course
  // ----------------------------
  async function driveStudyPage() {
    // 0) 页面刚进入时，先等页面稳定再做完成判定，避免误判
    if (pageJustEnteredCourse()) {
      setTimeout(tick, Math.min(1000, readCfg().pageSettleMs));
      return;
    }
    // 0.5) Already completed?
    if (courseFullyLearnedHeuristic()) {
      debugLog('进入学习页即判断课程完成 → 出队并切下一个');
      completeCurrentAndDequeue();
      await goNextCourseOrIndex();
      return;
    }
    // 1) Apply video preferences
    const v = document.querySelector('video');
    if (v) {
      v.muted = !!readCfg().mute;
      v.playbackRate = 1.0;
      ensurePlaying(v);
      if (!v.dataset.cttEndedBound) {
        v.dataset.cttEndedBound = '1';
        v.addEventListener('ended', async () => {
          const before = location.href;
        if (courseFullyLearnedHeuristic()) {
          debugLog('课程已完成（ended路径）→切下一个');
          await sleep(1000);
          completeCurrentAndDequeue();
          await goNextCourseOrIndex();
          return;
        }
        debugLog('视频已结束，查找下一节');
        await sleep(readCfg().nextDelayMs);
        if (!(await goNextLesson()) && !tryAdvanceLessonOnce()) {
          // 不切课，开始定时尝试寻找下一节
          scheduleAdvanceRetries();
        }
        // 保守兜底：如果 URL 未变化，继续尝试寻找下一节（不跳下一个课程）
        setTimeout(async () => {
          try {
            if (location.href === before && !courseFullyLearnedHeuristic()) {
              scheduleAdvanceRetries();
            }
          } catch (_) {}
        }, 3000);
      });
      }
    }

    // 2) If there is a obvious "继续学习" or "下一节" button, click it
    const contBtn = getByText('a,button,div', ['继续学习', '下一节', '下一章', '下一课时']);
    if (contBtn && !inCompletionOverlay(contBtn) && !/复习/.test((contBtn.textContent||'').trim())) {
      await sleep(readCfg().clickDelayMs);
      safeClick(contBtn);
      return;
    }

    // 3) Otherwise, try to click the first unlearned chapter/lesson
    await sleep(readCfg().clickDelayMs);
    if (!(await goNextLesson())) {
      // fallback watchdog: if video is near end, attempt next; else keep trying
      if (v) {
        const watchdog = setInterval(async () => {
          try {
            if (v.duration && v.currentTime && (v.duration - v.currentTime < 1.0)) {
              clearInterval(watchdog);
              if (courseFullyLearnedHeuristic()) {
                completeCurrentAndDequeue();
                await goNextCourseOrIndex();
              } else if (!(await goNextLesson()) && !tryAdvanceLessonOnce()) {
                scheduleAdvanceRetries();
              }
            }
          } catch (_) {}
        }, 3000);
        // safety cutoff to avoid long-running interval
        setTimeout(() => { try { clearInterval(watchdog); } catch (_) {} }, 60000);
      }
    }
  }

  async function goNextLesson() {
    const infos = getSectionNodes().map(extractSectionInfo);
    const target = infos.find(i => !i.reviewed);
    if (target && target.clickable) {
      debugLog('进入下一节', `${target.title}:${target.statusText}`);
      return safeClick(target.clickable);
    }
    const nextBtn = getByText('a,button,div', ['下一节', '下一章', '下一课时', '继续学习']);
    if (nextBtn && !inCompletionOverlay(nextBtn)) { debugLog('使用页面“下一节/继续学习”按钮'); return safeClick(nextBtn); }
    return false;
  }

  async function backToIndexAndNext() {
    // Return to the course index and continue with queue
    logBadge('课程完成，返回列表');
    const idx = location.origin + '/#/study/course/index';
    if (!canNavigate()) return;
    // 设置回到列表后的等待截止时间
    try { localStorage.setItem(LS_KEYS.resumeAt, String(Date.now() + readCfg().returnDelayMs)); } catch { }
    setNavLock();
    location.assign(idx);
    // continuation happens in tick() when we are back on index
  }

  // ----------------------------
  // Main loop
  // ----------------------------
  let tickBusy = false;
  async function tick() {
    if (!isRunning() || tickBusy) return;
    tickBusy = true;
    try {
      if (atAnyCourseListIndex()) {
        clearAdvanceTimer();
        teardownStudyObserver();
        stopStudyRefresh();
        // 专题待点击逻辑已移除（使用真实课程URL）
        // 若刚从课程返回，等待页面稳定
        try {
          const resumeAt = +localStorage.getItem(LS_KEYS.resumeAt) || 0;
          const now = Date.now();
          if (resumeAt && now < resumeAt) {
            const waitMs = Math.min(5000, resumeAt - now);
            logBadge('等待页面稳定…');
            setTimeout(tick, waitMs);
            return;
          } else if (resumeAt) {
            localStorage.removeItem(LS_KEYS.resumeAt);
          }
        } catch {}
        // ensure we have a queue
        let q = getQueue();
        if (!q.length) {
          q = collectCourseLinks();
          setQueue(q);
          logBadge(`收集课程 ${q.length} 个`);
          try { renderQueueSummary(); } catch {}
        }
        const next = chooseNextRunnable();
        if (next) {
          try { renderQueueSummary(); } catch {}
          await sleep(readCfg().clickDelayMs + readCfg().beforeNextCourseDelayMs);
          await goCourse(next);
        } else {
          logBadge('没有未完成课程');
        }
      } else if (atStudyPage()) {
        ensureStudyObserver();
        startStudyRefresh();
        await driveStudyPage();
      }
    } catch (e) {
      console.warn('[CTT MOOC] tick error', e);
    } finally {
      tickBusy = false;
    }

    // re-arm next tick
    setTimeout(tick, 2500);
  }

  // Re-run handlers on route change
  onHashChange(() => {
    if (isRunning()) setTimeout(tick, 600);
  });

  // Init
  function init() {
    migrateCurrentUrlToId();
    renderUI();
    applyVideoPrefs();
    if (isRunning()) tick();
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // ready
})();
