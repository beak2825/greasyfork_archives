// ==UserScript==
// @name         支援者現在コメ数データ表示（sm125732）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  任意の名前のコメント合計と今日のコメント数・月累計・「〇時〇分現在」を取得して表示
// @match        https://www.nicovideo.jp/watch/sm125732*
// @grant        GM_xmlhttpRequest
// @connect      sosuteno.com
// @downloadURL https://update.greasyfork.org/scripts/549618/%E6%94%AF%E6%8F%B4%E8%80%85%E7%8F%BE%E5%9C%A8%E3%82%B3%E3%83%A1%E6%95%B0%E3%83%87%E3%83%BC%E3%82%BF%E8%A1%A8%E7%A4%BA%EF%BC%88sm125732%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549618/%E6%94%AF%E6%8F%B4%E8%80%85%E7%8F%BE%E5%9C%A8%E3%82%B3%E3%83%A1%E6%95%B0%E3%83%87%E3%83%BC%E3%82%BF%E8%A1%A8%E7%A4%BA%EF%BC%88sm125732%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.commentPanelCreated) return;
    window.commentPanelCreated = true;

    let monthlyUrl = "https://sosuteno.com/jien/Index/202508user.html";

    // 現在の年月をYYYYMM形式で取得してURL差し替え
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyymm = `${yyyy}${mm}`;
    monthlyUrl = monthlyUrl.replace(/Index\/\d{6}user\.html$/, `Index/${yyyymm}user.html`);

    const liveUrl = "https://sosuteno.com/jien/Live/index2c.html";
    const todayUrl = "https://sosuteno.com/jien/Live/index2c.html";

    let total = 0;        // 月間合計
    let liveValue = 0;    // 本日（index2c.html）
    let todayValue = 0;   // 今日（index2c.html）
    let monthlySum = 0;   // 月累計（index2c.html）
    let currentText = ""; // 「〇時〇分現在」
    let completed = 0;

    // ===== 入力キーワード保存・読み込み =====
    const STORAGE_KEY = "commentKeyword";
    let keyword = localStorage.getItem(STORAGE_KEY) || "支援者名";

    function createPanel() {
        const container = document.createElement("div");
        container.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background-color: rgba(0,0,0,0.85) !important;
            color: white !important;
            padding: 12px !important;
            border-radius: 8px !important;
            z-index: 99999 !important;
            font-size: 16px !important;
            font-family: 'Meiryo'!important;
            white-space: pre-line !important;
            font-weight: bold !important;
        `;

        // 入力欄
        const input = document.createElement("input");
        input.type = "text";
        input.value = keyword;
        input.placeholder = "キーワードを入力";
        input.style.cssText = `
            width: 150px !important;
            margin-bottom: 6px !important;
            padding: 2px 4px !important;
        `;
        input.addEventListener("change", () => {
            keyword = input.value.trim() || "支援者名";
            localStorage.setItem(STORAGE_KEY, keyword);
        });

        // 表示領域
        const display = document.createElement("div");
        display.id = "commentResult";
        display.style.marginTop = "6px";

        container.appendChild(input);
        container.appendChild(display);
        document.body.appendChild(container);
    }

    function updateDisplay() {
        const panel = document.querySelector("#commentResult");
        if (panel) {
            panel.innerText =
                 currentText + "\n\n" +// ←「〇時〇分現在」
                "月間: " + total + " (" + monthlySum + ")\n"+
                "本日: " + liveValue + " (" + todayValue + ")";
        }
    }

    function fetchElectrode(url, isLive) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "arraybuffer",
            onload: function(response) {
                let value = 0;
                try {
                    let decoder = new TextDecoder("shift-jis");
                    let text = decoder.decode(response.response);
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(text, "text/html");
                    let tds = Array.from(doc.querySelectorAll("td"));
                    for (let i = 0; i < tds.length - 1; i++) {
                        if (tds[i].textContent.trim() === keyword) {
                            value = parseInt(tds[i + 1].textContent.trim(), 10) || 0;
                            break;
                        }
                    }
                } catch (e) {
                    value = 0;
                }
                total += value;
                if (isLive) liveValue = value;
                checkCompleted();
            },
            onerror: function() {
                if (isLive) liveValue = 0;
                checkCompleted();
            }
        });
    }

    function fetchToday(url) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "arraybuffer",
            onload: function(response) {
                let tValue = 0;
                let mSum = 0;
                try {
                    let decoder = new TextDecoder("shift-jis");
                    let text = decoder.decode(response.response);

                    // 今日のコメント数
                    const today = new Date();
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, "0");
                    const dd = String(today.getDate()).padStart(2, "0");
                    const dateStr = `${yyyy}-${mm}-${dd}`;
                    const todayRegex = new RegExp(dateStr + "のコメント数: *(\\d+)");
                    const todayMatch = text.match(todayRegex);
                    if (todayMatch) {
                        tValue = parseInt(todayMatch[1], 10) || 0;
                    }

                    // 月累計
                    const monthRegex = /月累計: *(\d+)/;
                    const monthMatch = text.match(monthRegex);
                    if (monthMatch) {
                        mSum = parseInt(monthMatch[1], 10) || 0;
                    }

                    // 「〇時〇分現在の分集計データ」
                    const timeRegex = /(\d{1,2}時\d{1,2}分現在)の分集計データ/;
                    const timeMatch = text.match(timeRegex);
                    if (timeMatch) {
                        currentText = timeMatch[1];
                    } else {
                        currentText = "";
                    }
                } catch (e) {
                    tValue = 0;
                    mSum = 0;
                    currentText = "";
                }
                todayValue = tValue;
                monthlySum = mSum;
                checkCompleted();
            },
            onerror: function() {
                todayValue = 0;
                monthlySum = 0;
                currentText = "";
                checkCompleted();
            }
        });
    }

    function checkCompleted() {
        completed++;
        if (completed === 3) {
            updateDisplay();
        }
    }

    createPanel();
    fetchElectrode(monthlyUrl, false);
    fetchElectrode(liveUrl, true);
    fetchToday(todayUrl);

})();