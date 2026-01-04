// ==UserScript==
// @name         115分享页一键转存按钮
// @version      0.8
// @description  增加一键转存按钮，调用115web接口转存，可自定义Cookie和目标文件夹ID，并保存设置，右下角可修改设置，可用ui来查看文件夹id并保存设置，支持并适配移动端与pc端
// @author       楠
// @match        *://115cdn.com/s/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon         https://115.com/favicon.ico
// @namespace https://greasyfork.org/users/1514724
// @downloadURL https://update.greasyfork.org/scripts/549669/115%E5%88%86%E4%BA%AB%E9%A1%B5%E4%B8%80%E9%94%AE%E8%BD%AC%E5%AD%98%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/549669/115%E5%88%86%E4%BA%AB%E9%A1%B5%E4%B8%80%E9%94%AE%E8%BD%AC%E5%AD%98%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showToast(message, duration = 2500) {
        const toast = document.createElement('div');
        const isError = message.includes('❌') || message.includes('⚠️') || message.includes('请先设置') || message.includes('不能为空') || message.includes('已经转存过') || message.includes('失败') || message.includes('无法解析');
        const bgGradient = isError ? 'linear-gradient(135deg, #ff5252, #b71c1c)' : 'linear-gradient(135deg, #4CAF50, #2E7D32)';

        Object.assign(toast.style, {
            position: 'fixed',
            top: '110px',
            right: '20px',
            padding: '16px 24px',
            background: bgGradient,
            color: '#fff',
            borderRadius: '12px',
            boxShadow: isError ? '0 6px 20px rgba(0,0,0,0.2), 0 0 20px rgba(255,82,82,0.3)' : '0 6px 20px rgba(0,0,0,0.2), 0 0 20px rgba(76,175,80,0.3)',
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
        icon.innerHTML = isError ? '⚠️' : '✓';
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
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 500);
        }, duration);
    }

    async function getFolders(cid = 0) {
        const cookie = GM_getValue('cookie');
        if (!cookie) {
            showToast('请先设置Cookie');
            return [];
        }

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://webapi.115.com/files?aid=1&cid=${cid}&show_dir=1&nsprefix=1`,
                    headers: {
                        "Cookie": cookie,
                        "User-Agent": "Mozilla/5.0"
                    },
                    onload: resolve,
                    onerror: reject
                });
            });

            const data = JSON.parse(response.responseText);
            if (data.state && data.data) {
                return data.data
                    .filter(item => item.fl && item.fl.length === 0)
                    .map(item => ({
                        name: item.n,
                        cid: item.cid
                    }));
            }
            return [];
        } catch (error) {
            showToast('获取文件夹列表失败');
            return [];
        }
    }

    function showSettingsModal() {
        if (document.querySelector('#tm-settings-modal')) return;

        const cookie = GM_getValue('cookie') || '';
        const cid = GM_getValue('target_cid') || '';
        const copyLinkEnabled = GM_getValue('copy_link_enabled', false);

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
            width: '420px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            fontFamily: 'Arial, sans-serif',
            maxHeight: '80vh',
            overflowY: 'auto'
        });

        modal.innerHTML = `
            <h3 style="margin-top:0;margin-bottom:15px;color:#333">115 设置</h3>
            <div style="margin-bottom:10px;">
                <label style="display:block;margin-bottom:5px;color:#555;">Cookie:</label>
                <div style="display:flex;align-items:center;gap:8px;">
                    <input id="tm-cookie-input" type="password" value="${cookie}" style="flex:1;padding:6px;border:1px solid #ccc;border-radius:4px;">
                    <button id="tm-toggle-cookie" style="padding:6px 10px;border:none;border-radius:4px;background:#666;color:#fff;cursor:pointer;white-space:nowrap;">显示</button>
                </div>
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block;margin-bottom:5px;color:#555;">目标文件夹 CID:</label>
                <div style="display:flex;gap:10px;">
                    <input id="tm-cid-input" type="text" value="${cid}" style="flex:1;padding:6px;border:1px solid #ccc;border-radius:4px;">
                    <button id="tm-browse-folders" style="padding:6px 12px;border:none;border-radius:4px;background:#2196F3;color:#fff;cursor:pointer;">浏览文件夹</button>
                </div>
            </div>
            <div style="margin-bottom:15px;padding:10px;background:#f9f9f9;border-radius:4px;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                    <input id="tm-copy-link-toggle" type="checkbox" ${copyLinkEnabled ? 'checked' : ''}>
                    <span style="color:#555;">启用复制本页链接功能</span>
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
        const toggleCookieBtn = overlay.querySelector('#tm-toggle-cookie');
        
        toggleCookieBtn.addEventListener('click', function() {
            if (cookieInput.type === 'password') {
                cookieInput.type = 'text';
                toggleCookieBtn.textContent = '隐藏';
            } else {
                cookieInput.type = 'password';
                toggleCookieBtn.textContent = '显示';
            }
        });

        overlay.querySelector('#tm-browse-folders').onclick = () => {
            const cookieValue = document.querySelector('#tm-cookie-input').value.trim();
            GM_setValue('cookie', cookieValue);
            showFolderBrowser();
        };

        overlay.querySelector('#tm-settings-cancel').onclick = () => overlay.remove();

        overlay.querySelector('#tm-settings-save').onclick = () => {
            GM_setValue('cookie', document.querySelector('#tm-cookie-input').value.trim());
            GM_setValue('target_cid', document.querySelector('#tm-cid-input').value.trim());
            GM_setValue('copy_link_enabled', document.querySelector('#tm-copy-link-toggle').checked);
            showToast('✅ 设置已保存');
            overlay.remove();
            location.reload();
        };
    }

    async function showFolderBrowser() {
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
            <h3 style="margin-top:0;margin-bottom:15px;color:#333">浏览文件夹</h3>
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

        let currentCid = 0;
        let currentPath = ["根目录"];
        let cidStack = [];
        let pathStack = [];

        async function loadFolders(cid = 0) {
            const foldersList = document.getElementById('tm-folders-list');
            foldersList.innerHTML = '<div style="text-align:center;padding:40px 0;">加载中...</div>';
            const folders = await getFolders(cid);
            if (folders.length === 0) {
                foldersList.innerHTML = '<div style="text-align:center;padding:40px 0;color:#999;">该目录下没有文件夹</div>';
                return;
            }
            foldersList.innerHTML = '';
            folders.forEach(folder => {
                const folderItem = document.createElement('div');
                folderItem.style.padding = '10px';
                folderItem.style.borderBottom = '1px solid #eee';
                folderItem.style.cursor = 'pointer';
                folderItem.style.display = 'flex';
                folderItem.style.justifyContent = 'space-between';
                folderItem.innerHTML = `<span>${folder.name}</span><span style="color:#999;">CID: ${folder.cid}</span>`;
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
                const cidInput = document.querySelector('#tm-cid-input');
                if (cidInput) cidInput.value = currentCid;
                showToast(`已选择: ${currentPath.join(' / ')}`);
            }
            overlay.remove();
        };

        loadFolders(currentCid);
        updatePathDisplay();
    }

    function addCopyLinkButton() {
        if (document.querySelector('#tm-copy-link-btn')) return;
        const btn = document.createElement('div');
        btn.id = 'tm-copy-link-btn';
        btn.textContent = '📋 复制链接';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '205px',
            right: '25px',
            backgroundColor: '#2196F3', 
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 10000,
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            textAlign: 'center',
            display: 'inline-block'
        });
        btn.onclick = function() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('✅ 链接已复制到剪贴板');
            }).catch(err => {
                showToast('❌ 复制失败: ' + err);
            });
        };
        document.body.appendChild(btn);
    }

    function addSettingsButton() {
        if (document.querySelector('#tm-settings-btn')) return;
        const btn = document.createElement('div');
        btn.id = 'tm-settings-btn';
        btn.textContent = '⚙️ 115设置';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '160px',
            right: '26px',
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

    function copyTo115() {
        const cookie = GM_getValue('cookie');
        const target_cid = GM_getValue('target_cid');
        if (!cookie) { showToast('⚠️ 请先设置Cookie', 3000); showSettingsModal(); return; }
        if (!target_cid) { showToast('⚠️ 请先设置目标文件夹CID', 3000); showSettingsModal(); return; }

        const share_link = location.href;
        const share_code_match = share_link.match(/\/s\/([^?]+)/);
        const password_match = share_link.match(/password=([^&]{4})/);
        if (!share_code_match || !password_match) { showToast('❌ 无法解析分享链接或密码', 3000); return; }

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://webapi.115.com/share/receive",
            headers: { "Cookie": cookie, "Content-Type": "application/x-www-form-urlencoded" },
            data: `share_code=${encodeURIComponent(share_code_match[1])}&receive_code=${encodeURIComponent(password_match[1])}&cid=${encodeURIComponent(target_cid)}&is_check=0`,
            onload: function(response) {
                try {
                    const responseData = JSON.parse(response.responseText);
                    if (responseData.errno === 4100024) { showToast('⚠️ 你已经转存过该文件'); }
                    else if (responseData.state === true) { showToast('✅ 转存成功！'); }
                    else { showToast('❌ 转存失败: ' + (responseData.error || response.responseText)); }
                } catch (e) { showToast('❌ 响应解析失败'); }
            },
            onerror: function() { showToast('❌ 转存接口调用失败'); }
        });
    }

    function addCustomButton() {
        const confirmBtns = document.querySelectorAll('button:not([id^="tm"])');
        confirmBtns.forEach(btn => {
            if (btn.textContent.trim() === '确定' && !btn.nextElementSibling?.id?.includes('tm-copy')) {
                const copyBtn = btn.cloneNode(true);
                copyBtn.id = 'tm-copy-save-confirm-' + Math.random().toString(36).substr(2, 5);
                copyBtn.textContent = '一键转存';
                copyBtn.style.backgroundColor = '#4CAF50';
                copyBtn.style.marginTop = '10px';
                copyBtn.onclick = (e) => { e.preventDefault(); copyTo115(); };
                btn.parentNode.insertBefore(copyBtn, btn.nextSibling);
            }
        });

        const shareBtns = document.querySelectorAll('button:not([id^="tm"])');
        shareBtns.forEach(btn => {
            if (btn.textContent.trim().includes('转存') && !btn.nextElementSibling?.id?.includes('tm-copy') && !btn.parentNode.nextElementSibling?.id?.includes('tm-copy')) {
                const copyBtn = btn.cloneNode(true);
                copyBtn.id = 'tm-copy-save-share-' + Math.random().toString(36).substr(2, 5);
                copyBtn.innerHTML = btn.innerHTML.replace('转存', '一键转存');
                copyBtn.style.backgroundColor = '#4CAF50';
                copyBtn.style.marginLeft = '10px';
                copyBtn.style.borderRadius = '8px'; 
                copyBtn.onclick = (e) => { e.preventDefault(); copyTo115(); };
                
                if (btn.parentNode.classList.contains('relative') && btn.parentNode.classList.contains('inline-flex')) {
                    btn.parentNode.parentNode.insertBefore(copyBtn, btn.parentNode.nextSibling);
                } else {
                    btn.parentNode.insertBefore(copyBtn, btn.nextSibling);
                }
            }
        });

        const oldSave = document.querySelector('a[btn="save"]');
        if (oldSave && !document.querySelector('#tm-copy-save-old')) {
            const btn = document.createElement('a');
            btn.id = 'tm-copy-save-old';
            btn.className = oldSave.className;
            btn.innerHTML = `<i class="icon-operate ifo-saveto"></i><span>一键转存</span>`;
            btn.style.backgroundColor = '#4CAF50';
            btn.style.color = '#fff';
            btn.style.cursor = 'pointer';
            btn.onclick = copyTo115;
            oldSave.parentNode.insertBefore(btn, oldSave.nextSibling);
        }
    }

    const observer = new MutationObserver(addCustomButton);
    observer.observe(document.body, {childList: true, subtree: true});
    
    if (GM_getValue('copy_link_enabled', false)) addCopyLinkButton();
    addCustomButton();
    addSettingsButton();
})();
