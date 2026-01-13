// ==UserScript==
// @name         江苏省考报名人数-数据提取助手(表格版)
// @namespace    https://greasyfork.org/users/1546436-zasternight
// @version      1.2.18
// @author       zasternight
// @description  自动提取江苏各地市（无锡、苏州、常州等）公务员报名网页中的具体职位报名数据表格，支持一键导出Excel。
// @license      MIT
// @match        *://*/Home/RegBrowse*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562342/%E6%B1%9F%E8%8B%8F%E7%9C%81%E8%80%83%E6%8A%A5%E5%90%8D%E4%BA%BA%E6%95%B0-%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%8A%A9%E6%89%8B%28%E8%A1%A8%E6%A0%BC%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562342/%E6%B1%9F%E8%8B%8F%E7%9C%81%E8%80%83%E6%8A%A5%E5%90%8D%E4%BA%BA%E6%95%B0-%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%8A%A9%E6%89%8B%28%E8%A1%A8%E6%A0%BC%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 样式注入 ---
    const styles = `
        #data-extractor-btn {
            position: fixed;
            top: 150px;
            right: 20px;
            z-index: 9999;
            background-color: #52c41a; /* 绿色，代表Excel */
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-size: 15px;
            font-weight: bold;
            transition: all 0.3s;
        }
        #data-extractor-btn:hover { background-color: #73d13d; transform: scale(1.05); }
    `;
    GM_addStyle(styles);

    // --- 辅助函数：清洗文本 ---
    // 去除多余的换行符和首尾空格，将内部连续空格压缩为一个
    function cleanText(text) {
        if (!text) return "";
        return text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // --- 核心逻辑：提取表格数据 ---
    function extractTableData() {
        // 1. 定位表格：源码中类名为 tableline
        const table = document.querySelector('table.tableline');
        if (!table) {
            alert('未找到报名数据表格 (class="tableline")，请确认页面是否加载完成。');
            return null;
        }

        const rows = table.querySelectorAll('tr');
        const data = [];

        // 2. 定义表头
        const headers = ["部门名称", "职位名称", "开考比例", "招考人数", "报名成功人数"];
        data.push(headers);

        // 3. 遍历每一行数据
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            // 跳过没有单元格的行（如表头行通常是 th）
            if (cells.length === 0) return;

            // 确保这是一行有效数据（通常有5列）
            if (cells.length >= 5) {
                const rowData = [
                    cleanText(cells[0].innerText), // 部门名称
                    cleanText(cells[1].innerText), // 职位名称
                    cleanText(cells[2].innerText), // 开考比例
                    cleanText(cells[3].innerText), // 招考人数
                    cleanText(cells[4].innerText)  // 报名成功人数
                ];
                data.push(rowData);
            }
        });

        return data;
    }

    // --- 导出 CSV 文件 ---
    function downloadCSV(data) {
        if (!data || data.length < 2) {
            alert("表格中似乎没有数据，请检查查询结果是否为空。");
            return;
        }

        // 获取当前选择的地区名称，用于文件名
        let regionName = "未知地区";
        const regionSelect = document.getElementById('jobAreaList');
        if (regionSelect && regionSelect.selectedIndex >= 0) {
            regionName = regionSelect.options[regionSelect.selectedIndex].text.trim();
        }

        // 构建 CSV 内容
        // 添加 \uFEFF 是为了让 Excel 正确识别中文编码 (BOM)
        let csvContent = '\uFEFF';

        data.forEach(row => {
            // 处理 CSV 格式：如果有逗号，需要用双引号包裹
            const processedRow = row.map(cell => {
                const cellStr = String(cell);
                if (cellStr.includes(',')) {
                    return `"${cellStr}"`;
                }
                return cellStr;
            });
            csvContent += processedRow.join(',') + '\n';
        });

        // 创建下载链接
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        // 文件名格式：无锡市_报名数据_2026-01-12.csv
        const timeStr = new Date().toISOString().slice(0,10);
        const fileName = `${regionName}_报名数据_${timeStr}.csv`;

        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- UI 构建 ---
    function createUI() {
        const btn = document.createElement('button');
        btn.id = 'data-extractor-btn';
        btn.innerHTML = '📊 导出当前表格数据';
        document.body.appendChild(btn);

        btn.addEventListener('click', () => {
            const data = extractTableData();
            if (data) {
                downloadCSV(data);
            }
        });
    }

    // --- 启动 ---
    setTimeout(createUI, 1000);

})();
