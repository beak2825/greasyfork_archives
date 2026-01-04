// ==UserScript==
// @name         YouTube Mobile ALL VIDEO PLAYLIST (Force Show)
// @namespace    ?
// @version      0.4
// @description  Force show playlist buttons on mobile YouTube
// @author       ?
// @license      CC-BY-4.0
// @match        https://m.youtube.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/560863/YouTube%20Mobile%20ALL%20VIDEO%20PLAYLIST%20%28Force%20Show%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560863/YouTube%20Mobile%20ALL%20VIDEO%20PLAYLIST%20%28Force%20Show%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 強制創建按鈕
    function forceCreateUI() {
        // 如果已存在就不重複創建
        if (document.getElementById('yavp-float-btn')) return;

        // 創建樣式
        const style = document.createElement('style');
        style.textContent = `
            #yavp-float-btn {
                position: fixed !important;
                bottom: 80px !important;
                right: 15px !important;
                width: 56px !important;
                height: 56px !important;
                background: #ff0000 !important;
                color: white !important;
                border: none !important;
                border-radius: 50% !important;
                font-size: 11px !important;
                font-weight: bold !important;
                z-index: 2147483647 !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important;
                cursor: pointer !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            #yavp-panel {
                position: fixed !important;
                bottom: 145px !important;
                right: 15px !important;
                left: 15px !important;
                background: #1a1a1a !important;
                border-radius: 16px !important;
                padding: 16px !important;
                z-index: 2147483647 !important;
                box-shadow: 0 8px 30px rgba(0,0,0,0.6) !important;
                display: none !important;
                visibility: visible !important;
                opacity: 1 !important;
                max-height: 70vh !important;
                overflow-y: auto !important;
            }
            #yavp-panel.yavp-show {
                display: block !important;
            }
            #yavp-panel * {
                box-sizing: border-box !important;
            }
            .yavp-header {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 12px !important;
                padding-bottom: 12px !important;
                border-bottom: 1px solid #333 !important;
            }
            .yavp-title {
                color: #fff !important;
                font-size: 16px !important;
                font-weight: bold !important;
                margin: 0 !important;
            }
            #yavp-close {
                background: #333 !important;
                border: none !important;
                color: #fff !important;
                font-size: 24px !important;
                cursor: pointer !important;
                padding: 0 !important;
                width: 32px !important;
                height: 32px !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                line-height: 1 !important;
            }
            .yavp-input-row {
                margin-bottom: 12px !important;
            }
            .yavp-input-row label {
                color: #aaa !important;
                font-size: 12px !important;
                display: block !important;
                margin-bottom: 6px !important;
            }
            #yavp-channel-input {
                width: 100% !important;
                padding: 10px 12px !important;
                border: 1px solid #444 !important;
                border-radius: 8px !important;
                background: #2a2a2a !important;
                color: #fff !important;
                font-size: 14px !important;
            }
            #yavp-channel-input::placeholder {
                color: #666 !important;
            }
            .yavp-section {
                margin-bottom: 12px !important;
            }
            .yavp-section-title {
                color: #888 !important;
                font-size: 11px !important;
                text-transform: uppercase !important;
                margin-bottom: 8px !important;
            }
            .yavp-btn-row {
                display: flex !important;
                gap: 8px !important;
                flex-wrap: wrap !important;
            }
            .yavp-btn {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 10px 16px !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                border-radius: 20px !important;
                border: none !important;
                cursor: pointer !important;
                text-decoration: none !important;
                color: #fff !important;
                background: #333 !important;
                flex: 1 !important;
                min-width: 80px !important;
            }
            .yavp-btn:active {
                background: #555 !important;
            }
            .yavp-toggle-row {
                display: flex !important;
                gap: 8px !important;
                margin-top: 12px !important;
                padding-top: 12px !important;
                border-top: 1px solid #333 !important;
            }
            .yavp-toggle {
                flex: 1 !important;
                padding: 10px !important;
                border-radius: 10px !important;
                background: #2a2a2a !important;
                border: none !important;
                color: #888 !important;
                font-size: 12px !important;
                cursor: pointer !important;
            }
            .yavp-toggle.yavp-on {
                background: #1a3a5c !important;
                color: #3ea6ff !important;
            }
            #yavp-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background: rgba(0,0,0,0.5) !important;
                z-index: 2147483646 !important;
                display: none !important;
            }
            #yavp-overlay.yavp-show {
                display: block !important;
            }
        `;
        document.head.appendChild(style);

        // 創建遮罩
        const overlay = document.createElement('div');
        overlay.id = 'yavp-overlay';
        document.body.appendChild(overlay);

        // 創建浮動按鈕
        const floatBtn = document.createElement('button');
        floatBtn.id = 'yavp-float-btn';
        floatBtn.textContent = 'YAVP';
        document.body.appendChild(floatBtn);

        // 創建面板
        const panel = document.createElement('div');
        panel.id = 'yavp-panel';
        document.body.appendChild(panel);

        // 選項
        const options = {
            playNext: (typeof GM_getValue !== 'undefined') ? GM_getValue('playNext', true) : true,
            newTabs: (typeof GM_getValue !== 'undefined') ? GM_getValue('newTabs', false) : false
        };

        // 生成 URL
        function makeUrl(type, chanId) {
            let url = `https://m.youtube.com/playlist?list=${type}${chanId}`;
            if ((options.playNext && type !== 'UUMO') || type === 'PU') {
                url += '&playnext=1';
            }
            return url;
        }

        // 創建按鈕 HTML
        function makeBtn(text, type, chanId) {
            const target = options.newTabs ? 'target="_blank"' : '';
            const url = makeUrl(type, chanId);
            return `<a class="yavp-btn" href="${url}" ${target}>${text}</a>`;
        }

        // 更新面板
        function updatePanel(chanId) {
            const playNextClass = options.playNext ? 'yavp-on' : '';
            const newTabsClass = options.newTabs ? 'yavp-on' : '';

            panel.innerHTML = `
                <div class="yavp-header">
                    <div class="yavp-title">📺 YAVP 播放清單</div>
                    <button id="yavp-close">×</button>
                </div>

                <div class="yavp-input-row">
                    <label>頻道 ID（輸入 UC 後面的部分）:</label>
                    <input type="text" id="yavp-channel-input" placeholder="例如: cQkI..." value="${chanId}">
                </div>

                <div class="yavp-section">
                    <div class="yavp-section-title">全部上傳</div>
                    <div class="yavp-btn-row">
                        ${makeBtn('全部 All', 'UU', chanId)}
                        ${makeBtn('熱門 Pop', 'PU', chanId)}
                    </div>
                </div>

                <div class="yavp-section">
                    <div class="yavp-section-title">影片 Videos</div>
                    <div class="yavp-btn-row">
                        ${makeBtn('全部', 'UULF', chanId)}
                        ${makeBtn('熱門', 'UULP', chanId)}
                    </div>
                </div>

                <div class="yavp-section">
                    <div class="yavp-section-title">Shorts</div>
                    <div class="yavp-btn-row">
                        ${makeBtn('全部', 'UUSH', chanId)}
                        ${makeBtn('熱門', 'UUPS', chanId)}
                    </div>
                </div>

                <div class="yavp-section">
                    <div class="yavp-section-title">直播 Streams</div>
                    <div class="yavp-btn-row">
                        ${makeBtn('全部', 'UULV', chanId)}
                        ${makeBtn('熱門', 'UUPV', chanId)}
                    </div>
                </div>

                <div class="yavp-section">
                    <div class="yavp-section-title">會員專屬</div>
                    <div class="yavp-btn-row">
                        ${makeBtn('Members', 'UUMO', chanId)}
                    </div>
                </div>

                <div class="yavp-toggle-row">
                    <button class="yavp-toggle ${playNextClass}" data-key="playNext">
                        ▶️ 自動播放: ${options.playNext ? '開' : '關'}
                    </button>
                    <button class="yavp-toggle ${newTabsClass}" data-key="newTabs">
                        🔗 新分頁: ${options.newTabs ? '開' : '關'}
                    </button>
                </div>
            `;

            // 綁定事件
            document.getElementById('yavp-close').onclick = closePanel;

            document.getElementById('yavp-channel-input').onchange = function() {
                updatePanel(this.value.trim());
            };

            panel.querySelectorAll('.yavp-toggle').forEach(btn => {
                btn.onclick = function() {
                    const key = this.dataset.key;
                    options[key] = !options[key];
                    if (typeof GM_setValue !== 'undefined') {
                        GM_setValue(key, options[key]);
                    }
                    updatePanel(chanId);
                };
            });
        }

        // 開關面板
        function openPanel() {
            let chanId = '';

            // 嘗試自動獲取頻道 ID
            try {
                const html = document.documentElement.innerHTML;
                const patterns = [
                    /"channelId":"(UC[a-zA-Z0-9_-]+)"/,
                    /"externalId":"(UC[a-zA-Z0-9_-]+)"/,
                    /\/channel\/(UC[a-zA-Z0-9_-]+)/,
                    /"browseId":"(UC[a-zA-Z0-9_-]+)"/
                ];
                for (const p of patterns) {
                    const m = html.match(p);
                    if (m) {
                        chanId = m[1].substring(2);
                        break;
                    }
                }
            } catch(e) {}

            updatePanel(chanId);
            panel.classList.add('yavp-show');
            overlay.classList.add('yavp-show');
        }

        function closePanel() {
            panel.classList.remove('yavp-show');
            overlay.classList.remove('yavp-show');
        }

        // 事件綁定
        floatBtn.onclick = openPanel;
        overlay.onclick = closePanel;

        console.log('YAVP: UI Created!');
    }

    // 多次嘗試創建 UI
    function tryCreate() {
        if (document.body) {
            forceCreateUI();
        } else {
            setTimeout(tryCreate, 100);
        }
    }

    // 立即嘗試
    tryCreate();

    // DOM Ready 時再試
    document.addEventListener('DOMContentLoaded', forceCreateUI);

    // Load 完成時再試
    window.addEventListener('load', forceCreateUI);

    // 每秒檢查一次（持續10秒）
    let attempts = 0;
    const interval = setInterval(() => {
        forceCreateUI();
        attempts++;
        if (attempts > 10) {
            clearInterval(interval);
        }
    }, 1000);

})();