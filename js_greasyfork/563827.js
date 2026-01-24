// ==UserScript==
// @name         Youtube Translator Dubber for Chinese only v1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用Gemini配合本地TTS，实现YouTube实时翻译。目前缺点，实时字幕效果很差。
// @author       Dee
// @match        https://www.youtube.com/watch?v=*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @connect      generativelanguage.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/563827/Youtube%20Translator%20Dubber%20for%20Chinese%20only%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/563827/Youtube%20Translator%20Dubber%20for%20Chinese%20only%20v10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
    const MODEL_NAME = "gemini-2.0-flash";
    let lastProcessedText = "";
    let isRequesting = false;
    
    // 计费标准
    const PRICE_INPUT_PER_M = 0.10;
    const PRICE_OUTPUT_PER_M = 0.40;
    let sessionCost = 0;

    // 1. 创建 UI 翻译框 (增加可拖拽属性)
    const zhBox = document.createElement('div');
    zhBox.id = 'gemini-zh-draggable-ui';
    
    // 读取记忆的位置，默认为 bottom: 22%
    const savedPos = GM_getValue("ui_position", { left: "50%", top: "" });
    
    Object.assign(zhBox.style, {
        position: 'fixed', 
        left: savedPos.left, 
        top: savedPos.top || "70%",
        transform: savedPos.top ? 'none' : 'translateX(-50%)',
        zIndex: '2147483647', color: '#ffea00', fontSize: '28px', fontWeight: 'bold',
        textShadow: '3px 3px 5px black', textAlign: 'center', background: 'rgba(0,0,0,0.6)',
        padding: '12px 25px', borderRadius: '10px', width: 'auto', maxWidth: '85%', 
        display: 'none', lineHeight: '1.2', cursor: 'move', userSelect: 'none'
    });
    document.body.appendChild(zhBox);

    // 【核心新增：拖拽逻辑】
    let isDragging = false;
    let offsetX, offsetY;

    zhBox.onmousedown = (e) => {
        isDragging = true;
        offsetX = e.clientX - zhBox.getBoundingClientRect().left;
        offsetY = e.clientY - zhBox.getBoundingClientRect().top;
        zhBox.style.transform = 'none'; // 拖拽开始后取消居中偏移
    };

    document.onmousemove = (e) => {
        if (!isDragging) return;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        zhBox.style.left = x + 'px';
        zhBox.style.top = y + 'px';
    };

    document.onmouseup = () => {
        if (isDragging) {
            isDragging = false;
            // 保存位置
            GM_setValue("ui_position", { left: zhBox.style.left, top: zhBox.style.top });
        }
    };

    // 2. 计费看板 (同样使用符合 Trusted Types 的方法)
    const costDisplay = document.createElement('div');
    Object.assign(costDisplay.style, {
        position: 'fixed', top: '70px', right: '15px', zIndex: '2147483647',
        padding: '10px', background: 'rgba(0,0,0,0.8)', color: '#00ff00',
        fontSize: '12px', fontFamily: 'monospace', borderRadius: '5px', border: '1px solid #444',
        textAlign: 'right', pointerEvents: 'auto'
    });
    const sessionLabel = document.createElement('div');
    const totalLabel = document.createElement('div');
    const resetBtn = document.createElement('button');
    resetBtn.textContent = "Reset Total";
    Object.assign(resetBtn.style, { fontSize: '10px', marginTop: '5px', cursor: 'pointer' });
    resetBtn.onclick = () => { GM_setValue("total_cost_v2", 0); updateCostUI(); };
    costDisplay.append(sessionLabel, totalLabel, resetBtn);
    document.body.appendChild(costDisplay);

    function updateCostUI() {
        const total = GM_getValue("total_cost_v2", 0);
        sessionLabel.textContent = `Session: $${sessionCost.toFixed(5)}`;
        totalLabel.textContent = `Total Acc: $${total.toFixed(5)}`;
    }
    updateCostUI();

    // 3. 启动逻辑
    const btn = document.createElement('button');
    btn.textContent = "🚀 启动 v24.0 (可拖拽版)";
    Object.assign(btn.style, {
        position: 'fixed', top: '15px', right: '15px', zIndex: '2147483647',
        padding: '12px 24px', background: '#0275d8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
    });
    document.body.appendChild(btn);

    const initVideoSync = (video) => {
        video.onpause = () => window.speechSynthesis.cancel();
        video.onseeking = () => { window.speechSynthesis.cancel(); lastProcessedText = ""; };
    };

    btn.onclick = () => {
        window.speechSynthesis.cancel();
        btn.remove();
        const video = document.querySelector("video");
        if (video) { video.muted = false; video.volume = 0.001; initVideoSync(video); }
    };

    function speakCN(text) {
        window.speechSynthesis.cancel(); 
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'zh-CN';
        let speed = 1.35;
        if (text.length > 15) speed = 1.7;
        if (text.length > 30) speed = 2.1;
        msg.rate = speed;
        window.speechSynthesis.speak(msg);
    }

    function requestTranslation(text) {
        if (isRequesting) return;
        isRequesting = true;
        GM_xmlhttpRequest({
            method: "POST",
            url: `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ 
                contents: [{ parts: [{ text: "Extremely concise oral Chinese. Keep terms like LLM8850, Pi5. NO pinyin: " + text }] }] 
            }),
            onload: (res) => {
                isRequesting = false;
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.usageMetadata) {
                        const inT = data.usageMetadata.promptTokenCount;
                        const outT = data.usageMetadata.candidatesTokenCount;
                        const cost = (inT / 1000000 * PRICE_INPUT_PER_M) + (outT / 1000000 * PRICE_OUTPUT_PER_M);
                        sessionCost += cost;
                        GM_setValue("total_cost_v2", GM_getValue("total_cost_v2", 0) + cost);
                        updateCostUI();
                    }
                    const result = data.candidates[0].content.parts[0].text.trim().replace(/\(([^)]+)\)/g, '');
                    if (result) {
                        zhBox.textContent = result;
                        zhBox.style.display = "block";
                        speakCN(result);
                    }
                } catch (e) { }
            }
        });
    }

    setInterval(() => {
        const video = document.querySelector("video");
        if (!video || video.paused) return;
        if (video.volume > 0.01) video.volume = 0.001;
        const segments = document.querySelectorAll(".ytp-caption-segment");
        if (segments.length > 0) {
            let textSet = new Set();
            segments.forEach(s => { let txt = s.innerText.trim(); if (txt) textSet.add(txt); });
            const combinedText = Array.from(textSet).join(" ").replace(/\s+/g, ' ').trim();
            if (combinedText !== lastProcessedText && combinedText.length > 1) {
                lastProcessedText = combinedText;
                if (/[\u4e00-\u9fa5]/.test(combinedText)) {
                    zhBox.textContent = combinedText;
                    zhBox.style.display = "block";
                    speakCN(combinedText);
                } else {
                    requestTranslation(combinedText);
                }
            }
        }
    }, 450);

})();