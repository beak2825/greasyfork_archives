// ==UserScript==
// @name         Supjav 訪問記錄管理器
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  記錄並標記已訪問的頁面，支援 Linkclump 批次開啟，排除番號腳本衝突
// @author       Claude AI
// @match        https://supjav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=supjav.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @homepage     https://greasyfork.org/zh-CN/scripts/553516
// @homepageURL  https://greasyfork.org/zh-CN/scripts/553516
// @supportURL   https://greasyfork.org/zh-CN/scripts/553516/feedback
// @downloadURL https://update.greasyfork.org/scripts/553516/Supjav%20%E8%A8%AA%E5%95%8F%E8%A8%98%E9%8C%84%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553516/Supjav%20%E8%A8%AA%E5%95%8F%E8%A8%98%E9%8C%84%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 設定區 ====================
    const CONFIG = {
        EXPIRY_DAYS: GM_getValue('expiryDays', 1000),
        COLOR_VISITED: '#72568D',
        COLOR_HOVER: '#5D4574',
        COLOR_SEARCH: '#000000',
        COLOR_SEARCH_HOVER: '#333333',
        STORAGE_KEY: 'visitedLinks',
        AUTO_CLEAN: false,
        STORAGE_LIMIT_MB: 5,
        WARNING_THRESHOLD: 0.8,
        FLOATING_ICON: '📊',
        BATCH_DELAY: 2000,
        BATCH_SIZE_LIMIT: 50,
        DEBUG_MODE: false,
    };

    const POSITION_KEY = 'supjav-floating-button-y';
    const DEFAULT_POSITION = 200;

    // 全域變數
    let floatingButton = null;
    let currentPanel = null;
    let floatingButtonY = DEFAULT_POSITION;
    let cssInjected = false;
    let isDarkMode = false;
    let isDraggingFloat = false;

    let tempVisitedCache = {};
    let batchQueue = new Set();
    let batchTimer = null;
    let lastRecordedURL = '';

    // ==================== 載入位置 ====================
    function loadFloatingButtonPosition() {
        floatingButtonY = GM_getValue(POSITION_KEY, DEFAULT_POSITION);
        console.log('[位置記憶] 載入位置:', floatingButtonY);
    }

    function saveFloatingButtonPosition(y) {
        GM_setValue(POSITION_KEY, y);
        console.log('[位置記憶] 儲存位置:', y);
    }

    loadFloatingButtonPosition();

    // ==================== 工具函式 ====================
    
    // v1.0.9 修改：排除番號腳本假連結
    function extractID(url) {
        // 排除番號腳本生成的假連結
        if (!url || 
            url === 'javascript:void(0)' || 
            url === '#' || 
            url.startsWith('javascript:')) {
            return null;
        }
        
        // 排除非內容頁
        const excludePatterns = [
            '/category/', '/page/', '?s=', '/tag/', 
            '/popular', '/actor/', '/studio/', '/series/'
        ];
        
        for (let pattern of excludePatterns) {
            if (url.includes(pattern)) {
                return null;
            }
        }
        
        // 排除首頁
        if (url.endsWith('/ja/') || url.endsWith('/ja') ||
            url.endsWith('supjav.com/') || url.endsWith('supjav.com')) {
            return null;
        }
        
        // 匹配內容頁格式
        let match = url.match(/\/(\d+)\.html/);
        let id = match ? match[1] : null;
        
        // 只在真正無法識別的格式時才警告
        if (!id && CONFIG.DEBUG_MODE && url.includes('supjav.com')) {
            console.warn(`[extractID] ⚠️ 未知格式: ${url}`);
        }
        
        return id;
    }

    function isSearchPage(url) {
        return url.includes('?s=');
    }

    function getDateString() {
        let now = new Date();
        return now.toISOString().split('T')[0];
    }

    function formatDate(timestamp) {
        let date = new Date(timestamp);
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatDateTime(timestamp) {
        let date = new Date(timestamp);
        return date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    function downloadFile(content, filename, type) {
        let blob = new Blob([content], {type: type});
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function getStorageSize() {
        let visited = getVisitedLinks();
        let jsonStr = JSON.stringify(visited);
        let sizeBytes = new Blob([jsonStr]).size;
        let sizeMB = sizeBytes / (1024 * 1024);
        return {
            bytes: sizeBytes,
            mb: sizeMB,
            percentage: (sizeMB / CONFIG.STORAGE_LIMIT_MB) * 100
        };
    }

    function checkStorageWarning() {
        let storage = getStorageSize();
        
        if (storage.percentage >= CONFIG.WARNING_THRESHOLD * 100) {
            let message = `⚠️ 儲存空間警告\n\n` +
                `已使用：${storage.mb.toFixed(2)} MB / ${CONFIG.STORAGE_LIMIT_MB} MB (${storage.percentage.toFixed(1)}%)\n` +
                `記錄數：${Object.keys(getVisitedLinks()).length} 筆\n\n` +
                `建議：\n` +
                `1. 匯出備份後清除舊記錄\n` +
                `2. 縮短保存期限\n` +
                `3. 清理過期記錄`;
            
            alert(message);
        }
    }

    // ==================== 資料管理 ====================

    function getVisitedLinks() {
        return GM_getValue(CONFIG.STORAGE_KEY, {});
    }

    function saveVisitedLinks(data) {
        try {
            GM_setValue(CONFIG.STORAGE_KEY, data);
            
            let saved = GM_getValue(CONFIG.STORAGE_KEY, null);
            
            if (saved === null) {
                throw new Error('寫入驗證失敗：無法讀取資料');
            }
            
            let savedCount = Object.keys(saved).length;
            let dataCount = Object.keys(data).length;
            
            if (savedCount !== dataCount) {
                throw new Error(`寫入驗證失敗：資料不完整 (${savedCount}/${dataCount})`);
            }
            
            return true;
            
        } catch (err) {
            console.error('[Supjav] 儲存失敗:', err);
            
            let storage = getStorageSize();
            let isFullStorage = storage.percentage >= 95;
            
            if (isFullStorage) {
                alert(
                    `❌ 儲存失敗！已達上限\n\n` +
                    `目前使用：${storage.mb.toFixed(2)} MB / ${CONFIG.STORAGE_LIMIT_MB} MB (${storage.percentage.toFixed(1)}%)\n` +
                    `記錄數：${Object.keys(data).length} 筆\n\n` +
                    `請立即處理：\n` +
                    `1. 匯出備份（📤 匯出 JSON）\n` +
                    `2. 清除舊記錄（🧹 清理過期）\n` +
                    `3. 或清空全部（🗑️ 清除全部）\n\n` +
                    `錯誤：${err.message}`
                );
            } else {
                alert(
                    `❌ 儲存失敗\n\n` +
                    `錯誤：${err.message}\n\n` +
                    `可能原因：\n` +
                    `• 瀏覽器權限問題\n` +
                    `• 油猴腳本異常\n` +
                    `• 資料格式錯誤\n\n` +
                    `建議：重新載入頁面後再試`
                );
            }
            
            return false;
        }
    }

    // ==================== 批次處理機制 ====================

    function recordVisitBatch(id) {
        if (!id) return;
        
        tempVisitedCache[id] = Date.now();
        batchQueue.add(id);
        
        console.log(`[Supjav] 已加入批次佇列: ${id} (佇列大小: ${batchQueue.size})`);
        
        if (batchQueue.size >= CONFIG.BATCH_SIZE_LIMIT) {
            console.log(`[Supjav] 佇列已達上限 (${CONFIG.BATCH_SIZE_LIMIT})，立即儲存`);
            clearTimeout(batchTimer);
            saveBatch();
            return;
        }
        
        if (batchTimer) {
            clearTimeout(batchTimer);
        }
        
        batchTimer = setTimeout(() => {
            saveBatch();
        }, CONFIG.BATCH_DELAY);
    }

    function saveBatch() {
        if (batchQueue.size === 0) return;
        
        console.log(`[Supjav] 批次儲存 ${batchQueue.size} 筆記錄`);
        
        let visited = getVisitedLinks();
        
        batchQueue.forEach(id => {
            visited[id] = tempVisitedCache[id];
        });
        
        let success = saveVisitedLinks(visited);
        
        if (success) {
            console.log(`[Supjav] 批次儲存成功`);
            batchQueue.clear();
            
            if (Object.keys(visited).length % 100 === 0) {
                checkStorageWarning();
            }
        } else {
            console.error(`[Supjav] 批次儲存失敗，保留佇列待重試`);
            setTimeout(() => {
                saveBatch();
            }, 5000);
        }
    }

    window.addEventListener('beforeunload', () => {
        if (batchQueue.size > 0) {
            console.log('[Supjav] 頁面關閉，強制儲存');
            saveBatch();
        }
    });

    function recordVisit(id) {
        recordVisitBatch(id);
    }

    function isVisited(id) {
        if (!id) return false;
        
        if (tempVisitedCache[id]) {
            return true;
        }
        
        let visited = getVisitedLinks();
        let timestamp = visited[id];
        
        if (!timestamp) return false;
        
        if (CONFIG.EXPIRY_DAYS <= 0) {
            return true;
        }
        
        let daysPassed = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
        if (daysPassed > CONFIG.EXPIRY_DAYS) {
            return false;
        }
        
        return true;
    }

    function cleanExpiredRecords() {
        if (CONFIG.EXPIRY_DAYS <= 0) {
            return 0;
        }
        
        let visited = getVisitedLinks();
        let now = Date.now();
        let cutoff = CONFIG.EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        let cleaned = 0;
        
        for (let id in visited) {
            if (now - visited[id] > cutoff) {
                delete visited[id];
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            saveVisitedLinks(visited);
            console.log(`[Supjav] 清理了 ${cleaned} 筆過期記錄`);
        }
        
        return cleaned;
    }

    // ==================== v1.0.9 修改：攔截 window.open（排除假連結）====================

    function setupWindowOpenInterceptor() {
        const originalOpen = window.open;
        
        window.open = function(url, target, features) {
            try {
                // 更嚴格的檢查：必須是內容頁格式
                if (url && 
                    typeof url === 'string' && 
                    url.includes('supjav.com') &&
                    url.match(/\/\d+\.html/)) {
                    
                    let id = extractID(url);
                    if (id) {
                        console.log(`[Supjav] 攔截 window.open: ${id}`);
                        recordVisitBatch(id);
                    }
                }
            } catch (err) {
                console.error('[Supjav] window.open 攔截錯誤:', err);
            }
            
            return originalOpen.call(this, url, target, features);
        };
        
        console.log('[Supjav] window.open 攔截已啟動（已排除番號腳本假連結）');
    }

    // ==================== 延遲重試記錄當前頁面 ====================

    function recordCurrentPageWithRetry(retryCount = 0) {
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 500;
        
        let currentURL = window.location.href;
        let currentID = extractID(currentURL);
        
        if (CONFIG.DEBUG_MODE) {
            if (currentURL.match(/\/\d+\.html/)) {
                console.log(`[記錄嘗試 ${retryCount + 1}] URL: ${currentURL}`);
                console.log(`[記錄嘗試 ${retryCount + 1}] 提取 ID: ${currentID || '失敗'}`);
            }
        }
        
        if (currentID) {
            recordVisitBatch(currentID);
            lastRecordedURL = window.location.href;
            console.log(`[Supjav] ✅ 記錄當前頁面: ${currentID}`);
            return true;
        }
        
        if (!currentURL.match(/\/\d+\.html/)) {
            return false;
        }
        
        if (retryCount < MAX_RETRIES) {
            console.warn(`[Supjav] ⚠️ 無法提取 ID，${RETRY_DELAY}ms 後重試 (${retryCount + 1}/${MAX_RETRIES})`);
            setTimeout(() => {
                recordCurrentPageWithRetry(retryCount + 1);
            }, RETRY_DELAY);
            return false;
        }
        
        console.error(`[Supjav] ❌ 重試失敗，無法記錄: ${window.location.href}`);
        return false;
    }

    // ==================== URL 監聽補記錄機制 ====================

    function setupURLMonitor() {
        let checkCount = 0;
        const MAX_INITIAL_CHECKS = 5;
        
        let initialCheck = setInterval(() => {
            checkCount++;
            
            let currentURL = window.location.href;
            let currentID = extractID(currentURL);
            
            if (currentID && !isVisited(currentID)) {
                console.log(`[Supjav] 🔄 URL 監聽補記錄: ${currentID}`);
                recordVisitBatch(currentID);
                lastRecordedURL = currentURL;
                applyColors();
            }
            
            if (checkCount >= MAX_INITIAL_CHECKS) {
                clearInterval(initialCheck);
                console.log('[Supjav] 初始密集檢查完成');
            }
        }, 1000);
        
        setInterval(() => {
            let currentURL = window.location.href;
            if (currentURL !== lastRecordedURL) {
                let id = extractID(currentURL);
                if (id) {
                    console.log(`[Supjav] 🔄 URL 變化檢測: ${id}`);
                    recordVisitBatch(id);
                    lastRecordedURL = currentURL;
                    applyColors();
                }
            }
        }, 3000);
        
        window.addEventListener('popstate', () => {
            let id = extractID(window.location.href);
            if (id) {
                console.log(`[Supjav] 🔄 瀏覽器歷史變化: ${id}`);
                recordVisitBatch(id);
                lastRecordedURL = window.location.href;
                applyColors();
            }
        });
        
        console.log('[Supjav] URL 監聽已啟動（含補記錄機制）');
    }

    // ==================== 匯出功能 ====================

    function exportJSON() {
        let visited = getVisitedLinks();
        let exportData = {
            version: "1.0.9",
            exportDate: new Date().toISOString(),
            expiryDays: CONFIG.EXPIRY_DAYS,
            totalCount: Object.keys(visited).length,
            data: visited
        };
        
        let json = JSON.stringify(exportData, null, 2);
        let filename = `supjav-visited-${getDateString()}.json`;
        downloadFile(json, filename, 'application/json');
        
        alert(`✅ 匯出成功！\n檔案：${filename}\n共 ${exportData.totalCount} 筆記錄`);
    }

    function exportTXT() {
        let visited = getVisitedLinks();
        let now = Date.now();
        
        let lines = [
            '# Supjav Visited Links Export',
            `# Export Date: ${formatDateTime(now)}`,
            `# Total: ${Object.keys(visited).length} links`,
            `# Expiry Days: ${CONFIG.EXPIRY_DAYS === 0 ? '永久' : CONFIG.EXPIRY_DAYS}`,
            '# Format: ID | Visit Date | Days Ago',
            ''
        ];
        
        let sorted = Object.entries(visited).sort((a, b) => b[1] - a[1]);
        
        for (let [id, timestamp] of sorted) {
            let date = formatDate(timestamp);
            let daysAgo = Math.floor((now - timestamp) / (1000 * 60 * 60 * 24));
            lines.push(`${id} | ${date} | ${daysAgo}天前`);
        }
        
        let txt = lines.join('\n');
        let filename = `supjav-visited-${getDateString()}.txt`;
        downloadFile(txt, filename, 'text/plain');
        
        alert(`✅ 匯出成功！\n檔案：${filename}\n共 ${Object.keys(visited).length} 筆記錄`);
    }

    // ==================== 匯入功能 ====================

    function showImportDialog() {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.txt';
        input.onchange = (e) => {
            let file = e.target.files[0];
            if (!file) return;
            
            if (file.name.endsWith('.json')) {
                importJSON(file);
            } else if (file.name.endsWith('.txt')) {
                importTXT(file);
            } else {
                alert('❌ 不支援的檔案格式！\n請選擇 .json 或 .txt 檔案');
            }
        };
        input.click();
    }

    function importJSON(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            try {
                let importData = JSON.parse(e.target.result);
                
                if (!importData.data || typeof importData.data !== 'object') {
                    throw new Error('無效的 JSON 格式：缺少 data 欄位');
                }
                
                let validData = {};
                let invalidCount = 0;
                
                for (let id in importData.data) {
                    if (!/^\d+$/.test(id)) {
                        console.warn(`跳過無效 ID: ${id}`);
                        invalidCount++;
                        continue;
                    }
                    
                    let timestamp = importData.data[id];
                    if (typeof timestamp !== 'number' || timestamp < 946684800000) {
                        console.warn(`跳過無效時間戳: ${id} (${timestamp})`);
                        invalidCount++;
                        continue;
                    }
                    
                    validData[id] = timestamp;
                }
                
                if (Object.keys(validData).length === 0) {
                    throw new Error('沒有找到有效的記錄');
                }
                
                let existing = getVisitedLinks();
                let existingCount = Object.keys(existing).length;
                let importCount = Object.keys(validData).length;
                
                let message = `📥 準備匯入記錄\n\n` +
                    `匯出版本：${importData.version || '未知'}\n` +
                    `匯出日期：${importData.exportDate || '未知'}\n` +
                    `匯入筆數：${importCount}\n` +
                    `現有筆數：${existingCount}\n`;
                
                if (invalidCount > 0) {
                    message += `跳過無效：${invalidCount}\n`;
                }
                
                message += `\n【確定】= 合併（保留兩邊記錄）\n【取消】= 覆蓋（清除現有記錄）`;
                
                let shouldMerge = confirm(message);
                
                if (shouldMerge) {
                    let merged = {...existing};
                    for (let id in validData) {
                        if (!merged[id] || validData[id] > merged[id]) {
                            merged[id] = validData[id];
                        }
                    }
                    let success = saveVisitedLinks(merged);
                    if (success) {
                        alert(`✅ 匯入成功（合併模式）\n\n總計：${Object.keys(merged).length} 筆記錄`);
                        checkStorageWarning();
                        updatePanelStats();
                    }
                } else {
                    let success = saveVisitedLinks(validData);
                    if (success) {
                        alert(`✅ 匯入成功（覆蓋模式）\n\n總計：${importCount} 筆記錄`);
                        checkStorageWarning();
                        updatePanelStats();
                    }
                }
                
            } catch (err) {
                alert(`❌ 匯入失敗\n\n${err.message}`);
                console.error('[Supjav] 匯入錯誤:', err);
            }
        };
        reader.readAsText(file);
    }

    function importTXT(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            try {
                let lines = e.target.result.split('\n');
                let imported = {};
                let invalidCount = 0;
                
                for (let line of lines) {
                    line = line.trim();
                    if (!line || line.startsWith('#')) continue;
                    
                    let match = line.match(/^(\d+)\s*\|\s*([^\|]+)/);
                    if (match) {
                        let id = match[1];
                        let dateStr = match[2].trim();
                        let timestamp = new Date(dateStr).getTime();
                        
                        if (isNaN(timestamp)) {
                            console.warn(`跳過無效日期: ${line}`);
                            invalidCount++;
                            continue;
                        }
                        
                        imported[id] = timestamp;
                    } else {
                        console.warn(`跳過無效行: ${line}`);
                        invalidCount++;
                    }
                }
                
                if (Object.keys(imported).length === 0) {
                    throw new Error('沒有找到有效的記錄');
                }
                
                let existing = getVisitedLinks();
                let existingCount = Object.keys(existing).length;
                let importCount = Object.keys(imported).length;
                
                let message = `📥 準備匯入記錄\n\n` +
                    `匯入筆數：${importCount}\n` +
                    `現有筆數：${existingCount}\n`;
                
                if (invalidCount > 0) {
                    message += `跳過無效：${invalidCount}\n`;
                }
                
                message += `\n【確定】= 合併\n【取消】= 覆蓋`;
                
                let shouldMerge = confirm(message);
                
                if (shouldMerge) {
                    let merged = {...existing};
                    for (let id in imported) {
                        if (!merged[id] || imported[id] > merged[id]) {
                            merged[id] = imported[id];
                        }
                    }
                    let success = saveVisitedLinks(merged);
                    if (success) {
                        alert(`✅ 匯入成功（合併模式）\n\n總計：${Object.keys(merged).length} 筆記錄`);
                        checkStorageWarning();
                        updatePanelStats();
                    }
                } else {
                    let success = saveVisitedLinks(imported);
                    if (success) {
                        alert(`✅ 匯入成功（覆蓋模式）\n\n總計：${importCount} 筆記錄`);
                        checkStorageWarning();
                        updatePanelStats();
                    }
                }
                
            } catch (err) {
                alert(`❌ 匯入失敗\n\n${err.message}`);
                console.error('[Supjav] 匯入錯誤:', err);
            }
        };
        reader.readAsText(file);
    }

    // ==================== 統計功能 ====================

    function showStats() {
        let visited = getVisitedLinks();
        let count = Object.keys(visited).length;
        
        if (count === 0) {
            alert('📊 訪問記錄統計\n\n目前沒有任何記錄');
            return;
        }
        
        let timestamps = Object.values(visited);
        let oldest = new Date(Math.min(...timestamps));
        let newest = new Date(Math.max(...timestamps));
        let now = Date.now();
        
        let expiringSoon = 0;
        let expired = 0;
        
        if (CONFIG.EXPIRY_DAYS > 0) {
            for (let id in visited) {
                let age = (now - visited[id]) / (1000 * 60 * 60 * 24);
                if (age > CONFIG.EXPIRY_DAYS) {
                    expired++;
                } else if (age > CONFIG.EXPIRY_DAYS - 30) {
                    expiringSoon++;
                }
            }
        }
        
        let storage = getStorageSize();
        
        let batchInfo = '';
        if (batchQueue.size > 0) {
            batchInfo = `\n⏳ 待儲存：${batchQueue.size} 筆\n`;
        }
        
        let message = `📊 訪問記錄統計\n\n` +
            `總計：${count.toLocaleString()} 筆\n` +
            `最舊記錄：${oldest.toLocaleDateString('zh-TW')} (${Math.floor((now - oldest) / (1000*60*60*24))} 天前)\n` +
            `最新記錄：${newest.toLocaleDateString('zh-TW')} (${Math.floor((now - newest) / (1000*60*60*24))} 天前)\n` +
            batchInfo +
            `\n📦 儲存空間\n` +
            `已使用：${storage.mb.toFixed(2)} MB / ${CONFIG.STORAGE_LIMIT_MB} MB (${storage.percentage.toFixed(1)}%)\n` +
            `\n⏰ 保存期限：${CONFIG.EXPIRY_DAYS === 0 ? '永久保存' : CONFIG.EXPIRY_DAYS + ' 天'}\n`;
        
        if (CONFIG.EXPIRY_DAYS > 0) {
            if (expired > 0) {
                message += `已過期：${expired} 筆（可清理）\n`;
            }
            
            if (expiringSoon > 0) {
                message += `即將過期：${expiringSoon} 筆（30天內）\n`;
            }
        }
        
        alert(message);
    }

    function clearAllData() {
        let visited = getVisitedLinks();
        let count = Object.keys(visited).length;
        
        if (count === 0) {
            alert('目前沒有任何記錄');
            return;
        }
        
        if (confirm(`⚠️ 確定要清除所有記錄嗎？\n\n這將刪除 ${count} 筆記錄\n此操作無法復原！`)) {
            saveVisitedLinks({});
            tempVisitedCache = {};
            batchQueue.clear();
            alert('✅ 已清除所有記錄');
            updatePanelStats();
        }
    }

    function showSettingsDialog() {
        let currentDays = CONFIG.EXPIRY_DAYS;
        let input = prompt(
            `⚙️ 設定保存期限\n\n` +
            `目前設定：${currentDays === 0 ? '永久保存' : currentDays + ' 天'}\n\n` +
            `請輸入天數（1-9999）\n` +
            `輸入 0 = 永久保存\n` +
            `輸入 -1 = 取消`,
            currentDays
        );
        
        if (input === null || input === '-1') {
            return;
        }
        
        let days = parseInt(input);
        
        if (isNaN(days) || days < 0 || days > 9999) {
            alert('❌ 無效的天數！\n請輸入 0-9999 之間的數字');
            return;
        }
        
        GM_setValue('expiryDays', days);
        CONFIG.EXPIRY_DAYS = days;
        
        alert(`✅ 設定已更新\n\n保存期限：${days === 0 ? '永久保存' : days + ' 天'}`);
        updatePanelStats();
    }

    // ==================== 顏色標記 ====================

    function applyColors() {
        let links = document.querySelectorAll('a[href*="supjav.com"]');
        let marked = 0;
        
        links.forEach(link => {
            let url = link.href;
            let id = extractID(url);
            
            if (id && isVisited(id)) {
                if (isSearchPage(url)) {
                    link.style.setProperty('color', CONFIG.COLOR_SEARCH, 'important');
                    link.addEventListener('mouseenter', function() {
                        this.style.setProperty('color', CONFIG.COLOR_SEARCH_HOVER, 'important');
                    });
                    link.addEventListener('mouseleave', function() {
                        this.style.setProperty('color', CONFIG.COLOR_SEARCH, 'important');
                    });
                } else {
                    link.style.setProperty('color', CONFIG.COLOR_VISITED, 'important');
                    link.addEventListener('mouseenter', function() {
                        this.style.setProperty('color', CONFIG.COLOR_HOVER, 'important');
                    });
                    link.addEventListener('mouseleave', function() {
                        this.style.setProperty('color', CONFIG.COLOR_VISITED, 'important');
                    });
                }
                marked++;
            }
        });
        
        if (marked > 0) {
            console.log(`[Supjav] 標記了 ${marked} 個已訪問連結`);
        }
    }

    function setupClickListener() {
        document.addEventListener('click', (e) => {
            let link = e.target.closest('a');
            if (!link) return;
            
            let url = link.href;
            if (!url || !url.includes('supjav.com')) return;
            
            let id = extractID(url);
            if (id) {
                                console.log(`[Supjav] 左鍵點擊: ${id}`);
                recordVisit(id);
            }
        });
        
        document.addEventListener('auxclick', (e) => {
            if (e.button !== 1) return;
            
            let link = e.target.closest('a');
            if (!link) return;
            
            let url = link.href;
            if (!url || !url.includes('supjav.com')) return;
            
            let id = extractID(url);
            if (id) {
                console.log(`[Supjav] 中鍵點擊: ${id}`);
                recordVisit(id);
            }
        });
        
        document.addEventListener('mousedown', (e) => {
            if (!(e.button === 0 && e.ctrlKey)) return;
            
            let link = e.target.closest('a');
            if (!link) return;
            
            let url = link.href;
            if (!url || !url.includes('supjav.com')) return;
            
            let id = extractID(url);
            if (id) {
                console.log(`[Supjav] Ctrl+左鍵: ${id}`);
                recordVisit(id);
            }
        });
        
        console.log('[Supjav] 點擊監聽已啟動（左鍵 + 中鍵 + Ctrl+點擊）');
    }

    function setupMutationObserver() {
        let observer = new MutationObserver((mutations) => {
            let hasNewLinks = false;
            for (let mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    hasNewLinks = true;
                    break;
                }
            }
            
            if (hasNewLinks) {
                applyColors();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[Supjav] 動態內容監聽已啟動');
    }

    function createFloatingButton() {
        if (floatingButton) {
            console.log('[浮動按鈕] 按鈕已存在，跳過創建');
            return;
        }

        console.log('[浮動按鈕] 開始創建按鈕，位置:', floatingButtonY);

        floatingButton = document.createElement('div');
        floatingButton.id = 'supjav-floating-button';
        floatingButton.innerHTML = CONFIG.FLOATING_ICON;
        floatingButton.style.cssText = `
            position: fixed;
            left: 0;
            top: ${floatingButtonY}px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 0 50% 50% 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: move;
            z-index: 999999;
            font-size: 28px;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
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

        createControlPanel();
    }

    function createControlPanel() {
        GM_addStyle(`
            #supjav-panel {
                position: fixed;
                width: 320px;
                background: #2c2c2c;
                color: #fff;
                border-radius: 8px;
                box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
                z-index: 999998;
                font-family: Arial, "Microsoft YaHei", sans-serif;
                font-size: 14px;
            }
            
            #supjav-panel-header {
                padding: 15px;
                background: #72568D;
                border-radius: 8px 8px 0 0;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            #supjav-panel-stats {
                padding: 15px;
                border-bottom: 1px solid #444;
            }
            
            #supjav-panel-stats div {
                margin: 5px 0;
                font-size: 13px;
            }
            
            #supjav-panel-storage {
                padding: 10px 15px;
                background: #333;
                border-bottom: 1px solid #444;
                font-size: 12px;
            }
            
            #supjav-storage-bar {
                width: 100%;
                height: 8px;
                background: #555;
                border-radius: 4px;
                margin-top: 5px;
                overflow: hidden;
            }
            
            #supjav-storage-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #FFC107, #F44336);
                transition: width 0.3s ease;
            }
            
            #supjav-panel-buttons {
                padding: 10px;
            }
            
            .supjav-btn {
                display: block;
                width: 100%;
                padding: 10px;
                margin: 5px 0;
                background: #444;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                transition: background 0.2s;
            }
            
            .supjav-btn:hover {
                background: #555;
            }
            
            .supjav-btn.primary {
                background: #72568D;
            }
            
            .supjav-btn.primary:hover {
                background: #5D4574;
            }
            
            .supjav-btn.danger {
                background: #d9534f;
            }
            
            .supjav-btn.danger:hover {
                background: #c9302c;
            }
            
            #supjav-panel-footer {
                padding: 10px;
                text-align: center;
                font-size: 11px;
                color: #888;
                border-top: 1px solid #444;
            }

            #hide-panel-btn {
                background: #66bb6a;
                border: none;
                border-radius: 4px;
                width: 24px;
                height: 24px;
                cursor: pointer;
                color: white;
                font-size: 14px;
                line-height: 1;
            }

            #hide-panel-btn:hover {
                background: #5da961;
            }
        `);
        
        let panel = document.createElement('div');
        panel.id = 'supjav-panel';
        
        const panelHeight = 600;
        const windowHeight = window.innerHeight;
        const margin = 20;
        
        let topPosition;
        
        if (floatingButtonY + panelHeight + margin > windowHeight) {
            topPosition = Math.max(margin, windowHeight - panelHeight - margin);
            console.log(`[面板定位] 底部空間不足，調整至: ${topPosition}px`);
        } else {
            topPosition = floatingButtonY;
            console.log(`[面板定位] 對齊浮動按鈕: ${topPosition}px`);
        }
        
        const leftPosition = 12;
        console.log(`[面板定位] 固定距離左側: ${leftPosition}px`);

        panel.style.left = `${leftPosition}px`;
        panel.style.top = `${topPosition}px`;
        
        panel.innerHTML = `
            <div id="supjav-panel-header">
                <span>Supjav 訪問記錄</span>
                <button id="hide-panel-btn" title="收納">◀</button>
            </div>
            <div id="supjav-panel-stats">
                <div>📊 已記錄：<span id="supjav-count">載入中...</span></div>
                <div>📅 保存期限：<span id="supjav-expiry">載入中...</span></div>
                <div>🕐 最後更新：<span id="supjav-lastupdate">剛剛</span></div>
            </div>
            <div id="supjav-panel-storage">
                <div>💾 儲存空間：<span id="supjav-storage-text">計算中...</span></div>
                <div id="supjav-storage-bar">
                    <div id="supjav-storage-fill" style="width: 0%"></div>
                </div>
            </div>
            <div id="supjav-panel-buttons">
                <button class="supjav-btn primary" id="supjav-btn-stats">📊 詳細統計</button>
                <button class="supjav-btn" id="supjav-btn-export-json">📤 匯出 JSON</button>
                <button class="supjav-btn" id="supjav-btn-export-txt">📤 匯出 TXT</button>
                <button class="supjav-btn" id="supjav-btn-import">📥 匯入檔案</button>
                <button class="supjav-btn" id="supjav-btn-settings">⚙️ 設定期限</button>
                <button class="supjav-btn" id="supjav-btn-clean">🧹 清理過期</button>
                <button class="supjav-btn danger" id="supjav-btn-clear">🗑️ 清除全部</button>
            </div>
            <div id="supjav-panel-footer">
                v1.0.9 | by Claude AI
            </div>
        `;
        
        document.body.appendChild(panel);
        currentPanel = panel;
        setupPanelEvents(panel);
        updatePanelStats();
        
        console.log('[Supjav] 控制面板已創建');
    }

    function setupPanelEvents(panel) {
        const hideBtn = panel.querySelector('#hide-panel-btn');
        hideBtn.addEventListener('click', () => {
            panel.remove();
            currentPanel = null;
            createFloatingButton();
        });
        
        panel.querySelector('#supjav-btn-stats').addEventListener('click', showStats);
        panel.querySelector('#supjav-btn-export-json').addEventListener('click', exportJSON);
        panel.querySelector('#supjav-btn-export-txt').addEventListener('click', exportTXT);
        panel.querySelector('#supjav-btn-import').addEventListener('click', showImportDialog);
        panel.querySelector('#supjav-btn-settings').addEventListener('click', showSettingsDialog);
        panel.querySelector('#supjav-btn-clean').addEventListener('click', () => {
            if (CONFIG.EXPIRY_DAYS === 0) {
                alert('目前設定為永久保存，無法清理過期記錄');
                return;
            }
            let cleaned = cleanExpiredRecords();
            if (cleaned > 0) {
                alert(`✅ 清理完成！\n\n已刪除 ${cleaned} 筆過期記錄`);
                updatePanelStats();
            } else {
                alert('目前沒有過期記錄');
            }
        });
        panel.querySelector('#supjav-btn-clear').addEventListener('click', clearAllData);
    }

    function updatePanelStats() {
        let visited = getVisitedLinks();
        let count = Object.keys(visited).length;
        
        let totalCount = count;
        if (batchQueue.size > 0) {
            totalCount += batchQueue.size;
        }
        
        let countEl = document.getElementById('supjav-count');
        if (countEl) {
            if (batchQueue.size > 0) {
                countEl.textContent = `${count.toLocaleString()} 筆 (+${batchQueue.size} 待儲存)`;
            } else {
                countEl.textContent = count.toLocaleString() + ' 筆';
            }
        }
        
        let expiryEl = document.getElementById('supjav-expiry');
        if (expiryEl) {
            expiryEl.textContent = CONFIG.EXPIRY_DAYS === 0 ? '永久' : CONFIG.EXPIRY_DAYS + ' 天';
        }
        
        let updateEl = document.getElementById('supjav-lastupdate');
        if (updateEl) {
            updateEl.textContent = '剛剛';
        }
        
        let storage = getStorageSize();
        let storageTextEl = document.getElementById('supjav-storage-text');
        let storageFillEl = document.getElementById('supjav-storage-fill');
        
        if (storageTextEl) {
            storageTextEl.textContent = `${storage.mb.toFixed(2)} MB / ${CONFIG.STORAGE_LIMIT_MB} MB (${storage.percentage.toFixed(1)}%)`;
        }
        
        if (storageFillEl) {
            storageFillEl.style.width = Math.min(storage.percentage, 100) + '%';
        }
    }

    function registerMenuCommands() {
        GM_registerMenuCommand('📊 查看統計', showStats);
        GM_registerMenuCommand('📤 匯出 JSON', exportJSON);
        GM_registerMenuCommand('📤 匯出 TXT', exportTXT);
        GM_registerMenuCommand('📥 匯入檔案', showImportDialog);
        GM_registerMenuCommand('⚙️ 設定期限', showSettingsDialog);
        GM_registerMenuCommand('🧹 清理過期記錄', () => {
            if (CONFIG.EXPIRY_DAYS === 0) {
                alert('目前設定為永久保存，無法清理過期記錄');
                return;
            }
            let cleaned = cleanExpiredRecords();
            if (cleaned > 0) {
                alert(`✅ 清理完成！\n\n已刪除 ${cleaned} 筆過期記錄`);
            } else {
                alert('目前沒有過期記錄');
            }
        });
        GM_registerMenuCommand('🗑️ 清除全部記錄', clearAllData);
        GM_registerMenuCommand('📍 重置浮動按鈕位置', () => {
            GM_setValue(POSITION_KEY, DEFAULT_POSITION);
            floatingButtonY = DEFAULT_POSITION;
            alert(`✅ 已重置浮動按鈕位置為: ${DEFAULT_POSITION}px\n請收納面板以套用`);
            console.log('[位置記憶] 位置已重置');
        });
        GM_registerMenuCommand('💾 立即儲存批次佇列', () => {
            if (batchQueue.size === 0) {
                alert('目前沒有待儲存的記錄');
                return;
            }
            let size = batchQueue.size;
            saveBatch();
            alert(`✅ 已儲存 ${size} 筆記錄`);
        });
        
        console.log('[Supjav] 右鍵選單已註冊');
    }

    function init() {
        console.log('[Supjav] 訪問記錄管理器 v1.0.9 啟動中...');
        
        setupWindowOpenInterceptor();
        
        CONFIG.EXPIRY_DAYS = GM_getValue('expiryDays', 1000);
        
        if (CONFIG.AUTO_CLEAN && CONFIG.EXPIRY_DAYS > 0) {
            cleanExpiredRecords();
        }
        
        recordCurrentPageWithRetry();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupAfterDOM);
        } else {
            setupAfterDOM();
        }
        
        createFloatingButton();
        registerMenuCommands();
        
        console.log('[Supjav] 訪問記錄管理器已啟動');
    }

    function setupAfterDOM() {
        console.log('[Supjav] DOM 已載入，開始設定監聽...');
        
        let currentID = extractID(window.location.href);
        if (currentID && !isVisited(currentID)) {
            console.log(`[Supjav] 🔄 DOM 載入後補記錄: ${currentID}`);
            recordVisitBatch(currentID);
        }
        
        applyColors();
        setupClickListener();
        setupMutationObserver();
        setupURLMonitor();
        
        console.log('[Supjav] DOM 監聽已啟動');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();