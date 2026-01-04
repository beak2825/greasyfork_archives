// ==UserScript==
// @name         中国大学MOOC 网页内全屏（支持双击）
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  视频网页内全屏：隐藏顶部导航和tab，支持按钮/快捷键/双击触发
// @match        https://www.icourse163.org/learn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553758/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%20%E7%BD%91%E9%A1%B5%E5%86%85%E5%85%A8%E5%B1%8F%EF%BC%88%E6%94%AF%E6%8C%81%E5%8F%8C%E5%87%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553758/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%20%E7%BD%91%E9%A1%B5%E5%86%85%E5%85%A8%E5%B1%8F%EF%BC%88%E6%94%AF%E6%8C%81%E5%8F%8C%E5%87%BB%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElement('.controlbar_btn.fullscreen.j-fullscreen', (btn) => {
        let isWebFull = false;
        let videoContainer = document.querySelector('.u-edu-h5player'); // 播放器容器
        let navBar = document.querySelector('._10OVs.web-nav-container'); // 顶部导航栏

        function enterWebFull() {
            videoContainer.style.position = 'fixed';
            videoContainer.style.top = '0';
            videoContainer.style.left = '0';
            videoContainer.style.width = '100%';
            videoContainer.style.height = '100%';
            videoContainer.style.zIndex = '9999';

            if (navBar) navBar.style.display = 'none';
            document.body.style.overflow = 'hidden';
            isWebFull = true;
        }

        function exitWebFull() {
            videoContainer.style.position = '';
            videoContainer.style.top = '';
            videoContainer.style.left = '';
            videoContainer.style.width = '';
            videoContainer.style.height = '';
            videoContainer.style.zIndex = '';

            if (navBar) navBar.style.display = '';
            document.body.style.overflow = '';
            isWebFull = false;
        }

        function toggleWebFull() {
            if (!isWebFull) {
                enterWebFull();
            } else {
                exitWebFull();
            }
        }

        // 点击全屏按钮切换
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleWebFull();
        }, true);

        // 双击播放器区域切换
        videoContainer.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleWebFull();
        }, true);

        // 监听键盘：Esc 或 F 键退出
        document.addEventListener('keydown', (e) => {
            if (isWebFull && (e.key === 'Escape' || e.key.toLowerCase() === 'f')) {
                exitWebFull();
            }
        });
    });
})();
