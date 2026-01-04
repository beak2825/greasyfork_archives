// ==UserScript==
// @name         Amazon亚马逊业务报告批量下载（自用）
// @version      1.0.1
// @description  批量下载/导出 Business Reports（按日/按月），修复匹配域名、接口、权限与 UI 注入失效问题
// @author       Haer
// @license      MI
// == 匹配规则（注意 /business-reports/ 为复数）==
// 你可只保留自己常用的站点
// @match        https://sellercentral.amazon.com/business-reports/*
// @match        https://sellercentral.amazon.co.uk/business-reports/*
// @match        https://sellercentral.amazon.de/business-reports/*
// @match        https://sellercentral.amazon.co.jp/business-reports/*
// @match        https://sellercentral.amazon.ca/business-reports/*
// @match        https://sellercentral.amazon.com.mx/business-reports/*
//
// == 权限 ==
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      sellercentral.amazon.com
// @connect      sellercentral.amazon.co.uk
// @connect      sellercentral.amazon.de
// @connect      sellercentral.amazon.co.jp
// @connect      sellercentral.amazon.ca
// @connect      sellercentral.amazon.com.mx
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/notice-tampermonkey@0.4.0/index.js
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1124651
// @downloadURL https://update.greasyfork.org/scripts/557866/Amazon%E4%BA%9A%E9%A9%AC%E9%80%8A%E4%B8%9A%E5%8A%A1%E6%8A%A5%E5%91%8A%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557866/Amazon%E4%BA%9A%E9%A9%AC%E9%80%8A%E4%B8%9A%E5%8A%A1%E6%8A%A5%E5%91%8A%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ====== 配置 ======
  const SERVER = 'https://xxxxx.org/report'; // TODO：如需“导入数据库”，改成你的后端地址
  const API_URL = `${location.origin}/business-reports/api`;

  // ====== 基础请求封装 ======
  function requestJSON(url, method, bodyObj) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method,
        data: bodyObj ? JSON.stringify(bodyObj) : undefined,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        onload: (xhr) => {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (_e) {
            resolve(xhr.responseText); // 兼容 CSV 文本
          }
        },
        onerror: (e) => reject(e)
      });
    });
  }
  function requestText(url, method = 'GET') {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url,
        method,
        onload: (xhr) => resolve(xhr.responseText),
        onerror: (e) => reject(e)
      });
    });
  }

  // ====== GraphQL ======
  async function getColumns(legacyReportId) {
    const body = {
      operationName: 'reportDataQuery',
      variables: { input: { legacyReportId } },
      query: `
        query reportDataQuery($input: GetReportDataInput) {
          getReportData(input: $input) {
            columns { translationKey }
          }
        }
      `
    };
    const res = await requestJSON(API_URL, 'POST', body);
    const cols = res?.data?.getReportData?.columns || [];
    return cols.map(c => c.translationKey);
  }

  async function getDownloadUrl({ legacyReportId, startDate, endDate, selectedColumns }) {
    const body = {
      operationName: 'reportDataDownloadQuery',
      variables: {
        input: {
          legacyReportId,
          startDate,
          endDate,
          userSelectedRows: [],
          selectedColumns
        }
      },
      query: `
        query reportDataDownloadQuery($input: GetReportDataInput) {
          getReportDataDownload(input: $input) { url }
        }
      `
    };
    const res = await requestJSON(API_URL, 'POST', body);
    return res?.data?.getReportDataDownload?.url || '';
  }

  // ====== 日期工具 ======
  function getdiffdate(stime, etime) {
    const out = [];
    let cur = stime;
    while (cur <= etime) {
      out.push(cur);
      const t = new Date(cur).getTime() + 24 * 60 * 60 * 1000;
      const y = new Date(t).getFullYear();
      const m = String(new Date(t).getMonth() + 1).padStart(2, '0');
      const d = String(new Date(t).getDate()).padStart(2, '0');
      cur = `${y}-${m}-${d}`;
    }
    return out;
  }
  function getLastDayOfMonth(year, month) {
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + 1);
    const last = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    const m = String(month).padStart(2, '0');
    const d = String(last.getDate()).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }
  function getMonthList(startDay, endDay) {
    const list = [];
    let [sy, sm] = startDay.split('-').map(n => parseInt(n, 10));
    const [ey, em] = endDay.split('-').map(n => parseInt(n, 10));
    while (sy < ey || (sy === ey && sm <= em)) {
      const mm = String(sm).padStart(2, '0');
      const start = `${sy}-${mm}-01`;
      const end = (sy === ey && sm === em) ? endDay : getLastDayOfMonth(sy, sm);
      list.push({ name: `${sy}-${mm}`, start, end });
      sm++;
      if (sm > 12) { sy++; sm = 1; }
    }
    return list;
  }
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // ====== 页面取值 ======
  function getAccountNameFallback() {
    const el = document.querySelector('.partner-dropdown-button');
    if (el && el.textContent) {
      return el.textContent.replace(/\s+/g, '').replaceAll('|', '_');
    }
    return (document.title || location.hostname).replace(/\s+/g, '_');
  }

  async function getDateRange() {
    // 1) 直接找形如 MM/DD/YYYY 的文本输入（KAT 日期控件常见）
    let inputs = Array.from(document.querySelectorAll('input[type="text"]'))
      .filter(i => /\d{2}\/\d{2}\/\d{4}/.test(i.value));
    if (inputs.length >= 2) {
      const [a, b] = inputs;
      const toISO = v => { const [mm, dd, yyyy] = v.split('/'); return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`; };
      return { startDate: toISO(a.value), endDate: toISO(b.value) };
    }
    // 2) 兼容旧 class
    const legacy = document.querySelectorAll('.css-jfggi0');
    if (legacy?.length >= 2) {
      const toISO = v => v.replaceAll('/', '-');
      return { startDate: toISO(legacy[0].value), endDate: toISO(legacy[1].value) };
    }
    // 3) 从 URL 取（若存在）
    const u = new URL(location.href);
    const start = u.searchParams.get('startDate');
    const end = u.searchParams.get('endDate');
    if (start && end) return { startDate: start, endDate: end };

    throw new Error('未能自动识别日期，请先在页面选择日期范围后再点击按钮。');
  }

  function getLegacyReportId() {
    // 兼容 hash 与 search 的 id=102:DetailSalesTrafficByChildItem
    const raw = decodeURIComponent((new URL(location.href)).hash || (new URL(location.href)).search || '');
    const id = raw.split('id=')[1]?.split('&')[0];
    return id || '102:DetailSalesTrafficByChildItem';
  }

  // ====== 主流程 ======
  async function runDownload(taskList, method = 'down') {
    const account = getAccountNameFallback();
    const legacyReportId = getLegacyReportId();
    const columns = await getColumns(legacyReportId);

    for (const task of taskList) {
      const url = await getDownloadUrl({
        legacyReportId,
        startDate: task.start,
        endDate: task.end,
        selectedColumns: columns
      });

      if (!url) {
        new NoticeJs({ text: `获取下载链接失败：${task.name}`, position: 'topRight', type: 'error' }).show();
        continue;
      }

      if (method === 'down') {
        GM_download(url, `${account}_${task.name}.csv`);
      } else {
        const csvText = await requestText(url, 'GET');
        const pushBody = { account, startDate: task.start, endDate: task.end, reportData: csvText };
        await requestJSON(SERVER, 'POST', pushBody).catch(() => {
          new NoticeJs({ text: '上传服务器失败（已忽略）', position: 'topRight', type: 'warning' }).show();
        });
      }

      new NoticeJs({ text: `已处理：${account} ${task.name}`, position: 'topRight' }).show();
      await sleep(1000); // 节流
    }
  }

  async function dayReport(method = 'down') {
    const { startDate, endDate } = await getDateRange();
    const days = getdiffdate(startDate, endDate);
    const tasks = days.map(d => ({ name: d, start: d, end: d }));
    await runDownload(tasks, method);
  }

  async function monthReport() {
    const { startDate, endDate } = await getDateRange();
    const tasks = getMonthList(startDate, endDate);
    await runDownload(tasks, 'down');
  }

  // ====== UI 注入（增强）：优先插入到工具栏；失败则右下角悬浮面板 ======
  async function injectUI() {
    if (document.getElementById('amz-report-toolbox')) return;

    function getButtonContainerSync() {
      const sels = [
        'kat-action-bar',
        '[data-test-id="metrics-action-bar"]',
        '.css-1lafdix',               // 兼容旧选择器
        '.business-reports-header'
      ];
      for (const s of sels) {
        const el = document.querySelector(s);
        if (el) return el;
      }
      return null;
    }

    const mkBtn = (label, onClick) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.style.padding = '6px 10px';
      b.style.border = '1px solid #ccc';
      b.style.borderRadius = '6px';
      b.style.cursor = 'pointer';
      b.style.background = '#fff';
      b.style.fontSize = '12px';
      b.addEventListener('click', onClick);
      return b;
    };

    const makeButtons = () => {
      const wrap = document.createElement('div');
      wrap.id = 'amz-report-toolbox';
      wrap.style.display = 'flex';
      wrap.style.gap = '8px';
      wrap.appendChild(mkBtn('下载每日 (.csv)', () => dayReport('down')));
      wrap.appendChild(mkBtn('下载每月 (.csv)', () => monthReport()));
      // 仅在 SKU 页显示“导入数据库”；若想一直显示，把下面判断去掉即可
      if (location.href.includes('DetailSalesTrafficBySKU')) {
        wrap.appendChild(mkBtn('每日（导入数据库）', () => dayReport('post')));
      }
      return wrap;
    };

    const container = getButtonContainerSync();
    if (container) {
      container.appendChild(makeButtons());
    } else {
      // 兜底悬浮面板
      const panel = document.createElement('div');
      panel.id = 'amz-report-toolbox';
      panel.style.position = 'fixed';
      panel.style.right = '16px';
      panel.style.bottom = '16px';
      panel.style.padding = '10px';
      panel.style.background = 'rgba(255,255,255,0.98)';
      panel.style.border = '1px solid #ddd';
      panel.style.borderRadius = '10px';
      panel.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
      panel.style.zIndex = '999999';
      panel.style.display = 'flex';
      panel.style.gap = '8px';
      panel.style.flexWrap = 'wrap';

      // 可拖动
      let dragging = false, startX = 0, startY = 0, startRight = 0, startBottom = 0;
      panel.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        startRight = parseInt(getComputedStyle(panel).right, 10);
        startBottom = parseInt(getComputedStyle(panel).bottom, 10);
        e.preventDefault();
      });
      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        panel.style.right = (startRight - dx) + 'px';
        panel.style.bottom = (startBottom - dy) + 'px';
      });
      window.addEventListener('mouseup', () => dragging = false);

      panel.appendChild(mkBtn('下载每日 (.csv)', () => dayReport('down')));
      panel.appendChild(mkBtn('下载每月 (.csv)', () => monthReport()));
      if (location.href.includes('DetailSalesTrafficBySKU')) {
        panel.appendChild(mkBtn('每日（导入数据库）', () => dayReport('post')));
      }

      document.body.appendChild(panel);
    }
  }

  // ====== 监听 SPA 路由变化（hash/history）并重注入 ======
  (function hookRouteChange() {
    const reInject = () => {
      const old = document.getElementById('amz-report-toolbox');
      if (old) old.remove();
      injectUI().catch(()=>{});
    };
    window.addEventListener('hashchange', reInject);
    const _push = history.pushState;
    history.pushState = function() {
      const ret = _push.apply(this, arguments);
      setTimeout(reInject, 80);
      return ret;
    };
    const _replace = history.replaceState;
    history.replaceState = function() {
      const ret = _replace.apply(this, arguments);
      setTimeout(reInject, 80);
      return ret;
    };
    // 初次注入
    injectUI().catch(()=>{});
  })();

})();
