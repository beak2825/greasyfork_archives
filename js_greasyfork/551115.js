// ==UserScript==
// @name         1-超级复制
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  【猫厂专用】【谨慎操作】支持超级复制 和 同步修改课程名称
// @author       大生
// @match        https://tyca.codemao.cn/tanyue-course-warehouse/course/list*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @icon         https://tyca.codemao.cn/favicon.ico
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/551115/1-%E8%B6%85%E7%BA%A7%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/551115/1-%E8%B6%85%E7%BA%A7%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 获取当前脚本版本
    const currentVersion = typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version ?
        GM_info.script.version : '3.0'; // 默认版本
    console.log('1-超级复制脚本已加载，版本: ' + currentVersion);

    // 检查更新功能
    function checkForUpdates() {
        // 获取当前脚本版本
        const currentVersion = typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version ?
            GM_info.script.version : '3.0'; // 默认版本

        // GitHub API URL
        const githubApiUrl = 'https://api.github.com/repos/bpjanson/Vibe_Coding/releases/latest';

        // 使用fetch检查更新
        fetch(githubApiUrl)
            .then(response => response.json())
            .then(data => {
                const latestVersion = data.tag_name.replace('v', ''); // 去除可能的'v'前缀

                // 比较版本号
                if (compareVersions(latestVersion, currentVersion) > 0) {
                    // 有新版本，显示更新提示
                    showUpdateNotification(currentVersion, latestVersion, data.html_url);
                }
            })
            .catch(error => {
                console.warn('检查更新失败:', error);
            });
    }

    // 版本号比较函数
    function compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;

            if (part1 > part2) return 1;
            if (part1 < part2) return -1;
        }

        return 0;
    }

    // 显示更新通知
    function showUpdateNotification(currentVersion, newVersion, releaseUrl) {
        // 创建更新提示元素
        const updateNotice = document.createElement('div');
        updateNotice.id = 'scriptUpdateNotice';
        updateNotice.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            font-size: 14px;
            color: #856404;
            max-width: 300px;
        `;

        updateNotice.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <strong>脚本有新版本可用</strong>
                <button id="closeUpdateNotice" style="background: none; border: none; font-size: 18px; cursor: pointer; padding: 0; line-height: 1;">×</button>
            </div>
            <div style="margin-bottom: 15px;">
                <div>当前版本: ${currentVersion}</div>
                <div>最新版本: ${newVersion}</div>
            </div>
            <div style="display: flex; gap: 10px; flex-direction: column;">
                <button id="updateNowBtn" style="padding: 8px 12px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">查看更新详情</button>
                <button id="tmUpdateBtn" style="padding: 8px 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">通过Tampermonkey更新</button>
                <button id="laterBtn" style="padding: 8px 12px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">稍后提醒</button>
            </div>
        `;

        document.body.appendChild(updateNotice);

        // 添加事件监听器
        document.getElementById('closeUpdateNotice').addEventListener('click', function () {
            updateNotice.remove();
        });

        document.getElementById('updateNowBtn').addEventListener('click', function () {
            window.open(releaseUrl, '_blank');
            updateNotice.remove();
        });

        document.getElementById('tmUpdateBtn').addEventListener('click', function () {
            // 通过Tampermonkey更新脚本
            const downloadUrl = 'https://raw.githubusercontent.com/bpjanson/Vibe_Coding/main/web_scripts/1-%E8%B6%85%E7%BA%A7%E5%A4%8D%E5%88%B6.js';
            window.open(downloadUrl, '_blank');
            updateNotice.remove();
        });

        document.getElementById('laterBtn').addEventListener('click', function () {
            updateNotice.remove();
        });
    }

    // 等待页面加载完成
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((_mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                callback(element);
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });

        // 如果元素已经存在，直接执行回调
        const existingElement = document.querySelector(selector);
        if (existingElement) {
            observer.disconnect();
            callback(existingElement);
        }
    }

    // 获取当前页面的请求头信息
    function getRequestHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        // 尝试从页面中获取常见的认证头
        const metaTags = document.querySelectorAll('meta');
        metaTags.forEach(meta => {
            if (meta.name === 'csrf-token' || meta.name === '_token') {
                headers['X-CSRF-TOKEN'] = meta.content;
            }
        });

        return headers;
    }

    // 获取课程信息的函数
    async function getCourseInfo(courseId) {
        const url = `https://codecamp-teaching-system.codemao.cn/ty-courses/${courseId}/base`;

        console.log(`[超级复制] 获取课程信息 ${courseId}`);
        console.log(`[超级复制] 请求URL: ${url}`);

        try {
            const headers = getRequestHeaders();
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
                credentials: 'include',
                mode: 'cors'
            });

            console.log(`[超级复制] 获取课程信息响应状态: ${response.status}`);

            if (response.ok) {
                const result = await response.json();
                console.log(`[超级复制] 获取课程信息成功:`, result);

                if (result.success && result.data) {
                    return { success: true, data: result.data };
                } else {
                    return { success: false, error: '获取课程信息失败：数据格式错误' };
                }
            } else {
                const errorText = await response.text();
                console.error(`[超级复制] 获取课程信息失败 ${response.status}:`, errorText);
                return { success: false, error: `获取课程信息失败 HTTP ${response.status}: ${errorText}` };
            }
        } catch (error) {
            console.error(`[超级复制] 获取课程信息网络错误:`, error);
            return { success: false, error: `获取课程信息网络错误: ${error.message}` };
        }
    }

    // 修改课程信息的函数
    async function updateCourseInfo(courseId, courseData) {
        const url = `https://codecamp-teaching-system.codemao.cn/ty-courses/${courseId}/base`;

        console.log(`[超级复制] 修改课程信息 ${courseId}`);
        console.log(`[超级复制] 请求URL: ${url}`);
        console.log(`[超级复制] 修改数据:`, courseData);

        try {
            const headers = getRequestHeaders();
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(courseData)
            });

            console.log(`[超级复制] 修改课程信息响应状态: ${response.status}`);
            console.log(`[超级复制] 修改课程信息响应头:`, Object.fromEntries(response.headers.entries()));

            if (response.ok) {
                // 检查响应内容类型和长度
                const contentType = response.headers.get('content-type');
                const contentLength = response.headers.get('content-length');

                console.log(`[超级复制] 响应内容类型: ${contentType}, 内容长度: ${contentLength}`);

                let result = null;
                try {
                    if (contentType && contentType.includes('application/json')) {
                        // 如果内容长度为0或很小，可能是空响应
                        if (contentLength === '0') {
                            console.log(`[超级复制] 响应内容为空，但状态码成功`);
                            result = { message: '修改成功（空响应）' };
                        } else {
                            result = await response.json();
                        }
                    } else {
                        // 非JSON响应，尝试读取文本
                        const textResult = await response.text();
                        console.log(`[超级复制] 非JSON响应内容:`, textResult);
                        result = { message: '修改成功', response: textResult };
                    }
                } catch (parseError) {
                    console.log(`[超级复制] 响应解析失败，但状态码成功:`, parseError);
                    result = { message: '修改成功（响应解析失败）' };
                }

                console.log(`[超级复制] 修改课程信息成功:`, result);
                return { success: true, data: result };
            } else {
                const errorText = await response.text();
                console.error(`[超级复制] 修改课程信息失败 ${response.status}:`, errorText);
                return { success: false, error: `修改课程信息失败 HTTP ${response.status}: ${errorText}` };
            }
        } catch (error) {
            console.error(`[超级复制] 修改课程信息网络错误:`, error);
            return { success: false, error: `修改课程信息网络错误: ${error.message}` };
        }
    }

    // 复制课程的函数 - 使用GET请求
    async function copyCourse(courseId) {
        const url = `https://codecamp-teaching-system.codemao.cn/ty-courses/${courseId}/copy`;

        console.log(`[超级复制] 开始复制课程 ${courseId}`);
        console.log(`[超级复制] 请求URL: ${url}`);

        try {
            const headers = getRequestHeaders();
            console.log(`[超级复制] 请求头:`, headers);

            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
                credentials: 'include', // 包含cookies用于身份验证
                mode: 'cors'
            });

            console.log(`[超级复制] 响应状态: ${response.status}`);
            console.log(`[超级复制] 响应头:`, Object.fromEntries(response.headers.entries()));

            // 检查响应内容
            const contentType = response.headers.get('content-type');
            let responseData = null;

            if (response.status === 200 || response.status === 201 || response.status === 204) {
                try {
                    if (contentType && contentType.includes('application/json')) {
                        responseData = await response.json();
                    } else {
                        responseData = await response.text();
                    }
                    console.log(`[超级复制] 成功响应:`, responseData);
                    console.log(`[超级复制] 响应数据类型:`, typeof responseData);
                    console.log(`[超级复制] 响应数据结构:`, JSON.stringify(responseData, null, 2));

                    // 从响应中提取新课程ID
                    let newCourseId = null;
                    if (responseData && typeof responseData === 'object') {
                        // 根据响应格式：{"code":200,"success":true,"data":15136,"msg":"操作成功","traceId":"..."}
                        // data字段直接就是新课程ID
                        if (responseData.data !== undefined && responseData.data !== null) {
                            if (typeof responseData.data === 'number') {
                                newCourseId = responseData.data;
                            } else if (typeof responseData.data === 'string' && /^\d+$/.test(responseData.data)) {
                                newCourseId = parseInt(responseData.data);
                            }
                        }

                        // 备用方案：尝试其他可能的字段
                        if (!newCourseId) {
                            newCourseId = responseData.id ||
                                responseData.courseId ||
                                responseData.newCourseId;
                        }
                    }

                    console.log(`[超级复制] 提取的新课程ID: ${newCourseId}`);

                    return {
                        success: true,
                        data: responseData || { message: '复制成功' },
                        newCourseId: newCourseId
                    };
                } catch (parseError) {
                    console.log(`[超级复制] 响应解析失败，但状态码成功:`, parseError);
                    return {
                        success: true,
                        data: { message: '复制成功（响应解析失败）' },
                        newCourseId: null
                    };
                }
            } else {
                let errorText;
                try {
                    if (contentType && contentType.includes('application/json')) {
                        const errorJson = await response.json();
                        errorText = errorJson.message || errorJson.error || JSON.stringify(errorJson);
                    } else {
                        errorText = await response.text();
                    }
                } catch {
                    errorText = '无法解析错误响应';
                }

                console.error(`[超级复制] 错误响应 ${response.status}:`, errorText);

                return { success: false, error: `HTTP ${response.status}: ${errorText}` };
            }
        } catch (error) {
            console.error(`[超级复制] 网络错误:`, error);
            return { success: false, error: `网络错误: ${error.message}` };
        }
    }

    // 生成Excel文件并下载
    async function generateAndDownloadExcel(originalCourseInfo, results) {
        console.log('[超级复制] 开始生成Excel文件');

        // 准备Excel数据
        const excelData = [];

        // 添加原课程信息
        excelData.push({
            '课程ID': originalCourseInfo.courseId,
            '课程名称': originalCourseInfo.courseName,
            '课程预览': `{"data":${originalCourseInfo.courseId},"mode":"COURSE"}`
        });

        // 添加复制出来的课程信息
        for (const result of results) {
            if (result.success && result.newCourseId) {
                // 获取新课程的最新信息（包含修改后的名称）
                const newCourseInfo = await getCourseInfo(result.newCourseId);
                if (newCourseInfo.success) {
                    excelData.push({
                        '课程ID': result.newCourseId,
                        '课程名称': newCourseInfo.data.name,
                        '课程预览': `{"data":${result.newCourseId},"mode":"COURSE"}`
                    });
                } else {
                    // 如果获取失败，使用已知信息
                    excelData.push({
                        '课程ID': result.newCourseId,
                        '课程名称': result.newCourseName || '获取失败',
                        '课程预览': `{"data":${result.newCourseId},"mode":"COURSE"}`
                    });
                }
            }
        }

        console.log('[超级复制] Excel数据准备完成:', excelData);

        // 创建工作簿和工作表
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "课程信息");

        // 设置列宽
        ws['!cols'] = [
            { wch: 10 }, // 课程ID
            { wch: 30 }, // 课程名称
            { wch: 40 }  // 课程预览
        ];

        // 生成Excel文件
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // 创建下载链接
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        link.download = `课程信息_${timestamp}.xlsx`;
        link.click();

        console.log('[超级复制] Excel文件下载完成');
    }

    // 批量复制课程的函数
    async function batchCopyCourse(courseInfo, copyCount, progressCallback) {
        const results = [];
        const total = copyCount;

        // 第一步：获取原课程信息（不修改原课程名称）
        progressCallback && progressCallback(0, total, '正在获取原课程信息...');

        const originalCourseResult = await getCourseInfo(courseInfo.courseId);
        if (!originalCourseResult.success) {
            return [{
                index: 0,
                success: false,
                error: `获取原课程信息失败: ${originalCourseResult.error}`
            }];
        }

        const originalCourseData = originalCourseResult.data;
        const originalName = originalCourseData.name;

        console.log(`[超级复制] 原课程名称: ${originalName}（不修改）`);

        // 开始复制课程
        for (let i = 0; i < copyCount; i++) {
            progressCallback && progressCallback(i, total, `正在复制第 ${i + 1} 个课程...`);

            const copyResult = await copyCourse(courseInfo.courseId);

            if (copyResult.success) {
                // 复制成功
                if (copyResult.newCourseId) {
                    // 有新课程ID，尝试修改名称
                    progressCallback && progressCallback(i, total, `正在修改第 ${i + 1} 个课程名称...`);

                    const newCourseName = `${originalName}-${i + 2}`; // 从-2开始

                    // 获取新课程信息
                    const newCourseInfoResult = await getCourseInfo(copyResult.newCourseId);
                    if (newCourseInfoResult.success) {
                        const updateResult = await updateCourseInfo(copyResult.newCourseId, {
                            ...newCourseInfoResult.data,
                            name: newCourseName
                        });

                        if (updateResult.success) {
                            console.log(`[超级复制] 新课程名称已修改为: ${newCourseName}`);
                            results.push({
                                index: i + 1,
                                success: true,
                                data: copyResult.data,
                                newCourseId: copyResult.newCourseId,
                                newCourseName: newCourseName,
                                nameUpdateSuccess: true
                            });
                        } else {
                            console.warn(`[超级复制] 修改新课程名称失败: ${updateResult.error}`);
                            results.push({
                                index: i + 1,
                                success: true,
                                data: copyResult.data,
                                newCourseId: copyResult.newCourseId,
                                nameUpdateSuccess: false,
                                nameUpdateError: updateResult.error
                            });
                        }
                    } else {
                        console.warn(`[超级复制] 获取新课程信息失败: ${newCourseInfoResult.error}`);
                        results.push({
                            index: i + 1,
                            success: true,
                            data: copyResult.data,
                            newCourseId: copyResult.newCourseId,
                            nameUpdateSuccess: false,
                            nameUpdateError: newCourseInfoResult.error
                        });
                    }
                } else {
                    // 复制成功但没有获取到新课程ID
                    console.warn(`[超级复制] 复制成功但未获取到新课程ID，响应数据:`, copyResult.data);
                    results.push({
                        index: i + 1,
                        success: true,
                        data: copyResult.data,
                        newCourseId: null,
                        nameUpdateSuccess: false,
                        nameUpdateError: '未获取到新课程ID，无法修改名称'
                    });
                }
            } else {
                // 复制失败
                results.push({
                    index: i + 1,
                    success: false,
                    error: copyResult.error || '复制失败'
                });
            }

            // 添加延迟避免请求过于频繁 - 每0.5秒请求一次
            if (i < copyCount - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        progressCallback && progressCallback(total, total, '复制完成！');
        return {
            results: results,
            originalCourseInfo: {
                courseId: courseInfo.courseId,
                courseName: originalName,
                courseData: originalCourseData
            }
        };
    }

    // 创建进度弹窗的函数
    function createProgressModal() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 24px;
            width: 400px;
            max-width: 90vw;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        const title = document.createElement('h3');
        title.textContent = '正在复制课程...';
        title.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
            color: #333;
        `;

        const progressText = document.createElement('div');
        progressText.style.cssText = `
            margin-bottom: 12px;
            color: #666;
        `;

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 100%;
            height: 8px;
            background-color: #f0f0f0;
            border-radius: 4px;
            overflow: hidden;
        `;

        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            background-color: #1890ff;
            width: 0%;
            transition: width 0.3s ease;
        `;

        progressBar.appendChild(progressFill);
        modal.appendChild(title);
        modal.appendChild(progressText);
        modal.appendChild(progressBar);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        return {
            overlay,
            updateProgress: (current, total, message) => {
                const percentage = (current / total) * 100;
                progressFill.style.width = `${percentage}%`;
                progressText.textContent = message;

                if (current === total) {
                    title.textContent = '复制完成！';
                }
            },
            close: () => {
                document.body.removeChild(overlay);
            }
        };
    }

    // 显示结果弹窗的函数
    function showResultModal(results, originalCourseInfo) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 24px;
            width: 500px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;

        const title = document.createElement('h3');
        title.textContent = '复制结果';
        title.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
            color: #333;
        `;

        const summary = document.createElement('div');
        summary.style.cssText = `
            margin-bottom: 16px;
            padding: 12px;
            background-color: ${successCount === results.length ? '#f6ffed' : '#fff2e8'};
            border: 1px solid ${successCount === results.length ? '#b7eb8f' : '#ffbb96'};
            border-radius: 4px;
        `;
        const nameUpdateSuccessCount = results.filter(r => r.success && r.nameUpdateSuccess === true).length;
        const nameUpdateFailCount = results.filter(r => r.success && r.nameUpdateSuccess === false).length;

        summary.innerHTML = `
            <strong>原课程：</strong>${originalCourseInfo.courseName}<br>
            <strong>复制成功：</strong>${successCount} 个<br>
            <strong>复制失败：</strong>${failCount} 个<br>
            <strong>名称修改成功：</strong>${nameUpdateSuccessCount} 个<br>
            <strong>名称修改失败：</strong>${nameUpdateFailCount} 个
        `;

        if (failCount > 0 || nameUpdateFailCount > 0) {
            const errorList = document.createElement('div');
            errorList.style.cssText = `
                margin-bottom: 16px;
                max-height: 200px;
                overflow-y: auto;
            `;

            const errorTitle = document.createElement('h4');
            errorTitle.textContent = '失败详情：';
            errorTitle.style.cssText = 'margin: 0 0 8px 0; color: #d4380d;';

            errorList.appendChild(errorTitle);

            results.forEach(result => {
                if (!result.success) {
                    const errorItem = document.createElement('div');
                    errorItem.style.cssText = `
                        padding: 8px;
                        margin-bottom: 4px;
                        background-color: #fff2f0;
                        border-radius: 4px;
                        font-size: 12px;
                    `;
                    errorItem.textContent = `第 ${result.index} 个复制失败：${result.error}`;
                    errorList.appendChild(errorItem);
                } else if (result.nameUpdateSuccess === false) {
                    const errorItem = document.createElement('div');
                    errorItem.style.cssText = `
                        padding: 8px;
                        margin-bottom: 4px;
                        background-color: #fffbe6;
                        border-radius: 4px;
                        font-size: 12px;
                        color: #d48806;
                    `;
                    errorItem.textContent = `第 ${result.index} 个名称修改失败：${result.nameUpdateError}`;
                    errorList.appendChild(errorItem);
                }
            });

            modal.appendChild(errorList);
        }

        // 下载Excel按钮
        const downloadExcelButton = document.createElement('button');
        downloadExcelButton.textContent = '下载Excel';
        downloadExcelButton.style.cssText = `
            padding: 8px 16px;
            border: none;
            background: #52c41a;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            float: right;
            margin-right: 20px;
        `;

        downloadExcelButton.addEventListener('click', async () => {
            downloadExcelButton.disabled = true;
            downloadExcelButton.textContent = '生成中...';

            try {
                await generateAndDownloadExcel(originalCourseInfo, results);
                downloadExcelButton.textContent = '下载完成';
                setTimeout(() => {
                    downloadExcelButton.disabled = false;
                    downloadExcelButton.textContent = '下载Excel';
                }, 2000);
            } catch (error) {
                console.error('[超级复制] Excel生成失败:', error);
                alert(`Excel生成失败: ${error.message}`);
                downloadExcelButton.disabled = false;
                downloadExcelButton.textContent = '下载Excel';
            }
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';

        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            // 刷新页面以显示新创建的课程
            if (successCount > 0) {
                window.location.reload();
            }
        });

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 16px;
            margin-top: 20px;
        `;

        // 重新设置按钮样式，移除float
        downloadExcelButton.style.cssText = `
            padding: 8px 16px;
            border: none;
            background: #52c41a;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        closeButton.style.cssText = `
            padding: 8px 16px;
            border: none;
            background: #1890ff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        buttonContainer.appendChild(downloadExcelButton);
        buttonContainer.appendChild(closeButton);

        modal.appendChild(title);
        modal.appendChild(summary);
        modal.appendChild(buttonContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // 创建自定义弹窗的函数
    function createCustomModal(courseInfo) {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // 创建弹窗主体
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 24px;
            width: 500px;
            max-width: 90vw;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        // 弹窗标题
        const title = document.createElement('h3');
        title.textContent = '请确认复制课的信息';
        title.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
            color: #333;
        `;

        // 课程信息段落
        const courseInfoDiv = document.createElement('div');
        courseInfoDiv.style.cssText = `
            margin-bottom: 16px;
            padding: 12px;
            background-color: #f5f5f5;
            border-radius: 4px;
            line-height: 1.5;
        `;
        courseInfoDiv.innerHTML = `
            <strong>课程ID：</strong>${courseInfo.courseId}<br>
            <strong>课程名称：</strong>${courseInfo.courseName}<br>
            <strong>编辑器类型：</strong>${courseInfo.editorType}
        `;

        // 警告提示段落
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = `
            margin-bottom: 16px;
            padding: 12px;
            background-color: #fff2e8;
            border: 1px solid #ffbb96;
            border-radius: 4px;
            color: #d4380d;
        `;
        warningDiv.textContent = '复制课程操作不可逆，请谨慎操作';

        // 输入框容器
        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = 'margin-bottom: 20px;';

        const inputLabel = document.createElement('label');
        inputLabel.textContent = '复制次数：';
        inputLabel.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
        `;

        const copyCountInput = document.createElement('input');
        copyCountInput.type = 'number';
        copyCountInput.min = '1';
        copyCountInput.max = '100';
        copyCountInput.value = '1';
        copyCountInput.style.cssText = `
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        `;

        inputContainer.appendChild(inputLabel);
        inputContainer.appendChild(copyCountInput);

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        `;

        // 取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = `
            padding: 8px 16px;
            border: 1px solid #d9d9d9;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;



        // 确认按钮
        const confirmButton = document.createElement('button');
        confirmButton.textContent = '复制课程';
        confirmButton.style.cssText = `
            padding: 8px 16px;
            border: none;
            background: #1890ff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        // 按钮事件
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });



        confirmButton.addEventListener('click', async () => {
            const copyCount = parseInt(copyCountInput.value);
            if (copyCount > 0 && copyCount <= 100) {
                // 关闭确认弹窗
                document.body.removeChild(overlay);

                // 显示进度弹窗
                const progressModal = createProgressModal();

                try {
                    // 执行批量复制（包含名称修改）
                    const batchResult = await batchCopyCourse(courseInfo, copyCount, progressModal.updateProgress);

                    // 延迟一下让用户看到完成状态
                    setTimeout(() => {
                        progressModal.close();
                        showResultModal(batchResult.results, batchResult.originalCourseInfo);
                    }, 1000);

                } catch (error) {
                    progressModal.close();
                    alert(`复制过程中发生错误：${error.message}`);
                }
            } else {
                alert('请输入有效的复制次数（1-100）');
            }
        });

        // 组装弹窗
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(confirmButton);

        modal.appendChild(title);
        modal.appendChild(courseInfoDiv);
        modal.appendChild(warningDiv);
        modal.appendChild(inputContainer);
        modal.appendChild(buttonContainer);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 点击遮罩层关闭弹窗
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // 聚焦输入框
        copyCountInput.focus();
        copyCountInput.select();
    }

    // 隐藏科目列的函数
    function hideSubjectColumn() {
        // 隐藏表头中的科目列（第5列，索引为4）
        const headerCells = document.querySelectorAll('.ant-table-thead th');
        if (headerCells[4]) {
            headerCells[4].style.display = 'none';
        }

        // 隐藏表格内容中的科目列
        const rows = document.querySelectorAll('.ant-table-tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[4]) {
                cells[4].style.display = 'none';
            }
        });
    }

    // 添加超级复制按钮的函数
    function addSuperCopyButtons() {
        // 查找所有的复制按钮
        const copyButtons = document.querySelectorAll('span[style*="color: rgb(16, 142, 233)"][style*="cursor: pointer"]:not([data-super-copy-added])');

        copyButtons.forEach(copyButton => {
            // 检查是否是复制按钮
            if (copyButton.textContent.trim() === '复制') {
                // 创建超级复制按钮
                const superCopyButton = document.createElement('span');
                superCopyButton.textContent = '超级复制';
                superCopyButton.style.cssText = 'color: green; cursor: pointer; margin-left: 10px;';

                // 添加点击事件
                superCopyButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // 获取当前行的课程信息
                    const row = copyButton.closest('tr');
                    if (row) {
                        const cells = row.querySelectorAll('td');
                        console.log(`[超级复制] 当前行信息:`, {
                            rowIndex: Array.from(row.parentNode.children).indexOf(row),
                            cellsCount: cells.length,
                            cellsText: Array.from(cells).map(cell => cell.textContent?.trim())
                        });

                        const courseInfo = {
                            courseId: cells[0]?.textContent?.trim(),      // 课程ID
                            courseName: cells[1]?.textContent?.trim(),    // 课程名
                            packageCount: cells[2]?.textContent?.trim(),  // 所属课程包数量
                            editorType: cells[3]?.textContent?.trim(),    // 编辑器类型
                            subject: cells[4]?.textContent?.trim(),       // 科目（虽然隐藏但仍存在）
                            operator: cells[5]?.textContent?.trim(),      // 操作人
                            modifyTime: cells[6]?.textContent?.trim()     // 修改时间
                        };

                        console.log(`[超级复制] 解析的课程信息:`, courseInfo);

                        // 显示自定义弹窗
                        createCustomModal(courseInfo);
                    }
                });

                // 将超级复制按钮插入到复制按钮后面
                copyButton.parentNode.insertBefore(superCopyButton, copyButton.nextSibling);

                // 标记已添加，避免重复添加
                copyButton.setAttribute('data-super-copy-added', 'true');
            }
        });
    }

    // 监听表格变化，动态添加按钮
    function observeTableChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (node.tagName === 'TR' || node.querySelector('tr'))) {
                            shouldUpdate = true;
                        }
                    });
                }
            });

            if (shouldUpdate) {
                setTimeout(() => {
                    addSuperCopyButtons();
                    hideSubjectColumn();
                }, 100);
            }
        });

        const tableContainer = document.querySelector('.ant-table-tbody') || document.body;
        observer.observe(tableContainer, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    function init() {
        // 检查更新
        checkForUpdates();

        // 等待表格加载
        waitForElement('.ant-table-tbody', () => {
            console.log('课程列表表格已加载，开始添加超级复制按钮');
            addSuperCopyButtons();
            hideSubjectColumn();
            observeTableChanges();
        });
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();