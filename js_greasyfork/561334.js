// ==UserScript==
// @name         优雅的错误页面美化
// @version      1.1
// @description  美化WebView错误页面，提供更友好的用户体验
// @author       DeepSeek
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/561334/%E4%BC%98%E9%9B%85%E7%9A%84%E9%94%99%E8%AF%AF%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561334/%E4%BC%98%E9%9B%85%E7%9A%84%E9%94%99%E8%AF%AF%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否是特定错误页面（只有"网页无法打开"这几个字）
    const isSpecificErrorPage = () => {
        const title = document.title.trim();
        return title === '网页无法打开';
    };

    // 立即执行，不等待DOM加载
    if (!isSpecificErrorPage()) return;

    // 提取原始页面的错误信息
    const extractErrorInfo = () => {
        let errorMessage = '';
        let url = '';
        
        // 获取完整的HTML内容
        const html = document.documentElement.innerHTML;
        
        // 提取错误信息 - 匹配"因为："后面的内容
        const errorPatterns = [
            // 匹配中文模式：因为：后接错误（可能跨行）
            /因为[:：]\s*\n*\s*([^\n<]+)/i,
            
            // 匹配常见的错误代码模式
            /net::ERR_[\w_]+/i,
            /NS_ERROR_[\w_]+/i,
            /HTTP ERROR \d+/i,
            
            // 匹配错误描述的p标签
            /<p>([^<]*?(?:ERR_|ERROR)[^<]*)<\/p>/i
        ];
        
        // 尝试所有模式
        for (const pattern of errorPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                errorMessage = match[1].trim();
                // 清理可能的多余文本
                errorMessage = errorMessage.replace(/^[:：]\s*/, '');
                break;
            } else if (match && match[0] && pattern.source.includes('ERR_')) {
                // 对于错误代码模式，直接取第一个匹配组
                errorMessage = match[0].trim();
                break;
            }
        }
        
        // 提取URL信息 - 匹配 "位于 <strong>URL</strong>" 格式
        const urlPatterns = [
            /位于\s*<strong>([^<]+)<\/strong>/i,
            /位于\s*<b>([^<]+)<\/b>/i
        ];
        
        for (const pattern of urlPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                url = match[1].trim();
                break;
            }
        }
        
        // 如果没有提取到URL，尝试查找包含http/https的文本
        if (!url) {
            const urlMatch = html.match(/https?:\/\/[^\s<>"']+/i);
            if (urlMatch) {
                url = urlMatch[0];
            }
        }
        
        // 清理错误信息中的HTML标签
        if (errorMessage) {
            errorMessage = errorMessage.replace(/<[^>]*>/g, '');
        }
        
        return { errorMessage, url };
    };

    // 提取错误信息
    const { errorMessage, url } = extractErrorInfo();

    // 添加自定义样式
    GM_addStyle(`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        *:focus {
            outline: none !important;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            color: #333;
            line-height: 1.6;
            background-color: white;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 0;
            margin: 0;
        }

        .error-container {
            background: white;
            width: 100%;
            max-width: 100%;
            min-height: 100vh;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            animation: fadeIn 0.5s ease-out;
            padding: 40px 20px;
            margin: 0;
            border: none;
            box-shadow: none;
        }

        .error-icon {
            font-size: 80px;
            margin-bottom: 20px;
            line-height: 1;
            flex-shrink: 0;
        }

        .error-title {
            font-size: 2.5em;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 15px;
            width: 100%;
        }

        .error-code {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 5px 15px;
            border-radius: 50px;
            font-size: 0.9em;
            font-weight: 600;
            margin-bottom: 25px;
            letter-spacing: 1px;
            max-width: 90%;
            min-height: 32px;
            word-break: break-word;
            white-space: normal;
            text-align: center;
            line-height: 1.4;
            flex-wrap: wrap;
            flex-shrink: 0;
        }

        .error-code:empty {
            display: none;
        }

        .error-message {
            font-size: 1.2em;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.8;
            width: 100%;
            max-width: 700px;
        }

        .url-container {
            width: 100%;
            max-width: 700px;
            margin: 25px 0;
            position: relative;
        }

        .url-label {
            text-align: left;
            font-size: 0.9em;
            color: #718096;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .url-display {
            background: #f7fafc;
            border: 2px dashed #cbd5e0;
            border-radius: 10px;
            padding: 15px;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            color: #2d3748;
            font-size: 0.85em;
            position: relative;
            text-align: left;
            width: 100%;
            max-height: 200px;
            overflow-y: auto;
            box-sizing: border-box;
        }

        .url-display::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        .url-display::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        .url-display::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        .url-display::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 30px;
            width: 100%;
            max-width: 700px;
        }

        .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 150px;
            justify-content: center;
            user-select: none;
            flex-shrink: 0;
        }

        .btn:focus {
            box-shadow: none !important;
            outline: none !important;
        }

        .btn::-moz-focus-inner {
            border: 0;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }

        .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .btn:active {
            transform: translateY(0);
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #5a67d8, #6b46c1);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
        }

        .btn-secondary:hover {
            background: #cbd5e0;
            box-shadow: 0 10px 25px rgba(203, 213, 224, 0.2);
        }

        .tips {
            background: linear-gradient(135deg, #f6d365, #fda085);
            padding: 20px;
            border-radius: 15px;
            margin-top: 30px;
            color: white;
            text-align: left;
            width: 100%;
            max-width: 700px;
        }

        .tips h3 {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.1em;
        }

        .tips ul {
            list-style: none;
            padding-left: 0;
        }

        .tips li {
            margin-bottom: 8px;
            padding-left: 25px;
            position: relative;
        }

        .tips li:before {
            content: '✓';
            position: absolute;
            left: 0;
            font-weight: bold;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            body {
                padding: 0;
                align-items: flex-start;
            }
            
            .error-container {
                padding: 20px 15px;
                justify-content: flex-start;
                padding-top: 40px;
            }
            
            .error-title {
                font-size: 2em;
            }
            
            .error-icon {
                font-size: 60px;
                margin-bottom: 15px;
            }
            
            .error-message {
                font-size: 1.1em;
                padding: 0 10px;
            }
            
            .action-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                max-width: 300px;
            }
            
            .error-code {
                font-size: 0.8em;
                padding: 5px 10px;
                border-radius: 25px;
                line-height: 1.3;
            }
            
            .url-display {
                font-size: 0.8em;
                padding: 12px;
            }
            
            .tips {
                padding: 15px;
                margin-top: 20px;
            }
        }

        @media (max-width: 480px) {
            .error-container {
                padding: 15px 10px;
                padding-top: 30px;
            }
            
            .error-title {
                font-size: 1.8em;
            }
            
            .error-icon {
                font-size: 50px;
            }
            
            .error-message {
                font-size: 1em;
            }
            
            .btn {
                min-width: 120px;
                padding: 10px 20px;
            }
            
            .tips {
                padding: 12px;
            }
        }

        /* 移除原始内容 */
        body > img[width="50"],
        body > h2,
        body > p {
            display: none !important;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `);

    // 创建错误页面内容
    const createErrorPage = () => {
        // 使用错误图标
        const errorIcon = '⚠️';

        // 只显示网址，不显示其他文本
        const urlDisplay = url || '';

        // 创建新内容
        const newContent = `
            <div class="error-container">
                <div class="error-icon">
                    ${errorIcon}
                </div>
                
                <h1 class="error-title">连接遇到问题</h1>
                
                ${errorMessage ? `<div class="error-code">${errorMessage}</div>` : ''}
                
                <p class="error-message">
                    我们无法连接到您请求的网页，这可能是因为网络问题、网站维护或网址错误。
                </p>
                
                ${urlDisplay ? `
                    <div class="url-container">
                        <div class="url-label">请求网址：</div>
                        <div class="url-display">
                            ${urlDisplay}
                        </div>
                    </div>
                ` : ''}
                
                <div class="action-buttons">
                    <button class="btn btn-primary" id="refreshBtn">
                        🔄 重新加载
                    </button>
                    <button class="btn btn-secondary" id="backBtn">
                        ← 返回上一页
                    </button>
                </div>
                
                <div class="tips">
                    <h3>💡 尝试以下操作：</h3>
                    <ul>
                        <li>检查网络连接是否正常</li>
                        <li>确认网址是否正确</li>
                        <li>清除浏览器缓存和Cookie</li>
                        <li>尝试使用其他浏览器</li>
                        <li>尝试关闭VPN或代理服务</li>
                        <li>尝试使用VPN或代理服务</li>
                        <li>尝试重启浏览器</li>
                    </ul>
                </div>
            </div>
        `;

        // 直接设置body内容
        document.body.innerHTML = newContent;

        // 添加按钮事件监听
        setTimeout(() => {
            const refreshBtn = document.getElementById('refreshBtn');
            const backBtn = document.getElementById('backBtn');

            if (refreshBtn) {
                refreshBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    location.reload();
                });
                
                refreshBtn.addEventListener('focus', (e) => {
                    e.target.blur();
                });
            }

            if (backBtn) {
                backBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    history.back();
                });
                
                backBtn.addEventListener('focus', (e) => {
                    e.target.blur();
                });
            }
        }, 0);
    };

    // 立即创建错误页面
    createErrorPage();
})();