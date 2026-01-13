// ==UserScript==
// @name         Galgame 跨站搜索跳转助手
// @description  主要在 Galgame 数据库之间实现搜索跳转。
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       Orchids
// @match        https://vndb.org/*
// @match        https://www.moyu.moe/*
// @match        https://www.ai2.moe/*
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @match        https://2dfan.com/*
// @match        https://2dfdf.de/*
// @match        https://2dfmax.top/*
// @match        https://fan2d.top/*
// @match        https://galge.top/*
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @match        https://seiya-saiga.com/*
// @match        https://galge.seiya-saiga.com/*
// @match        https://hitomi.la/*
// @match        https://ggbases.dlgal.com/*
// @match        https://erogamescape.org/*
// @match        https://koko.kyara.top/*
// @match        https://www.dlsite.com/*
// @match        https://dlsoft.dmm.co.jp/*
// @match        https://dlsoft.dmm.com/*
// @match        https://www.dmm.com/*
// @match        https://www.dmm.co.jp/*
// @match        https://sukebei.nyaa.si/*
// @match        https://moepedia.net/*
// @match        https://www.google.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561946/Galgame%20%E8%B7%A8%E7%AB%99%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561946/Galgame%20%E8%B7%A8%E7%AB%99%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const SYMBOL_GROUPS = [
        { key: 'wave',      variants: ["~", "～", "〜", "〰", "∼", "⁓"] },
        { key: 'cross',     variants: ["x", "X", "×", "✕", "✖", "✗", "✘", "⨉", "⨯"] },
        { key: 'dot',       variants: [".", "·", "・", "●", "•", "．", "‧", "⋅", "∙"] },
        { key: 'dash',      variants: ["-", "－", "—", "―", "–", "─", "−", "⁃"] },
        { key: 'exclaim',   variants: ["!", "！", "❗", "❕", "‼", "⁉"] },
        { key: 'question',  variants: ["?", "？", "❓", "❔", "⁇", "⁈"] },
        { key: 'heart',     variants: ["♡", "♥", "❤", "💕", "💗", "💖", "💘", "💓", "💞", "❥", "❣"] },
        { key: 'star',      variants: ["★", "☆", "✡", "✦", "✧", "⭐", "🌟", "＊", "*"] },
        { key: 'music',     variants: ["♪", "♫", "♬", "♩", "🎵", "🎶", "🎼"] },
        { key: 'colon',     variants: [":", "：", "∶", "꞉"] },
        { key: 'semicolon', variants: [";", "；", "⁏"] },
        { key: 'slash',     variants: ["/", "／", "∕", "⁄", "╱"] },
        { key: 'equal',     variants: ["=", "＝", "═", "⩵", "⩶", "≡"] },
        { key: 'parenL',    variants: ["(", "（", "❨", "﹙"] },
        { key: 'parenR',    variants: [")", "）", "❩", "﹚"] },
        { key: 'bracketL',  variants: ["[", "［", "【", "〔", "「", "『"] },
        { key: 'bracketR',  variants: ["]", "］", "】", "〕", "」", "』"] },
        { key: 'ellipsis',  variants: ["…", "⋯", "︙", "⁝", "..."] },
        { key: 'quote',     variants: ["\"", "“", "”", "″", "＂", "«", "»"] },
        { key: 'space',     variants: [" ", "\u3000", "_"] }
    ];
 
    const SITE_PREFERENCES = {
        "JAPANESE": {
            wave: "～", cross: "×", dot: "・", dash: "－",
            exclaim: "！", question: "？", heart: "♥", star: "★", music: "♪",
            colon: "：", semicolon: "；", slash: "／", equal: "＝",
            parenL: "（", parenR: "）", bracketL: "【", bracketR: "】",
            ellipsis: "…", quote: "＂"
        },
        "GLOBAL": {
            wave: "~", cross: "x", dot: ".", dash: "-",
            exclaim: "!", question: "?", heart: " ", star: " ", music: " ",
            colon: ":", semicolon: ";", slash: "/", equal: " ",
            parenL: "(", parenR: ")", bracketL: "[", bracketR: "]",
            ellipsis: "...", quote: "\""
        }
    };
 
    const ENGINE_SPECIFIC_RULES = {
        "hitomi": { keep: "×", replaceWith: " " },
        "eh": { keep: "×", replaceWith: " " },
        "vndb": { keep: "×", replaceWith: " " },
        "seiya": { keep: "×", replaceWith: " " },
        "seiyasave": { keep: "×", replaceWith: " " },
        "bgm": { keep: "×", replaceWith: " " },
        "moyu": { keep: "×", replaceWith: " " },
        "2dfan": { keep: "×", replaceWith: " " },
        "ai2": { keep: "×", replaceWith: " " },
        "dlsite": { keep: "×", replaceWith: " " },
        "dmm": { keep: "×", replaceWith: " " },
        "fanza": { keep: "×", replaceWith: " " },
        "erogame": { keep: "×", replaceWith: " " },
        "koko": { keep: "×", replaceWith: " " },
        "ggbase": { keep: "ALL", replaceWith: "" },
        "sukebei": { keep: "×", replaceWith: " " },
        "moepedia": { keep: "×", replaceWith: " " }
    };
 
    function toHalfWidth(str) {
        if (!str) return "";
        return str.replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/\u3000/g, ' ');
    }
 
    function adaptSymbols(str, targetStyle = "JAPANESE") {
        if (!str) return "";
        let result = str;
        const pref = SITE_PREFERENCES[targetStyle] || SITE_PREFERENCES.JAPANESE;
        if (targetStyle === "JAPANESE") { result = result.replace(/\s*[-－—]\s*/g, pref.dash); }
        SYMBOL_GROUPS.forEach(group => {
            const preferred = pref[group.key];
            if (preferred !== undefined) {
                group.variants.forEach(v => {
                    if (v === " " || v === "\u3000") return;
                    try { result = result.split(v).join(preferred); } catch (e) { void e; }
                });
            }
        });
        return result;
    }
 
    function hasJapanese(str) { return /[\u3040-\u30ff]/.test(str); }
 
    function normalizeForMatch(str) {
        if (!str) return "";
        let s = adaptSymbols(toHalfWidth(str).toLowerCase(), "GLOBAL");
        return s.replace(/[^\u4e00-\u9fa5\u3040-\u30ff\u31f0-\u31ff\u3005a-z0-9]/g, '')
            .replace(/\s+/g, '')
            .replace(/誠也の部屋|攻略|游戏|版|修正/g, '');
    }
 
    function getSmartKeyword(input, engineType) {
        if (!input) return "";
        let kw = input.trim();
        kw = kw.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
        kw = kw.replace(/[\r\n\u200B-\u200D\uFEFF]/g, " ").replace(/\s+/g, " ");
        
        kw = kw.replace(/[&?]_(?:gl|ga).*$/gi, '');
        kw = kw.replace(/[?&]utm_.*?=.*?(&|$)/gi, '');
        
        kw = kw.replace(/【.*?】|\[.*?\]|\(.*?\)|「.*?」|『.*?』/g, ' ');
        
        kw = kw.replace(/\s+for\s+(?:Win|Windows|PC|Mac|OS|XP|Vista)\s*\d*/gi, ' ');
        kw = kw.replace(/(?:\s|^)(?:Win|Windows|PC版|Mac版)\s*\d*(?:\s|$)/gi, ' ');
        kw = kw.replace(/(?:^|\s)(?:DL版|対応版|限定版|特典付き?|通常版|期間限定|DMM特典|.*?アワード|.*?賞|受?賞|周年記念|完整版|本体|汉化版)(?:\s|$)/gi, ' ');
        kw = kw.replace(/\s+for\s*$/gi, ' ');

        kw = kw.replace(/\[(?:gemini|gpt|claude|deepseek|qwen|kimi|llama|flux|sdxl|sd|o1|o3|o4).*?\]/gi, '');
        kw = kw.replace(/\[(?:内嵌|汉化|补丁|分卷|合集|站内存储|修正|本体|首发|ADV|GAL|纯爱|含本体|tg直链下载).*?\]/gi, '');
        
        const rule = ENGINE_SPECIFIC_RULES[engineType] || { keep: "", replaceWith: " " };
 
        if (rule.keep !== "ALL") {
            const keepChars = rule.keep || "";
            SYMBOL_GROUPS.forEach(group => {
                if (group.key === 'space') return;
                let charToPreserve = [...keepChars].find(c => group.variants.includes(c));
                let replacement = charToPreserve ? charToPreserve : rule.replaceWith;
                group.variants.forEach(v => {
                    kw = kw.split(v).join(replacement);
                });
            });
        }
        
        return kw.replace(/\u3000/g, ' ').replace(/\s+/g, ' ').trim();
    }
 
    const ENGINES = {
        "hitomi":   { name: "Hitomi", bg: "#F06292", url: "https://hitomi.la/search.html?" },
        "eh":       { name: "EH",     bg: "#5C4033", url: "https://e-hentai.org/?f_search=" },
        "vndb":     { name: "VNDB",   bg: "#513535", url: "https://vndb.org/v?sq=" },
        "seiya":    { name: "Seiya攻略", bg: "#2196F3", url: "https://seiya-saiga.com/game/kouryaku.html?cgsearch=" },
        "seiyasave":{ name: "Seiya存档", bg: "#673AB7", url: "https://seiya-saiga.com/save.html?cgsearch=" },
        "bgm":      { name: "BGM",    bg: "#F09199", url: "https://bgm.tv/subject_search/" },
        "moyu":     { name: "Moyu",   bg: "#00BCD4", url: "https://www.moyu.moe/search?q=" },
        "2dfan":    { name: "2DFan",  bg: "#4CAF50", url: "https://2dfan.com/subjects/search?keyword=" },
        "ai2":      { name: "Ai2",    bg: "#9C27B0", url: "https://www.ai2.moe/search/?q=" },
        "dlsite":   { name: "DLsite", bg: "#2196F3", url: "https://www.dlsite.com/pro/fsr/=/keyword/" },
        "dmm":      { name: "DMM",    bg: "#FF9800", url: "https://www.dmm.com/search/=/searchstr=" },
        "fanza":    { name: "Fanza",  bg: "#E65100", url: "https://dlsoft.dmm.co.jp/search/?service=pcgame&searchstr=" },
        "erogame":  { name: "Erogame",bg: "#607D8B", url: "https://erogamescape.org/~ap2/ero/toukei_kaiseki/kensaku.php?category=game&word_category=name&mode=normal&word=" },
        "koko":     { name: "kyara",   bg: "#455A64", url: "https://koko.kyara.top/kensaku.php?category=game&word_category=name&mode=normal&word=" },
        "ggbase":   { name: "GGbase", bg: "#FF9800", url: "https://ggbases.dlgal.com/search.so?title=" },
        "sukebei":  { name: "Nyaa",bg: "#3F51B5", url: "https://sukebei.nyaa.si/?f=0&c=0_0&q=" },
        "moepedia": { name: "Moepedia", bg: "#FF69B4", url: "https://moepedia.net/search/result/?s=" }
    };
 
    function createBtn(keyword, type) {
        const engine = ENGINES[type];
        let searchWord = getSmartKeyword(keyword, type);
        if (!searchWord || searchWord.length < 2) return null;
 
        const a = document.createElement('a');
        let encoded = encodeURIComponent(searchWord);
        if (type === 'dlsite') {
            let dlsWord = searchWord.replace(/[!！?？*＊~～]/g, ' ').trim();
            encoded = encodeURIComponent(dlsWord).replace(/%20/g, '+');
        }
        let finalUrl = engine.url + encoded;
        if (type === 'bgm') finalUrl += "?cat=all";
        a.href = finalUrl;
        a.target = '_blank';
        a.setAttribute('data-cg-btn', 'true');
        a.style.cssText = `display:inline-block !important; margin:1px !important; padding:0 6px !important; font-size:10px !important; color:#fff !important; background-color:${engine.bg} !important; border-radius:3px !important; text-decoration:none !important; line-height:16px !important; vertical-align:middle !important; border:none !important; white-space:nowrap !important; cursor:pointer !important; transition:0.2s !important; box-shadow: 0 1px 2px rgba(0,0,0,0.2) !important; font-family: sans-serif !important; pointer-events: auto !important; opacity: 1 !important;`;
        a.textContent = `🔍 ${engine.name}`;
        a.onmouseover = () => a.style.filter = 'brightness(0.85)';
        a.onmouseout = () => a.style.filter = 'none';
        a.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(finalUrl, '_blank');
        };
        return a;
    }
 
    function handleSeiyaLogic() {
        if (!location.hostname.includes('seiya-saiga.com')) return;
        const params = new URLSearchParams(location.search);
        const searchRaw = params.get('cgsearch');
        if (!searchRaw) return;
        const searchFinger = normalizeForMatch(searchRaw);
 
        if (location.pathname.includes('save.html')) {
            const rows = Array.from(document.querySelectorAll('tr'));
            let bestRow = null, bestScore = -1;
            rows.forEach(row => {
                const titleCell = row.querySelector('td[align="left"]');
                if (!titleCell) return;
                const text = titleCell.textContent.trim();
                const rowFinger = normalizeForMatch(text);
                if (!rowFinger || rowFinger.length < 2) return;
                let score = (rowFinger === searchFinger) ? 10000 : (searchFinger.includes(rowFinger) ? rowFinger.length : (rowFinger.includes(searchFinger) ? searchFinger.length : -1));
                if (score > bestScore) { bestScore = score; bestRow = row; }
            });
            if (bestRow && !bestRow.hasAttribute('data-cg-deep-added')) {
                bestRow.style.backgroundColor = "rgba(255, 235, 59, 0.4)";
                bestRow.scrollIntoView({ behavior: "smooth", block: "center" });
                const cell = bestRow.querySelector('td[align="left"]');
                const span = document.createElement('span');
                span.style.marginLeft = "10px";
                span.appendChild(createBtn(searchRaw, 'hitomi'));
                span.appendChild(createBtn(searchRaw, 'eh'));
                cell.appendChild(span);
                bestRow.setAttribute('data-cg-deep-added', 'true');
            }
            return;
        }
 
        if (location.pathname.includes('kouryaku.html') || location.pathname.includes('galge.html')) {
            const links = document.querySelectorAll('a[href*=".html"]');
            let bestLink = null, bestScore = -1;
            links.forEach(link => {
                const text = link.textContent.trim();
                const linkFinger = normalizeForMatch(text);
                if (!linkFinger || linkFinger.length < 2) return;
                let score = (linkFinger === searchFinger) ? 10000 : (searchFinger.includes(linkFinger) ? linkFinger.length : (linkFinger.includes(searchFinger) ? searchFinger.length : -1));
                if (score > bestScore) { bestScore = score; bestLink = link; }
            });
            if (bestLink) {
                const t = new URL(bestLink.href); t.searchParams.set('cgsearch', searchRaw); location.href = t.href;
            } else { location.href = 'https://www.google.com/search?q=site:seiya-saiga.com+' + encodeURIComponent(searchRaw); }
        } else {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while ((node = walker.nextNode())) {
                const text = node.nodeValue.trim();
                const nodeFinger = normalizeForMatch(text);
                if (nodeFinger && (nodeFinger.includes(searchFinger) || searchFinger.includes(nodeFinger)) && !['SCRIPT','STYLE'].includes(node.parentNode.tagName)) {
                    const p = node.parentNode;
                    if (p.hasAttribute('data-cg-deep-added')) continue;
                    p.style.backgroundColor = "rgba(255, 235, 59, 0.4)";
                    p.scrollIntoView({ behavior: "smooth", block: "center" });
                    const span = document.createElement('span');
                    span.appendChild(createBtn(searchRaw, 'hitomi'));
                    span.appendChild(createBtn(searchRaw, 'eh'));
                    p.appendChild(span);
                    p.setAttribute('data-cg-deep-added', 'true');
                }
            }
        }
    }
 
    const SITES = [
        { name: "VNDB", check: () => location.hostname.includes('vndb.org') && location.pathname.startsWith('/v'), run: () => {
            const h1 = Array.from(document.querySelectorAll('h1')).find(h => !h.closest('header') && h.offsetParent !== null);
            if (!h1) return null;
            let kw = h1.textContent.trim();
            const jp = document.querySelector('h2.alttitle[lang="ja"]');
            if (jp && jp.textContent.trim()) kw = jp.textContent.trim();
            return { target: h1, keyword: kw };
        }},
        { name: "MoYu", check: () => location.hostname.includes('moyu.moe'), run: () => {
            const params = new URLSearchParams(location.search);
            const h1 = document.querySelector('h1');
            if (!h1) return null;
            if (params.get('q')) return { target: h1, keyword: params.get('q') };
            const ogTitle = document.querySelector('meta[property="og:title"]');
            let kw = (ogTitle && ogTitle.content.includes('|')) ? ogTitle.content.split('|')[1].replace(/的(下载资源|评论|信息|资源).*/, '').trim() : h1.textContent.trim();
            const jpSpan = h1.closest('div')?.nextElementSibling?.querySelector('span.text-xs');
            if (jpSpan && hasJapanese(jpSpan.textContent)) kw = jpSpan.textContent.trim();
            const card = Array.from(document.querySelectorAll('div')).find(el => el.textContent.trim() === '缺少介绍？')?.closest('.dark\\:bg-neutral-800'); 
            return { target: card || h1, keyword: kw };
        }},
        { name: "Ai2", check: () => location.hostname.includes('ai2.moe'), run: () => {
            const params = new URLSearchParams(location.search);
            const h1 = document.querySelector('h1.ipsType_pageTitle');
            if (!h1) return null;
            if (params.get('q')) return { target: h1, keyword: params.get('q') };
            let kw = h1.querySelector('.ipsType_break')?.textContent.trim() || h1.innerText.trim();
            kw = kw.replace(/\[(?:tg|直链|下载|tg直链下载|站内存储).*?\]/gi, '').replace(/\s+\d+\.\d+(\.\d+)?$/, '').trim();
            return { target: h1.closest('.ipsPageHeader') || h1, keyword: kw };
        }},
        { name: "2DFan", check: () => /2dfan|2dfdf|2dfmax|fan2d|galge/.test(location.hostname), run: () => {
            const h3 = Array.from(document.querySelectorAll('h3')).find(h => !h.classList.contains('site-name') && h.offsetParent !== null);
            if (!h3) {
                const searchInput = document.querySelector('input[name="keyword"]');
                if (searchInput) return { target: searchInput.parentElement, keyword: searchInput.value };
                return null;
            }
            let kw = new URLSearchParams(location.search).get('keyword') || h3.textContent.trim();
            for (let el of document.querySelectorAll('p, td, span')) {
                if (el.textContent.includes('原名')) { kw = el.textContent.replace(/.*原名[:：]/, '').trim(); break; }
            }
            return { target: h3, keyword: kw };
        }},
        { name: "Bangumi", check: () => /bgm\.tv|bangumi\.tv/.test(location.hostname), run: () => {
            const h1 = document.querySelector('h1.nameSingle');
            return h1 ? { target: h1, keyword: (h1.querySelector('a')?.textContent || h1.textContent).trim() } : null;
        }},
        { name: "DLsite", check: () => location.hostname.includes('dlsite.com'), run: () => {
            const h1 = document.getElementById('work_name');
            if (h1) return { target: h1, keyword: h1.textContent.trim() };
            const kw = new URLSearchParams(location.search).get('keyword') || document.querySelector('input[name="keyword"]')?.value;
            return kw ? { target: document.querySelector('.search_result_title') || document.body, keyword: kw } : null;
        }},
        { name: "DMM", check: () => /dmm\.(co\.jp|com)/.test(location.hostname), run: () => {
            const h1 = document.getElementById('work_name') || 
                       document.querySelector('.productTitle__item--headline') || 
                       document.querySelector('h1[data-e2e-title-in-product-detail]') ||
                       document.getElementById('title') || 
                       document.querySelector('h1');
            if (!h1 || h1.closest('.breadcrumb') || h1.offsetWidth === 0) return null;
            return { target: h1, keyword: h1.textContent.trim() };
        }},
        { name: "ErogameScape", check: () => /erogamescape\.org|koko\.kyara\.top/.test(location.hostname), run: () => {
            const div = document.getElementById('game_title') || document.getElementById('soft-title');
            if (!div) return null;
            let txt = (div.querySelector('a') && div.id === 'game_title') ? div.querySelector('a').textContent.trim() : div.innerText.split('\n')[0].split('（')[0].split('(')[0].trim();
            return { target: div, keyword: txt };
        }},
        { name: "Moepedia", check: () => location.hostname.includes('moepedia.net') && !location.href.includes('/search/result/'), run: () => {
            const h1 = document.querySelector('h1');
            if (!h1) return null;
            return { target: h1, keyword: h1.textContent.trim() };
        }}
    ];
 
    function main() {
        if (location.hostname.includes('google.com') && location.search.includes('site:seiya-saiga.com')) {
            const q = new URLSearchParams(location.search).get('q').replace('site:seiya-saiga.com', '').trim();
            const finger = normalizeForMatch(q);
            document.querySelectorAll('div.g a').forEach(res => {
                if (normalizeForMatch(res.innerText).includes(finger)) {
                    const t = new URL(res.href); t.searchParams.set('cgsearch', q); location.href = t.href;
                }
            });
            return;
        }
        handleSeiyaLogic();
        const site = SITES.find(s => s.check());
        if (!site) return;
        let item = site.run();
        if (!item || !item.target || item.target.hasAttribute('data-cg-added')) return;
        
        const cont = document.createElement('div');
        cont.className = 'cg-search-toolbar';
        cont.style.cssText = 'display:flex !important; flex-wrap:wrap !important; gap:2px !important; margin:10px 0 !important; padding:6px !important; background:rgba(0,0,0,0.03) !important; border-radius:6px !important; isolation:isolate !important; z-index:9999 !important; width: fit-content !important; min-width: 250px !important; border:none !important; pointer-events: auto !important; position: relative !important; clear: both !important;';
        
        if (site.name === "Bangumi") cont.style.marginLeft = "250px";
        
        const curH = location.hostname;
        const curP = location.pathname;
        const targets = ['hitomi', 'eh', 'moepedia', 'vndb', 'bgm', 'erogame', 'koko', 'seiya', 'seiyasave', 'moyu', 'ai2', '2dfan', 'dlsite', 'dmm', 'fanza', 'ggbase', 'sukebei'];
        
        targets.forEach(t => {
            const engine = ENGINES[t];
            if (t === 'dmm' && (curH === 'www.dmm.com' || curH === 'www.dmm.co.jp')) return;
            if (t === 'fanza' && (curH === 'dlsoft.dmm.co.jp' || curH === 'dlsoft.dmm.com')) return;
            if (t === 'seiya' && curH.includes('seiya-saiga.com') && (curP.includes('kouryaku.html') || curP.includes('galge.html'))) return;
            if (t === 'seiyasave' && curH.includes('seiya-saiga.com') && curP.includes('save.html')) return;
            if (t !== 'seiya' && t !== 'seiyasave' && curH.includes(engine.name.toLowerCase())) return;
            if (t === 'eh' && /e-hentai|exhentai/.test(curH)) return;
            if (t === '2dfan' && /2dfan|2dfdf|2dfmax|fan2d|galge/.test(curH)) return;
            if ((t === 'erogame' || t === 'koko') && /erogamescape|kyara\.top/.test(curH)) return;
            if (t === 'bgm' && /bgm\.tv|bangumi\.tv/.test(curH)) return;
 
            const btn = createBtn(item.keyword, t);
            if (btn) cont.appendChild(btn);
        });
 
        if (cont.children.length === 0) return;

        if (site.name === "VNDB") item.target.parentNode.insertBefore(cont, item.target);
        else item.target.parentNode.insertBefore(cont, item.target.nextSibling);
        item.target.setAttribute('data-cg-added', 'true');
    }
 
    const observer = new MutationObserver(() => main());
    observer.observe(document.body, { childList: true, subtree: true });
    main();
})();