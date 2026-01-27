// ==UserScript==
// @name         Ticket Popup + Detail Modifier
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  修改电子票弹窗 + 详情页显示信息（React弹窗/二维码页/详情页稳定生效）
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563892/Ticket%20Popup%20%2B%20Detail%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/563892/Ticket%20Popup%20%2B%20Detail%20Modifier.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** ===== 你要改的内容 ===== */
    const NEW_CODE  = "T2899713150";
    const NEW_SEAT  = "Reserved Seat FLOOR Side F4. Row 4. 24";
    const NEW_PRICE = "₩143,000(General)";
    const NEW_NAME  = "LIANG MENGLU";
    const NEW_MASK  = "(**1102)";

    /** ===== 弹窗修改（保持原有逻辑） ===== */
    function modifyPopup(root = document) {
        /* 顶部：票号 + 座位 */
        root.querySelectorAll('div[class^="page_ticketSummary"]').forEach(box => {
            const h2s = box.querySelectorAll("h2");
            if (h2s.length >= 2) {
                h2s[0].textContent = NEW_CODE;
                h2s[1].textContent = NEW_SEAT;
            }
        });

        /* 下方：价格 / 姓名 / 尾号 */
        root.querySelectorAll('ul[class^="page_ticketDetail"]').forEach(ul => {
            const lis = ul.querySelectorAll("li");
            if (lis.length >= 3) {
                lis[0].textContent = NEW_PRICE;
                lis[1].textContent = NEW_NAME;
                lis[2].textContent = NEW_MASK;
            }
        });
    }

    /** ===== 新增：详情页修改（不弹窗） ===== */
    function modifyDetail(root = document) {
        root.querySelectorAll('div.ticket-detail_ticketInfo__2knEE').forEach(div => {
            const h2s = div.querySelectorAll("h2");
            if (h2s.length >= 2) {
                h2s[0].textContent = "26.01.24(Sat) 18:00"; // 原日期，如果你想修改可改
                h2s[1].textContent = NEW_SEAT;
            }
            const lis = div.querySelectorAll("ul li");
            if (lis.length >= 3) {
                lis[0].textContent = NEW_CODE;   // 票号
                lis[1].textContent = NEW_PRICE;  // 价格
                lis[2].textContent = NEW_NAME;   // 姓名
            }
        });
    }

    /** ===== 监听 DOM 变化（保持弹窗逻辑） ===== */
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) {
                    modifyPopup(node);
                    modifyDetail(node);  // 同时检查新节点
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    /** 兜底：防止漏改 */
    setInterval(() => {
        modifyPopup(document);
        modifyDetail(document);
    }, 500);

})();
