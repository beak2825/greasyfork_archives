// ==UserScript==
// @name         98助手 (全功能整合精簡版)
// @namespace    https://www.sehuatang.net
// @version      202510161410
// @description  自動翻頁、圖片預覽、黑名單、快速評分、簽到等全功能整合腳本。(重構 by Gemini)
// @author       Joey (修改 by Gemini)
// @match        *://*.sehuatang.net/*
// @match        *://*.sehuatang.org/*
// @match        *://*.sehuatang.*/*
// @match        *://*.jq2t4.com/*
// @match        *://*.0krgb.com/*
// @match        *://*.xxjsnc.co/*
// @match        *://*.o4vag.com/*
// @match        *://*.weterytrtrr.*/*
// @match        *://*.qweqwtret.*/*
// @match        *://*.retreytryuyt.*/*
// @match        *://*.qwerwrrt.*/*
// @match        *://*.ds5hk.app/*
// @match        *://*.30fjp.com/*
// @match        *://*.18stm.cn/*
// @match        *://*.xo6c5.com/*
// @match        *://*.mzjvl.com/*
// @match        *://*.9xr2.app/*
// @match        *://*.nwurc.com/*
// @match        *://*.zbkz6.app/*
// @match        *://*.ql75t.cn/*
// @match        *://*.0uzb0.app/*
// @match        *://*.d2wpb.com/*
// @match        *://*.5aylp.com/*
// @match        *://*.8otvk.app/*
// @match        *://*.05kx.cc/*
// @match        *://*.1yxg2.com/*
// @match        *://*.6r5gy.co/*
// @match        *://*.mmpbg.co/*
// @match        *://*.kofqo.com/*
// @match        *://*.kofqo.net/*
// @match        *://*.5rmt2.net/*
// @match        *://*.n8cv.net/*
// @match        *://*gw3y.q5muo.com/*
// @match        *://*56vl.qmhxu.com/*
// @match        *://*raef.gy7kj.com/*
// @match        *://*799.u8dnv.net/*
// @match        *://*m86p7.387l9.net/*
// @match        *://*.fhmm.fu2zu.net/*
// @match        *://*.kzs1w.com/*
// @exclude      */forum.php?mod=forumdisplay&fid=96*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.lazyload@1.9.3/jquery.lazyload.min.js
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/548890/98%E5%8A%A9%E6%89%8B%20%28%E5%85%A8%E5%8A%9F%E8%83%BD%E6%95%B4%E5%90%88%E7%B2%BE%E7%B0%A1%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548890/98%E5%8A%A9%E6%89%8B%20%28%E5%85%A8%E5%8A%9F%E8%83%BD%E6%95%B4%E5%90%88%E7%B2%BE%E7%B0%A1%E7%89%88%29.meta.js
// ==/UserScript==

/* global $, showWindow, GM */

