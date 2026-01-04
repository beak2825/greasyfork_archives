// ==UserScript==
// @name         CoinGlass 涨跌幅采集器（intumu.com）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  自动采集 CoinGlass 各时间周期下的涨跌幅数据并保存为 TXT 文件
// @match        https://www.coinglass.com/zh/gainers-losers*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553814/CoinGlass%20%E6%B6%A8%E8%B7%8C%E5%B9%85%E9%87%87%E9%9B%86%E5%99%A8%EF%BC%88intumucom%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553814/CoinGlass%20%E6%B6%A8%E8%B7%8C%E5%B9%85%E9%87%87%E9%9B%86%E5%99%A8%EF%BC%88intumucom%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const labels = ["5分钟", "15分钟", "30分钟", "1小时", "4小时", "12小时", "24小时"];
    let result = "";
    let currentIndex = 0;

    function insertMainButton() {
        if (document.getElementById("cg-capture-btn")) return;

        const btn = document.createElement("button");
        btn.id = "cg-capture-btn";
        btn.textContent = "📋 采集涨跌幅数据";
        btn.style.cssText = "position:fixed;top:20px;right:20px;z-index:9999;padding:8px 12px;background:#f0b90b;color:#000;border:none;border-radius:4px;cursor:pointer;";
        btn.onclick = () => {
            currentIndex = 0;
            result = "";
            processNextLabel();
        };
        document.body.appendChild(btn);
    }

    function processNextLabel() {
        if (currentIndex >= labels.length) {
            saveToFile();
            return;
        }

        const label = labels[currentIndex];
        const buttons = Array.from(document.querySelectorAll("button"));
        const target = buttons.find(btn => btn.textContent.trim() === label);
        if (target) {
            target.click();
            console.log(`点击标签：${label}`);
            setTimeout(() => {
                extractTables(label);
            }, 3000);
        } else {
            result += `=== ${label} ===\n⚠️ 未找到对应按钮\n\n`;
            currentIndex++;
            processNextLabel();
        }
    }

    function extractTables(label) {
        const tables = document.querySelectorAll("table");
        if (tables.length < 2) {
            result += `=== ${label} ===\n⚠️ 未找到两个排行榜表格\n\n`;
            currentIndex++;
            processNextLabel();
            return;
        }

        result += `=== ${label} ===\n类型\t币种\t价格\t涨跌幅\t成交额\n`;

        ["涨幅", "跌幅"].forEach((type, index) => {
            const rows = Array.from(tables[index].querySelectorAll("tbody tr"));
            rows.forEach(row => {
                const cells = Array.from(row.querySelectorAll("td")).map(td => td.innerText.trim());
                if (cells.length >= 5) {
                    result += `${type}\t${cells[1]}\t${cells[2]}\t${cells[3]}\t${cells[4]}\n`;
                }
            });
        });

        result += `\n`;
        currentIndex++;
        processNextLabel();
    }

    function saveToFile() {
        const blob = new Blob([result], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "coinglass_gainers_losers.txt";
        link.click();
    }

    window.addEventListener("load", () => {
        setTimeout(insertMainButton, 3000);
    });
})();
