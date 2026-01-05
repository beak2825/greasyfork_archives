// ==UserScript==
// @name         ibon BOTTT (V1.2 Bark版)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  修復 + Bark通知 (冬冬勞工/Calypso)
// @author       You
// @match        *://*.ibon.com.tw/*
// @include      https://orders.ibon.com.tw/*
// @include      https://ticket.ibon.com.tw/*
// @connect      127.0.0.1
// @connect      api.day.app
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559035/ibon%20BOTTT%20%28V12%20Bark%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559035/ibon%20BOTTT%20%28V12%20Bark%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // ⚙️ 設定區
    // ============================================================
    const API_URL = "http://127.0.0.1:5000/ocr";
    
    // 🔴 Bark Key (已填入)
    const BARK_KEY = "uAstvSWHBYVWiBVFDPnwec";

    // 🔵 頭像設定
    const AVATAR_URL = "https://megapx-assets.dcard.tw/images/2f638c9b-8f04-40e1-9818-499b857ab216/640.jpeg";

    // ============================================================
    // 💀 1. 歷史紀錄清洗
    // ============================================================
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }

    // ============================================================
    // 💀 2. 視窗攔截器
    // ============================================================
    const killPopup = function(msg) {
        console.log("🔪 成功攔截彈窗，內容:", msg);
        if (msg && typeof msg === 'string' && msg.includes("DOCTYPE")) {
            console.log("⚠️ 偵測到伺服器吐回 HTML 錯誤，已隱藏視窗並繼續執行...");
        }
        return true;
    };

    window.alert = killPopup;
    window.confirm = killPopup;
    window.prompt = killPopup;
    window.onbeforeunload = null;

    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.alert = killPopup;
        unsafeWindow.confirm = killPopup;
        unsafeWindow.prompt = killPopup;
        unsafeWindow.onbeforeunload = null;
    }

    try {
        Object.defineProperty(window, 'alert', { get: function() { return killPopup; }, set: function() {} });
        Object.defineProperty(window, 'confirm', { get: function() { return killPopup; }, set: function() {} });
        if (typeof unsafeWindow !== 'undefined') {
            Object.defineProperty(unsafeWindow, 'alert', { get: function() { return killPopup; }, set: function() {} });
            Object.defineProperty(unsafeWindow, 'confirm', { get: function() { return killPopup; }, set: function() {} });
        }
    } catch (e) {
        console.log("🔒 鎖定彈窗函數失敗(可能已被鎖定)，但已嘗試覆蓋");
    }

    const css = `
        .modal, .modal-backdrop, .blockUI, .blockMsg, .sweet-alert, .bootbox,
        div[id*='block'], div[class*='overlay'], div[class*='popup'] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        (document.head || document.documentElement).appendChild(style);
    }

    // ============================================================
    // 💀 3. F5 按鍵攔截
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if ((e.which || e.keyCode) === 116 || ((e.which || e.keyCode) === 82 && e.ctrlKey)) {
            e.preventDefault();
            console.log("🛡️ 攔截 F5/Ctrl+R，執行安全重整...");
            window.location.href = window.location.href;
        }
    });

    // ============================================================
    // 📣 Bark 通知功能
    // ============================================================
    function sendBark(title, body) {
        if (!BARK_KEY) return;

        const encodedTitle = encodeURIComponent(title);
        const encodedBody = encodeURIComponent(body);
        // 🔔 設定鈴聲為 calypso，並帶入頭像
        const url = `https://api.day.app/${BARK_KEY}/${encodedTitle}/${encodedBody}?group=ibon搶票&sound=calypso&icon=${AVATAR_URL}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: (res) => { if(res.status >= 200 && res.status < 300) console.log("✅ Bark 通知成功"); },
            onerror: (err) => console.error("❌ Bark 失敗", err)
        });
    }

    // ============================================================
    // 📢 全域跳轉通知 (排除 000 頁面)
    // ============================================================
    const host = location.hostname;
    const path = location.pathname;

    if (host.includes("orders.ibon.com.tw")) {
        if (!path.includes("UTK0201_000.aspx")) {
            let pageName = "未知頁面";
            if (path.includes("UTK0201_001")) pageName = "001 填寫張數";
            else if (path.includes("UTK0202")) pageName = "002 選位/配位";
            else if (path.includes("UTK0203") || path.includes("Checkout")) pageName = "💰 結帳頁面";

            sendBark("冬冬勞工", `🔄 頁面跳轉通知\n位置：${pageName}\n網址：${location.href}`);
        }
    }

    // ============================================================
    // 🛑 絕對靜默區：000 頁面
    // ============================================================
    if (path.includes("UTK0201_000.aspx")) {
        console.log("🛑 位於 000 頁面，腳本靜默中 (已啟用 F5 防護)");
        return;
    }

    // ============================================================
    // ⚙️ 核心變數
    // ============================================================
    let USER_TICKET_QTY = GM_getValue('ibon_bot_qty', '2');
    let USER_AUTO_SUBMIT = GM_getValue('ibon_bot_auto_submit', false);

    console.log(`🚀 V1.2 (Bark版) 啟動 | 自動填寫模式 | 彈窗防護已開啟`);

    // ============================================================
    // 🛡️ Shadow DOM 解鎖
    // ============================================================
    if (host.includes("orders.ibon.com.tw")) {
        try {
            const originalAttachShadow = Element.prototype.attachShadow;
            const newAttachShadow = function(init) { return originalAttachShadow.call(this, { ...init, mode: "open" }); };
            newAttachShadow.toString = function() { return originalAttachShadow.toString(); };
            Object.defineProperty(Element.prototype, "attachShadow", { value: newAttachShadow, configurable: true, writable: true });
        } catch (e) {}
    }

    // ============================================================
    // 🧹 Cookie 清除
    // ============================================================
    function forceCleanCookies() {
        if (typeof GM_cookie === 'undefined') { console.log("❌ 無權限"); return; }
        ['__cf_bm', '_cfuvid', 'cf_clearance', 'BID', 'tmpt', 'TIXUISID'].forEach(name => GM_cookie.delete({ name: name }, () => {}));
        setTimeout(() => {
            window.location.href = window.location.href;
        }, 500);
    }

    // ============================================================
    // 🚀 主程式 (001 / 0202 自動填寫)
    // ============================================================
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initBot);
    else initBot();

    function initBot() {
        if (document.getElementById('challenge-form') || document.getElementById('cf-wrapper')) return;

        if (host.includes("ticket.ibon.com.tw")) {
            createSettingsPanel();
        } else if (host.includes("orders.ibon.com.tw")) {

            const isTargetPage = path.includes("UTK0201_001.aspx") || path.includes("UTK0202_.aspx") || location.search.includes("PERFORMANCE_PRICE_AREA_ID");
            const hasSelect = document.querySelector("select[id*='AMOUNT_DDL']");
            const hasCaptcha = document.querySelector("img[src*='pic.aspx']");

            if (isTargetPage || hasSelect || hasCaptcha) {
                console.log("🎫 啟動自動填寫流程...");
                createStatusPanel();
                initOrderAuto();
            }
        }
    }

    // ============================================================
    // 🚀 填寫邏輯
    // ============================================================
    function initOrderAuto() {
        const checkTimer = setInterval(() => {
            let done = autoSelectTickets();
            autoCheckOptions();
            if(done) clearInterval(checkTimer);
        }, 300);

        let checkCount = 0;
        const ocrTimer = setInterval(() => {
            checkCount++;
            solveCaptcha(ocrTimer);
            if (checkCount > 120) clearInterval(ocrTimer);
        }, 500);
    }

    function autoSelectTickets() {
        const selects = document.querySelectorAll("select[id*='AMOUNT_DDL']");
        if (selects.length > 0) {
            let select = selects[0];
            let targetValue = USER_TICKET_QTY;
            let optionExists = Array.from(select.options).some(opt => opt.value == targetValue);

            if (!optionExists) {
                let maxVal = 0;
                let maxValStr = "0";
                for (let opt of select.options) {
                    let val = parseInt(opt.value);
                    if (!isNaN(val) && val > maxVal) {
                        maxVal = val;
                        maxValStr = opt.value;
                    }
                }
                targetValue = maxValStr;
            }

            if (select.value != targetValue) {
                select.value = targetValue;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                select.dispatchEvent(new Event('input', { bubbles: true }));
                select.dispatchEvent(new Event('blur', { bubbles: true }));
                updateStatus(`🎫 已選取 ${targetValue} 張`);
                return true;
            }
            return true;
        }
        return false;
    }

    function autoCheckOptions() {
        const checkbox = document.getElementById("ctl00_ContentPlaceHolder1_notConsecutive");
        if (checkbox && !checkbox.checked) {
            checkbox.click();
            if (!checkbox.checked) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }

    async function solveCaptcha(timer) {
        let targetImg = null, targetRoot = null;
        let spans = document.querySelectorAll('span');
        for (let span of spans) {
            if (span.shadowRoot) {
                let img = span.shadowRoot.querySelector('img[src*="pic.aspx"]');
                if (img) { targetImg = img; targetRoot = span.shadowRoot; break; }
            }
        }

        if (!targetImg) return;
        if(timer) clearInterval(timer);
        updateStatus("🕵️‍♂️ 讀取驗證碼...");

        if (!targetImg.complete || targetImg.naturalWidth === 0) await new Promise(r => targetImg.onload = r);

        try {
            let canvas = document.createElement("canvas");
            canvas.width = targetImg.naturalWidth;
            canvas.height = targetImg.naturalHeight;
            canvas.getContext("2d").drawImage(targetImg, 0, 0);
            let base64Data = canvas.toDataURL("image/png");

            updateStatus("📦 辨識中...");
            GM_xmlhttpRequest({
                method: "POST",
                url: API_URL,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ image: base64Data }),
                onload: function(response) {
                    if (response.status === 200) {
                        let result = JSON.parse(response.responseText);
                        updateStatus(`🎉 答案: ${result.code}`);
                        if (result.code) fillAndSubmit(result.code, targetRoot);
                    } else updateStatus("❌ Python Error");
                },
                onerror: () => updateStatus("❌ 連線失敗")
            });
        } catch (e) { console.error(e); }
    }

    function fillAndSubmit(code, shadowRoot) {
        let inputField = document.getElementById("ctl00_ContentPlaceHolder1_CHK");
        if (!inputField) inputField = document.querySelector("input[name$='CHK']");
        if (!inputField && shadowRoot) inputField = shadowRoot.querySelector("input[id*='CHK']");

        if (inputField) {
            inputField.focus();
            inputField.value = code;
            inputField.style.backgroundColor = "#ccffcc";
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
            inputField.dispatchEvent(new Event('change', { bubbles: true }));

            if (USER_AUTO_SUBMIT) {
                updateStatus("🚀 自動送出...");
                sendBark("冬冬勞工", `⚡ 驗證碼填入: ${code} (自動送出)`);
                setTimeout(() => {
                    let nextBtn = findNextButton();
                    if (nextBtn) nextBtn.click();
                }, 100);
            } else {
                updateStatus("✅ 等待手動");
                sendBark("冬冬勞工", `🔔 驗證碼已填: ${code} (等待手動)`);
                setTimeout(() => { let nextBtn = findNextButton(); if(nextBtn) nextBtn.focus(); }, 100);
            }
        }
    }

    function findNextButton() {
        let anchors = document.querySelectorAll('a, button, .btn');
        for (let a of anchors) { if (a.innerText.includes("下一步")) return a; }
        let imgBtns = document.querySelectorAll("input[type='image']");
        for (let btn of imgBtns) { if (btn.src.includes("btn_next") || btn.alt.includes("下一步")) return btn; }
        return document.getElementById("ctl00_ContentPlaceHolder1_btnBuy");
    }

    // ============================================================
    // [UI] 設定面板
    // ============================================================
    function createSettingsPanel() {
        if(document.getElementById('bot-settings-panel')) return;
        const ui = document.createElement('div');
        ui.id = 'bot-settings-panel';
        ui.style.cssText = `position: fixed; top: 100px; right: 20px; z-index: 99999; background: rgba(0,0,0,0.85); color: #fff; padding: 15px; border-radius: 8px; width: 220px; border: 1px solid #777; backdrop-filter: blur(5px);`;
        ui.innerHTML = `
            <div style="border-bottom:1px solid #555; padding-bottom:8px; margin-bottom:10px; font-weight:bold; color:#00ff00;">🤖 冬冬勞工 (ibon-Bark)<span id="bot-close" style="float:right; cursor:pointer; color:#ccc;">✕</span></div>
            <div style="margin-bottom:12px;"><label style="display:block; color:#ddd; margin-bottom:5px;">預計購買張數:</label>
                <select id="bot-set-qty" style="width:100%; padding:5px; background:#333; color:#fff; border:1px solid #555; border-radius:4px;">
                    <option value="1">1 張</option><option value="2">2 張</option><option value="3">3 張</option><option value="4">4 張</option>
                </select></div>
            <div style="margin-bottom:15px;"><label style="display:flex; align-items:center;"><input type="checkbox" id="bot-set-autosubmit" style="width:16px; height:16px; margin-right:8px;"><span style="color:#ffcc00;">自動送出</span></label></div>
            <div style="border-top:1px solid #555; padding-top:10px; text-align:center;">
                <button type="button" id="bot-test-bark" style="width: 48%; padding: 5px; background: #FF9500; color: white; border: none; font-size: 12px; margin-right: 2%; cursor: pointer;">🔔 測試 Bark</button>
                <button type="button" id="bot-clean-cookies" style="width: 48%; padding: 5px; background: #d32f2f; color: white; border: none; font-size: 12px; cursor: pointer;">🔥 清除 Cookie</button>
            </div>
            <div style="margin-top:5px; font-size:10px; color:#aaa; text-align:center;">*強制攔截 *歷史清洗 *F5防護</div>
        `;
        document.body.appendChild(ui);
        document.getElementById('bot-close').onclick = () => ui.remove();
        document.getElementById('bot-clean-cookies').onclick = forceCleanCookies;
        
        // 綁定 Bark 測試按鈕
        document.getElementById('bot-test-bark').onclick = (e) => {
             e.preventDefault();
             sendBark("冬冬勞工", "🔔 測試訊息：ibon 搶票機器人 (Bark) 運作正常！");
        };

        const qtySelect = document.getElementById('bot-set-qty');
        const autoCheck = document.getElementById('bot-set-autosubmit');
        qtySelect.value = USER_TICKET_QTY;
        autoCheck.checked = USER_AUTO_SUBMIT;

        qtySelect.onchange = function() { USER_TICKET_QTY = this.value; GM_setValue('ibon_bot_qty', this.value); };
        autoCheck.onchange = function() { USER_AUTO_SUBMIT = this.checked; GM_setValue('ibon_bot_auto_submit', this.checked); };
    }

    function createStatusPanel(text) {
        if (document.getElementById('bot-status-msg')) return;
        const ui = document.createElement('div');
        ui.style.cssText = `position: fixed; bottom: 20px; left: 20px; z-index: 99999; background: rgba(0,0,0,0.8); color: #fff; padding: 10px 15px; border-radius: 20px; border: 2px solid #00ff00; pointer-events: none;`;
        ui.id = 'bot-status-msg';
        ui.innerText = text || "🚀 機器人啟動中...";
        document.body.appendChild(ui);
    }
    function updateStatus(msg) { const el = document.getElementById('bot-status-msg'); if(el) el.innerText = msg; }

})();