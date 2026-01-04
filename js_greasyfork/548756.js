// ==UserScript==
// @name         指定超链接跳转新页面打开
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  将指定的链接变为点击跳转新页面打开
// @author       YUQI
// @match           *://yaohuo.me/bbs/*
// @match           *://*.yaohuo.me/bbs/*
// @match           *://nodeseek.com/*
// @match           *://*.nodeseek.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548756/%E6%8C%87%E5%AE%9A%E8%B6%85%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/548756/%E6%8C%87%E5%AE%9A%E8%B6%85%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

//原脚本来自：https://greasyfork.org/zh-CN/scripts/429714-%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5

(function() {
    'use strict';
    targetBlank(); //  修改为新标签页打开
    targetDiscuz(); // 针对 Discuz! 论坛的帖子
    aObserver(); //    针对动态加载内容中的 a 标签


    // 修改为新标签页打开
    function targetBlank() {
        document.head.appendChild(document.createElement('base')).target = '_blank'; // 让所有链接默认以新标签页打开
        Array.from(document.links).forEach(function (_this) { // 排除特殊链接
            if (_this.onclick || _this.href.slice(0,4) != 'http' || _this.getAttribute('href').slice(0,1) === '#') {
                _this.target = '_self'
            }
        })
        document.querySelectorAll('form').forEach(function (_this) { // 排除 form 标签
            if (!_this.target) {_this.target = '_self'}
        });
    }


    // 针对 Discuz! 论坛的帖子
    function targetDiscuz() {
        if (document.querySelector('meta[name="author"][content*="Discuz!"], meta[name="generator"][content*="Discuz!"]') || document.querySelector('body[id="nv_forum"][class^="pg_"][onkeydown*="27"]') || document.querySelector('body[id="nv_search"][onkeydown*="27"]') || (document.querySelector('a[href*="www.discuz.net"]') && document.querySelector('a[href*="www.discuz.net"]').textContent.indexOf('Discuz!') > -1) || (document.getElementById('ft') && document.getElementById('ft').textContent.indexOf('Discuz!') > -1)) {
            let atarget = document.getElementById('atarget');
            if (atarget && atarget.className.indexOf('atarget_1') === -1) { // 强制勾选 [新窗]
                atarget.click();
            }
        }
    }


    // 针对动态加载内容中的 a 标签
    function aObserver() {
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    if (target.tagName === 'A') {
                        if (target.onclick || target.href.slice(0,4) != 'http' || target.getAttribute('href').slice(0,1) === '#') {
                            target.target = '_self'
                        }
                    } else {
                        document.querySelectorAll('a').forEach(function (_this) {
                            if (_this.onclick || _this.href.slice(0,4) != 'http' || _this.getAttribute('href').slice(0,1) === '#') {
                                _this.target = '_self'
                            }
                        });
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }
})();