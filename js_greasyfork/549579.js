// ==UserScript==
// @name         番茄小说 快捷键下一章 伪装页面404
// @namespace    http://tampermonkey.net/
// @version      2025-09-15
// @description  D+空格显示顶层 Edge 风格 404 页面，A+空格隐藏，C+空格跳下一章
// @author       ikun2.5
// @match        https://fanqienovel.com/reader/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549579/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%B8%8B%E4%B8%80%E7%AB%A0%20%E4%BC%AA%E8%A3%85%E9%A1%B5%E9%9D%A2404.user.js
// @updateURL https://update.greasyfork.org/scripts/549579/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%B8%8B%E4%B8%80%E7%AB%A0%20%E4%BC%AA%E8%A3%85%E9%A1%B5%E9%9D%A2404.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let cPressed = false;
    let dPressed = false;
    let aPressed = false;
    let overlayExists = false;

    // ------------------ 下一章功能 ------------------
    const nextChapter = () => {
        const btn = document.querySelector('button.byte-btn.byte-btn-primary.byte-btn-size-large.byte-btn-shape-square.muye-button');
        if (btn) btn.click();
    };

    // ------------------ 键盘监听 ------------------
    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyC') cPressed = true;
        if (e.code === 'KeyD') dPressed = true;
        if (e.code === 'KeyA') aPressed = true;

        // D + 空格 → 显示 404 顶层
        if ((e.code === 'Space' || e.key === ' ') && dPressed) {
            e.preventDefault();
            show404Overlay();
        }

        // A + 空格 → 隐藏 404 顶层
        if ((e.code === 'Space' || e.key === ' ') && aPressed) {
            e.preventDefault();
            hide404Overlay();
        }

        // C + 空格 → 下一章
        if ((e.code === 'Space' || e.key === ' ') && cPressed) {
            e.preventDefault();
            nextChapter();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'KeyC') cPressed = false;
        if (e.code === 'KeyD') dPressed = false;
        if (e.code === 'KeyA') aPressed = false;
    });

    // ------------------ 404 覆盖层 ------------------
    const REDIRECT_URL = ' ';
    const COPYRIGHT_INFO = 'COPYRIGHT © 2025 鸡哥真爱粉. ALL RIGHTS RESERVED.';

    function show404Overlay() {
        if (overlayExists) return;

        const overlay = document.createElement('div');
        overlay.id = 'custom404Overlay';
        overlay.style.cssText = `
            position: fixed;
            top:0; left:0; width:100%; height:100%;
            z-index: 99999;
            background: linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%);
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        `;

        // 内部 HTML
        overlay.innerHTML = `
            <div class="stars" id="overlayStars"></div>
            <div class="container" style="text-align:center; color:white; position:relative; max-width:700px; padding:20px;">
                <div class="error-code" style="font-size:12rem; font-weight:300; margin-bottom:20px; color:#34495e; cursor:pointer;">404</div>
                <h1 class="title" style="font-size:3rem; margin-bottom:15px; color:#2c3e50;">页面未找到</h1>
                <p class="description" style="font-size:1.5rem; margin-bottom:30px; color:#7f8c8d; line-height:1.6;">
                    抱歉，您访问的页面不存在或已被移动。<br>
                    按 A + 空格可关闭此页面。
                </p>
                <div class="countdown" id="overlayCountdown" style="font-size:1.2rem; margin-bottom:30px; padding:12px 20px; background:rgba(255,255,255,0.9); border-radius:8px; border:1px solid rgba(52,73,94,0.1); display:inline-block; color:#34495e; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    <span id="overlayTimer">10</span> 秒后自动返回主页
                </div>
                <div class="progress-bar" style="width:100%; height:3px; background:rgba(52,73,94,0.1); border-radius:2px; margin:20px 0; overflow:hidden;">
                    <div class="progress-fill" id="overlayProgressFill" style="height:100%; background:#3498db; border-radius:2px; width:100%; transition:width 1s linear;"></div>
                </div>
                <a href="${REDIRECT_URL}" class="home-button" id="overlayHomeButton" style="display:inline-block; padding:12px 30px; background:#3498db; color:white; text-decoration:none; border-radius:6px; font-size:1rem; font-weight:500; transition:all 0.3s ease; box-shadow:0 2px 10px rgba(52,152,219,0.3);">
                    返回首页
                </a>
            </div>
            <div class="copyright" style="position:absolute; bottom:20px; left:50%; transform:translateX(-50%); font-size:0.75rem; color:#5a6c7d; text-align:center; letter-spacing:0.3px; background:rgba(255,255,255,0.9); padding:8px 16px; border-radius:20px; box-shadow:0 2px 8px rgba(0,0,0,0.1); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.3);">
                ${COPYRIGHT_INFO}
            </div>
        `;

        document.body.appendChild(overlay);
        overlayExists = true;

        // 星星背景
        const starsContainer = document.getElementById('overlayStars');
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position:absolute;
                background:white;
                border-radius:50%;
                width:${Math.random()*3+1}px;
                height:${Math.random()*3+1}px;
                left:${Math.random()*100}%;
                top:${Math.random()*100}%;
                animation: twinkle ${2+Math.random()*2}s infinite;
            `;
            starsContainer.appendChild(star);
        }

        // 星星动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes twinkle {
                0%,100%{opacity:0.3; transform: scale(1);}
                50%{opacity:1; transform: scale(1.2);}
            }
        `;
        document.head.appendChild(style);

        // 倒计时
        let timeLeft = 10;
        const timerEl = document.getElementById('overlayTimer');
        const progressFill = document.getElementById('overlayProgressFill');
        const countdownEl = document.getElementById('overlayCountdown');

        function updateCountdown() {
            timerEl.textContent = timeLeft;
            progressFill.style.width = ((10-timeLeft)/10*100) + '%';
            if(timeLeft<=3){
                countdownEl.style.background='rgba(231,76,60,0.1)';
                countdownEl.style.color='#e74c3c';
                countdownEl.style.borderColor='rgba(231,76,60,0.2)';
            }else if(timeLeft<=5){
                countdownEl.style.background='rgba(243,156,18,0.1)';
                countdownEl.style.color='#f39c12';
                countdownEl.style.borderColor='rgba(243,156,18,0.2)';
            }
            if(timeLeft<=0){
                window.location.href = REDIRECT_URL;
                return;
            }
            timeLeft--;
            setTimeout(updateCountdown,1000);
        }
        //updateCountdown();
    }

    function hide404Overlay() {
        const overlay = document.getElementById('custom404Overlay');
        if(overlay){
            overlay.remove();
            overlayExists=false;
        }
    }

})();
