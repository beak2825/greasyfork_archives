// ==UserScript==
// @name               Open in Kemono
// @name:en            Open in Kemono
// @name:zh            在Kemono中打開
// @name:zh-CN         在Kemono中打开
// @name:zh-TW         在Kemono中打開
// @namespace          https://greasyfork.org/zh-CN/users/667968-pyudng
// @version            1.10.0
// @author             PY-DNG
// @description        Open corresponding kemono page from multiple services
// @description:en     Open corresponding kemono page from multiple services
// @description:zh     从多个资源平台网站打开Kemono中的对应页面
// @description:zh-CN  从多个资源平台网站打开Kemono中的对应页面
// @description:zh-TW  從多個資源平臺網站打開Kemono中的對應頁面
// @license            GPL-3.0-or-later
// @icon               https://kemono.cr/assets/favicon-CPB6l7kH.ico
// @match              http*://*.pixiv.net/*
// @match              http*://*.fantia.jp/*
// @match              http*://*.subscribestar.adult/*
// @match              http*://*.subscribestar.com/*
// @match              http*://*.dlsite.com/*
// @match              http*://*.fanbox.cc/*
// @match              http*://www.patreon.com/*
// @match              http*://*.boosty.to/*
// @match              http*://*.gumroad.com/*
// @require            https://cdn.jsdelivr.net/npm/vue@3.5.26/dist/vue.global.prod.js
// @grant              GM_addValueChangeListener
// @grant              GM_deleteValue
// @grant              GM_getValue
// @grant              GM_info
// @grant              GM_listValues
// @grant              GM_openInTab
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @grant              GM_xmlhttpRequest
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/559907/Open%20in%20Kemono.user.js
// @updateURL https://update.greasyfork.org/scripts/559907/Open%20in%20Kemono.meta.js
// ==/UserScript==

