// ==UserScript==
// @name         GitHub Zread.ai Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在github上添加一个zread 的按钮, GitHub DeepWiki Button clone 版
// @author       hello2025
// @match        https://github.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559298/GitHub%20Zreadai%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/559298/GitHub%20Zreadai%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'zread-btn-final';

    function createButton(owner, repo) {
        const link = document.createElement('a');
        link.id = BUTTON_ID;
        link.href = `https://zread.ai/${owner}/${repo}`;
        link.target = '_blank';

        const iconSvg = `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor" class="octicon octicon-book">
                <path d="M0 6.75C0 5.895.672 5.25 1.5 5.25h4.75a.75.75 0 0 1 0 1.5H1.5V11h3.75a.75.75 0 0 1 0 1.5H1.5A1.5 1.5 0 0 1 0 11.25Zm16 0c0-.855-.672-1.5-1.5-1.5h-4.75a.75.75 0 0 1 0 1.5h4.75V11h-3.75a.75.75 0 0 1 0 1.5h3.75A1.5 1.5 0 0 1 16 11.25ZM6.75 7.5a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5Z"></path>
            </svg>
        `;

        const contentSpan = document.createElement('span');
        contentSpan.style.cssText = `
            display: inline-flex;
            align-items: center;
        `;
        contentSpan.innerHTML = `${iconSvg}<span style="margin-left: 8px;">Zread</span>`;

        link.innerHTML = '';
        link.appendChild(contentSpan);

        link.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            padding: 0 12px;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            white-space: nowrap;
            cursor: pointer;
            user-select: none;
            border-radius: 6px;
            border: 1px solid var(--button-default-border, rgba(240, 246, 252, 0.1));
            background-color: var(--button-default-bg, #21262d);
            color: var(--button-default-color, #c9d1d9);
            margin-right: 8px;
            text-decoration: none;
            transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
        `;

        link.addEventListener('mouseenter', () => {
            link.style.borderColor = 'var(--button-default-hover-border, #8b949e)';
            link.style.backgroundColor = 'var(--button-default-hover-bg, #30363d)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.borderColor = 'var(--button-default-border, rgba(240, 246, 252, 0.1))';
            link.style.backgroundColor = 'var(--button-default-bg, #21262d)';
        });

        return link;
    }

    function findCodeButton() {
        const candidates = document.querySelectorAll('button, summary');

        for (const btn of candidates) {
            if (btn.textContent.includes('Code') && btn.offsetParent !== null) {
                if (btn.getAttribute('data-variant') === 'primary' || btn.classList.contains('btn-primary') || btn.classList.contains('types__StyledButton-sc-ws60qy-0')) {
                    return btn;
                }
            }
        }
        return null;
    }

    function run() {
        if (document.getElementById(BUTTON_ID)) return;

        const codeButton = findCodeButton();
        if (!codeButton) return;

        const pathParts = window.location.pathname.split('/');
        if (pathParts.length < 3) return;
        const owner = pathParts[1];
        const repo = pathParts[2];

        const newBtn = createButton(owner, repo);
        if (codeButton.parentElement) {
            codeButton.parentElement.insertBefore(newBtn, codeButton);
        }
    }

    const observer = new MutationObserver(() => {
        requestAnimationFrame(run);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    requestAnimationFrame(run);

})();