// ==UserScript==
// @name         chenyeye
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修改电子票姓名、生日、期满日期（详情页只修改英文名字，主页/我的信息页不变，无闪烁）
// @author       You
// @match        *://*.interpark.com/*
// @match        *://*.interparkglobal.com/*
// @match        *://m.interpark.com/*
// @match        *://m.interparkglobal.com/*
// @icon         https://interpark.com/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563416/chenyeye.user.js
// @updateURL https://update.greasyfork.org/scripts/563416/chenyeye.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    /************ 配置区 ************/
    const OLD_NAME = "CHEN YEYE"; // 英文名字
    const NEW_NAME = "YUAN LIN"; // 新名字
    const NEW_BIRTHDAY = "(**0129)";
    const NEW_EXPIRE_DATE = "2033-05-23";
 
    const DATE_RE = /\d{4}-\d{2}-\d{2}/g;
 
    const BOOKER_LABEL_RE = /(预订者姓名|예매자명)/;
 
    /************ 主页处理 ************/
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
 
    /************ 详情页处理（只替换英文名字） ************/
    function replaceInTicketDetail() {
        document.querySelectorAll("li, span, div, h2, h3").forEach(el => {
            const txt = el.textContent.trim();
            if (!txt) return;
 
            // 英文名字完全匹配
            if (txt === OLD_NAME) {
                el.textContent = NEW_NAME;
            }
 
            // 生日替换
            if (/^\(\*\*\d{4}\)$/.test(txt)) {
                el.textContent = NEW_BIRTHDAY;
            }
        });
    }
 
    /************ 我的信息页处理 ************/
    function replaceBookerNameInDL(dl) {
        if (!dl) return;
        const dt = dl.querySelector("dt");
        const dd = dl.querySelector("dd");
        if (!dt || !dd) return;
 
        const dtText = dt.textContent.trim();
        const span = dd.querySelector("span");
        if (!span) return;
 
        const nameText = span.textContent.trim();
 
        if ((BOOKER_LABEL_RE.test(dtText) || nameText.includes(OLD_NAME)) && nameText.includes(OLD_NAME)) {
            span.textContent = nameText.replace(OLD_NAME, NEW_NAME);
        }
    }
 
    function replaceInMyInfo() {
        document.querySelectorAll(".infoListWrap dl").forEach(replaceBookerNameInDL);
    }
 
    /************ 全局 MutationObserver（主页/我的信息页动态内容去抖） ************/
    let timer = null;
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
 
                // 如果新增节点里有 dl，就遍历
                const dls = node.querySelectorAll?.("dl") || [];
                dls.forEach(replaceBookerNameInDL);
 
                // 自身就是 dl
                if (node.tagName?.toLowerCase() === "dl") {
                    replaceBookerNameInDL(node);
                }
            });
        });
 
        // 去抖统一处理主页/详情页/我的信息页
        if (timer) clearTimeout(timer);
        timer = setTimeout(run, 50);
    });
 
    observer.observe(document.documentElement, { childList: true, subtree: true });
 
    /************ 页面路由判断 ************/
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
 
    // 页面初始运行一次
    run();
 
})();