// ==UserScript==
// @name         KOL-EDT ↔ 星图 Douyin VV 趋势助手（直接调用星图接口版）
// @namespace    https://kol-edt.netease.com/
// @version      2.0.1
// @description  在 KOL-EDT 左下角粘贴各种 Douyin 作品链接，直接使用星图授权通过 GM_xmlhttpRequest 调接口绘制 VV 累计趋势曲线。
// @match        https://kol-edt.netease.com/*
// @match        https://www.xingtu.cn/*
// @match        https://xingtu.cn/*
// @icon         https://www.xingtu.cn/favicon.ico
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/557482/KOL-EDT%20%E2%86%94%20%E6%98%9F%E5%9B%BE%20Douyin%20VV%20%E8%B6%8B%E5%8A%BF%E5%8A%A9%E6%89%8B%EF%BC%88%E7%9B%B4%E6%8E%A5%E8%B0%83%E7%94%A8%E6%98%9F%E5%9B%BE%E6%8E%A5%E5%8F%A3%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557482/KOL-EDT%20%E2%86%94%20%E6%98%9F%E5%9B%BE%20Douyin%20VV%20%E8%B6%8B%E5%8A%BF%E5%8A%A9%E6%89%8B%EF%BC%88%E7%9B%B4%E6%8E%A5%E8%B0%83%E7%94%A8%E6%98%9F%E5%9B%BE%E6%8E%A5%E5%8F%A3%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SITE_A_HOST = 'kol-edt.netease.com';   // KOL-EDT
  const SITE_B_HOST = 'www.xingtu.cn';         // 星图
  const KEY_AUTH    = 'KOL_XT_AUTH_STATE';     // {loggedIn, ts, csrftoken, secToken...}
  const AUTH_MAX_AGE = 1000 * 60 * 60 * 12;    // 授权信息有效期（12小时）

  let globalToastEl = null;
  let kolChartInst = null;

  // ------------------- 工具函数 -------------------
  function safeParseJSON(v) {
    if (!v) return null;
    try {
      return JSON.parse(v);
    } catch (e) {
      console.warn('[KOL↔XT] safeParseJSON error:', e, 'value:', v);
      return null;
    }
  }

  function ensureToast() {
    if (globalToastEl) return globalToastEl;
    const el = document.createElement('div');
    el.id = 'kolxt-global-toast';
    el.style.display = 'none';
    document.body.appendChild(el);
    globalToastEl = el;
    return el;
  }

  function showToast(msg, ms) {
    ms = ms || 2000;
    const el = ensureToast();
    el.textContent = msg;
    el.style.display = 'block';
    clearTimeout(el.__timer);
    el.__timer = setTimeout(() => {
      el.style.display = 'none';
    }, ms);
  }

  function fmtDate(yyyymmdd) {
    const s = String(yyyymmdd);
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }

  function sumSeries(arr) {
    let acc = 0;
    return arr.map(v => (acc += Number(v || 0)));
  }

  function getCookie(name) {
    const m = document.cookie.match(
      new RegExp(
        '(?:^|; )' +
          name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') +
          '=([^;]*)'
      )
    );
    return m ? decodeURIComponent(m[1]) : '';
  }

  // ------------------- Douyin 链接解析 -------------------
  async function resolveDouyinVideoId(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return null;

    const url = rawUrl.trim();

    // 0. 直接搜 /video/123456...
    let m = url.match(/\/video\/(\d{6,})/);
    if (m && m[1]) {
      return m[1];
    }

    // 1. H5 分享页 /share/video/123...
    m = url.match(/\/share\/video\/(\d{6,})/);
    if (m && m[1]) {
      return m[1];
    }

    // 2. 解析为 URL
    let urlObj;
    try {
      if (!/^https?:\/\//i.test(url)) {
        urlObj = new URL('https://' + url);
      } else {
        urlObj = new URL(url);
      }
    } catch (e) {
      return null;
    }

    // 3. 从 URL 对象直接解析
    const directId = parseVideoIdFromUrlObject(urlObj);
    if (directId) {
      return directId;
    }

    // 4. path 里嵌套另一个 URL
    const nestedUrlMatch = urlObj.href.match(/https?:\/\/[^\s]+/g);
    if (nestedUrlMatch && nestedUrlMatch.length > 1) {
      const innerCandidate = nestedUrlMatch[nestedUrlMatch.length - 1];
      const innerId = await resolveDouyinVideoId(innerCandidate);
      if (innerId) return innerId;
    }

    // 5. 短链：v.douyin.com / iesdouyin.com
    const host = urlObj.hostname.toLowerCase();
    if (
      host === 'v.douyin.com' ||
      host === 'www.iesdouyin.com' ||
      host === 'iesdouyin.com'
    ) {
      const finalUrl = await followRedirect(urlObj.href);
      if (finalUrl && finalUrl !== urlObj.href) {
        return await resolveDouyinVideoId(finalUrl);
      }
    }

    // 6. 实在找不到
    return null;
  }

  function parseVideoIdFromUrlObject(urlObj) {
    if (!urlObj) return null;

    const path = urlObj.pathname || '';

    // /video/123456...
    let m = path.match(/\/video\/(\d{6,})/);
    if (m && m[1]) return m[1];

    // /share/video/123456...
    m = path.match(/\/share\/video\/(\d{6,})/);
    if (m && m[1]) return m[1];

    // query 中的 modal_id / video_id / item_id / aweme_id
    const sp = urlObj.searchParams;
    const candidateKeys = ['modal_id', 'video_id', 'item_id', 'aweme_id'];
    for (const key of candidateKeys) {
      const v = sp.get(key);
      if (v && /^\d{6,}$/.test(v)) {
        return v;
      }
    }

    return null;
  }

  async function followRedirect(url) {
    if (typeof GM_xmlhttpRequest === 'function') {
      return new Promise(resolve => {
        GM_xmlhttpRequest({
          url,
          method: 'GET',
          headers: {
            'Accept':
              'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          redirect: 'follow',
          onload: function (res) {
            if (res && res.finalUrl) {
              resolve(res.finalUrl);
            } else {
              resolve(url);
            }
          },
          onerror: function () {
            resolve(url);
          },
        });
      });
    }

    if (typeof fetch === 'function') {
      try {
        const resp = await fetch(url, { redirect: 'follow' });
        if (resp && resp.url) {
          return resp.url;
        }
      } catch (e) {}
    }

    return url;
  }

  // ------------------- 样式 -------------------
  GM_addStyle(`
    #kolxt-global-toast {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 12vh;
      background: rgba(0,0,0,.78);
      color: #fff;
      font-size: 12px;
      padding: 8px 12px;
      border-radius: 6px;
      z-index: 2147483647;
      max-width: 60vw;
      text-align: center;
      white-space: pre-line;
    }

    #kolxt-helper {
      position: fixed;
      left: 16px;
      bottom: 16px;
      z-index: 2147483000;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
    }
    #kolxt-card {
      background: rgba(255,255,255,0.95);
      box-shadow: 0 6px 20px rgba(0,0,0,.15);
      border-radius: 10px;
      padding: 8px 10px;
      border: 1px solid rgba(0,0,0,.06);
      backdrop-filter: saturate(180%) blur(8px);
      min-width: 200px;
      max-width: 260px;
    }
    #kolxt-header {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    #kolxt-drag {
      cursor: move;
      user-select: none;
      font-size: 14px;
      color: #999;
      padding: 0 2px;
    }
    #kolxt-title {
      font-size: 12px;
      color: #555;
      white-space: nowrap;
    }
    #kolxt-input {
      flex: 1;
      min-width: 0;
      height: 26px;
      padding: 3px 6px;
      font-size: 12px;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      outline: none;
    }
    #kolxt-input:focus {
      border-color:#1677ff;
      box-shadow: 0 0 0 2px rgba(22,119,255,.2);
    }
    #kolxt-login-status {
      font-size: 11px;
      white-space: nowrap;
      padding: 1px 6px;
      border-radius: 999px;
      border: 1px solid transparent;
      margin-left: 2px;
    }
    #kolxt-login-status.kolxt-ok {
      background: #ecfdf5;
      color: #16a34a;
      border-color: #bbf7d0;
    }
    #kolxt-login-status.kolxt-bad {
      background: #fef2f2;
      color: #dc2626;
      border-color: #fecaca;
    }
    #kolxt-extra {
      margin-top: 4px;
      font-size: 11px;
      color:#888;
      line-height: 1.5;
      display: none;
    }
    #kolxt-error {
      margin-top: 4px;
      font-size: 11px;
      color: #dc2626;
      line-height: 1.5;
      display: none;
      white-space: pre-line;
    }

    #kolxt-modal-mask {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.45);
      display: none;
      z-index: 2147483647;
    }
    #kolxt-modal {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: min(96vw, 1280px);
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 12px 40px rgba(0,0,0,.25);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }
    #kolxt-modal-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-bottom: 1px solid #f0f0f0;
      background: #fafafa;
    }
    #kolxt-modal-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
    #kolxt-modal-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .kolxt-link-btn {
      font-size: 12px;
      color: #1677ff;
      cursor: pointer;
      background: transparent;
      border: none;
      padding: 4px 6px;
    }
    .kolxt-divider {
      width: 1px;
      height: 16px;
      background: #eaeaea;
    }
    #kolxt-chart {
      width: 100%;
      height: min(72vh, 780px);
    }
    #kolxt-modal-ft {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 10px 14px;
      border-top: 1px solid #f0f0f0;
      background: #fafafa;
    }
    #kolxt-close {
      height: 30px;
      padding: 0 14px;
      font-size: 12px;
      cursor: pointer;
      color:#333;
      background:#f5f5f5;
      border:1px solid #e5e5e5;
      border-radius:6px;
    }
    #kolxt-status-text {
      margin-left: 8px;
      font-size: 11px;
      color: #666;
    }
  `);

  // ------------------- 星图端：同步授权信息到 GM KV -------------------
  function xtIsLoggedInByCookie() {
    // 只做一个简单判断：有 passport_csrf_token 就认为登录
    return document.cookie.indexOf('passport_csrf_token=') !== -1;
  }

  function xtCollectAuthState() {
    const logged = xtIsLoggedInByCookie();
    const auth = {
      loggedIn: logged,
      ts: Date.now(),
      csrftoken:
        getCookie('csrftoken') ||
        getCookie('csrf_token') ||
        getCookie('csrfSessionId') ||
        '',
      secToken: '',
    };
    try {
      auth.secToken =
        localStorage.getItem('x-secsdk-csrf-token') ||
        sessionStorage.getItem('x-secsdk-csrf-token') ||
        getCookie('x-secsdk-csrf-token') ||
        '';
    } catch (e) {}
    return auth;
  }

  function xtPushAuthState() {
    const auth = xtCollectAuthState();
    GM_setValue(KEY_AUTH, JSON.stringify(auth));
    console.log('[KOL↔XT][XT] xtPushAuthState:', auth);
  }

  function initOnXingtu() {
    console.log('[KOL↔XT][XT] initOnXingtu, url=', location.href);
    xtPushAuthState();
    // 定期刷新一下（防止你在星图重新登录 / 退出）
    setInterval(xtPushAuthState, 60000);
  }

  // ------------------- KOL 端：UI + 直接调用星图接口 -------------------
  function isAuthUsable(auth) {
    if (!auth || !auth.loggedIn) return false;
    if (!auth.ts) return false;
    return Date.now() - auth.ts < AUTH_MAX_AGE;
  }

  function markAuthLoggedOut() {
    const raw = GM_getValue(KEY_AUTH, '');
    const auth = safeParseJSON(raw) || {};
    auth.loggedIn = false;
    auth.ts = Date.now();
    GM_setValue(KEY_AUTH, JSON.stringify(auth));
    console.log('[KOL↔XT][KOL] markAuthLoggedOut ->', auth);
  }

  function initOnKOL() {
    console.log('[KOL↔XT][KOL] initOnKOL start');

    const root = document.createElement('div');
    root.id = 'kolxt-helper';
    root.innerHTML = `
      <div id="kolxt-card">
        <div id="kolxt-header">
          <span id="kolxt-drag" title="拖动面板位置">⠿</span>
          <span id="kolxt-title">播放量趋势</span>
          <input id="kolxt-input" type="text" placeholder="粘贴作品链接"/>
          <span id="kolxt-login-status"></span>
        </div>
        <div id="kolxt-extra">
          当前仅支持如下格式的作品链接：<br/>
          <code>https://www.douyin.com/video/7562788629787495737</code><br/>
          将在本页内直接绘制星图 VV 累计趋势曲线。
        </div>
        <div id="kolxt-error"></div>
      </div>
    `;
    document.body.appendChild(root);

    const dragHandle = document.getElementById('kolxt-drag');
    makeDraggable(root, dragHandle);

    const mask = document.createElement('div');
    mask.id = 'kolxt-modal-mask';
    mask.innerHTML = `
      <div id="kolxt-modal" role="dialog" aria-modal="true">
        <div id="kolxt-modal-hd">
          <div id="kolxt-modal-title">累计播放趋势</div>
          <div id="kolxt-modal-actions">
            <button class="kolxt-link-btn" id="kolxt-dl-csv" title="导出 CSV">导出CSV</button>
            <div class="kolxt-divider"></div>
            <button class="kolxt-link-btn" id="kolxt-copy" title="复制摘要">复制摘要</button>
          </div>
        </div>
        <div id="kolxt-chart"></div>
        <div id="kolxt-modal-ft">
          <span id="kolxt-status-text"></span>
          <button id="kolxt-close">关闭</button>
        </div>
      </div>
    `;
    document.body.appendChild(mask);

    const input      = document.getElementById('kolxt-input');
    const loginTag   = document.getElementById('kolxt-login-status');
    const extraEl    = document.getElementById('kolxt-extra');
    const errorEl    = document.getElementById('kolxt-error');
    const statusText = document.getElementById('kolxt-status-text');
    const closeBtn   = document.getElementById('kolxt-close');
    const csvBtn     = document.getElementById('kolxt-dl-csv');
    const copyBtn    = document.getElementById('kolxt-copy');

    let isLoading = false;
    let debounceTimer = null;

    function setLoading(loading) {
      isLoading = loading;
      input.disabled = loading;
      if (loading) {
        statusText.textContent = '正在通过星图获取数据…';
      } else if (!errorEl.textContent) {
        statusText.textContent = '';
      }
      console.log('[KOL↔XT][KOL] setLoading:', loading);
    }

    function showFormatHint() {
      extraEl.style.display = 'block';
      console.log('[KOL↔XT][KOL] showFormatHint');
    }
    function hideFormatHint() {
      extraEl.style.display = 'none';
      console.log('[KOL↔XT][KOL] hideFormatHint');
    }

    function showError(msg) {
      errorEl.textContent = msg || '';
      errorEl.style.display = msg ? 'block' : 'none';
      console.log('[KOL↔XT][KOL] showError:', msg);
    }
    function clearError() {
      showError('');
    }

    function readAuth() {
      const raw = GM_getValue(KEY_AUTH, '');
      const auth = safeParseJSON(raw) || {};
      return auth;
    }

    function refreshLoginBadge() {
      const auth = readAuth();
      let text = '星图 未登录';
      let cls  = 'kolxt-bad';
      if (auth && auth.loggedIn) {
        if (isAuthUsable(auth)) {
          text = '星图 已登录';
          cls  = 'kolxt-ok';
        } else {
          text = '星图 已登录(可能已过期)';
          cls  = 'kolxt-bad';
        }
      }
      loginTag.textContent = text;
      loginTag.className = cls;
      console.log('[KOL↔XT][KOL] refreshLoginBadge:', auth);
    }

    refreshLoginBadge();

    GM_addValueChangeListener(KEY_AUTH, (name, oldVal, newVal, remote) => {
      console.log('[KOL↔XT][KOL] KEY_AUTH changed:', { oldVal, newVal, remote });
      if (!remote) return;
      refreshLoginBadge();
    });

    async function startParseAndRequest() {
      const url = input.value.trim();
      console.log('[KOL↔XT][KOL] startParseAndRequest, url=', url);

      if (!url) {
        hideFormatHint();
        clearError();
        statusText.textContent = '';
        return;
      }

      const videoId = await resolveDouyinVideoId(url);
      console.log('[KOL↔XT][KOL] resolved videoId=', videoId);

      if (!videoId) {
        // 解析失败时才提示格式
        showFormatHint();
        clearError();
        statusText.textContent = '';
        return;
      }

      hideFormatHint();
      clearError();
      await fetchTrendDirectFromXingtu(videoId, setLoading, showError, statusText, input);
    }

    function scheduleParse() {
      if (isLoading) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        startParseAndRequest().catch(e => {
          console.error('[KOL↔XT][KOL] startParseAndRequest error:', e);
        });
      }, 400);
    }

    input.addEventListener('input', () => {
      console.log('[KOL↔XT][KOL] input event, url=', input.value.trim());
      clearError();
      hideFormatHint();
      scheduleParse();
    });

    input.addEventListener('paste', () => {
      console.log('[KOL↔XT][KOL] paste event detected');
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        console.log('[KOL↔XT][KOL] Enter pressed, force startParseAndRequest');
        startParseAndRequest().catch(err => {
          console.error('[KOL↔XT][KOL] startParseAndRequest error on Enter:', err);
        });
      }
    });

    closeBtn.addEventListener('click', () => {
      document.getElementById('kolxt-modal-mask').style.display = 'none';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' &&
          document.getElementById('kolxt-modal-mask').style.display === 'block') {
        document.getElementById('kolxt-modal-mask').style.display = 'none';
      }
    });

    csvBtn.addEventListener('click', () => {
      const cache = window.__KOL_XT_CACHE__;
      console.log('[KOL↔XT][KOL] export CSV, cache=', cache);
      if (!cache) {
        showToast('暂无数据可导出');
        return;
      }
      const { videoId, dates, daily, cum } = cache;
      const rows = ['date,daily_vv,cum_vv'];
      for (let i = 0; i < dates.length; i++) {
        rows.push(`${dates[i]},${daily[i]},${cum[i]}`);
      }
      const csv = rows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `xingtu_vv_${videoId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    // 修复复制摘要时“第15日”逻辑：不足 15 天不写这行
    copyBtn.addEventListener('click', async () => {
      const cache = window.__KOL_XT_CACHE__;
      console.log('[KOL↔XT][KOL] copy summary, cache=', cache);
      if (!cache) {
        showToast('暂无数据可复制');
        return;
      }
      const { videoId, dates, daily, cum } = cache;
      const hasDay15 = dates.length >= 15;

      let text =
        `Douyin ID: ${videoId}\n` +
        `区间：${dates[0]} ~ ${dates[dates.length - 1]}\n` +
        `样本天数：${dates.length}\n` +
        `合计累计VV：${cum[cum.length - 1].toLocaleString('en-US')}\n`;

      if (hasDay15) {
        const day15Index = 14;
        text += `第15日(${dates[day15Index]}): 当日 ${Number(
          daily[day15Index]
        ).toLocaleString('en-US')}, 累计 ${Number(
          cum[day15Index]
        ).toLocaleString('en-US')}`;
      }

      try {
        await navigator.clipboard.writeText(text);
        showToast('已复制摘要');
      } catch (err) {
        console.warn('[KOL↔XT][KOL] copy failed:', err);
        showToast('复制失败');
      }
    });

    setTimeout(() => {
      try { input.focus(); } catch (e) {}
    }, 800);
  }

  // 直接用 GM_xmlhttpRequest 在 KOL 端调用星图接口
  async function fetchTrendDirectFromXingtu(videoId, setLoading, showError, statusText, inputEl) {
    const authRaw = GM_getValue(KEY_AUTH, '');
    const auth = safeParseJSON(authRaw) || {};
    console.log('[KOL↔XT][KOL] fetchTrendDirectFromXingtu, auth=', auth);

    if (!isAuthUsable(auth)) {
      setLoading(false);
      showError('当前尚未从星图同步授权信息或授权可能已过期，请先在星图页面登录后再回来粘贴作品链接。');
      statusText.textContent = '';
      try {
        window.open('https://www.xingtu.cn/', 'kol_xt_auth');
      } catch (e) {}
      return;
    }

    setLoading(true);
    showError('');
    statusText.textContent = '正在通过星图接口获取播放量，请稍候…';

    try {
      const { dates, daily, cum } = await gmRequestTrend(videoId, auth);
      window.__KOL_XT_CACHE__ = { videoId, dates, daily, cum };
      renderChartInKOL(videoId, dates, daily, cum);
      // 成功后清空输入框，方便下一次粘贴
      if (inputEl) inputEl.value = '';
      statusText.textContent = '已获取数据并绘制完成';
    } catch (e) {
      console.error('[KOL↔XT][KOL] gmRequestTrend error:', e);
      const msg = e && e.message ? String(e.message) : '查询失败';
      showError(msg);
      statusText.textContent = msg;
      showToast(msg, 3000);
    } finally {
      setLoading(false);
    }
  }

  function gmRequestTrend(videoId, auth) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'x-login-source': '1',
        'agw-js-conv': 'str',
      };
      if (auth.csrftoken) headers['x-csrftoken'] = auth.csrftoken;
      if (auth.secToken) headers['x-secsdk-csrf-token'] = auth.secToken;

      console.log('[KOL↔XT][KOL] gmRequestTrend headers=', headers, 'videoId=', videoId);

      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://www.xingtu.cn/gw/api/data_sp/item_report_trend',
        data: JSON.stringify({ item_id: String(videoId) }),
        headers,
        timeout: 15000,
        onload: function (res) {
          try {
            let json = res.response;
            if (typeof json === 'string') {
              json = JSON.parse(json);
            }
            console.log('[KOL↔XT][KOL] gmRequestTrend resp:', res.status, json);

            if (res.status !== 200) {
              if (res.status === 401 || res.status === 403) {
                markAuthLoggedOut();
              }
              return reject(new Error('星图接口 HTTP ' + res.status));
            }

            if (!(json && json.base_resp)) {
              return reject(new Error('星图接口返回结构异常'));
            }

            if (json.base_resp.status_code !== 0) {
              const msg = json.base_resp.status_message || '星图接口返回错误';
              if (/未登录|登录|请先登录/.test(msg)) {
                markAuthLoggedOut();
              }
              return reject(new Error(msg));
            }

            const vv = (json.date_values && json.date_values.vv_list) || [];
            if (!Array.isArray(vv) || vv.length === 0) {
              return reject(new Error('返回中未找到 vv_list'));
            }

            vv.sort((a, b) => Number(a.visit_date) - Number(b.visit_date));
            const dates = vv.map(x => fmtDate(x.visit_date));
            const daily = vv.map(x => Number(x.value || 0));
            const cum = sumSeries(daily);

            resolve({ dates, daily, cum });
          } catch (e) {
            reject(e);
          }
        },
        onerror: function (err) {
          console.warn('[KOL↔XT][KOL] gmRequestTrend onerror:', err);
          reject(new Error('网络请求失败'));
        },
        ontimeout: function () {
          console.warn('[KOL↔XT][KOL] gmRequestTrend timeout');
          reject(new Error('请求星图超时，请稍后重试'));
        },
      });
    });
  }

  // ------------------- UI：拖动 + 绘图 -------------------
  function makeDraggable(container, handle) {
    if (!container || !handle) return;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      dragging = true;
      const rect = container.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      container.style.left = rect.left + 'px';
      container.style.top = rect.top + 'px';
      container.style.right = 'auto';
      container.style.bottom = 'auto';
      startLeft = rect.left;
      startTop = rect.top;
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newLeft = startLeft + dx;
      let newTop = startTop + dy;
      const maxLeft = window.innerWidth - container.offsetWidth;
      const maxTop = window.innerHeight - container.offsetHeight;
      newLeft = Math.min(Math.max(0, newLeft), Math.max(0, maxLeft));
      newTop = Math.min(Math.max(0, newTop), Math.max(0, maxTop));
      container.style.left = newLeft + 'px';
      container.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', () => {
      dragging = false;
    });
  }

  // 修复：不足 15 天不展示“第15日”标记
  function renderChartInKOL(videoId, dates, daily, cum) {
    const mask    = document.getElementById('kolxt-modal-mask');
    const titleEl = document.getElementById('kolxt-modal-title');

    if (titleEl) {
      titleEl.textContent = `累计播放趋势 · Douyin ID ${videoId}`;
    }
    mask.style.display  = 'block';

    const chartDom = document.getElementById('kolxt-chart');
    if (!kolChartInst) {
      kolChartInst = echarts.init(chartDom);
      window.addEventListener(
        'resize',
        () => {
          kolChartInst && kolChartInst.resize();
        },
        { passive: true }
      );
    }

    const xCats = dates.map(d => d.slice(5));

    // 只有有满 15 天数据时才展示“第15日”标记
    const hasDay15   = cum.length >= 15;
    const day15Index = hasDay15 ? 14 : -1;
    const day15Cum   = hasDay15 ? cum[day15Index] : null;

    const seriesItem = {
      name: '累计VV',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: { width: 2 },
      data: cum,
      areaStyle: { opacity: 0.08 },
      ...(hasDay15
        ? {
            markPoint: {
              symbol: 'pin',
              symbolSize: 58,
              data: [
                {
                  name: '第15日',
                  coord: [xCats[day15Index], day15Cum],
                  value: day15Cum,
                  label: {
                    show: true,
                    position: 'top',
                    distance: 10,
                    align: 'left',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderColor: '#d9d9d9',
                    borderWidth: 1,
                    borderRadius: 6,
                    padding: [4, 6],
                    color: '#2b2b2b',
                    fontSize: 12,
                    lineHeight: 16,
                    formatter: () =>
                      `第15日\n累计: ${day15Cum.toLocaleString('en-US')}`,
                  },
                },
              ],
            },
            markLine: {
              symbol: 'none',
              lineStyle: { type: 'dashed', width: 1.2, opacity: 0.9 },
              label: { formatter: '第15日' },
              data: [{ xAxis: xCats[day15Index] }],
            },
          }
        : {})
    };

    const option = {
      title: {
        text: `ID: ${videoId} 的 VV 累计趋势`,
        left: 'center',
        top: 8,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        valueFormatter: (v) =>
          typeof v === 'number' ? v.toLocaleString('en-US') : v,
      },
      grid: { left: 64, right: 28, top: 64, bottom: 54 },
      xAxis: {
        type: 'category',
        data: xCats,
        axisTick: { alignWithLabel: true },
        axisLabel: { interval: 'auto', hideOverlap: true },
      },
      yAxis: {
        type: 'value',
        name: '累计·万',
        axisLabel: { formatter: (v) => (v / 1e4).toFixed(0) + '万' },
        splitLine: { show: true },
      },
      series: [seriesItem],
      dataZoom: [
        { type: 'inside' },
        { type: 'slider', height: 22, bottom: 16 },
      ],
      toolbox: {
        feature: {
          saveAsImage: { title: '保存为图片' },
          dataZoom: { yAxisIndex: 'none' },
          restore: {},
        },
        right: 14,
      },
    };

    kolChartInst.setOption(option, true);
    setTimeout(() => kolChartInst && kolChartInst.resize(), 0);
    showToast('已从星图获取数据并完成绘图');
  }

  // ------------------- 入口 -------------------
  if (location.host === SITE_A_HOST) {
    initOnKOL();
  } else if (location.host === SITE_B_HOST || location.host === 'xingtu.cn') {
    initOnXingtu();
  }
})();
