// ==UserScript==
// @name         Cursor Token Helper - 获取AccessToken助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  输入 WorkosToken 自动获取 AccessToken，并设置 Cookie 到 cursor.com
// @author       You
// @license      MIT
// @match        https://cursor.com/*
// @match        https://*.cursor.com/*
// @match        https://*.cursor.sh/*

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @connect      cursor.com
// @connect      api2.cursor.sh
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554203/Cursor%20Token%20Helper%20-%20%E8%8E%B7%E5%8F%96AccessToken%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554203/Cursor%20Token%20Helper%20-%20%E8%8E%B7%E5%8F%96AccessToken%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============ Base64URL 编码工具函数 ============
    const Slo = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

    function base64URLEncode(data) {
        const n = Slo;
        let s = "";
        const r = data.byteLength % 3;
        let o = 0;

        for (; o < data.byteLength - r; o += 3) {
            const a = data[o + 0];
            const u = data[o + 1];
            const d = data[o + 2];

            s += n[a >>> 2];
            s += n[(a << 4 | u >>> 4) & 63];
            s += n[(u << 2 | d >>> 6) & 63];
            s += n[d & 63];
        }

        if (r === 1) {
            const a = data[o + 0];
            s += n[a >>> 2];
            s += n[a << 4 & 63];
        } else if (r === 2) {
            const a = data[o + 0];
            const u = data[o + 1];
            s += n[a >>> 2];
            s += n[(a << 4 | u >>> 4) & 63];
            s += n[u << 2 & 63];
        }

        return s;
    }

    // SHA256 哈希函数
    async function sha256(inputString) {
        if (!crypto.subtle) {
            throw new Error("'crypto.subtle' is not available");
        }

        const encoder = new TextEncoder();
        const encodedData = encoder.encode(inputString);
        const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);

        return hashBuffer;
    }

    // ============ Cookie 操作函数 ============
    function setWorkosCookie(workosToken) {
        // 设置 Cookie，有效期 30 天
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);

        document.cookie = `WorkosCursorSessionToken=${workosToken}; domain=.cursor.com; path=/; expires=${expires.toUTCString()}; SameSite=Lax; Secure`;

        console.log('✅ WorkosCursorSessionToken Cookie 已设置');
    }

    // 使用 GM_cookie API 读取（支持 HttpOnly Cookie）
    async function getWorkosCookieAsync() {
        try {
            // 尝试使用 GM_cookie (Tampermonkey 特权 API)
            if (typeof GM_cookie !== 'undefined') {
                console.log('🔍 使用 GM_cookie API 读取...');

                return new Promise((resolve) => {
                    GM_cookie.list({
                        domain: 'cursor.com',
                        name: 'WorkosCursorSessionToken'
                    }, (cookies, error) => {
                        if (error) {
                            console.error('❌ GM_cookie 读取失败:', error);
                            resolve(null);
                        } else if (cookies && cookies.length > 0) {
                            console.log('✅ 通过 GM_cookie 读取到 Cookie:', cookies[0].value.substring(0, 50) + '...');
                            resolve(cookies[0].value);
                        } else {
                            console.warn('⚠️ GM_cookie 未找到 WorkosCursorSessionToken');
                            resolve(null);
                        }
                    });
                });
            }
        } catch (e) {
            console.warn('GM_cookie API 不可用:', e);
        }

        // 降级：尝试普通 document.cookie
        return getWorkosCookieSync();
    }

    function getWorkosCookieSync() {
        // 从 document.cookie 中读取（无法读取 HttpOnly）
        const cookies = document.cookie.split(';');
        console.log('🔍 当前所有 document.cookie:', document.cookie);

        for (let cookie of cookies) {
            const trimmedCookie = cookie.trim();
            const equalIndex = trimmedCookie.indexOf('=');

            if (equalIndex > -1) {
                const name = trimmedCookie.substring(0, equalIndex);
                const value = trimmedCookie.substring(equalIndex + 1);

                console.log('🔍 检查 Cookie:', name);

                if (name === 'WorkosCursorSessionToken') {
                    console.log('✅ 从 document.cookie 读取到 WorkosCursorSessionToken:', value.substring(0, 50) + '...');
                    return decodeURIComponent(value);
                }
            }
        }

        console.warn('⚠️ document.cookie 中未找到 WorkosCursorSessionToken');
        console.warn('可用的 Cookie 名称:', cookies.map(c => c.trim().split('=')[0]));
        return null;
    }

    // ============ 核心：获取 AccessToken ============
    async function getAccessToken(workosToken) {
        try {
            // 1. 先设置 Cookie
            setWorkosCookie(workosToken);

            // 2. 生成参数
            const K = new Uint8Array(32);
            crypto.getRandomValues(K);

            const verifier = base64URLEncode(K);
            const challenge = base64URLEncode(new Uint8Array(await sha256(verifier)));
            const uuid = crypto.randomUUID();

            console.log('📝 生成的参数:');
            console.log('  UUID:', uuid);
            console.log('  Verifier:', verifier);
            console.log('  Challenge:', challenge);

            // 3. 第一步：触发授权登录
            console.log('🔄 Step 1: 触发授权登录...');

            const loginResponse = await fetch('https://cursor.com/api/auth/loginDeepCallbackControl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Origin': 'https://cursor.com',
                },
                credentials: 'include', // 自动携带 Cookie
                body: JSON.stringify({
                    challenge: challenge,
                    uuid: uuid
                })
            });

            if (!loginResponse.ok) {
                throw new Error(`授权登录失败: ${loginResponse.status} ${loginResponse.statusText}`);
            }

            console.log('✅ Step 1 完成，服务器已准备好 Token');

            // 4. 第二步：轮询获取 AccessToken
            console.log('🔄 Step 2: 开始轮询获取 AccessToken...');

            return await pollForAccessToken(uuid, verifier);

        } catch (error) {
            console.error('❌ 获取 AccessToken 失败:', error);
            throw error;
        }
    }

    // 轮询获取 AccessToken
    async function pollForAccessToken(uuid, verifier, maxAttempts = 30) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                console.log(`🔍 轮询尝试 ${attempt}/${maxAttempts}...`);

                const pollUrl = `https://api2.cursor.sh/auth/poll?uuid=${uuid}&verifier=${verifier}`;

                const response = await fetch(pollUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': '*/*',
                        'Origin': 'https://cursor.com',
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data && data.accessToken) {
                        console.log('✅ AccessToken 获取成功!');
                        return data;
                    }
                }

                // 等待 1 秒后继续
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.warn(`⚠️ 第 ${attempt} 次轮询出错:`, error);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        throw new Error('轮询超时：未能在 30 秒内获取到 AccessToken');
    }

    // ============ 状态持久化 ============
    const STATE_KEY = 'cursor_token_helper_state';

    function saveState(state) {
        try {
            GM_setValue(STATE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('保存状态失败:', e);
        }
    }

    function loadState() {
        try {
            const saved = GM_getValue(STATE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.warn('加载状态失败:', e);
            return null;
        }
    }

    // ============ 创建 UI 界面 ============
    function createUI() {
        // 检查是否已经创建过
        if (document.getElementById('cursor-token-helper')) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'cursor-token-helper';
        container.innerHTML = `
            <style>
                #cursor-token-helper {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 400px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: white;
                }
                #cursor-token-helper h3 {
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    font-weight: 600;
                }
                #cursor-token-helper .input-group {
                    margin-bottom: 12px;
                }
                #cursor-token-helper label {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 13px;
                    opacity: 0.9;
                }
                #cursor-token-helper input,
                #cursor-token-helper textarea {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid rgba(255,255,255,0.4);
                    border-radius: 8px;
                    font-size: 13px;
                    box-sizing: border-box;
                    font-family: 'Monaco', 'Courier New', monospace;
                    background: rgba(0,0,0,0.2);
                    color: white;
                    transition: all 0.3s;
                }
                #cursor-token-helper input::placeholder,
                #cursor-token-helper textarea::placeholder {
                    color: rgba(255,255,255,0.5);
                }
                #cursor-token-helper input:focus,
                #cursor-token-helper textarea:focus {
                    outline: none;
                    border-color: rgba(255,255,255,0.8);
                    box-shadow: 0 0 0 3px rgba(255,255,255,0.2);
                    background: rgba(0,0,0,0.3);
                }
                #cursor-token-helper textarea {
                    resize: vertical;
                    min-height: 70px;
                }
                #cursor-token-helper button {
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 6px;
                    background: white;
                    color: #667eea;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 10px;
                }
                #cursor-token-helper button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                #cursor-token-helper button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                #cursor-token-helper .dashboard-btn {
                    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
                    color: white;
                    margin-top: 0;
                    margin-bottom: 0;
                }
                #cursor-token-helper .dashboard-btn:hover {
                    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
                }
                #cursor-token-helper #getTokenBtn {
                    margin-bottom: 10px;
                }
                #cursor-token-helper .result {
                    margin-top: 15px;
                    padding: 12px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 6px;
                    font-size: 12px;
                    max-height: 200px;
                    overflow-y: auto;
                    display: none;
                }
                #cursor-token-helper .result.show {
                    display: block;
                }
                #cursor-token-helper .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(255,255,255,0.2);
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 18px;
                    transition: all 0.3s;
                }
                #cursor-token-helper .close-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: rotate(90deg);
                }
                #cursor-token-helper .copy-btn {
                    background: rgba(255,255,255,0.2);
                    margin-top: 5px;
                    padding: 6px 12px;
                    width: auto;
                    font-size: 12px;
                }
                #cursor-token-helper .tip {
                    font-size: 11px;
                    opacity: 0.9;
                    margin-top: 5px;
                    padding: 8px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                    border-left: 3px solid rgba(255,193,7,0.8);
                    line-height: 1.6;
                }
                #cursor-token-helper kbd {
                    background: rgba(0,0,0,0.3);
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: monospace;
                    font-size: 11px;
                }
            </style>
            
            <div class="close-btn" id="closeHelper">×</div>
            
            <h3>🔑 Cursor Token Helper</h3>
            
            <div class="input-group">
                <label>WorkOS Session Token:</label>
                <textarea id="workosTokenInput" placeholder="粘贴 WorkosCursorSessionToken..."></textarea>
            </div>

            <button id="getTokenBtn">🔑 获取 AccessToken</button>
            
            <button id="openDashboardBtn" class="dashboard-btn">🚀 跳转到 Dashboard</button>
            
            <div class="result" id="resultBox">
                <div id="resultContent"></div>
            </div>
        `;

        document.body.appendChild(container);

        // 恢复之前的状态
        const savedState = loadState();
        if (savedState) {
            if (savedState.workosToken) {
                document.getElementById('workosTokenInput').value = savedState.workosToken;
            }
            if (savedState.resultHTML) {
                document.getElementById('resultContent').innerHTML = savedState.resultHTML;
                document.getElementById('resultBox').classList.add('show');
            }
        }

        // 绑定事件
        document.getElementById('closeHelper').addEventListener('click', () => {
            container.style.display = 'none';
        });

        // 跳转 Dashboard 按钮
        document.getElementById('openDashboardBtn').addEventListener('click', () => {
            window.location.href = 'https://cursor.com/cn/dashboard';
        });

        document.getElementById('getTokenBtn').addEventListener('click', async () => {
            const workosToken = document.getElementById('workosTokenInput').value.trim();
            const btn = document.getElementById('getTokenBtn');
            const resultBox = document.getElementById('resultBox');
            const resultContent = document.getElementById('resultContent');

            if (!workosToken) {
                alert('请输入 WorkOS Session Token');
                return;
            }

            btn.disabled = true;
            btn.textContent = '正在获取 AccessToken...';
            resultBox.classList.remove('show');

            try {
                const tokenData = await getAccessToken(workosToken);

                const resultHTML = `
                    <div style="margin-bottom: 10px;">
                        <strong>✅ AccessToken 获取成功!</strong>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <strong>AccessToken:</strong><br>
                        <code style="word-break: break-all; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 3px; display: block; margin-top: 3px;">
                            ${tokenData.accessToken}
                        </code>
                        <button class="copy-btn" onclick="navigator.clipboard.writeText('${tokenData.accessToken}'); this.textContent='已复制!'; setTimeout(() => this.textContent='复制 AccessToken', 1000)">复制 AccessToken</button>
                    </div>
                    ${tokenData.refreshToken ? `
                    <div style="margin-bottom: 8px;">
                        <strong>RefreshToken:</strong><br>
                        <code style="word-break: break-all; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 3px; display: block; margin-top: 3px;">
                            ${tokenData.refreshToken}
                        </code>
                        <button class="copy-btn" onclick="navigator.clipboard.writeText('${tokenData.refreshToken}'); this.textContent='已复制!'; setTimeout(() => this.textContent='复制 RefreshToken', 1000)">复制 RefreshToken</button>
                    </div>
                    ` : ''}
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);">
                        <small>✅ Cookie 已自动设置到 cursor.com</small>
                    </div>
                    <button class="copy-btn" style="width: 100%; margin-top: 10px; background: rgba(76, 175, 80, 0.3); color: white; font-weight: 600;" onclick="window.location.href='https://cursor.com/cn/dashboard'">
                        🚀 跳转到 Dashboard
                    </button>
                `;

                resultContent.innerHTML = resultHTML;
                resultBox.classList.add('show');
                btn.textContent = '获取 AccessToken';

                // 保存状态（包括输入的 Token 和结果）
                saveState({
                    workosToken: workosToken,
                    resultHTML: resultHTML,
                    timestamp: Date.now()
                });

            } catch (error) {
                const errorHTML = `
                    <div style="color: #ff6b6b;">
                        <strong>❌ 获取失败</strong><br>
                        <div style="margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                            <strong>错误详情:</strong><br>
                            ${error.message}
                        </div>
                        <div style="margin-top: 10px; font-size: 11px; opacity: 0.8;">
                            💡 常见问题:<br>
                            • WorkOS Token 是否正确？<br>
                            • Token 是否已过期？<br>
                            • 网络连接是否正常？
                        </div>
                    </div>
                `;
                resultContent.innerHTML = errorHTML;
                resultBox.classList.add('show');
                btn.textContent = '获取 AccessToken';

                // 也保存错误状态
                saveState({
                    workosToken: workosToken,
                    resultHTML: errorHTML,
                    timestamp: Date.now(),
                    isError: true
                });
            } finally {
                btn.disabled = false;
            }
        });

        // 添加拖拽功能
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        container.querySelector('h3').addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - container.offsetLeft;
            initialY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                container.style.left = currentX + 'px';
                container.style.top = currentY + 'px';
                container.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // ============ 初始化 ============
    function init() {
        // 页面加载完成后创建 UI
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }

        console.log('🚀 Cursor Token Helper 已加载');
        console.log('💡 使用说明:');
        console.log('   1. 在右上角面板中粘贴 WorkOS Session Token');
        console.log('   2. 点击"获取 AccessToken"按钮');
        console.log('   3. 等待自动获取并显示结果');
        console.log('   4. Cookie 会自动设置到 cursor.com 域名下');
    }

    init();

    // 导出到全局方便调试
    window.CursorTokenHelper = {
        getAccessToken,
        setWorkosCookie
    };

})();