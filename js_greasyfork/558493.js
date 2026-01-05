// ==UserScript==
// @name         LIMS LQC 리스트 추출기
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  LIMS에서 STATUS(SPL)='Lib.' 데이터를 추출하여 스타일이 적용된 Excel 파일 생성
// @author       김재형
// @match        https://lims3.macrogen.com/ngs/report/retrievePerformBasicInfoForm.do*
// @require      https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558493/LIMS%20LQC%20%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EC%B6%94%EC%B6%9C%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/558493/LIMS%20LQC%20%EB%A6%AC%EC%8A%A4%ED%8A%B8%20%EC%B6%94%EC%B6%9C%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';



    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {


        // Add custom button to the page
        addLQCButton();
    }

    /**
     * Add "LQC 리스트" button to the page
     */
    function addLQCButton() {
        // Find the search button
        const searchButton = document.querySelector('button#btnSearch');

        if (!searchButton) {

            return;
        }

        // Create LQC button with Soft Tint green style (matching Search button size)
        const lqcButton = document.createElement('button');
        lqcButton.type = 'button';
        lqcButton.textContent = 'LQC 리스트';
        lqcButton.style.cssText = `
            background-color: #dcfce7;
            color: #16a34a;
            border: 1px solid #16a34a;
            padding: 0 10px;
            height: 24px;
            line-height: 21px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            margin-left: 4px;
            transition: all 0.2s ease;
        `;

        // Hover effect
        lqcButton.addEventListener('mouseenter', () => {
            lqcButton.style.backgroundColor = '#16a34a';
            lqcButton.style.color = '#fff';
        });
        lqcButton.addEventListener('mouseleave', () => {
            lqcButton.style.backgroundColor = '#dcfce7';
            lqcButton.style.color = '#16a34a';
        });

        // Add click event
        lqcButton.addEventListener('click', handleLQCButtonClick);

        // Insert button after search button
        searchButton.parentNode.insertBefore(lqcButton, searchButton.nextSibling);


    }

    /**
     * Handle LQC button click
     */
    async function handleLQCButtonClick() {


        try {
            // Show loading indicator
            showLoadingIndicator();

            // Step 1: Set search conditions (without changing date range)
            setSearchConditions();

            // Step 2: Trigger search
            await performSearch();

            // Step 3: Wait for results to load
            await waitForResults();

            // Step 4: Extract and filter data
            const data = extractLQCData();

            if (data.length === 0) {
                alert('❌ STATUS (SPL) = "Lib." 조건의 데이터가 없습니다.');
                hideLoadingIndicator();
                return;
            }

            // Step 5: Add sequence numbers
            const processedData = addSequenceNumbers(data);

            // Step 6: Generate Excel file
            await generateExcelFile(processedData);

            // Show success message
            alert(`✅ Excel 파일 생성 완료! (총 ${processedData.length}개 행)`);

        } catch (error) {

            alert(`❌ 오류 발생: ${error.message}`);
        } finally {
            hideLoadingIndicator();
        }
    }

    /**
     * Set search conditions (keep user's date range, only change other settings)
     */
    function setSearchConditions() {


        // Set Date Search to "Date received (Lab)"
        const dateSearchSelect = document.querySelector('select#searchRgsnCd');
        if (dateSearchSelect) {
            dateSearchSelect.value = '02';
            dateSearchSelect.dispatchEvent(new Event('change')); // Ensure event triggers

        }

        // Set Order Status to "All"
        const statusSelect = document.querySelector('select#searchOrdPrgrStatCd');
        if (statusSelect) {
            statusSelect.value = '';
            statusSelect.dispatchEvent(new Event('change')); // Ensure event triggers

        }
    }

    /**
     * Trigger search button click
     */
    function performSearch() {
        return new Promise((resolve) => {


            const searchButton = document.querySelector('button#btnSearch');
            if (searchButton) {
                searchButton.click();

            }

            // Wait enough time for the grid to clear or request to start
            // Increased to 3000ms to prevent reading old data before reload
            setTimeout(resolve, 3000);
        });
    }

    /**
     * Wait for search results to load
     */
    function waitForResults() {
        return new Promise((resolve) => {


            let attempts = 0;
            const maxAttempts = 60; // 30 seconds max (increased from 10s)

            const checkInterval = setInterval(() => {
                attempts++;

                if (typeof Grids !== 'undefined' && Grids[0]) {
                    // Check if grid is in ready state and has rows
                    const totalRows = Grids[0].GetTotalRows();

                    // Wait until we have rows (success) or timeout (maybe no results)
                    if (totalRows > 0 || attempts >= maxAttempts) {
                        clearInterval(checkInterval);

                        resolve();
                    }
                }

                if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);

                    resolve();
                }
            }, 500);
        });
    }

    function extractLQCData() {


        if (typeof Grids === 'undefined' || !Grids[0]) {
            throw new Error('IBSheet 그리드를 찾을 수 없습니다!');
        }

        const grid = Grids[0];
        const totalRows = grid.GetTotalRows();
        const lastCol = grid.LastCol();
        const data = [];



        // Column index mapping (Derived from JSP Source `IBS_InitSheet` order)
        // IBSheet columns are 0-indexed based on the 'Cols' array configuration.
        const COL = {
            ORDER_NO: 0,        // "ORDER #"
            DATE: 1,            // "DATE RECEIVED (LAB)"
            CUSTOMER: 4,        // "CUSTOMER"
            PRE_ORDER: 6,       // "# PRE-ORDER"
            ORD_PLATF: 10,      // "ORD PLATF"
            ACT_PLATF: 11,      // "ACT PLATF"
            STATUS_SPL: 15,     // "STATUS (SPL)"
            TYPE: 16,           // "TYPE"
            TUBE_ID: 18,        // "TUBE ID"
            LIB: 20,            // "LIB"
            LIB_TYPE: 23,       // "LIB TYPE"
            LIB_KIT: 24,        // "LIB KIT"
            APPLICATION: 25     // "APPLICATION"
        };




        for (let i = 1; i <= totalRows; i++) {
            // Safe getter
            const getVal = (idx) => (idx !== undefined) ? grid.GetCellValue(i, idx) : '';

            const statusSpl = getVal(COL.STATUS_SPL);
            const preOrder = getVal(COL.PRE_ORDER);

            // Filter 1: Exclude if "# PRE-ORDER" has any value
            if (preOrder && preOrder.toString().trim() !== '') {
                continue;
            }

            // Filter 2: only rows with STATUS (SPL) = "Lib."
            // Use includes or trim for robustness
            if (statusSpl && statusSpl.toString().trim() === 'Lib.') {
                const rawDate = getVal(COL.DATE);

                // Format date: YYYYMMDD -> YYYY-MM-DD
                let formattedDate = rawDate;
                if (rawDate && rawDate.length === 8) {
                    formattedDate = `${rawDate.substring(0, 4)}-${rawDate.substring(4, 6)}-${rawDate.substring(6, 8)}`;
                }

                const row = {
                    'order #': getVal(COL.ORDER_NO),
                    'date': formattedDate,
                    '고객': getVal(COL.CUSTOMER),
                    'plat form': getVal(COL.ORD_PLATF),
                    'chip': '',  // 비워둠
                    'Library name': getVal(COL.LIB),
                    'tubeID': getVal(COL.TUBE_ID),  // 숫자 그대로
                    '샘플 type': getVal(COL.TYPE),
                    'application': getVal(COL.APPLICATION),
                    'Library Type': getVal(COL.LIB_TYPE),
                    'Library Kit': getVal(COL.LIB_KIT)
                };

                data.push(row);
            }
        }



        return data;
    }

    /**
     * Add sequence numbers and remove duplicate tubeIDs within same ORDER #:
     * - No.: overall sequence (1, 2, 3, ...)
     * - 번호: sequence within same ORDER # (1, 2, 3, ...)
     * - Duplicate tubeID: Remove the entire row (keep only first occurrence)
     */
    function addSequenceNumbers(data) {


        const orderMap = new Map();  // ORDER # → 순번
        const tubeMap = new Map();   // ORDER # + tubeID → 첫 등장 여부
        const result = [];

        data.forEach((row) => {
            const orderNo = row['order #'];
            const tubeID = row['tubeID'];
            const key = `${orderNo}|${tubeID}`;  // ORDER # + tubeID 조합

            // Check if this tubeID already appeared in this ORDER #
            if (tubeMap.has(key)) {
                // 중복: 이 행을 건너뛰기 (추가하지 않음)
                return;
            }

            // 첫 등장: 기록하고 추가
            tubeMap.set(key, true);

            // Calculate sequence within same ORDER #
            const currentSeq = (orderMap.get(orderNo) || 0) + 1;
            orderMap.set(orderNo, currentSeq);

            // Create new row with sequence numbers
            result.push({
                'No.': result.length + 1,  // 실제 추가되는 행 기준 순번
                'order #': row['order #'],
                'date': row['date'],
                '고객': row['고객'],
                '번호': currentSeq,
                'plat form': row['plat form'],
                'chip': row['chip'],
                'Library name': row['Library name'],
                'tubeID': row['tubeID'],
                '샘플 type': row['샘플 type'],
                'application': row['application'],
                'Library Type': row['Library Type'],
                'Library Kit': row['Library Kit']
            });
        });



        return result;
    }

    /**
     * Generate Excel file with styling using ExcelJS
     */
    async function generateExcelFile(data) {


        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('LQC List');

        // Define columns with headers
        worksheet.columns = [
            { header: 'No.', key: 'No.', width: 5 },
            { header: 'order #', key: 'order #', width: 12 },
            { header: 'date', key: 'date', width: 12 },
            { header: '고객', key: '고객', width: 30 },
            { header: '번호', key: '번호', width: 5 },
            { header: 'plat form', key: 'plat form', width: 12 },
            { header: 'chip', key: 'chip', width: 12 },
            { header: 'Library name', key: 'Library name', width: 15 },
            { header: 'tubeID', key: 'tubeID', width: 12 },
            { header: '샘플 type', key: '샘플 type', width: 10 },
            { header: 'application', key: 'application', width: 30 },
            { header: 'Library Type', key: 'Library Type', width: 20 },
            { header: 'Library Kit', key: 'Library Kit', width: 50 }
        ];

        // Add data rows
        data.forEach(row => {
            worksheet.addRow(row);
        });

        // Style header row (row 1) - 진한 검은 선
        const headerRow = worksheet.getRow(1);
        headerRow.height = 20;
        headerRow.font = { bold: true, color: { argb: 'FF000000' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' }  // Yellow background
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
        headerRow.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
            };
        });

        // Apply borders to data cells (연한 회색 선)
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;  // 헤더는 이미 처리함

            row.eachCell((cell) => {
                // 데이터 셀: 연한 회색 선
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFD3D3D3' } },      // 연한 회색
                    left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                    bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                    right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
            });
        });

        // Generate filename with current date
        const filename = getFilename();

        // Generate buffer and download
        const buffer = await workbook.xlsx.writeBuffer();

        // Create blob and download
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);


    }

    /**
     * Get filename with current date: NGS신규_YYYYMMDD.xlsx
     */
    function getFilename() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `NGS신규_${year}${month}${day}.xlsx`;
    }

    /**
     * Show loading indicator
     */
    function showLoadingIndicator() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'lqc-loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        // Create message box
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            font-size: 18px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        `;
        messageBox.innerHTML = `
            <div style="margin-bottom: 15px;">⏳ 데이터 추출 중...</div>
            <div style="font-size: 14px; color: #666;">잠시만 기다려주세요</div>
        `;

        overlay.appendChild(messageBox);
        document.body.appendChild(overlay);
    }

    /**
     * Hide loading indicator
     */
    function hideLoadingIndicator() {
        const overlay = document.getElementById('lqc-loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

})();
