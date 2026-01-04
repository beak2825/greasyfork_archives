// ==UserScript==
// @name         重庆公需课自动学习（带日志与倍速切换）
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自动播放、倍速、静音、自动选章节、带可视化日志与倍速切换按钮
// @author       ChatGPT
// @match        https://cqrl.21tb.com/nms-frontend*
// @match        https://cqrl.21tb.com/els/html/courseStudyItem*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555601/%E9%87%8D%E5%BA%86%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%EF%BC%88%E5%B8%A6%E6%97%A5%E5%BF%97%E4%B8%8E%E5%80%8D%E9%80%9F%E5%88%87%E6%8D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555601/%E9%87%8D%E5%BA%86%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%EF%BC%88%E5%B8%A6%E6%97%A5%E5%BF%97%E4%B8%8E%E5%80%8D%E9%80%9F%E5%88%87%E6%8D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** ===============================
     *  日志面板系统 + 倍速控制按钮
     * ===============================*/
    const LogPanel = (() => {
        let panel, logContainer, toggleBtn, isCollapsed = false;
        let speedBtns, currentSpeed = GM_getValue('playbackSpeed', 8);

        const createPanel = () => {
            panel = document.createElement('div');
            panel.id = 'logPanel';
            panel.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 340px;
                height: 260px;
                background: rgba(0,0,0,0.8);
                color: #0f0;
                font-size: 13px;
                font-family: monospace;
                z-index: 999999;
                border: 1px solid #0f0;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 0 10px #0f0;
            `;

            const header = document.createElement('div');
            header.innerHTML = '📘 公需课脚本日志';
            header.style.cssText = `
                background: rgba(0,255,0,0.2);
                padding: 4px;
                text-align: center;
                font-weight: bold;
                cursor: move;
            `;
            panel.appendChild(header);

            // 倍速控制区
            const controlBar = document.createElement('div');
            controlBar.style.cssText = `
                display: flex;
                justify-content: space-around;
                background: rgba(0,255,0,0.1);
                padding: 4px 0;
            `;

            const speeds = [3, 5, 8, 16];
            speedBtns = speeds.map(spd => {
                const btn = document.createElement('button');
                btn.innerText = `${spd}x`;
                btn.style.cssText = `
                    background: ${spd === currentSpeed ? '#0f0' : 'transparent'};
                    color: ${spd === currentSpeed ? 'black' : '#0f0'};
                    border: 1px solid #0f0;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 50px;
                    font-weight: bold;
                `;
                btn.onclick = () => {
                    currentSpeed = spd;
                    GM_setValue('playbackSpeed', spd);
                    updateSpeedButtons();
                    applySpeedToAllVideos(spd);
                    addLog(`⚙️ 已切换倍速为 ${spd}x`);
                };
                controlBar.appendChild(btn);
                return btn;
            });
            panel.appendChild(controlBar);

            // 日志显示区
            logContainer = document.createElement('div');
            logContainer.style.cssText = `
                flex: 1;
                overflow-y: auto;
                padding: 5px;
                white-space: pre-wrap;
            `;
            panel.appendChild(logContainer);

            // 收起按钮
            toggleBtn = document.createElement('button');
            toggleBtn.innerText = '收起';
            toggleBtn.style.cssText = `
                background: #0f0;
                color: black;
                border: none;
                border-top: 1px solid #0f0;
                cursor: pointer;
                padding: 3px;
            `;
            toggleBtn.onclick = () => {
                isCollapsed = !isCollapsed;
                logContainer.style.display = isCollapsed ? 'none' : 'block';
                controlBar.style.display = isCollapsed ? 'none' : 'flex';
                toggleBtn.innerText = isCollapsed ? '展开' : '收起';
                panel.style.height = isCollapsed ? '40px' : '260px';
            };
            panel.appendChild(toggleBtn);

            document.body.appendChild(panel);
            makeDraggable(panel, header);
        };

        const updateSpeedButtons = () => {
            speedBtns.forEach(btn => {
                const spd = parseFloat(btn.innerText);
                const active = spd === currentSpeed;
                btn.style.background = active ? '#0f0' : 'transparent';
                btn.style.color = active ? 'black' : '#0f0';
            });
        };

        const makeDraggable = (element, handle) => {
            let offsetX, offsetY, isDragging = false;

            handle.addEventListener('mousedown', e => {
                isDragging = true;
                offsetX = e.clientX - element.offsetLeft;
                offsetY = e.clientY - element.offsetTop;
                handle.style.cursor = 'grabbing';
            });
            document.addEventListener('mousemove', e => {
                if (isDragging) {
                    element.style.left = `${e.clientX - offsetX}px`;
                    element.style.top = `${e.clientY - offsetY}px`;
                    element.style.bottom = 'auto';
                    element.style.right = 'auto';
                }
            });
            document.addEventListener('mouseup', () => {
                isDragging = false;
                handle.style.cursor = 'move';
            });
        };

        const addLog = (msg) => {
            const time = new Date().toLocaleTimeString();
            const text = `[${time}] ${msg}`;
            console.log(`📘 公需课脚本`, msg);
            if (logContainer) {
                const div = document.createElement('div');
                div.textContent = text;
                logContainer.appendChild(div);
                logContainer.scrollTop = logContainer.scrollHeight;
            }
        };

        const applySpeedToAllVideos = (spd) => {
            const videos = document.querySelectorAll('video');
            videos.forEach(v => v.playbackRate = spd);
        };

        createPanel();
        return { addLog, applySpeedToAllVideos, get currentSpeed() { return currentSpeed; } };
    })();

    const log = (...args) => LogPanel.addLog(args.join(' '));
    const wait = (t) => new Promise(res => setTimeout(res, t));

    /** ===============================
     *  核心逻辑
     * ===============================*/

    function isVideoPlaying(video) {
        return video && !video.paused && !video.ended && video.currentTime > 0;
    }

    function checkCourseOccupied() {
        const p = document.querySelector('p');
        if (p && p.textContent.includes('当前已有课程正在学习中')) {
            log('⚠️ 检测到“课程占用”提示，10秒后关闭页面');
            GM_setValue('courseStudyItemFinished', true);
            setTimeout(() => window.close(), 10000);
        }
    }

    async function checkVideo(iframe_doc) {
        try {
            const video = iframe_doc.querySelector('video');
            if (!video) return log('❌ 未检测到视频元素');

            video.muted = true;
            const speed = LogPanel.currentSpeed;
            if (video.playbackRate !== speed) {
                video.playbackRate = speed;
                log(`⚙️ 倍速设置为 ${speed}x`);
            }

            if (video.paused) {
                try {
                    const result = video.play();
                    if (result && typeof result.then === 'function') {
                        await result;
                    }
                    log('▶️ 视频播放中...');
                } catch (e) {
                    log('⚠️ 无法播放视频：', e);
                }
            }

            if (!isVideoPlaying(video)) {
                log('⚠️ 视频暂停，尝试重新播放');
                video.play().catch(() => {});
            }

            GM_setValue('oldTime', video.currentTime);
        } catch (err) {
            log('❌ 视频检测错误：', err);
        }
    }

    function autoSelectUnfinishedSection(iframe_doc) {
        const allSections = iframe_doc.querySelectorAll('.section-item');
        if (!allSections || allSections.length === 0) {
            log('⚠️ 未找到章节列表');
            return;
        }

        const unfinished = Array.from(allSections).find(el => !el.classList.contains('finish'));
        if (unfinished) {
            const title = unfinished.querySelector('.section-title')?.textContent?.trim() || '未知课程';
            log(`🎯 发现未完成章节：《${title}》，准备点击`);
            unfinished.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => unfinished.click(), 1000);
        } else {
            log('🏁 所有章节完成，准备关闭页面');
            GM_setValue('courseStudyItemFinished', true);
            setTimeout(() => window.close(), 5000);
        }
    }

    async function runStudyPage() {
        log('📖 进入课程学习页面');
        GM_setValue('courseStudyItemFinished', false);

        let iframe = null;
        for (let i = 0; i < 20; i++) {
            iframe = document.querySelector('iframe');
            if (iframe && iframe.contentWindow?.document.querySelector('video')) break;
            log('⌛ 等待课程 iframe 加载...');
            await wait(1000);
        }
        if (!iframe) return log('❌ 未检测到课程 iframe');

        const iframe_doc = iframe.contentWindow.document;
        log('✅ iframe 就绪，开始检测视频与章节');

        setInterval(async () => {
            checkCourseOccupied();
            await checkVideo(iframe_doc);

            const active = iframe_doc.querySelector('.section-item .first-line.active');
            const activeParent = active?.closest('.section-item');
            if (activeParent && activeParent.classList.contains('finish')) {
                log('🎉 当前章节已完成，自动切换下一节');
                autoSelectUnfinishedSection(iframe_doc);
            }
        }, 5000);
    }

    async function runCourseListPage() {
        log('📚 进入课程列表页面');
        GM_setValue('courseStudyItemFinished', false);
        setInterval(() => {
            if (GM_getValue('courseStudyItemFinished')) {
                log('🔁 检测到学习完成标志，刷新页面');
                location.reload();
            }
        }, 15000);
    }

    (async function init() {
        const url = location.href;
        if (url.includes('/els/html/courseStudyItem')) {
            await runStudyPage();
        } else if (url.includes('/nms-frontend/index.html#/org/courseDetail')) {
            await runCourseListPage();
        } else {
            log('❌ 非课程页面，脚本未执行');
        }
    })();
})();
