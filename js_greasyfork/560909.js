// ==UserScript==
// @name         新海天帮你查课余量 (第二阶段版 & 可视化日志增强版)
// @namespace    https://github.com/Xr1ng
// @version      3.1
// @description  适配新版教务系统第二阶段的自动选课脚本（可视日志、可暂停刷新、UI增强版）
// @author       上条当咩 & Xr1ng & Claude & Gemini
// @match        https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects/
// @include      https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects/*
// @icon         https://love.nimisora.icu/homework-notify/nimisora.png
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560909/%E6%96%B0%E6%B5%B7%E5%A4%A9%E5%B8%AE%E4%BD%A0%E6%9F%A5%E8%AF%BE%E4%BD%99%E9%87%8F%20%28%E7%AC%AC%E4%BA%8C%E9%98%B6%E6%AE%B5%E7%89%88%20%20%E5%8F%AF%E8%A7%86%E5%8C%96%E6%97%A5%E5%BF%97%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560909/%E6%96%B0%E6%B5%B7%E5%A4%A9%E5%B8%AE%E4%BD%A0%E6%9F%A5%E8%AF%BE%E4%BD%99%E9%87%8F%20%28%E7%AC%AC%E4%BA%8C%E9%98%B6%E6%AE%B5%E7%89%88%20%20%E5%8F%AF%E8%A7%86%E5%8C%96%E6%97%A5%E5%BF%97%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------------------- 配置区 -------------------
    // 您的愿望单课程数组 - 只需填写课程号和序号，例如: ['M402001B 01', 'A121033B 01']
    var wishListCourses = [
    ];

    // 刷新延迟（毫秒），默认为 2000 (2秒)
    const REFRESH_DELAY = 2000;
    // ------------------- 配置区结束 -------------------


    // --- 全局状态变量 ---
    let hasSubmitted = false;
    let notificationIntervals = {}; // 存储每个课程的通知计时器
    let isPaused = false; // 是否暂停自动刷新

    // ------------------- 可视化日志窗口模块 -------------------
    const LogManager = {
        logWindow: null,
        logContent: null,
        showLogButton: null,

        init: function() {
            // 1. 注入CSS样式
            GM_addStyle(`
                #log-window-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 450px;
                    max-height: 350px;
                    background-color: rgba(255, 255, 255, 0.95);
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Microsoft YaHei', sans-serif;
                    font-size: 13px;
                    transition: opacity 0.3s, transform 0.3s;
                }
                #log-window-container.hidden {
                    opacity: 0;
                    transform: scale(0.95);
                    pointer-events: none;
                }
                #log-header {
                    padding: 8px 12px;
                    background-color: #f0f0f0;
                    border-bottom: 1px solid #ccc;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    user-select: none;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                #log-header-title {
                    font-weight: bold;
                    color: #333;
                }
                #log-content {
                    padding: 10px;
                    overflow-y: auto;
                    flex-grow: 1;
                    color: #333;
                    background-color: #fff;
                }
                #log-content p {
                    margin: 0 0 6px 0;
                    padding: 0 0 4px 0;
                    line-height: 1.5;
                    border-bottom: 1px dotted #eee;
                    word-break: break-all;
                }
                #log-content .log-success { color: #28a745; font-weight: bold; }
                #log-content .log-error { color: #dc3545; font-weight: bold; }
                #log-content .log-warn { color: #f39c12; }
                #log-content .log-info { color: #007bff; }
                #log-content .log-check { color: #6c757d; }
                .log-controls button {
                    margin-left: 8px;
                    padding: 4px 8px;
                    font-size: 12px;
                    cursor: pointer;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background-color: #fff;
                }
                .log-controls button:hover {
                    background-color: #e9e9e9;
                    border-color: #bbb;
                }
                #show-log-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9998;
                    display: none; /* Initially hidden */
                    padding: 8px 12px;
                    cursor: pointer;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                 #show-log-button.visible {
                    display: block;
                }
            `);

            // 2. 创建HTML元素
            document.body.insertAdjacentHTML('beforeend', `
                <div id="log-window-container">
                    <div id="log-header">
                        <span id="log-header-title">选课脚本日志</span>
                        <div class="log-controls">
                            <button id="toggle-pause-btn">暂停刷新</button>
                            <button id="clear-log-btn">清空日志</button>
                            <button id="hide-log-btn">隐藏</button>
                        </div>
                    </div>
                    <div id="log-content"></div>
                </div>
                <button id="show-log-button">显示日志</button>
            `);

            // 3. 获取DOM引用
            this.logWindow = document.getElementById('log-window-container');
            this.logContent = document.getElementById('log-content');
            this.showLogButton = document.getElementById('show-log-button');

            // 4. 绑定事件
            this.makeDraggable(document.getElementById('log-header'), this.logWindow);
            document.getElementById('toggle-pause-btn').addEventListener('click', this.togglePause);
            document.getElementById('clear-log-btn').addEventListener('click', () => this.logContent.innerHTML = '');
            document.getElementById('hide-log-btn').addEventListener('click', () => this.toggleVisibility(false));
            this.showLogButton.addEventListener('click', () => this.toggleVisibility(true));

            this.log('日志窗口初始化成功', 'success');
        },

        log: function(message, type = 'info') {
            if (!this.logContent) return;

            const time = new Date().toLocaleTimeString();
            const logClass = `log-${type}`;
            const p = document.createElement('p');
            p.className = logClass;
            p.innerHTML = `[${time}] ${message}`;

            this.logContent.appendChild(p);
            // 自动滚动到底部
            this.logContent.scrollTop = this.logContent.scrollHeight;

            // 同时在控制台输出，方便调试
            console.log(`[Tampermonkey] ${message}`);
        },

        togglePause: function() {
            isPaused = !isPaused;
            const btn = document.getElementById('toggle-pause-btn');
            btn.textContent = isPaused ? '恢复刷新' : '暂停刷新';
            btn.style.color = isPaused ? '#dc3545' : '';
            LogManager.log(`刷新已 ${isPaused ? '暂停' : '恢复'}`, 'warn');
        },

        toggleVisibility: function(show) {
            if(show) {
                this.logWindow.classList.remove('hidden');
                this.showLogButton.classList.remove('visible');
            } else {
                this.logWindow.classList.add('hidden');
                this.showLogButton.classList.add('visible');
            }
        },

        makeDraggable: function(header, element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            header.onmousedown = e => {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = () => {
                    document.onmouseup = null;
                    document.onmousemove = null;
                };
                document.onmousemove = e => {
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    element.style.top = (element.offsetTop - pos2) + "px";
                    element.style.left = (element.offsetLeft - pos1) + "px";
                };
            };
        }
    };

    // ------------------- 原有脚本逻辑（已集成日志功能） -------------------

    // 发送循环通知
    function startRepeatingNotification(courseCode) {
        if (notificationIntervals[courseCode]) return;
        LogManager.log(`为课程 ${courseCode} 开启循环通知`, 'warn');

        notificationIntervals[courseCode] = setInterval(() => {
            GM_notification({
                title: '课程余量提醒！',
                text: `课程 ${courseCode} 有余量！点击此通知停止该课程的提醒`,
                timeout: 0,
                onclick: () => stopNotification(courseCode)
            });
        }, 500); // 每0.5秒发送一次通知
    }

    // 停止特定课程的通知
    function stopNotification(courseCode) {
        if (notificationIntervals[courseCode]) {
            clearInterval(notificationIntervals[courseCode]);
            delete notificationIntervals[courseCode];
            LogManager.log(`已停止 ${courseCode} 的通知`, 'info');
        }
    }

    // 停止所有通知
    function stopAllNotifications() {
        Object.keys(notificationIntervals).forEach(stopNotification);
    }

    // 从课程描述中提取课程信息
    function extractCourseInfo(courseCell) {
        const ellipsisElement = courseCell.querySelector('.ellipsis');
        if (!ellipsisElement) return null;

        // 优先从 title 属性获取，如果没有则从文本内容获取
        const description = ellipsisElement.getAttribute('title') || ellipsisElement.textContent;
        if (!description) return null;

        // 匹配格式如: A101004B:电磁波应用概论 01
        const regex = /([A-Z]\d{6}[A-Z]):.*?\s(\d{2})$/;
        const match = description.trim().match(regex);

        if (match) {
            return {
                courseCode: match[1],
                sectionNum: match[2],
                fullCode: `${match[1]} ${match[2]}`
            };
        }
        return null;
    }

    // 点击提交按钮（在iframe内部）
    function clickSubmitButton(iframeDoc) {
        // 提交按钮在 iframe 内部
        var submitButton = iframeDoc.getElementById('select-submit-btn');
        if (submitButton) {
            submitButton.click();
            LogManager.log('提交按钮已点击', 'info');
            return true;
        }
        LogManager.log('提交按钮未找到', 'error');
        return false;
    }

    // 处理验证码（在iframe内部）
    function handleCaptcha(iframeDoc) {
        var captchaDialog = iframeDoc.querySelector('.captcha-dialog:not(.hide)');
        if (captchaDialog) {
            var inputField = captchaDialog.querySelector('input[name="answer"]');
            if (inputField) {
                LogManager.log('检测到验证码，请输入后按下回车键提交', 'warn');
                return true;
            }
        }
        return false;
    }

    // 点击确认按钮（在iframe内部）
    function clickConfirmButton(iframeDoc) {
        // bootbox 的确认按钮可能有多种形式
        var confirmButton = iframeDoc.querySelector('.btn[data-bb-handler="ok"], .btn[data-bb-handler="confirm"], .btn-primary[data-bb-handler]');
        if (confirmButton) {
            confirmButton.click();
            LogManager.log('最终确认按钮已点击，选课成功！', 'success');
            stopAllNotifications();
            return true;
        }
        return false;
    }

    // 点击复选框（不需要处理"已了解"模态框，直接提交即可）
    function clickCheckboxAndUnderstandModal(courseCode, fullCode, iframeDoc)  {
        var checkbox = iframeDoc.querySelector(
            `input[name="checkboxs"][kch="${courseCode}"]`
        );
        if (checkbox && !checkbox.disabled) {
            checkbox.click();
            LogManager.log(`已为课程 ${fullCode} 勾选复选框`, 'info');
        } else if (checkbox && checkbox.disabled) {
            LogManager.log(`课程 ${fullCode} 的复选框被禁用`, 'warn');
        } else {
            LogManager.log(`未找到课程 ${fullCode} 的复选框`, 'error');
        }
    }

    // 当前处理的 iframeDoc 引用
    let currentIframeDoc = null;

    // 提交选课
    function submit(iframeDoc) {
        currentIframeDoc = iframeDoc;
        if (clickSubmitButton(iframeDoc)) {
            hasSubmitted = true;
            setTimeout(() => {
                if (handleCaptcha(iframeDoc)) {
                    // 监听 iframe 内的键盘事件
                    iframeDoc.addEventListener('keydown', function(event) {
                        if (event.key === 'Enter') {
                            clickConfirmButton(iframeDoc);
                        }
                    });
                    // 也监听主页面的键盘事件
                    document.addEventListener('keydown', function(event) {
                        if (event.key === 'Enter' && currentIframeDoc) {
                            clickConfirmButton(currentIframeDoc);
                        }
                    });
                } else {
                    // 如果没有验证码，可能直接弹出成功/失败窗口
                    clickConfirmButton(iframeDoc);
                }
            }, 1000); // 等待一下，让验证码或结果对话框出现
        }
    }

    let currentIframe = null; // 保存 iframe 引用供 handleIframeLoaded 使用
    let currentSearchIndex = 0; // 当前搜索的课程号索引
    let checkedPages = 0; // 当前课程号已检查的页数
    let checkedCoursesForCurrentNum = []; // 当前课程号下已检查过的课序号（跨页累积）
    
    // 从愿望单中提取唯一的课程号列表（去重）
    function getUniqueCourseNumbers() {
        const courseNums = new Set();
        wishListCourses.forEach(c => {
            courseNums.add(c.split(' ')[0]);
        });
        return Array.from(courseNums);
    }
    
    const uniqueCourseNumbers = getUniqueCourseNumbers();

    // 搜索指定课程号
    function searchCourse(iframeDoc, courseNum) {
        const kchInput = iframeDoc.querySelector('input[name="kch"]');
        const submitBtn = iframeDoc.querySelector('button[name="submit"]');
        
        if (kchInput && submitBtn) {
            kchInput.value = courseNum;
            LogManager.log(`正在搜索课程号: ${courseNum}`, 'info');
            submitBtn.click();
            return true;
        }
        LogManager.log('未找到搜索表单', 'error');
        return false;
    }
    
    // 检查是否有下一页
    function hasNextPage(iframeDoc) {
        // 查找分页组件中的"下一页"按钮
        const pagination = iframeDoc.querySelector('.pagination');
        
        if (!pagination) {
            return null;
        }
        
        // 直接查找所有链接，找包含"下一页"文本的
        const allLinks = pagination.querySelectorAll('a');
        for (const link of allLinks) {
            const text = link.textContent.trim();
            if (text === '下一页' || text === 'Next' || text === '»') {
                const isDisabled = link.parentElement?.classList.contains('disabled') || 
                                  link.classList.contains('disabled') ||
                                  link.hasAttribute('disabled');
                if (!isDisabled) {
                    return link;
                }
            }
        }
        
        return null;
    }
    
    // 点击下一页
    function goToNextPage(iframeDoc) {
        const nextBtn = hasNextPage(iframeDoc);
        if (nextBtn) {
            nextBtn.click();
            return true;
        }
        return false;
    }

    // 清除搜索条件
    function clearSearch(iframeDoc) {
        const kchInput = iframeDoc.querySelector('input[name="kch"]');
        if (kchInput) {
            kchInput.value = '';
        }
    }

    function handleIframeLoaded(iframeDoc) {
    const courseTable = iframeDoc.querySelector(
        'table'
    );
    if (!courseTable) {
        LogManager.log('未找到课程表（iframe 内）', 'error');
        return;
    }

    // 使用 tr 而不是 tbody tr，因为HTML中可能没有明确的 tbody 标签
    const rows = courseTable.querySelectorAll('tr');
    let availableCourseCount = 0;
    let foundWishListCourses = [];

    rows.forEach((row, index) => {
        // 跳过表头行
        if (index === 0) return;
        if (row.textContent.includes('暂无课程')) return;

        const cells = row.cells;
        if (cells.length < 3) return;

        // 课程信息在第三列 (cells[2])，第一列是选择框，第二列是序号
        const courseInfo = extractCourseInfo(cells[2]);
        if (courseInfo && wishListCourses.includes(courseInfo.fullCode)) {
            const statusText = cells[0].textContent.trim();
            LogManager.log(
                `检查课程: ${courseInfo.fullCode}, 状态: ${statusText}`,
                'check'
            );
            foundWishListCourses.push(courseInfo.fullCode);

            if (!statusText.includes('无余量') && !statusText.includes('已选')) {
                LogManager.log(
                    `发现课程 ${courseInfo.fullCode} 有余量！`,
                    'success'
                );
                availableCourseCount++;

                if (!hasSubmitted) {
                    clickCheckboxAndUnderstandModal(
                        courseInfo.courseCode,
                        courseInfo.fullCode,
                        iframeDoc
                    );
                }
                startRepeatingNotification(courseInfo.fullCode);
            }
        }
    });

    // 有可选课程，立即提交
    if (availableCourseCount > 0 && !hasSubmitted) {
        LogManager.log(
            `共发现 ${availableCourseCount} 门可选课程，准备提交...`,
            'warn'
        );
        submit(iframeDoc);
        return;
    }
    
    // 获取当前课程号下，愿望单中还未检查到的课序号
    const currentCourseNum = uniqueCourseNumbers[currentSearchIndex];
    const wishListForCurrentCourse = wishListCourses.filter(c => c.startsWith(currentCourseNum + ' '));
    
    // 将当前页找到的课程累积到全局变量中
    foundWishListCourses.forEach(c => {
        if (!checkedCoursesForCurrentNum.includes(c)) {
            checkedCoursesForCurrentNum.push(c);
        }
    });
    
    // 计算还未检查到的课序号（使用累积的已检查列表）
    const uncheckedCourses = wishListForCurrentCourse.filter(c => !checkedCoursesForCurrentNum.includes(c));
    
    // 检查当前搜索结果是否有下一页，且还有未检查到的课序号
    const nextPageBtn = hasNextPage(iframeDoc);
    
    if (nextPageBtn && uncheckedCourses.length > 0) {
        // 还有愿望单课程没找到，检查下一页
        checkedPages++;
        LogManager.log(`还有 ${uncheckedCourses.length} 个课序号未找到，检查第 ${checkedPages + 1} 页...`, 'info');
        currentIframe.onload = () => {
            const doc = currentIframe.contentDocument || currentIframe.contentWindow.document;
            handleIframeLoaded(doc);
        };
        nextPageBtn.click();
        return;
    }
    
    // 当前课程号检查完毕（所有愿望单课程都已检查），搜索下一个课程号
    checkedPages = 0;
    currentSearchIndex++;
    
    if (currentSearchIndex < uniqueCourseNumbers.length) {
        LogManager.log(`课程号 ${uniqueCourseNumbers[currentSearchIndex - 1]} 无余量，搜索下一个...`, 'info');
        setTimeout(() => {
            searchNextCourse(iframeDoc);
        }, 500);
    } else {
        // 所有课程号都搜索完毕，重新开始
        LogManager.log('所有愿望单课程检查完毕，准备刷新重新检查...', 'info');
        currentSearchIndex = 0;
        if (!isPaused && currentIframe) {
            setTimeout(() => {
                // 使用 token 验证 iframe 是否真的刷新了
                const refreshToken = Math.random().toString(36).substring(2);
                try {
                    currentIframe.contentWindow.__refreshToken = refreshToken;
                } catch (e) {
                    LogManager.log('设置刷新 token 失败: ' + e.message, 'warn');
                }
                
                currentIframe.onload = () => {
                    // 验证 token 是否已被清除（说明 iframe 确实刷新了）
                    let isReallyRefreshed = false;
                    try {
                        isReallyRefreshed = currentIframe.contentWindow.__refreshToken !== refreshToken;
                    } catch (e) {
                        // 跨域情况下默认认为已刷新
                        isReallyRefreshed = true;
                    }
                    
                    if (isReallyRefreshed) {
                        LogManager.log('✓ iframe 确认已刷新（token 已重置）', 'success');
                    } else {
                        LogManager.log('⚠ iframe 可能未刷新（token 仍存在），强制继续...', 'warn');
                    }
                    
                    const doc = currentIframe.contentDocument || currentIframe.contentWindow.document;
                    searchNextCourse(doc);
                };
                currentIframe.contentWindow.location.reload();
                LogManager.log('正在刷新 iframe... (token: ' + refreshToken.substring(0, 6) + '...)', 'info');
            }, REFRESH_DELAY);
        }
    }
}

    // 搜索下一个课程号
    function searchNextCourse(iframeDoc) {
        if (currentSearchIndex >= uniqueCourseNumbers.length) {
            currentSearchIndex = 0;
        }
        const courseNumToSearch = uniqueCourseNumbers[currentSearchIndex];
        checkedPages = 0; // 重置已检查页数
        checkedCoursesForCurrentNum = []; // 重置已检查的课序号
        
        // 绑定 onload 事件以在搜索完成后处理结果
        currentIframe.onload = () => {
            const doc = currentIframe.contentDocument || currentIframe.contentWindow.document;
            handleIframeLoaded(doc);
        };
        
        searchCourse(iframeDoc, courseNumToSearch);
    }
    

    // 主要逻辑
    function main() {
        LogManager.log(`开始扫描愿望单课程: [${wishListCourses.join(', ')}]`, 'info');
        LogManager.log(`共 ${wishListCourses.length} 门课程，${uniqueCourseNumbers.length} 个不同课程号: [${uniqueCourseNumbers.join(', ')}]`, 'info');
        const iframe = document.querySelector('#current iframe');
        if (!iframe) {
            LogManager.log('未找到课程 iframe', 'error');
            return;
        }

        // 保存 iframe 引用供 handleIframeLoaded 使用
        currentIframe = iframe;

        // 确保 iframe 已经加载 src
        // 主页面使用 url 属性存储实际地址，通过点击 tab 时才设置 src
        if (!iframe.src && iframe.getAttribute('url')) {
            iframe.src = iframe.getAttribute('url');
        }
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        if (iframeDoc && iframeDoc.readyState === 'complete') {
            // 开始搜索第一个课程
            searchNextCourse(iframeDoc);
        } else {
            iframe.onload = () => {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                // 开始搜索第一个课程
                searchNextCourse(doc);
            };
        }
    }    
    // 页面卸载时清理所有通知
    window.addEventListener('beforeunload', () => {
        stopAllNotifications();
    });

    // 启动脚本
    // 使用 setTimeout 确保页面元素完全加载
    setTimeout(() => {
        LogManager.init(); // 初始化日志窗口
        main(); // 运行主逻辑
    }, 500);

})();