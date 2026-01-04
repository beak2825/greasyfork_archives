// ==UserScript==
// @name         ChatGPT智商检测器
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  检测ChatGPT是否降智，在右下角显示提示
// @author       NBAI.TECH
// @match        https://chatgpt.com/*
// @match        https://*.chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://*.openai.com/*
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/547947/ChatGPT%E6%99%BA%E5%95%86%E6%A3%80%E6%B5%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/547947/ChatGPT%E6%99%BA%E5%95%86%E6%A3%80%E6%B5%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const languages = {
        'zh-CN': {
            title: 'ChatGPT 检测器',
            normal: '智商正常',
            downgraded: '检测到降智',
            model: '模型',
            author: 'made by NBAI'
        },
        'en': {
            title: 'ChatGPT Detector',
            normal: 'IQ Normal',
            downgraded: 'IQ Downgraded',
            model: 'Model',
            author: 'made by NBAI'
        }
    };

    let currentLanguage = 'en';

    const createNotificationStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* 圆圈状态样式 */
            .iq-notification {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                z-index: 999999 !important;
                width: 50px !important;
                height: 50px !important;
                border-radius: 50% !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif;
                color: white;
                backdrop-filter: blur(20px);
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.12),
                    0 4px 16px rgba(0, 0, 0, 0.08),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transform: scale(0);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                overflow: hidden;
                box-sizing: border-box !important;
            }
            
            .iq-notification::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                pointer-events: none;
                border-radius: 50%;
            }
            
            .iq-notification.show {
                transform: scale(1);
            }
            
            .iq-notification:hover {
                transform: scale(1.1);
            }
            
            .iq-notification.normal {
                background: linear-gradient(135deg, 
                    rgba(16, 185, 129, 0.9), 
                    rgba(5, 150, 105, 0.9),
                    rgba(6, 182, 212, 0.8)
                );
            }
            
            .iq-notification.downgraded {
                background: linear-gradient(135deg, 
                    rgba(239, 68, 68, 0.9), 
                    rgba(220, 38, 38, 0.9),
                    rgba(251, 113, 133, 0.8)
                );
            }

            /* 展开状态样式 */
            .iq-notification.expanded {
                width: 300px !important;
                height: auto !important;
                border-radius: 16px !important;
                padding: 16px 20px !important;
                bottom: 20px !important;
                right: 20px !important;
                font-size: 14px;
                font-weight: 500;
                word-wrap: break-word;
            }
            
            .iq-notification.expanded:hover {
                transform: scale(1);
            }
            
            .iq-notification.expanded.normal {
                border-left: 3px solid rgba(52, 211, 153, 0.8);
            }
            
            .iq-notification.expanded.downgraded {
                border-left: 3px solid rgba(248, 113, 113, 0.8);
            }
            
            .iq-notification .circle-icon {
                display: block;
            }
            
            .iq-notification.expanded .circle-icon {
                display: none;
            }
            
            .iq-notification .expanded-content {
                display: none;
            }
            
            .iq-notification.expanded .expanded-content {
                display: block;
            }
            
            .iq-notification .icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.15);
                margin-right: 12px;
                font-size: 16px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .iq-notification .close-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                width: 24px;
                height: 24px;
                color: white;
                cursor: pointer;
                font-size: 14px;
                opacity: 0.7;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
            }
            
            .iq-notification .close-btn:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            
            .iq-notification .title {
                font-size: 13px;
                opacity: 0.9;
                margin-bottom: 8px;
                display: block;
                font-weight: 600;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                background: linear-gradient(90deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .iq-notification .content {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                width: 100%;
                box-sizing: border-box;
            }
            
            .iq-notification .message {
                flex: 1;
                font-size: 15px;
                font-weight: 600;
                line-height: 1.4;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .iq-notification .detail {
                font-size: 12px;
                opacity: 0.85;
                margin-top: 4px;
                padding: 4px 8px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 6px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
                word-break: break-all;
                max-width: 100%;
                box-sizing: border-box;
            }
            
            .iq-notification .author {
                font-size: 10px;
                opacity: 0.6;
                margin-top: 6px;
                text-align: center !important;
                font-weight: 400;
                letter-spacing: 0.3px;
                font-style: italic;
                width: 100%;
                box-sizing: border-box;
                display: block;
            }
        `;
        document.head.appendChild(style);
    };

    const getText = (key) => {
        return languages[currentLanguage] ? languages[currentLanguage][key] : languages['en'][key];
    };

    const showNotification = (isDowngraded, modelSlug) => {
        const existingNotification = document.querySelector('.iq-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `iq-notification ${isDowngraded ? 'downgraded' : 'normal'}`;
        
        const icon = isDowngraded ? '❌' : '✅';
        const message = isDowngraded ? getText('downgraded') : getText('normal');
        const detail = modelSlug ? `${getText('model')}: ${modelSlug}` : '';
        
        notification.innerHTML = `
            <div class="circle-icon">${icon}</div>
            <div class="expanded-content">
                <button class="close-btn">&times;</button>
                <div>
                    <div class="title">${getText('title')}</div>
                    <div class="content">
                        <div class="icon">${icon}</div>
                        <div class="message">${message}</div>
                    </div>
                    ${detail ? `<div class="detail">${detail}</div>` : ''}
                    <div class="author">${getText('author')}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        notification.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn')) {
                return;
            }
            
            notification.classList.toggle('expanded');
        });

        const closeBtn = notification.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });
        }

        setTimeout(() => {
            if (notification.parentNode && !notification.classList.contains('expanded')) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode && !notification.classList.contains('expanded')) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    };

    const parseStreamData = (text) => {
        const lines = text.split('\n');
        let isDowngraded = null;
        let modelSlug = '';

        for (const line of lines) {
            if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                try {
                    const dataStr = line.substring(6).trim();
                    if (dataStr && dataStr !== '') {
                        const data = JSON.parse(dataStr);
                        
                        if (data.type === 'server_ste_metadata' && data.metadata && data.metadata.model_slug) {
                            modelSlug = data.metadata.model_slug;
                            isDowngraded = modelSlug.startsWith('i-');
                            break;
                        }
                    }
                } catch (e) {
                }
            }
        }

        return { isDowngraded, modelSlug };
    };

    const detectLanguage = (headers) => {
        if (headers && headers.get) {
            const oaiLanguage = headers.get('oai-language');
            if (oaiLanguage === 'zh-CN') {
                currentLanguage = 'zh-CN';
            } else {
                currentLanguage = 'en';
            }
        } else if (headers && typeof headers === 'object') {
            const oaiLanguage = headers['oai-language'] || headers['Oai-Language'] || headers['OAI-Language'];
            if (oaiLanguage === 'zh-CN') {
                currentLanguage = 'zh-CN';
            } else {
                currentLanguage = 'en';
            }
        }
    };

    const interceptFetch = () => {
        const originalFetch = window.fetch;
        
        window.fetch = function(...args) {
            const [url, options] = args;
            
            if (typeof url === 'string' && 
                (url.includes('/backend-api/f/conversation') || url.includes('/backend-api/conversation'))) {
                
                if (options && options.headers) {
                    detectLanguage(options.headers);
                }
                
                return originalFetch.apply(this, args).then(response => {
                    const clonedResponse = response.clone();
                    
                    if (response.ok && response.body) {
                        const reader = clonedResponse.body.getReader();
                        let fullText = '';
                        
                        const readStream = () => {
                            return reader.read().then(({ done, value }) => {
                                if (done) {
                                    const result = parseStreamData(fullText);
                                    if (result.isDowngraded !== null) {
                                        showNotification(result.isDowngraded, result.modelSlug);
                                    }
                                    return;
                                }
                                
                                const chunk = new TextDecoder().decode(value);
                                fullText += chunk;
                                
                                return readStream();
                            });
                        };
                        
                        readStream().catch(() => {
                        });
                    }
                    
                    return response;
                }).catch(error => {
                    throw error;
                });
            }
            
            return originalFetch.apply(this, args);
        };
    };

    const interceptXHR = () => {
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            this._headers = {};
            return originalXHROpen.call(this, method, url, ...args);
        };
        
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (!this._headers) this._headers = {};
            this._headers[header] = value;
            return originalXHRSetRequestHeader.call(this, header, value);
        };
        
        XMLHttpRequest.prototype.send = function(...args) {
            if (this._url && 
                (this._url.includes('/backend-api/f/conversation') || this._url.includes('/backend-api/conversation'))) {
                
            
                if (this._headers) {
                    detectLanguage(this._headers);
                }
                
                this.addEventListener('readystatechange', function() {
                    if (this.readyState === 4 && this.status === 200) {
                        try {
                            const result = parseStreamData(this.responseText);
                            if (result.isDowngraded !== null) {
                                showNotification(result.isDowngraded, result.modelSlug);
                            }
                        } catch (e) {
                        }
                    }
                });
            }
            
            return originalXHRSend.apply(this, args);
        };
    };

    const init = () => {
        createNotificationStyles();
        interceptFetch();
        interceptXHR();
    };

    const setupRouteListener = () => {
        let currentUrl = window.location.href;
        
        window.addEventListener('popstate', () => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                setTimeout(() => {
                    interceptFetch();
                    interceptXHR();
                }, 100);
            }
        });
        
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            setTimeout(() => {
                if (window.location.href !== currentUrl) {
                    currentUrl = window.location.href;
                    interceptFetch();
                    interceptXHR();
                }
            }, 100);
        };
        
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            setTimeout(() => {
                if (window.location.href !== currentUrl) {
                    currentUrl = window.location.href;
                    interceptFetch();
                    interceptXHR();
                }
            }, 100);
        };
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setupRouteListener();
        });
    } else {
        init();
        setupRouteListener();
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            interceptFetch();
            interceptXHR();
        }, 1000);
    });

})();
