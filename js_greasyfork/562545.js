// ==UserScript==
// @name         Bangumi Entry Intersection User Comparison + Long Comment Pin
// @name:zh-CN   Bangumi 条目交集用户对比 + 长评置顶
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Compare audience intersection and pin long comments on Bangumi.
// @match        https://bgm.tv/subject/*
// @match        http://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @match        http://bangumi.tv/subject/*
// @match        https://chii.in/subject/*
// @match        http://chii.in/subject/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562545/Bangumi%20Entry%20Intersection%20User%20Comparison%20%2B%20Long%20Comment%20Pin.user.js
// @updateURL https://update.greasyfork.org/scripts/562545/Bangumi%20Entry%20Intersection%20User%20Comparison%20%2B%20Long%20Comment%20Pin.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    cacheVersion: 2,
    cacheTtlMs: 24 * 60 * 60 * 1000,
    maxConcurrency: 3,
    maxRetries: 2,
    retryBaseDelayMs: 600,
    longCommentDefaultThreshold: 120,
    longCommentDefaultPages: 1,
    statusFallback: [
      { key: 'collect', label: '看过/已看' },
      { key: 'do', label: '在看' },
      { key: 'wish', label: '想看' },
      { key: 'on_hold', label: '搁置' },
      { key: 'dropped', label: '抛弃' }
    ],
    statusPriority: ['collect', 'do', 'on_hold', 'wish', 'dropped']
  };

  const state = {
    compareRunning: false,
    abortController: null,
    lastRows: null,
    lastSubjects: null
  };

  const commentPageCache = new Map();
  const commentPageInFlight = new Map();
  let commentApplyToken = 0;
  let commentApplying = false;
  let commentObserverMutedUntil = 0;
  let commentScrollActiveUntil = 0;
  let commentScrollTimer = null;
  let commentPendingApply = false;
  let commentContainerEl = null;
  let commentListObserver = null;
  let commentContainerObserver = null;

  const STYLE = `
    #bgm-cmp-panel {
      position: fixed;
      right: 16px;
      top: 80px;
      z-index: 9999;
      width: 360px;
      background: #fff;
      border: 1px solid #e0e0e0;
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
      padding: 12px;
      font-size: 13px;
      line-height: 1.4;
    }
    #bgm-cmp-panel.hidden {
      display: none;
    }
    #bgm-cmp-panel h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
    }
    #bgm-cmp-panel .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #bgm-cmp-panel .close-btn {
      background: transparent;
      color: #666;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
    }
    #bgm-cmp-panel .row { margin-bottom: 8px; }
    #bgm-cmp-panel input[type="text"] {
      width: 100%;
      box-sizing: border-box;
      padding: 6px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    #bgm-cmp-panel button {
      padding: 6px 10px;
      border: 1px solid #ccc;
      background: #f7f7f7;
      cursor: pointer;
      border-radius: 4px;
    }
    #bgm-cmp-panel button.primary {
      background: #2d8cf0;
      border-color: #2d8cf0;
      color: #fff;
    }
    #bgm-cmp-panel button:disabled { opacity: 0.6; cursor: not-allowed; }
    #bgm-cmp-panel .status-list label { display: inline-block; margin-right: 6px; }
    #bgm-cmp-panel .progress, #bgm-cmp-panel .results {
      background: #fafafa;
      border: 1px solid #eee;
      padding: 6px;
      border-radius: 4px;
      max-height: 180px;
      overflow: auto;
      white-space: pre-wrap;
    }
    #bgm-cmp-panel table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    #bgm-cmp-panel th, #bgm-cmp-panel td {
      border: 1px solid #e6e6e6;
      padding: 4px 6px;
      text-align: left;
    }
    #bgm-cmp-panel .muted { color: #888; }
  `;

  GM_addStyle(STYLE);

  const COOKIE_KEYS = {
    threshold: 'bgm_long_comment_threshold',
    applyAll: 'bgm_long_comment_all_status',
    pageLimit: 'bgm_long_comment_page_limit',
    panelHidden: 'bgm_cmp_panel_hidden'
  };

  function getCookie(name) {
    const parts = document.cookie.split(';').map(part => part.trim());
    for (const part of parts) {
      if (!part.startsWith(`${name}=`)) continue;
      return decodeURIComponent(part.slice(name.length + 1));
    }
    return null;
  }

  function setCookie(name, value, days) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(String(value))}; path=/; max-age=${maxAge}`;
  }

  function getSettingValue(key, fallback) {
    const fromCookie = getCookie(key);
    if (fromCookie !== null && fromCookie !== '') return fromCookie;
    const fromGm = GM_getValue(key, null);
    if (fromGm !== null && fromGm !== undefined && fromGm !== '') return fromGm;
    return fallback;
  }

  function setSettingValue(key, value) {
    setCookie(key, value, 365);
    GM_setValue(key, value);
  }

  function parseSubjectId(input) {
    if (!input) return null;
    const trimmed = input.trim();
    const num = trimmed.match(/^\d+$/);
    if (num) return num[0];
    const m = trimmed.match(/subject\/(\d+)/);
    if (m) return m[1];
    return null;
  }

  function currentSubjectId() {
    const m = location.pathname.match(/\/subject\/(\d+)/);
    return m ? m[1] : null;
  }

  function isSubjectPage() {
    return /\/subject\/\d+\/?$/.test(location.pathname);
  }

  function isCommentsPage() {
    return /\/subject\/\d+\/comments/.test(location.pathname);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function cacheGet(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.ts) return null;
      if (Date.now() - parsed.ts > CONFIG.cacheTtlMs) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function cacheSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore quota errors
    }
  }

  function toAbsoluteUrl(url) {
    if (url.startsWith('http')) return url;
    return new URL(url, location.origin).toString();
  }

  async function fetchWithRetry(url, options, retries, baseDelay) {
    let attempt = 0;
    while (true) {
      try {
        const res = await fetch(url, options);
        if (!res.ok && res.status >= 500 && attempt < retries) {
          attempt += 1;
          await sleep(baseDelay * attempt);
          continue;
        }
        return res;
      } catch (err) {
        if (attempt >= retries) throw err;
        attempt += 1;
        await sleep(baseDelay * attempt);
      }
    }
  }

  function extractNumber(str) {
    if (!str) return null;
    const m = str.match(/(?:^|[^0-9])((?:10|[1-9])(?:\.\d)?)(?:$|[^0-9])/);
    if (!m) return null;
    const num = Number(m[1]);
    if (Number.isNaN(num)) return null;
    if (num < 1 || num > 10) return null;
    return num;
  }

  function parseRating(item) {
    const itemDataKeys = ['rate', 'rating', 'score', 'stars'];
    for (const key of itemDataKeys) {
      const attr = item.getAttribute(`data-${key}`);
      const num = extractNumber(attr);
      if (num != null) return num;
      if (item.dataset && item.dataset[key]) {
        const num2 = extractNumber(item.dataset[key]);
        if (num2 != null) return num2;
      }
    }

    const starNodes = item.querySelectorAll('[class*="stars"], [class*="starlight"], [class*="starsinfo"], [class*="sstars"]');
    for (const node of starNodes) {
      if (node.className) {
        const classes = node.className.split(/\s+/);
        for (const cls of classes) {
          const m = cls.match(/(?:^|[^a-z])s?stars(\d+)/i);
          if (m) {
            const num = Number(m[1]);
            if (!Number.isNaN(num) && num >= 1 && num <= 10) return num;
          }
        }
      }
      const attrs = [node.getAttribute('title'), node.getAttribute('aria-label')];
      for (const attr of attrs) {
        const num = extractNumber(attr);
        if (num != null) return num;
      }
      for (const [, value] of Object.entries(node.dataset || {})) {
        const num = extractNumber(value);
        if (num != null) return num;
      }
      if (node.parentElement) {
        const num = extractNumber(node.parentElement.textContent || '');
        if (num != null) return num;
      }
    }

    const candidates = item.querySelectorAll('[class*="rate"], [class*="score"], [data-rate], [data-rating]');
    for (const el of candidates) {
      const attrs = [el.getAttribute('title'), el.getAttribute('aria-label')];
      for (const attr of attrs) {
        const num = extractNumber(attr);
        if (num != null) return num;
      }
      for (const [, value] of Object.entries(el.dataset || {})) {
        const num = extractNumber(value);
        if (num != null) return num;
      }
      const text = (el.textContent || '').trim();
      if (/^(10(?:\.0)?|[1-9](?:\.\d)?)$/.test(text)) {
        const num = Number(text);
        if (!Number.isNaN(num)) return num;
      }
    }

    return null;
  }

  function findBestUserList(doc) {
    const lists = Array.from(doc.querySelectorAll('ul, ol'));
    let best = null;
    let bestCount = 0;
    for (const list of lists) {
      const items = Array.from(list.children)
        .filter(el => el.querySelector && el.querySelector('a[href*="/user/"]'));
      if (items.length > bestCount) {
        best = { container: list, items };
        bestCount = items.length;
      }
    }
    if (best && bestCount >= 5) return best;
    const fallbackSelectors = [
      '#memberUserList',
      '.userlist',
      '.userList',
      '.users',
      '.user-list'
    ];
    for (const selector of fallbackSelectors) {
      const container = doc.querySelector(selector);
      if (!container) continue;
      const items = Array.from(container.querySelectorAll('li, div'))
        .filter(el => el.querySelector('a[href*="/user/"]'));
      if (items.length) return { container, items };
    }
    return null;
  }

  function parseUsersFromDoc(doc) {
    const best = findBestUserList(doc);
    let items = [];
    if (best && best.items) {
      items = best.items;
    } else {
      items = Array.from(doc.querySelectorAll('li, div'))
        .filter(el => el.querySelector('a[href*="/user/"]'));
    }
    const map = new Map();
    for (const item of items) {
      const link = item.querySelector('a[href*="/user/"]');
      if (!link) continue;
      const href = link.getAttribute('href') || '';
      const parts = href.split('/').filter(Boolean);
      const username = parts[parts.length - 1];
      if (!username) continue;
      const rate = parseRating(item);
      if (!map.has(username)) {
        map.set(username, { rate: rate == null ? null : rate });
        continue;
      }
      const existing = map.get(username);
      if (existing && existing.rate == null && rate != null) {
        map.set(username, { rate });
      }
    }
    return map;
  }

  function getTotalPages(doc) {
    let max = 1;
    const links = Array.from(doc.querySelectorAll('a[href*="page="]'));
    for (const link of links) {
      const href = link.getAttribute('href') || '';
      const url = new URL(toAbsoluteUrl(href));
      const page = Number(url.searchParams.get('page'));
      if (!Number.isNaN(page) && page > max) max = page;
    }
    const text = doc.body ? doc.body.textContent || '' : '';
    const m = text.match(/\/\s*(\d+)\s*\)/);
    if (m) {
      const page = Number(m[1]);
      if (!Number.isNaN(page) && page > max) max = page;
    }
    return max;
  }

  function parseStatusLinks(doc, subjectId) {
    const links = Array.from(doc.querySelectorAll(`a[href*="/subject/${subjectId}/collections"]`));
    const result = [];
    for (const link of links) {
      const href = link.getAttribute('href') || '';
      const url = new URL(toAbsoluteUrl(href));
      const status = url.searchParams.get('status') || url.searchParams.get('type');
      if (!status) continue;
      const label = (link.textContent || '').trim();
      if (!label) continue;
      result.push({ key: status, label, href: url.toString() });
    }
    return result;
  }

  async function getStatusOptions(subjectId, controller) {
    const url = `${location.origin}/subject/${subjectId}/collections?page=1`;
    const res = await fetchWithRetry(url, {
      credentials: 'include',
      signal: controller.signal
    }, CONFIG.maxRetries, CONFIG.retryBaseDelayMs);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const options = parseStatusLinks(doc, subjectId);
    if (options.length === 0) {
      return CONFIG.statusFallback.map(item => ({
        key: item.key,
        label: item.label,
        href: `${location.origin}/subject/${subjectId}/collections?status=${item.key}`
      }));
    }
    return options;
  }

  async function fetchStatusUsers(subjectId, statusOption, controller, progress) {
    const cacheKey = `bgm_cmp:v${CONFIG.cacheVersion}:${subjectId}:${statusOption.key}`;
    const cached = cacheGet(cacheKey);
    if (cached && cached.users) {
      const map = new Map(cached.users);
      progress({ cached: true, users: map.size, pages: cached.pages || 0, url: '(cache)' });
      return map;
    }

    const firstUrl = new URL(statusOption.href);
    firstUrl.searchParams.set('page', '1');
    const res = await fetchWithRetry(firstUrl.toString(), {
      credentials: 'include',
      signal: controller.signal
    }, CONFIG.maxRetries, CONFIG.retryBaseDelayMs);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const totalPages = getTotalPages(doc);
    let userMap = parseUsersFromDoc(doc);
    progress({ pages: 1, users: userMap.size, url: firstUrl.toString() });

    const pageTasks = [];
    for (let page = 2; page <= totalPages; page += 1) {
      const url = new URL(statusOption.href);
      url.searchParams.set('page', String(page));
      pageTasks.push(url.toString());
    }

    let inFlight = 0;
    let index = 0;
    let fetchedPages = 1;

    return new Promise((resolve, reject) => {
      const next = () => {
        if (controller.signal.aborted) {
          reject(new Error('aborted'));
          return;
        }
        if (index >= pageTasks.length && inFlight === 0) {
          cacheSet(cacheKey, {
            ts: Date.now(),
            pages: totalPages,
            users: Array.from(userMap.entries())
          });
          resolve(userMap);
          return;
        }
        while (inFlight < CONFIG.maxConcurrency && index < pageTasks.length) {
          const url = pageTasks[index];
          index += 1;
          inFlight += 1;
          fetchWithRetry(url, {
            credentials: 'include',
            signal: controller.signal
          }, CONFIG.maxRetries, CONFIG.retryBaseDelayMs)
            .then(r => r.text())
            .then(htmlText => {
              const d = new DOMParser().parseFromString(htmlText, 'text/html');
              const map = parseUsersFromDoc(d);
              for (const [user, data] of map.entries()) {
                if (!userMap.has(user)) userMap.set(user, data);
              }
              fetchedPages += 1;
              progress({ pages: fetchedPages, users: userMap.size, url });
            })
            .catch(err => {
              reject(err);
            })
            .finally(() => {
              inFlight -= 1;
              next();
            });
        }
      };
      next();
    });
  }

  function mergeStatusMaps(statusMaps) {
    const result = new Map();
    for (const { key, map } of statusMaps) {
      for (const [user, data] of map.entries()) {
        if (!result.has(user)) {
          result.set(user, { rate: data.rate, status: key });
          continue;
        }
        const existing = result.get(user);
        if (existing.rate == null && data.rate != null) {
          result.set(user, { rate: data.rate, status: existing.status });
          continue;
        }
        const currentPriority = CONFIG.statusPriority.indexOf(key);
        const existingPriority = CONFIG.statusPriority.indexOf(existing.status);
        if (existingPriority === -1 || (currentPriority !== -1 && currentPriority < existingPriority)) {
          result.set(user, { rate: existing.rate == null ? data.rate : existing.rate, status: key });
        }
      }
    }
    return result;
  }

  function computeStats(rows) {
    const rated = rows.filter(r => r.rateA != null && r.rateB != null);
    const diffs = rated.map(r => r.diff);
    const mean = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : null;
    const median = arr => {
      if (!arr.length) return null;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };
    const diffBins = { ge2: 0, eq1: 0, eq0: 0, eqm1: 0, le2: 0 };
    for (const d of diffs) {
      if (d >= 2) diffBins.ge2 += 1;
      else if (d === 1) diffBins.eq1 += 1;
      else if (d === 0) diffBins.eq0 += 1;
      else if (d === -1) diffBins.eqm1 += 1;
      else if (d <= -2) diffBins.le2 += 1;
    }
    const rateA = rated.map(r => r.rateA);
    const rateB = rated.map(r => r.rateB);
    return {
      ratedCount: rated.length,
      audienceCount: rows.length,
      meanA: mean(rateA),
      meanB: mean(rateB),
      medianA: median(rateA),
      medianB: median(rateB),
      diffBins
    };
  }

  function csvEscape(value) {
    if (value == null) return '';
    const text = String(value);
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  function buildCsv(rows, subjectA, subjectB) {
    const header = ['user', `rate_${subjectA}`, `rate_${subjectB}`, 'diff'];
    const lines = rows.map(r => [
      r.user,
      r.rateA == null ? '' : r.rateA,
      r.rateB == null ? '' : r.rateB,
      r.diff == null ? '' : r.diff
    ].map(csvEscape).join(','));
    return `\uFEFF${header.map(csvEscape).join(',')}\n${lines.join('\n')}`;
  }

  function downloadCsv(filename, content) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function renderResults(container, rows, stats, subjectA, subjectB) {
    const header = [
      `交集人数(观众): ${stats.audienceCount}`,
      `交集人数(严格评分): ${stats.ratedCount}`,
      `均分(${subjectA}/${subjectB}): ${stats.meanA?.toFixed(2) ?? '-'} / ${stats.meanB?.toFixed(2) ?? '-'}`,
      `中位数(${subjectA}/${subjectB}): ${stats.medianA ?? '-'} / ${stats.medianB ?? '-'}`,
      `diff 分布: >=2:${stats.diffBins.ge2} | 1:${stats.diffBins.eq1} | 0:${stats.diffBins.eq0} | -1:${stats.diffBins.eqm1} | <=-2:${stats.diffBins.le2}`
    ].join('\n');

    state.lastRows = rows;
    state.lastSubjects = { a: subjectA, b: subjectB };

    container.innerHTML = `
      <div class="row results">${header}</div>
      <div class="row">
        <button id="bgm-cmp-export" class="primary">导出 CSV</button>
        <span class="muted">共 ${rows.length} 行</span>
      </div>
    `;

    const exportBtn = container.querySelector('#bgm-cmp-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const subjectAId = String(subjectA).replace('#', '');
        const subjectBId = String(subjectB).replace('#', '');
        const filename = `bgm_compare_${subjectAId}_${subjectBId}.csv`;
        const csv = buildCsv(rows, subjectA, subjectB);
        downloadCsv(filename, csv);
      });
    }
  }

  function compareRows(mapA, mapB) {
    const rows = [];
    for (const user of mapA.keys()) {
      if (!mapB.has(user)) continue;
      const rateA = mapA.get(user).rate;
      const rateB = mapB.get(user).rate;
      const diff = (rateA != null && rateB != null) ? (rateA - rateB) : null;
      rows.push({ user, rateA, rateB, diff });
    }
    rows.sort((a, b) => (b.diff ?? -Infinity) - (a.diff ?? -Infinity));
    return rows;
  }

  async function startCompare(panel, statusOptions) {
    if (state.compareRunning) return;
    const subjectId = currentSubjectId();
    if (!subjectId) return;

    const input = panel.querySelector('#bgm-cmp-input');
    const progressBox = panel.querySelector('#bgm-cmp-progress');
    const resultBox = panel.querySelector('#bgm-cmp-result');
    const startBtn = panel.querySelector('#bgm-cmp-start');
    const cancelBtn = panel.querySelector('#bgm-cmp-cancel');

    const otherId = parseSubjectId(input.value);
    if (!otherId) {
      progressBox.textContent = '请输入正确的 subject id 或 URL。';
      return;
    }

    const selectedStatus = statusOptions
      .filter(opt => panel.querySelector(`input[data-status="${opt.key}"]`)?.checked);
    if (!selectedStatus.length) {
      progressBox.textContent = '请至少选择一个观众范围。';
      return;
    }

    state.compareRunning = true;
    state.abortController = new AbortController();
    startBtn.disabled = true;
    cancelBtn.disabled = false;
    progressBox.textContent = '准备抓取...';
    resultBox.innerHTML = '';

    const progress = (subjectLabel) => (info) => {
      const cached = info.cached ? '[cache] ' : '';
      progressBox.textContent = `${subjectLabel} ${cached}pages=${info.pages ?? 0}, users=${info.users ?? 0}\n${info.url ?? ''}`;
    };

    try {
      const [statusA, statusB] = await Promise.all([
        getStatusOptions(subjectId, state.abortController),
        getStatusOptions(otherId, state.abortController)
      ]);

      const selectedA = selectedStatus
        .map(s => statusA.find(o => o.key === s.key))
        .filter(Boolean);
      const selectedB = selectedStatus
        .map(s => statusB.find(o => o.key === s.key))
        .filter(Boolean);

      if (!selectedA.length || !selectedB.length) {
        progressBox.textContent = '无法匹配状态选项，请刷新后重试。';
        return;
      }

      const subjectALabel = `#${subjectId}`;
      const subjectBLabel = `#${otherId}`;

      const mapsA = [];
      for (const opt of selectedA) {
        const map = await fetchStatusUsers(subjectId, opt, state.abortController, progress(`A:${opt.key}`));
        mapsA.push({ key: opt.key, map });
      }
      const mapsB = [];
      for (const opt of selectedB) {
        const map = await fetchStatusUsers(otherId, opt, state.abortController, progress(`B:${opt.key}`));
        mapsB.push({ key: opt.key, map });
      }

      const mergedA = mergeStatusMaps(mapsA);
      const mergedB = mergeStatusMaps(mapsB);

      const rows = compareRows(mergedA, mergedB);
      const stats = computeStats(rows);
      renderResults(resultBox, rows, stats, subjectALabel, subjectBLabel);
      progressBox.textContent = `完成。交集用户数: ${rows.length}`;
    } catch (err) {
      if (err && err.message === 'aborted') {
        progressBox.textContent = '已取消。';
      } else {
        progressBox.textContent = `出错：${err && err.message ? err.message : err}`;
      }
    } finally {
      state.compareRunning = false;
      startBtn.disabled = false;
      cancelBtn.disabled = true;
      state.abortController = null;
    }
  }

  async function initComparePanel() {
    if (!isSubjectPage()) return;
    const subjectId = currentSubjectId();
    if (!subjectId) return;

    const panel = document.createElement('div');
    panel.id = 'bgm-cmp-panel';
    panel.innerHTML = `
      <h3>条目交集对比</h3>
      <div class="row">
        <input id="bgm-cmp-input" type="text" placeholder="输入对比条目 ID 或 URL">
      </div>
      <div class="row status-list" id="bgm-cmp-status">
        <span class="muted">加载观众范围中...</span>
      </div>
      <div class="row">
        <button id="bgm-cmp-start" class="primary">开始</button>
        <button id="bgm-cmp-cancel" disabled>取消</button>
      </div>
      <div class="row progress" id="bgm-cmp-progress">等待开始。</div>
      <div class="row" id="bgm-cmp-result"></div>
    `;
    document.body.appendChild(panel);

    const hidden = getSettingValue(COOKIE_KEYS.panelHidden, '0');
    panel.classList.toggle('hidden', String(hidden) === '1' || String(hidden) === 'true');

    const titleEl = panel.querySelector('h3');
    if (titleEl) {
      const header = document.createElement('div');
      header.className = 'header-row';
      titleEl.parentNode.insertBefore(header, titleEl);
      header.appendChild(titleEl);
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.id = 'bgm-cmp-close';
      closeBtn.title = '隐藏面板';
      closeBtn.textContent = '×';
      header.appendChild(closeBtn);
      closeBtn.addEventListener('click', () => {
        setSettingValue(COOKIE_KEYS.panelHidden, '1');
        panel.classList.add('hidden');
      });
    }

    const cancelBtn = panel.querySelector('#bgm-cmp-cancel');
    cancelBtn.addEventListener('click', () => {
      if (state.abortController) state.abortController.abort();
    });

    let statusOptions = [];
    try {
      const controller = new AbortController();
      statusOptions = await getStatusOptions(subjectId, controller);
    } catch (e) {
      statusOptions = CONFIG.statusFallback.map(item => ({
        key: item.key,
        label: item.label,
        href: `${location.origin}/subject/${subjectId}/collections?status=${item.key}`
      }));
    }

    const statusBox = panel.querySelector('#bgm-cmp-status');
    statusBox.innerHTML = statusOptions.map(opt => {
      const label = opt.label || opt.key;
      const isDefault = /看过|已看|看過|读过|聽過/.test(label) || opt.key === 'collect';
      return `<label><input type="checkbox" data-status="${opt.key}" ${isDefault ? 'checked' : ''}>${label}</label>`;
    }).join('');

    const startBtn = panel.querySelector('#bgm-cmp-start');
    startBtn.addEventListener('click', () => startCompare(panel, statusOptions));
  }

  function getLongCommentThreshold() {
    const raw = getSettingValue(COOKIE_KEYS.threshold, CONFIG.longCommentDefaultThreshold);
    const num = Number(raw);
    return Number.isNaN(num) ? CONFIG.longCommentDefaultThreshold : num;
  }

  function setLongCommentThreshold(value) {
    setSettingValue(COOKIE_KEYS.threshold, value);
  }

  function getLongCommentApplyAll() {
    const raw = getSettingValue(COOKIE_KEYS.applyAll, '1');
    const normalized = String(raw);
    if (normalized === 'all') return true;
    if (normalized === 'comments') return false;
    return normalized === '1' || normalized === 'true';
  }

  function setLongCommentApplyAll(value) {
    setSettingValue(COOKIE_KEYS.applyAll, value ? '1' : '0');
  }

  function getLongCommentPageLimit() {
    const raw = getSettingValue(COOKIE_KEYS.pageLimit, CONFIG.longCommentDefaultPages);
    const num = Number(raw);
    if (Number.isNaN(num) || num < 1) return CONFIG.longCommentDefaultPages;
    return Math.floor(num);
  }

  function setLongCommentPageLimit(value) {
    setSettingValue(COOKIE_KEYS.pageLimit, String(value));
  }

  function getCommentsPageNumber() {
    const params = new URLSearchParams(location.search);
    const raw = params.get('page') || '1';
    const num = Number(raw);
    if (Number.isNaN(num) || num < 1) return 1;
    return Math.floor(num);
  }

  function registerMenu() {
    GM_registerMenuCommand('切换交集面板显示', () => {
      const current = getSettingValue(COOKIE_KEYS.panelHidden, '0');
      const next = !(String(current) === '1' || String(current) === 'true');
      setSettingValue(COOKIE_KEYS.panelHidden, next ? '1' : '0');
      const panel = document.querySelector('#bgm-cmp-panel');
      if (panel) panel.classList.toggle('hidden', next);
    });
    GM_registerMenuCommand('设置长评阈值', () => {
      const current = getLongCommentThreshold();
      const input = prompt('输入长评阈值（字数）', String(current));
      if (!input) return;
      const value = Number(input);
      if (Number.isNaN(value) || value <= 0) return;
      setLongCommentThreshold(value);
      requestLongCommentApply();
    });
    GM_registerMenuCommand('设置吐槽置顶页数', () => {
      const current = getLongCommentPageLimit();
      const input = prompt('输入要扫描的吐槽页数（>=1）', String(current));
      if (!input) return;
      const value = Number(input);
      if (Number.isNaN(value) || value < 1) return;
      setLongCommentPageLimit(value);
      requestLongCommentApply();
    });
    GM_registerMenuCommand('切换长评全状态生效', () => {
      const current = getLongCommentApplyAll();
      setLongCommentApplyAll(!current);
      requestLongCommentApply();
    });
  }

  let ukagakaConfigReady = false;

  function addUkagakaPanelTab() {
    if (ukagakaConfigReady) return true;
    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (!pageWindow.chiiLib || !pageWindow.chiiLib.ukagaka || typeof pageWindow.chiiLib.ukagaka.addPanelTab !== 'function') {
      return false;
    }
    const api = pageWindow.chiiLib.ukagaka;
    const removeTab = typeof api.removePanelTab === 'function' ? api.removePanelTab.bind(api) : null;

    const applyPanelVisibility = (visible) => {
      setSettingValue(COOKIE_KEYS.panelHidden, visible ? '0' : '1');
      const panel = document.querySelector('#bgm-cmp-panel');
      if (panel) panel.classList.toggle('hidden', !visible);
    };

    const thresholdOptions = [
      { value: '80', label: '80 字' },
      { value: '120', label: '120 字' },
      { value: '200', label: '200 字' },
      { value: 'custom', label: '自定义' }
    ];
    const pageLimitOptions = [
      { value: '1', label: '仅当前页' },
      { value: '2', label: '前 2 页' },
      { value: '3', label: '前 3 页' },
      { value: '5', label: '前 5 页' },
      { value: '10', label: '前 10 页' },
      { value: 'custom', label: '自定义' }
    ];

    if (removeTab) removeTab('bgm_cmp_tools');

    api.addPanelTab({
      tab: 'bgm_cmp_tools',
      label: '交集&长评',
      type: 'options',
      config: [
        {
          title: '长评阈值',
          name: 'bgmLongCommentThreshold',
          type: 'radio',
          defaultValue: '120',
          getCurrentValue: function () {
            const value = String(getLongCommentThreshold());
            return thresholdOptions.some(opt => opt.value === value) ? value : 'custom';
          },
          onChange: function (value) {
            if (value === 'custom') {
              const current = String(getLongCommentThreshold());
              const input = prompt('输入长评阈值（字数）', current);
              if (!input) return;
              const num = Number(input);
              if (Number.isNaN(num) || num <= 0) return;
              setLongCommentThreshold(num);
              requestLongCommentApply();
              return;
            }
            setLongCommentThreshold(Number(value));
            requestLongCommentApply();
          },
          options: thresholdOptions
        },
        {
          title: '吐槽置顶页数',
          name: 'bgmLongCommentPageLimit',
          type: 'radio',
          defaultValue: '1',
          getCurrentValue: function () {
            const value = String(getLongCommentPageLimit());
            return pageLimitOptions.some(opt => opt.value === value) ? value : 'custom';
          },
          onChange: function (value) {
            if (value === 'custom') {
              const current = String(getLongCommentPageLimit());
              const input = prompt('输入要扫描的吐槽页数（>=1）', current);
              if (!input) return;
              const num = Number(input);
              if (Number.isNaN(num) || num < 1) return;
              setLongCommentPageLimit(num);
              requestLongCommentApply();
              return;
            }
            setLongCommentPageLimit(Number(value));
            requestLongCommentApply();
          },
          options: pageLimitOptions
        },
        {
          title: '长评排序范围',
          name: 'bgmLongCommentAllStatus',
          type: 'radio',
          defaultValue: 'all',
          getCurrentValue: function () {
            return getLongCommentApplyAll() ? 'all' : 'comments';
          },
          onChange: function (value) {
            setLongCommentApplyAll(value === 'all');
            requestLongCommentApply();
          },
          options: [
            { value: 'all', label: '全部状态页' },
            { value: 'comments', label: '仅吐槽页' }
          ]
        },
        {
          title: '交集面板显示',
          name: 'bgmCmpPanelVisible',
          type: 'radio',
          defaultValue: 'show',
          getCurrentValue: function () {
            const hidden = getSettingValue(COOKIE_KEYS.panelHidden, '0');
            return (String(hidden) === '1' || String(hidden) === 'true') ? 'hide' : 'show';
          },
          onChange: function (value) {
            applyPanelVisibility(value === 'show');
          },
          options: [
            { value: 'show', label: '显示' },
            { value: 'hide', label: '隐藏' }
          ]
        }
      ]
    });

    ukagakaConfigReady = true;
    return true;
  }

  function initUkagakaPanelConfig() {
    if (addUkagakaPanelTab()) return;
    const timer = setInterval(() => {
      if (addUkagakaPanelTab()) {
        clearInterval(timer);
      }
    }, 800);
  }

  function findCommentContainer(root = document) {
    const candidates = [
      '#comment_list',
      '.comment_list',
      '#comment_box',
      '.comment_box',
      '#subject_comment',
      '.comment'
    ];
    for (const selector of candidates) {
      const elements = Array.from(root.querySelectorAll(selector));
      for (const el of elements) {
        const items = findCommentItems(el);
        if (items.length) return el;
      }
    }
    return null;
  }

  function findCommentItems(container) {
    const selectors = [
      '.reply_item',
      '.comment_item',
      'li',
      'div.item'
    ];
    for (const selector of selectors) {
      const items = Array.from(container.querySelectorAll(selector))
        .filter(el => el.querySelector('a[href*="/user/"]') && el.getAttribute('data-bgm-extra-long') !== '1');
      if (items.length) return items;
    }
    return [];
  }

  function getCommentText(item) {
    const selectors = [
      '.reply_content',
      '.cmt_sub_content',
      '.text',
      '.message',
      '.comment_content',
      '.inner',
      'p'
    ];
    for (const selector of selectors) {
      const el = item.querySelector(selector);
      if (el && (el.innerText || el.textContent)) {
        return el.innerText || el.textContent;
      }
    }
    return item.innerText || item.textContent || '';
  }

  function normalizeTextLength(text) {
    return text.replace(/[\s>]+/g, '').length;
  }

  function getScrollAnchor(container) {
    const items = findCommentItems(container);
    for (const item of items) {
      const rect = item.getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) return item;
    }
    return items[0] || null;
  }

  function preserveScroll(container, action) {
    const atTop = window.scrollY === 0;
    const anchor = getScrollAnchor(container);
    const top = anchor ? anchor.getBoundingClientRect().top : null;
    action();
    if (!anchor || top == null) return;
    if (Date.now() < commentScrollActiveUntil) return;
    if (atTop) {
      window.scrollTo(0, 0);
      return;
    }
    const nextTop = anchor.getBoundingClientRect().top;
    const delta = nextTop - top;
    if (Math.abs(delta) > 1) window.scrollBy(0, delta);
  }

  function isUserScrolling() {
    return Date.now() < commentScrollActiveUntil;
  }

  function scheduleApplyAfterScroll() {
    if (commentScrollTimer) clearTimeout(commentScrollTimer);
    commentScrollTimer = setTimeout(() => {
      commentScrollTimer = null;
      if (commentPendingApply && !isUserScrolling()) {
        commentPendingApply = false;
        applyLongCommentPin();
      }
    }, 240);
  }

  function requestLongCommentApply() {
    if (isUserScrolling()) {
      commentPendingApply = true;
      scheduleApplyAfterScroll();
      return;
    }
    applyLongCommentPin();
  }

  function setupScrollGuard() {
    window.addEventListener('scroll', () => {
      commentScrollActiveUntil = Date.now() + 220;
      scheduleApplyAfterScroll();
    }, { passive: true });
  }

  function getCommentKey(item) {
    const id = item.getAttribute('id');
    if (id) return `id:${id}`;
    const dataId = item.getAttribute('data-id');
    if (dataId) return `data:${dataId}`;
    const anchor = item.querySelector('a[href*="#comment"], a[href*="/comment/"]');
    if (anchor && anchor.getAttribute('href')) return `href:${anchor.getAttribute('href')}`;
    const userLink = item.querySelector('a[href*="/user/"]');
    const user = userLink ? userLink.getAttribute('href') : '';
    const timeNode = item.querySelector('small');
    const timeText = timeNode ? timeNode.textContent : '';
    const textSnippet = getCommentText(item).slice(0, 32);
    return `fallback:${user}|${timeText}|${textSnippet}`;
  }

  function parseCommentEntries(container) {
    const items = findCommentItems(container);
    return items.map(item => ({
      key: getCommentKey(item),
      len: normalizeTextLength(getCommentText(item)),
      html: item.outerHTML
    }));
  }

  function createNodeFromHtml(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    return wrapper.firstElementChild;
  }

  async function fetchCommentEntries(subjectId, page) {
    const cacheKey = `${subjectId}:${page}`;
    if (commentPageCache.has(cacheKey)) return commentPageCache.get(cacheKey);
    if (commentPageInFlight.has(cacheKey)) return commentPageInFlight.get(cacheKey);
    const promise = (async () => {
      const url = `${location.origin}/subject/${subjectId}/comments?page=${page}`;
      const res = await fetchWithRetry(url, { credentials: 'include' }, CONFIG.maxRetries, CONFIG.retryBaseDelayMs);
      if (!res.ok) return [];
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const container = findCommentContainer(doc);
      if (!container) return [];
      return parseCommentEntries(container);
    })();
    commentPageInFlight.set(cacheKey, promise);
    const entries = await promise;
    commentPageInFlight.delete(cacheKey);
    commentPageCache.set(cacheKey, entries);
    return entries;
  }

  async function applyLongCommentPin() {
    const container = findCommentContainer();
    if (!container) return;

    if (!getLongCommentApplyAll() && isCommentsPage() === false) {
      return;
    }

    if (isUserScrolling()) {
      commentPendingApply = true;
      scheduleApplyAfterScroll();
      return;
    }
    if (commentApplying) return;
    commentApplying = true;
    const callToken = ++commentApplyToken;
    const threshold = getLongCommentThreshold();
    try {
      commentObserverMutedUntil = Date.now() + 800;
      preserveScroll(container, () => {
        container.querySelectorAll('[data-bgm-extra-long="1"]').forEach(el => el.remove());

        const items = findCommentItems(container);
        if (!items.length) return;

        const decorated = items.map((el, idx) => {
          const text = getCommentText(el);
          const len = normalizeTextLength(text);
          return { el, len, idx };
        });

        const long = decorated.filter(d => d.len >= threshold)
          .sort((a, b) => (b.len - a.len) || (a.idx - b.idx));
        const short = decorated.filter(d => d.len < threshold)
          .sort((a, b) => a.idx - b.idx);

        const ordered = long.concat(short);
        for (const { el } of ordered) {
          container.appendChild(el);
        }
      });

      if (!isCommentsPage()) return;
      const pageLimit = getLongCommentPageLimit();
      if (pageLimit <= 1) return;
      const subjectId = currentSubjectId();
      if (!subjectId) return;
      const currentPage = getCommentsPageNumber();
      const pages = [];
      for (let page = 1; page <= pageLimit; page += 1) {
        if (page === currentPage) continue;
        pages.push(page);
      }
      if (!pages.length) return;
      const extraEntries = [];
      for (const page of pages) {
        const entries = await fetchCommentEntries(subjectId, page);
        extraEntries.push(...entries);
      }
      if (callToken !== commentApplyToken) return;
      if (isUserScrolling()) {
        commentPendingApply = true;
        scheduleApplyAfterScroll();
        return;
      }
      const currentItems = findCommentItems(container);
      const currentKeys = new Set(currentItems.map(item => getCommentKey(item)));
      const longExtras = extraEntries
        .filter(entry => entry.len >= threshold && !currentKeys.has(entry.key))
        .sort((a, b) => b.len - a.len);
      if (!longExtras.length) return;
      commentObserverMutedUntil = Date.now() + 800;
      preserveScroll(container, () => {
        const fragment = document.createDocumentFragment();
        for (const entry of longExtras) {
          const node = createNodeFromHtml(entry.html);
          if (!node) continue;
          node.setAttribute('data-bgm-extra-long', '1');
          fragment.appendChild(node);
        }
        container.prepend(fragment);
      });
    } catch (err) {
      console.warn('[bgm-long-comment] fetch failed', err);
    } finally {
      commentApplying = false;
      if (commentPendingApply && !isUserScrolling()) {
        commentPendingApply = false;
        applyLongCommentPin();
      }
    }
  }

  function observeCommentContainer(container) {
    if (!container || commentContainerEl === container) return;
    if (commentListObserver) commentListObserver.disconnect();
    commentContainerEl = container;
    let timer = null;
    commentListObserver = new MutationObserver(() => {
      if (commentApplying || Date.now() < commentObserverMutedUntil) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        requestLongCommentApply();
        timer = null;
      }, 200);
    });
    commentListObserver.observe(container, { childList: true, subtree: true });
    requestLongCommentApply();
  }

  function setupCommentObserver() {
    observeCommentContainer(findCommentContainer());
    if (commentContainerObserver) return;
    commentContainerObserver = new MutationObserver(() => {
      observeCommentContainer(findCommentContainer());
    });
    commentContainerObserver.observe(document.body, { childList: true, subtree: true });
  }

  function initLongComment() {
    registerMenu();
    requestLongCommentApply();
    setupScrollGuard();
    setupCommentObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initComparePanel();
      initLongComment();
      initUkagakaPanelConfig();
    });
  } else {
    initComparePanel();
    initLongComment();
    initUkagakaPanelConfig();
  }
})();
