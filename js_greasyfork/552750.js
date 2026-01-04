// ==UserScript==
// @name         잉여력 계산기
// @namespace    http://fmkorea.com/
// @version      2.6
// @description  기존 배팅 UI에 잉여력 계산 결과 통합 표시 (실시간 배당 업데이트)
// @match        https://www.fmkorea.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552750/%EC%9E%89%EC%97%AC%EB%A0%A5%20%EA%B3%84%EC%82%B0%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552750/%EC%9E%89%EC%97%AC%EB%A0%A5%20%EA%B3%84%EC%82%B0%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FEE_RATE = 0.03;

    const CURRENT_POINTS_SELECTOR = 'span.my_point';
    const BET_AMOUNT_INPUT_SELECTOR = '.input-area input.iText.fm_number_format[name="bet"]';
    const BET_RESULT_INSERT_PARENT_SELECTOR = '.bet > .input-area';

    // 전역 변수로 팀 목록을 관리합니다.
    let allTeams = [];
    let mutationObserver = null; // MutationObserver 인스턴스를 저장할 변수

    function fmt(n) {
        if (isNaN(n)) return '-';
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function toFloat(text) {
        if (!text) return NaN;
        return parseFloat(text.replace(/,/g, '').trim());
    }

    function getCurrentPoints() {
        const pointsElem = document.querySelector(CURRENT_POINTS_SELECTOR);
        if (pointsElem) {
            return toFloat(pointsElem.textContent);
        }
        return 0;
    }

    function scanTeams() {
        const labels = Array.from(document.querySelectorAll('label.label2'));
        const teams = [];
        labels.forEach(label => {
            let name = label.textContent.trim();
            const iTag = label.querySelector('i.fa');
            if (iTag) {
                name = name.replace(iTag.textContent, '').trim();
            }
            if (!name) return;

            const radioInput = document.getElementById(label.getAttribute('for'));
            if (!radioInput) return;

            let container = label.closest('div.o'); // div.o가 각 베팅 선택지를 감싸는 요소
            if (!container) return;

            let ratioVal = NaN;
            let actualRatioSpan = null;

            // 배당률을 나타내는 span.ratio를 더 정확하게 타겟팅
            // i.fa-trophy 아이콘과 함께 있는 span.tooltip 바로 뒤의 span.ratio
            const trophyLabel = container.querySelector('span.label > i.fa-trophy');
            if (trophyLabel) {
                // HTML 구조: <span class="label"> <i class="fa-trophy"></i> <span class="tooltip">배당률</span> <span class="ratio">5.56</span> </span>
                // 따라서 i.fa-trophy의 부모(span.label) 내에서 span.tooltip 바로 뒤의 span.ratio를 찾음
                actualRatioSpan = trophyLabel.parentElement.querySelector('span.tooltip + span.ratio');

                if (actualRatioSpan) {
                    ratioVal = toFloat(actualRatioSpan.textContent);
                    // console.log(`[scanTeams] 팀: ${name}, 초기 배당률: ${ratioVal}, Span Ref:`, actualRatioSpan); // 디버깅용
                }
            }


            if (name && !isNaN(ratioVal)) {
                 teams.push({
                     name,
                     ratio: ratioVal,
                     labelElement: label,
                     radioInput: radioInput,
                     containerElement: container,
                     actualRatioSpan: actualRatioSpan // 이 실제 DOM 요소 참조를 유지합니다.
                 });
            }
        });
        // console.log("[scanTeams] 모든 팀 스캔 완료:", teams); // 디버깅용
        return teams;
    }

    function createResultDisplayArea(parentElem) {
        let resultArea = parentElem.querySelector('.fmk-calc-result-area');
        if (!resultArea) {
            resultArea = document.createElement('div');
            resultArea.className = 'fmk-calc-result-area';
            resultArea.style.cssText = `
                margin-top:10px; padding-top:10px; border-top:1px dashed #333;
                font-size:13px; color:#bbb;
                text-align: center;
            `;
            parentElem.appendChild(resultArea);
        }
        return resultArea;
    }

    function updateBettingResult() {
        // console.log("[updateBettingResult] 함수 호출됨."); // 디버깅용
        const currentPoints = getCurrentPoints();
        const betInput = document.querySelector(BET_AMOUNT_INPUT_SELECTOR);
        if (!betInput) return;

        const betAmount = toFloat(betInput.value);

        const selectedRadio = document.querySelector('input[type="radio"][name="o"]:checked');
        let selectedTeam = null;
        if (selectedRadio) {
            selectedTeam = allTeams.find(t => t.radioInput === selectedRadio);
        }

        const resultArea = document.querySelector(BET_RESULT_INSERT_PARENT_SELECTOR + ' > .fmk-calc-result-area');
        if (!resultArea) return;

        resultArea.innerHTML = '';
        resultArea.style.color = '#bbb';

        if (!selectedTeam) {
            resultArea.innerHTML = '팀을 선택하세요.';
            return;
        }

        // --- 여기서 최신 배당률 텍스트를 다시 읽어와서 selectedTeam.ratio를 업데이트합니다 ---
        if (selectedTeam.actualRatioSpan) {
            const newRatio = toFloat(selectedTeam.actualRatioSpan.textContent);
            if (!isNaN(newRatio) && selectedTeam.ratio !== newRatio) {
                // console.log(`[updateBettingResult] 배당률 업데이트 감지: ${selectedTeam.name} - 이전: ${selectedTeam.ratio}, 새로운: ${newRatio}`); // 디버깅용
                selectedTeam.ratio = newRatio;
            }
            // else if (selectedTeam.ratio === newRatio) {
            //     console.log(`[updateBettingResult] 배당률 변경 없음: ${selectedTeam.name} - 현재: ${selectedTeam.ratio}`); // 디버깅용
            // }
        } else {
            // console.warn(`[updateBettingResult] selectedTeam.actualRatioSpan이 유효하지 않습니다 for ${selectedTeam ? selectedTeam.name : 'Unknown Team'}`); // 디버깅용
        }
        // --------------------------------------------------------------------------

        if (isNaN(betAmount) || betAmount <= 0) {
            resultArea.innerHTML = '배팅 금액을 입력하세요.';
            return;
        }

        if (betAmount > currentPoints) {
            resultArea.innerHTML = `<span style="color:#f44336;">잉여력 부족! (현재 ${fmt(currentPoints)})</span>`;
            return;
        }

        const currentRatio = selectedTeam.ratio;
        if (isNaN(currentRatio) || currentRatio <= 0) {
             resultArea.innerHTML = `<span style="color:#f44336;">유효하지 않은 배당률입니다.</span>`;
             return;
        }

        const remainingPoints = currentPoints - betAmount;
        const grossProfit = betAmount * currentRatio;
        const netReceipt = grossProfit * (1 - FEE_RATE);
        const totalAfterWin = remainingPoints + Math.floor(netReceipt);

        resultArea.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin: 4px auto; max-width: 200px;">
                <span style="color:#ffffff;">선택 배당:</span>
                <b style="color:#ffeb3b;">${currentRatio.toFixed(2)}</b>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin: 4px auto; max-width: 200px;">
                <span style="color:#ffffff;">남은 잉여력:</span>
                <b style="color:#81c784;">${fmt(remainingPoints)}</b>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin: 4px auto; max-width: 200px;">
                <span style="color:#ffffff;">예상 획득:</span>
                <b style="color:#ffeb3b;">${fmt(Math.floor(netReceipt))}</b>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin: 4px auto; max-width: 200px;">
                <span style="color:#ffffff;">예상 총 잉여력:</span>
                <b style="color:#64b5f6; font-weight:bold;">${fmt(totalAfterWin)}</b>
            </div>
        `;
    }

    function initialize() {
        allTeams = scanTeams(); // 모든 팀 정보 스캔

        const betInputArea = document.querySelector(BET_RESULT_INSERT_PARENT_SELECTOR);
        if (betInputArea) {
            createResultDisplayArea(betInputArea); // 결과 표시 영역 생성
        }

        const betInput = document.querySelector(BET_AMOUNT_INPUT_SELECTOR);
        if (betInput) {
            betInput.removeEventListener('input', updateBettingResult);
            betInput.addEventListener('input', updateBettingResult);
        }

        document.querySelectorAll('input[type="radio"][name="o"]').forEach(radio => {
            radio.removeEventListener('change', updateBettingResult);
            radio.addEventListener('change', updateBettingResult);
        });

        const observerTarget = document.querySelector('div.bet');
        if (observerTarget) {
            if (mutationObserver) {
                mutationObserver.disconnect();
            }

            mutationObserver = new MutationObserver((mutationsList, observer) => {
                let needsUpdate = false;
                for (const mutation of mutationsList) {
                    // console.log("[MutationObserver] Mutation type:", mutation.type, "Target:", mutation.target, "Parent:", mutation.target.parentElement); // 모든 변화 로깅

                    if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
                        // 변경된 텍스트 노드의 부모가 배당률 span (span.tooltip + span.ratio)인지 확인
                        if (mutation.target.parentElement && mutation.target.parentElement.matches('span.label span.tooltip + span.ratio')) {
                            // console.log("[MutationObserver] 배당률 텍스트 변경 감지!"); // 디버깅용
                            needsUpdate = true;
                            break;
                        }
                    } else if (mutation.type === 'childList') {
                        // 변경된 노드 또는 추가/제거된 노드 중에서 배당률 관련 요소가 있는지 확인
                        const changedNodes = Array.from(mutation.addedNodes)
                                              .concat(Array.from(mutation.removedNodes))
                                              .concat(mutation.target.nodeType === Node.ELEMENT_NODE ? [mutation.target] : []);

                        if (changedNodes.some(node => node.nodeType === Node.ELEMENT_NODE &&
                            (node.matches('span.label span.tooltip + span.ratio') || // 직접 배당률 span
                             node.querySelector('span.label span.tooltip + span.ratio') || // 자식으로 배당률 span을 가짐
                             node.closest('div.o > span.label')) // 배당률 span을 포함하는 부모 span.label의 변경
                           )) {
                            // console.log("[MutationObserver] 배당률 관련 DOM 구조 또는 요소 변경 감지! 팀 재스캔."); // 디버깅용
                            allTeams = scanTeams(); // 팀 정보를 재스캔하여 actualRatioSpan 참조 갱신
                            needsUpdate = true;
                            break;
                        }
                    }
                }

                if (needsUpdate) {
                    // console.log("DOM 변화 감지, 배팅 결과 업데이트."); // 디버깅용
                    updateBettingResult();
                }
            });

            // observerTarget 요소의 모든 자식 노드 변경, 서브트리 변경, 텍스트 데이터 변경을 깊게 관찰
            mutationObserver.observe(observerTarget, { childList: true, subtree: true, characterData: true });
        }


        // 페이지 로드 시 초기 계산 업데이트
        setTimeout(() => updateBettingResult(), 600);
    }

    function ready(fn) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(fn, 500);
        } else {
            document.addEventListener('DOMContentLoaded', () => setTimeout(fn, 500));
        }
    }

    ready(initialize);

})();