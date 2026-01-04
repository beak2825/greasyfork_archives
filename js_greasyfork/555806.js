// ==UserScript==
// @name         我真的没有切屏！
// @namespace    https://github.com/lanzeweie
// @version      0.82
// @description  我真的没有切屏！！！采用多重策略，从内核层面阻止浏览器将失焦或隐藏状态暴露给网站。尽最大可能伪造一直在窗口的假象
// @author       lanzeweie@foxmail.com
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555806/%E6%88%91%E7%9C%9F%E7%9A%84%E6%B2%A1%E6%9C%89%E5%88%87%E5%B1%8F%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/555806/%E6%88%91%E7%9C%9F%E7%9A%84%E6%B2%A1%E6%9C%89%E5%88%87%E5%B1%8F%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockEvents = ['visibilitychange', 'blur', 'focus', 'focusin', 'focusout', 'pagehide', 'pageshow'];
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (blockEvents.includes(type)) {
            addLog('proxy', `🚫 已代理并阻止 ${type} 监听器附加`, '#6f42c1');
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    ["visibilitychange", "blur", "focus", "focusin", "focusout"].forEach((e) => {
        originalAddEventListener.call(
            window,
            e,
            (event) => {
                event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();
                return false;
            },
            true
        );
    });

    let isEnabled = true;
    let isUIVisible = false;
    let uiContainer = null;
    let uiMinimizedTag = null;
    let uiUpdateFunction = () => {};

    const stats = {
        visibilitychange: 0,
        blur: 0,
        focusout: 0,
        focusin: 0,
        pagehide: 0,
        pageshow: 0,
        proxy: 0,
        get total() {
            return this.visibilitychange + this.blur + this.focusout + this.focusin + this.pagehide + this.pageshow + this.proxy;
        }
    };

    const interceptLog = [];
    const MAX_LOG_ITEMS = 15;

    function addLog(type, message, color = '#dc3545') {
        const timestamp = new Date().toLocaleTimeString();
        interceptLog.unshift({ time: timestamp, type: type, message: message, color: color });
        if (interceptLog.length > MAX_LOG_ITEMS) {
            interceptLog.pop();
        }
        if (type === 'proxy') {
            stats.proxy++;
        }
        if (uiUpdateFunction) {
            uiUpdateFunction();
        }
    }

    try {
        document.hasFocus = () => true;
        Object.defineProperty(document, 'hidden', {
            get() { return false; },
            configurable: true
        });
        Object.defineProperty(document, 'visibilityState', {
            get: () => 'visible',
            configurable: true
        });
        if (!document.__hasFocusPatched) {
            document.hasFocus = function() { return true; };
            document.__hasFocusPatched = true;
        }
        addLog('system', '✓ 属性覆盖成功 (hasFocus/hidden/visibilityState)', '#28a745');
    } catch (e) {
        addLog('system', '❌ 属性覆盖失败: ' + e.message, '#dc3545');
    }

    const interceptOtherEvents = (e) => {
        if (!isEnabled) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();

        const eventType = e.type;
        if (stats.hasOwnProperty(eventType)) {
            stats[eventType]++;
            let logMessage = '';
            switch (eventType) {
                case 'visibilitychange':
                    logMessage = `📱 强力阻止 页面可见性检测`;
                    break;
                case 'pagehide':
                    logMessage = `📄 强力阻止 页面隐藏 (pagehide)`;
                    break;
                case 'pageshow':
                    logMessage = `📄 强力阻止 页面显示 (pageshow)`;
                    break;
                case 'focusin':
                    logMessage = `⚡ 强力阻止 焦点获得 (focusin)`;
                    break;
            }
            addLog(eventType, logMessage, '#28a745');
        }
    };

    try {
        ['visibilitychange', 'pagehide', 'pageshow', 'focusin'].forEach(eventType => {
            originalAddEventListener.call(window, eventType, interceptOtherEvents, true);
            originalAddEventListener.call(document, eventType, interceptOtherEvents, true);
        });
    } catch (e) {
         addLog('system', '❌ 监听器附加失败: ' + e.message, '#dc3545');
    }

    (function() {
        try {
            const originalObserve = MutationObserver.prototype.observe;
            MutationObserver.prototype.observe = function(target, options) {
                if (target === document || target === document.documentElement) {
                    addLog('system', '🛡️ 拦截 DOM 观察器', '#007bff');
                    return { disconnect: () => {}, observe: () => {}, unobserve: () => {} };
                }
                return originalObserve.apply(this, arguments);
            };
            const originalMutationObserver = window.MutationObserver;
            window.MutationObserver = function(callback) {
                const observer = new originalMutationObserver((mutations) => {
                    const filteredMutations = mutations.filter(mutation => {
                        return mutation.target !== document && mutation.target !== document.documentElement;
                    });
                    if (filteredMutations.length > 0) {
                        callback(filteredMutations);
                    }
                });
                return observer;
            };
            window.MutationObserver.prototype = originalMutationObserver.prototype;
        } catch (e) {
        }
    })();

    addLog('system', '✅ 切屏防护系统已启动', '#007bff');
    addLog('system', '📌 UI优化: 最小化标签尺寸缩小 + 模式颜色区分', '#17a2b8');


    const createUI = () => {
        if (window.top !== window.self) {
            return;
        }

        const completelyHideUI = () => {
            if (uiContainer && uiContainer.parentNode) {
                uiContainer.parentNode.removeChild(uiContainer);
                uiContainer = null;
            }
            if (uiMinimizedTag && uiMinimizedTag.parentNode) {
                uiMinimizedTag.parentNode.removeChild(uiMinimizedTag);
                uiMinimizedTag = null;
            }
            addLog('system', '👻 UI 已完全隐藏 (需刷新页面恢复)', '#6c757d');
        };

        // === 最小化标签 ===
        uiMinimizedTag = document.createElement('div');
        const uiTagTitle = document.createElement('span');
        const uiTagHideButton = document.createElement('span');

        uiTagTitle.textContent = '🛡️ 防护';
        uiTagHideButton.textContent = '❌';
        uiTagHideButton.title = '从页面中移除所有UI元素 (需刷新恢复)';

        uiMinimizedTag.appendChild(uiTagTitle);
        uiMinimizedTag.appendChild(uiTagHideButton);

        // 最小化标签样式
        Object.assign(uiMinimizedTag.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '15px',
            fontSize: '11px',
            fontFamily: 'sans-serif',
            cursor: 'pointer',
            zIndex: '999999',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            userSelect: 'none',
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
            fontWeight: 'bold',
        });

        Object.assign(uiTagHideButton.style, {
            padding: '2px 4px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 'normal',
            lineHeight: '1'
        });

        const updateUIMinimizedTagBackground = () => {
            const enabledColor = 'rgba(0, 123, 255, 0.9)';
            const disabledColor = 'rgba(108, 117, 125, 0.9)';
            if (uiMinimizedTag) {
                uiMinimizedTag.style.backgroundColor = isEnabled ? enabledColor : disabledColor;
            }
        };


        uiTagTitle.addEventListener('click', (e) => {
            e.stopPropagation();
            isUIVisible = !isUIVisible;
            uiContainer.style.display = isUIVisible ? 'block' : 'none';
            uiMinimizedTag.style.display = isUIVisible ? 'none' : 'flex';
        });

        uiTagHideButton.addEventListener('click', (e) => {
            e.stopPropagation();
            completelyHideUI();
        });

        // === 主面板 ===
        uiContainer = document.createElement('div');
        const uiHeader = document.createElement('div');
        const uiTitle = document.createElement('span');
        const uiControls = document.createElement('div');
        const uiToggleButton = document.createElement('span');
        const uiMinimizeButton = document.createElement('span');
        const uiHideButton = document.createElement('span');
        const uiBody = document.createElement('div');
        const uiRealTimePanel = document.createElement('div');
        const uiRealTimeTitle = document.createElement('div');
        const uiFocusStatus = document.createElement('div');
        const uiVisibilityStatus = document.createElement('div');
        const uiLogPanel = document.createElement('div');
        const uiLogTitle = document.createElement('div');
        const uiLogContent = document.createElement('div');
        const uiStatsPanel = document.createElement('div');
        const uiStatsTitle = document.createElement('div');
        const uiStatsContent = document.createElement('div');
        const uiControlPanel = document.createElement('div');
        const uiStatus = document.createElement('div');
        const uiHotKey = document.createElement('div');

        uiHeader.appendChild(uiTitle);
        uiControls.appendChild(uiToggleButton);
        uiControls.appendChild(uiMinimizeButton);
        uiControls.appendChild(uiHideButton);
        uiHeader.appendChild(uiControls);
        uiRealTimePanel.appendChild(uiRealTimeTitle);
        uiRealTimePanel.appendChild(uiFocusStatus);
        uiRealTimePanel.appendChild(uiVisibilityStatus);
        uiLogPanel.appendChild(uiLogTitle);
        uiLogPanel.appendChild(uiLogContent);
        uiStatsPanel.appendChild(uiStatsTitle);
        uiStatsPanel.appendChild(uiStatsContent);
        uiControlPanel.appendChild(uiStatus);
        uiControlPanel.appendChild(uiHotKey);
        uiBody.appendChild(uiRealTimePanel);
        uiBody.appendChild(uiLogPanel);
        uiBody.appendChild(uiStatsPanel);
        uiBody.appendChild(uiControlPanel);
        uiContainer.appendChild(uiHeader);
        uiContainer.appendChild(uiBody);

        const appendUI = () => {
            if (document.body) {
                document.body.appendChild(uiContainer);
                document.body.appendChild(uiMinimizedTag);
                uiContainer.style.display = 'none';
                updateUIMinimizedTagBackground();
            }
        };

        if (document.body) {
            appendUI();
        } else {
            originalAddEventListener.call(document, 'DOMContentLoaded', appendUI);
        }

        uiTitle.textContent = "🛡️ 切屏防护";
        uiToggleButton.title = '点击切换 启用/禁用';
        uiMinimizeButton.textContent = '—';
        uiMinimizeButton.title = '点击最小化 (切换到右下角标签)';
        uiHideButton.textContent = '✕';
        uiHideButton.title = '完全隐藏 UI';

        const updateUI = () => {
            updateUIMinimizedTagBackground();

            uiRealTimeTitle.innerHTML = '<strong>📊 实时状态</strong>';
            uiFocusStatus.innerHTML = `🎯 焦点状态: <span style="color: #28a745; font-weight: bold;">✓ 强制聚焦</span>`;
            uiVisibilityStatus.innerHTML = `📱 页面可见: <span style="color: #28a745; font-weight: bold;">visible</span> | hidden: <span style="color: #28a745; font-weight: bold;">false</span>`;

            uiLogTitle.innerHTML = '<strong>📝 拦截日志</strong>';
            if (interceptLog.length === 0) {
                uiLogContent.innerHTML = '<div style="color: #6c757d; font-style: italic;">暂无拦截记录</div>';
            } else {
                uiLogContent.innerHTML = interceptLog.map(log => {
                    return `<div style="font-size: 11px; margin: 2px 0; padding: 2px 4px; background: rgba(0,0,0,0.03); border-radius: 3px;">
                        <span style="color: #888;">${log.time}</span> - <span style="color: ${log.color};">${log.message}</span>
                    </div>`;
                }).join('');
            }

            uiStatsTitle.innerHTML = '<strong>📈 拦截统计</strong>';
            uiStatsContent.innerHTML = `
                <div style="margin-top: 5px;">
                    <div style="color: #6f42c1;">🚫 代理拦截 (blur/focusout): <strong>${stats.proxy}</strong></div>
                    <div style="color: #dc3545;">📱 页面可见性 (vis/page): <strong>${stats.visibilitychange + stats.pagehide + stats.pageshow}</strong></div>
                    <div style="color: #20c997;">⚡ 焦点事件 (focusin): <strong>${stats.focusin}</strong></div>
                    <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid #eee; color: #28a745; font-weight: bold;">
                        总拦截次数: ${stats.total}
                    </div>
                </div>
            `;

            uiStatus.innerHTML = `<span style="color: ${isEnabled ? '#28a745' : '#6c757d'}; font-weight: bold;">🛡️ 防护: ${isEnabled ? '✓ 开启' : '✗ 关闭'}</span>`;
            uiToggleButton.textContent = isEnabled ? '🟢' : '🔴';
            uiHotKey.textContent = 'Ctrl+Alt+H 显示/最小化 | 点击拖动';
        };

        uiUpdateFunction = updateUI;
        updateUI();

        // --- 样式 (主面板) ---
        Object.assign(uiContainer.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            top: 'auto',
            left: 'auto',
            width: '320px',
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            color: '#333',
            border: '1px solid #ccc',
            borderRadius: '8px',
            zIndex: '999999',
            fontFamily: 'sans-serif',
            fontSize: '12px',
            backdropFilter: 'blur(5px)',
            webkitBackdropFilter: 'blur(5px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'transform 0.3s ease',
            display: isUIVisible ? 'block' : 'none',
            fontWeight: '500'
        });

        Object.assign(uiHeader.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            cursor: 'move',
            userSelect: 'none',
            borderRadius: '8px 8px 0 0'
        });
        Object.assign(uiTitle.style, { fontWeight: 'bold', color: '#007bff' });
        Object.assign(uiControls.style, { display: 'flex', gap: '10px' });
        const buttonStyle = {
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '2px 8px',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
        };
        Object.assign(uiToggleButton.style, buttonStyle);
        Object.assign(uiMinimizeButton.style, buttonStyle);
        Object.assign(uiHideButton.style, buttonStyle);
        Object.assign(uiBody.style, { padding: '10px 12px', maxHeight: '70vh', overflowY: 'auto' });
        const panelStyle = { marginBottom: '12px', padding: '8px', backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: '6px', border: '1px solid rgba(0, 0, 0, 0.05)' };
        Object.assign(uiRealTimePanel.style, panelStyle);
        Object.assign(uiLogPanel.style, panelStyle);
        Object.assign(uiStatsPanel.style, panelStyle);
        Object.assign(uiControlPanel.style, panelStyle);
        const titleStyle = { marginBottom: '6px', color: '#495057', fontSize: '12px' };
        Object.assign(uiRealTimeTitle.style, titleStyle);
        Object.assign(uiLogTitle.style, titleStyle);
        Object.assign(uiStatsTitle.style, titleStyle);
        Object.assign(uiFocusStatus.style, { margin: '4px 0', fontSize: '11px' });
        Object.assign(uiVisibilityStatus.style, { margin: '4px 0', fontSize: '11px' });
        Object.assign(uiLogContent.style, { maxHeight: '120px', overflowY: 'auto' });
        Object.assign(uiStatsContent.style, { lineHeight: '1.6' });
        Object.assign(uiStatus.style, { marginBottom: '6px', fontSize: '13px' });
        Object.assign(uiHotKey.style, { color: '#888', fontSize: '10px', textAlign: 'center' });

        // --- UI 交互 ---
        uiToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            isEnabled = !isEnabled;
            addLog('system', isEnabled ? '✅ 防护已开启' : '❌ 防护已关闭', isEnabled ? '#28a745' : '#6c757d');
            updateUI();
        });

        uiMinimizeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            isUIVisible = false;
            uiContainer.style.display = 'none';
            uiMinimizedTag.style.display = 'flex';
            addLog('system', '📌 已最小化到右下角标签', '#17a2b8');
        });

        uiHideButton.addEventListener('click', (e) => {
            e.stopPropagation();
            completelyHideUI();
        });

        let isDragging = false;
        let offset = { x: 0, y: 0 };
        uiHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            offset.x = e.clientX - uiContainer.getBoundingClientRect().left;
            offset.y = e.clientY - uiContainer.getBoundingClientRect().top;
            uiHeader.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let newX = e.clientX - offset.x;
            newX = Math.max(0, Math.min(newX, window.innerWidth - uiContainer.offsetWidth));
            let newRight = window.innerWidth - (newX + uiContainer.offsetWidth);
            newRight = Math.max(0, newRight);

            Object.assign(uiContainer.style, {
                left: 'auto',
                right: `${newRight}px`,
                bottom: '20px',
                top: 'auto',
            });
        });
        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            uiHeader.style.cursor = 'move';
            document.body.style.userSelect = 'auto';
        });
    };

    originalAddEventListener.call(window, 'keydown', (e) => {
        if (e.key.toLowerCase() === 'h' && e.ctrlKey && e.altKey && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            isUIVisible = !isUIVisible;
            if (uiContainer) {
                uiContainer.style.display = isUIVisible ? 'block' : 'none';
                if (uiMinimizedTag) {
                    uiMinimizedTag.style.display = isUIVisible ? 'none' : 'flex';
                }
            }
        }
    }, true);

    if (document.readyState === 'loading') {
        originalAddEventListener.call(window, 'DOMContentLoaded', createUI);
    } else {
        createUI();
    }

})();