// ==UserScript==
// @name         WANG HANJUN
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
// @downloadURL https://update.greasyfork.org/scripts/548988/WANG%20HANJUN.user.js
// @updateURL https://update.greasyfork.org/scripts/548988/WANG%20HANJUN.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    /*** 全局配置 ***/
    const OLD_NAME = "XIONG YANXI";
    const NEW_NAME = "WANG HANJUN";
    const NEW_BIRTHDAY = "(**0803)";
    const NEW_EXPIRE_DATE = "2033-10-26";
 
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
 
            if (txt === OLD_NAME) {
                el.textContent = NEW_NAME;
            } 
            if (/^\(\*\*\d{4}\)$/.test(txt)) {
                el.textContent = NEW_BIRTHDAY;
            }
        });
    }
 
    /*** 我的信息页处理函数 ***/
    function replaceInMyInfo() {
        const dtList = document.querySelectorAll('dt.sc-93061802-4.kTtKGi');
        dtList.forEach(dt => {
            if (dt.textContent.includes("预订者姓名")) {
                let dd = dt.nextElementSibling;
                if (dd && dd.tagName.toLowerCase() === 'dd' && dd.textContent.includes(OLD_NAME)) {
                    dd.textContent = NEW_NAME;
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