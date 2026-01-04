// ==UserScript==
// @name        拓元 BOTTT (V10.27 頭貼同步版)
// @namespace   http://tampermonkey.net/
// @version     10.27
// @description 攔截視窗(含錯誤/售完通知) + 自動換圖 + 區域策略 + Bark(Calypso) + 頭貼同步
// @author      User
// @match       https://tixcraft.com/*
// @connect     127.0.0.1
// @connect     discord.com
// @connect     discordapp.com
// @connect     api.day.app
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/559461/%E6%8B%93%E5%85%83%20BOTTT%20%28V1027%20%E9%A0%AD%E8%B2%BC%E5%90%8C%E6%AD%A5%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559461/%E6%8B%93%E5%85%83%20BOTTT%20%28V1027%20%E9%A0%AD%E8%B2%BC%E5%90%8C%E6%AD%A5%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // ⚙️ 全域設定區
    // ==========================================
    const API_URL = "http://127.0.0.1:5000/solve";

    // 🔴 Bark Key
    const BARK_KEY = "uAstvSWHBYVWiBVFDPnwec";

    // 🔴 Discord Webhook
    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1456278279790137405/2XbamU2ef8LwkuTFk-Z2JHLPnzE8ZYiDIOYxUBm-vEkkybuGxhSCWhW5TZj_ywVbjY-F";

    // 🔵 共用設定 (頭像) - 已更新為您指定的頭貼
    const AVATAR_URL = "https://megapx-assets.dcard.tw/images/2f638c9b-8f04-40e1-9818-499b857ab216/640.jpeg";

    // ==========================================
    // 📣 通知功能
    // ==========================================
    function sendBark(title, body) {
        if (!BARK_KEY) return;
        const encodedTitle = encodeURIComponent(title);
        const encodedBody = encodeURIComponent(body);
        const url = `https://api.day.app/${BARK_KEY}/${encodedTitle}/${encodedBody}?group=拓元搶票&sound=calypso&icon=${AVATAR_URL}`;
        GM_xmlhttpRequest({ method: "GET", url: url, onload: () => {} });
    }

    function sendDiscord(msg) {
        if (!DISCORD_WEBHOOK_URL) return;
        const payload = { content: msg, username: "冬冬勞工", avatar_url: AVATAR_URL };
        GM_xmlhttpRequest({
            method: "POST", url: DISCORD_WEBHOOK_URL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(payload), onload: () => {}
        });
    }

    function burstNotify(msg, count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => { sendBark("冬冬勞工", msg); }, i * 1000); // 間隔 1 秒
        }
    }

    // ==========================================
    // 💀 第一階段：視窗殺手
    // ==========================================
    try {
        const signalError = () => {
            sessionStorage.setItem('tix_silent_error', 'true');
        };

        unsafeWindow.alert = function(msg) {
            console.log("🔕 已攔截 Alert: " + msg);

            if (!msg) return true;

            // 1. 錯誤攔截
            if (msg.includes("不正確") || msg.includes("驗證碼") || msg.includes("錯誤") || msg.includes("error")) {
                signalError();
                const note = `⚠️ 錯誤發生(已攔截)：${msg}`;
                sendBark("冬冬勞工", note);
                sendDiscord(note);
            }

            // 2. 售完攔截
            if (msg.includes("售完") || msg.includes("Sold Out") || msg.includes("沒有足夠") || msg.includes("無法") || msg.includes("選購一空")) {
                const note = `❌ 票券售完/異常(已攔截)：${msg}`;
                sendBark("冬冬勞工", note);
                sendDiscord(note);
            }

            return true;
        };

        unsafeWindow.confirm = function(msg) {
            console.log("🔕 已攔截 Confirm: " + msg);
            return true;
        };

        unsafeWindow.prompt = function(msg) { return null; };
        console.log("✅ V10.27 視窗攔截器已部署");

    } catch (e) {
        console.error("攔截器部署失敗:", e);
    }

    // ==========================================
    // 🧠 核心變數
    // ==========================================
    let isRunning = localStorage.getItem('tix_is_running') !== 'false';
    let isAutoSubmit = localStorage.getItem('tix_auto_submit') !== 'false';
    let isAutoAgree = localStorage.getItem('tix_auto_agree') !== 'false';
    let targetTicketCount = localStorage.getItem('tix_ticket_count') || '2';
    let targetGameDate = localStorage.getItem('tix_game_date') || '';
    let targetAreaKeyword = localStorage.getItem('tix_area_keyword') || '';
    let isPanelCollapsed = localStorage.getItem('tix_panel_collapsed') === 'true';
    let areaSelectMode = localStorage.getItem('tix_area_mode') || '1';
    let submitDelayTime = localStorage.getItem('tix_submit_delay') || '0';

    let hasSentPageNotification = false;

    // 選擇器
    const GAME_LIST_SELECTOR = "#gameList";
    const GAME_ROWS_SELECTOR = "#gameList table tbody tr";
    const GAME_BTN_SELECTOR = "button.btn-primary";
    const AREA_LINKS_SELECTOR = ".zone a, .area-list a, .group-list a, div.area-list > a";
    const IMG_SELECTOR = "#TicketForm_verifyCode-image";
    const INPUT_SELECTOR = "#TicketForm_verifyCode";
    const AGREE_CHECKBOX_SELECTOR = "#TicketForm_agree";
    const SUBMIT_BTN_SELECTOR = "#TicketForm_submit, button[type='submit'], .btn-primary";
    const TICKET_SELECT_SELECTOR = "select[name^='TicketForm[ticketPrice]'], select[id^='TicketForm_ticketPrice']";

    let isSolving = false;
    let lastImageSrc = "";
    let hasClickedGame = false;
    let hasClickedArea = false;
    let loopId = null;

    // ==========================================
    // 🚀 第二階段：主程式
    // ==========================================

    function mainLoop() {
        if (!isRunning) return;

        // [靜默重試機制]
        if (sessionStorage.getItem('tix_silent_error') === 'true') {
            sessionStorage.removeItem('tix_silent_error');
            log("⚠️ 驗證碼錯誤(已攔截)，等待系統自動換圖...");
            const input = document.querySelector(INPUT_SELECTOR);
            if (input) {
                input.value = "";
                isSolving = false;
            }
            loopId = requestAnimationFrame(mainLoop);
            return;
        }

        // 1. 場次
        if (document.querySelector(GAME_LIST_SELECTOR)) {
            handleGameListPage();
            loopId = requestAnimationFrame(mainLoop);
            return;
        }

        // 2. 區域
        const areaLinks = document.querySelectorAll(AREA_LINKS_SELECTOR);
        if (areaLinks.length > 0 && !document.querySelector(IMG_SELECTOR)) {
            handleAreaSelectionPage(areaLinks);
            if (!hasClickedArea) loopId = requestAnimationFrame(mainLoop);
            return;
        }

        // 3. 驗證碼 (結帳頁面)
        if (document.querySelector(IMG_SELECTOR)) {
            if (window.location.href.indexOf("ticket/ticket") !== -1) {
                if (!hasSentPageNotification) {
                    hasSentPageNotification = true;
                    const msg = `🎉 進入結帳頁面！趕快輸入驗證碼！\n${window.location.href}`;
                    log("💥 觸發結帳通知轟炸 (10次)");
                    burstNotify(msg, 10);
                    sendDiscord(msg);
                }
            }
            handleVerifyPage();
            loopId = requestAnimationFrame(mainLoop);
            return;
        }

        loopId = requestAnimationFrame(mainLoop);
    }

    // --- 面板 UI ---

    function createPanel() {
        if (document.getElementById('ticket-helper-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'ticket-helper-panel';

        const areaOptions = `
            <option value="1">⚡ 首選 (第1個)</option>
            <option value="3">🎲 前 3 (隨機)</option>
            <option value="5">🎲 前 5 (隨機)</option>
            <option value="10">🎲 前 10 (隨機)</option>
            <option value="0">🌀 全區隨機</option>
        `;

        panel.innerHTML = `
            <div class="panel-header">
                <span>🤖 戰情室 V10.27 (頭貼版)</span>
                <div>
                    <span id="btn-minimize" style="cursor:pointer; padding:0 5px;">${isPanelCollapsed ? '[+]' : '[-]'}</span>
                    <button type="button" id="btn-toggle-run" class="${isRunning ? 'btn-running' : 'btn-stopped'}">${isRunning ? '運行' : '暫停'}</button>
                </div>
            </div>
            <div id="panel-content" style="display: ${isPanelCollapsed ? 'none' : 'block'};">
                <div style="margin-bottom:5px;">
                    <input type="text" id="ui-game-date" class="ui-input" placeholder="日期 (例: 2024/05/18)" style="width:100%;">
                </div>
                <div style="margin-bottom:5px;">
                    <input type="text" id="ui-area-keyword" class="ui-input" placeholder="區域關鍵字 (例: A區, 1800)" style="width:100%;">
                </div>

                <div style="display:flex; justify-content:space-between; margin-bottom:5px; gap:5px;">
                    <select id="ui-area-mode" class="ui-select" style="flex:1;">${areaOptions}</select>
                    <input type="number" id="ui-ticket-count" class="ui-input" placeholder="張數" style="width:50px; text-align:center;">
                </div>

                <div style="margin-bottom:5px; display:flex; align-items:center;">
                    <span style="font-size:11px; margin-right:5px;">送出延遲(ms):</span>
                    <input type="number" id="ui-submit-delay" class="ui-input" placeholder="0" style="width:60px;">
                </div>

                <div id="status-text" style="color:${isRunning?'#0f0':'#f55'};font-weight:bold;margin:5px 0;">${isRunning?'監控中':'已暫停'}</div>

                <div style="margin-bottom:5px; font-size:11px;">
                    <label><input type="checkbox" id="chk-auto-submit" ${isAutoSubmit?'checked':''}>自動送</label>
                    <label><input type="checkbox" id="chk-auto-agree" ${isAutoAgree?'checked':''}>自動勾</label>
                </div>

                <div id="panel-logs" class="panel-logs"></div>

                <div style="text-align:right; margin-top:5px; display:flex; justify-content:space-between;">
                    <div>
                        <button type="button" id="btn-test-bark" style="font-size:10px; cursor:pointer; background:#FF9500; color:white; border:none; border-radius:3px;">測Bark</button>
                    </div>
                    <button type="button" id="btn-clear-log" style="font-size:10px; cursor:pointer;">清空</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        GM_addStyle(`
            #ticket-helper-panel {
                position: fixed; top: 10px; right: 10px;
                background: rgba(0,0,0,0.9); color: #fff;
                z-index: 2147483647; padding: 10px; border-radius: 8px;
                width: ${isPanelCollapsed ? '120px' : '220px'};
                font-size: 12px; border: 1px solid #666;
                box-shadow: 0 4px 15px rgba(0,0,0,0.6);
                font-family: "Microsoft JhengHei", sans-serif;
            }
            .panel-header { display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid #555; padding-bottom: 5px; }
            .ui-input, .ui-select { background: #fff; color: #000; border: none; padding: 4px; border-radius: 3px; box-sizing: border-box; font-size: 12px;}
            .btn-running { background: #28a745; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor:pointer;}
            .btn-stopped { background: #dc3545; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor:pointer;}
            .panel-logs { height: 80px; overflow-y: auto; background: #222; border: 1px solid #444; color: #ccc; font-family: monospace; padding: 3px; margin-top:5px;}
            .log-item { border-bottom: 1px dashed #333; margin-bottom: 1px; }
        `);

        document.getElementById('ui-ticket-count').value = targetTicketCount;
        document.getElementById('ui-game-date').value = targetGameDate;
        document.getElementById('ui-area-keyword').value = targetAreaKeyword;
        document.getElementById('ui-area-mode').value = areaSelectMode;
        document.getElementById('ui-submit-delay').value = submitDelayTime;
        loadLogs();

        const bind = (id, ev, fn) => document.getElementById(id).addEventListener(ev, fn);

        bind('ui-game-date', 'input', (e)=>{ targetGameDate=e.target.value; localStorage.setItem('tix_game_date', targetGameDate); });
        bind('ui-area-keyword', 'input', (e)=>{ targetAreaKeyword=e.target.value; localStorage.setItem('tix_area_keyword', targetAreaKeyword); });
        bind('ui-ticket-count', 'input', (e)=>{ targetTicketCount=e.target.value; localStorage.setItem('tix_ticket_count', targetTicketCount); });
        bind('ui-area-mode', 'change', (e)=>{ areaSelectMode=e.target.value; localStorage.setItem('tix_area_mode', areaSelectMode); });
        bind('ui-submit-delay', 'input', (e)=>{ submitDelayTime=e.target.value; localStorage.setItem('tix_submit_delay', submitDelayTime); });

        bind('btn-toggle-run', 'click', (e)=>{
            e.preventDefault();
            isRunning = !isRunning;
            localStorage.setItem('tix_is_running', isRunning);
            const btn = document.getElementById('btn-toggle-run');
            const status = document.getElementById('status-text');
            btn.innerText = isRunning ? '運行' : '暫停';
            btn.className = isRunning ? 'btn-running' : 'btn-stopped';
            status.innerText = isRunning ? '監控中' : '已暫停';
            status.style.color = isRunning ? '#0f0' : '#f55';
            if(isRunning) requestAnimationFrame(mainLoop);
        });

        bind('btn-minimize', 'click', ()=>{
            isPanelCollapsed = !isPanelCollapsed;
            localStorage.setItem('tix_panel_collapsed', isPanelCollapsed);
            document.getElementById('panel-content').style.display = isPanelCollapsed ? 'none' : 'block';
            document.getElementById('ticket-helper-panel').style.width = isPanelCollapsed ? '120px' : '220px';
            document.getElementById('btn-minimize').innerText = isPanelCollapsed ? '[+]' : '[-]';
        });

        bind('chk-auto-submit', 'change', (e)=>{ isAutoSubmit=e.target.checked; localStorage.setItem('tix_auto_submit', isAutoSubmit); });
        bind('chk-auto-agree', 'change', (e)=>{ isAutoAgree=e.target.checked; localStorage.setItem('tix_auto_agree', isAutoAgree); });

        bind('btn-clear-log', 'click', (e)=>{
            e.preventDefault();
            localStorage.setItem('tix_logs', '[]');
            document.getElementById('panel-logs').innerHTML = '';
        });

        bind('btn-test-bark', 'click', (e)=>{
            e.preventDefault(); e.stopPropagation();
            sendBark("冬冬勞工", "Bark 測試: 您的手機通知運作正常！");
        });
    }

    function log(msg) {
        const logBox = document.getElementById('panel-logs');
        if (!logBox) return;
        const time = new Date().toLocaleTimeString().split(' ')[0];
        const logText = `[${time}] ${msg}`;
        const item = document.createElement('div');
        item.className = 'log-item';
        item.innerText = logText;
        logBox.appendChild(item);
        logBox.scrollTop = logBox.scrollHeight;
        try {
            let logs = JSON.parse(localStorage.getItem('tix_logs') || '[]');
            logs.push(logText);
            if (logs.length > 50) logs.shift();
            localStorage.setItem('tix_logs', JSON.stringify(logs));
        } catch (e) {}
    }

    function loadLogs() {
        try {
            const logBox = document.getElementById('panel-logs');
            if(!logBox) return;
            let logs = JSON.parse(localStorage.getItem('tix_logs') || '[]');
            logs.forEach(text => {
                const item = document.createElement('div');
                item.className = 'log-item';
                item.innerText = text;
                logBox.appendChild(item);
            });
            logBox.scrollTop = logBox.scrollHeight;
        } catch (e) {}
    }

    // --- 業務邏輯 ---

    function handleGameListPage() {
        if (hasClickedGame) return;
        const rows = document.querySelectorAll(GAME_ROWS_SELECTOR);
        if (!targetGameDate || targetGameDate.trim() === "") return;
        const keyword = targetGameDate.trim();

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.innerText.indexOf(keyword) !== -1) {
                const btn = row.querySelector(GAME_BTN_SELECTOR);
                if (btn) {
                    log(`⚡ 鎖定日期: ${keyword}`);
                    row.style.backgroundColor = "#ffffcc";
                    btn.click();
                    hasClickedGame = true;
                    const url = btn.getAttribute("data-href");
                    if (url) setTimeout(() => window.location.href = url, 100);
                    return;
                }
            }
        }
    }

    function handleAreaSelectionPage(areaLinks) {
        if (hasClickedArea) return;
        const excludeKeywords = ["身障", "輪椅", "愛心", "陪同", "障礙"];
        const hasKeyword = targetAreaKeyword && targetAreaKeyword.trim() !== "";

        if (hasKeyword) {
            const keywords = targetAreaKeyword.split(/[,，\s]+/);
            for (let i = 0; i < areaLinks.length; i++) {
                let link = areaLinks[i];
                let text = link.innerText;
                for (let j = 0; j < keywords.length; j++) {
                    let kw = keywords[j];
                    if (kw && kw.trim() !== "" && text.includes(kw)) {
                        log(`⚡ 鎖定區域(關鍵字): ${kw}`);
                        link.style.border = "4px solid red";

                        log("💥 觸發區域通知轟炸 (5次)");
                        const areaMsg = `⚡ 鎖定區域！\n區域：${text}\n網址：${window.location.href}`;
                        burstNotify(areaMsg, 5); // 間隔 1 秒

                        link.click();
                        hasClickedArea = true;
                        isRunning = false;
                        return;
                    }
                }
            }
        }

        let validLinks = [];
        for (let i = 0; i < areaLinks.length; i++) {
            let link = areaLinks[i];
            let text = link.innerText;
            if (text.indexOf("售完") === -1 && text.indexOf("Sold Out") === -1) {
                 let isExcluded = false;
                 for (let k = 0; k < excludeKeywords.length; k++) {
                     if (text.indexOf(excludeKeywords[k]) !== -1) { isExcluded = true; break; }
                 }
                 if (!isExcluded) validLinks.push(link);
            }
        }

        if (validLinks.length > 0) {
            const mode = parseInt(areaSelectMode);
            let target = null;

            if (mode === 1) target = validLinks[0];
            else if (mode === 0) target = validLinks[Math.floor(Math.random() * validLinks.length)];
            else {
                const range = Math.min(mode, validLinks.length);
                const randomIndex = Math.floor(Math.random() * range);
                target = validLinks[randomIndex];
            }

            if (target) {
                log(`🚀 進入區域: ${target.innerText.trim()}`);
                target.style.border = "4px solid blue";

                log("💥 觸發區域通知轟炸 (5次)");
                const areaMsg = `⚡ 鎖定區域 (策略)！\n區域：${target.innerText.trim()}\n網址：${window.location.href}`;
                burstNotify(areaMsg, 5); // 間隔 1 秒

                target.click();
                hasClickedArea = true;
                isRunning = false;
            }
        }
    }

    function handleVerifyPage() {
        const imgElement = document.querySelector(IMG_SELECTOR);
        const inputElement = document.querySelector(INPUT_SELECTOR) || document.querySelector("input[name*='verifyCode']");

        if (imgElement && inputElement) {
            if (imgElement.src !== lastImageSrc && !isSolving) {
                if (imgElement.complete && imgElement.naturalWidth > 0) {
                    lastImageSrc = imgElement.src;
                    solveCaptcha(imgElement, inputElement);
                } else {
                    imgElement.onload = () => {
                        lastImageSrc = imgElement.src;
                        solveCaptcha(imgElement, inputElement);
                    };
                }
            }
        }

        const ticketSelect = document.querySelector(TICKET_SELECT_SELECTOR);
        if (ticketSelect && ticketSelect.value !== targetTicketCount) {
            let options = ticketSelect.options;
            let found = false;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === targetTicketCount) {
                    ticketSelect.selectedIndex = i;
                    ticketSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    found = true;
                    break;
                }
            }
            if (!found && options.length > 0) {
                ticketSelect.selectedIndex = options.length - 1;
                ticketSelect.dispatchEvent(new Event('change', { bubbles: true }));
                log(`⚠️ 無法選 ${targetTicketCount} 張，已選最大值`);
            }
        }

        if (isAutoAgree) {
            const agreeCheckbox = document.querySelector(AGREE_CHECKBOX_SELECTOR);
            if (agreeCheckbox && !agreeCheckbox.checked) {
                agreeCheckbox.click();
                agreeCheckbox.checked = true;
            }
        }
    }

    async function solveCaptcha(img, input) {
        isSolving = true;
        const status = document.getElementById('status-text');
        if(status) status.innerText = "辨識中...";

        try {
            let canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            let base64 = canvas.toDataURL("image/png");

            GM_xmlhttpRequest({
                method: "POST",
                url: API_URL,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ image: base64 }),
                onload: function(response) {
                    if (response.status === 200) {
                        let result = JSON.parse(response.responseText);
                        log(`驗證碼: ${result.code}`);
                        fillAndSubmit(input, result.code);
                    } else {
                        log("Server Error 500");
                        isSolving = false;
                    }
                },
                onerror: function(err) {
                    log("連線失敗");
                    isSolving = false;
                }
            });
        } catch (e) {
            isSolving = false;
        }
    }

    function fillAndSubmit(input, code) {
        input.focus();
        input.value = code;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        if (isAutoSubmit) {
            setTimeout(() => {
                 input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
                 input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
            }, 50);

            let delay = parseInt(submitDelayTime) || 0;
            if (delay > 0) log(`⏳ 等待 ${delay}ms 後送出...`);

            setTimeout(() => {
                let btn = document.querySelector(SUBMIT_BTN_SELECTOR);
                if (btn) {
                    btn.click();
                    log("🚀 已送出!");
                }
            }, 150 + delay);
        } else {
            log("等待手動送出");
        }
    }

    window.addEventListener('load', () => {
        createPanel();
        requestAnimationFrame(mainLoop);
    });

})();