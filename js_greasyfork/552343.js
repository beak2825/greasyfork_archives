// ==UserScript==
// @name         湖北汽车工业学院新版教务系统课程表导出工具
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  从湖北汽车工业学院新版教务系统获取并导出课程表数据（适配新API，支持HTTP/HTTPS自动切换）
// @author       SkyDreamLG
// @match        http://neweas.huat.edu.cn/*
// @match        https://neweas.huat.edu.cn/*
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

    // 获取当前页面的协议，自动选择HTTP/HTTPS
    function getBaseUrl() {
        const protocol = window.location.protocol;
        return `${protocol}//neweas.huat.edu.cn`;
    }

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

            .protocol-info {
                background: #e8f4f8;
                padding: 8px;
                border-radius: 4px;
                margin-bottom: 15px;
                font-size: 12px;
                color: #0c5460;
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
        const currentProtocol = window.location.protocol.replace(':', '');

        // 创建容器
        const container = document.createElement('div');
        container.className = 'schedule-export-container';
        container.innerHTML = `
            <button class="close-btn">&times;</button>
            <h2>课程表导出工具 v2.1</h2>

            <div class="alert alert-error" id="errorAlert"></div>
            <div class="alert alert-success" id="successAlert"></div>
            <div class="alert alert-info" id="infoAlert"></div>

            <div class="protocol-info">
                <strong>当前协议:</strong> ${currentProtocol.toUpperCase()}<br>
                <strong>服务器地址:</strong> ${getBaseUrl()}
            </div>

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
                    <option value="2" selected>第二学期</option>
                </select>
            </div>

            <div class="form-group">
                <label for="studentId">学号</label>
                <input type="text" id="studentId" placeholder="请输入您的学号">
            </div>

            <button id="fetchDataBtn">获取课程表数据</button>

            <div class="loading" id="loadingIndicator">
                <div class="spinner"></div>
                <p>正在获取课程表数据，请稍候...</p>
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
        const fetchDataBtn = container.querySelector('#fetchDataBtn');
        const errorAlert = container.querySelector('#errorAlert');
        const successAlert = container.querySelector('#successAlert');
        const infoAlert = container.querySelector('#infoAlert');
        const loadingIndicator = container.querySelector('#loadingIndicator');
        const resultSection = container.querySelector('#resultSection');
        const exportJsonBtn = container.querySelector('#exportJsonBtn');
        const exportCsvBtn = container.querySelector('#exportCsvBtn');
        const courseCountSpan = container.querySelector('#courseCount');

        let courseData = [];

        // 显示警告函数
        function showAlert(alertElement, message) {
            alertElement.textContent = message;
            alertElement.style.display = 'block';

            // 5秒后隐藏警告
            setTimeout(() => {
                alertElement.style.display = 'none';
            }, 5000);
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

        // 根据weekBegin和weekEnd生成周数数组
        function generateWeeksArray(weekBegin, weekEnd) {
            if (!weekBegin || !weekEnd || weekBegin > weekEnd) {
                return [1]; // 默认返回第1周
            }
            
            const weeks = [];
            for (let i = weekBegin; i <= weekEnd; i++) {
                weeks.push(i);
            }
            return weeks;
        }

        // 获取课程表数据函数
        function fetchScheduleData() {
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

            // 显示加载指示器
            loadingIndicator.style.display = 'block';
            fetchDataBtn.disabled = true;
            resultSection.style.display = 'none';

            // 重置数据
            courseData = [];

            // 构建请求体 - weekNum留空以获取全部课程
            const payload = {
                weekNum: "", // 留空获取全部课表
                yearTermId: `${year}${term}`,
                studId: studentId,
            };

            const baseUrl = getBaseUrl();
            
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${baseUrl}/api/teachTask/list`,
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token,
                },
                data: JSON.stringify(payload),
                onload: function(response) {
                    loadingIndicator.style.display = 'none';
                    fetchDataBtn.disabled = false;

                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);

                            if (data && data.code === 200 && data.data && Array.isArray(data.data)) {
                                // 解析课程表数据
                                courseData = parseScheduleData(data.data);
                                
                                // 合并相同课程的多个条目（如单双周分开的情况）
                                courseData = mergeCourseEntries(courseData);
                                
                                courseCountSpan.textContent = courseData.length;

                                if (courseData.length > 0) {
                                    resultSection.style.display = 'block';
                                    showAlert(successAlert, `成功获取 ${courseData.length} 门课程数据！`);
                                } else {
                                    showAlert(infoAlert, '获取到的课程数据为空，请检查学年、学期和学号是否正确');
                                }
                            } else {
                                showAlert(errorAlert, '获取课程表数据失败：' + (data.message || '未知错误'));
                            }
                        } catch (error) {
                            showAlert(errorAlert, '解析数据失败：' + error.message);
                        }
                    } else {
                        showAlert(errorAlert, '请求失败，状态码：' + response.status);
                    }
                },
                onerror: function(error) {
                    loadingIndicator.style.display = 'none';
                    fetchDataBtn.disabled = false;
                    
                    // 提供更详细的错误信息
                    let errorMessage = '网络请求失败';
                    if (error && error.error) {
                        errorMessage += ': ' + error.error;
                    }
                    
                    // 尝试提供解决方案
                    if (baseUrl.includes('https')) {
                        errorMessage += '\n提示：如果HTTPS请求失败，可以尝试切换到HTTP协议访问';
                    } else {
                        errorMessage += '\n提示：如果HTTP请求失败，可以尝试切换到HTTPS协议访问';
                    }
                    
                    showAlert(errorAlert, errorMessage);
                }
            });
        }

        // 解析课程表数据函数（适配新API格式）
        function parseScheduleData(data) {
            if (!data || !Array.isArray(data)) {
                return [];
            }

            const result = [];

            for (const item of data) {
                try {
                    // 生成周数数组
                    const weeks = generateWeeksArray(item.weekBegin, item.weekEnd);
                    
                    // 生成节数数组
                    const sections = [];
                    const startSection = parseInt(item.startSection) || 1;
                    const endSection = parseInt(item.endSection) || startSection;
                    
                    for (let i = startSection; i <= endSection; i++) {
                        sections.push(i);
                    }

                    // 获取教师名称
                    let teacher = '未知教师';
                    if (item.teacherList && item.teacherList.length > 0) {
                        teacher = item.teacherList.map(t => t.teacherName).filter(name => name).join('、');
                    } else if (item.teachResponse && item.teachResponse.courTeacherName1) {
                        teacher = item.teachResponse.courTeacherName1;
                    }

                    // 构建地点信息
                    const location = `${item.schoolAddr || ''} ${item.roomId || ''}`.trim() || '未知地点';

                    const course = {
                        name: item.courName || '未知课程',
                        position: location,
                        teacher: teacher,
                        weeks: weeks,
                        day: parseInt(item.weekDay) || 1,
                        sections: sections,
                        // 保留原始数据用于调试
                        rawData: item
                    };

                    result.push(course);
                } catch (error) {
                    console.error('解析课程数据时出错:', error, item);
                }
            }

            return result;
        }

        // 合并课程条目（处理单双周分开的情况）
        function mergeCourseEntries(courses) {
            const courseMap = new Map();

            courses.forEach(course => {
                // 创建唯一标识符：课程名称+星期+节数+教师+地点
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
                        weeks: [...course.weeks]
                    });
                }
            });

            return Array.from(courseMap.values());
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

        // 获取课程表数据按钮点击事件
        fetchDataBtn.addEventListener('click', fetchScheduleData);

        // 导出按钮点击事件
        exportJsonBtn.addEventListener('click', () => exportData('json'));
        exportCsvBtn.addEventListener('click', () => exportData('csv'));
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