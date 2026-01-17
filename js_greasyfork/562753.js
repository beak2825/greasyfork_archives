// ==UserScript==
// @name         OTT 회차 수집기
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  OTT에서 "회차_날짜 에피소드명].mkv" 형식으로 정보를 수집합니다.
// @author       DongHaerang
// @license      CC BY-NC-SA 4.0
// @match        https://www.wavve.com/player/vod?*
// @match        https://www.tving.com/contents/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/562753/OTT%20%ED%9A%8C%EC%B0%A8%20%EC%88%98%EC%A7%91%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/562753/OTT%20%ED%9A%8C%EC%B0%A8%20%EC%88%98%EC%A7%91%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 공통 스타일 설정 (우리 친구의 디자인 가이드 반영)
    GM_addStyle(`
        #filter-button-container {
            position: fixed; top: 0px; left: 60%; transform: translateX(-50%);
            z-index: 9999; display: flex; gap: 10px;
        }
        .filter-btn {
            background-color: #0073e6; color: white; border: none;
            padding: 0px 8px; height: 30px; line-height: 30px;
            border-radius: 5px; font-size: 14px; font-weight: bold;
            cursor: pointer; transition: background-color 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: flex; align-items: center; justify-content: center;
        }
        .filter-btn:hover { background-color: #005bb5; }
        #copy-notification {
            position: fixed; top: 60px; left: 50%; transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.75); color: white;
            padding: 15px 30px; border-radius: 8px; z-index: 10000;
            font-size: 16px; opacity: 0; transition: opacity 0.3s ease-in-out;
            pointer-events: none; text-align: center; max-width: 90%; word-break: break-all;
        }
    `);

    // 2. 공통 알림창 함수
    const showNotification = (message) => {
        let notify = document.getElementById('copy-notification') || document.createElement('div');
        if (!notify.id) { notify.id = 'copy-notification'; document.body.appendChild(notify); }
        notify.innerText = message;
        notify.style.opacity = '1';
        setTimeout(() => { notify.style.opacity = '0'; }, 1000);
    };

    // 3. [사이트 감지] 현재 어디에 접속했는지 확인하는 함수
    const getSiteType = () => {
        const host = window.location.hostname;
        if (host.includes('wavve.com')) return 'wavve';
        if (host.includes('tving.com')) return 'tving';
        return null;
    };

    // 4. [기능] 데이터 수집 (ALT+E)
    const collectData = () => {
        const site = getSiteType();
        let results = [];
        let titles, infos;

        if (site === 'wavve') {
            titles = document.querySelectorAll('.title1.line2');
            infos = document.querySelectorAll('.title2.line1');
        } else if (site === 'tving') {
            titles = document.querySelectorAll('.item__title');
            infos = document.querySelectorAll('.item__subinfo');
        }

        if (!titles || titles.length === 0) {
            showNotification('❌ 목록을 찾을 수 없습니다.');
            return;
        }

        for (let i = 0; i < titles.length; i++) {
            const fullTitle = titles[i].innerText.trim();
            const dotIndex = fullTitle.indexOf('.');

            if (dotIndex !== -1) {
                // 회차 번호 2자리 보정
                const epNum = fullTitle.substring(0, dotIndex).trim().padStart(2, '0');
                const epTitle = fullTitle.substring(dotIndex + 1).trim();
                let dateText = "0000-00-00";

                if (infos[i]) {
                    const infoText = infos[i].innerText;
                    if (site === 'wavve') {
                        const dateMatch = infoText.match(/\d{4}-\d{2}-\d{2}/);
                        if (dateMatch) dateText = dateMatch[0];
                    } else if (site === 'tving') {
                        const rawDate = infoText.split('|')[0].trim();
                        dateText = rawDate.replace(/\./g, '-');
                    }
                }
                results.push(`${epNum}_${dateText} ${epTitle}].mkv`.trim());
            }
        }

        if (results.length > 0) {
            const finalString = results.join('\n').trim() + '\n';
            GM_setClipboard(finalString);
            showNotification(`✅ ${results.length}개 회차 복사 완료!`);
        }
    };

    // 5. [기능] 정렬 토글 (ALT+Q)
    const toggleSort = () => {
        const site = getSiteType();
        if (site === 'wavve') {
            const sortBtn = document.querySelector('button.button[data-v-29570598]');
            if (sortBtn) {
                const urlParams = new URLSearchParams(window.location.search);
                showNotification(urlParams.get('orderby') === 'old' ? '최신순으로 정렬합니다.' : '오래된 순으로 정렬합니다.');
                sortBtn.click();
            }
        } else if (site === 'tving') {
            const buttons = document.querySelectorAll('.etwby4r2 button');
            if (buttons.length >= 2) {
                buttons.forEach(btn => {
                    if (!btn.classList.contains('click_on')) {
                        showNotification(btn.innerText.includes('최신') ? "최신순으로 정렬합니다." : "오래된 순으로 정렬합니다.");
                        btn.click();
                    }
                });
            }
        }
    };

    // 6. [기능] 페이지 이동 (ALT+A, ALT+S)
    const navigate = (direction) => {
        const url = new URL(window.location.href);
        let currentPage = 1;

        if (getSiteType() === 'wavve') {
            const onPage = document.querySelector('.paging-type01 a.on');
            if (onPage) currentPage = parseInt(onPage.innerText);
        } else {
            currentPage = parseInt(url.searchParams.get('page')) || 1;
        }

        let targetPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
        if (targetPage < 1) { showNotification('첫 번째 페이지입니다.'); return; }

        url.searchParams.set('page', targetPage);
        window.location.href = url.toString();
    };

    // 7. 버튼 및 이벤트 설정
    const init = () => {
        if (!document.getElementById('filter-button-container')) {
            const container = document.createElement('div');
            container.id = 'filter-button-container';
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.innerText = '회차';
            btn.onclick = collectData;
            container.appendChild(btn);
            document.body.appendChild(container);
        }
    };

    window.addEventListener('keydown', (e) => {
        if (e.altKey) {
            const key = e.key.toLowerCase();
            if (key === 'e' || e.key === 'ㄷ') { e.preventDefault(); collectData(); }
            else if (key === 'a' || e.key === 'ㅁ') { e.preventDefault(); navigate('prev'); }
            else if (key === 's' || e.key === 'ㄴ') { e.preventDefault(); navigate('next'); }
            else if (key === 'q' || e.key === 'ㅂ') { e.preventDefault(); toggleSort(); }
        }
    });

    const observer = new MutationObserver(() => {
        const site = getSiteType();
        if ((site === 'wavve' && document.querySelector('.title1.line2')) ||
            (site === 'tving' && document.querySelector('.item__title'))) {
            init();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();