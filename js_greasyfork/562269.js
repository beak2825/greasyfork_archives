// ==UserScript==
// @name         MQC網頁表格資料切分器
// @namespace    https://kencyue.github.io/
// @version      2.2
// @description  移除Table外框 + 智慧背景色 + 圓角化 + 3D浮凸 + SSHWHY輸入框美化
// @author       Kecyue
// @match        https://appsvr12.panasonic.com.tw/VIMS/PVIM5243.asp*
// @grant        none
// @run-at       document-idle
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/562269/MQC%E7%B6%B2%E9%A0%81%E8%A1%A8%E6%A0%BC%E8%B3%87%E6%96%99%E5%88%87%E5%88%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562269/MQC%E7%B6%B2%E9%A0%81%E8%A1%A8%E6%A0%BC%E8%B3%87%E6%96%99%E5%88%87%E5%88%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const table = document.querySelector('table');
    const tableBody = document.querySelector('table tbody');
    const startElement = document.querySelector('#check1');
    if (!table || !tableBody || !startElement) {
        console.log('找不到必要元素');
        return;
    }
    table.style.border = 'none';
    table.setAttribute('border', '0');
    table.style.outline = 'none';
    table.style.boxShadow = 'none';
    table.style.borderCollapse = 'separate';
    table.style.borderSpacing = '0';
    table.style.backgroundColor = 'transparent';
    table.querySelectorAll('td').forEach(td => {
        td.style.border = 'none';
        td.style.backgroundColor = '';
        td.style.boxShadow = 'none';
    });
    let dataElements = [];
    let current = startElement.closest('tr') || startElement.closest('td');
    if(current && current.tagName === 'TD') current = current.closest('tr');
    while (current) {
        if (current.tagName === 'TR') {
            dataElements.push(current);
        }
        current = current.nextElementSibling;
    }
    const cardRadius = '15px';
    const inputRadius = '6px';
    const lightBorder = '1px solid #ffffff';
    const darkBorder  = '1px solid #aaaaaa';
    const innerBorder = '1px solid #e0e0e0';
    const liftShadow  = '0px 3px 8px -3px rgba(0, 0, 0, 0.2)';
    for (let i = 0; i < dataElements.length; i += 3) {
        const group = dataElements.slice(i, i + 3);
        if (group.length > 0) {
            const lastRowIndex = group.length - 1;
            group.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td');
                const lastCellIndex = cells.length - 1;
                cells.forEach((cell, cellIndex) => {
                    if (rowIndex === 0 && (cellIndex === 0 || cellIndex === 1)) {
                        cell.style.backgroundColor = '#00f';
                        cell.style.border = 'none';
                    } else {
                        cell.style.backgroundColor = 'rgb(255 255 255 / 80%)';
                        cell.style.border = innerBorder;
                        if (rowIndex === 0) cell.style.borderTop = lightBorder;
                        if (rowIndex === lastRowIndex) cell.style.borderBottom = darkBorder;
                        if (cellIndex === 0) cell.style.borderLeft = lightBorder;
                        if (cellIndex === lastCellIndex) cell.style.borderRight = darkBorder;
                    }
                    if (rowIndex === lastRowIndex && !(rowIndex === 0 && (cellIndex === 0 || 1))) {
                        cell.style.boxShadow = liftShadow;
                        cell.style.position = 'relative';
                        cell.style.zIndex = '1';
                    }
                });
            });
            const firstRowCells = group[0].querySelectorAll('td');
            if (firstRowCells.length > 0) {
                firstRowCells[0].style.borderTopLeftRadius = cardRadius;
                firstRowCells[firstRowCells.length - 1].style.borderTopRightRadius = cardRadius;
            }
            const lastRowCells = group[lastRowIndex].querySelectorAll('td');
            if (lastRowCells.length > 0) {
                lastRowCells[0].style.borderBottomLeftRadius = cardRadius;
                lastRowCells[lastRowCells.length - 1].style.borderBottomRightRadius = cardRadius;
            }
        }
        if (group.length === 3) {
            const lastInGroup = group[2];
            if (lastInGroup.parentNode === tableBody && (i + 3) < dataElements.length) {
                const sepTr = document.createElement('tr');
                sepTr.style.height = '20px';
                const sepTd = document.createElement('td');
                sepTd.colSpan = 99;
                sepTd.style.border = 'none';
                sepTd.style.borderLeft   = '2px solid rgb(224, 255, 255)';
                sepTd.style.borderRight  = '2px solid rgb(224, 255, 255)';
                sepTd.style.backgroundColor = 'rgb(224, 255, 255)';
                sepTd.style.height = '30px';
                sepTd.style.padding = '0';
                sepTr.appendChild(sepTd);
                tableBody.insertBefore(sepTr, lastInGroup.nextSibling);
            }
        }
    }
    const targetInputs = document.querySelectorAll('input[name^="SSHWHY"]');
    targetInputs.forEach(input => {
        input.style.borderRadius = inputRadius;
        input.style.border = '1px solid #ccc';
        input.style.padding = '4px 6px';
        input.style.outline = 'none';
        input.style.backgroundColor = '#f9f9f9';
        input.style.transition = '0.2s';
        input.addEventListener('focus', () => {
            input.style.border = '1px solid #888';
            input.style.backgroundColor = '#fff';
            input.style.boxShadow = '0 0 5px rgba(0,0,0,0.1)';
        });
        input.addEventListener('blur', () => {
            input.style.border = '1px solid #ccc';
            input.style.backgroundColor = '#f9f9f9';
            input.style.boxShadow = 'none';
        });
    });
})();