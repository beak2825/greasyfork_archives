// ==UserScript==
// @name        언네임드 카페 주차별 과제 관리
// @namespace   https://kus-unnamed.duckdns.org
// @version     2.3
// @description 언네임드의 부서 주차별 과제 관리 프로그램입니다. (6가지 상태 선택 기능 포함 - 지각제출 추가)
// @author      You
// @match       https://cafe.naver.com/f-e/cafes/25915750/menus/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549859/%EC%96%B8%EB%84%A4%EC%9E%84%EB%93%9C%20%EC%B9%B4%ED%8E%98%20%EC%A3%BC%EC%B0%A8%EB%B3%84%20%EA%B3%BC%EC%A0%9C%20%EA%B4%80%EB%A6%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549859/%EC%96%B8%EB%84%A4%EC%9E%84%EB%93%9C%20%EC%B9%B4%ED%8E%98%20%EC%A3%BC%EC%B0%A8%EB%B3%84%20%EA%B3%BC%EC%A0%9C%20%EA%B4%80%EB%A6%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL 패턴 확인
    const currentUrl = window.location.href;
    const urlPattern = /https:\/\/cafe\.naver\.com\/f-e\/cafes\/25915750\/menus\/\d+/;

    if (!urlPattern.test(currentUrl)) {
        console.log('이 스크립트는 지정된 네이버 카페 URL에서만 작동합니다.');
        return;
    }

    console.log('언네임드 주차별 과제 관리가 로드되었습니다.');

    // ==========================================
    // 1. IndexedDB 관련 함수들 (게시글 저장소)
    // ==========================================
    const DB_NAME = 'NaverCafeArticles';
    const DB_VERSION = 3;
    const STORE_NAME = 'articles';

    let lastProcessedUrl = '';
    let lastProcessedPage = '';

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const existingElement = document.querySelector(selector);
            if (existingElement) {
                resolve(existingElement);
                return;
            }
            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            if (timeout > 0 && timeout < Infinity) setTimeout(() => {
                observer.disconnect();
                reject(new Error(`요소를 찾을 수 없습니다: ${selector}`));
            }, timeout);
        });
    }

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'IDX' });
                    store.createIndex('url', 'URL', { unique: false });
                    store.createIndex('date', '작성일', { unique: false });
                    store.createIndex('pathname', 'pathname', { unique: false });
                }
            };
        });
    }

    function getCurrentUrlInfo() {
        const url = new URL(window.location.href);
        const pathname = url.pathname;
        const page = url.searchParams.get('page') || '1';
        return { pathname, page };
    }

    function hasUrlChanged() {
        const current = getCurrentUrlInfo();
        const hasChanged = current.pathname !== lastProcessedUrl || current.page !== lastProcessedPage;
        if (hasChanged) {
            lastProcessedUrl = current.pathname;
            lastProcessedPage = current.page;
        }
        return hasChanged;
    }

    async function getArticleByIDX(idx) {
        try {
            const db = await openDB();
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            return new Promise((resolve, reject) => {
                const request = store.get(idx);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            return null;
        }
    }

    async function saveArticlesToDB(articleList) {
        try {
            const db = await openDB();
            const currentUrlInfo = getCurrentUrlInfo();

            const duplicateCheckPromises = articleList.map(async (article) => {
                const existingArticle = await getArticleByIDX(article.IDX);
                return { article, isDuplicate: !!existingArticle };
            });

            const checkResults = await Promise.all(duplicateCheckPromises);
            const newArticles = checkResults.filter(result => !result.isDuplicate);

            if (newArticles.length > 0) {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const savePromises = newArticles.map(({ article }) => {
                    return new Promise((resolve, reject) => {
                        const addRequest = store.add({
                            ...article,
                            pathname: currentUrlInfo.pathname,
                            저장시간: new Date().toISOString()
                        });
                        addRequest.onsuccess = () => resolve();
                        addRequest.onerror = () => reject(addRequest.error);
                    });
                });
                await Promise.all(savePromises);
            }
            return true;
        } catch (error) {
            console.error('IndexedDB 저장 중 오류:', error);
            return false;
        }
    }

    async function getArticlesByCurrentPathname() {
        try {
            const db = await openDB();
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const currentPathname = getCurrentUrlInfo().pathname;

            if (store.indexNames.contains('pathname')) {
                const pathnameIndex = store.index('pathname');
                return new Promise((resolve, reject) => {
                    const request = pathnameIndex.getAll(currentPathname);
                    request.onsuccess = () => {
                        const articles = request.result;
                        articles.sort((a, b) => (parseInt(b.IDX) || 0) - (parseInt(a.IDX) || 0));
                        resolve(articles);
                    };
                    request.onerror = () => reject(request.error);
                });
            } else {
                return new Promise((resolve, reject) => {
                    const request = store.getAll();
                    request.onsuccess = () => {
                        const filtered = request.result.filter(a => a.pathname === currentPathname);
                        filtered.sort((a, b) => (parseInt(b.IDX) || 0) - (parseInt(a.IDX) || 0));
                        resolve(filtered);
                    };
                    request.onerror = () => reject(request.error);
                });
            }
        } catch (error) {
            return [];
        }
    }


    // ==========================================
    // 2. LocalStorage 관리 함수 (작성자 & 오버라이드)
    // ==========================================

    function getSavedWriters() {
        try {
            const saved = localStorage.getItem('naverCafeSavedWriters');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }
    function saveWriters(writers) {
        localStorage.setItem('naverCafeSavedWriters', JSON.stringify(writers));
    }
    function addWriter(writerName) {
        const savedWriters = getSavedWriters();
        if (!savedWriters.includes(writerName)) {
            savedWriters.push(writerName);
            saveWriters(savedWriters);
        }
    }
    function removeWriter(writerName) {
        const savedWriters = getSavedWriters();
        const filtered = savedWriters.filter(name => name !== writerName);
        if (filtered.length !== savedWriters.length) saveWriters(filtered);
    }

    // [New] 상태 오버라이드 관리
    // 저장 가능한 값: 'EXCUSED'(사유), 'MANUAL'(수동), 'REJECTED'(미인정), 'LATE'(지각), null(자동)
    const OVERRIDE_KEY = 'naverCafeWeekOverrides';

    function getManualOverrides() {
        try {
            const saved = localStorage.getItem(OVERRIDE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('오버라이드 데이터 로드 실패', e);
            return {};
        }
    }

    function saveManualOverride(key, status) {
        const overrides = getManualOverrides();
        // status가 null이면 "자동 모드" (키 삭제)
        if (status === null || status === 'AUTO') {
            delete overrides[key];
        } else {
            overrides[key] = status;
        }
        localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
    }

    function generateOverrideKey(semester, week, writer) {
        return `${semester}_${week}_${writer}`;
    }

    // ==========================================
    // 3. 데이터 처리 로직
    // ==========================================

    function groupArticlesBySemester(articles) {
        const grouped = {};
        articles.forEach(article => {
            if (!grouped[article.학기]) grouped[article.학기] = [];
            grouped[article.학기].push(article);
        });
        return grouped;
    }

    function createWeekCompletionTable(articles, savedWriters = null) {
        const articleWriters = [...new Set(articles.map(a => a.작성자))];
        if (!savedWriters) savedWriters = getSavedWriters();
        const allWriters = [...new Set([...savedWriters, ...articleWriters])];

        const writers = allWriters.sort((a, b) => {
            const aIsSaved = savedWriters.includes(a);
            const bIsSaved = savedWriters.includes(b);
            if (aIsSaved && !bIsSaved) return -1;
            if (!aIsSaved && bIsSaved) return 1;
            return a.slice(2).localeCompare(b.slice(2));
        });

        const weeks = [...new Set(articles.map(a => parseInt(a.주차)))].sort((a, b) => a - b);
        const writerWeekMap = {};
        writers.forEach(writer => {
            writerWeekMap[writer] = {};
            weeks.forEach(week => writerWeekMap[writer][week] = null);
        });

        articles.forEach(article => {
            const writer = article.작성자;
            const week = parseInt(article.주차);
            if (writerWeekMap[writer] && writerWeekMap[writer][week] === null) {
                writerWeekMap[writer][week] = article;
            }
        });

        return { writers, weeks, writerWeekMap };
    }

    // ==========================================
    // 4. UI 생성 및 이벤트 처리
    // ==========================================

    function createArticleListPopup() {
        const existingPopup = document.getElementById('article-list-popup');
        if (existingPopup) existingPopup.remove();

        const popupHTML = `
            <div id="article-list-popup" style="
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 80%; max-width: 1000px; height: 80%; max-height: 600px;
                background: white; border: 2px solid #333; border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10000;
                font-family: Arial, sans-serif; display: flex; flex-direction: column;
            ">
                <div style="background: #f5f5f5; padding: 15px; border-bottom: 1px solid #ddd; border-radius: 10px 10px 0 0; display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="margin: 0; color: #333;">주차별 과제 관리 페이지</h2>
                    <button id="close-popup" style="background: #ff4444; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">닫기</button>
                </div>
                <div style="flex: 1; overflow-y: auto; padding: 15px;">
                    <div id="article-list-content">
                        <div style="text-align: center; padding: 20px;">
                            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
                            <p>게시글 목록을 불러오는 중...</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="popup-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999;"></div>
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                /* 기본 UI */
                .semester-tabs { display: flex; margin-bottom: 20px; border-bottom: 2px solid #ddd; }
                .semester-tab { background: #f8f9fa; border: none; padding: 12px 20px; margin-right: 5px; border-radius: 8px 8px 0 0; cursor: pointer; }
                .semester-tab:hover { background: #e9ecef; }
                .semester-tab.active { background: #007bff; color: white; }
                .writer-management-tab.active { background: #6f42c1 !important; }

                .completion-table { width: 100%; border-collapse: collapse; background: white; font-size: 14px; }
                .completion-table th { background: #f8f9fa; padding: 12px; border: 1px solid #dee2e6; position: sticky; top: 0; z-index: 10; }
                .completion-table th:first-child { position: sticky; left: 0; z-index: 11; }
                .completion-table td { padding: 6px; text-align: center; border: 1px solid #dee2e6; }

                .writer-name { background: #f8f9fa; font-weight: 600; position: sticky; left: 0; z-index: 5; text-align: left; padding-left: 12px; }
                .saved-writer { background: #fff3cd !important; color: #856404 !important; }

                .week-cell { min-width: 80px; height: 50px; vertical-align: middle; transition: all 0.2s; }
                .week-cell a { text-decoration: none; font-weight: 500; padding: 2px 6px; border-radius: 4px; display: block; color: inherit; }

                /* =========================================
                   [상태별 스타일 정의]
                   ========================================= */

                /* 1. 사유제출 */
                .state-excused { background: #d1ecf1 !important; color: #0c5460; }

                /* 2. 수동제출 */
                .state-manual { background: #fff3cd !important; color: #856404; }

                /* 3. 미제출 (흰색 배경 / 검은 글씨) */
                .state-unsubmitted { background: #ffffff; color: #000000; }

                /* 4. 미인정 */
                .state-rejected { background: #f8d7da !important; color: #721c24; opacity: 0.9; }

                /* 5. 제출됨 (초록색) */
                .state-submitted { background: #d4edda; color: #155724; }
                .state-submitted:hover { background: #c3e6cb; }

                /* 6. 지각제출 (주황색 계열) */
                .state-late { background: #ffe8a1 !important; color: #856404; }

                /* Select Box 스타일 */
                .status-select {
                    font-size: 11px;
                    padding: 2px;
                    margin-bottom: 4px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    background: rgba(255,255,255,0.9);
                    width: 100%;
                    max-width: 90px;
                    cursor: pointer;
                }

                .presentation { border: 2px solid red; }
                .presentation::before { content: "🎙️"; }

                /* 부원 관리 스타일 */
                .writer-management-container { display: flex; gap: 30px; flex-wrap: wrap; }
                .writer-input-section, .current-writers-section { flex: 1; min-width: 300px; }
                #writer-input { width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ddd; }
                .button-group { margin-top: 10px; }
                .writers-list { max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin-top: 10px; background: #f9f9f9; }
                .writer-item { display: flex; justify-content: space-between; padding: 5px; background: white; margin-bottom: 5px; border: 1px solid #eee; }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', popupHTML);

        const closeBtn = document.getElementById('close-popup');
        const overlay = document.getElementById('popup-overlay');
        const closeFunc = () => {
            document.getElementById('article-list-popup').remove();
            overlay.remove();
        };
        closeBtn.addEventListener('click', closeFunc);
        overlay.addEventListener('click', closeFunc);

        loadArticlesInPopup();
    }

    async function loadArticlesInPopup() {
        try {
            const articles = await getArticlesByCurrentPathname();
            const contentDiv = document.getElementById('article-list-content');
            const currentPathname = getCurrentUrlInfo().pathname;

            if (articles.length === 0) {
                contentDiv.innerHTML = `<div style="text-align:center; padding:40px;"><h3>저장된 과제가 없습니다.</h3><p>현재 경로: ${currentPathname}</p></div>`;
                return;
            }

            // 현재 활성화된 탭 복원
            let currentActiveTab = 'writer-management';
            const activeBtn = contentDiv.querySelector('.semester-tab.active');
            if (activeBtn) {
                currentActiveTab = activeBtn.dataset.semester || activeBtn.dataset.tab;
            }

            const semesterGroups = groupArticlesBySemester(articles);
            const semesters = Object.keys(semesterGroups).sort((a, b) => b.localeCompare(a));
            const savedWriters = getSavedWriters();
            const manualOverrides = getManualOverrides();

            const statsHTML = `
                <div style="background:#e8f4fd; padding:10px; border-radius:5px; margin-bottom:15px;">
                    <strong>게시글 ${articles.length}개</strong> 저장됨 | 경로: ${currentPathname}
                </div>
            `;

            const tabsHTML = `
                <div class="semester-tabs">
                    <button class="semester-tab writer-management-tab ${currentActiveTab === 'writer-management' ? 'active' : ''}" data-tab="writer-management">부원 관리</button>
                    ${semesters.map((sem, idx) => `<button class="semester-tab ${currentActiveTab === sem ? 'active' : ''}" data-semester="${sem}">${sem}</button>`).join('')}
                </div>
            `;

            const writerManagementHTML = `
                <div class="semester-content writer-management-content" data-tab="writer-management" style="display: ${currentActiveTab === 'writer-management' ? 'block' : 'none'};">
                    <h3>부원 관리</h3>
                    <div class="writer-management-container">
                        <div class="writer-input-section">
                            <textarea id="writer-input" placeholder="이름 입력 (줄바꿈 구분)" rows="5"></textarea>
                            <div class="button-group">
                                <button id="add-writers-btn" style="background:#28a745; color:white; border:none; padding:5px 10px;">추가</button>
                                <button id="clear-input-btn" style="background:#6c757d; color:white; border:none; padding:5px 10px;">지우기</button>
                            </div>
                        </div>
                        <div class="current-writers-section">
                            <div style="display:flex; justify-content:space-between;">
                                <h4>저장된 부원 (${savedWriters.length}명)</h4>
                                ${savedWriters.length > 0 ? '<button id="clear-all-writers-btn" style="background:#dc3545; color:white; border:none; padding:2px 8px;">전체삭제</button>' : ''}
                            </div>
                            <div class="writers-list">
                                ${savedWriters.map(w => `
                                    <div class="writer-item">
                                        <span>🤓${w}</span>
                                        <button class="remove-writer-btn" data-writer="${w}" style="background:#dc3545; color:white; border:none; border-radius:50%; width:20px; height:20px;">×</button>
                                    </div>`).join('') || '<p style="color:#999; text-align:center;">없음</p>'}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const tablesHTML = semesters.map(semester => {
                const { writers, weeks, writerWeekMap } = createWeekCompletionTable(semesterGroups[semester], savedWriters);
                return `
                    <div class="semester-content" data-semester="${semester}" style="display: ${currentActiveTab === semester ? 'block' : 'none'};">
                        <h3>${semester} 현황</h3>
                        <p style="font-size:12px; margin-bottom:10px;">
                            <span style="display:inline-block; width:10px; height:10px; background:#d4edda; border:1px solid #c3e6cb;"></span> 제출됨(게시글)
                            <span style="display:inline-block; width:10px; height:10px; background:#d1ecf1; margin-left:8px;"></span> 사유제출
                            <span style="display:inline-block; width:10px; height:10px; background:#fff3cd; margin-left:8px;"></span> 수동제출
                            <span style="display:inline-block; width:10px; height:10px; background:#ffe8a1; margin-left:8px;"></span> 지각제출
                            <span style="display:inline-block; width:10px; height:10px; background:#f8d7da; margin-left:8px;"></span> 미인정
                            <span style="display:inline-block; width:10px; height:10px; background:#fff; border:1px solid #000; margin-left:8px;"></span> 미제출
                        </p>
                        <div class="table-container">
                            <table class="completion-table">
                                <thead>
                                    <tr>
                                        <th>작성자</th>
                                        ${weeks.map(week => `<th>${week}주</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${writers.map(writer => {
                                        const isSaved = savedWriters.includes(writer);
                                        return `
                                            <tr>
                                                <td class="writer-name ${isSaved ? 'saved-writer' : ''}">${isSaved ? '🤓' : ''}${writer}</td>
                                                ${weeks.map(week => {
                                                    const article = writerWeekMap[writer][week];
                                                    const hasArticle = !!article;
                                                    const overrideKey = generateOverrideKey(semester, week, writer);
                                                    let manualStatus = manualOverrides[overrideKey];

                                                    // 구버전 데이터 마이그레이션
                                                    if (manualStatus === true) manualStatus = 'MANUAL';
                                                    if (manualStatus === false) manualStatus = 'REJECTED';

                                                    let statusClass = '';
                                                    let autoLabel = '';

                                                    if (manualStatus === 'EXCUSED') statusClass = 'state-excused';
                                                    else if (manualStatus === 'MANUAL') statusClass = 'state-manual';
                                                    else if (manualStatus === 'REJECTED') statusClass = 'state-rejected';
                                                    else if (manualStatus === 'LATE') statusClass = 'state-late';
                                                    else if (hasArticle) {
                                                        statusClass = 'state-submitted';
                                                        autoLabel = '제출됨(게시글)';
                                                    } else {
                                                        statusClass = 'state-unsubmitted';
                                                        autoLabel = '미제출';
                                                    }

                                                    let content = '';
                                                    if (article) {
                                                        const route = article.제목?.includes("A루트") ? "A루트" : "B루트";
                                                        const isPres = article.제목?.includes("[발표]");
                                                        content = `<a href="${article.URL}" target="_blank" class="${isPres?'presentation':''}">${route}<br><small>${article.작성일.substring(5)}</small></a>`;
                                                    } else {
                                                        content = `<span style="color:#ccc;">-</span>`;
                                                    }

                                                    return `
                                                        <td class="week-cell ${statusClass}">
                                                            <div style="display:flex; flex-direction:column; align-items:center;">
                                                                <select class="status-select" data-key="${overrideKey}">
                                                                    <option value="AUTO" ${!manualStatus ? 'selected' : ''}>${autoLabel}</option>
                                                                    <option value="EXCUSED" ${manualStatus==='EXCUSED' ? 'selected' : ''}>사유제출</option>
                                                                    <option value="MANUAL" ${manualStatus==='MANUAL' ? 'selected' : ''}>수동제출</option>
                                                                    <option value="LATE" ${manualStatus==='LATE' ? 'selected' : ''}>지각제출</option>
                                                                    <option value="REJECTED" ${manualStatus==='REJECTED' ? 'selected' : ''}>미인정</option>
                                                                </select>
                                                                ${content}
                                                            </div>
                                                        </td>
                                                    `;
                                                }).join('')}
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            }).join('');

            contentDiv.innerHTML = statsHTML + tabsHTML + writerManagementHTML + tablesHTML;

            setTimeout(() => {
                const tabButtons = contentDiv.querySelectorAll('.semester-tab');
                const contentDivs = contentDiv.querySelectorAll('.semester-content');

                tabButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        tabButtons.forEach(b => b.classList.remove('active'));
                        contentDivs.forEach(d => d.style.display = 'none');
                        btn.classList.add('active');

                        if (btn.dataset.tab === 'writer-management') {
                            contentDiv.querySelector('.writer-management-content').style.display = 'block';
                        } else {
                            contentDiv.querySelector(`.semester-content[data-semester="${btn.dataset.semester}"]`).style.display = 'block';
                        }
                    });
                });

                // [Select 변경 이벤트]
                contentDiv.addEventListener('change', (e) => {
                    if (e.target.classList.contains('status-select')) {
                        const select = e.target;
                        const key = select.dataset.key;
                        const value = select.value;
                        saveManualOverride(key, value);
                        loadArticlesInPopup(); // 리렌더링
                    }
                });

                // 부원 관리 버튼 이벤트들
                const addBtn = document.getElementById('add-writers-btn');
                if (addBtn) {
                    addBtn.addEventListener('click', () => {
                        const input = document.getElementById('writer-input');
                        const names = input.value.split('\n').map(n => n.trim()).filter(n => n);
                        if(names.length) {
                            names.forEach(n => addWriter(n));
                            loadArticlesInPopup();
                        }
                    });
                }
                contentDiv.addEventListener('click', (e) => {
                    if(e.target.id === 'clear-input-btn') {
                        document.getElementById('writer-input').value = '';
                    }
                    if(e.target.classList.contains('remove-writer-btn')) {
                        if(confirm('삭제?')) {
                            removeWriter(e.target.dataset.writer);
                            loadArticlesInPopup();
                        }
                    }
                    if(e.target.id === 'clear-all-writers-btn') {
                        if(confirm('전체 삭제?')) {
                            saveWriters([]);
                            loadArticlesInPopup();
                        }
                    }
                });

            }, 50);

        } catch (error) {
            console.error(error);
            document.getElementById('article-list-content').innerHTML = `<div style="padding:20px;">오류: ${error.message}</div>`;
        }
    }

    function extractWeekFromTitle(title) {
        title = title.replace(/^\[발표\]/, '');
        const weekMatch = title.match(/^(\d+)주차/);
        return weekMatch ? weekMatch[1] : null;
    }

    function convertDateToSemester(dateString) {
        const match = dateString.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})\./);
        if (!match) return null;
        const y = parseInt(match[1]), m = parseInt(match[2]);

        if (m >= 3 && m <= 8) return `${y}-1학기`;
        if (m >= 9 && m <= 12) return `${y}-2학기`;
        if (m >= 1 && m <= 2) return `${y-1}-2학기`;
        return null;
    }

    function getArticleList() {
        const rows = document.querySelectorAll('.article-table tbody:has(.td_normal.type_articleNumber) tr');
        const list = [];
        rows.forEach(row => {
            try {
                const idx = row.querySelector('.td_normal.type_articleNumber')?.textContent.trim();
                const titleLink = row.querySelector('a.article');
                const title = titleLink?.textContent.trim();
                const url = titleLink?.href;
                const writer = row.querySelector('.ArticleBoardWriterInfo span.nickname')?.textContent.trim();
                let date = row.querySelector('.td_normal.type_date')?.textContent.trim();

                if (idx && title && writer && date) {
                    const week = extractWeekFromTitle(title);
                    if (!week) return;
                    if (date.includes(":")) date = (new Date()).toISOString().split("T")[0].replace(/-/g, ".") + ".";
                    const semester = convertDateToSemester(date);
                    if (semester) {
                        list.push({ IDX: idx, 제목: title, URL: url, 작성자: writer, 작성일: date, 주차: week, 학기: semester });
                    }
                }
            } catch (e) {}
        });
        return list;
    }

    async function processArticleList() {
        const list = getArticleList();
        if (hasUrlChanged() && list.length) {
            await saveArticlesToDB(list);
        }
    }

    function addArticleListButton() {
        if (document.getElementById('article-list-button')) return;
        const btn = document.createElement('button');
        btn.id = 'article-list-button';
        btn.innerHTML = '📋 과제 관리';
        Object.assign(btn.style, {
            position: 'fixed', top: '20px', right: '20px',
            background: '#3498db', color: 'white', border: 'none',
            padding: '12px 20px', borderRadius: '25px', cursor: 'pointer',
            fontWeight: 'bold', boxShadow: '0 4px 12px rgba(52,152,219,0.3)', zIndex: '9998'
        });
        btn.onclick = createArticleListPopup;
        document.body.appendChild(btn);
    }

    async function init() {
        try {
            await waitForElement('#cafe_content');
            await waitForElement('.article-board');
            addArticleListButton();

            document.addEventListener('keydown', e => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                    e.preventDefault();
                    createArticleListPopup();
                }
            });

            setupCafeContentObserver();
            await processArticleList();
        } catch (e) {
            addArticleListButton();
        }
    }

    let cafeContentObserver = null;
    function setupCafeContentObserver() {
        if (cafeContentObserver) cafeContentObserver.disconnect();
        const content = document.querySelector('#cafe_content');
        if (content) {
            cafeContentObserver = new MutationObserver(muts => {
                const added = muts.some(m => Array.from(m.addedNodes).some(n => n.querySelector && n.querySelector('.article-board')));
                if (added) processArticleList();
            });
            cafeContentObserver.observe(content, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

    window.addEventListener('popstate', () => setTimeout(init, 100));

})();