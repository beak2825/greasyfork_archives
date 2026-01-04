// ==UserScript==
// @name         Corner Crypto Ticker Pro
// @name:en      Corner Crypto Ticker Pro
// @name:ja      Corner Crypto Ticker Pro
// @name:ko      Corner Crypto Ticker Pro
// @namespace    https://tampermonkey.net/
// @version      2.4.1
// @description  在任意网页角落悬浮显示加密资产行情：实时拉取 BTC/ETH/DOGE 等自定义币种价格与涨跌（OKX/Binance/Coinbase Exchange 可选），支持可拖拽(可设为按Shift)、可调整大小、点击直达交易所对应行情页、自动失败切换数据源、配置面板自定义（数据源/币种/涨跌显示与颜色/单位符号/涨跌基准/刷新频率/默认位置尺寸）并支持导入导出；支持币种 Logo 自动抓取（可被自定义 logo 覆盖）。
// @description:en A lightweight, customizable, draggable corner crypto ticker for any webpage. Real-time prices & daily change for BTC/ETH/DOGE and custom symbols via OKX/Binance/Coinbase Exchange. Supports drag (optional Shift), resize, click-through to exchange market pages, automatic data-source fallback, and an in-script configuration panel with import/export. Includes best-effort auto logo fetching (overridable by custom logo URL).
// @description:ja あらゆるWebページの隅に暗号資産の価格を表示する軽量ティッカーです。OKX/Binance/Coinbase Exchange の公開APIから BTC/ETH/DOGE など任意の銘柄の価格と騰落を取得。ドラッグ移動（任意でShift必須）、サイズ変更、取引所の該当マーケットへのクリック遷移、自動フォールバック、設定パネル（インポート/エクスポート）に対応。ロゴも可能な範囲で自動取得（URL指定で上書き可）。
// @description:ko 모든 웹페이지 구석에 암호화폐 시세를 띄워주는 가벼운 티커입니다. OKX/Binance/Coinbase Exchange 공개 API로 BTC/ETH/DOGE 및 사용자 지정 코인의 가격과 등락을 표시합니다. 드래그 이동(선택적으로 Shift 필요), 크기 조절, 거래소 시세 페이지로 클릭 이동, 자동 데이터 소스 fallback, 설정 패널(가져오기/내보내기) 지원. 코인 로고 자동 로드(가능한 범위, 사용자 로고 URL로 덮어쓰기 가능).
// @icon         https://youke2.picui.cn/s1/2025/12/21/694744b22531b.png
// @author       BFD_qt
// @license      MIT
// @match        *://*/*
// @run-at       document-end
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @connect      www.okx.com
// @connect      api.binance.com
// @connect      api.exchange.coinbase.com
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/559648/Corner%20Crypto%20Ticker%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/559648/Corner%20Crypto%20Ticker%20Pro.meta.js
// ==/UserScript==


