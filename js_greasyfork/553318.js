// ==UserScript==
// @name         SupJAV to Minnano-AV 搜尋增強
// @namespace    https://sleazyfork.org/users/1434867
// @version      1.0.7
// @description  演員資料查詢 + 深色模式 + 多結果選擇 + 自動選擇 + 防重複觸發 + 浮動按鈕可拖動 + 位置記憶 + 動態 emoji 移除 + 內容可選取 + 修正滾動 BUG + 支援內頁多演員 + 圈選文字快捷查詢 + 照片顯示 + 完整資料連結 + 多網站適配
// @description:en  Actress info query + Dark mode + Multi-result selection + Auto select + Anti-duplicate + Draggable button + Position memory + Dynamic emoji removal + Text selection + Fixed scroll bug + Support detail page multi-actress + Manual text selection query + Photo display + Full data link + Multi-site support
// @author       c24301013
// @homepage     https://sleazyfork.org/zh-CN/scripts/553318
// @homepageURL  https://sleazyfork.org/zh-CN/scripts/553318
// @supportURL   https://sleazyfork.org/zh-CN/scripts/553318/feedback
// @icon         https://www.google.com/s2/favicons?sz=64&domain=supjav.com
// @match        https://supjav.com/*
// @match        https://shiroutowiki.work/*
// @match        https://sirowiki.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      www.minnano-av.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553318/SupJAV%20to%20Minnano-AV%20%E6%90%9C%E5%B0%8B%E5%A2%9E%E5%BC%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/553318/SupJAV%20to%20Minnano-AV%20%E6%90%9C%E5%B0%8B%E5%A2%9E%E5%BC%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[SupJAV增強 v1.0.7] 腳本已啟動');

    // ============================================
    // 配置區
    // ============================================
    const CONFIG = {
        searchButtonIcon: "🚀",
        floatingButtonIcon: "⚡",
        hoverDelay: 1000,
        maxPanelWidth: 800,
        minSideMargin: 50,
    };

    const THEME_KEY = 'supjav-minnano-theme';
    const POSITION_KEY = 'supjav-floating-button-y';
    const HOTKEY_KEY = 'supjav-manual-search-hotkey';
    const THEME_OPTIONS = ['AUTO', 'DARK', 'LIGHT'];
    const DEFAULT_THEME = 'DARK';
    const DEFAULT_POSITION = 200;
    const DEFAULT_HOTKEY = 'F8';

    let hoverTimer = null;
    let isSearching = false;
    let hasSearched = false;
    let cachedData = null;
    let floatingButton = null;
    let currentPanel = null;
    let floatingButtonY = DEFAULT_POSITION;
    let cssInjected = false;
    let isDarkMode = false;
    let isDraggingFloat = false;
    let currentActressName = '';
    let currentHotkey = null;
    let searchResults = [];
    let currentResultIndex = 0;

    // ============================================
    // 工具函數區
    // ============================================

    function getCurrentDomain() {
        const hostname = window.location.hostname;
        if (hostname.includes('supjav.com')) return 'supjav';
        if (hostname.includes('shiroutowiki.work')) return 'shiroutowiki';
        if (hostname.includes('sirowiki.com')) return 'sirowiki';
        return 'unknown';
    }

    function shouldShowRocket() {
        return getCurrentDomain() === 'supjav';
    }

    function loadFloatingButtonPosition() {
        floatingButtonY = GM_getValue(POSITION_KEY, DEFAULT_POSITION);
        console.log('[位置記憶] 載入位置:', floatingButtonY);
    }

    function saveFloatingButtonPosition(y) {
        GM_setValue(POSITION_KEY, y);
        console.log('[位置記憶] 儲存位置:', y);
    }

    function loadHotkeySetting() {
        const saved = GM_getValue(HOTKEY_KEY, DEFAULT_HOTKEY);
        currentHotkey = parseHotkey(saved);
        console.log('[熱鍵設定] 載入熱鍵:', saved, '→', currentHotkey);
    }

    function validateHotkey(hotkeyStr) {
        if (!hotkeyStr || hotkeyStr.trim() === '') {
            return { valid: false, error: '熱鍵不能為空' };
        }

        hotkeyStr = hotkeyStr.replace(/\s+/g, '');

        if (!/^[\^!+#]*[a-zA-Z0-9]+$/.test(hotkeyStr)) {
            return { valid: false, error: '格式錯誤：只能包含 ^!+# 和字母數字' };
        }

        const ctrlCount = (hotkeyStr.match(/\^/g) || []).length;
        const altCount = (hotkeyStr.match(/!/g) || []).length;
        const shiftCount = (hotkeyStr.match(/\+/g) || []).length;
        const metaCount = (hotkeyStr.match(/#/g) || []).length;

        if (ctrlCount > 1) return { valid: false, error: '重複的 ^ (Ctrl)' };
        if (altCount > 1) return { valid: false, error: '重複的 ! (Alt)' };
        if (shiftCount > 1) return { valid: false, error: '重複的 + (Shift)' };
        if (metaCount > 1) return { valid: false, error: '重複的 # (Win)' };

        const mainKey = hotkeyStr.replace(/[\^!+#]/g, '');
        if (!mainKey || mainKey.length === 0) {
            return { valid: false, error: '缺少主鍵（如 F8）' };
        }

        if (mainKey.startsWith('F') && mainKey.length > 3) {
            return { valid: false, error: `主鍵過長：${mainKey}（F 鍵最多到 F12）` };
        }

        return { valid: true };
    }

    function parseHotkey(hotkeyStr) {
        if (!hotkeyStr || hotkeyStr.trim() === '') {
            hotkeyStr = DEFAULT_HOTKEY;
        }

        const hotkey = {
            ctrl: false,
            alt: false,
            shift: false,
            meta: false,
            key: ''
        };

        hotkeyStr = hotkeyStr.replace(/\s+/g, '');

        if (!/^[\^!+#]*[a-zA-Z0-9]+$/.test(hotkeyStr)) {
            console.warn('[熱鍵解析] 無效格式:', hotkeyStr, '→ 使用預設值');
            return parseHotkey(DEFAULT_HOTKEY);
        }

        const ctrlCount = (hotkeyStr.match(/\^/g) || []).length;
        const altCount = (hotkeyStr.match(/!/g) || []).length;
        const shiftCount = (hotkeyStr.match(/\+/g) || []).length;
        const metaCount = (hotkeyStr.match(/#/g) || []).length;

        if (ctrlCount > 1 || altCount > 1 || shiftCount > 1 || metaCount > 1) {
            console.warn('[熱鍵解析] 重複修飾鍵:', hotkeyStr, '→ 使用預設值');
            return parseHotkey(DEFAULT_HOTKEY);
        }

        hotkey.ctrl = ctrlCount === 1;
        hotkey.alt = altCount === 1;
        hotkey.shift = shiftCount === 1;
        hotkey.meta = metaCount === 1;
        hotkey.key = hotkeyStr.replace(/[\^!+#]/g, '').toUpperCase();

        if (!hotkey.key || hotkey.key.length === 0) {
            console.warn('[熱鍵解析] 缺少主鍵:', hotkeyStr, '→ 使用預設值');
            return parseHotkey(DEFAULT_HOTKEY);
        }

        if (hotkey.key.startsWith('F') && hotkey.key.length > 3) {
            console.warn('[熱鍵解析] 主鍵過長:', hotkey.key, '→ 使用預設值');
            return parseHotkey(DEFAULT_HOTKEY);
        }

        return hotkey;
    }

    function formatHotkeyDisplay(hotkey) {
        const parts = [];
        if (hotkey.ctrl) parts.push('Ctrl');
        if (hotkey.alt) parts.push('Alt');
        if (hotkey.shift) parts.push('Shift');
        if (hotkey.meta) parts.push('Win');
        parts.push(hotkey.key);
        return parts.join(' + ');
    }

    function detectDarkMode() {
        const themeSetting = GM_getValue(THEME_KEY, DEFAULT_THEME);
        console.log('[SupJAV增強] 主題設定:', themeSetting);

        if (themeSetting === 'DARK') {
            isDarkMode = true;
        } else if (themeSetting === 'LIGHT') {
            isDarkMode = false;
        } else if (themeSetting === 'AUTO') {
            isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        } else {
            isDarkMode = true;
        }

        console.log('[SupJAV增強] 深色模式:', isDarkMode ? '開啟' : '關閉');
        return isDarkMode;
    }

    function showToast(message, duration = 2000) {
        const oldToast = document.getElementById('supjav-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.id = 'supjav-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ============================================
    // 資料提取函數區
    // ============================================

    function extractActressPhoto(doc) {
        let thumbElement = doc.querySelector('#main-area > section > div.actress-header > div.act-area > div.thumb img');
        
        if (!thumbElement) {
            thumbElement = doc.querySelector('div.actress-header div.act-area div.thumb img');
            console.log('[SupJAV增強] 使用照片備用選擇器 1');
        }
        
        if (!thumbElement) {
            thumbElement = doc.querySelector('div.thumb img');
            console.log('[SupJAV增強] 使用照片備用選擇器 2');
        }
        
        if (!thumbElement) {
            console.log('[SupJAV增強] 未找到照片');
            return null;
        }
        
        // ⭐ 優先使用 getAttribute（避免瀏覽器自動轉換域名）
        let thumbImg = thumbElement.getAttribute('src') || thumbElement.src;
        
        // 處理相對路徑
        if (thumbImg && thumbImg.startsWith('/')) {
            thumbImg = 'https://www.minnano-av.com' + thumbImg;
            console.log('[SupJAV增強] 照片 URL 已轉換為絕對路徑:', thumbImg);
        } else if (thumbImg && !thumbImg.startsWith('http')) {
            thumbImg = 'https://www.minnano-av.com/' + thumbImg;
            console.log('[SupJAV增強] 照片 URL 已補全前綴:', thumbImg);
        }
        
        console.log('[SupJAV增強] 最終照片 URL:', thumbImg);
        return thumbImg;
    }

    function extractActressPageUrl(doc, fallbackUrl) {
        const profileLink = doc.querySelector('#main-area > section > div.actress-header h2 a');
        
        if (!profileLink) {
            console.log('[SupJAV增強] 未找到演員頁面連結，使用備用 URL');
            return fallbackUrl;
        }
        
        let href = profileLink.getAttribute('href');
        if (!href) {
            console.log('[SupJAV增強] 連結無 href 屬性，使用備用 URL');
            return fallbackUrl;
        }
        
        // 處理相對路徑
        if (href.startsWith('/')) {
            href = 'https://www.minnano-av.com' + href;
        } else if (!href.startsWith('http')) {
            href = 'https://www.minnano-av.com/' + href;
        }
        
        console.log('[SupJAV增強] 從頁面解析到真實 URL:', href);
        return href;
    }

    // ============================================
    // 初始化設定
    // ============================================

    loadFloatingButtonPosition();
    loadHotkeySetting();
    detectDarkMode();

    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateX(-50%) translateY(0); }
            to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
    `;
    document.head.appendChild(toastStyle);

    try {
        console.log('[SupJAV增強] 註冊設定選單');

        GM_registerMenuCommand('🎨 設定主題模式 (AUTO/DARK/LIGHT)', () => {
            const current = GM_getValue(THEME_KEY, DEFAULT_THEME);
            const newValue = prompt(
                `設定主題模式：\n- AUTO: 跟隨系統\n- DARK: 深色模式\n- LIGHT: 淺色模式\n\n目前設定: ${current}\n請輸入 (留空使用預設 DARK):`,
                current
            );

            if (newValue !== null) {
                const parsed = newValue.trim().toUpperCase() || DEFAULT_THEME;
                if (THEME_OPTIONS.includes(parsed)) {
                    GM_setValue(THEME_KEY, parsed);
                    alert(`✅ 主題已設為: ${parsed}\n請重新載入頁面以套用設定`);
                    console.log('[SupJAV增強] 主題設定已更新:', parsed);
                } else {
                    alert(`❌ 無效選項 "${newValue}"\n請輸入: ${THEME_OPTIONS.join(', ')}`);
                }
            }
        });

        GM_registerMenuCommand('📍 重置浮動按鈕位置', () => {
            GM_setValue(POSITION_KEY, DEFAULT_POSITION);
            floatingButtonY = DEFAULT_POSITION;
            alert(`✅ 已重置浮動按鈕位置為: ${DEFAULT_POSITION}px\n請重新載入頁面或收納面板以套用`);
            console.log('[位置記憶] 位置已重置');
        });

        GM_registerMenuCommand('⌨️ 設定圈選搜尋熱鍵', () => {
            const current = GM_getValue(HOTKEY_KEY, DEFAULT_HOTKEY);
            const currentDisplay = formatHotkeyDisplay(currentHotkey);

            const newValue = prompt(
                `設定圈選文字搜尋熱鍵：\n\n修飾鍵符號：\n  ^ = Ctrl\n  ! = Alt\n  + = Shift\n  # = Win\n\n範例：\n  F8          → F8\n  ^F8         → Ctrl + F8\n  ^+F8        → Ctrl + Shift + F8\n  !+F8        → Alt + Shift + F8\n\n目前設定: ${current} (${currentDisplay})\n請輸入新熱鍵:`,
                current
            );

            if (newValue === null) return;

            const trimmed = newValue.trim();
            const validation = validateHotkey(trimmed);

            if (!validation.valid) {
                alert(`❌ 設定失敗：${validation.error}\n\n將使用預設熱鍵：${DEFAULT_HOTKEY}`);
                console.error('[熱鍵設定] 驗證失敗:', validation.error);
                return;
            }

            const parsed = parseHotkey(trimmed);
            const display = formatHotkeyDisplay(parsed);

            GM_setValue(HOTKEY_KEY, trimmed);
            currentHotkey = parsed;

            alert(`✅ 熱鍵已設為: ${display}\n請重新載入頁面以套用設定`);
            console.log('[熱鍵設定] 熱鍵已更新:', trimmed, '→', parsed);
        });

    } catch (e) {
        console.error('[SupJAV增強] 註冊選單錯誤:', e);
    }

    // ============================================
    // 圈選功能初始化
    // ============================================

    function initManualSelectionFeature() {
        console.log('[圈選功能] 已啟動，熱鍵:', formatHotkeyDisplay(currentHotkey));

        document.addEventListener('keydown', function(e) {
            if (currentHotkey.ctrl !== e.ctrlKey) return;
            if (currentHotkey.alt !== e.altKey) return;
            if (currentHotkey.shift !== e.shiftKey) return;
            if (currentHotkey.meta !== e.metaKey) return;
            if (currentHotkey.key !== e.key.toUpperCase()) return;

            e.preventDefault();
            e.stopPropagation();

            const selectedText = window.getSelection().toString().trim();

            if (!selectedText) {
                console.log('[圈選功能] 未選取文字');
                showToast('⚠️ 請先圈選演員名稱');
                return;
            }

            console.log('[圈選功能] 觸發搜尋:', selectedText);
            performSearchForActress(selectedText);
        });
    }

    // ============================================
    // 主流程
    // ============================================

    const currentUrl = window.location.href;
    const currentDomain = getCurrentDomain();
    const isDetailPage = /\/ja\/\d+\.html/.test(currentUrl);
    const isSpecificPage = /\/ja\/\?s=|\/ja\/page\/.*\?s=|\/ja\/category\/cast\/|\/ja\/\d+\.html/.test(currentUrl);

    console.log('[SupJAV增強] 當前網站:', currentDomain);

    // 全站啟用圈選功能
    initManualSelectionFeature();

    // 只在 SupJAV 插入火箭
    if (currentDomain === 'supjav') {
        if (isSpecificPage) {
            if (isDetailPage) {
                console.log('[SupJAV增強] SupJAV 內頁模式');
                insertIconsForDetailPage();
            } else {
                console.log('[SupJAV增強] SupJAV 列表頁模式');
                initListPage();
            }
        } else {
            console.log('[SupJAV增強] SupJAV 非特定頁面，僅啟用圈選功能');
        }
    } else {
        console.log('[SupJAV增強] 非 SupJAV 網站，僅啟用圈選功能（F8）');
    }

    // ============================================
    // 頁面初始化函數
    // ============================================

    function initListPage() {
        const titleElement = document.querySelector('body > div.main > div > div.content > div.archive-title > h1');

        if (!titleElement) {
            console.error('[SupJAV增強] 找不到標題元素');
            return;
        }

        let fullText = titleElement.textContent.trim();
        console.log('[SupJAV增強] 原始文本:', fullText);

        let actressName = '';

        if (currentUrl.includes('/category/cast/') || currentUrl.includes('?s=')) {
            console.log('[SupJAV增強] 檢測到演員/搜尋頁面');

            fullText = fullText.replace(/^Search\s+Result\s+For:\s*/i, '');
            console.log('[SupJAV增強] 移除前綴後:', fullText);

            fullText = fullText.replace(new RegExp(CONFIG.searchButtonIcon, 'g'), '').trim();
            console.log('[SupJAV增強] 移除 emoji 後:', fullText);

            fullText = fullText.replace(/\s*\(\d+\)\s*$/, '');
            console.log('[SupJAV增強] 移除作品數量後:', fullText);

            const match = fullText.match(/^([^(]+)/);
            actressName = match ? match[1].trim() : fullText.trim();

            console.log('[SupJAV增強] 最終演員名:', actressName);
        }

        if (!actressName) {
            console.error('[SupJAV增強] 無法提取演員名');
            return;
        }

        currentActressName = actressName;
        insertSearchIcon();
    }

    function insertSearchIcon() {
        const titleElement = document.querySelector('body > div.main > div > div.content > div.archive-title > h1');

        const iconSpan = document.createElement('span');
        iconSpan.id = 'supjav-search-icon';
        iconSpan.textContent = CONFIG.searchButtonIcon;
        iconSpan.style.cssText = `
            cursor: pointer;
            margin: 0 5px;
            display: inline-block;
            transition: transform 0.2s;
            font-size: 1.2em;
            vertical-align: middle;
        `;

        const originalHTML = titleElement.innerHTML;
        const countMatch = originalHTML.match(/\((\d+)\)/);

        if (countMatch) {
            const countIndex = originalHTML.indexOf(countMatch[0]);
            const beforeCount = originalHTML.substring(0, countIndex);
            const afterCount = originalHTML.substring(countIndex);
            titleElement.innerHTML = beforeCount + iconSpan.outerHTML + ' ' + afterCount;
        } else {
            titleElement.innerHTML = originalHTML + ' ' + iconSpan.outerHTML;
        }

        const icon = document.getElementById('supjav-search-icon');
        icon.addEventListener('mouseenter', handleMouseEnter);
        icon.addEventListener('mouseleave', handleMouseLeave);
        icon.addEventListener('click', handleIconClick);
        icon.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.3) rotate(15deg)';
        });
        icon.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });

        console.log('[SupJAV增強] 🚀 圖標已插入');
    }

    function insertIconsForDetailPage() {
        const catsDiv = document.querySelector('body > div.main > div > div.content.content-padding > div.post-meta.clearfix > div.cats');

        if (!catsDiv) {
            console.log('[SupJAV增強] 內頁找不到 cats 容器');
            return;
        }

        const allParagraphs = catsDiv.querySelectorAll('p');
        let castParagraph = null;

        for (const p of allParagraphs) {
            const spanText = p.querySelector('span')?.textContent || '';
            if (/cast\s*:/i.test(spanText)) {
                castParagraph = p;
                console.log('[SupJAV增強] 找到 Cast 段落:', p);
                break;
            }
        }

        if (!castParagraph) {
            console.log('[SupJAV增強] 內頁沒有演員資訊');
            return;
        }

        const castLabel = castParagraph.querySelector('span');
        if (!castLabel || !/cast\s*:/i.test(castLabel.textContent)) {
            console.log('[SupJAV增強] 內頁沒有有效的 Cast 標籤');
            return;
        }

        console.log('[SupJAV增強] 找到 Cast 標籤:', castLabel.textContent);

        const actressLinks = castParagraph.querySelectorAll('a');

        if (actressLinks.length === 0) {
            console.log('[SupJAV增強] 內頁沒有演員連結');
            return;
        }

        console.log(`[SupJAV增強] 內頁找到 ${actressLinks.length} 位演員`);

        actressLinks.forEach((link, index) => {
            const actressName = link.textContent.trim();
            console.log(`[SupJAV增強] 處理演員 ${index + 1}: "${actressName}"`);

            const iconSpan = document.createElement('span');
            iconSpan.className = 'supjav-search-icon';
            iconSpan.dataset.actressName = actressName;
            iconSpan.dataset.index = index;
            iconSpan.textContent = ' ' + CONFIG.searchButtonIcon;
            iconSpan.style.cssText = `
                cursor: pointer;
                margin: 0 3px;
                display: inline-block;
                transition: transform 0.2s;
                font-size: 1.1em;
                vertical-align: middle;
            `;

            link.insertAdjacentElement('afterend', iconSpan);

            iconSpan.addEventListener('mouseenter', () => handleMouseEnterDetail(iconSpan));
            iconSpan.addEventListener('mouseleave', handleMouseLeave);
            iconSpan.addEventListener('click', (e) => handleIconClickDetail(e, iconSpan));
            iconSpan.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.3) rotate(15deg)';
            });
            iconSpan.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
            });

            console.log(`[SupJAV增強] 已為演員 "${actressName}" 插入火箭`);
        });
    }

    // ============================================
    // 事件處理函數
    // ============================================

    function handleMouseEnter() {
        const icon = document.getElementById('supjav-search-icon');

        if (hasSearched && cachedData && cachedData.actressName === currentActressName) {
            icon.title = '已查詢過，點擊重新顯示';
            return;
        }

        icon.title = `懸停 ${CONFIG.hoverDelay / 1000} 秒後搜尋...`;
        hoverTimer = setTimeout(() => {
            if (!isSearching && !hasSearched) performSearchForActress(currentActressName);
        }, CONFIG.hoverDelay);
    }

    function handleMouseLeave() {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }
    }

    function handleIconClick(e) {
        if (e) e.preventDefault();

        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }

        if (currentPanel && document.body.contains(currentPanel) &&
            cachedData && cachedData.actressName === currentActressName) {
            console.log('[SupJAV增強] UI 已顯示，略過重複觸發');
            currentPanel.style.animation = 'none';
            setTimeout(() => {
                currentPanel.style.animation = 'pulse 0.3s ease';
            }, 10);
            return;
        }

        if (hasSearched && cachedData && cachedData.actressName === currentActressName) {
            console.log('[SupJAV增強] 使用暫存資料');
            showDataUIFromCache();
        } else if (!isSearching) {
            performSearchForActress(currentActressName);
        }
    }

    function handleMouseEnterDetail(icon) {
        const actressName = icon.dataset.actressName;

        if (hasSearched && cachedData && cachedData.actressName === actressName) {
            icon.title = '已查詢過，點擊重新顯示';
            return;
        }

        icon.title = `懸停 ${CONFIG.hoverDelay / 1000} 秒後搜尋 ${actressName}...`;
        hoverTimer = setTimeout(() => {
            if (!isSearching) performSearchForActress(actressName);
        }, CONFIG.hoverDelay);
    }

    function handleIconClickDetail(e, icon) {
        if (e) e.preventDefault();

        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }

        const actressName = icon.dataset.actressName;

        if (currentPanel && document.body.contains(currentPanel) &&
            cachedData && cachedData.actressName === actressName) {
            console.log('[SupJAV增強] UI 已顯示，略過重複觸發');
            currentPanel.style.animation = 'none';
            setTimeout(() => {
                currentPanel.style.animation = 'pulse 0.3s ease';
            }, 10);
            return;
        }

        if (hasSearched && cachedData && cachedData.actressName === actressName) {
            console.log('[SupJAV增強] 使用暫存資料');
            showDataUIFromCache();
        } else if (!isSearching) {
            performSearchForActress(actressName);
        }
    }

    // ============================================
    // CSS 注入
    // ============================================

    function injectCSS() {
        if (cssInjected) {
            console.log('[SupJAV增強] CSS 已注入，跳過');
            return;
        }

        console.log('[SupJAV增強] 正在注入 CSS...（深色模式:', isDarkMode, '）');

        const colors = isDarkMode ? {
            bg: '#282833',
            text: '#ebebef',
            textSubdued: '#8a8aa3',
            labelText: '#a9a9bc',
            border: '#3f3f50',
            linkColor: '#3282EB',
            hoverBg: '#3f3f50'
        } : {
            bg: '#ffffff',
            text: '#333333',
            textSubdued: '#666666',
            labelText: '#555555',
            border: '#e0e0e0',
            linkColor: '#3282EB',
            hoverBg: '#f5f5f5'
        };

        const themeStyle = document.createElement('style');
        themeStyle.id = 'minnano-av-theme-style';
        themeStyle.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(50, 130, 235, 0.5); }
            }

            #supjav-minnano-panel .act-profile {
                background-color: ${colors.bg} !important;
                color: ${colors.text} !important;
                padding: 20px !important;
                border-radius: 8px !important;
            }

            #supjav-minnano-panel .act-profile h2 {
                color: ${colors.text} !important;
                font-size: 20px !important;
                font-weight: bold !important;
                margin-bottom: 15px !important;
            }

            #supjav-minnano-panel .act-profile table {
                width: 100% !important;
                border-collapse: collapse !important;
            }

            #supjav-minnano-panel .act-profile tr {
                border-bottom: 1px solid ${colors.border} !important;
            }

            #supjav-minnano-panel .act-profile td {
                padding: 10px 5px !important;
                color: ${colors.text} !important;
                vertical-align: top !important;
            }

            #supjav-minnano-panel .act-profile span {
                display: inline-block !important;
                min-width: 80px !important;
                font-weight: bold !important;
                color: ${colors.labelText} !important;
            }

            #supjav-minnano-panel .act-profile p {
                display: inline !important;
                color: ${colors.text} !important;
                margin-left: 10px !important;
            }

            #supjav-minnano-panel .act-profile a {
                color: ${colors.linkColor} !important;
                text-decoration: none !important;
            }

            #supjav-minnano-panel .act-profile a:hover {
                text-decoration: underline !important;
            }

            #supjav-minnano-panel .act-profile tr:hover {
                background-color: ${colors.hoverBg} !important;
            }

            #supjav-minnano-panel .btn-box {
                margin-top: 20px !important;
                display: flex !important;
                gap: 10px !important;
            }

            #supjav-minnano-panel .btnlnk {
                padding: 8px 16px !important;
                background: ${colors.linkColor} !important;
                color: white !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                border: none !important;
            }

            #supjav-minnano-panel .btnlnk.off {
                background: ${isDarkMode ? '#55556d' : '#cccccc'} !important;
                color: ${isDarkMode ? '#8a8aa3' : '#666666'} !important;
                cursor: not-allowed !important;
            }

            #supjav-minnano-panel {
                user-select: none !important;
            }

            #panel-header,
            #panel-header * {
                user-select: none !important;
                cursor: move !important;
            }

            #panel-content {
                user-select: text !important;
                cursor: auto !important;
            }

            #panel-content * {
                user-select: text !important;
                cursor: auto !important;
            }

            #hide-to-side-btn,
            #close-panel-btn {
                cursor: pointer !important;
                user-select: none !important;
            }

            #result-selector {
                background: #444 !important;
                color: white !important;
                border: 1px solid #666 !important;
                border-radius: 4px !important;
                padding: 4px 8px !important;
                cursor: pointer !important;
                font-size: 13px !important;
                max-width: 200px !important;
            }

            #result-selector:hover {
                background: #555 !important;
            }

            #result-selector option {
                background: #333 !important;
                color: white !important;
            }

            #prev-result-btn, #next-result-btn {
                background: #666 !important;
                border: none !important;
                border-radius: 4px !important;
                width: 24px !important;
                height: 24px !important;
                cursor: pointer !important;
                color: white !important;
                font-size: 14px !important;
                transition: background 0.2s !important;
                line-height: 1 !important;
            }

            #prev-result-btn:hover:not(:disabled),
            #next-result-btn:hover:not(:disabled) {
                background: #888 !important;
            }

            #prev-result-btn:disabled,
            #next-result-btn:disabled {
                background: #444 !important;
                color: #666 !important;
                cursor: not-allowed !important;
            }
        `;
        document.head.appendChild(themeStyle);

        cssInjected = true;
        console.log('[SupJAV增強] CSS 注入成功');
    }

    // ============================================
    // 搜尋邏輯
    // ============================================

    function performSearchForActress(actressName) {
        currentActressName = actressName;
        isSearching = true;

        const listIcon = document.getElementById('supjav-search-icon');
        if (listIcon) {
            listIcon.style.opacity = '0.5';
            listIcon.title = '搜尋中...';
        }

        const detailIcons = document.querySelectorAll('.supjav-search-icon');
        detailIcons.forEach(icon => {
            if (icon.dataset.actressName === actressName) {
                icon.style.opacity = '0.5';
                icon.title = '搜尋中...';
            }
        });

        injectCSS();

        const searchUrl = `https://www.minnano-av.com/search_result.php?search_scope=actress&search_word=${encodeURIComponent(actressName)}&search=+Go+`;
        console.log('[SupJAV增強] 查詢:', searchUrl);

        showLoadingUI();

        GM_xmlhttpRequest({
            method: 'GET',
            url: searchUrl,
            onload: function(response) {
                if (response.status !== 200) {
                    showErrorUI('請求失敗: ' + response.status);
                    resetIconsForActress(actressName);
                    return;
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                let actProfile = doc.querySelector('#main-area > section > div.actress-header > div.act-profile');

                if (actProfile) {
                    console.log('[SupJAV增強] 資料獲取成功（單一結果）');

                    // ⭐ 提取照片和真實 URL
                    const thumbImg = extractActressPhoto(doc);
                    const sourceUrl = extractActressPageUrl(doc, searchUrl);

                    searchResults = [];
                    currentResultIndex = 0;

                    cachedData = {
                        html: actProfile.outerHTML,
                        actressName: actressName,
                        searchResults: [],
                        currentResultIndex: 0,
                        thumbImg: thumbImg,
                        sourceUrl: sourceUrl
                    };
                    hasSearched = true;
                    showDataUI(cachedData.html, cachedData.actressName);
                    resetIconsForActress(actressName);
                    return;
                }

                // 多結果處理
                const resultRows = doc.querySelectorAll('#main-area > section > table > tbody > tr');

                if (resultRows.length > 1) {
                    console.log(`[SupJAV增強] 檢測到 ${resultRows.length - 1} 個搜尋結果`);

                    console.log('[SupJAV增強] === 搜尋結果頁面結構分析 ===');
                    Array.from(resultRows).slice(0, 4).forEach((row, index) => {
                        console.log(`\n[SupJAV增強] 第 ${index} 列 HTML:`, row.outerHTML.substring(0, 500));

                        const link = row.querySelector('td:nth-child(1) > a');
                        if (link) {
                            console.log(`[SupJAV增強] 第 ${index} 列連結 href:`, link.getAttribute('href'));
                            console.log(`[SupJAV增強] 第 ${index} 列連結文字:`, link.textContent.trim());
                        }

                        const nameCell = row.querySelector('td.details h2 a');
                        if (nameCell) {
                            console.log(`[SupJAV增強] 第 ${index} 列名稱:`, nameCell.textContent.trim());
                            console.log(`[SupJAV增強] 第 ${index} 列名稱 href:`, nameCell.getAttribute('href'));
                        }
                    });
                    console.log('[SupJAV增強] === 結構分析結束 ===\n');

                    searchResults = Array.from(resultRows).slice(1).map((row, index) => {
                        const link = row.querySelector('td:nth-child(1) > a');
                        const nameCell = row.querySelector('td.details h2 a');

                        if (!link) {
                            console.warn(`[SupJAV增強] 第 ${index + 1} 列找不到連結`);
                            return null;
                        }

                        let url = link.getAttribute('href');

                        if (url.startsWith('/')) {
                            url = 'https://www.minnano-av.com' + url;
                        } else if (!url.startsWith('http')) {
                            url = 'https://www.minnano-av.com/' + url;
                        }

                        console.log(`[SupJAV增強] 完整 URL：${url}`);

                        let name = '';
                        if (nameCell) {
                            name = nameCell.textContent.trim();
                        }
                        if (!name && link) {
                            name = link.textContent.trim();
                        }
                        if (!name) {
                            const match = url.match(/actress(\d+)\.html/);
                            name = match ? `演員 #${match[1]}` : `結果 ${index + 1}`;
                        }

                        console.log(`[SupJAV增強] 結果 ${index + 1}:`, { name, url });

                        return {
                            name: name,
                            url: url,
                            rowIndex: index + 2
                        };
                    }).filter(item => item !== null);

                    console.log('[SupJAV增強] 搜尋結果列表:', searchResults);

                    if (searchResults.length > 0) {
                        currentResultIndex = 0;
                        fetchActressDataByIndex(0, actressName);
                    } else {
                        console.error('[SupJAV增強] 沒有有效的搜尋結果');
                        showErrorUI('找不到演員資料');
                        resetIconsForActress(actressName);
                    }
                } else {
                    console.error('[SupJAV增強] 找不到演員資料，也找不到搜尋結果列表');
                    showErrorUI('找不到演員資料');
                    resetIconsForActress(actressName);
                }
            },
            onerror: function(error) {
                console.error('[SupJAV增強] 錯誤:', error);
                showErrorUI('網路請求失敗');
                resetIconsForActress(actressName);
            }
        });
    }

    function fetchActressDataByIndex(index, originalSearchTerm) {
        if (index < 0 || index >= searchResults.length) {
            console.error('[SupJAV增強] 索引超出範圍:', index);
            return;
        }

        currentResultIndex = index;
        const result = searchResults[index];

        console.log(`[SupJAV增強] 載入結果 ${index + 1}/${searchResults.length}:`, result.name);

        fetchActressDataForName(result.url, result.name);
    }

    function fetchActressDataForName(url, actressName) {
        console.log('[SupJAV增強] 正在獲取演員資料頁面...');
        console.log('[SupJAV增強] 目標 URL:', url);

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                console.log('[SupJAV增強] 請求回應狀態:', response.status);

                if (response.status !== 200) {
                    console.error('[SupJAV增強] HTTP 錯誤:', response.status, response.statusText);
                    showErrorUI('獲取演員資料失敗: ' + response.status);
                    resetIconsForActress(actressName);
                    return;
                }

                console.log('[SupJAV增強] 開始解析 HTML...');

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                console.log('[SupJAV增強] HTML 解析完成，查找演員資料區塊...');

                // 查找演員資料區塊（三層備援）
                let actProfile = doc.querySelector('#main-area > section > div.actress-header > div.act-profile');

                if (!actProfile) {
                    actProfile = doc.querySelector('div.actress-header div.act-profile');
                    console.log('[SupJAV增強] 使用備用選擇器 1');
                }

                if (!actProfile) {
                    actProfile = doc.querySelector('div.act-profile');
                    console.log('[SupJAV增強] 使用備用選擇器 2');
                }

                if (!actProfile) {
                    console.error('[SupJAV增強] 找不到演員資料區塊！');
                    console.log('[SupJAV增強] 頁面標題:', doc.title);
                    showErrorUI('找不到演員資料');
                    resetIconsForActress(actressName);
                    return;
                }

                // ⭐ 提取照片
                const thumbImg = extractActressPhoto(doc);

                console.log('[SupJAV增強] 資料獲取成功（從搜尋結果進入）');
                console.log('[SupJAV增強] 演員資料長度:', actProfile.outerHTML.length);

                // ⭐ 暫存結構加入照片和 URL
                cachedData = {
                    html: actProfile.outerHTML,
                    actressName: actressName,
                    searchResults: searchResults,
                    currentResultIndex: currentResultIndex,
                    thumbImg: thumbImg,
                    sourceUrl: url
                };
                hasSearched = true;

                showDataUI(cachedData.html, cachedData.actressName);
                resetIconsForActress(actressName);
            },
            onerror: function(error) {
                console.error('[SupJAV增強] 網路請求錯誤（完整）:', error);
                console.error('[SupJAV增強] 錯誤類型:', error.error);
                console.error('[SupJAV增強] 目標 URL:', url);
                showErrorUI('網路請求失敗');
                resetIconsForActress(actressName);
            },
            ontimeout: function() {
                console.error('[SupJAV增強] 請求超時！URL:', url);
                showErrorUI('請求超時');
                resetIconsForActress(actressName);
            }
        });
    }

    function resetIconsForActress(actressName) {
        isSearching = false;

        const listIcon = document.getElementById('supjav-search-icon');
        if (listIcon) {
            listIcon.style.opacity = '1';
            listIcon.title = (hasSearched && cachedData && cachedData.actressName === actressName)
                ? '已查詢過，點擊重新顯示'
                : '懸停或點擊搜尋';
        }

        const detailIcons = document.querySelectorAll('.supjav-search-icon');
        detailIcons.forEach(icon => {
            if (icon.dataset.actressName === actressName) {
                icon.style.opacity = '1';
                icon.title = (hasSearched && cachedData && cachedData.actressName === actressName)
                    ? '已查詢過，點擊重新顯示'
                    : '懸停或點擊搜尋';
            }
        });
    }

    // ============================================
    // UI 顯示函數
    // ============================================

    function showLoadingUI() {
        if (currentPanel && document.body.contains(currentPanel)) {
            console.log('[SupJAV增強] 移除舊面板');
            currentPanel.remove();
            currentPanel = null;
        }
        const panel = createPanel();
        panel.id = 'supjav-minnano-panel';
        currentPanel = panel;
        panel.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <div style="font-size: 32px; margin-bottom: 15px;">⏳</div>
                <div style="color: #e0e0e0;">正在查詢 Minnano-AV...</div>
            </div>
        `;
        document.body.appendChild(panel);
        positionPanel(panel);
    }

    function showErrorUI(message) {
        const panel = document.getElementById('supjav-minnano-panel');
        if (panel) {
            panel.innerHTML = `
                <div style="padding: 30px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 15px;">❌</div>
                    <div style="color: #ff6b6b; margin-bottom: 20px;">${message}</div>
                    <button onclick="this.closest('#supjav-minnano-panel').remove();" style="
                        padding: 10px 20px;
                        background: #444;
                        color: white;
                        border: 1px solid #666;
                        border-radius: 6px;
                        cursor: pointer;
                    ">關閉</button>
                </div>
            `;
        }
    }

    function showDataUI(actProfileHTML, actressName) {
        const panel = document.getElementById('supjav-minnano-panel');
        if (!panel) return;

        const contentBg = isDarkMode ? '#282833' : '#ffffff';

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = actProfileHTML;

        const btnBox = tempDiv.querySelector('.btn-box');
        if (btnBox) {
            btnBox.remove();
            console.log('[SupJAV增強] 已移除 Minnano-AV 的操作按鈕');
        }

        actProfileHTML = tempDiv.innerHTML;

        const hasMultipleResults = searchResults.length > 1;

        console.log('[SupJAV增強] 多結果檢測:', {
            hasMultipleResults,
            resultsCount: searchResults.length,
            currentIndex: currentResultIndex
        });

        let navControls = '';
        
        if (hasMultipleResults) {
            const optionsHTML = searchResults.map((result, index) => {
                const selected = index === currentResultIndex ? 'selected' : '';
                return `<option value="${index}" ${selected}>${result.name}</option>`;
            }).join('');

            const prevDisabled = currentResultIndex === 0 ? 'disabled' : '';
            const prevBg = currentResultIndex === 0 ? '#444' : '#666';
            const prevCursor = currentResultIndex === 0 ? 'not-allowed' : 'pointer';
            const prevColor = currentResultIndex === 0 ? '#666' : 'white';

            const nextDisabled = currentResultIndex === searchResults.length - 1 ? 'disabled' : '';
            const nextBg = currentResultIndex === searchResults.length - 1 ? '#444' : '#666';
            const nextCursor = currentResultIndex === searchResults.length - 1 ? 'not-allowed' : 'pointer';
            const nextColor = currentResultIndex === searchResults.length - 1 ? '#666' : 'white';

            navControls = `
                <select id="result-selector" 
                    autocomplete="off" 
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                    data-supjav-internal="true"
                    data-lpignore="true"
                    data-form-type="other"
                    style="
                        background: #444;
                        color: white;
                        border: 1px solid #666;
                        border-radius: 4px;
                        padding: 4px 8px;
                        cursor: pointer;
                        font-size: 13px;
                        max-width: 200px;
                    ">
                    ${optionsHTML}
                </select>

                <button id="prev-result-btn" ${prevDisabled} style="
                    background: ${prevBg};
                    border: none;
                    border-radius: 4px;
                    width: 24px;
                    height: 24px;
                    cursor: ${prevCursor};
                    color: ${prevColor};
                    font-size: 14px;
                    transition: background 0.2s;
                    line-height: 1;
                ">◄</button>

                <span style="color: #4fc3f7; font-weight: bold; font-size: 14px;">
                    ${currentResultIndex + 1}/${searchResults.length}
                </span>

                <button id="next-result-btn" ${nextDisabled} style="
                    background: ${nextBg};
                    border: none;
                    border-radius: 4px;
                    width: 24px;
                    height: 24px;
                    cursor: ${nextCursor};
                    color: ${nextColor};
                    font-size: 14px;
                    transition: background 0.2s;
                    line-height: 1;
                ">►</button>
            `;
        }

        // 照片區塊
        let photoSection = '';
        if (cachedData && cachedData.thumbImg) {
            photoSection = `
                <div style="
                    padding: 15px;
                    text-align: center;
                    border-bottom: 1px solid ${isDarkMode ? '#3f3f50' : '#e0e0e0'};
                    background: ${contentBg};
                ">
                    <img src="${cachedData.thumbImg}" alt="${actressName}" style="
                        max-width: 100%;
                        max-height: 300px;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    " onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div style="display: none; color: ${isDarkMode ? '#8a8aa3' : '#666666'}; padding: 20px;">
                        📷 照片載入失敗
                    </div>
                </div>
            `;
        }

        // 查看完整資料連結
        let viewFullLink = '';
        if (cachedData && cachedData.sourceUrl) {
            viewFullLink = `
                <div style="
                    padding: 12px 15px;
                    text-align: center;
                    border-top: 1px solid ${isDarkMode ? '#3f3f50' : '#e0e0e0'};
                    background: ${contentBg};
                ">
                    <a href="${cachedData.sourceUrl}" target="_blank" style="
                        display: inline-block;
                        padding: 8px 16px;
                        background: ${isDarkMode ? '#3282EB' : '#3282EB'};
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                        font-size: 14px;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='${isDarkMode ? '#2666c7' : '#2666c7'}'" 
                       onmouseout="this.style.background='${isDarkMode ? '#3282EB' : '#3282EB'}'">
                        🔗 查看完整資料（含演出清單）
                    </a>
                </div>
            `;
        }

        // ⭐ 動態計算內容區最大高度
        const windowHeight = window.innerHeight;
        const headerHeight = 60;
        const photoHeight = cachedData && cachedData.thumbImg ? 330 : 0;
        const linkHeight = cachedData && cachedData.sourceUrl ? 60 : 0;
        const topMargin = 100;
        const bottomMargin = 20;
        
        const contentMaxHeight = Math.max(200, windowHeight - topMargin - bottomMargin - headerHeight - photoHeight - linkHeight);
        
        console.log('[SupJAV增強] 內容區最大高度:', contentMaxHeight);

        panel.innerHTML = `
            <div id="panel-header" style="
                background: #1e1e1e;
                padding: 12px 15px;
                border-radius: 8px 8px 0 0;
                cursor: move;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #444;
            ">
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${navControls}
                    <div style="color: #4fc3f7; font-weight: bold; font-size: 16px;">
                        📋 ${actressName} - Minnano-AV
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button id="hide-to-side-btn" title="收納到側邊" style="
                        background: #66bb6a;
                        border: none;
                        border-radius: 4px;
                        width: 24px;
                        height: 24px;
                        cursor: pointer;
                        color: white;
                        font-size: 14px;
                        line-height: 1;
                    ">◄</button>
                    <button id="close-panel-btn" title="關閉" style="
                        background: #ef5350;
                        border: none;
                        border-radius: 4px;
                        width: 24px;
                        height: 24px;
                        cursor: pointer;
                        color: white;
                        font-size: 16px;
                        line-height: 1;
                    ">×</button>
                </div>
            </div>
            ${photoSection}
            <div id="panel-content" style="
                padding: 0;
                max-height: ${contentMaxHeight}px;
                overflow-y: auto;
                background: ${contentBg};
                user-select: text;
                cursor: auto;
            ">
                ${actProfileHTML}
            </div>
            ${viewFullLink}
        `;

        if (hasMultipleResults) {
            console.log('[SupJAV增強] 綁定多結果切換事件');

            const selector = document.getElementById('result-selector');
            if (selector) {
                selector.setAttribute('autocomplete', 'off');
                selector.setAttribute('autocorrect', 'off');
                selector.setAttribute('autocapitalize', 'off');
                selector.setAttribute('spellcheck', 'false');
                selector.setAttribute('data-supjav-internal', 'true');
                selector.setAttribute('data-lpignore', 'true');
                selector.setAttribute('data-form-type', 'other');
                
                const newSelector = selector.cloneNode(true);
                selector.parentNode.replaceChild(newSelector, selector);
                
                ['change', 'input'].forEach(eventType => {
                    newSelector.addEventListener(eventType, (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        
                        const selectedIndex = parseInt(e.target.value);
                        console.log(`[SupJAV增強] 下拉選單觸發（${eventType}），索引:`, selectedIndex);
                        
                        if (selectedIndex !== currentResultIndex && !isNaN(selectedIndex)) {
                            console.log('[SupJAV增強] 下拉選單切換到索引:', selectedIndex);
                            fetchActressDataByIndex(selectedIndex, currentActressName);
                        }
                    }, true);
                });
                
                newSelector.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                    console.log('[SupJAV增強] 下拉選單被按下');
                }, true);
                
                newSelector.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('[SupJAV增強] 下拉選單被點擊');
                }, true);
                
                console.log('[SupJAV增強] 下拉選單事件已綁定（強化隔離模式）');
            }

            const prevBtn = document.getElementById('prev-result-btn');
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (currentResultIndex > 0) {
                        console.log('[SupJAV增強] 切換到上一個結果');
                        fetchActressDataByIndex(currentResultIndex - 1, currentActressName);
                    }
                });
                console.log('[SupJAV增強] 上一個按鈕事件已綁定');
            }

            const nextBtn = document.getElementById('next-result-btn');
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (currentResultIndex < searchResults.length - 1) {
                        console.log('[SupJAV增強] 切換到下一個結果');
                        fetchActressDataByIndex(currentResultIndex + 1, currentActressName);
                    }
                });
                console.log('[SupJAV增強] 下一個按鈕事件已綁定');
            }
        }

        document.getElementById('close-panel-btn').addEventListener('click', () => {
            panel.remove();
            currentPanel = null;
        });
        document.getElementById('hide-to-side-btn').addEventListener('click', () => hideToSide());

        makeDraggable(panel, document.getElementById('panel-header'));

        console.log('[SupJAV增強] UI 已顯示');
    }

    function showDataUIFromCache() {
        if (!cachedData) return;

        if (floatingButton) {
            floatingButton.remove();
            floatingButton = null;
        }

        if (cachedData.searchResults) {
            searchResults = cachedData.searchResults;
            currentResultIndex = cachedData.currentResultIndex || 0;
            console.log('[SupJAV增強] 還原搜尋結果:', {
                resultsCount: searchResults.length,
                currentIndex: currentResultIndex
            });
        }

        const panel = createPanel();
        panel.id = 'supjav-minnano-panel';
        currentPanel = panel;
        document.body.appendChild(panel);
        positionPanel(panel);

        showDataUI(cachedData.html, cachedData.actressName);
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            background: #2d2d2d;
            border: 2px solid #555;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            z-index: 999998;
            min-width: 450px;
            min-height: 200px;
            font-family: 'Segoe UI', Arial, sans-serif;
            user-select: none;
            cursor: default;
        `;
        return panel;
    }

    function positionPanel(panel) {
        const contentElement = document.querySelector('body > div.main > div > div.content');
        const windowWidth = window.innerWidth;

        let panelWidth = Math.min(CONFIG.maxPanelWidth, windowWidth * 0.4);
        let leftSpace = 0;
        let rightSpace = 0;
        const topPosition = 100;

        if (contentElement) {
            const rect = contentElement.getBoundingClientRect();
            leftSpace = rect.left;
            rightSpace = windowWidth - rect.right;
            console.log(`[SupJAV增強] 內容區域 - 左:${leftSpace}px, 右:${rightSpace}px`);
        }

        if (leftSpace > rightSpace && leftSpace > CONFIG.minSideMargin) {
            panelWidth = Math.min(panelWidth, leftSpace - CONFIG.minSideMargin);
            panel.style.left = `${CONFIG.minSideMargin / 2}px`;
            console.log('[SupJAV增強] UI 定位：左側');
        } else if (rightSpace > CONFIG.minSideMargin) {
            panelWidth = Math.min(panelWidth, rightSpace - CONFIG.minSideMargin);
            panel.style.right = `${CONFIG.minSideMargin / 2}px`;
            console.log('[SupJAV增強] UI 定位：右側');
        } else {
            panel.style.left = '50%';
            panel.style.transform = 'translateX(-50%)';
            console.log('[SupJAV增強] UI 定位：居中');
        }

        panel.style.top = `${topPosition}px`;
        panel.style.width = `${panelWidth}px`;
        panel.style.maxWidth = `${panelWidth}px`;
    }

    function hideToSide() {
        if (currentPanel) {
            currentPanel.remove();
            currentPanel = null;
        }

        if (floatingButton) {
            console.log('[浮動按鈕] 移除舊按鈕');
            floatingButton.remove();
            floatingButton = null;
        }

        createFloatingButton();
    }

    function createFloatingButton() {
        if (floatingButton) {
            console.log('[浮動按鈕] 按鈕已存在，跳過創建');
            return;
        }

        console.log('[浮動按鈕] 開始創建按鈕，位置:', floatingButtonY);

        floatingButton = document.createElement('div');
        floatingButton.id = 'supjav-floating-button';
        floatingButton.innerHTML = CONFIG.floatingButtonIcon;
        floatingButton.style.cssText = `
            position: fixed;
            right: 0;
            top: ${floatingButtonY}px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50% 0 0 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: move;
            z-index: 999999;
            font-size: 28px;
            box-shadow: -2px 2px 10px rgba(0,0,0,0.3);
            user-select: none;
            pointer-events: auto;
        `;

        let startY = 0;
        let startTop = 0;
        let hasMoved = false;

        floatingButton.onmousedown = function(e) {
            e.preventDefault();
            e.stopPropagation();

            isDraggingFloat = false;
            hasMoved = false;
            startY = e.clientY;
            startTop = parseInt(window.getComputedStyle(floatingButton).top);

            window.onmousemove = function(moveEvent) {
                if (!hasMoved) {
                    hasMoved = true;
                }

                isDraggingFloat = true;
                const deltaY = moveEvent.clientY - startY;
                let newTop = startTop + deltaY;

                if (newTop < 0) newTop = 0;
                if (newTop > window.innerHeight - 50) newTop = window.innerHeight - 50;

                floatingButtonY = newTop;
                floatingButton.style.top = newTop + 'px';
            };

            window.onmouseup = function() {
                window.onmousemove = null;
                window.onmouseup = null;

                if (hasMoved) {
                    saveFloatingButtonPosition(floatingButtonY);
                }

                setTimeout(() => {
                    isDraggingFloat = false;
                }, 100);
            };
        };

        floatingButton.onmouseenter = function() {
            if (!isDraggingFloat) {
                this.style.transform = 'scale(1.1)';
            }
        };

        floatingButton.onmouseleave = function() {
            if (!isDraggingFloat) {
                this.style.transform = 'scale(1)';
            }
        };

        floatingButton.onclick = function(e) {
            if (!isDraggingFloat) {
                showPanelFromFloating();
            }
        };

        document.body.appendChild(floatingButton);
        console.log('[浮動按鈕] 按鈕已創建並添加到 DOM');
    }

    function showPanelFromFloating() {
        console.log('[浮動按鈕] 展開面板');
        if (floatingButton) {
            floatingButton.remove();
            floatingButton = null;
        }
        showDataUIFromCache();
    }

    function makeDraggable(element, handle) {
        const dragHandle = handle || element;
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            e.stopPropagation();

            pos3 = e.clientX;
            pos4 = e.clientY;

            window.onmouseup = closeDragElement;
            window.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // 計算新位置
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            
            // ⭐ 獲取面板和視窗尺寸
            const panelRect = element.getBoundingClientRect();
            const panelWidth = panelRect.width;
            const panelHeight = panelRect.height;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // ⭐ 上下邊界限制（完全不能移出）
            if (newTop < 0) {
                newTop = 0;
            }
            if (newTop + panelHeight > windowHeight) {
                newTop = windowHeight - panelHeight;
            }
            
            // ⭐ 左右邊界限制（允許 3/4 移出，保留 1/4）
            const minVisibleWidth = panelWidth * 0.25;
            const maxLeftOffset = windowWidth - minVisibleWidth;
            const minLeftOffset = -panelWidth + minVisibleWidth;
            
            if (newLeft > maxLeftOffset) {
                newLeft = maxLeftOffset;
            }
            if (newLeft < minLeftOffset) {
                newLeft = minLeftOffset;
            }
            
            // 套用新位置
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.right = 'auto';
            element.style.transform = 'none';
        }

        function closeDragElement() {
            window.onmouseup = null;
            window.onmousemove = null;
        }
    }

})();
                        