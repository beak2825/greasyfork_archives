// ==UserScript==
// @name         绕过傻逼腾讯的拦截
// @namespace    https://pmya.xyz/
// @version      1.1
// @description  绕过腾讯拦截页面，带圆形进度条倒计时，自动跳转到目标网站
// @author       皮梦 & Deepseek
// @match        https://c.pc.qq.com/ios.html*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/548194/%E7%BB%95%E8%BF%87%E5%82%BB%E9%80%BC%E8%85%BE%E8%AE%AF%E7%9A%84%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/548194/%E7%BB%95%E8%BF%87%E5%82%BB%E9%80%BC%E8%85%BE%E8%AE%AF%E7%9A%84%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析URL获取目标网站
    function getTargetUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedUrl = urlParams.get('url');
        if (encodedUrl) {
            return decodeURIComponent(encodedUrl);
        }
        return null;
    }

    // 获取目标网站
    const targetUrl = getTargetUrl();
    if (!targetUrl) {
        console.error('无法从URL中提取目标网站');
        return;
    }

    // 完全替换页面内容
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    // 创建新样式
    const style = document.createElement('style');
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
            color: white;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: rgba(0, 0, 0, 0.7);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            max-width: 600px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        h1 {
            font-size: 28px;
            margin-bottom: 20px;
            color: #ff9966;
        }
        p {
            font-size: 18px;
            margin-bottom: 25px;
            line-height: 1.6;
        }
        .countdown-container {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 20px auto;
        }
        .countdown-svg {
            width: 120px;
            height: 120px;
            transform: rotate(-90deg);
        }
        .countdown-circle-bg {
            fill: none;
            stroke: rgba(255, 255, 255, 0.2);
            stroke-width: 6;
        }
        .countdown-circle {
            fill: none;
            stroke: #4fc3f7;
            stroke-width: 6;
            stroke-linecap: round;
            transition: stroke-dashoffset 0.3s ease-in-out;
        }
        .countdown-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 28px;
            font-weight: bold;
            color: #4fc3f7;
        }
        .button {
            background: #4fc3f7;
            color: white;
            border: none;
            padding: 12px 25px;
            font-size: 18px;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 15px;
        }
        .button:hover {
            background: #029be5;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .url {
            word-break: break-all;
            background: rgba(255, 255, 255, 0.1);
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
        }
    `;
    document.head.appendChild(style);

    // 创建页面内容
    const container = document.createElement('div');
    container.className = 'container';

    container.innerHTML = `
        <title>正在帮你绕过傻逼腾讯的拦截</title>
        <h1>🚀 正在绕过傻逼腾讯的拦截网站</h1>
        <h4>您即将访问的网站被傻逼腾讯无理拦截，我们正在帮您自动跳转</h4>
        <p>您正在前往：<p>
        <div class="url">${targetUrl}</div>
        <div class="countdown-container">
            <svg class="countdown-svg" viewBox="0 0 40 40">
                <circle class="countdown-circle-bg" r="18" cx="20" cy="20"></circle>
                <circle class="countdown-circle" r="18" cx="20" cy="20" stroke-dasharray="113.097" stroke-dashoffset="0"></circle>
            </svg>
            <div class="countdown-text" id="countdown-text">5</div>
        </div>
        <button class="button" id="jumpNow">立即跳转</button>
        <p style="margin-top: 20px; font-size: 14px; color: #ccc;">
            如果长时间没有跳转，请点击上方"立即跳转"按钮
        </p>
    `;

    document.body.appendChild(container);

    // 圆形进度条和倒计时功能
    const circle = document.querySelector('.countdown-circle');
    const countdownText = document.getElementById('countdown-text');
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    let countdown = 5;

    // 初始化圆形进度条
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    // 更新进度条函数
    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    const timer = setInterval(() => {
        countdown--;

        if (countdown > 0) {
            // 更新倒计时文本
            countdownText.textContent = countdown;

            // 更新进度条 (从100%到0%)
            const progress = (5 - countdown) * 20; // 5秒，每秒钟20%
            setProgress(progress);
        } else {
            clearInterval(timer);
            window.location.href = targetUrl;
        }
    }, 1000);

    // 立即跳转按钮
    document.getElementById('jumpNow').addEventListener('click', () => {
        clearInterval(timer);
        window.location.href = targetUrl;
    });
})();