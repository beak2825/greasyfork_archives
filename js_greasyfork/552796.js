// ==UserScript==
// @name         Binance DOM alpha自动交易1.0
// @namespace    https://your-namespace
// @version      0.1.0
// @description  Read balance/price -> fill buy price/total -> ensure reverse checked -> fill sell price -> click buy -> confirm
// @match        *://*.binance.com/*
// @include      *://*.binance.com/*
// @run-at       document-start
// @all-frames   true
// @inject-into  content
// @grant        GM_xmlhttpRequest
// @connect      script-auth-api.vercel.app
// @connect      vercel.app
// @downloadURL https://update.greasyfork.org/scripts/552796/Binance%20DOM%20alpha%E8%87%AA%E5%8A%A8%E4%BA%A4%E6%98%9310.user.js
// @updateURL https://update.greasyfork.org/scripts/552796/Binance%20DOM%20alpha%E8%87%AA%E5%8A%A8%E4%BA%A4%E6%98%9310.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Hard gate by hostname to avoid running elsewhere when using broad @match
  if (!location.hostname.includes('binance.com')) {
    // Uncomment to debug injection on other pages
    // console.debug('[AutoTrader] skipped, host=', location.hostname);
    return;
  }
  console.debug('[AutoTrader] injected on', location.href, 'state=', document.readyState);

  // TEMP: debug alert to verify injection; set to false to disable
  const DEBUG_ALERT_ON_INJECT = false;
  if (DEBUG_ALERT_ON_INJECT && typeof alert === 'function') {
    try { alert('Tampermonkey injected: ' + location.hostname); } catch (_) {}
  }

  // ===== Activation / License =====
  const AUTH = {
    // 将此地址替换为你部署到 Vercel 的接口地址
    apiUrl: 'https://script-auth-api.vercel.app/api/verify',
    storageKey: '__auto_trader_activation_v1',
    ok: false
  };
  function readActivation() {
    try { return JSON.parse(localStorage.getItem(AUTH.storageKey) || 'null'); } catch (_) { return null; }
  }
  function saveActivation(obj) {
    try { localStorage.setItem(AUTH.storageKey, JSON.stringify(obj || null)); } catch (_) {}
  }
  function formatExpiry(ts) {
    try {
      const n = Number(ts);
      if (!isFinite(n) || n <= 0) return '-';
      const d = new Date(n);
      return d.toLocaleString();
    } catch (_) { return '-'; }
  }
  function isActivationValid(rec) {
    if (!rec || !rec.token || !rec.expiresAt) return false;
    const now = Date.now();
    return Number(rec.expiresAt) - now > 5000; // 预留5秒缓冲
  }
  async function verifyActivationCode(code) {
    // 优先使用 GM_xmlhttpRequest 以绕过站点 CSP/跨域限制
    if (typeof GM_xmlhttpRequest === 'function') {
      return new Promise((resolve) => {
        try {
          GM_xmlhttpRequest({
            method: 'POST',
            url: AUTH.apiUrl,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ code, host: location.host, ua: navigator.userAgent, deviceId: getOrCreateDeviceId() }),
            onload: (resp) => {
              try {
                if (resp.status < 200 || resp.status >= 300) return resolve({ ok: false, msg: 'HTTP ' + resp.status });
                const data = JSON.parse(resp.responseText || '{}');
                // 兼容多种返回字段：expiresAt(毫秒) / expires(YYYY-MM-DD) / exp
                let expRaw = data && (data.expiresAt ?? data.expires ?? data.exp);
                let expMs = undefined;
                if (expRaw != null) {
                  if (typeof expRaw === 'number') { expMs = expRaw; }
                  else if (typeof expRaw === 'string') {
                    if (/^\d+$/.test(expRaw)) { expMs = Number(expRaw); }
                    else { expMs = new Date(expRaw.length === 10 ? expRaw + 'T23:59:59Z' : expRaw).getTime(); }
                  }
                }
                const expText = data && data.expiresText;
                if (data && data.ok && data.token && (expMs || expText)) return resolve({ ok: true, token: data.token, expiresAt: expMs, expiresText: expText });
                resolve({ ok: false, msg: data && data.message });
              } catch (e) { resolve({ ok: false, msg: 'Parse error' }); }
            },
            onerror: () => resolve({ ok: false, msg: 'Network error' }),
            ontimeout: () => resolve({ ok: false, msg: 'Timeout' }),
            timeout: 10000
          });
        } catch (e) {
          resolve({ ok: false, msg: String(e && e.message || e) });
        }
      });
    }
    // 回退到 fetch
    try {
      const res = await fetch(AUTH.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, host: location.host, ua: navigator.userAgent, deviceId: getOrCreateDeviceId() })
      });
      if (!res.ok) return { ok: false };
      const data = await res.json().catch(() => ({}));
      if (data && data.ok && data.token && data.expiresAt) {
        return { ok: true, token: data.token, expiresAt: data.expiresAt };
      }
      return { ok: false, msg: data && data.message };
    } catch (e) {
      return { ok: false, msg: String(e && e.message || e) };
    }
  }
  function ensureAuthorized() {
    if (AUTH.ok) return true;
    const cached = readActivation();
    if (isActivationValid(cached)) {
      AUTH.ok = true;
      return true;
    }
    return false;
  }

  const SEL = {
    // 更稳：限定父级含 flex items-center justify-between
    lastPrice: 'div.flex.items-center.justify-between[role="gridcell"] > div.flex-1.cursor-pointer:nth-child(2)',
    // 旧余额选择器不可靠，保留作兜底；实际读取改用 getAvailableUSDT()
    balanceUSDT: 'div.text-PrimaryText.text-\\[12px\\].leading-\\[18px\\].font-\\[500\\]',
    buyPriceInput: 'input.bn-textField-input#limitPrice[placeholder="0.00000000"]',
    buyTotalInput: 'input.bn-textField-input#limitTotal[placeholder="最小 0.1"]',
    reverseCheckbox: 'div.bn-checkbox[role="checkbox"]',
    sellLimitInput: 'input.bn-textField-input#limitTotal[placeholder="限价卖出"]',
    buyButton: 'button.bn-button.bn-button__buy.data-size-middle.w-full',
    confirmButton: 'button.bn-button.bn-button__primary.w-full.mt-\\[16px\\].h-\\[48px\\]',
    // 当前代币标题
    currentSymbolTitle: 'div.text-\\[20px\\].font-\\[600\\].leading-\\[24px\\].text-PrimaryText'
  };

  // 代币搜索与选择
  const TOKEN = {
    // 搜索输入框（你提供的DOM）
    searchInput: 'input.bn-textField-input[aria-label="代币名称或合约地址"][placeholder="代币名称或合约地址"]',
    // 搜索结果中的代币元素（以代币简称匹配，比如 AOP）
    resultItemBySymbol: (symbol) => `div.t-body3.text-PrimaryText.whitespace-nowrap.flex.items-center:has(:scope > svg)`,
    // 结果列表容器（可选，若不稳定可不使用）
    resultListContainer: null
  };

  const CFG = {
    buyPriceOffsetPct: 0.0,
    // 买价模式: 'pct' 百分比偏移 或 'tail_add' 尾数随机加
    buyPriceMode: 'tail_add',
    buyTailAddMin: 11800,
    buyTailAddMax: 12000,
    // 卖价模式: 'pct' 百分比偏移 或 'tail_subtract' 尾数随机减
    sellMode: 'tail_subtract',
    sellPriceOffsetPct: 0.002,
    sellTailSubtractMin: 22000,
    sellTailSubtractMax: 28000,
    minTotalUSDT: 0.1,
    stepDelayMs: 120,
    afterClickDelayMs: 200,
    autoRunOnLoad: false
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const getEl = (sel) => sel ? document.querySelector(sel) : null;
  const getEls = (sel) => sel ? Array.from(document.querySelectorAll(sel)) : [];

  // 生成/读取本地设备ID，用于服务端设备绑定
  function getOrCreateDeviceId() {
    const KEY = '__auto_trader_device_id_v1';
    try {
      let id = localStorage.getItem(KEY);
      if (id && id.length > 0) return id;
      // 简易 UUID
      id = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
      localStorage.setItem(KEY, id);
      return id;
    } catch (_) {
      return 'dev-' + Math.random().toString(36).slice(2);
    }
  }

  // ===== Persistence helpers =====
  const STORAGE_KEY_STATE = '__auto_trader_state_v1';
  const STORAGE_KEY_LOG = '__auto_trader_log_v1';
  function saveState() {
    try {
      const toSave = {
        successCount: STATE.successCount,
        tradeMinUSDT: STATE.tradeMinUSDT,
        tradeMaxUSDT: STATE.tradeMaxUSDT,
        initialAvailableUSDT: STATE.initialAvailableUSDT,
        cumulativeVolumeUSDT: STATE.cumulativeVolumeUSDT,
        cumulativeLossUSDT: STATE.cumulativeLossUSDT,
        waitMinMs: STATE.waitMinMs,
        waitMaxMs: STATE.waitMaxMs,
        intervalMs: STATE.intervalMs,
        targetSymbol: STATE.targetSymbol,
        tradesCount: STATE.tradesCount
      };
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(toSave));
    } catch (_) {}
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STATE);
      if (!raw) return;
      const obj = JSON.parse(raw);
      if (obj && typeof obj === 'object') {
        if (isFinite(obj.successCount)) STATE.successCount = obj.successCount;
        if (obj.tradeMinUSDT != null && isFinite(obj.tradeMinUSDT)) STATE.tradeMinUSDT = obj.tradeMinUSDT;
        if (obj.tradeMaxUSDT != null && isFinite(obj.tradeMaxUSDT)) STATE.tradeMaxUSDT = obj.tradeMaxUSDT;
        if (obj.initialAvailableUSDT != null && isFinite(obj.initialAvailableUSDT)) STATE.initialAvailableUSDT = obj.initialAvailableUSDT;
        if (obj.cumulativeVolumeUSDT != null && isFinite(obj.cumulativeVolumeUSDT)) STATE.cumulativeVolumeUSDT = obj.cumulativeVolumeUSDT;
        if (obj.cumulativeLossUSDT != null && isFinite(obj.cumulativeLossUSDT)) STATE.cumulativeLossUSDT = obj.cumulativeLossUSDT;
        if (isFinite(obj.waitMinMs)) STATE.waitMinMs = obj.waitMinMs;
        if (isFinite(obj.waitMaxMs)) STATE.waitMaxMs = obj.waitMaxMs;
        if (isFinite(obj.intervalMs)) STATE.intervalMs = obj.intervalMs;
        if (typeof obj.targetSymbol === 'string') STATE.targetSymbol = obj.targetSymbol;
        if (isFinite(obj.tradesCount)) STATE.tradesCount = obj.tradesCount;
      }
    } catch (_) {}
  }
  function saveLog(text) {
    try { localStorage.setItem(STORAGE_KEY_LOG, text || ''); } catch (_) {}
  }
  function loadLog() {
    try { return localStorage.getItem(STORAGE_KEY_LOG) || ''; } catch (_) { return ''; }
  }

  // Simple in-page notifier
  function notify(msg) {
    try {
      const box = document.createElement('div');
      box.textContent = String(msg);
      box.style.position = 'fixed';
      box.style.right = '16px';
      box.style.bottom = '80px';
      box.style.zIndex = '999999';
      box.style.background = 'rgba(0,0,0,0.85)';
      box.style.color = '#fff';
      box.style.padding = '8px 10px';
      box.style.borderRadius = '6px';
      box.style.fontSize = '12px';
      document.body.appendChild(box);
      setTimeout(() => box.remove(), 3000);
    } catch (_) {}
  }

  function parseNumberText(text) {
    if (!text) return NaN;
    return Number(String(text).replace(/[^\d.\-]/g, ''));
  }

  function parseNumberFrom(el) {
    if (!el) return NaN;
    const raw = (el.value ?? el.textContent ?? '').trim();
    return parseNumberText(raw);
  }

  function setInput(el, val) {
    if (!el) return;
    const v = String(val);
    try {
      // 使用原生 setter，兼容 React/框架受控输入
      const proto = Object.getPrototypeOf(el);
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      if (desc && desc.set) {
        el.focus();
        el.select?.();
        desc.set.call(el, v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.blur();
        return;
      }
    } catch (_) {}
    // 回退
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  async function clickEl(el) {
    if (!el) return;
    el.scrollIntoView({ block: 'center' });
    await sleep(CFG.stepDelayMs);
    el.click();
    await sleep(CFG.afterClickDelayMs);
  }

  // Wait for a selector to appear within a timeout
  async function waitForSelector(sel, timeoutMs = 8000, intervalMs = 100) {
    const start = Date.now();
    let el = getEl(sel);
    while (!el && Date.now() - start < timeoutMs) {
      await sleep(intervalMs);
      el = getEl(sel);
    }
    return el;
  }
  // 从下单表单右侧区域提取“可用 USDT”余额，若失败回退到旧选择器
  function getAvailableUSDT() {
    try {
      // 策略1：查找包含“可用”文本的节点，在其同级或父级内寻找数值+USDT
      const allTextNodes = getEls('div,span');
      for (const node of allTextNodes) {
        const txt = (node.textContent || '').replace(/\s+/g, ' ').trim();
        if (!txt || txt.length > 40) continue; // 降噪
        if (txt.includes('可用')) {
          const scope = node.parentElement || node;
          // 在作用域内找带 USDT 的文本
          const candidates = Array.from(scope.querySelectorAll('div,span'));
          candidates.unshift(scope);
          for (const c of candidates) {
            const t = (c.textContent || '').replace(/\s+/g, ' ').trim();
            if (/USDT/i.test(t) && /\d/.test(t)) {
              const n = parseNumberText(t);
              if (isFinite(n)) return n;
            }
          }
          // 直接在“可用”节点右侧文本中解析数字
          const n2 = parseNumberText(txt);
          if (isFinite(n2)) return n2;
        }
      }
    } catch (_) {}
    // 兜底：使用旧的 balance 选择器
    try {
      const el = getEl(SEL.balanceUSDT);
      const v = parseNumberFrom(el);
      if (isFinite(v)) return v;
    } catch (_) {}
    return NaN;
  }

  // Ensure a bn-checkbox (reverse order) is checked
  async function ensureReverseChecked() {
    const revCk = getEl(SEL.reverseCheckbox);
    if (!revCk) {
      console.warn('[AutoTrader] reverseCheckbox not found (pre-check)');
      notify('元素缺失: 反向订单复选框');
      return false;
    }
    const aria = revCk.getAttribute('aria-checked');
    const classChecked = revCk.classList.contains('checked');
    let checked = aria === 'true' || classChecked;
    if (!checked) {
      await clickEl(revCk);
      const t0 = Date.now();
      // wait up to 1s for aria-checked to reflect
      while (Date.now() - t0 < 1000) {
        const a = revCk.getAttribute('aria-checked');
        if (a === 'true' || revCk.classList.contains('checked')) { checked = true; break; }
        await sleep(50);
      }
    }
    return checked;
  }

  // 判断当前页面是否已在目标代币交易页
  function isOnTargetSymbol(symbol) {
    try {
      const raw = (getEl(SEL.currentSymbolTitle)?.textContent || '').trim();
      if (!raw) return false;
      const pageTxt = raw.replace(/\s+/g, ' ').toUpperCase();
      const target = String(symbol || '').trim().toUpperCase();
      if (!target) return false;
      // 直接相等或互相包含
      if (pageTxt === target) return true;
      if (pageTxt.includes(target)) return true;
      if (target.includes(pageTxt)) return true;
      // 拆分斜杠/空格做前缀匹配 (如 AOP/USDT 或 AOP USDT)
      const pageFirst = pageTxt.split(/[\s/]/)[0];
      const targetFirst = target.split(/[\s/]/)[0];
      if (pageFirst && targetFirst && pageFirst === targetFirst) return true;
      return false;
    } catch (_) { return false; }
  }

  function computeBuyPrice(lastPrice) {
    if (!isFinite(lastPrice) || lastPrice <= 0) return NaN;
    if (CFG.buyPriceMode === 'tail_add') {
      const min = Math.max(0, Math.floor(CFG.buyTailAddMin || 800));
      const max = Math.max(min, Math.floor(CFG.buyTailAddMax || 1000));
      const rand = Math.floor(Math.random() * (max - min + 1)) + min; // [min,max]
      const scaled = Math.round(lastPrice * 1e8);
      const resultScaled = Math.max(0, scaled + rand);
      return resultScaled / 1e8;
    }
    // fallback: percentage
    return lastPrice * (1 + (CFG.buyPriceOffsetPct || 0));
  }

  function computeSellPrice(buyPrice) {
    if (!isFinite(buyPrice) || buyPrice <= 0) return NaN;
    if (CFG.sellMode === 'tail_subtract') {
      const min = Math.max(0, Math.floor(CFG.sellTailSubtractMin || 2000));
      const max = Math.max(min, Math.floor(CFG.sellTailSubtractMax || 5000));
      const rand = Math.floor(Math.random() * (max - min + 1)) + min; // [min,max]
      const scaled = Math.round(buyPrice * 1e8);
      const resultScaled = Math.max(0, scaled - rand);
      return resultScaled / 1e8;
    }
    // fallback: percentage
    return buyPrice * (1 + (CFG.sellPriceOffsetPct || 0));
  }

  function ensureMinTotal(total) {
    if (!isFinite(total) || total <= 0) return CFG.minTotalUSDT;
    return Math.max(total, CFG.minTotalUSDT);
  }

  function pickTradeAmount(availableUSDT) {
    const minCfg = STATE.tradeMinUSDT;
    const maxCfg = STATE.tradeMaxUSDT;
    if (minCfg == null && maxCfg == null) {
      return ensureMinTotal(availableUSDT);
    }
    // 单边设置情况：min 设了，max 未设 -> 取 [min, available]
    // max 设了，min 未设 -> 取 [CFG.minTotalUSDT, min(max, available)]
    const minV = Math.max(CFG.minTotalUSDT, minCfg != null ? minCfg : CFG.minTotalUSDT);
    const maxV = Math.max(minV, Math.min(availableUSDT, maxCfg != null ? maxCfg : availableUSDT));
    if (minV > availableUSDT) return ensureMinTotal(availableUSDT);
    const rnd = Math.random();
    const val = minV + (maxV - minV) * rnd;
    return Math.min(availableUSDT, val);
  }

  async function runOnce() {
    // 授权门禁
    if (!AUTH.ok) {
      notify('未授权：请先输入激活码');
      try { window.__auto_trader_logLine && window.__auto_trader_logLine('未授权，已阻止执行'); } catch (_) {}
      return false;
    }
    // 若用户指定了代币，先确保已选中该代币
    if (STATE.targetSymbol && STATE.targetSymbol.trim().length > 0) {
      const tgt = STATE.targetSymbol.trim();
      if (!isOnTargetSymbol(tgt)) {
        console.log('[AutoTrader] 准备选择代币', tgt);
        const ok = await ensureTokenSelected(tgt);
        if (!ok) {
          notify(`未找到代币 ${tgt}，请确认后重试`);
          console.warn('[AutoTrader] 代币选择失败', tgt);
          return false;
        }
        console.log('[AutoTrader] 已选择代币', tgt);
      } else {
        console.log('[AutoTrader] 已在指定代币页面，跳过切换', tgt);
      }
    } else if (CFG.requireStableTokenBeforeTrade) {
      notify('请先在控制面板输入要交易的代币简称（如 USDT/USDC/AOP）');
      console.warn('[AutoTrader] 阻止执行：未指定代币');
      return false;
    }
    console.debug('[AutoTrader] runOnce start');
    // Ensure reverse order checkbox is ON before reading price and proceeding
    const ensured = await ensureReverseChecked();
    if (!ensured) { return false; }
    const lastPriceEl = getEl(SEL.lastPrice);
    const availableUSDT = getAvailableUSDT();
    // 首次运行记录初始可用余额
    if (STATE.initialAvailableUSDT == null && isFinite(availableUSDT)) {
      STATE.initialAvailableUSDT = availableUSDT;
      try {
        const lossEl = document.getElementById('auto-trader-loss');
        if (lossEl) lossEl.textContent = '0.00000000 USDT';
      } catch (_) {}
    }
    if (!lastPriceEl || !isFinite(availableUSDT)) {
      console.warn('[AutoTrader] available or lastPrice not found/invalid', { availableUSDT, lastPriceEl: !!lastPriceEl });
      notify('元素/数据缺失: ' + (!isFinite(availableUSDT) ? '可用余额' : '') + (!lastPriceEl ? ' / 最新价' : ''));
      return false;
    }
    const balanceUSDT = availableUSDT;
    const lastPrice = parseNumberFrom(lastPriceEl);
    // 日志：仅显示指定信息
    const currentSymbol = (getEl(SEL.currentSymbolTitle)?.textContent || '').trim() || (STATE.targetSymbol || '-');
    window.__auto_trader_logLine && window.__auto_trader_logLine(`正在交易：${currentSymbol} | 余额(USDT)：${(+balanceUSDT).toFixed(8)}`);
    if (!isFinite(balanceUSDT) || !isFinite(lastPrice)) {
      console.warn('[AutoTrader] invalid balance or price', { balanceUSDT, lastPrice });
      notify('数据无效: 余额或最新价解析失败');
      return false;
    }

    const buyPrice = computeBuyPrice(lastPrice);
    const sellPrice = computeSellPrice(buyPrice);
    if (!isFinite(buyPrice) || !isFinite(sellPrice)) {
      console.warn('[AutoTrader] invalid computed prices', { buyPrice, sellPrice });
      return false;
    }

    const buyPriceInput = getEl(SEL.buyPriceInput);
    if (!buyPriceInput) {
      console.warn('[AutoTrader] buyPriceInput not found');
      notify('元素缺失: 买入价格输入框');
      return false;
    }
    // 将 tape 价格写入限价框
    setInput(buyPriceInput, buyPrice.toFixed(8));
    await sleep(CFG.stepDelayMs);

    const buyTotalInput = getEl(SEL.buyTotalInput);
    if (!buyTotalInput) {
      console.warn('[AutoTrader] buyTotalInput not found');
      notify('元素缺失: 成交额输入框');
      return false;
    }
    const totalUSDT = pickTradeAmount(balanceUSDT);
    setInput(buyTotalInput, totalUSDT.toFixed(8));
    await sleep(CFG.stepDelayMs);

    const revCk = getEl(SEL.reverseCheckbox);
    if (!revCk) {
      console.warn('[AutoTrader] reverseCheckbox not found');
      notify('元素缺失: 反向订单复选框');
      return false;
    }
    const checked = revCk.classList.contains('checked') || revCk.getAttribute('aria-checked') === 'true';
    if (!checked) { await clickEl(revCk); }

    const sellInput = getEl(SEL.sellLimitInput);
    if (!sellInput) {
      console.warn('[AutoTrader] sellLimitInput not found (ensure reverse is checked and field visible)');
      notify('元素缺失: 限价卖出输入框');
      return;
    }
    setInput(sellInput, sellPrice.toFixed(8));
    await sleep(CFG.stepDelayMs);

    const buyBtn = getEl(SEL.buyButton);
    if (!buyBtn) {
      console.warn('[AutoTrader] buyButton not found');
      notify('元素缺失: 买入按钮');
      return;
    }
    await clickEl(buyBtn);
    // 提示：已点击买入，等待确认
    window.__auto_trader_logLine && window.__auto_trader_logLine('交易正在提交中，等待确认...');

    // 等待确认按钮出现（弹窗/动画可能有延迟）
    let confirmBtn = await waitForSelector(SEL.confirmButton, 10000, 150);
    if (!confirmBtn) {
      console.warn('[AutoTrader] confirmButton not found within timeout');
      notify('元素缺失: 确认按钮/弹窗');
      return false;
    }
    await clickEl(confirmBtn);

    console.log('[AutoTrader] Confirmed: buy @', buyPrice, 'sell @', sellPrice, 'totalUSDT=', totalUSDT);
    notify('已确认下单');
    // 10秒内检测余额恢复至95%：分两阶段
    // 阶段1：先检测余额是否发生扣减(低于阈值)
    // 阶段2：检测余额是否在窗口内恢复至阈值
    const baseline = balanceUSDT;
    const threshold = baseline * 0.95;
    const start = Date.now();
    let deducted = false;
    let success = false;
    try {
      const cur0 = getAvailableUSDT();
      const msg = isFinite(cur0)
        ? `正在交易中，检测余额恢复(10秒内)... 基线：${baseline.toFixed(8)} | 当前可用：${cur0.toFixed(8)} | 阈值：${threshold.toFixed(8)}`
        : `正在交易中，检测余额恢复(10秒内)... 基线：${baseline.toFixed(8)} | 阈值：${threshold.toFixed(8)}`;
      window.__auto_trader_logLine && window.__auto_trader_logLine(msg);
    } catch (_) {
      window.__auto_trader_logLine && window.__auto_trader_logLine(`正在交易中，检测余额恢复(10秒内)... 基线：${baseline.toFixed(8)} | 阈值：${threshold.toFixed(8)}`);
    }
    // 每秒检测一次，最多10次
    for (let i = 0; i < 10; i++) {
      try {
        const current = getAvailableUSDT();
        if (isFinite(current)) {
          window.__auto_trader_logLine && window.__auto_trader_logLine(`可用余额：${current.toFixed(8)} / 阈值：${threshold.toFixed(8)}${deducted ? ' (等待恢复)': ' (等待扣减)'} `);
          if (!deducted && current + 1e-9 < threshold) {
            deducted = true;
            window.__auto_trader_logLine && window.__auto_trader_logLine('已检测到余额扣减，开始等待恢复至阈值...');
          } else if (deducted && current >= threshold) {
            success = true;
            break;
          }
        }
      } catch (_) {}
      await sleep(1000);
    }

    if (success) {
      try {
        const current2 = getAvailableUSDT();
        const elapsedS = ((Date.now() - start) / 1000).toFixed(1);
        if (isFinite(current2)) {
          window.__auto_trader_logLine && window.__auto_trader_logLine(`余额已恢复：${current2.toFixed(8)} ≥ 阈值：${threshold.toFixed(8)} | 用时：${elapsedS} 秒`);
        } else {
          window.__auto_trader_logLine && window.__auto_trader_logLine(`余额已恢复至阈值以上，用时：${elapsedS} 秒`);
        }
      } catch (_) {}
      STATE.successCount += 1;
      try {
        const el = document.getElementById('auto-trader-success');
        if (el) el.textContent = String(STATE.successCount);
      } catch (_) {}
      saveState();
      // 累计交易损耗：以“本次开始时可用余额(baseline) - 当前可用余额”的正差值叠加
      try {
        const curAvail = getAvailableUSDT();
        if (isFinite(curAvail) && isFinite(baseline)) {
          const delta = Math.max(0, baseline - curAvail);
          const prevLoss = Number(STATE.cumulativeLossUSDT) || 0;
          const nextLoss = prevLoss + delta;
          STATE.cumulativeLossUSDT = nextLoss;
          const lossEl = document.getElementById('auto-trader-loss');
          if (lossEl) lossEl.textContent = `${nextLoss.toFixed(8)} USDT`;
        }
      } catch (_) {}
      saveState();
      // 累计交易量：以本次下单 USDT 金额累加
      try {
        const volEl = document.getElementById('auto-trader-volume');
        const vol4El = document.getElementById('auto-trader-volume-x4');
        const add = Number(totalUSDT) || 0;
        const prev = Number(STATE.cumulativeVolumeUSDT) || 0;
        const next = prev + add;
        STATE.cumulativeVolumeUSDT = next;
        if (volEl) volEl.textContent = `${next.toFixed(8)} USDT`;
        if (vol4El) vol4El.textContent = `${(next * 4).toFixed(8)} USDT`;
      } catch (_) {}
      saveState();
      window.__auto_trader_logLine && window.__auto_trader_logLine(`交易成功，当前成功次数：${STATE.successCount}`);
      // 成功后随机等待用户设置阈值
      const rndF = STATE.waitMinMs + Math.random() * Math.max(0, STATE.waitMaxMs - STATE.waitMinMs);
      notify(`随机等待 ${(rndF/1000).toFixed(1)} 秒`);
      await sleep(Math.round(rndF));
      return true;
    } else {
      if (!deducted) {
        window.__auto_trader_logLine && window.__auto_trader_logLine('10秒内未检测到余额扣减，可能未成交或成交延迟，视为失败');
      } else {
        window.__auto_trader_logLine && window.__auto_trader_logLine('10秒内未恢复至95%阈值，视为失败');
      }
      return false;
    }
  }

  // 确保页面选中目标代币：在搜索框输入symbol并点击结果
  async function ensureTokenSelected(symbol) {
    try {
      const input = getEl(TOKEN.searchInput);
      if (!input) return false;
      // 清空并输入
      setInput(input, '');
      await sleep(120);
      setInput(input, symbol);
      // 等待以确保搜索结果渲染
      await sleep(800);
      // 尝试多次查找，避免渲染抖动/虚拟列表
      let target = null;
      const symUpper = symbol.toUpperCase();
      for (let i = 0; i < 6 && !target; i++) {
        const items = Array.from(document.querySelectorAll('div.t-body3.text-PrimaryText.whitespace-nowrap.flex.items-center'));
        // 取每个候选的第一个“词”（去除换行/空格）并忽略大小写比较
        target = items.find(el => {
          const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
          const first = (txt.split(' ')[0] || '').toUpperCase();
          return first === symUpper || txt.toUpperCase().includes(` ${symUpper}`) || txt.toUpperCase().startsWith(symUpper);
        });
        if (!target) await sleep(250);
      }
      if (!target) return false;
      await clickEl(target);
      await sleep(500);
      console.log('[AutoTrader] 选择代币成功', symbol);
      return true;
    } catch (e) {
      console.error('[AutoTrader] ensureTokenSelected error', e);
      return false;
    }
  }

  // ===== Activation Panel (UI shown when not authorized) =====
  function createActivationPanel() {
    if (document.getElementById('auto-trader-activate')) return;
    const panel = document.createElement('div');
    panel.id = 'auto-trader-activate';
    panel.style.position = 'fixed';
    panel.style.right = '16px';
    panel.style.bottom = '16px';
    panel.style.zIndex = '1000000';
    panel.style.background = 'rgba(0,0,0,0.78)';
    panel.style.color = '#fff';
    panel.style.padding = '12px 14px';
    panel.style.borderRadius = '8px';
    panel.style.fontSize = '12px';
    panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.35)';

    const title = document.createElement('div');
    title.textContent = '需要激活码才能使用';
    title.style.fontWeight = '600';
    title.style.marginBottom = '8px';

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '6px';
    row.style.alignItems = 'center';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '输入激活码';
    input.style.width = '180px';
    input.style.padding = '4px 6px';
    input.style.borderRadius = '6px';
    input.style.border = '1px solid rgba(255,255,255,0.3)';
    input.style.background = 'transparent';
    input.style.color = '#fff';

    const btn = document.createElement('button');
    btn.textContent = '激活';
    btn.style.cursor = 'pointer';
    btn.style.padding = '4px 8px';
    btn.style.borderRadius = '6px';
    btn.style.border = 'none';
    btn.style.background = '#2b8a3e';
    btn.style.color = '#fff';

    const tip = document.createElement('div');
    tip.style.marginTop = '6px';
    tip.style.color = '#ffd166';

    btn.addEventListener('click', async () => {
      const code = (input.value || '').trim();
      if (!code) { tip.textContent = '请输入激活码'; return; }
      btn.disabled = true; btn.textContent = '校验中...'; tip.textContent = '';
      const res = await verifyActivationCode(code);
      if (res.ok) {
        saveActivation({ token: res.token, expiresAt: res.expiresAt, expiresText: res.expiresText, code });
        AUTH.ok = true;
        notify('授权成功');
        try { const el = document.getElementById('auto-trader-expiry'); if (el) el.textContent = res.expiresText || formatExpiry(res.expiresAt); } catch (_) {}
        panel.remove();
        // 授权后初始化正式面板
        setTimeout(initUI, 0);
      } else {
        tip.textContent = '激活失败：' + (res.msg || '无效激活码');
        btn.disabled = false; btn.textContent = '激活';
      }
    });

    row.appendChild(input);
    row.appendChild(btn);
    panel.appendChild(title);
    panel.appendChild(row);
    panel.appendChild(tip);
    // 尝试插入到页面
    if (document.body) {
      document.body.appendChild(panel);
    } else {
      const iv = setInterval(() => {
        if (document.body) {
          clearInterval(iv);
          document.body.appendChild(panel);
        }
      }, 200);
    }
  }

  // ================= UI Panel =================
  const STATE = {
    auto: false,
    timer: null,
    intervalMs: 5000,
    waitMinMs: 5000,
    waitMaxMs: 10000,
    targetSymbol: '',
    successCount: 0,
    tradeMinUSDT: null,
    tradeMaxUSDT: null,
    initialAvailableUSDT: null,
    cumulativeVolumeUSDT: 0,
    tradesCount: 1,
    cumulativeLossUSDT: 0
  };

  function createPanel() {
    if (document.getElementById('auto-trader-panel')) return;
    // 先加载持久化状态
    loadState();
    const panel = document.createElement('div');
    panel.id = 'auto-trader-panel';
    panel.style.position = 'fixed';
    panel.style.right = '16px';
    panel.style.bottom = '16px';
    panel.style.zIndex = '999999';
    panel.style.background = 'rgba(0,0,0,0.75)';
    panel.style.color = '#fff';
    panel.style.padding = '10px 12px';
    panel.style.borderRadius = '8px';
    panel.style.fontSize = '12px';
    panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';

    const title = document.createElement('div');
    title.textContent = '币安alpha自动交易1.0';
    title.style.fontWeight = '600';
    title.style.marginBottom = '6px';

    // 授权到期显示
    const expRow = document.createElement('div');
    expRow.style.marginBottom = '6px';
    const expLabel = document.createElement('span');
    expLabel.textContent = '授权到期：';
    const expValue = document.createElement('span');
    expValue.id = 'auto-trader-expiry';
    const act = readActivation();
    expValue.textContent = (act && act.expiresText) || formatExpiry(act && act.expiresAt);
    expRow.appendChild(expLabel);
    expRow.appendChild(expValue);

    // 当前代币显示
    const symbolRow = document.createElement('div');
    symbolRow.style.marginBottom = '6px';
    const symbolLabel = document.createElement('span');
    symbolLabel.textContent = '当前代币：';
    const symbolValue = document.createElement('span');
    symbolValue.id = 'auto-trader-symbol';
    symbolValue.textContent = '-';
    symbolRow.appendChild(symbolLabel);
    symbolRow.appendChild(symbolValue);

    // 成功次数显示
    const successRow = document.createElement('div');
    successRow.style.marginBottom = '6px';
    const successLabel = document.createElement('span');
    successLabel.textContent = '当前交易成功订单：';
    const successValue = document.createElement('span');
    successValue.id = 'auto-trader-success';
    successValue.textContent = String(STATE.successCount || 0);
    const successTail = document.createElement('span');
    successTail.textContent = ' 次';
    successRow.appendChild(successLabel);
    successRow.appendChild(successValue);
    successRow.appendChild(successTail);

    // 交易损耗显示
    const lossRow = document.createElement('div');
    lossRow.style.marginBottom = '6px';
    const lossLabel = document.createElement('span');
    lossLabel.textContent = '交易损耗+gas费：';
    const lossValue = document.createElement('span');
    lossValue.id = 'auto-trader-loss';
    lossValue.textContent = '0.00000000 USDT';
    lossRow.appendChild(lossLabel);
    lossRow.appendChild(lossValue);

    // 已刷交易量显示
    const volRow = document.createElement('div');
    volRow.style.marginBottom = '6px';
    const volLabel = document.createElement('span');
    volLabel.textContent = '已刷交易量：';
    const volValue = document.createElement('span');
    volValue.id = 'auto-trader-volume';
    volValue.textContent = '0.00000000 USDT';
    volRow.appendChild(volLabel);
    volRow.appendChild(volValue);

    // 四倍代币交易量显示
    const vol4Row = document.createElement('div');
    vol4Row.style.marginBottom = '6px';
    const vol4Label = document.createElement('span');
    vol4Label.textContent = '四倍代币交易量：';
    const vol4Value = document.createElement('span');
    vol4Value.id = 'auto-trader-volume-x4';
    vol4Value.textContent = '0.00000000 USDT';
    vol4Row.appendChild(vol4Label);
    vol4Row.appendChild(vol4Value);

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '6px';
    row.style.alignItems = 'center';

    const startBtn = document.createElement('button');
    startBtn.textContent = '开始';
    startBtn.style.cursor = 'pointer';
    startBtn.style.padding = '4px 8px';
    startBtn.style.borderRadius = '6px';
    startBtn.style.border = 'none';
    startBtn.style.background = '#2b8a3e';
    startBtn.style.color = '#fff';
    // 点击行为在 tradesInput 创建后绑定（执行多次）

    // 重置按钮
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '重置';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.padding = '4px 8px';
    resetBtn.style.borderRadius = '6px';
    resetBtn.style.border = '1px solid rgba(255,255,255,0.3)';
    resetBtn.style.background = '#6c757d';
    resetBtn.style.color = '#fff';
    resetBtn.addEventListener('click', () => {
      try {
        // 清本地存储
        localStorage.removeItem(STORAGE_KEY_STATE);
        localStorage.removeItem(STORAGE_KEY_LOG);
      } catch (_) {}
      // 清内存状态
      STATE.successCount = 0;
      STATE.cumulativeLossUSDT = 0;
      STATE.cumulativeVolumeUSDT = 0;
      // 清面板显示
      try {
        const succEl = document.getElementById('auto-trader-success');
        if (succEl) succEl.textContent = '0';
        const lossEl = document.getElementById('auto-trader-loss');
        if (lossEl) lossEl.textContent = '0.00000000 USDT';
        const volEl = document.getElementById('auto-trader-volume');
        if (volEl) volEl.textContent = '0.00000000 USDT';
        const vol4El = document.getElementById('auto-trader-volume-x4');
        if (vol4El) vol4El.textContent = '0.00000000 USDT';
        const logBoxEl = document.getElementById('auto-trader-log');
        if (logBoxEl) logBoxEl.value = '';
      } catch (_) {}
      // 立刻保存干净状态
      saveState();
    });

    const intervalLabel = document.createElement('span');
    intervalLabel.textContent = '间隔(秒)';

    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.min = '2';
    intervalInput.step = '1';
    intervalInput.value = String(STATE.intervalMs / 1000);
    intervalInput.style.width = '64px';
    intervalInput.style.padding = '2px 4px';
    intervalInput.style.borderRadius = '4px';
    intervalInput.style.border = '1px solid rgba(255,255,255,0.3)';
    intervalInput.style.background = 'transparent';
    intervalInput.style.color = '#fff';
    intervalInput.addEventListener('change', () => {
      const sec = Math.max(2, Number(intervalInput.value) || 5);
      STATE.intervalMs = sec * 1000;
      saveState();
    });

    // 随机等待设置（秒）
    const waitRow = document.createElement('div');
    waitRow.style.display = 'flex';
    waitRow.style.gap = '6px';
    waitRow.style.alignItems = 'center';
    waitRow.style.marginTop = '6px';

    const waitLabel = document.createElement('span');
    waitLabel.textContent = '随机等待(秒)';
    const waitMin = document.createElement('input');
    waitMin.type = 'number';
    waitMin.min = '0';
    waitMin.step = '0.1';
    waitMin.value = String(Math.round(STATE.waitMinMs / 1000));
    waitMin.style.width = '48px';
    waitMin.style.padding = '2px 4px';
    waitMin.style.borderRadius = '4px';
    waitMin.style.border = '1px solid rgba(255,255,255,0.3)';
    waitMin.style.background = 'transparent';
    waitMin.style.color = '#fff';
    const dash = document.createElement('span');
    dash.textContent = '—';
    const waitMax = document.createElement('input');
    waitMax.type = 'number';
    waitMax.min = '0';
    waitMax.step = '0.1';
    waitMax.value = String(Math.round(STATE.waitMaxMs / 1000));
    waitMax.style.width = '48px';
    waitMax.style.padding = '2px 4px';
    waitMax.style.borderRadius = '4px';
    waitMax.style.border = '1px solid rgba(255,255,255,0.3)';
    waitMax.style.background = 'transparent';
    waitMax.style.color = '#fff';
    function applyWaitRange() {
      let minS = Math.max(0, Number(waitMin.value) || 0);
      let maxS = Math.max(minS, Number(waitMax.value) || minS);
      STATE.waitMinMs = Math.round(minS * 1000);
      STATE.waitMaxMs = Math.round(maxS * 1000);
    }
    waitMin.addEventListener('change', () => { applyWaitRange(); saveState(); });
    waitMax.addEventListener('change', () => { applyWaitRange(); saveState(); });

    // Trades row
    const row2 = document.createElement('div');
    row2.style.display = 'flex';
    row2.style.gap = '6px';
    row2.style.alignItems = 'center';
    row2.style.marginTop = '6px';

    const tradesLabel = document.createElement('span');
    tradesLabel.textContent = '交易次数';
    const tradesInput = document.createElement('input');
    tradesInput.type = 'number';
    tradesInput.min = '1';
    tradesInput.step = '1';
    tradesInput.value = String(STATE.tradesCount || 1);
    tradesInput.style.width = '64px';
    tradesInput.style.padding = '2px 4px';
    tradesInput.style.borderRadius = '4px';
    tradesInput.style.border = '1px solid rgba(255,255,255,0.3)';
    tradesInput.style.background = 'transparent';
    tradesInput.style.color = '#fff';

    // 绑定“开始”按钮：按照“次数”执行
    startBtn.addEventListener('click', async () => {
      let n = Math.max(1, Number(tradesInput.value) || 1);
      STATE.tradesCount = n; saveState();
      for (let i = 0; i < n; i++) {
        try { await runOnce(); } catch (e) { console.error('[AutoTrader] 执行出错', e); }
        // 随机等待在 runOnce 内部成功后已处理
      }
    });

    // Log box
    const logBox = document.createElement('textarea');
    logBox.id = 'auto-trader-log';
    logBox.readOnly = true;
    logBox.rows = 6;
    logBox.style.width = '100%';
    logBox.style.marginTop = '6px';
    logBox.style.resize = 'none';
    logBox.style.background = 'rgba(0,0,0,0.6)';
    logBox.style.color = '#a9f0ff';
    logBox.style.border = '1px solid rgba(255,255,255,0.2)';
    logBox.style.borderRadius = '6px';

    function logLine(msg) {
      try {
        const t = new Date().toLocaleTimeString();
        logBox.value += `[${t}] ${msg}\n`;
        logBox.scrollTop = logBox.scrollHeight;
        saveLog(logBox.value);
      } catch (_) {}
    }
    // 暴露给全局用于 notify 写日志
    window.__auto_trader_logLine = logLine;
    // 日志仅显示中文“操作信息”：不再把控制台的英文调试写入日志框
    // 若后续需要也可改为匹配特定中文前缀再写入

    // 移除自动开关相关逻辑

    row.appendChild(startBtn);
    row.appendChild(resetBtn);
    row.appendChild(intervalLabel);
    row.appendChild(intervalInput);

    panel.appendChild(title);
    panel.appendChild(expRow);
    panel.appendChild(row);
    panel.appendChild(symbolRow);
    panel.appendChild(successRow);
    panel.appendChild(lossRow);
    panel.appendChild(volRow);
    panel.appendChild(vol4Row);
    waitRow.appendChild(waitLabel);
    waitRow.appendChild(waitMin);
    waitRow.appendChild(dash);
    waitRow.appendChild(waitMax);
    panel.appendChild(waitRow);
    row2.appendChild(tradesLabel);
    row2.appendChild(tradesInput);
    panel.appendChild(row2);

    // 交易额阈值区间设置（USDT）
    const amtRow = document.createElement('div');
    amtRow.style.display = 'flex';
    amtRow.style.gap = '6px';
    amtRow.style.alignItems = 'center';
    amtRow.style.marginTop = '6px';

    const amtLabel = document.createElement('span');
    amtLabel.textContent = '交易额(USDT)';

    const amtMin = document.createElement('input');
    amtMin.type = 'number';
    amtMin.min = '0';
    amtMin.step = '0.01';
    amtMin.placeholder = '最小(留空=全仓)';
    amtMin.style.width = '110px';
    amtMin.style.padding = '2px 4px';
    amtMin.style.borderRadius = '4px';
    amtMin.style.border = '1px solid rgba(255,255,255,0.3)';
    amtMin.style.background = 'transparent';
    amtMin.style.color = '#fff';

    const amtDash = document.createElement('span');
    amtDash.textContent = '—';

    const amtMax = document.createElement('input');
    amtMax.type = 'number';
    amtMax.min = '0';
    amtMax.step = '0.01';
    amtMax.placeholder = '最大(留空=全仓)';
    amtMax.style.width = '110px';
    amtMax.style.padding = '2px 4px';
    amtMax.style.borderRadius = '4px';
    amtMax.style.border = '1px solid rgba(255,255,255,0.3)';
    amtMax.style.background = 'transparent';
    amtMax.style.color = '#fff';

    function applyAmtRange() {
      const minV = Number(amtMin.value);
      const maxV = Number(amtMax.value);
      STATE.tradeMinUSDT = isFinite(minV) && minV > 0 ? minV : null;
      STATE.tradeMaxUSDT = isFinite(maxV) && maxV > 0 ? maxV : null;
      if (STATE.tradeMinUSDT != null && STATE.tradeMaxUSDT != null && STATE.tradeMaxUSDT < STATE.tradeMinUSDT) {
        // 交换，保证 max >= min
        const tmp = STATE.tradeMinUSDT;
        STATE.tradeMinUSDT = STATE.tradeMaxUSDT;
        STATE.tradeMaxUSDT = tmp;
        amtMin.value = String(STATE.tradeMinUSDT);
        amtMax.value = String(STATE.tradeMaxUSDT);
      }
    }
    amtMin.addEventListener('change', () => { applyAmtRange(); saveState(); });
    amtMax.addEventListener('change', () => { applyAmtRange(); saveState(); });

    amtRow.appendChild(amtLabel);
    amtRow.appendChild(amtMin);
    amtRow.appendChild(amtDash);
    amtRow.appendChild(amtMax);
    panel.appendChild(amtRow);

    // 代币输入与提示
    const tokenRow = document.createElement('div');
    tokenRow.style.display = 'flex';
    tokenRow.style.gap = '6px';
    tokenRow.style.alignItems = 'center';
    tokenRow.style.marginTop = '6px';
    const tokenLabel = document.createElement('span');
    tokenLabel.textContent = '代币简称';
    const tokenInput = document.createElement('input');
    tokenInput.type = 'text';
    tokenInput.placeholder = '如 AOP/USDT';
    tokenInput.style.width = '120px';
    tokenInput.style.padding = '2px 4px';
    tokenInput.style.borderRadius = '4px';
    tokenInput.style.border = '1px solid rgba(255,255,255,0.3)';
    tokenInput.style.background = 'transparent';
    tokenInput.style.color = '#fff';
    tokenInput.addEventListener('change', () => { STATE.targetSymbol = tokenInput.value.trim(); saveState(); });
    tokenRow.appendChild(tokenLabel);
    tokenRow.appendChild(tokenInput);
    panel.appendChild(tokenRow);
    panel.appendChild(logBox);
    document.body.appendChild(panel);

    // 定时刷新当前代币名称
    function refreshSymbol() {
      try {
        const el = getEl(SEL.currentSymbolTitle);
        const txt = (el?.textContent || '').trim();
        if (txt) document.getElementById('auto-trader-symbol').textContent = txt;
      } catch (_) {}
    }
    // 恢复日志
    try { const saved = loadLog(); if (saved) { logBox.value = saved; logBox.scrollTop = logBox.scrollHeight; } } catch (_) {}
    // 恢复面板显示（成功次数、损耗、交易量、四倍交易量、目标代币、随机等待与交易额区间、交易次数、间隔）
    try {
      const succEl = document.getElementById('auto-trader-success');
      if (succEl) succEl.textContent = String(STATE.successCount || 0);
      const lossEl = document.getElementById('auto-trader-loss');
      if (lossEl) lossEl.textContent = `${(Number(STATE.cumulativeLossUSDT) || 0).toFixed(8)} USDT`;
      const volEl = document.getElementById('auto-trader-volume');
      if (volEl) volEl.textContent = `${(STATE.cumulativeVolumeUSDT || 0).toFixed(8)} USDT`;
      const vol4El = document.getElementById('auto-trader-volume-x4');
      if (vol4El) vol4El.textContent = `${((STATE.cumulativeVolumeUSDT || 0) * 4).toFixed(8)} USDT`;
      // 恢复随机等待输入框
      waitMin.value = String((STATE.waitMinMs || 0) / 1000);
      waitMax.value = String((STATE.waitMaxMs || 0) / 1000);
      // 恢复交易额阈值输入
      const minSaved = STATE.tradeMinUSDT;
      const maxSaved = STATE.tradeMaxUSDT;
      if (minSaved != null && isFinite(minSaved)) {
        const el = document.querySelector('#auto-trader-panel input[placeholder="最小(留空=全仓)"]');
        if (el) el.value = String(minSaved);
      }
      if (maxSaved != null && isFinite(maxSaved)) {
        const el = document.querySelector('#auto-trader-panel input[placeholder="最大(留空=全仓)"]');
        if (el) el.value = String(maxSaved);
      }
      // 恢复交易次数与间隔、目标代币输入
      const tradesInputEl = Array.from(document.querySelectorAll('#auto-trader-panel input')).find(i => i.type === 'number' && i.min === '1' && i.step === '1' && i.style && i.style.width === '64px');
      if (tradesInputEl) tradesInputEl.value = String(STATE.tradesCount || 1);
      intervalInput.value = String((STATE.intervalMs || 5000) / 1000);
      const tokenInputEl = Array.from(document.querySelectorAll('#auto-trader-panel input')).find(i => i.type === 'text' && i.placeholder === '如 AOP/USDT');
      if (tokenInputEl && typeof STATE.targetSymbol === 'string') tokenInputEl.value = STATE.targetSymbol;
    } catch (_) {}
    refreshSymbol();
    setInterval(refreshSymbol, 1000);
  }

  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'x') {
      runOnce().catch(console.error);
    }
  });

  if (CFG.autoRunOnLoad) {
    window.addEventListener('load', () => runOnce().catch(console.error));
  }

  // small badge to confirm injection
  function showBadge() {
    if (document.getElementById('tm-ok-badge')) return;
    const b = document.createElement('div');
    b.id = 'tm-ok-badge';
    b.textContent = '脚本已注入';
    b.style.position = 'fixed';
    b.style.left = '8px';
    b.style.bottom = '8px';
    b.style.zIndex = '999999';
    b.style.padding = '2px 6px';
    b.style.background = 'rgba(0,128,0,0.85)';
    b.style.color = '#fff';
    b.style.fontSize = '10px';
    b.style.borderRadius = '4px';
    document.body.appendChild(b);
  }

  function initUI() {
    try {
      if (!ensureAuthorized()) {
        createActivationPanel();
        showBadge();
        return;
      }
      createPanel();
      showBadge();
    } catch (e) { console.error('[AutoTrader] initUI error', e); }
  }

  // create panel via multiple hooks to survive SPA timing quirks
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initUI, 0);
  } else {
    document.addEventListener('DOMContentLoaded', initUI, { once: true });
    window.addEventListener('load', initUI, { once: true });
  }
  // final fallback if body not ready yet
  const ensureTimer = setInterval(() => {
    if (document.body) {
      clearInterval(ensureTimer);
      initUI();
    }
  }, 500);

  // ===== SPA URL change handling =====
  function handleRouteChange() {
    // Recreate panel on route changes (dynamic contract pages)
    initUI();
  }

  (function hookHistory() {
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function () {
      const ret = origPush.apply(this, arguments);
      setTimeout(handleRouteChange, 50);
      return ret;
    };
    history.replaceState = function () {
      const ret = origReplace.apply(this, arguments);
      setTimeout(handleRouteChange, 50);
      return ret;
    };
    window.addEventListener('popstate', () => setTimeout(handleRouteChange, 50));
    if (window.onurlchange === null) {
      window.addEventListener('urlchange', () => setTimeout(handleRouteChange, 50));
    }
  })();
})();


