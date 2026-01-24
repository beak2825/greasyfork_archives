// ==UserScript==
// @name         Jira测试报告生成器 • v2026-01-23
// @namespace    http://tampermonkey.net/
// @version      2026-01-23
// @description  一键生成 Test Execution 报告；详情页/分栏页双按钮（操作栏+标题旁）+悬浮兜底；Xray 报表列表行按钮；支持按修复版本加载并勾选其他测试执行合并生成报告（各自报障人/bug 链接独立）；报告内展示当前统计报障人；候选报障人勾选后自动重算；已执行统计支持含阻塞/执行中开关；完整URL展示；复制即关；多通道触发+快速自旋+心跳；千分位解析；标题含拒绝计入拒绝数；统一按钮样式。使用“初版”REST端点：/rest/dashboards/{version}/{pageId}/gadget/{gadgetId}/prefs；筛选器ID通过 ManageFilters.jspa 分页解析；gadget 串行更新+退避重试，JSON 失败回退表单。
// @match        https://jira.cjdropshipping.cn/browse/*
// @match        https://jira.cjdropshipping.cn/secure/XrayReport*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563733/Jira%E6%B5%8B%E8%AF%95%E6%8A%A5%E5%91%8A%E7%94%9F%E6%88%90%E5%99%A8%20%E2%80%A2%20v2026-01-23.user.js
// @updateURL https://update.greasyfork.org/scripts/563733/Jira%E6%B5%8B%E8%AF%95%E6%8A%A5%E5%91%8A%E7%94%9F%E6%88%90%E5%99%A8%20%E2%80%A2%20v2026-01-23.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ================== Utils ================== */
  const U = {
    txt: (el) => (el ? (el.textContent || '').trim() : ''),
    qs: (s, r = document) => r.querySelector(s),
    qsa: (s, r = document) => Array.from(r.querySelectorAll(s)),
    debounce(fn, wait = 120) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; },
    toIntSafe(s) { const x = (s || '').toString().replace(/[^\d]/g, ''); return x ? parseInt(x, 10) : 0; },
    pct(n) { return Math.round(n * 10000) / 100; },
    log: (...a) => console.debug('[TM-Report]', ...a),
    insertAfter(node, ref) {
      if (!ref || !ref.parentNode) return false;
      if (ref.nextSibling) ref.parentNode.insertBefore(node, ref.nextSibling);
      else ref.parentNode.appendChild(node);
      return true;
    },
    toast(message, isError = false) {
      if (!message) return;
      const tip = document.createElement('div');
      tip.textContent = message;
      Object.assign(tip.style, {
        position: 'fixed',
        left: '50%',
        bottom: '36px',
        transform: 'translateX(-50%)',
        background: isError ? '#b91c1c' : '#15803d',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '999px',
        fontSize: '13px',
        zIndex: '10001',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        pointerEvents: 'none',
      });
      document.body.appendChild(tip);
      setTimeout(() => tip.remove(), 1500);
    },
  };
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const backoffDelay = (n) => {
    const base = Math.min(1500, 200 * Math.pow(2, n - 1));
    const jitter = Math.floor(Math.random() * 120);
    return base + jitter;
  };

  /* ================== Theme & Buttons ================== */
  function injectStyles() {
    if (document.getElementById('tm-style')) return;
    const style = document.createElement('style');
    style.id = 'tm-style';
    style.textContent = `
:root{
  --tm-primary:#2563eb;
  --tm-primary-hover:#1d4ed8;
  --tm-fg:#1f2328;
  --tm-border:rgba(0,0,0,0.15);
  --tm-ghost-bg:transparent;
  --tm-ghost-hover:rgba(0,0,0,0.06);
}
@media (prefers-color-scheme: dark){
  :root{
    --tm-fg:#e2e8f0;
    --tm-border:rgba(255,255,255,0.2);
    --tm-ghost-hover:rgba(255,255,255,0.08);
  }
}
.tm-btn{
  display:inline-flex; align-items:center; justify-content:center;
  gap:6px; cursor:pointer; user-select:none; white-space:nowrap;
  border:1px solid var(--tm-border); border-radius:10px;
  background: var(--tm-ghost-bg); color: var(--tm-fg);
  transition: filter .12s ease, background-color .12s ease, border-color .12s ease;
}
.tm-btn:hover{ filter:brightness(0.95); }
.tm-btn:disabled{ opacity:.6; cursor:not-allowed; filter:none; }
.tm-btn--sm{ padding:2px 8px;  font-size:12px; line-height:18px; border-radius:8px; }
.tm-btn--md{ padding:6px 12px; font-size:14px; line-height:22px; border-radius:10px; }
.tm-btn--lg{ padding:8px 14px; font-size:15px; line-height:24px; border-radius:12px; }
.tm-btn--primary{
  background:var(--tm-primary); color:#fff; border-color:var(--tm-primary-hover);
}
.tm-btn--ghost{
  background:transparent; color:var(--tm-primary); border-color:var(--tm-border);
}
`;
    document.head.appendChild(style);
  }
  function makeBtn(text, { variant = 'primary', size = 'md', id } = {}) {
    const b = document.createElement('button');
    b.textContent = text;
    b.className = `tm-btn tm-btn--${variant} tm-btn--${size}`;
    if (id) b.id = id;
    return b;
  }

  /* ================== Selectors ================== */
  const SEL = {
    issueSummary: '#summary-val, h1#summary-val, h1[data-test-id="issue.views.issue-base.foundation.summary.heading"]',
    opsBar:
      '.command-bar, #opsbar-operations, #opsbar-operations_more,' +
      '[data-test-id="issue.issue-view.views.issue-base.foundation.quick-add.quick-add"], ' +
      '[data-test-id="issue.opsbar"]',
    typeVal: '#type-val',
    progressBar: '#exec-tests-progressbar',
    fixVer: '#fixVersions-field a',
    reporter: '#reporter-val',
    splitPaneRight: '#issue-content, [data-test-id="issue-view"]',
    reportTable: '#test-execution-report-table',
  };
  const IDS = {
    modal: 'tm-test-report-modal',
    btnToolbar: 'tm-btn-toolbar',
    btnDashboard: 'tm-btn-dashboard',
    btnTitle: 'tm-btn-title',
    toolbarWrap: 'tm-toolbar-wrap',
    btnFloat: 'tm-btn-float',
  };
  const CLS = { btnRow: 'tm-row-report-btn' };

  /* =============== Page Detection =============== */
  const isTestExecutionPage = () => {
    if (U.qs('#exec-tests-progressbar') || (U.qs(SEL.splitPaneRight) && U.qs('#exec-tests-progressbar', U.qs(SEL.splitPaneRight)))) {
      return true;
    }
    const typeVal = U.qs(SEL.typeVal) || (U.qs(SEL.splitPaneRight) && U.qs(SEL.typeVal, U.qs(SEL.splitPaneRight)));
    const label = U.txt(typeVal);
    const img = typeVal && typeVal.querySelector('img');
    return !!typeVal && ((img && /test[-_ ]?execution/i.test(img.src || '')) || /Test\s*Execution/i.test(label));
  };
  const isXrayReportListPage = () =>
    /\/secure\/XrayReport/.test(location.href) &&
    /selectedReportKey=xray-report-testexecution/.test(location.href);

  /* ================== Data & Metrics ================== */
  function extractTestCounts() {
    const root = U.qs(SEL.progressBar) || (U.qs(SEL.splitPaneRight) && U.qs(SEL.progressBar, U.qs(SEL.splitPaneRight)));
    if (!root) return null;
    const q = (s) => root.querySelector(s);
    const pass = U.toIntSafe(U.txt(q('a[href*="PASS"] .testexec-status-count')));
    const fail = U.toIntSafe(U.txt(q('a[href*="FAIL"] .testexec-status-count')));
    const aborted = U.toIntSafe(U.txt(q('a[href*="ABORTED"] .testexec-status-count')));
    const executing = U.toIntSafe(U.txt(q('a[href*="EXECUTING"] .testexec-status-count')));
    let total = 0;
    const totalEl = q('h6');
    if (totalEl) {
      const m = totalEl.textContent.match(/Total\s*Tests[:：]?\s*([\d\.,\s\u202F\u00A0]+)/i);
      if (m && m[1]) total = U.toIntSafe(m[1]);
    }
    if (!total) total = pass + fail + aborted + executing;
    return { pass, fail, aborted, executing, total };
  }
  function buildCountsFromExecutionItem(item) {
    const byStatus = item?.testCountByStatus?.countByStatus || {};
    const pass = U.toIntSafe(byStatus.PASS);
    const fail = U.toIntSafe(byStatus.FAIL);
    const aborted = U.toIntSafe(byStatus.ABORTED);
    const executing = U.toIntSafe(byStatus.EXECUTING);
    const total = U.toIntSafe(
      item?.testCountByStatus?.totalCount
      || item?.totalTests
      || item?.testCountByStatus?.finalCount
      || (pass + fail + aborted + executing)
    );
    return { pass, fail, aborted, executing, total };
  }
  function getCurrentIssueKey() {
    const m = location.pathname.match(/\/browse\/([A-Z][A-Z0-9_]+-\d+)/i);
    return m ? m[1] : '';
  }
  const extractTitle = () => U.txt(U.qs(SEL.issueSummary) || (U.qs(SEL.splitPaneRight) && U.qs(SEL.issueSummary, U.qs(SEL.splitPaneRight))) || '');
  const extractFixVersion = () => U.txt(U.qs(SEL.fixVer) || (U.qs(SEL.splitPaneRight) && U.qs(SEL.fixVer, U.qs(SEL.splitPaneRight))) || '');

  function extractReporter() {
    const box = U.qs(SEL.reporter) || (U.qs(SEL.splitPaneRight) && U.qs(SEL.reporter, U.qs(SEL.splitPaneRight)));
    if (!box) return '';
    const el = box.querySelector('.user-hover, [data-username], a[href*="/people/"], a[href*="/jira/people/"]') || box;
    for (const a of ['data-username', 'data-user', 'data-user-hover', 'aria-label', 'rel']) {
      const v = el.getAttribute && el.getAttribute(a);
      if (v && v.trim()) return v.trim();
    }
    return U.txt(el).replace(/\s*\(.*?\)\s*$/, '');
  }

  function extractRoundInfo(title) {
    const map = { '零':0,'〇':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10 };
    const cn2i = (s) => {
      if (s === '十') return 10;
      if (s.length === 2 && s[0] === '十') return 10 + (map[s[1]] || 0);
      if (s.length === 2 && s[1] === '十') return (map[s[0]] || 0) * 10;
      if (s.length === 1 && s in map) return map[s];
      return 1;
    };
    const m1 = title.match(/第?\s*([一二三四五六七八九十两〇零]{1,3})\s*轮/);
    if (m1 && m1[1]) return `${cn2i(m1[1])}轮`;
    const m2 = title.match(/第?\s*([0-9]+)\s*轮/);
    if (m2 && m2[1]) return `${m2[1]}轮`;
    return '1轮';
  }

  const ROUND_CN = ['零','一','二','三','四','五','六','七','八','九','十'];
  const ROUND_CN_TO_NUM = { '零':0, '〇':0, '一':1, '二':2, '两':2, '三':3, '四':4, '五':5, '六':6, '七':7, '八':8, '九':9, '十':10 };
  function deriveRoundVariants(roundInfo, title = '') {
    const variants = new Set();
    const cleaned = (roundInfo || '').trim();
    if (cleaned) variants.add(cleaned);

    const numMatch = cleaned.match(/(\d+)/);
    if (numMatch) {
      const num = parseInt(numMatch[1], 10);
      if (Number.isFinite(num)) {
        variants.add(`${num}轮`);
        if (num >= 0 && num < ROUND_CN.length) {
          const cn = ROUND_CN[num];
          variants.add(`${cn}轮`);
          variants.add(`${cn}轮测试`);
          if (num === 2) {
            variants.add('两轮');
            variants.add('两轮测试');
          }
        }
      }
    }
    const cnMatch = cleaned.match(/([一二三四五六七八九十两〇零]+)/);
    if (cnMatch) {
      variants.add(`${cnMatch[1]}轮`);
      variants.add(`${cnMatch[1]}轮测试`);
    }
    if (title) {
      const titleCn = title.match(/([一二三四五六七八九十两〇零]+)轮测试/);
      if (titleCn && titleCn[1]) variants.add(`${titleCn[1]}轮测试`);
      const titleNum = title.match(/([\d]+)轮测试/);
      if (titleNum && titleNum[1]) variants.add(`${titleNum[1]}轮测试`);
      if (title.includes('两轮测试')) variants.add('两轮测试');
    }
    return [...variants].filter(Boolean);
  }

  function chineseRoundToNumber(str) {
    if (!str) return NaN;
    if (str === '十') return 10;
    if (str.length === 2 && str[0] === '十') return 10 + (ROUND_CN_TO_NUM[str[1]] || 0);
    if (str.length === 2 && str[1] === '十') return (ROUND_CN_TO_NUM[str[0]] || 0) * 10;
    if (str.length === 3 && str[1] === '十') {
      const high = ROUND_CN_TO_NUM[str[0]] || 0;
      const low = ROUND_CN_TO_NUM[str[2]] || 0;
      return high * 10 + low;
    }
    let total = 0;
    for (const ch of str) {
      const val = ROUND_CN_TO_NUM[ch];
      if (val == null) return NaN;
      total = total * 10 + val;
    }
    return total;
  }

  function normalizeRoundValue(roundInfo, title = '') {
    const variants = deriveRoundVariants(roundInfo, title);
    const numeric = variants.find((v) => /^\d+\s*轮$/.test(v));
    if (numeric) return `${parseInt(numeric, 10)}轮`;
    const cn = variants.find((v) => /^[一二三四五六七八九十两〇零]+\s*轮$/.test(v));
    if (cn) {
      const str = cn.replace(/轮$/, '');
      const num = chineseRoundToNumber(str);
      if (Number.isFinite(num) && num > 0) return `${num}轮`;
    }
    let fallback = (roundInfo || '').trim().replace(/轮测试$/g, '轮').replace(/第/g, '');
    const fbNum = fallback.match(/([0-9]+)\s*轮/);
    if (fbNum) return `${parseInt(fbNum[1], 10)}轮`;
    return '';
  }

  function getXsrfToken() {
    const match = document.cookie.match(/(?:^|;\s*)atlassian\.xsrf\.token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  /* ========== 已执行统计开关（默认不含阻塞/执行中） ========== */
  const EXEC_METRIC_STORAGE_KEY = 'tm_exec_metric_include_blocked';

  const EXEC_METRIC_CONFIG = {
    includeAbortedInExecuted: false,
    includeExecutingInExecuted: false,
  };

  function loadExecMetricConfig() {
    try {
      const v = localStorage.getItem(EXEC_METRIC_STORAGE_KEY);
      const on = v === '1';
      EXEC_METRIC_CONFIG.includeAbortedInExecuted = on;
      EXEC_METRIC_CONFIG.includeExecutingInExecuted = on;
    } catch (_) {
      EXEC_METRIC_CONFIG.includeAbortedInExecuted = false;
      EXEC_METRIC_CONFIG.includeExecutingInExecuted = false;
    }
  }

  function getExecMetricToggleLabel() {
    const on = EXEC_METRIC_CONFIG.includeAbortedInExecuted || EXEC_METRIC_CONFIG.includeExecutingInExecuted;
    return on ? '已执行：含阻塞/执行中' : '已执行：仅PASS/FAIL';
  }

  function toggleExecMetricConfig() {
    const on = !EXEC_METRIC_CONFIG.includeAbortedInExecuted;
    EXEC_METRIC_CONFIG.includeAbortedInExecuted = on;
    EXEC_METRIC_CONFIG.includeExecutingInExecuted = on;
    try {
      localStorage.setItem(EXEC_METRIC_STORAGE_KEY, on ? '1' : '0');
    } catch (_) {}
    U.toast(on ? '已执行/进度将包含阻塞和执行中' : '已执行/进度不包含阻塞和执行中');
  }

  function computeMetrics(c) {
    let executed = c.pass + c.fail;
    if (EXEC_METRIC_CONFIG.includeAbortedInExecuted) executed += c.aborted;
    if (EXEC_METRIC_CONFIG.includeExecutingInExecuted) executed += c.executing;
    const progress = c.total > 0 ? U.pct(executed / c.total) : 0;
    const successRate = executed > 0 ? U.pct(c.pass / executed) : 0;
    return { executed, progress, successRate };
  }

  /* ================== JQL & Issues ================== */
  function getLoggedInUsername() {
    try {
      const header = document.querySelector('#header-details-user-fullname') ||
                     document.querySelector('[data-username].aui-dropdown2-trigger') ||
                     document.querySelector('a.user-hover') ||
                     document.querySelector('#user-options a[data-username]');
      if (header) {
        const cand = (header.getAttribute && (
          header.getAttribute('data-username') ||
          header.getAttribute('data-displayname') ||
          header.getAttribute('data-user') ||
          header.getAttribute('aria-label')
        )) || (header.dataset && header.dataset.username);
        if (cand && cand.trim()) return cand.trim();
        const text = (header.textContent || '').trim();
        if (text) return text;
      }
      const userAnchor = document.querySelector('#user-options a[data-username], #header-details-user-fullname[data-username]');
      if (userAnchor) {
        const v = userAnchor.getAttribute('data-username') || userAnchor.getAttribute('data-displayname') || (userAnchor.dataset && userAnchor.dataset.username);
        if (v && v.trim()) return v.trim();
      }
    } catch (e) {
      console.debug('[TM-Report] getLoggedInUsername fail', e);
    }
    return '';
  }
  const FALLBACK_REPORTER = '生姜';
  // 候选报障人（用于快速勾选），可自行维护
  const REPORTER_CANDIDATES = ['海绵','泡泡','生姜','双辞','秀妍','甜粥','子恒'];

  const PORTAL_CONFIG = {
    ownerPrefix: '生姜-',
    pageId: '10923',
    returnUrl: '/secure/Dashboard.jspa',
    favourite: 'true',
    groupShare: ['jira-software-users', '测试'],
    projectShare: '10000',
    roleShare: '',
    shareValues: [
      { type: 'group', param1: 'jira-software-users', rights: { value: 1 } },
      { type: 'group', param1: '测试', rights: { value: 1 } },
    ],
    submitLabel: '更新',
  };
  let isConfiguringDashboard = false;
  let lastSyncedPortalName = '';
  let lastSyncedGadgetFilterKey = '';

  const DASHBOARD_CONFIG = {
    boardId: '10923',
    gadgets: [
      {
        id: '11387',
        prefs: {
          up_isConfigured: true,
          up_xstattype: 'priorities',
          up_ystattype: 'allFixfor',
          up_sortBy: 'natural',
          up_sortDirection: 'desc',
          up_numberToShow: '5',
          up_refresh: 'false',
          up_more: 'false',
        },
      },
      {
        id: '11384',
        prefs: {
          up_isConfigured: true,
          up_xstattype: 'assignees',
          up_ystattype: 'reporter',
          up_sortBy: 'natural',
          up_sortDirection: 'asc',
          up_numberToShow: '5',
          up_refresh: 'false',
          up_more: 'false',
        },
      },
      {
        id: '11386',
        prefs: {
          up_isConfigured: true,
          up_xstattype: 'statuses',
          up_ystattype: 'assignees',
          up_sortBy: 'natural',
          up_sortDirection: 'desc',
          up_numberToShow: '5',
          up_refresh: 'false',
          up_more: 'false',
        },
      },
      {
        id: '11385',
        prefs: {
          up_isConfigured: true,
          up_xstattype: 'statuses',
          up_ystattype: 'priorities',
          up_sortBy: 'natural',
          up_sortDirection: 'asc',
          up_numberToShow: '5',
          up_refresh: 'false',
          up_more: 'false',
        },
      },
    ],
  };

  function pushReporterName(set, raw) {
    if (raw == null) return;
    if (Array.isArray(raw)) { raw.forEach((item) => pushReporterName(set, item)); return; }
    let text = typeof raw === 'string' ? raw : String(raw || '');
    text = text.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/["'“”]/g, '').trim();
    if (!text) return;
    const parts = text.split(/[,，、；;]+/);
    if (!parts.length) { set.add(text); return; }
    parts.forEach((part) => { const name = part.trim(); if (name) set.add(name); });
  }
  function collectAllReporterNames(primaryReporter, { includeDom = true } = {}) {
    const set = new Set();
    pushReporterName(set, primaryReporter);
    if (includeDom) {
      const issueReporter = extractReporter();
      pushReporterName(set, issueReporter);
      const table = U.qs(SEL.reportTable) || (U.qs(SEL.splitPaneRight) && U.qs(SEL.reportTable, U.qs(SEL.splitPaneRight)));
      if (table) {
        const nodes = table.querySelectorAll('.user-hover, [data-username], [data-displayname], [data-user], [data-fullname], [data-person]');
        nodes.forEach((node) => {
          if (!node || !node.getAttribute) return;
          for (const attr of ['data-username', 'data-displayname', 'data-user', 'data-fullname', 'data-person', 'aria-label', 'title']) {
            const v = node.getAttribute(attr);
            if (v) pushReporterName(set, v);
          }
          if (node.textContent) pushReporterName(set, node.textContent);
        });
      }
    }
    const logged = getLoggedInUsername();
    pushReporterName(set, logged);
    if (!set.size) pushReporterName(set, FALLBACK_REPORTER);
    return [...set];
  }

  function getCandidateReporters() {
    const set = new Set();
    pushReporterName(set, REPORTER_CANDIDATES);
    return [...set];
  }

  function createCandidatePicker(candidates, { onChange, compact = false, selected = [] } = {}) {
    const set = new Set();
    pushReporterName(set, candidates);
    const names = [...set].filter(Boolean);
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      flexWrap: compact ? 'nowrap' : 'wrap',
      maxWidth: compact ? '260px' : 'none',
      overflowX: compact ? 'auto' : 'visible',
      padding: compact ? '0 2px' : '0',
    });

    if (!names.length) {
      return { wrap, getSelected: () => [], setDisabled: () => {} };
    }

    const label = document.createElement('span');
    label.textContent = '候选：';
    Object.assign(label.style, {
      fontSize: '12px',
      color: '#64748b',
      whiteSpace: 'nowrap',
      flex: '0 0 auto',
    });
    wrap.appendChild(label);

    const selectedSet = new Set();
    pushReporterName(selectedSet, selected);
    const buttons = [];
    const setActive = (btn, active) => {
      btn.classList.toggle('tm-btn--primary', active);
      btn.classList.toggle('tm-btn--ghost', !active);
    };
    names.forEach((name) => {
      const btn = makeBtn(name, { variant: 'ghost', size: 'sm' });
      Object.assign(btn.style, { flex: '0 0 auto' });
      setActive(btn, selectedSet.has(name));
      btn.onclick = () => {
        if (selectedSet.has(name)) selectedSet.delete(name);
        else selectedSet.add(name);
        setActive(btn, selectedSet.has(name));
        if (typeof onChange === 'function') onChange([...selectedSet]);
      };
      buttons.push(btn);
      wrap.appendChild(btn);
    });

    return {
      wrap,
      getSelected: () => [...selectedSet],
      setDisabled: (disabled) => { buttons.forEach((btn) => { btn.disabled = disabled; }); },
    };
  }

  function buildReporterClause(reporter) {
    const set = new Set();
    pushReporterName(set, reporter);
    const logged = getLoggedInUsername();
    if (logged) pushReporterName(set, logged);
    else pushReporterName(set, FALLBACK_REPORTER);
    const arr = [...set].filter(Boolean);
    if (!arr.length) return '';
    const quoted = arr.map(n => `"${String(n).replace(/"/g, '\\"')}"`).join(', ');
    return ` AND reporter in (${quoted})`;
  }
  function buildRoundClause(roundInfo, title = '') {
    const normalized = normalizeRoundValue(roundInfo, title);
    if (!normalized) return '';
    return ` AND 进度节点 = "${normalized.replace(/"/g, '\\"')}"`;
  }
  const buildJql = (fixVersion, roundInfo, reporter, title = '') => {
    const rep = buildReporterClause(reporter);
    const round = buildRoundClause(roundInfo, title);
    return `project = CJ AND issuetype = 缺陷 AND fixVersion = "${fixVersion}"${round}${rep} ORDER BY created DESC`;
  };
  const bugUrl = (fixVersion, roundInfo, reporter, title) =>
    'https://jira.cjdropshipping.cn/issues/?filter=-4&jql=' + encodeURIComponent(buildJql(fixVersion, roundInfo, reporter, title));

  const TEST_EXECUTION_CACHE = {
    listByFixVersion: new Map(),
    issueByKey: new Map(),
  };
  async function fetchTestExecutionsByFixVersion(fixVersion, { pageSize = 20, maxPages = 5 } = {}) {
    const version = (fixVersion || '').trim();
    if (!version) return [];
    const cached = TEST_EXECUTION_CACHE.listByFixVersion.get(version);
    if (cached) return cached.slice();
    const items = [];
    let start = 0;
    let total = null;
    for (let page = 0; page < maxPages; page++) {
      const url = `/rest/raven/1.0/report/testexecutionreport/testexecutions/?start=${start}&pageSize=${pageSize}&projectId=10000&filterscope=filter&version=${encodeURIComponent(version)}&_=${Date.now()}`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });
      if (!resp.ok) throw new Error(`获取测试执行列表失败（${resp.status}）`);
      const data = await resp.json();
      if (!Array.isArray(data) || !data.length) break;
      items.push(...data);
      if (total == null) total = data[0]?.total ?? null;
      start += pageSize;
      if (total != null && start >= total) break;
    }
    TEST_EXECUTION_CACHE.listByFixVersion.set(version, items);
    return items.slice();
  }
  async function fetchTestExecutionIssueDetails(issueKey) {
    const key = (issueKey || '').trim();
    if (!key) return null;
    if (TEST_EXECUTION_CACHE.issueByKey.has(key)) return TEST_EXECUTION_CACHE.issueByKey.get(key);
    const url = `/rest/api/2/issue/${encodeURIComponent(key)}?fields=summary,reporter,fixVersions`;
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });
      if (!resp.ok) throw new Error(`获取测试执行详情失败（${resp.status}）`);
      const data = await resp.json();
      const fields = data?.fields || {};
      const reporter = fields?.reporter?.displayName || fields?.reporter?.name || fields?.reporter?.emailAddress || '';
      const summary = fields?.summary || '';
      const fixVersion = fields?.fixVersions?.[0]?.name || '';
      const info = { reporter, summary, fixVersion };
      TEST_EXECUTION_CACHE.issueByKey.set(key, info);
      return info;
    } catch (e) {
      U.log('获取测试执行详情失败', e);
      return null;
    }
  }

  function analyzeIssues(payload) {
    const issues = (payload?.issueTable?.table) || [];
    let bug = issues.length, rej = 0, opt = 0;
    for (const it of issues) {
      const status = (it.status || '').trim();
      const summary = (it.summary || '').trim();
      if (status === '拒绝' || /拒绝/.test(summary)) { rej++; bug--; continue; }
      if (summary.includes('优化')) { opt++; bug--; continue; }
    }
    return { bug数: bug, 拒绝数: rej, 优化数: opt };
  }
  async function fetchBugStats(fixVersion, roundInfo, reporter, title) {
    const url = `https://jira.cjdropshipping.cn/rest/issueNav/1/issueTable?startIndex=0&filterId=-4&jql=${encodeURIComponent(buildJql(fixVersion, roundInfo, reporter, title))}&layoutKey=split-view`;
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-atlassian-token': 'no-check',
          'Accept': '*/*',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });
      return analyzeIssues(await resp.json());
    } catch (e) {
      U.log('获取缺陷失败', e);
      return { bug数: 0, 拒绝数: 0, 优化数: 0 };
    }
  }

  /* ================== Modal ================== */
  class ReportModal {
    constructor(text, opts = {}) {
      this.text = text;
      this.opts = opts;
      this.prevOverflow = document.documentElement.style.overflow;
      this.modal = null;
      this.viewer = null;
      this.hiddenTA = null;
      this._onEsc = null;
      this.header = null;
      this.dialog = null;
      this.init();
    }
    renderText(newText) {
      if (!this.viewer || !this.hiddenTA) return;
      const raw = typeof newText === 'string' ? newText : this.text;
      this.text = raw;
      const html = raw.replace(/https?:\/\/[^\s]+/g, (u) =>
        `<a class="tm-previewable-link" href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`
      );
      this.viewer.innerHTML = html;
      this.hiddenTA.value = raw;
    }
    init() {
      if (document.getElementById(IDS.modal)) return;
      document.documentElement.style.overflow = 'hidden';
      const modal = document.createElement('div');
      modal.id = IDS.modal;
      Object.assign(modal.style, {
        position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.45)', zIndex: '10000',
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', boxSizing: 'border-box',
      });
      const dialog = document.createElement('div');
      this.dialog = dialog;
      Object.assign(dialog.style, {
        position: 'relative',
        width: 'clamp(320px, 80vw, 900px)', maxWidth: '96vw', maxHeight: '85vh',
        background: '#fff', color: '#1f2328',
        borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box',
      });
      if (matchMedia?.('(prefers-color-scheme: dark)').matches) { dialog.style.background = '#0f172a'; dialog.style.color = '#e2e8f0'; }

      const header = document.createElement('div');
      this.header = header;
      Object.assign(header.style, {
        height: '48px', display: 'flex', alignItems: 'center',
        padding: '0 16px', borderBottom: '1px solid rgba(0,0,0,0.08)', cursor: 'move', userSelect: 'none',
        gap: '8px',
      });
      const titleText = (this.opts && this.opts.title) || '测试报告';
      const hTitle = document.createElement('div'); hTitle.textContent = titleText;
      Object.assign(hTitle.style, { fontSize: '16px', fontWeight: '600', flex: '0 0 auto' });
      header.appendChild(hTitle);

      // 已执行统计模式开关按钮
      if (this.opts && typeof this.opts.onToggleExecMode === 'function') {
        const toggleBtn = makeBtn(getExecMetricToggleLabel(), { variant: 'ghost', size: 'sm' });
        Object.assign(toggleBtn.style, { marginLeft: '8px', flex: '0 0 auto' });
        toggleBtn.onclick = () => {
          toggleExecMetricConfig();
          toggleBtn.textContent = getExecMetricToggleLabel();
          const newText = this.opts.onToggleExecMode();
          if (typeof newText === 'string' && newText) {
            this.renderText(newText);
          }
        };
        header.appendChild(toggleBtn);
      }

      // 头部扩展组件（例如候选报障人 + 当前统计报障人展示）
      if (this.opts && typeof this.opts.extraHeaderBuilder === 'function') {
        try {
          this.opts.extraHeaderBuilder(header, this);
        } catch (e) {
          console.debug('[TM-Report] extraHeaderBuilder error', e);
        }
      }

      const spacer = document.createElement('div');
      spacer.style.flex = '1 1 auto';
      header.appendChild(spacer);

      const content = document.createElement('div');
      Object.assign(content.style, {
        padding: '12px', display: 'flex', flexDirection: 'column',
        gap: '12px', flex: '1 1 auto', overflow: 'hidden',
      });
      const useCustomBody = this.opts && typeof this.opts.bodyBuilder === 'function';
      if (useCustomBody) {
        try {
          this.opts.bodyBuilder(content, this);
        } catch (e) {
          console.debug('[TM-Report] bodyBuilder error', e);
        }
      } else {
        const viewer = document.createElement('div');
        this.viewer = viewer;
        Object.assign(viewer.style, {
          width: '100%', maxWidth: '100%', overflow: 'auto',
          border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px', padding: '12px 14px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
          fontSize: '13px', lineHeight: '1.6',
          background: 'rgba(0,0,0,0.02)', color: 'inherit',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere', hyphens: 'auto',
          boxSizing: 'border-box',
        });

        const hiddenTA = document.createElement('textarea');
        hiddenTA.value = this.text;
        hiddenTA.setAttribute('aria-hidden', 'true');
        this.hiddenTA = hiddenTA;
        Object.assign(hiddenTA.style, { position: 'absolute', opacity: '0', pointerEvents: 'none', width: '0', height: '0' });

        content.appendChild(viewer);
        content.appendChild(hiddenTA);
      }

      const footer = document.createElement('div');
      Object.assign(footer.style, {
        padding: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end',
        alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.08)', boxSizing: 'border-box'
      });
      const useCustomFooter = this.opts && typeof this.opts.footerBuilder === 'function';
      if (useCustomFooter) {
        try {
          this.opts.footerBuilder(footer, this);
        } catch (e) {
          console.debug('[TM-Report] footerBuilder error', e);
        }
      } else if (!useCustomBody) {
        const copyBtn = makeBtn('复制到剪贴板', { variant:'primary', size:'md' });
        copyBtn.onclick = async () => {
          try {
            if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(this.hiddenTA.value);
            else { this.hiddenTA.select(); const ok = document.execCommand('copy'); this.hiddenTA.setSelectionRange(0,0); if (!ok) throw new Error('execCommand copy failed'); }
            this.toast('已复制到剪贴板'); this.close();
          } catch { this.toast('复制失败，请手动全选复制', true); }
        };
        footer.appendChild(copyBtn);
      } else {
        const closeBtn = makeBtn('关闭', { variant:'ghost', size:'md' });
        closeBtn.onclick = () => this.close();
        footer.appendChild(closeBtn);
      }
      dialog.appendChild(header); dialog.appendChild(content); dialog.appendChild(footer);
      const onEsc = (e) => { if (e.key === 'Escape') this.close(); };
      modal.addEventListener('mousedown', (e) => { if (e.target === modal) this.close(); });
      document.addEventListener('keydown', onEsc);
      modal.appendChild(dialog);
      document.body.appendChild(modal);
      this.modal = modal;
      this._onEsc = onEsc;

      if (!useCustomBody) this.renderText(this.text);
    }
    toast(msg, isErr = false) {
      const t = document.createElement('div'); t.textContent = msg;
      Object.assign(t.style, {
        position: 'fixed', left: '50%', bottom: '36px', transform: 'translateX(-50%)',
        background: isErr ? '#b91c1c' : '#16a34a', color: '#fff',
        padding: '8px 12px', borderRadius: '999px', fontSize: '12px',
        zIndex: '10001', boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
      });
      document.body.appendChild(t); setTimeout(() => t.remove(), 1000);
    }
    close() {
      if (!this.modal) return;
      document.removeEventListener('keydown', this._onEsc);
      document.documentElement.style.overflow = '';
      this.modal.remove(); this.modal = null;
      if (this.opts && typeof this.opts.onClose === 'function') {
        try { this.opts.onClose(); } catch (e) { console.debug('[TM-Report] onClose error', e); }
      }
    }
  }

  function openReporterPicker({ title, autoReporterList, candidateList }) {
    return new Promise((resolve) => {
      let done = false;
      let picker = null;
      const modal = new ReportModal('', {
        title: title || '报障人选择',
        onClose: () => {
          if (done) return;
          done = true;
          resolve(null);
        },
        bodyBuilder(content) {
          const autoInfo = document.createElement('div');
          autoInfo.textContent = `自动采集：${(autoReporterList || []).join('、') || '（空）'}`;
          Object.assign(autoInfo.style, { fontSize: '12px', color: '#64748b' });
          content.appendChild(autoInfo);

          picker = createCandidatePicker(candidateList, { compact: false });
          if (picker && picker.wrap && picker.wrap.childNodes.length) {
            picker.wrap.style.marginTop = '4px';
            content.appendChild(picker.wrap);
          } else {
            picker = null;
          }

          const hint = document.createElement('div');
          hint.textContent = '不勾选则仅使用自动采集报障人';
          Object.assign(hint.style, { fontSize: '12px', color: '#94a3b8' });
          content.appendChild(hint);
        },
        footerBuilder(footer, modalInstance) {
          const cancelBtn = makeBtn('取消', { variant: 'ghost', size: 'md' });
          const okBtn = makeBtn('确认', { variant: 'primary', size: 'md' });
          cancelBtn.onclick = () => {
            done = true;
            modalInstance.close();
            resolve(null);
          };
          okBtn.onclick = () => {
            const extraNames = [];
            const selected = picker ? picker.getSelected() : [];
            if (selected.length) extraNames.push(...selected);
            done = true;
            modalInstance.close();
            resolve({ extraNames });
          };
          footer.appendChild(cancelBtn);
          footer.appendChild(okBtn);
        },
      });
      void modal;
    });
  }

  /* ================== Portal 更新 ================== */
  async function updatePortalPage(fixVersion, { force = false } = {}) {
    const token = getXsrfToken();
    if (!token) { U.toast('缺少 XSRF Token，无法更新仪表盘，请刷新页面后重试', true); return false; }
    const safeFixVersion = (fixVersion || '').trim();
    if (!safeFixVersion) { U.toast('缺少修复版本，仪表盘标题未更新', true); return false; }
    const name = `${PORTAL_CONFIG.ownerPrefix}${safeFixVersion}`.trim();
    if (!force && lastSyncedPortalName === name) { U.log('仪表盘标题已是最新，无需重复更新'); return true; }

    const form = new URLSearchParams();
    form.set('portalPageName', name);
    form.set('portalPageDescription', '');
    form.set('favourite', PORTAL_CONFIG.favourite);
    PORTAL_CONFIG.groupShare.forEach((g) => form.append('groupShare', g));
    if (PORTAL_CONFIG.projectShare) form.set('projectShare', PORTAL_CONFIG.projectShare);
    form.set('roleShare', PORTAL_CONFIG.roleShare);
    form.set('shareValues', JSON.stringify(PORTAL_CONFIG.shareValues));
    form.set('pageId', PORTAL_CONFIG.pageId);
    form.set('returnUrl', PORTAL_CONFIG.returnUrl);
    form.set('atl_token', token);
    form.set('update_submit', PORTAL_CONFIG.submitLabel);

    try {
      const resp = await fetch('https://jira.cjdropshipping.cn/secure/EditPortalPage.jspa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        body: form,
        credentials: 'include',
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`仪表盘更新失败（${resp.status}）${text ? `：${text}` : ''}`);
      }
      U.toast('仪表盘标题已同步');
      lastSyncedPortalName = name;
      return true;
    } catch (err) {
      U.log('更新仪表盘失败', err);
      U.toast(err.message || '仪表盘更新失败', true);
      return false;
    }
  }

  /* ================== 分页解析筛选器ID ================== */
  async function findFilterIdByName(name, { maxPages = 50 } = {}) {
    if (!name) return null;
    const base =
      'https://jira.cjdropshipping.cn/secure/ManageFilters.jspa?filterView=my&Search=Search&filterView=search' +
      '&searchName=&searchOwnerUserName=&searchShareType=any&projectShare=10000&roleShare=&groupShare=jira-software-users' +
      '&userShare=&sortAscending=true&sortColumn=name';

    const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
    const target = norm(name);

    for (let i = 0; i < maxPages; i++) {
      const url = `${base}&pagingOffset=${i}`;
      try {
        const r = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
        });
        if (!r.ok) break;
        const html = await r.text();
        const dom = new DOMParser().parseFromString(html, 'text/html');
        const links = dom.querySelectorAll('.favourite-item a, .favourite-item a[id^="filterlink_"]');
        if (!links || links.length === 0) break;
        for (const a of links) {
          const text = norm(a.textContent || '');
          if (text === target) {
            const m = (a.getAttribute('id') || '').match(/filterlink_(\d+)/) ||
                      (a.getAttribute('href') || '').match(/filter=(\d+)/);
            if (m && m[1]) return m[1];
          }
        }
      } catch (_) { /* ignore */ }
    }
    return null;
  }

  async function deleteFilterById(filterId) {
    if (!filterId) return false;
    const token = getXsrfToken();
    if (!token) { U.toast('缺少 XSRF Token，无法删除同名筛选器', true); return false; }
    const form = new URLSearchParams();
    form.set('inline', 'true');
    form.set('decorator', 'dialog');
    form.set('filterId', String(filterId));
    form.set('atl_token', token);
    try {
      const resp = await fetch('https://jira.cjdropshipping.cn/secure/DeleteFilter.jspa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': 'text/html, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: form.toString(),
        credentials: 'include',
      });
      if (!resp.ok) throw new Error(`删除筛选器失败（${resp.status}）`);
      U.toast('已删除同名筛选器，重新创建中...');
      return true;
    } catch (err) {
      U.log('删除筛选器失败', err);
      U.toast(err.message || '删除同名筛选器失败', true);
      return false;
    }
  }

  /* ================== gadget 串行更新 + 退避重试 ================== */
  const gadgetPrefsUrl = (boardId, gadgetId, v) => `/rest/dashboards/${v}/${boardId}/gadget/${gadgetId}/prefs`;
  async function putPrefsJson(version, boardId, gadgetId, prefs) {
    const url = gadgetPrefsUrl(boardId, gadgetId, version);
    return fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json,*/*;q=0.8',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Atlassian-Token': 'no-check',
      },
      body: JSON.stringify(prefs),
    });
  }
  async function putPrefsForm(version, boardId, gadgetId, prefs) {
    const url = gadgetPrefsUrl(boardId, gadgetId, version);
    const form = new URLSearchParams();
    Object.keys(prefs).forEach(k => form.set(k, prefs[k]));
    return fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: 'application/json,*/*;q=0.8',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Atlassian-Token': 'no-check',
      },
      body: form.toString(),
    });
  }
  async function updateOneGadgetWithVersion(version, boardId, gadget, key) {
    const prefs = { ...(gadget.prefs || {}), up_filterId: key, up_isConfigured: true };
    let attempt = 0;
    while (attempt < 4) {
      attempt++;
      try {
        const r = await putPrefsJson(version, boardId, gadget.id, prefs);
        if (r.ok || r.status === 204) return true;
        const r2 = await putPrefsForm(version, boardId, gadget.id, prefs);
        if (r2.ok || r2.status === 204) return true;
        const code = r2.status || r.status;
        if ([429, 500, 502, 503, 504].includes(code)) {
          await sleep(backoffDelay(attempt));
          continue;
        }
        throw new Error(`更新 gadget ${gadget.id} 失败（${code}）`);
      } catch (e) {
        if (attempt >= 4) throw e;
        await sleep(backoffDelay(attempt));
      }
    }
    return false;
  }
  async function updateDashboardGadgets(filterId, { force = false } = {}) {
    if (!filterId) return false;
    const key = String(filterId).startsWith('filter-') ? String(filterId) : `filter-${filterId}`;
    if (!force && lastSyncedGadgetFilterKey === key) {
      U.log('仪表盘小组件已应用最新筛选器，跳过更新');
      return true;
    }
    const boardId = String(DASHBOARD_CONFIG.boardId || '10923');
    const gadgets = (DASHBOARD_CONFIG.gadgets || []).map(g => ({ id: String(g.id), prefs: g.prefs || {} }));
    if (!gadgets.length) { U.toast('未在仪表盘上找到可更新的 gadget', true); return false; }

    try {
      for (const g of gadgets) {
        await updateOneGadgetWithVersion('latest', boardId, g, key);
        await sleep(120);
      }
    } catch (_) {
      for (const g of gadgets) {
        await updateOneGadgetWithVersion('1.0', boardId, g, key);
        await sleep(120);
      }
    }
    lastSyncedGadgetFilterKey = key;
    U.toast('仪表盘小组件已更新');
    return true;
  }

  /* ================== 仪表盘配置入口 ================== */
  async function configureDashboard(triggerBtn) {
    if (isConfiguringDashboard) { U.toast('仪表盘正在配置中，请稍候…'); return; }
    if (!isTestExecutionPage()) { U.toast('仅支持在 Test Execution 页面使用该功能', true); return; }

    const title = extractTitle();
    const fixVersion = extractFixVersion();
    if (!fixVersion) { U.toast('未识别到修复版本，无法创建筛选器', true); return; }

    const roundInfo = extractRoundInfo(title);
    const issueReporter = extractReporter();
    const autoReporterList = collectAllReporterNames(issueReporter);
    let reporterList = autoReporterList.slice();
    const candidateList = getCandidateReporters();
    let originalText = '';
    if (triggerBtn) {
      originalText = triggerBtn.textContent;
      triggerBtn.disabled = true;
      triggerBtn.textContent = '选择报障人…';
    }
    isConfiguringDashboard = true;
    const picked = await openReporterPicker({
      title: '筛选器报障人',
      autoReporterList,
      candidateList,
    });
    if (!picked) {
      isConfiguringDashboard = false;
      if (triggerBtn) { triggerBtn.disabled = false; triggerBtn.textContent = originalText || '配置仪表盘'; }
      return;
    }
    if (picked.extraNames && picked.extraNames.length) {
      const set = new Set();
      pushReporterName(set, autoReporterList);
      pushReporterName(set, picked.extraNames);
      const merged = [...set];
      if (merged.length) reporterList = merged;
    }
    U.toast(`筛选器报障人：${reporterList.join('、') || '自动采集为空'}`);
    const roundVariants = deriveRoundVariants(roundInfo, title);
    const roundNumeric = normalizeRoundValue(roundInfo, title) || roundInfo;
    let roundLabel =
      roundVariants.find((v) => /轮测试$/.test(v)) ||
      roundVariants.find((v) => /^[一二三四五六七八九十两〇零]+轮$/.test(v))?.replace(/轮$/, '轮测试') ||
      (roundNumeric ? `${roundNumeric}测试` : '') ||
      roundInfo;
    if (!roundLabel) roundLabel = '测试轮次';
    const displayName = `${fixVersion}-${roundLabel}`;
    const jql = buildJql(fixVersion, roundInfo, reporterList, title);

    const payload = JSON.stringify({ name: displayName, jql, favourite: true });
    if (triggerBtn) { triggerBtn.textContent = '配置中…'; }
    let filterError = null;
    let filterId = null;
    let portalUpdateRequested = false;
    let forcePortalUpdate = false;
    let gadgetUpdateRequested = false;
    let forceGadgetUpdate = false;
    let retriedAfterDelete = false;

    async function attemptCreate() {
      const resp = await fetch('https://jira.cjdropshipping.cn/rest/api/2/filter/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Atlassian-Token': 'no-check',
        },
        credentials: 'include',
        body: payload,
      });
      return resp;
    }

    try {
      let resp = await attemptCreate();
      if (!resp.ok) {
        const rawText = await resp.text().catch(() => '');
        const lower = rawText.toLowerCase();
        if (resp.status === 400 || resp.status === 409 || lower.includes('already exists') || /已存在/.test(rawText)) {
          const existingId = await findFilterIdByName(displayName);
          if (existingId && !retriedAfterDelete) {
            const deleted = await deleteFilterById(existingId);
            if (deleted) {
              retriedAfterDelete = true;
              resp = await attemptCreate();
            }
          }
          if (!resp.ok) {
            throw new Error(rawText ? rawText : '筛选器已存在且无法替换');
          }
        } else {
          throw new Error(`创建筛选器失败（${resp.status}）${rawText ? `：${rawText}` : ''}`);
        }
      }

      const data = await resp.json().catch(() => ({}));
      filterId = data?.id ?? data?.filterId ?? null;
      const link = filterId ? `https://jira.cjdropshipping.cn/issues/?filter=${filterId}` : (data?.self || '');
      if (link && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link).catch(() => {});
      }
      U.toast('筛选器创建成功');
      portalUpdateRequested = true;
      gadgetUpdateRequested = true;
    } catch (err) {
      filterError = err;
      U.log('创建筛选器异常', err);
      U.toast(err.message || '创建筛选器失败，请查看控制台日志', true);
    } finally {
      isConfiguringDashboard = false;
      if (triggerBtn) { triggerBtn.disabled = false; triggerBtn.textContent = originalText || '配置仪表盘'; }
    }

    if (!filterError && portalUpdateRequested) await updatePortalPage(fixVersion, { force: forcePortalUpdate });

    if (!filterError && gadgetUpdateRequested) {
      if (!filterId) filterId = await findFilterIdByName(displayName);
      if (filterId) await updateDashboardGadgets(filterId, { force: forceGadgetUpdate });
      else U.toast('未能获取筛选器ID，仪表盘小组件未更新', true);
    }
  }

  /* ================== Report 生成（展示 reporter + 候选勾选） ================== */
  class ReportContext {
    constructor({ counts, title, fixVersion, reporter, roundInfo, includeDomReporters = true, issueKey = '' }) {
      this.counts = counts;
      this.title = title;
      this.fixVersion = fixVersion;
      this.roundInfo = roundInfo;
      this.issueKey = issueKey;
      this.baseReporterList = collectAllReporterNames(reporter, { includeDom: includeDomReporters });
      this.currentReporterList = this.baseReporterList.slice();
      this.normRound = normalizeRoundValue(roundInfo, title) || '';
      const m = this.normRound.match(/(\d+)/);
      this.roundNum = m ? parseInt(m[1], 10) : 1;
      this.currentRoundKey = roundInfo;
      this.statsNow = null;
      this.statsR1 = null;
      this.statsR2 = null;
    }

    roundKeyForR2() {
      return this.roundNum === 2 ? this.currentRoundKey : '2轮';
    }

    getStatVal(target, key) {
      const val = target && target[key];
      const num = Number(val);
      return Number.isFinite(num) ? num : 0;
    }

    buildReporterListWithExtra(extraNames) {
      const set = new Set();
      pushReporterName(set, this.baseReporterList);
      if (extraNames) pushReporterName(set, extraNames);
      const list = [...set];
      return list.length ? list : this.baseReporterList.slice();
    }

    async recompute(extraNames) {
      this.currentReporterList = this.buildReporterListWithExtra(extraNames);
      this.statsNow = await fetchBugStats(this.fixVersion, this.currentRoundKey, this.currentReporterList, this.title);
      if (this.roundNum >= 2) {
        this.statsR1 = await fetchBugStats(this.fixVersion, '1轮', this.currentReporterList, this.title);
        this.statsR2 = await fetchBugStats(this.fixVersion, this.roundKeyForR2(), this.currentReporterList, this.title);
      } else {
        this.statsR1 = null;
        this.statsR2 = null;
      }
    }

    async init() {
      await this.recompute();
    }

    buildText() {
      const metrics = computeMetrics(this.counts);
      const statsNow = this.statsNow || {};
      const statsR1 = this.statsR1 || {};
      const statsR2 = this.statsR2 || {};
      const bugNow = this.getStatVal(statsNow, 'bug数');
      const rejNow = this.getStatVal(statsNow, '拒绝数');
      const optNow = this.getStatVal(statsNow, '优化数');
      const bugR1 = this.getStatVal(statsR1, 'bug数');
      const rejR1 = this.getStatVal(statsR1, '拒绝数');
      const optR1 = this.getStatVal(statsR1, '优化数');
      const bugR2 = this.getStatVal(statsR2, 'bug数');
      const rejR2 = this.getStatVal(statsR2, '拒绝数');
      const optR2 = this.getStatVal(statsR2, '优化数');

    const lines = [
      `${this.title}：`,
      `测试用例总数：${this.counts.total}`,
        `执行进度：${metrics.progress}%`,
        `已执行：${metrics.executed}`,
        this.counts.fail ? `失败用例数：${this.counts.fail}` : '',
        this.counts.aborted ? `阻塞用例数：${this.counts.aborted}` : '',
        this.counts.executing ? `执行中用例数：${this.counts.executing}` : '',
        `通过率：${metrics.successRate}%`,
      ];

      if (this.roundNum < 2) {
        lines.push(
          `bug数：${bugNow} (不包含拒绝和优化)`,
          `   优化数：${optNow}`,
          `   拒绝数：${rejNow}`,
        );
      } else {
        let retestRateLine = '复测bug率：—';
        if (bugR1 > 0) {
          const rate = Math.round(((bugR2 / bugR1 - 1) * 10000 * -1) / 100);
          retestRateLine = `复测bug率：${rate}%`;
        }
        lines.push(
          `一轮bug数：${bugR1} (不包含拒绝和优化)`,
          `   优化数：${optR1}`,
          `   拒绝数：${rejR1}`,
          `二轮bug数：${bugR2} (不包含拒绝和优化)`,
          `   优化数：${optR2}`,
          `   拒绝数：${rejR2}`,
          retestRateLine,
        );
      }

      lines.push(`bug地址：${bugUrl(this.fixVersion, this.roundInfo, this.currentReporterList, this.title)}`);

      return lines.filter(Boolean).join('\n');
    }

  }

  async function generateReport() {
    const ok = await waitFor(() => U.qs(SEL.progressBar) || (U.qs(SEL.splitPaneRight) && U.qs(SEL.progressBar, U.qs(SEL.splitPaneRight))), 6000);
    if (!ok) { alert('未检测到执行进度区域，可能尚未加载完毕'); return; }

    const counts = extractTestCounts();
    if (!counts) { alert('无法提取测试数据'); return; }

    const title = extractTitle();
    const fixVersion = extractFixVersion();
    const reporter = extractReporter();
    const roundInfo = extractRoundInfo(title);
    const currentKey = getCurrentIssueKey();

    const ctx = new ReportContext({ counts, title, fixVersion, reporter, roundInfo, issueKey: currentKey });
    await ctx.init();

    let modalRef = null;
    let execList = [];
    let execListLoaded = false;
    let execListLoading = false;
    let execCheckboxes = [];
    const selectedExecKeys = new Set();

    let execListWrap = null;
    let execLoadBtn = null;
    let execApplyBtn = null;
    let execCountLabel = null;
    let execToggleBtn = null;
    let execListHint = null;
    let execListCollapsed = false;
    let reporterSummaryWrap = null;
    let reporterSummaryList = null;
    let reporterPickers = [];

    let recomputeBusy = false;
    let setExecControlsDisabled = () => {};

    const reporterExtraMap = new Map();
    const candidateNames = getCandidateReporters();
    const getContextKey = (context, index) => {
      if (!context) return String(index ?? '');
      return context.issueKey || context.title || String(index ?? '');
    };
    const getExtraNamesByKey = (key) => reporterExtraMap.get(key) || [];
    const getExtraNamesFor = (context, index) => getExtraNamesByKey(getContextKey(context, index));
    const setReporterPickersDisabled = (disabled) => {
      reporterPickers.forEach((picker) => picker.setDisabled(disabled));
    };

    const setControlsDisabled = (disabled) => {
      setReporterPickersDisabled(disabled);
      setExecControlsDisabled(disabled);
    };

    let contexts = [ctx];

    const buildCombinedText = () => {
      const parts = contexts.map((item) => item.buildText());
      return parts.join('\n\n------------------------------\n\n');
    };
    const buildContextFromItem = async (item) => {
      if (!item) return null;
      const countsForItem = buildCountsFromExecutionItem(item);
      let itemTitle = (item.summary || '').trim();
      let itemFixVersion = (fixVersion || '').trim();
      let itemReporter = '';
      if (item.key) {
        const info = await fetchTestExecutionIssueDetails(item.key);
        if (info) {
          if (info.summary) itemTitle = info.summary;
          if (!itemFixVersion && info.fixVersion) itemFixVersion = info.fixVersion;
          itemReporter = info.reporter || '';
        }
      }
      const itemRoundInfo = extractRoundInfo(itemTitle);
      const itemCtx = new ReportContext({
        counts: countsForItem,
        title: itemTitle,
        fixVersion: itemFixVersion || fixVersion,
        reporter: itemReporter,
        roundInfo: itemRoundInfo,
        includeDomReporters: false,
        issueKey: item.key,
      });
      await itemCtx.recompute(getExtraNamesByKey(item.key));
      return itemCtx;
    };
    const buildContexts = async () => {
      const list = [];
      await ctx.recompute(getExtraNamesByKey(currentKey));
      list.push(ctx);
      for (const item of execList) {
        if (!item?.key || !selectedExecKeys.has(item.key)) continue;
        const extraCtx = await buildContextFromItem(item);
        if (extraCtx) list.push(extraCtx);
      }
      return list;
    };
    const applyExecListCollapse = () => {
      if (!execListWrap) return;
      const collapsed = execListCollapsed && execListLoaded;
      execListWrap.style.display = collapsed ? 'none' : '';
      if (execListHint) {
        execListHint.textContent = collapsed
          ? (selectedExecKeys.size
            ? `已选 ${selectedExecKeys.size} 个测试执行，列表已收起`
            : '列表已收起')
          : '勾选后点击“应用选择”生成多条报告';
        execListHint.style.display = '';
      }
      if (execToggleBtn) {
        execToggleBtn.textContent = collapsed ? '展开列表' : '收起列表';
        execToggleBtn.disabled = !execListLoaded;
      }
    };
    const setExecListCollapsed = (collapsed) => {
      execListCollapsed = collapsed;
      applyExecListCollapse();
    };
    const updateExecCountLabel = () => {
      if (execCountLabel) execCountLabel.textContent = `已选其他执行：${selectedExecKeys.size}`;
      applyExecListCollapse();
    };
    const renderReporterSummary = () => {
      if (!reporterSummaryList) return;
      reporterSummaryList.innerHTML = '';
      reporterPickers = [];
      if (!contexts.length) {
        const empty = document.createElement('div');
        empty.textContent = '暂无统计报障人';
        Object.assign(empty.style, { fontSize: '12px', color: '#94a3b8' });
        reporterSummaryList.appendChild(empty);
        return;
      }
      contexts.forEach((item, index) => {
        const contextKey = getContextKey(item, index);
        const row = document.createElement('div');
        Object.assign(row.style, { display: 'flex', flexDirection: 'column', gap: '4px' });
        const keyPrefix = item.issueKey ? `${item.issueKey} ` : '';
        const label = `${keyPrefix}${item.title || ''}`.trim() || '未知测试执行';
        const titleLine = document.createElement('div');
        titleLine.textContent = label;
        Object.assign(titleLine.style, { fontSize: '12px', color: '#334155' });
        row.appendChild(titleLine);

        const picker = createCandidatePicker(candidateNames, {
          compact: true,
          selected: getExtraNamesByKey(contextKey),
          onChange: (selected) => {
            if (selected.length) reporterExtraMap.set(contextKey, selected);
            else reporterExtraMap.delete(contextKey);
            void recomputeAll({ rebuildContexts: false });
          },
        });
        if (picker.wrap && picker.wrap.childNodes.length) {
          row.appendChild(picker.wrap);
          reporterPickers.push(picker);
        }
        reporterSummaryList.appendChild(row);
      });
    };
    const renderExecList = () => {
      if (!execListWrap) return;
      execListWrap.innerHTML = '';
      execCheckboxes = [];
      if (execLoadBtn) execLoadBtn.textContent = execListLoaded ? '刷新列表' : '加载列表';
      if (execApplyBtn) execApplyBtn.disabled = !execListLoaded || recomputeBusy;
      updateExecCountLabel();

      const showHint = (text) => {
        const hint = document.createElement('div');
        hint.textContent = text;
        Object.assign(hint.style, { fontSize: '12px', color: '#94a3b8' });
        execListWrap.appendChild(hint);
      };

      if (execListLoading) { showHint('正在加载列表…'); applyExecListCollapse(); return; }
      if (!execListLoaded) { showHint('点击“加载列表”获取其他测试执行'); applyExecListCollapse(); return; }

      const list = execList.filter((item) => item?.key && item.key !== currentKey);
      if (!list.length) { showHint('未找到其他测试执行'); applyExecListCollapse(); return; }

      list.forEach((item) => {
        const row = document.createElement('label');
        Object.assign(row.style, { display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', cursor: 'pointer' });

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = selectedExecKeys.has(item.key);
        cb.onchange = () => {
          if (cb.checked) selectedExecKeys.add(item.key);
          else selectedExecKeys.delete(item.key);
          updateExecCountLabel();
        };
        execCheckboxes.push(cb);

        const info = document.createElement('div');
        Object.assign(info.style, { display: 'flex', flexDirection: 'column', gap: '2px' });
        const main = document.createElement('span');
        main.textContent = `${item.key} ${item.summary || ''}`.trim();
        const stats = buildCountsFromExecutionItem(item);
        const sub = document.createElement('span');
        sub.textContent = `总${stats.total} / PASS ${stats.pass} / FAIL ${stats.fail} / 阻塞 ${stats.aborted} / 执行中 ${stats.executing}`;
        Object.assign(sub.style, { color: '#94a3b8' });

        info.appendChild(main);
        info.appendChild(sub);
        row.appendChild(cb);
        row.appendChild(info);
        execListWrap.appendChild(row);
      });
      applyExecListCollapse();
    };
    const loadExecList = async () => {
      if (execListLoading) return;
      if (!fixVersion) {
        U.toast('缺少修复版本，无法加载其他测试执行', true);
        return;
      }
      execListLoading = true;
      renderExecList();
      setControlsDisabled(true);
      try {
        execList = await fetchTestExecutionsByFixVersion(fixVersion);
        const available = new Set(execList.map(item => item?.key).filter(Boolean));
        for (const key of Array.from(selectedExecKeys)) {
          if (!available.has(key) || key === currentKey) selectedExecKeys.delete(key);
        }
        execListLoaded = true;
      } catch (e) {
        console.debug('[TM-Report] loadTestExecutions error', e);
        U.toast('获取其他测试执行失败，请稍后重试', true);
      } finally {
        execListLoading = false;
        setControlsDisabled(false);
        renderExecList();
      }
    };
    const recomputeAll = async ({ rebuildContexts = false, toastText } = {}) => {
      if (recomputeBusy) return;
      recomputeBusy = true;
      setControlsDisabled(true);
      try {
        if (rebuildContexts) {
          contexts = await buildContexts();
        } else {
          for (const [index, item] of contexts.entries()) {
            await item.recompute(getExtraNamesFor(item, index));
          }
        }
        updateExecCountLabel();
        renderReporterSummary();
        if (modalRef) modalRef.renderText(buildCombinedText());
        if (toastText) U.toast(toastText);
      } catch (e) {
        console.debug('[TM-Report] recomputeAll error', e);
        U.toast('更新报告失败，请稍后重试', true);
      } finally {
        recomputeBusy = false;
        setControlsDisabled(false);
      }
    };

    const modal = new ReportModal(buildCombinedText(), {
      onToggleExecMode: () => buildCombinedText(),
      bodyBuilder(content, modalInstance) {
        modalRef = modalInstance;
        const panel = document.createElement('div');
        Object.assign(panel.style, {
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '8px 10px',
          borderRadius: '10px',
          border: '1px dashed var(--tm-border)',
          background: 'rgba(0,0,0,0.02)',
        });

        const panelHead = document.createElement('div');
        Object.assign(panelHead.style, { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' });
        const panelTitle = document.createElement('span');
        panelTitle.textContent = '其他测试执行';
        Object.assign(panelTitle.style, { fontSize: '13px', fontWeight: '600' });
        execCountLabel = document.createElement('span');
        Object.assign(execCountLabel.style, { fontSize: '12px', color: '#64748b' });
        updateExecCountLabel();
        const spacer = document.createElement('span');
        spacer.style.flex = '1 1 auto';
        execToggleBtn = makeBtn('收起列表', { variant: 'ghost', size: 'sm' });
        execToggleBtn.onclick = () => {
          setExecListCollapsed(!execListCollapsed);
        };
        execLoadBtn = makeBtn('加载列表', { variant: 'ghost', size: 'sm' });
        execLoadBtn.onclick = () => { void loadExecList(); };
        execApplyBtn = makeBtn('应用选择', { variant: 'primary', size: 'sm' });
        execApplyBtn.onclick = () => {
          const msg = selectedExecKeys.size
            ? `已合并 ${selectedExecKeys.size} 个测试执行报告`
            : '已恢复为当前测试执行报告';
          setExecListCollapsed(selectedExecKeys.size > 0);
          void recomputeAll({ rebuildContexts: true, toastText: msg });
        };

        panelHead.appendChild(panelTitle);
        panelHead.appendChild(execCountLabel);
        panelHead.appendChild(spacer);
        panelHead.appendChild(execToggleBtn);
        panelHead.appendChild(execLoadBtn);
        panelHead.appendChild(execApplyBtn);
        panel.appendChild(panelHead);

        const currentInfo = document.createElement('div');
        const currentLabel = currentKey ? `${currentKey} ${title}`.trim() : title;
        currentInfo.textContent = `当前：${currentLabel || '未知'}`;
        Object.assign(currentInfo.style, { fontSize: '12px', color: '#64748b' });
        panel.appendChild(currentInfo);

        execListWrap = document.createElement('div');
        Object.assign(execListWrap.style, {
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          maxHeight: '180px',
          overflowY: 'auto',
          padding: '6px',
          borderRadius: '8px',
          border: '1px solid var(--tm-border)',
          background: 'rgba(0,0,0,0.02)',
        });
        panel.appendChild(execListWrap);

        execListHint = document.createElement('div');
        execListHint.textContent = '勾选后点击“应用选择”生成多条报告';
        Object.assign(execListHint.style, { fontSize: '12px', color: '#94a3b8' });
        panel.appendChild(execListHint);

        content.appendChild(panel);
        renderExecList();

        reporterSummaryWrap = document.createElement('div');
        Object.assign(reporterSummaryWrap.style, {
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '8px 10px',
          borderRadius: '10px',
          border: '1px dashed var(--tm-border)',
          background: 'rgba(0,0,0,0.02)',
        });
        const reporterTitle = document.createElement('span');
        reporterTitle.textContent = '统计报障人明细';
        Object.assign(reporterTitle.style, { fontSize: '13px', fontWeight: '600' });
        reporterSummaryWrap.appendChild(reporterTitle);
        reporterSummaryList = document.createElement('div');
        Object.assign(reporterSummaryList.style, { display: 'flex', flexDirection: 'column', gap: '4px' });
        reporterSummaryWrap.appendChild(reporterSummaryList);
        content.appendChild(reporterSummaryWrap);
        renderReporterSummary();

        setExecControlsDisabled = (disabled) => {
          if (execToggleBtn) execToggleBtn.disabled = disabled || !execListLoaded;
          if (execLoadBtn) execLoadBtn.disabled = disabled;
          if (execApplyBtn) execApplyBtn.disabled = disabled || !execListLoaded;
          execCheckboxes.forEach((cb) => { cb.disabled = disabled; });
        };

        const viewer = document.createElement('div');
        modalInstance.viewer = viewer;
        Object.assign(viewer.style, {
          width: '100%',
          maxWidth: '100%',
          overflow: 'auto',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: '10px',
          padding: '12px 14px',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
          fontSize: '13px',
          lineHeight: '1.6',
          background: 'rgba(0,0,0,0.02)',
          color: 'inherit',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
          hyphens: 'auto',
          boxSizing: 'border-box',
        });
        const hiddenTA = document.createElement('textarea');
        hiddenTA.value = buildCombinedText();
        hiddenTA.setAttribute('aria-hidden', 'true');
        modalInstance.hiddenTA = hiddenTA;
        Object.assign(hiddenTA.style, { position: 'absolute', opacity: '0', pointerEvents: 'none', width: '0', height: '0' });
        content.appendChild(viewer);
        content.appendChild(hiddenTA);
        modalInstance.renderText(buildCombinedText());
      },
      footerBuilder(footer, modalInstance) {
        const copyBtn = makeBtn('复制到剪贴板', { variant: 'primary', size: 'md' });
        copyBtn.onclick = async () => {
          try {
            if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(modalInstance.hiddenTA.value);
            else {
              modalInstance.hiddenTA.select();
              const ok = document.execCommand('copy');
              modalInstance.hiddenTA.setSelectionRange(0, 0);
              if (!ok) throw new Error('execCommand copy failed');
            }
            modalInstance.toast('已复制到剪贴板');
            modalInstance.close();
          } catch {
            modalInstance.toast('复制失败，请手动全选复制', true);
          }
        };
        footer.appendChild(copyBtn);
      },
    });

    void modal;
  }

  /* ================== Buttons ================== */
  function ensureToolbarButton() {
    if (!isTestExecutionPage()) return false;
    const ops = U.qs(SEL.opsBar) || U.qs(SEL.opsBar, U.qs(SEL.splitPaneRight));
    if (!ops) return false;

    let wrap = document.getElementById(IDS.toolbarWrap);
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.id = IDS.toolbarWrap;
      wrap.style.marginLeft = '8px';
      wrap.style.display = 'inline-flex';
      wrap.style.gap = '8px';
      wrap.style.alignItems = 'center';
      ops.appendChild(wrap);
    } else if (wrap.parentNode !== ops) {
      ops.appendChild(wrap);
    }

    let changed = false;
    if (!document.getElementById(IDS.btnToolbar)) {
      const btnReport = makeBtn('生成测试报告', { variant:'primary', size:'md', id: IDS.btnToolbar });
      btnReport.onclick = generateReport;
      wrap.appendChild(btnReport);
      changed = true;
    }
    if (!document.getElementById(IDS.btnDashboard)) {
      const btnDash = makeBtn('配置仪表盘', { variant:'ghost', size:'md', id: IDS.btnDashboard });
      btnDash.onclick = () => configureDashboard(btnDash);
      wrap.appendChild(btnDash);
      changed = true;
    }
    return changed;
  }
  function ensureTitleButton() {
    if (document.getElementById(IDS.btnTitle)) return false;
    if (!isTestExecutionPage()) return false;
    const titleEl = U.qs(SEL.issueSummary) || (U.qs(SEL.splitPaneRight) && U.qs(SEL.issueSummary, U.qs(SEL.splitPaneRight)));
    if (!titleEl) return false;
    const btn = makeBtn('生成报告', { variant:'ghost', size:'sm', id: IDS.btnTitle });
    btn.onclick = generateReport;
    const parent = titleEl.parentElement || U.qs(SEL.splitPaneRight) || document.body;
    U.insertAfter(btn, titleEl) || parent.appendChild(btn);
    return true;
  }
  function ensureFloatButton() {
    const fb = document.getElementById(IDS.btnFloat);
    if (fb) {
      fb.style.display = countVisibleActionButtons() >= 2 ? 'none' : '';
      return false;
    }
    const btn = makeBtn('生成报告', { variant:'primary', size:'md', id: IDS.btnFloat });
    btn.onclick = generateReport;
    Object.assign(btn.style, {
      position: 'fixed', right: '16px', bottom: '16px', zIndex: 9999, boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
    });
    document.body.appendChild(btn);
    return true;
  }
  function ensureReportListButtons() {
    if (!isXrayReportListPage()) return false;
    let changed = false;
    const table = U.qs(SEL.reportTable);
    if (table) {
      U.qsa('tbody tr', table).forEach((tr) => {
        if (tr.querySelector(`.${CLS.btnRow}`)) return;
        const teLink = tr.querySelector('td a[href*="/browse/"]');
        if (!teLink) return;
        const td = document.createElement('td');
        const btn = makeBtn('生成报告', { variant:'primary', size:'sm' });
        btn.classList.add(CLS.btnRow);
        btn.onclick = (e) => {
          e.preventDefault();
          try { const url = new URL(teLink.href, location.origin); url.searchParams.set('tm_report', '1'); window.open(url.toString(), '_blank', 'noopener'); }
          catch { location.href = teLink.href + (teLink.href.includes('?') ? '&' : '?') + 'tm_report=1'; }
        };
        td.appendChild(btn);
        tr.appendChild(td);
      });
      changed = true;
    }
    return changed;
  }
  function countVisibleActionButtons() {
    let n = 0;
    if (document.getElementById(IDS.btnToolbar)) n++;
    if (document.getElementById(IDS.btnDashboard)) n++;
    if (document.getElementById(IDS.btnTitle)) n++;
    return n;
  }

  /* ================== 挂载计划 ================== */
  const MAX_QUICK_SPIN = 10;
  const HEARTBEAT_MS = 1000;
  const HEARTBEAT_BURST = 40;
  let quickSpin = 0, heartbeatTimer = null, heartbeatLeft = 0;

  function needButtons() {
    if (isTestExecutionPage()) {
      if (countVisibleActionButtons() < 2) return true;
    }
    if (isXrayReportListPage()) {
      const table = U.qs(SEL.reportTable);
      if (!table) return true;
      const hasRow = !!U.qs('tbody tr', table);
      const hasRowBtn = !!U.qs(`.${CLS.btnRow}`, table);
      if (hasRow && !hasRowBtn) return true;
    }
    return false;
  }
  function doRearmOnce() {
    let changed = false;
    if (isTestExecutionPage()) {
      changed = ensureToolbarButton() || changed;
      changed = ensureTitleButton() || changed;
      ensureFloatButton();
    }
    if (isXrayReportListPage()) changed = ensureReportListButtons() || changed;
    if (countVisibleActionButtons() >= 2) {
      const fb = document.getElementById(IDS.btnFloat);
      if (fb) fb.style.display = 'none';
    }
    return changed;
  }
  const rearm = U.debounce(() => {
    const changed = doRearmOnce();
    if (quickSpin < MAX_QUICK_SPIN && needButtons()) {
      quickSpin++;
      setTimeout(rearm, 150);
      return;
    }
    if (needButtons()) extendHeartbeat();
  }, 60);
  function extendHeartbeat() {
    heartbeatLeft = Math.max(heartbeatLeft, HEARTBEAT_BURST);
    if (heartbeatTimer) return;
    heartbeatTimer = setInterval(() => {
      if (heartbeatLeft-- <= 0) { clearInterval(heartbeatTimer); heartbeatTimer = null; return; }
      doRearmOnce();
      if (!needButtons()) { clearInterval(heartbeatTimer); heartbeatTimer = null; }
    }, HEARTBEAT_MS);
  }

  /* ================== 触发器 ================== */
  new MutationObserver(() => rearm()).observe(document.documentElement || document.body, { childList: true, subtree: true });
  (function hookNet() {
    if (!window.__tm_fetch_hooked) {
      window.__tm_fetch_hooked = true;
      const raw = window.fetch;
      window.fetch = (...a) => raw(...a).then((r) => { r.clone().text().catch(()=>null).finally(() => setTimeout(rearm, 0)); return r; });
    }
    if (!window.__tm_xhr_hooked) {
      window.__tm_xhr_hooked = true;
      const Raw = window.XMLHttpRequest;
      window.XMLHttpRequest = function Wrapped() { const xhr = new Raw(); xhr.addEventListener('loadend', () => setTimeout(rearm, 0)); return xhr; };
    }
  })();
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, a, span, input[type="button"], input[type="submit"]');
    if (!el) return;
    const t = (U.txt(el) || el.value || '').toString();
    if (/获取|刷新|查询|Search|Load|Apply|Filter/i.test(t)) {
      let n = 0; const it = setInterval(() => { rearm(); if (++n > 24) clearInterval(it); }, 250);
    }
  });
  (function hookHistory() {
    if (history.__tm_hooked) return; history.__tm_hooked = true;
    const _push = history.pushState;
    history.pushState = function(...args) { const r = _push.apply(this, args); setTimeout(rearm, 0); setTimeout(autoGenerateIfFlagged, 0); return r; };
    addEventListener('popstate', () => { setTimeout(rearm, 0); setTimeout(autoGenerateIfFlagged, 0); });
    addEventListener('pageshow', () => { quickSpin = 0; rearm(); autoGenerateIfFlagged(); });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { quickSpin = 0; rearm(); } });
  })();
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'r' && isTestExecutionPage() && !document.getElementById(IDS.modal)) {
      e.preventDefault(); generateReport();
    }
  });
  function autoGenerateIfFlagged() {
    const p = new URLSearchParams(location.search);
    if (isTestExecutionPage() && p.get('tm_report') === '1' && !document.getElementById(IDS.modal)) {
      setTimeout(() => generateReport(), 300);
    }
  }
  function waitFor(check, timeout = 5000, interval = 100) {
    return new Promise((resolve) => {
      const start = Date.now();
      (function loop() {
        if (check()) return resolve(true);
        if (Date.now() - start >= timeout) return resolve(false);
        setTimeout(loop, interval);
      })();
    });
  }

  /* ================== init ================== */
  function init() {
    injectStyles();
    loadExecMetricConfig();
    quickSpin = 0;
    rearm();
    autoGenerateIfFlagged();
    if (isXrayReportListPage()) { heartbeatLeft = Math.max(heartbeatLeft, HEARTBEAT_BURST); extendHeartbeat(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // 调试导出
  window.__tm_generateReport = generateReport;
  window.__tm_forceRearm = () => { quickSpin = 0; rearm(); };
  window.__tm_configureDashboard = () => configureDashboard();

})();
