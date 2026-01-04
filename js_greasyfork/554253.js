// ==UserScript==
// @name         浙江研究生课程联盟刷课
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  基于后端接口自动上报视频进度
// @author       Dxx
// @license      MIT
// @match        https://zjyjs.zj.zju.edu.cn/user/courses*
// @match        https://zjyjs.zj.zju.edu.cn/course/*/content*
// @match        https://zjyjs.zj.zju.edu.cn/course/*/learning-activity/full-screen*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554253/%E6%B5%99%E6%B1%9F%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%BE%E7%A8%8B%E8%81%94%E7%9B%9F%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/554253/%E6%B5%99%E6%B1%9F%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%BE%E7%A8%8B%E8%81%94%E7%9B%9F%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STATE = {
    courses: [],
    selectLocked: false,
    rate: (function(){
      try { return parseFloat(localStorage.getItem('ZJYJS_RATE')) || 2; } catch (e) { return 2; }
    })(),
    completenessCache: {}, // activityId -> completeness
    apiCheckTsByActivity: {}, // activityId -> last fetch timestamp
    lastCheckGateTsByActivity: {}, // 节流：activityId -> last check ts
    inflightByActivity: {}, // activityId -> Promise
    skipInProgress: false,
    queriedActivities: {}, // 本会话内已请求过的 activityId
    activityPosters: {}, // 活动区间上报：actId -> { lastEnd:number, timer:number }
  };
  try { window.ZJJYS_STATE = STATE; } catch (e) {}

  function queryCourses() {
    const list = [];
    // 课程项：li.course[data-course-id] 下的 a[ng-href$="/content"]
    const items = document.querySelectorAll('ol.courses li.course');
    items.forEach((li) => {
      const id = li.getAttribute('data-course-id');
      const anchor = li.querySelector('a[ng-href$="/content"], a[href$="/content"]');
      if (!anchor) return;
      const name = (anchor.innerText || anchor.textContent || '').trim();
      const href = anchor.getAttribute('href') || anchor.getAttribute('ng-href');
      if (!href) return;
      const url = new URL(href, location.origin).toString();
      list.push({ id, name, url });
    });
    STATE.courses = list;
    return list;
  }

  function ensurePanel() {
    if (document.getElementById('zjjys-course-panel')) return document.getElementById('zjjys-course-panel');

    const style = document.createElement('style');
    style.textContent = `
      #zjjys-course-panel { position: fixed; top: 16px; left: 16px; z-index: 99999; width: 360px; background: #fff; border: 1px solid #dcdcdc; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.15); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; color: #333; }
      #zjjys-course-panel .hdr { height: 40px; line-height: 40px; padding: 0 12px; background: #f7f7f7; border-bottom: 1px solid #eee; font-weight: 600; display: flex; align-items: center; justify-content: space-between; border-radius: 8px 8px 0 0; cursor: move; }
      #zjjys-course-panel .body { padding: 10px 12px 12px; }
      #zjjys-course-panel .row { display: flex; gap: 8px; align-items: center; margin-top: 8px; }
      #zjjys-course-panel select { flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; }
      #zjjys-course-panel button { padding: 6px 10px; border: 0; border-radius: 6px; cursor: pointer; background: #4a6cff; color: #fff; }
      #zjjys-course-panel button.secondary { background: #00b894; }
      #zjjys-course-panel button.ghost { background: #888; }
      #zjjys-course-panel .ft { display: flex; justify-content: space-between; align-items: center; height: 32px; padding: 0 12px 10px; color: #999; font-size: 12px; }
      #zjjys-course-panel .mini { position: absolute; right: 10px; top: 6px; width: 20px; height: 20px; text-align: center; line-height: 20px; border-radius: 4px; background: #eaeaea; color: #333; cursor: pointer; user-select: none; }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'zjjys-course-panel';
    panel.innerHTML = `
      <div class="hdr">课程列表助手<div class="mini" title="最小化">_</div></div>
      <div class="body">
        <div class="row"><select id="zjjys-course-select"><option disabled selected>正在扫描课程...</option></select></div>
        <div class="row">
          <button id="zjjys-enter">进入所选课程</button>
          <button id="zjjys-open-all" class="secondary">打开全部(新标签)</button>
          <button id="zjjys-refresh" class="ghost">刷新</button>
        </div>
      </div>
      <div class="ft"><span id="zjjys-status">准备就绪</span><span style="opacity:.7">v0.1.0</span></div>
    `;
    document.body.appendChild(panel);

    // 拖拽
    (function drag() {
      const header = panel.querySelector('.hdr');
      let isDown = false; let dx = 0; let dy = 0;
      header.addEventListener('mousedown', (e) => { isDown = true; dx = e.clientX - panel.offsetLeft; dy = e.clientY - panel.offsetTop; });
      document.addEventListener('mousemove', (e) => { if (!isDown) return; panel.style.left = (e.clientX - dx) + 'px'; panel.style.top = (e.clientY - dy) + 'px'; });
      document.addEventListener('mouseup', () => { isDown = false; });
    })();

    // 最小化
    panel.querySelector('.mini').addEventListener('click', () => {
      const body = panel.querySelector('.body');
      const ft = panel.querySelector('.ft');
      const isHidden = body.style.display === 'none';
      body.style.display = isHidden ? '' : 'none';
      ft.style.display = isHidden ? '' : 'none';
    });

    // 事件
    panel.querySelector('#zjjys-enter').addEventListener('click', () => {
      const sel = panel.querySelector('#zjjys-course-select');
      const idx = sel.selectedIndex;
      if (idx < 0 || !STATE.courses[idx]) return setStatus('请选择课程');
      try { localStorage.setItem('ZJYJS_AUTO', '1'); } catch (e) {}
      location.href = STATE.courses[idx].url;
    });
    panel.querySelector('#zjjys-open-all').addEventListener('click', () => {
      if (!STATE.courses.length) return setStatus('未找到课程');
      try { localStorage.setItem('ZJYJS_AUTO', '1'); } catch (e) {}
      let delay = 0;
      STATE.courses.forEach((c) => {
        setTimeout(() => { window.open(c.url, '_blank'); }, delay);
        delay += 250;
      });
      setStatus(`已尝试打开 ${STATE.courses.length} 个课程`);
    });
    panel.querySelector('#zjjys-refresh').addEventListener('click', () => fillSelect());

    // 选择框锁定，避免刷新时抢焦点或重置选择
    const sel = panel.querySelector('#zjjys-course-select');
    sel.addEventListener('focus', () => { STATE.selectLocked = true; });
    sel.addEventListener('blur', () => { STATE.selectLocked = false; });

    return panel;
  }

  function setStatus(msg) {
    const el = document.getElementById('zjjys-status');
    if (el) el.textContent = msg;
  }

  function getDesiredRate() {
    // 优先取本脚本设置的倍速，其次回退到全局 basicConf.rate
    if (STATE && typeof STATE.rate === 'number' && !Number.isNaN(STATE.rate)) return STATE.rate;
    try { if (typeof basicConf?.rate === 'number') return basicConf.rate; } catch (e) {}
    return 2;
  }

  function setDesiredRate(rate) {
    const r = Math.max(0.25, Math.min(16, Number(rate) || 1));
    STATE.rate = r;
    try { localStorage.setItem('ZJYJS_RATE', String(r)); } catch (e) {}
    applyRateToAllVideos(r);
    setStatus(`倍速已设置为 ${r}x`);
  }

  function applyRateToAllVideos(rate) {
    const videos = getVideoCandidates();
    videos.forEach(v => { try { v.playbackRate = rate; } catch (e) {} });
  }

  function ensureRateRow(panel) { /* 已移除倍速控制，保留兼容性函数体为空 */ }

  function fillSelect() {
    const panel = ensurePanel();
    const sel = panel.querySelector('#zjjys-course-select');
    if (STATE.selectLocked) return; // 用户正在操作下拉时不刷新
    const prevSelectedId = (function(){
      const o = sel.options[sel.selectedIndex];
      return o ? o.getAttribute('data-course-id') : null;
    })();
    sel.innerHTML = '<option disabled selected>正在扫描课程...</option>';
    const list = queryCourses();
    if (!list.length) {
      sel.innerHTML = '<option disabled selected>未扫描到课程</option>';
      setStatus('未扫描到课程，请在课程列表页重试');
      return;
    }
    sel.innerHTML = '';
    list.forEach((c, i) => {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = `${c.name}（ID:${c.id}）`;
      if (c.id) opt.setAttribute('data-course-id', c.id);
      sel.appendChild(opt);
    });
    if (prevSelectedId) {
      const idx = list.findIndex(c => String(c.id) === String(prevSelectedId));
      if (idx >= 0 && sel.options[idx]) sel.selectedIndex = idx;
    }
    setStatus(`已加载 ${list.length} 门课程`);
  }

  // 初始化：等待 body 与课程列表出现
  const isCourses = location.pathname.startsWith('/user/courses');
  const isContent = location.pathname.includes('/course/') && location.pathname.includes('/content');
  const isFullScreen = location.pathname.includes('/course/') && location.pathname.includes('/learning-activity/full-screen');

  function safeClick(el) {
    try {
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    } catch (e) {}
    el.click();
  }

  async function waitFor(selector, timeoutMs = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const el = document.querySelector(selector);
      if (el) return el;
      await new Promise(r => setTimeout(r, 200));
    }
    return null;
  }

  function pickNextActivityCandidate() {
    const candidates = Array.from(document.querySelectorAll(
      '.modules [ng-click*="openActivity"], ' +
      '.modules a[href*="/learning-activity/"], ' +
      '.modules .activity a, .modules .activity button'
    )).filter(el => {
      const text = (el.innerText || el.textContent || '').trim();
      const done = /已完成|完成|Done|Completed/i.test(text) ||
        el.closest('.completed, .done, .is-completed, [data-complete="true"]');
      return !done && el.offsetParent !== null;
    });
    const videoLike = candidates.find(el => /视频|video|播放/i.test((el.innerText || el.textContent || '')));
    return videoLike || candidates[0] || null;
  }

  async function handleContentPage() {
    const auto = (function(){ try { return localStorage.getItem('ZJYJS_AUTO') === '1'; } catch (e) { return false; } })();
    if (!auto) return;

    const modules = await waitFor('.modules', 15000);
    if (!modules) return;

    const tryEnter = () => {
      const target = pickNextActivityCandidate();
      if (target) {
        try { setStatus && setStatus('进入下一活动...'); } catch (e) {}
        safeClick(target);
        return true;
      }
      try { setStatus && setStatus('未找到未完成的活动'); } catch (e) {}
      return false;
    };

    tryEnter();

    try {
      const mo = new MutationObserver(() => {
        if (location.pathname.includes('/course/') && location.pathname.includes('/content')) {
          tryEnter();
        }
      });
      mo.observe(modules, { childList: true, subtree: true });
    } catch (e) {}

    window.addEventListener('hashchange', () => {
      if (location.pathname.includes('/course/') && location.pathname.includes('/content')) {
        setTimeout(tryEnter, 300);
      }
    });
  }

  // -------- Full-screen 播放页处理（左侧为 div.module-list.full-screen） --------
  function getVideoCandidates() {
    function collectFromDoc(doc, depth = 0, acc = []) {
      try { acc.push(...doc.querySelectorAll('video')); } catch (e) {}
      if (depth >= 2) return acc; // 最多递归两层 iframe，避免性能问题
      const frames = Array.from((doc || document).querySelectorAll('iframe'));
      for (const f of frames) {
        try {
          const d = f.contentDocument || f.contentWindow?.document;
          if (d) collectFromDoc(d, depth + 1, acc);
        } catch (e) {}
      }
      return acc;
    }
    return collectFromDoc(document, 0, []);
  }

  function clickPlayButtons(root = document) {
    const selectors = [
      'button[aria-label="播放"]',
      'button[title*="播放"]',
      '.vjs-big-play-button',
      '.btn-play, .play-btn, button.play, .play-button, .video-play-button',
      '.xgplayer-play, .xgplayer-start',
      '.tc-player .vjs-big-play-button',
      '.xt_video_player_common_icon[data-state="pause"]',
      '.video-mask, .video-cover, .player-mask'
    ];
    for (const s of selectors) {
      const el = root.querySelector(s);
      if (el && el.offsetParent !== null) { el.click(); return true; }
    }
    return false;
  }

  function clickTronClassNext(root = document) {
    const selectors = [
      'button.button.ng-scope[ng-if="nextActivity"][ng-click*="changeActivity(nextActivity)"]',
      'button.button.ng-scope[ng-click*="changeActivity(nextActivity)"]',
      'button.button.ng-scope[ng-click^="changeActivity"]',
      '[ng-click*="changeActivity(nextActivity)"]',
      '[ng-click^="changeActivity("]'
    ];
    for (const sel of selectors) {
      const btn = root.querySelector(sel);
      if (btn && btn.offsetParent !== null) {
        try { btn.scrollIntoView({ block: 'center', behavior: 'instant' }); } catch (e) {}
        try {
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        } catch (e) {}
        try { btn.click(); return true; } catch (e) {}
        // Fallback：直接通过 AngularJS 调用 changeActivity(nextActivity)
        try {
          const ngClick = String(btn.getAttribute('ng-click') || '');
          if (window.angular && /changeActivity\(/.test(ngClick)) {
            const el = window.angular.element(btn);
            const scope = (el && (el.scope && el.scope())) || (el && el.isolateScope && el.isolateScope()) || null;
            const nextAct = scope?.nextActivity || scope?.$parent?.nextActivity;
            const change = scope?.changeActivity || scope?.$parent?.changeActivity;
            if (change && nextAct) {
              if (scope && typeof scope.$apply === 'function') {
                scope.$apply(() => change.call(scope, nextAct));
              } else {
                change.call(scope || null, nextAct);
              }
              return true;
            }
          }
        } catch (e) {}
      }
    }
    // 尝试 iframe 内部
    const iframes = Array.from(document.querySelectorAll('iframe'));
    for (const f of iframes) {
      try {
        const doc = f.contentDocument || f.contentWindow?.document;
        if (doc && clickTronClassNext(doc)) return true;
      } catch (e) {}
    }
    return false;
  }

  function clickSidebarNextFromFullScreen() {
    const sidebar = document.querySelector('div.module-list.full-screen');
    if (!sidebar) return false;
    // 当前活动项尝试：is-active/active/aria-current
    const active = sidebar.querySelector('.is-active, .active, [aria-current="true"]') ||
      // 次优：根据选中样式类名不确定时，取第一个带选中态的项
      Array.from(sidebar.querySelectorAll('li, .activity, .item')).find(el => /active|current/i.test(el.className || ''));
    let nextItem = active?.nextElementSibling || null;
    if (!nextItem) {
      // 部分结构为嵌套列表，尝试在同级容器中找到下一个
      const siblings = active?.parentElement ? Array.from(active.parentElement.children) : [];
      const idx = siblings.indexOf(active);
      if (idx >= 0 && idx + 1 < siblings.length) nextItem = siblings[idx + 1];
    }
    const clickable = nextItem?.querySelector('a, button, [role="button"]') || nextItem;
    if (clickable && clickable !== active) {
      safeClick(clickable);
      return true;
    }
    // 兜底：找包含“下一”字样的按钮
    const cand = Array.from(document.querySelectorAll('button, a')).find(b => /下一|下一个|Next|next/.test((b.innerText || b.textContent || '')));
    if (cand) { safeClick(cand); return true; }
    // 深化：基于 href/hash 精准匹配当前项并取下一个
    try {
      const currentId = (function(){ try { const m = String(location.hash||'').match(/#\/?(\d+)/); return m?m[1]:null; } catch(e){ return null; } })();
      const candidates = Array.from(sidebar.querySelectorAll('a[href], [ng-href], button[ng-click], [ng-click]')).filter(el => {
        const href = el.getAttribute('href') || el.getAttribute('ng-href') || '';
        const ng = el.getAttribute('ng-click') || '';
        return /learning-activity|openActivity|changeActivity/.test(href + ' ' + ng);
      });
      let idx = -1;
      if (currentId) {
        idx = candidates.findIndex(el => {
          const h = (el.href || el.getAttribute('href') || el.getAttribute('ng-href') || '');
          return String(h).includes(currentId);
        });
      }
      if (idx === -1) {
        // 若无法通过 id 匹配，则用 active 容器包含关系匹配
        const activeEl = sidebar.querySelector('[class*="active"], [aria-current="true"], [aria-selected="true"]');
        if (activeEl) idx = candidates.findIndex(el => activeEl.contains(el) || el.contains(activeEl));
      }
      if (idx >= 0 && idx + 1 < candidates.length) {
        safeClick(candidates[idx + 1]);
        return true;
      }
    } catch (e) {}
    return false;
  }

  function tryGoNextWithRetries(timeoutMs = 6000) {
    const start = Date.now();
    const beginHash = location.hash;
    function didNavigate() {
      if (location.hash !== beginHash) return true;
      // 兜底：尝试检测标题区域是否刷新
      const t = document.querySelector('.activity-title, .module-title, .header-bar, .title');
      if (t && t.getAttribute && t.getAttribute('data-last-checked') !== String(start)) {
        try { t.setAttribute('data-last-checked', String(start)); } catch (e) {}
        return false;
      }
      return false;
    }
    return new Promise((resolve) => {
      function attempt() {
        // 依次尝试点击
        let clicked = false;
        if (clickTronClassNext()) clicked = true;
        else if (clickSidebarNextFromFullScreen()) clicked = true;
        else {
          const btn = Array.from(document.querySelectorAll('button, a')).find(b => /下一|下一个|Next|next/.test((b.innerText || b.textContent || '')));
          if (btn) { safeClick(btn); clicked = true; }
        }
        if (clicked) {
          setTimeout(() => {
            if (didNavigate()) return resolve(true);
            // 未发生路由变化则继续重试
            if (Date.now() - start >= timeoutMs) return resolve(false);
            const elapsed = Date.now() - start;
            const delay = elapsed < 1500 ? 250 : (elapsed < 3000 ? 450 : 750);
            setTimeout(attempt, delay);
          }, 200);
          return;
        }
        if (Date.now() - start >= timeoutMs) return resolve(false);
        const elapsed = Date.now() - start;
        const delay = elapsed < 1500 ? 250 : (elapsed < 3000 ? 450 : 750);
        setTimeout(attempt, delay);
      }
      attempt();
    });
  }

  function trySetupFullScreenVideo() {
    // 不再实际播放视频，仅用于 DOM 检测；播放由后端区间上报模拟
    const video = getVideoCandidates()[0];
    if (!video) return false;
    // 仍保持静音，避免用户意外听到声音（如果视频意外播放）
    try {
      video.muted = true;
      video.volume = 0;
    } catch (e) {}
    return true;
  }

  // 获取活动总时长（秒）：优先 activities/{id}?sub_course_id=0 的 uploads.videos.duration
  async function fetchActivityTotalSec(actId, video) {
    // 优先用 activities/{id}?sub_course_id=0 获取 uploads[].videos[].duration
    try {
      const resAct = await fetch(`/api/activities/${actId}?sub_course_id=0`, { credentials: 'include' });
      if (resAct.ok) {
        const js = await resAct.json();
        const uploads = Array.isArray(js?.uploads) ? js.uploads : [];
        let maxDur = 0;
        for (const up of uploads) {
          const vids = Array.isArray(up?.videos) ? up.videos : [];
          for (const vv of vids) {
            const d = Number(vv?.duration);
            if (Number.isFinite(d) && d > maxDur) maxDur = d;
          }
        }
        if (maxDur > 0) return Math.floor(maxDur);
      }
    } catch (e) {}
    // 兜底：video.duration
    try {
      const v = video || getVideoCandidates()[0];
      const vd = Math.floor(v?.duration || 0);
      if (Number.isFinite(vd) && vd > 0) return vd;
    } catch (e) {}
    // 再兜底：activity-read 的 ranges 最大 end
    try {
      let res = await fetch(`/api/course/activity-read/${actId}`, { credentials: 'include' });
      if (!res.ok) {
        try { res = await fetch(`/api/course/activity-read?activity_id=${encodeURIComponent(actId)}`, { credentials: 'include' }); } catch (e) {}
      }
      if (!res.ok) return null;
      const json = await res.json();
      const ar = json && (json.activity_read || json);
      const ranges = Array.isArray(ar?.data?.ranges) ? ar.data.ranges : null;
      if (ranges && ranges.length) {
        let maxEnd = 0;
        for (const r of ranges) {
          if (Array.isArray(r) && r.length >= 2) {
            const e = Number(r[1]);
            if (Number.isFinite(e) && e > maxEnd) maxEnd = e;
          }
        }
        if (maxEnd > 0) return Math.floor(maxEnd);
      }
    } catch (e) {}
    return null;
  }

  // 按 125s 片段向后端上报观看区间：/api/course/activities-read/{activityId} POST {start,end}
  function startActivityPosting(actId, video) {
    if (!actId || !video) return;
    try {
      const existing = STATE.activityPosters[actId];
      if (existing && existing.timer) return; // 已在上报
    } catch (e) {}

    const MAX_SPAN = 125; // s（后端限制）
    const REPORT_TICK_SEC = 45; // 间隔45s发送一次
    const CHUNK_LEN_SEC = Math.min(125, 90); // 每次上报90s（≈2倍速），不超过后端上限
    let lastEnd = 0; // 已上报到的虚拟时间（秒）
    try { if (STATE.activityPosters[actId]?.lastEnd >= 0) lastEnd = STATE.activityPosters[actId].lastEnd; } catch (e) {}

    async function postRange(start, end) {
      const safeStart = Math.max(0, Math.floor(start));
      const safeEnd = Math.max(safeStart, Math.floor(end));
      if (safeEnd - safeStart <= 0) return null;
      const body = JSON.stringify({ start: safeStart, end: safeEnd });
      try {
        const res = await fetch(`/api/course/activities-read/${actId}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body
        });
        try { console.log('[ZJJYS] posted range', { actId, start: safeStart, end: safeEnd }); } catch (e) {}
        
        if (res.ok) {
          try {
            const json = await res.json();
            try { console.log('[ZJJYS] post response:', { actId, json }); } catch (e) {}
            // 尝试从响应中提取完成度
            let completeness = null;
            if (json) {
              // 优先查找 completeness 字段（可能是字符串 'full' 或数字）
              if (json.completeness === 'full' || json.completeness === 'Full') {
                completeness = 100;
              } else if (typeof json.completeness === 'number') {
                completeness = json.completeness;
              } else if (typeof json.data?.completeness === 'number') {
                completeness = json.data.completeness;
              }
            }
            return { completeness, json };
          } catch (e) {
            try { console.warn('[ZJJYS] post response parse failed', { actId, error: String(e) }); } catch (e2) {}
          }
        }
        return null;
      } catch (e) {
        try { console.warn('[ZJJYS] post range failed', { actId, start: safeStart, end: safeEnd, error: String(e) }); } catch (e2) {}
        return null;
      }
    }

    // 解析已观看的 ranges，返回归一化的区间数组（按起点排序且合并）
    function parseWatchedRanges(ar) {
      const ranges = Array.isArray(ar?.data?.ranges) ? ar.data.ranges : [];
      const normalized = [];
      for (const r of ranges) {
        if (Array.isArray(r) && r.length >= 2) {
          const s = Math.floor(Number(r[0]));
          const e = Math.floor(Number(r[1]));
          if (Number.isFinite(s) && Number.isFinite(e) && e > s) {
            normalized.push([s, e]);
          }
        }
      }
      // 按起点排序
      normalized.sort((a, b) => a[0] - b[0]);
      // 合并重叠区间
      const merged = [];
      for (const [s, e] of normalized) {
        if (merged.length === 0 || merged[merged.length - 1][1] < s) {
          merged.push([s, e]);
        } else {
          merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
        }
      }
      return merged;
    }

    // 计算未观看的区间
    function calcUnwatchedGaps(watchedRanges, totalSec) {
      if (!Number.isFinite(totalSec) || totalSec <= 0) return [];
      const gaps = [];
      let cursor = 0;
      for (const [s, e] of watchedRanges) {
        if (cursor < s) gaps.push([cursor, s]);
        cursor = Math.max(cursor, e);
      }
      if (cursor < totalSec) gaps.push([cursor, totalSec]);
      return gaps;
    }

    let totalSec = null;
    let unwatchedGaps = [];
    let gapIndex = 0; // 当前正在上报的 gap 索引
    let gapCursor = 0; // 当前 gap 内的上报进度
    let gapsCalculated = false; // 标记 gaps 是否已计算，防止重复计算
    let stopped = false; // 标记是否已停止，防止定时器竞态

    async function tick() {
      // 防止在清理后继续执行
      if (stopped) return;

      // 1. 获取总时长
      if (!Number.isFinite(totalSec) || totalSec == null) {
        const t = await fetchActivityTotalSec(actId, video);
        if (Number.isFinite(t) && t > 0) {
          totalSec = t;
          try { console.log('[ZJJYS] totalSec resolved', { actId, totalSec }); } catch (e) {}
        }
      }

      // 2. 若总时长已知且尚未计算 gaps，获取已观看 ranges 并计算未观看 gaps
      if (Number.isFinite(totalSec) && totalSec > 0 && !gapsCalculated) {
        gapsCalculated = true; // 标记为已计算，避免重复
        try {
          let res = await fetch(`/api/course/activity-read/${actId}`, { credentials: 'include' });
          if (!res.ok) {
            try { res = await fetch(`/api/course/activity-read?activity_id=${encodeURIComponent(actId)}`, { credentials: 'include' }); } catch (e) {}
          }
          if (res.ok) {
            const json = await res.json();
            const ar = json && (json.activity_read || json);
            const watched = parseWatchedRanges(ar);
            unwatchedGaps = calcUnwatchedGaps(watched, totalSec);
            try { console.log('[ZJJYS] watched ranges & unwatched gaps', { actId, watched, unwatchedGaps }); } catch (e) {}
            // 若没有未观看片段，直接查完成度并跳转
            if (unwatchedGaps.length === 0) {
              try { console.log('[ZJJYS] all watched, checking completeness'); } catch (e) {}
              stopped = true; // 标记为已停止
              try { clearInterval(STATE.activityPosters[actId]?.timer); } catch (e) {}
              STATE.activityPosters[actId] = { lastEnd: totalSec, timer: null, totalSec };
              const pct = await fetchActivityCompleteness(actId);
              if (typeof pct === 'number' && pct >= 99) {
                try { setStatus(`完成度 ${pct}%，已完成`); } catch (e) {}
                if (!STATE.skipInProgress) {
                  STATE.skipInProgress = true;
                  tryGoNextWithRetries(6000).finally(() => { STATE.skipInProgress = false; });
                }
              }
              return;
            }
          }
        } catch (e) {
          try { console.warn('[ZJJYS] failed to get watched ranges', { actId, error: String(e) }); } catch (e2) {}
        }
      }

      // 3. 若仍无 gaps（总时长未知或首次尝试失败），回退到从 0 开始
      if (unwatchedGaps.length === 0 && Number.isFinite(totalSec) && totalSec > 0) {
        unwatchedGaps = [[0, totalSec]];
        try { console.log('[ZJJYS] fallback: no gaps, using full range', { actId, unwatchedGaps }); } catch (e) {}
      }

      // 4. 若还是无有效 gap（总时长未知），按旧逻辑推进
      if (unwatchedGaps.length === 0) {
        const target = lastEnd + CHUNK_LEN_SEC;
        const nextEnd = Math.min(lastEnd + CHUNK_LEN_SEC, target);
        if (nextEnd > lastEnd) {
          await postRange(lastEnd, nextEnd);
          lastEnd = nextEnd;
        }
        STATE.activityPosters[actId] = { lastEnd, timer: STATE.activityPosters[actId]?.timer, totalSec };
        return;
      }

      // 5. 从当前 gap 推进
      if (gapIndex >= unwatchedGaps.length) {
        // 所有 gap 已上报完，停止定时器
        try { console.log('[ZJJYS] all gaps posted, stopping timer'); } catch (e) {}
        stopped = true;
        try { clearInterval(STATE.activityPosters[actId]?.timer); } catch (e) {}
        STATE.activityPosters[actId] = { lastEnd: totalSec, timer: null, totalSec };
        return;
      }

      const [gapStart, gapEnd] = unwatchedGaps[gapIndex];
      const currentPos = gapStart + gapCursor;
      const nextPos = Math.min(currentPos + CHUNK_LEN_SEC, gapEnd);
      if (nextPos > currentPos) {
        const result = await postRange(currentPos, nextPos);
        gapCursor = nextPos - gapStart;
        
        // 从 POST 响应中读取完成度
        let pct = result?.completeness;
        try { console.log('[ZJJYS] after post, completeness from response:', { actId, pct, result }); } catch (e) {}
        
        // 更新面板显示完成度
        if (typeof pct === 'number') {
          try { 
            setStatus(`上报进度：${Math.floor(nextPos)}s / ${totalSec || '?'}s，完成度 ${pct}%`); 
          } catch (e) {}
          // 同时更新缓存
          try {
            STATE.completenessCache[actId] = pct;
            STATE.apiCheckTsByActivity[actId] = Date.now();
          } catch (e) {}
        }
        
        if (typeof pct === 'number' && pct >= 100) {
          try { setStatus(`完成度 ${pct}%，已完成`); } catch (e) {}
          stopped = true;
          try { clearInterval(STATE.activityPosters[actId]?.timer); } catch (e) {}
          STATE.activityPosters[actId] = { lastEnd: nextPos, timer: null, totalSec };
          if (!STATE.skipInProgress) {
            STATE.skipInProgress = true;
            tryGoNextWithRetries(6000).finally(() => { STATE.skipInProgress = false; });
          }
          return;
        }
      }
      
      // 当前 gap 完成，移至下一个
      if (nextPos >= gapEnd) {
        gapIndex++;
        gapCursor = 0;
      }
      STATE.activityPosters[actId] = { lastEnd: nextPos, timer: STATE.activityPosters[actId]?.timer, totalSec };
    }

    try { console.log('[ZJJYS] startActivityPosting', { actId }); } catch (e) {}
    // 立即一次，并每 REPORT_TICK_SEC 秒推进
    tick().catch(() => {});
    const timer = setInterval(() => { tick().catch(() => {}); }, REPORT_TICK_SEC * 1000);
    STATE.activityPosters[actId] = { lastEnd, timer, totalSec };
  }

  function handleFullScreenPage() {
    const auto = (function(){ try { return localStorage.getItem('ZJYJS_AUTO') === '1'; } catch (e) { return false; } })();
    if (!auto) return;

    // 拦截并修正平台日志请求中的异常区间（例如 {start:499,end:0} 或跨度>125s）
    (function hookLogSanitizer(){
      const MAX_SPAN = 125; // 后端报错提示的上限
      function fixRangePair(pair){
        if (!Array.isArray(pair) || pair.length < 2) return pair;
        let s = Number(pair[0]); let e = Number(pair[1]);
        if (!Number.isFinite(s) || !Number.isFinite(e)) return pair;
        if (e < s) e = s; // 纠正负跨度
        if (e - s > MAX_SPAN) e = s + MAX_SPAN; // 限制跨度
        return [s, e];
      }
      function sanitizeObject(obj){
        if (!obj || typeof obj !== 'object') return obj;
        if (typeof obj.start === 'number' && typeof obj.end === 'number') {
          let s = obj.start; let e = obj.end;
          if (e < s) e = s;
          if (e - s > MAX_SPAN) e = s + MAX_SPAN;
          obj.start = s; obj.end = e;
        }
        if (Array.isArray(obj.ranges)) {
          obj.ranges = obj.ranges.map(fixRangePair);
        }
        // 深层字段递归修正
        for (const k in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, k)) {
            const v = obj[k];
            if (v && typeof v === 'object') sanitizeObject(v);
          }
        }
        return obj;
      }
      function trySanitizeBodyText(text){
        try {
          const data = JSON.parse(text);
          const fixed = sanitizeObject(data);
          return JSON.stringify(fixed);
        } catch (e) { return text; }
      }
      try {
        // fetch 拦截（仅处理以 url+init 形式调用且 body 为 JSON 字符串的情况）
        const rawFetch = window.fetch;
        if (typeof rawFetch === 'function') {
          window.fetch = function(input, init){
            try {
              if (init && typeof init.body === 'string' && (init.headers ? /json/i.test(String(init.headers['Content-Type']||init.headers['content-type']||'')) : true)) {
                init = Object.assign({}, init, { body: trySanitizeBodyText(init.body) });
              }
            } catch (e) {}
            return rawFetch.call(this, input, init);
          }
        }
      } catch (e) {}
      try {
        // XHR 拦截
        const send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(data){
          try {
            if (typeof data === 'string') {
              data = trySanitizeBodyText(data);
            }
          } catch (e) {}
          return send.call(this, data);
        }
      } catch (e) {}
    })();

    function isVisible(el){ return !!el && el.offsetParent !== null; }
    // 等待页面关键元素渲染完成后再做完成度判断与跳转
    function waitForRendered(timeoutMs = 5000) {
      const selectors = [
        'button.button.ng-scope[ng-click*="changeActivity"], [ng-click*="changeActivity("]',
        'div.module-list.full-screen',
        'video',
        '.attachments-wrapper',
        '.exam-basic-info'
      ];
      const start = Date.now();
      return new Promise((resolve) => {
        function tick() {
          for (const s of selectors) {
            const el = document.querySelector(s);
            if (el) return resolve(true);
          }
          if (Date.now() - start >= timeoutMs) return resolve(false);
          setTimeout(tick, 150);
        }
        tick();
      });
    }
    let checkTimer;
    function scheduleRenderedCheck(delayMs = 0) {
      if (checkTimer) clearTimeout(checkTimer);
      checkTimer = setTimeout(async () => {
        await waitForRendered(5000);
        // 启动上报器（先于所有判定逻辑）
        try {
          const id = getActivityIdFromHash();
          const v = getVideoCandidates()[0];
          if (id && v) {
            startActivityPosting(id, v);
          }
        } catch (e) {}
        // 渲染后仅检查一次；若已有缓存（queriedActivities）则不重复请求
        const idGate = getActivityIdFromHash();
        if (STATE.queriedActivities[idGate] && typeof STATE.completenessCache[idGate] === 'number') {
          // 直接使用缓存做判定
          const pct = STATE.completenessCache[idGate];
          if (typeof pct === 'number' && pct >= 100) {
            try { setStatus(`完成度 ${pct}%，自动跳过`); } catch (e) {}
            if (!STATE.skipInProgress) {
              STATE.skipInProgress = true;
              tryGoNextWithRetries(6000).finally(() => { STATE.skipInProgress = false; });
            }
            return;
          }
          // 缓存<100则不再请求，交由后续播放完成检测推进
          return;
        }
        await checkCompleteThenPlay();
      }, delayMs);
    }
    function isAttachmentView() {
      const tab = document.querySelector('div[ng-show*="attachment"]');
      if (isVisible(tab)) return true;
      const wrap = document.querySelector('.attachments-wrapper');
      if (isVisible(wrap)) return true;
      return false;
    }
    function isExamView() {
      const exam = document.querySelector('.exam-basic-info');
      if (isVisible(exam)) return true;
      // 兜底：标题/区域含“测验/考试”字样
      const hint = Array.from(document.querySelectorAll('.title, .header, .header-bar, .exam, .quiz, .test')).some(n => /测验|考试|Quiz|Exam/i.test((n.innerText || n.textContent || '')));
      return hint;
    }
    function isActivityCompletedUI() {
      try {
        // 常见进度展示区域
        const nodes = Array.from(document.querySelectorAll('.progress, .progress-text, .progress-wrap, .activity-status, .learning-activity-status, .percent, .progress__text, .title, header, .header-bar, .header'));
        const allTexts = nodes.map(n => (n.innerText || n.textContent || '').trim()).join('\n');
        if (/已完成|完成|99%|100%/.test(allTexts)) return true;
        // 兜底：全局搜索少量文本
        const bodyText = (document.body.innerText || '').slice(0, 5000); // 限制长度以防性能问题
        if (/已完成|99%|100%/.test(bodyText)) return true;
      } catch (e) {}
      return false;
    }
    function getActivityIdFromHash() {
      try {
        const m = String(location.hash || '').match(/#\/?(\d+)/);
        return m ? m[1] : null;
      } catch (e) { return null; }
    }
  function getCourseIdFromPath() {
    try {
      // /course/78783/learning-activity/full-screen
      const m = location.pathname.match(/\/course\/(\d+)\//);
      return m ? m[1] : null;
    } catch (e) { return null; }
  }
  async function fetchActivityCompleteness(actId) {
      try {
        if (!actId) return null;
        // 先读缓存，10秒内不再打接口；若本会话已请求过该活动且已有缓存，优先返回缓存
        try {
          if (STATE.queriedActivities[actId] && typeof STATE.completenessCache[actId] === 'number') {
            return STATE.completenessCache[actId];
          }
          const ts = STATE.apiCheckTsByActivity[actId];
          const cached = STATE.completenessCache[actId];
          if (typeof ts === 'number' && Date.now() - ts < 10000 && typeof cached === 'number') {
            return cached;
          }
        } catch (e) {}
        // 并发去重
        if (STATE.inflightByActivity[actId]) return await STATE.inflightByActivity[actId];
        const req = (async () => {
          // 标记本会话已请求过，避免后续重复调用
          try { STATE.queriedActivities[actId] = true; } catch (e) {}
          let urlTried = `/api/course/activity-read/${actId}`;
          let res = await fetch(urlTried, { credentials: 'include' });
        if (!res.ok) {
          // 某些站点使用 activity_id 作为查询参数形式
          try {
              urlTried = `/api/course/activity-read?activity_id=${encodeURIComponent(actId)}`;
              res = await fetch(urlTried, { credentials: 'include' });
          } catch (e) {}
        }
          if (!res.ok) {
            try { console.warn('[ZJJYS] activity-read failed', { url: urlTried, actId, status: res.status }); } catch (e) {}
            try { STATE.apiCheckTsByActivity[actId] = Date.now(); STATE.completenessCache[actId] = -1; } catch (e) {}
            return null;
          }
          const json = await res.json();
          try { console.log('[ZJJYS] activity-read response', { url: urlTried, actId, status: res.status, json }); } catch (e) {}
          let value = null;
          const ar = json && (json.activity_read || json);
          // 优先判断顶层 completeness 是否为 'full'
          if (ar && (ar.completeness === 'full' || ar.completeness === 'Full' || ar.completeness === 100)) value = 100;
          else if (ar && typeof ar?.completeness === 'number') value = ar.completeness;
          else if (ar && typeof ar?.data?.completeness === 'number') value = ar.data.completeness;
          try { console.log('[ZJJYS] activity-read completeness parsed', { actId, value }); } catch (e) {}
        if (typeof value === 'number') {
          try {
            STATE.completenessCache[actId] = value;
            STATE.apiCheckTsByActivity[actId] = Date.now();
              STATE.queriedActivities[actId] = true;
          } catch (e) {}
          return value;
        }
          try { STATE.apiCheckTsByActivity[actId] = Date.now(); STATE.completenessCache[actId] = -1; } catch (e) {}
          return null;
        })();
        STATE.inflightByActivity[actId] = req;
        try { return await req; } finally { delete STATE.inflightByActivity[actId]; }
      } catch (e) { return null; }
    }
  // 注意：根据你的要求，暂不使用批量接口，保留函数占位（不被调用）
  let _activitiesCache = { courseId: null, ts: 0, map: null };
  async function fetchActivitiesCompletenessMap(courseId) { return null; }
    function attemptSkipIfAttachment() {
      if (isAttachmentView()) {
        // 附件页：直接下一节
        if (clickTronClassNext()) return true;
        if (clickSidebarNextFromFullScreen()) return true;
        const btn = Array.from(document.querySelectorAll('button, a')).find(b => /下一|下一个|Next|next/.test((b.innerText || b.textContent || '')));
        if (btn) { safeClick(btn); return true; }
      }
      return false;
    }
    function attemptSkipIfExam() {
      if (isExamView()) {
        if (clickTronClassNext()) return true;
        if (clickSidebarNextFromFullScreen()) return true;
        const btn = Array.from(document.querySelectorAll('button, a')).find(b => /下一|下一个|Next|next/.test((b.innerText || b.textContent || '')));
        if (btn) { safeClick(btn); return true; }
      }
      return false;
    }
    async function checkCompleteThenPlay() {
      // 节流：同一活动 2s 内最多判定一次，避免重复请求
      try {
        const idGate = getActivityIdFromHash();
        const lastTs = STATE.lastCheckGateTsByActivity[idGate];
        if (typeof lastTs === 'number' && Date.now() - lastTs < 2000) return false;
        STATE.lastCheckGateTsByActivity[idGate] = Date.now();
      } catch (e) {}
      
      // 先启动区间上报（视频存在时）
      try {
        const id = getActivityIdFromHash();
        const v = getVideoCandidates()[0];
        if (id && v) {
          startActivityPosting(id, v);
        }
      } catch (e) {}
      
      // 再用接口判断完成度 >=100 即跳过
      try {
        const id = getActivityIdFromHash();
        const pct = await fetchActivityCompleteness(id); // 仅使用 GET 单条接口
        if (typeof pct === 'number' && pct >= 100) {
          try { setStatus(`完成度 ${pct}%，自动跳过`); } catch (e) {}
          if (STATE.skipInProgress) return true;
          STATE.skipInProgress = true;
          const ok = await tryGoNextWithRetries(6000);
          STATE.skipInProgress = false;
          if (ok) return true;
        }
      } catch (e) {}
      // 若 UI 显示已完成，直接下一节
      if (isActivityCompletedUI()) {
        try {
          const id = getActivityIdFromHash();
          const pct = await fetchActivityCompleteness(id);
          if (typeof pct === 'number' && pct >= 100) {
            if (STATE.skipInProgress) return true;
            STATE.skipInProgress = true;
            const ok = await tryGoNextWithRetries(6000);
            STATE.skipInProgress = false;
            if (ok) return true;
          }
        } catch (e) {}
      }
      // 否则尽快启动播放（现在仅做 DOM 检测与静音）
      return trySetupFullScreenVideo();
    }

    // 若为附件页，进入即跳过
    setTimeout(attemptSkipIfAttachment, 200);
    // 若为测验/考试页，进入即跳过
    setTimeout(attemptSkipIfExam, 220);
    scheduleRenderedCheck(250);

    // 首次与延迟重试
    if (!trySetupFullScreenVideo()) {
      const waitTimer = setInterval(() => {
        if (attemptSkipIfAttachment()) { clearInterval(waitTimer); return; }
        if (attemptSkipIfExam()) { clearInterval(waitTimer); return; }
        scheduleRenderedCheck(0);
        // 如果 schedule 之后仍持续触发，超过一段时间也停止该轮询
        setTimeout(() => { try { clearInterval(waitTimer); } catch (e) {} }, 7000);
      }, 800);
    }

    // 保持静音、倍速、播放
    const keepTimer = setInterval(() => {
      const v = getVideoCandidates()[0];
      if (!v) return;
      const rate = getDesiredRate();
      if (v.playbackRate !== rate) v.playbackRate = rate;
      if (!v.muted) v.muted = true;
      if (v.volume !== 0) v.volume = 0;
      if (v.paused) {
        v.play().catch(() => { clickPlayButtons(document); });
      }
    }, 2000);

    // 完成检测与“下一节”
    const progressTimer = setInterval(async () => {
      const v = getVideoCandidates()[0];
      if (!v) return;
      const done = v.ended || (v.duration && v.currentTime / v.duration >= 0.99) || isActivityCompletedUI();
      if (done) {
        clearInterval(progressTimer);
        // 严格：只有当接口完成度为100时才跳
        try {
          const id = getActivityIdFromHash();
          // 最终补齐余下未上报的片段
          try { startActivityPosting(id, v); } catch (e) {}
          const cached = STATE.completenessCache[id];
          let pct = typeof cached === 'number' ? cached : null;
          if (pct !== 100) {
            pct = await fetchActivityCompleteness(id);
          }
          if (typeof pct === 'number' && pct >= 99 && !STATE.skipInProgress) {
            STATE.skipInProgress = true;
            tryGoNextWithRetries(6000).finally(() => { STATE.skipInProgress = false; });
          }
        } catch (e) {}
      }
    }, 3000);

    // 监听哈希与 DOM 变化，适配 Angular 动态路由
    window.addEventListener('hashchange', () => setTimeout(() => { attemptSkipIfAttachment() || attemptSkipIfExam() || trySetupFullScreenVideo(); scheduleRenderedCheck(200); }, 400));
    try {
      const mo = new MutationObserver(() => { attemptSkipIfAttachment() || attemptSkipIfExam() || trySetupFullScreenVideo(); scheduleRenderedCheck(150); });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}

    // 焦点与可见性变化时，立即尝试恢复播放（部分站点会切屏暂停）
    function quickResume() {
      const v = getVideoCandidates()[0];
      if (!v) return;
      v.play().catch(() => { clickPlayButtons(document); });
      setTimeout(() => { if (v.paused) v.play().catch(() => { clickPlayButtons(document); }); }, 200);
    }
    document.addEventListener('visibilitychange', quickResume, true);
    window.addEventListener('blur', quickResume, true);
    window.addEventListener('focus', quickResume, true);
  }

  // 非课程列表页：显示精简面板（仅状态与最小化），避免“助手消失”的困惑
  function setupNonCoursesPanel() {
    const panel = ensurePanel();
    try {
      const rows = panel.querySelectorAll('.row');
      rows.forEach(r => r.style.display = 'none');
      setStatus('内容页：自动模式运行中');
      // 附加：内容/全屏页的快捷按钮区
      const body = panel.querySelector('.body');
      let toolRow = panel.querySelector('#zjjys-non-courses');
      if (!toolRow) {
        toolRow = document.createElement('div');
        toolRow.className = 'row';
        toolRow.id = 'zjjys-non-courses';
        toolRow.innerHTML = `
          <button id="zjjys-back-list" class="ghost">返回课程列表</button>
          <button id="zjjys-continue-auto" class="secondary">继续自动</button>
        `;
        body.appendChild(toolRow);
        // 事件绑定
        const backBtn = toolRow.querySelector('#zjjys-back-list');
        const autoBtn = toolRow.querySelector('#zjjys-continue-auto');
        backBtn.addEventListener('click', () => {
          try { localStorage.removeItem('ZJYJS_AUTO'); } catch (e) {}
          location.href = '/user/courses#/?pageIndex=1';
        });
        autoBtn.addEventListener('click', () => {
          try { localStorage.setItem('ZJYJS_AUTO', '1'); } catch (e) {}
          location.reload();
        });
      } else {
        toolRow.style.display = '';
      }

      // 按你的要求，移除播放页面板的倍速控制
      try {
        const rateRow = panel.querySelector('#zjjys-rate');
        if (rateRow) rateRow.remove();
      } catch (e) {}
    } catch (e) {}
  }

  const boot = setInterval(() => {
    if (!document.body) return;
    if (isCourses) {
      ensurePanel();
      fillSelect();
    } else if (isContent) {
      setupNonCoursesPanel();
      handleContentPage();
    } else if (isFullScreen) {
      setupNonCoursesPanel();
      handleFullScreenPage();
    }
    clearInterval(boot);
  }, 150);

  // DOM 变化时自动刷新（列表分页或筛选）
  if (isCourses) {
    try {
      const mo = new MutationObserver((mutations) => {
        // 仅当课程列表区域发生变化时刷新，避免频繁重置选择
        const hit = mutations.some(m => (m.target && (m.target.closest ? m.target.closest('ol.courses') : null)) || (m.addedNodes && Array.from(m.addedNodes).some(n => n.nodeType === 1 && (n.closest ? n.closest('ol.courses') : null))));
        if (!hit) return;
        if (mo._zjjysTimer) clearTimeout(mo._zjjysTimer);
        mo._zjjysTimer = setTimeout(() => fillSelect(), 300);
      });
      const container = document.querySelector('ol.courses') || document.body;
      mo.observe(container, { childList: true, subtree: true });
    } catch (e) {}
  }
})();


