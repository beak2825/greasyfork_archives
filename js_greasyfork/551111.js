// ==UserScript==
// @name         Claude Code 安装助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键安装和配置 Claude Code
// @author       北枫枫
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551111/Claude%20Code%20%E5%AE%89%E8%A3%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/551111/Claude%20Code%20%E5%AE%89%E8%A3%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建安装按钮容器
    function createInstallButton() {
        // 检查域名是否匹配 - 只允许 api.ikuncode.cc 和 h.ikuncode.cc
        const hostname = window.location.hostname;
        const allowedHosts = ['api.ikuncode.cc', 'hk.ikuncode.cc'];
        if (!allowedHosts.includes(hostname)) {
            console.log('不在允许的域名下，跳过按钮创建');
            return;
        }

        // 创建容器
        const container = document.createElement('div');
        container.id = 'claude-installer-container';
        container.style.cssText = `
            position: fixed;
            top: 13%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 10000;
            display: flex;
            align-items: stretch;
            background: #007bff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,123,255,0.3);
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        // 创建主按钮
        const button = document.createElement('button');
        button.id = 'claude-installer-btn';
        button.textContent = '安装 Claude Code';
        button.style.cssText = `
            padding: 12px 20px;
            background: transparent;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            overflow: hidden;
            max-width: 200px;
            opacity: 1;
        `;

        // 创建分隔线
        const divider = document.createElement('div');
        divider.id = 'claude-divider';
        divider.style.cssText = `
            width: 1px;
            background: rgba(255, 255, 255, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        // 创建折叠按钮
        const collapseBtn = document.createElement('button');
        collapseBtn.id = 'claude-collapse-btn';
        collapseBtn.innerHTML = '◄';
        collapseBtn.style.cssText = `
            width: 45px;
            padding: 0;
            background: transparent;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.background = 'transparent';
        });

        collapseBtn.addEventListener('mouseenter', () => {
            collapseBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        collapseBtn.addEventListener('mouseleave', () => {
            collapseBtn.style.background = 'transparent';
        });

        // 添加点击事件
        button.addEventListener('click', showInstallDialog);
        collapseBtn.addEventListener('click', toggleCollapse);

        // 组装容器
        container.appendChild(button);
        container.appendChild(divider);
        container.appendChild(collapseBtn);
        document.body.appendChild(container);
    }

    // 折叠/展开功能
    function toggleCollapse() {
        const button = document.getElementById('claude-installer-btn');
        const collapseBtn = document.getElementById('claude-collapse-btn');
        const divider = document.getElementById('claude-divider');

        if (button.style.maxWidth === '0px') {
            // 展开
            button.style.maxWidth = '200px';
            button.style.padding = '12px 20px';
            button.style.opacity = '1';
            divider.style.width = '1px';
            divider.style.opacity = '1';
            collapseBtn.innerHTML = '◄';
            collapseBtn.title = '折叠';
        } else {
            // 折叠
            button.style.maxWidth = '0px';
            button.style.padding = '12px 0';
            button.style.opacity = '0';
            divider.style.width = '0px';
            divider.style.opacity = '0';
            collapseBtn.innerHTML = '►';
            collapseBtn.title = '展开 Claude Code 安装助手';
        }
    }

    // 获取用户ID的辅助函数
    function getUserIdFromPage() {
        let userId = null;

        // 直接从localStorage中的user对象获取ID
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user && user.id) {
                    userId = user.id.toString();
                    console.log('从localStorage[user]获取到用户ID:', userId);
                }
            }
        } catch (e) {
            console.log('解析localStorage[user]失败:', e);
        }

        return userId;
    }

    // 获取用户的API密钥
    async function fetchUserApiKeys() {
        try {
            // 检查是否在 ikuncode.cc 域名下
            if (!window.location.hostname.includes('ikuncode.cc')) {
                console.log('不在 ikuncode.cc 域名下，跳过自动获取');
                return null;
            }

            console.log('正在获取API密钥...');

            // 获取用户ID
            let userId = getUserIdFromPage();

            if (!userId) {
                console.log('未找到用户ID，无法获取API密钥');
                return null;
            }

            const headers = {
                'accept': 'application/json, text/plain, */*',
                'cache-control': 'no-store',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'veloera-user': userId
            };

            console.log('使用用户ID:', userId);

            const response = await fetch('/api/token/?p=0&size=10', {
                method: 'GET',
                headers: headers,
                credentials: 'include'
            });

            console.log('API响应状态:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('获取到的API数据:', data);
                return data;
            } else {
                const errorText = await response.text();
                console.log('API请求失败:', response.status, response.statusText, errorText);
                return null;
            }
        } catch (error) {
            console.log('获取API密钥失败:', error);
            return null;
        }
    }

    // 显示API密钥选择器
    function showApiKeySelector(apiKeys) {
        if (!apiKeys || !apiKeys.data || apiKeys.data.length === 0) {
            return false;
        }

        const selector = document.createElement('select');
        selector.id = 'apiKeySelect';
        selector.style.cssText = `
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
        `;

        // 添加默认选项
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '选择API密钥';
        selector.appendChild(defaultOption);

        // 添加API密钥选项
        apiKeys.data.forEach(key => {
            const option = document.createElement('option');
            // 确保获取完整的token值
            const tokenValue = key.token || key.key || key.name || key.id;
            option.value = tokenValue;
            // 显示友好的名称和部分token
            const displayName = key.name || key.title || '未命名密钥';
            const displayToken = key.token ? key.token.substring(0, 20) + '...' : `ID: ${key.id}`;
            option.textContent = `${displayName} (${displayToken})`;

            // 添加调试信息
            console.log('添加API密钥选项:', {
                name: displayName,
                value: tokenValue,
                fullKey: key
            });

            selector.appendChild(option);
        });

        return selector;
    }

    // 显示安装对话框
    async function showInstallDialog() {
        // 先显示加载中的对话框
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 90%;
        `;

        // 添加背景遮罩
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        // 显示加载状态
        dialog.innerHTML = `
            <h3>Claude Code 安装助手</h3>
            <p>正在获取API密钥...</p>
        `;

        // 尝试获取用户的API密钥
        const apiKeys = await fetchUserApiKeys();
        const hasApiKeys = apiKeys && apiKeys.data && apiKeys.data.length > 0;

        console.log('hasApiKeys:', hasApiKeys);
        if (hasApiKeys) {
            console.log('API密钥数量:', apiKeys.data.length);
        }

        // 更新对话框内容
        dialog.innerHTML = `
            <h3>Claude Code 安装助手</h3>
            <p>此脚本将生成安装命令和配置文件</p>

            ${hasApiKeys ?
                '<label for="apiKeySelect">选择API密钥:</label>' +
                '<div id="apiKeySelectContainer"></div>' +
                '<p style="font-size: 12px; color: #666; margin: 5px 0;">或者手动输入:</p>'
                : ''
            }

            <label for="apiKey">API 令牌:</label>
            <input type="text" id="apiKey" placeholder="输入您的 ANTHROPIC_API_KEY" style="width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px;">

            <label for="baseUrl">API 渠道:</label>
            <select id="baseUrl" style="width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px;">
                <option value="https://api.ikuncode.cc">https://api.ikuncode.cc</option>
                <option value="https://hk.ikuncode.cc">https://hk.ikuncode.cc</option>
            </select>

            <div style="margin: 15px 0;">
                <button id="generateScript" style="padding: 10px 15px; background: #28a745; color: white; border: none; border-radius: 4px; margin-right: 10px;">生成脚本</button>
                <button id="downloadConfig" style="padding: 10px 15px; background: #17a2b8; color: white; border: none; border-radius: 4px; margin-right: 10px;">下载配置</button>
                <button id="closeDialog" style="padding: 10px 15px; background: #6c757d; color: white; border: none; border-radius: 4px;">关闭</button>
            </div>

            <div id="output" style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px; display: none;">
                <h4>安装步骤:</h4>
                <ol id="stepList"></ol>
            </div>
        `;

        // 如果有API密钥，添加选择器
        if (hasApiKeys) {
            const selector = showApiKeySelector(apiKeys);
            if (selector) {
                const container = dialog.querySelector('#apiKeySelectContainer');
                container.appendChild(selector);

                // 监听选择器变化
                selector.addEventListener('change', function() {
                    const apiKeyInput = document.getElementById('apiKey');
                    if (this.value) {
                        console.log('选择的API密钥值:', this.value);
                        apiKeyInput.value = this.value;
                        console.log('已填入输入框:', apiKeyInput.value);

                        // 视觉提示用户已自动填入
                        apiKeyInput.style.backgroundColor = '#e8f5e8';
                        setTimeout(() => {
                            apiKeyInput.style.backgroundColor = '';
                        }, 1000);
                    } else {
                        // 清空输入框
                        apiKeyInput.value = '';
                        console.log('已清空输入框');
                    }
                });
            }
        }

        // 事件监听
        dialog.querySelector('#generateScript').addEventListener('click', generateInstallScript);
        dialog.querySelector('#downloadConfig').addEventListener('click', downloadConfigFiles);
        dialog.querySelector('#closeDialog').addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });
    }

    // 生成安装脚本
    function generateInstallScript() {
        const apiKey = document.getElementById('apiKey').value;
        const baseUrl = document.getElementById('baseUrl').value;

        console.log('生成脚本时使用的API密钥:', apiKey);
        console.log('生成脚本时使用的Base URL:', baseUrl);

        if (!apiKey) {
            alert('请输入 API 令牌');
            return;
        }

        const output = document.getElementById('output');
        const stepList = document.getElementById('stepList');

        stepList.innerHTML = `
            <li>运行: <code>npm install -g @anthropic-ai/claude-code</code></li>
            <li>创建目录: <code>mkdir -p ~/.claude</code></li>
            <li>脚本自动创建配置文件并写入API密钥</li>
            <li>运行: <code>claude</code></li>
        `;

        output.style.display = 'block';

        // 生成完整的安装脚本并下载
        const scriptContent = generateBashScript(apiKey, baseUrl);
        console.log('生成的脚本内容包含API密钥:', scriptContent.includes(apiKey));
        downloadFile('setup-claude.sh', scriptContent, 'text/plain');

        // 提示用户
        setTimeout(() => {
            alert(`脚本已生成并下载！

使用的API密钥: ${apiKey.substring(0, 20)}...
使用的API渠道: ${baseUrl}

运行步骤：
1. chmod +x setup-claude.sh
2. ./setup-claude.sh`);
        }, 500);
    }

    // 生成 Bash 脚本内容
    function generateBashScript(apiKey, baseUrl) {
        return `#!/bin/bash

# IKunCode Claude Code 安装脚本

set -e

echo "======================================"
echo "    IKunCode Claude Code Setup"
echo "======================================"
echo

# 使用预设的 API 令牌
ANTHROPIC_API_KEY="${apiKey}"
ANTHROPIC_BASE_URL="${baseUrl}"

if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "错误：API 令牌不能为空"
    exit 1
fi

# 首先检查 claude 命令是否存在
if ! command -v claude &> /dev/null; then
    echo "Claude Code 未安装。"

    # 检查 npm 是否存在
    if ! command -v npm &> /dev/null; then
        echo "错误：npm 未安装。"
        echo "请先安装 Node.js。"
        exit 1
    fi

    echo "发现 npm: $(npm -v)"
    echo "正在安装 Claude Code..."
    npm install -g @anthropic-ai/claude-code

    if ! command -v claude &> /dev/null; then
        echo "Claude Code 安装失败"
        exit 1
    fi
    echo "✓ Claude Code 安装成功"
else
    echo "✓ Claude Code 已安装"
fi

# 创建 .claude 目录
CLAUDE_DIR="$HOME/.claude"
if [ ! -d "$CLAUDE_DIR" ]; then
    mkdir -p "$CLAUDE_DIR"
    echo "创建目录: ~/.claude"
fi

# 创建或更新 settings.json
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

if [ -f "$SETTINGS_FILE" ]; then
    echo "正在更新 settings.json..."
    # 备份现有文件
    cp "$SETTINGS_FILE" "$SETTINGS_FILE.bak"
fi

cat > "$SETTINGS_FILE" << EOF
{
  "env": {
    "DISABLE_TELEMETRY": "1",
    "ANTHROPIC_AUTH_TOKEN": "$ANTHROPIC_API_KEY",
    "ANTHROPIC_BASE_URL": "$ANTHROPIC_BASE_URL"
  }
}
EOF

echo "✓ settings.json 配置完成"

# 创建 .claude.json
CLAUDE_JSON_FILE="$HOME/.claude.json"

if [ -f "$CLAUDE_JSON_FILE" ]; then
    echo "正在更新 .claude.json..."
    # 备份现有文件
    cp "$CLAUDE_JSON_FILE" "$CLAUDE_JSON_FILE.bak"
fi

echo "✓ .claude.json 创建完成"

# 验证配置
if [ -f "$SETTINGS_FILE" ] && [ -f "$CLAUDE_JSON_FILE" ]; then
    echo
    echo "======================================"
    echo "        安装完成！"
    echo "======================================"
    echo
    echo "使用的API渠道: $ANTHROPIC_BASE_URL"
    echo
    echo "现在可以使用以下命令启动 Claude Code："
    echo "  claude"
    echo
else
    echo "配置不完整"
    [ ! -f "$SETTINGS_FILE" ] && echo "  缺失文件: ~/.claude/settings.json"
    [ ! -f "$CLAUDE_JSON_FILE" ] && echo "  缺失文件: ~/.claude.json"
    exit 1
fi
`;
    }

    // 下载配置文件
    function downloadConfigFiles() {
        const apiKey = document.getElementById('apiKey').value;
        const baseUrl = document.getElementById('baseUrl').value;

        if (!apiKey) {
            alert('请输入 API 令牌');
            return;
        }

        // settings.json
        const settingsConfig = {
            "env": {
                "DISABLE_TELEMETRY": "1",
                "ANTHROPIC_AUTH_TOKEN": apiKey,
                "ANTHROPIC_BASE_URL": baseUrl
            }
        };

        downloadFile('settings.json', JSON.stringify(settingsConfig, null, 2), 'application/json');

        // 显示移动指令
        setTimeout(() => {
            alert(`配置文件已下载！

使用的API渠道: ${baseUrl}

请按以下步骤操作：

1. 创建 Claude 配置目录:
   mkdir -p ~/.claude

2. 将下载的 settings.json 文件移动到配置目录:
   mv ~/Downloads/settings.json ~/.claude/

3. 验证配置:
   ls -la ~/.claude/

4. 运行 Claude Code:
   claude`);
        }, 100);
    }

    // 下载文件函数
    function downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    // 页面加载完成后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createInstallButton);
    } else {
        createInstallButton();
    }

})();