// ==UserScript==
// @name    获取大乐斗cookies
// @namespace http://tampermonkey.net/
// @version 1.0
// @description    获取大乐斗cookies并执行请求
// @author    You
// @include    https://dld.qzapp.z.qq.com/*
// @grant    GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/550434/%E8%8E%B7%E5%8F%96%E5%A4%A7%E4%B9%90%E6%96%97cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/550434/%E8%8E%B7%E5%8F%96%E5%A4%A7%E4%B9%90%E6%96%97cookies.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const cookieNames = ['RK', 'ptcz', 'openId', 'accessToken', 'newuin'];
    let requestIntervalId = null;
    let isRunning = false;

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }



    function createRequestControls() {



        const controlsContainer = document.createElement('div');
        controlsContainer.style.position = 'fixed';
        controlsContainer.style.bottom = '60px';
        controlsContainer.style.right = '10px';
        controlsContainer.style.zIndex = '10000';
        controlsContainer.style.backgroundColor = '#f0f0f0';
        controlsContainer.style.padding = '15px';
        controlsContainer.style.border = '1px solid #ccc';
        controlsContainer.style.borderRadius = '5px';
        controlsContainer.style.display = 'flex';
        controlsContainer.style.flexDirection = 'column';
        controlsContainer.style.gap = '10px';
        controlsContainer.id = 'controlsContainer';

        // 标题栏
        const header = document.createElement('div');
        header.style.cursor = 'move';
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '6px';
        header.textContent = '大乐斗请求面板（双击重置）';
        controlsContainer.appendChild(header);


        // --- 创建控件（保持原样） ---
        const urlInputLabel = document.createElement('label');
        urlInputLabel.innerHTML = '请求 URL:';
        urlInputLabel.style.display = 'block';
        urlInputLabel.style.marginBottom = '5px';
        urlInputLabel.style.fontSize = '14px';

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = '粘贴要执行的链接到此处';
        urlInput.style.width = '250px';
        urlInput.style.padding = '8px';
        urlInput.style.border = '1px solid #ccc';
        urlInput.style.borderRadius = '3px';

        const countLabel = document.createElement('label');
        countLabel.innerHTML = '执行次数:';
        countLabel.style.display = 'block';
        countLabel.style.marginBottom = '5px';
        countLabel.style.fontSize = '14px';

        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.min = '1';
        countInput.value = '10';
        countInput.style.width = '80px';
        countInput.style.padding = '8px';
        countInput.style.border = '1px solid #ccc';
        countInput.style.borderRadius = '3px';

        const intervalLabel = document.createElement('label');
        intervalLabel.innerHTML = '间隔 (秒):';
        intervalLabel.style.display = 'block';
        intervalLabel.style.marginBottom = '5px';
        intervalLabel.style.fontSize = '14px';

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.min = '0';
        intervalInput.value = '1';
        intervalInput.style.width = '80px';
        intervalInput.style.padding = '8px';
        intervalInput.style.border = '1px solid #ccc';
        intervalInput.style.borderRadius = '3px';

        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '开始请求';
        toggleButton.style.padding = '10px';
        toggleButton.style.backgroundColor = '#28a745';
        toggleButton.style.color = '#ffffff';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '14px';

        const statusDisplay = document.createElement('div');
        statusDisplay.innerHTML = '状态: 空闲';
        statusDisplay.style.fontSize = '12px';
        statusDisplay.style.marginTop = '5px';
        statusDisplay.style.color = '#555';

        const button = document.createElement('button');
        button.innerHTML = '获取会话';
        button.style.zIndex = '10000';
        button.style.backgroundColor = '#00a2d8';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.borderRadius = '5px';

        document.body.appendChild(button);

        button.addEventListener('click', () => {
            let extractedCookies = [];
            cookieNames.forEach(name => {
                const value = getCookie(name);
                if (value !== undefined) {
                    extractedCookies.push(`${name}=${value}`);
                }
            });
            const cookieString = extractedCookies.join('; ');
            if (cookieString) {
                console.log(`Cookies : ${cookieString}`);
                GM_setClipboard(cookieString);
                alert(`成功复制会话信息到粘贴板`);
            } else {
                alert('Cookies匹配失败');
            }
        });

        controlsContainer.appendChild(button);
        controlsContainer.appendChild(urlInputLabel);
        controlsContainer.appendChild(urlInput);
        controlsContainer.appendChild(countLabel);
        controlsContainer.appendChild(countInput);
        controlsContainer.appendChild(intervalLabel);
        controlsContainer.appendChild(intervalInput);
        controlsContainer.appendChild(toggleButton);
        controlsContainer.appendChild(statusDisplay);

        document.body.appendChild(controlsContainer);

        // 悬浮开关按钮
        const togglePanelBtn = document.createElement('div');
        togglePanelBtn.innerHTML = '☰';
        togglePanelBtn.style.position = 'fixed';
        togglePanelBtn.style.bottom = '10px';
        togglePanelBtn.style.right = '10px';
        togglePanelBtn.style.width = '40px';
        togglePanelBtn.style.height = '40px';
        togglePanelBtn.style.borderRadius = '50%';
        togglePanelBtn.style.backgroundColor = '#007bff';
        togglePanelBtn.style.color = '#fff';
        togglePanelBtn.style.display = 'flex';
        togglePanelBtn.style.alignItems = 'center';
        togglePanelBtn.style.justifyContent = 'center';
        togglePanelBtn.style.cursor = 'pointer';
        togglePanelBtn.style.fontSize = '20px';
        togglePanelBtn.style.zIndex = '10001';
        document.body.appendChild(togglePanelBtn);

        togglePanelBtn.addEventListener('click', () => {
            if (controlsContainer.style.display === 'none') {
                controlsContainer.style.display = 'flex';
                savePosition(true);
            } else {
                controlsContainer.style.display = 'none';
                savePosition(false);
            }
        });


        // --- 拖动功能 ---
        let isDragging = false;
        let offsetX = 0, offsetY = 0;
        function startDrag(x, y) {
            const rect = controlsContainer.getBoundingClientRect();
            offsetX = x - rect.left;
            offsetY = y - rect.top;
            controlsContainer.style.left = rect.left + 'px';
            controlsContainer.style.top = rect.top + 'px';
            controlsContainer.style.removeProperty('bottom');
            controlsContainer.style.removeProperty('right');
            isDragging = true;
        }

        function doDrag(x, y) {
            if (!isDragging) return;
            let newLeft = x - offsetX;
            let newTop = y - offsetY;
            newLeft = Math.max(0, Math.min(window.innerWidth - controlsContainer.offsetWidth, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - controlsContainer.offsetHeight, newTop));
            controlsContainer.style.left = newLeft + 'px';
            controlsContainer.style.top = newTop + 'px';
        }
        function endDrag() {
            isDragging = false;
        }
        header.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
        header.addEventListener('dblclick', () => {
            controlsContainer.style.removeProperty('left');
            controlsContainer.style.removeProperty('top');
            controlsContainer.style.bottom = '60px';
            controlsContainer.style.right = '10px';
        });
        document.addEventListener('mousemove', e => doDrag(e.clientX, e.clientY));
        document.addEventListener('mouseup', endDrag);

        // --- 保存/恢复状态 ---
        function savePosition(hidden = false) {
            localStorage.setItem('PanelState', JSON.stringify({
                hidden: hidden
            }));
        }

        // 页面加载时恢复状态
        const saved = JSON.parse(localStorage.getItem('PanelState') || '{}');
        if (saved.hidden) {
            controlsContainer.style.display = 'none';
        }

        // --- 保留原来的请求逻辑 ---
        toggleButton.addEventListener('click', async () => {
            const urlToFetch = urlInput.value.trim();
            const repeatCount = parseInt(countInput.value, 10);
            const intervalSeconds = parseInt(intervalInput.value, 10);
            const intervalMilliseconds = intervalSeconds * 1000;

            if (!urlToFetch) { alert('请输入要请求的 URL！'); return; }
            if (isNaN(repeatCount) || repeatCount < 1) { alert('执行次数至少为1'); return; }
            if (isNaN(intervalMilliseconds) || intervalMilliseconds < 0) { alert('间隔至少为0秒'); return; }

            if (isRunning) {
                clearInterval(requestIntervalId);
                isRunning = false;
                toggleButton.innerHTML = '开始请求';
                toggleButton.style.backgroundColor = '#28a745';
                statusDisplay.innerHTML = '状态: 已停止';
                return;
            }

            isRunning = true;
            toggleButton.innerHTML = '停止请求';
            toggleButton.style.backgroundColor = '#dc3545';
            statusDisplay.innerHTML = `状态: 运行中... (剩余 ${repeatCount} 次)`;

            let currentCount = 0;

            const requestLoop = async () => {
                if (currentCount >= repeatCount) {
                    clearInterval(requestIntervalId);
                    isRunning = false;
                    toggleButton.innerHTML = '开始请求';
                    toggleButton.style.backgroundColor = '#28a745';
                    statusDisplay.innerHTML = '状态: 空闲';
                    alert('所有请求已完成！');
                    return;
                }

                try {
                    let authHeader = '';
                    cookieNames.forEach(name => {
                        const value = getCookie(name);
                        if (value !== undefined) {
                            authHeader += authHeader ? `; ${name}=${value}` : `${name}=${value}`;
                        }
                    });

                    const headers = {
                        'User-Agent': navigator.userAgent,
                        'Referer': window.location.href,
                        'Cookie': authHeader
                    };

                    const response = await fetch(urlToFetch, { method: 'GET', headers });
                    const text = await response.text();
                    console.log(`[${currentCount + 1}/${repeatCount}] 响应: `, text.substring(0,100) + '...');
                } catch (e) {
                    console.error(e);
                    statusDisplay.innerHTML = `状态: 请求失败! ${e.message}`;
                }

                currentCount++;
                statusDisplay.innerHTML = `状态: 运行中... (剩余 ${repeatCount - currentCount} 次)`;
            };

            await requestLoop();
            if (currentCount < repeatCount) requestIntervalId = setInterval(requestLoop, intervalMilliseconds);
        });
    }

    window.addEventListener('load', () => {
        createRequestControls();
    });

})();