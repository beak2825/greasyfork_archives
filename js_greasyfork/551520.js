// ==UserScript==
// @name         网页划词朗读助手
// @namespace    https://dqtx.cc/
// @version      1.0
// @description  划词自动朗读，支持中文/英文，多语音切换，可暂停与继续播放
// @author       Derek
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551520/%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E6%9C%97%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/551520/%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E6%9C%97%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let utterance = null;
    let isSpeaking = false;

    // 创建悬浮控制条
    const controlBar = document.createElement('div');
    controlBar.innerHTML = `
        <button id="speakPauseBtn">⏸ 暂停</button>
        <button id="speakResumeBtn">▶️ 继续</button>
        <button id="speakStopBtn">⏹ 停止</button>
    `;
    Object.assign(controlBar.style, {
        position: 'fixed',
        bottom: '50px',
        right: '50px',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 99999,
        display: 'none',
        gap: '5px',
    });
    controlBar.querySelectorAll('button').forEach(btn => {
        Object.assign(btn.style, {
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            margin: '0 3px',
            borderRadius: '4px',
            padding: '4px 8px',
        });
        btn.onmouseenter = () => btn.style.background = 'rgba(255,255,255,0.25)';
        btn.onmouseleave = () => btn.style.background = 'rgba(255,255,255,0.1)';
    });
    document.body.appendChild(controlBar);

    // 绑定事件
    const pauseBtn = controlBar.querySelector('#speakPauseBtn');
    const resumeBtn = controlBar.querySelector('#speakResumeBtn');
    const stopBtn = controlBar.querySelector('#speakStopBtn');

    pauseBtn.onclick = () => {
        window.speechSynthesis.pause();
    };
    resumeBtn.onclick = () => {
        window.speechSynthesis.resume();
    };
    stopBtn.onclick = () => {
        window.speechSynthesis.cancel();
        controlBar.style.display = 'none';
    };

    // 监听划词事件
    document.addEventListener('mouseup', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            speakText(selectedText);
        }
    });

    // 自动检测语言（中英）
    function detectLang(text) {
        const zh = /[\u4e00-\u9fa5]/.test(text);
        return zh ? 'zh-CN' : 'en-US';
    }

    // 执行朗读
    function speakText(text) {
        // 停止当前朗读
        window.speechSynthesis.cancel();

        const lang = detectLang(text);
        utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        const voices = speechSynthesis.getVoices();
        // 自动选择匹配语音
        const matched = voices.find(v => v.lang === lang);
        if (matched) utterance.voice = matched;

        utterance.onstart = () => {
            controlBar.style.display = 'flex';
            isSpeaking = true;
        };
        utterance.onend = () => {
            controlBar.style.display = 'none';
            isSpeaking = false;
        };

        window.speechSynthesis.speak(utterance);
    }

    // 初始化语音列表（部分浏览器需要延迟）
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
            console.log('[划词朗读助手] 已加载语音包');
        };
    }
})();
