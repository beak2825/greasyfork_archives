// ==UserScript==
// @name         LIMS 런 Work Target Size 자동 입력
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  수주번호, LIB, INDEX, Target Size 입력을 기반으로 IBSheet 값 입력 및 체크 (고객명 컬럼 포함 지원)
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/amplification/retrieveNgsAmplificationHiSeqWorkForm.do*
// @match        https://lims3.macrogen.com/ngs/amplification/retrieveNgsAmplificationSequelTwoWorkForm.do*
// @match        https://lims3.macrogen.com/ngs/amplification/retrieveNgsAmplificationMiSeqWorkForm.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557611/LIMS%20%EB%9F%B0%20Work%20Target%20Size%20%EC%9E%90%EB%8F%99%20%EC%9E%85%EB%A0%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/557611/LIMS%20%EB%9F%B0%20Work%20Target%20Size%20%EC%9E%90%EB%8F%99%20%EC%9E%85%EB%A0%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // UI 오버레이 생성
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '10px';
    overlay.style.right = '550px';
    overlay.style.zIndex = '9999';
    overlay.style.backgroundColor = 'white';
    overlay.style.border = '1px solid #ccc';
    overlay.style.padding = '15px';
    overlay.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
    overlay.style.borderRadius = '8px';
    overlay.style.width = '500px'; // 너비 증가 (4컬럼 대응)
    overlay.style.maxHeight = '85vh';
    overlay.style.overflowY = 'auto';
    overlay.style.display = 'none';
    overlay.style.fontFamily = 'Malgun Gothic, sans-serif';

    // 헤더 영역
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '10px';
    overlay.appendChild(header);

    const title = document.createElement('h3');
    title.innerText = 'RUN Work Target Size 입력';
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

    // 드래그 기능
    header.style.cursor = 'move';
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        if (e.target === closeBtn) return;
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
    textarea.placeholder = '데이터를 여기에 붙여넣으세요...\n형식: 수주번호 [탭] (고객명) [탭] LIB [탭] INDEX [탭] Target Size\n예시:\nHN00123456\t홍길동\tCD\tUFR-1\t500';
    textarea.style.width = '100%';
    textarea.style.height = '150px';
    textarea.style.marginBottom = '10px';
    textarea.style.fontSize = '13px';
    textarea.style.padding = '8px';
    textarea.style.border = '1px solid #ddd';
    textarea.style.borderRadius = '4px';
    textarea.style.boxSizing = 'border-box';
    overlay.appendChild(textarea);

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'space-between';
    btnContainer.style.marginBottom = '15px';

    const checkBtn = document.createElement('button');
    checkBtn.innerText = '입력 및 선택 (Apply)';
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
    resultArea.style.display = 'none';

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

    // 토글 버튼 추가
    function addToggleButton() {
        const searchBtn = document.getElementById('btnSearch');
        if (searchBtn && searchBtn.parentNode) {
            if (document.getElementById('btnTargetSizeToggle')) return;

            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'btnTargetSizeToggle';
            toggleBtn.type = 'button';
            toggleBtn.innerText = 'Target Size 입력';
            toggleBtn.className = 'btn_search';
            toggleBtn.style.marginLeft = '5px';
            toggleBtn.style.backgroundColor = '#FF9800'; // 주황색 계열
            toggleBtn.style.color = 'white';
            toggleBtn.style.border = '1px solid #F57C00';
            toggleBtn.style.padding = '0 10px';
            toggleBtn.style.height = '26px';
            toggleBtn.style.cursor = 'pointer';
            toggleBtn.style.fontSize = '12px';
            toggleBtn.style.lineHeight = '24px';
            toggleBtn.style.verticalAlign = 'middle';
            toggleBtn.style.whiteSpace = 'nowrap'; // 텍스트 줄바꿈 방지

            searchBtn.parentNode.insertBefore(toggleBtn, searchBtn.nextSibling);

            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
            });
        } else {
            setTimeout(addToggleButton, 1000);
        }
    }

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

        if (typeof window.ibsAmplification === 'undefined') {
            alert('이 페이지에서 IBSheet (ibsAmplification)를 찾을 수 없습니다.');
            return;
        }

        const sheet = window.ibsAmplification;
        const lines = input.split('\n');

        const targets = lines.map(line => {
            line = line.trim();
            if (!line) return null;

            let ordNo = null;
            let lib = null;
            let index = null;
            let targetSize = null;

            // 1. 탭으로 분리
            if (line.includes('\t')) {
                const parts = line.split('\t').map(p => p.trim());

                if (parts.length >= 5) {
                    // 수주번호, 고객명, LIB, INDEX, TargetSize
                    ordNo = parts[0];
                    // parts[1] (고객명)은 무시
                    lib = parts[2];
                    index = parts[3];
                    targetSize = parts[4];
                } else if (parts.length === 4) {
                    // Case A: 수주번호, LIB, INDEX, TargetSize (기본 4컬럼)
                    // Case B: 고객명, LIB, INDEX, TargetSize (수주번호 생략된 5컬럼 포맷)
                    if (parts[0].toUpperCase().startsWith('HN')) {
                        ordNo = parts[0];
                        lib = parts[1];
                        index = parts[2];
                        targetSize = parts[3];
                    } else {
                        // 고객명으로 간주 (수주번호 상속)
                        // parts[0] (고객명) 무시
                        lib = parts[1];
                        index = parts[2];
                        targetSize = parts[3];
                    }
                } else if (parts.length === 3) {
                    // LIB, INDEX, TargetSize (수주번호 생략된 4컬럼 포맷)
                    lib = parts[0];
                    index = parts[1];
                    targetSize = parts[2];
                }
            }
            // 2. 공백으로 분리
            else {
                const parts = line.split(/\s+/);
                // 공백 분리는 이름(Nuria Navarro) 때문에 위험할 수 있으나, 탭이 없는 경우를 위한 예비책
                // 뒤에서부터 파싱하는 것이 안전함
                if (parts.length >= 5) {
                    targetSize = parts[parts.length - 1];
                    index = parts[parts.length - 2];
                    lib = parts[parts.length - 3];

                    const firstPart = parts[0];
                    if (firstPart.toUpperCase().startsWith('HN')) {
                        ordNo = firstPart;
                    }
                } else if (parts.length === 4) {
                    if (parts[0].toUpperCase().startsWith('HN')) {
                        ordNo = parts[0];
                        lib = parts[1];
                        index = parts[2];
                        targetSize = parts[3];
                    } else {
                        lib = parts[1];
                        index = parts[2];
                        targetSize = parts[3];
                    }
                } else if (parts.length === 3) {
                    lib = parts[0];
                    index = parts[1];
                    targetSize = parts[2];
                }
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
                    // 배경색 변경
                    sheet.SetCellBackColor(data.row, 'libNm', '#FAEBD7');

                    // Target Size 입력
                    if (target.targetSize) {
                        sheet.SetCellValue(data.row, "targetSize", target.targetSize);
                        // 값이 변경되었음을 시각적으로 표시 (선택사항)
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
