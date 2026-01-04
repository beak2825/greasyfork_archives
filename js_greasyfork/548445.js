// ==UserScript==
// @name         MEGA鏈接檢測器
// @name:zh-CN   MEGA链接检测器
// @name:zh-TW   MEGA鏈接檢測器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  檢測MEGA鏈接是否可用，並在旁邊顯示狀態。當URL變化時自動重新加載頁面。
// @description:zh-CN  检测MEGA链接是否可用，并在旁边显示状态。当URL变化时自动重新加载页面。
// @description:zh-TW  檢測MEGA鏈接是否可用，並在旁邊顯示狀態。當URL變化時自動重新加載頁面。
// @author       Mark
// @license      MIT
// @match        *://*/*
// @exclude      *://f95zone.to/*
// @exclude      *://www.google.com/*
// @exclude      *://mega.nz/*
// @grant        GM_xmlhttpRequest
// @connect      mega.nz
// @connect      mega.io
// @connect      g.api.mega.co.nz
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548445/MEGA%E9%8F%88%E6%8E%A5%E6%AA%A2%E6%B8%AC%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548445/MEGA%E9%8F%88%E6%8E%A5%E6%AA%A2%E6%B8%AC%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 開啟除錯模式
    const DEBUG = true;

    // 防止重複檢查的連結記錄
    const checkedLinks = new Set();

    // 檢查執行次數
    let executionCount = 0;

    // 存儲當前URL
    let currentURL = window.location.href;

    // 日誌函數
    function log(message, data) {
        if (!DEBUG) return;
        if (data) {
            console.log(`[MEGA檢測器] ${message}`, data);
        } else {
            console.log(`[MEGA檢測器] ${message}`);
        }
    }

    // 判斷是否為檔案連結
    function isFileLink(url) {
        return /mega\.[^/]+\/file\//i.test(url);
    }

    // 判斷是否為資料夾連結
    function isFolderLink(url) {
        // 主要以 /folder/ 判定，亦覆蓋舊格式及常見變體
        return /mega\.[^/]+\/folder\//i.test(url);
    }

    // 主函數 - 檢查MEGA連結
    function checkMEGALinks() {
        executionCount++;
        log(`開始檢查MEGA連結 (第${executionCount}次執行)`);

        // 尋找頁面中的所有連結
        const links = document.querySelectorAll('a');
        let megaLinksCount = 0;

        links.forEach(link => {
            const href = link.href;
            // 檢測是否為MEGA連結且尚未檢查過
            if (href && (href.includes('mega.nz') || href.includes('mega.io')) && !checkedLinks.has(href)) {
                checkedLinks.add(href); // 添加到已檢查集合
                megaLinksCount++;
                log(`發現MEGA連結: ${href}`);
                checkLinkStatus(link, href);
            }
        });

        log(`本次檢查發現 ${megaLinksCount} 個新MEGA連結`);
        return megaLinksCount;
    }

    // 檢查MEGA連結狀態
    function checkLinkStatus(linkElement, url) {
        // 創建狀態指示器
        const statusIndicator = document.createElement('span');
        statusIndicator.style.marginLeft = '5px';
        statusIndicator.style.padding = '2px 5px';
        statusIndicator.style.borderRadius = '3px';
        statusIndicator.style.fontSize = '12px';
        statusIndicator.textContent = '檢查中...';
        statusIndicator.style.backgroundColor = '#f0f0f0';
        statusIndicator.style.color = '#666';

        // 將狀態指示器添加到連結旁
        linkElement.parentNode.insertBefore(statusIndicator, linkElement.nextSibling);

        log(`正在檢查連結: ${url}`);

        // 根據連結類型，執行不同檢查邏輯
        if (isFileLink(url)) {
            // 檔案連結：透過 MEGA API 驗證
            const { fileID, fileKey } = extractMEGAInfo(url);

            if (!fileID) {
                log(`無法提取文件ID，URL格式可能不符合預期`);
                updateStatusIndicator(statusIndicator, false);
                return;
            }

            // 檢查是否有解密金鑰
            if (!fileKey) {
                log(`未提供解密金鑰，無法確認文件狀態`);
                updateStatusIndicator(statusIndicator, null, true);
                return;
            }

            log(`提取到的文件ID: ${fileID}, 密鑰: 有`);

            // 使用GM_xmlhttpRequest發送MEGA API請求
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://g.api.mega.co.nz/cs',
                data: JSON.stringify([{"a": "g", "g": 1, "p": fileID, "ssl": 0}]),
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000, // 10秒超時
                onload: function(response) {
                    log(`API回應狀態: ${response.status}`, response.responseText);

                    try {
                        // 嘗試解析JSON響應
                        const data = JSON.parse(response.responseText);
                        log(`解析API回應:`, data);

                        // 檢查回應結構
                        if (Array.isArray(data)) {
                            const first = data[0];

                            // -9: 資源不存在
                            if (first === -9) {
                                log(`文件不存在或已刪除 (錯誤碼: -9)`, data);
                                updateStatusIndicator(statusIndicator, false);
                                return;
                            }

                            // -11: 訪問被拒絕/需要金鑰
                            if (first === -11) {
                                log(`訪問被拒絕 (錯誤碼: -11)`, data);
                                // 標為未知/需要金鑰
                                updateStatusIndicator(statusIndicator, null, true);
                                return;
                            }

                            // 若回傳是一個物件且包含大小信息，通常代表存在
                            if (first && typeof first === 'object') {
                                // 常見欄位可能包含 's' 表示大小
                                if ('s' in first || 'size' in first) {
                                    log(`文件存在且可用，回傳資料含大小資訊`, first);
                                    updateStatusIndicator(statusIndicator, true);
                                    return;
                                }
                                // 若有其他可判斷的屬性也可視為有效
                                log(`API 回應為物件，未明確的大小欄位，但視為有效`, first);
                                updateStatusIndicator(statusIndicator, true);
                                return;
                            }

                            // 其他整數回傳值：錯誤代碼或未知狀態
                            if (typeof first === 'number' && first < 0) {
                                log(`API返回錯誤代碼: ${first}`, data);
                                updateStatusIndicator(statusIndicator, null);
                                return;
                            }

                            // 預設
                            log(`無法確定文件狀態`, data);
                            updateStatusIndicator(statusIndicator, null);
                            return;
                        }

                        // 非預期格式
                        log(`API回應格式異常`, data);
                        updateStatusIndicator(statusIndicator, null);
                    } catch (e) {
                        log(`JSON解析錯誤`, e);
                        updateStatusIndicator(statusIndicator, null);
                    }
                },
                onerror: function(error) {
                    log(`API請求出錯`, error);
                    updateStatusIndicator(statusIndicator, null);
                },
                ontimeout: function() {
                    log(`API請求超時`);
                    updateStatusIndicator(statusIndicator, null);
                }
            });

        } else if (isFolderLink(url)) {
            // 資料夾連結：先用網頁版 URL 嘗試取得狀態
            checkFolderLinkStatus(url, statusIndicator);
        } else {
            // 其他情況：不確定類型，標示未知
            log(`未知的連結類型，無法判斷`);
            updateStatusIndicator(statusIndicator, null);
        }
    }

    // 從MEGA URL中提取文件ID和密鑰
    function extractMEGAInfo(url) {
        log(`正在從URL提取MEGA信息: ${url}`);

        let fileID = null;
        let fileKey = null;

        // 版本變化的格式： https://mega.nz/file/FILEID#FILEKEY
        let match = url.match(/mega\.[a-z]+\/file\/([a-zA-Z0-9_-]+)(?:#([a-zA-Z0-9_-]+)|$|\?)/i);

        if (!match) {
            // 新版/資料夾格式： https://mega.nz/folder/FOLDERID#FOLDERKEY
            match = url.match(/mega\.[a-z]+\/folder\/([a-zA-Z0-9_-]+)(?:#([a-zA-Z0-9_-]+)|$|\?)/i);
        }

        if (!match) {
            // 舊版格式： https://mega.nz/#!FILEID!FILEKEY 或 https://mega.nz/#F!FOLDERID!FOLDERKEY
            match = url.match(/mega\.[a-z]+\/#(?:F|)!([a-zA-Z0-9_-]+)(?:!([a-zA-Z0-9_-]+)|$|\?)/i);
        }

        if (match) {
            fileID = match[1];
            fileKey = match[2];
        }

        return { fileID, fileKey };
    }

    // 檢查資料夾連結的網頁內容，決定是否可用
    function checkFolderLinkStatus(folderURL, statusIndicator) {
        log(`嘗試以網頁版 URL 檢查資料夾：${folderURL}`);

        GM_xmlhttpRequest({
            method: 'GET',
            url: folderURL,
            headers: {
                'User-Agent': navigator.userAgent
            },
            timeout: 10000,
            onload: function(response) {
                const text = response.responseText;
                log(`Folder頁面回傳狀態：${response.status}`);

                // 1) 檢查是否明確的錯誤訊息
                if (text && /File folder does not exist|Folder does not exist|該資料夾不存在/i.test(text)) {
                    log(`資料夾不存在的訊息已偵測到`);
                    updateStatusIndicator(statusIndicator, false);
                    return;
                }

                // 2) 解析 og:title / og:description
                let ogTitle = null;
                let ogDesc = null;
                try {
                    const mTitle = text.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
                    if (mTitle) ogTitle = mTitle[1];

                    const mDesc = text.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
                    if (mDesc) ogDesc = mDesc[1];

                    log(`og:title=${ogTitle}, og:description=${ogDesc}`);
                } catch (e) {
                    log(`解析 og:meta 失敗`, e);
                }

                // 新增的特定判定：當 og:title 為 "File folder on MEGA" 且 og:description 為空/null，直接判定為不可用
                const titleTrim = ogTitle ? ogTitle.trim() : '';
                const descTrim = ogDesc ? ogDesc.trim() : '';
                const isDefaultFolderTitle = titleTrim === 'File folder on MEGA';
                const isDescEmptyOrNull = !descTrim || descTrim.toLowerCase() === 'null';

                if (isDefaultFolderTitle && isDescEmptyOrNull) {
                    log('og:title 為預設資料夾標題且 og:description 為空，判定為不可用');
                    updateStatusIndicator(statusIndicator, false);
                    return;
                }

                // 3) 重要：若 og:title 含有大小字串，直接視為有效
                const titleHasSize = !!ogTitle && /\d+(?:\.\d+)?\s*(?:KB|MB|GB|TB|PB)/i.test(ogTitle);
                if (titleHasSize) {
                    log('og:title 包含大小，判定為可用');
                    updateStatusIndicator(statusIndicator, true);
                    return;
                }

                // 4) 判斷頁面是否包含資料夾內容的指標
                const hasFolderContent = /folder-content|file-item|folder-content/i.test(text);
                if (hasFolderContent) {
                    log('頁面包含資料夾內容結構，判定為可用');
                    updateStatusIndicator(statusIndicator, true);
                } else {
                    // 未找到明確結構，給未知/不可用的分支
                    const approx = /mega|folder|文件|檔案/i.test(text);
                    if (approx) {
                        log('頁面內容看起來像是資料夾頁面，但未找到明確內容結構，視為未知狀態');
                        updateStatusIndicator(statusIndicator, null);
                    } else {
                        log('頁面似乎不是有效的資料夾頁面，判定為不可用');
                        updateStatusIndicator(statusIndicator, false);
                    }
                }
            },
            onerror: function(error) {
                log(`資料夾頁面請求失敗`, error);
                updateStatusIndicator(statusIndicator, null);
            },
            ontimeout: function() {
                log(`資料夾頁面請求超時`);
                updateStatusIndicator(statusIndicator, null);
            }
        });
    }

    // 更新狀態指示器
    function updateStatusIndicator(indicator, isValid, needsDecryption = false) {
        // 傳入布林值表示可用/不可用；null 代表未知狀態
        if (isValid === true) {
            log(`設置狀態指示為可用`);
            indicator.textContent = '可用';
            indicator.style.backgroundColor = '#e6f7e6';
            indicator.style.color = '#2e8b57';
        } else if (isValid === false) {
            log(`設置狀態指示為已失效`);
            indicator.textContent = '已失效';
            indicator.style.backgroundColor = '#ffebee';
            indicator.style.color = '#d32f2f';
        } else {
            if (needsDecryption) {
                log(`設置狀態指示為需要解密金鑰`);
                indicator.textContent = '需要金鑰';
                indicator.style.backgroundColor = '#e3f2fd';
                indicator.style.color = '#1565c0';
            } else {
                log(`設置狀態指示為未知`);
                indicator.textContent = '未知';
                indicator.style.backgroundColor = '#fff9c4';
                indicator.style.color = '#ff8f00';
            }
        }

        // 添加懸停提示
        if (needsDecryption) {
            indicator.title = '此連結需要正確的解密金鑰才能訪問';
        } else if (isValid === null) {
            indicator.title = '無法確定連結狀態';
        }
    }

    // 監視DOM變化，檢測新添加的MEGA連結
    function setupMutationObserver() {
        log('設置DOM變化監視器');

        // 創建一個觀察器實例
        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;

            // 檢查是否有新增的節點
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
            });

            // 如果有新增節點，檢查MEGA連結
            if (shouldCheck) {
                log('檢測到DOM變化，檢查新的MEGA連結');
                checkMEGALinks();
            }
        });

        // 配置觀察選項
        const config = {
            childList: true,     // 觀察子節點的添加或刪除
            subtree: true        // 觀察所有後代節點
        };

        // 開始觀察document.body
        observer.observe(document.body, config);
        log('DOM變化監視器已設置');

        return observer;
    }

    // 監視URL變化並在檢測到MEGA連結時才刷新頁面
    function setupURLChangeMonitor() {
        const hasMegaLinks = () => {
            // 只掃描已有 DOM，不額外等待
            const links = document.querySelectorAll('a[href*="mega.nz"], a[href*="mega.io"]');
            return links.length > 0;
        };

        let lastURL = location.href;

        // 定期檢查 URL 是否變化
        setInterval(() => {
            const href = location.href;
            if (href !== lastURL) {
                // URL 改變了，先更新 lastURL，然後檢查是否有 MEGA 連結
                lastURL = href;

                // 給 SPA 一點點時間把新內容插入 DOM（很短，避免多餘等待）
                setTimeout(() => {
                    if (hasMegaLinks()) {
                        // 只有當頁面上偵測到 MEGA 連結時才刷新
                        location.reload();
                    } else {
                        // 無 MEGA 連結，不刷新
                        // console.debug('[MEGA檢測器] URL變化但無MEGA連結，略過刷新');
                    }
                }, 150);
            }
        }, 800);

        // 處理前進/後退：同樣只在偵測到 MEGA 連結時才刷新
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                if (hasMegaLinks()) {
                    location.reload();
                }
            }, 150);
        });
    }

    // 確保腳本在不同階段都能執行
    function initialize() {
        log('MEGA鏈接檢測器腳本初始化');

        // 設置URL變化監視器
        setupURLChangeMonitor();

        // 立即執行一次
        if (document.readyState === 'loading') {
            log('文檔仍在加載中，等待DOMContentLoaded事件');
            document.addEventListener('DOMContentLoaded', function() {
                log('DOMContentLoaded事件觸發');
                setTimeout(function() {
                    checkMEGALinks();
                    setupMutationObserver();
                }, 500);
            });
        } else {
            log('文檔已加載完成，直接執行檢查');
            setTimeout(function() {
                checkMEGALinks();
                setupMutationObserver();
            }, 500);
        }

        // 頁面完全加載後再執行一次
        window.addEventListener('load', function() {
            log('頁面完全加載事件觸發');
            setTimeout(function() {
                checkMEGALinks();
            }, 1000);
        });

        // 定期檢查，頻率降低
        setInterval(function() {
            log('定期檢查新的MEGA連結');
            checkMEGALinks();
        }, 30000); // 每30秒檢查一次
    }

    // 啟動腳本
    initialize();

    log('MEGA鏈接檢測器腳本已加載');
})();
