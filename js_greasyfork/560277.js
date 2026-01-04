// ==UserScript==
// @name         NexusPHP 自动魔力兑换
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  不显示页面UI，通过油猴菜单控制开关。自动兑换最大上传量，智能策略。
// @author       KK
// @match        *://*/mybonus.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560277/NexusPHP%20%E8%87%AA%E5%8A%A8%E9%AD%94%E5%8A%9B%E5%85%91%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/560277/NexusPHP%20%E8%87%AA%E5%8A%A8%E9%AD%94%E5%8A%9B%E5%85%91%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置常量 ===
    const KEY_ENABLE_AUTO = "cfg_enable_auto";       // 总开关键名
    const KEY_ENABLE_DL   = "cfg_enable_download";   // 自动买下载键名
    const INTERVAL = 10000; // 倒计时毫秒

    // === 读取设置 (核心逻辑) ===
    // GM_getValue(key, defaultValue) - 如果没存过，就用默认值
    let isScriptEnabled = GM_getValue(KEY_ENABLE_AUTO, true);  // 默认开启
    let isDownloadEnabled = GM_getValue(KEY_ENABLE_DL, false); // 默认关闭

    // === 注册油猴菜单 ===
    function registerMenus() {
        // 菜单 1: 总开关
        const menuText1 = isScriptEnabled ? "✅ 自动兑换: 已开启 (点击关闭)" : "❌ 自动兑换: 已关闭 (点击开启)";
        GM_registerMenuCommand(menuText1, () => {
            GM_setValue(KEY_ENABLE_AUTO, !isScriptEnabled);
            location.reload(); // 刷新页面应用设置
        });

        // 菜单 2: 自动买下载开关
        const menuText2 = isDownloadEnabled ? "✅ 分享率高买下载: 已开启" : "❌ 分享率高买下载: 已关闭";
        GM_registerMenuCommand(menuText2, () => {
            GM_setValue(KEY_ENABLE_DL, !isDownloadEnabled);
            location.reload(); // 刷新页面应用设置
        });
    }

    // 初始化菜单
    registerMenus();

    // === 如果总开关是关闭的，直接退出，不执行任何逻辑 ===
    if (!isScriptEnabled) {
        console.log("NexusPHP Auto: 脚本已在菜单中关闭，停止运行。");
        return;
    }

    // ==========================================
    // 下面是核心执行逻辑 (与之前版本保持一致但去除了交互UI)
    // ==========================================

    // 正则表达式
    const REGEX_UPLOAD = /上传|上傳|Upload/i;
    const REGEX_DOWNLOAD = /下载|下載|Download/i;
    const REGEX_NEED_MORE = /需要更多|Need more/i;
    const REGEX_HIGH_RATIO = /分享率|Share ratio|Ratio/i;
    const REGEX_EXCLUDE = /捐赠|捐贈|赠送|贈送|Gift|Donate|Charity|Invite/i;

    // 简易状态提示 (仅保留一个小浮窗提示进度，不包含交互)
    function showStatus(msg, statusType = 'normal') {
        let statusBox = document.getElementById('magic-auto-status');
        if (!statusBox) {
            statusBox = document.createElement('div');
            statusBox.id = 'magic-auto-status';
            statusBox.style.cssText = 'position:fixed; top:10px; right:10px; padding:8px 12px; z-index:9999; border-radius:4px; font-size:12px; font-weight:bold; color:white; font-family: sans-serif; box-shadow: 0 2px 5px rgba(0,0,0,0.3); pointer-events: none; opacity: 0.9;';
            document.body.appendChild(statusBox);
        }

        const colors = {
            'error': '#d32f2f',   // 红
            'warn':  '#f57c00',   // 橙
            'normal':'#388e3c'    // 绿
        };
        statusBox.style.background = colors[statusType] || colors['normal'];
        statusBox.innerText = msg;
    }

    function parseSize(text) {
        const regex = /(\d+(\.\d+)?)\s*([TGM]i?B)/i;
        const match = text.match(regex);
        if (!match) return 0;
        let val = parseFloat(match[1]);
        let unit = match[3].toUpperCase().replace('I', '');
        if (unit === 'TB') val *= 1024;
        else if (unit === 'MB') val /= 1024;
        return val;
    }

    function scanOptions() {
        const options = document.querySelectorAll('input[name="option"]');
        let uploadList = [];
        let downloadList = [];

        options.forEach(input => {
            const row = input.closest('tr');
            if (!row) return;
            const btn = row.querySelector('input[type="submit"]');
            if (!btn) return;
            const rowText = row.innerText;
            
            if (REGEX_EXCLUDE.test(rowText)) return; // 排除慈善

            const size = parseSize(rowText);
            const item = { size: size, btn: btn, text: rowText, inputVal: input.value };

            if (REGEX_UPLOAD.test(rowText)) {
                uploadList.push(item);
            } else if (REGEX_DOWNLOAD.test(rowText)) {
                downloadList.push(item);
            }
        });

        uploadList.sort((a, b) => b.size - a.size);
        downloadList.sort((a, b) => b.size - a.size);

        return { uploadList, downloadList };
    }

    function startCountdown(btn, actionName, statusType = 'normal') {
        let countdown = INTERVAL / 1000;
        showStatus(`${actionName} ${countdown}s...`, statusType);
        
        const timer = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                showStatus(`${actionName} ${countdown}s...`, statusType);
            } else {
                clearInterval(timer);
                showStatus(`正在点击...`, statusType);
                btn.click();
            }
        }, 1000);
    }

    function init() {
        console.log("NexusPHP Auto: 开始运行...");
        
        const { uploadList, downloadList } = scanOptions();

        if (uploadList.length === 0) {
            // 如果连选项都没加载出来，可能是未登录或者页面错误
            return;
        }

        const bestUpload = uploadList[0];
        const uploadBtn = bestUpload.btn;
        const isUploadDisabled = uploadBtn.disabled || uploadBtn.classList.contains('disabled');

        if (!isUploadDisabled) {
            // === 正常购买上传 ===
            startCountdown(uploadBtn, `购买上传 ${bestUpload.size.toFixed(0)}GB`, 'normal');
        } 
        else {
            // === 上传按钮被禁用 ===
            const btnText = uploadBtn.value; 

            if (REGEX_NEED_MORE.test(btnText)) {
                showStatus(`魔力不足，停止运行`, 'error');
                return;
            } 
            else if (REGEX_HIGH_RATIO.test(btnText)) {
                // 分享率过高
                if (!isDownloadEnabled) {
                    showStatus(`分享率高，自动买下载已关闭 -> 停止`, 'warn');
                    return; 
                }

                if (downloadList.length === 0) {
                    showStatus(`分享率高，但无下载选项 -> 停止`, 'error');
                    return; 
                }

                const bestDownload = downloadList[0];
                const downloadBtn = bestDownload.btn;
                const isDownloadDisabled = downloadBtn.disabled || downloadBtn.classList.contains('disabled');

                if (!isDownloadDisabled) {
                    startCountdown(downloadBtn, `降分享率: 买下载 ${bestDownload.size.toFixed(0)}GB`, 'warn');
                } else {
                    showStatus(`下载选项也不可点 -> 停止`, 'error');
                }
            } 
            else {
                showStatus(`按钮禁用(${btnText})`, 'error');
            }
        }
    }

    // 启动主程序
    setTimeout(init, 500);

})();
