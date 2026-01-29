// ==UserScript==
// @name         GSMArena 品牌頁面 拆解複製 - 3.1
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  在 GSMArena 的機型卡片上顯示快速複製按鈕（完整 / 核心 / 後綴 / 組合），並提供標註與本地儲存設定（繁體中文）
// @author       由 Curosr 協助建置（繁體中文註解）
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABnRSTlMAAAAAAABupgeRAAABK0lEQVR4AXxPg7KCURDuvbOt8b3ZbhgfINu2xrlxbTqzfzpcfJilweJyBVye8P7iw4EKHNRF6DeoxWztdrr4xKJxANOgTWRILBHLNpvNmbqAczUhOPymkmmEfCNwkDzE//96AjqdTpgAgNcZ+HzRfDYnoGAg+EZAaMjD4QhBFPIFlUr7ywHi8Wh8bx8OB6lUoVJqPsyAOTy+yG53lktll9MN6RcCPlRDkUi6Wi7fZqCCuByegMHEKmaTtdFo1qq1y0A2wGMNjno93SfJKPTZ2XZkZ6BbjumktrycSVLyQDRRSg5E6ut1RUc219bDzWVoQPZxQ9MEPT2QOkmQajiaqKTc6+XZWloC0oBsY3tx4URz0wnmphMtgCQCTYQxWiorQQkWzaFAhCvcgIoBJZjGKHBXJhMAAAAASUVORK5CYII=
// @author       BUTTST                                     // 作者資訊
// @license      MIT; https://opensource.org/licenses/MIT   // 開放源碼許可證
// @match        *://www.gsmarena.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560601/GSMArena%20%E5%93%81%E7%89%8C%E9%A0%81%E9%9D%A2%20%E6%8B%86%E8%A7%A3%E8%A4%87%E8%A3%BD%20-%2031.user.js
// @updateURL https://update.greasyfork.org/scripts/560601/GSMArena%20%E5%93%81%E7%89%8C%E9%A0%81%E9%9D%A2%20%E6%8B%86%E8%A7%A3%E8%A4%87%E8%A3%BD%20-%2031.meta.js
// ==/UserScript==

/*
GSMArena 品牌機型快速複製 — 工具簡介

用途 & 使用場景：
- 本工具安裝於 Tampermonkey，於 GSMArena 的品牌清單頁 自動啟用，
用於快速擷取與複製頁面上之機型名稱，並支援從多個品牌頁做批次擷取以產生標準化 JSON。

特點說明：
- UI：在型號項目加輕量浮層按鈕，非破壞頁面。
- 名稱拆解擷取：自動移除品牌詞，支援多種複製格式。
- 批次擷取：跨頁抓取並合併結果，含速率控制與重試。
- 本地儲存：設定與標註保存在本地，支援還原。
- 避免封禁：分批抓取並保持合理間隔，降低被封風險。

主要功能：
- 單筆複製：型號卡提供多種複製按鈕。
- 標註管理：收藏標註並支援匯出/還原。
- 當頁匯出：一鍵匯出當頁所有型號為 JSON。
- 批次擷取：從設定面板選取品牌清單後批次抓取。
- 設定面板：調整顯示、去重與抓取參數。
- 匯出格式：支援 HTML、CSV、JSON。

使用注意：請勿一次性選取大量品牌進行擷取，建議分批執行以降低被封風險






----------------------------
【更新紀錄】（由最新版永遠置頂，僅保留重點資訊）

- v3.1（2026/01/28 14:30）：
    * 新增：批次擷取已選取品牌功能（使用 GM_xmlhttpRequest，含速率控制、隨機 delay 與重試機制）
    * 開發重點：自 2.8 版本起至今日（2026/01/28）的開發工作皆圍繞「批次擷取」功能（優化流程與風控）
    * 新增：支援 GM_ 系列跨域請求（已在 metadata 中加入 `@grant GM_xmlhttpRequest`），並加入相關參數設定

- V2.1 — V2.9
    * 解析穩定化：強化對品牌頁面多變 DOM 的容錯，採用 mutation observer 與多層回退 selector。
    * 動態載入支援：支援延遲載入、滾動觸發抓取、分頁合併與重試機制。
    * 配置與可調性：新增選項面板，可自定 selector、匯出欄位、過濾條件與速率限制，並支援多組設定檔匯入/匯出。
    * 錯誤處理與日誌：完善錯誤回報、重試邏輯與 debug 模式（可輸出詳細日誌）。
    * UX / CSS 改善：控制面板與結果顯示優化、本地化支援、視覺樣式修正。
    * 效能與可靠性：減少記憶體洩漏與 DOM 操作頻次、修正 race condition 與 edge-case bugs。
    * 文件補強：新增/更新使用與開發筆記、範例設定與常見問題說明。

- V0 → V1.0
    * 初始開發與原型：建立 Tampermonkey 腳本基本架構、metadata 與啟動檢測。
    * 核心解析邏輯：實作品牌頁面機型列表擷取（名稱、封面、連結），並建立初版 selectors 與容錯機制。
    * 基礎 UI 與匯出：加入簡易控制面板與結果匯出（HTML / CSV）。
    * 初步優化：整合資源與樣式、修正初期效能與相容性問題、基本錯誤修補。


*/