(async function () {
    "use strict";

    // #region 全域變數與設定
    let activeTooltips = 0;
    const baseURL = `https://${window.location.host}`;
    const DEFAULT_TID_OPTIONS = [
        { value: 95, label: "綜合區" }, { value: 166, label: "AI區" }, { value: 141, label: "原創區" }, { value: 142, label: "轉帖區" }, { value: 96, label: "投訴區" }, { value: 97, label: "出售區" }, { value: 143, label: "懸賞區" }, { value: 2, label: "國產原創" }, { value: 36, label: "亞洲無碼" }, { value: 37, label: "亞洲有碼" }, { value: 103, label: "中文字幕" }, { value: 107, label: "三級寫真" }, { value: 160, label: "VR影片區" }, { value: 104, label: "素人有碼" }, { value: 38, label: "歐美無碼" }, { value: 151, label: "4K原版" }, { value: 152, label: "韓國主播" }, { value: 39, label: "動漫原創" }, { value: 154, label: "文學區原創人生" }, { value: 135, label: "文學區亂倫人妻" }, { value: 137, label: "文學區青春校園" }, { value: 138, label: "文學區武俠玄幻" }, { value: 136, label: "文學區激情都市" }, { value: 139, label: "文學區TXT下載" }, { value: 145, label: "原檔自提字幕區" }, { value: 146, label: "原檔自譯字幕區" }, { value: 121, label: "原檔字幕分享區" }, { value: 159, label: "原檔新作區" }, { value: 41, label: "在線國產自拍" }, { value: 109, label: "在線中文字幕" }, { value: 42, label: "在線日韓無碼" }, { value: 43, label: "在線日韓有碼" }, { value: 44, label: "在線歐美風情" }, { value: 45, label: "在線卡通動漫" }, { value: 46, label: "在線劇情三級" }, { value: 155, label: "圖區原創自拍" }, { value: 125, label: "圖區轉帖自拍" }, { value: 50, label: "圖區華人街拍" }, { value: 48, label: "圖區亞洲性愛" }, { value: 49, label: "圖區歐美性愛" }, { value: 117, label: "圖區卡通動漫" }, { value: 165, label: "圖區套圖下載" },
    ];
    // #endregion

    // #region 獲取使用者設定
    function getSettings() {
        const getJSONValue = (key, defaultValue) => {
            const storedValue = GM_getValue(key, JSON.stringify(defaultValue));
            try {
                return JSON.parse(storedValue);
            } catch (e) {
                console.error(`[98助手] 解析設定錯誤 "${key}":`, e, `Stored value: ${storedValue}`);
                return defaultValue;
            }
        };

        return {
            enableImagePreview: GM_getValue("enableImagePreview", true),
            imgMaxWidth: GM_getValue('imgMaxWidth', 250),
            imgMaxHeight: GM_getValue('imgMaxHeight', 300),
            displayBlockedTips: GM_getValue("displayBlockedTips", true),
            autoPagination: GM_getValue("autoPagination", true),
            showImageButton: GM_getValue("showImageButton", "hide"),
            lastCheckedUpdate: GM_getValue("lastCheckedUpdate", 0),
            maxGradeThread: GM_getValue("maxGradeThread", 10),
            displayThreadBuyInfo: GM_getValue("displayThreadBuyInfo", true),
            showDown: GM_getValue("showDown", true),
            showCopyCode: GM_getValue("showCopyCode", true),
            showFastReply: GM_getValue("showFastReply", true),
            showQuickGrade: GM_getValue("showQuickGrade", true),
            showQuickStar: GM_getValue("showQuickStar", true),
            showClickDouble: GM_getValue("showClickDouble", true),
            showViewRatings: GM_getValue("showViewRatings", true),
            showPayLog: GM_getValue("showPayLog", true),
            showFastCopy: GM_getValue("showFastCopy", true),
            blockingResolved: GM_getValue("blockingResolved", true),
            blockingIndex: GM_getValue("blockingIndex", false),
            qiandaoTip: GM_getValue("qiandaoTip", true),
            menuButtonIsVisible: GM_getValue("menuButtonIsVisible", true),
            enableLinkRepair: GM_getValue("enableLinkRepair", true),
            excludeGroup: getJSONValue("excludeGroup", []),
            TIDGroup: getJSONValue("TIDGroup", []),
            orderFids: getJSONValue("orderFids", []),
            excludeOptions: getJSONValue("excludeOptions", ["度盘", "夸克", "内容隐藏", "搬运", "SHA1"]),
            excludePostOptions: getJSONValue("excludePostOptions", ["度盘", "夸克"]),
            blockedUsers: getJSONValue("blockedUsers", [""]),
        };
    }
    // #endregion

    // #region 樣式
    function addStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
                .bgsh-customBtn, .bgsh-searchBtn, .bgsh-quickReplyToPostBtn, .bgsh-openAllUrlBtn {
                    padding: 8px 15px; margin-bottom: 8px; margin-right: 8px; width: 100%;
                    border: none; outline: none; white-space: pre-line; border-radius: 8px;
                    font-size: 13px; font-weight: 500; color: #ffffff; cursor: pointer;
                    box-shadow: -5px -5px 8px #F6CEEC, 5px 5px 8px #BC78EC; transition: 0.8s;
                }
                .bgsh-quickReplyToPostBtn{ width: auto; float: right; box-shadow: -5px -5px 8px #F6CEEC, 5px 5px 8px #C346C2; }
                .bgsh-openAllUrlBtn { width: 100px; font-size: 16px; padding: 0; box-shadow: 0 0px 0px #ccc; }
                .bgsh-searchBtn { max-width: 400px; background-color: #0D25B9; }
                .bgsh-customBtn:hover { transform: scale(1.05); background-color: #ABDCFF; box-shadow: inset 5px 5px 10px #7367F0, inset -5px -5px 10px #CE9FFC; }
                .bgsh-searchBtn:hover { transform: scale(1.05); background-color: #5961F9; box-shadow: inset 5px 5px 10px #7367F0, inset -5px -5px 10px #CE9FFC; }
                .bgsh-quickReplyToPostBtn:hover { transform: scale(1.05); background-color: #32CCBC; box-shadow: inset 5px 5px 10px #1D6FA3, inset -5px -5px 10px #65FDF0; }
                .advanced-search { position: fixed; right: calc(150px + 1vh); top: 100px; z-index: 1000; background: #fff; border: 1px solid #ddd; padding: 10px; display: grid; grid-template-columns: auto auto; column-gap: 20px; }
                .advanced-search .bgsh-forget { max-height: 580px; overflow: visible; display: flex; flex-wrap: wrap; flex-direction: column; }
                .bgsh-forget .bgsh-checkbox-label { display: block; position: relative; cursor: pointer; font-size: 22px; line-height: 22px; margin-right: 10px; }
                .bgsh-label-text { display: inline-block; font-weight: 500; left: 12%; font-size: 13px; }
                .bgsh-forget .bgsh-checkbox-label input { opacity: 0; cursor: pointer; }
                .bgsh-checkbox-label .bgsh-checkbox-custom { position: absolute; top: 0; left: 0; height: 20px; width: 20px; background-color: #ecf0f3; border-radius: 5px; border: none; box-shadow: inset 3px 3px 3px #cbced1, inset -3px -3px 3px #fff; }
                .bgsh-checkbox-label input:checked ~ .bgsh-checkbox-custom { box-shadow: -4px -4px 4px #feffff, 4px 4px 4px #161b1d2f; }
                .bgsh-checkbox-label .bgsh-checkbox-custom::after { position: absolute; content: ""; left: 10px; top: 10px; height: 0; width: 0; border-radius: 5px; border: solid #635f5f; border-width: 0 3px 3px 0; transform: rotate(0deg) scale(0); opacity: 1; transition: all 0.3s ease-out; }
                .bgsh-checkbox-label input:checked ~ .bgsh-checkbox-custom::after { transform: rotate(45deg) scale(1); left: 7px; top: 3px; width: 4px; height: 8px; }
                .bgsh-checkbox-label .bgsh-checkbox-custom::before { position: absolute; content: ""; left: 5px; top: 9px; width: 10px; height: 2px; background-color: #635f5f; opacity: 0; transition: opacity 0.3s ease-out; }
                .bgsh-checkbox-label input:indeterminate ~ .bgsh-checkbox-custom::before { opacity: 1; }
                .bgsh-dateInput { border: 1px solid #d4d4d4; border-radius: 5px; background-color: #fff; transition: border 0.3s; margin: 0 5px; width: 120px; }
                .bgsh-dateInput:focus { border-color: #007BFF; outline: none; box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); }
                .bgsh-dateInput:hover { border-color: #b3b3b3; }
                .sht-tooltip {
                    position: fixed; left: 50%; transform: translate(-50%, -50%);
                    background-color: #333; color: #fff; padding: 20px 40px;
                    border-radius: 10px; z-index: 10000; font-size: 24px;
                    opacity: 1; transition: opacity 0.5s ease-in-out;
                }
                .sht-tooltip.sht-fade-out { opacity: 0; }
            `;
        document.head.appendChild(style);
    }
    // #endregion

    // #region 訊息提示
    function showTooltip(message) {
        const tooltip = document.createElement("div");
        tooltip.className = 'sht-tooltip';
        tooltip.style.top = `calc(33.33% + ${activeTooltips * 80}px)`;
        tooltip.textContent = "友情提示: " + message;
        document.body.appendChild(tooltip);
        activeTooltips++;

        setTimeout(() => {
            tooltip.classList.add('sht-fade-out');
            tooltip.addEventListener('transitionend', () => {
                tooltip.remove();
                activeTooltips--;
            });
        }, 2000);
    }
    // #endregion

    // #region Tampermonkey 選單命令註冊
    GM_registerMenuCommand("98助手設定", () => {
        createSettingsUI(getSettings());
    });
    // #endregion

    // #region 設定介面
    function generateSettingsHTML(settings) {
        return `
                <div class='bgsh-setting-box'>
                    <div class='bgsh-setting-box-container'>
                        <div class="bgsh-setting-first">
                            <label for="maxGradeThread">主帖評分最大值:</label>
                            <input type="number" id="maxGradeThread" value="${settings.maxGradeThread}"><br>
                            <label class='bgsh-setting-checkbox-label' for="enableImagePreviewCheckbox"><input type='checkbox' id="enableImagePreviewCheckbox" ${settings.enableImagePreview ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用列表圖片預覽</span></label><br>
                            <label for="imgMaxWidthInput">預覽圖最大寬度 (px):</label>
                            <input type="number" id="imgMaxWidthInput" value="${settings.imgMaxWidth}"><br>
                            <label for="imgMaxHeightInput">預覽圖最大高度 (px):</label>
                            <input type="number" id="imgMaxHeightInput" value="${settings.imgMaxHeight}"><br>
                            <label class='bgsh-setting-checkbox-label' for="displayBlockedTipsCheckbox"><input type='checkbox' id="displayBlockedTipsCheckbox" ${settings.displayBlockedTips ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>顯示黑名單屏蔽提示</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="autoPaginationCheckbox"><input type='checkbox' id="autoPaginationCheckbox" ${settings.autoPagination ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用自動翻頁</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="displayThreadBuyInfoCheckbox"><input type='checkbox' id="displayThreadBuyInfoCheckbox" ${settings.displayThreadBuyInfo ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>顯示購買次數</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="showDownCheckbox"><input type='checkbox' id="showDownCheckbox" ${settings.showDown ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用下載附件</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="showCopyCodeCheckbox"><input type='checkbox' id="showCopyCodeCheckbox" ${settings.showCopyCode ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用代碼</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="showFastReplyCheckbox"><input type='checkbox' id="showFastReplyCheckbox" ${settings.showFastReply ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用快速回覆</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="showQuickGradeCheckbox"><input type='checkbox' id="showQuickGradeCheckbox" ${settings.showQuickGrade ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用快速評分</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="showQuickStarCheckbox"><input type='checkbox' id="showQuickStarCheckbox" ${settings.showQuickStar ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用快速收藏</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="showClickDoubleCheckbox"><input type='checkbox' id="showClickDoubleCheckbox" ${settings.showClickDouble ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用一鍵二連</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="showViewRatingsCheckbox"><input type='checkbox' id="showViewRatingsCheckbox" ${settings.showViewRatings ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用查看評分</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="showPayLogCheckbox"><input type='checkbox' id="showPayLogCheckbox" ${settings.showPayLog ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用購買記錄</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="showFastCopyCheckbox"><input type='checkbox' id="showFastCopyCheckbox" ${settings.showFastCopy ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用複製帖子</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="blockingIndexCheckbox"><input type='checkbox' id="blockingIndexCheckbox" ${settings.blockingIndex ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>屏蔽首頁熱門</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="qiandaoTipCheckbox"><input type='checkbox' id="qiandaoTipCheckbox" ${settings.qiandaoTip ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>簽到提示</span></label><br>
                            <label class='bgsh-setting-checkbox-label' for="enableLinkRepairCheckbox"><input type='checkbox' id="enableLinkRepairCheckbox" ${settings.enableLinkRepair ? "checked" : ""}><span class='bgsh-setting-checkbox-custom'></span><span>啟用連結路徑修復</span></label><br>
                        </div>
                        <div class="bgsh-setting-second">
                            <label for="excludeOptionsTextarea">進階搜尋排除關鍵字（每行一個）:</label><br>
                            <textarea id="excludeOptionsTextarea">${settings.excludeOptions.join("\n")}</textarea><br>
                            <label for="blockedUsersList">黑名單屏蔽的使用者名稱（每行一個）：</label><br>
                            <textarea id="blockedUsersList">${settings.blockedUsers.join("\n")}</textarea><br>
                            <label for="excludePostOptionsTextarea">帖子列表頁黑名單關鍵字（每行一個）:</label><br>
                            <textarea id="excludePostOptionsTextarea">${settings.excludePostOptions.join("\n")}</textarea><br>
                        </div>
                    </div>
                    <div class="bgsh-setting-button">
                        <button id="saveButton">儲存</button>
                        <button id="closeButton">關閉</button>
                    </div>
                </div>`;
    }

    function createSettingsUI(settings) {
        document.getElementById("settingsUIContainer")?.remove();
        generateSettingsStyles();
        const container = document.createElement("div");
        container.id = "settingsUIContainer";
        container.innerHTML = generateSettingsHTML(settings);
        document.body.appendChild(container);

        document.getElementById("saveButton").addEventListener("click", () => {
            saveSettings();
            container.style.display = "none";
        });
        document.getElementById("closeButton").addEventListener("click", () => (container.style.display = "none"));
    }

    function generateSettingsStyles() {
        const style = `
                #settingsUIContainer * { box-sizing: border-box; margin: 0px; padding: 0px; font-family: "Inter", Arial, Helvetica, sans-serif; }
                #settingsUIContainer { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 666px; z-index: 9999; }
                #settingsUIContainer *::selection { background-color: #c7c9ca; }
                #settingsUIContainer .bgsh-setting-box { margin: auto; box-sizing: border-box; padding: 20px 20px; background-color: #ecf0f3; box-shadow: -8px -8px 8px #feffff, 8px 8px 8px #161b1d2f; overflow-y: auto; height: 92vh; max-height: 888px; display: flex; flex-direction: column; }
                #settingsUIContainer label { font-size: 13px; font-weight: 500; color: #858686; }
                #settingsUIContainer .bgsh-setting-checkbox-label { display: block; position: relative; cursor: pointer; font-size: 13px; line-height: 22px; }
                #settingsUIContainer span { color: #8f8c8c; display: inline-block; position: absolute; font-weight: 500; left: 12%; font-size: 13px; }
                #settingsUIContainer input[type="text"], #settingsUIContainer input[type="number"] { width: 100%; height: 35px; padding-left: 20px; border: none; color: #858686; margin-top: 10px; background-color: #ecf0f3; outline: none; border-radius: 5px; box-shadow: inset 5px 5px 5px #cbced1, inset -5px -5px 5px #ffffff; }
                #settingsUIContainer textarea { width: 100%; height: 150px; padding-left: 20px; padding-top: 10px; border: none; color: #858686; margin-top: 10px; background-color: #ecf0f3; outline: none; border-radius: 5px; box-shadow: inset 5px 5px 5px #cbced1, inset -5px -5px 5px #ffffff; }
                #settingsUIContainer input[type="checkbox"] { position: absolute; opacity: 0; cursor: pointer; }
                #settingsUIContainer .bgsh-setting-checkbox-label .bgsh-setting-checkbox-custom { position: absolute; top: 0; left: 0px; height: 20px; width: 20px; background-color: #ecf0f3; border-radius: 5px; border: none; box-shadow: inset 3px 3px 3px #cbced1, inset -3px -3px 3px #ffff; }
                #settingsUIContainer .bgsh-setting-checkbox-label input:checked ~ .bgsh-setting-checkbox-custom { background-color: #ecf0f3; border-radius: 5px; -webkit-transform: rotate(0deg) scale(1); -ms-transform: rotate(0deg) scale(1); transform: rotate(0deg) scale(1); opacity: 1; border: none; box-shadow: -4px -4px 4px #feffff, 4px 4px 4px #161b1d2f; }
                #settingsUIContainer .bgsh-setting-checkbox-label .bgsh-setting-checkbox-custom::after { position: absolute; content: ""; left: 10px; top: 10px; height: 0px; width: 0px; border-radius: 5px; border: solid #635f5f; border-width: 0 3px 3px 0; -webkit-transform: rotate(0deg) scale(0); -ms-transform: rotate(0deg) scale(0); transform: rotate(0deg) scale(0); opacity: 1; transition: all 0.3s ease-out; }
                #settingsUIContainer .bgsh-setting-checkbox-label input:checked ~ .bgsh-setting-checkbox-custom::after { -webkit-transform: rotate(45deg) scale(1); -ms-transform: rotate(45deg) scale(1); transform: rotate(45deg) scale(1); opacity: 1; left: 7px; top: 3px; width: 4px; height: 8px; border: solid #635f5f; border-width: 0 2px 2px 0; background-color: transparent; border-radius: 0; }
                #settingsUIContainer button { width: 50px; margin-top: 20px; height: 38px; border: none; outline: none; border-radius: 20px; background-color: #727171; font-size: 13px; font-weight: 500; color: #ffffff; cursor: pointer; box-shadow: -5px -5px 8px #d8e2e6, 5px 5px 10px #2c313378; transition: 0.8s; }
                #settingsUIContainer button:hover { background-color: #535658; box-shadow: inset 5px 5px 10px #05050578, inset -5px -5px 10px #9e9c9c; }
                .bgsh-setting-first, .bgsh-setting-second { width: 50%; }
                .bgsh-setting-box-container { display: flex; gap: 20px; }
                .bgsh-setting-button { width: 100%; text-align: center; gap: 20px; }
                `;
        const styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);
    }
    // #endregion

    // #region 連結路徑修復
    function repairLinks(settings) {
        if (!settings.enableLinkRepair || !document.querySelector("title")?.innerText.includes("98堂[原色花堂]")) {
            return;
        }

        const currentHost = window.location.host;
        const mainHost = "www.sehuatang.net";
        const altHosts = ["oxb2j.dxk78.com"]; // 可擴展

        document.querySelectorAll("a[href]").forEach(link => {
            if (link.protocol === "javascript:") return;
            try {
                const url = new URL(link.href, window.location.href);
                if ((url.hostname === "127.0.0.1" && url.port === "20000") || altHosts.includes(url.hostname)) {
                    if (url.pathname.includes('forum.php')) {
                        link.href = `https://${mainHost}${url.pathname}${url.search}`;
                    }
                }
                else if (url.hostname !== currentHost && (
                    url.pathname.includes('forum.php') ||
                    url.pathname.includes('search.php') ||
                    url.pathname.match(/thread-\d+-\d+-\d+\.html$/)
                )) {
                    url.host = currentHost;
                    link.href = url.href;
                }
            } catch (e) {
                // console.error('URL解析或修復錯誤:', e, 'Link Href:', link.href);
            }
        });
    }
    // #endregion

    // #region 圖片預覽功能
    function createPreviewElement(responseText, settings) {
        const doc = new DOMParser().parseFromString(responseText, "text/html");
        const mainDiv = doc.querySelector('#postlist > div[id^=post_]:first-of-type') || doc.querySelector('#postlist');
        if (!mainDiv) return null;

        const imgNodes = Array.from(mainDiv.querySelectorAll('img.zoom[file], img.zoom[zoomfile], .t_f img, .message img'));
        const imgList = imgNodes.filter(img => {
            const url = img.getAttribute('file') || img.getAttribute('zoomfile') || img.getAttribute('src');
            return url && !/static|avatar|hrline|smiley|none\.gif|noavatar\.gif/i.test(url);
        }).slice(0, 3);

        if (imgList.length === 0) return null;

        const $imgContainer = $('<div style="display:flex; align-items:center; overflow-x:auto;"></div>');
        imgList.forEach(img => {
            let pic_url = img.getAttribute('zoomfile') || img.getAttribute('file') || img.getAttribute('src');
            if (pic_url) {
                pic_url = new URL(pic_url, location.href).href;
                const $thumb = $('<img>').attr({
                    "data-original": pic_url,
                    "src": pic_url,
                    "onclick": "zoom(this, this.src, 0, 0, 0)",
                    "class": "lazy"
                }).css({
                    "max-width": `${settings.imgMaxWidth}px`, "max-height": `${settings.imgMaxHeight}px`,
                    "margin": "2px", "cursor": "pointer", "border": "1px solid #ddd", "vertical-align": "middle"
                });
                $imgContainer.append($thumb);
            }
        });

        return $imgContainer.children().length > 0 ? $imgContainer : null;
    }

    // 論壇列表頁預覽
    function previewOnForumList(settings) {
        $('tbody[id^="normalthread"]').each(function () {
            const $row = $(this);
            if ($row.data('sth-preview')) return;
            $row.data('sth-preview', true);

            const $titleLink = $row.find('a.xst');
            if (!$titleLink.length) return;

            const threadUrl = new URL($titleLink.attr('href'), location.href).href;
            GM_xmlhttpRequest({
                method: 'GET', url: threadUrl,
                onload: function (result) {
                    const $preview = createPreviewElement(result.responseText, settings);
                    if (!$preview) return;

                    const colspan = $row.find('tr:first > td').length || 5;
                    const $imgTr = $('<tr class="sth-preview-row"></tr>').append($(`<td colspan="${colspan}" style="white-space:nowrap;"></td>`).append($preview));

                    if ($row.next('.sth-preview-row').length === 0) {
                        $row.after($imgTr);
                        $preview.find('img.lazy').lazyload({ effect: "fadeIn" });
                    }
                }
            });
        });
    }

    // 搜尋結果頁預覽
    function previewOnSearchPage(settings) {
        $('ul li h3.xs3 a').each(function () {
            const $a = $(this);
            if ($a.data('sth-preview')) return;
            $a.data('sth-preview', true);

            const $li = $a.closest('li');
            if (!$li.length) return;

            const threadUrl = new URL($a.attr('href'), location.href).href;
            GM_xmlhttpRequest({
                method: 'GET', url: threadUrl,
                onload: function (result) {
                    const $preview = createPreviewElement(result.responseText, settings);
                    if ($preview && $li.find('.sth-preview-row').length === 0) {
                        $li.append($('<div class="sth-preview-row"></div>').append($preview));
                        $preview.find('img.lazy').lazyload({ effect: "fadeIn" });
                    }
                }
            });
        });
    }

    // 個人主頁/收藏頁預覽
    function previewOnSpaceThreadPage(settings) {
        $('#ct div.tl table:first > tbody > tr:not([id]):gt(0)').each(function () {
            const $tr = $(this);
            if ($tr.data('sth-preview')) return;
            $tr.data('sth-preview', true);

            const $a = $tr.find('th:first > a');
            if (!$a.length) return;

            const threadUrl = new URL($a.attr('href'), location.href).href;
            const info_id = "info_" + (extractTid(threadUrl) || Math.random());

            if ($('#' + info_id).length > 0) return;

            const $tr_clone = $(`<tr id="${info_id}" class="sth-preview-row"></tr>`);
            const $placeholder_td = $(`<td colspan="5"><i></i></td>`);
            $tr_clone.append($placeholder_td);
            $tr.after($tr_clone);

            GM_xmlhttpRequest({
                method: 'GET', url: threadUrl,
                onload: function (result) {
                    const $preview = createPreviewElement(result.responseText, settings);
                    if ($preview) {
                        $placeholder_td.append($preview);
                        $preview.find('img.lazy').lazyload({ effect: "fadeIn" });
                    } else {
                        $placeholder_td.text('未識別到主樓圖片');
                    }
                },
                onerror: function (error) {
                    console.error(`[98助手] GM_xmlhttpRequest Error for ${threadUrl}:`, error);
                    $placeholder_td.text('加載預覽失敗 (錯誤)').css('color', 'red');
                }
            });
        });
    }
    // #endregion

    // #region 輔助工具函數
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showTooltip("內容已複製!");
        } catch (err) {
            showTooltip("複製失敗: " + err);
            console.error("無法將文字複製到剪貼簿", err);
        }
    }

    function getQueryParams(url) {
        const params = {};
        const urlObj = new URL(url);
        urlObj.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        if (Object.keys(params).length === 0) {
            const pathMatch = /forum-(\d+)-(\d+)\.html$/.exec(url);
            if (pathMatch) {
                params.fid = pathMatch[1];
                params.page = pathMatch[2];
            }
        }
        return params;
    }

    function extractTid(url) {
        const threadMatch = url.match(/thread-(\d+)/);
        if (threadMatch) return threadMatch[1];
        const queryMatch = url.match(/tid=(\d+)/);
        if (queryMatch) return queryMatch[1];
        return null;
    }

    function parseContent(content, type = "text/html") { return new DOMParser().parseFromString(content, type); }

    function getUserId() {
        const userLink = document.querySelector(".vwmy a[href*='uid=']");
        return userLink ? userLink.href.match(/uid=(\d+)/)?.[1] : null;
    }

    function getTableIdFromElement(element) {
        const parentTable = element?.closest("table[id^='pid']");
        return parentTable ? parentTable.id.replace("pid", "") : null;
    }

    function getFormHash() {
        return document.querySelector('input[name="formhash"]')?.value || null;
    }
    // #endregion

    // #region 帖子列表樣式設定
    function displayHeatLevel() {
        document.querySelectorAll('img[alt="heatlevel"]').forEach((image) => {
            const parent = image.parentNode;
            const link = parent.querySelector("a.s.xst");
            const uniqueId = "baoguoheatleveldisplay";
            if (link && !link.parentNode.querySelector("#" + uniqueId)) {
                const span = document.createElement("span");
                span.textContent = ` [${image.getAttribute("title")}]`;
                span.style.cssText = "color: red; font-weight: bold;";
                span.id = uniqueId;
                link.parentNode.insertBefore(span, link.nextSibling);
            }
        });
    }
    // #endregion

    // #region 頁碼操作
    function addPageNumbers() {
        const sourceElement = document.querySelector(".pgs.cl.mbm");
        const targetElement = document.querySelector(".slst.mtw");
        if (sourceElement && targetElement?.parentElement) {
            targetElement.parentElement.insertBefore(sourceElement.cloneNode(true), targetElement);
        }
    }
    // #endregion

    // #region UI組件建立
    function createCheckboxGroup(id, title, options) {
        const groupDiv = document.createElement("div");
        groupDiv.className = "bgsh-forget";
        groupDiv.id = id;
        let innerHTML = `<strong>${title}</strong><br>`;
        const selectAllId = `bgsh-${id}-select-all`;
        innerHTML += `<label class="bgsh-checkbox-label"><input type="checkbox" id="${selectAllId}" class="select-all"><span class="bgsh-checkbox-custom"></span><span class="bgsh-label-text">全選</span></label>`;
        options.forEach((option) => {
            const checkboxId = `bgsh-${id}-${option.value}`;
            innerHTML += `<label class="bgsh-checkbox-label"><input type="checkbox" id="${checkboxId}" value="${option.value}"><span class="bgsh-checkbox-custom"></span><span class="bgsh-label-text">${option.label}</span></label>`;
        });
        groupDiv.innerHTML = innerHTML;
        const selectAllCheckbox = groupDiv.querySelector(".select-all");
        const otherCheckboxes = Array.from(groupDiv.querySelectorAll('input[type="checkbox"]:not(.select-all)'));
        function checkIndeterminateStatus() {
            const checkedCount = otherCheckboxes.filter((cb) => cb.checked).length;
            selectAllCheckbox.checked = checkedCount === otherCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < otherCheckboxes.length;
        }
        selectAllCheckbox.addEventListener("change", () => {
            otherCheckboxes.forEach((checkbox) => { checkbox.checked = selectAllCheckbox.checked; });
            checkIndeterminateStatus();
        });
        otherCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", checkIndeterminateStatus));
        return groupDiv;
    }
    const createButton = (id, text, clickFunction, className = "bgsh-customBtn", bgColor = "#0396FF") => {
        const button = document.createElement("button");
        button.id = id;
        button.innerText = text;
        button.className = className;
        button.style.backgroundColor = bgColor;
        button.addEventListener("click", clickFunction);
        return button;
    };
    function createButtonContainer() {
        const container = document.createElement("div");
        Object.assign(container.style, { display: "flex", flexDirection: "column", alignItems: "center", position: "fixed", top: "50%", right: "1vh", zIndex: "1000", transform: "translateY(-50%)" });
        return container;
    }
    function createMenuButton(settings) {
        const menuButton = document.createElement("button");
        menuButton.textContent = settings.menuButtonIsVisible ? "隱藏" : "顯示";
        const buttonColor = settings.menuButtonIsVisible ? "#4682B4" : "#FF6347";
        Object.assign(menuButton.style, { position: "fixed", top: "calc(50% - 60px)", right: "1vh", zIndex: "1001", cursor: "pointer", fontSize: "15px", padding: "15px 15px", borderRadius: "50%", backgroundColor: buttonColor, color: "white", border: "none" });
        return menuButton;
    }
    function toggleContainer(menuButton, container) {
        let isVisible = GM_getValue("menuButtonIsVisible", true);
        menuButton.addEventListener("click", () => {
            isVisible = !isVisible;
            container.style.display = isVisible ? "flex" : "none";
            menuButton.textContent = isVisible ? "隱藏" : "顯示";
            menuButton.style.backgroundColor = isVisible ? "#4682B4" : "#FF6347";
            GM_setValue("menuButtonIsVisible", isVisible);
            setMenuButtonPosition(menuButton, container, getSettings());
        });
    }
    function createDateInput(id, defaultValue = new Date().toISOString().split("T")[0], className = "bgsh-dateInput") {
        const input = document.createElement("input");
        input.type = "date";
        input.id = id;
        input.value = defaultValue;
        input.className = className;
        return input;
    }
    // #endregion

    // #region 更新操作
    async function checkForUpdates() {
        const currentVersion = GM.info.script.version;
        const updateURL = "https://sleazyfork.org/zh-TW/scripts/548642-98%E5%8A%A9%E6%89%8B-%E7%B2%BE%E7%B0%A1%E7%89%88/code/98%E5%8A%A9%E6%89%8B%20(%E7%B2%BE%E7%B0%A1%E7%89%88).user.js";
        try {
            const response = await fetch(updateURL);
            const data = await response.text();
            const matchVersion = data.match(/@version\s+([\d.]+)/);
            if (matchVersion && parseFloat(matchVersion[1]) > parseFloat(currentVersion)) {
                showUpdateDialog();
            }
            GM_setValue("lastCheckedUpdate", Date.now());
        } catch (error) {
            console.error("檢查更新時出錯:", error);
        }
    }
    function showUpdateDialog() {
        const dialogHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 9999; display: flex; justify-content: center; align-items: center;">
                    <div style="background: #fff; padding: 20px; border-radius: 5px;">
                        <p>有新版本的腳本可用！</p>
                        <a href="https://sleazyfork.org/zh-TW/scripts/548642-98%E5%8A%A9%E6%89%8B-%E7%B2%BE%E7%B0%A1%E7%89%88" target="_blank">點擊這裡更新</a>
                        <button style="margin-top: 10px;" onclick="this.closest('.updateDialog').remove();">關閉</button>
                    </div>
                </div>`;
        const tempDiv = document.createElement("div");
        tempDiv.className = "updateDialog";
        tempDiv.innerHTML = dialogHTML;
        document.body.appendChild(tempDiv);
    }
    // #endregion

    // #region 使用者簽到功能
    async function sign(userid) {
        const signURL = `${baseURL}/plugin.php?id=dd_sign&ac=sign&infloat=yes&handlekey=pc_click_ddsign&inajax=1&ajaxtarget=fwin_content_pc_click_ddsign`;
        const params = await getSignParameters(signURL);
        if (!params?.formhash || !params.signhash) {
            console.error("Failed to retrieve sign parameters.");
            return false;
        }
        const { formhash, signtoken, signhash } = params;
        const secanswer = await getValidationResult();
        const responseText = await postSignData({ baseURL, formhash, signtoken, secanswer, signhash });
        return updateSignButton(responseText, userid);
    }
    async function getSignParameters(url) {
        const { responseText, contentType } = await fetchWithContentType(url);
        return handleResponseContent(responseText, contentType);
    }
    async function getValidationResult() {
        const secqaaURL = `/misc.php?mod=secqaa&action=update&idhash=qSAxcb0`;
        const { responseText } = await fetchWithContentType(secqaaURL);
        return extractValidationText(responseText);
    }
    async function postSignData({ baseURL, formhash, signtoken, secanswer, signhash }) {
        const postURL = `${baseURL}/plugin.php?id=dd_sign&ac=sign&signsubmit=yes&handlekey=pc_click_ddsign&signhash=${signhash}&inajax=1`;
        const data = new URLSearchParams({ formhash, signtoken, secanswer, secqaahash: "qSAxcb0" });
        const response = await fetch(postURL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data });
        return response.text();
    }
    async function fetchWithContentType(url) {
        const response = await fetch(url);
        const contentType = response.headers.get("Content-Type");
        const responseText = await response.text();
        return { responseText, contentType };
    }
    function handleResponseContent(responseText, contentType) {
        if (contentType.includes("text/xml")) { return handleXMLContent(responseText); }
        if (contentType.includes("text/html")) { return extractSignParametersFromHTML(responseText); }
        throw new Error("Unsupported content type");
    }
    function handleXMLContent(responseText) {
        const settings = getSettings();
        const xml = parseContent(responseText, "text/xml");
        const content = xml.querySelector("root")?.textContent || "";
        const doc = parseContent(content);
        const alertErrorElement = doc.querySelector(".alert_error");
        if (alertErrorElement) {
            alertErrorElement.querySelectorAll("script").forEach(s => s.remove());
            if (settings.qiandaoTip) showTooltip(alertErrorElement.textContent.trim());
            return null;
        }
        return extractSignParametersFromHTML(content);
    }
    function extractSignParametersFromHTML(responseText) {
        const doc = parseContent(responseText);
        const formhash = doc.querySelector('input[name="formhash"]')?.value;
        const signtoken = doc.querySelector('input[name="signtoken"]')?.value;
        const signhash = doc.querySelector('form[name="login"]')?.id?.replace("signform_", "");
        return { formhash, signtoken, signhash };
    }
    function extractValidationText(resultText) {
        const text = resultText.replace("sectplcode[2] + '", "前").replace("' + sectplcode[3]", "後");
        const matchedText = text.match(/前([\w\W]+)後/)?.[1];
        return computeExpression(matchedText.replace("= ?", ""));
    }
    const computeExpression = (expr) => {
        try {
            const [left, operator, right] = expr.split(/([+\-*/])/);
            const a = parseFloat(left.trim());
            const b = parseFloat(right.trim());
            switch (operator) {
                case "+": return a + b;
                case "-": return a - b;
                case "*": return a * b;
                case "/": return a / b;
                default: throw new Error("Unsupported operator");
            }
        } catch {
            return 0; // Fallback
        }
    };
    function updateSignButton(responseText, userid) {
        const settings = getSettings();
        const today = new Date().toLocaleDateString();
        if (responseText.includes("已经签到过") || responseText.includes("重複簽到")) {
            if (settings.qiandaoTip) showTooltip("已經簽到過啦，請明天再來！");
            GM_setValue(`lastSignDate_${userid}`, today);
            return true;
        } else if (responseText.includes("签到成功")) {
            if (settings.qiandaoTip) showTooltip("簽到成功，金錢+2，明天記得來哦。");
            GM_setValue(`lastSignDate_${userid}`, today);
            return true;
        } else if (responseText.includes("请至少发表或回复一个帖子后再来签到")) {
            if (settings.qiandaoTip) showTooltip("請至少發表或回覆一個帖子後再來簽到!");
            return false;
        } else {
            if (settings.qiandaoTip) showTooltip("抱歉，簽到出現了未知錯誤！");
            return false;
        }
    }
    // #endregion

    // #region 帖子互動功能 (收藏、評分、購買紀錄)
    async function star() {
        const tid = extractTid(window.location.href);
        const formHash = getFormHash();
        if (!tid || !formHash) {
            showTooltip("無法獲取帖子ID或驗證資訊");
            return;
        }
        const starUrl = `/home.php?mod=spacecp&ac=favorite&type=thread&id=${tid}&formhash=${formHash}&infloat=yes&handlekey=k_favorite&inajax=1&ajaxtarget=fwin_content_k_favorite`;
        try {
            const text = await fetch(starUrl).then((r) => r.text());
            if (text.includes("抱歉，您已收藏，请勿重复收藏")) return showTooltip("抱歉，您已收藏，請勿重複收藏");
            if (text.includes("信息收藏成功")) return showTooltip("資訊收藏成功");
            showTooltip("資訊收藏出現問題！");
            console.error(text);
        } catch (error) {
            showTooltip("收藏請求失敗！");
            console.error(error);
        }
    }

    async function getRateInfo(pid, tid) {
        const infoDefaults = { state: false, max: 0, formHash: "", referer: "", handleKey: "", error: "" };
        try {
            const url = `/forum.php?mod=misc&action=rate&tid=${tid}&pid=${pid}&infloat=yes&handlekey=rate&t=${Date.now()}&inajax=1&ajaxtarget=fwin_content_rate`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("獲取評分資訊失敗");
            const text = await response.text();
            const xml = parseContent(text, "text/xml");
            const htmlContent = xml.querySelector("root")?.textContent;
            if (!htmlContent) throw new Error("無法解析評分內容");
            const doc = parseContent(htmlContent, "text/html");

            if (htmlContent.includes("alert_error")) {
                const alertErrorElement = doc.querySelector(".alert_error");
                alertErrorElement?.querySelectorAll("script").forEach((script) => script.remove());
                return { ...infoDefaults, error: alertErrorElement?.textContent.trim() || "未知評分錯誤" };
            }

            const maxElement = doc.querySelector("#scoreoption8 li");
            if (!maxElement) return { ...infoDefaults, error: "評分不足或無法評分！" };

            const max = parseInt(maxElement.textContent.replace("+", ""), 10);
            const left = parseInt(doc.querySelector(".dt.mbm td:last-child")?.textContent || "0", 10);
            const formHash = doc.querySelector('input[name="formhash"]')?.value;
            const referer = doc.querySelector('input[name="referer"]')?.value;
            const handleKey = doc.querySelector('input[name="handlekey"]')?.value;

            return { state: true, max: Math.min(max, left), formHash, referer, handleKey, error: "" };
        } catch (error) {
            showTooltip(error.toString());
            return infoDefaults;
        }
    }

    async function grade(pid) {
        const tid = extractTid(window.location.href);
        if (!tid) {
            showTooltip("無法獲取帖子ID");
            return;
        }
        const rateInfo = await getRateInfo(pid, tid);
        if (!rateInfo.state) {
            showTooltip(rateInfo.error);
            return;
        }

        const { maxGradeThread } = getSettings();
        rateInfo.max = Math.min(rateInfo.max, parseInt(maxGradeThread, 10));
        if (rateInfo.max <= 0) {
            showTooltip("沒有可用的評分額度了");
            return;
        }

        const rateUrl = "/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1";
        const data = new URLSearchParams({
            formhash: rateInfo.formHash,
            tid, pid,
            referer: rateInfo.referer,
            handlekey: rateInfo.handleKey,
            score8: `+${rateInfo.max}`,
            reason: "很給力！",
            sendreasonpm: "on",
        });

        try {
            const responseText = await fetch(rateUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data }).then((r) => r.text());
            if (responseText.includes("感谢您的参与，现在将转入评分前页面")) {
                showTooltip(`+${rateInfo.max} 評分成功，並通知了樓主!`);
            } else {
                showTooltip("抱歉，評分失敗！");
                console.error(responseText);
            }
        } catch (error) {
            showTooltip("評分請求失敗！");
            console.error(error);
        }
    }

    async function getViewpayments(tid) {
        const infoDefaults = { state: false, dataRowCount: 0, error: "" };
        try {
            const url = `/forum.php?mod=misc&action=viewpayments&tid=${tid}&infloat=yes&handlekey=pay&inajax=1&ajaxtarget=fwin_content_pay`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("獲取購買記錄失敗");
            const text = await response.text();
            const xml = parseContent(text, "text/xml");
            const htmlContent = xml.querySelector("root")?.textContent;

            if (!htmlContent) return infoDefaults;
            if (htmlContent.includes("目前没有用户购买此主题")) {
                return { state: true, dataRowCount: 0, error: "" };
            }

            const doc = parseContent(htmlContent, "text/html");
            const rows = doc.querySelectorAll("table.list tr");
            return { state: true, dataRowCount: Math.max(0, rows.length - 1), error: "" };
        } catch (error) {
            showTooltip(error.toString());
            return infoDefaults;
        }
    }
    // #endregion

    // #region 帖子置頂
    function getFidFromElement() {
        const element = document.querySelector("#newspecial");
        const hrefValue = element?.getAttribute("onclick");
        return hrefValue ? /fid=(\d+)/.exec(hrefValue)?.[1] : null;
    }
    // #endregion

    // #region 一鍵二連 (評分+收藏)
    function gradeAndStar() {
        const firstPobClElement = document.querySelector(".po.hin");
        const pid = getTableIdFromElement(firstPobClElement);
        if (pid) grade(pid);
        star();
    }
    // #endregion

    // #region 內容屏蔽
    function blockContentByUsers(settings) {
        const { blockedUsers, displayBlockedTips } = settings;
        if (!Array.isArray(blockedUsers) || blockedUsers.length === 0) return;
        blockedUsers.forEach((userID) => {
            if (!userID) return;
            const actions = [
                createBlockAction(
                    `//tbody[starts-with(@id, 'normalthread_')][.//cite/a[text()="${userID}"]]`,
                    `<tr><td class='icn'><img src='static/image/common/folder_common.gif' /></td><th class='common' colspan='4'><b>已屏蔽用戶 <font color=grey>${userID}</font> 的主題</th></tr>`
                ),
                createBlockAction(
                    `//li[contains(@class, 'pbw')][.//p[contains(@class, 'xg1')]//a[text()="${userID}"]]`,
                    `<li class="pbw"><p><span>已屏蔽用戶 "${userID}" 的搜尋結果</span></p></li>`
                )
            ];
            actions.forEach(applyBlockAction(displayBlockedTips));
        });
    }
    function blockContentByTitle(settings) {
        const { excludePostOptions, displayBlockedTips } = settings;
        if (!Array.isArray(excludePostOptions) || excludePostOptions.length === 0) return;
        excludePostOptions.forEach((keyword) => {
            if (!keyword) return;
            const actions = [
                createBlockAction(`//table/tbody/tr/th/a[2][contains(text(),'${keyword}')]/ancestor::tbody[1]`, `<tr><td class='icn'><img src='static/image/common/folder_common.gif' /></td><th class='common' colspan="4"><b>已屏蔽主題關鍵詞:${keyword} <font color=grey></th></tr>`)
            ];
            actions.forEach(applyBlockAction(displayBlockedTips));
        });
    }
    function createBlockAction(xpath, message) { return { xpath, message }; }
    function applyBlockAction(displayBlockedTips) {
        return function (action) {
            const elements = document.evaluate(action.xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < elements.snapshotLength; i++) {
                const item = elements.snapshotItem(i);
                if (displayBlockedTips) {
                    item.innerHTML = action.message;
                } else {
                    item.style.display = "none";
                }
            }
        };
    }
    // #endregion

    // #region 無縫翻頁
    function initInfiniteScroll(pageName) {
        const settings = getSettings();
        if (!settings.autoPagination) return;

        let isLoading = false;
        let noMoreData = false;
        const contentSelector = {
            isSearchPage: "#threadlist",
            isForumDisplayPage: "#threadlist",
            isPostPage: "#postlist",
            isSpacePage: "#ct div.tl table > tbody",
            isMySpacePage: "#threadlist",
            isShowdarkroomPage: "#darkroomtable",
            isMyfavoritePage: "#favorite_ul",
        }[pageName] || "#threadlist";

        async function loadNextPage() {
            const nextPageLink = document.querySelector(".nxt");
            if (!nextPageLink || noMoreData) {
                if (!noMoreData) { showTooltip("已經是全部資料了"); noMoreData = true; }
                return;
            }
            isLoading = true;
            try {
                const url = nextPageLink.getAttribute("href");
                const response = await fetch(url);
                const text = await response.text();
                const div = document.createElement("div");
                div.innerHTML = text;

                const newNextPageLink = div.querySelector(".nxt");
                if (newNextPageLink) {
                    nextPageLink.setAttribute("href", newNextPageLink.getAttribute("href"));
                } else {
                    noMoreData = true;
                }
                appendNewContent(div.querySelector(contentSelector));
                updatePagination(div.querySelector(".pg"));

                const newSettings = getSettings();
                blockContentByUsers(newSettings);
                await processPageContentBasedOnSettings(pageName, newSettings);
            } catch (error) {
                console.error("自動翻頁失敗:", error);
                noMoreData = true;
            } finally {
                isLoading = false;
                checkAndLoadIfContentNotEnough();
            }
        }
        function appendNewContent(newContent) {
            const currentContent = document.querySelector(contentSelector);
            if (newContent?.childNodes && currentContent) {
                currentContent.append(...newContent.childNodes);
            }
        }
        function updatePagination(newPgElement) {
            if (newPgElement) {
                document.querySelectorAll(".pg").forEach(pg => (pg.innerHTML = newPgElement.innerHTML));
            }
        }
        async function processPageContentBasedOnSettings(pageName, settings) {
            repairLinks(settings); // 對新載入的內容執行連結修復
            if (pageName === "isSearchPage") {
                filterElementsBasedOnSettings(settings);
            } else if (pageName === "isForumDisplayPage") {
                displayHeatLevel();
                const fid = getQueryParams(window.location.href).fid;
                if (fid == 143) { blockingResolvedAction(settings); }
                if ([166, 97, 146, 2, 39, 141, 155].includes(parseInt(fid))) await displayThreadBuyInfo(settings);
                blockContentByTitle(settings);
            } else if (pageName === "isPostPage") {
                appendTitleFromHotImage();
                appendBuyNumber();
            } else if (pageName === "isMySpacePage" || pageName === "isSpacePage") {
                await displayBuyInfoOnGenericLists(settings);
            }

            if (settings.enableImagePreview) {
                try {
                    switch (pageName) {
                        case 'isForumDisplayPage': previewOnForumList(settings); break;
                        case 'isSearchPage': previewOnSearchPage(settings); break;
                        case 'isSpacePage': case 'isMySpacePage': previewOnSpaceThreadPage(settings); break;
                    }
                } catch (e) { console.error("圖片預覽功能(無限捲動)出錯:", e); }
            }
        }
        function checkAndLoadIfContentNotEnough() {
            if (document.body.offsetHeight <= window.innerHeight && !isLoading && !noMoreData) {
                loadNextPage();
            }
        }
        window.addEventListener("scroll", () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading) {
                loadNextPage();
            }
        });
        checkAndLoadIfContentNotEnough();
    }
    function filterElementsBasedOnSettings(settings) {
        document.querySelectorAll(".pbw").forEach(pbw => {
            pbw.style.display = shouldElementBeDisplayed(pbw, settings) ? "block" : "none";
        });
    }
    function shouldElementBeDisplayed(element, settings) {
        if (settings.TIDGroup?.length) {
            const aElement = element.querySelector(".xi1");
            if (!aElement || !doesTIDGroupMatch(aElement, settings.TIDGroup)) return false;
        }
        if (settings.excludeGroup?.length) {
            const pElement = element.querySelector("p:nth-of-type(2)");
            const xs3Element = element.querySelector(".xs3");
            if (isExcludedByKeyword(pElement, settings.excludeGroup) || isExcludedByKeyword(xs3Element, settings.excludeGroup)) return false;
        }
        return true;
    }
    function doesTIDGroupMatch(aElement, TIDGroup) {
        const href = aElement.getAttribute("href");
        return TIDGroup.some(tid => href.includes(`fid=${tid}`) || href.includes(`forum-${tid}`));
    }
    function isExcludedByKeyword(element, excludeGroup) {
        if (!element) return false;
        const text = element.textContent.toLowerCase();
        return excludeGroup.some(keyword => text.includes(keyword.toLowerCase()));
    }
    // #endregion

    // #region 帖子列表頁執行的方法
    function addDateRangeSelectorAndButton(targetElementOrId) {
        const refElement = typeof targetElementOrId === "string" ? document.getElementById(targetElementOrId) : targetElementOrId;
        if (!refElement) return;
        const startDateInput = createDateInput("startDateSelector");
        const endDateInput = createDateInput("endDateSelector");
        const openButton = createButton("openAllUrlButton", "批量開啟帖子", filterAndOpenThreadsByDate, "bgsh-openAllUrlBtn", "#f6211c");

        refElement.after(openButton, endDateInput, document.createTextNode("到"), startDateInput);
    }
    function filterAndOpenThreadsByDate() {
        const startDate = new Date(document.getElementById("startDateSelector").value);
        const endDate = new Date(document.getElementById("endDateSelector").value);

        document.querySelectorAll("#threadlisttableid tbody tr").forEach((post) => {
            const dateElement = post.querySelector("td.by em span span[title]") || post.querySelector("td.by em span");
            if (dateElement) {
                const postDateStr = dateElement.getAttribute("title") || dateElement.textContent;
                const postDate = new Date(postDateStr);
                if (postDate >= startDate && postDate <= endDate) {
                    post.querySelector(".s.xst")?.href && window.open(post.querySelector(".s.xst").href, "_blank");
                }
            }
        });
    }
    function createTimeSortButton(settings, buttonContainer) {
        const queryParams = getQueryParams(window.location.href);
        const fid = queryParams.fid;
        const hasOrderBy = queryParams.orderby === "dateline";
        let isFidInOrder = settings.orderFids.includes(fid);
        const setText = (isOrder) => isOrder ? "目前列表\n時間排序" : "目前列表\n預設排序";

        const timeSortButton = createButton("timeSortButton", setText(isFidInOrder), function () {
            isFidInOrder = !isFidInOrder;
            this.innerText = setText(isFidInOrder);
            if (isFidInOrder) {
                if (!hasOrderBy) window.location.href = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}&filter=author&orderby=dateline`;
                settings.orderFids.push(fid);
            } else {
                if (hasOrderBy) window.location.href = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}`;
                settings.orderFids = settings.orderFids.filter((existingFid) => existingFid !== fid);
            }
            GM_setValue("orderFids", JSON.stringify([...new Set(settings.orderFids)]));
        });
        buttonContainer.appendChild(timeSortButton);
    }
    function handleInitialPageState(settings) {
        const queryParams = getQueryParams(window.location.href);
        const fid = queryParams.fid;
        if (!fid) return;
        const hasOrderBy = queryParams.orderby === "dateline";
        const isFidInOrder = settings.orderFids.includes(fid);
        if (isFidInOrder && !hasOrderBy) {
            window.location.href = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}&filter=author&orderby=dateline`;
        } else if (!isFidInOrder && hasOrderBy) {
            window.location.href = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}`;
        }
    }
    async function insertBuyInfoSpan(linkElement, tid) {
        if (!linkElement || !tid || linkElement.parentNode.querySelector('.sth-buy-info')) return;
        const buyInfo = await getViewpayments(tid);
        if (buyInfo.state) {
            const span = document.createElement("span");
            span.className = "sth-buy-info";
            span.style.cssText = "font-size: larger; font-weight: bold; color: red;";
            span.textContent = ` [購買${buyInfo.dataRowCount}次]`;
            linkElement.parentNode.insertBefore(span, linkElement.nextSibling);
        }
    }
    async function displayThreadBuyInfo(settings) {
        if (!settings.displayThreadBuyInfo) return;
        for (const link of document.querySelectorAll("a.s.xst")) {
            const tid = extractTid(link.href);
            if (tid) await insertBuyInfoSpan(link, tid);
        }
    }
    async function displayBuyInfoOnGenericLists(settings) {
        if (!settings.displayThreadBuyInfo) return;
        const validFidRegex = /fid=(166|97|146|2|39|141|155)|forum-(166|97|146|2|39|141|155)/;
        for (const th of document.querySelectorAll("th")) {
            const aElement = th.querySelector("a");
            const nextTd = th.nextElementSibling;
            if (aElement && nextTd?.tagName === "TD") {
                const tdLink = nextTd.querySelector("a");
                if (tdLink && validFidRegex.test(tdLink.href)) {
                    const tid = extractTid(aElement.href);
                    if (tid) await insertBuyInfoSpan(aElement, tid);
                }
            }
        }
    }
    async function handleForumDisplayPage(settings, buttonContainer) {
        handleInitialPageState(settings);
        displayHeatLevel();
        createTimeSortButton(settings, buttonContainer);
        blockContentByTitle(settings);
        if (settings.enableImagePreview) {
            try { previewOnForumList(settings); } catch (e) { console.error("圖片預覽功能出錯:", e); }
        }
        const fid = getQueryParams(window.location.href).fid;
        if (fid == 143) {
            blockingResolvedAction(settings);
            const blockingResolvedButton = createButton("blockingResolvedBtn", settings.blockingResolved ? "顯示解決" : "屏蔽解決", () => {
                GM_setValue("blockingResolved", !settings.blockingResolved);
                location.reload();
            });
            buttonContainer.appendChild(blockingResolvedButton);
        }
        if ([166, 97, 146, 2, 39, 141, 155].includes(parseInt(fid))) {
            await displayThreadBuyInfo(settings);
        }
        addDateRangeSelectorAndButton(document.querySelector(".xs1.xw0.i"));
        initInfiniteScroll("isForumDisplayPage");
    }
    async function blockingResolvedAction(settings) {
        if (settings.blockingResolved) {
            document.querySelectorAll("tbody").forEach(tbody => {
                if (tbody.textContent.includes("[已解决]")) tbody.remove();
            });
        }
    }
    // #endregion

    // #region 搜尋頁執行的方法
    function handleSearchPage(settings) {
        replaceImageSrc();
        addAdvancedSearch(settings);
        addPageNumbers();
        filterElementsBasedOnSettings(settings);
        if (settings.enableImagePreview) {
            try { previewOnSearchPage(settings); } catch (e) { console.error("圖片預覽功能出錯:", e); }
        }
        initInfiniteScroll("isSearchPage");
    }
    // #endregion

    // #region 帖子內容頁執行的方法
    function createFastCopyButton() {
        return createButton("fastCopyButton", "複製帖子", () => {
            const contents = Array.from(document.querySelectorAll(".t_f")).slice(0, 2);
            const resultHtml = contents.map(processContent).join('');
            if (resultHtml) {
                copyToClipboard(resultHtml);
            } else {
                showTooltip("複製失敗: 沒有找到相應內容");
            }
        });
    }
    function processContent(content) {
        const tempDiv = content.cloneNode(true);
        tempDiv.querySelectorAll('.pstatus, .tip_4, [id^="attach_"], em').forEach(el => el.remove());
        tempDiv.querySelectorAll("img").forEach(img => {
            const fileAttr = img.getAttribute("file") || img.getAttribute("src");
            if (fileAttr && !fileAttr.includes("static/image")) {
                img.replaceWith(document.createTextNode(fileAttr + "\\baoguo"));
            } else {
                img.remove();
            }
        });
        tempDiv.querySelectorAll("font, div, ignore_js_op, br, ol, li, strong, a, i, table, tbody, tr, td, blockquote")
            .forEach(el => el.replaceWith(...el.childNodes));
        return tempDiv.innerHTML.replace(/&nbsp;|&amp;/g, "").replace(/\n+/g, "\n").replace(/\\baoguo/g, "\n");
    }
    function handlePostPage(settings, buttonContainer) {
        const toggleImages = (action) => document.querySelectorAll("img.zoom").forEach(img => (img.style.display = action === "hide" ? "none" : ""));
        toggleImages(settings.showImageButton);

        buttonContainer.appendChild(createButton("toggleImageDisplay", settings.showImageButton === "show" ? "隱藏圖片" : "顯示圖片", function () {
            const shouldShow = this.innerText === "顯示圖片";
            toggleImages(shouldShow ? "show" : "hide");
            this.innerText = shouldShow ? "隱藏圖片" : "顯示圖片";
            GM_setValue("showImageButton", shouldShow ? "show" : "hide");
        }));

        if (settings.showDown) {
            buttonContainer.appendChild(createButton("downButton", "下載附件", () => {
                if (document.getElementById("customModal")) return;
                const attachments = [...document.querySelectorAll('span[id*="attach_"], dl.tattl'), ...Array.from(document.querySelectorAll("div.locked")).filter(el => el.querySelector('a.viewpay[title="购买主题"]'))].filter(el => !el.closest('.tattl') || el.querySelector('p.attnm'));
                if (attachments.length === 0) return showTooltip("沒有找到任何附件。");

                const modal = document.createElement("div");
                modal.id = "customModal";
                Object.assign(modal.style, {
                    position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
                    backgroundColor: "#FFF", padding: "20px", border: "1px solid #DDD",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.5)", borderRadius: "8px", width: "80%",
                    maxWidth: "600px", maxHeight: "80vh", overflowY: "auto", zIndex: "100"
                });

                const contentContainer = document.createElement("div");
                contentContainer.style.marginBottom = "20px";
                attachments.forEach(el => contentContainer.appendChild(el.cloneNode(true)));
                modal.innerHTML = contentContainer.outerHTML + `<button id="closeModal" style="padding: 5px 10px; background-color: #F44336; color: white; border: none; border-radius: 5px; cursor: pointer;">關閉</button>`;
                document.body.appendChild(modal);
                modal.querySelector("#closeModal").addEventListener("click", () => modal.remove());
            }));
        }

        if (document.querySelector(".blockcode") && settings.showCopyCode) {
            buttonContainer.appendChild(createButton("copyCodeButton", "複製代碼", () => {
                const allTexts = Array.from(document.querySelectorAll(".blockcode li")).map(li => li.textContent);
                if (allTexts.length > 0) {
                    copyToClipboard(allTexts.join("\n"));
                } else {
                    showTooltip("沒有找到可複製的程式碼。");
                }
            }));
        }

        const pid = getTableIdFromElement(document.querySelector(".po.hin"));
        if (getUserId()) {
            if (settings.showFastReply) buttonContainer.appendChild(createButton("fastReplyButton", "快速回覆", () => {
                const fid = getFidFromElement();
                const tid = extractTid(window.location.href);
                if (fid && tid) showWindow("reply", `forum.php?mod=post&action=reply&fid=${fid}&tid=${tid}`);
            }));
            if (pid) {
                if (settings.showQuickGrade) buttonContainer.appendChild(createButton("quickGradeButton", "快速評分", () => grade(pid)));
                if (settings.showViewRatings) buttonContainer.appendChild(createButton("viewRatingsButton", "查看評分", () => showWindow("viewratings", `forum.php?mod=misc&action=viewratings&tid=${extractTid(window.location.href)}&pid=${pid}`)));
                if (settings.showPayLog) buttonContainer.appendChild(createButton("payLogButton", "購買記錄", () => showWindow("pay", `forum.php?mod=misc&action=viewpayments&tid=${extractTid(window.location.href)}&pid=${pid}`)));
                if (settings.showClickDouble) buttonContainer.appendChild(createButton("oneClickDoubleButton", "一鍵二連", gradeAndStar));
            }
            if (settings.showQuickStar) buttonContainer.appendChild(createButton("quickStarButton", "快速收藏", star));
        }
        if (settings.showFastCopy) buttonContainer.appendChild(createFastCopyButton());

        initInfiniteScroll("isPostPage");
        appendTitleFromHotImage();
        appendBuyNumber();
    }
    function appendTitleFromHotImage() {
        const hotImage = Array.from(document.querySelectorAll("img")).find(img => /static\/image\/common\/hot_\d+\.gif/.test(img.src));
        if (!hotImage?.title) return;

        const subjectSpan = document.getElementById("thread_subject");
        if (subjectSpan && !subjectSpan.parentNode.querySelector('#hotTitle-append')) {
            const newSpan = document.createElement("span");
            newSpan.id = 'hotTitle-append';
            newSpan.textContent = ` [${hotImage.title}]`;
            newSpan.style.color = `red`;
            subjectSpan.parentNode.insertBefore(newSpan, subjectSpan.nextSibling);
        }
    }
    async function appendBuyNumber() {
        const divPt = document.getElementById("pt");
        const validFidRegex = /fid=(166|97|146|2|39|141|155)|forum-(166|97|146|2|39|141|155)/;
        if (!divPt || !validFidRegex.test(divPt.innerHTML)) return;

        const tid = extractTid(window.location.href);
        if (!tid) return;

        const buyInfo = await getViewpayments(tid);
        if (buyInfo.state) {
            const subjectSpan = document.getElementById("thread_subject");
            if (subjectSpan && !subjectSpan.parentNode.querySelector('#buynum-append')) {
                const newSpan = document.createElement("span");
                newSpan.id = 'buynum-append';
                newSpan.textContent = ` [購買${buyInfo.dataRowCount}次]`;
                newSpan.style.color = `red`;
                subjectSpan.parentNode.insertBefore(newSpan, subjectSpan.nextSibling);
            }
        }
    }
    // #endregion

    // #region 網站全域功能
    function setMenuButtonPosition(menuButton, container, settings) {
        document.body.appendChild(menuButton);
        const containerRect = settings.menuButtonIsVisible ? container.getBoundingClientRect() : { top: window.innerHeight / 2 };
        menuButton.style.top = `${containerRect.top - menuButton.offsetHeight - 50}px`;
    }
    function removeAdsAndClutter() {
        const selectorsToRemove = [
            '.show-text.cl', '.show-text2', '[class*="show-text"]', '#mn_portal',
            '#mn_Na5ac', '#mn_Neaf3', '#mn_Ne7b9', '#qmenu',
            '[id*="mgc_post"]', '#f_pst'
        ];
        document.querySelectorAll(selectorsToRemove.join(', ')).forEach(el => el.remove());

        document.querySelectorAll("#p_btn a").forEach(link => {
            if (link.textContent.includes("广告举报")) {
                (link.closest('li') || link).remove();
            }
        });
    }
    async function baseFunction(settings) {
        removeAdsAndClutter();
        if (settings.blockingIndex) {
            window.addEventListener("load", () => document.querySelector("#diy_chart")?.remove());
        }
        addStyles();
        repairLinks(settings);
        blockContentByUsers(settings);

        const buttonContainer = createButtonContainer();
        buttonContainer.style.display = settings.menuButtonIsVisible ? "flex" : "none";
        await delegatePageHandlers(settings, buttonContainer);
        handleUserSign(buttonContainer);
        document.body.appendChild(buttonContainer);
        createBaoguoButton(buttonContainer);

        const menuButton = createMenuButton(settings);
        setMenuButtonPosition(menuButton, buttonContainer, settings);
        toggleContainer(menuButton, buttonContainer);
    }
    async function delegatePageHandlers(settings, buttonContainer) {
        const href = window.location.href;
        if (/forum\.php\?mod=viewthread|thread-\d+-\d+-\d+\.html/.test(href)) {
            handlePostPage(settings, buttonContainer);
        } else if (/search\.php\?mod=forum/.test(href)) {
            handleSearchPage(settings);
        } else if (/forum\.php\?mod=forumdisplay|forum-\d+-\d+\.html/.test(href)) {
            await handleForumDisplayPage(settings, buttonContainer);
        } else if (/home\.php\?mod=space.*&do=thread&view=me|home\.php\?mod=(guide|space|misc)|home\.php\?mod=space&do=favorite&view=me/.test(href)) {
            await displayBuyInfoOnGenericLists(settings);
            if (settings.enableImagePreview) {
                try { previewOnSpaceThreadPage(settings); } catch (e) { console.error("圖片預覽功能出錯:", e); }
            }
            initInfiniteScroll("isSpacePage");
        }
    }
    function createBaoguoButton(buttonContainer) {
        const baoguoButton = createButton("baoguoButton", "功能設定", () => createSettingsUI(getSettings()));
        buttonContainer.appendChild(baoguoButton);
    }
    async function handleUserSign(buttonContainer) {
        const userid = getUserId();
        if (!userid) return;
        const lastSignDate = GM_getValue(`lastSignDate_${userid}`, null);
        const today = new Date().toLocaleDateString();
        const hasSignedToday = lastSignDate === today;

        const signButton = createButton("signButton", hasSignedToday ? "已經簽到" : "快去簽到", () => (window.location.href = `${baseURL}/plugin.php?id=dd_sign:index`));
        if (!hasSignedToday) {
            const signed = await sign(userid);
            signButton.innerText = signed ? "已經簽到" : "快去簽到";
        }
        buttonContainer.appendChild(signButton);
    }
    // #endregion

    // #region 持久性設定
    function saveSettings() {
        const oldSettingsJSON = JSON.stringify(getSettings());
        const newSettings = {
            enableImagePreview: document.getElementById("enableImagePreviewCheckbox").checked,
            imgMaxWidth: document.getElementById("imgMaxWidthInput").value,
            imgMaxHeight: document.getElementById("imgMaxHeightInput").value,
            showDown: document.getElementById("showDownCheckbox").checked,
            showCopyCode: document.getElementById("showCopyCodeCheckbox").checked,
            showFastReply: document.getElementById("showFastReplyCheckbox").checked,
            showQuickGrade: document.getElementById("showQuickGradeCheckbox").checked,
            showQuickStar: document.getElementById("showQuickStarCheckbox").checked,
            showClickDouble: document.getElementById("showClickDoubleCheckbox").checked,
            showViewRatings: document.getElementById("showViewRatingsCheckbox").checked,
            showPayLog: document.getElementById("showPayLogCheckbox").checked,
            showFastCopy: document.getElementById("showFastCopyCheckbox").checked,
            blockingIndex: document.getElementById("blockingIndexCheckbox").checked,
            qiandaoTip: document.getElementById("qiandaoTipCheckbox").checked,
            displayBlockedTips: document.getElementById("displayBlockedTipsCheckbox").checked,
            autoPagination: document.getElementById("autoPaginationCheckbox").checked,
            displayThreadBuyInfo: document.getElementById("displayThreadBuyInfoCheckbox").checked,
            enableLinkRepair: document.getElementById("enableLinkRepairCheckbox").checked,
            maxGradeThread: document.getElementById("maxGradeThread").value,
            blockedUsers: document.getElementById("blockedUsersList").value.split("\n").map(name => name.trim()).filter(Boolean),
            excludeOptions: [...new Set(document.getElementById("excludeOptionsTextarea").value.split("\n").map(line => line.trim()).filter(Boolean))],
            excludePostOptions: [...new Set(document.getElementById("excludePostOptionsTextarea").value.split("\n").map(line => line.trim()).filter(Boolean))]
        };

        Object.entries(newSettings).forEach(([key, value]) => {
            GM_setValue(key, Array.isArray(value) ? JSON.stringify(value) : value);
        });

        if (oldSettingsJSON !== JSON.stringify({ ...getSettings(), ...newSettings })) {
            location.reload();
        }
    }
    // #endregion

    // #region 進階搜尋
    function addAdvancedSearch(settings) {
        const tlElement = document.querySelector(".tl");
        if (!tlElement) return;
        const advancedSearchDiv = createAdvancedSearchDiv(settings);
        document.body.appendChild(advancedSearchDiv);
        initCheckboxGroupWithSettings(advancedSearchDiv, settings);
        addEventListenerForAdvancedSearch(advancedSearchDiv);
    }
    function createAdvancedSearchDiv(settings, TIDOptions = DEFAULT_TID_OPTIONS) {
        const advancedSearchDiv = document.createElement("div");
        const excludeOptions = settings.excludeOptions || [];
        const excludeOptionsFormatted = excludeOptions.map(option => ({ label: option, value: option }));
        advancedSearchDiv.appendChild(createCheckboxGroup("excludeGroup", "排除關鍵字", excludeOptionsFormatted));
        advancedSearchDiv.appendChild(createCheckboxGroup("TIDGroup", "只看板塊", TIDOptions));
        advancedSearchDiv.classList.add("advanced-search");
        return advancedSearchDiv;
    }
    function initCheckboxGroupWithSettings(div, settings) {
        const setCheckboxes = (group, values) => {
            if (!Array.isArray(values)) return;
            values.forEach(value => {
                const checkbox = div.querySelector(`#${group} input[value="${value}"]`);
                if (checkbox) checkbox.checked = true;
            });

            const selectAllCheckbox = div.querySelector(`#bgsh-${group}-select-all`);
            const otherCheckboxes = Array.from(div.querySelectorAll(`#${group} input[type="checkbox"]:not(.select-all)`));

            if (selectAllCheckbox && otherCheckboxes.length > 0) {
                const checkedCount = otherCheckboxes.filter(cb => cb.checked).length;
                selectAllCheckbox.checked = checkedCount === otherCheckboxes.length && checkedCount > 0;
                selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < otherCheckboxes.length;
            }
        };
        setCheckboxes("excludeGroup", settings.excludeGroup);
        setCheckboxes("TIDGroup", settings.TIDGroup);
    }
    function addEventListenerForAdvancedSearch(div) {
        div.addEventListener("change", (e) => {
            const handleCheckboxChange = (group) => {
                if (e.target.closest(`#${group}`)) {
                    const selectedValues = [...document.querySelectorAll(`#${group} input:checked:not(.select-all)`)].map(input => input.value);
                    GM_setValue(group, JSON.stringify(selectedValues));
                }
            };
            handleCheckboxChange("excludeGroup");
            handleCheckboxChange("TIDGroup");
            filterElementsBasedOnSettings(getSettings());
        });
    }
    function replaceImageSrc() {
        window.addEventListener("load", () => {
            document.querySelectorAll('img[src="static/image/common/logo_sc_s.png"]').forEach(img => {
                img.src = "static/image/common/logo.png";
            });
        });
    }
    // #endregion

    // #region 主程式啟動
    async function main() {
        try {
            const settings = getSettings();
            if (Date.now() - settings.lastCheckedUpdate > 24 * 60 * 60 * 1000) {
                checkForUpdates();
            }
            await baseFunction(settings);
        } catch (error) {
            console.error("[98助手] 腳本執行時發生嚴重錯誤:", error);
            alert("[98助手] 腳本執行時發生嚴重錯誤，請按 F12 查看控制台資訊並回報。");
        }
    }

    main();
    // #endregion
})();