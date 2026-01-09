// ==UserScript==
// @name         youtube playlist randomizer - Tubedice
// @namespace    https://playlistshuffle.online/
// @version      1.1
// @description  Add a "True Shuffle" button to YouTube playlists.
// @author       provisional.anonymous@gmail.com
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playlistshuffle.online
// @homepageURL  https://playlistshuffle.online/
// @supportURL   https://playlistshuffle.online/
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561992/youtube%20playlist%20randomizer%20-%20Tubedice.user.js
// @updateURL https://update.greasyfork.org/scripts/561992/youtube%20playlist%20randomizer%20-%20Tubedice.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const BUTTON_ID = 'tubedice-custom-btn';
    const STYLE_ID = 'tubedice-custom-style';

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            #${BUTTON_ID} {
                background-color: #f2f2f2 !important;
                color: #0f0f0f !important;
            }
            html[dark] #${BUTTON_ID},
            html[theme="dark"] #${BUTTON_ID},
            body[dark] #${BUTTON_ID} {
                background-color: #272727 !important;
                color: #ffffff !important;
            }
        `;
        document.head.appendChild(style);
    }

    function injectShuffleButton() {
        injectStyles();
        const params = new URLSearchParams(window.location.search);
        const listId = params.get('list');
        const existingBtn = document.getElementById(BUTTON_ID);

        // 没有播放列表时移除按钮
        if (!listId) {
            if (existingBtn) existingBtn.remove();
            return;
        }

        // 按钮已存在则跳过
        if (existingBtn) return;

        const container = document.querySelector('ytd-watch-metadata #top-level-buttons-computed');
        if (!container) return;

        const myBtn = document.createElement('button');
        myBtn.id = BUTTON_ID;

        // 用 DOM 方式创建内容
        const emoji = document.createTextNode('🎲 ');
        const span = document.createElement('span');
        span.style.marginLeft = '6px';
        span.textContent = 'Tubedice';
        myBtn.appendChild(emoji);
        myBtn.appendChild(span);

        Object.assign(myBtn.style, {
            marginRight: '8px',
            padding: '0 16px',
            height: '36px',
            borderRadius: '18px',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            flexShrink: '0'
        });

        // 点击跳转
        myBtn.onclick = (e) => {
            e.preventDefault();
            window.open(`https://playlistshuffle.online/?ids=${listId}`, '_blank');
        };

        container.prepend(myBtn);
    }

    const observer = new MutationObserver(injectShuffleButton);
    observer.observe(document.body, { childList: true, subtree: true });
    injectShuffleButton();
})();