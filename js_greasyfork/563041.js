// ==UserScript==
// @name         [哔哩哔哩直播]-自动切换最高画质
// @description  自动切换直播间画质为最高画质。
// @author       Asuna
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @version      1.4.1
// @license      MIT
// @namespace https://greasyfork.org/users/1390050
// @downloadURL https://update.greasyfork.org/scripts/563041/%5B%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%5D-%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563041/%5B%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%5D-%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 控制台样式化输出工具
    const consoleStyle = {
        // 成功类型：绿色渐变
        success: function(message) {
            console.log(`%c✅ ${message}`, 'color: #fff; background: linear-gradient(270deg, #986fee, #8695e6, #68b7dd, #18d7d3); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;');
        },
        // 错误类型：红色渐变
        error: function(message) {
            console.log(`%c❌ ${message}`, 'color: #fff; background: linear-gradient(270deg, #ff6b6b, #ff8e8e, #ffa5a5); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;');
        },
        // 警告类型：橙色渐变
        warning: function(message) {
            console.log(`%c⚠️ ${message}`, 'color: #fff; background: linear-gradient(270deg, #ff9800, #ffb84d, #ffcc80); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;');
        },
        // 信息类型：蓝色渐变
        info: function(message) {
            console.log(`%cℹ️ ${message}`, 'color: #fff; background: linear-gradient(270deg, #2196f3, #64b5f6, #90caf9); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;');
        }
    };

    // 全局控制变量：嵌套页面自动跳转功能，默认关闭
    // 如需开启，将 ENABLE_NESTED_REDIRECT 设置为 true
    const ENABLE_NESTED_REDIRECT = false;

    // 保存定时器引用以便清理
    const timers = [];

    // 如果直播间嵌套的，跳转到实际房间，需要开启功能才会执行
    if (ENABLE_NESTED_REDIRECT) {
        let hasRedirected = false;
        const redirectTimer = setInterval(() => {
            try {
                if (hasRedirected) {
                    clearInterval(redirectTimer);
                    return;
                }
                const nestedPage = document.querySelector('iframe[src*=blanc]');
                if (nestedPage && nestedPage.src) {
                    hasRedirected = true;
                    clearInterval(redirectTimer);
                    unsafeWindow.location.href = nestedPage.src;
                }
            } catch (error) {
                consoleStyle.error(`重定向检查出错: ${error.message || error}`);
                clearInterval(redirectTimer);
            }
        }, 1000);
        timers.push(redirectTimer);
    }else {
        consoleStyle.info('嵌套页面自动跳转功能未启用，取消跳转');
    }

    // 隐藏加载动画
    const styleElement = document.createElement('style');
    styleElement.textContent = `.web-player-loading { opacity: 0; }`;
    document.head.appendChild(styleElement);

    // 确保播放器已就绪（添加超时机制）
    let playerReady = false;
    try {
        await new Promise((resolve, reject) => {
            const maxAttempts = 30; // 最多等待30秒
            let attempts = 0;
            const timer = setInterval(() => {
                attempts++;
                try {
                    if (
                        unsafeWindow.livePlayer
                        && unsafeWindow.livePlayer.getPlayerInfo
                        && typeof unsafeWindow.livePlayer.getPlayerInfo === 'function'
                    ) {
                        const playerInfo = unsafeWindow.livePlayer.getPlayerInfo();
                        if (
                            playerInfo
                            && playerInfo.playurl
                            && unsafeWindow.livePlayer.switchQuality
                            && typeof unsafeWindow.livePlayer.switchQuality === 'function'
                        ) {
                            clearInterval(timer);
                            playerReady = true;
                            resolve();
                            return;
                        }
                    }
                } catch (error) {
                    consoleStyle.error(`检查播放器状态出错: ${error.message || error}`);
                }

                if (attempts >= maxAttempts) {
                    clearInterval(timer);
                    reject(new Error('播放器加载超时'));
                }
            }, 1000);
            timers.push(timer);
        });
    } catch (error) {
        consoleStyle.error(`播放器初始化失败: ${error.message || error}`);
        // 清理所有定时器
        timers.forEach(timer => clearInterval(timer));
        return;
    }

    if (!playerReady) {
        timers.forEach(timer => clearInterval(timer));
        return;
    }

    // 获取最高画质编号（添加错误处理）
    let highestQualityNumber = null;

    try {
        const playerInfo = unsafeWindow.livePlayer.getPlayerInfo();
        if (!playerInfo || !playerInfo.playurl) {
            throw new Error('无法获取播放器信息');
        }

        // 检查画质候选列表
        if (!playerInfo.qualityCandidates || !Array.isArray(playerInfo.qualityCandidates) || playerInfo.qualityCandidates.length === 0) {
            throw new Error('无法获取画质候选列表');
        }

        // 按画质编号降序排序，获取最高画质
        const sortedCandidates = [...playerInfo.qualityCandidates].sort((a, b) => (b.qn || 0) - (a.qn || 0));
        highestQualityNumber = sortedCandidates[0].qn;

        if (!highestQualityNumber) {
            throw new Error('无法获取最高画质编号');
        }

        consoleStyle.success(`已获取最高画质: ${highestQualityNumber}`);
    } catch (error) {
        consoleStyle.error(`获取画质信息失败: ${error.message || error}`);
        timers.forEach(timer => clearInterval(timer));
        return;
    }

    // 清理所有资源的函数
    function cleanup() {
        timers.forEach(timer => clearInterval(timer));
        timers.length = 0;
        consoleStyle.success('画质切换完成，脚本已自动卸载');
    }

    // 切换画质，完成后自动卸载
    let isSwitching = false;
    let stableCount = 0; // 连续稳定检测次数
    const requiredStableChecks = 5; // 需要连续5次检测到最高画质才认为稳定

    const qualitySwitchTimer = setInterval(() => {
        try {
            if (isSwitching) return; // 防止重复切换

            const playerInfo = unsafeWindow.livePlayer.getPlayerInfo();
            if (!playerInfo) return;

            const currentQualityNumber = playerInfo.quality;

            // 如果当前画质已经是最高画质
            if (currentQualityNumber === highestQualityNumber) {
                stableCount++;
                // 连续检测到最高画质达到要求次数，认为切换成功并稳定
                if (stableCount >= requiredStableChecks) {
                    clearInterval(qualitySwitchTimer);
                    cleanup();
                    return;
                }
            } else {
                // 如果当前画质不是最高画质，则切换
                stableCount = 0; // 重置稳定计数
                isSwitching = true;
                unsafeWindow.livePlayer.switchQuality(highestQualityNumber);

                // 重置切换标志
                setTimeout(() => {
                    isSwitching = false;
                }, 2000);
            }
        } catch (error) {
            consoleStyle.error(`切换画质出错: ${error.message || error}`);
            isSwitching = false;
        }
    }, 1000);
    timers.push(qualitySwitchTimer);

    // 页面卸载时清理定时器
    window.addEventListener('beforeunload', () => {
        cleanup();
    });

})();
