// ==UserScript==
// @name         NTHU elearn/eeclass 跳過首頁
// @namespace    http://tampermonkey.net/
// @version      2025-10-07
// @description  幫助國立清華大學學生適應學校那勾使的兩個NTHU學習系統網頁 (自用，沒有多智能，謹慎使用)
// @author       C_moe
// @match        https://eeclass.nthu.edu.tw/*
// @match        https://elearn.nthu.edu.tw/*
// @match        https://eeclass.nthu.edu.tw/index/login?*
// @icon         https://img.youtube.com/vi/oHg5SJYRHA0/0.jpg
// @run-at       document-start
// @grant        none
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/552401/NTHU%20elearneeclass%20%E8%B7%B3%E9%81%8E%E9%A6%96%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/552401/NTHU%20elearneeclass%20%E8%B7%B3%E9%81%8E%E9%A6%96%E9%A0%81.meta.js
// ==/UserScript==




(async function() {
    'use strict';
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const retrytime = 300;

    const url = window.location.href;
    const path = window.location.pathname;

    // eeclass
    if (url.includes("eeclass.nthu.edu.tw") ) {
        if (path == "/" || path == "") window.location.replace("https://eeclass.nthu.edu.tw/dashboard"); // 沒登入，會自動跳去登入頁面
        else if (path == "/index/login") window.location.replace("https://eeclass.nthu.edu.tw/service/oauthRedir"); // 自動跳轉校務系統登入
    }


    // elearn 的東西複雜到嚇得我elearn elearn的
    if ( url.includes("elearn.nthu.edu.tw") ) {
        if (path == "/" || path == "") {
            if(location.search == "?redirect=0") { // 到這邊，有可能登入了，可能沒登入，比較麻煩
                let retryTimes = 0 //利用閉包，外部儲存重試次數

                const tryLogin = async() => {
                    const anchor = document.querySelector('a.btn-login, a[class*="btn-login"]');
                    if (!anchor) {
                        if (retryTimes < 5) {
                            await delay(retrytime)
                            tryLogin();
                            retryTimes++;
                        } else window.location.replace("https://elearn.nthu.edu.tw/my/"); // 不管了，1500ms都沒按鈕，那肯定是登入了，直接跳
                        return; // 跑路了，後面不關我的事情
                    } // 其實到這一步就可以了，後面是拿sesskey，以後需要再用
                    anchor.click(); // 點按鈕
                    return;

                    /* 取sesskey(已經return，不執行，僅作備用)
                    const href = anchor.href;
                    if (!href) {
                        await delay(retrytime) // retry in 300ms
                        tryLogin();
                        return;
                    }

                    const urlObj = new URL(href);
                    const sesskey = urlObj.searchParams.get('sesskey');
                    console.log("[userscript] Found sesskey:", sesskey);
                    return sesskey;
                    */
                };

                tryLogin()
            }
            else window.location.replace("https://elearn.nthu.edu.tw/my/");
        }
    }

})();