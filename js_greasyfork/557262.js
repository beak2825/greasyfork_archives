// ==UserScript==
// @name         玉豆分享自动解析（性能优化版）
// @namespace    https://github.com/AWangDog/yudou_decode/
// @license      GPLv3
// @version      2.0
// @description  破解玉豆，日常罢了
// @author       AWang_Dog & 性能优化
// @match        https://www.yudou6677.top/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yudou66.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/557262/%E7%8E%89%E8%B1%86%E5%88%86%E4%BA%AB%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%EF%BC%88%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557262/%E7%8E%89%E8%B1%86%E5%88%86%E4%BA%AB%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%EF%BC%88%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// 全局状态管理
const state = {
    foundPassword: false,
    canDeCrypt: 0,
    triedPasswords: new Set(), // 缓存已尝试的密码
    activeWorkers: [], // 跟踪活跃的worker
    maxWorkers: navigator.hardwareConcurrency || 4, // 根据CPU核心数设置worker数量
    totalNumbers: 9999
};

// 常见密码列表 - 优先尝试
const commonPasswords = [
    "0000", "0123", "1111", "1112", "1122", "1133", "1144", "1155", "1166", "1177",
    "1188", "1199", "1222", "1234", "2211", "2222", "2233", "2244", "2255", "2266",
    "2277", "2288", "2299", "2333", "2345", "3311", "3322", "3333", "3344", "3355",
    "3366", "3377", "3388", "3399", "3444", "3456", "4321", "4411", "4422", "4433",
    "4444", "4455", "4466", "4477", "4488", "4499", "4555", "4567", "5511", "5522",
    "5533", "5544", "5555", "5566", "5577", "5588", "5599", "5666", "5678", "6611",
    "6622", "6633", "6644", "6655", "6666", "6677", "6688", "6699", "6777", "6789",
    "7711", "7722", "7733", "7744", "7755", "7766", "7777", "7788", "7799", "7888",
    "8811", "8822", "8833", "8844", "8855", "8866", "8877", "8888", "8899", "8999",
    "9900", "9911", "9922", "9933", "9944", "9955", "9966", "9977", "9988", "9999"
];

// Worker代码模板
const workerCode = `
// 导入CryptoJS库（在实际环境中，Worker需要单独加载CryptoJS）
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');

self.onmessage = function(e) {
    const { start, end, encryptionItems, triedPasswords } = e.data;
    let found = false;

    for (let i = start; i <= end && !found; i++) {
        const pwd = i.toString().padStart(4, '0');

        // 跳过已尝试过的密码
        if (triedPasswords.has(pwd)) continue;

        for (const item of encryptionItems) {
            try {
                // 尝试解密
                const decrypted = CryptoJS.AES.decrypt(item, pwd);

                // 验证解密结果是否有效
                if (decrypted.sigBytes <= 0) continue;

                const result = decrypted.toString(CryptoJS.enc.Utf8);

                // 基本验证：非空、长度合理、包含有效字符
                if (!result || result.length < 5 || !result.match(/[a-zA-Z0-9]/)) continue;

                // 解码URL编码的结果
                const decodedResult = decodeURIComponent(result);

                // 发送成功消息
                self.postMessage({
                    success: true,
                    password: pwd,
                    result: decodedResult
                });

                found = true;
                break;
            } catch (e) {
                // 静默失败，继续尝试
            }
        }
    }

    // 如果没有找到，发送完成消息
    if (!found) {
        self.postMessage({ success: false, start, end });
    }
};
`;

// 创建Web Worker
function createWorker() {
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    state.activeWorkers.push(worker);
    return worker;
}

// 清理所有Worker
function cleanupWorkers() {
    state.activeWorkers.forEach(worker => worker.terminate());
    state.activeWorkers = [];
}

// 优化的解密函数
function multiDecrypt_(pwd) {
    // 检查是否已尝试过此密码
    if (state.triedPasswords.has(pwd)) {
        console.log(`密码 ${pwd} 已尝试过，跳过`);
        return 0;
    }

    // 记录到已尝试集合
    state.triedPasswords.add(pwd);

    // 如果已找到密码，直接返回成功
    if (state.canDeCrypt !== 0) return 1;

    try {
        for (const item of window.encryption) {
            try {
                // 尝试解密
                const result = decryptItem(item, pwd);

                // 验证解密结果
                if (result && isValidDecryption(result)) {
                    state.canDeCrypt = result;
                    displayResult(result, pwd);
                    return 1;
                }
            } catch (e) {
                // 继续尝试下一个加密项
            }
        }

        console.log(`密码 ${pwd} 错误`);
        return 0;
    } catch (error) {
        console.error('解密过程出错:', error);
        return 0;
    }
}

