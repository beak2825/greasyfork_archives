// ==UserScript==
// @name         B站网页版一键开播/关播 mod
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在B站直播姬网页版添加按钮，动态获取RoomID和分区，选择后一键开播/关播，并用HTML展示结果及复制按钮（成功信息手动关闭）。已加入签名逻辑以避免风控。新增身份验证二维码展示功能。
// @author       Owwk
// @match        https://link.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.live.bilibili.com
// @connect      api.qrserver.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549390/B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%80%E9%94%AE%E5%BC%80%E6%92%AD%E5%85%B3%E6%92%AD%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/549390/B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%80%E9%94%AE%E5%BC%80%E6%92%AD%E5%85%B3%E6%92%AD%20mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentRoomInfo = null;
    let availableAreas = null;
    let csrfTokenCache = null;
    let dedeUserIDCache = null; // 新增：缓存 DedeUserID
    let resultBoxTimeoutId = null; // 用于存储结果显示框的定时器ID

    // 1. 函数：从 cookie 中获取 CSRF token (bili_jct)
    function getCsrfToken() {
        if (csrfTokenCache) return csrfTokenCache;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith('bili_jct=')) {
                csrfTokenCache = cookie.substring('bili_jct='.length);
                return csrfTokenCache;
            }
        }
        return null;
    }

    // 新增：从 cookie 中获取 DedeUserID
    function getDedeUserID() {
        if (dedeUserIDCache) return dedeUserIDCache;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith('DedeUserID=')) {
                dedeUserIDCache = cookie.substring('DedeUserID='.length);
                return dedeUserIDCache;
            }
        }
        return null;
    }

    // 辅助函数：发送API请求
    function makeApiRequest(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...options,
                headers: {
                    'Content-Type': options.method === 'POST' ? 'application/x-www-form-urlencoded; charset=UTF-8' : undefined,
                    'Referer': 'https://live.bilibili.com/p/html/web-hime/index.html',
                    'Origin': 'https://live.bilibili.com',
                    ...(options.headers || {})
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // 对于关播重复请求，B站API会返回 code = 160000 （或 message "重复关播") 但实际上可能是成功关播或未直播状态，这里视为非严重错误。
                        if (data.code === 0 || (options.url.includes('stopLive') && (data.code === 160000 || data.msg === "重复关播"))) {
                            resolve(data);
                        } else {
                            // 对于需要身份验证的错误码 60024，也需要特殊处理
                            if (data.code === 60024) {
                                reject(new Error(`API Error (${options.url}): ${data.code} - 需要进行身份验证`));
                            } else {
                                reject(new Error(`API Error (${options.url}): ${data.code} - ${data.message || data.msg || '未知API错误'}`));
                            }
                        }
                    } catch (e) {
                        console.error("原始错误响应:", response.responseText);
                        reject(new Error(`JSON解析错误 (${options.url}): ${e.message}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`请求错误 (${options.url}): ${JSON.stringify(error)}`));
                },
                ontimeout: function() {
                    reject(new Error(`请求超时 (${options.url})`));
                }
            });
        });
    }

    async function fetchLatestLivehimeVersion() {
        const url = `https://api.live.bilibili.com/xlive/app-blink/v1/liveVersionInfo/getHomePageLiveVersion?system_version=2`;

        try {
            const response = await makeApiRequest({
                method: 'GET',
                url: url
            });
            if (response.data && response.data.curr_version && response.data.build !== undefined) {
                 console.log("获取到最新直播姬版本信息:", {
                    version: response.data.curr_version,
                    build: response.data.build
                 });
                return {
                    version: response.data.curr_version,
                    build: response.data.build.toString() // 确保 build 是字符串类型
                };
            } else {
                throw new Error("API响应中缺少版本或构建号信息，或数据格式不正确。");
            }
        } catch (error) {
            displayResultMessage(`获取最新直播姬版本失败: ${error.message}`, 'error');
            console.error('获取最新直播姬版本失败:', error);
            throw error;
        }
    }

    // 2. 函数：获取房间信息 (RoomID, 当前分区等)
    async function fetchRoomInfo(forceRefresh = false) {
        if (currentRoomInfo && !forceRefresh) return currentRoomInfo.data;
        try {
            const response = await makeApiRequest({
                method: 'GET',
                url: 'https://api.live.bilibili.com/xlive/app-blink/v1/room/GetInfo?platform=pc'
            });
            currentRoomInfo = response;
            return response.data;
        } catch (error) {
            displayResultMessage(`获取房间信息失败: ${error.message}`, 'error');
            console.error('获取房间信息失败:', error);
            throw error;
        }
    }

    // 3. 函数：获取所有直播分区
    async function fetchAreaList() {
        if (availableAreas) return availableAreas.data;
        try {
            const response = await makeApiRequest({
                method: 'GET',
                url: 'https://api.live.bilibili.com/room/v1/Area/getList?show_pinyin=1'
            });
            availableAreas = response;
            return response.data;
        } catch (error) {
            displayResultMessage(`获取分区列表失败: ${error.message}`, 'error');
            console.error('获取分区列表失败:', error);
            throw error;
        }
    }

    // 4. 函数：执行开播请求 (已更新为带签名的版本，并动态获取 version/build)
    async function startLiveStream(roomId, areaV2) {
        const csrfToken = getCsrfToken();
        const dedeUserID = getDedeUserID(); // 获取用户UID
        if (!csrfToken || !dedeUserID) {
            displayResultMessage('错误：无法获取到 CSRF token 或用户UID。请确保您已登录B站。', 'error');
            return;
        }

        // 固定的 AppKey 和 AppSecret (Salt)
        const APP_KEY = 'aae92bc66f3edfab';
        const APP_SECRET = 'af125a0d5279fd576c1b4418a3e8276d';

        // --- 获取最新版本和构建号 ---
        let latestVersionInfo;
        try {
            latestVersionInfo = await fetchLatestLivehimeVersion();
        } catch (error) {
            // fetchLatestLivehimeVersion 已经显示了错误信息，此处只需中断
            return;
        }

        const currentBuild = latestVersionInfo.build;
        const currentVersion = latestVersionInfo.version; // startLive API通常不直接使用 version 字符串，只用 build

        // 准备所有需要参与签名的参数
        const paramsToSign = new URLSearchParams();
        //paramsToSign.append('access_key', ''); // 根据算法，此项为空
        paramsToSign.append('appkey', APP_KEY);
        paramsToSign.append('area_v2', areaV2);
        paramsToSign.append('build', currentBuild);
        paramsToSign.append('version', currentVersion);
        paramsToSign.append('csrf', csrfToken);
        paramsToSign.append('csrf_token', csrfToken);
        paramsToSign.append('platform', 'pc_link');
        paramsToSign.append('room_id', roomId);
        paramsToSign.append('ts', Math.floor(Date.now() / 1000).toString());

        // 1. 对参数按 key 的字母顺序排序
        paramsToSign.sort();

        // 2. 拼接成字符串并附加 AppSecret
        const stringToSign = paramsToSign.toString() + APP_SECRET;

        // 3. 计算 MD5 哈希值，得到 sign
        const sign = md5(stringToSign);

        // 最终要发送的表单数据是已排序的参数 + sign
        const finalFormData = new URLSearchParams(paramsToSign); // 拷贝排序后的参数
        finalFormData.append('sign', sign);

        console.log('发送开播请求，数据:', Object.fromEntries(finalFormData));
        displayResultMessage('正在尝试开播，请稍候...', 'info', false); // 显示“正在尝试开播”信息，不自动关闭

        try {
            const data = await makeApiRequest({
                method: 'POST',
                url: 'https://api.live.bilibili.com/room/v1/Room/startLive',
                data: finalFormData.toString(),
            });
            await fetchRoomInfo(true); // 强制刷新房间信息

            if (data.data && data.data.rtmp) {
                const rtmpAddr = data.data.rtmp.addr;
                const rtmpCode = data.data.rtmp.code;
                const liveKey = data.data.live_key;
                const fullRtmpUrl = `${rtmpAddr}${rtmpCode}`;

                const messageHtml = `
                    <h4>开播成功！🎉</h4>
                    <div class="result-item">
                        <span>推流服务器 (Server):</span>
                        <input type="text" value="${rtmpAddr}" readonly id="rtmpAddrResult" />
                        <button class="copy-btn" data-clipboard-target="#rtmpAddrResult">复制</button>
                    </div>
                    <div class="result-item">
                        <span>串流密钥 (Stream Key):</span>
                        <input type="text" value="${rtmpCode}" readonly id="rtmpCodeResult" />
                        <button class="copy-btn" data-clipboard-target="#rtmpCodeResult">复制</button>
                    </div>
                     <div class="result-item">
                        <span>备用-直播密钥 (Live Key):</span>
                        <input type="text" value="${liveKey}" readonly id="liveKeyResult" />
                        <button class="copy-btn" data-clipboard-target="#liveKeyResult">复制</button>
                    </div>
                    <div class="result-item">
                        <span>完整推流地址 (Full RTMP):</span>
                        <input type="text" value="${fullRtmpUrl}" readonly id="fullRtmpResult" />
                        <button class="copy-btn" data-clipboard-target="#fullRtmpResult">复制</button>
                    </div>
                    <p style="font-size:0.9em; color: #555;">OBS等软件通常需要分别填写“服务器地址”和“串流密钥”。</p>
                `;
                displayResultMessage(messageHtml, 'success', false); // 成功信息不自动关闭
            } else {
                const errorDetail = `开播成功，但未找到完整的推流信息。API响应: <pre>${JSON.stringify(data, null, 2)}</pre>`;
                displayResultMessage(errorDetail, 'warning', true, 10000); // 警告可以自动关闭
            }
            hideAreaSelectionModal(); // 隐藏分区选择模态框
        } catch (error) {
            console.error('开播失败:', error);
            // 捕获身份验证错误码 60024
            if (error.message.includes('60024')) { // 人脸验证错误
                const faceAuthUrl = `https://www.bilibili.com/blackboard/live/face-auth-middle.html?source_event=400&mid=${dedeUserID}`;
                showAuthQRCodeModal(faceAuthUrl, roomId, areaV2); // 显示身份验证二维码模态框
                displayResultMessage('需要进行身份验证。请使用B站App扫描二维码完成验证。', 'warning', false); // 验证提示不自动关闭
            } else {
                displayResultMessage(`开播失败: ${error.message}`, 'error'); // 其他错误自动关闭
            }
        }
    }

    // 新增：执行关播请求的函数
    async function stopLiveStream() {
        const stopButton = document.getElementById('customStopLiveButton');
        if(stopButton) {
            stopButton.disabled = true;
            stopButton.textContent = '正在关播...';
        }

        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            displayResultMessage('错误：无法获取到 CSRF token (bili_jct)。请确保您已登录B站。', 'error');
            if(stopButton) {
                stopButton.disabled = false;
                stopButton.textContent = '一键关播';
            }
            return;
        }

        let roomIdToStop = null;
        try {
            const roomData = await fetchRoomInfo();
            roomIdToStop = roomData.room_id;
        } catch (e) {
            if(stopButton) {
                stopButton.disabled = false;
                stopButton.textContent = '一键关播';
            }
            return;
        }

        if (!roomIdToStop) {
            displayResultMessage('错误：无法获取房间ID以进行关播。', 'error');
            if(stopButton) {
                stopButton.disabled = false;
                stopButton.textContent = '一键关播';
            }
            return;
        }

        const platform = 'pc_link';
        const formData = new URLSearchParams();
        formData.append('room_id', roomIdToStop);
        formData.append('platform', platform);
        formData.append('csrf', csrfToken);
        formData.append('csrf_token', csrfToken);

        console.log('发送关播请求，数据:', Object.fromEntries(formData));
        displayResultMessage('正在尝试关播，请稍候...', 'info', false);

        try {
            const data = await makeApiRequest({
                method: 'POST',
                url: 'https://api.live.bilibili.com/room/v1/Room/stopLive',
                data: formData.toString(),
            });
            await fetchRoomInfo(true); // 强制刷新房间信息

            let message = `关播操作已发送。状态: ${data.data && data.data.status ? data.data.status : '未知'}`;
            if (data.code === 160000 || data.msg === "重复关播") { // 之前 makeApiRequest 已经处理了，但为了更清晰地展示，这里再次判断
                message = "当前直播间未在直播状态，或已成功关播。";
                displayResultMessage(message, 'info'); // 状态信息自动关闭
            } else if (data.code === 0) {
                message = `关播成功！当前状态: ${data.data && data.data.status ? data.data.status : 'PREPARING'}`;
                displayResultMessage(message, 'success'); // 成功信息自动关闭
            } else {
                 displayResultMessage(`关播响应异常: ${data.message || data.msg}`, 'warning');
            }
            console.log('关播API响应:', data);

        } catch (error) {
            displayResultMessage(`关播失败: ${error.message}`, 'error');
            console.error('关播失败:', error);
        } finally {
            if(stopButton) {
                stopButton.disabled = false;
                stopButton.textContent = '一键关播';
            }
        }
    }


    // 显示结果信息的函数
    function displayResultMessage(message, type = 'info', autoDismiss = true, duration = 5000) {
        let resultBox = document.getElementById('userscriptResultBox');
        if (!resultBox) {
            resultBox = document.createElement('div');
            resultBox.id = 'userscriptResultBox';
            document.body.appendChild(resultBox);

            const closeButton = document.createElement('button');
            closeButton.id = 'resultBoxCloseButton';
            closeButton.innerHTML = '×'; // HTML实体表示乘号 (X)
            closeButton.onclick = () => {
                resultBox.style.display = 'none';
                if (resultBoxTimeoutId) clearTimeout(resultBoxTimeoutId); // 如果手动关闭，清除定时器
            };
            resultBox.appendChild(closeButton);
        }

        let messageContent = resultBox.querySelector('.message-content');
        if (!messageContent) {
            messageContent = document.createElement('div');
            messageContent.className = 'message-content';
             if (resultBox.firstChild && resultBox.firstChild.id === 'resultBoxCloseButton' && resultBox.firstChild.nextSibling) {
                 resultBox.insertBefore(messageContent, resultBox.firstChild.nextSibling);
             } else if (resultBox.firstChild && resultBox.firstChild.id === 'resultBoxCloseButton') { // 如果只有关闭按钮
                 resultBox.appendChild(messageContent);
             }
             else { // 如果什么都没有
                 resultBox.appendChild(messageContent);
             }
        }

        messageContent.innerHTML = message;
        resultBox.className = ''; // 清除现有类
        resultBox.classList.add('userscript-result-box-base'); // 添加基础类
        resultBox.classList.add(`userscript-result-box-${type}`); // 添加类型特定类
        resultBox.style.display = 'block';

        messageContent.querySelectorAll('.copy-btn').forEach(button => {
            button.onclick = (e) => {
                const targetId = e.target.getAttribute('data-clipboard-target');
                const inputElement = document.querySelector(targetId);
                if (inputElement) {
                    inputElement.select();
                    inputElement.setSelectionRange(0, 99999);
                    try {
                        document.execCommand('copy');
                        e.target.textContent = '已复制!';
                        setTimeout(() => { e.target.textContent = '复制'; }, 1500);
                    } catch (err) {
                        console.error('复制失败:', err);
                        e.target.textContent = '复制失败';
                        setTimeout(() => { e.target.textContent = '复制'; }, 1500);
                    }
                    // 清除选择
                    if (window.getSelection) {
                        window.getSelection().removeAllRanges();
                    } else if (document.selection) {
                        document.selection.empty();
                    }
                }
            };
        });

        if (resultBoxTimeoutId) { // 清除任何现有定时器
            clearTimeout(resultBoxTimeoutId);
            resultBoxTimeoutId = null;
        }

        if (autoDismiss) {
            resultBoxTimeoutId = setTimeout(() => {
                if (resultBox) resultBox.style.display = 'none';
            }, duration);
        }
    }


    // 新增：生成并显示身份验证二维码的模态框
    function showAuthQRCodeModal(authUrl, roomId, areaV2) {
        let authModal = document.getElementById('authQRCodeModal');
        if (!authModal) {
            // 创建身份验证模态框的HTML结构
            const modalHTML = `
                <div id="authQRCodeModalOverlay"></div>
                <div id="authQRCodeModal">
                    <h2>身份验证</h2>
                    <p>请使用B站App扫描下方二维码进行身份验证。</p>
                    <div id="qrCodeContainer">
                        <img id="faceAuthQRCode" src="" alt="身份验证二维码">
                    </div>
                    <p class="small-text">（若二维码无法显示，请尝试复制链接在浏览器中打开：<a href="#" id="authUrlLink" target="_blank" rel="noopener noreferrer">点击此处</a>）</p>
                    <div id="authModalButtons">
                        <button id="authRetryBtn">我已验证，重新开播</button>
                        <button id="authCancelBtn">取消</button>
                    </div>
                    <p class="small-text caution-text">验证成功后，请点击“我已验证，重新开播”按钮。</p>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            authModal = document.getElementById('authQRCodeModal');
            document.getElementById('authQRCodeModalOverlay').addEventListener('click', hideAuthQRCodeModal);
        }

        // 使用外部服务生成二维码图片URL
        const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(authUrl)}`;
        document.getElementById('faceAuthQRCode').src = qrCodeImageUrl;
        document.getElementById('authUrlLink').href = authUrl;

        // 设置“我已验证，重新开播”按钮的点击事件
        document.getElementById('authRetryBtn').onclick = async () => {
            hideAuthQRCodeModal();
            displayResultMessage('身份验证成功，正在重新尝试开播...', 'info', false);
            // 重新尝试开播，传递 roomId 和 areaV2
            await startLiveStream(roomId, areaV2);
        };
        // 设置“取消”按钮的点击事件
        document.getElementById('authCancelBtn').onclick = () => {
             hideAuthQRCodeModal();
             displayResultMessage('已取消开播操作，身份验证未完成。', 'info');
        };


        authModal.style.display = 'block';
        document.getElementById('authQRCodeModalOverlay').style.display = 'block';
    }

    // 新增：隐藏身份验证二维码模态框
    function hideAuthQRCodeModal() {
        const authModal = document.getElementById('authQRCodeModal');
        const authOverlay = document.getElementById('authQRCodeModalOverlay');
        if (authModal) authModal.style.display = 'none';
        if (authOverlay) authOverlay.style.display = 'none';
    }


    // 5. 创建和管理分区选择模态框
    function createAreaSelectionModal() {
        if (document.getElementById('areaSelectionModal')) return;

        const modalHTML = `
            <div id="areaSelectionModalOverlay"></div>
            <div id="areaSelectionModal">
                <h2>选择直播分区</h2>
                <div>
                    <label for="parentAreaSelect">父分区:</label>
                    <select id="parentAreaSelect"></select>
                </div>
                <div>
                    <label for="subAreaSelect">子分区:</label>
                    <select id="subAreaSelect"></select>
                </div>
                <div id="modalButtons">
                    <button id="confirmStartLiveBtn">确认开播</button>
                    <button id="cancelStartLiveBtn">取消</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const parentSelect = document.getElementById('parentAreaSelect');
        parentSelect.addEventListener('change', () => {
            const selectedParentId = parentSelect.value;
            // 确保 availableAreas 已加载
            if (availableAreas && availableAreas.data) {
                populateSubAreas(selectedParentId, availableAreas.data);
            } else {
                console.warn("分区列表数据未加载，无法填充子分区。");
            }
        });

        document.getElementById('confirmStartLiveBtn').addEventListener('click', async () => {
            const selectedSubAreaId = document.getElementById('subAreaSelect').value;
            if (!selectedSubAreaId) {
                displayResultMessage('请选择一个子分区！', 'warning');
                return;
            }
            let roomData;
            try {
                roomData = await fetchRoomInfo();
                if (!roomData || !roomData.room_id) {
                    displayResultMessage('无法获取房间ID，请重试。', 'error');
                    return;
                }
            } catch (e) {
                // fetchRoomInfo 已经显示错误信息，这里不用重复显示
                return;
            }

            document.getElementById('confirmStartLiveBtn').disabled = true;
            document.getElementById('confirmStartLiveBtn').textContent = '处理中...';
            // 调用开播函数，这里不需要 isRetry 参数，因为它只会在初次尝试或用户明确点击“重新开播”时被调用。
            await startLiveStream(roomData.room_id, selectedSubAreaId);
            document.getElementById('confirmStartLiveBtn').disabled = false;
            document.getElementById('confirmStartLiveBtn').textContent = '确认开播';
        });

        document.getElementById('cancelStartLiveBtn').addEventListener('click', hideAreaSelectionModal);
        document.getElementById('areaSelectionModalOverlay').addEventListener('click', hideAreaSelectionModal);
    }

    function populateParentAreas(areas, defaultParentId) {
        const parentSelect = document.getElementById('parentAreaSelect');
        parentSelect.innerHTML = '<option value="">--请选择父分区--</option>';
        if (!areas) {
            console.error("无法填充父分区：分区数据为空。");
            return;
        }
        areas.forEach(parentArea => {
            const option = document.createElement('option');
            option.value = parentArea.id;
            option.textContent = parentArea.name;
            parentSelect.appendChild(option);
        });
        if (defaultParentId) {
            parentSelect.value = defaultParentId;
        }
    }

    function populateSubAreas(parentId, allAreas, defaultSubId) {
        const subSelect = document.getElementById('subAreaSelect');
        subSelect.innerHTML = '<option value="">--请选择子分区--</option>';
        if (!parentId || !allAreas) return;

        const parent = allAreas.find(p => p.id.toString() === parentId.toString());
        if (parent && parent.list) {
            parent.list.forEach(subArea => {
                const option = document.createElement('option');
                option.value = subArea.id;
                option.textContent = subArea.name;
                subSelect.appendChild(option);
            });
        }
        if (defaultSubId) {
            subSelect.value = defaultSubId;
        }
    }

    async function showAreaSelectionModal() {
        if (!document.getElementById('areaSelectionModal')) {
            createAreaSelectionModal();
        }
        document.getElementById('areaSelectionModalOverlay').style.display = 'block';
        document.getElementById('areaSelectionModal').style.display = 'block';

        try {
            // 确保在填充前获取数据。
            // 这些调用会优先使用缓存数据，如果没有则进行请求。
            const roomData = await fetchRoomInfo();
            const areasData = await fetchAreaList();

            if (roomData && areasData) {
                populateParentAreas(areasData, roomData.parent_id);
                // 在父分区填充后，触发 change 事件
                document.getElementById('parentAreaSelect').dispatchEvent(new Event('change'));
                // 然后填充子分区，并可能设置默认值
                populateSubAreas(roomData.parent_id, areasData, roomData.area_v2_id);
            } else {
                throw new Error("加载模态框所需数据失败。");
            }
        } catch (e) {
            console.error("显示分区选择模态框时出错:", e);
            // fetch 函数可能已经显示了错误信息
            hideAreaSelectionModal();
        }
    }

    function hideAreaSelectionModal() {
        if (document.getElementById('areaSelectionModal')) {
            document.getElementById('areaSelectionModalOverlay').style.display = 'none';
            document.getElementById('areaSelectionModal').style.display = 'none';
        }
    }


    // 6. 创建并添加主按钮到页面
    function addActionButtons() {
        const startButton = document.createElement('button');
        startButton.id = 'customStartLiveAdvancedButton';
        startButton.textContent = '一键开播';
        startButton.addEventListener('click', async () => {
            startButton.disabled = true;
            startButton.textContent = '加载数据...';
            try {
                await showAreaSelectionModal();
            } catch (error) {
                console.error("开播按钮点击处理失败:", error);
            }
            startButton.disabled = false;
            startButton.textContent = '一键开播';
        });
        document.body.appendChild(startButton);

        const stopButton = document.createElement('button');
        stopButton.id = 'customStopLiveButton';
        stopButton.textContent = '一键关播';
        stopButton.addEventListener('click', stopLiveStream);
        document.body.appendChild(stopButton);

        console.log('B站开播/关播按钮已添加。');
    }

    // 7. 添加CSS样式
    GM_addStyle(`
        #customStartLiveAdvancedButton, #customStopLiveButton {
            position: fixed;
            right: 20px;
            z-index: 9998;
            padding: 10px 15px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.2s ease, opacity 0.2s ease;
        }
        #customStartLiveAdvancedButton {
            bottom: 120px;
            background-color: #fb7299;
        }
        #customStartLiveAdvancedButton:hover {
            background-color: #f0628a;
        }
        #customStopLiveButton {
            bottom: 70px;
            background-color: #757575;
        }
        #customStopLiveButton:hover {
            background-color: #616161;
        }
        #customStartLiveAdvancedButton:disabled, #customStopLiveButton:disabled {
            background-color: #ccc;
            cursor: not-allowed;
            opacity: 0.7;
        }

        #areaSelectionModalOverlay {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
        }
        #areaSelectionModal {
            display: none;
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px 30px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10001;
            min-width: 300px;
        }
        #areaSelectionModal h2 {
            margin-top: 0;
            margin-bottom: 20px;
            text-align: center;
            color: #333;
        }
        #areaSelectionModal div:not(#modalButtons) {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        #areaSelectionModal label {
            display: inline-block;
            width: 80px;
            margin-right: 10px;
            color: #555;
            text-align: right;
            flex-shrink: 0;
        }
        #areaSelectionModal select {
            flex-grow: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        #modalButtons {
            text-align: right;
            margin-top: 20px;
        }
        #modalButtons button {
            padding: 8px 15px;
            margin-left: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        #confirmStartLiveBtn {
            background-color: #00aeec;
            color: white;
        }
        #confirmStartLiveBtn:hover {
            background-color: #0095cc;
        }
        #confirmStartLiveBtn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        #cancelStartLiveBtn {
            background-color: #e7e7e7;
            color: #333;
        }
        #cancelStartLiveBtn:hover {
            background-color: #d0d0d0;
        }

        .userscript-result-box-base {
            display: none;
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px;
            padding: 15px;
            padding-top: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10002;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
            box-sizing: border-box;
        }
        #resultBoxCloseButton {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            font-size: 24px;
            line-height: 1;
            cursor: pointer;
            color: #aaa;
            padding: 0;
        }
        #resultBoxCloseButton:hover {
            color: #333;
        }
        .userscript-result-box-info {
            background-color: #e6f7ff;
            border: 1px solid #91d5ff;
            color: #0050b3;
        }
        .userscript-result-box-success {
            background-color: #f6ffed;
            border: 1px solid #b7eb8f;
            color: #389e0d;
        }
        .userscript-result-box-success h4 {
            color: #237804;
        }
        .userscript-result-box-warning {
            background-color: #fffbe6;
            border: 1px solid #ffe58f;
            color: #ad6800;
        }
        .userscript-result-box-error {
            background-color: #fff1f0;
            border: 1px solid #ffa39e;
            color: #cf1322;
        }
        .userscript-result-box-base .message-content h4 {
            margin-top: 0;
            margin-bottom: 12px;
            font-size: 17px;
            font-weight: 600;
        }
        .userscript-result-box-base .result-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .userscript-result-box-base .result-item span {
            flex-basis: 150px;
            flex-shrink: 0;
            font-weight: 500;
            margin-right: 8px;
            font-size: 0.9em;
            color: #555;
        }
        .userscript-result-box-base .result-item input[type="text"] {
            flex-grow: 1;
            padding: 7px 9px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 0.9em;
            background-color: #fff;
            color: #333;
            box-sizing: border-box;
        }
        .userscript-result-box-base .copy-btn {
            margin-left: 10px;
            padding: 6px 12px;
            font-size: 0.85em;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .userscript-result-box-base .copy-btn:hover {
            background-color: #40a9ff;
        }
        .userscript-result-box-base pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e8e8e8;
            white-space: pre-wrap;
            word-break: break-all;
            max-height: 100px;
            overflow-y: auto;
            font-size: 0.85em;
            color: #595959;
        }

        /* 身份验证二维码模态框样式 */
        #authQRCodeModalOverlay {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.6);
            z-index: 20000; /* 确保在其他模态框之上 */
        }
        #authQRCodeModal {
            display: none;
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 25px 35px;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
            z-index: 20001;
            min-width: 350px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #333;
        }
        #authQRCodeModal h2 {
            margin-top: 5px;
            margin-bottom: 20px;
            color: #fb7299; /* Bilibili 粉色 */
            font-size: 22px;
        }
        #qrCodeContainer {
            margin: 20px auto;
            border: 2px solid #eee;
            width: 204px; /* 二维码尺寸 + 边框 */
            height: 204px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f7f7f7;
            border-radius: 5px;
        }
        #faceAuthQRCode {
            width: 200px;
            height: 200px;
            display: block;
        }
        #authQRCodeModal p {
            font-size: 15px;
            color: #555;
            margin-bottom: 15px;
        }
        #authQRCodeModal p.small-text {
            font-size: 12px;
            color: #777;
            margin-top: -10px;
            margin-bottom: 20px;
        }
        #authQRCodeModal p.small-text a {
            color: #1890ff;
            text-decoration: none;
        }
        #authQRCodeModal p.small-text a:hover {
            text-decoration: underline;
        }
        #authModalButtons button {
            padding: 10px 20px;
            margin: 0 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.2s ease;
        }
        #authRetryBtn {
            background-color: #fb7299; /* Bilibili 粉色 */
            color: white;
        }
        #authRetryBtn:hover {
            background-color: #e06a8e;
        }
        #authCancelBtn {
            background-color: #e7e7e7;
            color: #333;
        }
        #authCancelBtn:hover {
            background-color: #d0d0d0;
        }
        #authQRCodeModal p.caution-text {
            color: #cf1322; /* 错误红色 */
            font-weight: bold;
            margin-top: 20px;
        }
    `);

    // 在文档加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addActionButtons);
    } else {
        addActionButtons();
    }
})();
