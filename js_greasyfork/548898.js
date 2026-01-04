// ==UserScript==
// @name         Toast组件模块（深色系）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  深色系提示的toast组件，支持操作按钮（修复队列问题）
// @author       You
// @match        *
// @grant        none
// @noframes
// ==/UserScript==

(function(window) {
    'use strict';

    // 防止重复加载
    if (window.MonkeyToast) {
        return;
    }

    const TOAST_CONFIG = {
        maxCount: 5,          // 最大同时显示数量
        baseOffset: 20,       // 基础偏移量(px)
        spacing: 10,          // 每个Toast之间的间距
        defaultDuration: 3000,// 默认显示时长(ms)
        animationDuration: 300// 动画过渡时间(ms)
    };

    // 深色系颜色配置
    const COLORS = {
        default: {
            background: 'rgba(45, 45, 45, 0.8)',   // 深灰黑色背景
            text: '#f0f0f0',          // 浅灰文字
            border: '1px solid rgba(68, 68, 68, 0.9)',// 深灰边框
            hoverBackground: '#1a1a1a',// 悬停时更深的背景
            hoverText: '#ffffff',     // 悬停时文字更亮
            hoverOpacity: 1,          // 悬停透明度
            actionButton: {
                background: 'rgba(80, 80, 80, 0.6)', // 操作按钮背景
                text: '#4da6ff',      // 操作按钮文字颜色（蓝色系）
                hoverBackground: 'rgba(100, 100, 100, 0.8)', // 悬停背景
                hoverText: '#66b3ff'  // 悬停文字颜色
            }
        }
    };

    // 存储活跃的Toast
    const activeToasts = new Map();
    // 等待显示的Toast队列
    const toastQueue = [];

    /**
     * 参数解析函数
     * @param {*} message - 参数1
     * @param {*} durationOrOptions - 参数2
     * @param {*} options - 参数3
     * @returns {Object} 解析后的参数对象
     */
    function parseArguments(message, durationOrOptions, options) {
        let parsedMessage, parsedDuration, parsedAction, parsedOptions;
        
        if (typeof message === 'object') {
            // 第一个参数是对象配置
            const config = message;
            parsedMessage = config.message || config.text || '';
            parsedDuration = config.duration || TOAST_CONFIG.defaultDuration;
            parsedAction = config.action;
            parsedOptions = config.options || config;
        } else if (typeof durationOrOptions === 'object') {
            // 第二个参数是对象配置
            parsedMessage = message;
            parsedDuration = durationOrOptions.duration || TOAST_CONFIG.defaultDuration;
            parsedAction = durationOrOptions.action;
            parsedOptions = durationOrOptions.options || durationOrOptions;
        } else {
            // 传统参数格式
            parsedMessage = message;
            parsedDuration = durationOrOptions || TOAST_CONFIG.defaultDuration;
            parsedAction = null;
            parsedOptions = options || {};
        }
        
        return {
            message: parsedMessage,
            duration: parsedDuration,
            action: parsedAction,
            options: parsedOptions
        };
    }

    /**
     * 显示Toast提示
     * @param {string|Object} message - 提示内容或配置对象
     * @param {number|Object} durationOrOptions - 显示时长(ms)或配置对象
     * @param {Object} options - 额外选项，可选
     * @returns {string} toast的唯一标识
     */
    function showToast(message, durationOrOptions = TOAST_CONFIG.defaultDuration, options = {}) {
        // 解析参数
        const params = parseArguments(message, durationOrOptions, options);
        const { message: toastMessage, duration, action, options: toastOptions } = params;
        
        // 检查是否已达到最大显示数量
        if (activeToasts.size >= TOAST_CONFIG.maxCount) {
            // 将完整参数加入队列等待（包含action信息）
            toastQueue.push(params);
            console.log('Toast加入队列，队列长度:', toastQueue.length, '包含action:', !!action);
            return null; // 队列中的toast不返回标识
        }

        // 生成toast唯一标识
        const toastKey = generateToastKey(toastMessage, action);
        
        // 检查是否为重复消息
        if (activeToasts.has(toastKey)) {
            return null;
        }

        // 创建并显示Toast
        return createAndShowToast(toastKey, toastMessage, duration, action, toastOptions);
    }

    /**
     * 生成toast的唯一标识
     * @param {string} message - 消息内容
     * @param {Object|null} action - 操作配置
     * @returns {string} 唯一标识
     */
    function generateToastKey(message, action) {
        if (action) {
            // 对于有action的toast，生成更复杂的唯一标识
            const actionStr = action.text || '';
            const actionFunc = action.onClick ? 'hasFunc' : 'noFunc';
            return `${message}_${actionStr}_${actionFunc}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        // 对于普通toast，使用消息内容作为标识
        return message;
    }

    /**
     * 创建并显示Toast
     * @param {string} toastKey - toast的唯一标识
     * @param {string} message - 提示内容
     * @param {number} duration - 显示时长
     * @param {Object|null} actionConfig - 操作配置
     * @param {Object} options - 样式选项
     * @returns {string} toast的唯一标识
     */
    function createAndShowToast(toastKey, message, duration, actionConfig, options) {
        // 合并默认样式和自定义样式
        const bgColor = options.backgroundColor || COLORS.default.background;
        const textColor = options.color || COLORS.default.text;
        const border = options.border || COLORS.default.border;
        const hoverBgColor = options.hoverBackground || COLORS.default.hoverBackground;
        const hoverTextColor = options.hoverText || COLORS.default.hoverText;
        const hoverOpacity = options.hoverOpacity ?? COLORS.default.hoverOpacity;

        // 创建Toast元素
        const toast = document.createElement('div');
        toast.className = 'tm-toast';
        
        // 设置基础样式
        toast.style.cssText = `
            position: fixed;
            top: ${TOAST_CONFIG.baseOffset}px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            color: ${textColor};
            padding: 12px 16px;
            border-radius: 6px;
            z-index: 999999;
            opacity: 1;
            transition: all ${TOAST_CONFIG.animationDuration}ms ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            pointer-events: auto;
            max-width: 400px;
            min-width: 200px;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.4;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            white-space: pre-line;
        `;

        // 创建内容容器
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        contentContainer.textContent = message;
        
        toast.appendChild(contentContainer);

        // 如果有操作按钮，添加到Toast
        let actionButton = null;
        if (actionConfig) {
            actionButton = document.createElement('button');
            actionButton.className = 'tm-toast-action';
            actionButton.textContent = actionConfig.text || '操作';
            actionButton.style.cssText = `
                background: ${COLORS.default.actionButton.background};
                color: ${COLORS.default.actionButton.text};
                border: none;
                border-radius: 4px;
                padding: 4px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
                flex-shrink: 0;
            `;

            // 鼠标悬停效果
            actionButton.addEventListener('mouseenter', () => {
                actionButton.style.background = COLORS.default.actionButton.hoverBackground;
                actionButton.style.color = COLORS.default.actionButton.hoverText;
            });

            actionButton.addEventListener('mouseleave', () => {
                actionButton.style.background = COLORS.default.actionButton.background;
                actionButton.style.color = COLORS.default.actionButton.text;
            });

            // 点击事件
            actionButton.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止触发Toast的其他事件
                
                if (typeof actionConfig.onClick === 'function') {
                    try {
                        actionConfig.onClick();
                    } catch (error) {
                        console.error('Toast action执行错误:', error);
                    }
                }
                
                // 如果配置了点击后关闭Toast
                if (actionConfig.closeOnClick !== false) {
                    removeToast(toastKey);
                }
            });

            toast.appendChild(actionButton);
        }

        // 添加到文档
        const container = document.body || document.documentElement;
        container.appendChild(toast);

        // 入场动画
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        // 记录到活跃列表
        const timer = setTimeout(() => {
            removeToast(toastKey);
        }, duration);
        
        activeToasts.set(toastKey, { 
            element: toast, 
            timer, 
            actionConfig,
            options,
            originalBg: bgColor,
            originalText: textColor,
            hoverBg: hoverBgColor,
            hoverText: hoverTextColor,
            hoverOpacity: hoverOpacity,
            duration: duration
        });

        // 更新所有Toast位置
        updateToastPositions();

        // 鼠标悬停暂停计时并改变样式
        toast.addEventListener('mouseenter', () => {
            const toastData = activeToasts.get(toastKey);
            if (toastData && toastData.timer) {
                clearTimeout(toastData.timer);
                toastData.timer = null;
                // 应用hover样式
                toast.style.background = toastData.hoverBg;
                toast.style.color = toastData.hoverText;
                toast.style.opacity = toastData.hoverOpacity;
            }
        });

        // 鼠标离开恢复计时和样式
        toast.addEventListener('mouseleave', () => {
            const toastData = activeToasts.get(toastKey);
            if (toastData && !toastData.timer) {
                toastData.timer = setTimeout(() => {
                    removeToast(toastKey);
                }, duration);
                // 恢复原始样式
                toast.style.background = toastData.originalBg;
                toast.style.color = toastData.originalText;
                toast.style.opacity = 1;
            }
        });

        // 返回toast标识，可用于手动移除
        return toastKey;
    }

    /**
     * 移除指定Toast
     * @param {string} toastKey - 要移除的toast标识
     */
    function removeToast(toastKey) {
        const toastData = activeToasts.get(toastKey);
        if (!toastData) return;

        const { element, timer } = toastData;
        if (timer) clearTimeout(timer);

        // 淡出动画
        element.style.opacity = 0;
        element.style.transform = 'translateX(-50%) translateY(-10px)';

        // 动画结束后移除元素
        setTimeout(() => {
            try {
                element.remove();
            } catch (e) { /* 忽略已移除的情况 */ }

            activeToasts.delete(toastKey);

            // 更新位置
            updateToastPositions();

            // 检查队列并显示下一个
            if (toastQueue.length > 0) {
                const nextToastParams = toastQueue.shift();
                console.log('从队列中取出Toast显示:', nextToastParams);
                createAndShowToast(
                    generateToastKey(nextToastParams.message, nextToastParams.action),
                    nextToastParams.message,
                    nextToastParams.duration,
                    nextToastParams.action,
                    nextToastParams.options
                );
            }
        }, TOAST_CONFIG.animationDuration);
    }

    /**
     * 更新所有活跃Toast的位置，实现自动堆叠
     */
    function updateToastPositions() {
        let currentOffset = TOAST_CONFIG.baseOffset;

        // 按添加顺序遍历并更新位置
        Array.from(activeToasts.values()).forEach(({ element }) => {
            // 设置新位置
            element.style.top = `${currentOffset}px`;

            // 计算下一个位置(当前元素高度 + 间距)
            currentOffset += element.offsetHeight + TOAST_CONFIG.spacing;
        });
    }

    /**
     * 清除所有toast
     */
    function clearAllToasts() {
        // 清除活跃的toast
        Array.from(activeToasts.keys()).forEach(toastKey => {
            removeToast(toastKey);
        });
        // 清空队列
        toastQueue.length = 0;
    }

    /**
     * 获取当前队列长度
     * @returns {number} 队列长度
     */
    function getQueueLength() {
        return toastQueue.length;
    }

    /**
     * 获取活跃Toast数量
     * @returns {number} 活跃Toast数量
     */
    function getActiveCount() {
        return activeToasts.size;
    }

    /**
     * 配置toast全局参数
     * @param {Object} config - 配置对象
     */
    function configToast(config) {
        Object.assign(TOAST_CONFIG, config);
    }

    /**
     * 配置全局颜色
     * @param {Object} colorConfig - 颜色配置对象
     */
    function configColors(colorConfig) {
        Object.assign(COLORS.default, colorConfig);
    }

    // 暴露公共API
    window.MonkeyToast = {
        show: showToast,
        remove: removeToast,
        clearAll: clearAllToasts,
        config: configToast,
        configColors: configColors,
        getQueueLength: getQueueLength,
        getActiveCount: getActiveCount
    };

})(window);