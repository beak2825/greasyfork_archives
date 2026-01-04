// ==UserScript==
// @name         桃園垃圾車路線 Auto (Best Practice Template)
// @namespace    http://tampermonkey.net/
// @version      2024-04-25
// @description  自動選擇桃園垃圾車路線
// @author       You
// @match        https://route.tyoem.gov.tw/*
// @icon         https://route.tyoem.gov.tw/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548235/%E6%A1%83%E5%9C%92%E5%9E%83%E5%9C%BE%E8%BB%8A%E8%B7%AF%E7%B7%9A%20Auto%20%28Best%20Practice%20Template%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548235/%E6%A1%83%E5%9C%92%E5%9E%83%E5%9C%BE%E8%BB%8A%E8%B7%AF%E7%B7%9A%20Auto%20%28Best%20Practice%20Template%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** -------------------------
     *  🟢 1. 全域參數集中管理
     * -------------------------- */
    const CONFIG = {
        areaId: "lagi2-006",
        areaText: "楊梅區",
        routeId: "lagi2-006_2_8",
        routeText: "垃圾清運路八線",
        checkInterval: 500,   // 檢查間隔 (毫秒)
        timeout: 10000        // 最長等待時間 (毫秒)
    };

    /** -------------------------
     *  🟢 2. Log 工具
     * -------------------------- */
    function log(msg, type = "info") {
        const prefix = "[垃圾車腳本]";
        if (type === "error") console.error(prefix, msg);
        else if (type === "warn") console.warn(prefix, msg);
        else console.log(prefix, msg);
    }

    /** -------------------------
     *  🟢 3. UI Toast 提示
     * -------------------------- */
    function showToast(message, color = "green") {
        const div = document.createElement("div");
        div.textContent = message;
        div.style.cssText = `
            position: fixed;
            top: 10px; right: 10px;
            background: ${color};
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }

    /** -------------------------
     *  🟢 4. 選單選擇封裝
     * -------------------------- */
    function selectOption(selectEl, value, text) {
        if (!selectEl) return;
        selectEl.value = value;
        let opt = selectEl.querySelector(`option[value="${value}"]`);
        if (opt) opt.textContent = text;
        selectEl.dispatchEvent(new Event("change"));
    }

    /** -------------------------
     *  🟢 5. 主程式流程
     * -------------------------- */
    let elapsed = 0;
    const interval = setInterval(() => {
        elapsed += CONFIG.checkInterval;

        if (typeof map !== "undefined") {
            const areaSelect  = document.getElementById("realtime-gid");
            const routeSelect = document.getElementById("realtime-rid");
            const errorMsg    = document.getElementById("errorMsg");

            if (areaSelect && routeSelect && errorMsg) {
                // 設定區域
                selectOption(areaSelect, CONFIG.areaId, CONFIG.areaText);
                log(`已選擇區域：${CONFIG.areaText}`);

                // 載入路線
                if (typeof loadRoute === "function") {
                    loadRoute();
                    log("loadRoute() 已呼叫");
                }

                // 設定路線
                selectOption(routeSelect, CONFIG.routeId, CONFIG.routeText);
                log(`已選擇路線：${CONFIG.routeText}`);

                // 顯示路線表
                if (typeof showRouteTable === "function") {
                    showRouteTable();
                    log("showRouteTable() 已呼叫");
                }

                // 顯示提示訊息
                errorMsg.textContent = `${CONFIG.areaText} → ${CONFIG.routeText}`;
                errorMsg.style.display = "block";
                errorMsg.style.color = "green";
                errorMsg.style.fontWeight = "bold";

                showToast(`${CONFIG.areaText} → ${CONFIG.routeText} 已載入 ✅`);

                log(`完成：${CONFIG.areaText} → ${CONFIG.routeText}`);
                clearInterval(interval);
            }
        }

        // 超時機制
        if (elapsed > CONFIG.timeout) {
            log("初始化失敗，map 沒有在預期時間內載入", "error");
            showToast("初始化失敗 ❌", "red");
            clearInterval(interval);
        }
    }, CONFIG.checkInterval);
})();