(async function (Vue) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const Vue__namespace = _interopNamespaceDefault(Vue);

  const i=new Set;const o = async e=>{i.has(e)||(i.add(e),(t=>{Array.isArray(window._oikStyles)?window._oikStyles.push(t):window._oikStyles=[t];})(e));};

  o(" .oik-jump-button[data-v-f9e475ed]{border:2px solid var(--color-border);background-color:var(--color-bg);color:var(--color-text);padding:.25em;cursor:pointer;font-size:14px}.oik-root{--color-text: #1a1a1a;--color-bg: #ffffff;--color-primary: #2563eb;--color-secondary: #f3f4f6;--color-border: #e5e7eb}.oik-root.oik-dark{--color-text: #f9fafb;--color-bg: #1f1f1f;--color-primary: #60a5fa;--color-secondary: #1f2937;--color-border: #374151}.oik-root .oik-disabled{filter:grayscale(1) brightness(.8);cursor:not-allowed} ");

  const console$1 = Object.assign( Object.create(null), window.console);
  const fetch = window.fetch;
  const addEventListener = EventTarget.prototype.addEventListener;
  var _GM_addValueChangeListener = (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_deleteValue = (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_listValues = (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_openInTab = (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const checkers = {
    "switch": (val) => !!val,
    "url": (val) => location.href === val,
    "path": (val) => location.pathname === val,
    "host": (val) => location.host === val,
    "regurl": (val) => !!location.href.match(val),
    "regpath": (val) => !!location.pathname.match(val),
    "reghost": (val) => !!location.host.match(val),
    "starturl": (val) => location.href.startsWith(val),
    "startpath": (val) => location.pathname.startsWith(val),
    "endhost": (val) => location.host.endsWith(val),
    "func": (val) => !!val()
  };
  function testChecker(checker, mode = "or") {
    if (Array.isArray(checker)) {
      if (mode === "and")
        return checker.every((c) => testChecker(c));
      else
        return checker.some((c) => testChecker(c));
    }
    const result = checkers[checker.type](checker.value);
    const invert = !!checker.invert;
    return invert !== result;
  }
  class Logger {
static Level = {
Debug: 0,
Detail: 1,
Info: 2,
Warning: 3,
Error: 4,
Important: 5
    };
level = Logger.Level.Info;
static LevelColor = {
      Debug: "#94a3b8",
      Detail: "#10b981",
      Info: "inherit",
      Warning: "#f59e0b",
      Error: "#ef4444",
      Important: "#a855f7"
    };
static PrefixColor = "#6366f1";
    constructor() {
    }
    log(level, type, logger2 = "log", ...content) {
      const numLevel = Logger.Level[level];
      if (numLevel < this.level) return false;
      if (isStringLog()) {
        content = [
          `%c[${_GM_info.script.name}] [${level}]
%c${content[0]}`,
          `color: ${Logger.PrefixColor};`,
          `color: ${Logger.LevelColor[level]};`
        ];
      }
      console$1[logger2].apply(null, content);
      return true;
      function isStringLog(content2) {
        return type === "string";
      }
    }
simple(level, content) {
      return this.log(level, "string", "log", content);
    }
  }
  const logger = new Logger();
  logger.level = Logger.Level.Info;
  function request(options) {
    const { promise, reject, resolve } = Promise.withResolvers();
    _GM_xmlhttpRequest({
      ...options,
      onload(response) {
        resolve(response.response);
        options.onload?.call(this, response);
      },
      onerror(response) {
        reject(response);
        options.onerror?.call(this, response);
      },
      onabort() {
        reject();
        options.onabort?.();
      }
    });
    return promise;
  }
  async function requestJson(options) {
    const responseText = await request(options);
    const json = JSON.parse(responseText);
    return json;
  }
  function mitt(n) {
    return { all: n = n || new Map(), on: function(t2, e) {
      var i = n.get(t2);
      i ? i.push(e) : n.set(t2, [e]);
    }, off: function(t2, e) {
      var i = n.get(t2);
      i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t2, []));
    }, emit: function(t2, e) {
      var i = n.get(t2);
      i && i.slice().map(function(n2) {
        n2(e);
      }), (i = n.get("*")) && i.slice().map(function(n2) {
        n2(t2, e);
      });
    } };
  }
  function getSearchParam(name, url) {
    url = url ?? location.href;
    const params = new URLSearchParams(new URL(url).search);
    return params.get(name);
  }
  class URLChangeMonitor {
emitter;
originalPushState;
originalReplaceState;
isInitialized = false;
    constructor() {
      this.emitter = mitt();
      this.originalPushState = history.pushState;
      this.originalReplaceState = history.replaceState;
    }
init() {
      if (this.isInitialized) return;
      try {
        this.hookPushState();
        this.hookReplaceState();
        this.listenHashChange();
        this.listenPopstate();
        this.isInitialized = true;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(`初始化失败：${String(error)}`);
        this.emitter.emit("error", err);
        console.error("[URLChangeMonitor] 初始化失败：", err);
      }
    }
destroy() {
      if (!this.isInitialized) return;
      history.pushState = this.originalPushState;
      history.replaceState = this.originalReplaceState;
      window.removeEventListener("hashchange", this.handleHashChange);
      window.removeEventListener("popstate", this.handlePopstate);
      this.emitter.all.clear();
      this.isInitialized = false;
      console.log("[URLChangeMonitor] 销毁成功，已停止监听URL变更");
    }
onUrlChange(callback) {
      this.emitter.on("urlChange", callback);
      return () => this.emitter.off("urlChange", callback);
    }
onError(callback) {
      this.emitter.on("error", callback);
      return () => this.emitter.off("error", callback);
    }
hookPushState() {
      const _this = this;
      history.pushState = function(state, title, url) {
        const oldUrl = window.location.href;
        _this.originalPushState.apply(this, [state, title, url]);
        _this.triggerUrlChange("pushState", oldUrl, url?.toString() || oldUrl, state);
      };
    }
hookReplaceState() {
      const _this = this;
      history.replaceState = function(state, title, url) {
        const oldUrl = window.location.href;
        _this.originalReplaceState.apply(this, [state, title, url]);
        _this.triggerUrlChange("replaceState", oldUrl, url?.toString() || oldUrl, state);
      };
    }
listenHashChange() {
      this.handleHashChange = this.handleHashChange.bind(this);
      window.addEventListener("hashchange", this.handleHashChange);
    }
handleHashChange(e) {
      const isReplace = e.newURL === e.oldURL;
      const action = isReplace ? "replaceHash" : "pushHash";
      this.triggerUrlChange(action, e.oldURL, e.newURL, null);
    }
listenPopstate() {
      this.handlePopstate = this.handlePopstate.bind(this);
      window.addEventListener("popstate", this.handlePopstate);
    }
handlePopstate(e) {
      const oldUrl = window.location.href;
      this.triggerUrlChange("popstate", oldUrl, window.location.href, e.state);
    }
triggerUrlChange(action, oldUrl, targetUrl, state) {
      const newUrlObj = new URL(targetUrl, window.location.origin);
      const detail = {
        action,
        oldUrl,
        newUrl: newUrlObj.href,
        hash: newUrlObj.hash,
        pathname: newUrlObj.pathname,
        search: newUrlObj.search,
        state
      };
      this.emitter.emit("urlChange", detail);
    }
  }
  function detectDom(rootOrSelectorOrOptions, selectors, attributes, callback) {
    let config;
    if (rootOrSelectorOrOptions instanceof Node) {
      config = {
        selectors: Array.isArray(selectors) ? selectors : [selectors || ""],
        root: rootOrSelectorOrOptions,
        attributes: attributes || false,
        callback: callback || null
      };
    } else if (typeof rootOrSelectorOrOptions === "object" && !(rootOrSelectorOrOptions instanceof Node)) {
      const options = rootOrSelectorOrOptions;
      config = {
        selectors: Array.isArray(options.selector) ? options.selector : [options.selector || ""],
        root: options.root || document,
        attributes: options.attributes || false,
        callback: options.callback || null
      };
    } else {
      const selector = rootOrSelectorOrOptions;
      return new Promise((resolve) => {
        detectDom(document, selector, false, resolve);
      });
    }
    const checkExisting = () => {
      const elements = selectAll(config.root, config.selectors);
      if (elements.length > 0) {
        elements.forEach((elm) => {
          config.callback?.(elm);
        });
        return true;
      }
      return false;
    };
    if (checkExisting()) {
      const observer2 = new MutationObserver(() => {
      });
      observer2.disconnect();
      return observer2;
    }
    const observer = new MutationObserver((mutations) => {
      const addedNodes = [];
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          addedNodes.push(...mutation.addedNodes);
        } else if (mutation.type === "attributes" && mutation.target) {
          addedNodes.push(mutation.target);
        }
      });
      const matchedNodes = new Set();
      addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && matches(node, config.selectors)) {
          matchedNodes.add(node);
        }
        const children = selectAll(node, config.selectors);
        children.forEach((child) => matchedNodes.add(child));
      });
      matchedNodes.forEach((node) => {
        config.callback?.(node);
        if (!config.callback) {
          observer.disconnect();
        }
      });
    });
    observer.observe(config.root, {
      childList: true,
      subtree: true,
      attributes: config.attributes
    });
    return observer;
  }
  function matches(element, selectors) {
    return selectors.some((selector) => element.matches(selector));
  }
  function selectAll(root, selectors) {
    if (!(root instanceof Element || root instanceof Document || root instanceof DocumentFragment)) {
      return [];
    }
    return selectors.flatMap((selector) => {
      return Array.from(root.querySelectorAll(selector));
    });
  }
  class UserscriptStorage {
    storage;
    defaultValues;
    static EmptyValue = Symbol("Empty Value");
constructor(storage2, defaultValues) {
      this.storage = storage2;
      this.defaultValues = defaultValues;
    }
get(name, defaultVal = UserscriptStorage.EmptyValue) {
      const EmptyValue = UserscriptStorage.EmptyValue;
      defaultVal = defaultVal !== UserscriptStorage.EmptyValue ? (
defaultVal
      ) : (
Object.hasOwn(this.defaultValues, name) ? (
this.defaultValues[name]
        ) : (
EmptyValue
        )
      );
      const value = this.storage.GM_getValue(name, defaultVal);
      return value === EmptyValue ? void 0 : value;
    }
set(name, value = UserscriptStorage.EmptyValue) {
      if (value === UserscriptStorage.EmptyValue) {
        Object.hasOwn(this.defaultValues, name) && this.storage.GM_setValue(name, this.defaultValues[name]);
      } else {
        this.storage.GM_setValue(name, value);
      }
    }
has(name) {
      const EmptyValue = UserscriptStorage.EmptyValue;
      return this.storage.GM_getValue(name, EmptyValue) !== EmptyValue;
    }
list(noDefaults = false) {
      if (noDefaults) {
        return this.storage.GM_listValues();
      } else {
        const set = new Set();
        const storageKeys = this.storage.GM_listValues();
        const defaultKeys = Object.keys(this.defaultValues);
        [...storageKeys, ...defaultKeys].forEach((key) => set.add(key));
        return Array.from(set);
      }
    }
delete(name) {
      this.storage.GM_deleteValue(name);
    }
    watch(name, callback) {
      return this.storage.GM_addValueChangeListener(name, callback);
    }
  }
  class UserscriptStyling {
styles = Vue.ref({});
    constructor() {
    }
setStyle(id, css) {
      this.styles.value[id] = css;
    }
getStyle(id) {
      return Object.hasOwn(this.styles.value, id) ? this.styles.value[id] : null;
    }
deleteStyle(id) {
      if (Object.hasOwn(this.styles.value, id)) {
        delete this.styles.value[id];
        return true;
      } else {
        return false;
      }
    }
applyTo(doc) {
      const doApply = () => {
        const stylesheets = Object.values(this.styles.value).map((css) => {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(css);
          return sheet;
        });
        doc.adoptedStyleSheets = stylesheets;
      };
      doApply();
      const handle = Vue.watch(this.styles, doApply, { deep: true });
      const abort = () => {
        handle.stop();
        doc.adoptedStyleSheets = [];
      };
      return abort;
    }
  }
  function warn(msg, err) {
    if (typeof console !== "undefined") {
      console.warn(`[intlify] ` + msg);
      if (err) {
        console.warn(err.stack);
      }
    }
  }
  const inBrowser = typeof window !== "undefined";
  const makeSymbol = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
  const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
  const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
  const isNumber = (val) => typeof val === "number" && isFinite(val);
  const isDate = (val) => toTypeString(val) === "[object Date]";
  const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
  const isEmptyObject = (val) => isPlainObject(val) && Object.keys(val).length === 0;
  const assign = Object.assign;
  const _create = Object.create;
  const create = (obj = null) => _create(obj);
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : create());
  };
  function escapeHtml(rawText) {
    return rawText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//g, "&#x2F;").replace(/=/g, "&#x3D;");
  }
  function escapeAttributeValue(value) {
    return value.replace(/&(?![a-zA-Z0-9#]{2,6};)/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function sanitizeTranslatedHtml(html) {
    html = html.replace(/(\w+)\s*=\s*"([^"]*)"/g, (_, attrName, attrValue) => `${attrName}="${escapeAttributeValue(attrValue)}"`);
    html = html.replace(/(\w+)\s*=\s*'([^']*)'/g, (_, attrName, attrValue) => `${attrName}='${escapeAttributeValue(attrValue)}'`);
    const eventHandlerPattern = /\s*on\w+\s*=\s*["']?[^"'>]+["']?/gi;
    if (eventHandlerPattern.test(html)) {
      html = html.replace(/(\s+)(on)(\w+\s*=)/gi, "$1&#111;n$3");
    }
    const javascriptUrlPattern = [
/(\s+(?:href|src|action|formaction)\s*=\s*["']?)\s*javascript:/gi,
/(style\s*=\s*["'][^"']*url\s*\(\s*)javascript:/gi
    ];
    javascriptUrlPattern.forEach((pattern) => {
      html = html.replace(pattern, "$1javascript&#58;");
    });
    return html;
  }
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }
  const isArray = Array.isArray;
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isBoolean = (val) => typeof val === "boolean";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const isPlainObject = (val) => toTypeString(val) === "[object Object]";
  const toDisplayString = (val) => {
    return val == null ? "" : isArray(val) || isPlainObject(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
  };
  function join(items, separator = "") {
    return items.reduce((str, item, index) => index === 0 ? str + item : str + separator + item, "");
  }
  const isNotObjectOrIsArray = (val) => !isObject(val) || isArray(val);
  function deepCopy(src, des) {
    if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
      throw new Error("Invalid value");
    }
    const stack = [{ src, des }];
    while (stack.length) {
      const { src: src2, des: des2 } = stack.pop();
      Object.keys(src2).forEach((key) => {
        if (key === "__proto__") {
          return;
        }
        if (isObject(src2[key]) && !isObject(des2[key])) {
          des2[key] = Array.isArray(src2[key]) ? [] : create();
        }
        if (isNotObjectOrIsArray(des2[key]) || isNotObjectOrIsArray(src2[key])) {
          des2[key] = src2[key];
        } else {
          stack.push({ src: src2[key], des: des2[key] });
        }
      });
    }
  }
  function createPosition(line, column, offset) {
    return { line, column, offset };
  }
  function createLocation(start, end, source) {
    const loc = { start, end };
    return loc;
  }
  const CompileErrorCodes = {
EXPECTED_TOKEN: 1,
    INVALID_TOKEN_IN_PLACEHOLDER: 2,
    UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
    UNKNOWN_ESCAPE_SEQUENCE: 4,
    INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
    UNBALANCED_CLOSING_BRACE: 6,
    UNTERMINATED_CLOSING_BRACE: 7,
    EMPTY_PLACEHOLDER: 8,
    NOT_ALLOW_NEST_PLACEHOLDER: 9,
    INVALID_LINKED_FORMAT: 10,
MUST_HAVE_MESSAGES_IN_PLURAL: 11,
    UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
    UNEXPECTED_EMPTY_LINKED_KEY: 13,
    UNEXPECTED_LEXICAL_ANALYSIS: 14
  };
  const COMPILE_ERROR_CODES_EXTEND_POINT = 17;
  function createCompileError(code, loc, options = {}) {
    const { domain: domain2, messages, args } = options;
    const msg = code;
    const error = new SyntaxError(String(msg));
    error.code = code;
    if (loc) {
      error.location = loc;
    }
    error.domain = domain2;
    return error;
  }
  function defaultOnError(error) {
    throw error;
  }
  const CHAR_SP = " ";
  const CHAR_CR = "\r";
  const CHAR_LF = "\n";
  const CHAR_LS = String.fromCharCode(8232);
  const CHAR_PS = String.fromCharCode(8233);
  function createScanner(str) {
    const _buf = str;
    let _index = 0;
    let _line = 1;
    let _column = 1;
    let _peekOffset = 0;
    const isCRLF = (index2) => _buf[index2] === CHAR_CR && _buf[index2 + 1] === CHAR_LF;
    const isLF = (index2) => _buf[index2] === CHAR_LF;
    const isPS = (index2) => _buf[index2] === CHAR_PS;
    const isLS = (index2) => _buf[index2] === CHAR_LS;
    const isLineEnd = (index2) => isCRLF(index2) || isLF(index2) || isPS(index2) || isLS(index2);
    const index = () => _index;
    const line = () => _line;
    const column = () => _column;
    const peekOffset = () => _peekOffset;
    const charAt = (offset) => isCRLF(offset) || isPS(offset) || isLS(offset) ? CHAR_LF : _buf[offset];
    const currentChar = () => charAt(_index);
    const currentPeek = () => charAt(_index + _peekOffset);
    function next() {
      _peekOffset = 0;
      if (isLineEnd(_index)) {
        _line++;
        _column = 0;
      }
      if (isCRLF(_index)) {
        _index++;
      }
      _index++;
      _column++;
      return _buf[_index];
    }
    function peek() {
      if (isCRLF(_index + _peekOffset)) {
        _peekOffset++;
      }
      _peekOffset++;
      return _buf[_index + _peekOffset];
    }
    function reset() {
      _index = 0;
      _line = 1;
      _column = 1;
      _peekOffset = 0;
    }
    function resetPeek(offset = 0) {
      _peekOffset = offset;
    }
    function skipToPeek() {
      const target = _index + _peekOffset;
      while (target !== _index) {
        next();
      }
      _peekOffset = 0;
    }
    return {
      index,
      line,
      column,
      peekOffset,
      charAt,
      currentChar,
      currentPeek,
      next,
      peek,
      reset,
      resetPeek,
      skipToPeek
    };
  }
  const EOF = void 0;
  const DOT = ".";
  const LITERAL_DELIMITER = "'";
  const ERROR_DOMAIN$3 = "tokenizer";
  function createTokenizer(source, options = {}) {
    const location2 = options.location !== false;
    const _scnr = createScanner(source);
    const currentOffset = () => _scnr.index();
    const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
    const _initLoc = currentPosition();
    const _initOffset = currentOffset();
    const _context = {
      currentType: 13,
      offset: _initOffset,
      startLoc: _initLoc,
      endLoc: _initLoc,
      lastType: 13,
      lastOffset: _initOffset,
      lastStartLoc: _initLoc,
      lastEndLoc: _initLoc,
      braceNest: 0,
      inLinked: false,
      text: ""
    };
    const context = () => _context;
    const { onError } = options;
    function emitError(code, pos, offset, ...args) {
      const ctx = context();
      pos.column += offset;
      pos.offset += offset;
      if (onError) {
        const loc = location2 ? createLocation(ctx.startLoc, pos) : null;
        const err = createCompileError(code, loc, {
          domain: ERROR_DOMAIN$3,
          args
        });
        onError(err);
      }
    }
    function getToken(context2, type, value) {
      context2.endLoc = currentPosition();
      context2.currentType = type;
      const token = { type };
      if (location2) {
        token.loc = createLocation(context2.startLoc, context2.endLoc);
      }
      if (value != null) {
        token.value = value;
      }
      return token;
    }
    const getEndToken = (context2) => getToken(
      context2,
      13
);
    function eat(scnr, ch) {
      if (scnr.currentChar() === ch) {
        scnr.next();
        return ch;
      } else {
        emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
        return "";
      }
    }
    function peekSpaces(scnr) {
      let buf = "";
      while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
        buf += scnr.currentPeek();
        scnr.peek();
      }
      return buf;
    }
    function skipSpaces(scnr) {
      const buf = peekSpaces(scnr);
      scnr.skipToPeek();
      return buf;
    }
    function isIdentifierStart(ch) {
      if (ch === EOF) {
        return false;
      }
      const cc = ch.charCodeAt(0);
      return cc >= 97 && cc <= 122 ||
cc >= 65 && cc <= 90 ||
cc === 95;
    }
    function isNumberStart(ch) {
      if (ch === EOF) {
        return false;
      }
      const cc = ch.charCodeAt(0);
      return cc >= 48 && cc <= 57;
    }
    function isNamedIdentifierStart(scnr, context2) {
      const { currentType } = context2;
      if (currentType !== 2) {
        return false;
      }
      peekSpaces(scnr);
      const ret = isIdentifierStart(scnr.currentPeek());
      scnr.resetPeek();
      return ret;
    }
    function isListIdentifierStart(scnr, context2) {
      const { currentType } = context2;
      if (currentType !== 2) {
        return false;
      }
      peekSpaces(scnr);
      const ch = scnr.currentPeek() === "-" ? scnr.peek() : scnr.currentPeek();
      const ret = isNumberStart(ch);
      scnr.resetPeek();
      return ret;
    }
    function isLiteralStart(scnr, context2) {
      const { currentType } = context2;
      if (currentType !== 2) {
        return false;
      }
      peekSpaces(scnr);
      const ret = scnr.currentPeek() === LITERAL_DELIMITER;
      scnr.resetPeek();
      return ret;
    }
    function isLinkedDotStart(scnr, context2) {
      const { currentType } = context2;
      if (currentType !== 7) {
        return false;
      }
      peekSpaces(scnr);
      const ret = scnr.currentPeek() === ".";
      scnr.resetPeek();
      return ret;
    }
    function isLinkedModifierStart(scnr, context2) {
      const { currentType } = context2;
      if (currentType !== 8) {
        return false;
      }
      peekSpaces(scnr);
      const ret = isIdentifierStart(scnr.currentPeek());
      scnr.resetPeek();
      return ret;
    }
    function isLinkedDelimiterStart(scnr, context2) {
      const { currentType } = context2;
      if (!(currentType === 7 || currentType === 11)) {
        return false;
      }
      peekSpaces(scnr);
      const ret = scnr.currentPeek() === ":";
      scnr.resetPeek();
      return ret;
    }
    function isLinkedReferStart(scnr, context2) {
      const { currentType } = context2;
      if (currentType !== 9) {
        return false;
      }
      const fn = () => {
        const ch = scnr.currentPeek();
        if (ch === "{") {
          return isIdentifierStart(scnr.peek());
        } else if (ch === "@" || ch === "|" || ch === ":" || ch === "." || ch === CHAR_SP || !ch) {
          return false;
        } else if (ch === CHAR_LF) {
          scnr.peek();
          return fn();
        } else {
          return isTextStart(scnr, false);
        }
      };
      const ret = fn();
      scnr.resetPeek();
      return ret;
    }
    function isPluralStart(scnr) {
      peekSpaces(scnr);
      const ret = scnr.currentPeek() === "|";
      scnr.resetPeek();
      return ret;
    }
    function isTextStart(scnr, reset = true) {
      const fn = (hasSpace = false, prev = "") => {
        const ch = scnr.currentPeek();
        if (ch === "{") {
          return hasSpace;
        } else if (ch === "@" || !ch) {
          return hasSpace;
        } else if (ch === "|") {
          return !(prev === CHAR_SP || prev === CHAR_LF);
        } else if (ch === CHAR_SP) {
          scnr.peek();
          return fn(true, CHAR_SP);
        } else if (ch === CHAR_LF) {
          scnr.peek();
          return fn(true, CHAR_LF);
        } else {
          return true;
        }
      };
      const ret = fn();
      reset && scnr.resetPeek();
      return ret;
    }
    function takeChar(scnr, fn) {
      const ch = scnr.currentChar();
      if (ch === EOF) {
        return EOF;
      }
      if (fn(ch)) {
        scnr.next();
        return ch;
      }
      return null;
    }
    function isIdentifier(ch) {
      const cc = ch.charCodeAt(0);
      return cc >= 97 && cc <= 122 ||
cc >= 65 && cc <= 90 ||
cc >= 48 && cc <= 57 ||
cc === 95 ||
cc === 36;
    }
    function takeIdentifierChar(scnr) {
      return takeChar(scnr, isIdentifier);
    }
    function isNamedIdentifier(ch) {
      const cc = ch.charCodeAt(0);
      return cc >= 97 && cc <= 122 ||
cc >= 65 && cc <= 90 ||
cc >= 48 && cc <= 57 ||
cc === 95 ||
cc === 36 ||
cc === 45;
    }
    function takeNamedIdentifierChar(scnr) {
      return takeChar(scnr, isNamedIdentifier);
    }
    function isDigit(ch) {
      const cc = ch.charCodeAt(0);
      return cc >= 48 && cc <= 57;
    }
    function takeDigit(scnr) {
      return takeChar(scnr, isDigit);
    }
    function isHexDigit(ch) {
      const cc = ch.charCodeAt(0);
      return cc >= 48 && cc <= 57 ||
cc >= 65 && cc <= 70 ||
cc >= 97 && cc <= 102;
    }
    function takeHexDigit(scnr) {
      return takeChar(scnr, isHexDigit);
    }
    function getDigits(scnr) {
      let ch = "";
      let num = "";
      while (ch = takeDigit(scnr)) {
        num += ch;
      }
      return num;
    }
    function readText(scnr) {
      let buf = "";
      while (true) {
        const ch = scnr.currentChar();
        if (ch === "{" || ch === "}" || ch === "@" || ch === "|" || !ch) {
          break;
        } else if (ch === CHAR_SP || ch === CHAR_LF) {
          if (isTextStart(scnr)) {
            buf += ch;
            scnr.next();
          } else if (isPluralStart(scnr)) {
            break;
          } else {
            buf += ch;
            scnr.next();
          }
        } else {
          buf += ch;
          scnr.next();
        }
      }
      return buf;
    }
    function readNamedIdentifier(scnr) {
      skipSpaces(scnr);
      let ch = "";
      let name = "";
      while (ch = takeNamedIdentifierChar(scnr)) {
        name += ch;
      }
      const currentChar = scnr.currentChar();
      if (currentChar && currentChar !== "}" && currentChar !== EOF && currentChar !== CHAR_SP && currentChar !== CHAR_LF && currentChar !== "　") {
        const invalidPart = readInvalidIdentifier(scnr);
        emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, name + invalidPart);
        return name + invalidPart;
      }
      if (scnr.currentChar() === EOF) {
        emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
      }
      return name;
    }
    function readListIdentifier(scnr) {
      skipSpaces(scnr);
      let value = "";
      if (scnr.currentChar() === "-") {
        scnr.next();
        value += `-${getDigits(scnr)}`;
      } else {
        value += getDigits(scnr);
      }
      if (scnr.currentChar() === EOF) {
        emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
      }
      return value;
    }
    function isLiteral2(ch) {
      return ch !== LITERAL_DELIMITER && ch !== CHAR_LF;
    }
    function readLiteral(scnr) {
      skipSpaces(scnr);
      eat(scnr, `'`);
      let ch = "";
      let literal = "";
      while (ch = takeChar(scnr, isLiteral2)) {
        if (ch === "\\") {
          literal += readEscapeSequence(scnr);
        } else {
          literal += ch;
        }
      }
      const current = scnr.currentChar();
      if (current === CHAR_LF || current === EOF) {
        emitError(CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, currentPosition(), 0);
        if (current === CHAR_LF) {
          scnr.next();
          eat(scnr, `'`);
        }
        return literal;
      }
      eat(scnr, `'`);
      return literal;
    }
    function readEscapeSequence(scnr) {
      const ch = scnr.currentChar();
      switch (ch) {
        case "\\":
        case `'`:
          scnr.next();
          return `\\${ch}`;
        case "u":
          return readUnicodeEscapeSequence(scnr, ch, 4);
        case "U":
          return readUnicodeEscapeSequence(scnr, ch, 6);
        default:
          emitError(CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE, currentPosition(), 0, ch);
          return "";
      }
    }
    function readUnicodeEscapeSequence(scnr, unicode, digits) {
      eat(scnr, unicode);
      let sequence = "";
      for (let i = 0; i < digits; i++) {
        const ch = takeHexDigit(scnr);
        if (!ch) {
          emitError(CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
          break;
        }
        sequence += ch;
      }
      return `\\${unicode}${sequence}`;
    }
    function isInvalidIdentifier(ch) {
      return ch !== "{" && ch !== "}" && ch !== CHAR_SP && ch !== CHAR_LF;
    }
    function readInvalidIdentifier(scnr) {
      skipSpaces(scnr);
      let ch = "";
      let identifiers = "";
      while (ch = takeChar(scnr, isInvalidIdentifier)) {
        identifiers += ch;
      }
      return identifiers;
    }
    function readLinkedModifier(scnr) {
      let ch = "";
      let name = "";
      while (ch = takeIdentifierChar(scnr)) {
        name += ch;
      }
      return name;
    }
    function readLinkedRefer(scnr) {
      const fn = (buf) => {
        const ch = scnr.currentChar();
        if (ch === "{" || ch === "@" || ch === "|" || ch === "(" || ch === ")" || !ch) {
          return buf;
        } else if (ch === CHAR_SP) {
          return buf;
        } else if (ch === CHAR_LF || ch === DOT) {
          buf += ch;
          scnr.next();
          return fn(buf);
        } else {
          buf += ch;
          scnr.next();
          return fn(buf);
        }
      };
      return fn("");
    }
    function readPlural(scnr) {
      skipSpaces(scnr);
      const plural = eat(
        scnr,
        "|"
);
      skipSpaces(scnr);
      return plural;
    }
    function readTokenInPlaceholder(scnr, context2) {
      let token = null;
      const ch = scnr.currentChar();
      switch (ch) {
        case "{":
          if (context2.braceNest >= 1) {
            emitError(CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER, currentPosition(), 0);
          }
          scnr.next();
          token = getToken(
            context2,
            2,
            "{"
);
          skipSpaces(scnr);
          context2.braceNest++;
          return token;
        case "}":
          if (context2.braceNest > 0 && context2.currentType === 2) {
            emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0);
          }
          scnr.next();
          token = getToken(
            context2,
            3,
            "}"
);
          context2.braceNest--;
          context2.braceNest > 0 && skipSpaces(scnr);
          if (context2.inLinked && context2.braceNest === 0) {
            context2.inLinked = false;
          }
          return token;
        case "@":
          if (context2.braceNest > 0) {
            emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          }
          token = readTokenInLinked(scnr, context2) || getEndToken(context2);
          context2.braceNest = 0;
          return token;
        default: {
          let validNamedIdentifier = true;
          let validListIdentifier = true;
          let validLiteral = true;
          if (isPluralStart(scnr)) {
            if (context2.braceNest > 0) {
              emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
            }
            token = getToken(context2, 1, readPlural(scnr));
            context2.braceNest = 0;
            context2.inLinked = false;
            return token;
          }
          if (context2.braceNest > 0 && (context2.currentType === 4 || context2.currentType === 5 || context2.currentType === 6)) {
            emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
            context2.braceNest = 0;
            return readToken(scnr, context2);
          }
          if (validNamedIdentifier = isNamedIdentifierStart(scnr, context2)) {
            token = getToken(context2, 4, readNamedIdentifier(scnr));
            skipSpaces(scnr);
            return token;
          }
          if (validListIdentifier = isListIdentifierStart(scnr, context2)) {
            token = getToken(context2, 5, readListIdentifier(scnr));
            skipSpaces(scnr);
            return token;
          }
          if (validLiteral = isLiteralStart(scnr, context2)) {
            token = getToken(context2, 6, readLiteral(scnr));
            skipSpaces(scnr);
            return token;
          }
          if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
            token = getToken(context2, 12, readInvalidIdentifier(scnr));
            emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, token.value);
            skipSpaces(scnr);
            return token;
          }
          break;
        }
      }
      return token;
    }
    function readTokenInLinked(scnr, context2) {
      const { currentType } = context2;
      let token = null;
      const ch = scnr.currentChar();
      if ((currentType === 7 || currentType === 8 || currentType === 11 || currentType === 9) && (ch === CHAR_LF || ch === CHAR_SP)) {
        emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
      }
      switch (ch) {
        case "@":
          scnr.next();
          token = getToken(
            context2,
            7,
            "@"
);
          context2.inLinked = true;
          return token;
        case ".":
          skipSpaces(scnr);
          scnr.next();
          return getToken(
            context2,
            8,
            "."
);
        case ":":
          skipSpaces(scnr);
          scnr.next();
          return getToken(
            context2,
            9,
            ":"
);
        default:
          if (isPluralStart(scnr)) {
            token = getToken(context2, 1, readPlural(scnr));
            context2.braceNest = 0;
            context2.inLinked = false;
            return token;
          }
          if (isLinkedDotStart(scnr, context2) || isLinkedDelimiterStart(scnr, context2)) {
            skipSpaces(scnr);
            return readTokenInLinked(scnr, context2);
          }
          if (isLinkedModifierStart(scnr, context2)) {
            skipSpaces(scnr);
            return getToken(context2, 11, readLinkedModifier(scnr));
          }
          if (isLinkedReferStart(scnr, context2)) {
            skipSpaces(scnr);
            if (ch === "{") {
              return readTokenInPlaceholder(scnr, context2) || token;
            } else {
              return getToken(context2, 10, readLinkedRefer(scnr));
            }
          }
          if (currentType === 7) {
            emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
          }
          context2.braceNest = 0;
          context2.inLinked = false;
          return readToken(scnr, context2);
      }
    }
    function readToken(scnr, context2) {
      let token = {
        type: 13
};
      if (context2.braceNest > 0) {
        return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
      }
      if (context2.inLinked) {
        return readTokenInLinked(scnr, context2) || getEndToken(context2);
      }
      const ch = scnr.currentChar();
      switch (ch) {
        case "{":
          return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
        case "}":
          emitError(CompileErrorCodes.UNBALANCED_CLOSING_BRACE, currentPosition(), 0);
          scnr.next();
          return getToken(
            context2,
            3,
            "}"
);
        case "@":
          return readTokenInLinked(scnr, context2) || getEndToken(context2);
        default: {
          if (isPluralStart(scnr)) {
            token = getToken(context2, 1, readPlural(scnr));
            context2.braceNest = 0;
            context2.inLinked = false;
            return token;
          }
          if (isTextStart(scnr)) {
            return getToken(context2, 0, readText(scnr));
          }
          break;
        }
      }
      return token;
    }
    function nextToken() {
      const { currentType, offset, startLoc, endLoc } = _context;
      _context.lastType = currentType;
      _context.lastOffset = offset;
      _context.lastStartLoc = startLoc;
      _context.lastEndLoc = endLoc;
      _context.offset = currentOffset();
      _context.startLoc = currentPosition();
      if (_scnr.currentChar() === EOF) {
        return getToken(
          _context,
          13
);
      }
      return readToken(_scnr, _context);
    }
    return {
      nextToken,
      currentOffset,
      currentPosition,
      context
    };
  }
  const ERROR_DOMAIN$2 = "parser";
  const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
  function fromEscapeSequence(match, codePoint4, codePoint6) {
    switch (match) {
      case `\\\\`:
        return `\\`;
case `\\'`:
        return `'`;
      default: {
        const codePoint = parseInt(codePoint4 || codePoint6, 16);
        if (codePoint <= 55295 || codePoint >= 57344) {
          return String.fromCodePoint(codePoint);
        }
        return "�";
      }
    }
  }
  function createParser(options = {}) {
    const location2 = options.location !== false;
    const { onError } = options;
    function emitError(tokenzer, code, start, offset, ...args) {
      const end = tokenzer.currentPosition();
      end.offset += offset;
      end.column += offset;
      if (onError) {
        const loc = location2 ? createLocation(start, end) : null;
        const err = createCompileError(code, loc, {
          domain: ERROR_DOMAIN$2,
          args
        });
        onError(err);
      }
    }
    function startNode(type, offset, loc) {
      const node = { type };
      if (location2) {
        node.start = offset;
        node.end = offset;
        node.loc = { start: loc, end: loc };
      }
      return node;
    }
    function endNode(node, offset, pos, type) {
      if (location2) {
        node.end = offset;
        if (node.loc) {
          node.loc.end = pos;
        }
      }
    }
    function parseText(tokenizer, value) {
      const context = tokenizer.context();
      const node = startNode(3, context.offset, context.startLoc);
      node.value = value;
      endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
      return node;
    }
    function parseList(tokenizer, index) {
      const context = tokenizer.context();
      const { lastOffset: offset, lastStartLoc: loc } = context;
      const node = startNode(5, offset, loc);
      node.index = parseInt(index, 10);
      tokenizer.nextToken();
      endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
      return node;
    }
    function parseNamed(tokenizer, key) {
      const context = tokenizer.context();
      const { lastOffset: offset, lastStartLoc: loc } = context;
      const node = startNode(4, offset, loc);
      node.key = key;
      tokenizer.nextToken();
      endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
      return node;
    }
    function parseLiteral(tokenizer, value) {
      const context = tokenizer.context();
      const { lastOffset: offset, lastStartLoc: loc } = context;
      const node = startNode(9, offset, loc);
      node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
      tokenizer.nextToken();
      endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
      return node;
    }
    function parseLinkedModifier(tokenizer) {
      const token = tokenizer.nextToken();
      const context = tokenizer.context();
      const { lastOffset: offset, lastStartLoc: loc } = context;
      const node = startNode(8, offset, loc);
      if (token.type !== 11) {
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER, context.lastStartLoc, 0);
        node.value = "";
        endNode(node, offset, loc);
        return {
          nextConsumeToken: token,
          node
        };
      }
      if (token.value == null) {
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
      }
      node.value = token.value || "";
      endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
      return {
        node
      };
    }
    function parseLinkedKey(tokenizer, value) {
      const context = tokenizer.context();
      const node = startNode(7, context.offset, context.startLoc);
      node.value = value;
      endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
      return node;
    }
    function parseLinked(tokenizer) {
      const context = tokenizer.context();
      const linkedNode = startNode(6, context.offset, context.startLoc);
      let token = tokenizer.nextToken();
      if (token.type === 8) {
        const parsed = parseLinkedModifier(tokenizer);
        linkedNode.modifier = parsed.node;
        token = parsed.nextConsumeToken || tokenizer.nextToken();
      }
      if (token.type !== 9) {
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
      }
      token = tokenizer.nextToken();
      if (token.type === 2) {
        token = tokenizer.nextToken();
      }
      switch (token.type) {
        case 10:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          linkedNode.key = parseLinkedKey(tokenizer, token.value || "");
          break;
        case 4:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          linkedNode.key = parseNamed(tokenizer, token.value || "");
          break;
        case 5:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          linkedNode.key = parseList(tokenizer, token.value || "");
          break;
        case 6:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          linkedNode.key = parseLiteral(tokenizer, token.value || "");
          break;
        default: {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY, context.lastStartLoc, 0);
          const nextContext = tokenizer.context();
          const emptyLinkedKeyNode = startNode(7, nextContext.offset, nextContext.startLoc);
          emptyLinkedKeyNode.value = "";
          endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
          linkedNode.key = emptyLinkedKeyNode;
          endNode(linkedNode, nextContext.offset, nextContext.startLoc);
          return {
            nextConsumeToken: token,
            node: linkedNode
          };
        }
      }
      endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
      return {
        node: linkedNode
      };
    }
    function parseMessage(tokenizer) {
      const context = tokenizer.context();
      const startOffset = context.currentType === 1 ? tokenizer.currentOffset() : context.offset;
      const startLoc = context.currentType === 1 ? context.endLoc : context.startLoc;
      const node = startNode(2, startOffset, startLoc);
      node.items = [];
      let nextToken = null;
      do {
        const token = nextToken || tokenizer.nextToken();
        nextToken = null;
        switch (token.type) {
          case 0:
            if (token.value == null) {
              emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
            }
            node.items.push(parseText(tokenizer, token.value || ""));
            break;
          case 5:
            if (token.value == null) {
              emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
            }
            node.items.push(parseList(tokenizer, token.value || ""));
            break;
          case 4:
            if (token.value == null) {
              emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
            }
            node.items.push(parseNamed(tokenizer, token.value || ""));
            break;
          case 6:
            if (token.value == null) {
              emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
            }
            node.items.push(parseLiteral(tokenizer, token.value || ""));
            break;
          case 7: {
            const parsed = parseLinked(tokenizer);
            node.items.push(parsed.node);
            nextToken = parsed.nextConsumeToken || null;
            break;
          }
        }
      } while (context.currentType !== 13 && context.currentType !== 1);
      const endOffset = context.currentType === 1 ? context.lastOffset : tokenizer.currentOffset();
      const endLoc = context.currentType === 1 ? context.lastEndLoc : tokenizer.currentPosition();
      endNode(node, endOffset, endLoc);
      return node;
    }
    function parsePlural(tokenizer, offset, loc, msgNode) {
      const context = tokenizer.context();
      let hasEmptyMessage = msgNode.items.length === 0;
      const node = startNode(1, offset, loc);
      node.cases = [];
      node.cases.push(msgNode);
      do {
        const msg = parseMessage(tokenizer);
        if (!hasEmptyMessage) {
          hasEmptyMessage = msg.items.length === 0;
        }
        node.cases.push(msg);
      } while (context.currentType !== 13);
      if (hasEmptyMessage) {
        emitError(tokenizer, CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL, loc, 0);
      }
      endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
      return node;
    }
    function parseResource(tokenizer) {
      const context = tokenizer.context();
      const { offset, startLoc } = context;
      const msgNode = parseMessage(tokenizer);
      if (context.currentType === 13) {
        return msgNode;
      } else {
        return parsePlural(tokenizer, offset, startLoc, msgNode);
      }
    }
    function parse2(source) {
      const tokenizer = createTokenizer(source, assign({}, options));
      const context = tokenizer.context();
      const node = startNode(0, context.offset, context.startLoc);
      if (location2 && node.loc) {
        node.loc.source = source;
      }
      node.body = parseResource(tokenizer);
      if (options.onCacheKey) {
        node.cacheKey = options.onCacheKey(source);
      }
      if (context.currentType !== 13) {
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, source[context.offset] || "");
      }
      endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
      return node;
    }
    return { parse: parse2 };
  }
  function getTokenCaption(token) {
    if (token.type === 13) {
      return "EOF";
    }
    const name = (token.value || "").replace(/\r?\n/gu, "\\n");
    return name.length > 10 ? name.slice(0, 9) + "…" : name;
  }
  function createTransformer(ast, options = {}) {
    const _context = {
      ast,
      helpers: new Set()
    };
    const context = () => _context;
    const helper = (name) => {
      _context.helpers.add(name);
      return name;
    };
    return { context, helper };
  }
  function traverseNodes(nodes, transformer) {
    for (let i = 0; i < nodes.length; i++) {
      traverseNode(nodes[i], transformer);
    }
  }
  function traverseNode(node, transformer) {
    switch (node.type) {
      case 1:
        traverseNodes(node.cases, transformer);
        transformer.helper(
          "plural"
);
        break;
      case 2:
        traverseNodes(node.items, transformer);
        break;
      case 6: {
        const linked = node;
        traverseNode(linked.key, transformer);
        transformer.helper(
          "linked"
);
        transformer.helper(
          "type"
);
        break;
      }
      case 5:
        transformer.helper(
          "interpolate"
);
        transformer.helper(
          "list"
);
        break;
      case 4:
        transformer.helper(
          "interpolate"
);
        transformer.helper(
          "named"
);
        break;
    }
  }
  function transform(ast, options = {}) {
    const transformer = createTransformer(ast);
    transformer.helper(
      "normalize"
);
    ast.body && traverseNode(ast.body, transformer);
    const context = transformer.context();
    ast.helpers = Array.from(context.helpers);
  }
  function optimize(ast) {
    const body2 = ast.body;
    if (body2.type === 2) {
      optimizeMessageNode(body2);
    } else {
      body2.cases.forEach((c) => optimizeMessageNode(c));
    }
    return ast;
  }
  function optimizeMessageNode(message) {
    if (message.items.length === 1) {
      const item = message.items[0];
      if (item.type === 3 || item.type === 9) {
        message.static = item.value;
        delete item.value;
      }
    } else {
      const values = [];
      for (let i = 0; i < message.items.length; i++) {
        const item = message.items[i];
        if (!(item.type === 3 || item.type === 9)) {
          break;
        }
        if (item.value == null) {
          break;
        }
        values.push(item.value);
      }
      if (values.length === message.items.length) {
        message.static = join(values);
        for (let i = 0; i < message.items.length; i++) {
          const item = message.items[i];
          if (item.type === 3 || item.type === 9) {
            delete item.value;
          }
        }
      }
    }
  }
  function minify(node) {
    node.t = node.type;
    switch (node.type) {
      case 0: {
        const resource = node;
        minify(resource.body);
        resource.b = resource.body;
        delete resource.body;
        break;
      }
      case 1: {
        const plural = node;
        const cases = plural.cases;
        for (let i = 0; i < cases.length; i++) {
          minify(cases[i]);
        }
        plural.c = cases;
        delete plural.cases;
        break;
      }
      case 2: {
        const message = node;
        const items = message.items;
        for (let i = 0; i < items.length; i++) {
          minify(items[i]);
        }
        message.i = items;
        delete message.items;
        if (message.static) {
          message.s = message.static;
          delete message.static;
        }
        break;
      }
      case 3:
      case 9:
      case 8:
      case 7: {
        const valueNode = node;
        if (valueNode.value) {
          valueNode.v = valueNode.value;
          delete valueNode.value;
        }
        break;
      }
      case 6: {
        const linked = node;
        minify(linked.key);
        linked.k = linked.key;
        delete linked.key;
        if (linked.modifier) {
          minify(linked.modifier);
          linked.m = linked.modifier;
          delete linked.modifier;
        }
        break;
      }
      case 5: {
        const list = node;
        list.i = list.index;
        delete list.index;
        break;
      }
      case 4: {
        const named = node;
        named.k = named.key;
        delete named.key;
        break;
      }
    }
    delete node.type;
  }
  function createCodeGenerator(ast, options) {
    const { filename, breakLineCode, needIndent: _needIndent } = options;
    const location2 = options.location !== false;
    const _context = {
      filename,
      code: "",
      column: 1,
      line: 1,
      offset: 0,
      map: void 0,
      breakLineCode,
      needIndent: _needIndent,
      indentLevel: 0
    };
    if (location2 && ast.loc) {
      _context.source = ast.loc.source;
    }
    const context = () => _context;
    function push(code, node) {
      _context.code += code;
    }
    function _newline(n, withBreakLine = true) {
      const _breakLineCode = withBreakLine ? breakLineCode : "";
      push(_needIndent ? _breakLineCode + `  `.repeat(n) : _breakLineCode);
    }
    function indent(withNewLine = true) {
      const level = ++_context.indentLevel;
      withNewLine && _newline(level);
    }
    function deindent(withNewLine = true) {
      const level = --_context.indentLevel;
      withNewLine && _newline(level);
    }
    function newline() {
      _newline(_context.indentLevel);
    }
    const helper = (key) => `_${key}`;
    const needIndent = () => _context.needIndent;
    return {
      context,
      push,
      indent,
      deindent,
      newline,
      helper,
      needIndent
    };
  }
  function generateLinkedNode(generator, node) {
    const { helper } = generator;
    generator.push(`${helper(
    "linked"
)}(`);
    generateNode(generator, node.key);
    if (node.modifier) {
      generator.push(`, `);
      generateNode(generator, node.modifier);
      generator.push(`, _type`);
    } else {
      generator.push(`, undefined, _type`);
    }
    generator.push(`)`);
  }
  function generateMessageNode(generator, node) {
    const { helper, needIndent } = generator;
    generator.push(`${helper(
    "normalize"
)}([`);
    generator.indent(needIndent());
    const length = node.items.length;
    for (let i = 0; i < length; i++) {
      generateNode(generator, node.items[i]);
      if (i === length - 1) {
        break;
      }
      generator.push(", ");
    }
    generator.deindent(needIndent());
    generator.push("])");
  }
  function generatePluralNode(generator, node) {
    const { helper, needIndent } = generator;
    if (node.cases.length > 1) {
      generator.push(`${helper(
      "plural"
)}([`);
      generator.indent(needIndent());
      const length = node.cases.length;
      for (let i = 0; i < length; i++) {
        generateNode(generator, node.cases[i]);
        if (i === length - 1) {
          break;
        }
        generator.push(", ");
      }
      generator.deindent(needIndent());
      generator.push(`])`);
    }
  }
  function generateResource(generator, node) {
    if (node.body) {
      generateNode(generator, node.body);
    } else {
      generator.push("null");
    }
  }
  function generateNode(generator, node) {
    const { helper } = generator;
    switch (node.type) {
      case 0:
        generateResource(generator, node);
        break;
      case 1:
        generatePluralNode(generator, node);
        break;
      case 2:
        generateMessageNode(generator, node);
        break;
      case 6:
        generateLinkedNode(generator, node);
        break;
      case 8:
        generator.push(JSON.stringify(node.value), node);
        break;
      case 7:
        generator.push(JSON.stringify(node.value), node);
        break;
      case 5:
        generator.push(`${helper(
        "interpolate"
)}(${helper(
        "list"
)}(${node.index}))`, node);
        break;
      case 4:
        generator.push(`${helper(
        "interpolate"
)}(${helper(
        "named"
)}(${JSON.stringify(node.key)}))`, node);
        break;
      case 9:
        generator.push(JSON.stringify(node.value), node);
        break;
      case 3:
        generator.push(JSON.stringify(node.value), node);
        break;
    }
  }
  const generate = (ast, options = {}) => {
    const mode = isString(options.mode) ? options.mode : "normal";
    const filename = isString(options.filename) ? options.filename : "message.intl";
    !!options.sourceMap;
    const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === "arrow" ? ";" : "\n";
    const needIndent = options.needIndent ? options.needIndent : mode !== "arrow";
    const helpers = ast.helpers || [];
    const generator = createCodeGenerator(ast, {
      filename,
      breakLineCode,
      needIndent
    });
    generator.push(mode === "normal" ? `function __msg__ (ctx) {` : `(ctx) => {`);
    generator.indent(needIndent);
    if (helpers.length > 0) {
      generator.push(`const { ${join(helpers.map((s) => `${s}: _${s}`), ", ")} } = ctx`);
      generator.newline();
    }
    generator.push(`return `);
    generateNode(generator, ast);
    generator.deindent(needIndent);
    generator.push(`}`);
    delete ast.helpers;
    const { code, map } = generator.context();
    return {
      ast,
      code,
      map: map ? map.toJSON() : void 0
};
  };
  function baseCompile$1(source, options = {}) {
    const assignedOptions = assign({}, options);
    const jit = !!assignedOptions.jit;
    const enalbeMinify = !!assignedOptions.minify;
    const enambeOptimize = assignedOptions.optimize == null ? true : assignedOptions.optimize;
    const parser = createParser(assignedOptions);
    const ast = parser.parse(source);
    if (!jit) {
      transform(ast, assignedOptions);
      return generate(ast, assignedOptions);
    } else {
      enambeOptimize && optimize(ast);
      enalbeMinify && minify(ast);
      return { ast, code: "" };
    }
  }
  function initFeatureFlags$1() {
    if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
      getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
    }
    if (typeof __INTLIFY_DROP_MESSAGE_COMPILER__ !== "boolean") {
      getGlobalThis().__INTLIFY_DROP_MESSAGE_COMPILER__ = false;
    }
  }
  function isMessageAST(val) {
    return isObject(val) && resolveType(val) === 0 && (hasOwn(val, "b") || hasOwn(val, "body"));
  }
  const PROPS_BODY = ["b", "body"];
  function resolveBody(node) {
    return resolveProps(node, PROPS_BODY);
  }
  const PROPS_CASES = ["c", "cases"];
  function resolveCases(node) {
    return resolveProps(node, PROPS_CASES, []);
  }
  const PROPS_STATIC = ["s", "static"];
  function resolveStatic(node) {
    return resolveProps(node, PROPS_STATIC);
  }
  const PROPS_ITEMS = ["i", "items"];
  function resolveItems(node) {
    return resolveProps(node, PROPS_ITEMS, []);
  }
  const PROPS_TYPE = ["t", "type"];
  function resolveType(node) {
    return resolveProps(node, PROPS_TYPE);
  }
  const PROPS_VALUE = ["v", "value"];
  function resolveValue$1(node, type) {
    const resolved = resolveProps(node, PROPS_VALUE);
    if (resolved != null) {
      return resolved;
    } else {
      throw createUnhandleNodeError(type);
    }
  }
  const PROPS_MODIFIER = ["m", "modifier"];
  function resolveLinkedModifier(node) {
    return resolveProps(node, PROPS_MODIFIER);
  }
  const PROPS_KEY = ["k", "key"];
  function resolveLinkedKey(node) {
    const resolved = resolveProps(node, PROPS_KEY);
    if (resolved) {
      return resolved;
    } else {
      throw createUnhandleNodeError(
        6
);
    }
  }
  function resolveProps(node, props, defaultValue) {
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (hasOwn(node, prop) && node[prop] != null) {
        return node[prop];
      }
    }
    return defaultValue;
  }
  const AST_NODE_PROPS_KEYS = [
    ...PROPS_BODY,
    ...PROPS_CASES,
    ...PROPS_STATIC,
    ...PROPS_ITEMS,
    ...PROPS_KEY,
    ...PROPS_MODIFIER,
    ...PROPS_VALUE,
    ...PROPS_TYPE
  ];
  function createUnhandleNodeError(type) {
    return new Error(`unhandled node type: ${type}`);
  }
  function format(ast) {
    const msg = (ctx) => formatParts(ctx, ast);
    return msg;
  }
  function formatParts(ctx, ast) {
    const body2 = resolveBody(ast);
    if (body2 == null) {
      throw createUnhandleNodeError(
        0
);
    }
    const type = resolveType(body2);
    if (type === 1) {
      const plural = body2;
      const cases = resolveCases(plural);
      return ctx.plural(cases.reduce((messages, c) => [
        ...messages,
        formatMessageParts(ctx, c)
      ], []));
    } else {
      return formatMessageParts(ctx, body2);
    }
  }
  function formatMessageParts(ctx, node) {
    const static_ = resolveStatic(node);
    if (static_ != null) {
      return ctx.type === "text" ? static_ : ctx.normalize([static_]);
    } else {
      const messages = resolveItems(node).reduce((acm, c) => [...acm, formatMessagePart(ctx, c)], []);
      return ctx.normalize(messages);
    }
  }
  function formatMessagePart(ctx, node) {
    const type = resolveType(node);
    switch (type) {
      case 3: {
        return resolveValue$1(node, type);
      }
      case 9: {
        return resolveValue$1(node, type);
      }
      case 4: {
        const named = node;
        if (hasOwn(named, "k") && named.k) {
          return ctx.interpolate(ctx.named(named.k));
        }
        if (hasOwn(named, "key") && named.key) {
          return ctx.interpolate(ctx.named(named.key));
        }
        throw createUnhandleNodeError(type);
      }
      case 5: {
        const list = node;
        if (hasOwn(list, "i") && isNumber(list.i)) {
          return ctx.interpolate(ctx.list(list.i));
        }
        if (hasOwn(list, "index") && isNumber(list.index)) {
          return ctx.interpolate(ctx.list(list.index));
        }
        throw createUnhandleNodeError(type);
      }
      case 6: {
        const linked = node;
        const modifier = resolveLinkedModifier(linked);
        const key = resolveLinkedKey(linked);
        return ctx.linked(formatMessagePart(ctx, key), modifier ? formatMessagePart(ctx, modifier) : void 0, ctx.type);
      }
      case 7: {
        return resolveValue$1(node, type);
      }
      case 8: {
        return resolveValue$1(node, type);
      }
      default:
        throw new Error(`unhandled node on format message part: ${type}`);
    }
  }
  const defaultOnCacheKey = (message) => message;
  let compileCache = create();
  function baseCompile(message, options = {}) {
    let detectError = false;
    const onError = options.onError || defaultOnError;
    options.onError = (err) => {
      detectError = true;
      onError(err);
    };
    return { ...baseCompile$1(message, options), detectError };
  }