/**
 * Corner Crypto Ticker Pro
 * =======================
 * Maintainer Notes
 * - UI: DOM + CSS via GM_addStyle, no external deps. Rebuild on apply to avoid partial state drift.
 * - Network: GM_xmlhttpRequest avoids CORS. Extending exchanges requires adding @connect.
 * - Storage: Settings JSON stored under STORE_KEY. Bump STORE_KEY if schema changes.
 * - Auto Logo: best-effort from a public icon repo; user-specified logo always takes precedence.
 *
 * Compliance / Risk Notice
 * ------------------------
 * 本脚本仅用于展示公开行情信息与便捷跳转至公开行情页面，不提供交易、撮合、下单、资金划转、充值/提现等任何功能，
 * 不构成投资建议，也不对任何数字资产/平台/服务作推荐。
 *
 * 数字资产相关活动在不同司法辖区的监管政策差异较大。以中国大陆为例，监管部门已发布多份文件/通知，
 * 对“虚拟货币相关业务活动”等作出严格限制，并明确相关活动属于非法金融活动的范围。用户应自行了解并遵守所在地区
 * 法律法规及监管要求，仅将本脚本用于信息查询与学习交流用途。严禁利用本脚本从事任何违法违规的数字资产交易、
 * 募集、支付结算、宣传推广或其他相关活动；因用户自行使用产生的风险与后果由用户自行承担。
 */

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Storage & defaults
  // ---------------------------------------------------------------------------
  const STORE_KEY = "CCTP_SETTINGS_V2_4_1";

  const DEFAULT_SETTINGS = {
    exchange: "OKX", // OKX | BINANCE | COINBASE_EXCHANGE

    autoFallback: {
      enabled: true,
      order: ["OKX", "BINANCE", "COINBASE_EXCHANGE"],
      threshold: 3,
      cooldownMs: 60_000,
      toastMs: 2200,
    },

    refreshMs: 5000,

    position: { mode: "custom", top: 774, left: 3 },
    size: { width: 216, height: 151 },

    drag: { requireShift: true },

    // Auto logo (best-effort). If coin.logo is provided, it overrides auto fetch.
    autoLogo: {
      enabled: true,
      // Source: spothq cryptocurrency-icons on GitHub (PNG). Not all symbols exist.
      // Fallback behavior: onerror -> show letter badge.
      source: "spothq",
      // Prefer icon size path. Common options in that repo: 32, 64, 128 (folder names may vary by branch).
      // This script uses a stable path: 64/color/<symbol>.png
      size: 64,
    },

    quote: "USDT",
    unitSymbol: {
      USDT: "$",
      USD: "$",
      USDC: "$",
      CNY: "¥",
      EUR: "€",
      JPY: "¥",
      BTC: "BTC",
      ETH: "ETH",
    },

    showPct: true,
    showAbs: false,

    decimals: { ge1: 4, ge1000: 2, lt1: 8 },

    changeBase: { mode: "OKX_sodUtc8", label: "今日(UTC+8)" },

    colors: {
      up: "#16c784",
      down: "#ea3943",
      flat: "#9aa4b2",
      text: "#eaecef",
      bg: "rgba(17, 24, 39, 0.88)",
      border: "rgba(255,255,255,0.12)",
    },

    coins: [
      { base: "BTC", quote: "USDT", label: "BTC", logo: "" },
      { base: "ETH", quote: "USDT", label: "ETH", logo: "" },
      { base: "DOGE", quote: "USDT", label: "DOGE", logo: "" },
    ],

    ui: {
      compact: true,
      fontSize: 11,
      headerPadY: 5,
      headerPadX: 7,
      bodyPadY: 6,
      bodyPadX: 7,
      rowPadY: 4,
      rowPadX: 6,
      gap: 5,
      borderRadius: 10,
      buttonPadY: 2,
      buttonPadX: 6,
    },
  };

  function deepMerge(a, b) {
    if (!b) return a;
    const out = Array.isArray(a) ? [...a] : { ...a };
    for (const k of Object.keys(b)) {
      if (
        b[k] &&
        typeof b[k] === "object" &&
        !Array.isArray(b[k]) &&
        a &&
        typeof a[k] === "object" &&
        !Array.isArray(a[k])
      ) out[k] = deepMerge(a[k], b[k]);
      else out[k] = b[k];
    }
    return out;
  }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function toNum(x) { const n = Number(x); return Number.isFinite(n) ? n : NaN; }
  function safeJsonParse(s) { try { return JSON.parse(s); } catch { return null; } }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }
  const now = () => Date.now();

  async function loadSettings() {
    const raw = await GM_getValue(STORE_KEY, "");
    const parsed = raw ? safeJsonParse(raw) : null;
    return deepMerge(DEFAULT_SETTINGS, parsed || {});
  }
  async function saveSettings(s) {
    await GM_setValue(STORE_KEY, JSON.stringify(s));
  }

  // ---------------------------------------------------------------------------
  // Network (CORS-safe)
  // ---------------------------------------------------------------------------
  function gmGetJson(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout: 10000,
        headers: { Accept: "application/json" },
        onload: (res) => {
          try { resolve(JSON.parse(res.responseText)); }
          catch (e) { reject(e); }
        },
        onerror: () => reject(new Error("network error")),
        ontimeout: () => reject(new Error("timeout")),
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Exchanges
  // fetch() returns: { last, base, pct, abs, ts }
  // marketUrl() returns click-through URL
  // ---------------------------------------------------------------------------
  const EXCHANGES = {
    OKX: {
      id: "OKX",
      name: "OKX",
      pairId(coin) { return `${coin.base}-${coin.quote}`; },
      apiUrl(coin) { return `https://www.okx.com/api/v5/market/ticker?instId=${encodeURIComponent(this.pairId(coin))}`; },
      async fetch(coin, settings) {
        const json = await gmGetJson(this.apiUrl(coin));
        if (!json || json.code !== "0" || !json.data?.[0]) throw new Error("OKX bad response");
        const t = json.data[0];

        const last = toNum(t.last);
        const ts = toNum(t.ts) || now();

        let baseField = "sodUtc8";
        if (settings.changeBase.mode === "OKX_sodUtc0") baseField = "sodUtc0";
        else if (settings.changeBase.mode === "OKX_open24h") baseField = "open24h";

        const base = toNum(t[baseField]);
        if (!Number.isFinite(last) || !Number.isFinite(base) || base <= 0) throw new Error("OKX missing fields");

        return { last, base, pct: ((last - base) / base) * 100, abs: (last - base), ts };
      },
      marketUrl(coin) { return `https://www.okx.com/trade-spot/${coin.base.toLowerCase()}-${coin.quote.toLowerCase()}`; },
    },

    BINANCE: {
      id: "BINANCE",
      name: "Binance",
      pairId(coin) { return `${coin.base}${coin.quote}`; },
      apiUrl(coin) { return `https://api.binance.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(this.pairId(coin))}`; },
      async fetch(coin) {
        const json = await gmGetJson(this.apiUrl(coin));
        const last = toNum(json.lastPrice);
        const open = toNum(json.openPrice);
        const abs = toNum(json.priceChange);
        const pct = toNum(String(json.priceChangePercent).replace("%", ""));
        if (!Number.isFinite(last) || !Number.isFinite(open) || open <= 0) throw new Error("BINANCE missing fields");
        const pct2 = ((last - open) / open) * 100;
        return { last, base: open, pct: Number.isFinite(pct) ? pct : pct2, abs: Number.isFinite(abs) ? abs : (last - open), ts: now() };
      },
      marketUrl(coin) { return `https://www.binance.com/en/trade/${coin.base}_${coin.quote}`; },
    },

    COINBASE_EXCHANGE: {
      id: "COINBASE_EXCHANGE",
      name: "Coinbase Exchange",
      pairId(coin) { return `${coin.base}-${coin.quote}`; },
      apiUrlStats(coin) { return `https://api.exchange.coinbase.com/products/${encodeURIComponent(this.pairId(coin))}/stats`; },
      async fetch(coin) {
        const json = await gmGetJson(this.apiUrlStats(coin));
        const last = toNum(json.last);
        const open = toNum(json.open);
        if (!Number.isFinite(last) || !Number.isFinite(open) || open <= 0) throw new Error("COINBASE missing fields");
        return { last, base: open, pct: ((last - open) / open) * 100, abs: (last - open), ts: now() };
      },
      marketUrl(coin) { return `https://exchange.coinbase.com/trade/${coin.base}-${coin.quote}`; },
    },
  };

  // ---------------------------------------------------------------------------
  // Auto logo resolver (best-effort)
  // ---------------------------------------------------------------------------
  function normalizeSymbolForIcon(symbol) {
    return String(symbol || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  function resolveAutoLogoUrl(symbol) {
    // spothq cryptocurrency-icons repo:
    // https://github.com/spothq/cryptocurrency-icons
    // PNG path (commonly used): 64/color/<symbol>.png
    const sym = normalizeSymbolForIcon(symbol);
    if (!sym) return "";
    return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/64/color/${encodeURIComponent(sym)}.png`;
  }

  // ---------------------------------------------------------------------------
  // Formatting
  // ---------------------------------------------------------------------------
  function unitPrefix(quote) { return settings.unitSymbol?.[quote] ?? quote; }
  function formatPrice(n) {
    if (!Number.isFinite(n)) return "--";
    const d = settings.decimals || DEFAULT_SETTINGS.decimals;
    const digits = n >= 1000 ? d.ge1000 : n >= 1 ? d.ge1 : d.lt1;
    return n.toLocaleString(undefined, { maximumFractionDigits: digits });
  }
  function formatSigned(n, digits = 2) {
    if (!Number.isFinite(n)) return "--";
    const sign = n > 0 ? "+" : "";
    return sign + n.toFixed(digits);
  }
  function pickClass(pct) {
    if (!Number.isFinite(pct) || pct === 0) return "cctp-flat";
    return pct > 0 ? "cctp-up" : "cctp-down";
  }

  // ---------------------------------------------------------------------------
  // UI CSS
  // ---------------------------------------------------------------------------
  function buildCss() {
    const c = settings.colors;
    const ui = settings.ui || DEFAULT_SETTINGS.ui;

    const fs = clamp(Number(ui.fontSize) || 11, 9, 14);
    const hdrPy = clamp(Number(ui.headerPadY) || 5, 2, 10);
    const hdrPx = clamp(Number(ui.headerPadX) || 7, 4, 14);
    const bodyPy = clamp(Number(ui.bodyPadY) || 6, 2, 12);
    const bodyPx = clamp(Number(ui.bodyPadX) || 7, 4, 14);
    const rowPy = clamp(Number(ui.rowPadY) || 4, 2, 10);
    const rowPx = clamp(Number(ui.rowPadX) || 6, 3, 14);
    const gap = clamp(Number(ui.gap) || 5, 3, 10);
    const br = clamp(Number(ui.borderRadius) || 10, 8, 16);
    const btnPy = clamp(Number(ui.buttonPadY) || 2, 1, 8);
    const btnPx = clamp(Number(ui.buttonPadX) || 6, 4, 12);

    return `
      #cctp-box{
        position:fixed;
        z-index:2147483647;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
        font-size:${fs}px;
        line-height:1.25;
        border-radius:${br}px;
        color:${c.text};
        background:${c.bg};
        border:1px solid ${c.border};
        box-shadow:0 10px 26px rgba(0,0,0,0.38);
        overflow:hidden;
        resize: both;
        min-width: 170px;
        min-height: 112px;
        max-width: min(70vw, 460px);
        max-height: 70vh;
      }
      #cctp-box *{ box-sizing:border-box; }
      .cctp-up{ color:${c.up}; }
      .cctp-down{ color:${c.down}; }
      .cctp-flat{ color:${c.flat}; }
      .cctp-muted{ opacity:0.75; }

      #cctp-hdr{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:${gap + 2}px;
        padding:${hdrPy}px ${hdrPx}px;
        cursor: move;
        user-select:none;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        flex-wrap: wrap;
      }
      #cctp-title{
        display:flex;
        flex-direction:column;
        gap: 1px;
        min-width: 110px;
        flex: 1 1 auto;
        max-width: 100%;
      }
      #cctp-title .cctp-title-main{
        font-weight:900;
        letter-spacing:0.2px;
        display:flex;
        gap: 6px;
        align-items: baseline;
        flex-wrap: wrap;
      }
      #cctp-subtitle{
        font-size:${Math.max(10, fs - 1)}px;
        opacity:0.78;
        font-weight:650;
        white-space: normal;
        word-break: break-word;
      }
      #cctp-btns{
        display:flex;
        gap:${gap}px;
        align-items:center;
        flex: 0 0 auto;
        flex-wrap: wrap;
        justify-content:flex-end;
        max-width: 100%;
      }
      #cctp-btns button{
        cursor:pointer;
        border:1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
        padding:${btnPy}px ${btnPx}px;
        border-radius:9px;
        font-size:${Math.max(10, fs - 1)}px;
        color:inherit;
        white-space: nowrap;
      }
      #cctp-btns button:hover{ background: rgba(255,255,255,0.10); }

      #cctp-body{ padding:${bodyPy}px ${bodyPx}px ${bodyPy + 1}px; }
      #cctp-rows{ display:grid; gap:${gap}px; }

      .cctp-row{
        display:grid;
        grid-template-columns: 20px 40px minmax(0, 1fr) auto;
        gap:${gap + 1}px;
        align-items:center;
        padding:${rowPy}px ${rowPx}px;
        border-radius:${br - 2}px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.06);
        cursor:pointer;
        min-width:0;
      }
      .cctp-row:hover{
        border-color: rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
      }
      .cctp-logo{
        width:16px;
        height:16px;
        border-radius:5px;
        background: rgba(255,255,255,0.10);
        display:flex;
        align-items:center;
        justify-content:center;
        overflow:hidden;
        font-size:${Math.max(9, fs - 2)}px;
        opacity:0.95;
      }
      .cctp-logo img{
        width:100%;
        height:100%;
        object-fit:contain;
        display:block;
      }
      .cctp-sym{ font-weight:900; }
      .cctp-price, .cctp-chg{
        font-variant-numeric: tabular-nums;
        min-width:0;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .cctp-chg{ text-align:right; }

      #cctp-box[data-narrow="1"] .cctp-row{
        grid-template-columns: 20px 40px minmax(0, 1fr);
        grid-template-rows: auto auto;
        row-gap: 3px;
        align-items:start;
      }
      #cctp-box[data-narrow="1"] .cctp-row .cctp-chg{
        grid-column: 2 / 4;
        justify-self: end;
      }

      .cctp-foot{
        margin-top:${gap + 1}px;
        display:flex;
        justify-content:space-between;
        gap:${gap + 2}px;
        font-size:${Math.max(10, fs - 1)}px;
        opacity:0.72;
        flex-wrap: wrap;
      }

      #cctp-toast{
        position:fixed;
        z-index:2147483647;
        left:50%;
        top:14px;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.65);
        color:#fff;
        padding: 7px 9px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.12);
        box-shadow: 0 10px 24px rgba(0,0,0,0.35);
        font-size:${Math.max(11, fs)}px;
        display:none;
        user-select:none;
        max-width: min(92vw, 560px);
        white-space: normal;
        word-break: break-word;
      }

      #cctp-box.minimized #cctp-body{ display:none; }

      /* ===== Config Panel ===== */
      #cctp-config-overlay{
        position:fixed; inset:0;
        z-index:2147483647;
        background: rgba(0,0,0,0.55);
        display:flex; align-items:center; justify-content:center;
        padding: 18px;
      }
      #cctp-config{
        width: min(980px, 94vw);
        max-height: 88vh;
        overflow:auto;
        border-radius: 16px;
        background: #0b1220;
        color: #eaecef;
        border: 1px solid rgba(255,255,255,0.12);
        box-shadow: 0 18px 50px rgba(0,0,0,0.5);
      }
      #cctp-config .top{
        position: sticky; top: 0;
        display:flex; justify-content:space-between; align-items:flex-start;
        gap: 10px;
        padding: 14px 16px;
        background: #0b1220;
        border-bottom: 1px solid rgba(255,255,255,0.10);
        z-index: 2;
        flex-wrap: wrap;
      }
      #cctp-config h2{ margin:0; font-size: 15px; }
      #cctp-config .hint{ opacity:0.72; font-size:12px; font-weight: 500; }
      #cctp-config .btns{ display:flex; gap:8px; flex-wrap: wrap; justify-content:flex-end; }
      #cctp-config button{
        cursor:pointer;
        border:1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
        color:#eaecef;
        padding: 7px 10px;
        border-radius: 10px;
        font-size: 12px;
        white-space: nowrap;
      }
      #cctp-config button:hover{ background: rgba(255,255,255,0.10); }
      #cctp-config .sec{ padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
      #cctp-config .grid{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; align-items:start; }
      #cctp-config .row2{ display:grid; grid-template-columns: 1fr 1fr; gap:10px; align-items:start; }
      #cctp-config label{ display:block; font-size: 12px; opacity: 0.86; margin-bottom: 6px; }
      #cctp-config input, #cctp-config select, #cctp-config textarea{
        width: 100%;
        background: rgba(255,255,255,0.05);
        color:#eaecef;
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 10px;
        padding: 8px 10px;
        font-size: 12px;
        outline: none;
        min-width: 0;
      }
      #cctp-config textarea{
        min-height: 110px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        resize: vertical;
      }
      #cctp-config .warn{ margin-top: 8px; font-size: 12px; color: #fbbf24; opacity: 0.95; }
      #cctp-config .small{ font-size: 12px; opacity: 0.72; margin-top: 6px; }
      #cctp-config .kbd{ font-family: ui-monospace, monospace; opacity: 0.9; }

      @media (max-width: 760px){
        #cctp-config .grid{ grid-template-columns: 1fr; }
        #cctp-config .row2{ grid-template-columns: 1fr; }
      }
    `;
  }

  // ---------------------------------------------------------------------------
  // Positioning & interaction
  // ---------------------------------------------------------------------------
  function applyPosition(el) {
    el.style.top = "";
    el.style.left = "";
    el.style.right = "";
    el.style.bottom = "";
    if (settings.position.mode === "custom") {
      el.style.top = `${settings.position.top}px`;
      el.style.left = `${settings.position.left}px`;
      return;
    }
    const pad = 10;
    const corner = settings.corner || "top-right";
    if (corner === "top-left") { el.style.top = `${pad}px`; el.style.left = `${pad}px`; }
    else if (corner === "bottom-left") { el.style.bottom = `${pad}px`; el.style.left = `${pad}px`; }
    else if (corner === "bottom-right") { el.style.bottom = `${pad}px`; el.style.right = `${pad}px`; }
    else { el.style.top = `${pad}px`; el.style.right = `${pad}px`; }
  }

  function makeDraggable(box, handle) {
    let dragging = false;
    let startX = 0, startY = 0, startTop = 0, startLeft = 0;
    const requireShift = !!settings.drag?.requireShift;

    const onDown = (e) => {
      if (e.target && e.target.tagName === "BUTTON") return;
      if (requireShift && !e.shiftKey) { showToast("按住 Shift 再拖拽移动窗口"); return; }

      dragging = true;
      const rect = box.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startTop = rect.top;
      startLeft = rect.left;

      settings.position.mode = "custom";
      settings.position.top = Math.round(rect.top);
      settings.position.left = Math.round(rect.left);

      box.style.right = "";
      box.style.bottom = "";
      box.style.top = `${settings.position.top}px`;
      box.style.left = `${settings.position.left}px`;

      document.addEventListener("mousemove", onMove, true);
      document.addEventListener("mouseup", onUp, true);
      e.preventDefault();
    };

    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      const rect = box.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      const newTop = clamp(startTop + dy, 0, vh - Math.max(40, h));
      const newLeft = clamp(startLeft + dx, 0, vw - Math.max(60, w));

      box.style.top = `${Math.round(newTop)}px`;
      box.style.left = `${Math.round(newLeft)}px`;
      settings.position.top = Math.round(newTop);
      settings.position.left = Math.round(newLeft);
    };

    const onUp = async () => {
      if (!dragging) return;
      dragging = false;
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("mouseup", onUp, true);
      await saveSettings(settings);
    };

    handle.addEventListener("mousedown", onDown, true);
  }

  function updateNarrowFlag(box) {
    // Default width=216 remains data-narrow="0"
    const w = box.getBoundingClientRect().width;
    box.dataset.narrow = w < 215 ? "1" : "0";
  }

  function attachResizePersistence(box) {
    const ro = new ResizeObserver(async () => {
      const rect = box.getBoundingClientRect();
      settings.size.width = Math.round(rect.width);
      settings.size.height = Math.round(rect.height);
      await saveSettings(settings);
      updateNarrowFlag(box);
    });
    ro.observe(box);
  }

  // ---------------------------------------------------------------------------
  // Toast
  // ---------------------------------------------------------------------------
  let toastEl = null;
  let toastTimer = null;

  function ensureToast() {
    if (toastEl) return;
    toastEl = document.createElement("div");
    toastEl.id = "cctp-toast";
    document.documentElement.appendChild(toastEl);
  }

  function showToast(msg, ms) {
    ensureToast();
    toastEl.textContent = msg;
    toastEl.style.display = "block";
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.style.display = "none"; }, ms ?? settings.autoFallback.toastMs ?? 2000);
  }

  // ---------------------------------------------------------------------------
  // Main card UI
  // ---------------------------------------------------------------------------
  function createBox() {
    GM_addStyle(buildCss());
    ensureToast();

    const box = document.createElement("div");
    box.id = "cctp-box";
    box.style.width = `${settings.size.width}px`;
    box.style.height = `${settings.size.height}px`;
    applyPosition(box);

    box.innerHTML = `
      <div id="cctp-hdr" title="${settings.drag?.requireShift ? "按住 Shift 拖拽移动；" : ""}右下角可调整大小">
        <div id="cctp-title">
          <div class="cctp-title-main"><span>行情</span></div>
          <div id="cctp-subtitle">${escapeHtml(EXCHANGES[settings.exchange]?.name || settings.exchange)} · ${escapeHtml(settings.changeBase.label || "")}</div>
        </div>
        <div id="cctp-btns">
          <button type="button" id="cctp-refresh">刷新</button>
          <button type="button" id="cctp-toggle">收起</button>
        </div>
      </div>
      <div id="cctp-body">
        <div id="cctp-rows"></div>
        <div class="cctp-foot">
          <span class="cctp-muted" id="cctp-status">初始化…</span>
          <span class="cctp-muted" id="cctp-time">--:--:--</span>
        </div>
      </div>
    `;
    document.documentElement.appendChild(box);

    makeDraggable(box, box.querySelector("#cctp-hdr"));
    attachResizePersistence(box);

    box.querySelector("#cctp-toggle").addEventListener("click", () => {
      box.classList.toggle("minimized");
      box.querySelector("#cctp-toggle").textContent = box.classList.contains("minimized") ? "展开" : "收起";
    });
    box.querySelector("#cctp-refresh").addEventListener("click", () => updateAll(true));

    updateNarrowFlag(box);
    return box;
  }

  function buildLogoNode(coin) {
    const wrapper = document.createElement("div");
    wrapper.className = "cctp-logo";

    // Priority: explicit logo > auto logo > letter badge
    const explicit = (coin.logo || "").trim();
    const autoEnabled = !!settings.autoLogo?.enabled;
    const autoUrl = (!explicit && autoEnabled) ? resolveAutoLogoUrl(coin.base) : "";

    const letter = escapeHtml((coin.base || "?").slice(0, 1).toUpperCase());

    if (explicit || autoUrl) {
      const img = document.createElement("img");
      img.alt = (coin.label || coin.base || "").trim();
      img.src = explicit || autoUrl;

      // If auto logo fails, fall back to letter badge
      img.onerror = () => {
        wrapper.textContent = letter;
      };

      wrapper.appendChild(img);
      return wrapper;
    }

    wrapper.textContent = letter;
    return wrapper;
  }

  function renderRows(box) {
    const rows = box.querySelector("#cctp-rows");
    rows.innerHTML = "";

    for (const coin of settings.coins) {
      const row = document.createElement("div");
      row.className = "cctp-row";
      row.dataset.base = coin.base;
      row.dataset.quote = coin.quote;

      const logoNode = buildLogoNode(coin);
      const symNode = document.createElement("div");
      symNode.className = "cctp-sym";
      symNode.textContent = coin.label || coin.base;

      const priceNode = document.createElement("div");
      priceNode.className = "cctp-price cctp-muted";
      priceNode.textContent = "--";

      const chgNode = document.createElement("div");
      chgNode.className = "cctp-chg cctp-muted";
      chgNode.textContent = "--";

      row.appendChild(logoNode);
      row.appendChild(symNode);
      row.appendChild(priceNode);
      row.appendChild(chgNode);

      row.addEventListener("click", () => {
        const ex = EXCHANGES[settings.exchange];
        if (!ex) return;
        GM_openInTab(ex.marketUrl(coin), { active: true, insert: true });
      });

      rows.appendChild(row);
    }
  }

  function setStatus(text) {
    const el = boxEl?.querySelector("#cctp-status");
    if (el) el.textContent = text;
  }

  function setTime(ts) {
    const el = boxEl?.querySelector("#cctp-time");
    if (el) el.textContent = (ts ? new Date(ts) : new Date()).toLocaleTimeString();
  }

  function setRow(coin, data) {
    const rows = boxEl.querySelectorAll(".cctp-row");
    let target = null;
    for (const r of rows) {
      if (r.dataset.base === coin.base && r.dataset.quote === coin.quote) { target = r; break; }
    }
    if (!target) return;

    const priceEl = target.querySelector(".cctp-price");
    const chgEl = target.querySelector(".cctp-chg");

    const quote = coin.quote || settings.quote;
    const prefix = unitPrefix(quote);

    priceEl.classList.remove("cctp-muted");
    priceEl.textContent = `${prefix}${formatPrice(data.last)}`;

    const parts = [];
    if (settings.showPct) parts.push(`${formatSigned(data.pct, 2)}%`);
    if (settings.showAbs) parts.push(`${formatSigned(data.abs, 6)}`);

    chgEl.classList.remove("cctp-muted", "cctp-up", "cctp-down", "cctp-flat");
    chgEl.classList.add(pickClass(data.pct));
    chgEl.textContent = parts.length ? parts.join(" · ") : "--";
  }

  function setRowError(coin) {
    const rows = boxEl.querySelectorAll(".cctp-row");
    for (const r of rows) {
      if (r.dataset.base === coin.base && r.dataset.quote === coin.quote) {
        const p = r.querySelector(".cctp-price");
        const c = r.querySelector(".cctp-chg");
        p.textContent = "--";
        c.textContent = "--";
        p.classList.add("cctp-muted");
        c.classList.add("cctp-muted");
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Fallback logic
  // ---------------------------------------------------------------------------
  const runtime = { consecutiveFailures: 0, lastSwitchAt: 0, orderIndex: 0 };

  function normalizeFallbackOrder() {
    const order = Array.isArray(settings.autoFallback?.order) ? settings.autoFallback.order.slice() : [];
    const uniq = [];
    for (const id of order) if (EXCHANGES[id] && !uniq.includes(id)) uniq.push(id);
    if (!uniq.includes(settings.exchange) && EXCHANGES[settings.exchange]) uniq.unshift(settings.exchange);
    for (const id of Object.keys(EXCHANGES)) if (!uniq.includes(id)) uniq.push(id);
    settings.autoFallback.order = uniq;
  }

  function updateOrderIndexByExchange() {
    const order = settings.autoFallback.order;
    const idx = order.indexOf(settings.exchange);
    runtime.orderIndex = idx >= 0 ? idx : 0;
  }

  async function maybeFallback() {
    const af = settings.autoFallback;
    if (!af?.enabled) return false;

    normalizeFallbackOrder();
    updateOrderIndexByExchange();

    const threshold = clamp(Number(af.threshold) || 3, 1, 50);
    if (runtime.consecutiveFailures < threshold) return false;

    const cooldown = clamp(Number(af.cooldownMs) || 60_000, 0, 24 * 3600_000);
    if (now() - runtime.lastSwitchAt < cooldown) return false;

    const order = af.order;
    const nextIdx = (runtime.orderIndex + 1) % order.length;
    const nextEx = order[nextIdx];
    if (!EXCHANGES[nextEx] || nextEx === settings.exchange) return false;

    const prev = settings.exchange;
    settings.exchange = nextEx;

    if (nextEx === "OKX") { settings.changeBase.mode = "OKX_sodUtc8"; settings.changeBase.label = "今日(UTC+8)"; }
    else if (nextEx === "BINANCE") { settings.changeBase.mode = "BINANCE_24h"; settings.changeBase.label = "24h"; }
    else { settings.changeBase.mode = "COINBASE_24h"; settings.changeBase.label = "24h"; }

    runtime.lastSwitchAt = now();
    runtime.consecutiveFailures = 0;

    await saveSettings(settings);
    applyAllNow(false);
    showToast(`数据源自动切换：${EXCHANGES[prev].name} → ${EXCHANGES[nextEx].name}`, af.toastMs);
    return true;
  }

  // ---------------------------------------------------------------------------
  // Update loop
  // ---------------------------------------------------------------------------
  let timer = null;
  let inFlight = false;

  async function updateAll(manual = false) {
    if (inFlight) return;
    inFlight = true;

    const ex = EXCHANGES[settings.exchange];
    if (!ex) { inFlight = false; return; }

    setStatus(manual ? "手动刷新…" : "更新中…");

    try {
      const results = await Promise.allSettled(settings.coins.map((c) => ex.fetch(c, settings)));
      let anyOk = false;
      let maxTs = 0;

      for (let i = 0; i < results.length; i++) {
        const coin = settings.coins[i];
        const r = results[i];
        if (r.status === "fulfilled") {
          anyOk = true;
          maxTs = Math.max(maxTs, r.value.ts || 0);
          setRow(coin, r.value);
        } else {
          setRowError(coin);
        }
      }

      if (anyOk) {
        runtime.consecutiveFailures = 0;
        setStatus("OK");
        setTime(maxTs);
      } else {
        runtime.consecutiveFailures += 1;
        setStatus(`失败 x${runtime.consecutiveFailures}`);
        setTime();
        await maybeFallback();
      }
    } catch {
      runtime.consecutiveFailures += 1;
      setStatus(`异常 x${runtime.consecutiveFailures}`);
      setTime();
      for (const c of settings.coins) setRowError(c);
      await maybeFallback();
    } finally {
      inFlight = false;
    }
  }

  function restartTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => updateAll(false), clamp(Number(settings.refreshMs) || 5000, 1000, 3600_000));
  }

  // ---------------------------------------------------------------------------
  // Config panel (no extra UI for autoLogo; auto enabled by default)
  // ---------------------------------------------------------------------------
  function openConfigPanel() {
    const existing = document.getElementById("cctp-config-overlay");
    if (existing) { existing.style.display = "flex"; return; }

    const overlay = document.createElement("div");
    overlay.id = "cctp-config-overlay";

    const config = document.createElement("div");
    config.id = "cctp-config";

    config.innerHTML = `
      <div class="top">
        <div style="display:flex;flex-direction:column;gap:6px;min-width:220px;flex:1 1 auto;">
          <h2>Corner Crypto Ticker Pro · 配置</h2>
          <div class="hint">保存后立即生效；导入导出用于备份/迁移配置。</div>
        </div>
        <div class="btns">
          <button type="button" id="cctp-cfg-export">导出到剪贴板</button>
          <button type="button" id="cctp-cfg-import">从剪贴板导入</button>
          <button type="button" id="cctp-cfg-close">关闭</button>
        </div>
      </div>

      <div class="sec">
        <div class="grid">
          <div>
            <label>数据来源交易所（主源）</label>
            <select id="cctp-cfg-exchange">
              <option value="OKX">OKX</option>
              <option value="BINANCE">Binance</option>
              <option value="COINBASE_EXCHANGE">Coinbase Exchange</option>
            </select>
            <div class="small">切换后：API 拉取与“点击跳转”会随之改变。</div>
          </div>

          <div>
            <label>刷新频率（毫秒）</label>
            <input id="cctp-cfg-refresh" type="number" min="1000" step="500" />
            <div class="warn">频率过快可能触发限速/风控。建议 ≥ 3000ms。</div>
          </div>
        </div>
      </div>

      <div class="sec">
        <div class="grid">
          <div>
            <label>拖拽设置</label>
            <label style="margin:0;opacity:0.86;">
              <input type="checkbox" id="cctp-cfg-shiftDrag" style="width:auto;vertical-align:middle;margin-right:6px;">
              需要按住 Shift 才能拖拽移动
            </label>
          </div>

          <div>
            <label>自动 fallback 数据源</label>
            <label style="margin:0;opacity:0.86;">
              <input type="checkbox" id="cctp-cfg-fallbackOn" style="width:auto;vertical-align:middle;margin-right:6px;">
              开启自动切换数据源（主源连续失败后）
            </label>
          </div>
        </div>

        <div class="grid" style="margin-top:12px;">
          <div>
            <label>fallback 失败阈值（连续失败次数）</label>
            <input id="cctp-cfg-fallbackThreshold" type="number" min="1" step="1" />
          </div>
          <div>
            <label>fallback 冷却时间（毫秒）</label>
            <input id="cctp-cfg-fallbackCooldown" type="number" min="0" step="1000" />
          </div>
        </div>

        <div class="grid" style="margin-top:12px;">
          <div>
            <label>fallback 顺序（JSON 数组）</label>
            <input id="cctp-cfg-fallbackOrder" />
            <div class="small">例如 <span class="kbd">["OKX","BINANCE","COINBASE_EXCHANGE"]</span></div>
          </div>
          <div>
            <label>切换提示时长（毫秒）</label>
            <input id="cctp-cfg-toastMs" type="number" min="500" step="100" />
          </div>
        </div>
      </div>

      <div class="sec">
        <div class="grid">
          <div>
            <label>涨跌显示</label>
            <div class="row2">
              <label style="margin:0;opacity:0.86;">
                <input type="checkbox" id="cctp-cfg-showPct" style="width:auto;vertical-align:middle;margin-right:6px;">
                显示涨跌幅(%)
              </label>
              <label style="margin:0;opacity:0.86;">
                <input type="checkbox" id="cctp-cfg-showAbs" style="width:auto;vertical-align:middle;margin-right:6px;">
                显示涨跌额
              </label>
            </div>
          </div>

          <div>
            <label>涨跌幅基准</label>
            <select id="cctp-cfg-baseMode"></select>
            <div class="small">OKX：今日(UTC+8/UTC0) 或 24h；其他交易所：24h。</div>
          </div>
        </div>
      </div>

      <div class="sec">
        <div class="grid">
          <div>
            <label>颜色（HEX / rgba）</label>
            <div class="row2">
              <input id="cctp-cfg-up" placeholder="上涨颜色" />
              <input id="cctp-cfg-down" placeholder="下跌颜色" />
            </div>
            <div class="row2" style="margin-top:8px;">
              <input id="cctp-cfg-flat" placeholder="持平颜色" />
              <input id="cctp-cfg-bg" placeholder="背景色" />
            </div>
          </div>

          <div>
            <label>货币单位符号（JSON：quote->symbol）</label>
            <textarea id="cctp-cfg-unitMap"></textarea>
          </div>
        </div>
      </div>

      <div class="sec">
        <label>自定义显示币种（JSON 数组）</label>
        <textarea id="cctp-cfg-coins"></textarea>
        <div class="small">未填写 logo 时，将尝试自动抓取；填写 logo 则优先使用自定义。</div>
      </div>

      <div class="sec">
        <div class="grid">
          <div>
            <label>默认位置（custom 模式，px）</label>
            <div class="row2">
              <input id="cctp-cfg-top" type="number" step="1" placeholder="top" />
              <input id="cctp-cfg-left" type="number" step="1" placeholder="left" />
            </div>
          </div>

          <div>
            <label>默认尺寸（px）</label>
            <div class="row2">
              <input id="cctp-cfg-width" type="number" min="150" step="1" placeholder="width" />
              <input id="cctp-cfg-height" type="number" min="100" step="1" placeholder="height" />
            </div>
          </div>
        </div>
      </div>

      <div class="sec">
        <div class="grid">
          <div>
            <label>操作</label>
            <div class="row2">
              <button type="button" id="cctp-cfg-save">保存并应用</button>
              <button type="button" id="cctp-cfg-reset">恢复默认</button>
            </div>
          </div>
          <div>
            <label>提示</label>
            <div class="small">若图标未显示，通常是该币种在图标库中缺失或网络不可达；可在币种 JSON 中填入 logo URL 覆盖。</div>
          </div>
        </div>
      </div>
    `;

    overlay.appendChild(config);
    document.documentElement.appendChild(overlay);

    config.querySelector("#cctp-cfg-close").addEventListener("click", () => { overlay.style.display = "none"; });
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.style.display = "none"; });

    config.querySelector("#cctp-cfg-exchange").value = settings.exchange;
    config.querySelector("#cctp-cfg-refresh").value = settings.refreshMs;

    config.querySelector("#cctp-cfg-shiftDrag").checked = !!settings.drag?.requireShift;

    config.querySelector("#cctp-cfg-fallbackOn").checked = !!settings.autoFallback?.enabled;
    config.querySelector("#cctp-cfg-fallbackThreshold").value = settings.autoFallback?.threshold ?? 3;
    config.querySelector("#cctp-cfg-fallbackCooldown").value = settings.autoFallback?.cooldownMs ?? 60000;
    config.querySelector("#cctp-cfg-fallbackOrder").value = JSON.stringify(settings.autoFallback?.order ?? ["OKX", "BINANCE", "COINBASE_EXCHANGE"]);
    config.querySelector("#cctp-cfg-toastMs").value = settings.autoFallback?.toastMs ?? 2200;

    config.querySelector("#cctp-cfg-showPct").checked = !!settings.showPct;
    config.querySelector("#cctp-cfg-showAbs").checked = !!settings.showAbs;

    config.querySelector("#cctp-cfg-up").value = settings.colors.up;
    config.querySelector("#cctp-cfg-down").value = settings.colors.down;
    config.querySelector("#cctp-cfg-flat").value = settings.colors.flat;
    config.querySelector("#cctp-cfg-bg").value = settings.colors.bg;

    config.querySelector("#cctp-cfg-unitMap").value = JSON.stringify(settings.unitSymbol, null, 2);
    config.querySelector("#cctp-cfg-coins").value = JSON.stringify(settings.coins, null, 2);

    config.querySelector("#cctp-cfg-top").value = settings.position?.top ?? 0;
    config.querySelector("#cctp-cfg-left").value = settings.position?.left ?? 0;
    config.querySelector("#cctp-cfg-width").value = settings.size?.width ?? 216;
    config.querySelector("#cctp-cfg-height").value = settings.size?.height ?? 151;

    const baseSel = config.querySelector("#cctp-cfg-baseMode");
    function fillBaseOptions(exchangeId) {
      baseSel.innerHTML = "";
      const opts =
        exchangeId === "OKX"
          ? [
              { v: "OKX_sodUtc8", t: "今日(UTC+8)（sodUtc8）" },
              { v: "OKX_sodUtc0", t: "今日(UTC0)（sodUtc0）" },
              { v: "OKX_open24h", t: "24h（open24h）" },
            ]
          : exchangeId === "BINANCE"
          ? [{ v: "BINANCE_24h", t: "24h（openPrice）" }]
          : [{ v: "COINBASE_24h", t: "24h（stats.open）" }];

      for (const o of opts) {
        const opt = document.createElement("option");
        opt.value = o.v;
        opt.textContent = o.t;
        baseSel.appendChild(opt);
      }
    }
    fillBaseOptions(settings.exchange);
    baseSel.value = settings.changeBase.mode;

    config.querySelector("#cctp-cfg-exchange").addEventListener("change", (e) => {
      fillBaseOptions(e.target.value);
      baseSel.value =
        e.target.value === "OKX" ? "OKX_sodUtc8" :
        e.target.value === "BINANCE" ? "BINANCE_24h" :
        "COINBASE_24h";
    });

    config.querySelector("#cctp-cfg-export").addEventListener("click", async () => {
      const txt = JSON.stringify(settings, null, 2);
      await navigator.clipboard.writeText(txt);
      alert("已复制当前配置到剪贴板。");
    });

    config.querySelector("#cctp-cfg-import").addEventListener("click", async () => {
      const txt = await navigator.clipboard.readText().catch(() => "");
      const input = prompt("粘贴配置 JSON（也可先从剪贴板读取后直接确认）：", txt || "");
      if (!input) return;
      const obj = safeJsonParse(input);
      if (!obj) { alert("JSON 解析失败"); return; }
      settings = deepMerge(DEFAULT_SETTINGS, obj);
      normalizeFallbackOrder();
      updateOrderIndexByExchange();
      await saveSettings(settings);
      applyAllNow(true);
      alert("已导入并应用。");
    });

    config.querySelector("#cctp-cfg-save").addEventListener("click", async () => {
      const next = deepMerge(DEFAULT_SETTINGS, settings);

      next.exchange = config.querySelector("#cctp-cfg-exchange").value;
      next.refreshMs = clamp(Number(config.querySelector("#cctp-cfg-refresh").value) || 5000, 1000, 3600_000);

      next.drag.requireShift = !!config.querySelector("#cctp-cfg-shiftDrag").checked;

      next.autoFallback.enabled = !!config.querySelector("#cctp-cfg-fallbackOn").checked;
      next.autoFallback.threshold = clamp(Number(config.querySelector("#cctp-cfg-fallbackThreshold").value) || 3, 1, 50);
      next.autoFallback.cooldownMs = clamp(Number(config.querySelector("#cctp-cfg-fallbackCooldown").value) || 60000, 0, 24 * 3600_000);
      next.autoFallback.toastMs = clamp(Number(config.querySelector("#cctp-cfg-toastMs").value) || 2200, 500, 20000);

      const orderObj = safeJsonParse(config.querySelector("#cctp-cfg-fallbackOrder").value);
      if (Array.isArray(orderObj) && orderObj.length) next.autoFallback.order = orderObj;

      next.showPct = !!config.querySelector("#cctp-cfg-showPct").checked;
      next.showAbs = !!config.querySelector("#cctp-cfg-showAbs").checked;

      next.changeBase.mode = baseSel.value;
      next.changeBase.label =
        (next.changeBase.mode === "OKX_sodUtc8") ? "今日(UTC+8)" :
        (next.changeBase.mode === "OKX_sodUtc0") ? "今日(UTC0)" :
        "24h";

      next.colors.up = config.querySelector("#cctp-cfg-up").value || DEFAULT_SETTINGS.colors.up;
      next.colors.down = config.querySelector("#cctp-cfg-down").value || DEFAULT_SETTINGS.colors.down;
      next.colors.flat = config.querySelector("#cctp-cfg-flat").value || DEFAULT_SETTINGS.colors.flat;
      next.colors.bg = config.querySelector("#cctp-cfg-bg").value || DEFAULT_SETTINGS.colors.bg;

      const unitObj = safeJsonParse(config.querySelector("#cctp-cfg-unitMap").value);
      if (unitObj && typeof unitObj === "object") next.unitSymbol = unitObj;

      const coinsObj = safeJsonParse(config.querySelector("#cctp-cfg-coins").value);
      if (Array.isArray(coinsObj) && coinsObj.length) next.coins = coinsObj;

      const top = Number(config.querySelector("#cctp-cfg-top").value);
      const left = Number(config.querySelector("#cctp-cfg-left").value);
      const w = Number(config.querySelector("#cctp-cfg-width").value);
      const h = Number(config.querySelector("#cctp-cfg-height").value);

      if (Number.isFinite(top) && Number.isFinite(left)) {
        next.position.mode = "custom";
        next.position.top = Math.round(top);
        next.position.left = Math.round(left);
      }

      if (Number.isFinite(w) && Number.isFinite(h)) {
        next.size.width = clamp(Math.round(w), 150, 2000);
        next.size.height = clamp(Math.round(h), 100, 2000);
      }

      settings = next;
      normalizeFallbackOrder();
      updateOrderIndexByExchange();
      await saveSettings(settings);
      applyAllNow(true);
      alert("已保存并应用。");
    });

    config.querySelector("#cctp-cfg-reset").addEventListener("click", async () => {
      if (!confirm("确认恢复默认配置？这会覆盖当前所有设置。")) return;
      settings = deepMerge({}, DEFAULT_SETTINGS);
      normalizeFallbackOrder();
      updateOrderIndexByExchange();
      await saveSettings(settings);
      applyAllNow(true);
      alert("已恢复默认并应用。");
    });
  }

  // ---------------------------------------------------------------------------
  // Apply / bootstrap
  // ---------------------------------------------------------------------------
  let boxEl = null;

  function applyAllNow(resetFailures) {
    if (resetFailures) runtime.consecutiveFailures = 0;
    if (boxEl) boxEl.remove();
    boxEl = createBox();
    renderRows(boxEl);
    restartTimer();
    updateAll(false);
  }

  function registerMenu() {
    GM_registerMenuCommand("Corner Crypto Ticker Pro · 打开配置", () => openConfigPanel());
    GM_registerMenuCommand("Corner Crypto Ticker Pro · 立即刷新", () => updateAll(true));
    GM_registerMenuCommand("Corner Crypto Ticker Pro · 切换拖拽(Shift)", async () => {
      settings.drag.requireShift = !settings.drag.requireShift;
      await saveSettings(settings);
      applyAllNow(false);
      showToast(settings.drag.requireShift ? "拖拽：需按住 Shift" : "拖拽：直接拖拽", 1800);
    });
    GM_registerMenuCommand("Corner Crypto Ticker Pro · 恢复默认", async () => {
      settings = deepMerge({}, DEFAULT_SETTINGS);
      normalizeFallbackOrder();
      updateOrderIndexByExchange();
      await saveSettings(settings);
      applyAllNow(true);
    });
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  let settings;

  (async function init() {
    settings = await loadSettings();
    normalizeFallbackOrder();
    updateOrderIndexByExchange();

    GM_addStyle(buildCss());
    ensureToast();

    registerMenu();

    boxEl = createBox();
    renderRows(boxEl);

    await saveSettings(settings);

    restartTimer();
    updateAll(false);
  })();

})();
