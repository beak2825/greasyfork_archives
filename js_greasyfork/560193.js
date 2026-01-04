// ==UserScript==
// @name         Naver Webtoon + Kakao Page
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  add KakaoPage to naver webtoon
// @author       Minjae Kim
// @match        https://m.comic.naver.com/mypage/*
// @license      MIT
// @grant        none
// @icon         https://img.icons8.com/ios_filled/200/FAB005/webtoon-logo.png
// @downloadURL https://update.greasyfork.org/scripts/560193/Naver%20Webtoon%20%2B%20Kakao%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/560193/Naver%20Webtoon%20%2B%20Kakao%20Page.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let iframeContainer = null;

    function createIframe() {
        const container = document.createElement('div');
        container.id = 'kakao-recent-container';
        container.style.cssText = `
            position: fixed;
            top: 50px;
            left: 0;
            width: 100%;
            height: calc(100% - 50px);
            background: #fff;
            z-index: 10001;
            display: none;
            border-top: 1px solid #eee;
        `;

        const iframe = document.createElement('iframe');
        iframe.src = 'https://page.kakao.com/inven/recent';
        iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
        
        container.appendChild(iframe);
        document.body.appendChild(container);
        return container;
    }

    function addButton() {
        const target = document.querySelector('.header_gnb');
        if (!target || document.querySelector('#open-kakao-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'open-kakao-btn';
        btn.innerText = 'K-Recent';
        
        // Styling it to blend into the mobile header
        btn.style.cssText = `
            background: #ffeb00; /* Kakao Yellow */
            color: #3c1e1e;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            margin: 8px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
        `;

        btn.onclick = (e) => {
            e.preventDefault();
            if (!iframeContainer) {
                iframeContainer = createIframe();
            }
            
            const isHidden = iframeContainer.style.display === 'none';
            iframeContainer.style.display = isHidden ? 'block' : 'none';
            btn.innerText = isHidden ? 'Close K' : 'K-Recent';
            btn.style.background = isHidden ? '#333' : '#ffeb00';
            btn.style.color = isHidden ? '#fff' : '#3c1e1e';
        };

        target.appendChild(btn);
    }

    // Run on load
    addButton();

    // Use Observer because Naver Webtoon is a Single Page App (SPA) 
    // and navigation might remove our button
    const observer = new MutationObserver(() => {
        addButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();