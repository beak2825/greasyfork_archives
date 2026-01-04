// ==UserScript==
// @name         VJS | VJudge 原题（洛谷 + UOJ + QOJ + LOJ 合并搜索）
// @namespace    https://vjudge.net/
// @version      1.8
// @author       Oracynx (extended)
// @description  在 VJudge 比赛题目页添加原题链接；并行在洛谷、UOJ、QOJ、LOJ 搜索并合并候选，优先展示洛谷/ UOJ 结果。
// @match        https://vjudge.net/contest/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      www.luogu.com.cn
// @connect      qoj.ac
// @connect      uoj.ac
// @connect      loj.ac
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549467/VJS%20%7C%20VJudge%20%E5%8E%9F%E9%A2%98%EF%BC%88%E6%B4%9B%E8%B0%B7%20%2B%20UOJ%20%2B%20QOJ%20%2B%20LOJ%20%E5%90%88%E5%B9%B6%E6%90%9C%E7%B4%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549467/VJS%20%7C%20VJudge%20%E5%8E%9F%E9%A2%98%EF%BC%88%E6%B4%9B%E8%B0%B7%20%2B%20UOJ%20%2B%20QOJ%20%2B%20LOJ%20%E5%90%88%E5%B9%B6%E6%90%9C%E7%B4%A2%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ANCHOR_CONTAINER_ID = 'vjudge-original-vjs-link';
    const DEBOUNCE_MS = 140;
    let titleObserver = null, bodyObserver = null, debounceTimer = null;
    let lastDataJsonRaw = null, lastParsedData = null;
    let currentRequestId = 0, pendingRequestId = null;

    // ----- small utils -----
    function parseDataJsonSafely() {
        const ta = document.querySelector('textarea[name="dataJson"]');
        if (!ta) return null;
        const raw = ta.value || ta.textContent || ta.innerText || '';
        if (!raw) return null;
        if (raw === lastDataJsonRaw) return lastParsedData;
        try {
            const parsed = JSON.parse(raw);
            lastDataJsonRaw = raw;
            lastParsedData = parsed;
            return parsed;
        } catch (e) {
            console.warn('vjudge-vjs: JSON parse failed', e);
            lastDataJsonRaw = raw;
            lastParsedData = null;
            return null;
        }
    }

    function simpleObjHash(obj) { try { return String(JSON.stringify(obj)); } catch { return String(obj); } }

    function ensureStyles() {
        if (document.getElementById('vjudge-vjs-styles')) return;
        const style = document.createElement('style');
        style.id = 'vjudge-vjs-styles';
        style.textContent = `
#${ANCHOR_CONTAINER_ID} { margin-top:6px; font-size:14px; line-height:1.4; display:flex; align-items:center; gap:8px }
#${ANCHOR_CONTAINER_ID} .vjs-text { cursor:default }
#${ANCHOR_CONTAINER_ID} .vjs-meta { margin-left:4px; font-size:12px; color:#666 }
#${ANCHOR_CONTAINER_ID} .vjs-status { font-size:12px; color:#888 }
#${ANCHOR_CONTAINER_ID} .vjs-action { margin-left:8px; font-size:12px; cursor:pointer; color:#0b66ff; text-decoration:underline }
#${ANCHOR_CONTAINER_ID} .vjs-spinner { width:14px; height:14px; border-radius:50%; border:2px solid rgba(0,0,0,0.12); border-top-color:rgba(0,0,0,0.6); animation: vjs-spin 1s linear infinite }
@keyframes vjs-spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
#${ANCHOR_CONTAINER_ID} .vjs-click-hint { font-size:11px; color:#aaa }
        `;
        document.head.appendChild(style);
    }

    function createOrUpdateContainer(text, href, meta, state) {
        ensureStyles();
        const titleEl = document.getElementById('prob-title-contest');
        if (!titleEl) return;
        let existing = document.getElementById(ANCHOR_CONTAINER_ID);
        const newHash = simpleObjHash({ href, meta, text, state });
        if (existing && existing.dataset.hash === newHash) return;
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = ANCHOR_CONTAINER_ID;
        container.dataset.hash = newHash;

        if (state === 'loading') {
            const spinner = document.createElement('div');
            spinner.className = 'vjs-spinner';
            container.appendChild(spinner);
        }

        if (href) {
            const a = document.createElement('a');
            a.style.textDecoration = 'none';
            a.style.fontWeight = '500';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.href = href;
            a.textContent = text || href;
            a.className = 'vjs-text';
            container.appendChild(a);
        } else {
            const span = document.createElement('span');
            span.className = 'vjs-text';
            span.textContent = text || '';
            container.appendChild(span);
        }

        if (meta) {
            const metaSpan = document.createElement('span');
            metaSpan.className = 'vjs-meta';
            metaSpan.textContent = `(${meta})`;
            container.appendChild(metaSpan);
        }

        const statusSpan = document.createElement('span');
        statusSpan.className = 'vjs-status';
        if (state === 'loading') statusSpan.textContent = '正在搜索…';
        else if (state === 'success') statusSpan.textContent = '已完成';
        else if (state === 'error') statusSpan.textContent = '出错';
        else statusSpan.textContent = '';
        container.appendChild(statusSpan);

        const retry = document.createElement('span');
        retry.className = 'vjs-action';
        retry.textContent = '重试';
        retry.title = '点击重试搜索原题';
        retry.addEventListener('click', (e) => { e.stopPropagation(); handleUpdate(true); });
        container.appendChild(retry);

        const hint = document.createElement('span');
        hint.className = 'vjs-click-hint';
        hint.textContent = '（点击重试）';
        container.appendChild(hint);

        try { titleEl.appendChild(container); } catch (e) { console.warn('vjudge-vjs: insert fail', e); }
    }

    // ----- GM 跨域 GET（优先） -----
    function httpGetText(url, cb) {
        try {
            if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function') {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: url,
                    headers: { 'User-Agent': "Oracynx's Problem Searcher" },
                    onload: function (res) { cb(null, res.responseText); },
                    onerror: function (err) { cb(err || new Error('request failed')); }
                });
                return;
            }
        } catch (e) { /* ignore */ }

        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: { 'User-Agent': "Oracynx's Problem Searcher" },
                    onload: function (res) { cb(null, res.responseText); },
                    onerror: function (err) { cb(err || new Error('request failed')); }
                });
                return;
            }
        } catch (e) { /* ignore */ }

        // fallback（可能受 CORS）
        fetch(url, { method: 'GET', credentials: 'omit' })
            .then(r => r.text().then(t => cb(null, t)))
            .catch(err => cb(err));
    }

    // ----- 在洛谷上搜索并解析 lentille-context -----
    function searchOnLuogu(title, typeFilter, cb) {
        const q = encodeURIComponent(title || '');
        let type = encodeURIComponent(typeFilter || '');
        if (type == 'CodeForces') type = 'CF';
        if (type == 'AtCoder') type = 'AT';
        const url = `https://www.luogu.com.cn/problem/list?keyword=${q}&type=${type}&page=1`;
        httpGetText(url, (err, text) => {
            if (err) return cb(err);
            try {
                const re = /<script\s+id=["']lentille-context["'][^>]*>([\s\S]*?)<\/script>/i;
                const m = text.match(re);
                if (!m || !m[1]) return cb(new Error('lentille-context not found'));
                const jsonText = m[1].trim();
                const parsed = JSON.parse(jsonText);

                let candidateRoot = null;
                if (parsed && parsed.props && parsed.props.pageProps) candidateRoot = parsed.props.pageProps;
                else if (parsed && parsed.initialState) candidateRoot = parsed.initialState;
                else if (parsed && parsed.data) candidateRoot = parsed.data;
                else candidateRoot = parsed;

                const findArrayWithTitles = (obj) => {
                    if (!obj || typeof obj !== 'object') return null;
                    if (Array.isArray(obj)) {
                        if (obj.length > 0 && obj[0] && (obj[0].title || obj[0].pid || obj[0].probNum || obj[0].id)) return obj;
                    }
                    for (const k of Object.keys(obj)) {
                        try {
                            const v = obj[k];
                            if (Array.isArray(v) && v.length > 0 && v[0] && (v[0].title || v[0].pid || v[0].probNum || v[0].id)) return v;
                            if (typeof v === 'object') {
                                const deeper = findArrayWithTitles(v);
                                if (deeper) return deeper;
                            }
                        } catch (e) { }
                    }
                    return null;
                };

                const arr = findArrayWithTitles(candidateRoot) || [];
                // 对于洛谷结果，去除开头形如 [xxx] 的前缀再作为匹配标题
                const normalized = (arr || []).map(it => {
                    const rawTitle = it.title || it.name || '';
                    // 去除一个或多个连续的方括号前缀，例如 [ICPC 2018 WF] Gem Island 或 [A][B] Name
                    const cleanedTitle = String(rawTitle).replace(/^\s*(?:\[[^\]]+\]\s*)+/, '');
                    return {
                        title: cleanedTitle,
                        originalTitle: rawTitle,
                        pid: it.pid || it.probNum || it.id || it.problemId || '',
                        url: it.url || (it.pid ? `https://www.luogu.com.cn/problem/${it.pid}` : ''),
                        type: it.type || 'LUOGU'
                    };
                });

                cb(null, normalized);
            } catch (e) {
                cb(e);
            }
        });
    }

    // ----- 在 QOJ 上搜索并解析问题列表页 -----
    function searchOnQOJ(title, cb) {
        const q = encodeURIComponent(title || '');
        const url = `https://qoj.ac/problems?search=${q}`;
        httpGetText(url, (err, text) => {
            if (err) return cb(err);
            try {
                let parser;
                try { parser = new DOMParser(); } catch (e) { parser = null; }
                if (parser) {
                    const doc = parser.parseFromString(text, 'text/html');
                    const rows = doc.querySelectorAll('table.table tbody tr');
                    const results = [];
                    rows.forEach(tr => {
                        try {
                            const tds = tr.querySelectorAll('td');
                            if (!tds || tds.length < 2) return;
                            const idText = (tds[0].textContent || '').trim();
                            const idMatch = idText.match(/#?(\d+)/);
                            const pid = idMatch ? idMatch[1] : null;
                            const a = tds[1].querySelector('a');
                            const titleText = a ? (a.textContent || '').trim() : '';
                            const href = a ? a.getAttribute('href') : null;
                            const urlAbs = href ? (href.startsWith('http') ? href : `https://qoj.ac${href}`) : (pid ? `https://qoj.ac/problem/${encodeURIComponent(pid)}` : '');
                            if (titleText) {
                                results.push({ title: titleText, pid: pid, url: urlAbs, type: 'QOJ' });
                            }
                        } catch (e) { }
                    });
                    return cb(null, results);
                } else {
                    const rowRe = /<tr[\s\S]*?>[\s\S]*?<td[^>]*>\s*#?(\d+)\s*<\/td>[\s\S]*?<td[^>]*>[\s\S]*?<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
                    const results = [];
                    let m;
                    while ((m = rowRe.exec(text)) !== null) {
                        const pid = m[1];
                        const href = m[2];
                        const titleText = m[3].trim();
                        const urlAbs = href.startsWith('http') ? href : `https://qoj.ac${href}`;
                        results.push({ title: titleText, pid: pid, url: urlAbs, type: 'QOJ' });
                    }
                    return cb(null, results);
                }
            } catch (e) {
                cb(e);
            }
        });
    }

    // ----- 在 UOJ 上搜索并解析问题列表页 -----
    function searchOnUOJ(title, cb) {
        const q = encodeURIComponent(title || '');
        const url = `https://uoj.ac/problems?search=${q}`;
        httpGetText(url, (err, text) => {
            if (err) return cb(err);
            try {
                let parser;
                try { parser = new DOMParser(); } catch (e) { parser = null; }
                if (parser) {
                    const doc = parser.parseFromString(text, 'text/html');
                    const rows = doc.querySelectorAll('table.table tbody tr');
                    const results = [];
                    rows.forEach(tr => {
                        try {
                            const tds = tr.querySelectorAll('td');
                            if (!tds || tds.length < 2) return;
                            const idText = (tds[0].textContent || '').trim();
                            const idMatch = idText.match(/#?(\d+)/);
                            const pid = idMatch ? idMatch[1] : null;
                            const a = tds[1].querySelector('a');
                            const titleText = a ? (a.textContent || '').trim() : '';
                            const href = a ? a.getAttribute('href') : null;
                            const urlAbs = href ? (href.startsWith('http') ? href : `https://uoj.ac${href}`) : (pid ? `https://uoj.ac/problem/${encodeURIComponent(pid)}` : '');
                            if (titleText) {
                                results.push({ title: titleText, pid: pid, url: urlAbs, type: 'UOJ' });
                            }
                        } catch (e) { }
                    });
                    return cb(null, results);
                } else {
                    const rowRe = /<tr[\s\S]*?>[\s\S]*?<td[^>]*>\s*#?(\d+)\s*<\/td>[\s\S]*?<td[^>]*>[\s\S]*?<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
                    const results = [];
                    let m;
                    while ((m = rowRe.exec(text)) !== null) {
                        const pid = m[1];
                        const href = m[2];
                        const titleText = m[3].trim();
                        const urlAbs = href.startsWith('http') ? href : `https://uoj.ac${href}`;
                        results.push({ title: titleText, pid: pid, url: urlAbs, type: 'UOJ' });
                    }
                    return cb(null, results);
                }
            } catch (e) {
                cb(e);
            }
        });
    }

    // 新的 searchOnLOJ：使用 LOJ 的官方查询 API（POST JSON）
    function searchOnLOJ(title, cb) {
        const url = 'https://api.loj.ac/api/problem/queryProblemSet';
        const bodyObj = { locale: 'zh_CN', skipCount: 0, takeCount: 50, keyword: title || '' };
        const bodyText = JSON.stringify(bodyObj);

        // 首选 GM 跨域请求（Tampermonkey/Violentmonkey 支持）
        const doCallbackWithError = (err) => {
            try { cb(err, []); } catch (e) { console.error('searchOnLOJ cb error', e); }
        };

        try {
            if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function') {
                GM.xmlHttpRequest({
                    method: 'POST',
                    url: url,
                    data: bodyText,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    onload: function (res) {
                        try {
                            const text = res.responseText || '';
                            const json = JSON.parse(text);
                            if (!json || !Array.isArray(json.result)) return cb(null, []);
                            const results = (json.result || []).map(item => {
                                const meta = item.meta || {};
                                // 优先使用 displayId 做显示 pid，如需改为 meta.id 可以调整
                                const pid = (meta.displayId !== undefined && meta.displayId !== null) ? String(meta.displayId) : (meta.id ? String(meta.id) : null);
                                const idForUrl = meta.id ? String(meta.id) : pid;
                                const urlAbs = idForUrl ? `https://loj.ac/problem/${encodeURIComponent(idForUrl)}` : null;
                                return {
                                    title: item.title || '',
                                    pid: pid,
                                    url: urlAbs,
                                    type: 'LOJ',
                                    meta: meta
                                };
                            }).filter(r => r.title);
                            return cb(null, results);
                        } catch (e) {
                            console.warn('searchOnLOJ: parse error, falling back', e);
                            return doFallbackHtmlParse();
                        }
                    },
                    onerror: function (err) {
                        console.warn('searchOnLOJ: GM xmlHttpRequest error', err);
                        return doFallbackHtmlParse();
                    },
                    ontimeout: function () {
                        console.warn('searchOnLOJ: GM xmlHttpRequest timeout');
                        return doFallbackHtmlParse();
                    },
                    timeout: 15000
                });
                return;
            }
        } catch (e) {
            console.warn('searchOnLOJ: GM.xmlHttpRequest not available', e);
        }

        // fallback: fetch POST (可能受 CORS/凭据限制)
        function tryFetchFallback() {
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: bodyText,
                mode: 'cors', // 注意：可能受 CORS/凭据限制
                credentials: 'omit'
            }).then(r => r.text()).then(t => {
                try {
                    const json = JSON.parse(t);
                    if (!json || !Array.isArray(json.result)) return cb(null, []);
                    const results = (json.result || []).map(item => {
                        const meta = item.meta || {};
                        const pid = (meta.displayId !== undefined && meta.displayId !== null) ? String(meta.displayId) : (meta.id ? String(meta.id) : null);
                        const idForUrl = meta.id ? String(meta.id) : pid;
                        const urlAbs = idForUrl ? `https://loj.ac/problem/${encodeURIComponent(idForUrl)}` : null;
                        return {
                            title: item.title || '',
                            pid: pid,
                            url: urlAbs,
                            type: 'LOJ',
                            meta: meta
                        };
                    }).filter(r => r.title);
                    return cb(null, results);
                } catch (e) {
                    console.warn('searchOnLOJ: fetch parse error', e);
                    return doFallbackHtmlParse();
                }
            }).catch(err => {
                console.warn('searchOnLOJ: fetch error', err);
                return doFallbackHtmlParse();
            });
        }

        // 兜底：如果 API 不可用（被 CORS / token 问题阻止），回退到尝试抓取 loj.ac HTML 或旧的 loj 解析
        function doFallbackHtmlParse() {
            // 尝试从公开 loj.ac/problems?search=... 页面抓表格或 /problem/ 链接
            const fallbackUrl = `https://loj.ac/problems?search=${encodeURIComponent(title || '')}`;
            httpGetText(fallbackUrl, (err, text) => {
                if (err || !text) return doCallbackWithError(err || new Error('LOJ API and fallback both failed'));
                try {
                    let parser;
                    try { parser = new DOMParser(); } catch (e) { parser = null; }
                    if (parser) {
                        const doc = parser.parseFromString(text, 'text/html');
                        const rows = doc.querySelectorAll('table.table tbody tr');
                        const results = [];
                        rows.forEach(tr => {
                            try {
                                const tds = tr.querySelectorAll('td');
                                if (!tds || tds.length < 2) return;
                                const idText = (tds[0].textContent || '').trim();
                                const idMatch = idText.match(/#?(\d+)/);
                                const pid = idMatch ? idMatch[1] : null;
                                const a = tds[1].querySelector('a');
                                const titleText = a ? (a.textContent || '').trim() : '';
                                const href = a ? a.getAttribute('href') : null;
                                const urlAbs = href ? (href.startsWith('http') ? href : `https://loj.ac${href}`) : (pid ? `https://loj.ac/problem/${encodeURIComponent(pid)}` : '');
                                if (titleText) results.push({ title: titleText, pid: pid, url: urlAbs, type: 'LOJ' });
                            } catch (e) { }
                        });
                        if (results.length > 0) return cb(null, results);
                    }
                    // 正则兜底匹配 /problem/<id> 链接
                    const rowRe = /<a[^>]*href=["']([^"']*\/problem\/(\d+)[^"']*)["'][^>]*>([^<]+)<\/a>/gi;
                    const results2 = [];
                    let m;
                    while ((m = rowRe.exec(text)) !== null) {
                        const href = m[1];
                        const pid = m[2];
                        const titleText = m[3].trim();
                        const urlAbs = href.startsWith('http') ? href : `https://loj.ac${href}`;
                        results2.push({ title: titleText, pid: pid, url: urlAbs, type: 'LOJ' });
                    }
                    if (results2.length > 0) return cb(null, results2);
                    return doCallbackWithError(new Error('LOJ fallback parse found nothing'));
                } catch (e) {
                    return doCallbackWithError(e);
                }
            });
        }

        // 如果 GM 请求不可用，先用 fetch 再兜底
        tryFetchFallback();
    }

    // ----- 统一入口：并行查询洛谷 + UOJ + QOJ + LOJ，合并结果 (优先顺序：LUOGU, UOJ, QOJ, LOJ) -----
    function performUnifiedSearch(payload, cb) {
        if (!payload || !payload.title) return cb(new Error('invalid payload'));
        const sources = [
            { fn: (cb2) => searchOnLuogu(payload.title, payload.type || '', cb2), name: 'LUOGU' },
            { fn: (cb2) => searchOnUOJ(payload.title, cb2), name: 'UOJ' },
            { fn: (cb2) => searchOnQOJ(payload.title, cb2), name: 'QOJ' },
            { fn: (cb2) => searchOnLOJ(payload.title, cb2), name: 'LOJ' }
        ];
        const resultsBySource = {};
        let remaining = sources.length;
        let anyErr = null;

        sources.forEach(s => {
            try {
                s.fn((err, arr) => {
                    if (err) anyErr = anyErr || err;
                    resultsBySource[s.name] = (arr || []);
                    remaining--;
                    if (remaining === 0) finalize();
                });
            } catch (e) {
                anyErr = anyErr || e;
                resultsBySource[s.name] = [];
                remaining--;
                if (remaining === 0) finalize();
            }
        });

        function finalize() {
            // 按优先级合并并去重（优先顺序：LUOGU, UOJ, QOJ, LOJ）
            const order = ['LUOGU', 'UOJ', 'QOJ', 'LOJ'];
            const combined = [];
            // 使用标题规范化、url、pid 三条线索去重，标题规范化为首要判断
            const seenTitles = new Set();
            const seenUrls = new Set();
            const seenPids = new Set();

            order.forEach(src => {
                (resultsBySource[src] || []).forEach(it => {
                    if (!it) return;
                    const titleNorm = it.title ? String(it.title).trim().toLowerCase() : '';
                    const url = it.url ? String(it.url).trim() : '';
                    const pid = (it.pid !== undefined && it.pid !== null) ? String(it.pid).trim() : '';

                    // 如果标题已有优先来源，则跳过
                    if (titleNorm && seenTitles.has(titleNorm)) return;
                    // 否则如果 url 或 pid 已存在也跳过
                    if (url && seenUrls.has(url)) return;
                    if (pid && seenPids.has(pid)) return;

                    // 否则保留该条目，并标记这些键
                    combined.push(it);
                    if (titleNorm) seenTitles.add(titleNorm);
                    if (url) seenUrls.add(url);
                    if (pid) seenPids.add(pid);
                });
            });

            // 如果合并为空但有错误，返回错误（便于调试）
            if (combined.length === 0 && anyErr) return cb(anyErr);
            const shaped = { data: { problems: { result: (combined || []).map(it => ({ title: it.title, pid: it.pid, url: it.url, type: it.type })) } } };
            cb(null, shaped);
        }
    }

    // ----- utility: get problem letter from hash -----
    function getProblemLetterFromHash() {
        const m = location.hash.match(/#problem\/([^/?&]+)/);
        return m ? m[1] : null;
    }

    // ----- core handler -----
    function handleUpdate(force = false) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            try {
                const letter = getProblemLetterFromHash();
                if (!letter) { const ex = document.getElementById(ANCHOR_CONTAINER_ID); if (ex) ex.remove(); return; }

                const data = parseDataJsonSafely();
                if (!data || !Array.isArray(data.problems)) { const ex2 = document.getElementById(ANCHOR_CONTAINER_ID); if (ex2) ex2.remove(); return; }

                const target = data.problems.find(p => {
                    if (!p) return false;
                    if (p.num && String(p.num).toUpperCase() === String(letter).toUpperCase()) return true;
                    if (p.num && String(p.num).toUpperCase().includes(String(letter).toUpperCase())) return true;
                    return false;
                }) || null;

                if (!target) { const ex = document.getElementById(ANCHOR_CONTAINER_ID); if (ex) ex.remove(); return; }

                const title = target.title || (target.name ? target.name : '');
                const type = (target && target.oj) ? String(target.oj) : (target && target.source ? String(target.source) : '');
                if (!title) { createOrUpdateContainer('原题：无法识别题目标题', null, null, 'error'); return; }

                createOrUpdateContainer('原题：正在搜索…（洛谷 / UOJ / QOJ / LOJ）', null, '', 'loading');

                const payload = { type: type || '', title: title };
                const thisRequestId = ++currentRequestId;
                pendingRequestId = thisRequestId;

                performUnifiedSearch(payload, (err, resJson) => {
                    if (pendingRequestId !== thisRequestId) return;
                    pendingRequestId = null;

                    if (err) {
                        console.warn('vjudge-vjs: unified search error', err);
                        createOrUpdateContainer('原题：搜索失败或解析异常', null, null, 'error');
                        return;
                    }

                    try {
                        const resultArr = (resJson && resJson.data && resJson.data.problems && resJson.data.problems.result) ? resJson.data.problems.result : null;
                        if (!Array.isArray(resultArr) || resultArr.length === 0) {
                            createOrUpdateContainer('原题：未找到匹配结果（洛谷/UOJ/QOJ/LOJ）', null, null, 'error');
                            return;
                        }

                        // 尽量找标题完全匹配（先精确，再忽略大小写，再取第一个）
                        let match = resultArr.find(x => x && x.title && String(x.title) === String(title));
                        if (!match) match = resultArr.find(x => x && x.title && String(x.title).toLowerCase() === String(title).toLowerCase());
                        if (!match) match = resultArr[0];

                        const pid = match && (match.pid || match.probNum || match.id || match.problemId) ? (match.pid || match.probNum || match.id || match.problemId) : null;
                        const mtype = (match && match.type) ? String(match.type).toUpperCase() : '';
                        if (mtype.includes('UOJ') && pid) {
                            const uojLink = match.url || `https://uoj.ac/problem/${encodeURIComponent(pid)}`;
                            createOrUpdateContainer(`原题: UOJ ${pid}`, uojLink, `UOJ - ${pid}`, 'success');
                        } else if (mtype.includes('QOJ') && pid) {
                            const qojLink = match.url || `https://qoj.ac/problem/${encodeURIComponent(pid)}`;
                            createOrUpdateContainer(`原题: QOJ ${pid}`, qojLink, `QOJ - ${pid}`, 'success');
                        } else if (mtype.includes('LOJ') && pid) {
                            const lojLink = match.url || `https://loj.ac/problem/${encodeURIComponent(pid)}`;
                            createOrUpdateContainer(`原题: LOJ ${pid}`, lojLink, `LOJ - ${pid}`, 'success');
                        } else if (mtype.includes('LUOGU') && pid) {
                            const luoguLink = match.url || `https://www.luogu.com.cn/problem/${encodeURIComponent(pid)}`;
                            createOrUpdateContainer(`原题: ${pid}`, luoguLink, `LUOGU - ${pid}`, 'success');
                        } else if (match && match.url) {
                            createOrUpdateContainer(`原题: ${match.title || '候选'}`, match.url, `${match.type || payload.type || ''}`, 'success');
                        } else if (pid) {
                            // 无法确定来源但有 pid，尝试构造常见链接（先 UOJ/QOJ/LOJ/LOUGU）
                            const tryUrls = [
                                `https://uoj.ac/problem/${encodeURIComponent(pid)}`,
                                `https://qoj.ac/problem/${encodeURIComponent(pid)}`,
                                `https://loj.ac/problem/${encodeURIComponent(pid)}`,
                                `https://www.luogu.com.cn/problem/${encodeURIComponent(pid)}`
                            ];
                            createOrUpdateContainer(`原题: ${pid}`, tryUrls[0], `尝试：${tryUrls.join(' / ')}`, 'success');
                        } else {
                            createOrUpdateContainer('原题：找到候选但无 pid/url 字段', null, null, 'error');
                        }

                    } catch (e) {
                        console.error('vjudge-vjs: parse response error', e);
                        createOrUpdateContainer('原题：结果处理异常', null, null, 'error');
                    }
                });

            } catch (err) {
                console.error('vjudge-vjs: handleUpdate error', err);
            }
        }, DEBOUNCE_MS);
    }

    // ----- observers -----
    function startTitleObserver() {
        stopTitleObserver();
        const titleEl = document.getElementById('prob-title-contest');
        if (!titleEl) return;
        titleObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.addedNodes) {
                    for (const n of m.addedNodes) {
                        if (n && n.id === ANCHOR_CONTAINER_ID) return;
                        if (n && n.querySelector && n.querySelector(`#${ANCHOR_CONTAINER_ID}`)) return;
                    }
                }
            }
            handleUpdate();
        });
        titleObserver.observe(titleEl, { childList: true, subtree: true, characterData: true });
    }

    function stopTitleObserver() { if (titleObserver) { try { titleObserver.disconnect(); } catch (e) { } titleObserver = null; } }

    function startBodyObserver() {
        if (bodyObserver) return;
        bodyObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.addedNodes) {
                    for (const n of m.addedNodes) {
                        if (n && n.querySelector && n.querySelector('#prob-title-contest')) {
                            setTimeout(() => { startTitleObserver(); handleUpdate(); }, 30);
                            return;
                        }
                        if (n && n.id === 'prob-title-contest') {
                            setTimeout(() => { startTitleObserver(); handleUpdate(); }, 30);
                            return;
                        }
                    }
                }
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    }

    function stopBodyObserver() { if (bodyObserver) { try { bodyObserver.disconnect(); } catch (e) { } bodyObserver = null; } }

    function tryInit(retries = 12) {
        const titleEl = document.getElementById('prob-title-contest');
        if (titleEl) {
            startTitleObserver();
            startBodyObserver();
            handleUpdate();
        } else if (retries > 0) {
            setTimeout(() => tryInit(retries - 1), 250);
        } else {
            startBodyObserver();
        }
    }

    window.addEventListener('hashchange', () => { setTimeout(handleUpdate, 80); });

    tryInit();

    // cleanup
    window.__vjudge_vjs_cleanup = function () {
        stopTitleObserver();
        stopBodyObserver();
        const ex = document.getElementById(ANCHOR_CONTAINER_ID);
        if (ex) ex.remove();
        console.info('vjudge-vjs: cleaned up');
    };

})();