// ==UserScript==
// @name         华为云在线考试助手 (V1.3 纯净防护版)
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  包含多重防护、可上传图片的摄像头伪装，并提供“一键复制题库”的辅助功能。
// @author       妖火id31944
// @match        https://*.huaweicloud.com/*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548243/%E5%8D%8E%E4%B8%BA%E4%BA%91%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%20%28V13%20%E7%BA%AF%E5%87%80%E9%98%B2%E6%8A%A4%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548243/%E5%8D%8E%E4%B8%BA%E4%BA%91%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%20%28V13%20%E7%BA%AF%E5%87%80%E9%98%B2%E6%8A%A4%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
     * ===================================================================================
     * P1: 核心防护模块 (Core Protection Module)
     * 职责: 破解平台的防作弊机制，为用户提供一个安全的考试环境。
     * - multiLayerVideoProtection: 强制静音所有用于监控的视频流。
     * - antiScreenSwitch: 屏蔽切屏、窗口失焦等事件监听，防止系统检测到用户离开考试页面。
     * ===================================================================================
    */

    (function multiLayerVideoProtection() {
        if (!window.HTMLVideoElement) return;
        // 策略1: 覆写 play 方法
        (function patchPlayMethod() {
            const originalPlay = HTMLVideoElement.prototype.play;
            HTMLVideoElement.prototype.play = function(...args) {
                if (this.srcObject instanceof MediaStream) { this.muted = true; }
                return originalPlay.apply(this, args);
            };
        })();
        // 策略2: 覆写 srcObject setter
        (function patchSrcObject() {
            const videoProto = HTMLVideoElement.prototype;
            const originalSrcObjectDescriptor = Object.getOwnPropertyDescriptor(videoProto, 'srcObject');
            if (!originalSrcObjectDescriptor || typeof originalSrcObjectDescriptor.set !== 'function') { return; }
            Object.defineProperty(videoProto, 'srcObject', {
                ...originalSrcObjectDescriptor,
                set: function(stream) { if (stream instanceof MediaStream && stream.getVideoTracks().length > 0) { this.muted = true; } return originalSrcObjectDescriptor.set.call(this, stream); }
            });
        })();
        // 策略3: 覆写 muted setter
        (function patchMutedProperty() {
            const videoProto = HTMLVideoElement.prototype;
            const originalMutedDescriptor = Object.getOwnPropertyDescriptor(videoProto, 'muted');
            if (!originalMutedDescriptor || typeof originalMutedDescriptor.set !== 'function') { return; }
            Object.defineProperty(videoProto, 'muted', {
                ...originalMutedDescriptor,
                set: function(value) { if (this.srcObject instanceof MediaStream && this.srcObject.getVideoTracks().length > 0) { return originalMutedDescriptor.set.call(this, true); } return originalMutedDescriptor.set.call(this, value); }
            });
        })();
        // 策略4: DOM 变动监听，处理动态加载的 video 元素
        (function setupDOMWatcher() {
            const processVideoElement = (video) => { if (video.tagName === 'VIDEO') { try { video.muted = true; } catch(e){} video.addEventListener('loadstart', () => { video.muted = true; }); video.addEventListener('canplay', () => { video.muted = true; }); } };
            document.querySelectorAll('video').forEach(processVideoElement);
            const observer = new MutationObserver(mutations => { mutations.forEach(mutation => { mutation.addedNodes.forEach(node => { if (node.nodeType === Node.ELEMENT_NODE) { if (node.tagName === 'VIDEO') { processVideoElement(node); } else if (node.querySelectorAll) { node.querySelectorAll('video').forEach(processVideoElement); } } }); }); });
            if (document.body) { observer.observe(document.body, { childList: true, subtree: true }); } else { document.addEventListener('DOMContentLoaded', () => { observer.observe(document.body, { childList: true, subtree: true }); }); }
        })();
    })();

    (function antiScreenSwitch() {
        const window = unsafeWindow; if (!window) return;
        const blackList = new Set(["visibilitychange", "blur", "pagehide", "mouseleave"]);
        function patchAddEventListener(obj) {
            if (!obj || !obj.addEventListener) return;
            obj._addEventListener = obj.addEventListener;
            obj.addEventListener = (...args) => { if (blackList.has(args[0])) { console.log(`[防护模块] 已屏蔽对事件 '${args[0]}' 的监听。`); return; } return obj._addEventListener(...args); };
        }
        patchAddEventListener(window);
        patchAddEventListener(document);
        Object.defineProperties(document, {
            hidden: { value: false, configurable: true }, webkitHidden: { value: false, configurable: true },
            visibilityState: { value: "visible", configurable: true }, webkitVisibilityState: { value: "visible", configurable: true },
            hasFocus: { value: () => true, configurable: true }
        });
    })();


    /*
     * ===================================================================================
     * P2: 统一UI与摄像头伪装模块 (Unified UI & Webcam Spoofing Module)
     * 职责: 创建用户操作界面，并提供核心的摄像头伪装功能。
     * - createFloatingWindow: 构建可拖动的悬浮窗UI。
     * - ensureWebcamHook: 覆写 navigator.mediaDevices.getUserMedia，当启用伪装时，返回由Canvas生成的虚假视频流。
     * ===================================================================================
    */

    (function unifiedUIAndWebcam() {
        const STORAGE_KEY_SPOOF = 'exam_helper_spoof_enabled';
        const STORAGE_KEY_IMG = 'exam_helper_fake_image_base64';
        let isWebcamSpoofingEnabled = localStorage.getItem(STORAGE_KEY_SPOOF) === 'true';
        let userImageDataBase64 = localStorage.getItem(STORAGE_KEY_IMG) || null;
        let cachedMediaStream = null;
        let animationInterval = null;

        const createFakeStream = () => new Promise(async (resolve) => {
            if (cachedMediaStream) return resolve(cachedMediaStream);
            const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 480;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            const loadedImg = await new Promise(resolveImg => {
                if (userImageDataBase64) { const img = new Image(); img.onload = () => resolveImg(img); img.onerror = () => resolveImg(null); img.src = userImageDataBase64; } else { resolveImg(null); }
            });
            if (!loadedImg) { ctx.fillStyle = '#333'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = 'white'; ctx.font = '20px Arial'; ctx.textAlign = 'center'; ctx.fillText('请上传照片', canvas.width / 2, canvas.height / 2); }
            if (animationInterval) clearInterval(animationInterval);
            animationInterval = setInterval(() => { if (loadedImg) { ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height); } }, 100);
            cachedMediaStream = canvas.captureStream(10);
            resolve(cachedMediaStream);
        });

        function ensureWebcamHook() {
            if (!navigator.mediaDevices) navigator.mediaDevices = {};
            if (navigator.mediaDevices.getUserMedia.isPatchedByHelper) return;
            const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
            navigator.mediaDevices.getUserMedia = async function(constraints) {
                if (isWebcamSpoofingEnabled && constraints?.video) { console.log("[摄像头模块] 伪装已激活，返回虚假视频流。"); const fakeStream = await createFakeStream(); return fakeStream ? fakeStream : originalGetUserMedia.apply(this, [constraints]); }
                return originalGetUserMedia.apply(this, [constraints]);
            };
            navigator.mediaDevices.getUserMedia.isPatchedByHelper = true;
        }

        function createFloatingWindow() {
            if (document.getElementById('exam-helper-container')) return;
            const container = document.createElement('div'); container.id = 'exam-helper-container';
            const header = document.createElement('div'); const floatingWindowBody = document.createElement('div'); floatingWindowBody.id = 'floating-window-body';
            const spoofButton = document.createElement('button'); const statusText = document.createElement('p');
            const fileInput = document.createElement('input'); const uploadLabel = document.createElement('label');
            function updateSpoofButton() { spoofButton.innerText = `摄像头伪装: ${isWebcamSpoofingEnabled ? '已开启' : '已关闭'}`; spoofButton.style.backgroundColor = isWebcamSpoofingEnabled ? '#dc3545' : '#6c757d'; }
            spoofButton.onclick = () => { isWebcamSpoofingEnabled = !isWebcamSpoofingEnabled; localStorage.setItem(STORAGE_KEY_SPOOF, isWebcamSpoofingEnabled); updateSpoofButton(); if (!isWebcamSpoofingEnabled) { if (animationInterval) clearInterval(animationInterval); cachedMediaStream = null; } };
            Object.assign(spoofButton.style, { color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', border: 'none', display: 'block', width: '100%', marginBottom: '10px', transition: 'background-color 0.3s' });
            header.textContent = '华为云考试助手V1.3'; statusText.textContent = userImageDataBase64 ? '状态: 已加载照片' : '状态: 未上传照片'; statusText.style.cssText = 'text-align: center; font-size: 12px; color: #555; margin: 0;';
            fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.id = 'fake-cam-upload'; fileInput.style.display = 'none';
            uploadLabel.htmlFor = 'fake-cam-upload'; uploadLabel.textContent = '选择/更换照片';
            Object.assign(uploadLabel.style, { display: 'block', textAlign: 'center', backgroundColor: '#007bff', color: 'white', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', transition: 'background-color 0.3s' });
            floatingWindowBody.append(spoofButton, statusText, fileInput, uploadLabel);
            container.append(header, floatingWindowBody); document.body.appendChild(container); updateSpoofButton();
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files?.[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => { userImageDataBase64 = e.target.result; localStorage.setItem(STORAGE_KEY_IMG, userImageDataBase64); statusText.textContent = '状态: 照片已更新!'; cachedMediaStream = null; };
                reader.readAsDataURL(file);
            });
            Object.assign(container.style, { position: 'fixed', top: '20px', right: '20px', zIndex: '99999', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', minWidth: '220px', fontFamily: 'sans-serif' });
            Object.assign(header.style, { padding: '10px', backgroundColor: '#f0f0f0', cursor: 'move', borderBottom: '1px solid #ccc', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', fontWeight: 'bold', userSelect: 'none', textAlign: 'center' });
            Object.assign(floatingWindowBody.style, { padding: '12px' });
            let isDragging = false, offset = { x: 0, y: 0 };
            header.onmousedown = (e) => { isDragging = true; offset = { x: e.clientX - container.offsetLeft, y: e.clientY - container.offsetTop }; container.style.right = 'auto'; };
            document.onmousemove = (e) => { if (isDragging) { container.style.left = `${e.clientX - offset.x}px`; container.style.top = `${e.clientY - offset.y}px`; } };
            document.onmouseup = () => { isDragging = false; };
        }

        ensureWebcamHook();
        (function spaNavigationHandler() { const wrap = (m) => { const o = history[m]; history[m] = function(...a) { const r = o.apply(this, a); window.dispatchEvent(new Event(m.toLowerCase())); return r; }; }; wrap('pushState'); wrap('replaceState'); const reapply = () => { setTimeout(ensureWebcamHook, 100); }; window.addEventListener('popstate', reapply); window.addEventListener('pushstate', reapply); window.addEventListener('replacestate', reapply); })();
        if (document.readyState === 'loading') { window.addEventListener('DOMContentLoaded', createFloatingWindow); } else { createFloatingWindow(); }
    })();


    /*
     * ===================================================================================
     * P3: 题库导出工具模块 (Question Exporter Module)
     * 职责: 通过劫持 XMLHttpRequest，捕获试卷数据，并提供一个“一键复制题库”的按钮到UI上，
     * 以便用户可以手动复制所有题目和选项。
     * ===================================================================================
    */

    (function questionExporter() {
        const targetUrlPart = '/svc/innovation/userapi/exam2d/so/servlet/getExamPaper';
        const originalXhrSend = XMLHttpRequest.prototype.send;

        /**
         * 将题目JSON数据格式化为易于阅读的文本。
         * @param {Array<Object>} questions - 题目对象数组。
         * @returns {string} - 格式化后的纯文本题库。
         */
        function formatQuestions(questions) {
            return questions.map((q, index) => {
                let typeStr = q.type === 0 ? '单选题' : q.type === 1 ? '多选题' : q.type === 2 ? '判断题' : '未知题';
                let questionText = `${index + 1}. [${typeStr}] ${q.content ? q.content.trim() : '无题干'}\n`;
                if (q.options?.length > 0) {
                    questionText += q.options.map(opt => `   ${opt.optionOrder ? opt.optionOrder + '. ' : '- '}${opt.optionContent ? opt.optionContent.trim() : '无选项内容'}`).join('\n');
                }
                return questionText;
            }).join('\n\n');
        }

        /**
         * 向UI面板添加“一键复制题库”按钮。
         * @param {string} formattedText - 已格式化好的题库文本。
         */
        function addCopyToPanel(formattedText) {
            const floatingWindowBody = document.getElementById('floating-window-body');
            // 如果按钮已存在，则不重复添加
            if (!floatingWindowBody || document.getElementById('copy-questions-btn')) return;

            const button = document.createElement('button');
            button.id = 'copy-questions-btn';
            button.innerText = '一键复制题库';
            Object.assign(button.style, {
                backgroundColor: '#28a745', color: 'white', padding: '8px 12px',
                borderRadius: '5px', cursor: 'pointer', border: 'none',
                display: 'block', width: '100%', marginTop: '10px'
            });

            button.onclick = () => {
                GM_setClipboard(formattedText, 'text');
                button.innerText = '复制成功!';
                button.style.backgroundColor = '#007bff';
                setTimeout(() => {
                    button.innerText = '一键复制题库';
                    button.style.backgroundColor = '#28a745';
                }, 2000);
            };

            floatingWindowBody.appendChild(button);
        }

        // 劫持 XHR
        XMLHttpRequest.prototype.send = function() {
            this.addEventListener('load', function() {
                if (this.readyState === 4 && this.status === 200 && this.responseURL.includes(targetUrlPart)) {
                    try {
                        const data = JSON.parse(this.responseText);
                        if (data?.result?.questions) {
                            console.log('[导出模块 P3] 成功截获题库数据，准备生成复制按钮。');
                            // 核心改造：直接调用函数在UI上生成按钮，而不是暴露全局变量
                            addCopyToPanel(formatQuestions(data.result.questions));
                        }
                    } catch (e) {
                        console.error('[导出模块 P3] 解析题库JSON失败:', e);
                    }
                }
            });
            return originalXhrSend.apply(this, arguments);
        };
    })();

})();
