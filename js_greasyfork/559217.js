// ==UserScript==
// @name         Komica 古文過濾助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  提供「淡化/隱藏/僅提示」過舊的串，專門處理推古文廚與免洗自演串。支援時區校正，可自定義過濾小時數。
// @author       Komica User
// @match        https://*.komica.org/*/*
// @match        https://*.komica1.org/*/*
// @match        http://*.komica.org/*/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559217/Komica%20%E5%8F%A4%E6%96%87%E9%81%8E%E6%BF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559217/Komica%20%E5%8F%A4%E6%96%87%E9%81%8E%E6%BF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全域變數與設定 ---
    const CONF_KEY = 'komica_old_thread_filter_config';
    let filterTimer = null;
    let clockTimer = null;

    // 預設設定
    let config = {
        enabled: true,      // 是否啟用
        limitHours: 12,     // 預設 12 小時
        mode: 'fade',       // 'hide' (隱藏), 'fade' (淡化), 'tag_only' (僅提示)
        excludeSticky: true,// 排除置頂
        timeOffset: 0       // 時差校正 (小時)
    };

    // --- CSS 樣式 ---
    const CSS_STYLES = `
        /* 淡化模式：透明度降低，摺疊內容 */
        .k-old-filtered {
            opacity: 0.4;
            transition: all 0.3s ease;
            background-color: #f4f4f4;
            border: 1px dashed #ccc;
            padding: 5px;
            margin-bottom: 5px;
            max-height: 120px;
            overflow: hidden;
            position: relative;
        }
        /* 暗色模式支援 */
        @media (prefers-color-scheme: dark) {
            .k-old-filtered {
                background-color: #222;
                border-color: #444;
            }
        }

        /* 隱藏模式 */
        .k-old-hidden { display: none !important; }

        /* 在淡化模式下隱藏縮圖與回應，節省版面 */
        .k-old-filtered .file-thumb,
        .k-old-filtered .reply,
        .k-old-filtered img,
        .k-old-filtered .file-text {
            display: none !important;
        }

        /* 提示標籤 */
        .k-old-tag {
            font-size: 0.85em;
            color: #d00;
            font-weight: bold;
            margin-left: 8px;
            background: #ffe6e6;
            padding: 1px 4px;
            border-radius: 3px;
            border: 1px solid #ffcccc;
        }

        /* 展開/收起按鈕 */
        .k-old-toggle-btn {
            cursor: pointer;
            color: #00e;
            text-decoration: underline;
            margin-left: 5px;
            font-size: 0.9em;
            user-select: none;
        }
        .k-old-toggle-btn:hover { color: #d00; }

        /* 展開後的狀態 (用於淡化模式) */
        .k-old-expanded {
            opacity: 1 !important;
            max-height: none !important;
            background-color: transparent !important;
            border: none !important;
        }
        .k-old-expanded .file-thumb,
        .k-old-expanded .reply,
        .k-old-expanded img,
        .k-old-expanded .file-text {
            display: inline-block !important;
        }
        .k-old-expanded .reply { display: table !important; }

        /* 設定面板樣式 */
        .k-panel-row { margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        .k-clock-display { font-family: monospace; color: #0f0; background: #000; padding: 2px 6px; border-radius: 3px; font-size: 1.1em; letter-spacing: 1px; }
    `;

    // --- 輔助函數 ---
    const _addStyle = (css) => {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    };

    const loadConfig = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(CONF_KEY) || '{}');
            config = { ...config, ...saved };
        } catch (e) {}
    };

    const saveConfig = () => {
        localStorage.setItem(CONF_KEY, JSON.stringify(config));
        // 重置所有串的狀態以便重新計算
        document.querySelectorAll('.thread').forEach(t => {
            t.classList.remove('k-old-filtered', 'k-old-hidden', 'k-old-expanded');
            const tags = t.querySelectorAll('.k-old-tag, .k-old-toggle-btn');
            tags.forEach(el => el.remove());
            t.style.display = '';
        });
        runFilter();
        updateUiState();
        updateLogUi();
    };

    // --- 核心邏輯：解析時間 ---
    const parsePostTime = (postHead) => {
        try {
            const nowEl = postHead.querySelector('.now');
            let dateStr = "";

            if (nowEl) {
                let dText = nowEl.innerText.replace(/\([^\)]+\)/, '').trim();
                let tText = "";

                let next = nowEl.nextElementSibling;
                while(next) {
                    if (next.tagName === 'SPAN' && next.innerText.includes(':')) {
                        tText = next.innerText.trim();
                        break;
                    }
                    next = next.nextElementSibling;
                    if (!next || next.tagName === 'BR' || (next.className && next.className.includes('id'))) break;
                }

                if (!tText && dText.match(/\d{1,2}:\d{1,2}/)) {
                    dateStr = dText;
                } else {
                    dateStr = `${dText} ${tText}`;
                }
            } else {
                const text = postHead.innerText;
                const match = text.match(/\d{2,4}\/\d{1,2}\/\d{1,2}\(.\)\s\d{1,2}:\d{1,2}(?::\d{1,2})?/);
                if (match) dateStr = match[0].replace(/\([^\)]+\)/, '');
            }

            return dateStr ? new Date(dateStr) : null;
        } catch (e) {
            return null;
        }
    };

    // --- 核心邏輯：過濾 ---
    let hiddenCount = 0;

    const runFilter = () => {
        if (!config.enabled) return;

        const threads = document.querySelectorAll('.thread');
        const now = new Date();
        const limitMs = config.limitHours * 60 * 60 * 1000;
        const offsetMs = (config.timeOffset || 0) * 60 * 60 * 1000;

        hiddenCount = 0;

        threads.forEach(thread => {
            // 檢查是否已經處理過
            // 如果已處理(有class或有tag)，計數加1並跳過計算，避免MutationObserver觸發時歸零
            const isProcessed = thread.classList.contains('k-old-filtered') ||
                                thread.classList.contains('k-old-expanded') ||
                                thread.classList.contains('k-old-hidden') ||
                                (config.mode === 'tag_only' && thread.querySelector('.k-old-tag'));

            if (isProcessed) {
                hiddenCount++;
                return;
            }

            const postHead = thread.querySelector('.post .post-head, .post-head');
            if (!postHead) return;

            // 排除置頂
            if (config.excludeSticky) {
                const idEl = postHead.querySelector('.id');
                if (idEl && (idEl.textContent.includes('Admin') || idEl.textContent.includes('管理'))) return;
                if (postHead.classList.contains('post-sticky')) return;
            }

            const threadDate = parsePostTime(postHead);
            if (!threadDate || isNaN(threadDate.getTime())) return;

            const diff = (now - threadDate) + offsetMs;

            if (diff > limitMs) {
                hiddenCount++;
                const hoursOld = Math.floor(diff / (1000 * 60 * 60));

                if (config.mode === 'hide') {
                    // --- 模式：完全隱藏 ---
                    thread.classList.add('k-old-hidden');
                }
                else {
                    // --- 模式：淡化 或 僅提示 ---
                    // 1. 建立提示標籤 (共用)
                    if (!postHead.querySelector('.k-old-tag')) {
                        const infoSpan = document.createElement('span');
                        infoSpan.className = 'k-old-tag';
                        infoSpan.innerText = `[已過 ${hoursOld}H]`;

                        // 尋找插入位置
                        const noEl = postHead.querySelector('[data-no]') || postHead.querySelector('.qlink');
                        let insertTarget = null;
                        if (noEl && noEl.parentNode === postHead) {
                            insertTarget = noEl.nextSibling;
                        }

                        // 插入標籤
                        if (insertTarget) {
                            postHead.insertBefore(infoSpan, insertTarget);
                        } else {
                            postHead.appendChild(infoSpan);
                        }

                        // 2. 如果是「淡化」模式，則需要額外處理 (加 Class, 加按鈕)
                        if (config.mode === 'fade') {
                            thread.classList.add('k-old-filtered');

                            const toggleBtn = document.createElement('span');
                            toggleBtn.className = 'k-old-toggle-btn';
                            toggleBtn.innerText = '[展開]';

                            toggleBtn.onclick = (e) => {
                                e.preventDefault();
                                if (thread.classList.contains('k-old-expanded')) {
                                    thread.classList.remove('k-old-expanded');
                                    thread.classList.add('k-old-filtered');
                                    toggleBtn.innerText = '[展開]';
                                } else {
                                    thread.classList.remove('k-old-filtered');
                                    thread.classList.add('k-old-expanded');
                                    toggleBtn.innerText = '[收起]';
                                }
                            };

                            // 插入按鈕到標籤後面
                            if (infoSpan.nextSibling) {
                                postHead.insertBefore(toggleBtn, infoSpan.nextSibling);
                            } else {
                                postHead.appendChild(toggleBtn);
                            }
                        }
                    }
                }
            }
        });
        updateLogUi();
    };

    // --- DOM 監聽 ---
    const initObserver = () => {
        const target = document.querySelector('#threads') || document.body;
        const obs = new MutationObserver((mutations) => {
            let shouldRun = false;
            for (const m of mutations) {
                if (m.addedNodes.length > 0) shouldRun = true;
            }
            if (shouldRun) {
                if (filterTimer) clearTimeout(filterTimer);
                filterTimer = setTimeout(() => runFilter(), 250);
            }
        });
        obs.observe(target, { childList: true, subtree: true });
    };

    // --- GUI 介面 ---
    const buildUi = () => {
        const top = document.querySelector('#toplink');
        if (!top) { setTimeout(buildUi, 500); return; }
        if (document.getElementById('k-old-btn')) return;

        const span = document.createElement('span');
        span.id = 'k-old-btn';
        span.innerHTML = ` [<a class="text-button" style="cursor:pointer;">古文過濾</a>]`;
        top.appendChild(span);

        const panel = document.createElement('div');
        panel.id = 'k-old-panel';
        panel.style.cssText = "position:fixed; right:10px; top:50px; width:300px; background:rgba(30,30,30,0.95); color:#eee; font-size:13px; z-index:9999; padding:15px; border-radius:8px; display:none; box-shadow:0 4px 15px rgba(0,0,0,0.7); font-family:sans-serif; text-align:left; border: 1px solid #555;";

        panel.innerHTML = `
            <div style="font-weight:bold; color:#fff; border-bottom:1px solid #555; padding-bottom:8px; margin-bottom:12px; display:flex; justify-content:space-between;">
                <span>古文過濾助手 v1.1</span>
                <span id="ko-close" style="cursor:pointer; color:#aaa; font-weight:normal;">✕ 關閉</span>
            </div>

            <div class="k-panel-row">
                <label style="cursor:pointer; display:flex; align-items:center;">
                    <input type="checkbox" id="ko-enabled" style="margin-right:8px;"> 啟用過濾功能
                </label>
            </div>

            <div style="margin-bottom:15px; background:#444; padding:10px; border-radius:5px;">
                <div style="color:#f90; margin-bottom:8px; font-weight:bold; font-size:12px;">時區/時差校正</div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span>現在電腦時間:</span>
                    <span id="ko-sys-time" class="k-clock-display">--:--:--</span>
                </div>
                <div class="k-panel-row">
                    <span>校正時數 (H):</span>
                    <input type="number" id="ko-offset" style="width:60px; text-align:center; padding:2px;" placeholder="0">
                </div>
            </div>

            <div style="margin-bottom:15px;">
                <div style="color:#09f; margin-bottom:6px; font-weight:bold; font-size:12px;">過濾規則</div>
                <div class="k-panel-row">
                    <span>超過 N 小時:</span>
                    <input type="number" id="ko-hours" style="width:50px; text-align:center; padding:2px;" min="1">
                </div>
                 <select id="ko-mode" style="width:100%; padding:6px; margin-top:5px; border-radius:4px; border:none;">
                    <option value="fade">淡化 + 摺疊 (推薦)</option>
                    <option value="tag_only">僅提示 (不隱藏/淡化)</option>
                    <option value="hide">完全隱藏 (Display None)</option>
                 </select>
            </div>

            <button id="ko-save" style="cursor:pointer; width:100%; padding:8px; background:#28a745; color:#fff; border:none; border-radius:4px; margin-bottom:10px; font-weight:bold; font-size:14px;">保存並套用</button>

            <div style="font-size:12px; color:#ff6666; text-align:right;">
                符合條件: <span id="ko-count">0</span> 串
            </div>
        `;
        document.body.appendChild(panel);

        const togglePanel = () => {
            const isShow = panel.style.display === 'block';
            panel.style.display = isShow ? 'none' : 'block';
            if (!isShow) startClock();
            else stopClock();
        };

        span.querySelector('a').onclick = () => {
            updateUiState();
            togglePanel();
        };
        panel.querySelector('#ko-close').onclick = togglePanel;

        panel.querySelector('#ko-save').onclick = () => {
            config.enabled = document.getElementById('ko-enabled').checked;
            config.limitHours = parseFloat(document.getElementById('ko-hours').value) || 12;
            config.timeOffset = parseFloat(document.getElementById('ko-offset').value) || 0;
            config.mode = document.getElementById('ko-mode').value;
            saveConfig();
        };
    };

    const startClock = () => {
        stopClock();
        const el = document.getElementById('ko-sys-time');
        const update = () => {
            if(el) {
                const now = new Date();
                el.innerText = now.toLocaleTimeString('zh-TW', { hour12: false });
            }
        };
        update();
        clockTimer = setInterval(update, 500);
    };
    const stopClock = () => {
        if(clockTimer) clearInterval(clockTimer);
    };

    const updateUiState = () => {
        document.getElementById('ko-enabled').checked = config.enabled;
        document.getElementById('ko-hours').value = config.limitHours;
        document.getElementById('ko-offset').value = config.timeOffset;
        document.getElementById('ko-mode').value = config.mode;
    };

    const updateLogUi = () => {
        const el = document.getElementById('ko-count');
        if(el) el.textContent = hiddenCount;
    };

    // --- 程式進入點 ---
    const main = () => {
        _addStyle(CSS_STYLES);
        loadConfig();
        window.addEventListener('DOMContentLoaded', () => {
            buildUi();
            runFilter();
            initObserver();
        });
        window.addEventListener('load', () => runFilter());
    };

    main();
})();