// ==UserScript==
// @name         湖北汽车工业学院新版教务系统课程表导出工具
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  从湖北汽车工业学院新版教务系统获取并导出课程表数据
// @author       SkyDreamLG
// @match        http://neweas.huat.edu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552343/%E6%B9%96%E5%8C%97%E6%B1%BD%E8%BD%A6%E5%B7%A5%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%96%B0%E7%89%88%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/552343/%E6%B9%96%E5%8C%97%E6%B1%BD%E8%BD%A6%E5%B7%A5%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%96%B0%E7%89%88%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建界面
    function createUI() {
        // 添加样式
        const css = `
            .schedule-export-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                width: 450px;
                max-width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            }

            .schedule-export-container h2 {
                margin-top: 0;
                color: #4b6cb7;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }

            .schedule-export-container .form-group {
                margin-bottom: 15px;
            }

            .schedule-export-container label {
                display: block;
                margin-bottom: 5px;
                font-weight: 600;
            }

            .schedule-export-container input,
            .schedule-export-container select {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }

            .schedule-export-container button {
                background: #4b6cb7;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-right: 10px;
                margin-top: 10px;
            }

            .schedule-export-container button:hover {
                background: #3a5a9b;
            }

            .schedule-export-container .alert {
                padding: 10px;
                border-radius: 4px;
                margin-bottom: 15px;
                display: none;
            }

            .schedule-export-container .alert-error {
                background: #f8d7da;
                color: #721c24;
                border-left: 4px solid #dc3545;
            }

            .schedule-export-container .alert-success {
                background: #d4edda;
                color: #155724;
                border-left: 4px solid #28a745;
            }

            .schedule-export-container .alert-info {
                background: #d1ecf1;
                color: #0c5460;
                border-left: 4px solid #17a2b8;
            }

            .schedule-export-container .loading {
                text-align: center;
                padding: 10px;
                display: none;
            }

            .schedule-export-container .spinner {
                border: 3px solid #f3f3f3;
                border-top: 3px solid #4b6cb7;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .schedule-export-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9998;
            }

            .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #999;
            }

            .close-btn:hover {
                color: #333;
            }

            .token-info {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 4px;
                margin-bottom: 15px;
                font-size: 12px;
                word-break: break-all;
            }

            .export-buttons {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .export-buttons button {
                flex: 1;
                min-width: 120px;
            }

            .progress-container {
                margin: 10px 0;
            }

            .progress-bar {
                width: 100%;
                height: 20px;
                background: #f0f0f0;
                border-radius: 10px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: #4b6cb7;
                transition: width 0.3s ease;
            }

            .progress-text {
                text-align: center;
                margin-top: 5px;
                font-size: 12px;
                color: #666;
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'schedule-export-overlay';
        document.body.appendChild(overlay);

        // 获取token信息
        const cookieToken = getCookie('Admin-Token');

        // 创建容器
        const container = document.createElement('div');
        container.className = 'schedule-export-container';
        container.innerHTML = `
            <button class="close-btn">&times;</button>
            <h2>课程表导出工具</h2>

            <div class="alert alert-error" id="errorAlert"></div>
            <div class="alert alert-success" id="successAlert"></div>
            <div class="alert alert-info" id="infoAlert"></div>

            <div class="token-info">
                <strong>Token状态:</strong><br>
                ${cookieToken ? '✅ 已检测到Admin-Token' : '❌ 未检测到Admin-Token'}
            </div>

            <div class="form-group">
                <label for="year">学年</label>
                <input type="number" id="year" placeholder="请输入本学年开始的年份" value="2024" min="2000" max="2100">
            </div>

            <div class="form-group">
                <label for="term">学期</label>
                <select id="term">
                    <option value="1">第一学期</option>
                    <option value="2">第二学期</option>
                </select>
            </div>

            <div class="form-group">
                <label for="studentId">学号</label>
                <input type="text" id="studentId" placeholder="请输入您的学号">
            </div>

            <div class="form-group">
                <label for="weekRange">周数范围</label>
                <select id="weekRange">
                    <option value="1-25">1-25周（完整学期）</option>
                    <option value="1-10">1-10周</option>
                    <option value="11-20">11-20周</option>
                    <option value="21-25">21-25周</option>
                    <option value="custom">自定义</option>
                </select>
            </div>

            <div class="form-group" id="customWeekGroup" style="display: none;">
                <label for="customWeeks">自定义周数（用逗号分隔）</label>
                <input type="text" id="customWeeks" placeholder="例如：1,2,3,4,5">
            </div>

            <button id="fetchDataBtn">获取课程表数据</button>

            <div class="loading" id="loadingIndicator">
                <div class="spinner"></div>
                <p>正在获取课程表数据，请稍候...</p>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text" id="progressText">正在准备...</div>
                </div>
            </div>

            <div id="resultSection" style="display: none; margin-top: 20px;">
                <h3>课程表数据获取成功！</h3>
                <p>共获取到 <span id="courseCount">0</span> 门课程</p>
                <div class="export-buttons">
                    <button id="exportJsonBtn">导出为JSON</button>
                    <button id="exportCsvBtn">导出为CSV（适用于WakeUP课程表）</button>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // 关闭按钮事件
        container.querySelector('.close-btn').addEventListener('click', function() {
            document.body.removeChild(container);
            document.body.removeChild(overlay);
        });

        // 获取元素引用
        const yearInput = container.querySelector('#year');
        const termInput = container.querySelector('#term');
        const studentIdInput = container.querySelector('#studentId');
        const weekRangeInput = container.querySelector('#weekRange');
        const customWeekGroup = container.querySelector('#customWeekGroup');
        const customWeeksInput = container.querySelector('#customWeeks');
        const fetchDataBtn = container.querySelector('#fetchDataBtn');
        const errorAlert = container.querySelector('#errorAlert');
        const successAlert = container.querySelector('#successAlert');
        const infoAlert = container.querySelector('#infoAlert');
        const loadingIndicator = container.querySelector('#loadingIndicator');
        const resultSection = container.querySelector('#resultSection');
        const exportJsonBtn = container.querySelector('#exportJsonBtn');
        const exportCsvBtn = container.querySelector('#exportCsvBtn');
        const courseCountSpan = container.querySelector('#courseCount');
        const progressFill = container.querySelector('#progressFill');
        const progressText = container.querySelector('#progressText');

        let courseData = [];

        // 周数范围选择事件
        weekRangeInput.addEventListener('change', function() {
            customWeekGroup.style.display = this.value === 'custom' ? 'block' : 'none';
        });

        // 获取课程表数据按钮点击事件
        fetchDataBtn.addEventListener('click', fetchScheduleData);

        // 导出按钮点击事件
        exportJsonBtn.addEventListener('click', () => exportData('json'));
        exportCsvBtn.addEventListener('click', () => exportData('csv'));

        // 显示警告函数
        function showAlert(alertElement, message) {
            alertElement.textContent = message;
            alertElement.style.display = 'block';

            // 5秒后隐藏警告
            setTimeout(() => {
                alertElement.style.display = 'none';
            }, 5000);
        }

        // 更新进度条
        function updateProgress(current, total) {
            const percent = Math.round((current / total) * 100);
            progressFill.style.width = percent + '%';
            progressText.textContent = `正在获取第 ${current} 周数据... (${current}/${total})`;
        }

        // 获取Cookie函数
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            return parts.length === 2 ? parts.pop().split(';').shift() : null;
        }

        // 格式化周数字符串函数
        function formatWeeksString(weeksArray) {
            if (!Array.isArray(weeksArray) || weeksArray.length === 0) {
                return '';
            }

            // 对周数进行排序
            const sortedWeeks = [...weeksArray].sort((a, b) => a - b);

            const ranges = [];
            let start = sortedWeeks[0];
            let end = sortedWeeks[0];

            for (let i = 1; i < sortedWeeks.length; i++) {
                if (sortedWeeks[i] === end + 1) {
                    end = sortedWeeks[i];
                } else {
                    if (start === end) {
                        ranges.push(start.toString());
                    } else {
                        ranges.push(`${start}-${end}`);
                    }
                    start = sortedWeeks[i];
                    end = sortedWeeks[i];
                }
            }

            // 添加最后一个范围
            if (start === end) {
                ranges.push(start.toString());
            } else {
                ranges.push(`${start}-${end}`);
            }

            return ranges.join('、');
        }

        // 获取要请求的周数列表
        function getWeekList() {
            const weekRange = weekRangeInput.value;

            if (weekRange === 'custom') {
                const customWeeks = customWeeksInput.value;
                if (!customWeeks) {
                    throw new Error('请输入自定义周数');
                }
                return customWeeks.split(',').map(w => parseInt(w.trim())).filter(w => !isNaN(w) && w > 0);
            } else {
                const [start, end] = weekRange.split('-').map(Number);
                return Array.from({ length: end - start + 1 }, (_, i) => start + i);
            }
        }

        // 获取课程表数据函数
        async function fetchScheduleData() {
            const year = yearInput.value;
            const term = termInput.value;
            const studentId = studentIdInput.value;

            // 验证输入
            if (!year || year < 2000 || year > 2100) {
                showAlert(errorAlert, '请输入正确的学年（2000-2100）');
                return;
            }

            if (term !== '1' && term !== '2') {
                showAlert(errorAlert, '请选择正确的学期');
                return;
            }

            if (!studentId) {
                showAlert(errorAlert, '请输入正确的学号');
                return;
            }

            // 获取token
            const token = getCookie('Admin-Token');
            if (!token) {
                showAlert(errorAlert, '未检测到登录凭据，请确保已登录教务系统');
                return;
            }

            // 获取周数列表
            let weekList;
            try {
                weekList = getWeekList();
                if (weekList.length === 0) {
                    showAlert(errorAlert, '请选择有效的周数范围');
                    return;
                }
            } catch (error) {
                showAlert(errorAlert, error.message);
                return;
            }

            // 显示加载指示器
            loadingIndicator.style.display = 'block';
            fetchDataBtn.disabled = true;
            resultSection.style.display = 'none';

            // 重置数据
            courseData = [];

            try {
                const totalWeeks = weekList.length;
                let completedWeeks = 0;

                // 为每个周数发送请求
                for (const weekNum of weekList) {
                    updateProgress(completedWeeks + 1, totalWeeks);

                    await new Promise((resolve, reject) => {
                        const payload = {
                            weekNum: weekNum.toString(),
                            yearTermId: `${year}${term}`,
                            studId: studentId,
                        };

                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: 'http://neweas.huat.edu.cn/api/teachTask/list',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-token': token,
                            },
                            data: JSON.stringify(payload),
                            onload: function(response) {
                                if (response.status === 200) {
                                    const data = JSON.parse(response.responseText);

                                    if (data && data.code === 200 && data.data && Array.isArray(data.data)) {
                                        // 解析本周数据并添加到总数据中
                                        const weekData = parseScheduleData(data.data, weekNum);
                                        courseData = courseData.concat(weekData);
                                    }
                                }

                                completedWeeks++;
                                resolve();
                            },
                            onerror: function(error) {
                                completedWeeks++;
                                resolve(); // 即使失败也继续下一周
                            }
                        });
                    });

                    // 添加延迟避免请求过快
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // 合并相同课程的周数
                courseData = mergeCourseWeeks(courseData);
                courseCountSpan.textContent = courseData.length;

                if (courseData.length > 0) {
                    resultSection.style.display = 'block';
                    showAlert(successAlert, `成功获取 ${courseData.length} 门课程数据！`);
                } else {
                    showAlert(infoAlert, '获取到的课程数据为空，请检查学年、学期和学号是否正确');
                }

            } catch (error) {
                showAlert(errorAlert, `获取课程表数据失败: ${error.message}`);
            } finally {
                // 隐藏加载指示器
                loadingIndicator.style.display = 'none';
                fetchDataBtn.disabled = false;
            }
        }

        // 合并相同课程的周数
        function mergeCourseWeeks(courses) {
            const courseMap = new Map();

            courses.forEach(course => {
                // 创建唯一标识符
                const key = `${course.name}-${course.day}-${course.sections.join(',')}-${course.teacher}-${course.position}`;

                if (courseMap.has(key)) {
                    // 如果课程已存在，合并周数
                    const existingCourse = courseMap.get(key);
                    // 合并周数并去重
                    const mergedWeeks = [...new Set([...existingCourse.weeks, ...course.weeks])].sort((a, b) => a - b);
                    existingCourse.weeks = mergedWeeks;
                } else {
                    // 如果课程不存在，添加到map中
                    courseMap.set(key, {
                        name: course.name,
                        day: course.day,
                        sections: course.sections,
                        teacher: course.teacher,
                        position: course.position,
                        weeks: [...course.weeks] // 复制周数数组
                    });
                }
            });

            return Array.from(courseMap.values());
        }

        // 解析课程表数据函数
        function parseScheduleData(data, weekNum) {
            if (!data || !Array.isArray(data)) {
                return [];
            }

            const result = [];

            for (const item of data) {
                try {
                    // 处理节数
                    let sections = [];
                    if (item.startSection && typeof item.startSection === 'string') {
                        sections = item.startSection.split(',').map(Number).filter(n => !isNaN(n));
                    } else if (item.startSection !== undefined && item.endSection !== undefined) {
                        const start = parseInt(item.startSection) || 1;
                        const end = parseInt(item.endSection) || 1;
                        sections = Array.from({ length: end - start + 1 }, (_, i) => start + i);
                    } else {
                        sections = [1];
                    }

                    const course = {
                        name: item.courName || '未知课程',
                        position: `${item.schoolAddr || ''} ${item.roomId || ''}`.trim() || '未知地点',
                        teacher: (item.teacherList && item.teacherList.length > 0 && item.teacherList[0].teacherName) || '未知教师',
                        weeks: [weekNum], // 使用当前请求的周数
                        day: parseInt(item.weekDay) || 1,
                        sections: sections
                    };

                    result.push(course);
                } catch (error) {
                    console.error('解析课程数据时出错:', error, item);
                }
            }

            return result;
        }

        // 导出数据函数
        function exportData(format) {
            if (!courseData || courseData.length === 0) {
                showAlert(errorAlert, '没有可导出的数据，请先获取课程表数据');
                return;
            }

            let dataStr;
            let fileType;
            let fileName;

            try {
                if (format === 'json') {
                    dataStr = JSON.stringify(courseData, null, 2);
                    fileType = 'application/json';
                    fileName = `course_schedule_${yearInput.value}${termInput.value}_${studentIdInput.value}.json`;
                } else if (format === 'csv') {
                    dataStr = convertJsonToCsv(courseData);
                    // 使用带BOM的UTF-8编码解决中文乱码问题
                    fileType = 'text/csv;charset=utf-8';
                    fileName = `course_schedule_${yearInput.value}${termInput.value}_${studentIdInput.value}.csv`;
                }

                // 创建下载链接
                const blob = new Blob([format === 'csv' ? '\uFEFF' + dataStr : dataStr], { type: fileType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                showAlert(successAlert, `数据已导出为${format.toUpperCase()}文件`);
            } catch (error) {
                showAlert(errorAlert, `导出失败: ${error.message}`);
            }
        }

        // 将JSON数据转换为CSV格式
        function convertJsonToCsv(jsonData) {
            // CSV表头
            const headers = ['课程名称', '星期', '开始节数', '结束节数', '老师', '地点', '周数'];

            // 构建CSV内容 - 使用逗号分隔
            let csvContent = headers.join(',') + '\r\n';

            // 处理每一行数据
            jsonData.forEach(course => {
                // 计算开始节数和结束节数
                const startSection = course.sections && course.sections.length > 0 ? Math.min(...course.sections) : 1;
                const endSection = course.sections && course.sections.length > 0 ? Math.max(...course.sections) : 1;

                // 处理字段中的逗号和引号
                const escapeCsvField = (field) => {
                    if (field === null || field === undefined) return '';
                    const str = String(field);
                    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
                        return '"' + str.replace(/"/g, '""') + '"';
                    }
                    return str;
                };

                const row = [
                    escapeCsvField(course.name),
                    escapeCsvField(course.day),
                    escapeCsvField(startSection),
                    escapeCsvField(endSection),
                    escapeCsvField(course.teacher),
                    escapeCsvField(course.position),
                    escapeCsvField(formatWeeksString(course.weeks))
                ];

                csvContent += row.join(',') + '\r\n';
            });

            return csvContent;
        }
    }

    // 添加菜单命令
    GM_registerMenuCommand('导出课程表', function() {
        createUI();
    });

    // 在页面上添加一个按钮
    function addToolbarButton() {
        // 先检查是否已存在按钮
        if (document.getElementById('scheduleExportBtn')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'scheduleExportBtn';
        button.textContent = '导出课程表';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.background = '#4b6cb7';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        button.addEventListener('click', createUI);

        document.body.appendChild(button);
    }

    // 页面加载完成后添加按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addToolbarButton);
    } else {
        addToolbarButton();
    }
})();