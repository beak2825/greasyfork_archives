// ==UserScript==
// @match       https://gemini.google.com/*
// @name        Prevent Gemini Double Click
// @description 确保在输入法状态完成后按Enter键强制发送消息；This js script is to remove the need to click the enter button twice to send text when using Gemini.
// @version 0.0.1.20251120110441
// @namespace https://greasyfork.org/users/1457414
// @downloadURL https://update.greasyfork.org/scripts/556378/Prevent%20Gemini%20Double%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/556378/Prevent%20Gemini%20Double%20Click.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    // 입력기(IME) 상태 추적
    let imeActive = false; // 입력기(조합)가 활성화되었는지 여부
    let imeJustEnded = false; // 입력기가 방금 종료되었는지 여부
    let lastImeEndTime = 0; // 마지막 입력기 종료 시간
    const IME_BUFFER_TIME = 300; // 입력기 종료 후 응답 대기 시간(밀리초)
    
    // 입력기 입력이 방금 완료되었는지 확인
    function justFinishedImeInput() {
        return imeJustEnded || 
               (Date.now() - lastImeEndTime < IME_BUFFER_TIME);
    }
    
    // 입력기 이벤트 처리
    document.addEventListener('compositionstart', function() {
        imeActive = true;
        imeJustEnded = false;
    }, true);
    
    document.addEventListener('compositionend', function() {
        imeActive = false;
        imeJustEnded = true;
        lastImeEndTime = Date.now();
        setTimeout(() => { imeJustEnded = false; }, IME_BUFFER_TIME);
    }, true);
    
    // 전송 버튼을 찾아 클릭
    function findAndClickSendButton() {
        // 다양한 선택자를 시도하여 전송 버튼 찾기
        const selectors = [
            // 일반적인 전송 버튼 선택자
            'button[type="submit"]',
            'button.send-button',
            'button.submit-button',
            '[aria-label="发送"]', // 중국어 '보내기'
            '[aria-label="Send"]', // 영어 '보내기'
            '[aria-label="메시지 보내기"]', // 한국어 '보내기'
            'button:has(svg[data-icon="paper-plane"])',
            // 특정 웹사이트의 사용자 정의 선택자
            '.absolute.p-1.rounded-md.md\\:bottom-3.md\\:p-2.md\\:right-3', // ChatGPT
            '#send-button', // 일반 ID
            '.send-button-container button', // Claude
            // 더 많은 선택자를 추가하여 다양한 웹사이트에 대응
        ];
        
        // 각 선택자 시도
        for (const selector of selectors) {
            const buttons = document.querySelectorAll(selector);
            for (const button of buttons) {
                // 버튼이 가시적이고 비활성화되지 않았는지 확인
                if (button && 
                    !button.disabled && 
                    button.offsetParent !== null && 
                    getComputedStyle(button).display !== 'none') {
                    button.click();
                    return true;
                }
            }
        }
        
        // 버튼을 찾을 수 없는 경우, 폼 제출 시도
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
            const form = activeElement.closest('form');
            if (form) {
                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                return true;
            }
        }
        
        return false;
    }
    
    // Enter 키 이벤트 리스너
    document.addEventListener('keydown', function(e) {
        if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey && !e.ctrlKey && !e.altKey && !imeActive && justFinishedImeInput()) {
            // 입력기가 방금 완료되었고, Enter 키를 눌렀을 때, 메시지 강제 전송
            if (findAndClickSendButton()) {
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
            }
        }
    }, true);
    
    // 모든 관련 입력 요소에 이벤트 리스너 추가
    function enhanceInputElement(input) {
        // 기존 keydown 처리 함수 저장
        const originalKeyDown = input.onkeydown;
        
        // 새로운 keydown 처리 함수 추가
        input.onkeydown = function(e) {
            if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey && !e.ctrlKey && !e.altKey && !imeActive && justFinishedImeInput()) {
                // 입력기가 방금 완료되었고, Enter 키를 눌렀을 때, 메시지 강제 전송
                if (findAndClickSendButton()) {
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            }
            // 기존 처리 함수 호출
            if (originalKeyDown) return originalKeyDown.call(this, e);
        };
    }
    
    // 페이지 로드 후 기존 입력 상자 처리
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.querySelectorAll('textarea, input[type="text"]').forEach(enhanceInputElement);
            
            // DOM 변화를 감시하여 새로 추가된 입력 상자 처리
            if (window.MutationObserver) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1) {
                                    if (node.tagName === 'TEXTAREA' || 
                                        (node.tagName === 'INPUT' && node.type === 'text')) {
                                        enhanceInputElement(node);
                                    }
                                    
                                    const inputs = node.querySelectorAll ? 
                                        node.querySelectorAll('textarea, input[type="text"]') : [];
                                    if (inputs.length > 0) {
                                        inputs.forEach(enhanceInputElement);
                                    }
                                }
                            });
                        }
                    });
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 1000);
    });
})();