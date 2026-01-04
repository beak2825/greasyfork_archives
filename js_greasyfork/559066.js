// ==UserScript==
// @name         P-Stream Userscript
// @namespace    https://pstream.mov/
// @version      1.0.1
// @description  Userscript replacement for the P-Stream extension
// @author       Duplicake, P-Stream Team
// @icon         https://raw.githubusercontent.com/p-stream/p-stream/production/public/mstile-150x150.jpeg
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/559066/P-Stream%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/559066/P-Stream%20Userscript.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Environment bootstrap, report higher version to bypass extension version requirement.
  const SCRIPT_VERSION = '1.4.0';
  // Use unsafeWindow when available so our patches run in the page context.
  const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const gmXhr =
    typeof GM_xmlhttpRequest === 'function'
      ? GM_xmlhttpRequest
      : typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function'
        ? GM.xmlHttpRequest
        : null;

  // --- Constants & state -------------------------------------------------
  const DEFAULT_CORS_HEADERS = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'access-control-allow-headers': '*',
  };
  const MODIFIABLE_RESPONSE_HEADERS = [
    'access-control-allow-origin',
    'access-control-allow-methods',
    'access-control-allow-headers',
    'content-security-policy',
    'content-security-policy-report-only',
    'content-disposition',
  ];

  const STREAM_RULES = new Map();
  const MEDIA_BLOBS = new Map();
  const PROXY_CACHE = new Map();
  let fetchPatched = false;
  let xhrPatched = false;
  let mediaPatched = false;

  const REQUEST_ORIGIN = (() => {
    try {
      const { origin, href } = pageWindow.location;
      if (origin && origin !== 'null') return origin;
      if (href) return new URL(href).origin;
    } catch {}
    return '*';
  })();

  // --- Logging -----------------------------------------------------------
  const log = (...args) => console.debug('[p-stream-userscript]', ...args);

  // --- Basic utilities ---------------------------------------------------
  const canAccessCookies = () => true;

  const normalizeUrl = (input) => {
    if (!input) return null;
    try {
      return new URL(input, pageWindow.location.href).toString();
    } catch {
      return null;
    }
  };

  const isSameOrigin = (url) => {
    try {
      return new URL(url).origin === new URL(pageWindow.location.href).origin;
    } catch {
      return false;
    }
  };

  const makeFullUrl = (url, ops = {}) => {
    let leftSide = ops.baseUrl ?? '';
    let rightSide = url;
    if (leftSide.length > 0 && !leftSide.endsWith('/')) leftSide += '/';
    if (rightSide.startsWith('/')) rightSide = rightSide.slice(1);
    const fullUrl = leftSide + rightSide;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://'))
      throw new Error(`Invalid URL -- URL doesn't start with a http scheme: '${fullUrl}'`);

    const parsedUrl = new URL(fullUrl);
    Object.entries(ops.query ?? {}).forEach(([k, v]) => parsedUrl.searchParams.set(k, v));
    return parsedUrl.toString();
  };

  const parseHeaders = (raw) => {
    const headers = {};
    (raw || '')
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((line) => {
        const idx = line.indexOf(':');
        if (idx === -1) return;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        headers[key.toLowerCase()] = headers[key.toLowerCase()]
          ? `${headers[key.toLowerCase()]}, ${value}`
          : value;
      });
    return headers;
  };

  const buildResponseHeaders = (rawHeaders, ruleHeaders, includeCredentials) => {
    const headerMap = {
      ...DEFAULT_CORS_HEADERS,
      ...(ruleHeaders ?? {}),
      ...parseHeaders(rawHeaders),
    };

    if (includeCredentials) {
      headerMap['access-control-allow-credentials'] = 'true';
      if (!headerMap['access-control-allow-origin'] || headerMap['access-control-allow-origin'] === '*') {
        headerMap['access-control-allow-origin'] = REQUEST_ORIGIN;
      }
    }

    return headerMap;
  };

  // --- Request helpers ---------------------------------------------------
  const mapBodyToPayload = (body, bodyType) => {
    if (body == null) return undefined;
    switch (bodyType) {
      case 'FormData': {
        const formData = new FormData();
        body.forEach(([key, value]) => formData.append(key, value));
        return formData;
      }
      case 'URLSearchParams':
        return new URLSearchParams(body);
      case 'object':
        return JSON.stringify(body);
      case 'string':
        return body;
      default:
        return body;
    }
  };

  const normalizeBody = (body) => {
    if (body == null) return undefined;
    if (body instanceof URLSearchParams) return body.toString();
    if (typeof body === 'string' || body instanceof FormData || body instanceof Blob) return body;
    if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) return body;
    if (typeof body === 'object') return JSON.stringify(body);
    return body;
  };

  const gmRequest = (options) =>
    new Promise((resolve, reject) => {
      if (!gmXhr) {
        reject(new Error('GM_xmlhttpRequest missing; cannot proxy request'));
        return;
      }
      gmXhr({
        ...options,
        onload: (response) => resolve(response),
        onerror: (error) => reject(error),
        ontimeout: () => reject(new Error('Request timed out')),
      });
    });

  const shouldSendCredentials = (url, credentialsMode, withCredentialsFlag = false) => {
    if (!url) return false;
    if (withCredentialsFlag) return true;
    const sameOrigin = isSameOrigin(url);

    if (credentialsMode === 'omit') return false;
    if (credentialsMode === 'include') return true;
    if (!credentialsMode || credentialsMode === 'same-origin') return sameOrigin || canAccessCookies();
    return canAccessCookies();
  };

  const findRuleForUrl = (url) => {
    const normalized = normalizeUrl(url);
    if (!normalized) return null;
    const host = new URL(normalized).hostname;
    for (const rule of STREAM_RULES.values()) {
      if (rule.targetDomains?.some((d) => host === d || host.endsWith(`.${d}`))) return rule;
      if (rule.targetRegex) {
        try {
          const regex = new RegExp(rule.targetRegex);
          if (regex.test(normalized)) return rule;
        } catch (err) {
          log('Invalid targetRegex in rule, skipping', err);
        }
      }
    }
    return null;
  };

  // --- Media helpers -----------------------------------------------------
  const makeBlobUrl = (data, contentType) => {
    const blob = new Blob([data], { type: contentType || 'application/octet-stream' });
    return URL.createObjectURL(blob);
  };

  const proxyMediaIfNeeded = async (url) => {
    const normalized = normalizeUrl(url);
    if (!normalized) return null;
    
    // Check cache first
    if (PROXY_CACHE.has(normalized)) {
      return PROXY_CACHE.get(normalized);
    }
    
    const rule = findRuleForUrl(normalized);
    if (!rule) return null;
    
    // Create promise and cache it immediately to prevent duplicate requests
    const proxyPromise = (async () => {
      try {
        const includeCredentials = shouldSendCredentials(normalized, 'include', true);
        const response = await gmRequest({
          url: normalized,
          method: 'GET',
          headers: rule.requestHeaders,
          responseType: 'arraybuffer',
          withCredentials: includeCredentials,
        });
        const headers = parseHeaders(response.responseHeaders);
        const contentType = headers['content-type'] || '';

        if (
          contentType.includes('application/vnd.apple.mpegurl') ||
          contentType.includes('application/x-mpegurl') ||
          normalized.includes('.m3u8')
        ) {
          return null;
        }
        if (contentType.includes('application/dash+xml') || normalized.includes('.mpd')) return null;

        const blobUrl = makeBlobUrl(
          response.response instanceof ArrayBuffer ? response.response : new TextEncoder().encode(response.responseText ?? ''),
          contentType,
        );
        MEDIA_BLOBS.set(blobUrl, true);
        return blobUrl;
      } catch (err) {
        log('Media proxy failed, falling back to original src', err);
        return null;
      } finally {
        // Remove from cache after a short delay
        setTimeout(() => PROXY_CACHE.delete(normalized), 1000);
      }
    })();
    
    PROXY_CACHE.set(normalized, proxyPromise);
    return proxyPromise;
  };

  // --- Proxy initializers ------------------------------------------------
  const ensureFetchProxy = () => {
    if (fetchPatched) return;
    fetchPatched = true;
    const win = pageWindow;
    const nativeFetch = win.fetch.bind(win);

    win.fetch = async (input, init = {}) => {
      const targetUrl = normalizeUrl(typeof input === 'string' ? input : input?.url);
      if (!targetUrl) return nativeFetch(input, init);
      const rule = findRuleForUrl(targetUrl);
      if (!rule) return nativeFetch(input, init);

      const headers = {};
      const initHeaders = init.headers instanceof Headers ? Object.fromEntries(init.headers.entries()) : init.headers;
      Object.assign(headers, rule.requestHeaders ?? {}, initHeaders ?? {});

      const method = init.method || 'GET';
      const payload = normalizeBody(init.body);
      const includeCredentials = shouldSendCredentials(targetUrl, init.credentials);

      try {
        const response = await gmRequest({
          url: targetUrl,
          method,
          data: payload,
          headers,
          responseType: 'arraybuffer',
          withCredentials: includeCredentials,
        });

        const headerMap = buildResponseHeaders(response.responseHeaders, rule.responseHeaders, includeCredentials);
        const bodyBuffer =
          response.response instanceof ArrayBuffer
            ? response.response
            : new TextEncoder().encode(response.responseText ?? '');

        return new Response(bodyBuffer, {
          status: response.status,
          statusText: response.statusText ?? '',
          headers: headerMap,
        });
      } catch (err) {
        log('Proxy fetch failed, falling back to native', err);
        return nativeFetch(input, init);
      }
    };
  };

  const ensureXhrProxy = () => {
    if (xhrPatched) return;
    xhrPatched = true;
    const win = pageWindow;
    const NativeXHR = win.XMLHttpRequest;

    const EVENTS = ['readystatechange', 'load', 'error', 'timeout', 'abort', 'loadend', 'progress', 'loadstart'];

    const emit = (instance, type, event = new Event(type)) => {
      try {
        instance[`on${type}`]?.call(instance, event);
      } catch (err) {
        log('XHR handler error', err);
      }
      (instance._listeners.get(type) || []).forEach((cb) => {
        try {
          cb.call(instance, event);
        } catch (err) {
          log('XHR listener error', err);
        }
      });
    };

    class ProxyXHR {
      constructor() {
        this._native = new NativeXHR();
        this._usingNative = true;
        this._listeners = new Map();
        this._headers = {};
        this._rule = null;
        this._url = '';
        this._method = 'GET';
        this._responseHeaders = {};
        this._readyState = ProxyXHR.UNSENT;
        this._status = 0;
        this._statusText = '';
        this._response = null;
        this._responseText = '';
        this._responseURL = '';
        this._overrideMime = '';
        this.responseType = '';
        this.withCredentials = false;
        this.timeout = 0;
        this.upload = this._native.upload;
      }

      get readyState() {
        return this._usingNative ? this._native.readyState : this._readyState;
      }

      set readyState(value) {
        this._readyState = value;
      }

      get status() {
        return this._usingNative ? this._native.status : this._status;
      }

      set status(value) {
        this._status = value;
      }

      get statusText() {
        return this._usingNative ? this._native.statusText : this._statusText;
      }

      set statusText(value) {
        this._statusText = value;
      }

      get response() {
        return this._usingNative ? this._native.response : this._response;
      }

      set response(value) {
        this._response = value;
      }

      get responseText() {
        return this._usingNative ? this._native.responseText : this._responseText;
      }

      set responseText(value) {
        this._responseText = value;
      }

      get responseURL() {
        return this._usingNative ? this._native.responseURL : this._responseURL;
      }

      set responseURL(value) {
        this._responseURL = value;
      }

      addEventListener(type, callback) {
        if (!this._listeners.has(type)) this._listeners.set(type, []);
        this._listeners.get(type).push(callback);
        if (this._usingNative) return this._native.addEventListener(type, callback);
      }

      removeEventListener(type, callback) {
        const listeners = this._listeners.get(type);
        if (!listeners) return;
        const idx = listeners.indexOf(callback);
        if (idx !== -1) listeners.splice(idx, 1);
        if (this._usingNative) return this._native.removeEventListener(type, callback);
      }

      _bindNativeEvents() {
        if (this._nativeBound) return;
        this._nativeBound = true;
        EVENTS.forEach((type) => {
          this._native.addEventListener(type, (event) => emit(this, type, event));
        });
      }

      open(method, url, async = true, user, password) {
        this._method = method;
        const normalized = normalizeUrl(url);
        this._url = normalized ?? url;
        this._rule = normalized ? findRuleForUrl(normalized) : null;
        this._usingNative = !this._rule;

        if (this._usingNative) {
          return this._native.open(method, url, async, user, password);
        }

        this.readyState = ProxyXHR.OPENED;
        emit(this, 'readystatechange');
      }

      setRequestHeader(name, value) {
        if (this._usingNative) return this._native.setRequestHeader(name, value);
        this._headers[name] = value;
      }

      getResponseHeader(name) {
        if (this._usingNative) return this._native.getResponseHeader(name);
        const key = name?.toLowerCase?.() ?? '';
        return this._responseHeaders[key] ?? null;
      }

      getAllResponseHeaders() {
        if (this._usingNative) return this._native.getAllResponseHeaders();
        return Object.entries(this._responseHeaders)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\r\n');
      }

      overrideMimeType(mime) {
        if (this._usingNative) return this._native.overrideMimeType(mime);
        this._overrideMime = mime;
      }

      abort() {
        if (this._usingNative) return this._native.abort();
        if (this._timeoutId) clearTimeout(this._timeoutId);
        this._aborted = true;
        this.readyState = ProxyXHR.UNSENT;
        emit(this, 'abort');
      }

      _applyTimeout(promise) {
        if (!this.timeout) return promise;
        return Promise.race([
          promise,
          new Promise((_, reject) => {
            this._timeoutId = setTimeout(() => reject(new Error('timeout')), this.timeout);
          }),
        ]);
      }

      async send(body = null) {
        if (this._usingNative) {
          this._native.withCredentials = this.withCredentials;
          this._native.responseType = this.responseType;
          this._native.timeout = this.timeout;
          this._bindNativeEvents();
          return this._native.send(body);
        }

        const rule = this._rule;
        if (!rule) return;
        const headers = { ...(rule.requestHeaders ?? {}), ...this._headers };
        const includeCredentials = shouldSendCredentials(this._url, this.withCredentials ? 'include' : undefined, this.withCredentials);

        try {
          emit(this, 'loadstart');
          const response = await this._applyTimeout(
            gmRequest({
              url: this._url,
              method: this._method || 'GET',
              data: normalizeBody(body),
              headers,
              responseType: this.responseType === 'arraybuffer' || this.responseType === 'blob' ? 'arraybuffer' : 'text',
              withCredentials: includeCredentials,
            }),
          );

          if (this._timeoutId) clearTimeout(this._timeoutId);
          if (this._aborted) return;

          const headerMap = buildResponseHeaders(response.responseHeaders, rule.responseHeaders, includeCredentials);
          this._responseHeaders = Object.fromEntries(Object.entries(headerMap).map(([k, v]) => [k.toLowerCase(), v]));

          const responseUrl = response.finalUrl || this._url;
          this.responseURL = responseUrl;
          this.status = response.status;
          this.statusText = response.statusText ?? '';
          const bodyBuffer =
            response.response instanceof ArrayBuffer
              ? response.response
              : new TextEncoder().encode(response.responseText ?? '');

          this.readyState = ProxyXHR.HEADERS_RECEIVED;
          emit(this, 'readystatechange');
          this.readyState = ProxyXHR.LOADING;
          emit(this, 'readystatechange');

          if (this.responseType === 'arraybuffer') {
            this.response = bodyBuffer;
          } else if (this.responseType === 'blob') {
            this.response = new Blob([bodyBuffer], {
              type: this.getResponseHeader('content-type') || this._overrideMime || 'application/octet-stream',
            });
          } else if (this.responseType === 'json') {
            const text = new TextDecoder().decode(bodyBuffer);
            this.responseText = text;
            try {
              this.response = JSON.parse(text);
            } catch {
              this.response = null;
            }
          } else {
            this.response = new TextDecoder().decode(bodyBuffer);
            this.responseText = this.response;
          }

          this.readyState = ProxyXHR.DONE;
          emit(this, 'readystatechange');
          emit(this, 'load');
          emit(this, 'loadend');
        } catch (err) {
          if (this._timeoutId) clearTimeout(this._timeoutId);
          if (this._aborted) return;
          this.status = 0;
          this.statusText = err?.message ?? '';
          this.readyState = ProxyXHR.DONE;
          emit(this, 'readystatechange');
          emit(this, err?.message === 'timeout' ? 'timeout' : 'error');
          emit(this, 'loadend');
        }
      }
    }

    ProxyXHR.UNSENT = 0;
    ProxyXHR.OPENED = 1;
    ProxyXHR.HEADERS_RECEIVED = 2;
    ProxyXHR.LOADING = 3;
    ProxyXHR.DONE = 4;

    win.XMLHttpRequest = ProxyXHR;
  };

  const ensureMediaProxy = () => {
    if (mediaPatched) return;
    mediaPatched = true;
    const win = pageWindow;

    const srcDescriptor = Object.getOwnPropertyDescriptor(win.HTMLMediaElement.prototype, 'src');
    if (srcDescriptor && srcDescriptor.set) {
      Object.defineProperty(win.HTMLMediaElement.prototype, 'src', {
        ...srcDescriptor,
        set(value) {
          if (typeof value === 'string') {
            // Start proxying in background but set original URL immediately
            proxyMediaIfNeeded(value).then(proxied => {
              if (proxied && this.src === value) {
                // Only update if src hasn't changed
                srcDescriptor.set.call(this, proxied);
              }
            });
            return srcDescriptor.set.call(this, value);
          }
          return srcDescriptor.set.call(this, value);
        },
      });
    }

    // CRITICAL FIX: Keep setAttribute synchronous
    const originalMediaSetAttribute = win.HTMLMediaElement.prototype.setAttribute;
    win.HTMLMediaElement.prototype.setAttribute = function (name, value) {
      if (typeof name === 'string' && name.toLowerCase() === 'src' && typeof value === 'string') {
        // Start proxying in background but set attribute immediately
        proxyMediaIfNeeded(value).then(proxied => {
          if (proxied && this.getAttribute('src') === value) {
            // Only update if src attribute hasn't changed
            originalMediaSetAttribute.call(this, name, proxied);
          }
        });
      }
      return originalMediaSetAttribute.call(this, name, value);
    };

    win.addEventListener('beforeunload', () => {
      MEDIA_BLOBS.forEach((_, blobUrl) => URL.revokeObjectURL(blobUrl));
      MEDIA_BLOBS.clear();
    });
  };

  const ensureAllProxies = () => {
    ensureFetchProxy();
    ensureXhrProxy();
    ensureMediaProxy();
  };

  // --- Cleanup helper ----------------------------------------------------
  const cleanupOldStreamData = () => {
    // Clear old blob URLs
    MEDIA_BLOBS.forEach((_, blobUrl) => {
      try {
        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        log('Failed to revoke blob URL', err);
      }
    });
    MEDIA_BLOBS.clear();
    PROXY_CACHE.clear();
    log('Cleaned up old stream data');
  };

  // --- Message handlers --------------------------------------------------
  const handleHello = async () => ({
    success: true,
    version: SCRIPT_VERSION,
    allowed: true,
    hasPermission: true,
  });

  const handleMakeRequest = async (reqBody) => {
    if (!reqBody) throw new Error('No request body found in the request.');
    const url = makeFullUrl(reqBody.url, reqBody);
    const includeCredentials = shouldSendCredentials(url, reqBody.credentials, reqBody.withCredentials);

    const response = await gmRequest({
      url,
      method: reqBody.method || 'GET',
      headers: reqBody.headers,
      data: mapBodyToPayload(reqBody.body, reqBody.bodyType),
      responseType: 'arraybuffer',
      withCredentials: includeCredentials,
    });

    const headers = buildResponseHeaders(response.responseHeaders, null, includeCredentials);
    const contentType = headers['content-type'] || '';
    let parsedBody;

    try {
      if (contentType.includes('application/json')) {
        const textBody =
          response.response instanceof ArrayBuffer
            ? new TextDecoder().decode(response.response)
            : response.responseText ?? '';
        parsedBody = JSON.parse(textBody);
      } else if (response.response instanceof ArrayBuffer) {
        parsedBody = new TextDecoder().decode(response.response);
      } else {
        parsedBody = response.responseText ?? '';
      }
    } catch (err) {
      log('Failed to parse response body, returning raw text', err);
      parsedBody = response.responseText ?? '';
    }

    return {
      success: true,
      response: {
        statusCode: response.status,
        headers,
        finalUrl: response.finalUrl || url,
        body: parsedBody,
      },
    };
  };

  const handlePrepareStream = async (reqBody) => {
    if (!reqBody) throw new Error('No request body found in the request.');
    
    // Clean up old stream data before preparing new stream
    cleanupOldStreamData();
    
    const responseHeaders = Object.entries(reqBody.responseHeaders ?? {}).reduce((acc, [k, v]) => {
      const key = k.toLowerCase();
      if (MODIFIABLE_RESPONSE_HEADERS.includes(key)) acc[key] = v;
      return acc;
    }, {});

    STREAM_RULES.set(reqBody.ruleId, {
      ...reqBody,
      responseHeaders,
    });
    
    log('Stream prepared:', reqBody.ruleId);
    ensureAllProxies();
    return { success: true };
  };

  const handleOpenPage = async (reqBody) => {
    if (reqBody?.redirectUrl) {
      window.location.href = reqBody.redirectUrl;
    }
    return { success: true };
  };

  // --- Messaging bridge --------------------------------------------------
  const shouldHandleMessage = (event, config) => {
    if (config.__internal) return false;
    if (event.source !== pageWindow) return false;
    if (event.data?.name !== config.name) return false;
    if (config.relayId !== undefined && event.data?.relayId !== config.relayId) return false;
    return true;
  };

  const relay = (config, handler) => {
    const listener = async (event) => {
      if (!shouldHandleMessage(event, config)) return;
      if (event.data?.relayed) return;

      try {
        const result = await handler?.(event.data?.body);
        pageWindow.postMessage(
          {
            name: config.name,
            relayId: config.relayId,
            instanceId: event.data?.instanceId,
            body: result,
            relayed: true,
          },
          config.targetOrigin || '/',
        );
      } catch (err) {
        pageWindow.postMessage(
          {
            name: config.name,
            relayId: config.relayId,
            instanceId: event.data?.instanceId,
            body: {
              success: false,
              error: err instanceof Error ? err.message : String(err),
            },
            relayed: true,
          },
          config.targetOrigin || '/',
        );
      }
    };

    pageWindow.addEventListener('message', listener);
    return () => pageWindow.removeEventListener('message', listener);
  };

  relay({ name: 'hello' }, handleHello);
  relay({ name: 'makeRequest' }, handleMakeRequest);
  relay({ name: 'prepareStream' }, handlePrepareStream);
  relay({ name: 'openPage' }, handleOpenPage);

  log('Userscript proxy loaded');
})();
