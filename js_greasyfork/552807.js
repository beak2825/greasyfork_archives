// ==UserScript==
// @name         Alpha 数据保存器（微信Civilpy）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  自动点击标签，用户确认后复制页面内容，结构化为 TSV 并保存为 TXT
// @match        https://web3.binance.com/zh-CN/markets/alpha?chain=bsc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552807/Alpha%20%E6%95%B0%E6%8D%AE%E4%BF%9D%E5%AD%98%E5%99%A8%EF%BC%88%E5%BE%AE%E4%BF%A1Civilpy%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552807/Alpha%20%E6%95%B0%E6%8D%AE%E4%BF%9D%E5%AD%98%E5%99%A8%EF%BC%88%E5%BE%AE%E4%BF%A1Civilpy%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const labels = ["1 分钟", "5 分钟", "1 小时", "4 小时", "24 小时"];
    let result = "";
    let currentIndex = 0;

    function insertMainButton() {
        const container = document.querySelector(".flex.gap-4.ml-4.mr-6");
        if (!container || document.getElementById("alpha-capture-btn")) return;

        const btn = document.createElement("button");
        btn.id = "alpha-capture-btn";
        btn.textContent = "📋 开始标签采集";
        btn.style.padding = "6px 12px";
        btn.style.marginRight = "12px";
        btn.style.backgroundColor = "#f0b90b";
        btn.style.color = "#000";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";

        btn.onclick = () => {
            currentIndex = 0;
            result = "";
            processNextLabel();
        };

        container.prepend(btn);
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
                showConfirmButton(label);
            }, 3000);
        } else {
            result += `=== ${label} ===\n⚠️ 未找到对应按钮\n\n`;
            currentIndex++;
            processNextLabel();
        }
    }

    function showConfirmButton(label) {
        let confirmBtn = document.getElementById("confirm-copy-btn");
        if (confirmBtn) confirmBtn.remove();

        confirmBtn = document.createElement("button");
        confirmBtn.id = "confirm-copy-btn";
        confirmBtn.textContent = `✅ 确认复制 ${label} 数据`;
        confirmBtn.style.position = "fixed";
        confirmBtn.style.bottom = "20px";
        confirmBtn.style.right = "20px";
        confirmBtn.style.zIndex = "9999";
        confirmBtn.style.padding = "8px 12px";
        confirmBtn.style.backgroundColor = "#00cc66";
        confirmBtn.style.color = "#fff";
        confirmBtn.style.border = "none";
        confirmBtn.style.borderRadius = "4px";
        confirmBtn.style.cursor = "pointer";

        confirmBtn.onclick = () => {
            const text = document.body.innerText;
            result += `=== ${label} ===\n${text}\n\n`;
            confirmBtn.remove();
            currentIndex++;
            processNextLabel();
        };

        document.body.appendChild(confirmBtn);
    }

    function parseToStructuredCSV(rawText) {
        const sections = rawText.split(/===\s*(.*?)\s*===/g);
        const rows = [];

        for (let i = 1; i < sections.length; i += 2) {
            const label = sections[i].trim();
            const content = sections[i + 1];

            const regex = /([A-Z0-9]+)\s+(\d+d)\s+(0x[a-fA-F0-9\.]+)\s+\$([\d\.]+[MK]?)\s+([\d\.]+K?)\s+([\d\.]+K?)\s+\$([\d\.]+[MK]?)\s+\$([\d\.]+)\s+([+-]?\d+\.\d+%)\s+([\d\.K]+)\s+\$([\d\.]+[MK]?)/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                rows.push({
                    时间标签: label,
                    名称: match[1],
                    上线天数: match[2],
                    合约地址: match[3],
                    市值: match[4],
                    持币地址: match[5],
                    流动性地址: match[6],
                    总市值: match[7],
                    价格: match[8],
                    涨跌幅: match[9],
                    交易笔数: match[10],
                    成交量: match[11]
                });
            }
        }

        const headers = Object.keys(rows[0]);
        const csv = [
            headers.join('\t'),
            ...rows.map(row => headers.map(h => row[h]).join('\t'))
        ].join('\n');

        return csv;
    }

    function saveToFile() {
        const csvText = parseToStructuredCSV(result);
        const blob = new Blob([csvText], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "alpha_tokens_cleaned.txt";
        link.click();
    }

    window.addEventListener("load", () => {
        setTimeout(insertMainButton, 3000);
    });
})();
