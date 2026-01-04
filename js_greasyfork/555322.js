// ==UserScript==
// @name         色花堂小帮手
// @namespace    https://sehuatang.helper
// @version      3.0.0
// @description  预览文本/解压ZIP&RAR(多密码)·顶部聚合·图片屏蔽(白名单/隐藏占位文案)·ED2K + 磁力链接聚合；修复开关无效/卡顿，支持中文/空格/可选段，磁力完整提取（含参数）。新增搜索页面排序增强功能，支持多级排序、配额可视化、过滤器等。
// @author       ross
// @license      MIT
// @match        https://sehuatang.org/forum.php?mod=viewthread*
// @match        http://sehuatang.org/forum.php?mod=viewthread*
// @match        https://www.sehuatang.org/forum.php?mod=viewthread*
// @match        http://www.sehuatang.org/forum.php?mod=viewthread*
// @match        https://sehuatang.net/forum.php?mod=viewthread*
// @match        http://sehuatang.net/forum.php?mod=viewthread*
// @match        https://www.sehuatang.net/forum.php?mod=viewthread*
// @match        http://www.sehuatang.net/forum.php?mod=viewthread*
// @match        https://sehuatang.org/forum.php?mod=redirect&goto=findpost*
// @match        http://sehuatang.org/forum.php?mod=redirect&goto=findpost*
// @match        https://www.sehuatang.org/forum.php?mod=redirect&goto=findpost*
// @match        http://www.sehuatang.org/forum.php?mod=redirect&goto=findpost*
// @match        https://sehuatang.net/forum.php?mod=redirect&goto=findpost*
// @match        http://sehuatang.net/forum.php?mod=redirect&goto=findpost*
// @match        https://www.sehuatang.net/forum.php?mod=redirect&goto=findpost*
// @match        http://www.sehuatang.net/forum.php?mod=redirect&goto=findpost*
// @match        https://sehuatang.org/forum.php?mod=forumdisplay*
// @match        http://sehuatang.org/forum.php?mod=forumdisplay*
// @match        https://www.sehuatang.org/forum.php?mod=forumdisplay*
// @match        http://www.sehuatang.org/forum.php?mod=forumdisplay*
// @match        https://sehuatang.net/forum.php?mod=forumdisplay*
// @match        http://sehuatang.net/forum.php?mod=forumdisplay*
// @match        https://www.sehuatang.net/forum.php?mod=forumdisplay*
// @match        http://www.sehuatang.net/forum.php?mod=forumdisplay*
// @match        https://sehuatang.org/forum.php
// @match        http://sehuatang.org/forum.php
// @match        https://www.sehuatang.org/forum.php
// @match        http://www.sehuatang.org/forum.php
// @match        https://sehuatang.net/forum.php
// @match        http://sehuatang.net/forum.php
// @match        https://www.sehuatang.net/forum.php
// @match        http://www.sehuatang.net/forum.php
// @match        https://sehuatang.org/
// @match        http://sehuatang.org/
// @match        https://www.sehuatang.org/
// @match        http://www.sehuatang.org/
// @match        https://sehuatang.net/
// @match        http://sehuatang.net/
// @match        https://www.sehuatang.net/
// @match        http://www.sehuatang.net/
// @match        https://sehuatang.org/search.php?mod=forum*
// @match        http://sehuatang.org/search.php?mod=forum*
// @match        https://www.sehuatang.org/search.php?mod=forum*
// @match        http://www.sehuatang.org/search.php?mod=forum*
// @match        https://sehuatang.net/search.php?mod=forum*
// @match        http://sehuatang.net/search.php?mod=forum*
// @match        https://www.sehuatang.net/search.php?mod=forum*
// @match        http://www.sehuatang.net/search.php?mod=forum*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @connect      *
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.53/dist/zip.min.js
// @require      https://cdn.jsdelivr.net/npm/jschardet@3.0.0/dist/jschardet.min.js
// @downloadURL https://update.greasyfork.org/scripts/555322/%E8%89%B2%E8%8A%B1%E5%A0%82%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555322/%E8%89%B2%E8%8A%B1%E5%A0%82%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // RAR 解压功能 - 使用 Web Worker 实现
  let gWorker = null;
  let gWorkerReady = null;

  const LIB_SOURCES = [{
    name: 'github raw gh-pages',
    js: 'https://raw.githubusercontent.com/wcchoi/libunrar-js/refs/heads/gh-pages/libunrar.js',
    mem: 'https://raw.githubusercontent.com/wcchoi/libunrar-js/refs/heads/gh-pages/libunrar.js.mem',
  }];

  // 工具函数
  function toU8(data) {
    try {
      if (!data) return null;
      if (data instanceof Uint8Array) return data;
      if (data instanceof ArrayBuffer) return new Uint8Array(data);
      if (ArrayBuffer.isView(data) && data.buffer) return new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength);
      if (typeof Blob !== 'undefined' && data instanceof Blob) return null;
      if (typeof data === 'string') return new TextEncoder().encode(data);
      if (Array.isArray(data)) {
        // 检查是否为序列化后的 Uint8Array（通过 postMessage 传递）
        const u8 = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
          const val = data[i];
          if (typeof val === 'number' && val >= 0 && val <= 255) {
            u8[i] = val;
          } else {
            console.log(`[数据转换] 警告：数组元素不是有效字节值:`, val, 'at index', i);
            return null;
          }
        }
        return u8;
      }
      if (data && typeof data === 'object') {
        if (data.data) return toU8(data.data);
        if (data.bytes) return toU8(data.bytes);
      }
    } catch (error) {
      console.log(`[数据转换] toU8 转换失败:`, error, 'data type:', typeof data, 'isArray:', Array.isArray(data));
    }
    return null;
  }

  function objBytesToU8(obj) {
    if (!obj) return null;
    if (obj instanceof Uint8Array) return obj;
    if (Array.isArray(obj)) {
      // 检查是否为序列化后的 Uint8Array
      const u8 = new Uint8Array(obj.length);
      for (let i = 0; i < obj.length; i++) {
        const val = obj[i];
        if (typeof val === 'number' && val >= 0 && val <= 255) {
          u8[i] = val;
        } else {
          console.log(`[数据转换] objBytesToU8 警告：数组元素不是有效字节值:`, val, 'at index', i);
          return null;
        }
      }
      return u8;
    }
    if (typeof obj === 'object') {
      const keys = Object.keys(obj).sort((a, b) => Number(a) - Number(b));
      const out = new Uint8Array(keys.length);
      for (let i = 0; i < keys.length; i++) {
        const val = obj[keys[i]];
        if (typeof val === 'number' && val >= 0 && val <= 255) {
          out[i] = val;
        } else {
          console.log(`[数据转换] objBytesToU8 警告：对象值不是有效字节:`, val, 'at key', keys[i]);
          return null;
        }
      }
      return out;
    }
    return null;
  }

  // 递归把 result.ls 的目录树收集为 {name, size, data}[]
  function collectEntriesFromResult(result) {
    const entries = [];

    function walkLS(ls, prefix = "") {
      if (!ls || typeof ls !== 'object') return;
      for (const [name, node] of Object.entries(ls)) {
        const niceName = (node.fullFileName || (prefix ? (prefix + '/' + name) : name));
        if (node?.type === 'file') {
          // 优先各种字段；fileContent 是对象形式的字节
          let u8 = toU8(node.fileContent) || toU8(node.content) || toU8(node.data) || objBytesToU8(node.fileContent);
          if (!u8 && node.bytes) u8 = toU8(node.bytes);
          if (u8) {
            entries.push({ name: niceName, size: node.fileSize ?? u8.byteLength, data: u8 });
          } else {
          }
        } else if (node?.type === 'dir') {
          walkLS(node.ls, niceName);
        }
      }
    }

    // 1) 支持你现在的 { type:'dir', ls:{...} }
    if (result?.type === 'dir' && result?.ls) {
      walkLS(result.ls, "");
    }

    // 2) 兼容某些版本的 { ls:{...} }（无顶层 type）
    if (entries.length === 0 && result?.ls && typeof result.ls === 'object') {
      walkLS(result.ls, "");
    }

    // 3) 仍然兼容已有的 files/contents 逻辑（以防库换版本）
    if (entries.length === 0 && Array.isArray(result?.files)) {
      for (const f of result.files) {
        const name = f.name || f.fileName || (f.fileHeader && (f.fileHeader.name || f.fileHeader.fileNameUTF8)) || 'file.bin';
        const raw = toU8(f.content ?? f.extraction ?? f.data ?? f.bytes);
        if (raw) entries.push({ name, size: raw.byteLength, data: raw });
      }
    }
    if (entries.length === 0 && result?.contents && typeof result.contents === 'object') {
      for (const [name, val] of Object.entries(result.contents)) {
        const raw = toU8(val) || objBytesToU8(val);
        if (raw) entries.push({ name: name || 'file.bin', size: raw.byteLength, data: raw });
      }
    }

    return entries;
  }

  // 网络请求函数
  function fetchBinary(url, timeout = 30_000) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url, method: 'GET', responseType: 'arraybuffer', timeout,
        headers: { 'Accept': '*/*', 'Referer': location.href },
        onload: res => (res.status >= 200 && res.status < 300) ? resolve(res.response)
          : reject(new Error(`HTTP ${res.status}`)),
        onerror: () => reject(new Error('网络错误')),
        ontimeout: () => reject(new Error('超时')),
      });
    });
  }

  function fetchText(url, timeout = 20_000) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url, method: 'GET', responseType: 'text', timeout,
        headers: { 'Accept': 'text/plain,*/*;q=0.8', 'Referer': location.href },
        onload: res => (res.status >= 200 && res.status < 300) ? resolve(res.responseText)
          : reject(new Error(`HTTP ${res.status}`)),
        onerror: () => reject(new Error('网络错误')),
        ontimeout: () => reject(new Error('超时')),
      });
    });
  }

  // libunrar 加载
  async function ensureLibReady() {
    if (gWorker && gWorkerReady) return gWorkerReady;

    // 拉 gh-pages 的 js / mem
    const JS_URL = LIB_SOURCES[0].js;
    const MEM_URL = LIB_SOURCES[0].mem;

    const [jsCode, memBuf] = await Promise.all([fetchText(JS_URL), fetchBinary(MEM_URL)]);

    // 用 blob: 提供 .mem
    const memBlob = new Blob([new Uint8Array(memBuf)], { type: 'application/octet-stream' });
    const memURL = URL.createObjectURL(memBlob);

    // ====== Worker：关键修复都在这里 ======
    const workerSource = `
    const tick = (ms)=>new Promise(r=>setTimeout(r,ms));
    const bname = (p)=>{ if(!p) return ''; const i=p.lastIndexOf('/'); return i>=0?p.slice(i+1):p; };
    const toU8  = (v)=> v instanceof Uint8Array ? v : new Uint8Array(v);

    let __logs = [];
    self.Module = {
        noInitialRun: true,
        noExitRuntime: true,
        locateFile: p => (p && p.endsWith('.mem')) ? ${JSON.stringify(memURL)} : p,
        print: s => {
            const msg = String(s);
            __logs.push(msg);
            postMessage({ type:'log', msg });
            const m = msg.match(/^\\s*filename:\\s*(.+)\\s*$/i);
            if (m) self.__lastFileName = m[1].trim();
        },
        printErr: s => postMessage({ type:'err', msg: String(s) }),
    };

    ${jsCode}

    function fsList(dir='/', prefix='') {
        const out = [];
        if (typeof FS === 'undefined' || !FS.readdir) return out;
        let list = [];
        try { list = FS.readdir(dir).filter(n=>n!=='.' && n!=='..'); } catch(_) { return out; }
        for (const name of list) {
            const full = dir==='/' ? '/'+name : dir+'/'+name;
            let st; try { st = FS.stat(full); } catch(_) { continue; }
            if (FS.isFile(st.mode)) {
                try { out.push({ path: full, name: (prefix?prefix+'/':'')+name, size: st.size }); } catch(_) {}
            } else if (FS.isDir(st.mode)) {
                out.push(...fsList(full, (prefix?prefix+'/':'')+name));
            }
        }
        return out;
    }

    function tryReadPaths(paths) {
        for (const p of paths) {
            try { const data = FS.readFile(p); return { name: bname(p)||'file.bin', content: data }; } catch(_){}
        }
        return null;
    }

    function byLikelyTextFirst(a,b){
        const tx = (n)=>/\\.(txt|nfo|log|md|json|srt|ini|xml)$/i.test(n||'');
        if (tx(a.name) && !tx(b.name)) return -1;
        if (!tx(a.name) && tx(b.name)) return 1;
        return (b.size|0) - (a.size|0);
    }

    async function harvestAllFiles(hintName, excludeNames=new Set(), tries=6, wait=120){
        // 轮询几次等底层写入完成
        let best = [];
        for (let i=0;i<tries;i++){
            const all = fsList('/').filter(f => !excludeNames.has(bname(f.path)));
            if (all.length) { best = all.slice().sort(byLikelyTextFirst); break; }
            await tick(wait);
        }
        // 如果仍然空，再多等两拍
        if (!best.length){
            await tick(wait); best = fsList('/').sort(byLikelyTextFirst);
            if (!best.length){ await tick(wait); best = fsList('/').sort(byLikelyTextFirst); }
        }

        const out = [];
        // 先按 hintName/日志猜测读取
        const hints = new Set();
        if (hintName) hints.add(hintName);
        if (self.__lastFileName) hints.add(self.__lastFileName);
        for (const h of hints){
            const bn = bname(h);
            const candidates = [
                h, '/'+h, bn, '/'+bn,
                ...(best.filter(f=>f.name===h || f.name===bn || bname(f.path)===bn).map(f=>f.path))
            ];
            const hit = tryReadPaths(candidates);
            if (hit) out.push(hit);
        }

        // 再把剩余的都读出来（避免只返回一个名字）
        for (const f of best){
            try {
                const data = FS.readFile(f.path);
                out.push({ name: f.name, content: data });
            } catch(_){}
        }

        // 去重（按 name+size）
        const seen = new Set();
        const dedup = [];
        for (const f of out){
            if (!f || !f.content) continue;
            const key = f.name + ':' + (f.content.byteLength||0);
            if (seen.has(key)) continue;
            seen.add(key); dedup.push(f);
        }
        return dedup;
    }

    async function extractByUNRAR(bytes, password){
        try{
            const cands = [self.libunrar,self.UNRAR,self.Unrar,self.Module?.libunrar,self.Module];
            let api = null; for (const c of cands) if (c && typeof c.createExtractorFromData==='function'){ api=c; break; }
            if (!api) return null;
            const ex = await api.createExtractorFromData({ data: toU8(bytes), password: String(password||'') });
            const list = ex.getFileList();
            const names = (list?.fileHeaders||[]).filter(h=>!(h.flags?.directory)).map(h=>h.name||h.fileName||h.fileNameUTF8).filter(Boolean);
            const files = [];
            if (names.length){
                const res = ex.extract({ files: names });
                for (const f of (res?.files||[])){
                    const raw = f.extraction||f.content||f.data||f.bytes;
                    const name = f.fileName||f.name||f.fileHeader?.name||'file.bin';
                    if (raw) files.push({ name, content: toU8(raw) });
                }
            }
            return files.length ? files : null;
        }catch(e){ postMessage({type:'err', msg:'[UNRAR] '+String(e)}); return null; }
    }

    self.onmessage = async (e) => {
        const { id, parts, password } = e.data || {};

        function ok(result) { postMessage({ id, type:'ok', result }); }
        function fail(error) { postMessage({ id, type:'fail', error: String(error) }); }

        try {
            if (typeof readRARContent !== 'function') {
                fail('readRARContent 未定义（脚本未正确初始化）');
                return;
            }

            // 1) 优先：不带回调的调用方式 —— 直接"拿返回值"
            // 有些构建里 readRARContent(files, password) 会直接返回结构化结果（含 files/contents）
            try {
                const ret = readRARContent(parts, password || '');
                if (ret && typeof ret === 'object') {
                    ok(ret);
                    return;
                }
            } catch (_) {
                // 忽略，改用回调式
            }

            // 2) 回调式：我们自己累积内容，最后一次性返回
            // 有些版本会在回调里多次给出条目（文件名或 {name, content} 等对象）
            const acc = { files: [] };
            const seenNames = new Set();

            const onUpdate = (item) => {
                // 可能只是字符串（文件名或日志）
                if (typeof item === 'string') {
                    // 把它当成进度日志，不中断
                    postMessage({ type: 'log', msg: item });
                    return;
                }
                // 也可能是一个对象（尝试抓 name + 内容）
                if (item && typeof item === 'object') {
                    const name = item.fileName || item.name || (item.fileHeader && (item.fileHeader.name || item.fileHeader.fileNameUTF8));
                    const data = item.content || item.data || item.bytes;

                    // 如果有内容就存起来（ArrayBuffer/TypedArray 都接受）
                    if (name && data) {
                        // 统一转成 Uint8Array
                        let u8 = null;
                        if (data instanceof Uint8Array) u8 = data;
                        else if (data instanceof ArrayBuffer) u8 = new Uint8Array(data);
                        else if (ArrayBuffer.isView(data)) u8 = new Uint8Array(data.buffer, data.byteOffset||0, data.byteLength);
                        else if (Array.isArray(data)) u8 = new Uint8Array(data);
                        if (u8) {
                            console.log('[Worker] 收集文件:', name, '数据类型:', u8.constructor.name, '长度:', u8.length, '前5字节:', Array.from(u8.slice(0, 5)));
                            acc.files.push({ name, content: u8 });
                            seenNames.add(name);
                        }
                    }

                    // 有些版本会在最后一次把完整结构丢给回调（比如 { files:[...] , contents:{...} }）
                    if (item.files || item.contents || item.fileHeaders) {
                        ok(item);
                        return;
                    }
                }
            };

            // 调用回调式；若库会同步返回一个最终对象，也拿一下
            const maybeRet = readRARContent(parts, password || '', onUpdate);
            if (maybeRet && typeof maybeRet === 'object' && (maybeRet.files || maybeRet.contents || maybeRet.fileHeaders)) {
                ok(maybeRet);
                return;
            }

            // 如果前面回调累积到了内容，也算成功
            if (acc.files.length > 0) {
                ok(acc);
                return;
            }

            // 到这里还没有结果，算失败
            fail('未拿到任何结构化结果（回调仅返回日志/文件名）。请检查密码或更换库构建。');
        } catch (err) {
            fail(err);
        }
    };

    postMessage({ type:'ready' });
    `;

    const workerBlob = new Blob([workerSource], { type: 'application/javascript' });
    const workerURL = URL.createObjectURL(workerBlob);

    gWorker = new Worker(workerURL);
    gWorkerReady = new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('Worker 初始化超时')), 5000);
      gWorker.onmessage = (ev) => {
        if (ev.data && ev.data.type === 'ready') {
          clearTimeout(t);
          resolve();
        } else if (ev.data && ev.data.type === 'log') {
          console.log('[rar-helper][worker]', ev.data.msg);
        } else if (ev.data && ev.data.type === 'err') {
          console.warn('[rar-helper][worker-err]', ev.data.msg);
        }
      };
      gWorker.onerror = (e) => { clearTimeout(t); reject(new Error('Worker 脚本错误: ' + (e.message || e.filename))); };
    });

    return gWorkerReady;
  }

  // 调用 Worker 抽取
  let _taskSeq = 1;
  function callWorkerExtract(archiveBuf, password, partsMeta) {
    return new Promise(async (resolve, reject) => {
      await ensureLibReady();
      const id = _taskSeq++;
      const u8 = archiveBuf instanceof Uint8Array ? archiveBuf : new Uint8Array(archiveBuf);

      const parts = partsMeta && Array.isArray(partsMeta) && partsMeta.length
        ? partsMeta.map(p => ({ name: p.name, content: p.content }))
        : [{ name: 'archive.rar', content: u8 }];

      const onMsg = (ev) => {
        const d = ev.data || {};
        if (d.type === 'log') { console.log('[rar-helper][worker]', d.msg); return; }
        if (d.type === 'err') { console.warn('[rar-helper][worker-err]', d.msg); return; }
        if (d.id !== id) return;
        gWorker.removeEventListener('message', onMsg);
        if (d.type === 'ok') return resolve(d.result);
        if (d.type === 'fail') return reject(new Error(d.error || 'worker 失败'));
        return reject(new Error('未知 worker 返回'));
      };
      gWorker.addEventListener('message', onMsg);
      gWorker.postMessage({ id, parts, password: password || '' });
    });
  }

  // RAR 文件检测函数
  function isRARFile(buffer) {
    if (buffer.length < 8) return false;
    const header1 = Array.from(buffer.slice(0, 4)).join(', ');
    const header2 = Array.from(buffer.slice(0, 7)).join(', ');
    const header3 = Array.from(buffer.slice(0, 8)).join(', ');
    const rar_header1 = '82, 69, 126, 94'; // old
    const rar_header2 = '82, 97, 114, 33, 26, 7, 0'; // 1.5 to 4.0
    const rar_header3 = '82, 97, 114, 33, 26, 7, 1, 0'; // 5.0
    return (header1 === rar_header1 || header2 === rar_header2 || header3 === rar_header3);
  }

  // 解压逻辑（主线程）
  async function tryExtractWithPassword(buffer, password) {
    console.log('[rar-helper] tryExtractWithPassword: password =', password);
    try {
      const result = await callWorkerExtract(buffer, password);
      console.debug('[rar-helper] worker result keys:', Object.keys(result || {}));
      // 统一从各种可能的返回结构里收集
      const outEntries = collectEntriesFromResult(result);
      console.log('[rar-helper] collected entries:', outEntries.map(e => `${e.name} (${e.size})`));
      if (outEntries.length) return { ok: true, entries: outEntries };

      const s = JSON.stringify(result || {});
      if (/password|wrong\s*password|encrypted\s*headers/i.test(s)) {
        return { ok: false, wrongPassword: true };
      }
      return { ok: false, error: '未成功解出任何文件' };
    } catch (err) {
      const s = String(err || '');
      if (/password|wrong\s*password|encrypted\s*headers/i.test(s)) {
        return { ok: false, wrongPassword: true };
      }
      return { ok: false, error: err?.message || s };
    }
  }

  // 兼容原有的 API
  window.readRARFileNames = function (rarFiles, password) {
    console.log('readRARFileNames 已弃用，请使用新的 RAR 解压功能');
    return {};
  };

  window.readRARContent = function (rarFiles, password, filename, callback) {
    console.log('readRARContent 已弃用，请使用新的 RAR 解压功能');
    if (callback) callback(null, new Error('readRARContent 已弃用'));
  };

  /*********************** 配置 ***********************/
  const DEFAULT_CONFIG = {
    maxAutoBytes: 2 * 1024 * 1024,
    autoHoistToTop: true,
    textExts: ['txt', 'nfo', 'log', 'json', 'ini', 'md', 'csv'],
    maxEntryBytes: 3 * 1024 * 1024,
    passwordCandidates: ['', 'www.98T.la', '98T.la', '98t', 'sehuatang', 'sht', 'sht123', '123456', 'www.sehuatang.org'],
    wrapAtTop: true,

    blockImages: true,
    imageAllowDomains: [],
    imagePlaceholderShowMeta: false,
    imageMinBlockSizePx: 40,
    imageProcessBatch: 50,
    mutationDebounceMs: 300,

    autoCollectED2K: true,
    ed2kDebounceMs: 500,

    autoCollectMagnet: true,
    magnetDebounceMs: 500,

    // 历史记录功能
    enableHistory: true,
    maxHistoryItems: 1000,
    historyItems: [],

    // 只看楼主功能
    authorOnlyMode: false,

    // 一键评分功能
    enableQuickRate: true,

    // 自动签到功能
    enableAutoSign: true,
    autoSignEnabled: false,
    defaultRateScore: 2, // 默认评分分数
    defaultRateReason: '很给力!', // 默认评分理由

    // 排版优化功能
    hideReplyColumn: false,
    hideLastReplyColumn: false,
    hideAuthorColumn: false,
    hideStickyThreads: false,

    // 分页和过滤功能
    hidePagination: false,
    enableKeywordFilter: false,
    keywordFilters: [],
    enhanceTitles: false,

    // 历史访问帖子处理
    historyPostAction: 'none', // 'none', 'hide', 'blue', 'strikethrough'
    historyPostColor: '#0066cc',

    // 帖子详情标题处理
    enableThreadTitleEnhance: false,
    titleReplaceRules: [
      { pattern: '\\[\\d+\\.\\d+G/\\d+V/\\d+配额\\]', replacement: '' }
    ],
    hideTypeLabels: ['情色分享', '图文故事', '视频分享'],

    // 帖子列表页标题处理
    enableListTitleEnhance: false,
    listTitleReplaceRules: [
      { pattern: '\\[\\d+\\.\\d+G/\\d+V/\\d+配额\\]', replacement: '' },
      { pattern: '\\[情色分享\\]', replacement: '' },
      { pattern: '\\[图文故事\\]', replacement: '' }
    ],

    // 论坛模块屏蔽
    enableModuleFilter: false,
    hiddenModules: [],

    // 123Pan 离线下载配置
    // 115 离线下载配置
    pan115Enabled: false,
    pan115Cookie: '',
    pan115UserAgent: '',
    pan115UploadDir: '',
    pan115FolderNames: {},
    pan115CurrentThreadFolder: '',
    pan115ThreadFolders: {},
    pan115TaskCount: 0, // 115 离线任务统计计数

    // 123Pan 离线下载配置
    pan123Enabled: false,
    pan123Token: '',
    pan123LoginUuid: '',
    pan123Cookie: '',
    pan123UploadDir: '',
    pan123MinSize: '10MB',
    pan123MaxSize: '1000GB',
    pan123IncludeExt: 'mp4,avi,mkv,wmv,flv,mov',
    pan123ExcludeExt: 'txt,nfo,srt,sub,url,mht,jpg,jpeg,png,gif,bmp,webp,ico,svg',
    pan123VideoMinSize: '100MB',
    pan123PickLargest: false,

    // 秒离线处理配置
    pan123InstantOfflineAction: 'auto_cancel', // 'auto_cancel', 'ask_user', 'keep_task'
    pan123InstantOfflineCheckDelay: 2000, // 检查延迟时间(毫秒)
    pan123BatchSendInterval: 2000, // 批量发送间隔时间(毫秒)
    pan123CurrentThreadFolder: '', // 当前帖子的文件夹ID
    pan123ThreadFolders: {}, // 帖子URL到文件夹ID的映射

    // ED2K文件名处理配置
    ed2kFileNameReplaceEnabled: false,
    ed2kFileNameReplaceRules: [
      { pattern: '\\[\\d+\\.\\d+G/\\d+V/\\d+配额\\]', replacement: '' },
      { pattern: '\\[情色分享\\]', replacement: '' },
      { pattern: '\\[图文故事\\]', replacement: '' },
      { pattern: '\\[视频分享\\]', replacement: '' }
    ],

    // 域名自动跳转配置
    domainAutoRedirect: true,
    primaryDomain: 'sehuatang.org', // 主域名

    // AI 助手配置
    aiEnabled: false,
    aiApiUrl: 'https://api.openai.com/v1',
    aiApiKey: '',
    aiModel: 'gpt-3.5-turbo',
    aiPrompt: '你是一个热心的论坛助手。请根据以下帖子的标题和内容，生成一段友好、自然且相关的中文回复。回复应该简短有力，符合论坛交流的氛围。'
  };
  let CFG = loadConfig();

  function saveConfig() {
    // console.log('保存配置:', CFG);
    const configString = JSON.stringify(CFG);
    // console.log('配置字符串:', configString);
    GM_setValue('sht_cfg_v2', configString);
    // console.log('配置已保存到存储');

    // 验证保存是否成功
    const savedConfig = GM_getValue('sht_cfg_v2');
    // console.log('验证保存的配置:', savedConfig);
  }
  function loadConfig() {
    try {
      const raw = GM_getValue('sht_cfg_v2');
      if (raw) {
        const parsed = JSON.parse(raw);
        // console.log('加载的配置:', parsed);
        // 确保新添加的配置项存在
        const config = { ...DEFAULT_CONFIG, ...parsed };
        // console.log('合并后的配置:', config);
        return config;
      }
    } catch (e) {
      // console.log('加载配置失败:', e);
    }
    // console.log('使用默认配置');
    return { ...DEFAULT_CONFIG };
  }

  /*********************** 工具函数 ***********************/
  const extOf = (n = '') => (n.toLowerCase().match(/\.([a-z0-9]+)(?:\?|$)/) || [])[1] || '';
  const isTextLike = n => CFG.textExts.includes(extOf(n));
  const isZip = n => extOf(n) === 'zip';
  const isRar = n => extOf(n) === 'rar';
  const absoluteUrl = href => { try { return new URL(href, location.origin).toString(); } catch { return href; } };
  const hostnameOf = url => { try { return new URL(url, location.origin).hostname; } catch { return ''; } };
  function analyzeDecodedText(str) {
    const stats = {
      length: str.length,
      replacement: 0,
      nulls: 0,
      controls: 0,
      whitespace: 0,
      letters: 0,
      vowels: 0,
      digits: 0,
      cjk: 0,
      hiragana: 0,
      katakana: 0,
      hangul: 0,
      punctuation: 0,
      asciiPrintable: 0,
      otherPrintable: 0,
      unique: new Set(),
    };
    for (const ch of str) {
      const code = ch.charCodeAt(0);
      stats.unique.add(ch);
      if (code === 0) { stats.nulls++; continue; }
      if (code === 0xFFFD) stats.replacement++;
      if (code < 0x20) {
        if (code === 0x09 || code === 0x0A || code === 0x0D) stats.whitespace++;
        else stats.controls++;
        continue;
      }
      if (code === 0x20 || code === 0xA0) {
        stats.whitespace++;
        continue;
      }
      if ((code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A)) {
        stats.letters++;
        if ('AEIOUaeiou'.includes(ch)) stats.vowels++;
      }
      if (code >= 0x30 && code <= 0x39) stats.digits++;
      if ((code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x3400 && code <= 0x4DBF)) stats.cjk++;
      if (code >= 0x3040 && code <= 0x309F) stats.hiragana++;
      if (code >= 0x30A0 && code <= 0x30FF) stats.katakana++;
      if (code >= 0xAC00 && code <= 0xD7A3) stats.hangul++;
      if ((code >= 0x21 && code <= 0x2F) || (code >= 0x3A && code <= 0x40) || (code >= 0x5B && code <= 0x60) || (code >= 0x7B && code <= 0x7E)) {
        stats.punctuation++;
      }
      if (code >= 0x20 && code <= 0x7E) stats.asciiPrintable++;
      else stats.otherPrintable++;
    }
    stats.uniqueCount = stats.unique.size;
    stats.uniqueRatio = stats.uniqueCount / Math.max(1, stats.length);
    stats.asciiPrintableRatio = stats.asciiPrintable / Math.max(1, stats.length);
    stats.cjkRatio = stats.cjk / Math.max(1, stats.length);
    stats.letterRatio = stats.letters / Math.max(1, stats.length);
    stats.whitespaceRatio = stats.whitespace / Math.max(1, stats.length);
    stats.vowelRatio = stats.vowels / Math.max(1, stats.length);
    return stats;
  }

  function scoreDecodedStats(stats, encoding, extra = 0) {
    if (!stats || stats.length === 0) return -Infinity;
    if (stats.replacement > 0 || stats.nulls > 0 || stats.controls > Math.max(1, stats.length * 0.02)) {
      return -Infinity;
    }
    let score = extra;
    score += stats.cjk * 4.0;
    score += (stats.hiragana + stats.katakana + stats.hangul) * 3.5;
    score += stats.letters * 3.0;
    score += stats.digits * 1.6;
    score += stats.whitespace * 0.8;
    score += stats.punctuation * 0.1;
    score += stats.asciiPrintable * 0.1;
    score += stats.otherPrintable * 0.6;
    score += stats.uniqueCount * 0.2;
    score += stats.vowels * 0.4;
    if (encoding.startsWith('utf-16')) score += 1.0;
    if (encoding === 'utf-8') score += 0.5;
    if (stats.uniqueRatio < 0.05 && stats.length > 20) score -= 5;
    return score;
  }

  function computePairSimilarity(buf) {
    const even = new Array(256).fill(0);
    const odd = new Array(256).fill(0);
    let pairs = 0;
    for (let i = 0; i + 1 < buf.length; i += 2) {
      even[buf[i]]++;
      odd[buf[i + 1]]++;
      pairs++;
    }
    if (!pairs) return 1;
    let dot = 0, evenNorm = 0, oddNorm = 0;
    for (let i = 0; i < 256; i++) {
      dot += even[i] * odd[i];
      evenNorm += even[i] * even[i];
      oddNorm += odd[i] * odd[i];
    }
    if (!evenNorm || !oddNorm) return 1;
    return dot / Math.sqrt(evenNorm * oddNorm);
  }

  function computeUtf16Heuristics(buf) {
    let zeroEven = 0;
    let zeroOdd = 0;
    let pairs = 0;
    for (let i = 0; i + 1 < buf.length; i += 2) {
      if (buf[i] === 0) zeroEven++;
      if (buf[i + 1] === 0) zeroOdd++;
      pairs++;
    }
    const similarity = computePairSimilarity(buf);
    return { pairs, zeroEven, zeroOdd, similarity };
  }

  function decodeBest(buf, debugName = '') {
    const data = buf instanceof Uint8Array
      ? buf
      : buf instanceof ArrayBuffer
        ? new Uint8Array(buf)
        : toU8(buf);
    if (!data || !data.length) {
      console.log(`[编码检测] ${debugName} 无有效字节输入`);
      return '';
    }

    // 1. 优先检测 BOM（最可靠）
    if (data.length >= 3) {
      if (data[0] === 0xEF && data[1] === 0xBB && data[2] === 0xBF) {
        try {
          const bomDecoded = new TextDecoder('utf-8').decode(data.slice(3));
          console.log(`[编码检测] ${debugName} 使用 UTF-8 BOM 解码`);
          return bomDecoded;
        } catch { }
      }
      if (data[0] === 0xFF && data[1] === 0xFE) {
        try {
          const bomDecoded = new TextDecoder('utf-16le').decode(data.slice(2));
          console.log(`[编码检测] ${debugName} 使用 UTF-16LE BOM 解码`);
          return bomDecoded;
        } catch { }
      }
      if (data[0] === 0xFE && data[1] === 0xFF) {
        try {
          const bomDecoded = new TextDecoder('utf-16be').decode(data.slice(2));
          console.log(`[编码检测] ${debugName} 使用 UTF-16BE BOM 解码`);
          return bomDecoded;
        } catch { }
      }
    }

    const candidates = [];
    const utf16Heur = computeUtf16Heuristics(data);
    const pairs = utf16Heur.pairs;
    const ratioEvenZero = pairs ? utf16Heur.zeroEven / pairs : 0;
    const ratioOddZero = pairs ? utf16Heur.zeroOdd / pairs : 0;
    const utf16Similarity = utf16Heur.similarity;
    const suspectUtf16 = data.length >= 4 && data.length % 2 === 0 &&
      (utf16Similarity < 0.2 || ratioEvenZero > 0.4 || ratioOddZero > 0.4);
    console.log(`[编码检测] ${debugName} UTF-16 启发式`, {
      length: data.length,
      pairs,
      zeroEven: utf16Heur.zeroEven,
      zeroOdd: utf16Heur.zeroOdd,
      ratioEvenZero,
      ratioOddZero,
      similarity: utf16Similarity,
      suspectUtf16
    });

    function addCandidateFromDecoded(decoded, encoding, extra = 0) {
      const stats = analyzeDecodedText(decoded);
      const score = scoreDecodedStats(stats, encoding, extra);
      if (score === -Infinity) return;
      candidates.push({ encoding, decoded, stats, score });
      console.log(`[编码检测] ${debugName} 候选 ${encoding} 分数:`, score, stats);
    }

    function tryAdd(encoding, extra = 0, decoderOptions) {
      let adjustedExtra = extra;
      if (suspectUtf16 && !encoding.startsWith('utf-16')) {
        adjustedExtra -= encoding === 'utf-8' ? 5 : 25;
      }
      try {
        const decoded = new TextDecoder(encoding, decoderOptions).decode(data);
        addCandidateFromDecoded(decoded, encoding, adjustedExtra);
      } catch (error) {
        console.log(`[编码检测] ${debugName} 尝试 ${encoding} 解码失败:`, error);
      }
    }

    // 2. 优先尝试 UTF-8（兼容 ASCII，Web 标准）
    tryAdd('utf-8');

    // 3. 使用 jschardet 检测（作为参考）
    function detectEncoding(buffer) {
      try {
        if (typeof jschardet !== 'undefined' && jschardet.detect) {
          const result = jschardet.detect(buffer);
          console.log(`[编码检测] ${debugName} jschardet 结果:`, result);
          if (result && result.encoding) {
            return { encoding: String(result.encoding).toLowerCase(), confidence: result.confidence ?? 0 };
          }
        }
      } catch (error) {
        console.log(`[编码检测] ${debugName} jschardet 失败:`, error);
      }
      return null;
    }

    const detected = detectEncoding(data);
    if (detected && detected.encoding && detected.encoding !== 'utf-8') {
      const normalized = detected.encoding.replace(/[^a-z0-9\-]/g, '');
      if (normalized) {
        const extraScore = detected.confidence ? detected.confidence * 20 : 0;
        tryAdd(normalized, extraScore);
      }
    }

    // 3.b 根据字节分布启发式尝试 UTF-16
    if (suspectUtf16) {
      const similarityBoost = Math.max(0, (0.2 - utf16Similarity) * 80);
      const leBias = Math.max(0, ratioOddZero - ratioEvenZero) * 40;
      const beBias = Math.max(0, ratioEvenZero - ratioOddZero) * 40;
      tryAdd('utf-16le', similarityBoost + leBias);
      tryAdd('utf-16be', similarityBoost + beBias);
    }

    // 4. 尝试常见中文编码
    const chineseEncodings = ['gbk', 'gb18030', 'big5'];
    for (const encoding of chineseEncodings) {
      tryAdd(encoding);
    }

    // 5. 尝试其他编码
    const otherEncodings = ['shift_jis', 'euc-jp', 'iso-8859-1'];
    for (const encoding of otherEncodings) {
      tryAdd(encoding);
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      const utf8Candidate = candidates.find(c => c.encoding === 'utf-8');
      const bestUtf16Candidate = candidates.find(c => c.encoding.startsWith('utf-16'));
      let best = candidates[0];
      if (suspectUtf16 && bestUtf16Candidate && !best.encoding.startsWith('utf-16')) {
        const diff = bestUtf16Candidate.score - best.score;
        if (diff >= -40) {
          console.log(`[编码检测] ${debugName} 启发式选择 UTF-16 候选，分差:`, diff);
          best = bestUtf16Candidate;
        }
      }
      if (utf8Candidate && best.encoding !== 'utf-8') {
        const diff = best.score - utf8Candidate.score;
        if (diff < 12 && utf8Candidate.stats.letterRatio >= 0.2 && utf8Candidate.stats.asciiPrintableRatio >= 0.7) {
          console.log(`[编码检测] ${debugName} 采用 UTF-8 候选，得分差 ${diff}`);
          best = utf8Candidate;
        }
      }
      console.log(`[编码检测] ${debugName} 最终选用编码:`, best.encoding, '得分:', best.score);
      return best.decoded;
    }

    // 6. 最后降级：使用 UTF-8 即使有乱码
    try {
      const fallbackDecoded = new TextDecoder('utf-8').decode(data);
      console.log(`[编码检测] ${debugName} 使用 UTF-8 降级解码（可能有乱码）`);
      return fallbackDecoded;
    } catch {
      // 兜底：返回原始字节的字符串表示
      console.log(`[编码检测] ${debugName} 所有编码尝试失败，使用原始字节`);
      return String.fromCharCode(...data.slice(0, 1000));
    }
  }
  function formatBytes(n) { if (n < 1024) return n + ' B'; if (n < 1024 ** 2) return (n / 1024).toFixed(2) + ' KB'; if (n < 1024 ** 3) return (n / 1024 ** 2).toFixed(2) + ' MB'; return (n / 1024 ** 3).toFixed(2) + ' GB'; }
  function parseSizeBytesFromSpan(span) {
    const em = span?.querySelector?.('em.xg1'); if (!em) return null; const t = em.textContent || '';
    const b = t.match(/([\d,.]+)\s*Bytes/i); if (b) return Math.floor(Number(b[1].replace(/[,.\s]/g, '')));
    const u = t.match(/([\d.]+)\s*(KB|MB|GB)/i); if (u) { const n = parseFloat(u[1]); const mul = u[2].toUpperCase() === 'KB' ? 1024 : u[2].toUpperCase() === 'MB' ? 1024 ** 2 : 1024 ** 3; return Math.floor(n * mul); }
    return null;
  }

  /*********************** 自定义Modal组件 ***********************/
  // 创建自定义Modal
  function createModal(title, message, type = 'info') {
    // 移除已存在的modal
    const existingModal = document.querySelector('#sht-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'sht-modal';
    modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
    background: white;
    border-radius: 8px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
  `;

    // 标题
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.cssText = `
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  `;

    // 消息内容
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
    margin: 0 0 24px 0;
    font-size: 14px;
    line-height: 1.5;
    color: #666;
    white-space: pre-line;
  `;

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
    display: flex;
    gap: 12px;
    justify-content: center;
  `;

    // 确定按钮
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确定';
    confirmBtn.style.cssText = `
    padding: 8px 24px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  `;

    // 根据类型设置颜色
    if (type === 'success') {
      confirmBtn.style.background = '#28a745';
      confirmBtn.style.color = 'white';
    } else if (type === 'error') {
      confirmBtn.style.background = '#dc3545';
      confirmBtn.style.color = 'white';
    } else if (type === 'warning') {
      confirmBtn.style.background = '#ffc107';
      confirmBtn.style.color = '#212529';
    } else {
      confirmBtn.style.background = '#007bff';
      confirmBtn.style.color = 'white';
    }

    confirmBtn.addEventListener('mouseenter', () => {
      confirmBtn.style.opacity = '0.9';
    });
    confirmBtn.addEventListener('mouseleave', () => {
      confirmBtn.style.opacity = '1';
    });

    // 关闭modal
    const closeModal = () => {
      modal.remove();
    };

    confirmBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // ESC键关闭
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    buttonContainer.appendChild(confirmBtn);
    modalContent.appendChild(titleEl);
    modalContent.appendChild(messageEl);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // 聚焦到确定按钮
    confirmBtn.focus();

    return modal;
  }

  // 显示成功消息
  function showSuccessModal(message) {
    return createModal('操作成功', message, 'success');
  }

  // 显示错误消息
  function showErrorModal(message) {
    return createModal('操作失败', message, 'error');
  }

  // 显示警告消息
  function showWarningModal(message) {
    return createModal('警告', message, 'warning');
  }

  // 显示信息消息
  function showInfoModal(message) {
    return createModal('提示', message, 'info');
  }

  // 导出配置
  function exportConfig() {
    try {
      // 创建配置对象，排除历史记录等大数据
      const configToExport = {
        version: '2.7.3',
        exportTime: new Date().toISOString(),
        config: {
          // 基础设置
          passwordCandidates: CFG.passwordCandidates,
          maxAutoBytes: CFG.maxAutoBytes,
          maxEntryBytes: CFG.maxEntryBytes,
          wrapAtTop: CFG.wrapAtTop,
          blockImages: CFG.blockImages,

          // 显示设置
          showMetaInfo: CFG.showMetaInfo,
          hideAuthorColumn: CFG.hideAuthorColumn,
          hideStickyThreads: CFG.hideStickyThreads,

          // 收集设置
          autoCollectED2K: CFG.autoCollectED2K,
          autoCollectMagnet: CFG.autoCollectMagnet,
          ed2kFileNameReplaceEnabled: CFG.ed2kFileNameReplaceEnabled,
          ed2kFileNameReplaceRules: CFG.ed2kFileNameReplaceRules,
          enableHistory: CFG.enableHistory,
          maxHistoryItems: CFG.maxHistoryItems,

          // 115设置
          pan115Enabled: CFG.pan115Enabled,
          pan115Cookie: CFG.pan115Cookie,
          pan115UserAgent: CFG.pan115UserAgent,
          pan115UploadDir: CFG.pan115UploadDir,
          pan115FolderNames: CFG.pan115FolderNames,
          pan115CurrentThreadFolder: CFG.pan115CurrentThreadFolder,
          pan115ThreadFolders: CFG.pan115ThreadFolders,
          pan115TaskCount: CFG.pan115TaskCount,

          // 123Pan设置
          pan123Enabled: CFG.pan123Enabled,
          pan123Token: CFG.pan123Token,
          pan123LoginUuid: CFG.pan123LoginUuid,
          pan123Cookie: CFG.pan123Cookie,
          pan123UploadDir: CFG.pan123UploadDir,
          pan123MinSize: CFG.pan123MinSize,
          pan123MaxSize: CFG.pan123MaxSize,
          pan123IncludeExt: CFG.pan123IncludeExt,
          pan123ExcludeExt: CFG.pan123ExcludeExt,
          pan123VideoMinSize: CFG.pan123VideoMinSize,
          pan123PickLargest: CFG.pan123PickLargest,
          pan123InstantOfflineAction: CFG.pan123InstantOfflineAction,
          pan123InstantOfflineCheckDelay: CFG.pan123InstantOfflineCheckDelay,
          pan123BatchSendInterval: CFG.pan123BatchSendInterval,
          pan123CurrentThreadFolder: CFG.pan123CurrentThreadFolder,
          pan123ThreadFolders: CFG.pan123ThreadFolders,

          // AI 设置
          aiEnabled: CFG.aiEnabled,
          aiApiUrl: CFG.aiApiUrl,
          aiApiKey: CFG.aiApiKey,
          aiModel: CFG.aiModel,
          aiPrompt: CFG.aiPrompt,

          // 高级设置
          hidePagination: CFG.hidePagination,
          enableKeywordFilter: CFG.enableKeywordFilter,
          keywordFilters: CFG.keywordFilters,
          enabledModules: CFG.enabledModules
        }
      };

      const blob = new Blob([JSON.stringify(configToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sht_config_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      showSuccessModal('配置导出成功！\n\n文件已保存到下载文件夹。');
    } catch (error) {
      console.error('导出配置失败:', error);
      showErrorModal('导出配置失败: ' + error.message);
    }
  }

  // 导入配置
  function importConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];

      // 清理input元素
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }

      if (!file) {
        console.log('用户取消了文件选择');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);

          // 验证配置格式
          if (!importedData.config || !importedData.version) {
            throw new Error('无效的配置文件格式');
          }

          // 确认导入
          const confirmMessage = `确定要导入配置吗？\n\n版本: ${importedData.version}\n导出时间: ${importedData.exportTime}\n\n这将覆盖当前的所有设置！`;
          if (!confirm(confirmMessage)) return;

          // 导入配置
          const config = importedData.config;

          // 基础设置
          if (config.passwordCandidates) CFG.passwordCandidates = config.passwordCandidates;
          if (config.maxAutoBytes !== undefined) CFG.maxAutoBytes = config.maxAutoBytes;
          if (config.maxEntryBytes !== undefined) CFG.maxEntryBytes = config.maxEntryBytes;
          if (config.wrapAtTop !== undefined) CFG.wrapAtTop = config.wrapAtTop;
          if (config.blockImages !== undefined) CFG.blockImages = config.blockImages;

          // 显示设置
          if (config.showMetaInfo !== undefined) CFG.showMetaInfo = config.showMetaInfo;
          if (config.hideAuthorColumn !== undefined) CFG.hideAuthorColumn = config.hideAuthorColumn;
          if (config.hideStickyThreads !== undefined) CFG.hideStickyThreads = config.hideStickyThreads;

          // 收集设置
          if (config.autoCollectED2K !== undefined) CFG.autoCollectED2K = config.autoCollectED2K;
          if (config.autoCollectMagnet !== undefined) CFG.autoCollectMagnet = config.autoCollectMagnet;
          if (config.ed2kFileNameReplaceEnabled !== undefined) CFG.ed2kFileNameReplaceEnabled = config.ed2kFileNameReplaceEnabled;
          if (config.ed2kFileNameReplaceRules) CFG.ed2kFileNameReplaceRules = config.ed2kFileNameReplaceRules;
          if (config.enableHistory !== undefined) CFG.enableHistory = config.enableHistory;
          if (config.maxHistoryItems !== undefined) CFG.maxHistoryItems = config.maxHistoryItems;

          // 115设置
          if (config.pan115Enabled !== undefined) CFG.pan115Enabled = config.pan115Enabled;
          if (config.pan115Cookie) CFG.pan115Cookie = config.pan115Cookie;
          if (config.pan115UserAgent) CFG.pan115UserAgent = config.pan115UserAgent;
          if (config.pan115UploadDir) CFG.pan115UploadDir = config.pan115UploadDir;
          if (config.pan115FolderNames) CFG.pan115FolderNames = config.pan115FolderNames;
          if (config.pan115CurrentThreadFolder) CFG.pan115CurrentThreadFolder = config.pan115CurrentThreadFolder;
          if (config.pan115ThreadFolders) CFG.pan115ThreadFolders = config.pan115ThreadFolders;
          if (config.pan115TaskCount !== undefined) CFG.pan115TaskCount = config.pan115TaskCount;

          // 123Pan设置
          if (config.pan123Enabled !== undefined) CFG.pan123Enabled = config.pan123Enabled;
          if (config.pan123Token) CFG.pan123Token = config.pan123Token;
          if (config.pan123LoginUuid) CFG.pan123LoginUuid = config.pan123LoginUuid;
          if (config.pan123Cookie) CFG.pan123Cookie = config.pan123Cookie;
          if (config.pan123UploadDir) CFG.pan123UploadDir = config.pan123UploadDir;
          if (config.pan123MinSize) CFG.pan123MinSize = config.pan123MinSize;
          if (config.pan123MaxSize) CFG.pan123MaxSize = config.pan123MaxSize;
          if (config.pan123IncludeExt) CFG.pan123IncludeExt = config.pan123IncludeExt;
          if (config.pan123ExcludeExt) CFG.pan123ExcludeExt = config.pan123ExcludeExt;
          if (config.pan123VideoMinSize) CFG.pan123VideoMinSize = config.pan123VideoMinSize;
          if (config.pan123PickLargest !== undefined) CFG.pan123PickLargest = config.pan123PickLargest;
          if (config.pan123InstantOfflineAction) CFG.pan123InstantOfflineAction = config.pan123InstantOfflineAction;
          if (config.pan123InstantOfflineCheckDelay !== undefined) CFG.pan123InstantOfflineCheckDelay = config.pan123InstantOfflineCheckDelay;
          if (config.pan123BatchSendInterval !== undefined) CFG.pan123BatchSendInterval = config.pan123BatchSendInterval;
          if (config.pan123CurrentThreadFolder) CFG.pan123CurrentThreadFolder = config.pan123CurrentThreadFolder;
          if (config.pan123CurrentThreadFolder) CFG.pan123CurrentThreadFolder = config.pan123CurrentThreadFolder;
          if (config.pan123ThreadFolders) CFG.pan123ThreadFolders = config.pan123ThreadFolders;

          // AI 设置
          if (config.aiEnabled !== undefined) CFG.aiEnabled = config.aiEnabled;
          if (config.aiApiUrl) CFG.aiApiUrl = config.aiApiUrl;
          if (config.aiApiKey) CFG.aiApiKey = config.aiApiKey;
          if (config.aiModel) CFG.aiModel = config.aiModel;
          if (config.aiPrompt) CFG.aiPrompt = config.aiPrompt;

          // 高级设置
          if (config.hidePagination !== undefined) CFG.hidePagination = config.hidePagination;
          if (config.enableKeywordFilter !== undefined) CFG.enableKeywordFilter = config.enableKeywordFilter;
          if (config.keywordFilters) CFG.keywordFilters = config.keywordFilters;
          if (config.enabledModules) CFG.enabledModules = config.enabledModules;

          // 保存配置
          saveConfig();

          // 更新115任务统计显示（如果存在）
          if (CFG.pan115Enabled) {
            update115TaskCountDisplay();
          }

          showSuccessModal('配置导入成功！\n\n页面将自动刷新以应用新设置。');

          // 延迟刷新页面
          setTimeout(() => {
            location.reload();
          }, 2000);

        } catch (error) {
          console.error('导入配置失败:', error);
          showErrorModal('导入配置失败: ' + error.message);
        }
      };

      reader.readAsText(file);
    });

    // 添加取消事件监听器
    input.addEventListener('cancel', () => {
      console.log('用户取消了文件选择');
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    });

    document.body.appendChild(input);
    input.click();
  }

  // 重置配置
  function resetConfig() {
    if (!confirm('确定要重置所有配置到默认值吗？\n\n这将清除所有自定义设置，包括历史记录！')) {
      return;
    }

    try {
      // 重置为默认配置
      Object.assign(CFG, DEFAULT_CONFIG);

      // 清空历史记录
      CFG.historyItems = [];

      // 保存配置
      saveConfig();

      showSuccessModal('配置已重置为默认值！\n\n页面将自动刷新以应用新设置。');

      // 延迟刷新页面
      setTimeout(() => {
        location.reload();
      }, 2000);

    } catch (error) {
      console.error('重置配置失败:', error);
      showErrorModal('重置配置失败: ' + error.message);
    }
  }

  // ED2K文件名正则替换处理
  function processEd2kFileName(fileName) {
    if (!CFG.ed2kFileNameReplaceEnabled || !CFG.ed2kFileNameReplaceRules || CFG.ed2kFileNameReplaceRules.length === 0) {
      return fileName;
    }

    let processedName = fileName;

    try {
      for (let i = 0; i < CFG.ed2kFileNameReplaceRules.length; i++) {
        const rule = CFG.ed2kFileNameReplaceRules[i];
        if (rule.pattern && rule.replacement !== undefined) {
          const regex = new RegExp(rule.pattern, 'g');
          processedName = processedName.replace(regex, rule.replacement);
        }
      }

      // 清理多余的空格
      processedName = processedName.replace(/\s+/g, ' ').trim();
      return processedName;
    } catch (error) {
      console.error('ED2K文件名正则替换失败:', error);
      return fileName; // 出错时返回原文件名
    }
  }

  // 处理ED2K链接中的文件名
  function processEd2kLink(ed2kLink) {
    if (!CFG.ed2kFileNameReplaceEnabled || !CFG.ed2kFileNameReplaceRules || CFG.ed2kFileNameReplaceRules.length === 0) {
      return ed2kLink;
    }

    try {
      // ED2K链接格式: ed2k://|file|filename|filesize|hash|/
      const ed2kRegex = /^(ed2k:\/\/\|file\|)([^|]+)(\|[^|]+\|[^|]+\|.*)$/;
      const match = ed2kLink.match(ed2kRegex);

      if (match) {
        const prefix = match[1];
        const originalFileName = match[2];
        const suffix = match[3];

        const processedFileName = processEd2kFileName(originalFileName);
        return prefix + processedFileName + suffix;
      }

      return ed2kLink; // 如果格式不匹配，返回原链接
    } catch (error) {
      console.error('ED2K链接处理失败:', error);
      return ed2kLink; // 出错时返回原链接
    }
  }

  /*********************** 顶部聚合区 ***********************/
  const agg = ensureAggregator();
  function ensureAggregator() {
    const c = document.createElement('div');
    c.id = 'sht-aggregator';
    c.style.cssText = 'border:1px solid #ddd;border-radius:8px;padding:10px;margin:10px 0;background:#fafafa;box-shadow:0 1px 3px rgba(0,0,0,.04)';
    const title = document.createElement('div'); title.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap;';
    const h = document.createElement('strong'); h.textContent = '附件文本汇总 / 实用工具'; h.style.fontSize = '16px';
    const btn = (t, fn, type = 'default') => {
      const b = document.createElement('button');
      b.textContent = t;

      // 根据按钮类型设置不同的样式
      let baseStyle, hoverStyle, normalStyle;

      switch (type) {
        case 'primary':
          baseStyle = 'background: linear-gradient(135deg, #007cba 0%, #005a87 100%); color: white; border: 1px solid #005a87;';
          hoverStyle = 'background: linear-gradient(135deg, #005a87 0%, #004066 100%); border-color: #004066;';
          normalStyle = 'background: linear-gradient(135deg, #007cba 0%, #005a87 100%); border-color: #005a87;';
          break;
        case 'success':
          baseStyle = 'background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; border: 1px solid #1e7e34;';
          hoverStyle = 'background: linear-gradient(135deg, #1e7e34 0%, #155724 100%); border-color: #155724;';
          normalStyle = 'background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); border-color: #1e7e34;';
          break;
        case 'warning':
          baseStyle = 'background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%); color: #212529; border: 1px solid #e0a800;';
          hoverStyle = 'background: linear-gradient(135deg, #e0a800 0%, #d39e00 100%); border-color: #d39e00;';
          normalStyle = 'background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%); border-color: #e0a800;';
          break;
        case 'info':
          baseStyle = 'background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; border: 1px solid #138496;';
          hoverStyle = 'background: linear-gradient(135deg, #138496 0%, #0f6674 100%); border-color: #0f6674;';
          normalStyle = 'background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); border-color: #138496;';
          break;
        default:
          baseStyle = 'background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); color: #495057; border: 1px solid #ddd;';
          hoverStyle = 'background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%); border-color: #adb5bd;';
          normalStyle = 'background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-color: #ddd;';
      }

      b.style.cssText = `
        padding: 6px 12px;
        margin: 2px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        display: inline-flex;
        align-items: center;
        gap: 4px;
        ${baseStyle}
      `;

      b.addEventListener('mouseenter', () => {
        b.style.cssText = b.style.cssText.replace(normalStyle, hoverStyle);
        b.style.transform = 'translateY(-1px)';
        b.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
      });
      b.addEventListener('mouseleave', () => {
        b.style.cssText = b.style.cssText.replace(hoverStyle, normalStyle);
        b.style.transform = 'translateY(0)';
        b.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      });
      b.addEventListener('click', fn);
      return b;
    };
    const toggle = (label, init, fn) => { const w = document.createElement('label'); w.style.cssText = 'display:inline-flex;align-items:center;gap:4px;cursor:pointer'; const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!init; cb.addEventListener('change', () => fn(cb.checked)); w.append(cb, document.createTextNode(label)); return w; };
    const btnCopyAll = btn('📋 复制全部文本', copyAllText, 'success');
    const btnWrap = toggle('软换行', CFG.wrapAtTop, on => { CFG.wrapAtTop = on; saveConfig(); updateWrapMode(); });
    const btnSearch = btn('🔍 过滤', filterPrompt, 'info');
    const btnConf = btn('⚙️ 设置', openSettings, 'primary');
    const btnAiReply = btn('🤖 AI 回复', generateAiReply, 'success');
    btnAiReply.id = 'sht-ai-btn'; // 给按钮加个ID以便查找
    const btnImgToggle = btn(CFG.blockImages ? '🖼️ 屏蔽图片：开' : '🖼️ 屏蔽图片：关', () => {
      CFG.blockImages = !CFG.blockImages;
      saveConfig();
      btnImgToggle.textContent = CFG.blockImages ? '🖼️ 屏蔽图片：开' : '🖼️ 屏蔽图片：关';
      if (CFG.blockImages) applyImageBlocking(true, { forceRebuild: true }); else resetImageState();
    }, 'warning');
    const btnED2K = btn('🔄 刷新ED2K', () => queueED2KScan(true), 'info');
    const btnMagnet = btn('🔄 刷新磁力', () => queueMagnetScan(true), 'info');
    const btnAuthorOnly = btn('👤 只看楼主', () => toggleAuthorOnly(), 'default');
    const btnHistory = btn('📚 历史', () => openHistory(), 'default');
    const btnExport = btn('📤 导出', () => exportAll(), 'default');
    const btnCreateFolder123 = btn('📁 123 新建', () => showCreateFolderDialog(), 'success');
    btnCreateFolder123.id = 'sht-create-folder-btn';
    let btnCreateFolder115 = null;
    let btn115OneClick = null;
    let btn115TaskCount = null;
    let span115TaskCount = null;
    if (CFG.pan115Enabled) {
      btnCreateFolder115 = btn('📁 115 新建', () => showCreate115FolderDialog(), 'warning');
      btnCreateFolder115.id = 'sht-create-folder-115-btn';
      btn115OneClick = btn('⚡ 115 新建+离线', () => create115FolderAndSend(btn115OneClick), 'warning');
      // 115任务统计显示
      span115TaskCount = document.createElement('span');
      span115TaskCount.id = 'sht-115-task-count';
      const count = typeof CFG.pan115TaskCount === 'number' ? CFG.pan115TaskCount : 0;
      span115TaskCount.textContent = `115任务: ${count}`;
      span115TaskCount.title = `已发送115离线任务数量: ${count}`;
      span115TaskCount.style.cssText = 'font-size:13px;color:#856404;margin-left:4px;padding:4px 10px;background:#fff3cd;border:1px solid #ffc107;border-radius:4px;font-weight:600;display:inline-block;min-width:80px;text-align:center;vertical-align:middle;';
      btn115TaskCount = btn('🔄 重置', () => {
        if (confirm('确定要重置115任务统计吗？')) {
          CFG.pan115TaskCount = 0;
          saveConfig();
          update115TaskCountDisplay();
          showInfoModal('115任务统计已重置');
        }
      }, 'default');
      btn115TaskCount.style.cssText = btn115TaskCount.style.cssText.replace('padding: 6px 12px', 'padding: 4px 8px');
      btn115TaskCount.style.fontSize = '11px';
    }

    // 查找并移动论坛原有的收藏和评分按钮
    const originalFavBtn = document.querySelector('#k_favorite') || document.querySelector('a[href*="favorite"]') || document.querySelector('a[onclick*="favorite"]');
    const originalRateBtn = document.querySelector('#ak_rate') || document.querySelector('a[href*="rate"]') || document.querySelector('a[onclick*="rate"]');

    if (originalFavBtn) {
      // 克隆按钮以避免移动原按钮
      const favClone = originalFavBtn.cloneNode(true);
      favClone.style.cssText = 'padding:2px 8px;cursor:pointer;text-decoration:none;display:inline-block;margin:0 4px;';
      title.appendChild(favClone);
    }

    if (originalRateBtn) {
      // 克隆按钮以避免移动原按钮
      const rateClone = originalRateBtn.cloneNode(true);
      rateClone.style.cssText = 'padding:2px 8px;cursor:pointer;text-decoration:none;display:inline-block;margin:0 4px;';

      // 如果启用一键评分，替换点击事件
      if (CFG.enableQuickRate) {
        rateClone.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          quickRate(originalRateBtn);
        };
      }

      title.appendChild(rateClone);
    }

    const tip = document.createElement('span'); tip.style.cssText = 'font-size:12px;opacity:.7'; tip.textContent = '（聚合文本/ED2K/磁力；支持 123Pan / 115 离线；图片屏蔽可切换）';
    const headerButtons = [h, btnCopyAll, btnWrap, btnSearch, btnConf, btnAiReply, btnImgToggle, btnED2K, btnMagnet, btnAuthorOnly, btnHistory, btnExport, btnCreateFolder123];
    if (btnCreateFolder115) headerButtons.push(btnCreateFolder115);
    if (btn115OneClick) headerButtons.push(btn115OneClick);
    if (span115TaskCount && btn115TaskCount) {
      headerButtons.push(span115TaskCount, btn115TaskCount);
    }
    headerButtons.push(tip);
    title.append(...headerButtons);
    // 获取帖子第一楼的纯文本内容
    function getThreadContent() {
      const firstPost = document.querySelector('#postlist > div[id^="post_"]');
      if (!firstPost) return '';

      const contentCell = firstPost.querySelector('td.t_f');
      if (!contentCell) return '';

      const clone = contentCell.cloneNode(true);
      clone.querySelectorAll('blockquote, .quote, .tip, .alert, script, style, .pstatus').forEach(el => el.remove());

      return clone.innerText.trim();
    }

    // 生成 AI 回复
    async function generateAiReply() {
      if (!CFG.aiEnabled) {
        showWarningModal('请先在设置中启用 AI 助手并配置 API Key\n\n设置路径：右上角设置 -> AI 助手');
        return;
      }

      const threadInfo = getThreadInfo();
      const content = getThreadContent();

      if (!threadInfo.title) {
        showErrorModal('无法提取帖子标题');
        return;
      }

      const btn = document.querySelector('#sht-ai-btn');
      const originalText = btn ? btn.textContent : '';
      if (btn) {
        btn.textContent = '🤖 生成中...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
      }

      try {
        const promptText = (CFG.aiPrompt || '你是一个热心的论坛助手。').trim();
        const userContent = `标题：${threadInfo.title}\n\n内容：\n${content ? content.substring(0, 3000) : '(无内容)'}`;

        // showInfoModal('正在请求 AI 生成回复，请稍候...');

        const response = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'POST',
            url: CFG.aiApiUrl + '/chat/completions',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${CFG.aiApiKey}`
            },
            data: JSON.stringify({
              model: CFG.aiModel,
              messages: [
                { role: 'system', content: promptText },
                { role: 'user', content: userContent }
              ]
            }),
            timeout: 60000,
            onload: (res) => {
              if (res.status === 200) {
                try {
                  const json = JSON.parse(res.responseText);
                  resolve(json);
                } catch (e) {
                  reject(new Error('无法解析响应 JSON'));
                }
              } else {
                reject(new Error(`API Error: ${res.status} ${res.responseText}`));
              }
            },
            onerror: (err) => reject(new Error('网络请求失败')),
            ontimeout: () => reject(new Error('请求超时'))
          });
        });

        if (response && response.choices && response.choices.length > 0) {
          let reply = response.choices[0].message.content.trim();
          reply = reply.replace(/^["'«»]|^“|”$|["'«»]$/g, '');

          GM_setClipboard(reply);
          showSuccessModal(`AI 回复已生成并复制到剪贴板！\n\n回复内容：\n${reply.substring(0, 100)}${reply.length > 100 ? '...' : ''}`);
        } else {
          throw new Error('API 返回了无效的数据结构');
        }

      } catch (error) {
        console.error('AI Reply Error:', error);
        showErrorModal(`生成 AI 回复失败\n\n${error.message}`);
      } finally {
        if (btn) {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.opacity = '1';
        }
      }
    }

    const list = document.createElement('div'); list.id = 'sht-agg-list'; list.style.cssText = 'margin-top:8px;display:grid;gap:8px';
    const ed2kBox = document.createElement('div'); ed2kBox.id = 'sht-agg-ed2k'; ed2kBox.style.marginTop = '8px';
    const magnetBox = document.createElement('div'); magnetBox.id = 'sht-agg-magnet'; magnetBox.style.marginTop = '8px';
    c.append(title, list, ed2kBox, magnetBox);

    // 检查当前帖子对应的文件夹
    checkCurrentThreadFolder();
    if (CFG.pan115Enabled) {
      checkCurrentThreadFolder115();
    }

    // 初始化创建文件夹按钮显示
    updateCreateFolderButton();
    if (CFG.pan115Enabled) {
      updateCreateFolderButton115();
      refreshPan115FolderInfo();
      // 初始化115任务统计显示
      update115TaskCountDisplay();
    }
    const threadTitle = document.querySelector('#thread_subject')?.parentElement;
    (threadTitle ? threadTitle : document.body).insertAdjacentElement(threadTitle ? 'afterend' : 'afterbegin', c);

    function updateWrapMode() { c.querySelectorAll('.sht-agg-item textarea, #sht-agg-ed2k textarea, #sht-agg-magnet textarea').forEach(el => { if (CFG.wrapAtTop) { el.style.whiteSpace = 'pre-wrap'; el.style.wordBreak = 'break-word'; } else { el.style.whiteSpace = 'pre'; el.style.wordBreak = 'normal'; } }); }
    function copyAllText() {
      const chunks = [...list.querySelectorAll('.sht-agg-item textarea')].map(t => `【${t.dataset.title || '附件'}】\n${t.value}`);
      const edTa = ed2kBox.querySelector('textarea'); if (edTa && edTa.value.trim()) chunks.unshift(`【ED2K(${edTa.dataset.count || 0})】\n${edTa.value}`);
      const mgTa = magnetBox.querySelector('textarea'); if (mgTa && mgTa.value.trim()) chunks.unshift(`【磁力(${mgTa.dataset.count || 0})】\n${mgTa.value}`);
      GM_setClipboard(chunks.join('\n\n' + '-'.repeat(40) + '\n\n')); alert('已复制全部（含ED2K/磁力）。');
    }
    function filterPrompt() { const kw = prompt('输入关键词进行过滤（留空恢复）：', ''); const items = list.querySelectorAll('.sht-agg-item'); if (!kw) { items.forEach(it => it.style.display = ''); return; } const s = kw.toLowerCase(); items.forEach(it => { const txt = (it.textContent || '').toLowerCase(); it.style.display = txt.includes(s) ? '' : ''; }); }
    c.updateWrapMode = updateWrapMode; c.list = list; c.ed2kBox = ed2kBox; c.magnetBox = magnetBox;
    c.addItem = (title, text) => {
      // 检查是否为种子文件
      const isTorrentFile = /\.torrent$/i.test(title) || text.includes('forum.php?mod=attachment') && text.includes('.torrent');

      // 检查是否为图片文件
      const isImageFile = /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)$/i.test(title);

      // 如果是图片文件，不添加到聚合区域
      if (isImageFile) {
        console.log('跳过图片文件添加到聚合区域:', title);
        return;
      }

      const card = document.createElement('div'); card.className = 'sht-agg-item'; card.style.cssText = 'border:1px solid #e6e6e6;border-radius:6px;padding:6px;background:#fff';
      const head = document.createElement('div'); head.style.cssText = 'display:flex;align-items:center;gap:8px;justify-content:space-between';
      const name = document.createElement('span'); name.textContent = title; name.style.fontWeight = '600';
      const actions = document.createElement('div'); actions.style.cssText = 'display:inline-flex;gap:6px';

      if (isTorrentFile) {
        // 种子文件特殊处理：显示下载和123Pan按钮
        const bDownload = document.createElement('button'); bDownload.textContent = '下载'; bDownload.style.cssText = 'padding:2px 8px;cursor:pointer;background:#28a745;color:white;border:none;border-radius:3px';
        const b123Pan = document.createElement('button'); b123Pan.textContent = '发送到123Pan'; b123Pan.style.cssText = 'padding:2px 8px;cursor:pointer;background:#007cba;color:white;border:none;border-radius:3px';

        bDownload.addEventListener('click', () => { window.open(text, '_blank'); });
        b123Pan.addEventListener('click', async () => {
          if (!CFG.pan123Enabled) {
            showWarningModal('请先在设置中启用 123Pan 功能并配置认证信息');
            return;
          }

          b123Pan.textContent = '发送中...';
          b123Pan.disabled = true;

          try {
            // 使用GM_xmlhttpRequest下载torrent文件（绕过CORS）
            const torrentBlob = await downloadFileWithGM(text);
            const filename = title.replace(/\.torrent$/i, '');

            // 处理torrent文件离线下载
            await processTorrentOffline(torrentBlob, filename);
          } catch (error) {
            console.error('发送到123Pan失败:', error);
            showErrorModal(`发送失败: ${error.message}`);
          } finally {
            b123Pan.textContent = '发送到123Pan';
            b123Pan.disabled = false;
          }
        });

        actions.append(bDownload, b123Pan);
        head.append(name, actions);
        card.append(head);
      } else {
        // 普通文件处理：显示复制和折叠按钮
        const bCopy = document.createElement('button'); bCopy.textContent = '复制'; bCopy.style.cssText = 'padding:2px 8px;cursor:pointer';
        const bCol = document.createElement('button'); bCol.textContent = '折叠'; bCol.style.cssText = 'padding:2px 8px;cursor:pointer';
        const body = document.createElement('div'); const ta = document.createElement('textarea'); ta.value = text; ta.rows = Math.min(16, Math.max(6, text.split('\n').length)); ta.style.cssText = 'width:100%;box-sizing:border-box;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px'; ta.dataset.title = title;
        bCopy.addEventListener('click', () => { GM_setClipboard(ta.value); bCopy.textContent = '已复制'; setTimeout(() => bCopy.textContent = '复制', 1200); });
        bCol.addEventListener('click', () => { body.style.display = body.style.display === 'none' ? '' : 'none'; });
        actions.append(bCopy, bCol); head.append(name, actions); body.append(ta); card.append(head, body);
      }

      list.append(card); c.updateWrapMode(); queueED2KScan(true); queueMagnetScan(true); return card;
    };

    // 只看楼主功能 - 使用论坛自带的只看该作者功能
    let authorOnlyMode = CFG.authorOnlyMode || false;
    let threadAuthorId = null;
    let currentTid = null;

    // 初始化按钮状态
    function initAuthorOnlyButton() {
      btnAuthorOnly.textContent = authorOnlyMode ? '显示全部' : '只看楼主';
      btnAuthorOnly.style.background = authorOnlyMode ? '#ff6b6b' : '';
      btnAuthorOnly.style.color = authorOnlyMode ? 'white' : '';
    }

    // 获取楼主UID
    function getThreadAuthorId() {
      const tid = getThreadId();
      if (!tid) return null;

      // 如果当前帖子的UID已经获取过，直接返回
      if (threadAuthorId && currentTid === tid) {
        return threadAuthorId;
      }

      // 如果是新帖子，清空缓存
      if (currentTid !== tid) {
        threadAuthorId = null;
        currentTid = tid;
      }

      // 尝试多种方式获取楼主UID
      const selectors = [
        // 方式1：从第一个帖子的作者信息区域
        '[id^="post_"] .authi a.xw1[href*="uid="]',
        // 方式2：从用户信息区域
        '[id^="post_"] .xw1 a[href*="uid="]',
        // 方式3：从作者链接
        '[id^="post_"] a[href*="home.php?mod=space"][href*="uid="]',
        // 方式4：从用户头像区域
        '[id^="post_"] .avatar a[href*="uid="]'
      ];

      for (const selector of selectors) {
        try {
          const authorLink = document.querySelector(selector);
          if (authorLink && authorLink.href) {
            const match = authorLink.href.match(/uid=(\d+)/);
            if (match) {
              threadAuthorId = match[1];
              // console.log('找到楼主UID:', threadAuthorId, '通过选择器:', selector);
              return threadAuthorId;
            }
          }
        } catch (e) {
          // 忽略选择器错误，继续尝试下一个
        }
      }

      // 方式5：从帖子标题区域获取
      try {
        const titleElement = document.querySelector('#thread_subject');
        if (titleElement && titleElement.parentElement) {
          const titleAuthorLink = titleElement.parentElement.querySelector('a[href*="uid="]');
          if (titleAuthorLink) {
            const match = titleAuthorLink.href.match(/uid=(\d+)/);
            if (match) {
              threadAuthorId = match[1];
              // console.log('从标题区域找到楼主UID:', threadAuthorId);
              return threadAuthorId;
            }
          }
        }
      } catch (e) {
        // console.log('从标题区域获取UID失败:', e);
      }

      // 如果所有方式都失败，尝试从页面中查找所有包含uid的链接
      const allLinks = document.querySelectorAll('a[href*="uid="]');
      // console.log('页面中找到的所有UID链接:', allLinks.length);

      for (const link of allLinks) {
        const match = link.href.match(/uid=(\d+)/);
        if (match) {
          // 检查这个链接是否在第一个帖子中
          const firstPost = document.querySelector('[id^="post_"]');
          if (firstPost && firstPost.contains(link)) {
            threadAuthorId = match[1];
            // console.log('通过遍历找到楼主UID:', threadAuthorId, '链接:', link.href);
            return threadAuthorId;
          }
        }
      }

      // 最后尝试：直接查找第一个帖子中的所有链接
      const firstPost = document.querySelector('[id^="post_"]');
      if (firstPost) {
        const firstPostLinks = firstPost.querySelectorAll('a[href*="uid="]');
        // console.log('第一个帖子中的UID链接:', firstPostLinks.length);
        for (const link of firstPostLinks) {
          const match = link.href.match(/uid=(\d+)/);
          if (match) {
            threadAuthorId = match[1];
            // console.log('从第一个帖子中找到楼主UID:', threadAuthorId, '链接:', link.href);
            return threadAuthorId;
          }
        }
      }

      // console.log('无法找到楼主UID，尝试的选择器:', selectors);
      // console.log('当前页面URL:', location.href);
      // console.log('当前帖子TID:', tid);
      return null;
    }

    // 检查当前是否在只看该作者模式
    function isInAuthorOnlyMode() {
      return location.href.includes('authorid=');
    }

    function toggleAuthorOnly() {
      const authorId = getThreadAuthorId();
      if (!authorId) {
        alert('无法识别楼主，请稍后再试');
        return;
      }

      if (isInAuthorOnlyMode()) {
        // 当前在只看楼主模式，切换到显示全部
        authorOnlyMode = false;
        CFG.authorOnlyMode = false;
        saveConfig();
        initAuthorOnlyButton();

        // 跳转到原始URL（去掉authorid参数）
        const baseUrl = location.href.split('&authorid=')[0].split('?authorid=')[0];
        window.location.href = baseUrl;
      } else {
        // 当前在显示全部模式，切换到只看楼主
        authorOnlyMode = true;
        CFG.authorOnlyMode = true;
        saveConfig();
        initAuthorOnlyButton();

        // 跳转到只看该作者模式
        const tid = getThreadId();
        if (tid) {
          const authorOnlyUrl = `forum.php?mod=viewthread&tid=${tid}&page=1&authorid=${authorId}`;
          window.location.href = authorOnlyUrl;
        }
      }
    }

    function updateTipText(text) {
      const tip = document.querySelector('#sht-aggregator span:last-child');
      if (tip) {
        tip.textContent = text;
      }
    }

    // 页面加载时检查状态
    function checkAuthorOnlyStatus() {
      const isAuthorOnly = isInAuthorOnlyMode();
      if (isAuthorOnly !== authorOnlyMode) {
        authorOnlyMode = isAuthorOnly;
        CFG.authorOnlyMode = authorOnlyMode;
        saveConfig();
      }

      // 清空缓存，确保每次进入新页面都重新获取UID
      threadAuthorId = null;
      currentTid = null;

      initAuthorOnlyButton();

      if (isAuthorOnly) {
        updateTipText('（当前为只看楼主模式）');
      } else {
        updateTipText('（聚合文本/ED2K/磁力；图片屏蔽可切换）');
      }
    }

    // 初始化
    checkAuthorOnlyStatus();

    c.toggleAuthorOnly = toggleAuthorOnly;

    // 历史记录功能
    function openHistory() {
      const dialog = document.createElement('div');
      dialog.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); z-index: 10001; display: flex;
      align-items: center; justify-content: center; font-family: Arial, sans-serif;
    `;

      const panel = document.createElement('div');
      panel.style.cssText = `
      background: white; border-radius: 8px; padding: 20px; max-width: 800px;
      max-height: 80vh; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

      const title = document.createElement('h3');
      title.textContent = '访问历史记录';
      title.style.cssText = 'margin: 0 0 20px 0; color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;';

      const controls = document.createElement('div');
      controls.style.cssText = 'display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;';

      const clearAllBtn = document.createElement('button');
      clearAllBtn.textContent = '🗑️ 清空全部';
      clearAllBtn.style.cssText = `
      padding: 6px 12px;
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: white;
      border: 1px solid #c82333;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      display: inline-flex;
      align-items: center;
      gap: 4px;
    `;
      clearAllBtn.addEventListener('mouseenter', () => {
        clearAllBtn.style.background = 'linear-gradient(135deg, #c82333 0%, #bd2130 100%)';
        clearAllBtn.style.transform = 'translateY(-1px)';
        clearAllBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
      });
      clearAllBtn.addEventListener('mouseleave', () => {
        clearAllBtn.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
        clearAllBtn.style.transform = 'translateY(0)';
        clearAllBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      });
      clearAllBtn.onclick = () => {
        if (confirm('确定要清空所有历史记录吗？')) {
          CFG.historyItems = [];
          saveConfig();
          dialog.remove();
          openHistory();
        }
      };

      const exportBtn = document.createElement('button');
      exportBtn.textContent = '📤 导出历史';
      exportBtn.style.cssText = `
      padding: 6px 12px;
      background: linear-gradient(135deg, #007cba 0%, #005a87 100%);
      color: white;
      border: 1px solid #005a87;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      display: inline-flex;
      align-items: center;
      gap: 4px;
    `;
      exportBtn.addEventListener('mouseenter', () => {
        exportBtn.style.background = 'linear-gradient(135deg, #005a87 0%, #004066 100%)';
        exportBtn.style.transform = 'translateY(-1px)';
        exportBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
      });
      exportBtn.addEventListener('mouseleave', () => {
        exportBtn.style.background = 'linear-gradient(135deg, #007cba 0%, #005a87 100%)';
        exportBtn.style.transform = 'translateY(0)';
        exportBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      });
      exportBtn.onclick = () => exportHistory();

      controls.append(clearAllBtn, exportBtn);

      // 分页设置
      const itemsPerPage = 20;
      let currentPage = 1;
      const totalPages = Math.ceil(CFG.historyItems.length / itemsPerPage);

      const list = document.createElement('div');
      list.style.cssText = 'max-height: 400px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px;';

      // 分页控件
      const pagination = document.createElement('div');
      pagination.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 10px; margin: 10px 0;';

      const prevBtn = document.createElement('button');
      prevBtn.textContent = '上一页';
      prevBtn.style.cssText = 'padding: 4px 8px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 3px; cursor: pointer; font-size: 12px;';
      prevBtn.disabled = currentPage <= 1;

      const pageInfo = document.createElement('span');
      pageInfo.style.cssText = 'font-size: 12px; color: #666;';

      const nextBtn = document.createElement('button');
      nextBtn.textContent = '下一页';
      nextBtn.style.cssText = 'padding: 4px 8px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 3px; cursor: pointer; font-size: 12px;';
      nextBtn.disabled = currentPage >= totalPages;

      function updatePagination() {
        pageInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页 (${CFG.historyItems.length} 条记录)`;
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
      }

      function renderHistoryItems() {
        list.innerHTML = '';

        if (CFG.historyItems.length === 0) {
          const empty = document.createElement('div');
          empty.textContent = '暂无访问历史';
          empty.style.cssText = 'text-align: center; padding: 40px; color: #666;';
          list.appendChild(empty);
          return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, CFG.historyItems.length);
        const pageItems = CFG.historyItems.slice(startIndex, endIndex);

        pageItems.forEach((item, index) => {
          const actualIndex = startIndex + index;
          const itemDiv = document.createElement('div');
          itemDiv.style.cssText = 'padding: 10px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;';

          const info = document.createElement('div');
          info.style.cssText = 'flex: 1; min-width: 0;';

          const titleEl = document.createElement('div');
          titleEl.textContent = item.title || '未知标题';
          titleEl.style.cssText = 'font-weight: bold; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';

          const meta = document.createElement('div');
          meta.style.cssText = 'font-size: 12px; color: #666;';
          meta.textContent = `作者: ${item.author || '未知'} | TID: ${item.tid} | 访问时间: ${new Date(item.timestamp).toLocaleString()}`;

          const actions = document.createElement('div');
          actions.style.cssText = 'display: flex; gap: 5px;';

          const openBtn = document.createElement('button');
          openBtn.textContent = '打开';
          openBtn.style.cssText = 'padding: 4px 8px; background: #007cba; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
          openBtn.onclick = () => window.open(item.url, '_blank');

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = '删除';
          deleteBtn.style.cssText = 'padding: 4px 8px; background: #ff6b6b; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';
          deleteBtn.onclick = () => {
            CFG.historyItems.splice(actualIndex, 1);
            saveConfig();
            dialog.remove();
            openHistory();
          };

          actions.append(openBtn, deleteBtn);
          info.append(titleEl, meta);
          itemDiv.append(info, actions);
          list.appendChild(itemDiv);
        });
      }

      prevBtn.onclick = () => {
        if (currentPage > 1) {
          currentPage--;
          updatePagination();
          renderHistoryItems();
        }
      };

      nextBtn.onclick = () => {
        if (currentPage < totalPages) {
          currentPage++;
          updatePagination();
          renderHistoryItems();
        }
      };

      pagination.append(prevBtn, pageInfo, nextBtn);
      updatePagination();
      renderHistoryItems();

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '❌ 关闭';
      closeBtn.style.cssText = `
      padding: 8px 16px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      color: #495057;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 15px;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      display: inline-flex;
      align-items: center;
      gap: 4px;
    `;
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)';
        closeBtn.style.borderColor = '#adb5bd';
        closeBtn.style.transform = 'translateY(-1px)';
        closeBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
      });
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
        closeBtn.style.borderColor = '#ddd';
        closeBtn.style.transform = 'translateY(0)';
        closeBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      });
      closeBtn.onclick = () => dialog.remove();

      panel.append(title, controls, pagination, list, closeBtn);
      dialog.appendChild(panel);
      document.body.appendChild(dialog);

      dialog.onclick = (e) => { if (e.target === dialog) dialog.remove(); };
    }

    // 导出所有内容功能
    function exportAll() {
      const threadInfo = getThreadInfo();
      const tid = getThreadId();
      if (!tid) return;

      // 收集所有数据
      const exportData = {
        threadInfo: {
          title: threadInfo.title,
          author: threadInfo.author,
          tid: tid,
          url: location.href,
          exportTime: new Date().toISOString()
        },
        texts: [],
        ed2kLinks: [],
        magnetLinks: [],
        passwords: CFG.passwordCandidates,
        attachments: []
      };

      // 收集文本内容
      list.querySelectorAll('.sht-agg-item').forEach(item => {
        const title = item.querySelector('span[style*="font-weight"]')?.textContent || '未知';
        const content = item.querySelector('textarea')?.value || '';
        if (content.trim()) {
          exportData.texts.push({ title, content });
        }
      });

      // 收集ED2K链接
      const ed2kTextarea = ed2kBox.querySelector('textarea');
      if (ed2kTextarea && ed2kTextarea.value.trim()) {
        exportData.ed2kLinks = ed2kTextarea.value.split('\n').filter(line => line.trim());
      }

      // 收集磁力链接
      const magnetTextarea = magnetBox.querySelector('textarea');
      if (magnetTextarea && magnetTextarea.value.trim()) {
        exportData.magnetLinks = magnetTextarea.value.split('\n').filter(line => line.trim());
      }

      // 收集附件信息
      document.querySelectorAll('a[href*="forum.php?mod=attachment"]').forEach(link => {
        const name = link.textContent?.trim() || '';
        const url = link.href;
        if (name && url) {
          exportData.attachments.push({ name, url });
        }
      });

      // 创建下载
      const filename = `${threadInfo.title || '未知标题'}_${threadInfo.author || '未知作者'}_${tid}.json`;
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
      alert('导出完成！');
    }

    // 导出历史记录
    function exportHistory() {
      const blob = new Blob([JSON.stringify(CFG.historyItems, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `sht_history_${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      URL.revokeObjectURL(url);
      alert('历史记录导出完成！');
    }


    // 获取帖子信息
    function getThreadInfo() {
      const title = document.querySelector('#thread_subject')?.textContent?.trim() || '未知标题';
      const author = document.querySelector('[id^="post_"] .xw1 a, [id^="post_"] .xw1 strong a')?.textContent?.trim() || '未知作者';
      return { title, author };
    }

    // 获取帖子ID
    function getThreadId() {
      const match = location.href.match(/tid=(\d+)/);
      return match ? match[1] : null;
    }

    // 记录访问历史
    function recordHistory() {
      if (!CFG.enableHistory) return;

      const tid = getThreadId();
      if (!tid) return;

      const threadInfo = getThreadInfo();
      const existingIndex = CFG.historyItems.findIndex(item => item.tid === tid);

      const historyItem = {
        tid,
        title: threadInfo.title,
        author: threadInfo.author,
        url: location.href,
        timestamp: Date.now()
      };

      if (existingIndex >= 0) {
        CFG.historyItems[existingIndex] = historyItem;
      } else {
        CFG.historyItems.unshift(historyItem);
        if (CFG.historyItems.length > CFG.maxHistoryItems) {
          CFG.historyItems = CFG.historyItems.slice(0, CFG.maxHistoryItems);
        }
      }

      saveConfig();
    }

    // 初始化时记录历史
    recordHistory();

    return c;
  }

  function openSettings() {
    // 创建设置对话框
    const dialog = document.createElement('div');
    dialog.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 10000; display: flex;
    align-items: center; justify-content: center; font-family: Arial, sans-serif;
  `;

    const panel = document.createElement('div');
    panel.style.cssText = `
    background: white; border-radius: 8px; padding: 0; max-width: 800px;
    max-height: 85vh; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    display: flex; flex-direction: column;
  `;

    const title = document.createElement('h3');
    title.textContent = 'SHT 脚本设置';
    title.style.cssText = 'margin: 0; padding: 20px 20px 10px 20px; color: #333; border-bottom: 2px solid #eee;';

    // 创建标签页导航
    const tabNav = document.createElement('div');
    tabNav.style.cssText = 'display: flex; border-bottom: 1px solid #ddd; background: #f8f9fa;';

    const tabs = [
      { id: 'basic', name: '基础设置', icon: '⚙️' },
      { id: 'display', name: '显示设置', icon: '👁️' },
      { id: 'collection', name: '收集设置', icon: '📥' },
      { id: 'pan115', name: '115 离线', icon: '💾' },
      { id: 'pan123', name: '123 离线', icon: '☁️' },
      { id: 'ai', name: 'AI 助手', icon: '🤖' },
      { id: 'advanced', name: '高级设置', icon: '🔧' }
    ];

    const tabButtons = [];
    tabs.forEach((tab, index) => {
      const tabBtn = document.createElement('button');
      tabBtn.textContent = `${tab.icon} ${tab.name}`;
      tabBtn.type = 'button';
      tabBtn.style.cssText = `
      flex: 1; padding: 12px 16px; border: none; background: transparent;
      cursor: pointer; font-size: 14px; border-bottom: 3px solid transparent;
      transition: all 0.2s ease;
    `;
      tabBtn.dataset.tab = tab.id;

      if (index === 0) {
        tabBtn.style.background = 'white';
        tabBtn.style.borderBottomColor = '#007cba';
        tabBtn.style.color = '#007cba';
      }

      tabBtn.addEventListener('click', () => switchTab(tab.id));
      tabNav.appendChild(tabBtn);
      tabButtons.push(tabBtn);
    });

    // 创建内容区域
    const contentArea = document.createElement('div');
    contentArea.style.cssText = 'flex: 1; overflow-y: auto; padding: 20px;';

    // 创建各个标签页内容
    const tabContents = {};

    // 基础设置标签页
    const basicTab = document.createElement('div');
    basicTab.id = 'tab-basic';
    basicTab.style.cssText = 'display: block;';
    tabContents.basic = basicTab;

    // 显示设置标签页
    const displayTab = document.createElement('div');
    displayTab.id = 'tab-display';
    displayTab.style.cssText = 'display: none;';
    tabContents.display = displayTab;

    // 收集设置标签页
    const collectionTab = document.createElement('div');
    collectionTab.id = 'tab-collection';
    collectionTab.style.cssText = 'display: none;';
    tabContents.collection = collectionTab;

    // 115 离线标签页
    const pan115Tab = document.createElement('div');
    pan115Tab.id = 'tab-pan115';
    pan115Tab.style.cssText = 'display: none;';
    tabContents.pan115 = pan115Tab;

    // 123Pan 设置标签页
    const pan123Tab = document.createElement('div');
    pan123Tab.id = 'tab-pan123';
    pan123Tab.style.cssText = 'display: none;';
    tabContents.pan123 = pan123Tab;

    // AI 助手 设置标签页
    const aiTab = document.createElement('div');
    aiTab.id = 'tab-ai';
    aiTab.style.cssText = 'display: none;';
    tabContents.ai = aiTab;

    // 高级设置标签页
    const advancedTab = document.createElement('div');
    advancedTab.id = 'tab-advanced';
    advancedTab.style.cssText = 'display: none;';
    tabContents.advanced = advancedTab;

    // 标签页切换函数
    function switchTab(tabId) {
      // 隐藏所有标签页
      Object.values(tabContents).forEach(tab => {
        tab.style.display = 'none';
      });

      // 重置所有按钮样式
      tabButtons.forEach(btn => {
        btn.style.background = 'transparent';
        btn.style.borderBottomColor = 'transparent';
        btn.style.color = '#333';
      });

      // 显示选中的标签页
      tabContents[tabId].style.display = 'block';

      // 高亮选中的按钮
      const activeBtn = tabButtons.find(btn => btn.dataset.tab === tabId);
      activeBtn.style.background = 'white';
      activeBtn.style.borderBottomColor = '#007cba';
      activeBtn.style.color = '#007cba';
    }

    // 基础设置内容
    const basicForm = document.createElement('form');
    basicForm.style.cssText = 'display: grid; gap: 15px;';

    // ===== 基础设置 =====
    // 密码候选设置
    const pwdGroup = createSettingGroup('密码候选', '压缩包解压时尝试的密码列表（每行一个密码）');
    const pwdInput = document.createElement('textarea');
    pwdInput.value = CFG.passwordCandidates.join('\n');
    pwdInput.rows = 6;
    pwdInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;';
    pwdGroup.appendChild(pwdInput);
    basicForm.appendChild(pwdGroup);

    // 自动加载阈值
    const autoGroup = createSettingGroup('自动加载阈值', '文件大小超过此值时需要手动点击加载（字节）');
    const autoInput = document.createElement('input');
    autoInput.type = 'number';
    autoInput.value = CFG.maxAutoBytes;
    autoInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
    autoGroup.appendChild(autoInput);
    basicForm.appendChild(autoGroup);

    // 压缩包内文件大小限制
    const entryGroup = createSettingGroup('压缩包内文件大小限制', '压缩包内单个文件超过此大小时不显示（字节）');
    const entryInput = document.createElement('input');
    entryInput.type = 'number';
    entryInput.value = CFG.maxEntryBytes;
    entryInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
    entryGroup.appendChild(entryInput);
    basicForm.appendChild(entryGroup);

    // 自动上顶
    const hoistGroup = createSettingGroup('自动上顶', '解析文本后自动添加到顶部聚合区');
    const hoistCheckbox = document.createElement('input');
    hoistCheckbox.type = 'checkbox';
    hoistCheckbox.checked = CFG.autoHoistToTop;
    hoistCheckbox.style.marginRight = '8px';
    hoistGroup.appendChild(hoistCheckbox);
    hoistGroup.appendChild(document.createTextNode('启用自动上顶'));
    basicForm.appendChild(hoistGroup);

    // 域名自动跳转设置
    const domainGroup = createSettingGroup('域名自动跳转', '自动将副域名跳转到主域名以保持登录状态');
    const domainRedirectCheckbox = document.createElement('input');
    domainRedirectCheckbox.type = 'checkbox';
    domainRedirectCheckbox.checked = CFG.domainAutoRedirect !== false;
    domainRedirectCheckbox.style.marginRight = '8px';
    domainGroup.appendChild(domainRedirectCheckbox);
    domainGroup.appendChild(document.createTextNode('启用域名自动跳转'));
    basicForm.appendChild(domainGroup);

    // 主域名选择
    const primaryDomainGroup = createSettingGroup('主域名', '选择主域名，访问副域名时将自动跳转');
    const primaryDomainSelect = document.createElement('select');
    primaryDomainSelect.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';

    const domains = [
      { value: 'sehuatang.org', label: 'sehuatang.org (主域名)' },
      { value: 'www.sehuatang.org', label: 'www.sehuatang.org' },
      { value: 'sehuatang.net', label: 'sehuatang.net' },
      { value: 'www.sehuatang.net', label: 'www.sehuatang.net' }
    ];

    domains.forEach(domain => {
      const option = document.createElement('option');
      option.value = domain.value;
      option.textContent = domain.label;
      if (domain.value === (CFG.primaryDomain || 'sehuatang.org')) {
        option.selected = true;
      }
      primaryDomainSelect.appendChild(option);
    });

    primaryDomainGroup.appendChild(primaryDomainSelect);
    basicForm.appendChild(primaryDomainGroup);

    basicTab.appendChild(basicForm);

    // ===== 显示设置 =====
    const displayForm = document.createElement('form');
    displayForm.style.cssText = 'display: grid; gap: 15px;';

    // 图片屏蔽
    const imgGroup = createSettingGroup('图片屏蔽', '默认屏蔽帖子中的图片');
    const imgCheckbox = document.createElement('input');
    imgCheckbox.type = 'checkbox';
    imgCheckbox.checked = CFG.blockImages;
    imgCheckbox.style.marginRight = '8px';
    imgGroup.appendChild(imgCheckbox);
    imgGroup.appendChild(document.createTextNode('启用图片屏蔽'));
    displayForm.appendChild(imgGroup);

    // 图片白名单
    const whiteGroup = createSettingGroup('图片白名单', '不屏蔽这些域名的图片（逗号分隔）');
    const whiteInput = document.createElement('input');
    whiteInput.type = 'text';
    whiteInput.value = CFG.imageAllowDomains.join(', ');
    whiteInput.placeholder = '例如: example.com, imgur.com';
    whiteInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
    whiteGroup.appendChild(whiteInput);
    displayForm.appendChild(whiteGroup);

    // 占位显示元信息
    const metaGroup = createSettingGroup('占位显示元信息', '图片被屏蔽时是否显示域名和文件名');
    const metaCheckbox = document.createElement('input');
    metaCheckbox.type = 'checkbox';
    metaCheckbox.checked = CFG.imagePlaceholderShowMeta;
    metaCheckbox.style.marginRight = '8px';
    metaGroup.appendChild(metaCheckbox);
    metaGroup.appendChild(document.createTextNode('显示元信息'));
    displayForm.appendChild(metaGroup);

    // ===== 收集设置 =====
    const collectionForm = document.createElement('form');
    collectionForm.style.cssText = 'display: grid; gap: 15px;';

    // ED2K收集
    const ed2kGroup = createSettingGroup('ED2K收集', '自动收集并聚合页面中的ED2K链接');
    const ed2kCheckbox = document.createElement('input');
    ed2kCheckbox.type = 'checkbox';
    ed2kCheckbox.checked = CFG.autoCollectED2K;
    ed2kCheckbox.style.marginRight = '8px';
    ed2kGroup.appendChild(ed2kCheckbox);

    // ED2K文件名替换
    const ed2kReplaceGroup = createSettingGroup('ED2K文件名替换', '使用正则表达式替换ED2K链接中的文件名');
    const ed2kReplaceCheckbox = document.createElement('input');
    ed2kReplaceCheckbox.type = 'checkbox';
    ed2kReplaceCheckbox.checked = CFG.ed2kFileNameReplaceEnabled;
    ed2kReplaceCheckbox.style.marginRight = '8px';
    ed2kReplaceGroup.appendChild(ed2kReplaceCheckbox);

    // 替换规则容器
    const ed2kRulesContainer = document.createElement('div');
    ed2kRulesContainer.id = 'ed2k-rules-container';
    ed2kRulesContainer.style.cssText = 'margin-top: 10px; display: none;';
    ed2kReplaceGroup.appendChild(ed2kRulesContainer);

    // 添加规则按钮
    const addRuleBtn = document.createElement('button');
    addRuleBtn.type = 'button';
    addRuleBtn.textContent = '添加替换规则';
    addRuleBtn.style.cssText = 'padding: 4px 8px; margin: 5px 0; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;';
    ed2kRulesContainer.appendChild(addRuleBtn);

    // 规则列表
    const rulesList = document.createElement('div');
    rulesList.id = 'ed2k-rules-list';
    rulesList.style.cssText = 'margin-top: 10px;';
    ed2kRulesContainer.appendChild(rulesList);

    // 显示/隐藏规则容器
    ed2kReplaceCheckbox.addEventListener('change', () => {
      ed2kRulesContainer.style.display = ed2kReplaceCheckbox.checked ? 'block' : 'none';
    });
    if (CFG.ed2kFileNameReplaceEnabled) {
      ed2kRulesContainer.style.display = 'block';
    }

    // 添加规则功能
    function addEd2kRule(rule = { pattern: '', replacement: '' }) {
      const ruleDiv = document.createElement('div');
      ruleDiv.style.cssText = 'display: flex; gap: 8px; margin: 5px 0; align-items: center;';

      const patternInput = document.createElement('input');
      patternInput.type = 'text';
      patternInput.placeholder = '正则表达式模式';
      patternInput.value = rule.pattern || '';
      patternInput.style.cssText = 'flex: 1; padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;';

      const replacementInput = document.createElement('input');
      replacementInput.type = 'text';
      replacementInput.placeholder = '替换为';
      replacementInput.value = rule.replacement || '';
      replacementInput.style.cssText = 'flex: 1; padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;';

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = '删除';
      deleteBtn.style.cssText = 'padding: 4px 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;';
      deleteBtn.addEventListener('click', () => {
        ruleDiv.remove();
      });

      ruleDiv.appendChild(patternInput);
      ruleDiv.appendChild(replacementInput);
      ruleDiv.appendChild(deleteBtn);
      rulesList.appendChild(ruleDiv);
    }

    // 添加规则按钮事件
    addRuleBtn.addEventListener('click', () => {
      addEd2kRule();
    });

    // 初始化现有规则
    if (CFG.ed2kFileNameReplaceRules && CFG.ed2kFileNameReplaceRules.length > 0) {
      CFG.ed2kFileNameReplaceRules.forEach(rule => {
        addEd2kRule(rule);
      });
    } else {
      // 添加默认规则
      addEd2kRule({ pattern: '\\[\\d+\\.\\d+G/\\d+V/\\d+配额\\]', replacement: '' });
    }
    ed2kGroup.appendChild(document.createTextNode('启用ED2K收集'));
    collectionForm.appendChild(ed2kGroup);
    collectionForm.appendChild(ed2kReplaceGroup);

    // 磁力收集
    const magnetGroup = createSettingGroup('磁力收集', '自动收集并聚合页面中的磁力链接');
    const magnetCheckbox = document.createElement('input');
    magnetCheckbox.type = 'checkbox';
    magnetCheckbox.checked = CFG.autoCollectMagnet;
    magnetCheckbox.style.marginRight = '8px';
    magnetGroup.appendChild(magnetCheckbox);
    magnetGroup.appendChild(document.createTextNode('启用磁力收集'));
    collectionForm.appendChild(magnetGroup);

    // 只看楼主
    const authorOnlyGroup = createSettingGroup('只看楼主', '默认只显示楼主的帖子');
    const authorOnlyCheckbox = document.createElement('input');
    authorOnlyCheckbox.type = 'checkbox';
    authorOnlyCheckbox.checked = CFG.authorOnlyMode;
    authorOnlyCheckbox.style.marginRight = '8px';
    authorOnlyGroup.appendChild(authorOnlyCheckbox);
    authorOnlyGroup.appendChild(document.createTextNode('启用只看楼主模式'));
    collectionForm.appendChild(authorOnlyGroup);

    // 历史记录
    const historyGroup = createSettingGroup('历史记录', '记录访问过的帖子历史');
    const historyCheckbox = document.createElement('input');
    historyCheckbox.type = 'checkbox';
    historyCheckbox.checked = CFG.enableHistory;
    historyCheckbox.style.marginRight = '8px';
    historyGroup.appendChild(historyCheckbox);
    historyGroup.appendChild(document.createTextNode('启用历史记录'));

    const historyLimitGroup = document.createElement('div');
    historyLimitGroup.style.cssText = 'margin-top: 10px; display: flex; align-items: center; gap: 8px;';
    historyLimitGroup.appendChild(document.createTextNode('最大记录数:'));
    const historyLimitInput = document.createElement('input');
    historyLimitInput.type = 'number';
    historyLimitInput.value = CFG.maxHistoryItems;
    historyLimitInput.min = '10';
    historyLimitInput.max = '10000';
    historyLimitInput.style.cssText = 'width: 100px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;';
    historyLimitGroup.appendChild(historyLimitInput);
    historyGroup.appendChild(historyLimitGroup);
    collectionForm.appendChild(historyGroup);

    // 一键评分
    const quickRateGroup = createSettingGroup('一键评分', '点击评分按钮直接给出评分，无需弹窗');
    const quickRateCheckbox = document.createElement('input');
    quickRateCheckbox.type = 'checkbox';
    quickRateCheckbox.checked = CFG.enableQuickRate;
    quickRateCheckbox.style.marginRight = '8px';
    quickRateGroup.appendChild(quickRateCheckbox);
    quickRateGroup.appendChild(document.createTextNode('启用一键评分'));

    const rateScoreGroup = document.createElement('div');
    rateScoreGroup.style.cssText = 'margin-top: 10px; display: flex; align-items: center; gap: 8px;';
    rateScoreGroup.appendChild(document.createTextNode('默认评分:'));
    const rateScoreInput = document.createElement('input');
    rateScoreInput.type = 'number';
    rateScoreInput.value = CFG.defaultRateScore;
    rateScoreInput.min = '1';
    rateScoreInput.max = '10';
    rateScoreInput.style.cssText = 'width: 80px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;';
    rateScoreGroup.appendChild(rateScoreInput);
    rateScoreGroup.appendChild(document.createTextNode('分'));
    quickRateGroup.appendChild(rateScoreGroup);


    // 评分理由设置
    const reasonGroup = document.createElement('div');
    reasonGroup.style.cssText = 'margin-top: 8px; display: flex; align-items: center; gap: 8px;';
    reasonGroup.appendChild(document.createTextNode('评分理由:'));
    const reasonInput = document.createElement('input');
    reasonInput.type = 'text';
    reasonInput.value = CFG.defaultRateReason;
    reasonInput.placeholder = '输入评分理由';
    reasonInput.style.cssText = 'flex: 1; padding: 4px; border: 1px solid #ddd; border-radius: 4px;';
    reasonGroup.appendChild(reasonInput);
    quickRateGroup.appendChild(reasonGroup);
    collectionForm.appendChild(quickRateGroup);

    collectionTab.appendChild(collectionForm);

    // 排版优化 - 添加到显示设置
    const layoutGroup = createSettingGroup('排版优化', '在帖子列表页面隐藏特定列和置顶帖');

    const hideReplyGroup = document.createElement('div');
    hideReplyGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    const hideReplyCheckbox = document.createElement('input');
    hideReplyCheckbox.type = 'checkbox';
    hideReplyCheckbox.checked = CFG.hideReplyColumn;
    hideReplyCheckbox.style.marginRight = '8px';
    hideReplyGroup.appendChild(hideReplyCheckbox);
    hideReplyGroup.appendChild(document.createTextNode('隐藏回复/查看列'));
    layoutGroup.appendChild(hideReplyGroup);

    const hideLastReplyGroup = document.createElement('div');
    hideLastReplyGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    const hideLastReplyCheckbox = document.createElement('input');
    hideLastReplyCheckbox.type = 'checkbox';
    hideLastReplyCheckbox.checked = CFG.hideLastReplyColumn;
    hideLastReplyCheckbox.style.marginRight = '8px';
    hideLastReplyGroup.appendChild(hideLastReplyCheckbox);
    hideLastReplyGroup.appendChild(document.createTextNode('隐藏最后回复列'));
    layoutGroup.appendChild(hideLastReplyGroup);

    const hideAuthorGroup = document.createElement('div');
    hideAuthorGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    const hideAuthorCheckbox = document.createElement('input');
    hideAuthorCheckbox.type = 'checkbox';
    hideAuthorCheckbox.checked = CFG.hideAuthorColumn;
    hideAuthorCheckbox.style.marginRight = '8px';
    hideAuthorGroup.appendChild(hideAuthorCheckbox);
    hideAuthorGroup.appendChild(document.createTextNode('隐藏作者列'));
    layoutGroup.appendChild(hideAuthorGroup);

    const hideStickyGroup = document.createElement('div');
    hideStickyGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    const hideStickyCheckbox = document.createElement('input');
    hideStickyCheckbox.type = 'checkbox';
    hideStickyCheckbox.checked = CFG.hideStickyThreads;
    hideStickyCheckbox.style.marginRight = '8px';
    hideStickyGroup.appendChild(hideStickyCheckbox);
    hideStickyGroup.appendChild(document.createTextNode('隐藏置顶帖'));
    layoutGroup.appendChild(hideStickyGroup);
    displayForm.appendChild(layoutGroup);

    displayTab.appendChild(displayForm);

    // ===== 高级设置 =====
    const advancedForm = document.createElement('form');
    advancedForm.style.cssText = 'display: grid; gap: 15px;';

    // 分页和过滤功能
    const filterGroup = createSettingGroup('分页和过滤', '隐藏分页、关键词过滤和标题增强功能');

    const hidePaginationGroup = document.createElement('div');
    hidePaginationGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    const hidePaginationCheckbox = document.createElement('input');
    hidePaginationCheckbox.type = 'checkbox';
    hidePaginationCheckbox.checked = CFG.hidePagination;
    hidePaginationCheckbox.style.marginRight = '8px';
    hidePaginationGroup.appendChild(hidePaginationCheckbox);
    hidePaginationGroup.appendChild(document.createTextNode('隐藏分页'));
    filterGroup.appendChild(hidePaginationGroup);

    const enhanceTitlesGroup = document.createElement('div');
    enhanceTitlesGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    const enhanceTitlesCheckbox = document.createElement('input');
    enhanceTitlesCheckbox.type = 'checkbox';
    enhanceTitlesCheckbox.checked = CFG.enhanceTitles;
    enhanceTitlesCheckbox.style.marginRight = '8px';
    enhanceTitlesGroup.appendChild(enhanceTitlesCheckbox);
    enhanceTitlesGroup.appendChild(document.createTextNode('标题增强（【】→[]）'));
    filterGroup.appendChild(enhanceTitlesGroup);

    // 列表页标题正则替换
    const listTitleGroup = document.createElement('div');
    listTitleGroup.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column;';
    const listTitleLabel = document.createElement('label');
    listTitleLabel.textContent = '列表页标题正则替换:';
    listTitleLabel.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    listTitleGroup.appendChild(listTitleLabel);

    const listTitleCheckbox = document.createElement('input');
    listTitleCheckbox.type = 'checkbox';
    listTitleCheckbox.checked = CFG.enableListTitleEnhance;
    listTitleCheckbox.style.marginRight = '8px';
    const listTitleCheckboxGroup = document.createElement('div');
    listTitleCheckboxGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    listTitleCheckboxGroup.appendChild(listTitleCheckbox);
    listTitleCheckboxGroup.appendChild(document.createTextNode('启用列表页标题正则替换'));
    listTitleGroup.appendChild(listTitleCheckboxGroup);

    // 列表页替换规则
    const listRulesLabel = document.createElement('label');
    listRulesLabel.textContent = '替换规则（每行一个，格式：正则表达式|替换内容）:';
    listRulesLabel.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    listTitleGroup.appendChild(listRulesLabel);

    const listRulesTextarea = document.createElement('textarea');
    listRulesTextarea.value = CFG.listTitleReplaceRules.map(rule => `${rule.pattern}|${rule.replacement}`).join('\n');
    listRulesTextarea.placeholder = '例如：\n\\[\\d+\\.\\d+G/\\d+V/\\d+配额\\]|\n\\[情色分享\\]|\n\\[图文故事\\]|';
    listRulesTextarea.style.cssText = 'width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; resize: vertical; font-family: monospace;';
    listTitleGroup.appendChild(listRulesTextarea);

    filterGroup.appendChild(listTitleGroup);

    const keywordFilterGroup = document.createElement('div');
    keywordFilterGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    const keywordFilterCheckbox = document.createElement('input');
    keywordFilterCheckbox.type = 'checkbox';
    keywordFilterCheckbox.checked = CFG.enableKeywordFilter;
    keywordFilterCheckbox.style.marginRight = '8px';
    keywordFilterGroup.appendChild(keywordFilterCheckbox);
    keywordFilterGroup.appendChild(document.createTextNode('启用关键词过滤'));
    filterGroup.appendChild(keywordFilterGroup);

    // 关键词输入区域
    const keywordInputGroup = document.createElement('div');
    keywordInputGroup.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column;';
    const keywordLabel = document.createElement('label');
    keywordLabel.textContent = '关键词过滤（每行一个，支持正则表达式，匹配标题和类型）:';
    keywordLabel.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    keywordInputGroup.appendChild(keywordLabel);

    const keywordTextarea = document.createElement('textarea');
    keywordTextarea.value = CFG.keywordFilters.join('\n');
    keywordTextarea.placeholder = '例如：\n测试\n.*广告.*\n^【.*】\n图文故事\n.*故事.*';
    keywordTextarea.style.cssText = 'width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; resize: vertical;';
    keywordInputGroup.appendChild(keywordTextarea);
    filterGroup.appendChild(keywordInputGroup);

    // 历史访问帖子处理
    const historyPostGroup = document.createElement('div');
    historyPostGroup.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column;';
    const historyPostLabel = document.createElement('label');
    historyPostLabel.textContent = '历史访问帖子处理:';
    historyPostLabel.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    historyPostGroup.appendChild(historyPostLabel);

    const historyPostSelect = document.createElement('select');
    historyPostSelect.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;';
    historyPostSelect.innerHTML = `
    <option value="none">不处理</option>
    <option value="hide">隐藏已访问帖子</option>
    <option value="blue">标记为蓝色</option>
    <option value="strikethrough">添加删除线</option>
  `;
    historyPostSelect.value = CFG.historyPostAction;
    historyPostGroup.appendChild(historyPostSelect);

    // 颜色选择器（仅在选择蓝色时显示）
    const colorGroup = document.createElement('div');
    colorGroup.style.cssText = 'margin-top: 8px; display: flex; align-items: center; gap: 8px;';
    const colorLabel = document.createElement('label');
    colorLabel.textContent = '颜色:';
    colorLabel.style.cssText = 'font-size: 12px; color: #666;';
    colorGroup.appendChild(colorLabel);

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = CFG.historyPostColor;
    colorInput.style.cssText = 'width: 40px; height: 30px; border: 1px solid #ddd; border-radius: 4px;';
    colorGroup.appendChild(colorInput);

    // 根据当前选择显示/隐藏颜色选择器
    const updateColorVisibility = () => {
      colorGroup.style.display = historyPostSelect.value === 'blue' ? 'flex' : 'none';
    };
    updateColorVisibility();
    historyPostSelect.addEventListener('change', updateColorVisibility);

    historyPostGroup.appendChild(colorGroup);
    filterGroup.appendChild(historyPostGroup);

    // 帖子详情标题处理
    const threadTitleGroup = document.createElement('div');
    threadTitleGroup.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column;';
    const threadTitleLabel = document.createElement('label');
    threadTitleLabel.textContent = '标题正则替换（详情页+列表页）:';
    threadTitleLabel.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    threadTitleGroup.appendChild(threadTitleLabel);

    const threadTitleCheckbox = document.createElement('input');
    threadTitleCheckbox.type = 'checkbox';
    threadTitleCheckbox.checked = CFG.enableThreadTitleEnhance;
    threadTitleCheckbox.style.marginRight = '8px';
    const threadTitleCheckboxGroup = document.createElement('div');
    threadTitleCheckboxGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    threadTitleCheckboxGroup.appendChild(threadTitleCheckbox);
    threadTitleCheckboxGroup.appendChild(document.createTextNode('启用标题正则替换'));
    threadTitleGroup.appendChild(threadTitleCheckboxGroup);

    // 类型标签隐藏选项
    const hideTypeCheckbox = document.createElement('input');
    hideTypeCheckbox.type = 'checkbox';
    hideTypeCheckbox.checked = CFG.hideTypeLabels && CFG.hideTypeLabels.length > 0;
    hideTypeCheckbox.style.marginRight = '8px';
    const hideTypeCheckboxGroup = document.createElement('div');
    hideTypeCheckboxGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    hideTypeCheckboxGroup.appendChild(hideTypeCheckbox);
    hideTypeCheckboxGroup.appendChild(document.createTextNode('隐藏类型标签（如：情色分享、图文故事等）'));
    threadTitleGroup.appendChild(hideTypeCheckboxGroup);

    // 替换规则输入区域
    const rulesLabel = document.createElement('label');
    rulesLabel.textContent = '替换规则（每行一个，格式：pattern|replacement）:';
    rulesLabel.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    threadTitleGroup.appendChild(rulesLabel);

    const rulesTextarea = document.createElement('textarea');
    rulesTextarea.value = CFG.titleReplaceRules.map(rule => `${rule.pattern}|${rule.replacement}`).join('\n');
    rulesTextarea.placeholder = '例如：\n\\[\\d+\\.\\d+G/\\d+V/\\d+配额\\]|\n\\[.*?\\]|\\[\\1\\]';
    rulesTextarea.style.cssText = 'width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; resize: vertical; font-family: monospace;';
    threadTitleGroup.appendChild(rulesTextarea);

    filterGroup.appendChild(threadTitleGroup);

    // 论坛模块屏蔽
    const moduleFilterGroup = document.createElement('div');
    moduleFilterGroup.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column;';
    const moduleFilterLabel = document.createElement('label');
    moduleFilterLabel.textContent = '论坛模块屏蔽:';
    moduleFilterLabel.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    moduleFilterGroup.appendChild(moduleFilterLabel);

    const moduleFilterCheckbox = document.createElement('input');
    moduleFilterCheckbox.type = 'checkbox';
    moduleFilterCheckbox.checked = CFG.enableModuleFilter;
    moduleFilterCheckbox.style.marginRight = '8px';
    const moduleFilterCheckboxGroup = document.createElement('div');
    moduleFilterCheckboxGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    moduleFilterCheckboxGroup.appendChild(moduleFilterCheckbox);
    moduleFilterCheckboxGroup.appendChild(document.createTextNode('启用论坛模块屏蔽'));
    moduleFilterGroup.appendChild(moduleFilterCheckboxGroup);

    // 模块选择区域
    const moduleSelectGroup = document.createElement('div');
    moduleSelectGroup.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column;';
    const moduleSelectLabel = document.createElement('label');
    moduleSelectLabel.textContent = '选择要屏蔽的模块（每行一个）:';
    moduleSelectLabel.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    moduleSelectGroup.appendChild(moduleSelectLabel);

    const moduleTextarea = document.createElement('textarea');
    moduleTextarea.value = CFG.hiddenModules.join('\n');
    moduleTextarea.placeholder = '例如：\n色花文学（大模块）\n投稿送邀请码（小模块）\n综合讨论区（大模块）\nAI专区（小模块）\n国产原创（小模块）\n原创自拍区（小模块）';
    moduleTextarea.style.cssText = 'width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; resize: vertical;';
    moduleSelectGroup.appendChild(moduleTextarea);

    moduleFilterGroup.appendChild(moduleSelectGroup);
    filterGroup.appendChild(moduleFilterGroup);

    // 配置导入导出功能
    const configGroup = createSettingGroup('配置管理', '导出和导入脚本配置');

    const configButtonsGroup = document.createElement('div');
    configButtonsGroup.style.cssText = 'margin: 8px 0; display: flex; gap: 10px; flex-wrap: wrap;';

    const exportConfigBtn = document.createElement('button');
    exportConfigBtn.textContent = '📤 导出配置';
    exportConfigBtn.style.cssText = `
    padding: 8px 16px;
    background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
    color: white;
    border: 1px solid #1e7e34;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `;
    exportConfigBtn.addEventListener('mouseenter', () => {
      exportConfigBtn.style.background = 'linear-gradient(135deg, #1e7e34 0%, #155724 100%)';
      exportConfigBtn.style.transform = 'translateY(-1px)';
      exportConfigBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
    });
    exportConfigBtn.addEventListener('mouseleave', () => {
      exportConfigBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)';
      exportConfigBtn.style.transform = 'translateY(0)';
      exportConfigBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    });
    exportConfigBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      exportConfig();
    });

    const importConfigBtn = document.createElement('button');
    importConfigBtn.textContent = '📥 导入配置';
    importConfigBtn.style.cssText = `
    padding: 8px 16px;
    background: linear-gradient(135deg, #007cba 0%, #005a87 100%);
    color: white;
    border: 1px solid #005a87;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `;
    importConfigBtn.addEventListener('mouseenter', () => {
      importConfigBtn.style.background = 'linear-gradient(135deg, #005a87 0%, #004066 100%)';
      importConfigBtn.style.transform = 'translateY(-1px)';
      importConfigBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
    });
    importConfigBtn.addEventListener('mouseleave', () => {
      importConfigBtn.style.background = 'linear-gradient(135deg, #007cba 0%, #005a87 100%)';
      importConfigBtn.style.transform = 'translateY(0)';
      importConfigBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    });
    importConfigBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      importConfig();
    });

    const resetConfigBtn = document.createElement('button');
    resetConfigBtn.textContent = '🔄 重置配置';
    resetConfigBtn.style.cssText = `
    padding: 8px 16px;
    background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
    color: #212529;
    border: 1px solid #e0a800;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `;
    resetConfigBtn.addEventListener('mouseenter', () => {
      resetConfigBtn.style.background = 'linear-gradient(135deg, #e0a800 0%, #d39e00 100%)';
      resetConfigBtn.style.transform = 'translateY(-1px)';
      resetConfigBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
    });
    resetConfigBtn.addEventListener('mouseleave', () => {
      resetConfigBtn.style.background = 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)';
      resetConfigBtn.style.transform = 'translateY(0)';
      resetConfigBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    });
    resetConfigBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetConfig();
    });

    configButtonsGroup.appendChild(exportConfigBtn);
    configButtonsGroup.appendChild(importConfigBtn);
    configButtonsGroup.appendChild(resetConfigBtn);
    configGroup.appendChild(configButtonsGroup);

    // 将 filterGroup 和 configGroup 添加到高级设置标签页
    advancedForm.appendChild(filterGroup);
    advancedForm.appendChild(configGroup);
    advancedTab.appendChild(advancedForm);

    // ===== 115 离线下载配置 =====
    const pan115Form = document.createElement('form');
    pan115Form.style.cssText = 'display: grid; gap: 15px;';

    const pan115Group = document.createElement('div');
    pan115Group.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column;';
    const pan115Label = document.createElement('label');
    pan115Label.textContent = '115 离线下载:';
    pan115Label.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    pan115Group.appendChild(pan115Label);

    const pan115EnabledGroup = document.createElement('div');
    pan115EnabledGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    const pan115EnabledCheckbox = document.createElement('input');
    pan115EnabledCheckbox.type = 'checkbox';
    pan115EnabledCheckbox.checked = CFG.pan115Enabled;
    pan115EnabledCheckbox.style.marginRight = '8px';
    pan115EnabledGroup.appendChild(pan115EnabledCheckbox);
    pan115EnabledGroup.appendChild(document.createTextNode('启用 115 离线下载功能'));
    pan115Group.appendChild(pan115EnabledGroup);

    const pan115CookieGroup = createSettingGroup('Cookie', '115 网盘完整 Cookie（USERSESSIONID、UID、CID 等参数），通过浏览器开发者工具复制。');
    const pan115CookieInput = document.createElement('textarea');
    pan115CookieInput.value = CFG.pan115Cookie;
    pan115CookieInput.rows = 4;
    pan115CookieInput.placeholder = 'USERSESSIONID=...; UID=...; CID=...; SEID=...';
    pan115CookieInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;';
    pan115CookieGroup.appendChild(pan115CookieInput);
    pan115Group.appendChild(pan115CookieGroup);

    const pan115UserAgentGroup = createSettingGroup('User-Agent (可选)', '默认使用当前浏览器 UA，如需仿真 115 浏览器可在此自定义。');
    const pan115UserAgentInput = document.createElement('input');
    pan115UserAgentInput.type = 'text';
    pan115UserAgentInput.value = CFG.pan115UserAgent || '';
    pan115UserAgentInput.placeholder = navigator.userAgent;
    pan115UserAgentInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;';
    pan115UserAgentGroup.appendChild(pan115UserAgentInput);
    pan115Group.appendChild(pan115UserAgentGroup);

    const pan115UploadDirGroup = createSettingGroup('保存目录 ID (可选)', '填写 115 网盘目标目录 ID (wp_path_id)。留空则使用默认离线目录。');
    const pan115UploadDirInput = document.createElement('input');
    pan115UploadDirInput.type = 'text';
    pan115UploadDirInput.value = CFG.pan115UploadDir || '';
    pan115UploadDirInput.placeholder = '例如：3139826240074917796';
    pan115UploadDirInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
    pan115UploadDirGroup.appendChild(pan115UploadDirInput);
    pan115Group.appendChild(pan115UploadDirGroup);

    const pan115Hint = document.createElement('div');
    pan115Hint.style.cssText = 'font-size: 12px; color: #888; line-height: 1.5;';
    pan115Hint.innerHTML = '• 115 支持 ED2K、磁力链接离线下载<br>• 提交任务前脚本会自动获取 sign/time/uid<br>• 请确保 Cookie 信息最新，必要时在 115 官方网站重新复制';
    pan115Group.appendChild(pan115Hint);

    const pan115FolderGroup = createSettingGroup('文件夹管理', '为 115 离线创建或管理专用文件夹');
    const pan115FolderInfo = document.createElement('div');
    pan115FolderInfo.id = 'sht-pan115-folder-info';
    pan115FolderInfo.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 10px; line-height: 1.5;';
    pan115FolderGroup.appendChild(pan115FolderInfo);

    const pan115FolderButtons = document.createElement('div');
    pan115FolderButtons.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap;';

    const pan115CreateFolderBtn = document.createElement('button');
    pan115CreateFolderBtn.type = 'button';
    pan115CreateFolderBtn.textContent = '📁 新建 115 文件夹';
    pan115CreateFolderBtn.style.cssText = `
    padding: 8px 16px;
    background: linear-gradient(135deg, #f6c343 0%, #f49f0a 100%);
    color: #3b2f09;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 4px;
  `;
    pan115CreateFolderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showCreate115FolderDialog();
    });

    pan115FolderButtons.appendChild(pan115CreateFolderBtn);
    pan115FolderGroup.appendChild(pan115FolderButtons);
    pan115Group.appendChild(pan115FolderGroup);

    pan115Form.appendChild(pan115Group);
    pan115Tab.appendChild(pan115Form);
    refreshPan115FolderInfo();

    // ===== 123Pan 离线下载配置 =====
    const pan123Group = document.createElement('div');
    pan123Group.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column;';
    const pan123Label = document.createElement('label');
    pan123Label.textContent = '123Pan 离线下载:';
    pan123Label.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    pan123Group.appendChild(pan123Label);

    // 启用 123Pan
    const pan123EnabledCheckbox = document.createElement('input');
    pan123EnabledCheckbox.type = 'checkbox';
    pan123EnabledCheckbox.checked = CFG.pan123Enabled;
    pan123EnabledCheckbox.style.marginRight = '8px';
    const pan123EnabledGroup = document.createElement('div');
    pan123EnabledGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    pan123EnabledGroup.appendChild(pan123EnabledCheckbox);
    pan123EnabledGroup.appendChild(document.createTextNode('启用 123Pan 离线下载功能'));
    pan123Group.appendChild(pan123EnabledGroup);

    // Token 配置
    const pan123TokenGroup = createSettingGroup('Token', '123Pan API Token (Bearer 开头)');
    const pan123TokenInput = document.createElement('input');
    pan123TokenInput.type = 'text';
    pan123TokenInput.value = CFG.pan123Token;
    pan123TokenInput.placeholder = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
    pan123TokenInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;';
    pan123TokenGroup.appendChild(pan123TokenInput);
    pan123Group.appendChild(pan123TokenGroup);

    // Login UUID 配置
    const pan123LoginUuidGroup = createSettingGroup('Login UUID', '123Pan 登录 UUID');
    const pan123LoginUuidInput = document.createElement('input');
    pan123LoginUuidInput.type = 'text';
    pan123LoginUuidInput.value = CFG.pan123LoginUuid;
    pan123LoginUuidInput.placeholder = '7ab2526ea059412c87f7ff866ff5c2ac...';
    pan123LoginUuidInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;';
    pan123LoginUuidGroup.appendChild(pan123LoginUuidInput);
    pan123Group.appendChild(pan123LoginUuidGroup);

    // Cookie 配置
    const pan123CookieGroup = createSettingGroup('Cookie', '123Pan Cookie');
    const pan123CookieInput = document.createElement('textarea');
    pan123CookieInput.value = CFG.pan123Cookie;
    pan123CookieInput.rows = 3;
    pan123CookieInput.placeholder = 'cna=xxx; HMACCOUNT=xxx; ...';
    pan123CookieInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;';
    pan123CookieGroup.appendChild(pan123CookieInput);
    pan123Group.appendChild(pan123CookieGroup);

    // 上传目录配置
    const pan123UploadDirGroup = createSettingGroup('上传目录 ID', '123Pan 上传目录 ID (可选)');
    const pan123UploadDirInput = document.createElement('input');
    pan123UploadDirInput.type = 'text';
    pan123UploadDirInput.value = CFG.pan123UploadDir;
    pan123UploadDirInput.placeholder = '123456';
    pan123UploadDirInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
    pan123UploadDirGroup.appendChild(pan123UploadDirInput);
    pan123Group.appendChild(pan123UploadDirGroup);

    // 文件过滤配置
    const pan123FilterGroup = document.createElement('div');
    pan123FilterGroup.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column;';
    const pan123FilterLabel = document.createElement('label');
    pan123FilterLabel.textContent = '文件过滤配置:';
    pan123FilterLabel.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    pan123FilterGroup.appendChild(pan123FilterLabel);

    // 最小文件大小
    const pan123MinSizeGroup = createSettingGroup('最小文件大小', '例如: 10MB');
    const pan123MinSizeInput = document.createElement('input');
    pan123MinSizeInput.type = 'text';
    pan123MinSizeInput.value = CFG.pan123MinSize;
    pan123MinSizeInput.placeholder = '10MB';
    pan123MinSizeInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
    pan123MinSizeGroup.appendChild(pan123MinSizeInput);
    pan123FilterGroup.appendChild(pan123MinSizeGroup);

    // 最大文件大小
    const pan123MaxSizeGroup = createSettingGroup('最大文件大小', '例如: 1000GB');
    const pan123MaxSizeInput = document.createElement('input');
    pan123MaxSizeInput.type = 'text';
    pan123MaxSizeInput.value = CFG.pan123MaxSize;
    pan123MaxSizeInput.placeholder = '1000GB';
    pan123MaxSizeInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
    pan123MaxSizeGroup.appendChild(pan123MaxSizeInput);
    pan123FilterGroup.appendChild(pan123MaxSizeGroup);

    // 包含扩展名
    const pan123IncludeExtGroup = createSettingGroup('包含扩展名', '逗号分隔，例如: mp4,avi,mkv');
    const pan123IncludeExtInput = document.createElement('input');
    pan123IncludeExtInput.type = 'text';
    pan123IncludeExtInput.value = CFG.pan123IncludeExt;
    pan123IncludeExtInput.placeholder = 'mp4,avi,mkv,wmv,flv,mov';
    pan123IncludeExtInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
    pan123IncludeExtGroup.appendChild(pan123IncludeExtInput);
    pan123FilterGroup.appendChild(pan123IncludeExtGroup);

    // 排除扩展名
    const pan123ExcludeExtGroup = createSettingGroup('排除扩展名', '逗号分隔，例如: txt,nfo,jpg,png');
    const pan123ExcludeExtInput = document.createElement('input');
    pan123ExcludeExtInput.type = 'text';
    pan123ExcludeExtInput.value = CFG.pan123ExcludeExt;
    pan123ExcludeExtInput.placeholder = 'txt,nfo,srt,sub,url,mht,jpg,jpeg,png,gif,bmp,webp,ico,svg';
    pan123ExcludeExtInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
    pan123ExcludeExtGroup.appendChild(pan123ExcludeExtInput);
    pan123FilterGroup.appendChild(pan123ExcludeExtGroup);

    // 视频文件最小大小
    const pan123VideoMinSizeGroup = createSettingGroup('视频文件最小大小', '例如: 100MB');
    const pan123VideoMinSizeInput = document.createElement('input');
    pan123VideoMinSizeInput.type = 'text';
    pan123VideoMinSizeInput.value = CFG.pan123VideoMinSize;
    pan123VideoMinSizeInput.placeholder = '100MB';
    pan123VideoMinSizeInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
    pan123VideoMinSizeGroup.appendChild(pan123VideoMinSizeInput);
    pan123FilterGroup.appendChild(pan123VideoMinSizeGroup);

    // 选择最大文件
    const pan123PickLargestCheckbox = document.createElement('input');
    pan123PickLargestCheckbox.type = 'checkbox';
    pan123PickLargestCheckbox.checked = CFG.pan123PickLargest;
    pan123PickLargestCheckbox.style.marginRight = '8px';
    const pan123PickLargestGroup = document.createElement('div');
    pan123PickLargestGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    pan123PickLargestGroup.appendChild(pan123PickLargestCheckbox);
    pan123PickLargestGroup.appendChild(document.createTextNode('只选择最大的文件'));
    pan123FilterGroup.appendChild(pan123PickLargestGroup);

    pan123Group.appendChild(pan123FilterGroup);

    // 秒离线处理配置
    const pan123InstantGroup = document.createElement('div');
    pan123InstantGroup.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column;';
    const pan123InstantLabel = document.createElement('label');
    pan123InstantLabel.textContent = '秒离线处理:';
    pan123InstantLabel.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    pan123InstantGroup.appendChild(pan123InstantLabel);

    // 秒离线处理方式选择
    const pan123InstantActionGroup = document.createElement('div');
    pan123InstantActionGroup.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column; gap: 8px;';

    const pan123InstantActionLabel = document.createElement('label');
    pan123InstantActionLabel.textContent = '秒离线失败时的处理方式:';
    pan123InstantActionLabel.style.cssText = 'font-size: 12px; color: #333;';
    pan123InstantActionGroup.appendChild(pan123InstantActionLabel);

    const pan123InstantActionSelect = document.createElement('select');
    pan123InstantActionSelect.style.cssText = 'padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;';
    pan123InstantActionSelect.innerHTML = `
    <option value="auto_cancel">自动取消任务</option>
    <option value="ask_user">询问用户是否取消</option>
    <option value="keep_task">保留任务</option>
  `;
    pan123InstantActionSelect.value = CFG.pan123InstantOfflineAction || 'auto_cancel';
    pan123InstantActionGroup.appendChild(pan123InstantActionSelect);

    // 检查延迟时间
    const pan123DelayGroup = document.createElement('div');
    pan123DelayGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center; gap: 8px;';

    const pan123DelayLabel = document.createElement('label');
    pan123DelayLabel.textContent = '检查延迟时间(毫秒):';
    pan123DelayLabel.style.cssText = 'font-size: 12px; color: #333; min-width: 120px;';
    pan123DelayGroup.appendChild(pan123DelayLabel);

    const pan123DelayInput = document.createElement('input');
    pan123DelayInput.type = 'number';
    pan123DelayInput.value = CFG.pan123InstantOfflineCheckDelay || 2000;
    pan123DelayInput.min = '1000';
    pan123DelayInput.max = '10000';
    pan123DelayInput.step = '500';
    pan123DelayInput.style.cssText = 'padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; width: 100px;';
    pan123DelayGroup.appendChild(pan123DelayInput);

    // 批量发送间隔时间
    const pan123BatchIntervalGroup = document.createElement('div');
    pan123BatchIntervalGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center; gap: 8px;';

    const pan123BatchIntervalLabel = document.createElement('label');
    pan123BatchIntervalLabel.textContent = '批量发送间隔(毫秒):';
    pan123BatchIntervalLabel.style.cssText = 'font-size: 12px; color: #333; min-width: 120px;';
    pan123BatchIntervalGroup.appendChild(pan123BatchIntervalLabel);

    const pan123BatchIntervalInput = document.createElement('input');
    pan123BatchIntervalInput.type = 'number';
    pan123BatchIntervalInput.value = CFG.pan123BatchSendInterval || 2000;
    pan123BatchIntervalInput.min = '100';
    pan123BatchIntervalInput.max = '60000';
    pan123BatchIntervalInput.step = '100';
    pan123BatchIntervalInput.style.cssText = 'padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; width: 100px;';
    pan123BatchIntervalGroup.appendChild(pan123BatchIntervalInput);

    pan123InstantGroup.appendChild(pan123InstantActionGroup);
    pan123InstantGroup.appendChild(pan123DelayGroup);
    pan123InstantGroup.appendChild(pan123BatchIntervalGroup);
    pan123Group.appendChild(pan123InstantGroup);

    // 123Pan文件夹管理
    const folderGroup = createSettingGroup('文件夹管理', '123Pan文件夹操作');
    const pan123FolderInfo = document.createElement('div');
    pan123FolderInfo.id = 'sht-pan123-folder-info';
    pan123FolderInfo.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 10px; line-height: 1.5;';
    folderGroup.appendChild(pan123FolderInfo);
    const folderButtonsGroup = document.createElement('div');
    folderButtonsGroup.style.cssText = 'margin: 8px 0; display: flex; gap: 10px; flex-wrap: wrap;';

    const createFolderBtn = document.createElement('button');
    createFolderBtn.textContent = '📁 123 新建';
    createFolderBtn.style.cssText = `
    padding: 8px 16px;
    background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 4px;
  `;
    createFolderBtn.addEventListener('mouseenter', () => {
      createFolderBtn.style.background = 'linear-gradient(135deg, #1e7e34 0%, #155724 100%)';
      createFolderBtn.style.transform = 'translateY(-1px)';
      createFolderBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
    });
    createFolderBtn.addEventListener('mouseleave', () => {
      createFolderBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)';
      createFolderBtn.style.transform = 'translateY(0)';
      createFolderBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    });
    createFolderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showCreateFolderDialog();
    });

    folderButtonsGroup.appendChild(createFolderBtn);
    folderGroup.appendChild(folderButtonsGroup);

    // 将 123Pan 设置添加到 123Pan 标签页
    const pan123Form = document.createElement('form');
    pan123Form.style.cssText = 'display: grid; gap: 15px;';
    pan123Form.appendChild(pan123Group);
    pan123Form.appendChild(folderGroup);
    pan123Tab.appendChild(pan123Form);
    refreshPan123FolderInfo();

    // ===== AI 助手设置 =====
    const aiForm = document.createElement('form');
    aiForm.style.cssText = 'display: grid; gap: 15px;';

    const aiGroup = document.createElement('div');
    aiGroup.style.cssText = 'margin: 8px 0; display: flex; flex-direction: column;';
    const aiLabel = document.createElement('label');
    aiLabel.textContent = 'AI 助手设置:';
    aiLabel.style.cssText = 'margin-bottom: 4px; font-size: 12px; color: #666;';
    aiGroup.appendChild(aiLabel);

    // 启用 AI
    const aiEnabledGroup = document.createElement('div');
    aiEnabledGroup.style.cssText = 'margin: 8px 0; display: flex; align-items: center;';
    const aiEnabledCheckbox = document.createElement('input');
    aiEnabledCheckbox.type = 'checkbox';
    aiEnabledCheckbox.checked = CFG.aiEnabled;
    aiEnabledCheckbox.style.marginRight = '8px';
    aiEnabledGroup.appendChild(aiEnabledCheckbox);
    aiEnabledGroup.appendChild(document.createTextNode('启用 AI 回复助手'));
    aiGroup.appendChild(aiEnabledGroup);

    // API URL
    const aiUrlGroup = createSettingGroup('API URL', 'OpenAI 兼容接口地址 (例如 https://api.openai.com/v1)');
    const aiUrlInput = document.createElement('input');
    aiUrlInput.type = 'text';
    aiUrlInput.value = CFG.aiApiUrl;
    aiUrlInput.placeholder = 'https://api.openai.com/v1';
    aiUrlInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;';
    aiUrlGroup.appendChild(aiUrlInput);
    aiGroup.appendChild(aiUrlGroup);

    // API Key
    const aiKeyGroup = createSettingGroup('API Key', '您的 API Key (sk-...)');
    const aiKeyInput = document.createElement('input');
    aiKeyInput.type = 'password';
    aiKeyInput.value = CFG.aiApiKey;
    aiKeyInput.placeholder = 'sk-...';
    aiKeyInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;';
    aiKeyGroup.appendChild(aiKeyInput);
    aiGroup.appendChild(aiKeyGroup);

    // Model
    const aiModelGroup = createSettingGroup('模型名称', '使用的模型 (例如 gpt-3.5-turbo)');
    const aiModelInput = document.createElement('input');
    aiModelInput.type = 'text';
    aiModelInput.value = CFG.aiModel;
    aiModelInput.placeholder = 'gpt-3.5-turbo';
    aiModelInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;';
    aiModelGroup.appendChild(aiModelInput);
    aiGroup.appendChild(aiModelGroup);

    // Prompt
    const aiPromptGroup = createSettingGroup('系统提示词', 'AI 的人设和指令');
    const aiPromptInput = document.createElement('textarea');
    aiPromptInput.value = CFG.aiPrompt;
    aiPromptInput.rows = 4;
    aiPromptInput.placeholder = '你是一个...';
    aiPromptInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
    aiPromptGroup.appendChild(aiPromptInput);
    aiGroup.appendChild(aiPromptGroup);

    aiForm.appendChild(aiGroup);
    aiTab.appendChild(aiForm);

    // 将所有标签页添加到内容区域
    contentArea.appendChild(basicTab);
    contentArea.appendChild(displayTab);
    contentArea.appendChild(collectionTab);
    contentArea.appendChild(pan115Tab);
    contentArea.appendChild(pan123Tab);
    contentArea.appendChild(aiTab);
    contentArea.appendChild(advancedTab);

    // 按钮区域
    const buttonArea = document.createElement('div');
    buttonArea.style.cssText = 'padding: 15px 20px; border-top: 1px solid #eee; background: #f8f9fa;';

    const buttonGroup = document.createElement('div');
    buttonGroup.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.type = 'button';
    cancelBtn.style.cssText = 'padding: 8px 16px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;';
    cancelBtn.onclick = () => dialog.remove();

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存设置';
    saveBtn.type = 'button';
    saveBtn.style.cssText = 'padding: 8px 16px; border: none; background: #007cba; color: white; border-radius: 4px; cursor: pointer;';
    saveBtn.onclick = () => {
      // 保存设置
      CFG.passwordCandidates = pwdInput.value.split('\n').map(s => s.trim()).filter(Boolean);
      CFG.maxAutoBytes = parseInt(autoInput.value) || 2 * 1024 * 1024;
      CFG.maxEntryBytes = parseInt(entryInput.value) || 3 * 1024 * 1024;
      CFG.autoHoistToTop = hoistCheckbox.checked;
      CFG.domainAutoRedirect = domainRedirectCheckbox.checked;
      CFG.primaryDomain = primaryDomainSelect.value;
      CFG.blockImages = imgCheckbox.checked;
      CFG.imageAllowDomains = whiteInput.value.split(',').map(s => s.trim()).filter(Boolean);
      CFG.imagePlaceholderShowMeta = metaCheckbox.checked;
      CFG.autoCollectED2K = ed2kCheckbox.checked;
      CFG.autoCollectMagnet = magnetCheckbox.checked;

      // ED2K文件名替换设置
      CFG.ed2kFileNameReplaceEnabled = ed2kReplaceCheckbox.checked;

      // 收集替换规则
      const ed2kRules = [];
      const ruleDivs = rulesList.querySelectorAll('div');
      ruleDivs.forEach(ruleDiv => {
        const inputs = ruleDiv.querySelectorAll('input');
        if (inputs.length >= 2) {
          const pattern = inputs[0].value.trim();
          const replacement = inputs[1].value.trim();
          if (pattern) {
            ed2kRules.push({ pattern, replacement });
          }
        }
      });
      CFG.ed2kFileNameReplaceRules = ed2kRules;
      CFG.authorOnlyMode = authorOnlyCheckbox.checked;
      CFG.enableHistory = historyCheckbox.checked;
      CFG.maxHistoryItems = parseInt(historyLimitInput.value) || 1000;

      // 排版优化设置
      CFG.hideReplyColumn = hideReplyCheckbox.checked;
      CFG.hideLastReplyColumn = hideLastReplyCheckbox.checked;
      CFG.hideAuthorColumn = hideAuthorCheckbox.checked;
      CFG.hideStickyThreads = hideStickyCheckbox.checked;

      // 分页和过滤设置
      CFG.hidePagination = hidePaginationCheckbox.checked;
      CFG.enhanceTitles = enhanceTitlesCheckbox.checked;
      CFG.enableKeywordFilter = keywordFilterCheckbox.checked;
      CFG.keywordFilters = keywordTextarea.value.split('\n').filter(line => line.trim() !== '');

      // 列表页标题正则替换设置
      CFG.enableListTitleEnhance = listTitleCheckbox.checked;
      const listRulesText = listRulesTextarea.value.split('\n').filter(line => line.trim() !== '');
      CFG.listTitleReplaceRules = listRulesText.map(line => {
        const parts = line.split('|');
        return {
          pattern: parts[0] || '',
          replacement: parts[1] || ''
        };
      });

      // 历史访问帖子处理设置
      CFG.historyPostAction = historyPostSelect.value;
      CFG.historyPostColor = colorInput.value;

      // 帖子详情标题处理设置
      CFG.enableThreadTitleEnhance = threadTitleCheckbox.checked;
      const rulesText = rulesTextarea.value.split('\n').filter(line => line.trim() !== '');
      CFG.titleReplaceRules = rulesText.map(line => {
        const parts = line.split('|');
        return {
          pattern: parts[0] || '',
          replacement: parts[1] || ''
        };
      });
      CFG.hideTypeLabels = hideTypeCheckbox.checked ? ['情色分享', '图文故事', '视频分享'] : [];

      // 论坛模块屏蔽
      CFG.enableModuleFilter = moduleFilterCheckbox.checked;
      CFG.hiddenModules = moduleTextarea.value.split('\n').filter(s => s.trim());

      // 一键评分设置
      CFG.enableQuickRate = quickRateCheckbox.checked;
      CFG.defaultRateScore = parseInt(rateScoreInput.value) || 2;
      CFG.defaultRateReason = reasonInput.value.trim() || '很给力!';

      // 115 离线设置
      CFG.pan115Enabled = pan115EnabledCheckbox.checked;
      CFG.pan115Cookie = pan115CookieInput.value.trim();
      CFG.pan115UserAgent = pan115UserAgentInput.value.trim();
      CFG.pan115UploadDir = pan115UploadDirInput.value.trim();

      // 123Pan 设置
      CFG.pan123Enabled = pan123EnabledCheckbox.checked;
      CFG.pan123Token = pan123TokenInput.value.trim();
      CFG.pan123LoginUuid = pan123LoginUuidInput.value.trim();
      CFG.pan123Cookie = pan123CookieInput.value.trim();
      CFG.pan123UploadDir = pan123UploadDirInput.value.trim();
      CFG.pan123MinSize = pan123MinSizeInput.value.trim();
      CFG.pan123MaxSize = pan123MaxSizeInput.value.trim();
      CFG.pan123IncludeExt = pan123IncludeExtInput.value.trim();
      CFG.pan123ExcludeExt = pan123ExcludeExtInput.value.trim();
      CFG.pan123VideoMinSize = pan123VideoMinSizeInput.value.trim();
      CFG.pan123PickLargest = pan123PickLargestCheckbox.checked;
      CFG.pan123InstantOfflineAction = pan123InstantActionSelect.value;
      CFG.pan123InstantOfflineCheckDelay = parseInt(pan123DelayInput.value) || 2000;
      CFG.pan123BatchSendInterval = parseInt(pan123BatchIntervalInput.value) || 2000;

      // AI 设置
      CFG.aiEnabled = aiEnabledCheckbox.checked;
      CFG.aiApiUrl = aiUrlInput.value.trim();
      CFG.aiApiKey = aiKeyInput.value.trim();
      CFG.aiModel = aiModelInput.value.trim();
      CFG.aiPrompt = aiPromptInput.value.trim();

      saveConfig();
      dialog.remove();

      // 应用设置
      if (CFG.blockImages) applyImageBlocking(true, { forceRebuild: true }); else resetImageState();
      queueED2KScan(true); queueMagnetScan(true);

      // 应用排版设置
      applyLayoutSettings();

      // 应用论坛模块屏蔽
      if (isForumListPage || isForumHomePage) {
        applyModuleFilter();
      }

      alert('设置已保存！页面将自动刷新以应用新设置。');

      // 延迟刷新页面，让用户看到提示
      setTimeout(() => {
        location.reload();
      }, 1000);
    };

    buttonGroup.appendChild(cancelBtn);
    buttonGroup.appendChild(saveBtn);
    buttonArea.appendChild(buttonGroup);

    // 组装对话框
    panel.appendChild(title);
    panel.appendChild(tabNav);
    panel.appendChild(contentArea);
    panel.appendChild(buttonArea);
    dialog.appendChild(panel);
    document.body.appendChild(dialog);

    // 点击背景关闭
    dialog.onclick = (e) => { if (e.target === dialog) dialog.remove(); };
  }

  function createSettingGroup(title, description) {
    const group = document.createElement('div');
    group.style.cssText = 'border: 1px solid #eee; border-radius: 6px; padding: 15px; background: #fafafa;';

    const titleEl = document.createElement('div');
    titleEl.textContent = title;
    titleEl.style.cssText = 'font-weight: bold; margin-bottom: 5px; color: #333;';

    const descEl = document.createElement('div');
    descEl.textContent = description;
    descEl.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 10px;';

    const inputContainer = document.createElement('div');

    group.appendChild(titleEl);
    group.appendChild(descEl);
    group.appendChild(inputContainer);

    // 返回输入容器，用于添加输入控件
    group.inputContainer = inputContainer;
    group.appendChild = (child) => inputContainer.appendChild(child);

    return group;
  }

  /*********************** 附件预览（同前） ***********************/
  const SELECTOR_ATTACH_ANCHOR = 'a[href*="forum.php?mod=attachment"][href*="aid="]';
  function enhanceAll() { document.querySelectorAll(SELECTOR_ATTACH_ANCHOR).forEach(a => { if (!a.dataset._shtEnhanced) { a.dataset._shtEnhanced = '1'; const name = (a.textContent || '').trim(); const span = a.closest('span[id^="attach_"]'); const sizeBytes = parseSizeBytesFromSpan(span); buildInlineUI(a, name, sizeBytes); } }); }
  function enhanceInNode(node) { node.querySelectorAll?.(SELECTOR_ATTACH_ANCHOR).forEach(a => { if (!a.dataset._shtEnhanced) { a.dataset._shtEnhanced = '1'; const name = (a.textContent || '').trim(); const span = a.closest('span[id^="attach_"]'); const sizeBytes = parseSizeBytesFromSpan(span); buildInlineUI(a, name, sizeBytes); } }); }

  function buildInlineUI(a, filename, bytes) {
    const wrap = document.createElement('div'); wrap.className = 'sht-inline'; wrap.style.cssText = 'margin:6px 0 12px 0';
    const bar = document.createElement('div'); bar.style.cssText = 'display:inline-flex;gap:6px;flex-wrap:wrap;align-items:center';
    const mkBtn = (t, fn) => { const b = document.createElement('button'); b.textContent = t; b.style.cssText = 'padding:2px 8px;cursor:pointer'; b.addEventListener('click', fn); return b; };

    const rawName = (filename || '').trim();
    const resolvedName = guessAttachmentName(a, rawName);
    const effectiveName = resolvedName || rawName || '附件';
    const info = document.createElement('span'); info.textContent = effectiveName + (bytes ? `  ·  ${formatBytes(bytes)}` : ''); info.style.cssText = 'font-size:12px;opacity:.75';

    const torrentPattern = /\.torrent(?:$|\?)/i;
    const imagePattern = /\.(?:jpg|jpeg|png|gif|webp|bmp|svg|ico)(?:$|\?)/i;
    const hrefVal = a?.href || '';
    const isTorrentFile = torrentPattern.test(resolvedName || '') || torrentPattern.test(rawName) || torrentPattern.test(hrefVal);
    const isImageFile = imagePattern.test(resolvedName || '') || imagePattern.test(rawName) || imagePattern.test(hrefVal);

    if (isTorrentFile) {
      const btnDownload = mkBtn('下载', () => {
        window.open(a.href, '_blank');
      });

      const btn123Pan = mkBtn('发送到123Pan', async () => {
        if (!CFG.pan123Enabled) {
          showWarningModal('请先在设置中启用 123Pan 功能并配置认证信息');
          return;
        }

        btn123Pan.textContent = '发送中...';
        btn123Pan.disabled = true;

        try {
          const torrentBlob = await downloadFileWithGM(a.href);
          const title = (resolvedName || rawName || '').replace(/\.torrent$/i, '') || effectiveName;
          await processTorrentOffline(torrentBlob, title);
        } catch (error) {
          console.error('发送到123Pan失败:', error);
          showErrorModal(`发送失败: ${error.message}`);
        } finally {
          btn123Pan.textContent = '发送到123Pan';
          btn123Pan.disabled = false;
        }
      });

      bar.append(btnDownload, btn123Pan, info);
      wrap.append(bar);
      a.parentElement.insertAdjacentElement('afterend', wrap);

      agg.addItem(effectiveName, a.href);
      return;
    }

    if (isImageFile) {
      const btnDownload = mkBtn('下载', () => {
        window.open(a.href, '_blank');
      });

      bar.append(btnDownload, info);
      wrap.append(bar);
      a.parentElement.insertAdjacentElement('afterend', wrap);
      return;
    }

    const btnFetch = mkBtn('加载预览', () => fetchAndShow()); const btnCopy = mkBtn('复制', () => copyCurrent()); btnCopy.disabled = true;
    const btnHoist = mkBtn('上顶聚合', () => { if (ta.value) agg.addItem(effectiveName, ta.value); }); const btnPw = mkBtn('设密码', () => openSettings());
    const ta = document.createElement('textarea'); ta.placeholder = '（附件内容将显示在这里）'; ta.rows = 8; ta.style.cssText = 'width:min(900px,100%);max-width:100%;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;line-height:1.5;padding:6px;box-sizing:border-box;border-radius:6px;border:1px solid #ddd'; ta.readOnly = true;
    bar.append(btnFetch, btnCopy, btnHoist, btnPw, info); wrap.append(bar, ta); a.parentElement.insertAdjacentElement('afterend', wrap);
    if (!isTorrentFile && !isImageFile && (!bytes || bytes <= CFG.maxAutoBytes)) fetchAndShow();

    function setLoading(loading, text = '加载中…') { btnFetch.disabled = loading; btnFetch.textContent = loading ? text : '重新加载'; }
    function copyCurrent() { GM_setClipboard(ta.value || ''); btnCopy.textContent = '已复制'; setTimeout(() => btnCopy.textContent = '复制', 1200); }
    async function fetchAndShow() {
      try {
        setLoading(true); ta.value = ''; btnCopy.disabled = true;
        const url = absoluteUrl(a.href); const buf = await httpGetArrayBuffer(url);
        const bin = new Uint8Array(buf);
        if (isImageBuffer(bin)) {
          ta.value = '（图片文件，跳过预览）';
          return;
        }
        if (isTextLike(effectiveName)) { const text = decodeBest(buf, effectiveName); showText(text, '(文本)'); }
        else if (isZip(effectiveName)) { const out = await tryExtractZipTexts(buf, CFG.passwordCandidates, CFG.maxEntryBytes); showArchiveTexts(out); }
        else if (isRar(effectiveName)) { const out = await tryExtractRarTexts(buf, CFG.passwordCandidates, CFG.maxEntryBytes); showArchiveTexts(out); }
        else {
          const text = decodeBest(buf, effectiveName);
          if (text && /[\u0009\u000A\u000D\u0020-\u007E\u00A0-\uFFFF]/.test(text.slice(0, 200))) showText(text, '(猜测文本)');
          else ta.value = '（不支持的附件类型，或内容非文本）';
        }
      } catch { ta.value = '（加载失败，可能需要登录或无权限）'; } finally { setLoading(false); }
    }
    function showText(text, note = '') {
      // 确保文本正确显示，处理可能的编码问题
      const cleanText = text ? text.replace(/\uFFFD/g, '') : '';
      ta.value = cleanText || '（空内容）';
      ta.readOnly = false;
      btnCopy.disabled = !cleanText;
      if (cleanText && CFG.autoHoistToTop) agg.addItem(`${effectiveName} ${note}`, cleanText);
    }
    function showArchiveTexts(list) {
      if (!list.length) { ta.value = '（压缩包内未找到可展示的文本，或密码错误）'; return; }
      const join = list.map(x => `【${x.name}${x.pwd ? ` · 密码:${x.pwd}` : ''} · ${formatBytes(x.size)}】\n${x.text}`).join('\n\n' + '-'.repeat(40) + '\n\n'); showText(join, '(解包)');
    }
  }

  function guessAttachmentName(anchor, fallback = '') {
    try {
      if (anchor?.download) {
        const dl = anchor.download.trim();
        if (dl) return dl;
      }
      if (anchor?.title) {
        const title = anchor.title.trim();
        if (title) return title;
      }
      let candidate = fallback || '';
      const href = anchor?.getAttribute?.('href') || anchor?.href || '';
      if (href) {
        const url = new URL(href, location.href);
        const params = ['filename', 'file', 'name', 'attname', 'downfilename'];
        for (const key of params) {
          const val = url.searchParams.get(key);
          if (val) {
            candidate = decodeURIComponent(val.replace(/\+/g, ' '));
            break;
          }
        }
        if (!candidate && url.pathname) {
          const match = url.pathname.match(/\/([^/]+)$/);
          if (match && match[1]) {
            candidate = decodeURIComponent(match[1]);
          }
        }
      }
      if (candidate) return candidate;
    } catch (err) {
      console.warn('guessAttachmentName error:', err);
    }
    return fallback || '';
  }

  function isImageBuffer(u8) {
    if (!(u8 instanceof Uint8Array)) return false;
    if (u8.length >= 2 && u8[0] === 0xff && u8[1] === 0xd8) return true; // JPEG
    if (u8.length >= 8 && u8[0] === 0x89 && u8[1] === 0x50 && u8[2] === 0x4e && u8[3] === 0x47) return true; // PNG
    if (u8.length >= 6 && u8[0] === 0x47 && u8[1] === 0x49 && u8[2] === 0x46 && u8[3] === 0x38) return true; // GIF
    if (u8.length >= 2 && u8[0] === 0x42 && u8[1] === 0x4d) return true; // BMP
    if (u8.length >= 12 && u8[0] === 0x52 && u8[1] === 0x49 && u8[2] === 0x46 && u8[3] === 0x46 && u8[8] === 0x57 && u8[9] === 0x45 && u8[10] === 0x42 && u8[11] === 0x50) return true; // WEBP
    if (u8.length >= 4 && u8[0] === 0x00 && u8[1] === 0x00 && (u8[2] === 0x01 || u8[2] === 0x02) && u8[3] === 0x00) return true; // ICO/CUR
    if (u8.length >= 4 && u8[0] === 0x49 && u8[1] === 0x49 && u8[2] === 0x2a && u8[3] === 0x00) return true; // TIFF (little-endian)
    if (u8.length >= 4 && u8[0] === 0x4d && u8[1] === 0x4d && u8[2] === 0x00 && u8[3] === 0x2a) return true; // TIFF (big-endian)
    return false;
  }

  /*********************** 图片屏蔽（候选集 + 解绑 + 防抖 + 强力隐藏兜底） ***********************/
  const style = document.createElement('style');
  style.textContent = `[id^="postmessage_"] img.sht-img-hidden{display:none!important}.sht-img-ph{display:inline-flex;align-items:center;gap:8px;padding:6px 8px;margin:4px 0;border:1px dashed #bbb;border-radius:6px;background:#fffef8}`;
  document.head.appendChild(style);

  let processedImg = new WeakSet();
  let placeholderMade = new WeakSet();
  let io = null;
  let pendingImgs = new Set();
  let pendingTimer = null;

  function resetImageState() {
    document.querySelectorAll('[id^="postmessage_"] img.sht-img-hidden').forEach(img => {
      img.classList.remove('sht-img-hidden');
      img.style.removeProperty('display');
      const ph = img.previousElementSibling;
      if (ph && ph.classList.contains('sht-img-ph')) ph.remove();
    });
    processedImg = new WeakSet();
    placeholderMade = new WeakSet();
    if (io) { io.disconnect(); io = null; }
    pendingImgs.clear(); if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
  }

  function shouldBypassByWhitelist(url) {
    if (!CFG.imageAllowDomains?.length) return false;
    const host = hostnameOf(url);
    return CFG.imageAllowDomains.some(d => host.endsWith(d));
  }
  function getImgSource(img) {
    const cand = [img.getAttribute('src'), img.getAttribute('file'), img.getAttribute('zoomfile'), img.dataset?.src, img.dataset?.original];
    return cand.find(x => x && !x.startsWith('data:')) || '';
  }
  function isSmallOrUIImg(img) {
    const cls = (img.className || '').toLowerCase();
    if (/(avatar|smilie|emoji|vm|icons?)/.test(cls)) return true;
    const w = img.naturalWidth || parseInt(img.getAttribute('width') || 0, 10);
    const h = img.naturalHeight || parseInt(img.getAttribute('height') || 0, 10);
    const m = Math.min(w || 0, h || 0);
    return m > 0 && m <= CFG.imageMinBlockSizePx;
  }
  function makePlaceholder(img, src) {
    const ph = document.createElement('div'); ph.className = 'sht-img-ph';
    if (CFG.imagePlaceholderShowMeta) {
      const meta = document.createElement('span'); meta.style.cssText = 'font-size:12px;opacity:.8';
      const host = hostnameOf(src); const name = (img.getAttribute('alt') || '').trim() || src.split('/').pop();
      meta.textContent = `图片已屏蔽 · ${host || '未知域'} · ${name}`; ph.append(meta);
    }
    const btn = document.createElement('button'); btn.textContent = '加载此图'; btn.style.cssText = 'padding:2px 8px;cursor:pointer';
    const link = document.createElement('a'); link.textContent = '新开'; link.href = src; link.target = '_blank'; link.rel = 'noreferrer noopener'; link.style.fontSize = '12px';
    btn.addEventListener('click', () => {
      img.classList.remove('sht-img-hidden');
      img.style.removeProperty('display');
      ph.remove();
      if (io) io.unobserve(img);
    });
    ph.append(btn, link);
    return ph;
  }
  function observeImg(img) {
    if (processedImg.has(img)) return;
    processedImg.add(img);

    const src = getImgSource(img);
    if (!src || shouldBypassByWhitelist(src) || isSmallOrUIImg(img)) return;

    img.classList.add('sht-img-hidden');
    img.style.setProperty('display', 'none', 'important');

    if (!io) {
      io = new IntersectionObserver(entries => {
        const vis = entries.filter(e => e.isIntersecting).map(e => e.target);
        if (!vis.length) return;
        for (let i = 0; i < vis.length; i += CFG.imageProcessBatch) {
          const slice = vis.slice(i, i + CFG.imageProcessBatch);
          (window.requestIdleCallback || window.setTimeout)(() => slice.forEach(buildPlaceholderAndUnobserve), 0);
        }
      }, { root: null, rootMargin: '200px 0px', threshold: 0.01 });
    }
    io.observe(img);
  }
  function buildPlaceholderAndUnobserve(img) {
    if (placeholderMade.has(img)) { if (io) io.unobserve(img); return; }
    placeholderMade.add(img);
    const src = getImgSource(img); if (!src) { if (io) io.unobserve(img); return; }
    const ph = makePlaceholder(img, src);
    img.insertAdjacentElement('beforebegin', ph);
    if (io) io.unobserve(img);
  }

  function applyImageBlocking(shouldBlock, { forceRebuild = false, candidates = null } = {}) {
    if (!shouldBlock) { resetImageState(); return; }
    if (forceRebuild) { resetImageState(); }
    const imgs = candidates && candidates.size ? Array.from(candidates) : Array.from(document.querySelectorAll('[id^="postmessage_"] img'));
    if (!imgs.length) return;
    imgs.forEach(img => pendingImgs.add(img));
    if (pendingTimer) return;
    pendingTimer = setTimeout(() => {
      const batch = Array.from(pendingImgs); pendingImgs.clear(); pendingTimer = null;
      const limit = CFG.imageProcessBatch * 4;
      batch.slice(0, limit).forEach(observeImg);
    }, CFG.mutationDebounceMs);
  }

  /*********************** ED2K & 磁力 聚合 ***********************/
  // ED2K：文件名可含空格/中文，结尾以 /；可带 |h=...|p=...|
  const ED2K_REGEX = /ed2k:\/\/\|file\|.+?\|\d+\|[A-F0-9]{32}(?:\|[^|\r\n<>]*)*?\/(?=$|\s)/gi;
  // MAGNET：捕获直到空白/行尾/标签边界；支持任意参数
  const MAGNET_REGEX = /magnet:\?[^\s<>"']+/gi;

  // 去除链接尾部常见分隔符
  const trimTail = s => s.replace(/[，。；、\s)]+$/, '').replace(/&amp;/g, '&');

  function extractED2K(text) {
    if (!text) return [];
    const out = []; let m;
    while ((m = ED2K_REGEX.exec(text)) !== null) {
      let ed2kLink = trimTail(m[0]);

      // 应用文件名替换
      if (CFG.ed2kFileNameReplaceEnabled) {
        ed2kLink = processEd2kLink(ed2kLink);
      }

      out.push(ed2kLink);
    }
    return out;
  }
  function extractMagnet(text) {
    if (!text) return [];
    const out = []; let m;
    while ((m = MAGNET_REGEX.exec(text)) !== null) out.push(trimTail(m[0]));
    return out;
  }

  let ed2kTimer = null, magnetTimer = null;

  function collectLinksFromNode(node) {
    const ed2k = [], magnets = [];
    // 1) blockcode li
    node.querySelectorAll('.blockcode ol li').forEach(li => {
      const t = li.textContent || '';
      extractED2K(t).forEach(u => ed2k.push(u));
      extractMagnet(t).forEach(u => magnets.push(u));
    });
    // 2) 其他正文文本节点
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    let n; while (n = walker.nextNode()) {
      const txt = n.nodeValue || '';
      if (txt.includes('ed2k://')) extractED2K(txt).forEach(u => ed2k.push(u));
      if (txt.includes('magnet:?')) extractMagnet(txt).forEach(u => magnets.push(u));
    }
    return { ed2k, magnets };
  }

  function collectAllED2K() {
    const scopes = [...document.querySelectorAll('[id^="postmessage_"]')]; const set = new Set();
    scopes.forEach(sc => collectLinksFromNode(sc).ed2k.forEach(u => set.add(u)));
    document.querySelectorAll('.sht-agg-item textarea').forEach(ta => {
      extractED2K(ta.value).forEach(u => set.add(u));
    });
    return Array.from(set);
  }
  function collectAllMagnets() {
    const scopes = [...document.querySelectorAll('[id^="postmessage_"]')]; const set = new Set();
    scopes.forEach(sc => collectLinksFromNode(sc).magnets.forEach(u => set.add(u)));

    document.querySelectorAll('.sht-agg-item textarea').forEach(ta => {
      extractMagnet(ta.value).forEach(u => set.add(u));
    });

    // 添加种子文件到磁力链接区域
    const torrentLinks = Array.from(document.querySelectorAll('a[href*="forum.php?mod=attachment"][href*=".torrent"]'));
    torrentLinks.forEach(link => {
      const filename = (link.textContent || '').trim();
      if (filename) {
        set.add(link.href);
      }
    });

    return Array.from(set);
  }

  function formatPan115ResultItems(details, originalUrls) {
    const out = [];
    const list = Array.from(originalUrls || []);
    const arr = Array.from(details || []);
    const max = Math.max(arr.length, list.length);
    for (let i = 0; i < max; i++) {
      const entry = arr[i] || {};
      let display = entry.response?.name || entry.name || entry.title || entry.url || list[i] || `任务${i + 1}`;
      const rawUrl = entry.url || list[i] || '';
      try {
        if (display.startsWith('magnet:') || (rawUrl && rawUrl.startsWith('magnet:'))) {
          const magnet = display.startsWith('magnet:') ? display : rawUrl;
          const match = magnet.match(/dn=([^&]+)/i);
          if (match) display = decodeURIComponent(match[1]);
        } else if (display.startsWith('ed2k://') || (rawUrl && rawUrl.startsWith('ed2k://'))) {
          const ed2k = display.startsWith('ed2k://') ? display : rawUrl;
          const parts = ed2k.split('|');
          if (parts.length > 2) display = decodeURIComponent(parts[2]);
        }
      } catch { }
      if (display.length > 80) display = display.slice(0, 80) + '...';
      out.push({
        title: display,
        success: entry.success === undefined ? true : !!entry.success,
        error: entry.error || entry.message || ''
      });
    }
    return out;
  }

  function renderBox(container, titleText, links) {
    container.innerHTML = '';
    const card = document.createElement('div'); card.style.cssText = 'border:1px solid #e6e6e6;border-radius:6px;padding:6px;background:#fff';
    const head = document.createElement('div'); head.style.cssText = 'display:flex;align-items:center;justify-content:space-between';
    const title = document.createElement('span'); title.style.fontWeight = '600'; title.textContent = `${titleText}（${links.length}）`;
    const act = document.createElement('div'); act.style.cssText = 'display:inline-flex;gap:6px';
    const b = document.createElement('button'); b.textContent = '复制全部'; b.style.cssText = 'padding:2px 8px;cursor:pointer';
    const body = document.createElement('div');

    const ta = document.createElement('textarea'); ta.rows = Math.min(12, Math.max(4, links.length)); ta.style.cssText = 'width:100%;box-sizing:border-box;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px'; ta.value = links.join('\n'); ta.dataset.count = String(links.length);
    b.addEventListener('click', () => { GM_setClipboard(ta.value); b.textContent = '已复制'; setTimeout(() => b.textContent = '复制全部', 1200); });
    body.appendChild(ta);

    const pan115Available = CFG.pan115Enabled && CFG.pan115Cookie && CFG.pan115Cookie.trim();
    const createPan115Button = (label, targetUrls) => {
      const btn115 = document.createElement('button');
      btn115.textContent = label;
      btn115.style.cssText = [
        'padding:4px 10px',
        'cursor:pointer',
        'background:linear-gradient(135deg,#f6c343 0%,#f49f0a 100%)',
        'color:#3b2f09',
        'border:1px solid #d48806',
        'border-radius:4px',
        'font-weight:600',
        'box-shadow:0 1px 3px rgba(0,0,0,0.15)',
        'transition:all 0.2s ease'
      ].join(';');
      btn115.addEventListener('mouseenter', () => {
        btn115.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
        btn115.style.transform = 'translateY(-1px)';
      });
      btn115.addEventListener('mouseleave', () => {
        btn115.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
        btn115.style.transform = 'translateY(0)';
      });
      btn115.addEventListener('click', async () => {
        if (!pan115Available) {
          showWarningModal('请先在设置中启用 115 离线功能并填写 Cookie');
          return;
        }

        if (!Array.isArray(targetUrls) || targetUrls.length === 0) {
          showWarningModal('没有可发送的链接');
          return;
        }

        const originalText = btn115.textContent;
        btn115.disabled = true;
        btn115.textContent = '115 离线发送中...';

        try {
          const summary = await pan115AddTasks(targetUrls);
          const { successCount, failCount, details } = summary;
          const total = summary.total || targetUrls.length;
          const modalResults = formatPan115ResultItems(details, targetUrls);
          showBatchResultModal(modalResults, successCount, failCount, total);
        } catch (error) {
          console.error('发送到115失败:', error);
          showErrorModal(`发送到115失败: ${error.message}`);
        } finally {
          btn115.disabled = false;
          btn115.textContent = originalText;
        }
      });
      return btn115;
    };

    // 为磁力链接添加123Pan离线下载按钮
    if (titleText === '磁力链接' && CFG.pan123Enabled && links.length > 0) {
      const magnetUrls = ta.value.split('\n').filter(line => line.trim() && line.startsWith('magnet:'));

      if (magnetUrls.length === 1) {
        // 单个磁力链接：显示"发送到123Pan"
        const singleBtn = document.createElement('button');
        singleBtn.textContent = '发送到123Pan';
        singleBtn.style.cssText = 'padding:2px 8px;cursor:pointer;background:#007cba;color:white;border:none;border-radius:3px';
        singleBtn.addEventListener('click', async () => {
          if (!CFG.pan123Token || !CFG.pan123LoginUuid || !CFG.pan123Cookie) {
            showWarningModal('请先在设置中配置 123Pan 认证信息');
            return;
          }

          singleBtn.textContent = '发送中...';
          singleBtn.disabled = true;

          try {
            const titleMatch = magnetUrls[0].match(/dn=([^&]+)/);
            const title = titleMatch ? decodeURIComponent(titleMatch[1]) : '未知标题';
            await processMagnetOffline(magnetUrls[0], title);
          } catch (error) {
            console.error('发送到123Pan失败:', error);
            showErrorModal(`发送失败: ${error.message}`);
          } finally {
            singleBtn.textContent = '发送到123Pan';
            singleBtn.disabled = false;
          }
        });
        act.append(singleBtn);
      } else if (magnetUrls.length > 1) {
        // 多个磁力链接：显示"批量发送到123Pan"和"123Pan部分发送"
        const batchBtn = document.createElement('button');
        batchBtn.textContent = '批量发送到123Pan';
        batchBtn.style.cssText = 'padding:2px 8px;cursor:pointer;background:#007cba;color:white;border:none;border-radius:3px';
        batchBtn.addEventListener('click', async () => {
          if (!CFG.pan123Token || !CFG.pan123LoginUuid || !CFG.pan123Cookie) {
            showWarningModal('请先在设置中配置 123Pan 认证信息');
            return;
          }

          batchBtn.textContent = '批量发送中...';
          batchBtn.disabled = true;

          try {
            await processBatchMagnetOffline(magnetUrls);
          } catch (error) {
            console.error('批量发送失败:', error);
            showErrorModal(`批量发送失败: ${error.message}`);
          } finally {
            batchBtn.textContent = '批量发送到123Pan';
            batchBtn.disabled = false;
          }
        });

        const partialBtn = document.createElement('button');
        partialBtn.textContent = '123Pan部分发送';
        partialBtn.style.cssText = 'padding:2px 8px;cursor:pointer;background:#28a745;color:white;border:none;border-radius:3px;margin-left:4px';
        partialBtn.addEventListener('click', () => {
          showMagnetSelectionDialog(magnetUrls);
        });

        act.append(batchBtn);
        act.append(partialBtn);
      }
    }

    // 为磁力链接添加 115 离线下载按钮
    if (titleText === '磁力链接' && pan115Available && links.length > 0) {
      const magnetUrls = ta.value.split('\n').filter(line => line.trim() && line.startsWith('magnet:'));
      if (magnetUrls.length > 0) {
        act.append(createPan115Button(`115离线(${magnetUrls.length})`, magnetUrls));
      }
    }

    // 为 ED2K 链接添加 115 离线下载按钮
    if (titleText === 'ED2K 链接' && pan115Available && links.length > 0) {
      const ed2kUrls = ta.value.split('\n').filter(line => line.trim() && line.startsWith('ed2k://'));
      if (ed2kUrls.length > 0) {
        act.append(createPan115Button(`115离线(${ed2kUrls.length})`, ed2kUrls));
      }
    }

    act.append(b); head.append(title, act); card.append(head, body); container.append(card); agg.updateWrapMode();
  }

  function queueED2KScan(force = false) {
    if (!CFG.autoCollectED2K && !force) return;
    if (ed2kTimer) clearTimeout(ed2kTimer);
    ed2kTimer = setTimeout(() => { renderBox(agg.ed2kBox, 'ED2K 链接', collectAllED2K()); }, CFG.ed2kDebounceMs);
  }
  function queueMagnetScan(force = false) {
    if (!CFG.autoCollectMagnet && !force) return;
    if (magnetTimer) clearTimeout(magnetTimer);
    magnetTimer = setTimeout(() => { renderBox(agg.magnetBox, '磁力链接', collectAllMagnets()); }, CFG.magnetDebounceMs);
  }

  /*********************** 网络与解压（同前） ***********************/
  function httpGetArrayBuffer(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        timeout: 30000,
        anonymous: false,
        headers: {
          'Referer': location.href,
          'Accept': 'text/plain, text/html, application/octet-stream, */*',
          'Accept-Charset': 'utf-8, gbk, gb2312, shift_jis, euc-jp, big5, iso-8859-1',
          'Accept-Encoding': 'identity'
        },
        onload: res => resolve(res.response),
        ontimeout: () => reject(new Error('timeout')),
        onerror: () => reject(new Error('error'))
      });
    });
  }
  async function tryExtractZipTexts(buf, pwds, maxEntryBytes) {
    const blob = new Blob([buf]); const results = []; const tries = ['', ...pwds.filter(p => p && p.trim() !== '')];
    for (const pwd of tries) {
      try {
        const zr = new zip.ZipReader(new zip.BlobReader(blob), { password: pwd || undefined }); const entries = await zr.getEntries();
        for (const e of entries) {
          if (e.directory) continue; if (!isTextLike(e.filename)) continue;
          // 额外检查是否为图片文件或种子文件，避免处理压缩包中的图片和种子
          const isImageFile = /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)$/i.test(e.filename);
          const isTorrentFile = /\.torrent$/i.test(e.filename);
          if (isImageFile || isTorrentFile) continue;
          if (typeof e.uncompressedSize === 'number' && e.uncompressedSize > maxEntryBytes) continue;
          const u8 = await e.getData(new zip.Uint8ArrayWriter()); const text = decodeBest(u8);
          if (text) results.push({ name: e.filename, text: text.replace(/\uFFFD/g, ''), size: u8.byteLength, pwd });
        } await zr.close(); if (results.length) break;
      } catch { }
    }
    return dedupeByName(results);
  }
  // RAR 文件检测函数
  function isRarFile(array_buffer) {
    if (array_buffer.byteLength < 8) {
      return false;
    }

    const header1 = Array.from(new Uint8Array(array_buffer).slice(0, 4)).join(', ');
    const header2 = Array.from(new Uint8Array(array_buffer).slice(0, 7)).join(', ');
    const header3 = Array.from(new Uint8Array(array_buffer).slice(0, 8)).join(', ');

    const rar_header1 = '82, 69, 126, 94'; // old
    const rar_header2 = '82, 97, 114, 33, 26, 7, 0'; // 1.5 to 4.0
    const rar_header3 = '82, 97, 114, 33, 26, 7, 1, 0'; // 5.0

    return (header1 === rar_header1 || header2 === rar_header2 || header3 === rar_header3);
  }

  async function tryExtractRarTexts(buf, pwds, maxEntryBytes) {
    const results = [];
    const tries = ['', ...pwds.filter(p => p && p.trim() !== '')];

    for (const pwd of tries) {
      try {
        const result = await tryExtractWithPassword(buf, pwd);

        if (result.ok && result.entries) {
          for (const entry of result.entries) {
            const name = entry.name;

            if (!isTextLike(name)) continue;

            // 额外检查是否为图片文件或种子文件，避免处理压缩包中的图片和种子
            const isImageFile = /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)$/i.test(name);
            const isTorrentFile = /\.torrent$/i.test(name);
            if (isImageFile || isTorrentFile) continue;

            const size = entry.size || 0;
            if (size && size > maxEntryBytes) continue;

            // 解码文本内容 - 改进编码检测
            let text = null;
            try {
              // 调试数据格式
              console.log('[RAR] 处理文件:', name, '原始数据类型:', typeof entry.data, 'isArray:', Array.isArray(entry.data), 'length:', entry.data?.length);

              // 确保数据是 Uint8Array 格式
              const data = toU8(entry.data);
              if (!data) {
                console.log('[RAR] 无法转换文件数据:', name, '原始数据:', entry.data);
                continue;
              }

              console.log('[RAR] 数据转换成功:', name, '转换后类型:', data.constructor.name, '长度:', data.length, '前10字节:', Array.from(data.slice(0, 10)));

              // 使用改进的编码检测
              text = decodeBest(data, name);

              // 如果解码结果包含大量乱码字符，尝试其他编码
              if (text && /[\uFFFD\uFFFE\uFFFF]/.test(text) && text.length > 10) {
                console.log('[RAR] 检测到乱码，尝试其他编码:', name);

                // 尝试常见的中文编码
                const chineseEncodings = ['gbk', 'gb18030', 'big5', 'utf-8'];
                for (const encoding of chineseEncodings) {
                  try {
                    const testText = new TextDecoder(encoding).decode(data);
                    if (!/[\uFFFD\uFFFE\uFFFF]/.test(testText) || testText.length > text.length) {
                      text = testText;
                      console.log('[RAR] 使用编码', encoding, '成功:', name);
                      break;
                    }
                  } catch (e) {
                    // 忽略编码错误
                  }
                }
              }

              if (text) {
                results.push({
                  name,
                  text: text.replace(/\uFFFD/g, ''),
                  size: size,
                  pwd
                });
              }
            } catch (error) {
              console.log('[RAR] 文本解码失败:', name, error);
            }
          }
        }

        if (results.length) break;
      } catch (error) {
        console.log('RAR 解压失败:', error);
      }
    }

    return dedupeByName(results);
  }
  function dedupeByName(arr) { const map = new Map(); for (const x of arr) if (!map.has(x.name)) map.set(x.name, x); return Array.from(map.values()); }

  // 一键评分功能
  async function quickRate(originalRateBtn) {
    try {
      console.log('原始评分按钮:', originalRateBtn);
      console.log('按钮href:', originalRateBtn.href);
      console.log('按钮onclick:', originalRateBtn.onclick);

      // 尝试从href或onclick中提取评分URL
      let rateUrl = originalRateBtn.href;

      // 如果没有href，尝试从onclick中提取
      if (!rateUrl && originalRateBtn.onclick) {
        const onclickStr = originalRateBtn.onclick.toString();
        console.log('onclick字符串:', onclickStr);

        // 查找showWindow调用中的URL
        const showWindowMatch = onclickStr.match(/showWindow\([^,]+,\s*['"]([^'"]+)['"]/);
        if (showWindowMatch) {
          rateUrl = showWindowMatch[1];
          console.log('从onclick提取的URL:', rateUrl);
        }
      }

      if (!rateUrl || !rateUrl.includes('rate')) {
        console.log('无法获取评分URL，尝试从页面URL提取参数');

        // 从当前页面URL中提取tid
        const currentUrl = new URL(location.href);
        const tid = currentUrl.searchParams.get('tid');

        if (!tid) {
          console.log('无法从页面URL获取tid');
          return;
        }

        // 尝试从页面中查找pid
        const pidMatch = document.querySelector('input[name="pid"]') ||
          document.querySelector('[name="pid"]') ||
          document.querySelector('#pid') ||
          document.querySelector('[id*="pid"]');

        let pid = null;
        if (pidMatch) {
          pid = pidMatch.value || pidMatch.id?.replace(/[^\d]/g, '');
        }

        if (!pid) {
          // 尝试从页面内容中查找pid
          const pidRegex = /pid(\d+)/;
          const pageContent = document.documentElement.innerHTML;
          const pidMatch2 = pageContent.match(pidRegex);
          if (pidMatch2) {
            pid = pidMatch2[1];
          }
        }

        if (!pid) {
          console.log('无法获取pid');
          return;
        }

        console.log('使用页面参数 - tid:', tid, 'pid:', pid);

        // 直接使用提取的参数
        await submitRating(tid, pid);
        return;
      }

      // 从URL中提取tid和pid
      const urlParams = new URLSearchParams(rateUrl.split('?')[1]);
      const tid = urlParams.get('tid');
      const pid = urlParams.get('pid');

      if (!tid || !pid) {
        console.log('无法获取tid或pid');
        return;
      }

      await submitRating(tid, pid);
    } catch (error) {
      console.error('评分过程中出错:', error);
      alert('评分过程中出错: ' + error.message);
    }
  }

  // 提交评分的独立函数
  async function submitRating(tid, pid) {
    try {
      console.log('开始提交评分 - tid:', tid, 'pid:', pid);

      // 获取formhash
      const formhashInput = document.querySelector('input[name="formhash"]');
      const formhash = formhashInput ? formhashInput.value : '';

      if (!formhash) {
        console.log('无法获取formhash');
        alert('无法获取安全令牌，请刷新页面后重试');
        return;
      }

      console.log('formhash:', formhash);

      // 构建评分请求数据 - 根据实际 curl 请求格式
      const rateData = new URLSearchParams();
      rateData.append('formhash', formhash);
      rateData.append('tid', tid);
      rateData.append('pid', pid);
      rateData.append('referer', location.href);
      rateData.append('handlekey', 'rate');
      rateData.append('score8', CFG.defaultRateScore.toString());
      rateData.append('reason', CFG.defaultRateReason); // 添加评分理由

      console.log('评分请求数据:', rateData.toString());

      // 发送评分请求
      const response = await fetch('https://sehuatang.org/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': 'https://sehuatang.org',
          'Referer': location.href,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
          'Cache-Control': 'max-age=0',
          'Sec-Fetch-Dest': 'iframe',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        },
        credentials: 'include', // 包含 cookies
        body: rateData.toString()
      });

      console.log('评分响应状态:', response.status);

      if (response.ok) {
        const result = await response.text();
        console.log('评分响应内容:', result);

        // 检查是否包含成功标识
        const isSuccess = result.includes('succeedhandle_rate') ||
          result.includes('成功') ||
          result.includes('success') ||
          result.includes('评分成功') ||
          result.includes('评分完成') ||
          result.includes('操作成功');

        if (isSuccess) {
          // 尝试提取成功消息
          let successMessage = `评分成功！已给出${CFG.defaultRateScore}分`;
          const successMatch = result.match(/succeedhandle_rate\([^,]+,\s*['"]([^'"]+)['"]/);
          if (successMatch) {
            successMessage = successMatch[1]; // 使用服务器返回的消息
          }

          // 评分成功，更新按钮状态
          const rateClone = document.querySelector('#ak_rate');
          if (rateClone) {
            rateClone.style.background = '#4CAF50';
            rateClone.style.color = 'white';
            rateClone.textContent = `已评分(${CFG.defaultRateScore}分)`;
            rateClone.onclick = null; // 禁用再次点击
          }
          console.log(`评分成功: ${CFG.defaultRateScore}分 - ${successMessage}`);
        } else {
          console.log('评分失败:', result);
          alert('评分失败，请检查网络连接或权限');
        }
      } else {
        console.log('评分请求失败:', response.status);
        alert('评分请求失败，状态码: ' + response.status);
      }
    } catch (error) {
      console.error('评分过程中出错:', error);
      alert('评分过程中出错: ' + error.message);
    }
  }

  /*********************** 帖子列表页面功能 ***********************/
  function addAuthorOnlyToForumList() {
    // 检查当前是否在只看楼主模式
    const isInAuthorOnlyMode = location.href.includes('authorid=');

    if (isInAuthorOnlyMode) {
      // 如果已经在只看楼主模式，显示"显示全部"按钮
      addShowAllButton();
    } else {
      // 如果不在只看楼主模式，修改所有帖子链接为只看该作者模式
      modifyThreadLinksToAuthorOnly();
      addAuthorOnlyToggle();
    }

    // 自动应用已保存的排版设置
    applyLayoutSettings();
  }


  function applyLayoutSettings() {
    // 重新加载配置以确保使用最新值
    const currentCFG = loadConfig();
    // console.log('应用排版设置:', currentCFG);

    // 直接修改表格的 table-layout 属性
    const table = document.querySelector('table#threadlisttableid');
    if (table) {
      table.style.tableLayout = 'auto';
      // console.log('已设置表格 table-layout 为 auto');
    }

    // 隐藏回复/查看列
    if (currentCFG.hideReplyColumn) {
      const replyCells = document.querySelectorAll('td.num');
      // console.log('找到回复/查看列:', replyCells.length);
      replyCells.forEach(cell => {
        cell.style.display = 'none';
      });
    }

    // 隐藏最后回复列 - 修正选择器
    if (currentCFG.hideLastReplyColumn) {
      // 更精确的选择器：选择包含最后回复信息的td.by列
      const lastReplyCells = document.querySelectorAll('tbody tr td.by cite a[href*="username="]');
      // console.log('找到最后回复列:', lastReplyCells.length);
      lastReplyCells.forEach(link => {
        // 隐藏包含最后回复链接的td元素
        const td = link.closest('td.by');
        if (td) {
          td.style.display = 'none';
        }
      });
    }

    // 隐藏作者列 - 修正选择器
    if (currentCFG.hideAuthorColumn) {
      // 更精确的选择器：选择包含作者链接的td.by列
      const authorCells = document.querySelectorAll('tbody tr td.by cite a[href*="uid="]');
      // console.log('找到作者列:', authorCells.length);
      authorCells.forEach(link => {
        // 隐藏包含作者链接的td元素
        const td = link.closest('td.by');
        if (td) {
          td.style.display = 'none';
        }
      });
    }

    // 隐藏置顶帖
    if (currentCFG.hideStickyThreads) {
      const stickyThreads = document.querySelectorAll('tbody[id^="stickthread_"]');
      // console.log('找到置顶帖:', stickyThreads.length);
      stickyThreads.forEach(thread => {
        thread.style.display = 'none';
      });
    }

    // 隐藏分页
    if (currentCFG.hidePagination) {
      const pagination = document.querySelectorAll('span.tps');
      // console.log('找到分页:', pagination.length);
      pagination.forEach(pagination => {
        pagination.style.display = 'none';
      });
    }

    // 关键词过滤
    if (currentCFG.enableKeywordFilter && currentCFG.keywordFilters.length > 0) {
      const threadRows = document.querySelectorAll('tbody[id^="normalthread_"], tbody[id^="stickthread_"]');
      // console.log('开始关键词过滤，检查帖子数:', threadRows.length);

      threadRows.forEach(row => {
        const titleLink = row.querySelector('th a.s.xst');
        const typeLink = row.querySelector('th em a');
        let shouldHide = false;

        // 获取标题文本
        const title = titleLink ? (titleLink.textContent || titleLink.innerText) : '';

        // 获取类型文本
        const type = typeLink ? (typeLink.textContent || typeLink.innerText) : '';

        // 合并标题和类型进行匹配
        const fullText = `${title} ${type}`.trim();

        // console.log('检查帖子:', { title, type, fullText });

        for (const filter of currentCFG.keywordFilters) {
          try {
            const regex = new RegExp(filter, 'i');
            if (regex.test(fullText)) {
              // console.log('匹配到关键词:', filter, '内容:', fullText);
              shouldHide = true;
              break;
            }
          } catch (e) {
            // 如果正则表达式无效，则使用普通字符串匹配
            if (fullText.toLowerCase().includes(filter.toLowerCase())) {
              // console.log('匹配到关键词:', filter, '内容:', fullText);
              shouldHide = true;
              break;
            }
          }
        }

        if (shouldHide) {
          row.style.display = 'none';
          // console.log('隐藏帖子:', fullText);
        }
      });
    }

    // 标题增强 - 替换中文【】为[] 和 应用列表页专用替换规则
    if (currentCFG.enhanceTitles || currentCFG.enableListTitleEnhance) {
      const titleLinks = document.querySelectorAll('th a.s.xst');
      // console.log('开始标题增强，处理标题数:', titleLinks.length);
      // console.log('当前配置 - enhanceTitles:', currentCFG.enhanceTitles, 'enableListTitleEnhance:', currentCFG.enableListTitleEnhance);

      titleLinks.forEach(link => {
        let title = link.textContent || link.innerText;
        if (title) {
          const originalTitle = title;

          // 应用列表页专用替换规则
          if (currentCFG.enableListTitleEnhance && currentCFG.listTitleReplaceRules && currentCFG.listTitleReplaceRules.length > 0) {
            for (const rule of currentCFG.listTitleReplaceRules) {
              try {
                const regex = new RegExp(rule.pattern, 'g');
                title = title.replace(regex, rule.replacement);
              } catch (e) {
                // 如果正则表达式无效，则使用普通字符串替换
                const escapedPattern = rule.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedPattern, 'g');
                title = title.replace(regex, rule.replacement);
              }
            }
          }

          // 替换中文【】为[]
          if (currentCFG.enhanceTitles) {
            title = title.replace(/【/g, '[').replace(/】/g, ']');
          }

          // 清理多余空格
          title = title.replace(/\s+/g, ' ').trim();

          if (originalTitle !== title) {
            link.textContent = title;
            // console.log('标题增强:', originalTitle, '->', title);
          }
        }
      });
    }

    // 历史访问帖子处理
    if (currentCFG.historyPostAction !== 'none' && currentCFG.enableHistory) {
      const historyTids = currentCFG.historyItems.map(item => item.tid);
      // console.log('历史访问的帖子TID:', historyTids);

      const threadRows = document.querySelectorAll('tbody[id^="normalthread_"], tbody[id^="stickthread_"]');
      // console.log('开始处理历史访问帖子，检查帖子数:', threadRows.length);

      threadRows.forEach(row => {
        const titleLink = row.querySelector('th a.s.xst');
        if (titleLink) {
          // 从链接中提取TID
          const href = titleLink.getAttribute('href') || titleLink.getAttribute('data-original-href') || '';
          const tidMatch = href.match(/[?&]tid=(\d+)/);

          if (tidMatch) {
            const tid = tidMatch[1];
            const isVisited = historyTids.includes(tid);

            if (isVisited) {
              // console.log('发现已访问帖子，TID:', tid, '动作:', currentCFG.historyPostAction);

              switch (currentCFG.historyPostAction) {
                case 'hide':
                  row.style.display = 'none';
                  // console.log('隐藏已访问帖子:', tid);
                  break;

                case 'blue':
                  titleLink.style.color = currentCFG.historyPostColor;
                  titleLink.style.fontWeight = 'bold';
                  // console.log('标记已访问帖子为蓝色:', tid);
                  break;

                case 'strikethrough':
                  titleLink.style.textDecoration = 'line-through';
                  titleLink.style.opacity = '0.6';
                  // console.log('标记已访问帖子为删除线:', tid);
                  break;
              }
            }
          }
        }
      });
    }

    // 调整标题列宽度 - 让标题占据更多空间
    if (currentCFG.hideReplyColumn || currentCFG.hideLastReplyColumn || currentCFG.hideAuthorColumn) {
      // 移除之前的样式
      const existingStyle = document.querySelector('#sht-layout-style');
      if (existingStyle) {
        existingStyle.remove();
      }

      // 计算隐藏的列数
      let hiddenColumns = 0;
      if (currentCFG.hideAuthorColumn) hiddenColumns++;
      if (currentCFG.hideReplyColumn) hiddenColumns++;
      if (currentCFG.hideLastReplyColumn) hiddenColumns++;

      // console.log('隐藏的列数:', hiddenColumns);

      // 创建新的样式
      const style = document.createElement('style');
      style.id = 'sht-layout-style';

      if (hiddenColumns > 0) {
        // 根据隐藏的列数动态调整列宽
        const iconWidth = '40px';
        const otherColumnsWidth = hiddenColumns > 0 ? `${hiddenColumns * 80}px` : '0px';
        const titleWidth = `calc(100% - ${iconWidth} - ${otherColumnsWidth})`;

        style.textContent = `
        /* 强制覆盖表格布局 - 直接覆盖 .tl table 样式 */
        .tl table {
          table-layout: auto !important;
          width: 100% !important;
        }

        /* 更具体的选择器确保覆盖 */
        .bm .tl table#threadlisttableid {
          table-layout: auto !important;
          width: 100% !important;
        }

        /* 图标列固定宽度 */
        .bm .tl table#threadlisttableid tbody tr td.icn {
          width: ${iconWidth} !important;
          min-width: ${iconWidth} !important;
          max-width: ${iconWidth} !important;
          padding: 5px 0 !important;
        }

        /* 标题列占据剩余空间 - 让浏览器自动计算宽度 */
        .bm .tl table#threadlisttableid tbody tr th,
        .bm .tl table#threadlisttableid tbody tr th.fn {
          width: auto !important;
          min-width: 200px !important;
          max-width: none !important;
          word-wrap: break-word !important;
          word-break: break-word !important;
          padding: 5px 0 !important;
          padding-right: 1.5em !important;
        }

        /* 隐藏的列完全不显示 - 使用更具体的选择器 */
        .bm .tl table#threadlisttableid tbody tr td.by[style*="display: none"],
        .bm .tl table#threadlisttableid tbody tr td.by[style*="display: none"] cite,
        .bm .tl table#threadlisttableid tbody tr td.by[style*="display: none"] em {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          font-size: 0 !important;
          line-height: 0 !important;
        }

        .bm .tl table#threadlisttableid tbody tr td.num[style*="display: none"],
        .bm .tl table#threadlisttableid tbody tr td.num[style*="display: none"] a,
        .bm .tl table#threadlisttableid tbody tr td.num[style*="display: none"] em {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          font-size: 0 !important;
          line-height: 0 !important;
        }

        /* 确保表格行不会因为隐藏列而变形 */
        .bm .tl table#threadlisttableid tbody tr {
          display: table-row !important;
        }

        /* 强制表格单元格布局 */
        .bm .tl table#threadlisttableid tbody tr td,
        .bm .tl table#threadlisttableid tbody tr th {
          display: table-cell !important;
          vertical-align: top !important;
        }
      `;
      }

      document.head.appendChild(style);
      // console.log('布局样式已应用');
    }
  }

  function modifyThreadLinksToAuthorOnly() {
    const threadRows = document.querySelectorAll('tbody[id^="normalthread_"], tbody[id^="stickthread_"]');

    threadRows.forEach(row => {
      const tid = row.id.replace(/^(normal|stick)thread_/, '');
      const authorLink = row.querySelector('td.by cite a[href*="uid="]');
      const threadTitleLink = row.querySelector('th a.s.xst');

      if (authorLink && threadTitleLink) {
        const uidMatch = authorLink.href.match(/uid=(\d+)/);
        if (uidMatch) {
          const uid = uidMatch[1];

          // 修改帖子标题链接为只看该作者模式
          const originalHref = threadTitleLink.href;
          const authorOnlyHref = `forum.php?mod=viewthread&tid=${tid}&page=1&authorid=${uid}`;

          // 保存原始链接
          threadTitleLink.dataset.originalHref = originalHref;
          threadTitleLink.href = authorOnlyHref;

          // 添加视觉提示
          threadTitleLink.style.color = '#ff6b6b';
          threadTitleLink.title = '点击进入只看该作者模式';
        }
      }
    });
  }

  function addShowAllButton() {
    // 检查是否已经存在按钮
    if (document.querySelector('#sht-show-all-btn')) return;

    const showAllBtn = document.createElement('button');
    showAllBtn.id = 'sht-show-all-btn';
    showAllBtn.textContent = '显示全部';
    showAllBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 8px 16px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;

    showAllBtn.addEventListener('click', () => {
      // 跳转到正常模式（去掉authorid参数）
      const currentUrl = new URL(location.href);
      currentUrl.searchParams.delete('authorid');
      window.location.href = currentUrl.toString();
    });

    document.body.appendChild(showAllBtn);
  }

  function addAuthorOnlyToggle() {
    // 检查是否已经存在按钮
    if (document.querySelector('#sht-author-only-toggle')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'sht-author-only-toggle';
    toggleBtn.textContent = '只看楼主模式';
    toggleBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 8px 16px;
    background: #007cba;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;

    toggleBtn.addEventListener('click', () => {
      // 跳转到当前页面的只看该作者模式（使用第一个帖子的作者UID）
      const firstAuthorLink = document.querySelector('td.by cite a[href*="uid="]');
      if (firstAuthorLink) {
        const uidMatch = firstAuthorLink.href.match(/uid=(\d+)/);
        if (uidMatch) {
          const currentUrl = new URL(location.href);
          currentUrl.searchParams.set('authorid', uidMatch[1]);
          window.location.href = currentUrl.toString();
        }
      }
    });

    document.body.appendChild(toggleBtn);
  }


  /*********************** 启动与监听 ***********************/

  // 域名自动跳转功能
  function checkAndRedirectDomain() {
    // 如果未启用自动跳转，直接返回
    if (CFG.domainAutoRedirect === false) {
      return false;
    }

    const currentHost = location.hostname;
    const primaryDomain = CFG.primaryDomain || 'sehuatang.org';

    // 定义所有色花堂域名
    const sehuatangDomains = [
      'sehuatang.org',
      'www.sehuatang.org',
      'sehuatang.net',
      'www.sehuatang.net'
    ];

    // 检查当前域名是否是色花堂域名
    const isSehuatangDomain = sehuatangDomains.includes(currentHost);

    if (!isSehuatangDomain) {
      return false; // 不是色花堂域名，不处理
    }

    // 如果当前域名不是主域名，则跳转
    if (currentHost !== primaryDomain) {
      const currentUrl = new URL(location.href);
      currentUrl.hostname = primaryDomain;
      console.log(`[SHT] 检测到副域名 ${currentHost}，自动跳转到主域名 ${primaryDomain}`);
      window.location.replace(currentUrl.toString()); // 使用 replace 而不是 href，避免在历史记录中留下副域名
      return true; // 返回 true 表示已跳转
    }

    return false; // 未跳转
  }

  // 检查并执行域名跳转（在配置加载后立即执行）
  // 注意：如果跳转发生，后续代码可能不会执行，这是预期的行为
  checkAndRedirectDomain();

  // 检查是否在帖子列表页面
  const isForumListPage = location.href.includes('mod=forumdisplay');
  const isThreadPage = location.href.includes('mod=viewthread');
  const isForumHomePage = (location.href.includes('forum.php') && !location.href.includes('mod=')) ||
    location.href === 'https://sehuatang.org/' ||
    location.href === 'http://sehuatang.org/';

  // 确保配置加载完成后再执行功能
  // console.log('当前配置:', CFG);

  if (isForumListPage) {
    // 在帖子列表页面添加"只看楼主"功能
    addAuthorOnlyToForumList();
    // 应用论坛模块屏蔽
    applyModuleFilter();
    // 应用布局设置（包括标题增强）
    applyLayoutSettings();
  } else if (isForumHomePage) {
    // 在论坛首页应用论坛模块屏蔽
    applyModuleFilter();
  } else if (isThreadPage) {
    // 在帖子页面运行原有功能
    enhanceAll();
    if (CFG.blockImages) applyImageBlocking(true, { forceRebuild: true });
    queueED2KScan(true); queueMagnetScan(true);

    // 处理帖子详情标题
    enhanceThreadTitle();

    // 延迟再次处理，确保页面完全加载
    setTimeout(() => {
      enhanceThreadTitle();
    }, 1000);
  }

  // 论坛模块屏蔽功能
  function applyModuleFilter() {
    if (!CFG.enableModuleFilter || !CFG.hiddenModules.length) return;

    // console.log('应用论坛模块屏蔽:', CFG.hiddenModules);

    // 查找所有论坛模块（大模块）
    const modules = document.querySelectorAll('.bm.bmw.flg.cl');
    // console.log('找到论坛模块数:', modules.length);

    modules.forEach(module => {
      const titleElement = module.querySelector('h2 span');
      if (titleElement) {
        const moduleName = titleElement.textContent.trim();
        // console.log('检查大模块:', moduleName);

        // 检查大模块是否在隐藏列表中
        const shouldHideModule = CFG.hiddenModules.some(hiddenName => {
          return moduleName.includes(hiddenName) || hiddenName.includes(moduleName);
        });

        if (shouldHideModule) {
          // console.log('隐藏大模块:', moduleName);
          module.style.display = 'none';
        } else {
          // 检查大模块下面的小模块
          const subModules = module.querySelectorAll('.fl_g');
          subModules.forEach(subModule => {
            const subTitleElement = subModule.querySelector('dt a');
            if (subTitleElement) {
              const subModuleName = subTitleElement.textContent.trim();
              // console.log('检查小模块:', subModuleName);

              // 检查小模块是否在隐藏列表中
              const shouldHideSubModule = CFG.hiddenModules.some(hiddenName => {
                return subModuleName.includes(hiddenName) || hiddenName.includes(subModuleName);
              });

              if (shouldHideSubModule) {
                // console.log('隐藏小模块:', subModuleName);
                subModule.style.display = 'none';
              }
            }
          });
        }
      }
    });
  }

  // 帖子详情标题处理函数
  function enhanceThreadTitle() {
    if (!CFG.enableThreadTitleEnhance) return;

    // 处理主标题
    const titleElement = document.querySelector('#thread_subject');
    if (titleElement) {
      let title = titleElement.textContent || titleElement.innerText;
      if (title) {
        const originalTitle = title;
        // console.log('当前配置的替换规则:', CFG.titleReplaceRules);
        // console.log('处理主标题:', originalTitle);

        // 应用自定义替换规则
        if (CFG.titleReplaceRules && CFG.titleReplaceRules.length > 0) {
          for (const rule of CFG.titleReplaceRules) {
            try {
              // 直接使用字符串作为正则表达式，因为配置中已经转义了
              const regex = new RegExp(rule.pattern, 'g');
              title = title.replace(regex, rule.replacement);
              // console.log('应用替换规则:', rule.pattern, '->', rule.replacement, '结果:', title);
            } catch (e) {
              // 如果正则表达式无效，则使用普通字符串替换
              const escapedPattern = rule.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              title = title.replace(new RegExp(escapedPattern, 'g'), rule.replacement);
              // console.log('使用字符串替换:', rule.pattern, '->', rule.replacement, '结果:', title);
            }
          }
        }

        // 替换中文【】为[]
        title = title.replace(/【/g, '[').replace(/】/g, ']');

        // 清理多余的空格
        title = title.replace(/\s+/g, ' ').trim();

        // 如果标题有变化，更新显示
        if (title !== originalTitle) {
          // console.log('主标题有变化，准备更新DOM');
          // console.log('原始标题:', originalTitle);
          // console.log('处理后标题:', title);

          // 创建可点击的标题元素
          const clickableTitle = document.createElement('span');
          clickableTitle.textContent = title;
          clickableTitle.style.cssText = 'cursor: pointer; color: #0066cc; text-decoration: underline; user-select: none;';
          clickableTitle.title = '点击复制标题';

          // 添加点击事件
          clickableTitle.addEventListener('click', () => {
            navigator.clipboard.writeText(title).then(() => {
              // 临时改变样式表示复制成功
              const originalColor = clickableTitle.style.color;
              clickableTitle.style.color = '#28a745';
              clickableTitle.textContent = '已复制!';
              setTimeout(() => {
                clickableTitle.style.color = originalColor;
                clickableTitle.textContent = title;
              }, 1000);
            }).catch(err => {
              console.error('复制失败:', err);
              // 降级方案：使用旧方法
              const textArea = document.createElement('textarea');
              textArea.value = title;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);

              // 显示复制成功提示
              const originalColor = clickableTitle.style.color;
              clickableTitle.style.color = '#28a745';
              clickableTitle.textContent = '已复制!';
              setTimeout(() => {
                clickableTitle.style.color = originalColor;
                clickableTitle.textContent = title;
              }, 1000);
            });
          });

          // 替换原元素内容
          titleElement.innerHTML = '';
          titleElement.appendChild(clickableTitle);

          // console.log('DOM更新完成，当前元素内容:', titleElement.textContent);
          // console.log('帖子标题增强:', originalTitle, '->', title);
        } else {
          // console.log('主标题无变化，跳过更新');
        }
      }
    }

    // 处理类型标签链接
    const typeLink = document.querySelector('h1.ts a[href*="typeid="]');
    if (typeLink) {
      const typeText = typeLink.textContent || typeLink.innerText;
      // console.log('处理类型标签:', typeText);

      // 检查是否需要隐藏类型标签
      const shouldHideType = CFG.hideTypeLabels && CFG.hideTypeLabels.some(label => {
        return typeText.includes(label);
      });

      if (shouldHideType) {
        console.log('隐藏类型标签:', typeText);
        typeLink.style.display = 'none';
      }
    }
  }

  const mo = new MutationObserver(muts => {
    const newImgCandidates = new Set();
    let needCollect = false;

    for (const m of muts) {
      if (m.type !== 'childList') continue;
      m.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        if (node.classList && Array.from(node.classList).some(c => c.startsWith('sht-'))) return;

        enhanceInNode(node);

        if (node.matches?.('[id^="postmessage_"] img')) newImgCandidates.add(node);
        node.querySelectorAll?.('[id^="postmessage_"] img')?.forEach(img => newImgCandidates.add(img));

        if (!needCollect && (node.id?.startsWith?.('postmessage_') || node.closest?.('[id^="postmessage_"]'))) {
          needCollect = true;
        }
      });
    }

    if (newImgCandidates.size && CFG.blockImages) applyImageBlocking(true, { candidates: newImgCandidates });
    if (needCollect) { queueED2KScan(false); queueMagnetScan(false); }
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // ========== 115 离线下载功能 ==========
  const PAN115_REQUEST_TIMEOUT = 20000;
  let pan115UidCache = { value: null, ts: 0 };

  function ensurePan115Config() {
    if (!CFG.pan115Enabled) {
      throw new Error('115 离线功能未启用');
    }
    if (!CFG.pan115Cookie || !CFG.pan115Cookie.trim()) {
      throw new Error('115 Cookie 未配置，请在设置中填写');
    }
  }

  function makePan115Headers(extra = {}) {
    const base = {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': CFG.pan115UserAgent?.trim() || navigator.userAgent,
      'Cookie': CFG.pan115Cookie.trim(),
      'Origin': 'https://115.com',
      'Referer': 'https://115.com/?tab=offline&mode=wangpan',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Dest': 'empty'
    };
    return { ...base, ...extra };
  }

  function pan115Request({ method = 'GET', url, data, headers = {}, responseType = 'json' }) {
    ensurePan115Config();
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        data,
        headers: makePan115Headers(headers),
        responseType,
        timeout: PAN115_REQUEST_TIMEOUT,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            let body = res.response;
            if (!body && res.responseText) {
              if (responseType === 'json') {
                try {
                  body = JSON.parse(res.responseText);
                } catch (e) {
                  reject(new Error('115 响应解析失败'));
                  return;
                }
              } else {
                body = res.responseText;
              }
            }
            resolve(body);
          } else {
            reject(new Error(`115 请求失败: HTTP ${res.status}`));
          }
        },
        onerror: (error) => {
          reject(new Error(error?.message || '115 请求网络错误'));
        },
        ontimeout: () => reject(new Error('115 请求超时'))
      });
    });
  }

  async function pan115FetchUid() {
    ensurePan115Config();
    const now = Date.now();
    if (pan115UidCache.value && now - pan115UidCache.ts < 10 * 60 * 1000) {
      return pan115UidCache.value;
    }
    const result = await pan115Request({
      method: 'GET',
      url: 'https://my.115.com/?ct=ajax&ac=get_user_aq',
      responseType: 'json'
    });
    const uid = result?.data?.uid || result?.uid;
    if (!uid) {
      throw new Error('无法获取 115 UID，请检查 Cookie 是否有效');
    }
    pan115UidCache = { value: uid, ts: now };
    return uid;
  }

  async function pan115FetchSignTime() {
    const result = await pan115Request({
      method: 'GET',
      url: 'https://115.com/?ct=offline&ac=space',
      responseType: 'json',
      headers: { 'Accept-Encoding': 'text/html' }
    });
    if (!result) {
      throw new Error('115 返回空响应');
    }
    if (result.state === false) {
      throw new Error(result.error_msg || '获取 115 离线签名失败');
    }
    if (!result.sign || !result.time) {
      throw new Error('115 响应缺少 sign/time 字段');
    }
    return { sign: result.sign, time: result.time };
  }

  async function pan115AddTasks(urls) {
    ensurePan115Config();
    const uniqueUrls = Array.from(new Set((urls || []).map(u => u && u.trim()).filter(Boolean)));
    if (uniqueUrls.length === 0) {
      throw new Error('没有可发送的链接');
    }

    const uid = await pan115FetchUid();
    let signTime = await pan115FetchSignTime();

    const targetDir = (CFG.pan115CurrentThreadFolder && String(CFG.pan115CurrentThreadFolder).trim())
      || (CFG.pan115UploadDir && String(CFG.pan115UploadDir).trim())
      || '';

    const results = [];
    let successCount = 0;

    if (targetDir) {
      const valid = await pan115ValidateDirectory(targetDir);
      if (!valid) {
        console.warn('[115 离线] 目录已失效:', targetDir);
        clearPan115FolderReference(targetDir);
        showWarningModal('115 离线目录不存在或已删除，已清除缓存，请重新创建或选择新目录。');
        throw new Error('115 离线目录不存在或已删除，请重新创建。');
      }
    }

    const encodeUrlFor115 = (url) => {
      try {
        return encodeURIComponent(url).replace(/%20/g, '+');
      } catch {
        return url;
      }
    };

    const batchParams = new URLSearchParams();
    if (targetDir) batchParams.set('wp_path_id', targetDir);
    batchParams.set('uid', uid);
    batchParams.set('sign', signTime.sign);
    batchParams.set('time', signTime.time);
    uniqueUrls.forEach((url, idx) => {
      batchParams.set(`url[${idx}]`, encodeUrlFor115(url));
    });

    try {
      const response = await pan115Request({
        method: 'POST',
        url: 'https://115.com/web/lixian/?ct=lixian&ac=add_task_urls',
        data: batchParams.toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        responseType: 'json'
      });

      const respList = response?.result || [];
      const dirRemovedKeywords = ['不存在', '删除', '无效'];
      let directoryInvalid = false;
      for (let i = 0; i < uniqueUrls.length; i++) {
        const url = uniqueUrls[i];
        const entry = respList[i] || null;
        const success = entry?.info_hash && (!entry?.error_msg);
        if (success) successCount++;
        results.push({
          url,
          success,
          response: entry,
          message: success ? '提交成功' : (entry?.error_msg || '提交失败'),
          error: success ? undefined : (entry?.error_msg || '提交失败')
        });
        if (!success && entry?.error_msg && dirRemovedKeywords.some(k => entry.error_msg.includes(k))) {
          directoryInvalid = true;
        }
      }
      if (directoryInvalid && targetDir) {
        console.warn('[115 离线] 目标目录失效，清除缓存:', targetDir);
        clearPan115FolderReference(targetDir);
        showWarningModal('115 离线目录已失效（可能已删除或无权限）。目录缓存已清除，请重新创建或选择目录后再试。');
      }
      if (response?.state === false && response?.error && targetDir) {
        if (dirRemovedKeywords.some(k => response.error.includes(k))) {
          clearPan115FolderReference(targetDir);
          showWarningModal('115 离线目录已失效（可能已删除或无权限）。目录缓存已清除，请重新创建或选择目录后再试。');
        }
      }
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      uniqueUrls.forEach((url) => {
        results.push({ url, success: false, error: errMessage, message: errMessage });
      });
    }

    // 更新115任务统计（只统计成功发送的任务）
    if (successCount > 0) {
      if (typeof CFG.pan115TaskCount !== 'number') {
        CFG.pan115TaskCount = 0;
      }
      CFG.pan115TaskCount += successCount;
      saveConfig();
      // 更新显示
      update115TaskCountDisplay();
    }

    return {
      successCount,
      failCount: results.length - successCount,
      total: results.length,
      details: results
    };
  }

  async function create115FolderAndSend(triggerButton) {
    try {
      ensurePan115Config();
    } catch (error) {
      showWarningModal(error.message || '请先在设置中配置 115 离线认证信息');
      return;
    }

    const button = triggerButton || null;
    const originalText = button?.textContent;
    if (button) {
      button.disabled = true;
      button.textContent = '115 创建中...';
    }

    try {
      const folderName = cleanTitleForFolder(getCurrentThreadTitle()) || `离线_${Date.now()}`;
      const createResult = await api115CreateFolder(folderName);
      if (!createResult?.state) {
        throw new Error(createResult?.error || createResult?.errno || '创建 115 文件夹失败');
      }

      const folderId = (createResult.cid || createResult.file_id || createResult.folder_id || '').toString();
      const realName = createResult.cname || createResult.file_name || folderName;
      if (!folderId) {
        throw new Error('未获取到新文件夹 ID');
      }

      if (!CFG.pan115FolderNames || typeof CFG.pan115FolderNames !== 'object') CFG.pan115FolderNames = {};
      CFG.pan115FolderNames[folderId] = realName;

      saveCurrentThreadFolder115(folderId);
      updateCreateFolderButton115();
      refreshPan115FolderInfo();

      const ed2kLinks = collectAllED2K();
      const magnetLinks = collectAllMagnets();
      const allLinks = Array.from(new Set([...ed2kLinks, ...magnetLinks]));

      if (!allLinks.length) {
        showInfoModal(`已创建目录：${realName} (${folderId})，但未收集到可离线的 ED2K 或磁力链接。`);
        return;
      }

      if (button) {
        button.textContent = '115 离线发送中...';
      }

      const summary = await pan115AddTasks(allLinks);
      const { successCount, failCount, details } = summary;
      const total = summary.total || allLinks.length;
      const modalResults = formatPan115ResultItems(details, allLinks);
      showBatchResultModal(modalResults, successCount, failCount, total);
      if (failCount > 0 && Array.isArray(details)) {
        console.warn('[115 离线] 以下任务提交失败:');
        details.forEach((item, idx) => {
          if (!item || item.success) return;
          console.warn(`[#${idx + 1}]`, item.url || '未知链接', '| 错误:', item.error || item.message || '未知原因', '| 响应:', item.response);
        });
      }
    } catch (error) {
      console.error('115 一键创建+离线失败:', error);
      const errMsg = error instanceof Error ? (error.message || '') : String(error);
      if (errMsg && errMsg.includes('目录不存在或已删除')) {
        showWarningModal('115 离线目录不存在或已删除，缓存已清除，请重新创建或选择目录后再试。');
      } else {
        showErrorModal(`115 一键创建+离线失败: ${errMsg || error}`);
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText || '⚡ 115 新建+离线';
      }
    }
  }

  // ========== 123Pan 离线下载功能 ==========

  // 123Pan API 基础函数
  function makePan123Session() {
    if (!CFG.pan123Token || !CFG.pan123LoginUuid || !CFG.pan123Cookie) {
      throw new Error('123Pan 认证信息不完整，请检查配置');
    }

    return {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'App-Version': '3',
        'Authorization': CFG.pan123Token,
        'Origin': 'https://www.123pan.com',
        'Referer': 'https://www.123pan.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari',
        'platform': 'web',
        'LoginUuid': CFG.pan123LoginUuid,
        'Cookie': CFG.pan123Cookie
      }
    };
  }

  // 生成随机查询参数
  function generateRandomQuery() {
    return `${Math.floor(Math.random() * 10000000000)}=${Math.floor(Math.random() * 10000000000)}-${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 10000000000)}`;
  }

  // 使用GM_xmlhttpRequest下载文件（绕过CORS）
  function downloadFileWithGM(url) {
    return new Promise((resolve, reject) => {
      // 获取当前页面的Cookie
      const cookies = document.cookie;

      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
        headers: {
          'Cookie': cookies,
          'User-Agent': navigator.userAgent,
          'Referer': window.location.href
        },
        onload: function (response) {
          if (response.status >= 200 && response.status < 300) {
            const arrayBuffer = response.response;
            const blob = new Blob([arrayBuffer]);
            resolve(blob);
          } else {
            reject(new Error(`下载失败: HTTP ${response.status}`));
          }
        },
        onerror: function (error) {
          reject(new Error(`下载失败: ${error.message || '网络错误'}`));
        },
        ontimeout: function () {
          reject(new Error('下载超时'));
        }
      });
    });
  }

  // 上传 torrent 文件到 123Pan
  async function apiUploadTorrent(torrentBlob, filename) {
    const session = makePan123Session();
    const url = `https://www.123pan.com/b/api/offline_download/upload/seed?${generateRandomQuery()}`;

    const formData = new FormData();
    formData.append('upload-torrent', torrentBlob, filename);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: session.headers,
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('上传 torrent 失败:', error);
      throw error;
    }
  }

  // 解析资源（通过infohash）
  async function apiResolve(infohash) {
    const session = makePan123Session();
    const url = `https://www.123pan.com/b/api/v2/offline_download/task/resolve?${generateRandomQuery()}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...session.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ info_hash: infohash.toLowerCase() })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('解析资源失败:', error);
      throw error;
    }
  }

  // 解析磁力链接
  async function apiResolveMagnet(magnetUrl) {
    const session = makePan123Session();
    const url = `https://www.123pan.com/b/api/v2/offline_download/task/resolve?${generateRandomQuery()}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...session.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ urls: magnetUrl })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('解析磁力链接失败:', error);
      throw error;
    }
  }

  // 提交离线任务
  async function apiSubmit(resourceId, fileIds) {
    const session = makePan123Session();
    const url = `https://www.123pan.com/b/api/v2/offline_download/task/submit?${generateRandomQuery()}`;

    const payload = {
      resource_list: [{
        resource_id: resourceId,
        select_file_id: fileIds
      }]
    };

    // 优先使用当前帖子的文件夹，否则使用默认文件夹
    const uploadDir = CFG.pan123CurrentThreadFolder || CFG.pan123UploadDir;
    if (uploadDir) {
      payload.upload_dir = parseInt(uploadDir);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...session.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('提交离线任务失败:', error);
      throw error;
    }
  }

  // 获取离线任务列表
  async function apiGetOfflineTasks() {
    const session = makePan123Session();
    const url = `https://www.123pan.com/b/api/offline_download/task/list?${generateRandomQuery()}`;

    const data = {
      current_page: 1,
      page_size: 15,
      status_arr: [0, 1, 3, 4] // 0: pending, 1: downloading, 3: completed, 4: failed
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...session.headers,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('获取离线任务列表失败:', error);
      throw error;
    }
  }

  // 取消离线任务
  async function apiCancelOfflineTask(taskId) {
    const session = makePan123Session();
    const url = `https://www.123pan.com/b/api/offline_download/task/abort?${generateRandomQuery()}`;

    const data = {
      all: false,
      is_abort: true,
      task_ids: [parseInt(taskId)]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...session.headers,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('取消离线任务失败:', error);
      throw error;
    }
  }

  // 创建文件夹
  async function apiCreateFolder(folderName, parentFileId = 0) {
    const session = makePan123Session();
    const url = `https://www.123pan.com/b/api/file/upload_request?${generateRandomQuery()}`;

    const data = {
      driveId: 0,
      etag: '',
      fileName: folderName,
      parentFileId: parentFileId,
      size: 0,
      type: 1, // 1表示文件夹
      duplicate: 1, // 允许重复名称
      NotReuse: true,
      event: 'newCreateFolder',
      operateType: 1,
      RequestSource: null
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...session.headers,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('创建文件夹失败:', error);
      throw error;
    }
  }

  // 获取文件夹信息（通过文件ID）
  async function apiGetFileInfo(fileId) {
    const session = makePan123Session();
    const url = `https://www.123pan.com/b/api/file/info?${generateRandomQuery()}&fileId=${fileId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: session.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.code === 0 && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('获取文件信息失败:', error);
      throw error;
    }
  }

  // 获取文件夹名称（通过ID）
  async function getFolderNameById(folderId) {
    if (!folderId || folderId === '0') return '根目录';

    try {
      const folder = await apiGetFileInfo(folderId);
      return folder ? folder.FileName : `文件夹_${folderId}`;
    } catch (error) {
      console.error('获取文件夹名称失败:', error);
      return `文件夹_${folderId}`;
    }
  }

  // 清理标题用于文件夹名称
  function cleanTitleForFolder(title) {
    if (!title) return `文件夹_${new Date().toISOString().slice(0, 10)}`;

    return title
      .replace(/[<>:"/\\|?*]/g, '')  // 移除Windows不允许的字符
      .replace(/[\r\n\t]/g, ' ')     // 替换换行符和制表符为空格
      .replace(/\s+/g, ' ')          // 合并多个空格
      .trim()                        // 去除首尾空格
      .substring(0, 100);            // 限制长度
  }

  // 获取当前帖子标题
  function getCurrentThreadTitle() {
    const titleElement = document.querySelector('#thread_subject');
    if (titleElement) {
      return titleElement.textContent?.trim() || '';
    }

    // 备用方案：从页面标题获取
    const pageTitle = document.title;
    if (pageTitle && pageTitle !== '色花堂') {
      return pageTitle.replace(' - 色花堂', '').trim();
    }

    return '';
  }

  // 获取当前帖子URL
  function getCurrentThreadUrl() {
    return window.location.href;
  }

  // 检查当前帖子是否有对应的文件夹
  function checkCurrentThreadFolder() {
    const currentUrl = getCurrentThreadUrl();
    const folderId = CFG.pan123ThreadFolders[currentUrl];

    if (folderId) {
      CFG.pan123CurrentThreadFolder = folderId;
      return true;
    }

    CFG.pan123CurrentThreadFolder = '';
    return false;
  }

  // 保存当前帖子的文件夹映射
  function saveCurrentThreadFolder(folderId) {
    const currentUrl = getCurrentThreadUrl();
    CFG.pan123ThreadFolders[currentUrl] = folderId;
    CFG.pan123CurrentThreadFolder = folderId;
    refreshPan123FolderInfo();
    saveConfig();
  }

  // 显示创建文件夹对话框
  function showCreateFolderDialog() {
    if (!CFG.pan123Enabled || !CFG.pan123Token || !CFG.pan123LoginUuid || !CFG.pan123Cookie) {
      showWarningModal('请先在设置中配置 123Pan 认证信息');
      return;
    }

    const currentTitle = getCurrentThreadTitle();
    const cleanTitle = cleanTitleForFolder(currentTitle);

    const modal = createModal('创建123Pan文件夹', '', 'info');
    const content = document.createElement('div');
    content.style.cssText = 'padding: 20px; text-align: left;';

    // 标题说明
    const titleLabel = document.createElement('div');
    titleLabel.textContent = '文件夹名称：';
    titleLabel.style.cssText = 'margin-bottom: 8px; font-weight: bold; color: #333;';
    content.appendChild(titleLabel);

    // 输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = cleanTitle;
    input.placeholder = '请输入文件夹名称';
    input.style.cssText = 'width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; margin-bottom: 15px;';
    content.appendChild(input);

    // 选项组
    const optionsGroup = document.createElement('div');
    optionsGroup.style.cssText = 'margin-bottom: 15px;';

    const optionsLabel = document.createElement('div');
    optionsLabel.textContent = '创建后操作：';
    optionsLabel.style.cssText = 'margin-bottom: 8px; font-weight: bold; color: #333;';
    optionsGroup.appendChild(optionsLabel);

    const setAsDefaultOption = document.createElement('label');
    setAsDefaultOption.style.cssText = 'display: block; margin-bottom: 8px; cursor: pointer;';
    const setAsDefaultCheckbox = document.createElement('input');
    setAsDefaultCheckbox.type = 'checkbox';
    setAsDefaultCheckbox.checked = false;
    setAsDefaultCheckbox.style.cssText = 'margin-right: 8px;';
    setAsDefaultOption.appendChild(setAsDefaultCheckbox);
    setAsDefaultOption.appendChild(document.createTextNode('设为默认文件夹（影响所有新帖子）'));
    optionsGroup.appendChild(setAsDefaultOption);

    const setAsCurrentOption = document.createElement('label');
    setAsCurrentOption.style.cssText = 'display: block; margin-bottom: 8px; cursor: pointer;';
    const setAsCurrentCheckbox = document.createElement('input');
    setAsCurrentCheckbox.type = 'checkbox';
    setAsCurrentCheckbox.checked = true;
    setAsCurrentCheckbox.style.cssText = 'margin-right: 8px;';
    setAsCurrentOption.appendChild(setAsCurrentCheckbox);
    setAsCurrentOption.appendChild(document.createTextNode('设为本次离线文件夹（仅影响当前帖子）'));
    optionsGroup.appendChild(setAsCurrentOption);

    content.appendChild(optionsGroup);

    // 说明文字
    const helpText = document.createElement('div');
    helpText.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 15px; line-height: 1.4;';
    helpText.innerHTML = `
    <div>• 默认使用当前帖子标题作为文件夹名称</div>
    <div>• 已自动清理特殊字符，您可以根据需要修改</div>
    <div>• 建议选择"设为本次离线文件夹"避免嵌套问题</div>
  `;
    content.appendChild(helpText);

    // 按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = 'padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;';
    cancelBtn.onclick = () => modal.remove();

    const createBtn = document.createElement('button');
    createBtn.textContent = '📁 创建文件夹';
    createBtn.style.cssText = 'padding: 8px 16px; background: linear-gradient(135deg, #007cba 0%, #005a87 100%); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';

    createBtn.onclick = async () => {
      const folderName = input.value.trim();
      if (!folderName) {
        showErrorModal('请输入文件夹名称');
        return;
      }

      createBtn.disabled = true;
      createBtn.textContent = '创建中...';

      try {
        const result = await apiCreateFolder(folderName);

        if (result.code === 0 && result.data?.Info) {
          const folderId = result.data.Info.FileId;
          const folderName = result.data.Info.FileName;

          let message = `文件夹创建成功！\n\n文件夹名称：${folderName}\n文件夹ID：${folderId}\n\n`;

          // 根据用户选择执行不同操作
          if (setAsDefaultCheckbox.checked) {
            CFG.pan123UploadDir = folderId.toString();
            message += '已设为默认上传目录';
          }

          if (setAsCurrentCheckbox.checked) {
            saveCurrentThreadFolder(folderId.toString());
            message += (setAsDefaultCheckbox.checked ? '，' : '') + '已设为当前帖子离线文件夹';
          }

          saveConfig();
          showSuccessModal(message);
          modal.remove();

          // 直接更新按钮显示，使用API返回的文件夹名称
          const btn = document.querySelector('#sht-create-folder-btn');
          if (btn) {
            btn.textContent = `📁 ${folderName}`;
            btn.title = `当前帖子离线文件夹: ${folderName} (ID: ${folderId})`;
          }
          refreshPan123FolderInfo();
        } else {
          throw new Error(result.message || '创建文件夹失败');
        }
      } catch (error) {
        console.error('创建文件夹失败:', error);
        showErrorModal(`创建文件夹失败: ${error.message}`);
        createBtn.disabled = false;
        createBtn.textContent = '📁 创建文件夹';
      }
    };

    buttonGroup.appendChild(cancelBtn);
    buttonGroup.appendChild(createBtn);
    content.appendChild(buttonGroup);

    modal.querySelector('.modal-content').appendChild(content);

    // 自动聚焦输入框
    setTimeout(() => input.focus(), 100);

    // 支持回车键创建
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        createBtn.click();
      }
    });
  }

  // 更新创建文件夹按钮显示
  async function updateCreateFolderButton() {
    const btn = document.querySelector('#sht-create-folder-btn');
    if (!btn) return;

    const currentFolderId = CFG.pan123CurrentThreadFolder;
    if (currentFolderId) {
      // 先显示加载状态
      btn.textContent = '📁 加载中...';
      btn.title = '正在获取文件夹信息...';

      try {
        const folderName = await getFolderNameById(currentFolderId);
        btn.textContent = `📁 ${folderName}`;
        const defaultId = CFG.pan123UploadDir && String(CFG.pan123UploadDir).trim();
        btn.title = `当前帖子离线文件夹: ${folderName} (ID: ${currentFolderId})` + (defaultId ? `\n默认目录 ID: ${defaultId}` : '');
      } catch (error) {
        console.error('获取文件夹名称失败:', error);
        btn.textContent = `📁 文件夹_${currentFolderId}`;
        const defaultId = CFG.pan123UploadDir && String(CFG.pan123UploadDir).trim();
        btn.title = `当前帖子离线文件夹: 文件夹_${currentFolderId}` + (defaultId ? `\n默认目录 ID: ${defaultId}` : '');
      }
    } else {
      btn.textContent = '📁 123 新建';
      const defaultId = CFG.pan123UploadDir && String(CFG.pan123UploadDir).trim();
      btn.title = defaultId ? `默认目录 ID: ${defaultId}\n点击创建或切换目录` : '尚未设置 123Pan 默认目录，点击创建';
    }
    refreshPan123FolderInfo();
  }

  function checkCurrentThreadFolder115() {
    if (!CFG.pan115ThreadFolders || typeof CFG.pan115ThreadFolders !== 'object') {
      CFG.pan115ThreadFolders = {};
    }
    const currentUrl = getCurrentThreadUrl();
    const folderId = CFG.pan115ThreadFolders[currentUrl];
    if (folderId) {
      CFG.pan115CurrentThreadFolder = folderId;
      return true;
    }
    CFG.pan115CurrentThreadFolder = '';
    return false;
  }

  function saveCurrentThreadFolder115(folderId) {
    if (!folderId) return;
    if (!CFG.pan115ThreadFolders || typeof CFG.pan115ThreadFolders !== 'object') {
      CFG.pan115ThreadFolders = {};
    }
    if (!CFG.pan115FolderNames || typeof CFG.pan115FolderNames !== 'object') {
      CFG.pan115FolderNames = {};
    }
    const currentUrl = getCurrentThreadUrl();
    CFG.pan115ThreadFolders[currentUrl] = folderId;
    CFG.pan115CurrentThreadFolder = folderId;
    refreshPan115FolderInfo();
    saveConfig();
  }

  function clearPan115FolderReference(folderId) {
    if (!folderId) return;
    const idStr = String(folderId);
    if (CFG.pan115FolderNames && typeof CFG.pan115FolderNames === 'object') {
      delete CFG.pan115FolderNames[idStr];
    }
    if (CFG.pan115ThreadFolders && typeof CFG.pan115ThreadFolders === 'object') {
      const currentUrl = getCurrentThreadUrl();
      if (CFG.pan115ThreadFolders[currentUrl] === idStr) {
        delete CFG.pan115ThreadFolders[currentUrl];
        CFG.pan115CurrentThreadFolder = '';
      }
      Object.keys(CFG.pan115ThreadFolders).forEach(url => {
        if (CFG.pan115ThreadFolders[url] === idStr) {
          delete CFG.pan115ThreadFolders[url];
        }
      });
    }
    if (CFG.pan115UploadDir === idStr) {
      CFG.pan115UploadDir = '';
    }
    refreshPan115FolderInfo();
    updateCreateFolderButton115();
    saveConfig();
  }

  async function pan115ValidateDirectory(folderId) {
    if (!folderId) return false;
    try {
      const info = await api115GetFolderInfo(folderId);
      if (!info) return false;
      if (info.state === false) return false;
      return true;
    } catch (error) {
      console.warn('[115 离线] 目录校验失败:', folderId, error);
      return false;
    }
  }

  async function api115CreateFolder(folderName, parentId = null) {
    ensurePan115Config();
    const pid = parentId !== null
      ? String(parentId)
      : (CFG.pan115CurrentThreadFolder && String(CFG.pan115CurrentThreadFolder).trim())
      || (CFG.pan115UploadDir && String(CFG.pan115UploadDir).trim())
      || '0';

    const params = new URLSearchParams();
    params.set('pid', pid || '0');
    params.set('cname', folderName);

    return await pan115Request({
      method: 'POST',
      url: 'https://webapi.115.com/files/add',
      data: params.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      responseType: 'json'
    });
  }

  async function api115GetFolderInfo(folderId) {
    ensurePan115Config();
    const url = `https://webapi.115.com/files/get_info?file_id=${encodeURIComponent(folderId)}`;
    return await pan115Request({
      method: 'GET',
      url,
      responseType: 'json'
    });
  }

  async function get115FolderNameById(folderId) {
    if (!folderId) return '根目录';
    if (CFG.pan115FolderNames && CFG.pan115FolderNames[folderId]) {
      return CFG.pan115FolderNames[folderId];
    }
    let info = null;
    try {
      info = await api115GetFolderInfo(folderId);
    } catch (error) {
      console.error('获取 115 文件夹名称失败:', error);
    }
    const candidates = [
      info?.data?.file_name,
      info?.data?.name,
      info?.file_name,
      info?.name,
      info?.cname,
      info?.folder_name,
      info?.FileName,
      info?.Name
    ].filter(Boolean);
    if (candidates.length > 0) {
      const name = candidates[0];
      if (!CFG.pan115FolderNames || typeof CFG.pan115FolderNames !== 'object') CFG.pan115FolderNames = {};
      CFG.pan115FolderNames[folderId] = name;
      saveConfig();
      return name;
    }
    return `文件夹_${folderId}`;
  }

  function showCreate115FolderDialog() {
    try {
      ensurePan115Config();
    } catch (error) {
      showWarningModal(error.message || '请先在设置中配置 115 离线认证信息');
      return;
    }

    const currentTitle = getCurrentThreadTitle();
    const cleanTitle = cleanTitleForFolder(currentTitle);
    const modal = createModal('创建115离线文件夹', '', 'info');
    const content = document.createElement('div');
    content.style.cssText = 'padding: 20px; text-align: left;';

    const titleLabel = document.createElement('div');
    titleLabel.textContent = '文件夹名称：';
    titleLabel.style.cssText = 'margin-bottom: 8px; font-weight: bold; color: #333;';
    content.appendChild(titleLabel);

    const input = document.createElement('input');
    input.type = 'text';
    input.value = cleanTitle;
    input.placeholder = '请输入文件夹名称';
    input.style.cssText = 'width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; margin-bottom: 15px;';
    content.appendChild(input);

    const optionsGroup = document.createElement('div');
    optionsGroup.style.cssText = 'margin-bottom: 15px;';

    const optionsLabel = document.createElement('div');
    optionsLabel.textContent = '创建后操作：';
    optionsLabel.style.cssText = 'margin-bottom: 8px; font-weight: bold; color: #333;';
    optionsGroup.appendChild(optionsLabel);

    const setAsDefaultOption = document.createElement('label');
    setAsDefaultOption.style.cssText = 'display: block; margin-bottom: 8px; cursor: pointer;';
    const setAsDefaultCheckbox = document.createElement('input');
    setAsDefaultCheckbox.type = 'checkbox';
    setAsDefaultCheckbox.checked = false;
    setAsDefaultCheckbox.style.cssText = 'margin-right: 8px;';
    setAsDefaultOption.appendChild(setAsDefaultCheckbox);
    setAsDefaultOption.appendChild(document.createTextNode('设为默认目录（影响所有新帖子）'));
    optionsGroup.appendChild(setAsDefaultOption);

    const setAsCurrentOption = document.createElement('label');
    setAsCurrentOption.style.cssText = 'display: block; margin-bottom: 8px; cursor: pointer;';
    const setAsCurrentCheckbox = document.createElement('input');
    setAsCurrentCheckbox.type = 'checkbox';
    setAsCurrentCheckbox.checked = true;
    setAsCurrentCheckbox.style.cssText = 'margin-right: 8px;';
    setAsCurrentOption.appendChild(setAsCurrentCheckbox);
    setAsCurrentOption.appendChild(document.createTextNode('设为本帖离线目录（仅当前帖子）'));
    optionsGroup.appendChild(setAsCurrentOption);

    content.appendChild(optionsGroup);

    const parentId = (CFG.pan115CurrentThreadFolder && String(CFG.pan115CurrentThreadFolder).trim())
      || (CFG.pan115UploadDir && String(CFG.pan115UploadDir).trim())
      || '0';
    const helpText = document.createElement('div');
    helpText.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 15px; line-height: 1.4;';
    helpText.innerHTML = `
    <div>• 默认使用当前帖子标题作为文件夹名称，您可以修改</div>
    <div>• 将在目录 ID ${parentId === '0' ? '根目录' : parentId} 下创建该文件夹</div>
    <div>• 可将该目录设置为默认或仅当前帖子使用</div>
  `;
    content.appendChild(helpText);

    const buttonGroup = document.createElement('div');
    buttonGroup.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = 'padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;';
    cancelBtn.onclick = () => modal.remove();

    const createBtn = document.createElement('button');
    createBtn.textContent = '📁 创建文件夹';
    createBtn.style.cssText = 'padding: 8px 16px; background: linear-gradient(135deg, #f6c343 0%, #f49f0a 100%); color: #3b2f09; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';

    createBtn.onclick = async () => {
      const folderName = input.value.trim();
      if (!folderName) {
        showErrorModal('请输入文件夹名称');
        return;
      }

      createBtn.disabled = true;
      createBtn.textContent = '创建中...';

      try {
        const result = await api115CreateFolder(folderName, parentId);
        if (result?.state) {
          const folderId = (result.cid || result.file_id || result.folder_id || '').toString();
          const finalName = result.cname || result.file_name || folderName;
          if (!folderId) throw new Error('未获取到新文件夹ID');

          let message = `文件夹创建成功！\n\n名称：${finalName}\nID：${folderId}\n\n`;

          if (!CFG.pan115FolderNames || typeof CFG.pan115FolderNames !== 'object') {
            CFG.pan115FolderNames = {};
          }
          CFG.pan115FolderNames[folderId] = finalName;

          if (setAsDefaultCheckbox.checked) {
            CFG.pan115UploadDir = folderId;
            message += '已设为默认目录';
          }

          if (setAsCurrentCheckbox.checked) {
            if (!setAsDefaultCheckbox.checked) {
              message += '已设为本帖目录';
            } else {
              message += '，同时设为本帖目录';
            }
            saveCurrentThreadFolder115(folderId);
          } else {
            saveConfig();
          }

          showSuccessModal(message);
          modal.remove();
          updateCreateFolderButton115();
          refreshPan115FolderInfo();
        } else {
          throw new Error(result?.error || result?.errno || '创建文件夹失败');
        }
      } catch (error) {
        console.error('创建 115 文件夹失败:', error);
        showErrorModal(`创建文件夹失败: ${error.message}`);
        createBtn.disabled = false;
        createBtn.textContent = '📁 创建文件夹';
      }
    };

    buttonGroup.appendChild(cancelBtn);
    buttonGroup.appendChild(createBtn);
    content.appendChild(buttonGroup);

    modal.querySelector('.modal-content').appendChild(content);
    setTimeout(() => input.focus(), 100);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') createBtn.click();
    });
  }

  async function updateCreateFolderButton115() {
    const btn = document.querySelector('#sht-create-folder-115-btn');
    if (!btn) return;
    if (!CFG.pan115Enabled) {
      btn.textContent = '📁 115 新建';
      btn.title = '启用 115 离线后可使用此功能';
      return;
    }

    const currentFolderId = CFG.pan115CurrentThreadFolder && String(CFG.pan115CurrentThreadFolder).trim();
    if (currentFolderId) {
      btn.textContent = '📁 115 加载中...';
      btn.title = '正在获取文件夹信息...';
      try {
        const folderName = await get115FolderNameById(currentFolderId);
        btn.textContent = `📁 115 ${folderName} (${currentFolderId})`;
        btn.title = `当前帖子离线目录: ${folderName} (ID: ${currentFolderId})`;
      } catch (error) {
        console.error('获取 115 文件夹名称失败:', error);
        btn.textContent = `📁 115 文件夹_${currentFolderId} (${currentFolderId})`;
        btn.title = `当前帖子离线目录: 文件夹_${currentFolderId}`;
      }
    } else {
      btn.textContent = '📁 115 新建';
      btn.title = CFG.pan115UploadDir
        ? `默认目录 ID: ${CFG.pan115UploadDir}\n点击创建新目录`
        : '尚未设置 115 默认目录，点击创建';
    }
  }

  function update115TaskCountDisplay() {
    const span = document.getElementById('sht-115-task-count');
    if (!span) return;

    const count = typeof CFG.pan115TaskCount === 'number' ? CFG.pan115TaskCount : 0;
    span.textContent = `115任务: ${count}`;
    span.title = `已发送115离线任务数量: ${count}`;
  }

  function refreshPan115FolderInfo() {
    const infoEl = document.getElementById('sht-pan115-folder-info');
    if (!infoEl) return;
    const defaultId = CFG.pan115UploadDir && String(CFG.pan115UploadDir).trim();
    const currentId = CFG.pan115CurrentThreadFolder && String(CFG.pan115CurrentThreadFolder).trim();
    const nameOf = (id) => {
      if (!id) return '';
      if (CFG.pan115FolderNames && CFG.pan115FolderNames[id]) return `${CFG.pan115FolderNames[id]} (${id})`;
      return id;
    };
    const defaultLabel = defaultId ? nameOf(defaultId) : '未设置';
    const currentLabel = currentId ? nameOf(currentId) : '';
    infoEl.textContent = `默认目录: ${defaultLabel}${currentLabel ? ` | 本帖目录: ${currentLabel}` : ''}`;
  }

  function refreshPan123FolderInfo() {
    const infoEl = document.getElementById('sht-pan123-folder-info');
    if (!infoEl) return;
    const defaultId = CFG.pan123UploadDir && String(CFG.pan123UploadDir).trim();
    const currentId = CFG.pan123CurrentThreadFolder && String(CFG.pan123CurrentThreadFolder).trim();
    infoEl.textContent = `默认目录 ID: ${defaultId || '未设置'}${currentId ? ` | 本帖目录 ID: ${currentId}` : ''}`;
  }

  // 解析文件大小
  function parseSize(sizeText) {
    if (!sizeText) return 0;

    const sizeTextUpper = sizeText.toUpperCase();
    const match = sizeTextUpper.match(/^([0-9]+(?:\.[0-9]+)?)\s*(B|KB|MB|GB|TB)?$/);
    if (!match) return 0;

    const val = parseFloat(match[1]);
    const unit = (match[2] || 'B').toUpperCase();
    const multipliers = { 'B': 1, 'KB': 1024, 'MB': 1024 ** 2, 'GB': 1024 ** 3, 'TB': 1024 ** 4 };
    return Math.floor(val * multipliers[unit]);
  }

  // 判断是否为视频文件
  function isVideoFile(filename) {
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.wmv', '.flv', '.mov', '.mpg', '.mpeg', '.m4v', '.3gp', '.webm'];
    const filenameLower = filename.toLowerCase();
    return videoExtensions.some(ext => filenameLower.endsWith(ext));
  }

  // 文件过滤
  function selectFiles(files) {
    const minSize = parseSize(CFG.pan123MinSize);
    const maxSize = parseSize(CFG.pan123MaxSize);
    const videoMinSize = parseSize(CFG.pan123VideoMinSize);
    const includeExts = CFG.pan123IncludeExt.split(',').map(ext => ext.trim().toLowerCase());
    const excludeExts = CFG.pan123ExcludeExt.split(',').map(ext => ext.trim().toLowerCase());

    const candidates = [];
    const excludedFiles = [];

    for (const file of files) {
      const name = file.name || '';
      const size = parseInt(file.size || 0);
      const fileId = parseInt(file.id);

      // 检查扩展名
      const hasIncludeExt = includeExts.length === 0 || includeExts.some(ext => name.toLowerCase().endsWith(ext));
      const hasExcludeExt = excludeExts.some(ext => name.toLowerCase().endsWith(ext));

      if (!hasIncludeExt) {
        excludedFiles.push({ name, reason: '不在包含扩展名列表中' });
        continue;
      }

      if (hasExcludeExt) {
        excludedFiles.push({ name, reason: '在排除扩展名列表中' });
        continue;
      }

      // 大小过滤
      if (isVideoFile(name)) {
        if (videoMinSize && size < videoMinSize) {
          excludedFiles.push({ name, reason: `视频文件小于 ${Math.floor(videoMinSize / (1024 * 1024))}MB` });
          continue;
        }
      } else {
        if (minSize && size < minSize) {
          excludedFiles.push({ name, reason: `文件小于 ${Math.floor(minSize / (1024 * 1024))}MB` });
          continue;
        }
      }

      if (maxSize && size > maxSize) {
        excludedFiles.push({ name, reason: `文件大于 ${Math.floor(maxSize / (1024 * 1024))}MB` });
        continue;
      }

      candidates.push({ size, fileId });
    }

    if (excludedFiles.length > 0) {
      console.log('排除的文件:', excludedFiles.slice(0, 5));
    }

    if (candidates.length === 0) {
      return [];
    }

    if (CFG.pan123PickLargest) {
      const largest = candidates.reduce((max, current) => current.size > max.size ? current : max);
      return [largest.fileId];
    }

    return candidates.map(c => c.fileId);
  }

  // 检查任务是否在离线列表中
  async function checkTaskInOfflineList(resourceName) {
    try {
      const offlineData = await apiGetOfflineTasks();
      if (offlineData.code !== 0) {
        console.warn('获取离线任务列表失败:', offlineData.message);
        return null;
      }

      const taskList = offlineData.data?.list || [];

      for (const task of taskList) {
        const taskName = task.name || '';
        const taskId = task.task_id || '';
        const status = task.status || '';

        // 精确匹配或文件名匹配
        if (taskName === resourceName || taskName.startsWith(resourceName)) {
          console.log(`找到任务: ${resourceName} -> ${taskName} (ID: ${taskId}, 状态: ${status})`);
          return task;
        }

        // 去掉扩展名后匹配
        const resourceBase = resourceName.split('.')[0];
        const taskBase = taskName.split('.')[0];
        if (resourceBase === taskBase) {
          console.log(`基础名匹配找到任务: ${resourceName} -> ${taskName} (ID: ${taskId}, 状态: ${status})`);
          return task;
        }
      }

      console.log(`任务不在离线列表中: ${resourceName}`);
      return null;
    } catch (error) {
      console.error('检查任务状态失败:', error);
      return null;
    }
  }

  // 获取离线任务统计信息
  async function getOfflineTaskStats() {
    try {
      const offlineData = await apiGetOfflineTasks();
      if (offlineData.code !== 0) {
        return { total: 0, running: 0, completed: 0, failed: 0 };
      }

      const taskList = offlineData.data?.list || [];
      const stats = {
        total: taskList.length,
        running: 0,
        completed: 0,
        failed: 0
      };

      taskList.forEach(task => {
        switch (task.status) {
          case 1: // 运行中
            stats.running++;
            break;
          case 2: // 已完成
            stats.completed++;
            break;
          case 3: // 失败
            stats.failed++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('获取离线任务统计失败:', error);
      return { total: 0, running: 0, completed: 0, failed: 0 };
    }
  }

  // 处理秒离线检测结果
  async function handleInstantOfflineResult(resourceName, selectedFileIds, isInstantOffline, actionTaken = '') {
    const stats = await getOfflineTaskStats();

    let message = `离线任务提交成功！\n`;
    message += `资源: ${resourceName}\n`;
    message += `选择文件: ${selectedFileIds.length} 个\n\n`;

    if (isInstantOffline) {
      message += `✅ 秒离线成功！\n`;
      message += `文件已直接下载到123Pan\n`;
    } else {
      message += `⏳ 正在离线下载中...\n`;
      if (actionTaken) {
        message += `处理方式: ${actionTaken}\n`;
      }
    }

    message += `\n当前离线任务状态:\n`;
    message += `总计: ${stats.total} 个\n`;
    message += `运行中: ${stats.running} 个\n`;
    message += `已完成: ${stats.completed} 个\n`;
    message += `失败: ${stats.failed} 个`;

    return message;
  }

  // 显示秒离线确认对话框
  function showInstantOfflineConfirmDialog(resourceName, taskId) {
    return new Promise((resolve) => {
      const modal = createModal(
        '秒离线失败',
        `资源 "${resourceName}" 未能秒离线成功，是否取消该任务？\n\n取消后任务将从离线列表中移除。`,
        'warning'
      );

      // 修改按钮
      const buttonContainer = modal.querySelector('div:last-child');
      buttonContainer.innerHTML = '';

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '取消任务';
      cancelBtn.style.cssText = 'padding: 8px 24px; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; background: #dc3545; color: white; margin-right: 12px;';
      cancelBtn.addEventListener('click', () => {
        modal.remove();
        resolve(true); // 取消任务
      });

      const keepBtn = document.createElement('button');
      keepBtn.textContent = '保留任务';
      keepBtn.style.cssText = 'padding: 8px 24px; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; background: #28a745; color: white;';
      keepBtn.addEventListener('click', () => {
        modal.remove();
        resolve(false); // 保留任务
      });

      buttonContainer.appendChild(cancelBtn);
      buttonContainer.appendChild(keepBtn);
    });
  }

  // 计算 torrent 文件的 infohash
  async function calculateInfohash(torrentBlob) {
    try {
      // 将 Blob 转换为 ArrayBuffer
      const arrayBuffer = await torrentBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // 简化的 bencode 解析器
      function bdecode(data, i = 0) {
        if (data[i] === 105) { // 'i'
          let j = i + 1;
          while (data[j] !== 101) j++; // 找到 'e'
          return [parseInt(String.fromCharCode(...data.slice(i + 1, j))), j + 1];
        }
        if (data[i] === 108) { // 'l'
          i++;
          const out = [];
          while (data[i] !== 101) { // 不是 'e'
            const [v, newI] = bdecode(data, i);
            out.push(v);
            i = newI;
          }
          return [out, i + 1];
        }
        if (data[i] === 100) { // 'd'
          i++;
          const d = {};
          while (data[i] !== 101) { // 不是 'e'
            const [k, newI] = bdecode(data, i);
            const [v, newI2] = bdecode(data, newI);
            d[k] = v;
            i = newI2;
          }
          return [d, i + 1];
        }
        // 字符串
        let j = i;
        while (data[j] !== 58) j++; // 找到 ':'
        const length = parseInt(String.fromCharCode(...data.slice(i, j)));
        const start = j + 1;
        const end = start + length;
        return [data.slice(start, end), end];
      }

      // 简化的 bencode 编码器
      function bencode(obj) {
        if (typeof obj === 'number') {
          return new Uint8Array([...'i'.split('').map(c => c.charCodeAt(0)), ...obj.toString().split('').map(c => c.charCodeAt(0)), ...'e'.split('').map(c => c.charCodeAt(0))]);
        }
        if (obj instanceof Uint8Array) {
          const length = obj.length.toString();
          return new Uint8Array([...length.split('').map(c => c.charCodeAt(0)), 58, ...obj]);
        }
        if (Array.isArray(obj)) {
          const result = [108]; // 'l'
          for (const item of obj) {
            result.push(...bencode(item));
          }
          result.push(101); // 'e'
          return new Uint8Array(result);
        }
        if (typeof obj === 'object' && obj !== null) {
          const result = [100]; // 'd'
          const keys = Object.keys(obj).sort();
          for (const key of keys) {
            const keyBytes = new Uint8Array(key.split('').map(c => c.charCodeAt(0)));
            result.push(...bencode(keyBytes));
            result.push(...bencode(obj[key]));
          }
          result.push(101); // 'e'
          return new Uint8Array(result);
        }
        return new Uint8Array();
      }

      // 解析 torrent 文件
      const [torrent, _] = bdecode(uint8Array, 0);
      if (!torrent || !torrent.info) {
        throw new Error('无效的 torrent 文件');
      }

      // 编码 info 部分
      const infoEncoded = bencode(torrent.info);

      // 计算 SHA1 哈希
      const hashBuffer = await crypto.subtle.digest('SHA-1', infoEncoded);
      const hashArray = new Uint8Array(hashBuffer);

      // 转换为十六进制字符串
      const hashHex = Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      console.log('计算得到 infohash:', hashHex);
      return hashHex;

    } catch (error) {
      console.error('计算 infohash 失败:', error);
      // 如果计算失败，尝试从磁力链接中提取
      throw new Error(`计算 infohash 失败: ${error.message}`);
    }
  }

  // 创建批量发送进度显示
  function createBatchProgressModal(totalTasks) {
    // 移除已存在的进度modal
    const existingModal = document.querySelector('#sht-batch-progress-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'sht-batch-progress-modal';
    modal.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
`;

    // 标题
    const titleEl = document.createElement('h3');
    titleEl.textContent = '批量发送到123Pan';
    titleEl.style.cssText = `
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

    // 进度信息
    const progressInfo = document.createElement('div');
    progressInfo.style.cssText = `
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
`;
    progressInfo.innerHTML = `
  <div>总计: <strong>${totalTasks}</strong> 个任务</div>
  <div>当前: <strong id="current-task">0</strong> / ${totalTasks}</div>
  <div>成功: <strong id="success-count" style="color: #28a745;">0</strong> 个</div>
  <div>失败: <strong id="fail-count" style="color: #dc3545;">0</strong> 个</div>
`;

    // 进度条
    const progressBarContainer = document.createElement('div');
    progressBarContainer.style.cssText = `
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 0 20px 0;
`;

    const progressBar = document.createElement('div');
    progressBar.id = 'batch-progress-bar';
    progressBar.style.cssText = `
  height: 100%;
  background: linear-gradient(90deg, #007bff, #28a745);
  width: 0%;
  transition: width 0.3s ease;
`;
    progressBarContainer.appendChild(progressBar);

    // 当前任务状态
    const currentStatus = document.createElement('div');
    currentStatus.id = 'current-status';
    currentStatus.style.cssText = `
  font-size: 12px;
  color: #666;
  margin: 0 0 10px 0;
  min-height: 16px;
`;

    // 取消按钮
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消批量发送';
    cancelBtn.style.cssText = `
  padding: 8px 16px;
  border: 1px solid #dc3545;
  border-radius: 4px;
  background: white;
  color: #dc3545;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
`;

    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.background = '#dc3545';
      cancelBtn.style.color = 'white';
    });
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.background = 'white';
      cancelBtn.style.color = '#dc3545';
    });

    modalContent.appendChild(titleEl);
    modalContent.appendChild(progressInfo);
    modalContent.appendChild(progressBarContainer);
    modalContent.appendChild(currentStatus);
    modalContent.appendChild(cancelBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    return {
      modal,
      updateProgress: (current, success, fail, status) => {
        document.getElementById('current-task').textContent = current;
        document.getElementById('success-count').textContent = success;
        document.getElementById('fail-count').textContent = fail;
        document.getElementById('current-status').textContent = status || '';
        const percentage = (current / totalTasks) * 100;
        document.getElementById('batch-progress-bar').style.width = `${percentage}%`;
      },
      close: () => modal.remove(),
      setCancelHandler: (handler) => {
        cancelBtn.addEventListener('click', handler);
      }
    };
  }

  // 显示批量发送结果（可滚动文本块）
  function showBatchResultModal(results, successCount, failCount, totalTasks) {
    // 移除已存在的modal
    const existingModal = document.querySelector('#sht-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'sht-modal';
    modal.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
`;

    // 标题
    const titleEl = document.createElement('h3');
    titleEl.textContent = '批量发送结果';
    titleEl.style.cssText = `
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

    // 统计信息
    const statsEl = document.createElement('div');
    statsEl.style.cssText = `
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 10px;
`;
    statsEl.innerHTML = `
  <div>总计: <strong>${totalTasks}</strong> 个</div>
  <div style="color: #28a745;">成功: <strong>${successCount}</strong> 个</div>
  <div style="color: #dc3545;">失败: <strong>${failCount}</strong> 个</div>
`;

    // 可滚动的结果内容
    const scrollContainer = document.createElement('div');
    scrollContainer.style.cssText = `
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 12px;
  margin: 0 0 20px 0;
  text-align: left;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  background: #f8f9fa;
  max-height: 400px;
`;

    // 构建结果内容
    let content = '';

    if (successCount > 0) {
      content += `<div style="color: #28a745; font-weight: bold; margin-bottom: 10px;">✅ 成功任务 (${successCount} 个):</div>`;
      content += '<div style="border-bottom: 2px solid #28a745; margin-bottom: 15px;"></div>';
      results.filter(r => r.success).forEach((r, index) => {
        content += `<div style="margin-bottom: 12px; padding: 8px; background: #f8fff9; border-left: 3px solid #28a745; border-radius: 4px;">`;
        content += `<div style="color: #28a745; font-weight: bold;">✅ ${index + 1}. ${r.title}</div>`;
        if (r.result) {
          content += `<div style="margin-left: 20px; color: #666; font-size: 12px;">`;
          content += `<div>📁 文件数: ${r.result.fileCount} 个</div>`;
          content += `<div>📊 状态: ${r.result.isInstantOffline ? '⚡ 秒离线成功' : '⏳ 正在下载'}</div>`;
          if (r.result.actionTaken) {
            content += `<div>🔧 处理: ${r.result.actionTaken}</div>`;
          }
          content += `</div>`;
        }
        content += `</div>`;
      });
    }

    if (failCount > 0) {
      content += `<div style="color: #dc3545; font-weight: bold; margin: 20px 0 10px 0;">❌ 失败任务 (${failCount} 个):</div>`;
      content += '<div style="border-bottom: 2px solid #dc3545; margin-bottom: 15px;"></div>';
      results.filter(r => !r.success).forEach((r, index) => {
        content += `<div style="margin-bottom: 12px; padding: 8px; background: #fff5f5; border-left: 3px solid #dc3545; border-radius: 4px;">`;
        content += `<div style="color: #dc3545; font-weight: bold;">❌ ${index + 1}. ${r.title}</div>`;
        content += `<div style="margin-left: 20px; color: #666; font-size: 12px;">`;
        content += `<div>⚠️ 错误: ${r.error}</div>`;
        content += `</div></div>`;
      });
    }

    // 使用innerHTML来显示HTML内容
    scrollContainer.innerHTML = content;

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
  display: flex;
  gap: 12px;
  justify-content: center;
`;

    // 确定按钮
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确定';
    confirmBtn.style.cssText = `
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  background: #007bff;
  color: white;
`;

    confirmBtn.addEventListener('mouseenter', () => {
      confirmBtn.style.opacity = '0.9';
    });
    confirmBtn.addEventListener('mouseleave', () => {
      confirmBtn.style.opacity = '1';
    });

    // 关闭modal
    const closeModal = () => {
      modal.remove();
    };

    confirmBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // ESC键关闭
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    buttonContainer.appendChild(confirmBtn);
    modalContent.appendChild(titleEl);
    modalContent.appendChild(statsEl);
    modalContent.appendChild(scrollContainer);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // 聚焦到确定按钮
    confirmBtn.focus();

    return modal;
  }

  // 批量处理磁力链接离线下载
  async function processBatchMagnetOffline(magnetUrls) {
    if (!CFG.pan123Enabled) {
      showWarningModal('请先在设置中启用 123Pan 功能并配置认证信息');
      return;
    }

    const results = [];
    let successCount = 0;
    let failCount = 0;
    let cancelled = false;

    console.log(`开始批量处理 ${magnetUrls.length} 个磁力链接`);
    const totalTasks = magnetUrls.length;
    const intervalMs = CFG.pan123BatchSendInterval || 2000;

    // 创建进度显示
    const progressModal = createBatchProgressModal(totalTasks);

    // 设置取消处理
    progressModal.setCancelHandler(() => {
      cancelled = true;
      progressModal.close();
      showInfoModal('批量发送已取消');
    });

    try {
      for (let i = 0; i < magnetUrls.length; i++) {
        // 检查是否已取消
        if (cancelled) {
          console.log('批量发送已取消');
          break;
        }

        const magnetUrl = magnetUrls[i];
        // 使用简单的标题，等待API返回真实文件名
        const title = `任务_${i + 1}`;

        console.log(`处理第 ${i + 1}/${totalTasks} 个: ${title}`);

        try {
          // 先解析磁力链接获取任务名称
          const resolveResult = await apiResolveMagnet(magnetUrl);
          if (resolveResult.code !== 0) {
            throw new Error(`解析磁力链接失败: ${resolveResult.message}`);
          }

          const resourceList = resolveResult.data?.list || [];
          if (resourceList.length === 0) {
            throw new Error('没有找到可用的资源');
          }

          const realTitle = resourceList[0].name || title;

          // 更新进度显示为真实任务名称
          progressModal.updateProgress(i + 1, successCount, failCount, `正在处理: ${realTitle}`);

          // 继续处理离线下载
          const result = await processSingleMagnetOffline(magnetUrl, title);

          // 最终更新进度显示
          progressModal.updateProgress(i + 1, successCount, failCount, `处理完成: ${realTitle}`);

          results.push({
            title: realTitle, // 使用API返回的真实文件名
            success: true,
            result: result
          });
          successCount++;
          console.log(`第 ${i + 1} 个处理成功: ${realTitle}`);
        } catch (error) {
          console.error(`第 ${i + 1} 个处理失败: ${title}`, error);
          results.push({
            title,
            success: false,
            error: error.message
          });
          failCount++;
        }

        // 添加间隔，避免API请求过于频繁
        if (i < magnetUrls.length - 1 && !cancelled) {
          const remainingTasks = totalTasks - i - 1;
          const estimatedTime = Math.ceil((remainingTasks * intervalMs) / 1000);
          progressModal.updateProgress(i + 1, successCount, failCount, `等待 ${intervalMs}ms 后处理下一个... (剩余 ${remainingTasks} 个任务，预计还需 ${estimatedTime} 秒)`);
          console.log(`等待 ${intervalMs}ms 后处理下一个... (剩余 ${remainingTasks} 个任务，预计还需 ${estimatedTime} 秒)`);
          await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
      }
    } finally {
      // 关闭进度显示
      progressModal.close();
    }

    // 显示批量处理结果（使用可滚动的文本块）
    showBatchResultModal(results, successCount, failCount, totalTasks);
    return results;
  }

  // 处理单个磁力链接离线下载（不显示Modal）
  async function processSingleMagnetOffline(magnetUrl, title) {
    if (!CFG.pan123Enabled) {
      throw new Error('123Pan 功能未启用');
    }

    try {
      console.log('开始处理磁力链接离线下载:', title);

      // 1. 通过磁力链接解析任务
      console.log('解析磁力链接...');
      const resolveResult = await apiResolveMagnet(magnetUrl);
      console.log('解析结果:', resolveResult);

      if (resolveResult.code !== 0) {
        throw new Error(`解析磁力链接失败: ${resolveResult.message}`);
      }

      const resourceList = resolveResult.data?.list || [];
      if (resourceList.length === 0) {
        throw new Error('没有找到可用的资源');
      }

      const item = resourceList[0];
      const resourceId = parseInt(item.id || item.resource_id || 0);
      const files = item.files || [];

      // 从API响应中获取真实文件名
      const realTitle = item.name || title;

      // 2. 选择文件
      console.log('选择文件...');
      const selectedFileIds = selectFiles(files);
      if (selectedFileIds.length === 0) {
        throw new Error('没有文件满足过滤条件');
      }

      // 3. 提交离线任务
      console.log('提交离线任务...');
      const submitResult = await apiSubmit(resourceId, selectedFileIds);
      if (submitResult.code !== 0 || submitResult.message !== 'ok') {
        throw new Error(`提交失败: ${submitResult.message}`);
      }

      console.log('离线任务提交成功:', submitResult);

      // 4. 等待并检查秒离线状态
      console.log('等待秒离线检查...');
      await new Promise(resolve => setTimeout(resolve, CFG.pan123InstantOfflineCheckDelay));

      const taskName = item.name;
      const offlineTask = await checkTaskInOfflineList(taskName);
      const isInstantOffline = !offlineTask;
      let actionTaken = '';

      if (offlineTask) {
        console.log('未秒离线成功，任务仍在离线列表中:', taskName);

        // 根据配置处理秒离线失败
        if (CFG.pan123InstantOfflineAction === 'auto_cancel') {
          console.log('自动取消任务:', taskName);
          await apiCancelOfflineTask(offlineTask.task_id);
          actionTaken = '已自动取消任务';
        } else if (CFG.pan123InstantOfflineAction === 'ask_user') {
          // 批量模式下跳过用户询问，直接保留任务
          console.log('批量模式：保留任务:', taskName);
          actionTaken = '保留任务继续下载';
        } else {
          console.log('保留任务:', taskName);
          actionTaken = '保留任务继续下载';
        }
      } else {
        console.log('秒离线成功:', taskName);
      }

      return {
        taskName: realTitle || taskName,
        fileCount: selectedFileIds.length,
        isInstantOffline,
        actionTaken
      };

    } catch (error) {
      console.error('处理磁力链接离线下载失败:', error);
      throw error;
    }
  }

  // 处理磁力链接离线下载（保持原有接口，用于单个发送）
  async function processMagnetOffline(magnetUrl, title) {
    if (!CFG.pan123Enabled) {
      alert('请先在设置中启用 123Pan 功能并配置认证信息');
      return;
    }

    try {
      console.log('开始处理磁力链接离线下载:', title);

      // 1. 通过磁力链接解析任务
      console.log('解析磁力链接...');
      const resolveResult = await apiResolveMagnet(magnetUrl);
      console.log('解析结果:', resolveResult);

      if (resolveResult.code !== 0) {
        throw new Error(`解析磁力链接失败: ${resolveResult.message}`);
      }

      const resourceList = resolveResult.data?.list || [];
      if (resourceList.length === 0) {
        throw new Error('没有找到可用的资源');
      }

      const item = resourceList[0];
      const resourceId = parseInt(item.id || item.resource_id || 0);
      const files = item.files || [];

      // 2. 选择文件
      console.log('选择文件...');
      const selectedFileIds = selectFiles(files);
      if (selectedFileIds.length === 0) {
        throw new Error('没有文件满足过滤条件');
      }

      // 3. 提交离线任务
      console.log('提交离线任务...');
      const submitResult = await apiSubmit(resourceId, selectedFileIds);
      if (submitResult.code !== 0 || submitResult.message !== 'ok') {
        throw new Error(`提交失败: ${submitResult.message}`);
      }

      console.log('离线任务提交成功:', submitResult);

      // 4. 检查秒离线
      setTimeout(async () => {
        try {
          const taskName = item.name;
          const offlineTask = await checkTaskInOfflineList(taskName);
          const isInstantOffline = !offlineTask;
          let actionTaken = '';

          if (offlineTask) {
            console.log('未秒离线成功，任务仍在离线列表中:', taskName);

            // 根据配置处理秒离线失败
            if (CFG.pan123InstantOfflineAction === 'auto_cancel') {
              console.log('自动取消任务:', taskName);
              await apiCancelOfflineTask(offlineTask.task_id);
              actionTaken = '已自动取消任务';
            } else if (CFG.pan123InstantOfflineAction === 'ask_user') {
              const shouldCancel = await showInstantOfflineConfirmDialog(taskName, offlineTask.task_id);
              if (shouldCancel) {
                console.log('用户选择取消任务:', taskName);
                await apiCancelOfflineTask(offlineTask.task_id);
                actionTaken = '用户选择取消任务';
              } else {
                console.log('用户选择保留任务:', taskName);
                actionTaken = '用户选择保留任务';
              }
            } else {
              console.log('保留任务:', taskName);
              actionTaken = '保留任务继续下载';
            }
          } else {
            console.log('秒离线成功:', taskName);
          }

          // 显示详细的结果信息
          const message = await handleInstantOfflineResult(taskName, selectedFileIds, isInstantOffline, actionTaken);
          showSuccessModal(message);

        } catch (error) {
          console.error('检查秒离线状态失败:', error);
          showErrorModal(`检查秒离线状态失败: ${error.message}`);
        }
      }, CFG.pan123InstantOfflineCheckDelay);

    } catch (error) {
      console.error('处理磁力链接离线下载失败:', error);
      showErrorModal(`离线下载失败: ${error.message}`);
    }
  }

  // 为torrent文件添加123Pan按钮
  function addTorrent123PanButton(bar, filename, torrentUrl) {
    // 检查是否已经添加过按钮
    if (bar.querySelector('.sht-torrent-123pan-btn')) return;

    const btn123Pan = document.createElement('button');
    btn123Pan.textContent = '发送到123Pan';
    btn123Pan.className = 'sht-torrent-123pan-btn';
    btn123Pan.style.cssText = 'padding:2px 8px;cursor:pointer;background:#007cba;color:white;border:none;border-radius:3px';

    btn123Pan.addEventListener('click', async () => {
      if (!CFG.pan123Token || !CFG.pan123LoginUuid || !CFG.pan123Cookie) {
        alert('请先在设置中配置 123Pan 认证信息');
        return;
      }

      btn123Pan.textContent = '发送中...';
      btn123Pan.disabled = true;

      try {
        // 使用GM_xmlhttpRequest下载torrent文件（绕过CORS）
        const torrentBlob = await downloadFileWithGM(torrentUrl);
        const title = filename.replace(/\.torrent$/i, '');

        // 处理torrent文件离线下载
        await processTorrentOffline(torrentBlob, title);
        alert('发送到123Pan成功！');
      } catch (error) {
        console.error('发送到123Pan失败:', error);
        alert(`发送失败: ${error.message}`);
      } finally {
        btn123Pan.textContent = '发送到123Pan';
        btn123Pan.disabled = false;
      }
    });

    bar.appendChild(btn123Pan);
  }

  // 处理torrent文件离线下载
  async function processTorrentOffline(torrentBlob, title) {
    if (!CFG.pan123Enabled) {
      alert('请先在设置中启用 123Pan 功能并配置认证信息');
      return;
    }

    try {
      console.log('开始处理torrent文件离线下载:', title);

      // 1. 上传 torrent 到 123Pan
      console.log('上传 torrent 文件...');
      const uploadResult = await apiUploadTorrent(torrentBlob, `${title}.torrent`);
      console.log('上传结果:', uploadResult);

      if (uploadResult.code !== 0) {
        throw new Error(`上传 torrent 失败: ${uploadResult.message}`);
      }

      const infohash = uploadResult.data.info_hash;
      console.log('上传成功，infohash:', infohash);

      // 2. 解析文件列表
      console.log('解析文件列表...');
      const resolveResult = await apiResolve(infohash);
      console.log('解析结果:', resolveResult);

      if (resolveResult.code !== 0) {
        throw new Error(`解析文件列表失败: ${resolveResult.message}`);
      }

      const resourceList = resolveResult.data?.list || [];
      if (resourceList.length === 0) {
        throw new Error('没有找到可用的资源');
      }

      const resource = resourceList[0];
      const resourceId = parseInt(resource.id || resource.resource_id || 0);
      const files = resource.files || [];

      // 3. 文件过滤和选择
      console.log('选择文件...');
      const selectedFileIds = selectFiles(files);
      console.log('选择的文件:', selectedFileIds);

      if (selectedFileIds.length === 0) {
        throw new Error('没有文件满足过滤条件');
      }

      // 4. 提交离线任务
      console.log('提交离线任务...');
      const submitResult = await apiSubmit(resourceId, selectedFileIds);
      console.log('提交结果:', submitResult);

      if (submitResult.code !== 0) {
        throw new Error(`提交离线任务失败: ${submitResult.message}`);
      }

      // 5. 检查任务状态（延迟检查）
      setTimeout(async () => {
        try {
          const taskName = resource.name || title;
          const offlineTask = await checkTaskInOfflineList(taskName);
          const isInstantOffline = !offlineTask;
          let actionTaken = '';

          if (offlineTask) {
            console.log('未秒离线成功，任务仍在离线列表中:', taskName);

            // 根据配置处理秒离线失败
            if (CFG.pan123InstantOfflineAction === 'auto_cancel') {
              console.log('自动取消任务:', taskName);
              await apiCancelOfflineTask(offlineTask.task_id);
              actionTaken = '已自动取消任务';
            } else if (CFG.pan123InstantOfflineAction === 'ask_user') {
              const shouldCancel = await showInstantOfflineConfirmDialog(taskName, offlineTask.task_id);
              if (shouldCancel) {
                console.log('用户选择取消任务:', taskName);
                await apiCancelOfflineTask(offlineTask.task_id);
                actionTaken = '用户选择取消任务';
              } else {
                console.log('用户选择保留任务:', taskName);
                actionTaken = '用户选择保留任务';
              }
            } else {
              console.log('保留任务:', taskName);
              actionTaken = '保留任务继续下载';
            }
          } else {
            console.log('秒离线成功:', taskName);
          }

          // 显示详细的结果信息
          const message = await handleInstantOfflineResult(taskName, selectedFileIds, isInstantOffline, actionTaken);
          showSuccessModal(message);

        } catch (error) {
          console.error('检查任务状态失败:', error);
          showErrorModal(`检查任务状态失败: ${error.message}`);
        }
      }, CFG.pan123InstantOfflineCheckDelay);

    } catch (error) {
      console.error('处理torrent文件离线下载失败:', error);
      showErrorModal(`离线下载失败: ${error.message}`);
    }
  }

  // 显示磁力链接选择对话框
  function showMagnetSelectionDialog(magnetUrls) {
    // 创建对话框
    const dialog = document.createElement('div');
    dialog.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 10000; display: flex;
    align-items: center; justify-content: center; font-family: Arial, sans-serif;
  `;

    const panel = document.createElement('div');
    panel.style.cssText = `
    background: white; border-radius: 8px; padding: 20px; max-width: 600px;
    max-height: 80vh; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  `;

    const title = document.createElement('h3');
    title.textContent = '选择要发送到123Pan的磁力链接';
    title.style.cssText = 'margin: 0 0 15px 0; color: #333;';

    const listContainer = document.createElement('div');
    listContainer.style.cssText = 'max-height: 400px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px;';

    const magnetList = document.createElement('div');
    magnetList.style.cssText = 'padding: 10px;';

    // 创建每个磁力链接的选项
    magnetUrls.forEach((magnetUrl, index) => {
      const item = document.createElement('div');
      item.style.cssText = 'display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #eee;';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true; // 默认全选
      checkbox.style.marginRight = '10px';

      const label = document.createElement('label');
      label.style.cssText = 'flex: 1; font-size: 12px; word-break: break-all; cursor: pointer;';

      // 提取标题
      const titleMatch = magnetUrl.match(/dn=([^&]+)/);
      const title = titleMatch ? decodeURIComponent(titleMatch[1]) : `磁力链接 ${index + 1}`;
      label.textContent = title;

      const sendBtn = document.createElement('button');
      sendBtn.textContent = '发送';
      sendBtn.style.cssText = 'padding: 4px 8px; background: #007cba; color: white; border: none; border-radius: 3px; cursor: pointer; margin-left: 8px;';
      sendBtn.addEventListener('click', async () => {
        if (!CFG.pan123Token || !CFG.pan123LoginUuid || !CFG.pan123Cookie) {
          alert('请先在设置中配置 123Pan 认证信息');
          return;
        }

        sendBtn.textContent = '发送中...';
        sendBtn.disabled = true;

        try {
          await processMagnetOffline(magnetUrl, title);
        } catch (error) {
          console.error('发送失败:', error);
          showErrorModal(`发送失败: ${error.message}`);
        } finally {
          sendBtn.textContent = '发送';
          sendBtn.disabled = false;
        }
      });

      item.appendChild(checkbox);
      item.appendChild(label);
      item.appendChild(sendBtn);
      magnetList.appendChild(item);
    });

    listContainer.appendChild(magnetList);

    // 按钮区域
    const buttonArea = document.createElement('div');
    buttonArea.style.cssText = 'margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;';

    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = '全选';
    selectAllBtn.style.cssText = 'padding: 6px 12px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;';
    selectAllBtn.addEventListener('click', () => {
      const checkboxes = magnetList.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = true);
    });

    const selectNoneBtn = document.createElement('button');
    selectNoneBtn.textContent = '全不选';
    selectNoneBtn.style.cssText = 'padding: 6px 12px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;';
    selectNoneBtn.addEventListener('click', () => {
      const checkboxes = magnetList.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
    });

    const batchSendBtn = document.createElement('button');
    batchSendBtn.textContent = '批量发送选中';
    batchSendBtn.style.cssText = 'padding: 6px 12px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer;';
    batchSendBtn.addEventListener('click', async () => {
      if (!CFG.pan123Token || !CFG.pan123LoginUuid || !CFG.pan123Cookie) {
        showWarningModal('请先在设置中配置 123Pan 认证信息');
        return;
      }

      const checkboxes = magnetList.querySelectorAll('input[type="checkbox"]');
      const selectedUrls = [];
      checkboxes.forEach((cb, index) => {
        if (cb.checked) {
          selectedUrls.push(magnetUrls[index]);
        }
      });

      if (selectedUrls.length === 0) {
        showWarningModal('请至少选择一个磁力链接');
        return;
      }

      batchSendBtn.textContent = '批量发送中...';
      batchSendBtn.disabled = true;

      try {
        await processBatchMagnetOffline(selectedUrls);
        dialog.remove();
      } catch (error) {
        console.error('批量发送失败:', error);
        showErrorModal(`批量发送失败: ${error.message}`);
      } finally {
        batchSendBtn.textContent = '批量发送选中';
        batchSendBtn.disabled = false;
      }
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = 'padding: 6px 12px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;';
    cancelBtn.addEventListener('click', () => dialog.remove());

    buttonArea.appendChild(selectAllBtn);
    buttonArea.appendChild(selectNoneBtn);
    buttonArea.appendChild(batchSendBtn);
    buttonArea.appendChild(cancelBtn);

    panel.appendChild(title);
    panel.appendChild(listContainer);
    panel.appendChild(buttonArea);
    dialog.appendChild(panel);
    document.body.appendChild(dialog);

    // 点击背景关闭
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.remove();
    });
  }

  // 创建浮动滚动按钮
  function createFloatingScrollButtons() {
    // 检查是否已经存在
    if (document.querySelector('#sht-floating-scroll-buttons')) return;

    const container = document.createElement('div');
    container.id = 'sht-floating-scroll-buttons';
    container.style.cssText = `
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  `;

    // 去顶部按钮
    const topBtn = document.createElement('button');
    topBtn.innerHTML = '↑';
    topBtn.title = '去顶部';
    topBtn.style.cssText = `
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: #007cba;
    color: white;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

    // 去底部按钮
    const bottomBtn = document.createElement('button');
    bottomBtn.innerHTML = '↓';
    bottomBtn.title = '去底部';
    bottomBtn.style.cssText = topBtn.style.cssText;

    // 悬停效果
    const addHoverEffect = (btn) => {
      btn.addEventListener('mouseenter', () => {
        btn.style.opacity = '1';
        btn.style.transform = 'scale(1.1)';
        container.style.opacity = '1';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.opacity = '0.8';
        btn.style.transform = 'scale(1)';
        container.style.opacity = '0.8';
      });
    };

    addHoverEffect(topBtn);
    addHoverEffect(bottomBtn);

    // 点击事件
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    bottomBtn.addEventListener('click', () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });

    container.appendChild(topBtn);
    container.appendChild(bottomBtn);
    document.body.appendChild(container);
  }

  // 页面加载完成后创建浮动按钮
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createFloatingScrollButtons);
  } else {
    createFloatingScrollButtons();
  }

  // ===== 自动签到功能模块 =====
  function initAutoSign() {
    // 只在论坛首页、网站首页或签到页面显示
    const isHomePage = location.href === 'https://sehuatang.org/' ||
      location.href === 'http://sehuatang.org/' ||
      (location.href.includes('forum.php') && !location.href.includes('mod='));
    const isSignPage = location.href.includes('plugin.php?id=dd_sign');

    if (!isHomePage && !isSignPage) {
      return;
    }

    // 添加签到按钮到聚合区域
    addSignButtonToAggregator();

    // 如果是在签到页面且有 auto_sign 参数，自动执行签到
    if (isSignPage && new URLSearchParams(window.location.search).get('auto_sign') === '1') {
      // 延迟一下，确保页面加载完成
      setTimeout(() => {
        const btn = document.querySelector('#sht-auto-sign-btn');
        if (btn) {
          handleAutoSign();
        }
      }, 1000);
    }
  }

  function addSignButtonToAggregator() {
    // 检查是否已经存在按钮
    if (document.querySelector('#sht-auto-sign-btn')) return;

    // 尝试获取现有的聚合区域
    let aggregator = document.querySelector('#sht-aggregator');

    // 如果在首页/论坛首页且没有聚合区域，创建一个简化版本
    if (!aggregator) {
      const isHomePage = location.href === 'https://sehuatang.org/' ||
        location.href === 'http://sehuatang.org/' ||
        (location.href.includes('forum.php') && !location.href.includes('mod='));

      if (isHomePage) {
        aggregator = document.createElement('div');
        aggregator.id = 'sht-aggregator';
        aggregator.style.cssText = 'border:1px solid #ddd;border-radius:8px;padding:10px;margin:10px 0;background:#fafafa;box-shadow:0 1px 3px rgba(0,0,0,.04)';

        const title = document.createElement('div');
        title.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap;';

        const h = document.createElement('strong');
        h.textContent = '实用工具';
        h.style.fontSize = '16px';

        title.appendChild(h);
        aggregator.appendChild(title);

        // 插入到页面顶部合适的位置
        const targetContainer = document.querySelector('#hd') ||
          document.querySelector('.wp') ||
          document.querySelector('body');
        if (targetContainer) {
          targetContainer.insertAdjacentElement('afterbegin', aggregator);
        }
      } else {
        return; // 不在首页且没有聚合区域，不添加
      }
    }

    // 获取 title 区域（按钮应该添加到这里）
    const title = aggregator.querySelector('div:first-child') || aggregator;

    // 创建签到按钮（使用与聚合区域其他按钮相同的样式）
    const signBtn = document.createElement('button');
    signBtn.id = 'sht-auto-sign-btn';
    signBtn.textContent = '🎯 一键签到';
    signBtn.style.cssText = `
    padding: 6px 12px;
    margin: 2px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
    color: white;
    border: 1px solid #1e7e34;
  `;

    // 悬停效果
    signBtn.addEventListener('mouseenter', () => {
      signBtn.style.background = 'linear-gradient(135deg, #1e7e34 0%, #155724 100%)';
      signBtn.style.borderColor = '#155724';
      signBtn.style.transform = 'translateY(-1px)';
      signBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
    });

    signBtn.addEventListener('mouseleave', () => {
      signBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)';
      signBtn.style.borderColor = '#1e7e34';
      signBtn.style.transform = 'translateY(0)';
      signBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    });

    // 点击事件
    signBtn.addEventListener('click', handleAutoSign);

    // 添加到 title 区域
    title.appendChild(signBtn);
  }

  // 获取签到页面所需的参数
  function getSignParams() {
    // 获取 formhash
    const formhashInput = document.querySelector('input[name="formhash"]');
    const formhash = formhashInput ? formhashInput.value : '';

    return { formhash };
  }

  // 获取 signhash（需要从签到弹窗 URL 中获取）
  async function getSignHash() {
    try {
      // 先尝试从页面中查找（如果弹窗已经加载）
      let signhash = '';

      // 方法1: 从当前 URL 参数中获取
      const urlParams = new URLSearchParams(window.location.search);
      signhash = urlParams.get('signhash') || '';

      // 方法2: 从页面中的所有链接中提取（包括 onclick 中的链接）
      if (!signhash) {
        const allLinks = document.querySelectorAll('a[href*="signhash="], a[onclick*="signhash="]');
        for (const link of allLinks) {
          let url = link.href || '';
          if (!url && link.onclick) {
            const onclickMatch = link.onclick.toString().match(/['"]([^'"]*signhash=[^'"]+)['"]/);
            if (onclickMatch) {
              url = onclickMatch[1];
            }
          }
          if (url) {
            const match = url.match(/signhash=([^&'"]+)/);
            if (match) {
              signhash = match[1];
              break;
            }
          }
        }
      }

      // 方法3: 从已加载的弹窗内容中查找
      if (!signhash) {
        const dialog = document.querySelector('#fwin_pc_click_ddsign, [id*="pc_click_ddsign"]');
        if (dialog) {
          const dialogHtml = dialog.innerHTML || dialog.outerHTML || '';
          const match = dialogHtml.match(/signhash=([^&'">\s]+)/);
          if (match) {
            signhash = match[1];
          }
        }
      }

      // 方法4: 如果还没找到，请求签到弹窗 URL 获取
      if (!signhash) {
        const response = await fetch('https://sehuatang.org/plugin.php?id=dd_sign&ac=sign', {
          method: 'GET',
          headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
            'referer': 'https://sehuatang.org/plugin.php?id=dd_sign',
            'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'iframe',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const text = await response.text();
          // 从响应中提取 signhash
          const match = text.match(/signhash=([^&'">\s]+)/);
          if (match) {
            signhash = match[1];
          }
        }
      }

      return signhash;
    } catch (error) {
      console.error('获取 signhash 失败:', error);
      return '';
    }
  }

  async function handleAutoSign() {
    const btn = document.querySelector('#sht-auto-sign-btn');
    if (!btn) return;

    try {
      btn.textContent = '🔄 签到中...';
      btn.disabled = true;

      // 步骤0: 获取页面参数
      const { formhash } = getSignParams();
      if (!formhash) {
        throw new Error('无法获取 formhash，请刷新页面后重试');
      }
      console.log('获取到的 formhash:', formhash);

      // 步骤0.5: 获取 signhash（从弹窗 URL 中）
      btn.textContent = '🔄 获取签到参数...';
      const signhash = await getSignHash();
      if (!signhash) {
        throw new Error('无法获取 signhash，请尝试刷新页面后重试');
      }
      console.log('获取到的 signhash:', signhash);

      // 步骤1: 获取验证码
      btn.textContent = '🔄 获取验证码...';
      const captchaData = await getCaptcha();
      if (!captchaData) {
        throw new Error('获取验证码失败');
      }
      console.log('验证码问题:', captchaData.question);

      // 步骤2: 解析验证码问题
      const question = parseCaptchaQuestion(captchaData.question);
      if (!question) {
        throw new Error('解析验证码问题失败');
      }

      // 步骤3: 计算答案
      const answer = calculateAnswer(question);
      if (answer === null) {
        throw new Error('无法计算验证码答案');
      }
      console.log('验证码答案:', answer);

      // 步骤4: 提交签到
      btn.textContent = '🔄 提交签到...';
      const result = await submitSign(captchaData.hash, answer, formhash, signhash);

      if (result.success) {
        btn.textContent = '✅ 签到成功';
        btn.style.background = '#4CAF50';
        showSuccessModal('签到成功！');
      } else {
        throw new Error(result.message || '签到失败');
      }

    } catch (error) {
      console.error('自动签到失败:', error);
      btn.textContent = '❌ 签到失败';
      btn.style.background = '#f44336';
      showErrorModal('签到失败: ' + error.message);

      // 3秒后恢复按钮
      setTimeout(() => {
        btn.textContent = '🎯 一键签到';
        btn.style.background = '#4CAF50';
        btn.disabled = false;
      }, 3000);
    }
  }

  async function getCaptcha() {
    try {
      // 首先尝试从页面中获取 idhash
      let idhash = null;

      // 方法1: 从隐藏的 input 中获取
      const hiddenInput = document.querySelector('input[name="secqaahash"]');
      if (hiddenInput && hiddenInput.value) {
        idhash = hiddenInput.value;
      }

      // 方法2: 从已有的 secqaa 元素中提取
      if (!idhash) {
        const secqaaElement = document.querySelector('[id^="secqaa_"]');
        if (secqaaElement) {
          const match = secqaaElement.id.match(/secqaa_(.+)/);
          if (match) {
            idhash = match[1];
          }
        }
      }

      // 方法3: 从 URL 参数中获取（如果有）
      if (!idhash) {
        const urlParams = new URLSearchParams(window.location.search);
        idhash = urlParams.get('idhash');
      }

      // 如果都没有，使用默认值尝试
      if (!idhash) {
        idhash = 'qSAU0O0';
      }

      // 获取验证码
      const response = await fetch(`https://sehuatang.org/misc.php?mod=secqaa&action=update&idhash=${idhash}&${Math.random()}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
          'referer': 'https://sehuatang.org/plugin.php?id=dd_sign',
          'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'script',
          'sec-fetch-mode': 'no-cors',
          'sec-fetch-site': 'same-origin',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      console.log('验证码响应:', text);

      // 从响应中提取 idhash（优先从响应中获取，因为响应中的是最新的）
      // 格式1: $('secqaa_qSAR620')
      let idhashMatch = text.match(/\$\(['"]secqaa_(.+?)['"]\)/);
      if (idhashMatch && idhashMatch[1]) {
        idhash = idhashMatch[1];
      } else {
        // 格式2: value="qSAR620" 在 secqaahash input 中
        idhashMatch = text.match(/name=['"]secqaahash['"][^>]*value=['"](.+?)['"]/);
        if (idhashMatch && idhashMatch[1]) {
          idhash = idhashMatch[1];
        } else {
          // 格式3: updatesecqaa('qSAR620')
          idhashMatch = text.match(/updatesecqaa\(['"](.+?)['"]\)/);
          if (idhashMatch && idhashMatch[1]) {
            idhash = idhashMatch[1];
          }
        }
      }

      // 从 JavaScript 代码中提取验证问题
      // 格式: '84 + 5 = ?' 或 "84 + 5 = ?" 或 '53 - 7 = ?'
      // 匹配单引号或双引号中的数学表达式
      const questionMatch = text.match(/['"](\d+\s*[-+*/]\s*\d+\s*=\s*\?)['"]/);
      if (questionMatch) {
        return {
          hash: idhash,
          question: questionMatch[1]
        };
      }

      // 备用方法: 直接匹配数学表达式（不依赖引号）
      const mathMatch = text.match(/(\d+)\s*([-+*/])\s*(\d+)\s*=\s*\?/);
      if (mathMatch) {
        return {
          hash: idhash,
          question: mathMatch[0]
        };
      }

      throw new Error('未找到有效的验证码问题');

    } catch (error) {
      console.error('获取验证码失败:', error);
      throw error;
    }
  }

  function parseCaptchaQuestion(questionText) {
    if (!questionText) return null;

    // 匹配数学表达式: 数字 操作符 数字 = ?
    const match = questionText.match(/(\d+)\s*([-+*/])\s*(\d+)\s*=\s*\?/);
    if (match) {
      return {
        num1: parseInt(match[1]),
        operator: match[2],
        num2: parseInt(match[3])
      };
    }

    return null;
  }

  function calculateAnswer(question) {
    if (!question) return null;

    const { num1, operator, num2 } = question;

    switch (operator) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num1 * num2;
      case '/':
        return Math.floor(num1 / num2);
      default:
        return null;
    }
  }

  async function submitSign(hash, answer, formhash, signhash) {
    try {
      if (!formhash) {
        throw new Error('formhash 不能为空');
      }
      if (!signhash) {
        throw new Error('signhash 不能为空');
      }

      const formData = new URLSearchParams({
        formhash: formhash,
        signtoken: '',
        secqaahash: hash,
        secanswer: answer.toString()
      });

      const response = await fetch(`https://sehuatang.org/plugin.php?id=dd_sign&ac=sign&signsubmit=yes&handlekey=pc_click_ddsign&signhash=${signhash}&inajax=1`, {
        method: 'POST',
        headers: {
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
          'cache-control': 'max-age=0',
          'content-type': 'application/x-www-form-urlencoded',
          'origin': 'https://sehuatang.org',
          'priority': 'u=0, i',
          'referer': 'https://sehuatang.org/plugin.php?id=dd_sign',
          'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'iframe',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
        },
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      console.log('签到响应:', text);

      // 检查响应内容
      if (text.includes('请至少发表或回复一个帖子后再来签到')) {
        return {
          success: false,
          message: '请至少发表或回复一个帖子后再来签到'
        };
      }

      if (text.includes('签到成功') || text.includes('签到完成')) {
        return {
          success: true,
          message: '签到成功'
        };
      }

      // 检查是否有错误信息
      const errorMatch = text.match(/<root[^>]*>(.*?)<\/root>/s);
      if (errorMatch) {
        const errorText = errorMatch[1].replace(/<[^>]*>/g, '').trim();
        if (errorText) {
          return {
            success: false,
            message: errorText
          };
        }
      }

      return {
        success: false,
        message: '未知响应: ' + text.substring(0, 200)
      };

    } catch (error) {
      console.error('提交签到失败:', error);
      throw error;
    }
  }

  // ===== 搜索增强功能模块 =====
  function initSearchEnhancement() {
    // 检查是否在搜索页面
    if (!location.href.includes('search.php?mod=forum')) {
      return;
    }

    // 添加搜索增强样式
    GM_addStyle(`
    #sht-sorter-panel{position:fixed;top:50px;right:20px;z-index:9999;background:rgba(255,255,255,.95);border:1px solid #ccc;border-radius:8px;padding:10px;box-shadow:0 2px 10px rgba(0,0,0,.2);font-size:13px;width:200px;max-height:80vh;overflow-y:auto;overflow-x:hidden}
    #sht-sorter-panel.hidden{opacity:0;pointer-events:none}
    #sht-sorter-panel h4{margin:0 0 8px;text-align:center;font-weight:700;border-bottom:1px solid #eee;padding-bottom:5px;font-size:14px}
    #sht-sorter-panel .sht-button{display:block;width:100%;padding:6px 10px;margin-bottom:4px;border:1px solid #ddd;background:#f7f7f7;border-radius:4px;text-align:left;font-size:12px;line-height:1.2}
    #sht-sorter-panel .sht-button:hover{background:#007bff;color:#fff;border-color:#007bff}
    #sht-sorter-panel .sht-button.active{background:#28a745;color:#fff;border-color:#28a745}
    #sht-sorter-panel .sht-button.filtered{background:#ffc107;color:#000;border-color:#ffc107}
    #sht-sorter-close-btn{position:absolute;top:5px;right:8px;cursor:pointer;font-size:18px;color:#999;font-weight:700}
    #sht-sorter-opener{position:fixed;top:50px;right:20px;z-index:9998;width:40px;height:40px;background:rgba(255,255,255,.95);border:1px solid #ccc;border-radius:50%;display:none;align-items:center;justify-content:center;font-size:20px}
    .sht-hot-thread{background:#fff8e1 !important;border-left:4px solid #ffc107}
    .sht-qbadge{display:inline-block;margin-left:6px;padding:0 6px;border-radius:10px;background:#eef3ff;border:1px solid #c8d4ff;color:#3d4ba3;font-size:12px;vertical-align:baseline}
    .sht-config-status{font-size:10px;color:#666;margin-top:6px;padding:3px;background:#f8f9fa;border-radius:3px;text-align:center}
    .sht-section-title{margin:6px 0 4px;font-size:11px;font-weight:bold;color:#333;text-align:center;background:#f0f0f0;padding:2px 4px;border-radius:3px}
    .sht-scroll-container{max-height:60vh;overflow-y:auto;overflow-x:hidden}
  `);

    const toHalf = s => (s || '').replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFF10 + 0x30));
    const numNorm = s => toHalf(s).replace(/,/g, '');

    // 配置管理
    const CONFIG_KEY = 'sht_sorter_config';
    const defaultConfig = {
      sortBy: null,
      sortDir: 'desc',
      secondarySort: null,
      secondaryDir: 'desc',
      onlyQuota: false,
      filterQiuPian: false,
      lastUsed: Date.now()
    };

    function loadConfig() {
      try {
        const saved = GM_getValue(CONFIG_KEY);
        return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
      } catch (e) {
        console.warn('[SHT] 配置加载失败，使用默认配置:', e);
        return defaultConfig;
      }
    }

    function saveConfig(config) {
      try {
        config.lastUsed = Date.now();
        GM_setValue(CONFIG_KEY, JSON.stringify(config));
        console.debug('[SHT] 配置已保存:', config);
      } catch (e) {
        console.warn('[SHT] 配置保存失败:', e);
      }
    }

    function resetConfig() {
      try {
        GM_deleteValue(CONFIG_KEY);
        console.info('[SHT] 配置已重置');
        return defaultConfig;
      } catch (e) {
        console.warn('[SHT] 配置重置失败:', e);
        return defaultConfig;
      }
    }

    function parseSizeMB(text) {
      if (!text) return 0;
      const s = numNorm(text);
      const spec = s.match(/【(?:影片)?容量】?[：:]\s*(\d+(?:\.\d+)?)\s*([TGM]B?|TB)/i);
      if (spec) {
        const v = parseFloat(spec[1]); const u = spec[2].toUpperCase();
        return u.startsWith('TB') ? v * 1024 * 1024 : (u.startsWith('GB') || u === 'G') ? v * 1024 : v;
      }
      const all = [...s.matchAll(/(\d+(?:\.\d+)?)\s*([TGM]B?|TB)/gi)];
      let max = 0;
      for (const m of all) {
        const v = parseFloat(m[1]); const u = (m[2] || '').toUpperCase();
        const mb = u.startsWith('TB') ? v * 1024 * 1024 : (u.startsWith('GB') || u === 'G') ? v * 1024 : v;
        if (mb > max) max = mb;
      }
      return max;
    }

    // 取"最后一个数字 + 配额/配額"
    function parseQuota(text) {
      if (!text) return 0;
      const s = numNorm(text);
      let last = 0, m;
      const re = /(\d+)\s*配[额額]/gi;
      while ((m = re.exec(s)) !== null) last = parseInt(m[1], 10);
      return last || 0;
    }

    function isQiuPian(li) {
      const cate = li.querySelector('p:last-of-type a.xi1');
      return (cate?.innerText || '').trim() === '求片问答悬赏区';
    }

    window.addEventListener('load', () => {
      const list = document.querySelector('#threadlist ul');
      if (!list) return;
      const lis = [...list.querySelectorAll('li.pbw')];
      if (!lis.length) return;

      // 加载配置
      let config = loadConfig();
      console.debug('[SHT] 加载配置:', config);

      const parsed = lis.map(li => {
        // 关键修复：搜索结果里 <a> 没有 .xst，用通用选择器
        const aEl = li.querySelector('h3 a[href]');      // 优先锚点
        const h3El = li.querySelector('h3');             // 退回 h3
        const titleText =
          (aEl?.getAttribute('title') && aEl.getAttribute('title').trim()) ||
          (aEl?.textContent && aEl.textContent.trim()) ||
          (h3El?.innerText && h3El.innerText.trim()) ||
          '';

        const xg1 = li.querySelector('p.xg1')?.innerText || '';
        const dateSpan = li.querySelector('p:last-of-type span:first-of-type');
        const replies = parseInt((xg1.match(/(\d+)\s*个回复/) || [0, 0])[1], 10) || 0;
        const views = parseInt((xg1.match(/-\s*(\d+)\s*次查看/) || [0, 0])[1], 10) || 0;

        // 内容区（容量常在这里）
        const contentPs = [...li.querySelectorAll('p')].filter(p => p !== li.querySelector('p.xg1') && p !== li.querySelector('p:last-of-type'));
        const contentText = contentPs.map(p => p.innerText || '').join('\n');

        const fileSize = parseSizeMB(contentText) || parseSizeMB(titleText);
        const quota = parseQuota(titleText); // 列表的"配额"基本都在标题
        const postDate = dateSpan ? new Date((dateSpan.innerText || '').replace(/-/g, '/')).getTime() : 0;

        // 标题后插配额徽标
        if (aEl && !aEl.parentElement.querySelector('.sht-qbadge')) {
          const tag = document.createElement('span');
          tag.className = 'sht-qbadge';
          tag.textContent = `配额:${quota}`;
          aEl.after(tag);
        }

        console.debug('[SHT] 解析：', { title: titleText.slice(0, 60), quota, fileSizeMB: fileSize, replies, views });
        return { element: li, title: titleText, replies, views, postDate, fileSize, quota, isQiuPian: isQiuPian(li) };
      });

      const originalOrder = parsed.map(t => t.element);

      // ===== UI =====
      const panel = document.createElement('div');
      panel.id = 'sht-sorter-panel';
      panel.innerHTML = `
      <h4>排序工具</h4>
      <span id="sht-sorter-close-btn">&times;</span>
      <div class="sht-scroll-container">
        <div class="sht-section-title">主要排序</div>
        <button class="sht-button" data-sort="quota" data-dir="desc">↓ 配额</button>
        <button class="sht-button" data-sort="fileSize" data-dir="desc">↓ 文件大小</button>
        <button class="sht-button" data-sort="replies" data-dir="desc">↓ 回复数</button>
        <button class="sht-button" data-sort="views" data-dir="desc">↓ 查看数</button>
        <button class="sht-button" data-sort="postDate" data-dir="desc">↓ 时间</button>

        <div class="sht-section-title">次要排序</div>
        <button class="sht-button" data-secondary-sort="quota" data-dir="desc">↓ 配额</button>
        <button class="sht-button" data-secondary-sort="fileSize" data-dir="desc">↓ 文件大小</button>
        <button class="sht-button" data-secondary-sort="replies" data-dir="desc">↓ 回复数</button>
        <button class="sht-button" data-secondary-sort="views" data-dir="desc">↓ 查看数</button>
        <button class="sht-button" data-secondary-sort="postDate" data-dir="desc">↓ 时间</button>
        <button class="sht-button" data-action="clear-secondary" style="background:#6c757d;color:#fff;border-color:#6c757d;font-size:11px;">清除次要</button>

        <div class="sht-section-title">过滤器</div>
        <button class="sht-button" data-action="only-quota">只显示含配额</button>
        <button class="sht-button" data-action="filter-qp">过滤求片区</button>
        <button class="sht-button" data-action="restore">恢复默认</button>
        <button class="sht-button" data-action="reset-config" style="background:#dc3545;color:#fff;border-color:#dc3545;font-size:11px;">重置配置</button>
      </div>
      <div class="sht-config-status" id="sht-config-status">配置已记忆</div>
    `;
      document.body.appendChild(panel);

      const opener = document.createElement('div');
      opener.id = 'sht-sorter-opener';
      opener.textContent = '⚙';
      document.body.appendChild(opener);

      const reorder = arr => arr.forEach(t => list.appendChild(t.element));

      // 更新按钮状态
      function updateButtonStates() {
        // 更新主要排序按钮状态
        panel.querySelectorAll('[data-sort]').forEach(btn => {
          const sortKey = btn.dataset.sort;
          const isActive = config.sortBy === sortKey;
          btn.classList.toggle('active', isActive);
          if (isActive) {
            btn.dataset.dir = config.sortDir;
            const icon = config.sortDir === 'desc' ? '↓' : '↑';
            btn.innerHTML = btn.innerHTML.replace(/[↓↑]/, icon);
          }
        });

        // 更新次要排序按钮状态
        panel.querySelectorAll('[data-secondary-sort]').forEach(btn => {
          const sortKey = btn.dataset.secondarySort;
          const isActive = config.secondarySort === sortKey;
          btn.classList.toggle('active', isActive);
          if (isActive) {
            btn.dataset.dir = config.secondaryDir;
            const icon = config.secondaryDir === 'desc' ? '↓' : '↑';
            btn.innerHTML = btn.innerHTML.replace(/[↓↑]/, icon);
          }
        });

        // 更新过滤器按钮状态
        panel.querySelector('[data-action="only-quota"]').classList.toggle('filtered', config.onlyQuota);
        panel.querySelector('[data-action="filter-qp"]').classList.toggle('filtered', config.filterQiuPian);

        // 更新状态显示
        const statusEl = document.getElementById('sht-config-status');
        const statusText = [];
        if (config.sortBy) {
          statusText.push(`主排序: ${config.sortBy}(${config.sortDir})`);
        }
        if (config.secondarySort) {
          statusText.push(`次排序: ${config.secondarySort}(${config.secondaryDir})`);
        }
        if (config.onlyQuota) statusText.push('仅配额');
        if (config.filterQiuPian) statusText.push('过滤求片');
        statusEl.textContent = statusText.length ? statusText.join(', ') : '默认配置';
      }

      // 复合排序函数
      function multiSort(arr) {
        return arr.sort((a, b) => {
          // 主要排序
          if (config.sortBy) {
            const aVal = a[config.sortBy] || 0;
            const bVal = b[config.sortBy] || 0;
            const primaryDiff = config.sortDir === 'desc' ? (bVal - aVal) : (aVal - bVal);
            if (primaryDiff !== 0) return primaryDiff;
          }

          // 次要排序（只有在主要排序相等时才使用）
          if (config.secondarySort) {
            const aVal = a[config.secondarySort] || 0;
            const bVal = b[config.secondarySort] || 0;
            return config.secondaryDir === 'desc' ? (bVal - aVal) : (aVal - bVal);
          }

          return 0;
        });
      }

      // 应用配置
      function applyConfig() {
        // 应用排序
        if (config.sortBy || config.secondarySort) {
          multiSort(parsed);
          reorder(parsed);
        }

        // 应用过滤器
        parsed.forEach(t => {
          // 重置显示状态
          t.element.style.display = '';

          // 应用配额过滤器
          if (config.onlyQuota && t.quota <= 0) {
            t.element.style.display = 'none';
          }

          // 应用求片区过滤器
          if (config.filterQiuPian && t.isQiuPian) {
            t.element.style.display = 'none';
          }
        });

        updateButtonStates();
      }

      // 初始化时应用配置
      applyConfig();

      panel.addEventListener('click', (e) => {
        const btn = e.target;
        if (!(btn instanceof HTMLButtonElement)) return;

        const sortKey = btn.dataset.sort;
        const secondarySortKey = btn.dataset.secondarySort;

        if (sortKey) {
          const cur = btn.dataset.dir || 'desc';
          const next = cur === 'desc' ? 'asc' : 'desc';
          btn.dataset.dir = next;
          btn.innerHTML = btn.innerHTML.replace(cur === 'desc' ? '↓' : '↑', next === 'desc' ? '↓' : '↑');

          // 更新配置
          config.sortBy = sortKey;
          config.sortDir = next;
          saveConfig(config);

          console.debug(`[SHT] 主要排序前(${sortKey}):`, parsed.slice(0, 5).map(t => ({ title: t.title.slice(0, 30), [sortKey]: t[sortKey] })));
          multiSort(parsed);
          reorder(parsed);
          console.debug(`[SHT] 主要排序后(${sortKey},${next}):`, parsed.slice(0, 5).map(t => ({ title: t.title.slice(0, 30), [sortKey]: t[sortKey] })));

          updateButtonStates();
          return;
        }

        if (secondarySortKey) {
          const cur = btn.dataset.dir || 'desc';
          const next = cur === 'desc' ? 'asc' : 'desc';
          btn.dataset.dir = next;
          btn.innerHTML = btn.innerHTML.replace(cur === 'desc' ? '↓' : '↑', next === 'desc' ? '↓' : '↑');

          // 更新配置
          config.secondarySort = secondarySortKey;
          config.secondaryDir = next;
          saveConfig(config);

          console.debug(`[SHT] 次要排序前(${secondarySortKey}):`, parsed.slice(0, 5).map(t => ({ title: t.title.slice(0, 30), [secondarySortKey]: t[secondarySortKey] })));
          multiSort(parsed);
          reorder(parsed);
          console.debug(`[SHT] 次要排序后(${secondarySortKey},${next}):`, parsed.slice(0, 5).map(t => ({ title: t.title.slice(0, 30), [secondarySortKey]: t[secondarySortKey] })));

          updateButtonStates();
          return;
        }

        const action = btn.dataset.action;
        if (action === 'restore') {
          // 重置所有状态
          config.sortBy = null;
          config.sortDir = 'desc';
          config.secondarySort = null;
          config.secondaryDir = 'desc';
          config.onlyQuota = false;
          config.filterQiuPian = false;
          saveConfig(config);

          originalOrder.forEach(el => list.appendChild(el));
          parsed.forEach(t => { t.element.style.display = ''; t.element.classList.remove('sht-hot-thread'); });
          panel.querySelectorAll('[data-sort]').forEach(b => { b.dataset.dir = 'desc'; b.innerHTML = b.innerHTML.replace('↑', '↓'); });
          panel.querySelectorAll('[data-secondary-sort]').forEach(b => { b.dataset.dir = 'desc'; b.innerHTML = b.innerHTML.replace('↑', '↓'); });

          updateButtonStates();
        } else if (action === 'clear-secondary') {
          config.secondarySort = null;
          config.secondaryDir = 'desc';
          saveConfig(config);

          // 重新排序（只使用主要排序）
          if (config.sortBy) {
            multiSort(parsed);
            reorder(parsed);
          }

          updateButtonStates();
        } else if (action === 'only-quota') {
          config.onlyQuota = !config.onlyQuota;
          saveConfig(config);

          let cnt = 0;
          parsed.forEach(t => {
            if (config.onlyQuota) {
              // 只显示含配额的项目
              const show = t.quota > 0;
              t.element.style.display = show ? '' : 'none';
              if (show) cnt++;
            } else {
              // 显示所有项目
              t.element.style.display = '';
              cnt++;
            }
          });
          console.debug(`[SHT] 只显示含配额: ${config.onlyQuota}，剩余 ${cnt} 条`);

          updateButtonStates();
        } else if (action === 'filter-qp') {
          config.filterQiuPian = !config.filterQiuPian;
          saveConfig(config);

          let hidden = 0;
          parsed.forEach(t => {
            if (config.filterQiuPian) {
              // 隐藏求片区内容
              if (t.isQiuPian) {
                t.element.style.display = 'none';
                hidden++;
              }
            } else {
              // 显示所有内容（包括求片区）
              t.element.style.display = '';
            }
          });
          console.debug(`[SHT] 过滤求片区: ${config.filterQiuPian}，隐藏 ${hidden} 条`);

          updateButtonStates();
        } else if (action === 'reset-config') {
          if (confirm('确定要重置所有配置吗？这将清除所有保存的设置。')) {
            config = resetConfig();
            // 重新应用默认状态
            originalOrder.forEach(el => list.appendChild(el));
            parsed.forEach(t => { t.element.style.display = ''; t.element.classList.remove('sht-hot-thread'); });
            panel.querySelectorAll('[data-sort]').forEach(b => { b.dataset.dir = 'desc'; b.innerHTML = b.innerHTML.replace('↑', '↓'); });
            panel.querySelectorAll('[data-secondary-sort]').forEach(b => { b.dataset.dir = 'desc'; b.innerHTML = b.innerHTML.replace('↑', '↓'); });
            updateButtonStates();
          }
        }
      });

      document.getElementById('sht-sorter-close-btn').addEventListener('click', () => {
        panel.classList.add('hidden'); opener.style.display = 'flex';
      });
      opener.addEventListener('click', () => {
        panel.classList.remove('hidden'); opener.style.display = 'none';
      });

      const withQuota = parsed.filter(t => t.quota > 0).length;
      console.info(`[SHT] 总 ${parsed.length} 条，解析出"配额>0"的有 ${withQuota} 条。`);
    });
  }

  // 初始化搜索增强功能
  initSearchEnhancement();

  // 初始化自动签到功能
  initAutoSign();

})();
