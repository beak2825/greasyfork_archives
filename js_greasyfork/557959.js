// ==UserScript==
// @name         ChatGPT-Multimodal-Exporter
// @namespace    chatgpt-multimodal-exporter
// @version      0.7.1
// @author       ha0xin
// @description  导出 ChatGPT 对话 json + 会话中的多模态文件（图片、音频、sandbox 文件等）
// @license      MIT
// @icon         https://chat.openai.com/favicon.ico
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @require      https://cdn.jsdelivr.net/npm/preact@10.28.0/dist/preact.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.9.1/dist/jszip.min.js
// @connect      oaiusercontent.com
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557959/ChatGPT-Multimodal-Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/557959/ChatGPT-Multimodal-Exporter.meta.js
// ==/UserScript==

(function (preact, JSZip) {
  'use strict';

  const d$2=new Set;const importCSS = async e=>{d$2.has(e)||(d$2.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  var _GM_download = (() => typeof GM_download != "undefined" ? GM_download : void 0)();
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const sanitize = (s2) => (s2 || "").replace(/[\\/:*?"<>|]+/g, "_").slice(0, 80);
  const isInlinePointer = (p2) => {
    if (!p2) return false;
    const prefixes = [
      "https://cdn.oaistatic.com/",
      "https://oaidalleapiprodscus.blob.core.windows.net/"
    ];
    return prefixes.some((x2) => p2.startsWith(x2));
  };
  const pointerToFileId = (p2) => {
    if (!p2) return "";
    if (isInlinePointer(p2)) return p2;
    const m2 = p2.match(/file[-_][0-9a-f]+/i);
    return m2 ? m2[0] : p2;
  };
  const fileExtFromMime = (mime) => {
    if (!mime) return "";
    const map = {
      "image/png": ".png",
      "image/jpeg": ".jpg",
      "image/webp": ".webp",
      "image/gif": ".gif",
      "application/pdf": ".pdf",
      "text/plain": ".txt",
      "text/markdown": ".md"
    };
    if (map[mime]) return map[mime];
    if (mime.includes("/")) return `.${mime.split("/")[1]}`;
    return "";
  };
  const formatBytes = (n2) => {
    if (!n2 || isNaN(n2)) return "";
    const units = ["B", "KB", "MB", "GB"];
    let v2 = n2;
    let i2 = 0;
    while (v2 >= 1024 && i2 < units.length - 1) {
      v2 /= 1024;
      i2++;
    }
    return `${v2.toFixed(v2 >= 10 || v2 % 1 === 0 ? 0 : 1)}${units[i2]}`;
  };
  const sleep = (ms) => new Promise((r2) => setTimeout(r2, ms));
  const convId = () => {
    const p2 = location.pathname;
    let m2 = p2.match(/^\/c\/([0-9a-f-]+)$/i);
    if (m2) return m2[1];
    m2 = p2.match(/^\/g\/[^/]+\/c\/([0-9a-f-]+)$/i);
    return m2 ? m2[1] : "";
  };
  const projectId = () => {
    const p2 = location.pathname;
    const m2 = p2.match(/^\/g\/([^/]+)\/c\/[0-9a-f-]+$/i);
    return m2 ? m2[1] : "";
  };
  const isHostOK = () => location.host.endsWith("chatgpt.com") || location.host.endsWith("chat.openai.com");
  const BATCH_CONCURRENCY = 4;
  function saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a2 = document.createElement("a");
    a2.href = url;
    a2.download = filename;
    document.body.appendChild(a2);
    a2.click();
    setTimeout(() => URL.revokeObjectURL(url), 3e3);
    a2.remove();
  }
  function saveJSON(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json"
    });
    saveBlob(blob, filename);
  }
  function gmDownload(url, filename) {
    return new Promise((resolve, reject) => {
      _GM_download({
        url,
        name: filename || "",
        onload: () => resolve(),
        onerror: (err) => reject(err),
        ontimeout: () => reject(new Error("timeout"))
      });
    });
  }
  function parseMimeFromHeaders(raw) {
    if (!raw) return "";
    const m2 = raw.match(/content-type:\s*([^\r\n;]+)/i);
    return m2 ? m2[1].trim() : "";
  }
  function gmFetchBlob(url, headers) {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        url,
        method: "GET",
        headers: headers || {},
        responseType: "arraybuffer",
        onload: (res) => {
          const mime = parseMimeFromHeaders(res.responseHeaders || "") || "";
          const buf = res.response || res.responseText;
          resolve({ blob: new Blob([buf], { type: mime }), mime });
        },
        onerror: (err) => reject(new Error(err && err.error ? err.error : "gm_fetch_error")),
        ontimeout: () => reject(new Error("gm_fetch_timeout"))
      });
    });
  }
  const HAS_EXT_RE = /\.[^./\\]+$/;
  function inferFilename(name, fallbackId, mime) {
    const base = sanitize(name || "") || sanitize(fallbackId || "") || "untitled";
    const ext = fileExtFromMime(mime || "");
    if (!ext || HAS_EXT_RE.test(base)) return base;
    return `${base}${ext}`;
  }
  async function fetchWithRetry(url, options2 = {}, retries = 3, backoff = 1e3) {
    let lastError;
    for (let i2 = 0; i2 <= retries; i2++) {
      try {
        const res = await fetch(url, options2);
        if (res.ok || res.status < 500) {
          return res;
        }
        throw new Error(`HTTP ${res.status}`);
      } catch (e2) {
        lastError = e2;
        if (i2 < retries) {
          await sleep(backoff * Math.pow(2, i2));
        }
      }
    }
    throw lastError;
  }
  const styleCss = ".cgptx-mini-wrap{position:fixed;right:16px;bottom:16px;z-index:2147483647;display:flex;flex-direction:column;align-items:flex-end;gap:8px;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}.cgptx-mini-badge{font-size:12px;padding:4px 8px;border-radius:999px;background:#fff;color:#374151;border:1px solid #e5e7eb;max-width:260px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;box-shadow:0 2px 5px #0000000d}.cgptx-mini-badge.ok{background:#ecfdf5;border-color:#a7f3d0;color:#047857}.cgptx-mini-badge.bad{background:#fef2f2;border-color:#fecaca;color:#b91c1c}.cgptx-mini-btn-row{display:flex;gap:8px}.cgptx-mini-btn{width:48px;height:48px;border-radius:50%;border:1px solid #e5e7eb;cursor:pointer;background:#fff;color:#4b5563;box-shadow:0 4px 12px #00000014;display:flex;align-items:center;justify-content:center;font-size:22px;transition:all .2s ease}.cgptx-mini-btn:hover{transform:translateY(-2px);box-shadow:0 6px 16px #0000001f;color:#2563eb;border-color:#bfdbfe}.cgptx-mini-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}.cgptx-modal{position:fixed;inset:0;background:#00000080;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:2147483647}.cgptx-modal-box{width:min(840px,94vw);max-height:85vh;background:#fff;color:#1f2937;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 20px 50px #0000001a;padding:24px;display:flex;flex-direction:column;gap:16px;overflow:hidden;font-size:14px}.cgptx-modal-header{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:12px;border-bottom:1px solid #f3f4f6}.cgptx-modal-title{font-weight:700;font-size:18px;color:#111827}.cgptx-modal-actions{display:flex;gap:10px;align-items:center}.cgptx-chip{padding:6px 12px;border-radius:8px;border:1px solid #e5e7eb;background:#f9fafb;color:#4b5563;font-size:13px}.cgptx-list{flex:1;overflow:auto;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb}.cgptx-item{display:grid;grid-template-columns:24px 20px 1fr;gap:12px;padding:10px 14px;border-bottom:1px solid #e5e7eb;align-items:center;background:#fff;transition:background .15s}.cgptx-item:hover{background:#f3f4f6}.cgptx-item:last-child{border-bottom:none}.cgptx-item .title{font-weight:500;color:#1f2937;line-height:1.4}.cgptx-group{border-bottom:1px solid #e5e7eb;background:#fff}.cgptx-group:last-child{border-bottom:none}.cgptx-group-header{display:grid;grid-template-columns:24px 20px 1fr auto;align-items:center;gap:10px;padding:10px 14px;background:#f3f4f6;cursor:pointer;-webkit-user-select:none;user-select:none}.cgptx-group-header:hover{background:#e5e7eb}.cgptx-group-list{border-top:1px solid #e5e7eb}.cgptx-arrow{font-size:12px;color:#6b7280;transition:transform .2s}.group-title{font-weight:600;color:#374151}.group-count{color:#6b7280;font-size:12px;background:#e5e7eb;padding:2px 6px;border-radius:4px}.cgptx-item .meta{color:#6b7280;font-size:12px;display:flex;gap:8px;flex-wrap:wrap;margin-top:2px}.cgptx-btn{border:1px solid #d1d5db;background:#fff;color:#374151;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:500;transition:all .15s;box-shadow:0 1px 2px #0000000d}.cgptx-btn:hover{background:#f9fafb;border-color:#9ca3af;color:#111827}.cgptx-btn.primary{background:#3b82f6;border-color:#2563eb;color:#fff;box-shadow:0 2px 4px #3b82f64d}.cgptx-btn.primary:hover{background:#2563eb}.cgptx-btn:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}.cgptx-progress-wrap{display:flex;flex-direction:column;gap:6px;margin-top:4px}.cgptx-progress-track{height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden}.cgptx-progress-bar{height:100%;background:#3b82f6;width:0%;transition:width .3s ease}.cgptx-progress-text{font-size:12px;color:#6b7280;text-align:right}.cgptx-checkbox-wrapper{display:inline-flex;align-items:center;gap:8px;cursor:pointer;-webkit-user-select:none;user-select:none;font-size:14px;color:#374151;transition:color .2s}.cgptx-checkbox-wrapper:hover{color:#111827}.cgptx-checkbox-wrapper.disabled{opacity:.6;cursor:not-allowed}.cgptx-checkbox-input-wrapper{position:relative;width:18px;height:18px;display:flex;align-items:center;justify-content:center}.cgptx-checkbox-input{position:absolute;opacity:0;width:0;height:0;margin:0}.cgptx-checkbox-custom{width:18px;height:18px;border:2px solid #d1d5db;border-radius:4px;background:#fff;transition:all .2s cubic-bezier(.4,0,.2,1);display:flex;align-items:center;justify-content:center}.cgptx-checkbox-wrapper:hover .cgptx-checkbox-custom{border-color:#9ca3af}.cgptx-checkbox-input:focus-visible+.cgptx-checkbox-custom{box-shadow:0 0 0 2px #fff,0 0 0 4px #3b82f6}.cgptx-checkbox-input:checked+.cgptx-checkbox-custom,.cgptx-checkbox-input:indeterminate+.cgptx-checkbox-custom{background:#3b82f6;border-color:#3b82f6}.cgptx-checkbox-icon{width:12px;height:12px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;opacity:0;transform:scale(.5);transition:all .2s cubic-bezier(.4,0,.2,1);position:absolute}.cgptx-checkbox-input:checked+.cgptx-checkbox-custom .cgptx-checkbox-icon.check{opacity:1;transform:scale(1)}.cgptx-checkbox-input:indeterminate+.cgptx-checkbox-custom .cgptx-checkbox-icon.minus{opacity:1;transform:scale(1)}.cgptx-list::-webkit-scrollbar{width:8px;height:8px}.cgptx-list::-webkit-scrollbar-track{background:transparent}.cgptx-list::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:4px}.cgptx-list::-webkit-scrollbar-thumb:hover{background:#9ca3af}.cgptx-mini-badges-col{display:flex;flex-direction:column;gap:4px;margin-bottom:8px;align-items:flex-end}.cgptx-mini-badge.info{background:#e0f2fe;color:#0369a1;border-color:#bae6fd}";
  importCSS(styleCss);
  var f$2 = 0;
  function u$2(e2, t2, n2, o2, i2, u2) {
    t2 || (t2 = {});
    var a2, c2, p2 = t2;
    if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
    var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f$2, __i: -1, __u: 0, __source: i2, __self: u2 };
    if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
    return preact.options.vnode && preact.options.vnode(l2), l2;
  }
  var t$1, r$1, u$1, i$1, o$1 = 0, f$1 = [], c$1 = preact.options, e$1 = c$1.__b, a$1 = c$1.__r, v$1 = c$1.diffed, l$1 = c$1.__c, m$1 = c$1.unmount, s$1 = c$1.__;
  function p$2(n2, t2) {
    c$1.__h && c$1.__h(r$1, n2, o$1 || t2), o$1 = 0;
    var u2 = r$1.__H || (r$1.__H = { __: [], __h: [] });
    return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
  }
  function d$1(n2) {
    return o$1 = 1, h$2(D$1, n2);
  }
  function h$2(n2, u2, i2) {
    var o2 = p$2(t$1++, 2);
    if (o2.t = n2, !o2.__c && (o2.__ = [i2 ? i2(u2) : D$1(void 0, u2), function(n3) {
      var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
      t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
    }], o2.__c = r$1, !r$1.__f)) {
      var f2 = function(n3, t2, r2) {
        if (!o2.__c.__H) return true;
        var u3 = o2.__c.__H.__.filter(function(n4) {
          return !!n4.__c;
        });
        if (u3.every(function(n4) {
          return !n4.__N;
        })) return !c2 || c2.call(this, n3, t2, r2);
        var i3 = o2.__c.props !== n3;
        return u3.forEach(function(n4) {
          if (n4.__N) {
            var t3 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
          }
        }), c2 && c2.call(this, n3, t2, r2) || i3;
      };
      r$1.__f = true;
      var c2 = r$1.shouldComponentUpdate, e2 = r$1.componentWillUpdate;
      r$1.componentWillUpdate = function(n3, t2, r2) {
        if (this.__e) {
          var u3 = c2;
          c2 = void 0, f2(n3, t2, r2), c2 = u3;
        }
        e2 && e2.call(this, n3, t2, r2);
      }, r$1.shouldComponentUpdate = f2;
    }
    return o2.__N || o2.__;
  }
  function y$2(n2, u2) {
    var i2 = p$2(t$1++, 3);
    !c$1.__s && C$1(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r$1.__H.__h.push(i2));
  }
  function _$2(n2, u2) {
    var i2 = p$2(t$1++, 4);
    !c$1.__s && C$1(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r$1.__h.push(i2));
  }
  function A$2(n2) {
    return o$1 = 5, T$1(function() {
      return { current: n2 };
    }, []);
  }
  function F$2(n2, t2, r2) {
    o$1 = 6, _$2(function() {
      if ("function" == typeof n2) {
        var r3 = n2(t2());
        return function() {
          n2(null), r3 && "function" == typeof r3 && r3();
        };
      }
      if (n2) return n2.current = t2(), function() {
        return n2.current = null;
      };
    }, null == r2 ? r2 : r2.concat(n2));
  }
  function T$1(n2, r2) {
    var u2 = p$2(t$1++, 7);
    return C$1(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
  }
  function q$1(n2, t2) {
    return o$1 = 8, T$1(function() {
      return n2;
    }, t2);
  }
  function x$1(n2) {
    var u2 = r$1.context[n2.__c], i2 = p$2(t$1++, 9);
    return i2.c = n2, u2 ? (null == i2.__ && (i2.__ = true, u2.sub(r$1)), u2.props.value) : n2.__;
  }
  function P$1(n2, t2) {
    c$1.useDebugValue && c$1.useDebugValue(t2 ? t2(n2) : n2);
  }
  function g$3() {
    var n2 = p$2(t$1++, 11);
    if (!n2.__) {
      for (var u2 = r$1.__v; null !== u2 && !u2.__m && null !== u2.__; ) u2 = u2.__;
      var i2 = u2.__m || (u2.__m = [0, 0]);
      n2.__ = "P" + i2[0] + "-" + i2[1]++;
    }
    return n2.__;
  }
  function j$1() {
    for (var n2; n2 = f$1.shift(); ) if (n2.__P && n2.__H) try {
      n2.__H.__h.forEach(z$1), n2.__H.__h.forEach(B$1), n2.__H.__h = [];
    } catch (t2) {
      n2.__H.__h = [], c$1.__e(t2, n2.__v);
    }
  }
  c$1.__b = function(n2) {
    r$1 = null, e$1 && e$1(n2);
  }, c$1.__ = function(n2, t2) {
    n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s$1 && s$1(n2, t2);
  }, c$1.__r = function(n2) {
    a$1 && a$1(n2), t$1 = 0;
    var i2 = (r$1 = n2.__c).__H;
    i2 && (u$1 === r$1 ? (i2.__h = [], r$1.__h = [], i2.__.forEach(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
    })) : (i2.__h.forEach(z$1), i2.__h.forEach(B$1), i2.__h = [], t$1 = 0)), u$1 = r$1;
  }, c$1.diffed = function(n2) {
    v$1 && v$1(n2);
    var t2 = n2.__c;
    t2 && t2.__H && (t2.__H.__h.length && (1 !== f$1.push(t2) && i$1 === c$1.requestAnimationFrame || ((i$1 = c$1.requestAnimationFrame) || w$2)(j$1)), t2.__H.__.forEach(function(n3) {
      n3.u && (n3.__H = n3.u), n3.u = void 0;
    })), u$1 = r$1 = null;
  }, c$1.__c = function(n2, t2) {
    t2.some(function(n3) {
      try {
        n3.__h.forEach(z$1), n3.__h = n3.__h.filter(function(n4) {
          return !n4.__ || B$1(n4);
        });
      } catch (r2) {
        t2.some(function(n4) {
          n4.__h && (n4.__h = []);
        }), t2 = [], c$1.__e(r2, n3.__v);
      }
    }), l$1 && l$1(n2, t2);
  }, c$1.unmount = function(n2) {
    m$1 && m$1(n2);
    var t2, r2 = n2.__c;
    r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
      try {
        z$1(n3);
      } catch (n4) {
        t2 = n4;
      }
    }), r2.__H = void 0, t2 && c$1.__e(t2, r2.__v));
  };
  var k$2 = "function" == typeof requestAnimationFrame;
  function w$2(n2) {
    var t2, r2 = function() {
      clearTimeout(u2), k$2 && cancelAnimationFrame(t2), setTimeout(n2);
    }, u2 = setTimeout(r2, 35);
    k$2 && (t2 = requestAnimationFrame(r2));
  }
  function z$1(n2) {
    var t2 = r$1, u2 = n2.__c;
    "function" == typeof u2 && (n2.__c = void 0, u2()), r$1 = t2;
  }
  function B$1(n2) {
    var t2 = r$1;
    n2.__c = n2.__(), r$1 = t2;
  }
  function C$1(n2, t2) {
    return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
      return t3 !== n2[r2];
    });
  }
  function D$1(n2, t2) {
    return "function" == typeof t2 ? t2(n2) : t2;
  }
  const scriptRel = (function detectScriptRel() {
    const relList = typeof document !== "undefined" && document.createElement("link").relList;
    return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
  })();
  const assetsURL = function(dep) {
    return "/" + dep;
  };
  const seen = {};
  const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    if (deps && deps.length > 0) {
      let allSettled = function(promises$2) {
        return Promise.all(promises$2.map((p2) => Promise.resolve(p2).then((value$1) => ({
          status: "fulfilled",
          value: value$1
        }), (reason) => ({
          status: "rejected",
          reason
        }))));
      };
      document.getElementsByTagName("link");
      const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
      const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
      promise = allSettled(deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) link.as = "script";
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) link.setAttribute("nonce", cspNonce);
        document.head.appendChild(link);
        if (isCss) return new Promise((res, rej) => {
          link.addEventListener("load", res);
          link.addEventListener("error", () => rej( new Error(`Unable to preload CSS for ${dep}`)));
        });
      }));
    }
    function handlePreloadError(err$2) {
      const e$12 = new Event("vite:preloadError", { cancelable: true });
      e$12.payload = err$2;
      window.dispatchEvent(e$12);
      if (!e$12.defaultPrevented) throw err$2;
    }
    return promise.then((res) => {
      for (const item of res || []) {
        if (item.status !== "rejected") continue;
        handlePreloadError(item.reason);
      }
      return baseModule().catch(handlePreloadError);
    });
  };
  class Logger {
    static debugMode = false;
    static setDebug(enabled) {
      this.debugMode = enabled;
      if (enabled) {
        console.log("[ChatGPT-Exporter] Debug mode enabled");
      }
    }
    static isDebug() {
      return this.debugMode;
    }
    static info(module, ...args) {
      console.log(`[${module}]`, ...args);
    }
    static warn(module, ...args) {
      console.warn(`[${module}]`, ...args);
    }
    static error(module, ...args) {
      console.error(`[${module}]`, ...args);
    }
    static debug(module, ...args) {
      if (this.debugMode) {
        console.log(`[${module}] [DEBUG]`, ...args);
      }
    }
  }
  const Cred = (() => {
    let token = null;
    let accountId = null;
    let mainUser = null;
    let tokenSource = "";
    let accountIdSource = "";
    let lastErr = "";
    let interceptorsInitialized = false;
    const log = (key, val, source) => {
      console.log(`[Cred] ${key} captured via ${source}:`, val);
    };
    const mask = (s2, keepL = 8, keepR = 4) => {
      if (!s2) return "";
      if (s2.length <= keepL + keepR) return s2;
      return `${s2.slice(0, keepL)}…${s2.slice(-keepR)}`;
    };
    const initInterceptors = () => {
      if (interceptorsInitialized) return;
      interceptorsInitialized = true;
      const originalFetch = window.fetch;
      window.fetch = async function(_input, init) {
        if (init && init.headers) {
          captureFromHeaders(init.headers);
        }
        return originalFetch.apply(this, arguments);
      };
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(_method, _url) {
        this.addEventListener("readystatechange", () => {
          if (this.readyState === 1) ;
        });
        return originalOpen.apply(this, arguments);
      };
      const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
      XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (header.toLowerCase() === "authorization") {
          updateToken(value, "Network (XHR)");
        }
        if (header.toLowerCase() === "chatgpt-account-id") {
          updateAccountId(value, "Network (XHR)");
        }
        return originalSetRequestHeader.apply(this, arguments);
      };
      console.log("[Cred] Network interceptors initialized");
    };
    const captureFromHeaders = (headers) => {
      try {
        let auth = null;
        let accId = null;
        if (headers instanceof Headers) {
          auth = headers.get("authorization") || headers.get("Authorization");
          accId = headers.get("chatgpt-account-id") || headers.get("ChatGPT-Account-Id");
        } else if (Array.isArray(headers)) {
          for (const [k2, v2] of headers) {
            if (k2.toLowerCase() === "authorization") auth = v2;
            if (k2.toLowerCase() === "chatgpt-account-id") accId = v2;
          }
        } else {
          for (const k2 in headers) {
            if (k2.toLowerCase() === "authorization") auth = headers[k2];
            if (k2.toLowerCase() === "chatgpt-account-id") accId = headers[k2];
          }
        }
        if (auth) updateToken(auth, "Network (Fetch)");
        if (accId) updateAccountId(accId, "Network (Fetch)");
      } catch (e2) {
      }
    };
    const updateToken = (rawVal, source) => {
      if (!rawVal) return;
      const clean = rawVal.replace(/^Bearer\s+/i, "").trim();
      if (!clean || clean.toLowerCase() === "undefined" || clean.toLowerCase() === "null" || clean.toLowerCase() === "dummy") return;
      if (token !== clean) {
        token = clean;
        tokenSource = source;
      }
    };
    const updateAccountId = (val, source) => {
      if (!val) return;
      const clean = val.trim();
      if (!clean || clean === "x" || clean.toLowerCase() === "undefined" || clean.toLowerCase() === "null") return;
      if (accountId !== clean) {
        accountId = clean;
        accountIdSource = source;
        log("Account ID", accountId, source);
      }
    };
    const checkPassiveSources = () => {
      const m2 = document.cookie.match(/(?:^|;\s*)_account=([^;]+)/);
      if (m2) {
        const val = decodeURIComponent(m2[1] || "").trim();
        updateAccountId(val, "Cookie");
      }
      try {
        let bs = _unsafeWindow.CLIENT_BOOTSTRAP;
        console.log(bs);
        console.log("[Cred] CLIENT_BOOTSTRAP inspection:", {
          exists: !!bs,
          source: "unsafeWindow",
          hasUser: !!bs?.user,
          email: bs?.user?.email,
          session: !!bs?.session
        });
        if (bs) {
          if (bs.user && bs.user.email) {
            updateMainUser(bs.user.email, "CLIENT_BOOTSTRAP");
          }
          if (bs.session && bs.session.account && bs.session.account.id) {
          }
        }
      } catch (e2) {
      }
    };
    const updateMainUser = (val, source) => {
      if (!val) return;
      if (mainUser !== val) {
        mainUser = val;
        log("User", mainUser, source);
      }
    };
    const getAuthHeaders = () => {
      const h2 = new Headers();
      if (token) h2.set("authorization", `Bearer ${token}`);
      if (accountId) h2.set("chatgpt-account-id", accountId);
      return h2;
    };
    const fetchSession = async () => {
      try {
        console.log("[Cred] Attempting to fetch session active...");
        const resp = await fetch("/api/auth/session", { credentials: "include" });
        if (!resp.ok) {
          lastErr = `session ${resp.status}`;
          console.warn(`[Cred] Session fetch failed: ${resp.status}`);
          return null;
        }
        const data = await resp.json().catch(() => ({}));
        if (data && data.accessToken) {
          return data.accessToken;
        } else {
          console.warn("[Cred] Session fetch returned no accessToken", data);
        }
      } catch (e2) {
        lastErr = e2.message || "session_error";
        console.error("[Cred] Session fetch error:", e2);
      }
      return null;
    };
    const fetchAccountCheck = async () => {
      if (!token) return null;
      const url = `${location.origin}/backend-api/accounts/check/v4-2023-04-27`;
      try {
        const resp = await fetch(url, { headers: getAuthHeaders(), credentials: "include" });
        if (!resp.ok) return null;
        const data = await resp.json();
        const accounts = data.accounts || {};
        const first = Object.values(accounts).find((a2) => a2?.account?.account_id);
        if (first) return first.account.account_id;
      } catch (e2) {
      }
      return null;
    };
    const ensureViaSession = async (tries = 3) => {
      if (token) {
        if (!mainUser) await ensureUserProfile();
        return true;
      }
      checkPassiveSources();
      if (token) {
        if (!mainUser) await ensureUserProfile();
        return true;
      }
      for (let i2 = 0; i2 < tries; i2++) {
        const t2 = await fetchSession();
        if (t2) {
          updateToken(t2, "Session API");
          if (!accountId) await ensureAccountId();
          if (!mainUser) await ensureUserProfile();
          return true;
        }
        if (i2 < tries - 1) await new Promise((r2) => setTimeout(r2, 300 * (i2 + 1)));
      }
      return !!token;
    };
    const ensureUserProfile = async () => {
      const { fetchCurrentUser: fetchCurrentUser2 } = await __vitePreload(async () => {
        const { fetchCurrentUser: fetchCurrentUser3 } = await Promise.resolve().then(() => api);
        return { fetchCurrentUser: fetchCurrentUser3 };
      }, void 0 );
      const user = await fetchCurrentUser2();
      if (user && user.email) {
        updateMainUser(user.email, "/backend-api/me");
      }
    };
    const ensureAccountId = async () => {
      if (accountId) return accountId;
      checkPassiveSources();
      if (accountId) return accountId;
      if (!token) await ensureViaSession(1);
      if (token) {
        const id = await fetchAccountCheck();
        if (id) updateAccountId(id, "Account API");
      }
      return accountId || "";
    };
    const ensureReady = async (timeout = 1e4) => {
      const isReady = () => !!token && !!mainUser && !!accountId;
      if (isReady()) return true;
      checkPassiveSources();
      if (isReady()) return true;
      Logger.info("Cred", "Waiting for credentials readiness (Token + Account + User)...");
      const start = Date.now();
      const p2 = ensureViaSession();
      while (Date.now() - start < timeout) {
        if (isReady()) return true;
        await new Promise((r2) => setTimeout(r2, 500));
      }
      await p2;
      return isReady();
    };
    const debugText = () => {
      const tok = token ? `${mask(token)} (${tokenSource})` : "未获取";
      const acc = accountId ? `${accountId} (${accountIdSource})` : "未获取";
      const usr = mainUser ? `${mainUser}` : "未获取";
      const err = lastErr ? `
错误：${lastErr}` : "";
      return `Token：${tok}
Account：${acc}
User: ${usr}${err}`;
    };
    initInterceptors();
    checkPassiveSources();
    return {
      ensureViaSession,
      ensureReady,
      ensureAccountId,
      getAuthHeaders,
      get token() {
        return token;
      },
      get accountId() {
        return accountId;
      },
      get userLabel() {
        return mainUser;
      },
      get debug() {
        return debugText();
      }
    };
  })();
  async function fetchConversation(id, projectId2) {
    if (!Cred.token) {
      const ok = await Cred.ensureViaSession();
      if (!ok) throw new Error("无法获取登录凭证（accessToken）");
    }
    const headers = Cred.getAuthHeaders();
    if (projectId2) headers.set("chatgpt-project-id", projectId2);
    const url = `${location.origin}/backend-api/conversation/${id}`;
    const init = {
      method: "GET",
      credentials: "include",
      headers
    };
    let resp = await fetchWithRetry(url, init).catch(() => null);
    if (!resp) throw new Error("网络错误");
    if (resp.status === 401) {
      const ok = await Cred.ensureViaSession();
      if (!ok) throw new Error("401：重新获取凭证失败");
      const h2 = Cred.getAuthHeaders();
      if (projectId2) h2.set("chatgpt-project-id", projectId2);
      init.headers = h2;
      resp = await fetchWithRetry(url, init).catch(() => null);
      if (!resp) throw new Error("网络错误（重试）");
    }
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`HTTP ${resp.status}: ${txt.slice(0, 200)}`);
    }
    return resp.json();
  }
  async function downloadSandboxFile({
    conversationId,
    messageId,
    sandboxPath
  }) {
    if (!Cred.token) {
      const ok = await Cred.ensureViaSession();
      if (!ok) throw new Error("没有 accessToken，无法下载 sandbox 文件");
    }
    const headers = Cred.getAuthHeaders();
    const pid = projectId();
    if (pid) headers.set("chatgpt-project-id", pid);
    const params = new URLSearchParams({
      message_id: messageId,
      sandbox_path: sandboxPath.replace(/^sandbox:/, "")
    });
    const url = `${location.origin}/backend-api/conversation/${conversationId}/interpreter/download?${params.toString()}`;
    const resp = await fetchWithRetry(url, { headers, credentials: "include" });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`sandbox download meta ${resp.status}: ${txt.slice(0, 200)}`);
    }
    let j2;
    try {
      j2 = await resp.json();
    } catch (e2) {
      throw new Error("sandbox download meta 非 JSON");
    }
    const dl = j2.download_url;
    if (!dl) throw new Error(`sandbox download_url 缺失: ${JSON.stringify(j2).slice(0, 200)}`);
    const fname = sanitize(j2.file_name || sandboxPath.split("/").pop() || "sandbox_file");
    await gmDownload(dl, fname);
  }
  async function downloadSandboxFileBlob({
    conversationId,
    messageId,
    sandboxPath
  }) {
    if (!Cred.token) {
      const ok = await Cred.ensureViaSession();
      if (!ok) throw new Error("没有 accessToken，无法下载 sandbox 文件");
    }
    const headers = Cred.getAuthHeaders();
    const pid = projectId();
    if (pid) headers.set("chatgpt-project-id", pid);
    const params = new URLSearchParams({
      message_id: messageId,
      sandbox_path: sandboxPath.replace(/^sandbox:/, "")
    });
    const url = `${location.origin}/backend-api/conversation/${conversationId}/interpreter/download?${params.toString()}`;
    const resp = await fetchWithRetry(url, { headers, credentials: "include" });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`sandbox download meta ${resp.status}: ${txt.slice(0, 200)}`);
    }
    let j2;
    try {
      j2 = await resp.json();
    } catch (e2) {
      throw new Error("sandbox download meta 非 JSON");
    }
    const dl = j2.download_url;
    if (!dl) throw new Error(`sandbox download_url 缺失: ${JSON.stringify(j2).slice(0, 200)}`);
    const gmHeaders = {};
    const res = await gmFetchBlob(dl, gmHeaders);
    const fname = inferFilename(
      j2.file_name || sandboxPath.split("/").pop() || "sandbox_file",
      sandboxPath,
      res.mime || ""
    );
    return { blob: res.blob, mime: res.mime || "", filename: fname };
  }
  async function fetchDownloadUrlOrResponse(fileId, headers) {
    const url = `${location.origin}/backend-api/files/download/${fileId}?inline=false`;
    const resp = await fetchWithRetry(url, { method: "GET", headers, credentials: "include" });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`download meta ${resp.status}: ${txt.slice(0, 200)}`);
    }
    const ct = resp.headers.get("content-type") || "";
    if (ct.includes("json")) {
      const j2 = await resp.json();
      if (!j2.download_url && !j2.url) {
        throw new Error(`download meta missing url: ${JSON.stringify(j2).slice(0, 200)}`);
      }
      return j2.download_url || j2.url;
    }
    return resp;
  }
  async function fetchCurrentUser() {
    if (!Cred.token) return null;
    const url = `${location.origin}/backend-api/me`;
    const headers = Cred.getAuthHeaders();
    try {
      const resp = await fetchWithRetry(url, { method: "GET", headers, credentials: "include" });
      if (!resp.ok) {
        console.warn("fetchCurrentUser failed", resp.status);
        return null;
      }
      return await resp.json();
    } catch (e2) {
      console.error("fetchCurrentUser error", e2);
      return null;
    }
  }
  const api = Object.freeze( Object.defineProperty({
    __proto__: null,
    downloadSandboxFile,
    downloadSandboxFileBlob,
    fetchConversation,
    fetchCurrentUser,
    fetchDownloadUrlOrResponse
  }, Symbol.toStringTag, { value: "Module" }));
  async function listConversationsPage({
    offset = 0,
    limit = 100,
    is_archived,
    is_starred,
    order
  }) {
    if (!Cred.token) await Cred.ensureViaSession();
    const headers = Cred.getAuthHeaders();
    const qs = new URLSearchParams({
      offset: String(offset),
      limit: String(limit)
    });
    if (typeof is_archived === "boolean") qs.set("is_archived", String(is_archived));
    if (typeof is_starred === "boolean") qs.set("is_starred", String(is_starred));
    if (order) qs.set("order", order);
    const url = `${location.origin}/backend-api/conversations?${qs.toString()}`;
    const resp = await fetch(url, { headers, credentials: "include" });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`list convs ${resp.status}: ${txt.slice(0, 120)}`);
    }
    return resp.json();
  }
  async function listProjectConversations({
    projectId: projectId2,
    cursor = 0,
    limit = 50
  }) {
    if (!Cred.token) await Cred.ensureViaSession();
    const headers = Cred.getAuthHeaders();
    const url = `${location.origin}/backend-api/gizmos/${projectId2}/conversations?cursor=${cursor}&limit=${limit}`;
    const resp = await fetch(url, { headers, credentials: "include" });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`project convs ${resp.status}: ${txt.slice(0, 120)}`);
    }
    return resp.json();
  }
  async function listGizmosSidebar(cursor) {
    if (!Cred.token) await Cred.ensureViaSession();
    const headers = Cred.getAuthHeaders();
    const url = new URL(`${location.origin}/backend-api/gizmos/snorlax/sidebar`);
    url.searchParams.set("conversations_per_gizmo", "0");
    if (cursor) url.searchParams.set("cursor", cursor);
    const resp = await fetch(url.toString(), { headers, credentials: "include" });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`gizmos sidebar ${resp.status}: ${txt.slice(0, 120)}`);
    }
    return resp.json();
  }
  async function collectAllConversationTasks(progressCb) {
    const rootSet = new Set();
    const rootInfo = new Map();
    const projectMap = new Map();
    const addRoot = (id, title) => {
      if (!id) return;
      rootSet.add(id);
      if (!rootInfo.has(id)) rootInfo.set(id, { id, title: title || "" });
    };
    const ensureProject = (projectId2, projectName) => {
      if (!projectId2) return null;
      let rec = projectMap.get(projectId2);
      if (!rec) {
        rec = { projectId: projectId2, projectName: projectName || "", convs: [] };
        projectMap.set(projectId2, rec);
      } else if (projectName && !rec.projectName) {
        rec.projectName = projectName;
      }
      return rec;
    };
    const addProjectConv = (projectId2, id, title, projectName) => {
      if (!projectId2 || !id) return;
      const rec = ensureProject(projectId2, projectName);
      if (!rec) return;
      if (!rec.convs.some((x2) => x2.id === id)) {
        rec.convs.push({ id, title: title || "" });
      }
      if (rootSet.has(id)) {
        rootSet.delete(id);
        rootInfo.delete(id);
      }
    };
    const fetchRootBasic = async () => {
      const limit = 100;
      let offset = 0;
      while (true) {
        const page = await listConversationsPage({ offset, limit }).catch((e2) => {
          console.warn("[ChatGPT-Multimodal-Exporter] list conversations failed", e2);
          return null;
        });
        const arr = Array.isArray(page?.items) ? page.items : [];
        arr.forEach((it) => {
          if (!it || !it.id) return;
          const id = it.id;
          const projId = it.conversation_template_id || it.gizmo_id || null;
          if (projId) addProjectConv(projId, id, it.title || "");
          else addRoot(id, it.title || "");
        });
        if (progressCb) progressCb(3, `个人会话：${offset + arr.length}${page?.total ? `/${page.total}` : ""}`);
        if (!arr.length || arr.length < limit || page && page.total !== null && offset + limit >= page.total) break;
        offset += limit;
        await sleep(120);
      }
    };
    await fetchRootBasic();
    try {
      const projectIds = new Set();
      let cursor = null;
      do {
        const sidebar = await listGizmosSidebar(cursor).catch((e2) => {
          console.warn("[ChatGPT-Multimodal-Exporter] gizmos sidebar failed", e2);
          return null;
        });
        const gizmosRaw = Array.isArray(sidebar?.gizmos) ? sidebar.gizmos : [];
        const itemsRaw = Array.isArray(sidebar?.items) ? sidebar.items : [];
        const pushGizmo = (g2) => {
          if (!g2 || !g2.id) return;
          projectIds.add(g2.id);
          ensureProject(g2.id, g2.display?.name || g2.name || "");
          const convs = Array.isArray(g2.conversations) ? g2.conversations : [];
          convs.forEach((c2) => addProjectConv(g2.id, c2.id, c2.title, g2.display?.name || g2.name));
        };
        gizmosRaw.forEach((g2) => pushGizmo(g2));
        itemsRaw.forEach((it) => {
          const g2 = it?.gizmo?.gizmo || it?.gizmo || null;
          if (!g2 || !g2.id) return;
          pushGizmo(g2);
          const convs = it?.conversations?.items;
          if (Array.isArray(convs))
            convs.forEach((c2) => addProjectConv(g2.id, c2.id, c2.title, g2.display?.name || g2.name));
        });
        cursor = sidebar && sidebar.cursor ? sidebar.cursor : null;
      } while (cursor);
      for (const pid of projectIds) {
        let cursor2 = 0;
        const limit = 50;
        while (true) {
          const page = await listProjectConversations({ projectId: pid, cursor: cursor2, limit }).catch((e2) => {
            console.warn("[ChatGPT-Multimodal-Exporter] project conversations failed", e2);
            return null;
          });
          const arr = Array.isArray(page?.items) ? page.items : [];
          arr.forEach((it) => {
            if (!it || !it.id) return;
            addProjectConv(pid, it.id, it.title || "");
          });
          if (progressCb) progressCb(5, `项目 ${pid}：${cursor2 + arr.length}${page?.total ? `/${page.total}` : ""}`);
          if (!arr.length || arr.length < limit || page && page.total !== null && cursor2 + limit >= page.total) break;
          cursor2 += limit;
          await sleep(120);
        }
      }
    } catch (e2) {
      console.warn("[ChatGPT-Multimodal-Exporter] project list error", e2);
    }
    const rootIds = Array.from(rootSet);
    const roots = Array.from(rootInfo.values());
    const projects = Array.from(projectMap.values());
    return { rootIds, roots, projects };
  }
  async function fetchConvWithRetry(id, projectId2, retries = 2) {
    let attempt = 0;
    let lastErr = null;
    while (attempt <= retries) {
      try {
        return await fetchConversation(id, projectId2 || void 0);
      } catch (e2) {
        lastErr = e2;
        attempt++;
        const delay = 400 * Math.pow(2, attempt - 1);
        await sleep(delay);
      }
    }
    throw lastErr || new Error("fetch_failed");
  }
  async function fetchConversationsBatch(tasks, concurrency, progressCb, cancelRef) {
    const total = tasks.length;
    if (!total) return [];
    const results = new Array(total);
    let done = 0;
    let index = 0;
    let fatalErr = null;
    const worker = async () => {
      while (true) {
        if (cancelRef && cancelRef.cancel) return;
        if (fatalErr) return;
        const i2 = index++;
        if (i2 >= total) return;
        const t2 = tasks[i2];
        try {
          const data = await fetchConvWithRetry(t2.id, t2.projectId, 2);
          results[i2] = data;
          done++;
          const pct = total ? Math.round(done / total * 60) + 10 : 10;
          if (progressCb) progressCb(pct, `导出 JSON：${done}/${total}`);
        } catch (e2) {
          fatalErr = e2;
          return;
        }
      }
    };
    const n2 = Math.max(1, Math.min(concurrency || 1, total));
    const workers = [];
    for (let i2 = 0; i2 < n2; i2++) workers.push(worker());
    await Promise.all(workers);
    if (fatalErr) throw fatalErr;
    return results;
  }
  const DB_NAME = "ChatGPTExporterDB";
  const STORE_NAME = "handles";
  const HANDLE_KEY = "root_dir_handle";
  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  async function getHandleFromDB() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(HANDLE_KEY);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function saveHandleToDB(handle) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(handle, HANDLE_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
  async function getRootHandle() {
    try {
      const handle = await getHandleFromDB();
      return handle || null;
    } catch (e2) {
      console.warn("Failed to get handle from DB", e2);
      return null;
    }
  }
  async function pickAndSaveRootHandle() {
    const handle = await window.showDirectoryPicker();
    await saveHandleToDB(handle);
    return handle;
  }
  async function verifyPermission(handle, readWrite = false) {
    const options2 = {};
    if (readWrite) {
      options2.mode = "readwrite";
    }
    if (await handle.queryPermission(options2) === "granted") {
      return true;
    }
    if (await handle.requestPermission(options2) === "granted") {
      return true;
    }
    return false;
  }
  async function ensureFolder(parent, name) {
    return await parent.getDirectoryHandle(name, { create: true });
  }
  async function writeFile(parent, name, content) {
    const fileHandle = await parent.getFileHandle(name, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }
  async function fileExists(parent, name) {
    try {
      await parent.getFileHandle(name);
      return true;
    } catch (e2) {
      return false;
    }
  }
  async function readFile(parent, name) {
    const fileHandle = await parent.getFileHandle(name);
    const file = await fileHandle.getFile();
    return await file.text();
  }
  const STATE_FILENAME = "autosave_state.json";
  let stateCache = null;
  async function loadState(userFolder) {
    try {
      const content = await readFile(userFolder, STATE_FILENAME);
      const state = JSON.parse(content);
      if (!state.workspaces) state.workspaces = {};
      if (!state.user) state.user = { id: "", email: "" };
      Object.values(state.workspaces).forEach((ws) => {
        if (!ws.gizmos) ws.gizmos = {};
      });
      stateCache = state;
      return state;
    } catch (e2) {
      if (e2.name !== "NotFoundError") {
        Logger.warn("AutoSaveState", "Failed to load state", e2);
      }
    }
    return {
      user: { id: "", email: "" },
      workspaces: {},
      conversations: {}
    };
  }
  async function saveState(state, userFolder) {
    try {
      stateCache = state;
      await writeFile(userFolder, STATE_FILENAME, JSON.stringify(state, null, 2));
    } catch (e2) {
      Logger.error("AutoSaveState", "Failed to save state", e2);
    }
  }
  async function updateConversationState(userFolder, id, updateTime, savedAt, workspaceId, gizmoId) {
    const state = await loadState(userFolder);
    state.conversations[id] = {
      id,
      update_time: updateTime,
      saved_at: savedAt,
      workspace_id: workspaceId,
      gizmo_id: gizmoId
    };
    await saveState(state, userFolder);
  }
  async function updateWorkspaceCheckTime(userFolder, workspaceId) {
    const state = await loadState(userFolder);
    if (!state.workspaces[workspaceId]) {
      state.workspaces[workspaceId] = { id: workspaceId, last_check_time: 0, gizmos: {} };
    }
    state.workspaces[workspaceId].last_check_time = Date.now();
    await saveState(state, userFolder);
  }
  async function updateGizmoCheckTime(userFolder, workspaceId, gizmoId) {
    const state = await loadState(userFolder);
    if (!state.workspaces[workspaceId]) {
      state.workspaces[workspaceId] = { id: workspaceId, last_check_time: 0, gizmos: {} };
    }
    if (!state.workspaces[workspaceId].gizmos) {
      state.workspaces[workspaceId].gizmos = {};
    }
    state.workspaces[workspaceId].gizmos[gizmoId] = {
      id: gizmoId,
      last_check_time: Date.now()
    };
    await saveState(state, userFolder);
  }
  function collectFileCandidates(conv) {
    const mapping = conv && conv.mapping || {};
    const out = new Map();
    const convId2 = conv?.conversation_id || "";
    const add = (fileId, info) => {
      if (!fileId) return;
      if (out.has(fileId)) return;
      out.set(fileId, { file_id: fileId, conversation_id: convId2, ...info });
    };
    for (const key in mapping) {
      const node = mapping[key];
      if (!node || !node.message) continue;
      const msg = node.message;
      const meta = msg.metadata || {};
      const c2 = msg.content || {};
      (meta.attachments || []).forEach((att) => {
        if (!att || !att.id) return;
        add(att.id, { source: "attachment", meta: att });
      });
      const crefByFile = meta.content_references_by_file || {};
      Object.values(crefByFile).flat().forEach((ref) => {
        if (ref?.file_id) add(ref.file_id, { source: "cref", meta: ref, message_id: msg.id });
        if (ref?.asset_pointer) {
          const fid = pointerToFileId(ref.asset_pointer);
          add(fid, { source: "cref-pointer", pointer: ref.asset_pointer, meta: ref, message_id: msg.id });
        }
      });
      const n7 = meta.n7jupd_crefs_by_file || meta.n7jupd_crefs || {};
      const n7list = Array.isArray(n7) ? n7 : Object.values(n7).flat();
      n7list.forEach((ref) => {
        if (ref?.file_id) add(ref.file_id, { source: "n7jupd-cref", meta: ref, message_id: msg.id });
      });
      if (Array.isArray(c2.parts)) {
        c2.parts.forEach((part) => {
          if (part && typeof part === "object" && part.content_type && part.asset_pointer) {
            const fid = pointerToFileId(part.asset_pointer);
            add(fid, { source: part.content_type, pointer: part.asset_pointer, meta: part, message_id: msg.id });
          }
          if (part && typeof part === "object" && part.content_type === "real_time_user_audio_video_asset_pointer" && part.audio_asset_pointer && part.audio_asset_pointer.asset_pointer) {
            const ap = part.audio_asset_pointer;
            const fid = pointerToFileId(ap.asset_pointer);
            add(fid, { source: "voice-audio", pointer: ap.asset_pointer, meta: ap, message_id: msg.id });
          }
          if (part && typeof part === "object" && part.audio_asset_pointer && part.audio_asset_pointer.asset_pointer) {
            const ap = part.audio_asset_pointer;
            const fid = pointerToFileId(ap.asset_pointer);
            add(fid, { source: "voice-audio", pointer: ap.asset_pointer, meta: ap, message_id: msg.id });
          }
        });
      }
      if (c2.content_type === "text" && Array.isArray(c2.parts)) {
        c2.parts.forEach((txt) => {
          if (typeof txt !== "string") return;
          const matches = txt.match(/\{\{file:([^}]+)\}\}/g) || [];
          matches.forEach((tok) => {
            const fid = tok.slice(7, -2);
            add(fid, { source: "inline-placeholder", message_id: msg.id });
          });
          const sandboxLinks = txt.match(/sandbox:[^\s\)\]]+/g) || [];
          sandboxLinks.forEach((s2) => {
            add(s2, { source: "sandbox-link", pointer: s2, message_id: msg.id });
          });
        });
      }
    }
    return [...out.values()];
  }
  async function downloadPointerOrFile(fileInfo) {
    const fileId = fileInfo.file_id;
    const pointer = fileInfo.pointer || "";
    const convId2 = fileInfo.conversation_id || "";
    const messageId = fileInfo.message_id || "";
    if (isInlinePointer(fileId) || isInlinePointer(pointer)) {
      const url = isInlinePointer(pointer) ? pointer : fileId;
      const name2 = inferFilename(
        fileInfo.meta && (fileInfo.meta.name || fileInfo.meta.file_name) || "",
        fileId || pointer,
        ""
      );
      await gmDownload(url, name2);
      return;
    }
    if (pointer && pointer.startsWith("sandbox:")) {
      if (!convId2 || !messageId) {
        console.warn("[ChatGPT-Multimodal-Exporter] sandbox pointer缺少 conversation/message id", pointer);
        return;
      }
      await downloadSandboxFile({ conversationId: convId2, messageId, sandboxPath: pointer });
      return;
    }
    if (!Cred.token) {
      const ok = await Cred.ensureViaSession();
      if (!ok) throw new Error("没有 accessToken，无法下载文件");
    }
    const headers = Cred.getAuthHeaders();
    const pid = projectId();
    if (pid) headers.set("chatgpt-project-id", pid);
    const downloadResult = await fetchDownloadUrlOrResponse(fileId, headers);
    let resp;
    if (downloadResult instanceof Response) {
      resp = downloadResult;
    } else if (typeof downloadResult === "string") {
      const fname = fileInfo.meta && (fileInfo.meta.name || fileInfo.meta.file_name) || `${fileId}${fileExtFromMime("") || ""}`;
      await gmDownload(downloadResult, fname);
      return;
    } else {
      throw new Error(`无法获取 download_url，如果file-id正确，可能是链接过期 (file_id: ${fileId})`);
    }
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`下载失败 ${resp.status}: ${txt.slice(0, 120)}`);
    }
    const blob = await resp.blob();
    const cd = resp.headers.get("Content-Disposition") || "";
    const m2 = cd.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i);
    const mime = fileInfo.meta && (fileInfo.meta.mime_type || fileInfo.meta.file_type) || resp.headers.get("Content-Type") || "";
    const ext = fileExtFromMime(mime) || ".bin";
    let name = fileInfo.meta && (fileInfo.meta.name || fileInfo.meta.file_name) || m2 && decodeURIComponent(m2[1]) || `${fileId}${ext}`;
    name = sanitize(name);
    saveBlob(blob, name);
  }
  async function downloadSelectedFiles(list) {
    let okCount = 0;
    for (const info of list) {
      try {
        await downloadPointerOrFile(info);
        okCount++;
      } catch (e2) {
        console.error("[ChatGPT-Multimodal-Exporter] 下载失败", info, e2);
      }
    }
    return { ok: okCount, total: list.length };
  }
  async function downloadPointerOrFileAsBlob(fileInfo) {
    const fileId = fileInfo.file_id;
    const pointer = fileInfo.pointer || "";
    const convId2 = fileInfo.conversation_id || "";
    const projectId2 = fileInfo.project_id || "";
    const messageId = fileInfo.message_id || "";
    if (isInlinePointer(fileId) || isInlinePointer(pointer)) {
      const url = isInlinePointer(pointer) ? pointer : fileId;
      const res = await gmFetchBlob(url);
      const mime2 = res.mime || fileInfo.meta?.mime_type || fileInfo.meta?.mime || "";
      const filename = inferFilename(
        fileInfo.meta && (fileInfo.meta.name || fileInfo.meta.file_name) || "",
        fileId || pointer,
        mime2
      );
      return { blob: res.blob, mime: mime2, filename };
    }
    if (pointer && pointer.startsWith("sandbox:")) {
      if (!convId2 || !messageId) throw new Error("sandbox pointer 缺少 conversation/message id");
      return downloadSandboxFileBlob({ conversationId: convId2, messageId, sandboxPath: pointer });
    }
    if (!Cred.token) {
      const ok = await Cred.ensureViaSession();
      if (!ok) throw new Error("没有 accessToken，无法下载文件");
    }
    const headers = Cred.getAuthHeaders();
    if (projectId2) headers.set("chatgpt-project-id", projectId2);
    const downloadResult = await fetchDownloadUrlOrResponse(fileId, headers);
    let resp;
    if (downloadResult instanceof Response) {
      resp = downloadResult;
    } else if (typeof downloadResult === "string") {
      const res = await gmFetchBlob(downloadResult);
      const mime2 = res.mime || fileInfo.meta?.mime_type || fileInfo.meta?.mime || "";
      const fname = inferFilename(
        fileInfo.meta && (fileInfo.meta.name || fileInfo.meta.file_name) || "",
        fileId,
        mime2
      );
      return {
        blob: res.blob,
        mime: mime2,
        filename: fname
      };
    } else {
      throw new Error(`无法获取 download_url，如果file-id正确，可能是链接过期 (file_id: ${fileId})`);
    }
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`下载失败 ${resp.status}: ${txt.slice(0, 120)}`);
    }
    const blob = await resp.blob();
    const cd = resp.headers.get("Content-Disposition") || "";
    const m2 = cd.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i);
    const mime = fileInfo.meta && (fileInfo.meta.mime_type || fileInfo.meta.file_type) || resp.headers.get("Content-Type") || "";
    const name = inferFilename(
      fileInfo.meta && (fileInfo.meta.name || fileInfo.meta.file_name) || m2 && decodeURIComponent(m2[1]) || "",
      fileId,
      mime
    );
    return { blob, mime, filename: name };
  }
  var i = Symbol.for("preact-signals");
  function t() {
    if (!(s > 1)) {
      var i2, t2 = false;
      while (void 0 !== h$1) {
        var r2 = h$1;
        h$1 = void 0;
        f++;
        while (void 0 !== r2) {
          var o2 = r2.o;
          r2.o = void 0;
          r2.f &= -3;
          if (!(8 & r2.f) && c(r2)) try {
            r2.c();
          } catch (r3) {
            if (!t2) {
              i2 = r3;
              t2 = true;
            }
          }
          r2 = o2;
        }
      }
      f = 0;
      s--;
      if (t2) throw i2;
    } else s--;
  }
  function r(i2) {
    if (s > 0) return i2();
    s++;
    try {
      return i2();
    } finally {
      t();
    }
  }
  var o = void 0;
  function n(i2) {
    var t2 = o;
    o = void 0;
    try {
      return i2();
    } finally {
      o = t2;
    }
  }
  var h$1 = void 0, s = 0, f = 0, v = 0;
  function e(i2) {
    if (void 0 !== o) {
      var t2 = i2.n;
      if (void 0 === t2 || t2.t !== o) {
        t2 = { i: 0, S: i2, p: o.s, n: void 0, t: o, e: void 0, x: void 0, r: t2 };
        if (void 0 !== o.s) o.s.n = t2;
        o.s = t2;
        i2.n = t2;
        if (32 & o.f) i2.S(t2);
        return t2;
      } else if (-1 === t2.i) {
        t2.i = 0;
        if (void 0 !== t2.n) {
          t2.n.p = t2.p;
          if (void 0 !== t2.p) t2.p.n = t2.n;
          t2.p = o.s;
          t2.n = void 0;
          o.s.n = t2;
          o.s = t2;
        }
        return t2;
      }
    }
  }
  function u(i2, t2) {
    this.v = i2;
    this.i = 0;
    this.n = void 0;
    this.t = void 0;
    this.W = null == t2 ? void 0 : t2.watched;
    this.Z = null == t2 ? void 0 : t2.unwatched;
    this.name = null == t2 ? void 0 : t2.name;
  }
  u.prototype.brand = i;
  u.prototype.h = function() {
    return true;
  };
  u.prototype.S = function(i2) {
    var t2 = this, r2 = this.t;
    if (r2 !== i2 && void 0 === i2.e) {
      i2.x = r2;
      this.t = i2;
      if (void 0 !== r2) r2.e = i2;
      else n(function() {
        var i3;
        null == (i3 = t2.W) || i3.call(t2);
      });
    }
  };
  u.prototype.U = function(i2) {
    var t2 = this;
    if (void 0 !== this.t) {
      var r2 = i2.e, o2 = i2.x;
      if (void 0 !== r2) {
        r2.x = o2;
        i2.e = void 0;
      }
      if (void 0 !== o2) {
        o2.e = r2;
        i2.x = void 0;
      }
      if (i2 === this.t) {
        this.t = o2;
        if (void 0 === o2) n(function() {
          var i3;
          null == (i3 = t2.Z) || i3.call(t2);
        });
      }
    }
  };
  u.prototype.subscribe = function(i2) {
    var t2 = this;
    return E$1(function() {
      var r2 = t2.value, n2 = o;
      o = void 0;
      try {
        i2(r2);
      } finally {
        o = n2;
      }
    }, { name: "sub" });
  };
  u.prototype.valueOf = function() {
    return this.value;
  };
  u.prototype.toString = function() {
    return this.value + "";
  };
  u.prototype.toJSON = function() {
    return this.value;
  };
  u.prototype.peek = function() {
    var i2 = o;
    o = void 0;
    try {
      return this.value;
    } finally {
      o = i2;
    }
  };
  Object.defineProperty(u.prototype, "value", { get: function() {
    var i2 = e(this);
    if (void 0 !== i2) i2.i = this.i;
    return this.v;
  }, set: function(i2) {
    if (i2 !== this.v) {
      if (f > 100) throw new Error("Cycle detected");
      this.v = i2;
      this.i++;
      v++;
      s++;
      try {
        for (var r2 = this.t; void 0 !== r2; r2 = r2.x) r2.t.N();
      } finally {
        t();
      }
    }
  } });
  function d(i2, t2) {
    return new u(i2, t2);
  }
  function c(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) if (t2.S.i !== t2.i || !t2.S.h() || t2.S.i !== t2.i) return true;
    return false;
  }
  function a(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) {
      var r2 = t2.S.n;
      if (void 0 !== r2) t2.r = r2;
      t2.S.n = t2;
      t2.i = -1;
      if (void 0 === t2.n) {
        i2.s = t2;
        break;
      }
    }
  }
  function l(i2) {
    var t2 = i2.s, r2 = void 0;
    while (void 0 !== t2) {
      var o2 = t2.p;
      if (-1 === t2.i) {
        t2.S.U(t2);
        if (void 0 !== o2) o2.n = t2.n;
        if (void 0 !== t2.n) t2.n.p = o2;
      } else r2 = t2;
      t2.S.n = t2.r;
      if (void 0 !== t2.r) t2.r = void 0;
      t2 = o2;
    }
    i2.s = r2;
  }
  function y$1(i2, t2) {
    u.call(this, void 0);
    this.x = i2;
    this.s = void 0;
    this.g = v - 1;
    this.f = 4;
    this.W = null == t2 ? void 0 : t2.watched;
    this.Z = null == t2 ? void 0 : t2.unwatched;
    this.name = null == t2 ? void 0 : t2.name;
  }
  y$1.prototype = new u();
  y$1.prototype.h = function() {
    this.f &= -3;
    if (1 & this.f) return false;
    if (32 == (36 & this.f)) return true;
    this.f &= -5;
    if (this.g === v) return true;
    this.g = v;
    this.f |= 1;
    if (this.i > 0 && !c(this)) {
      this.f &= -2;
      return true;
    }
    var i2 = o;
    try {
      a(this);
      o = this;
      var t2 = this.x();
      if (16 & this.f || this.v !== t2 || 0 === this.i) {
        this.v = t2;
        this.f &= -17;
        this.i++;
      }
    } catch (i3) {
      this.v = i3;
      this.f |= 16;
      this.i++;
    }
    o = i2;
    l(this);
    this.f &= -2;
    return true;
  };
  y$1.prototype.S = function(i2) {
    if (void 0 === this.t) {
      this.f |= 36;
      for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.S(t2);
    }
    u.prototype.S.call(this, i2);
  };
  y$1.prototype.U = function(i2) {
    if (void 0 !== this.t) {
      u.prototype.U.call(this, i2);
      if (void 0 === this.t) {
        this.f &= -33;
        for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
      }
    }
  };
  y$1.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 6;
      for (var i2 = this.t; void 0 !== i2; i2 = i2.x) i2.t.N();
    }
  };
  Object.defineProperty(y$1.prototype, "value", { get: function() {
    if (1 & this.f) throw new Error("Cycle detected");
    var i2 = e(this);
    this.h();
    if (void 0 !== i2) i2.i = this.i;
    if (16 & this.f) throw this.v;
    return this.v;
  } });
  function w$1(i2, t2) {
    return new y$1(i2, t2);
  }
  function _$1(i2) {
    var r2 = i2.u;
    i2.u = void 0;
    if ("function" == typeof r2) {
      s++;
      var n2 = o;
      o = void 0;
      try {
        r2();
      } catch (t2) {
        i2.f &= -2;
        i2.f |= 8;
        b$1(i2);
        throw t2;
      } finally {
        o = n2;
        t();
      }
    }
  }
  function b$1(i2) {
    for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
    i2.x = void 0;
    i2.s = void 0;
    _$1(i2);
  }
  function g$2(i2) {
    if (o !== this) throw new Error("Out-of-order effect");
    l(this);
    o = i2;
    this.f &= -2;
    if (8 & this.f) b$1(this);
    t();
  }
  function p$1(i2, t2) {
    this.x = i2;
    this.u = void 0;
    this.s = void 0;
    this.o = void 0;
    this.f = 32;
    this.name = null == t2 ? void 0 : t2.name;
  }
  p$1.prototype.c = function() {
    var i2 = this.S();
    try {
      if (8 & this.f) return;
      if (void 0 === this.x) return;
      var t2 = this.x();
      if ("function" == typeof t2) this.u = t2;
    } finally {
      i2();
    }
  };
  p$1.prototype.S = function() {
    if (1 & this.f) throw new Error("Cycle detected");
    this.f |= 1;
    this.f &= -9;
    _$1(this);
    a(this);
    s++;
    var i2 = o;
    o = this;
    return g$2.bind(this, i2);
  };
  p$1.prototype.N = function() {
    if (!(2 & this.f)) {
      this.f |= 2;
      this.o = h$1;
      h$1 = this;
    }
  };
  p$1.prototype.d = function() {
    this.f |= 8;
    if (!(1 & this.f)) b$1(this);
  };
  p$1.prototype.dispose = function() {
    this.d();
  };
  function E$1(i2, t2) {
    var r2 = new p$1(i2, t2);
    try {
      r2.c();
    } catch (i3) {
      r2.d();
      throw i3;
    }
    var o2 = r2.d.bind(r2);
    o2[Symbol.dispose] = o2;
    return o2;
  }
  var h, p, m = "undefined" != typeof window && !!window.__PREACT_SIGNALS_DEVTOOLS__, _ = [];
  E$1(function() {
    h = this.N;
  })();
  function g$1(i2, t2) {
    preact.options[i2] = t2.bind(null, preact.options[i2] || function() {
    });
  }
  function y(i2) {
    if (p) p();
    p = i2 && i2.S();
  }
  function b(i2) {
    var n2 = this, r2 = i2.data, o2 = useSignal(r2);
    o2.value = r2;
    var e2 = T$1(function() {
      var i3 = n2, r3 = n2.__v;
      while (r3 = r3.__) if (r3.__c) {
        r3.__c.__$f |= 4;
        break;
      }
      var f2 = w$1(function() {
        var i4 = o2.value.value;
        return 0 === i4 ? 0 : true === i4 ? "" : i4 || "";
      }), e3 = w$1(function() {
        return !Array.isArray(f2.value) && !preact.isValidElement(f2.value);
      }), u3 = E$1(function() {
        this.N = M$1;
        if (e3.value) {
          var n3 = f2.value;
          if (i3.__v && i3.__v.__e && 3 === i3.__v.__e.nodeType) i3.__v.__e.data = n3;
        }
      }), c3 = n2.__$u.d;
      n2.__$u.d = function() {
        u3();
        c3.call(this);
      };
      return [e3, f2];
    }, []), u2 = e2[0], c2 = e2[1];
    return u2.value ? c2.peek() : c2.value;
  }
  b.displayName = "ReactiveTextNode";
  Object.defineProperties(u.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: b }, props: { configurable: true, get: function() {
    return { data: this };
  } }, __b: { configurable: true, value: 1 } });
  g$1("__b", function(i2, n2) {
    if (m && "function" == typeof n2.type) window.__PREACT_SIGNALS_DEVTOOLS__.exitComponent();
    if ("string" == typeof n2.type) {
      var t2, r2 = n2.props;
      for (var f2 in r2) if ("children" !== f2) {
        var o2 = r2[f2];
        if (o2 instanceof u) {
          if (!t2) n2.__np = t2 = {};
          t2[f2] = o2;
          r2[f2] = o2.peek();
        }
      }
    }
    i2(n2);
  });
  g$1("__r", function(i2, n2) {
    if (m && "function" == typeof n2.type) window.__PREACT_SIGNALS_DEVTOOLS__.enterComponent(n2);
    if (n2.type !== preact.Fragment) {
      y();
      var t2, f2 = n2.__c;
      if (f2) {
        f2.__$f &= -2;
        if (void 0 === (t2 = f2.__$u)) f2.__$u = t2 = (function(i3) {
          var n3;
          E$1(function() {
            n3 = this;
          });
          n3.c = function() {
            f2.__$f |= 1;
            f2.setState({});
          };
          return n3;
        })();
      }
      y(t2);
    }
    i2(n2);
  });
  g$1("__e", function(i2, n2, t2, r2) {
    if (m) window.__PREACT_SIGNALS_DEVTOOLS__.exitComponent();
    y();
    i2(n2, t2, r2);
  });
  g$1("diffed", function(i2, n2) {
    if (m && "function" == typeof n2.type) window.__PREACT_SIGNALS_DEVTOOLS__.exitComponent();
    y();
    var t2;
    if ("string" == typeof n2.type && (t2 = n2.__e)) {
      var r2 = n2.__np, f2 = n2.props;
      if (r2) {
        var o2 = t2.U;
        if (o2) for (var e2 in o2) {
          var u2 = o2[e2];
          if (void 0 !== u2 && !(e2 in r2)) {
            u2.d();
            o2[e2] = void 0;
          }
        }
        else {
          o2 = {};
          t2.U = o2;
        }
        for (var a2 in r2) {
          var c2 = o2[a2], v2 = r2[a2];
          if (void 0 === c2) {
            c2 = k$1(t2, a2, v2, f2);
            o2[a2] = c2;
          } else c2.o(v2, f2);
        }
      }
    }
    i2(n2);
  });
  function k$1(i2, n2, t2, r2) {
    var f2 = n2 in i2 && void 0 === i2.ownerSVGElement, o2 = d(t2);
    return { o: function(i3, n3) {
      o2.value = i3;
      r2 = n3;
    }, d: E$1(function() {
      this.N = M$1;
      var t3 = o2.value.value;
      if (r2[n2] !== t3) {
        r2[n2] = t3;
        if (f2) i2[n2] = t3;
        else if (null != t3 && (false !== t3 || "-" === n2[4])) i2.setAttribute(n2, t3);
        else i2.removeAttribute(n2);
      }
    }) };
  }
  g$1("unmount", function(i2, n2) {
    if ("string" == typeof n2.type) {
      var t2 = n2.__e;
      if (t2) {
        var r2 = t2.U;
        if (r2) {
          t2.U = void 0;
          for (var f2 in r2) {
            var o2 = r2[f2];
            if (o2) o2.d();
          }
        }
      }
    } else {
      var e2 = n2.__c;
      if (e2) {
        var u2 = e2.__$u;
        if (u2) {
          e2.__$u = void 0;
          u2.d();
        }
      }
    }
    i2(n2);
  });
  g$1("__h", function(i2, n2, t2, r2) {
    if (r2 < 3 || 9 === r2) n2.__$f |= 2;
    i2(n2, t2, r2);
  });
  preact.Component.prototype.shouldComponentUpdate = function(i2, n2) {
    var t2 = this.__$u, r2 = t2 && void 0 !== t2.s;
    for (var f2 in n2) return true;
    if (this.__f || "boolean" == typeof this.u && true === this.u) {
      var o2 = 2 & this.__$f;
      if (!(r2 || o2 || 4 & this.__$f)) return true;
      if (1 & this.__$f) return true;
    } else {
      if (!(r2 || 4 & this.__$f)) return true;
      if (3 & this.__$f) return true;
    }
    for (var e2 in i2) if ("__source" !== e2 && i2[e2] !== this.props[e2]) return true;
    for (var u2 in this.props) if (!(u2 in i2)) return true;
    return false;
  };
  function useSignal(i2, n2) {
    return d$1(function() {
      return d(i2, n2);
    })[0];
  }
  var A$1 = function(i2) {
    queueMicrotask(function() {
      queueMicrotask(i2);
    });
  };
  function F$1() {
    r(function() {
      var i2;
      while (i2 = _.shift()) h.call(i2);
    });
  }
  function M$1() {
    if (1 === _.push(this)) (preact.options.requestAnimationFrame || A$1)(F$1);
  }
  const _status = d("idle");
  const _message = d("");
  const _lastRun = d(0);
  const _nextRun = d(0);
  const _role = d("unknown");
  const _lastError = d(null);
  const _isLeader = w$1(() => _role.value === "leader");
  const autoSaveStore = {
status: _status,
    message: _message,
    lastRun: _lastRun,
    nextRun: _nextRun,
    role: _role,
    lastError: _lastError,
    isLeader: _isLeader,
setStatus(state, msg = "") {
      _status.value = state;
      _message.value = msg;
    },
    setRole(role) {
      _role.value = role;
    },
    setLastRun(time) {
      _lastRun.value = time;
    },
    setNextRun(time) {
      _nextRun.value = time;
    },
    setError(errorMsg) {
      _status.value = "error";
      _message.value = errorMsg;
      _lastError.value = errorMsg;
    },
    resetError() {
      if (_status.value === "error") {
        _status.value = "idle";
        _message.value = "";
      }
      _lastError.value = null;
    }
  };
  const STATE_LOCK_NAME = "chatgpt_exporter_state_mutex";
  const LEADER_LOCK_NAME = "chatgpt_exporter_autosave_leader";
  async function runExclusiveStateOp(callback) {
    if (!navigator.locks) {
      throw new Error("Web Locks API is not supported. AutoSave disabled.");
    }
    return navigator.locks.request(STATE_LOCK_NAME, { mode: "exclusive" }, async () => {
      try {
        return await callback();
      } catch (e2) {
        Logger.error("Mutex", "Error inside exclusive state operation", e2);
        throw e2;
      }
    });
  }
  async function tryAcquireLeader(onLeaderAcquired) {
    if (!navigator.locks) {
      throw new Error("Web Locks API is not supported. AutoSave disabled.");
    }
    const result = await navigator.locks.request(LEADER_LOCK_NAME, { ifAvailable: true }, async (lock) => {
      if (!lock) {
        return false;
      }
      Logger.info("Mutex", "Leader lock acquired. Starting AutoSave loop.");
      try {
        await onLeaderAcquired();
      } finally {
        Logger.info("Mutex", "Leader lock released.");
      }
      return true;
    });
    return result === true;
  }
  async function saveConversationToDisk(userFolder, conv, workspaceName, categoryName) {
    const id = conv.conversation_id;
    const wsFolder = await ensureFolder(userFolder, workspaceName);
    const catFolder = await ensureFolder(wsFolder, categoryName);
    const convFolder = await ensureFolder(catFolder, id);
    await writeFile(convFolder, "conversation.json", JSON.stringify(conv, null, 2));
    const meta = {
      id: conv.conversation_id,
      title: conv.title,
      create_time: conv.create_time,
      update_time: conv.update_time,
      model_slug: conv.default_model_slug,
      attachments: []
    };
    const candidates = collectFileCandidates(conv);
    if (candidates.length > 0) {
      const attFolder = await ensureFolder(convFolder, "attachments");
      for (const c2 of candidates) {
        try {
          let predictedName = "";
          if (c2.meta && (c2.meta.name || c2.meta.file_name)) {
            predictedName = sanitize(c2.meta.name || c2.meta.file_name);
          }
          if (predictedName && await fileExists(attFolder, predictedName)) {
            const mime = c2.meta?.mime_type || c2.meta?.mime || "application/octet-stream";
            meta.attachments.push({
              file_id: c2.file_id,
              name: predictedName,
              mime
            });
            Logger.debug("AutoSave", `Attachment exists (predicted): ${predictedName}`);
            continue;
          }
          const res = await downloadPointerOrFileAsBlob(c2);
          const safeName = sanitize(res.filename);
          if (predictedName !== safeName && await fileExists(attFolder, safeName)) {
            meta.attachments.push({
              file_id: c2.file_id,
              name: safeName,
              mime: res.mime
            });
            Logger.debug("AutoSave", `Attachment exists (resolved): ${safeName}`);
            continue;
          }
          await writeFile(attFolder, safeName, res.blob);
          meta.attachments.push({
            file_id: c2.file_id,
            name: safeName,
            mime: res.mime
          });
          Logger.debug("AutoSave", `Saved attachment: ${safeName}`);
        } catch (e2) {
          Logger.warn("AutoSave", "Failed to save attachment", c2, e2);
        }
      }
    }
    await writeFile(convFolder, "metadata.json", JSON.stringify(meta, null, 2));
  }
  async function runAutoSaveCycle() {
    if (autoSaveStore.status.value === "saving" || autoSaveStore.status.value === "checking") return;
    const rootHandle = await getRootHandle();
    if (!rootHandle) {
      autoSaveStore.setError("Auto-save not configured");
      return;
    }
    if (!await verifyPermission(rootHandle, true)) {
      autoSaveStore.setError("Permission denied");
      return;
    }
    autoSaveStore.setStatus("checking", "Checking for updates...");
    Logger.info("AutoSave", "Starting auto-save cycle");
    try {
      await runExclusiveStateOp(async () => {
        if (!Cred.userLabel) {
          throw new Error("User email not found (Strict Mode)");
        }
        const userFolder = await ensureFolder(rootHandle, Cred.userLabel);
        const state = await loadState(userFolder);
        if (state.user.id !== (Cred.accountId || "") || state.user.email !== Cred.userLabel) {
          state.user = {
            id: Cred.accountId || "",
            email: Cred.userLabel
          };
          await saveState(state, userFolder);
        }
        const candidates = [];
        const currentWorkspaceId = Cred.accountId;
        let currentWorkspaceKey = "personal";
        if (currentWorkspaceId && currentWorkspaceId !== "personal" && currentWorkspaceId !== "x") {
          currentWorkspaceKey = currentWorkspaceId;
        }
        await updateWorkspaceCheckTime(userFolder, currentWorkspaceKey);
        const personalPage = await listConversationsPage({ limit: 20, order: "updated" });
        if (personalPage?.items) {
          for (const item of personalPage.items) {
            const local = state.conversations[item.id];
            const remoteTime = new Date(item.update_time).getTime();
            let folderName = "Personal";
            if (item.workspace_id) {
              folderName = item.workspace_id;
            } else if (currentWorkspaceId && currentWorkspaceId !== "x") {
              folderName = currentWorkspaceId;
            }
            if (!local || remoteTime > local.update_time) {
              candidates.push({
                id: item.id,
                update_time: item.update_time,
                folder: folderName,
                workspaceKey: currentWorkspaceKey
              });
            }
          }
        }
        const sidebar = await listGizmosSidebar();
        const projects = new Set();
        if (sidebar?.gizmos) {
          sidebar.gizmos.forEach((g2) => g2.id && projects.add(g2.id));
        }
        if (sidebar?.items) {
          sidebar.items.forEach((it) => {
            const gid = it?.gizmo?.gizmo?.id || it?.gizmo?.id;
            if (gid) projects.add(gid);
          });
        }
        for (const pid of projects) {
          await updateGizmoCheckTime(userFolder, currentWorkspaceKey, pid);
          const projPage = await listProjectConversations({ projectId: pid, limit: 10 });
          if (projPage?.items) {
            for (const item of projPage.items) {
              const local = state.conversations[item.id];
              const remoteTime = item.update_time ? new Date(item.update_time).getTime() : Date.now();
              if (!local || remoteTime > local.update_time) {
                candidates.push({
                  id: item.id,
                  projectId: pid,
                  update_time: item.update_time,
                  folder: pid,
                  workspaceKey: currentWorkspaceKey
                });
              }
            }
          }
        }
        if (candidates.length === 0) {
          autoSaveStore.setStatus("idle", "No updates found");
          autoSaveStore.setLastRun(Date.now());
          Logger.info("AutoSave", "No updates found");
          return;
        }
        autoSaveStore.setStatus("saving", `Saving ${candidates.length} conversations...`);
        Logger.info("AutoSave", `Found ${candidates.length} updates`);
        const REGULAR_FOLDER = "conversations";
        for (let i2 = 0; i2 < candidates.length; i2++) {
          const c2 = candidates[i2];
          const category = c2.projectId || REGULAR_FOLDER;
          const typeStr = c2.projectId ? `[Gizmo ${c2.projectId}]` : `[${c2.workspaceKey}]`;
          autoSaveStore.setStatus("saving", `Saving ${i2 + 1}/${candidates.length}: ${typeStr} ${c2.id}`);
          Logger.info("AutoSave", `Saving ${c2.id} to ${c2.workspaceKey}/${category}`);
          const conv = await fetchConvWithRetry(c2.id, c2.projectId);
          let wsFolderName = "Personal";
          if (c2.workspaceKey && c2.workspaceKey !== "personal") {
            wsFolderName = c2.workspaceKey;
          }
          await saveConversationToDisk(userFolder, conv, wsFolderName, category);
          await updateConversationState(
            userFolder,
            c2.id,
            new Date(c2.update_time).getTime(),
            Date.now(),
            c2.workspaceKey,
            c2.projectId
          );
        }
        autoSaveStore.setStatus("idle", "All saved");
        autoSaveStore.setLastRun(Date.now());
        autoSaveStore.resetError();
        Logger.info("AutoSave", "Cycle completed successfully");
      });
    } catch (e2) {
      Logger.error("AutoSave", "Auto-save failed", e2);
      autoSaveStore.setError(e2.message || "Unknown error");
    }
  }
  const runAutoSave = runAutoSaveCycle;
  let stopRequested = false;
  let isStarted = false;
  let interruptSleep = null;
  let currentIntervalMs = 5 * 60 * 1e3;
  async function leaderLoop() {
    Logger.info("AutoSave", "I am the Leader. Starting loop.");
    while (!stopRequested) {
      const nextRun = Date.now() + currentIntervalMs;
      autoSaveStore.setNextRun(nextRun);
      await new Promise((resolve) => {
        interruptSleep = resolve;
        setTimeout(resolve, currentIntervalMs);
      });
      interruptSleep = null;
      if (stopRequested) break;
      await runAutoSaveCycle();
    }
  }
  async function startAutoSaveLoop(intervalMs = 5 * 60 * 1e3) {
    currentIntervalMs = intervalMs;
    if (isStarted) {
      if (autoSaveStore.role.value === "leader" && interruptSleep) {
        Logger.info("AutoSave", "Updating interval on running loop");
        interruptSleep();
      }
      return;
    }
    isStarted = true;
    stopRequested = false;
    Logger.info("AutoSave", `Initializing AutoSave system...`);
    autoSaveStore.setStatus("idle", "Starting...");
    attemptLeaderElection();
  }
  async function attemptLeaderElection() {
    if (stopRequested) return;
    try {
      const acquired = await tryAcquireLeader(async () => {
        autoSaveStore.setRole("leader");
        try {
          await runAutoSaveCycle();
          await leaderLoop();
        } finally {
          autoSaveStore.setRole("unknown");
        }
      });
      if (!acquired) {
        autoSaveStore.setRole("standby");
        autoSaveStore.setStatus("idle", "Standby: Another tab is auto-saving");
        autoSaveStore.setNextRun(0);
        setTimeout(() => attemptLeaderElection(), 1e4);
      } else {
        if (!stopRequested) {
          setTimeout(() => attemptLeaderElection(), 1e3);
        }
      }
    } catch (e2) {
      Logger.error("AutoSave", "Election error", e2);
      setTimeout(() => attemptLeaderElection(), 1e4);
    }
  }
  function stopAutoSaveLoop() {
    stopRequested = true;
    isStarted = false;
    if (interruptSleep) {
      interruptSleep();
      interruptSleep = null;
    }
    autoSaveStore.setStatus("disabled", "Auto-save disabled");
    Logger.info("AutoSave", "Stopping loop requested");
  }
  function useCredentialStatus() {
    const [status, setStatus] = d$1({ hasToken: false, hasAcc: false, userLabel: null, debug: "" });
    const refreshCredStatus = async () => {
      await Cred.ensureViaSession();
      await Cred.ensureAccountId();
      setStatus({
        hasToken: !!Cred.token,
        hasAcc: !!Cred.accountId,
        userLabel: Cred.userLabel,
        debug: Cred.debug
      });
    };
    y$2(() => {
      refreshCredStatus();
      const timer = setInterval(refreshCredStatus, 60 * 1e3);
      return () => clearInterval(timer);
    }, []);
    return { status, refreshCredStatus };
  }
  function useAutoSave() {
    const [state, setState] = d$1({
      status: autoSaveStore.status.value,
      message: autoSaveStore.message.value,
      lastRun: autoSaveStore.lastRun.value,
      nextRun: autoSaveStore.nextRun.value,
      role: autoSaveStore.role.value,
      isLeader: autoSaveStore.isLeader.value,
      lastError: autoSaveStore.lastError.value
    });
    y$2(() => {
      const dispose = E$1(() => {
        setState({
          status: autoSaveStore.status.value,
          message: autoSaveStore.message.value,
          lastRun: autoSaveStore.lastRun.value,
          nextRun: autoSaveStore.nextRun.value,
          role: autoSaveStore.role.value,
          isLeader: autoSaveStore.isLeader.value,
          lastError: autoSaveStore.lastError.value
        });
      });
      return dispose;
    }, []);
    return state;
  }
  function StatusPanel({ status, isOk }) {
    const [workspaceInfo, setWorkspaceInfo] = d$1("Checking...");
    y$2(() => {
      const updateWs = () => {
        if (!status.hasAcc) {
          setWorkspaceInfo("Checking...");
          return;
        }
        const acc = Cred.accountId;
        if (acc) {
          const workspaceType = acc === "personal" ? "Personal" : "Team";
          setWorkspaceInfo("Workspace: " + workspaceType);
        }
      };
      updateWs();
    }, [status.hasAcc]);
    return u$2("div", { className: "cgptx-mini-badges-col", children: [
u$2(
        "div",
        {
          className: `cgptx-mini-badge ${isOk ? "ok" : "bad"}`,
          id: "cgptx-mini-badge",
          title: status.debug,
          children: `Token: ${status.hasToken ? "✔" : "✖"} / Account id: ${status.hasAcc ? "✔" : "✖"}`
        }
      ),
u$2("div", { className: "cgptx-mini-badge info", title: "Current Workspace Context", children: workspaceInfo }),
      status.userLabel && u$2("div", { className: "cgptx-mini-badge info", title: "Current User", style: { maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
        "User: ",
        status.userLabel
      ] })
    ] });
  }
  function g(n2, t2) {
    for (var e2 in t2) n2[e2] = t2[e2];
    return n2;
  }
  function E(n2, t2) {
    for (var e2 in n2) if ("__source" !== e2 && !(e2 in t2)) return true;
    for (var r2 in t2) if ("__source" !== r2 && n2[r2] !== t2[r2]) return true;
    return false;
  }
  function C(n2, t2) {
    var e2 = t2(), r2 = d$1({ t: { __: e2, u: t2 } }), u2 = r2[0].t, o2 = r2[1];
    return _$2(function() {
      u2.__ = e2, u2.u = t2, x(u2) && o2({ t: u2 });
    }, [n2, e2, t2]), y$2(function() {
      return x(u2) && o2({ t: u2 }), n2(function() {
        x(u2) && o2({ t: u2 });
      });
    }, [n2]), e2;
  }
  function x(n2) {
    var t2, e2, r2 = n2.u, u2 = n2.__;
    try {
      var o2 = r2();
      return !((t2 = u2) === (e2 = o2) && (0 !== t2 || 1 / t2 == 1 / e2) || t2 != t2 && e2 != e2);
    } catch (n3) {
      return true;
    }
  }
  function R(n2) {
    n2();
  }
  function w(n2) {
    return n2;
  }
  function k() {
    return [false, R];
  }
  var I = _$2;
  function N(n2, t2) {
    this.props = n2, this.context = t2;
  }
  function M(n2, e2) {
    function r2(n3) {
      var t2 = this.props.ref, r3 = t2 == n3.ref;
      return !r3 && t2 && (t2.call ? t2(null) : t2.current = null), e2 ? !e2(this.props, n3) || !r3 : E(this.props, n3);
    }
    function u2(e3) {
      return this.shouldComponentUpdate = r2, preact.createElement(n2, e3);
    }
    return u2.displayName = "Memo(" + (n2.displayName || n2.name) + ")", u2.prototype.isReactComponent = true, u2.__f = true, u2.type = n2, u2;
  }
  (N.prototype = new preact.Component()).isPureReactComponent = true, N.prototype.shouldComponentUpdate = function(n2, t2) {
    return E(this.props, n2) || E(this.state, t2);
  };
  var T = preact.options.__b;
  preact.options.__b = function(n2) {
    n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T && T(n2);
  };
  var A = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
  function D(n2) {
    function t2(t3) {
      var e2 = g({}, t3);
      return delete e2.ref, n2(e2, t3.ref || null);
    }
    return t2.$$typeof = A, t2.render = n2, t2.prototype.isReactComponent = t2.__f = true, t2.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t2;
  }
  var L = function(n2, t2) {
    return null == n2 ? null : preact.toChildArray(preact.toChildArray(n2).map(t2));
  }, O = { map: L, forEach: L, count: function(n2) {
    return n2 ? preact.toChildArray(n2).length : 0;
  }, only: function(n2) {
    var t2 = preact.toChildArray(n2);
    if (1 !== t2.length) throw "Children.only";
    return t2[0];
  }, toArray: preact.toChildArray }, F = preact.options.__e;
  preact.options.__e = function(n2, t2, e2, r2) {
    if (n2.then) {
      for (var u2, o2 = t2; o2 = o2.__; ) if ((u2 = o2.__c) && u2.__c) return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k), u2.__c(n2, t2);
    }
    F(n2, t2, e2, r2);
  };
  var U = preact.options.unmount;
  function V(n2, t2, e2) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g({}, n2)).__c && (n2.__c.__P === e2 && (n2.__c.__P = t2), n2.__c.__e = true, n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return V(n3, t2, e2);
    })), n2;
  }
  function W(n2, t2, e2) {
    return n2 && e2 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return W(n3, t2, e2);
    }), n2.__c && n2.__c.__P === t2 && (n2.__e && e2.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e2)), n2;
  }
  function P() {
    this.__u = 0, this.o = null, this.__b = null;
  }
  function j(n2) {
    var t2 = n2.__.__c;
    return t2 && t2.__a && t2.__a(n2);
  }
  function z(n2) {
    var e2, r2, u2, o2 = null;
    function i2(i3) {
      if (e2 || (e2 = n2()).then(function(n3) {
        n3 && (o2 = n3.default || n3), u2 = true;
      }, function(n3) {
        r2 = n3, u2 = true;
      }), r2) throw r2;
      if (!u2) throw e2;
      return o2 ? preact.createElement(o2, i3) : null;
    }
    return i2.displayName = "Lazy", i2.__f = true, i2;
  }
  function B() {
    this.i = null, this.l = null;
  }
  preact.options.unmount = function(n2) {
    var t2 = n2.__c;
    t2 && t2.__R && t2.__R(), t2 && 32 & n2.__u && (n2.type = null), U && U(n2);
  }, (P.prototype = new preact.Component()).__c = function(n2, t2) {
    var e2 = t2.__c, r2 = this;
    null == r2.o && (r2.o = []), r2.o.push(e2);
    var u2 = j(r2.__v), o2 = false, i2 = function() {
      o2 || (o2 = true, e2.__R = null, u2 ? u2(l2) : l2());
    };
    e2.__R = i2;
    var l2 = function() {
      if (!--r2.__u) {
        if (r2.state.__a) {
          var n3 = r2.state.__a;
          r2.__v.__k[0] = W(n3, n3.__c.__P, n3.__c.__O);
        }
        var t3;
        for (r2.setState({ __a: r2.__b = null }); t3 = r2.o.pop(); ) t3.forceUpdate();
      }
    };
    r2.__u++ || 32 & t2.__u || r2.setState({ __a: r2.__b = r2.__v.__k[0] }), n2.then(i2, i2);
  }, P.prototype.componentWillUnmount = function() {
    this.o = [];
  }, P.prototype.render = function(n2, e2) {
    if (this.__b) {
      if (this.__v.__k) {
        var r2 = document.createElement("div"), o2 = this.__v.__k[0].__c;
        this.__v.__k[0] = V(this.__b, r2, o2.__O = o2.__P);
      }
      this.__b = null;
    }
    var i2 = e2.__a && preact.createElement(preact.Fragment, null, n2.fallback);
    return i2 && (i2.__u &= -33), [preact.createElement(preact.Fragment, null, e2.__a ? null : n2.children), i2];
  };
  var H = function(n2, t2, e2) {
    if (++e2[1] === e2[0] && n2.l.delete(t2), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size)) for (e2 = n2.i; e2; ) {
      for (; e2.length > 3; ) e2.pop()();
      if (e2[1] < e2[0]) break;
      n2.i = e2 = e2[2];
    }
  };
  function Z(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function Y(n2) {
    var e2 = this, r2 = n2.h;
    if (e2.componentWillUnmount = function() {
      preact.render(null, e2.v), e2.v = null, e2.h = null;
    }, e2.h && e2.h !== r2 && e2.componentWillUnmount(), !e2.v) {
      for (var u2 = e2.__v; null !== u2 && !u2.__m && null !== u2.__; ) u2 = u2.__;
      e2.h = r2, e2.v = { nodeType: 1, parentNode: r2, childNodes: [], __k: { __m: u2.__m }, contains: function() {
        return true;
      }, insertBefore: function(n3, t2) {
        this.childNodes.push(n3), e2.h.insertBefore(n3, t2);
      }, removeChild: function(n3) {
        this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e2.h.removeChild(n3);
      } };
    }
    preact.render(preact.createElement(Z, { context: e2.context }, n2.__v), e2.v);
  }
  function $(n2, e2) {
    var r2 = preact.createElement(Y, { __v: n2, h: e2 });
    return r2.containerInfo = e2, r2;
  }
  (B.prototype = new preact.Component()).__a = function(n2) {
    var t2 = this, e2 = j(t2.__v), r2 = t2.l.get(n2);
    return r2[0]++, function(u2) {
      var o2 = function() {
        t2.props.revealOrder ? (r2.push(u2), H(t2, n2, r2)) : u2();
      };
      e2 ? e2(o2) : o2();
    };
  }, B.prototype.render = function(n2) {
    this.i = null, this.l = new Map();
    var t2 = preact.toChildArray(n2.children);
    n2.revealOrder && "b" === n2.revealOrder[0] && t2.reverse();
    for (var e2 = t2.length; e2--; ) this.l.set(t2[e2], this.i = [1, 0, this.i]);
    return n2.children;
  }, B.prototype.componentDidUpdate = B.prototype.componentDidMount = function() {
    var n2 = this;
    this.l.forEach(function(t2, e2) {
      H(n2, e2, t2);
    });
  };
  var q = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, G = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, J = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, K = /[A-Z0-9]/g, Q = "undefined" != typeof document, X = function(n2) {
    return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
  };
  function nn(n2, t2, e2) {
    return null == t2.__k && (t2.textContent = ""), preact.render(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
  }
  function tn(n2, t2, e2) {
    return preact.hydrate(n2, t2), "function" == typeof e2 && e2(), n2 ? n2.__c : null;
  }
  preact.Component.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t2) {
    Object.defineProperty(preact.Component.prototype, t2, { configurable: true, get: function() {
      return this["UNSAFE_" + t2];
    }, set: function(n2) {
      Object.defineProperty(this, t2, { configurable: true, writable: true, value: n2 });
    } });
  });
  var en = preact.options.event;
  function rn() {
  }
  function un() {
    return this.cancelBubble;
  }
  function on() {
    return this.defaultPrevented;
  }
  preact.options.event = function(n2) {
    return en && (n2 = en(n2)), n2.persist = rn, n2.isPropagationStopped = un, n2.isDefaultPrevented = on, n2.nativeEvent = n2;
  };
  var ln, cn$1 = { enumerable: false, configurable: true, get: function() {
    return this.class;
  } }, fn = preact.options.vnode;
  preact.options.vnode = function(n2) {
    "string" == typeof n2.type && (function(n3) {
      var t2 = n3.props, e2 = n3.type, u2 = {}, o2 = -1 === e2.indexOf("-");
      for (var i2 in t2) {
        var l2 = t2[i2];
        if (!("value" === i2 && "defaultValue" in t2 && null == l2 || Q && "children" === i2 && "noscript" === e2 || "class" === i2 || "className" === i2)) {
          var c2 = i2.toLowerCase();
          "defaultValue" === i2 && "value" in t2 && null == t2.value ? i2 = "value" : "download" === i2 && true === l2 ? l2 = "" : "translate" === c2 && "no" === l2 ? l2 = false : "o" === c2[0] && "n" === c2[1] ? "ondoubleclick" === c2 ? i2 = "ondblclick" : "onchange" !== c2 || "input" !== e2 && "textarea" !== e2 || X(t2.type) ? "onfocus" === c2 ? i2 = "onfocusin" : "onblur" === c2 ? i2 = "onfocusout" : J.test(i2) && (i2 = c2) : c2 = i2 = "oninput" : o2 && G.test(i2) ? i2 = i2.replace(K, "-$&").toLowerCase() : null === l2 && (l2 = void 0), "oninput" === c2 && u2[i2 = c2] && (i2 = "oninputCapture"), u2[i2] = l2;
        }
      }
      "select" == e2 && u2.multiple && Array.isArray(u2.value) && (u2.value = preact.toChildArray(t2.children).forEach(function(n4) {
        n4.props.selected = -1 != u2.value.indexOf(n4.props.value);
      })), "select" == e2 && null != u2.defaultValue && (u2.value = preact.toChildArray(t2.children).forEach(function(n4) {
        n4.props.selected = u2.multiple ? -1 != u2.defaultValue.indexOf(n4.props.value) : u2.defaultValue == n4.props.value;
      })), t2.class && !t2.className ? (u2.class = t2.class, Object.defineProperty(u2, "className", cn$1)) : (t2.className && !t2.class || t2.class && t2.className) && (u2.class = u2.className = t2.className), n3.props = u2;
    })(n2), n2.$$typeof = q, fn && fn(n2);
  };
  var an = preact.options.__r;
  preact.options.__r = function(n2) {
    an && an(n2), ln = n2.__c;
  };
  var sn = preact.options.diffed;
  preact.options.diffed = function(n2) {
    sn && sn(n2);
    var t2 = n2.props, e2 = n2.__e;
    null != e2 && "textarea" === n2.type && "value" in t2 && t2.value !== e2.value && (e2.value = null == t2.value ? "" : t2.value), ln = null;
  };
  var hn = { ReactCurrentDispatcher: { current: { readContext: function(n2) {
    return ln.__n[n2.__c].props.value;
  }, useCallback: q$1, useContext: x$1, useDebugValue: P$1, useDeferredValue: w, useEffect: y$2, useId: g$3, useImperativeHandle: F$2, useInsertionEffect: I, useLayoutEffect: _$2, useMemo: T$1, useReducer: h$2, useRef: A$2, useState: d$1, useSyncExternalStore: C, useTransition: k } } };
  function dn(n2) {
    return preact.createElement.bind(null, n2);
  }
  function mn(n2) {
    return !!n2 && n2.$$typeof === q;
  }
  function pn(n2) {
    return mn(n2) && n2.type === preact.Fragment;
  }
  function yn(n2) {
    return !!n2 && !!n2.displayName && ("string" == typeof n2.displayName || n2.displayName instanceof String) && n2.displayName.startsWith("Memo(");
  }
  function _n(n2) {
    return mn(n2) ? preact.cloneElement.apply(null, arguments) : n2;
  }
  function bn(n2) {
    return !!n2.__k && (preact.render(null, n2), true);
  }
  function Sn(n2) {
    return n2 && (n2.base || 1 === n2.nodeType && n2) || null;
  }
  var gn = function(n2, t2) {
    return n2(t2);
  }, En = function(n2, t2) {
    return n2(t2);
  }, Cn = preact.Fragment, xn = mn, Rn = { useState: d$1, useId: g$3, useReducer: h$2, useEffect: y$2, useLayoutEffect: _$2, useInsertionEffect: I, useTransition: k, useDeferredValue: w, useSyncExternalStore: C, startTransition: R, useRef: A$2, useImperativeHandle: F$2, useMemo: T$1, useCallback: q$1, useContext: x$1, useDebugValue: P$1, version: "18.3.1", Children: O, render: nn, hydrate: tn, unmountComponentAtNode: bn, createPortal: $, createElement: preact.createElement, createContext: preact.createContext, createFactory: dn, cloneElement: _n, createRef: preact.createRef, Fragment: preact.Fragment, isValidElement: mn, isElement: xn, isFragment: pn, isMemo: yn, findDOMNode: Sn, Component: preact.Component, PureComponent: N, memo: M, forwardRef: D, flushSync: En, unstable_batchedUpdates: gn, StrictMode: Cn, Suspense: P, SuspenseList: B, lazy: z, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: hn };
  function __insertCSS(code) {
    if (typeof document == "undefined") return;
    let head = document.head || document.getElementsByTagName("head")[0];
    let style = document.createElement("style");
    style.type = "text/css";
    head.appendChild(style);
    style.styleSheet ? style.styleSheet.cssText = code : style.appendChild(document.createTextNode(code));
  }
  const getAsset = (type) => {
    switch (type) {
      case "success":
        return SuccessIcon;
      case "info":
        return InfoIcon;
      case "warning":
        return WarningIcon;
      case "error":
        return ErrorIcon;
      default:
        return null;
    }
  };
  const bars = Array(12).fill(0);
  const Loader = ({ visible, className }) => {
    return Rn.createElement("div", {
      className: [
        "sonner-loading-wrapper",
        className
      ].filter(Boolean).join(" "),
      "data-visible": visible
    }, Rn.createElement("div", {
      className: "sonner-spinner"
    }, bars.map((_2, i2) => Rn.createElement("div", {
      className: "sonner-loading-bar",
      key: `spinner-bar-${i2}`
    }))));
  };
  const SuccessIcon = Rn.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20"
  }, Rn.createElement("path", {
    fillRule: "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
    clipRule: "evenodd"
  }));
  const WarningIcon = Rn.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    height: "20",
    width: "20"
  }, Rn.createElement("path", {
    fillRule: "evenodd",
    d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
    clipRule: "evenodd"
  }));
  const InfoIcon = Rn.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20"
  }, Rn.createElement("path", {
    fillRule: "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
    clipRule: "evenodd"
  }));
  const ErrorIcon = Rn.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20"
  }, Rn.createElement("path", {
    fillRule: "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
    clipRule: "evenodd"
  }));
  const CloseIcon = Rn.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, Rn.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), Rn.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }));
  const useIsDocumentHidden = () => {
    const [isDocumentHidden, setIsDocumentHidden] = Rn.useState(document.hidden);
    Rn.useEffect(() => {
      const callback = () => {
        setIsDocumentHidden(document.hidden);
      };
      document.addEventListener("visibilitychange", callback);
      return () => window.removeEventListener("visibilitychange", callback);
    }, []);
    return isDocumentHidden;
  };
  let toastsCounter = 1;
  class Observer {
    constructor() {
      this.subscribe = (subscriber) => {
        this.subscribers.push(subscriber);
        return () => {
          const index = this.subscribers.indexOf(subscriber);
          this.subscribers.splice(index, 1);
        };
      };
      this.publish = (data) => {
        this.subscribers.forEach((subscriber) => subscriber(data));
      };
      this.addToast = (data) => {
        this.publish(data);
        this.toasts = [
          ...this.toasts,
          data
        ];
      };
      this.create = (data) => {
        var _data_id;
        const { message, ...rest } = data;
        const id = typeof (data == null ? void 0 : data.id) === "number" || ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0 ? data.id : toastsCounter++;
        const alreadyExists = this.toasts.find((toast2) => {
          return toast2.id === id;
        });
        const dismissible = data.dismissible === void 0 ? true : data.dismissible;
        if (this.dismissedToasts.has(id)) {
          this.dismissedToasts.delete(id);
        }
        if (alreadyExists) {
          this.toasts = this.toasts.map((toast2) => {
            if (toast2.id === id) {
              this.publish({
                ...toast2,
                ...data,
                id,
                title: message
              });
              return {
                ...toast2,
                ...data,
                id,
                dismissible,
                title: message
              };
            }
            return toast2;
          });
        } else {
          this.addToast({
            title: message,
            ...rest,
            dismissible,
            id
          });
        }
        return id;
      };
      this.dismiss = (id) => {
        if (id) {
          this.dismissedToasts.add(id);
          requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({
            id,
            dismiss: true
          })));
        } else {
          this.toasts.forEach((toast2) => {
            this.subscribers.forEach((subscriber) => subscriber({
              id: toast2.id,
              dismiss: true
            }));
          });
        }
        return id;
      };
      this.message = (message, data) => {
        return this.create({
          ...data,
          message
        });
      };
      this.error = (message, data) => {
        return this.create({
          ...data,
          message,
          type: "error"
        });
      };
      this.success = (message, data) => {
        return this.create({
          ...data,
          type: "success",
          message
        });
      };
      this.info = (message, data) => {
        return this.create({
          ...data,
          type: "info",
          message
        });
      };
      this.warning = (message, data) => {
        return this.create({
          ...data,
          type: "warning",
          message
        });
      };
      this.loading = (message, data) => {
        return this.create({
          ...data,
          type: "loading",
          message
        });
      };
      this.promise = (promise, data) => {
        if (!data) {
          return;
        }
        let id = void 0;
        if (data.loading !== void 0) {
          id = this.create({
            ...data,
            promise,
            type: "loading",
            message: data.loading,
            description: typeof data.description !== "function" ? data.description : void 0
          });
        }
        const p2 = Promise.resolve(promise instanceof Function ? promise() : promise);
        let shouldDismiss = id !== void 0;
        let result;
        const originalPromise = p2.then(async (response) => {
          result = [
            "resolve",
            response
          ];
          const isReactElementResponse = Rn.isValidElement(response);
          if (isReactElementResponse) {
            shouldDismiss = false;
            this.create({
              id,
              type: "default",
              message: response
            });
          } else if (isHttpResponse(response) && !response.ok) {
            shouldDismiss = false;
            const promiseData = typeof data.error === "function" ? await data.error(`HTTP error! status: ${response.status}`) : data.error;
            const description = typeof data.description === "function" ? await data.description(`HTTP error! status: ${response.status}`) : data.description;
            const isExtendedResult = typeof promiseData === "object" && !Rn.isValidElement(promiseData);
            const toastSettings = isExtendedResult ? promiseData : {
              message: promiseData
            };
            this.create({
              id,
              type: "error",
              description,
              ...toastSettings
            });
          } else if (response instanceof Error) {
            shouldDismiss = false;
            const promiseData = typeof data.error === "function" ? await data.error(response) : data.error;
            const description = typeof data.description === "function" ? await data.description(response) : data.description;
            const isExtendedResult = typeof promiseData === "object" && !Rn.isValidElement(promiseData);
            const toastSettings = isExtendedResult ? promiseData : {
              message: promiseData
            };
            this.create({
              id,
              type: "error",
              description,
              ...toastSettings
            });
          } else if (data.success !== void 0) {
            shouldDismiss = false;
            const promiseData = typeof data.success === "function" ? await data.success(response) : data.success;
            const description = typeof data.description === "function" ? await data.description(response) : data.description;
            const isExtendedResult = typeof promiseData === "object" && !Rn.isValidElement(promiseData);
            const toastSettings = isExtendedResult ? promiseData : {
              message: promiseData
            };
            this.create({
              id,
              type: "success",
              description,
              ...toastSettings
            });
          }
        }).catch(async (error) => {
          result = [
            "reject",
            error
          ];
          if (data.error !== void 0) {
            shouldDismiss = false;
            const promiseData = typeof data.error === "function" ? await data.error(error) : data.error;
            const description = typeof data.description === "function" ? await data.description(error) : data.description;
            const isExtendedResult = typeof promiseData === "object" && !Rn.isValidElement(promiseData);
            const toastSettings = isExtendedResult ? promiseData : {
              message: promiseData
            };
            this.create({
              id,
              type: "error",
              description,
              ...toastSettings
            });
          }
        }).finally(() => {
          if (shouldDismiss) {
            this.dismiss(id);
            id = void 0;
          }
          data.finally == null ? void 0 : data.finally.call(data);
        });
        const unwrap = () => new Promise((resolve, reject) => originalPromise.then(() => result[0] === "reject" ? reject(result[1]) : resolve(result[1])).catch(reject));
        if (typeof id !== "string" && typeof id !== "number") {
          return {
            unwrap
          };
        } else {
          return Object.assign(id, {
            unwrap
          });
        }
      };
      this.custom = (jsx, data) => {
        const id = (data == null ? void 0 : data.id) || toastsCounter++;
        this.create({
          jsx: jsx(id),
          id,
          ...data
        });
        return id;
      };
      this.getActiveToasts = () => {
        return this.toasts.filter((toast2) => !this.dismissedToasts.has(toast2.id));
      };
      this.subscribers = [];
      this.toasts = [];
      this.dismissedToasts = new Set();
    }
  }
  const ToastState = new Observer();
  const toastFunction = (message, data) => {
    const id = (data == null ? void 0 : data.id) || toastsCounter++;
    ToastState.addToast({
      title: message,
      ...data,
      id
    });
    return id;
  };
  const isHttpResponse = (data) => {
    return data && typeof data === "object" && "ok" in data && typeof data.ok === "boolean" && "status" in data && typeof data.status === "number";
  };
  const basicToast = toastFunction;
  const getHistory = () => ToastState.toasts;
  const getToasts = () => ToastState.getActiveToasts();
  const toast = Object.assign(basicToast, {
    success: ToastState.success,
    info: ToastState.info,
    warning: ToastState.warning,
    error: ToastState.error,
    custom: ToastState.custom,
    message: ToastState.message,
    promise: ToastState.promise,
    dismiss: ToastState.dismiss,
    loading: ToastState.loading
  }, {
    getHistory,
    getToasts
  });
  __insertCSS("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
  function isAction(action) {
    return action.label !== void 0;
  }
  const VISIBLE_TOASTS_AMOUNT = 3;
  const VIEWPORT_OFFSET = "24px";
  const MOBILE_VIEWPORT_OFFSET = "16px";
  const TOAST_LIFETIME = 4e3;
  const TOAST_WIDTH = 356;
  const GAP = 14;
  const SWIPE_THRESHOLD = 45;
  const TIME_BEFORE_UNMOUNT = 200;
  function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  function getDefaultSwipeDirections(position) {
    const [y2, x2] = position.split("-");
    const directions = [];
    if (y2) {
      directions.push(y2);
    }
    if (x2) {
      directions.push(x2);
    }
    return directions;
  }
  const Toast = (props) => {
    var _toast_classNames, _toast_classNames1, _toast_classNames2, _toast_classNames3, _toast_classNames4, _toast_classNames5, _toast_classNames6, _toast_classNames7, _toast_classNames8;
    const { invert: ToasterInvert, toast: toast2, unstyled, interacting, setHeights, visibleToasts, heights, index, toasts, expanded, removeToast, defaultRichColors, closeButton: closeButtonFromToaster, style, cancelButtonStyle, actionButtonStyle, className = "", descriptionClassName = "", duration: durationFromToaster, position, gap, expandByDefault, classNames, icons, closeButtonAriaLabel = "Close toast" } = props;
    const [swipeDirection, setSwipeDirection] = Rn.useState(null);
    const [swipeOutDirection, setSwipeOutDirection] = Rn.useState(null);
    const [mounted, setMounted] = Rn.useState(false);
    const [removed, setRemoved] = Rn.useState(false);
    const [swiping, setSwiping] = Rn.useState(false);
    const [swipeOut, setSwipeOut] = Rn.useState(false);
    const [isSwiped, setIsSwiped] = Rn.useState(false);
    const [offsetBeforeRemove, setOffsetBeforeRemove] = Rn.useState(0);
    const [initialHeight, setInitialHeight] = Rn.useState(0);
    const remainingTime = Rn.useRef(toast2.duration || durationFromToaster || TOAST_LIFETIME);
    const dragStartTime = Rn.useRef(null);
    const toastRef = Rn.useRef(null);
    const isFront = index === 0;
    const isVisible = index + 1 <= visibleToasts;
    const toastType = toast2.type;
    const dismissible = toast2.dismissible !== false;
    const toastClassname = toast2.className || "";
    const toastDescriptionClassname = toast2.descriptionClassName || "";
    const heightIndex = Rn.useMemo(() => heights.findIndex((height) => height.toastId === toast2.id) || 0, [
      heights,
      toast2.id
    ]);
    const closeButton = Rn.useMemo(() => {
      var _toast_closeButton;
      return (_toast_closeButton = toast2.closeButton) != null ? _toast_closeButton : closeButtonFromToaster;
    }, [
      toast2.closeButton,
      closeButtonFromToaster
    ]);
    const duration = Rn.useMemo(() => toast2.duration || durationFromToaster || TOAST_LIFETIME, [
      toast2.duration,
      durationFromToaster
    ]);
    const closeTimerStartTimeRef = Rn.useRef(0);
    const offset = Rn.useRef(0);
    const lastCloseTimerStartTimeRef = Rn.useRef(0);
    const pointerStartRef = Rn.useRef(null);
    const [y2, x2] = position.split("-");
    const toastsHeightBefore = Rn.useMemo(() => {
      return heights.reduce((prev, curr, reducerIndex) => {
        if (reducerIndex >= heightIndex) {
          return prev;
        }
        return prev + curr.height;
      }, 0);
    }, [
      heights,
      heightIndex
    ]);
    const isDocumentHidden = useIsDocumentHidden();
    const invert = toast2.invert || ToasterInvert;
    const disabled = toastType === "loading";
    offset.current = Rn.useMemo(() => heightIndex * gap + toastsHeightBefore, [
      heightIndex,
      toastsHeightBefore
    ]);
    Rn.useEffect(() => {
      remainingTime.current = duration;
    }, [
      duration
    ]);
    Rn.useEffect(() => {
      setMounted(true);
    }, []);
    Rn.useEffect(() => {
      const toastNode = toastRef.current;
      if (toastNode) {
        const height = toastNode.getBoundingClientRect().height;
        setInitialHeight(height);
        setHeights((h2) => [
          {
            toastId: toast2.id,
            height,
            position: toast2.position
          },
          ...h2
        ]);
        return () => setHeights((h2) => h2.filter((height2) => height2.toastId !== toast2.id));
      }
    }, [
      setHeights,
      toast2.id
    ]);
    Rn.useLayoutEffect(() => {
      if (!mounted) return;
      const toastNode = toastRef.current;
      const originalHeight = toastNode.style.height;
      toastNode.style.height = "auto";
      const newHeight = toastNode.getBoundingClientRect().height;
      toastNode.style.height = originalHeight;
      setInitialHeight(newHeight);
      setHeights((heights2) => {
        const alreadyExists = heights2.find((height) => height.toastId === toast2.id);
        if (!alreadyExists) {
          return [
            {
              toastId: toast2.id,
              height: newHeight,
              position: toast2.position
            },
            ...heights2
          ];
        } else {
          return heights2.map((height) => height.toastId === toast2.id ? {
            ...height,
            height: newHeight
          } : height);
        }
      });
    }, [
      mounted,
      toast2.title,
      toast2.description,
      setHeights,
      toast2.id,
      toast2.jsx,
      toast2.action,
      toast2.cancel
    ]);
    const deleteToast = Rn.useCallback(() => {
      setRemoved(true);
      setOffsetBeforeRemove(offset.current);
      setHeights((h2) => h2.filter((height) => height.toastId !== toast2.id));
      setTimeout(() => {
        removeToast(toast2);
      }, TIME_BEFORE_UNMOUNT);
    }, [
      toast2,
      removeToast,
      setHeights,
      offset
    ]);
    Rn.useEffect(() => {
      if (toast2.promise && toastType === "loading" || toast2.duration === Infinity || toast2.type === "loading") return;
      let timeoutId;
      const pauseTimer = () => {
        if (lastCloseTimerStartTimeRef.current < closeTimerStartTimeRef.current) {
          const elapsedTime = ( new Date()).getTime() - closeTimerStartTimeRef.current;
          remainingTime.current = remainingTime.current - elapsedTime;
        }
        lastCloseTimerStartTimeRef.current = ( new Date()).getTime();
      };
      const startTimer = () => {
        if (remainingTime.current === Infinity) return;
        closeTimerStartTimeRef.current = ( new Date()).getTime();
        timeoutId = setTimeout(() => {
          toast2.onAutoClose == null ? void 0 : toast2.onAutoClose.call(toast2, toast2);
          deleteToast();
        }, remainingTime.current);
      };
      if (expanded || interacting || isDocumentHidden) {
        pauseTimer();
      } else {
        startTimer();
      }
      return () => clearTimeout(timeoutId);
    }, [
      expanded,
      interacting,
      toast2,
      toastType,
      isDocumentHidden,
      deleteToast
    ]);
    Rn.useEffect(() => {
      if (toast2.delete) {
        deleteToast();
        toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
      }
    }, [
      deleteToast,
      toast2.delete
    ]);
    function getLoadingIcon() {
      var _toast_classNames9;
      if (icons == null ? void 0 : icons.loading) {
        var _toast_classNames12;
        return Rn.createElement("div", {
          className: cn(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames12 = toast2.classNames) == null ? void 0 : _toast_classNames12.loader, "sonner-loader"),
          "data-visible": toastType === "loading"
        }, icons.loading);
      }
      return Rn.createElement(Loader, {
        className: cn(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames9 = toast2.classNames) == null ? void 0 : _toast_classNames9.loader),
        visible: toastType === "loading"
      });
    }
    const icon = toast2.icon || (icons == null ? void 0 : icons[toastType]) || getAsset(toastType);
    var _toast_richColors, _icons_close;
    return Rn.createElement("li", {
      tabIndex: 0,
      ref: toastRef,
      className: cn(className, toastClassname, classNames == null ? void 0 : classNames.toast, toast2 == null ? void 0 : (_toast_classNames = toast2.classNames) == null ? void 0 : _toast_classNames.toast, classNames == null ? void 0 : classNames.default, classNames == null ? void 0 : classNames[toastType], toast2 == null ? void 0 : (_toast_classNames1 = toast2.classNames) == null ? void 0 : _toast_classNames1[toastType]),
      "data-sonner-toast": "",
      "data-rich-colors": (_toast_richColors = toast2.richColors) != null ? _toast_richColors : defaultRichColors,
      "data-styled": !Boolean(toast2.jsx || toast2.unstyled || unstyled),
      "data-mounted": mounted,
      "data-promise": Boolean(toast2.promise),
      "data-swiped": isSwiped,
      "data-removed": removed,
      "data-visible": isVisible,
      "data-y-position": y2,
      "data-x-position": x2,
      "data-index": index,
      "data-front": isFront,
      "data-swiping": swiping,
      "data-dismissible": dismissible,
      "data-type": toastType,
      "data-invert": invert,
      "data-swipe-out": swipeOut,
      "data-swipe-direction": swipeOutDirection,
      "data-expanded": Boolean(expanded || expandByDefault && mounted),
      "data-testid": toast2.testId,
      style: {
        "--index": index,
        "--toasts-before": index,
        "--z-index": toasts.length - index,
        "--offset": `${removed ? offsetBeforeRemove : offset.current}px`,
        "--initial-height": expandByDefault ? "auto" : `${initialHeight}px`,
        ...style,
        ...toast2.style
      },
      onDragEnd: () => {
        setSwiping(false);
        setSwipeDirection(null);
        pointerStartRef.current = null;
      },
      onPointerDown: (event) => {
        if (event.button === 2) return;
        if (disabled || !dismissible) return;
        dragStartTime.current = new Date();
        setOffsetBeforeRemove(offset.current);
        event.target.setPointerCapture(event.pointerId);
        if (event.target.tagName === "BUTTON") return;
        setSwiping(true);
        pointerStartRef.current = {
          x: event.clientX,
          y: event.clientY
        };
      },
      onPointerUp: () => {
        var _toastRef_current, _toastRef_current1, _dragStartTime_current;
        if (swipeOut || !dismissible) return;
        pointerStartRef.current = null;
        const swipeAmountX = Number(((_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0);
        const swipeAmountY = Number(((_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0);
        const timeTaken = ( new Date()).getTime() - ((_dragStartTime_current = dragStartTime.current) == null ? void 0 : _dragStartTime_current.getTime());
        const swipeAmount = swipeDirection === "x" ? swipeAmountX : swipeAmountY;
        const velocity = Math.abs(swipeAmount) / timeTaken;
        if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
          setOffsetBeforeRemove(offset.current);
          toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
          if (swipeDirection === "x") {
            setSwipeOutDirection(swipeAmountX > 0 ? "right" : "left");
          } else {
            setSwipeOutDirection(swipeAmountY > 0 ? "down" : "up");
          }
          deleteToast();
          setSwipeOut(true);
          return;
        } else {
          var _toastRef_current2, _toastRef_current3;
          (_toastRef_current2 = toastRef.current) == null ? void 0 : _toastRef_current2.style.setProperty("--swipe-amount-x", `0px`);
          (_toastRef_current3 = toastRef.current) == null ? void 0 : _toastRef_current3.style.setProperty("--swipe-amount-y", `0px`);
        }
        setIsSwiped(false);
        setSwiping(false);
        setSwipeDirection(null);
      },
      onPointerMove: (event) => {
        var _window_getSelection, _toastRef_current, _toastRef_current1;
        if (!pointerStartRef.current || !dismissible) return;
        const isHighlighted = ((_window_getSelection = window.getSelection()) == null ? void 0 : _window_getSelection.toString().length) > 0;
        if (isHighlighted) return;
        const yDelta = event.clientY - pointerStartRef.current.y;
        const xDelta = event.clientX - pointerStartRef.current.x;
        var _props_swipeDirections;
        const swipeDirections = (_props_swipeDirections = props.swipeDirections) != null ? _props_swipeDirections : getDefaultSwipeDirections(position);
        if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
          setSwipeDirection(Math.abs(xDelta) > Math.abs(yDelta) ? "x" : "y");
        }
        let swipeAmount = {
          x: 0,
          y: 0
        };
        const getDampening = (delta) => {
          const factor = Math.abs(delta) / 20;
          return 1 / (1.5 + factor);
        };
        if (swipeDirection === "y") {
          if (swipeDirections.includes("top") || swipeDirections.includes("bottom")) {
            if (swipeDirections.includes("top") && yDelta < 0 || swipeDirections.includes("bottom") && yDelta > 0) {
              swipeAmount.y = yDelta;
            } else {
              const dampenedDelta = yDelta * getDampening(yDelta);
              swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
            }
          }
        } else if (swipeDirection === "x") {
          if (swipeDirections.includes("left") || swipeDirections.includes("right")) {
            if (swipeDirections.includes("left") && xDelta < 0 || swipeDirections.includes("right") && xDelta > 0) {
              swipeAmount.x = xDelta;
            } else {
              const dampenedDelta = xDelta * getDampening(xDelta);
              swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
            }
          }
        }
        if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
          setIsSwiped(true);
        }
        (_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.setProperty("--swipe-amount-x", `${swipeAmount.x}px`);
        (_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.setProperty("--swipe-amount-y", `${swipeAmount.y}px`);
      }
    }, closeButton && !toast2.jsx && toastType !== "loading" ? Rn.createElement("button", {
      "aria-label": closeButtonAriaLabel,
      "data-disabled": disabled,
      "data-close-button": true,
      onClick: disabled || !dismissible ? () => {
      } : () => {
        deleteToast();
        toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
      },
      className: cn(classNames == null ? void 0 : classNames.closeButton, toast2 == null ? void 0 : (_toast_classNames2 = toast2.classNames) == null ? void 0 : _toast_classNames2.closeButton)
    }, (_icons_close = icons == null ? void 0 : icons.close) != null ? _icons_close : CloseIcon) : null, (toastType || toast2.icon || toast2.promise) && toast2.icon !== null && ((icons == null ? void 0 : icons[toastType]) !== null || toast2.icon) ? Rn.createElement("div", {
      "data-icon": "",
      className: cn(classNames == null ? void 0 : classNames.icon, toast2 == null ? void 0 : (_toast_classNames3 = toast2.classNames) == null ? void 0 : _toast_classNames3.icon)
    }, toast2.promise || toast2.type === "loading" && !toast2.icon ? toast2.icon || getLoadingIcon() : null, toast2.type !== "loading" ? icon : null) : null, Rn.createElement("div", {
      "data-content": "",
      className: cn(classNames == null ? void 0 : classNames.content, toast2 == null ? void 0 : (_toast_classNames4 = toast2.classNames) == null ? void 0 : _toast_classNames4.content)
    }, Rn.createElement("div", {
      "data-title": "",
      className: cn(classNames == null ? void 0 : classNames.title, toast2 == null ? void 0 : (_toast_classNames5 = toast2.classNames) == null ? void 0 : _toast_classNames5.title)
    }, toast2.jsx ? toast2.jsx : typeof toast2.title === "function" ? toast2.title() : toast2.title), toast2.description ? Rn.createElement("div", {
      "data-description": "",
      className: cn(descriptionClassName, toastDescriptionClassname, classNames == null ? void 0 : classNames.description, toast2 == null ? void 0 : (_toast_classNames6 = toast2.classNames) == null ? void 0 : _toast_classNames6.description)
    }, typeof toast2.description === "function" ? toast2.description() : toast2.description) : null), Rn.isValidElement(toast2.cancel) ? toast2.cancel : toast2.cancel && isAction(toast2.cancel) ? Rn.createElement("button", {
      "data-button": true,
      "data-cancel": true,
      style: toast2.cancelButtonStyle || cancelButtonStyle,
      onClick: (event) => {
        if (!isAction(toast2.cancel)) return;
        if (!dismissible) return;
        toast2.cancel.onClick == null ? void 0 : toast2.cancel.onClick.call(toast2.cancel, event);
        deleteToast();
      },
      className: cn(classNames == null ? void 0 : classNames.cancelButton, toast2 == null ? void 0 : (_toast_classNames7 = toast2.classNames) == null ? void 0 : _toast_classNames7.cancelButton)
    }, toast2.cancel.label) : null, Rn.isValidElement(toast2.action) ? toast2.action : toast2.action && isAction(toast2.action) ? Rn.createElement("button", {
      "data-button": true,
      "data-action": true,
      style: toast2.actionButtonStyle || actionButtonStyle,
      onClick: (event) => {
        if (!isAction(toast2.action)) return;
        toast2.action.onClick == null ? void 0 : toast2.action.onClick.call(toast2.action, event);
        if (event.defaultPrevented) return;
        deleteToast();
      },
      className: cn(classNames == null ? void 0 : classNames.actionButton, toast2 == null ? void 0 : (_toast_classNames8 = toast2.classNames) == null ? void 0 : _toast_classNames8.actionButton)
    }, toast2.action.label) : null);
  };
  function getDocumentDirection() {
    if (typeof window === "undefined") return "ltr";
    if (typeof document === "undefined") return "ltr";
    const dirAttribute = document.documentElement.getAttribute("dir");
    if (dirAttribute === "auto" || !dirAttribute) {
      return window.getComputedStyle(document.documentElement).direction;
    }
    return dirAttribute;
  }
  function assignOffset(defaultOffset, mobileOffset) {
    const styles = {};
    [
      defaultOffset,
      mobileOffset
    ].forEach((offset, index) => {
      const isMobile = index === 1;
      const prefix = isMobile ? "--mobile-offset" : "--offset";
      const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
      function assignAll(offset2) {
        [
          "top",
          "right",
          "bottom",
          "left"
        ].forEach((key) => {
          styles[`${prefix}-${key}`] = typeof offset2 === "number" ? `${offset2}px` : offset2;
        });
      }
      if (typeof offset === "number" || typeof offset === "string") {
        assignAll(offset);
      } else if (typeof offset === "object") {
        [
          "top",
          "right",
          "bottom",
          "left"
        ].forEach((key) => {
          if (offset[key] === void 0) {
            styles[`${prefix}-${key}`] = defaultValue;
          } else {
            styles[`${prefix}-${key}`] = typeof offset[key] === "number" ? `${offset[key]}px` : offset[key];
          }
        });
      } else {
        assignAll(defaultValue);
      }
    });
    return styles;
  }
  const Toaster$1 = Rn.forwardRef(function Toaster(props, ref) {
    const { id, invert, position = "bottom-right", hotkey = [
      "altKey",
      "KeyT"
    ], expand, closeButton, className, offset, mobileOffset, theme = "light", richColors, duration, style, visibleToasts = VISIBLE_TOASTS_AMOUNT, toastOptions, dir = getDocumentDirection(), gap = GAP, icons, containerAriaLabel = "Notifications" } = props;
    const [toasts, setToasts] = Rn.useState([]);
    const filteredToasts = Rn.useMemo(() => {
      if (id) {
        return toasts.filter((toast2) => toast2.toasterId === id);
      }
      return toasts.filter((toast2) => !toast2.toasterId);
    }, [
      toasts,
      id
    ]);
    const possiblePositions = Rn.useMemo(() => {
      return Array.from(new Set([
        position
      ].concat(filteredToasts.filter((toast2) => toast2.position).map((toast2) => toast2.position))));
    }, [
      filteredToasts,
      position
    ]);
    const [heights, setHeights] = Rn.useState([]);
    const [expanded, setExpanded] = Rn.useState(false);
    const [interacting, setInteracting] = Rn.useState(false);
    const [actualTheme, setActualTheme] = Rn.useState(theme !== "system" ? theme : typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : "light");
    const listRef = Rn.useRef(null);
    const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
    const lastFocusedElementRef = Rn.useRef(null);
    const isFocusWithinRef = Rn.useRef(false);
    const removeToast = Rn.useCallback((toastToRemove) => {
      setToasts((toasts2) => {
        var _toasts_find;
        if (!((_toasts_find = toasts2.find((toast2) => toast2.id === toastToRemove.id)) == null ? void 0 : _toasts_find.delete)) {
          ToastState.dismiss(toastToRemove.id);
        }
        return toasts2.filter(({ id: id2 }) => id2 !== toastToRemove.id);
      });
    }, []);
    Rn.useEffect(() => {
      return ToastState.subscribe((toast2) => {
        if (toast2.dismiss) {
          requestAnimationFrame(() => {
            setToasts((toasts2) => toasts2.map((t2) => t2.id === toast2.id ? {
              ...t2,
              delete: true
            } : t2));
          });
          return;
        }
        setTimeout(() => {
          Rn.flushSync(() => {
            setToasts((toasts2) => {
              const indexOfExistingToast = toasts2.findIndex((t2) => t2.id === toast2.id);
              if (indexOfExistingToast !== -1) {
                return [
                  ...toasts2.slice(0, indexOfExistingToast),
                  {
                    ...toasts2[indexOfExistingToast],
                    ...toast2
                  },
                  ...toasts2.slice(indexOfExistingToast + 1)
                ];
              }
              return [
                toast2,
                ...toasts2
              ];
            });
          });
        });
      });
    }, [
      toasts
    ]);
    Rn.useEffect(() => {
      if (theme !== "system") {
        setActualTheme(theme);
        return;
      }
      if (theme === "system") {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          setActualTheme("dark");
        } else {
          setActualTheme("light");
        }
      }
      if (typeof window === "undefined") return;
      const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      try {
        darkMediaQuery.addEventListener("change", ({ matches }) => {
          if (matches) {
            setActualTheme("dark");
          } else {
            setActualTheme("light");
          }
        });
      } catch (error) {
        darkMediaQuery.addListener(({ matches }) => {
          try {
            if (matches) {
              setActualTheme("dark");
            } else {
              setActualTheme("light");
            }
          } catch (e2) {
            console.error(e2);
          }
        });
      }
    }, [
      theme
    ]);
    Rn.useEffect(() => {
      if (toasts.length <= 1) {
        setExpanded(false);
      }
    }, [
      toasts
    ]);
    Rn.useEffect(() => {
      const handleKeyDown = (event) => {
        var _listRef_current;
        const isHotkeyPressed = hotkey.every((key) => event[key] || event.code === key);
        if (isHotkeyPressed) {
          var _listRef_current1;
          setExpanded(true);
          (_listRef_current1 = listRef.current) == null ? void 0 : _listRef_current1.focus();
        }
        if (event.code === "Escape" && (document.activeElement === listRef.current || ((_listRef_current = listRef.current) == null ? void 0 : _listRef_current.contains(document.activeElement)))) {
          setExpanded(false);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [
      hotkey
    ]);
    Rn.useEffect(() => {
      if (listRef.current) {
        return () => {
          if (lastFocusedElementRef.current) {
            lastFocusedElementRef.current.focus({
              preventScroll: true
            });
            lastFocusedElementRef.current = null;
            isFocusWithinRef.current = false;
          }
        };
      }
    }, [
      listRef.current
    ]);
    return (

Rn.createElement("section", {
        ref,
        "aria-label": `${containerAriaLabel} ${hotkeyLabel}`,
        tabIndex: -1,
        "aria-live": "polite",
        "aria-relevant": "additions text",
        "aria-atomic": "false",
        suppressHydrationWarning: true
      }, possiblePositions.map((position2, index) => {
        var _heights_;
        const [y2, x2] = position2.split("-");
        if (!filteredToasts.length) return null;
        return Rn.createElement("ol", {
          key: position2,
          dir: dir === "auto" ? getDocumentDirection() : dir,
          tabIndex: -1,
          ref: listRef,
          className,
          "data-sonner-toaster": true,
          "data-sonner-theme": actualTheme,
          "data-y-position": y2,
          "data-x-position": x2,
          style: {
            "--front-toast-height": `${((_heights_ = heights[0]) == null ? void 0 : _heights_.height) || 0}px`,
            "--width": `${TOAST_WIDTH}px`,
            "--gap": `${gap}px`,
            ...style,
            ...assignOffset(offset, mobileOffset)
          },
          onBlur: (event) => {
            if (isFocusWithinRef.current && !event.currentTarget.contains(event.relatedTarget)) {
              isFocusWithinRef.current = false;
              if (lastFocusedElementRef.current) {
                lastFocusedElementRef.current.focus({
                  preventScroll: true
                });
                lastFocusedElementRef.current = null;
              }
            }
          },
          onFocus: (event) => {
            const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
            if (isNotDismissible) return;
            if (!isFocusWithinRef.current) {
              isFocusWithinRef.current = true;
              lastFocusedElementRef.current = event.relatedTarget;
            }
          },
          onMouseEnter: () => setExpanded(true),
          onMouseMove: () => setExpanded(true),
          onMouseLeave: () => {
            if (!interacting) {
              setExpanded(false);
            }
          },
          onDragEnd: () => setExpanded(false),
          onPointerDown: (event) => {
            const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
            if (isNotDismissible) return;
            setInteracting(true);
          },
          onPointerUp: () => setInteracting(false)
        }, filteredToasts.filter((toast2) => !toast2.position && index === 0 || toast2.position === position2).map((toast2, index2) => {
          var _toastOptions_duration, _toastOptions_closeButton;
          return Rn.createElement(Toast, {
            key: toast2.id,
            icons,
            index: index2,
            toast: toast2,
            defaultRichColors: richColors,
            duration: (_toastOptions_duration = toastOptions == null ? void 0 : toastOptions.duration) != null ? _toastOptions_duration : duration,
            className: toastOptions == null ? void 0 : toastOptions.className,
            descriptionClassName: toastOptions == null ? void 0 : toastOptions.descriptionClassName,
            invert,
            visibleToasts,
            closeButton: (_toastOptions_closeButton = toastOptions == null ? void 0 : toastOptions.closeButton) != null ? _toastOptions_closeButton : closeButton,
            interacting,
            position: position2,
            style: toastOptions == null ? void 0 : toastOptions.style,
            unstyled: toastOptions == null ? void 0 : toastOptions.unstyled,
            classNames: toastOptions == null ? void 0 : toastOptions.classNames,
            cancelButtonStyle: toastOptions == null ? void 0 : toastOptions.cancelButtonStyle,
            actionButtonStyle: toastOptions == null ? void 0 : toastOptions.actionButtonStyle,
            closeButtonAriaLabel: toastOptions == null ? void 0 : toastOptions.closeButtonAriaLabel,
            removeToast,
            toasts: filteredToasts.filter((t2) => t2.position == toast2.position),
            heights: heights.filter((h2) => h2.position == toast2.position),
            setHeights,
            expandByDefault: expand,
            gap,
            expanded,
            swipeDirections: props.swipeDirections
          });
        }));
      }))
    );
  });
  function ExportJsonButton({ refreshCredStatus, onDataFetched }) {
    const [busy, setBusy] = d$1(false);
    const [title, setTitle] = d$1("导出当前对话 JSON");
    const handleJsonExport = async () => {
      const id = convId();
      const pid = projectId();
      if (!id) {
        toast.error("未检测到会话 ID，请在具体对话页面使用（URL 中应包含 /c/xxxx）。");
        return;
      }
      setBusy(true);
      setTitle("导出中…");
      try {
        await refreshCredStatus();
        if (!Cred.token) throw new Error("没有有效的 accessToken");
        const data = await fetchConversation(id, pid || void 0);
        if (onDataFetched) onDataFetched(data);
        const safeTitle = sanitize(data?.title || "");
        const filename = `${safeTitle || "chat"}_${id}.json`;
        saveJSON(data, filename);
        setTitle("导出完成 ✅（点击可重新导出）");
        toast.success("导出 JSON 完成");
      } catch (e2) {
        console.error("[ChatGPT-Multimodal-Exporter] 导出失败：", e2);
        toast.error("导出失败: " + (e2 && e2.message ? e2.message : e2));
        setTitle("导出失败 ❌（点击重试）");
      } finally {
        setBusy(false);
      }
    };
    return u$2(
      "button",
      {
        id: "cgptx-mini-btn",
        className: "cgptx-mini-btn",
        title,
        onClick: handleJsonExport,
        disabled: busy,
        children: u$2("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", children: [
u$2("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
u$2("polyline", { points: "7 10 12 15 17 10" }),
u$2("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
        ] })
      }
    );
  }
  function Checkbox({ checked, indeterminate, onChange, label, disabled, className = "" }) {
    const inputRef = A$2(null);
    y$2(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);
    return u$2("label", { className: `cgptx-checkbox-wrapper ${disabled ? "disabled" : ""} ${className}`, children: [
u$2("div", { className: "cgptx-checkbox-input-wrapper", children: [
u$2(
          "input",
          {
            ref: inputRef,
            type: "checkbox",
            className: "cgptx-checkbox-input",
            checked,
            disabled,
            onChange: (e2) => onChange(e2.currentTarget.checked)
          }
        ),
u$2("div", { className: "cgptx-checkbox-custom", children: [
u$2("svg", { viewBox: "0 0 24 24", className: "cgptx-checkbox-icon check", children: u$2("polyline", { points: "20 6 9 17 4 12" }) }),
u$2("svg", { viewBox: "0 0 24 24", className: "cgptx-checkbox-icon minus", children: u$2("line", { x1: "5", y1: "12", x2: "19", y2: "12" }) })
        ] })
      ] }),
      label && u$2("span", { className: "cgptx-checkbox-label", children: label })
    ] });
  }
  function FilePreviewDialog({ candidates, onConfirm, onClose }) {
    const [selectedIndices, setSelectedIndices] = d$1(
      new Set(candidates.map((_2, i2) => i2))
    );
    const toggleSelect = (idx) => {
      const next = new Set(selectedIndices);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      setSelectedIndices(next);
    };
    const toggleAll = () => {
      if (selectedIndices.size === candidates.length) {
        setSelectedIndices( new Set());
      } else {
        setSelectedIndices(new Set(candidates.map((_2, i2) => i2)));
      }
    };
    const handleConfirm = () => {
      const selected = candidates.filter((_2, i2) => selectedIndices.has(i2));
      if (selected.length === 0) {
        toast.error("请至少选择一个文件");
        return;
      }
      onConfirm(selected);
      onClose();
    };
    return u$2("div", { className: "cgptx-modal", onClick: (e2) => e2.target === e2.currentTarget && onClose(), children: u$2("div", { className: "cgptx-modal-box", children: [
u$2("div", { className: "cgptx-modal-header", children: [
u$2("div", { className: "cgptx-modal-title", children: [
          "可下载文件 (",
          candidates.length,
          ")"
        ] }),
u$2("div", { className: "cgptx-modal-actions", children: [
u$2("button", { className: "cgptx-btn", onClick: toggleAll, children: "全选/反选" }),
u$2("button", { className: "cgptx-btn primary", onClick: handleConfirm, children: "下载选中" }),
u$2("button", { className: "cgptx-btn", onClick: onClose, children: "关闭" })
        ] })
      ] }),
u$2("div", { className: "cgptx-list", children: candidates.map((info, idx) => {
        const name = info.meta && (info.meta.name || info.meta.file_name) || info.file_id || info.pointer || "未命名";
        const mime = info.meta && (info.meta.mime_type || info.meta.file_type) || info.meta && info.meta.mime || "";
        const size = info.meta?.size_bytes || info.meta?.size || info.meta?.file_size || info.meta?.file_size_bytes || null;
        const metaParts = [];
        metaParts.push(`来源: ${info.source || "未知"}`);
        if (info.file_id) metaParts.push(`file_id: ${info.file_id}`);
        if (info.pointer && info.pointer !== info.file_id) metaParts.push(`pointer: ${info.pointer}`);
        if (mime) metaParts.push(`mime: ${mime}`);
        if (size) metaParts.push(`大小: ${formatBytes(size)}`);
        return u$2("div", { className: "cgptx-item", children: [
u$2(
            Checkbox,
            {
              checked: selectedIndices.has(idx),
              onChange: () => toggleSelect(idx)
            }
          ),
u$2("div", {}),
u$2("div", { children: [
u$2("div", { className: "title", children: name }),
u$2("div", { className: "meta", children: metaParts.join(" • ") })
          ] })
        ] }, idx);
      }) }),
u$2("div", { className: "cgptx-modal-actions", style: { justifyContent: "flex-end" }, children: u$2("div", { className: "cgptx-chip", children: "点击“下载选中”将按列表顺序依次下载（含 /files 和 CDN 指针）" }) })
    ] }) });
  }
  function showFilePreviewDialog(candidates, onConfirm) {
    const root = document.createElement("div");
    document.body.appendChild(root);
    const close = () => {
      preact.render(null, root);
      root.remove();
    };
    preact.render(preact.h(FilePreviewDialog, {
      candidates,
      onConfirm,
      onClose: close
    }), root);
  }
  function DownloadFilesButton({ refreshCredStatus, cachedData, onDataFetched }) {
    const [busy, setBusy] = d$1(false);
    const [title, setTitle] = d$1("下载当前对话中可识别的文件/指针");
    const handleFilesDownload = async () => {
      const id = convId();
      const pid = projectId();
      if (!id) {
        toast.error("未检测到会话 ID，请在具体对话页面使用（URL 中应包含 /c/xxxx）。");
        return;
      }
      setBusy(true);
      setTitle("下载文件中…");
      try {
        await refreshCredStatus();
        if (!Cred.token) throw new Error("没有有效的 accessToken");
        let data = cachedData;
        if (!data || data.conversation_id !== id) {
          data = await fetchConversation(id, pid || void 0);
          if (onDataFetched) onDataFetched(data);
        }
        const cands = collectFileCandidates(data);
        if (!cands.length) {
          toast.info("未找到可下载的文件/指针。");
          setTitle("未找到文件");
          setBusy(false);
          return;
        }
        showFilePreviewDialog(cands, async (selected) => {
          setBusy(true);
          setTitle(`下载中 (${selected.length})…`);
          try {
            const res = await downloadSelectedFiles(selected);
            setTitle(`完成 ${res.ok}/${res.total}（可再次点击）`);
            toast.success(`文件下载完成，成功 ${res.ok}/${res.total}`);
          } catch (e2) {
            console.error("[ChatGPT-Multimodal-Exporter] 下载失败：", e2);
            toast.error("下载失败: " + (e2 && e2.message ? e2.message : e2));
            setTitle("下载失败 ❌");
          } finally {
            setBusy(false);
          }
        });
        setBusy(false);
      } catch (e2) {
        console.error("[ChatGPT-Multimodal-Exporter] 下载失败：", e2);
        toast.error("下载失败: " + (e2 && e2.message ? e2.message : e2));
        setTitle("下载失败 ❌");
        setBusy(false);
      }
    };
    return u$2(
      "button",
      {
        id: "cgptx-mini-btn-files",
        className: "cgptx-mini-btn",
        title,
        onClick: handleFilesDownload,
        disabled: busy,
        children: u$2("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", children: [
u$2("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
u$2("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
u$2("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })
        ] })
      }
    );
  }
  function AutoSaveSettings({ status, onClose }) {
    const [loading, setLoading] = d$1(true);
    const [effectiveEnabled, setEffectiveEnabled] = d$1(false);
    const [pendingEnabled, setPendingEnabled] = d$1(false);
    const [pendingInterval, setPendingInterval] = d$1(5);
    const [debug, setDebug] = d$1(Logger.isDebug());
    const [rootPath, setRootPath] = d$1("");
    y$2(() => {
      getRootHandle().then((h2) => {
        const hasSetting = localStorage.getItem("chatgpt_exporter_autosave_enabled") !== null;
        const storedEnabled = localStorage.getItem("chatgpt_exporter_autosave_enabled") === "true";
        const storedInterval = localStorage.getItem("chatgpt_exporter_autosave_interval");
        const initialInterval = storedInterval ? parseInt(storedInterval, 10) : 5;
        setPendingInterval(initialInterval);
        const isEnabledEffectively = !!h2 && (hasSetting ? storedEnabled : true);
        setEffectiveEnabled(isEnabledEffectively);
        setPendingEnabled(isEnabledEffectively);
        setRootPath(h2 ? h2.name : "未选择");
        setLoading(false);
      });
    }, []);
    const handleSaveSettings = async () => {
      localStorage.setItem("chatgpt_exporter_autosave_enabled", String(pendingEnabled));
      localStorage.setItem("chatgpt_exporter_autosave_interval", String(pendingInterval));
      if (!pendingEnabled) {
        if (effectiveEnabled) {
          stopAutoSaveLoop();
          toast.info("自动保存已暂停");
        }
      } else {
        const h2 = await getRootHandle();
        if (!h2) {
          const newHandle = await pickAndSaveRootHandle();
          if (newHandle) {
            setRootPath(newHandle.name);
            startAutoSaveLoop(pendingInterval * 60 * 1e3);
            toast.success("自动保存已开启");
          } else {
            setPendingEnabled(false);
            return;
          }
        } else {
          startAutoSaveLoop(pendingInterval * 60 * 1e3);
          toast.success("设置已保存");
        }
      }
      setEffectiveEnabled(pendingEnabled);
      onClose();
    };
    const handleDebugChange = (e2) => {
      const val = e2.target.checked;
      setDebug(val);
      Logger.setDebug(val);
    };
    const changeFolder = async () => {
      const h2 = await pickAndSaveRootHandle();
      if (h2) {
        setRootPath(h2.name);
        toast.success("保存目录已更新");
      }
    };
    if (loading) return null;
    return u$2("div", { className: "cgptx-dialog-overlay", onClick: onClose, children: [
u$2("div", { className: "cgptx-dialog-content", onClick: (e2) => e2.stopPropagation(), children: [
u$2("div", { className: "cgptx-dialog-header", children: [
u$2("h3", { children: "自动保存设置" }),
u$2("button", { className: "cgptx-close-btn", onClick: onClose, children: "×" })
        ] }),
u$2("div", { className: "cgptx-dialog-body", children: [
u$2("div", { className: "cgptx-setting-row", children: [
u$2("label", { children: "状态:" }),
u$2("span", { className: `cgptx-status-badge ${status.state}`, children: status.state === "idle" ? "空闲" : status.state === "checking" ? "检查中..." : status.state === "saving" ? "保存中..." : status.state === "disabled" ? "已禁用" : "错误" })
          ] }),
          status.message && u$2("div", { className: "cgptx-status-msg", children: status.message }),
          status.lastRun > 0 && u$2("div", { className: "cgptx-status-time", children: [
            "上次运行: ",
            new Date(status.lastRun).toLocaleString()
          ] }),
u$2("hr", { className: "cgptx-divider" }),
u$2("div", { className: "cgptx-setting-row", children: [
u$2("label", { children: "启用自动保存" }),
u$2(
              "input",
              {
                type: "checkbox",
                checked: pendingEnabled,
                onChange: (e2) => setPendingEnabled(e2.target.checked)
              }
            )
          ] }),
u$2("div", { className: "cgptx-setting-row", style: !pendingEnabled ? { opacity: 0.5 } : {}, children: [
u$2("label", { children: "保存间隔 (分钟)" }),
u$2(
              "input",
              {
                type: "number",
                min: "1",
                value: pendingInterval,
                onChange: (e2) => setPendingInterval(parseInt(e2.target.value, 10)),
                disabled: !pendingEnabled
              }
            )
          ] }),
u$2("div", { className: "cgptx-setting-row", children: [
u$2("label", { children: "保存目录" }),
u$2("div", { className: "cgptx-folder-display", children: [
u$2("span", { children: rootPath }),
u$2("button", { className: "cgptx-btn-sm", onClick: changeFolder, children: "更改" })
            ] })
          ] }),
u$2("div", { className: "cgptx-setting-row", children: [
u$2("label", { children: "调试模式 (实时生效)" }),
u$2("input", { type: "checkbox", checked: debug, onChange: handleDebugChange })
          ] }),
u$2("div", { className: "cgptx-actions", style: { justifyContent: "space-between" }, children: [
u$2(
              "button",
              {
                className: "cgptx-btn-secondary",
                onClick: () => {
                  runAutoSave();
                  toast.info("已触发立即保存");
                },
                disabled: status.state !== "idle" && status.state !== "error",
                children: "立即运行"
              }
            ),
u$2(
              "button",
              {
                className: "cgptx-btn-primary",
                onClick: handleSaveSettings,
                children: "保存设置"
              }
            )
          ] })
        ] })
      ] }),
u$2("style", { children: `
                .cgptx-dialog-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); z-index: 10000;
                    display: flex; align-items: center; justify-content: center;
                }
                .cgptx-dialog-content {
                    background: white; padding: 20px; border-radius: 12px;
                    width: 360px; max-width: 90vw;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .cgptx-dialog-header {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 16px;
                }
                .cgptx-dialog-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
                .cgptx-close-btn {
                    background: none; border: none; font-size: 24px; cursor: pointer; color: #666;
                }
                .cgptx-setting-row {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 12px; font-size: 14px;
                }
                .cgptx-divider { border: 0; border-top: 1px solid #eee; margin: 16px 0; }
                .cgptx-status-badge {
                    padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;
                }
                .cgptx-status-badge.idle { background: #f3f4f6; color: #374151; }
                .cgptx-status-badge.checking { background: #dbeafe; color: #1e40af; }
                .cgptx-status-badge.saving { background: #dcfce7; color: #166534; }
                .cgptx-status-badge.error { background: #fee2e2; color: #991b1b; }
                .cgptx-status-badge.disabled { background: #f3f4f6; color: #9ca3af; border: 1px solid #eee; }
                .cgptx-status-msg { font-size: 12px; color: #666; margin-bottom: 4px; }
                .cgptx-status-time { font-size: 12px; color: #999; }
                .cgptx-folder-display { display: flex; align-items: center; gap: 8px; max-width: 60%; }
                .cgptx-folder-display span { 
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: #666;
                }
                .cgptx-btn-sm {
                    padding: 2px 8px; font-size: 12px; border: 1px solid #ddd; background: #fff; border-radius: 4px; cursor: pointer;
                }
                .cgptx-actions { margin-top: 20px; display: flex; }
                .cgptx-btn-primary {
                    background: #10a37f; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500;
                }
                .cgptx-btn-secondary {
                    background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500;
                }
                .cgptx-btn-primary:disabled, .cgptx-btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }
                input[type="number"] { width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; }
                input[type="number"]:disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }
            ` })
    ] });
  }
  function buildProjectFolderNames(projects) {
    const map = new Map();
    const counts = {};
    projects.forEach((p2) => {
      const base = sanitize(p2.projectName || p2.projectId || "project");
      counts[base] = (counts[base] || 0) + 1;
    });
    projects.forEach((p2) => {
      let baseName = sanitize(p2.projectName || p2.projectId || "project");
      if (counts[baseName] > 1) {
        const stamp = p2.createdAt ? p2.createdAt.replace(/[^\d]/g, "").slice(0, 14) : "";
        if (stamp) {
          const raw = p2.projectName || baseName;
          baseName = sanitize(`${raw}_${stamp}`);
        }
      }
      map.set(p2.projectId, baseName || "project");
    });
    return map;
  }
  async function runBatchExport({
    tasks,
    projects,
    rootIds,
    includeAttachments = true,
    concurrency = BATCH_CONCURRENCY,
    progressCb,
    cancelRef
  }) {
    if (!tasks || !tasks.length) throw new Error("任务列表为空");
    if (typeof JSZip === "undefined") throw new Error("JSZip 未加载");
    const zip = new JSZip();
    const summary = {
      exported_at: ( new Date()).toISOString(),
      total_conversations: tasks.length,
      root: { count: rootIds.length, ids: rootIds },
      projects: (projects || []).map((p2) => ({
        projectId: p2.projectId,
        projectName: p2.projectName || "",
        createdAt: p2.createdAt || "",
        count: Array.isArray(p2.convs) ? p2.convs.length : 0
      })),
      failed: { conversations: [], attachments: [] }
    };
    const folderNameByProjectId = buildProjectFolderNames(projects || []);
    const projCache = new Map();
    const results = await fetchConversationsBatch(tasks, concurrency, progressCb, cancelRef);
    if (cancelRef && cancelRef.cancel) throw new Error("用户已取消");
    let idxRoot = 0;
    const projSeq = {};
    for (let i2 = 0; i2 < tasks.length; i2++) {
      if (cancelRef && cancelRef.cancel) throw new Error("用户已取消");
      const t2 = tasks[i2];
      const data = results[i2];
      if (!data) {
        summary.failed.conversations.push({
          id: t2.id,
          projectId: t2.projectId || "",
          reason: "为空"
        });
        continue;
      }
      const isProject = !!t2.projectId;
      let baseFolder = zip;
      let seq = "";
      if (isProject && t2.projectId) {
        const fname = folderNameByProjectId.get(t2.projectId) || sanitize(t2.projectId || "project");
        let cache = projCache.get(t2.projectId);
        if (!cache) {
          cache = zip.folder(fname);
          projCache.set(t2.projectId, cache);
        }
        baseFolder = cache || zip;
        projSeq[t2.projectId] = (projSeq[t2.projectId] || 0) + 1;
        seq = String(projSeq[t2.projectId]).padStart(3, "0");
      } else {
        idxRoot++;
        seq = String(idxRoot).padStart(3, "0");
      }
      const title = sanitize(data?.title || "");
      const convFolderName = `${seq}_${title || "chat"}_${t2.id}`;
      const convFolder = baseFolder ? baseFolder.folder(convFolderName) : null;
      if (!convFolder) {
        continue;
      }
      convFolder.file("conversation.json", JSON.stringify(data, null, 2));
      const convMeta = {
        id: data.conversation_id || t2.id,
        title: data.title || "",
        create_time: data.create_time,
        update_time: data.update_time,
        model_slug: data.default_model_slug,
        attachments: [],
        failed_attachments: []
      };
      if (includeAttachments) {
        const candidates = collectFileCandidates(data).map((x2) => ({
          ...x2,
          project_id: t2.projectId || ""
        }));
        if (candidates.length > 0) {
          const attFolder = convFolder.folder("attachments");
          const usedNames = new Set();
          for (const c2 of candidates) {
            if (cancelRef && cancelRef.cancel) throw new Error("用户已取消");
            const pointerKey = c2.pointer || c2.file_id || "";
            const originalName = c2.meta && (c2.meta.name || c2.meta.file_name) || "";
            let finalName = "";
            try {
              const res = await downloadPointerOrFileAsBlob(c2);
              finalName = res.filename || `${sanitize(pointerKey) || "file"}.bin`;
              if (usedNames.has(finalName)) {
                let cnt = 2;
                while (usedNames.has(`${cnt}_${finalName}`)) cnt++;
                finalName = `${cnt}_${finalName}`;
              }
              usedNames.add(finalName);
              if (attFolder) attFolder.file(finalName, res.blob);
              convMeta.attachments.push({
                pointer: c2.pointer || "",
                file_id: c2.file_id || "",
                original_name: originalName,
                saved_as: finalName,
                size_bytes: c2.meta?.size_bytes || c2.meta?.size || c2.meta?.file_size || c2.meta?.file_size_bytes || null,
                mime: res.mime || c2.meta?.mime_type || "",
                source: c2.source || ""
              });
            } catch (e2) {
              const errorMsg = e2 && e2.message ? e2.message : String(e2);
              convMeta.failed_attachments.push({
                pointer: c2.pointer || "",
                file_id: c2.file_id || "",
                error: errorMsg
              });
              summary.failed.attachments.push({
                conversation_id: data.conversation_id || t2.id,
                project_id: t2.projectId || "",
                pointer: c2.pointer || c2.file_id || "",
                error: errorMsg
              });
            }
          }
        }
      }
      convFolder.file("metadata.json", JSON.stringify(convMeta, null, 2));
      if (progressCb) progressCb(80 + Math.round((i2 + 1) / tasks.length * 15), `处理：${i2 + 1}/${tasks.length}`);
    }
    zip.file("summary.json", JSON.stringify(summary, null, 2));
    if (progressCb) progressCb(98, "压缩中…");
    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 7 }
    });
    return blob;
  }
  function BatchExportDialog({ onClose }) {
    const loading = useSignal(true);
    const error = useSignal(null);
    const listData = useSignal(null);
    const groups = useSignal([]);
    const selectedSet = useSignal( new Set());
    const includeAttachments = useSignal(true);
    const exporting = useSignal(false);
    const progress = useSignal(null);
    const statusText = useSignal("加载会话列表…");
    const cancelRef = A$2({ cancel: false });
    const makeKey = (projectId2, id) => `${projectId2 || "root"}::${id}`;
    const parseKey = (key) => {
      const idx = key.indexOf("::");
      const pid = key.slice(0, idx);
      const id = key.slice(idx + 2);
      return { id, projectId: pid === "root" ? null : pid };
    };
    y$2(() => {
      loadData();
    }, []);
    const loadData = async () => {
      try {
        const res = await collectAllConversationTasks((pct, text) => {
          progress.value = { pct, text };
        });
        listData.value = res;
        const newGroups = [];
        const rootsList = getRootsList(res);
        if (rootsList.length) {
          newGroups.push({ label: "无项目", projectId: null, items: rootsList, collapsed: false });
        }
        (res.projects || []).forEach((p2) => {
          const convs = Array.isArray(p2.convs) ? p2.convs : [];
          newGroups.push({
            label: p2.projectName || p2.projectId || "未命名项目",
            projectId: p2.projectId,
            items: convs,
            collapsed: false
          });
        });
        groups.value = newGroups;
        const initialSet = new Set();
        rootsList.forEach((it) => initialSet.add(makeKey(null, it.id)));
        (res.projects || []).forEach((p2) => {
          (p2.convs || []).forEach((c2) => initialSet.add(makeKey(p2.projectId, c2.id)));
        });
        selectedSet.value = initialSet;
        loading.value = false;
        progress.value = null;
        statusText.value = `共 ${newGroups.reduce((n2, g2) => n2 + g2.items.length, 0)} 条，已选 ${initialSet.size}`;
      } catch (e2) {
        console.error("[ChatGPT-Multimodal-Exporter] 拉取列表失败", e2);
        error.value = e2.message || String(e2);
        statusText.value = "拉取列表失败";
      }
    };
    const getRootsList = (data) => {
      if (data && Array.isArray(data.roots) && data.roots.length) return data.roots;
      if (data && Array.isArray(data.rootIds) && data.rootIds.length)
        return data.rootIds.map((id) => ({ id, title: id }));
      return [];
    };
    const toggleGroupCollapse = (idx) => {
      const newGroups = [...groups.value];
      newGroups[idx].collapsed = !newGroups[idx].collapsed;
      groups.value = newGroups;
    };
    const toggleGroupSelect = (group, checked) => {
      const newSet = new Set(selectedSet.value);
      const keys = group.items.map((it) => makeKey(group.projectId, it.id));
      if (checked) {
        keys.forEach((k2) => newSet.add(k2));
      } else {
        keys.forEach((k2) => newSet.delete(k2));
      }
      selectedSet.value = newSet;
      statusText.value = `已选 ${newSet.size} 条`;
    };
    const toggleItemSelect = (key) => {
      const newSet = new Set(selectedSet.value);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      selectedSet.value = newSet;
      statusText.value = `已选 ${newSet.size} 条`;
    };
    const toggleAll = () => {
      if (!listData.value) return;
      const allKeys = [];
      groups.value.forEach((g2) => g2.items.forEach((it) => allKeys.push(makeKey(g2.projectId, it.id))));
      const allChecked = allKeys.every((k2) => selectedSet.value.has(k2));
      const newSet = new Set(selectedSet.value);
      if (allChecked) {
        allKeys.forEach((k2) => newSet.delete(k2));
      } else {
        allKeys.forEach((k2) => newSet.add(k2));
      }
      selectedSet.value = newSet;
      statusText.value = `已选 ${newSet.size} 条`;
    };
    const startExport = async () => {
      if (!listData.value) return;
      const tasks = Array.from(selectedSet.value).map((k2) => parseKey(k2)).filter((t2) => !!t2.id);
      if (!tasks.length) {
        toast.error("请至少选择一条会话");
        return;
      }
      cancelRef.current.cancel = false;
      exporting.value = true;
      statusText.value = "准备导出…";
      progress.value = { pct: 0, text: "准备中" };
      const projectMapForTasks = new Map();
      (listData.value.projects || []).forEach((p2) => projectMapForTasks.set(p2.projectId, p2));
      const seenProj = new Set();
      const selectedProjects = [];
      tasks.forEach((t2) => {
        if (!t2.projectId) return;
        if (seenProj.has(t2.projectId)) return;
        seenProj.add(t2.projectId);
        const p2 = projectMapForTasks.get(t2.projectId);
        if (p2) selectedProjects.push(p2);
      });
      const selectedRootIds = tasks.filter((t2) => !t2.projectId).map((t2) => t2.id);
      try {
        const blob = await runBatchExport({
          tasks,
          projects: selectedProjects,
          rootIds: selectedRootIds,
          includeAttachments: includeAttachments.value,
          concurrency: BATCH_CONCURRENCY,
          progressCb: (pct, txt) => {
            progress.value = { pct, text: txt };
          },
          cancelRef: cancelRef.current
        });
        if (cancelRef.current.cancel) {
          statusText.value = "已取消";
          toast.info("批量导出已取消");
          return;
        }
        const ts = ( new Date()).toISOString().replace(/[:.]/g, "-");
        saveBlob(blob, `chatgpt-batch-${ts}.zip`);
        progress.value = { pct: 100, text: "完成" };
        statusText.value = "完成 ✅（已下载 ZIP）";
        toast.success("批量导出完成");
      } catch (e2) {
        console.error("[ChatGPT-Multimodal-Exporter] 批量导出失败", e2);
        toast.error("批量导出失败：" + (e2 && e2.message ? e2.message : e2));
        statusText.value = "失败";
      } finally {
        exporting.value = false;
        cancelRef.current.cancel = false;
      }
    };
    const handleStop = () => {
      cancelRef.current.cancel = true;
      statusText.value = "请求取消中…";
    };
    return u$2("div", { className: "cgptx-modal", onClick: (e2) => e2.target === e2.currentTarget && onClose(), children: u$2("div", { className: "cgptx-modal-box", children: [
u$2("div", { className: "cgptx-modal-header", children: [
u$2("div", { className: "cgptx-modal-title", children: "批量导出对话（JSON + 附件）" }),
u$2("div", { className: "cgptx-modal-actions", children: [
u$2("button", { className: "cgptx-btn", onClick: toggleAll, disabled: exporting.value || loading.value, children: "全选/反选" }),
u$2("button", { className: "cgptx-btn primary", onClick: startExport, disabled: exporting.value || loading.value, children: "开始导出" }),
u$2("button", { className: "cgptx-btn", onClick: handleStop, disabled: !exporting.value, children: "停止" }),
u$2("button", { className: "cgptx-btn", onClick: onClose, children: "关闭" })
        ] })
      ] }),
u$2("div", { className: "cgptx-chip", children: statusText.value }),
u$2("div", { className: "cgptx-modal-actions", style: { justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap", gap: "10px" }, children: u$2(
        Checkbox,
        {
          checked: includeAttachments.value,
          onChange: (checked) => includeAttachments.value = checked,
          disabled: exporting.value,
          label: "包含附件（ZIP）"
        }
      ) }),
u$2("div", { className: "cgptx-list", style: { maxHeight: "46vh", overflow: "auto", border: "1px solid #e5e7eb", borderRadius: "10px" }, children: [
        loading.value && u$2("div", { className: "cgptx-item", style: { display: "flex", justifyContent: "center", padding: "20px" }, children: progress.value ? u$2("div", { style: { width: "100%", textAlign: "center" }, children: [
u$2("div", { children: [
            progress.value.text,
            " (",
            Math.round(progress.value.pct),
            "%)"
          ] }),
u$2("div", { className: "cgptx-progress-track", style: { marginTop: "10px" }, children: u$2("div", { className: "cgptx-progress-bar", style: { width: `${progress.value.pct}%` } }) })
        ] }) : u$2("div", { children: "加载中..." }) }),
        error.value && u$2("div", { className: "cgptx-item", style: { color: "red" }, children: error.value }),
        !loading.value && !error.value && groups.value.map((group, gIdx) => {
          const groupKeys = group.items.map((it) => makeKey(group.projectId, it.id));
          const checkedCount = groupKeys.filter((k2) => selectedSet.value.has(k2)).length;
          const isAll = checkedCount === groupKeys.length && groupKeys.length > 0;
          const isIndeterminate = checkedCount > 0 && checkedCount < groupKeys.length;
          return u$2("div", { className: "cgptx-group", children: [
u$2("div", { className: "cgptx-group-header", children: [
u$2(
                Checkbox,
                {
                  checked: isAll,
                  indeterminate: isIndeterminate,
                  onChange: (checked) => toggleGroupSelect(group, checked)
                }
              ),
u$2(
                "span",
                {
                  className: "cgptx-arrow",
                  onClick: () => toggleGroupCollapse(gIdx),
                  children: group.collapsed ? "▶" : "▼"
                }
              ),
u$2("div", { className: "group-title", onClick: () => toggleGroupCollapse(gIdx), children: group.label }),
u$2("div", { className: "group-count", children: [
                group.items.length,
                " 条"
              ] })
            ] }),
u$2("div", { className: "cgptx-group-list", style: { display: group.collapsed ? "none" : "block" }, children: group.items.map((item) => {
              const key = makeKey(group.projectId, item.id);
              return u$2("div", { className: "cgptx-item", children: [
u$2(
                  Checkbox,
                  {
                    checked: selectedSet.value.has(key),
                    onChange: () => toggleItemSelect(key)
                  }
                ),
u$2("div", {}),
u$2("div", { children: u$2("div", { className: "title", children: item.title || item.id }) })
              ] }, key);
            }) })
          ] }, gIdx);
        })
      ] }),
      !loading.value && progress.value && u$2("div", { className: "cgptx-progress-wrap", style: { display: "flex" }, children: [
u$2("div", { className: "cgptx-progress-track", children: u$2("div", { className: "cgptx-progress-bar", style: { width: `${progress.value.pct}%` } }) }),
u$2("div", { className: "cgptx-progress-text", children: [
          progress.value.text,
          " (",
          Math.round(progress.value.pct),
          "%)"
        ] })
      ] })
    ] }) });
  }
  function showBatchExportDialog() {
    const root = document.createElement("div");
    document.body.appendChild(root);
    const close = () => {
      preact.render(null, root);
      root.remove();
    };
    preact.render(preact.h(BatchExportDialog, {
      onClose: close
    }), root);
  }
  function ActionButtons({ autoSaveState }) {
    const [showSettings, setShowSettings] = d$1(false);
    const handleBatchExport = () => {
      showBatchExportDialog();
    };
    const handleAutoSaveClick = () => {
      setShowSettings(true);
    };
    const { status, nextRun, role, message, lastError } = autoSaveState;
    const isSaving = status === "saving" || status === "checking";
    const isError = status === "error";
    const isDisabled = status === "disabled";
    const isIdle = status === "idle";
    const [timeText, setTimeText] = d$1("");
    y$2(() => {
      if (!isIdle || !nextRun || isDisabled) {
        setTimeText("");
        return;
      }
      const update = () => {
        const diff = Math.max(0, Math.ceil((nextRun - Date.now()) / 1e3));
        if (diff > 60) {
          setTimeText(`${Math.round(diff / 60)}m`);
        } else {
          setTimeText(`${diff}s`);
        }
      };
      update();
      const timer = setInterval(update, 1e3);
      return () => clearInterval(timer);
    }, [nextRun, isIdle, isDisabled]);
    let tooltip = `自动保存设置
状态: ${status}`;
    if (role !== "unknown") {
      tooltip += ` (${role === "leader" ? "Leader" : "Standby"})`;
    }
    if (message) tooltip += `
${message}`;
    if (lastError) tooltip += `
Error: ${lastError}`;
    if (isDisabled) tooltip = "自动保存已关闭";
    let iconContent;
    let btnStyle = {};
    if (isDisabled) {
      btnStyle.color = "#9ca3af";
      iconContent = u$2("div", { style: { position: "relative", width: 16, height: 16 }, children: [
u$2("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { opacity: 0.5 }, children: [
u$2("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
u$2("polyline", { points: "17 21 17 13 7 13 7 21" }),
u$2("polyline", { points: "7 3 7 8 15 8" })
        ] }),
u$2(
          "svg",
          {
            width: "10",
            height: "10",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "3",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            style: { position: "absolute", bottom: -2, right: -2, color: "#ef4444", background: "white", borderRadius: "50%" },
            children: [
u$2("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
u$2("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ]
          }
        )
      ] });
    } else if (isError) {
      btnStyle.color = "#ef4444";
      iconContent = u$2("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
u$2("circle", { cx: "12", cy: "12", r: "10" }),
u$2("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
u$2("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
      ] });
    } else if (isSaving) {
      btnStyle.color = "#3b82f6";
      iconContent = u$2("svg", { className: "busy", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
u$2("path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
u$2("path", { d: "M3 3v5h5" }),
u$2("path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" }),
u$2("path", { d: "M16 21h5v-5" })
      ] });
    } else {
      btnStyle.color = "#10b981";
      iconContent = u$2("div", { style: { position: "relative", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }, children: [
u$2("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
u$2("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
u$2("polyline", { points: "17 21 17 13 7 13 7 21" }),
u$2("polyline", { points: "7 3 7 8 15 8" })
        ] }),
        timeText && u$2("span", { style: {
          position: "absolute",
          bottom: -4,
          right: -6,
          background: "#10b981",
          color: "white",
          fontSize: "9px",
          padding: "0 2px",
          borderRadius: "4px",
          fontWeight: "bold",
          lineHeight: "1",
          transform: "scale(0.9)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
        }, children: timeText })
      ] });
    }
    return u$2(preact.Fragment, { children: [
      showSettings && u$2(
        AutoSaveSettings,
        {
          status: {
            lastRun: autoSaveState.lastRun,
            state: autoSaveState.status,
            message: autoSaveState.message
          },
          onClose: () => setShowSettings(false)
        }
      ),
u$2(
        "button",
        {
          id: "cgptx-mini-btn-batch",
          className: "cgptx-mini-btn",
          title: "批量导出 JSON + 附件（可勾选）",
          onClick: handleBatchExport,
          children: u$2("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: u$2("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }) })
        }
      ),
u$2("div", { style: { position: "relative", display: "flex", alignItems: "center" }, children: u$2(
        "button",
        {
          id: "cgptx-mini-btn-autosave",
          className: "cgptx-mini-btn",
          title: tooltip,
          onClick: handleAutoSaveClick,
          style: btnStyle,
          children: iconContent
        }
      ) }),
u$2("style", { children: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .cgptx-mini-btn svg.busy { animation: spin 1s linear infinite; }
            ` })
    ] });
  }
  function FloatingEntry() {
    const { status, refreshCredStatus } = useCredentialStatus();
    const autoSaveState = useAutoSave();
    const lastConvData = A$2(null);
    const updateCache = (data) => {
      lastConvData.current = data;
    };
    y$2(() => {
      getRootHandle().then(async (h2) => {
        if (h2) {
          const storedEnabled = localStorage.getItem("chatgpt_exporter_autosave_enabled");
          const isEnabled = storedEnabled === null || storedEnabled === "true";
          if (!isEnabled) {
            console.log("AutoSave is disabled by user setting.");
            return;
          }
          const credReady = await Cred.ensureReady();
          if (credReady) {
            startAutoSaveLoop();
          } else {
            console.warn("AutoSave not started: User credentials not ready");
          }
        }
      });
    }, []);
    const isOk = status.hasToken && status.hasAcc;
    return u$2("div", { className: "cgptx-mini-wrap", children: [
u$2(StatusPanel, { status, isOk }),
u$2("div", { className: "cgptx-mini-btn-row", children: [
u$2(
          ExportJsonButton,
          {
            refreshCredStatus,
            onDataFetched: updateCache
          }
        ),
u$2(
          DownloadFilesButton,
          {
            refreshCredStatus,
            cachedData: lastConvData.current,
            onDataFetched: updateCache
          }
        ),
u$2(ActionButtons, { autoSaveState })
      ] })
    ] });
  }
  function Toaster2() {
    return u$2(
      Toaster$1,
      {
        position: "top-center",
        richColors: true,
        toastOptions: {
          style: {
            background: "#fff",
            border: "1px solid #e5e7eb",
            color: "#374151",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          },
          className: "cgptx-toast"
        }
      }
    );
  }
  function mountUI() {
    if (!isHostOK()) return;
    if (document.querySelector(".cgptx-mini-wrap")) return;
    const root = document.createElement("div");
    document.body.appendChild(root);
    preact.render(
      preact.h(
        preact.Fragment,
        null,
        preact.h(FloatingEntry, null),
        preact.h(Toaster2, null)
      ),
      root
    );
  }
  function boot() {
    if (!isHostOK()) return;
    if (document.readyState === "complete" || document.readyState === "interactive") {
      mountUI();
    } else {
      document.addEventListener("DOMContentLoaded", mountUI);
    }
  }
  boot();

})(preact, JSZip);