// ==UserScript==
// @name         문제 필터링 탭
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  전체보기/틀린문제 보기 탭 추가
// @match        https://docs.google.com/forms/d/e/*/viewscore*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551157/%EB%AC%B8%EC%A0%9C%20%ED%95%84%ED%84%B0%EB%A7%81%20%ED%83%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/551157/%EB%AC%B8%EC%A0%9C%20%ED%95%84%ED%84%B0%EB%A7%81%20%ED%83%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 상수 정의
    const CONSTANTS = {
        SELECTORS: {
            LIST_CONTAINER: 'div[role="list"]',
            WRONG_LABEL: '[aria-label="틀림"], [aria-label="Incorrect"]',
            RESULT_SPAN: '.result-span'
        },
        INDICES: {
            DEFAULT_CAROUSEL_START: 3,
            WRONG_MODE_CAROUSEL_START: 4
        },
        TIMEOUTS: {
            ELEMENT_WAIT: 10000
        },
        MODES: {
            ALL: 'all',
            WRONG: 'wrong'
        }
    };

    // CSS 색상 정의
    const COLORS = {
        PRIMARY: '#007bff',
        PRIMARY_HOVER: '#0056b3',
        SUCCESS: '#28a745',
        SECONDARY: '#6c757d',
        INFO: '#2196F3',
        INFO_DARK: '#1976D2',
        LIGHT_BLUE: '#e3f2fd',
        GRAY_LIGHT: '#f5f5f5',
        BORDER: '#ddd'
    };

    console.log('[문제 필터링 탭] 스크립트 시작!');
    console.log('[문제 필터링 탭] 현재 URL:', window.location.href);

    // 비즈니스 로직 함수들
    const businessLogic = {
        // 틀린 문제 번호 추출
        extractWrongNumbers(listContainer) {
            const items = listContainer.children;
            const wrongNumbers = [];

            for (let i = CONSTANTS.INDICES.DEFAULT_CAROUSEL_START; i < items.length; i++) {
                const number = this.extractNumberFromItem(items[i]);
                if (number) {
                    wrongNumbers.push(number);
                }
            }

            return wrongNumbers;
        },

        // 개별 아이템에서 틀린 문제 번호 추출
        extractNumberFromItem(item) {
            const wrongLabel = item.querySelector(CONSTANTS.SELECTORS.WRONG_LABEL);
            if (!wrongLabel) return null;

            const nextSibling = wrongLabel.nextElementSibling;
            if (!nextSibling) return null;

            const boldText = nextSibling.querySelector('span > b');
            if (!boldText) return null;

            return boldText.textContent.replace(/\[|\]/g, '');
        },

        // 결과 UI 생성 및 삽입
        createAndInsertResultUI(listContainer, wrongNumbers, state, updateCarousel, chipButtons) {
            // 기존 결과 제거
            const existing = document.querySelector(CONSTANTS.SELECTORS.RESULT_SPAN);
            if (existing) existing.remove();

            if (listContainer.children.length < CONSTANTS.INDICES.WRONG_MODE_CAROUSEL_START) {
                return;
            }

            const referenceElement = listContainer.children[CONSTANTS.INDICES.DEFAULT_CAROUSEL_START];
            const resultElement = this.createResultElement(wrongNumbers, state, updateCarousel, chipButtons);
            listContainer.insertBefore(resultElement, referenceElement);
        },

        // 결과 요소 생성
        createResultElement(wrongNumbers, state, updateCarousel, chipButtons) {
            const resultSpan = utils.createContainer({
                display: 'block',
                margin: '10px 0',
                padding: '15px',
                backgroundColor: COLORS.LIGHT_BLUE,
                borderRadius: '5px',
                fontWeight: 'bold',
                flexShrink: '0'
            });
            resultSpan.className = 'result-span';

            // 제목 추가
            const title = this.createTitle(wrongNumbers.length);
            resultSpan.appendChild(title);

            // 칩 컨테이너 추가 (틀린 문제가 있는 경우)
            if (wrongNumbers.length > 0) {
                const chipContainer = this.createChipContainer(wrongNumbers, state, updateCarousel);
                resultSpan.appendChild(chipContainer);

                // chipButtons 배열 업데이트
                chipButtons.length = 0; // 기존 배열 초기화
                chipContainer.querySelectorAll('button').forEach(button => {
                    chipButtons.push(button);
                });
            }

            return resultSpan;
        },

        // 제목 요소 생성
        createTitle(wrongCount) {
            const title = document.createElement('div');
            title.style.marginBottom = '10px';
            title.textContent = wrongCount > 0
                ? `틀린문제(${wrongCount}개):`
                : '틀린문제 없음';
            return title;
        },

        // 칩 컨테이너 생성
        createChipContainer(wrongNumbers, state, updateCarousel) {
            const container = utils.createContainer({
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
            });

            wrongNumbers.forEach(number => {
                const chip = this.createChip(number, state, updateCarousel);
                container.appendChild(chip);
            });

            return container;
        },

        // 개별 칩 생성
        createChip(number, state, updateCarousel) {
            const chip = utils.createButton(`${number}번`, {
                padding: '6px 12px',
                borderRadius: '16px',
                backgroundColor: COLORS.INFO,
                fontSize: '14px',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            });

            this.setupChipEvents(chip, number, state, updateCarousel);
            return chip;
        },

        // 칩 이벤트 설정
        setupChipEvents(chip, number, state, updateCarousel) {
            chip.addEventListener('mouseenter', () => {
                // Early return: 캐러셀이 비활성화된 경우
                if (!state.carouselEnabled) {
                    utils.applyStyles(chip, {
                        cursor: 'not-allowed',
                        opacity: '0.6'
                    });
                    return;
                }

                // Early return: 현재 활성 칩인 경우 (변화 없음)
                if (parseInt(number) === state.currentIndex + 1) return;

                utils.applyStyles(chip, {
                    backgroundColor: COLORS.INFO_DARK,
                    transform: 'scale(1.05)'
                });
            });

            chip.addEventListener('mouseleave', () => {
                // Early return: 캐러셀이 비활성화된 경우
                if (!state.carouselEnabled) {
                    utils.applyStyles(chip, {
                        cursor: 'pointer',
                        opacity: '1'
                    });
                    return;
                }

                // Early return: 현재 활성 칩인 경우 (변화 없음)
                if (parseInt(number) === state.currentIndex + 1) return;

                utils.applyStyles(chip, {
                    backgroundColor: COLORS.INFO,
                    transform: 'scale(1)'
                });
            });

            chip.addEventListener('click', () => {
                // Early return: 캐러셀이 비활성화된 경우
                if (!state.carouselEnabled) return;

                updateCarousel(parseInt(number) - 1);
            });
        }
    };

    // 유틸리티 함수들
    const utils = {
        // CSS 스타일 적용 헬퍼
        applyStyles(element, styles) {
            Object.assign(element.style, styles);
        },

        // 버튼 생성 헬퍼
        createButton(text, styles = {}, clickHandler = null) {
            const button = document.createElement('button');
            button.textContent = text;
            this.applyStyles(button, {
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: 'white',
                ...styles
            });

            // Early return: 클릭 핸들러가 없는 경우
            if (!clickHandler) return button;

            button.addEventListener('click', clickHandler);
            return button;
        },

        // 컨테이너 생성 헬퍼
        createContainer(styles = {}) {
            const container = document.createElement('div');
            this.applyStyles(container, styles);
            return container;
        }
    };

    function waitForElement(selector, callback) {
        console.log('[문제 필터링 탭] 요소 대기 중:', selector);

        const element = document.querySelector(selector);
        if (element) {
            console.log('[문제 필터링 탭] 요소를 즉시 찾음!');
            callback(element);
            return;
        }

        console.log('[문제 필터링 탭] 요소를 찾지 못함. MutationObserver 시작...');

        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                console.log('[문제 필터링 탭] MutationObserver가 요소를 찾음!');
                obs.disconnect();
                callback(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 타임아웃
        setTimeout(() => {
            console.log('[문제 필터링 탭] 10초 경과 - 요소를 찾지 못함');
        }, CONSTANTS.TIMEOUTS.ELEMENT_WAIT);
    }

    // 리스트 요소를 찾을 때까지 대기
    waitForElement(CONSTANTS.SELECTORS.LIST_CONTAINER, (listContainer) => {
        console.log('[문제 필터링 탭] 리스트 컨테이너 찾음!');

        if (!listContainer) {
            console.log('리스트를 찾을 수 없습니다.');
            return;
        }

        // 리스트 컨테이너에 flex 적용
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'column';
        listContainer.style.gap = '10px';

        let currentIndex = 0;
        let carouselStartIndex = CONSTANTS.INDICES.DEFAULT_CAROUSEL_START;
        let currentMode = CONSTANTS.MODES.ALL;
        let wrongNumbersList = [];
        let chipButtons = [];
        let carouselEnabled = false;

        function updateCarousel(index) {
            const allChildren = Array.from(listContainer.children);
            const carouselItems = allChildren.slice(carouselStartIndex);

            // Early return: 캐러셀이 비활성화된 경우
            if (!carouselEnabled) {
                applyFilteringOnly(allChildren);
                return;
            }

            // 순환 처리
            if (index < 0) index = carouselItems.length - 1;
            if (index >= carouselItems.length) index = 0;
            currentIndex = index;

            applyCarouselMode(allChildren);
            updateChipStates();
        }

        // 필터링 전용 모드 (캐러셀 비활성화)
        function applyFilteringOnly(allChildren) {
            allChildren.forEach((item, i) => {
                // Early return: 탭바와 결과 영역은 항상 표시
                if (i < carouselStartIndex) {
                    item.style.display = '';
                    resetItemStyles(item);
                    return;
                }

                // 틀린문제 모드인 경우에만 필터링 적용
                if (currentMode === CONSTANTS.MODES.WRONG) {
                    const questionNumber = i - carouselStartIndex + 1;
                    item.style.display = wrongNumbersList.includes(questionNumber.toString()) ? '' : 'none';
                } else {
                    item.style.display = '';
                }

                resetItemStyles(item);
            });
        }

        // 캐러셀 모드 적용
        function applyCarouselMode(allChildren) {
            allChildren.forEach((item, i) => {
                // Early return: 캐러셀 시작 전 요소들
                if (i < carouselStartIndex) {
                    item.style.display = '';
                    item.style.position = 'relative';
                    item.style.opacity = '1';
                    item.style.flexShrink = '0';
                    return;
                }

                const carouselIdx = i - carouselStartIndex;
                const isCurrentItem = carouselIdx === currentIndex;

                item.style.display = isCurrentItem ? '' : 'none';
                if (isCurrentItem) {
                    item.style.position = 'relative';
                    item.style.opacity = '1';
                    item.style.flexShrink = '1';
                }
            });
        }

        // 아이템 스타일 초기화 헬퍼
        function resetItemStyles(item) {
            item.style.position = 'relative';
            item.style.opacity = '1';
            item.style.flexShrink = '';
        }

        function updateChipStates() {
            // Early return: 틀린문제 모드가 아닌 경우
            if (currentMode !== CONSTANTS.MODES.WRONG) return;

            const currentNumber = currentIndex + 1;
            chipButtons.forEach((chip, idx) => {
                const isActive = parseInt(wrongNumbersList[idx]) === currentNumber;
                const styles = isActive
                    ? { backgroundColor: COLORS.INFO_DARK, fontWeight: 'bold', transform: 'scale(1.1)' }
                    : { backgroundColor: COLORS.INFO, fontWeight: 'normal', transform: 'scale(1)' };

                utils.applyStyles(chip, styles);
            });
        }

        function getNextIndex() {
            // Early return: 전체 모드인 경우
            if (currentMode === CONSTANTS.MODES.ALL) {
                return currentIndex + 1;
            }

            // 틀린문제 모드: 다음 틀린 문제 찾기
            const currentNumber = currentIndex + 1;
            for (let i = 0; i < wrongNumbersList.length; i++) {
                if (parseInt(wrongNumbersList[i]) > currentNumber) {
                    return parseInt(wrongNumbersList[i]) - 1;
                }
            }

            // 마지막이면 처음으로
            return parseInt(wrongNumbersList[0]) - 1;
        }

        function getPrevIndex() {
            // Early return: 전체 모드인 경우
            if (currentMode === CONSTANTS.MODES.ALL) {
                return currentIndex - 1;
            }

            // 틀린문제 모드: 이전 틀린 문제 찾기
            const currentNumber = currentIndex + 1;
            for (let i = wrongNumbersList.length - 1; i >= 0; i--) {
                if (parseInt(wrongNumbersList[i]) < currentNumber) {
                    return parseInt(wrongNumbersList[i]) - 1;
                }
            }

            // 처음이면 마지막으로
            return parseInt(wrongNumbersList[wrongNumbersList.length - 1]) - 1;
        }

        // 탭 바 생성
        const tabBar = utils.createContainer({
            display: 'flex',
            gap: '10px',
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: COLORS.GRAY_LIGHT,
            borderRadius: '5px'
        });

        // 전체보기 탭
        const allTab = utils.createButton('전체', {
            backgroundColor: COLORS.PRIMARY,
            fontWeight: 'bold'
        });

        // 틀린문제 보기 탭
        const wrongTab = utils.createButton('틀린문제', {
            backgroundColor: COLORS.SECONDARY
        });

        // 캐러셀 모드 체크박스
        const carouselToggleContainer = document.createElement('label');
        carouselToggleContainer.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 8px;
            cursor: pointer;
            user-select: none;
            flex-shrink: 0;
            white-space: nowrap;
        `;

        const carouselCheckbox = document.createElement('input');
        carouselCheckbox.type = 'checkbox';
        carouselCheckbox.checked = false;
        carouselCheckbox.style.cssText = `
            cursor: pointer;
            width: 16px;
            height: 16px;
        `;

        const carouselLabel = document.createElement('span');
        carouselLabel.textContent = '하나씩 보기';
        carouselLabel.style.cssText = `
            font-size: 14px;
            font-weight: bold;
        `;

        carouselCheckbox.addEventListener('change', () => {
            carouselEnabled = carouselCheckbox.checked;

            // 네비게이션 버튼 표시/숨김
            const displayValue = carouselEnabled ? '' : 'none';
            const flexValue = carouselEnabled ? 'flex' : 'none';

            prevBtn.style.display = displayValue;
            nextBtn.style.display = displayValue;
            numberInputGroup.style.display = flexValue;

            // 캐러셀 업데이트
            updateCarousel(carouselEnabled ? currentIndex : 0);
        });

        carouselToggleContainer.appendChild(carouselCheckbox);
        carouselToggleContainer.appendChild(carouselLabel);

        // 이전/다음 버튼
        const prevBtn = utils.createButton('◀', {
            backgroundColor: COLORS.SUCCESS,
            fontWeight: 'bold',
            display: 'none'
        }, () => updateCarousel(getPrevIndex()));

        const nextBtn = utils.createButton('▶', {
            backgroundColor: COLORS.SUCCESS,
            fontWeight: 'bold',
            display: 'none'
        }, () => updateCarousel(getNextIndex()));

        // 탭 활성화 스타일 함수
        function setActiveTab(activeButton, inactiveButton) {
            utils.applyStyles(activeButton, {
                backgroundColor: COLORS.PRIMARY,
                fontWeight: 'bold'
            });
            utils.applyStyles(inactiveButton, {
                backgroundColor: COLORS.SECONDARY,
                fontWeight: 'normal'
            });
        }

        // 문제 번호 입력 그룹 생성
        const numberInputGroup = utils.createContainer({
            display: 'none',
            alignItems: 'center',
            gap: '5px',
            marginLeft: 'auto'
        });

        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.min = '1';
        numberInput.placeholder = '번호';
        utils.applyStyles(numberInput, {
            padding: '6px 10px',
            border: `2px solid ${COLORS.BORDER}`,
            borderRadius: '4px',
            fontSize: '14px',
            width: '70px',
            outline: 'none'
        });

        numberInput.addEventListener('focus', () => {
            numberInput.style.borderColor = COLORS.PRIMARY;
        });

        numberInput.addEventListener('blur', () => {
            numberInput.style.borderColor = COLORS.BORDER;
        });

        const goButton = utils.createButton('이동', {
            padding: '6px 12px',
            backgroundColor: COLORS.PRIMARY,
            fontWeight: 'bold',
            transition: 'background-color 0.2s',
            fontSize: '14px'
        });

        goButton.addEventListener('mouseenter', () => {
            goButton.style.backgroundColor = COLORS.PRIMARY_HOVER;
        });

        goButton.addEventListener('mouseleave', () => {
            goButton.style.backgroundColor = COLORS.PRIMARY;
        });

        const goToNumber = () => {
            const number = parseInt(numberInput.value);

            // Early return: 유효하지 않은 번호이거나 캐러셀이 비활성화된 경우
            if (!number || number < 1 || !carouselEnabled) return;

            updateCarousel(number - 1);
        };

        goButton.addEventListener('click', goToNumber);

        numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                goToNumber();
            }
        });

        numberInputGroup.appendChild(numberInput);
        numberInputGroup.appendChild(goButton);

        // 전체보기 클릭 이벤트
        allTab.addEventListener('click', () => {
            const existing = document.querySelector(CONSTANTS.SELECTORS.RESULT_SPAN);
            if (existing) existing.remove();

            currentMode = CONSTANTS.MODES.ALL;
            wrongNumbersList = [];
            chipButtons = [];
            carouselStartIndex = CONSTANTS.INDICES.DEFAULT_CAROUSEL_START;

            updateCarousel(0);
            setActiveTab(allTab, wrongTab);
        });

        // 틀린문제 보기 클릭 이벤트  
        wrongTab.addEventListener('click', () => {
            // 1. 틀린 문제 번호 추출
            const wrongNumbers = businessLogic.extractWrongNumbers(listContainer);

            // 2. 상태 객체 생성 
            const state = { carouselEnabled, currentIndex };

            // 3. 결과 UI 생성 및 삽입
            businessLogic.createAndInsertResultUI(listContainer, wrongNumbers, state, updateCarousel, chipButtons);

            // 4. 모드 설정
            currentMode = CONSTANTS.MODES.WRONG;
            wrongNumbersList = wrongNumbers;
            carouselStartIndex = CONSTANTS.INDICES.WRONG_MODE_CAROUSEL_START;

            // 5. 첫 번째 틀린 문제로 이동 (early return 적용된 삼항연산자)
            const targetIndex = wrongNumbers.length > 0 ? parseInt(wrongNumbers[0]) - 1 : 0;
            updateCarousel(targetIndex);

            // 6. 탭 활성화
            setActiveTab(wrongTab, allTab);
        });

        // 탭 바에 버튼 추가
        tabBar.appendChild(allTab);
        tabBar.appendChild(wrongTab);
        tabBar.appendChild(prevBtn);
        tabBar.appendChild(carouselToggleContainer);
        tabBar.appendChild(nextBtn);
        tabBar.appendChild(numberInputGroup);

        // 리스트의 세 번째 자식으로 탭 바 삽입
        if (listContainer.children.length >= 3) {
            listContainer.insertBefore(tabBar, listContainer.children[2]);
        } else {
            listContainer.appendChild(tabBar);
        }

        // 초기에는 캐러셀 적용 안 함 (모든 항목 보이기)
        const allChildren = Array.from(listContainer.children);
        allChildren.forEach((item) => {
            item.style.display = '';
        });
    });

})();