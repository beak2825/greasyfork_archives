// ==UserScript==
// @name         위플랩 룰렛 일괄 켜기/끄기
// @namespace    https://weflab.com/roulette
// @version      1.0
// @description  위플랩 룰렛을 일괄 켜기/끄기 후 저장하는 버튼을 추가합니다.
// @match        https://weflab.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553694/%EC%9C%84%ED%94%8C%EB%9E%A9%20%EB%A3%B0%EB%A0%9B%20%EC%9D%BC%EA%B4%84%20%EC%BC%9C%EA%B8%B0%EB%81%84%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/553694/%EC%9C%84%ED%94%8C%EB%9E%A9%20%EB%A3%B0%EB%A0%9B%20%EC%9D%BC%EA%B4%84%20%EC%BC%9C%EA%B8%B0%EB%81%84%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECKBOX_SELECTOR = 'input[type="checkbox"][name="setup_roulette_use"]';
    const TARGET_SECTION_SELECTOR = 'div.setup_roulette';
    const BUTTON_CONTAINER_SELECTOR = '#page_donation_filter'; // 버튼을 추가할 컨테이너 선택자
    const BUTTON_INSERT_ANCHOR_SELECTOR = '#page_donation_filter p'; // 버튼을 삽입할 기준점 (<p> 태그)
    const SAVE_BUTTON_SELECTOR = '#btn_page_save'; // 설정 저장 버튼 선택자
    const BUTTON_ADDED_FLAG = 'userscript-buttons-added-v3'; // 버튼 중복 추가 방지 플래그 (이전 버전과 구분)

    // 설정 저장 버튼 클릭 함수
    function clickSaveButton() {
        const saveButton = document.querySelector(SAVE_BUTTON_SELECTOR);
        if (saveButton) {
            console.log("UserScript: 설정 저장 버튼 클릭 시도.");
            saveButton.click();
        } else {
            console.warn("UserScript: 설정 저장 버튼을 찾을 수 없습니다.");
        }
    }

    // 모든 '룰렛 사용' 체크박스를 선택하고 저장하는 함수
    function checkAllAndSave() {
        const checkboxes = document.querySelectorAll(CHECKBOX_SELECTOR);
        let changed = false;
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                changed = true;
            }
        });
        console.log(`UserScript: ${checkboxes.length}개의 '룰렛 사용' 체크박스를 모두 체크했습니다.`);
        // 변경 사항이 있을 때만 저장 버튼 클릭 (선택 사항)
        // if (changed) {
            // 약간의 딜레이 후 저장 버튼 클릭 (DOM 업데이트 시간을 주기 위해)
            setTimeout(clickSaveButton, 100);
        // }
    }

    // 모든 '룰렛 사용' 체크박스를 해제하고 저장하는 함수
    function uncheckAllAndSave() {
        const checkboxes = document.querySelectorAll(CHECKBOX_SELECTOR);
        let changed = false;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                changed = true;
            }
        });
        console.log(`UserScript: ${checkboxes.length}개의 '룰렛 사용' 체크박스를 모두 해제했습니다.`);
        // 변경 사항이 있을 때만 저장 버튼 클릭 (선택 사항)
        // if (changed) {
            // 약간의 딜레이 후 저장 버튼 클릭
            setTimeout(clickSaveButton, 100);
        // }
    }

    // 버튼을 생성하고 추가하는 함수
    function addControlButtons(targetContainer) {
        // 이미 버튼이 추가되었는지 확인
        if (targetContainer.dataset.buttonsAdded === BUTTON_ADDED_FLAG) {
            return;
        }

        const anchorElement = targetContainer.querySelector(BUTTON_INSERT_ANCHOR_SELECTOR);
        if (!anchorElement) {
             console.warn("UserScript: 버튼 삽입 기준점('p' 태그)을 찾을 수 없습니다.");
             return;
        }

        // '모두 켜기' 버튼 생성
        const checkAllButton = document.createElement('a');
        checkAllButton.href = "#";
        checkAllButton.className = "btns sky mds userscript-btn";
        checkAllButton.innerHTML = "<i class='fa-solid fa-square-check icon'></i> 모두 켜기"; // 텍스트 추가
        checkAllButton.style.marginRight = '5px'; // 오른쪽 여백

        // '모두 끄기' 버튼 생성
        const uncheckAllButton = document.createElement('a');
        uncheckAllButton.href = "#";
        uncheckAllButton.className = "btns graysky mds userscript-btn";
        uncheckAllButton.innerHTML = "<i class='fa-regular fa-square icon'></i> 모두 끄기"; // 텍스트 추가
        uncheckAllButton.style.marginRight = '10px'; // 오른쪽 여백 추가 (텍스트와의 간격)

        // 버튼 클릭 이벤트 리스너 추가
        checkAllButton.addEventListener('click', function(event) {
            event.preventDefault();
            checkAllAndSave(); // 저장 함수 호출
        });
        uncheckAllButton.addEventListener('click', function(event) {
            event.preventDefault();
            uncheckAllAndSave(); // 저장 함수 호출
        });

        // 생성된 버튼들을 <p> 태그 **바로 앞**에 추가 (체크 버튼이 왼쪽)
        anchorElement.insertAdjacentElement('beforebegin', checkAllButton);  // 체크 버튼 삽입 (해제 버튼 왼쪽에 오게 됨)
        anchorElement.insertAdjacentElement('beforebegin', uncheckAllButton); // 해제 버튼 먼저 삽입

        // 버튼 추가 완료 플래그 설정
        targetContainer.dataset.buttonsAdded = BUTTON_ADDED_FLAG;
        console.log("UserScript: 일괄 체크/해제 및 저장 버튼 추가 완료.");
    }

    // MutationObserver 콜백 함수: DOM 변경 감지 시 실행
    const observerCallback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 추가된 노드 중에서 룰렛 후원 섹션이 있는지 확인
                mutation.addedNodes.forEach(node => {
                    // 노드가 Element 타입이고, setup_roulette 클래스를 가지는지 확인
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches(TARGET_SECTION_SELECTOR)) {
                        const buttonContainer = node.querySelector(BUTTON_CONTAINER_SELECTOR);
                        if (buttonContainer) {
                            addControlButtons(buttonContainer);
                        }
                    }
                    // 만약 추가된 노드 내부에 setup_roulette가 있는 경우도 고려
                    else if (node.nodeType === Node.ELEMENT_NODE) {
                         const targetSection = node.querySelector(TARGET_SECTION_SELECTOR);
                         if (targetSection) {
                             const buttonContainer = targetSection.querySelector(BUTTON_CONTAINER_SELECTOR);
                             if (buttonContainer) {
                                 addControlButtons(buttonContainer);
                             }
                         }
                    }
                });
                 // 제거된 노드 중 버튼 컨테이너가 포함된 setup_roulette가 있으면 플래그 초기화
                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches(TARGET_SECTION_SELECTOR)) {
                         const buttonContainer = node.querySelector(BUTTON_CONTAINER_SELECTOR);
                         if (buttonContainer && buttonContainer.dataset.buttonsAdded === BUTTON_ADDED_FLAG) {
                             delete buttonContainer.dataset.buttonsAdded;
                             // userscript-btn 클래스를 가진 버튼들도 제거
                             buttonContainer.querySelectorAll('.userscript-btn').forEach(btn => btn.remove());
                             console.log("UserScript: 룰렛 섹션 제거 감지, 버튼 플래그 초기화.");
                         }
                    }
                });
            }
        }
    };

    // MutationObserver 인스턴스 생성 및 감시 시작
    const targetNode = document.getElementById('content_main'); // 감시할 대상 노드 (메인 콘텐츠 영역)
    if (targetNode) {
        const config = { childList: true, subtree: true }; // 자식 노드 추가/제거 및 하위 트리 전체 감시
        const observer = new MutationObserver(observerCallback);
        observer.observe(targetNode, config);
        console.log("UserScript: 룰렛 후원 섹션 로딩 감시 시작.");

        // 페이지 로드 시점에 이미 룰렛 후원 섹션이 있는지 확인
        const initialTargetSection = targetNode.querySelector(TARGET_SECTION_SELECTOR);
        if (initialTargetSection) {
            const initialButtonContainer = initialTargetSection.querySelector(BUTTON_CONTAINER_SELECTOR);
            if (initialButtonContainer) {
                addControlButtons(initialButtonContainer);
            }
        }

    } else {
        console.warn("UserScript: 감시 대상('#content_main')을 찾을 수 없습니다.");
    }

})();