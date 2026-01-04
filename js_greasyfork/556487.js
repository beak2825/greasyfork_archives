// ==UserScript==
// @name         南阳师范学院网视频助手
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  县域高中教师全员全学科网络研修项目学习平台刷课助手，自动播放视频、自动连播下一课程、自动恢复播放。
// @author       woshishabidouyourenqiang
// @match        *://nysy.shuzijiaoshi.com/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/556487/%E5%8D%97%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E7%BD%91%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556487/%E5%8D%97%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E7%BD%91%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置参数
    const config = {
        autoPlaySpeed: 1, // 默认播放倍速
        autoStartCourse: false, // 是否自动开始课程
        autoAnswer: true, // 是否自动回答问题
        autoNext: true, // 是否自动播放下一课程
        autoResume: true, // 是否自动恢复播放
        checkInterval: 2000, // 检查间隔(毫秒)
        resumeDelay: 1000, // 暂停后多久自动恢复(毫秒)
        nextVideoDelay: 3000, // 视频结束后多久播放下一课程(毫秒)
        personalCenterUrl: 'https://nysy.shuzijiaoshi.com/PersonalCenter',// 个人中心地址
        switchUrl: 'https://video.edueva.org/studyduration', // 切换课程提醒页面地址
        courseUrl: 'https://nysy.shuzijiaoshi.com/PrjStudent?prjId=9806a871450c4d25b051b37300aadb95&memberType=0&wgId=e6262c213c624b53a5e1b38800b57344',// 课程地址
        courseUrlPrefix: 'https://nysy.shuzijiaoshi.com/PrjStudent'// 课程地址前缀
    };

    // =====================阻止网站弹窗开始=========================
    // 方法1: 重写 beforeunload 事件处理
    const originalBeforeUnload = window.onbeforeunload;
    window.onbeforeunload = null;

    // 方法2: 拦截 addEventListener 调用
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'beforeunload') {
            console.log('[油猴脚本] 拦截到 beforeunload 事件监听器添加，已阻止。');
            return; // 不添加 beforeunload 事件监听器
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // 方法3: 定期检查并移除 beforeunload 事件监听器
    function removeBeforeUnloadListeners() {
        const events = $._data(window, "events");
        if (events && events.beforeunload) {
            delete events.beforeunload;
            console.log('[油猴脚本] 已移除 beforeunload 事件监听器');
        }
    }
    // 定期检查并移除 beforeunload 事件监听器
    setInterval(removeBeforeUnloadListeners, 1000);

    // 方法4: 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        removeBeforeUnloadListeners();
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
    // =====================阻止网站弹窗结束=========================

    // =====================监听页面路径变化开始==========================
    // 监听浏览器历史记录的变化（适用于使用pushState或replaceState改变路径的情况）
    // window.addEventListener('popstate', function(event) {
    //     var newPath = window.location.pathname;
    //     console.log('路径变化到: ' + newPath);
    // });
    // =====================监听页面路径变化结束==========================

    // 添加简化样式
    GM_addStyle(`
        .speed-control-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 15px;
            border-radius: 8px;
            width: 220px;
            font-family: Arial, sans-serif;
        }
        .speed-control-panel h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #40b768;
        }
        .toggle-panel {
            position: fixed;
            top: 20px;
            right: 250px;
            z-index: 10001;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .speed-control-panel.hidden {
            display: none;
        }
        .toggle-panel.panel-hidden {
            right: 20px;
        }
        .auto-controls {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        .checkbox-wrapper {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        .checkbox-wrapper input {
            margin-right: 8px;
        }
        .checkbox-wrapper label {
            font-size: 12px;
            cursor: pointer;
        }
        .resume-delay-control {
            display: none;
            margin-top: 8px;
        }
        .resume-delay-control.show {
            display: block;
        }
        .resume-delay-input {
            width: 60px;
            padding: 3px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            border-radius: 3px;
            margin-left: 5px;
            text-align: center;
        }
        .status-display {
            font-size: 11px;
            color: #888;
            margin-top: 5px;
            padding: 5px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            max-height: 60px;
            overflow-y: auto;
        }
    `);

    let panelVisible = true;
    
    // 创建控制面板
    function createControlPanel() {
        // 创建切换按钮
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'toggle-panel';
        toggleBtn.innerHTML = '⚡ 视频助手';
        toggleBtn.onclick = togglePanel;
        document.body.appendChild(toggleBtn);

        // 创建控制面板
        const panel = document.createElement('div');
        panel.className = 'speed-control-panel';
        panel.id = 'speedControlPanel';

        panel.innerHTML = `
            <h3>视频助手控制面板</h3>

            <div class="auto-controls">
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="autoAnswerCheck" ${config.autoAnswer ? 'checked' : ''}>
                    <label for="autoAnswerCheck">自动回答问题</label>
                </div>
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="autoNextCheck" ${config.autoNext ? 'checked' : ''}>
                    <label for="autoNextCheck">自动连播下一课程</label>
                </div>
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="autoResumeCheck" ${config.autoResume ? 'checked' : ''}>
                    <label for="autoResumeCheck">自动恢复播放</label>
                </div>
                <div class="status-display" id="statusDisplay">
                    视频状态: 等待检测...
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        const autoAnswerCheck = document.getElementById('autoAnswerCheck');
        const autoNextCheck = document.getElementById('autoNextCheck');
        const autoResumeCheck = document.getElementById('autoResumeCheck');
        const resumeDelayControl = document.getElementById('resumeDelayControl');
        const statusDisplay = document.getElementById('statusDisplay');

        // 自动回答问题开关
        autoAnswerCheck.addEventListener('change', function () {
            config.autoAnswer = this.checked;
            updateStatus('自动回答问题: ' + (this.checked ? '已启用' : '已禁用'));
        });

        // 自动连播开关
        autoNextCheck.addEventListener('change', function () {
            config.autoNext = this.checked;
            updateStatus('自动连播: ' + (this.checked ? '已启用' : '已禁用'));
        });

        // 自动恢复播放开关
        autoResumeCheck.addEventListener('change', function () {
            config.autoResume = this.checked;
            if (this.checked) {
                resumeDelayControl.classList.add('show');
                updateStatus('自动恢复播放: 已启用');
            } else {
                resumeDelayControl.classList.remove('show');
                updateStatus('自动恢复播放: 已禁用');
            }
        });

        // 更新状态显示
        function updateStatus(message) {
            if (statusDisplay) {
                statusDisplay.textContent = message;
            }
        }

        // 暴露更新状态函数
        window.updateStatus = updateStatus;
    }

    // 切换面板显示/隐藏
    function togglePanel() {
        const panel = document.getElementById('speedControlPanel');
        const toggleBtn = document.querySelector('.toggle-panel');

        if (panelVisible) {
            panel.classList.add('hidden');
            toggleBtn.classList.add('panel-hidden');
        } else {
            panel.classList.remove('hidden');
            toggleBtn.classList.remove('panel-hidden');
        }
        panelVisible = !panelVisible;
    }


    // 自动播放下一课程
    function autoPlayNextCourse() {
        // 进入个人中心
        if (window.location.href.includes(config.personalCenterUrl)) {
            const a = document.querySelector("a.prjbtns_btn01");
            a.removeAttribute('target');
            a.click();
            return;
        }
        // 进入课程页面
        if (window.location.href.includes(config.courseUrlPrefix)){
            console.log('已进入课程列表');
            window.updateStatus('已进入课程列表');
            const lessonList = document.querySelector("#watchcourseTable > tbody")
            if (!lessonList) return;
            // 查找未完成的课时
            const allLessons = lessonList.querySelectorAll('.studyBegin')
            for (let lesson of allLessons) {
                const textContent = lesson.textContent;
                if (textContent !== '已完成') {
                    lesson.click();
                    console.log('已进入下一课程');
                    window.updateStatus('已进入下一课程');
                    setTimeout(() => {
                        // 点击开始学习按钮
                        const a = document.querySelector("#Div_CourseProgress > table > tbody > tr:nth-child(2) > td:nth-child(4) > a");
                        const href = a.href;
                        window.location.href = href;
                    }, 1000);
                    return;
                }
            }
            // 当前页课程已经播放完毕, 尝试跳转到第二页
            const buttonNext = document.querySelector("#divStages > div:nth-child(2)");
            if (!buttonNext) return;
            // 第二页选中并且第一页未选中
            const buttonFirst = document.querySelector("#divStages > div:nth-child(1)");
            if (buttonNext.classList.contains('content_current') && !buttonFirst.classList.contains('content_current')) return;
            buttonNext.click();
            console.log('跳转到第二页');
            window.updateStatus('跳转到第二页');
        }
    }

    // 主函数
    function main() {
        console.log('南阳师范学院网视频助手已启动');

        createControlPanel();

        // 定期检查
        setInterval(() => {
            autoPlayNextCourse();
        }, config.checkInterval);
    }



    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();