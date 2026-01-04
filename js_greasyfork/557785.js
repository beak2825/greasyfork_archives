// ==UserScript==
// @name         B站直播快捷键增强
// @namespace    https://space.bilibili.com/12309490
// @version      0.3.2
// @description  允许你使用一系列快捷键进行简单的直播交互
// @author       WinTP
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557785/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557785/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', event => {
        let danmakuInput = document.querySelector('textarea.chat-input');

        if (event.key === 'Escape')
        {
            danmakuInput.blur();
            return;
        }

        if (document.activeElement === document.querySelector('textarea.chat-input')) return;
        switch (event.key.toLowerCase()) {
            case ' ':
                danmakuInput.focus();
                event.preventDefault();
                break;
            case 'e':
                document.querySelector('.emoticons-panel').click();
                break;
            case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case '0':
                if (document.querySelector('.emoticons-pane') !== null) {
                    let emoticonIndex = parseInt(event.key);
                    if (emoticonIndex === 0)
                        emoticonIndex = 9;
                    else
                        emoticonIndex--;
                    const emoticonList = document.querySelectorAll('.emoticons-pane .img-pane:not([style*="display: none;"]) .emoticon-item');
                    if (emoticonIndex < emoticonList.length)
                        emoticonList[emoticonIndex].click();
                }
                break;
            case 'arrowleft': case 'arrowright':
                if (document.querySelector('.emoticons-pane') !== null) {
                    const emoticonSetList = [...document.querySelectorAll('.emoticons-pane .tab-pane-item')];
                    const currentSetIndex = emoticonSetList.indexOf(document.querySelector('.emoticons-pane .tab-pane-item.active'));
                    let nextSetIndex = currentSetIndex;
                    if (event.key === 'ArrowLeft')
                        nextSetIndex = Math.max(0, nextSetIndex - 1);
                    else
                        nextSetIndex = Math.min(emoticonSetList.length - 1, nextSetIndex + 1);
                    if (nextSetIndex !== currentSetIndex)
                        emoticonSetList[nextSetIndex].click();
                }
                break;
        }
    });
})();

