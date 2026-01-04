// ==UserScript==
// @name         虎扑黑名单 WebDAV定时双向同步
// @description  虎扑黑名单，隐藏拉黑的帖子，并支持WebDAV定时双向同步
// @author       Amamiya
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @match        https://bbs.hupu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @license      MIT
// @version      1.7.0
// @namespace    https://greasyfork.org/users/801480
// @downloadURL https://update.greasyfork.org/scripts/555568/%E8%99%8E%E6%89%91%E9%BB%91%E5%90%8D%E5%8D%95%20WebDAV%E5%AE%9A%E6%97%B6%E5%8F%8C%E5%90%91%E5%90%8C%E6%AD%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/555568/%E8%99%8E%E6%89%91%E9%BB%91%E5%90%8D%E5%8D%95%20WebDAV%E5%AE%9A%E6%97%B6%E5%8F%8C%E5%90%91%E5%90%8C%E6%AD%A5.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // --- 同步相关常量与配置 ---
    const WEBDAV_CONFIG_KEY = 'webdavConfig_v2'; // 更新Key以避免旧配置冲突
    const BLACKLIST_DATA_KEY = 'hupuBlacklistData';
    let syncIntervalId = null; // 用于存放定时器ID

    // --- 数据管理核心函数 ---

    /**
     * 获取本地黑名单数据
     * @returns {{lastModified: number, users: string[], keywords: string[]}}
     */
    function getLocalData() {
        const dataString = GM_getValue(BLACKLIST_DATA_KEY);
        if (dataString) {
            return JSON.parse(dataString);
        }
        // 如果没有数据，从旧格式迁移或创建新的
        const oldUsers = GM_getValue('hiddenUserList', '');
        const oldKeywords = GM_getValue('hiddenKeywordList', '');
        return {
            lastModified: new Date().getTime(),
            users: oldUsers ? oldUsers.split(',') : [],
            keywords: oldKeywords ? oldKeywords.split(',') : [],
        };
    }

    /**
     * 设置本地黑名单数据，并可选地触发推送到WebDAV
     * @param {{lastModified: number, users: string[], keywords: string[]}} data
     * @param {{push: boolean}} options
     */
    function setLocalData(data, options = { push: false }) {
        // 只有在数据确实发生变化时才更新时间戳
        const currentData = getLocalData();
        const hasChanged = JSON.stringify(currentData.users) !== JSON.stringify(data.users) ||
                           JSON.stringify(currentData.keywords) !== JSON.stringify(data.keywords);

        if (hasChanged) {
            data.lastModified = new Date().getTime();
        } else {
            data.lastModified = currentData.lastModified; // 保持旧时间戳
        }

        GM_setValue(BLACKLIST_DATA_KEY, JSON.stringify(data));
        console.log('本地数据已更新。');

        if (options.push && hasChanged) {
            console.log('本地数据已更改，触发推送到 WebDAV...');
            pushToWebDAV();
        }
    }


    // --- WebDAV 同步核心函数 ---

    function getWebdavConfig() {
        const configString = GM_getValue(WEBDAV_CONFIG_KEY);
        return configString ? JSON.parse(configString) : null;
    }

    /**
     * 推送本地数据到WebDAV (PUT)
     */
    function pushToWebDAV(isManual = false) {
        const config = getWebdavConfig();
        if (!config || !config.url || !config.user || !config.pass) {
            if (isManual) alert('WebDAV 信息不完整，请先配置！');
            return;
        }

        const localData = getLocalData();
        const dataString = JSON.stringify(localData, null, 2);

        GM_xmlhttpRequest({
            method: 'PUT',
            url: config.url,
            headers: { 'Content-Type': 'application/json' },
            data: dataString,
            user: config.user,
            password: config.pass,
            onload: function(response) {
                if (response.status === 201 || response.status === 204) {
                    console.log('成功推送到 WebDAV！');
                    if (isManual) alert('成功推送到 WebDAV！');
                } else {
                    console.error('推送到 WebDAV 失败:', response);
                    if (isManual) alert(`推送到 WebDAV 失败！状态码: ${response.status}`);
                }
            },
            onerror: function(response) {
                console.error('推送到 WebDAV 出错:', response);
                if (isManual) alert('推送到 WebDAV 出错！请检查网络或控制台。');
            }
        });
    }

    /**
     * 与WebDAV进行双向同步
     */
    function syncWithWebDAV(isManual = false) {
        const config = getWebdavConfig();
        if (!config || !config.url || !config.user || !config.pass) {
            if (isManual) alert('请先配置 WebDAV 信息！');
            return;
        }

        console.log('开始与 WebDAV 同步...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: config.url,
            user: config.user,
            password: config.pass,
            onload: function(response) {
                const localData = getLocalData();

                if (response.status === 200) { // 文件存在
                    try {
                        const remoteData = JSON.parse(response.responseText);
                        if (!remoteData.lastModified || !remoteData.users || !remoteData.keywords) {
                           throw new Error("远程数据格式不正确");
                        }

                        console.log(`本地时间戳: ${localData.lastModified}, 远程时间戳: ${remoteData.lastModified}`);

                        if (remoteData.lastModified > localData.lastModified) {
                            console.log('远程数据较新，正在更新本地数据...');
                            setLocalData(remoteData);
                            alert('黑名单已从WebDAV同步更新！页面将刷新以应用更改。');
                            window.location.reload();
                        } else if (remoteData.lastModified < localData.lastModified) {
                            console.log('本地数据较新，正在推送到远程...');
                            pushToWebDAV(isManual);
                        } else {
                            console.log('本地与远程数据已同步。');
                            if (isManual) alert('本地与远程数据已同步。');
                        }
                    } catch (e) {
                        console.error('解析远程数据失败:', e);
                        if (isManual) alert('解析远程数据失败，请检查WebDAV上的文件内容是否为正确的JSON格式。');
                    }
                } else if (response.status === 404) { // 文件不存在，首次同步
                    console.log('远程文件不存在，执行首次推送...');
                    pushToWebDAV(isManual);
                } else {
                    console.error('同步失败，无法访问 WebDAV:', response);
                    if (isManual) alert(`同步失败！状态码: ${response.status}`);
                }
            },
            onerror: function(response) {
                console.error('同步出错:', response);
                if (isManual) alert('同步出错！请检查网络或控制台。');
            }
        });
    }

    /**
     * 启动或重启定时同步
     */
    function setupSyncScheduler() {
        if (syncIntervalId) {
            clearInterval(syncIntervalId);
        }
        const config = getWebdavConfig();
        const intervalMinutes = config ? (parseInt(config.syncInterval, 10) || 60) : 60;
        if (intervalMinutes > 0) {
            const intervalMs = intervalMinutes * 60 * 1000;
            syncIntervalId = setInterval(syncWithWebDAV, intervalMs);
            console.log(`已设置 WebDAV 定时同步，频率: ${intervalMinutes} 分钟`);
        }
    }


    // --- 页面逻辑 ---
    function runPageLogic() {
        const localData = getLocalData();
        const hiddenUserList = localData.users;
        const hiddenKeywordList = localData.keywords;
        var currentURL = window.location.href;

        if (!currentURL.includes('.html')) {
            // 列表页逻辑
            if (hiddenUserList.length > 0 || hiddenKeywordList.length > 0) {
                const posts = document.querySelectorAll('.bbs-sl-web-post-layout');
                posts.forEach(post => {
                    const postAuthor = post.children[2].textContent;
                    const postTitle = post.children[0].textContent;
                    if (hiddenUserList.includes(postAuthor)) {
                        post.closest('li').style.display = 'none';
                    }
                    if (hiddenKeywordList.some(item => item && postTitle.includes(item))) {
                        post.closest('li').style.display = 'none';
                    }
                });
            }

            const posts = document.querySelectorAll('.post-auth');
            posts.forEach(post => {
                const span = document.createElement('span');
                span.textContent = '黑';
                span.style.cursor = 'pointer';
                span.style.color = 'red';
                span.style.marginRight = '10px';
                post.insertBefore(span, post.firstChild);

                span.addEventListener('click', function(event) {
                    const id = event.target.parentElement.querySelector('a').textContent;
                    if (confirm('是否确定将用户 "' + id + '" 拉入黑名单?')) {
                        const data = getLocalData();
                        if (!data.users.includes(id)) {
                            data.users.push(id);
                            setLocalData(data, { push: true }); // 保存并推送
                        }
                        event.target.closest('li').style.display = 'none';
                    }
                });
            });
        } else {
            // 详情页逻辑
            const posts = document.querySelectorAll('.user-base-info');
            posts.forEach(post => {
                const span = document.createElement('span');
                span.textContent = '黑';
                span.style.cursor = 'pointer';
                span.style.color = 'red';
                span.style.marginRight = '10px';
                post.insertBefore(span, post.childNodes[1]);
                span.addEventListener('click', function(event) {
                    const id = event.target.parentElement.querySelector('a').textContent;
                    if (confirm('是否确定将用户 "' + id + '" 拉入黑名单?')) {
                        const data = getLocalData();
                        if (!data.users.includes(id)) {
                           data.users.push(id);
                           setLocalData(data, { push: true }); // 保存并推送
                        }
                        event.target.closest('.post-reply-list-wrapper').style.display = 'none';
                    }
                });
            });

            if (hiddenUserList.length > 0) {
                const posts = document.querySelectorAll('.post-reply-list-container');
                posts.forEach(post => {
                    const postAuthor = post.querySelector('.user-base-info a')?.textContent;
                    const replyAuthorDom = post.querySelector('.index_bbs-thread-comp-container__QkBRG a');
                    const replyAuthor = replyAuthorDom ? replyAuthorDom.textContent.trim() : '';

                    if ((postAuthor && hiddenUserList.includes(postAuthor)) || (replyAuthor && hiddenUserList.includes(replyAuthor))) {
                        post.closest('.post-reply-list-wrapper').style.display = 'none';
                    }
                });
            }
        }
    }


    window.onload = function() {
        // 1. 立即执行一次同步检查
        syncWithWebDAV();
        // 2. 设置定时同步
        setupSyncScheduler();
        // 3. 执行页面屏蔽逻辑
        runPageLogic();

        // 注册菜单命令
        registerMenuCommands();
    };

    function registerMenuCommands(){
        GM_registerMenuCommand('移除黑名单', function() {
            const data = getLocalData();
            if (data.users.length > 0) {
                const htmlList = data.users.map(user => `<div class='userItem'>${user}</div>`).join('');
                const html = `<div id='removeBlacklistDialog'><div class='title'>点击用户名以移除：</div><div id='userList'>${htmlList}</div><button id='closeButton'>关闭</button></div>`;
                const div = $(html).appendTo('body').draggable();

                div.find('#closeButton').on('click', () => div.remove());

                div.find('#userList').on('click', '.userItem', function() {
                    const userToRemove = $(this).text();
                    const currentData = getLocalData();
                    currentData.users = currentData.users.filter(u => u !== userToRemove);
                    setLocalData(currentData, { push: true }); // 保存并推送
                    $(this).remove(); // 从UI上移除
                });
            } else {
                alert('当前用户黑名单为空');
            }
        });

        GM_registerMenuCommand('关键词屏蔽', function() {
            const data = getLocalData();
            const html = `<div id='keywordBlockDialog'><div class='title'>输入关键词,用英文逗号隔开：</div><input type='text' id='keywordInput' value='${data.keywords.join(',')}'><div id='buttonContainer'><button id='saveButton'>保存</button><button id='closeButton'>关闭</button></div></div>`;
            const div = $(html).appendTo('body').draggable();

            div.find('#closeButton').on('click', () => div.remove());
            div.find('#saveButton').on('click', function() {
                const currentData = getLocalData();
                const newKeywords = $('#keywordInput').val().split(',').map(k => k.trim()).filter(Boolean);
                currentData.keywords = newKeywords;
                setLocalData(currentData, { push: true }); // 保存并推送
                alert('关键词已保存');
                div.remove();
            });
        });

        GM_registerMenuCommand('备份到本地', function() {
            const backupString = JSON.stringify(getLocalData(), null, 2);
            const blob = new Blob([backupString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'HupuBlackList.json';
            a.click();
            URL.revokeObjectURL(url);
        });

        GM_registerMenuCommand('从本地恢复', function() {
            // UI和逻辑与原版类似，但使用 setLocalData
             const fileInput = $('<input type="file" accept=".json" style="display:none">').appendTo('body');
             fileInput.on('change', function(event) {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const backupData = JSON.parse(e.target.result);
                        if (!backupData.lastModified || !backupData.users || !backupData.keywords) {
                            throw new Error('备份文件格式不正确！');
                        }
                        if (confirm('这将覆盖您当前的黑名单，并立即同步到WebDAV（如果已配置）。确定要恢复吗？')) {
                            setLocalData(backupData, { push: true });
                            alert('黑名单已成功恢复！页面将刷新。');
                            window.location.reload();
                        }
                    } catch (error) {
                        alert('恢复失败：备份文件格式不正确！');
                    } finally {
                        fileInput.remove();
                    }
                };
                reader.readAsText(file);
            });
            fileInput.click();
        });

        GM_registerMenuCommand('配置WebDAV同步', function() {
            const config = getWebdavConfig() || {};
            const html = `
                <div id='webdavConfigDialog'>
                    <div class='title'>配置WebDAV同步</div>
                    <div class='info'>URL必须是包含文件名的完整路径，例如：<br>https://dav.example.com/files/user/Hupu.json</div>
                    <input type='text' id='webdavUrl' placeholder='WebDAV URL (含文件名)' value='${config.url || ''}'>
                    <input type='text' id='webdavUser' placeholder='用户名' value='${config.user || ''}'>
                    <input type='password' id='webdavPass' placeholder='密码' value='${config.pass || ''}'>
                    <input type='number' id='webdavInterval' placeholder='同步频率(分钟, 默认60)' value='${config.syncInterval || 60}'>
                    <div class='info' style='color:red;'>注意：密码将以明文形式存储。</div>
                    <div id='buttonContainer'>
                        <button id='saveWebdavButton'>保存</button>
                        <button id='closeWebdavButton'>关闭</button>
                    </div>
                </div>`;
            const div = $(html).appendTo('body').draggable();

            div.find('#closeWebdavButton').on('click', () => div.remove());
            div.find('#saveWebdavButton').on('click', () => {
                const newConfig = {
                    url: $('#webdavUrl').val().trim(),
                    user: $('#webdavUser').val().trim(),
                    pass: $('#webdavPass').val(),
                    syncInterval: parseInt($('#webdavInterval').val(), 10) || 60,
                };
                if (!newConfig.url || !newConfig.user || !newConfig.pass) {
                    alert('请填写URL、用户名和密码！');
                    return;
                }
                GM_setValue(WEBDAV_CONFIG_KEY, JSON.stringify(newConfig));
                setupSyncScheduler(); // 保存后立即重置定时器
                alert('WebDAV配置已保存！');
                div.remove();
            });
        });

        GM_registerMenuCommand('立即与WebDAV同步', () => syncWithWebDAV(true));
    }


    GM_addStyle(`
        #removeBlacklistDialog, #keywordBlockDialog, #restoreBlacklistDialog, #webdavConfigDialog {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: #f9f9f9; border: 1px solid #ccc; padding: 20px;
            text-align: center; z-index: 9999; display: flex; flex-direction: column;
            gap: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); border-radius: 8px;
        }
        .title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
        .info { font-size: 12px; color: #666; text-align: left; max-width: 350px; }
        #userList { max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; background: #fff; }
        .userItem { cursor: pointer; padding: 5px; border-bottom: 1px solid #eee; }
        .userItem:hover { background-color: #ffdddd; }
        #keywordInput, #webdavUrl, #webdavUser, #webdavPass, #webdavInterval {
            width: 300px; height: 30px; padding: 5px; border: 1px solid #ccc; border-radius: 4px;
        }
        #buttonContainer { display: flex; justify-content: center; gap: 20px; width: 100%; margin-top: 10px; }
        button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
        #saveButton, #saveWebdavButton { background-color: #4CAF50; color: white; }
        #closeButton, #closeWebdavButton { background-color: #f44336; color: white; }
    `);
})();