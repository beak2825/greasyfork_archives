// ==UserScript==
// @name         贴吧网页版粘贴图片修复
// @namespace    https://your.domain/tieba-paste-fixer
// @version      0.3.0
// @description  贴吧编辑器粘贴图片自动上传；修复发帖时 [img] 标签缺少 pic_type/width/height 导致 402013 错误
// @match        https://tieba.baidu.com/*
// @run-at       document-start
// @grant        none
// @author       HCPTangHY
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554059/%E8%B4%B4%E5%90%A7%E7%BD%91%E9%A1%B5%E7%89%88%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/554059/%E8%B4%B4%E5%90%A7%E7%BD%91%E9%A1%B5%E7%89%88%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LOG_PREFIX = '[TiebaPasteFix]';
  const IMG_MAX_WIDTH = 560; // 贴吧常见显示宽度上限
  const hookedFrames = new WeakSet();

  // 记录图片 URL -> {nw, nh, w, h}（natural 尺寸以及按显示限制后的尺寸）
  const imgMeta = new Map();

  // 保存原生 fetch，避免被站内脚本劫持
  const Native = {
    fetch: typeof window.fetch === 'function' ? window.fetch.bind(window) : null
  };

  function log(...a) { console.log(LOG_PREFIX, ...a); }
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  function normalizeUrl(u) {
    try {
      const url = new URL(u, location.href);
      url.hash = '';
      return url.href;
    } catch { return u; }
  }

  function calcDisplaySize(nw, nh) {
    if (!nw || !nh) return { w: IMG_MAX_WIDTH, h: IMG_MAX_WIDTH };
    if (nw <= IMG_MAX_WIDTH) return { w: nw, h: nh };
    const r = IMG_MAX_WIDTH / nw;
    return { w: IMG_MAX_WIDTH, h: Math.round(nh * r) };
  }

  function rememberImageMeta(url, nw, nh) {
    const key = normalizeUrl(url);
    const { w, h } = calcDisplaySize(nw, nh);
    imgMeta.set(key, { nw, nh, w, h });
    // 也记录去掉查询串的 key（防 query 变化）
    try {
      const u = new URL(key);
      u.search = '';
      imgMeta.set(u.href, { nw, nh, w, h });
    } catch {}
  }

  function getFid() {
    try {
      if (window.PageData?.forum?.id) return window.PageData.forum.id;
      if (window.PageData?.forum_id) return window.PageData.forum_id;
      const el = document.querySelector('[data-fid]');
      if (el) return el.getAttribute('data-fid');
    } catch (_) {}
    return null;
  }

  function readTbsFromPage() {
    try {
      if (window.PageData?.tbs) return window.PageData.tbs;
      if (window.PageData?.anti?.tbs) return window.PageData.anti.tbs;
      if (window.PageData?.user?.tbs) return window.PageData.user.tbs;
      for (const s of Array.from(document.scripts)) {
        const txt = s.textContent || '';
        if (txt.includes('PageData') && txt.includes('"tbs"')) {
          const m = txt.match(/"tbs"\s*:\s*"([A-Za-z0-9]+)"/);
          if (m) return m[1];
        }
      }
    } catch (_) {}
    return null;
  }

  // XHR 兜底
  function xhrJSON(url) {
    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.withCredentials = true;
        xhr.responseType = 'json';
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response || JSON.parse(xhr.responseText));
          } else {
            reject(new Error('HTTP ' + xhr.status));
          }
        };
        xhr.onerror = () => reject(new Error('网络错误'));
        xhr.send();
      } catch (e) { reject(e); }
    });
  }

  async function fetchJSON(url) {
    if (Native.fetch) {
      try {
        const res = await Native.fetch(url, { credentials: 'include', cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
      } catch (e) {
        log('native fetch 失败，转用 XHR:', e.message);
        return xhrJSON(url);
      }
    }
    return xhrJSON(url);
  }

  let cachedTbs = null;
  let cachedTbsAt = 0;
  const TBS_TTL = 5 * 60 * 1000;

  async function getTbs(force = false) {
    const now = Date.now();
    if (!force && cachedTbs && (now - cachedTbsAt) < TBS_TTL) return cachedTbs;

    const pageTbs = readTbsFromPage();
    if (pageTbs) { cachedTbs = pageTbs; cachedTbsAt = now; return cachedTbs; }

    const urls = [
      'https://tieba.baidu.com/dc/common/imgtbs?_=' + now,
      'https://tieba.baidu.com/dc/common/tbs?_=' + now
    ];

    let lastErr = null;
    for (const url of urls) {
      try {
        const data = await fetchJSON(url);
        const tbs = data?.data?.tbs || data?.tbs || null;
        if (data?.no === 0 && tbs) {
          cachedTbs = tbs;
          cachedTbsAt = Date.now();
          return cachedTbs;
        }
        lastErr = new Error('接口返回异常: ' + (data?.error || JSON.stringify(data)));
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error('获取 tbs 失败（未知错误）');
  }

  async function uploadImage(file, tbs, fid) {
    const ext = (file.type.split('/')[1] || 'png').replace(/[^a-z0-9]/gi, '').toLowerCase();
    const name = `paste-${Date.now()}.${ext}`;
    const formData = new FormData();
    formData.append('file', file, name);

    const qs = new URLSearchParams({
      tbs,
      fid: String(fid),
      save_yun_album: '1',
      picWaterType: '1039999',
      _t: String(Date.now())
    }).toString();

    const url = `https://uploadphotos.baidu.com/upload/pic?${qs}`;

    if (Native.fetch) {
      try {
        const res = await Native.fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'include',
          cache: 'no-store'
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        if (json.err_no === 0 && json?.info?.pic_url_auth) {
          return json.info.pic_url_auth;
        }
        if (/tbs/i.test(json.err_msg || '')) {
          const fresh = await getTbs(true);
          return uploadImage(file, fresh, fid);
        }
        throw new Error(json.err_msg || '上传失败（未知错误）');
      } catch (e) {
        log('native fetch 上传失败，转用 XHR:', e.message);
      }
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.withCredentials = true;
      xhr.responseType = 'json';
      xhr.onload = async () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const json = xhr.response || JSON.parse(xhr.responseText);
            if (json.err_no === 0 && json?.info?.pic_url_auth) {
              resolve(json.info.pic_url_auth);
              return;
            }
            if (/tbs/i.test(json.err_msg || '')) {
              const fresh = await getTbs(true);
              const again = await uploadImage(file, fresh, fid);
              resolve(again);
              return;
            }
            reject(new Error(json.err_msg || '上传失败（未知错误）'));
          } else {
            reject(new Error('HTTP ' + xhr.status));
          }
        } catch (e) {
          reject(e);
        }
      };
      xhr.onerror = () => reject(new Error('网络错误'));
      xhr.send(formData);
    });
  }

  // 在选区插入并拿到元素引用，便于绑定 load
  function insertImageNodeAtSelection(doc, url) {
    const sel = doc.getSelection && doc.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    range.collapse(false);

    const img = doc.createElement('img');
    img.className = 'BDE_Image';
    img.setAttribute('data-pic-type', '0'); // 默认为 0
    img.src = url;

    const br = doc.createElement('br');

    const frag = doc.createDocumentFragment();
    frag.appendChild(img);
    frag.appendChild(br);

    range.insertNode(frag);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    return img;
  }

  function isEditableTarget(t) {
    if (!t || t.nodeType !== 1) return false;
    if (t.closest('textarea,input')) return false;
    if (t.closest('[contenteditable="true"]')) return true;
    if (t.closest('.edui-editor, .tb-editor, .tb_poster_placeholder, [id*="ueditor"], [class*="edui-editor"]')) return true;
    return false;
  }

  async function handlePasteEvent(e, ownerDocument) {
    const t = e.target;
    if (!isEditableTarget(t)) return;

    const cd = e.clipboardData;
    const items = cd && cd.items ? Array.from(cd.items) : [];
    const imageItems = items.filter(it => it.kind === 'file' && it.type && it.type.startsWith('image/'));

    if (imageItems.length === 0) return;

    e.preventDefault();

    const doc = ownerDocument || document;
    const sel = doc.getSelection && doc.getSelection();
    const savedRange = (sel && sel.rangeCount > 0) ? sel.getRangeAt(0).cloneRange() : null;

    try {
      const fid = getFid();
      if (!fid) throw new Error('获取 fid 失败，请刷新页面后重试');

      let tbs;
      for (let i = 0; i < 2; i++) {
        tbs = readTbsFromPage();
        if (tbs) break;
        await delay(50);
      }
      if (!tbs) tbs = await getTbs();

      for (const it of imageItems) {
        const file = it.getAsFile && it.getAsFile();
        if (!file) continue;

        const url = await uploadImage(file, tbs, fid);

        if (savedRange) {
          const s2 = doc.getSelection();
          s2.removeAllRanges();
          s2.addRange(savedRange);
        }

        const img = insertImageNodeAtSelection(doc, url);
        if (!img) continue;

        // 绑定 load，记录尺寸，设置 width/height 属性
        const applySize = () => {
          const nw = img.naturalWidth || img.width || IMG_MAX_WIDTH;
          const nh = img.naturalHeight || img.height || IMG_MAX_WIDTH;
          const { w, h } = calcDisplaySize(nw, nh);
          rememberImageMeta(url, nw, nh);
          img.setAttribute('width', String(w));
          img.setAttribute('height', String(h));
        };

        if (img.complete) {
          applySize();
        } else {
          img.addEventListener('load', applySize, { once: true });
          img.addEventListener('error', () => {
            // 兜底尺寸，避免空
            img.setAttribute('width', String(IMG_MAX_WIDTH));
            img.setAttribute('height', String(IMG_MAX_WIDTH));
          }, { once: true });
        }
      }
    } catch (err) {
      log('粘贴图片上传失败:', err);
      try { alert('图片上传失败：' + (err?.message || err)); } catch (_) {}
    }
  }

  function attachPasteListenerToFrame(iframe) {
    if (hookedFrames.has(iframe)) return;

    const tryAttach = () => {
      let doc;
      try { doc = iframe.contentDocument; } catch (_) { return; }
      if (!doc) return;
      const body = doc.body;
      const isEditable = (body && (body.isContentEditable || doc.designMode === 'on'));
      if (!isEditable) return;

      const handler = (e) => handlePasteEvent(e, doc);
      doc.addEventListener('paste', handler, true);
      hookedFrames.add(iframe);
      log('已绑定粘贴监听到 UEditor iframe:', iframe.id || '(no-id)');
    };

    if (iframe.contentDocument?.readyState === 'complete' || iframe.contentDocument?.readyState === 'interactive') {
      setTimeout(tryAttach, 0);
    } else {
      iframe.addEventListener('load', tryAttach, { once: true });
    }
  }

  function scanAndAttach() {
    if (!document.__tieba_paste_fix_bound__) {
      document.addEventListener('paste', (e) => handlePasteEvent(e, document), true);
      Object.defineProperty(document, '__tieba_paste_fix_bound__', { value: true, enumerable: false });
      log('已在主文档绑定全局粘贴捕获监听');
    }

    const iframeCandidates = [
      'iframe[id$="_iframe"]',
      'iframe[id^="ueditor"][id$="_iframe"]',
      'iframe[id^="edui"][id$="_iframe"]',
      'iframe[class*="edui"]',
      'iframe'
    ].join(',');

    document.querySelectorAll(iframeCandidates).forEach((iframe) => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        const body = doc.body;
        if (body?.isContentEditable || doc.designMode === 'on') {
          attachPasteListenerToFrame(iframe);
        }
      } catch (_) {}
    });
  }

  function observeIframes() {
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue;
          if (n.tagName === 'IFRAME') attachPasteListenerToFrame(n);
          n.querySelectorAll?.('iframe').forEach(attachPasteListenerToFrame);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    log('已开启 DOM 观察，跟踪新建的 UEditor iframe');
  }

  // ============== 发帖请求拦截与内容修复 ==============

  function parseQS(str) {
    const out = {};
    (str || '').split('&').forEach(pair => {
      if (!pair) return;
      const idx = pair.indexOf('=');
      const key = idx >= 0 ? pair.slice(0, idx) : pair;
      const val = idx >= 0 ? pair.slice(idx + 1) : '';
      out[decodeURIComponent(key)] = decodeURIComponent(val.replace(/\+/g, ' '));
    });
    return out;
  }

  function serializeQS(obj) {
    return Object.keys(obj).map(k => {
      const v = obj[k] == null ? '' : String(obj[k]);
      return encodeURIComponent(k) + '=' + encodeURIComponent(v);
    }).join('&');
  }

  function fixImgTagAttrsInContent(content) {
    if (!content || typeof content !== 'string') return content;

    const IMG_RE = /\[img([^\]]*)\]([^\[]+?)\[\/img\]/gi;

    const fixed = content.replace(IMG_RE, (full, attrStr, url) => {
      const attrsRaw = (attrStr || '').trim();
      const attrs = {};
      attrsRaw.split(/\s+/).forEach(kv => {
        if (!kv) return;
        const i = kv.indexOf('=');
        if (i < 0) return;
        const k = kv.slice(0, i).trim();
        const v = kv.slice(i + 1).trim();
        attrs[k] = v;
      });

      const meta = imgMeta.get(normalizeUrl(url)) || imgMeta.get((() => {
        try { const u = new URL(normalizeUrl(url)); u.search=''; return u.href; } catch { return ''; }
      })());

      // pic_type
      let pt = attrs.pic_type;
      if (!/^\d+$/.test(pt)) pt = '0';

      // width/height
      let w = attrs.width;
      let h = attrs.height;
      if (!/^\d+$/.test(w) || !/^\d+$/.test(h)) {
        if (meta) { w = String(meta.w); h = String(meta.h); }
        else { w = String(IMG_MAX_WIDTH); h = String(IMG_MAX_WIDTH); }
      }

      const newAttrs = ` pic_type=${pt} width=${w} height=${h}`;
      return `[img${newAttrs}]${url}[/img]`;
    });

    return fixed;
  }

  function overrideFetchForPosting() {
    if (!window.fetch) return; // 某些旧环境仅 XHR
    const origFetch = window.fetch.bind(window);
    window.fetch = function (input, init = {}) {
      try {
        // 只拦截 /f/commit/post/add
        const url = typeof input === 'string' ? input : (input?.url || '');
        if (/\/f\/commit\/post\/add(\?|$)/.test(url)) {
          if (init && typeof init.body === 'string' && /application\/x-www-form-urlencoded/i.test(init.headers?.['content-type'] || init.headers?.get?.('content-type') || '')) {
            const qs = parseQS(init.body);
            if (qs.content) {
              const before = qs.content;
              const after = fixImgTagAttrsInContent(before);
              if (after !== before) {
                qs.content = after;
                init.body = serializeQS(qs);
                log('已修复 fetch 提交中的 [img] 参数');
              }
            }
          }
        }
      } catch (e) {
        log('fetch 拦截修复出错：', e);
      }
      return origFetch(input, init);
    };
  }

  function overrideXHRForPosting() {
    const OrigXHR = window.XMLHttpRequest;
    function PatchedXHR() {
      const xhr = new OrigXHR();
      const open = xhr.open;
      const send = xhr.send;
      let _url = '';
      let _method = '';

      xhr.open = function (method, url, async, user, password) {
        _method = method;
        _url = url;
        return open.call(this, method, url, async, user, password);
      };

      xhr.send = function (body) {
        try {
          if (_method && /^post$/i.test(_method) && /\/f\/commit\/post\/add(\?|$)/.test(_url)) {
            if (typeof body === 'string') {
              const qs = parseQS(body);
              if (qs.content) {
                const before = qs.content;
                const after = fixImgTagAttrsInContent(before);
                if (after !== before) {
                  qs.content = after;
                  body = serializeQS(qs);
                  log('已修复 XHR 提交中的 [img] 参数');
                }
              }
            } else if (body instanceof FormData) {
              // 若站点改为 FormData，也尝试修复
              const content = body.get && body.get('content');
              if (typeof content === 'string') {
                const fixed = fixImgTagAttrsInContent(content);
                if (fixed !== content) {
                  body.set('content', fixed);
                  log('已修复 FormData 提交中的 [img] 参数');
                }
              }
            }
          }
        } catch (e) {
          log('XHR 拦截修复出错：', e);
        }
        return send.call(this, body);
      };

      return xhr;
    }
    PatchedXHR.prototype = OrigXHR.prototype;
    window.XMLHttpRequest = PatchedXHR;
  }

  function init() {
    // 粘贴监听
    scanAndAttach();
    observeIframes();
    // 发帖拦截修复
    overrideFetchForPosting();
    overrideXHRForPosting();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 300);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(init, 300));
  }
})();