// ==UserScript==
// @name         纯美苹果园 - 黑名单增强脚本
// @namespace    https://www.goddessfantasy.net/
// @version      1.0.4 
// @description  纯美苹果园的黑名单功能脚本
// @author       星尘
// @match        *://*.goddessfantasy.net/bbs/index.php*
// @match        *://45.79.87.129/bbs/index.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553725/%E7%BA%AF%E7%BE%8E%E8%8B%B9%E6%9E%9C%E5%9B%AD%20-%20%E9%BB%91%E5%90%8D%E5%8D%95%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553725/%E7%BA%AF%E7%BE%8E%E8%8B%B9%E6%9E%9C%E5%9B%AD%20-%20%E9%BB%91%E5%90%8D%E5%8D%95%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===============================================================
    // ======================  核心选择器配置  =======================
    // ===============================================================
    const SELECTORS = {
        postContainer: 'div.windowbg[id^="msg"]',
        postAuthor: '.poster h4 a[title^="查看配置文件"]',
        topicContainer: 'div.windowbg',
        topicAuthor: '.info p.floatleft a.preview',
        allQuoteBlock: 'blockquote',
        standardQuoteBlock: 'blockquote.bbc_standard_quote',
        alternateQuoteBlock: 'blockquote.bbc_alternate_quote',
        quoteAuthorCite: 'cite'
    };

    const BLOCKING_MODES = [
        '关闭屏蔽', // 0
        '仅屏蔽楼层和主题', // 1
        '屏蔽楼层+主题+1级引用级别(即原版)', // 2
        '屏蔽楼层+主题+子引用级别', // 3
    ];

    // ===============================================================
    // ======================  核心代码部分  =========================
    // ===============================================================
    // [修改] 拆分存储键
    const STORAGE_KEY_USERS = 'GF_BlockedUsersList_v2_6'; // 与V2.6数据兼容
    const STORAGE_KEY_LEVEL = 'GF_BlockLevel'; // [修改] 新增: 存储屏蔽级别

    let blockedUsersData = [];
    
    // [修改] 整合全局变量
    let blockLevel = 2;
    let isBlockingDisabled = sessionStorage.getItem('GF_isBlockingDisabled') === 'true'; // 临时开关: 从 sessionStorage 取

    async function loadSettings() {
        // 1. 加载黑名单
        let storedData = await GM_getValue(STORAGE_KEY_USERS, []);
        if (storedData.length > 0 && typeof storedData[0] === 'string') {
            console.log('[屏蔽脚本] 检测到旧版数据，正在迁移...');
            storedData = storedData.map(user => ({ name: user, note: '', added: Date.now() }));
            await saveBlockedUsers(storedData);
        }
        blockedUsersData = storedData;

        // 2. 加载屏蔽级别
        blockLevel = await GM_getValue(STORAGE_KEY_LEVEL, 2); // 默认级别 2, 即原版行为
    }

    async function saveBlockedUsers(usersData) {
        const userMap = new Map();
        usersData.forEach(user => userMap.set(user.name.toLowerCase(), user));
        const uniqueUsers = Array.from(userMap.values());
        await GM_setValue(STORAGE_KEY_USERS, uniqueUsers);
        blockedUsersData = uniqueUsers;
        console.log('[屏蔽脚本] 黑名单已更新:', blockedUsersData);
    }

    // [修改] 新增: 保存屏蔽级别
    async function saveBlockLevel(level) {
        blockLevel = parseInt(level, 10);
        await GM_setValue(STORAGE_KEY_LEVEL, blockLevel);
        console.log('[屏蔽脚本] 屏蔽级别已更新:', blockLevel);
    }


    function getBlockedUserNamesLower() {
        return blockedUsersData.map(u => u.name.trim().toLowerCase()).filter(Boolean);
    }

    function runBlocker() {
        if (isBlockingDisabled) return;
        // [修改] 检查级别开关
        if (blockLevel < 1) return; // 级别0 = 关闭屏蔽

        // level 1: 屏蔽帖子和主题作者
        const blockedLower = getBlockedUserNamesLower();
        if (blockedLower.length === 0) return;
        document.querySelectorAll('div.windowbg:not([data-gf-processed])').forEach(container => {
            container.setAttribute('data-gf-processed', 'true');
            let authorElement = container.querySelector(SELECTORS.postAuthor) || container.querySelector(SELECTORS.topicAuthor);
            if (authorElement) {
                const authorName = authorElement.textContent.trim().toLowerCase();
                if (blockedLower.includes(authorName)) {
                    const separator = container.nextElementSibling;
                    if (separator && separator.matches('hr.post_separator')) separator.remove();
                    container.remove();
                }
            }
        });
        // level 2: + 屏蔽1级引用 (原版行为)
        if (blockLevel >= 2)
            document.querySelectorAll(`${SELECTORS.standardQuoteBlock}:not([data-gf-processed])`).forEach(quote => {
                quote.setAttribute('data-gf-processed', 'true');
                const citeElement = quote.querySelector(SELECTORS.quoteAuthorCite);
                if (citeElement?.textContent) {
                    const match = citeElement.textContent.match(/引述:\s*([^ ]+)\s*于/);
                    if (match?.[1] && blockedLower.includes(match[1].trim().toLowerCase())) {
                        quote.style.display = 'none';
                    }
                }
            });
        // level 3: + 屏蔽全部子引用
        if (blockLevel >= 3)
            document.querySelectorAll(`${SELECTORS.alternateQuoteBlock}:not([data-gf-processed])`).forEach(quote => {
                quote.setAttribute('data-gf-processed', 'true');
                const citeElement = quote.querySelector(SELECTORS.quoteAuthorCite);
                if (citeElement?.textContent) {
                    const match = citeElement.textContent.match(/引述:\s*([^ ]+)\s*于/);
                    if (match?.[1] && blockedLower.includes(match[1].trim().toLowerCase())) {
                        quote.style.display = 'none';
                    }
                }
            });
    }

    function injectBlockButtons() {
        if (isBlockingDisabled) return;
        document.querySelectorAll(SELECTORS.postAuthor).forEach(el => {
            if (el.dataset.blockBtnInjected) return;
            el.dataset.blockBtnInjected = 'true';
            const authorName = el.textContent.trim();
            if (getBlockedUserNamesLower().includes(authorName.toLowerCase())) return;
            const blockBtn = document.createElement('a');
            blockBtn.href = 'javascript:void(0);';
            blockBtn.textContent = '[屏蔽]';
            blockBtn.style.cssText = 'font-size: 12px; color: #c04444; margin-left: 8px; font-weight: normal;';
            blockBtn.title = `点击将用户 "${authorName}" 添加到黑名单`;
            blockBtn.addEventListener('click', async (e) => {
                e.preventDefault(); e.stopPropagation();
                if (confirm(`确定要屏蔽用户 "${authorName}" 吗？`)) {
                    await saveBlockedUsers([...blockedUsersData, { name: authorName, note: '', added: Date.now() }]);
                    alert(`用户 "${authorName}" 已被屏蔽。`);
                    runBlocker();
                }
            });
            el.insertAdjacentElement('afterend', blockBtn);
        });
    }

    // ===============================================================
    // ===================  GUI 界面 (V2.6.1) ========================
    // ===============================================================
    function setupGUI() {
        GM_addStyle(`
            #blocker-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 9998; display: none; }
            #blocker-settings-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 520px; background-color: #f0f4f7; box-shadow: 0 8px 25px rgba(0,0,0,0.2); z-index: 9999; border-radius: 12px; font-family: 'Microsoft YaHei', sans-serif; display: none; flex-direction: column; }
            .panel-header { padding: 15px 20px; background-color: #557EA0; color: white; font-size: 18px; font-weight: bold; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center; }
            #blocker-close-btn { cursor: pointer; font-size: 24px; line-height: 1; border: none; background: none; color: white; opacity: 0.8; transition: opacity 0.2s; }
            .panel-body { padding: 20px; background: #fff; }
            .input-group { display: flex; gap: 5px; margin-bottom: 15px; }
            .input-group input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; }
            #blocker-add-btn { display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 10px 15px; border: none; color: white; cursor: pointer; font-size: 14px; font-weight: bold; background-color: #6a913a; border-radius: 6px; transition: opacity 0.2s; }
            /* [修改] 新增: 下拉框的容器样式 */
            .setting-group { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
            .setting-group label { font-weight: bold; font-size: 14px; }
            .setting-group select { flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; }
            .panel-controls { display: flex; justify-content: space-between; margin-bottom: 10px; }
            #blocker-search { width: 60%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; }
            .sort-buttons button { display: flex; align-items: center; justify-content: center; background-color: #888; border-radius: 4px; padding: 8px 10px; font-size: 13px; margin-left: 5px; border: none; color: white; cursor: pointer; }
            #blocked-list-container { max-height: 280px; overflow-y: auto; border: 1px solid #ddd; border-radius: 6px; padding: 5px; }
            #blocked-list li { display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #eee; gap: 10px; }
            #blocked-list .user-details { flex-grow: 1; }
            #blocked-list .user-name { font-weight: bold; color: #333; }
            #blocked-list .note-input { width: 100%; box-sizing: border-box; margin-top: 4px; padding: 5px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; color: #555; }
            #blocked-list .remove-btn { display: flex; align-items: center; justify-content: center; flex-shrink: 0; background-color: #c04444; border-radius: 4px; border: none; color: white; padding: 8px 12px; cursor: pointer; transition: opacity 0.2s; }
            .panel-footer { padding: 15px 20px; background-color: #e8ecf0; border-top: 1px solid #ddd; border-radius: 0 0 12px 12px; }
            .panel-footer h4 { margin: 0 0 10px 0; font-size: 16px; color: #333; }
            #blocker-import-area { width: 100%; box-sizing: border-box; min-height: 60px; padding: 8px; border-radius: 6px; margin-bottom: 10px; font-size: 13px; }
            .footer-actions { display: flex; gap: 10px; }
            .footer-actions button { display: flex; align-items: center; justify-content: center; flex: 1; border-radius: 6px; padding: 10px; border: none; color: white; cursor: pointer; font-weight: bold; }
            #blocker-import-btn { background-color: #4a7a9c; }
            #blocker-export-btn { background-color: #888; }
        `);

        const panel = document.createElement('div');
        panel.id = 'blocker-settings-panel';
        panel.innerHTML = `
            <div class="panel-header"><span>高级用户屏蔽设置 (V1.0.3)</span><button id="blocker-close-btn">&times;</button></div>
            <div class="panel-body">
                <div class="input-group">
                    <input type="text" id="blocker-new-user" placeholder="输入要屏蔽的用户名">
                    <input type="text" id="blocker-new-note" placeholder="可选备注">
                    <button id="blocker-add-btn">添加</button>
                </div>
                <div class="setting-group">
                    <label for="blocker-level-select">屏蔽级别:</label>
                    <select id="blocker-level-select"></select>
                </div>
                <div class="panel-controls">
                    <input type="text" id="blocker-search" placeholder="搜索黑名单...">
                    <div class="sort-buttons">
                        <button id="sort-asc">A-Z ↑</button>
                        <button id="sort-desc">Z-A ↓</button>
                    </div>
                </div>
                <div id="blocked-list-container"><ul id="blocked-list"></ul></div>
            </div>
            <div class="panel-footer">
                <h4>批量操作 (JSON格式)</h4>
                <textarea id="blocker-import-area" placeholder="在此粘贴导出的JSON数据进行导入。"></textarea>
                <div class="footer-actions">
                    <button id="blocker-import-btn">导入并覆盖</button>
                    <button id="blocker-export-btn">导出到剪贴板</button>
                </div>
            </div>
        `;
        document.body.appendChild(document.createElement('div')).id = 'blocker-overlay';
        document.body.appendChild(panel);

        // [修改] 填充下拉框选项
        const levelSelect = panel.querySelector('#blocker-level-select');
        BLOCKING_MODES.forEach((mode, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = mode;
            levelSelect.appendChild(option);
        });

        const topInfo = document.querySelector('#top_info');
        if (topInfo) {
            const settingsLi = document.createElement('li');
            settingsLi.innerHTML = `<a href="#" id="blocker-settings-btn">屏蔽设置</a>`;
            topInfo.insertBefore(settingsLi, topInfo.children[3]);
            document.getElementById('blocker-settings-btn').addEventListener('click', (e) => { e.preventDefault(); openSettingsPanel(); });

            const toggleLi = document.createElement('li');
            toggleLi.innerHTML = `<a href="#" id="blocker-toggle-btn">${isBlockingDisabled ? '开启屏蔽' : '关闭屏蔽'}</a>`;
            topInfo.insertBefore(toggleLi, settingsLi.nextSibling);
            document.getElementById('blocker-toggle-btn').addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.setItem('GF_isBlockingDisabled', !isBlockingDisabled);
                alert(`屏蔽功能已${!isBlockingDisabled ? '关闭' : '开启'}，页面将刷新。`);
                location.reload();
            });
        }

        let currentSort = 'asc';
        const ui = {
            overlay: document.getElementById('blocker-overlay'),
            panel: panel,
            closeBtn: document.getElementById('blocker-close-btn'),
            addBtn: document.getElementById('blocker-add-btn'),
            userInput: document.getElementById('blocker-new-user'),
            noteInput: document.getElementById('blocker-new-note'),
            importBtn: document.getElementById('blocker-import-btn'),
            exportBtn: document.getElementById('blocker-export-btn'),
            importArea: document.getElementById('blocker-import-area'),
            searchBox: document.getElementById('blocker-search'),
            sortAscBtn: document.getElementById('sort-asc'),
            sortDescBtn: document.getElementById('sort-desc'),
            levelSelect: levelSelect // [修改] 添加对下拉框的引用
        };
        
        const addUser = () => {
            const newUser = ui.userInput.value.trim();
            const newNote = ui.noteInput.value.trim();
            if (newUser && !getBlockedUserNamesLower().includes(newUser.toLowerCase())) {
                saveBlockedUsers([...blockedUsersData, { name: newUser, note: newNote, added: Date.now() }]).then(() => {
                    renderBlockedList();
                    ui.userInput.value = '';
                    ui.noteInput.value = '';
                    runBlocker();
                });
            } else if (newUser) {
                alert('该用户已在黑名单中。');
            }
        };

        const removeUser = (userToRemove) => {
            const updatedList = blockedUsersData.filter(u => u.name.toLowerCase() !== userToRemove.toLowerCase());
            saveBlockedUsers(updatedList).then(() => {
                renderBlockedList();
                if (confirm('已移除用户。是否刷新页面以查看已移除的内容？')) location.reload();
            });
        };

        const exportUsers = async () => {
            if (blockedUsersData.length === 0) return alert('黑名单为空。');
            const dataStr = JSON.stringify(blockedUsersData, null, 2);
            await navigator.clipboard.writeText(dataStr);
            ui.exportBtn.textContent = '已复制!';
            setTimeout(() => { ui.exportBtn.textContent = '导出到剪贴板'; }, 2000);
        };
        
        const importUsers = async () => {
            const text = ui.importArea.value.trim();
            if (!text || !confirm('【警告】此操作将覆盖当前黑名单，确定继续吗？')) return;
            try {
                const importedData = JSON.parse(text);
                if (!Array.isArray(importedData)) throw new Error("Data is not an array.");
                await saveBlockedUsers(importedData);
                renderBlockedList();
                ui.importArea.value = '';
                alert(`成功导入 ${importedData.length} 个用户！`);
                runBlocker();
            } catch (e) {
                alert('导入失败！\n请确保粘贴的是从本脚本导出的正确JSON格式数据。');
                console.error("Import error:", e);
            }
        };

        function renderBlockedList() {
            const listElement = document.getElementById('blocked-list');
            listElement.innerHTML = '';
            const searchTerm = ui.searchBox.value.toLowerCase();
            let usersToRender = [...blockedUsersData];

            if (searchTerm) {
                usersToRender = usersToRender.filter(u => u.name.toLowerCase().includes(searchTerm) || u.note.toLowerCase().includes(searchTerm));
            }

            usersToRender.sort((a, b) => currentSort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

            if (usersToRender.length === 0) {
                listElement.innerHTML = '<li>未找到匹配的用户。</li>';
                return;
            }

            usersToRender.forEach(userObj => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="user-details">
                        <div class="user-name"></div>
                        <input type="text" class="note-input" placeholder="添加/编辑备注...">
                    </div>
                    <button class="remove-btn">移除</button>
                `;
                li.querySelector('.user-name').textContent = userObj.name;
                const noteInput = li.querySelector('.note-input');
                noteInput.value = userObj.note || '';
                
                noteInput.addEventListener('change', (e) => {
                    const userToUpdate = blockedUsersData.find(u => u.name === userObj.name);
                    if (userToUpdate) {
                        userToUpdate.note = e.target.value.trim();
                        saveBlockedUsers(blockedUsersData);
                    }
                });
                
                li.querySelector('.remove-btn').addEventListener('click', () => removeUser(userObj.name));
                listElement.appendChild(li);
            });
        }

        // [修改] openSettingsPanel
        const openSettingsPanel = () => { 
            renderBlockedList(); 
            ui.levelSelect.value = blockLevel; // [修改] 打开时, 同步当前屏蔽级别到下拉框
            ui.overlay.style.display = 'block'; 
            panel.style.display = 'flex'; 
            ui.userInput.focus(); 
        };
        const closePanel = () => { ui.overlay.style.display = 'none'; panel.style.display = 'none'; };

        ui.overlay.addEventListener('click', closePanel);
        ui.closeBtn.addEventListener('click', closePanel);
        ui.addBtn.addEventListener('click', addUser);
        ui.userInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addUser(); });
        ui.noteInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addUser(); });
        ui.importBtn.addEventListener('click', importUsers);
        ui.exportBtn.addEventListener('click', exportUsers);
        ui.searchBox.addEventListener('input', renderBlockedList);
        ui.sortAscBtn.addEventListener('click', () => { currentSort = 'asc'; renderBlockedList(); });
        ui.sortDescBtn.addEventListener('click', () => { currentSort = 'desc'; renderBlockedList(); });
        
        // [修改] 新增: 屏蔽级别下拉框的事件监听
        ui.levelSelect.addEventListener('change', async () => {
            const newLevel = ui.levelSelect.value;
            await saveBlockLevel(newLevel);
            alert('屏蔽级别已保存。请刷新页面以应用所有更改。');
            // 立即执行一次 runBlocker 尝试隐藏内容
            runBlocker();
            // 刷新是最好的, 但我们也可以先尝试就地执行
        });
    }

    // ===============================================================
    // ======================  启动与监控  ===========================
    // ===============================================================
    async function main() {
        // [修改] 调用新的加载函数
        await loadSettings();
        setupGUI();
        
        const initialRun = () => {
            runBlocker();
            injectBlockButtons();
        };
        initialRun();

        const observer = new MutationObserver(() => {
            clearTimeout(observer.timer);
            observer.timer = setTimeout(initialRun, 300);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    main();
})();
