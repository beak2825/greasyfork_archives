// ==UserScript==
// @name         迷迷、悄悄聊
// @namespace    https://jiuhe29.cn/
// @version      2025-12-25
// @description  自动发送消息。支持根据性别发送不同消息，显示联系人信息面板（可拖拽、可折叠），使用本地存储管理发送状态。
// @author       Jiuhe
// @match        *://*.qiaoqiao.chat/*
// @match        *://*.mimiu.chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qiaoqiao.chat
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554454/%E8%BF%B7%E8%BF%B7%E3%80%81%E6%82%84%E6%82%84%E8%81%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/554454/%E8%BF%B7%E8%BF%B7%E3%80%81%E6%82%84%E6%82%84%E8%81%8A.meta.js
// ==/UserScript==

    (function () {
    'use strict';

    // Your code here...
        // 从本地存储获取联系信息
        function getContactInfo() {
            try {
                const contactInfoStr = localStorage.getItem('qc.contactInfo');
                if (contactInfoStr) {
                    return JSON.parse(contactInfoStr);
                }
            } catch (e) {
                console.error('解析联系信息失败:', e);
            }
            return null;
        }

        function updateContactInfoPanel() {
            const panel = document.getElementById('contact-info-panel');
            if (!panel) return createContactInfoPanel();

            const contactInfo = getContactInfo();
            if (!contactInfo) {
                console.log('未找到联系信息');
                return null;
            }

            const gender = contactInfo.gender;
            const province = contactInfo.province || '未知';
            const city = contactInfo.city || '未知';
            const genderText = gender === 1 ? '男' : gender === 2 ? '女' : '?';

            const genderBadge = panel.querySelector('.gender-badge');
            if (genderBadge) {
                genderBadge.textContent = genderText;
                genderBadge.className = 'gender-badge';
                if (gender === 1) {
                    genderBadge.style.background = 'linear-gradient(135deg, #3b82f6, #22d3ee)';
                } else if (gender === 2) {
                    genderBadge.style.background = 'linear-gradient(135deg, #ec4899, #fb7185)';
                } else {
                    genderBadge.style.background = 'linear-gradient(135deg, #6b7280, #9ca3af)';
                }
            }

            const locationText = panel.querySelector('.location-text');
            if (locationText) locationText.textContent = `${province} · ${city}`;

            console.log('已更新联系信息面板:', { province, city, gender: genderText });
            return panel;
        }

        function createContactInfoPanel() {
            const existingPanel = document.getElementById('contact-info-panel');
            if (existingPanel) existingPanel.remove();

            const contactInfo = getContactInfo();
            if (!contactInfo) {
                console.log('未找到联系信息');
                return null;
            }

            const gender = contactInfo.gender;
            const province = contactInfo.province || '未知';
            const city = contactInfo.city || '未知';
            const genderText = gender === 1 ? '男' : gender === 2 ? '女' : '?';
            const genderColor = gender === 1 ? 'from-blue-500 to-cyan-400' : gender === 2 ? 'from-pink-500 to-rose-400' : 'from-gray-500 to-gray-400';
            const genderBg = gender === 1 ? 'bg-blue-500/20' : gender === 2 ? 'bg-pink-500/20' : 'bg-gray-500/20';

            const panel = document.createElement('div');
            panel.id = 'contact-info-panel';
            const savedPosition = PANEL_SETTINGS.position || { top: 20, right: 20 };

            panel.innerHTML = `
                <style>
                    #contact-info-panel { position: fixed; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                    #contact-info-panel * { box-sizing: border-box; }
                    .panel-card { background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9)); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset; min-width: 260px; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                    .panel-card:hover { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1) inset; transform: translateY(-2px); }
                    .panel-header { padding: 16px; display: flex; align-items: center; gap: 12px; cursor: move; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); }
                    .gender-badge { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
                    .location-info { flex: 1; }
                    .location-text { font-size: 15px; font-weight: 600; color: #f1f5f9; letter-spacing: 0.3px; }
                    .location-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
                    .toggle-btn { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94a3b8; cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.05); }
                    .toggle-btn:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }
                    .panel-body { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
                    .section { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 14px; border: 1px solid rgba(255,255,255,0.04); }
                    .section-title { font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
                    .option-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
                    .option-row:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,0.04); }
                    .option-label { font-size: 13px; color: #cbd5e1; display: flex; align-items: center; gap: 8px; }
                    .option-icon { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-size: 10px; }
                    .toggle-switch { position: relative; width: 40px; height: 22px; background: #334155; border-radius: 11px; cursor: pointer; transition: all 0.3s; }
                    .toggle-switch.active { background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
                    .toggle-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
                    .toggle-switch.active::after { left: 21px; }
                    .input-group { margin-top: 4px; }
                    .input-label { font-size: 11px; color: #64748b; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
                    .input-field { width: 100%; padding: 10px 12px; background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #e2e8f0; font-size: 13px; transition: all 0.2s; outline: none; }
                    .input-field:focus { border-color: #3b82f6; background: rgba(15,23,42,0.8); box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
                    .input-field::placeholder { color: #475569; }
                    .collapsed .panel-body { display: none; }
                    .collapsed .panel-card { opacity: 0.7; }
                    .collapsed:hover .panel-card { opacity: 0.9; }
                </style>
                <div class="panel-card">
                    <div class="panel-header" id="panel-header">
                        <div class="gender-badge bg-gradient-to-br ${genderColor} ${genderBg}">${genderText}</div>
                        <div class="location-info">
                            <div class="location-text">${province} · ${city}</div>
                            <div class="location-sub">匹配信息</div>
                        </div>
                        <div class="toggle-btn" id="panel-toggle-btn">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                <path d="${PANEL_SETTINGS.collapsed ? 'M3 5l3 3 3-3' : 'M3 7l3-3 3 3'}"/>
                            </svg>
                        </div>
                    </div>
                    <div class="panel-body" id="panel-content">
                        <div class="section">
                            <div class="section-title">自动化设置</div>
                            <div class="option-row">
                                <span class="option-label">
                                    <span class="option-icon" style="background: rgba(59,130,246,0.2); color: #60a5fa;">♂</span>
                                    给男生发消息
                                </span>
                                <div class="toggle-switch ${SEND_SETTINGS.sendToMale ? 'active' : ''}" id="sendToMaleCheck"></div>
                            </div>
                            <div class="option-row">
                                <span class="option-label">
                                    <span class="option-icon" style="background: rgba(236,72,153,0.2); color: #f472b6;">♀</span>
                                    给女生发消息
                                </span>
                                <div class="toggle-switch ${SEND_SETTINGS.sendToFemale ? 'active' : ''}" id="sendToFemaleCheck"></div>
                            </div>
                            <div class="option-row">
                                <span class="option-label">
                                    <span class="option-icon" style="background: rgba(239,68,68,0.2); color: #f87171;">⚡</span>
                                    匹配男生自动离开
                                </span>
                                <div class="toggle-switch ${SEND_SETTINGS.autoLeaveMale ? 'active' : ''}" id="autoLeaveMaleCheck"></div>
                            </div>
                        </div>
                        <div class="section">
                            <div class="section-title">预设消息</div>
                            <div class="input-group">
                                <div class="input-label"><span style="color: #60a5fa;">♂</span> 男生消息</div>
                                <input type="text" class="input-field" id="maleMessageInput" value="${PRESET_MESSAGES.MALE || ''}" placeholder="输入发送给男生的消息...">
                            </div>
                            <div class="input-group" style="margin-top: 12px;">
                                <div class="input-label"><span style="color: #f472b6;">♀</span> 女生消息</div>
                                <input type="text" class="input-field" id="femaleMessageInput" value="${PRESET_MESSAGES.FEMALE || ''}" placeholder="输入发送给女生的消息...">
                            </div>
                        </div>
                    </div>
                </div>
            `;

            panel.style.cssText = `top: ${savedPosition.top}px; right: ${savedPosition.right}px;`;
            if (PANEL_SETTINGS.collapsed) panel.classList.add('collapsed');
            document.body.appendChild(panel);

            let isDragging = false;
            let dragOffset = { x: 0, y: 0 };
            const panelHeader = panel.querySelector('#panel-header');
            const toggleBtn = panel.querySelector('#panel-toggle-btn');

            panelHeader.addEventListener('mousedown', function (e) {
                if (e.target.closest('#panel-toggle-btn')) return;
                isDragging = true;
                const rect = panel.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;
                panel.style.transition = 'none';
                e.preventDefault();
            });

            document.addEventListener('mousemove', function (e) {
                if (!isDragging) return;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                const panelWidth = panel.offsetWidth;
                const panelHeight = panel.offsetHeight;
                let newLeft = Math.max(0, Math.min(e.clientX - dragOffset.x, windowWidth - panelWidth));
                let newTop = Math.max(0, Math.min(e.clientY - dragOffset.y, windowHeight - panelHeight));
                panel.style.left = newLeft + 'px';
                panel.style.right = 'auto';
                panel.style.top = newTop + 'px';
            });

            document.addEventListener('mouseup', function () {
                if (isDragging) {
                    isDragging = false;
                    panel.style.transition = '';
                    const rect = panel.getBoundingClientRect();
                    PANEL_SETTINGS.position = { top: rect.top, right: window.innerWidth - rect.right };
                    saveSettings();
                }
            });

            toggleBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                PANEL_SETTINGS.collapsed = !PANEL_SETTINGS.collapsed;
                saveSettings();
                panel.classList.toggle('collapsed');
                toggleBtn.querySelector('path').setAttribute('d', PANEL_SETTINGS.collapsed ? 'M3 5l3 3 3-3' : 'M3 7l3-3 3 3');
            });

            const bindToggle = (id, settingKey) => {
                const el = panel.querySelector(`#${id}`);
                el.addEventListener('click', function() {
                    SEND_SETTINGS[settingKey] = !SEND_SETTINGS[settingKey];
                    this.classList.toggle('active');
                    saveSettings();
                });
            };
            bindToggle('sendToMaleCheck', 'sendToMale');
            bindToggle('sendToFemaleCheck', 'sendToFemale');
            bindToggle('autoLeaveMaleCheck', 'autoLeaveMale');

            let messageInputTimer = null;
            const bindInput = (id, msgKey) => {
                panel.querySelector(`#${id}`).addEventListener('input', function() {
                    clearTimeout(messageInputTimer);
                    messageInputTimer = setTimeout(() => {
                        PRESET_MESSAGES[msgKey] = this.value;
                        saveSettings();
                    }, 500);
                });
            };
            bindInput('maleMessageInput', 'MALE');
            bindInput('femaleMessageInput', 'FEMALE');

            console.log('已创建联系信息面板:', { province, gender: genderText });
            return panel;
        }

        // 获取"重新匹配"按钮的函数
        function getRematchButton() {
            return Array.from(document.querySelectorAll('.var-button')).find(button => {
                const content = button.querySelector('.var-button__content');
                return content && content.textContent.trim() === '重新匹配';
            });
        }

        function getChatInput() {
            return document.querySelector('.custom_rich_input.needClick');
        }

        // 检查第一条消息是否为未读
        function checkFirstMessageUnread() {
            const baseLayout = document.querySelector('.baseLayout.inWide');
            if (!baseLayout) {
                console.log('[人机检测] 未找到 baseLayout.inWide');
                return false;
            }

            // 查找所有聊天项
            const chatItems = baseLayout.querySelectorAll('.chatItem');
            if (chatItems.length === 0) {
                console.log('[人机检测] 未找到聊天项');
                return false;
            }

            // 获取第一条消息
            const firstChatItem = chatItems[0];
            console.log('[人机检测] 检查第一条消息，聊天项数量:', chatItems.length);

            // 检查是否有未读标记（.readText 包含"未读"）
            const readBox = firstChatItem.querySelector('.readBox');
            if (readBox) {
                const readText = readBox.querySelector('.readText');
                const readTextContent = readText ? readText.textContent.trim() : '';
                console.log('[人机检测] 读取状态文本:', readTextContent);
                if (readText && readTextContent === '未读') {
                    console.log('[人机检测] 检测到第一条消息为未读');
                    return true;
                }
            } else {
                console.log('[人机检测] 未找到 readBox');
            }

            return false;
        }

        // 查找并点击电源图标
        function clickPowerButton() {
            const powerIcon = document.querySelector('img[src*="power_fill"]');
            if (powerIcon) {
                console.log('找到电源图标，点击');
                powerIcon.click();
                return true;
            }
            return false;
        }

        // 等待弹出框出现并点击确认
        function clickConfirmButton() {
            // 等待弹出框出现
            const maxWaitTime = 3000; // 最多等待3秒
            const checkInterval = 100; // 每100ms检查一次
            let elapsedTime = 0;

            const checkPopup = setInterval(() => {
                elapsedTime += checkInterval;

                // 查找弹出框（使用多个选择器组合）
                const popup = document.querySelector('.var-popup__content.var-popup--center.var-popup--content-background-color.var-elevation--3.var-dialog__popup') ||
                    document.querySelector('.var-dialog__popup') ||
                    document.querySelector('.var-popup__content');

                if (popup) {
                    clearInterval(checkPopup);
                    console.log('找到弹出框，查找确认按钮');

                    // 在弹出框中查找确认按钮
                    const confirmButton = popup.querySelector('.var-button--primary') ||
                        Array.from(popup.querySelectorAll('.var-button')).find(btn => {
                            const content = btn.querySelector('.var-button__content');
                            if (content) {
                                const text = content.textContent.trim();
                                return text.includes('确认') || text.includes('确定') || text === '确定' || text === '确认';
                            }
                            return false;
                        }) ||
                        popup.querySelector('button');

                    if (confirmButton) {
                        setTimeout(() => {
                            confirmButton.click();
                            console.log('已点击确认按钮');
                        }, 500);
                    } else {
                        console.log('未找到确认按钮，弹出框内容:', popup.innerHTML.substring(0, 200));
                    }
                } else if (elapsedTime >= maxWaitTime) {
                    clearInterval(checkPopup);
                    console.log('等待弹出框超时');
                }
            }, checkInterval);
        }

        // 检查是否为人机（全局变量，用于阻止发送消息）
        let isBot = false;
        let botCheckInterval = null; // 检测定时器

        // 在发送消息后启动人机检测（等待1秒后检查一次）
        function startBotDetectionAfterSend() {
            console.log('[人机检测] 发送消息后，等待1秒后检查对方是否已读...');

            // 清除之前的检测定时器
            if (botCheckInterval) {
                clearTimeout(botCheckInterval);
            }

            // 等待1秒后检查一次
            botCheckInterval = setTimeout(() => {
                // 检查消息是否为未读
                const isUnread = checkFirstMessageUnread();

                if (isUnread) {
                    console.log('[人机检测] 发送消息1秒后仍为未读，判定为人机，执行离开操作');
                    isBot = true;

                    // 标记为已发送（阻止后续发送逻辑）
                    const Gender = getGender();
                    if (Gender) {
                        markMessageSent(Gender);
                    }

                    // 点击电源图标执行离开操作
                    console.log('[人机检测] 尝试点击电源图标...');
                    if (clickPowerButton()) {
                        console.log('[人机检测] 电源图标点击成功，等待弹出框...');
                        // 等待弹出框出现后点击确认
                        setTimeout(() => {
                            clickConfirmButton();
                        }, 500);
                    } else {
                        console.error('[人机检测] 未找到电源图标！');
                    }
                } else {
                    console.log('[人机检测] 发送消息1秒后已变为已读，不是人机');
                    isBot = false;
                }

                // 清除定时器引用
                botCheckInterval = null;
            }, 1000); // 等待1秒
        }

        // 停止检测
        function stopBotDetection() {
            if (botCheckInterval) {
                clearTimeout(botCheckInterval);
                botCheckInterval = null;
                console.log('[人机检测] 已停止检测');
            }
        }

        // 发送消息的函数
        function sendMessage(input, message) {
            if (!input || !message) return false;

            // 聚焦输入框
            input.focus();

            // 清空原有内容
            input.innerHTML = '';
            input.textContent = '';

            // 模拟真实输入：逐字符输入
            for (let i = 0; i < message.length; i++) {
                const char = message[i];
                input.textContent += char;

                // 触发输入事件，让Vue检测到变化
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    data: char,
                    inputType: 'insertText'
                });
                input.dispatchEvent(inputEvent);
            }

            // 等待一小段时间，确保Vue完成更新
            setTimeout(() => {
                // 触发完整的键盘事件序列来发送消息
                // 1. keydown
                const keyDownEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true,
                    shiftKey: false
                });
                input.dispatchEvent(keyDownEvent);

                // 2. keypress
                const keyPressEvent = new KeyboardEvent('keypress', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true,
                    shiftKey: false
                });
                input.dispatchEvent(keyPressEvent);

                // 3. keyup
                const keyUpEvent = new KeyboardEvent('keyup', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true,
                    shiftKey: false
                });
                input.dispatchEvent(keyUpEvent);

                // 发送消息后，启动人机检测（检测对方是否在1秒内已读）
                setTimeout(() => {
                    startBotDetectionAfterSend();
                }, 500); // 等待消息发送完成
            }, 100);
        }

        // 获取性别变量
        function getGender() {
            const contactInfo = getContactInfo();
            return contactInfo ? contactInfo.gender : null; // 1=男生, 2=女生
        }

        // 预设消息（根据性别不同）
        let PRESET_MESSAGES = {
            MALE: '你好呢',      // 给男生发的消息
            FEMALE: '你好呀'     // 给女生发的消息
        };

        // 发送消息设置
        let SEND_SETTINGS = {
            sendToMale: true,    // 是否给男生发消息
            sendToFemale: true,  // 是否给女生发消息
            autoLeaveMale: true  // 新增：是否自动离开男生
        };

        // 面板设置
        let PANEL_SETTINGS = {
            collapsed: false,    // 面板是否折叠
            position: {           // 面板位置
                top: 60,
                right: 12
            }
        };

        // 从 localStorage 加载设置
        function loadSettings() {
            try {
                const savedMessages = localStorage.getItem('qc.presetMessages');
                if (savedMessages) {
                    PRESET_MESSAGES = JSON.parse(savedMessages);
                }
                const savedSettings = localStorage.getItem('qc.sendSettings');
                if (savedSettings) {
                    // 合并设置，保留新添加的默认值
                    const loadedSettings = JSON.parse(savedSettings);
                    SEND_SETTINGS = { ...SEND_SETTINGS, ...loadedSettings };
                }
                const savedPanelSettings = localStorage.getItem('qc.panelSettings');
                if (savedPanelSettings) {
                    PANEL_SETTINGS = JSON.parse(savedPanelSettings);
                }
            } catch (e) {
                console.error('加载设置失败:', e);
            }
        }

        // 保存设置到 localStorage
        function saveSettings() {
            try {
                localStorage.setItem('qc.presetMessages', JSON.stringify(PRESET_MESSAGES));
                localStorage.setItem('qc.sendSettings', JSON.stringify(SEND_SETTINGS));
                localStorage.setItem('qc.panelSettings', JSON.stringify(PANEL_SETTINGS));
            } catch (e) {
                console.error('保存设置失败:', e);
            }
        }

        // 初始化时加载设置
        loadSettings();

        // 消息状态
        const MessageState = {
            PENDING: 'pending',      // 待处理（未发送）
            COMPLETED: 'completed'   // 已完成（已发送）
        };

        // 根据性别获取对应的预设消息
        function getPresetMessage(gender) {
            if (gender === 1) {
                return PRESET_MESSAGES.MALE;
            } else if (gender === 2) {
                return PRESET_MESSAGES.FEMALE;
            }
            return null;
        }

        // 获取当前聊天的唯一标识（使用 imId）
        function getCurrentChatId() {
            const contactInfo = getContactInfo();
            return contactInfo ? contactInfo.imId : null;
        }

        // 标记当前聊天已发送消息（保存到 localStorage）
        function markMessageSent(gender) {
            const chatId = getCurrentChatId();
            if (!chatId) {
                console.log('无法获取聊天ID，无法保存发送状态');
                return;
            }

            try {
                const presetMessage = getPresetMessage(gender);
                if (!presetMessage) {
                    // 即使没有预设消息（比如在自动离开时），也应该标记
                    // 这样可以防止在关闭自动离开后，脚本尝试给同一个人发送消息
                    console.log('无预设消息，但仍标记发送状态');
                }

                // 保存格式：{ chatId: { gender, message, timestamp } }
                // 注意：保存消息内容仅用于记录，判断时只检查 chatId 和 gender
                const sentMessages = JSON.parse(localStorage.getItem('qc.sentMessages') || '{}');
                sentMessages[chatId] = {
                    gender: gender,
                    message: presetMessage || '[Auto-Leaved]', // 记录一个特殊标记
                    timestamp: Date.now()
                };
                localStorage.setItem('qc.sentMessages', JSON.stringify(sentMessages));
                console.log('已保存发送状态到本地存储（聊天ID:', chatId, ', 性别:', gender === 1 ? '男生' : '女生', ')');
            } catch (e) {
                console.error('保存发送状态失败:', e);
            }
        }

        // 检查是否已发送过预设消息（从 localStorage 读取，不检查消息内容）
        function checkMessageSent(gender) {
            const chatId = getCurrentChatId();
            if (!chatId) {
                return false;
            }

            try {
                // 从 localStorage 读取已发送的消息记录
                const sentMessages = JSON.parse(localStorage.getItem('qc.sentMessages') || '{}');

                if (sentMessages[chatId]) {
                    const sentRecord = sentMessages[chatId];
                    // 只检查性别是否匹配，不检查消息内容（避免消息被和谐导致判断失败）
                    if (sentRecord.gender === gender) {
                        console.log('从本地存储检测到已发送消息（聊天ID:', chatId, ', 性别:', gender === 1 ? '男生' : '女生', ')');
                        return true;
                    }
                }

                return false;
            } catch (e) {
                console.error('读取发送状态失败:', e);
                return false;
            }
        }

        // 清除已发送消息记录（当重新匹配时调用）
        function clearSentMessage() {
            const chatId = getCurrentChatId();
            if (chatId) {
                try {
                    const sentMessages = JSON.parse(localStorage.getItem('qc.sentMessages') || '{}');
                    delete sentMessages[chatId];
                    localStorage.setItem('qc.sentMessages', JSON.stringify(sentMessages));
                    console.log('已清除聊天发送状态:', chatId);
                } catch (e) {
                    console.error('清除发送状态失败:', e);
                }
            }
        }

        // 获取当前消息状态（根据性别）
        function getMessageState(gender) {
            const hasSent = checkMessageSent(gender);
            return hasSent ? MessageState.COMPLETED : MessageState.PENDING;
        }

        // 防抖定时器
        let sendMessageTimer = null;
        let lastChatInput = null;
        let hasUpdatedPanelForCurrentChat = false; // 标记当前聊天是否已更新面板
        let lastRematchButton = null; // 记录上一次检测到的重新匹配按钮，避免重复点击
        let isSending = false; // 标记是否正在发送消息，防止重复发送

        // 处理发送消息的逻辑
        function handleSendMessage() {
            const Gender = getGender();
            if (!Gender) {
                return;
            }

            const contactInfo = getContactInfo();
            const city = contactInfo ? contactInfo.city : null;
            if (!city || city === '未知') {
                console.log('[人机检测] 城市未知，判定为人机，执行离开操作');
                isBot = true;
                markMessageSent(Gender);
                if (clickPowerButton()) {
                    setTimeout(() => {
                        clickConfirmButton();
                    }, 500);
                }
                return;
            }

            // 新增：检查是否匹配到男生并设置了自动离开
            if (Gender === 1 && SEND_SETTINGS.autoLeaveMale) {
                console.log('[自动离开] 匹配到男生，且已开启自动离开功能。执行离开操作...');
                isBot = true; // 使用 isBot 标志来阻止后续的发送消息逻辑

                // 标记为已发送（阻止后续发送逻辑）
                markMessageSent(Gender);

                // 点击电源图标执行离开操作
                if (clickPowerButton()) {
                    console.log('[自动离开] 电源图标点击成功，等待弹出框...');
                    // 等待弹出框出现后点击确认
                    setTimeout(() => {
                        clickConfirmButton();
                    }, 500);
                } else {
                    console.error('[自动离开] 未找到电源图标！');
                }
                return; // 立即返回，不执行后续的发送消息逻辑
            }

            // 如果正在发送，直接返回
            if (isSending) {
                console.log('正在发送消息，跳过重复调用');
                return;
            }

            // 如果判定为人机，不发送消息
            if (isBot) {
                console.log('已判定为人机，跳过发送消息');
                return;
            }

            // 检查是否已发送过（优先检查，避免重复发送）
            const messageState = getMessageState(Gender);
            if (messageState === MessageState.COMPLETED) {
                console.log('已发送过消息，跳过');
                return; // 已发送过，不再处理
            }

            // 检查是否允许发送给该性别
            const allowSend = (Gender === 1 && SEND_SETTINGS.sendToMale) ||
                (Gender === 2 && SEND_SETTINGS.sendToFemale);

            if (!allowSend) {
                const genderText = Gender === 1 ? '男生' : '女生';
                console.log(`性别为${genderText}，但设置中不允许发送消息`);
                return;
            }

            const ChatInput = getChatInput();
            if (!ChatInput) {
                return;
            }

            // 如果是同一个输入框且已经处理过，跳过
            if (ChatInput === lastChatInput) {
                // 再次检查是否已发送过消息
                const currentState = getMessageState(Gender);
                if (currentState === MessageState.COMPLETED) {
                    return; // 已发送过，不再处理
                }
            } else {
                // 新的输入框出现，更新记录
                lastChatInput = ChatInput;
            }

            // 如果状态是待处理，根据性别发送对应消息
            if (messageState === MessageState.PENDING) {
                const presetMessage = getPresetMessage(Gender);
                if (presetMessage) {
                    const genderText = Gender === 1 ? '男生' : '女生';
                    console.log(`检测到对话框，状态为待处理且性别为${genderText}，发送消息:`, presetMessage);

                    // 立即标记为正在发送，防止重复
                    isSending = true;
                    // 立即标记为已发送（在发送前就标记，避免重复）
                    markMessageSent(Gender);

                    sendMessage(ChatInput, presetMessage);

                    // 发送完成后重置标志
                    setTimeout(() => {
                        isSending = false;
                    }, 1000);
                }
            }
        }

        // 启动监听器
        function startObserver() {
            // 创建联系信息面板（初始化时）
            createContactInfoPanel();
            // 初始化时已创建面板，标记为已更新
            hasUpdatedPanelForCurrentChat = true;

            // 获取性别变量
            const Gender = getGender();
            console.log('当前性别:', Gender === 1 ? '男生' : Gender === 2 ? '女生' : '未知');

            // 使用 MutationObserver 监听 DOM 变化
            const observer = new MutationObserver(function (mutations) {
                // 检查对话框是否出现
                const ChatInput = getChatInput();
                if (ChatInput) {
                    // 如果是新聊天（第一次出现对话框），更新面板信息并检测人机
                    if (!hasUpdatedPanelForCurrentChat) {
                        updateContactInfoPanel();
                        hasUpdatedPanelForCurrentChat = true;

                        // 延迟发送消息（发送后会自动启动人机检测或自动离开）
                        setTimeout(() => {
                            handleSendMessage();
                        }, 500);
                    }
                    // 移除 else 分支，避免重复触发发送
                }

                // 检查重新匹配按钮是否出现（表示聊天结束）
                const RematchButton = getRematchButton();
                if (RematchButton && RematchButton !== lastRematchButton) {
                    console.log('检测到重新匹配按钮，当前聊天已结束，自动点击开始新一轮聊天');
                    // 记录这个按钮，避免重复点击
                    lastRematchButton = RematchButton;
                    // 清除当前聊天的发送状态
                    clearSentMessage();
                    // 停止人机检测
                    stopBotDetection();
                    // 重置人机标志
                    isBot = false;
                    // 重置发送标志
                    isSending = false;
                    // 重置输入框记录和面板更新标志，准备新一轮聊天
                    lastChatInput = null;
                    hasUpdatedPanelForCurrentChat = false;
                    // 自动点击重新匹配按钮
                    setTimeout(() => {
                        RematchButton.click();
                        console.log('已点击重新匹配按钮');
                    }, 300);
                } else if (!RematchButton) {
                    // 按钮消失时，重置记录，以便下次可以点击新的按钮
                    lastRematchButton = null;
                }
            });

            // 开始监听整个文档的变化
            observer.observe(document.body, {
                childList: true,    // 监听子节点的添加和删除
                subtree: true       // 监听所有后代节点
            });

            console.log('已启动监听器，实时监控对话框和重新匹配按钮');

            // 初始检查一次（延迟执行，确保页面已加载）
            setTimeout(() => {
                // 发送消息（发送后会自动启动人机检测或自动离开）
                handleSendMessage();

                // 判断按钮是否存在并点击
                const RematchButton = getRematchButton();
                if (RematchButton) {
                    console.log('找到重新匹配按钮:', RematchButton);
                    RematchButton.click();
                }
            }, 500);
        }

        // 延时执行，等待页面加载完成
        function init() {
            startObserver();
    console.log("来吧枸杞");
        }
        // 等待 DOM 加载完成后执行，并添加延时
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(init, 500); // 延时500毫秒
            });
        } else {
            setTimeout(init, 500); // 如果已经加载完成，直接延时执行
        }
})();
