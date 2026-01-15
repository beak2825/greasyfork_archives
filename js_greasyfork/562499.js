// ==UserScript==
// @name         观众横幅屏蔽极速版
// @namespace    http://tampermonkey.net/
// @version      2025-10-29
// @description  屏蔽audiences.me横幅并替换为Logo
// @author       baicai
// @match        https://audiences.me/*
// @match        http://audiences.me/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562499/%E8%A7%82%E4%BC%97%E6%A8%AA%E5%B9%85%E5%B1%8F%E8%94%BD%E6%9E%81%E9%80%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/562499/%E8%A7%82%E4%BC%97%E6%A8%AA%E5%B9%85%E5%B1%8F%E8%94%BD%E6%9E%81%E9%80%9F%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 简化的观察器函数
    function observeAndReplace(selector, replaceFunction) {
        let replaced = false;

        const observer = new MutationObserver(function(mutations) {
            if (replaced) return;

            for (let mutation of mutations) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        // 检查节点本身
                        if (node.classList && node.classList.contains(selector.replace('.', ''))) {
                            replaceFunction(node);
                            replaced = true;
                            observer.disconnect();
                            return;
                        }

                        // 检查子节点
                        if (node.querySelector) {
                            const target = node.querySelector(selector);
                            if (target) {
                                replaceFunction(target);
                                replaced = true;
                                observer.disconnect();
                                return;
                            }
                        }
                    }
                }
            }
        });

        // 立即检查现有元素
        const existing = document.querySelector(selector);
        if (existing) {
            replaceFunction(existing);
            observer.disconnect();
        } else {
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        }
    }

    // 替换函数
    function replaceHeader(element) {
        if (element.getAttribute('data-logo-replaced')) return;
        element.setAttribute('data-logo-replaced', 'true');

        console.log('替换头部元素:', element);

        element.innerHTML = '';

        const img = document.createElement('img');
        img.src = 'https://audiences.me/pic/logos.png';
        img.alt = 'Audiences.me Logo';
        img.width = 300;
        img.height = 81;
        img.style.cssText = 'margin-left: 30px; margin-top: 10px;';

        element.appendChild(img);
    }

    // 主执行逻辑
    if (window.location.hostname.includes('audiences.me')) {
        observeAndReplace('.head', replaceHeader);
    }

})();