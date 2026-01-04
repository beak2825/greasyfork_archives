// ==UserScript==
// @name         WANG CHENSHUO
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  修改电子票姓名、生日、期满日期（主页不卡顿无闪烁）
// @author       You
// @match        *://*.interpark.com/*
// @match        *://*.interparkglobal.com/*
// @match        *://m.interpark.com/*
// @match        *://m.interparkglobal.com/*
// @icon         https://interpark.com/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548940/WANG%20CHENSHUO.user.js
// @updateURL https://update.greasyfork.org/scripts/548940/WANG%20CHENSHUO.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** 全局配置 ***/
    const OLD_NAME = "JING ZHANG";
    const NEW_NAME = "WANG CHENSHUO";
    const NEW_BIRTHDAY = "(**0629)";
    const NEW_EXPIRE_DATE = "2034-08-14";

    const DATE_RE = /\d{4}-\d{2}-\d{2}/g;

    /*** 主页处理函数 ***/
    function replaceInHome() {
        document.querySelectorAll("div.mbs_4").forEach(el => {
            let html = el.innerHTML;
            let changed = false;

            if (html.includes(OLD_NAME)) {
                html = html.replaceAll(OLD_NAME, NEW_NAME);
                changed = true;
            }

            if (el.textContent.includes("期满") && DATE_RE.test(html)) {
                html = html.replace(DATE_RE, NEW_EXPIRE_DATE);
                changed = true;
            }

            if (changed) el.innerHTML = html;
        });
    }

    /*** 详情页处理函数 ***/
    function replaceInTicketDetail() {
        document.querySelectorAll("li, span, div, h2, h3").forEach(el => {
            let txt = el.textContent.trim();
            if (!txt) return;

            // 改名字
            if (txt === OLD_NAME) {
                el.textContent = NEW_NAME;
            }

            // 改生日
            if (/^\(\*\*\d{4}\)$/.test(txt)) {
                el.textContent = NEW_BIRTHDAY;
            }
        });
    }

    /*** 我的信息页处理函数 ***/
    function replaceInMyInfo() {
        document.querySelectorAll('dt').forEach(dt => {
            if (dt.textContent.includes("预订者姓名")) {
                const dd = dt.nextElementSibling;
                if (dd && dd.tagName.toLowerCase() === 'dd') {
                    if (dd.textContent.includes(OLD_NAME)) {
                        dd.textContent = dd.textContent.replace(OLD_NAME, NEW_NAME);
                    }
                }
            }
        });
    }

    /*** 路由匹配 ***/
    function run() {
        const url = location.href;
        if (/\/my-info\/reservations\//.test(url)) {
            replaceInMyInfo();
        } else if (/\/tickets\.interpark\.com\/mt\/detail/.test(url)) {
            replaceInTicketDetail();
        } else {
            replaceInHome();
        }
    }

    /*** MutationObserver 去抖 ***/
    let timer = null;
    const observer = new MutationObserver(() => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(run, 50); // 更快反应，减少闪烁
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 初始就运行一次，避免慢加载未修改
    run();
})();
