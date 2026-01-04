// ==UserScript==
// @name         币安网站备注助手 (GitHub Gist 终极修复版)
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  在币安网站右上角显示备注，使用 GitHub Gist 作为永久免费的云同步后端，可以同步页面备注和脚本
// @author       YourName & Assistant
// @match        https://www.binance.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @downloadURL https://update.greasyfork.org/scripts/554274/%E5%B8%81%E5%AE%89%E7%BD%91%E7%AB%99%E5%A4%87%E6%B3%A8%E5%8A%A9%E6%89%8B%20%28GitHub%20Gist%20%E7%BB%88%E6%9E%81%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554274/%E5%B8%81%E5%AE%89%E7%BD%91%E7%AB%99%E5%A4%87%E6%B3%A8%E5%8A%A9%E6%89%8B%20%28GitHub%20Gist%20%E7%BB%88%E6%9E%81%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY_NOTES = 'website_notes_data_v6';
    const STORAGE_KEY_GIST_ID = 'github_gist_id';
    const STORAGE_KEY_GIST_TOKEN = 'github_gist_token';
    const FILENAME = 'binance_notes.json';

    let currentUrl = window.location.href;
    let noteDiv = null;
    let cloudConfig = null;

    // --- 云配置、读取、保存函数 (这些都是正确的，无需改动) ---
    async function getCloudConfig() {
        if (cloudConfig) return cloudConfig;
        let gistId = GM_getValue(STORAGE_KEY_GIST_ID, null);
        let token = GM_getValue(STORAGE_KEY_GIST_TOKEN, null);
        if (!gistId || !token) {
            alert('欢迎使用GitHub Gist版！首次运行，请配置同步信息。');
            gistId = prompt('请输入您在 GitHub Gist 上获取的 "Gist ID":');
            if (!gistId || gistId.trim() === '') {
                alert('操作已取消。云同步将不会启用。');
                return null;
            }
            token = prompt('现在，请输入您的 GitHub Personal Access Token (以 ghp_ 开头):');
            if (!token || token.trim() === '') {
                alert('操作已取消。云同步将不会启用。');
                return null;
            }
            GM_setValue(STORAGE_KEY_GIST_ID, gistId.trim());
            GM_setValue(STORAGE_KEY_GIST_TOKEN, token.trim());
            alert('配置已保存！脚本现在将使用 GitHub Gist 进行同步。');
        }
        cloudConfig = { gistId, token };
        return cloudConfig;
    }

    async function getAllNotes() {
        const config = await getCloudConfig();
        if (!config) {
            const localNotes = GM_getValue(STORAGE_KEY_NOTES, '{}');
            try { return JSON.parse(localNotes); } catch (e) { return {}; }
        }
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.github.com/gists/${config.gistId}`,
                headers: { "Authorization": `token ${config.token}`, "Accept": "application/vnd.github.v3+json" },
                timeout: 8000,
                onload: function(response) {
                    try {
                        const gistData = JSON.parse(response.responseText);
                        if (gistData.files && gistData.files[FILENAME] && gistData.files[FILENAME].content) {
                            const notes = JSON.parse(gistData.files[FILENAME].content);
                            console.log('GitHub Gist 云端数据获取成功!');
                            GM_setValue(STORAGE_KEY_NOTES, JSON.stringify(notes));
                            resolve(notes);
                        } else { throw new Error(`云端未找到文件 ${FILENAME} 或内容为空`); }
                    } catch (e) {
                        console.error('解析Gist云端数据失败:', e, response.responseText);
                        const localNotes = GM_getValue(STORAGE_KEY_NOTES, '{}');
                        try { resolve(JSON.parse(localNotes)); } catch { resolve({}); }
                    }
                },
                onerror: function(error) {
                    console.log('从Gist获取备注失败 (onerror), 使用本地缓存:', error);
                    const localNotes = GM_getValue(STORAGE_KEY_NOTES, '{}');
                    try { resolve(JSON.parse(localNotes)); } catch { resolve({}); }
                },
                ontimeout: function() {
                    console.log('从Gist获取备注超时, 使用本地缓存');
                    const localNotes = GM_getValue(STORAGE_KEY_NOTES, '{}');
                    try { resolve(JSON.parse(localNotes)); } catch { resolve({}); }
                }
            });
        });
    }

    async function saveAllNotes(notes) {
        GM_setValue(STORAGE_KEY_NOTES, JSON.stringify(notes));
        console.log('备注已保存到本地');
        const config = await getCloudConfig();
        if (!config) return;
        const contentToSave = JSON.stringify(notes, null, 2);
        const dataPayload = { files: { [FILENAME]: { content: contentToSave } } };
        GM_xmlhttpRequest({
            method: "PATCH",
            url: `https://api.github.com/gists/${config.gistId}`,
            headers: {
                "Authorization": `token ${config.token}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            data: JSON.stringify(dataPayload),
            onload: function(response) { console.log('备注成功同步到 GitHub Gist!'); },
            onerror: function(error) {
                console.error('Gist同步失败:', error);
                alert('备注已保存到本地，但同步到云端失败，请检查网络或配置。');
            }
        });
    }

    async function showEditPrompt() {
        currentUrl = window.location.href;
        const notes = await getAllNotes();
        const existingNote = notes[currentUrl] || '';
        const newNote = prompt('请输入或编辑此页面的备注：\n（输入空内容并确定，即可删除此备注）', existingNote);
        if (newNote !== null) {
            if (newNote.trim() === '') {
                delete notes[currentUrl];
                alert('备注已清除。');
            } else {
                notes[currentUrl] = newNote;
               //  alert('备注已保存！');
            }
            saveAllNotes(notes);
            mainLogic();
        }
    }

    async function mainLogic() {
        currentUrl = window.location.href;
        if (noteDiv && noteDiv.parentNode) {
            noteDiv.parentNode.removeChild(noteDiv);
            noteDiv = null;
        }
        const allNotes = await getAllNotes();
        const noteForThisPage = allNotes[currentUrl];
        if (noteForThisPage) {
            noteDiv = document.createElement('div');
            noteDiv.innerHTML = `
                <div style="font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 8px;">网站备注 (Gist)</div>
                <div style="white-space: pre-wrap; max-height: 200px; overflow-y: auto;">${noteForThisPage.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                <span class="close-note-btn" style="position: absolute; top: 5px; right: 8px; cursor: pointer; font-size: 20px; color: #999;">&times;</span>
            `;
            Object.assign(noteDiv.style, {
                position: 'fixed', top: '20px', right: '20px', width: '280px', padding: '15px',
                backgroundColor: '#f0f8ff', border: '1px solid #d3d3d3', borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)', zIndex: '99999', fontSize: '14px',
                lineHeight: '1.5', color: '#333'
            });
            document.body.appendChild(noteDiv);
            noteDiv.querySelector('.close-note-btn').addEventListener('click', function() {
                noteDiv.style.display = 'none';
            });
        }
    }
    
    // --- 脚本主执行区 ---
    if (window.top === window.self) {
        
        // ---【已修复】创建“笔”图标的代码块 ---
        const editButton = document.createElement('div');
        editButton.innerHTML = '&#9998;';
        Object.assign(editButton.style, {
            position: 'fixed', bottom: '20px', right: '20px', width: '50px', height: '50px',
            backgroundColor: '#007bff', color: 'white', borderRadius: '50%', display: 'flex',
            justifyContent: 'center', alignItems: 'center', fontSize: '24px', cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)', zIndex: '99998', transition: 'transform 0.2s'
        });
        editButton.title = '添加或编辑此页备注';
        editButton.addEventListener('click', showEditPrompt);
        editButton.addEventListener('mouseenter', () => { editButton.style.transform = 'scale(1.1)'; });
        editButton.addEventListener('mouseleave', () => { editButton.style.transform = 'scale(1)'; });
        document.body.appendChild(editButton);

        // --- 注册菜单命令 ---
        GM_registerMenuCommand('添加/编辑此页备注', showEditPrompt);
        GM_registerMenuCommand('强制从Gist同步', mainLogic);
        GM_registerMenuCommand('重置Gist云同步配置', () => {
            if (confirm('确定要清除已保存的Gist ID和GitHub Token吗？')) {
                GM_deleteValue(STORAGE_KEY_GIST_ID);
                GM_deleteValue(STORAGE_KEY_GIST_TOKEN);
                alert('配置已清除。请刷新页面以重新设置。');
                cloudConfig = null;
            }
        });
        
        // --- URL变化监听器 ---
        let lastUrl = window.location.href;
        const observer = new MutationObserver(() => {
            const url = window.location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(mainLogic, 500);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // --- 初始加载 ---
        setTimeout(mainLogic, 500);
    }
})();