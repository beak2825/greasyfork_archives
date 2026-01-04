// ==UserScript==
// @name         网页划词朗读
// @name:en      Web Selection Reader
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  使用阿里云TTS朗读网页选定文本。支持自定义发音人、一次性设置Appkey/Token、按住Ctrl临时禁用、网站黑名单功能。
// @description:en Read selected text on any webpage using Aliyun TTS. Supports custom voice, one-time Appkey/Token setup, holding Ctrl to disable, and a site blacklist feature.
// @author       Gemini & YourName
// @license      CC BY-NC-SA 4.0
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      nls-gateway-cn-shanghai.aliyuncs.com
// @downloadURL https://update.greasyfork.org/scripts/549939/%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/549939/%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const DEFAULT_VOICE_FALLBACK = 'tomoka'; // 默认的发音人 (当用户未设置时)
    const DEFAULT_FORMAT = 'mp3';
    const DEFAULT_SAMPLE_RATE = 16000;
    const MAX_TEXT_LENGTH = 500; // 限制朗读的最大字符数

    // --- 油猴存储键名 ---
    const KEY_APPKEY = 'aliyun_tts_appkey';
    const KEY_TOKEN = 'aliyun_tts_token';
    const KEY_BLACKLIST = 'tts_blacklist';
    const KEY_VOICE = 'aliyun_tts_voice'; // 新增：用于存储发音人

    // --- 变量和状态 ---
    let audio = null;
    let isPlaying = false;

    // --- 从油猴存储中读取配置 ---
    let appkey = GM_getValue(KEY_APPKEY, '');
    let token = GM_getValue(KEY_TOKEN, '');
    let voice = GM_getValue(KEY_VOICE, DEFAULT_VOICE_FALLBACK);
    let blacklist = JSON.parse(GM_getValue(KEY_BLACKLIST, '[]'));

    // --- 核心功能：语音合成 ---

    /**
     * @description 调用阿里云TTS API进行语音合成并播放
     * @param {string} text - 需要朗读的文本
     */
    function speak(text) {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        }

        if (!appkey || !token) {
            alert('尚未配置Appkey或Token。请点击油猴扩展图标，在菜单中进行设置。');
            if (confirm('是否现在就去设置？')) {
                setupCredentials();
            }
            return;
        }

        const params = new URLSearchParams({
            appkey: appkey,
            token: token,
            text: text,
            format: DEFAULT_FORMAT,
            sample_rate: DEFAULT_SAMPLE_RATE,
            voice: voice, // 使用可配置的voice变量
        });

        const url = `https://nls-gateway-cn-shanghai.aliyuncs.com/stream/v1/tts?${params.toString().replace(/\+/g, '%20')}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function(response) {
                if (response.status === 200) {
                    const audioBlob = response.response;
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audio = new Audio(audioUrl);
                    audio.play();
                    isPlaying = true;
                    audio.onended = () => {
                        isPlaying = false;
                        URL.revokeObjectURL(audioUrl);
                    };
                } else {
                    response.response.text().then(errorText => {
                        console.error('阿里云TTS请求失败:', errorText);
                        try {
                            const errorJson = JSON.parse(errorText);
                            alert(`语音合成失败: ${errorJson.message}\n\n这通常意味着Token已过期或Appkey/发音人名称不正确。`);
                        } catch (e) {
                            alert(`语音合成失败，无法解析错误信息: ${errorText}`);
                        }
                    });
                }
            },
            onerror: function(error) {
                console.error('网络请求错误:', error);
                alert('网络请求失败，请检查网络连接或浏览器控制台。');
            }
        });
    }


    // --- 配置与菜单功能 ---

    /**
     * @description 弹窗引导用户一次性设置Appkey和Token
     */
    function setupCredentials() {
        const placeholder = "请按格式粘贴“Appkey,Token” (用英文逗号分隔)\n\n示例:\nLTAI5t...,450343c7...";
        const currentValues = appkey && token ? `${appkey},${token}` : '';
        const input = prompt("⚙️ 设置阿里云 Appkey 和 Token", currentValues || placeholder);

        if (input === null) {
            alert('操作已取消。');
            return;
        }

        const parts = input.split(',').map(s => s.trim());

        if (parts.length !== 2 || !parts[0] || !parts[1]) {
            alert('格式错误！\n\n请输入由一个英文逗号分隔的Appkey和Token。');
            return;
        }

        appkey = parts[0];
        token = parts[1];
        GM_setValue(KEY_APPKEY, appkey);
        GM_setValue(KEY_TOKEN, token);

        alert('Appkey 和 Token 已成功更新！');
    }

    /**
     * @description 设置TTS发音人
     */
    function setupVoice() {
        const voiceList = "常用日语女声: airi, haruka, nanako, shiori, tomoka";
        const input = prompt(`🎤 请输入要使用的发音人名称。\n当前为: ${voice}\n\n${voiceList}\n(您也可以输入其他任何有效的阿里云TTS发音人名称)`, voice);

        if (input === null) {
            alert('操作已取消。');
            return;
        }

        const newVoice = input.trim();
        if (newVoice) {
            voice = newVoice;
            GM_setValue(KEY_VOICE, voice);
            alert(`发音人已更新为: ${voice}`);
        } else {
            alert('发音人名称不能为空！');
        }
    }

    /**
     * @description 将当前网站域名添加到黑名单 (立即生效)
     */
    function addCurrentSiteToBlacklist() {
        const hostname = window.location.hostname;
        if (!blacklist.includes(hostname)) {
            blacklist.push(hostname); // **关键修正: 直接更新内存中的变量**
            GM_setValue(KEY_BLACKLIST, JSON.stringify(blacklist));
            alert(`【${hostname}】\n\n已加入朗读黑名单，在本页面立即生效。\n菜单选项将在刷新后更新。`);
        } else {
            alert(`【${hostname}】\n\n已在黑名单中，无需重复添加。`);
        }
    }

    /**
     * @description 从黑名单中移除当前网站域名 (立即生效)
     */
    function removeCurrentSiteFromBlacklist() {
        const hostname = window.location.hostname;
        const index = blacklist.indexOf(hostname);
        if (index > -1) {
            blacklist.splice(index, 1); // **关键修正: 直接更新内存中的变量**
            GM_setValue(KEY_BLACKLIST, JSON.stringify(blacklist));
            alert(`【${hostname}】\n\n已从朗读黑名单中移除，在本页面立即生效。\n菜单选项将在刷新后更新。`);
        } else {
            alert(`【${hostname}】\n\n未在黑名单中。`);
        }
    }

    /**
     * @description 检查当前网站是否在黑名单中
     * @returns {boolean}
     */
    function isSiteBlacklisted() {
        return blacklist.includes(window.location.hostname);
    }

    // --- 注册油猴菜单命令 ---
    GM_registerMenuCommand('⚙️ 设置 Appkey 和 Token', setupCredentials);
    GM_registerMenuCommand('🎤 设置发音人 (Voice)', setupVoice);

    if (isSiteBlacklisted()) {
        GM_registerMenuCommand('✅ 在此网站上启用朗读', removeCurrentSiteFromBlacklist);
    } else {
        GM_registerMenuCommand('❌ 在此网站上禁用朗读', addCurrentSiteToBlacklist);
    }


    // --- 事件监听器 ---
    document.addEventListener('mouseup', function(event) {
        if (isSiteBlacklisted()) {
            return;
        }

        if (event.ctrlKey) {
            return;
        }

        setTimeout(() => {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText.length > 0 && selectedText.length < MAX_TEXT_LENGTH) {
                speak(selectedText);
            }
        }, 100);
    });

})();