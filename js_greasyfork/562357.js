// ==UserScript==
// @name         Chaturbate直播录屏
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  修复恢复录制轨道报错 + 页面刷新/关闭时自动保存录制片段，避免内容丢失 + 修复触屏拖拽无效问题
// @author       You
// @license      MIT
// @match        *://*.chaturbate.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562357/Chaturbate%E7%9B%B4%E6%92%AD%E5%BD%95%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/562357/Chaturbate%E7%9B%B4%E6%92%AD%E5%BD%95%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 新增：是否处于直播间 =================
    function isLiveRoomPage() {
        const videos = document.querySelectorAll('video');
        for (const v of videos) {
            if (v && v.src && !v.paused && v.readyState >= 2) {
                return true;
            }
        }
        return false;
    }
function isTouchOnButton(touch, btn) {
    const rect = btn.getBoundingClientRect();
    return (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
    );
}

    // -------------------------- 核心配置项 --------------------------
    const CONFIG = {
        RECORD_SEGMENT_MINUTES: 10,  // 分段录制时长（分钟）
        VIDEO_BITRATE: 6000000,      // 视频码率（6Mbps）
        DEFAULT_POSITION: {
            bottom: "20px",
            right: "20px",
            zIndex: 99999
        },
        THEME: {
            LIGHT: {
                normal: { bg: "rgba(136, 4, 113, 0.85)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.5)" },
                active: { bg: "rgba(255, 68, 68, 0.85)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.5)" }
            },
            DARK: {
                normal: { bg: "rgba(100, 3, 82, 0.9)", color: "#f0f0f0", border: "1px solid rgba(255,255,255,0.3)" },
                active: { bg: "rgba(220, 40, 40, 0.9)", color: "#f0f0f0", border: "1px solid rgba(255,255,255,0.3)" }
            }
        },
        STORAGE_KEYS: {
            RECORD_STATE: 'cb_recording_state',
            RECORD_LOGS: 'cb_recording_logs'
        },
        MAX_LOGS: 20
    };

    // -------------------------- 全局状态 --------------------------
    window.isRecording = false;
    let mediaRecorder = null;
    let recordedChunks = [];
    let recordingStream = null;
    let originalMutedState = false;
    let isManualStop = false;
    let currentTheme = "LIGHT";
    let dragTarget = null;
    let dragOffset = { x: 0, y: 0 };
    let hasDragged = false;
    let recordingStartTime = 0;
    let recordingTimer = null;
    let autoSaveTimer = null;
    let isUnloading = false; // 新增：标记页面是否正在卸载（刷新/关闭）

    // -------------------------- 轨道有效性检测 + 重新捕获流 --------------------------
    function isStreamValid(stream) {
        if (!stream) return false;
        const videoTracks = stream.getVideoTracks().filter(track => track.readyState === 'live');
        const audioTracks = stream.getAudioTracks().filter(track => track.readyState === 'live');
        return videoTracks.length > 0 || audioTracks.length > 0;
    }

    function reCaptureStream() {
        const videoElements = document.querySelectorAll('video');
        let targetVideo = null;
        for (let v of videoElements) {
            if (!v.paused && v.src && v.offsetWidth > 200) {
                targetVideo = v;
                break;
            }
        }
        targetVideo = targetVideo || videoElements[0];

        if (!targetVideo) {
            console.error("❌ 未找到有效视频元素");
            return null;
        }

        try {
            if (recordingStream) {
                recordingStream.getTracks().forEach(track => track.stop());
                recordingStream = null;
            }

            let newStream;
            if (targetVideo.captureStream) {
                newStream = targetVideo.captureStream();
            } else if (targetVideo.mozCaptureStream) {
                newStream = targetVideo.mozCaptureStream();
            } else {
                throw new Error("浏览器不支持captureStream");
            }

            if (!isStreamValid(newStream)) {
                throw new Error("捕获的流无可用音视频轨道");
            }

            originalMutedState = targetVideo.muted;
            if (originalMutedState) {
                targetVideo.muted = false;
                targetVideo.volume = 0.000001;
            }

            console.log("✅ 重新捕获视频流成功");
            return newStream;
        } catch (e) {
            console.error("❌ 重新捕获流失败：", e);
            return null;
        }
    }

    // -------------------------- 本地存储工具函数 --------------------------
    function saveButtonPosition(position) {
        try {
            localStorage.setItem('cbRecordBtnPosition', JSON.stringify(position));
        } catch (e) {
            console.log("⚠️ 无法保存按钮位置：", e);
        }
    }

    function getSavedButtonPosition() {
        try {
            const saved = localStorage.getItem('cbRecordBtnPosition');
            return saved ? JSON.parse(saved) : CONFIG.DEFAULT_POSITION;
        } catch (e) {
            return CONFIG.DEFAULT_POSITION;
        }
    }

    function saveRecordingState(isRecording, startTime = 0, autoSaveEndTime = 0) {
        try {
            const state = {
                isRecording,
                startTime,
                autoSaveEndTime,
                timestamp: Date.now()
            };
            localStorage.setItem(CONFIG.STORAGE_KEYS.RECORD_STATE, JSON.stringify(state));
        } catch (e) {
            console.error("⚠️ 保存录制状态失败：", e);
        }
    }

    function getRecordingState() {
        try {
            const stateStr = localStorage.getItem(CONFIG.STORAGE_KEYS.RECORD_STATE);
            return stateStr ? JSON.parse(stateStr) : { isRecording: false };
        } catch (e) {
            console.error("⚠️ 读取录制状态失败：", e);
            return { isRecording: false };
        }
    }

    function clearRecordingState() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.RECORD_STATE);
        } catch (e) {
            console.error("⚠️ 清除录制状态失败：", e);
        }
    }

    // -------------------------- 录制日志核心函数 --------------------------
    function addRecordingLog(type, data = {}) {
        try {
            let logs = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.RECORD_LOGS) || '[]');
            const newLog = {
                id: Date.now(),
                type,
                timestamp: Date.now(),
                timeStr: new Date().toLocaleString(),
                username: getBroadcasterUsername(),
                ...data
            };
            logs.unshift(newLog);
            if (logs.length > CONFIG.MAX_LOGS) {
                logs = logs.slice(0, CONFIG.MAX_LOGS);
            }
            localStorage.setItem(CONFIG.STORAGE_KEYS.RECORD_LOGS, JSON.stringify(logs));
            updateLogPanel();
        } catch (e) {
            console.error("⚠️ 添加录制日志失败：", e);
        }
    }

    function getRecordingLogs() {
        try {
            return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.RECORD_LOGS) || '[]');
        } catch (e) {
            console.error("⚠️ 读取录制日志失败：", e);
            return [];
        }
    }

    function createLogPanel() {
        if (document.getElementById('cb-recording-log-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'cb-recording-log-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 300px;
            max-height: 400px;
            background: rgba(0,0,0,0.8);
            color: #fff;
            border-radius: 8px;
            padding: 10px;
            font-size: 12px;
            z-index: 99998;
            overflow-y: auto;
            display: none;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.2);
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            padding: 5px 0;
            border-bottom: 1px solid rgba(255,255,255,0.3);
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        title.innerHTML = `
            <span>录制日志</span>
            <button id="cb-clear-logs" style="background: #ff4444; color: #fff; border: none; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 10px;">清空</button>
        `;
        panel.appendChild(title);

        const logContent = document.createElement('div');
        logContent.id = 'cb-log-content';
        logContent.style.cssText = `
            line-height: 1.4;
        `;
        panel.appendChild(logContent);

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'cb-toggle-log-btn';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(136, 4, 113, 0.85);
            color: #fff;
            border: none;
            cursor: pointer;
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
        `;
        toggleBtn.textContent = '📝';
        toggleBtn.title = '查看录制日志';

        toggleBtn.addEventListener('click', () => {
            const isHidden = panel.style.display === 'none';
            panel.style.display = isHidden ? 'block' : 'none';
        });

        title.querySelector('#cb-clear-logs').addEventListener('click', () => {
            if (confirm('确定清空所有录制日志？')) {
                localStorage.removeItem(CONFIG.STORAGE_KEYS.RECORD_LOGS);
                updateLogPanel();
                addRecordingLog('clear', { message: '用户手动清空日志' });
            }
        });

        document.body.appendChild(toggleBtn);
        document.body.appendChild(panel);
        updateLogPanel();
    }

    function updateLogPanel() {
        const logContent = document.getElementById('cb-log-content');
        if (!logContent) return;

        const logs = getRecordingLogs();
        if (logs.length === 0) {
            logContent.innerHTML = '<div style="text-align: center; padding: 20px 0; color: #999;">暂无录制日志</div>';
            return;
        }

        logContent.innerHTML = logs.map(log => {
            const typeLabels = {
                start: '✅ 开始录制',
                stop: '🛑 停止录制',
                auto_save: '📥 自动保存',
                unload_save: '🔄 刷新保存', // 新增：刷新/关闭保存日志类型
                error: '❌ 录制错误',
                recover: '🔄 恢复录制',
                clear: '🗑️ 清空日志'
            };
            const typeLabel = typeLabels[log.type] || 'ℹ️ 其他';

            let detail = '';
            if (log.duration) detail += `时长：${log.duration} | `;
            if (log.fileSize) detail += `文件大小：${formatFileSize(log.fileSize)} | `;
            if (log.message) detail += `备注：${log.message}`;
            if (detail) detail = ` | ${detail.replace(/ \| $/, '')}`;

            return `
                <div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <span>${log.timeStr}</span> |
                    <span style="color: ${log.type === 'error' ? '#ff4444' : '#4cd964'}">${typeLabel}</span>
                    <span>${detail}</span>
                </div>
            `;
        }).join('');
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    // -------------------------- 核心优化：重构停止处理逻辑（支持刷新保存） --------------------------
    function handleRecorderStop() {
        stopRecordingTimer();
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = null;
        }

        const blobSize = recordedChunks.reduce((total, chunk) => total + chunk.size, 0);
        const duration = formatRecordingTime((Date.now() - recordingStartTime) / 1000);

        if (recordedChunks.length === 0) {
            console.log("⚠️ 无录制数据，跳过下载");
            if (!isManualStop && !isUnloading) { // 非手动停止 + 非页面卸载 → 继续录制
                continueRecording();
            } else {
                const logType = isUnloading ? 'unload_save' : 'stop';
                addRecordingLog(logType, { duration, message: '无录制数据，未下载文件' });
                clearRecordingState();
                window.isRecording = false;
                updateRecordButton(false);
            }
            return;
        }

        const mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'webm';
        const fileExt = mimeType.split('/')[1];
        // 新增：刷新保存时文件名增加标识
        const filenameSuffix = isUnloading ? '_刷新保存' : '';
        const fileName = generateFilename(getBroadcasterUsername(), fileExt, duration) + filenameSuffix;

        const blob = new Blob(recordedChunks, { type: mimeType });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => URL.revokeObjectURL(a.href), 10000);

        // 区分不同停止场景
        if (isManualStop) {
            addRecordingLog('stop', {
                duration,
                fileSize: blobSize,
                fileName,
                message: '用户手动停止'
            });
            clearRecordingState();
            window.isRecording = false;
            updateRecordButton(false);
            showNotification('🛑 录制已停止', `已保存最后片段：${fileName}`);
            if (recordingStream) {
                recordingStream.getTracks().forEach(track => track.stop());
                recordingStream = null;
            }
        } else if (isUnloading) { // 页面卸载（刷新/关闭）场景
            addRecordingLog('unload_save', { // 新增：刷新保存日志
                duration,
                fileSize: blobSize,
                fileName,
                message: '页面刷新/关闭，自动保存片段'
            });
            clearRecordingState(); // 刷新/关闭后清除状态，避免重复恢复
            window.isRecording = false;
            updateRecordButton(false);
            // 页面卸载时的提示（通过console+日志，避免弹窗阻塞）
            console.log(`✅ 页面刷新/关闭，已自动保存录制片段：${fileName}`);
            // 释放流
            if (recordingStream) {
                recordingStream.getTracks().forEach(track => track.stop());
                recordingStream = null;
            }
            isUnloading = false; // 重置标记
        } else { // 自动保存场景
            addRecordingLog('auto_save', {
                duration,
                fileSize: blobSize,
                fileName,
                message: '10分钟自动保存'
            });
            showNotification('📥 自动保存完成', `已保存片段：${fileName}，继续录制`);
            continueRecording();
        }

        recordedChunks = [];
    }

    // -------------------------- 新增核心：页面卸载时保存录制片段 --------------------------
    function saveOnUnload() {
        if (!window.isRecording || !mediaRecorder || isUnloading) return;

        isUnloading = true; // 标记为页面卸载状态
        console.log("⚠️ 检测到页面刷新/关闭，正在保存录制片段...");

        // 立即停止录制并保存
        try {
            mediaRecorder.stop();
            // 强制触发保存（防止MediaRecorder.stop异步延迟）
            setTimeout(() => {
                if (recordedChunks.length > 0) {
                    const mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'webm';
                    const fileExt = mimeType.split('/')[1];
                    const duration = formatRecordingTime((Date.now() - recordingStartTime) / 1000);
                    const fileName = generateFilename(getBroadcasterUsername(), fileExt, duration) + '_刷新保存';

                    const blob = new Blob(recordedChunks, { type: mimeType });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    setTimeout(() => URL.revokeObjectURL(a.href), 10000);

                    // 记录刷新保存日志
                    addRecordingLog('unload_save', {
                        duration,
                        fileSize: blob.size,
                        fileName,
                        message: '页面刷新/关闭自动保存'
                    });
                }
            }, 100);
        } catch (e) {
            console.error("❌ 刷新保存失败：", e);
            addRecordingLog('error', { message: `刷新保存失败：${e.message}` });
        }

        // 清理资源
        stopRecordingTimer();
        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        clearRecordingState(); // 刷新/关闭后清除状态

        // 释放流
        if (recordingStream) {
            recordingStream.getTracks().forEach(track => track.stop());
            recordingStream = null;
        }

        window.isRecording = false;
        updateRecordButton(false);
    }

    function continueRecording() {
        if (isManualStop || isUnloading) return; // 页面卸载时不继续录制

        if (!isStreamValid(recordingStream)) {
            console.log("⚠️ 当前流无效，重新捕获流");
            const newStream = reCaptureStream();
            if (!newStream) {
                alert('❌ 继续录制失败：无法捕获有效视频流，请手动重启录制');
                addRecordingLog('error', { message: '继续录制失败：流无可用轨道' });
                isManualStop = true;
                clearRecordingState();
                window.isRecording = false;
                updateRecordButton(false);
                return;
            }
            recordingStream = newStream;
        }

        try {
            let mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'webm';
            const options = {
                mimeType: mimeType,
                videoBitsPerSecond: CONFIG.VIDEO_BITRATE
            };
            mediaRecorder = new MediaRecorder(recordingStream, options);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) recordedChunks.push(e.data);
            };

            mediaRecorder.onstop = handleRecorderStop;

            mediaRecorder.start(250);
            recordingStartTime = Date.now();
            startRecordingTimer();

            autoSaveTimer = setTimeout(() => {
                if (window.isRecording && !isManualStop && !isUnloading) {
                    mediaRecorder.stop();
                }
            }, CONFIG.RECORD_SEGMENT_MINUTES * 60 * 1000);

            const autoSaveEndTime = recordingStartTime + CONFIG.RECORD_SEGMENT_MINUTES * 60 * 1000;
            saveRecordingState(true, recordingStartTime, autoSaveEndTime);

            console.log(`✅ 继续录制，下一次自动保存将在${CONFIG.RECORD_SEGMENT_MINUTES}分钟后`);
        } catch (e) {
            alert(`❌ 继续录制失败：${e.message}`);
            addRecordingLog('error', { message: `继续录制失败：${e.message}` });
            isManualStop = true;
            clearRecordingState();
            window.isRecording = false;
            updateRecordButton(false);
        }
    }

    function formatRecordingTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        const hStr = h.toString().padStart(2, '0');
        const mStr = m.toString().padStart(2, '0');
        const sStr = s.toString().padStart(2, '0');

        return h > 0 ? `${hStr}:${mStr}:${sStr}` : `${mStr}:${sStr}`;
    }

    function updateRecordingTimeDisplay() {
        const btn = document.getElementById('cb-record-btn');
        if (!btn || !window.isRecording) return;

        const now = Date.now();
        const elapsedSeconds = (now - recordingStartTime) / 1000;
        const formattedTime = formatRecordingTime(elapsedSeconds);

        const themeConfig = CONFIG.THEME[currentTheme];
        btn.textContent = `🛑 停止录制 ${formattedTime}`;
        btn.style.backgroundColor = themeConfig.active.bg;
        btn.style.color = themeConfig.active.color;
        btn.style.border = themeConfig.active.border;
    }

    function startRecordingTimer() {
        recordingStartTime = recordingStartTime || Date.now();
        updateRecordingTimeDisplay();
        recordingTimer = setInterval(updateRecordingTimeDisplay, 1000);
    }

    function stopRecordingTimer() {
        if (recordingTimer) {
            clearInterval(recordingTimer);
            recordingTimer = null;
        }
    }

    function detectPageTheme() {
        try {
            const rootElement = document.documentElement || document.body;
            const bgColor = getComputedStyle(rootElement).backgroundColor;

            const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                const r = parseInt(rgbMatch[1]);
                const g = parseInt(rgbMatch[2]);
                const b = parseInt(rgbMatch[3]);
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                currentTheme = brightness >= 128 ? "LIGHT" : "DARK";
            } else {
                currentTheme = rootElement.classList.contains('dark') ||
                               rootElement.classList.contains('night') ? "DARK" : "LIGHT";
            }
        } catch (e) {
            currentTheme = "LIGHT";
        }
        console.log(`✅ 检测到页面主题：${currentTheme}`);
    }

    function captureStream(videoElement) {
        if (!videoElement || videoElement.tagName !== 'VIDEO') {
            throw new Error("未找到有效视频元素！请确认直播已播放");
        }

        let stream;
        if (videoElement.captureStream) {
            stream = videoElement.captureStream();
        } else if (videoElement.mozCaptureStream) {
            stream = videoElement.mozCaptureStream();
        } else {
            throw new Error("当前浏览器不支持MediaRecorder API，请使用Chrome/Firefox");
        }

        if (!isStreamValid(stream)) {
            throw new Error("捕获的视频流无可用音视频轨道");
        }

        return stream;
    }

    function getBroadcasterUsername() {
        try {
            const urlPath = window.location.pathname;
            const urlMatch = urlPath.match(/^\/([^\/]+)\/?$/);
            if (urlMatch && urlMatch[1] && !urlMatch[1].match(/^(categories|tags|live|signup|login)/)) {
                return sanitizeFilename(urlMatch[1].trim());
            }

            const title = document.title.trim();
            const cleanTitle = title.replace(/^Watch\s+/i, '')
                                    .replace(/\s+live\s+on\s+Chaturbate!?/i, '')
                                    .replace(/\s+-\s+Chaturbate/i, '')
                                    .replace(/\s+/g, '_');
            if (cleanTitle && cleanTitle.length > 0 && cleanTitle !== 'Chaturbate') {
                return sanitizeFilename(cleanTitle);
            }

            const usernameElement = document.querySelector('h1[class*="username"]') ||
                                   document.querySelector('a[href^="/"][class*="username"]');
            if (usernameElement) {
                return sanitizeFilename(usernameElement.textContent.trim());
            }

            return "unknown_broadcaster";
        } catch (e) {
            return "unknown_broadcaster";
        }
    }

    function sanitizeFilename(filename) {
        return filename.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_');
    }

    function generateFilename(username, fileExt, duration = '') {
        const date = new Date();
        const dateStr = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
        const timeStr = `${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
        const durationStr = duration ? `_时长${duration.replace(/:/g, '-')}` : '';
        return `${username}_${dateStr}_${timeStr}${durationStr}.${fileExt}`;
    }

    function updateRecordButton(recording) {
        const btn = document.getElementById('cb-record-btn');
        if (!btn) return;

        const themeConfig = CONFIG.THEME[currentTheme];
        const style = recording ? themeConfig.active : themeConfig.normal;

        if (recording) {
            btn.style.backgroundColor = style.bg;
            btn.style.color = style.color;
            btn.style.border = style.border;
        } else {
            btn.textContent = '▶️ 开始录制';
            btn.style.backgroundColor = style.bg;
            btn.style.color = style.color;
            btn.style.border = style.border;
        }
    }

    function toggleRecording() {
        const videoElements = document.querySelectorAll('video');
        let targetVideo = null;
        for (let v of videoElements) {
            if (!v.paused && v.src) {
                targetVideo = v;
                break;
            }
        }
        targetVideo = targetVideo || videoElements[0];

        if (window.isRecording) {
            isManualStop = true;
            window.stopRecording();
        } else {
            isManualStop = false;
            window.startRecording(targetVideo);
        }
    }

    window.startRecording = function(videoElement) {
        if (window.isRecording) return;

        try {
            recordingStream = captureStream(videoElement);
            originalMutedState = videoElement.muted;
            if (originalMutedState) {
                videoElement.muted = false;
                videoElement.volume = 0.000001;
            }

            let mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'webm';
            const options = {
                mimeType: mimeType,
                videoBitsPerSecond: CONFIG.VIDEO_BITRATE
            };
            mediaRecorder = new MediaRecorder(recordingStream, options);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) recordedChunks.push(e.data);
            };

            mediaRecorder.onstop = handleRecorderStop;

            window.isRecording = true;
            isManualStop = false;
            mediaRecorder.start(250);
            recordingStartTime = Date.now();
            startRecordingTimer();

            const autoSaveEndTime = recordingStartTime + CONFIG.RECORD_SEGMENT_MINUTES * 60 * 1000;
            autoSaveTimer = setTimeout(() => {
                if (window.isRecording && !isManualStop && !isUnloading) {
                    mediaRecorder.stop();
                }
            }, CONFIG.RECORD_SEGMENT_MINUTES * 60 * 1000);

            saveRecordingState(true, recordingStartTime, autoSaveEndTime);
            addRecordingLog('start', {
                message: '用户手动开始录制',
                bitrate: `${CONFIG.VIDEO_BITRATE / 1000000} Mbps`,
                format: mimeType
            });

            console.log(`✅ 开始录制，每${CONFIG.RECORD_SEGMENT_MINUTES}分钟自动保存一次片段`);
            showNotification('✅ 开始录制', `${CONFIG.RECORD_SEGMENT_MINUTES}分钟后自动保存片段，保存后继续录制`);
        } catch (err) {
            alert(`❌ 录屏启动失败：${err.message}`);
            addRecordingLog('error', { message: `录屏启动失败：${err.message}` });
            window.isRecording = false;
            updateRecordButton(false);
        }
    };

    window.stopRecording = function() {
        if (!window.isRecording || !mediaRecorder) return;

        isManualStop = true;
        mediaRecorder.stop();

        if (recordingStream) {
            recordingStream.getTracks().forEach(track => track.stop());
            recordingStream = null;
        }

        showNotification('🛑 录制已停止', '已保存最后录制片段');
    };

    function showNotification(title, message) {
        const oldNotification = document.querySelector('.cb-recording-notification');
        if (oldNotification) oldNotification.remove();

        const notification = document.createElement('div');
        notification.className = 'cb-recording-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 10px 15px;
            border-radius: 8px;
            z-index: 100000;
            backdrop-filter: blur(5px);
            border-left: 4px solid #4cd964;
            max-width: 300px;
        `;
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
            <div style="font-size: 12px;">${message}</div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // -------------------------- 拖拽逻辑（修复触屏拖拽） --------------------------
    function startDrag(e) {
        // 兼容鼠标和触屏事件的目标获取
        const target = e.target || e.currentTarget;
        if (target.id !== 'cb-record-btn') return;

        dragTarget = target;
        hasDragged = false;

        // 兼容鼠标和触屏的坐标获取
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const rect = dragTarget.getBoundingClientRect();
        dragOffset.x = clientX - rect.left;
        dragOffset.y = clientY - rect.top;

        dragTarget.style.cursor = 'grabbing';
        dragTarget.style.opacity = '0.8';
        dragTarget.style.zIndex = '100000';

        e.preventDefault();
        e.stopImmediatePropagation();
    }

    function doDrag(e) {
        if (!dragTarget) return;

        hasDragged = true;

        // 兼容鼠标和触屏的坐标获取
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const newLeft = clientX - dragOffset.x;
        const newTop = clientY - dragOffset.y;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const btnWidth = dragTarget.offsetWidth;
        const btnHeight = dragTarget.offsetHeight;

        const finalLeft = Math.max(0, Math.min(newLeft, viewportWidth - btnWidth));
        const finalTop = Math.max(0, Math.min(newTop, viewportHeight - btnHeight));

        dragTarget.style.left = `${finalLeft}px`;
        dragTarget.style.top = `${finalTop}px`;
        dragTarget.style.bottom = 'auto';
        dragTarget.style.right = 'auto';

        e.preventDefault();
        e.stopImmediatePropagation();
    }

    function endDrag() {
        if (!dragTarget) return;

        dragTarget.style.cursor = 'pointer';
        dragTarget.style.opacity = '0.95';
        dragTarget.style.zIndex = CONFIG.DEFAULT_POSITION.zIndex;

        if (hasDragged) {
            const rect = dragTarget.getBoundingClientRect();
            saveButtonPosition({
                left: `${rect.left}px`,
                top: `${rect.top}px`,
                bottom: 'auto',
                right: 'auto',
                zIndex: CONFIG.DEFAULT_POSITION.zIndex
            });
        }

        setTimeout(() => {
            dragTarget = null;
            hasDragged = false;
        }, 100);

        // 兼容事件对象
        if (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    function handleButtonClick(e) {
        if (hasDragged) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
        }

        toggleRecording();
    }

    function initDragAndClick(btn) {
    // 鼠标事件（保持原有逻辑）
    btn.addEventListener('mousedown', startDrag, { capture: true, passive: false });
    document.addEventListener('mousemove', doDrag, { capture: true, passive: false });
    document.addEventListener('mouseup', endDrag, { capture: true, passive: false });
    document.addEventListener('mouseleave', endDrag, { capture: true, passive: false });

    btn.addEventListener('click', handleButtonClick, { capture: true });

    // ================= 触屏事件（关键修复点） =================

    btn.addEventListener('touchstart', (e) => {
        // 🚑 不在直播间 → 放行触屏（允许点击进入直播）
        if (!isLiveRoomPage()) return;

        startDrag(e);
        e.preventDefault();
        e.stopImmediatePropagation();
    }, { capture: true, passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!isLiveRoomPage()) return;

        doDrag(e);
        e.preventDefault();
    }, { capture: true, passive: false });

    document.addEventListener('touchend', (e) => {
    if (!isLiveRoomPage()) return;

    const touch = e.changedTouches[0];

    endDrag();

    // ✅ 只有：没拖拽 + 手指确实点在按钮上
    if (!hasDragged && isTouchOnButton(touch, btn)) {
        const clickEvent = new MouseEvent('click', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true,
            cancelable: true
        });
        handleButtonClick(clickEvent);

        e.preventDefault();
        e.stopImmediatePropagation();
    }
}, { capture: true, passive: false });

    document.addEventListener('touchcancel', () => {
        if (!isLiveRoomPage()) return;
        endDrag();
    }, { capture: true, passive: false });
}

    function createRecordButton() {
        if (document.getElementById('cb-record-btn')) return;

        detectPageTheme();
        const savedPosition = getSavedButtonPosition();

        const recordBtn = document.createElement('button');
        recordBtn.id = 'cb-record-btn';
        recordBtn.style.cssText = `
            padding: 12px 24px;
            margin: 0;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            z-index: ${savedPosition.zIndex};
            position: fixed;
            left: ${savedPosition.left || 'auto'};
            top: ${savedPosition.top || 'auto'};
            bottom: ${savedPosition.bottom || 'auto'};
            right: ${savedPosition.right || 'auto'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: block;
            opacity: 0.95;
            visibility: visible;
            transition: all 0.1s ease;
            outline: none;
            font-family: inherit;
            user-select: none;
            touch-action: none; // 关键：禁用浏览器默认触屏行为
            border: none;
            min-width: 180px;
            text-align: center;
        `;

        initDragAndClick(recordBtn);

        recordBtn.addEventListener('mouseover', () => {
            if (!dragTarget) {
                recordBtn.style.transform = 'scale(1.05)';
                recordBtn.style.opacity = '1';
            }
        });
        recordBtn.addEventListener('mouseout', () => {
            if (!dragTarget) {
                recordBtn.style.transform = 'scale(1)';
                recordBtn.style.opacity = '0.95';
            }
        });

        document.body.appendChild(recordBtn);
        updateRecordButton(false);
        console.log("✅ 录屏按钮已添加（支持刷新自动保存+触屏拖拽）");
    }

    // -------------------------- 初始化 --------------------------
    window.addEventListener('load', () => {
        createRecordButton();
        createLogPanel();

        // 恢复录制状态（仅在非刷新/关闭场景）
        if (!isUnloading) {
            checkAndRecoverRecording();
        }
    });

    // 新增：监听页面卸载事件（刷新/关闭）
    window.addEventListener('beforeunload', saveOnUnload);
    // 兼容不同浏览器的卸载事件
    window.addEventListener('unload', () => {
        if (window.isRecording) {
            saveOnUnload();
        }
    });

    function checkAndRecoverRecording() {
        const state = getRecordingState();
        if (!state.isRecording || !state.startTime) return;

        const elapsedTime = Date.now() - state.startTime;
        const remainingAutoSaveTime = state.autoSaveEndTime - Date.now();

        const recover = confirm(
            `检测到未完成的录制：
            已录制时长：${formatRecordingTime(elapsedTime / 1000)}
            距离自动保存还有：${remainingAutoSaveTime > 0 ? formatRecordingTime(remainingAutoSaveTime / 1000) : '已超时'}

            是否尝试恢复录制？`
        );

        if (recover) {
            recordingStream = reCaptureStream();
            if (!recordingStream) {
                alert('❌ 恢复录制失败：无法重新捕获有效视频流，请手动点击「开始录制」');
                addRecordingLog('error', { message: '恢复录制失败：重新捕获流无可用轨道' });
                clearRecordingState();
                return;
            }

            try {
                window.isRecording = true;
                isManualStop = false;
                recordingStartTime = state.startTime;

                let mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'webm';
                const options = {
                    mimeType: mimeType,
                    videoBitsPerSecond: CONFIG.VIDEO_BITRATE
                };
                mediaRecorder = new MediaRecorder(recordingStream, options);

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) recordedChunks.push(e.data);
                };

                mediaRecorder.onstop = handleRecorderStop;

                mediaRecorder.start(250);

                startRecordingTimer();

                if (remainingAutoSaveTime > 0) {
                    autoSaveTimer = setTimeout(() => {
                        if (window.isRecording && !isManualStop && !isUnloading) {
                            mediaRecorder.stop();
                        }
                    }, remainingAutoSaveTime);
                } else {
                    setTimeout(() => {
                        if (window.isRecording && !isManualStop && !isUnloading) {
                            mediaRecorder.stop();
                        }
                    }, 1000);
                    showNotification('⚠️ 恢复录制后发现已过自动保存时间', '已自动保存当前片段并继续录制');
                }

                updateRecordButton(true);

                addRecordingLog('recover', {
                    duration: formatRecordingTime(elapsedTime / 1000),
                    message: '页面刷新后恢复录制（重新捕获流成功）'
                });

                console.log(`✅ 恢复录制成功，已录制时长：${formatRecordingTime(elapsedTime / 1000)}`);
                showNotification('✅ 录制已恢复', `已录制时长：${formatRecordingTime(elapsedTime / 1000)}`);
            } catch (e) {
                alert(`❌ 恢复录制失败：${e.message}`);
                addRecordingLog('error', { message: `恢复录制失败：${e.message}` });
                clearRecordingState();
                window.isRecording = false;
                updateRecordButton(false);
                if (recordingStream) {
                    recordingStream.getTracks().forEach(track => track.stop());
                    recordingStream = null;
                }
            }
        } else {
            clearRecordingState();
            addRecordingLog('stop', {
                duration: formatRecordingTime(elapsedTime / 1000),
                message: '用户取消恢复录制，状态已清除'
            });
        }
    }

    const themeObserver = new MutationObserver(() => {
        detectPageTheme();
        updateRecordButton(window.isRecording);
    });
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style'],
        subtree: false
    });

    const elementObserver = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            if (!document.getElementById('cb-record-btn')) {
                createRecordButton();
            }
            if (!document.getElementById('cb-recording-log-panel')) {
                createLogPanel();
            }
        });
    });
    elementObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
    });

})();