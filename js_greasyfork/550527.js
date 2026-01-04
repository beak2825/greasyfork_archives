// ==UserScript==
// @name         登录账号密码自动填写器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动化填写登录账号密码，支持多名单管理和登录记录
// @author       You
// @match        https://iam.pt.ouchn.cn/am/UI/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550527/%E7%99%BB%E5%BD%95%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550527/%E7%99%BB%E5%BD%95%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认名单数据
    const DEFAULT_ACCOUNTS = {
        "测试组": [
            { "username": "test001", "password": "123456", "description": "测试账户1" },
            { "username": "admin", "password": "admin123", "description": "管理员账户" }
        ]
    };

    // 存储管理器
    class StorageManager {
        static getAccountGroups() {
            const stored = localStorage.getItem('login_account_groups');
            return stored ? JSON.parse(stored) : DEFAULT_ACCOUNTS;
        }

        static saveAccountGroups(groups) {
            localStorage.setItem('login_account_groups', JSON.stringify(groups));
        }

        static getLoginRecords() {
            const stored = localStorage.getItem('login_records');
            return stored ? JSON.parse(stored) : {};
        }

        static saveLoginRecords(records) {
            localStorage.setItem('login_records', JSON.stringify(records));
        }

        static incrementLoginCount(username) {
            const records = this.getLoginRecords();
            records[username] = (records[username] || 0) + 1;
            this.saveLoginRecords(records);
            return records[username];
        }

        static getLoginCount(username) {
            const records = this.getLoginRecords();
            return records[username] || 0;
        }
    }

    // 主控制面板
    class LoginAutoFiller {
        constructor() {
            this.currentGroup = null;
            this.selectedAccount = null;
            this.isVisible = false;
            this.createPanel();
            this.bindEvents();
            // 自动打开面板
            this.showPanel();
        }

        createPanel() {
            // 创建主面板
            this.panel = document.createElement('div');
            this.panel.id = 'login-autofill-panel';
            this.panel.innerHTML = `
                <div class="panel-header">
                    <h3>登录自动填写器</h3>
                    <button class="close-btn">×</button>
                </div>
                <div class="panel-content">
                    <div class="section">
                        <h4>名单管理</h4>
                        <div class="group-selector">
                            <select id="group-select">
                                <option value="">选择名单组</option>
                            </select>
                            <button id="import-btn">导入名单</button>
                            <button id="export-btn">导出JSON</button>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h4>账户选择</h4>
                        <div id="account-list" class="account-list">
                            <p>请先选择名单组</p>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h4>操作</h4>
                        <button id="fill-btn" disabled>填写选中账户</button>
                        <button id="clear-records-btn">清除登录记录</button>
                    </div>
                </div>
            `;

            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                #login-autofill-panel {
                    position: fixed;
                    top: 50px;
                    right: 20px;
                    width: 350px;
                    background: #fff;
                    border: 2px solid #007bff;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    display: none;
                }
                
                #login-autofill-panel .panel-header {
                    background: #007bff;
                    color: white;
                    padding: 12px 15px;
                    border-radius: 6px 6px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                #login-autofill-panel .panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                }
                
                #login-autofill-panel .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                #login-autofill-panel .panel-content {
                    padding: 15px;
                    max-height: 500px;
                    overflow-y: auto;
                }
                
                #login-autofill-panel .section {
                    margin-bottom: 20px;
                }
                
                #login-autofill-panel .section h4 {
                    margin: 0 0 10px 0;
                    color: #333;
                    font-size: 14px;
                }
                
                #login-autofill-panel .group-selector {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 10px;
                    flex-wrap: wrap;
                }
                
                #login-autofill-panel select {
                    flex: 1;
                    min-width: 120px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 12px;
                }
                
                #login-autofill-panel button {
                    padding: 6px 12px;
                    background: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    white-space: nowrap;
                }
                
                #login-autofill-panel button:hover {
                    background: #0056b3;
                }
                
                #login-autofill-panel button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                
                #login-autofill-panel .account-list {
                    max-height: 300px;
                    overflow-y: auto;
                    border: 1px solid #eee;
                    border-radius: 4px;
                    padding: 8px;
                }
                
                #login-autofill-panel .account-item {
                    display: flex;
                    flex-direction: column;
                    padding: 12px;
                    margin-bottom: 8px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: #ffffff;
                }
                
                #login-autofill-panel .account-item:hover {
                    background-color: #f8f9fa;
                    border-color: #007bff;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                #login-autofill-panel .account-item.selected {
                    background-color: #e3f2fd;
                    border-color: #007bff;
                    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
                }
                
                #login-autofill-panel .account-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                #login-autofill-panel .account-info {
                    flex: 1;
                }
                
                #login-autofill-panel .account-username {
                    font-weight: bold;
                    color: #333;
                    font-size: 13px;
                    margin-bottom: 2px;
                }
                
                #login-autofill-panel .account-password {
                    color: #666;
                    font-size: 12px;
                    font-family: monospace;
                    background: #f8f9fa;
                    padding: 2px 6px;
                    border-radius: 3px;
                    margin-bottom: 4px;
                    word-break: break-all;
                }
                
                #login-autofill-panel .account-description {
                    color: #888;
                    font-size: 11px;
                    font-style: italic;
                }
                
                #login-autofill-panel .login-count {
                    background: #28a745;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 10px;
                    margin-left: 8px;
                }
                
                #login-autofill-panel .login-count.used {
                    background: #ffc107;
                    color: #333;
                }
                
                #login-autofill-panel .account-item.used {
                    opacity: 0.8;
                    border-color: #ffc107;
                }
                
                #login-autofill-toggle {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    background: #007bff;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    z-index: 9999;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                #login-autofill-toggle:hover {
                    background: #0056b3;
                }
                
                /* 导入弹窗样式 */
                #import-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 11000;
                    display: none;
                    justify-content: center;
                    align-items: center;
                }
                
                #import-modal .modal-content {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    width: 500px;
                    max-width: 90vw;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }
                
                #import-modal .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }
                
                #import-modal .modal-header h3 {
                    margin: 0;
                    color: #333;
                }
                
                #import-modal .close-modal {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                }
                
                #import-modal .form-group {
                    margin-bottom: 15px;
                }
                
                #import-modal .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #333;
                }
                
                #import-modal .form-group input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                }
                
                #import-modal .form-group textarea {
                    width: 100%;
                    height: 200px;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 12px;
                    font-family: monospace;
                    resize: vertical;
                    box-sizing: border-box;
                }
                
                #import-modal .modal-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                }
                
                #import-modal .modal-buttons button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }
                
                #import-modal .btn-primary {
                    background: #007bff;
                    color: white;
                }
                
                #import-modal .btn-primary:hover {
                    background: #0056b3;
                }
                
                #import-modal .btn-secondary {
                    background: #6c757d;
                    color: white;
                }
                
                #import-modal .btn-secondary:hover {
                    background: #545b62;
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(this.panel);

            // 创建导入弹窗
            this.createImportModal();

            // 创建切换按钮
            this.toggleBtn = document.createElement('button');
            this.toggleBtn.id = 'login-autofill-toggle';
            this.toggleBtn.innerHTML = '🔑';
            this.toggleBtn.title = '打开登录自动填写器';
            document.body.appendChild(this.toggleBtn);

            this.loadGroupOptions();
        }

        createImportModal() {
            this.importModal = document.createElement('div');
            this.importModal.id = 'import-modal';
            this.importModal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>导入名单</h3>
                        <button class="close-modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="group-name-input">名单组名称：</label>
                            <input type="text" id="group-name-input" placeholder="请输入名单组名称（如：2024级新生）">
                        </div>
                        <div class="form-group">
                            <label for="json-content-input">JSON数据：</label>
                            <textarea id="json-content-input" placeholder='请输入JSON格式的账户数据，格式如下：
[
    {"username": "学号1", "password": "密码1", "description": "姓名1 (性别)"},
    {"username": "学号2", "password": "密码2", "description": "姓名2 (性别)"}
]'></textarea>
                        </div>
                        <div class="form-group">
                            <small style="color: #666;">
                                提示：可以输入账户数组格式的JSON数据，每个账户包含username（用户名）、password（密码）和description（描述）字段。
                            </small>
                        </div>
                    </div>
                    <div class="modal-buttons">
                        <button class="btn-secondary" id="cancel-import">取消</button>
                        <button class="btn-primary" id="confirm-import">导入</button>
                    </div>
                </div>
            `;
            document.body.appendChild(this.importModal);
        }

        bindEvents() {
            // 切换面板显示
            this.toggleBtn.addEventListener('click', () => {
                this.togglePanel();
            });

            // 关闭面板
            this.panel.querySelector('.close-btn').addEventListener('click', () => {
                this.hidePanel();
            });

            // 组选择
            const groupSelect = document.getElementById('group-select');
            groupSelect.addEventListener('change', (e) => {
                this.selectGroup(e.target.value);
            });

            // 导入名单
            document.getElementById('import-btn').addEventListener('click', () => {
                this.showImportModal();
            });

            // 导入弹窗事件
            this.importModal.querySelector('.close-modal').addEventListener('click', () => {
                this.hideImportModal();
            });

            document.getElementById('cancel-import').addEventListener('click', () => {
                this.hideImportModal();
            });

            document.getElementById('confirm-import').addEventListener('click', () => {
                this.confirmImport();
            });

            // 点击弹窗外部关闭
            this.importModal.addEventListener('click', (e) => {
                if (e.target === this.importModal) {
                    this.hideImportModal();
                }
            });

            // 导出JSON
            document.getElementById('export-btn').addEventListener('click', () => {
                this.exportJSON();
            });

            // 填写按钮
            document.getElementById('fill-btn').addEventListener('click', () => {
                this.fillLoginForm();
            });

            // 清除记录
            document.getElementById('clear-records-btn').addEventListener('click', () => {
                this.clearLoginRecords();
            });
        }

        loadGroupOptions() {
            const groups = StorageManager.getAccountGroups();
            const groupSelect = document.getElementById('group-select');

            // 清空现有选项
            groupSelect.innerHTML = '<option value="">选择名单组</option>';

            // 添加组选项
            Object.keys(groups).forEach(groupName => {
                const option = document.createElement('option');
                option.value = groupName;
                option.textContent = `${groupName} (${groups[groupName].length}个账户)`;
                groupSelect.appendChild(option);
            });
        }

        selectGroup(groupName) {
            if (!groupName) {
                this.currentGroup = null;
                this.updateAccountList([]);
                return;
            }

            const groups = StorageManager.getAccountGroups();
            this.currentGroup = groupName;

            // 获取去重后的账户列表
            const accounts = groups[groupName] || [];
            const uniqueAccounts = this.getUniqueAccounts(accounts);

            this.updateAccountList(uniqueAccounts);
        }

        getUniqueAccounts(accounts) {
            const seen = new Set();
            const unique = [];

            accounts.forEach(account => {
                const key = `${account.username}_${account.password}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    unique.push(account);
                }
            });

            return unique;
        }

        updateAccountList(accounts) {
            const accountList = document.getElementById('account-list');

            if (accounts.length === 0) {
                accountList.innerHTML = '<p>该组没有账户数据</p>';
                document.getElementById('fill-btn').disabled = true;
                return;
            }

            // 按登录次数排序：未登录的优先显示
            const sortedAccounts = accounts.map((account, originalIndex) => ({
                ...account,
                originalIndex,
                loginCount: StorageManager.getLoginCount(account.username)
            })).sort((a, b) => {
                // 未登录的(loginCount=0)排在前面，已登录的按次数升序排列
                if (a.loginCount === 0 && b.loginCount === 0) return 0;
                if (a.loginCount === 0) return -1;
                if (b.loginCount === 0) return 1;
                return a.loginCount - b.loginCount;
            });

            accountList.innerHTML = '';

            sortedAccounts.forEach((account, index) => {
                const isUsed = account.loginCount > 0;

                const accountItem = document.createElement('div');
                accountItem.className = `account-item${isUsed ? ' used' : ''}`;
                accountItem.dataset.index = account.originalIndex;

                const countText = account.loginCount === 0 ? '未登录' : `${account.loginCount}次`;
                const countClass = isUsed ? 'login-count used' : 'login-count';

                accountItem.innerHTML = `
                    <div class="account-header">
                        <div class="account-info">
                            <div class="account-username">账号: ${account.username}</div>
                        </div>
                        <div class="${countClass}">${countText}</div>
                    </div>
                    <div class="account-password">密码: ${account.password}</div>
                    <div class="account-description">${account.description || '无描述'}</div>
                `;

                accountItem.addEventListener('click', () => {
                    this.selectAccount(account, accountItem);
                });

                accountList.appendChild(accountItem);
            });
        }

        selectAccount(account, element) {
            // 移除其他选中状态
            document.querySelectorAll('.account-item').forEach(item => {
                item.classList.remove('selected');
            });

            // 选中当前账户
            element.classList.add('selected');
            this.selectedAccount = account;
            document.getElementById('fill-btn').disabled = false;
        }

        fillLoginForm() {
            if (!this.selectedAccount) {
                alert('请先选择一个账户');
                return;
            }

            // 查找登录表单元素
            const usernameInput = document.getElementById('loginName') ||
                document.querySelector('input[type="text"][placeholder*="登录名"]') ||
                document.querySelector('input[name="username"]') ||
                document.querySelector('input[name="loginName"]');

            const passwordInput = document.getElementById('password') ||
                document.querySelector('input[type="password"][placeholder*="密码"]') ||
                document.querySelector('input[name="password"]');

            if (!usernameInput || !passwordInput) {
                alert('未找到登录表单，请确保页面包含用户名和密码输入框');
                return;
            }

            // 填写表单
            usernameInput.value = this.selectedAccount.username;
            passwordInput.value = this.selectedAccount.password;

            // 显示密码内容
            this.makePasswordVisible(passwordInput);

            // 触发change事件
            usernameInput.dispatchEvent(new Event('change', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
            usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

            // 增加登录计数
            const newCount = StorageManager.incrementLoginCount(this.selectedAccount.username);

            // 更新显示的计数
            const selectedItem = document.querySelector('.account-item.selected');
            if (selectedItem) {
                const countElement = selectedItem.querySelector('.login-count');
                countElement.textContent = `${newCount}次`;
            }

            // 检查并勾选同意协议
            const agreeCheckbox = document.getElementById('agreeCheckBox');
            if (agreeCheckbox && !agreeCheckbox.checked) {
                agreeCheckbox.checked = true;
                agreeCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            }

            console.log(`已填写账户: ${this.selectedAccount.username}, 登录次数: ${newCount}`);

            // 可选：自动点击登录按钮
            // const loginBtn = document.getElementById('form_button');
            // if (loginBtn) {
            //     setTimeout(() => loginBtn.click(), 500);
            // }
        }

        makePasswordVisible(passwordInput) {
            if (!passwordInput) return;

            // 如果已经是text类型，则不需要处理
            if (passwordInput.type === 'text') return;

            try {
                // 方法1：直接修改type属性
                passwordInput.type = 'text';

                // 添加视觉提示样式
                passwordInput.style.backgroundColor = '#fff9e6';
                passwordInput.style.border = '2px solid #ffc107';

                // 如果直接修改type失败，尝试其他方法
                if (passwordInput.type !== 'text') {
                    // 方法2：创建新的text输入框替换
                    this.replacePasswordInput(passwordInput);
                }

                // 添加提示信息
                this.addPasswordVisibilityIndicator(passwordInput);

            } catch (error) {
                console.log('密码显示失败，尝试替换方法:', error);
                this.replacePasswordInput(passwordInput);
            }
        }

        replacePasswordInput(passwordInput) {
            try {
                // 创建新的text输入框
                const newInput = document.createElement('input');
                newInput.type = 'text';
                newInput.value = passwordInput.value;
                newInput.id = passwordInput.id;
                newInput.className = passwordInput.className;
                newInput.name = passwordInput.name;
                newInput.placeholder = passwordInput.placeholder;
                newInput.style.cssText = passwordInput.style.cssText;
                newInput.style.backgroundColor = '#fff9e6';
                newInput.style.border = '2px solid #ffc107';

                // 复制所有属性
                Array.from(passwordInput.attributes).forEach(attr => {
                    if (attr.name !== 'type') {
                        newInput.setAttribute(attr.name, attr.value);
                    }
                });

                // 替换元素
                passwordInput.parentNode.replaceChild(newInput, passwordInput);

                // 添加提示信息
                this.addPasswordVisibilityIndicator(newInput);

                console.log('密码输入框已替换为可见模式');
            } catch (error) {
                console.error('替换密码输入框失败:', error);
            }
        }

        addPasswordVisibilityIndicator(inputElement) {
            // 检查是否已经添加过提示
            const existingIndicator = inputElement.parentNode.querySelector('.password-visible-indicator');
            if (existingIndicator) return;

            // 创建提示元素
            const indicator = document.createElement('div');
            indicator.className = 'password-visible-indicator';
            indicator.innerHTML = '👁️ 密码已显示';
            indicator.style.cssText = `
                position: absolute;
                top: -25px;
                right: 0;
                background: #ffc107;
                color: #333;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                z-index: 1000;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;

            // 确保父元素有相对定位
            const parent = inputElement.parentNode;
            if (getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }

            // 添加提示元素
            parent.appendChild(indicator);

            // 3秒后自动隐藏提示
            setTimeout(() => {
                if (indicator && indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 3000);
        }

        showImportModal() {
            this.importModal.style.display = 'flex';
            // 清空表单
            document.getElementById('group-name-input').value = '';
            document.getElementById('json-content-input').value = '';
        }

        hideImportModal() {
            this.importModal.style.display = 'none';
        }

        confirmImport() {
            const groupName = document.getElementById('group-name-input').value.trim();
            const jsonContent = document.getElementById('json-content-input').value.trim();

            if (!groupName) {
                alert('请输入名单组名称');
                return;
            }

            if (!jsonContent) {
                alert('请输入JSON数据');
                return;
            }

            try {
                const accountsData = JSON.parse(jsonContent);

                // 验证数据格式
                if (!Array.isArray(accountsData)) {
                    throw new Error('JSON数据必须是数组格式');
                }

                // 验证每个账户对象
                for (let i = 0; i < accountsData.length; i++) {
                    const account = accountsData[i];
                    if (!account.username || !account.password) {
                        throw new Error(`第${i + 1}个账户缺少username或password字段`);
                    }
                }

                // 获取现有数据并添加新组
                const currentGroups = StorageManager.getAccountGroups();
                currentGroups[groupName] = accountsData;

                StorageManager.saveAccountGroups(currentGroups);
                this.loadGroupOptions();

                // 自动选择新导入的组
                const groupSelect = document.getElementById('group-select');
                groupSelect.value = groupName;
                this.selectGroup(groupName);

                this.hideImportModal();
                alert(`成功导入名单组"${groupName}"，包含${accountsData.length}个账户！`);

            } catch (error) {
                alert(`导入失败: ${error.message}`);
            }
        }

        exportJSON() {
            const groups = StorageManager.getAccountGroups();
            const jsonStr = JSON.stringify(groups, null, 2);

            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `login_accounts_${new Date().getTime()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        clearLoginRecords() {
            if (confirm('确定要清除所有登录记录吗？')) {
                StorageManager.saveLoginRecords({});

                // 更新显示
                if (this.currentGroup) {
                    this.selectGroup(this.currentGroup);
                }

                alert('登录记录已清除');
            }
        }

        togglePanel() {
            if (this.isVisible) {
                this.hidePanel();
            } else {
                this.showPanel();
            }
        }

        showPanel() {
            this.panel.style.display = 'block';
            this.isVisible = true;
        }

        hidePanel() {
            this.panel.style.display = 'none';
            this.isVisible = false;
        }
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new LoginAutoFiller();
        });
    } else {
        new LoginAutoFiller();
    }

})();
