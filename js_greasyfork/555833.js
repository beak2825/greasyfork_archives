// ==UserScript==
// @name         Restore Clipboard (剪贴板消毒)
// @namespace    https://github.com/harryhare
// @version      0.5.0
// @description  Remove annoying copyright words on various Chinese sites
// @author       tysheng
// @license      GPL 3.0
// @icon         https://raw.githubusercontent.com/harryhare/userscript/master/index.png
// @match        https://*.zhihu.com/**
// @match        https://*.jianshu.com/**
// @match        https://*.douban.com/**
// @match        https://*.csdn.net/**
// @match        https://*.ftchinese.com/**
// @match        https://*.1point3acres.com/**
// @match        https://blog.skk.moe/**
// @match        https://www.bilibili.com/**
// @match        https://juejin.cn/**
// @match        https://*.nowcoder.com/**
// @match        https://*.mbalib.com/**
// @match        http://www.360doc.com/**
// @match        https://www.360doc.com/**
// @match        https://*.geekbang.org/**
// @match        https://xueqiu.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555833/Restore%20Clipboard%20%28%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%B6%88%E6%AF%92%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555833/Restore%20Clipboard%20%28%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%B6%88%E6%AF%92%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const siteHandlers = {
        douban: () => {
            document.querySelectorAll('div#link-report .note, div.review-content.clearfix')
                .forEach(el => el.oncopy = e => e.stopPropagation());
        },
        csdn: () => {
            document.querySelectorAll('div#article_content')
                .forEach(el => el.oncopy = e => e.stopPropagation());
        },
        xueqiu: () => {
            document.querySelectorAll('article.article__bd')
                .forEach(el => el.oncopy = e => e.stopPropagation());
        },
        juejin: () => {
            document.querySelectorAll('div.article-content div.markdown-body')
                .forEach(el => el.oncopy = e => e.stopPropagation());
        },
        doc360: () => {
            document.querySelectorAll('div.doc360article_content')
                .forEach(el => el.oncopy = e => e.stopPropagation());
        },
        bilibili: () => {
            document.querySelectorAll('div#article-content')
                .forEach(el => el.oncopy = e => e.stopPropagation());
        },
        geekbang: () => {
            let lastSelection, lastRanges = [], lastCopyFlag = false;

            document.onselectionchange = () => {
                if (lastCopyFlag) { lastCopyFlag = false; return; }
                const sel = window.getSelection();
                lastSelection = sel.toString();
                lastRanges = [];
                for (let i = 0; i < sel.rangeCount; i++) lastRanges.push(sel.getRangeAt(i));
            };

            document.body.oncopy = async (e) => {
                lastCopyFlag = true;
                const sel = window.getSelection();
                sel.removeAllRanges();
                lastRanges.forEach(r => sel.addRange(r));
            };
        }
    };

    const url = location.href;

    if (/https:\/\/[a-z]+\.douban\.com/.test(url)) siteHandlers.douban();
    else if (/https:\/\/[a-z]+\.csdn\.net/.test(url)) siteHandlers.csdn();
    else if (/https:\/\/xueqiu\.com/.test(url)) siteHandlers.xueqiu();
    else if (/https:\/\/[a-z]+\.bilibili\.com/.test(url)) siteHandlers.bilibili();
    else if (/https:\/\/juejin\.cn/.test(url)) siteHandlers.juejin();
    else if (/https?:\/\/www\.360doc\.com/.test(url)) siteHandlers.doc360();
    else if (/https:\/\/[a-z]+\.geekbang\.org/.test(url)) siteHandlers.geekbang();
    else {
        document.body.oncopy = e => e.stopPropagation();
    }
})();
