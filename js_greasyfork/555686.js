// ==UserScript==
// @name         SMRT Link 바코드 디멀티 v1.3
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  SMRT Link Barcode Data XLSX export with LIMS data merging and sorting functionality
// @description:ko SMRT Link 바코드 데이터를 XLSX로 추출하고 LIMS 데이터 병합 및 정렬 기능을 제공합니다
// @author       김재형
// @match        https://172.19.85.18:8243/sl/*
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555686/SMRT%20Link%20%EB%B0%94%EC%BD%94%EB%93%9C%20%EB%94%94%EB%A9%80%ED%8B%B0%20v13.user.js
// @updateURL https://update.greasyfork.org/scripts/555686/SMRT%20Link%20%EB%B0%94%EC%BD%94%EB%93%9C%20%EB%94%94%EB%A9%80%ED%8B%B0%20v13.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Extracts the data from the AG Grid on the SMRT Link page.
     * @returns {Object} { headers: Array, rows: Array }
     */
    function extractGridData() {
        const headers = [
            "Sample Name",
            "Barcode",
            "Barcode Quality",
            "HiFi Reads",
            "HiFi Read Length (mean, bp)",
            "HiFi Read Quality (median, QV)",
            "HiFi Yield (bp)",
            "Polymerase Read Length (mean, bp)"
        ];

        const colIds = [
            "barcode_barcode_table_biosample",
            "barcode_barcode_table_barcode",
            "barcode_barcode_table_mean_bcqual",
            "barcode_barcode_table_number_of_reads",
            "barcode_barcode_table_mean_read_length",
            "barcode_barcode_table_median_read_quality",
            "barcode_barcode_table_number_of_bases",
            "barcode_barcode_table_mean_polymerase_read_length"
        ];

        const dataRows = [];
        // SMRT Link 페이지인지 확인하기 위해 특정 요소를 먼저 찾습니다.
        const grid = document.querySelector('div.ag-root-wrapper');
        if (!grid) {
            return null; // SMRT Link 페이지가 아니므로 아무것도 반환하지 않음
        }

        const rows = grid.querySelectorAll('div.ag-center-cols-container div[role="row"]');
        if (rows.length === 0) {
            console.error("SMRT Link XLSX: 데이터 행을 찾을 수 없습니다.");
            return null;
        }

        rows.forEach(row => {
            let rowData = [];
            colIds.forEach(colId => {
                const cell = row.querySelector(`[col-id="${colId}"]`);
                let cellText = cell ? cell.innerText.trim() : "";
                rowData.push(cellText);
            });
            dataRows.push(rowData);
        });

        return { headers, rows: dataRows };
    }

    /**
     * Show sort modal with extracted data
     */
    function showSortModal() {
        const data = extractGridData();
        if (!data || data.rows.length === 0) {
            alert("다운로드할 SMRT Link 데이터를 찾지 못했습니다. (또는 데이터가 0행입니다)");
            return;
        }

        // Store data globally for sorting
        window.smrtLinkData = data;
        // Store LIMS info globally
        window.smrtLimsInfo = { data: [], keyColumnIndex: -1, keyColumnName: '' };

        // Create modal HTML
        const modalHTML = `
            <div id="smrt-sort-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; font-family: 'Pretendard', -apple-system, sans-serif;">
                <div style="background: white; border-radius: 12px; width: 95%; max-width: 800px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); margin: auto;">
                    <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #111827;">정렬 및 다운로드</h3>
                        <button id="smrt-close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; padding: 0; line-height: 1;">&times;</button>
                    </div>
                    <div style="padding: 24px; overflow-y: auto; flex: 1;">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">정렬 기준 열 선택</label>
                            <div style="display: flex; gap: 16px;">
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="radio" name="smrt-sort-column" value="0" checked style="margin-right: 8px;">
                                    <span>Sample Name</span>
                                </label>
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="radio" name="smrt-sort-column" value="1" style="margin-right: 8px;">
                                    <span>Barcode</span>
                                </label>
                            </div>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label for="smrt-sort-list" style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">정렬 순서 목록 (한 줄에 하나씩)</label>
                            <textarea id="smrt-sort-list" placeholder="정렬할 순서대로 목록을 입력하세요..." style="width: 100%; height: 250px; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-family: monospace; font-size: 0.875rem; resize: vertical; box-sizing: border-box;"></textarea>
                            <p id="smrt-sort-count" style="text-align: right; margin-top: 4px; font-size: 0.875rem; color: #6b7280;">입력한 개수: 0</p>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">LIMS 추출 기준</label>
                            <div style="display: flex; gap: 16px;">
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="radio" name="smrt-lims-column" value="-2" checked style="margin-right: 8px;">
                                    <span>Sample Name 기준</span>
                                </label>
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="radio" name="smrt-lims-column" value="-1" style="margin-right: 8px;">
                                    <span>Barcode 기준</span>
                                </label>
                            </div>
                        </div>
                        <div id="smrt-validation-result" style="display: none; margin-top: 16px; padding: 12px; border-radius: 8px; font-size: 0.875rem;"></div>
                    </div>
                    <div style="padding: 16px; border-top: 1px solid #e5e7eb; background: #f9fafb;">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 8px;">
                            <button id="smrt-fetch-lims" style="padding: 12px 16px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-size: 0.875rem;">LIMS 붙여넣기</button>
                            <button id="smrt-validate" style="padding: 12px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-size: 0.875rem;">데이터 검증</button>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 8px;">
                            <button id="smrt-copy-key-data" style="padding: 12px 16px; background: #fb923c; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-size: 0.875rem;">주요 데이터 복사</button>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                            <button id="smrt-download-xlsx-unsorted" style="padding: 12px 16px; background: #059669; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-size: 0.875rem;">XLSX 정렬 없이</button>
                            <button id="smrt-download-xlsx-sorted" style="padding: 12px 16px; background: #8b5cf6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-size: 0.875rem;">XLSX 정렬 후</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Event listeners
        const modal = document.getElementById('smrt-sort-modal');
        const sortList = document.getElementById('smrt-sort-list');
        const sortCount = document.getElementById('smrt-sort-count');
        const validationResult = document.getElementById('smrt-validation-result');
        const btnClose = document.getElementById('smrt-close-modal');
        const btnFetchLims = document.getElementById('smrt-fetch-lims');
        const btnValidate = document.getElementById('smrt-validate');
        const btnCopyKeyData = document.getElementById('smrt-copy-key-data');
        const btnXlsxUnsorted = document.getElementById('smrt-download-xlsx-unsorted');
        const btnXlsxSorted = document.getElementById('smrt-download-xlsx-sorted');

        // Update count
        sortList.addEventListener('input', () => {
            const count = sortList.value.trim().split('\n').filter(line => line.trim() !== '').length;
            sortCount.textContent = `입력한 개수: ${count}`;
        });

        // Close modal
        const closeModal = () => modal.remove();
        btnClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // 데이터 검증 기능
        btnValidate.addEventListener('click', () => {
            const sortOrder = sortList.value.trim().split('\n').filter(line => line.trim() !== '');
            if (sortOrder.length === 0) {
                validationResult.style.display = 'block';
                validationResult.style.background = '#fef2f2';
                validationResult.style.border = '1px solid #fca5a5';
                validationResult.style.color = '#991b1b';
                validationResult.innerHTML = '⚠️ 검증할 정렬 순서 목록을 입력해주세요.';
                return;
            }

            const sortColumnIndex = parseInt(document.querySelector('input[name="smrt-sort-column"]:checked').value);
            const keyColumnName = sortColumnIndex === 0 ? 'Sample Name' : 'Barcode';

            // 실제 데이터에서 해당 열의 값들 추출
            const dataItems = new Set(data.rows.map(row => String(row[sortColumnIndex] || '').trim()).filter(Boolean));
            const sortOrderSet = new Set(sortOrder.map(item => item.trim()));

            // 매칭 안되는 항목 찾기
            const missingInData = [...sortOrderSet].filter(item => !dataItems.has(item));
            const missingInList = [...dataItems].filter(item => !sortOrderSet.has(item));

            let resultHTML = `<strong style="font-size: 1rem;">${keyColumnName} 기준 검증 결과</strong><br><br>`;

            if (missingInData.length === 0 && missingInList.length === 0) {
                validationResult.style.display = 'block';
                validationResult.style.background = '#f0fdf4';
                validationResult.style.border = '1px solid #86efac';
                validationResult.style.color = '#166534';
                resultHTML += '✅ <strong>완벽하게 일치합니다!</strong> 모든 항목이 정확히 매칭됩니다.';
            } else {
                validationResult.style.display = 'block';
                validationResult.style.background = '#fffbeb';
                validationResult.style.border = '1px solid #fcd34d';
                validationResult.style.color = '#92400e';

                if (missingInData.length > 0) {
                    resultHTML += `<div style="margin-bottom: 12px;">`;
                    resultHTML += `<strong style="color: #dc2626;">❌ 입력 목록에는 있지만 실제 데이터에 없는 항목 (${missingInData.length}개):</strong><br>`;
                    resultHTML += `<div style="max-height: 120px; overflow-y: auto; background: white; padding: 8px; border-radius: 4px; margin-top: 4px; font-family: monospace; font-size: 0.8rem;">`;
                    resultHTML += missingInData.map(item => `• ${item}`).join('<br>');
                    resultHTML += `</div></div>`;
                }

                if (missingInList.length > 0) {
                    resultHTML += `<div>`;
                    resultHTML += `<strong style="color: #ca8a04;">⚠️ 실제 데이터에는 있지만 입력 목록에 없는 항목 (${missingInList.length}개):</strong><br>`;
                    resultHTML += `<div style="max-height: 120px; overflow-y: auto; background: white; padding: 8px; border-radius: 4px; margin-top: 4px; font-family: monospace; font-size: 0.8rem;">`;
                    resultHTML += missingInList.map(item => `• ${item}`).join('<br>');
                    resultHTML += `</div></div>`;
                }
            }

            validationResult.innerHTML = resultHTML;
        });

        // LIMS 붙여넣기 기능
        btnFetchLims.addEventListener('click', () => {
            const pastedText = prompt('LIMS에서 복사한 데이터를 붙여넣으세요:\n(탭으로 구분된 데이터)');
            if (!pastedText || !pastedText.trim()) {
                return;
            }

            try {
                // 탭으로 구분하여 파싱
                const lines = pastedText.trim().split('\n');
                const parsedData = lines.map(line => {
                    const parts = line.trim().split('\t');
                    if (parts.length < 5) return null;

                    let col1, col2, col3, col4, libName, barcode;

                    barcode = parts[parts.length - 1];
                    libName = parts[parts.length - 2];

                    const firstPart = parts[0].trim();
                    // PASS/FAIL로 시작하지 않으면 상태 열이 없는 것으로 간주 (주로 ID로 시작)
                    const isStatusMissing = !(/^(PASS|FAIL)$/i.test(firstPart));

                    if (isStatusMissing) {
                        col1 = "N/A";
                        col2 = parts[0];
                        col3 = parts[1];
                        col4 = parts.slice(2, parts.length - 2).join(' ');
                    } else {
                        col1 = parts[0];
                        col2 = parts[1];
                        col3 = parts[2];
                        col4 = parts.slice(3, parts.length - 2).join(' ');
                    }

                    return [col1, col2, col3, col4, libName, barcode];
                }).filter(Boolean);

                if (parsedData.length === 0) {
                    alert('올바른 형식의 데이터가 아닙니다. 최소 5개 이상의 열이 필요합니다.');
                    return;
                }

                // LIMS 추출 기준 선택값 가져오기
                const limsKeyColumnIndex = parseInt(document.querySelector('input[name="smrt-lims-column"]:checked').value);
                const keyColumnName = limsKeyColumnIndex === -2 ? 'Sample Name' : 'Barcode';

                // 마지막에서 -1 또는 -2 위치의 값 추출
                const extractedNames = parsedData.map(cols => {
                    if (cols.length < 6) return null;
                    const value = cols[cols.length + limsKeyColumnIndex];
                    return value ? value.trim() : '';
                }).filter(Boolean);

                if (extractedNames.length > 0) {
                    sortList.value = extractedNames.join('\n');
                    const count = extractedNames.length;
                    sortCount.textContent = `입력한 개수: ${count}`;

                    // LIMS 데이터 저장
                    window.smrtLimsInfo = {
                        data: parsedData,
                        keyColumnIndex: limsKeyColumnIndex,
                        keyColumnName: keyColumnName
                    };

                    alert(`LIMS 데이터에서 ${count}개의 ${keyColumnName}을(를) 추출했습니다.\nLIMS 데이터가 병합 준비되었습니다.`);
                } else {
                    alert('추출할 데이터를 찾을 수 없습니다.');
                }
            } catch (error) {
                console.error('LIMS 데이터 파싱 실패:', error);
                alert(`데이터 파싱 실패: ${error.message}`);
            }
        });

        // 주요 데이터만 복사
        btnCopyKeyData.addEventListener('click', () => {
            const targetHeaders = [
                'HiFi Reads',
                'HiFi Read Length (mean, bp)',
                'HiFi Read Quality (median, QV)',
                'HiFi Yield (bp)'
            ];

            // 헤더 인덱스 찾기
            const headerIndices = targetHeaders.map(target => {
                return data.headers.findIndex(h => String(h).includes(target));
            });

            // 누락된 헤더 확인
            const missingHeaderIndex = headerIndices.findIndex(i => i === -1);
            if (missingHeaderIndex !== -1) {
                alert(`필수 헤더를 찾을 수 없습니다: ${targetHeaders[missingHeaderIndex]}`);
                return;
            }

            // 주요 데이터 추출 (숫자는 숫자 형식으로 변환)
            const keyDataRows = data.rows.map(row => {
                return headerIndices.map(index => {
                    const value = row[index];
                    // 콤마 제거하고 숫자로 변환 시도
                    const numericValue = String(value).replace(/,/g, '');
                    // 숫자로 변환 가능하면 숫자로, 아니면 원본 유지
                    return !isNaN(numericValue) && numericValue.trim() !== '' ? numericValue : value;
                }).join('\t');
            });

            const textToCopy = keyDataRows.join('\n');

            // 클립보드에 복사
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = btnCopyKeyData.textContent;
                btnCopyKeyData.textContent = '✅ 복사 완료!';
                btnCopyKeyData.style.background = '#10b981';
                setTimeout(() => {
                    btnCopyKeyData.textContent = originalText;
                    btnCopyKeyData.style.background = '#fb923c';
                }, 2000);
            }).catch(err => {
                alert('클립보드 복사 실패: ' + err.message);
            });
        });

        // XLSX Downloads
        btnXlsxUnsorted.addEventListener('click', () => {
            downloadXLSX(data, false);
            closeModal();
        });

        btnXlsxSorted.addEventListener('click', () => {
            const sortOrder = sortList.value.trim().split('\n').filter(line => line.trim() !== '');
            if (sortOrder.length === 0) {
                alert('정렬 순서 목록을 입력해주세요.');
                return;
            }
            const sortColumnIndex = parseInt(document.querySelector('input[name="smrt-sort-column"]:checked').value);
            downloadXLSX(data, true, sortOrder, sortColumnIndex);
            closeModal();
        });

        // Add hover effects
        btnFetchLims.addEventListener('mouseenter', () => btnFetchLims.style.background = '#059669');
        btnFetchLims.addEventListener('mouseleave', () => btnFetchLims.style.background = '#10b981');
        btnValidate.addEventListener('mouseenter', () => btnValidate.style.background = '#2563eb');
        btnValidate.addEventListener('mouseleave', () => btnValidate.style.background = '#3b82f6');
        btnCopyKeyData.addEventListener('mouseenter', () => btnCopyKeyData.style.background = '#f97316');
        btnCopyKeyData.addEventListener('mouseleave', () => btnCopyKeyData.style.background = '#fb923c');

        btnXlsxUnsorted.addEventListener('mouseenter', () => btnXlsxUnsorted.style.background = '#047857');
        btnXlsxUnsorted.addEventListener('mouseleave', () => btnXlsxUnsorted.style.background = '#059669');
        btnXlsxSorted.addEventListener('mouseenter', () => btnXlsxSorted.style.background = '#7c3aed');
        btnXlsxSorted.addEventListener('mouseleave', () => btnXlsxSorted.style.background = '#8b5cf6');
    }

    /**
     * Download data as XLSX (sorted or unsorted) with auto-sized columns
     */
    function downloadXLSX(data, shouldSort = false, sortOrder = [], sortColumnIndex = 0) {
        let headers = [...data.headers];
        let rows = data.rows.map(row => [...row]);
        let columnOffset = 0;

        // 1. Merge with LIMS data if available
        if (window.smrtLimsInfo && window.smrtLimsInfo.data.length > 0) {
            const limsInfo = window.smrtLimsInfo;
            columnOffset = 3;
            const limsMap = new Map();
            const limsKeyIndex = limsInfo.keyColumnIndex; // -1 or -2

            limsInfo.data.forEach(row => {
                if (row.length < 6) return;
                const key = String(row[row.length + limsKeyIndex] || '').trim();
                if (key) {
                    // Extract columns 2, 3, 4 (indices 1, 2, 3)
                    limsMap.set(key, [row[1] || '', row[2] || '', row[3] || '']);
                }
            });

            // Merge LIMS columns into data
            const newHeaders = ['LIMS_정보_2', 'LIMS_정보_3', 'LIMS_정보_4', ...headers];
            const newRows = rows.map(row => {
                const key = String(row[sortColumnIndex] || '').trim();
                const limsCols = limsMap.get(key) || ['', '', ''];
                return [...limsCols, ...row];
            });

            headers = newHeaders;
            rows = newRows;
        }

        // 2. Sort if requested
        const finalSortKeyIndex = sortColumnIndex + columnOffset;
        if (shouldSort && sortOrder.length > 0) {
            const orderMap = new Map(sortOrder.map((item, index) => [item.trim(), index]));

            const inOrderRows = [];
            const outOfOrderRows = [];

            rows.forEach(row => {
                const key = String(row[finalSortKeyIndex] || '').trim();
                if (orderMap.has(key)) {
                    inOrderRows.push(row);
                } else {
                    outOfOrderRows.push(row);
                }
            });

            inOrderRows.sort((a, b) => {
                const keyA = String(a[finalSortKeyIndex] || '').trim();
                const keyB = String(b[finalSortKeyIndex] || '').trim();
                return orderMap.get(keyA) - orderMap.get(keyB);
            });

            rows = [...inOrderRows, ...outOfOrderRows];
        }

        // 3. Convert numeric strings to numbers (except Sample Name and Barcode columns)
        const processedRows = rows.map(row => {
            return row.map((cell, index) => {
                // LIMS columns (first 3 if offset exists) + Sample Name + Barcode는 텍스트로 유지
                const sampleNameIndex = 0 + columnOffset;
                const barcodeIndex = 1 + columnOffset;
                if (index < columnOffset || index === sampleNameIndex || index === barcodeIndex) {
                    return cell;
                }

                // 나머지 열은 숫자로 변환 시도
                const cellStr = String(cell || '').trim();
                if (cellStr === '') return '';

                // 콤마 제거하고 숫자로 변환
                const numericValue = cellStr.replace(/,/g, '');

                // 숫자로 변환 가능하면 숫자로, 아니면 원본 유지
                if (!isNaN(numericValue) && numericValue !== '') {
                    return parseFloat(numericValue);
                }
                return cell;
            });
        });

        // Prepare worksheet data (headers + rows)
        const wsData = [headers, ...processedRows];

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Auto-size columns based on content
        const colWidths = [];
        headers.forEach((header, colIndex) => {
            // Start with header length
            let maxWidth = String(header).length;

            // Check all data rows for this column
            processedRows.forEach(row => {
                const cellValue = String(row[colIndex] || '');
                maxWidth = Math.max(maxWidth, cellValue.length);
            });

            // Add padding and set minimum/maximum widths
            const width = Math.min(Math.max(maxWidth + 2, 10), 50);
            colWidths.push({ wch: width });
        });

        // Set last column width to 15
        if (colWidths.length > 0) {
            colWidths[colWidths.length - 1] = { wch: 15 };
        }

        ws['!cols'] = colWidths;

        // Apply number formatting
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = 1; R <= range.e.r; ++R) {
            for (let C = 0; C <= range.e.c; ++C) {
                const cell_address = { c: C, r: R };
                const cell_ref = XLSX.utils.encode_cell(cell_address);
                const cell = ws[cell_ref];
                if (cell && cell.t === 'n') {
                    cell.z = '#,##0';
                }
            }
        }

        // Create workbook and add worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Barcode Data");

        // Generate filename
        const filename = shouldSort ? "barcode_data_정렬완료.xlsx" : "barcode_data.xlsx";

        // Trigger download
        XLSX.writeFile(wb, filename);
    }

    // --- Main Tampermonkey Initialization ---

    let mainButtonInterval = null;

    function addMainButton() {
        // 바코드 테이블이 있는지 확인 (특정 col-id로 식별)
        const barcodeColumn = document.querySelector('[col-id="barcode_barcode_table_barcode"]');

        // 바코드 테이블이 있는 페이지에서만 버튼 생성
        if (barcodeColumn) {
            if (document.getElementById('gemini-csv-btn')) {
                if (mainButtonInterval) clearInterval(mainButtonInterval);
                return;
            }

            console.log("바코드 테이블 확인됨. '바코드 디멀티' 버튼을 추가합니다.");
            const csvButton = document.createElement('button');
            csvButton.id = 'gemini-csv-btn';
            csvButton.innerText = '바코드 디멀티';

            // Style the button
            GM_addStyle(`
                #gemini-csv-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    padding: 8px 12px;
                    background-color: #0d9488; /* teal-600 */
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    font-family: Arial, sans-serif;
                    font-size: 13px;
                    font-weight: bold;
                }
                #gemini-csv-btn:hover {
                    background-color: #14b8a6; /* teal-500 */
                }
            `);

            // Attach click event
            csvButton.addEventListener('click', showSortModal);

            // Add button to page
            document.body.appendChild(csvButton);

            if (mainButtonInterval) clearInterval(mainButtonInterval);
        } else {
            // 바코드 테이블이 아직 로드되지 않음
        }
    }

    // 초기 실행 (document-start에서 시작하므로 DOM 로드 대기)
    console.log("✅ SMRT Link 바코드 디멀티 v1.2 시작됨!");

    if (document.readyState === 'loading') {
        console.log("⏳ DOM 로딩 중... DOMContentLoaded 대기");
        document.addEventListener('DOMContentLoaded', () => {
            console.log("✅ DOMContentLoaded 완료. 바코드 테이블 확인 시작.");
            mainButtonInterval = setInterval(addMainButton, 1000);
        });
    } else {
        console.log("✅ DOM 이미 로드됨. 바코드 테이블 확인 즉시 시작.");
        mainButtonInterval = setInterval(addMainButton, 1000);
    }

    // SPA 네비게이션 감지: history.pushState/replaceState 후킹
    let lastUrl = location.href;

    const handleUrlChange = () => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log("SMRT Link XLSX: URL 변경 감지 →", currentUrl);

            // 기존 버튼 제거
            const oldButton = document.getElementById('gemini-csv-btn');
            if (oldButton) {
                oldButton.remove();
                console.log("SMRT Link XLSX: 기존 버튼 제거됨.");
            }

            // 인터벌 재시작 (AG Grid 로드 대기)
            if (mainButtonInterval) clearInterval(mainButtonInterval);

            // 약간의 딜레이 후 재시작 (DOM 안정화 대기)
            setTimeout(() => {
                console.log("SMRT Link XLSX: 바코드 테이블 로드 대기 시작.");
                mainButtonInterval = setInterval(addMainButton, 1000);
            }, 500);
        }
    };

    // history.pushState 후킹 (즉시 실행, SMRT Link보다 먼저)
    (function () {
        const originalPushState = history.pushState;
        history.pushState = function () {
            console.log("🚀 SMRT Link XLSX: pushState 호출 감지!", arguments[2]);
            const result = originalPushState.apply(this, arguments);
            handleUrlChange();
            return result;
        };
        console.log("✅ pushState 후킹 완료");
    })();

    // history.replaceState 후킹 (즉시 실행)
    (function () {
        const originalReplaceState = history.replaceState;
        history.replaceState = function () {
            console.log("🔁 SMRT Link XLSX: replaceState 호출 감지!", arguments[2]);
            const result = originalReplaceState.apply(this, arguments);
            handleUrlChange();
            return result;
        };
        console.log("✅ replaceState 후킹 완료");
    })();

    // popstate 이벤트 (뒤로가기/앞으로가기)
    window.addEventListener('popstate', () => {
        console.log("⬅️ SMRT Link XLSX: popstate 이벤트 감지");
        handleUrlChange();
    });
    console.log("✅ popstate 리스너 등록 완료");

    // 추가: 바코드 테이블 특정 요소 직접 감지
    const gridObserver = new MutationObserver(() => {
        const barcodeColumn = document.querySelector('[col-id="barcode_barcode_table_barcode"]');
        if (barcodeColumn && !document.getElementById('gemini-csv-btn')) {
            console.log("SMRT Link XLSX: 바코드 테이블 직접 감지됨. 버튼 추가 시도.");
            addMainButton();
        }
    });

    gridObserver.observe(document.body, { subtree: true, childList: true });

})();