function compile(message, context) {
    if (!__INTLIFY_DROP_MESSAGE_COMPILER__ && isString(message)) {
      isBoolean(context.warnHtmlMessage) ? context.warnHtmlMessage : true;
      const onCacheKey = context.onCacheKey || defaultOnCacheKey;
      const cacheKey = onCacheKey(message);
      const cached = compileCache[cacheKey];
      if (cached) {
        return cached;
      }
      const { ast, detectError } = baseCompile(message, {
        ...context,
        location: false,
        jit: true
      });
      const msg = format(ast);
      return !detectError ? compileCache[cacheKey] = msg : msg;
    } else {
      const cacheKey = message.cacheKey;
      if (cacheKey) {
        const cached = compileCache[cacheKey];
        if (cached) {
          return cached;
        }
        return compileCache[cacheKey] = format(message);
      } else {
        return format(message);
      }
    }
  }
  let devtools = null;
  function setDevToolsHook(hook) {
    devtools = hook;
  }
  function initI18nDevTools(i18n2, version, meta) {
    devtools && devtools.emit("i18n:init", {
      timestamp: Date.now(),
      i18n: i18n2,
      version,
      meta
    });
  }
  const translateDevTools = createDevToolsHook("function:translate");
  function createDevToolsHook(hook) {
    return (payloads) => devtools && devtools.emit(hook, payloads);
  }
  const CoreErrorCodes = {
    INVALID_ARGUMENT: COMPILE_ERROR_CODES_EXTEND_POINT,
INVALID_DATE_ARGUMENT: 18,
    INVALID_ISO_DATE_ARGUMENT: 19,
    NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
    NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
    NOT_SUPPORT_LOCALE_TYPE: 23
  };
  const CORE_ERROR_CODES_EXTEND_POINT = 24;
  function createCoreError(code) {
    return createCompileError(code, null, void 0);
  }
  function getLocale(context, options) {
    return options.locale != null ? resolveLocale(options.locale) : resolveLocale(context.locale);
  }
  let _resolveLocale;
  function resolveLocale(locale) {
    if (isString(locale)) {
      return locale;
    } else {
      if (isFunction(locale)) {
        if (locale.resolvedOnce && _resolveLocale != null) {
          return _resolveLocale;
        } else if (locale.constructor.name === "Function") {
          const resolve = locale();
          if (isPromise(resolve)) {
            throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
          }
          return _resolveLocale = resolve;
        } else {
          throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
        }
      } else {
        throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_TYPE);
      }
    }
  }
  function fallbackWithSimple(ctx, fallback, start) {
    return [... new Set([
      start,
      ...isArray(fallback) ? fallback : isObject(fallback) ? Object.keys(fallback) : isString(fallback) ? [fallback] : [start]
    ])];
  }
  function fallbackWithLocaleChain(ctx, fallback, start) {
    const startLocale = isString(start) ? start : DEFAULT_LOCALE;
    const context = ctx;
    if (!context.__localeChainCache) {
      context.__localeChainCache = new Map();
    }
    let chain = context.__localeChainCache.get(startLocale);
    if (!chain) {
      chain = [];
      let block = [start];
      while (isArray(block)) {
        block = appendBlockToChain(chain, block, fallback);
      }
      const defaults = isArray(fallback) || !isPlainObject(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
      block = isString(defaults) ? [defaults] : defaults;
      if (isArray(block)) {
        appendBlockToChain(chain, block, false);
      }
      context.__localeChainCache.set(startLocale, chain);
    }
    return chain;
  }
  function appendBlockToChain(chain, block, blocks) {
    let follow = true;
    for (let i = 0; i < block.length && isBoolean(follow); i++) {
      const locale = block[i];
      if (isString(locale)) {
        follow = appendLocaleToChain(chain, block[i], blocks);
      }
    }
    return follow;
  }
  function appendLocaleToChain(chain, locale, blocks) {
    let follow;
    const tokens = locale.split("-");
    do {
      const target = tokens.join("-");
      follow = appendItemToChain(chain, target, blocks);
      tokens.splice(-1, 1);
    } while (tokens.length && follow === true);
    return follow;
  }
  function appendItemToChain(chain, target, blocks) {
    let follow = false;
    if (!chain.includes(target)) {
      follow = true;
      if (target) {
        follow = target[target.length - 1] !== "!";
        const locale = target.replace(/!/g, "");
        chain.push(locale);
        if ((isArray(blocks) || isPlainObject(blocks)) && blocks[locale]) {
          follow = blocks[locale];
        }
      }
    }
    return follow;
  }
  const pathStateMachine = [];
  pathStateMachine[
    0
] = {
    [
      "w"
]: [
      0
],
    [
      "i"
]: [
      3,
      0
],
    [
      "["
]: [
      4
],
    [
      "o"
]: [
      7
]
  };
  pathStateMachine[
    1
] = {
    [
      "w"
]: [
      1
],
    [
      "."
]: [
      2
],
    [
      "["
]: [
      4
],
    [
      "o"
]: [
      7
]
  };
  pathStateMachine[
    2
] = {
    [
      "w"
]: [
      2
],
    [
      "i"
]: [
      3,
      0
],
    [
      "0"
]: [
      3,
      0
]
  };
  pathStateMachine[
    3
] = {
    [
      "i"
]: [
      3,
      0
],
    [
      "0"
]: [
      3,
      0
],
    [
      "w"
]: [
      1,
      1
],
    [
      "."
]: [
      2,
      1
],
    [
      "["
]: [
      4,
      1
],
    [
      "o"
]: [
      7,
      1
]
  };
  pathStateMachine[
    4
] = {
    [
      "'"
]: [
      5,
      0
],
    [
      '"'
]: [
      6,
      0
],
    [
      "["
]: [
      4,
      2
],
    [
      "]"
]: [
      1,
      3
],
    [
      "o"
]: 8,
    [
      "l"
]: [
      4,
      0
]
  };
  pathStateMachine[
    5
] = {
    [
      "'"
]: [
      4,
      0
],
    [
      "o"
]: 8,
    [
      "l"
]: [
      5,
      0
]
  };
  pathStateMachine[
    6
] = {
    [
      '"'
]: [
      4,
      0
],
    [
      "o"
]: 8,
    [
      "l"
]: [
      6,
      0
]
  };
  const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
  function isLiteral(exp) {
    return literalValueRE.test(exp);
  }
  function stripQuotes(str) {
    const a2 = str.charCodeAt(0);
    const b = str.charCodeAt(str.length - 1);
    return a2 === b && (a2 === 34 || a2 === 39) ? str.slice(1, -1) : str;
  }
  function getPathCharType(ch) {
    if (ch === void 0 || ch === null) {
      return "o";
    }
    const code = ch.charCodeAt(0);
    switch (code) {
      case 91:
case 93:
case 46:
case 34:
case 39:
        return ch;
      case 95:
case 36:
case 45:
        return "i";
      case 9:
case 10:
case 13:
case 160:
case 65279:
case 8232:
case 8233:
        return "w";
    }
    return "i";
  }
  function formatSubPath(path) {
    const trimmed = path.trim();
    if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
      return false;
    }
    return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
  }
  function parse(path) {
    const keys = [];
    let index = -1;
    let mode = 0;
    let subPathDepth = 0;
    let c;
    let key;
    let newChar;
    let type;
    let transition;
    let action;
    let typeMap;
    const actions = [];
    actions[
      0
] = () => {
      if (key === void 0) {
        key = newChar;
      } else {
        key += newChar;
      }
    };
    actions[
      1
] = () => {
      if (key !== void 0) {
        keys.push(key);
        key = void 0;
      }
    };
    actions[
      2
] = () => {
      actions[
        0
]();
      subPathDepth++;
    };
    actions[
      3
] = () => {
      if (subPathDepth > 0) {
        subPathDepth--;
        mode = 4;
        actions[
          0
]();
      } else {
        subPathDepth = 0;
        if (key === void 0) {
          return false;
        }
        key = formatSubPath(key);
        if (key === false) {
          return false;
        } else {
          actions[
            1
]();
        }
      }
    };
    function maybeUnescapeQuote() {
      const nextChar = path[index + 1];
      if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
        index++;
        newChar = "\\" + nextChar;
        actions[
          0
]();
        return true;
      }
    }
    while (mode !== null) {
      index++;
      c = path[index];
      if (c === "\\" && maybeUnescapeQuote()) {
        continue;
      }
      type = getPathCharType(c);
      typeMap = pathStateMachine[mode];
      transition = typeMap[type] || typeMap[
        "l"
] || 8;
      if (transition === 8) {
        return;
      }
      mode = transition[0];
      if (transition[1] !== void 0) {
        action = actions[transition[1]];
        if (action) {
          newChar = c;
          if (action() === false) {
            return;
          }
        }
      }
      if (mode === 7) {
        return keys;
      }
    }
  }
  const cache = new Map();
  function resolveWithKeyValue(obj, path) {
    return isObject(obj) ? obj[path] : null;
  }
  function resolveValue(obj, path) {
    if (!isObject(obj)) {
      return null;
    }
    let hit = cache.get(path);
    if (!hit) {
      hit = parse(path);
      if (hit) {
        cache.set(path, hit);
      }
    }
    if (!hit) {
      return null;
    }
    const len = hit.length;
    let last = obj;
    let i = 0;
    while (i < len) {
      const key = hit[i];
      if (AST_NODE_PROPS_KEYS.includes(key) && isMessageAST(last)) {
        return null;
      }
      const val = last[key];
      if (val === void 0) {
        return null;
      }
      if (isFunction(last)) {
        return null;
      }
      last = val;
      i++;
    }
    return last;
  }
  const VERSION$1 = "11.2.7";
  const NOT_REOSLVED = -1;
  const DEFAULT_LOCALE = "en-US";
  const MISSING_RESOLVE_VALUE = "";
  const capitalize = (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;
  function getDefaultLinkedModifiers() {
    return {
      upper: (val, type) => {
        return type === "text" && isString(val) ? val.toUpperCase() : type === "vnode" && isObject(val) && "__v_isVNode" in val ? val.children.toUpperCase() : val;
      },
      lower: (val, type) => {
        return type === "text" && isString(val) ? val.toLowerCase() : type === "vnode" && isObject(val) && "__v_isVNode" in val ? val.children.toLowerCase() : val;
      },
      capitalize: (val, type) => {
        return type === "text" && isString(val) ? capitalize(val) : type === "vnode" && isObject(val) && "__v_isVNode" in val ? capitalize(val.children) : val;
      }
    };
  }
  let _compiler;
  function registerMessageCompiler(compiler) {
    _compiler = compiler;
  }
  let _resolver;
  function registerMessageResolver(resolver) {
    _resolver = resolver;
  }
  let _fallbacker;
  function registerLocaleFallbacker(fallbacker) {
    _fallbacker = fallbacker;
  }
  let _additionalMeta = null;
  const setAdditionalMeta = (meta) => {
    _additionalMeta = meta;
  };
  const getAdditionalMeta = () => _additionalMeta;
  let _fallbackContext = null;
  const setFallbackContext = (context) => {
    _fallbackContext = context;
  };
  const getFallbackContext = () => _fallbackContext;
  let _cid = 0;
  function createCoreContext(options = {}) {
    const onWarn = isFunction(options.onWarn) ? options.onWarn : warn;
    const version = isString(options.version) ? options.version : VERSION$1;
    const locale = isString(options.locale) || isFunction(options.locale) ? options.locale : DEFAULT_LOCALE;
    const _locale = isFunction(locale) ? DEFAULT_LOCALE : locale;
    const fallbackLocale = isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || isString(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale;
    const messages = isPlainObject(options.messages) ? options.messages : createResources(_locale);
    const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : createResources(_locale);
    const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : createResources(_locale);
    const modifiers = assign(create(), options.modifiers, getDefaultLinkedModifiers());
    const pluralRules = options.pluralRules || create();
    const missing = isFunction(options.missing) ? options.missing : null;
    const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
    const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
    const fallbackFormat = !!options.fallbackFormat;
    const unresolving = !!options.unresolving;
    const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
    const processor = isPlainObject(options.processor) ? options.processor : null;
    const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
    const escapeParameter = !!options.escapeParameter;
    const messageCompiler = isFunction(options.messageCompiler) ? options.messageCompiler : _compiler;
    const messageResolver = isFunction(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
    const localeFallbacker = isFunction(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
    const fallbackContext = isObject(options.fallbackContext) ? options.fallbackContext : void 0;
    const internalOptions = options;
    const __datetimeFormatters = isObject(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : new Map();
    const __numberFormatters = isObject(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : new Map();
    const __meta = isObject(internalOptions.__meta) ? internalOptions.__meta : {};
    _cid++;
    const context = {
      version,
      cid: _cid,
      locale,
      fallbackLocale,
      messages,
      modifiers,
      pluralRules,
      missing,
      missingWarn,
      fallbackWarn,
      fallbackFormat,
      unresolving,
      postTranslation,
      processor,
      warnHtmlMessage,
      escapeParameter,
      messageCompiler,
      messageResolver,
      localeFallbacker,
      fallbackContext,
      onWarn,
      __meta
    };
    {
      context.datetimeFormats = datetimeFormats;
      context.numberFormats = numberFormats;
      context.__datetimeFormatters = __datetimeFormatters;
      context.__numberFormatters = __numberFormatters;
    }
    if (__INTLIFY_PROD_DEVTOOLS__) {
      initI18nDevTools(context, version, __meta);
    }
    return context;
  }
  const createResources = (locale) => ({ [locale]: create() });
  function handleMissing(context, key, locale, missingWarn, type) {
    const { missing, onWarn } = context;
    if (missing !== null) {
      const ret = missing(context, locale, key, type);
      return isString(ret) ? ret : key;
    } else {
      return key;
    }
  }
  function updateFallbackLocale(ctx, locale, fallback) {
    const context = ctx;
    context.__localeChainCache = new Map();
    ctx.localeFallbacker(ctx, fallback, locale);
  }
  function isAlmostSameLocale(locale, compareLocale) {
    if (locale === compareLocale)
      return false;
    return locale.split("-")[0] === compareLocale.split("-")[0];
  }
  function isImplicitFallback(targetLocale, locales) {
    const index = locales.indexOf(targetLocale);
    if (index === -1) {
      return false;
    }
    for (let i = index + 1; i < locales.length; i++) {
      if (isAlmostSameLocale(targetLocale, locales[i])) {
        return true;
      }
    }
    return false;
  }
  function datetime(context, ...args) {
    const { datetimeFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
    const { __datetimeFormatters } = context;
    const [key, value, options, overrides] = parseDateTimeArgs(...args);
    const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
    isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
    const part = !!options.part;
    const locale = getLocale(context, options);
    const locales = localeFallbacker(
      context,
fallbackLocale,
      locale
    );
    if (!isString(key) || key === "") {
      return new Intl.DateTimeFormat(locale, overrides).format(value);
    }
    let datetimeFormat = {};
    let targetLocale;
    let format2 = null;
    const type = "datetime format";
    for (let i = 0; i < locales.length; i++) {
      targetLocale = locales[i];
      datetimeFormat = datetimeFormats[targetLocale] || {};
      format2 = datetimeFormat[key];
      if (isPlainObject(format2))
        break;
      handleMissing(context, key, targetLocale, missingWarn, type);
    }
    if (!isPlainObject(format2) || !isString(targetLocale)) {
      return unresolving ? NOT_REOSLVED : key;
    }
    let id = `${targetLocale}__${key}`;
    if (!isEmptyObject(overrides)) {
      id = `${id}__${JSON.stringify(overrides)}`;
    }
    let formatter = __datetimeFormatters.get(id);
    if (!formatter) {
      formatter = new Intl.DateTimeFormat(targetLocale, assign({}, format2, overrides));
      __datetimeFormatters.set(id, formatter);
    }
    return !part ? formatter.format(value) : formatter.formatToParts(value);
  }
  const DATETIME_FORMAT_OPTIONS_KEYS = [
    "localeMatcher",
    "weekday",
    "era",
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "timeZoneName",
    "formatMatcher",
    "hour12",
    "timeZone",
    "dateStyle",
    "timeStyle",
    "calendar",
    "dayPeriod",
    "numberingSystem",
    "hourCycle",
    "fractionalSecondDigits"
  ];
  function parseDateTimeArgs(...args) {
    const [arg1, arg2, arg3, arg4] = args;
    const options = create();
    let overrides = create();
    let value;
    if (isString(arg1)) {
      const matches2 = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
      if (!matches2) {
        throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
      }
      const dateTime = matches2[3] ? matches2[3].trim().startsWith("T") ? `${matches2[1].trim()}${matches2[3].trim()}` : `${matches2[1].trim()}T${matches2[3].trim()}` : matches2[1].trim();
      value = new Date(dateTime);
      try {
        value.toISOString();
      } catch {
        throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
      }
    } else if (isDate(arg1)) {
      if (isNaN(arg1.getTime())) {
        throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
      }
      value = arg1;
    } else if (isNumber(arg1)) {
      value = arg1;
    } else {
      throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
    }
    if (isString(arg2)) {
      options.key = arg2;
    } else if (isPlainObject(arg2)) {
      Object.keys(arg2).forEach((key) => {
        if (DATETIME_FORMAT_OPTIONS_KEYS.includes(key)) {
          overrides[key] = arg2[key];
        } else {
          options[key] = arg2[key];
        }
      });
    }
    if (isString(arg3)) {
      options.locale = arg3;
    } else if (isPlainObject(arg3)) {
      overrides = arg3;
    }
    if (isPlainObject(arg4)) {
      overrides = arg4;
    }
    return [options.key || "", value, options, overrides];
  }
  function clearDateTimeFormat(ctx, locale, format2) {
    const context = ctx;
    for (const key in format2) {
      const id = `${locale}__${key}`;
      if (!context.__datetimeFormatters.has(id)) {
        continue;
      }
      context.__datetimeFormatters.delete(id);
    }
  }
  function number(context, ...args) {
    const { numberFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
    const { __numberFormatters } = context;
    const [key, value, options, overrides] = parseNumberArgs(...args);
    const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
    isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
    const part = !!options.part;
    const locale = getLocale(context, options);
    const locales = localeFallbacker(
      context,
fallbackLocale,
      locale
    );
    if (!isString(key) || key === "") {
      return new Intl.NumberFormat(locale, overrides).format(value);
    }
    let numberFormat = {};
    let targetLocale;
    let format2 = null;
    const type = "number format";
    for (let i = 0; i < locales.length; i++) {
      targetLocale = locales[i];
      numberFormat = numberFormats[targetLocale] || {};
      format2 = numberFormat[key];
      if (isPlainObject(format2))
        break;
      handleMissing(context, key, targetLocale, missingWarn, type);
    }
    if (!isPlainObject(format2) || !isString(targetLocale)) {
      return unresolving ? NOT_REOSLVED : key;
    }
    let id = `${targetLocale}__${key}`;
    if (!isEmptyObject(overrides)) {
      id = `${id}__${JSON.stringify(overrides)}`;
    }
    let formatter = __numberFormatters.get(id);
    if (!formatter) {
      formatter = new Intl.NumberFormat(targetLocale, assign({}, format2, overrides));
      __numberFormatters.set(id, formatter);
    }
    return !part ? formatter.format(value) : formatter.formatToParts(value);
  }
  const NUMBER_FORMAT_OPTIONS_KEYS = [
    "localeMatcher",
    "style",
    "currency",
    "currencyDisplay",
    "currencySign",
    "useGrouping",
    "minimumIntegerDigits",
    "minimumFractionDigits",
    "maximumFractionDigits",
    "minimumSignificantDigits",
    "maximumSignificantDigits",
    "compactDisplay",
    "notation",
    "signDisplay",
    "unit",
    "unitDisplay",
    "roundingMode",
    "roundingPriority",
    "roundingIncrement",
    "trailingZeroDisplay"
  ];
  function parseNumberArgs(...args) {
    const [arg1, arg2, arg3, arg4] = args;
    const options = create();
    let overrides = create();
    if (!isNumber(arg1)) {
      throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
    }
    const value = arg1;
    if (isString(arg2)) {
      options.key = arg2;
    } else if (isPlainObject(arg2)) {
      Object.keys(arg2).forEach((key) => {
        if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
          overrides[key] = arg2[key];
        } else {
          options[key] = arg2[key];
        }
      });
    }
    if (isString(arg3)) {
      options.locale = arg3;
    } else if (isPlainObject(arg3)) {
      overrides = arg3;
    }
    if (isPlainObject(arg4)) {
      overrides = arg4;
    }
    return [options.key || "", value, options, overrides];
  }
  function clearNumberFormat(ctx, locale, format2) {
    const context = ctx;
    for (const key in format2) {
      const id = `${locale}__${key}`;
      if (!context.__numberFormatters.has(id)) {
        continue;
      }
      context.__numberFormatters.delete(id);
    }
  }
  const DEFAULT_MODIFIER = (str) => str;
  const DEFAULT_MESSAGE = (ctx) => "";
  const DEFAULT_MESSAGE_DATA_TYPE = "text";
  const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : join(values);
  const DEFAULT_INTERPOLATE = toDisplayString;
  function pluralDefault(choice, choicesLength) {
    choice = Math.abs(choice);
    if (choicesLength === 2) {
      return choice ? choice > 1 ? 1 : 0 : 1;
    }
    return choice ? Math.min(choice, 2) : 0;
  }
  function getPluralIndex(options) {
    const index = isNumber(options.pluralIndex) ? options.pluralIndex : -1;
    return options.named && (isNumber(options.named.count) || isNumber(options.named.n)) ? isNumber(options.named.count) ? options.named.count : isNumber(options.named.n) ? options.named.n : index : index;
  }
  function normalizeNamed(pluralIndex, props) {
    if (!props.count) {
      props.count = pluralIndex;
    }
    if (!props.n) {
      props.n = pluralIndex;
    }
  }
  function createMessageContext(options = {}) {
    const locale = options.locale;
    const pluralIndex = getPluralIndex(options);
    const pluralRule = isObject(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
    const orgPluralRule = isObject(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? pluralDefault : void 0;
    const plural = (messages) => {
      return messages[pluralRule(pluralIndex, messages.length, orgPluralRule)];
    };
    const _list = options.list || [];
    const list = (index) => _list[index];
    const _named = options.named || create();
    isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
    const named = (key) => _named[key];
    function message(key, useLinked) {
      const msg = isFunction(options.messages) ? options.messages(key, !!useLinked) : isObject(options.messages) ? options.messages[key] : false;
      return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
    }
    const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
    const normalize = isPlainObject(options.processor) && isFunction(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
    const interpolate = isPlainObject(options.processor) && isFunction(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
    const type = isPlainObject(options.processor) && isString(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
    const linked = (key, ...args) => {
      const [arg1, arg2] = args;
      let type2 = "text";
      let modifier = "";
      if (args.length === 1) {
        if (isObject(arg1)) {
          modifier = arg1.modifier || modifier;
          type2 = arg1.type || type2;
        } else if (isString(arg1)) {
          modifier = arg1 || modifier;
        }
      } else if (args.length === 2) {
        if (isString(arg1)) {
          modifier = arg1 || modifier;
        }
        if (isString(arg2)) {
          type2 = arg2 || type2;
        }
      }
      const ret = message(key, true)(ctx);
      const msg = (
type2 === "vnode" && isArray(ret) && modifier ? ret[0] : ret
      );
      return modifier ? _modifier(modifier)(msg, type2) : msg;
    };
    const ctx = {
      [
        "list"
]: list,
      [
        "named"
]: named,
      [
        "plural"
]: plural,
      [
        "linked"
]: linked,
      [
        "message"
]: message,
      [
        "type"
]: type,
      [
        "interpolate"
]: interpolate,
      [
        "normalize"
]: normalize,
      [
        "values"
]: assign(create(), _list, _named)
    };
    return ctx;
  }
  const NOOP_MESSAGE_FUNCTION = () => "";
  const isMessageFunction = (val) => isFunction(val);
  function translate(context, ...args) {
    const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages } = context;
    const [key, options] = parseTranslateArgs(...args);
    const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
    const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
    const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
    const resolvedMessage = !!options.resolvedMessage;
    const defaultMsgOrKey = isString(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : null;
    const enableDefaultMsg = fallbackFormat || defaultMsgOrKey != null && (isString(defaultMsgOrKey) || isFunction(defaultMsgOrKey));
    const locale = getLocale(context, options);
    escapeParameter && escapeParams(options);
    let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
      key,
      locale,
      messages[locale] || create()
    ];
    let format2 = formatScope;
    let cacheBaseKey = key;
    if (!resolvedMessage && !(isString(format2) || isMessageAST(format2) || isMessageFunction(format2))) {
      if (enableDefaultMsg) {
        format2 = defaultMsgOrKey;
        cacheBaseKey = format2;
      }
    }
    if (!resolvedMessage && (!(isString(format2) || isMessageAST(format2) || isMessageFunction(format2)) || !isString(targetLocale))) {
      return unresolving ? NOT_REOSLVED : key;
    }
    let occurred = false;
    const onError = () => {
      occurred = true;
    };
    const msg = !isMessageFunction(format2) ? compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) : format2;
    if (occurred) {
      return format2;
    }
    const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
    const msgContext = createMessageContext(ctxOptions);
    const messaged = evaluateMessage(context, msg, msgContext);
    let ret = postTranslation ? postTranslation(messaged, key) : messaged;
    if (escapeParameter && isString(ret)) {
      ret = sanitizeTranslatedHtml(ret);
    }
    if (__INTLIFY_PROD_DEVTOOLS__) {
      const payloads = {
        timestamp: Date.now(),
        key: isString(key) ? key : isMessageFunction(format2) ? format2.key : "",
        locale: targetLocale || (isMessageFunction(format2) ? format2.locale : ""),
        format: isString(format2) ? format2 : isMessageFunction(format2) ? format2.source : "",
        message: ret
      };
      payloads.meta = assign({}, context.__meta, getAdditionalMeta() || {});
      translateDevTools(payloads);
    }
    return ret;
  }
  function escapeParams(options) {
    if (isArray(options.list)) {
      options.list = options.list.map((item) => isString(item) ? escapeHtml(item) : item);
    } else if (isObject(options.named)) {
      Object.keys(options.named).forEach((key) => {
        if (isString(options.named[key])) {
          options.named[key] = escapeHtml(options.named[key]);
        }
      });
    }
  }
  function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
    const { messages, onWarn, messageResolver: resolveValue2, localeFallbacker } = context;
    const locales = localeFallbacker(context, fallbackLocale, locale);
    let message = create();
    let targetLocale;
    let format2 = null;
    const type = "translate";
    for (let i = 0; i < locales.length; i++) {
      targetLocale = locales[i];
      message = messages[targetLocale] || create();
      if ((format2 = resolveValue2(message, key)) === null) {
        format2 = message[key];
      }
      if (isString(format2) || isMessageAST(format2) || isMessageFunction(format2)) {
        break;
      }
      if (!isImplicitFallback(targetLocale, locales)) {
        const missingRet = handleMissing(
          context,
key,
          targetLocale,
          missingWarn,
          type
        );
        if (missingRet !== key) {
          format2 = missingRet;
        }
      }
    }
    return [format2, targetLocale, message];
  }
  function compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) {
    const { messageCompiler, warnHtmlMessage } = context;
    if (isMessageFunction(format2)) {
      const msg2 = format2;
      msg2.locale = msg2.locale || targetLocale;
      msg2.key = msg2.key || key;
      return msg2;
    }
    if (messageCompiler == null) {
      const msg2 = (() => format2);
      msg2.locale = targetLocale;
      msg2.key = key;
      return msg2;
    }
    const msg = messageCompiler(format2, getCompileContext(context, targetLocale, cacheBaseKey, format2, warnHtmlMessage, onError));
    msg.locale = targetLocale;
    msg.key = key;
    msg.source = format2;
    return msg;
  }
  function evaluateMessage(context, msg, msgCtx) {
    const messaged = msg(msgCtx);
    return messaged;
  }
  function parseTranslateArgs(...args) {
    const [arg1, arg2, arg3] = args;
    const options = create();
    if (!isString(arg1) && !isNumber(arg1) && !isMessageFunction(arg1) && !isMessageAST(arg1)) {
      throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
    }
    const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
    if (isNumber(arg2)) {
      options.plural = arg2;
    } else if (isString(arg2)) {
      options.default = arg2;
    } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
      options.named = arg2;
    } else if (isArray(arg2)) {
      options.list = arg2;
    }
    if (isNumber(arg3)) {
      options.plural = arg3;
    } else if (isString(arg3)) {
      options.default = arg3;
    } else if (isPlainObject(arg3)) {
      assign(options, arg3);
    }
    return [key, options];
  }
  function getCompileContext(context, locale, key, source, warnHtmlMessage, onError) {
    return {
      locale,
      key,
      warnHtmlMessage,
      onError: (err) => {
        onError && onError(err);
        {
          throw err;
        }
      },
      onCacheKey: (source2) => generateFormatCacheKey(locale, key, source2)
    };
  }
  function getMessageContextOptions(context, locale, message, options) {
    const { modifiers, pluralRules, messageResolver: resolveValue2, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
    const resolveMessage = (key, useLinked) => {
      let val = resolveValue2(message, key);
      if (val == null && (fallbackContext || useLinked)) {
        const [, , message2] = resolveMessageFormat(
          fallbackContext || context,
key,
          locale,
          fallbackLocale,
          fallbackWarn,
          missingWarn
        );
        val = resolveValue2(message2, key);
      }
      if (isString(val) || isMessageAST(val)) {
        let occurred = false;
        const onError = () => {
          occurred = true;
        };
        const msg = compileMessageFormat(context, key, locale, val, key, onError);
        return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
      } else if (isMessageFunction(val)) {
        return val;
      } else {
        return NOOP_MESSAGE_FUNCTION;
      }
    };
    const ctxOptions = {
      locale,
      modifiers,
      pluralRules,
      messages: resolveMessage
    };
    if (context.processor) {
      ctxOptions.processor = context.processor;
    }
    if (options.list) {
      ctxOptions.list = options.list;
    }
    if (options.named) {
      ctxOptions.named = options.named;
    }
    if (isNumber(options.plural)) {
      ctxOptions.pluralIndex = options.plural;
    }
    return ctxOptions;
  }
  {
    initFeatureFlags$1();
  }
  const VERSION = "11.2.7";
  function initFeatureFlags() {
    if (typeof __VUE_I18N_FULL_INSTALL__ !== "boolean") {
      getGlobalThis().__VUE_I18N_FULL_INSTALL__ = true;
    }
    if (typeof __VUE_I18N_LEGACY_API__ !== "boolean") {
      getGlobalThis().__VUE_I18N_LEGACY_API__ = true;
    }
    if (typeof __INTLIFY_DROP_MESSAGE_COMPILER__ !== "boolean") {
      getGlobalThis().__INTLIFY_DROP_MESSAGE_COMPILER__ = false;
    }
    if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
      getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
    }
  }
  const I18nErrorCodes = {
UNEXPECTED_RETURN_TYPE: CORE_ERROR_CODES_EXTEND_POINT,

INVALID_ARGUMENT: 25,
MUST_BE_CALL_SETUP_TOP: 26,
    NOT_INSTALLED: 27,
REQUIRED_VALUE: 28,
    INVALID_VALUE: 29,
    NOT_INSTALLED_WITH_PROVIDE: 31,
UNEXPECTED_ERROR: 32
  };
  function createI18nError(code, ...args) {
    return createCompileError(code, null, void 0);
  }
  const TranslateVNodeSymbol = makeSymbol("__translateVNode");
  const DatetimePartsSymbol = makeSymbol("__datetimeParts");
  const NumberPartsSymbol = makeSymbol("__numberParts");
  const SetPluralRulesSymbol = makeSymbol("__setPluralRules");
  const InejctWithOptionSymbol = makeSymbol("__injectWithOption");
  const DisposeSymbol = makeSymbol("__dispose");
  function handleFlatJson(obj) {
    if (!isObject(obj)) {
      return obj;
    }
    if (isMessageAST(obj)) {
      return obj;
    }
    for (const key in obj) {
      if (!hasOwn(obj, key)) {
        continue;
      }
      if (!key.includes(".")) {
        if (isObject(obj[key])) {
          handleFlatJson(obj[key]);
        }
      } else {
        const subKeys = key.split(".");
        const lastIndex = subKeys.length - 1;
        let currentObj = obj;
        let hasStringValue = false;
        for (let i = 0; i < lastIndex; i++) {
          if (subKeys[i] === "__proto__") {
            throw new Error(`unsafe key: ${subKeys[i]}`);
          }
          if (!(subKeys[i] in currentObj)) {
            currentObj[subKeys[i]] = create();
          }
          if (!isObject(currentObj[subKeys[i]])) {
            hasStringValue = true;
            break;
          }
          currentObj = currentObj[subKeys[i]];
        }
        if (!hasStringValue) {
          if (!isMessageAST(currentObj)) {
            currentObj[subKeys[lastIndex]] = obj[key];
            delete obj[key];
          } else {
            if (!AST_NODE_PROPS_KEYS.includes(subKeys[lastIndex])) {
              delete obj[key];
            }
          }
        }
        if (!isMessageAST(currentObj)) {
          const target = currentObj[subKeys[lastIndex]];
          if (isObject(target)) {
            handleFlatJson(target);
          }
        }
      }
    }
    return obj;
  }
  function getLocaleMessages(locale, options) {
    const { messages, __i18n, messageResolver, flatJson } = options;
    const ret = isPlainObject(messages) ? messages : isArray(__i18n) ? create() : { [locale]: create() };
    if (isArray(__i18n)) {
      __i18n.forEach((custom) => {
        if ("locale" in custom && "resource" in custom) {
          const { locale: locale2, resource } = custom;
          if (locale2) {
            ret[locale2] = ret[locale2] || create();
            deepCopy(resource, ret[locale2]);
          } else {
            deepCopy(resource, ret);
          }
        } else {
          isString(custom) && deepCopy(JSON.parse(custom), ret);
        }
      });
    }
    if (messageResolver == null && flatJson) {
      for (const key in ret) {
        if (hasOwn(ret, key)) {
          handleFlatJson(ret[key]);
        }
      }
    }
    return ret;
  }
  function getComponentOptions(instance) {
    return instance.type;
  }
  function adjustI18nResources(gl, options, componentOptions) {
    let messages = isObject(options.messages) ? options.messages : create();
    if ("__i18nGlobal" in componentOptions) {
      messages = getLocaleMessages(gl.locale.value, {
        messages,
        __i18n: componentOptions.__i18nGlobal
      });
    }
    const locales = Object.keys(messages);
    if (locales.length) {
      locales.forEach((locale) => {
        gl.mergeLocaleMessage(locale, messages[locale]);
      });
    }
    {
      if (isObject(options.datetimeFormats)) {
        const locales2 = Object.keys(options.datetimeFormats);
        if (locales2.length) {
          locales2.forEach((locale) => {
            gl.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
          });
        }
      }
      if (isObject(options.numberFormats)) {
        const locales2 = Object.keys(options.numberFormats);
        if (locales2.length) {
          locales2.forEach((locale) => {
            gl.mergeNumberFormat(locale, options.numberFormats[locale]);
          });
        }
      }
    }
  }
  function createTextNode(key) {
    return Vue.createVNode(Vue.Text, null, key, 0);
  }
  function getCurrentInstance() {
    const key = "currentInstance";
    if (key in Vue__namespace) {
      return Vue__namespace[key];
    } else {
      return Vue__namespace.getCurrentInstance();
    }
  }
  const DEVTOOLS_META = "__INTLIFY_META__";
  const NOOP_RETURN_ARRAY = () => [];
  const NOOP_RETURN_FALSE = () => false;
  let composerID = 0;
  function defineCoreMissingHandler(missing) {
    return ((ctx, locale, key, type) => {
      return missing(locale, key, getCurrentInstance() || void 0, type);
    });
  }
  const getMetaInfo = () => {
    const instance = getCurrentInstance();
    let meta = null;
    return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? { [DEVTOOLS_META]: meta } : null;
  };
  function createComposer(options = {}) {
    const { __root, __injectWithOption } = options;
    const _isGlobal = __root === void 0;
    const flatJson = options.flatJson;
    const _ref = inBrowser ? Vue.ref : Vue.shallowRef;
    let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
    const _locale = _ref(
__root && _inheritLocale ? __root.locale.value : isString(options.locale) ? options.locale : DEFAULT_LOCALE
    );
    const _fallbackLocale = _ref(
__root && _inheritLocale ? __root.fallbackLocale.value : isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
    );
    const _messages = _ref(getLocaleMessages(_locale.value, options));
    const _datetimeFormats = _ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
    const _numberFormats = _ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
    let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
    let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
    let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
    let _fallbackFormat = !!options.fallbackFormat;
    let _missing = isFunction(options.missing) ? options.missing : null;
    let _runtimeMissing = isFunction(options.missing) ? defineCoreMissingHandler(options.missing) : null;
    let _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
    let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
    let _escapeParameter = !!options.escapeParameter;
    const _modifiers = __root ? __root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
    let _pluralRules = options.pluralRules || __root && __root.pluralRules;
    let _context;
    const getCoreContext = () => {
      _isGlobal && setFallbackContext(null);
      const ctxOptions = {
        version: VERSION,
        locale: _locale.value,
        fallbackLocale: _fallbackLocale.value,
        messages: _messages.value,
        modifiers: _modifiers,
        pluralRules: _pluralRules,
        missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
        missingWarn: _missingWarn,
        fallbackWarn: _fallbackWarn,
        fallbackFormat: _fallbackFormat,
        unresolving: true,
        postTranslation: _postTranslation === null ? void 0 : _postTranslation,
        warnHtmlMessage: _warnHtmlMessage,
        escapeParameter: _escapeParameter,
        messageResolver: options.messageResolver,
        messageCompiler: options.messageCompiler,
        __meta: { framework: "vue" }
      };
      {
        ctxOptions.datetimeFormats = _datetimeFormats.value;
        ctxOptions.numberFormats = _numberFormats.value;
        ctxOptions.__datetimeFormatters = isPlainObject(_context) ? _context.__datetimeFormatters : void 0;
        ctxOptions.__numberFormatters = isPlainObject(_context) ? _context.__numberFormatters : void 0;
      }
      const ctx = createCoreContext(ctxOptions);
      _isGlobal && setFallbackContext(ctx);
      return ctx;
    };
    _context = getCoreContext();
    updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
    function trackReactivityValues() {
      return [
        _locale.value,
        _fallbackLocale.value,
        _messages.value,
        _datetimeFormats.value,
        _numberFormats.value
      ];
    }
    const locale = Vue.computed({
      get: () => _locale.value,
      set: (val) => {
        _context.locale = val;
        _locale.value = val;
      }
    });
    const fallbackLocale = Vue.computed({
      get: () => _fallbackLocale.value,
      set: (val) => {
        _context.fallbackLocale = val;
        _fallbackLocale.value = val;
        updateFallbackLocale(_context, _locale.value, val);
      }
    });
    const messages = Vue.computed(() => _messages.value);
    const datetimeFormats = Vue.computed(() => _datetimeFormats.value);
    const numberFormats = Vue.computed(() => _numberFormats.value);
    function getPostTranslationHandler() {
      return isFunction(_postTranslation) ? _postTranslation : null;
    }
    function setPostTranslationHandler(handler) {
      _postTranslation = handler;
      _context.postTranslation = handler;
    }
    function getMissingHandler() {
      return _missing;
    }
    function setMissingHandler(handler) {
      if (handler !== null) {
        _runtimeMissing = defineCoreMissingHandler(handler);
      }
      _missing = handler;
      _context.missing = _runtimeMissing;
    }
    const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
      trackReactivityValues();
      let ret;
      try {
        if (__INTLIFY_PROD_DEVTOOLS__) {
setAdditionalMeta( getMetaInfo());
        }
        if (!_isGlobal) {
          _context.fallbackContext = __root ? getFallbackContext() : void 0;
        }
        ret = fn(_context);
      } finally {
        if (__INTLIFY_PROD_DEVTOOLS__) ;
        if (!_isGlobal) {
          _context.fallbackContext = void 0;
        }
      }
      if (warnType !== "translate exists" &&
isNumber(ret) && ret === NOT_REOSLVED || warnType === "translate exists" && !ret) {
        const [key, arg2] = argumentParser();
        return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
      } else if (successCondition(ret)) {
        return ret;
      } else {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
      }
    };
    function t2(...args) {
      return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root) => Reflect.apply(root.t, root, [...args]), (key) => key, (val) => isString(val));
    }
    function rt(...args) {
      const [arg1, arg2, arg3] = args;
      if (arg3 && !isObject(arg3)) {
        throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
      }
      return t2(...[arg1, arg2, assign({ resolvedMessage: true }, arg3 || {})]);
    }
    function d2(...args) {
      return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => Reflect.apply(root.d, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val) || isArray(val));
    }
    function n(...args) {
      return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => Reflect.apply(root.n, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val) || isArray(val));
    }
    function normalize(values) {
      return values.map((val) => isString(val) || isNumber(val) || isBoolean(val) ? createTextNode(String(val)) : val);
    }
    const interpolate = (val) => val;
    const processor = {
      normalize,
      interpolate,
      type: "vnode"
    };
    function translateVNode(...args) {
      return wrapWithDeps((context) => {
        let ret;
        const _context2 = context;
        try {
          _context2.processor = processor;
          ret = Reflect.apply(translate, null, [_context2, ...args]);
        } finally {
          _context2.processor = null;
        }
        return ret;
      }, () => parseTranslateArgs(...args), "translate", (root) => root[TranslateVNodeSymbol](...args), (key) => [createTextNode(key)], (val) => isArray(val));
    }
    function numberParts(...args) {
      return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => root[NumberPartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
    }
    function datetimeParts(...args) {
      return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => root[DatetimePartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
    }
    function setPluralRules(rules2) {
      _pluralRules = rules2;
      _context.pluralRules = _pluralRules;
    }
    function te(key, locale2) {
      return wrapWithDeps(() => {
        if (!key) {
          return false;
        }
        const targetLocale = isString(locale2) ? locale2 : _locale.value;
        const message = getLocaleMessage(targetLocale);
        const resolved = _context.messageResolver(message, key);
        return isMessageAST(resolved) || isMessageFunction(resolved) || isString(resolved);
      }, () => [key], "translate exists", (root) => {
        return Reflect.apply(root.te, root, [key, locale2]);
      }, NOOP_RETURN_FALSE, (val) => isBoolean(val));
    }
    function resolveMessages(key) {
      let messages2 = null;
      const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
      for (let i = 0; i < locales.length; i++) {
        const targetLocaleMessages = _messages.value[locales[i]] || {};
        const messageValue = _context.messageResolver(targetLocaleMessages, key);
        if (messageValue != null) {
          messages2 = messageValue;
          break;
        }
      }
      return messages2;
    }
    function tm(key) {
      const messages2 = resolveMessages(key);
      return messages2 != null ? messages2 : __root ? __root.tm(key) || {} : {};
    }
    function getLocaleMessage(locale2) {
      return _messages.value[locale2] || {};
    }
    function setLocaleMessage(locale2, message) {
      if (flatJson) {
        const _message = { [locale2]: message };
        for (const key in _message) {
          if (hasOwn(_message, key)) {
            handleFlatJson(_message[key]);
          }
        }
        message = _message[locale2];
      }
      _messages.value[locale2] = message;
      _context.messages = _messages.value;
    }
    function mergeLocaleMessage(locale2, message) {
      _messages.value[locale2] = _messages.value[locale2] || {};
      const _message = { [locale2]: message };
      if (flatJson) {
        for (const key in _message) {
          if (hasOwn(_message, key)) {
            handleFlatJson(_message[key]);
          }
        }
      }
      message = _message[locale2];
      deepCopy(message, _messages.value[locale2]);
      _context.messages = _messages.value;
    }
    function getDateTimeFormat(locale2) {
      return _datetimeFormats.value[locale2] || {};
    }
    function setDateTimeFormat(locale2, format2) {
      _datetimeFormats.value[locale2] = format2;
      _context.datetimeFormats = _datetimeFormats.value;
      clearDateTimeFormat(_context, locale2, format2);
    }
    function mergeDateTimeFormat(locale2, format2) {
      _datetimeFormats.value[locale2] = assign(_datetimeFormats.value[locale2] || {}, format2);
      _context.datetimeFormats = _datetimeFormats.value;
      clearDateTimeFormat(_context, locale2, format2);
    }
    function getNumberFormat(locale2) {
      return _numberFormats.value[locale2] || {};
    }
    function setNumberFormat(locale2, format2) {
      _numberFormats.value[locale2] = format2;
      _context.numberFormats = _numberFormats.value;
      clearNumberFormat(_context, locale2, format2);
    }
    function mergeNumberFormat(locale2, format2) {
      _numberFormats.value[locale2] = assign(_numberFormats.value[locale2] || {}, format2);
      _context.numberFormats = _numberFormats.value;
      clearNumberFormat(_context, locale2, format2);
    }
    composerID++;
    if (__root && inBrowser) {
      Vue.watch(__root.locale, (val) => {
        if (_inheritLocale) {
          _locale.value = val;
          _context.locale = val;
          updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
        }
      });
      Vue.watch(__root.fallbackLocale, (val) => {
        if (_inheritLocale) {
          _fallbackLocale.value = val;
          _context.fallbackLocale = val;
          updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
        }
      });
    }
    const composer = {
      id: composerID,
      locale,
      fallbackLocale,
      get inheritLocale() {
        return _inheritLocale;
      },
      set inheritLocale(val) {
        _inheritLocale = val;
        if (val && __root) {
          _locale.value = __root.locale.value;
          _fallbackLocale.value = __root.fallbackLocale.value;
          updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
        }
      },
      get availableLocales() {
        return Object.keys(_messages.value).sort();
      },
      messages,
      get modifiers() {
        return _modifiers;
      },
      get pluralRules() {
        return _pluralRules || {};
      },
      get isGlobal() {
        return _isGlobal;
      },
      get missingWarn() {
        return _missingWarn;
      },
      set missingWarn(val) {
        _missingWarn = val;
        _context.missingWarn = _missingWarn;
      },
      get fallbackWarn() {
        return _fallbackWarn;
      },
      set fallbackWarn(val) {
        _fallbackWarn = val;
        _context.fallbackWarn = _fallbackWarn;
      },
      get fallbackRoot() {
        return _fallbackRoot;
      },
      set fallbackRoot(val) {
        _fallbackRoot = val;
      },
      get fallbackFormat() {
        return _fallbackFormat;
      },
      set fallbackFormat(val) {
        _fallbackFormat = val;
        _context.fallbackFormat = _fallbackFormat;
      },
      get warnHtmlMessage() {
        return _warnHtmlMessage;
      },
      set warnHtmlMessage(val) {
        _warnHtmlMessage = val;
        _context.warnHtmlMessage = val;
      },
      get escapeParameter() {
        return _escapeParameter;
      },
      set escapeParameter(val) {
        _escapeParameter = val;
        _context.escapeParameter = val;
      },
      t: t2,
      getLocaleMessage,
      setLocaleMessage,
      mergeLocaleMessage,
      getPostTranslationHandler,
      setPostTranslationHandler,
      getMissingHandler,
      setMissingHandler,
      [SetPluralRulesSymbol]: setPluralRules
    };
    {
      composer.datetimeFormats = datetimeFormats;
      composer.numberFormats = numberFormats;
      composer.rt = rt;
      composer.te = te;
      composer.tm = tm;
      composer.d = d2;
      composer.n = n;
      composer.getDateTimeFormat = getDateTimeFormat;
      composer.setDateTimeFormat = setDateTimeFormat;
      composer.mergeDateTimeFormat = mergeDateTimeFormat;
      composer.getNumberFormat = getNumberFormat;
      composer.setNumberFormat = setNumberFormat;
      composer.mergeNumberFormat = mergeNumberFormat;
      composer[InejctWithOptionSymbol] = __injectWithOption;
      composer[TranslateVNodeSymbol] = translateVNode;
      composer[DatetimePartsSymbol] = datetimeParts;
      composer[NumberPartsSymbol] = numberParts;
    }
    return composer;
  }
  function convertComposerOptions(options) {
    const locale = isString(options.locale) ? options.locale : DEFAULT_LOCALE;
    const fallbackLocale = isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : locale;
    const missing = isFunction(options.missing) ? options.missing : void 0;
    const missingWarn = isBoolean(options.silentTranslationWarn) || isRegExp(options.silentTranslationWarn) ? !options.silentTranslationWarn : true;
    const fallbackWarn = isBoolean(options.silentFallbackWarn) || isRegExp(options.silentFallbackWarn) ? !options.silentFallbackWarn : true;
    const fallbackRoot = isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
    const fallbackFormat = !!options.formatFallbackMessages;
    const modifiers = isPlainObject(options.modifiers) ? options.modifiers : {};
    const pluralizationRules = options.pluralizationRules;
    const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : void 0;
    const warnHtmlMessage = isString(options.warnHtmlInMessage) ? options.warnHtmlInMessage !== "off" : true;
    const escapeParameter = !!options.escapeParameterHtml;
    const inheritLocale = isBoolean(options.sync) ? options.sync : true;
    let messages = options.messages;
    if (isPlainObject(options.sharedMessages)) {
      const sharedMessages = options.sharedMessages;
      const locales = Object.keys(sharedMessages);
      messages = locales.reduce((messages2, locale2) => {
        const message = messages2[locale2] || (messages2[locale2] = {});
        assign(message, sharedMessages[locale2]);
        return messages2;
      }, messages || {});
    }
    const { __i18n, __root, __injectWithOption } = options;
    const datetimeFormats = options.datetimeFormats;
    const numberFormats = options.numberFormats;
    const flatJson = options.flatJson;
    return {
      locale,
      fallbackLocale,
      messages,
      flatJson,
      datetimeFormats,
      numberFormats,
      missing,
      missingWarn,
      fallbackWarn,
      fallbackRoot,
      fallbackFormat,
      modifiers,
      pluralRules: pluralizationRules,
      postTranslation,
      warnHtmlMessage,
      escapeParameter,
      messageResolver: options.messageResolver,
      inheritLocale,
      __i18n,
      __root,
      __injectWithOption
    };
  }
  function createVueI18n(options = {}) {
    const composer = createComposer(convertComposerOptions(options));
    const { __extender } = options;
    const vueI18n = {
id: composer.id,
get locale() {
        return composer.locale.value;
      },
      set locale(val) {
        composer.locale.value = val;
      },
get fallbackLocale() {
        return composer.fallbackLocale.value;
      },
      set fallbackLocale(val) {
        composer.fallbackLocale.value = val;
      },
get messages() {
        return composer.messages.value;
      },
get datetimeFormats() {
        return composer.datetimeFormats.value;
      },
get numberFormats() {
        return composer.numberFormats.value;
      },
get availableLocales() {
        return composer.availableLocales;
      },
get missing() {
        return composer.getMissingHandler();
      },
      set missing(handler) {
        composer.setMissingHandler(handler);
      },
get silentTranslationWarn() {
        return isBoolean(composer.missingWarn) ? !composer.missingWarn : composer.missingWarn;
      },
      set silentTranslationWarn(val) {
        composer.missingWarn = isBoolean(val) ? !val : val;
      },
get silentFallbackWarn() {
        return isBoolean(composer.fallbackWarn) ? !composer.fallbackWarn : composer.fallbackWarn;
      },
      set silentFallbackWarn(val) {
        composer.fallbackWarn = isBoolean(val) ? !val : val;
      },
get modifiers() {
        return composer.modifiers;
      },
get formatFallbackMessages() {
        return composer.fallbackFormat;
      },
      set formatFallbackMessages(val) {
        composer.fallbackFormat = val;
      },
get postTranslation() {
        return composer.getPostTranslationHandler();
      },
      set postTranslation(handler) {
        composer.setPostTranslationHandler(handler);
      },
get sync() {
        return composer.inheritLocale;
      },
      set sync(val) {
        composer.inheritLocale = val;
      },
get warnHtmlInMessage() {
        return composer.warnHtmlMessage ? "warn" : "off";
      },
      set warnHtmlInMessage(val) {
        composer.warnHtmlMessage = val !== "off";
      },
get escapeParameterHtml() {
        return composer.escapeParameter;
      },
      set escapeParameterHtml(val) {
        composer.escapeParameter = val;
      },
get pluralizationRules() {
        return composer.pluralRules || {};
      },
__composer: composer,
t(...args) {
        return Reflect.apply(composer.t, composer, [...args]);
      },
rt(...args) {
        return Reflect.apply(composer.rt, composer, [...args]);
      },
te(key, locale) {
        return composer.te(key, locale);
      },
tm(key) {
        return composer.tm(key);
      },
getLocaleMessage(locale) {
        return composer.getLocaleMessage(locale);
      },
setLocaleMessage(locale, message) {
        composer.setLocaleMessage(locale, message);
      },
mergeLocaleMessage(locale, message) {
        composer.mergeLocaleMessage(locale, message);
      },
d(...args) {
        return Reflect.apply(composer.d, composer, [...args]);
      },
getDateTimeFormat(locale) {
        return composer.getDateTimeFormat(locale);
      },
setDateTimeFormat(locale, format2) {
        composer.setDateTimeFormat(locale, format2);
      },
mergeDateTimeFormat(locale, format2) {
        composer.mergeDateTimeFormat(locale, format2);
      },
n(...args) {
        return Reflect.apply(composer.n, composer, [...args]);
      },
getNumberFormat(locale) {
        return composer.getNumberFormat(locale);
      },
setNumberFormat(locale, format2) {
        composer.setNumberFormat(locale, format2);
      },
mergeNumberFormat(locale, format2) {
        composer.mergeNumberFormat(locale, format2);
      }
    };
    vueI18n.__extender = __extender;
    return vueI18n;
  }
  function defineMixin(vuei18n, composer, i18n2) {
    return {
      beforeCreate() {
        const instance = getCurrentInstance();
        if (!instance) {
          throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
        }
        const options = this.$options;
        if (options.i18n) {
          const optionsI18n = options.i18n;
          if (options.__i18n) {
            optionsI18n.__i18n = options.__i18n;
          }
          optionsI18n.__root = composer;
          if (this === this.$root) {
            this.$i18n = mergeToGlobal(vuei18n, optionsI18n);
          } else {
            optionsI18n.__injectWithOption = true;
            optionsI18n.__extender = i18n2.__vueI18nExtend;
            this.$i18n = createVueI18n(optionsI18n);
            const _vueI18n = this.$i18n;
            if (_vueI18n.__extender) {
              _vueI18n.__disposer = _vueI18n.__extender(this.$i18n);
            }
          }
        } else if (options.__i18n) {
          if (this === this.$root) {
            this.$i18n = mergeToGlobal(vuei18n, options);
          } else {
            this.$i18n = createVueI18n({
              __i18n: options.__i18n,
              __injectWithOption: true,
              __extender: i18n2.__vueI18nExtend,
              __root: composer
            });
            const _vueI18n = this.$i18n;
            if (_vueI18n.__extender) {
              _vueI18n.__disposer = _vueI18n.__extender(this.$i18n);
            }
          }
        } else {
          this.$i18n = vuei18n;
        }
        if (options.__i18nGlobal) {
          adjustI18nResources(composer, options, options);
        }
        this.$t = (...args) => this.$i18n.t(...args);
        this.$rt = (...args) => this.$i18n.rt(...args);
        this.$te = (key, locale) => this.$i18n.te(key, locale);
        this.$d = (...args) => this.$i18n.d(...args);
        this.$n = (...args) => this.$i18n.n(...args);
        this.$tm = (key) => this.$i18n.tm(key);
        i18n2.__setInstance(instance, this.$i18n);
      },
      mounted() {
      },
      unmounted() {
        const instance = getCurrentInstance();
        if (!instance) {
          throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
        }
        const _vueI18n = this.$i18n;
        delete this.$t;
        delete this.$rt;
        delete this.$te;
        delete this.$d;
        delete this.$n;
        delete this.$tm;
        if (_vueI18n.__disposer) {
          _vueI18n.__disposer();
          delete _vueI18n.__disposer;
          delete _vueI18n.__extender;
        }
        i18n2.__deleteInstance(instance);
        delete this.$i18n;
      }
    };
  }
  function mergeToGlobal(g, options) {
    g.locale = options.locale || g.locale;
    g.fallbackLocale = options.fallbackLocale || g.fallbackLocale;
    g.missing = options.missing || g.missing;
    g.silentTranslationWarn = options.silentTranslationWarn || g.silentFallbackWarn;
    g.silentFallbackWarn = options.silentFallbackWarn || g.silentFallbackWarn;
    g.formatFallbackMessages = options.formatFallbackMessages || g.formatFallbackMessages;
    g.postTranslation = options.postTranslation || g.postTranslation;
    g.warnHtmlInMessage = options.warnHtmlInMessage || g.warnHtmlInMessage;
    g.escapeParameterHtml = options.escapeParameterHtml || g.escapeParameterHtml;
    g.sync = options.sync || g.sync;
    g.__composer[SetPluralRulesSymbol](options.pluralizationRules || g.pluralizationRules);
    const messages = getLocaleMessages(g.locale, {
      messages: options.messages,
      __i18n: options.__i18n
    });
    Object.keys(messages).forEach((locale) => g.mergeLocaleMessage(locale, messages[locale]));
    if (options.datetimeFormats) {
      Object.keys(options.datetimeFormats).forEach((locale) => g.mergeDateTimeFormat(locale, options.datetimeFormats[locale]));
    }
    if (options.numberFormats) {
      Object.keys(options.numberFormats).forEach((locale) => g.mergeNumberFormat(locale, options.numberFormats[locale]));
    }
    return g;
  }
  const baseFormatProps = {
    tag: {
      type: [String, Object]
    },
    locale: {
      type: String
    },
    scope: {
      type: String,
validator: (val) => val === "parent" || val === "global",
      default: "parent"
},
    i18n: {
      type: Object
    }
  };
  function getInterpolateArg({ slots }, keys) {
    if (keys.length === 1 && keys[0] === "default") {
      const ret = slots.default ? slots.default() : [];
      return ret.reduce((slot, current) => {
        return [
          ...slot,
...current.type === Vue.Fragment ? current.children : [current]
        ];
      }, []);
    } else {
      return keys.reduce((arg, key) => {
        const slot = slots[key];
        if (slot) {
          arg[key] = slot();
        }
        return arg;
      }, create());
    }
  }
  function getFragmentableTag() {
    return Vue.Fragment;
  }
  const TranslationImpl = Vue.defineComponent({
name: "i18n-t",
    props: assign({
      keypath: {
        type: String,
        required: true
      },
      plural: {
        type: [Number, String],
        validator: (val) => isNumber(val) || !isNaN(val)
      }
    }, baseFormatProps),

setup(props, context) {
      const { slots, attrs } = context;
      const i18n2 = props.i18n || useI18n({
        useScope: props.scope,
        __useComponent: true
      });
      return () => {
        const keys = Object.keys(slots).filter((key) => key[0] !== "_");
        const options = create();
        if (props.locale) {
          options.locale = props.locale;
        }
        if (props.plural !== void 0) {
          options.plural = isString(props.plural) ? +props.plural : props.plural;
        }
        const arg = getInterpolateArg(context, keys);
        const children = i18n2[TranslateVNodeSymbol](props.keypath, arg, options);
        const assignedAttrs = assign(create(), attrs);
        const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
        return Vue.h(tag, assignedAttrs, children);
      };
    }
  });
  const Translation = TranslationImpl;
  function isVNode(target) {
    return isArray(target) && !isString(target[0]);
  }
  function renderFormatter(props, context, slotKeys, partFormatter) {
    const { slots, attrs } = context;
    return () => {
      const options = { part: true };
      let overrides = create();
      if (props.locale) {
        options.locale = props.locale;
      }
      if (isString(props.format)) {
        options.key = props.format;
      } else if (isObject(props.format)) {
        if (isString(props.format.key)) {
          options.key = props.format.key;
        }
        overrides = Object.keys(props.format).reduce((options2, prop) => {
          return slotKeys.includes(prop) ? assign(create(), options2, { [prop]: props.format[prop] }) : options2;
        }, create());
      }
      const parts = partFormatter(...[props.value, options, overrides]);
      let children = [options.key];
      if (isArray(parts)) {
        children = parts.map((part, index) => {
          const slot = slots[part.type];
          const node = slot ? slot({ [part.type]: part.value, index, parts }) : [part.value];
          if (isVNode(node)) {
            node[0].key = `${part.type}-${index}`;
          }
          return node;
        });
      } else if (isString(parts)) {
        children = [parts];
      }
      const assignedAttrs = assign(create(), attrs);
      const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
      return Vue.h(tag, assignedAttrs, children);
    };
  }
  const NumberFormatImpl = Vue.defineComponent({
name: "i18n-n",
    props: assign({
      value: {
        type: Number,
        required: true
      },
      format: {
        type: [String, Object]
      }
    }, baseFormatProps),

setup(props, context) {
      const i18n2 = props.i18n || useI18n({
        useScope: props.scope,
        __useComponent: true
      });
      return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => (
i18n2[NumberPartsSymbol](...args)
      ));
    }
  });
  const NumberFormat = NumberFormatImpl;
  function getComposer$1(i18n2, instance) {
    const i18nInternal = i18n2;
    if (i18n2.mode === "composition") {
      return i18nInternal.__getInstance(instance) || i18n2.global;
    } else {
      const vueI18n = i18nInternal.__getInstance(instance);
      return vueI18n != null ? vueI18n.__composer : i18n2.global.__composer;
    }
  }
  function vTDirective(i18n2) {
    const _process = (binding) => {
      const { instance, value } = binding;
      if (!instance || !instance.$) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
      }
      const composer = getComposer$1(i18n2, instance.$);
      const parsedValue = parseValue(value);
      return [
        Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]),
        composer
      ];
    };
    const register2 = (el, binding) => {
      const [textContent, composer] = _process(binding);
      if (inBrowser && i18n2.global === composer) {
        el.__i18nWatcher = Vue.watch(composer.locale, () => {
          binding.instance && binding.instance.$forceUpdate();
        });
      }
      el.__composer = composer;
      el.textContent = textContent;
    };
    const unregister2 = (el) => {
      if (inBrowser && el.__i18nWatcher) {
        el.__i18nWatcher();
        el.__i18nWatcher = void 0;
        delete el.__i18nWatcher;
      }
      if (el.__composer) {
        el.__composer = void 0;
        delete el.__composer;
      }
    };
    const update = (el, { value }) => {
      if (el.__composer) {
        const composer = el.__composer;
        const parsedValue = parseValue(value);
        el.textContent = Reflect.apply(composer.t, composer, [
          ...makeParams(parsedValue)
        ]);
      }
    };
    const getSSRProps = (binding) => {
      const [textContent] = _process(binding);
      return { textContent };
    };
    return {
      created: register2,
      unmounted: unregister2,
      beforeUpdate: update,
      getSSRProps
    };
  }
  function parseValue(value) {
    if (isString(value)) {
      return { path: value };
    } else if (isPlainObject(value)) {
      if (!("path" in value)) {
        throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
      }
      return value;
    } else {
      throw createI18nError(I18nErrorCodes.INVALID_VALUE);
    }
  }
  function makeParams(value) {
    const { path, locale, args, choice, plural } = value;
    const options = {};
    const named = args || {};
    if (isString(locale)) {
      options.locale = locale;
    }
    if (isNumber(choice)) {
      options.plural = choice;
    }
    if (isNumber(plural)) {
      options.plural = plural;
    }
    return [path, named, options];
  }
  function apply(app, i18n2, ...options) {
    const pluginOptions = isPlainObject(options[0]) ? options[0] : {};
    const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
    if (globalInstall) {
      [Translation.name, "I18nT"].forEach((name) => app.component(name, Translation));
      [NumberFormat.name, "I18nN"].forEach((name) => app.component(name, NumberFormat));
      [DatetimeFormat.name, "I18nD"].forEach((name) => app.component(name, DatetimeFormat));
    }
    {
      app.directive("t", vTDirective(i18n2));
    }
  }
  const I18nInjectionKey = makeSymbol("global-vue-i18n");
  function createI18n(options = {}) {
    const __legacyMode = __VUE_I18N_LEGACY_API__ && isBoolean(options.legacy) ? options.legacy : __VUE_I18N_LEGACY_API__;
    const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
    const __instances = new Map();
    const [globalScope, __global] = createGlobal(options, __legacyMode);
    const symbol = makeSymbol("");
    function __getInstance(component) {
      return __instances.get(component) || null;
    }
    function __setInstance(component, instance) {
      __instances.set(component, instance);
    }
    function __deleteInstance(component) {
      __instances.delete(component);
    }
    const i18n2 = {
get mode() {
        return __VUE_I18N_LEGACY_API__ && __legacyMode ? "legacy" : "composition";
      },
async install(app, ...options2) {
        app.__VUE_I18N_SYMBOL__ = symbol;
        app.provide(app.__VUE_I18N_SYMBOL__, i18n2);
        if (isPlainObject(options2[0])) {
          const opts = options2[0];
          i18n2.__composerExtend = opts.__composerExtend;
          i18n2.__vueI18nExtend = opts.__vueI18nExtend;
        }
        let globalReleaseHandler = null;
        if (!__legacyMode && __globalInjection) {
          globalReleaseHandler = injectGlobalFields(app, i18n2.global);
        }
        if (__VUE_I18N_FULL_INSTALL__) {
          apply(app, i18n2, ...options2);
        }
        if (__VUE_I18N_LEGACY_API__ && __legacyMode) {
          app.mixin(defineMixin(__global, __global.__composer, i18n2));
        }
        const unmountApp = app.unmount;
        app.unmount = () => {
          globalReleaseHandler && globalReleaseHandler();
          i18n2.dispose();
          unmountApp();
        };
      },
get global() {
        return __global;
      },
      dispose() {
        globalScope.stop();
      },
__instances,
__getInstance,
__setInstance,
__deleteInstance
    };
    return i18n2;
  }
  function useI18n(options = {}) {
    const instance = getCurrentInstance();
    if (instance == null) {
      throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
    }
    if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
      throw createI18nError(I18nErrorCodes.NOT_INSTALLED);
    }
    const i18n2 = getI18nInstance(instance);
    const gl = getGlobalComposer(i18n2);
    const componentOptions = getComponentOptions(instance);
    const scope = getScope(options, componentOptions);
    if (scope === "global") {
      adjustI18nResources(gl, options, componentOptions);
      return gl;
    }
    if (scope === "parent") {
      let composer2 = getComposer(i18n2, instance, options.__useComponent);
      if (composer2 == null) {
        composer2 = gl;
      }
      return composer2;
    }
    const i18nInternal = i18n2;
    let composer = i18nInternal.__getInstance(instance);
    if (composer == null) {
      const composerOptions = assign({}, options);
      if ("__i18n" in componentOptions) {
        composerOptions.__i18n = componentOptions.__i18n;
      }
      if (gl) {
        composerOptions.__root = gl;
      }
      composer = createComposer(composerOptions);
      if (i18nInternal.__composerExtend) {
        composer[DisposeSymbol] = i18nInternal.__composerExtend(composer);
      }
      setupLifeCycle(i18nInternal, instance, composer);
      i18nInternal.__setInstance(instance, composer);
    }
    return composer;
  }
  function createGlobal(options, legacyMode) {
    const scope = Vue.effectScope();
    const obj = __VUE_I18N_LEGACY_API__ && legacyMode ? scope.run(() => createVueI18n(options)) : scope.run(() => createComposer(options));
    if (obj == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    return [scope, obj];
  }
  function getI18nInstance(instance) {
    const i18n2 = Vue.inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
    if (!i18n2) {
      throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE);
    }
    return i18n2;
  }
  function getScope(options, componentOptions) {
    return isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
  }
  function getGlobalComposer(i18n2) {
    return i18n2.mode === "composition" ? i18n2.global : i18n2.global.__composer;
  }
  function getComposer(i18n2, target, useComponent = false) {
    let composer = null;
    const root = target.root;
    let current = getParentComponentInstance(target, useComponent);
    while (current != null) {
      const i18nInternal = i18n2;
      if (i18n2.mode === "composition") {
        composer = i18nInternal.__getInstance(current);
      } else {
        if (__VUE_I18N_LEGACY_API__) {
          const vueI18n = i18nInternal.__getInstance(current);
          if (vueI18n != null) {
            composer = vueI18n.__composer;
            if (useComponent && composer && !composer[InejctWithOptionSymbol]) {
              composer = null;
            }
          }
        }
      }
      if (composer != null) {
        break;
      }
      if (root === current) {
        break;
      }
      current = current.parent;
    }
    return composer;
  }
  function getParentComponentInstance(target, useComponent = false) {
    if (target == null) {
      return null;
    }
    return !useComponent ? target.parent : target.vnode.ctx || target.parent;
  }
  function setupLifeCycle(i18n2, target, composer) {
    Vue.onMounted(() => {
    }, target);
    Vue.onUnmounted(() => {
      const _composer = composer;
      i18n2.__deleteInstance(target);
      const dispose = _composer[DisposeSymbol];
      if (dispose) {
        dispose();
        delete _composer[DisposeSymbol];
      }
    }, target);
  }
  const globalExportProps = [
    "locale",
    "fallbackLocale",
    "availableLocales"
  ];
  const globalExportMethods = ["t", "rt", "d", "n", "tm", "te"];
  function injectGlobalFields(app, composer) {
    const i18n2 = Object.create(null);
    globalExportProps.forEach((prop) => {
      const desc = Object.getOwnPropertyDescriptor(composer, prop);
      if (!desc) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
      }
      const wrap = Vue.isRef(desc.value) ? {
        get() {
          return desc.value.value;
        },
set(val) {
          desc.value.value = val;
        }
      } : {
        get() {
          return desc.get && desc.get();
        }
      };
      Object.defineProperty(i18n2, prop, wrap);
    });
    app.config.globalProperties.$i18n = i18n2;
    globalExportMethods.forEach((method) => {
      const desc = Object.getOwnPropertyDescriptor(composer, method);
      if (!desc || !desc.value) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
      }
      Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
    });
    const dispose = () => {
      delete app.config.globalProperties.$i18n;
      globalExportMethods.forEach((method) => {
        delete app.config.globalProperties[`$${method}`];
      });
    };
    return dispose;
  }
  const DatetimeFormatImpl = Vue.defineComponent({
name: "i18n-d",
    props: assign({
      value: {
        type: [Number, Date],
        required: true
      },
      format: {
        type: [String, Object]
      }
    }, baseFormatProps),

setup(props, context) {
      const i18n2 = props.i18n || useI18n({
        useScope: props.scope,
        __useComponent: true
      });
      return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => (
i18n2[DatetimePartsSymbol](...args)
      ));
    }
  });
  const DatetimeFormat = DatetimeFormatImpl;
  {
    initFeatureFlags();
  }
  registerMessageCompiler(compile);
  registerMessageResolver(resolveValue);
  registerLocaleFallbacker(fallbackWithLocaleChain);
  if (__INTLIFY_PROD_DEVTOOLS__) {
    const target = getGlobalThis();
    target.__INTLIFY__ = true;
    setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
  }
  const button$2 = { "jump": "跳转到Kemono", "loading": "加载中...", "error": "发生了错误" };
  const menu$2 = { "newtab": { "true": "[✔] 在新标签页中打开", "false": "[-] 在新标签页中打开", "title": "跳转到Kemono时，是新建标签页打开Kemono页面，还是直接将当前标签页跳转到Kemono页面" }, "domain": { "label": "Kemono域名: {domain}", "prompt": "请设置希望跳转的kemono域名：" } };
  const zhHans = {
    button: button$2,
    menu: menu$2
  };
  const button$1 = { "jump": "跳轉到Kemono", "loading": "載入中...", "error": "發生了錯誤" };
  const menu$1 = { "newtab": { "true": "[✔] 在新標籤頁中打開", "false": "[-] 在新標籤頁中打開", "title": "跳轉到Kemono時，是新增標籤頁打開Kemono頁面，還是直接將目前標籤頁跳轉到Kemono頁面" }, "domain": { "label": "Kemono域名: {domain}", "prompt": "請設定希望跳轉的kemono網域：" } };
  const zhHant = {
    button: button$1,
    menu: menu$1
  };
  const button = { "jump": "Open in Kemono", "loading": "loading...", "error": "something went wrong" };
  const menu = { "newtab": { "true": "[✔] Open in new tab", "false": "[-] Open in new tab", "title": "Open the Kemono page in a new tab or directly redirect the current tab to the Kemono page" }, "domain": { "label": "Kemono domain: {domain}", "prompt": "Please set the desired Kemono domain to redirect to:" } };
  const en = {
    button,
    menu
  };
  const i18n = createI18n({
    legacy: false,
    locale: navigator.language,
    fallbackLocale: "en",
    messages: {
      "zh": zhHant,
      "zh-CN": zhHans,
      "zh-Hans": zhHans,
      "en": en
    }
  });
  const storage = new UserscriptStorage(
    { GM_addValueChangeListener: _GM_addValueChangeListener, GM_deleteValue: _GM_deleteValue, GM_getValue: _GM_getValue, GM_listValues: _GM_listValues, GM_setValue: _GM_setValue },
    {
      newtab: true,
      domain: "kemono.cr"
    }
  );
  let domain = storage.get("domain");
  storage.watch("domain", (_, __, newValue, ___) => domain = newValue || "kemono.cr");
  const systemDark = (function() {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeQuery.addEventListener("change", (e) => systemDark.value = e.matches);
    return Vue.ref(darkModeQuery.matches);
  })();
  function defineWebsite(website2) {
    return website2;
  }
  const pixiv = defineWebsite({
    checker: {
      type: "endhost",
      value: "pixiv.net"
    },
    pages: {
      users: {
        checker: {
          type: "regpath",
          value: /^\/users\/\d+/
        },
        url() {
          const userID = location.pathname.match(/^\/users\/(\d+)/)[1];
          return `https://${domain}/fanbox/user/${userID}`;
        }
      },
      artworks: {
        checker: {
          type: "regpath",
          value: /^\/artworks\/\d+/
        },
        async url() {
          const str_id = location.pathname.match(/^\/artworks\/(\d+)/)[1];
          const json = await requestJson({
            method: "GET",
            url: `https://www.pixiv.net/ajax/illust/${str_id}`
          });
          const userID = json.body.userId;
          return `https://${domain}/fanbox/user/${userID}`;
        }
      },
      novel: {
        checker: {
          type: "path",
          value: "/novel/show.php"
        },
        async url() {
          const str_id = getSearchParam("id");
          const json = await requestJson({
            method: "GET",
            url: `https://www.pixiv.net/ajax/novel/${str_id}`
          });
          const userID = json.body.userId;
          return `https://${domain}/fanbox/user/${userID}`;
        }
      },
      series: {
        checker: {
          type: "regpath",
          value: /^\/novel\/series\/\d+$/
        },
        async url() {
          const str_id = location.pathname.match(/^\/novel\/series\/(\d+)$/)[1];
          const json = await requestJson({
            method: "GET",
            url: `https://www.pixiv.net/ajax/novel/series/${str_id}`
          });
          const userID = json.body.userId;
          return `https://${domain}/fanbox/user/${userID}`;
        }
      }
    },
    theme: Vue.ref("light"),
    enter() {
      const html = document.querySelector("html");
      const updateDark = () => {
        this.theme.value = Object.hasOwn(html.dataset, "theme") ? html.dataset.theme : null;
      };
      const observer = this.context.observer = new MutationObserver(updateDark);
      observer.observe(html, {
        attributes: true,
        attributeFilter: ["data-theme"]
      });
      updateDark();
    },
    leave() {
      this.context.observer?.disconnect();
      this.context.observer = null;
    },
    context: {
      observer: null
    }
  });
  const fantia = defineWebsite({
    checker: {
      type: "endhost",
      value: "fantia.jp"
    },
    pages: {
      fanclubs: {
        checker: {
          type: "regpath",
          value: /^\/fanclubs\/\d+\/?/
        },
        url() {
          const userID = location.pathname.match(/^\/fanclubs\/(\d+)\/?/)[1];
          return `https://${domain}/fantia/user/${userID}`;
        }
      },
      posts: {
        checker: {
          type: "regpath",
          value: /^\/posts\/\d+\/?/
        },
        async url() {
          const postID = location.pathname.match(/^\/posts\/(\d+)\/?/)[1];
          const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
          const data = await requestJson({
            method: "GET",
            url: `https://fantia.jp/api/v1/posts/${postID}`,
            headers: {
              referer: location.href,
              "x-csrf-token": csrfToken,
              "x-requested-with": "XMLHttpRequest"
            }
          });
          const userID = data.post.fanclub.id;
          return `https://${domain}/fantia/user/${userID}/post/${postID}`;
        }
      }
    },
    theme: Vue.ref("light")
  });
  const subscribestar = defineWebsite({
    checker: {
      type: "reghost",
      value: /^(www\.)?subscribestar\.(com|adult)/
    },
    pages: {
      user: {
        mode: "and",
        checker: {
          type: "func",
          value: () => location.pathname.length > 1
        },
        url() {
          const userID = location.pathname.substring(1).split("/", 1)[0];
          return `https://${domain}/subscribestar/user/${userID}`;
        }
      }
    },
    theme: Vue.ref(systemDark.value ? "dark" : "light"),
    enter() {
      const html = document.querySelector("html");
      const updateDark = () => {
        this.theme.value = Object.hasOwn(html.dataset, "theme") ? html.dataset.theme : systemDark.value ? "dark" : "light";
      };
      const observer = this.context.observer = new MutationObserver(updateDark);
      observer.observe(html, {
        attributes: true,
        attributeFilter: ["data-theme"]
      });
      updateDark();
    },
    leave() {
      this.context.observer?.disconnect();
      this.context.observer = null;
    },
    context: {
      observer: null
    }
  });
  const dlsite = defineWebsite({
    checker: {
      type: "endhost",
      value: "dlsite.com"
    },
    pages: {
      makerid: {
        checker: {
          type: "regpath",
          value: /^\/home\/circle\/profile\/=\/maker_id\/RG\d+(\.html)?(\/|$)/
        },
        url() {
          const userID = location.pathname.match(/^\/home\/circle\/profile\/=\/maker_id\/(RG\d+)(\.html)?(\/|$)/)[1];
          return `https://${domain}/dlsite/user/${userID}`;
        }
      }
    },
    theme: Vue.ref("light")
  });
  const fanbox = defineWebsite({
    checker: {
      type: "endhost",
      value: "fanbox.cc"
    },
    theme: Vue.ref("light"),
    pages: {
      creator: {
        mode: "or",
        checker: [{
          type: "path",
          value: "/"
        }, {
          type: "path",
          value: "/posts"
        }, {
          type: "path",
          value: "/plans"
        }, {
          type: "startpath",
          value: "/posts/"
        }],
        async url() {
          const userName = location.hostname.split(".", 1)[0];
          const response = await fetch(`https://api.fanbox.cc/creator.get?creatorId=${userName}`, {
            method: "GET",
            headers: {
              accept: "application/json, text/plain, */*"
            }
          });
          const data = await response.json();
          const userID = data.body.user.userId;
          return `https://${domain}/fanbox/user/${userID}`;
        }
      }
    }
  });
  const patreon = defineWebsite({
    checker: {
      type: "endhost",
      value: "patreon.com"
    },
    pages: {
post: {
        checker: {
          type: "regpath",
          value: /^\/posts\/[^\/\d]*\d+$/
        },
        url() {
          const dataElm = document.querySelector("#__NEXT_DATA__");
          if (!dataElm) throw new Error("#__NEXT_DATA__ not found");
          const data = JSON.parse(dataElm.innerHTML);
          const pageBootstrap = data.props.pageProps.bootstrapEnvelope.pageBootstrap;
          const items = [
            ...pageBootstrap.post ? pageBootstrap.post.included : [],
            ...pageBootstrap.campaign ? pageBootstrap.campaign.included : []
          ];
          const userID = items.find((o) => o.type === "user")?.id;
          if (!userID) throw new Error("cannot get patreon userID");
          const postID = location.pathname.match(/^\/posts\/[^\/\d]*(\d+)$/)[1];
          return `https://${domain}/patreon/user/${userID}/post/${postID}`;
        }
      },
general: {
        checker: {
          type: "func",
          value: () => {
            const hasElement = (selector) => !!document.querySelector(selector);
            const hasDataTag = (tag) => hasElement(`[data-tag="${tag}"]`);
            return hasElement("#__NEXT_DATA__") && [
              "creator-become-a-patron-button",
"creator-header-see-membership-options",
"collections-share-button"
].some((tag) => hasDataTag(tag));
          }
        },
        url() {
          const dataElm = document.querySelector("#__NEXT_DATA__");
          if (!dataElm) throw new Error("#__NEXT_DATA__ not found");
          const data = JSON.parse(dataElm.innerHTML);
          const pageBootstrap = data.props.pageProps.bootstrapEnvelope.pageBootstrap;
          const items = [
            ...pageBootstrap.post ? pageBootstrap.post.included : [],
            ...pageBootstrap.campaign ? pageBootstrap.campaign.included : []
          ];
          const userID = items.find((o) => o.type === "user")?.id;
          if (!userID) throw new Error("cannot get patreon userID");
          return `https://${domain}/patreon/user/${userID}`;
        }
      }
    },
    theme: Vue.ref("light")
  });
  const boosty = defineWebsite({
    mode: "and",
    checker: [{
      type: "endhost",
      value: "boosty.to"
    }, {
type: "startpath",
      value: "/app/",
      invert: true
    }, {
type: "path",
      value: "/",
      invert: true
    }],
    pages: {
post: {
        checker: {
          type: "regpath",
          value: /^\/[^\/]+\/posts\/[0-9a-f\-]+\/?$/
        },
        url() {
          const match = location.pathname.match(/^\/([^\/]+)\/posts\/([0-9a-f\-]+)\/?$/);
          const userID = match[1];
          const postID = match[2];
          return `https://${domain}/boosty/user/${userID}/post/${postID}`;
        }
      },
general: {
        checker: {
          type: "switch",
          value: true
        },
        url() {
          const userID = location.pathname.substring(1).split("/", 1)[0];
          return `https://${domain}/boosty/user/${userID}`;
        }
      }
    },
    theme: Vue.ref("light")
  });
  const body = await( detectDom("body"));
  const gumroad = defineWebsite({
    mode: "and",
    checker: [{
      type: "endhost",
      value: "gumroad.com"
    }, {
type: "host",
      value: "gumroad.com",
      invert: true
    }, {
type: "host",
      value: "www.gumroad.com",
      invert: true
    }],
    pages: {
post: {
        checker: {
          type: "startpath",
          value: "/l/"
        },
        url() {
          const data = JSON.parse(document.querySelector('.js-react-on-rails-component[data-component-name="ProfileProductPage"]')?.innerHTML ?? "{}");
          const userID = data?.creator_profile?.external_id;
          const postID = data?.product?.permalink;
          if ((userID ?? postID ?? null) === null) {
            logger.simple("Error", "cannot get userID or postID");
            throw new Error("gumroad.url: cannot get userID or postID");
          }
          return `https://${domain}/gumroad/user/${userID}/post/${postID}`;
        }
      },
general: {
        checker: {
          type: "switch",
          value: true
        },
        url() {
          const userID = JSON.parse(document.querySelector('.js-react-on-rails-component[data-component-name="Profile"]')?.innerHTML ?? "{}")?.creator_profile?.external_id ?? null;
          if (!userID) {
            logger.simple("Error", "cannot get userID");
            throw new Error("gumroad.url: cannot get userID");
          }
          return `https://${domain}/gumroad/user/${userID}`;
        }
      }
    },
theme: Vue.ref("gumroad"),
get themes() {
      const pageFG = getComputedStyle(body).color;
      const pageBG = getComputedStyle(body).backgroundColor;
      const fg = pageFG;
      const bg = generateTransitionColor(pageFG, pageBG, 0.05);
      const border = generateTransitionColor(pageFG, pageBG, 0.2);
      return {
        gumroad: (
`
                .oik-root[data-theme="gumroad"] {
                    --color-text: ${fg};      /* 前景色 */
                    --color-bg: ${bg};        /* 深色背景 */
                    --color-border: ${border};    /* 边框色 */
                }
            `
        )
      };
    }
  });
  function generateTransitionColor(targetColor, startColor, transitionRatio = 0.1) {
    const parseRgbaColor = (colorStr) => {
      const rgbaPattern = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+)\s*)?\)/i;
      const matches2 = colorStr.match(rgbaPattern);
      if (!matches2) {
        return { r: 0, g: 0, b: 0, a: 1 };
      }
      const r = Math.min(255, Math.max(0, parseInt(matches2[1], 10)));
      const g = Math.min(255, Math.max(0, parseInt(matches2[2], 10)));
      const b = Math.min(255, Math.max(0, parseInt(matches2[3], 10)));
      const a2 = matches2[4] ? Math.min(1, Math.max(0, parseFloat(matches2[4]))) : 1;
      return { r, g, b, a: a2 };
    };
    try {
      const targetRgba = parseRgbaColor(targetColor);
      const startRgba = parseRgbaColor(startColor);
      const newR = Math.round(startRgba.r + (targetRgba.r - startRgba.r) * transitionRatio);
      const newG = Math.round(startRgba.g + (targetRgba.g - startRgba.g) * transitionRatio);
      const newB = Math.round(startRgba.b + (targetRgba.b - startRgba.b) * transitionRatio);
      const newA = parseFloat((startRgba.a + (targetRgba.a - startRgba.a) * transitionRatio).toFixed(2));
      return `rgba(${newR}, ${newG}, ${newB}, ${newA})`;
    } catch (error) {
      logger.simple("Error", "颜色解析或计算失败，使用默认过渡色:");
      logger.log("Error", "raw", "error", error);
      return "rgba(240, 240, 240, 0.9)";
    }
  }
  const rules = Object.freeze( Object.defineProperty({
    __proto__: null,
    boosty,
    dlsite,
    fanbox,
    fantia,
    gumroad,
    patreon,
    pixiv,
    subscribestar
  }, Symbol.toStringTag, { value: "Module" }));
  const defaultCss = ".oik-root{--color-text: #1a1a1a;--color-bg: #ffffff;--color-primary: #2563eb;--color-secondary: #f3f4f6;--color-border: #e5e7eb}";
  var a;
  const d = (b) => (a = document.createElement("style"), a.append(b), a);
  const defaultTheme = d(defaultCss);
  const darkCss = ".oik-root[data-theme=dark]{--color-text: #f9fafb;--color-bg: #1f1f1f;--color-primary: #60a5fa;--color-secondary: #1f2937;--color-border: #374151}";
  const dark = d(darkCss);
  const lightCss = ".oik-root[data-theme=light]{--color-text: #1a1a1a;--color-bg: #ffffff;--color-primary: #2563eb;--color-secondary: #f3f4f6;--color-border: #e5e7eb}";
  const light = d(lightCss);
  const styling = new UserscriptStyling();
  const load = () => {
    {
      const importedStyles2 = window._oikStyles;
      importedStyles2.forEach((css, i) => styling.setStyle(`__imported[${i}]__`, css));
    }
  };
  document.readyState === "loading" ? addEventListener.call(document, "DOMContentLoaded", load, { once: true }) : load();
  const importedStyles = { defaultTheme, dark, light };
  const themes = Object.entries(importedStyles).reduce(
    (obj, [id, style]) => Object.assign(obj, { [id]: style.innerHTML }),
    {}
  );
  Object.entries(themes).forEach(([id, css]) => register(id, css));
  function register(id, css) {
    themes[id] = css;
    styling.setStyle(`theme-${id}`, css);
  }
  function unregister(id) {
    delete themes[id];
    styling.deleteStyle(`theme-${id}`);
  }
  const locate = () => {
    for (const [websiteName2, website2] of Object.entries(rules)) {
      if (website2.checker && !testChecker(website2.checker, website2.mode ?? "or")) continue;
      for (const [pageName2, page2] of Object.entries(website2.pages)) {
        if (testChecker(page2.checker, page2.mode ?? "or")) {
          return { website: website2, page: page2, websiteName: websiteName2, pageName: pageName2 };
        }
      }
    }
    return { website: null, page: null, websiteName: "unknown", pageName: "unknown" };
  };
  const location$1 = locate();
  const website = Vue.ref(location$1.website);
  const page = Vue.ref(location$1.page);
  const websiteName = Vue.ref(location$1.websiteName);
  const pageName = Vue.ref(location$1.pageName);
  logger.simple("Detail", `Initial location: ${websiteName.value} / ${pageName.value}`);
  const urlMonitor = new URLChangeMonitor();
  urlMonitor.init();
  urlMonitor.onUrlChange(() => {
    const location2 = locate();
    website.value = location2.website;
    page.value = location2.page;
    websiteName.value = location2.websiteName;
    pageName.value = location2.pageName;
    logger.simple("Detail", `Updated location: ${websiteName.value} / ${pageName.value}`);
  });
  Vue.watch(website, (newWebsite, oldWebsite) => {
    const o = Vue.toRaw(oldWebsite);
    const n = Vue.toRaw(newWebsite);
    o?.leave?.();
    n?.enter?.();
    Object.hasOwn(o ?? {}, "themes") && Object.keys(o.themes).forEach((id) => unregister(id));
    Object.hasOwn(n ?? {}, "themes") && Object.entries(n.themes).forEach(([id, css]) => register(id, css));
  }, {
    immediate: true
  });
  Vue.watch(page, (newPage, oldPage) => {
    const o = Vue.toRaw(oldPage);
    const n = Vue.toRaw(newPage);
    o?.leave?.();
    n?.enter?.();
    Object.hasOwn(o ?? {}, "themes") && Object.keys(o.themes).forEach((id) => unregister(id));
    Object.hasOwn(n ?? {}, "themes") && Object.entries(n.themes).forEach(([id, css]) => register(id, css));
  }, {
    immediate: true
  });
  const _hoisted_1 = ["data-theme"];
  const _sfc_main = Vue.defineComponent({
    __name: "App",
    setup(__props) {
      const { t: t2 } = useI18n();
      const loading = Vue.ref(false);
      const error = Vue.ref(false);
      const theme = Vue.computed(() => {
        return page.value?.theme ?? website.value?.theme ?? false;
      });
      async function doJump() {
        if (loading.value) return;
        if (!website.value || !page.value) return;
        loading.value = true;
        let url;
        try {
          url = await Promise.resolve(page.value.url());
          error.value = false;
        } catch (err) {
          logger.simple("Error", "error while getting url");
          logger.log("Error", "raw", "error", err);
          loading.value = false;
          error.value = true;
          return;
        }
        if (storage.get("newtab")) {
          _GM_openInTab(url, {
            active: true,
            insert: true,
            setParent: true
          });
        } else {
          location.assign(url);
        }
        loading.value = false;
      }
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("div", {
          class: "oik-root",
          "data-theme": theme.value
        }, [
          Vue.withDirectives(Vue.createElementVNode("div", {
            class: Vue.normalizeClass(["oik-jump-button", { ["oik-disabled"]: loading.value }]),
            onClick: doJump
          }, Vue.toDisplayString(loading.value ? Vue.unref(t2)("button.loading") : error.value ? Vue.unref(t2)("button.error") : Vue.unref(t2)("button.jump")), 3), [
            [Vue.vShow, Vue.unref(page)]
          ])
        ], 8, _hoisted_1);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const JumpButton = _export_sfc(_sfc_main, [["__scopeId", "data-v-f9e475ed"]]);
  const t = i18n.global.t;
  Vue.createApp(JumpButton).use(i18n).mount(
    (() => {
      const container = document.createElement("div");
      const shadowroot = container.attachShadow({ mode: "open" });
      const app = document.createElement("div");
      app.style.cssText = "position: fixed; right: 0; bottom: 0; padding: 0; margin: 0; border: 0; z-index: 10000;";
      styling.applyTo(shadowroot);
      shadowroot.append(app);
      detectDom("body").then((body2) => body2.append(container));
      return app;
    })()
  );
  let newtabMenuId;
  const registerNewTabMenu = () => newtabMenuId = _GM_registerMenuCommand(
    storage.get("newtab") ? t("menu.newtab.true") : t("menu.newtab.false"),
    () => storage.set("newtab", !storage.get("newtab")),
    {
      id: newtabMenuId,
      autoClose: false,
      title: t("menu.newtab.title")
    }
  );
  registerNewTabMenu();
  storage.watch("newtab", () => registerNewTabMenu());
  let domainMenuId;
  const registerDomainMenu = () => domainMenuId = _GM_registerMenuCommand(
    t("menu.domain.label", { domain: storage.get("domain") }),
    () => {
      const domain2 = prompt(t("menu.domain.prompt"), storage.get("domain"));
      domain2 === "" ? storage.delete("domain") : domain2 && storage.set("domain", domain2);
    },
    {
      id: domainMenuId,
      autoClose: false,
      title: t("menu.domain.label")
    }
  );
  registerDomainMenu();
  storage.watch("domain", () => registerDomainMenu());

})(Vue);