// ==UserScript==
// @name         YUAN NUOTING
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修改电子票姓名、生日、期满日期（主页/详情页/我的信息页不卡顿无闪烁）
// @author       You
// @match        *://*.interpark.com/*
// @match        *://*.interparkglobal.com/*
// @match        *://m.interpark.com/*
// @match        *://m.interparkglobal.com/*
// @match        *://*.nol.com/*
// @icon         https://interpark.com/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563588/YUAN%20NUOTING.user.js
// @updateURL https://update.greasyfork.org/scripts/563588/YUAN%20NUOTING.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    /*** 全局配置 ***/
    const OLD_NAME = "PAN YANGJING";
    const NEW_NAME = "YUAN NUOTING";
    const NEW_BIRTHDAY = "(**0906)";
    const NEW_EXPIRE_DATE = "2033-11-05";
 
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
 
    /*** 我的信息页处理函数（无闪烁版本） ***/
    function replaceInMyInfoNode(node) {
        if (node.nodeType !== 1) return; // 只处理元素节点
 
        // 如果是 <dt> 并且内容是“预订者姓名”
        if (node.tagName.toLowerCase() === 'dt' && node.textContent.includes("预订者姓名")) {
            const dd = node.nextElementSibling;
            if (dd && dd.tagName.toLowerCase() === 'dd') {
                if (dd.textContent.includes(OLD_NAME)) {
                    dd.textContent = dd.textContent.replace(OLD_NAME, NEW_NAME);
                }
            }
        }
 
        // 如果是 <dd>，也检查是否含有旧名字
        if (node.tagName && node.tagName.toLowerCase() === 'dd' && node.textContent.includes(OLD_NAME)) {
            node.textContent = node.textContent.replace(OLD_NAME, NEW_NAME);
        }
    }
 
    function replaceInMyInfo() {
        document.querySelectorAll('dt').forEach(dt => {
            if (dt.textContent.includes("预订者姓名")) {
                const dd = dt.nextElementSibling;
                if (dd && dd.tagName.toLowerCase() === 'dd' && dd.textContent.includes(OLD_NAME)) {
                    dd.textContent = dd.textContent.replace(OLD_NAME, NEW_NAME);
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
 
    /*** MutationObserver 去抖 + 无闪烁处理 ***/
    let timer = null;
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                // 在节点插入时立即处理“我的信息页”节点
                if (/\/my-info\/reservations\//.test(location.href)) {
                    replaceInMyInfoNode(node);
                }
            });
        });
 
        // 仍然保留去抖统一处理（主页/详情页）
        if (timer) clearTimeout(timer);
        timer = setTimeout(run, 50);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
 
    // 初始运行一次
    run();
})();