// 单个项解密函数
function decryptItem(item, pwd) {
    const decrypted = CryptoJS.AES.decrypt(item, pwd);
    if (decrypted.sigBytes <= 0) return '';

    const result = decrypted.toString(CryptoJS.enc.Utf8);
    return decodeURIComponent(result);
}

// 验证解密结果是否有效
function isValidDecryption(result) {
    // 基本验证条件
    return result &&
           result.trim() &&
           !result.includes('undefined') &&
           result.length > 5 &&
           /[a-zA-Z0-9]/.test(result);
}

// 显示解密结果
function displayResult(result, password) {
    state.foundPassword = true;

    // 更新DOM显示结果
    const resultElement = document.getElementById("result");
    if (resultElement) {
        resultElement.innerHTML = result;
        resultElement.style.color = 'green';
        resultElement.style.fontWeight = 'bold';
    }

    console.log(`✓ 找到正确密码: ${password}`);
    console.log(`✓ 解密结果: ${result}`);

    // 显示成功提示
    showNotification(`找到密码: ${password}`, 'success');

    // 清理Worker
    cleanupWorkers();
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建临时通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;

    // 设置样式
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else {
        notification.style.backgroundColor = '#2196F3';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 尝试常用密码
async function tryCommonPasswords() {
    console.log('开始尝试常用密码...');

    for (const pwd of commonPasswords) {
        if (state.foundPassword) break;

        console.log(`尝试常用密码: ${pwd}`);
        if (multiDecrypt_(pwd) === 1) {
            console.log('在常用密码列表中找到匹配!');
            return true;
        }
    }

    console.log('常用密码尝试完毕，未找到匹配');
    return false;
}

// 使用Web Worker进行暴力破解
async function bruteForceWithWorkers() {
    if (!window.encryption || window.encryption.length === 0) {
        console.error('未找到加密数据，请检查页面是否正确加载');
        return;
    }

    console.log(`开始多线程暴力破解，使用 ${state.maxWorkers} 个Worker...`);

    // 计算每个Worker处理的密码范围
    const passwordsPerWorker = Math.ceil(state.totalNumbers / state.maxWorkers);
    const promises = [];

    // 创建并启动所有Worker
    for (let i = 0; i < state.maxWorkers; i++) {
        const start = i * passwordsPerWorker;
        const end = Math.min(start + passwordsPerWorker - 1, state.totalNumbers);

        promises.push(new Promise((resolve) => {
            const worker = createWorker();

            worker.onmessage = function(e) {
                if (e.data.success) {
                    // 找到密码，记录结果
                    state.canDeCrypt = e.data.result;
                    state.foundPassword = true;
                    displayResult(e.data.result, e.data.password);
                    resolve({ success: true, password: e.data.password });
                } else {
                    // 当前Worker完成任务
                    console.log(`Worker ${i+1} 完成范围 ${start}-${end}`);
                    resolve({ success: false });
                }
            };

            // 发送任务给Worker
            worker.postMessage({
                start,
                end,
                encryptionItems: window.encryption,
                triedPasswords: state.triedPasswords
            });
        }));
    }

    // 等待所有Worker完成或找到密码
    await Promise.all(promises);

    // 检查最终结果
    if (!state.foundPassword) {
        console.log('未找到结果');
        showNotification('未找到匹配的密码', 'info');
    }
}

// 主入口函数
async function main() {
    'use strict';

    console.log('=== 玉豆分享自动解析（优化版）===');
    console.log(`检测到CPU核心数: ${navigator.hardwareConcurrency || '未知'}`);

    try {
        // 1. 首先尝试常用密码
        const commonPasswordFound = await tryCommonPasswords();

        // 2. 如果常用密码未找到，进行暴力破解
        if (!commonPasswordFound) {
            await bruteForceWithWorkers();
        }
    } catch (error) {
        console.error('程序执行出错:', error);
        showNotification('程序执行出错，请检查控制台', 'error');
    } finally {
        // 确保清理资源
        setTimeout(() => {
            if (!state.activeWorkers.length) return;
            console.log('清理剩余Worker资源');
            cleanupWorkers();
        }, 5000);
    }
}

// 添加必要的CSS动画
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// 启动程序
(function() {
    addAnimations();

    // 等待页面完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
