// ==UserScript==
// @name        lanis 자동사냥 3.8
// @namespace   http://tampermonkey.net/
// @version     3.8
// @description 화면 좌측에 ON/OFF 버튼, 레벨제한 입력창, 골드제한 입력창, 숙련도제한 입력창, 버튼 텍스트 입력창, 제외 버튼 텍스트 입력창을 추가. 레벨제한 또는 숙련도제한 도달 시 버튼 클릭을 일시 중지하고 조건 변화 시 재개. 입력된 텍스트가 포함된 버튼을 골드제한 이하일 때 0.3초 간격으로 자동 클릭. 제외 버튼 텍스트가 포함된 버튼이나 '내구도 0' 경고 아이콘이 있으면 자동 클릭 중지. 입력창 크기 드래그로 조절 가능.
// @author      Grok
// @match       https://lanis.me/*
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548023/lanis%20%EC%9E%90%EB%8F%99%EC%82%AC%EB%83%A5%2038.user.js
// @updateURL https://update.greasyfork.org/scripts/548023/lanis%20%EC%9E%90%EB%8F%99%EC%82%AC%EB%83%A5%2038.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // UI 컨테이너 생성: 화면 좌측에 고정된 설정창을 만들기 위한 컨테이너
    const uiContainer = document.createElement('div');
    uiContainer.style.position = 'fixed';
    uiContainer.style.left = '10px';
    uiContainer.style.top = '100px';
    uiContainer.style.zIndex = '9999';
    uiContainer.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
    uiContainer.style.padding = '10px';
    uiContainer.style.borderRadius = '5px';
    uiContainer.style.display = 'block';
    document.body.appendChild(uiContainer);

    // SEE/HIDE 버튼 생성: UI 컨테이너를 보이거나 숨기는 버튼
    const toggleUiButton = document.createElement('button');
    toggleUiButton.textContent = 'HIDE';
    toggleUiButton.style.position = 'fixed';
    toggleUiButton.style.left = '20px';
    toggleUiButton.style.top = '65px';
    toggleUiButton.style.zIndex = '10000';
    toggleUiButton.style.padding = '5px 10px';
    toggleUiButton.style.backgroundColor = '#555';
    toggleUiButton.style.color = 'white';
    toggleUiButton.style.border = 'none';
    toggleUiButton.style.borderRadius = '5px';
    toggleUiButton.style.cursor = 'pointer';
    document.body.appendChild(toggleUiButton);

    // ON/OFF 버튼 생성: 자동 클릭 기능을 켜고 끄는 버튼
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'OFF';
    toggleButton.style.padding = '8px 16px';
    toggleButton.style.backgroundColor = '#e63946';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.display = 'block';
    toggleButton.style.marginBottom = '10px';
    uiContainer.appendChild(toggleButton);

    // 레벨제한 입력창 생성: 자동 클릭을 중지할 레벨 값을 입력
    const levelLimitField = document.createElement('input');
    levelLimitField.type = 'number';
    levelLimitField.placeholder = '레벨제한 (예: 100)';
    levelLimitField.style.padding = '8px';
    levelLimitField.style.width = '150px';
    levelLimitField.style.border = '1px solid #555';
    levelLimitField.style.borderRadius = '5px';
    levelLimitField.style.display = 'block';
    levelLimitField.style.marginBottom = '10px';
    levelLimitField.style.backgroundColor = '#333';
    levelLimitField.style.color = '#fff';
    levelLimitField.value = '101';
    uiContainer.appendChild(levelLimitField);

    // 골드제한 입력창 생성: 자동 클릭을 실행할 최대 허용 골드 값을 입력
    const goldLimitField = document.createElement('input');
    goldLimitField.type = 'number';
    goldLimitField.placeholder = '골드제한 (예: 5000)';
    goldLimitField.style.padding = '8px';
    goldLimitField.style.width = '150px';
    goldLimitField.style.border = '1px solid #555';
    goldLimitField.style.borderRadius = '5px';
    goldLimitField.style.display = 'block';
    goldLimitField.style.marginBottom = '10px';
    goldLimitField.style.backgroundColor = '#333';
    goldLimitField.style.color = '#fff';
    goldLimitField.value = '30000';
    uiContainer.appendChild(goldLimitField);

    // 숙련도제한 입력창 생성: 자동 클릭을 중지할 숙련도 값을 입력
    const masteryLimitField = document.createElement('input');
    masteryLimitField.type = 'number';
    masteryLimitField.placeholder = '숙련도제한 (예: 500000)';
    masteryLimitField.style.padding = '8px';
    masteryLimitField.style.width = '150px';
    masteryLimitField.style.border = '1px solid #555';
    masteryLimitField.style.borderRadius = '5px';
    masteryLimitField.style.display = 'block';
    masteryLimitField.style.marginBottom = '10px';
    masteryLimitField.style.backgroundColor = '#333';
    masteryLimitField.style.color = '#fff';
    masteryLimitField.value = '123456789';
    uiContainer.appendChild(masteryLimitField);

    // 버튼 텍스트 입력창 생성: 자동 클릭할 버튼의 이름을 입력
    const inputField = document.createElement('textarea');
    inputField.placeholder = '버튼 텍스트를 줄바꿈으로 구분하여 입력 (예: 테스트 평야\n수정 호수)';
    inputField.style.padding = '8px';
    inputField.style.width = '150px';
    inputField.style.height = '300px';
    inputField.style.minWidth = '150px';
    inputField.style.maxWidth = '400px';
    inputField.style.minHeight = '80px';
    inputField.style.maxHeight = '800px';
    inputField.style.border = '1px solid #555';
    inputField.style.borderRadius = '5px';
    inputField.style.display = 'block';
    inputField.style.resize = 'both';
    inputField.style.overflow = 'auto';
    inputField.style.backgroundColor = '#333';
    inputField.style.color = '#fff';
    inputField.value = '여신상\n하늘\n수행자\n호수\n황금\n폭포\n어둠\n보물\n탑\n숲\n늪\n평야\n전액 입금\n낚시하기';
    uiContainer.appendChild(inputField);

    // 제외 버튼 텍스트 입력창 생성: 자동 클릭을 중지할 텍스트를 입력
    const excludeField = document.createElement('textarea');
    excludeField.placeholder = '제외할 텍스트를 줄바꿈으로 구분하여 입력 (예: 어둠의 설원)';
    excludeField.style.padding = '8px';
    excludeField.style.width = '150px';
    excludeField.style.height = '100px';
    excludeField.style.minWidth = '150px';
    excludeField.style.maxWidth = '400px';
    excludeField.style.minHeight = '50px';
    excludeField.style.maxHeight = '200px';
    excludeField.style.border = '1px solid #555';
    excludeField.style.borderRadius = '5px';
    excludeField.style.display = 'block';
    excludeField.style.marginTop = '10px';
    excludeField.style.resize = 'both';
    excludeField.style.overflow = 'auto';
    excludeField.style.backgroundColor = '#333';
    excludeField.style.color = '#fff';
    excludeField.value = '10초\n너무 자주\n서버에 문제가\nHTTP\n고갈';
    uiContainer.appendChild(excludeField);

    // 자동 클릭 상태 관리 변수
    let isOn = false;
    let clickInterval = null;
    let isPaused = false; // 버튼 클릭 일시 중지 상태

    // SEE/HIDE 버튼 동작: UI 컨테이너를 보이거나 숨김
    toggleUiButton.addEventListener('click', function() {
        if (uiContainer.style.display === 'block') {
            uiContainer.style.display = 'none';
            toggleUiButton.textContent = 'SEE';
            toggleUiButton.style.backgroundColor = '#2a9d8f';
        } else {
            uiContainer.style.display = 'block';
            toggleUiButton.textContent = 'HIDE';
            toggleUiButton.style.backgroundColor = '#555';
        }
    });

    // 현재 레벨 값을 가져오는 함수
    function getCurrentLevel() {
        const levelElement = document.querySelector('.css-kt2ljv');
        if (levelElement) {
            const levelText = levelElement.textContent.trim();
            const levelValue = parseInt(levelText, 10);
            console.log(`레벨 값 파싱: 원본=${levelElement.textContent}, 파싱 후=${levelValue}`);
            return isNaN(levelValue) ? 0 : levelValue;
        }
        console.log('레벨 요소를 찾을 수 없음');
        return 0;
    }

    // 현재 숙련도 값을 가져오는 함수
    function getCurrentMastery() {
        const masteryElement = document.querySelector('.css-s41i49');
        if (masteryElement) {
            const masteryText = masteryElement.textContent.trim().replace(/,/g, '');
            const masteryValue = parseInt(masteryText, 10);
            console.log(`숙련도 값 파싱: 원본=${masteryElement.textContent}, 파싱 후=${masteryValue}`);
            return isNaN(masteryValue) ? 0 : masteryValue;
        }
        console.log('숙련도 요소를 찾을 수 없음');
        return 0;
    }

    // 현재 골드 값을 가져오는 함수
    function getCurrentGold() {
        const goldElement = document.querySelector('.css-1q7wpb6');
        if (goldElement) {
            const goldText = goldElement.textContent.trim().replace(/,/g, '');
            const goldValue = parseInt(goldText, 10);
            console.log(`골드 값 파싱: 원본=${goldElement.textContent}, 파싱 후=${goldValue}`);
            return isNaN(goldValue) ? 0 : goldValue;
        }
        console.log('골드 요소를 찾을 수 없음');
        return 0;
    }

    // 버튼 찾기 함수: 입력된 텍스트와 일치하는 버튼을 찾아 반환
    function findTargetButton() {
        const buttons = document.querySelectorAll('button');
        const textArray = inputField.value.split('\n');
        let matchedButton = null;
        for (let text of textArray) {
            text = text.trim();
            if (!text) continue;
            for (const button of buttons) {
                if (button.textContent.includes(text)) {
                    matchedButton = button;
                    return matchedButton;
                }
            }
        }
        return matchedButton;
    }

    // 제외 텍스트와 특정 SVG 아이콘을 모두 확인하는 함수
    function hasExcludeText() {
        const excludeArray = excludeField.value.split('\n');

        // 1. 기존 텍스트 기반 검사 (UI 제외)
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT, {
                acceptNode: function(node) {
                    if (uiContainer.contains(node.parentElement)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        let node;
        while ((node = walker.nextNode())) {
            const textContent = node.textContent.trim();
            for (let text of excludeArray) {
                text = text.trim();
                if (!text) continue;
                if (textContent.includes(text)) {
                    console.log(`제외 텍스트 발견: ${text} (노드: ${textContent})`);
                    return true;
                }
            }
        }

        // 2. SVG 아이콘 기반 검사 추가
        const svgIcon = document.querySelector('svg[aria-label="현재 내구도 0"]');
        if (svgIcon) {
            console.log('SVG 경고 아이콘("현재 내구도 0")이 감지되었습니다.');
            return true;
        }

        return false;
    }

    // ON/OFF 버튼 동작: 자동 클릭 시작 또는 중지
    toggleButton.addEventListener('click', function() {
        isOn = !isOn;
        if (isOn) {
            toggleButton.textContent = 'ON';
            toggleButton.style.backgroundColor = '#2a9d8f';
            console.log('ON 상태로 전환됨. 자동 반복 클릭 시작.');
            isPaused = false; // ON으로 전환 시 일시 중지 상태 초기화
            clickInterval = setInterval(function() {
                const inputText = inputField.value;
                if (!inputText) {
                    console.log('버튼 텍스트 입력창이 비어 있습니다.');
                    return;
                }

                // 제외 텍스트나 SVG 아이콘이 페이지에 있으면 클릭 중지
                if (hasExcludeText()) {
                    console.log('제외 텍스트 또는 SVG 아이콘이 페이지에 감지되었습니다. 자동 클릭을 중지합니다.');
                    return;
                }

                // 레벨제한 확인
                const levelLimit = parseInt(levelLimitField.value, 10);
                const currentLevel = getCurrentLevel();
                console.log(`레벨제한=${levelLimit}, 현재 레벨=${currentLevel}`);
                if (isNaN(levelLimit)) {
                    console.log('레벨제한 값이 유효하지 않습니다.');
                    return;
                }
                if (currentLevel >= levelLimit) {
                    if (!isPaused) {
                        console.log(`현재 레벨(${currentLevel})이 레벨제한(${levelLimit}) 이상이므로 버튼 클릭을 일시 중지합니다.`);
                        isPaused = true;
                    }
                    return;
                }

                // 숙련도제한 확인
                const masteryLimit = parseInt(masteryLimitField.value, 10);
                const currentMastery = getCurrentMastery();
                console.log(`숙련도제한=${masteryLimit}, 현재 숙련도=${currentMastery}`);
                if (isNaN(masteryLimit)) {
                    console.log('숙련도제한 값이 유효하지 않습니다.');
                    return;
                }
                if (currentMastery >= masteryLimit) {
                    if (!isPaused) {
                        console.log(`현재 숙련도(${currentMastery})가 숙련도제한(${masteryLimit}) 이상이므로 버튼 클릭을 일시 중지합니다.`);
                        isPaused = true;
                    }
                    return;
                }

                // 일시 중지 상태 해제
                if (isPaused && currentLevel < levelLimit && currentMastery < masteryLimit) {
                    console.log('레벨 및 숙련도 조건이 충족되어 버튼 클릭을 재개합니다.');
                    isPaused = false;
                }

                // 일시 중지 상태에서는 버튼 클릭을 수행하지 않음
                if (isPaused) {
                    return;
                }

                // 골드제한 확인
                const goldLimit = parseInt(goldLimitField.value, 10);
                const currentGold = getCurrentGold();
                console.log(`골드제한=${goldLimit}, 현재 골드=${currentGold}`);
                if (isNaN(goldLimit)) {
                    console.log('골드제한 값이 유효하지 않습니다. 기본값 0 사용.');
                    return;
                }
                if (currentGold > goldLimit) {
                    console.log(`현재 골드(${currentGold})가 골드제한(${goldLimit}) 초과이므로 뒤로가기 및 앞으로가기 실행.`);
                    history.back();
                    setTimeout(function() {
                        history.forward();
                    }, 300);
                    return;
                }

                const targetButton = findTargetButton();
                if (targetButton) {
                    targetButton.click();
                    console.log(`${targetButton.textContent} 버튼이 자동 클릭되었습니다. (현재 골드: ${currentGold}, 현재 레벨: ${currentLevel}, 현재 숙련도: ${currentMastery})`);
                } else {
                    console.log('입력된 텍스트와 일치하는 버튼을 찾을 수 없습니다.');
                }
            }, 300);
        } else {
            toggleButton.textContent = 'OFF';
            toggleButton.style.backgroundColor = '#e63946';
            console.log('OFF 상태로 전환됨. 자동 반복 클릭 중지.');
            if (clickInterval) {
                clearInterval(clickInterval);
                clickInterval = null;
            }
            isPaused = false; // OFF 상태로 전환 시 일시 중지 상태 초기화
        }
    });

    // 페이지 로드 완료 시 초기화
    document.addEventListener('DOMContentLoaded', function() {
        console.log('페이지 로드 완료. UI가 화면 좌측에 생성되었습니다.');
    });

    // 동적 로드 감지: 페이지 변화 감지
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (isOn) {
                const targetButton = findTargetButton();
                if (targetButton) {
                    console.log(`${targetButton.textContent} 버튼을 동적으로 감지했습니다.`);
                }
                if (hasExcludeText()) {
                    console.log('제외 텍스트 또는 SVG 아이콘이 동적으로 감지되었습니다.');
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();