// ==UserScript==
// @name         TwkanReader
// @namespace    twkan.reader.tts
// @version      4.3
// @description  使用私有edge-tts朗读 + 高亮 + 自动下一章 + 速度控制 + 快进15秒 + 预加载音频
// @match        https://twkan.com/txt/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563550/TwkanReader.user.js
// @updateURL https://update.greasyfork.org/scripts/563550/TwkanReader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let speaking = false;
    let paragraphs = [];
    let nextUrl = null;
    let speed = parseFloat(localStorage.getItem("twkanSpeed")) || 1.0;
    let currentParagraphIndex = 0;
    const avgCharPerSec = 3.5; // 中文平均每秒朗读字符数，可调
    const ttsHost = 'https://47.103.78.150'; // 你的 HTTPS TTS 反代地址

    let audio = null;          // 当前播放 Audio
    const audioCache = {};     // 预加载缓存

    // 注入样式
    const style = document.createElement("style");
    style.textContent = `
        #txtcontent0 br { display:block; margin:12px 0; }
        .tts-highlight { background:#fde68a; border-radius:4px; }
        #ttsControls button {
            background:#7c3aed;
            color:white;
            border:none;
            padding:6px 10px;
            border-radius:12px;
            font-size:12px;
            cursor:pointer;
            margin-right:4px;
        }
        #ttsControls span { margin:0 4px; font-weight:bold; }
    `;
    document.head.appendChild(style);

    // 创建控制面板
    function createControls() {
        if (document.getElementById("ttsControls")) return;

        const container = document.createElement("div");
        container.id = "ttsControls";
        container.style.cssText = `position: fixed; top: 16px; left: 16px; z-index: 9999999;`;

        const btnPlay = document.createElement("button");
        btnPlay.textContent = "🔊朗读";
        container.appendChild(btnPlay);

        const btnSpeedDown = document.createElement("button");
        btnSpeedDown.textContent = "-";
        container.appendChild(btnSpeedDown);

        const speedLabel = document.createElement("span");
        speedLabel.textContent = speed.toFixed(1) + "x";
        container.appendChild(speedLabel);

        const btnSpeedUp = document.createElement("button");
        btnSpeedUp.textContent = "+";
        container.appendChild(btnSpeedUp);

        const btnForward = document.createElement("button");
        btnForward.textContent = "⏩15s";
        container.appendChild(btnForward);

        document.body.appendChild(container);

        // 播放/暂停
        btnPlay.addEventListener("click", () => {
            speaking = !speaking;
            btnPlay.textContent = speaking ? "⏸停止" : "🔊朗读";
            if (speaking) speakNext();
        });

        // 调整速度
        btnSpeedUp.addEventListener("click", () => {
            if (speed < 4.0) speed = +(speed + 0.2).toFixed(1);
            speedLabel.textContent = speed.toFixed(1) + "x";
            localStorage.setItem("twkanSpeed", speed);
            if (audio) audio.playbackRate = speed;
        });

        btnSpeedDown.addEventListener("click", () => {
            if (speed > 0.5) speed = +(speed - 0.1).toFixed(1);
            speedLabel.textContent = speed.toFixed(1) + "x";
            localStorage.setItem("twkanSpeed", speed);
            if (audio) audio.playbackRate = speed;
        });

        // 快进15秒
        btnForward.addEventListener("click", () => {
            if (!speaking) return;
            // 停止当前播放
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            let timeAccum = 0;
            while (currentParagraphIndex < paragraphs.length && timeAccum < 15) {
                const chars = paragraphs[currentParagraphIndex].length;
                const estTime = chars / avgCharPerSec / speed;
                timeAccum += estTime;
                currentParagraphIndex++;
            }
            if (currentParagraphIndex >= paragraphs.length) currentParagraphIndex = paragraphs.length - 1;
            speakNext();
        });
    }

    function sanitizeText(text) {
        return text.replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F]+/g, '');
    }

    // 等待正文加载
    function waitForContent(callback) {
        const contentBox = document.querySelector("#txtcontent0");
        if (contentBox && contentBox.innerText.trim().length > 0) {
            callback(contentBox);
            return;
        }
        const observer = new MutationObserver((mutations, obs) => {
            const box = document.querySelector("#txtcontent0");
            if (box && box.innerText.trim().length > 0) {
                obs.disconnect();
                callback(box);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 初始化
    function initReader(contentBox) {
        paragraphs = contentBox.innerText.split(/\n+/).filter(line => line.trim());

        // 下一章链接
        const links = document.querySelectorAll("a");
        for (let a of links) {
            if (a.textContent.includes("下一")) nextUrl = a.href;
        }

        createControls();

        if (localStorage.getItem("twkanAutoPlay") === "true") {
            speaking = true;
            const btn = document.querySelector("#ttsControls button");
            if (btn) btn.textContent = "⏸停止";
            speakNext();
        }
    }

    // 播放下一段
    async function speakNext() {
        const contentBox = document.querySelector("#txtcontent0");
        if (!contentBox || !speaking) return;

        if (currentParagraphIndex >= paragraphs.length) {
            if (nextUrl) {
                window.location.href = nextUrl;
            } else {
                speaking = false;
            }
            return;
        }

        // 高亮当前段落
        const html = paragraphs.map((p, idx) =>
            idx === currentParagraphIndex ? `<span class="tts-highlight">${p}</span>` : p
        ).join("<br>");
        contentBox.innerHTML = html;

        const el = contentBox.querySelector(".tts-highlight");
        if (el) el.scrollIntoView({behavior:"smooth", block:"center"});

        // 播放当前段落
        await playTTS(paragraphs[currentParagraphIndex], () => {
            currentParagraphIndex++;
            speakNext();
        });

        // 预加载下一段
        preloadNext();
    }

    async function playTTS(text, callback) {
        const cleanText = sanitizeText(text);

        // 停止上一个音频
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        // 预加载音频
        if (!audioCache[cleanText]) {
            try {
                const res = await fetch(`${ttsHost}/tts?text=${encodeURIComponent(cleanText)}`);
                const blob = await res.blob();
                audioCache[cleanText] = URL.createObjectURL(blob);
            } catch (err) {
                console.error('TTS 请求失败', err);
                callback();
                return;
            }
        }

        audio = new Audio(audioCache[cleanText]);
        audio.playbackRate = speed;
        audio.onended = callback;
        audio.onerror = (e) => {
            console.error('TTS 播放失败:', e);
            callback();
        };
        audio.play();
    }

    function preloadNext() {
        if (currentParagraphIndex + 1 < paragraphs.length) {
            const nextText = sanitizeText(paragraphs[currentParagraphIndex + 1]);
            if (!audioCache[nextText]) {
                fetch(`${ttsHost}/tts?text=${encodeURIComponent(nextText)}`)
                    .then(r => r.blob())
                    .then(b => { audioCache[nextText] = URL.createObjectURL(b); })
                    .catch(err => console.warn('预加载失败', err));
            }
        }
    }

    waitForContent(initReader);

})();
