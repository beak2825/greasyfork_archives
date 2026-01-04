// ==UserScript==
// @name         Sites to TMDB Link
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add "To TMDB" link on websites to search movie title on TMDB
// @author       DongHaerang
// @match        *://kinolights.com/*
// @match        *://*.kinolights.com/*
// @match        *://justwatch.com/*
// @match        *://*.justwatch.com/*
// @match        *://imdb.com/*
// @match        *://*.imdb.com/*
// @grant        GM_openInTab
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554311/Sites%20to%20TMDB%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/554311/Sites%20to%20TMDB%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🎬 Kinolights to TMDB script loaded!');

    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        #tmdb-link-container {
            position: fixed;
            top: 0px;
            left: 50%;
            transform: translateX(calc(-50% - 200px));
            z-index: 999999;
            display: flex;
            gap: 10px;
            pointer-events: auto;
        }
        .tmdb-link-btn {
            background-color: #0073e6;
            color: white;
            border: none;
            padding: 0px 5px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .tmdb-link-btn:hover {
            background-color: #005bb5;
        }
    `;
    document.head.appendChild(style);

    // 영상 제목 추출 함수
    function getMovieTitle() {
        console.log('📝 영상 제목 추출 시작...');

        let title = '';

        // 방법 1: 페이지 타이틀
        const pageTitle = document.title;
        console.log('페이지 타이틀:', pageTitle);
        if (pageTitle && pageTitle !== 'Kinolights') {
            title = pageTitle.split('-')[0].split('|')[0].split('–')[0].trim();
        }

        // 방법 2: h1, h2, h3 태그
        if (!title || title === 'Kinolights') {
            const headers = document.querySelectorAll('h1, h2, h3, h4');
            for (const header of headers) {
                const text = header.textContent.trim();
                if (text && text !== 'Kinolights' && text.length > 2 && text.length < 200) {
                    title = text;
                    console.log('헤더에서 발견:', title);
                    break;
                }
            }
        }

        // 방법 3: meta 태그
        if (!title || title === 'Kinolights') {
            const metaTitle = document.querySelector('meta[property="og:title"]');
            if (metaTitle) {
                title = metaTitle.getAttribute('content');
                console.log('Meta 태그:', title);
            }
        }

        // 불필요한 단어 제거
        if (title) {
            title = title
                .replace(/\s*\(\d{4}\)\s*$/gi, '') // 끝의 (연도) 제거 예: (2024)
                .replace(/\s*\d{4}\s*$/gi, '') // 끝의 연도만 제거 예: 2024
                .replace(/\s*스트리밍.*$/gi, '') // "스트리밍으로" 등 제거
                .replace(/\s*다시보기\s*/gi, '')
                .replace(/\s*다시\s*보기\s*/gi, '')
                .replace(/\s*무료\s*보기\s*/gi, '')
                .replace(/\s*무료\s*/gi, '')
                .replace(/\s*보기\s*/gi, '')
                .replace(/\s*full\s*/gi, '')
                .replace(/\s*movie\s*/gi, '')
                .replace(/\s*영화\s*/gi, '')
                .replace(/\s*드라마\s*/gi, '')
                .replace(/\s*시청\s*/gi, '')
                .replace(/\s*온라인\s*/gi, '')
                .replace(/\s*watch\s*/gi, '')
                .replace(/\s*streaming\s*/gi, '')
                .replace(/\s+$/, '') // 끝 공백 제거
                .replace(/^\s+/, '') // 앞 공백 제거
                .trim();
        }

        console.log('✅ 최종 제목:', title || 'untitled');
        return title || 'untitled';
    }

    // TMDB로 이동하는 함수
    window.goToTMDB = function() {
        console.log('🚀 TMDB로 이동!');

        const movieTitle = getMovieTitle();
        const tmdbUrl = `https://www.themoviedb.org/search?query=${encodeURIComponent(movieTitle)}`;

        console.log('URL:', tmdbUrl);

        try {
            if (typeof GM_openInTab !== 'undefined') {
                console.log('GM_openInTab 사용');
                GM_openInTab(tmdbUrl, { active: true, insert: true, setParent: true });
            } else {
                console.log('window.open 사용');
                const newWindow = window.open(tmdbUrl, '_blank', 'noopener,noreferrer');
                if (newWindow) {
                    newWindow.focus();
                    console.log('✅ 새 창 열림');
                } else {
                    console.warn('⚠️ 팝업 차단됨');
                    alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
                }
            }
        } catch (error) {
            console.error('❌ 오류:', error);
            alert('오류 발생: ' + error.message);
        }
    };

    // "To TMDB" 버튼 생성
    function createTMDBLink() {
        console.log('🔧 TMDB 버튼 생성 중...');

        // 기존 버튼 제거
        const existing = document.getElementById('tmdb-link-container');
        if (existing) {
            console.log('기존 버튼 제거');
            existing.remove();
        }

        // 컨테이너 생성
        const container = document.createElement('div');
        container.id = 'tmdb-link-container';

        // 버튼 생성
        const button = document.createElement('button');
        button.className = 'tmdb-link-btn';
        button.textContent = 'To TMDB';
        button.type = 'button';

        // 마우스 다운 이벤트 리스너 (왼쪽/가운데 버튼 구분)
        button.addEventListener('mousedown', function(e) {
            // 왼쪽 버튼(0) 또는 가운데 버튼(1)이 아니면 무시
            if (e.button !== 0 && e.button !== 1) return;

            console.log('👆 클릭 감지! 버튼:', e.button === 0 ? '왼쪽' : '가운데');
            e.preventDefault();
            e.stopPropagation();

            const movieTitle = getMovieTitle();
            const tmdbUrl = `https://www.themoviedb.org/search?query=${encodeURIComponent(movieTitle)}`;

            console.log('URL:', tmdbUrl);

            // 왼쪽 버튼이면 활성화(true), 가운데 버튼이면 비활성화(false)
            const isActive = (e.button === 0);

            if (typeof GM_openInTab !== 'undefined') {
                console.log('GM_openInTab 사용 (Active:', isActive, ')');
                // active 옵션에 위에서 정한 isActive 변수를 넣어줍니다.
                GM_openInTab(tmdbUrl, { active: isActive, insert: true, setParent: true });
            } else {
                console.log('window.open 사용');
                window.open(tmdbUrl, '_blank', 'noopener,noreferrer');
            }

            return false;
        });

        container.appendChild(button);
        document.body.appendChild(container);

        console.log('✅ 버튼 생성 완료!');
    }

    // 초기화
    function init() {
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        console.log('⚙️ 스크립트 초기화...');
        createTMDBLink();
    }

    // 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('✨ 스크립트 준비 완료!');

})();