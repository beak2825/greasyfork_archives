// ==UserScript==
// @name         OKX 提币手续费 — 表内展示「手续费(USD)」
// @namespace    frankie.okx.withdrawal.usd.inline
// @version      1.1.2
// @description  解析 OKX 提币手续费表，按实时 USDT/USDC 行情折算美元，在表内新增一列「手续费(USD)」，支持多网络/多行对齐显示。
// @author       Frankie 
// @match        https://www.okx.com/*/fees/withdrawal-info*
// @match        https://www.okx.com/fees/withdrawal-info*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      www.okx.com
// @license      MIT License with Attribution
// @downloadURL https://update.greasyfork.org/scripts/552937/OKX%20%E6%8F%90%E5%B8%81%E6%89%8B%E7%BB%AD%E8%B4%B9%20%E2%80%94%20%E8%A1%A8%E5%86%85%E5%B1%95%E7%A4%BA%E3%80%8C%E6%89%8B%E7%BB%AD%E8%B4%B9%28USD%29%E3%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/552937/OKX%20%E6%8F%90%E5%B8%81%E6%89%8B%E7%BB%AD%E8%B4%B9%20%E2%80%94%20%E8%A1%A8%E5%86%85%E5%B1%95%E7%A4%BA%E3%80%8C%E6%89%8B%E7%BB%AD%E8%B4%B9%28USD%29%E3%80%8D.meta.js
// ==/UserScript==
 
// Additional clause:
// 1. Any redistribution or modification must retain the original donation link and cannot remove or modify it.

