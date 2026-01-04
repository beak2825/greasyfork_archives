// ==UserScript==
// @name         toolkit - Theo
// @namespace    http://tampermonkey.net/
// @version      2025-10-15
// @description  toolkit
// @author       Theo·Chan
// @license      AGPL
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/552647/toolkit%20-%20Theo.user.js
// @updateURL https://update.greasyfork.org/scripts/552647/toolkit%20-%20Theo.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('toolkit - Theo');
    //--------------------------复制为Markdown链接----------------------------------------------------//
    // 注册右键菜单项
    GM_registerMenuCommand('复制为Markdown链接', () => {
        const markdownLink = `[${document.title}](${window.location.href})`;
        console.log(markdownLink);
        // 复制到剪贴板
        copyText(markdownLink);
    });
    function copyText(markdownLink) {
        let _nav = window.navigator;
        // 优先使用 Clipboard API
        if (_nav.isPrototypeOf('clipboard') && _nav.clipboard && window.isSecureContext) {
            _nav.clipboard.writeText(markdownLink)
                .then(() => createToast("已复制为Markdown链接"))
                .catch(() => fallbackCopy(markdownLink));
        } else {
            fallbackCopy(markdownLink);
        }
    }

    function fallbackCopy(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            createToast("已复制为Markdown链接:<br/>" + text);
        } catch (err) {
            createToast("复制失败，请手动复制：<br/>" + text, false, 10000);
        }
        document.body.removeChild(textarea);
    }

    // 创建提示框元素
    const createToast = (content, isSuccess = true, timeOut = 1500) => {
        const toast = document.createElement('div');
        toast.innerHTML = content;
        toast.style = `
            position: fixed;
            word-break: break-all;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            color: ${isSuccess ? '#4CAF50' : '#F44336'};
            border-radius: 4px;
            z-index: 99999;
            opacity: 1;
            background-color: ${isSuccess ? 'rgb(34 57 54 / 80%)' : 'rgb(254 225 164 / 80%)'};
            transition: opacity 0.5s ease-out;
        `;
        document.body.appendChild(toast);

        // 触发淡出
        setTimeout(() => {
            toast.style.opacity = 0;
            toast.addEventListener('transitionend', () => {
                toast.remove();
            }, { once: true });
        }, timeOut); // 显示 1.5 秒后开始淡出

        return toast;
    };

}) ();