// ==UserScript==
// @name         FC2-PPV DB Auto Scraper
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  自动抓取 fc2ppvdb.com 页面 XHR/fetch 请求数据，发送到后端fc2-meta-collector
// @author       kaers
// @match        https://fc2ppvdb.com/actresses/*
// @match        https://fc2ppvdb.com/articles/*
// @match        https://fc2ppvdb.com/writers/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557979/FC2-PPV%20DB%20Auto%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/557979/FC2-PPV%20DB%20Auto%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选项
    const config = {
        backendUrl: "http://127.0.0.1:6780/api/meta", // 后端API地址
        notification: {
            fontSize: "14px", // 提示字体大小
            fontFamily: "'Microsoft YaHei', Arial, sans-serif", // 提示字体
            position: "bottom-left" // 提示位置：bottom-left, bottom-right, top-left, top-right
        },
        request: {
            timeout: 10000, // 请求超时时间（毫秒）
        }
    };

    // ---------------- 自动 hook fetch/XHR ----------------
    (function hookXHR() {
        const origFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0] instanceof Request ? args[0].url : args[0];
            return origFetch(...args).then(res => {
                res.clone().text().then(text => {
                    let data;
                    try { data = JSON.parse(text); } catch(e){ data = text; }
                    sendToBackend({ type:'xhr', url, data });
                }).catch(error => {
                    console.error('Failed to parse fetch response:', error);
                });
                return res;
            });
        };

        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this.addEventListener('load', function() {
                let resp = this.responseText;
                try {
                    resp = JSON.parse(resp);
                } catch(e) {
                    console.error('Failed to parse XHR response:', e);
                }
                sendToBackend({ type:'xhr', url, data: resp });
            });
            return origOpen.call(this, method, url, ...rest);
        };
    })();

    // ---------------- 发送数据到后端 ----------------
    function sendToBackend(data){
        console.log(JSON.stringify(data))

        // 显示发送中的提示
        if (window.NotificationManager) {
            window.NotificationManager.info('发送数据到服务器', 1000);
        }
        
        GM_xmlhttpRequest({
            method: "POST",
            url: config.backendUrl,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            timeout: config.request.timeout,
            onload: function(r) {
            console.log('服务器响应:', r);

            try {
                const response = JSON.parse(r.responseText);
                
                if (r.status === 200 ) {
                    // 请求成功
                    if (window.NotificationManager) {
                        // 显示新增和更新的记录数
                        let message = '数据保存成功';
                        if (response.data) {
                            const created = response.data.created || 0;
                            const updated = response.data.updated || 0;
                            message = `数据保存成功: 新增${created}条，更新${updated}条`;
                        } else if (response.count) {
                            // 兼容旧的响应格式
                            message = `数据保存成功 ->${response.count}条`;
                        }
                        window.NotificationManager.success(message, 3000);
                    }
                    console.log('数据已发送成功', data, r.responseText);
                } else {
                    // 请求失败（HTTP错误码）
                    if (window.NotificationManager) {
                        let errorMsg = `发送失败: 服务器返回错误 ${r.status}`;
                        // 尝试提取服务器返回的错误信息
                        if (response.status === 'error') {
                            errorMsg = response.message || errorMsg;
                            if (response.error) {
                                errorMsg += `: ${response.error}`;
                            }
                        }
                        window.NotificationManager.error(errorMsg, 5000);
                    }
                    console.error('发送失败，状态码:', r.status, r.responseText);
                }
            } catch (e) {
                // JSON解析失败
                if (window.NotificationManager) {
                    window.NotificationManager.error(`发送失败: 服务器返回格式错误`, 5000);
                }
                console.error('发送失败，JSON解析错误:', e, r.responseText);
            }
        },
            onerror: function(e) {
                console.error('网络错误:', e);
                if (window.NotificationManager) {
                    let errorMsg = '网络连接失败，请检查网络设置';
                    if (e.status === 0) {
                        errorMsg = '无法连接到服务器，请检查后端服务是否启动';
                    } else if (e.status === 404) {
                        errorMsg = '服务器地址不存在，请检查配置';
                    }
                    window.NotificationManager.error(errorMsg, 5000);
                }
            },
            ontimeout: function(e) {
                console.error('请求超时:', e);
                if (window.NotificationManager) {
                    window.NotificationManager.error('请求超时，服务器响应过慢', 5000);
                }
            }
        });
    }

    // 提示管理器
    // 将管理器挂载到全局，方便其他函数调用
    window.NotificationManager = {
        // 默认配置
        config: {
            fontSize: config.notification.fontSize,
            fontFamily: config.notification.fontFamily,
            position: config.notification.position
        },

        // 显示成功提示
        success: function (message, duration = 2000) {
            this.showFloating(message, 'success', duration);
        },

        // 显示错误提示
        error: function (message, duration = 5000) {
            this.showFloating(message, 'error', duration);
        },

        // 显示信息提示
        info: function (message, duration = 2000) {
            this.showFloating(message, 'info', duration);
        },

        // 显示警告提示
        warning: function (message, duration = 4000) {
            this.showFloating(message, 'warning', duration);
        },

        // 设置提示配置
        setConfig: function (newConfig) {
            this.config = { ...this.config, ...newConfig };
        },

        // 获取位置样式
        getPositionStyle: function () {
            const position = this.config.position;
            switch (position) {
                case 'top-right':
                    return 'top: 40px; right: 20px; left: auto;';
                case 'top-left':
                    return 'top: 40px; left: 20px;';
                case 'bottom-right':
                    return 'bottom: 40px; right: 20px; left: auto;';
                case 'bottom-left':
                default:
                    return 'bottom: 40px; left: 20px;';
            }
        },

        // 核心浮动提示方法
        showFloating: function (message, type, duration) {
            const colors = {
                success: '#4CAF50',
                error: '#f44336',
                info: '#2196F3',
                warning: '#ff9800'
            };

            const tip = document.createElement('div');
            tip.innerHTML = message;
            
            const positionStyle = this.getPositionStyle();
            const transformStyle = positionStyle.includes('right') 
                ? 'transform: translateX(100px);' 
                : 'transform: translateX(-100px);';
            
            tip.style.cssText = `
                position: fixed;
                ${positionStyle}
                background: ${colors[type] || colors.info};
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 300px;
                font-family: ${this.config.fontFamily};
                font-size: ${this.config.fontSize};
                font-weight: normal;
                line-height: 1.5;
                opacity: 0;
                ${transformStyle}
                transition: all 0.3s ease;
                cursor: pointer;
                word-wrap: break-word;
            `;

            document.body.appendChild(tip);

            // 显示动画
            setTimeout(() => {
                tip.style.opacity = '1';
                tip.style.transform = 'translateX(0)';
            }, 10);

            // 自动消失
            const timer = setTimeout(() => {
                this.hideTip(tip);
            }, duration);

            // 点击关闭
            tip.addEventListener('click', () => {
                clearTimeout(timer);
                this.hideTip(tip);
            });
        },

        // 隐藏提示
        hideTip: function (tip) {
            const positionStyle = window.getComputedStyle(tip).getPropertyValue('right');
            const transformStyle = positionStyle && positionStyle !== 'auto' 
                ? 'transform: translateX(100px);' 
                : 'transform: translateX(-100px);';
                
            tip.style.opacity = '0';
            tip.style.transform = transformStyle;
            
            setTimeout(() => {
                if (tip.parentNode) {
                    tip.parentNode.removeChild(tip);
                }
            }, 300);
        }
    };

    // 示例：如何修改字体设置
    // window.NotificationManager.setConfig({
    //     fontSize: '16px',
    //     fontFamily: '"Microsoft YaHei", "微软雅黑", Arial, sans-serif',
    //     position: 'top-right' // 可选值: top-left, top-right, bottom-left, bottom-right
    // });
})();
