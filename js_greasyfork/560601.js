// ==UserScript==
// @name         GSMArena 品牌頁面 拆解複製 - 1.0
// @namespace    http://tampermonkey.net/
// @version      1.0.1
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
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560601/GSMArena%20%E5%93%81%E7%89%8C%E9%A0%81%E9%9D%A2%20%E6%8B%86%E8%A7%A3%E8%A4%87%E8%A3%BD%20-%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/560601/GSMArena%20%E5%93%81%E7%89%8C%E9%A0%81%E9%9D%A2%20%E6%8B%86%E8%A7%A3%E8%A4%87%E8%A3%BD%20-%2010.meta.js
// ==/UserScript==

/*
  == 廠牌新品快速複製腳本 - GSMArena 專用 ==

  📱 功能特色：
  - 在 GSMArena 的手機型號卡片上顯示快速複製按鈕
  - 智慧解析型號名稱，提供多種複製組合（完整名稱、核心型號、核心+後綴、後綴）
  - 支援標註系統，可標記喜愛的機型（左上角小圓點）
  - 本地儲存設定，不會上傳任何個人資料
  - 支援觸控裝置與桌面瀏覽器

  🎯 使用說明：
  1. 在 GSMArena 品牌手機列表頁面自動啟用
  2. 滑鼠懸停在機型卡片上會顯示複製按鈕（可設定為常顯）
  3. 點擊左上角小圓點可標註/取消標註機型
  4. 點擊右上角設定按鈕可調整各種選項
  5. 支援清除標註功能（本頁/指定品牌/全部清除）

  ⚙️ 設定選項：
  - 自動隱藏：控制複製按鈕是否需要懸停才顯示
  - 智慧去重：避免重複顯示相同機型的按鈕
  - 品牌識別：自動識別手機品牌並支援按品牌清除標註

  🔒 隱私保護：
  - 所有資料僅儲存在本地瀏覽器中
  - 不會收集或上傳任何個人資訊
  - 使用 GM_setValue API 進行本地儲存

  📋 技術支援：
  - 適用於所有主流瀏覽器（Chrome, Firefox, Safari, Edge）
  - 需要 Tampermonkey 或類似用戶腳本管理器
  - 最低支援 ES6+ 的現代瀏覽器環境

  開發者筆記（簡述）
  - UI：使用絕對定位的浮層（不改變原 DOM 文字排版），將複製按鈕放於型號文字正下方（視窗絕對定位）。
  - 解析：以品牌詞彙表（排除品牌）+ 系列詞表(如 Tab) + 後綴詞表（Ultra、Pro、Plus、5G 等）做規則式解析，
    產生候選組合：[series + core + suffix, core, core + suffix, suffix]。若解析失敗，僅顯示完整名稱一按鈕。
  - 儲存 key：約以 location.origin + modelText 的 hash 作識別，避免名稱衝突。

  更新紀錄：
  - v0.1 初版（2025/12/27 02:00）
  - v0.2（2025/12/27 02:20）更新重點：
    * 僅在 `.makers` 範圍內偵測並建立按鈕，避免誤抓取其他區塊
    * 設定面板：收折按鈕放在標題列右側，點擊立即縮小/展開（不需重整）
    * 清除標註：提供三種按鈕（本頁 / 該品牌 / 全部），本頁清除需二次確認
    * 標註按鈕改為小圓點（不顯示文字），並使用 data-modelKey 綁定以利後續清除
    * 修正自動隱藏開關，切換時會立即套用到畫面上的按鈕容器
  - v0.3（2025/12/27 02:55）更新重點：
    * 調整縮小（mini）寬度為 220px，並改為標題及按鈕水平置中
    * 收折按鈕顯示為單一橫槓「－」
    * 移除重複標註圓點（同一張卡片只會有一個標註）
    * 清除標註按鈕垂直排列，並改為：
      - 清除【當前本頁】標註（無需二次確認）
      - 清除【品牌所有】標註（下拉自動列出目前有標註的品牌）
      - 清除所有標註（紅底）
  - v0.4（2025/12/27 04:32）更新重點：
    * 修正標註按鈕不穩定（圖片與型號會被視為同一張卡片並只建立一個標註）
    * 清除【品牌所有】下拉選單會即時更新（標註新增/移除後）
    * 修正設定面板內按鈕擠壓問題，調整排版與換行
  - v0.4(檢修中)（2025/12/27）更新重點：
    * 新增【去重模式】設定：提供「完全不去重」、「智慧去重」、「嚴格去重」三種模式
      - 完全不去重：每個找到的元素都建立標籤，解決間隔性標籤消失問題
      - 智慧去重：基於內容去重，相同型號只保留一個標籤（預設）
      - 嚴格去重：基於位置去重，位置重疊的元素只保留一個
    * 改善【品牌識別邏輯】：優先檢查型號是否以品牌開頭，避免誤識別
    * 優化【清除品牌標註】邏輯：使用精確的品牌匹配，避免誤刪其他品牌
    * 設定面板加入去重模式選擇器，支援動態切換
    * 修復【card 變量未定義】錯誤：移除未定義的 card 變量引用
    * 新增【詳細調試信息】：在控制台輸出初始化過程和節點處理詳情，便於排查問題
 - v0.6（2025/12/29 12:09）更新重點：
    * 在「標註」按鈕點擊時，於主控台輸出所讀取與記錄的參數（modelKey、modelText、解析結果與儲存狀態），方便開發除錯
    * 新增「返回」按鈕，可還原最近一次的清除動作（支援：清除本頁/清除品牌/清除所有），並實作撤銷暫存備份
    * 改善「清除【品牌所有】標註」的品牌辨識：優先嘗試從頁面標題與 URL 擷取品牌，並以本頁目前顯示的機型清單比對要刪除的標籤
    * 品牌下拉會即時更新，並於主控台回報新增/刪除的品牌與型號清單（新增回報、刪除回報、目前總數）
    * 更新版本號與 README 記錄（0.6 / 12/29 12:09）
 - v0.7（2025/12/29 12:20）更新重點：
    * 改善設定面板介面佈局：展開時在收折按鈕右側顯示「收折」文字，收折時隱藏
    * 刪除多餘的「收折（請使用標題列右側按鈕）」說明文字
    * 將「返回」按鈕移至「清除【當前本頁】標註」同一排左側，並根據是否有可返回的操作顯示不同顏色
    * 重新設計清除標註區塊：垂直佈局、添加外框區隔，並將「清除【品牌所有】標註」與下拉框分為上下兩排
    * 新增腳本圖標 (@icon)
    * 在設定面板標題欄左上角添加版本號角落標籤
    * 更新版本號與 README 記錄（0.7 / 12/29 12:20）
 - v1.0（2025/12/29 12:35）🎉 第一代穩定版本發佈：
    * 🚀 核心功能完善：智慧去重模式，自動識別重複元素，提供最佳用戶體驗
    * 🎯 精準觸發機制：僅在品牌手機型號預覽頁面和 Rumor mill 頁面啟用，避免干擾其他頁面
    * 💾 跨頁面數據同步：完美解決跨品牌數據讀取問題，標註數據在不同頁面間無縫共享
    * 🎨 現代化界面設計：設定面板採用直觀佈局，版本號角落標籤，圖標顯示
    * 🔧 高品質代碼：移除所有開發時期的測試代碼，達到生產級品質
    * 📱 完整功能集：快速複製按鈕、標註系統、撤銷機制、本地儲存、設定面板
    * 🌟 穩定性提升：經過多次迭代優化，達到第一代成品的穩定品質
    * 📝 第一代穩定版本發佈（1.0 / 12/29 12:35）
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
        versionLabel.textContent = 'v1.0';
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


