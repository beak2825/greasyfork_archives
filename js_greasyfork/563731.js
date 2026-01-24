// ==UserScript==
// @name         Ticket Info Modifier
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  修改电子票显示的信息
// @author       You
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563731/Ticket%20Info%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/563731/Ticket%20Info%20Modifier.meta.js
// ==/UserScript==
(function() {

    'use strict';

    const NEW_DATE   = "26.01.24(Sat) 18:00";      // 日期时间

    const NEW_SEAT   = "Reserved Seat FLOOR Side F4. Row 4. 24"; // 座位信息

    const NEW_CODE   = "T2899713150";              // 票号

    const NEW_PRICE  = "₩143,000(General)";            // 票价

    const NEW_NAME   = "LIANG MENGLU";              // 姓名

    function modifyTickets() {

        const tickets = document.querySelectorAll(".ticket-detail_ticketInfo__2knEE");

        tickets.forEach(ticket => {

            const h2s = ticket.querySelectorAll("h2");

            const lis = ticket.querySelectorAll("ul li");

            if (h2s.length >= 2) {

                h2s[0].textContent = NEW_DATE;

                h2s[1].textContent = NEW_SEAT;

            }

            if (lis.length >= 3) {

                lis[0].textContent = NEW_CODE;

                lis[1].textContent = NEW_PRICE;

                lis[2].textContent = NEW_NAME;

            }

        });

    }

    // 页面加载完成后执行

    window.addEventListener('load', () => {

        modifyTickets();

        // 如果有延迟加载，重复执行几次

        setTimeout(modifyTickets, 1000);

        setTimeout(modifyTickets, 3000);

    });

})();