// ==UserScript==
// @name         Demo1
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  将选中的多个表格合并到一个 Sheet 页中导出为 Excel 文件，不插入标题行
// @match        https://www.gsmarena.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554953/Demo1.user.js
// @updateURL https://update.greasyfork.org/scripts/554953/Demo1.meta.js
// ==/UserScript==
/* global XLSX */


(function() {
    'use strict';

    // 动态加载 SheetJS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.onload = () => {
        console.log('✅ SheetJS 加载完成');
        initExportButton();
    };
    document.head.appendChild(script);

    function initExportButton() {
        const btn = document.createElement("button");
        btn.textContent = "合并表格导出为Excel";
        btn.style.position = "fixed";
        btn.style.top = "10px";
        btn.style.right = "10px";
        btn.style.zIndex = 9999;
        btn.style.padding = "8px 12px";
        btn.style.backgroundColor = "#4CAF50";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.onclick = exportMergedTablesToExcel;
        document.body.appendChild(btn);
    }

    function exportMergedTablesToExcel() {
        try {
            if (typeof XLSX === 'undefined') {
                alert("❌ SheetJS 未定义，请稍等库加载完成后再试！");
                return;
            }

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
                alert("请先选中页面中的表格内容！");
                return;
            }

            const range = selection.getRangeAt(0);
            const container = document.createElement("div");
            container.appendChild(range.cloneContents());

            const tables = container.querySelectorAll("table");
            if (tables.length === 0) {
                alert("选中的内容中未包含表格！");
                return;
            }

            let mergedData = [];
            tables.forEach((table) => {
                const sheet = XLSX.utils.table_to_sheet(table);
                const aoa = XLSX.utils.sheet_to_json(sheet, {header: 1});
                mergedData = mergedData.concat(aoa);
                mergedData.push([]); // 添加空行分隔
            });

            const finalSheet = XLSX.utils.aoa_to_sheet(mergedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, finalSheet, "合并内容");

            const wbout = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
            const blob = new Blob([wbout], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "Specifications.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("导出失败：", error);
            alert("导出失败，请查看控制台错误信息！");
        }
    }
})();