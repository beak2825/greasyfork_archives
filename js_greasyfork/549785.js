// ==UserScript==
// @name          WarSoul AutoBattle
// @namespace     https://aring.cc/
// @version       1.0.2
// @description   为战魂觉醒游戏组队添加自动战斗功能，等待队员加入后自动开始战斗
// @author        Lunaris
// @match         https://aring.cc/awakening-of-war-soul-ol/*
// @match         https://aring.cc/awakening-of-war-soul-ol
// @icon          https://aring.cc/awakening-of-war-soul-ol/favicon.ico
// @grant         none
// @run-at        document-end
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/549785/WarSoul%20AutoBattle.user.js
// @updateURL https://update.greasyfork.org/scripts/549785/WarSoul%20AutoBattle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[战魂觉醒自动战斗] 脚本开始加载...');

    // 辅助函数：实现 :contains 伪类功能
    function querySelector(selector, context = document) {
        if (selector.includes(':contains(')) {
            const match = selector.match(/^(.+):contains\("([^"]+)"\)$/);
            if (match) {
                const baseSelector = match[1];
                const searchText = match[2];
                const elements = context.querySelectorAll(baseSelector);
                for (let element of elements) {
                    // 检查元素自身或其子元素的文本是否包含搜索文本
                    if (element.textContent.includes(searchText)) {
                        return element;
                    }
                }
            }
            return null;
        }
        return context.querySelector(selector);
    }

    class AutoBattleHelper {
        constructor() {
            this.isAutoEnabled = false;
            this.checkInterval = null;
            this.injectedButton = null;
            this.lastRoomNumber = '';
            this.lastTeamMember = '';
            this.roomElement = null;
            this.battleStarted = false;
            this.init();
        }

        init() {
            this.waitForPageLoad();
        }

        waitForPageLoad() {
            const startInjection = () => {
                this.waitForRoomElement();
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startInjection);
            } else {
                startInjection();
            }
        }

        waitForRoomElement() {
            let attempts = 0;
            const maxAttempts = 30;

            const checkForRoom = () => {
                attempts++;
                // 不依赖 data-v 属性，使用更通用的选择器
                const roomElement = document.querySelector('.in-room.border-wrap');

                if (roomElement) {
                    this.roomElement = roomElement;
                    console.log('[战魂觉醒自动战斗] 找到房间元素，开始注入按钮');
                    this.injectAutoButton(roomElement);
                    this.startMonitoring();
                } else if (attempts < maxAttempts) {
                    setTimeout(checkForRoom, 1000);
                } else {
                    console.log('[战魂觉醒自动战斗] 未找到房间元素，停止尝试');
                }
            };
            checkForRoom();
        }

        // 简化 findRoomElement，直接使用最精确的结构
        findRoomElement() {
            // 房主和队员昵称、开始战斗按钮都在这个容器内
            return document.querySelector('.in-room.border-wrap');
        }

        injectAutoButton(roomElement) {
            if (this.injectedButton) {
                return;
            }

            // 找到包含"房间号"的 p 元素作为插入位置
            const roomInfoElements = roomElement.querySelectorAll('p.room-info');
            let targetElement = null;

            for(let p of roomInfoElements) {
                // 找到包含"房间号"的第一个 p 元素
                if(p.textContent.includes('房间号')) {
                    targetElement = p;
                    break;
                }
            }

            if (!targetElement) {
                console.log('[战魂觉醒自动战斗] 未找到房间信息元素作为插入点');
                return;
            }

            // 获取房间元素的 data-v 属性（动态适配）
            const dataVAttr = Array.from(roomElement.attributes)
                .find(attr => attr.name.startsWith('data-v-'))?.name || '';

            const autoContainer = document.createElement('p');
            if (dataVAttr) {
                autoContainer.setAttribute(dataVAttr, '');
            }
            autoContainer.className = 'room-info auto-battle-container';
            autoContainer.style.cssText = `
                margin-top: 10px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
            `;

            autoContainer.innerHTML = `
                <span ${dataVAttr ? dataVAttr + '=""' : ''} style="margin-right: 10px;">等待队员加入后自动开始战斗：</span>
                <div ${dataVAttr ? dataVAttr + '=""' : ''} class="el-switch el-switch--small" style="cursor: pointer;">
                    <input class="el-switch__input" type="checkbox" role="switch"
                               aria-checked="false" aria-disabled="false"
                               style="display: none;">
                    <span class="el-switch__core" style="border-color: #dcdfe6; background-color: #dcdfe6;">
                        <div class="el-switch__action" style="background-color: #fff;"></div>
                    </span>
                </div>
            `;

            targetElement.parentNode.insertBefore(autoContainer, targetElement.nextSibling);

            const switchElement = autoContainer.querySelector('.el-switch');
            const inputElement = autoContainer.querySelector('.el-switch__input');
            const coreElement = autoContainer.querySelector('.el-switch__core');
            this.bindSwitchEvents(switchElement, inputElement, coreElement);
            this.injectedButton = autoContainer;
            console.log('[战魂觉醒自动战斗] 自动战斗按钮已成功注入');
        }

        bindSwitchEvents(switchElement, inputElement, coreElement, textElement) {
            if (!switchElement || !inputElement || !coreElement) {
                console.error('[战魂觉醒自动战斗] 开关元素绑定失败');
                return;
            }

            const toggleSwitch = (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.isAutoEnabled = !this.isAutoEnabled;
                inputElement.checked = this.isAutoEnabled;
                inputElement.setAttribute('aria-checked', this.isAutoEnabled.toString());
                if (this.isAutoEnabled) {
                    switchElement.classList.add('is-checked');
                    coreElement.style.borderColor = '#409DFE';
                    coreElement.style.backgroundColor = '#409DFE';
                    if (textElement) textElement.style.color = '#409DFE';
                    console.log('[战魂觉醒自动战斗] ✅ 自动战斗已启用 - 持续监控房间状态');
                } else {
                    switchElement.classList.remove('is-checked');
                    coreElement.style.borderColor = '#dcdfe6';
                    coreElement.style.backgroundColor = '#dcdfe6';
                    if (textElement) textElement.style.color = '#909399';
                    console.log('[战魂觉醒自动战斗] ❌ 自动战斗已禁用');
                }
            };
            switchElement.addEventListener('click', toggleSwitch);
        }

        startMonitoring() {
            console.log('[战魂觉醒自动战斗] 🔍 开始监控房间和队员状态...');
            // 减少监控频率，减轻资源消耗
            this.checkInterval = setInterval(() => {
                this.checkRoomAndTeamStatus();
            }, 1500); // 调整为 1.5 秒
        }

        checkRoomAndTeamStatus() {
            if (!this.isAutoEnabled) return;

            // 始终获取最新的房间元素，以应对 DOM 变化
            const roomElement = this.roomElement || this.findRoomElement();
            if (!roomElement) {
                // 如果房间元素消失，清除计时器，等待重新初始化
                if (this.checkInterval) {
                     clearInterval(this.checkInterval);
                     this.checkInterval = null;
                     console.log('[战魂觉醒自动战斗] 房间元素丢失，停止监控。');
                }
                return;
            }
            this.roomElement = roomElement; // 确保 roomElement 始终是最新的

            const currentRoomNumber = this.getCurrentRoomNumber(roomElement);
            const currentTeamMember = this.getCurrentTeamMember(roomElement);

            // 监控房间号变化
            if (currentRoomNumber !== this.lastRoomNumber) {
                this.lastRoomNumber = currentRoomNumber;
                // 房间状态变化时重置战斗标志，以准备下一轮自动战斗
                this.battleStarted = false;
                console.log(`[战魂觉醒自动战斗] 🏠 房间号变化/重置: ${currentRoomNumber || '无房间'}`);
            }

            // 只有在有效房间内且战斗未开始，才检测队员并触发战斗
            if (this.isValidRoom(currentRoomNumber) && !this.battleStarted) {

                // 仅当检测到队员加入时才触发
                if (currentTeamMember && currentTeamMember !== this.lastTeamMember) {
                    this.lastTeamMember = currentTeamMember; // 更新队员信息

                    console.log(`[战魂觉醒自动战斗] 👥 检测到队员加入: ${currentTeamMember}`);

                    // 延迟 1.5 秒后尝试开始战斗
                    setTimeout(() => {
                        // 再次确认房间和队员状态是否仍然有效
                        if (this.isValidRoom(this.lastRoomNumber) && this.lastTeamMember === currentTeamMember && !this.battleStarted) {
                            this.autoStartBattle(currentTeamMember, currentRoomNumber);
                        }
                    }, 1500);
                } else if (!currentTeamMember) {
                    this.lastTeamMember = ''; // 队员离开
                }
            }
        }

        getCurrentRoomNumber(roomElement) {
            // 找到包含 "房间号：" 的元素
            const allSpans = roomElement.querySelectorAll('span');
            for (let span of allSpans) {
                const text = span.textContent;
                if (text.includes('房间号：') && text.match(/\d+/)) {
                    // 提取房间号数字
                    const match = text.match(/房间号：(\d+)/);
                    return match ? match[1] : '';
                }
            }
            return '';
        }

        isValidRoom(roomNumber) {
            // 房间号存在且不为"0"才是有效房间
            return roomNumber && roomNumber !== '0';
        }

        getCurrentTeamMember(roomElement) {
            // 队员信息在 .user-list 下的第二个 <p> 元素中
            const teamRow = roomElement.querySelector('.user-list p:nth-child(2)');
            if (!teamRow) return '';

            const teamNickname = teamRow.querySelector('span.nickname');
            if (!teamNickname) return '';

            // 获取昵称文本，如果为空则返回空字符串
            const nickname = teamNickname.textContent.trim();
            return nickname || '';
        }

        autoStartBattle(teamMember, roomNumber) {
            if (this.battleStarted) {
                console.log('[战魂觉醒自动战斗] ⚠️ 此房间已经开始过战斗，跳过');
                return;
            }

            console.log(`[战魂觉醒自动战斗] ⚔️ 准备自动开始战斗 - 房间:${roomNumber}, 队员:${teamMember}`);
            const battleButton = this.findStartBattleButton();
            if (battleButton) {
                console.log('[战魂觉醒自动战斗] 🚀 自动点击开始战斗按钮');
                battleButton.click();
                this.battleStarted = true; // 标记此房间已经开始战斗
                console.log('[战魂觉醒自动战斗] ✅ 战斗已开始，等待房间状态变化...');
            } else {
                console.log('[战魂觉醒自动战斗] ⚠️ 未找到可用的开始战斗按钮');
            }
        }

        // 优化后的按钮定位函数：只在房间容器内寻找
        findStartBattleButton() {
            const roomContainer = this.roomElement;
            if (!roomContainer) return null;

            // 根据您提供的 HTML 结构，开始战斗按钮位于 roomContainer (in-room border-wrap) 内部
            // 寻找成功按钮 (el-button--success) 且包含 "开始战斗" 文本的按钮

            // 遍历 roomContainer 内部的所有按钮，进行精确筛选
            const allButtons = roomContainer.querySelectorAll('.el-button');
            for (let button of allButtons) {
                const textContent = button.textContent.trim();

                if (textContent.includes('开始战斗') &&
                    button.classList.contains('el-button--success')) {

                    // 检查按钮是否可点击
                    if (this.isButtonClickable(button)) {
                        return button;
                    }
                }
            }

            return null;
        }

        // 保持原脚本中的 isButtonClickable 检查
        isButtonClickable(button) {
            if (!button) return false;
            return !button.disabled &&
                    button.getAttribute('aria-disabled') !== 'true' &&
                    button.style.display !== 'none' &&
                    !button.classList.contains('is-disabled');
        }

        destroy() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }
            if (this.injectedButton) {
                this.injectedButton.remove();
                this.injectedButton = null;
            }
            console.log('[战魂觉醒自动战斗] 🔄 脚本已销毁');
        }
    }

    let autoBattleHelper = null;
    function initAutoBattle() {
        if (autoBattleHelper) {
            autoBattleHelper.destroy();
        }
        // 延迟初始化，确保页面元素加载
        setTimeout(() => {
            autoBattleHelper = new AutoBattleHelper();
        }, 2000);
    }

    let lastUrl = location.href;
    // 使用 MutationObserver 监听 URL 变化，处理 SPA 导航
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('[战魂觉醒自动战斗] 页面URL变化，重新初始化');
            // 延迟重新初始化，给页面留出加载时间
            setTimeout(initAutoBattle, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

    window.addEventListener('beforeunload', () => {
        if (autoBattleHelper) {
            autoBattleHelper.destroy();
        }
    });

    // 首次加载时初始化
    console.log('[战魂觉醒自动战斗] 油猴脚本已加载完成');
    initAutoBattle();
})();