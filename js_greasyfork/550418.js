// ==UserScript==
// @name         FuckUlearning
// @description  优学院视频刷课脚本
// @version      1.0.2
// @author       Sh1roko233
// @match        *://ua.ulearning.cn/*
// @icon         https://raw.githubusercontent.com/Sh1rokoDev/FuckULearning/main/logo.jpg
// @supportURL   https://github.com/Sh1rokoDev/FuckULearning/issues
// @homepageURL  https://github.com/Sh1rokoDev/FuckULearning
// @grant        none
// @namespace https://greasyfork.org/users/1518317
// @downloadURL https://update.greasyfork.org/scripts/550418/FuckUlearning.user.js
// @updateURL https://update.greasyfork.org/scripts/550418/FuckUlearning.meta.js
// ==/UserScript==


// 等待函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// 等待指定元素加载完成
async function waitForElement(selector, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (element) {
            return element; // 元素已加载，返回该元素
        }
        await sleep(500); // 每隔 500 毫秒检查一次
    }
    console.log(`等待元素超时：${selector}`);
    return null; // 超时未找到元素
}



// 判断是否是视频课程
function is_video_course() {
    const playButton = document.querySelector('div.mejs__overlay-button[role="button"][aria-label="播放"]');
    const isVideo = !!playButton;
    console.log(isVideo ? '检测到视频课程' : '未检测到视频课程');
    return isVideo;
}
// 自动检测页面中的视频播放器并逐个播放
async function playAllVideos() {
    // 获取所有 class="video-element" 的元素
    const videoElements = document.querySelectorAll('.video-element');

    // 遍历每个 video-element
    for (let i = 0; i < videoElements.length; i++) {
        const videoElement = videoElements[i];

        // 定位 <div class="mejs__container"> 并获取其 id
        const container = videoElement.querySelector('.mejs__container');
        const videoId = container ? container.id : null; // 如果找到容器，则获取其 id，否则为 null

        if (!videoId) {
            console.log('未找到视频容器的 id，跳过当前视频');
            continue;
        }

        console.log(`当前视频的 videoId：${videoId}`);

        // 判断视频是否已经看过了
        const videoInfo = videoElement.querySelector('.video-info');
        if (videoInfo) {
            const finishedSpan = videoInfo.querySelector('span[data-bind="text: $root.i18nMessageText().finished"]');
            if (finishedSpan) {
                console.log(`视频已看完，视频ID：${videoId}`);
                continue;
            } else {
                console.log(`视频未看完，视频ID：${videoId}`);
            }
        } else {
            console.log(`未找到 video-info 元素，以未看完模式继续，视频ID：${videoId}`);
        }

        // 未看过的视频，进行观看
        const playButtonSelector = `#${videoId} .mejs__overlay-button[aria-label="播放"]`;
        const playButton = await waitForElement(playButtonSelector, 5000);
        const realVideoElement = document.querySelector(`#${videoId} video`);

        if (playButton) {
            const isVisible = window.getComputedStyle(playButton).display !== 'none';
            if (isVisible) {
                playButton.click();
                console.log(`已点击播放按钮，开始播放视频：${videoId}`);

                // 点击二倍速播放按钮
                try {
                    await sleep(1000); // 等待播放器加载
                    const speedButton = document.querySelector(`#${videoId} label.mejs__speed-selector-label.mejs__speed-selected`);
                    if (speedButton && speedButton.textContent === '2.00x') {
                        console.log(`当前已是二倍速播放：${videoId}`);
                    } else {
                        // 如果当前不是2倍速，尝试寻找并点击2倍速选项
                        const speedSelector = document.querySelector(`#${videoId} .mejs__speed-selector`);
                        if (speedSelector) {
                            const allSpeedOptions = speedSelector.querySelectorAll('label.mejs__speed-selector-label');
                            for (const option of allSpeedOptions) {
                                if (option.textContent.trim() === '2.00x') {
                                    option.click();
                                    console.log(`已切换到二倍速播放：${videoId}`);
                                    break;
                                }
                            }
                        } else {
                            console.log(`未找到速度选择器，使用默认播放速度：${videoId}`);
                        }
                    }
                } catch (error) {
                    console.log(`设置播放速度时出错：${videoId}，错误：${error.message}`);
                }

                // 等待视频播放完成
                let isFinished = false;
                while (!isFinished) {
                    // 是否出现暂停弹窗
                    await sleep(1000);
                    needRepaly = handle_modal(
                        'span[data-bind="text: $root.i18nMsgText().walkingTooLong"]',
                        () => document.querySelector('button.btn-submit[data-bind="text: $root.i18nMsgText().continueStudy"]')?.click(),
                        '暂停弹窗已存在，点击继续学习按钮'
                    );

                    await sleep(1000);
                    if (needRepaly) {
                        playButton.click();
                        console.log(`已重新开始播放视频：${videoId}`);
                    }

                    // 检查视频是否播放完成
                    await sleep(1000);
                    console.log(`视频状态: currentTime=${realVideoElement.currentTime}, duration=${realVideoElement.duration}, ended=${realVideoElement.ended}`);
                    if (realVideoElement.ended || realVideoElement.currentTime >= realVideoElement.duration - 1 || realVideoElement.currentTime === 0) {
                        console.log(`视频 ${videoId} 播放完成`);
                        isFinished = true;
                        break;
                    }
                    console.log(`视频 ${videoId} 未播放完成，继续等待...`);
                    
                }
            } else {
                console.log(`播放按钮不可见，无法播放视频：${videoId}`);
            }
        } else {
            console.log(`未找到播放按钮，跳过视频：${videoId}`);
        }
    }

    console.log('本页面所有视频播放完成');
}
// 弹窗处理函数
function handle_modal(selector, action, logMessage) {
    const modalElement = document.querySelector(selector);
    if (modalElement && modalElement.offsetParent !== null) {
        console.log(logMessage);
        action();
        return true;
    }
    return false;
}
// 点击下一页按钮&检查是否完成
async function goto_next_page_and_check_finish() {
    const nextPageButton = document.querySelector('.btn-tip span[data-bind="text: i18nMessageText().nextPage"]');
    if (nextPageButton) {
        nextPageButton.click();
        console.log('已点击下一页按钮');
    } else {
        console.log('未找到下一页按钮');
    }

    await sleep(1000);

    // 处理未完成测试题目弹窗
    handle_modal(
        'span[data-bind="text: $root.i18nMsgText().questionsNotCompleted"]',
        () => document.querySelector('button.btn-hollow[data-bind="text: $root.i18nMsgText().confirmLeave"]')?.click(),
        '未完成题目弹窗已存在，点击确定离开按钮'
    );

    await sleep(1000);

    // 处理未完成章节内容弹窗
    handle_modal(
        'span[data-bind="text: i18nMessageText().incompleteChapter"]',
        () => document.querySelector('button.btn-hollow[data-bind="click: goNextPage"]')?.click(),
        '未完成章节内容弹窗已存在，点击继续下一章按钮'
    );

    await sleep(1000);

    // 处理未完成章节内容2弹窗
    const isFinished = handle_modal(
        'span[data-bind="text: i18nMessageText().incompleteChapter2"]',
        () => document.querySelector('button.btn-hollow[data-bind="click: closeStatPage"]')?.click(),
        '未完成章节内容2弹窗已存在，点击关闭按钮'
    );

    return isFinished; // 返回是否完成
}



