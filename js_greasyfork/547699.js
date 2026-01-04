// ==UserScript==
// @name         Google AI Studio Default Settings & Shortcuts
// @namespace    https://blog.valley.town/@zeronox
// @version      2.0
// @description  로드 시 기본값을 설정하고, Ctrl+Shift+F/D로 사이드바 토글, Ctrl+Shift+Z로 기본값과 함께 새 채팅을 시작합니다.
// @author       zeronox
// @license      MIT
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547699/Google%20AI%20Studio%20Default%20Settings%20%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/547699/Google%20AI%20Studio%20Default%20Settings%20%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setToggleState(buttonSelector, shouldBeOn, callback) {
        const toggleButton = document.querySelector(buttonSelector);
        if (!toggleButton) {
            console.error(`'${buttonSelector}' 선택자에 해당하는 토글 버튼을 찾을 수 없습니다.`);
            return;
        }
        const isCurrentlyOn = toggleButton.getAttribute('aria-checked') === 'true';
        if ((shouldBeOn && !isCurrentlyOn) || (!shouldBeOn && isCurrentlyOn)) {
            toggleButton.click();
            // 클릭 후 콜백 함수가 있으면 약간의 지연 후 실행
            if (callback) {
                setTimeout(callback, 100);
            }
        } else if (callback) {
            // 이미 올바른 상태여도 콜백은 실행
            callback();
        }
    }

    function toggleRunSettingsSidebar() {
        const closeButton = document.querySelector('ms-run-settings button[aria-label="Close run settings panel"]');
        if (closeButton) {
            console.log('단축키: Run settings 패널을 닫습니다.');
            closeButton.click();
            return;
        }

        const openButton = document.querySelector(
            'button[aria-label="Toggle run settings panel"],' +
            'ms-right-side-panel button[aria-label="Run settings"]'
        );
        if (openButton) {
            console.log('단축키: Run settings 패널을 엽니다.');
            openButton.click();
        } else {
            console.error("단축키: Run settings 패널을 열거나 닫을 수 있는 버튼을 찾을 수 없습니다.");
        }
    }

    function toggleNavigationMenu() {
        const navButton = document.querySelector('button[aria-label="Toggle navigation menu"]');
        if (navButton) {
            console.log('단축키: 네비게이션 메뉴를 토글합니다.');
            navButton.click();
        } else {
            console.error('단축키: 네비게이션 메뉴 버튼을 찾을 수 없습니다.');
        }
    }

    function createNewChatAndSetDefaults() {
        const newChatButton = document.querySelector('a[href="/prompts/new_chat"]');
        if (newChatButton) {
            console.log('단축키: 새 채팅을 시작합니다.');
            newChatButton.click();

            const reInitInterval = setInterval(() => {
                if (window.location.pathname.includes('/new_chat')) {
                     const runSettingsHeader = document.querySelector('ms-run-settings h2');
                     if (runSettingsHeader) {
                        clearInterval(reInitInterval);
                        console.log('새 채팅 페이지에서 기본값 설정을 재실행합니다.');
                        setTimeout(initializeAiStudioDefaults, 500);
                     }
                }
            }, 200);
        } else {
            console.error('단축키: 새 채팅 버튼을 찾을 수 없습니다.');
        }
    }

    // <<-- 안정성 개선을 위해 이 함수가 수정되었습니다 -->>
    function initializeAiStudioDefaults() {
        console.log('AI Studio 기본 설정 적용을 시작합니다...');
        setToggleState('[data-test-id="searchAsAToolTooltip"] button[role="switch"]', true);
        setToggleState('[data-test-id="browseAsAToolTooltip"] button[role="switch"]', true);

        // 'manual-budget' 토글을 켜고, 완료된 후에 budget 값을 설정하는 콜백 실행
        setToggleState('[data-test-toggle="manual-budget"] button[role="switch"]', true, () => {
            // budget input이 나타날 때까지 최대 2초간 시도
            let attempts = 0;
            const maxAttempts = 10;
            const budgetInterval = setInterval(() => {
                const budgetInput = document.querySelector('div[data-test-id="user-setting-budget-animation-wrapper"] input[type="number"]');

                if (budgetInput) {
                    clearInterval(budgetInterval);
                    if (budgetInput.value !== '32768') {
                        budgetInput.value = '32768';
                        budgetInput.dispatchEvent(new Event('input', { bubbles: true }));
                        budgetInput.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log('Token budget을 32768로 설정했습니다.');
                    }
                    // 모든 설정이 끝난 후 패널 닫기
                    setTimeout(closeRunSettingsPanel, 300);
                } else if (++attempts >= maxAttempts) {
                    clearInterval(budgetInterval);
                    console.error('Token budget 입력 필드를 찾을 수 없습니다.');
                    setTimeout(closeRunSettingsPanel, 300);
                }
            }, 200); // 0.2초마다 확인
        });
    }

    function closeRunSettingsPanel() {
        const closeButton = document.querySelector('ms-run-settings button[aria-label="Close run settings panel"]');
        if (closeButton) {
            console.log('초기 설정 완료 후 Run settings 패널을 닫습니다.');
            closeButton.click();
        }
        console.log('AI Studio 기본 설정 적용이 완료되었습니다.');
    }


    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && (event.key === 'F' || event.key === 'f')) {
            event.preventDefault();
            toggleRunSettingsSidebar();
        }
        if (event.ctrlKey && event.shiftKey && (event.key === 'Z' || event.key === 'z')) {
            event.preventDefault();
            createNewChatAndSetDefaults();
        }
        if (event.ctrlKey && event.shiftKey && (event.key === 'D' || event.key === 'd')) {
            event.preventDefault();
            toggleNavigationMenu();
        }
    });

    const initialLoadCheckInterval = setInterval(() => {
        // new_chat 또는 특정 prompt 페이지를 모두 포함하도록 수정
        if (window.location.pathname.includes('/prompts/')) {
            const runSettingsHeader = document.querySelector('ms-run-settings h2');
            if (runSettingsHeader) {
                clearInterval(initialLoadCheckInterval);
                setTimeout(initializeAiStudioDefaults, 500);
            }
        }
    }, 500);

})();