// ==UserScript==
// @name       极简翻译（英译中）
// @namespace  npm/my-xfc
// @version    1.0.0
// @icon       https://vitejs.dev/logo.svg
// @match      *://*/*
// @require    https://cdn.jsdelivr.net/npm/vue@3.5.25/dist/vue.global.prod.js
// @grant      GM.xmlHttpRequest
// @grant      GM_addStyle
// @grant      GM_getValue
// @grant      GM_notification
// @grant      GM_openInTab
// @grant      GM_setValue
// @grant      GM_xmlhttpRequest
// @description 一个目前仅支持百度api的翻译检查，一键全文翻译
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558810/%E6%9E%81%E7%AE%80%E7%BF%BB%E8%AF%91%EF%BC%88%E8%8B%B1%E8%AF%91%E4%B8%AD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558810/%E6%9E%81%E7%AE%80%E7%BF%BB%E8%AF%91%EF%BC%88%E8%8B%B1%E8%AF%91%E4%B8%AD%EF%BC%89.meta.js
// ==/UserScript==

(function (vue) {
  "use strict";

  const d = new Set();
  const e = async (e) => {
    d.has(e) ||
      (d.add(e),
      ((t) => {
        typeof GM_addStyle == "function"
          ? GM_addStyle(t)
          : (document.head || document.documentElement)
              .appendChild(document.createElement("style"))
              .append(t);
      })(e));
  };

  e(
    " .xfc-wrapper[data-v-cc4fb020]{position:fixed;bottom:100px;right:20px;z-index:99999;font-family:sans-serif;color:#333}.xfc-wrapper .floating-ball[data-v-cc4fb020]{width:56px;height:56px;background:linear-gradient(135deg,#409eff,#2c82e6);border-radius:50%;box-shadow:0 6px 16px #409eff59;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;font-weight:600;transition:all .3s cubic-bezier(.25,.8,.25,1);-webkit-user-select:none;user-select:none;position:relative;border:2px solid #fff;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.xfc-wrapper .floating-ball[data-v-cc4fb020]:hover{transform:translateY(-2px);box-shadow:0 8px 20px #409eff73}.xfc-wrapper .floating-ball.is-active[data-v-cc4fb020]{background:linear-gradient(135deg,#909399,#606266);cursor:not-allowed;box-shadow:none}.xfc-wrapper .floating-ball.is-disabled[data-v-cc4fb020]{pointer-events:none}.xfc-wrapper .floating-ball.is-disabled .setting-btn[data-v-cc4fb020]{pointer-events:auto}.xfc-wrapper .floating-ball .main-text[data-v-cc4fb020]{font-size:13px;line-height:1.2;text-align:center;max-width:100%;padding:0 2px;word-break:break-all}.xfc-wrapper .floating-ball .setting-btn[data-v-cc4fb020]{position:absolute;top:-2px;right:-2px;width:22px;height:22px;background:#fffffff2;border-radius:50%;color:#409eff;font-size:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px #00000026;z-index:2;transition:transform .3s}.xfc-wrapper .floating-ball .setting-btn[data-v-cc4fb020]:hover{transform:rotate(90deg) scale(1.1)}.xfc-wrapper .panel-container[data-v-cc4fb020]{position:absolute;bottom:60px;right:0;width:250px;background-color:#fff;border-radius:8px;box-shadow:0 4px 12px #00000026;border:1px solid #ebeef5;overflow:hidden;display:flex;flex-direction:column}.xfc-wrapper .panel-container .panel-header[data-v-cc4fb020]{padding:10px 15px;background-color:#f5f7fa;border-bottom:1px solid #ebeef5;display:flex;justify-content:space-between;align-items:center}.xfc-wrapper .panel-container .panel-header h3[data-v-cc4fb020]{margin:0;font-size:16px;color:#303133}.xfc-wrapper .panel-container .panel-header .close-icon[data-v-cc4fb020]{cursor:pointer;font-size:20px;color:#909399}.xfc-wrapper .panel-container .panel-header .close-icon[data-v-cc4fb020]:hover{color:#f56c6c}.xfc-wrapper .panel-container .panel-body[data-v-cc4fb020]{padding:15px;max-height:400px;overflow-y:auto}.xfc-wrapper .panel-container .panel-body .setting-section[data-v-cc4fb020]{margin-bottom:10px}.xfc-wrapper .panel-container .panel-body .setting-section h4[data-v-cc4fb020]{margin:0 0 10px;font-size:14px;color:#333}.xfc-wrapper .panel-container .panel-body .setting-section .input-group[data-v-cc4fb020]{display:flex;align-items:center;margin-bottom:8px}.xfc-wrapper .panel-container .panel-body .setting-section .input-group label[data-v-cc4fb020]{width:50px;font-size:12px;color:#606266}.xfc-wrapper .panel-container .panel-body .setting-section .input-group input[data-v-cc4fb020]{flex:1;height:28px;padding:0 8px;border:1px solid #dcdfe6;border-radius:4px;font-size:12px}.xfc-wrapper .panel-container .panel-body .setting-section .input-group input[data-v-cc4fb020]:focus{border-color:#409eff;outline:none}.xfc-wrapper .panel-container .panel-body .setting-section .save-btn[data-v-cc4fb020]{width:100%;padding:8px 0;background-color:#409eff;color:#fff;border:none;border-radius:4px;font-size:12px;cursor:pointer;transition:background-color .2s}.xfc-wrapper .panel-container .panel-body .setting-section .save-btn[data-v-cc4fb020]:hover{background-color:#66b1ff}.xfc-wrapper .panel-container .panel-body .divider[data-v-cc4fb020]{border:none;border-top:1px solid #ebeef5;margin:10px 0}.xfc-wrapper .panel-container .panel-body .action-list[data-v-cc4fb020]{display:flex;flex-direction:column;gap:10px}.xfc-wrapper .panel-container .panel-body .action-list .action-btn[data-v-cc4fb020]{padding:8px 15px;background-color:#ecf5ff;color:#409eff;border:1px solid #d9ecff;border-radius:4px;cursor:pointer;transition:all .2s}.xfc-wrapper .panel-container .panel-body .action-list .action-btn[data-v-cc4fb020]:hover{background-color:#409eff;color:#fff} "
  );

  var _GM_getValue = (() =>
    typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = (() =>
    typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = (() =>
    typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  class BaseEngine {
    constructor(config = {}) {
      this.config = config;
    }
    async translateBatch(texts, from = "auto", to = "zh-CN") {
      throw new Error("必须实现 translateBatch 方法");
    }
    async translate(text, from, to) {
      const results = await this.translateBatch([text], from, to);
      return results[0];
    }
  }
  function gmFetch(details) {
    console.log("开始请求拉");
    return new Promise((resolve, reject) => {
      console.log("1212");
      if (typeof _GM_xmlhttpRequest !== "undefined") {
        _GM_xmlhttpRequest({
          ...details,
          onload: (res) => resolve(res.responseText),
          onerror: (e) => reject(e),
          ontimeout: (e) => reject(e),
        });
      } else {
        console.log("GM_xmlhttpRequest 不存在");
      }
    });
  }
  function safeAdd(x, y) {
    var lsw = (x & 65535) + (y & 65535);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 65535);
  }
  function bitRotateLeft(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function binlMD5(x, len) {
    x[len >> 5] |= 128 << len % 32;
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var i;
    var olda;
    var oldb;
    var oldc;
    var oldd;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (i = 0; i < x.length; i += 16) {
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;
      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }
  function binl2rstr(input) {
    var i;
    var output = "";
    var length32 = input.length * 32;
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> i % 32) & 255);
    }
    return output;
  }
  function rstr2binl(input) {
    var i;
    var output = [];
    output[(input.length >> 2) - 1] = void 0;
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0;
    }
    var length8 = input.length * 8;
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;
    }
    return output;
  }
  function rstrMD5(s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
  }
  function rstr2hex(input) {
    var hexTab = "0123456789abcdef";
    var output = "";
    var x;
    var i;
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i);
      output += hexTab.charAt((x >>> 4) & 15) + hexTab.charAt(x & 15);
    }
    return output;
  }
  function str2rstrUTF8(input) {
    return unescape(encodeURIComponent(input));
  }
  function rawMD5(s) {
    return rstrMD5(str2rstrUTF8(s));
  }
  function hexMD5(s) {
    return rstr2hex(rawMD5(s));
  }
  function md5(string, key, raw) {
    {
      {
        return hexMD5(string);
      }
    }
  }
  class BaiduEngine extends BaseEngine {
    constructor(config = {}) {
      super(config);
      this.appid = config.appid || "";
      this.appkey = config.appkey || "";
      this.apiUrl = "https://fanyi-api.baidu.com/api/trans/vip/translate";
    }
    async translateBatch(texts, from = "auto", to = "zh-CN") {
      if (!this.appid || !this.appkey) {
        console.warn("Baidu API AppID 或 Key 未配置");
        return texts.map((t) => `[请配置Baidu AppID/Key] ${t}`);
      }
      const q = texts.join("\n");
      const salt = Date.now().toString();
      const signStr = this.appid + q + salt + this.appkey;
      const sign = md5(signStr);
      let targetLang = to;
      if (to === "zh-CN") targetLang = "zh";
      if (to === "ja") targetLang = "jp";
      if (to === "ko") targetLang = "kor";
      let sourceLang = from;
      if (from === "zh-CN") sourceLang = "zh";
      if (from === "ja") sourceLang = "jp";
      if (from === "ko") sourceLang = "kor";
      const bodyParams = new URLSearchParams();
      bodyParams.append("q", q);
      bodyParams.append("from", sourceLang);
      bodyParams.append("to", targetLang);
      bodyParams.append("appid", this.appid);
      bodyParams.append("salt", salt);
      bodyParams.append("sign", sign);
      try {
        const responseText = await gmFetch({
          method: "POST",
          url: this.apiUrl,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: bodyParams.toString(),
        });
        const res = JSON.parse(responseText);
        if (res.error_code) {
          console.error("Baidu API Error:", res.error_code, res.error_msg);
          return texts.map((t) => `[Baidu Error ${res.error_code}] ${t}`);
        }
        if (res.trans_result) {
          if (res.trans_result.length === texts.length) {
            return res.trans_result.map((item) => item.dst);
          }
          return res.trans_result.map((item) => item.dst);
        }
        return texts;
      } catch (e) {
        console.error("Baidu 请求失败", e);
        return texts;
      }
    }
  }
  class NodeManager {
    constructor() {
      this.cache = new WeakMap();
      this.textCache = new Map();
      this.MAX_TEXT_CACHE = 5e3;
    }
    register(node) {
      if (!this.cache.has(node)) {
        const original = node.nodeValue;
        const cachedTranslation = this.textCache.get(original) || null;
        this.cache.set(node, {
          original,
          translated: cachedTranslation,
        });
      }
      return this.cache.get(node);
    }
    updateTranslation(node, translatedText) {
      const data = this.cache.get(node);
      if (data) {
        data.translated = translatedText;
        if (node.nodeValue === data.original) {
          node.nodeValue = translatedText;
        }
        this._updateTextCache(data.original, translatedText);
      }
    }
    _updateTextCache(original, translated) {
      if (this.textCache.size >= this.MAX_TEXT_CACHE) {
        const firstKey = this.textCache.keys().next().value;
        this.textCache.delete(firstKey);
      }
      this.textCache.set(original, translated);
    }
    restoreNode(node) {
      const data = this.cache.get(node);
      if (data && node.nodeValue !== data.original) {
        node.nodeValue = data.original;
      }
    }
  }
  class TranslationScheduler {
    constructor(engine, nodeManager) {
      this.engine = engine;
      this.nodeManager = nodeManager;
      this.queue = new Set();
      this.timer = null;
      this.BATCH_SIZE = 30;
      this.DELAY = 100;
    }
    add(node) {
      const data = this.nodeManager.register(node);
      if (data.translated) {
        if (node.nodeValue !== data.translated) {
          node.nodeValue = data.translated;
        }
        return;
      }
      this.queue.add(node);
      this.scheduleFlush();
    }
    scheduleFlush() {
      if (this.timer) return;
      this.timer = setTimeout(() => this.flush(), this.DELAY);
    }
    async flush() {
      this.timer = null;
      if (this.queue.size === 0) return;
      const nodes = Array.from(this.queue).slice(0, this.BATCH_SIZE);
      nodes.forEach((n) => this.queue.delete(n));
      if (this.queue.size > 0) this.scheduleFlush();
      const texts = nodes.map((n) => this.nodeManager.register(n).original);
      try {
        const results = await this.engine.translateBatch(texts);
        nodes.forEach((node, i) => {
          if (results[i]) {
            this.nodeManager.updateTranslation(node, results[i]);
          }
        });
      } catch (e) {
        console.error("Translation batch failed", e);
      }
    }
  }
  class ViewportObserver {
    constructor(onVisible) {
      this.onVisible = onVisible;
      this.observer = new IntersectionObserver(
        this._handleIntersect.bind(this),
        {
          rootMargin: "200px",
        }
      );
    }
    _handleIntersect(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.onVisible(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }
    observe(element) {
      this.observer.observe(element);
    }
    disconnect() {
      this.observer.disconnect();
    }
  }
  const objConfig = {
    baiduAppId: "",
    baiduKey: "",
  };
  objConfig.baiduAppId = _GM_getValue("baidu_appid", "");
  objConfig.baiduKey = _GM_getValue("baidu_key", "");
  console.log(objConfig);
  const baiduEngine = new BaiduEngine(objConfig);
  class TranslateCore {
    constructor() {
      this.engine = baiduEngine;
      this.nodeManager = new NodeManager();
      this.scheduler = new TranslationScheduler(this.engine, this.nodeManager);
      this.observer = null;
      this.mutationObserver = null;
      this.isActive = false;
    }
    setEngine(engine) {
      this.engine = engine;
      this.scheduler.engine = engine;
    }
    async translate() {
      if (this.isActive) return;
      this.isActive = true;
      this.observer = new ViewportObserver((element) => {
        this._extractTextNodes(element).forEach((node) => {
          this.scheduler.add(node);
        });
      });
      this.mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this._handleNewElement(node);
              }
            });
          }
        }
      });
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      this._scanPage();
    }
    restore() {
      this.isActive = false;
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
      this._restorePage();
    }
    _handleNewElement(element) {
      if (!this._isValidElement(element)) return;
      if (this._hasDirectText(element)) {
        this.observer.observe(element);
      }
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (n) =>
            this._isValidElement(n)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT,
        }
      );
      while (walker.nextNode()) {
        const el = walker.currentNode;
        if (this._hasDirectText(el)) {
          this.observer.observe(el);
        }
      }
    }
    _isValidElement(node) {
      if (
        ["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "TEXTAREA", "INPUT"].includes(
          node.tagName
        )
      )
        return false;
      if (node.closest && node.closest(".xfc-wrapper")) return false;
      return true;
    }
    _scanPage() {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            return this._isValidElement(node)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          },
        }
      );
      while (walker.nextNode()) {
        const element = walker.currentNode;
        if (this._hasDirectText(element)) {
          this.observer.observe(element);
        }
      }
    }
    _restorePage() {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            return this._isValidElement(node)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          },
        }
      );
      while (walker.nextNode()) {
        const element = walker.currentNode;
        const textNodes = this._extractTextNodes(element);
        textNodes.forEach((node) => {
          this.nodeManager.restoreNode(node);
        });
      }
    }
    _hasDirectText(element) {
      for (let child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()) {
          return true;
        }
      }
      return false;
    }
    _extractTextNodes(element) {
      const nodes = [];
      for (let child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()) {
          nodes.push(child);
        }
      }
      return nodes;
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = {
    class: "xfc-wrapper",
    ref: "wrapperRef",
  };
  const _hoisted_2 = { class: "main-text" };
  const _hoisted_3 = { class: "panel-container" };
  const _hoisted_4 = { class: "panel-body" };
  const _hoisted_5 = { class: "setting-section" };
  const _hoisted_6 = { class: "input-group" };
  const _hoisted_7 = { class: "input-group" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const isOpen = vue.ref(false);
      const togglePanel = (e) => {
        e?.stopPropagation();
        isOpen.value = !isOpen.value;
      };
      const statusLabel = vue.ref("翻 译");
      const translateCore = new TranslateCore();
      const baiduAppId = vue.ref("");
      const baiduKey = vue.ref("");
      vue.onMounted(() => {
        baiduAppId.value = _GM_getValue("baidu_appid", "");
        baiduKey.value = _GM_getValue("baidu_key", "");
        if (baiduAppId.value && baiduKey.value) {
          console.log("加载百度翻译配置");
          const engine = new BaiduEngine({
            appid: baiduAppId.value,
            appkey: baiduKey.value,
          });
          translateCore.setEngine(engine);
        }
      });
      const saveSettings = () => {
        _GM_setValue("baidu_appid", baiduAppId.value);
        _GM_setValue("baidu_key", baiduKey.value);
        if (baiduAppId.value && baiduKey.value) {
          const engine = new BaiduEngine({
            appid: baiduAppId.value,
            appkey: baiduKey.value,
          });
          translateCore.setEngine(engine);
          alert("配置已保存，切换为百度翻译引擎");
        } else {
          alert("请填写完整的 AppID 和 密钥");
        }
      };
      const onMainClick = () => {
        if (isOpen.value) return;
        if (statusLabel.value === "翻 译") {
          statusLabel.value = "显示原文";
          translateCore.translate();
        } else {
          statusLabel.value = "翻 译";
          translateCore.restore();
        }
      };
      return (_ctx, _cache) => {
        return (
          vue.openBlock(),
          vue.createElementBlock(
            "div",
            _hoisted_1,
            [
              vue.createElementVNode(
                "div",
                {
                  class: vue.normalizeClass([
                    "floating-ball",
                    { "is-active": isOpen.value, "is-disabled": isOpen.value },
                  ]),
                  onClick: onMainClick,
                },
                [
                  vue.createElementVNode(
                    "span",
                    _hoisted_2,
                    vue.toDisplayString(statusLabel.value),
                    1
                  ),
                  vue.createElementVNode(
                    "div",
                    {
                      class: "setting-btn",
                      onClick: togglePanel,
                      title: "打开菜单",
                    },
                    " ⚙️ "
                  ),
                ],
                2
              ),
              vue.withDirectives(
                vue.createElementVNode(
                  "div",
                  _hoisted_3,
                  [
                    vue.createElementVNode("div", { class: "panel-header" }, [
                      _cache[2] ||
                        (_cache[2] = vue.createElementVNode(
                          "h3",
                          null,
                          "功能菜单",
                          -1
                        )),
                      vue.createElementVNode(
                        "span",
                        {
                          class: "close-icon",
                          onClick: togglePanel,
                        },
                        "×"
                      ),
                    ]),
                    vue.createElementVNode("div", _hoisted_4, [
                      vue.createElementVNode("div", _hoisted_5, [
                        _cache[5] ||
                          (_cache[5] = vue.createElementVNode(
                            "h4",
                            null,
                            "百度翻译设置",
                            -1
                          )),
                        vue.createElementVNode("div", _hoisted_6, [
                          _cache[3] ||
                            (_cache[3] = vue.createElementVNode(
                              "label",
                              null,
                              "AppID",
                              -1
                            )),
                          vue.withDirectives(
                            vue.createElementVNode(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  _cache[0] ||
                                  (_cache[0] = ($event) =>
                                    (baiduAppId.value = $event)),
                                type: "text",
                                placeholder: "请输入 AppID",
                              },
                              null,
                              512
                            ),
                            [[vue.vModelText, baiduAppId.value]]
                          ),
                        ]),
                        vue.createElementVNode("div", _hoisted_7, [
                          _cache[4] ||
                            (_cache[4] = vue.createElementVNode(
                              "label",
                              null,
                              "密钥",
                              -1
                            )),
                          vue.withDirectives(
                            vue.createElementVNode(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  _cache[1] ||
                                  (_cache[1] = ($event) =>
                                    (baiduKey.value = $event)),
                                type: "password",
                                placeholder: "请输入密钥",
                              },
                              null,
                              512
                            ),
                            [[vue.vModelText, baiduKey.value]]
                          ),
                        ]),
                        vue.createElementVNode(
                          "button",
                          {
                            class: "save-btn",
                            onClick: saveSettings,
                          },
                          "保存并应用"
                        ),
                      ]),
                      _cache[6] ||
                        (_cache[6] = vue.createElementVNode(
                          "hr",
                          { class: "divider" },
                          null,
                          -1
                        )),
                      _cache[7] ||
                        (_cache[7] = vue.createElementVNode(
                          "div",
                          { class: "action-list" },
                          null,
                          -1
                        )),
                    ]),
                  ],
                  512
                ),
                [[vue.vShow, isOpen.value]]
              ),
            ],
            512
          )
        );
      };
    },
  };
  const App = _export_sfc(_sfc_main, [["__scopeId", "data-v-cc4fb020"]]);
  const app = vue.createApp(App);
  const div = document.createElement("div");
  div.id = "my-xfc-app";
  document.body.append(div);
  app.mount(div);
  console.log("应用已加载");
  _GM_setValue("test_key", 0);
  console.log(_GM_setValue);
})(Vue);
