// ==UserScript==
// @name         第一师范学院缓考补考成绩自动填报助手
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  适配缓考补考成绩录入页面，支持灵活的Excel列顺序和行顺序，自动识别可编辑的成绩字段
// @author       SoyaBean
// @match        https://jwgl.hnfnu.edu.cn:9080/eams/teach/grade/delaymakeup/teacher-manage!inputReady.action*
// @match        http://jwgl.hnfnu.edu.cn:9080/eams/teach/grade/delaymakeup/teacher-manage!inputReady.action*
// @grant        none
// @require      https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/560685/%E7%AC%AC%E4%B8%80%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E7%BC%93%E8%80%83%E8%A1%A5%E8%80%83%E6%88%90%E7%BB%A9%E8%87%AA%E5%8A%A8%E5%A1%AB%E6%8A%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560685/%E7%AC%AC%E4%B8%80%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E7%BC%93%E8%80%83%E8%A1%A5%E8%80%83%E6%88%90%E7%BB%A9%E8%87%AA%E5%8A%A8%E5%A1%AB%E6%8A%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 延迟创建控制面板，确保页面完全加载
        setTimeout(createControlPanel, 1000);
    });

    // 创建控制面板
    function createControlPanel() {
        // 创建容器
        const container = document.createElement('div');
        container.id = 'grade-auto-fill-container';
        container.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 10000;
        `;

        // 创建折叠按钮（也可拖动）
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'grade-toggle-btn';
        toggleBtn.innerHTML = '📊';
        toggleBtn.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 40px;
            background: #1976d2;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: move;
            font-size: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: none;
            z-index: 10001;
        `;

        // 创建主面板
        const panel = document.createElement('div');
        panel.id = 'grade-auto-fill-panel';
        panel.style.cssText = `
            width: 320px;
            background: #fff;
            border: 2px solid #333;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        // 创建标题栏（可拖动）
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 10px 15px;
            background: #1976d2;
            color: white;
            border-radius: 6px 6px 0 0;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <h3 style="margin: 0; font-size: 16px;">📊 缓考补考成绩自动填报助手</h3>
            <div>
                <button id="minimize-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 20px; padding: 0 5px;">−</button>
                <button id="close-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px; padding: 0 5px;">✕</button>
            </div>
        `;

        // 创建内容区域
        const content = document.createElement('div');
        content.style.cssText = 'padding: 15px;';
        content.innerHTML = `
            <div style="margin-bottom: 15px; padding: 10px; background: #e3f2fd; border-radius: 4px;">
                <h4 style="margin: 0 0 8px 0; color: #1976d2;">第一步：导出成绩数据</h4>
                <button id="download-template-btn" style="width: 100%; padding: 8px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 15px;">
                    📥 导出当前成绩Excel
                </button>
                <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">
                    包含所有学生信息和已填报的成绩
                </p>
            </div>

            <div style="margin-bottom: 15px; padding: 10px; background: #f3e5f5; border-radius: 4px;">
                <h4 style="margin: 0 0 8px 0; color: #7b1fa2;">第二步：上传修改后的成绩表</h4>
                <input type="file" id="excel-file-input" accept=".xlsx,.xls" style="width: 100%; margin-bottom: 8px;">
                <div style="display: flex; gap: 5px;">
                    <button id="preview-btn" style="flex: 1; padding: 8px; background: #7b1fa2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        👁️ 预览
                    </button>
                    <button id="fill-btn" style="flex: 1; padding: 8px; background: #ff5722; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        ✍️ 自动填入
                    </button>
                </div>
                <p style="margin: 5px 0 0 0; font-size: 10px; color: #666; text-align: center;">
                    只会填入可编辑的成绩字段
                </p>
            </div>

            <div style="margin-bottom: 10px; padding: 8px; background: #fff3cd; border-radius: 4px;">
                <button id="clear-all-btn" style="width: 100%; padding: 6px; background: #f0ad4e; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🗑️ 清空所有可编辑成绩
                </button>
            </div>

            <div id="status-area" style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px; display: none; max-height: 200px; overflow-y: auto;">
                <div id="status-text"></div>
            </div>

            <div style="margin-top: 10px; font-size: 12px; color: #666;">
                <details id="help-details">
                    <summary style="cursor: pointer; font-weight: bold;">📖 使用说明</summary>
                    <ol style="margin: 5px 0; padding-left: 20px;">
                        <li>点击"导出当前成绩Excel"下载表格</li>
                        <li>在Excel中修改需要录入的成绩</li>
                        <li>系统只会填入可编辑的成绩字段</li>
                        <li>灰色禁用的成绩字段会被自动跳过</li>
                        <li>空白成绩也会被填入为空</li>
                        <li>非数字内容将被跳过</li>
                    </ol>
                    <p style="color: #ff5722; margin: 5px 0;">
                        ⚠️ 注意：自动填入前会清空所有可编辑的原有成绩！
                    </p>
                </details>
            </div>

            <div style="margin-top: 10px; text-align: center; font-size: 11px; color: #999;">
                作者：舒宜彬 | v4.0 (缓考补考版)
            </div>
        `;

        // 组装面板
        panel.appendChild(header);
        panel.appendChild(content);
        container.appendChild(toggleBtn);
        container.appendChild(panel);
        document.body.appendChild(container);

        // 绑定事件
        bindEvents();
        makeDraggable(container, header);
        makeDraggable(container, toggleBtn);
    }

    // 绑定事件
    function bindEvents() {
        document.getElementById('download-template-btn').addEventListener('click', downloadTemplate);
        document.getElementById('preview-btn').addEventListener('click', handlePreview);
        document.getElementById('fill-btn').addEventListener('click', handleFill);
        document.getElementById('clear-all-btn').addEventListener('click', handleClearAll);

        document.getElementById('minimize-btn').addEventListener('click', function() {
            const panel = document.getElementById('grade-auto-fill-panel');
            const toggleBtn = document.getElementById('grade-toggle-btn');
            panel.style.display = 'none';
            toggleBtn.style.display = 'block';
        });

        document.getElementById('close-btn').addEventListener('click', function() {
            if (confirm('确定要关闭成绩填报助手吗？')) {
                document.getElementById('grade-auto-fill-container').remove();
            }
        });

        document.getElementById('grade-toggle-btn').addEventListener('click', function(e) {
            if (e.target.dataset.dragging === 'true') {
                e.target.dataset.dragging = 'false';
                return;
            }
            const panel = document.getElementById('grade-auto-fill-panel');
            const toggleBtn = document.getElementById('grade-toggle-btn');
            panel.style.display = 'block';
            toggleBtn.style.display = 'none';
        });
    }

    // 使面板可拖动
    function makeDraggable(container, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            isDragging = false;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            if (Math.abs(pos1) > 5 || Math.abs(pos2) > 5) {
                isDragging = true;
                if (handle.id === 'grade-toggle-btn') {
                    handle.dataset.dragging = 'true';
                }
            }

            container.style.top = (container.offsetTop - pos2) + "px";
            container.style.left = (container.offsetLeft - pos1) + "px";
            container.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            if (handle.id === 'grade-toggle-btn' && !isDragging) {
                handle.dataset.dragging = 'false';
            }
        }
    }

    // 清空所有可编辑的成绩
    function clearAllGrades() {
        let clearedCount = 0;
        const scoreInputs = document.querySelectorAll('input[name$=".score"]:not([disabled])');

        scoreInputs.forEach(input => {
            if (input.value !== '') {
                input.value = '';
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('blur', { bubbles: true }));
                clearedCount++;
            }
        });

        return {
            total: scoreInputs.length,
            cleared: clearedCount
        };
    }

    // 处理清空所有成绩
    function handleClearAll() {
        if (confirm('确定要清空所有可编辑的成绩吗？\n此操作不可恢复！')) {
            const result = clearAllGrades();
            showStatus(`清空完成！\n共清空 ${result.cleared} 个成绩\n可编辑成绩框总计 ${result.total} 个`, 'warning');
        }
    }

    // 识别成绩类型
    function identifyGradeTypes() {
        const gradeTypes = [];
        const gradeMap = new Map();

        // 获取第二行的列头
        const secondHeaderRow = document.querySelector('table.gridtable thead tr:nth-child(2)');
        if (secondHeaderRow) {
            const headers = secondHeaderRow.querySelectorAll('th');
            let currentSection = '';
            let columnIndex = 3; // 从第4列开始（跳过学号、姓名、行政班）

            for (let i = 3; i < headers.length - 1; i++) { // 跳过最后的"最终成绩"
                const headerText = headers[i].textContent.trim();

                if (headerText === '成绩') {
                    // 获取上一级的成绩类型名称
                    const firstHeaderRow = document.querySelector('table.gridtable thead tr:first-child');
                    if (firstHeaderRow) {
                        const firstHeaders = firstHeaderRow.querySelectorAll('th');
                        let accumulatedCols = 0;
                        for (let j = 0; j < firstHeaders.length - 1; j++) {
                            const colspan = parseInt(firstHeaders[j].getAttribute('colspan') || '1');
                            accumulatedCols += colspan;
                            if (accumulatedCols > i) {
                                currentSection = firstHeaders[j].textContent.trim();
                                break;
                            }
                        }
                    }

                    const gradeTypeName = currentSection || `成绩${columnIndex - 2}`;
                    gradeTypes.push(gradeTypeName);
                    gradeMap.set(columnIndex, gradeTypeName);
                }
                columnIndex++;
            }
        }

        return { types: gradeTypes, map: gradeMap };
    }

    // 从页面提取学生信息和已填报的成绩
    function downloadTemplate() {
        const students = [];
        const gradeInfo = identifyGradeTypes();

        showStatus(`正在导出数据...`, 'info');

        // 提取学生信息和成绩
        const studentRows = document.querySelectorAll('#lessonTable tr');
        let exportedGradeCount = 0;

        studentRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 2) {
                const studentId = cells[0].textContent.trim();
                const studentName = cells[1].textContent.trim();
                const className = cells[2].textContent.trim();

                // 创建学生对象
                const studentObj = {
                    '学号': studentId,
                    '姓名': studentName,
                    '行政班': className
                };

                // 获取各类成绩
                // 期末成绩
                const finalGradeCell = cells[3];
                let finalGrade = finalGradeCell.textContent.trim();
                if (finalGrade.includes('缓考')) {
                    finalGrade = '缓考';
                }
                studentObj['期末成绩'] = finalGrade;

                // 平时成绩 - 查找该行中的可编辑或已禁用的平时成绩输入框
                const usualScoreInputs = row.querySelectorAll('input[name*="examGrade-"][name$=".score"]');
                let usualScore = '';
                let makeupScore = '';

                usualScoreInputs.forEach(input => {
                    const name = input.getAttribute('name');
                    const tabindexGradeType = input.getAttribute('tabindex_grade_type');

                    // 根据输入框的属性判断是平时成绩还是补缓考成绩
                    if (input.disabled) {
                        // 禁用的通常是平时成绩
                        usualScore = input.value || '';
                    } else {
                        // 可编辑的是补缓考成绩
                        makeupScore = input.value || '';
                    }
                });

                studentObj['平时成绩'] = usualScore;

                // 补缓考类型
                const makeupTypeSelect = cells[7];
                const makeupType = makeupTypeSelect ? makeupTypeSelect.textContent.trim() : '';
                studentObj['补缓考类型'] = makeupType;

                // 补缓考成绩
                studentObj['补缓考成绩'] = makeupScore;

                // 最终成绩
                const finalResultCell = cells[cells.length - 1];
                const finalResult = finalResultCell.textContent.trim();
                studentObj['最终成绩'] = finalResult;

                if (usualScore) exportedGradeCount++;
                if (makeupScore) exportedGradeCount++;

                students.push(studentObj);
            }
        });

        if (students.length === 0) {
            showStatus('未能从页面提取到学生信息！', 'error');
            return;
        }

        // 创建工作簿
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(students);

        // 设置列宽
        const cols = [
            { wch: 15 }, // 学号
            { wch: 12 }, // 姓名
            { wch: 15 }, // 行政班
            { wch: 12 }, // 期末成绩
            { wch: 12 }, // 平时成绩
            { wch: 15 }, // 补缓考类型
            { wch: 12 }, // 补缓考成绩
            { wch: 12 }  // 最终成绩
        ];

        ws['!cols'] = cols;

        XLSX.utils.book_append_sheet(wb, ws, "缓考补考成绩数据");

        // 获取课程信息
        const courseInfo = document.querySelector('.grade-input-lesson-info');
        let courseName = '缓考补考成绩';
        if (courseInfo) {
            const courseNameMatch = courseInfo.textContent.match(/课程名称:([^课程类别]+)/);
            if (courseNameMatch) {
                courseName = courseNameMatch[1].trim();
            }
        }

        // 下载文件
        const fileName = `${courseName}_缓考补考成绩_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
        XLSX.writeFile(wb, fileName);

        showStatus(`导出成功！\n共${students.length}名学生\n已填报成绩：${exportedGradeCount}个\n\n请在Excel中修改"补缓考成绩"列的数据`, 'success');
    }

    // 存储Excel数据
    let excelData = null;
    let skippedRecords = [];

    // 处理预览
    async function handlePreview() {
        const fileInput = document.getElementById('excel-file-input');
        const file = fileInput.files[0];

        if (!file) {
            showStatus('请先选择Excel文件！', 'error');
            return;
        }

        try {
            excelData = await parseExcelFile(file);

            // 统计信息
            let validCount = 0;
            let emptyCount = 0;
            let invalidCount = 0;

            excelData.forEach(row => {
                const makeupScore = String(row['补缓考成绩'] || '').trim();
                if (makeupScore === '') {
                    emptyCount++;
                } else if (!isNaN(makeupScore)) {
                    validCount++;
                } else {
                    invalidCount++;
                }
            });

            let preview = `成功读取 ${excelData.length} 条数据\n`;
            preview += `有效补缓考成绩：${validCount} 个\n`;
            preview += `空白成绩：${emptyCount} 个\n`;
            if (invalidCount > 0) {
                preview += `非数字成绩：${invalidCount} 处（将被跳过）\n`;
            }
            preview += '\n数据预览（前3条）：\n';

            excelData.slice(0, 3).forEach((row, index) => {
                preview += `${index + 1}. ${row['学号']} ${row['姓名']}\n`;
                preview += `   补缓考成绩: ${row['补缓考成绩'] === '' || row['补缓考成绩'] === undefined ? '(空)' : row['补缓考成绩']}\n`;
            });

            showStatus(preview, 'info');
        } catch (error) {
            showStatus('读取文件失败：' + error.message, 'error');
        }
    }

    // 处理填报
    async function handleFill() {
        const fileInput = document.getElementById('excel-file-input');
        const file = fileInput.files[0];

        if (!file) {
            showStatus('请先选择Excel文件！', 'error');
            return;
        }

        if (!excelData) {
            try {
                showStatus('正在读取Excel文件...', 'info');
                excelData = await parseExcelFile(file);
            } catch (error) {
                showStatus('读取文件失败：' + error.message, 'error');
                return;
            }
        }

        if (confirm('确定要自动填入补缓考成绩吗？\n注意：填入前会先清空所有可编辑的原有成绩！')) {
            showStatus('正在清空原有成绩...', 'info');
            const clearResult = clearAllGrades();

            setTimeout(() => {
                showStatus('正在填入新成绩...', 'info');
                const result = fillGrades(excelData);
                showDetailedReport(result, clearResult);
            }, 500);
        }
    }

    // 解析Excel文件
    function parseExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const data = e.target.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };

            reader.readAsBinaryString(file);
        });
    }

    // 填报成绩
    function fillGrades(data) {
        let filledCount = 0;
        let notFoundStudents = [];
        let successfulFills = [];
        let emptyFills = 0;
        skippedRecords = [];

        // 建立页面学生信息的索引
        const pageStudentMap = new Map();
        const studentRows = document.querySelectorAll('#lessonTable tr');

        studentRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 2) {
                const studentId = cells[0].textContent.trim();
                const studentName = cells[1].textContent.trim();
                pageStudentMap.set(`${studentId}_${studentName}`, row);
            }
        });

        // 遍历Excel数据
        data.forEach(student => {
            const studentId = String(student['学号'] || '').trim();
            const studentName = String(student['姓名'] || '').trim();
            const makeupScore = String(student['补缓考成绩'] || '').trim();

            if (!studentId || !studentName) {
                return; // 跳过空行
            }

            // 在页面中查找对应的学生
            const studentKey = `${studentId}_${studentName}`;
            const studentRow = pageStudentMap.get(studentKey);

            if (studentRow) {
                // 查找可编辑的补缓考成绩输入框
                const editableScoreInputs = studentRow.querySelectorAll('input[name*="examGrade-"][name$=".score"]:not([disabled])');

                if (editableScoreInputs.length > 0) {
                    // 通常第一个可编辑的输入框就是补缓考成绩
                    const scoreInput = editableScoreInputs[0];

                    if (makeupScore === '') {
                        // 空值也填入
                        scoreInput.value = '';
                        scoreInput.dispatchEvent(new Event('change', { bubbles: true }));
                        scoreInput.dispatchEvent(new Event('blur', { bubbles: true }));
                        emptyFills++;
                        filledCount++;
                        successfulFills.push({
                            学号: studentId,
                            姓名: studentName,
                            成绩: '(空)'
                        });
                    } else if (!isNaN(makeupScore)) {
                        // 数字值填入
                        scoreInput.value = makeupScore;
                        scoreInput.dispatchEvent(new Event('change', { bubbles: true }));
                        scoreInput.dispatchEvent(new Event('blur', { bubbles: true }));
                        filledCount++;
                        successfulFills.push({
                            学号: studentId,
                            姓名: studentName,
                            成绩: makeupScore
                        });
                    } else if (makeupScore !== '') {
                        // 非数字值跳过
                        skippedRecords.push({
                            学号: studentId,
                            姓名: studentName,
                            原因: `"${makeupScore}"不是有效数字`
                        });
                    }
                }
            } else if (makeupScore !== '') {
                notFoundStudents.push({ 学号: studentId, 姓名: studentName });
            }
        });

        return {
            total: data.length,
            filledCount: filledCount,
            emptyFills: emptyFills,
            skippedRecords: skippedRecords,
            notFoundStudents: notFoundStudents,
            successfulFills: successfulFills
        };
    }

    // 显示状态信息
    function showStatus(message, type = 'info') {
        const statusArea = document.getElementById('status-area');
        const statusText = document.getElementById('status-text');

        statusArea.style.display = 'block';
        statusText.textContent = message;
        statusText.style.whiteSpace = 'pre-wrap';

        switch(type) {
            case 'success':
                statusArea.style.background = '#d4edda';
                statusArea.style.color = '#155724';
                break;
            case 'error':
                statusArea.style.background = '#f8d7da';
                statusArea.style.color = '#721c24';
                break;
            case 'warning':
                statusArea.style.background = '#fff3cd';
                statusArea.style.color = '#856404';
                break;
            default:
                statusArea.style.background = '#f5f5f5';
                statusArea.style.color = '#333';
        }
    }

    // 显示详细报告
    function showDetailedReport(result, clearResult) {
        let message = `=== 填报完成 ===\n\n`;

        if (clearResult) {
            message += `🗑️ 已清空 ${clearResult.cleared} 个原有成绩\n\n`;
        }

        message += `✅ 成功填报：${result.filledCount} 条`;
        if (result.emptyFills > 0) {
            message += `（含${result.emptyFills}处空值）`;
        }
        message += '\n';

        if (result.successfulFills.length > 0 && result.successfulFills.length <= 5) {
            message += '\n成功填报的学生：\n';
            result.successfulFills.forEach(s => {
                message += `  ${s.学号} ${s.姓名} - 补缓考成绩: ${s.成绩}\n`;
            });
        } else if (result.successfulFills.length > 5) {
            message += '\n成功填报的学生（显示前5条）：\n';
            result.successfulFills.slice(0, 5).forEach(s => {
                message += `  ${s.学号} ${s.姓名} - 补缓考成绩: ${s.成绩}\n`;
            });
            message += `  ...还有${result.successfulFills.length - 5}条\n`;
        }

        if (result.notFoundStudents.length > 0) {
            message += `\n❌ 未找到的学生（${result.notFoundStudents.length}人）：\n`;
            result.notFoundStudents.slice(0, 5).forEach(s => {
                message += `  ${s.学号} ${s.姓名}\n`;
            });
            if (result.notFoundStudents.length > 5) {
                message += `  ...还有${result.notFoundStudents.length - 5}人\n`;
            }
        }

        if (result.skippedRecords.length > 0) {
            message += `\n⚠️ 跳过的非数字记录（${result.skippedRecords.length}条）：\n`;
            result.skippedRecords.slice(0, 5).forEach(s => {
                message += `  ${s.学号} ${s.姓名}：${s.原因}\n`;
            });
            if (result.skippedRecords.length > 5) {
                message += `  ...还有${result.skippedRecords.length - 5}条\n`;
            }
        }

        showStatus(message, result.filledCount > 0 ? 'success' : 'warning');
    }
})();