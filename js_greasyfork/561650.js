// ==UserScript==
// @name         flow2ui
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  这里写脚本的英文描述
// @match        https://labs.google/fx/tools/flow/project/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561650/flow2ui.user.js
// @updateURL https://update.greasyfork.org/scripts/561650/flow2ui.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 图片生成 WebSocket 客户端 v3.0');

    if (window.self !== window.top) return;

    let capturedImageData = null;
    let onImageCaptured = null;

    // 拦截 Blob URL 获取图片数据
    const origCreateObjectURL = URL.createObjectURL.bind(URL);
    URL.createObjectURL = function(blob) {
        const url = origCreateObjectURL(blob);
        if (blob && (blob.type?.startsWith('image/') || blob.type?.startsWith('video/') || blob.size > 100000)) {
            console.log('📥 拦截Blob:', blob.type, Math.round(blob.size / 1024) + 'KB');
            const reader = new FileReader();
            reader.onloadend = () => {
                capturedImageData = reader.result.split(',')[1];
                if (onImageCaptured) onImageCaptured(capturedImageData);
            };
            reader.readAsDataURL(blob);
        }
        return url;
    };

    function waitForImageData(timeout = 120000) {
        return new Promise(resolve => {
            if (capturedImageData) {
                const data = capturedImageData;
                capturedImageData = null;
                return resolve(data);
            }
            const timer = setTimeout(() => { onImageCaptured = null; resolve(null); }, timeout);
            onImageCaptured = data => {
                clearTimeout(timer);
                onImageCaptured = null;
                capturedImageData = null;
                resolve(data);
            };
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('🎯 初始化');

        // XPath helpers
        const $x1 = (xpath, ctx = document) => document.evaluate(xpath, ctx, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const $x = (xpath, ctx = document) => {
            const r = [], q = document.evaluate(xpath, ctx, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < q.snapshotLength; i++) r.push(q.snapshotItem(i));
            return r;
        };
        const sleep = ms => new Promise(r => setTimeout(r, ms));

        // 通用等待函数（先等待再检查，避免立即满足条件）
        async function waitUntil(conditionFn, timeout = 60000, interval = 1000) {
            const start = Date.now();
            while (Date.now() - start < timeout) {
                await sleep(interval);  // 先等待
                if (await conditionFn()) return true;  // 再检查
            }
            return false;
        }

        // base64 转 File
        function base64ToFile(base64Data, filename = 'image.jpg') {
            const byteString = atob(base64Data);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
            return new File([new Blob([ab], { type: 'image/jpeg' })], filename, { type: 'image/jpeg' });
        }

        // 上传文件到 input 并等待完成
        async function uploadFileToInput(base64Data, filename = 'image.jpg') {
            const fileInput = $x('//input[@type="file"]')[0];
            if (!fileInput) throw new Error('未找到文件输入框');

            const dt = new DataTransfer();
            dt.items.add(base64ToFile(base64Data, filename));
            fileInput.files = dt.files;
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));

            await sleep(1000);
            const cropBtn = $x('//button[contains(., "Crop and Save")]')[0];
            if (!cropBtn) throw new Error('未找到Crop and Save按钮');
            cropBtn.click();

            const ok = await waitUntil(() => !$x1('//button[contains(., "Upload")]'));
            if (!ok) throw new Error('上传超时');
        }

        // 上传参考图
        async function uploadReferenceImage(base64Data) {
            await sleep(1000);
            const addBtn = $x('//textarea[@id="PINHOLE_TEXT_AREA_ELEMENT_ID"]/..//button/i[text()="add"]')[0];
            if (!addBtn) throw new Error('未找到add按钮');
            addBtn.click();
            await sleep(1000);
            await uploadFileToInput(base64Data, 'reference.jpg');
        }

        // 上传首尾帧
        async function uploadFrameImages(frameImages) {
            if (!frameImages?.length) throw new Error('首帧是必需的');

            // 首帧
            const addBtns = $x('//textarea[@id="PINHOLE_TEXT_AREA_ELEMENT_ID"]/..//button/i[text()="add"]');
            if (!addBtns[0]) throw new Error('未找到首帧上传按钮');
            addBtns[0].click();
            await sleep(1000);
            await uploadFileToInput(frameImages[0], 'first.jpg');
            console.log('✅ 首帧上传成功');

            // 尾帧
            if (frameImages.length > 1) {
                await sleep(1000);
                const addBtn2 = $x('//textarea[@id="PINHOLE_TEXT_AREA_ELEMENT_ID"]/..//button/i[text()="add"]')[0];
                if (addBtn2) {
                    addBtn2.click();
                    await sleep(1000);
                    await uploadFileToInput(frameImages[1], 'last.jpg');
                    console.log('✅ 尾帧上传成功');
                }
            }
        }

        let ws = null;
        let isExecuting = false;
        let clientId = null;

        function sendWsMessage(data) {
            if (ws?.readyState !== WebSocket.OPEN) return false;
            data._id = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            ws.send(JSON.stringify(data));
            return true;
        }

        function sendStatus(msg) {
            console.log('📌', msg);
            sendWsMessage({ type: 'status', message: msg });
        }

        function sendResult(taskId, error) {
            sendWsMessage({ type: 'result', task_id: taskId, error });
        }

        async function executeTask(taskId, prompt, taskType, aspectRatio, resolution, referenceImages) {
            console.log('🚀 执行任务:', taskId, taskType, prompt.substring(0, 30) + '...');

            if (isExecuting) return;
            isExecuting = true;
            capturedImageData = null;

            try {
                // 选择任务类型
                const taskBtn = $x('//textarea[@id="PINHOLE_TEXT_AREA_ELEMENT_ID"]/..//button[1]')[0];
                taskBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch', isPrimary: true }));
                taskBtn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
                taskBtn.click();
                await sleep(300);
                $x(`//div[@role="option"]//*[contains(text(), '${taskType}')]`)[0]?.click();
                await sleep(300);

                // 上传图片
                if (taskType === 'Frames to Video') {
                    sendStatus('上传首尾帧...');
                    await uploadFrameImages(referenceImages);
                } else if (taskType !== 'Text to Video' && referenceImages?.length) {
                    const name = taskType === 'Ingredients to Video' ? '垫图' : '参考图';
                    for (let i = 0; i < referenceImages.length; i++) {
                        sendStatus(`上传${name} ${i + 1}/${referenceImages.length}...`);
                        await uploadReferenceImage(referenceImages[i]);
                        await sleep(500);
                    }
                }

                // 设置参数
                sendStatus('设置参数...');
                $x1('//textarea[@id="PINHOLE_TEXT_AREA_ELEMENT_ID"]/..//button[contains(., "Settings")]')?.click();
                await sleep(300);
                $x1('//button[contains(., "Aspect Ratio")]')?.click();
                await sleep(300);
                $x1(`//div[@role="option"]//span[contains(text(), "${aspectRatio}")]`)?.click();
                await sleep(300);
                $x1('//button[contains(., "Outputs per prompt")]')?.click();
                await sleep(300);
                $x1('//div[@role="option" and normalize-space()="1"]')?.click();

                // 输入prompt
                sendStatus('开始: ' + prompt.substring(0, 30));
                const input = $x1('//textarea[@id="PINHOLE_TEXT_AREA_ELEMENT_ID"]');
                if (!input) throw new Error('未找到输入框');
                input.click();
                await sleep(300);
                input.focus();
                document.execCommand('selectAll');
                document.execCommand('insertText', false, prompt);
                await sleep(300);
                $x1('(//textarea[@id="PINHOLE_TEXT_AREA_ELEMENT_ID"]/..//button)[last()]')?.click();
                sendStatus('等待生成...');

                // 等待生成完成
                const genOk = await waitUntil(() => {
                    const container = $x1('//div[@data-item-index][contains(., "Reuse prompt")]/div/div/div/div/div[1]');
                    if ($x1(".//img | .//video", container)) return true;
                    const text = container?.innerText;
                    if (text?.trim().endsWith('%')) sendStatus('进度 ' + text);
                    else if (text && !text.includes('\n')) throw new Error('生成失败: ' + text);
                    return false;
                }, 120000);
                if (!genOk) throw new Error('生成超时');

                // 下载
                sendStatus('下载中...');
                const taskContainer = $x1('//div[@data-item-index][contains(., "Reuse prompt")]/div/div/div/div');
                const downloadIconBtn = $x1(`//button[.//*[contains(text(),'download')]]`, taskContainer);
                if (!downloadIconBtn) throw new Error('未找到下载图标按钮');
                downloadIconBtn.click();
                await sleep(500);

                const resMap = {
                    "1080p": "Upscaled (1080p)", "720p": "Original size (720p)",
                    "4K": "Download 4K", "2K": "Download 2K", "1K": "Download 1K"
                };
                const resolutionText = resMap[resolution];
                if (!resolutionText) throw new Error('未知分辨率: ' + resolution);
                const dlBtn = $x1(`//div[contains(text(), '${resolutionText}')]`);
                if (!dlBtn) throw new Error('未找到 ' + resolutionText + ' 下载按钮');
                dlBtn.click();

                // 等待图片数据
                sendStatus('获取数据...');
                const base64Data = await waitForImageData( 4 * 60 * 1000);

                if (base64Data) {
                    sendStatus('发送数据...');
                    const chunkSize = 1024 * 1024;
                    const totalChunks = Math.ceil(base64Data.length / chunkSize);

                    if (totalChunks > 1) {
                        for (let i = 0; i < totalChunks; i++) {
                            sendWsMessage({
                                type: 'image_chunk',
                                task_id: taskId,
                                chunk_index: i,
                                total_chunks: totalChunks,
                                data: base64Data.slice(i * chunkSize, (i + 1) * chunkSize)
                            });
                            await sleep(100);
                        }
                    } else {
                        sendWsMessage({ type: 'image_data', task_id: taskId, data: base64Data });
                    }
                    sendStatus('完成 ✅');
                } else {
                    sendResult(taskId, '未获取到图片数据');
                }

            } catch (e) {
                console.error('❌ 执行错误:', e);
                sendResult(taskId, e.message);
            } finally {
                isExecuting = false;
            }
        }

        function connect() {
            console.log('🔌 连接 ws://localhost:12345');
            ws = new WebSocket('ws://localhost:12345');

            ws.onopen = () => {
                console.log('✅ 连接成功，发送注册');
                ws.send(JSON.stringify({
                    type: 'register',
                    page_url: window.location.href
                }));
            };

            ws.onmessage = async (e) => {
                const data = JSON.parse(e.data);

                if (data.type === 'register_success') {
                    clientId = data.client_id;
                    console.log('✅ 注册成功:', clientId);
                    updateButton('已连接', '#28a745');
                    return;
                }

                if (data.type === 'task') {
                    console.log('📋 收到任务:', data.task_id);
                    await executeTask(
                        data.task_id,
                        data.prompt,
                        data.task_type || 'Create Image',
                        data.aspect_ratio || '16:9',
                        data.resolution || '4K',
                        data.reference_images || []
                    );
                }
            };

            ws.onclose = () => {
                console.log('❌ 断开，3秒后重连');
                clientId = null;
                updateButton('已断开', '#dc3545');
                setTimeout(connect, 3000);
            };

            ws.onerror = (err) => console.error('❌ 错误:', err);
        }

        // UI 按钮
        const btn = document.createElement('div');
        btn.textContent = '连接中...';
        btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;padding:10px 20px;background:#6c757d;color:white;border-radius:5px;cursor:pointer;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,0.2);';
        btn.onclick = () => ws?.readyState === WebSocket.OPEN ? ws.close() : connect();
        document.body.appendChild(btn);

        function updateButton(text, color) {
            btn.textContent = text;
            btn.style.background = color;
        }

        connect();
    }
})();
