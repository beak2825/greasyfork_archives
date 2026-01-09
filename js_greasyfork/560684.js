// ==UserScript==
// @name         第一师范学院成绩自动填报助手
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  自动识别成绩类型，支持灵活的Excel列顺序和行顺序，模板包含已填报数据
// @author       SoyaBean
// @match        http://jwgl.hnfnu.edu.cn:9080/eams/teach/grade/course/teacher!inputGA.action*
// @match        http://jwgl.hnfnu.edu.cn:9080/eams/teach/grade/delaymakeup/retake-manage-teacher!inputReady.action*
// @match        https://jwgl.hnfnu.edu.cn:9080/eams/teach/grade/course/teacher!inputGA.action*
// @match        https://jwgl.hnfnu.edu.cn:9080/eams/teach/grade/delaymakeup/retake-manage-teacher!inputReady.action*
// @grant        none
// @require      https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/560684/%E7%AC%AC%E4%B8%80%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E6%88%90%E7%BB%A9%E8%87%AA%E5%8A%A8%E5%A1%AB%E6%8A%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560684/%E7%AC%AC%E4%B8%80%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E6%88%90%E7%BB%A9%E8%87%AA%E5%8A%A8%E5%A1%AB%E6%8A%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        createControlPanel();
    });

    // 创建控制面板
    function createControlPanel() {
        // 创建容器
        const container = document.createElement('div');
        container.id = 'grade-auto-fill-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
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
            <h3 style="margin: 0; font-size: 16px;">📊 第一师范学院成绩自动填报助手</h3>
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
                    可直接点击"自动填入"，预览为可选项
                </p>
            </div>

            <div style="margin-bottom: 10px; padding: 8px; background: #fff3cd; border-radius: 4px;">
                <button id="clear-all-btn" style="width: 100%; padding: 6px; background: #f0ad4e; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🗑️ 清空所有成绩
                </button>
            </div>

            <div id="status-area" style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px; display: none; max-height: 200px; overflow-y: auto;">
                <div id="status-text"></div>
            </div>

            <div style="margin-top: 10px; font-size: 12px; color: #666;">
                <details id="help-details">
                    <summary style="cursor: pointer; font-weight: bold;">📖 使用说明</summary>
                    <ol style="margin: 5px 0; padding-left: 20px;">
                        <li>点击"导出当前成绩Excel"下载包含已有成绩的表格</li>
                        <li>在Excel中修改成绩（只填数字）</li>
                        <li>空白成绩也会被填入为空</li>
                        <li>非数字内容将被跳过</li>
                        <li>Excel中列顺序和行顺序可自由调整</li>
                        <li>点击"自动填入"会先清空原有数据</li>
                    </ol>
                    <p style="color: #ff5722; margin: 5px 0;">
                        ⚠️ 注意：自动填入前会清空所有原有成绩！
                    </p>
                </details>
            </div>

            <div style="margin-top: 10px; text-align: center; font-size: 11px; color: #999;">
                作者：舒宜彬 | v3.4
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
        makeDraggable(container, toggleBtn); // 折叠按钮也可拖动
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
            // 如果是拖动事件，不触发点击
            if (e.target.dataset.dragging === 'true') {
                e.target.dataset.dragging = 'false';
                return;
            }
            const panel = document.getElementById('grade-auto-fill-panel');
            const toggleBtn = document.getElementById('grade-toggle-btn');
            panel.style.display = 'block';
            toggleBtn.style.display = 'none';
        });

        const buttons = document.querySelectorAll('#grade-auto-fill-panel button');
        buttons.forEach(btn => {
            if (btn.id !== 'minimize-btn' && btn.id !== 'close-btn') {
                btn.addEventListener('mouseenter', function() {
                    this.style.opacity = '0.9';
                });
                btn.addEventListener('mouseleave', function() {
                    this.style.opacity = '1';
                });
            }
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

            // 标记正在拖动
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
            // 延迟重置拖动标记，避免触发点击事件
            if (handle.id === 'grade-toggle-btn' && !isDragging) {
                handle.dataset.dragging = 'false';
            }
        }
    }

    // 清空所有成绩
    function clearAllGrades() {
        let clearedCount = 0;
        const scoreInputs = document.querySelectorAll('input[name$=".score"]');

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
        if (confirm('确定要清空所有成绩吗？\n此操作不可恢复！')) {
            const result = clearAllGrades();
            showStatus(`清空完成！\n共清空 ${result.cleared} 个成绩\n总计 ${result.total} 个成绩输入框`, 'warning');
        }
    }

    // 识别成绩类型 - 从表格第一行获取
    function identifyGradeTypes() {
        const gradeTypes = [];

        // 从表格第一行提取成绩类型
        const firstHeaderRow = document.querySelector('table.gridtable thead tr:first-child');
        if (firstHeaderRow) {
            const headers = firstHeaderRow.querySelectorAll('th');
            headers.forEach(header => {
                const text = header.textContent.trim();
                if (text.includes('成绩') && !text.includes('总评成绩')) {
                    gradeTypes.push(text);
                }
            });
        }

        return gradeTypes;
    }

    // 从页面提取学生信息和已填报的成绩并生成模板
    function downloadTemplate() {
        const students = [];
        const gradeTypes = identifyGradeTypes();

        if (gradeTypes.length === 0) {
            showStatus('未能识别到成绩类型！', 'error');
            return;
        }

        // 显示识别到的成绩类型
        showStatus(`正在导出数据...\n成绩类型：${gradeTypes.join('、')}`, 'info');

        // 提取学生信息和成绩
        const studentRows = document.querySelectorAll('#mylist tr');
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

                // 获取该行的所有成绩输入框
                const scoreInputs = row.querySelectorAll('input[name$=".score"]');

                // 为每个成绩类型添加列，并填入已有成绩
                gradeTypes.forEach((gradeType, index) => {
                    if (index < scoreInputs.length) {
                        const score = scoreInputs[index].value;
                        studentObj[gradeType] = score;
                        if (score !== '') {
                            exportedGradeCount++;
                        }
                    } else {
                        studentObj[gradeType] = '';
                    }
                });

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
            { wch: 15 }  // 行政班
        ];

        // 为每个成绩类型设置列宽
        gradeTypes.forEach(() => {
            cols.push({ wch: 12 });
        });

        ws['!cols'] = cols;

        // 设置样式 - 已填报的成绩单元格背景色
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = 1; R <= range.e.r; ++R) { // 从第二行开始（跳过标题）
            for (let C = 3; C < 3 + gradeTypes.length; ++C) { // 从第四列开始（成绩列）
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (ws[cellAddress] && ws[cellAddress].v) {
                    // 如果单元格有值，添加样式标记
                    ws[cellAddress].s = {
                        fill: {
                            fgColor: { rgb: "E8F5E9" } // 浅绿色背景
                        }
                    };
                }
            }
        }

        XLSX.utils.book_append_sheet(wb, ws, "成绩数据");

        // 获取课程信息
        const courseInfo = document.querySelector('.grade-input-lesson-info');
        let courseName = '成绩';
        if (courseInfo) {
            const courseNameMatch = courseInfo.textContent.match(/课程名称:([^课程类别]+)/);
            if (courseNameMatch) {
                courseName = courseNameMatch[1].trim();
            }
        }

        // 下载文件
        const fileName = `${courseName}_成绩数据_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
        XLSX.writeFile(wb, fileName);

        showStatus(`导出成功！\n共${students.length}名学生\n已填报成绩：${exportedGradeCount}个\n成绩类型：${gradeTypes.join('、')}\n\n已填报的成绩在Excel中用浅绿色标记`, 'success');
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

            // 识别Excel中的成绩列
            const excelGradeTypes = [];
            if (excelData.length > 0) {
                Object.keys(excelData[0]).forEach(key => {
                    if (key.includes('成绩') && !key.includes('总评')) {
                        excelGradeTypes.push(key);
                    }
                });
            }

            // 统计信息
            let validCount = 0;
            let emptyCount = 0;
            let invalidCount = 0;
            let totalGrades = 0;

            excelData.forEach(row => {
                let hasValidGrade = false;
                let hasEmptyGrade = false;
                excelGradeTypes.forEach(gradeType => {
                    const score = String(row[gradeType] || '').trim();
                    if (score === '') {
                        hasEmptyGrade = true;
                        emptyCount++;
                    } else if (!isNaN(score)) {
                        hasValidGrade = true;
                        totalGrades++;
                    } else {
                        invalidCount++;
                    }
                });
                if (hasValidGrade || hasEmptyGrade) validCount++;
            });

            let preview = `成功读取 ${excelData.length} 条数据\n`;
            preview += `识别到的成绩类型：${excelGradeTypes.join('、')}\n`;
            preview += `有效数据行：${validCount} 条\n`;
            preview += `数字成绩：${totalGrades} 个\n`;
            preview += `空白成绩：${emptyCount} 个\n`;
            if (invalidCount > 0) {
                preview += `非数字成绩：${invalidCount} 处（将被跳过）\n`;
            }
            preview += '\n数据预览（前3条）：\n';

            excelData.slice(0, 3).forEach((row, index) => {
                preview += `${index + 1}. ${row['学号']} ${row['姓名']}\n`;
                excelGradeTypes.forEach(gradeType => {
                    const score = row[gradeType];
                    preview += `   ${gradeType}: ${score === '' || score === undefined || score === null ? '(空)' : score}\n`;
                });
            });

            showStatus(preview, 'info');
        } catch (error) {
            showStatus('读取文件失败：' + error.message, 'error');
        }
    }

    // 处理填报 - 填报前清空数据
    async function handleFill() {
        const fileInput = document.getElementById('excel-file-input');
        const file = fileInput.files[0];

        if (!file) {
            showStatus('请先选择Excel文件！', 'error');
            return;
        }

        // 清空已有excelDate
        excelData = null
        // 如果还没有读取Excel数据，先读取
        if (!excelData) {
            try {
                showStatus('正在读取Excel文件...', 'info');
                excelData = await parseExcelFile(file);
            } catch (error) {
                showStatus('读取文件失败：' + error.message, 'error');
                return;
            }
        }

        if (confirm('确定要自动填入成绩吗？\n注意：填入前会先清空所有原有成绩！')) {
            // 先清空所有成绩
            showStatus('正在清空原有成绩...', 'info');
            const clearResult = clearAllGrades();

            // 延迟一下再填入新成绩，确保清空操作完成
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

    // 填报成绩 - 支持空值填入
    function fillGrades(data) {
        let filledCount = 0;
        let notFoundStudents = [];
        let successfulFills = [];
        let emptyFills = 0;
        skippedRecords = [];

        // 获取页面上的成绩类型
        const pageGradeTypes = identifyGradeTypes();

        // 建立页面学生信息的索引
        const pageStudentMap = new Map();
        const studentRows = document.querySelectorAll('#mylist tr');

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

            if (!studentId || !studentName) {
                return; // 跳过空行
            }

            // 在页面中查找对应的学生
            const studentKey = `${studentId}_${studentName}`;
            const studentRow = pageStudentMap.get(studentKey);

            if (studentRow) {
                let hasValidOperation = false;
                let filledScores = [];

                // 获取该行的所有成绩输入框
                const scoreInputs = studentRow.querySelectorAll('input[name$=".score"]');

                // 填写各类成绩
                pageGradeTypes.forEach((gradeType, index) => {
                    // 在Excel数据中查找对应的成绩
                    let score = null;
                    Object.keys(student).forEach(key => {
                        if (key === gradeType || key.includes(gradeType.replace('成绩', '')) || gradeType.includes(key.replace('成绩', ''))) {
                            score = student[key];
                        }
                    });

                    if (score !== null && score !== undefined && index < scoreInputs.length) {
                        const scoreStr = String(score).trim();

                        if (scoreStr === '') {
                            // 空值也填入
                            scoreInputs[index].value = '';
                            scoreInputs[index].dispatchEvent(new Event('change', { bubbles: true }));
                            scoreInputs[index].dispatchEvent(new Event('blur', { bubbles: true }));
                            hasValidOperation = true;
                            emptyFills++;
                            filledScores.push(`${gradeType}:(空)`);
                        } else if (!isNaN(scoreStr)) {
                            // 数字值填入
                            scoreInputs[index].value = scoreStr;
                            scoreInputs[index].dispatchEvent(new Event('change', { bubbles: true }));
                            scoreInputs[index].dispatchEvent(new Event('blur', { bubbles: true }));
                            hasValidOperation = true;
                            filledScores.push(`${gradeType}:${scoreStr}`);
                        } else {
                            // 非数字值跳过
                            skippedRecords.push({
                                学号: studentId,
                                姓名: studentName,
                                原因: `${gradeType}"${scoreStr}"不是有效数字`
                            });
                        }
                    }
                });

                if (hasValidOperation) {
                    filledCount++;
                    successfulFills.push({
                        学号: studentId,
                        姓名: studentName,
                        成绩: filledScores.join(', ')
                    });
                }
            } else {
                // 检查是否有任何成绩数据
                let hasAnyGrade = false;
                Object.keys(student).forEach(key => {
                    if (key.includes('成绩') && student[key] !== undefined && student[key] !== null) {
                        hasAnyGrade = true;
                    }
                });

                if (hasAnyGrade) {
                    notFoundStudents.push({ 学号: studentId, 姓名: studentName });
                }
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

        // 设置不同类型的样式
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

    // 显示详细报告 - 包含清空信息
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
                message += `  ${s.学号} ${s.姓名}\n    ${s.成绩}\n`;
            });
        } else if (result.successfulFills.length > 5) {
            message += '\n成功填报的学生（显示前5条）：\n';
            result.successfulFills.slice(0, 5).forEach(s => {
                message += `  ${s.学号} ${s.姓名}\n    ${s.成绩}\n`;
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

        // 如果有跳过的记录，提供下载功能
        if (skippedRecords.length > 0) {
            addDownloadButton();
        }
    }

    // 添加下载跳过记录的按钮
    function addDownloadButton() {
        const content = document.querySelector('#grade-auto-fill-panel > div:last-child');
        let downloadBtn = document.getElementById('download-skipped-btn');

        if (!downloadBtn) {
            const btnContainer = document.createElement('div');
            btnContainer.style.marginTop = '10px';

            downloadBtn = document.createElement('button');
            downloadBtn.id = 'download-skipped-btn';
            downloadBtn.textContent = '📊 下载跳过记录';
            downloadBtn.style.cssText = 'width: 100%; padding: 8px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer;';
            downloadBtn.addEventListener('click', downloadSkippedRecords);

            btnContainer.appendChild(downloadBtn);
            content.insertBefore(btnContainer, content.querySelector('details'));
        }
    }

    // 下载跳过的记录
    function downloadSkippedRecords() {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(skippedRecords);

        ws['!cols'] = [
            { wch: 15 }, // 学号
            { wch: 12 }, // 姓名
            { wch: 40 }  // 原因
        ];

        XLSX.utils.book_append_sheet(wb, ws, "跳过的记录");
        XLSX.writeFile(wb, `跳过记录_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
    }
})();