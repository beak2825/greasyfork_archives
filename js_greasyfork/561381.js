// ==UserScript==
// @name			Mortal 악수율(5%) killerducky
// @name:ko			Mortal 악수율(5%) killerducky
// @description		5% 이하 악수 배경만 빨강 강조, 글자색 및 UI 변경 없음
// @version			1.0.1
// @namespace		Mortal BadMove Only
// @author			CiterR / Gemini Edit
// @match			*://mjai.ekyu.moe/killerducky/*
// @grant			none
// @license 		MIT
// @downloadURL https://update.greasyfork.org/scripts/561381/Mortal%20%EC%95%85%EC%88%98%EC%9C%A8%285%25%29%20killerducky.user.js
// @updateURL https://update.greasyfork.org/scripts/561381/Mortal%20%EC%95%85%EC%88%98%EC%9C%A8%285%25%29%20killerducky.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 악수율 표시 색상 로직 (배경만 빨강)
    function colorizeBadMove() {
        const actionTable = document.querySelector(".opt-info > table:last-child");
        if (!actionTable) return;

        const actionTrList = actionTable.querySelectorAll("tr");
        let possibilityList = [];
        let actionCardList = [];

        actionTrList.forEach(e => {
            const cardAct = e.querySelector("td:first-child > span");
            const action = cardAct ? cardAct.textContent.substring(0, 1) : "";
            const cardImg = e.querySelector("td:first-child > span > img");
            const card = cardImg ? cardImg.getAttribute('src').split('/').pop().split('.')[0] : "";
            actionCardList.push(action + card);

            const probTd = e.querySelector("td:last-child");
            if (probTd && probTd.textContent !== 'P') {
                possibilityList.push(parseFloat(probTd.textContent));
            }
        });

        const mainActionSpan = document.querySelectorAll(".opt-info > table:first-child span");
        let playerChoice = "";
        if (mainActionSpan[0]) {
            const act = mainActionSpan[0].textContent.substring(0, 1);
            const img = mainActionSpan[0].querySelector('img');
            const card = img ? img.getAttribute('src').split('/').pop().split('.')[0] : "";
            playerChoice = act + card;
        }

        for (let i = 1; i < actionCardList.length; i++) {
            if (actionCardList[i] === playerChoice) {
                const prob = possibilityList[i - 1];
                if (prob <= 5.0) {
                    // 배경만 빨간색으로 변경 
                    actionTrList[i].style.backgroundColor = "red";
                    document.querySelectorAll('.discard-bars-svg > rect[width="20"]').forEach(r => r.style.fill = "red");
                } else {
                    // 평소 선택 시 연두색 배경 유지
                    actionTrList[i].style.backgroundColor = "rgb(171, 196, 49)";
                }
                break;
            }
        }
    }

    // 2. 최종 악수율 계산
    async function calculateTotalRate() {
        const waitData = () => new Promise(res => {
            const check = setInterval(() => {
                if (window.unsafeWindow?.MM?.GS?.fullData?.review || window.MM?.GS?.fullData?.review) {
                    clearInterval(check);
                    res(window.unsafeWindow?.MM?.GS?.fullData?.review || window.MM?.GS?.fullData?.review);
                }
            }, 500);
        });

        const data = await waitData();
        let badMoveCnt = 0;
        const totalMoves = data.total_reviewed || 1;

        data.kyokus.forEach(k => {
            k.entries.forEach(e => {
                if (!e.is_equal) {
                    const pPlayer = e.details[e.actual_index].prob * 100;
                    if (pPlayer <= 5.0) badMoveCnt++;
                }
            });
        });

        const rate = ((badMoveCnt / totalMoves) * 100).toFixed(2);
        const metaTable = document.querySelector(".about-metadata table:first-child");

        if (metaTable) {
            const tr = metaTable.insertRow();
            tr.insertCell().textContent = "Bad move rate";
            tr.insertCell().textContent = `${badMoveCnt}/${totalMoves} = ${rate}%`;
            
            tr.style.fontWeight = "bold";
        }
    }

    function init() {
        const optInfo = document.querySelector('.opt-info');
        if (optInfo) {
            new MutationObserver(colorizeBadMove).observe(optInfo, { childList: true });
        }
        calculateTotalRate();
    }

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);

})();