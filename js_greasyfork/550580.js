// ==UserScript==
// @name         烛光匿名聊天自动匹配
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  自动点击烛光匿名聊天网站的匹配按钮
// @author       You
// @match        http://v2.webliao.cn/randomdeskrynewndendv.html?v=ndendv
// @match        http://v2.webliao.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550580/%E7%83%9B%E5%85%89%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/550580/%E7%83%9B%E5%85%89%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局状态管理 - 使用缓存和懒加载
    const state = {
        autoMatchingEnabled: false,
        customFemaleMessage: localStorage.getItem('customFemaleMessage') || '你好',
        hasUnreadMessages: false,
        isServerConnected: false,
        activeTimers: new Set(),
        messageInputVisible: false,
        // 缓存数据，避免重复读取localStorage
        _savedAccounts: null,
        _matchRecords: null,
        _lastSaveTime: 0,
        _saveDebounceTimer: null,
        
        // 获取匹配记录（懒加载 + 防抖保存）
        get matchRecords() {
            if (!this._matchRecords) {
                try {
                    this._matchRecords = JSON.parse(localStorage.getItem('matchRecords') || '[]');
                } catch (error) {
                    console.error('读取匹配记录失败:', error);
                    this._matchRecords = [];
                }
            }
            return this._matchRecords;
        },
        
        set matchRecords(records) {
            this._matchRecords = records;
            this._debounceSave('matchRecords', records);
        },
        
        // 获取保存的账号（懒加载 + 防抖保存）
        get savedAccounts() {
            if (!this._savedAccounts) {
                try {
                    this._savedAccounts = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
                } catch (error) {
                    console.error('读取保存账号失败:', error);
                    this._savedAccounts = [];
                }
            }
            return this._savedAccounts;
        },
        
        set savedAccounts(accounts) {
            this._savedAccounts = accounts;
            this._debounceSave('savedAccounts', accounts);
        },
        
        // 防抖保存到localStorage
        _debounceSave(key, data) {
            if (this._saveDebounceTimer) {
                clearTimeout(this._saveDebounceTimer);
            }
            
            this._saveDebounceTimer = setTimeout(() => {
                try {
                    localStorage.setItem(key, JSON.stringify(data));
                    this._lastSaveTime = Date.now();
                } catch (error) {
                    console.error(`保存 ${key} 失败:`, error);
                }
            }, 500); // 500ms防抖
        }
    };
 
     // 定时器管理 - 防止内存泄漏
    const setSafeTimeout = (callback, delay, description = '') => {
        const timerId = setTimeout(() => {
            state.activeTimers.delete(timerId);
            try {
                callback();
            } catch (error) {
                console.error(`定时器执行错误 [${description}]:`, error);
            }
        }, delay);
        
        state.activeTimers.add(timerId);
        
        // 防止定时器过多导致内存泄漏
        if (state.activeTimers.size > 50) {
            console.warn('定时器数量过多，清理部分定时器');
            const oldestTimer = Array.from(state.activeTimers)[0];
            clearSafeTimeout(oldestTimer);
        }
        
        return timerId;
    };

    const clearSafeTimeout = (timerId) => {
        if (timerId) {
            clearTimeout(timerId);
            state.activeTimers.delete(timerId);
        }
    };

    const cleanupTimers = () => {
        // 使用更高效的方式清理定时器
        const timers = Array.from(state.activeTimers);
        timers.forEach(timerId => {
            clearTimeout(timerId);
            state.activeTimers.delete(timerId);
        });
        state.activeTimers.clear();
        console.log(`清理了 ${timers.length} 个定时器`);
    };

    // 页面卸载时自动清理定时器
    window.addEventListener('beforeunload', () => {
        cleanupTimers();
    });

    // UI样式常量 - 统一风格
    const UI_STYLES = {
        // 颜色主题
        colors: {
            primary: '#4CAF50',
            secondary: '#FF9800', 
            danger: '#f44336',
            warning: '#FFC107',
            info: '#2196F3',
            dark: '#2d3748',
            light: '#f8f9fa',
            gray: '#718096'
        },
        
        // 按钮样式
        button: {
            base: `
                border: none;
                border-radius: 8px;
                padding: 10px 16px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            `,
            hover: `
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            `
        },
        
        // 容器样式
        container: `
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        `
    };

    // 创建UI元素
    const createUIElement = (tag, id, innerHTML, styles) => {
        const element = document.createElement(tag);
        element.id = id;
        element.innerHTML = innerHTML;
        element.style.cssText = styles;
        return element;
    };

    // 创建声音提示元素
    const createSoundElement = () => {
        if (!document.getElementById('msg_sound')) {
            const audio = document.createElement('audio');
            audio.id = 'msg_sound';
            audio.src = '/plug/tip.mp3';
            audio.preload = 'auto';
            document.body.appendChild(audio);
        }
    };

    // 性能监控工具
    const performanceMonitor = {
        timers: new Map(),
        
        startTimer: (name) => {
            performanceMonitor.timers.set(name, {
                startTime: performance.now(),
                endTime: null,
                duration: null
            });
        },
        
        endTimer: (name) => {
            const timer = performanceMonitor.timers.get(name);
            if (timer && !timer.endTime) {
                timer.endTime = performance.now();
                timer.duration = timer.endTime - timer.startTime;
                
                // 记录性能数据
                if (timer.duration > 100) { // 超过100ms的操作记录
                    console.warn(`[性能警告] ${name} 耗时 ${timer.duration.toFixed(2)}ms`);
                }
            }
            return timer ? timer.duration : null;
        },
        
        measure: async (name, fn) => {
            performanceMonitor.startTimer(name);
            try {
                const result = await fn();
                performanceMonitor.endTimer(name);
                return result;
            } catch (error) {
                performanceMonitor.endTimer(name);
                throw error;
            }
        }
    };

    // 调试工具
    const debug = {
        enabled: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        
        log: (...args) => {
            if (debug.enabled) {
                console.log('[调试]', ...args);
            }
        },
        
        info: (...args) => {
            if (debug.enabled) {
                console.info('[信息]', ...args);
            }
        },
        
        warn: (...args) => {
            if (debug.enabled) {
                console.warn('[警告]', ...args);
            }
        },
        
        error: (...args) => {
            if (debug.enabled) {
                console.error('[错误]', ...args);
            }
        }
    };

    // 错误处理工具
    const errorHandler = {
        logError: (error, context = '') => {
            console.error(`[${context}] 错误:`, error);
            debug.error(`[${context}] 错误:`, error);
            
            // 在开发模式下显示错误提示
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: #f44336;
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    z-index: 10001;
                    max-width: 300px;
                    font-size: 12px;
                `;
                errorDiv.textContent = `错误: ${context}`;
                document.body.appendChild(errorDiv);
                
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }
                }, 5000);
            }
        },
        
        safeExecute: (fn, context = '') => {
            try {
                return fn();
            } catch (error) {
                errorHandler.logError(error, context);
                return null;
            }
        }
    };

    // 播放新消息提示音
    const playMessageSound = () => {
        return errorHandler.safeExecute(() => {
            const audio = document.getElementById('msg_sound');
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(e => console.log('声音播放失败:', e));
            }
        }, 'playMessageSound');
    };

    // DOM元素缓存 - 减少重复查询
    const domCache = {
        userListContainer: null,
        matchButton: null,
        cancelButton: null,
        lastUpdate: 0,
        cacheTimeout: 3000 // 3秒缓存
    };

    // 获取缓存的DOM元素
    const getCachedElement = (id, forceRefresh = false) => {
        const now = Date.now();
        if (forceRefresh || now - domCache.lastUpdate > domCache.cacheTimeout) {
            domCache.userListContainer = document.getElementById('user_list');
            domCache.matchButton = document.getElementById('ButtonRandom');
            domCache.cancelButton = document.getElementById('randomCancel');
            domCache.lastUpdate = now;
        }
        
        switch(id) {
            case 'user_list': return domCache.userListContainer;
            case 'ButtonRandom': return domCache.matchButton;
            case 'randomCancel': return domCache.cancelButton;
            default: return document.getElementById(id);
        }
    };

    // 检查是否有新消息 - 优化性能
    const checkForNewMessages = () => {
        const userListContainer = getCachedElement('user_list');
        if (!userListContainer) return false;
        
        const previousHasUnreadMessages = state.hasUnreadMessages;
        
        // 使用更高效的DOM查询方式
        const badges = userListContainer.querySelectorAll('span.badge');
        let hasUnread = false;
        
        // 使用for循环替代some()，性能更好
        for (let i = 0; i < badges.length; i++) {
            const text = badges[i].textContent.trim();
            if (text && text !== '0' && !isNaN(parseInt(text))) {
                hasUnread = true;
                break; // 找到第一个未读消息就退出
            }
        }
        
        state.hasUnreadMessages = hasUnread;
        
        // 播放新消息提示音
        if (!previousHasUnreadMessages && state.hasUnreadMessages) {
            playMessageSound();
        }
        
        // 有新消息时停止自动匹配
        if (state.hasUnreadMessages && state.autoMatchingEnabled) {
            stopAutoMatching();
        }
        
        return state.hasUnreadMessages;
    };

    // 停止自动匹配
    const stopAutoMatching = () => {
        state.autoMatchingEnabled = false;
        cleanupTimers();
        
        const switchButton = document.getElementById('autoMatchSwitch');
        if (switchButton) {
            switchButton.innerHTML = '自动匹配: 暂停(有新消息)';
            switchButton.style.background = '#FF9800';
            switchButton.style.boxShadow = '0 2px 10px rgba(255, 152, 0, 0.5)';
        }
    };

    // 返回主页函数 - 优化性能
    const returnToHomePage = () => {
        if (!state.autoMatchingEnabled) return;

        const oldUserList = document.getElementById('oldUserList');
        if (!oldUserList) return;

        oldUserList.click();

        setSafeTimeout(() => {
            const zqlBntUsers = document.querySelector('span.zql-bnt-users');
            if (!zqlBntUsers) return;

            zqlBntUsers.click();

            setSafeTimeout(() => {
                const hasNewMessages = checkForNewMessages();
                
                if (hasNewMessages) {
                    stopAutoMatching();
                } else {
                    const upUserlist = document.querySelector('img.upUserlist');
                    if (upUserlist) {
                        upUserlist.click();
                        setSafeTimeout(startAutoMatching, 1000);
                    }
                }
            }, 500);
        }, 5);
    };

    // 检查匹配状态 - 优化性能
    const checkMatchStatus = () => {
        if (!state.autoMatchingEnabled) return;

        const cancelButton = document.getElementById('randomCancel');
        const matchButton = document.getElementById('ButtonRandom');

        if (cancelButton) {
            checkMatchStatus.startTime ??= Date.now();
            const elapsedTime = Date.now() - checkMatchStatus.startTime;
            
            if (elapsedTime > 5000) {
                cancelButton.click();
                setSafeTimeout(() => {
                    const matchBtn = document.getElementById('ButtonRandom');
                    if (matchBtn) {
                        matchBtn.click();
                        checkMatchStatus.startTime = Date.now();
                        setSafeTimeout(checkMatchStatus, 2000);
                    }
                }, 1000);
            } else {
                setSafeTimeout(checkMatchStatus, 500);
            }
        } else if (matchButton && matchButton.offsetParent !== null) {
            checkMatchStatus.startTime = undefined;
        } else {
            checkMatchStatus.startTime = undefined;
            checkGenderAndBlacklist();
        }
    };

    // 获取页面信息
    const getPageInfo = (type) => {
        const randomSelInfo = document.getElementById('randomSelInfo');
        if (!randomSelInfo) return '未知';
        
        const targetDiv = Array.from(randomSelInfo.querySelectorAll('div'))
            .find(div => div.textContent?.includes(`对方${type}：`));
            
        const span = targetDiv?.querySelector('span[style*="color:orange"]');
        return span?.textContent.trim() || '未知';
    };



    // 处理女性用户
    const handleFemaleUser = () => {
        // 获取对方信息
        const nicknameElement = document.querySelector("#randomSelInfo > div:nth-child(2) > span");
        const ageElement = document.querySelector("#randomSelInfo > div:nth-child(4) > span");
        const cityElement = document.querySelector("#randomSelInfo > div:nth-child(5) > span");
        
        const nickname = nicknameElement ? nicknameElement.textContent.trim() : '未知用户';
        const age = ageElement ? ageElement.textContent.trim() : '未知';
        const city = cityElement ? cityElement.textContent.trim() : '未知';
        
        // 记录匹配次数
        const currentTime = new Date().toISOString();
        const existingRecord = state.matchRecords.find(record => record.nickname === nickname && record.age === age && record.city === city);
        
        if (existingRecord) {
            existingRecord.matchCount++;
            existingRecord.lastMatchTime = currentTime;
        } else {
            state.matchRecords.push({
                nickname: nickname,
                age: age,
                city: city,
                matchCount: 1,
                firstMatchTime: currentTime,
                lastMatchTime: currentTime
            });
        }
        
        // 保存到localStorage
        localStorage.setItem('matchRecords', JSON.stringify(state.matchRecords));
        
        const currentMatchCount = existingRecord ? existingRecord.matchCount : 1;
        
        // 如果匹配次数大于2次（即3次及以上），提示是否拉黑，3秒后自动拉黑
        if (currentMatchCount > 2) {
            // 创建自定义确认对话框
            const createCustomConfirm = () => {
                return new Promise((resolve) => {
                    // 创建遮罩层
                    const overlay = document.createElement('div');
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 9999;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `;
                    
                    // 创建对话框
                    const dialog = document.createElement('div');
                    dialog.style.cssText = `
                        ${UI_STYLES.container}
                        max-width: 400px;
                        text-align: center;
                        padding: 24px;
                    `;
                    
                    // 倒计时显示
                    let countdown = 3;
                    const countdownElement = document.createElement('div');
                    countdownElement.style.cssText = `
                        font-size: 14px;
                        color: #f56565;
                        margin: 10px 0;
                        font-weight: bold;
                    `;
                    countdownElement.textContent = `(${countdown}秒后自动拉黑)`;
                    
                    // 更新倒计时
                    const countdownInterval = setInterval(() => {
                        countdown--;
                        if (countdown <= 0) {
                            clearInterval(countdownInterval);
                            document.body.removeChild(overlay);
                            resolve(true); // 自动拉黑
                        } else {
                            countdownElement.textContent = `(${countdown}秒后自动拉黑)`;
                        }
                    }, 1000);
                    
                    dialog.innerHTML = `
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">⚠️ 检测到重复匹配</div>
                        <div style="font-size: 14px; margin-bottom: 10px;">与用户 "${nickname}" 已匹配 ${currentMatchCount} 次</div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 15px;">年龄: ${age} | 城市: ${city}</div>
                    `;
                    dialog.appendChild(countdownElement);
                    
                    // 创建按钮容器
                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.cssText = `
                        display: flex;
                        gap: 10px;
                        justify-content: center;
                        margin-top: 15px;
                    `;
                    
                    // 确定按钮
                    const confirmBtn = document.createElement('button');
                    confirmBtn.textContent = '拉黑';
                    confirmBtn.style.cssText = `
                        background: ${UI_STYLES.colors.danger};
                        color: white;
                        ${UI_STYLES.button.base}
                        padding: 8px 16px;
                        font-size: 14px;
                    `;
                    confirmBtn.onmouseenter = () => {
                        confirmBtn.style.cssText += UI_STYLES.button.hover;
                    };
                    confirmBtn.onmouseleave = () => {
                        confirmBtn.style.cssText = confirmBtn.style.cssText.replace(UI_STYLES.button.hover, '');
                    };
                    confirmBtn.onclick = () => {
                        clearInterval(countdownInterval);
                        document.body.removeChild(overlay);
                        resolve(true);
                    };
                    
                    // 取消按钮
                    const cancelBtn = document.createElement('button');
                    cancelBtn.textContent = '取消';
                    cancelBtn.style.cssText = `
                        background: ${UI_STYLES.colors.gray};
                        color: white;
                        ${UI_STYLES.button.base}
                        padding: 8px 16px;
                        font-size: 14px;
                    `;
                    cancelBtn.onmouseenter = () => {
                        cancelBtn.style.cssText += UI_STYLES.button.hover;
                    };
                    cancelBtn.onmouseleave = () => {
                        cancelBtn.style.cssText = cancelBtn.style.cssText.replace(UI_STYLES.button.hover, '');
                    };
                    cancelBtn.onclick = () => {
                        clearInterval(countdownInterval);
                        document.body.removeChild(overlay);
                        resolve(false);
                    };
                    
                    buttonContainer.appendChild(confirmBtn);
                    buttonContainer.appendChild(cancelBtn);
                    dialog.appendChild(buttonContainer);
                    overlay.appendChild(dialog);
                    document.body.appendChild(overlay);
                });
            };
            
            // 使用自定义确认对话框
            createCustomConfirm().then((shouldBlacklist) => {
                if (shouldBlacklist) {
                    // 执行拉黑操作
                    performBlacklist();
                } else {
                    // 继续正常发送消息
                    setSafeTimeout(() => {
                        const inputField = document.getElementById('inp_say');
                        const sendButton = document.getElementById('btn_say');
                        
                        if (inputField && sendButton) {
                            inputField.value = state.customFemaleMessage;
                            sendButton.click();
                            setSafeTimeout(returnToHomePage, 500);
                        } else {
                            setSafeTimeout(returnToHomePage, 500);
                        }
                    }, 500);
                }
            });
            
            return; // 提前返回，避免执行下面的发送消息代码
        }
        
        // 直接发送消息给女性用户
        setSafeTimeout(() => {
            const inputField = document.getElementById('inp_say');
            const sendButton = document.getElementById('btn_say');
            
            if (inputField && sendButton) {
                inputField.value = state.customFemaleMessage;
                sendButton.click();
                setSafeTimeout(returnToHomePage, 500);
            } else {
                setSafeTimeout(returnToHomePage, 500);
            }
        }, 500);
    };

    // 检查性别并处理 - 优化性能
    const checkGenderAndBlacklist = () => {
        if (!state.autoMatchingEnabled) return;

        // 使用更高效的DOM查询方式
        const randomSelInfo = document.getElementById('randomSelInfo');
        if (!randomSelInfo) {
            handleMaleUser(); // 如果没有找到信息，按男性处理
            return;
        }

        const divs = randomSelInfo.querySelectorAll('div');
        let genderSpan = null;
        
        // 查找包含性别信息的div
        for (let i = 0; i < divs.length; i++) {
            if (divs[i].textContent?.includes('性别：')) {
                genderSpan = divs[i].querySelector('span');
                break;
            }
        }
        
        // 检查性别并处理
        if (genderSpan?.textContent === '女') {
            handleFemaleUser();
        } else {
            handleMaleUser();
        }
    };

    // 处理男性用户
    const handleMaleUser = () => {
        performBlacklist();
    };

    // 执行拉黑操作
    const performBlacklist = () => {
        const blackButton = document.getElementById('doBlack');
        if (blackButton) {
            blackButton.click();
            setSafeTimeout(() => {
                const confirmButtons = document.querySelectorAll('a.layui-layer-btn0');
                if (confirmButtons.length > 0) {
                    confirmButtons[0].click();
                    setSafeTimeout(returnToHomePage, 500);
                }
            }, 500);
        }
    };

    // 自动匹配启动函数 - 优化性能
    const startAutoMatching = () => {
        if (!state.autoMatchingEnabled) return;

        // 检查是否正在匹配中（存在取消按钮）
        const cancelButton = document.getElementById('randomCancel');
        if (cancelButton) {
            // 正在匹配中，不执行任何操作，让checkMatchStatus处理倒计时逻辑
            return;
        }

        const matchButton = document.getElementById('ButtonRandom');
        if (matchButton && matchButton.offsetParent !== null) {
            matchButton.click();
            matchButton.style.boxShadow = '0 0 15px #00ff00';
            setSafeTimeout(() => matchButton.style.boxShadow = '', 500);
            setSafeTimeout(checkMatchStatus, 1500);
        } else {
            setSafeTimeout(startAutoMatching, 2000);
        }
    };

    // 创建开关按钮
    const createSwitchButton = () => {
        const switchButton = document.createElement('button');
        switchButton.id = 'autoMatchSwitch';
        switchButton.innerHTML = '自动匹配: 关闭';
        switchButton.style.cssText = `
            position: fixed;
            top: 40px;
            right: 5px;
            z-index: 10000;
            background: linear-gradient(135deg, ${UI_STYLES.colors.danger} 0%, #d32f2f 100%);
            color: white;
            ${UI_STYLES.button.base}
            padding: 8px 12px;
            font-size: 12px;
        `;

        const updateButtonState = (enabled) => {
            if (enabled) {
                switchButton.innerHTML = '自动匹配: 开启';
                switchButton.style.background = `linear-gradient(135deg, ${UI_STYLES.colors.primary} 0%, #45a049 100%)`;
                switchButton.style.boxShadow = '0 2px 6px rgba(76, 175, 80, 0.3)';
                
                // 开始连接监控
                startConnectionMonitoring();
                
                // 检查当前页面是否有匹配按钮
                const matchButton = document.querySelector("#ButtonRandom");
                if (matchButton && matchButton.offsetParent !== null) {
                    // 当前页面有匹配按钮，直接开始自动匹配
                    setSafeTimeout(() => {
                        if (state.isServerConnected) startAutoMatching();
                    }, 100);
                } else {
                    // 当前页面没有匹配按钮，先跳转到有匹配按钮的页面
                    setSafeTimeout(() => {
                        returnToHomePage();
                        setSafeTimeout(() => {
                            if (state.isServerConnected) startAutoMatching();
                        }, 1000);
                    }, 100);
                }
            } else {
                switchButton.innerHTML = '自动匹配: 关闭';
                switchButton.style.background = `linear-gradient(135deg, ${UI_STYLES.colors.danger} 0%, #d32f2f 100%)`;
                switchButton.style.boxShadow = '0 2px 6px rgba(244, 67, 54, 0.3)';
                cleanupTimers();
                stopConnectionMonitoring();
            }
        };

        switchButton.addEventListener('click', () => {
            // 添加点击动画效果
            switchButton.style.transform = 'scale(0.95)';
            setSafeTimeout(() => {
                switchButton.style.transform = 'translateY(-1px)';
            }, 150);
            
            const hasMessages = checkForNewMessages();
            
            if (hasMessages && !state.autoMatchingEnabled) {
                if (confirm('检测到新消息，是否继续自动匹配？新消息将被忽略。')) {
                    state.autoMatchingEnabled = true;
                    updateButtonState(true);
                }
            } else {
                state.autoMatchingEnabled = !state.autoMatchingEnabled;
                updateButtonState(state.autoMatchingEnabled);
            }
        });

        // 优化鼠标事件处理 - 减少重复样式设置
        const updateHoverState = (isHover) => {
            const isEnabled = state.autoMatchingEnabled;
            
            if (isHover) {
                switchButton.style.transform = 'translateY(-1px)';
                if (isEnabled) {
                    switchButton.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.4)';
                    switchButton.style.background = 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)';
                } else {
                    switchButton.style.boxShadow = '0 4px 8px rgba(244, 67, 54, 0.4)';
                    switchButton.style.background = 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)';
                }
            } else {
                switchButton.style.transform = 'translateY(0)';
                if (isEnabled) {
                    switchButton.style.boxShadow = '0 2px 5px rgba(76, 175, 80, 0.3)';
                    switchButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                } else {
                    switchButton.style.boxShadow = '0 2px 5px rgba(244, 67, 54, 0.3)';
                    switchButton.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                }
            }
        };

        switchButton.addEventListener('mouseenter', () => updateHoverState(true));
        switchButton.addEventListener('mouseleave', () => updateHoverState(false));

        document.body.appendChild(switchButton);
        
        // 创建消息设置按钮
        createMessageSettingsButton();
        
        // 创建账号切换按钮
        createAccountSwitchButton();
    };



    // 创建自定义消息设置按钮
    const createMessageSettingsButton = () => {
        const messageButton = document.createElement('button');
        messageButton.id = 'messageSettings';
        messageButton.innerHTML = '💬';
        messageButton.style.cssText = `
            position: fixed;
            top: 40px;
            right: 120px;
            z-index: 10000;
            background: linear-gradient(135deg, ${UI_STYLES.colors.secondary} 0%, #F57C00 100%);
            color: white;
            ${UI_STYLES.button.base}
            padding: 8px 12px;
            font-size: 12px;
            width: auto;
            height: auto;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const messageContainer = document.createElement('div');
        messageContainer.id = 'messageContainer';
        messageContainer.style.cssText = `
            position: fixed;
            top: 70px;
            right: 120px;
            z-index: 10001;
            ${UI_STYLES.container}
            width: 320px;
            max-width: 95vw;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        messageContainer.innerHTML = `
            <div style="margin-bottom: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                    <h4 style="margin: 0; color: #2d3748; font-size: 16px; font-weight: 700;">💬 消息设置</h4>
                    <button onclick="document.getElementById('messageContainer').style.display='none';" style="
                        background: none;
                        border: none;
                        font-size: 18px;
                        color: #a0aec0;
                        cursor: pointer;
                        padding: 4px;
                        border-radius: 50%;
                        transition: all 0.3s;
                        width: 28px;
                        height: 28px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    " onmouseenter="this.style.background='#f7fafc'; this.style.color='#718096'" onmouseleave="this.style.background='none'; this.style.color='#a0aec0'">×</button>
                </div>
                <div style="font-size: 12px; color: #718096; margin-bottom: 16px;">设置发送给女性用户的消息内容</div>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 12px; color: #4a5568; font-weight: 600; margin-bottom: 8px;">女性消息文本</label>
                    <input type="text" id="femaleMessageInput" value="${state.customFemaleMessage}" style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        font-size: 14px;
                        outline: none;
                        transition: all 0.3s;
                        background: #f7fafc;
                        box-sizing: border-box;
                    " onfocus="this.style.borderColor='#FF9800'; this.style.boxShadow='0 0 0 3px rgba(255, 152, 0, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'">
                </div>
                
                <button id="saveMessageBtn" style="
                    width: 100%;
                    background: linear-gradient(135deg, ${UI_STYLES.colors.secondary} 0%, #F57C00 100%);
                    color: white;
                    ${UI_STYLES.button.base}
                    padding: 12px 16px;
                    font-size: 14px;
                " onmouseenter="this.style.cssText += '${UI_STYLES.button.hover}'" onmouseleave="this.style.cssText = this.style.cssText.replace('${UI_STYLES.button.hover}', '')">💾 保存消息</button>
            </div>
        `;

        // 保存按钮事件
        const saveButton = messageContainer.querySelector('#saveMessageBtn');
        const messageInput = messageContainer.querySelector('#femaleMessageInput');
        
        saveButton.addEventListener('click', () => {
            const newMessage = messageInput.value.trim();
            if (newMessage) {
                state.customFemaleMessage = newMessage;
                localStorage.setItem('customFemaleMessage', newMessage);
                
                saveButton.innerHTML = '✅ 保存成功！';
                saveButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                saveButton.style.boxShadow = '0 2px 6px rgba(76, 175, 80, 0.3)';
                
                setSafeTimeout(() => {
                    saveButton.innerHTML = '💾 保存消息';
                    saveButton.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
                    saveButton.style.boxShadow = '0 2px 6px rgba(255, 152, 0, 0.3)';
                }, 1500);
            }
        });

        // 回车保存
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveButton.click();
            }
        });

        messageButton.addEventListener('click', () => {
            state.messageInputVisible = !state.messageInputVisible;
            if (state.messageInputVisible) {
                messageContainer.style.display = 'block';
            } else {
                messageContainer.style.display = 'none';
            }
        });

        // 优化鼠标事件处理 - 减少重复样式设置
        const updateMessageButtonHover = (isHover) => {
            if (isHover) {
                messageButton.style.cssText += UI_STYLES.button.hover;
                messageButton.style.background = 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)';
            } else {
                messageButton.style.cssText = messageButton.style.cssText.replace(UI_STYLES.button.hover, '');
                messageButton.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
            }
        };

        messageButton.addEventListener('mouseenter', () => updateMessageButtonHover(true));
        messageButton.addEventListener('mouseleave', () => updateMessageButtonHover(false));

        document.body.appendChild(messageButton);
        document.body.appendChild(messageContainer);
        
        // 添加响应式样式
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                #messageContainer {
                    position: fixed !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    width: 90vw !important;
                    max-width: 400px !important;
                    max-height: 80vh !important;
                    overflow-y: auto !important;
                    padding: 20px !important;
                    margin: 0 !important;
                    right: auto !important;
                }
                
                #femaleMessageInput {
                    font-size: 16px !important; /* 防止iOS缩放 */
                    padding: 14px 16px !important;
                }
                
                #saveMessageBtn {
                    padding: 14px 16px !important;
                    font-size: 16px !important;
                }
            }
            
            @media (max-width: 480px) {
                #messageContainer {
                    width: 95vw !important;
                    padding: 16px !important;
                }
                
                #messageContainer h4 {
                    font-size: 18px !important;
                }
                
                #femaleMessageInput {
                    padding: 12px 14px !important;
                }
                
                #saveMessageBtn {
                    padding: 12px 14px !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        // 添加窗口大小变化监听
        const handleMessageResize = () => {
            const isMobile = window.innerWidth <= 768;
            const messageContainer = document.getElementById('messageContainer');
            
            if (messageContainer) {
                if (isMobile) {
                    messageContainer.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 10001;
                        ${UI_STYLES.container}
                        width: 90vw;
                        max-width: 400px;
                        max-height: 80vh;
                        overflow-y: auto;
                        padding: 20px;
                        display: ${messageContainer.style.display};
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    `;
                } else {
                    messageContainer.style.cssText = `
                        position: fixed;
                        top: 70px;
                        right: 120px;
                        z-index: 10001;
                        ${UI_STYLES.container}
                        width: 320px;
                        max-width: 95vw;
                        display: ${messageContainer.style.display};
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    `;
                }
            }
            
            // 保持消息按钮位置不变
            const messageButton = document.getElementById('messageSettings');
            if (messageButton) {
                messageButton.style.cssText = `
                    position: fixed;
                    top: 40px;
                    right: 120px;
                    z-index: 10000;
                    background: linear-gradient(135deg, ${UI_STYLES.colors.secondary} 0%, #F57C00 100%);
                    color: white;
                    ${UI_STYLES.button.base}
                    padding: 8px 12px;
                    font-size: 12px;
                    width: auto;
                    height: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
            }
        };
        
        // 初始设置
        handleMessageResize();
        
        // 监听窗口大小变化
        window.addEventListener('resize', handleMessageResize);
        
        // 添加关闭事件监听，移除事件监听器
        const originalDisplay = messageContainer.style.display;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style') {
                    const currentDisplay = messageContainer.style.display;
                    if (currentDisplay === 'none' && originalDisplay !== 'none') {
                        window.removeEventListener('resize', handleMessageResize);
                    }
                }
            });
        });
        
        observer.observe(messageContainer, { attributes: true });
    };



    // 创建账号管理按钮
    const createAccountSwitchButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '👤 账号管理';
        button.style.cssText = `
            position: fixed;
            top: 80px;
            right: 5px;
            z-index: 10000;
            background: linear-gradient(135deg, ${UI_STYLES.colors.info} 0%, #764ba2 100%);
            color: white;
            ${UI_STYLES.button.base}
            padding: 8px 12px;
            font-size: 12px;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.cssText += UI_STYLES.button.hover;
            button.style.background = 'linear-gradient(135deg, #5a6fd8 0%, #6a42b0 100%)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.cssText = button.style.cssText.replace(UI_STYLES.button.hover, '');
            button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        });
        
        button.addEventListener('click', showAccountManagementPanel);
        
        document.body.appendChild(button);
        return button;
    };

    // 显示账号管理面板
    const showAccountManagementPanel = () => {
        // 如果面板已存在，先移除
        const existingPanel = document.getElementById('accountManagementPanel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }
        
        // 获取当前user_id
        const cookies = document.cookie.split('; ');
        let currentUserId = '';
        for (const cookie of cookies) {
            if (cookie.startsWith('user_id=')) {
                currentUserId = cookie.split('=')[1];
                break;
            }
        }
        
        // 获取已保存的user_id列表
        const savedAccounts = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
        
        // 检测是否为移动设备
        const isMobile = window.innerWidth <= 768;
        
        // 获取布局偏好设置
        const layoutPreference = localStorage.getItem('accountLayoutPreference') || (isMobile ? 'single' : 'double');
        
        const panel = document.createElement('div');
        panel.id = 'accountManagementPanel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            ${UI_STYLES.container}
            padding: ${isMobile ? '20px' : '32px'};
            min-width: ${isMobile ? 'auto' : '800px'};
            max-width: ${isMobile ? '95vw' : '900px'};
            width: ${isMobile ? '90vw' : 'auto'};
            max-height: 85vh;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease-in-out;
        `;
        
        panel.innerHTML = `
            <div style="margin-bottom: 24px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
                    <h3 style="margin: 0; color: #2d3748; font-size: 20px; font-weight: 700;">👤 账号管理</h3>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button id="layoutToggleBtn" style="
                            background: linear-gradient(135deg, ${layoutPreference === 'single' ? '#4CAF50' : '#667eea'} 0%, ${layoutPreference === 'single' ? '#45a049' : '#764ba2'} 100%);
                            color: white;
                            ${UI_STYLES.button.base}
                            padding: 6px 12px;
                            font-size: 12px;
                            margin-right: 8px;
                        " onmouseenter="this.style.cssText += '${UI_STYLES.button.hover}'" onmouseleave="this.style.cssText = this.style.cssText.replace('${UI_STYLES.button.hover}', '')">
                            ${layoutPreference === 'single' ? '📱 单列' : '💻 双列'}
                        </button>
                        <button onclick="document.getElementById('accountManagementPanel').remove(); document.getElementById('accountManagementOverlay')?.remove()" style="
                            background: none;
                            border: none;
                            font-size: 20px;
                            color: #a0aec0;
                            cursor: pointer;
                            padding: 4px;
                            border-radius: 50%;
                            transition: all 0.3s;
                            width: 32px;
                            height: 32px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        " onmouseenter="this.style.background='#f7fafc'; this.style.color='#718096'" onmouseleave="this.style.background='none'; this.style.color='#a0aec0'">×</button>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%); padding: 16px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                    <div style="font-size: 12px; color: #4a5568; margin-bottom: 6px; font-weight: 600;">当前账号</div>
                    <div style="font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; word-break: break-all; color: #38a169; font-weight: 600; font-size: 14px;">${currentUserId || '未登录'}</div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 14px; color: #2d3748; font-weight: 600; margin-bottom: 12px;">添加新账号</div>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div>
                            <input type="text" id="newUserIdInput" placeholder="请输入user_id" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 1px solid #e2e8f0;
                                border-radius: 8px;
                                font-size: 14px;
                                outline: none;
                                transition: all 0.3s;
                                background: #f7fafc;
                            " onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'">
                        </div>
                        <div>
                            <input type="text" id="newUserRemarkInput" placeholder="备注（可选）" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 1px solid #e2e8f0;
                                border-radius: 8px;
                                font-size: 14px;
                                outline: none;
                                transition: all 0.3s;
                                background: #f7fafc;
                            " onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'">
                        </div>
                        <div>
                            <input type="text" id="newUserNicknameInput" placeholder="昵称（可选，支持URL解码）" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 1px solid #e2e8f0;
                                border-radius: 8px;
                                font-size: 14px;
                                outline: none;
                                transition: all 0.3s;
                                background: #f7fafc;
                            " onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'">
                        </div>
                        <button onclick="addNewUserId()" style="
                            background: linear-gradient(135deg, ${UI_STYLES.colors.info} 0%, #764ba2 100%);
                            color: white;
                            ${UI_STYLES.button.base}
                            padding: 12px 24px;
                            font-size: 14px;
                        " onmouseenter="this.style.cssText += '${UI_STYLES.button.hover}'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)'" onmouseleave="this.style.cssText = this.style.cssText.replace('${UI_STYLES.button.hover}', ''); this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.3)'">➕ 添加账号</button>
                    </div>
                </div>
                
                <div id="accountSection" style="${layoutPreference === 'single' ? 'width: 100%; margin-bottom: 24px;' : 'width: 48%; margin-right: 4%; float: left;'}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="font-size: 14px; color: #2d3748; font-weight: 600;">已保存账号</div>
                        <div style="font-size: 11px; color: #718096;">共 <span id="accountCount">0</span> 个</div>
                    </div>
                    <div id="savedUserIdsList" style="max-height: ${layoutPreference === 'single' ? '180px' : '220px'}; overflow-y: auto; border-radius: 8px; background: #f7fafc; border: 1px solid #e2e8f0; scrollbar-width: thin; scrollbar-color: #cbd5e0 #f7fafc;"></div>
                </div>
                
                <div id="recordSection" style="${layoutPreference === 'single' ? 'width: 100%;' : 'width: 48%; float: left;'}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="font-size: 14px; color: #2d3748; font-weight: 600;">匹配记录</div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div style="display: flex; gap: 4px;">
                                <button id="sortByTimeBtn" style="background: linear-gradient(135deg, ${UI_STYLES.colors.info} 0%, #764ba2 100%); color: white; ${UI_STYLES.button.base} padding: 4px 8px; font-size: 11px;">按时间</button>
                                <button id="sortByCountBtn" style="background: linear-gradient(135deg, ${UI_STYLES.colors.warning} 0%, #f5576c 100%); color: white; ${UI_STYLES.button.base} padding: 4px 8px; font-size: 11px;">按次数</button>
                                <button id="clearMatchRecordsBtn" style="background: linear-gradient(135deg, ${UI_STYLES.colors.danger} 0%, #e53e3e 100%); color: white; ${UI_STYLES.button.base} padding: 4px 8px; font-size: 11px;">清除</button>
                            </div>
                            <div style="font-size: 11px; color: #718096;">共 <span id="recordCount">0</span> 条</div>
                        </div>
                    </div>
                    <div id="matchRecordsList" style="max-height: ${layoutPreference === 'single' ? '180px' : '200px'}; overflow-y: auto; border-radius: 8px; background: #f7fafc; border: 1px solid #e2e8f0; padding: 12px; scrollbar-width: thin; scrollbar-color: #cbd5e0 #f7fafc;"></div>
                </div>
                
                <!-- 清除浮动 -->
                ${layoutPreference === 'double' ? '<div style="clear: both;"></div>' : ''}
            </div>
        `;
        
        document.body.appendChild(panel);
        updateSavedAccountsList();
        updateMatchRecordsList();
        
        // 添加布局切换按钮事件 - 优化性能
        const layoutToggleBtn = document.getElementById('layoutToggleBtn');
        if (layoutToggleBtn) {
            layoutToggleBtn.addEventListener('click', () => {
                const currentLayout = localStorage.getItem('accountLayoutPreference') || (window.innerWidth <= 768 ? 'single' : 'double');
                const newLayout = currentLayout === 'single' ? 'double' : 'single';
                localStorage.setItem('accountLayoutPreference', newLayout);
                
                // 重新打开面板 - 使用更高效的方式
                const overlay = document.getElementById('accountManagementOverlay');
                if (overlay) overlay.remove();
                panel.remove();
                showAccountManagementPanel();
            });
        }
        
        // 添加排序按钮事件
        const sortByTimeBtn = document.getElementById('sortByTimeBtn');
        const sortByCountBtn = document.getElementById('sortByCountBtn');
        
        if (sortByTimeBtn) {
            sortByTimeBtn.addEventListener('click', () => {
                updateMatchRecordsList('time');
                sortByTimeBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                sortByCountBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            });
        }
        
        if (sortByCountBtn) {
            sortByCountBtn.addEventListener('click', () => {
                updateMatchRecordsList('count');
                sortByCountBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                sortByTimeBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            });
        }
        

        
        // 添加清除按钮事件
        const clearMatchRecordsBtn = document.getElementById('clearMatchRecordsBtn');
        if (clearMatchRecordsBtn) {
            clearMatchRecordsBtn.addEventListener('click', () => {
                clearMatchRecords();
            });
        }
        
        // 添加背景遮罩
        const overlay = document.createElement('div');
        overlay.id = 'accountManagementOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10000;
            backdrop-filter: blur(2px);
            animation: fadeIn 0.3s ease;
        `;
        overlay.addEventListener('click', () => {
            panel.remove();
            overlay.remove();
        });
        
        document.body.appendChild(overlay);
        
        // 添加淡入动画和滚动条样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            #accountManagementPanel {
                animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes slideIn {
                from { 
                    opacity: 0; 
                    transform: translate(-50%, -60%); 
                }
                to { 
                    opacity: 1; 
                    transform: translate(-50%, -50%); 
                }
            }
            /* 自定义滚动条样式 */
            #savedUserIdsList::-webkit-scrollbar,
            #matchRecordsList::-webkit-scrollbar {
                width: 6px;
            }
            #savedUserIdsList::-webkit-scrollbar-track,
            #matchRecordsList::-webkit-scrollbar-track {
                background: #f7fafc;
                border-radius: 3px;
            }
            #savedUserIdsList::-webkit-scrollbar-thumb,
            #matchRecordsList::-webkit-scrollbar-thumb {
                background: #cbd5e0;
                border-radius: 3px;
            }
            #savedUserIdsList::-webkit-scrollbar-thumb:hover,
            #matchRecordsList::-webkit-scrollbar-thumb:hover {
                background: #a0aec0;
            }
            /* 响应式样式 */
            @media (max-width: 768px) {
                #accountManagementPanel {
                    padding: 20px !important;
                    min-width: auto !important;
                    max-width: 95vw !important;
                    width: 90vw !important;
                }
                #accountSection, #recordSection {
                    width: 100% !important;
                    float: none !important;
                    margin-right: 0 !important;
                    margin-bottom: 20px !important;
                }
                #savedUserIdsList, #matchRecordsList {
                    max-height: 180px !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        // 添加窗口大小变化监听
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768;
            const currentLayout = localStorage.getItem('accountLayoutPreference') || (isMobile ? 'single' : 'double');
            
            // 如果当前布局与设备不匹配，自动切换
            if (isMobile && currentLayout === 'double') {
                localStorage.setItem('accountLayoutPreference', 'single');
                const overlay = document.getElementById('accountManagementOverlay');
                if (overlay) overlay.remove();
                panel.remove();
                showAccountManagementPanel();
            } else if (!isMobile && currentLayout === 'single') {
                localStorage.setItem('accountLayoutPreference', 'double');
                const overlay = document.getElementById('accountManagementOverlay');
                if (overlay) overlay.remove();
                panel.remove();
                showAccountManagementPanel();
            }
        };
        
        // 添加事件监听器
        window.addEventListener('resize', handleResize);
        
        // 在面板关闭时移除事件监听器
        const originalRemove = panel.remove;
        panel.remove = function() {
            window.removeEventListener('resize', handleResize);
            originalRemove.call(this);
        };

        // 添加事件监听
        document.getElementById('newUserIdInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addNewUserId();
        });
    };

    // 添加新user_id
    const addNewUserId = () => {
        const input = document.getElementById('newUserIdInput');
        const remarkInput = document.getElementById('newUserRemarkInput');
        const nicknameInput = document.getElementById('newUserNicknameInput');
        const newUserId = input.value.trim();
        const newUserRemark = remarkInput.value.trim();
        let newUserNickname = nicknameInput.value.trim();
        
        if (!newUserId) {
            alert('请输入user_id');
            return;
        }

        // 使用缓存的数据或从localStorage读取
        if (!state.savedAccounts) {
            state.savedAccounts = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
        }
        
        // 检查是否已存在相同的user_id
        if (state.savedAccounts.some(account => account.userId === newUserId)) {
            alert('该user_id已存在');
            return;
        }

        // 自动URL解码昵称（如果包含URL编码字符）
        if (newUserNickname && newUserNickname.includes('%')) {
            try {
                newUserNickname = decodeURIComponent(newUserNickname);
                console.log('昵称已自动解码:', newUserNickname);
            } catch (error) {
                console.warn('昵称解码失败，使用原始值:', newUserNickname);
            }
        }

        // 添加新账号（包含备注和昵称）
        state.savedAccounts.push({
            userId: newUserId,
            remark: newUserRemark || `账号${state.savedAccounts.length + 1}`,
            nickname: newUserNickname || '',
            createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('savedAccounts', JSON.stringify(state.savedAccounts));
        
        // 清空输入框但不关闭面板
        input.value = '';
        remarkInput.value = '';
        nicknameInput.value = '';
        
        // 刷新账号列表显示
        updateSavedAccountsList();
    };

    // 更新已保存账号列表显示
    const updateSavedAccountsList = () => {
        const savedAccountsList = document.getElementById('savedUserIdsList');
        const accountCountElement = document.getElementById('accountCount');
        if (!savedAccountsList) return;
        
        // 缓存localStorage读取
        if (!state.savedAccounts) {
            state.savedAccounts = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
        }
        const savedAccounts = state.savedAccounts;
        
        // 更新账号计数
        if (accountCountElement) {
            accountCountElement.textContent = savedAccounts.length;
            accountCountElement.style.color = '#718096';
            accountCountElement.style.fontWeight = 'normal';
        }
        
        // 获取当前user_id
        const cookies = document.cookie.split('; ');
        let currentUserId = '';
        for (const cookie of cookies) {
            if (cookie.startsWith('user_id=')) {
                currentUserId = cookie.split('=')[1];
                break;
            }
        }
        
        if (savedAccounts.length === 0) {
            savedAccountsList.innerHTML = `
                <div style="
                    text-align: center; 
                    color: #a0aec0; 
                    padding: 40px 20px;
                    font-size: 14px;
                    background: #f7fafc;
                    border-radius: 8px;
                    border: 2px dashed #e2e8f0;
                ">
                    <div style="font-size: 48px; margin-bottom: 8px;">👤</div>
                    <div>暂无保存的账号</div>
                    <div style="font-size: 12px; color: #cbd5e0; margin-top: 4px;">点击上方添加账号开始使用</div>
                </div>
            `;
        } else {
            // 使用数组map和join优化字符串拼接
            const htmlArray = savedAccounts.map((account, index) => {
                const isCurrent = account.userId === currentUserId;
                return `
                    <div style="
                        padding: 16px;
                        margin: 8px;
                        background: ${isCurrent ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' : 'white'};
                        border-radius: 12px;
                        border: 1px solid ${isCurrent ? '#38a169' : '#e2e8f0'};
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                        transition: all 0.3s ease;
                    " onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.12)'" onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.08)'">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <button onclick="deleteUserId('${account.userId}')" style="
                                background: ${isCurrent ? 'rgba(255, 255, 255, 0.2)' : '${UI_STYLES.colors.danger}'};
                                color: ${isCurrent ? 'white' : 'white'};
                                ${UI_STYLES.button.base}
                                padding: 6px 12px;
                                font-size: 12px;
                            " onmouseenter="this.style.background='${isCurrent ? 'rgba(255, 255, 255, 0.3)' : '#f56565'}'; this.style.cssText += '${UI_STYLES.button.hover}'; this.style.transform='scale(1.05)'" onmouseleave="this.style.background='${isCurrent ? 'rgba(255, 255, 255, 0.2)' : '${UI_STYLES.colors.danger}'}'; this.style.cssText = this.style.cssText.replace('${UI_STYLES.button.hover}', ''); this.style.transform='scale(1)'">🗑️</button>
                            
                            <span style="
                                flex: 1; 
                                font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; 
                                word-break: break-all; 
                                color: ${isCurrent ? 'white' : '#2d3748'};
                                font-size: 13px;
                                font-weight: 600;
                                line-height: 1.4;
                            ">${account.userId}</span>
                            
                            <button onclick="switchToUserId('${account.userId}')" style="
                                background: ${isCurrent ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(135deg, ${UI_STYLES.colors.info} 0%, #764ba2 100%)'};
                                color: ${isCurrent ? 'white' : 'white'};
                                ${UI_STYLES.button.base}
                                padding: 6px 12px;
                                font-size: 12px;
                                box-shadow: ${isCurrent ? 'none' : '0 2px 6px rgba(102, 126, 234, 0.3)'};
                            " onmouseenter="this.style.background='${isCurrent ? 'rgba(255, 255, 255, 0.3)' : 'linear-gradient(135deg, #5a6fd8 0%, #6a42b0 100%)'}'; this.style.cssText += '${UI_STYLES.button.hover}'; this.style.transform='scale(1.05)'; this.style.boxShadow='${isCurrent ? 'none' : '0 4px 10px rgba(102, 126, 234, 0.4)'}'" onmouseleave="this.style.background='${isCurrent ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(135deg, ${UI_STYLES.colors.info} 0%, #764ba2 100%)'}'; this.style.cssText = this.style.cssText.replace('${UI_STYLES.button.hover}', ''); this.style.transform='scale(1)'; this.style.boxShadow='${isCurrent ? 'none' : '0 2px 6px rgba(102, 126, 234, 0.3)'}'">${isCurrent ? '✅ 当前' : '🔄 切换'}</button>
                        </div>
                        <div style="
                            font-size: 12px; 
                            color: ${isCurrent ? 'rgba(255, 255, 255, 0.9)' : '#718096'};
                            padding-left: 48px;
                            font-weight: 500;
                            margin-top: 4px;
                        ">
                            📝 ${account.remark || '无备注'}
                        </div>
                        ${account.nickname ? `
                        <div style="
                            font-size: 12px; 
                            color: ${isCurrent ? 'rgba(255, 255, 255, 0.9)' : '#4a5568'};
                            padding-left: 48px;
                            font-weight: 500;
                            margin-top: 2px;
                            background: ${isCurrent ? 'rgba(255, 255, 255, 0.1)' : '#edf2f7'};
                            padding: 4px 8px;
                            border-radius: 4px;
                            display: inline-block;
                        ">
                            👤 ${account.nickname}
                        </div>
                        ` : ''}
                    </div>
                `;
            });
            savedAccountsList.innerHTML = htmlArray.join('');
        }
    };

    // 更新匹配记录列表显示
    const updateMatchRecordsList = (sortBy = 'count') => {
        const matchRecordsList = document.getElementById('matchRecordsList');
        const recordCountElement = document.getElementById('recordCount');
        if (!matchRecordsList) return;
        
        // 缓存localStorage读取
        if (!state.matchRecords) {
            state.matchRecords = JSON.parse(localStorage.getItem('matchRecords') || '[]');
        }
        
        // 更新记录计数
        if (recordCountElement) {
            recordCountElement.textContent = state.matchRecords.length;
            recordCountElement.style.color = '#718096';
            recordCountElement.style.fontWeight = 'normal';
        }
        
        if (state.matchRecords.length === 0) {
            matchRecordsList.innerHTML = '<div style="padding: 16px; text-align: center; color: #718096;">暂无匹配记录</div>';
            return;
        }
        
        // 根据排序方式排序（避免修改原数组）
        const sortedRecords = [...state.matchRecords];
        if (sortBy === 'time') {
            // 按最近匹配时间降序排序
            sortedRecords.sort((a, b) => new Date(b.lastMatchTime) - new Date(a.lastMatchTime));
        } else {
            // 按匹配次数降序排序
            sortedRecords.sort((a, b) => b.matchCount - a.matchCount);
        }
        
        matchRecordsList.innerHTML = sortedRecords.map(record => {
            const firstMatchTime = new Date(record.firstMatchTime).toLocaleString();
            const lastMatchTime = new Date(record.lastMatchTime).toLocaleString();
            const isFrequent = record.matchCount >= 3;
            
            return `
                <div style="margin-bottom: 12px; padding: 12px; border-radius: 6px; background: white; border-left: 4px solid ${isFrequent ? UI_STYLES.colors.danger : UI_STYLES.colors.success};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="font-size: 14px; font-weight: 600; color: #2d3748;">${record.nickname}</div>
                        <div style="font-size: 12px; color: ${isFrequent ? UI_STYLES.colors.danger : UI_STYLES.colors.success}; font-weight: 600;">${record.matchCount} 次</div>
                    </div>
                    <div style="font-size: 12px; color: #4a5568; margin-bottom: 8px;">
                        <span style="background: #edf2f7; padding: 2px 6px; border-radius: 4px; margin-right: 8px;">年龄: ${record.age}</span>
                        <span style="background: #edf2f7; padding: 2px 6px; border-radius: 4px;">城市: ${record.city}</span>
                    </div>
                    <div style="font-size: 11px; color: #718096;">
                        <div>首次匹配: ${firstMatchTime}</div>
                        <div>最近匹配: ${lastMatchTime}</div>
                    </div>
                </div>
            `;
        }).join('');
    };

    // 删除user_id
    const deleteUserId = (userId) => {
        if (confirm(`确定要删除该账号吗？`)) {
            // 直接操作localStorage，避免缓存问题
            const savedAccounts = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
            const filteredAccounts = savedAccounts.filter(account => account.userId !== userId);
            localStorage.setItem('savedAccounts', JSON.stringify(filteredAccounts));
            
            // 强制重置懒加载缓存
            state._savedAccounts = null;
            
            // 更新列表显示
            updateSavedAccountsList();
        }
    };

    // 清除匹配记录
    const clearMatchRecords = () => {
        // 清除localStorage中的匹配记录
        localStorage.removeItem('matchRecords');
        
        // 强制重置懒加载缓存
        state._matchRecords = null;
        
        // 更新匹配记录列表显示
        updateMatchRecordsList();
    };

    // 刷新缓存数据（当数据被外部修改时调用）
    const refreshCachedData = () => {
        state.savedAccounts = null;
        state.matchRecords = null;
    };

    // 切换到指定user_id
    const switchToUserId = (userId) => {
        // 使用缓存的数据获取账号信息
        if (!state.savedAccounts) {
            state.savedAccounts = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
        }
        const account = state.savedAccounts.find(acc => acc.userId === userId);
        
        // 删除旧的cookie
        document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'user_nickname_random=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        
        // 设置新的user_id cookie
        document.cookie = `user_id=${userId}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30天有效期
        
        // 如果账号有昵称，设置user_nickname_random cookie
        if (account && account.nickname) {
            // 对昵称进行URL编码
            const encodedNickname = encodeURIComponent(account.nickname);
            document.cookie = `user_nickname_random=${encodedNickname}; path=/; max-age=${60 * 60 * 24 * 30}`;
            console.log('已设置昵称cookie:', account.nickname, '->', encodedNickname);
        }
        
        // 立即刷新页面
        window.location.reload();
    };

    // 网络连接状态监控和重连机制
    let lastConnectionTime = Date.now();
    let connectionCheckInterval = null;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const CONNECTION_TIMEOUT = 10000; // 10秒连接超时

    // 检查连接状态
    const checkConnectionStatus = () => {
        const timeSinceLastConnection = Date.now() - lastConnectionTime;
        
        // 如果超过超时时间且自动匹配开启，尝试重连
        if (timeSinceLastConnection > CONNECTION_TIMEOUT && state.autoMatchingEnabled) {
            console.warn(`连接超时 (${timeSinceLastConnection}ms)，尝试重连...`);
            reconnectAttempts++;
            
            if (reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
                attemptReconnect();
            } else {
                console.error('重连失败次数过多，停止自动匹配');
                if (state.autoMatchingEnabled) {
                    state.autoMatchingEnabled = false;
                    const switchButton = document.getElementById('autoMatchSwitch');
                    if (switchButton) {
                        switchButton.innerHTML = '自动匹配: 关闭';
                        switchButton.style.background = `linear-gradient(135deg, ${UI_STYLES.colors.danger} 0%, #d32f2f 100%)`;
                    }
                    alert('网络连接中断，自动匹配已停止。请检查网络后重新开启。');
                }
                stopConnectionMonitoring();
            }
        }
    };

    // 尝试重连
    const attemptReconnect = () => {
        console.log(`尝试重连 (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
        
        // 模拟重新连接：刷新页面或重新初始化
        const matchButton = document.getElementById('ButtonRandom');
        if (matchButton && matchButton.offsetParent !== null) {
            // 如果匹配按钮可见，尝试点击重新连接
            matchButton.click();
            setSafeTimeout(() => {
                // 检查是否重新连接成功
                const cancelButton = document.getElementById('randomCancel');
                if (cancelButton) {
                    console.log('重连成功，恢复自动匹配');
                    reconnectAttempts = 0;
                    lastConnectionTime = Date.now();
                    startAutoMatching();
                }
            }, 2000);
        } else {
            // 如果不在匹配页面，跳转到首页重新连接
            returnToHomePage();
            setSafeTimeout(() => {
                const matchBtn = document.getElementById('ButtonRandom');
                if (matchBtn) {
                    matchBtn.click();
                    setSafeTimeout(() => {
                        reconnectAttempts = 0;
                        lastConnectionTime = Date.now();
                        startAutoMatching();
                    }, 3000);
                }
            }, 1000);
        }
    };

    // 开始连接监控
    const startConnectionMonitoring = () => {
        if (!connectionCheckInterval) {
            connectionCheckInterval = setInterval(checkConnectionStatus, 5000); // 每5秒检查一次
            console.log('开始网络连接监控');
        }
    };

    // 停止连接监控
    const stopConnectionMonitoring = () => {
        if (connectionCheckInterval) {
            clearInterval(connectionCheckInterval);
            connectionCheckInterval = null;
            console.log('停止网络连接监控');
        }
    };

    // 更新连接时间
    const updateConnectionTime = () => {
        lastConnectionTime = Date.now();
        reconnectAttempts = 0; // 重置重连尝试次数
    };

    // 重写原生的Con_Succ函数来检测服务器连接状态
    const originalConSucc = window.Con_Succ;
    window.Con_Succ = (content) => {
        state.isServerConnected = true;
        updateConnectionTime(); // 更新连接时间

        if (typeof originalConSucc === 'function') {
            originalConSucc(content);
        }

        if (!document.getElementById('autoMatchSwitch')) {
            createSoundElement();
            createSwitchButton();
        }
        
        // 开始连接监控
        startConnectionMonitoring();
        
        const switchButton = document.getElementById('autoMatchSwitch');
        if (switchButton && state.autoMatchingEnabled) {
            startAutoMatching();
        }
    };

    // 页面卸载时的清理机制
    const cleanupOnUnload = () => {
        cleanupTimers();
        // 清理缓存数据
        state.savedAccounts = null;
        state.matchRecords = null;
        // 清理所有全局事件监听器
        window.removeEventListener('beforeunload', cleanupOnUnload);
        // 清理所有DOM元素
        const elementsToRemove = [
            'autoMatchSwitch', 'messageSettingsButton', 'accountSwitchButton',
            'accountManagementPanel', 'accountManagementOverlay'
        ];
        elementsToRemove.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.remove();
        });
    };
    window.addEventListener('beforeunload', cleanupOnUnload);

    // 注册全局函数（避免重复注册）
    if (!window.deleteUserId) window.deleteUserId = deleteUserId;
    if (!window.switchToUserId) window.switchToUserId = switchToUserId;
    if (!window.addNewUserId) window.addNewUserId = addNewUserId;
    if (!window.updateMatchRecordsList) window.updateMatchRecordsList = updateMatchRecordsList;
    if (!window.clearMatchRecords) window.clearMatchRecords = clearMatchRecords;
    if (!window.showAccountManagementPanel) window.showAccountManagementPanel = showAccountManagementPanel;

    // 防止重复初始化
    if (window.autoMatchScriptInitialized) return;
    window.autoMatchScriptInitialized = true;

})();