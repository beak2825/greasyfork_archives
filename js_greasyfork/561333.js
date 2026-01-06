// ==UserScript==
// @name         LANraragi 标签翻译
// @namespace    https://github.com/Kelcoin
// @version      1.1
// @description  基于 EhTagTranslation 数据库翻译并替换 LANraragi 的标签
// @author       Kelcoin
// @include      https://lanraragi*/*
// @include      http://lanraragi*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @connect      raw.githubusercontent.com
// @connect      github.com
// @icon         https://avatars.githubusercontent.com/u/47356068?s=200&v=4
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561333/LANraragi%20%E6%A0%87%E7%AD%BE%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/561333/LANraragi%20%E6%A0%87%E7%AD%BE%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        #DataTables_Table_0 .caption:not(.caption-tags) {
            display: block !important;
            visibility: hidden !important;
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
            width: 1px !important;
            height: 1px !important;
            z-index: -1;
            overflow: hidden;
        }

        #DataTables_Table_0 .caption-tags,
        #DataTables_Table_0 .caption table,
        #DataTables_Table_0 .caption tbody,
        #DataTables_Table_0 .caption tr,
        #DataTables_Table_0 .caption td,
        #DataTables_Table_0 .caption div.gt,
        #DataTables_Table_0 .caption-namespace,
        #DataTables_Table_0 table.itg {
            display: none !important;
            border: none !important;
            background: none !important;
            height: 0 !important;
            width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            pointer-events: none !important;
        }

        .tippy-content table.itg tbody,
        .caption-tags table.itg tbody {
            display: flex !important;
            flex-direction: column !important;
        }
        .tippy-content table.itg tr,
        .caption-tags table.itg tr {
            display: flex !important;
            width: 100% !important;
            order: 0;
        }
        .tippy-content table.itg td,
        .caption-tags table.itg td {
            flex: 1;
        }
        .tippy-content table.itg td.caption-namespace,
        .caption-tags table.itg td.caption-namespace {
            flex: 0 0 auto !important;
            min-width: 85px;
        }
    `;
    document.head.appendChild(style);

    const DB_JSONP_URL = 'https://github.com/EhTagTranslation/Database/releases/latest/download/db.text.js';
    const CACHE_KEY = 'lrr_ehtag_db_v2';
    const UPDATE_INTERVAL = 3 * 24 * 60 * 60 * 1000;

    const NAMESPACE_MAP = {
        'artist-tag': 'artist', 'group-tag': 'group', 'parody-tag': 'parody', 'character-tag': 'character',
        'female-tag': 'female', 'male-tag': 'male', 'language-tag': 'language', 'mixed-tag': 'mixed',
        'other-tag': 'other', 'cosplayer-tag': 'cosplayer', 'reclass-tag': 'reclass',
        'category-tag': 'category', 'location-tag': 'location', 'series-tag': 'series'
    };

    const LABEL_CLASS_MAP = {
        'artist': 'artist', 'category': 'category', 'character': 'character', 'cosplayer': 'cosplayer',
        'dateadded': 'date_added', 'date-added': 'date_added', 'female': 'female', 'group': 'group',
        'language': 'language', 'location': 'location', 'male': 'male', 'mixed': 'mixed',
        'other': 'other', 'parody': 'parody', 'series': 'series', 'source': 'source',
        'timestamp': 'timestamp', 'uploader': 'uploader'
    };

    const LABEL_TEXT_MAP = {
        'artist:': 'artist', 'category:': 'category', 'character:': 'character', 'cosplayer:': 'cosplayer',
        'date added:': 'date_added', 'female:': 'female', 'group:': 'group', 'language:': 'language',
        'location:': 'location', 'male:': 'male', 'mixed:': 'mixed', 'other:': 'other',
        'parody:': 'parody', 'series:': 'series', 'source:': 'source', 'timestamp:': 'timestamp',
        'uploader:': 'uploader'
    };

    const NAMESPACE_LABEL_CN = {
        artist: "艺术家", category: "分类", character: "角色", cosplayer: "Cosplayer",
        date_added: "添加日期", female: "女性", group: "社团", language: "语言",
        location: "地点", male: "男性", mixed: "混合", other: "其他", parody: "原作",
        series: "系列", source: "来源", timestamp: "发布日期", uploader: "发布者"
    };

    const CATEGORY_MAP = {
        "doujinshi": "同人志", "manga": "漫画", "artist cg": "画师CG", "game cg": "游戏CG",
        "western": "西方", "image set": "图集", "non-h": "无H", "cosplay": "Cosplay",
        "asian porn": "亚洲色情", "misc": "杂项", "private": "私有"
    };

    let translationDB = null;

    function parseEhTagDB(rawObj) {
        if (!rawObj || typeof rawObj !== "object") throw new Error("DB root is not an object");
        const optimizedDB = {};

        const nsList = Array.isArray(rawObj.data) ? rawObj.data :
                       (rawObj.data ? Object.entries(rawObj.data).map(([k, v]) => ({ namespace: k, data: v })) : []);

        for (const nsObj of nsList) {
            if (!nsObj || !nsObj.data) continue;
            const nsKey = String(nsObj.namespace).toLowerCase();
            optimizedDB[nsKey] = optimizedDB[nsKey] || {};
            for (const [tagKey, tagObj] of Object.entries(nsObj.data)) {
                if (tagObj && tagObj.name) optimizedDB[nsKey][tagKey.toLowerCase()] = tagObj.name;
            }
        }

        if (Object.keys(optimizedDB).length === 0) throw new Error("Parsed DB is empty");
        return optimizedDB;
    }

    function loadCache() {
        try { return JSON.parse(window.localStorage.getItem(CACHE_KEY)); } catch (e) { return null; }
    }
    function saveCache(data) {
        try { window.localStorage.setItem(CACHE_KEY, JSON.stringify({ data, time: Date.now() })); } catch (e) {}
    }
    function deleteCache() {
        try { window.localStorage.removeItem(CACHE_KEY); } catch (e) {}
    }

    let jsonpLoading = false;
    let jsonpLoadedOnce = false;

    function loadDBViaJSONP() {
        if (jsonpLoading) return;
        jsonpLoading = true;
        if (translationDB && jsonpLoadedOnce) { jsonpLoading = false; return; }

        try { delete window.load_ehtagtranslation_db_text; } catch (e) { window.load_ehtagtranslation_db_text = undefined; }

        window.load_ehtagtranslation_db_text = function(rawDb) {
            jsonpLoadedOnce = true;
            jsonpLoading = false;
            try {
                const optimizedDB = parseEhTagDB(rawDb);
                translationDB = optimizedDB;
                saveCache(optimizedDB);
                startObserver();
                translateNode(document.body);
            } catch (err) {}
            finally {
                try { delete window.load_ehtagtranslation_db_text; } catch (e) { window.load_ehtagtranslation_db_text = undefined; }
            }
        };

        const script = document.createElement('script');
        script.src = DB_JSONP_URL + '?_=' + Date.now();
        script.async = true;
        script.onerror = function() { jsonpLoading = false; };
        (document.head || document.body || document.documentElement).appendChild(script);
    }

    function initDB() {
        const cached = loadCache();
        const now = Date.now();
        if (cached && cached.data && cached.time && (now - cached.time <= UPDATE_INTERVAL) && Object.keys(cached.data).length >= 3) {
            translationDB = cached.data;
            startObserver();
        } else {
            loadDBViaJSONP();
        }
    }

    function getTranslation(namespace, text) {
        if (!translationDB || !text) return null;
        const clean = text.trim().toLowerCase();
        return translationDB[namespace]?.[clean] || translationDB['mixed']?.[clean] || null;
    }

    function normalizeClassName(cls) {
        if (!cls) return "";
        return cls.replace(/caption-namespace|-tag|_|-/gi, "").trim().toLowerCase();
    }

    function applyNamespaceLabelTranslation(labelTd, ns) {
        const cn = NAMESPACE_LABEL_CN[ns];
        if (cn && !labelTd.dataset.lrrNsLabelTranslated) {
            labelTd.dataset.lrrNsLabelTranslated = "true";
            labelTd.dataset.lrrNsLabelOriginal = labelTd.textContent;
            labelTd.textContent = cn + ":";
        }
    }

    function resolveNamespaceFromLabelTd(labelTd) {
        if (!labelTd) return null;
        for (const cls of labelTd.classList) {
            const n = normalizeClassName(cls);
            if (LABEL_CLASS_MAP[n]) {
                const ns = LABEL_CLASS_MAP[n];
                applyNamespaceLabelTranslation(labelTd, ns);
                return ns;
            }
        }
        const txt = labelTd.textContent.trim().toLowerCase().replace(/:$/, '') + ':';
        if (LABEL_TEXT_MAP[txt]) {
            const ns = LABEL_TEXT_MAP[txt];
            applyNamespaceLabelTranslation(labelTd, ns);
            return ns;
        }
        return null;
    }

    function translateElement(element) {
        if (element.dataset.lrrTranslated) return;
        const originalText = element.innerText;
        let namespaceKey = null;

        for (const [cls, key] of Object.entries(NAMESPACE_MAP)) {
            if (element.classList.contains(cls)) { namespaceKey = key; break; }
        }

        let labelTdRef = null;
        if (!namespaceKey && element.tagName === 'A' && element.parentElement?.classList.contains('gt')) {
            const tr = element.closest('tr');
            if (tr) {
                const labelTd = tr.querySelector('td.caption-namespace');
                labelTdRef = labelTd;
                const ns = resolveNamespaceFromLabelTd(labelTd);
                if (ns) namespaceKey = ns;
            }
        }

        if (!namespaceKey) return;
        if (labelTdRef) applyNamespaceLabelTranslation(labelTdRef, namespaceKey);

        if (['source', 'date_added', 'timestamp', 'uploader'].includes(namespaceKey)) return;

        const newText = namespaceKey === 'category' ? CATEGORY_MAP[originalText.trim().toLowerCase()] : getTranslation(namespaceKey, originalText);

        if (newText) {
            element.dataset.lrrOriginalText = originalText;
            element.textContent = newText;
            element.title = originalText;
            element.dataset.lrrTranslated = "true";
        }
    }

    const BOTTOM_SORT_ORDER = ['date_added', 'timestamp', 'uploader', 'source'];

    function reorderMetadata(root) {
        if (!root || !root.querySelectorAll) return;

        const tbodies = root.querySelectorAll('.caption-tags table.itg tbody, table.itg tbody');

        tbodies.forEach(tbody => {
            if (tbody.closest('#DataTables_Table_0')) return;

            if (tbody.dataset.lrrSorted) return;

            const rows = Array.from(tbody.querySelectorAll('tr'));
            let hasTargetRows = false;

            rows.forEach(row => {
                const labelTd = row.querySelector('td.caption-namespace');
                if (!labelTd) return;

                for (let i = 0; i < BOTTOM_SORT_ORDER.length; i++) {
                    const key = BOTTOM_SORT_ORDER[i];
                    if (labelTd.classList.contains(`${key}-tag`)) {
                        row.style.order = 10 + i;
                        hasTargetRows = true;

                        if (i === 0) {
                             row.style.borderTop = "1px dashed rgba(255,255,255,0.1)";
                             row.style.marginTop = "4px";
                             row.style.paddingTop = "2px";
                        }
                        break;
                    }
                }
            });

            if (hasTargetRows) {
                tbody.dataset.lrrSorted = "true";
            }
        });
    }

    function translateNode(node) {
        if (!translationDB) return;
        const root = (node && node.querySelectorAll) ? node : document.body;

        const spans = root.querySelectorAll('span[class$="-tag"]');
        const links = root.querySelectorAll('.gt a');
        spans.forEach(translateElement);
        links.forEach(translateElement);

        reorderMetadata(root);
    }

    let lrrObserverStarted = false;
    function startObserver() {
        if (lrrObserverStarted) return;
        lrrObserverStarted = true;
        translateNode(document.body);
        const observer = new MutationObserver((mutations) => {
            let added = 0;
            for (const m of mutations) added += m.addedNodes.length;
            if (added > 0) translateNode(document.body);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.LRREhTagForceUpdate = function() {
        deleteCache(); translationDB = null; jsonpLoadedOnce = false; loadDBViaJSONP();
    };

    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand("强制更新翻译数据库", () => {
            if (confirm("确定要删除本地缓存并重新下载最新的翻译数据库吗？")) {
                window.LRREhTagForceUpdate();
            }
        });
    }

    function bootstrap() { initDB(); }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
    else bootstrap();

})();