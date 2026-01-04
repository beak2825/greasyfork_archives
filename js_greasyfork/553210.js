// ==UserScript==
// @name         Cmoa漫画下载
// @namespace    shadows
// @version      0.5.0
// @description  在 Cmoa SpeedBinb v01.6452 页面中，批量获取页图、解密复原、按页序命名并打包为 zip；使用 @zip.js 生成压缩包并用浏览器原生方式保存（showSaveFilePicker 或 a[download]）。仅用于个人学习与备份，请勿商用或传播。
// @author       shadows
// @license      MIT License
// @match        https://www.cmoa.jp/bib/speedreader/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.8.8/dist/zip.min.js
// @downloadURL https://update.greasyfork.org/scripts/553210/Cmoa%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/553210/Cmoa%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // zip.js 配置：禁用 Web Workers（更兼容油猴环境）
  if (window.zip && typeof zip.configure === 'function') {
    zip.configure({ useWebWorkers: false });
  }

  // ============ UI ============
  function injectUI() {
    const btn = document.createElement('button');
    btn.textContent = '下载为ZIP';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: 999999,
      padding: '10px 14px',
      background: '#2c7be5',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      boxShadow: '0 4px 14px rgba(0,0,0,.25)',
      "font-family": '"Alibaba PuHuiTi 3.0", "PingFang SC", HarmonyOS_Regular, "Helvetica Neue", "Microsoft YaHei", sans-serif',
    });
    btn.addEventListener('mouseenter', () => btn.style.background = '#1a68d5');
    btn.addEventListener('mouseleave', () => btn.style.background = '#2c7be5');
    btn.onclick = run;
    document.body.appendChild(btn);
  }

  function showProgress(total) {
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      position: 'fixed',
      right: '16px',
      bottom: '64px',
      zIndex: 999999,
      width: '280px',
      padding: '10px',
      background: '#1e1e1e',
      color: '#ddd',
      border: '1px solid #333',
      borderRadius: '8px',
      fontSize: '12px',
      "font-family": '"Alibaba PuHuiTi 3.0", "PingFang SC", HarmonyOS_Regular, "Helvetica Neue", "Microsoft YaHei", sans-serif',
      boxShadow: '0 4px 16px rgba(0,0,0,.35)'
    });

    const title = document.createElement('div');
    title.textContent = '处理中';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '6px';

    const bar = document.createElement('div');
    Object.assign(bar.style, {
      width: '100%',
      height: '8px',
      background: '#333',
      borderRadius: '4px',
      overflow: 'hidden',
      "font-family": '"Alibaba PuHuiTi 3.0", "PingFang SC", HarmonyOS_Regular, "Helvetica Neue", "Microsoft YaHei", sans-serif',
    });

    const fill = document.createElement('div');
    Object.assign(fill.style, {
      width: '0%',
      height: '100%',
      background: '#2c7be5',
      transition: 'width .2s ease',
      "font-family": '"Alibaba PuHuiTi 3.0", "PingFang SC", HarmonyOS_Regular, "Helvetica Neue", "Microsoft YaHei", sans-serif',
    });
    bar.appendChild(fill);

    const info = document.createElement('div');
    info.style.marginTop = '6px';
    info.textContent = `0 / ${total}`;

    const close = document.createElement('button');
    close.textContent = '停止/关闭';
    Object.assign(close.style, {
      marginTop: '8px',
      width: '100%',
      padding: '6px 8px',
      background: '#444',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      "font-family": '"Alibaba PuHuiTi 3.0", "PingFang SC", HarmonyOS_Regular, "Helvetica Neue", "Microsoft YaHei", sans-serif',
    });
    close.onclick = () => wrap.remove();

    wrap.appendChild(title);
    wrap.appendChild(bar);
    wrap.appendChild(info);
    wrap.appendChild(close);
    document.body.appendChild(wrap);

    const api = {
      update(current) {
        const pct = Math.max(0, Math.min(100, Math.round(current * 100 / total)));
        fill.style.width = pct + '%';
        info.textContent = `${current} / ${total}`;
      },
      done() {
        fill.style.width = '100%';
        info.textContent = `${total} / ${total} 完成`;
        setTimeout(() => wrap.remove(), 2000);
      },
      fail(msg) {
        info.textContent = '失败：' + msg;
      }
    };
    return api;
  }

  // ============ 原生保存 ZIP ============
  async function saveZipNative(blob, fileName) {
    if (typeof window.showSaveFilePicker === 'function') {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{ description: 'ZIP archive', accept: { 'application/zip': ['.zip'] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (e) {
        console.warn('showSaveFilePicker 不可用或被拒绝，使用 a[download] 回退保存。', e);
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  // ============ 基础HTTP ============
  function httpGet(url, type = 'json') {
    return new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest === 'function') {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          responseType: type === 'blob' ? 'arraybuffer' : undefined,
          headers: { 'Accept': type === 'json' ? 'application/json,text/plain,*/*' : '*/*' },
          onload: (res) => {
            try {
              if (type === 'json') {
                resolve(JSON.parse(res.responseText || 'null'));
              } else if (type === 'text') {
                resolve(res.responseText || '');
              } else if (type === 'blob') {
                const ct = res.responseHeaders?.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || 'image/jpeg';
                const buf = res.response instanceof ArrayBuffer ? res.response : new TextEncoder().encode(res.responseText).buffer;
                resolve(new Blob([buf], { type: ct }));
              } else {
                resolve(res.responseText);
              }
            } catch (e) { reject(e); }
          },
          onerror: (e) => reject(e),
        });
      } else {
        fetch(url, { credentials: 'include' })
          .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            if (type === 'json') return r.json();
            if (type === 'text') return r.text();
            if (type === 'blob') return r.blob();
            return r.text();
          })
          .then(resolve)
          .catch(reject);
      }
    });
  }

  // ============ 解析TTX ============
  function createDOM(ttx) {
    let doc = new DOMParser().parseFromString(ttx, 'text/html');
    if (!doc || !doc.querySelector) {
      doc = new DOMParser().parseFromString(ttx, 'application/xml');
    }
    return doc;
  }

  // ============ SpeedBinb 核心算法 ============
  function _tt(t) {
    const n = Date.now().toString(16).padStart(16, 'x');
    const i = Array(Math.ceil(16 / t.length) + 1).join(t);
    const r = i.substr(0, 16);
    const e = i.substr(-16, 16);
    let s = 0, u = 0, h = 0;
    return n.split('').map((ch, idx) => {
      s ^= n.charCodeAt(idx);
      u ^= r.charCodeAt(idx);
      h ^= e.charCodeAt(idx);
      return ch + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'[(s + u + h) & 63];
    }).join('');
  }

  function _pt(t, i, n) {
    const r = t + ':' + i;
    let e = 0;
    for (let s = 0; s < r.length; s++) e += r.charCodeAt(s) << (s % 16);
    e &= 2147483647;
    if (e === 0) e = 305419896;
    let u = '', h = e;
    for (let s = 0; s < n.length; s++) {
      h = (h >>> 1) ^ (1210056708 & -(h & 1));
      const o = (n.charCodeAt(s) - 32 + h) % 94 + 32;
      u += String.fromCharCode(o);
    }
    try { return JSON.parse(u); } catch (_) { return null; }
  }

  function _lt_001(t, ctbl, ptbl) {
    const i = [0, 0];
    if (t) {
      const n = t.lastIndexOf('/') + 1, r = t.length - n;
      for (let e = 0; e < r; e++) i[e % 2] += t.charCodeAt(e + n);
      i[0] %= 8; i[1] %= 8;
    }
    return { s: ptbl[i[0]], u: ctbl[i[1]] };
  }

  function _lt_002(s, u) {
    if (u.charAt(0) === '=' && s.charAt(0) === '=') return new _speedbinb_f(u, s);
    if (/^[0-9]/.test(u) && /^[0-9]/.test(s)) return new _speedbinb_a(u, s);
    if (u === '' && s === '') return new _speedbinb_h();
    return null;
  }

  function _getImageDescrambleCoords(s, u, i, n) {
    const r = _lt_002(s, u);
    if (!r || !r.vt()) return null;
    const e = r.dt({ width: i, height: n });
    return {
      width: e.width,
      height: e.height,
      transfers: [{
        index: 0,
        coords: r.gt({ width: i, height: n })
      }]
    };
  }

  // --- Prototypes: f / a / h ---
  const _speedbinb_f = (function () {
    function S(t, i) {
      this.Mt = null;
      const n = t.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/);
      const r = i.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/);
      if (n !== null && r !== null && n[1] === r[1] && n[2] === r[2] && n[4] === r[4] && n[3] === '+' && r[3] === '-') {
        this.C = parseInt(n[1], 10);
        this.I = parseInt(n[2], 10);
        this.jt = parseInt(n[4], 10);
        if (this.C <= 8 && this.I <= 8 && this.C * this.I <= 64) {
          const e = this.C + this.I + this.C * this.I;
          if (n[5].length === e && r[5].length === e) {
            const s = this.yt(n[5]);
            const u = this.yt(r[5]);
            this.xt = s.n;
            this.Et = s.t;
            this.It = u.n;
            this.St = u.t;
            this.Mt = [];
            for (let h = 0; h < this.C * this.I; h++) this.Mt.push(s.p[u.p[h]]);
          }
        }
      }
    }
    S.prototype.vt = function () { return this.Mt !== null; };
    S.prototype.bt = function (t) {
      const i = 2 * this.C * this.jt, n = 2 * this.I * this.jt;
      return t.width >= 64 + i && t.height >= 64 + n && (t.width * t.height) >= (320 + i) * (320 + n);
    };
    S.prototype.dt = function (t) {
      if (!this.bt(t)) return t;
      return { width: t.width - 2 * this.C * this.jt, height: t.height - 2 * this.I * this.jt };
    };
    S.prototype.gt = function (t) {
      if (!this.vt()) return null;
      if (!this.bt(t)) {
        return [{ xsrc: 0, ysrc: 0, width: t.width, height: t.height, xdest: 0, ydest: 0 }];
      }
      const i = t.width - 2 * this.C * this.jt;
      const n = t.height - 2 * this.I * this.jt;
      const r = Math.floor((i + this.C - 1) / this.C);
      const e = i - (this.C - 1) * r;
      const s = Math.floor((n + this.I - 1) / this.I);
      const u = n - (this.I - 1) * s;
      const h = [];
      for (let o = 0; o < this.C * this.I; o++) {
        const a = o % this.C;
        const f = Math.floor(o / this.C);
        const c = this.jt + a * (r + 2 * this.jt) + (this.It[f] < a ? e - r : 0);
        const l = this.jt + f * (s + 2 * this.jt) + (this.St[a] < f ? u - s : 0);
        const v = this.Mt[o] % this.C;
        const d = Math.floor(this.Mt[o] / this.C);
        const g = v * r + (this.xt[d] < v ? e - r : 0);
        const p = d * s + (this.Et[v] < d ? u - s : 0);
        const b = this.It[f] === a ? e : r;
        const m = this.St[a] === f ? u : s;
        if (i > 0 && n > 0) {
          h.push({ xsrc: c, ysrc: l, width: b, height: m, xdest: g, ydest: p });
        }
      }
      return h;
    };
    S.prototype.yt = function (t) {
      let i, n = [], r = [], e = [];
      for (i = 0; i < this.C; i++) n.push(S.Tt[t.charCodeAt(i)]);
      for (i = 0; i < this.I; i++) r.push(S.Tt[t.charCodeAt(this.C + i)]);
      for (i = 0; i < this.C * this.I; i++) e.push(S.Tt[t.charCodeAt(this.C + this.I + i)]);
      return { t: n, n: r, p: e };
    };
    S.Tt = (function () {
      const arr = new Array(123).fill(-1);
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      for (let i = 0; i < charset.length; i++) {
        const code = charset.charCodeAt(i);
        arr[code] = i;
      }
      return arr;
    })();
    return S;
  })();

  const _speedbinb_a = (function () {
    function T(t, i) {
      this.mt = null;
      this.wt = null;
      const n = this.yt(t);
      const r = this.yt(i);
      if (n && r && n.ndx === r.ndx && n.ndy === r.ndy) {
        this.mt = n; // source
        this.wt = r; // target
      }
    }
    T.prototype.vt = function () { return this.mt !== null && this.wt !== null; };
    T.prototype.bt = function (t) { return t.width >= 64 && t.height >= 64 && t.width * t.height >= 102400; };
    T.prototype.dt = function (t) { return t; };
    T.prototype.gt = function (t) {
      if (!this.vt()) return null;
      if (!this.bt(t)) {
        return [{ xsrc: 0, ysrc: 0, width: t.width, height: t.height, xdest: 0, ydest: 0 }];
      }
      const i = [];
      const n = t.width - (t.width % 8);
      const r = Math.floor((n - 1) / 7) - (Math.floor((n - 1) / 7) % 8);
      const e = n - 7 * r;
      const s = t.height - (t.height % 8);
      const u = Math.floor((s - 1) / 7) - (Math.floor((s - 1) / 7) % 8);
      const h = s - 7 * u;
      for (let a = 0; a < this.mt.ndx * this.mt.ndy; a++) {
        const f = this.mt.piece[a];
        const c = this.wt.piece[a];
        i.push({
          xsrc: Math.floor(f.x / 2) * r + (f.x % 2) * e,
          ysrc: Math.floor(f.y / 2) * u + (f.y % 2) * h,
          width: Math.floor(f.w / 2) * r + (f.w % 2) * e,
          height: Math.floor(f.h / 2) * u + (f.h % 2) * h,
          xdest: Math.floor(c.x / 2) * r + (c.x % 2) * e,
          ydest: Math.floor(c.y / 2) * u + (c.y % 2) * h
        });
      }
      const l = r * (this.mt.ndx - 1) + e;
      const v = u * (this.mt.ndy - 1) + h;
      if (l < t.width) {
        i.push({ xsrc: l, ysrc: 0, width: t.width - l, height: v, xdest: l, ydest: 0 });
      }
      if (v < t.height) {
        i.push({ xsrc: 0, ysrc: v, width: t.width, height: t.height - v, xdest: 0, ydest: v });
      }
      return i;
    };
    T.prototype.yt = function (t) {
      if (!t) return null;
      const i = t.split('-');
      if (i.length !== 3) return null;
      const n = parseInt(i[0], 10);
      const r = parseInt(i[1], 10);
      const e = i[2];
      if (e.length !== n * r * 2) return null;
      const a = (n - 1) * (r - 1) - 1;
      const f = a + (n - 1);
      const c = f + (r - 1);
      const l = c + 1;
      const v = [];
      for (let d = 0; d < n * r; d++) {
        const s = this.Ot(e.charAt(2 * d));
        const u = this.Ot(e.charAt(2 * d + 1));
        let h, o;
        if (d <= a) { h = 2; o = 2; }
        else if (d <= f) { h = 2; o = 1; }
        else if (d <= c) { h = 1; o = 2; }
        else if (d <= l) { h = 1; o = 1; }
        v.push({ x: s, y: u, w: h, h: o });
      }
      return { ndx: n, ndy: r, piece: v };
    };
    T.prototype.Ot = function (t) {
      let i = 0;
      let n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(t);
      if (n < 0) { n = 'abcdefghijklmnopqrstuvwxyz'.indexOf(t); } else { i = 1; }
      return i + 2 * n;
    };
    return T;
  })();

  const _speedbinb_h = (function () {
    function H() { }
    H.prototype.vt = function () { return true; };
    H.prototype.bt = function (_t) { return false; };
    H.prototype.dt = function (t) { return t; };
    H.prototype.gt = function (t) {
      return [{ xsrc: 0, ysrc: 0, width: t.width, height: t.height, xdest: 0, ydest: 0 }];
    };
    return H;
  })();

  async function descrambleBlob(blob, keys, output = { type: 'image/jpeg', quality: 0.92 }) {
    const bmp = await createImageBitmap(blob);
    const view = _getImageDescrambleCoords(keys.s, keys.u, bmp.width, bmp.height);
    if (!view) return blob; // 无需处理
    const canvas = document.createElement('canvas');
    canvas.width = view.width;
    canvas.height = view.height;
    const ctx = canvas.getContext('2d');

    const coords = view.transfers[0].coords;
    for (const part of coords) {
      const sx = parseInt(part.xsrc);
      const sy = parseInt(part.ysrc);
      const dx = parseInt(part.xdest);
      const dy = parseInt(part.ydest);
      const w = parseInt(part.width);
      const h = parseInt(part.height);
      ctx.drawImage(bmp, sx, sy, w, h, dx, dy, w, h);
    }
    const outBlob = await new Promise((resolve) => canvas.toBlob(resolve, output.type, output.quality));
    return outBlob || blob;
  }

  // ============ v016452 检测与抓取 ============
  function getParam(name, url = location.href) {
    const u = new URL(url, location.origin);
    return u.searchParams.get(name);
  }

  function detectV016452() {
    const container = document.querySelector('div#content.pages');
    if (!container) return { ok: false, reason: '未找到 div#content.pages' };
    const apiURL = container?.dataset?.ptbinb;
    if (!apiURL || !/bibGetCntntInfo/i.test(apiURL)) {
      return { ok: false, reason: 'data-ptbinb 不包含 bibGetCntntInfo（非 v016452）' };
    }
    const cid = getParam('cid');
    const u0 = getParam('u0');
    const u1 = getParam('u1');
    if (!cid || !u0 || !u1) return { ok: false, reason: 'URL 缺少 cid/u0/u1 参数' };
    return { ok: true, apiURL, cid, u0, u1 };
  }

  async function fetchConfigAndList(chapterID, apiURL) {
    const base = location.origin + '/';
    const cid = new URL(chapterID, base).searchParams.get('cid');
    const u0 = new URL(chapterID, base).searchParams.get('u0');
    const u1 = new URL(chapterID, base).searchParams.get('u1');
    const sharingKey = _tt(cid);

    const url = new URL(apiURL, base);
    url.searchParams.set('cid', cid);
    url.searchParams.set('dmytime', Date.now());
    url.searchParams.set('k', sharingKey);
    url.searchParams.set('u0', u0);
    url.searchParams.set('u1', u1);

    const data = await httpGet(url.href, 'json');
    const cfg = data?.items?.[0];
    if (!cfg) throw new Error('API 返回 items[0] 为空');

    const ctbl = _pt(cid, sharingKey, cfg.ctbl);
    const ptbl = _pt(cid, sharingKey, cfg.ptbl);
    const serverType = parseInt(cfg.ServerType, 10);

    if (serverType === 0) {
      // SBC
      let uri = new URL((cfg.ContentsServer || '') + '/sbcGetCntnt.php', base);
      uri.searchParams.set('cid', cid);
      uri.searchParams.set('p', cfg.p);
      uri.searchParams.set('q', '1');
      uri.searchParams.set('vm', cfg.ViewMode);
      uri.searchParams.set('dmytime', cfg.ContentDate);
      uri.searchParams.set('u0', u0);
      uri.searchParams.set('u1', u1);

      const cnt = await httpGet(uri.href, 'json');
      const dom = createDOM(cnt.ttx || '');
      const firstCase = dom.querySelector('t-case') || dom;
      const imgs = Array.from(firstCase.querySelectorAll('t-img'));
      const list = imgs.map(img => {
        const src = img.getAttribute('src');
        const imgUrl = new URL(uri.href);
        imgUrl.pathname = imgUrl.pathname.replace('sbcGetCntnt.php', 'sbcGetImg.php');
        imgUrl.searchParams.set('src', src);
        return { src, url: imgUrl.href };
      });
      return { ctbl, ptbl, list };
    }

    if (serverType === 2) {
      // Content
      let uri = new URL(cfg.ContentsServer || '', base);
      uri.pathname += uri.pathname.endsWith('/') ? '' : '/';
      uri.pathname += 'content';
      uri.searchParams.set('dmytime', cfg.ContentDate);
      uri.searchParams.set('u0', u0);
      uri.searchParams.set('u1', u1);

      const cnt = await httpGet(uri.href, 'json');
      const dom = createDOM(cnt.ttx || '');
      const firstCase = dom.querySelector('t-case') || dom;
      const imgs = Array.from(firstCase.querySelectorAll('t-img'));
      const list = imgs.map(img => {
        const src = img.getAttribute('src');
        const imgUrl = new URL(uri.href);
        imgUrl.pathname = imgUrl.pathname.replace(/\/content$/, `/img/${src}`);
        return { src, url: imgUrl.href };
      });
      return { ctbl, ptbl, list };
    }

    throw new Error(`不支持的 ServerType: ${serverType}`);
  }

  // ============ 使用 @zip.js 打包 ============
  async function buildZipWithZipJS(pages, ctbl, ptbl, progressApi) {
    if (!window.zip || typeof zip.ZipWriter !== 'function' || typeof zip.BlobWriter !== 'function' || typeof zip.BlobReader !== 'function') {
      throw new Error('zip.js 未加载或不兼容当前环境');
    }

    // 创建 ZipWriter，输出为 Blob
    const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'), {
      // 开启 zip64 以防极大文件/数量（通常用不到，但更稳妥）
      zip64: true
    });

    const total = pages.length;
    const pad = Math.max(3, String(total).length);

    for (let i = 0; i < total; i++) {
      const { src, url } = pages[i];
      const filename = `images/${String(i + 1).padStart(pad, '0')}.jpg`;

      try {
        const keys = _lt_001(src, ctbl, ptbl);
        const blob = await httpGet(url, 'blob'); // 原始扰码图
        const outBlob = await descrambleBlob(blob, keys, { type: 'image/jpeg', quality: 0.92 });

        // 对 JPG 再压缩意义不大，使用存储（STORE），更快更省资源
        await zipWriter.add(filename, new zip.BlobReader(outBlob), { level: 0 });
      } catch (e) {
        console.error('下载/解密/写入ZIP失败：', filename, url, e);
        const errBlob = new Blob([String(e)], { type: 'text/plain' });
        await zipWriter.add(`images/${String(i + 1).padStart(pad, '0')}.err.txt`, new zip.BlobReader(errBlob), { level: 0 });
      }

      progressApi.update(i + 1);
      // 轻微延时以降低接口压力
      await new Promise(r => setTimeout(r, 60));
    }

    // 关闭并获取 Zip Blob
    const zipBlob = await zipWriter.close();
    return zipBlob;
  }

  // ============ 主流程 ============
  async function run() {
    try {
      const det = detectV016452();
      if (!det.ok) {
        alert(`未检测到 v016452 页面：${det.reason}`);
        return;
      }

      const chapterID = location.pathname + location.search;
      const { ctbl, ptbl, list } = await fetchConfigAndList(chapterID, det.apiURL);
      if (!list || !list.length) {
        alert('未获取到任何页面图片。');
        return;
      }

      const progress = showProgress(list.length);
      const zipBlob = await buildZipWithZipJS(list, ctbl, ptbl, progress);

      const safeTitle = (document.title || 'chapter').replace(/[\\/:*?"<>|]/g, '_');
      await saveZipNative(zipBlob, `${safeTitle}.zip`);
      progress.done();
    } catch (err) {
      console.error('[SpeedBinb v016452 @zip.js 下载器] 发生错误：', err);
      alert('下载失败，请打开控制台查看详细错误。');
    }
  }

  injectUI();
})();