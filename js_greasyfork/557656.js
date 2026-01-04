// ==UserScript==
// @name         國光客運自動訂票
// @name:en      Kingbus Autofill
// @name:zh-CN   国光客运自动订票
// @name:zh-TW   國光客運自動訂票
// @name:zh      國光客運自動訂票
// @namespace    http://tampermonkey.net/
// @version      2025-12-02
// @description  自動填入查詢國光客運訂票系統
// @description:en  Autofill and submit Kingbus order form step by step
// @description:zh-CN  自动填入查询国光客运订票系统
// @description:zh-TW  自動填入查詢國光客運訂票系統
// @description:zh  自動填入查詢國光客運訂票系統
// @author       Elvis Mao
// @match        https://order.kingbus.com.tw/ORD/ORD_M_1510_OrderGo.aspx
// @match        https://order.kingbus.com.tw/ORD/ORD_M_1520_OrderGo.aspx
// @icon         https://emtech.cc/icons/apple-touch-icon.png
// @grant        none
// @license           Apache-2.0
// @homepageURL       https://github.com/Edit-Mr/SSS/tree/main
// @supportURL        https://github.com/Edit-Mr/SSS/issues

// @downloadURL https://update.greasyfork.org/scripts/557656/%E5%9C%8B%E5%85%89%E5%AE%A2%E9%81%8B%E8%87%AA%E5%8B%95%E8%A8%82%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557656/%E5%9C%8B%E5%85%89%E5%AE%A2%E9%81%8B%E8%87%AA%E5%8B%95%E8%A8%82%E7%A5%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper: wait until element exists
    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Step 1: Fill passenger info and click OK
    waitForElement('#ctl00_ContentPlaceHolder1_txtCustomer_ID', () => {
        document.querySelector('#ctl00_ContentPlaceHolder1_txtCustomer_ID').value = 'A123456789';
        document.querySelector('#ctl00_ContentPlaceHolder1_txtPhone').value = '0900000000';
        document.querySelector('#ctl00_ContentPlaceHolder1_txtCustomer_N').value = '姓名';
        document.querySelector('#ctl00_ContentPlaceHolder1_txtE_mail').value = 'info@elvismao.com';

        document.querySelector('#ctl00_ContentPlaceHolder1_btnStep1_OK').click();
    });

    // Step 2: Wait for "From station"
    waitForElement('#ctl00_ContentPlaceHolder1_ddlStation_ID_From', (fromSelect) => {
        setTimeout(() => {
            fromSelect.value = 'D23'; // 清大
            fromSelect.dispatchEvent(new Event('change', { bubbles: true }));
            // Step 2a: Wait for "To station" to have 台中
            waitForElement('#ctl00_ContentPlaceHolder1_ddlStation_ID_To option[value="G67"]', () => {
                const toSelect = document.querySelector('#ctl00_ContentPlaceHolder1_ddlStation_ID_To');
                toSelect.value = 'G67'; // 台中

                // Step 2b: Fill date with today's date
                const today = new Date((new Date()).getTime() + 2.5 * 60 * 60 * 1000);
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const formatted = `${yyyy}/${mm}/${dd}`;

                let hour = today.getHours();
                let minute = today.getMinutes();

                // Round minutes up to the next 10
                minute = Math.ceil(minute / 10) * 10;
                if (minute === 60) {
                    minute = 0;
                    hour = (hour + 1) % 24;
                }

                document.querySelector('#ctl00_ContentPlaceHolder1_txtOut_Dt').value = formatted;
                document.querySelector('#ctl00_ContentPlaceHolder1_ddlHour').value = hour.toString().padStart(2, "0")
                document.querySelector('#ctl00_ContentPlaceHolder1_ddlMinute').value = minute.toString().padStart(2, "0");

                // Step 2c: Click Step 2 OK
                document.querySelector('#ctl00_ContentPlaceHolder1_btnStep2_OK').click();
            });
        });
    });
})();
