// ==UserScript==
// @name         聪明钱保存表格为TXT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将页面表格保存为TXT文件
// @match        https://intumu.com/static/bsms_plus.html
// @grant        none
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/555275/%E8%81%AA%E6%98%8E%E9%92%B1%E4%BF%9D%E5%AD%98%E8%A1%A8%E6%A0%BC%E4%B8%BATXT.user.js
// @updateURL https://update.greasyfork.org/scripts/555275/%E8%81%AA%E6%98%8E%E9%92%B1%E4%BF%9D%E5%AD%98%E8%A1%A8%E6%A0%BC%E4%B8%BATXT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const btn = document.createElement('button');
    btn.textContent = '保存表格为TXT';
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.padding = '10px';
    btn.style.background = '#4CAF50';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);

    // 点击事件
    btn.addEventListener('click', () => {
        const tables = document.querySelectorAll('table');
        let txtContent = '';

        tables.forEach((table, index) => {
            txtContent += `表格 ${index + 1}：\n`;
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('th, td');
                const rowText = Array.from(cells).map(cell => cell.innerText.trim()).join('\t');
                txtContent += rowText + '\n';
            });
            txtContent += '\n';
        });

        // 创建并下载TXT文件
        const blob = new Blob([txtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bsms_table.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
})();