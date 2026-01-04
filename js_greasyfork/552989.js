// ==UserScript==
// @name         Pokemon Showdown 한국어 용어 번역기
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  포켓몬 쇼다운의 용어를 번역하고 로그 복사 형식을 유지합니다.
// @author       You
// @match        https://play.pokemonshowdown.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552989/Pokemon%20Showdown%20%ED%95%9C%EA%B5%AD%EC%96%B4%20%EC%9A%A9%EC%96%B4%20%EB%B2%88%EC%97%AD%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552989/Pokemon%20Showdown%20%ED%95%9C%EA%B5%AD%EC%96%B4%20%EC%9A%A9%EC%96%B4%20%EB%B2%88%EC%97%AD%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------------------------------------
    // ▼▼▼ 여기에 번역하고 싶은 단어를 계속 추가하면 됨 ▼▼▼
    // "영어 원문": "한국어 번역" 형식으로 추가
    const translationMap = {
        // --- 기술 이름 ---
        "Swords Dance": "칼춤",
        "Dragon Dance": "용의춤",
        "Protect": "방어",
        "Substitute": "대타출동",
        "Stealth Rock": "스텔스록",
        "Spikes": "압정뿌리기",
        "Toxic Spikes": "독압정",
        "U-turn": "유턴",

        // --- 특성 이름 ---
        "Intimidate": "위협",
        "Pressure": "프레셔",
        "Unaware": "천진",

        // --- 기타 용어 ---
        "Teambuilder": "팀 빌더",
        "Ladder": "래더",
        "(blazing hot)": "(작열)",
        "(revitalized)": "(생기발랄)"
    };
    // ▲▲▲ 여기까지 ▲▲▲
    // -------------------------------------------------------------

    // 번역을 실행할 함수
    function applyTranslations() {
        // 쇼다운 채팅/로그 영역을 특정
        const targetNode = document.querySelector('.battle-log');
        if (!targetNode) return;

        // 번역할 단어 목록 (Map의 key들)
        const keys = Object.keys(translationMap);

        // 정규 표현식으로 모든 키를 한 번에 찾을 수 있게 준비
        // 예: (Swords Dance|Dragon Dance|Protect|...)
        const regex = new RegExp(keys.join('|'), 'g');

        // 채팅 로그의 모든 p 태그 (대화 한 줄 한 줄)를 순회
        targetNode.querySelectorAll('p').forEach(p => {
            // 이미 번역 처리된 줄은 건너뛰기
            if (p.dataset.translated) return;

            // 정규 표현식과 일치하는 모든 단어를 찾아서 바꾸기
            p.innerHTML = p.innerHTML.replace(regex, (match) => {
                // 원본 텍스트는 title 속성에 넣어서 마우스를 올리면 보이게
                // 화면에는 번역된 텍스트를 보여줌
                return `<span title="${match}" style="color: #A0C4FF; font-weight: bold;">${translationMap[match]}</span>`;
            });

            // 번역 처리되었다고 표시
            p.dataset.translated = 'true';
        });
    }

    // 쇼다운은 내용이 계속 바뀌므로, 1초마다 새로운 로그가 있는지 확인하고 번역 실행
    setInterval(applyTranslations, 1000);
})();