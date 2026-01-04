// ==UserScript==
// @name         P-Stream (GrokNT Fork)
// @namespace    https://pstream.mov/
// @version      1.4.3
// @description  P-Stream compatible UserScript
// @author       Duplicake, P-Stream Team, groknt
// @icon         https://raw.githubusercontent.com/p-stream/p-stream/production/public/mstile-150x150.jpeg
// @match        *://pstream.mov/*
// @match        *://aether.mom/*
// @match        *://lordflix.club/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/559068/P-Stream%20%28GrokNT%20Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559068/P-Stream%20%28GrokNT%20Fork%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const VERSION = "1.4.3";
  const LOG_PREFIX = "P-Stream:";

  const CORS_HEADERS = Object.freeze({
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "access-control-allow-headers": "*",
  });

  const MODIFIABLE_HEADERS = new Set([
    "access-control-allow-origin",
    "access-control-allow-methods",
    "access-control-allow-headers",
    "content-security-policy",
    "content-security-policy-report-only",
    "content-disposition",
  ]);

  const STREAMING_EXTENSIONS_REGEX = /\.(m3u8|mpd)(?:\?|$)/i;
  const STREAMING_MIME_TYPES = ["mpegurl", "dash+xml"];

  const XHR_STATES = Object.freeze({
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4,
  });

  const XHR_EVENT_TYPES = Object.freeze([
    "readystatechange",
    "load",
    "error",
    "timeout",
    "abort",
    "loadend",
    "progress",
    "loadstart",
  ]);

  const globalContext =
    typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

  const gmXmlHttpRequest =
    typeof GM_xmlhttpRequest === "function"
      ? GM_xmlhttpRequest
      : typeof GM?.xmlHttpRequest === "function"
        ? GM.xmlHttpRequest
        : null;

  const pageOrigin = (function () {
    try {
      const { origin, href } = globalContext.location;
      return origin !== "null" ? origin : new URL(href).origin;
    } catch {
      return "*";
    }
  })();

  const proxyRules = new Map();
  const blobUrlRegistry = new Set();
  const proxyCache = new Map();
  const regexCache = new Map();
  const patchStatus = { fetch: false, xhr: false, media: false };

  function logWarning(...args) {
    console.warn(LOG_PREFIX, ...args);
  }

  function logError(...args) {
    console.error(LOG_PREFIX, ...args);
  }

  function normalizeUrl(input, base = globalContext.location.href) {
    if (!input) return null;
    try {
      return new URL(input, base).href;
    } catch {
      return null;
    }
  }

  function parseUrl(input, base = globalContext.location.href) {
    if (!input) return null;
    try {
      return new URL(input, base);
    } catch {
      return null;
    }
  }

  function isSameOrigin(url) {
    try {
      return new URL(url).origin === pageOrigin;
    } catch {
      return false;
    }
  }

  function buildUrl(url, options = {}) {
    const { baseUrl = "", query = {} } = options;
    const base = baseUrl.endsWith("/") ? baseUrl : baseUrl && `${baseUrl}/`;
    const path = url.startsWith("/") ? url.slice(1) : url;
    const fullUrl = `${base}${path}`;

    if (!/^https?:\/\//i.test(fullUrl)) {
      throw new Error(`Invalid URL scheme: ${fullUrl}`);
    }

    const parsedUrl = new URL(fullUrl);
    for (const [key, value] of Object.entries(query)) {
      parsedUrl.searchParams.set(key, value);
    }
    return parsedUrl.href;
  }

  function parseResponseHeaders(rawHeaders) {
    const headers = {};
    if (!rawHeaders) return headers;

    for (const line of rawHeaders.split(/\r?\n/)) {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) continue;

      const key = line.slice(0, separatorIndex).trim().toLowerCase();
      if (!key) continue;

      const value = line.slice(separatorIndex + 1).trim();
      headers[key] = headers[key] ? `${headers[key]}, ${value}` : value;
    }
    return headers;
  }

  function buildResponseHeaders(rawHeaders, ruleHeaders, includeCredentials) {
    const headers = {
      ...CORS_HEADERS,
      ...ruleHeaders,
      ...parseResponseHeaders(rawHeaders),
    };

    if (includeCredentials) {
      headers["access-control-allow-credentials"] = "true";
      if (
        !headers["access-control-allow-origin"] ||
        headers["access-control-allow-origin"] === "*"
      ) {
        headers["access-control-allow-origin"] = pageOrigin;
      }
    }

    return headers;
  }

  function shouldIncludeCredentials(
    url,
    credentialsMode,
    forceInclude = false,
  ) {
    if (forceInclude || credentialsMode === "include") return true;
    if (credentialsMode === "omit") return false;
    return isSameOrigin(url);
  }

  function normalizeRequestBody(body) {
    if (body == null) return undefined;
    if (
      typeof body === "string" ||
      body instanceof FormData ||
      body instanceof Blob ||
      body instanceof ArrayBuffer ||
      ArrayBuffer.isView(body)
    ) {
      return body;
    }
    if (body instanceof URLSearchParams) return body.toString();
    if (typeof body === "object") return JSON.stringify(body);
    return body;
  }

  function deserializeRequestBody(body, bodyType) {
    if (body == null) return undefined;

    switch (bodyType) {
      case "FormData": {
        const formData = new FormData();
        for (const [key, value] of body) {
          formData.append(key, value);
        }
        return formData;
      }
      case "URLSearchParams":
        return new URLSearchParams(body);
      case "object":
        return JSON.stringify(body);
      default:
        return body;
    }
  }

  function executeGmRequest(options) {
    return new Promise((resolve, reject) => {
      if (!gmXmlHttpRequest) {
        reject(new Error("GM_xmlhttpRequest unavailable"));
        return;
      }

      gmXmlHttpRequest({
        ...options,
        onload: resolve,
        onerror: (error) => reject(new Error(error?.error || "Network error")),
        ontimeout: () => reject(new Error("Request timeout")),
      });
    });
  }

  function responseToArrayBuffer(response) {
    return response.response instanceof ArrayBuffer
      ? response.response
      : new TextEncoder().encode(response.responseText || "");
  }

  function getCompiledRegex(pattern) {
    if (regexCache.has(pattern)) {
      return regexCache.get(pattern);
    }
    try {
      const regex = new RegExp(pattern);
      regexCache.set(pattern, regex);
      return regex;
    } catch {
      regexCache.set(pattern, null);
      return null;
    }
  }

  function findMatchingRule(url) {
    const parsedUrl = parseUrl(url);
    if (!parsedUrl) return null;

    const normalizedUrl = parsedUrl.href;
    const hostname = parsedUrl.hostname;

    for (const rule of proxyRules.values()) {
      if (rule.targetDomains?.length) {
        const domainMatches = rule.targetDomains.some(
          (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
        );
        if (domainMatches) return rule;
      }

      if (rule.targetRegex) {
        const regex = getCompiledRegex(rule.targetRegex);
        if (regex && regex.test(normalizedUrl)) return rule;
      }
    }

    return null;
  }

  function isStreamingContent(contentType, url) {
    return (
      STREAMING_MIME_TYPES.some((mimeType) => contentType.includes(mimeType)) ||
      STREAMING_EXTENSIONS_REGEX.test(url)
    );
  }

  function createBlobUrl(data, contentType = "application/octet-stream") {
    const url = URL.createObjectURL(new Blob([data], { type: contentType }));
    blobUrlRegistry.add(url);
    return url;
  }

  function cleanupStreamData() {
    for (const blobUrl of blobUrlRegistry) {
      try {
        URL.revokeObjectURL(blobUrl);
      } catch {}
    }
    blobUrlRegistry.clear();
    proxyCache.clear();
  }

  function removeRuleCachedRegex(ruleId) {
    const existingRule = proxyRules.get(ruleId);
    if (existingRule?.targetRegex) {
      regexCache.delete(existingRule.targetRegex);
    }
  }

  function proxyMediaSource(url) {
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) return Promise.resolve(null);

    const rule = findMatchingRule(normalizedUrl);
    if (!rule) return Promise.resolve(null);

    if (proxyCache.has(normalizedUrl)) {
      return proxyCache.get(normalizedUrl);
    }

    const proxyPromise = (async () => {
      try {
        const response = await executeGmRequest({
          url: normalizedUrl,
          method: "GET",
          headers: rule.requestHeaders,
          responseType: "arraybuffer",
          withCredentials: true,
        });

        const contentType =
          parseResponseHeaders(response.responseHeaders)["content-type"] || "";
        if (isStreamingContent(contentType, normalizedUrl)) return null;

        return createBlobUrl(responseToArrayBuffer(response), contentType);
      } catch (error) {
        logWarning("Media proxy failed:", error.message);
        return null;
      } finally {
        setTimeout(() => proxyCache.delete(normalizedUrl), 1000);
      }
    })();

    proxyCache.set(normalizedUrl, proxyPromise);
    return proxyPromise;
  }

  function patchFetch() {
    if (patchStatus.fetch) return;
    patchStatus.fetch = true;

    const nativeFetch = globalContext.fetch.bind(globalContext);

    globalContext.fetch = async function (input, init = {}) {
      const url = normalizeUrl(typeof input === "string" ? input : input?.url);
      const rule = url && findMatchingRule(url);

      if (!rule) return nativeFetch(input, init);

      const headers = {
        ...rule.requestHeaders,
        ...(init.headers instanceof Headers
          ? Object.fromEntries(init.headers)
          : init.headers),
      };

      const includeCredentials = shouldIncludeCredentials(
        url,
        init.credentials,
      );

      try {
        const response = await executeGmRequest({
          url,
          method: init.method || "GET",
          headers,
          data: normalizeRequestBody(init.body),
          responseType: "arraybuffer",
          withCredentials: includeCredentials,
        });

        return new Response(responseToArrayBuffer(response), {
          status: response.status,
          statusText: response.statusText || "",
          headers: buildResponseHeaders(
            response.responseHeaders,
            rule.responseHeaders,
            includeCredentials,
          ),
        });
      } catch (error) {
        logWarning("Fetch proxy failed:", error.message);
        return nativeFetch(input, init);
      }
    };
  }

  function patchXhr() {
    if (patchStatus.xhr) return;
    patchStatus.xhr = true;

    const NativeXMLHttpRequest = globalContext.XMLHttpRequest;

    class ProxyXMLHttpRequest {
      constructor() {
        this._nativeXhr = new NativeXMLHttpRequest();
        this._useNative = true;
        this._eventListeners = new Map();
        this._requestHeaders = {};
        this._responseHeaders = {};
        this._matchedRule = null;
        this._requestUrl = "";
        this._requestMethod = "GET";
        this._isAborted = false;
        this._timeoutId = null;
        this._overriddenMimeType = "";
        this._nativeEventsBound = false;

        this.readyState = XHR_STATES.UNSENT;
        this.status = 0;
        this.statusText = "";
        this.response = null;
        this.responseText = "";
        this.responseURL = "";
        this.responseType = "";
        this.withCredentials = false;
        this.timeout = 0;
        this.upload = this._nativeXhr.upload;

        this.onreadystatechange = null;
        this.onload = null;
        this.onerror = null;
        this.ontimeout = null;
        this.onabort = null;
        this.onloadend = null;
        this.onprogress = null;
        this.onloadstart = null;
      }

      _emitEvent(eventType, event = new Event(eventType)) {
        const handler = this[`on${eventType}`];
        if (handler) {
          try {
            handler.call(this, event);
          } catch (error) {
            logError("XHR handler error:", error);
          }
        }

        const listeners = this._eventListeners.get(eventType);
        if (listeners) {
          for (const listener of listeners) {
            try {
              listener.call(this, event);
            } catch (error) {
              logError("XHR listener error:", error);
            }
          }
        }
      }

      _syncFromNative() {
        if (!this._useNative) return;

        try {
          this.readyState = this._nativeXhr.readyState;

          if (this.readyState >= XHR_STATES.HEADERS_RECEIVED) {
            this.status = this._nativeXhr.status;
            this.statusText = this._nativeXhr.statusText;
          }

          if (this.readyState === XHR_STATES.DONE) {
            this.response = this._nativeXhr.response;
            this.responseURL = this._nativeXhr.responseURL;

            const responseType = this._nativeXhr.responseType;
            if (!responseType || responseType === "text") {
              this.responseText = this._nativeXhr.responseText;
            }
          }
        } catch {}
      }

      _bindNativeEvents() {
        if (this._nativeEventsBound) return;
        this._nativeEventsBound = true;

        for (const eventType of XHR_EVENT_TYPES) {
          this._nativeXhr.addEventListener(eventType, (event) => {
            this._syncFromNative();
            this._emitEvent(eventType, event);
          });
        }
      }

      _setResponseData(buffer) {
        const contentType =
          this.getResponseHeader("content-type") ||
          this._overriddenMimeType ||
          "application/octet-stream";

        switch (this.responseType) {
          case "arraybuffer":
            this.response = buffer;
            break;

          case "blob":
            this.response = new Blob([buffer], { type: contentType });
            break;

          case "json": {
            const text = new TextDecoder().decode(buffer);
            this.responseText = text;
            try {
              this.response = JSON.parse(text);
            } catch {
              this.response = null;
            }
            break;
          }

          case "document": {
            const text = new TextDecoder().decode(buffer);
            this.responseText = text;
            try {
              const parser = new DOMParser();
              const mimeType = contentType.includes("xml")
                ? "application/xml"
                : "text/html";
              this.response = parser.parseFromString(text, mimeType);
            } catch {
              this.response = null;
            }
            break;
          }

          default: {
            const text = new TextDecoder().decode(buffer);
            this.response = text;
            this.responseText = text;
          }
        }
      }

      addEventListener(eventType, callback) {
        if (!this._eventListeners.has(eventType)) {
          this._eventListeners.set(eventType, []);
        }
        this._eventListeners.get(eventType).push(callback);

        if (this._useNative) {
          this._nativeXhr.addEventListener(eventType, callback);
        }
      }

      removeEventListener(eventType, callback) {
        const listeners = this._eventListeners.get(eventType);
        if (listeners) {
          const index = listeners.indexOf(callback);
          if (index !== -1) listeners.splice(index, 1);
        }

        if (this._useNative) {
          this._nativeXhr.removeEventListener(eventType, callback);
        }
      }

      dispatchEvent(event) {
        if (this._useNative) {
          return this._nativeXhr.dispatchEvent(event);
        }
        this._emitEvent(event.type, event);
        return !event.defaultPrevented;
      }

      open(method, url, async = true, username, password) {
        this._requestMethod = method;
        this._requestUrl = normalizeUrl(url) || url;
        this._matchedRule = findMatchingRule(this._requestUrl);
        this._useNative = !this._matchedRule;

        if (this._useNative) {
          return this._nativeXhr.open(method, url, async, username, password);
        }

        this.readyState = XHR_STATES.OPENED;
        this._emitEvent("readystatechange");
      }

      setRequestHeader(name, value) {
        if (this._useNative) {
          return this._nativeXhr.setRequestHeader(name, value);
        }
        this._requestHeaders[name] = value;
      }

      getResponseHeader(name) {
        if (this._useNative) {
          return this._nativeXhr.getResponseHeader(name);
        }
        return this._responseHeaders[name?.toLowerCase()] ?? null;
      }

      getAllResponseHeaders() {
        if (this._useNative) {
          return this._nativeXhr.getAllResponseHeaders();
        }
        return Object.entries(this._responseHeaders)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\r\n");
      }

      overrideMimeType(mimeType) {
        if (this._useNative) {
          return this._nativeXhr.overrideMimeType(mimeType);
        }
        this._overriddenMimeType = mimeType;
      }

      abort() {
        if (this._useNative) {
          return this._nativeXhr.abort();
        }

        if (this._timeoutId) {
          clearTimeout(this._timeoutId);
          this._timeoutId = null;
        }

        this._isAborted = true;
        this.readyState = XHR_STATES.UNSENT;
        this._emitEvent("abort");
      }

      async send(body = null) {
        if (this._useNative) {
          this._nativeXhr.withCredentials = this.withCredentials;
          this._nativeXhr.responseType = this.responseType;
          this._nativeXhr.timeout = this.timeout;
          this._bindNativeEvents();
          return this._nativeXhr.send(body);
        }

        const rule = this._matchedRule;
        const url = this._requestUrl;
        const method = this._requestMethod;

        const headers = { ...rule.requestHeaders, ...this._requestHeaders };
        const includeCredentials = shouldIncludeCredentials(
          url,
          this.withCredentials ? "include" : undefined,
          this.withCredentials,
        );
        const binaryResponse =
          this.responseType === "arraybuffer" || this.responseType === "blob";

        const requestPromise = executeGmRequest({
          url,
          method,
          headers,
          data: normalizeRequestBody(body),
          responseType: binaryResponse ? "arraybuffer" : "text",
          withCredentials: includeCredentials,
        });

        let timeoutPromise = null;
        if (this.timeout > 0) {
          timeoutPromise = new Promise((_, reject) => {
            this._timeoutId = setTimeout(
              () => reject(new Error("timeout")),
              this.timeout,
            );
          });
        }

        this._emitEvent("loadstart");

        try {
          const response = await (timeoutPromise
            ? Promise.race([requestPromise, timeoutPromise])
            : requestPromise);

          if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
          }

          if (this._isAborted) return;

          this._responseHeaders = buildResponseHeaders(
            response.responseHeaders,
            rule.responseHeaders,
            includeCredentials,
          );
          this.responseURL = response.finalUrl || url;
          this.status = response.status;
          this.statusText = response.statusText || "";

          const buffer = responseToArrayBuffer(response);

          this.readyState = XHR_STATES.HEADERS_RECEIVED;
          this._emitEvent("readystatechange");

          this.readyState = XHR_STATES.LOADING;
          this._emitEvent("readystatechange");

          this._setResponseData(buffer);

          this.readyState = XHR_STATES.DONE;
          this._emitEvent("readystatechange");
          this._emitEvent("load");
          this._emitEvent("loadend");
        } catch (error) {
          if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
          }

          if (this._isAborted) return;

          this.status = 0;
          this.statusText = error.message || "";
          this.readyState = XHR_STATES.DONE;

          this._emitEvent("readystatechange");
          this._emitEvent(error.message === "timeout" ? "timeout" : "error");
          this._emitEvent("loadend");
        }
      }
    }

    Object.assign(ProxyXMLHttpRequest, XHR_STATES);
    globalContext.XMLHttpRequest = ProxyXMLHttpRequest;
  }

  function patchMediaElements() {
    if (patchStatus.media) return;
    patchStatus.media = true;

    const mediaPrototype = globalContext.HTMLMediaElement.prototype;
    const srcDescriptor = Object.getOwnPropertyDescriptor(
      mediaPrototype,
      "src",
    );
    const nativeSetAttribute = mediaPrototype.setAttribute;

    if (srcDescriptor?.set) {
      const originalSetter = srcDescriptor.set;

      Object.defineProperty(mediaPrototype, "src", {
        ...srcDescriptor,
        set(value) {
          const element = this;

          if (typeof value !== "string") {
            originalSetter.call(element, value);
            return;
          }

          const normalizedValue = normalizeUrl(value);
          if (!normalizedValue) {
            originalSetter.call(element, value);
            return;
          }

          originalSetter.call(element, value);

          proxyMediaSource(value)
            .then((proxiedUrl) => {
              if (proxiedUrl && element.src === normalizedValue) {
                originalSetter.call(element, proxiedUrl);
              }
            })
            .catch(() => {});
        },
      });
    }

    mediaPrototype.setAttribute = function (name, value) {
      const element = this;

      if (name?.toLowerCase() !== "src" || typeof value !== "string") {
        return nativeSetAttribute.call(element, name, value);
      }

      const normalizedValue = normalizeUrl(value);
      if (!normalizedValue) {
        return nativeSetAttribute.call(element, "src", value);
      }

      nativeSetAttribute.call(element, "src", value);

      proxyMediaSource(value)
        .then((proxiedUrl) => {
          if (proxiedUrl && element.src === normalizedValue) {
            nativeSetAttribute.call(element, "src", proxiedUrl);
          }
        })
        .catch(() => {});
    };

    globalContext.addEventListener("beforeunload", () => {
      for (const url of blobUrlRegistry) {
        URL.revokeObjectURL(url);
      }
      blobUrlRegistry.clear();
    });
  }

  function installProxies() {
    patchFetch();
    patchXhr();
    patchMediaElements();
  }

  const messageHandlers = {
    hello() {
      return {
        success: true,
        version: VERSION,
        allowed: true,
        hasPermission: true,
      };
    },

    async makeRequest(body) {
      if (!body) throw new Error("Missing request body");

      const url = buildUrl(body.url, body);
      const includeCredentials = shouldIncludeCredentials(
        url,
        body.credentials,
        body.withCredentials,
      );

      const response = await executeGmRequest({
        url,
        method: body.method || "GET",
        headers: body.headers,
        data: deserializeRequestBody(body.body, body.bodyType),
        responseType: "arraybuffer",
        withCredentials: includeCredentials,
      });

      const headers = buildResponseHeaders(
        response.responseHeaders,
        null,
        includeCredentials,
      );
      const text = new TextDecoder().decode(responseToArrayBuffer(response));
      const contentType = headers["content-type"] || "";

      let parsedBody = text;
      if (contentType.includes("application/json")) {
        try {
          parsedBody = JSON.parse(text);
        } catch {}
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
    },

    async prepareStream(body) {
      if (!body) throw new Error("Missing request body");

      cleanupStreamData();
      removeRuleCachedRegex(body.ruleId);

      const responseHeaders = {};
      if (body.responseHeaders) {
        for (const [key, value] of Object.entries(body.responseHeaders)) {
          const normalizedKey = key.toLowerCase();
          if (MODIFIABLE_HEADERS.has(normalizedKey)) {
            responseHeaders[normalizedKey] = value;
          }
        }
      }

      proxyRules.set(body.ruleId, { ...body, responseHeaders });
      installProxies();

      return { success: true };
    },

    openPage(body) {
      if (body?.redirectUrl) {
        globalContext.location.href = body.redirectUrl;
      }
      return { success: true };
    },
  };

  function setupMessageRelay(messageName, handler) {
    globalContext.addEventListener("message", async (event) => {
      if (
        event.source !== globalContext ||
        event.data?.name !== messageName ||
        event.data?.relayed
      ) {
        return;
      }

      const { instanceId, body } = event.data;

      try {
        const result = await handler(body);
        globalContext.postMessage(
          { name: messageName, instanceId, body: result, relayed: true },
          "/",
        );
      } catch (error) {
        logError(`${messageName} handler failed:`, error.message);
        globalContext.postMessage(
          {
            name: messageName,
            instanceId,
            body: { success: false, error: error.message || String(error) },
            relayed: true,
          },
          "/",
        );
      }
    });
  }

  for (const [name, handler] of Object.entries(messageHandlers)) {
    setupMessageRelay(name, handler);
  }
})();
