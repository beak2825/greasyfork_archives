// ==UserScript==
// @name         Stripchat直播录屏
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  可选择10分钟自动分段或长录制模式，带日志监控，支持触屏。
// @author       Gemini
// @license      MIT
// @match        *://*.stripchat.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562358/Stripchat%E7%9B%B4%E6%92%AD%E5%BD%95%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/562358/Stripchat%E7%9B%B4%E6%92%AD%E5%BD%95%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mediaRecorder, recordedChunks = [], startTime, timerInterval, autoSaveInterval, isManuallyStopping = false;
    const SAVE_INTERVAL = 10 * 60 * 1000; // 10分钟

    // --- UI 界面 ---
    const container = document.createElement('div');
    container.style = `
        position: fixed; top: 150px; left: 20px; z-index: 10001;
        background: rgba(10, 10, 10, 0.9); backdrop-filter: blur(15px);
        color: #fff; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15);
        width: 220px; box-shadow: 0 10px 40px rgba(0,0,0,0.7);
        font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
        touch-action: none; overflow: hidden;
    `;

    container.innerHTML = `
        <div id="recorder-header" style="padding: 10px; background: rgba(255,255,255,0.05); cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span style="font-size: 11px; font-weight: bold; color: #ff4d4d;">● 录制控制台</span>
            <span id="main-fold-btn" style="cursor: pointer; font-size: 18px; padding: 0 8px;">−</span>
        </div>
        <div id="main-content" style="padding: 12px;">
            <div id="timerDisplay" style="font-size: 24px; font-weight: bold; color: #fff; text-align: center; margin-bottom: 10px; font-family: monospace;">00:00:00</div>

            <button id="startBtn" style="width: 100%; background: #28a745; color: white; border: none; padding: 10px; cursor: pointer; border-radius: 6px; margin-bottom: 10px; font-weight: bold; font-size: 13px;">开始录制</button>
            <button id="stopBtn" style="width: 100%; background: #dc3545; color: white; border: none; padding: 10px; cursor: pointer; border-radius: 6px; opacity: 0.4; font-weight: bold; font-size: 13px;" disabled>停止并保存</button>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 5px 0;">
                <span style="font-size: 12px; color: #ccc;">10分钟自动分段</span>
                <label style="position: relative; display: inline-block; width: 34px; height: 20px;">
                    <input type="checkbox" id="auto-split-toggle" checked style="opacity: 0; width: 0; height: 0;">
                    <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: .4s; border-radius: 20px;" id="slider"></span>
                </label>
            </div>

            <div style="margin-top: 5px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #888;">
                    <span id="toggle-log-btn" style="cursor:pointer; color: #007bff;">展开日志 ▼</span>
                    <span id="clear-log" style="cursor:pointer;">清除</span>
                </div>
                <div id="logPanel" style="display: none; height: 90px; background: #000; border-radius: 4px; padding: 5px; font-size: 9px; font-family: monospace; overflow-y: auto; color: #0f0; margin-top: 8px; border: 1px solid #333;">
                    [System] 助手就绪...
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // CSS 动态注入（开关样式）
    const style = document.createElement('style');
    style.innerHTML = `
        #auto-split-toggle:checked + #slider { background-color: #28a745; }
        #auto-split-toggle:checked + #slider:before { transform: translateX(14px); }
        #slider:before {
            position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
            background-color: white; transition: .4s; border-radius: 50%;
        }
    `;
    document.head.appendChild(style);

    const logPanel = container.querySelector('#logPanel');
    const toggleLogBtn = container.querySelector('#toggle-log-btn');
    const mainFoldBtn = container.querySelector('#main-fold-btn');
    const mainContent = container.querySelector('#main-content');
    const startBtn = container.querySelector('#startBtn');
    const stopBtn = container.querySelector('#stopBtn');
    const timerDisplay = container.querySelector('#timerDisplay');
    const splitToggle = container.querySelector('#auto-split-toggle');

    // --- 日志助手 ---
    function addLog(msg, color = "#0f0") {
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
        const entry = document.createElement('div');
        entry.style.color = color;
        entry.innerHTML = `<span style="color:#555;">[${time}]</span> ${msg}`;
        logPanel.appendChild(entry);
        logPanel.scrollTop = logPanel.scrollHeight;
    }

    // --- 拖拽逻辑 ---
    let isDragging = false, startX, startY, initialLeft, initialTop;
    container.querySelector('#recorder-header').addEventListener('mousedown', onDragStart);
    container.querySelector('#recorder-header').addEventListener('touchstart', onDragStart, {passive:true});

    function onDragStart(e) {
        if (e.target.id === 'main-fold-btn') return;
        isDragging = true;
        const c = e.type.includes('touch') ? e.touches[0] : e;
        startX = c.clientX; startY = c.clientY;
        initialLeft = container.offsetLeft; initialTop = container.offsetTop;
    }
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove, {passive:false});
    function onDragMove(e) {
        if (!isDragging) return;
        const c = e.type.includes('touch') ? e.touches[0] : e;
        const dx = c.clientX - startX; const dy = c.clientY - startY;
        if (Math.abs(dx)>3 || Math.abs(dy)>3) {
            container.style.left = (initialLeft + dx) + 'px';
            container.style.top = (initialTop + dy) + 'px';
            if (e.cancelable) e.preventDefault();
        }
    }
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('touchend', () => isDragging = false);

    // --- UI 逻辑 ---
    toggleLogBtn.onclick = () => {
        const isEx = logPanel.style.display === 'block';
        logPanel.style.display = isEx ? 'none' : 'block';
        toggleLogBtn.innerText = isEx ? '展开日志 ▼' : '收起日志 ▲';
    };

    mainFoldBtn.onclick = () => {
        const isFolded = mainContent.style.display === 'none';
        mainContent.style.display = isFolded ? 'block' : 'none';
        mainFoldBtn.innerText = isFolded ? '−' : '+';
        container.style.width = isFolded ? '220px' : '120px';
    };

    splitToggle.onchange = () => {
        addLog(splitToggle.checked ? "模式: 10分钟自动分段" : "模式: 长录制 (直到手动停止)", "#ffc107");
    };
// --- MediaRecorder 格式选择（新增） ---
function getBestMimeType() {
    const candidates = [
        'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
        'video/mp4',
        'video/webm; codecs=vp9,opus',
        'video/webm'
    ];
    for (const type of candidates) {
        if (window.MediaRecorder && MediaRecorder.isTypeSupported(type)) {
            return type;
        }
    }
    return '';
}

    // --- 录制核心 ---
    async function startRecording(isAutoRestart = false) {
        const video = document.querySelector('video');
        if (!video) { addLog("未找到视频", "#f00"); return; }
        try {
            const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
            recordedChunks = [];
            const mimeType = getBestMimeType();
addLog(`录制格式: ${mimeType || '浏览器默认'}`, "#6cf");

mediaRecorder = mimeType
    ? new MediaRecorder(stream, { mimeType })
    : new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
            mediaRecorder.onstop = () => {
                saveBlob();
                // 如果开启了分段 且 没关视频 且 不是人为点停止，则重启
                if (splitToggle.checked && !isManuallyStopping && !video.ended) {
                    addLog("分段完成，自动开始下一段...");
                    startRecording(true);
                }
            };
            mediaRecorder.start(1000);
            if(!isAutoRestart) {
                startTime = Date.now();
                if(timerInterval) clearInterval(timerInterval);
                timerInterval = setInterval(updateTimer, 1000);
                addLog("录制启动");
            }
            isManuallyStopping = false;
            startBtn.disabled = true; startBtn.style.opacity = 0.4;
            stopBtn.disabled = false; stopBtn.style.opacity = 1;

            // 分段逻辑控制
            clearTimeout(autoSaveInterval);
            if (splitToggle.checked) {
                autoSaveInterval = setTimeout(() => {
                    if (mediaRecorder.state === "recording") {
                        addLog("触发自动分段保存...");
                        mediaRecorder.stop();
                    }
                }, SAVE_INTERVAL);
            }

            video.onended = () => { if (!isManuallyStopping) { addLog("下播自动保存", "#f00"); stopRecordingAction(); } };
        } catch (err) { addLog("错误: " + err.message, "#f00"); }
    }

    function stopRecordingAction() {
        isManuallyStopping = true;
        clearTimeout(autoSaveInterval);
        if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
        clearInterval(timerInterval);
        startBtn.disabled = false; startBtn.style.opacity = 1;
        stopBtn.disabled = true; stopBtn.style.opacity = 0.4;
        addLog("已停止保存", "#bbb");
    }

    function saveBlob() {
    if (recordedChunks.length === 0) return;

    const type = mediaRecorder.mimeType || 'video/webm';
    const ext = type.includes('mp4') ? 'mp4' : 'webm';

    const blob = new Blob(recordedChunks, { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    const modelName = window.location.pathname.split('/').filter(Boolean).pop() || 'live';
    const d = new Date();
    const ts = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}_${d.getHours().toString().padStart(2,'0')}-${d.getMinutes().toString().padStart(2,'0')}-${d.getSeconds().toString().padStart(2,'0')}`;

    a.href = url;
    a.download = `SC_${modelName}_${ts}.${ext}`;
    a.click();

    addLog(`保存文件: ${ts}.${ext}`, "#0ff");
    URL.revokeObjectURL(url);
}


    function updateTimer() {
        const diff = Date.now() - startTime;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        timerDisplay.innerText = `${h}:${m}:${s}`;
    }

    startBtn.onclick = () => startRecording(false);
    stopBtn.onclick = stopRecordingAction;
    container.querySelector('#clear-log').onclick = () => logPanel.innerHTML = "";
    window.onbeforeunload = () => { if (mediaRecorder?.state === "recording") { isManuallyStopping = true; mediaRecorder.stop(); } };

})();