// ==UserScript==
// @name         显示 Zread 按钮
// @version      0.0.1
// @description  在 GitHub 仓库页面顶部添加 Zread 按钮，快速跳转对应的 zread.ai 页面
// @author       xiaoyu
// @match        https://github.com/*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1528948
// @downloadURL https://update.greasyfork.org/scripts/553225/%E6%98%BE%E7%A4%BA%20Zread%20%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/553225/%E6%98%BE%E7%A4%BA%20Zread%20%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const BUTTON_ID = 'zreadButton';
    const BUTTON_CONTAINER_SELECTOR = '.pagehead-actions.flex-shrink-0.d-none.d-md-inline';

    function init() {
        createOrUpdateButton();
        document.addEventListener('pjax:end', handlePjaxEnd);
    }

    function handlePjaxEnd() {
        // GitHub 使用 PJAX 导航时重新插入按钮
        createOrUpdateButton();
    }

    function createOrUpdateButton() {
        if (!isRepositoryPage()) {
            removeExistingButton();
            return;
        }

        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        const container = document.querySelector(BUTTON_CONTAINER_SELECTOR);
        if (!container) {
            // 容器尚未渲染时稍后重试
            queueRetry();
            return;
        }

        const buttonNode = buildButtonNode();
        container.insertAdjacentElement('afterbegin', buttonNode);
    }

    function queueRetry() {
        window.setTimeout(createOrUpdateButton, 250);
    }

    function removeExistingButton() {
        const existing = document.getElementById(BUTTON_ID);
        if (existing && existing.parentElement) {
            existing.parentElement.removeChild(existing);
        }
    }

    function isRepositoryPage() {
        const segments = location.pathname.split('/').filter(Boolean);
        return segments.length >= 2;
    }

    function buildButtonNode() {
        const wrapper = document.createElement('li');
        wrapper.id = BUTTON_ID;

        const iconSvg = [
            '<svg class="octicon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
            '    <rect x="1" y="1" width="14" height="14" rx="3" fill="#f6f8fa" stroke="#d0d7de"/>',
            '    <path d="M4.75 3.5H11.25V5.25L7.06 10H11.25V12.5H4.75V10.75L8.94 6H4.75V3.5Z" fill="#0969da"/>',
            '</svg>'
        ].join('');

        const buttonHtml = [
            `<a target="_blank" rel="noopener noreferrer" class="btn btn-sm" href="${buildZreadUrl()}" aria-label="打开对应的 zread 页面">`,
            iconSvg,
            ' Zread',
            '</a>'
        ].join('');

        wrapper.innerHTML = buttonHtml;

        return wrapper;
    }

    function buildZreadUrl() {
        const current = new URL(location.href);
        current.hostname = 'zread.ai';
        current.protocol = 'https:';
        return current.toString();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
