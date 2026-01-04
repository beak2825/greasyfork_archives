// ==UserScript==
// @name         Kone 게시글 추천수 필터
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Kone.gg 게시판에서 추천수 기준으로 게시글 필터링
// @author       qqoro
// @license      MIT
// @match        https://kone.gg/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kone.gg
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557248/Kone%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%B6%94%EC%B2%9C%EC%88%98%20%ED%95%84%ED%84%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/557248/Kone%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%B6%94%EC%B2%9C%EC%88%98%20%ED%95%84%ED%84%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 설정 키
    const CONFIG_KEY = 'koneFilterConfig';

    // 기본 설정
    const defaultConfig = {
        enabled: false,
        minRecommend: 0
    };

    // 설정 로드
    function loadConfig() {
        const saved = localStorage.getItem(CONFIG_KEY);
        return saved ? JSON.parse(saved) : defaultConfig;
    }

    // 설정 저장
    function saveConfig(config) {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    }

    // 현재 설정
    let config = loadConfig();

    // UI 스타일 추가
    GM_addStyle(`
        /* 라이트/다크 모드 변수 */
        :root {
            --kone-bg: #ffffff;
            --kone-text: #18181b;
            --kone-border: #e4e4e7;
            --kone-hover: #f4f4f5;
            --kone-dim: #71717a;
            --kone-accent: #3b82f6;
            --kone-shadow: rgba(0, 0, 0, 0.1);
        }

        .dark {
            --kone-bg: #18181b;
            --kone-text: #fafafa;
            --kone-border: #3f3f46;
            --kone-hover: #27272a;
            --kone-dim: #a1a1aa;
            --kone-accent: #60a5fa;
            --kone-shadow: rgba(0, 0, 0, 0.4);
        }

        /* 필터 버튼 */
        #kone-filter-button {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            background: var(--kone-bg);
            border: 1px solid var(--kone-border);
            border-radius: 8px;
            color: var(--kone-text);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 1px 2px var(--kone-shadow);
        }

        #kone-filter-button:hover {
            background: var(--kone-hover);
            border-color: var(--kone-accent);
        }

        #kone-filter-button svg {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
        }

        #kone-filter-button .filter-value {
            color: var(--kone-accent);
            font-weight: 600;
        }

        #kone-filter-button.disabled .filter-value {
            color: var(--kone-dim);
        }

        /* 팝업 패널 */
        #kone-filter-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            background: var(--kone-bg);
            border: 1px solid var(--kone-border);
            border-radius: 12px;
            padding: 20px;
            min-width: 320px;
            max-width: 400px;
            box-shadow: 0 20px 60px var(--kone-shadow);
            color: var(--kone-text);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: none;
        }

        #kone-filter-panel.show {
            display: block;
        }

        #kone-filter-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: none;
        }

        #kone-filter-overlay.show {
            display: block;
        }

        #kone-filter-panel h3 {
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
            color: var(--kone-text);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .kone-filter-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            gap: 12px;
        }

        .kone-filter-label {
            font-size: 14px;
            font-weight: 500;
            color: var(--kone-text);
        }

        .kone-filter-select {
            flex: 1;
            max-width: 140px;
            height: 36px;
            padding: 0 10px;
            background: var(--kone-bg);
            border: 1px solid var(--kone-border);
            border-radius: 8px;
            color: var(--kone-text);
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .kone-filter-select:hover {
            background: var(--kone-hover);
            border-color: var(--kone-accent);
        }

        .kone-filter-select:focus {
            outline: none;
            border-color: var(--kone-accent);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .kone-filter-toggle {
            position: relative;
            width: 48px;
            height: 26px;
            background: var(--kone-border);
            border-radius: 13px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .kone-filter-toggle.active {
            background: #10b981;
        }

        .kone-filter-toggle::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: transform 0.3s;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .kone-filter-toggle.active::after {
            transform: translateX(22px);
        }

        .kone-filter-status {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--kone-border);
            font-size: 13px;
            color: var(--kone-dim);
            text-align: center;
        }

        .kone-filter-status.active {
            color: #10b981;
            font-weight: 500;
        }

        .kone-filter-close {
            margin-top: 16px;
            width: 100%;
            padding: 10px;
            background: var(--kone-hover);
            border: 1px solid var(--kone-border);
            border-radius: 8px;
            color: var(--kone-text);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .kone-filter-close:hover {
            background: var(--kone-border);
        }

        /* 숨겨진 게시글 스타일 */
        .kone-hidden-post {
            display: none !important;
        }
    `);

    // 버튼 텍스트 업데이트
    function updateButtonText() {
        const button = document.getElementById('kone-filter-button');
        if (!button) return;

        const valueSpan = button.querySelector('.filter-value');
        if (config.enabled) {
            button.classList.remove('disabled');
            valueSpan.textContent = `≥ ${config.minRecommend}`;
        } else {
            button.classList.add('disabled');
            valueSpan.textContent = 'OFF';
        }
    }

    // UI 생성
    function createUI() {
        // 기존 요소 제거
        const existingButton = document.getElementById('kone-filter-button');
        const existingPanel = document.getElementById('kone-filter-panel');
        const existingOverlay = document.getElementById('kone-filter-overlay');
        if (existingButton) existingButton.remove();
        if (existingPanel) existingPanel.remove();
        if (existingOverlay) existingOverlay.remove();

        // 오버레이 생성
        const overlay = document.createElement('div');
        overlay.id = 'kone-filter-overlay';
        document.body.appendChild(overlay);

        // 팝업 패널 생성
        const panel = document.createElement('div');
        panel.id = 'kone-filter-panel';
        panel.innerHTML = `
            <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 10v12"></path>
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path>
                </svg>
                게시글 필터
            </h3>

            <div class="kone-filter-row">
                <label class="kone-filter-label">최소 추천수</label>
                <select id="kone-min-recommend" class="kone-filter-select">
                    <option value="0">제한없음</option>
                    <option value="5">5개 이상</option>
                    <option value="10">10개 이상</option>
                    <option value="20">20개 이상</option>
                    <option value="30">30개 이상</option>
                    <option value="50">50개 이상</option>
                    <option value="70">70개 이상</option>
                    <option value="100">100개 이상</option>
                    <option value="150">150개 이상</option>
                    <option value="200">200개 이상</option>
                </select>
            </div>

            <div class="kone-filter-row">
                <label class="kone-filter-label">필터 사용</label>
                <div id="kone-filter-toggle" class="kone-filter-toggle ${config.enabled ? 'active' : ''}"></div>
            </div>

            <div id="kone-filter-status" class="kone-filter-status ${config.enabled ? 'active' : ''}">
                ${config.enabled ? `✓ 활성화 (${config.minRecommend}개 이상)` : '비활성화'}
            </div>

            <button class="kone-filter-close">닫기</button>
        `;

        document.body.appendChild(panel);

        // 필터 버튼 생성 (글쓰기 버튼 왼쪽에 배치)
        function createFilterButton() {
            const writeButton = document.querySelector('a[href*="/write"]');
            if (!writeButton || document.getElementById('kone-filter-button')) return;

            const button = document.createElement('button');
            button.id = 'kone-filter-button';
            button.className = config.enabled ? '' : 'disabled';
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 10v12"></path>
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path>
                </svg>
                <span class="filter-value">${config.enabled ? `≥ ${config.minRecommend}` : 'OFF'}</span>
            `;

            writeButton.parentElement.insertBefore(button, writeButton);

            // 버튼 클릭 시 팝업 표시
            button.addEventListener('click', () => {
                panel.classList.add('show');
                overlay.classList.add('show');
            });
        }

        // 글쓰기 버튼 대기 (10초 동안 0.2초마다 체크)
        const checkWriteButton = setInterval(() => {
            createFilterButton();
            if (document.getElementById('kone-filter-button')) {
                clearInterval(checkWriteButton);
            }
        }, 200);

        setTimeout(() => clearInterval(checkWriteButton), 10000);

        // 이벤트 리스너
        const selectEl = panel.querySelector('#kone-min-recommend');
        const toggleEl = panel.querySelector('#kone-filter-toggle');
        const statusEl = panel.querySelector('#kone-filter-status');
        const closeBtn = panel.querySelector('.kone-filter-close');

        // 저장된 값 복원
        selectEl.value = config.minRecommend;

        // 추천수 변경
        selectEl.addEventListener('change', (e) => {
            config.minRecommend = parseInt(e.target.value);
            saveConfig(config);
            updateStatus();
            updateButtonText();
            applyFilter();
        });

        // 토글 변경
        toggleEl.addEventListener('click', () => {
            config.enabled = !config.enabled;
            saveConfig(config);
            toggleEl.classList.toggle('active', config.enabled);
            updateStatus();
            updateButtonText();
            applyFilter();
        });

        // 닫기 버튼
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('show');
            overlay.classList.remove('show');
        });

        // 오버레이 클릭 시 닫기
        overlay.addEventListener('click', () => {
            panel.classList.remove('show');
            overlay.classList.remove('show');
        });

        function updateStatus() {
            if (config.enabled) {
                statusEl.textContent = `✓ 활성화 (${config.minRecommend}개 이상)`;
                statusEl.classList.add('active');
            } else {
                statusEl.textContent = '비활성화';
                statusEl.classList.remove('active');
            }
        }
    }

    // 필터 적용
    function applyFilter() {
        // 게시글 컨테이너 찾기
        // 목록뷰: .grow.flex.flex-col.relative.rounded-b-lg > div.grow
        // 갤러리뷰: .grow.flex.flex-col.relative.rounded-b-lg > div.grow.grid
        let container = document.querySelector('.grow.flex.flex-col.relative.rounded-b-lg > div.grow');

        if (!container) {
            console.log('[Kone Filter] 게시글 컨테이너를 찾을 수 없습니다.');
            console.log('[Kone Filter] 시도한 선택자: .grow.flex.flex-col.relative.rounded-b-lg > div.grow');
            return;
        }

        // 뷰 타입 확인
        const isGalleryView = container.classList.contains('grid');
        console.log(`[Kone Filter] 현재 뷰: ${isGalleryView ? '갤러리' : '목록'}`);

        // 모든 게시글 아이템 - 컨테이너의 직계 자식 div들
        const posts = Array.from(container.children).filter(child => child.tagName === 'DIV');
        let hiddenCount = 0;
        let totalCount = posts.length;

        console.log(`[Kone Filter] 필터 적용 시작 - 총 ${totalCount}개 게시글, 필터: ${config.enabled ? 'ON' : 'OFF'}, 최소 추천수: ${config.minRecommend}`);

        posts.forEach((post, index) => {
            if (!config.enabled) {
                // 필터 비활성화 - 모두 표시
                post.classList.remove('kone-hidden-post');
                return;
            }

            // 추천수 찾기
            const recommendEl = findRecommendElement(post);
            if (!recommendEl) {
                console.log(`[Kone Filter] 게시글 #${index}: 추천수 요소를 찾을 수 없음`);
                post.classList.remove('kone-hidden-post');
                return;
            }

            const recommendCount = parseInt(recommendEl.textContent.trim()) || 0;

            // 필터링
            if (recommendCount < config.minRecommend) {
                post.classList.add('kone-hidden-post');
                hiddenCount++;
                if (index < 3) {
                    console.log(`[Kone Filter] 게시글 #${index}: 추천수 ${recommendCount} < ${config.minRecommend} → 숨김`);
                }
            } else {
                post.classList.remove('kone-hidden-post');
                if (index < 3) {
                    console.log(`[Kone Filter] 게시글 #${index}: 추천수 ${recommendCount} >= ${config.minRecommend} → 표시`);
                }
            }
        });

        console.log(`[Kone Filter] 완료 - 전체: ${totalCount}, 숨김: ${hiddenCount}, 표시: ${totalCount - hiddenCount}`);
    }

    // 추천수 요소 찾기 (목록뷰, 갤러리뷰 모두 대응)
    function findRecommendElement(post) {
        // 방법 1: 데스크톱 목록뷰 - .hidden.md:contents 내부의 모든 col-span-1 중 마지막 것
        const desktopContainer = post.querySelector('.hidden.md\\:contents');
        if (desktopContainer) {
            const allColSpan1 = desktopContainer.querySelectorAll('.col-span-1');
            if (allColSpan1.length > 0) {
                return allColSpan1[allColSpan1.length - 1];
            }
        }

        // 방법 2: thumbs-up 아이콘 찾기 (갤러리뷰, 모바일뷰 공통)
        const thumbsUpIcon = post.querySelector('.lucide-thumbs-up');
        if (thumbsUpIcon) {
            // 아이콘의 부모 div에서 숫자만 추출
            const parent = thumbsUpIcon.closest('.flex.gap-1');
            if (parent) {
                // SVG 제거하고 텍스트만 추출
                const clone = parent.cloneNode(true);
                const svg = clone.querySelector('svg');
                if (svg) svg.remove();
                const text = clone.textContent.trim();

                // 임시 span 요소를 만들어 반환
                const span = document.createElement('span');
                span.textContent = text;
                return span;
            }
        }

        // 방법 3: 모바일뷰 특수 케이스
        const mobileRecommendContainer = post.querySelector('.contents.md\\:hidden');
        if (mobileRecommendContainer) {
            const mobileThumbsUp = mobileRecommendContainer.querySelector('.lucide-thumbs-up');
            if (mobileThumbsUp) {
                const parent = mobileThumbsUp.closest('.flex.gap-1');
                if (parent) {
                    const clone = parent.cloneNode(true);
                    const svg = clone.querySelector('svg');
                    if (svg) svg.remove();
                    const text = clone.textContent.trim();

                    const span = document.createElement('span');
                    span.textContent = text;
                    return span;
                }
            }
        }

        return null;
    }

    // DOM 변화 감지 (페이지 이동, 뷰 전환 대응)
    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            // 게시글 컨테이너 내부의 변경사항 확인
            const hasListChange = mutations.some(mutation => {
                // 컨테이너 자체가 추가되었거나
                const containerAdded = Array.from(mutation.addedNodes).some(node => {
                    return node.nodeType === 1 && (
                        (node.matches && node.matches('.grow.flex.flex-col.relative.rounded-b-lg')) ||
                        (node.querySelector && node.querySelector('.grow.flex.flex-col.relative.rounded-b-lg'))
                    );
                });

                // 또는 컨테이너 내부에 게시글이 추가됨
                const postsAdded = mutation.target.classList &&
                                   mutation.target.classList.contains('grow') &&
                                   mutation.addedNodes.length > 0;

                // 또는 클래스 변경 (목록뷰 <-> 갤러리뷰 전환)
                const classChanged = mutation.type === 'attributes' &&
                                    mutation.attributeName === 'class' &&
                                    mutation.target.classList &&
                                    mutation.target.classList.contains('grow');

                return containerAdded || postsAdded || classChanged;
            });

            if (hasListChange) {
                console.log('[Kone Filter] 페이지 변경 감지 - 필터 재적용');
                setTimeout(applyFilter, 100);
            }

            // 헤더 재렌더링 감지 - 필터 버튼이 사라졌는지 확인
            const buttonExists = document.getElementById('kone-filter-button');
            const writeButtonExists = document.querySelector('a[href*="/write"]');

            if (!buttonExists && writeButtonExists) {
                console.log('[Kone Filter] 헤더 재렌더링 감지 - 필터 버튼 재생성');
                // 기존 패널과 오버레이는 유지하고 버튼만 재생성
                const existingButton = document.getElementById('kone-filter-button');
                if (existingButton) existingButton.remove();

                const panel = document.getElementById('kone-filter-panel');
                const overlay = document.getElementById('kone-filter-overlay');

                if (panel && overlay) {
                    const button = document.createElement('button');
                    button.id = 'kone-filter-button';
                    button.className = config.enabled ? '' : 'disabled';
                    button.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M7 10v12"></path>
                            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path>
                        </svg>
                        <span class="filter-value">${config.enabled ? `≥ ${config.minRecommend}` : 'OFF'}</span>
                    `;

                    writeButtonExists.parentElement.insertBefore(button, writeButtonExists);

                    button.addEventListener('click', () => {
                        panel.classList.add('show');
                        overlay.classList.add('show');
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // 게시글이 로드될 때까지 대기하고 필터 적용
    function waitForPostsAndApply(maxAttempts = 10, delay = 500) {
        let attempts = 0;

        function tryApply() {
            attempts++;
            const container = document.querySelector('.grow.flex.flex-col.relative.rounded-b-lg > div.grow');
            const postsCount = container ? container.children.length : 0;

            console.log(`[Kone Filter] 시도 ${attempts}/${maxAttempts}: ${postsCount}개 게시글 발견`);

            if (postsCount > 0) {
                console.log('[Kone Filter] 게시글 발견! 필터 적용 시작');
                applyFilter();
            } else if (attempts < maxAttempts) {
                console.log(`[Kone Filter] 게시글 없음. ${delay}ms 후 재시도...`);
                setTimeout(tryApply, delay);
            } else {
                console.log('[Kone Filter] 최대 시도 횟수 초과. 게시글을 찾을 수 없습니다.');
            }
        }

        tryApply();
    }

    // 초기화
    function init() {
        console.log('[Kone Filter] 스크립트 로드됨');

        // UI 생성
        createUI();

        // 게시글 로드 대기 후 필터 적용
        waitForPostsAndApply();

        // DOM 변화 감지 시작
        observeChanges();

        // URL 변경 감지 (SPA 대응)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                console.log('[Kone Filter] URL 변경 감지 - UI 및 필터 재적용');
                createUI(); // UI 재생성 (중복 방지 로직 포함)
                waitForPostsAndApply(5, 300);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // 페이지 로드 완료 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
