// ==UserScript==
// @name         Site Redirector Pro
// @name:zh-CN   网站重定向助手
// @namespace    https://github.com/Jsaeron/site-redirector
// @version      1.5.0
// @description  Block distracting websites with a cooldown timer and redirect to productive sites
// @description:zh-CN  拦截分心网站，冷静倒计时后重定向到指定网站，帮助你保持专注
// @author       Daniel
// @license      MIT
// @homepage     https://github.com/Jsaeron/site-redirector
// @supportURL   https://github.com/Jsaeron/site-redirector/issues
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      v1.hitokoto.cn
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563551/Site%20Redirector%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/563551/Site%20Redirector%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============ 配置区域 ============
    const DEFAULT_TARGET = 'https://claude.ai';
    const DEFAULT_BLACKLIST = ['bilibili.com', 'douyin.com', 'weibo.com', 'x.com'];
    const CONFIG = {
        target: GM_getValue('redirectTarget', DEFAULT_TARGET),  // 重定向目标（可通过菜单修改）
        cooldown: 30,                  // 冷静期秒数
    };

    // 主题配置
    const THEMES = {
        dark: {
            bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            text: '#fff',
            textMuted: '#888',
            textHint: '#666',
            accent: '#e94560',
            quoteText: '#aaa',
            btnBorder: '#444',
            btnText: '#666',
            btnHoverBorder: '#888',
            btnHoverText: '#aaa',
            choiceTitle: '#aaa'
        },
        light: {
            bg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            text: '#1a1a2e',
            textMuted: '#666',
            textHint: '#888',
            accent: '#e94560',
            quoteText: '#555',
            btnBorder: '#ccc',
            btnText: '#666',
            btnHoverBorder: '#999',
            btnHoverText: '#333',
            choiceTitle: '#555'
        }
    };

    // 获取当前主题模式
    function getThemeMode() {
        return GM_getValue('themeMode', 'auto');  // auto, light, dark
    }

    // 获取实际应用的主题
    function getActiveTheme() {
        const mode = getThemeMode();
        if (mode === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return mode;
    }

    const currentTheme = THEMES[getActiveTheme()];

    // 随机标题文案（灵魂拷问 + 温和提醒）
    const TITLES = [
        // 灵魂拷问风格
        '这真的是你想要的吗？',
        '未来的你会感谢现在的决定',
        '此刻的选择，定义你的一天',
        '你的目标还记得吗？',
        '时间正在流逝...',
        '这是最好的时间利用方式吗？',
        '你确定不会后悔吗？',
        '想想你真正想成为的人',
        // 温和提醒风格
        '休息一下，想想再决定',
        '深呼吸，冷静一下',
        '给自己30秒思考时间',
        '暂停一下，整理思绪',
        '慢下来，听听内心的声音',
        '这是一个选择的时刻',
    ];
    const randomTitle = TITLES[Math.floor(Math.random() * TITLES.length)];

    // 获取黑名单
    function getBlacklist() {
        return GM_getValue('blacklist', DEFAULT_BLACKLIST);
    }

    // 检查当前网站是否在黑名单中
    function isBlocked(hostname) {
        const blacklist = getBlacklist();
        return blacklist.some(site => hostname === site || hostname.endsWith('.' + site));
    }

    // 如果不在黑名单中，直接退出
    if (!isBlocked(location.hostname)) {
        return;
    }

    // 检查临时绕过（选择继续摸鱼后 5 分钟内不再拦截）
    const bypassKey = 'bypass_' + location.hostname;
    const bypassExpire = GM_getValue(bypassKey, 0);
    if (Date.now() < bypassExpire) {
        return;  // 在绕过期内，不拦截
    }
    // =================================

    // 注册菜单命令：设置重定向目标
    GM_registerMenuCommand('🎯 设置重定向目标', () => {
        const current = GM_getValue('redirectTarget', DEFAULT_TARGET);
        const newTarget = prompt('请输入重定向目标网址：', current);
        if (newTarget && newTarget.trim()) {
            try {
                new URL(newTarget.trim());  // 验证 URL 格式
                GM_setValue('redirectTarget', newTarget.trim());
                alert(`重定向目标已设置为：${newTarget.trim()}`);
            } catch (e) {
                alert('无效的网址格式，请输入完整的 URL（如 https://example.com）');
            }
        }
    });

    // 注册菜单命令：查看黑名单
    GM_registerMenuCommand('📋 查看黑名单', () => {
        const blacklist = getBlacklist();
        alert(`当前黑名单（${blacklist.length} 个网站）：\n\n${blacklist.join('\n')}`);
    });

    // 注册菜单命令：添加到黑名单
    GM_registerMenuCommand('➕ 添加网站到黑名单', () => {
        const site = prompt('请输入要拦截的域名（如 example.com）：', '');
        if (site && site.trim()) {
            const domain = site.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');
            const blacklist = getBlacklist();
            if (blacklist.includes(domain)) {
                alert(`${domain} 已在黑名单中`);
            } else {
                blacklist.push(domain);
                GM_setValue('blacklist', blacklist);
                alert(`已添加 ${domain} 到黑名单`);
            }
        }
    });

    // 注册菜单命令：从黑名单移除
    GM_registerMenuCommand('➖ 从黑名单移除网站', () => {
        const blacklist = getBlacklist();
        if (blacklist.length === 0) {
            alert('黑名单为空');
            return;
        }
        const site = prompt(`当前黑名单：\n${blacklist.join('\n')}\n\n请输入要移除的域名：`, '');
        if (site && site.trim()) {
            const domain = site.trim().toLowerCase();
            const index = blacklist.indexOf(domain);
            if (index > -1) {
                blacklist.splice(index, 1);
                GM_setValue('blacklist', blacklist);
                alert(`已从黑名单移除 ${domain}`);
            } else {
                alert(`${domain} 不在黑名单中`);
            }
        }
    });

    // 注册菜单命令：编辑完整黑名单
    GM_registerMenuCommand('✏️ 编辑完整黑名单', () => {
        const blacklist = getBlacklist();
        const input = prompt('编辑黑名单（每行一个域名，用换行或逗号分隔）：', blacklist.join(', '));
        if (input !== null) {
            const newList = input.split(/[,\n]/).map(s => s.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '')).filter(s => s.length > 0);
            GM_setValue('blacklist', newList);
            alert(`黑名单已更新，共 ${newList.length} 个网站`);
        }
    });

    // 注册菜单命令：重置黑名单
    GM_registerMenuCommand('🔙 重置为默认黑名单', () => {
        if (confirm(`确定要重置黑名单为默认设置吗？\n\n默认黑名单：\n${DEFAULT_BLACKLIST.join('\n')}`)) {
            GM_setValue('blacklist', DEFAULT_BLACKLIST);
            alert('黑名单已重置为默认设置');
        }
    });

    // 注册菜单命令：重置计数
    GM_registerMenuCommand('🔄 重置拦截计数', () => {
        GM_setValue('blockCount', 0);
        alert('拦截计数已重置！');
    });

    // 注册菜单命令：查看统计
    GM_registerMenuCommand('📊 查看拦截统计', () => {
        const count = GM_getValue('blockCount', 0);
        const target = GM_getValue('redirectTarget', DEFAULT_TARGET);
        const blacklist = getBlacklist();
        const themeMode = getThemeMode();
        const themeModeText = { auto: '跟随系统', light: '明亮模式', dark: '暗黑模式' }[themeMode];
        alert(`累计拦截次数：${count}\n当前重定向目标：${target}\n黑名单网站数：${blacklist.length}\n当前主题：${themeModeText}`);
    });

    // 注册菜单命令：切换主题
    GM_registerMenuCommand('🎨 切换主题模式', () => {
        const current = getThemeMode();
        const modes = ['auto', 'light', 'dark'];
        const labels = { auto: '跟随系统', light: '明亮模式', dark: '暗黑模式' };
        const currentLabel = labels[current];
        const choice = prompt(`当前主题：${currentLabel}\n\n请输入主题模式：\n1. auto - 跟随系统\n2. light - 明亮模式\n3. dark - 暗黑模式\n\n输入 1、2、3 或 auto、light、dark：`, current);
        if (choice !== null) {
            let newMode = choice.trim().toLowerCase();
            if (newMode === '1') newMode = 'auto';
            else if (newMode === '2') newMode = 'light';
            else if (newMode === '3') newMode = 'dark';
            if (modes.includes(newMode)) {
                GM_setValue('themeMode', newMode);
                alert(`主题已切换为：${labels[newMode]}\n刷新页面后生效`);
            } else {
                alert('无效的选择');
            }
        }
    });

    // 更新拦截计数
    const count = GM_getValue('blockCount', 0) + 1;
    GM_setValue('blockCount', count);

    // 阻止原页面加载
    document.documentElement.innerHTML = '';
    document.head.innerHTML = `
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: ${currentTheme.bg};
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: ${currentTheme.text};
            }
            .container { text-align: center; padding: 20px; }
            .icon { font-size: 64px; margin-bottom: 20px; }
            .title { font-size: 28px; font-weight: 600; margin-bottom: 10px; }
            .subtitle { color: ${currentTheme.accent}; margin-bottom: 8px; font-size: 14px; }
            .count { color: ${currentTheme.textMuted}; margin-bottom: 40px; }
            .timer {
                font-size: 72px;
                font-weight: 700;
                color: ${currentTheme.accent};
                margin-bottom: 20px;
                font-variant-numeric: tabular-nums;
            }
            .hint { color: ${currentTheme.textHint}; font-size: 14px; }
            .quote-container { margin-top: 40px; padding: 20px; max-width: 500px; }
            .quote-text { color: ${currentTheme.quoteText}; font-size: 16px; font-style: italic; line-height: 1.6; }
            .quote-source { color: ${currentTheme.textHint}; font-size: 12px; margin-top: 10px; }
            .actions { margin-top: 30px; display: flex; gap: 12px; justify-content: center; }
            .btn {
                padding: 10px 24px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 14px;
            }
            .btn-primary {
                background: ${currentTheme.accent};
                border: none;
                color: #fff;
            }
            .btn-primary:hover { background: #d63850; }
            .btn-secondary {
                background: transparent;
                border: 1px solid ${currentTheme.btnBorder};
                color: ${currentTheme.btnText};
            }
            .btn-secondary:hover { border-color: ${currentTheme.btnHoverBorder}; color: ${currentTheme.btnHoverText}; }
            .choice-container { display: none; margin-top: 30px; }
            .choice-title { font-size: 20px; margin-bottom: 20px; color: ${currentTheme.choiceTitle}; }
            .pills { display: flex; gap: 30px; justify-content: center; }
            .pill {
                padding: 20px 40px;
                border-radius: 30px;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 16px;
                font-weight: 600;
                border: none;
                min-width: 160px;
            }
            .pill-blue {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            .pill-blue:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6); }
            .pill-red {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: #fff;
                box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
            }
            .pill-red:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6); }
            .pill-label { display: block; font-size: 12px; margin-top: 5px; opacity: 0.8; font-weight: normal; }
        </style>
    `;

    document.body.innerHTML = `
        <div class="container">
            <div class="icon">🛑</div>
            <div class="title">${randomTitle}</div>
            <div class="subtitle">${location.hostname}</div>
            <div class="count">这是你第 <strong>${count}</strong> 次被拦截</div>
            <div class="timer" id="countdown">${CONFIG.cooldown}</div>
            <div class="hint" id="hint">${CONFIG.cooldown}秒冷静期后做出你的选择</div>
            <div class="actions" id="actions">
                <button class="btn btn-secondary" id="skip">算了，回去干活</button>
            </div>
            <div class="choice-container" id="choice">
                <div class="choice-title">冷静期结束，做出你的选择</div>
                <div class="pills">
                    <button class="pill pill-blue" id="blue-pill">
                        💼 回去干活
                        <span class="pill-label">前往工作页面</span>
                    </button>
                    <button class="pill pill-red" id="red-pill">
                        🎮 就要摸鱼
                        <span class="pill-label">继续访问此网站</span>
                    </button>
                </div>
            </div>
            <div class="quote-container">
                <div class="quote-text" id="quote">加载中...</div>
                <div class="quote-source" id="quote-source"></div>
            </div>
        </div>
    `;

    // 获取一言语录
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://v1.hitokoto.cn/?c=d&c=h&c=i&c=k',  // d=哲学, h=影视, i=诗词, k=网易云热评
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                document.getElementById('quote').textContent = `「${data.hitokoto}」`;
                const source = data.from_who ? `—— ${data.from_who}「${data.from}」` : `—— ${data.from}`;
                document.getElementById('quote-source').textContent = source;
            } catch (e) {
                document.getElementById('quote').textContent = '「自律给我自由」';
                document.getElementById('quote-source').textContent = '—— 康德';
            }
        },
        onerror: function() {
            document.getElementById('quote').textContent = '「你的时间有限，不要浪费在别人的生活里」';
            document.getElementById('quote-source').textContent = '—— 乔布斯';
        }
    });

    // 倒计时
    let remaining = CONFIG.cooldown;
    const countdownEl = document.getElementById('countdown');
    const timer = setInterval(() => {
        remaining--;
        countdownEl.textContent = remaining;
        if (remaining <= 0) {
            clearInterval(timer);
            showChoice();
        }
    }, 1000);

    // 显示选择界面
    function showChoice() {
        document.getElementById('countdown').textContent = '⏰';
        document.getElementById('hint').textContent = '时间到！做出你的选择';
        document.getElementById('actions').style.display = 'none';
        document.getElementById('choice').style.display = 'block';
    }

    // 直接跳转按钮（冷静期内）
    document.getElementById('skip').addEventListener('click', () => {
        clearInterval(timer);
        window.location.replace(CONFIG.target);
    });

    // 蓝色药丸：回去干活
    document.getElementById('blue-pill').addEventListener('click', () => {
        window.location.replace(CONFIG.target);
    });

    // 红色药丸：继续摸鱼（设置 5 分钟绕过）
    document.getElementById('red-pill').addEventListener('click', () => {
        const bypassKey = 'bypass_' + location.hostname;
        GM_setValue(bypassKey, Date.now() + 5 * 60 * 1000);  // 5 分钟后过期
        location.reload();
    });
})();
