// ==UserScript==
// @name         QRZ.COM chinese flag fix,QRZ,FLAG,NAME,qrz
// @name:zh 	 QRZ.COM一个中国国旗修正,QRZ,FLAG,NAME
// @author       bi1rfv@qq.com
// @icon         https://static.qrz.com/static/qrz/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  QRZ.COM one chinese flag fix,QRZ,FLAG,NAME,qrz
// @description:zh QRZ.COM一个中国国旗修正,QRZ,FLAG,NAME
// @match        *://*.qrz.com/*
// @match        *://qrz.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555816/QRZCOM%20chinese%20flag%20fix%2CQRZ%2CFLAG%2CNAME%2Cqrz.user.js
// @updateURL https://update.greasyfork.org/scripts/555816/QRZCOM%20chinese%20flag%20fix%2CQRZ%2CFLAG%2CNAME%2Cqrz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 替换背景图片URL
    function replaceBackgroundImages() {
        const elements = document.querySelectorAll('[style*="background-image"]');
        elements.forEach(element => {
            const style = element.getAttribute('style');
            if (style && style.includes('https://static.qrz.com/static/flags-iso/flat/24/TW.png')) {
                const newStyle = style.replace(
                    'https://static.qrz.com/static/flags-iso/flat/24/TW.png',
                    'https://static.qrz.com/static/flags-iso/flat/24/CN.png'
                );
                element.setAttribute('style', newStyle);
            }
        });

        const pageElements = document.querySelectorAll('img[id="flg"]');
        pageElements.forEach(element => {
            const style = element.getAttribute('src');
            if (style && style.includes('https://static.qrz.com/static/flags-iso/flat/32/TW.png')) {
                const newStyle = style.replace(
                    'https://static.qrz.com/static/flags-iso/flat/32/TW.png',
                    'https://static.qrz.com/static/flags-iso/flat/32/CN.png'
                );
                element.setAttribute('src', newStyle);
            }
        });
    }

    // 替换国家名称
    function replaceCountryNames() {
        const elements = document.querySelectorAll('td.td_country2.rxData');
        elements.forEach(element => {
            if (element.textContent.trim() === 'Taiwan' && element.getAttribute('title') === 'Taiwan') {
                element.textContent = 'China Taiwan';
            }
        });
    }

    // 使用MutationObserver监听DOM变化
    function observeChanges() {
        const observer = new MutationObserver(function(mutations) {
            let shouldRun = false;
            for (let mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldRun = true;
                    break;
                }
            }
            if (shouldRun) {
                replaceBackgroundImages();
                replaceCountryNames();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化执行
    replaceBackgroundImages();
    replaceCountryNames();
    observeChanges();

    // 监听URL变化（针对单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                replaceBackgroundImages();
                replaceCountryNames();
            }, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
})();