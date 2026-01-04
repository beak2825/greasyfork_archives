// ==UserScript==
// @name         标注页面收起/展开按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为每个 t-col 添加编号按钮，使用 localStorage 记忆收起状态
// @match        *://qlabel.tencent.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550626/%E6%A0%87%E6%B3%A8%E9%A1%B5%E9%9D%A2%E6%94%B6%E8%B5%B7%E5%B1%95%E5%BC%80%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/550626/%E6%A0%87%E6%B3%A8%E9%A1%B5%E9%9D%A2%E6%94%B6%E8%B5%B7%E5%B1%95%E5%BC%80%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY_PREFIX = 'tcol_btn_state_';
    let globalButtonCounter = 0; // 全局按钮编号

    // 获取本地状态
    function getStoredState(buttonId) {
        return localStorage.getItem(STORAGE_KEY_PREFIX + buttonId) === 'hidden';
    }

    // 保存本地状态
    function setStoredState(buttonId, isHidden) {
        localStorage.setItem(STORAGE_KEY_PREFIX + buttonId, isHidden ? 'hidden' : 'visible');
    }

    function addToggleButtons() {
        const contents = document.querySelectorAll('div.t-col');

        contents.forEach((content) => {
            if (content.dataset.toggleButtonAdded) return;
            content.dataset.toggleButtonAdded = 'true';

            const buttonId = `btn-${globalButtonCounter++}`;

            // 创建 wrapper
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.marginBottom = '10px';
            content.parentNode.insertBefore(wrapper, content);
            wrapper.appendChild(content);

            // 创建按钮
            const button = document.createElement('button');
            button.innerText = '▲';
            button.title = `点击收起/展开（${buttonId}）`;
            button.style.position = 'absolute';
            button.style.top = '50px';
            button.style.right = '5px';
            button.style.zIndex = '9999';
            button.style.cursor = 'pointer';
            button.style.border = 'none';
            button.style.background = '#eee';
            button.style.padding = '2px 6px';
            button.style.fontSize = '12px';
            button.style.borderRadius = '4px';

            // 初始化状态
            const isHidden = getStoredState(buttonId);
            if (isHidden) {
                content.style.display = 'none';
                button.innerText = '▼';
            }

            // 点击事件
            button.addEventListener('click', () => {
                const currentlyHidden = content.style.display === 'none';
                if (currentlyHidden) {
                    content.style.display = '';
                    button.innerText = '▲';
                } else {
                    content.style.display = 'none';
                    button.innerText = '▼';
                }
                setStoredState(buttonId, !currentlyHidden);
            });

            wrapper.appendChild(button);
        });
    }

    // 初始添加
    window.addEventListener('load', () => {
        setTimeout(addToggleButtons, 500);
    });


    // 动态监听 DOM 变化
    const observer = new MutationObserver(() => {
        setTimeout(addToggleButtons, 500);
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
