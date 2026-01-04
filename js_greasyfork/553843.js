// ==UserScript==
// @name         网络调用查看器（查看调用）
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1.0
// @description  油猴脚本，捕获并搜索页面所有接口请求，提供“查看调用”按钮与详细信息面板。
// @author       hn
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553843/%E7%BD%91%E7%BB%9C%E8%B0%83%E7%94%A8%E6%9F%A5%E7%9C%8B%E5%99%A8%EF%BC%88%E6%9F%A5%E7%9C%8B%E8%B0%83%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553843/%E7%BD%91%E7%BB%9C%E8%B0%83%E7%94%A8%E6%9F%A5%E7%9C%8B%E5%99%A8%EF%BC%88%E6%9F%A5%E7%9C%8B%E8%B0%83%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const LOG_PREFIX = '[TM-NetworkInspector]';
  const MAX_KEEP = 2000; // 最多保留 2000 条，防止内存过大
  const IS_TOP = window === window.top;

  // 单例守卫，防止重复注入与重复 UI
  if (window.__TMNI_INSTALLED) {
    console.warn(LOG_PREFIX, 'Script already installed in this frame, skip.');
    return;
  }
  window.__TMNI_INSTALLED = true;

  const state = {
    requests: [], // {id, type, url, method, requestHeaders, requestBody, requestBodyText, startTime, endTime, duration, status, statusText, responseHeaders, responseBody, responseBodyText}
    expanded: new Set(),
    search: '',
    nextId: 1,
    ui: {
      shadowRoot: null,
      btn: null,
      panel: null,
      list: null,
      searchInput: null,
      clearBtn: null,
      statusTextEl: null,
    },
  };

  // 工具函数
  function headersToObject(headers) {
    const obj = {};
    try {
      if (headers && typeof headers.forEach === 'function') {
        headers.forEach((v, k) => { obj[k] = v; });
      } else if (headers && typeof headers === 'object') {
        Object.entries(headers).forEach(([k, v]) => { obj[k] = v; });
      }
    } catch (e) {
      console.warn(LOG_PREFIX, 'headersToObject error:', e);
    }
    return obj;
  }

  function formatJSONMaybe(str) {
    try {
      const obj = JSON.parse(str);
      return JSON.stringify(obj, null, 2);
    } catch(e) {
      return str;
    }
  }

  function isJSONContentType(ct) {
    return ct && ct.toLowerCase().includes('application/json');
  }

  function parseByContentType(text, contentType) {
    if (text == null) return null;
    if (isJSONContentType(contentType)) {
      try { return JSON.parse(text); } catch(e) { return text; }
    }
    // 对于非 JSON，直接返回原始文本
    return text;
  }

  function serializeBody(body, headers) {
    if (!body) return { text: null };
    try {
      if (typeof body === 'string') {
        return { text: body };
      }
      if (body instanceof URLSearchParams) {
        return { text: body.toString() };
      }
      if (body instanceof FormData) {
        const obj = {};
        for (const [k, v] of body.entries()) {
          obj[k] = v && typeof v === 'object' && 'name' in v ? `[File:${v.name}]` : v;
        }
        return { text: JSON.stringify(obj) };
      }
      if (body instanceof Blob) {
        return { text: `[Blob:${body.type}, size=${body.size}]` };
      }
      // 对象尝试 JSON 序列化
      return { text: JSON.stringify(body) };
    } catch (e) {
      return { text: String(body) };
    }
  }

  function nowTs() {
    return Date.now();
  }

  function formatTime(ts) {
    try {
      const d = new Date(ts);
      const pad = n => String(n).padStart(2, '0');
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, '0')}`;
    } catch(e) { return String(ts); }
  }

  // 顶层收集，子 frame 转发到顶层
  function addRequest(item) {
    if (!IS_TOP) {
      try {
        window.top.postMessage({ __TMNI_MSG: 'TMNI_CAPTURE', item }, '*');
        console.log(LOG_PREFIX, 'Forwarded to top window:', item.method, item.url);
      } catch (e) {
        console.warn(LOG_PREFIX, 'postMessage to top failed', e);
      }
      return;
    }
    state.requests.push(item);
    if (state.requests.length > MAX_KEEP) {
      state.requests.splice(0, state.requests.length - MAX_KEEP);
    }
    console.log(LOG_PREFIX, 'Captured', item.type, item.method, item.url, `status=${item.status}`, `duration=${item.duration}ms`);
    renderList();
  }

  // 拦截 fetch
  function hookFetch() {
    if (!window.fetch) return;
    if (window.fetch && window.fetch.__TMNI_WRAPPED) {
      console.info(LOG_PREFIX, 'Fetch already hooked, skip.');
      return;
    }
    const originalFetch = window.fetch;
    const wrapped = async function(input, init) {
      let reqUrl = '', reqMethod = 'GET', reqHeaders = {}, reqBodyText = null;
      const startTime = nowTs();
      const id = state.nextId++;
      try {
        if (input instanceof Request) {
          reqUrl = input.url;
          reqMethod = input.method || (init && init.method) || 'GET';
          reqHeaders = headersToObject(input.headers);
          try {
            const cloneReq = input.clone();
            const txt = await cloneReq.text();
            reqBodyText = formatJSONMaybe(txt);
          } catch (e) {
            reqBodyText = null;
          }
        } else {
          reqUrl = typeof input === 'string' ? input : String(input);
          reqMethod = (init && init.method) || 'GET';
          reqHeaders = headersToObject((init && init.headers) || {});
          const ser = serializeBody(init && init.body, reqHeaders);
          reqBodyText = ser.text ? formatJSONMaybe(ser.text) : null;
        }
        console.log(LOG_PREFIX, `fetch start [${id}]`, reqMethod, reqUrl);
      } catch (e) {
        console.warn(LOG_PREFIX, 'fetch pre-extract error', e);
      }

      try {
        const resp = await originalFetch.call(this, input, init);
        const endTime = nowTs();

        let respText = null;
        let respJsonOrText = null;
        let respHeadersObj = {};
        try {
          const clone = resp.clone();
          respText = await clone.text();
          respJsonOrText = parseByContentType(respText, resp.headers.get('content-type'));
          respHeadersObj = headersToObject(resp.headers);
        } catch (e) {
          respText = null;
          respJsonOrText = null;
        }

        addRequest({
          id,
          type: 'fetch',
          url: reqUrl,
          method: reqMethod,
          requestHeaders: reqHeaders,
          requestBody: reqBodyText ? parseByContentType(reqBodyText, 'application/json') : reqBodyText,
          requestBodyText: reqBodyText,
          startTime,
          endTime,
          duration: endTime - startTime,
          status: resp.status,
          statusText: resp.statusText,
          responseHeaders: respHeadersObj,
          responseBody: respJsonOrText,
          responseBodyText: respText,
        });
        return resp;
      } catch (e) {
        const endTime = nowTs();
        addRequest({
          id,
          type: 'fetch',
          url: reqUrl,
          method: reqMethod,
          requestHeaders: reqHeaders,
          requestBody: reqBodyText,
          requestBodyText: reqBodyText,
          startTime,
          endTime,
          duration: endTime - startTime,
          status: -1,
          statusText: String(e),
          responseHeaders: {},
          responseBody: null,
          responseBodyText: null,
        });
        console.error(LOG_PREFIX, 'fetch error', e);
        throw e;
      }
    };
    wrapped.__TMNI_WRAPPED = true;
    window.fetch = wrapped;
    console.info(LOG_PREFIX, 'Fetch hooked');
  }

  // 拦截 XHR
  function hookXHR() {
    const XHR = window.XMLHttpRequest;
    if (!XHR) return;
    if (XHR.prototype.open && XHR.prototype.open.__TMNI_WRAPPED) {
      console.info(LOG_PREFIX, 'XHR already hooked, skip.');
      return;
    }
    const open = XHR.prototype.open;
    const send = XHR.prototype.send;
    const setRequestHeader = XHR.prototype.setRequestHeader;

    XHR.prototype.open = function(method, url, async, user, password) {
      this.__tmni = this.__tmni || {};
      this.__tmni.method = method;
      this.__tmni.url = url;
      this.__tmni.requestHeaders = {};
      this.__tmni.startTime = nowTs();
      this.addEventListener('loadend', () => {
        try {
          const id = (this.__tmni && this.__tmni.id) || (state.nextId++);
          const endTime = nowTs();
          const respHeadersRaw = this.getAllResponseHeaders ? this.getAllResponseHeaders() : '';
          const respHeadersObj = {};
          if (respHeadersRaw) {
            respHeadersRaw.trim().split(/\r?\n/).forEach(line => {
              const idx = line.indexOf(':');
              if (idx > -1) {
                const k = line.slice(0, idx).trim().toLowerCase();
                const v = line.slice(idx + 1).trim();
                respHeadersObj[k] = v;
              }
            });
          }
          const ct = respHeadersObj['content-type'] || '';
          const txt = (this.responseType && this.responseType !== 'text') ? null : this.responseText;
          let respParsed = null;
          if (txt != null) {
            respParsed = parseByContentType(txt, ct);
          } else if (this.response && typeof this.response === 'string') {
            respParsed = parseByContentType(this.response, ct);
          } else {
            respParsed = this.response || null;
          }

          addRequest({
            id,
            type: 'xhr',
            url: this.__tmni.url,
            method: this.__tmni.method,
            requestHeaders: this.__tmni.requestHeaders || {},
            requestBody: this.__tmni.bodyText || null,
            requestBodyText: this.__tmni.bodyText || null,
            startTime: this.__tmni.startTime,
            endTime,
            duration: endTime - (this.__tmni.startTime || endTime),
            status: this.status,
            statusText: this.statusText,
            responseHeaders: respHeadersObj,
            responseBody: respParsed,
            responseBodyText: txt,
          });
        } catch (e) {
          console.warn(LOG_PREFIX, 'XHR loadend handler error', e);
        }
      });
      return open.apply(this, arguments);
    };

    XHR.prototype.setRequestHeader = function(header, value) {
      try {
        this.__tmni = this.__tmni || {};
        this.__tmni.requestHeaders = this.__tmni.requestHeaders || {};
        this.__tmni.requestHeaders[header] = value;
      } catch (e) {}
      return setRequestHeader.apply(this, arguments);
    };

    XHR.prototype.send = function(body) {
      try {
        const ser = serializeBody(body, this.__tmni && this.__tmni.requestHeaders);
        this.__tmni.bodyText = ser.text ? formatJSONMaybe(ser.text) : null;
        console.log(LOG_PREFIX, `xhr start`, this.__tmni.method, this.__tmni.url);
      } catch (e) {
        console.warn(LOG_PREFIX, 'XHR send body serialize error', e);
      }
      return send.apply(this, arguments);
    };
    XHR.prototype.open.__TMNI_WRAPPED = true;
    console.info(LOG_PREFIX, 'XHR hooked');
  }

  // 拦截 sendBeacon（常用于埋点/心跳，无法获取响应）
  function hookBeacon() {
    try {
      const nav = navigator;
      if (!nav || typeof nav.sendBeacon !== 'function') return;
      if (nav.sendBeacon && nav.sendBeacon.__TMNI_WRAPPED) {
        console.info(LOG_PREFIX, 'Beacon already hooked, skip.');
        return;
      }
      const original = nav.sendBeacon.bind(nav);
      const wrapped = function(url, data) {
        const startTime = nowTs();
        const id = state.nextId++;
        let bodyText = null;
        try {
          const ser = serializeBody(data, {});
          bodyText = ser.text ? formatJSONMaybe(ser.text) : null;
        } catch(e) {}
        const strUrl = typeof url === 'string' ? url : String(url);
        console.log(LOG_PREFIX, 'beacon start', strUrl);
        const ok = original(url, data);
        const endTime = nowTs();
        addRequest({
          id,
          type: 'beacon',
          url: strUrl,
          method: 'POST',
          requestHeaders: {},
          requestBody: bodyText,
          requestBodyText: bodyText,
          startTime,
          endTime,
          duration: endTime - startTime,
          status: ok ? 0 : -1, // 无响应，0 表示已发送，-1 失败
          statusText: ok ? 'sent' : 'failed',
          responseHeaders: {},
          responseBody: null,
          responseBodyText: null,
        });
        return ok;
      };
      wrapped.__TMNI_WRAPPED = true;
      nav.sendBeacon = wrapped;
      console.info(LOG_PREFIX, 'Beacon hooked');
    } catch (e) {
      console.warn(LOG_PREFIX, 'Beacon hook error', e);
    }
  }

  // 初次安装钩子
  hookFetch();
  hookXHR();
  hookBeacon();

  // 钩子自愈：若业务代码覆盖 fetch/XHR，则自动重挂钩
  setInterval(() => {
    try {
      if (window.fetch && !window.fetch.__TMNI_WRAPPED) {
        console.warn(LOG_PREFIX, 'Fetch replaced by page code, re-hooking');
        hookFetch();
      }
      if (window.XMLHttpRequest && window.XMLHttpRequest.prototype && !window.XMLHttpRequest.prototype.open.__TMNI_WRAPPED) {
        console.warn(LOG_PREFIX, 'XHR open replaced by page code, re-hooking');
        hookXHR();
      }
      if (navigator && navigator.sendBeacon && !navigator.sendBeacon.__TMNI_WRAPPED) {
        console.warn(LOG_PREFIX, 'Beacon replaced by page code, re-hooking');
        hookBeacon();
      }
    } catch (e) {
      console.warn(LOG_PREFIX, 'Hook watchdog error', e);
    }
  }, 2000);

  // 构建 UI（按钮 + 面板）
  function buildUI() {
    // 仅顶层窗口显示 UI，子 frame 不创建面板与按钮
    if (!IS_TOP) return;
    if (document.getElementById('tmni-container')) {
      console.info(LOG_PREFIX, 'UI already exists, skip building again.');
      return;
    }
    const container = document.createElement('div');
    container.id = 'tmni-container';
    container.style.position = 'fixed';
    container.style.zIndex = '2147483647';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '0';
    container.style.height = '0';
    document.documentElement.appendChild(container);

    const shadow = container.attachShadow({ mode: 'open' });
    state.ui.shadowRoot = shadow;

    const style = document.createElement('style');
    style.textContent = `
      .tmni-btn {
        position: fixed;
        right: 16px;
        bottom: 16px;
        background: #1677ff;
        color: #fff;
        border-radius: 20px;
        padding: 8px 12px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        cursor: pointer;
        user-select: none;
      }
      .tmni-panel {
        position: fixed;
        right: 24px;
        top: 80px;
        width: 640px;
        height: 70vh;
        background: #fff;
        border: 1px solid #e5e5e5;
        box-shadow: 0 12px 24px rgba(0,0,0,0.2);
        border-radius: 8px;
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      .tmni-panel.visible { display: flex; }
      .tmni-header {
        background: #f7f8fa;
        padding: 8px;
        display: flex;
        gap: 8px;
        align-items: center;
        border-bottom: 1px solid #eee;
        cursor: move;
      }
      .tmni-title { font-weight: 600; color: #333; }
      .tmni-search { flex: 1; }
      .tmni-search input {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid #d0d0d0;
        border-radius: 6px;
        outline: none;
      }
      .tmni-clear {
        padding: 6px 10px;
        background: #ff4d4f;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
      .tmni-close {
        padding: 6px 10px;
        background: #999;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
      .tmni-status { color: #888; font-size: 12px; }
      .tmni-list {
        flex: 1;
        overflow: auto;
        padding: 8px;
        background: #fff;
      }
      .tmni-item {
        border-bottom: 1px dashed #eee;
        padding: 6px 4px;
      }
      .tmni-row {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }
      .tmni-badge {
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        color: #fff;
      }
        .tmni-badge.ok { background: #52c41a; }
        .tmni-badge.err { background: #ff4d4f; }
      .tmni-type {
        font-size: 11px;
        padding: 1px 4px;
        border-radius: 3px;
        background: #e6f7ff;
        color: #1677ff;
        border: 1px solid #91caff;
      }
      .tmni-type.beacon {
        background: #fff2e8;
        color: #fa541c;
        border: 1px solid #ffbb96;
      }
      .tmni-pin-new {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #666;
        cursor: pointer;
        user-select: none;
      }
      .tmni-url {
        flex: 1;
        font-size: 13px;
        color: #1677ff;
        word-break: break-all;
        cursor: pointer;
        position: relative;
      }
      .tmni-url:hover {
        text-decoration: underline;
      }
      .tmni-url:active::after {
        content: '已复制';
        position: absolute;
        right: -60px;
        top: 0;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
      }
      .tmni-time { font-size: 12px; color: #666; }
      .tmni-detail { padding: 6px; background: #fafafa; border-radius: 6px; margin-top: 6px; }
      .tmni-detail pre { max-height: 240px; overflow: auto; background: #fff; padding: 6px; border: 1px solid #eee; border-radius: 6px; }
    `;
    shadow.appendChild(style);

    const btn = document.createElement('div');
    btn.className = 'tmni-btn';
    btn.textContent = '查看调用';
    shadow.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'tmni-panel';
    panel.innerHTML = `
      <div class="tmni-header">
        <div class="tmni-title">接口调用监视器</div>
        <div class="tmni-search"><input type="text" placeholder="搜索接口（URL/请求/响应）..." /></div>
        <label class="tmni-pin-new"><input type="checkbox" /> 新请求置顶</label>
        <button class="tmni-clear">清空</button>
        <button class="tmni-close">关闭</button>
        <div class="tmni-status">就绪</div>
      </div>
      <div class="tmni-list"></div>
    `;
    shadow.appendChild(panel);

    const searchInput = panel.querySelector('.tmni-search input');
    const clearBtn = panel.querySelector('.tmni-clear');
    const closeBtn = panel.querySelector('.tmni-close');
    const listEl = panel.querySelector('.tmni-list');
    const statusTextEl = panel.querySelector('.tmni-status');
    const pinNewCheckbox = panel.querySelector('.tmni-pin-new input');

    state.ui.btn = btn;
    state.ui.panel = panel;
    state.ui.list = listEl;
    state.ui.searchInput = searchInput;
    state.ui.clearBtn = clearBtn;
    state.ui.statusTextEl = statusTextEl;
    state.ui.pinNewCheckbox = pinNewCheckbox;
    state.pinNewRequests = false;

    // 拖拽面板
    (function makeDraggable() {
      const header = panel.querySelector('.tmni-header');
      let isDown = false;
      let startX = 0, startY = 0;
      let origTop = 0, origRight = 0;
      header.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = panel.getBoundingClientRect();
        origTop = rect.top;
        // 将 right 转成数值
        origRight = parseInt(getComputedStyle(panel).right) || 24;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
      function onMove(e) {
        if (!isDown) return;
        const dy = e.clientY - startY;
        const dx = e.clientX - startX;
        panel.style.top = `${Math.max(0, origTop + dy)}px`;
        panel.style.right = `${Math.max(0, origRight - dx)}px`;
      }
      function onUp() {
        isDown = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
    })();

    btn.addEventListener('click', () => {
      const visible = panel.classList.toggle('visible');
      console.log(LOG_PREFIX, 'UI panel', visible ? 'open' : 'close');
      if (visible) renderList();
    });

    searchInput.addEventListener('input', (e) => {
      state.search = e.target.value.trim();
      console.log(LOG_PREFIX, 'Search changed:', state.search);
      renderList();
    });

    pinNewCheckbox.addEventListener('change', (e) => {
      state.pinNewRequests = e.target.checked;
      console.log(LOG_PREFIX, 'Pin new requests:', state.pinNewRequests);
      renderList();
    });

    clearBtn.addEventListener('click', () => {
      state.requests = [];
      state.expanded.clear();
      console.log(LOG_PREFIX, 'Cleared all captured requests by user');
      renderList();
    });

    // 关闭按钮与 ESC 关闭
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('visible');
      console.log(LOG_PREFIX, 'UI panel close via close button');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('visible')) {
        panel.classList.remove('visible');
        console.log(LOG_PREFIX, 'UI panel close via ESC');
      }
    });

    console.info(LOG_PREFIX, 'UI built');
  }

  function matchItem(item, kw) {
    if (!kw) return true;
    kw = kw.toLowerCase();
    const base = [
      item.url,
      item.method,
      String(item.status),
      item.statusText || '',
      item.requestBodyText || '',
      item.responseBodyText || '',
    ].join('\n').toLowerCase();
    return base.includes(kw);
  }

  function renderList() {
    const panel = state.ui.panel;
    // 若面板未初始化或未显示则不渲染（避免无意义的 DOM 更新）
    if (!panel || !panel.classList.contains('visible')) return;
    const listEl = state.ui.list;
    const statusTextEl = state.ui.statusTextEl;

    const filtered = state.requests.filter(r => matchItem(r, state.search));
    statusTextEl.textContent = `共 ${state.requests.length} 条，过滤后 ${filtered.length} 条`;

    listEl.innerHTML = '';
    // 根据是否置顶新请求决定排序方式
    const sortedItems = state.pinNewRequests
      ? filtered.slice() // 新请求在前（默认顺序）
      : filtered.slice().reverse(); // 新请求在后（反转）

    sortedItems.forEach(item => {
      const row = document.createElement('div');
      row.className = 'tmni-item';

      const badge = document.createElement('span');
      badge.className = `tmni-badge ${item.status >= 200 && item.status < 300 ? 'ok' : 'err'}`;
      badge.textContent = item.status >= 0 ? String(item.status) : 'ERR';

      const method = document.createElement('span');
      method.textContent = item.method || 'GET';
      method.style.fontWeight = '600';
      method.style.color = '#555';

      const typeSpan = document.createElement('span');
      typeSpan.className = `tmni-type ${item.type}`;
      typeSpan.textContent = item.type;

      const url = document.createElement('span');
      url.className = 'tmni-url';
      url.textContent = item.url;

      const time = document.createElement('span');
      time.className = 'tmni-time';
      time.textContent = `${formatTime(item.startTime)} (${item.duration}ms)`;

      const topRow = document.createElement('div');
      topRow.className = 'tmni-row';
      topRow.appendChild(badge);
      topRow.appendChild(method);
      topRow.appendChild(typeSpan);
      topRow.appendChild(url);
      topRow.appendChild(time);
      row.appendChild(topRow);

      const detail = document.createElement('div');
      detail.className = 'tmni-detail';
      detail.style.display = state.expanded.has(item.id) ? 'block' : 'none';

      const reqPre = document.createElement('pre');
      reqPre.textContent = `请求\nURL: ${item.url}\nMethod: ${item.method}\nHeaders: ${JSON.stringify(item.requestHeaders, null, 2)}\nBody: ${item.requestBodyText || ''}`;
      detail.appendChild(reqPre);

      const respPre = document.createElement('pre');
      respPre.textContent = `响应\nStatus: ${item.status} ${item.statusText}\nHeaders: ${JSON.stringify(item.responseHeaders, null, 2)}\nBody: ${typeof item.responseBody === 'object' ? JSON.stringify(item.responseBody, null, 2) : (item.responseBodyText || '')}`;
      detail.appendChild(respPre);

      row.appendChild(detail);
      listEl.appendChild(row);

      // URL点击复制功能
      url.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止冒泡，避免触发展开/折叠
        navigator.clipboard.writeText(item.url)
          .then(() => {
            console.log(LOG_PREFIX, 'URL copied to clipboard:', item.url);
          })
          .catch(err => {
            console.warn(LOG_PREFIX, 'Failed to copy URL:', err);
            // 降级方案：创建临时输入框
            const input = document.createElement('input');
            input.value = item.url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
          });
      });

      // 展开/折叠详情
      topRow.addEventListener('click', () => {
        if (state.expanded.has(item.id)) {
          state.expanded.delete(item.id);
          detail.style.display = 'none';
        } else {
          state.expanded.add(item.id);
          detail.style.display = 'block';
        }
      });
    });
  }

  // 初始化 UI（document-start 下，等待文档可交互再注入 UI）
  function initWhenReady() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      buildUI();
    } else {
      document.addEventListener('DOMContentLoaded', () => buildUI());
    }
  }

  // 顶层窗口接收子 frame 的请求数据
  if (IS_TOP) {
    window.addEventListener('message', (e) => {
      const d = e.data;
      if (d && d.__TMNI_MSG === 'TMNI_CAPTURE' && d.item) {
        console.log(LOG_PREFIX, 'Top received capture from frame:', e.origin, d.item.url);
        addRequest(d.item);
      }
    });
  }

  console.info(LOG_PREFIX, 'Initializing...');
  initWhenReady();
  console.info(LOG_PREFIX, 'Ready');
})();