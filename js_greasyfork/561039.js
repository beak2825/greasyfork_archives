// ==UserScript==
// @name         ibon 搶票助手 (V9.4 Bark專用版)
// @namespace    http://tampermonkey.net/
// @version      9.4
// @description  Bark通知(冬冬勞工/Calypso)、排除一般/身障、依照A-Z排序、僅在票數變動時通知
// @author       Gemini
// @match        https://orders.ibon.com.tw/*
// @connect      api.day.app
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/561039/ibon%20%E6%90%B6%E7%A5%A8%E5%8A%A9%E6%89%8B%20%28V94%20Bark%E5%B0%88%E7%94%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561039/ibon%20%E6%90%B6%E7%A5%A8%E5%8A%A9%E6%89%8B%20%28V94%20Bark%E5%B0%88%E7%94%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 您的專屬設定 ---
    const BARK_KEY = "uAstvSWHBYVWiBVFDPnwec";
    const AVATAR_URL = "https://megapx-assets.dcard.tw/images/2f638c9b-8f04-40e1-9818-499b857ab216/640.jpeg";

    // 讀取「上一次的票況紀錄」 (防洗版核心)
    let lastKnownState = JSON.parse(GM_getValue('ibon_ticket_state_v9_bark', '{}'));

    // --- 2. UI 建立 ---
    const PANEL_ID = 'ibon-v9-bark-panel';

    function createPanel() {
        if (document.getElementById(PANEL_ID)) return document.getElementById(PANEL_ID);

        const div = document.createElement('div');
        div.id = PANEL_ID;
        div.style.cssText = `
            position: fixed; top: 10px; left: 10px; z-index: 999999;
            background: #fff; border: 2px solid #FF9500;
            padding: 10px; border-radius: 8px; font-family: "Microsoft JhengHei", sans-serif;
            width: 300px; max-height: 90vh; overflow-y: auto;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;

        const statusColor = BARK_KEY ? "green" : "red";
        const statusText = BARK_KEY ? "✅ Bark 已連線" : "❌ 未設定 Key";

        div.innerHTML = `
            <div style="border-bottom:1px solid #eee; padding-bottom:5px; margin-bottom:5px; font-weight:bold; color:#FF9500; display:flex; justify-content:space-between; align-items:center;">
                <span>🎯 監控中 (Bark版)</span>
                <span style="font-size:10px; color:${statusColor};">${statusText}</span>
            </div>

            <div style="font-size:11px; color:#666; margin-bottom:5px; background:#f8f9fa; padding:5px; border-radius:4px;">
                🚫 排除：一般區、身障區<br>
                🔔 規則：僅通知「數量變化」
            </div>

            <div id="v9-list" style="font-size: 13px; min-height:50px;">正在掃描...</div>

            <div style="margin-top:10px; border-top:1px dashed #ccc; padding-top:5px; text-align:right;">
                <button id="test-bark" style="font-size:10px; background:#FF9500; color:white; border:none; cursor:pointer; padding:3px 8px; border-radius:3px; margin-right:5px;">🔔 測試 Bark</button>
                <button id="reset-history" style="font-size:10px; background:#dc3545; color:white; border:none; cursor:pointer; padding:3px 8px; border-radius:3px;">🗑️ 重置記憶</button>
            </div>
        `;
        document.body.appendChild(div);

        // 測試按鈕
        document.getElementById('test-bark').onclick = () => {
            sendBarkMessage("🔔 測試訊息：冬冬勞工 (Bark) 準備好搶票了！");
        };

        // 重置記憶按鈕
        document.getElementById('reset-history').onclick = () => {
            GM_setValue('ibon_ticket_state_v9_bark', '{}');
            lastKnownState = {};
            alert("記憶已清除！下次掃描將會把所有現有票券視為「新發現」並發送通知。");
            location.reload();
        };

        return div;
    }

    // --- 3. Bark 發送邏輯 ---
    function sendBarkMessage(text) {
        if (!BARK_KEY) {
            console.error("❌ Bark Key 未設定");
            return;
        }

        console.log(">>> [Bark發送]", text);

        // Bark URL 結構: https://api.day.app/{key}/{title}/{body}?params
        const title = encodeURIComponent("冬冬勞工");
        const body = encodeURIComponent(text);
        const icon = encodeURIComponent(AVATAR_URL);
        const url = `https://api.day.app/${BARK_KEY}/${title}/${body}?group=ibon搶票&sound=calypso&icon=${icon}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(res) {
                if (res.status >= 200 && res.status < 300) {
                    console.log("✅ Bark 發送成功");
                } else {
                    console.error("❌ Bark 發送失敗", res.responseText);
                }
            },
            onerror: function(err) {
                console.error("❌ Bark 連線錯誤", err);
            }
        });
    }

    // --- 4. 核心掃描與過濾 ---
    function scanAreas() {
        const listDiv = document.getElementById('v9-list');
        const areas = document.querySelectorAll('area');

        if (areas.length === 0) {
            listDiv.innerHTML = "⏳ 載入座位圖...";
            return;
        }

        const validItems = [];
        const seenKeys = new Set();
        let stateChanged = false; // 標記是否有狀態更新

        // A. 蒐集與過濾
        areas.forEach((area) => {
            const title = area.getAttribute('title') || '';
            const href = area.getAttribute('href');
            if (!href || !title) return;

            // 解析
            const nameMatch = title.match(/票區[:：]\s*([^\s]+)/);
            const priceMatch = title.match(/票價[:：]\s*(\d+)/);
            const statusMatch = title.match(/尚餘[:：]\s*([^\s]+)/);

            if (nameMatch && statusMatch) {
                const name = nameMatch[1];
                const price = priceMatch ? priceMatch[1] : '?';
                const status = statusMatch[1];

                // === 過濾規則 ===
                // 1. 排除售完 (狀態為 0)
                if (status === '0') return;
                // 2. 排除一般區與身障區
                if (name.includes('一般') || name.includes('身障')) return;

                const uniqueKey = `${name}-${price}`;

                // 去重
                if (!seenKeys.has(uniqueKey)) {
                    seenKeys.add(uniqueKey);
                    validItems.push({
                        name: name,
                        price: price,
                        status: status,
                        href: href,
                        key: uniqueKey
                    });
                }
            }
        });

        // B. 排序 (A -> Z)
        validItems.sort((a, b) => {
            return a.name.localeCompare(b.name, 'zh-Hant', { numeric: true });
        });

        // C. 顯示與通知
        if (validItems.length === 0) {
            listDiv.innerHTML = `<div style="text-align:center; color:#999; padding:10px;">
                😴 無票<br><span style="font-size:10px">(一般/身障已隱藏)</span>
            </div>`;
        } else {
            let html = `<div style="color:green; font-size:12px; margin-bottom:5px;">✅ 監控中 (${validItems.length} 區)：</div>`;

            validItems.forEach(item => {
                // UI 顏色
                const isHot = item.status.includes('熱賣');
                const btnColor = isHot ? '#dc3545' : '#28a745';
                const btnText = isHot ? '🔥 搶' : `⚡ 剩 ${item.status}`;

                html += `
                    <div style="margin-bottom:6px; padding:6px; background:#f8f9fa; border:1px solid #ddd; border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
                        <div style="flex:1;">
                            <div style="font-weight:bold; font-size:13px; color:#333;">${item.name}</div>
                            <div style="font-size:11px; color:#666;">$${item.price} | 狀態: ${item.status}</div>
                        </div>
                        <a href="${item.href}" style="background:${btnColor}; color:white; text-decoration:none; padding:5px 10px; border-radius:4px; font-size:12px; font-weight:bold;">
                            ${btnText}
                        </a>
                    </div>
                `;

                // === 關鍵通知邏輯 ===
                const lastStatus = lastKnownState[item.key];

                // 只有當「上次沒紀錄」或「狀態改變」時才通知
                if (lastStatus !== item.status) {
                    console.log(`狀態改變: ${item.name} (${lastStatus} -> ${item.status})`);

                    const msg = `🚨 票數變動通知\n` +
                                `🎫 區域：${item.name}\n` +
                                `💰 價格：${item.price}\n` +
                                `📊 狀態：${lastStatus || '新發現'} ➝ ${item.status}\n` +
                                `⏰ 時間：${new Date().toLocaleTimeString()}\n` +
                                `🔗 點我前往購票：${window.location.origin}${item.href}`;

                    sendBarkMessage(msg);

                    // 更新記憶
                    lastKnownState[item.key] = item.status;
                    stateChanged = true;
                }
            });

            listDiv.innerHTML = html;
        }

        // 儲存最新的狀態到瀏覽器
        if (stateChanged) {
            GM_setValue('ibon_ticket_state_v9_bark', JSON.stringify(lastKnownState));
        }
    }

    // --- 5. 啟動 ---
    window.addEventListener('load', () => {
        createPanel();
        setTimeout(scanAreas, 500);
        setInterval(scanAreas, 2000);
    });

})();