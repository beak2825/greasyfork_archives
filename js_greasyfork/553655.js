// ==UserScript==
// @name         Wrtn Chat Exporter (v1.24 - No Tags)
// @namespace    http://tampermonkey.net/
// @version      1.24
// @description  [No Tags Update] AI/User 태그를 제거하고 텍스트만 추출합니다. 모든 채팅 타입을 구조적으로 감지합니다.
// @author       You
// @match        https://crack.wrtn.ai/stories/*
// @match        https://wrtn.ai/stories/*
// @grant        none
// @license      CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/553655/Wrtn%20Chat%20Exporter%20%28v124%20-%20No%20Tags%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553655/Wrtn%20Chat%20Exporter%20%28v124%20-%20No%20Tags%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 설정: 구조적/의미적 선택자 사용 ---
    const CHAT_AREA_SELECTOR = "div[class*='ChatList__ChatListWrapper'], div.css-nyz712";
    const COMMON_MESSAGE_WRAPPER = "div.css-8atqhb";
    const AI_SEMANTIC_IDENTIFIER = 'img[alt="model"]';
    const AI_TEXT_CONTAINER = 'div.css-ae5fn1';
    const USER_TEXT_CONTAINER = 'div.css-192kozn';

    // --- 버튼 생성 로직 (Fallback 포함) ---
    window.addEventListener('load', createFloatingExportButtonIfNotExists);
    let lastUrl = location.href;
    new MutationObserver(() => {
     const url = location.href;
     if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(createFloatingExportButtonIfNotExists, 1000);
     }
    }).observe(document, {subtree: true, childList: true});
    setInterval(createFloatingExportButtonIfNotExists, 2000); // 2초마다 버튼 존재 확인

    function createFloatingExportButtonIfNotExists() {
         const isTargetPage = window.location.href.includes("/stories/");
         const existingButton = document.getElementById('chat-export-button');
         if (isTargetPage) {
             if (!existingButton) createFloatingExportButton();
         } else {
             if (existingButton) {
                 existingButton.remove();
                 console.log("[Wrtn Exporter] Target page left. Button removed.");
             }
         }
    }

     function createFloatingExportButton() {
        if (document.getElementById('chat-export-button')) return;
        const button = document.createElement('button');
        button.id = 'chat-export-button';
        button.innerHTML = '📜 채팅 내용 저장';
        button.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 99999;
            padding: 10px 15px; font-size: 14px; font-weight: bold; color: white;
            background-color: #5E35B1; border: none; border-radius: 25px;
            cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.2s ease-in-out;
        `;
        button.onmouseover = () => button.style.transform = 'scale(1.05)';
        button.onmouseout = () => button.style.transform = 'scale(1)';

        button.addEventListener('click', async () => {
            console.log("--- [Wrtn Exporter] 버튼 클릭됨! 채팅 추출을 시작합니다. ---");
            button.disabled = true;
            button.innerHTML = '...내용 불러오는 중...';
            try {
                await exportChat();
            } catch (e) {
                console.error("[Wrtn Exporter] 스크립트 실행 중 오류 발생:", e);
                button.innerHTML = `⚠️ 오류! (F12 > Console 확인)`;
            } finally {
                setTimeout(() => {
                    const currentButton = document.getElementById('chat-export-button');
                    if(currentButton) {
                        currentButton.disabled = false;
                        currentButton.innerHTML = '📜 채팅 내용 저장';
                    }
                }, 3000);
            }
        });
        document.body.appendChild(button);
        console.log("[Wrtn Exporter] 채팅 내용 저장 버튼 생성됨.");
     }


    // 채팅 내용 추출 및 저장 함수
    async function exportChat() {
        console.log("1. 채팅 구역을 찾습니다...");
        const chatArea = findChatArea(COMMON_MESSAGE_WRAPPER);
        if (!chatArea) {
            console.error("오류: 채팅 구역을 찾을 수 없습니다! (CHAT_AREA_SELECTOR 또는 COMMON_MESSAGE_WRAPPER가 변경되었을 수 있습니다)");
            alert("채팅 스크롤 영역을 찾을 수 없습니다. 사이트 구조가 변경되었을 수 있습니다. 개발자 도구(F12) > Console 탭에서 자세한 오류를 확인하세요.");
            return;
        }
        console.log("채팅 구역 찾기 성공!", chatArea);

        // --- 1. 모든 내용 로드를 위해 스크롤 ---
        console.log("2. 모든 내용을 불러오기 위해 스크롤을 시작합니다.");
        let lastHeight = 0;
        let noChangeCount = 0;
        const MAX_NO_CHANGE = 3;
        while (noChangeCount < MAX_NO_CHANGE) {
            chatArea.scrollTop = 0; // 스크롤을 맨 위로 올림
            await new Promise(resolve => setTimeout(resolve, 1500)); // 로딩 대기
            const newHeight = chatArea.scrollHeight;
            if (newHeight === lastHeight) {
                noChangeCount++;
                console.log(`스크롤 높이 변화 없음 (${noChangeCount}/${MAX_NO_CHANGE})`);
            } else {
                noChangeCount = 0;
                lastHeight = newHeight;
                console.log("스크롤 중... 현재 높이:", newHeight);
            }
        }
        console.log("스크롤 완료: 더 이상 새로운 내용이 없거나 로딩이 완료되었습니다.");

        // --- 2. [수정됨] 텍스트 추출 (태그 제거) ---
        console.log("3. 채팅 구역 내 모든 공통 메시지 래퍼의 텍스트를 찾습니다. 선택자:", COMMON_MESSAGE_WRAPPER);
        const allMessageWrappers = chatArea.querySelectorAll(COMMON_MESSAGE_WRAPPER);
        console.log(allMessageWrappers.length, "개의 공통 메시지 래퍼를 찾았습니다.");

        if (allMessageWrappers.length === 0) {
            console.error(`오류: 공통 메시지 래퍼(${COMMON_MESSAGE_WRAPPER})를 하나도 찾을 수 없습니다! 사이트 구조가 크게 변경되었을 수 있습니다.`);
            alert(`메시지 래퍼(${COMMON_MESSAGE_WRAPPER})를 찾을 수 없습니다. 사이트 구조가 변경되었을 수 있습니다.`);
            return;
        }

        const messageTexts = [];
        allMessageWrappers.forEach(wrapper => {
            // [수정] prefix 변수 자체가 필요 없어짐
            let textContentElement = null;

            const isAI = wrapper.querySelector(AI_SEMANTIC_IDENTIFIER);

            if (isAI) {
                // AI 메시지인 경우
                textContentElement = wrapper.querySelector(AI_TEXT_CONTAINER);
                if (!textContentElement) {
                    console.warn("AI_TEXT_CONTAINER를 찾지 못함. 래퍼 전체로 대체.", wrapper);
                    textContentElement = wrapper;
                }
            } else {
                // 사용자 메시지로 간주
                textContentElement = wrapper.querySelector(USER_TEXT_CONTAINER);
                if (!textContentElement) {
                    console.warn("USER_TEXT_CONTAINER를 찾지 못함. 래퍼 전체로 대체.", wrapper);
                    textContentElement = wrapper;
                }
            }

            // 텍스트 추출 및 추가
            if (textContentElement) {
                const text = textContentElement.innerText.trim();
                if (text) {
                    // [수정] prefix 없이 text만 push
                    messageTexts.push(text);
                }
            } else {
                 console.warn("알 수 없는 메시지 유형 발견 (무시됨):", wrapper);
            }
        });

        // 시간 순서(오래된->최신)로 맞추기 위해 뒤집습니다.
        messageTexts.reverse();

        // 각 메시지 사이에 구분선 추가
        const finalText = messageTexts.join('\n\n' + '-'.repeat(30) + '\n\n');


        // --- 3. 파일로 다운로드 ---
        console.log("4. 파일 다운로드를 시작합니다...");
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
        const fileName = `chat_log_${timestamp}.txt`;
        const blob = new Blob([finalText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("파일 다운로드 완료!");
    }

    // 채팅 스크롤 영역을 찾는 함수
    function findChatArea(messageSelector) {
        let area = document.querySelector(CHAT_AREA_SELECTOR);
        if (area) {
            if (area.querySelector(messageSelector)) {
                 console.log("지정된 채팅 영역(CHAT_AREA_SELECTOR) 찾기 성공:", area);
                return area;
            }
            console.warn("지정된 채팅 영역은 찾았으나, 내부에 메시지(COMMON_MESSAGE_WRAPPER)가 없습니다. 자동 탐색을 시도합니다.");
        }

        console.log("지정된 선택자를 찾지 못했습니다. 스크롤 가능한 영역을 탐색합니다...");
        const divs = document.querySelectorAll('div');
        for (let div of divs) {
            if (div.scrollHeight > div.clientHeight && div.clientHeight > 100 && window.getComputedStyle(div).overflowY === 'scroll') {
                 if (div.querySelector(messageSelector)) {
                     console.log("스크롤 가능하고 메시지 컨테이너를 포함하는 영역 발견:", div);
                     return div;
                 }
            }
        }
        console.log("스크롤 영역 자동 탐색 실패.");
        return null;
    }

})();