// ==UserScript==
// @name            HWExtUser
// @namespace       HWExtUser
// @version         0.0.4
// @description     User management for Hero Wars
// @author          FatSwan
// @license         FatSwan
// @match           https://www.hero-wars.com/*
// @match           https://apps-1701433570146040.apps.fbsbx.com/*
// @grant           GM_addStyle
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/560687/HWExtUser.user.js
// @updateURL https://update.greasyfork.org/scripts/560687/HWExtUser.meta.js
// ==/UserScript==

(function() {
    console.log('%cStart Extension ' + GM_info.script.name + ', v' + GM_info.script.version + ' by ' + GM_info.script.author, 'color: red');

    this.HWExtUserVersion = GM_info.script.version;
    this.sharedWindow = window;

    // 初始化样式
    GM_addStyle(`
        /* 主容器样式 */
        .user-manager-container {
            position: fixed;
            top: 70px; /* 往下50px，原本20px + 50px */
            right: 20px;
            z-index: 10000;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 350px;
            max-height: calc(80vh - 50px);
            overflow-y: auto;
            font-family: Arial, sans-serif;
        }

        /* 关闭按钮样式 */
        .close-button-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
        }

        .close-button {
            padding: 6px 15px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }

        .close-button:hover {
            background: #545b62;
        }

        /* 开关按钮样式 */
        .user-manager-toggle {
            position: fixed;
            top: 70px; /* 往下50px */
            right: 20px;
            z-index: 9999;
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .user-manager-toggle:hover {
            background: #0056b3;
        }

        .user-manager-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .user-manager-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }

        .user-manager-btn {
            padding: 6px 12px;
            margin: 3px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }

        .user-manager-btn:hover {
            background: #0056b3;
        }

        .user-manager-btn-danger {
            background: #dc3545;
        }

        .user-manager-btn-danger:hover {
            background: #c82333;
        }

        .user-manager-btn-secondary {
            background: #6c757d;
        }

        .user-manager-btn-secondary:hover {
            background: #545b62;
        }

        .user-manager-btn-success {
            background: #28a745;
        }

        .user-manager-btn-success:hover {
            background: #218838;
        }

        .user-list {
            margin-top: 10px;
            border: 1px solid #eee;
            border-radius: 4px;
            max-height: 250px;
            overflow-y: auto;
        }

        .user-item {
            padding: 8px 10px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 13px;
            line-height: 1.4;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .user-item:last-child {
            border-bottom: none;
        }

        .user-item:hover {
            background: #f8f9fa;
        }

        .user-info {
            display: flex;
            align-items: center;
            flex: 1;
            overflow: hidden;
        }

        .user-email {
            font-weight: bold;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
        }

        .user-last-visit {
            color: #666;
            font-size: 11px;
            margin-left: 8px;
            white-space: nowrap;
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 3px;
        }

        .user-actions {
            margin-left: 10px;
            display: flex;
            gap: 5px;
        }

        .form-group {
            margin-bottom: 10px;
        }

        .form-label {
            display: block;
            margin-bottom: 3px;
            font-size: 12px;
            color: #555;
        }

        .form-input {
            width: 100%;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
        }

        .textarea-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
            font-family: monospace;
            resize: vertical;
            min-height: 60px;
        }

        .button-row {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin: 10px 0;
        }

        .button-row .user-manager-btn {
            flex: 1;
            min-width: 100px;
        }

        .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .dialog {
            background: white;
            border-radius: 8px;
            padding: 20px;
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        }

        .dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .dialog-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }

        .dialog-close-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }

        .dialog-close-button {
            padding: 6px 15px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }

        .dialog-close-button:hover {
            background: #545b62;
        }

        .dialog-body {
            margin-bottom: 20px;
        }

        .dialog-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .user-select-list {
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin: 10px 0;
        }

        .user-select-item {
            padding: 10px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .user-select-item:hover {
            background: #f0f0f0;
        }

        .user-select-item.selected {
            background: #e3f2fd;
            border-left: 3px solid #007bff;
        }

        .select-user-info {
            display: flex;
            align-items: center;
            flex: 1;
        }

        .select-user-email {
            font-weight: bold;
            color: #333;
            flex: 1;
        }

        .select-user-date {
            color: #666;
            font-size: 12px;
            margin-left: 10px;
            background: #f0f0f0;
            padding: 2px 8px;
            border-radius: 3px;
        }

        .batch-input-section {
            margin: 15px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
            border: 1px solid #dee2e6;
        }

        .batch-input-title {
            font-size: 14px;
            font-weight: bold;
            color: #495057;
            margin-bottom: 8px;
        }

        .batch-input-help {
            font-size: 11px;
            color: #6c757d;
            margin-top: 5px;
            font-style: italic;
        }

        .empty-state {
            padding: 20px;
            text-align: center;
            color: #999;
            font-style: italic;
        }

        .stats-info {
            font-size: 12px;
            color: #6c757d;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }

        .tab-container {
            margin-bottom: 15px;
        }

        .tab-buttons {
            display: flex;
            border-bottom: 1px solid #dee2e6;
        }

        .tab-button {
            padding: 8px 15px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 13px;
            color: #495057;
            border-bottom: 2px solid transparent;
        }

        .tab-button:hover {
            color: #007bff;
        }

        .tab-button.active {
            color: #007bff;
            border-bottom: 2px solid #007bff;
            font-weight: bold;
        }

        .tab-content {
            display: none;
            padding: 10px 0;
        }

        .tab-content.active {
            display: block;
        }
    `);

    // 使用localStorage的数据管理类
    class UserManager {
        constructor() {
            this.storageKey = 'user_data';
            this.users = this.loadUsers();
        }

        loadUsers() {
            try {
                const data = localStorage.getItem(this.storageKey);
                if (data) {
                    const users = JSON.parse(data);
                    // 按最近访问时间降序排序，然后按邮箱字母顺序排序
                    return this.sortUsers(users);
                }
            } catch (e) {
                console.error('加载用户数据失败:', e);
            }
            return [];
        }

        sortUsers(users) {
            return users.sort((a, b) => {
                // 首先按最近访问时间降序排序（最新的在前面）
                const dateCompare = new Date(b.lastVisit) - new Date(a.lastVisit);
                if (dateCompare !== 0) return dateCompare;

                // 如果访问时间相同，按邮箱字母顺序排序
                return a.email.localeCompare(b.email);
            });
        }

        saveUsers() {
            try {
                // 保存前排序
                this.users = this.sortUsers(this.users);
                localStorage.setItem(this.storageKey, JSON.stringify(this.users));
                return true;
            } catch (e) {
                console.error('保存用户数据失败:', e);
                return false;
            }
        }

        addUser(email, password) {
            const user = {
                email: email.trim(),
                password: password.trim(),
                lastVisit: new Date().toISOString().split('T')[0] // 保存为YYYY-MM-DD格式
            };

            // 检查email是否已存在
            const existingUser = this.users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
            if (existingUser) {
                return { success: false, message: 'Email已存在' };
            }

            this.users.push(user);
            if (this.saveUsers()) {
                return { success: true, message: '用户添加成功' };
            } else {
                this.users.pop(); // 回滚
                return { success: false, message: '保存失败' };
            }
        }

        deleteUser(email) {
            const initialLength = this.users.length;
            this.users = this.users.filter(u => u.email !== email);

            if (this.users.length < initialLength) {
                if (this.saveUsers()) {
                    return { success: true, message: '用户删除成功' };
                } else {
                    // 恢复数据
                    this.users = this.loadUsers();
                    return { success: false, message: '删除失败' };
                }
            }
            return { success: false, message: '用户不存在' };
        }

        deleteAllUsers() {
            if (this.users.length === 0) {
                return { success: false, message: '没有用户可删除' };
            }

            if (confirm(`确定要删除所有 ${this.users.length} 个用户吗？此操作不可撤销！`)) {
                this.users = [];
                if (this.saveUsers()) {
                    return { success: true, message: '已删除所有用户' };
                } else {
                    this.users = this.loadUsers();
                    return { success: false, message: '删除失败' };
                }
            }
            return { success: false, message: '操作已取消' };
        }

        batchAddUsers(userListText) {
            if (!userListText.trim()) {
                return { success: false, message: '请输入用户信息' };
            }

            const lines = userListText.split('\n').filter(line => line.trim());
            let addedCount = 0;
            let skippedCount = 0;
            let errorCount = 0;

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine) continue;

                // 解析格式：邮箱=密码
                const parts = trimmedLine.split('=');
                if (parts.length >= 2) {
                    const email = parts[0].trim();
                    const password = parts.slice(1).join('=').trim(); // 处理密码中可能包含的等号

                    if (email && password) {
                        const result = this.addUser(email, password);
                        if (result.success) {
                            addedCount++;
                        } else if (result.message === 'Email已存在') {
                            skippedCount++;
                        } else {
                            errorCount++;
                        }
                    } else {
                        errorCount++;
                    }
                } else {
                    errorCount++;
                }
            }

            this.saveUsers();

            let message = `批量添加完成！\n成功添加: ${addedCount} 个`;
            if (skippedCount > 0) message += `\n跳过(已存在): ${skippedCount} 个`;
            if (errorCount > 0) message += `\n失败(格式错误): ${errorCount} 个`;

            return {
                success: addedCount > 0,
                message: message,
                stats: { added: addedCount, skipped: skippedCount, error: errorCount }
            };
        }

        updateLastVisit(email) {
            const user = this.users.find(u => u.email === email);
            if (user) {
                user.lastVisit = new Date().toISOString().split('T')[0];
                this.saveUsers();
            }
        }

        getSortedUsers() {
            return this.sortUsers([...this.users]);
        }

        getUserByIndex(index) {
            const users = this.getSortedUsers();
            if (index - 1 > users.length) {
                return null;
            }
            return users[index - 1];
        }

        getIndexByMail(mail) {
            const users = this.getSortedUsers();
            for (let i = 0; i < users.length; i++) {
                if (mail == users[i].email) {
                    return i + 1;
                }
            }
            return -1;
        }

        getUserCount() {
            return this.users.length;
        }
    }

    // UI组件类
    class UserManagerUI {
        constructor(userManager) {
            this.userManager = userManager;
            this.container = null;
            this.dialog = null;
            this.selectedUser = null;
            this.isVisible = false;
            // 默认不显示添加用户
            this.currentTab = 'batch'; // 'single' 或 'batch'
            this.init();
        }

        init() {
            this.createContainer();
            this.createToggleButton();
            this.render();
        }

        createContainer() {
            this.container = document.createElement('div');
            this.container.className = 'user-manager-container';
            this.container.style.display = 'none'; // 初始隐藏
            document.body.appendChild(this.container);
        }

        createToggleButton() {
            this.toggleBtn = document.createElement('button');
            this.toggleBtn.className = 'user-manager-toggle';
            this.toggleBtn.textContent = '用户管理';
            document.body.appendChild(this.toggleBtn);

            this.toggleBtn.addEventListener('click', () => {
                this.toggleVisibility();
            });
        }

        toggleVisibility() {
            this.isVisible = !this.isVisible;
            this.container.style.display = this.isVisible ? 'block' : 'none';
            this.toggleBtn.textContent = this.isVisible ? '隐藏管理' : '用户管理';
        }

        render() {
            const sortedUsers = this.userManager.getSortedUsers();

            this.container.innerHTML = `
                <div class="close-button-wrapper">
                </div>
                <div class="user-manager-header">
                    <div class="user-manager-title">用户管理 (${sortedUsers.length})</div>
                    <button class="close-button" id="closePanel">关闭</button>
                </div>

                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button ${this.currentTab === 'single' ? 'active' : ''}" data-tab="single">单个添加</button>
                        <button class="tab-button ${this.currentTab === 'batch' ? 'active' : ''}" data-tab="batch">批量添加</button>
                    </div>

                    <div class="tab-content ${this.currentTab === 'single' ? 'active' : ''}" id="tab-single">
                        <div class="form-group">
                            <label class="form-label">Email:</label>
                            <input type="email" class="form-input" id="emailInput" placeholder="请输入邮箱">
                        </div>

                        <div class="form-group">
                            <label class="form-label">密码:</label>
                            <input type="text" class="form-input" id="passwordInput" placeholder="请输入密码">
                        </div>

                        <div class="button-row">
                            <button class="user-manager-btn" id="addUserBtn">添加用户</button>
                        </div>
                    </div>

                    <div class="tab-content ${this.currentTab === 'batch' ? 'active' : ''}" id="tab-batch">
                        <div class="batch-input-section">
                            <div class="batch-input-title">批量添加用户</div>
                            <textarea class="textarea-input" id="batchInput" placeholder="请输入用户列表，格式如下：&#10;user1@example.com=密码1&#10;user2@example.com=密码2&#10;user3@example.com=密码3"></textarea>
                            <div class="batch-input-help">每行一个用户，格式：邮箱=密码</div>
                        </div>

                        <div class="button-row">
                            <button class="user-manager-btn user-manager-btn-success" id="batchAddBtn">批量添加</button>
                            <button class="user-manager-btn user-manager-btn-secondary" id="batchClearBtn">清空输入</button>
                        </div>
                    </div>
                </div>

                <div class="user-list" id="userList">
                    ${sortedUsers.length === 0 ?
                        '<div class="empty-state">暂无用户数据</div>' :
                        this.renderUserList(sortedUsers)}
                </div>

                <div class="button-row">
                    <button class="user-manager-btn user-manager-btn-danger" id="deleteAllBtn" ${sortedUsers.length === 0 ? 'disabled' : ''}>
                        删除全部用户
                    </button>
                </div>

                <div class="stats-info">
                    共 ${sortedUsers.length} 个用户 | 最近更新: ${new Date().toLocaleTimeString()}
                </div>
            `;

            this.bindEvents();
        }

        renderUserList(users) {
            return users.map(user => `
                <div class="user-item">
                    <div class="user-info">
                        <div class="user-email" title="${this.escapeHtml(user.email)} - ${this.escapeHtml(user.password)}">
                            ${this.escapeHtml(user.email)}
                        </div>
                        <div class="user-last-visit" title="最近访问时间">${user.lastVisit}</div>
                    </div>
                    <div class="user-actions">
                        <button class="user-manager-btn user-manager-btn-danger"
                                data-email="${this.escapeHtml(user.email)}"
                                title="删除用户">
                            删除
                        </button>
                    </div>
                </div>
            `).join('');
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        bindEvents() {
            // 关闭面板按钮
            const closeBtn = document.getElementById('closePanel');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.toggleVisibility();
                });
            }

            // 标签页切换
            const tabButtons = this.container.querySelectorAll('.tab-button');
            tabButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tab = btn.dataset.tab;
                    this.currentTab = tab;
                    this.render();
                });
            });

            // 添加用户按钮（单个添加）
            const addBtn = document.getElementById('addUserBtn');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    this.addUser();
                });
            }

            // 输入框回车添加用户
            const emailInput = document.getElementById('emailInput');
            const passwordInput = document.getElementById('passwordInput');

            if (emailInput) {
                emailInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addUser();
                });
            }

            if (passwordInput) {
                passwordInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addUser();
                });
            }

            // 全部删除按钮
            const deleteAllBtn = document.getElementById('deleteAllBtn');
            if (deleteAllBtn) {
                deleteAllBtn.addEventListener('click', () => {
                    this.deleteAllUsers();
                });
            }

            // 批量添加按钮
            const batchAddBtn = document.getElementById('batchAddBtn');
            if (batchAddBtn) {
                batchAddBtn.addEventListener('click', () => {
                    this.batchAddUsers();
                });
            }

            // 清空批量输入按钮
            const batchClearBtn = document.getElementById('batchClearBtn');
            if (batchClearBtn) {
                batchClearBtn.addEventListener('click', () => {
                    const batchInput = document.getElementById('batchInput');
                    if (batchInput) {
                        batchInput.value = '';
                    }
                });
            }

            // 删除用户按钮（使用事件委托）
            this.container.addEventListener('click', (e) => {
                if (e.target.classList.contains('user-manager-btn-danger')) {
                    const email = e.target.dataset.email;
                    if (email) {
                        if (confirm(`确定要删除用户 ${email} 吗？`)) {
                            const result = this.userManager.deleteUser(email);
                            alert(result.message);
                            if (result.success) {
                                this.render();
                            }
                        }
                        e.stopPropagation();
                    }
                }
            });
        }

        addUser() {
            const emailInput = document.getElementById('emailInput');
            const passwordInput = document.getElementById('passwordInput');

            const email = emailInput ? emailInput.value : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!email || !password) {
                alert('请填写完整的用户信息');
                return;
            }

            // 简单的email验证
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('请输入有效的邮箱地址');
                return;
            }

            const result = this.userManager.addUser(email, password);
            alert(result.message);

            if (result.success) {
                if (emailInput) emailInput.value = '';
                if (passwordInput) passwordInput.value = '';
                this.render();
            }
        }

        deleteAllUsers() {
            const result = this.userManager.deleteAllUsers();
            alert(result.message);
            if (result.success) {
                this.render();
            }
        }

        batchAddUsers() {
            const batchInput = document.getElementById('batchInput');
            if (!batchInput) return;

            const userListText = batchInput.value;
            const result = this.userManager.batchAddUsers(userListText);

            alert(result.message);

            if (result.success && result.stats.added > 0) {
                this.render();
            }
        }

        showSelectUserDialog() {
            if (this.userManager.users.length === 0) {
                alert('暂无用户数据');
                return false;
            }
            return new Promise((resolve) => {
                this.resolvePromise = resolve;
                
                this.selectedUser = null;
                this.createDialog();
            });
        }

        createDialog() {
            // 创建遮罩层
            this.overlay = document.createElement('div');
            this.overlay.className = 'dialog-overlay';

            // 创建对话框
            this.dialog = document.createElement('div');
            this.dialog.className = 'dialog';
            this.dialog.innerHTML = `
                <div class="dialog-header">
                    <div class="dialog-title">选择用户 (${this.userManager.users.length}个)</div>
                </div>
                <div class="dialog-body">
                    <p>请从列表中选择一个用户：</p>
                    <div class="user-select-list" id="userSelectList">
                        ${this.renderUserSelectList()}
                    </div>
                </div>
                <div class="dialog-footer">
                    <button class="user-manager-btn" id="dialogCancelBtn">取消</button>
                    <button class="user-manager-btn" id="dialogOkBtn" ${this.selectedUser ? '' : 'disabled'}>确定</button>
                </div>
            `;

            this.overlay.appendChild(this.dialog);
            document.body.appendChild(this.overlay);

            this.bindDialogEvents(this.overlay);
        }

        renderUserSelectList() {
            const sortedUsers = this.userManager.getSortedUsers();
            return sortedUsers.map(user => `
                <div class="user-select-item" data-email="${this.escapeHtml(user.email)}">
                    <div class="select-user-info">
                        <div class="select-user-email">${this.escapeHtml(user.email)}</div>
                        <div class="select-user-date">${user.lastVisit}</div>
                    </div>
                </div>
            `).join('');
        }

        bindDialogEvents(overlay) {
            // // 关闭按钮
            // const dialogCloseBtn = document.getElementById('dialogCloseBtn');
            // if (dialogCloseBtn) {
            //     dialogCloseBtn.addEventListener('click', () => {
            //         document.body.removeChild(overlay);
            //     });
            // }

            // 取消按钮
            const cancelBtn = document.getElementById('dialogCancelBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.close(false);
                });
            }

            // 确定按钮
            const okBtn = document.getElementById('dialogOkBtn');
            if (okBtn) {
                okBtn.addEventListener('click', () => {
                    if (this.selectedUser) {
                        this.close(true);
                    }
                });
            }

            // 用户选择
            const selectList = document.getElementById('userSelectList');
            if (selectList) {
                selectList.addEventListener('click', (e) => {
                    const item = e.target.closest('.user-select-item');
                    if (item) {
                        // 移除之前的选择
                        const selectedItems = selectList.querySelectorAll('.selected');
                        selectedItems.forEach(i => i.classList.remove('selected'));

                        // 设置当前选择
                        item.classList.add('selected');
                        this.selectedUser = item.dataset.email;

                        // 启用确定按钮
                        if (okBtn) {
                            okBtn.disabled = false;
                        }
                    }
                });
            }

            // 点击遮罩层关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(false);
                }
            });
        }

        close(result) {
            // 移除元素
            document.body.removeChild(this.overlay);

            if (this.resolvePromise) {
                this.resolvePromise(result);
                this.resolvePromise = null;
            }
        }
    }

    // 初始化应用
    function initApp() {
        console.log('用户管理系统初始化...');

        // 等待页面加载完成
        if (document.body) {
            startApp();
        } else {
            window.addEventListener('DOMContentLoaded', startApp);
        }
    }

    function startApp() {
        console.log('启动用户管理系统');

        try {
            const userManager = new UserManager();
            const ui = new UserManagerUI(userManager);

            console.log(`加载了 ${userManager.users.length} 个用户`);

            // 全局引用，方便调试
            window.userManager = userManager;
            window.userManagerUI = ui;

            console.log('用户管理系统启动成功');
        } catch (error) {
            console.error('用户管理系统启动失败:', error);
        }
    }

    // 立即初始化
    initApp();
})();