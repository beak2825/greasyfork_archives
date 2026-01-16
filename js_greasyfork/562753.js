// ==UserScript==
// @name         웨이브 회차 수집기
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  웨이브 웹페이지에서 "회차_날짜 에피소드명"을 클립보드로 복사
// @author       DongHaerang
// @license      CC BY-NC-SA 4.0
// @match        https://www.wavve.com/player/vod?*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/562753/%EC%9B%A8%EC%9D%B4%EB%B8%8C%20%ED%9A%8C%EC%B0%A8%20%EC%88%98%EC%A7%91%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/562753/%EC%9B%A8%EC%9D%B4%EB%B8%8C%20%ED%9A%8C%EC%B0%A8%20%EC%88%98%EC%A7%91%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 스타일 설정
    GM_addStyle(`
        #filter-button-container-new {
            position: fixed; top: 0px; left: 60%; transform: translateX(-50%);
            z-index: 9999; display: flex; gap: 10px;
        }
        .filter-btn-new {
            background-color: #0073e6; color: white; border: none;
            padding: 0px 8px; height: 30px; line-height: 30px;
            border-radius: 5px; font-size: 14px; font-weight: bold;
            cursor: pointer; transition: background-color 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: flex; align-items: center; justify-content: center;
        }
        .filter-btn-new:hover { background-color: #005bb5; }
        #copy-notification-new {
            position: fixed; top: 60px; left: 50%; transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.75); color: white;
            padding: 15px 30px; border-radius: 8px; z-index: 10000;
            font-size: 16px; opacity: 0; transition: opacity 0.3s ease-in-out;
            pointer-events: none; text-align: center; max-width: 90%; word-break: break-all;
        }
    `);

    const showNotification = (message) => {
        let notify = document.getElementById('copy-notification-new') || document.createElement('div');
        if (!notify.id) { notify.id = 'copy-notification-new'; document.body.appendChild(notify); }
        notify.innerText = message;
        notify.style.opacity = '1';
        setTimeout(() => { notify.style.opacity = '0'; }, 1000);
    };

    // 정렬 토글 (ALT+Q)
    const toggleSortOrder = () => {
        const sortBtn = document.querySelector('button.button[data-v-29570598]');
        if (sortBtn) {
            const urlParams = new URLSearchParams(window.location.search);
            const currentOrder = urlParams.get('orderby');
            if (currentOrder === 'old') { showNotification('최신순으로 정렬합니다.'); }
            else { showNotification('오래된 순으로 정렬합니다.'); }
            sortBtn.click();
        } else { showNotification('❌ 정렬 버튼을 찾을 수 없습니다.'); }
    };

    // 페이지 이동 (ALT+A, ALT+S)
    const navigatePage = (direction) => {
        const currentPageEl = document.querySelector('.paging-type01 a.on');
        let currentPage = 1;
        if (currentPageEl) currentPage = parseInt(currentPageEl.innerText);
        let targetPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
        if (targetPage < 1) { showNotification('첫 번째 페이지입니다.'); return; }
        const url = new URL(window.location.href);
        url.searchParams.set('page', targetPage);
        window.location.href = url.toString();
    };

    // 데이터 수집 로직 (ALT+E) - ✨ 빈 줄 추가 수정됨
    const collectWavveData = () => {
        const titleItems = document.querySelectorAll('.title1.line2');
        const dateItems = document.querySelectorAll('.title2.line1');

        if (titleItems.length === 0) { showNotification('❌ 목록을 찾을 수 없습니다.'); return; }

        let results = [];
        for (let i = 0; i < titleItems.length; i++) {
            const fullTitle = titleItems[i].innerText.trim();
            const dotIndex = fullTitle.indexOf('.');
            if (dotIndex !== -1) {
                const epNum = fullTitle.substring(0, dotIndex).trim();
                const epTitle = fullTitle.substring(dotIndex + 1).trim();
                let dateText = "0000-00-00";
                if (dateItems[i]) {
                    const dateMatch = dateItems[i].innerText.match(/\d{4}-\d{2}-\d{2}/);
                    if (dateMatch) dateText = dateMatch[0];
                }
                results.push(`${epNum}_${dateText} ${epTitle}`);
            }
        }

        if (results.length > 0) {
            // ✨ 마지막에 \n을 더해서 빈 줄을 한 줄 추가합니다.
            const finalString = results.join('\n') + '\n';
            GM_setClipboard(finalString);
            showNotification(`✅ ${results.length}개 회차 복사 완료! (빈 줄 포함)`);
        }
    };

    const createButton = () => {
        if (document.getElementById('filter-button-container-new')) return;
        const container = document.createElement('div');
        container.id = 'filter-button-container-new';
        const btn = document.createElement('button');
        btn.className = 'filter-btn-new';
        btn.innerText = '회차';
        btn.onclick = collectWavveData;
        container.appendChild(btn);
        document.body.appendChild(container);
    };

    window.addEventListener('keydown', (e) => {
        if (e.altKey) {
            const key = e.key.toLowerCase();
            if (key === 'e' || e.key === 'ㄷ') { e.preventDefault(); collectWavveData(); }
            else if (key === 'a' || e.key === 'ㅁ') { e.preventDefault(); navigatePage('prev'); }
            else if (key === 's' || e.key === 'ㄴ') { e.preventDefault(); navigatePage('next'); }
            else if (key === 'q' || e.key === 'ㅂ') { e.preventDefault(); toggleSortOrder(); }
        }
    });

    const observer = new MutationObserver(() => {
        if (document.querySelector('.title1.line2')) createButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();