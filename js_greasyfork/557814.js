// ==UserScript==
// @name         大呆倒了
// @namespace    http://tampermonkey.net/
// @version      6.26
// @description  在斗鱼直播间精准识别弹幕，浮窗显示最新发言用户昵称，并显示倒计时
// @author       Tipan太攀
// @match        https://www.douyu.com/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.13.1/jquery-ui.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557814/%E5%A4%A7%E5%91%86%E5%80%92%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/557814/%E5%A4%A7%E5%91%86%E5%80%92%E4%BA%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数 (V6.26: 区分两种复制文本)
    const config = {
        checkInterval: 1000,
        maxNoDanmuTime: 60, // 60秒

        // 达到冷场时间 (60秒后) 使用的文本
        coldTextTemplate: '丸辣，当前已{minutes}分{seconds}秒没有弹幕！',
        // 未达到冷场时间 (60秒前) 使用的文本 (恢复为一般提醒)
        defaultTextTemplate: '提醒：当前已{minutes}分{seconds}秒没有弹幕',

        iconUrl: 'https://img.feria.eu.org/y05yjn.png'
    };

    // 检查当前是否为指定的直播间页面
    function isLiveRoomPage() {
        const roomNumber = '5092355';
        const currentPath = window.location.pathname.split('/').filter(Boolean)[0];

        return currentPath === roomNumber;
    }

    // 如果不是指定的直播间页面，则不执行插件
    if (!isLiveRoomPage()) {
        return;
    }

    // 状态变量
    let lastDanmuTime = Date.now();
    let timerInterval;
    let lastDanmuContent = '';
    let lastDanmuUser = '';
    let toolbarButton = null;

    // 创建浮动窗口
    function createFloatingWindow() {
        const $window = $(`
            <div id="danmuTimerWindow" style="position: fixed; top: 200px; right: 20px; width: 200px;
                background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 5px;
                z-index: 9999; cursor: move; word-wrap: break-word;">
                <div style="margin-bottom: 10px; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                    <span>弹幕倒计时</span>
                    <button id="copyBtn" style="padding: 4px 8px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        复制
                    </button>
                </div>
                <div id="timerDisplay" style="font-size: 18px; text-align: center; margin: 10px 0;">00:00</div>
                <div style="font-size: 12px; margin-top: 5px;">
                    最新用户: <span id="lastDanmuUserDisplay" style="color: #00ff00; font-size: 12px; display: block; margin-top: 2px;" title="最新发言用户昵称">-</span>
                    最新弹幕: <span id="lastDanmuContentDisplay" style="color: #ffcc00; display: block; margin-top: 2px;">-</span>
                </div>
            </div>
        `);

        $('body').append($window);
        $('#danmuTimerWindow').draggable();
        $('#copyBtn').click(copyColdReminder);
    }

    // 更新图标状态（彩色/黑白）
    function updateIconState() {
        if (!toolbarButton) return;

        const elapsed = Math.floor((Date.now() - lastDanmuTime) / 1000);
        const isCold = elapsed > config.maxNoDanmuTime;

        // 逻辑：未达到冷场时间（不冷）时，图标为黑白；达到冷场时间（冷）时，图标为彩色。
        toolbarButton.style.filter = isCold ? 'none' : 'grayscale(100%)';
    }

    // 在聊天工具栏添加复制按钮
    function addToolbarButton() {
        const checkToolbar = setInterval(() => {
            const toolbar = document.querySelector('.ChatToolBar');
            if (toolbar) {
                clearInterval(checkToolbar);

                const button = document.createElement('div');
                button.className = 'cold-reminder-btn';
                button.style.cssText = `
                    width: 24px;
                    height: 24px;
                    margin: 0 5px;
                    cursor: pointer;
                    background-image: url(${config.iconUrl});
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    transition: transform 0.2s ease, filter 0.3s ease;
                    filter: grayscale(100%);
                `;
                button.title = '复制提醒';

                button.addEventListener('mouseenter', () => { button.style.transform = 'scale(1.2)'; });
                button.addEventListener('mouseleave', () => { button.style.transform = 'scale(1)'; });

                toolbar.appendChild(button);
                toolbarButton = button;

                button.addEventListener('click', copyColdReminder);

                button.onerror = function() {
                    button.style.backgroundImage = 'none';
                    button.textContent = '复制';
                    button.style.width = 'auto';
                    button.style.padding = '0 5px';
                    button.style.filter = 'none';
                };

                updateIconState();
            }
        }, 1000);
    }

    // 查找弹幕输入框
    function findDanmuInput() {
        const input = document.querySelector('.ChatSend-txt');
        if (input) return input;

        return document.querySelector('.danmu-input') ||
               document.querySelector('.chat-input') ||
               document.querySelector('textarea[name="danmu"]');
    }

    // 复制提醒并填充到弹幕输入框 (V6.26: 动态选择文本模板)
    function copyColdReminder() {
        const elapsed = Math.floor((Date.now() - lastDanmuTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        let template;
        if (elapsed > config.maxNoDanmuTime) {
            template = config.coldTextTemplate;
        } else {
            template = config.defaultTextTemplate;
        }

        const text = template
            .replace('{minutes}', minutes)
            .replace('{seconds}', seconds);

        navigator.clipboard.writeText(text).then(() => {
            GM_notification({ title: '复制成功', text: '提醒已复制到剪贴板', timeout: 2000 });
        }).catch(err => {
            console.error('复制失败:', err);
        });

        const danmuInput = findDanmuInput();
        if (danmuInput) {
            danmuInput.value = text;
            const event = new Event('input', { bubbles: true });
            danmuInput.dispatchEvent(event);
            danmuInput.focus();
        }
    }

    // 更新计时器显示
    function updateTimerDisplay() {
        const elapsed = Math.floor((Date.now() - lastDanmuTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        $('#timerDisplay').text(`${minutes}:${seconds}`);

        if (elapsed > config.maxNoDanmuTime) {
            $('#timerDisplay').css('color', '#ff6b6b');
        } else {
            $('#timerDisplay').css('color', 'white');
        }

        updateIconState();
    }

    // 检查是否为自己发送的提醒 (V6.26: 检查两种模板)
    function isIgnoredContent(content) {
        function createRegex(template) {
            let patternStr = template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            patternStr = patternStr.replace(/\\{minutes\\}/g, '\\d+').replace(/\\{seconds\\}/g, '\\d+');
            return new RegExp(patternStr);
        }

        const coldRegex = createRegex(config.coldTextTemplate);
        const defaultRegex = createRegex(config.defaultTextTemplate);

        return coldRegex.test(content) || defaultRegex.test(content);
    }

    // 核心检测逻辑
    function checkNewDanmu() {
        try {
            const danmus = document.querySelectorAll('.Barrage-listItem');

            if (danmus.length === 0) return;

            let latestDanmu = null;
            let currentContent = '';
            let currentNickName = '';

            for (let i = danmus.length - 1; i >= 0; i--) {
                const node = danmus[i];

                // --- 增强过滤逻辑：跳过所有非聊天弹幕 ---
                if (node.closest('.Barrage-extend') || node.classList.contains('is-extendBarrage')) {
                    continue;
                }
                if (node.querySelector('.Barrage-notice') || node.querySelector('.Barrage-icon--sys')) {
                    continue;
                }
                if (node.querySelector('.GiftText')) {
                    continue;
                }

                // 找到了最新的有效聊天弹幕
                latestDanmu = node;
                currentContent = latestDanmu.textContent.trim();

                // 获取用户昵称 (使用 title 属性或直接文本)
                const nickNameElement = latestDanmu.querySelector('.Barrage-nickName[title]');
                if (nickNameElement) {
                    currentNickName = nickNameElement.getAttribute('title').trim();
                } else {
                    currentNickName = latestDanmu.querySelector('.Barrage-nickName')?.textContent.trim().replace(/:|：/g, '') || '未知用户';
                }

                break;
            }

            if (!latestDanmu || !currentContent) return;

            // 核心校验：内容 或 用户 改变，都视为新弹幕
            const isNewDanmu = (currentContent !== lastDanmuContent || currentNickName !== lastDanmuUser);


            if (isNewDanmu) {

                // 1. 如果是自己发的提醒，更新内容和用户记录，但不重置时间
                if (isIgnoredContent(currentContent)) {
                    lastDanmuContent = currentContent;
                    lastDanmuUser = currentNickName;

                    $('#lastDanmuUserDisplay').text(currentNickName);
                    $('#lastDanmuUserDisplay').attr('title', currentNickName);

                    return;
                }

                // 2. 有效的新弹幕：重置时间并更新所有显示和状态
                lastDanmuTime = Date.now();
                lastDanmuContent = currentContent;
                lastDanmuUser = currentNickName;

                // UI显示处理：只显示冒号后的内容（去除名字前缀）
                const displayContent = currentContent.includes('：') ? currentContent.split('：').pop().trim() :
                                     (currentContent.includes(':') ? currentContent.split(':').pop().trim() : currentContent.trim());

                // 更新用户昵称和内容显示
                $('#lastDanmuUserDisplay').text(currentNickName);
                $('#lastDanmuUserDisplay').attr('title', currentNickName);
                $('#lastDanmuContentDisplay').text(displayContent);
                updateTimerDisplay();
            }
        } catch (e) {
            console.error('检查弹幕时出错:', e);
        }
    }

    function init() {
        createFloatingWindow();
        addToolbarButton();
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            updateTimerDisplay();
            checkNewDanmu();
        }, config.checkInterval);
    }

    $(document).ready(function() {
        setTimeout(init, 1000);
    });
})();