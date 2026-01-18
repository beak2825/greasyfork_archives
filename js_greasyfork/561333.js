// ==UserScript==
// @name         LANraragi 标签翻译
// @namespace    https://github.com/Kelcoin
// @version      1.2.1
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

        .awesomplete > ul {
            display: none !important;
        }

        #lrr-search-suggestions {
            position: absolute;
            background: rgba(28, 30, 36, 0.98); 
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(140, 160, 190, 0.28);
            border-radius: 10px;
            box-shadow: 0 10px 28px -8px rgba(5, 10, 25, 0.72), 0 4px 18px rgba(0, 0, 0, 0.36);
            z-index: 999999;
            max-height: 300px;
            overflow-y: auto;
            display: none;
            font-size: 14px;
            font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
            text-align: left;
            scrollbar-width: thin;
            scrollbar-color: rgba(140, 160, 190, 0.4) transparent;
        }

        #lrr-search-suggestions::-webkit-scrollbar {
            width: 6px;
        }
        #lrr-search-suggestions::-webkit-scrollbar-track {
            background: transparent;
        }
        #lrr-search-suggestions::-webkit-scrollbar-thumb {
            background-color: rgba(140, 160, 190, 0.4);
            border-radius: 3px;
        }

        .lrr-suggestion-item {
            padding: 10px 14px;
            cursor: pointer;
            border-bottom: 1px solid rgba(140, 160, 190, 0.1);
            display: flex;
            align-items: center;
            transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
            color: #e3e9f3;
        }

        .lrr-suggestion-item:last-child {
            border-bottom: none;
        }

        .lrr-suggestion-item:hover {
            background-color: rgba(40, 43, 52, 0.98);
            padding-left: 18px;
        }

        .lrr-suggestion-ns {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 6px;
            background-color: rgba(74, 159, 240, 0.15);
            color: #4a9ff0;
            font-size: 12px;
            font-weight: 600;
            margin-right: 12px;
            flex-shrink: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .lrr-suggestion-trans {
            font-weight: 500;
            margin-right: 10px;
            color: #e3e9f3;
            flex-shrink: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .lrr-suggestion-key {
            margin-left: auto;
            color: #a7b1c2;
            font-size: 0.85em;
            font-family: Consolas, Monaco, monospace;
            opacity: 0.8;
            white-space: nowrap;
        }

        @media (max-width: 768px) {
            .lrr-suggestion-item {
                flex-wrap: nowrap !important;
                align-items: center; 
                padding: 10px 8px;
            }
            
            .lrr-suggestion-ns {
                margin-right: 6px;
                font-size: 11px;
                padding: 2px 5px;
            }

            .lrr-suggestion-trans {
                font-size: 13px;
                margin-right: 8px;
                flex: 0 1 auto; 
                max-width: 50%; 
            }

            .lrr-suggestion-key {
                margin-left: auto; 
                flex: 1 1 auto;
                text-align: right;
                margin-top: 0;
                font-size: 0.75em;
                opacity: 0.7;
                white-space: normal; 
                word-wrap: break-word;
                line-height: 1.2;
            }
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
        series: "系列", source: "来源", timestamp: "发布日期", uploader: "发布者",
        reclass: "分类"
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
                setupSearchSuggestions();
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
            setupSearchSuggestions();
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

    // ============================================
    // 搜索框中文标签反向查询建议
    // ============================================
    function setupSearchSuggestions() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        let suggestionBox = document.getElementById('lrr-search-suggestions');
        if (!suggestionBox) {
            suggestionBox = document.createElement('div');
            suggestionBox.id = 'lrr-search-suggestions';
            document.body.appendChild(suggestionBox);
        }

        let hideTimeout;

        searchInput.addEventListener('input', (e) => {
            const val = e.target.value; 
            if (!translationDB) return;

            const terms = val.split(',');
            const currentTerm = terms[terms.length - 1].trim().toLowerCase();

            if (!currentTerm || (currentTerm.includes(':') && /^[a-z0-9 _]+:[a-z0-9 _]+$/.test(currentTerm))) {
                suggestionBox.style.display = 'none';
                return;
            }

            const matches = [];
            let count = 0;

            for (const ns in translationDB) {
                if (ns === 'rows') continue;
                const nsObj = translationDB[ns];
                for (const key in nsObj) {
                    const trans = nsObj[key];
                    let matchType = -1;
                    
                    if (trans === currentTerm || key === currentTerm) matchType = 0;
                    else if (trans.startsWith(currentTerm)) matchType = 1;
                    else if (key.startsWith(currentTerm)) matchType = 2;
                    else if (trans.includes(currentTerm)) matchType = 3;
                    else if (key.includes(currentTerm)) matchType = 4;

                    if (matchType !== -1) {
                        matches.push({ ns: ns, key: key, trans: trans, matchType: matchType, len: trans.length });
                        count++;
                        if (count >= 500) break; 
                    }
                }
                if (count >= 500) break;
            }

            matches.sort((a, b) => {
                if (a.matchType !== b.matchType) {
                    return a.matchType - b.matchType;
                }
                return a.len - b.len;
            });

            renderSuggestions(matches.slice(0, 50), searchInput, suggestionBox);
        });

        searchInput.addEventListener('focus', () => {
             if (searchInput.value.trim()) {
                 searchInput.dispatchEvent(new Event('input'));
             }
        });

        searchInput.addEventListener('blur', () => {
            hideTimeout = setTimeout(() => {
                suggestionBox.style.display = 'none';
            }, 200);
        });

        window.addEventListener('resize', () => {
            if (suggestionBox.style.display !== 'none') {
                positionSuggestionBox(searchInput, suggestionBox);
            }
        });
    }

    function positionSuggestionBox(input, box) {
        const rect = input.getBoundingClientRect();
        box.style.left = (rect.left + window.scrollX) + 'px';
        box.style.top = (rect.bottom + window.scrollY + 6) + 'px'; 
        box.style.width = rect.width + 'px';
    }

    function renderSuggestions(matches, input, box) {
        if (matches.length === 0) {
            box.style.display = 'none';
            return;
        }

        box.innerHTML = '';
        positionSuggestionBox(input, box);
        box.style.display = 'block';

        matches.forEach(m => {
            const div = document.createElement('div');
            div.className = 'lrr-suggestion-item';
            
            const nsLabel = NAMESPACE_LABEL_CN[m.ns] || m.ns;
            
            div.innerHTML = `
                <span class="lrr-suggestion-ns">${nsLabel}</span>
                <span class="lrr-suggestion-trans">${m.trans}</span>
                <span class="lrr-suggestion-key">${m.key}</span>
            `;

            div.addEventListener('click', () => {
                const targetNs = m.ns === 'reclass' ? 'category' : m.ns;
                const newTag = `${targetNs}:${m.key}$`;
                
                const currentVal = input.value;
                const lastCommaIndex = currentVal.lastIndexOf(',');
                
                let newVal;
                if (lastCommaIndex === -1) {
                    newVal = newTag;
                } else {
                    const prefix = currentVal.substring(0, lastCommaIndex + 1);
                    newVal = prefix + ' ' + newTag;
                }
                
                input.value = newVal + ', ';
                
                box.style.display = 'none';
                input.focus();
            });

            box.appendChild(div);
        });
    }

    window.LRREhTagForceUpdate = function() {
        deleteCache(); translationDB = null; jsonpLoadedOnce = false; loadDBViaJSONP();
    };

    function bootstrap() { initDB(); }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
    else bootstrap();

})();