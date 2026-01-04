// ==UserScript==
// @name         四川大学课程一键获取器
// @namespace    http://zhjw.scu.edu.cn/
// @version      2.0.2
// @description  一键获取四川大学选课网站所有课程，自动导出为CSV文件，修复分页显示不全问题
// @author       SCU Helper
// @match        http://zhjw.scu.edu.cn/*
// @match        https://zhjw.scu.edu.cn/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560157/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560157/%E5%9B%9B%E5%B7%9D%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. 安全检查：只在顶层窗口运行，防止iframe中重复出现按钮
    if (window.top !== window) {
        return;
    }

    // 2. 防止重复初始化
    if (window.scuCourseFetcherInitialized) {
        return;
    }
    window.scuCourseFetcherInitialized = true;

    // 全局变量
    let courseData = [];
    let isWorking = false;

    // 日志系统
    const log = {
        info: (msg, ...args) => console.log('[🎓 SCU课程获取器]', msg, ...args),
        error: (msg, ...args) => console.error('[🎓 SCU课程获取器]', msg, ...args),
        warn: (msg, ...args) => console.warn('[🎓 SCU课程获取器]', msg, ...args)
    };

    // UI: 显示通知
    function showNotification(message, type = 'info', duration = 3000) {
        const colors = { info: '#3498db', success: '#2ecc71', warning: '#f39c12', error: '#e74c3c' };
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 30px; left: 50%; transform: translateX(-50%);
            padding: 12px 25px; background: ${colors[type] || colors.info}; color: white;
            border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 999999;
            font-size: 14px; font-weight: 500; pointer-events: none;
            animation: slideDown 0.3s ease-out;
        `;
        notification.textContent = message;

        const style = document.createElement('style');
        style.innerHTML = `@keyframes slideDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }`;
        document.head.appendChild(style);
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // UI: 创建悬浮按钮
    function createFloatingButton() {
        if (document.getElementById('scu-floating-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'scu-floating-btn';
        btn.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; width: 56px; height: 56px;
            border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            cursor: pointer; z-index: 99999; display: flex; align-items: center; justify-content: center;
            font-size: 26px; transition: transform 0.2s;
        `;
        btn.innerHTML = '🎓';
        btn.title = '打开课程获取器';

        btn.onclick = () => {
            const panel = document.getElementById('scu-crawler-panel');
            if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            else createPanel();
        };

        btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
        btn.onmouseleave = () => btn.style.transform = 'scale(1)';

        document.body.appendChild(btn);
    }

    // UI: 创建控制面板
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'scu-crawler-panel';
        panel.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 380px; background: white; border-radius: 12px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.25); z-index: 100000;
            font-family: system-ui, -apple-system, sans-serif; overflow: hidden;
        `;

        panel.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 18px; color: white; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 18px;">🎓 SCU 选课助手</h2>
                <span id="close-panel" style="cursor: pointer; font-size: 20px; opacity: 0.8;">×</span>
            </div>
            <div style="padding: 20px;">
                <div id="status-box" style="padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px;">⏳</span>
                    <div>
                        <div style="font-weight: 600; font-size: 14px; color: #333;">准备就绪</div>
                        <div id="course-count" style="color: #666; font-size: 12px;">等待指令...</div>
                    </div>
                </div>

                <button id="fetch-btn" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;">
                    🚀 获取所有课程并导出 CSV
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('close-panel').onclick = () => panel.style.display = 'none';
        document.getElementById('fetch-btn').onclick = fetchAndExportCourses;
    }

    // 核心逻辑: 获取并导出
    async function fetchAndExportCourses() {
        if (isWorking) return;
        isWorking = true;

        try {
            updateStatus('正在连接教务系统...', 'info');

            // 【优化1】更标准的 URL 获取方式
            const url = window.location.origin + '/student/courseSelect/freeCourse/courseList';
            log.info('请求目标:', url);

            // 【优化2】添加分页参数，确保获取所有数据 (Critical!)
            const formData = new URLSearchParams();
            // 基础查询参数
            formData.append('kkxsh', '');
            formData.append('kch', '');
            formData.append('kcm', '');
            formData.append('skjs', '');
            formData.append('xq', '0');
            formData.append('jc', '0');
            formData.append('kclbdm', '');
            formData.append('vt', '');
            formData.append('fj', '0');
            // 分页参数：如果不加，服务器通常默认只返回20条
            formData.append('pageSize', '10000');
            formData.append('pageNum', '1');

            updateStatus('正在下载课程数据...', 'info');

            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            xhr.onload = function () {
                if (xhr.status === 200) {
                    try {
                        const result = JSON.parse(xhr.responseText);

                        // 【优化3】兼容多种数据返回结构 (data, list, rows)
                        courseData = result.data || result.list || result.rows || result || [];

                        // 特殊情况处理：有时候数据包裹在更深层
                        if (!Array.isArray(courseData) && typeof result === 'object') {
                            // 尝试寻找对象中是数组的属性
                            for (let key in result) {
                                if (Array.isArray(result[key])) {
                                    courseData = result[key];
                                    break;
                                }
                            }
                        }

                        if (!Array.isArray(courseData) || courseData.length === 0) {
                            log.warn('数据为空', result);
                            updateStatus('未获取到课程，请确认您已登录且位于选课阶段', 'error');
                            showNotification('未获取到数据，请检查登录状态', 'error');
                        } else {
                            updateStatus(`成功！正在导出 ${courseData.length} 门课程`, 'success');
                            exportToCSV(courseData);
                            showNotification(`成功导出 ${courseData.length} 门课程！`, 'success');
                        }
                    } catch (e) {
                        log.error('JSON解析失败', e);
                        updateStatus('数据解析错误，请按F12查看日志', 'error');
                    }
                } else {
                    log.error('请求失败', xhr.status);
                    updateStatus(`请求失败 (代码: ${xhr.status})`, 'error');
                }
                isWorking = false;
            };

            xhr.onerror = () => {
                log.error('网络错误');
                updateStatus('网络连接错误，可能是跨域被拦截', 'error');
                isWorking = false;
            };

            xhr.send(formData);

        } catch (error) {
            log.error('运行时错误', error);
            updateStatus('发生未知错误', 'error');
            isWorking = false;
        }
    }

    // 更新UI状态
    function updateStatus(message, type) {
        const statusBox = document.getElementById('status-box');
        const courseCount = document.getElementById('course-count');
        const btn = document.getElementById('fetch-btn');

        if (!statusBox) return;

        const icons = { info: '⏳', success: '✅', warning: '⚠️', error: '❌' };
        const bgColors = { info: '#f8f9fa', success: '#d4edda', warning: '#fff3cd', error: '#f8d7da' };

        statusBox.querySelector('span').textContent = icons[type] || '⏳';
        statusBox.querySelector('div > div:first-child').textContent = message;
        statusBox.style.background = bgColors[type] || bgColors.info;

        if (courseCount && type === 'success') {
            courseCount.textContent = `共 ${courseData.length} 条数据`;
        }

        if (btn) {
            if (type === 'success') {
                btn.textContent = '✅ 导出完成';
                btn.style.opacity = '0.7';
                setTimeout(() => { btn.textContent = '🚀 再次获取'; btn.style.opacity = '1'; }, 3000);
            } else if (type === 'error') {
                btn.textContent = '❌ 重试';
            } else {
                btn.textContent = '🔄 处理中...';
            }
        }
    }

    // 导出CSV (通用版)
    function exportToCSV(data) {
        if (!data.length) return;

        // 字段映射：数据库字段名 -> 中文标题
        const fieldMapping = {
            'id': 'ID',
            'zxjxjhh': '执行计划号',
            'kch': '课程号',
            'kxh': '课序号',
            'kcm': '课程名称',
            'xf': '学分',
            'xs': '学时',
            'kkxsh': '开课院系',
            'kkxsjc': '开课时间节次',
            'kslxdm': '考试类型代码',
            'kslxmc': '考试类型',
            'skjs': '授课教师',
            'bkskrl': '本科生选课量',
            'bkskyl': '本科生选课余量',
            'xkmsdm': '选课模式代码',
            'xkmssm': '选课模式说明',
            'xkkzdm': '选课控制代码',
            'xkkzsm': '选课控制说明',
            'xkkzh': '选课控制号',
            'xkxzsm': '选课限制说明',
            'kkxqh': '开课校区号',
            'kkxqm': '开课校区名',
            'sfxzxslx': '是否限制系所类型',
            'sfxzxsnj': '是否限制年级',
            'sfxzxsxs': '是否限制学生性别',
            'sfxzxxkc': '是否限制选修课程',
            'sfxzxdlx': '是否限制大类类型',
            'sfxzskyz': '是否限制使用院系',
            'xqm': '校区名',
            'jxlm': '教学楼名',
            'jasm': '教室名',
            'zcsm': '周次说明',
            'skzc': '上课周次',
            'skxq': '上课星期',
            'skjc': '上课节次',
            'cxjc': '重复节次',
            'sflbdm': '是否列表代码',
            'xkbz': '选课备注',
            'kclbdm': '课程类别代码',
            'kclbmc': '课程类别',
            'cxxkpdctf': '先选课程判断存',
            'yxxszxf': '应选学分总数',
            'zcxkpdctf': '重选课程判断存',
            'zkxh': '主课序号',
            'zkch': '主课程号',
            'yxkxqxk': '允许跨校系选课',
            'kclbdm2': '课程类别2代码',
            'kclbmc2': '课程类别2',
            'xmcjhc': '学分成绩含',
            'sjdd': '上课地点'
        };

        // 动态获取所有可能的列头（按映射表顺序）
        const allFields = Array.from(new Set(data.flatMap(Object.keys)));

        // 过滤出有映射的字段，优先显示已知的字段，未知的用原名
        const headers = allFields.map(field => ({
            field: field,
            header: fieldMapping[field] || field
        }));

        // 构建CSV内容 (BOM头解决Excel乱码)
        let csv = '\uFEFF' + headers.map(h => `"${h.header}"`).join(',') + '\n';

        data.forEach(row => {
            csv += headers.map(({ field }) => {
                let val = row[field] ?? ''; // 空值处理
                val = String(val).replace(/"/g, '""'); // 转义双引号
                return `"${val}"`; // 统一包裹双引号，处理逗号和换行
            }).join(',') + '\n';
        });

        // 下载触发
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SCU_Courses_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // 入口
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingButton);
    } else {
        createFloatingButton();
    }

    log.info('插件加载完成');

})();

