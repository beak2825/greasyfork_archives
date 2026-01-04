// ==UserScript==
// @name         JING Downloader
// @namespace    https://example.com/userscripts
// @version      1.2.1
// @description  右下角“下载简介”按钮：抓公司简介/概况，合并列表导出 XLSX；“来源”保留超链；“来源链接”明文且固定在最后一列。
// @author       You
// @match        *://*.jingdata.com/*
// @match        *://jingdata.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554757/JING%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/554757/JING%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* =============== 样式 & 按钮 =============== */
  GM_addStyle(`
    .dl-intro-btn {
      position: fixed; right: 24px; bottom: 24px; z-index: 2147483647;
      display: inline-flex; align-items: center; gap: 8px;
      height: 44px; padding: 0 16px; border-radius: 999px;
      background: linear-gradient(135deg, rgba(99,102,241,.9), rgba(59,130,246,.9));
      color: #fff; font-size: 14px; font-weight: 600; letter-spacing: .5px;
      box-shadow: 0 10px 30px rgba(59,130,246,.35), 0 2px 6px rgba(0,0,0,.12);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,.25);
      cursor: pointer; user-select: none; transition: transform .08s ease, box-shadow .2s ease;
    }
    .dl-intro-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 34px rgba(59,130,246,.45), 0 3px 8px rgba(0,0,0,.14); }
    .dl-intro-btn__dot { width: 8px; height: 8px; border-radius: 999px; background: #fff; opacity: .9; box-shadow: 0 0 0 6px rgba(255,255,255,.18); }
  `);

  if (!document.querySelector('.dl-intro-btn')) {
    const btn = document.createElement('button');
    btn.className = 'dl-intro-btn';
    btn.title = '下载当前页公司“公司简介/公司概况”并导出为 XLSX（含来源链接）';
    btn.innerHTML = `<span class="dl-intro-btn__dot"></span><span>下载简介</span>`;
    btn.addEventListener('click', async () => {
      btn.disabled = true; btn.style.opacity = .8;
      try { await runDownloadIntro(); }
      catch (e) { console.error('[下载简介] 出错：', e); alert('下载失败：' + (e && e.message || e)); }
      finally { btn.disabled = false; btn.style.opacity = 1; }
    });
    document.body.appendChild(btn);
  }

  /* =============== 主逻辑函数 =============== */
  async function runDownloadIntro() {
    const STRICT_NAME_LINKS = '#__main_layout__ > div > div > div.main-layout-scroll-container.el-scrollbar__wrap > div > div > div > div.layout-main-content > div > div.data-panel > div.panel-body > div > div.panel-body-scroll-wrapper.el-scrollbar__wrap > div > div > div > div.table-wrapper > div.insight-data-table.table-wrapper > div.vxe-table.vxe-table--render-default.tid_36.size--mini.border--full.row--highlight.is--header.is--fixed-left.is--scroll-x.__insight-data-table__.theme-full > div.vxe-table--render-wrapper > div.vxe-table--fixed-wrapper > div > div.vxe-table--body-wrapper.fixed-left--wrapper > table > tbody a.tag-router-link';
    const FALLBACK_NAME_LINKS = '.vxe-table--body-wrapper.fixed-left--wrapper > table > tbody a.tag-router-link';
    const LEFT_TBODY  = '.vxe-table--body-wrapper.fixed-left--wrapper > table > tbody';
    const MAIN_TBODY  = '.vxe-table--body-wrapper:not(.fixed-left--wrapper):not(.fixed-right--wrapper) > table > tbody';
    const MAIN_HEADER = '.vxe-table--header-wrapper:not(.fixed-left--wrapper):not(.fixed-right--wrapper) thead tr th';

    const XLSX_CDN     = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    const OUTPUT_FILE  = 'table.xlsx';
    const OUTPUT_SHEET = 'Sheet1';

    const INTRO_LABELS = ['公司简介', '公司概况'];
    const INTRO_ROW_MAX_WAIT_MS = 3000;       // 简介/概况最多等 3s
    const WAIT_DETAIL_BASE_TIMEOUT = 10000;   // 详情基础结构最多等 10s

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const log = (...a) => console.log('[merge-export]', ...a);
    const norm = s => (s || '').replace(/\s+/g,'').replace(/\(\d+\)$/,'').trim();

    async function waitForTrue(fn, timeout = 15000, interval = 200, label = 'wait') {
      const t0 = Date.now();
      while (Date.now() - t0 < timeout) {
        try { const v = await fn(); if (v) return v; } catch(_) {}
        await sleep(interval);
      }
      throw new Error(`${label} 超时(${timeout}ms)`);
    }
    async function ensureXLSX() {
      if (window.XLSX) return;
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = XLSX_CDN;
        s.onload = res;
        s.onerror = () => rej(new Error('XLSX 加载失败（可能 CSP 拦了）'));
        document.head.appendChild(s);
      });
    }
    function clickEl(el){
      if (!el) return;
      try { el.scrollIntoView({ block: 'center' }); } catch(_) {}
      try { el.click(); return; } catch(_) {}
      el.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, view:window }));
    }

    function collectNameTargets() {
      let nodes = Array.from(document.querySelectorAll(STRICT_NAME_LINKS));
      if (!nodes.length) nodes = Array.from(document.querySelectorAll(FALLBACK_NAME_LINKS));
      const seen = new Set(); const out = [];
      for (const a of nodes) {
        const name = (a.textContent || '').trim();
        if (!name || seen.has(name)) continue;
        seen.add(name); out.push({ name, el: a });
      }
      return out;
    }
    function getMainHeaderNames() {
      let names = Array.from(document.querySelectorAll(MAIN_HEADER))
        .map(th => (th.innerText || '').replace(/\s+/g,' ').trim())
        .filter(Boolean);
      const seen = new Map();
      names = names.map(n => { const c=(seen.get(n)||0)+1; seen.set(n,c); return c===1?n:`${n}(${c})`; });
      return names;
    }
    function getMainRows() {
      const tbody = document.querySelector(MAIN_TBODY);
      return tbody ? Array.from(tbody.querySelectorAll('tr')) : [];
    }
    function parseMainRowTextsAndLinksAligned(tr, headerLen) {
      const tds = Array.from(tr.querySelectorAll('td,.vxe-body--column'));
      const texts = tds.map(td => (td.innerText || '').replace(/\s+\n/g,'\n').trim());
      const links = tds.map(td => {
        const a = td.querySelector('a[href]'); if (!a) return '';
        try { return new URL(a.getAttribute('href'), location.href).href; } catch { return ''; }
      });
      if (headerLen > 0) {
        if (texts.length > headerLen) return { texts: texts.slice(texts.length-headerLen), links: links.slice(links.length-headerLen) };
        if (texts.length < headerLen) {
          const pad = headerLen - texts.length;
          return { texts: texts.concat(Array(pad).fill('')), links: links.concat(Array(pad).fill('')) };
        }
      }
      return { texts, links };
    }

    async function waitForDetailBase() {
      await waitForTrue(() => document.querySelector('td.label-cell, td.content-cell, .max-row-content'),
        WAIT_DETAIL_BASE_TIMEOUT, 250, '详情基本块');
    }
    async function waitIntroRowUpTo(ms) {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) { if (hasIntroOrOverviewRow()) return true; await sleep(200); }
      return false;
    }
    function hasIntroOrOverviewRow() {
      const rows = Array.from(document.querySelectorAll('tr'));
      return rows.some(tr => {
        const label = tr.querySelector('td.label-cell');
        const txt = (label && label.textContent || '').trim();
        return INTRO_LABELS.includes(txt);
      });
    }
    function extractIntroOrOverviewOnce() {
      const rows = Array.from(document.querySelectorAll('tr'));
      for (const tr of rows) {
        const label = tr.querySelector('td.label-cell'); if (!label) continue;
        const txt = (label.textContent || '').trim(); if (!INTRO_LABELS.includes(txt)) continue;
        const contentTd = tr.querySelector('td.content-cell') || label.nextElementSibling; if (!contentTd) break;
        const expand = Array.from(contentTd.querySelectorAll('button,a,span')).find(x => /展开|更多/.test((x.textContent || '').trim()));
        if (expand) { try { expand.click(); } catch(_) {} }
        const contentDiv = contentTd.querySelector('.max-row-content');
        let t = (contentDiv ? contentDiv.textContent : contentTd.textContent) || '';
        return t.replace(/\s+/g,' ').trim();
      }
      const blk = Array.from(document.querySelectorAll('div,section,article,td,li,p'))
        .find(el => /(公司简介|公司概况)/.test(el.innerText || ''));
      if (blk) {
        const raw = blk.innerText.replace(/\s+/g,' ').trim();
        const m = raw.match(/(公司简介|公司概况)[:：]?\s*(.+)/);
        return (m && m[2]) ? m[2].trim() : raw;
      }
      return '';
    }
    async function backToTrading() {
      const tab = Array.from(document.querySelectorAll('.tags-view-item .tag-name, .tag-name'))
        .find(el => (el.textContent || '').trim() === '交易');
      if (tab) {
        clickEl(tab);
        await waitForTrue(() => document.querySelector(LEFT_TBODY) && document.querySelector(MAIN_TBODY), 20000, 250, '返回列表');
        await sleep(300); return;
      }
      history.back();
      await waitForTrue(() => document.querySelector(LEFT_TBODY) && document.querySelector(MAIN_TBODY), 20000, 250, '返回列表(history)');
      await sleep(300);
    }

    async function ensureXlsxAndExportWithSourceLink(rows, finalHeader, mainHeaders, linksMatrix, file, sheet, sourceIdxInMain) {
      await ensureXLSX();
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows, { header: finalHeader });

      // 给“来源”列写超链接（“来源链接”列是纯文本，已在 rows 中写好并位于最后）
      if (sourceIdxInMain >= 0) {
        const finalSourceIdx = 2 + sourceIdxInMain; // 因为前面有“公司名称”“公司简介”
        for (let i = 0; i < rows.length; i++) {
          const url = (linksMatrix[i] && linksMatrix[i][sourceIdxInMain]) || '';
          if (!url) continue;
          const r = 1 + i; // 数据从第1行
          const c = finalSourceIdx;
          const addr = XLSX.utils.encode_cell({ r, c });
          if (!ws[addr]) ws[addr] = { t: 's', v: rows[i][finalHeader[c]] || '' };
          ws[addr].l = { Target: url, Tooltip: ws[addr].v || '来源' };
        }
      } else {
        log('提醒：本页主表头里没找到“来源”列。');
      }

      XLSX.utils.book_append_sheet(wb, ws, sheet);
      XLSX.writeFile(wb, file);
    }

    /* ===================== 主流程 ===================== */
    try {
      await waitForTrue(() => document.querySelector(LEFT_TBODY) && document.querySelector(MAIN_TBODY), 15000, 200, '列表就绪');

      const mainHeaders = getMainHeaderNames();               // 动态主表头（已去重）
      const sourceIdxInMain = mainHeaders.findIndex(h => norm(h) === '来源');

      // 最终导出表头：固定把“来源链接”放到最后一列
      const finalHeader = ['公司名称', '公司简介', ...mainHeaders, '来源链接'];

      log('主表头列：', mainHeaders);

      const nameTargets = collectNameTargets();
      const mainRows    = getMainRows();
      const n = Math.min(nameTargets.length, mainRows.length);
      log(`本页准备处理：${n} 条（名称 ${nameTargets.length} / 主表 ${mainRows.length}）`);

      // 先拼静态数据并记录每格链接
      const rows = [];
      const linksMatrix = []; // linksMatrix[i][colIdx in mainHeaders] = href
      for (let i=0;i<n;i++){
        const name = nameTargets[i].name;
        const { texts, links } = parseMainRowTextsAndLinksAligned(mainRows[i], mainHeaders.length);
        const obj = { '公司名称': name, '公司简介': '' };
        // 主表头列
        mainHeaders.forEach((col, idx) => { obj[col] = texts[idx] ?? ''; });
        // “来源链接”写在最后一列（若识别到来源索引）
        obj['来源链接'] = (sourceIdxInMain >= 0 ? (links[sourceIdxInMain] || '') : '');
        rows.push(obj);
        linksMatrix.push(links);
      }

      // 逐个进入详情页抓“公司简介/公司概况”（最多等 3 秒）
      for (let i=0;i<n;i++){
        const { name, el } = nameTargets[i];
        log(`\n=== (${i+1}/${n}) 进入：${name} ===`);
        clickEl(el);
        try { await waitForDetailBase(); } catch(e){ log('详情基础等待异常，继续：', e.message || e); }

        const foundIntro = await waitIntroRowUpTo(INTRO_ROW_MAX_WAIT_MS);
        const intro = foundIntro ? extractIntroOrOverviewOnce() : '';
        if (!foundIntro) log('【提示】未找到“公司简介/公司概况”，已在 3 秒后跳过。');

        log(`【调试】简介/概况长度：${(intro||'').length}`);
        log(`【调试】前120字：${(intro||'').slice(0,120)}`);
        rows[i]['公司简介'] = intro || '';

        await backToTrading();
        await sleep(200);
      }

      // 导出（“来源”写超链；“来源链接”为末列纯文本）
      await ensureXlsxAndExportWithSourceLink(rows, finalHeader, mainHeaders, linksMatrix, OUTPUT_FILE, OUTPUT_SHEET, sourceIdxInMain);

      console.log('\n=== 导出完成（来源链接置末列；简介/概况择一；无则 3 秒跳过） ===');
      console.table(rows);
    } catch (err) {
      console.error('脚本异常：', err);
      alert(err.message || err);
    }
  }
})();
