// ==UserScript==
// @name         Vercel 汉化脚本 - 中文化界面
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  将 Vercel 界面翻译为中文。采用逻辑与词库分离设计，修复 React Hydration Error #418。
// @author       YourName
// @match        *://vercel.com/*
// @match        *://*.vercel.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vercel.com
// @require      https://update.greasyfork.org/scripts/564230/Vercel-i18n-Data.js
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564229/Vercel%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC%20-%20%E4%B8%AD%E6%96%87%E5%8C%96%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/564229/Vercel%20%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC%20-%20%E4%B8%AD%E6%96%87%E5%8C%96%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从词库库脚本中获取数据
    const i18n = window.VERCEL_I18N_DATA || {};

    const blacklist = ['CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'];
    const blacklistClasses = ['geist-code', 'monaco-editor', 'shiki'];

    function translate(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue.trim();
            if (i18n[text]) {
                node.nodeValue = node.nodeValue.replace(text, i18n[text]);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (blacklist.includes(node.tagName)) return;
            if (node.classList && Array.from(node.classList).some(cls => blacklistClasses.includes(cls))) return;

            node.childNodes.forEach(translate);

            if (node.placeholder && i18n[node.placeholder]) {
                node.placeholder = i18n[node.placeholder];
            }
            if (node.getAttribute('aria-label') && i18n[node.getAttribute('aria-label')]) {
                node.setAttribute('aria-label', i18n[node.getAttribute('aria-label')]);
            }
        }
    }

    function init() {
        console.log("Vercel 汉化：检测到词库，开始翻译...");
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                mutation.addedNodes.forEach(translate);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        translate(document.body);
    }

    // 延迟 2.5 秒以确保 Next.js/React 完成水合，彻底避免 #418 错误
    setTimeout(() => {
        if (Object.keys(i18n).length === 0) {
            console.error("Vercel 汉化：词库加载失败，请检查脚本引用的 @require 链接是否正常。");
        } else {
            init();
        }
    }, 2500);

})();