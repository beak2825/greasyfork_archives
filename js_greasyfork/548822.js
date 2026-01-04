// ==UserScript==
// @name         推特一键复制
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  把转发按钮替换成复制按钮，一键复制推文内容，点击后显示打勾图标
// @author       chengdu
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548822/%E6%8E%A8%E7%89%B9%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/548822/%E6%8E%A8%E7%89%B9%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('推特复制脚本 v2.3 启动啦～');

    function copyToClipboard(text, buttonElement) {
        navigator.clipboard.writeText(text).then(() => {
            changeIconToCheck(buttonElement);
        }).catch(err => {
            console.error('复制失败 Copy Failed:', err);
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            changeIconToCheck(buttonElement);
        });
    }

    // 把图标改为打勾 Change Icon to Checkmark
    function changeIconToCheck(buttonElement) {
        const iconSvg = buttonElement.querySelector('svg');
        if (iconSvg) {
            iconSvg.innerHTML = `
                <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" fill="currentColor"/>
            `;
            iconSvg.style.transition = 'all 0.3s ease';
            iconSvg.style.color = '#1d9bf0';

            // 2秒后恢复原始图标 Restore Original Icon After 2s
            setTimeout(() => {
                iconSvg.innerHTML = `
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                `;
                iconSvg.style.color = '#536471';
            }, 2000);
        }
    }

    function extractTweetContent(tweetElement) {
        const textElement = tweetElement.querySelector('[data-testid="tweetText"]');
        let tweetText = textElement ? textElement.innerText : '';
        const userNameElement = tweetElement.querySelector('[data-testid="User-Name"]');
        const userName = userNameElement ? userNameElement.innerText.split('@')[0] : '';
        const timeElement = tweetElement.querySelector('time');
        const timeText = timeElement ? timeElement.getAttribute('datetime') : '';
        let copyContent = '';
        if (userName) copyContent += `👤 ${userName}\n`;
        if (tweetText) copyContent += `📝 ${tweetText}\n`;
        if (timeText) copyContent += `🕐 ${new Date(timeText).toLocaleString()}\n`;
        copyContent += `🔗 ${window.location.href}`;
        return copyContent || 'Failed to get tweet content';
    }

    function hideRetweetCounts() {
        const copyButtons = document.querySelectorAll('[data-testid="copy-tweet"]');
        copyButtons.forEach(button => {
            const countContainer = button.querySelector('span[data-testid="app-text-transition-container"]');
            if (countContainer && !countContainer.getAttribute('data-moe-hidden')) {
                countContainer.style.display = 'none';
                countContainer.setAttribute('data-moe-hidden', 'true');
            }
            const allSpans = button.querySelectorAll('span');
            allSpans.forEach(span => {
                if (span.textContent.match(/^\d+$/) && !span.getAttribute('data-moe-hidden')) {
                    span.style.display = 'none';
                    span.setAttribute('data-moe-hidden', 'true');
                }
            });
        });
    }

    function replaceRetweetButtons() {
        const retweetButtons = document.querySelectorAll('[data-testid="retweet"]');
        retweetButtons.forEach(button => {
            if (button.getAttribute('data-moe-replaced') === 'true') return;
            const tweetElement = button.closest('[data-testid="tweet"]');
            if (!tweetElement) return;
            const copyButton = button.cloneNode(true);
            copyButton.setAttribute('data-moe-replaced', 'true');
            copyButton.setAttribute('data-testid', 'copy-tweet');
            const iconSvg = copyButton.querySelector('svg');
            if (iconSvg) {
                iconSvg.innerHTML = `
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                `;
                iconSvg.style.color = '#536471';
            }
            copyButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const content = extractTweetContent(tweetElement);
                copyToClipboard(content, copyButton);
                copyButton.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    copyButton.style.transform = 'scale(1)';
                }, 150);
            });
            copyButton.addEventListener('mouseenter', () => {
                copyButton.style.transition = 'all 0.2s ease';
                copyButton.style.transform = 'scale(1.05)';
            });
            copyButton.addEventListener('mouseleave', () => {
                copyButton.style.transform = 'scale(1)';
            });
            button.parentNode.replaceChild(copyButton, button);
        });
        hideRetweetCounts();
    }

    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const hasNewTweets = Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === 1 && (node.querySelector && node.querySelector('[data-testid="retweet"]'))
                );
                if (hasNewTweets) shouldUpdate = true;
            }
        });
        if (shouldUpdate) {
            setTimeout(replaceRetweetButtons, 100);
        }
    });

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(startObserving, 1000);
            });
        } else {
            setTimeout(startObserving, 1000);
        }
    }

    function startObserving() {
        replaceRetweetButtons();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log('系统启动完成～开始监听推文变化！');
        setInterval(() => {
            replaceRetweetButtons();
        }, 2000);
    }

    init();
})();
