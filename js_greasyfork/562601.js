// ==UserScript==
// @name         创客贴模板去水印
// @namespace    https://www.qyccc.com/
// @version      1.0
// @description  用于创客贴去除模板水印，原作者清语尘，将其进行了修复
// @match        *://*.chuangkit.com/*
// @icon         https://photogallery.oss-cn-hangzhou.aliyuncs.com/photo/1111552255990557/53220d76cb7fa499a4bcd8b9717e9c7addf89.去水印.png
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562601/%E5%88%9B%E5%AE%A2%E8%B4%B4%E6%A8%A1%E6%9D%BF%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/562601/%E5%88%9B%E5%AE%A2%E8%B4%B4%E6%A8%A1%E6%9D%BF%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton() {
        if (document.getElementById('qycbtn')) return;

        const btn = document.createElement('div');
        btn.id = 'qycbtn';
        btn.innerHTML = '✨ 去水印';
        btn.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 12px 20px;
            border-radius: 30px;
            cursor: pointer;
            z-index: 999999;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
        `;

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-50%) scale(1.05)';
            btn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(-50%)';
            btn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        });

        btn.addEventListener('click', () => {
            btn.style.transform = 'translateY(-50%) scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'translateY(-50%) scale(1.05)';
            }, 150);
            removeWatermark();
        });

        document.body.appendChild(btn);
    }

    function removeWatermark() {
        document.querySelectorAll('div').forEach(div => {
            if (div.textContent.includes('移除水印，畅享高清模板')) {
                const hasChildWithText = Array.from(div.querySelectorAll('div')).some(
                    child => child.textContent.includes('移除水印，畅享高清模板')
                );
                if (!hasChildWithText) {
                    div.remove();
                }
            }
        });

        document.querySelectorAll('.canvas .water-mark').forEach(el => {
            el.removeAttribute('class');
            el.removeAttribute('style');
        });
    }

    function init() {
        createButton();
        const observer = new MutationObserver(() => {
            if (!document.getElementById('qycbtn')) {
                createButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();