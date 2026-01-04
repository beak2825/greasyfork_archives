// ==UserScript==
// @name         WebView错误页面美化
// @namespace    https://greasyfork.org/users/seting-max
// @version      2.0.0
// @description  只拦截真正的Android WebView错误页面，不干扰任何正常页面
// @author       seting-max
// @run-at       document-start
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561295/WebView%E9%94%99%E8%AF%AF%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561295/WebView%E9%94%99%E8%AF%AF%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // =========================================
    // 第1步：极简检测 - 只检查是否在真正的WebView错误页面中
    // =========================================
    
    // 检查当前页面是否是WebView错误页面
    function isWebViewErrorPage() {
        // 检查1：页面URL是否包含错误页面特征
        if (window.location.href.includes('chrome-error://') ||
            window.location.href.includes('chromewebdata') ||
            window.location.protocol === 'chrome-error:') {
            console.log('检测到Chrome错误页面URL');
            return true;
        }
        
        // 检查2：页面标题是否是错误标题
        const errorTitles = [
            '无法访问此网站',
            'This site can\'t be reached',
            '网页无法打开',
            '404 Not Found',
            'Error',
            'Connection failed',
            'Network error'
        ];
        
        const pageTitle = document.title || '';
        for (const title of errorTitles) {
            if (pageTitle.includes(title)) {
                console.log('检测到错误页面标题:', pageTitle);
                return true;
            }
        }
        
        // 检查3：页面body中是否包含错误代码（这是最可靠的检测）
        if (document.body && document.body.textContent) {
            const bodyText = document.body.textContent;
            
            // WebView错误页面常见的错误代码模式
            const errorPatterns = [
                /ERR_CONNECTION_REFUSED/i,
                /ERR_CONNECTION_TIMED_OUT/i,
                /ERR_INTERNET_DISCONNECTED/i,
                /ERR_CONNECTION_CLOSED/i,
                /ERR_NAME_NOT_RESOLVED/i,
                /ERR_SSL_PROTOCOL_ERROR/i,
                /ERR_PROXY_CONNECTION_FAILED/i,
                /ERR_CONNECTION_RESET/i,
                /ERR_CONNECTION_ABORTED/i,
                /ERR_NETWORK_CHANGED/i,
                /ERR_ADDRESS_UNREACHABLE/i,
                /ERR_ADDRESS_INVALID/i,
                /ERR_DNS_TIMED_OUT/i,
                /ERR_DNS_SERVER_FAILED/i,
                /ERR_SSL_VERSION_OR_CIPHER_MISMATCH/i,
                /ERR_CERT_AUTHORITY_INVALID/i,
                /ERR_CERT_DATE_INVALID/i,
                /ERR_CERT_COMMON_NAME_INVALID/i,
                /ERR_EMPTY_RESPONSE/i,
                /ERR_INVALID_RESPONSE/i,
                /ERR_CONTENT_LENGTH_MISMATCH/i,
                /ERR_TUNNEL_CONNECTION_FAILED/i,
                /ERR_TIMED_OUT/i,
                /ERR_FAILED/i,
                /ERR_ACCESS_DENIED/i,
                /ERR_BLOCKED_BY_CLIENT/i,
                /ERR_BLOCKED_BY_RESPONSE/i,
                /ERR_TOO_MANY_REDIRECTS/i,
                /ERR_UNSAFE_PORT/i,
                /ERR_UNSAFE_REDIRECT/i,
                /DNS_PROBE_FINISHED_NO_INTERNET/i,
                /DNS_PROBE_FINISHED_NXDOMAIN/i,
                /DNS_PROBE_STARTED/i,
                /PR_CONNECT_RESET_ERROR/i,
                /PR_END_OF_FILE_ERROR/i,
                /NS_ERROR_NET_TIMEOUT/i,
                /NS_ERROR_CONNECTION_REFUSED/i,
                /NS_ERROR_NET_RESET/i,
                /NS_ERROR_PROXY_CONNECTION_REFUSED/i
            ];
            
            for (const pattern of errorPatterns) {
                if (pattern.test(bodyText)) {
                    console.log('检测到错误代码模式:', pattern);
                    return true;
                }
            }
            
            // 检查错误页面特有短语
            const errorPhrases = [
                'net::',
                '错误代码',
                'Error code',
                '重新加载',
                'Reload',
                '检查您的网络连接',
                'Check your internet connection',
                '检查代理服务器和防火墙',
                'ERR_',
                'DNS_',
                'SSL_',
                'CERT_',
                'PROXY_'
            ];
            
            let errorPhraseCount = 0;
            for (const phrase of errorPhrases) {
                if (bodyText.includes(phrase)) {
                    errorPhraseCount++;
                }
            }
            
            // 如果找到3个以上的错误短语，基本可以确定是错误页面
            if (errorPhraseCount >= 3) {
                console.log('检测到多个错误短语，数量:', errorPhraseCount);
                return true;
            }
        }
        
        // 检查4：页面结构是否极其简单（错误页面特征）
        if (document.body) {
            const allElements = document.querySelectorAll('*').length;
            const bodyTextLength = document.body.textContent ? document.body.textContent.length : 0;
            
            // 错误页面通常元素很少，文本也不多
            if (allElements < 30 && bodyTextLength < 1000) {
                console.log('页面结构简单，可能是错误页面');
                
                // 进一步检查是否有错误页面的典型元素
                const errorSelectors = [
                    '#main-frame-error',
                    '.error-code',
                    '.neterror',
                    '.interstitial-wrapper',
                    '#details-button',
                    '.snackbar',
                    '.offline',
                    '.icon',
                    '#search',
                    '#download-link',
                    '.diagnose-error'
                ];
                
                for (const selector of errorSelectors) {
                    if (document.querySelector(selector)) {
                        console.log('找到错误页面元素:', selector);
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    // =========================================
    // 第2步：如果检测到错误页面，立即替换
    // =========================================
    
    function showCustomErrorPage() {
        console.log('开始显示自定义错误页面');
        
        // 获取原始页面的错误信息
        let originalError = '';
        let errorType = '网络错误';
        
        if (document.body && document.body.textContent) {
            const bodyText = document.body.textContent;
            
            // 提取第一个错误代码
            const errorMatch = bodyText.match(/(ERR_[A-Z_]+|DNS_[A-Z_]+|SSL_[A-Z_]+|CERT_[A-Z_]+|PROXY_[A-Z_]+|NS_ERROR_[A-Z_]+|PR_[A-Z_]+)/i);
            if (errorMatch) {
                originalError = errorMatch[0];
            }
            
            // 根据错误代码确定错误类型
            if (bodyText.includes('ERR_CONNECTION_TIMED_OUT') || bodyText.includes('NS_ERROR_NET_TIMEOUT')) {
                errorType = '连接超时';
            } else if (bodyText.includes('ERR_CONNECTION_REFUSED') || bodyText.includes('NS_ERROR_CONNECTION_REFUSED')) {
                errorType = '连接被拒绝';
            } else if (bodyText.includes('ERR_INTERNET_DISCONNECTED')) {
                errorType = '网络已断开';
            } else if (bodyText.includes('ERR_CONNECTION_CLOSED') || bodyText.includes('PR_CONNECT_RESET_ERROR')) {
                errorType = '连接已关闭';
            } else if (bodyText.includes('ERR_NAME_NOT_RESOLVED') || bodyText.includes('DNS_')) {
                errorType = 'DNS解析失败';
            } else if (bodyText.includes('ERR_SSL_') || bodyText.includes('CERT_')) {
                errorType = '证书错误';
            } else if (bodyText.includes('ERR_PROXY_') || bodyText.includes('PROXY_')) {
                errorType = '代理错误';
            }
        }
        
        // 构建自定义错误页面
        const customPage = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>页面加载失败</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 500px;
                    width: 100%;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                .emoji {
                    font-size: 60px;
                    margin-bottom: 20px;
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                h1 {
                    font-size: 24px;
                    margin: 0 0 15px 0;
                    color: white;
                }
                .error-type {
                    display: inline-block;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 5px 15px;
                    border-radius: 20px;
                    margin-bottom: 20px;
                    font-size: 14px;
                }
                .error-desc {
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 25px;
                    opacity: 0.9;
                }
                .buttons {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                button {
                    padding: 12px 25px;
                    border: none;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                    min-width: 140px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .reload-btn {
                    background: linear-gradient(45deg, #FF6B6B, #EE5A24);
                    color: white;
                }
                .back-btn {
                    background: linear-gradient(45deg, #2ECC71, #27AE60);
                    color: white;
                }
                button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                }
                button:active {
                    transform: translateY(-1px);
                }
                .error-info {
                    margin-top: 20px;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    font-size: 12px;
                    text-align: left;
                    font-family: monospace;
                    overflow-wrap: break-word;
                    display: none;
                }
                .toggle-info {
                    margin-top: 15px;
                    background: none;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    font-size: 12px;
                    padding: 8px 15px;
                    min-width: auto;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="emoji">🚫</div>
                <div class="error-type">${errorType}</div>
                <h1>页面加载失败</h1>
                
                <div class="error-desc" id="errorDesc">
                    ${errorType === '连接超时' ? '连接超时，请检查网络或稍后重试' :
                      errorType === '连接被拒绝' ? '服务器拒绝连接，请检查网址' :
                      errorType === '网络已断开' ? '网络连接已断开，请检查网络设置' :
                      errorType === '连接已关闭' ? '连接意外关闭，请刷新重试' :
                      errorType === 'DNS解析失败' ? 'DNS解析失败，无法找到服务器' :
                      errorType === '证书错误' ? '安全证书错误，连接不安全' :
                      errorType === '代理错误' ? '代理服务器连接失败' :
                      '无法访问此网站，请检查网络连接'}
                </div>
                
                <div class="buttons">
                    <button class="reload-btn" onclick="location.reload()">
                        🔄 刷新页面
                    </button>
                    <button class="back-btn" onclick="history.back()">
                        ← 返回上一页
                    </button>
                </div>
                
                <button class="toggle-info" onclick="toggleErrorInfo()">
                    显示错误详情
                </button>
                
                <div class="error-info" id="errorInfo">
                    <strong>错误类型:</strong> ${errorType}<br>
                    <strong>错误代码:</strong> ${originalError || '无'}<br>
                    <strong>发生时间:</strong> ${new Date().toLocaleString()}<br>
                    <strong>页面地址:</strong> ${window.location.href}<br>
                    <strong>用户代理:</strong> ${navigator.userAgent}
                </div>
            </div>
            
            <script>
                function toggleErrorInfo() {
                    const info = document.getElementById('errorInfo');
                    const button = document.querySelector('.toggle-info');
                    if (info.style.display === 'block') {
                        info.style.display = 'none';
                        button.textContent = '显示错误详情';
                    } else {
                        info.style.display = 'block';
                        button.textContent = '隐藏错误详情';
                    }
                }
                
                // 键盘快捷键
                document.addEventListener('keydown', function(e) {
                    // F5 刷新
                    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                        location.reload();
                        e.preventDefault();
                    }
                    // Esc 返回
                    if (e.key === 'Escape') {
                        history.back();
                    }
                    // B 键返回
                    if (e.key === 'b' && e.altKey) {
                        history.back();
                    }
                });
                
                // 如果网络恢复，自动刷新
                window.addEventListener('online', function() {
                    document.querySelector('.error-desc').textContent = '网络已恢复，正在自动刷新...';
                    setTimeout(() => location.reload(), 1000);
                });
            </script>
        </body>
        </html>
        `;
        
        // 清空当前文档，写入自定义页面
        document.open();
        document.write(customPage);
        document.close();
        
        console.log('自定义错误页面已显示');
    }
    
    // =========================================
    // 第3步：主逻辑 - 在合适的时机检测并替换
    // =========================================
    
    // 立即检查一次（针对已经加载的错误页面）
    if (document.readyState === 'loading') {
        // 如果文档还在加载，等待DOMContentLoaded事件
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                if (isWebViewErrorPage()) {
                    showCustomErrorPage();
                }
            }, 500);
        });
    } else {
        // 如果文档已经加载完成，直接检查
        setTimeout(function() {
            if (isWebViewErrorPage()) {
                showCustomErrorPage();
            }
        }, 300);
    }
    
    // 监听页面完全加载（针对动态加载的错误页面）
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (isWebViewErrorPage()) {
                showCustomErrorPage();
            }
        }, 1000);
    });
    
    // 监听网络状态变化
    window.addEventListener('offline', function() {
        setTimeout(function() {
            if (isWebViewErrorPage()) {
                showCustomErrorPage();
            }
        }, 500);
    });
    
    // 监听资源加载错误（主要错误）
    window.addEventListener('error', function(e) {
        // 只处理重要资源错误
        const tagName = e.target ? e.target.tagName : '';
        if (tagName === 'SCRIPT' || tagName === 'LINK' || tagName === 'IFRAME') {
            console.log('重要资源加载失败:', tagName);
            setTimeout(function() {
                if (isWebViewErrorPage()) {
                    showCustomErrorPage();
                }
            }, 800);
        }
    }, true);
    
    console.log('WebView错误页面美化脚本已加载 v2.0.0');

})();