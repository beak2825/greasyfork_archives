// ==UserScript==
// @name         LIMS 런 대기 자동 체크
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  수주번호, LIB, INDEX, Target Size 입력을 기반으로 IBSheet 체크박스 자동 선택 및 데이터 입력
// @author       Antigravity
// @match        https://lims3.macrogen.com/ngs/amplification/retrieveNgsAmplificationHiSeqForm.do?menuCd=NGS150100
// @match        https://lims3.macrogen.com/ngs/amplification/retrieveNgsAmplificationSequelTwoForm.do?menuCd=NGS150500
// @match        https://lims3.macrogen.com/ngs/amplification/retrieveNgsAmplificationMiSeqForm.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557177/LIMS%20%EB%9F%B0%20%EB%8C%80%EA%B8%B0%20%EC%9E%90%EB%8F%99%20%EC%B2%B4%ED%81%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/557177/LIMS%20%EB%9F%B0%20%EB%8C%80%EA%B8%B0%20%EC%9E%90%EB%8F%99%20%EC%B2%B4%ED%81%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // UI 오버레이 생성
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '10px'; // 버튼 아래쪽 쯤에 위치하도록 조정
    overlay.style.right = '550px';
    overlay.style.zIndex = '9999';
    overlay.style.backgroundColor = 'white';
    overlay.style.border = '1px solid #ccc';
    overlay.style.padding = '15px';
    overlay.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
    overlay.style.borderRadius = '8px';
    overlay.style.width = '500px'; // 너비 증가
    overlay.style.maxHeight = '85vh';
    overlay.style.overflowY = 'auto';
    overlay.style.display = 'none'; // 기본적으로 숨김
    overlay.style.fontFamily = 'Malgun Gothic, sans-serif'; // 폰트 설정

    // 헤더 영역 (제목 + 닫기 버튼)
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '10px';
    overlay.appendChild(header);

    const title = document.createElement('h3');
    title.innerText = 'RUN-Wait-Auto-Check (수주번호, Target Size 포함)';
    title.style.margin = '0';
    title.style.fontSize = '16px';
    title.style.fontWeight = 'bold';
    title.style.color = '#333';
    header.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.innerText = '✕';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#999';
    closeBtn.style.padding = '0 5px';
    header.appendChild(closeBtn);

    // 드래그 기능 추가
    header.style.cursor = 'move';

    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        if (e.target === closeBtn) return; // 닫기 버튼 클릭 시 드래그 방지
        isDragging = true;
        offsetX = e.clientX - overlay.getBoundingClientRect().left;
        offsetY = e.clientY - overlay.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        overlay.style.left = `${x}px`;
        overlay.style.top = `${y}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    const textarea = document.createElement('textarea');
    textarea.placeholder = '데이터를 여기에 붙여넣으세요...\n형식: 수주번호 [탭] LIB [탭] INDEX [탭] (Target Size)\n예시:\nHN00123456\tCD\tUFR-1\t500';
    textarea.style.width = '100%';
    textarea.style.height = '150px'; // 높이 증가
    textarea.style.marginBottom = '10px';
    textarea.style.fontSize = '13px';
    textarea.style.padding = '8px';
    textarea.style.border = '1px solid #ddd';
    textarea.style.borderRadius = '4px';
    textarea.style.boxSizing = 'border-box'; // 패딩 포함 너비 계산
    overlay.appendChild(textarea);

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'space-between';
    btnContainer.style.marginBottom = '15px';

    const checkBtn = document.createElement('button');
    checkBtn.innerText = '검증 및 선택 (Check)';
    checkBtn.style.padding = '8px 15px';
    checkBtn.style.cursor = 'pointer';
    checkBtn.style.backgroundColor = '#4CAF50';
    checkBtn.style.color = 'white';
    checkBtn.style.border = 'none';
    checkBtn.style.borderRadius = '4px';
    checkBtn.style.fontSize = '13px';
    checkBtn.style.fontWeight = 'bold';
    btnContainer.appendChild(checkBtn);

    const clearBtn = document.createElement('button');
    clearBtn.innerText = '초기화';
    clearBtn.style.padding = '8px 15px';
    clearBtn.style.cursor = 'pointer';
    clearBtn.style.backgroundColor = '#f44336';
    clearBtn.style.color = 'white';
    clearBtn.style.border = 'none';
    clearBtn.style.borderRadius = '4px';
    clearBtn.style.fontSize = '13px';
    btnContainer.appendChild(clearBtn);

    overlay.appendChild(btnContainer);

    // 결과 표시 영역
    const resultArea = document.createElement('div');
    resultArea.style.borderTop = '1px solid #eee';
    resultArea.style.paddingTop = '15px';
    resultArea.style.display = 'none'; // 초기에는 숨김

    const resultSummary = document.createElement('div');
    resultSummary.style.fontWeight = 'bold';
    resultSummary.style.marginBottom = '10px';
    resultSummary.style.fontSize = '14px';
    resultArea.appendChild(resultSummary);

    const missingLabel = document.createElement('div');
    missingLabel.innerText = '매칭되지 않은 항목:';
    missingLabel.style.fontSize = '13px';
    missingLabel.style.marginBottom = '5px';
    missingLabel.style.fontWeight = 'bold';
    missingLabel.style.color = '#d32f2f';
    resultArea.appendChild(missingLabel);

    const missingTextarea = document.createElement('textarea');
    missingTextarea.readOnly = true;
    missingTextarea.style.width = '100%';
    missingTextarea.style.height = '100px';
    missingTextarea.style.fontSize = '12px';
    missingTextarea.style.backgroundColor = '#fff5f5';
    missingTextarea.style.border = '1px solid #ffcdd2';
    missingTextarea.style.marginBottom = '10px';
    missingTextarea.style.padding = '8px';
    missingTextarea.style.boxSizing = 'border-box';
    resultArea.appendChild(missingTextarea);

    const copyBtn = document.createElement('button');
    copyBtn.innerText = '미매칭 항목 복사';
    copyBtn.style.padding = '5px 10px';
    copyBtn.style.fontSize = '12px';
    copyBtn.style.cursor = 'pointer';
    copyBtn.style.backgroundColor = '#2196F3';
    copyBtn.style.color = 'white';
    copyBtn.style.border = 'none';
    copyBtn.style.borderRadius = '3px';
    resultArea.appendChild(copyBtn);

    overlay.appendChild(resultArea);
    document.body.appendChild(overlay);

    // 토글 버튼 생성 및 추가
    function addToggleButton() {
        const searchBtn = document.getElementById('btnSearch');
        if (searchBtn && searchBtn.parentNode) {
            // 이미 버튼이 있는지 확인
            if (document.getElementById('btnAutoCheckToggle')) return;

            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'btnAutoCheckToggle';
            toggleBtn.type = 'button';
            toggleBtn.innerText = '자동 체크';
            toggleBtn.className = 'btn_search'; // 기존 스타일 클래스 활용 시도

            // 스타일 오버라이드 (기존 클래스가 안 먹거나 다를 수 있으므로 직접 지정)
            toggleBtn.style.marginLeft = '5px';
            toggleBtn.style.backgroundColor = '#673AB7'; // 보라색 계열로 구분
            toggleBtn.style.color = 'white';
            toggleBtn.style.border = '1px solid #512DA8';
            toggleBtn.style.padding = '0 10px';
            toggleBtn.style.height = '26px'; // 주변 버튼 높이에 맞춤 (추정)
            toggleBtn.style.cursor = 'pointer';
            toggleBtn.style.fontSize = '12px';
            toggleBtn.style.lineHeight = '24px';
            toggleBtn.style.verticalAlign = 'middle';

            // Search 버튼 뒤에 추가
            searchBtn.parentNode.insertBefore(toggleBtn, searchBtn.nextSibling);

            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (overlay.style.display === 'none') {
                    overlay.style.display = 'block';
                } else {
                    overlay.style.display = 'none';
                }
            });
        } else {
            // 버튼을 찾지 못했을 경우 재시도 (페이지 로딩 지연 등)
            setTimeout(addToggleButton, 1000);
        }
    }

    // 페이지 로드 후 버튼 추가 시도
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addToggleButton);
    } else {
        addToggleButton();
    }


    // 이벤트 리스너
    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    clearBtn.addEventListener('click', () => {
        textarea.value = '';
        resultArea.style.display = 'none';
    });

    copyBtn.addEventListener('click', () => {
        missingTextarea.select();
        document.execCommand('copy');
        alert('클립보드에 복사되었습니다.');
    });

    checkBtn.addEventListener('click', () => {
        const input = textarea.value.trim();
        if (!input) {
            alert('데이터를 입력해주세요.');
            return;
        }

        // IBSheet 존재 여부 확인
        if (typeof window.ibsAmplification === 'undefined') {
            alert('이 페이지에서 IBSheet (ibsAmplification)를 찾을 수 없습니다.');
            return;
        }

        const sheet = window.ibsAmplification;
        const lines = input.split('\n');

        // 입력 데이터 파싱
        const targets = lines.map(line => {
            line = line.trim();
            if (!line) return null;

            let ordNo = null;
            let lib = null;
            let index = null;
            let targetSize = null;

            let parts = [];

            // 1. 탭으로 분리
            if (line.includes('\t')) {
                parts = line.split('\t').map(p => p.trim());
            }
            // 2. 공백으로 분리
            else {
                parts = line.split(/\s+/);
            }

            // 파싱 로직 (P27 기존 로직 + P29 Target Size 로직 통합)
            if (parts.length >= 5) {
                // 5컬럼: 수주번호, (고객명), LIB, INDEX, Target Size
                ordNo = parts[0];
                lib = parts[2];
                index = parts[3];
                targetSize = parts[4];
            } else if (parts.length === 4) {
                // 4컬럼
                if (parts[0].toUpperCase().startsWith('HN')) {
                    // 수주번호, LIB, INDEX, Target Size
                    ordNo = parts[0];
                    lib = parts[1];
                    index = parts[2];
                    targetSize = parts[3];
                } else {
                    // (고객명), LIB, INDEX, Target Size
                    lib = parts[1];
                    index = parts[2];
                    targetSize = parts[3];
                }
            } else if (parts.length === 3) {
                // 3컬럼
                if (parts[0].toUpperCase().startsWith('HN')) {
                    // 수주번호, LIB, INDEX (기존 P27 방식)
                    ordNo = parts[0];
                    lib = parts[1];
                    index = parts[2];
                } else {
                    // LIB, INDEX, Target Size (P29 방식으로 추정 - 단, 기존 3컬럼 포맷 사용자와 충돌 가능성 있음)
                    // 여기서는 기존 P27 사용자 보호를 위해 OrdNo가 없더라도 TargetSize가 '명확히 숫자'인 경우에만 TargetSize로 간주하거나,
                    // 혹은 안전하게 기존 27번 방식(LIB, INDEX, ignored)을 따를 수도 있음.
                    // 하지만 사용자는 'P29 기능 추가'를 원하므로 P29 로직을 일부 수용해야 함.
                    // 절충안: 마지막 컬럼이 숫자로만 구성되어 있다면 TargetSize로 본다.

                    const p2 = parts[2];
                    if (/^\d+$/.test(p2)) {
                        lib = parts[0];
                        index = parts[1];
                        targetSize = parts[2];
                    } else {
                        // 숫자가 아니면 그냥 Index의 일부일 수도 있지만, 기존 P27 로직상 3컬럼 처리는 OrdNo가 있어야 함.
                        // OrdNo가 없는 3컬럼? P27에서는 P0(HN)->OrdNo, P1->Lib, P2->Index 였음.
                        // HN이 아니면? P27 로직상 parts.length >= 2 (else branch) -> P0->Lib, P1..->Index.
                        // 즉 HN 없이 3컬럼이면 P0->Lib, P1 P2 -> Index.
                        // P29의 'Lib, Index, TargetSize'와 충돌함.
                        // 사용자가 TargetSize를 넣으려면 4컬럼 이상 쓰거나 탭을 쓰길 권장.
                        // 여기서는 우선 '숫자면 TargetSize' 휴리스틱 적용.
                        lib = parts[0];
                        index = parts[1] + " " + parts[2]; // 기존 P27 처럼 Index로 합침 (공백 분리 시)
                        // 하지만 탭 분리면 합치기 애매함. 탭 분리시 parts[2]는 별도 컬럼.
                        // 탭 분리된 경우라면 확실히 컬럼 의도가 있으므로 TargetSize로 봐야 할 수도 있음.
                        if (line.includes('\t')) {
                            // 탭 분리인데 3컬럼이고 HN 없음 -> Lib, Index, TargetSize (P29 Style)
                            lib = parts[0];
                            index = parts[1];
                            targetSize = parts[2];
                        }
                    }
                }
            } else if (parts.length === 2) {
                // 2컬럼: LIB, INDEX
                lib = parts[0];
                index = parts[1];
            }

            if (lib && index) {
                return {
                    ordNo: ordNo,
                    lib: lib,
                    index: index,
                    targetSize: targetSize,
                    original: line
                };
            }
            return null;
        }).filter(item => item !== null);

        if (targets.length === 0) {
            alert('유효한 데이터를 찾을 수 없습니다. 형식을 확인해주세요.');
            return;
        }

        // IBSheet 행 반복
        const startRow = sheet.GetDataFirstRow();
        const endRow = sheet.GetDataLastRow();

        let matchCount = 0;
        let notFoundList = [];
        let currentSheetOrdNo = "";

        const sheetData = [];
        for (let i = startRow; i <= endRow; i++) {
            let rowOrdNo = sheet.GetCellValue(i, "ordNo");
            const rowLib = sheet.GetCellValue(i, "libNm");
            const rowIndex = sheet.GetCellValue(i, "idxCd");

            if (rowOrdNo && rowOrdNo.trim() !== "") {
                currentSheetOrdNo = rowOrdNo.trim();
            }

            sheetData.push({
                row: i,
                ordNo: currentSheetOrdNo,
                lib: rowLib ? rowLib.trim() : "",
                index: rowIndex ? rowIndex.trim() : ""
            });
        }

        let lastInputOrdNo = "";

        targets.forEach(target => {
            if (target.ordNo && target.ordNo.trim() !== "") {
                lastInputOrdNo = target.ordNo.trim();
            }
            const targetOrdNo = (target.ordNo && target.ordNo.trim() !== "") ? target.ordNo.trim() : lastInputOrdNo;

            let found = false;

            for (const data of sheetData) {
                let isMatch = false;

                const normalize = (str) => str ? str.replace(/\s+/g, '') : '';
                const isLibMatch = data.lib === target.lib;
                const isIndexMatch = normalize(data.index) === normalize(target.index);

                if (targetOrdNo) {
                    if (data.ordNo === targetOrdNo && isLibMatch && isIndexMatch) {
                        isMatch = true;
                    }
                } else {
                    if (isLibMatch && isIndexMatch) {
                        isMatch = true;
                    }
                }

                if (isMatch) {
                    // 체크박스 체크
                    sheet.SetCellValue(data.row, "ibCheck", 1);
                    sheet.SetCellBackColor(data.row, 'libNm', '#FAEBD7');

                    // Target Size 입력 (있을 경우)
                    if (target.targetSize) {
                        sheet.SetCellValue(data.row, "targetSize", target.targetSize);
                        sheet.SetCellBackColor(data.row, 'targetSize', '#FFFACD');
                    }

                    found = true;
                    matchCount++;
                }
            }
            if (!found) {
                notFoundList.push(target.original);
            }
        });

        // 결과 표시
        resultArea.style.display = 'block';

        const totalInput = targets.length;
        resultSummary.innerHTML = `총 입력: ${totalInput}건<br>성공: <span style="color:green">${matchCount}</span>건<br>실패: <span style="color:red">${notFoundList.length}</span>건`;

        if (notFoundList.length > 0) {
            missingTextarea.value = notFoundList.join('\n');
            missingLabel.style.display = 'block';
            missingTextarea.style.display = 'block';
            copyBtn.style.display = 'inline-block';
        } else {
            missingTextarea.value = '모든 항목이 매칭되었습니다.';
            missingLabel.style.display = 'none';
            copyBtn.style.display = 'none';
        }
    });

})();
