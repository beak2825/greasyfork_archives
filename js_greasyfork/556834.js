// ==UserScript==
// @name         Radarr/Sonarr - Interactive Search NFO Viewer (only supports omgwtfnzbs)
// @name:zh-CN   Radarr/Sonarr - Interactive Search NFO Viewer (only supports omgwtfnzbs)
// @namespace    http://tampermonkey.net/
// @version      2.9.2
// @description  Interactive Search NFO Viewer. 支持 ASCII Art 装饰风格的 NFO，深度优化 MediaInfo/BDInfo 字幕解析，严格限制 API 调用。支持指定特定站点运行。
// @description:zh-CN Interactive Search NFO Viewer. 支持 ASCII Art 装饰风格的 NFO，深度优化 MediaInfo/BDInfo 字幕解析，严格限制 API 调用。支持指定特定站点运行。
// @description:en Interactive Search NFO Viewer. Supports ASCII Art decorated NFO, optimizes MediaInfo/BDInfo subtitle parsing, strictly limits API calls, and supports running on specific sites only.
// @author       Gemini 3
// @license      MIT
// @match        http://localhost:8989/*
// @match        http://localhost:7878/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.omgwtfnzbs.org
// @connect      omgwtfnzbs.org
// @connect      localhost
// @connect      127.0.0.1
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556834/RadarrSonarr%20-%20Interactive%20Search%20NFO%20Viewer%20%28only%20supports%20omgwtfnzbs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556834/RadarrSonarr%20-%20Interactive%20Search%20NFO%20Viewer%20%28only%20supports%20omgwtfnzbs%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /************************** 默认配置 **************************/
    const DEFAULTS = {
        USE_PROXY: false,
        PROXY_URL: "http://localhost:8989/proxy?url=",
        API_KEY: "",
        CACHE_TTL_HOURS: 24,
        BUTTON_TEXT: "NFO",
        // 默认关心: 中文(简/繁)、英文
        TARGET_LANGS: ['CHS', 'CHT', 'ENG']
    };
    const SETTINGS_KEY = 'tm_nfo_settings_v3';

    /************************** 基础工具 **************************/
    function loadSettings() {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (!raw) return { ...DEFAULTS };
            return Object.assign({}, DEFAULTS, JSON.parse(raw));
        } catch (e) { return { ...DEFAULTS }; }
    }
    function saveSettings(obj) {
        const toSave = Object.assign({}, loadSettings(), obj);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(toSave));
    }
    let SETTINGS = loadSettings();

    // 语言映射表
    const LANG_MAP = {
        'chinese': 'CHS', 'chi': 'CHS', 'zho': 'CHS', 'chs': 'CHS', 'sc': 'CHS', 'cn': 'CHS',
        'simplified': 'CHS', 'hans': 'CHS', 'mandarin': 'CHS', 'sg': 'CHS',
        'traditional': 'CHT', 'cht': 'CHT', 'tc': 'CHT', 'tw': 'CHT', 'hant': 'CHT',
        'cantonese': 'CHT', 'hong': 'CHT', 'kong': 'CHT', 'hk': 'CHT',
        'english': 'ENG', 'eng': 'ENG', 'en': 'ENG', 'ing': 'ENG', 'us': 'ENG', 'uk': 'ENG',
        'japanese': 'JPN', 'jap': 'JPN', 'jpn': 'JPN', 'jp': 'JPN',
        'korean': 'KOR', 'kor': 'KOR', 'kr': 'KOR',
        'french': 'FRE', 'fre': 'FRE', 'fr': 'FRE', 'fra': 'FRE', 'vff': 'FRE',
        'spanish': 'SPA', 'spa': 'SPA', 'es': 'SPA', 'esp': 'SPA', 'latin': 'SPA',
        'german': 'GER', 'ger': 'GER', 'de': 'GER', 'deutsch': 'GER',
        'italian': 'ITA', 'ita': 'ITA', 'it': 'ITA',
        'russian': 'RUS', 'rus': 'RUS', 'ru': 'RUS',
        'portuguese': 'POR', 'por': 'POR', 'pt': 'POR', 'br': 'POR', 'brazil': 'POR',
        'dutch': 'DUT', 'dut': 'DUT', 'nl': 'DUT',
        'polish': 'POL', 'pol': 'POL', 'pl': 'POL',
        'bulgarian': 'BUL', 'bul': 'BUL', 'bg': 'BUL',
        'catalan': 'CAT', 'cat': 'CAT',
        'czech': 'CZE', 'cze': 'CZE', 'cz': 'CZE',
        'danish': 'DAN', 'dan': 'DAN', 'da': 'DAN',
        'greek': 'GRE', 'gre': 'GRE', 'el': 'GRE',
        'estonian': 'EST', 'est': 'EST', 'et': 'EST',
        'finnish': 'FIN', 'fin': 'FIN', 'fi': 'FIN',
        'hebrew': 'HEB', 'heb': 'HEB',
        'croatian': 'HRV', 'hrv': 'HRV', 'hr': 'HRV',
        'hungarian': 'HUN', 'hun': 'HUN', 'hu': 'HUN',
        'indonesian': 'IND', 'ind': 'IND', 'id': 'IND',
        'icelandic': 'ICE', 'ice': 'ICE', 'is': 'ICE',
        'lithuanian': 'LIT', 'lit': 'LIT', 'lt': 'LIT',
        'latvian': 'LAT', 'lat': 'LAT', 'lv': 'LAT',
        'macedonian': 'MAC', 'mac': 'MAC', 'mk': 'MAC',
        'malay': 'MAL', 'may': 'MAL', 'ms': 'MAL', 'my': 'MAL',
        'norwegian': 'NOR', 'nor': 'NOR', 'no': 'NOR', 'bokmal': 'NOR',
        'romanian': 'ROM', 'rum': 'ROM', 'ro': 'ROM',
        'slovak': 'SLO', 'slo': 'SLO', 'sk': 'SLO',
        'slovenian': 'SLV', 'slv': 'SLV', 'si': 'SLV',
        'serbian': 'SRP', 'srp': 'SRP', 'sr': 'SRP',
        'swedish': 'SWE', 'swe': 'SWE', 'sv': 'SWE',
        'thai': 'THA', 'tha': 'THA', 'th': 'THA',
        'turkish': 'TUR', 'tur': 'TUR', 'tr': 'TUR',
        'ukrainian': 'UKR', 'ukr': 'UKR', 'ua': 'UKR',
        'vietnamese': 'VIE', 'vie': 'VIE', 'vi': 'VIE'
    };

    /************************** CSS 样式 **************************/
    GM_addStyle(`
        .tm-nfo-col-header { width: 70px; text-align: center !important; }
        .tm-nfo-col-cell { text-align: center !important; vertical-align: middle !important; }

        .tm_nfo_button_v3 {
            display: inline-block; box-sizing: border-box;
            background-color: #3b82f6 !important; color: #ffffff !important;
            border: 1px solid #2563eb !important; border-radius: 4px;
            padding: 4px 10px; font-size: 11px; font-weight: 700;
            cursor: pointer; line-height: 1.2; box-shadow: 0 1px 2px rgba(0,0,0,0.15);
            transition: all 0.2s ease; text-transform: uppercase; font-family: inherit;
        }
        .tm_nfo_button_v3:hover { background-color: #2563eb !important; transform: translateY(-1px); box-shadow: 0 3px 6px rgba(0,0,0,0.2); }
        .tm_nfo_button_v3:active { transform: translateY(0); }
        .tm_nfo_button_v3:disabled {
            background-color: #64748b !important; border-color: #475569 !important;
            color: #cbd5e1 !important; cursor: not-allowed; transform: none; box-shadow: none;
        }
        .tm_nfo_button_nonfo {
            background-color: #334155 !important; border-color: #1e293b !important; opacity: 0.7; color: #94a3b8 !important; cursor: default !important;
        }
        .tm_nfo_badge_dot {
            display: block; width: 8px; height: 8px; border-radius: 50%;
            position: absolute; top: -3px; right: -3px; border: 1px solid #fff;
        }
        .tm_badget_hit { background-color: #4ade80; box-shadow: 0 0 4px #4ade80; }
        .tm_badget_miss { background-color: #facc15; }

        .tm_sub_tag {
            display: inline-block; padding: 2px 6px; border-radius: 4px;
            font-size: 11px; font-weight: bold; margin-right: 6px;
            background: #374151; color: #d1d5db; border: 1px solid #4b5563;
        }
        .tm_sub_tag.highlight {
            background: #059669; color: #ffffff; border-color: #10b981;
        }
    `);

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
    function cacheKey(id) { return `tm_nfo_c_${id}`; }

    function setCache(id, text) {
        try { localStorage.setItem(cacheKey(id), JSON.stringify({ t: Date.now(), text })); } catch (e) {}
    }

    function getCache(id) {
        try {
            const raw = localStorage.getItem(cacheKey(id));
            if (!raw) return null;
            const obj = JSON.parse(raw);
            if ((Date.now() - obj.t) / (36e5) > SETTINGS.CACHE_TTL_HOURS) { localStorage.removeItem(cacheKey(id)); return null; }
            return obj.text;
        } catch (e) { return null; }
    }

    function gmFetch(url) {
        if (SETTINGS.API_KEY && !url.includes('apikey=')) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}apikey=${SETTINGS.API_KEY}`;
        }
        const finalUrl = SETTINGS.USE_PROXY ? (SETTINGS.PROXY_URL + encodeURIComponent(url)) : url;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: finalUrl, timeout: 20000,
                onload: res => resolve(res),
                onerror: err => reject(err),
                ontimeout: () => reject(new Error('timeout'))
            });
        });
    }

    /************************** NFO 解析器 **************************/
    function stripTags(s) { return s.replace(/<\s*br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, ""); }
    function decodeHtmlEntities(str) {
        if (!str) return str;
        const txt = document.createElement("textarea");
        txt.innerHTML = str;
        return txt.value;
    }

    function isNoNfo(text) {
        if (!text || text.length < 15) return true;
        if (/Sorry no \.NFO/i.test(text)) return true;
        if (/NFO Information Unavailable/i.test(text)) return true;
        if (/No NFO file found/i.test(text)) return true;
        return false;
    }

    function parseNfoSummary(nfoText) {
        const safe = (nfoText || '').replace(/\r/g, '\n');
        const lines = safe.split(/\n/);
        const foundSubs = new Set();
        let inSubBlock = false; // 是否在字幕块（多行模式）

        // 正则解释:
        // 1. (?:^|[\s@*>\-#\|\[\]]+): 行首可以有空白、装饰符、括号
        // 2. (?:SUBTITLES?|SUBS?|TEXT|CAPTIONS?|字幕|Sous-titre(?:s)?|Untertiteln?): 核心关键词
        // 3. (?:[\s\.]*\d*:?)?: 可选的数字编号 (如 "Subs: 38:")
        // 4. (?:[\s\.]*[:=\-\|]): 分隔符，允许前面有很多点 (针对 ZeroTwo 格式: [Subtitles]............:)
        // 5. (.*): 捕获内容
        const regexSubLine = /^(?:[\s@*>\-#\|\[\]]*)(?:SUBTITLES?|SUBS?|TEXT|CAPTIONS?|字幕|Sous-titre(?:s)?|Untertiteln?)(?:\]?)(?:[\s\.]*(?:\d+)?[\s\.]*)?[:=\-\|]\s*(.*)/i;

        // BDInfo 格式 (Presentation Graphics 等)
        const regexBDInfo = /^(?:Presentation Graphics|PGS|SupRip|Subtitle|Text)\s+([a-zA-Z]+)(?:\s+\d+|\s*$)/i;
        const regexBlockHeader = /^(?:Text|Subtitle|Sous-titre)(?:\s*#\d+)?$/i; // MediaInfo 块标题
        const regexProperty = /^(?:Title|Language|Langue|Sprache)\s*[:\.]\s*(.*)/i; // MediaInfo 属性

        for (let i = 0; i < lines.length && i < 800; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            if (!trimmed) {
                // 空行可能意味着字幕块结束，但有些 NFO 会用空行分隔，先不强制结束 inSubBlock，除非遇到新的 key
                if (inSubBlock && i + 1 < lines.length) {
                    // 如果下一行看起来像新的 Key (包含 :)，则结束
                    if (lines[i+1].includes(':') && !lines[i+1].startsWith(' ')) inSubBlock = false;
                }
                continue;
            }

            // 1. 处理 BDInfo/MediaInfo 块模式
            if (regexBlockHeader.test(trimmed)) {
                // 进入 MediaInfo 详情块，寻找 Language
                // 这里简单处理：往下读几行找 Language
                for (let k = 1; k < 10; k++) {
                    if (i + k >= lines.length) break;
                    const nextLine = lines[i+k];
                    const mProp = nextLine.match(regexProperty);
                    if (mProp && mProp[1]) {
                        parseAndAdd(mProp[1], foundSubs);
                    }
                    if (!nextLine.trim()) break; // 空行退出块
                }
                continue;
            }

            // 2. 处理单行 BDInfo 格式 (e.g. "Presentation Graphics English ...")
            const mBD = trimmed.match(regexBDInfo);
            if (mBD && mBD[1]) {
                mapAndAdd(mBD[1], foundSubs);
                continue;
            }

            // 3. 处理常规 Key: Value 模式 (包括 ZeroTwo 和 ETHEL 格式)
            const mSub = line.match(regexSubLine);
            if (mSub) {
                const content = mSub[1];
                // 移除可能的计数器前缀 (如 "38: English")
                const cleanContent = content.replace(/^\s*\d+\s*:\s*/, '');
                parseAndAdd(cleanContent, foundSubs);
                inSubBlock = true; // 标记可能进入多行字幕列表
                continue;
            }

            // 4. 处理多行列表延续 (针对 ETHEL 格式)
            // 如果上一行是字幕行，且当前行有明显缩进，且不包含新的 Key (冒号)
            if (inSubBlock) {
                // 判定延续行：以空格/tab开头，或者虽然没有缩进但全是语言词汇
                const isIndented = /^\s+/.test(line);
                const hasColon = line.includes(':');

                if (isIndented && !hasColon) {
                    parseAndAdd(trimmed, foundSubs);
                    continue;
                } else {
                    // 如果不符合延续条件，关闭 flag
                    inSubBlock = false;
                }
            }
        }

        // 兜底检测：如果没找到任何字幕，尝试全文搜索文件名或常见标签
        if (foundSubs.size === 0) {
            if (/简体|Chinese|CHS/i.test(safe)) mapAndAdd('CHS', foundSubs);
            else if (/繁体|Traditional|CHT/i.test(safe)) mapAndAdd('CHT', foundSubs);
            if (/Japanese|JPN/i.test(safe)) mapAndAdd('JPN', foundSubs);
        }

        return { subs: Array.from(foundSubs) };
    }

    function parseAndAdd(text, setObj) {
        if (!text) return;
        // 移除干扰词
        let s = text.replace(/\d+\.?\d*\s*kbps/gi, '')
                    .replace(/[\(\[\{].*?[\)\]\}]/g, ' ') // 移除括号内容 (SDH), (forced)
                    .replace(/[^\w\s,\.\-\/&]/g, ' '); // 移除非文字字符，保留分隔符

        // 分割符：逗号、斜杠、点号(如果在单词间)、空格(如果很多)
        const tokens = s.split(/[ \/,\.\-\_&]+/);
        tokens.forEach(t => mapAndAdd(t, setObj));
    }

    function mapAndAdd(rawToken, setObj) {
        if (!rawToken || rawToken.length > 20) return;
        const lower = rawToken.trim().toLowerCase();
        if (lower.length < 2) return;
        // 过滤垃圾词
        if (/kbps|bit|fps|forced|default|yes|no|complete|main|plain|utf|text|sdh|cc|comment|title/i.test(lower)) return;

        // 1. 精确匹配
        if (LANG_MAP[lower]) {
            setObj.add(LANG_MAP[lower]);
            return;
        }
        // 2. 前缀匹配 (处理像 "Portuguese (Brazil)" 这种漏网之鱼)
        for (const k in LANG_MAP) {
            if (lower === k) {
                setObj.add(LANG_MAP[k]);
                return;
            }
        }
        // 3. 再次尝试前缀匹配
        for (const k in LANG_MAP) {
            if (lower.startsWith(k)) {
                setObj.add(LANG_MAP[k]);
                return;
            }
        }
    }

    function extractNfoFromHtml(htmlText) {
        if (!htmlText) return null;
        const regexes = [
            /<pre[^>]*>([\s\S]*?)<\/pre>/i,
            /<textarea[^>]*>([\s\S]*?)<\/textarea>/i,
            /<div[^>]*(?:class|id)\s*=\s*["']?([^"'>]*nfo[^"'>]*)["']?[^>]*>([\s\S]*?)<\/div>/i,
            /<description[^>]*>([\s\S]*?)<\/description>/i
        ];
        for (const r of regexes) { const m = htmlText.match(r); if (m && m[1] && m[1].length > 10) return decodeHtmlEntities(stripTags(m[1])); }
        const xmlNfo = htmlText.match(/<nfo[^>]*>([\s\S]*?)<\/nfo>/i);
        if (xmlNfo) return decodeHtmlEntities(stripTags(xmlNfo[1]));
        const cleaned = stripTags(htmlText);
        if (/SUBTITLE|AUDIO|VIDEO|字幕|MKV|x264|x265|HEVC|Bluray/i.test(cleaned)) return cleaned.substring(0, 30000);
        return null;
    }

    /************************** UI 展示 **************************/
    function showNfoModal(title, text, summary) {
        const id = 'tm_nfo_modal_v3';
        if (document.getElementById(id)) document.getElementById(id).remove();

        const modal = document.createElement('div');
        modal.id = id;
        Object.assign(modal.style, {
            position: 'fixed', left: 0, top: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', zIndex: 999999,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        });

        const content = document.createElement('div');
        Object.assign(content.style, {
            background: '#1f2937', color: '#f3f4f6', width: '85%', maxWidth: '1100px',
            maxHeight: '85vh', borderRadius: '8px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)', fontFamily: 'monospace'
        });

        const header = document.createElement('div');
        header.style.cssText = 'padding:16px;border-bottom:1px solid #374151;display:flex;justify-content:space-between;align-items:center;';

        const userTargets = SETTINGS.TARGET_LANGS || [];
        let subsHtml = '';
        let hitCount = 0;
        let otherSubs = [];
        const sortedSubs = summary.subs.sort((a, b) => {
            const aHit = userTargets.includes(a);
            const bHit = userTargets.includes(b);
            if (aHit && !bHit) return -1;
            if (!aHit && bHit) return 1;
            return a.localeCompare(b);
        });

        sortedSubs.forEach(sub => {
            if (userTargets.includes(sub)) {
                subsHtml += `<span class="tm_sub_tag highlight">${sub}</span>`;
                hitCount++;
            } else {
                otherSubs.push(sub);
            }
        });

        if (summary.subs.length === 0) {
            subsHtml = `<span style="color:#6b7280;font-size:11px;">None detected</span>`;
        } else if (otherSubs.length > 0) {
            const limit = 6;
            const displayOther = otherSubs.slice(0, limit).join(', ');
            const more = otherSubs.length > limit ? `...` : '';
            subsHtml += `<span class="tm_sub_tag" style="opacity:0.8">Other: ${displayOther}${more}</span>`;
        }

        header.innerHTML = `
            <div style="flex:1;min-width:0;">
                <div style="font-size:15px;font-weight:bold;margin-bottom:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;">${title}</div>
                <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
                    <span style="font-size:12px;color:#9ca3af;margin-right:4px;">Subs:</span>
                    ${subsHtml}
                </div>
            </div>
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = 'background:none;border:none;color:#9ca3af;font-size:20px;cursor:pointer;padding:0 8px;margin-left:10px;';
        closeBtn.onclick = () => modal.remove();
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.style.cssText = 'flex:1;overflow:auto;padding:16px;background:#111827;';
        const pre = document.createElement('pre');
        pre.style.cssText = 'white-space:pre-wrap;font-size:12px;color:#e5e7eb;font-family:Consolas, "Courier New", monospace;';
        pre.textContent = text;

        body.appendChild(pre);
        content.appendChild(header);
        content.appendChild(body);
        modal.appendChild(content);

        modal.onclick = (e) => { if(e.target === modal) modal.remove(); };
        document.body.appendChild(modal);
    }

    /************************** 逻辑控制 **************************/
    function findDetailsUrl(row) {
        const link = row.querySelector('a[href*="details?id="], a[href*="/release/"], a[href*="/details/"]');
        if (link) return link.href;
        return null;
    }

    function setButtonNoNfo(btn) {
        btn.textContent = 'No NFO';
        btn.disabled = true;
        btn.className = 'tm_nfo_button_v3 tm_nfo_button_nonfo';
        const dot = btn.querySelector('.tm_nfo_badge_dot');
        if(dot) dot.remove();
    }

    function updateButtonStatus(btn, nfoText) {
        if (isNoNfo(nfoText)) {
            setButtonNoNfo(btn);
            return;
        }

        btn.disabled = false;
        btn.textContent = SETTINGS.BUTTON_TEXT;
        btn.className = 'tm_nfo_button_v3';

        const oldDot = btn.parentElement.querySelector('.tm_nfo_badge_dot');
        if (oldDot) oldDot.remove();

        const summary = parseNfoSummary(nfoText);
        const userTargets = SETTINGS.TARGET_LANGS || [];
        const isHit = summary.subs.some(s => userTargets.includes(s));

        if (summary.subs.length > 0) {
            const dot = document.createElement('span');
            dot.className = 'tm_nfo_badge_dot ' + (isHit ? 'tm_badget_hit' : 'tm_badget_miss');
            btn.style.position = 'relative';
            btn.appendChild(dot);
        }
    }

    async function onButtonClick(btn, row, title) {
        const url = findDetailsUrl(row);
        if (!url) { alert('Err: Cannot find details URL.'); return; }

        let id = url.match(/[?&]id=([^&]+)/);
        id = id ? id[1] : url;

        const cached = getCache(id);
        if (cached) {
            if (isNoNfo(cached)) { setButtonNoNfo(btn); return; }
            showNfoModal(title, cached, parseNfoSummary(cached));
            updateButtonStatus(btn, cached);
            return;
        }

        btn.disabled = true; btn.textContent = '...';
        try {
            const res = await gmFetch(url);
            let nfo = extractNfoFromHtml(res.responseText);

            if (!nfo || nfo.length < 50) {
                 const apiIdMatch = res.responseText.match(/<id[^>]*>([^<]+)<\/id>/i);
                 if (apiIdMatch) {
                     const newUrl = `https://api.omgwtfnzbs.org/api?t=getnfo&id=${apiIdMatch[1]}`;
                     const res2 = await gmFetch(newUrl);
                     const nfo2 = extractNfoFromHtml(res2.responseText) || stripTags(res2.responseText);
                     if (nfo2 && nfo2.length > 20) nfo = nfo2;
                 }
            }
            if (!nfo || nfo.length < 20) nfo = stripTags(res.responseText).substring(0, 30000);

            setCache(id, nfo);

            if (isNoNfo(nfo)) {
                setButtonNoNfo(btn);
            } else {
                showNfoModal(title, nfo, parseNfoSummary(nfo));
                updateButtonStatus(btn, nfo);
            }
        } catch (e) {
            console.error(e);
            btn.textContent = 'Err';
            setTimeout(() => { btn.disabled = false; btn.textContent = SETTINGS.BUTTON_TEXT; }, 3000);
        }
    }

    function injectNfoColumn() {
        const tables = document.querySelectorAll('table[class*="Table-table"]');
        if (!tables.length) return;

        tables.forEach(table => {
            const ths = Array.from(table.querySelectorAll('thead th'));
            const headerTexts = ths.map(th => th.textContent.trim().toLowerCase());
            const isSearchTable = headerTexts.includes('indexer') || headerTexts.includes('age') || headerTexts.includes('peers');
            if (!isSearchTable) return;

            const theadRow = table.querySelector('thead tr');
            if (theadRow && !theadRow.querySelector('.tm-nfo-col-header')) {
                const th = document.createElement('th');
                th.className = 'tm-nfo-col-header';
                th.textContent = 'NFO';
                if (theadRow.children.length > 2) theadRow.insertBefore(th, theadRow.children[2]);
                else theadRow.appendChild(th);
            }

            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                if (row.querySelector('.tm-nfo-col-cell')) return;

                const td = document.createElement('td');
                td.className = 'tm-nfo-col-cell';
                const titleCell = row.cells[0] || row.cells[1];
                const titleText = titleCell ? titleCell.innerText.trim() : 'Release';

                const btn = document.createElement('button');
                btn.className = 'tm_nfo_button_v3';
                btn.textContent = SETTINGS.BUTTON_TEXT;
                btn.onclick = (e) => { e.stopPropagation(); e.preventDefault(); onButtonClick(btn, row, titleText); };

                td.appendChild(btn);
                if (row.children.length > 2) row.insertBefore(td, row.children[2]);
                else row.appendChild(td);

                const url = findDetailsUrl(row);
                if (url) {
                    let id = url.match(/[?&]id=([^&]+)/);
                    id = id ? id[1] : url;
                    const cached = getCache(id);
                    if (cached) {
                        if (isNoNfo(cached)) setButtonNoNfo(btn);
                        else updateButtonStatus(btn, cached);
                    }
                }
            });
        });
    }

    /************************** 设置面板 **************************/
    function createSettingsButton() {
        if (document.getElementById('tm_nfo_settings_btn')) return;
        const btn = document.createElement('div');
        btn.id = 'tm_nfo_settings_btn';
        Object.assign(btn.style, {
            position: 'fixed', right: '20px', bottom: '20px', width: '40px', height: '40px',
            background: '#0f172a', borderRadius: '50%', color: '#fff', fontSize: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 999999
        });
        btn.innerHTML = '⚙';
        btn.onclick = openSettings;
        document.body.appendChild(btn);
    }

    function openSettings() {
        const id = 'tm_nfo_settings_panel';
        if (document.getElementById(id)) return;

        const overlay = document.createElement('div');
        overlay.id = id;
        Object.assign(overlay.style, { position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center' });

        const panel = document.createElement('div');
        Object.assign(panel.style, { background: '#1e293b', padding: '24px', borderRadius: '12px', width: '500px', maxHeight:'90vh', overflow:'auto', color: '#e2e8f0', fontFamily: 'sans-serif', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' });

        const rowStyle = 'margin-bottom:12px;display:flex;flex-direction:column;gap:4px;';
        const inputStyle = 'padding:6px;border-radius:4px;border:1px solid #334155;background:#0f172a;color:#fff;outline:none;';

        const availableLangs = [
            {code: 'CHS', label: 'Chinese (Simple)'}, {code: 'CHT', label: 'Chinese (Trad)'},
            {code: 'ENG', label: 'English'}, {code: 'JPN', label: 'Japanese'},
            {code: 'KOR', label: 'Korean'}, {code: 'FRE', label: 'French'},
            {code: 'SPA', label: 'Spanish'}, {code: 'GER', label: 'German'},
            {code: 'ITA', label: 'Italian'}, {code: 'RUS', label: 'Russian'},
            {code: 'POR', label: 'Portuguese'}, {code: 'DUT', label: 'Dutch'},
            {code: 'THA', label: 'Thai'}, {code: 'TUR', label: 'Turkish'}
        ];

        let langChecks = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#0f172a;padding:10px;border-radius:6px;border:1px solid #334155;">';
        availableLangs.forEach(l => {
            const checked = (SETTINGS.TARGET_LANGS || []).includes(l.code) ? 'checked' : '';
            langChecks += `<div style="display:flex;align-items:center;gap:6px;">
                <input type="checkbox" id="tm_lang_${l.code}" value="${l.code}" ${checked}>
                <label for="tm_lang_${l.code}" style="font-size:12px;cursor:pointer">${l.label}</label>
            </div>`;
        });
        langChecks += '</div>';

        panel.innerHTML = `
            <h3 style="margin:0 0 16px 0;border-bottom:1px solid #334155;padding-bottom:8px;">NFO Viewer Settings (v2.9.2)</h3>

            <div style="${rowStyle}">
                <label style="font-size:12px;color:#94a3b8;">API Key (Optional)</label>
                <input id="tm_set_apikey" type="password" style="${inputStyle}" placeholder="Indexer API Key" />
            </div>

            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:#94a3b8;font-weight:bold;display:block;margin-bottom:4px;">Highlight Subtitles:</label>
                ${langChecks}
            </div>

            <div style="${rowStyle}">
                <label style="font-size:12px;color:#94a3b8;">Proxy URL</label>
                <input id="tm_set_proxy_url" type="text" style="${inputStyle}" />
            </div>
             <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                <input id="tm_set_proxy" type="checkbox" />
                <label for="tm_set_proxy" style="font-size:13px">Use Local Proxy</label>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">
                <button id="tm_set_clear" style="padding:6px 12px;border-radius:4px;border:none;background:#7f1d1d;color:white;cursor:pointer;margin-right:auto;font-size:12px">Clear Cache</button>
                <button id="tm_set_cancel" style="padding:6px 16px;border-radius:4px;border:none;background:#334155;color:white;cursor:pointer;">Cancel</button>
                <button id="tm_set_save" style="padding:6px 16px;border-radius:4px;border:none;background:#2563eb;color:white;cursor:pointer;">Save</button>
            </div>
        `;
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        document.getElementById('tm_set_apikey').value = SETTINGS.API_KEY || '';
        document.getElementById('tm_set_proxy').checked = SETTINGS.USE_PROXY;
        document.getElementById('tm_set_proxy_url').value = SETTINGS.PROXY_URL;

        document.getElementById('tm_set_cancel').onclick = () => overlay.remove();
        document.getElementById('tm_set_clear').onclick = () => { Object.keys(localStorage).forEach(k => { if(k.startsWith('tm_nfo_c_')) localStorage.removeItem(k); }); alert('Cache cleared.'); };

        document.getElementById('tm_set_save').onclick = () => {
            const selectedLangs = [];
            availableLangs.forEach(l => {
                if (document.getElementById(`tm_lang_${l.code}`).checked) selectedLangs.push(l.code);
            });

            saveSettings({
                API_KEY: document.getElementById('tm_set_apikey').value.trim(),
                USE_PROXY: document.getElementById('tm_set_proxy').checked,
                PROXY_URL: document.getElementById('tm_set_proxy_url').value.trim(),
                TARGET_LANGS: selectedLangs
            });
            SETTINGS = loadSettings();
            overlay.remove();
            alert('Settings Saved.');
        };
    }

    const observer = new MutationObserver(() => injectNfoColumn());
    (async () => {
        await sleep(500);
        injectNfoColumn();
        createSettingsButton();
        observer.observe(document.body, { childList: true, subtree: true });
    })();

})();