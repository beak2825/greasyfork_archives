// ==UserScript==
// @name         LANraragi 标签翻译
// @namespace    https://github.com/Kelcoin
// @version      1.0
// @description  基于 EhTagTranslation 数据库翻译并替换 LANraragi 的标签
// @author       Kelcoin
// @include      https://lanraragi*/*
// @include      http://lanraragi*/*
// @match        https://lrr.tvc-16.science/*
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

    // ============================================================
    //  配置项
    // ============================================================

    const DB_URL = 'https://github.com/EhTagTranslation/Database/releases/latest/download/db.text.json';

    const CACHE_KEY = 'lrr_ehtag_db_v2';
    const UPDATE_INTERVAL = 3 * 24 * 60 * 60 * 1000;

    // 列表页 span 上的 class -> 命名空间
    const NAMESPACE_MAP = {
        'artist-tag': 'artist',
        'group-tag': 'group',
        'parody-tag': 'parody',
        'character-tag': 'character',
        'female-tag': 'female',
        'male-tag': 'male',
        'language-tag': 'language',
        'mixed-tag': 'mixed',
        'other-tag': 'other',
        'cosplayer-tag': 'cosplayer',
        'reclass-tag': 'reclass',
        'category-tag': 'category',
        'location-tag': 'location',
        'series-tag': 'series'
        // 不处理 source-tag（值）
    };

    // label class / 文本 -> 命名空间
    const LABEL_CLASS_MAP = {
        'artist': 'artist',
        'category': 'category',
        'character': 'character',
        'cosplayer': 'cosplayer',
        'dateadded': 'date_added',
        'date-added': 'date_added',
        'female': 'female',
        'group': 'group',
        'language': 'language',
        'location': 'location',
        'male': 'male',
        'mixed': 'mixed',
        'other': 'other',
        'parody': 'parody',
        'series': 'series',
        'source': 'source',
        // 新的元数据命名空间
        'timestamp': 'timestamp',
        'uploader': 'uploader'
    };

    const LABEL_TEXT_MAP = {
        'artist:': 'artist',
        'category:': 'category',
        'character:': 'character',
        'cosplayer:': 'cosplayer',
        'date added:': 'date_added',
        'female:': 'female',
        'group:': 'group',
        'language:': 'language',
        'location:': 'location',
        'male:': 'male',
        'mixed:': 'mixed',
        'other:': 'other',
        'parody:': 'parody',
        'series:': 'series',
        'source:': 'source',
        'timestamp:': 'timestamp',
        'uploader:': 'uploader'
    };

    // 命名空间中文显示名（用于左侧 label）
    const NAMESPACE_LABEL_CN = {
        artist:     "艺术家",
        category:   "分类",
        character:  "角色",
        cosplayer:  "Cosplayer",
        date_added: "添加日期",
        female:     "女性",
        group:      "社团",
        language:   "语言",
        location:   "地点",
        male:       "男性",
        mixed:      "混合",
        other:      "其他",
        parody:     "原作",
        series:     "系列",
        source:     "来源",
        timestamp:  "发布日期",
        uploader:   "发布者"
    };

    // category 固定映射（小写 key）
    const CATEGORY_MAP = {
        "doujinshi": "同人志",
        "manga": "漫画",
        "artist cg": "画师CG",
        "game cg": "游戏CG",
        "western": "西方",
        "image set": "图集",
        "non-h": "无H",
        "cosplay": "Cosplay",
        "asian porn": "亚洲色情",
        "misc": "杂项",
        "private": "私有"
    };

    let translationDB = null;

    // ============================================================
    //  EhTag DB 解析器（兼容新旧结构）
    // ============================================================

    function parseEhTagDB(rawObj) {
        if (!rawObj || typeof rawObj !== "object") {
            throw new Error("DB root is not an object");
        }

        const optimizedDB = {};

        if (Array.isArray(rawObj.data)) {
            // 新结构：data 是数组
            for (const nsObj of rawObj.data) {
                if (!nsObj || typeof nsObj !== "object") continue;

                const nsName = nsObj.namespace;
                const nsData = nsObj.data;

                if (!nsName || !nsData || typeof nsData !== "object") {
                    continue;
                }

                const nsKey = String(nsName).toLowerCase();
                optimizedDB[nsKey] = optimizedDB[nsKey] || {};

                for (const [tagKey, tagObj] of Object.entries(nsData)) {
                    if (!tagObj || typeof tagObj !== "object") continue;
                    const cnName = tagObj.name || "";
                    if (!cnName) continue;
                    optimizedDB[nsKey][tagKey.toLowerCase()] = cnName;
                }
            }
        } else if (rawObj.data && typeof rawObj.data === "object") {
            // 旧结构：data 是对象
            for (const [nsName, nsData] of Object.entries(rawObj.data)) {
                if (!nsData || typeof nsData !== "object") continue;

                const nsKey = String(nsName).toLowerCase();
                optimizedDB[nsKey] = optimizedDB[nsKey] || {};

                for (const [tagKey, tagObj] of Object.entries(nsData)) {
                    if (!tagObj || typeof tagObj !== "object") continue;
                    const cnName = tagObj.name || "";
                    if (!cnName) continue;
                    optimizedDB[nsKey][tagKey.toLowerCase()] = cnName;
                }
            }
        } else {
            throw new Error("Unknown DB structure: no usable data field");
        }

        const nsList = Object.keys(optimizedDB);
        if (nsList.length === 0) {
            throw new Error("Parsed DB is empty");
        }

        return optimizedDB;
    }

    // ============================================================
    //  数据库初始化
    // ============================================================

    async function initDB() {
        const cached = GM_getValue(CACHE_KEY);
        const now = Date.now();

        if (cached && cached.data && cached.time) {
            if (now - cached.time > UPDATE_INTERVAL) {
                return fetchDB();
            }

            if (Object.keys(cached.data).length < 3 || !cached.data['female']) {
                return fetchDB();
            }

            translationDB = cached.data;
            startObserver();
        } else {
            fetchDB();
        }
    }

    // ============================================================
    //  下载数据库
    // ============================================================

    function fetchDB() {
        GM_xmlhttpRequest({
            method: "GET",
            url: DB_URL,
            timeout: 30000,

            onload: function(response) {
                if (response.status !== 200) {
                    return;
                }

                try {
                    const raw = response.responseText;
                    const data = JSON.parse(raw);

                    const optimizedDB = parseEhTagDB(data);

                    translationDB = optimizedDB;
                    GM_setValue(CACHE_KEY, { data: optimizedDB, time: Date.now() });

                    startObserver();
                    translateNode(document.body);
                } catch (e) {
                    alert("LRR汉化脚本: 数据库解析失败，请检查控制台日志。");
                }
            },

            onerror: function() {
                // 静默失败
            },

            ontimeout: function() {
                // 静默超时
            }
        });
    }

    // ============================================================
    //  翻译核心（只改显示，不破坏点击）
    // ============================================================

    function getTranslation(namespace, text) {
        if (!translationDB || !text) return null;

        const cleanText = text.trim().toLowerCase();

        if (translationDB[namespace] && translationDB[namespace][cleanText]) {
            return translationDB[namespace][cleanText];
        }

        // 兜底 mixed：EhTag 的 mixed 通常是杂项标签池
        if (translationDB['mixed'] && translationDB['mixed'][cleanText]) {
            return translationDB['mixed'][cleanText];
        }

        return null;
    }

    function normalizeClassName(cls) {
        if (!cls) return "";
        return cls.replace(/caption-namespace/gi, "")
                  .replace(/-tag/gi, "")
                  .replace(/_/g, "")
                  .replace(/-/g, "")
                  .trim()
                  .toLowerCase();
    }

    function applyNamespaceLabelTranslation(labelTd, ns) {
        const cn = NAMESPACE_LABEL_CN[ns];
        if (!cn || !labelTd) return;

        if (!labelTd.dataset.lrrNsLabelTranslated) {
            const original = labelTd.textContent;
            labelTd.dataset.lrrNsLabelTranslated = "true";
            labelTd.dataset.lrrNsLabelOriginal = original;
            labelTd.textContent = cn + ":";
        }
    }

    function resolveNamespaceFromLabelTd(labelTd) {
        if (!labelTd) return null;

        // 1. 先从 class 推断
        for (const cls of labelTd.classList) {
            const n = normalizeClassName(cls);
            if (!n) continue;
            if (LABEL_CLASS_MAP[n]) {
                const ns = LABEL_CLASS_MAP[n];
                applyNamespaceLabelTranslation(labelTd, ns);
                return ns;
            }
        }

        // 2. 再从文本内容推断
        const labelText = labelTd.textContent.trim().toLowerCase();
        const withColon = labelText.endsWith(':') ? labelText : (labelText + ':');
        if (LABEL_TEXT_MAP[withColon]) {
            const ns = LABEL_TEXT_MAP[withColon];
            applyNamespaceLabelTranslation(labelTd, ns);
            return ns;
        }

        return null;
    }

    function translateElement(element) {
        if (element.dataset.lrrTranslated) return;

        const originalText = element.innerText;
        let namespaceKey = null;

        // A: 列表页 span（class 带 *-tag）
        for (const [className, nsKey] of Object.entries(NAMESPACE_MAP)) {
            if (element.classList.contains(className)) {
                namespaceKey = nsKey;
                break;
            }
        }

        // B: 详情 / Tooltip link
        let labelTdRef = null;
        if (!namespaceKey && element.tagName === 'A') {
            if (element.parentElement?.classList.contains('gt')) {
                const tr = element.closest('tr');
                const labelTd = tr?.querySelector('td.caption-namespace');
                labelTdRef = labelTd || null;
                const nsFromLabel = resolveNamespaceFromLabelTd(labelTd);
                if (nsFromLabel) {
                    namespaceKey = nsFromLabel;
                }
            }
        }

        if (!namespaceKey) {
            return;
        }

        // 再次确保 label 已翻译（详情面板左列）
        if (labelTdRef) {
            applyNamespaceLabelTranslation(labelTdRef, namespaceKey);
        }

        // 跳过只需要翻 label 的字段值：source / date_added / timestamp / uploader
        if (namespaceKey === 'source' ||
            namespaceKey === 'date_added' ||
            namespaceKey === 'timestamp' ||
            namespaceKey === 'uploader') {
            return;
        }

        let newText = null;

        // category: 固定映射
        if (namespaceKey === 'category') {
            const keyLower = originalText.trim().toLowerCase();
            if (CATEGORY_MAP.hasOwnProperty(keyLower)) {
                newText = CATEGORY_MAP[keyLower];
            }
        } else {
            newText = getTranslation(namespaceKey, originalText);
        }

        if (!newText) {
            return;
        }

        if (!element.dataset.lrrOriginalText) {
            element.dataset.lrrOriginalText = originalText;
        }

        element.textContent = newText;
        element.title = originalText;
        element.dataset.lrrTranslated = "true";
    }

    // ============================================================
    //  DOM 元素重排序逻辑
    // ============================================================

    // 想要固定在底部的字段顺序（对应 HTML 中 caption-namespace 的 class 前缀）
    const BOTTOM_SORT_ORDER = ['date_added', 'timestamp', 'uploader', 'source'];

    function reorderMetadata(root) {
        if (!root || !root.querySelectorAll) return;

        const tables = root.querySelectorAll('.caption-tags table.itg tbody, table.itg tbody');

        tables.forEach(tbody => {
            if (tbody.dataset.lrrSorted) return;

            const rows = Array.from(tbody.querySelectorAll('tr'));
            const rowsToMove = {};

            // 1. 扫描当前表格，找到需要移动的行
            rows.forEach(row => {
                const labelTd = row.querySelector('td.caption-namespace');
                if (!labelTd) return;

                for (const key of BOTTOM_SORT_ORDER) {
                    if (labelTd.classList.contains(`${key}-tag`)) {
                        rowsToMove[key] = row;
                        break;
                    }
                }
            });

            // 2. 按指定顺序将它们 append 到 tbody 末尾
            let movedCount = 0;
            BOTTOM_SORT_ORDER.forEach(key => {
                if (rowsToMove[key]) {
                    tbody.appendChild(rowsToMove[key]);
                    movedCount++;
                }
            });

            if (movedCount > 0) {
                tbody.dataset.lrrSorted = "true";
            }
        });
    }

    // ============================================================
    //  扫描并翻译节点（仅标签和详情面板，完全不碰搜索框/搜索建议）
    // ============================================================

    function translateNode(node) {
        if (!translationDB) {
            return;
        }

        const root = (node && node.querySelectorAll) ? node : document.body;

        const spans = root.querySelectorAll('span[class$="-tag"]');
        const links = root.querySelectorAll('.gt a');

        spans.forEach(translateElement);
        links.forEach(translateElement);

        reorderMetadata(root);
    }

    // ============================================================
    //  MutationObserver
    // ============================================================

    function startObserver() {
        translateNode(document.body);

        const observer = new MutationObserver((mutations) => {
            let added = 0;

            for (const m of mutations) {
                added += m.addedNodes.length;
            }

            if (added > 0) {
                translateNode(document.body);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ============================================================
    //  菜单命令
    // ============================================================

    GM_registerMenuCommand("强制更新翻译数据库", () => {
        if (confirm("确定要删除本地缓存并重新下载最新的翻译数据库吗？")) {
            GM_deleteValue(CACHE_KEY);
            initDB();
        }
    });

    // ============================================================
    //  启动
    // ============================================================

    initDB();

})();
