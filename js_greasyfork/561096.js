// ==UserScript==
// @name         FF14 幻化网汉化大师
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  自动汉化 Eorzea Collection 装备与染剂名，支持双染色，适配手机端与单页应用。
// @author       NGA_User
// @match        https://ffxiv.eorzeacollection.com/glamour/*
// @grant        GM_xmlhttpRequest
// @connect      huijiwiki.com
// @downloadURL https://update.greasyfork.org/scripts/561096/FF14%20%E5%B9%BB%E5%8C%96%E7%BD%91%E6%B1%89%E5%8C%96%E5%A4%A7%E5%B8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561096/FF14%20%E5%B9%BB%E5%8C%96%E7%BD%91%E6%B1%89%E5%8C%96%E5%A4%A7%E5%B8%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COLORS = { ITEM: '#40C4FF', DYE: '#E0E0E0', SPECIAL: '#FFD700', LOADING: '#757575' };
    const CACHE_PREFIX = "ff14_zh_cache_";
    const PENDING_SET = new Set();
    const FAILED_MAP = new Map();
    const RETRY_INTERVAL = 1000 * 60 * 5;
    const MARKER_ATTR = "data-zh-done";
    const ANCHOR_KEYWORDS = ['HEAD', 'BODY', 'HANDS', 'LEGS', 'FEET', 'EARRINGS', 'NECKLACE', 'BRACELETS', 'RING', 'WEAPON', 'OFF-HAND'];

    const DYE_REGEX = /[\u25CF\u25CB\u25EF\u2B24\u2022]/;
    const DYE_GLOBAL_REGEX = /([\u25CF\u25CB\u25EF\u2B24\u2022])\s*([^\n\u25CF\u25CB\u25EF\u2B24\u2022]+)/g;

    const REQUEST_QUEUE = [];
    let ACTIVE_REQUESTS = 0;
    const MAX_CONCURRENT = 3;
    let scanTimeout = null;

    function init() {
        triggerScan();
        const observer = new MutationObserver((mutations) => {
            let needsScan = false;
            for (const m of mutations) {
                if (m.target && m.target.className && typeof m.target.className === 'string' && m.target.className.includes('zh-tag')) continue;
                if (m.addedNodes.length > 0) { needsScan = true; break; }
            }
            if (needsScan) triggerScan();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(() => { if (!document.hidden) sentinelCheck(); }, 1000);
        setInterval(() => { if (!document.hidden) triggerScan(); }, 2000);
    }

    function triggerScan() {
        if (scanTimeout) return;
        scanTimeout = setTimeout(() => { runScan(); scanTimeout = null; }, 200);
    }

    function enqueueRequest(name, targetEl, type, cacheKey) {
        REQUEST_QUEUE.push({ name, targetEl, type, cacheKey });
        processQueue();
    }

    function processQueue() {
        if (ACTIVE_REQUESTS >= MAX_CONCURRENT || REQUEST_QUEUE.length === 0) return;
        const req = REQUEST_QUEUE.shift();
        ACTIVE_REQUESTS++;
        fetchWiki(req.name, (result) => {
            ACTIVE_REQUESTS--;
            processQueue();
            PENDING_SET.delete(req.name);
            if (result) {
                const clean = cleanWikiResult(result);
                localStorage.setItem(req.cacheKey, clean);
                renderBadge(req.targetEl, clean, req.type, req.name);
            } else {
                FAILED_MAP.set(req.name, Date.now());
                const tag = findExistingTag(req.targetEl, req.type);
                if (tag && tag.innerText === "...") tag.remove();
            }
        });
    }

    function sentinelCheck() {
        const loadingTags = document.querySelectorAll('.zh-tag-item, .zh-tag-dye');
        loadingTags.forEach(tag => {
            if (tag.innerText === "...") {
                const originalName = tag.getAttribute('data-zh-key');
                if (originalName) {
                    const cacheKey = CACHE_PREFIX + originalName;
                    const cached = localStorage.getItem(cacheKey);
                    if (cached) {
                        const newTag = createTagElement(cached, tag.className.includes('dye') ? 'dye' : 'item', originalName);
                        if (tag.parentNode) tag.parentNode.replaceChild(newTag, tag);
                    } else if (FAILED_MAP.has(originalName)) {
                        const lastFail = FAILED_MAP.get(originalName);
                        if (Date.now() - lastFail < RETRY_INTERVAL) tag.remove();
                    }
                }
            }
        });
    }

    function runScan() {
        scanLinkedItems();
        scanUnlinkedItems();
    }

    function scanLinkedItems() {
        const links = document.querySelectorAll('a[href*="lodestone/playguide/db/item/"]');
        links.forEach(link => {
            if (link.getAttribute(MARKER_ATTR) && hasTag(link, 'item')) return;
            const text = link.innerText.trim();
            if (text.length > 2) {
                updateElementState(text, link, 'item');
                link.setAttribute(MARKER_ATTR, "true");
                const slot = link.closest('.c-gear-slot') || link.closest('.c-glamour-item-info') || link.parentElement.parentElement;
                if (slot) scanSlot(slot);
            }
        });
    }

    function scanUnlinkedItems() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        while(walker.nextNode()) nodes.push(walker.currentNode);
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const text = node.nodeValue.trim();
            if (ANCHOR_KEYWORDS.includes(text)) {
                for (let j = 1; j <= 6; j++) {
                    if (i + j >= nodes.length) break;
                    const targetNode = nodes[i + j];
                    const targetText = targetNode.nodeValue.trim();
                    const targetParent = targetNode.parentElement;
                    if (!targetText || ['SCRIPT', 'STYLE'].includes(targetParent.tagName)) continue;
                    if (ANCHOR_KEYWORDS.includes(targetText)) break;
                    if (/Mogstation|Online Store|Seasonal/i.test(targetText)) break;
                    if (targetText.length > 2 && targetText !== "Unknown" && !targetText.includes('Undyed') && !DYE_REGEX.test(targetText)) {
                        if (targetParent.closest('a')) break;
                        if (!targetParent.getAttribute(MARKER_ATTR)) {
                            if (hasTag(targetParent, 'item')) break;
                            updateElementState(targetText, targetParent, 'item');
                            targetParent.setAttribute(MARKER_ATTR, "true");
                            const slot = targetParent.closest('.c-gear-slot') || targetParent.parentElement.parentElement;
                            if (slot) scanSlot(slot);
                        }
                        break;
                    }
                }
            }
        }
    }

    function scanSlot(container) {
        const fullText = container.textContent || container.innerText;
        if (!container.querySelector('.zh-tag-special')) {
            if (/(Online Store|Mogstation)/i.test(fullText)) {
                let target = findDirectParentOfText(container, "Online Store") || findDirectParentOfText(container, "Mogstation");
                if (target) renderBadge(target, "道具商城", 'special');
            } else if (/Seasonal/i.test(fullText)) {
                let target = findDirectParentOfText(container, "Seasonal");
                if (target) renderBadge(target, "季节活动", 'special');
            }
        }

        let match;
        const dyesToProcess = [];
        DYE_GLOBAL_REGEX.lastIndex = 0;
        while ((match = DYE_GLOBAL_REGEX.exec(fullText)) !== null) {
            let rawName = match[2].trim().replace(/(Optional|Mogstation|Online Store|Exclusive|Gearset|Glamours)/gi, "").trim();
            rawName = rawName.replace(/[()]/g, "").trim();
            if (rawName.length < 2) continue;
            dyesToProcess.push(rawName);
        }

        for (let i = 0; i < dyesToProcess.length; i++) {
            let rawName = dyesToProcess[i];
            let targetEl = findDirectParentOfText(container, rawName, true);
            if (targetEl) {
                if (rawName === "Undyed") renderBadge(targetEl, "无染色", 'dye-static');
                else {
                    let searchName = rawName.toLowerCase().endsWith(' dye') ? rawName : rawName + " Dye";
                    updateElementState(searchName, targetEl, 'dye');
                }
            }
        }
        if (fullText.includes("Undyed") && dyesToProcess.length === 0) {
             let targetEl = findDirectParentOfText(container, "Undyed", true);
             if (targetEl) renderBadge(targetEl, "无染色", 'dye-static');
        }
    }

    function findDirectParentOfText(root, text, skipProcessed = false) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        while(walker.nextNode()) {
            if (walker.currentNode.parentElement.className.includes('zh-tag')) continue;
            if (walker.currentNode.nodeValue.includes(text)) {
                const parent = walker.currentNode.parentElement;
                if (skipProcessed) { if (hasTag(parent, 'dye') || hasTag(parent, 'dye-static')) continue; }
                return parent;
            }
        }
        return null;
    }

    function updateElementState(name, targetEl, type) {
        let searchName = name.replace(/’/g, "'").replace(/‘/g, "'").replace(/\s+/g, ' ').trim();
        const cacheKey = CACHE_PREFIX + searchName;
        const cached = localStorage.getItem(cacheKey);
        if (cached) { renderBadge(targetEl, cleanWikiResult(cached), type, searchName); return; }

        if (FAILED_MAP.has(searchName)) {
            if (Date.now() - FAILED_MAP.get(searchName) < RETRY_INTERVAL) return;
            else FAILED_MAP.delete(searchName);
        }

        if (PENDING_SET.has(searchName)) { if (!findExistingTag(targetEl, type)) renderBadge(targetEl, "...", type, searchName); return; }

        renderBadge(targetEl, "...", type, searchName);
        PENDING_SET.add(searchName);
        enqueueRequest(searchName, targetEl, type, cacheKey);
    }

    function fetchWiki(name, callback) {
        let finished = false;
        const timeoutId = setTimeout(() => { if (!finished) { finished = true; callback(null); } }, 5000);
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://ff14.huijiwiki.com/w/api.php?action=opensearch&search=${encodeURIComponent(name)}&limit=1&format=json&origin=*`,
            onload: (res) => {
                if (finished) return; finished = true; clearTimeout(timeoutId);
                try {
                    const d = JSON.parse(res.responseText);
                    if (d[1] && d[1].length > 0) callback(d[1][0]);
                    else fallbackSearch(name, callback);
                } catch(e){ fallbackSearch(name, callback); }
            },
            onerror: () => { if (!finished) { finished = true; clearTimeout(timeoutId); callback(null); } }
        });
    }

    function fallbackSearch(name, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://ff14.huijiwiki.com/w/index.php?search=${encodeURIComponent(name)}&title=特殊:搜索&fulltext=1`,
            onload: (res) => {
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(res.responseText, "text/html");
                    const firstResult = doc.querySelector('.mw-search-result-heading a');
                    firstResult ? callback(firstResult.innerText.trim()) : callback(null);
                } catch(e){ callback(null); }
            },
            onerror: () => callback(null)
        });
    }

    function cleanWikiResult(text) {
        if (!text) return null;
        return text.replace(/^(物品|Item|任务|Quest|副本|Duty|Achievement|成就)\s*[:：]\s*/gi, "").trim();
    }

    function hasTag(element, type) {
        if (element.querySelector(`.zh-tag-${type}`)) return true;
        if (element.nextElementSibling && element.nextElementSibling.classList.contains(`zh-tag-${type}`)) return true;
        return false;
    }

    function findExistingTag(target, type) {
        const tagClass = type.startsWith('dye') ? 'zh-tag-dye' : `zh-tag-${type}`;
        let tag = target.querySelector(`.${tagClass}`);
        if (!tag && target.nextElementSibling && target.nextElementSibling.classList.contains(tagClass)) return target.nextElementSibling;
        return tag;
    }

    function createTagElement(text, type, searchNameKey) {
        const shouldBeLink = (text !== "...");
        const tagName = shouldBeLink ? 'a' : 'span';
        const node = document.createElement(tagName);
        node.className = type.startsWith('dye') ? 'zh-tag-dye' : `zh-tag-${type}`;
        node.innerText = text;
        if (searchNameKey) node.setAttribute('data-zh-key', searchNameKey);
        if (shouldBeLink) {
            node.href = `https://ff14.huijiwiki.com/wiki/物品:${encodeURIComponent(text)}`;
            node.target = "_blank";
            node.style.cursor = "pointer";
        }
        let color = COLORS.LOADING;
        if (text !== "...") {
            if (type === 'item') color = COLORS.ITEM;
            else if (type.startsWith('dye')) color = COLORS.DYE;
            else if (type === 'special') color = COLORS.SPECIAL;
        }
        const fontSize = (type.startsWith('dye') || type === 'special') ? '11px' : '13px';
        node.style.cssText = `font-size: ${fontSize}; font-weight: bold; margin-left: 6px; text-shadow: 1px 1px 2px rgba(0,0,0,0.9); text-decoration: none; display: inline-block; background: rgba(0,0,0,0.6); border-radius: 4px; padding: 1px 5px; color: ${color}; vertical-align: middle; transition: all 0.2s;`;
        if (text === "...") { node.style.opacity = "0.7"; node.style.animation = "zh-pulse 1s infinite"; }
        else { node.style.opacity = "1"; node.style.animation = "none"; }
        if (shouldBeLink) {
            node.onmouseover = () => { node.style.transform = "scale(1.05)"; node.style.color = "#fff"; };
            node.onmouseout = () => { node.style.transform = "scale(1)"; node.style.color = color; };
        }
        return node;
    }

    function renderBadge(target, text, type, searchNameKey = "") {
        if (!target) return;
        let existingTag = findExistingTag(target, type);
        if (existingTag) {
            if (existingTag.innerText === text) return;
            if (text === "..." && existingTag.innerText !== "...") return;
        }
        const newNode = createTagElement(text, type, searchNameKey);
        if (existingTag) { existingTag.parentNode.replaceChild(newNode, existingTag); }
        else { if (type === 'item') target.after(newNode); else target.appendChild(newNode); }
    }

    const style = document.createElement('style');
    style.innerHTML = `@keyframes zh-pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }`;
    document.head.appendChild(style);
    init();
})();