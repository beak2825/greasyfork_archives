// ==UserScript==
// @name         JavDB 推送115离线
// @namespace    javdb.button.empty
// @version      0.4
// @description  复制和下载按旁添加新按钮，离线路径,按钮名字可使用ui选择自定义，按钮2可开关，使用115web接口实现，支持并适配移动端与pc端
// @match        https://javdb561.com/*
// @match        https://javdb.com/*
// @icon         https://javdb561.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @author       楠
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549614/JavDB%20%E6%8E%A8%E9%80%81115%E7%A6%BB%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/549614/JavDB%20%E6%8E%A8%E9%80%81115%E7%A6%BB%E7%BA%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const TARGET_CLASS = "x-empty-btn";

    let btn1Name = GM_getValue('btn1_name', '按钮1');
    let btn2Name = GM_getValue('btn2_name', '按钮2');
    let btn2Enabled = GM_getValue('btn2_enabled', false);
    let btn1Cid = GM_getValue('btn1_cid', '');
    let btn2Cid = GM_getValue('btn2_cid', '');
    let cookie = GM_getValue('cookie', '');

    function handleMagnetLink(magnet, targetCid, buttonName) {
        console.log(`[${buttonName}] 捕获磁力链接:`, magnet);
        console.log(`[${buttonName}] 目标CID:`, targetCid);

        if (!targetCid) {
            showToast(`❌ 请先为【${buttonName}】设置目标文件夹`, 3000);
            showSettingsModal();
            return;
        }

        if (!cookie) {
            showToast('❌ 请先设置115 Cookie', 3000);
            showSettingsModal();
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://115.com/web/lixian/?ct=lixian&ac=add_task_url",
            headers: {
                "Cookie": cookie,
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://115.com/"
            },
            data: `url=${encodeURIComponent(magnet)}&wp_path_id=${encodeURIComponent(targetCid)}`,
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    console.log('115 API响应:', result);
                    
                    if (result.state === true) {
                        showToast(`✅ 【${buttonName}】离线任务提交成功`);
                    } else if (result.error_msg && result.error_msg.includes("任务已存在")) {
                        showToast(`⚠️ 任务已存在，请勿输入重复的链接地址`, 3000, 'warning');
                    } else {
                        showToast(`❌ 【${buttonName}】提交失败: ${result.error_msg || '未知错误'}`);
                    }
                } catch (error) {
                    console.error('解析响应失败:', error);
                    showToast('❌ 解析115响应失败');
                }
            },
            onerror: function(error) {
                console.error('115请求错误:', error);
                showToast('❌ 115请求错误');
            }
        });
    }

    function generateButtonsHTML() {
        let html = `<button class="${TARGET_CLASS} button is-small x-un-hover is-primary">${btn1Name}</button>`;
        if (btn2Enabled) {
            html += `<button class="${TARGET_CLASS} button is-small x-un-hover is-link">${btn2Name}</button>`;
        }
        return html;
    }

    function insertToMagnets() {
        const magnetsNode = document.querySelector("#magnets-content");
        if (!magnetsNode) return;

        magnetsNode.querySelectorAll(".item.columns").forEach((node) => {
            const btns = node.querySelector(".buttons.column");
            if (btns && !btns.querySelector(`.${TARGET_CLASS}`)) {
                btns.innerHTML += generateButtonsHTML();
                
                const btn1 = btns.querySelector(`.${TARGET_CLASS}.is-primary`);
                if (btn1) {
                    btn1.onclick = () => {
                        const aTag = node.querySelector('a[href^="magnet:?"]');
                        if (aTag) {
                            handleMagnetLink(aTag.getAttribute('href'), btn1Cid, btn1Name);
                        } else {
                            showToast("❌ 未找到磁力链接");
                        }
                    };
                }
                
                if (btn2Enabled) {
                    const btn2 = btns.querySelector(`.${TARGET_CLASS}.is-link`);
                    if (btn2) {
                        btn2.onclick = () => {
                            const aTag = node.querySelector('a[href^="magnet:?"]');
                            if (aTag) {
                                handleMagnetLink(aTag.getAttribute('href'), btn2Cid, btn2Name);
                            } else {
                                showToast("❌ 未找到磁力链接");
                            }
                        };
                    }
                }
            }
        });
    }

    insertToMagnets();

    const observer = new MutationObserver(insertToMagnets);
    observer.observe(document.body, { childList: true, subtree: true });

    function showToast(message, duration = 2500, type = 'default') {
        const toast = document.createElement('div');
        
        let bgGradient;
        if (type === 'warning') {
            bgGradient = 'linear-gradient(135deg, #ff9800, #f57c00)';
        } else if (message.includes('❌') || message.includes('失败') || message.includes('错误')) {
            bgGradient = 'linear-gradient(135deg, #ff5252, #b71c1c)';
        } else if (message.includes('✅') || message.includes('成功')) {
            bgGradient = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
        } else {
            bgGradient = 'linear-gradient(135deg, #2196F3, #1976D2)';
        }

        Object.assign(toast.style, {
            position: 'fixed',
            top: '110px',
            right: '20px',
            padding: '16px 24px',
            background: bgGradient,
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            fontSize: '14px',
            fontWeight: '500',
            opacity: '0',
            transform: 'translateX(100%) scale(0.9)',
            transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
            zIndex: 10000,
            maxWidth: '300px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden'
        });

        const progressBar = document.createElement('div');
        Object.assign(progressBar.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            height: '3px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.8))',
            width: '100%',
            transform: 'scaleX(1)',
            transformOrigin: 'left center',
            transition: 'transform linear',
            borderRadius: '0 0 12px 12px'
        });
        toast.appendChild(progressBar);

        const icon = document.createElement('span');
        if (type === 'warning') {
            icon.innerHTML = '⚠️';
        } else if (message.includes('❌') || message.includes('失败') || message.includes('错误')) {
            icon.innerHTML = '❌';
        } else if (message.includes('✅') || message.includes('成功')) {
            icon.innerHTML = '✓';
        } else {
            icon.innerHTML = 'ℹ️';
        }
        
        Object.assign(icon.style, {
            display: 'inline-block',
            marginRight: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            verticalAlign: 'middle'
        });

        const textSpan = document.createElement('span');
        textSpan.textContent = message;
        textSpan.style.verticalAlign = 'middle';

        toast.appendChild(icon);
        toast.appendChild(textSpan);
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0) scale(1)';
            progressBar.style.transition = `transform ${duration}ms linear`;
            progressBar.style.transform = 'scaleX(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%) scale(0.9)';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 500);
        }, duration);
    }

    async function getFolders(cid = 0) {
        if (!cookie) {
            showToast('请先设置Cookie');
            return [];
        }

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://webapi.115.com/files?aid=1&cid=${cid}&show_dir=1`,
                    headers: { "Cookie": cookie, "User-Agent": "Mozilla/5.0" },
                    onload: resolve,
                    onerror: reject
                });
            });
            const data = JSON.parse(response.responseText);
            if (data.state && data.data) {
                return data.data.filter(item => item.fl && item.fl.length === 0)
                    .map(item => ({ name: item.n, cid: item.cid }));
            }
            return [];
        } catch (error) {
            console.error('获取文件夹列表失败:', error);
            showToast('获取文件夹列表失败');
            return [];
        }
    }

    function showSettingsModal() {
        if (document.querySelector('#tm-settings-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'tm-settings-modal';
        Object.assign(overlay.style, { 
            position: 'fixed', 
            top: '0', 
            left: '0', 
            width: '100%', 
            height: '100%', 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 10001, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, { 
            background: '#fff', 
            padding: '20px 25px', 
            borderRadius: '10px', 
            width: '500px', 
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)', 
            fontFamily: 'Arial, sans-serif', 
            maxHeight: '80vh', 
            overflowY: 'auto' 
        });

        modal.innerHTML = `
            <h3 style="margin-top:0;margin-bottom:15px;color:#333">115 设置</h3>
            <div style="margin-bottom:10px;">
                <label style="display:block;margin-bottom:5px;color:#555;">Cookie:</label>
                <div style="display:flex;align-items:center;gap:5px;">
                    <input id="tm-cookie-input" type="password" value="${cookie}" style="flex:1;padding:6px;border:1px solid #ccc;border-radius:4px;">
                    <button id="tm-toggle-cookie" style="padding:6px 10px;border:1px solid #ccc;border-radius:4px;background:#f5f5f5;cursor:pointer;">显示</button>
                </div>
            </div>
            
            <div style="margin-bottom:15px;padding:10px;background:#f9f9f9;border-radius:5px;">
                <h4 style="margin-top:0;color:#333;border-bottom:1px solid #eee;padding-bottom:5px;">${btn1Name} 设置</h4>
                <div style="margin-bottom:10px;">
                    <label style="display:block;margin-bottom:5px;color:#555;">按钮名称:</label>
                    <input id="tm-btn1-name" type="text" value="${btn1Name}" style="width:100%;padding:6px;border:1px solid #ccc;border-radius:4px;">
                </div>
                <div style="margin-bottom:10px;">
                    <label style="display:block;margin-bottom:5px;color:#555;">目标文件夹 CID:</label>
                    <div style="display:flex;gap:10px;">
                        <input id="tm-btn1-cid-input" type="text" value="${btn1Cid}" style="flex:1;padding:6px;border:1px solid #ccc;border-radius:4px;" placeholder="未设置">
                        <button id="tm-btn1-browse-folders" style="padding:6px 12px;border:none;border-radius:4px;background:#2196F3;color:#fff;cursor:pointer;">浏览文件夹</button>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom:15px;padding:10px;background:#f9f9f9;border-radius:5px;">
                <h4 style="margin-top:0;color:#333;border-bottom:1px solid #eee;padding-bottom:5px;">${btn2Name} 设置</h4>
                <div style="margin-bottom:10px;">
                    <label style="display:block;margin-bottom:5px;color:#555;">按钮名称:</label>
                    <input id="tm-btn2-name" type="text" value="${btn2Name}" style="width:100%;padding:6px;border:1px solid #ccc;border-radius:4px;">
                </div>
                <div style="margin-bottom:10px;">
                    <label style="display:block;margin-bottom:5px;color:#555;">目标文件夹 CID:</label>
                    <div style="display:flex;gap:10px;">
                        <input id="tm-btn2-cid-input" type="text" value="${btn2Cid}" style="flex:1;padding:6px;border:1px solid #ccc;border-radius:4px;" placeholder="未设置">
                        <button id="tm-btn2-browse-folders" style="padding:6px 12px;border:none;border-radius:4px;background:#2196F3;color:#fff;cursor:pointer;">浏览文件夹</button>
                    </div>
                </div>
                <label style="display:inline-flex;align-items:center;">
                    <input type="checkbox" id="tm-btn2-enabled" ${btn2Enabled ? 'checked' : ''} style="margin-right:5px;"> 显示按钮2
                </label>
            </div>
            
            <div style="text-align:right;">
                <button id="tm-settings-cancel" style="margin-right:10px;padding:6px 12px;border:none;border-radius:4px;background:#ccc;color:#fff;cursor:pointer;">取消</button>
                <button id="tm-settings-save" style="padding:6px 12px;border:none;border-radius:4px;background:#4CAF50;color:#fff;cursor:pointer;">保存</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const cookieInput = overlay.querySelector('#tm-cookie-input');
        const toggleButton = overlay.querySelector('#tm-toggle-cookie');
        
        toggleButton.addEventListener('click', function() {
            if (cookieInput.type === 'password') {
                cookieInput.type = 'text';
                toggleButton.textContent = '隐藏';
            } else {
                cookieInput.type = 'password';
                toggleButton.textContent = '显示';
            }
        });

        overlay.querySelector('#tm-btn1-browse-folders').onclick = () => {
            const cookieValue = document.querySelector('#tm-cookie-input').value.trim();
            if (!cookieValue) {
                showToast('请先设置Cookie');
                return;
            }
            GM_setValue('cookie', cookieValue);
            cookie = cookieValue;
            showFolderBrowser('btn1');
        };

        overlay.querySelector('#tm-btn2-browse-folders').onclick = () => {
            const cookieValue = document.querySelector('#tm-cookie-input').value.trim();
            if (!cookieValue) {
                showToast('请先设置Cookie');
                return;
            }
            GM_setValue('cookie', cookieValue);
            cookie = cookieValue;
            showFolderBrowser('btn2');
        };

        overlay.querySelector('#tm-settings-cancel').onclick = () => overlay.remove();

        overlay.querySelector('#tm-settings-save').onclick = () => {
            const newBtn1Name = document.querySelector('#tm-btn1-name').value.trim();
            const newBtn2Name = document.querySelector('#tm-btn2-name').value.trim();
            const newBtn1Cid = document.querySelector('#tm-btn1-cid-input').value.trim();
            const newBtn2Cid = document.querySelector('#tm-btn2-cid-input').value.trim();
            const newBtn2Enabled = document.querySelector('#tm-btn2-enabled').checked;
            const cookieValue = document.querySelector('#tm-cookie-input').value.trim();

            if (newBtn1Cid && newBtn2Cid && newBtn1Cid === newBtn2Cid && newBtn2Enabled) {
                showToast('❌ 两个按钮的目标文件夹不能相同', 3000);
                return;
            }

            GM_setValue('cookie', cookieValue);
            GM_setValue('btn1_name', newBtn1Name);
            GM_setValue('btn2_name', newBtn2Name);
            GM_setValue('btn1_cid', newBtn1Cid);
            GM_setValue('btn2_cid', newBtn2Cid);
            GM_setValue('btn2_enabled', newBtn2Enabled);

            btn1Name = newBtn1Name;
            btn2Name = newBtn2Name;
            btn1Cid = newBtn1Cid;
            btn2Cid = newBtn2Cid;
            btn2Enabled = newBtn2Enabled;
            cookie = cookieValue;

            showToast('✅ 设置已保存，按钮已更新');
            
            document.querySelectorAll(`.${TARGET_CLASS}`).forEach(btn => btn.remove());
            insertToMagnets();
            
            overlay.remove();
        };
    }

    async function showFolderBrowser(buttonType) {
        if (document.querySelector('#tm-folder-browser')) return;

        const overlay = document.createElement('div');
        overlay.id = 'tm-folder-browser';
        Object.assign(overlay.style, { 
            position: 'fixed', 
            top: '0', 
            left: '0', 
            width: '100%', 
            height: '100%', 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 10002, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, { 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '10px', 
            width: '500px', 
            maxHeight: '80vh', 
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)', 
            fontFamily: 'Arial, sans-serif', 
            display: 'flex', 
            flexDirection: 'column' 
        });

        modal.innerHTML = `
            <h3 style="margin-top:0;margin-bottom:15px;color:#333">浏览文件夹 - ${buttonType === 'btn1' ? btn1Name : btn2Name}</h3>
            <div id="tm-current-path" style="margin-bottom:10px;padding:8px;background:#f5f5f5;border-radius:4px;">根目录</div>
            <div id="tm-folders-list" style="flex:1;overflow-y:auto;margin-bottom:15px;min-height:200px;">
                <div style="text-align:center;padding:40px 0;">加载中...</div>
            </div>
            <div style="display:flex;justify-content:space-between;">
                <button id="tm-folder-back" style="padding:6px 12px;border:none;border-radius:4px;background:#ccc;color:#fff;cursor:pointer;">返回上级</button>
                <button id="tm-folder-cancel" style="padding:6px 12px;border:none;border-radius:4px;background:#ccc;color:#fff;cursor:pointer;">取消</button>
                <button id="tm-folder-select" style="padding:6px 12px;border:none;border-radius:4px;background:#4CAF50;color:#fff;cursor:pointer;">选择当前文件夹</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        let currentCid = 0, currentPath = ["根目录"], cidStack = [], pathStack = [];
        const targetButtonType = buttonType;

        async function loadFolders(cid = 0) {
            const foldersList = document.getElementById('tm-folders-list');
            foldersList.innerHTML = '<div style="text-align:center;padding:40px 0;">加载中...</div>';
            const folders = await getFolders(cid);
            if (!folders.length) {
                foldersList.innerHTML = '<div style="text-align:center;padding:40px 0;color:#999;">该目录下没有文件夹</div>';
                return;
            }
            foldersList.innerHTML = '';
            folders.forEach(folder => {
                const folderItem = document.createElement('div');
                folderItem.className = 'tm-folder-item';
                folderItem.style.padding = '10px';
                folderItem.style.borderBottom = '1px solid #eee';
                folderItem.style.cursor = 'pointer';
                folderItem.style.display = 'flex';
                folderItem.style.justifyContent = 'space-between';
                folderItem.style.alignItems = 'center';
                folderItem.innerHTML = `
                    <span>${folder.name}</span>
                    <span style="color:#999;font-size:12px;">CID: ${folder.cid}</span>
                `;
                folderItem.onclick = () => {
                    cidStack.push(currentCid);
                    pathStack.push([...currentPath]);
                    currentCid = folder.cid;
                    currentPath.push(folder.name);
                    updatePathDisplay();
                    loadFolders(currentCid);
                };
                foldersList.appendChild(folderItem);
            });
        }

        function updatePathDisplay() {
            document.getElementById('tm-current-path').textContent = currentPath.join(' / ');
        }

        document.getElementById('tm-folder-back').onclick = () => {
            if (cidStack.length > 0) {
                currentCid = cidStack.pop();
                currentPath = pathStack.pop();
                updatePathDisplay();
                loadFolders(currentCid);
            }
        };
        
        document.getElementById('tm-folder-cancel').onclick = () => overlay.remove();
        
        document.getElementById('tm-folder-select').onclick = () => {
            if (currentCid !== 0) {
                const cidInput = document.querySelector(`#tm-${targetButtonType}-cid-input`);
                if (cidInput) {
                    cidInput.value = currentCid;
                    
                    const otherButtonType = targetButtonType === 'btn1' ? 'btn2' : 'btn1';
                    const otherCidInput = document.querySelector(`#tm-${otherButtonType}-cid-input`);
                    const otherButtonEnabled = document.querySelector('#tm-btn2-enabled') ? document.querySelector('#tm-btn2-enabled').checked : false;
                    
                    if (otherCidInput && otherCidInput.value === cidInput.value && otherButtonEnabled) {
                        showToast('⚠️ 注意: 两个按钮的目标文件夹相同', 3000, 'warning');
                    }
                }
                showToast(`已选择: ${currentPath.join(' / ')}`);
            }
            overlay.remove();
        };

        loadFolders(currentCid);
        updatePathDisplay();
    }

    function addSettingsButton() {
        if (document.querySelector('#tm-settings-btn')) return;
        const btn = document.createElement('div');
        btn.id = 'tm-settings-btn';
        btn.textContent = '⚙️ 115设置';
        Object.assign(btn.style, { 
            position: 'fixed', 
            bottom: '25px', 
            right: '10px', 
            backgroundColor: '#2196F3', 
            color: '#fff', 
            padding: '8px 12px', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            zIndex: 10000, 
            fontWeight: 'bold', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)' 
        });
        btn.onclick = showSettingsModal;
        document.body.appendChild(btn);
    }

    addSettingsButton();
})();