// 创建可视化弹窗
function createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'control-panel';
    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.left = '50px';
    panel.style.width = '300px';
    panel.style.height = '300px';
    panel.style.backgroundColor = '#f9f9f9';
    panel.style.border = '1px solid #ccc';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    panel.style.zIndex = '9999';
    panel.style.resize = 'both';
    panel.style.overflow = 'hidden'; // 隐藏溢出内容
    panel.style.padding = '10px';

    // 添加标题
    const title = document.createElement('div');
    title.innerText = '刷课控制面板';
    title.style.fontSize = '16px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '10px';
    title.style.cursor = 'move';
    panel.appendChild(title);

    // 添加启动按钮
    const startButton = document.createElement('button');
    startButton.innerText = '启动';
    startButton.style.marginRight = '10px';
    startButton.onclick = async () => {
        logMessage('启动刷课程序...');
        await main(); // 调用主程序
    };
    panel.appendChild(startButton);

    // 添加停止按钮
    const stopButton = document.createElement('button');
    stopButton.innerText = '停止';
    stopButton.onclick = () => {
        logMessage('停止刷课程序...');
        location.reload(); // 刷新页面以停止程序
    };
    panel.appendChild(stopButton);

    // 添加日志显示区域
    const logContainer = document.createElement('div');
    logContainer.id = 'log-container';
    logContainer.style.marginTop = '10px';
    logContainer.style.height = 'calc(100% - 80px)'; // 自适应高度，减去标题和按钮的高度
    logContainer.style.overflowY = 'auto';
    logContainer.style.backgroundColor = '#fff';
    logContainer.style.border = '1px solid #ddd';
    logContainer.style.padding = '5px';
    logContainer.style.fontSize = '12px';
    logContainer.style.color = '#333';
    panel.appendChild(logContainer);

    // 添加拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    title.onmousedown = (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        document.onmousemove = (e) => {
            if (isDragging) {
                panel.style.left = `${e.clientX - offsetX}px`;
                panel.style.top = `${e.clientY - offsetY}px`;
            }
        };
        document.onmouseup = () => {
            isDragging = false;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    // 将弹窗添加到页面
    document.body.appendChild(panel);
}
// 日志记录函数
function logMessage(message) {
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
        const logEntry = document.createElement('div');
        logEntry.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight; // 自动滚动到底部
    }
}



// 主程序
async function main() {
    logMessage('刷课程序启动...');

    let allFinished = false;
    while (!allFinished) {
        if (is_video_course()) {
            logMessage('检测到视频课程，准备播放所有视频...');
            await playAllVideos(); // 播放所有视频
            logMessage('本页面所有视频播放完成，准备进入下一页...');
            allFinished = await goto_next_page_and_check_finish();
        } else {
            logMessage('检测到非视频课程，准备进入下一页...');
            await sleep(1000);
            allFinished = await goto_next_page_and_check_finish();
        }
    }

    logMessage('刷课程序执行完毕');
}
// 调用函数创建控制面板
createControlPanel();