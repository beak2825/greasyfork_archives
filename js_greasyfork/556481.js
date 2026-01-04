// ==UserScript==
// @name         SOOP (숲) - 목록 탐색 자동 PIP (V14.29 External Fix)
// @namespace    http://tampermonkey.net/
// @version      14.29
// @description  V14.26 복구 + 검색 드롭다운 패치 + 외부 사이트 임베드 오류 수정
// @author       Gemini
// @license      MIT
// @match        https://play.sooplive.co.kr/*
// @match        https://vod.sooplive.co.kr/*
// @match        https://www.sooplive.co.kr/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556481/SOOP%20%28%EC%88%B2%29%20-%20%EB%AA%A9%EB%A1%9D%20%ED%83%90%EC%83%89%20%EC%9E%90%EB%8F%99%20PIP%20%28V1429%20External%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556481/SOOP%20%28%EC%88%B2%29%20-%20%EB%AA%A9%EB%A1%9D%20%ED%83%90%EC%83%89%20%EC%9E%90%EB%8F%99%20PIP%20%28V1429%20External%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // [A] window.open 오버라이딩 (드롭다운 먹통/새창 방지 핵심)
    // ============================================================
    const originalOpen = window.open;
    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const dummyWindow = {
        close: () => {},
        focus: () => {},
        document: { write: () => {}, close: () => {} },
        location: { href: '' }
    };

    function hijackWindowOpen(url, name, specs) {
        if (typeof url === 'string') {
            if (url.includes('/search')) {
                executeSearchUrl(url);
                return dummyWindow;
            }
            if (url.includes('play.sooplive.co.kr') || url.includes('vod.sooplive.co.kr')) {
                window.top.location.href = url;
                return dummyWindow;
            }
        }
        return originalOpen.call(window, url, name, specs);
    }
    window.open = hijackWindowOpen;
    targetWindow.open = hijackWindowOpen;


    // ============================================================
    // [B] 환경 판별
    // ============================================================
    const isIframe = window.self !== window.top;
    const isPlayerDomain = location.hostname.includes('play.sooplive.co.kr') || location.hostname.includes('vod.sooplive.co.kr');

    // ============================================================
    // [C] 탐색창 (Iframe) 내부 로직
    // ============================================================
    if (isIframe) {
        // [수정됨] 외부 사이트 임베드(플레이어)인 경우 스크립트 중단
        // 탐색용 Iframe은 보통 'www.sooplive.co.kr'이고,
        // 외부 임베드 플레이어는 'vod'나 'play' 도메인을 사용합니다.
        if (location.hostname.includes('play.sooplive.co.kr') || location.hostname.includes('vod.sooplive.co.kr')) {
            return; // 여기서 종료하여 video 태그 숨김 방지
        }

        // --------------------------------------------------------
        // [1] CSS UI 보호 (탐색창 리소스 절약)
        // --------------------------------------------------------
        const style = document.createElement('style');
        let cssContent = `
            * { text-rendering: optimizeSpeed !important; }
            video, .thumbs_box .thumb, .broad_thumb, iframe[title*="광고"] { display: none !important; }
            .thumbs_box { contain: layout paint; }
            body { overflow-x: hidden; }
        `;

        if (location.href.includes('/my/favorite')) {
            cssContent += `
                div[class*="list_wrap"], ul {
                    content-visibility: visible !important;
                    contain: none !important;
                }
                .thumbs_box li, .list_wrap li, .cBox {
                    content-visibility: auto;
                    contain-intrinsic-size: 300px;
                    contain: layout paint style;
                    transform: translateZ(0);
                }
            `;
        }
        style.innerHTML = cssContent;
        document.head.appendChild(style);


        // --------------------------------------------------------
        // [2] 네트워크 요청 스로틀링
        // --------------------------------------------------------
        (function installNetworkThrottler() {
            const QUEUE_DELAY_MS = 50;
            const requestQueue = [];
            let isProcessing = false;

            async function processQueue() {
                if (isProcessing || requestQueue.length === 0) return;
                isProcessing = true;
                while (requestQueue.length > 0) {
                    const task = requestQueue.shift();
                    await task();
                    await new Promise(resolve => setTimeout(resolve, QUEUE_DELAY_MS));
                }
                isProcessing = false;
            }

            function isImageRequest(url) {
                return /\.(jpg|jpeg|png|gif|webp|svg)/i.test(url);
            }

            const originalFetch = window.fetch;
            window.fetch = async function(...args) {
                const url = args[0] ? args[0].toString() : '';
                if (isImageRequest(url)) return originalFetch(...args);

                const isTargetApi = url.includes('/api/') || url.includes('station') || url.includes('list');
                if (isTargetApi) {
                    return new Promise((resolve, reject) => {
                        requestQueue.push(async () => {
                            try {
                                const response = await originalFetch(...args);
                                resolve(response);
                            } catch (err) { reject(err); }
                        });
                        processQueue();
                    });
                }
                return originalFetch(...args);
            };

            const originalXhrOpen = XMLHttpRequest.prototype.open;
            const originalXhrSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function(method, url) {
                this._url = url;
                return originalXhrOpen.apply(this, arguments);
            };

            XMLHttpRequest.prototype.send = function(body) {
                const url = this._url || '';
                if (isImageRequest(url)) return originalXhrSend.call(this, body);

                const isTargetApi = url.includes('/api/') || url.includes('station') || url.includes('list');
                if (isTargetApi) {
                    requestQueue.push(() => {
                        return new Promise((resolve) => {
                            this.addEventListener('loadend', resolve);
                            originalXhrSend.call(this, body);
                            setTimeout(resolve, 1000);
                        });
                    });
                    processQueue();
                } else {
                    originalXhrSend.call(this, body);
                }
            };
        })();

        // --------------------------------------------------------
        // [3] 테마 및 클릭 핸들러
        // --------------------------------------------------------
        function sendTheme() {
            const isDark = document.documentElement.classList.contains('play-theme-dark') ||
                           document.body.classList.contains('dark') ||
                           getComputedStyle(document.body).backgroundColor === 'rgb(20, 21, 23)';
            window.parent.postMessage({ type: 'SOOP_THEME', isDarkMode: isDark }, '*');
        }
        window.addEventListener('load', sendTheme);
        setInterval(sendTheme, 2000);

        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) {
                window.parent.postMessage({ type: 'SOOP_BG_CLICK_SIMPLE' }, '*');
                return;
            }
            if (link && link.href) {
                if (link.href.includes('play.sooplive.co.kr') || link.href.includes('vod.sooplive.co.kr')) {
                    e.preventDefault();
                    window.top.location.href = link.href;
                }
            }
        }, true);
        return;
    }

    // ============================================================
    // [D] 메인 플레이어 로직 (부모 창)
    // ============================================================
    if (!isPlayerDomain) return;

    let isPipActive = false;

    // --- 1. CSS 스타일 ---
    GM_addStyle(`
        body.real-pip-mode #player_area {
            position: fixed !important; z-index: 999999 !important;
            width: 480px !important; height: 270px !important;
            bottom: auto !important; right: auto !important;
            border: none !important;
            box-shadow: 0 15px 50px rgba(0,0,0,0.9);
            background: #000; border-radius: 12px; overflow: hidden;
            cursor: move !important;
            contain: strict !important;
            transform: translate3d(0,0,0);
            will-change: transform, top, left;
        }
        body.real-pip-mode #player_area.is-dragging { transition: none !important; }

        body.real-pip-mode #player_area video {
            pointer-events: none !important; object-fit: contain !important;
            width: 100% !important; height: 100% !important;
            transform: translateZ(0);
            backface-visibility: hidden;
            will-change: transform;
        }

        body.real-pip-mode #player_area .player_cover {
            pointer-events: none !important; object-fit: contain !important;
            width: 100% !important; height: 100% !important;
        }
        body.real-pip-mode .play_control_box {
            display: block !important; pointer-events: auto !important;
            bottom: 0 !important; position: absolute !important;
            width: 100% !important; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            z-index: 20 !important; cursor: default !important;
        }
        body.real-pip-mode .play_control_box * { pointer-events: auto !important; }

        body.real-pip-mode #web_chatting,
        body.real-pip-mode .header_area,
        body.real-pip-mode .sidebar_area,
        body.real-pip-mode .start_ad_area,
        body.real-pip-mode #action_bar,
        body.real-pip-mode .btn_chat_open,
        body.real-pip-mode .btn_chat_fold,
        body.real-pip-mode .btn_expand,
        body.real-pip-mode button[class*="chat"],
        body.real-pip-mode .chat_layer,
        body.real-pip-mode .btn_sidebar
        { display: none !important; }

        #soop-real-frame {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 100; border: none; background: #fff;
            contain: strict;
            will-change: transform;
        }
        body.real-pip-mode #soop-real-frame { display: block; }
        body.real-pip-mode.iframe-dark #soop-real-frame { background: #141517; }

        #pip-control-bar {
            display: none; position: absolute; top: 0; left: 0; width: 100%; height: 40px;
            background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent);
            z-index: 1000000; justify-content: flex-end; align-items: center;
            padding-right: 10px; opacity: 0; transition: opacity 0.2s;
            pointer-events: auto !important; cursor: default;
        }
        body.real-pip-mode #player_area:hover #pip-control-bar { opacity: 1; }
        body.real-pip-mode #pip-control-bar { display: flex; }

        .pip-ctrl-btn {
            background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.3);
            color: white; margin-left: 8px; padding: 5px 12px;
            border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;
        }
        .pip-ctrl-btn:hover { background: rgba(255,255,255,0.3); }
    `);

    // --- 2. 검색 실행 헬퍼 ---
    function executeSearchUrl(url) {
        const frame = document.getElementById('soop-real-frame');

        if (isPipActive && frame) {
            try {
                if (frame.contentWindow.location.href === url) return;
            } catch(e) {}
        }

        const loadTask = () => {
            if (isPipActive) {
                if (frame) frame.src = url;
            } else {
                startPip(url);
            }
        };

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(loadTask, { timeout: 1000 });
        } else {
            setTimeout(loadTask, 100);
        }

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }

    function executeSearchKeyword(keyword) {
        if (!keyword || keyword.trim() === '') return;
        const searchUrl = 'https://www.sooplive.co.kr/search?keyword=' + encodeURIComponent(keyword);
        executeSearchUrl(searchUrl);
    }

    // --- 3. Form Submit ---
    document.addEventListener('submit', function(e) {
        const form = e.target;
        const isSearchForm = (form.action && form.action.includes('search')) ||
                             form.querySelector('input[name="szKeyword"]') ||
                             form.querySelector('input[name="keyword"]');

        if (isSearchForm) {
            if (form.target === '_blank') form.removeAttribute('target');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const input = form.querySelector('input[type="text"]');
            if (input && input.value) {
                executeSearchKeyword(input.value);
            }
            return false;
        }
    }, true);

    // --- 4. 클릭 이벤트 ---
    document.addEventListener('click', function(e) {
        const target = e.target;
        const link = target.closest('a');
        const text = (target.innerText || '').replace(/\s/g, '');

        const searchBtn = target.closest('.btn_search') ||
                          target.closest('.btn_search_submit') ||
                          (target.tagName === 'BUTTON' && (target.type === 'submit' || target.className.includes('search')));

        if (searchBtn) {
            const header = searchBtn.closest('.header_area') || searchBtn.closest('#header') || searchBtn.closest('header');
            if (header) {
                const input = header.querySelector('input[type="text"]');
                if (input && input.value) {
                    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                    executeSearchKeyword(input.value);
                    return;
                }
            }
        }

        let targetUrl = null;

        if (link && link.href) {
            if (link.href.includes('/search')) targetUrl = link.href;
            else if (link.href.includes('/live/all')) targetUrl = 'https://www.sooplive.co.kr/live/all';
            else if (link.href.includes('/my/favorite')) targetUrl = 'https://www.sooplive.co.kr/my/favorite';
            else if (link.href.includes('/directory/category')) targetUrl = 'https://www.sooplive.co.kr/directory/category';
            else if (link.classList.contains('logo') || link.id === 'logo') targetUrl = 'https://www.sooplive.co.kr/';
        }

        if (!targetUrl) {
            const isLogo = target.closest('.logo') || target.closest('.header_logo') || target.closest('#logo');
            if (isLogo) targetUrl = 'https://www.sooplive.co.kr/';
            else if (text.includes('즐겨찾기') || text === 'MY') targetUrl = 'https://www.sooplive.co.kr/my/favorite';
            else if (text === '전체') targetUrl = 'https://www.sooplive.co.kr/live/all';
            else if (text === '카테고리') targetUrl = 'https://www.sooplive.co.kr/directory/category';
        }

        if (targetUrl) {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            executeSearchUrl(targetUrl);
        }
    }, true);


    // --- 5. PIP 제어 ---
    function startPip(url) {
        const player = document.getElementById('player_area');
        if (!player) return alert('플레이어를 찾을 수 없습니다.');

        isPipActive = true;
        document.body.classList.add('real-pip-mode');

        let frame = document.getElementById('soop-real-frame');
        if (!frame) {
            frame = document.createElement('iframe');
            frame.id = 'soop-real-frame';
            document.body.appendChild(frame);
        }
        if(url) frame.src = url;

        player.style.top = (window.innerHeight - 300) + 'px';
        player.style.left = (window.innerWidth - 500) + 'px';

        createControls(player);
        makeDraggable(player);
    }

    function stopPip() {
        isPipActive = false;
        document.body.classList.remove('real-pip-mode');
        const player = document.getElementById('player_area');
        if(player) {
            player.style.top = ''; player.style.left = '';
            player.style.width = ''; player.style.height = '';
        }
    }

    function exitPipMode() {
        const frame = document.getElementById('soop-real-frame');
        const targetUrl = frame ? frame.src : 'https://www.sooplive.co.kr';
        window.location.href = targetUrl;
    }

    // --- 6. 컨트롤 바 ---
    function createControls(player) {
        if (document.getElementById('pip-control-bar')) return;
        const bar = document.createElement('div');
        bar.id = 'pip-control-bar';
        bar.onmousedown = (e) => e.stopPropagation();

        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'pip-ctrl-btn';
        restoreBtn.innerText = '⤢ 복귀';
        restoreBtn.onclick = stopPip;

        const exitBtn = document.createElement('button');
        exitBtn.className = 'pip-ctrl-btn';
        exitBtn.innerText = '✖ 종료';
        exitBtn.style.color = '#ff6b6b';
        exitBtn.style.borderColor = '#ff6b6b';
        exitBtn.onclick = exitPipMode;

        bar.appendChild(restoreBtn);
        bar.appendChild(exitBtn);
        player.appendChild(bar);
    }

    // --- 7. 드래그 ---
    function makeDraggable(elmnt) {
        let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;
        elmnt.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (!isPipActive) return;
            if (e.target.closest('.play_control_box') ||
                e.target.closest('#pip-control-bar') ||
                e.target.tagName === 'INPUT' ||
                e.target.tagName === 'BUTTON') {
                return;
            }
            e.preventDefault();
            elmnt.classList.add('is-dragging');

            startX = e.clientX;
            startY = e.clientY;
            initialLeft = elmnt.offsetLeft;
            initialTop = elmnt.offsetTop;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            requestAnimationFrame(() => {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                elmnt.style.top = (initialTop + dy) + "px";
                elmnt.style.left = (initialLeft + dx) + "px";
            });
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            elmnt.classList.remove('is-dragging');
        }
    }

    window.addEventListener('message', function(e) {
        if (!e.data) return;

        if (e.data.type === 'SOOP_THEME') {
            if (e.data.isDarkMode) document.body.classList.add('iframe-dark');
            else document.body.classList.remove('iframe-dark');
        }

        if (e.data.type === 'SOOP_BG_CLICK_SIMPLE') {
            if (document.activeElement && document.activeElement.tagName === 'INPUT') {
                document.activeElement.blur();
            }
            const ctrlBar = document.getElementById('pip-control-bar');
            if (ctrlBar) ctrlBar.click();
        }
    });

})();