// ==UserScript==
// @name         BB酱帮你查课余量 (2026修复版)
// @namespace    http://58.87.70.160:8888/
// @version      4.4
// @description  【适配新版教务系统】原脚本“新海天帮你查课余量3.0”暂时失效，本脚本基于原版进行重构修复。支持Iframe穿透、智能防卡死、全屏扫描。
// @author       原作者: 上条当咩 | 修改: Tirpitz~your BB & Gemini
// @match        https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects/
// @icon         https://youke3.picui.cn/s1/2026/01/02/6957981e5f971.jpg
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561136/BB%E9%85%B1%E5%B8%AE%E4%BD%A0%E6%9F%A5%E8%AF%BE%E4%BD%99%E9%87%8F%20%282026%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561136/BB%E9%85%B1%E5%B8%AE%E4%BD%A0%E6%9F%A5%E8%AF%BE%E4%BD%99%E9%87%8F%20%282026%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------------------- 配置区 -------------------
    // 您的愿望单课程数组
// 【使用说明】：请在下方单引号内填写你要抢的课程号和序号
    var wishListCourses = [
        'A121078B 01',//示例课程1
        'A105006B 01',// 示例课程2
        'A121078B 02',//示例课程3
       // 'A101004B 01',
    ];

    // 刷新检测间隔（毫秒），建议 3000
    const REFRESH_DELAY = 3000;
    // ------------------- 配置区结束 -------------------


    // --- 全局状态变量 ---
    let hasSubmitted = false;
    let notificationIntervals = {};
    let isPaused = false;
    let refreshTimer = null;
    let targetDocument = document;

    // ------------------- 可视化日志窗口模块 (BB风格UI) -------------------
    const LogManager = {
        logWindow: null,
        logContent: null,
        showLogButton: null,
        init: function() {
            GM_addStyle(`
                #log-window-container { position: fixed; bottom: 20px; right: 20px; width: 450px; max-height: 350px; background-color: rgba(255, 240, 245, 0.98); border: 2px solid #ff69b4; border-radius: 12px; box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3); z-index: 9999; display: flex; flex-direction: column; font-family: 'Microsoft YaHei', sans-serif; font-size: 13px; transition: opacity 0.3s, transform 0.3s; }
                #log-window-container.hidden { opacity: 0; transform: scale(0.95); pointer-events: none; }
                #log-header { padding: 8px 12px; background: linear-gradient(90deg, #ffb6c1, #ff69b4); color: white; border-bottom: 1px solid #ff69b4; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none; border-top-left-radius: 10px; border-top-right-radius: 10px; }
                #log-header-title { font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.2); }
                #log-content { padding: 10px; overflow-y: auto; flex-grow: 1; color: #333; background-color: #fff0f5; }
                #log-content p { margin: 0 0 6px 0; padding: 0 0 4px 0; line-height: 1.5; border-bottom: 1px dashed #ffb6c1; word-break: break-all; }
                #log-content .log-success { color: #d02090; font-weight: bold; }
                #log-content .log-error { color: #dc3545; font-weight: bold; }
                #log-content .log-warn { color: #ff8c00; }
                #log-content .log-info { color: #8a2be2; }
                #log-content .log-check { color: #778899; }
                .log-controls button { margin-left: 8px; padding: 4px 8px; font-size: 12px; cursor: pointer; border: 1px solid #ff69b4; border-radius: 4px; background-color: #fff; color: #d02090; }
                .log-controls button:hover { background-color: #ffe4e1; }
                #show-log-button { position: fixed; bottom: 20px; right: 20px; z-index: 9998; display: none; padding: 8px 12px; cursor: pointer; background-color: #ff69b4; color: white; border: none; border-radius: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); font-weight: bold; }
                #show-log-button.visible { display: block; }
            `);
            document.body.insertAdjacentHTML('beforeend', `
                <div id="log-window-container">
                    <div id="log-header"><span id="log-header-title">❤️ BB Channel On Air ❤️</span><div class="log-controls"><button id="toggle-pause-btn">休息一下</button><button id="clear-log-btn">清屏</button><button id="hide-log-btn">隐藏</button></div></div><div id="log-content"></div>
                </div>
                <button id="show-log-button">呼叫BB酱</button>
            `);
            this.logWindow = document.getElementById('log-window-container');
            this.logContent = document.getElementById('log-content');
            this.showLogButton = document.getElementById('show-log-button');
            this.makeDraggable(document.getElementById('log-header'), this.logWindow);
            document.getElementById('toggle-pause-btn').addEventListener('click', this.togglePause);
            document.getElementById('clear-log-btn').addEventListener('click', () => this.logContent.innerHTML = '');
            document.getElementById('hide-log-btn').addEventListener('click', () => this.toggleVisibility(false));
            this.showLogButton.addEventListener('click', () => this.toggleVisibility(true));
            this.log('✨ BB Channel 启动！全自动列锁定系统已上线♥', 'success');
        },
        log: function(message, type = 'info') {
            if (!this.logContent) return;
            const time = new Date().toLocaleTimeString();
            const p = document.createElement('p');
            p.className = `log-${type}`;
            p.innerHTML = `[${time}] ${message}`;
            this.logContent.appendChild(p);
            this.logContent.scrollTop = this.logContent.scrollHeight;
            console.log(`[BB-Channel] ${message}`);
        },
        togglePause: function() {
            isPaused = !isPaused;
            const btn = document.getElementById('toggle-pause-btn');
            btn.textContent = isPaused ? '继续工作' : '休息一下';
            btn.style.color = isPaused ? '#dc3545' : '';

            if (isPaused) {
                if (refreshTimer) {
                    clearTimeout(refreshTimer);
                    refreshTimer = null;
                }
                LogManager.log(`💤 脚本暂停中...`, 'warn');
            } else {
                LogManager.log(`⚡ 脚本恢复工作！`, 'info');
                main();
            }
        },
        toggleVisibility: function(show) {
            if(show) { this.logWindow.classList.remove('hidden'); this.showLogButton.classList.remove('visible'); }
            else { this.logWindow.classList.add('hidden'); this.showLogButton.classList.add('visible'); }
        },
        makeDraggable: function(header, element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            header.onmousedown = e => { e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; }; document.onmousemove = e => { e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; element.style.top = (element.offsetTop - pos2) + "px"; element.style.left = (element.offsetLeft - pos1) + "px"; }; };
        }
    };

    // ------------------- 业务逻辑 -------------------

    function startRepeatingNotification(courseCode) {
        if (notificationIntervals[courseCode]) return;
        LogManager.log(`🚨 警报！${courseCode} 有余量！前辈快看！`, 'warn');
        notificationIntervals[courseCode] = setInterval(() => {
            GM_notification({
                title: '❤️ BB酱的紧急通知 ❤️',
                text: `课程 ${courseCode} 有余量了！`,
                timeout: 0,
                onclick: () => stopNotification(courseCode)
            });
        }, 500);
    }

    function stopNotification(courseCode) {
        if (notificationIntervals[courseCode]) {
            clearInterval(notificationIntervals[courseCode]);
            delete notificationIntervals[courseCode];
        }
    }

    function stopAllNotifications() {
        Object.keys(notificationIntervals).forEach(stopNotification);
    }

    // 【核心升级】不再依赖 cells[1]，而是直接在行内寻找 .ellipsis 元素
    // 这能完美兼容任何列数的表格，解决了“找不到”和“报两遍”的问题
    function extractCourseInfoFromRow(row) {
        // 寻找该行内任意位置的 class="ellipsis" 元素
        const ellipsisElement = row.querySelector('.ellipsis');
        if (!ellipsisElement) return null;

        const description = ellipsisElement.getAttribute('title');
        if (!description) return null;

        // 正则表达式：精准匹配 "AxxxxxB... 01"
        const regex = /([A-Z]\d{6}[A-Z]):.*?(\d{2})/;
        const match = description.match(regex);

        if (match) {
            return {
                courseCode: match[1],   // e.g. "A121078B"
                sectionNum: match[2],   // e.g. "01"
                fullCode: `${match[1]} ${match[2]}` // e.g. "A121078B 01"
            };
        }
        return null;
    }

    function processSelection(row, courseInfo) {
        const checkbox = row.querySelector('input[name="checkboxs"]');
        if (!checkbox) return;

        checkbox.click();
        LogManager.log(`✅ 已勾选目标: ${courseInfo.fullCode}`, 'success');

        let attempts = 0;
        const modalTimer = setInterval(() => {
            attempts++;
            let confirmBtn = document.querySelector('button[data-bb-handler="info"]');
            if (!confirmBtn && targetDocument) {
                confirmBtn = targetDocument.querySelector('button[data-bb-handler="info"]');
            }

            if (confirmBtn) {
                clearInterval(modalTimer);
                confirmBtn.click();
                LogManager.log('👊 弹窗已确认！', 'success');
                setTimeout(() => {
                    clickSubmit();
                }, 300);

            } else if (attempts > 20) {
                clearInterval(modalTimer);
                LogManager.log('👀 无弹窗，直接提交！', 'warn');
                clickSubmit();
            }
        }, 200);
    }

    function clickSubmit() {
        const submitBtn = targetDocument.querySelector('#select-submit-btn');
        if (submitBtn) {
            submitBtn.click();
            LogManager.log('🚀 已点击提交！请手动输入验证码！', 'success');
            hasSubmitted = true;
        } else {
            LogManager.log('❌ 找不到提交按钮！', 'error');
        }
    }

    function tryClickRefreshButton() {
        const queryBtn = targetDocument.querySelector('button[name="submit"]') ||
                         targetDocument.querySelector('.btn-success');
        if (!queryBtn) return false;

        const activePageEl = targetDocument.querySelector('.pagination .active a') ||
                             targetDocument.querySelector('.pagination li.active a');
        const currentPageNum = activePageEl ? activePageEl.textContent.trim() : null;

        const form = queryBtn.closest('form');
        if (form) {
            if (currentPageNum) {
                let pageInput = form.querySelector('input[name="page"]');
                if (!pageInput) {
                    pageInput = targetDocument.createElement('input');
                    pageInput.type = 'hidden';
                    pageInput.name = 'page';
                    form.appendChild(pageInput);
                }
                pageInput.value = currentPageNum;
            }

            // 注入随机时间戳 (破坏缓存)
            let timeInput = form.querySelector('input[name="_bb_timestamp"]');
            if (!timeInput) {
                timeInput = targetDocument.createElement('input');
                timeInput.type = 'hidden';
                timeInput.name = '_bb_timestamp';
                form.appendChild(timeInput);
            }
            timeInput.value = new Date().getTime();

            LogManager.log(`🔄 强制穿透刷新 (第${currentPageNum || 1}页)...`, 'info');
        } else {
             LogManager.log('🔄 普通刷新中...', 'info');
        }
        queryBtn.click();
        return true;
    }

    // 主程序
    function main() {
        if (isPaused) return;

        let courseTable = null;
        const iframe = document.querySelector('#current iframe');
        if (iframe) {
            try {
                const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (innerDoc) {
                    targetDocument = innerDoc;
                    courseTable = targetDocument.querySelector('#container table');
                }
            } catch (e) {
                LogManager.log('🚫 Iframe 访问受限', 'error');
            }
        } else {
            courseTable = document.querySelector('#current table');
            targetDocument = document;
        }

        if (!courseTable) {
            refreshTimer = setTimeout(main, 1000);
            return;
        }

        LogManager.log(`📋 正在监控欲望清单: [${wishListCourses.join(', ')}]`, 'check');

        const rows = courseTable.querySelectorAll('tbody tr');
        let availableCourseCount = 0;
        let foundWishListCourses = [];

        rows.forEach(row => {
            // 【改动点】调用新的行内提取函数
            const courseInfo = extractCourseInfoFromRow(row);

            // 如果提取到了，并且在愿望单里
            if (courseInfo && wishListCourses.includes(courseInfo.fullCode)) {
                foundWishListCourses.push(courseInfo.fullCode);

                const checkbox = row.querySelector('input[name="checkboxs"]');

                if (checkbox && !checkbox.disabled) {
                    LogManager.log(`✨ 发现目标 [${courseInfo.fullCode}]！`, 'success');
                    availableCourseCount++;

                    startRepeatingNotification(courseInfo.fullCode);

                    if (!hasSubmitted) {
                        processSelection(row, courseInfo);
                    }
                } else {
                    LogManager.log(`🔒 发现 [${courseInfo.fullCode}] 但暂无余量...`, 'check');
                }
            }
        });

        if (availableCourseCount === 0 && !hasSubmitted) {
            LogManager.log(`💨 暂无余量，准备执行强制刷新...`, 'info');

            refreshTimer = setTimeout(() => {
                if (isPaused) return;
                const refreshed = tryClickRefreshButton();
                if (!refreshed) {
                    LogManager.log('💢 按钮未找到，F5重置！', 'error');
                    location.reload();
                } else {
                    setTimeout(main, REFRESH_DELAY);
                }
            }, REFRESH_DELAY);
        }
    }

    window.addEventListener('beforeunload', () => {
        stopAllNotifications();
    });

    setTimeout(() => {
        LogManager.init();
        main();
    }, 500);

})();