(function () {
    'use strict';

    // -------------------------
    // 設定與常數（繁體中文註解）
    // -------------------------
    const STORAGE_KEYS = {
        SETTINGS: 'gz_quickcopy_settings_v1',
        HIGHLIGHTS: 'gz_quickcopy_highlights_v1' // 存放標註資料（Object）
    };

    // 支援的廠牌字詞（用於從完整名稱中剔除品牌）
    // 來源：你提供的廠牌清單，全部視為允許啟動頁面；在解析時會嘗試移除這些品牌字詞
    const BRAND_WORDS = [
        'SAMSUNG','SAMSUNG','Samsung','APPLE','HUAWEI','NOKIA','SONY','LG','HTC','MOTOROLA','LENOVO','XIAOMI','GOOGLE','HONOR','OPPO','REALME','ONEPLUS','NOTHING','VIVO','MEIZU','ASUS','ALCATEL','ZTE','MICROSOFT','UMIDIGI','COOLPAD','OSCAL','SHARP','MICROMAX','INFINIX','ULEFONE','TECNO'
    ];

    // 常見系列字詞（series），例如 Tab、Galaxy 之類（用於產生 [series + core + suffix]）
    const SERIES_WORDS = ['Tab','Galaxy','Xperia','Zenfone','Moto','Redmi','Poco','Mi','Note','Pixel'];

    // 常見後綴（suffix）
    const SUFFIX_WORDS = ['Ultra','Pro','Plus','Max','FE','Edge','Lite','Mini','SE','5G','4G','LTE','XL','Neo','Fold','Flip','Classic','GT','LE','XR','XS','S','T','Ultra+'];

    // ----------------------------------------------------------------
    // 可編輯：預設品牌清單（請直接在此區以陣列方式編輯，修改後需重新載入 Userscript）
    // - 編輯方式：在陣列中加入或移除字串（使用品牌英文首字母大小寫與上方 BRAND_WORDS 相同）
    // - 範例：const DEFAULT_BRANDS = ['Samsung','Apple','Xiaomi'];
    // ----------------------------------------------------------------
    const DEFAULT_BRANDS = [
        'Samsung','Apple','Huawei','Nokia','Sony','HTC','Motorola','Lenovo',
        'Xiaomi','Google','Honor','Oppo','Realme','OnePlus','Nothing','vivo',
        'Meizu','Asus','ZTE','Sharp','TCL'
    ];

    // ----------------------------------------------------------------
    // 抓取/風控參數（如需調整延遲、重試參數請在此編輯）
    // ----------------------------------------------------------------
    const BULK_FETCH_CONFIG = {
        concurrency: 1, // 同時請求數（保守設定為 1）
        minDelayMs: 1500,
        maxDelayMs: 3000,
        maxRetries: 4,
        userAgents: [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        ],
        acceptLanguage: 'zh-TW,zh;q=0.9'
    };

    // 品牌對應資訊（來源：開發者筆記 — 列/行位置 與 原始網址）
    // 用於在設定面板中排列成表格，並取得對應的品牌頁面路徑
    const BRAND_META = [
        { name:'Samsung', path:'samsung-phones-9.php', col:1, row:1, defaultIncluded:true },
        { name:'Apple', path:'apple-phones-48.php', col:1, row:2, defaultIncluded:true },
        { name:'Huawei', path:'huawei-phones-58.php', col:1, row:3, defaultIncluded:true },
        { name:'Nokia', path:'nokia-phones-1.php', col:1, row:4, defaultIncluded:true },
        { name:'Sony', path:'sony-phones-7.php', col:1, row:5, defaultIncluded:true },
        { name:'LG', path:'lg-phones-20.php', col:1, row:6, defaultIncluded:false },
        { name:'HTC', path:'htc-phones-45.php', col:1, row:7, defaultIncluded:true },
        { name:'Motorola', path:'motorola-phones-4.php', col:1, row:8, defaultIncluded:true },
        { name:'Lenovo', path:'lenovo-phones-73.php', col:1, row:9, defaultIncluded:true },

        { name:'Xiaomi', path:'xiaomi-phones-80.php', col:2, row:1, defaultIncluded:true },
        { name:'Google', path:'google-phones-107.php', col:2, row:2, defaultIncluded:true },
        { name:'Honor', path:'honor-phones-121.php', col:2, row:3, defaultIncluded:true },
        { name:'Oppo', path:'oppo-phones-82.php', col:2, row:4, defaultIncluded:true },
        { name:'Realme', path:'realme-phones-118.php', col:2, row:5, defaultIncluded:true },
        { name:'OnePlus', path:'oneplus-phones-95.php', col:2, row:6, defaultIncluded:true },
        { name:'Nothing', path:'nothing-phones-128.php', col:2, row:7, defaultIncluded:true },
        { name:'vivo', path:'vivo-phones-98.php', col:2, row:8, defaultIncluded:true },
        { name:'Meizu', path:'meizu-phones-74.php', col:2, row:9, defaultIncluded:true },

        { name:'Asus', path:'asus-phones-46.php', col:3, row:1, defaultIncluded:true },
        { name:'Alcatel', path:'alcatel-phones-5.php', col:3, row:2, defaultIncluded:false },
        { name:'ZTE', path:'zte-phones-62.php', col:3, row:3, defaultIncluded:true },
        { name:'RugOne', path:'rugone-phones-136.php', col:3, row:4, defaultIncluded:false },
        { name:'Umidigi', path:'umidigi-phones-135.php', col:3, row:5, defaultIncluded:false },
        { name:'Coolpad', path:'coolpad-phones-105.php', col:3, row:6, defaultIncluded:false },
        { name:'Oscal', path:'oscal-phones-134.php', col:3, row:7, defaultIncluded:false },
        { name:'Sharp', path:'sharp-phones-23.php', col:3, row:8, defaultIncluded:true },
        { name:'Micromax', path:'micromax-phones-66.php', col:3, row:9, defaultIncluded:false },

        { name:'Infinix', path:'infinix-phones-119.php', col:4, row:1, defaultIncluded:false },
        { name:'Ulefone', path:'ulefone_-phones-124.php', col:4, row:2, defaultIncluded:false },
        { name:'Tecno', path:'tecno-phones-120.php', col:4, row:3, defaultIncluded:false },
        { name:'Doogee', path:'doogee-phones-129.php', col:4, row:4, defaultIncluded:false },
        { name:'Blackview', path:'blackview-phones-116.php', col:4, row:5, defaultIncluded:false },
        { name:'Cubot', path:'cubot-phones-130.php', col:4, row:6, defaultIncluded:false },
        { name:'Oukitel', path:'oukitel-phones-132.php', col:4, row:7, defaultIncluded:false },
        { name:'Itel', path:'itel-phones-131.php', col:4, row:8, defaultIncluded:false },
        { name:'TCL', path:'tcl-phones-123.php', col:4, row:9, defaultIncluded:true }
    ];

    // 預設設定（可被使用者改動並儲存）
    const DEFAULT_SETTINGS = {
        autoHide: true,          // 是否自動隱藏（hover 顯示）
        zIndex: 99999,           // 浮層 z-index，若有衝突可調整
        buttonOrder: ['full','core','coreSuffix','suffix'], // 按鈕順序
        panelMini: false,        // 設定面板是否縮小（mini）
        panelPos: {x: 20, y: 80} // 設定面板預設位置
    };

    // -------------------------
    // 工具函式（複用、備註皆以繁中）
    // -------------------------
    function saveSettings(settings) {
        GM_setValue(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }

    // -----------------------------
    // 批次抓取實作（GM_xmlhttpRequest + 速率控制、重試）
    // 可由 UI 呼叫： window.bulkFetchSelectedBrands(selectedBrands, callbacks)
    // callbacks: { onProgress: fn(text), onComplete: fn(resultArray) }
    // -----------------------------
    window.bulkFetchSelectedBrands = async function(selectedBrands = [], callbacks = {}) {
        const results = [];
        const cfg = BULK_FETCH_CONFIG;
        const baseUrl = 'https://www.gsmarena.com/';

        function sleep(ms){ return new Promise(res=>setTimeout(res, ms)); }

        async function fetchWithRetry(url, attempt = 0) {
            return new Promise((resolve, reject) => {
                const ua = cfg.userAgents[Math.floor(Math.random()*cfg.userAgents.length)];
                try {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        headers: {
                            'User-Agent': ua,
                            'Accept-Language': cfg.acceptLanguage
                        },
                        timeout: 20000,
                        onload: function(resp) {
                            if (resp.status >= 200 && resp.status < 300) {
                                resolve(resp.responseText);
                            } else {
                                reject({status: resp.status, statusText: resp.statusText});
                            }
                        },
                        onerror: function(err) { reject(err); },
                        ontimeout: function() { reject({status:'timeout'}); }
                    });
                } catch (e) {
                    reject(e);
                }
            }).catch(async (err) => {
                if (attempt >= cfg.maxRetries) throw err;
                // 指數退避 + jitter
                const backoff = Math.pow(2, attempt) * 1000 + Math.floor(Math.random()*500);
                await sleep(backoff);
                return fetchWithRetry(url, attempt+1);
            });
        }

        function parseBrandHtml(html, brandName, url) {
            try {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const canonicalEl = doc.querySelector('link[rel=canonical]');
                const canonical = canonicalEl ? canonicalEl.getAttribute('href') : url;
                const nodes = Array.from(doc.querySelectorAll('div.makers ul li a'));
                const models = nodes.map(a => {
                    // 優先使用 innerText (strong/span) 或 img title
                    const strong = a.querySelector('strong span');
                    if (strong && strong.innerText) return strong.innerText.trim();
                    const txt = (a.textContent || '').trim();
                    if (txt) return txt;
                    const img = a.querySelector('img');
                    if (img && img.getAttribute('title')) return img.getAttribute('title').trim();
                    return '';
                }).filter(Boolean);
                return { brand: brandName, pageUrl: url, canonical, models, timestamp: new Date().toISOString() };
            } catch (e) {
                return { brand: brandName, pageUrl: url, canonical: url, models: [], timestamp: new Date().toISOString(), parseError: e.message };
            }
        }

        for (let i=0;i<selectedBrands.length;i++) {
            const bname = selectedBrands[i];
            const meta = BRAND_META.find(m => m.name === bname);
            const displayIndex = `${i+1}/${selectedBrands.length}`;
            try {
                if (!meta) {
                    if (callbacks.onProgress) callbacks.onProgress(`(${displayIndex}) 未找到品牌資訊：${bname}`);
                    results.push({ brand: bname, error: 'meta_not_found' });
                    continue;
                }
                if (callbacks.onProgress) callbacks.onProgress(`(${displayIndex}) 擷取 ${bname} ...`);
                // 隨機等待（模擬人類、避免 DDoS 偵測）
                const randDelay = cfg.minDelayMs + Math.floor(Math.random()*(cfg.maxDelayMs - cfg.minDelayMs + 1));
                await sleep(randDelay);
                const url = baseUrl + meta.path;
                const html = await fetchWithRetry(url, 0);
                const parsed = parseBrandHtml(html, bname, url);
                results.push(parsed);
                if (callbacks.onProgress) callbacks.onProgress(`(${displayIndex}) 完成 ${bname}`);
            } catch (e) {
                console.warn('[bulkFetch] error for', bname, e);
                results.push({ brand: bname, error: (e && e.status) ? `HTTP_${e.status}` : 'fetch_error', detail: e });
                if (callbacks.onProgress) callbacks.onProgress(`(${displayIndex}) ${bname} 發生錯誤`);
            }
        }

        if (callbacks.onComplete) callbacks.onComplete(results);
        return results;
    };

    function loadSettings() {
        try {
            const s = GM_getValue(STORAGE_KEYS.SETTINGS);
            console.log('[GSMArena 快速複製] 載入設定:', s ? '有儲存資料' : '無儲存資料，使用預設');

            if (!s) {
                saveSettings(DEFAULT_SETTINGS);
                return DEFAULT_SETTINGS;
            }
            const parsed = JSON.parse(s);
            const result = Object.assign({}, DEFAULT_SETTINGS, parsed);
            console.log('[GSMArena 快速複製] 最終設定:', result);
            return result;
        } catch (e) {
            console.error('[GSMArena 快速複製] 解析設定失敗，回復預設:', e);
            saveSettings(DEFAULT_SETTINGS);
            return DEFAULT_SETTINGS;
        }
    }

    function saveHighlights(obj) {
        GM_setValue(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(obj || {}));
        // 儲存後排程更新畫面上的顯示（brand 選單、標註顯示）
        scheduleRefreshAllDisplays();
    }
    function loadHighlights() {
        const s = GM_getValue(STORAGE_KEYS.HIGHLIGHTS);
        if (!s) return {};
        try { return JSON.parse(s); } catch (e) { return {}; }
    }

    // 重新整理所有「品牌下拉選單」的選項（當標註資料改變時呼叫）
    function refreshBrandSelects() {
        const selects = document.querySelectorAll('select.gzqc-brand-select');
        const h = loadHighlights();
        const brandsSet = new Set();

        // 改進品牌識別邏輯：檢查型號名稱是否以品牌開頭，或包含品牌詞
        Object.values(h).forEach(it => {
            const text = (it.text || '').trim();
            if (!text) return;

            const textLower = text.toLowerCase();
            for (const brand of BRAND_WORDS) {
                if (!brand) continue;
                const brandLower = brand.toLowerCase();

                if (textLower.startsWith(brandLower + ' ') ||
                    textLower.startsWith(brandLower + '-') ||
                    textLower === brandLower) {
                    brandsSet.add(brand);
                    break;
                }
                if (textLower.includes(brandLower)) {
                    brandsSet.add(brand);
                    break;
                }
            }
        });

        // 若沒有從 highlights 找到品牌，嘗試從當前頁面偵測並與本頁機型比對後補上
        if (brandsSet.size === 0) {
            const currentPageBrand = detectCurrentPageBrand();
            if (currentPageBrand) {
                try {
                    const pageNodes = findModelNodes();
                    const pageTexts = pageNodes.map(n=>n.text.toLowerCase());
                    const anyMatch = Object.values(h).some(it => pageTexts.includes((it.text||'').toLowerCase()));
                    if (anyMatch) brandsSet.add(currentPageBrand);
                } catch (e) { /* ignore */ }
            }
        }

        // 比對前一次的品牌集合，輸出新增/刪除資訊
        try {
            const newSet = new Set(brandsSet);
            const added = Array.from(newSet).filter(x => !_prevBrandsSet.has(x));
            const removed = Array.from(_prevBrandsSet).filter(x => !newSet.has(x));
            if (added.length || removed.length) {
                console.log('[GSMArena 快速複製] brand list changed. added:', added, 'removed:', removed);
                // 顯示目前每品牌下的標註型號（若有）
                const h = loadHighlights();
                const byBrand = {};
                Object.keys(h).forEach(k => {
                    const txt = (h[k].text||'').trim();
                    for (const b of BRAND_WORDS) {
                        if (!b) continue;
                        const bl = b.toLowerCase();
                        if (txt.toLowerCase().startsWith(bl + ' ') || txt.toLowerCase().includes(bl)) {
                            byBrand[b] = byBrand[b] || [];
                            byBrand[b].push(txt);
                            break;
                        }
                    }
                });
                console.log('[GSMArena 快速複製] highlights by brand:', byBrand);
            }
            _prevBrandsSet = newSet;
        } catch (e) {
            console.warn('[GSMArena 快速複製] refreshBrandSelects compare error:', e);
        }

        selects.forEach(sel => {
            sel.innerHTML = '';
            if (brandsSet.size === 0) {
                const opt = document.createElement('option'); opt.value=''; opt.innerText='(無)'; sel.appendChild(opt);
            } else {
                const sortedBrands = Array.from(brandsSet).sort();
                sortedBrands.forEach(b => {
                    const opt = document.createElement('option'); opt.value = b; opt.innerText = b; sel.appendChild(opt);
                });
            }
        });
    }

    // 更新所有現有 corner/highlight 的顯示狀態與品牌下拉選單（debounced）
    let _gzqc_refresh_timer = null;
    function scheduleRefreshAllDisplays() {
        if (_gzqc_refresh_timer) clearTimeout(_gzqc_refresh_timer);
        _gzqc_refresh_timer = setTimeout(refreshAllDisplays, 120);
    }
    function refreshAllDisplays() {
        const highlights = loadHighlights();
        // 更新 corner 與 highlight 顯示
        document.querySelectorAll('.gzqc-corner').forEach(corner => {
            const k = corner.dataset.modelKey;
            if (k && highlights[k]) corner.classList.add('active'); else corner.classList.remove('active');
        });
        document.querySelectorAll('.gzqc-highlight').forEach(hEl => {
            const k = hEl.dataset.modelKey;
            if (k && highlights[k]) hEl.style.display = ''; else hEl.style.display = 'none';
        });
        // 更新品牌下拉
        refreshBrandSelects();
    }

    // 產生簡單 key（以 origin + modelText 為鍵）
    function makeModelKey(modelText) {
        const origin = location.origin.replace(/\W+/g, '_');
        // 簡易 hash：保留可閱讀性
        return `${origin}::${modelText}`;
    }

    // 從 href 解析廠牌（例如 samsung_galaxy_xxx-1234.php => Samsung）
    function parseBrandFromHref(href) {
        if (!href) return '';
        const m = href.match(/^([^_]+)_/);
        if (!m) return '';
        const raw = m[1];
        const found = BRAND_WORDS.find(b => b && b.toLowerCase() === raw.toLowerCase());
        if (found) return found;
        return raw.charAt(0).toUpperCase() + raw.slice(1);
    }

    function detectBrandFromNode(node) {
        if (!node) return '';
        const a = node.closest && node.closest('a[href]') ? node.closest('a[href]') : (node.querySelector && node.querySelector('a[href]'));
        const href = a && a.getAttribute ? a.getAttribute('href') : '';
        return parseBrandFromHref(href) || '';
    }

    // 嘗試從目前頁面偵測該品牌（優先順序：h1.article-info-name -> URL path）
    function detectCurrentPageBrand() {
        try {
            const h1 = document.querySelector('h1.article-info-name');
            if (h1 && h1.innerText) {
                const txt = h1.innerText.trim();
                // 常見格式 "Samsung phones" 或 "Google phones"
                const m = txt.match(/^(.+?)\s+phones$/i);
                if (m) {
                    const candidate = m[1].trim();
                    // 比對 BRAND_WORDS，如果有相符回傳原始大寫詞
                    const found = BRAND_WORDS.find(b => b && b.toLowerCase() === candidate.toLowerCase());
                    if (found) return found;
                    return candidate.charAt(0).toUpperCase() + candidate.slice(1);
                }
            }
            // 從 URL 解析，例: /samsung-phones-9.php
            const p = location.pathname || '';
            const m2 = p.match(/\/([a-z0-9\-]+)-phones-\d+\.php/i);
            if (m2) {
                const raw = m2[1];
                const candidate = raw.split('-')[0];
                const found = BRAND_WORDS.find(b => b && b.toLowerCase() === candidate.toLowerCase());
                if (found) return found;
                return candidate.charAt(0).toUpperCase() + candidate.slice(1);
            }
        } catch (e) {
            console.warn('[GSMArena 快速複製] detectCurrentPageBrand 失敗:', e);
        }
        return '';
    }

    // 複製至剪貼簿（優先使用 GM_setClipboard）
    function copyToClipboard(text) {
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text);
                return Promise.resolve(true);
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text);
            } else {
                // 傳統方法
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                return Promise.resolve(true);
            }
        } catch (e) {
            return Promise.reject(e);
        }
    }

    // 顯示短暫提示訊息（toast）
    function showToast(msg, duration = 1200) {
        let t = document.createElement('div');
        t.className = 'gzqc-toast';
        t.innerText = msg;
        document.body.appendChild(t);
        setTimeout(()=> t.classList.add('show'), 10);
        setTimeout(()=> {
            t.classList.remove('show');
            setTimeout(()=> t.remove(), 300);
        }, duration);
    }

    // 複製當頁所有型號為 JSON 格式（保持頁面顯示順序）
    function copyAllModelsToJSON() {
        try {
            console.log('[GSMArena 快速複製] 開始複製當頁所有型號...');

            // 獲取當頁所有型號節點
            const nodes = findModelNodes();
            if (nodes.length === 0) {
                showToast('當頁沒有找到任何型號');
                return;
            }

            // 獲取品牌資訊
            const currentBrand = detectCurrentPageBrand() || 'Unknown';

            // 建立型號列表（保持原始順序，只去除重複）
            const models = [];
            const seen = new Set();

            nodes.forEach(node => {
                const modelName = node.text && node.text.trim();
                if (modelName && !seen.has(modelName)) {
                    seen.add(modelName);
                    models.push(modelName);
                }
            });

            // 建立 JSON 物件
            const jsonData = {
                brand: currentBrand,
                page: window.location.href,
                timestamp: new Date().toISOString(),
                models: models,
                total: models.length
            };

            // 轉換為格式化的 JSON 字串
            const jsonString = JSON.stringify(jsonData, null, 2);

            // 複製到剪貼簿
            copyToClipboard(jsonString).then(() => {
                showToast(`已複製 ${models.length} 個型號的 JSON 資料`);
                console.log('[GSMArena 快速複製] JSON 資料已複製:', jsonData);
            }).catch((error) => {
                console.error('[GSMArena 快速複製] 複製 JSON 失敗:', error);
                showToast('複製失敗，請查看主控台');
            });

        } catch (error) {
            console.error('[GSMArena 快速複製] copyAllModelsToJSON 發生錯誤:', error);
            showToast('複製失敗，請查看主控台');
        }
    }

    // -------------------------
    // 解析型號字串的核心邏輯（繁中註解）
    // input: modelText (例如 "Samsung Galaxy Tab S11 Ultra 5G")
    // output: 物件 { full, core, coreSuffix, suffix, candidates[] }
    // 說明：
    //  - 這邊盡量以規則式處理，保留彈性以處理較複雜的型號。
    //  - 若解析失敗，會回傳只有 full 與 candidates:[full]
    // -------------------------
    function parseModelName(modelText) {
        const original = modelText.trim();
        const normalized = original.replace(/\s+/g,' ').trim();

        // 先拆 tokens（以空白與斜線與括號分）
        const tokens = normalized.split(/[\s\/\(\)\-]+/).filter(t=>t.length);

        // 將字詞全部轉為原始大小寫備用（保留大小寫）
        // 移除品牌詞（若有）
        const tokensNoBrand = tokens.filter(t => {
            return !BRAND_WORDS.some(b => t.toLowerCase() === b.toLowerCase());
        });

        if (tokensNoBrand.length === 0) {
            // 無法解析，返回 full
            return { full: original, candidates: [original] };
        }

        // 嘗試找出 core（含數字，如 S11, 12, 20, 13 Pro 等）
        let coreIndex = tokensNoBrand.findIndex(t => /\d/.test(t));
        // 若找不到數字型 token，則嘗試找出像 S11 或 M52 之類（帶字母+數字）
        if (coreIndex === -1) {
            coreIndex = tokensNoBrand.findIndex(t => /^[A-Za-z]*\d+[A-Za-z]*$/.test(t));
        }

        // 若仍然找不到，則把最後一個 token 當 core（作 fallback）
        if (coreIndex === -1) coreIndex = tokensNoBrand.length - 1;

        const core = tokensNoBrand[coreIndex];

        // series：如果前方有 series 詞（例如 Tab、Galaxy），則取前一個 token 或第一個符合的
        let series = null;
        for (let i=0;i<tokensNoBrand.length;i++){
            if (SERIES_WORDS.some(s=>tokensNoBrand[i].toLowerCase()===s.toLowerCase())) {
                series = tokensNoBrand[i];
                break;
            }
        }
        // 若沒有 series，但第一個 token 非 core 則也可視為 series（例如 Tab S11）
        if (!series && coreIndex > 0) {
            const candidate = tokensNoBrand[0];
            if (candidate !== core) series = candidate;
        }

        // suffix：在 core 之後的 tokens，且符合後綴字詞清單或含數字(如 5G)
        const suffixTokens = tokensNoBrand.slice(coreIndex+1).filter(t => {
            return SUFFIX_WORDS.some(s=>t.toLowerCase()===s.toLowerCase()) || /\d/.test(t) || /^[A-Za-z]+$/.test(t);
        });

        const suffix = suffixTokens.join(' ').trim();

        // 產生不同候選組合
        const candidates = [];
        const full = normalized;
        candidates.push(full);
        if (core) {
            if (!candidates.includes(core)) candidates.push(core);
        }
        if (core && suffix) {
            const cs = `${core} ${suffix}`.trim();
            if (!candidates.includes(cs)) candidates.push(cs);
        }
        if (series && core && suffix) {
            const sFull = `${series} ${core} ${suffix}`.trim();
            if (!candidates.includes(sFull)) candidates.unshift(sFull); // 放最前面
        }
        if (suffix && !candidates.includes(suffix)) candidates.push(suffix);

        return {
            full,
            series,
            core,
            suffix,
            candidates
        };
    }

    // -------------------------
    // UI 建置：樣式與元素
    // -------------------------
    GM_addStyle(`
    .gzqc-btn {
        display:inline-block;
        background:#1a73e8;
        color:#fff;
        border-radius:12px;
        padding:6px 8px;
        margin:4px 6px;
        font-size:12px;
        cursor:pointer;
        user-select:none;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .gzqc-btn:active{ transform: translateY(1px); }
    .gzqc-container {
        position: absolute;
        display:flex;
        align-items:center;
        justify-content:center;
        background: rgba(255,255,255,0.92);
        border-radius:10px;
        padding:6px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        transition: opacity .15s;
        opacity:0;
        pointer-events:none;
    }
    .gzqc-container.show {
        opacity:1;
        pointer-events:auto;
    }
    .gzqc-highlight {
        position: absolute;
        border: 3px solid rgba(255,160,0,0.95);
        border-radius:8px;
        box-shadow: 0 0 18px rgba(255,160,0,0.25);
        pointer-events:none;
    }
    .gzqc-corner {
        position: absolute;
        top:6px;
        left:6px;
        width:12px;
        height:12px;
        background: rgba(0,0,0,0.6);
        color: #fff;
        /* 小圓點樣式（無文字） */
        border-radius:50%;
        cursor:pointer;
        z-index: 100000;
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    }
    .gzqc-corner.active { background: rgba(255,160,0,0.95); box-shadow: 0 0 10px rgba(255,160,0,0.6); }
    .gzqc-toast {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 30px;
        background: rgba(0,0,0,0.8);
        color: #fff;
        padding: 8px 14px;
        border-radius: 8px;
        opacity: 0;
        transition: opacity .2s, bottom .2s;
        z-index: 999999;
    }
    .gzqc-toast.show { opacity: 1; bottom: 42px; }
    /* 設定面板 */
    .gzqc-panel {
        position: fixed;
        top: 80px;
        left: 20px;
        width: 260px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 8px 22px rgba(0,0,0,0.18);
        z-index: 999999;
        font-size:13px;
        overflow: hidden;
    }
    .gzqc-panel.mini { height: 36px; width: 220px; }
    .gzqc-panel.mini .content { display: none; }
    .gzqc-panel .header {
        background: #1a73e8;
        color: #fff;
        padding: 8px 10px;
        cursor: move;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .gzqc-panel .content { padding: 10px; }
    .gzqc-panel .row { margin-bottom: 8px; display:flex; align-items:center; gap:8px; }
    .gzqc-panel .row > div:last-child { flex: 1; }
    .gzqc-btn { white-space: normal; }
    .gzqc-clear-section { display: flex; align-items: flex-start; }
    .gzqc-clear-section::after { content: ''; clear: both; display: table; }
    .gzqc-btn {
        transition: all 0.1s ease;
    }
    .gzqc-preview-box {
        transition: opacity 0.2s ease;
    }
    /* 品牌批次擷取區塊樣式 */
    .gzqc-brand-bulk-fetch { margin-top:10px; border:1px solid #e6e6e6; border-radius:6px; padding:8px; background:#fff; }
    .gzqc-brand-controls { display:flex; gap:6px; margin-bottom:8px; flex-wrap:wrap; }
    .gzqc-brand-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; }
    .gzqc-brand-cell { padding:8px 6px; text-align:center; border-radius:6px; cursor:pointer; background:#f2f2f2; color:#222; user-select:none; font-weight:600; font-size:12px; }
    .gzqc-brand-cell.selected { background: hsl(144,57%,60%); color: #072; }
    .gzqc-brand-cell.unavailable { opacity:0.5; }
    .gzqc-fetch-status { margin-top:8px; font-size:12px; color:#333; }
    `);

    // -------------------------
    // 主流程：搜尋頁面中的「機型名稱」節點並建立浮層
    // - GSMArena 的機型卡片在多個頁面上有所差異，
    //   我們會嘗試尋找常見的結構（如 makers 列表或 article listing）並處理。
    // -------------------------
    const SETTINGS = loadSettings();
    const HIGHLIGHTS = loadHighlights();
    // 用於追蹤上一次的品牌集合（用於偵測新增/刪除品牌並輸出到主控台）
    let _prevBrandsSet = new Set();

    // 用於輸出品牌/標註變動的詳細日誌（新增/刪除/當前列表）
    function reportHighlightChange(actionType, details) {
        try {
            const h = loadHighlights();
            const total = Object.keys(h).length;
            console.log(`[GSMArena 快速複製] action=${actionType}`, details || {});
            console.log(`[GSMArena 快速複製] highlights total=${total}`);
            if (details && details.removedKeys && details.removedKeys.length) {
                console.log('[GSMArena 快速複製] removed models:', details.removedKeys.map(k => (details.backup && details.backup[k] && details.backup[k].text) || k));
            }
            if (details && details.addedKeys && details.addedKeys.length) {
                console.log('[GSMArena 快速複製] added models:', details.addedKeys);
            }
            // 列出目前每個品牌的標註數量（若有）
            const brandsMap = {};
            Object.values(h).forEach(item => {
                const text = (item.text || '').toLowerCase();
                for (const b of BRAND_WORDS) {
                    if (!b) continue;
                    const bl = b.toLowerCase();
                    if (text.startsWith(bl + ' ') || text.startsWith(bl + '-') || text.includes(bl)) {
                        brandsMap[b] = brandsMap[b] || [];
                        brandsMap[b].push(item.text);
                        break;
                    }
                }
            });
            console.log('[GSMArena 快速複製] highlights by brand:', brandsMap);
        } catch (e) {
            console.warn('[GSMArena 快速複製] reportHighlightChange 發生錯誤:', e);
        }
    }

    // 用於儲存最後一次清除動作以供「返回」還原
    let _lastClearAction = null;

    function pushLastClearAction(action) {
        _lastClearAction = Object.assign({}, action, { time: Date.now() });
        console.log('[GSMArena 快速複製] lastClearAction pushed:', _lastClearAction);
    }
    function clearLastAction() { _lastClearAction = null; }
    function undoLastClearAction() {
        if (!_lastClearAction) {
            showToast('沒有可還原的動作');
            return;
        }
        try {
            const backup = _lastClearAction.backup || {};
            const h = loadHighlights();
            // 還原備份（覆蓋回原本資料）
            Object.keys(backup).forEach(k => h[k] = backup[k]);
            saveHighlights(h);
            scheduleRefreshAllDisplays();
            window.updateUndoButtonState(); // 更新返回按鈕狀態
            showToast('已還原上一次清除動作');
            console.log('[GSMArena 快速複製] undone last action:', _lastClearAction);
            try { reportHighlightChange('undo_restore', { addedKeys: Object.keys(backup).slice(), backup }); } catch(e) {}
        } catch (e) {
            console.error('[GSMArena 快速複製] undo 錯誤:', e);
            showToast('還原失敗，請查看主控台');
        } finally {
            clearLastAction();
        }
    }

    // 全局函數供設定面板調用（更新返回按鈕狀態）
    window.updateUndoButtonState = function() {
        const btnUndo = document.querySelector('.gzqc-panel button[title="還原上一個清除動作"]');
        if (btnUndo) {
            if (_lastClearAction) {
                btnUndo.style.backgroundColor = '#1a73e8';
                btnUndo.style.color = '#fff';
                btnUndo.disabled = false;
            } else {
                btnUndo.style.backgroundColor = '#ccc';
                btnUndo.style.color = '#666';
                btnUndo.disabled = true;
            }
        }
    };

    // 僅在 `.makers` 容器內取得型號候選節點，避免錯誤抓取其他區塊（符合使用者要求）
    function findModelNodes() {
        console.log('[GSMArena 快速複製] 開始搜尋型號節點...');

        const nodes = [];
        const makersContainers = document.querySelectorAll('.makers');
        console.log('[GSMArena 快速複製] 找到的 makers 容器數量:', makersContainers.length);
        makersContainers.forEach(container => {
            // 透過常見的子元素（如 a, li a, span, div）抓取
            const candidates = container.querySelectorAll('a, li a, span, div');
            candidates.forEach(el => {
                const text = (el.textContent || el.innerText || '').trim();
                if (!text) return;
                if (text.length > 2 && text.length < 120) {
                    // 判定是否為連結（通常連到型號詳情頁），供群組代表選擇優先權
                    const isLink = (el.tagName === 'A' && (el.getAttribute('href')||'').endsWith('.php')) || !!el.querySelector('a[href$=".php"]') || !!el.closest('a[href$=".php"]');
                    nodes.push({el, text, isLink});
                }
            });
            // 若 container 裡沒有子元素（純文字），則以逗號或換行切割並建立可定位的 span
            if (container && container.childElementCount === 0) {
                const txt = (container.textContent || '').trim();
                if (txt) {
                    const parts = txt.split(/[,，\n]+/).map(p=>p.trim()).filter(Boolean);
                    parts.forEach(p => {
                        const span = document.createElement('span');
                        span.style.pointerEvents = 'auto';
                        span.style.display = 'inline-block';
                        span.style.margin = '2px';
                        span.style.padding = '0 2px';
                        span.textContent = p;
                        container.appendChild(span);
                        nodes.push({el: span, text: p});
                    });
                }
            }
        });
        // 使用智慧去重模式：基於內容去重，相同文字內容的元素只保留一個，優先保留連結元素
        const contentMap = new Map();
        nodes.forEach(node => {
            const key = node.text;
            if (!contentMap.has(key)) {
                contentMap.set(key, []);
            }
            contentMap.get(key).push(node);
        });

        const representatives = [];
        contentMap.forEach((nodesWithSameText) => {
            // 優先選擇有連結的元素，如果沒有就選第一個
            const linkNode = nodesWithSameText.find(n => n.isLink);
            representatives.push(linkNode || nodesWithSameText[0]);
        });

        console.log('[GSMArena 快速複製] 最終返回節點數量:', representatives.length);
        return representatives;
    }

    // 立即套用 autoHide 設定到已建立的容器（切換「自動隱藏 / 保持顯示」）
    function updateContainersVisibility() {
        const containers = document.querySelectorAll('.gzqc-container');
        if (!SETTINGS.autoHide) {
            containers.forEach(c => c.classList.add('show'));
        } else {
            containers.forEach(c => c.classList.remove('show'));
        }
    }

    // 根據 modelKey 隱藏對應畫面上的 highlight / 取消 corner 樣式（不會直接修改儲存）
    function removeHighlightsForKeys(keys) {
        if (!keys || keys.length === 0) return;
        const setKeys = new Set(keys);
        // 隱藏 highlight（保留 DOM 以便之後重新顯示）
        document.querySelectorAll('.gzqc-highlight').forEach(el => {
            const k = el.dataset.modelKey;
            if (k && setKeys.has(k)) el.style.display = 'none';
        });
        // 取消 corner 的 active 樣式
        document.querySelectorAll('.gzqc-corner').forEach(el => {
            const k = el.dataset.modelKey;
            if (k && setKeys.has(k)) el.classList.remove('active');
        });
        // 收起相關 container（隱藏）
        document.querySelectorAll('.gzqc-container').forEach(el => {
            const k = el.dataset.modelKey;
            if (k && setKeys.has(k)) el.classList.remove('show');
        });
        // 排程更新下拉選單與顯示
        scheduleRefreshAllDisplays();
    }

    // 建立浮層並綁定互動
    function attachToNode(nodeInfo) {
        try {
            console.log('[GSMArena 快速複製] 開始處理節點:', {
                text: nodeInfo.text,
                tagName: nodeInfo.el.tagName,
                isLink: nodeInfo.isLink,
                rect: nodeInfo.el.getBoundingClientRect()
            });

            const el = nodeInfo.el;
            const modelText = nodeInfo.text;
            const modelKey = makeModelKey(modelText);

        // 【移除卡片級別去重檢查】現在由 findModelNodes 的去重模式統一控制

        // 建立按鈕容器（絕對定位在頁面）
        const container = document.createElement('div');
        container.className = 'gzqc-container';
        container.style.zIndex = SETTINGS.zIndex;
        document.body.appendChild(container);

        // 建立 highlight overlay（當標註時使用）
        const highlight = document.createElement('div');
        highlight.className = 'gzqc-highlight';
        highlight.style.zIndex = SETTINGS.zIndex - 1;
        document.body.appendChild(highlight);

        // 建立左上角標註按鈕（小圓點，不顯示文字）
        const corner = document.createElement('div');
        corner.className = 'gzqc-corner';
        corner.title = '標註此機型（跨頁保留）';
        corner.style.zIndex = SETTINGS.zIndex + 2;
        corner.innerText = '';
        // 使用 data 屬性以便之後對應與操作（移除或更新）
        corner.dataset.modelKey = modelKey;
        container.dataset.modelKey = modelKey;
        highlight.dataset.modelKey = modelKey;
        // 注意：card 變量已移除，改用 el 作為備用參考
        el.dataset.modelKey = modelKey;
        document.body.appendChild(corner);

        // 解析並建立按鈕（依設定的 buttonOrder）
        const parsed = parseModelName(modelText);
        const map = {
            full: parsed.full,
            core: parsed.core || parsed.full,
            coreSuffix: parsed.core ? (parsed.suffix ? `${parsed.core} ${parsed.suffix}` : parsed.core) : parsed.full,
            suffix: parsed.suffix || parsed.full
        };

        SETTINGS.buttonOrder.forEach(key=>{
            const txt = map[key];
            if (!txt) return;
            const btn = document.createElement('div');
            btn.className = 'gzqc-btn';
            btn.innerText = txt;
            btn.title = `複製：${txt}`;
            btn.addEventListener('click', (ev)=>{
                ev.stopPropagation();
                copyToClipboard(txt).then(()=> {
                    showToast(`已複製：${txt}`);
                }).catch(()=> {
                    showToast('複製失敗');
                });
            });
            container.appendChild(btn);
        });

        // 當使用者點選左上標註按鈕 => 切換標註狀態並儲存（以 class active 表示）
        corner.addEventListener('click', (ev)=>{
            ev.stopPropagation();
            const h = loadHighlights();
            if (h[modelKey]) {
                delete h[modelKey];
                corner.classList.remove('active');
            } else {
                h[modelKey] = {time: Date.now(), text: modelText};
                corner.classList.add('active');
            }
            saveHighlights(h);
            updateHighlightDisplay();
            // 在標註按下時，於主控台輸出詳細資訊，便於開發與偵錯
            try {
                const parsed = parseModelName(modelText);
                const detectedBrand = detectBrandFromNode(el) || detectCurrentPageBrand();
                console.log('[GSMArena 標註] modelKey:', modelKey);
                console.log('[GSMArena 標註] modelText:', modelText);
                console.log('[GSMArena 標註] parsed:', parsed);
                console.log('[GSMArena 標註] detectedBrand:', detectedBrand);
                console.log('[GSMArena 標註] savedHighlights sample:', loadHighlights()[modelKey]);
            } catch (e) {
                console.error('[GSMArena 標註] 輸出除錯資訊時發生錯誤:', e);
            }
            // 回報變動（新增 or 刪除）
            try {
                if (h[modelKey]) {
                    reportHighlightChange('add_highlight', { addedKeys: [modelKey] });
                } else {
                    reportHighlightChange('remove_highlight', { removedKeys: [modelKey] });
                }
            } catch (e) { /* ignore */ }
        });

        // 計算並定位 container/corner/highlight（相對於 el）
        function positionUI() {
            const rect = el.getBoundingClientRect();
            // 按鈕容器置中於型號文字之下
            const left = rect.left + rect.width/2;
            const top = rect.bottom + 8 + window.scrollY;
            container.style.left = `${left}px`;
            container.style.top = `${top}px`;
            container.style.transform = 'translateX(-50%)';
            // corner（置於卡片左上角附近）
            const cornerLeft = rect.left + 8 + window.scrollX;
            const cornerTop = rect.top + 8 + window.scrollY;
            corner.style.left = `${cornerLeft}px`;
            corner.style.top = `${cornerTop}px`;
            // highlight 覆蓋整個包含元素 (延伸一點間距)
            highlight.style.left = `${rect.left - 6 + window.scrollX}px`;
            highlight.style.top = `${rect.top - 6 + window.scrollY}px`;
            highlight.style.width = `${rect.width + 12}px`;
            highlight.style.height = `${rect.height + 12}px`;
        }

        // 顯示/隱藏機制（hover 或常顯）
        let showOn = !SETTINGS.autoHide; // 若預設常顯則直接顯示
        function showContainer() {
            container.classList.add('show');
        }
        function hideContainer() {
            if (SETTINGS.autoHide) container.classList.remove('show');
        }

        // 針對觸控裝置：點擊元素顯示（模擬 hover）
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints>0;
        if (isTouch) {
            el.addEventListener('click', (e)=> {
                e.stopPropagation();
                container.classList.toggle('show');
            });
        } else {
            // 滑鼠移入父節點時顯示
            el.addEventListener('mouseenter', ()=> {
                showContainer();
            });
            el.addEventListener('mouseleave', ()=> {
                // 若滑鼠進到 container，則等待 container mouseleave 再隱藏
                setTimeout(()=> {
                    if (!container.matches(':hover')) hideContainer();
                }, 60);
            });
            container.addEventListener('mouseleave', ()=> hideContainer());
            container.addEventListener('mouseenter', ()=> showContainer());
        }

        // 更新 highlight 顯示（根據儲存）；使用 .active 樣式顯示圓點狀態
        function updateHighlightDisplay() {
            const highlights = loadHighlights();
            if (highlights[modelKey]) {
                highlight.style.display = '';
                corner.classList.add('active');
            } else {
                highlight.style.display = 'none';
                corner.classList.remove('active');
            }
        }

        // 初始定位與顯示狀態
        positionUI();
        updateHighlightDisplay();

            // 滾動與視窗縮放時重新定位
            window.addEventListener('scroll', positionUI);
            window.addEventListener('resize', positionUI);

            console.log('[GSMArena 快速複製] 成功處理節點:', modelText);
        } catch (error) {
            console.error('[GSMArena 快速複製] attachToNode 函數出錯:', {
                nodeInfo: nodeInfo,
                error: error.message,
                stack: error.stack
            });
            // 繼續執行，不中斷其他節點的處理
        }
    }

    // 建立設定面板（包含：收折按鈕於標題列右側、拖曳、切換 autoHide、清除三種標註）
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'gzqc-panel';
        if (SETTINGS.panelMini) panel.classList.add('mini');
        panel.style.left = `${SETTINGS.panelPos.x}px`;
        panel.style.top = `${SETTINGS.panelPos.y}px`;
        panel.style.zIndex = SETTINGS.zIndex + 10;

        const header = document.createElement('div');
        header.className = 'header';

        // 版本號角落標籤（絕對定位在標題欄最左上角）
        const versionLabel = document.createElement('span');
        versionLabel.className = 'panel-version';
        versionLabel.textContent = 'v3.1';
        versionLabel.style.cssText = `
            position: absolute;
            top: 2px;
            left: 2px;
            font-size: 8px;
            opacity: 0.4;
            user-select: none;
            pointer-events: none;
            z-index: 1;
            line-height: 1;
        `;
        header.appendChild(versionLabel);

        // 標題文字
        const titleSpan = document.createElement('span');
        titleSpan.innerText = '廠牌新品快速複製 設定';
        header.appendChild(titleSpan);
        // 收折按鈕與文字容器（標題列右側）
        const miniContainer = document.createElement('div');
        miniContainer.style.display = 'flex';
        miniContainer.style.alignItems = 'center';
        miniContainer.style.gap = '4px';
        // 收折按鈕（僅顯示一個短橫 '－'）
        const miniBtn = document.createElement('button');
        miniBtn.type = 'button';
        miniBtn.className = 'gzqc-btn';
        miniBtn.style.margin = '0';
        miniBtn.style.padding = '2px 8px';
        miniBtn.innerText = '－';
        miniBtn.title = '切換收折 / 還原';
        // 「收折」文字（白色、淺半透明小字，只在展開狀態顯示）
        const miniText = document.createElement('span');
        miniText.innerText = '收折';
        miniText.style.fontSize = '11px';
        miniText.style.opacity = '0.6';
        miniText.style.color = '#fff'; // 白色
        miniBtn.addEventListener('click', (e)=> {
            e.preventDefault();
            SETTINGS.panelMini = !SETTINGS.panelMini;
            if (SETTINGS.panelMini) {
                panel.classList.add('mini');
                miniText.style.display = 'none'; // 收折時隱藏文字
            } else {
                panel.classList.remove('mini');
                miniText.style.display = 'inline'; // 展開時顯示文字
            }
            saveSettings(SETTINGS);
        });
        miniContainer.appendChild(miniBtn);
        miniContainer.appendChild(miniText);
        header.appendChild(miniContainer);
        panel.appendChild(header);

        const content = document.createElement('div');
        content.className = 'content';

        // autoHide 切換
        const rowAuto = document.createElement('div'); rowAuto.className = 'row';
        const labelAuto = document.createElement('div'); labelAuto.innerText = '自動隱藏（滑鼠 hover 顯示）';
        const chkAuto = document.createElement('input'); chkAuto.type = 'checkbox'; chkAuto.checked = SETTINGS.autoHide;
        chkAuto.addEventListener('change', ()=> {
            SETTINGS.autoHide = chkAuto.checked;
            saveSettings(SETTINGS);
            // 立即套用到現有的容器（切換自動隱藏 / 保持顯示）
            updateContainersVisibility();
        });
        rowAuto.appendChild(labelAuto); rowAuto.appendChild(chkAuto);
        content.appendChild(rowAuto);

        // 複製當頁所有型號區塊（無標題）
        const copyAllSection = document.createElement('div');
        copyAllSection.className = 'gzqc-copy-section';
        copyAllSection.style.border = '1px solid #4CAF50';
        copyAllSection.style.borderRadius = '6px';
        copyAllSection.style.padding = '10px';
        copyAllSection.style.marginTop = '8px';
        copyAllSection.style.backgroundColor = '#f0f9f0';

        const btnCopyAllModels = document.createElement('button');
        btnCopyAllModels.className = 'gzqc-btn';
        btnCopyAllModels.innerText = '複製當頁所有型號';
        btnCopyAllModels.title = '按住左鍵預覽，按住拖拽至固定顯示按鈕可保持顯示';
        btnCopyAllModels.style.backgroundColor = '#4CAF50';
        btnCopyAllModels.style.color = '#fff';
        btnCopyAllModels.style.width = '100%';

        // 預覽框相關變數 - 添加位置記憶
        let previewBox = null;
        let isPreviewVisible = false;
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        let holdTimer = null;
        let lastPreviewPosition = null; // 記憶上次位置
        let isHoldingButton = false; // 添加按鈕按住狀態追蹤

        // 創建預覽框
        function createPreviewBox() {
            if (previewBox) return previewBox;

            previewBox = document.createElement('div');
            previewBox.className = 'gzqc-preview-box';
            previewBox.style.cssText = `
                position: fixed;
                background: rgba(0, 0, 0, 0.95);
                color: #fff;
                border-radius: 8px;
                padding: 15px;
                max-width: 600px;
                max-height: 400px;
                overflow: auto;
                z-index: 100000;
                font-family: monospace;
                font-size: 12px;
                white-space: pre-wrap;
                word-wrap: break-word;
                box-shadow: 0 8px 25px rgba(0,0,0,0.5);
                display: none;
                cursor: move;
                user-select: none;
                transition: opacity 0.2s ease; /* 添加平滑過渡 */
            `;

            // 標題欄 - 固定在上方，不會被滾動隱藏
            const titleBar = document.createElement('div');
            titleBar.style.cssText = `
                position: sticky;
                top: -15px;
                z-index: 1;
                padding: 5px 8px;
                margin: -15px -15px 10px -15px;
                background: rgba(26, 73, 232, 0.95);
                border-radius: 8px 8px 0 0;
                cursor: move;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
                backdrop-filter: blur(5px);
            `;

            const title = document.createElement('span');
            title.textContent = 'JSON 預覽';
            title.style.fontSize = '14px';
            title.style.fontWeight = 'bold';
            title.style.color = '#fff';

            // 關閉按鈕 - 修復事件綁定
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.style.cssText = `
                background: #f44336;
                color: white;
                border: none;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            `;
            closeButton.title = '關閉預覽';
            closeButton.onmouseover = () => closeButton.style.transform = 'scale(1.1)';
            closeButton.onmouseout = () => closeButton.style.transform = 'scale(1)';

            // 使用 addEventListener 確保事件正確綁定
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止觸發拖拽
                hidePreviewBox();
            });

            titleBar.appendChild(title);
            titleBar.appendChild(closeButton);

            // 拖拽功能 - 優化性能
            let mouseMoveHandler = null;
            let mouseUpHandler = null;

            titleBar.addEventListener('mousedown', (e) => {
                if (e.target === closeButton) return; // 不阻擋關閉按鈕點擊
                isDragging = true;
                const boxRect = previewBox.getBoundingClientRect();
                dragOffset.x = e.clientX - boxRect.left;
                dragOffset.y = e.clientY - boxRect.top;
                previewBox.style.cursor = 'grabbing';
                e.preventDefault();

                // 創建一次性事件處理器
                mouseMoveHandler = (e) => {
                    if (!isDragging) return;
                    const newLeft = e.clientX - dragOffset.x;
                    const newTop = e.clientY - dragOffset.y;
                    const maxLeft = window.innerWidth - previewBox.offsetWidth - 10;
                    const maxTop = window.innerHeight - previewBox.offsetHeight - 10;
                    const finalLeft = Math.max(10, Math.min(maxLeft, newLeft));
                    const finalTop = Math.max(10, Math.min(maxTop, newTop));
                    previewBox.style.left = finalLeft + 'px';
                    previewBox.style.top = finalTop + 'px';
                };

                mouseUpHandler = () => {
                    if (isDragging) {
                        isDragging = false;
                        previewBox.style.cursor = 'move';
                        const boxRect = previewBox.getBoundingClientRect();
                        lastPreviewPosition = { left: boxRect.left, top: boxRect.top };
                    }
                    // 清理事件監聽器
                    if (mouseMoveHandler) {
                        document.removeEventListener('mousemove', mouseMoveHandler);
                        mouseMoveHandler = null;
                    }
                    if (mouseUpHandler) {
                        document.removeEventListener('mouseup', mouseUpHandler);
                        mouseUpHandler = null;
                    }
                };

                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            });

            previewBox.appendChild(titleBar);

            // 添加視窗大小改變時重新定位
            let resizeTimer = null;
            window.addEventListener('resize', () => {
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    if (previewBox && previewBox.style.display !== 'none') {
                        ensurePreviewInBounds();
                    }
                }, 100);
            });

            document.body.appendChild(previewBox);
            return previewBox;
        }

        // 顯示預覽框 - 修復初始顯示問題
        function showPreviewBox(content) {
            const box = createPreviewBox();

            // 只更新內容部分，不重新創建標題欄
            const contentDiv = box.querySelector('.preview-content');
            if (!contentDiv) {
                const newContentDiv = document.createElement('div');
                newContentDiv.className = 'preview-content';
                newContentDiv.style.cssText = `
                    margin-top: 5px;
                    padding: 0 5px;
                    line-height: 1.4;
                `;
                box.appendChild(newContentDiv);
                contentDiv = newContentDiv;
            }

            // 更新內容
            contentDiv.textContent = content;

            // 確保位置正確 - 修復初始顯示重疊問題
            positionPreviewBox();

            // 添加淡入效果
            box.style.opacity = '0';
            box.style.display = 'block';
            requestAnimationFrame(() => {
                box.style.opacity = '1';
            });

            isPreviewVisible = true;
        }

        // 隱藏預覽框 - 修復重複定義問題
        function hidePreviewBox() {
            if (previewBox) {
                // 添加淡出效果
                previewBox.style.opacity = '0';
                setTimeout(() => {
                    previewBox.style.display = 'none';
                    isPreviewVisible = false;
                }, 200);

                // 清除定時器
                if (holdTimer) {
                    clearTimeout(holdTimer);
                    holdTimer = null;
                }
            }
        }

        // 確保預覽框在螢幕邊界內
        function ensurePreviewInBounds() {
            if (!previewBox || previewBox.style.display === 'none') return;

            const boxRect = previewBox.getBoundingClientRect();
            let left = boxRect.left;
            let top = boxRect.top;

            // 邊界檢查和調整
            const maxLeft = window.innerWidth - boxRect.width - 10;
            const maxTop = window.innerHeight - boxRect.height - 10;

            left = Math.max(10, Math.min(maxLeft, left));
            top = Math.max(10, Math.min(maxTop, top));

            previewBox.style.left = left + 'px';
            previewBox.style.top = top + 'px';
        }

        // 智能定位預覽框 - 修復重疊問題
        function positionPreviewBox() {
            if (!previewBox) return;

            // 如果有記憶的位置，優先使用
            if (lastPreviewPosition) {
                const boxRect = previewBox.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // 檢查記憶的位置是否還有效
                const panel = document.querySelector('.gzqc-panel');
                let isValidPosition = true;

                // 邊界檢查
                if (lastPreviewPosition.left < 10 || lastPreviewPosition.top < 10 ||
                    lastPreviewPosition.left + boxRect.width > viewportWidth - 10 ||
                    lastPreviewPosition.top + boxRect.height > viewportHeight - 10) {
                    isValidPosition = false;
                }

                // 面板重疊檢查
                if (panel && panel.style.display !== 'none' && !panel.classList.contains('mini')) {
                    const panelRect = panel.getBoundingClientRect();
                    const previewRect = {
                        left: lastPreviewPosition.left,
                        top: lastPreviewPosition.top,
                        right: lastPreviewPosition.left + boxRect.width,
                        bottom: lastPreviewPosition.top + boxRect.height
                    };

                    const isOverlapping = !(
                        previewRect.right < panelRect.left ||
                        previewRect.left > panelRect.right ||
                        previewRect.bottom < panelRect.top ||
                        previewRect.top > panelRect.bottom
                    );

                    if (isOverlapping) {
                        isValidPosition = false;
                    }
                }

                if (isValidPosition) {
                    previewBox.style.left = `${lastPreviewPosition.left}px`;
                    previewBox.style.top = `${lastPreviewPosition.top}px`;
                    return;
                }
            }

            // 沒有有效記憶位置，使用智能定位
            const btnRect = btnCopyAllModels.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // 獲取設定面板位置
            const panel = document.querySelector('.gzqc-panel');
            let panelRect = null;
            if (panel && panel.style.display !== 'none' && !panel.classList.contains('mini')) {
                panelRect = panel.getBoundingClientRect();
            }

            // 預設位置：按鈕下方，避免重疊
            let left = btnRect.left;
            let top = btnRect.bottom + 10;

            const boxWidth = 600;
            const boxHeight = 400;

            // 檢查是否會超出右邊界
            if (left + boxWidth > viewportWidth - 10) {
                left = viewportWidth - boxWidth - 10;
            }

            // 檢查是否會超出下邊界，如果是則放在上方
            if (top + boxHeight > viewportHeight - 10) {
                top = Math.max(10, btnRect.top - boxHeight - 10);
            }

            // 確保不會與設定面板重疊
            if (panelRect) {
                const previewRect = {
                    left: left,
                    top: top,
                    right: left + boxWidth,
                    bottom: top + boxHeight
                };

                const isOverlapping = !(
                    previewRect.right < panelRect.left ||
                    previewRect.left > panelRect.right ||
                    previewRect.bottom < panelRect.top ||
                    previewRect.top > panelRect.bottom
                );

                if (isOverlapping) {
                    // 如果重疊，嘗試其他位置
                    const alternativePositions = [
                        // 右上角
                        { left: viewportWidth - boxWidth - 10, top: 10 },
                        // 左下角
                        { left: 10, top: viewportHeight - boxHeight - 10 },
                        // 右下角
                        { left: viewportWidth - boxWidth - 10, top: viewportHeight - boxHeight - 10 },
                        // 正上方
                        { left: Math.max(10, btnRect.left - boxWidth/2), top: Math.max(10, btnRect.top - boxHeight - 10) }
                    ];

                    for (const pos of alternativePositions) {
                        const testRect = {
                            left: pos.left,
                            top: pos.top,
                            right: pos.left + boxWidth,
                            bottom: pos.top + boxHeight
                        };

                        const testOverlapping = !(
                            testRect.right < panelRect.left ||
                            testRect.left > panelRect.right ||
                            testRect.bottom < panelRect.top ||
                            testRect.top > panelRect.bottom
                        );

                        if (!testOverlapping) {
                            left = pos.left;
                            top = pos.top;
                            break;
                        }
                    }
                }
            }

            // 最終邊界檢查
            left = Math.max(10, Math.min(viewportWidth - boxWidth - 10, left));
            top = Math.max(10, Math.min(viewportHeight - boxHeight - 10, top));

            previewBox.style.left = `${left}px`;
            previewBox.style.top = `${top}px`;

            // 記憶位置
            lastPreviewPosition = { left, top };
        }


        // 生成預覽內容
        function generatePreviewContent() {
            try {
                const nodes = findModelNodes();
                if (nodes.length === 0) return '當頁沒有找到任何型號';

                const currentBrand = detectCurrentPageBrand() || 'Unknown';
                const models = [];
                const seen = new Set();

                nodes.forEach(node => {
                    const modelName = node.text && node.text.trim();
                    if (modelName && !seen.has(modelName)) {
                        seen.add(modelName);
                        models.push(modelName);
                    }
                });

                const jsonData = {
                    brand: currentBrand,
                    page: window.location.href,
                    timestamp: new Date().toISOString(),
                    models: models,
                    total: models.length
                };

                return JSON.stringify(jsonData, null, 2);
            } catch (error) {
                return `生成預覽時發生錯誤: ${error.message}`;
            }
        }

        // 滑鼠事件處理 - 修復並增加視覺回饋
        let mouseDownTime = 0;
        let hasTriggeredAction = false;

        // 添加按鈕樣式變化函數
        function setButtonHoldState(holding) {
            if (holding) {
                btnCopyAllModels.style.backgroundColor = '#1565c0'; // 更深的藍色表示按住
                btnCopyAllModels.style.transform = 'scale(0.98)'; // 輕微縮小
                btnCopyAllModels.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)'; // 減少陰影
            } else {
                btnCopyAllModels.style.backgroundColor = '#4CAF50'; // 恢復原色
                btnCopyAllModels.style.transform = 'scale(1)'; // 恢復大小
                btnCopyAllModels.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)'; // 恢復陰影
            }
        }

        btnCopyAllModels.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // 只處理左鍵

            mouseDownTime = Date.now();
            hasTriggeredAction = false;
            isHoldingButton = true;

            // 立即顯示按住狀態
            setButtonHoldState(true);

            // 清除之前的定時器
            if (holdTimer) {
                clearTimeout(holdTimer);
            }

            // 設置短延遲判定（150ms後觸發按住動作）
            holdTimer = setTimeout(() => {
                if (!hasTriggeredAction && isHoldingButton) {
                    hasTriggeredAction = true;
                    // 按住操作：切換預覽顯示狀態
                    if (isPreviewVisible) {
                        hidePreviewBox();
                    } else {
                        const content = generatePreviewContent();
                        showPreviewBox(content);
                    }
                }
            }, 150);
        });

        btnCopyAllModels.addEventListener('mouseup', (e) => {
            if (e.button !== 0) return;

            isHoldingButton = false;
            setButtonHoldState(false); // 恢復按鈕狀態

            const mouseUpTime = Date.now();
            const pressDuration = mouseUpTime - mouseDownTime;

            // 清除定時器
            if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }

            // 如果按住時間短於閾值且還沒觸發動作，執行點擊動作
            if (pressDuration < 150 && !hasTriggeredAction) {
                hasTriggeredAction = true;
                // 點擊操作：複製到剪貼簿
                copyAllModelsToJSON();
            }
        });

        btnCopyAllModels.addEventListener('mouseleave', (e) => {
            // 如果滑鼠離開按鈕，取消按住狀態
            isHoldingButton = false;
            setButtonHoldState(false);

            // 如果滑鼠離開按鈕且還沒觸發動作，清除定時器
            if (holdTimer && !hasTriggeredAction) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }
        });

        copyAllSection.appendChild(btnCopyAllModels);
        content.appendChild(copyAllSection);

        // 清除標註區塊（重新設計：垂直佈局、外框區隔）
        const clearSection = document.createElement('div');
        clearSection.className = 'gzqc-clear-section';
        clearSection.style.border = '1px solid #ddd';
        clearSection.style.borderRadius = '6px';
        clearSection.style.padding = '10px';
        clearSection.style.marginTop = '8px';
        clearSection.style.backgroundColor = '#f9f9f9';

        // 清除標註標題（垂直顯示，橫跨整個區塊）
        const clearTitle = document.createElement('div');
        clearTitle.innerText = '清除標註';
        clearTitle.style.fontWeight = 'bold';
        clearTitle.style.marginBottom = '10px';
        clearTitle.style.textAlign = 'center';
        clearTitle.style.writingMode = 'vertical-rl';
        clearTitle.style.textOrientation = 'mixed';
        clearTitle.style.float = 'left';
        clearTitle.style.height = '100px';
        clearTitle.style.marginRight = '10px';
        clearTitle.style.lineHeight = '20px';
        clearSection.appendChild(clearTitle);

        // 按鈕容器（垂直排列）
        const clearButtonsContainer = document.createElement('div');
        clearButtonsContainer.style.display = 'flex';
        clearButtonsContainer.style.flexDirection = 'column';
        clearButtonsContainer.style.gap = '8px';

        // 第一排：返回按鈕 + 清除本頁按鈕
        const firstRow = document.createElement('div');
        firstRow.style.display = 'flex';
        firstRow.style.gap = '6px';
        firstRow.style.alignItems = 'center';
        firstRow.style.fontSize = '10px'; // 依指示設為 10px

        // 返回按鈕（根據是否有可返回的操作顯示不同顏色）
        const btnUndo = document.createElement('button');
        btnUndo.className = 'gzqc-btn';
        btnUndo.innerText = '返回';
        btnUndo.title = '還原上一個清除動作';
        btnUndo.style.minWidth = '50px';
        // 根據是否有可返回的操作設置顏色
        function updateUndoButtonState() {
            if (_lastClearAction) {
                btnUndo.style.backgroundColor = '#1a73e8';
                btnUndo.style.color = '#fff';
                btnUndo.disabled = false;
            } else {
                btnUndo.style.backgroundColor = '#ccc';
                btnUndo.style.color = '#666';
                btnUndo.disabled = true;
            }
        }
        updateUndoButtonState();
        btnUndo.addEventListener('click', ()=> {
            undoLastClearAction();
            window.updateUndoButtonState(); // 更新按鈕狀態
        });

        const btnClearPage = document.createElement('button');
        btnClearPage.className = 'gzqc-btn';
        btnClearPage.innerText = '清除【當前本頁】標註';
        btnClearPage.addEventListener('click', ()=> {
            const nodes = findModelNodes();
            const keysToRemove = nodes.map(n => makeModelKey(n.text));
            const h = loadHighlights();
            const existing = keysToRemove.filter(k => h[k]);
            if (existing.length === 0) {
                showToast('本頁目前沒有任何標註');
                return;
            }
            // 儲存撤銷用的備份
            const backup = {};
            existing.forEach(k => { backup[k] = h[k]; delete h[k]; });
            pushLastClearAction({ type: 'clear_page', keys: existing.slice(), backup });
            window.updateUndoButtonState(); // 更新返回按鈕狀態
            saveHighlights(h);
            removeHighlightsForKeys(existing);
            showToast(`已清除本頁標註（${existing.length} 筆）`);
            try { reportHighlightChange('clear_page', { removedKeys: existing.slice(), backup }); } catch(e) {}
        });

        firstRow.appendChild(btnUndo);
        firstRow.appendChild(btnClearPage);
        clearButtonsContainer.appendChild(firstRow);

        // 第二排：清除品牌標註 + 下拉框（上下兩排）
        const secondRow = document.createElement('div');
        secondRow.style.display = 'flex';
        secondRow.style.flexDirection = 'column';
        secondRow.style.gap = '4px';
        secondRow.style.alignItems = 'flex-start';

        const brandSelect = document.createElement('select');
        brandSelect.className = 'gzqc-brand-select';
        brandSelect.style.width = '150px';
        function refreshBrandOptions() {
            const h = loadHighlights();
            const brandsSet = new Set();

            // 改進品牌識別邏輯：檢查型號名稱是否以品牌開頭，或包含品牌詞
            Object.values(h).forEach(it => {
                const text = (it.text || '').trim();
                if (!text) return;

                // 方法1：檢查是否以品牌開頭（最常見的情況）
                const textLower = text.toLowerCase();
                for (const brand of BRAND_WORDS) {
                    if (!brand) continue;
                    const brandLower = brand.toLowerCase();

                    // 檢查是否以品牌開頭（例如 "Samsung Galaxy"）
                    if (textLower.startsWith(brandLower + ' ') ||
                        textLower.startsWith(brandLower + '-') ||
                        textLower === brandLower) {
                        brandsSet.add(brand);
                        break; // 找到一個品牌就停止，避免重複添加
                    }

                    // 方法2：檢查是否包含品牌詞（備用）
                    if (textLower.includes(brandLower)) {
                        brandsSet.add(brand);
                        break;
                    }
                }
            });

            // 若找不到任何品牌候選，嘗試從當前頁面推斷品牌（標題或 URL），若本頁有對應的 highlight 則加入
            const currentPageBrand = detectCurrentPageBrand();
            if (brandsSet.size === 0 && currentPageBrand) {
                // 檢查是否有任何 highlight 的文字出現在本頁機型清單上
                try {
                    const pageNodes = findModelNodes();
                    const pageTexts = pageNodes.map(n=>n.text.toLowerCase());
                    const anyMatch = Object.values(h).some(it => pageTexts.includes((it.text||'').toLowerCase()));
                    if (anyMatch) brandsSet.add(currentPageBrand);
                } catch (e) {
                    console.warn('[GSMArena 快速複製] refreshBrandOptions 比對本頁機型時失敗:', e);
                }
            }

            brandSelect.innerHTML = '';
            if (brandsSet.size === 0) {
                const opt = document.createElement('option'); opt.value=''; opt.innerText='(無)'; brandSelect.appendChild(opt);
            } else {
                // 排序品牌名稱以提供更好的用戶體驗
                const sortedBrands = Array.from(brandsSet).sort();
                sortedBrands.forEach(b => {
                    const opt = document.createElement('option'); opt.value = b; opt.innerText = b; brandSelect.appendChild(opt);
                });
            }
        }
        refreshBrandOptions();

        const btnClearBrand = document.createElement('button');
        btnClearBrand.className = 'gzqc-btn';
        btnClearBrand.innerText = '清除【品牌所有】標註';
        btnClearBrand.style.width = '150px';
        btnClearBrand.addEventListener('click', ()=> {
            let brand = brandSelect.value;
            const h = loadHighlights();
            // 若使用者沒有明確選擇 brand，嘗試從頁面推斷（例如 /samsung-phones-9.php 或 h1）
            const currentPageBrand = detectCurrentPageBrand();
            if (!brand && currentPageBrand) brand = currentPageBrand;
            if (!brand) { showToast('目前沒有標註的品牌'); return; }

            // 若清除的品牌是當前頁面（或使用者未輸入完整前綴），則以本頁的機型清單為準進行清除
            const pageBrand = detectCurrentPageBrand();
            let keysToRemove = [];
            if (pageBrand && brand.toLowerCase() === pageBrand.toLowerCase()) {
                // 刪除所有在本頁出現且在 highlights 內的項目
                const pageNodes = findModelNodes();
                const pageKeys = pageNodes.map(n => makeModelKey(n.text));
                keysToRemove = Object.keys(h).filter(k => pageKeys.includes(k));
            } else {
                // 傳統以文字比對品牌（保留原有嚴格匹配）
                keysToRemove = Object.keys(h).filter(k => {
                    const text = (h[k].text || '').trim();
                    if (!text) return false;
                    const textLower = text.toLowerCase();
                    const brandLower = brand.toLowerCase();
                    if (textLower.startsWith(brandLower + ' ') ||
                        textLower.startsWith(brandLower + '-') ||
                        textLower === brandLower) {
                        return true;
                    }
                    const words = textLower.split(/[\s\-]+/);
                    return words.some(word => word === brandLower);
                });
            }

            if (keysToRemove.length === 0) {
                showToast(`找不到 ${brand} 的標註`);
                refreshBrandOptions();
                return;
            }

            // 儲存撤銷備份
            const backup = {};
            keysToRemove.forEach(k => { backup[k] = h[k]; delete h[k]; });
            pushLastClearAction({ type: 'clear_brand', brand, keys: keysToRemove.slice(), backup });
            window.updateUndoButtonState(); // 更新返回按鈕狀態

            saveHighlights(h);
            removeHighlightsForKeys(keysToRemove);
            showToast(`已清除 ${brand} 的標註（${keysToRemove.length} 筆）`);
            refreshBrandOptions();
            try { reportHighlightChange('clear_brand', { brand, removedKeys: keysToRemove.slice(), backup }); } catch(e) {}
        });

        secondRow.appendChild(btnClearBrand);
        secondRow.appendChild(brandSelect);
        clearButtonsContainer.appendChild(secondRow);

        // 第三排：清除所有標註（紅色警示樣式）
        const btnClearAll = document.createElement('button');
        btnClearAll.className = 'gzqc-btn';
        btnClearAll.innerText = '清除所有標註';
        btnClearAll.style.background = 'crimson';
        btnClearAll.style.color = '#fff';
        btnClearAll.style.width = '150px';
        btnClearAll.addEventListener('click', ()=> {
            const h = loadHighlights();
            const total = Object.keys(h).length;
            if (total === 0) { showToast('目前沒有任何標註'); return; }
            if (!confirm('確認要清除所有頁面的標註嗎？此動作無法復原。')) return;
            // 儲存整個 h 作為備份以便還原
            const backup = Object.assign({}, h);
            pushLastClearAction({ type: 'clear_all', keys: Object.keys(h).slice(), backup });
            window.updateUndoButtonState(); // 更新返回按鈕狀態
            saveHighlights({});
            document.querySelectorAll('.gzqc-highlight').forEach(el=>el.remove());
            document.querySelectorAll('.gzqc-corner').forEach(el=>el.classList.remove('active'));
            showToast(`已清除所有標註（${total} 筆）`);
            refreshBrandOptions();
            try { reportHighlightChange('clear_all', { removedKeys: Object.keys(backup).slice(), backup }); } catch(e) {}
        });

        clearButtonsContainer.appendChild(btnClearAll);

        clearSection.appendChild(clearButtonsContainer);
        content.appendChild(clearSection);

        // -----------------------------
        // 品牌批次擷取區塊（預設收合） — 插入在「清除標註」區塊下方
        // -----------------------------
        const brandBulkSection = document.createElement('div');
        brandBulkSection.className = 'gzqc-brand-bulk-fetch';
        // header / toggle
        const brandHeader = document.createElement('div');
        brandHeader.style.display = 'flex';
        brandHeader.style.flexDirection = 'column';
        brandHeader.style.cursor = 'pointer';
        brandHeader.style.marginBottom = '6px';

        // top row: title + toggle '展'
        const brandRowTop = document.createElement('div');
        brandRowTop.style.display = 'flex';
        brandRowTop.style.alignItems = 'center';
        brandRowTop.style.justifyContent = 'space-between';
        const brandTitle = document.createElement('div');
        brandTitle.innerText = '批次擷取：已選品牌';
        brandTitle.style.fontWeight = 'bold';
        const toggleTop = document.createElement('div');
        toggleTop.innerText = '展';
        toggleTop.style.fontSize = '14px';
        toggleTop.style.lineHeight = '12px';
        brandRowTop.appendChild(brandTitle);
        brandRowTop.appendChild(toggleTop);
        brandHeader.appendChild(brandRowTop);

        // bottom row: primary button + toggle '開'
        const brandRowBottom = document.createElement('div');
        brandRowBottom.style.display = 'flex';
        brandRowBottom.style.alignItems = 'center';
        brandRowBottom.style.justifyContent = 'space-between';
        const btnCopySelectedHeader = document.createElement('button');
        btnCopySelectedHeader.className = 'gzqc-btn';
        btnCopySelectedHeader.innerText = '一鍵擷取已選取品牌清單';
        btnCopySelectedHeader.style.backgroundColor = '#4CAF50';
        btnCopySelectedHeader.style.color = '#fff';
        btnCopySelectedHeader.style.marginRight = '8px';
        btnCopySelectedHeader.title = '一鍵擷取已選取品牌清單（收合/展開皆可操作）';
        const toggleBottom = document.createElement('div');
        toggleBottom.innerText = '開';
        toggleBottom.style.fontSize = '14px';
        toggleBottom.style.lineHeight = '12px';
        brandRowBottom.appendChild(btnCopySelectedHeader);
        brandRowBottom.appendChild(toggleBottom);
        brandHeader.appendChild(brandRowBottom);
        brandBulkSection.appendChild(brandHeader);

        const brandInner = document.createElement('div');
        brandInner.style.display = 'none'; // 預設收合

        // controls (with distinct colors)
        const controls = document.createElement('div');
        controls.className = 'gzqc-brand-controls';

        const btnSelectAllBrands = document.createElement('button');
        btnSelectAllBrands.className = 'gzqc-btn';
        btnSelectAllBrands.innerText = '一鍵全選';
        btnSelectAllBrands.style.backgroundColor = '#1976d2'; // blue
        btnSelectAllBrands.style.color = '#fff';

        const btnClearSelected = document.createElement('button');
        btnClearSelected.className = 'gzqc-btn';
        btnClearSelected.innerText = '取消已選取';
        btnClearSelected.style.backgroundColor = '#9E9E9E'; // gray
        btnClearSelected.style.color = '#fff';

        const btnSelectDefaults = document.createElement('button');
        btnSelectDefaults.className = 'gzqc-btn';
        btnSelectDefaults.innerText = '一鍵選取預設品牌';
        btnSelectDefaults.style.backgroundColor = '#4CAF50'; // green
        btnSelectDefaults.style.color = '#fff';

        controls.appendChild(btnSelectAllBrands);
        controls.appendChild(btnClearSelected);
        controls.appendChild(btnSelectDefaults);

        brandInner.appendChild(controls);

        // status (moved above grid)
        const fetchStatus = document.createElement('div');
        fetchStatus.className = 'gzqc-fetch-status';
        fetchStatus.innerText = '尚未開始';
        brandInner.appendChild(fetchStatus);

        // grid
        const grid = document.createElement('div');
        grid.className = 'gzqc-brand-grid';
        // build empty grid 4 cols x 9 rows (use BRAND_META to fill cells)
        const totalCols = 4;
        const totalRows = 9;

        // create map of [col,row] -> meta
        const cellMap = {};
        BRAND_META.forEach(m => {
            cellMap[`${m.col}_${m.row}`] = m;
        });

        const selectedBrandSet = new Set();

        function renderBrandGrid() {
            grid.innerHTML = '';
            for (let r=1;r<=totalRows;r++){
                for (let c=1;c<=totalCols;c++){
                    const key = `${c}_${r}`;
                    const meta = cellMap[key];
                    const cell = document.createElement('div');
                    cell.className = 'gzqc-brand-cell';
                    if (!meta) {
                        cell.innerText = '';
                        cell.style.visibility = 'hidden';
                        grid.appendChild(cell);
                        continue;
                    }
                    cell.innerText = meta.name;
                    cell.dataset.brand = meta.name;
                    if (!meta.defaultIncluded) cell.classList.add('unavailable');
                    if (selectedBrandSet.has(meta.name)) cell.classList.add('selected');
                    cell.addEventListener('click', ()=> {
                        if (selectedBrandSet.has(meta.name)) {
                            selectedBrandSet.delete(meta.name);
                            cell.classList.remove('selected');
                        } else {
                            selectedBrandSet.add(meta.name);
                            cell.classList.add('selected');
                        }
                        updateFetchStatus();
                    });
                    grid.appendChild(cell);
                }
            }
        }

        brandInner.appendChild(grid);

        // (removed duplicate inner fetch button; header button performs bulk fetch)

        brandBulkSection.appendChild(brandInner);
        content.appendChild(brandBulkSection);

        // panel reposition helpers (保存/還原位置以避免改動後長時間佔位)
        let panelRepositioned = false;
        let lastPanelPosBeforeReposition = null;
        let lastPanelWidthBeforeExpand = null;
        function repositionPanelIfNeeded() {
            // 確保 brandInner 可見；若超出視窗，嘗試移動 panel 至上方，若失敗則自動收合並提示
            try {
                const innerRect = brandInner.getBoundingClientRect();
                const panelRect = panel.getBoundingClientRect();
                const viewportH = window.innerHeight;
                // 若底部超出螢幕 40px，嘗試把 panel 移到視窗頂部（保持 left）
                if (innerRect.bottom > viewportH - 40) {
                    // 若 brandInner 本身就太高（大於 viewport），則收合並提示
                    if (innerRect.height > viewportH - 80) {
                        brandInner.style.display = 'none';
                        brandToggle.innerText = '展開';
                        showToast('面板空間不足，已自動收合。請分批執行或調整面板位置');
                        return;
                    }
                    // 儲存原始位置，並嘗試移動
                    lastPanelPosBeforeReposition = { x: SETTINGS.panelPos.x, y: SETTINGS.panelPos.y };
                    panel.style.top = `${20}px`;
                    // 保持原 left（但避免超出）
                    const maxLeft = Math.max(10, Math.min(window.innerWidth - panelRect.width - 10, panelRect.left));
                    panel.style.left = `${maxLeft}px`;
                    panelRepositioned = true;
                }
            } catch (e) { /* ignore */ }
        }
        function restorePanelPositionIfNeeded() {
            try {
                if (panelRepositioned && lastPanelPosBeforeReposition) {
                    panel.style.left = `${lastPanelPosBeforeReposition.x}px`;
                    panel.style.top = `${lastPanelPosBeforeReposition.y}px`;
                    SETTINGS.panelPos = { x: lastPanelPosBeforeReposition.x, y: lastPanelPosBeforeReposition.y };
                    saveSettings(SETTINGS);
                    panelRepositioned = false;
                    lastPanelPosBeforeReposition = null;
                }
            } catch (e) { /* ignore */ }
        }

        // toggle handler (expand/collapse with auto-adjust)
        brandHeader.addEventListener('click', (ev)=> {
            // ignore clicks on the header's buttons (e.g., copy button)
            if (ev.target && (ev.target === btnCopySelectedHeader || ev.target.closest && ev.target.closest('.gzqc-btn'))) return;
            if (brandInner.style.display === 'none') {
                // expand
                brandInner.style.display = '';
                // set toggle labels
                try { toggleTop.innerText = '收'; toggleBottom.innerText = '合'; } catch(e){}
                // width adjust: store previous and expand to fit grid
                try {
                    const panelRect = panel.getBoundingClientRect();
                    lastPanelWidthBeforeExpand = panelRect.width;
                    const desired = Math.max(260, grid.scrollWidth + 80);
                    panel.style.width = `${desired}px`;
                } catch(e) {}
                // 延遲執行調整以等待 layout 完成
                setTimeout(()=> repositionPanelIfNeeded(), 60);
            } else {
                // collapse
                brandInner.style.display = 'none';
                try { toggleTop.innerText = '展'; toggleBottom.innerText = '開'; } catch(e){}
                // restore width if changed
                try {
                    if (lastPanelWidthBeforeExpand) {
                        panel.style.width = `${lastPanelWidthBeforeExpand}px`;
                        lastPanelWidthBeforeExpand = null;
                    } else {
                        panel.style.width = '260px';
                    }
                } catch(e) {}
                // 收合時恢復原始 panel 位置，避免長時間佔用空間
                restorePanelPositionIfNeeded();
            }
        });

        // helper: select all / clear / select defaults
        btnSelectAllBrands.addEventListener('click', ()=> {
            BRAND_META.forEach(m => { if (m) selectedBrandSet.add(m.name); });
            renderBrandGrid();
            updateFetchStatus();
        });
        btnClearSelected.addEventListener('click', ()=> {
            selectedBrandSet.clear();
            renderBrandGrid();
            updateFetchStatus();
        });
        btnSelectDefaults.addEventListener('click', ()=> {
            selectedBrandSet.clear();
            BRAND_META.forEach(m => { if (m.defaultIncluded) selectedBrandSet.add(m.name); });
            renderBrandGrid();
            updateFetchStatus();
        });

        function updateFetchStatus(progressText) {
            const cnt = selectedBrandSet.size;
            fetchStatus.innerText = progressText ? progressText : `已選：${cnt} 個品牌`;
        }

        // 初始化：默認選取筆記中的預設品牌
        BRAND_META.forEach(m => { if (m.defaultIncluded && DEFAULT_BRANDS.indexOf(m.name)!==-1) selectedBrandSet.add(m.name); });
        renderBrandGrid();
        updateFetchStatus();

        // removed inner bulk fetch button; header button triggers fetch instead

        // header 上的常駐「複製已選取品牌」按鈕綁定（收合/展開皆可使用）
        btnCopySelectedHeader.addEventListener('click', (e)=> {
            e.stopPropagation();
            const brands = Array.from(selectedBrandSet);
            if (brands.length === 0) {
                showToast('未選取任何品牌，將自動選取預設品牌');
                BRAND_META.forEach(m => { if (m.defaultIncluded) selectedBrandSet.add(m.name); });
                renderBrandGrid();
                updateFetchStatus();
            }
            window.bulkFetchSelectedBrands(Array.from(selectedBrandSet), {
                onProgress: (text)=> updateFetchStatus(text),
                onComplete: (result)=> {
                    try {
                        const jsonStr = JSON.stringify(result, null, 2);
                        copyToClipboard(jsonStr);
                        showPreviewBox(jsonStr);
                        showToast('已複製擷取結果到剪貼簿');
                    } catch (e) {
                        console.error('bulk fetch complete error', e);
                    }
                }
            });
        });

        panel.appendChild(content);
        document.body.appendChild(panel);

        // 初始化返回按鈕狀態
        setTimeout(() => window.updateUndoButtonState(), 100);

        // 可拖曳（抓 header）
        header.addEventListener('mousedown', (e)=> {
            e.preventDefault();
            const startX = e.clientX; const startY = e.clientY;
            const origLeft = panel.getBoundingClientRect().left;
            const origTop = panel.getBoundingClientRect().top;
            function moveHandler(ev) {
                const nx = origLeft + (ev.clientX - startX);
                const ny = origTop + (ev.clientY - startY);
                panel.style.left = nx + 'px';
                panel.style.top = ny + 'px';
            }
            function upHandler(ev) {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
                // 儲存位置
                const rect = panel.getBoundingClientRect();
                SETTINGS.panelPos = {x: rect.left, y: rect.top};
                saveSettings(SETTINGS);
            }
            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        });
    }

    /**
     * 檢查是否為品牌手機型號預覽頁面
     * 品牌手機型號預覽頁面特徵：
     * - URL 包含 `-phones-數字.php`（如 honor-phones-121.php）
     * - 這是品牌的產品列表頁面，包含多個手機型號的預覽
     * - 特例：Rumor mill 頁面 (rumored.php3)
     *
     * @returns {boolean} - 如果是品牌手機型號預覽頁面返回 true
     */
    function isPhoneDetailPage() {
        const path = window.location.pathname;

        // 排除主界面
        if (path === '/' || path === '/index.php' || path === '') {
            return false;
        }

        // 特例：Rumor mill 頁面
        if (path === '/rumored.php3') {
            return true;
        }

        // 檢查是否為品牌手機列表頁面（包含 -phones-）
        if (path.includes('-phones-') && path.endsWith('.php')) {
            return true;
        }

        return false;
    }

    // 啟動：搜尋節點並 attach
    function init() {
        try {
            console.log('[GSMArena 快速複製] 開始初始化...');

            // 檢查頁面類型，只在品牌手機型號預覽頁面執行
            if (!isPhoneDetailPage()) {
                console.log('[GSMArena 快速複製] 非品牌手機型號預覽頁面，跳過初始化');
                return;
            }

            const nodes = findModelNodes();
            console.log('[GSMArena 快速複製] 找到的節點數量:', nodes.length);

            nodes.forEach((n, index) => {
                try {
                    attachToNode(n);
                } catch (nodeError) {
                    console.error(`[GSMArena 快速複製] 處理第 ${index} 個節點時出錯:`, {
                        node: n,
                        error: nodeError.message,
                        stack: nodeError.stack
                    });
                }
            });

            console.log('[GSMArena 快速複製] 建立設定面板...');
            createSettingsPanel();

            console.log('[GSMArena 快速複製] 更新容器顯示狀態...');
            // 根據設定立即套用容器顯示行為（自動隱藏或常顯）
            updateContainersVisibility();

            console.log('[GSMArena 快速複製] 初始化完成');
        } catch (e) {
            console.error('[GSMArena 快速複製] 初始化失敗:', {
                error: e.message,
                stack: e.stack,
                url: location.href,
                readyState: document.readyState
            });
        }
    }

    // 等待主要 DOM 就緒（若已就緒也立即執行）
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 600);
    } else {
        window.addEventListener('DOMContentLoaded', ()=> setTimeout(init, 600));
    }

    // 註冊快速選單（Tampermonkey 選單）
    GM_registerMenuCommand('GSMA 快速複製：重載設定', ()=> {
        saveSettings(DEFAULT_SETTINGS);
        saveHighlights({});
        location.reload();
    });

})();


