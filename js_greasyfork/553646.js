// ==UserScript==
// @name         Twitter User ID Extractor & Manager (V7.2 - Name + Filter + UI Cleaned)
// @namespace    http://tampermonkey.net/
// @version      7.2
// @description  API_TARGETS 修正。
// @author       sneer8964 (由 Google Gemini 輔助生成)
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/553646/Twitter%20User%20ID%20Extractor%20%20Manager%20%28V72%20-%20Name%20%2B%20Filter%20%2B%20UI%20Cleaned%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553646/Twitter%20User%20ID%20Extractor%20%20Manager%20%28V72%20-%20Name%20%2B%20Filter%20%2B%20UI%20Cleaned%29.meta.js
// ==/UserScript==

(function() {
    'use'
    'use strict';

    // --- 設定 ---
    const API_TARGETS = ['/UserByScreenName'];
    const STORAGE_KEY = 'twitterUserIDs';
    const MAX_RECORDS = 500; 
    
    // --- 數據存儲和輔助函數 ---
    function loadData() {
        try {
            const data = GM_getValue(STORAGE_KEY, '[]');
            return JSON.parse(data);
        } catch (e) {
            console.error('Tampermonkey: 無法載入或解析儲存的 ID 數據', e);
            return [];
        }
    }

    function saveData(data) {
        if (data.length > MAX_RECORDS) {
            data = data.slice(data.length - MAX_RECORDS);
        }
        GM_setValue(STORAGE_KEY, JSON.stringify(data));
    }

    function addRecord(record) {
        const records = loadData();
        const exists = records.some(r => r.numericUserID === record.numericUserID);
        
        if (!exists) {
            records.push({
                ...record,
                timestamp: new Date().toISOString()
            });
            saveData(records);
        } else {
            const existingRecord = records.find(r => r.numericUserID === record.numericUserID);
            if (existingRecord) {
                 existingRecord.avatarUrl = record.avatarUrl || existingRecord.avatarUrl;
                 existingRecord.name = record.name || existingRecord.name;
                 existingRecord.timestamp = new Date().toISOString(); 
                 saveData(records);
            }
        }
    }


    // --- API 數據解析器 ---
    function processApiResponse(responseText) {
        try {
            const json = JSON.parse(responseText);
            const records = [];

            const extractUser = (userResult) => {
                if (!userResult) return null;
                const numericUserID = userResult.rest_id || userResult.id_str || userResult.id ? String(userResult.rest_id || userResult.id_str || userResult.id) : null;
                const username = userResult.screen_name || userResult.core?.screen_name;
                const name = userResult.name || userResult.core?.name || '';
                
                let avatarUrl = userResult.avatar?.image_url || userResult.profile_image_url_https;
                if (avatarUrl && (avatarUrl.includes('_normal') || avatarUrl.includes('_bigger'))) {
                    avatarUrl = avatarUrl.replace(/_normal|_bigger/, '_400x400'); 
                }

                if (numericUserID && username) {
                    return { numericUserID, username, name, avatarUrl: avatarUrl || '' };
                }
                return null;
            };


            let userRecord = extractUser(json.data?.user?.result);
            if (userRecord) records.push(userRecord);
            
            let tweetUserRecord = extractUser(json.data?.tweetResult?.result?.core?.user_results?.result);
            if (tweetUserRecord) records.push(tweetUserRecord);

            const usersFromIncludes = json.includes?.users || [];
            const globalObjectsUsers = json.globalObjects?.users ? Object.values(json.globalObjects.users) : [];
            
            const findUsersRecursively = (obj) => {
                const foundUsers = [];
                if (typeof obj !== 'object' || obj === null) return [];
                if (obj.rest_id && obj.core?.screen_name) foundUsers.push(obj);
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        foundUsers.push(...findUsersRecursively(obj[key]));
                    }
                }
                return foundUsers;
            };

            const usersFromEntries = findUsersRecursively(json.data);
            const allUsers = [...usersFromIncludes, ...globalObjectsUsers, ...usersFromEntries];
            
            allUsers.forEach(user => {
                const userRecord = extractUser(user);
                if (userRecord) records.push(userRecord);
            });
            
            records.forEach(addRecord);
            
            if (records.length > 0 && window.updateManagerButtonCount) {
                window.updateManagerButtonCount();
            }

        } catch (e) {
             // 忽略
        }
    }
    
    // XHR 攔截器 
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url; 
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        const url = this._url;
        const isTarget = API_TARGETS.some(target => url && url.includes(target));

        if (isTarget) {
            this.addEventListener('load', function() {
                if (this.readyState === 4 && this.status === 200) {
                    if (this.getResponseHeader('content-type') && this.getResponseHeader('content-type').includes('application/json')) {
                        processApiResponse(this.responseText);
                    }
                }
            });
        }
        return originalSend.apply(this, arguments);
    };


    // --- UI 函數 ---

    function generateManagerHTML(data) {
        
        const sortedData = data.reverse(); 
        
        // 1. 篩選欄位 HTML 
        const filterControlHTML = `
            <div id="tm-filter-control" style="margin-bottom: 20px; padding: 12px 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
                <span style="color: #666; font-weight: 500; display: block; margin-bottom: 8px;">
                    🔎 **依 暱稱 (Name)、Username 或 ID 篩選：**
                </span>
                <input type="text" id="tm-filter-input" placeholder="輸入暱稱、Username 或Twitter ID 進行即時篩選..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 15px; color: #333;">
            </div>
        `;

        // 2. 數據表行
        let tableRowsHTML = '';
        sortedData.forEach(record => {
            const avatarHtml = record.avatarUrl 
                ? `<div style="display: flex; justify-content: center; align-items: center; height: 100px; padding: 5px;"><img src="${record.avatarUrl}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" alt="${record.name} Avatar"></div>` 
                : 'N/A';
            
            const name = record.name || 'N/A'; 
            const numericID = record.numericUserID;
            const username = `@${record.username}`;

            // 鎖定輸入框樣式
            const inputStyle = "width: 100%; padding: 8px 0; border: none; background: white; text-align: center; font-size: 14px; font-weight: 500; cursor: text; border-radius: 4px; transition: background-color 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
            const nameInput = `<input type="text" value="${name}" readonly class="tm-copy-input tm-name-input" style="${inputStyle} font-weight: bold; color: #000;">`; 
            const usernameInput = `<input type="text" value="${username}" readonly class="tm-copy-input tm-username-input" style="${inputStyle} color: #1DA1F2;">`;
            const idInput = `<input type="text" value="${numericID}" readonly class="tm-copy-input tm-id-input" style="${inputStyle}">`;


            tableRowsHTML += `
                <tr data-name="${name.toLowerCase()}" data-username="${record.username.toLowerCase()}" data-id="${numericID}">
                    <td style="text-align: center; vertical-align: middle;">${avatarHtml}</td>
                    <td style="vertical-align: middle;">${nameInput}</td>       
                    <td style="vertical-align: middle;">${usernameInput}</td>
                    <td style="vertical-align: middle;">${idInput}</td>
                    <td style="vertical-align: middle; font-size: 13px; color: #666;">${new Date(record.timestamp).toLocaleString()}</td>
                </tr>
            `;
        });

        const tableHTML = `
            <table id="tm-user-table">
                <thead>
                    <tr>
                        <th style="width: 100px; border-top-left-radius: 8px;">頭像</th>
                        <th style="width: 25%;">暱稱 (Name)</th>              
                        <th style="width: 25%;">Username</th>
                        <th style="width: 25%;">Twitter ID</th>
                        <th style="border-top-right-radius: 8px;">收集時間</th>
                    </tr>
                </thead>
                <tbody id="tm-table-body">
                    ${tableRowsHTML}
                </tbody>
            </table>
        `;
        
        // 綠框提示文字
        const controlsHTML = `
            <div id="tm-controls-panel" style="margin-bottom: 20px; padding: 10px; background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; border-radius: 4px; font-weight: 500; text-align: center;">
                <span>✅ **單擊欄位即可自動全選**，然後按 Ctrl+C/Cmd+C 複製。</span>
            </div>
        `;
        
        // 完整的 Manager 內容
        const managerContent = `
            <div id="tm-manager-container" style="
                position: fixed; 
                top: 0; left: 0; right: 0; bottom: 0; 
                background-color: rgba(0, 0, 0, 0.7); 
                z-index: 10000; 
                display: flex; 
                justify-content: center; 
                align-items: center;
                backdrop-filter: blur(5px);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            ">
                <div id="tm-manager-content" style="
                    background-color: #eef2f7; 
                    padding: 30px; 
                    border-radius: 12px; 
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    max-width: 90%;
                    max-height: 90%;
                    overflow-y: auto;
                    width: 1000px;
                ">
                    <h2 style="
                        color: #1DA1F2; 
                        margin-bottom: 25px; 
                        border-bottom: 2px solid #1DA1F2;
                        padding-bottom: 10px;
                    ">
                        Twitter User ID 管理器 (共 ${data.length} 筆)
                        <button id="tm-close-btn" style="
                            float: right; 
                            background: none; 
                            border: none; 
                            font-size: 24px; 
                            color: #888; 
                            cursor: pointer;
                        ">
                            &times;
                        </button>
                    </h2>
                    ${controlsHTML}
                    ${filterControlHTML}
                    <div id="tm-data-table-container" style="max-height: 60vh; overflow-y: auto;">
                        ${tableHTML}
                    </div>
                </div>
            </div>
        `;

        return managerContent;
    }


    // --- 腳本事件綁定 ---
    function bindManagerEvents() {
        // 1. 關閉按鈕
        document.getElementById('tm-close-btn').addEventListener('click', () => {
            document.getElementById('tm-manager-container').remove();
        });

        // 2. 單擊全選功能 
        document.querySelectorAll('.tm-copy-input').forEach(input => {
            input.addEventListener('click', function() {
                this.select();
            });
            input.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#f0f8ff';
            });
            input.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'white';
            });
        });

        // 3. 實時篩選功能 
        const filterInput = document.getElementById('tm-filter-input');
        const tableBody = document.getElementById('tm-table-body');
        const rows = tableBody.querySelectorAll('tr');

        filterInput.addEventListener('input', function() {
            const filterText = this.value.trim().toLowerCase();
            
            rows.forEach(row => {
                const name = row.getAttribute('data-name') || ''; 
                const username = row.getAttribute('data-username');
                const id = row.getAttribute('data-id');
                
                if (name.includes(filterText) || username.includes(filterText) || id.includes(filterText)) {
                    row.style.display = ''; 
                } else {
                    row.style.display = 'none'; 
                }
            });
        });
    }

    // --- 主執行邏輯 ---
    function createPageControls() {
         GM_addStyle(`
            /* 頁面按鈕 CSS */
            #tampermonkey-controls-container {
                position: fixed;
                top: 50px;
                right: 20px;
                display: flex;
                gap: 10px;
                z-index: 9999;
            }
            .tm-control-btn {
                background-color: #1DA1F2;
                color: white;
                border: none;
                padding: 8px 15px;
                cursor: pointer;
                border-radius: 9999px;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .tm-control-btn.clear {
                background-color: #E0245E; 
            }
            
            /* Overlay Manager 樣式 */
            #tm-user-table { 
                width: 100%; 
                border-collapse: separate; 
                border-spacing: 0;
                font-size: 14px; 
                background-color: white; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
                border-radius: 8px; 
            }
            #tm-user-table th, #tm-user-table td { 
                border: none;
                border-bottom: 1px solid #eee; 
                padding: 15px 12px; 
            }
            /* V7.1 修正：標題置中 */
            #tm-user-table th { 
                background-color: #f5f8fa; 
                font-weight: 600;
                color: #333;
                text-align: center; /* 所有標題置中 */
            }
            #tm-user-table td {
                text-align: center; /* 表格內容置中 (輸入框內容本身已置中) */
            }
            /* 讓輸入框的文字不會換行，保持單行顯示 */
            .tm-copy-input {
                white-space: nowrap; 
                overflow: hidden; 
                text-overflow: ellipsis;
            }
        `);

        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'tampermonkey-controls-container';
        document.body.appendChild(controlsContainer);

        const managerBtn = document.createElement('button');
        managerBtn.id = 'tampermonkey-manager-btn';
        managerBtn.className = 'tm-control-btn';
        managerBtn.textContent = `管理已收集 ID (${loadData().length})`;
        controlsContainer.appendChild(managerBtn);

        const clearBtn = document.createElement('button');
        clearBtn.id = 'clear-data-btn';
        clearBtn.className = 'tm-control-btn clear';
        clearBtn.textContent = '清除所有 ID';
        controlsContainer.appendChild(clearBtn);

        managerBtn.addEventListener('click', () => {
            const data = loadData();
            
            if (document.getElementById('tm-manager-container')) {
                document.getElementById('tm-manager-container').remove();
            }
            
            const managerHTML = generateManagerHTML(data);
            
            document.body.insertAdjacentHTML('beforeend', managerHTML);
            
            setTimeout(bindManagerEvents, 0); 
        });

        clearBtn.addEventListener('click', () => {
            if(confirm('確定要清除所有已收集的 User ID 數據嗎？')) {
                saveData([]);
                managerBtn.textContent = `管理已收集 ID (0)`;
            }
        });
        
        window.updateManagerButtonCount = () => {
             const currentCount = loadData().length;
             managerBtn.textContent = `管理已收集 ID (${currentCount})`;
        };
    }
    
    window.addEventListener('load', createPageControls);
    
})();