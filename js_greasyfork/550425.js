// ==UserScript==
// @name         u9a9列表显示预览图new
// @namespace    http://tampermonkey.net/
// @version      0.04
// @description  u9a9在外部的列表直接查看预览图，无需进入详情页面查看，仅对 u9a9.com 域名生效,根据原作者修改
// @author       meteora，djjackol
// @match        https://u9a9.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=u9a9.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550425/u9a9%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BEnew.user.js
// @updateURL https://update.greasyfork.org/scripts/550425/u9a9%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E9%A2%84%E8%A7%88%E5%9B%BEnew.meta.js
// ==/UserScript==
;(() => {
    'use strict';

    // 这个选择器是正确的，它能精确地找到首页上的每一个帖子行
    const rows = document.querySelectorAll('table.torrent-list tbody tr.default');

    if (!rows || rows.length === 0) {
        console.log('预览脚本：未在本页找到任何帖子行。');
        return;
    }

    for (const row of rows) {
        const linkElement = row.querySelector('td:nth-child(2) a');
        if (!linkElement) continue;

        const pageUrl = linkElement.href;

        fetch(pageUrl)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP 错误！状态: ${response.status}`);
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // ====================== 【请重点关注这里】 ======================
                // V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V

                // 这一行是脚本的“眼睛”，用来在详情页里找图片。
                // 如果详情页的结构变了，这个选择器就会找不到图片，导致预览失败。
                // 请根据下面的教程，用一个正确的新选择器替换掉下面这行引号里的内容。
                const imgElement = doc.querySelector('div.img-container > img:nth-child(1)');

                // ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^
                // =============================================================

                if (imgElement && imgElement.src) {
                    const imageUrl = imgElement.src;
                    const newRow = document.createElement('tr');
                    const newCell = document.createElement('td');

                    // colspan="5" 是正确的，因为表格有5列
                    newCell.setAttribute('colspan', '5');
                    newCell.style.padding = '10px';
                    newCell.style.textAlign = 'center';

                    newCell.innerHTML = `
                        <a href="${pageUrl}" target="_blank" title="点击查看详情">
                            <img src="${imageUrl}" style="max-width: 100%; max-height: 500px; height: auto; border-radius: 5px; border: 1px solid #ddd;" />
                        </a>
                    `;

                    newRow.appendChild(newCell);
                    row.insertAdjacentElement('afterend', newRow);
                } else {
                    // 如果在此处看到大量报错，说明图片选择器100%是错误的
                    console.log(`在页面 ${pageUrl} 中未找到指定的图片元素。请检查图片选择器。`);
                }
            })
            .catch(error => {
                console.error(`处理 ${pageUrl} 时发生错误:`, error);
            });
    }
})();
