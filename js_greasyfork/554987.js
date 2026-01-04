// ==UserScript==
// @name         B站字幕导出助手（默认TXT，可选SRT/JSON）
// @name:en      Bilibili AI Subtitle Exporter (TXT by default, optional SRT/JSON)
// @namespace    https://greasyfork.org/users/1534786-seas-lofty
// @version      1.0.1
// @description        自动捕获并导出 B站字幕。默认导出 TXT，按需勾选 SRT/JSON。支持自定义 URL 匹配规则、去重防重复下载、可视化面板。
// @description:en     Capture and export Bilibili subtitles. TXT by default, SRT/JSON optional. Custom URL regex, de-duplication, and UI panel.
// @author       <yehai>
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @run-at       document-start
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @icon         https://static.biligame.net/biligame/favicons/favicon-32x32.png
// @antifeature  n/a
// @downloadURL https://update.greasyfork.org/scripts/554987/B%E7%AB%99%E5%AD%97%E5%B9%95%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B%EF%BC%88%E9%BB%98%E8%AE%A4TXT%EF%BC%8C%E5%8F%AF%E9%80%89SRTJSON%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554987/B%E7%AB%99%E5%AD%97%E5%B9%95%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B%EF%BC%88%E9%BB%98%E8%AE%A4TXT%EF%BC%8C%E5%8F%AF%E9%80%89SRTJSON%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';

    /* ================== 配置（持久化） ================== */
    const defaults = {
        // 导出选项：默认仅 TXT 开启
        exportTXT: true,
        exportSRT: false,
        exportJSON: false,

        autoDownload: true,          // 捕获后自动导出所选格式
        autoNotify: false,           // 桌面通知
        panelVisible: true,          // 面板默认显示

        // 命名模板
        txtTemplate:  '{bv}_{p?}_{ts}.txt',
        srtTemplate:  '{bv}_{p?}_{ts}.srt',
        jsonTemplate: '{bv}_{p?}_{ts}.json',

        // URL 匹配正则（字符串，new RegExp(str,'i')）
        urlRegexStr: 'subtitle',

        // 可选：尝试自动点击“字幕：中文（中国）”
        autoTryClickAI: false,

        // TXT 整理参数
        pauseBreakSec: 1.2,
        maxLineChars: 60,
        dedupePunct: true,
        trimNoise: true,
        keepMusic: false,

        // 去重窗口（毫秒）：同 URL 近距离重复响应只保留一个（内容不同则保留）
        dedupeWindowMs: 2500
    };

    const CFG = new Proxy({}, {
        get(_, k) { return GM_getValue(k, defaults[k]); },
        set(_, k, v) { GM_setValue(k, v); return true; }
    });

    /* ================== 工具函数 ================== */
    const log = (...a) => console.log('[bili-ai-sub-export]', ...a);

    function makeUrlRegex() {
        const raw = String(CFG.urlRegexStr || defaults.urlRegexStr);
        try { return new RegExp(raw, 'i'); }
        catch (e) { console.warn('URL 正则无效，回退默认：', e); return new RegExp(defaults.urlRegexStr, 'i'); }
    }
    let URL_RE = makeUrlRegex();

    function deriveBVandP(url) {
        let bv = 'unknown', p = null;
        try {
            const u = new URL(url, location.origin);
            const m = u.pathname.match(/\/video\/(BV[\w]+)/i);
            if (m) bv = m[1];
            if (u.searchParams.has('p')) p = u.searchParams.get('p');
            if (!p) {
                const node = document.querySelector('.multi-page .cur,.publish .p-select .cur');
                if (node) p = node.textContent.trim().replace(/\D/g, '');
            }
        } catch (_) {}
        return { bv, p };
    }

    function genFilename(template, pageUrl) {
        const { bv, p } = deriveBVandP(pageUrl || location.href);
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        return template.replace('{bv}', bv)
            .replace('{p?}', p ? ('p' + p) : '')
            .replace('{ts}', ts)
            .replace(/_{2,}/g, '_');
    }

    // 简单 32-bit hash（足够做去重指纹）
    function hash32(str) {
        let h = 0, i = 0, len = str.length;
        while (i < len) { h = (h << 5) - h + str.charCodeAt(i++) | 0; }
        return (h >>> 0).toString(16);
    }

    // 解析 JSON：先 text，再走多策略 parse
    function tryParseJsonFromText(rawText) {
        if (typeof rawText !== 'string' || !rawText.length) return null;
        let t = rawText.replace(/^\uFEFF/, ''); // 去 BOM
        try { return JSON.parse(t); } catch (_) {}

        // 容错1：截掉末尾多余逗号（极少见）
        try { return JSON.parse(t.replace(/,\s*([}\]])/g, '$1')); } catch (_) {}

        // 容错2：如果是 JSONP/包裹层，提取 {...}
        const m = t.match(/\{[\s\S]*\}$/);
        if (m) { try { return JSON.parse(m[0]); } catch (_) {} }

        return null;
    }

    async function respToTextThenJson(resp) {
        // 先 text 再 parse，避免某些 content-type 不是 application/json
        let text = '';
        try { text = await resp.text(); } catch (_) {}
        const json = tryParseJsonFromText(text);
        return { text, json };
    }

    function toSrtTime(sec) {
        sec = Number(sec) || 0;
        const ms = Math.floor((sec % 1) * 1000);
        const total = Math.floor(sec);
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        const pad = (n, w = 2) => String(n).padStart(w, '0');
        return `${pad(h)}:${pad(m)}:${pad(s)},${String(ms).padStart(3, '0')}`;
    }

    function jsonToSrt(json) {
        if (!json) return '';
        let segs = null;
        if (Array.isArray(json)) segs = json;
        if (!segs) {
            segs = json.body || json.result || json.segments || json.data || null;
            if (segs && !Array.isArray(segs) && Array.isArray(segs.segments)) segs = segs.segments;
        }
        if (!Array.isArray(segs)) {
            const found = (function dig(o){
                if (!o || typeof o !== 'object') return null;
                for (const k of Object.keys(o)) {
                    const v = o[k];
                    if (Array.isArray(v)) {
                        if (v.length && (v[0].from !== undefined || v[0].start !== undefined || v[0].content || v[0].text)) return v;
                        for (const it of v) { if (typeof it === 'object') { const r = dig(it); if (r) return r; } }
                    } else if (typeof v === 'object') {
                        const r = dig(v); if (r) return r;
                    }
                }
                return null;
            })(json);
            if (found) segs = found;
        }
        if (!Array.isArray(segs)) return '';

        return segs.map((seg, idx) => {
            const start = seg.from ?? seg.start_time ?? seg.start ?? seg.st ?? 0;
            const end = seg.to ?? seg.end_time ?? seg.end ?? (start + (seg.d ?? 2));
            const text = (seg.content || seg.text || seg.sentence || seg.t || seg.c || '').toString().trim();
            return `${idx + 1}\n${toSrtTime(start)} --> ${toSrtTime(end)}\n${text}\n`;
        }).join('\n');
    }

    function buildTranscriptFromBili(json) {
        const cfg = {
            pauseBreakSec: Number(CFG.pauseBreakSec) || defaults.pauseBreakSec,
            maxLineChars: Number(CFG.maxLineChars) || defaults.maxLineChars,
            dedupePunct: !!CFG.dedupePunct,
            trimNoise: !!CFG.trimNoise,
            keepMusic: !!CFG.keepMusic
        };
        const segs = (json && json.body) ? json.body.slice() : [];
        if (!segs.length) return '';
        segs.sort((a,b)=> (a.from||0) - (b.from||0));

        const arr = [];
        for (const s of segs) {
            if (!cfg.keepMusic && typeof s.music === 'number' && s.music > 0) continue;
            const text = (s.content||'').replace(/\s+/g,' ').trim();
            if (!text) continue;
            arr.push({from:+s.from||0, to:+s.to||(+s.from||0)+2, text});
        }
        if (!arr.length) return '';

        const lines = [];
        let buf = [arr[0].text];
        for (let i=1;i<arr.length;i++){
            const gap = arr[i].from - arr[i-1].to;
            if (gap >= cfg.pauseBreakSec) { lines.push(buf.join(' ')); buf=[arr[i].text]; }
            else buf.push(arr[i].text);
        }
        if (buf.length) lines.push(buf.join(' '));

        function clean(s){
            if (cfg.dedupePunct){
                s = s.replace(/([。！？!?])\1+/g, '$1')
                    .replace(/，，+/g, '，').replace(/。。+/g, '。').replace(/、、+/g, '、');
            }
            if (cfg.trimNoise){
                s = s.replace(/\s*([。！？!?，、；：,.])\s*/g, '$1').replace(/\s+/g,' ').trim();
            }
            return s;
        }
        const cleaned = lines.map(clean);

        function wrap(line, limit){
            if (!limit || line.length <= limit) return [line];
            const res = [];
            let rest = line;
            while (rest.length > limit){
                let cut = rest.lastIndexOf(' ', limit);
                if (cut < limit*0.6) {
                    const punctPos = Math.max(
                        rest.lastIndexOf('，', limit),
                        rest.lastIndexOf('。', limit),
                        rest.lastIndexOf('、', limit),
                        rest.lastIndexOf('；', limit),
                        rest.lastIndexOf('：', limit),
                        rest.lastIndexOf(',', limit),
                        rest.lastIndexOf('.', limit)
                    );
                    cut = Math.max(cut, punctPos);
                }
                if (cut <= 0) cut = limit;
                res.push(rest.slice(0, cut).trim());
                rest = rest.slice(cut).trim();
            }
            if (rest) res.push(rest);
            return res;
        }

        const out = [];
        for (const l of cleaned) for (const w of wrap(l, cfg.maxLineChars)) out.push(w);
        return out.join('\n');
    }

    async function safeDownload(filename, content, mime = 'application/octet-stream') {
        if (typeof GM_download === 'function') {
            try {
                const blob = new Blob([content], { type: mime });
                const url = URL.createObjectURL(blob);
                GM_download({ url, name: filename, saveAs: false, onerror: () => fallback() });
                setTimeout(() => URL.revokeObjectURL(url), 5000);
                return;
            } catch (_) {}
        }
        fallback();
        function fallback() {
            const blob = new Blob([content], { type: mime });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        }
    }

    function shortName() {
        const { bv, p } = deriveBVandP(location.href);
        const ts = new Date().toLocaleString();
        return `${bv}${p ? ' p' + p : ''} · ${ts}`;
    }

    /* ================== 去重与记录 ================== */
    const entries = [];               // 展示列表
    const seenMap = new Map();        // key: url -> { ts:number, hash:string }
    const exportedSignatures = new Set(); // 防止重复导出（url#hash）

    function shouldAccept(url, text) {
        const now = Date.now();
        const key = url;
        const h = hash32(text || '');
        const sig = `${key}#${h}`;

        // 已导出过这个签名，丢弃
        if (exportedSignatures.has(sig)) return false;

        const prev = seenMap.get(key);
        if (prev) {
            // 窗口内且内容相同 => 丢弃
            if ((now - prev.ts) < (Number(CFG.dedupeWindowMs) || defaults.dedupeWindowMs) && prev.hash === h) {
                return false;
            }
        }
        // 记录最新快照
        seenMap.set(key, { ts: now, hash: h });
        return true;
    }

    /* ================== 导出流程 ================== */
    async function exportByChoice(e) {
        // 记录签名，防重复导出
        const sig = `${e.url}#${hash32(e.text || '')}`;
        if (exportedSignatures.has(sig)) return;
        exportedSignatures.add(sig);

        // TXT（默认）
        if (CFG.exportTXT) {
            const txt = buildTranscriptFromBili(e.json);
            if (txt && txt.trim()) {
                const name = genFilename(CFG.txtTemplate, e.pageUrl);
                await safeDownload(name, txt, 'text/plain;charset=utf-8');
            }
        }

        // SRT（可选）
        if (CFG.exportSRT) {
            const srt = jsonToSrt(e.json);
            if (srt && srt.trim()) {
                const name = genFilename(CFG.srtTemplate, e.pageUrl);
                await safeDownload(name, srt, 'text/plain;charset=utf-8');
            }
        }

        // JSON（可选）
        if (CFG.exportJSON) {
            const name = genFilename(CFG.jsonTemplate, e.pageUrl);
            await safeDownload(name, JSON.stringify(e.json ?? tryParseJsonFromText(e.text) ?? {}, null, 2), 'application/json;charset=utf-8');
        }

        if (CFG.autoNotify && typeof GM_notification === 'function') {
            GM_notification({ title: 'B站字幕导出', text: `${shortName()} 导出完成`, timeout: 2500 });
        }
    }

    async function handleCaptured(url, text, json) {
        if (!shouldAccept(url, text)) { log('去重：忽略重复响应', url); return; }

        const id = 'e' + (Date.now() + Math.random()).toString(36);
        const e = { id, url, text, json: json ?? tryParseJsonFromText(text), pageUrl: location.href, exported: false };
        entries.push(e);
        renderUI();

        if (CFG.autoDownload) {
            await exportByChoice(e);
            e.exported = true;
            renderUI();
        }
    }

    /* ================== 拦截 fetch / XHR ================== */
    (function interceptFetch() {
        const orig = window.fetch;
        window.fetch = async function (...args) {
            const resp = await orig.apply(this, args);
            try {
                const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';
                if (URL_RE.test(url)) {
                    const clone = resp.clone();
                    const { text, json } = await respToTextThenJson(clone);
                    await handleCaptured(url, text, json);
                }
            } catch (e) { log('fetch 捕获异常', e); }
            return resp;
        };
        log('fetch 拦截已启用');
    })();

    (function interceptXHR() {
        const XHR = window.XMLHttpRequest;
        const open = XHR.prototype.open;
        const send = XHR.prototype.send;
        XHR.prototype.open = function (method, url) {
            this._bai_url = url;
            return open.apply(this, arguments);
        };
        XHR.prototype.send = function () {
            const url = this._bai_url || '';
            if (URL_RE.test(url)) {
                this.addEventListener('readystatechange', async function () {
                    try {
                        if (this.readyState === 4) {
                            const text = (typeof this.responseText === 'string') ? this.responseText : '';
                            const json = tryParseJsonFromText(text);
                            await handleCaptured(url, text, json);
                        }
                    } catch (e) { log('XHR 捕获异常', e); }
                });
            }
            return send.apply(this, arguments);
        };
        log('XHR 拦截已启用');
    })();

    /* ==================（可选）自动点“字幕” ================== */
    async function tryClickAI() {
        if (!CFG.autoTryClickAI) return;
        try {
            await waitFor(() => document.querySelector('.bpx-player-ctrl-subtitle,.bpx-player-ctrl-setting,.bpx-player-ctrl-btn-subtitle'), 10000);
            const btn = document.querySelector('.bpx-player-ctrl-subtitle,.bpx-player-ctrl-btn-subtitle');
            if (btn) btn.click();
            else {
                const gear = document.querySelector('.bpx-player-ctrl-setting');
                if (gear) {
                    gear.click();
                    await sleep(200);
                    const sub = [...document.querySelectorAll('*')].find(n => n.textContent && n.textContent.includes('字幕'));
                    if (sub) sub.click();
                }
            }
            await sleep(200);
            const aiItem = [...document.querySelectorAll('*')].find(n => n.textContent && /AI\s*字幕.*中文（中国）|AI字幕：中文（中国）/.test(n.textContent));
            if (aiItem) aiItem.click();
        } catch (e) { log('自动点击字幕失败（可忽略）', e); }
    }
    function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
    function waitFor(fn, timeout=8000, step=200){
        return new Promise((res, rej) => {
            const t0 = Date.now();
            (function loop(){
                try { const v = fn(); if (v) return res(v); } catch(_){}
                if (Date.now() - t0 > timeout) return rej(new Error('waitFor timeout'));
                setTimeout(loop, step);
            })();
        });
    }
    window.addEventListener('load', () => {
        setTimeout(() => { if (CFG.panelVisible) injectUI(); tryClickAI(); }, 1200);
    });

    /* ================== UI 面板 ================== */
    function injectUI() {
        if (document.getElementById('baiui-panel')) return;

        GM_addStyle(`
    #baiui-panel{
      position:fixed;right:12px;top:72px;z-index:99999;
      background:rgba(25,25,25,.9);color:#fff;
      font:12px/1.4 system-ui;border-radius:8px;
      padding:10px;min-width:290px;
      box-shadow:0 6px 18px rgba(0,0,0,.45)
    }
    #baiui-panel button{
      cursor:pointer;border:none;border-radius:6px;
      padding:6px 10px;font-size:12px;transition:all .2s
    }
    #baiui-panel button:hover{filter:brightness(1.1);}
    .btn-primary{background:#1e90ff;color:#fff;}
    .btn-dark{background:#444;color:#fff;}
    .btn-light{background:#f1f1f1;color:#000;}
    #baiui-panel .row{display:flex;gap:8px;align-items:center;margin:6px 0;flex-wrap:wrap}
    #baiui-list{max-height:220px;overflow:auto;
      border-top:1px solid rgba(255,255,255,.08);
      margin-top:6px;padding-top:6px}
    #baiui-list .item{padding:6px;border-bottom:1px dashed rgba(255,255,255,.08)}
    #baiui-list .meta{opacity:.7;font-size:11px;margin-top:4px;word-break:break-all}
    #baiui-title{display:flex;justify-content:space-between;align-items:center}
    #baiui-kv input,#baiui-kv textarea{
      width:100%;padding:6px;border-radius:6px;
      border:1px solid rgba(255,255,255,.2);
      background:rgba(255,255,255,.08);color:#fff;
    }
    #baiui-kv textarea{min-height:48px;resize:vertical}
    #baiui-help{opacity:.7;font-size:11px;line-height:1.4;margin-top:4px}
    .chk{display:flex;align-items:center;gap:4px}
    #baiui-guide{
      background:rgba(255,255,255,.08);
      border-radius:6px;padding:6px;margin-top:6px;
      font-size:12px;line-height:1.5;opacity:.85;
    }
  `);

        const el = document.createElement('div');
        el.id = 'baiui-panel';
        el.innerHTML = `
    <div id="baiui-title">
      <strong>字幕导出</strong>
      <button id="baiui-toggle" class="btn-dark">${CFG.panelVisible ? '隐藏' : '显示'}</button>
    </div>

    <div id="baiui-kv" style="margin-top:6px;">
      <div class="row">
        <span class="chk"><input type="checkbox" id="chk-txt">TXT</span>
        <span class="chk"><input type="checkbox" id="chk-srt">SRT</span>
        <span class="chk"><input type="checkbox" id="chk-json">JSON</span>
        <span class="chk" style="margin-left:auto"><input type="checkbox" id="chk-auto">自动下载</span>
      </div>

      <div class="row">
        <span class="chk"><input type="checkbox" id="chk-notify">导出通知</span>
      </div>

      <div id="baiui-guide">
        ▶ <b>使用说明：</b><br>
        1️⃣ 打开视频后，点击播放器右下角的「字幕」按钮；<br>
        2️⃣ 选择「中文（中国）」或者其他语言，支持AI生成的字幕；<br>
        3️⃣ 本脚本会自动捕获字幕并导出为 TXT（默认）；
        若勾选 SRT/JSON，则同步导出对应文件。
      </div>

      <div class="row"><label>文件命名模板：</label></div>
      <div class="row"><input id="ipt-txt" placeholder="{bv}_{p?}_{ts}.txt"></div>
      <div class="row"><input id="ipt-srt" placeholder="{bv}_{p?}_{ts}.srt"></div>
      <div class="row"><input id="ipt-json" placeholder="{bv}_{p?}_{ts}.json"></div>

      <div id="baiui-help">
        命名规则说明：<br>
        • <b>{bv}</b> → 视频 BV 号，例如 BV1ab411R7Ct<br>
        • <b>{p?}</b> → 分 P 号（如果有则添加，如 p2，否则留空）<br>
        • <b>{ts}</b> → 导出时间戳，防止重名<br>
        示例：<code>BV1ab411R7Ct_p2_2025-11-06T20-50-10.txt</code>
      </div>

      <div class="row"><label>URL 匹配正则：</label></div>
      <div class="row"><textarea id="ipt-urlre" placeholder="subtitle"></textarea></div>
      <div id="baiui-help">
        示例：<br>
        <code>ai_subtitle</code>（宽松匹配）<br>
        <code>^https?:\\/\\/aisubtitle\\.hdslb\\.com\\/bfs\\/ai_subtitle\\/prod\\/.*$</code>（严格匹配）
      </div>

      <div class="row" style="justify-content:flex-end;gap:8px">
        <button id="btn-save" class="btn-primary">保存设置</button>
        <button id="btn-export" class="btn-light">导出全部</button>
        <button id="btn-clear" class="btn-light">清空记录</button>
      </div>
    </div>

    <div id="baiui-list"></div>
  `;
        document.body.appendChild(el);

        const $ = s => el.querySelector(s);
        $('#chk-txt').checked = !!CFG.exportTXT;
        $('#chk-srt').checked = !!CFG.exportSRT;
        $('#chk-json').checked = !!CFG.exportJSON;
        $('#chk-auto').checked = !!CFG.autoDownload;
        $('#chk-notify').checked = !!CFG.autoNotify;

        $('#ipt-txt').value = CFG.txtTemplate;
        $('#ipt-srt').value = CFG.srtTemplate;
        $('#ipt-json').value = CFG.jsonTemplate;
        $('#ipt-urlre').value = CFG.urlRegexStr;

        $('#btn-save').addEventListener('click', () => {
            CFG.exportTXT = $('#chk-txt').checked;
            CFG.exportSRT = $('#chk-srt').checked;
            CFG.exportJSON = $('#chk-json').checked;
            CFG.autoDownload = $('#chk-auto').checked;
            CFG.autoNotify = $('#chk-notify').checked;
            CFG.txtTemplate = $('#ipt-txt').value.trim() || defaults.txtTemplate;
            CFG.srtTemplate = $('#ipt-srt').value.trim() || defaults.srtTemplate;
            CFG.jsonTemplate = $('#ipt-json').value.trim() || defaults.jsonTemplate;

            const regexStr = $('#ipt-urlre').value.trim() || defaults.urlRegexStr;
            try { new RegExp(regexStr, 'i'); } catch (e) { return alert('URL 正则无效：' + e.message); }
            CFG.urlRegexStr = regexStr;
            URL_RE = makeUrlRegex();
            notify('设置已保存');
        });

        $('#btn-export').addEventListener('click', async () => {
            if (!entries.length) return alert('暂无记录');
            for (const e of entries) {
                if (!e.exported) { await exportByChoice(e); e.exported = true; }
            }
            renderUI(); notify('导出完成');
        });

        $('#btn-clear').addEventListener('click', () => {
            if (!confirm('确定清空已捕获记录？')) return;
            entries.length = 0; renderUI();
        });

        $('#baiui-toggle').addEventListener('click', () => {
            const body = $('#baiui-kv');
            const hidden = body.style.display === 'none';
            body.style.display = hidden ? '' : 'none';
            $('#baiui-toggle').textContent = hidden ? '隐藏' : '显示';
            CFG.panelVisible = hidden;
        });

        renderUI();
    }



    function renderUI() {
        const list = document.querySelector('#baiui-list');
        if (!list) return;
        if (!entries.length) {
            list.innerHTML = `<div style="opacity:.7">尚未捕获到匹配“URL 正则”的响应。请在播放器中开启「字幕」。</div>`;
            return;
        }
        list.innerHTML = entries.slice().reverse().map(e => `
      <div class="item">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>${shortName()}</div>
          <div><button data-id="${e.id}" class="btn2 one-export">导出</button></div>
        </div>
        <div class="meta">${e.url}</div>
      </div>
    `).join('');
      list.querySelectorAll('.one-export').forEach(btn => {
          btn.addEventListener('click', async ev => {
              const id = ev.currentTarget.getAttribute('data-id');
              const e = entries.find(x => x.id === id);
              if (e) { await exportByChoice(e); e.exported = true; renderUI(); }
          });
      });
  }

    function notify(text) {
        if (CFG.autoNotify && typeof GM_notification === 'function') {
            GM_notification({ title: 'B站字幕导出', text, timeout: 2500 });
        } else {
            console.log('[bili-ai-sub-export]', text);
        }
    }

    // 菜单
    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('显示/隐藏面板', () => {
            const p = document.getElementById('baiui-panel');
            if (!p) injectUI();
            else { p.style.display = (p.style.display === 'none') ? '' : 'none'; CFG.panelVisible = (p.style.display !== 'none'); }
        });
        GM_registerMenuCommand('导出全部记录', async () => {
            if (!entries.length) return alert('暂无记录');
            for (const e of entries) { if (!e.exported) { await exportByChoice(e); e.exported = true; } }
            renderUI(); notify('导出完成');
        });
        GM_registerMenuCommand('清空记录', () => { if (!confirm('确定清空已捕获记录？')) return; entries.length = 0; renderUI(); });
    }

})();