(function () {
  'use strict';

  GM_addStyle(`
    .okx-usd-refresh-btn {
      position: fixed; z-index: 999999; top: 14px; right: 14px;
      padding: 8px 12px; border-radius: 10px; cursor: pointer;
      border: 1px solid rgba(0,0,0,0.08); background: #fff; font-weight: 600;
      box-shadow: 0 6px 18px rgba(0,0,0,0.08);
      font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
    }
    .okx-usd-badge {
      display:inline-block; padding:2px 6px; border-radius:999px;
      background:#f5f5f5; font-size:11px; line-height:1;
      border:1px solid #eee;
    }
    .okx-usd-min {
      background:#e6ffed; color:#057a55; border-color:#c7f5d9;
    }
    .okx-usd-dim { opacity: .7; }
  `);

  // ========= 基础工具 =========
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function httpGetJSON(url) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (res) => {
          try { resolve(JSON.parse(res.responseText)); }
          catch { resolve(null); }
        },
        onerror: () => resolve(null),
        ontimeout: () => resolve(null),
      });
    });
  }

  // ========= 拉取价格：构建 baseSymbol => USD 价格 的映射 =========
  async function fetchPriceMap() {
    // 现货 tickers（包含 *-USDT、*-USDC、其他 quote）
    const url = 'https://www.okx.com/api/v5/market/tickers?instType=SPOT';
    const j = await httpGetJSON(url);
    const map = Object.create(null);
    if (!j || !Array.isArray(j.data)) {
      // 兜底：稳定币≈1
      map['USDT'] = 1; map['USDC'] = 1; map['DAI'] = 1;
      return map;
    }
    for (const t of j.data) {
      const instId = t.instId;  // e.g. "AAVE-USDT"
      const last = Number(t.last);
      if (!instId || !Number.isFinite(last)) continue;
      const [base, quote] = instId.split('-');
      const B = base?.toUpperCase?.() || '';
      const Q = quote?.toUpperCase?.() || '';
      if (!B || !Q) continue;

      // 以 USDT/USDC/DAI 计价的，直接近似为 USD
      if (Q === 'USDT' || Q === 'USDC' || Q === 'DAI') {
        // 多个报价时，优先 USDT，其次 USDC，再次 DAI（后者只在无前两者时覆盖）
        const prev = map[B];
        const rank = (q)=> ({USDT:3, USDC:2, DAI:1}[q] || 0);
        if (!prev || rank(Q) > (map[`__rank_${B}`]||0)) {
          map[B] = last;
          map[`__rank_${B}`] = rank(Q);
        }
      }
    }
    // 稳定币自身≈1
    map['USDT'] = 1;
    map['USDC'] = 1;
    map['DAI']  = 1;
    return map;
  }

  // ========= DOM 解析：找到表格并确定列索引 =========
  function findWithdrawalTable() {
    const tables = Array.from(document.querySelectorAll('table'));
    for (const tb of tables) {
      const headers = Array.from(tb.querySelectorAll('thead th'))
        .map(th => (th.textContent||'').trim());
      const hasAsset = headers.some(h => /(币种|资产|Symbol|Asset)/i.test(h));
      const hasNet   = headers.some(h => /(网络|链|Network|Chain)/i.test(h));
      const hasFee   = headers.some(h => /(网络费用|手续费|Fee)/i.test(h));
      if ((hasAsset || hasNet) && hasFee) return tb;
    }
    return null;
  }

  function getHeaderIndices(table) {
    const heads = Array.from(table.querySelectorAll('thead th')).map(th => (th.textContent||'').trim());
    const findIdx = (regs, fb) => {
      const i = heads.findIndex(h => regs.some(r => r.test(h)));
      return i >= 0 ? i : fb;
    };
    const idxSymbol = findIdx([/币种|Symbol|Asset/i], 0);
    const idxName   = findIdx([/币种名称|Name/i], 1);
    const idxNet    = findIdx([/网络|链|Network|Chain/i], 2);
    const idxMin    = findIdx([/最小提币数量|Minimum/i], 3);
    const idxFee    = findIdx([/网络费用|手续费|Fee/i], 4);
    return { idxSymbol, idxName, idxNet, idxMin, idxFee, heads };
  }

  // 从一个 <td> 抽取“每行一个值”的字符串数组（兼容一个格多个 <div>）
  function cellLines(td) {
    if (!td) return [];
    const divs = td.querySelectorAll('.index_contentItem__ELNFt, div');
    const lines = Array.from(divs).map(d => (d.textContent||'').trim()).filter(Boolean);
    if (lines.length === 0) {
      const t = (td.textContent||'').replace(/\s+/g,' ').trim();
      return t ? [t] : [];
    }
    return lines;
  }

  // ========= 在表头插入「手续费(USD)」列 =========
  function ensureUsdHeader(table, idxFee) {
    const theadRow = table.querySelector('thead tr');
    if (!theadRow) return;
    const heads = Array.from(theadRow.children).map(x=>x.textContent.trim());
    if (heads.some(h => /(手续费\(USD\)|Fee\(USD\))/i.test(h))) return; // 已存在

    const th = document.createElement('th');
    th.className = (theadRow.children[idxFee]?.className || '') + ' okx-usd-th';
    th.style.width = '200px';
    th.style.textAlign = 'center';
    th.textContent = '手续费(USD)';
    // 插入到“网络费用”后面
    if (theadRow.children[idxFee] && theadRow.children[idxFee].nextSibling) {
      theadRow.insertBefore(th, theadRow.children[idxFee].nextSibling);
    } else {
      theadRow.appendChild(th);
    }
  }

  // ========= 给每个数据行插入一个 USD <td> =========
  function ensureUsdCellForRow(tr, idxFee) {
    const tds = Array.from(tr.querySelectorAll('td'));
    if (!tds.length) return null;

    // 如果已经有“USD 列”，直接返回
    const heads = Array.from(tr.closest('table').querySelectorAll('thead th'))
      .map(th => (th.textContent||'').trim());
    const usdColIdx = heads.findIndex(h => /(手续费\(USD\)|Fee\(USD\))/i.test(h));
    if (usdColIdx < 0) return null;

    // 如果此行已有该列（长度>=usdColIdx+1），直接复用
    if (tds.length > usdColIdx) {
      const existing = tds[usdColIdx];
      existing.classList.add('okx-usd-td');
      return existing;
    }

    // 否则在“网络费用”td 后面插入一个
    const feeTd = tds[idxFee];
    const usdTd = document.createElement('td');
    usdTd.className = (feeTd?.className || '') + ' okx-usd-td';
    usdTd.style.width = '200px';
    usdTd.style.textAlign = 'center';

    if (feeTd && feeTd.nextSibling) tr.insertBefore(usdTd, feeTd.nextSibling);
    else tr.appendChild(usdTd);

    return usdTd;
  }

  // ========= 解析并计算：逐行填充 USD =========
  function guessSymbolFromCellText(text) {
    const m = (text||'').toUpperCase().match(/([A-Z0-9]{2,12})/);
    return m ? m[1] : (text||'').toUpperCase();
  }

  function parseNumberAndUnit(raw, fallbackUnit) {
    if (!raw) return { amount: null, unit: null };
    const m = raw.match(/([0-9]*\.?[0-9]+)\s*([A-Za-z0-9\-]+)?/);
    if (!m) return { amount: null, unit: null };
    const amount = Number(m[1]);
    const unit = (m[2] || fallbackUnit || '').toUpperCase().replace(/[^A-Z0-9]/g,'');
    return { amount: Number.isFinite(amount) ? amount : null, unit: unit || null };
  }

  function fmtUSD(x) {
    if (!Number.isFinite(x)) return '—';
    if (x === 0) return '$0';
    if (x >= 1) return '$' + x.toFixed(2).replace(/\.00$/,'');
    // 小于 1，给更多精度但去尾零
    let s = x.toFixed(8).replace(/0+$/,'').replace(/\.$/,'');
    return '$' + s;
  }

  async function calculateAndFill(table) {
    const { idxSymbol, idxNet, idxMin, idxFee } = getHeaderIndices(table);
    ensureUsdHeader(table, idxFee);

    const priceMap = await fetchPriceMap();
    const tbodyRows = Array.from(table.querySelectorAll('tbody tr'))
      .filter(tr => tr && !tr.matches('[aria-hidden="true"]'));

    // 预先抽取所有 feeUSD，找最小值用于高亮
    const perRowUsdValues = new Map(); // tr => [feeUSD...]
    const perRowUsdMins   = new Map(); // tr => minUSD

    for (const tr of tbodyRows) {
      const tds = Array.from(tr.querySelectorAll('td'));
      if (!tds.length) continue;

      const symCellText = (tds[idxSymbol]?.textContent || '').trim();
      const symbolGuess = guessSymbolFromCellText(symCellText);

      const networks = cellLines(tds[idxNet]);
      const mins     = cellLines(tds[idxMin]);
      const fees     = cellLines(tds[idxFee]);

      const maxLen = Math.max(networks.length || 0, mins.length || 0, fees.length || 0) || 1;
      const rowFeeUSDs = [];

      for (let i = 0; i < maxLen; i++) {
        const feeLine = (fees[i] ?? fees[0] ?? '').trim();
        if (!feeLine) { rowFeeUSDs.push(null); continue; }

        const { amount: feeAmount, unit: rawUnit } = parseNumberAndUnit(feeLine, symbolGuess);
        if (!Number.isFinite(feeAmount)) { rowFeeUSDs.push(null); continue; }

        const feeSym = (rawUnit || symbolGuess || '').toUpperCase();
        const px = priceMap[feeSym];  // 以 USDT/USDC/DAI 近似 USD
        const feeUSD = Number.isFinite(px) ? feeAmount * px : null;
        rowFeeUSDs.push(feeUSD);
      }
      perRowUsdValues.set(tr, rowFeeUSDs);
      perRowUsdMins.set(tr, rowFeeUSDs.filter(v => Number.isFinite(v)).sort((a,b)=>a-b)[0] ?? null);
    }

    // 再渲染到 DOM：为每个 tr 插入/更新 USD 列
    for (const tr of tbodyRows) {
      const usdTd = ensureUsdCellForRow(tr, idxFee);
      if (!usdTd) continue;

      const vals = perRowUsdValues.get(tr) || [];
      usdTd.innerHTML = ''; // 清空后重建

      // 如果“网络费用”格里是多行 <div>，我们也用多行对齐展示
      const feeTd = tr.querySelectorAll('td')[idxFee];
      const feeLines = cellLines(feeTd);
      const lineCount = Math.max(feeLines.length, vals.length) || 1;

      for (let i = 0; i < lineCount; i++) {
        const v = (vals[i] !== undefined) ? vals[i] : vals[0];
        const div = document.createElement('div');
        div.className = 'index_contentItem__ELNFt';
        const minForRow = perRowUsdMins.get(tr);
        const isMin = Number.isFinite(v) && Number.isFinite(minForRow) && v === minForRow;
        div.innerHTML = isMin
          ? `<span class="okx-usd-badge okx-usd-min">${fmtUSD(v)}</span>`
          : fmtUSD(v);
        usdTd.appendChild(div);
      }
    }
  }

  // ========= 入口：按钮 + 观察者（应对单页应用/路由切换） =========
  function ensureRefreshButton() {
    if (document.querySelector('.okx-usd-refresh-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'okx-usd-refresh-btn';
    btn.textContent = '↻ 刷新 USD 列';
    btn.title = '重新抓取行情并在表内重算手续费(USD)';
    btn.addEventListener('click', async () => {
      const tb = findWithdrawalTable();
      if (!tb) { alert('未找到手续费表。请确认在 OKX 提币手续费页面。'); return; }
      btn.disabled = true; btn.textContent = '计算中…';
      try { await calculateAndFill(tb); }
      finally { btn.disabled = false; btn.textContent = '↻ 刷新 USD 列'; }
    });
    document.body.appendChild(btn);
  }

  // 初次尝试加载
  async function bootstrapOnce() {
    ensureRefreshButton();
    for (let i=0;i<20;i++) {
      const tb = findWithdrawalTable();
      if (tb) {
        try { await calculateAndFill(tb); } catch {}
        break;
      }
      await sleep(500);
    }
  }

  // 监听 DOM 变化（应对路由切换 / 表格重绘）
  const mo = new MutationObserver(async (muts) => {
    if (muts.some(m => m.addedNodes && m.addedNodes.length)) {
      const tb = findWithdrawalTable();
      if (tb) {
        // 防止频繁触发：短暂防抖
        if (mo.__busy) return;
        mo.__busy = true;
        try { await calculateAndFill(tb); }
        finally { setTimeout(()=>{ mo.__busy = false; }, 400); }
      }
      ensureRefreshButton();
    }
  });

  // 启动
  bootstrapOnce();
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

// 等页面加载后执行功能逻辑
  window.addEventListener('load', main);

  // ========== 💰 Donate 徽章模块 ==========
  (function() {
    /**
     * 添加一个“Donate”徽章。
     * @param {HTMLElement|string|null} parent - 要插入的容器或选择器。默认右上角显示。
     * @param {Object} opts - 参数配置。
     */
    function addDonateBadge(parent = null, opts = {}) {
      const href = opts.href || 'https://github.com/FrankieeW/DonateME/blob/main/README.md';
      const text = opts.text || 'Donate ME';
      const color = opts.color || '000';
      const logo = opts.logo || 'tether';
      const style = opts.style || {};

      const badgeLink = document.createElement('a');
      badgeLink.href = href;
      badgeLink.target = '_blank';
      badgeLink.innerHTML = `<img src="https://img.shields.io/badge/${encodeURIComponent(text)}-${color}?logo=${encodeURIComponent(logo)}" alt="Donate me">`;

      // 默认样式
      badgeLink.style.display = 'block';
      badgeLink.style.marginTop = '5px';
      badgeLink.style.color = '#007BFF';
      badgeLink.style.textDecoration = 'none';
      badgeLink.style.fontSize = '12px';
      badgeLink.style.fontFamily = 'Arial, sans-serif';

      // 自定义样式合并
      for (const [k, v] of Object.entries(style)) badgeLink.style[k] = v;

      // 选择器转元素
      if (typeof parent === 'string') parent = document.querySelector(parent);

      // 未指定则默认右上角悬浮
      if (!parent) {
        parent = document.createElement('div');
        parent.style.position = 'fixed';
        parent.style.top = '10px';
        parent.style.right = '10px';
        parent.style.zIndex = '999999';
        document.body.appendChild(parent);
      }

      parent.appendChild(badgeLink);
      return badgeLink;
    }

    // 全局暴露
    window.addDonateBadge = addDonateBadge;

    // 默认立即在右上角插入一个 Donate 徽章
    addDonateBadge(null, {
      text: 'Donate Frankie',
      logo: 'tether',
      color: '000'
    });
  })();
})();


