// ==UserScript==
// @name         BJTU 选课课组学分助手
// @namespace    https://aa.bjtu.edu.cn/
// @version      0.1.0
// @description  在选课界面显示课程对应课组，并实时计算各课组学分进度（含本学期课表的预计完成学分）
// @match        https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559806/BJTU%20%E9%80%89%E8%AF%BE%E8%AF%BE%E7%BB%84%E5%AD%A6%E5%88%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559806/BJTU%20%E9%80%89%E8%AF%BE%E8%AF%BE%E7%BB%84%E5%AD%A6%E5%88%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ORIGIN = 'https://aa.bjtu.edu.cn';
  const SELECTS_URL_PREFIX = `${ORIGIN}/course_selection/courseselecttask/selects/`;
  if (!location.href.startsWith(SELECTS_URL_PREFIX)) return;

  const VERSION = 1;
  const CACHE_KEY = `bjtu-course-group-helper:v${VERSION}`;
  const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

  const UI = {
    rootId: 'bjtu-course-group-helper-root',
    panelId: 'bjtu-course-group-helper-panel',
    toggleId: 'bjtu-course-group-helper-toggle',
  };

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function stripCreditsSuffix(text) {
    return String(text || '').replace(/【[^】]*】/g, '').trim();
  }

  function parseFloatSafe(text) {
    const n = Number.parseFloat(String(text || '').replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }

  function absUrl(href) {
    if (!href) return null;
    try {
      return new URL(href, ORIGIN).toString();
    } catch {
      return null;
    }
  }

  function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
  }

  async function fetchText(url) {
    const RETRY_STATUSES = new Set([502, 503, 504]);
    const MAX_RETRIES = 2;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) return await res.text();
      if (RETRY_STATUSES.has(res.status) && attempt < MAX_RETRIES) {
        await sleep(400 * (attempt + 1));
        continue;
      }
      throw new Error(`HTTP ${res.status} ${url}`);
    }
    throw new Error(`Fetch failed ${url}`);
  }

  async function fetchDoc(url) {
    const html = await fetchText(url);
    return new DOMParser().parseFromString(html, 'text/html');
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || data.version !== VERSION) return null;
      if (!data.savedAt || Date.now() - data.savedAt > CACHE_TTL_MS) return null;
      return data;
    } catch {
      return null;
    }
  }

  function writeCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, version: VERSION, savedAt: Date.now() }));
    } catch {
      // ignore
    }
  }

  function findTrainingInfoUrlFromPage() {
    const a = document.querySelector('a[href*="/school_census/schooltraininfo/stustudyview/"]');
    return absUrl(a?.getAttribute('href'));
  }

  function findScheduleUrl() {
    return `${ORIGIN}/course_selection/courseselect/stuschedule/`;
  }

  function parseGroupUrlsFromTrainingInfoDoc(doc) {
    const anchors = Array.from(doc.querySelectorAll('a[href*="stustudyview_group"]'));
    return uniq(anchors.map((a) => absUrl(a.getAttribute('href'))));
  }

  function parseStudyViewIdFromUrl(url) {
    const m = String(url || '').match(/\/stustudyview\/(\d+)\//);
    return m ? m[1] : null;
  }

  function parseGroupIdFromGroupUrl(url) {
    const m = String(url || '').match(/\/stustudyview_group\/\d+\/(\d+)\//);
    return m ? Number.parseInt(m[1], 10) : null;
  }

  function parseCourseCode(text) {
    const m = String(text || '').match(/\b[A-Z]\d{6}[A-Z]\b/);
    return m ? m[0] : null;
  }

  function isCourseCompleted(statusText) {
    const s = String(statusText || '').trim();
    if (!s) return false;
    return s.includes('已修') || s.includes('免修') || s.includes('通过');
  }

  function parseGroupPage(doc, groupUrl) {
    const text = doc.body?.textContent || '';
    const groupNameMatch = text.match(/课组信息：\s*([^\n\r]+)/);
    const requiredMatch = text.match(/要求学分：\s*([0-9]+(?:\.[0-9]+)?)/);
    const groupName = stripCreditsSuffix(groupNameMatch ? groupNameMatch[1] : '') || '未知课组';
    const requiredCredits = requiredMatch ? Number.parseFloat(requiredMatch[1]) : 0;

    const tables = Array.from(doc.querySelectorAll('table'));
    const courseTable = tables.find((t) => {
      const tText = t.textContent || '';
      return tText.includes('课程号') && tText.includes('课程名称') && tText.includes('学分') && tText.includes('状态');
    });

    const courseByCode = new Map();

    if (courseTable) {
      const rows = Array.from(courseTable.querySelectorAll('tr'));
      for (const tr of rows) {
        const tds = Array.from(tr.querySelectorAll('td'));
        if (tds.length < 4) continue;

        const code = tds[0]?.textContent?.trim();
        const name = tds[1]?.textContent?.trim();
        if (!code || code === '总计' || name === '总计') continue;

        const credit = parseFloatSafe(tds[2]?.textContent);
        const status = (tds[4] || tds[tds.length - 1])?.textContent?.trim() || '';
        const completed = isCourseCompleted(status);

        const prev = courseByCode.get(code);
        if (!prev) {
          courseByCode.set(code, { code, name, credit, status, completed });
        } else {
          courseByCode.set(code, {
            code,
            name: prev.name || name,
            credit: Math.max(prev.credit || 0, credit || 0),
            status: prev.status || status,
            completed: Boolean(prev.completed || completed),
          });
        }
      }
    }

    const courses = Array.from(courseByCode.values());
    const baseCompletedCredits = courses.reduce((sum, c) => (c.completed ? sum + (c.credit || 0) : sum), 0);

    return { groupUrl, groupName, requiredCredits, baseCompletedCredits, courses };
  }

  function parseScheduleCourseCodes(doc) {
    const text = doc.body?.textContent || '';
    const codes = new Set();
    const re = /\b[A-Z]\d{6}[A-Z]\b/g;
    for (const m of text.matchAll(re)) codes.add(m[0]);
    return Array.from(codes);
  }

  async function mapLimit(items, limit, fn) {
    const results = new Array(items.length);
    let idx = 0;
    const workers = new Array(Math.max(1, limit)).fill(null).map(async () => {
      while (idx < items.length) {
        const current = idx++;
        try {
          results[current] = await fn(items[current], current);
        } catch (err) {
          results[current] = { __error: String(err && err.message ? err.message : err), item: items[current] };
        }
      }
    });
    await Promise.all(workers);
    return results;
  }

  async function loadAllData({ forceRefresh } = { forceRefresh: false }) {
    if (!forceRefresh) {
      const cached = readCache();
      if (cached) return cached;
    }

    const trainingInfoUrl = findTrainingInfoUrlFromPage();
    if (!trainingInfoUrl) throw new Error('未找到“学业进度”链接，请确认已登录且在选课页面。');

    const scheduleUrl = findScheduleUrl();
    const trainingDoc = await fetchDoc(trainingInfoUrl);
    const groupUrls = parseGroupUrlsFromTrainingInfoDoc(trainingDoc);
    if (!groupUrls.length) throw new Error('未从学业进度页面解析到课组详情链接。');

    const studyViewId = parseStudyViewIdFromUrl(trainingInfoUrl);
    const linkedGroupIds = groupUrls.map(parseGroupIdFromGroupUrl).filter((n) => Number.isFinite(n));
    const minGroupId = linkedGroupIds.length ? Math.min(...linkedGroupIds) : null;
    const maxGroupId = linkedGroupIds.length ? Math.max(...linkedGroupIds) : null;

    const probeUrls = [];
    if (studyViewId && minGroupId && maxGroupId && maxGroupId >= minGroupId) {
      const linkedSet = new Set(linkedGroupIds);
      // In this system, some important groups (如“专业教育平台”) may not be linked in the table.
      // Probe ids within the observed range to discover them (e.g. 93101).
      for (let gid = minGroupId; gid <= maxGroupId; gid++) {
        if (linkedSet.has(gid)) continue;
        probeUrls.push(`${ORIGIN}/school_census/schooltraininfo/stustudyview_group/${studyViewId}/${gid}/`);
      }
    }

    const allGroupUrls = uniq(groupUrls.concat(probeUrls));

    const groupPages = await mapLimit(allGroupUrls, 3, async (url) => {
      const doc = await fetchDoc(url);
      return parseGroupPage(doc, url);
    });

    const groups = [];
    const courseMap = {};
    const courseGroups = {};

    for (const g of groupPages) {
      if (!g || g.__error) continue;
      const groupId = g.groupUrl.match(/stustudyview_group\/\d+\/(\d+)\//)?.[1] || g.groupUrl;
      const courseStatus = {};
      for (const c of g.courses) {
        if (!c?.code) continue;
        courseStatus[c.code] = { credit: c.credit, completed: c.completed, name: c.name };
        if (!courseGroups[c.code]) courseGroups[c.code] = [];
        if (!courseGroups[c.code].includes(groupId)) courseGroups[c.code].push(groupId);
      }
      const group = {
        id: groupId,
        url: g.groupUrl,
        name: g.groupName,
        required: g.requiredCredits,
        baseCompleted: g.baseCompletedCredits,
        afterThisTerm: g.baseCompletedCredits,
        inProgressCodes: [],
        courseStatus,
      };
      groups.push(group);

      // courseMap is used as the "display group" (first wins) for table column + selected-course listing.
      for (const c of g.courses) {
        if (!c?.code) continue;
        if (courseMap[c.code]) continue;
        courseMap[c.code] = {
          code: c.code,
          name: c.name,
          credit: c.credit,
          groupId: group.id,
          groupName: group.name,
          completed: c.completed,
        };
      }
    }

    const scheduleDoc = await fetchDoc(scheduleUrl);
    const scheduleCodes = parseScheduleCourseCodes(scheduleDoc);
    const groupById = Object.fromEntries(groups.map((g) => [g.id, g]));

    for (const code of scheduleCodes) {
      const groupIds = courseGroups[code] || [];
      for (const gid of groupIds) {
        const group = groupById[gid];
        if (!group) continue;
        const st = group.courseStatus?.[code];
        if (!st) continue;
        if (st.completed) continue;
        if (group.inProgressCodes.includes(code)) continue;
        group.inProgressCodes.push(code);
        group.afterThisTerm += st.credit || 0;
      }
    }

    const payload = {
      version: VERSION,
      savedAt: Date.now(),
      trainingInfoUrl,
      scheduleUrl,
      groupUrls: allGroupUrls,
      groups,
      courseMap,
      courseGroups,
      scheduleCodes,
    };

    writeCache(payload);
    return payload;
  }

  function getSelectionTables() {
    const tables = Array.from(document.querySelectorAll('table'));
    return tables.filter((t) => !t.classList.contains('hide') && t.querySelector('select.xkzy-select'));
  }

  function ensureGroupColumn(table) {
    const headerRow = table.querySelector(':scope > tbody > tr');
    if (!headerRow) return;
    const headers = Array.from(headerRow.querySelectorAll(':scope > th'));
    if (!headers.length) return;
    if (headers.some((th) => th.textContent?.trim() === '对应课组名称')) return;

    const insertAfterIdx = headers.findIndex((th) => th.textContent?.trim() === '课程属性');
    if (insertAfterIdx < 0) return;

    const groupTh = document.createElement('th');
    groupTh.textContent = '对应课组名称';
    groupTh.style.width = '180px';
    headers[insertAfterIdx].insertAdjacentElement('afterend', groupTh);

    const rows = Array.from(table.querySelectorAll(':scope > tbody > tr')).slice(1);
    for (const tr of rows) {
      const tds = Array.from(tr.querySelectorAll(':scope > td'));
      if (tds.length < 4) continue;
      const td = document.createElement('td');
      td.className = 'bjtu-course-group-cell';
      td.style.whiteSpace = 'nowrap';
      td.style.maxWidth = '240px';
      td.style.overflow = 'hidden';
      td.style.textOverflow = 'ellipsis';
      tds[3].insertAdjacentElement('afterend', td);
    }
  }

  function fillGroupColumn(table, data) {
    const rows = Array.from(table.querySelectorAll(':scope > tbody > tr')).slice(1);
    for (const tr of rows) {
      const tds = Array.from(tr.querySelectorAll(':scope > td'));
      if (tds.length < 5) continue;

      const courseText = tds[1]?.querySelector('a.task-detail-btn')?.textContent || tds[1]?.textContent || '';
      const code = parseCourseCode(courseText);
      const groupCell = tr.querySelector(':scope > td.bjtu-course-group-cell');
      if (!groupCell) continue;

      if (!code) {
        groupCell.textContent = '未知';
        groupCell.title = '';
        continue;
      }

      const info = data.courseMap?.[code];
      if (!info) {
        groupCell.textContent = '未知';
        groupCell.title = code;
        continue;
      }
      groupCell.textContent = info.groupName;
      groupCell.title = `${info.groupName} (${code})`;
    }
  }

  function injectStyles() {
    if (document.getElementById('bjtu-course-group-helper-style')) return;
    const style = document.createElement('style');
    style.id = 'bjtu-course-group-helper-style';
    style.textContent = `
      #${UI.rootId} { position: fixed; right: 14px; bottom: 14px; z-index: 999999; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,"PingFang SC","Microsoft Yahei",sans-serif; }
      #${UI.toggleId} { all: unset; cursor: pointer; background: #1f6feb; color: #fff; padding: 10px 12px; border-radius: 999px; box-shadow: 0 10px 30px rgba(0,0,0,.18); font-weight: 600; }
      #${UI.toggleId}:hover { filter: brightness(1.03); }
      #${UI.panelId} { margin-top: 10px; width: 360px; max-height: 65vh; overflow: auto; background: rgba(255,255,255,.98); border: 1px solid rgba(0,0,0,.12); border-radius: 14px; box-shadow: 0 18px 60px rgba(0,0,0,.22); }
      #${UI.panelId}[data-collapsed="1"] { display: none; }
      .bjtu-ch-header { display:flex; align-items:center; justify-content:space-between; gap:8px; padding: 10px 12px; border-bottom: 1px solid rgba(0,0,0,.08); position: sticky; top: 0; background: rgba(255,255,255,.98); }
      .bjtu-ch-title { font-weight: 700; font-size: 14px; }
      .bjtu-ch-actions { display:flex; gap:8px; align-items:center; }
      .bjtu-ch-btn { all: unset; cursor:pointer; padding: 6px 10px; border-radius: 10px; border: 1px solid rgba(0,0,0,.12); background:#fff; font-size: 12px; }
      .bjtu-ch-btn:hover { background: rgba(0,0,0,.03); }
      .bjtu-ch-status { font-size: 12px; color: rgba(0,0,0,.6); padding: 8px 12px 0; }
      .bjtu-ch-list { padding: 8px 8px 10px; display:flex; flex-direction:column; gap:8px; }
      .bjtu-ch-group { border: 1px solid rgba(0,0,0,.08); border-radius: 12px; padding: 8px 10px; background: rgba(255,255,255,.9); }
      .bjtu-ch-row { display:flex; justify-content:space-between; align-items:baseline; gap:10px; }
      .bjtu-ch-name { font-weight: 650; font-size: 13px; max-width: 240px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap; }
      .bjtu-ch-progress { font-variant-numeric: tabular-nums; font-size: 13px; }
      .bjtu-ch-progress.ok { color: #1a7f37; }
      .bjtu-ch-progress.bad { color: #cf222e; }
      .bjtu-ch-progress.zero { color: rgba(0,0,0,.55); }
      .bjtu-ch-selected { margin-top: 6px; padding-left: 0; list-style: none; display:flex; flex-direction:column; gap: 4px; }
      .bjtu-ch-selected li { font-size: 12px; color: rgba(0,0,0,.72); }
      .bjtu-ch-selected code { font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace; font-size: 11px; }
    `;
    document.head.appendChild(style);
  }

  function ensurePanel() {
    injectStyles();
    let root = document.getElementById(UI.rootId);
    if (!root) {
      root = document.createElement('div');
      root.id = UI.rootId;
      document.body.appendChild(root);
    }

    let toggle = document.getElementById(UI.toggleId);
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.id = UI.toggleId;
      toggle.textContent = '课组学分';
      root.appendChild(toggle);
    }

    let panel = document.getElementById(UI.panelId);
    if (!panel) {
      panel = document.createElement('div');
      panel.id = UI.panelId;
      root.appendChild(panel);

      panel.innerHTML = `
        <div class="bjtu-ch-header">
          <div class="bjtu-ch-title">课组学分进度</div>
          <div class="bjtu-ch-actions">
            <button class="bjtu-ch-btn" data-action="refresh">刷新</button>
            <button class="bjtu-ch-btn" data-action="clear">清缓存</button>
          </div>
        </div>
        <div class="bjtu-ch-status" data-role="status"></div>
        <div class="bjtu-ch-list" data-role="list"></div>
      `;

      panel.addEventListener('click', async (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('button[data-action]') : null;
        const action = btn?.getAttribute('data-action');
        if (!action) return;
        if (action === 'clear') {
          localStorage.removeItem(CACHE_KEY);
          setStatus('已清除缓存。');
          return;
        }
        if (action === 'refresh') {
          await refreshData(true);
        }
      });
    }

    const collapsed = localStorage.getItem(`${CACHE_KEY}:collapsed`) === '1';
    panel.dataset.collapsed = collapsed ? '1' : '0';
    toggle.onclick = () => {
      const next = panel.dataset.collapsed === '1' ? '0' : '1';
      panel.dataset.collapsed = next;
      localStorage.setItem(`${CACHE_KEY}:collapsed`, next);
    };

    return panel;
  }

  function setStatus(text) {
    const statusEl = document.querySelector(`#${UI.panelId} [data-role="status"]`);
    if (statusEl) statusEl.textContent = text || '';
  }

  function escapeHtml(s) {
    return String(s || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function formatCredits(n) {
    const v = Number(n || 0);
    return (Math.round(v * 10) / 10).toFixed(1);
  }

  function renderPanel(data, selection) {
    const panel = ensurePanel();
    const listEl = panel.querySelector('[data-role="list"]');
    if (!listEl) return;

    const groups = Array.isArray(data?.groups) ? data.groups.slice() : [];
    groups.sort((a, b) => (b.required || 0) - (a.required || 0) || String(a.name).localeCompare(String(b.name), 'zh'));

    listEl.innerHTML = '';

    const selectedByGroup = selection.selectedByGroup;
    const selectedCreditByGroup = selection.selectedCreditByGroup;

    for (const g of groups) {
      const required = Number(g.required || 0);
      const base = Number(g.afterThisTerm || 0);
      const added = Number(selectedCreditByGroup[g.id] || 0);
      const current = base + added;

      const progressClass = required === 0 ? 'zero' : current + 1e-9 >= required ? 'ok' : 'bad';

      const groupDiv = document.createElement('div');
      groupDiv.className = 'bjtu-ch-group';
      groupDiv.innerHTML = `
        <div class="bjtu-ch-row">
          <div class="bjtu-ch-name" title="${escapeHtml(g.name)}">${escapeHtml(g.name)}</div>
          <div class="bjtu-ch-progress ${progressClass}">${formatCredits(current)}/${formatCredits(required)}</div>
        </div>
      `;

      const selected = selectedByGroup[g.id] || [];
      if (selected.length) {
        const ul = document.createElement('ul');
        ul.className = 'bjtu-ch-selected';
        for (const item of selected) {
          const li = document.createElement('li');
          li.innerHTML = `+${formatCredits(item.credit)} <code>${escapeHtml(item.code)}</code> ${escapeHtml(item.title)}`;
          ul.appendChild(li);
        }
        groupDiv.appendChild(ul);
      }

      listEl.appendChild(groupDiv);
    }
  }

  function collectSelection(data) {
    const selectedCodes = new Set();
    const selectedByGroup = {};
    const selectedCreditByGroup = {};

    const tables = getSelectionTables();
    for (const table of tables) {
      const rows = Array.from(table.querySelectorAll(':scope > tbody > tr')).slice(1);
      for (const tr of rows) {
        const tds = Array.from(tr.querySelectorAll(':scope > td'));
        if (tds.length < 6) continue;

        const selects = Array.from(tr.querySelectorAll('select.xkzy-select'));
        const picked = selects.some((s) => String(s.value || '').trim() !== '');
        if (!picked) continue;

        const anchorText = tds[1]?.querySelector('a.task-detail-btn')?.textContent || '';
        const courseText = anchorText || tds[1]?.textContent || '';
        const code = parseCourseCode(courseText);
        if (!code) continue;
        if (selectedCodes.has(code)) continue;
        selectedCodes.add(code);

        const info = data.courseMap?.[code];
        const credit = info?.credit ?? parseFloatSafe(tds[2]?.textContent);
        const displayGroupId = info?.groupId || '__unknown__';
        const title = String(anchorText || courseText).replace(/\s+/g, ' ').trim();

        const memberGroupIdsRaw = (data.courseGroups && data.courseGroups[code]) || [];
        const memberGroupIds = memberGroupIdsRaw.length
          ? memberGroupIdsRaw
          : displayGroupId === '__unknown__'
            ? ['__unknown__']
            : [displayGroupId];

        if (!selectedByGroup[displayGroupId]) selectedByGroup[displayGroupId] = [];
        selectedByGroup[displayGroupId].push({ code, title, credit });
        for (const gid of memberGroupIds) {
          selectedCreditByGroup[gid] = (selectedCreditByGroup[gid] || 0) + credit;
        }
      }
    }

    if (selectedByGroup.__unknown__) {
      if (!data.groups.some((g) => g.id === '__unknown__')) {
        data.groups = data.groups.concat([
          { id: '__unknown__', name: '未知课组', required: 0, baseCompleted: 0, afterThisTerm: 0, inProgressCodes: [] },
        ]);
      }
    }

    for (const gid of Object.keys(selectedByGroup)) {
      selectedByGroup[gid].sort((a, b) => String(a.code).localeCompare(String(b.code)));
    }

    return { selectedCodes, selectedByGroup, selectedCreditByGroup };
  }

  let currentData = null;
  let refreshInFlight = null;
  let applyQueued = false;
  let lastSelectionSig = '';

  function selectionSignature(selection) {
    return Array.from(selection.selectedCodes).sort().join(',');
  }

  function scheduleApply() {
    if (applyQueued) return;
    applyQueued = true;
    requestAnimationFrame(() => {
      applyQueued = false;
      applyEnhancements();
    });
  }

  async function refreshData(forceRefresh) {
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
      try {
        setStatus(forceRefresh ? '正在刷新课组数据…' : '正在加载课组数据…');
        currentData = await loadAllData({ forceRefresh });
        setStatus(`课组数据已就绪（${new Date(currentData.savedAt).toLocaleString()}）`);
        scheduleApply();
      } catch (err) {
        setStatus(`加载失败：${String(err && err.message ? err.message : err)}`);
        currentData = { groups: [], courseMap: {} };
      } finally {
        refreshInFlight = null;
      }
    })();

    return refreshInFlight;
  }

  function applyEnhancements() {
    if (!currentData) return;
    const tables = getSelectionTables();
    for (const table of tables) {
      ensureGroupColumn(table);
      fillGroupColumn(table, currentData);
    }
    render();
  }

  function render() {
    if (!currentData) return;
    const selection = collectSelection(currentData);
    const sig = selectionSignature(selection);
    if (sig !== lastSelectionSig) lastSelectionSig = sig;
    renderPanel(currentData, selection);
  }

  function startObservers() {
    document.addEventListener('change', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLSelectElement)) return;
      if (!t.classList.contains('xkzy-select')) return;
      scheduleApply();
    });

    const mo = new MutationObserver(() => {
      if (!currentData) return;
      scheduleApply();
    });
    mo.observe(document.body, { subtree: true, childList: true });
  }

  async function main() {
    ensurePanel();
    setStatus('初始化…');
    startObservers();
    await refreshData(false);

    // For debugging / e2e
    window.__BJTU_COURSE_GROUP_HELPER__ = {
      refresh: () => refreshData(true),
      getData: () => currentData,
      render,
    };
  }

  sleep(50).then(main);
})();
