// ==UserScript==
// @name         98助手 (精簡版)
// @namespace    https://www.sehuatang.net
// @version      202509070611
// @description  根據您的需求精簡了腳本功能，保留了自動簽到、進階搜尋、快速操作、無縫翻頁等核心功能。
// @author       Joey
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
// @exclude      */forum.php?mod=forumdisplay&fid=96*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/548642/98%E5%8A%A9%E6%89%8B%20%28%E7%B2%BE%E7%B0%A1%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548642/98%E5%8A%A9%E6%89%8B%20%28%E7%B2%BE%E7%B0%A1%E7%89%88%29.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  /* global showWindow */
  /* global stopRandomSelection */
  /* global setanswer */

  // #region 全域變數

  /**
   * activeTooltips: 用於記錄目前頁面中活動的工具提示數量。這可以用於管理和控制頁面上顯示的提示。
   */
  let activeTooltips = 0;

  /**
   * DEFAULT_TID_OPTIONS: 儲存預設的板塊列表。
   * 每個板塊都有一個唯一的value和一個對應的label。
   * 這個常數可以被用於下拉列表、搜尋過濾等。
   */
  const DEFAULT_TID_OPTIONS = [
    { value: 95, label: "綜合區" },
    { value: 166, label: "AI區" },
    { value: 141, label: "原創區" },
    { value: 142, label: "轉帖區" },
    { value: 96, label: "投訴區" },
    { value: 97, label: "出售區" },
    { value: 143, label: "懸賞區" },
    { value: 2, label: "國產原創" },
    { value: 36, label: "亞洲無碼" },
    { value: 37, label: "亞洲有碼" },
    { value: 103, label: "中文字幕" },
    { value: 107, label: "三級寫真" },
    { value: 160, label: "VR影片區" },
    { value: 104, label: "素人有碼" },
    { value: 38, label: "歐美無碼" },
    { value: 151, label: "4K原版" },
    { value: 152, label: "韓國主播" },
    { value: 39, label: "動漫原創" },
    { value: 154, label: "文學區原創人生" },
    { value: 135, label: "文學區亂倫人妻" },
    { value: 137, label: "文學區青春校園" },
    { value: 138, label: "文學區武俠玄幻" },
    { value: 136, label: "文學區激情都市" },
    { value: 139, label: "文學區TXT下載" },
    { value: 145, label: "原檔自提字幕區" },
    { value: 146, label: "原檔自譯字幕區" },
    { value: 121, label: "原檔字幕分享區" },
    { value: 159, label: "原檔新作區" },
    { value: 41, label: "在線國產自拍" },
    { value: 109, label: "在線中文字幕" },
    { value: 42, label: "在線日韓無碼" },
    { value: 43, label: "在線日韓有碼" },
    { value: 44, label: "在線歐美風情" },
    { value: 45, label: "在線卡通動漫" },
    { value: 46, label: "在線劇情三級" },
    { value: 155, label: "圖區原創自拍" },
    { value: 125, label: "圖區轉帖自拍" },
    { value: 50, label: "圖區華人街拍" },
    { value: 48, label: "圖區亞洲性愛" },
    { value: 49, label: "圖區歐美性愛" },
    { value: 117, label: "圖區卡通動漫" },
    { value: 165, label: "圖區套圖下載" },
  ];

  /**
   * baseURL: 獲取目前頁面的主機URL，用於建構其他URL。
   */
  const baseURL = `https://${window.location.host}`;

  // #endregion

  // #region 獲取使用者設定

  /**
   * 獲取使用者設定。
   * 從使用者腳本的儲存中檢索各種設定，並為每個設定返回其值或預設值。
   * 這些設定可以用於改變腳本的行為、外觀和功能。
   *
   * @returns {Object} 返回一個物件，該物件包含了所有的使用者設定。
   */
  function getSettings() {
    /**
     * 從腳本儲存中獲取JSON值。
     * 如果檢索到的值不是有效的JSON，則返回預設值。
     *
     * @param {string} key - 儲存的鍵名。
     * @param {string} defaultValue - 如果無法檢索到或解析值，則返回的預設JSON值。
     * @returns {any} 返回解析的JSON值或預設值。
     */
    const getJSONValue = (key, defaultValue) => {
      const value = GM_getValue(key, defaultValue);
      try {
        return JSON.parse(value);
      } catch {
        return JSON.parse(defaultValue);
      }
    };

    return {
      excludeGroup: getJSONValue("excludeGroup", "[]"), // 【修正】加回此項以避免儲存功能出錯
      TIDGroup: getJSONValue("TIDGroup", "[]"), // TID分組
      displayBlockedTips: GM_getValue("displayBlockedTips", true), // 是否顯示訊息
      autoPagination: GM_getValue("autoPagination", true), // 是否開啟自動分頁
      showImageButton: GM_getValue("showImageButton", "hide"), // 是否顯示圖片按鈕
      lastCheckedUpdate: GM_getValue("lastCheckedUpdate", 0), // 最後一次檢查更新的時間
      excludeOptions: GM_getValue("excludeOptions", [
        "度盤",
        "夸克",
        "內容隱藏",
        "搬運",
        "SHA1",
      ]), // 要排除的選項
      excludePostOptions: GM_getValue("excludePostOptions", ["度盤", "夸克"]), // 要排除的選項
      blockedUsers: GM_getValue("blockedUsers", [
        "老灯法师",
        "树根520",
        "豪大大鸡排",
        "林哲",
        "aa142150",
        "如果有重来",
        "Lcc123456cc",
      ]), // 被封鎖的使用者
      orderFids: getJSONValue("orderFids", "[]"), // FID的順序
      maxGradeThread: GM_getValue("maxGradeThread", 10),
      displayThreadBuyInfo: GM_getValue("displayThreadBuyInfo", true), ///帖子是否顯示購買次數
      showDown: GM_getValue("showDown", true), // 是否顯示下載附件
      showCopyCode: GM_getValue("showCopyCode", true), // 是否顯示複製程式碼
      showFastReply: GM_getValue("showFastReply", true), // 是否顯示快速回覆
      showQuickGrade: GM_getValue("showQuickGrade", true), // 是否顯示快速評分
      showQuickStar: GM_getValue("showQuickStar", true), // 是否顯示快速收藏
      showClickDouble: GM_getValue("showClickDouble", true), // 是否顯示一鍵二連
      showViewRatings: GM_getValue("showViewRatings", true), // 是否顯示查看評分
      showPayLog: GM_getValue("showPayLog", true), // 是否顯示購買記錄
      showFastCopy: GM_getValue("showFastCopy", true), // 是否顯示複製帖子
      blockingResolved: GM_getValue("blockingResolved", true), // 是否顯示屏蔽解決
      isOnlyShowMoney: GM_getValue("isOnlyShowMoney", false), // 是否只顯示現金帖
      blockingIndex: GM_getValue("blockingIndex", false), // 是否屏蔽首頁熱門
      qiandaoTip: GM_getValue("qiandaoTip", true), // 是否顯示簽到提示
      menuButtonIsVisible: GM_getValue("menuButtonIsVisible", true), // 是否顯示按鈕容器
    };
  }

  // #endregion

  // #region 樣式

  /**
   * 新增自訂樣式到頁面中。
   * 此函數會建立一個<style>元素，並定義了一些自訂的CSS樣式，然後將其新增到文件的頭部。
   */

  function addStyles() {
    // 建立一個新的<style>元素
    const style = document.createElement("style");

    // 定義我們需要的自訂樣式
    style.innerHTML = `
                /* --- 通用自訂按鈕的樣式 --- */
                .bgsh-customBtn, .bgsh-searchBtn, .bgsh-quickReplyToPostBtn, .bgsh-openAllUrlBtn { /* 【修正】將批量開啟按鈕加入基礎樣式 */
                    padding: 8px 15px;
                    margin-bottom: 8px;
                    margin-right: 8px;
                    width: 100%;
                    border: none;
                    outline: none;
                    white-space: pre-line; /* 保留換行符，但仍然合併連續的空白 */
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    color: #ffffff;
                    cursor: pointer;
                    box-shadow: -5px -5px 8px #F6CEEC, 5px 5px 8px #BC78EC;
                    transition: 0.8s;
                }
                .bgsh-quickReplyToPostBtn{
                    width: auto;
                    float: right;
                    box-shadow: -5px -5px 8px #F6CEEC, 5px 5px 8px #C346C2;
                }
                /* openAllUrlBtn按鈕的設定 (樣式覆蓋) */
                .bgsh-openAllUrlBtn {
                    width: 100px;
                    font-size: 16px;
                    padding: 0;
                    box-shadow: 0 0px 0px #ccc;
                }
                /* 按鈕的最大寬度設定 */
                .bgsh-searchBtn {
                    max-width: 400px;
                    background-color: #0D25B9;
                }
                /* 按鈕的懸停效果 */
                .bgsh-customBtn:hover {
                    transform: scale(1.05);
                    background-color: #ABDCFF;
                    box-shadow: inset 5px 5px 10px #7367F0, inset -5px -5px 10px #CE9FFC;
                }
                /* 按鈕的懸停效果 */
                .bgsh-searchBtn:hover {
                    transform: scale(1.05);
                    background-color: #5961F9;
                    box-shadow: inset 5px 5px 10px #7367F0, inset -5px -5px 10px #CE9FFC;
                }
                .bgsh-quickReplyToPostBtn:hover {
                    transform: scale(1.05);
                    background-color: #32CCBC;
                    box-shadow: inset 5px 5px 10px #1D6FA3, inset -5px -5px 10px #65FDF0;
                }
                /* --- 自訂的搜尋框樣式 --- */
                .advanced-search {
                    position: fixed;
                    right: calc(150px + 1vh);
                    top: 100px;
                    z-index: 1000;
                    background: #fff;
                    border: 1px solid #ddd;
                    padding: 10px;
                    display: grid; /* 使用網格佈局 */
                    grid-template-columns: auto auto; /* 兩列的寬度根據內容自適應 */
                    column-gap: 20px; /* 列之間的間隙 */
                }
                /* 新增間距 */
                .advanced-search .bgsh-forget {
                    max-height: 580px; /* 設定最大高度限制 */
                    overflow: visible; /* 確保超出部分內容可見 */
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                }
                /* --- 核取方塊樣式 --- */
                .bgsh-forget .bgsh-checkbox-label {
                    display: block;
                    position: relative;
                    cursor: pointer;
                    font-size: 22px;
                    line-height: 22px;
                    margin-right: 10px;
                }
                .bgsh-label-text {
                    display: inline-block;
                    font-weight: 500;
                    left: 12%;
                    font-size: 13px;
                }
                .bgsh-forget .bgsh-checkbox-label input {
                    opacity: 0;
                    cursor: pointer;
                }
                /* 核取方塊的自訂樣式 */
                .bgsh-checkbox-label .bgsh-checkbox-custom {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 20px;
                    width: 20px;
                    background-color: #ecf0f3;
                    border-radius: 5px;
                    border: none;
                    box-shadow: inset 3px 3px 3px #cbced1, inset -3px -3px 3px #fff;
                }
                /* 核取方塊選取狀態樣式 */
                .bgsh-checkbox-label input:checked ~ .bgsh-checkbox-custom {
                    box-shadow: -4px -4px 4px #feffff, 4px 4px 4px #161b1d2f;
                }
                /* 核取方塊標誌樣式 */
                .bgsh-checkbox-label .bgsh-checkbox-custom::after {
                    position: absolute;
                    content: "";
                    left: 10px;
                    top: 10px;
                    height: 0;
                    width: 0;
                    border-radius: 5px;
                    border: solid #635f5f;
                    border-width: 0 3px 3px 0;
                    transform: rotate(0deg) scale(0);
                    opacity: 1;
                    transition: all 0.3s ease-out;
                }
                /* 核取方塊選取狀態下的標誌樣式 */
                .bgsh-checkbox-label input:checked ~ .bgsh-checkbox-custom::after {
                    transform: rotate(45deg) scale(1);
                    left: 7px;
                    top: 3px;
                    width: 4px;
                    height: 8px;
                }
                /* 自訂核取方塊的indeterminate標誌樣式 */
                .bgsh-checkbox-label .bgsh-checkbox-custom::before {
                    position: absolute;
                    content: "";
                    left: 5px;
                    top: 9px;
                    width: 10px;
                    height: 2px;
                    background-color: #635f5f;
                    opacity: 0;
                    transition: opacity 0.3s ease-out;
                }
                /* 當核取方塊處於indeterminate狀態時的樣式 */
                .bgsh-checkbox-label input:indeterminate ~ .bgsh-checkbox-custom::before {
                    opacity: 1;
                }
                .bgsh-dateInput {
                    border: 1px solid #d4d4d4;       /* 邊框 */
                    border-radius: 5px;              /* 圓角 */
                    background-color: #fff;          /* 背景顏色 */
                    transition: border 0.3s;         /* 過渡效果 */
                    margin: 0 5px;                   /* 左右邊距 */
                    width: 90px;                    /* 設定寬度 */
                }
                /* 聚焦時的樣式 */
                .bgsh-dateInput:focus {
                    border-color: #007BFF;           /* 聚焦時的邊框顏色 */
                    outline: none;                   /* 去除預設的輪廓 */
                    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 聚焦時的陰影效果 */
                }
                /* 滑鼠懸浮時的樣式 */
                .bgsh-dateInput:hover {
                    border-color: #b3b3b3;           /* 滑鼠懸浮時的邊框顏色 */
                }
                `;

    // 將<style>元素新增到文件的頭部
    document.head.appendChild(style);
  }

  // #endregion

  // #region 訊息提示

  /**
   * 在頁面中顯示一個淡出的提示訊息。
   * 使用該函數可以在頁面中臨時顯示一個提示訊息，該訊息在一段時間後會自動淡出並消失。
   *
   * @param {string} message - 需要顯示的提示訊息內容。
   */
  function showTooltip(message) {
    const tooltip = document.createElement("span");

    // 設定提示訊息的初始樣式
    const tooltipStyles = {
      position: "fixed",
      top: `calc(33.33% + ${activeTooltips * 80}px)`,
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#333",
      color: "#fff",
      padding: "20px 40px",
      borderRadius: "10px",
      zIndex: "1000",
      transition: "opacity 0.5s",
      fontSize: "24px",
      opacity: "1", // 預設透明度為1
    };
    Object.assign(tooltip.style, tooltipStyles); // 使用Object.assign將樣式批次應用到元素上
    tooltip.innerText = "友情提示: " + message;
    document.body.appendChild(tooltip);

    activeTooltips++;

    // 淡出效果函數
    const fadeOut = (element, duration = 500) => {
      let opacity = 1;
      const timer = setInterval(function () {
        opacity -= 50 / duration;
        if (opacity <= 0) {
          clearInterval(timer);
          element.style.display = "none";
        } else {
          element.style.opacity = opacity;
        }
      }, 50);
    };

    setTimeout(() => {
      fadeOut(tooltip);
      setTimeout(() => {
        document.body.removeChild(tooltip);
        activeTooltips--;
      }, 500);
    }, 2000);
  }
  // #endregion

  // #region Tampermonkey 選單命令註冊
  /**
   * 註冊一個命令到Tampermonkey的上下文選單，允許使用者存取“98助手”的設定介面。
   */
  GM_registerMenuCommand("98助手設定", () => {
    createSettingsUI(getSettings());
  });
  // #endregion

  // #region 設定介面HTML建構

  /**
   * 產生“98助手”設定介面的HTML內容
   * @param {Object} settings - 目前的設定資料
   * @returns {string} - 設定介面的HTML字串
   */
  function generateSettingsHTML(settings) {
    return `
            <div class='bgsh-setting-box'>
                <div class='bgsh-setting-box-container '>
                    <div class="bgsh-setting-first">
                        <label for="maxGradeThread">主帖評分最大值:</label>
                        <input type="number" id="maxGradeThread" value="${
                          settings.maxGradeThread
                        }">
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="displayBlockedTipsCheckbox">
                            <input type='checkbox' id="displayBlockedTipsCheckbox" ${
                              settings.displayBlockedTips ? "checked" : ""
                            }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>顯示黑名單屏蔽提示</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="autoPaginationCheckbox">
                            <input type='checkbox' id="autoPaginationCheckbox" ${
                              settings.autoPagination ? "checked" : ""
                            }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>啟用自動翻頁</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="displayThreadBuyInfoCheckbox" >
                        <input type='checkbox' id="displayThreadBuyInfoCheckbox" ${
                          settings.displayThreadBuyInfo ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>顯示購買次數</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showDownCheckbox">
                        <input type='checkbox' id="showDownCheckbox" ${
                          settings.showDown ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>啟用下載附件</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showCopyCodeCheckbox">
                        <input type='checkbox' id="showCopyCodeCheckbox" ${
                          settings.showCopyCode ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>啟用複製程式碼</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showFastReplyCheckbox">
                        <input type='checkbox' id="showFastReplyCheckbox" ${
                          settings.showFastReply ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>啟用快速回覆</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showQuickGradeCheckbox">
                        <input type='checkbox' id="showQuickGradeCheckbox" ${
                          settings.showQuickGrade ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>啟用快速評分</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showQuickStarCheckbox">
                        <input type='checkbox' id="showQuickStarCheckbox" ${
                          settings.showQuickStar ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>啟用快速收藏</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showClickDoubleCheckbox">
                        <input type='checkbox' id="showClickDoubleCheckbox" ${
                          settings.showClickDouble ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>啟用一鍵二連</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showViewRatingsCheckbox">
                        <input type='checkbox' id="showViewRatingsCheckbox" ${
                          settings.showViewRatings ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>啟用查看評分</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showPayLogCheckbox">
                        <input type='checkbox' id="showPayLogCheckbox" ${
                          settings.showPayLog ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>啟用購買記錄</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showFastCopyCheckbox">
                        <input type='checkbox' id="showFastCopyCheckbox" ${
                          settings.showFastCopy ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>啟用複製帖子</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="blockingIndexCheckbox">
                        <input type='checkbox' id="blockingIndexCheckbox" ${
                          settings.blockingIndex ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>屏蔽首頁熱門</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="qiandaoTipCheckbox">
                        <input type='checkbox' id="qiandaoTipCheckbox" ${
                          settings.qiandaoTip ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>簽到提示</span>
                        </label>
                        <br>
                    </div>
                    <div class="bgsh-setting-second">
                        <label for="excludeOptionsTextarea">進階搜尋排除關鍵字（每行一個）:</label>
                        <br>
                        <textarea id="excludeOptionsTextarea">${settings.excludeOptions.join(
                          "\n"
                        )}</textarea>
                        <br>
                        <label for="blockedUsersList">黑名單屏蔽的使用者名稱（每行一個）：</label>
                        <br>
                        <textarea id="blockedUsersList">${settings.blockedUsers.join(
                          "\n"
                        )}</textarea>
                        <br>
                        <label for="excludePostOptionsTextarea">帖子列表頁黑名單關鍵字（每行一個）:</label>
                        <br>
                        <textarea id="excludePostOptionsTextarea">${settings.excludePostOptions.join(
                          "\n"
                        )}</textarea>
                        <br>

                    </div>
                </div>
                <div class="bgsh-setting-button">
                    <button id="saveButton">儲存</button>
                    <button id="closeButton">關閉</button>
                </div>
            </div>
        `;
  }

  // #endregion

  // #region 設定介面產生與事件綁定

  /**
   * 建立並顯示設定介面
   * @param {Object} settings - 目前的設定資料
   */
  function createSettingsUI(settings) {
    // 若之前的設定介面存在，先進行移除
    const existingContainer = document.getElementById("settingsUIContainer");
    if (existingContainer) {
      existingContainer.remove();
    }

    // 新增設定介面的樣式
    generateSettingsStyles();

    // 根據目前設定產生介面內容
    const containerHTML = generateSettingsHTML(settings);

    // 建立介面容器，並新增到頁面
    const container = document.createElement("div");
    container.id = "settingsUIContainer";
    container.innerHTML = containerHTML;
    document.body.appendChild(container);

    // 為「儲存」和「關閉」按鈕綁定事件
    const saveButton = document.getElementById("saveButton");
    const closeButton = document.getElementById("closeButton");

    // 儲存按鈕點擊後，儲存設定並隱藏介面
    saveButton.addEventListener("click", function () {
      saveSettings();
      container.style.display = "none";
    });

    // 關閉按鈕點擊後，直接隱藏介面
    closeButton.addEventListener(
      "click",
      () => (container.style.display = "none")
    );
  }

  // #endregion

  // #region 設定介面樣式

  /**
   * 產生並應用設定介面的樣式
   */
  function generateSettingsStyles() {
    const style = `
                /* 通用樣式，應用於所有元素 */
                #settingsUIContainer * {
                    box-sizing: border-box;
                    margin: 0px;
                    padding: 0px;
                    font-family: "Inter", Arial, Helvetica, sans-serif;
                }
                #settingsUIContainer {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 666px;
                    z-index: 9999;
                }
                /* 文字選取時的背景色 */
                #settingsUIContainer *::selection {
                    background-color: #c7c9ca;
                }
                /* 盒子 */
                #settingsUIContainer .bgsh-setting-box {
                    margin: auto;
                    box-sizing: border-box;
                    padding: 20px 20px;
                    background-color: #ecf0f3;
                    box-shadow: -8px -8px 8px #feffff, 8px 8px 8px #161b1d2f;
                    overflow-y: auto; /* 當內容超出容器高度時，自動新增垂直捲軸 */
                    height: 92vh; /* 設定高度為視窗的 92% */
                    max-height: 888px; /* 設定最大高度*/
                    display: flex; /* 設定為flex容器 */
                    flex-direction: column; /* 子元素在垂直方向上排列 */
                }
                /* 標籤樣式 */
                #settingsUIContainer label {
                    font-size: 13px;
                    font-weight: 500;
                    color: #858686;
                }
                /* 核取方塊標籤樣式 */
                #settingsUIContainer .bgsh-setting-checkbox-label {
                    display: block;
                    position: relative;
                    cursor: pointer;
                    font-size: 13px;
                    line-height: 22px;
                }
                /* 核取方塊標籤中的文字樣式 */
                #settingsUIContainer span {
                    color: #8f8c8c;
                    display: inline-block;
                    position: absolute;
                    font-weight: 500;
                    left: 12%;
                    font-size: 13px;
                }
                /* 輸入框樣式 */
                #settingsUIContainer input[type="text"],
                #settingsUIContainer input[type="number"] {
                    width: 100%;
                    height: 35px;
                    padding-left: 20px;
                    border: none;
                    color: #858686;
                    margin-top: 10px;
                    background-color: #ecf0f3;
                    outline: none;
                    border-radius: 5px;
                    box-shadow: inset 5px 5px 5px #cbced1, inset -5px -5px 5px #ffffff;
                }
                #settingsUIContainer textarea {
                    width: 100%;
                    height: 150px;
                    padding-left: 20px;
                    padding-top: 10px;
                    border: none;
                    color: #858686;
                    margin-top: 10px;
                    background-color: #ecf0f3;
                    outline: none;
                    border-radius: 5px;
                    box-shadow: inset 5px 5px 5px #cbced1, inset -5px -5px 5px #ffffff;
                }
                /* 核取方塊輸入框樣式 */
                #settingsUIContainer input[type="checkbox"] {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                }
                /* 自訂核取方塊樣式 */
                #settingsUIContainer .bgsh-setting-checkbox-label .bgsh-setting-checkbox-custom {
                    position: absolute;
                    top: 0;
                    left: 0px;
                    height: 20px;
                    width: 20px;
                    background-color: #ecf0f3;
                    border-radius: 5px;
                    border: none;
                    box-shadow: inset 3px 3px 3px #cbced1, inset -3px -3px 3px #ffff;
                }
                /* 核取方塊選取狀態樣式 */
                #settingsUIContainer .bgsh-setting-checkbox-label input:checked ~ .bgsh-setting-checkbox-custom {
                    background-color: #ecf0f3;
                    border-radius: 5px;
                    -webkit-transform: rotate(0deg) scale(1);
                    -ms-transform: rotate(0deg) scale(1);
                    transform: rotate(0deg) scale(1);
                    opacity: 1;
                    border: none;
                    box-shadow: -4px -4px 4px #feffff, 4px 4px 4px #161b1d2f;
                }
                /* 自訂核取方塊的標誌樣式 */
                #settingsUIContainer .bgsh-setting-checkbox-label .bgsh-setting-checkbox-custom::after {
                    position: absolute;
                    content: "";
                    left: 10px;
                    top: 10px;
                    height: 0px;
                    width: 0px;
                    border-radius: 5px;
                    border: solid #635f5f;
                    border-width: 0 3px 3px 0;
                    -webkit-transform: rotate(0deg) scale(0);
                    -ms-transform: rotate(0deg) scale(0);
                    transform: rotate(0deg) scale(0);
                    opacity: 1;
                    transition: all 0.3s ease-out;
                }
                /* 核取方塊選取狀態下的標誌樣式 */
                #settingsUIContainer .bgsh-setting-checkbox-label input:checked ~ .bgsh-setting-checkbox-custom::after {
                    -webkit-transform: rotate(45deg) scale(1);
                    -ms-transform: rotate(45deg) scale(1);
                    transform: rotate(45deg) scale(1);
                    opacity: 1;
                    left: 7px;
                    top: 3px;
                    width: 4px;
                    height: 8px;
                    border: solid #635f5f;
                    border-width: 0 2px 2px 0;
                    background-color: transparent;
                    border-radius: 0;
                }
                /* 按鈕樣式 */
                #settingsUIContainer button {
                    width: 50px;
                    margin-top: 20px;
                    height: 38px;
                    border: none;
                    outline: none;
                    border-radius: 20px;
                    background-color: #727171;
                    font-size: 13px;
                    font-weight: 500;
                    color: #ffffff;
                    cursor: pointer;
                    box-shadow: -5px -5px 8px #d8e2e6, 5px 5px 10px #2c313378;
                    transition: 0.8s;
                }
                /* 按鈕懸停狀態樣式 */
                #settingsUIContainer button:hover {
                    background-color: #535658;
                    box-shadow: inset 5px 5px 10px #05050578, inset -5px -5px 10px #9e9c9c;
                }
                .bgsh-setting-first,
                .bgsh-setting-second {
                    width: 50%; /* 設定為50%寬度 */
                }
                .bgsh-setting-box-container {
                    display: flex; /* 設定為flex容器，使其子元素水平排列 */
                    gap: 20px; /* 設定子元素之間的間隔，你可以根據需要調整 */
                }
                .bgsh-setting-button {
                    width: 100%; /* 佔據100%的寬度 */
                    text-align: center; /* 按鈕置中顯示 */
                    gap: 20px; /* 設定子元素之間的間隔，你可以根據需要調整 */
                }
                `;

    const styleElement = document.createElement("style");
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
  }

  // #endregion

  // #region 剪貼簿操作

  /**
   * 將指定文字複製到剪貼簿。
   * @param {string} text - 需要複製的文字。
   * @param {function} onSuccess - 複製成功時的回呼函數。
   * @param {function} onError - 複製失敗時的回呼函數。
   */
  async function copyToClipboard(text, onSuccess, onError) {
    try {
      await navigator.clipboard.writeText(text);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (onError) {
        onError(err);
      }
      console.error("無法將文字複製到剪貼簿", err);
    }
  }

  // #endregion

  // #region URL處理

  /**
   * 從給定的URL中解析查詢參數。
   * @param {string} url - 需要解析的URL。
   * @returns {object} 返回一個包含查詢參數的物件。
   */
  function getQueryParams(url) {
    const queryParams = {};

    // 檢查 URL 是否包含傳統的查詢字串
    if (url.includes("?")) {
      // 處理標準查詢字串
      const queryPattern = /[?&]([^=&]+)=([^&]*)/g;
      let match;
      while ((match = queryPattern.exec(url)) !== null) {
        queryParams[match[1]] = decodeURIComponent(match[2]);
      }
    } else {
      // 處理特殊的 URL 路徑模式，如 forum-154-1.html
      const pathPattern = /forum-(\d+)-(\d+)\.html$/;
      const pathMatch = pathPattern.exec(url);
      if (pathMatch && pathMatch.length === 3) {
        // 假設第一個數字是 fid，第二個數字是 page
        queryParams.fid = pathMatch[1];
        queryParams.page = pathMatch[2];
      }
    }

    return queryParams;
  }

  /**
   * 從給定的URL中解析tid。
   * @param {string} url - 需要解析的URL。
   * @returns {object} 返回一個包含查詢參數的物件。
   */
  function extractTid(url) {
    let tid = null;

    // 檢查是否是類似 /thread-XXXX-1-1.html 的格式
    const threadMatch = url.match(/thread-(\d+)-\d+-\d+\.html/);
    if (threadMatch && threadMatch.length > 1) {
      tid = threadMatch[1];
    } else {
      // 檢查是否是類似 /forum.php?mod=viewthread&tid=XXXX&extra=... 的格式
      const queryMatch = url.match(/tid=(\d+)/);
      if (queryMatch && queryMatch.length > 1) {
        tid = queryMatch[1];
      }
    }

    return tid;
  }

  // #endregion

  // #region DOM操作

  /**
   * 解析給定內容為DOM。
   *
   * @param {string} content - 要解析的內容。
   * @param {string} type - 解析內容的類型，預設為"text/html"。
   * @returns {Document} - 返回解析後的文件。
   */
  function parseContent(content, type = "text/html") {
    return new DOMParser().parseFromString(content, type);
  }

  /**
   * 從給定的DOM文件中提取值。
   *
   * @param {Document} doc - 要從中提取值的DOM文件。
   * @param {string} selector - 用於定位元素的CSS選擇器。
   * @param {string} attr - 要提取的屬性，預設為"value"。
   * @returns {string|null} - 返回提取的值或null。
   */
  function extractValueFromDOM(doc, selector, attr = "value") {
    const elem = doc.querySelector(selector);
    if (!elem) return null;
    return elem.getAttribute(attr);
  }

  // #endregion

  // #region 使用者資訊獲取

  /**
   * 從頁面中獲取目前登入使用者的 userid。
   * @returns {string|null} 返回使用者ID，如果未找到則返回null。
   */
  function getUserId() {
    const userLink = document.querySelector(".vwmy a");
    if (userLink) {
      const match = userLink.href.match(/uid=(\d+)/);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  // #endregion

  // #region 帖子資訊獲取

  /**
   * 從給定的元素中獲取其父級table的帖子樓層Pid。
   * @param {HTMLElement} element - 要查詢的HTML元素。
   * @returns {string|null} 返回樓層的Pid，如果未找到則返回null。
   */
  function getTableIdFromElement(element) {
    if (element) {
      let parentTable = element.closest("table");
      if (parentTable && parentTable.id.startsWith("pid")) {
        return parentTable.id.replace("pid", "");
      }
    }
    return null;
  }

  // #endregion

  // #region 會話驗證

  /**
   * 從頁面中獲取formhash值。
   * @returns {string|null} 返回formhash值，如果未找到則返回null。
   */
  function getFormHash() {
    const element = document.querySelector('input[name="formhash"]');
    if (element) {
      return element.value;
    } else {
      return null;
    }
  }

  // #endregion

  // #region 帖子列表樣式設定

  /**
   * 在帖子標題旁顯示熱度。
   */
  function displayHeatLevel() {
    // 獲取頁面上所有alt="heatlevel"的<img>元素
    var images = document.querySelectorAll('img[alt="heatlevel"]');
    images.forEach((image) => {
      // 尋找同級的符合條件的<a>標籤
      var parent = image.parentNode;
      var link = parent.querySelector("a.s.xst");
      var uniqueId = "baoguoheatleveldisplay"; // 設定一個唯一的ID

      if (link) {
        const existingSpan = link.parentNode.querySelector("#" + uniqueId);
        if (!existingSpan) {
          var span = document.createElement("span");
          span.textContent = ` [${image.getAttribute("title")}]`; // 使用圖片的title屬性值
          // 設定樣式
          span.style.color = "red";
          span.style.fontWeight = "bold";
          span.id = uniqueId;

          // 將<span>元素插入到<a>標籤後面
          link.parentNode.insertBefore(span, link.nextSibling);
        }
      }
    });
  }

  // #endregion

  // #region 頁碼操作

  /**
   * 從頁面的一個位置複製頁碼到另一個位置。
   */
  function addPageNumbers() {
    const sourceElement = document.querySelector(".pgs.cl.mbm");
    const targetElement = document.querySelector(".slst.mtw");

    if (!sourceElement) {
      return;
    }

    if (!targetElement) {
      return;
    }

    const parentElement = targetElement.parentElement;

    if (!parentElement) {
      return;
    }

    const clonedElement = sourceElement.cloneNode(true);
    parentElement.insertBefore(clonedElement, targetElement);
  }

  // #endregion

  // #region UI組件建立

  /**
   * 建立一個核取方塊組。
   * @param {string} id - 組件的ID。
   * @param {string} title - 核取方塊組的標題。
   * @param {Array} options - 核取方塊選項陣列，每個選項包含"value"和"label"屬性。
   * @returns {HTMLElement} 返回核取方塊組的HTML元素。
   */
  function createCheckboxGroup(id, title, options) {
    const groupDiv = document.createElement("div");
    groupDiv.className = "bgsh-forget";
    groupDiv.id = id;

    let innerHTML = `<strong>${title}</strong><br>`;

    // 新增一個'全選'核取方塊
    const selectAllId = `bgsh-${id}-select-all`;
    innerHTML += `
              <label class="bgsh-checkbox-label">
                  <input type="checkbox" id="${selectAllId}" class="select-all">
                  <span class="bgsh-checkbox-custom"></span>
                  <span class="bgsh-label-text">全選</span>
              </label>
          `;

    options.forEach((option) => {
      const checkboxId = `bgsh-${id}-${option.value}`;
      innerHTML += `
                  <label class="bgsh-checkbox-label">
                      <input type="checkbox" id="${checkboxId}" value="${option.value}">
                      <span class="bgsh-checkbox-custom"></span>
                      <span class="bgsh-label-text">${option.label}</span>
                  </label>
          `;
    });

    groupDiv.innerHTML = innerHTML;

    // 新增事件監聽
    const selectAllCheckbox = groupDiv.querySelector(".select-all");
    const otherCheckboxes = Array.from(
      groupDiv.querySelectorAll('input[type="checkbox"]')
    ).filter((cb) => cb !== selectAllCheckbox);

    function checkIndeterminateStatus() {
      const checkedCheckboxes = otherCheckboxes.filter(
        (cb) => cb.checked
      ).length;

      selectAllCheckbox.checked = checkedCheckboxes === otherCheckboxes.length;
      selectAllCheckbox.indeterminate =
        checkedCheckboxes > 0 && checkedCheckboxes < otherCheckboxes.length;
    }

    // 初始化全選框狀態
    setTimeout(() => {
      checkIndeterminateStatus();
    }, 500);
    // 為 '全選' 核取方塊新增事件監聽器
    selectAllCheckbox.addEventListener("change", () => {
      otherCheckboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked;
      });

      // 在全選/取消全選後更新狀態
      checkIndeterminateStatus();
    });

    // 為其他核取方塊新增事件監聽器
    otherCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", checkIndeterminateStatus);
    });

    return groupDiv;
  }

  /**
   * 建立一個按鈕。
   * @param {string} id - 按鈕的ID。
   * @param {string} text - 按鈕上的文字。
   * @param {function} clickFunction - 按鈕點擊時的回呼函數。
   * @returns {HTMLElement} 返回建立的按鈕元素。
   */
  const createButton = (
    id,
    text,
    clickFunction,
    className = "bgsh-customBtn",
    bgColor = "#0396FF"
  ) => {
    const button = document.createElement("button");
    button.id = id;
    button.innerText = text;
    button.className = className;
    button.style.backgroundColor = bgColor; // 設定背景顏色
    button.addEventListener("click", clickFunction);
    return button;
  };

  /**
   * 建立一個固定位置的按鈕容器。
   * @returns {HTMLElement} 返回建立的按鈕容器元素。
   */
  function createButtonContainer() {
    const container = document.createElement("div");
    Object.assign(container.style, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "fixed",
      top: "50%",
      right: "1vh",
      zIndex: "1000",
      transform: "translateY(-50%)",
    });

    return container;
  }

  function createMenuButton(settings) {
    const menuButton = document.createElement("button");
    // 根據容器的可見性設定按鈕的文字
    menuButton.textContent = settings.menuButtonIsVisible ? "隱藏" : "顯示";
    // 根據容器的可見性設定按鈕的背景色
    const buttonColor = settings.menuButtonIsVisible ? "#4682B4" : "#FF6347";

    Object.assign(menuButton.style, {
      position: "fixed",
      top: "calc(50% - 60px)", // 將按鈕放在容器上方
      right: "1vh",
      zIndex: "1001", // 確保按鈕在容器之上
      cursor: "pointer",
      fontSize: "15px",
      padding: "15px 15px",
      borderRadius: "50%", // 圓形按鈕
      backgroundColor: buttonColor, // 根據狀態設定背景色
      color: "white",
      border: "none",
    });

    return menuButton;
  }
  function toggleContainer(menuButton, container) {
    const settings = getSettings();
    let isVisible = settings.menuButtonIsVisible; // 初始狀態設定為可見
    menuButton.addEventListener("click", () => {
      if (isVisible) {
        container.style.display = "none"; // 隱藏容器
        menuButton.textContent = "顯示"; // 選單按鈕圖示
        menuButton.style.backgroundColor = "#FF6347"; // 設定背景色為紅色

        isVisible = false;
      } else {
        container.style.display = "flex"; // 顯示容器
        menuButton.textContent = "隱藏"; // 選單按鈕圖示
        menuButton.style.backgroundColor = "#4682B4"; // 設定背景色為藍色

        isVisible = true;
      }
      // 更新和儲存新的可見性狀態
      GM_setValue("menuButtonIsVisible", isVisible);
      const newsettings = getSettings();
      setMenuButtonPosition(menuButton, container, newsettings);
    });
  }

  /**
   * 建立一個日期選擇框並返回
   * @param {string} id - 輸入元素的ID
   * @param {string} defaultValue - 預設日期值
   * @returns {HTMLElement} 日期選擇框
   */
  function createDateInput(
    id,
    defaultValue = new Date().toISOString().split("T")[0],
    className = "bgsh-dateInput"
  ) {
    const input = document.createElement("input");
    input.type = "date";
    input.id = id;
    input.value = defaultValue;
    input.className = className;

    return input;
  }
  // #endregion

  // #region 更新操作

  /**
   * 檢查腳本是否有新版本可用。
   * 從提供的URL中獲取最新版本號，並與目前版本進行比較。
   * 如果發現新版本，則顯示更新對話框。
   */
  async function checkForUpdates() {
    // 獲取目前腳本版本
    const currentVersion = GM.info.script.version;
    const updateURL =
      "https://sleazyfork.org/zh-TW/scripts/548642-98助手-精简版/code";

    try {
      // 請求最新版本的腳本內容
      let response = await fetch(updateURL);
      let data = await response.text();

      // 從腳本內容中比對版本號
      const matchVersion = data.match(/@version\s+([\d.]+)/);

      // 如果比對到新版本號且新版本號大於目前版本號，顯示更新對話框
      if (
        matchVersion &&
        matchVersion[1] &&
        parseFloat(matchVersion[1]) > parseFloat(currentVersion)
      ) {
        showUpdateDialog();
      }

      // 記錄最後一次檢查更新的時間
      GM_setValue("lastCheckedUpdate", Date.now());
    } catch (error) {
      console.error("檢查更新時出錯:", error);
    }
  }

  /**
   * 顯示腳本新版本的更新對話框。
   * 提供一個連結供使用者點擊以更新腳本。
   */
  function showUpdateDialog() {
    // 更新對話框的HTML內容
    const dialogHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 9999; display: flex; justify-content: center; align-items: center;">
                <div style="background: #fff; padding: 20px; border-radius: 5px;">
                    <p>有新版本的腳本可用！</p>
                    <a href="https://sleazyfork.org/zh-TW/scripts/548642-98助手-精简版" target="_blank">點擊這裡更新</a>
                    <button style="margin-top: 10px;" onclick="this.closest('.updateDialog').remove();">關閉</button>
                </div>
            </div>`;

    // 插入到頁面中
    const tempDiv = document.createElement("div");
    tempDiv.className = "updateDialog";
    tempDiv.innerHTML = dialogHTML;
    document.body.appendChild(tempDiv);
  }

  // #endregion

  // #region 使用者簽到功能

  /**
   * 為給定的使用者執行簽到操作。
   *
   * @param {string} userid 使用者ID
   * @returns {boolean} 簽到成功返回 true，否則返回 false
   */
  async function sign(userid) {
    const signURL = `${baseURL}/plugin.php?id=dd_sign&ac=sign&infloat=yes&handlekey=pc_click_ddsign&inajax=1&ajaxtarget=fwin_content_pc_click_ddsign`;
    const params = await getSignParameters(signURL);

    if (!params || !params.formhash || !params.signhash) {
      console.error("Failed to retrieve sign parameters.");
      return false;
    }

    const { formhash, signtoken, signhash } = params;
    const secanswer = await getValidationResult();

    let responseText = await postSignData({
      baseURL,
      formhash,
      signtoken,
      secanswer,
      signhash,
    });
    return updateSignButton(responseText, userid);
  }

  /**
   * 從指定的 URL 獲取簽到所需的參數。
   *
   * @param {string} url 目標URL
   * @returns {Object|null} 包含簽到參數的物件或null
   */
  async function getSignParameters(url) {
    const { responseText, contentType } = await fetchWithContentType(url);
    return handleResponseContent(responseText, contentType);
  }

  async function getValidationResult() {
    const secqaaURL = `/misc.php?mod=secqaa&action=update&idhash=qSAxcb0`;
    const { responseText, contentType } = await fetchWithContentType(secqaaURL);
    return extractValidationText(responseText, contentType);
  }

  async function postSignData({
    baseURL,
    formhash,
    signtoken,
    secanswer,
    signhash,
  }) {
    const postURL = `${baseURL}/plugin.php?id=dd_sign&ac=sign&signsubmit=yes&handlekey=pc_click_ddsign&signhash=${signhash}&inajax=1`;
    const data = new URLSearchParams({
      formhash,
      signtoken,
      secanswer,
      secqaahash: "qSAxcb0",
    });
    const response = await fetch(postURL, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });
    return response.text();
  }

  async function fetchWithContentType(url) {
    const response = await fetch(url);
    const contentType = response.headers.get("Content-Type");
    const responseText = await response.text();
    return { responseText, contentType };
  }

  function handleResponseContent(responseText, contentType) {
    if (contentType.includes("text/xml")) {
      return handleXMLContent(responseText);
    } else if (contentType.includes("text/html")) {
      return extractSignParametersFromHTML(responseText);
    } else {
      throw new Error("Unsupported content type");
    }
  }

  /**
   * 處理XML內容並提取所需的簽到參數。
   *
   * @param {string} responseText - 從請求中返回的XML內容。
   * @returns {object|null} - 返回提取的簽到參數或null。
   */
  function handleXMLContent(responseText) {
    const settings = getSettings();
    let xml = parseContent(responseText, "text/xml");
    let content = xml.getElementsByTagName("root")[0].textContent;
    let doc = parseContent(content);
    const alertErrorElement = doc.querySelector(".alert_error");
    if (alertErrorElement) {
      let scripts = alertErrorElement.querySelectorAll("script");
      scripts.forEach((script) => {
        script.remove();
      });
      if (settings.qiandaoTip) {
        showTooltip(alertErrorElement.textContent.trim());
      }
      return;
    } else {
      return extractSignParametersFromHTML(content);
    }
  }

  /**
   * 從HTML內容中提取簽到參數。
   *
   * @param {string} responseText - 從請求中返回的HTML內容。
   * @returns {object} - 返回提取的簽到參數。
   */
  function extractSignParametersFromHTML(responseText) {
    const doc = parseContent(responseText);
    const formhash = extractValueFromDOM(doc, 'input[name="formhash"]');
    const signtoken = extractValueFromDOM(doc, 'input[name="signtoken"]');
    const signhash = extractValueFromDOM(
      doc,
      'form[name="login"]',
      "id"
    ).replace("signform_", "");
    return { formhash, signtoken, signhash };
  }

  /**
   * 從驗證結果文字中提取計算運算式並計算結果。
   *
   * @param {string} resultText 驗證結果文字
   * @param {string} contentType 內容類型
   * @returns {number} 計算的結果
   */
  function extractValidationText(resultText, contentType) {
    const text = resultText
      .replace("sectplcode[2] + '", "前")
      .replace("' + sectplcode[3]", "後");
    const matchedText = text.match(/前([\w\W]+)後/)[1];
    return computeExpression(matchedText.replace("= ?", ""));
  }

  /**
   * 計算給定的數學運算式。
   *
   * @param {string} expr 數學運算式
   * @returns {number} 計算的結果
   */
  const computeExpression = (expr) => {
    const [left, operator, right] = expr.split(/([+\-*/])/);
    const a = parseFloat(left.trim());
    const b = parseFloat(right.trim());
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return a / b;
      default:
        throw new Error("Unsupported operator");
    }
  };

  /**
   * 根據簽到回應內容更新簽到按鈕的狀態，並設定最後簽到日期。
   *
   * @param {string} responseText 簽到回應內容
   * @param {string} userid 使用者ID
   * @returns {boolean} 簽到成功返回 true，否則返回 false
   */
  function updateSignButton(responseText, userid) {
    const settings = getSettings();
    const today = new Date().toLocaleDateString();
    if (
      responseText.includes("已经签到过") ||
      responseText.includes("重複簽到")
    ) {
      if (settings.qiandaoTip) {
        showTooltip("已經簽到過啦，請明天再來！");
      }
      GM_setValue(`lastSignDate_${userid}`, today);
      return true;
    } else if (responseText.includes("签到成功")) {
      if (settings.qiandaoTip) {
        showTooltip("簽到成功，金錢+2，明天記得來哦。");
      }
      GM_setValue(`lastSignDate_${userid}`, today);
      return true;
    } else if (responseText.includes("请至少发表或回复一个帖子后再来签到")) {
      if (settings.qiandaoTip) {
        if (settings.qiandaoTip) {
          showTooltip("請至少發表或回覆一個帖子後再來簽到!");
        }
      }
      return false;
    } else {
      if (settings.qiandaoTip) {
        showTooltip("抱歉，簽到出現了未知錯誤！");
      }
      return false;
    }
  }

  // #endregion

  // #region 收藏帖子操作

  /**
   * 收藏目前查看的帖子。
   * 透過建構特定URL實現收藏功能，同時給使用者提供收藏成功或失敗的提示。
   * @async
   * @function
   */
  async function star() {
    // 從目前頁面URL中獲取帖子的tid
    const tid = extractTid(window.location.href);
    // 獲取formhash，用於驗證請求
    const formHash = document.querySelector('input[name="formhash"]').value;

    // 建構收藏URL
    const starUrl = `/home.php?mod=spacecp&ac=favorite&type=thread&id=${tid}&formhash=${formHash}&infloat=yes&handlekey=k_favorite&inajax=1&ajaxtarget=fwin_content_k_favorite`;

    // 發送收藏請求
    const text = await fetch(starUrl).then((r) => r.text());

    // 根據回應內容提供相應的提示
    if (text.includes("抱歉，您已收藏，请勿重复收藏")) {
      return showTooltip("抱歉，您已收藏，請勿重複收藏");
    }

    if (text.includes("信息收藏成功")) {
      return showTooltip("資訊收藏成功");
    }

    // 如果既沒有成功訊息也沒有重複收藏訊息，視為出錯並在控制台記錄
    showTooltip("資訊收藏出現問題！！！");
    console.error(text);
  }

  // #endregion

  // #region 帖子評分

  /**
   * 獲取指定帖子的評分資訊。
   * @param {number} pid - 帖子ID。
   * @param {number} tid - 主題ID。
   * @param {number} timestamp - 目前時間戳。
   * @returns {Object} 評分資訊。
   * @async
   */
  async function getRateInfo(pid, tid, timestamp) {
    const infoDefaults = {
      state: false,
      max: 0,
      left: 0,
      formHash: "",
      referer: "",
      handleKey: "",
      error: "",
    };

    try {
      // 建構評分資訊請求的URL
      const url = `/forum.php?mod=misc&action=rate&tid=${tid}&pid=${pid}&infloat=yes&handlekey=rate&t=${timestamp}&inajax=1&ajaxtarget=fwin_content_rate`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch rate info");

      // 解析伺服器返回的XML資料
      const text = await response.text();
      const xml = new DOMParser().parseFromString(text, "text/xml");
      const htmlContent = xml.querySelector("root").textContent;
      const doc = new DOMParser().parseFromString(htmlContent, "text/html");

      // 檢查是否存在錯誤
      if (htmlContent.includes("alert_error")) {
        const alertErrorElement = doc.querySelector(".alert_error");
        const scriptElements = alertErrorElement.querySelectorAll("script");
        scriptElements.forEach((script) => script.remove());

        const errorMessage = alertErrorElement.textContent.trim();
        return { ...infoDefaults, error: errorMessage };
      }

      // 提取評分資訊
      const maxElement = doc.querySelector("#scoreoption8 li");
      if (!maxElement) {
        return { ...infoDefaults, error: "評分不足啦!" };
      }

      const max = parseInt(maxElement.textContent.replace("+", ""), 10);
      const left = parseInt(
        doc.querySelector(".dt.mbm td:last-child").textContent,
        10
      );
      const formHash = doc.querySelector('input[name="formhash"]').value;
      const referer = doc.querySelector('input[name="referer"]').value;
      const handleKey = doc.querySelector('input[name="handlekey"]').value;

      return {
        state: true,
        max: Math.min(max, left),
        left,
        formHash,
        referer,
        handleKey,
        error: "",
      };
    } catch (error) {
      showTooltip(error);
      return infoDefaults;
    }
  }

  /**
   * 對指定的帖子進行評分。
   * @param {number} pid - 帖子ID。
   * @async
   */
  async function grade(pid) {
    const tid = extractTid(window.location.href);
    const timestamp = new Date().getTime();
    const rateInfo = await getRateInfo(pid, tid, timestamp);
    if (!rateInfo.state) {
      showTooltip(rateInfo.error);
      return;
    }
    var settings = getSettings();
    var maxGradeThread = settings.maxGradeThread;
    rateInfo.max =
      parseInt(rateInfo.max) < parseInt(maxGradeThread)
        ? rateInfo.max
        : maxGradeThread;
    // 建構評分請求的URL和資料
    const rateUrl =
      "/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1";
    const data = new URLSearchParams();
    data.append("formhash", rateInfo.formHash);
    data.append("tid", tid);
    data.append("pid", pid);
    data.append("referer", rateInfo.referer);
    data.append("handlekey", rateInfo.handleKey);
    data.append("score8", `+${rateInfo.max}`);
    data.append("reason", "很給力！");
    data.append("sendreasonpm", "on");

    // 發送評分請求
    const request = new Request(rateUrl, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });

    try {
      const responseText = await fetch(request).then((r) => r.text());

      // 根據回應內容提供評分成功或失敗的提示
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

  // #endregion

  // #region 獲取購買記錄

  /**
   * 獲取指定帖子的購買記錄。
   * @param {number} tid - 主題ID。
   * @returns {Object} 購買記錄
   * @async
   */
  async function getViewpayments(tid) {
    const infoDefaults = {
      state: false,
      dataRowCount: 0,
      error: "",
    };

    try {
      // 建構評分資訊請求的URL
      const url = `/forum.php?mod=misc&action=viewpayments&tid=${tid}&infloat=yes&handlekey=pay&inajax=1&ajaxtarget=fwin_content_pay`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch Viewpayments info");
      // 解析伺服器返回的XML資料
      const text = await response.text();
      const xml = new DOMParser().parseFromString(text, "text/xml");
      const htmlContent = xml.querySelector("root").textContent;
      const doc = new DOMParser().parseFromString(htmlContent, "text/html");

      // 檢查是否存在錯誤
      if (htmlContent.includes("alert_error")) {
        const alertErrorElement = doc.querySelector(".alert_error");
        const scriptElements = alertErrorElement.querySelectorAll("script");
        scriptElements.forEach((script) => script.remove());

        const errorMessage = alertErrorElement.textContent.trim();
        return { ...infoDefaults, error: errorMessage };
      }
      if (htmlContent.includes("目前没有用户购买此主题")) {
        return {
          state: true,
          dataRowCount: 0,
          error: "",
        };
      }

      // 提取購買資訊
      var table = doc.querySelector("table.list"); // 選取class為list的table

      if (!table) {
        return {
          state: true,
          dataRowCount: 0,
          error: "",
        };
      }
      var rows = table.querySelectorAll("tr"); // 選取所有的行<tr>
      var dataRowCount = rows.length - 1; // 減去表頭的一行
      return {
        state: true,
        dataRowCount: dataRowCount,
        error: "",
      };
    } catch (error) {
      showTooltip(error);
      return infoDefaults;
    }
  }

  // #endregion

  // #region 帖子置頂

  /**
   * 從指定的元素中提取fid值
   *
   * @returns {string|null} 返回fid值，如果找不到則返回null。
   */
  function getFidFromElement() {
    // 透過ID尋找頁面上的元素
    let element = document.querySelector("#newspecial");
    // 如果元素不存在，返回null
    if (!element) return null;

    // 獲取元素的onclick屬性值
    let hrefValue = element.getAttribute("onclick");

    // 如果onclick屬性不存在，返回null
    if (!hrefValue) return null;

    // 使用正規表示式比對fid的值
    let match = /fid=(\d+)/.exec(hrefValue);

    // 如果比對成功，返回fid的值，否則返回null
    return match ? match[1] : null;
  }

  // #endregion

  // #region 一鍵評分與收藏

  /**
   * 對首帖進行評分並收藏該帖子。
   * 1. 從頁面中選取首帖元素。
   * 2. 從該元素獲取帖子ID。
   * 3. 對帖子進行評分。
   * 4. 收藏該帖子。
   */
  function gradeAndStar() {
    // 獲取首帖元素
    let firstPobClElement = document.querySelector(".po.hin");
    // 從首帖元素中提取帖子ID
    let pid = getTableIdFromElement(firstPobClElement);

    // 對首帖進行評分
    grade(pid);
    // 收藏首帖
    star();
  }

  // #endregion

  // #region 使用者內容屏蔽

  /**
   * 根據設定屏蔽指定使用者的內容
   * @param {object} settings - 設定物件，包含被封鎖的使用者列表和顯示訊息選項
   */
  function blockContentByUsers(settings) {
    const { blockedUsers, displayBlockedTips } = settings;
    blockedUsers.forEach((userID) => {
      const actions = [
        //屏蔽帖子列表頁
        createBlockAction(
          `//table//tr[1]/td[2]//cite/a[text()="${userID}"]/ancestor::tbody[1]`,
          `<tr>
                        <td class='icn'>
                            <img src='static/image/common/folder_common.gif' />
                        </td>
                        <th class='common'>
                            <b>已屏蔽主題 <font color=grey></th>
                        <td class='by'>
                            <cite><font color=grey>${userID}</font></cite>
                        </td>
                        <td class='num'></td>
                        <td class='by'></td>
                    </tr>`
        ),
        //屏蔽搜尋列表頁

        createBlockAction(
          `//ul/li[p[3]/span[2]/a[text()='${userID}']]`,
          `
                        <li class="pbw" >
                        <p>
                        <span>
                        已屏蔽"${userID}"
                        </span>
                        </p>
                        </li>
                        `
        ),
      ];

      actions.forEach(applyBlockAction(displayBlockedTips));
    });
  }

  /**
   * 根據設定的關鍵字屏蔽帖子標題
   * @param {object} settings - 設定物件，包含被封鎖的使用者列表和顯示訊息選項
   */
  function blockContentByTitle(settings) {
    const { excludePostOptions, displayBlockedTips } = settings;
    excludePostOptions.forEach((keyword) => {
      const actions = [
        //屏蔽帖子列表頁
        createBlockAction(
          `//table/tbody/tr/th/a[2][contains(text(),'${keyword}')]/ancestor::tbody[1]`,
          `<tr>
                        <td class='icn'>
                            <img src='static/image/common/folder_common.gif' />
                        </td>
                        <th class='common'>
                            <b>已屏蔽主題關鍵詞:${keyword} <font color=grey></th>
                        <td class='by'>
                            <cite><font color=grey></font></cite>
                        </td>
                        <td class='num'></td>
                        <td class='by'></td>
                    </tr>`
        ),
      ];

      actions.forEach(applyBlockAction(displayBlockedTips));
    });
  }

  /**
   * 建立一個屏蔽動作
   * @param {string} xpath - XPath查詢字串，用於尋找要屏蔽的元素
   * @param {string} message - 要顯示的訊息，當內容被屏蔽時
   * @return {object} - 包含XPath查詢和訊息的物件
   */
  function createBlockAction(xpath, message) {
    return { xpath, message };
  }

  /**
   * 應用屏蔽動作
   * @param {boolean} displayBlockedTips - 是否顯示屏蔽訊息
   * @return {function} - 一個函數，該函數接受一個屏蔽動作並應用它
   */
  function applyBlockAction(displayBlockedTips) {
    return function (action) {
      const elements = document.evaluate(
        action.xpath,
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      for (let i = 0; i < elements.snapshotLength; i++) {
        if (displayBlockedTips) {
          elements.snapshotItem(i).innerHTML = action.message;
        } else {
          elements.snapshotItem(i).style.display = "none";
        }
      }
    };
  }

  // #endregion

  // #region 無縫翻頁

  /**
   * 初始化無限捲動功能
   * 根據使用者的捲動行為來載入下一頁的內容。
   *
   * @param {string} pageName 頁面名稱，用於確定要載入哪種內容
   */
  function initInfiniteScroll(pageName) {
    let isLoading = false;
    let noMoreData = false;
    const settings = getSettings();

    // 根據傳入的頁面名稱決定內容選擇器
    let contentSelector;
    switch (pageName) {
      case "isSearchPage":
      case "isForumDisplayPage":
        contentSelector = "#threadlist";
        break;
      case "isPostPage":
        contentSelector = "#postlist";
        break;
      case "isSpacePage":
        contentSelector = "#delform";
        break;
      case "isMySpacePage":
        contentSelector = "#threadlist";
        break;
      case "isShowdarkroomPage":
        contentSelector = "#darkroomtable";
        break;
      case "isMyfavoritePage":
        contentSelector = "#favorite_ul";
        break;
      default:
        contentSelector = "#threadlist"; // 預設選擇器
    }

    if (!settings.autoPagination) {
      return;
    }

    /**
     * 載入下一個頁面的內容。
     * 獲取目前頁面中的「下一頁」連結，然後抓取該連結的內容，
     * 並將新內容新增到目前頁面。
     */
    async function loadNextPage() {
      const nextPageLink = document.querySelector(".nxt");
      if (!nextPageLink || noMoreData) {
        if (!noMoreData) {
          showTooltip("已經是全部資料了");
          noMoreData = true;
        }
        return;
      }

      isLoading = true;
      const url = nextPageLink.getAttribute("href");

      const response = await fetch(url);
      const text = await response.text();

      const div = document.createElement("div");
      div.innerHTML = text;

      const newNextPageLink = div.querySelector(".nxt");
      newNextPageLink
        ? nextPageLink.setAttribute(
            "href",
            newNextPageLink.getAttribute("href")
          )
        : (noMoreData = true);

      appendNewContent(div.querySelector(contentSelector));

      updatePagination(div.querySelector(".pg"));

      const newSettings = getSettings();
      await processPageContentBasedOnSettings(pageName, newSettings);
      blockContentByUsers(settings);
      isLoading = false;
      checkAndLoadIfContentNotEnough();
    }

    /**
     * 將新頁面中的內容新增到目前頁面。
     * @param {Element} newContent 新的內容元素
     */
    function appendNewContent(newContent) {
      const currentContent = document.querySelector(contentSelector);
      newContent.childNodes.forEach((child) =>
        currentContent.appendChild(child.cloneNode(true))
      );
    }

    /**
     * 更新頁面上的分頁元素（頁碼）為新頁面中的分頁元素。
     * @param {Element} newPgElement 新的分頁元素
     */
    function updatePagination(newPgElement) {
      const currentPageElements = document.querySelectorAll(".pg");
      currentPageElements.forEach(
        (pg) => (pg.innerHTML = newPgElement.innerHTML)
      );
    }

    /**
     * 根據頁面名稱和設定處理頁面內容。
     * @param {string} pageName 頁面名稱
     * @param {Object} settings 使用者設定
     */
    async function processPageContentBasedOnSettings(pageName, settings) {
      if (pageName == "isSearchPage") {
        filterElementsBasedOnSettings(settings);
      } else if (pageName == "isForumDisplayPage") {
        displayHeatLevel();
        removeAD2();
        const currentURL = window.location.href;
        const queryParams = getQueryParams(currentURL);
        const fid = queryParams.fid;
        if (fid == 143 || fid == "143") {
          blockingResolvedAction(settings);
          isOnlyShowMoneyAction(settings);
        }
        if (fid == 166 || fid == "166" || fid == 97 || fid == "97" || fid == 146 || fid == "146") {
          await displayThreadBuyInfo(settings);
        }
        blockContentByTitle(settings);
      } else if (pageName == "isPostPage") {
        appendTitleFromHotImage();
        appendBuyNumber();
        removeAD3();
      } else if (pageName == "isMySpacePage" || pageName == "isSpacePage") {
        displayThreadBuyInfoOther(settings);
      }
    }

    /**
     * 檢查頁面內容是否已經填滿視窗，如果沒有，則載入下一頁內容。
     */
    function checkAndLoadIfContentNotEnough() {
      if (document.body.offsetHeight <= window.innerHeight && !isLoading) {
        loadNextPage();
      }
    }

    window.addEventListener("scroll", () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !isLoading
      ) {
        loadNextPage();
      }
    });

    checkAndLoadIfContentNotEnough();
  }

  /**
   * 根據提供的設定過濾頁面上的元素
   * @param {Object} settings 使用者設定
   */
  function filterElementsBasedOnSettings(settings) {
    const pbwElements = document.querySelectorAll(".pbw");

    pbwElements.forEach((pbw) => {
      let shouldDisplay = shouldElementBeDisplayed(pbw, settings);
      pbw.style.display = shouldDisplay ? "block" : "none";
    });
  }

  /**
   * 確定給定的元素是否應該根據提供的設定顯示在頁面上
   * @param {Element} element 待檢查的元素
   * @param {Object} settings 使用者設定
   * @returns {boolean} 根據設定是否應顯示元素
   */
  function shouldElementBeDisplayed(element, settings) {
    if (settings.TIDGroup && settings.TIDGroup.length) {
      const aElement = element.querySelector(".xi1");
      if (!aElement || !doesTIDGroupMatch(aElement, settings.TIDGroup)) {
        return false;
      }
    }

    if (settings.excludeGroup && settings.excludeGroup.length) {
      const pElement = element.querySelector("p:nth-of-type(2)");
      const xs3Element = element.querySelector(".xs3");

      if (
        isExcludedByKeyword(pElement, settings.excludeGroup) ||
        isExcludedByKeyword(xs3Element, settings.excludeGroup)
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * 檢查給定的元素連結是否與提供的TIDGroup中的任何ID比對
   * @param {Element} aElement 待檢查的連結元素
   * @param {Array} TIDGroup TID組
   * @returns {boolean} 是否與TID組比對
   */
  function doesTIDGroupMatch(aElement, TIDGroup) {
    const href = aElement.getAttribute("href");

    // 判斷是否比對 fid=${tid} 或 forum=${tid} 的格式
    return TIDGroup.some(
      (tid) => href.includes(`fid=${tid}`) || href.includes(`forum-${tid}`)
    );
  }

  /**
   * 檢查給定的元素內容是否包含提供的排除關鍵字列表中的任何關鍵字
   * @param {Element} element 待檢查的元素
   * @param {Array} excludeGroup 排除關鍵字組
   * @returns {boolean} 是否包含關鍵字
   */
  function isExcludedByKeyword(element, excludeGroup) {
    if (!element) return false;
    const text = element.textContent.toLowerCase();
    return excludeGroup.some((keyword) => text.includes(keyword.toLowerCase()));
  }

  // #endregion

  // #region 帖子列表頁執行的方法

  /**
   * 新增日期範圍選擇器和「開啟」按鈕到頁面
   * @param {HTMLElement|string} targetElementOrId - 參考元素或其ID (將在此元素之後插入日期選擇器和按鈕)
   */
  function addDateRangeSelectorAndButton(targetElementOrId) {
    const refElement =
      typeof targetElementOrId === "string"
        ? document.getElementById(targetElementOrId)
        : targetElementOrId;

    if (!refElement) return;

    // 建立日期選擇框
    const startDateInput = createDateInput("startDateSelector");
    const endDateInput = createDateInput("endDateSelector");

    // 建立並綁定點擊事件到「開啟」按鈕
    const openButton = createButton(
      "openAllUrlButton",
      "批量開啟帖子",
      () => filterAndOpenThreadsByDate(),
      "bgsh-openAllUrlBtn",
      "#f6211c"
    );

    // 插入元素到頁面中
    refElement.after(openButton);
    refElement.after(endDateInput);
    refElement.after(document.createTextNode("到"));
    refElement.after(startDateInput);
  }

  /**
   * 過濾並在新視窗中開啟選定日期範圍內的帖子連結。
   */
  function filterAndOpenThreadsByDate() {
    // 獲取使用者指定的開始和結束日期
    const startDateValue = document.getElementById("startDateSelector").value;
    const endDateValue = document.getElementById("endDateSelector").value;

    // 轉換日期字串為 Date 物件
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    // 選取頁面上的所有帖子
    const posts = document.querySelectorAll("#threadlisttableid tbody tr");

    posts.forEach((post) => {
      const spanSpanElement = post.querySelector("td.by em span span");
      const spanElement = post.querySelector("td.by em span");

      let postDateStr = "";
      if (spanSpanElement) {
        // 如果存在td.by em span span，則獲取其title屬性作為日期字串
        postDateStr = spanSpanElement.getAttribute("title");
      } else if (spanElement) {
        // 否則，如果存在td.by em span，則獲取其文字內容作為日期字串
        postDateStr = spanElement.textContent;
      }

      if (postDateStr) {
        const postDate = new Date(postDateStr);

        // 檢查帖子的日期是否在使用者指定的日期範圍內
        if (postDate >= startDate && postDate <= endDate) {
          // 嘗試從帖子中獲取連結元素
          const linkElement = post.querySelector(".s.xst");
          if (linkElement) {
            // 在新視窗中開啟帖子連結
            window.open(linkElement.href, "_blank");
          }
        }
      } else {
        console.warn("未找到日期資訊");
      }
    });
  }

  /**
   * 建立時間排序按鈕
   * @param {Object} settings - 使用者的設定
   * @param {Element} buttonContainer - 按鈕容器元素
   */
  function createTimeSortButton(settings, buttonContainer) {
    const currentURL = window.location.href;
    const queryParams = getQueryParams(currentURL);
    const fid = queryParams.fid;
    const hasOrderBy = queryParams.orderby === "dateline";
    const isFidInOrder = settings.orderFids.includes(fid);

    const setText = (isOrder) => {
      return isOrder ? "目前列表\n時間排序" : "目前列表\n預設排序";
    };

    const initialButtonText = setText(isFidInOrder);

    const timeSortButton = createButton(
      "timeSortButton",
      initialButtonText,
      function () {
        if (isFidInOrder) {
          timeSortButton.innerText = setText(false);
          if (hasOrderBy) {
            const newURL = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}`;
            window.location.href = newURL;
          }
          settings.orderFids = settings.orderFids.filter(
            (existingFid) => existingFid !== fid
          );
        } else {
          timeSortButton.innerText = setText(true);
          if (!hasOrderBy) {
            const newURL = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}&filter=author&orderby=dateline`;
            window.location.href = newURL;
          }
          settings.orderFids.push(fid);
        }
        GM_setValue("orderFids", JSON.stringify(settings.orderFids));
      }
    );

    buttonContainer.appendChild(timeSortButton);
  }

  /**
   * 處理帖子列表頁面的初始狀態，可能會重定向
   * @param {Object} settings - 使用者的設定
   */
  function handleInitialPageState(settings) {
    const currentURL = window.location.href;
    const queryParams = getQueryParams(currentURL);
    const fid = queryParams.fid;
    const hasOrderBy = queryParams.orderby === "dateline";

    // 檢查目前fid是否存在於orderFids中
    const isFidInOrder = settings.orderFids.includes(fid);

    if (isFidInOrder && !hasOrderBy) {
      // 如果上次是時間排序，但現在URL沒有orderby=dateline，則需要重定向
      const newURL = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}&filter=author&orderby=dateline`;
      window.location.href = newURL;
    } else if (!isFidInOrder && hasOrderBy) {
      // 如果上次是預設排序，但現在URL有orderby=dateline，則需要重定向
      const newURL = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}`;
      window.location.href = newURL;
    }
  }

  /**
   * 插入購買記錄到帖子標題下方
   */

  async function displayThreadBuyInfo(settings) {
    if (!settings.displayThreadBuyInfo) {
      return;
    }
    var links = document.querySelectorAll("a.s.xst"); // 選取所有class為"s xst"的<a>元素
    links.forEach(async function (link) {
      var href = link.href;
      var tid = extractTid(href); // 從URL中獲取tid參數

      if (tid) {
        var buyInfo = await getViewpayments(tid); // 用於獲取購買資訊
        if (buyInfo.state) {
          var dataRowCount = buyInfo.dataRowCount;
          if (link) {
            const existingSpan = link.parentNode.querySelector(
              "#baoguobuyinfouniqueSpanId"
            );

            // 如果不存在這樣的 span 元素，則建立並插入一個新的
            if (!existingSpan) {
              const span = document.createElement("span");
              span.id = "baoguobuyinfouniqueSpanId"; // 設定 span 的 ID
              span.style.cssText =
                "font-size: larger; font-weight: bold; color: red;"; // 設定樣式
              span.textContent = ` [購買${dataRowCount}次]`;

              // 將 <span> 插入到 <a> 後面
              link.parentNode.insertBefore(span, link.nextSibling);
            }
          }
        }
      }
    });
  }
  /**
   * 其他頁面插入購買記錄到帖子標題下方
   */

  async function displayThreadBuyInfoOther(settings) {
    if (!settings.displayThreadBuyInfo) {
      return;
    }

    // 獲取所有<th>標籤
    var thElements = document.querySelectorAll("th");

    thElements.forEach(async (th) => {
      // 在目前<th>標籤中尋找第一個<a>元素
      var aElement = th.querySelector("a");

      // 如果存在<a>元素
      if (aElement) {
        // 獲取目前<th>標籤的下一個兄弟元素，應為<td>
        var nextTd = th.nextElementSibling;

        // 確保這個兄弟元素是<td>並且包含<a>元素
        if (nextTd && nextTd.tagName === "TD") {
          var tdLink = nextTd.querySelector("a");

          // 如果<td>中有<a>元素
          if (tdLink) {
            // 檢查這個<a>的href屬性是否包含特定的fid
            if (
              /fid=166|fid=97|fid=146|forum-166|forum-97|forum-146/.test(
                tdLink.href
              )
            ) {
              var href = aElement.href;
              var tid = extractTid(href); // 從URL中獲取tid參數

              if (tid) {
                var buyInfo = await getViewpayments(tid); // 用於獲取購買資訊
                if (buyInfo.state) {
                  var dataRowCount = buyInfo.dataRowCount;

                  const existingSpan = aElement.parentNode.querySelector(
                    "#baoguobuyinfouniqueSpanId"
                  );

                  if (!existingSpan) {
                    const span = document.createElement("span");
                    span.id = "baoguobuyinfouniqueSpanId"; // 設定 span 的 ID
                    span.style.cssText =
                      "font-size: larger; font-weight: bold; color: red;"; // 設定樣式
                    span.textContent = ` [購買${dataRowCount}次]`;

                    // 將 <span> 插入到 <a> 後面
                    aElement.parentNode.insertBefore(
                      span,
                      aElement.nextSibling
                    );
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * 處理帖子列表頁面，設定頁面狀態、樣式、內容屏蔽、時間排序和無限捲動
   * @param {Object} settings - 使用者的設定
   * @param {Element} buttonContainer - 按鈕容器元素
   */
  async function handleForumDisplayPage(settings, buttonContainer) {
    handleInitialPageState(settings);
    displayHeatLevel();
    removeAD2();
    removeFastPost();
    createTimeSortButton(settings, buttonContainer);
    blockContentByTitle(settings);
    const currentURL = window.location.href;
    const queryParams = getQueryParams(currentURL);
    const fid = queryParams.fid;
    if (fid == 143 || fid == "143") {
      blockingResolvedAction(settings);
      isOnlyShowMoneyAction(settings);
      const blockingResolvedText =
        settings.blockingResolved == true ? "顯示解決" : "屏蔽解決";
      const blockingResolvedButton = createButton(
        "blockingResolvedBtn",
        blockingResolvedText,
        function () {
          if (blockingResolvedButton.innerText === "顯示解決") {
            blockingResolvedButton.innerText = "屏蔽解決";
            GM_setValue("blockingResolved", false);
            location.reload();
          } else {
            blockingResolvedButton.innerText = "顯示解決";
            GM_setValue("blockingResolved", true);
            location.reload();
          }
        }
      );
      buttonContainer.appendChild(blockingResolvedButton);

      const isOnlyShowMoneyText =
        settings.isOnlyShowMoney == true ? "顯示全部" : "只看現金";
      const isOnlyShowMoneyButton = createButton(
        "isOnlyShowMoneyBtn",
        isOnlyShowMoneyText,
        function () {
          if (isOnlyShowMoneyButton.innerText === "顯示全部") {
            isOnlyShowMoneyButton.innerText = "只看現金";
            GM_setValue("isOnlyShowMoney", false);
            location.reload();
          } else {
            isOnlyShowMoneyButton.innerText = "顯示全部";
            GM_setValue("isOnlyShowMoney", true);
            location.reload();
          }
        }
      );
      buttonContainer.appendChild(isOnlyShowMoneyButton);
    }
    if (
      fid == 166 ||
      fid == "166" ||
      fid == 97 ||
      fid == "97" ||
      fid == 146 ||
      fid == "146"
    ) {
      await displayThreadBuyInfo(settings);
    }

    const targetElement = document.querySelector(".xs1.xw0.i");
    addDateRangeSelectorAndButton(targetElement);
    initInfiniteScroll("isForumDisplayPage");
  }

  /**
   * 移除帖子列表頁廣告
   */
  async function removeAD2() {
    document.querySelectorAll(".show-text2").forEach((element) => {
      element.remove();
    });
  }

  /**
   * 移除列表底部的快速發帖
   */
  function removeFastPost() {
    document.querySelectorAll("#f_pst").forEach((element) => {
      element.remove();
    });
  }

  /**
   * 移除帖子列表頁已解決的帖子
   */
  async function blockingResolvedAction(settings) {
    if (settings.blockingResolved) {
      // 獲取頁面上所有的 tbody 元素
      const tbodies = document.querySelectorAll("tbody");

      // 遍歷每個 tbody 元素
      tbodies.forEach((tbody) => {
        // 檢查 tbody 的文字內容是否包含指定的字串
        if (tbody.textContent.includes("[已解決]")) {
          // 如果包含，移除這個 tbody 元素
          tbody.remove();
        }
      });
    }
  }

  /**
   * 帖子列表頁只顯示E卡
   */
  async function isOnlyShowMoneyAction(settings) {
    if (!settings.isOnlyShowMoney) {
      return; // 如果設定不啟用，直接返回
    }

    const tbodies = document.querySelectorAll("tbody");
    const keywords = ["E卡", "e卡", "話費"]; // 關鍵詞列表
    const excludedSelectors = ["#scbar_txt", "#scbar_btn", "#scbar_type"]; // 不應被移除的元素選擇器

    tbodies.forEach((tbody) => {
      // 檢查tbody是否包含排除的選擇器中的任何一個元素
      const isExcluded = excludedSelectors.some((selector) =>
        tbody.querySelector(selector)
      );
      if (isExcluded) {
        return; // 如果包含排除元素，則不移除此tbody
      }

      // 檢查是否包含任何關鍵詞
      const containsKeyword = keywords.some((keyword) =>
        tbody.textContent.includes(keyword)
      );
      if (!containsKeyword) {
        tbody.remove(); // 如果不包含關鍵詞且沒有排除標識，則移除
      }
    });
  }

  // #endregion

  // #region 搜尋頁執行的方法

  /**
   * 處理搜尋頁面，包括新增進階搜尋、新增頁碼、基於設定過濾元素和初始化無限捲動
   * @param {Object} settings - 使用者的設定
   */
  function handleSearchPage(settings) {
    replaceImageSrc();
    addAdvancedSearch(settings);
    addPageNumbers();
    filterElementsBasedOnSettings(settings);
    initInfiniteScroll("isSearchPage");
  }

  // #endregion

  // #region 帖子內容頁執行方法

  /**
   * 建立「複製內容」按鈕，用於快速複製本帖內容
   * @return {HTMLElement} 按鈕元素
   */
  function createFastCopyButton() {
    return createButton("fastCopyButton", "複製帖子", function () {
      var content = document.querySelector(".t_f");
      var secondContent = document.querySelectorAll(".t_f")[1];
      var resultHtml = "";
      if (content) {
        resultHtml += processContent(content);
      }
      if (secondContent && secondContent.querySelectorAll("img").length > 3) {
        resultHtml += processContent(secondContent);
      }
      if (resultHtml !== "") {
        copyToClipboard(resultHtml);
        copyToClipboard(
          resultHtml,
          () => showTooltip("內容已複製!"),
          (err) => showTooltip("複製失敗: ", err)
        );
      } else {
        showTooltip("複製失敗: 沒有找到相應內容");
      }
    });
  }

  /**
   * 處理指定的內容
   * @param {string} content html文字
   * @return {cleanedHtml} 處理好的內容
   */

  function processContent(content) {
    var html = content.innerHTML;
    var cleanedHtml = removeElementsByClass(
      html,
      ["pstatus", "tip_4"],
      [
        "font",
        "div",
        "ignore_js_op",
        "br",
        "ol",
        "li",
        "strong",
        "a",
        "i",
        "table",
        "tbody",
        "tr",
        "td",
        "blockquote",
      ],
      ["em"]
    );
    cleanedHtml = removeNbspAndNewlines(cleanedHtml);
    cleanedHtml = removeElementsByIdPrefix(cleanedHtml, "attach_");

    return cleanedHtml;
  }

  /**
   * 移除不需要的內容
   * @param {string} htmlString html文字
   * @return {stringWithoutNbsp} 連結
   */

  function removeNbspAndNewlines(htmlString) {
    var stringWithoutNbsp = htmlString.replace(/&nbsp;/g, "");
    stringWithoutNbsp = stringWithoutNbsp.replace(/&amp;/g, "");
    stringWithoutNbsp = stringWithoutNbsp.replace(/\n+/g, "\n");
    stringWithoutNbsp = stringWithoutNbsp.replace(/\\baoguo/g, "\n");
    return stringWithoutNbsp;
  }

  /**
   * 處理指定的內容
   * @param {string} htmlString html文字
   * @param {string} classList class列表
   * @param {string} tagsToRemove tags
   * @param {string} tagsToAllRemove tags
   * @return {doc.body.innerHTML} 處理好的內容
   */

  function removeElementsByClass(
    htmlString,
    classList,
    tagsToRemove,
    tagsToAllRemove
  ) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, "text/html");
    classList.forEach(function (className) {
      var elements = doc.querySelectorAll("." + className);
      elements.forEach(function (element) {
        element.parentNode.removeChild(element);
      });
    });
    tagsToRemove.forEach(function (tagName) {
      var elements = doc.querySelectorAll(tagName);
      elements.forEach(function (element) {
        while (element.firstChild) {
          element.parentNode.insertBefore(element.firstChild, element);
        }
        element.parentNode.removeChild(element);
      });
    });
    tagsToAllRemove.forEach(function (tagName) {
      var elements = doc.querySelectorAll(tagName);

      elements.forEach(function (element) {
        element.parentNode.removeChild(element);
      });
    });
    var imgElements = doc.querySelectorAll("img");
    imgElements.forEach(function (img) {
      var fileAttr = img.getAttribute("file");
      if (fileAttr) {
        var fileText =
          (fileAttr.includes("static/image") ? "" : fileAttr) + "\\baoguo";
        var textNode = document.createTextNode(fileText);
        img.parentNode.replaceChild(textNode, img);
      } else {
        var srcAttr = img.getAttribute("src");
        if (srcAttr) {
          var srcText =
            (srcAttr.includes("static/image") ? "" : srcAttr) + "\\baoguo";
          var textNode1 = document.createTextNode(srcText);
          img.parentNode.replaceChild(textNode1, img);
        }
      }
    });
    return doc.body.innerHTML;
  }

  /**
   * 移除包含指定的內容的元素
   * @param {string} htmlString html文字
   * @param {string} idPrefix 指定內容
   * @return {doc.body.innerHTML} 處理好的內容
   */
  function removeElementsByIdPrefix(html, idPrefix) {
    // 使用 DOMParser 解析 HTML 字串
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // 選取所有 id 屬性包含特定前綴的元素
    const elements = doc.querySelectorAll(`[id^="${idPrefix}"]`);

    // 移除這些元素
    elements.forEach((element) => {
      element.remove();
    });

    // 將處理後的 DOM 轉回為 HTML 字串
    return doc.body.innerHTML;
  }

  /**
   * 建立「快速回覆」按鈕，用於快速回覆本帖內容
   * @return {HTMLElement} 按鈕元素
   */
  function createFastReplyButton() {
    return createButton("fastReplyButton", "快速回覆", function () {
      let fid = getFidFromElement();
      const tid = extractTid(window.location.href);
      showWindow(
        "reply",
        `forum.php?mod=post&action=reply&fid=${fid}&tid=${tid}`
      );
    });
  }

  /**
   * 建立「查看評分」按鈕，用於快速查看本帖評分
   * @return {HTMLElement} 按鈕元素
   */
  function createViewRatingsButton(pid) {
    return createButton("viewRatingsButton", "查看評分", function () {
      const tid = extractTid(window.location.href);
      showWindow(
        "viewratings",
        `forum.php?mod=misc&action=viewratings&tid=${tid}&pid=${pid}`
      );
    });
  }

  /**
   * 建立「購買記錄」按鈕，用於快速查看本帖購買記錄
   * @return {HTMLElement} 按鈕元素
   */
  function createPayLogButton(pid) {
    return createButton("payLogButton", "購買記錄", function () {
      const tid = extractTid(window.location.href);
      showWindow(
        "pay",
        `forum.php?mod=misc&action=viewpayments&tid=${tid}&pid=${pid}`
      );
    });
  }

  /**
   * 建立「下載附件」按鈕，用於快速下載附件
   * @return {HTMLElement} 按鈕元素
   */
  function createDownButton() {
    return createButton("downButton", "下載附件", function () {
      // 檢查是否已存在模態框
      if (document.getElementById("customModal")) {
        return;
      }

      const spans = document.querySelectorAll('span[id*="attach_"]');
      const lockedDivs = Array.from(
        document.querySelectorAll("div.locked")
      ).filter((div) => div.textContent.includes("購買"));
      const dls = Array.from(document.querySelectorAll("dl.tattl")).filter(
        (dl) => dl.querySelector("p.attnm")
      );

      const elements = [...spans, ...dls, ...lockedDivs];

      if (elements.length === 0) {
        showTooltip("沒有找到任何附件。");
        return;
      }

      const result = elements.map((el) => el.outerHTML).join("<br>");

      // 建立模態框
      const modal = document.createElement("div");
      modal.id = "customModal";
      modal.style.position = "fixed";
      modal.style.left = "50%";
      modal.style.top = "50%";
      modal.style.transform = "translate(-50%, -50%)";
      modal.style.backgroundColor = "#FFF";
      modal.style.padding = "20px";
      modal.style.border = "1px solid #DDD";
      modal.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
      modal.style.borderRadius = "8px";
      modal.style.width = "80%";
      modal.style.maxWidth = "600px";
      modal.style.height = "auto";
      modal.style.maxHeight = "80vh";
      modal.style.overflowY = "auto";
      modal.style.zIndex = "100";

      // 新增內容和關閉按鈕
      modal.innerHTML = `<div style="margin-bottom: 20px;">${result}</div><button id="closeModal" style="padding: 5px 10px; background-color: #F44336; color: white; border: none; border-radius: 5px; cursor: pointer;">關閉</button>`;

      document.body.appendChild(modal);

      // 關閉按鈕事件
      document.getElementById("closeModal").addEventListener("click", () => {
        modal.remove();
      });
    });
  }

  /**
   * 建立「複製程式碼」按鈕，用於複製頁面內所有程式碼區塊的內容
   * @return {HTMLElement} 按鈕元素
   */
  function createCopyCodeButton() {
    return createButton("copyCodeButton", "複製程式碼", function () {
      let allBlockCodes = document.querySelectorAll(".blockcode");
      let allTexts = [];
      allBlockCodes.forEach((blockCode) => {
        let liElements = blockCode.querySelectorAll("li");
        liElements.forEach((li) => {
          allTexts.push(li.textContent);
        });
      });
      let combinedText = allTexts.join("\n");
      copyToClipboard(
        combinedText,
        () => showTooltip("程式碼已複製!"),
        (err) => showTooltip("複製失敗: ", err)
      );
    });
  }

  /**
   * 建立「快速評分」按鈕，用於頁面內對主帖的內容快速評分
   * @return {HTMLElement} 按鈕元素
   */
  function createQuickGradeButton(pid) {
    return createButton("quickGradeButton", "快速評分", () => grade(pid));
  }

  /**
   * 建立「快速收藏」按鈕，用於頁面內對回覆的內容快速收藏
   * @return {HTMLElement} 按鈕元素
   */
  function createQuickStarButton() {
    return createButton("quickStarButton", "快速收藏", star);
  }

  /**
   * 建立「一鍵二連」按鈕，用於頁面內對回覆的內容快速評分和收藏
   * @return {HTMLElement} 按鈕元素
   */
  function createOneClickDoubleButton() {
    return createButton("oneClickDoubleButton", "一鍵二連", gradeAndStar);
  }

  /**
   * 在帖子內容頁中新增和執行各種功能
   * @param {Object} settings - 使用者的設定
   * @param {HTMLElement} buttonContainer - 按鈕容器
   */
  function handlePostPage(settings, buttonContainer) {
    const toggleImages = (action) => {
      const images = document.querySelectorAll("img.zoom");
      images.forEach(
        (img) => (img.style.display = action === "hide" ? "none" : "")
      );
    };

    toggleImages(settings.showImageButton);

    const initialButtonText =
      settings.showImageButton === "show" ? "隱藏圖片" : "顯示圖片";

    const toggleButton = createButton(
      "toggleImageDisplay",
      initialButtonText,
      function () {
        if (toggleButton.innerText === "顯示圖片") {
          toggleImages("show");
          toggleButton.innerText = "隱藏圖片";
          GM_setValue("showImageButton", "show");
        } else {
          toggleImages("hide");
          toggleButton.innerText = "顯示圖片";
          GM_setValue("showImageButton", "hide");
        }
      }
    );
    buttonContainer.appendChild(toggleButton);
    if (settings.showDown) {
      buttonContainer.appendChild(createDownButton());
    }

    let codeBlocks = document.querySelectorAll(".blockcode");
    if (codeBlocks.length > 0 && settings.showCopyCode) {
      buttonContainer.appendChild(createCopyCodeButton());
    }
    let firstPobClElement = document.querySelector(".po.hin");
    let pid = getTableIdFromElement(firstPobClElement);

    const userid = getUserId();
    if (userid) {
      if (settings.showFastReply) {
        buttonContainer.appendChild(createFastReplyButton());
      }
      if (settings.showQuickGrade) {
        buttonContainer.appendChild(createQuickGradeButton(pid));
      }
      if (settings.showQuickStar) {
        buttonContainer.appendChild(createQuickStarButton());
      }
      if (settings.showClickDouble) {
        buttonContainer.appendChild(createOneClickDoubleButton());
      }
    }
    if (settings.showViewRatings) {
      buttonContainer.appendChild(createViewRatingsButton(pid));
    }
    if (settings.showPayLog) {
      buttonContainer.appendChild(createPayLogButton(pid));
    }
    if (settings.showFastCopy) {
      buttonContainer.appendChild(createFastCopyButton());
    }

    initInfiniteScroll("isPostPage");
    removeAD3();
    removeFastReply();
    appendTitleFromHotImage();
    appendBuyNumber();
  }

  /**
   * 移除帖子內容頁廣告
   */
  async function removeAD3() {
    document.querySelectorAll('[class*="show-text"]').forEach((element) => {
      element.remove();
    });
    document.querySelectorAll('[id*="mgc_post"]').forEach((element) => {
      element.remove();
    });
    document.querySelectorAll("#p_btn").forEach((element) => {
      element.remove();
    });
  }

  /**
   * 移除帖子底部的快速回帖
   */
  function removeFastReply() {
    document.querySelectorAll("#f_pst").forEach((element) => {
      element.remove();
    });
  }

  /**
   * 帖子內容頁顯示熱度
   */
  function appendTitleFromHotImage() {
    const regex = /static\/image\/common\/hot_\d+\.gif/;
    const images = Array.from(document.querySelectorAll("img")).filter((img) =>
      regex.test(img.src)
    );

    // 如果有多張圖片，遍歷所有符合條件的圖片
    images.forEach((image) => {
      const titleContent = image.title; // 提取圖片的title內容

      // 獲取頁面上所有'id="thread_subject"'的元素
      const threadSubjectSpans = document.querySelectorAll("#thread_subject");
      // 遍歷所有找到的span元素
      threadSubjectSpans.forEach((threadSubjectSpan) => {
        const uniqueId = `hotTitle-appendTitleFromHotImage`; // 產生基於圖片中數字的唯一ID

        if (!threadSubjectSpan.parentNode.querySelector(`#${uniqueId}`)) {
          const newSpan = document.createElement("span"); // 建立新的span元素
          newSpan.id = uniqueId; // 設定新span的ID
          newSpan.textContent = ` [${titleContent}]`; // 設定新span的內容
          newSpan.style.color = `red`;
          threadSubjectSpan.parentNode.insertBefore(
            newSpan,
            threadSubjectSpan.nextSibling
          ); // 在每個'thread_subject'後面插入新的span
        }
      });
    });
  }

  /**
   * 帖子內容頁顯示購買數量
   */
  async function appendBuyNumber() {
    const divPt = document.getElementById("pt"); // 獲取id為'pt'的div
    if (!divPt) {
      return; // 如果沒有找到這個div，直接返回
    }

    // 定義需要尋找的forum ID
    const forumTexts = [
      "fid=166",
      "fid=97",
      "forum-166",
      "forum-97",
      "fid=146",
      "forum-146",
    ];
    let found = false; // 用於標記是否找到比對的文字

    // 檢查div的文字內容中是否包含任一指定的forum ID
    const textContent = divPt.innerHTML; // 獲取div的全部文字內容
    forumTexts.forEach((text) => {
      if (textContent.includes(text)) {
        found = true;
      }
    });

    // 根據結果執行操作
    if (found) {
      var href = window.location.href; // 獲取目前頁面的URL
      var tid = extractTid(href); // 從URL中獲取tid參數
      if (tid) {
        var buyInfo = await getViewpayments(tid); // 用於獲取購買資訊
        if (buyInfo.state) {
          var dataRowCount = buyInfo.dataRowCount;

          // 獲取頁面上所有'id="thread_subject"'的元素
          const threadSubjectSpans =
            document.querySelectorAll("#thread_subject");
          // 遍歷所有找到的span元素
          threadSubjectSpans.forEach((threadSubjectSpan) => {
            const uniqueId = `buynum-appendBuyNumber`; // 產生基於圖片中數字的唯一ID

            if (!threadSubjectSpan.parentNode.querySelector(`#${uniqueId}`)) {
              const newSpan = document.createElement("span"); // 建立新的span元素
              newSpan.id = uniqueId; // 設定新span的ID
              newSpan.textContent = `  [購買${dataRowCount}次]`; // 設定新span的內容
              newSpan.style.color = `red`;
              threadSubjectSpan.parentNode.insertBefore(
                newSpan,
                threadSubjectSpan.nextSibling
              ); // 在每個'thread_subject'後面插入新的span
            }
          });
        }
      }
    }
  }

  // #endregion

  // #region 網站全域功能

  function setMenuButtonPosition(menuButton, container, settings) {
    // 新增按鈕到頁面以獲取其高度
    document.body.appendChild(menuButton);

    const containerRect = settings.menuButtonIsVisible
      ? container.getBoundingClientRect()
      : { top: window.innerHeight / 2 }; // Fallback if container is not visible

    // 設定按鈕的頂部位置為容器的頂部位置減去按鈕的高度再減去一些間隔
    menuButton.style.top = `${
      containerRect.top - menuButton.offsetHeight - 50
    }px`;
  }

  /**
   * 全站通用的入口方法。為整個站點執行基本操作和應用使用者設定。
   *
   * @param {Object} settings - 使用者的設定
   */
  async function baseFunction(settings) {
    removeAD();
    if (settings.blockingIndex) {
      removeIndex();
    }
    addStyles(); // 新增自訂樣式
    const buttonContainer = createButtonContainer();
    buttonContainer.style.display = settings.menuButtonIsVisible
      ? "flex"
      : "none";

    await delegatePageHandlers(settings, buttonContainer); // 根據URL選取頁面處理邏輯

    handleUserSign(buttonContainer); // 執行使用者簽到邏輯
    blockContentByUsers(settings); //屏蔽使用者

    document.body.appendChild(buttonContainer); // 將按鈕容器附加到頁面主體
    createBaoguoButton(buttonContainer);
    const menuButton = createMenuButton(settings);
    setMenuButtonPosition(menuButton, buttonContainer, settings); // 計算並設定按鈕位置
    // 切換容器顯示/隱藏
    toggleContainer(menuButton, buttonContainer);
  }

  /**
   * 檢查目前頁面的URL是否比對SpacePage的模式。
   * @returns {boolean} 如果比對則返回true，否則返回false。
   */
  async function delegatePageHandlers(settings, buttonContainer) {
    const isPostPage = () =>
      /forum\.php\?mod=viewthread|\/thread-\d+-\d+-\d+\.html/.test(
        window.location.href
      );
    const isSearchPage = () =>
      /search\.php\?mod=forum/.test(window.location.href);
    const isForumDisplayPage = () =>
      /forum\.php\?mod=forumdisplay|\/forum-\d+-\d+\.html/.test(
        window.location.href
      );
    const isSpacePage = () =>
      /home\.php\?mod=space(.*&&uid=\d+)?.*&do=thread&view=me(.*&from=space)?.*&(type=(reply|thread))?/.test(
        window.location.href
      );
    const isMySpacePage = () =>
      /(forum|home)\.php\?mod=(guide|space|misc)&(view=(hot|digest|new|newthread|sofa|my)|action=showdarkroom|do=favorite)(&type=(thread|reply|postcomment))?/.test(
        window.location.href
      );
    const isMyfavoritePage = () =>
      /home\.php\?mod=space&do=favorite&view=me/.test(window.location.href);

    if (isPostPage()) {
      handlePostPage(settings, buttonContainer);
    } else if (isSearchPage()) {
      handleSearchPage(settings);
    } else if (isForumDisplayPage()) {
      await handleForumDisplayPage(settings, buttonContainer);
    } else if (isSpacePage()) {
      displayThreadBuyInfoOther(settings);
      initInfiniteScroll("isSpacePage");
    } else if (isMySpacePage()) {
      displayThreadBuyInfoOther(settings);
      initInfiniteScroll("isMySpacePage");
    } else if (isMyfavoritePage()) {
      initInfiniteScroll("isMyfavoritePage");
    }
  }

  /**
   * 建立設定按鈕
   * @param {Element} buttonContainer - 按鈕容器元素
   */
  function createBaoguoButton(buttonContainer) {
    var baoguoButton = createButton("baoguoButton", "功能設定", () =>
      createSettingsUI(getSettings())
    );
    buttonContainer.appendChild(baoguoButton);
  }

  /**
   * 使用者簽到處理邏輯。檢查使用者是否已簽到並執行相應操作。
   *
   * @param {HTMLElement} buttonContainer - 存放按鈕的容器元素
   */
  async function handleUserSign(buttonContainer) {
    const userid = getUserId(); // 獲取使用者ID
    if (!userid) return; // 如果使用者未登入，結束函數

    // 檢查今天是否已經簽到
    const lastSignDate = GM_getValue(`lastSignDate_${userid}`, null);
    const today = new Date().toLocaleDateString();
    const hasSignedToday = lastSignDate === today;

    // 更新簽到按鈕文字
    const signButtonText = hasSignedToday ? "已經簽到" : "快去簽到";
    const signButton = createButton(
      "signButton",
      signButtonText,
      () => (window.location.href = `${baseURL}/plugin.php?id=dd_sign:index`)
    );

    // 嘗試自動簽到
    if (!hasSignedToday) {
      const signed = await sign(userid);
      signButton.innerText = signed ? "已經簽到" : "快去簽到";
    }

    // 新增簽到按鈕到容器
    buttonContainer.appendChild(signButton);
  }

  /**
   * 移除廣告
   */
  async function removeAD() {
    document.querySelectorAll(".show-text.cl").forEach((element) => {
      element.remove();
    });
    const mn_portalelement = document.querySelector("#mn_portal");
    if (mn_portalelement) {
      mn_portalelement.remove();
    }
    const mn_Na5acelement = document.querySelector("#mn_Na5ac");
    if (mn_Na5acelement) {
      mn_Na5acelement.remove();
    }
    const mn_Neaf3element = document.querySelector("#mn_Neaf3");
    if (mn_Neaf3element) {
      mn_Neaf3element.remove();
    }
    const mn_Ne7b9element = document.querySelector("#mn_Ne7b9");
    if (mn_Ne7b9element) {
      mn_Ne7b9element.remove();
    }
    const qmenuelement = document.querySelector("#qmenu");
    if (qmenuelement) {
      qmenuelement.remove();
    }
  }

  /**
   * 移除首頁熱門
   */
  async function removeIndex() {
    window.addEventListener("load", function () {
      const diyChart = document.querySelector("#diy_chart");
      if (diyChart) {
        diyChart.remove();
      }
    });
  }

  // #endregion

  // #region 持久性設定

  /**
   * 儲存使用者的設定並執行相應的操作。
   */
  function saveSettings() {
    // 獲取目前的設定
    const oldSettings = getSettings();
    const newSettings = {};

    // 從頁面的UI元素中讀取設定值
    newSettings.showDown = document.getElementById("showDownCheckbox").checked;
    newSettings.showCopyCode = document.getElementById("showCopyCodeCheckbox").checked;
    newSettings.showFastReply = document.getElementById("showFastReplyCheckbox").checked;
    newSettings.showQuickGrade = document.getElementById("showQuickGradeCheckbox").checked;
    newSettings.showQuickStar = document.getElementById("showQuickStarCheckbox").checked;
    newSettings.showClickDouble = document.getElementById("showClickDoubleCheckbox").checked;
    newSettings.showViewRatings = document.getElementById("showViewRatingsCheckbox").checked;
    newSettings.showPayLog = document.getElementById("showPayLogCheckbox").checked;
    newSettings.showFastCopy = document.getElementById("showFastCopyCheckbox").checked;
    newSettings.blockingIndex = document.getElementById("blockingIndexCheckbox").checked;
    newSettings.qiandaoTip = document.getElementById("qiandaoTipCheckbox").checked;
    newSettings.displayBlockedTips = document.getElementById("displayBlockedTipsCheckbox").checked;
    newSettings.blockedUsers = document
      .getElementById("blockedUsersList")
      .value.split("\n")
      .map((name) => name.trim())
      .filter((user) => user.trim() !== "");
    newSettings.autoPagination = document.getElementById("autoPaginationCheckbox").checked;
    newSettings.displayThreadBuyInfo = document.getElementById("displayThreadBuyInfoCheckbox").checked;
    newSettings.maxGradeThread = document.getElementById("maxGradeThread").value;
    newSettings.excludeOptions = [
      ...new Set(
        document
          .getElementById("excludeOptionsTextarea")
          .value.split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "")
      ),
    ];
    newSettings.excludePostOptions = [
      ...new Set(
        document
          .getElementById("excludePostOptionsTextarea")
          .value.split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "")
      ),
    ];

    // 儲存設定
    for (let key in newSettings) {
        GM_setValue(key, newSettings[key]);
    }

    // 如果核心設定已更改，重新載入頁面
    if (
      oldSettings.blockingIndex !== newSettings.blockingIndex ||
      oldSettings.showFastCopy !== newSettings.showFastCopy ||
      oldSettings.showViewRatings !== newSettings.showViewRatings ||
      oldSettings.showPayLog !== newSettings.showPayLog ||
      oldSettings.showClickDouble !== newSettings.showClickDouble ||
      oldSettings.showQuickStar !== newSettings.showQuickStar ||
      oldSettings.showQuickGrade !== newSettings.showQuickGrade ||
      oldSettings.showFastReply !== newSettings.showFastReply ||
      oldSettings.showCopyCode !== newSettings.showCopyCode ||
      oldSettings.showDown !== newSettings.showDown ||
      oldSettings.displayBlockedTips !== newSettings.displayBlockedTips ||
      oldSettings.displayThreadBuyInfo !== newSettings.displayThreadBuyInfo ||
      oldSettings.autoPagination !== newSettings.autoPagination ||
      oldSettings.blockedUsers.toString() !==
        newSettings.blockedUsers.toString() ||
      oldSettings.excludeOptions.toString() !==
        newSettings.excludeOptions.toString() ||
      oldSettings.excludePostOptions.toString() !==
        newSettings.excludePostOptions.toString()
    ) {
      location.reload();
    }
  }
  // #endregion

  // #region 進階搜尋

  /**
   * 在頁面上新增進階搜尋功能。
   * @param {Object} settings - 使用者的設定物件
   */
  function addAdvancedSearch(settings) {
    const tlElement = document.querySelector(".tl");
    if (!tlElement) {
      console.error("The .tl element not found!");
      return;
    }

    const advancedSearchDiv = createAdvancedSearchDiv(settings);
    document.body.appendChild(advancedSearchDiv);

    initCheckboxGroupWithSettings(advancedSearchDiv, settings);
    addEventListenerForAdvancedSearch(advancedSearchDiv);
  }

  /**
   * 建立一個進階搜尋區域（div）。
   * @param {Object} settings - 使用者的設定物件
   * @param {Array} TIDOptions - 板塊選項，預設值為DEFAULT_TID_OPTIONS
   * @returns {HTMLElement} - 建立的div元素
   */
  function createAdvancedSearchDiv(settings, TIDOptions = DEFAULT_TID_OPTIONS) {
    const advancedSearchDiv = document.createElement("div");
    const excludeOptions = settings.excludeOptions || [];
    const excludeOptionsFormatted = excludeOptions.map((option) => ({
      label: option,
      value: option,
    }));

    advancedSearchDiv.appendChild(
      createCheckboxGroup("excludeGroup", "排除關鍵字", excludeOptionsFormatted)
    );
    advancedSearchDiv.appendChild(
      createCheckboxGroup("TIDGroup", "只看板塊", TIDOptions)
    );

    // 新增樣式類
    advancedSearchDiv.classList.add("advanced-search");

    return advancedSearchDiv;
  }

  /**
   * 根據傳入的設定初始化核取方塊的狀態。
   *
   * @param {HTMLElement} div - 包含核取方塊組的div元素
   * @param {Object} settings - 使用者的設定物件
   */
  function initCheckboxGroupWithSettings(div, settings) {
    const setCheckboxes = (group, values) => {
      values.forEach((value) => {
        const checkbox = div.querySelector(`#${group} input[value="${value}"]`);
        if (checkbox) checkbox.checked = true;
      });
    };

    setCheckboxes("excludeGroup", settings.excludeGroup);
    setCheckboxes("TIDGroup", settings.TIDGroup);
  }

  /**
   * 為進階搜尋區域的核取方塊組新增事件監聽器。
   * @param {HTMLElement} div - 包含核取方塊組的div元素
   */
  function addEventListenerForAdvancedSearch(div) {
    div.addEventListener("change", function (e) {
      const handleCheckboxChange = (group) => {
        if (e.target.closest(`#${group}`)) {
          const selectedValues = [
            ...document.querySelectorAll(`#${group} input:checked`),
          ].map((input) => input.value);
          GM_setValue(group, JSON.stringify(selectedValues));
        }
      };

      handleCheckboxChange("excludeGroup");
      handleCheckboxChange("TIDGroup");
      filterElementsBasedOnSettings(getSettings());
    });
  }

  /**
   * 替換搜尋頁面的logo。
   */
  function replaceImageSrc() {
    // 等待頁面完全載入
    window.addEventListener("load", function () {
      // 尋找所有包含舊圖片路徑的img元素
      document
        .querySelectorAll('img[src="static/image/common/logo_sc_s.png"]')
        .forEach(function (img) {
          // 替換為新的圖片路徑
          img.src = "static/image/common/logo.png";
        });
    });
  }

  // #endregion

  /**
   * 主程式執行函數。
   */
  async function main() {
    const settings = getSettings();

    // 如果距離上次檢查更新已經超過24小時，則檢查更新
    const lastCheckedUpdate = settings.lastCheckedUpdate;
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    if (Date.now() - lastCheckedUpdate > oneDayInMillis) {
      checkForUpdates();
    }

    await baseFunction(settings);
  }

  // 啟動主程式
  await main();
})();