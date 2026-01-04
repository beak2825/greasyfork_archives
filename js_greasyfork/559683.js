// ==UserScript==
// @name         멜론 음원 정보 수정 도구
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  멜론 구매 내역 테이블 정보 수정 도구
// @author       You
// @match        *://www.melon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559683/%EB%A9%9C%EB%A1%A0%20%EC%9D%8C%EC%9B%90%20%EC%A0%95%EB%B3%B4%20%EC%88%98%EC%A0%95%20%EB%8F%84%EA%B5%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/559683/%EB%A9%9C%EB%A1%A0%20%EC%9D%8C%EC%9B%90%20%EC%A0%95%EB%B3%B4%20%EC%88%98%EC%A0%95%20%EB%8F%84%EA%B5%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 설정 및 상수 ====================
    const CONFIG = {
        PANEL_ID: 'melon-editor-panel',
        COLORS: {
            PRIMARY: '#00CD3C',
            PRIMARY_HOVER: '#00B034',
            PRIMARY_ACTIVE: '#009A2C',
            SECONDARY: '#FF6B00',
            SECONDARY_HOVER: '#E55F00',
            CLOSE_HOVER: '#FF0000'
        },
        SELECTORS: {
            ELLIPSIS_LINK: '.ellipsis a',
            WRAP: '.wrap',
            DIV: 'div',
            TABLE: 'table',
            THEAD: 'thead',
            TBODY: 'tbody',
            TH: 'th',
            TR: 'tr',
            TD: 'td'
        }
    };

    // ==================== 전역 변수 ====================
    let targetTable = null;
    let columnIndexes = {};

    // ==================== DOM 유틸리티 ====================
    const DOMUtils = {
        /**
         * 테이블 존재 여부 확인
         * @returns {boolean}
         */
        checkTableExists() {
            const tables = document.querySelectorAll(CONFIG.SELECTORS.TABLE);
            if (tables.length === 0) return false;

            targetTable = tables[0];
            return true;
        },

        /**
         * 테이블 컬럼 헤더 파싱
         */
        parseTableColumns() {
            if (!targetTable) return;

            const thead = targetTable.querySelector(CONFIG.SELECTORS.THEAD);
            if (!thead) return;

            const headers = thead.querySelectorAll(CONFIG.SELECTORS.TH);
            headers.forEach((th, index) => {
                const text = th.textContent.trim();
                columnIndexes[text] = index;
            });

            console.log('컬럼 인덱스:', columnIndexes);
        },

        /**
         * 요소에서 타겟 셀렉터 찾기
         * @param {HTMLElement} cell - 검색할 셀
         * @param {string} primarySelector - 주 셀렉터
         * @param {string} fallbackSelector - 대체 셀렉터
         * @returns {HTMLElement|null}
         */
        findTargetElement(cell, primarySelector, fallbackSelector) {
            const primary = cell.querySelector(primarySelector);
            if (primary) return primary;

            return cell.querySelector(fallbackSelector);
        }
    };

    // ==================== 날짜 유틸리티 ====================
    const DateUtils = {
        /**
         * 오늘 날짜를 yyyy.mm.dd 형식으로 반환
         * @returns {string}
         */
        getTodayFormatted() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}.${month}.${day}`;
        }
    };

    // ==================== 테이블 수정 기능 ====================
    const TableEditor = {
        /**
         * 구매일 변경
         */
        changePurchaseDate() {
            const dateColumnIndex = columnIndexes['구매일'];
            if (dateColumnIndex === undefined) {
                alert('구매일 컬럼을 찾을 수 없습니다.');
                return;
            }

            const formattedDate = DateUtils.getTodayFormatted();
            const tbody = targetTable.querySelector(CONFIG.SELECTORS.TBODY);

            if (!tbody) {
                alert('테이블 본문을 찾을 수 없습니다.');
                return;
            }

            const rows = tbody.querySelectorAll(CONFIG.SELECTORS.TR);
            let changedCount = 0;

            rows.forEach(row => {
                const cells = row.querySelectorAll(CONFIG.SELECTORS.TD);
                if (cells[dateColumnIndex]) {
                    const targetDiv = cells[dateColumnIndex].querySelector(CONFIG.SELECTORS.DIV);
                    if (targetDiv) {
                        targetDiv.textContent = formattedDate;
                        changedCount++;
                    }
                }
            });

            alert(`${changedCount}개의 구매일이 ${formattedDate}로 변경되었습니다.`);
        },

        /**
         * 공통 컬럼 값 변경 (앨범명, 아티스트)
         * @param {string} columnName - 컬럼명
         * @param {string} newValue - 새 값
         */
        changeColumnValue(columnName, newValue) {
            const columnIndex = columnIndexes[columnName];
            if (columnIndex === undefined) {
                alert(`${columnName} 컬럼을 찾을 수 없습니다.`);
                return;
            }

            const tbody = targetTable.querySelector(CONFIG.SELECTORS.TBODY);
            if (!tbody) {
                alert('테이블 본문을 찾을 수 없습니다.');
                return;
            }

            const rows = tbody.querySelectorAll(CONFIG.SELECTORS.TR);
            let changedCount = 0;

            rows.forEach(row => {
                const cells = row.querySelectorAll(CONFIG.SELECTORS.TD);
                if (cells[columnIndex]) {
                    const targetElement = DOMUtils.findTargetElement(
                        cells[columnIndex],
                        CONFIG.SELECTORS.ELLIPSIS_LINK,
                        CONFIG.SELECTORS.DIV
                    );

                    if (targetElement) {
                        targetElement.textContent = newValue;
                        changedCount++;
                    }
                }
            });

            alert(`${changedCount}개의 ${columnName}이(가) "${newValue}"(으)로 변경되었습니다.`);
        },

        /**
         * 곡명 순차 변경
         * @param {Array<string>} songList - 곡명 배열
         */
        changeSongNames(songList) {
            const columnIndex = columnIndexes['곡명'];
            if (columnIndex === undefined) {
                alert('곡명 컬럼을 찾을 수 없습니다.');
                return;
            }

            const tbody = targetTable.querySelector(CONFIG.SELECTORS.TBODY);
            if (!tbody) {
                alert('테이블 본문을 찾을 수 없습니다.');
                return;
            }

            const rows = tbody.querySelectorAll(CONFIG.SELECTORS.TR);
            let changedCount = 0;

            rows.forEach((row, index) => {
                if (index >= songList.length) return;

                const cells = row.querySelectorAll(CONFIG.SELECTORS.TD);
                if (cells[columnIndex]) {
                    const wrap = cells[columnIndex].querySelector(CONFIG.SELECTORS.WRAP);

                    if (wrap) {
                        const aTags = wrap.querySelectorAll('a');
                        if (aTags.length > 0) {
                            const lastATag = aTags[aTags.length - 1];
                            lastATag.textContent = songList[index];
                            changedCount++;
                        }
                    } else {
                        const targetDiv = cells[columnIndex].querySelector(CONFIG.SELECTORS.DIV);
                        if (targetDiv) {
                            targetDiv.textContent = songList[index];
                            changedCount++;
                        }
                    }
                }
            });

            alert(`${changedCount}개의 곡명이 변경되었습니다.`);
        }
    };

    // ==================== UI 관리 ====================
    const UIManager = {
        /**
         * 입력 폼 표시
         * @param {string} type - 폼 타입 ('album', 'artist', 'song')
         */
        showInputForm(type) {
            const container = document.getElementById('input-container');
            const formConfigs = {
                album: {
                    label: '앨범명 입력',
                    placeholder: '변경할 앨범명을 입력하세요',
                    inputId: 'album-input',
                    eventName: 'applyAlbum',
                    inputType: 'text'
                },
                artist: {
                    label: '아티스트 입력',
                    placeholder: '변경할 아티스트명을 입력하세요',
                    inputId: 'artist-input',
                    eventName: 'applyArtist',
                    inputType: 'text'
                },
                song: {
                    label: '곡명 입력 (배열 형식)',
                    placeholder: '["곡명1", "곡명2", "곡명3"]',
                    inputId: 'song-input',
                    eventName: 'applySongs',
                    inputType: 'textarea'
                }
            };

            const config = formConfigs[type];
            if (!config) return;

            const inputElement = config.inputType === 'textarea'
                ? `<textarea id="${config.inputId}" placeholder='${config.placeholder}'></textarea>`
                : `<input type="text" id="${config.inputId}" placeholder="${config.placeholder}">`;

            const helpText = type === 'song'
                ? `<small style="color: #666; font-size: 11px; display: block; margin-top: 5px;">
                    * 여러 곡명을 입력하려면 배열 형식으로 입력하세요.<br>
                    * 입력한 순서대로 위에서부터 적용됩니다.
                   </small>`
                : '';

            container.innerHTML = `
                <div class="input-group">
                    <label>${config.label}</label>
                    ${inputElement}
                    ${helpText}
                    <button onclick="this.dispatchEvent(new CustomEvent('${config.eventName}', {bubbles: true}))">적용</button>
                </div>
            `;

            this.attachFormHandler(type, config);
        },

        /**
         * 폼 핸들러 연결
         * @param {string} type - 폼 타입
         * @param {Object} config - 폼 설정
         */
        attachFormHandler(type, config) {
            const container = document.getElementById('input-container');

            document.addEventListener(config.eventName, function handler() {
                const inputElement = document.getElementById(config.inputId);
                const value = inputElement.value.trim();

                if (!value) {
                    alert(`${config.label}을(를) 입력해주세요.`);
                    document.removeEventListener(config.eventName, handler);
                    return;
                }

                if (type === 'song') {
                    try {
                        const songList = JSON.parse(value);

                        if (!Array.isArray(songList)) {
                            throw new Error('배열 형식이 아닙니다.');
                        }

                        if (songList.length === 0) {
                            alert('최소 하나 이상의 곡명을 입력해주세요.');
                            document.removeEventListener(config.eventName, handler);
                            return;
                        }

                        TableEditor.changeSongNames(songList);
                        container.innerHTML = '';
                    } catch (error) {
                        alert('입력 형식이 올바르지 않습니다.\n배열 형식으로 입력해주세요.\n예: ["곡명1", "곡명2", "곡명3"]');
                    }
                } else {
                    const columnName = type === 'album' ? '앨범' : '아티스트';
                    TableEditor.changeColumnValue(columnName, value);
                    container.innerHTML = '';
                }

                document.removeEventListener(config.eventName, handler);
            });
        },

        /**
         * 패널 닫기
         */
        closePanel() {
            const panel = document.getElementById(CONFIG.PANEL_ID);
            panel.classList.add('hidden');
        }
    };

    // ==================== 스타일 생성 ====================
    const StyleManager = {
        createStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #${CONFIG.PANEL_ID} {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: white;
                    border: 2px solid ${CONFIG.COLORS.PRIMARY};
                    border-radius: 8px;
                    padding: 15px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 9999;
                    min-width: 250px;
                    font-family: 'Malgun Gothic', sans-serif;
                }
                #${CONFIG.PANEL_ID}.hidden {
                    display: none;
                }
                .panel-header {
                    font-weight: bold;
                    font-size: 16px;
                    margin-bottom: 15px;
                    color: ${CONFIG.COLORS.PRIMARY};
                    text-align: center;
                    border-bottom: 2px solid ${CONFIG.COLORS.PRIMARY};
                    padding-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .close-btn {
                    background: transparent;
                    border: none;
                    color: ${CONFIG.COLORS.PRIMARY};
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    line-height: 20px;
                    transition: transform 0.2s;
                }
                .close-btn:hover {
                    transform: scale(1.2);
                    color: ${CONFIG.COLORS.CLOSE_HOVER};
                }
                .panel-content {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .panel-btn {
                    padding: 10px 15px;
                    background: ${CONFIG.COLORS.PRIMARY};
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: background 0.2s;
                }
                .panel-btn:hover {
                    background: ${CONFIG.COLORS.PRIMARY_HOVER};
                }
                .panel-btn:active {
                    background: ${CONFIG.COLORS.PRIMARY_ACTIVE};
                }
                #input-container {
                    margin-top: 10px;
                }
                .input-group {
                    margin-bottom: 10px;
                }
                .input-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 13px;
                    color: #333;
                    font-weight: bold;
                }
                .input-group input, .input-group textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 13px;
                    box-sizing: border-box;
                }
                .input-group textarea {
                    min-height: 80px;
                    resize: vertical;
                    font-family: 'Malgun Gothic', monospace;
                }
                .input-group button {
                    width: 100%;
                    margin-top: 5px;
                    padding: 8px;
                    background: ${CONFIG.COLORS.SECONDARY};
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .input-group button:hover {
                    background: ${CONFIG.COLORS.SECONDARY_HOVER};
                }
            `;
            return style;
        }
    };

    // ==================== 패널 생성 ====================
    const PanelManager = {
        createPanel() {
            const panel = document.createElement('div');
            panel.id = CONFIG.PANEL_ID;
            panel.innerHTML = `
                <div class="panel-header">
                    멜론 정보 수정 도구
                    <button id="btn-close-panel" class="close-btn">×</button>
                </div>
                <div class="panel-content">
                    <button id="btn-change-date" class="panel-btn">구매일 변경</button>
                    <button id="btn-change-album" class="panel-btn">앨범명 변경</button>
                    <button id="btn-change-artist" class="panel-btn">아티스트 변경</button>
                    <button id="btn-change-song" class="panel-btn">곡명 변경</button>
                    <div id="input-container"></div>
                </div>
            `;

            const style = StyleManager.createStyles();
            document.head.appendChild(style);
            document.body.appendChild(panel);

            this.attachEventListeners();
        },

        attachEventListeners() {
            document.getElementById('btn-change-date').addEventListener('click', () => TableEditor.changePurchaseDate());
            document.getElementById('btn-change-album').addEventListener('click', () => UIManager.showInputForm('album'));
            document.getElementById('btn-change-artist').addEventListener('click', () => UIManager.showInputForm('artist'));
            document.getElementById('btn-change-song').addEventListener('click', () => UIManager.showInputForm('song'));
            document.getElementById('btn-close-panel').addEventListener('click', () => UIManager.closePanel());
        }
    };

    // ==================== 초기화 ====================
    function init() {
        // 테이블 존재 확인
        if (!DOMUtils.checkTableExists()) {
            console.log('테이블을 찾을 수 없습니다.');
            return;
        }

        // 컬럼 인덱스 파싱
        DOMUtils.parseTableColumns();

        // UI 패널 생성
        PanelManager.createPanel();
    }

    // ==================== 실행 ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
