// ==UserScript==
// @name         ibon BOTTT V3.8 (超級白名單版 - 絕對不刪排隊與Session)
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  修正清除邏輯：除了保留 IBONQWARE，更加入 ASP.NET_SessionId 保護，確保伺服器連線不中斷，排隊資格不消失。
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
// @grant        window.close
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559035/ibon%20BOTTT%20V38%20%28%E8%B6%85%E7%B4%9A%E7%99%BD%E5%90%8D%E5%96%AE%E7%89%88%20-%20%E7%B5%95%E5%B0%8D%E4%B8%8D%E5%88%AA%E6%8E%92%E9%9A%8A%E8%88%87Session%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559035/ibon%20BOTTT%20V38%20%28%E8%B6%85%E7%B4%9A%E7%99%BD%E5%90%8D%E5%96%AE%E7%89%88%20-%20%E7%B5%95%E5%B0%8D%E4%B8%8D%E5%88%AA%E6%8E%92%E9%9A%8A%E8%88%87Session%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // ⚙️ 核心變數
    // ============================================================
    const API_URL = "http://127.0.0.1:5000/ocr";
    let BARK_KEY = GM_getValue('ibon_bot_bark_key', "uAstvSWHBYVWiBVFDPnwec");
    const AVATAR_URL = "https://megapx-assets.dcard.tw/images/2f638c9b-8f04-40e1-9818-499b857ab216/640.jpeg";

    // 設定
    let USER_TICKET_QTY = GM_getValue('ibon_bot_qty', '2');
    let USER_AUTO_SUBMIT = GM_getValue('ibon_bot_auto_submit', true);
    let USER_AUTO_AREA = GM_getValue('ibon_bot_auto_area', true);
    let USER_CLEAR_MODE = GM_getValue('ibon_bot_clear_mode', false);
    let USER_ENABLE_BARK = GM_getValue('ibon_bot_bark_enable', true);
    let USER_BOT_ENABLED = GM_getValue('ibon_bot_enabled', true);
    let isPanelCollapsed = GM_getValue('ibon_panel_collapsed', false);

    // 網址衛兵
    let USER_MONITOR_KW = GM_getValue('ibon_bot_monitor_kw', 'UTK020');
    let USER_TARGET_URL = GM_getValue('ibon_bot_target_url', '');
    let USER_AUTO_REDIRECT = GM_getValue('ibon_bot_auto_redirect', false);

    // 過濾器
    let FILTER_MODE = GM_getValue('ibon_filter_mode', 'random');
    let FILTER_KEYWORDS = GM_getValue('ibon_filter_keywords', '');
    let FILTER_EXCLUDE_KEYWORDS = GM_getValue('ibon_filter_exclude_keywords', '身障,輪椅');
    let FILTER_MIN_PRICE = GM_getValue('ibon_filter_min_price', 0);
    let FILTER_MAX_PRICE = GM_getValue('ibon_filter_max_price', 99999);
    let FILTER_PRIORITY_AREAS = GM_getValue('ibon_filter_priority_areas', '');
    let FILTER_RETRY_COUNT = GM_getValue('ibon_filter_retry_count', 3);
    let FILTER_WAIT_TIME = GM_getValue('ibon_filter_wait_time', 500);

    // 狀態
    let hasSelectedTicket = false;
    let hasFilledCaptcha = false;
    let filterRetryCounter = 0;
    let isNavigating = false;
    let hasNotifiedBan = false;
    let hasNotifiedUrlChange = false;

    console.log(`🚀 V3.8 超級白名單版啟動`);

    // ============================================================
    // 📝 日誌系統
    // ============================================================
    function log(msg, type = 'info') {
        const time = new Date().toLocaleTimeString('en-GB');
        console.log(`[${time}] ${msg}`);
        updateStatus(msg);
        const logBox = document.getElementById('bot-log-box');
        if (logBox) {
            const line = document.createElement('div');
            let color = '#0f0';
            if (type === 'warn') color = '#FF9500';
            if (type === 'error') color = '#FF4444';
            if (type === 'system') color = '#00FFFF';
            line.innerHTML = `<span style="color:#666; margin-right:5px;">[${time}]</span><span style="color:${color}">${msg}</span>`;
            line.style.borderBottom = "1px solid #222";
            line.style.padding = "2px 0";
            logBox.prepend(line);
            if (logBox.children.length > 50) logBox.removeChild(logBox.lastChild);
        }
    }

    // ============================================================
    // 💀 基礎設施
    // ============================================================
    (function initKiller() {
        const kill = function(msg) { log(`🔪 攔截彈窗: ${msg}`, 'warn'); return true; };
        window.alert = window.confirm = window.prompt = kill;
        if (typeof unsafeWindow !== 'undefined') { unsafeWindow.alert = unsafeWindow.confirm = unsafeWindow.prompt = kill; }

        const css = `
            .modal, .modal-backdrop, .blockUI, .blockMsg, .sweet-alert,
            div[id*='block'], div[class*='overlay'],
            .ui-dialog, .ui-widget-overlay {
                display: none !important; visibility: hidden !important; z-index: -9999 !important;
            }
            #bot-log-box::-webkit-scrollbar { width: 5px; }
            #bot-log-box::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }
        `;
        GM_addStyle(css);

        ['//orders.ibon.com.tw', '//ticket.ibon.com.tw', '//api.day.app'].forEach(host => {
            const link = document.createElement('link'); link.rel = 'dns-prefetch'; link.href = host; document.head.appendChild(link);
        });
    })();

    (function setupRequestInterceptor() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            const options = args[1] || {};
            if (typeof url === 'string' && (url.includes('UTK0201') || url.includes('UTK0202') || url.includes('buy'))) {
                options.headers = options.headers || {};
                options.headers['X-Requested-With'] = 'XMLHttpRequest';
                if (options.body && typeof options.body === 'string') {
                    const params = new URLSearchParams(options.body);
                    params.delete('_ga'); params.delete('_gid'); params.delete('fbclid');
                    options.body = params.toString();
                }
            }
            return originalFetch.apply(this, [url, options]);
        };
    })();

    function remoteOCR(imageBase64) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST", url: API_URL, headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ image: imageBase64 }), timeout: 5000,
                onload: (res) => {
                    if (res.status === 200) { try { resolve(JSON.parse(res.responseText).code); } catch (e) { reject('OCR解析失敗'); } }
                    else { reject(`OCR失敗 ${res.status}`); }
                },
                onerror: () => reject('OCR無連線'), ontimeout: () => reject('OCR逾時')
            });
        });
    }

    function sendBark(title, body) {
        if (!BARK_KEY || !USER_ENABLE_BARK) return;
        const url = `https://api.day.app/${BARK_KEY}/${encodeURIComponent(title)}/${encodeURIComponent(body)}?group=ibon搶票&sound=calypso&icon=${AVATAR_URL}`;
        GM_xmlhttpRequest({ method: "GET", url: url });
    }

    // ============================================================
    // 🧹 超級安全清除 (保護排隊 & Session)
    // ============================================================
    function smartClearAndReload() {
        const whitelist = ['IBONQWARE', 'Checkout_Queue', 'ASP.NET_SessionId', 'Guid', 'ibon_bot'];
        let keepCount = 0;
        let delCount = 0;

        // 1. 清除 LocalStorage (跳過白名單)
        Object.keys(localStorage).forEach(key => {
            if (!whitelist.some(w => key.includes(w))) {
                localStorage.removeItem(key);
            }
        });

        // 2. 清除 Cookies (核心保護)
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

            // 🔥 檢查是否在白名單內 (不區分大小寫)
            const isSafe = whitelist.some(w => name.toLowerCase().includes(w.toLowerCase()));

            if (isSafe) {
                console.log(`🛡️ 保留 Cookie: ${name}`);
                keepCount++;
            } else {
                // 刪除垃圾 Cookie
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.ibon.com.tw";
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=ticket.ibon.com.tw";
                delCount++;
            }
        }

        log(`🧹 清除完成 (刪:${delCount} / 留:${keepCount})`, 'system');

        // 確保 Session 不會斷，稍微延遲後重整
        setTimeout(() => location.reload(), 500);
    }

    // ============================================================
    // 🛡️ 雙欄位衛兵 & IP 封鎖偵測
    // ============================================================
    function checkUrlMonitor() {
        if (!USER_MONITOR_KW || !USER_BOT_ENABLED) return;
        const currentUrl = location.href;

        if (currentUrl.includes(USER_MONITOR_KW)) { hasNotifiedUrlChange = false; return; }
        const safeKeywords = ['UTK0203', 'UTK0204', 'TP0001', 'Checkout', 'Payment', 'Cart', 'OrderResult'];
        if (safeKeywords.some(kw => currentUrl.includes(kw))) { updateStatus("💰 結帳中... 衛兵待命"); return; }

        log(`⚠️ 網址異常: ${location.pathname}`, 'warn');

        if (USER_AUTO_REDIRECT) {
            if (USER_TARGET_URL && USER_TARGET_URL.startsWith('http')) {
                log("🔄 觸發自動跳回...", 'system');
                setTimeout(() => { window.location.href = USER_TARGET_URL; }, 500);
            } else { log("⚠️ 未設定跳回網址", 'error'); }
        } else if (!hasNotifiedUrlChange) {
            sendBark("🚨 網址異動", "已離開監控頁面！");
            hasNotifiedUrlChange = true;
        }
    }

    function checkIPBan() {
        if (hasNotifiedBan) return true;
        const h1 = document.querySelector('h1');
        const bodyText = document.body.innerText;
        const isBanned = (h1 && h1.innerText.includes("連線暫時受限")) || (bodyText.includes("Access Temporarily Restricted"));
        if (isBanned) {
            hasNotifiedBan = true; USER_BOT_ENABLED = false; GM_setValue('ibon_bot_enabled', false);
            sendBark("🚨 自動關閉", "IP被封鎖，已自動關閉。");
            document.body.innerHTML = "<div style='background:red; color:white; font-size:30px; height:100vh; display:flex; align-items:center; justify-content:center;'>🚨 IP 封鎖 - 自動關閉中...</div>";
            setTimeout(() => { window.close(); setTimeout(() => { window.location.href = "about:blank"; }, 200); }, 1000);
            return true;
        }
        return false;
    }

    // ============================================================
    // 🎯 票區過濾與選擇
    // ============================================================
    function parseAreaInfo(row) {
        const areaName = row.querySelector('td[data-title="票區"]')?.innerText?.trim() || '';
        const priceText = row.querySelector('td[data-title="票價"]')?.innerText?.trim() || '0';
        return {
            row: row, areaName: areaName, price: parseInt(priceText.replace(/[^\d]/g, '')) || 0,
            statusText: row.innerText,
            isDisabled: row.classList.contains("disabled"),
            isSoldOut: row.innerText.includes("已售完") || row.innerText.includes("暫無"),
            isAccessible: row.innerText.includes("身障") || row.innerText.includes("輪椅")
        };
    }
    function splitKeywords(str) { return str ? str.split(/[,，]/).map(s => s.trim()).filter(s => s.length > 0) : []; }
    function matchesKeywords(area, inc, exc) {
        const text = (area.areaName + ' ' + area.statusText).toLowerCase();
        if (exc.some(k => text.includes(k.toLowerCase()))) return false;
        if (inc.length === 0) return true;
        return inc.some(k => text.includes(k.toLowerCase()));
    }
    function filterAvailableAreas(rows) {
        const inc = splitKeywords(FILTER_KEYWORDS); const exc = splitKeywords(FILTER_EXCLUDE_KEYWORDS); const pri = splitKeywords(FILTER_PRIORITY_AREAS);
        let normal = [], priority = [];
        for (let row of rows) {
            const info = parseAreaInfo(row);
            if (info.isDisabled || info.isSoldOut) continue;
            if (info.isAccessible && exc.includes('身障')) continue;
            if (!matchesKeywords(info, inc, exc)) continue;
            if (info.price < FILTER_MIN_PRICE || info.price > FILTER_MAX_PRICE) continue;
            if (pri.some(p => info.areaName.includes(p))) priority.push(info);
            else normal.push(info);
        }
        return { priority, normal, all: [...priority, ...normal] };
    }
    function autoSelectAreaRandomly() {
        if (checkIPBan() || isNavigating) return false;
        const root = document.querySelector("#AreaTable > div")?.shadowRoot;
        if (!root) return false;
        const rows = root.querySelectorAll("table tbody tr");
        if (FILTER_MODE === 'disabled' || !USER_AUTO_AREA) return legacyRandomSelect(rows);
        const filtered = filterAvailableAreas(rows);
        if (filtered.all.length === 0) {
            filterRetryCounter++;
            if (filterRetryCounter >= FILTER_RETRY_COUNT) {
                if (FILTER_KEYWORDS && FILTER_KEYWORDS.trim().length > 0) { log('⚠️ 堅持關鍵字等待中...', 'warn'); return false; }
                log('❌ 無符合，改用保底隨機', 'warn'); return legacyRandomSelect(rows);
            }
            setTimeout(autoSelectAreaRandomly, FILTER_WAIT_TIME); return false;
        }
        filterRetryCounter = 0;
        let selected = null;
        if (FILTER_MODE === 'priority') selected = filtered.priority[0] || filtered.normal[0];
        else if (FILTER_MODE === 'price') selected = filtered.all.reduce((min, a) => a.price < min.price ? a : min);
        else selected = filtered.all[Math.floor(Math.random() * filtered.all.length)];
        if (selected) clickRow(selected.row, selected.areaName);
        return true;
    }
    function legacyRandomSelect(rows) {
        if (checkIPBan() || isNavigating) return false;
        let avail = [];
        const exc = splitKeywords(FILTER_EXCLUDE_KEYWORDS);
        for (let row of rows) {
            if (row.classList.contains("disabled") || row.innerText.includes("已售完")) continue;
            if (exc.some(k => row.innerText.includes(k))) continue;
            avail.push(row);
        }
        if (avail.length > 0) {
            const row = avail[Math.floor(Math.random() * avail.length)];
            clickRow(row, row.querySelector('td[data-title="票區"]')?.innerText || "隨機");
            return true;
        }
        return false;
    }
    function clickRow(row, name) {
        log(`🚀 嘗試進入: ${name}`, 'system'); isNavigating = true; row.click();
        const btn = row.querySelector("td.action") || row.querySelector("button") || row.querySelector("a");
        if (btn) {
            btn.click();
            try { const mEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window }); btn.dispatchEvent(mEvent); } catch (e) {}
            if (btn.tagName === 'A' && btn.href && !btn.href.includes('javascript')) window.location.href = btn.href;
        }
        sendBark("選區", `選中: ${name}`); setTimeout(() => isNavigating = false, 1500);
    }

    // ============================================================
    // ⚡ 自動填寫 & 清票邏輯
    // ============================================================
    function initOrderAuto() {
        if (checkIPBan()) return;
        solveCaptchaLoop();
        const loopTimer = setInterval(() => {
            if (checkIPBan()) { clearInterval(loopTimer); return; }
            if (USER_CLEAR_MODE) {
                const cb = document.getElementById("ctl00_ContentPlaceHolder1_notConsecutive");
                if (cb && !cb.checked) { cb.click(); log("🧹 強制勾選不連位"); }
            }
            if (!hasSelectedTicket) hasSelectedTicket = autoSelectTickets();
            const isCaptchaRequired = !!document.querySelector('img[src*="pic.aspx"]');
            if (hasSelectedTicket && (hasFilledCaptcha || !isCaptchaRequired)) {
                if (USER_AUTO_SUBMIT || USER_CLEAR_MODE) {
                    let nextBtn = findNextButton();
                    if (nextBtn) {
                        log("🚀 極速送出中！", 'system');
                        clearInterval(loopTimer);
                        nextBtn.click();
                        sendBark("成功", "⚡ 已按下下一步");
                    }
                }
            }
        }, 100);
    }
    function findNextButton() {
        let btn = document.getElementById("ctl00_ContentPlaceHolder1_btnBuy") || document.getElementById("ctl00_ContentPlaceHolder1_AddShopingCart2");
        if (btn) return btn;
        btn = document.querySelector(".btn-next") || document.querySelector("a[onclick*='btnBuy']");
        if (btn) return btn;
        const targets = document.querySelectorAll('a, button, input[type="button"], input[type="submit"]');
        for (let t of targets) {
            if ((t.innerText && t.innerText.includes("下一步")) || (t.value && t.value.includes("下一步"))) return t;
        }
        return null;
    }
    function autoSelectTickets() {
        const select = document.querySelector("select[id*='AMOUNT_DDL']");
        if (!select) return false;
        if (select.value != USER_TICKET_QTY) {
            let exists = Array.from(select.options).some(o => o.value == USER_TICKET_QTY);
            select.value = exists ? USER_TICKET_QTY : select.options[select.options.length-1].value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            log(`🎫 已選擇 ${select.value} 張票`);
        }
        return true;
    }
    function solveCaptchaLoop() {
        let count = 0;
        const timer = setInterval(async () => {
            count++;
            const img = document.querySelector('img[src*="pic.aspx"]');
            if (img) {
                clearInterval(timer);
                log("🔍 OCR 識別中...");
                if (!img.complete) await new Promise(r => img.onload = r);
                try {
                    let cvs = document.createElement("canvas");
                    cvs.width = img.naturalWidth; cvs.height = img.naturalHeight;
                    cvs.getContext("2d").drawImage(img, 0, 0);
                    const code = await remoteOCR(cvs.toDataURL("image/png"));
                    if(code) {
                        hasFilledCaptcha = true;
                        const inp = document.getElementById("ctl00_ContentPlaceHolder1_CHK");
                        if(inp) { inp.value = code; inp.style.background="#ccffcc"; inp.dispatchEvent(new Event('change')); }
                        log(`✅ OCR 成功: ${code}`, 'system');
                    }
                } catch(e) { log("❌ OCR 失敗", 'error'); }
            }
            if (count > 50) clearInterval(timer);
        }, 300);
    }

    // ============================================================
    // 🎨 UI 介面
    // ============================================================
    function createSettingsPanel() {
        if(document.getElementById('bot-settings-panel')) return;
        const ui = document.createElement('div');
        ui.id = 'bot-settings-panel';
        ui.style.cssText = `position: fixed; top: 80px; right: 20px; z-index: 99999; background: rgba(0,0,0,0.9); color: #fff; padding: 12px; border-radius: 8px; width: ${isPanelCollapsed ? '150px' : '260px'}; border: 2px solid #00ff00; font-family: Arial; font-size: 12px;`;

        ui.innerHTML = `
            <div style="margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                <b style="color:#0f0; font-size:14px;">🤖 V3.8 排隊保護</b>
                <span>
                    <button id="bot-toggle" style="background:${USER_BOT_ENABLED?'#28a745':'#dc3545'}; border:none; color:#fff; border-radius:3px; cursor:pointer;">${USER_BOT_ENABLED?'運行':'暫停'}</button>
                    <span id="bot-min" style="cursor:pointer; margin-left:5px; font-weight:bold;">${isPanelCollapsed?'□':'－'}</span>
                </span>
            </div>
            <div id="panel-content" style="display:${isPanelCollapsed?'none':'block'}">
                <div style="background:#222; padding:8px; border-radius:4px; margin-bottom:8px;">
                    <div style="margin-bottom:5px;">
                        <label>張數: <select id="bot-qty" style="background:#333; color:#fff; border:1px solid #555;"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label>
                        <label style="margin-left:10px;"><input type="checkbox" id="bot-area"> 自動選區</label>
                    </div>
                    <div style="margin-bottom:5px;"><label><input type="checkbox" id="bot-submit"> 自動送出</label></div>
                    <div><label style="color:#ff4444; font-weight:bold;"><input type="checkbox" id="bot-clear"> 🧹 清票模式 (強制不連位)</label></div>
                </div>

                <div style="border:1px solid #FF9500; padding:8px; border-radius:4px; margin-bottom:8px; background:rgba(255,149,0,0.1);">
                    <div style="color:#FF9500; font-weight:bold; margin-bottom:5px;">🛡️ 網址衛兵 (雙欄位)</div>
                    <div style="margin-bottom:5px;"><input id="bot-monitor-kw" placeholder="監控關鍵字 (如: UTK020)" style="width:95%; background:#333; color:#FF9500; border:1px solid #555;"></div>
                    <div style="margin-bottom:5px;"><input id="bot-target-url" placeholder="跳回網址 (完整URL)" style="width:95%; background:#333; color:#0f0; border:1px solid #555;"></div>
                    <div style="margin-top:5px;"><label><input type="checkbox" id="bot-redirect"> 離線自動跳回</label></div>
                </div>

                <div style="border:1px solid #0096ff; padding:8px; border-radius:4px; margin-bottom:8px; background:rgba(0,150,255,0.1);">
                    <div style="color:#0096ff; font-weight:bold; margin-bottom:5px;">🎯 過濾器</div>
                    <select id="bot-mode" style="width:100%; margin-bottom:5px; background:#333; color:#fff;"><option value="random">🎲 智能隨機</option><option value="priority">🎯 優先票區</option><option value="price">💰 最低價</option><option value="disabled">🚫 關閉</option></select>
                    <input id="bot-keys" placeholder="包含關鍵字 (嚴格)" style="width:95%; margin-bottom:5px; background:#333; color:#0f0; border:1px solid #555;">
                    <input id="bot-exc" placeholder="排除關鍵字" style="width:95%; margin-bottom:5px; background:#333; color:#f00; border:1px solid #555;">
                </div>

                <div style="border-top:1px solid #555; padding-top:5px;">
                    <div style="font-size:11px; color:#aaa; margin-bottom:3px;">📜 運行紀錄</div>
                    <div id="bot-log-box" style="height:120px; background:#000; color:#0f0; padding:5px; overflow-y:auto; font-family:monospace; font-size:10px; border:1px solid #333; border-radius:3px;"></div>
                </div>

                <div style="margin-top:8px;">
                    <button id="bot-reset" style="width:100%; background:#d32f2f; color:#fff; border:none; padding:5px; border-radius:3px; cursor:pointer;">⚠️ 清除暫存 (保留排隊)</button>
                </div>
            </div>
        `;
        document.body.appendChild(ui);

        const bind = (id, val, set) => {
            const el = document.getElementById(id);
            if(el) {
                if(el.type==='checkbox'){ el.checked=val; el.onchange=function(){ set(this.checked); }}
                else{ el.value=val; el.onchange=function(){ set(this.value); }}
            }
        };

        bind('bot-qty', USER_TICKET_QTY, v => { USER_TICKET_QTY=v; GM_setValue('ibon_bot_qty',v); });
        bind('bot-area', USER_AUTO_AREA, v => { USER_AUTO_AREA=v; GM_setValue('ibon_bot_auto_area',v); });
        bind('bot-submit', USER_AUTO_SUBMIT, v => { USER_AUTO_SUBMIT=v; GM_setValue('ibon_bot_auto_submit',v); });
        bind('bot-clear', USER_CLEAR_MODE, v => { USER_CLEAR_MODE=v; GM_setValue('ibon_bot_clear_mode',v); });

        bind('bot-monitor-kw', USER_MONITOR_KW, v => { USER_MONITOR_KW=v; GM_setValue('ibon_bot_monitor_kw',v); });
        bind('bot-target-url', USER_TARGET_URL, v => { USER_TARGET_URL=v; GM_setValue('ibon_bot_target_url',v); });
        bind('bot-redirect', USER_AUTO_REDIRECT, v => { USER_AUTO_REDIRECT=v; GM_setValue('ibon_bot_auto_redirect',v); });

        bind('bot-mode', FILTER_MODE, v => { FILTER_MODE=v; GM_setValue('ibon_filter_mode',v); });
        bind('bot-keys', FILTER_KEYWORDS, v => { FILTER_KEYWORDS=v; GM_setValue('ibon_filter_keywords',v); });
        bind('bot-exc', FILTER_EXCLUDE_KEYWORDS, v => { FILTER_EXCLUDE_KEYWORDS=v; GM_setValue('ibon_filter_exclude_keywords',v); });

        document.getElementById('bot-min').onclick = () => {
            isPanelCollapsed = !isPanelCollapsed;
            GM_setValue('ibon_panel_collapsed', isPanelCollapsed);
            document.getElementById('panel-content').style.display = isPanelCollapsed ? 'none' : 'block';
            document.getElementById('bot-settings-panel').style.width = isPanelCollapsed ? '150px' : '260px';
            document.getElementById('bot-min').innerText = isPanelCollapsed ? '□' : '－';
        };

        document.getElementById('bot-toggle').onclick = function() {
            USER_BOT_ENABLED = !USER_BOT_ENABLED;
            GM_setValue('ibon_bot_enabled', USER_BOT_ENABLED);
            this.innerText = USER_BOT_ENABLED ? '運行' : '暫停';
            this.style.background = USER_BOT_ENABLED ? '#28a745' : '#dc3545';
            log(USER_BOT_ENABLED ? '✅ 機器人啟動' : '🛑 機器人暫停', 'system');
            if(USER_BOT_ENABLED) setTimeout(() => location.reload(), 500);
        };

        // 綁定智慧清除
        document.getElementById('bot-reset').onclick = smartClearAndReload;

        log("✅ 面板載入完成", 'system');
    }

    function createStatusPanel(text) {
        if(document.getElementById('bot-status-msg')) return;
        const div = document.createElement('div');
        div.id = 'bot-status-msg';
        div.style.cssText = `position:fixed; bottom:10px; left:10px; background:rgba(0,0,0,0.8); color:#fff; padding:8px 15px; border-radius:20px; border:2px solid #0f0; font-size:12px; z-index:99999;`;
        div.innerText = text;
        document.body.appendChild(div);
    }

    function updateStatus(msg) {
        const el = document.getElementById('bot-status-msg');
        if(el) {
            el.innerText = USER_BOT_ENABLED ? msg : "🛑 暫停中";
            el.style.borderColor = USER_BOT_ENABLED ? '#0f0' : '#f00';
        }
    }

    // ============================================================
    // 🚀 主程式
    // ============================================================
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initBot);
    else initBot();

    function initBot() {
        if (checkIPBan()) return;
        if (location.hostname.includes("ibon.com.tw")) createSettingsPanel();
        if (!USER_BOT_ENABLED) return;

        setInterval(checkUrlMonitor, 1000);

        if (location.pathname.includes("UTK0201_000.aspx")) {
            if (USER_AUTO_AREA) {
                createStatusPanel((FILTER_KEYWORDS) ? '🎯 嚴格過濾...' : '🎲 智能選區...');
                log(`開始選區... 模式: ${FILTER_KEYWORDS ? '嚴格' : '隨機'}`);
                setInterval(autoSelectAreaRandomly, 200);
            } else createStatusPanel("🛑 手動選區");
        } else if (location.pathname.includes("UTK0201_001.aspx") || location.search.includes("PERFORMANCE_PRICE_AREA_ID")) {
            createStatusPanel("🎫 自動填寫...");
            initOrderAuto();
        }
    }
})();