// ==UserScript==
// @name         学习通视频自动播放助手滁院专属，小出生福利嗷嗷嗷，（仅悬浮视频版，后续解题。。。有时间再说）
// @namespace    https://github.com/your-github-username/chaoxing-helper
// @version      2.2
// @description  自动播放学习通视频、自动切换章节，悬浮窗实时显示进度、章节和预计总时长，适配所有学习通课程。
// @author       VA1
// @match        https://mooc1.chaoxing.com/mooc-ans/mycourse/studentstudy*
// @match        https://mooc1.chaoxing.com/ananas/modules/work/index.html*
// @match        https://mooc1.chaoxing.com/mooc-ans/api/work*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552238/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B%E6%BB%81%E9%99%A2%E4%B8%93%E5%B1%9E%EF%BC%8C%E5%B0%8F%E5%87%BA%E7%94%9F%E7%A6%8F%E5%88%A9%E5%97%B7%E5%97%B7%E5%97%B7%EF%BC%8C%EF%BC%88%E4%BB%85%E6%82%AC%E6%B5%AE%E8%A7%86%E9%A2%91%E7%89%88%EF%BC%8C%E5%90%8E%E7%BB%AD%E8%A7%A3%E9%A2%98%E3%80%82%E3%80%82%E3%80%82%E6%9C%89%E6%97%B6%E9%97%B4%E5%86%8D%E8%AF%B4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552238/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B%E6%BB%81%E9%99%A2%E4%B8%93%E5%B1%9E%EF%BC%8C%E5%B0%8F%E5%87%BA%E7%94%9F%E7%A6%8F%E5%88%A9%E5%97%B7%E5%97%B7%E5%97%B7%EF%BC%8C%EF%BC%88%E4%BB%85%E6%82%AC%E6%B5%AE%E8%A7%86%E9%A2%91%E7%89%88%EF%BC%8C%E5%90%8E%E7%BB%AD%E8%A7%A3%E9%A2%98%E3%80%82%E3%80%82%E3%80%82%E6%9C%89%E6%97%B6%E9%97%B4%E5%86%8D%E8%AF%B4%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------- 配置参数 ----------------------
    const CONFIG = {
        targetPlaybackRate: 1.0, // 固定播放倍速（1.0为原速）
        floatPanel: {
            defaultWidth: 450,    // 悬浮窗默认宽度
            defaultHeight: 250,   // 悬浮窗默认高度
            minWidth: 300,        // 悬浮窗最小宽度
            minHeight: 180,       // 悬浮窗最小高度
        },
        timing: {
            updateInterval: 1000, // 悬浮窗内容更新间隔（毫秒）
            initDelay: 2000,      // 页面加载后初始化延迟（毫秒）
            nextChapterDelay: 3000 // 切换章节后重新初始化延迟（毫秒）
        }
    };

    // ---------------------- 全局状态 ----------------------
    let videoStatus = "初始化中..."; // 脚本运行状态
    let currentVideo = null;         // 当前视频元素
    let floatPanel = null;           // 悬浮窗对象（包含panel和content）
    let isUserInteracted = false;    // 用户是否已与页面交互（解决自动播放限制）
    let totalChapters = 0;           // 课程总章节数
    let currentChapterIndex = 0;     // 当前章节索引（从0开始）
    let estimatedTotalTime = "计算中..."; // 预计总学习时长


    // ---------------------- 工具函数 ----------------------

    /**
     * 格式化秒数为 分:秒 或 小时:分:秒
     * @param {number} seconds - 总秒数
     * @returns {string} 格式化后的时间字符串
     */
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return hours > 0
            ? `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            : `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * 递归查找多层iframe中的视频元素
     * @param {NodeList} iframes - iframe节点列表
     * @returns {HTMLVideoElement|null} 找到的视频元素，无则返回null
     */
    function findVideoInNestedIframes(iframes) {
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                // 检查当前iframe内的视频
                let video = iframeDoc.querySelector('video');
                if (video) return video;
                // 递归检查嵌套的iframe
                const nestedIframes = iframeDoc.querySelectorAll('iframe');
                if (nestedIframes.length) {
                    video = findVideoInNestedIframes(nestedIframes);
                    if (video) return video;
                }
            } catch (e) {
                console.log('跨域iframe，跳过访问：', e.message);
            }
        }
        return null;
    }


    // ---------------------- 悬浮窗相关 ----------------------

    /**
     * 创建可拖动、缩放的悬浮窗（仅主页面执行）
     * @returns {object|null} 包含panel和content的对象，非主页面返回null
     */
    function createDraggableFloatPanel() {
        if (!isMainPage()) return null;

        // 移除已存在的悬浮窗，避免重复创建
        const existingPanel = document.getElementById('chaoxing-video-helper-panel');
        if (existingPanel) existingPanel.remove();

        // 创建悬浮窗容器
        const panel = document.createElement('div');
        panel.id = 'chaoxing-video-helper-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0;
            border-radius: 6px;
            font-size: 14px;
            z-index: 999999;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            width: ${CONFIG.floatPanel.defaultWidth}px;
            height: ${CONFIG.floatPanel.defaultHeight}px;
            user-select: none;
            overflow: hidden;
            resize: none;
        `;

        // 标题栏（拖动区域 + 缩放按钮）
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.5);
            cursor: move;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span>垃圾学习通视频助手（我写的这个就是一个垃圾脚本，rubbish）</span>
            <div style="display: flex; gap: 8px;">
                <button class="scale-btn" data-scale="0.8" style="width: 20px; height: 20px; line-height: 16px; padding: 0; background: #555; border: none; border-radius: 3px; color: white; cursor: pointer;">-</button>
                <button class="scale-btn" data-scale="1.0" style="width: 20px; height: 20px; line-height: 16px; padding: 0; background: #555; border: none; border-radius: 3px; color: white; cursor: pointer;">1x</button>
                <button class="scale-btn" data-scale="1.2" style="width: 20px; height: 20px; line-height: 16px; padding: 0; background: #555; border: none; border-radius: 3px; color: white; cursor: pointer;">+</button>
            </div>
        `;

        // 内容区域（分上下两部分展示信息）
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 10px 12px;
            height: calc(100% - 40px);
            overflow: auto;
        `;

        // 右下角调整大小的拖拽柄
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 15px;
            height: 15px;
            background: rgba(255, 255, 255, 0.5);
            cursor: nwse-resize;
            border-bottom-right-radius: 6px;
        `;

        panel.appendChild(header);
        panel.appendChild(content);
        panel.appendChild(resizeHandle);
        document.body.appendChild(panel);

        // 缩放按钮功能
        header.querySelectorAll('.scale-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const scale = parseFloat(btn.dataset.scale);
                panel.style.width = `${CONFIG.floatPanel.defaultWidth * scale}px`;
                panel.style.height = `${CONFIG.floatPanel.defaultHeight * scale}px`;
                panel.style.fontSize = `${14 * scale}px`;
            });
        });

        // 拖拽移动逻辑
        let isDragging = false;
        let startPos = { x: 0, y: 0, top: 0, left: 0 };
        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('scale-btn')) return;
            isDragging = true;
            startPos = {
                x: e.clientX,
                y: e.clientY,
                top: panel.offsetTop,
                left: panel.offsetLeft,
            };
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.top = `${startPos.top + (e.clientY - startPos.y)}px`;
            panel.style.left = `${startPos.left + (e.clientX - startPos.x)}px`;
        }, { passive: false });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // 调整大小逻辑
        let isResizing = false;
        let startSize = { width: 0, height: 0, x: 0, y: 0 };
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startSize = {
                width: panel.offsetWidth,
                height: panel.offsetHeight,
                x: e.clientX,
                y: e.clientY,
            };
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const newWidth = Math.max(CONFIG.floatPanel.minWidth, startSize.width + (e.clientX - startSize.x));
            const newHeight = Math.max(CONFIG.floatPanel.minHeight, startSize.height + (e.clientY - startSize.y));
            panel.style.width = `${newWidth}px`;
            panel.style.height = `${newHeight}px`;
        }, { passive: false });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });

        return { panel, content };
    }

    /**
     * 更新悬浮窗内容（课程、进度、状态等）
     */
    function updateFloatPanelContent() {
        if (!floatPanel || !floatPanel.content) return;
        const { content } = floatPanel;

        // 初始化内容结构（仅首次执行）
        if (!content.dataset.initialized) {
            content.innerHTML = `
                <div class="top-section" style="margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2);"></div>
                <div class="bottom-section" style="font-size: 13px; line-height: 1.6;"></div>
            `;
            content.dataset.initialized = 'true';
        }

        const topSection = content.querySelector('.top-section');
        const bottomSection = content.querySelector('.bottom-section');

        // 获取课程名称
        let courseName = "未知课程";
        const courseTitleSelectors = ['.course-title', '.chapter-title', 'h1', '.work-title', '.ans-title'];
        for (const selector of courseTitleSelectors) {
            const elem = document.querySelector(selector);
            if (elem && elem.textContent.trim()) {
                courseName = elem.textContent.trim().slice(0, 25); // 限制长度避免换行
                break;
            }
        }

        // 章节信息
        const chapterInfoText = totalChapters
            ? `章节：${currentChapterIndex + 1}/${totalChapters}`
            : "章节：加载中...";

        // 计算预计总时长（当前章节时长 × 总章节数）
        if (currentVideo && totalChapters > 0) {
            const chapterDuration = currentVideo.duration || 0;
            const totalSeconds = Math.floor(chapterDuration * totalChapters);
            estimatedTotalTime = formatTime(totalSeconds);
        }

        // 上方：基础信息（课程、章节、倍速）
        topSection.innerHTML = `
            <div>课程：${courseName}</div>
            <div>${chapterInfoText}</div>
            <div>倍速：${currentVideo ? currentVideo.playbackRate + "x（固定）" : "1x（固定）"}</div>
        `;

        // 下方：详细进度与状态
        if (!currentVideo) {
            bottomSection.innerHTML = `
                <div>当前进度：未加载视频</div>
                <div>预计总时长：${estimatedTotalTime}</div>
                <div>脚本状态：${videoStatus}</div>
            `;
        } else {
            const currentTime = formatTime(currentVideo.currentTime);
            const totalTime = formatTime(currentVideo.duration || 0);
            const progress = currentVideo.duration
                ? Math.floor((currentVideo.currentTime / currentVideo.duration) * 100)
                : 0;

            bottomSection.innerHTML = `
                <div>当前进度：${currentTime} / ${totalTime}（${progress}%）</div>
                <div>本章剩余：${formatTime((currentVideo.duration || 0) - currentVideo.currentTime)}</div>
                <div>预计总时长：${estimatedTotalTime}</div>
                <div>脚本状态：${videoStatus}</div>
            `;
        }
    }

    /**
     * 更新脚本状态并刷新悬浮窗
     * @param {string} status - 新状态文本
     */
    function updateStatus(status) {
        videoStatus = status;
        updateFloatPanelContent();
    }


    // ---------------------- 章节与视频逻辑 ----------------------

    /**
     * 获取章节信息（当前章节索引 + 总章节数）
     * @returns {object} { currentIndex: 当前章节索引, total: 总章节数 }
     */
    function getChapterInformation() {
        // 学习通左侧章节列表的常见选择器（可根据页面更新扩展）
        const chapterSelectors = ['.chapter-item', '.ans-job-icon', '.ncells', '.chapter-unit'];
        let total = 0;
        let currentIndex = 0;

        for (const selector of chapterSelectors) {
            const chapterElements = document.querySelectorAll(selector);
            if (chapterElements.length) {
                total = chapterElements.length;
                // 查找“当前激活”的章节（含active类或播放标识）
                for (let i = 0; i < chapterElements.length; i++) {
                    if (chapterElements[i].classList.contains('active') ||
                        chapterElements[i].classList.contains('current') ||
                        chapterElements[i].querySelector('.iconfont.icon-playing')) {
                        currentIndex = i;
                        break;
                    }
                }
                break; // 找到后停止遍历选择器
            }
        }

        console.log(`章节信息：第 ${currentIndex + 1}/${total} 章`);
        return { currentIndex, total };
    }

    /**
     * 自动切换到下一章
     * @param {object} chapterInfo - 章节信息（currentIndex, total）
     * @returns {boolean} 是否成功切换
     */
    function switchToNextChapter(chapterInfo) {
        if (chapterInfo.currentIndex + 1 >= chapterInfo.total) {
            updateStatus("所有章节已播放完毕！");
            return false;
        }

        updateStatus("当前章节播放完毕，正在进入下一章...");

        // 下一章按钮的常见选择器（可根据页面更新扩展）
        const nextBtnSelectors = ['.nextChapter', '.ans-next', '.chapter-next', '.icon-arrright', '.next-unit'];
        let nextBtn = null;

        for (const selector of nextBtnSelectors) {
            nextBtn = document.querySelector(selector);
            if (nextBtn) break;
        }

        if (nextBtn) {
            nextBtn.click();
            console.log('已点击下一章按钮');
            setTimeout(initVideoPlayback, CONFIG.timing.nextChapterDelay);
            return true;
        } else {
            updateStatus("未找到下一章按钮，请手动切换");
            return false;
        }
    }

    /**
     * 初始化视频播放逻辑（查找视频、设置播放、监听结束事件）
     */
    function initVideoPlayback() {
        const chapterInfo = getChapterInformation();
        totalChapters = chapterInfo.total;
        currentChapterIndex = chapterInfo.currentIndex;

        // 查找视频元素（优先当前页面，再递归查找iframe内）
        let video = document.querySelector('video');
        if (!video) {
            const iframes = document.querySelectorAll('iframe');
            video = findVideoInNestedIframes(iframes);
        }

        if (!video) {
            updateStatus("未找到视频元素，2秒后重试...");
            setTimeout(initVideoPlayback, 2000);
            return;
        }

        currentVideo = video;

        // 监听视频结束事件，自动切换下一章
        video.addEventListener('ended', () => {
            updateStatus("当前视频播放完毕");
            switchToNextChapter(chapterInfo);
        }, { once: true });

        // 尝试播放视频（需用户先与页面交互一次）
        const attemptPlayVideo = () => {
            if (!video.paused) return;

            video.play().then(() => {
                updateStatus("视频自动播放中");
                video.playbackRate = CONFIG.targetPlaybackRate;
            }).catch(err => {
                // 尝试点击页面内的播放按钮
                const playButtons = document.querySelectorAll(
                    '.vjs-big-play-button, .playButton, .startPlay, .ans-video-btn, .icon-play'
                );
                playButtons.forEach(btn => {
                    if (btn.offsetParent !== null) btn.click();
                });
                updateStatus("已自动点击播放按钮");
            });
        };

        if (isUserInteracted) {
            attemptPlayVideo();
        } else {
            updateStatus("等待用户首次点击页面（任意位置）...");
            const handleInteraction = () => {
                isUserInteracted = true;
                updateStatus("用户已交互，开始自动播放");
                attemptPlayVideo();
                document.removeEventListener('click', handleInteraction);
                document.removeEventListener('touchstart', handleInteraction);
            };
            document.addEventListener('click', handleInteraction);
            document.addEventListener('touchstart', handleInteraction);
        }

        updateFloatPanelContent();
    }


    // ---------------------- 页面初始化 ----------------------

    /**
     * 判断是否为学习通“主课程页面”
     * @returns {boolean} true = 主页面，false = iframe或其他页面
     */
    function isMainPage() {
        return window.location.href.includes('studentstudy');
    }

    // 页面加载完成后初始化（延迟确保资源加载）
    window.addEventListener('load', () => {
        if (isMainPage()) {
            setTimeout(() => {
                console.log('学习通视频助手：页面加载完成，开始初始化');
                floatPanel = createDraggableFloatPanel();
                if (floatPanel) {
                    updateFloatPanelContent();
                    initVideoPlayback();
                    // 定时更新悬浮窗内容（保持实时）
                    setInterval(updateFloatPanelContent, CONFIG.timing.updateInterval);
                }
            }, CONFIG.timing.initDelay);
        }
    });

})();