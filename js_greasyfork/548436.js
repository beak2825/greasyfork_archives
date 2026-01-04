// ==UserScript==
// @name         Telegram 电话号码隐藏
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  隐藏Telegram设置界面的电话号码
// @author       Furina-Cute
// @match        https://web.telegram.org/a/*
// @match        https://web.telegram.org/k/*
// @icon         https://web.telegram.org/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548436/Telegram%20%E7%94%B5%E8%AF%9D%E5%8F%B7%E7%A0%81%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/548436/Telegram%20%E7%94%B5%E8%AF%9D%E5%8F%B7%E7%A0%81%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .phone-hidden .title,
        .phone-hidden .row-title {
            filter: blur(5px);
            cursor: pointer;
            user-select: none;
        }
        .phone-visible .title,
        .phone-visible .row-title {
            filter: none;
        }
    `;
    document.head.appendChild(style);

    // 检查元素是否为电话号码
    const isPhoneElement = (element) => {
        if (!element) return false;

        const text = element.textContent || '';
        // 检查是否包含国际电话号码格式
        return /^\+\d{1,4}\s?\d{1,4}\s?\d{1,4}\s?\d{1,4}$/.test(text.trim());
    };

    // 处理电话号码显示/隐藏
    const processPhoneNumber = () => {
        // A版选择器
        const aElements = document.querySelectorAll('.ChatExtra .ListItem .multiline-item');

        // K版选择器 - 查找包含电话号码的行
        const kRows = document.querySelectorAll('.row.row-with-icon.row-with-padding');
        const kElements = [];

        kRows.forEach(row => {
            const titleElement = row.querySelector('.row-title');
            if (titleElement && isPhoneElement(titleElement)) {
                kElements.push(row);
            }
        });

        const allElements = [...aElements, ...kElements];

        allElements.forEach(element => {
            if (element.classList.contains('phone-processed')) return;

            let titleElement = null;

            // 确定是A版还是K版
            if (element.classList.contains('multiline-item')) {
                // A版
                titleElement = element.querySelector('.title');
            } else {
                // K版
                titleElement = element.querySelector('.row-title');
            }

            if (titleElement && isPhoneElement(titleElement)) {
                element.classList.add('phone-hidden', 'phone-processed');

                // 添加双击事件
                element.addEventListener('dblclick', function(e) {
                    e.stopPropagation();

                    // 显示电话号码
                    this.classList.remove('phone-hidden');
                    this.classList.add('phone-visible');

                    // 2秒后自动隐藏
                    setTimeout(() => {
                        this.classList.remove('phone-visible');
                        this.classList.add('phone-hidden');
                    }, 2000);
                });
            }
        });
    };

    // 初始执行
    processPhoneNumber();

    // 监听DOM变化
    const observer = new MutationObserver(processPhoneNumber);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();