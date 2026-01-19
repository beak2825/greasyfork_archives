// ==UserScript==
// @name         OTT 회차 수집기
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  OTT에서 "회차_날짜 에피소드명" 형식으로 정보를 수집합니다.
// @author       DongHaerang
// @license      CC BY-NC-SA 4.0
// @match        https://www.wavve.com/player/vod?*
// @match        https://www.tving.com/contents/*
// @match        https://www.coupangplay.com/titles/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/562753/OTT%20%ED%9A%8C%EC%B0%A8%20%EC%88%98%EC%A7%91%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/562753/OTT%20%ED%9A%8C%EC%B0%A8%20%EC%88%98%EC%A7%91%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 공통 스타일 설정
    GM_addStyle(`
        #filter-button-container {
            position: fixed; top: 10px; left: 60%; transform: translateX(-50%);
            z-index: 999999; display: flex; gap: 10px;
        }
        .filter-btn {
            background-color: #0073e6; color: white; border: 1px solid white;
            padding: 5px 12px; height: auto; line-height: 1.2;
            border-radius: 5px; font-size: 14px; font-weight: bold;
            cursor: pointer; transition: background-color 0.2s;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        .filter-btn:hover { background-color: #005bb5; }
        #copy-notification {
            position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.85); color: white;
            padding: 15px 30px; border-radius: 8px; z-index: 1000000;
            font-size: 16px; opacity: 0; transition: opacity 0.3s;
            pointer-events: none; text-align: center;
        }
    `);

    const showNotification = (message) => {
        let notify = document.getElementById('copy-notification') || document.createElement('div');
        if (!notify.id) { notify.id = 'copy-notification'; document.body.appendChild(notify); }
        notify.innerText = message;
        notify.style.opacity = '1';
        setTimeout(() => { notify.style.opacity = '0'; }, 1500);
    };

    const getSiteType = () => {
        const host = window.location.hostname;
        if (host.includes('wavve.com')) return 'wavve';
        if (host.includes('tving.com')) return 'tving';
        if (host.includes('coupangplay.com')) return 'coupang';
        return null;
    };

    const collectData = () => {
        const site = getSiteType();
        let results = [];
        let titles = [], infos = [];

        if (site === 'wavve') {
            titles = document.querySelectorAll('.title1.line2');
            infos = document.querySelectorAll('.title2.line1');
        } else if (site === 'tving') {
            titles = document.querySelectorAll('.item__title');
            infos = document.querySelectorAll('.item__subinfo');
        } else if (site === 'coupang') {
            titles = document.querySelectorAll('[data-cy="episode-title"]');
            infos = document.querySelectorAll('[class*="episodeDate"]');
        }

        if (titles.length === 0) {
            showNotification('❌ 수집할 목록이 보이지 않습니다.');
            return;
        }

        for (let i = 0; i < titles.length; i++) {
            const fullTitle = titles[i].innerText.trim();
            let epNum = "", epTitle = "";

            if (site === 'coupang') {
                const episodeOnlyMatch = fullTitle.match(/^(\d{1,4})회$/);
                if (episodeOnlyMatch) {
                    epNum = episodeOnlyMatch[1].padStart(2, '0');
                    epTitle = "";
                }
                else if (fullTitle.indexOf('.') !== -1) {
                    const dotIndex = fullTitle.indexOf('.');
                    epNum = fullTitle.substring(0, dotIndex).trim().padStart(2, '0');
                    epTitle = fullTitle.substring(dotIndex + 1).trim();
                }
                else {
                    epNum = String(i + 1).padStart(2, '0');
                    epTitle = fullTitle;
                }
            } else {
                const dotIndex = fullTitle.indexOf('.');
                if (dotIndex !== -1) {
                    epNum = fullTitle.substring(0, dotIndex).trim().padStart(2, '0');
                    epTitle = fullTitle.substring(dotIndex + 1).trim();
                } else {
                    epNum = String(i + 1).padStart(2, '0');
                    epTitle = fullTitle;
                }
            }

            let dateText = "0000-00-00";
            if (infos[i]) {
                const infoText = infos[i].innerText;
                if (site === 'wavve') {
                    const dateMatch = infoText.match(/\d{4}-\d{2}-\d{2}/);
                    if (dateMatch) dateText = dateMatch[0];
                } else if (site === 'tving') {
                    const rawDate = infoText.split('|')[0].trim();
                    dateText = rawDate.replace(/\./g, '-');
                } else if (site === 'coupang') {
                    const rawDate = infoText.split('•')[0].trim();
                    const dateMatch = rawDate.match(/(\d+)년\s*(\d+)월\s*(\d+)일/);
                    if (dateMatch) {
                        dateText = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`;
                    }
                }
            }

            const formattedTitle = epTitle ? ` ${epTitle}` : "";
            // ✨ 핵심 수정 부분: ].mkv를 제거했습니다.
            results.push(`${epNum}_${dateText}${formattedTitle}`.trim());
        }

        if (results.length > 0) {
            const finalString = results.join('\n').trim() + '\n';
            GM_setClipboard(finalString);
            showNotification(`✅ ${results.length}개 회차 복사 완료!`);
        }
    };

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
        } else if (site === 'coupang') {
            const sortBtn = document.querySelector('[data-cy="episode-sort-button"]');
            if (sortBtn) {
                showNotification('정렬 순서를 변경합니다.');
                sortBtn.click();
            }
        }
    };

    const navigate = (direction) => {
        const url = new URL(window.location.href);
        const site = getSiteType();
        let currentPage = 1;

        if (site === 'wavve') {
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

    const init = () => {
        if (!document.getElementById('filter-button-container')) {
            const container = document.createElement('div');
            container.id = 'filter-button-container';
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.innerText = '회차 수집';
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
            (site === 'tving' && document.querySelector('.item__title')) ||
            (site === 'coupang' && document.querySelector('[data-cy="episode-title"]'))) {
            init();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();