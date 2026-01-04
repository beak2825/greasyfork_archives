// ==UserScript==
// @name         Soop Advanced Home
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  최근글 표시 + 팬 영역 접기/펼치기
// @author       Coding Slave
// @match        https://www.sooplive.co.kr/station/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550941/Soop%20Advanced%20Home.user.js
// @updateURL https://update.greasyfork.org/scripts/550941/Soop%20Advanced%20Home.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 설정 및 상수
    const CONFIG = {
        // 팬 영역 설정
        FAN: {
            SELECTOR: '[class*="ServiceLeftMenu_fanWrapper"], [class*="fanWrapper"], [data-testid*="fan"]'
        },

        // 네비게이션 설정
        NAV: {
            SELECTORS: [
                '.__soopui__NavContent-module__navContent___DQ9Xi',
                '[class*="__soopui__NavContent-module__navContent"]',
                '[class*="navContent"]',
                'nav',
                '.nav',
                '.navigation'
            ]
        },

        // API 설정
        API: {
            BASE_URL: 'https://api-channel.sooplive.co.kr/v1.1/channel',
            BOARD_API_BASE_URL: 'https://chapi.sooplive.co.kr/api',
            MAX_BOARD_PAGES: 3,
            BOARD_POSTS_PER_PAGE: 50
        },

        // 시간 설정
        TIME: {
            BADGE_TIME_WINDOW_HOURS: 24,
            MONITOR_INTERVAL_MS: 1000,
            BOARD_WATCHER_INTERVAL_MS: 1000,
            OBSERVER_TIMEOUT_MS: 15000,
            BOARD_BADGE_DELAY_MS: 200,
            FAN_AREA_DELAY_MS: 500
        },

        // CSS 클래스
        CSS: {
            RELOCATED_BOARD_CLASS: 'soop-board-relocated',
            FAN_TOGGLE_CLASS: 'soop-fan-toggle'
        },

        // MutationObserver 설정
        OBSERVER: {
            CONFIG: {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            }
        }
    };

    // 상태 관리
    const State = {
        fanAreaProcessed: false,
        boardBadgeProcessed: false,
        boardBadgeInProgress: false,
        initExecuted: false,
        // 뱃지 데이터 캐시
        cachedBoardList: null,
        cachedBoardData: null
    };

    // 게시판 메뉴 관리

    const BoardMenuManager = {
        relocateBoardMenu() {
            // 이미 처리되었으면 중단
            if (document.querySelector(`.${CONFIG.CSS.RELOCATED_BOARD_CLASS}`)) {
                return false;
            }

            const navContainer = this.findNavigationContainer();
            if (!navContainer) {
                return false;
            }

            const boardContainer = this.findBoardContainer(navContainer);
            if (!boardContainer) {
                return false;
            }

            // 게시판 메뉴 전체를 Catch 다음으로 이동
            return this.moveBoardMenuAfterCatch(boardContainer, navContainer);
        },

        findNavigationContainer() {
            for (const selector of CONFIG.NAV.SELECTORS) {
                const container = document.querySelector(selector);
                if (container) return container;
            }
            return null;
        },

        findBoardMenuContainer() {
            // 이동된 게시판 메뉴 우선 찾기
            let boardMenu = document.querySelector(`.${CONFIG.CSS.RELOCATED_BOARD_CLASS}`);
            if (boardMenu) {
                // 드롭다운 메뉴 내부 찾기
                const dropdown = boardMenu.querySelector('ul, .dropdown, [class*="menu"]');
                if (dropdown) {
                    return dropdown;
                }
                // 하위 요소들 직접 찾기
                return boardMenu;
            }

            // 이동되지 않은 원본 게시판 메뉴 찾기
            const navContainer = this.findNavigationContainer();
            if (!navContainer) return null;

            const allElements = navContainer.querySelectorAll('p, span, div, li, a, button');
            for (const element of allElements) {
                if (element.textContent && element.textContent.trim() === '게시판') {
                    let container = element;
                    while (container && container !== navContainer) {
                        if (container.tagName === 'LI' ||
                            container.classList.contains('navContentItem') ||
                            container.classList.contains('menu-item')) {
                            // 드롭다운 메뉴 찾기
                            const dropdown = container.querySelector('ul, .dropdown, [class*="menu"]');
                            if (dropdown) {
                                return dropdown;
                            }
                            return container;
                        }
                        container = container.parentElement;
                    }
                    break;
                }
            }

            return null;
        },

        findBoardContainer(navContainer) {
            const elements = navContainer.querySelectorAll('p, span, div, li, a, button');
            for (const element of elements) {
                if (element.textContent && element.textContent.trim() === '게시판') {
                    let container = element;
                    while (container && container !== navContainer) {
                        if (container.tagName === 'LI' ||
                            container.classList.contains('navContentItem') ||
                            container.classList.contains('menu-item')) {
                            return container;
                        }
                        container = container.parentElement;
                    }
                    break;
                }
            }
            return null;
        },

        moveBoardMenuAfterCatch(boardContainer, navContainer) {
            // Catch 메뉴 컨테이너 찾기 (1단계: 텍스트 매칭만)
            const allElements = navContainer.querySelectorAll('*');
            let catchContainer = null;

            for (const element of allElements) {
                const text = element.textContent ? element.textContent.trim() : '';
                if (text === 'Catch' || text === 'CATCH' || text === 'catch') {
                    // Catch 메뉴의 컨테이너 찾기
                    let container = element;
                    while (container && container !== navContainer) {
                        if (container.tagName === 'LI' ||
                            container.classList.contains('navContentItem') ||
                            container.classList.contains('menu-item')) {
                            catchContainer = container;
                            break;
                        }
                        container = container.parentElement;
                    }
                    if (catchContainer) break;
                }
            }

            if (!catchContainer) {
                return false;
            }

            // 게시판을 Catch 다음으로 이동
            boardContainer.classList.add(CONFIG.CSS.RELOCATED_BOARD_CLASS);

            if (catchContainer.parentNode) {
                catchContainer.parentNode.insertBefore(boardContainer, catchContainer.nextSibling);
                return true;
            }

            return false;
        }
    };


    // 게시판 뱃지 관리

    const BadgeManager = {
        async checkBoardBadge() {
            if (State.boardBadgeProcessed || State.boardBadgeInProgress) return;

            State.boardBadgeInProgress = true;

            const streamerId = this.getStreamerId();
            if (!streamerId) {
                State.boardBadgeInProgress = false;
                return;
            }

            try {
                const boardList = await this.fetchBoardList(streamerId);
                if (!boardList) {
                    State.boardBadgeInProgress = false;
                    return;
                }

                const boardData = await this.fetchBoardData(streamerId);
                if (!boardData) {
                    State.boardBadgeInProgress = false;
                    return;
                }

                this.addIndividualBoardBadges(boardList, boardData);
                State.cachedBoardList = boardList;
                State.cachedBoardData = boardData;
                State.boardBadgeProcessed = true;
            } catch (error) {
            } finally {
                State.boardBadgeInProgress = false;
            }
        },

        getStreamerId() {
            const urlMatch = window.location.pathname.match(/\/station\/([^\/]+)/);
            return urlMatch ? urlMatch[1] : null;
        },

        async fetchBoardList(streamerId) {
            try {
                const apiUrl = `${CONFIG.API.BASE_URL}/${streamerId}/menu`;

                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    return data.board || [];
                }
                return null;
            } catch (error) {
                return null;
            }
        },

        async fetchBoardData(streamerId) {
            try {
                // 24시간 전 날짜 계산 (YYYY-MM-DD HH:mm:ss 형식)
                const now = new Date();
                const oneDayAgo = new Date(now.getTime() - (CONFIG.TIME.BADGE_TIME_WINDOW_HOURS * 60 * 60 * 1000));
                const startDate = oneDayAgo.toISOString().slice(0, 19).replace('T', ' ');

                let allData = [];
                let page = 1;
                const maxPages = CONFIG.API.MAX_BOARD_PAGES; // 최대 페이지 제한 (API 부하 방지)

                while (page <= maxPages) {
                    // 실제 SoopLive API 엔드포인트 (24시간 이내 글만)
                    const apiUrl = `${CONFIG.API.BOARD_API_BASE_URL}/${streamerId}/board/?per_page=${CONFIG.API.BOARD_POSTS_PER_PAGE}&start_date=${encodeURIComponent(startDate)}&end_date=&field=title,contents,user_nick,user_id,hashtags&keyword=&type=all&order_by=reg_date&board_number=&page=${page}`;

                    const response = await fetch(apiUrl);
                    if (!response.ok) break;

                    const data = await response.json();
                    if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) break;

                    allData = allData.concat(data.data);

                    // 마지막 페이지이거나, 가져온 데이터 중에 24시간 이내가 아닌 글이 있으면 중단
                    const hasOldPosts = data.data.some(post => {
                        const postTime = new Date(post.reg_date).getTime();
                        const oneDayAgoTime = oneDayAgo.getTime();
                        return postTime < oneDayAgoTime;
                    });

                    if (hasOldPosts || data.data.length < CONFIG.API.BOARD_POSTS_PER_PAGE) {
                        break; // 더 이상 확인할 필요 없음
                    }

                    page++;
                }

                return { data: allData };
            } catch (error) {
                return null;
            }
        },

        getBoardsWithRecentPosts(boardData, boardList) {
            if (!boardData || !boardData.data || !Array.isArray(boardData.data) || !boardList) {
                return new Set();
            }

            const boardsWithRecentPosts = new Set();
            const currentTime = Date.now();
            const oneDayAgo = currentTime - (CONFIG.TIME.BADGE_TIME_WINDOW_HOURS * 60 * 60 * 1000);

            // 각 게시판별로 새 글 확인
            for (const board of boardList) {
                if (!board.bbsNo) {
                    continue;
                }

                // 해당 게시판의 게시물들 필터링 (문자열/숫자 변환 고려)
                const boardPosts = boardData.data.filter(post => {
                    const postBbsNo = String(post.bbs_no);
                    const boardBbsNo = String(board.bbsNo);
                    return postBbsNo === boardBbsNo;
                });

                const recentPosts = boardPosts.filter(post => {
                    const postTime = new Date(post.reg_date).getTime();
                    return postTime > oneDayAgo;
                });

                if (recentPosts.length > 0) {
                    boardsWithRecentPosts.add(board.bbsNo);
                }
            }

            return boardsWithRecentPosts;
        },

        addIndividualBoardBadges(boardList, boardData) {
            const boardsWithRecentPosts = this.getBoardsWithRecentPosts(boardData, boardList);
            if (boardsWithRecentPosts.size === 0) {
                State.boardBadgeProcessed = true;
                return;
            }

            const boardContainer = BoardMenuManager.findBoardMenuContainer();
            if (!boardContainer) {
                State.boardBadgeProcessed = true;
                return;
            }

            const boardItems = boardContainer.querySelectorAll('li, a, button, [role="menuitem"]');
            for (const item of boardItems) {
                const itemText = item.textContent ? item.textContent.trim() : '';
                if (!itemText || itemText === '게시판') continue;

                const matchedBoard = boardList.find(board => board.name === itemText);
                if (matchedBoard && boardsWithRecentPosts.has(matchedBoard.bbsNo)) {
                    this.addBadgeToBoardItem(item);
                }
            }

            State.boardBadgeProcessed = true;
        },

        reapplyBadgesIfNeeded() {
            // 캐시된 데이터가 없으면 중단
            if (!State.cachedBoardList || !State.cachedBoardData) {
                return;
            }

            // 게시판 메뉴 컨테이너가 있는지 확인
            const boardContainer = BoardMenuManager.findBoardMenuContainer();
            if (!boardContainer) {
                return;
            }

            // 뱃지가 모두 존재하는지 확인
            const boardsWithRecentPosts = this.getBoardsWithRecentPosts(State.cachedBoardData, State.cachedBoardList);
            if (boardsWithRecentPosts.size === 0) {
                return;
            }

            const boardItems = boardContainer.querySelectorAll('li, a, button, [role="menuitem"]');
            let missingBadges = 0;

            for (const item of boardItems) {
                const itemText = item.textContent ? item.textContent.trim() : '';
                if (!itemText || itemText === '게시판') continue;

                const matchedBoard = State.cachedBoardList.find(board => board.name === itemText);
                if (matchedBoard && boardsWithRecentPosts.has(matchedBoard.bbsNo)) {
                    // 뱃지가 없으면 추가
                    if (!item.querySelector('.soop-badge')) {
                        this.addBadgeToBoardItem(item);
                        missingBadges++;
                    }
                }
            }

            // 뱃지 재적용 완료 (디버깅용 로그 제거)
        },

        addBadgeToBoardItem(boardItem) {
            if (boardItem.querySelector('.soop-badge')) return;

            const badge = document.createElement('span');
            badge.className = 'soop-badge';
            badge.style.cssText = `
                position: absolute;
                top: 50%;
                right: 6px;
                transform: translateY(-50%);
                width: 4px;
                height: 4px;
                background-color: #ff4444;
                border-radius: 50%;
                z-index: 1000;
                pointer-events: none;
            `;

            if (getComputedStyle(boardItem).position === 'static') {
                boardItem.style.position = 'relative';
            }

            boardItem.appendChild(badge);
        }
    };


    // CSS 스타일 관리

    const StyleManager = {
        initCustomStyles() {
            if (document.querySelector('#soop-custom-styles')) return;

            const style = document.createElement('style');
            style.id = 'soop-custom-styles';
            style.textContent = `
                /* 게시판 포스트 리스트 스타일 */
                .PostList_postList__mrPhL td,
                .PostList_postList__mrPhL th {
                    height: 35px !important;
                }

                /* 좌측 패널 게시판 하위 메뉴 패딩 */
                .__soopui__NavContentItem-module__Depth2___R0MMC.__soopui__NavContentItem-module__on___PfEd-.__soopui__SecondDepth-module__SecondDepth___AzP-0 {
                    padding-left: 24px !important;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // 팬 영역 관리

    const FanAreaManager = {
        findFanArea() {
            return document.querySelector(CONFIG.FAN.SELECTOR);
        },

        setupFanAreaCollapse() {
            const fanArea = this.findFanArea();
            if (!fanArea || State.fanAreaProcessed) return;

            this.createFanToggleUI(fanArea);
            State.fanAreaProcessed = true;
        },

        createFanToggleUI(fanArea) {
            let isCollapsed = true;

            const updateFanAreaVisibility = () => {
                fanArea.style.display = isCollapsed ? 'none' : '';
                toggleBtn.textContent = isCollapsed ? '▼' : '▲';
            };

            const forceCollapse = () => {
                isCollapsed = true;
                updateFanAreaVisibility();
            };

            const updateTheme = () => {
                const isDark = document.documentElement.getAttribute('dark') === 'true';
                const textColor = isDark ? '#e6e6e6' : '#222';
                const borderColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
                const bgColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

                label.style.color = textColor;
                toggleBtn.style.borderColor = borderColor;
                toggleBtn.style.backgroundColor = bgColor;
                toggleBtn.style.color = textColor;
            };

            // UI 생성
            const container = document.createElement('div');
            container.className = 'soop-fan-toggle-container';
            container.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; margin: 4px 0;';

            const label = document.createElement('span');
            label.textContent = '열혈팬/구독팬 보기';
            label.style.cssText = 'font-size: 13px; font-weight: 500;';

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'soop-fan-toggle';
            toggleBtn.title = '열혈팬/구독팬 접기/펼치기';
            toggleBtn.style.cssText = 'padding: 2px 6px; font-size: 14px; cursor: pointer; margin-left: 8px; border: 1px solid; border-radius: 3px; background: transparent;';

            container.appendChild(label);
            container.appendChild(toggleBtn);
            fanArea.parentNode?.insertBefore(container, fanArea);

            // 초기 설정
            updateTheme();
            forceCollapse();

            // 이벤트 리스너
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                isCollapsed = !isCollapsed;
                updateFanAreaVisibility();
            });

            // 테마 변경 감시
            const themeObserver = new MutationObserver(updateTheme);
            themeObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['dark']
            });

            // 팬 영역 상태 유지 감시
            const visibilityObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' &&
                        (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                        if (fanArea.style.display !== 'none' && isCollapsed) {
                            forceCollapse();
                        }
                    }
                });
            });

            visibilityObserver.observe(fanArea, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });

            // 메모리 정리
            const cleanup = () => {
                themeObserver.disconnect();
                visibilityObserver.disconnect();
            };
            window.addEventListener('beforeunload', cleanup);
        }
    };

    // 유틸리티 함수

    // DOM 변경 감시
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    BoardMenuManager.relocateBoardMenu();
                    BadgeManager.reapplyBadgesIfNeeded();

                    if (!State.fanAreaProcessed) {
                        FanAreaManager.setupFanAreaCollapse();
                    }

                    // 게시판 메뉴 변경 감지 시 뱃지 처리 (더 신중하게)
                    if (!State.boardBadgeProcessed && !State.boardBadgeInProgress) {
                        // 약간 더 긴 지연 후 확인
                        setTimeout(() => {
                            if (!State.boardBadgeProcessed && !State.boardBadgeInProgress) {
                                const boardContainer = BoardMenuManager.findBoardMenuContainer();
                                if (boardContainer) {
                                    const boardItems = boardContainer.querySelectorAll('li, a, button, [role="menuitem"]');
                                    const validItems = Array.from(boardItems).filter(item => {
                                        const text = item.textContent ? item.textContent.trim() : '';
                                        return text && text !== '게시판';
                                    });
                                    if (validItems.length > 0) {
                                        BadgeManager.checkBoardBadge();
                                    }
                                }
                            }
                        }, CONFIG.TIME.BOARD_BADGE_DELAY_MS * 2); // 더 긴 지연
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), CONFIG.TIME.OBSERVER_TIMEOUT_MS);
    }

    // 게시판 메뉴 감시
    function setupBoardMenuWatcher() {
        const boardWatcher = setInterval(() => {
            const boardContainer = BoardMenuManager.findBoardMenuContainer();
            if (boardContainer && !State.boardBadgeProcessed && !State.boardBadgeInProgress) {
                // 게시판 메뉴가 실제로 아이템을 가지고 있는지 확인
                const boardItems = boardContainer.querySelectorAll('li, a, button, [role="menuitem"]');
                const validItems = Array.from(boardItems).filter(item => {
                    const text = item.textContent ? item.textContent.trim() : '';
                    return text && text !== '게시판';
                });

                // 최소 1개 이상의 유효한 게시판 아이템이 있어야 처리 시작
                if (validItems.length > 0) {
                    BadgeManager.checkBoardBadge();
                    clearInterval(boardWatcher);
                }
            }
        }, CONFIG.TIME.BOARD_WATCHER_INTERVAL_MS);

        setTimeout(() => clearInterval(boardWatcher), CONFIG.TIME.OBSERVER_TIMEOUT_MS);
    }

    // 초기화
    function init() {
        if (State.initExecuted) return;
        State.initExecuted = true;

        // 초기 실행 (게시판 뱃지 제외)
        StyleManager.initCustomStyles();
        BoardMenuManager.relocateBoardMenu();
        FanAreaManager.setupFanAreaCollapse();

        // 지속적 모니터링
        const monitorInterval = setInterval(() => {
            BoardMenuManager.relocateBoardMenu();
            BadgeManager.reapplyBadgesIfNeeded();
        }, CONFIG.TIME.MONITOR_INTERVAL_MS);

        setTimeout(() => {
            if (!State.fanAreaProcessed) {
                FanAreaManager.setupFanAreaCollapse();
            }
        }, CONFIG.TIME.FAN_AREA_DELAY_MS);

        setTimeout(() => clearInterval(monitorInterval), CONFIG.TIME.OBSERVER_TIMEOUT_MS);

        setupObserver();
        setupBoardMenuWatcher();

        // 추가: 페이지 로드 후 일정 시간 대기 후 뱃지 처리 시도
        setTimeout(() => {
            if (!State.boardBadgeProcessed && !State.boardBadgeInProgress) {
                const boardContainer = BoardMenuManager.findBoardMenuContainer();
                if (boardContainer) {
                    const boardItems = boardContainer.querySelectorAll('li, a, button, [role="menuitem"]');
                    const validItems = Array.from(boardItems).filter(item => {
                        const text = item.textContent ? item.textContent.trim() : '';
                        return text && text !== '게시판';
                    });
                    if (validItems.length > 0) {
                        BadgeManager.checkBoardBadge();
                    }
                }
            }
        }, 3000); // 3초 후 시도
    }

    // 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();