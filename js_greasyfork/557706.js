// ==UserScript==
// @name         中国保密在线网-自动学习工具
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  自动完成中国保密在线网的视频学习，智能处理不同时长视频
// @author       卖炸弹的小女孩
// @match        https://www.baomi.org.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557706/%E4%B8%AD%E5%9B%BD%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF%E7%BD%91-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/557706/%E4%B8%AD%E5%9B%BD%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF%E7%BD%91-%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 从当前URL获取所有参数
    function getAllUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};
        for (let [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    }

    // 配置信息 (改为let以便动态更新)
    let CONFIG = {
        coursePacketId: null,
        delayBetweenRequests: 2000,
        debugMode: true,
        maxRetries: 3,
        urlParams: {},
        // 新增配置：长视频分段提交设置
        longVideoThreshold: 600, // 超过10分钟的视频视为长视频
        segmentSize: 300, // 每次提交的学习时长（秒）
        minSegmentSize: 60 // 最小提交时长（秒）
    };

    // 全局变量
    let allCourses = [];
    let filteredCourses = [];
    let isRunning = false;
    let currentProcess = null;
    let courseDetail = null;

    // SVG图标
    const SVG_ICONS = {
        play: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2l10 6-10 6z"/></svg>',
        stop: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="10" height="10"/></svg>',
        check: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 4.5l-7 7-3-3"/></svg>',
        error: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5A5.5 5.5 0 118 2.5a5.5 5.5 0 010 11zM10.5 5l-5 5m0-5l5 5"/></svg>',
        folder: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M14.5 3H7.7l-1-1.5C6.5 1.2 6.2 1 5.8 1h-4C1.3 1 1 1.3 1 1.8v10.4c0 .5.3.8.8.8h12.4c.5 0 .8-.3.8-.8V3.8c0-.5-.3-.8-.8-.8z"/></svg>',
        clock: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 4v4l3 2"/></svg>',
        settings: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>',
        book: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M14 1H5c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h9c.6 0 1-.4 1-1V2c0-.6-.4-1-1-1zM4 2H2c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h2V2z"/></svg>',
        time: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 4v4l3 2"/></svg>',
        filter: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M15 1H1l5.6 7.5v5.5l2.8-1.5V8.5z"/></svg>'
    };

    // 工具函数：将时间字符串转换为秒数
    function timeToSeconds(timeStr) {
        try {
            const parts = timeStr.split(':');
            if (parts.length === 3) {
                return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
            }
            return 300;
        } catch (e) {
            return 300;
        }
    }

    // 工具函数：获取token
    function getToken() {
        // 从cookie获取
        const cookieMatch = document.cookie.match(/token=([^;]+)/);
        if (cookieMatch) {
            return cookieMatch[1];
        }
        // 从localStorage获取
        if (localStorage.getItem('token')) {
            return localStorage.getItem('token');
        }
        // 从headers获取
        if (window.authToken) {
            return window.authToken;
        }
        return null;
    }

    // 获取headers
    function getHeaders() {
        return {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'token': getToken(),
            'siteId': '95',
            'authToken': '3613146b9c1a486b8666e86a78298a1a'
        };
    }

    // 获取课程详情
    async function getCourseDetail() {
        const { pubId, siteId } = CONFIG.urlParams;
        if (!pubId || !siteId) {
            console.error('缺少必要的URL参数: pubId 或 siteId');
            return null;
        }

        const url = `https://www.baomi.org.cn/portal/main-api/resource/simpleDetail.do?pubId=${pubId}&siteId=${siteId}`;

        if (CONFIG.debugMode) {
            console.log('正在获取课程详情...', url);
        }

        try {
            const response = await fetch(url, {
                headers: getHeaders()
            });
            const data = await response.json();

            if (data.successResult && data.data) {
                console.log('成功获取课程详情');
                return data.data;
            } else {
                console.error('获取课程详情失败:', data.error);
                return null;
            }
        } catch (error) {
            console.error('获取课程详情网络错误:', error);
            return null;
        }
    }

    // 获取目录列表
    async function getDirectoryList() {
        const url = `https://www.baomi.org.cn/portal/main-api/v2/coursePacket/getCourseDirectoryList?scale=1&coursePacketId=${CONFIG.coursePacketId}`;

        if (CONFIG.debugMode) {
            console.log('正在获取目录列表...', url);
        }

        try {
            const response = await fetch(url, {
                headers: getHeaders()
            });
            const data = await response.json();

            if (data.status === 0 && data.data) {
                console.log('成功获取到目录结构');
                return data.data;
            } else {
                console.error('获取目录列表失败:', data.message);
                return [];
            }
        } catch (error) {
            console.error('获取目录列表网络错误:', error);
            return [];
        }
    }

    // 递归获取所有目录
    function getAllDirectories(directoryList) {
        const directories = [];

        function traverse(dirs) {
            if (!dirs || !Array.isArray(dirs)) return;

            dirs.forEach(dir => {
                directories.push({
                    SYS_UUID: dir.SYS_UUID,
                    name: dir.name,
                    directoryCascadeID: dir.directoryCascadeID
                });

                if (dir.subDirectory && dir.subDirectory.length > 0) {
                    traverse(dir.subDirectory);
                }
            });
        }

        traverse(directoryList);
        return directories;
    }

    // 获取单个目录下的课程列表
    async function getCoursesByDirectory(directoryId, directoryName, retryCount = 0) {
        const url = `https://www.baomi.org.cn/portal/main-api/v2/coursePacket/getCourseResourceList?coursePacketId=${CONFIG.coursePacketId}&directoryId=${directoryId}&token=${getToken()}`;

        if (CONFIG.debugMode) {
            console.log(`正在获取目录"${directoryName}"的课程列表...`);
        }

        try {
            const response = await fetch(url, {
                headers: getHeaders()
            });
            const data = await response.json();

            if (data.status === 0 && data.data && data.data.listdata) {
                const courses = data.data.listdata.map(course => ({
                    ...course,
                    directoryName: directoryName,
                    directoryId: directoryId,
                    totalSeconds: timeToSeconds(course.timeLength) // 预计算总秒数
                }));

                if (CONFIG.debugMode) {
                    console.log(`目录"${directoryName}"获取到 ${courses.length} 个课程`);
                }

                return courses;
            } else {
                console.error(`获取目录"${directoryName}"课程列表失败:`, data.message);
                return [];
            }
        } catch (error) {
            if (retryCount < CONFIG.maxRetries) {
                console.log(`第${retryCount + 1}次重试获取目录"${directoryName}"课程列表...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return getCoursesByDirectory(directoryId, directoryName, retryCount + 1);
            } else {
                console.error(`获取目录"${directoryName}"课程列表网络错误:`, error);
                return [];
            }
        }
    }

    // 获取所有课程
    async function getAllCourses() {
        console.log('开始获取所有目录和课程...');

        const directoryList = await getDirectoryList();
        if (directoryList.length === 0) {
            console.error('未获取到任何目录');
            return [];
        }

        const allDirectories = getAllDirectories(directoryList);
        console.log(`发现 ${allDirectories.length} 个目录`);

        let allCourses = [];

        for (let i = 0; i < allDirectories.length; i++) {
            const directory = allDirectories[i];
            const courses = await getCoursesByDirectory(directory.SYS_UUID, directory.name);
            allCourses = allCourses.concat(courses);

            if (i < allDirectories.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`总共获取到 ${allCourses.length} 个课程`);
        return allCourses;
    }

    // 提交单个课程的学习进度 - 智能分段提交
    async function submitCourseProgress(course, index, total, retryCount = 0) {
        const totalSeconds = course.totalSeconds || timeToSeconds(course.timeLength);

        // 使用课程的SYS_UUID作为resourceDirectoryId
        const resourceDirectoryId = course.SYS_UUID;

        // 修复：对resourceName进行双重编码
        const encodedResourceName = encodeURIComponent(course.name);

        // 判断是否为长视频
        const isLongVideo = totalSeconds > CONFIG.longVideoThreshold;

        if (CONFIG.debugMode) {
            console.log(`正在处理课程 ${index + 1}/${total}: ${course.name}`);
            console.log(`   视频时长: ${course.timeLength} (${totalSeconds}秒)`);
            console.log(`   视频类型: ${isLongVideo ? '长视频' : '短视频'}`);
        }

        if (isLongVideo) {
            // 长视频：分段提交
            return await submitLongVideoProgress(course, totalSeconds, resourceDirectoryId, encodedResourceName);
        } else {
            // 短视频：一次性提交
            return await submitShortVideoProgress(course, totalSeconds, resourceDirectoryId, encodedResourceName);
        }
    }

    // 提交短视频学习进度（一次性提交）
    async function submitShortVideoProgress(course, totalSeconds, resourceDirectoryId, encodedResourceName) {
        const params = new URLSearchParams({
            courseId: CONFIG.coursePacketId,
            resourceId: course.resourceID,
            resourceDirectoryId: resourceDirectoryId,
            resourceLength: totalSeconds,
            studyLength: totalSeconds,
            studyTime: totalSeconds,
            startTime: Date.now() - (totalSeconds * 1000),
            resourceName: encodedResourceName,
            resourceType: '1',
            resourceLibId: '3',
            studyResourceId: course.SYS_DOCUMENTID,
            token: getToken()
        });

        const url = `https://www.baomi.org.cn/portal/main-api/v2/studyTime/saveCoursePackage.do?${params}`;

        if (CONFIG.debugMode) {
            console.log(`   提交方式: 一次性提交`);
            console.log(`   resourceDirectoryId: ${resourceDirectoryId}`);
            console.log(`   resourceId: ${course.resourceID}`);
        }

        try {
            const response = await fetch(url, {
                headers: getHeaders()
            });
            const result = await response.json();

            if (result.status === 0) {
                console.log(`✅ 完成: ${course.name}`);
                return { success: true, course: course.name, directory: course.directoryName };
            } else {
                console.error(`❌ 提交失败: ${course.name} - ${result.message}`);
                return { success: false, course: course.name, error: result.message, directory: course.directoryName };
            }
        } catch (error) {
            console.error(`❌ 网络错误: ${course.name} -`, error);
            return { success: false, course: course.name, error: error.message, directory: course.directoryName };
        }
    }

    // 提交长视频学习进度（分段提交）
    async function submitLongVideoProgress(course, totalSeconds, resourceDirectoryId, encodedResourceName) {
        // 计算需要分几段提交
        const segments = Math.ceil(totalSeconds / CONFIG.segmentSize);
        let remainingSeconds = totalSeconds;
        let submittedLength = 0;

        if (CONFIG.debugMode) {
            console.log(`   提交方式: 分段提交 (${segments}段)`);
        }

        // 分段提交
        for (let segment = 1; segment <= segments; segment++) {
            const isLastSegment = segment === segments;
            const segmentStudyTime = isLastSegment ?
                Math.max(remainingSeconds, CONFIG.minSegmentSize) :
                CONFIG.segmentSize;

            // 累计学习长度（模拟真实学习进度）
            submittedLength += segmentStudyTime;
            const currentStudyLength = Math.min(submittedLength, totalSeconds);

            const params = new URLSearchParams({
                courseId: CONFIG.coursePacketId,
                resourceId: course.resourceID,
                resourceDirectoryId: resourceDirectoryId,
                resourceLength: totalSeconds,
                studyLength: currentStudyLength,
                studyTime: segmentStudyTime,
                startTime: Date.now() - (totalSeconds * 1000) + ((segment - 1) * CONFIG.segmentSize * 1000),
                resourceName: encodedResourceName,
                resourceType: '1',
                resourceLibId: '3',
                studyResourceId: course.SYS_DOCUMENTID,
                token: getToken()
            });

            const url = `https://www.baomi.org.cn/portal/main-api/v2/studyTime/saveCoursePackage.do?${params}`;

            if (CONFIG.debugMode) {
                console.log(`   第${segment}段: studyLength=${currentStudyLength}, studyTime=${segmentStudyTime}`);
            }

            try {
                const response = await fetch(url, {
                    headers: getHeaders()
                });
                const result = await response.json();

                if (result.status === 0) {
                    if (CONFIG.debugMode) {
                        console.log(`   ✅ 第${segment}段提交成功`);
                    }
                } else {
                    console.error(`   ❌ 第${segment}段提交失败: ${result.message}`);
                    // 继续提交下一段，不立即返回失败
                }

                remainingSeconds -= segmentStudyTime;

                // 如果不是最后一段，等待一段时间再提交下一段
                if (!isLastSegment) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (error) {
                console.error(`   ❌ 第${segment}段网络错误:`, error);
                // 继续提交下一段，不立即返回失败
            }
        }

        console.log(`✅ 长视频提交完成: ${course.name}`);
        return { success: true, course: course.name, directory: course.directoryName };
    }

    // 更新进度显示
    function updateProgress(current, total, message) {
        const progressElement = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const statusElement = document.getElementById('status');

        const percent = total > 0 ? Math.round((current / total) * 100) : 0;

        if (progressElement && progressText) {
            progressElement.style.width = percent + '%';
            progressText.textContent = `${current}/${total} (${percent}%)`;
        }

        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    // 显示最终结果
    function showFinalResults(results) {
        console.log('批量提交完成！');
        console.log('统计结果:');
        console.log(`   成功: ${results.success} 个课程`);
        console.log(`   失败: ${results.failed} 个课程`);
        console.log(`   跳过: ${results.skipped} 个课程`);
        console.log(`   总计: ${results.total} 个课程`);

        const byDirectory = {};
        results.details.forEach(result => {
            const dir = result.directory || '未知目录';
            if (!byDirectory[dir]) {
                byDirectory[dir] = { success: 0, failed: 0, skipped: 0, courses: [] };
            }
            if (result.success) {
                byDirectory[dir].success++;
            } else if (result.skipped) {
                byDirectory[dir].skipped++;
            } else {
                byDirectory[dir].failed++;
            }
            byDirectory[dir].courses.push(result);
        });

        console.log('按目录统计:');
        Object.keys(byDirectory).forEach(dir => {
            const stats = byDirectory[dir];
            console.log(`   ${dir}: ✅${stats.success} ❌${stats.failed} ⏭️${stats.skipped}`);
        });

        if (results.failed > 0) {
            console.log('失败课程详情:');
            results.details.filter(r => !r.success && !r.skipped).forEach((fail, index) => {
                console.log(`   ${index + 1}. [${fail.directory}] ${fail.course} - ${fail.error}`);
            });
        }

        updateProgress(results.total, results.total, '提交完成！');
        updateStatus(`完成: ${results.success}成功/${results.failed}失败/${results.skipped}跳过`);
    }

    // 批量提交所有课程
    async function submitAllCourses() {
        if (isRunning) {
            console.log('提交正在进行中，请勿重复点击');
            return;
        }

        isRunning = true;
        console.log('🚀 开始自动提交课程学习进度...');

        try {
            // 获取所有课程
            updateStatus('正在获取目录列表...');
            updateProgress(0, 0, '初始化...');

            allCourses = await getAllCourses();
            if (allCourses.length === 0) {
                console.error('❌ 未获取到任何课程，请检查网络连接和登录状态');
                isRunning = false;
                updateStatus('获取课程失败，请检查登录状态');
                return;
            }

            filteredCourses = allCourses;

            if (filteredCourses.length === 0) {
                console.log('🎉 所有课程都已学习完成，无需提交！');
                isRunning = false;
                updateStatus('所有课程都已学习完成！');
                updateProgress(1, 1, '已完成');
                return;
            }

            console.log(`📋 开始提交 ${filteredCourses.length} 个未完成课程`);
            updateStatus(`开始提交 ${filteredCourses.length} 个未完成课程...`);

            // 统计结果
            const results = {
                total: allCourses.length,
                success: 0,
                failed: 0,
                skipped: allCourses.length - filteredCourses.length,
                details: []
            };

            // 逐个提交未完成课程进度
            for (let i = 0; i < filteredCourses.length; i++) {
                if (!isRunning) {
                    console.log('⏹️  用户手动停止');
                    break;
                }

                const course = filteredCourses[i];
                updateProgress(i, filteredCourses.length, `正在提交: ${course.name.substring(0, 20)}...`);

                const result = await submitCourseProgress(course, i, filteredCourses.length);

                results.details.push(result);
                if (result.success) {
                    results.success++;
                } else {
                    results.failed++;
                }

                // 增加延迟，避免请求过于频繁
                if (i < filteredCourses.length - 1 && isRunning) {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenRequests));
                }
            }

            // 显示最终结果
            showFinalResults(results);
            isRunning = false;
            return results;

        } catch (error) {
            console.error('❌ 提交过程发生错误:', error);
            isRunning = false;
            updateStatus('提交过程发生错误: ' + error.message);
        }
    }

    // 更新状态
    function updateStatus(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    // 重新设计的UI面板
    function addUI() {
        // 防止重复添加
        const existingUI = document.getElementById('auto-study-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const ui = document.createElement('div');
        ui.id = 'auto-study-ui';
        ui.innerHTML = `
            <div class="auto-study-container">
                <div class="auto-study-header">
                    <div class="auto-study-title">
                        ${SVG_ICONS.settings}
                        <span>自动学习工具 v2.8</span>
                    </div>
                    <div class="auto-study-course-info">
                        <div class="auto-study-course-name">
                            ${SVG_ICONS.book}
                            <span id="courseName">加载课程信息...</span>
                        </div>
                        <div class="auto-study-course-details">
                            <div class="auto-study-detail-item">
                                ${SVG_ICONS.time}
                                <span>总学时: </span>
                                <span id="totalGrade">0</span>
                                <span> 学时</span>
                            </div>
                            <div class="auto-study-detail-item">
                                ${SVG_ICONS.filter}
                                <span>智能处理长视频分段提交</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="auto-study-controls">
                    <button id="startAutoStudy" class="auto-study-btn auto-study-btn-primary">
                        ${SVG_ICONS.play}
                        <span>开始自动提交</span>
                    </button>
                    
                    <button id="stopAutoStudy" class="auto-study-btn auto-study-btn-secondary" style="display: none;">
                        ${SVG_ICONS.stop}
                        <span>停止提交</span>
                    </button>
                </div>
                
                <div class="auto-study-progress">
                    <div class="auto-study-progress-info">
                        <span>进度:</span>
                        <span id="progressText">0/0 (0%)</span>
                    </div>
                    <div class="auto-study-progress-bar">
                        <div id="progressBar" class="auto-study-progress-fill"></div>
                    </div>
                </div>
                
                <div id="status" class="auto-study-status">
                    准备就绪，点击开始
                </div>
            </div>
        `;

        document.body.appendChild(ui);

        // 添加样式
        const style = document.createElement('style');
        style.id = 'auto-study-style';
        style.textContent = `
            .auto-study-container {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ffffff;
                border: 1px solid #e1e5e9;
                border-radius: 12px;
                padding: 16px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                min-width: 320px;
                backdrop-filter: blur(10px);
                background: rgba(255,255,255,0.95);
            }
            
            .auto-study-header {
                margin-bottom: 16px;
                border-bottom: 1px solid #f0f0f0;
                padding-bottom: 12px;
            }
            
            .auto-study-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                font-size: 14px;
                color: #1a1a1a;
                margin-bottom: 12px;
            }
            
            .auto-study-course-info {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .auto-study-course-name {
                display: flex;
                align-items: center;
                gap: 6px;
                font-weight: 500;
                font-size: 13px;
                color: #1a1a1a;
                line-height: 1.3;
            }
            
            .auto-study-course-details {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            
            .auto-study-detail-item {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                color: #666;
            }
            
            .auto-study-controls {
                display: flex;
                gap: 8px;
                margin-bottom: 16px;
            }
            
            .auto-study-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 10px 16px;
                border: none;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                flex: 1;
                justify-content: center;
            }
            
            .auto-study-btn-primary {
                background: #10b981;
                color: white;
            }
            
            .auto-study-btn-primary:hover {
                background: #059669;
                transform: translateY(-1px);
            }
            
            .auto-study-btn-secondary {
                background: #ef4444;
                color: white;
            }
            
            .auto-study-btn-secondary:hover {
                background: #dc2626;
                transform: translateY(-1px);
            }
            
            .auto-study-progress {
                margin-bottom: 12px;
            }
            
            .auto-study-progress-info {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #666;
                margin-bottom: 6px;
            }
            
            .auto-study-progress-bar {
                width: 100%;
                height: 6px;
                background: #f0f0f0;
                border-radius: 3px;
                overflow: hidden;
            }
            
            .auto-study-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #059669);
                border-radius: 3px;
                transition: width 0.3s ease;
                width: 0%;
            }
            
            .auto-study-status {
                font-size: 12px;
                color: #666;
                margin-bottom: 12px;
                min-height: 16px;
                line-height: 1.4;
            }
            
            .auto-study-stats {
                display: flex;
                gap: 12px;
                font-size: 11px;
                color: #666;
            }
            
            .auto-study-stat {
                display: flex;
                align-items: center;
                gap: 4px;
            }
        `;

        // 避免重复添加样式
        if (!document.getElementById('auto-study-style')) {
            document.head.appendChild(style);
        }

        // 事件监听
        document.getElementById('startAutoStudy').addEventListener('click', async function () {
            this.style.display = 'none';
            document.getElementById('stopAutoStudy').style.display = 'flex';
            updateStatus('正在获取目录和课程列表...');
            updateProgress(0, 1, '初始化...');

            currentProcess = submitAllCourses();
            await currentProcess;
        });

        document.getElementById('stopAutoStudy').addEventListener('click', function () {
            isRunning = false;
            document.getElementById('startAutoStudy').style.display = 'flex';
            this.style.display = 'none';
            updateStatus('已手动停止');
        });
    }

    // 更新课程信息显示
    function updateCourseInfo() {
        if (courseDetail) {
            const courseNameElement = document.getElementById('courseName');
            const totalGradeElement = document.getElementById('totalGrade');

            if (courseNameElement) {
                courseNameElement.textContent = courseDetail.docName || courseDetail.name || '未知课程名称';
            }

            if (totalGradeElement) {
                totalGradeElement.textContent = courseDetail.COURSE_PACKET_gradeSum || courseDetail.gradeSum || 0;
            }
        }
    }

    // 主函数 - 每次页面状态变化时调用
    async function main() {
        // 更新当前URL参数到配置中
        const currentUrlParams = getAllUrlParams();
        CONFIG.urlParams = currentUrlParams;
        CONFIG.coursePacketId = currentUrlParams.id;

        // 如果没有ID，说明可能不在正确的页面，暂不执行
        if (!CONFIG.coursePacketId) {
            return;
        }

        console.log(`
==============================================
中国保密在线网-自动学习脚本 v2.8
智能加载版：支持路由切换检测
==============================================
        `);

        if (!getToken()) {
            console.error('无法获取token，请确保已登录');
            return;
        }

        // 添加UI
        addUI();

        // 获取课程详情
        console.log('正在获取课程详情...');
        updateStatus('正在获取课程信息...');

        courseDetail = await getCourseDetail();
        if (courseDetail) {
            updateCourseInfo();
            console.log('课程信息加载完成:', courseDetail.docName);
            updateStatus('课程信息加载完成，准备就绪');
        } else {
            console.error('获取课程详情失败');
            updateStatus('获取课程信息失败');
        }
    }

    // 监控页面URL变化，自动注入UI
    function startUrlMonitor() {
        // 每秒检查一次，如果处于详情页且UI不存在，则初始化
        setInterval(() => {
            const isDetailPage = location.href.indexOf('bmCourseDetail') > -1;
            const uiExists = document.getElementById('auto-study-ui');

            if (isDetailPage && !uiExists) {
                console.log('检测到进入课程详情页，正在初始化UI...');
                main();
            }
        }, 1000);
    }

    // 启动监控
    startUrlMonitor();

})();