// ==UserScript==
// @name         MOBAN AutoDetect Stable
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动识别页面显示的名字（英文/韩文），统一替换为 NEW_NAME，安全稳定，无闪烁
// @author       You
// @match        *://*.interpark.com/*
// @match        *://*.interparkglobal.com/*
// @match        *://m.interpark.com/*
// @match        *://m.interparkglobal.com/*
// @icon         https://interpark.com/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562085/MOBAN%20AutoDetect%20Stable.user.js
// @updateURL https://update.greasyfork.org/scripts/562085/MOBAN%20AutoDetect%20Stable.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /************ 配置区 ************/
    let OLD_NAME = null;               // 自动识别
    const NEW_NAME = "ZHANG YIWEN";    // 新名字
    const NEW_BIRTHDAY = "(**1128)";
    const NEW_EXPIRE_DATE = "2033-05-23";
    const DATE_RE = /\d{4}-\d{2}-\d{2}/g;
    const BOOKER_LABEL_RE = /(预订者姓名|예매자명)/;

    /************ 帮助函数：判断文本是否可能是名字 ************/
    function isCandidateName(txt) {
        if (!txt || txt.length < 2) return false;
        txt = txt.trim();
        // 排除票号 T2889015720
        if (/^T\d+$/.test(txt)) return false;
        // 排除价格，如 143,000원
        if (/[\d,]+원/.test(txt)) return false;
        // 排除日期时间
        if (/^\d{2,4}[\.\-\/]\d{1,2}[\.\-\/]\d{1,2}/.test(txt)) return false;
        return true;
    }

    /************ 主页处理 ************/
    function replaceInHome() {
        document.querySelectorAll("div.mbs_4").forEach(el => {
            let html = el.innerHTML;
            let changed = false;

            if (OLD_NAME && html.includes(OLD_NAME)) {
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

    /************ 详情页处理 ************/
    function replaceInTicketDetail() {
        const ticketInfo = document.querySelector(".ticket-detail_ticketInfo__2knEE");
        if (!ticketInfo) return;

        ticketInfo.querySelectorAll("li, span, div, h2, h3").forEach(el => {
            const txt = el.textContent.trim();
            if (!txt) return;

            // 第一次发现名字就记录
            if (!OLD_NAME && isCandidateName(txt)) {
                OLD_NAME = txt;
            }

            // 替换名字
            if (OLD_NAME && txt === OLD_NAME) {
                el.textContent = NEW_NAME;
            }

            // 替换生日
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
        const span = dd.querySelector("span");
        if (!span) return;

        const dtText = dt.textContent.trim();
        const nameText = span.textContent.trim();

        // 第一次发现名字就记录
        if (!OLD_NAME && isCandidateName(nameText)) {
            OLD_NAME = nameText;
        }

        // 替换名字
        if ((BOOKER_LABEL_RE.test(dtText) || (OLD_NAME && nameText === OLD_NAME)) && OLD_NAME) {
            span.textContent = nameText.replace(OLD_NAME, NEW_NAME);
        }
    }

    function replaceInMyInfo() {
        document.querySelectorAll(".infoListWrap dl").forEach(replaceBookerNameInDL);
    }

    /************ MutationObserver（动态加载处理） ************/
    let timer = null;
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;

                const dls = node.querySelectorAll?.("dl") || [];
                dls.forEach(replaceBookerNameInDL);

                if (node.tagName?.toLowerCase() === "dl") {
                    replaceBookerNameInDL(node);
                }
            });
        });

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

    // 页面初始执行一次
    run();

})();
