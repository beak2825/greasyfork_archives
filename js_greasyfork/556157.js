// ==UserScript==
// @name         gamer520下载链接提取 - 美化版
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  自动提取meta标签中的description信息，并将其美观地显示在页面content-area的最前方，链接支持新标签页打开 - 根据原网站风格美化
// @author       AloneJason (Enhanced by MiniMax Agent)
// @match        https://www.gamer520.com/*.html
// @icon         https://ig.freer.blog/2023/10/25/d67adcffb89dd.jpg
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556157/gamer520%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%20-%20%E7%BE%8E%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/556157/gamer520%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%20-%20%E7%BE%8E%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置常量
    const CONFIG = {
        HOSTNAME: window.location.hostname,
        SELECTOR: '.content-area',
        META_SELECTOR: 'meta[name="description"]',
        RETRY_COUNT: 3,
        RETRY_DELAY: 1000
    };

    // 工具函数
    const utils = {
        // 从URL中提取post_id
        extractPostId(url) {
            const regex = new RegExp(`https://${CONFIG.HOSTNAME}/(\\d+)\\.html`);
            const match = url.match(regex);
            return match ? match[1] : null;
        },

        // 防抖函数
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // 生成唯一ID
        generateId() {
            return 'gamer520-' + Math.random().toString(36).substr(2, 9);
        }
    };

    // 样式管理器 - 根据原网站风格设计
    const styleManager = {
        injected: false,

        injectStyles() {
            if (this.injected) return;

            const style = document.createElement('style');
            style.id = 'gamer520-styles';
            style.textContent = `
                /* gamer520美化版样式 - 基于原网站风格 */
                #gamer520-download-container {
                    background: #ffffff;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    color: #333333;
                    padding: 16px 20px;
                    margin: 15px 0;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                    animation: gamer520-fadeIn 0.4s ease-out;
                    position: relative;
                }

                /* 添加顶部装饰线 */
                #gamer520-download-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%);
                    border-radius: 4px 4px 0 0;
                }

                @keyframes gamer520-fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                #gamer520-download-title {
                    margin: 0 0 12px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #2c3e50;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #ecf0f1;
                }

                #gamer520-download-content {
                    margin: 0;
                    line-height: 1.6;
                    font-size: 15px;
                    color: #34495e;
                }

                #gamer520-download-link {
                    color: #3498db;
                    text-decoration: underline;
                    text-decoration-color: #3498db;
                    transition: all 0.2s ease;
                    font-weight: 500;
                    word-break: break-all;
                }

                #gamer520-download-link:hover {
                    color: #2980b9;
                    text-decoration-color: #2980b9;
                    background-color: rgba(52, 152, 219, 0.1);
                    padding: 1px 3px;
                    border-radius: 3px;
                }

                /* 加载状态样式 */
                #gamer520-loading {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 20px;
                    background: #ffffff;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    color: #7f8c8d;
                    margin: 15px 0;
                    animation: gamer520-fadeIn 0.4s ease-out;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                }

                #gamer520-loading .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #bdc3c7;
                    border-top: 2px solid #3498db;
                    border-radius: 50%;
                    animation: gamer520-spin 1s linear infinite;
                }

                @keyframes gamer520-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* 错误状态样式 */
                #gamer520-error {
                    background: #fff5f5;
                    border: 1px solid #fed7d7;
                    border-radius: 4px;
                    color: #c53030;
                    padding: 16px 20px;
                    margin: 15px 0;
                    animation: gamer520-fadeIn 0.4s ease-out;
                }

                /* 解压密码区域样式 */
                .gamer520-password-section {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #ecf0f1;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .gamer520-password-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #7f8c8d;
                }

                .gamer520-password-value {
                    font-size: 15px;
                    font-weight: 600;
                    color: #f39c12;
                    background: #fef9e7;
                    border: 1px solid #f4d03f;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 1px;
                }

                .gamer520-copy-btn {
                    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    box-shadow: 0 1px 3px rgba(39, 174, 96, 0.3);
                }

                .gamer520-copy-btn:hover {
                    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 2px 6px rgba(39, 174, 96, 0.4);
                }

                .gamer520-copy-btn:active {
                    transform: translateY(0);
                }

                .gamer520-copy-btn.copied {
                    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
                }

                /* 下载按钮样式 - 参考原网站的立即下载按钮 */
                .gamer520-download-btn {
                    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                    border: none;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 600;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3);
                    margin: 8px 0;
                }

                .gamer520-download-btn:hover {
                    background: linear-gradient(135deg, #f7931e 0%, #ff6b35 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 3px 8px rgba(255, 107, 53, 0.4);
                    color: white;
                    text-decoration: none;
                }

                .gamer520-download-btn:active {
                    transform: translateY(0);
                }

                /* 移动端适配 */
                @media (max-width: 768px) {
                    #gamer520-download-container {
                        margin: 10px 0;
                        padding: 12px 16px;
                    }

                    #gamer520-download-title {
                        font-size: 16px;
                    }

                    #gamer520-download-content {
                        font-size: 14px;
                    }

                    .gamer520-password-section {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }

                    .gamer520-download-btn {
                        width: 100%;
                        justify-content: center;
                        padding: 10px 20px;
                    }
                }

                /* 高对比度模式支持 */
                @media (prefers-contrast: high) {
                    #gamer520-download-container {
                        border: 2px solid #333333;
                    }

                    #gamer520-download-link {
                        color: #0066cc;
                        text-decoration-color: #0066cc;
                    }
                }
            `;
            document.head.appendChild(style);
            this.injected = true;
        }
    };

    // 链接处理器
    const linkHandler = {
        // 为内容中的链接添加样式和功能
        highlightLinks(content) {
            const linkRegex = /https?:\/\/[^\s<>")]+/g;
            return content.replace(linkRegex, (url) => {
                const cleanUrl = this.cleanUrl(url);
                const finalUrl = this.appendBaiduPanCode(cleanUrl, content);

                // 判断是否为下载链接
                const isDownloadLink = this.isDownloadLink(finalUrl);
                const buttonStyle = isDownloadLink ? 'gamer520-download-btn' : 'gamer520-download-link';
                const icon = isDownloadLink ? '⬇️' : '🔗';

                return `<a class="${buttonStyle}" href="${finalUrl}" target="_blank" rel="noopener noreferrer">${icon} ${finalUrl}</a>`;
            });
        },

        // 判断是否为下载链接
        isDownloadLink(url) {
            const downloadPatterns = [
                'pan.baidu.com',
                'share.weiyun.com',
                'cloud.189.cn',
                'share.weiyun.com',
                'mega.nz',
                '1drv.ms',
                'drive.google.com'
            ];
            return downloadPatterns.some(pattern => url.includes(pattern));
        },

        // 清理URL（移除末尾的标点符号）
        cleanUrl(url) {
            const punctuationRegex = /[.,;:!?]$/;
            return url.replace(punctuationRegex, '');
        },

        // 将百度网盘提取码拼接到链接后面
        appendBaiduPanCode(url, content) {
            // 检测是否为百度网盘链接
            if (!url.includes('pan.baidu.com/s/')) {
                return url;
            }

            // 如果链接已经包含pwd参数，则不再添加
            if (url.includes('?pwd=') || url.includes('&pwd=')) {
                return url;
            }

            // 提取百度网盘短链接ID
            const urlMatch = url.match(/pan\.baidu\.com\/s\/([a-zA-Z0-9_-]+)/);
            if (!urlMatch) {
                return url;
            }

            const shareId = urlMatch[1];

            // 尝试匹配多种提取码格式
            const patterns = [
                // 格式1: 链接: https://pan.baidu.com/s/xxx 提取码: xxxx
                new RegExp(`链接[：:]\\s*https?://pan\\.baidu\\.com/s/${shareId}[^\\s]*\\s+提取码[：:]\\s*([a-zA-Z0-9]{4})`, 'i'),
                // 格式2: 提取码 xxxx
                new RegExp(`链接[：:]\\s*https?://pan\\.baidu\\.com/s/${shareId}[^\\s]*\\s+提取码\\s+([a-zA-Z0-9]{4})`, 'i'),
                // 格式3: 任意位置的"提取码: xxxx"
                /提取码[：:\s]+([a-zA-Z0-9]{4})/i
            ];

            for (const pattern of patterns) {
                const match = content.match(pattern);
                if (match && match[1]) {
                    // 拼接提取码到链接
                    return `${url}?pwd=${match[1]}`;
                }
            }

            return url;
        },

        // 检测是否包含有效链接
        hasValidLinks(content) {
            const linkRegex = /https?:\/\/[^\s<>")]+/;
            return linkRegex.test(content);
        },

        // 提取解压密码
        extractPassword(content) {
            // 匹配多种解压密码格式
            const patterns = [
                /解压密码[：:]\s*([^\s。，、；！？\n]+)/i,
                /密码[：:]\s*([^\s。，、；！？\n]+)/i,
                /解压码[：:]\s*([^\s。，、；！？\n]+)/i
            ];

            for (const pattern of patterns) {
                const match = content.match(pattern);
                if (match && match[1]) {
                    // 去除末尾的标点符号（英文和中文标点）
                    return match[1].trim().replace(/[.,;:!?。，、；！？…]+$/, '');
                }
            }

            return null;
        }
    };

    // HTTP请求管理器
    const httpManager = {
        // 带重试机制的HTTP请求
        async request(url, options = {}) {
            const {
                method = 'GET',
                retries = CONFIG.RETRY_COUNT,
                delay = CONFIG.RETRY_DELAY,
                ...otherOptions
            } = options;

            for (let i = 0; i <= retries; i++) {
                try {
                    const response = await this._makeRequest(url, method, otherOptions);
                    return response;
                } catch (error) {
                    console.warn(`请求失败 (${i + 1}/${retries + 1}):`, error.message);
                    if (i === retries) {
                        throw error;
                    }
                    await this._delay(delay * (i + 1));
                }
            }
        },

        _makeRequest(url, method, options) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method,
                    url,
                    ...options,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response);
                        } else {
                            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error(`网络错误: ${error.statusText || '连接失败'}`));
                    },
                    ontimeout: () => {
                        reject(new Error('请求超时'));
                    }
                });
            });
        },

        _delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    // 主应用逻辑
    const app = {
        async init() {
            try {
                // 注入样式
                styleManager.injectStyles();

                // 提取post_id
                const postId = utils.extractPostId(window.location.href);
                if (!postId) {
                    throw new Error('无法从URL中提取Post ID');
                }

                console.log('📦 正在获取下载链接...');

                // 显示加载状态
                this.showLoading();

                // 获取跳转链接
                const redirectUrl = await this.getRedirectUrl(postId);

                // 获取最终内容
                const finalContent = await this.getFinalContent(redirectUrl);

                // 显示结果
                this.displayResult(finalContent);

            } catch (error) {
                console.error('❌ 脚本执行错误:', error);
                this.showError(error.message);
            }
        },

        async getRedirectUrl(postId) {
            const goUrl = `https://${CONFIG.HOSTNAME}/go/?post_id=${postId}`;
            const response = await httpManager.request(goUrl);

            const redirectMatch = response.responseText.match(/window\.location\s*=\s*'([^']+)';/);
            if (!redirectMatch) {
                throw new Error('未找到重定向URL');
            }

            return redirectMatch[1];
        },

        async getFinalContent(extractedUrl) {
            const response = await httpManager.request(extractedUrl);
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            const metaDescription = doc.querySelector(CONFIG.META_SELECTOR);
            if (!metaDescription) {
                throw new Error('未找到Meta description标签');
            }

            return metaDescription.getAttribute('content');
        },

        showLoading() {
            const contentArea = document.querySelector(CONFIG.SELECTOR);
            if (!contentArea) return;

            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'gamer520-loading';
            loadingDiv.innerHTML = `
                <div class="spinner"></div>
                <span>正在提取下载链接...</span>
            `;

            contentArea.insertBefore(loadingDiv, contentArea.firstChild);
        },

        displayResult(content) {
            const contentArea = document.querySelector(CONFIG.SELECTOR);
            if (!contentArea) {
                throw new Error('未找到目标容器');
            }

            // 移除加载状态
            const loadingDiv = document.getElementById('gamer520-loading');
            if (loadingDiv) {
                loadingDiv.remove();
            }

            // 处理链接
            const processedContent = linkHandler.highlightLinks(content);
            const hasLinks = linkHandler.hasValidLinks(content);

            // 提取解压密码
            const password = linkHandler.extractPassword(content);

            // 创建容器
            const container = document.createElement('div');
            container.id = 'gamer520-download-container';

            // 设置内容
            const title = hasLinks ? '📥 下载信息' : '📋 页面信息';
            const icon = hasLinks ? '🎮' : '📄';

            let passwordSection = '';
            if (password) {
                passwordSection = `
                    <div class="gamer520-password-section">
                        <span class="gamer520-password-label">🔐 解压密码:</span>
                        <span class="gamer520-password-value" id="gamer520-password-text">${password}</span>
                        <button class="gamer520-copy-btn" id="gamer520-copy-password-btn" data-password="${password}">
                            <span>📋</span>
                            <span>复制</span>
                        </button>
                    </div>
                `;
            }

            container.innerHTML = `
                <h2 id="gamer520-download-title">
                    <span style="font-size: 20px;">${icon}</span>
                    ${title}
                </h2>
                <p id="gamer520-download-content">${processedContent}</p>
                ${passwordSection}
            `;

            // 插入到页面
            contentArea.insertBefore(container, contentArea.firstChild);

            // 绑定复制按钮事件
            if (password) {
                this.bindCopyButton();
            }

            console.log('✅ 下载链接提取成功');
            if (password) {
                console.log('🔐 检测到解压密码:', password);
            }
        },

        bindCopyButton() {
            const copyBtn = document.getElementById('gamer520-copy-password-btn');
            if (!copyBtn) return;

            copyBtn.addEventListener('click', function() {
                const password = this.getAttribute('data-password');
                const btnText = this.querySelector('span:last-child');
                const btnIcon = this.querySelector('span:first-child');

                // 尝试使用 GM_setClipboard (Tampermonkey API)
                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(password, 'text');
                    btnIcon.textContent = '✅';
                    btnText.textContent = '已复制';
                    copyBtn.classList.add('copied');

                    setTimeout(() => {
                        btnIcon.textContent = '📋';
                        btnText.textContent = '复制';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                } else {
                    // 降级方案：使用原生 Clipboard API
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(password)
                            .then(() => {
                                btnIcon.textContent = '✅';
                                btnText.textContent = '已复制';
                                copyBtn.classList.add('copied');

                                setTimeout(() => {
                                    btnIcon.textContent = '📋';
                                    btnText.textContent = '复制';
                                    copyBtn.classList.remove('copied');
                                }, 2000);
                            })
                            .catch(err => {
                                console.error('复制失败:', err);
                                alert('复制失败，请手动复制密码: ' + password);
                            });
                    } else {
                        // 最后降级方案：手动选择
                        const passwordText = document.getElementById('gamer520-password-text');
                        if (passwordText) {
                            const range = document.createRange();
                            range.selectNode(passwordText);
                            window.getSelection().removeAllRanges();
                            window.getSelection().addRange(range);
                            try {
                                document.execCommand('copy');
                                btnIcon.textContent = '✅';
                                btnText.textContent = '已复制';
                                copyBtn.classList.add('copied');

                                setTimeout(() => {
                                    btnIcon.textContent = '📋';
                                    btnText.textContent = '复制';
                                    copyBtn.classList.remove('copied');
                                }, 2000);
                            } catch (err) {
                                console.error('复制失败:', err);
                                alert('复制失败，请手动复制密码: ' + password);
                            }
                            window.getSelection().removeAllRanges();
                        }
                    }
                }
            });
        },

        showError(message) {
            const contentArea = document.querySelector(CONFIG.SELECTOR);
            if (!contentArea) return;

            // 移除加载状态
            const loadingDiv = document.getElementById('gamer520-loading');
            if (loadingDiv) {
                loadingDiv.remove();
            }

            const errorDiv = document.createElement('div');
            errorDiv.id = 'gamer520-error';
            errorDiv.innerHTML = `
                <h2 style="margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px; font-size: 16px;">
                    <span style="font-size: 18px;">⚠️</span>
                    提取失败
                </h2>
                <p style="margin: 0; opacity: 0.9;">${message}</p>
            `;

            contentArea.insertBefore(errorDiv, contentArea.firstChild);
        }
    };

    // 页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => app.init());
    } else {
        app.init();
    }

    // 监听SPA路由变化（支持动态加载的页面）
    const debouncedInit = utils.debounce(() => {
        const existing = document.getElementById('gamer520-download-container');
        if (!existing) {
            setTimeout(() => app.init(), 500);
        }
    }, 1000);

    if (typeof window.addEventListener === 'function') {
        window.addEventListener('popstate', debouncedInit);
        window.addEventListener('pushstate', debouncedInit);
        window.addEventListener('replacestate', debouncedInit);
    }

})();